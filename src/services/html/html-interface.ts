import { TrackList } from "../../types";

export interface Html {
  renderTrackList(trackList: TrackList): Promise<string>;
}
