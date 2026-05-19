import type { Concert } from "@/lib/types";

/** Optional geo fields for future map library integration */
export type ConcertMapInput = Concert & {
  latitude?: number | null;
  longitude?: number | null;
};

export type StateConcertCount = {
  stateCode: string;
  stateName: string;
  count: number;
};

export type ConcertMapSummary = {
  countsByState: StateConcertCount[];
  totalStatesVisited: number;
  mostVisitedState: StateConcertCount | null;
  favoriteVenue: { venue: string; count: number } | null;
  furthestTrip: {
    concert: Concert;
    miles: number;
  } | null;
  furthestTripLabel: string;
  maxCount: number;
};

const STATE_NAME_TO_CODE: Record<string, string> = {
  alabama: "AL",
  alaska: "AK",
  arizona: "AZ",
  arkansas: "AR",
  california: "CA",
  colorado: "CO",
  connecticut: "CT",
  delaware: "DE",
  florida: "FL",
  georgia: "GA",
  hawaii: "HI",
  idaho: "ID",
  illinois: "IL",
  indiana: "IN",
  iowa: "IA",
  kansas: "KS",
  kentucky: "KY",
  louisiana: "LA",
  maine: "ME",
  maryland: "MD",
  massachusetts: "MA",
  michigan: "MI",
  minnesota: "MN",
  mississippi: "MS",
  missouri: "MO",
  montana: "MT",
  nebraska: "NE",
  nevada: "NV",
  "new hampshire": "NH",
  "new jersey": "NJ",
  "new mexico": "NM",
  "new york": "NY",
  "north carolina": "NC",
  "north dakota": "ND",
  ohio: "OH",
  oklahoma: "OK",
  oregon: "OR",
  pennsylvania: "PA",
  "rhode island": "RI",
  "south carolina": "SC",
  "south dakota": "SD",
  tennessee: "TN",
  texas: "TX",
  utah: "UT",
  vermont: "VT",
  virginia: "VA",
  washington: "WA",
  "west virginia": "WV",
  wisconsin: "WI",
  wyoming: "WY",
  "district of columbia": "DC",
};

export const US_STATE_CODES: { code: string; name: string }[] = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
  { code: "DC", name: "District of Columbia" },
];

const CODE_TO_NAME = Object.fromEntries(
  US_STATE_CODES.map((s) => [s.code, s.name]),
);

export function normalizeStateCode(raw: string | null | undefined): string | null {
  if (!raw?.trim()) return null;
  const trimmed = raw.trim();
  if (trimmed.length === 2) {
    const code = trimmed.toUpperCase();
    return CODE_TO_NAME[code] ? code : null;
  }
  const key = trimmed.toLowerCase();
  return STATE_NAME_TO_CODE[key] ?? null;
}

export function getConcertMapSummary(concerts: ConcertMapInput[]): ConcertMapSummary {
  const stateCountMap = new Map<string, number>();
  const venueCountMap = new Map<string, number>();
  let furthest: { concert: Concert; miles: number } | null = null;

  for (const concert of concerts) {
    const code = normalizeStateCode(concert.state);
    if (code) {
      stateCountMap.set(code, (stateCountMap.get(code) ?? 0) + 1);
    }

    const venue = concert.venue?.trim();
    if (venue) {
      venueCountMap.set(venue, (venueCountMap.get(venue) ?? 0) + 1);
    }

    const miles = Number(concert.distance_from_home);
    if (Number.isFinite(miles) && miles > 0) {
      if (!furthest || miles > furthest.miles) {
        furthest = { concert, miles };
      }
    }
  }

  const countsByState: StateConcertCount[] = US_STATE_CODES.map(
    ({ code, name }) => ({
      stateCode: code,
      stateName: name,
      count: stateCountMap.get(code) ?? 0,
    }),
  ).filter((s) => s.count > 0);

  countsByState.sort((a, b) => b.count - a.count);

  const mostVisitedState = countsByState[0] ?? null;

  let favoriteVenue: { venue: string; count: number } | null = null;
  for (const [venue, count] of venueCountMap) {
    if (!favoriteVenue || count > favoriteVenue.count) {
      favoriteVenue = { venue, count };
    }
  }

  const maxCount = countsByState[0]?.count ?? 0;

  const furthestTripLabel = furthest
    ? `${furthest.concert.concert_name} (${furthest.miles.toLocaleString()} mi)`
    : "Add location data to calculate.";

  return {
    countsByState,
    totalStatesVisited: countsByState.length,
    mostVisitedState,
    favoriteVenue,
    furthestTrip: furthest,
    furthestTripLabel,
    maxCount,
  };
}

export function getStateCount(
  summary: ConcertMapSummary,
  stateCode: string,
): number {
  return (
    summary.countsByState.find((s) => s.stateCode === stateCode)?.count ?? 0
  );
}
