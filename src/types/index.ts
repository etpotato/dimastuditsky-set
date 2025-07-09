export type Track = {
  created_at: string;
  artwork_url: string;
  duration: number;
  id: string;
  title: string;
  description: string;
  url: string;
};

export type TrackGroup = Pick<Track, "id">[];

export type TrackList = {
  tracks: Track[];
  groups: TrackGroup[];
};

export const TrackSource = {
  Spotify: "spotify",
  Soundcloud: "soundcloud",
  Yandex: "yandex",
  Youtube: "youtube",
} as const;
export type TrackSource = (typeof TrackSource)[keyof typeof TrackSource];
