import { NextResponse } from "next/server";
import { z } from "zod";
import { generateMinutes } from "@/lib/ai/generateMinutes";

const requestSchema = z.object({
  text: z.string().min(1, "Transcript text is required."),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsedBody = requestSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        { error: parsedBody.error.issues[0]?.message ?? "Invalid request." },
        { status: 400 }
      );
    }

    const minutes = await generateMinutes(parsedBody.data.text);
    return NextResponse.json(minutes);
  } catch (err) {
    console.error("Generate minutes failed:", err);
    const message =
      err instanceof Error ? err.message : "Failed to generate minutes.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
