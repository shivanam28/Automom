import { NextResponse } from "next/server";
import { validateFile } from "@/lib/validation";
import { extractText } from "@/lib/parsing/extractText";

// mammoth needs Node APIs (Buffer, zip parsing) — the Edge runtime
// doesn't support these, so we pin this route to Node explicitly.
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file was provided." },
        { status: 400 }
      );
    }

    const validation = validateFile({
      name: file.name,
      size: file.size,
      type: file.type,
    });

    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const text = await extractText(buffer, file.name);

    if (!text) {
      return NextResponse.json(
        { error: "Could not find any readable text in this file." },
        { status: 400 }
      );
    }

    return NextResponse.json({ text, filename: file.name });
  } catch (err) {
    console.error("Upload processing failed:", err);
    return NextResponse.json(
      { error: "Something went wrong while processing the file." },
      { status: 500 }
    );
  }
}
