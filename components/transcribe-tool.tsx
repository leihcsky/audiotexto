"use client";

import { useRef, useState } from "react";
import { trackEvent } from "@/lib/track-event";
import { TRANSCRIPT_FILE_NAME, transcriptFileContents } from "@/lib/transcript-file";

type Props = {
  maxSizeMb: number;
};

const GENERIC_ERROR = "No se pudo transcribir el audio. Inténtalo de nuevo.";
const NETWORK_ERROR = "Se cortó la conexión. Revisa tu red e inténtalo de nuevo.";
const LIMIT_CODES = new Set(["daily_limit", "concurrent_limit"]);

export function TranscribeTool({ maxSizeMb }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const submittingRef = useRef(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [transcript, setTranscript] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [dragging, setDragging] = useState(false);
  const maxBytes = maxSizeMb * 1024 * 1024;

  function selectFile(next: File) {
    setTranscript("");
    setCopied(false);
    if (next.size === 0) {
      setFile(null);
      setError("El archivo está vacío. Elige un audio que tenga contenido.");
      return;
    }
    if (next.size > maxBytes) {
      setFile(null);
      setError(`El archivo supera el tamaño máximo de ${maxSizeMb} MB.`);
      return;
    }
    setFile(next);
    setError("");
    trackEvent("upload_started");
  }

  function reset() {
    setFile(null);
    setTranscript("");
    setError("");
    setCopied(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submittingRef.current || !file) return;
    submittingRef.current = true;
    setSubmitting(true);
    setError("");
    setTranscript("");
    setCopied(false);
    trackEvent("transcription_started");

    try {
      const body = new FormData();
      body.append("file", file);
      const response = await fetch("/api/transcribe", { method: "POST", body });
      const data = (await response.json().catch(() => null)) as {
        success?: boolean;
        transcript?: unknown;
        error?: unknown;
        code?: unknown;
      } | null;

      if (!data || data.success !== true || typeof data.transcript !== "string") {
        const code = typeof data?.code === "string" ? data.code : "";
        setError(typeof data?.error === "string" ? data.error : GENERIC_ERROR);
        trackEvent(LIMIT_CODES.has(code) ? "limit_reached" : "transcription_failed");
        return;
      }

      setTranscript(data.transcript);
      trackEvent("transcription_succeeded");
    } catch {
      setError(NETWORK_ERROR);
      trackEvent("transcription_failed");
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  async function copyTranscript() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(transcript);
      } else {
        copyWithSelection(transcript);
      }
      setCopied(true);
      trackEvent("transcript_copied");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("No se pudo copiar el texto. Selecciónalo a mano.");
    }
  }

  function downloadTranscript() {
    const blob = new Blob([transcriptFileContents(transcript)], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = TRANSCRIPT_FILE_NAME;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    trackEvent("transcript_downloaded");
  }

  return (
    <form onSubmit={onSubmit} aria-busy={submitting} className="space-y-4">
      <div
        onDragEnter={(event) => {
          event.preventDefault();
          if (!submitting) setDragging(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          if (!submitting) setDragging(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          if (submitting) return;
          const dropped = Array.from(event.dataTransfer.files);
          if (dropped.length > 1) {
            setError("Solo puedes transcribir un archivo cada vez.");
            return;
          }
          if (dropped[0]) selectFile(dropped[0]);
        }}
        className={`rounded-3xl border border-dashed px-5 py-8 text-center transition sm:px-8 ${
          dragging ? "border-pine bg-pine/5" : "border-line bg-paper"
        }`}
      >
        <p className="text-base leading-7 text-ink">
          Arrastra un archivo de audio aquí o elige uno desde tu dispositivo.
        </p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={submitting}
          className="mt-4 inline-flex items-center justify-center rounded-full border border-line bg-card px-5 py-3 text-sm font-semibold text-ink hover:border-pine disabled:cursor-not-allowed disabled:opacity-50"
        >
          Elegir archivo
        </button>
        <input
          ref={inputRef}
          id="audio-file"
          type="file"
          accept="audio/mpeg,audio/wav,audio/mp4,audio/webm,video/mp4,video/webm,.mp3,.wav,.m4a,.mp4,.mpeg,.mpga,.webm"
          className="sr-only"
          aria-label="Archivo de audio"
          disabled={submitting}
          onChange={(event) => {
            const selected = event.target.files?.[0];
            if (selected) selectFile(selected);
          }}
        />
        {file ? (
          <p className="mt-4 break-all text-sm text-muted">
            {file.name} · {formatSize(file.size)}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={!file || submitting}
        className="inline-flex w-full items-center justify-center rounded-full bg-pine px-5 py-3 text-sm font-semibold text-white hover:bg-pine-dark disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
      >
        Transcribir audio
      </button>

      {submitting ? (
        <p role="status" className="text-sm text-muted">
          Transcribiendo tu audio… Puede tardar un momento.
        </p>
      ) : null}
      {error ? (
        <p role="alert" className="rounded-2xl bg-danger-bg px-4 py-3 text-sm text-danger">
          {error}
        </p>
      ) : null}

      {transcript ? (
        <section className="rounded-3xl border border-line bg-card p-5">
          <h2 className="font-serif text-3xl text-ink">Texto transcrito</h2>
          <textarea
            readOnly
            value={transcript}
            rows={10}
            aria-label="Texto transcrito"
            className="mt-4 w-full resize-y rounded-2xl border border-line bg-paper px-4 py-3 text-base leading-7 text-ink"
          />
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={copyTranscript}
              className="inline-flex items-center justify-center rounded-full bg-pine px-5 py-3 text-sm font-semibold text-white hover:bg-pine-dark"
            >
              {copied ? "Copiado" : "Copiar texto"}
            </button>
            <button
              type="button"
              onClick={downloadTranscript}
              className="inline-flex items-center justify-center rounded-full border border-line bg-card px-5 py-3 text-sm font-semibold text-ink hover:border-pine"
            >
              Descargar TXT
            </button>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center justify-center rounded-full border border-line bg-card px-5 py-3 text-sm font-semibold text-ink hover:border-pine"
            >
              Transcribir otro archivo
            </button>
          </div>
        </section>
      ) : null}
    </form>
  );
}

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function copyWithSelection(text: string) {
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "true");
  area.style.position = "fixed";
  area.style.left = "-9999px";
  document.body.appendChild(area);
  area.select();
  const copied = document.execCommand("copy");
  area.remove();
  if (!copied) throw new Error("copy failed");
}
