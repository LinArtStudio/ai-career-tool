
import pdf from "pdf-parse";

export async function parseResume(buffer: Buffer): Promise<string> {
  try {
    const data = await pdf(buffer);
    return data.text;
  } catch {
    throw new Error("无法解析此PDF文件，请确保文件未加密且格式正确");
  }
}
