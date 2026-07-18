import { NextResponse } from "next/server";
import { meetingMinutesSchema } from "@/types/meeting";
import { generateMinutesPdf } from "@/lib/pdf/generateMinutesPdf";

export const runtime = "nodejs"; // pdf-lib needs Node, not Edge

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = meetingMinutesSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid meeting minutes data." },
        { status: 400 }
      );
    }

    const pdfBytes = await generateMinutesPdf(parsed.data);
    const safeTitle = (parsed.data.meeting_title || "meeting-minutes")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .slice(0, 50);

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${safeTitle}.pdf"`,
      },
    });
  } catch (err) {
    console.error("PDF generation failed:", err);
    return NextResponse.json(
      { error: "Failed to generate PDF." },
      { status: 500 }
    );
  }
}
