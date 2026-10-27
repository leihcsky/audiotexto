import assert from "node:assert/strict";
import test from "node:test";
import { TRANSCRIPT_FILE_NAME, transcriptFileContents } from "../lib/transcript-file";

test("writes UTF-8 text with a BOM so Spanish accents survive", () => {
  const contents = transcriptFileContents("El niño comió jamón.");
  assert.equal(contents.charCodeAt(0), 0xfeff);
  assert.equal(contents.slice(1), "El niño comió jamón.");
  assert.equal(TRANSCRIPT_FILE_NAME, "transcripcion.txt");
});
