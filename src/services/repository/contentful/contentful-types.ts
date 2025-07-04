import { Track } from "../../../types";

export type CtflTrack = {
  sys: {
    id: string;
  };
  fields: Omit<Track, "id">;
};

export type CtflTrackGroup = {
  sys: {
    id: string;
  };
  fields: {
    tracks: {
      sys: Pick<Track, "id">;
    }[];
  };
};
