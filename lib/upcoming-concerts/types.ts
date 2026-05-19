export type UpcomingConcertSearchParams = {

  city: string;

  artist?: string;

};



export type UpcomingConcert = {

  id: string;

  eventName: string;

  artist: string;

  date: string;

  venue: string;

  city: string;

  state: string;

  ticketUrl?: string;

};

