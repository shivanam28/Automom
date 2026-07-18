import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import type { MeetingMinutes } from "@/types/meeting";

const PAGE_WIDTH = 595; // A4 in points
const PAGE_HEIGHT = 842;
const MARGIN = 50;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

const BRAND_COLOR = rgb(0.23, 0.44, 0.93); // matches the app's brand-500
const TEXT_COLOR = rgb(0.13, 0.16, 0.22); // slate-800ish
const MUTED_COLOR = rgb(0.45, 0.5, 0.58); // slate-500ish

/**
 * pdf-lib draws text on a single line with no wrapping — it's a low-level
 * drawing library, not a layout engine. This measures each word against
 * the font at the given size and breaks lines manually to fit maxWidth.
 */
function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const candidate = currentLine ? `${currentLine} ${word}` : word;
    const width = font.widthOfTextAtSize(candidate, size);

    if (width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = candidate;
    }
  }

  if (currentLine) lines.push(currentLine);
  return lines;
}

/**
 * Tracks the current page and vertical cursor position, and transparently
 * starts a new page when content would overflow the bottom margin. This
 * is the pagination pdf-lib doesn't provide out of the box.
 */
class PdfCursor {
  doc: PDFDocument;
  page: PDFPage;
  y: number;

  constructor(doc: PDFDocument, page: PDFPage) {
    this.doc = doc;
    this.page = page;
    this.y = PAGE_HEIGHT - MARGIN;
  }

  ensureSpace(neededHeight: number) {
    if (this.y - neededHeight < MARGIN) {
      this.page = this.doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      this.y = PAGE_HEIGHT - MARGIN;
    }
  }

  drawHeading(text: string, font: PDFFont, size = 13) {
    this.ensureSpace(size + 14);
    this.y -= size;
    this.page.drawText(text.toUpperCase(), {
      x: MARGIN,
      y: this.y,
      size,
      font,
      color: BRAND_COLOR,
    });
    this.y -= 10;
  }

  drawParagraph(text: string, font: PDFFont, size = 10.5, lineHeight = 15) {
    const lines = wrapText(text, font, size, CONTENT_WIDTH);
    for (const line of lines) {
      this.ensureSpace(lineHeight);
      this.y -= lineHeight;
      this.page.drawText(line, { x: MARGIN, y: this.y, size, font, color: TEXT_COLOR });
    }
    this.y -= 6;
  }

  drawBulletList(items: string[], font: PDFFont, size = 10.5, lineHeight = 15) {
    if (items.length === 0) {
      this.ensureSpace(lineHeight);
      this.y -= lineHeight;
      this.page.drawText("None recorded.", {
        x: MARGIN,
        y: this.y,
        size,
        font,
        color: MUTED_COLOR,
      });
      this.y -= 10;
      return;
    }

    const bulletIndent = 14;
    for (const item of items) {
      const lines = wrapText(item, font, size, CONTENT_WIDTH - bulletIndent);
      lines.forEach((line, i) => {
        this.ensureSpace(lineHeight);
        this.y -= lineHeight;
        if (i === 0) {
          this.page.drawText("\u2022", { x: MARGIN, y: this.y, size, font, color: BRAND_COLOR });
        }
        this.page.drawText(line, {
          x: MARGIN + bulletIndent,
          y: this.y,
          size,
          font,
          color: TEXT_COLOR,
        });
      });
    }
    this.y -= 8;
  }
}

export async function generateMinutesPdf(minutes: MeetingMinutes): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.setTitle(minutes.meeting_title || "Meeting Minutes");
  doc.setProducer("Automom");

  const font = await doc.embedFont(StandardFonts.Helvetica);
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);

  const page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  const cursor = new PdfCursor(doc, page);

  // Title — wrapped the same way as body text, since a long meeting
  // title at 20pt bold can easily exceed the page width otherwise.
  const titleText = minutes.meeting_title || "Untitled Meeting";
  const titleLines = wrapText(titleText, boldFont, 20, CONTENT_WIDTH);
  for (const line of titleLines) {
    cursor.ensureSpace(24);
    cursor.y -= 24;
    cursor.page.drawText(line, {
      x: MARGIN,
      y: cursor.y,
      size: 20,
      font: boldFont,
      color: TEXT_COLOR,
    });
  }

  // Date subtitle
  if (minutes.meeting_datetime) {
    cursor.y -= 20;
    cursor.page.drawText(minutes.meeting_datetime, {
      x: MARGIN,
      y: cursor.y,
      size: 11,
      font,
      color: MUTED_COLOR,
    });
  }

  // Divider line
  cursor.y -= 14;
  cursor.page.drawLine({
    start: { x: MARGIN, y: cursor.y },
    end: { x: PAGE_WIDTH - MARGIN, y: cursor.y },
    thickness: 1,
    color: rgb(0.9, 0.9, 0.92),
  });
  cursor.y -= 20;

  cursor.drawHeading("Executive Summary", boldFont);
  cursor.drawParagraph(minutes.summary || "No summary available.", font);

  cursor.drawHeading("Key Decisions", boldFont);
  cursor.drawBulletList(minutes.decisions, font);

  cursor.drawHeading("Action Items", boldFont);
  cursor.drawBulletList(minutes.action_items, font);

  if (minutes.keywords.length > 0) {
    cursor.drawHeading("Keywords", boldFont);
    cursor.drawParagraph(minutes.keywords.join("  \u00b7  "), font, 10, 15);
  }

  // Footer on every page
  const pageCount = doc.getPageCount();
  for (let i = 0; i < pageCount; i++) {
    const p = doc.getPage(i);
    p.drawText(`Generated by Automom  \u2022  Page ${i + 1} of ${pageCount}`, {
      x: MARGIN,
      y: 30,
      size: 8,
      font,
      color: MUTED_COLOR,
    });
  }

  return doc.save();
}
