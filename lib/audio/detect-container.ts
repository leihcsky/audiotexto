import type { Container } from "./types";

export function detectContainer(buffer: Uint8Array): Container | null {
  if (buffer.length < 12) return null;

  const riff = ascii(buffer, 0, 4);
  const wave = ascii(buffer, 8, 12);
  if (riff === "RIFF" && wave === "WAVE") return "wav";

  if (ascii(buffer, 4, 8) === "ftyp") return "mp4";

  if (
    buffer[0] === 0x1a &&
    buffer[1] === 0x45 &&
    buffer[2] === 0xdf &&
    buffer[3] === 0xa3
  ) {
    return "webm";
  }

  if (ascii(buffer, 0, 3) === "ID3") return "mpeg";

  if (buffer[0] === 0xff && (buffer[1] & 0xe0) === 0xe0) return "mpeg";

  return null;
}

function ascii(buffer: Uint8Array, start: number, end: number) {
  return String.fromCharCode(...buffer.subarray(start, end));
}
