import type {
  ArtistPopularity,
  VenueSize,
} from "@/lib/expense-prediction";
import {
  POPULARITY_LABELS,
  VENUE_SIZE_LABELS,
} from "@/lib/expense-prediction";
import type { UpcomingConcert } from "@/lib/upcoming-concerts/types";

export type UpcomingConcertExpenseHints = UpcomingConcert & {
  /** Optional API-provided values override heuristics */
  artistPopularity?: ArtistPopularity;
  venueSize?: VenueSize;
  venueCapacity?: number;
};

export type InferredExpenseContext = {
  popularity: ArtistPopularity;
  venueSize: VenueSize;
};

const STADIUM_ARENA_VENUE =
  /\b(stadium|arena|coliseum|dome|superdome|ballpark|field|garden|msg|madison square|united center|barclays|chase center|sofi|allegiant|mercedes-benz|ford field|lambeau|gillette|soldier field|yankee stadium|wrigley|td garden|crypto\.com)\b/i;

const LARGE_VENUE =
  /\b(amphitheatre|amphitheater|pavilion|greek theatre|auditorium|fairgrounds|speedway|park|bowl|red rocks|merriweather|hollywood bowl|outdoor|festival grounds|amphitheatre)\b/i;

const SMALL_VENUE =
  /\b(club|bar|lounge|pub|cafe|ballroom|cellar|tavern|brewery|listening room|cabaret|basement|garage|coffeehouse|coffee house|tiny desk)\b/i;

const VERY_HIGH_POPULARITY_EVENT =
  /\b(world tour|global tour|stadium tour|farewell tour|reunion tour|mega tour|sold[- ]out everywhere)\b/i;

const HIGH_POPULARITY_EVENT =
  /\b(arena spectacular|stadium|sold out|headline tour|major tour|summer tour|worldwide)\b/i;

const LOW_POPULARITY_EVENT =
  /\b(acoustic evening|acoustic night|indie fest|open mic|local showcase|emerging artists|singer-songwriter|unplugged|matinee)\b/i;

/** Well-known headliner names in mock data / common major acts */
const KNOWN_HIGH_PROFILE_ARTISTS =
  /\b(ava stone|pulse district|the midnight echo)\b/i;

function capacityToVenueSize(capacity: number): VenueSize {
  if (capacity >= 15000) return "stadiumArena";
  if (capacity >= 5000) return "large";
  if (capacity >= 1500) return "medium";
  return "small";
}

export function inferVenueSizeFromConcert(
  concert: UpcomingConcertExpenseHints,
): VenueSize {
  if (concert.venueSize) return concert.venueSize;
  if (concert.venueCapacity != null && concert.venueCapacity > 0) {
    return capacityToVenueSize(concert.venueCapacity);
  }

  const text = `${concert.venue} ${concert.eventName}`.toLowerCase();

  if (STADIUM_ARENA_VENUE.test(text)) return "stadiumArena";
  if (SMALL_VENUE.test(text)) return "small";
  if (LARGE_VENUE.test(text)) return "large";

  if (/\b(theater|theatre|hall|fillmore|house of blues)\b/i.test(text)) {
    return "medium";
  }

  return "medium";
}

export function inferArtistPopularityFromConcert(
  concert: UpcomingConcertExpenseHints,
  venueSize: VenueSize,
): ArtistPopularity {
  if (concert.artistPopularity) return concert.artistPopularity;

  const text = `${concert.artist} ${concert.eventName}`.toLowerCase();

  if (VERY_HIGH_POPULARITY_EVENT.test(text)) return "veryHigh";
  if (LOW_POPULARITY_EVENT.test(text)) return "low";

  if (HIGH_POPULARITY_EVENT.test(text) || KNOWN_HIGH_PROFILE_ARTISTS.test(text)) {
    return venueSize === "stadiumArena" ? "veryHigh" : "high";
  }

  if (venueSize === "stadiumArena") return "high";
  if (venueSize === "large") return "high";
  if (venueSize === "small") return "low";

  if (/\btour\b/i.test(concert.eventName)) return "medium";

  return "medium";
}

export function inferExpenseContextFromConcert(
  concert: UpcomingConcertExpenseHints,
): InferredExpenseContext {
  const venueSize = inferVenueSizeFromConcert(concert);
  const popularity = inferArtistPopularityFromConcert(concert, venueSize);
  return { popularity, venueSize };
}

export function formatInferredExpenseSummary(context: InferredExpenseContext): string {
  return `${POPULARITY_LABELS[context.popularity]} popularity · ${VENUE_SIZE_LABELS[context.venueSize]}`;
}
