import assert from "node:assert/strict";
import test from "node:test";
import { resolveModelRef } from "../lib/transcription";

test("keeps an already versioned model id", async () => {
  const model = "vaibhavs10/incredibly-fast-whisper:abc123";
  const resolved = await resolveModelRef({} as never, model);
  assert.equal(resolved, model);
});

test("resolves the latest version for a community model name", async () => {
  const replicate = {
    models: {
      get: async () => ({
        latest_version: { id: "3ab86df6c8f54c11309d4d1f930ac292bad43ace52d10c80d87eb258b3c9f79c" },
      }),
    },
  };
  const resolved = await resolveModelRef(
    replicate as never,
    "vaibhavs10/incredibly-fast-whisper",
  );
  assert.equal(
    resolved,
    "vaibhavs10/incredibly-fast-whisper:3ab86df6c8f54c11309d4d1f930ac292bad43ace52d10c80d87eb258b3c9f79c",
  );
});
