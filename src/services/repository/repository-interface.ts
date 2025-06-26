import { Track, TrackList } from "../../types";

export interface Repository {
  getAll(): Promise<TrackList>;
  save(track: Track): Promise<void>;
  deleteAll({ limit, next }: { limit: number; next?: string }): Promise<void>;
}
