import assert from "node:assert/strict";
import test from "node:test";
import { validateAudio } from "../lib/audio/validate-audio";

const limits = { maxBytes: 1024 * 1024, maxDurationSeconds: 600 };

test("accepts a short wav and reads its duration", async () => {
  const wav = makeWav(1.5, 8000);
  const result = await validateAudio(
    { buffer: wav, fileName: "nota.wav", mimeType: "audio/wav", byteLength: wav.length },
    limits,
  );
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.container, "wav");
    assert.ok(Math.abs(result.durationSeconds - 1.5) < 0.05);
  }
});

test("rejects empty, oversized, mismatched and overlong audio", async () => {
  const empty = await validateAudio(
    { buffer: Buffer.alloc(0), fileName: "nota.wav", mimeType: "audio/wav", byteLength: 0 },
    limits,
  );
  assert.deepEqual(empty, { ok: false, code: "empty_file" });

  const wav = makeWav(1, 8000);
  const oversized = await validateAudio(
    { buffer: wav, fileName: "nota.wav", mimeType: "audio/wav", byteLength: wav.length },
    { maxBytes: 50, maxDurationSeconds: 600 },
  );
  assert.deepEqual(oversized, { ok: false, code: "file_too_large" });

  const text = Buffer.from("esto no es audio, solo texto plano!!");
  const unknown = await validateAudio(
    { buffer: text, fileName: "nota.mp3", mimeType: "audio/mpeg", byteLength: text.length },
    limits,
  );
  assert.deepEqual(unknown, { ok: false, code: "unsupported_format" });

  const mismatch = await validateAudio(
    { buffer: wav, fileName: "nota.mp3", mimeType: "audio/wav", byteLength: wav.length },
    limits,
  );
  assert.deepEqual(mismatch, { ok: false, code: "unsupported_format" });

  const longAudio = makeWav(601, 200);
  const tooLong = await validateAudio(
    {
      buffer: longAudio,
      fileName: "largo.wav",
      mimeType: "application/octet-stream",
      byteLength: longAudio.length,
    },
    limits,
  );
  assert.deepEqual(tooLong, { ok: false, code: "duration_exceeded" });
});

function makeWav(seconds: number, sampleRate: number) {
  const numSamples = Math.floor(seconds * sampleRate);
  const dataSize = numSamples * 2;
  const buffer = Buffer.alloc(44 + dataSize);
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);
  return buffer;
}
