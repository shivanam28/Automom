const NVIDIA_API_URL = "https://integrate.api.nvidia.com/v1/chat/completions";

// Ordered by preference, but also deliberately spread across three
// different providers (DeepSeek, Mistral, Meta). NVIDIA's free tier
// rate-limits per model (~40 req/min shared across ALL free users of
// that model), so flagship/popular models saturate fastest. Llama 3.3
// 70B is a smaller, less-hyped model that's usually less contested —
// it exists here purely as a resilience valve, not a quality downgrade.
const MODEL_FALLBACK_CHAIN = [
  "deepseek-ai/deepseek-v4-flash",
  "mistralai/mistral-medium-3.5-128b",
  "meta/llama-3.3-70b-instruct",
];

// How long to wait for the primary model before also firing the fallback
// in parallel. Both are free, so racing costs nothing but a bit of
// wasted compute on whichever one loses — a fair trade for latency.
const STAGGER_DELAY_MS = 4000;

// Hard ceiling per individual request. Prevents a hung connection from
// blocking the whole pipeline indefinitely.
const REQUEST_TIMEOUT_MS = 45000;

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

async function callModel(
  model: string,
  messages: ChatMessage[],
  apiKey: string
): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const startedAt = Date.now();
  console.log(`→ [${model}] request sent`);

  try {
    const response = await fetch(NVIDIA_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.3,
        max_tokens: 3072,
        stream: false,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.warn(`✗ [${model}] failed after ${Date.now() - startedAt}ms (${response.status})`);
      const error = new Error(`${model} error (${response.status}): ${errorBody}`);
      (error as Error & { status?: number }).status = response.status;
      throw error;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error(`${model} returned an empty response.`);
    }

    console.log(`✓ [${model}] WON the race — responded in ${Date.now() - startedAt}ms`);
    return content;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Races the fallback chain instead of trying models purely sequentially.
 * The primary model gets a head start (STAGGER_DELAY_MS); if it hasn't
 * responded by then, the next model fires too, and whichever succeeds
 * first wins. This turns "wait for a queue, then wait for the next queue"
 * into "run in parallel, take the fastest success" — since these are
 * free endpoints, there's no cost downside to the redundant call.
 */
async function raceModelChain(
  messages: ChatMessage[],
  apiKey: string,
  stagger: number
): Promise<string> {
  const attempts = MODEL_FALLBACK_CHAIN.map(
    (model, index) =>
      new Promise<string>((resolve, reject) => {
        setTimeout(() => {
          callModel(model, messages, apiKey).then(resolve, reject);
        }, index * stagger);
      })
  );

  return Promise.any(attempts);
}

export async function callLLM(
  messages: ChatMessage[],
  options?: { raceImmediately?: boolean }
): Promise<string> {
  const apiKey = process.env.NVIDIA_API_KEY;

  if (!apiKey) {
    throw new Error(
      "NVIDIA_API_KEY is not set. Add it to your .env.local file."
    );
  }

  const stagger = options?.raceImmediately ? 0 : STAGGER_DELAY_MS;

  try {
    return await raceModelChain(messages, apiKey, stagger);
  } catch (firstAggregateError) {
    const firstErrors = (firstAggregateError as AggregateError).errors as Error[];
    console.warn(
      "First attempt: all models failed, retrying once after 5s...",
      firstErrors.map((e) => e.message)
    );

    // Free-tier capacity issues are often transient — give it one more
    // shot after a short cooldown before surfacing a real failure.
    await new Promise((r) => setTimeout(r, 5000));

    try {
      return await raceModelChain(messages, apiKey, stagger);
    } catch (secondAggregateError) {
      const errors = (secondAggregateError as AggregateError).errors as Error[];
      console.error("Second attempt also failed:", errors.map((e) => e.message));

      // Surface the actual underlying reason instead of a generic message,
      // so the real cause (bad key, rate limit, model error) is visible
      // in the UI instead of only in the server console.
      const uniqueReasons = [...new Set(errors.map((e) => e.message))];
      throw new Error(
        `All models failed. Details: ${uniqueReasons.join(" | ")}`
      );
    }
  }
}
