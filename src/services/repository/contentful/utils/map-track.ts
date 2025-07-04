import { Track } from "../../../../types";

export function mapTrack(ctflTrack: {
  sys: { id: string };
  fields: Omit<Track, "id">;
}): Track {
  return {
    id: ctflTrack.sys.id,
    ...ctflTrack.fields,
  };
}
