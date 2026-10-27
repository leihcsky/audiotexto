import assert from "node:assert/strict";
import test from "node:test";
import { detectContainer } from "../lib/audio/detect-container";

test("detects wav, mp4, webm and mpeg headers", () => {
  const wav = Buffer.alloc(12);
  wav.write("RIFF", 0);
  wav.write("WAVE", 8);
  assert.equal(detectContainer(wav), "wav");

  const mp4 = Buffer.alloc(12);
  mp4.write("ftyp", 4);
  assert.equal(detectContainer(mp4), "mp4");

  const webm = Buffer.from([0x1a, 0x45, 0xdf, 0xa3, 0, 0, 0, 0, 0, 0, 0, 0]);
  assert.equal(detectContainer(webm), "webm");

  const id3 = Buffer.alloc(12);
  id3.write("ID3", 0);
  assert.equal(detectContainer(id3), "mpeg");

  const frame = Buffer.alloc(12);
  frame[0] = 0xff;
  frame[1] = 0xfb;
  assert.equal(detectContainer(frame), "mpeg");
});

test("rejects short or unknown files", () => {
  assert.equal(detectContainer(Buffer.from("hola")), null);
  assert.equal(detectContainer(Buffer.alloc(12)), null);
});
