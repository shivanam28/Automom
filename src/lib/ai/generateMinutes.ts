import { callLLM } from "@/lib/ai/llmClient";
import {
  MEETING_MINUTES_SYSTEM_PROMPT,
  buildUserPrompt,
} from "@/prompts/meetingMinutesPrompt";
import { meetingMinutesSchema, type MeetingMinutes } from "@/types/meeting";

// Roughly 4 characters per token as a rule of thumb. This cap keeps us
// comfortably within context limits and, more importantly, out of the
// "so many input tokens the free-tier queue times us out" zone. A real
// 1-hour meeting transcript is typically well under this.
const MAX_TRANSCRIPT_CHARS = 40000;

// Above this size, we skip the "give the primary model a head start"
// optimization and race everything immediately — on a large request,
// every second of stagger delay is a second added to total latency.
const IMMEDIATE_RACE_THRESHOLD_CHARS = 15000;

export async function generateMinutes(
  transcript: string
): Promise<MeetingMinutes> {
  if (transcript.length > MAX_TRANSCRIPT_CHARS) {
    throw new Error(
      `This transcript is too long to process in one request (${transcript.length.toLocaleString()} characters, limit ${MAX_TRANSCRIPT_CHARS.toLocaleString()}). Long-transcript chunking support is coming soon.`
    );
  }

  const rawResponse = await callLLM(
    [
      { role: "system", content: MEETING_MINUTES_SYSTEM_PROMPT },
      { role: "user", content: buildUserPrompt(transcript) },
    ],
    { raceImmediately: transcript.length > IMMEDIATE_RACE_THRESHOLD_CHARS }
  );

  // Some models wrap JSON in ```json fences despite instructions not to.
  // Strip them defensively before attempting to parse.
  const cleaned = rawResponse
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(
      "The AI returned a response that wasn't valid JSON. Please try again."
    );
  }

  // This is the checkpoint: even though we parsed valid JSON, we haven't
  // confirmed it has the right shape. A model can return valid JSON that's
  // still missing fields or has the wrong types.
  const result = meetingMinutesSchema.safeParse(parsed);

  if (!result.success) {
    console.error("Zod validation failed:", result.error.flatten());
    throw new Error(
      "The AI response didn't match the expected format. Please try again."
    );
  }

  return result.data;
}
