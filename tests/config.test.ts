import assert from "node:assert/strict";
import test from "node:test";
import { getConfig } from "../lib/config";

test("uses safe defaults and clamps the file size to the upload maximum", () => {
  const previous = {
    size: process.env.MAX_AUDIO_SIZE_MB,
    model: process.env.REPLICATE_TRANSCRIPTION_MODEL,
    site: process.env.SITE_URL,
    key: process.env.REPLICATE_API_TOKEN,
  };
  process.env.MAX_AUDIO_SIZE_MB = "250";
  process.env.REPLICATE_TRANSCRIPTION_MODEL =
    "vaibhavs10/incredibly-fast-whisper:3ab86df6c8f54c11309d4d1f930ac292bad43ace52d10c80d87eb258b3c9f79c";
  process.env.SITE_URL = "https://audio.example/";
  process.env.REPLICATE_API_TOKEN = "r8_test";

  const config = getConfig();
  assert.equal(config.maxAudioSizeMb, 100);
  assert.equal(
    config.model,
    "vaibhavs10/incredibly-fast-whisper:3ab86df6c8f54c11309d4d1f930ac292bad43ace52d10c80d87eb258b3c9f79c",
  );
  assert.equal(config.siteUrl, "https://audio.example");
  assert.equal("apiKey" in config, false);

  process.env.MAX_AUDIO_SIZE_MB = previous.size;
  process.env.REPLICATE_TRANSCRIPTION_MODEL = previous.model;
  process.env.SITE_URL = previous.site;
  process.env.REPLICATE_API_TOKEN = previous.key;
});
