export type UpcomingConcertSearchParams = {

  city: string;

  artist?: string;

};



import type {
  ArtistPopularity,
  VenueSize,
} from "@/lib/expense-prediction";

export type UpcomingConcert = {
  id: string;
  eventName: string;
  artist: string;
  date: string;
  venue: string;
  city: string;
  state: string;
  ticketUrl?: string;
  /** Optional API fields — override auto-detection when present */
  artistPopularity?: ArtistPopularity;
  venueSize?: VenueSize;
  venueCapacity?: number;
};

