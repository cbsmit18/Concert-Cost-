import type { UpcomingConcert, UpcomingConcertSearchParams } from "./types";



/** Sample events until Ticketmaster / SeatGeek is wired up. */

const MOCK_UPCOMING: UpcomingConcert[] = [

  {

    id: "mock-1",

    eventName: "Summer Nights Tour",

    artist: "The Midnight Echo",

    date: "2026-06-14",

    venue: "Red Rocks Amphitheatre",

    city: "Morrison",

    state: "CO",

    ticketUrl: "https://example.com/tickets/midnight-echo",

  },

  {

    id: "mock-2",

    eventName: "Live at the Garden",

    artist: "Ava Stone",

    date: "2026-07-02",

    venue: "Madison Square Garden",

    city: "New York",

    state: "NY",

    ticketUrl: "https://example.com/tickets/ava-stone",

  },

  {

    id: "mock-3",

    eventName: "Indie Fest 2026",

    artist: "Coastline Radio",

    date: "2026-08-19",

    venue: "Greek Theatre",

    city: "Los Angeles",

    state: "CA",

    ticketUrl: "https://example.com/tickets/coastline-radio",

  },

  {

    id: "mock-4",

    eventName: "Acoustic Evening",

    artist: "Ava Stone",

    date: "2026-05-28",

    venue: "The Fillmore",

    city: "San Francisco",

    state: "CA",

  },

  {

    id: "mock-5",

    eventName: "Arena Spectacular",

    artist: "Pulse District",

    date: "2026-09-10",

    venue: "United Center",

    city: "Chicago",

    state: "IL",

    ticketUrl: "https://example.com/tickets/pulse-district",

  },

  {

    id: "mock-6",

    eventName: "Outdoor Series",

    artist: "The Midnight Echo",

    date: "2026-10-05",

    venue: "Merriweather Post Pavilion",

    city: "Columbia",

    state: "MD",

    ticketUrl: "https://example.com/tickets/midnight-echo-2",

  },

];



function todayIsoDate(): string {

  const d = new Date();

  const y = d.getFullYear();

  const m = String(d.getMonth() + 1).padStart(2, "0");

  const day = String(d.getDate()).padStart(2, "0");

  return `${y}-${m}-${day}`;

}



function matchesCity(concert: UpcomingConcert, city: string): boolean {

  const needle = city.trim().toLowerCase();

  if (!needle) return false;

  return (

    concert.city.toLowerCase().includes(needle) ||

    concert.state.toLowerCase().includes(needle) ||

    `${concert.city}, ${concert.state}`.toLowerCase().includes(needle)

  );

}



function matchesArtist(concert: UpcomingConcert, artist: string): boolean {

  const needle = artist.trim().toLowerCase();

  if (!needle) return true;

  return (

    concert.artist.toLowerCase().includes(needle) ||

    concert.eventName.toLowerCase().includes(needle)

  );

}



/**

 * Placeholder fetch — filters mock data by city/artist and future dates.

 *

 * To connect a real provider later:

 * 1. Add TICKETMASTER_API_KEY (or similar) to env — server-side only.

 * 2. Replace the mock branch with an HTTP call to the provider API.

 * 3. Map provider response fields into UpcomingConcert.

 */

export async function fetchUpcomingConcerts(

  params: UpcomingConcertSearchParams,

): Promise<UpcomingConcert[]> {

  const today = todayIsoDate();

  const city = params.city.trim();

  const artist = params.artist?.trim();



  // Simulate network latency for realistic loading states in dev.

  await new Promise((resolve) => setTimeout(resolve, 400));



  const results = MOCK_UPCOMING.filter(

    (concert) =>

      concert.date >= today &&

      matchesCity(concert, city) &&

      matchesArtist(concert, artist ?? ""),

  );



  return results.sort((a, b) => a.date.localeCompare(b.date));

}

