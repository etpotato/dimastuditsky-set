import { TrackList, TrackSource } from "../../types";

export interface Html {
  renderTrackList(trackList: TrackList, source?: TrackSource): Promise<string>;
}
