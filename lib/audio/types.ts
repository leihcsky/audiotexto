export const CONTAINERS = ["mpeg", "wav", "mp4", "webm"] as const;

export type Container = (typeof CONTAINERS)[number];

export const SUPPORTED_FORMAT_LABEL = "MP3, WAV, M4A, MP4, MPEG, MPGA y WebM";
