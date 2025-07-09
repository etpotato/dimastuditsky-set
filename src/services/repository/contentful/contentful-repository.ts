import { Track, TrackList, TrackSource } from "../../../types";
import { Repository } from "../repository-interface";
import { ContentfulClientApi, createClient } from "contentful";
import { mapTrack } from "./utils/map-track";
import { CtflTrack, CtflTrackGroup } from "./contentful-types";
import { getSourceMatch } from "./utils/get-source-match";

export class ContentfulRepository implements Repository {
  private client: ContentfulClientApi<undefined>;

  constructor(ctflCdaToken: string, ctflSpaceId: string) {
    this.client = createClient({
      accessToken: ctflCdaToken,
      space: ctflSpaceId,
    });
  }

  public async getTrackList(source?: TrackSource): Promise<TrackList> {
    try {
      const [tracksResponse, groupsResponse] = await Promise.all([
        this.client.getEntries({
          content_type: "track",
          "fields.url[match]": getSourceMatch(source),
          limit: 1000,
        }),
        this.client.getEntries({
          content_type: "trackGroup",
          limit: 1000,
        }),
      ]);

      const tracks = (tracksResponse.items as unknown as CtflTrack[]).map(
        mapTrack
      );
      const groups = (groupsResponse.items as unknown as CtflTrackGroup[]).map(
        (group) => group.fields.tracks.map((track) => track.sys)
      );

      return { tracks, groups };
    } catch (error) {
      console.error("Error retrieving track list:", error);
      throw new Error("Failed to retrieve track list");
    }
  }
}
