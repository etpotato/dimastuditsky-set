import { TrackSource } from "../../../../types";

export function getSourceMatch(source?: TrackSource) {
  if (source === TrackSource.Youtube) {
    return "www.youtube";
  }

  if (source === TrackSource.Spotify) {
    return "open.spotify";
  }

  if (source === TrackSource.Yandex) {
    return "music.yandex";
  }

  return source;
}
