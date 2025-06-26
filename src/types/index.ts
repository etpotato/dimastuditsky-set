export type Track = {
  created_at: string;
  artwork_url: string;
  full_duration: number;
  id: string;
  title: string;
  description: string;
  permalink_url: string;
};

export type TrackList = {
  items: Track[];
  total: number;
  next?: string;
};
