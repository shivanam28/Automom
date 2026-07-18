import mammoth from "mammoth";

/**
 * Extracts raw plain text from an uploaded file buffer.
 * .docx files are unzipped and parsed by mammoth (which strips
 * Word's XML markup down to readable text). .txt files are
 * decoded directly since no markup is involved.
 */
export async function extractText(
  buffer: Buffer,
  filename: string
): Promise<string> {
  const extension = filename.slice(filename.lastIndexOf(".")).toLowerCase();

  if (extension === ".docx") {
    const result = await mammoth.extractRawText({ buffer });
    return result.value.trim();
  }

  if (extension === ".txt") {
    return buffer.toString("utf-8").trim();
  }

  throw new Error(`Unsupported file extension: ${extension}`);
}
