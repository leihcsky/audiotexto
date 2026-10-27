import assert from "node:assert/strict";
import test from "node:test";
import { extractTranscript } from "../lib/transcription";

test("reads text from the Replicate Whisper response", () => {
  assert.equal(
    extractTranscript({
      text: " Hola, mundo. ",
      chunks: [{ text: " Hola, mundo. ", timestamp: [0, 1.2] }],
    }),
    "Hola, mundo.",
  );
  assert.equal(extractTranscript({ transcription: "  Gracias.  " }), "Gracias.");
  assert.equal(
    extractTranscript({
      chunks: [{ text: "Uno" }, { text: "dos" }],
    }),
    "Uno dos",
  );
  assert.equal(extractTranscript("Texto plano"), "Texto plano");
  assert.equal(extractTranscript(null), "");
  assert.equal(extractTranscript({}), "");
});
