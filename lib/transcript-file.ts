export function transcriptFileContents(text: string) {
  const withoutBom = text.replace(/^\uFEFF/, "");
  return `\uFEFF${withoutBom}`;
}

export const TRANSCRIPT_FILE_NAME = "transcripcion.txt";
