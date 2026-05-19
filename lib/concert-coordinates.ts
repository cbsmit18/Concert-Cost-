import type { ConcertMapInput } from "@/lib/concert-map-metrics";
import { normalizeStateCode } from "@/lib/concert-map-metrics";

/** [longitude, latitude] for map libraries */
export type LngLat = [number, number];

const CITY_COORDS: Record<string, LngLat> = {
  "morrison,co": [-105.205749, 39.665538],
  "new york,ny": [-73.9857, 40.7484],
  "austin,tx": [-97.7431, 30.2672],
  "nashville,tn": [-86.7816, 36.1627],
  "chicago,il": [-87.6742, 41.8807],
  "los angeles,ca": [-118.2437, 34.0522],
  "seattle,wa": [-122.3321, 47.6062],
  "miami,fl": [-80.1918, 25.7617],
  "london,uk": [-0.1276, 51.5074],
  "london,england": [-0.1276, 51.5074],
  "paris,france": [2.3522, 48.8566],
  "toronto,on": [-79.3832, 43.6532],
  "toronto,canada": [-79.3832, 43.6532],
  "tokyo,japan": [139.6917, 35.6895],
  "sydney,australia": [151.2093, -33.8688],
  "denver,co": [-104.9903, 39.7392],
};

const STATE_CENTROIDS: Record<string, LngLat> = {
  AL: [-86.79113, 32.377716],
  AK: [-152.404419, 65.323167],
  AZ: [-112.093731, 33.448376],
  AR: [-92.289594, 34.746483],
  CA: [-119.681564, 36.778259],
  CO: [-105.311104, 39.059811],
  CT: [-72.755371, 41.767],
  DE: [-75.526755, 39.161921],
  FL: [-81.686783, 27.766279],
  GA: [-83.441162, 32.32938],
  HI: [-157.826182, 21.30895],
  ID: [-114.478828, 44.239403],
  IL: [-89.671577, 40.3363],
  IN: [-86.147685, 39.790942],
  IA: [-93.620866, 42.032974],
  KS: [-98.484246, 39.0398],
  KY: [-84.86311, 38.186722],
  LA: [-91.87488, 30.45809],
  ME: [-69.765261, 44.307167],
  MD: [-76.501157, 38.978445],
  MA: [-71.530106, 42.2352],
  MI: [-84.5467, 43.326618],
  MN: [-94.6859, 46.39241],
  MS: [-89.678696, 32.354668],
  MO: [-92.189283, 38.572954],
  MT: [-110.454353, 47.052952],
  NE: [-99.901813, 41.492537],
  NV: [-117.055374, 38.313515],
  NH: [-71.549709, 43.452492],
  NJ: [-74.756138, 40.298904],
  NM: [-106.248482, 34.840515],
  NY: [-74.948051, 42.953775],
  NC: [-79.806419, 35.771],
  ND: [-99.784012, 47.528912],
  OH: [-82.764915, 40.269789],
  OK: [-97.534994, 35.482309],
  OR: [-120.767018, 44.141904],
  PA: [-77.209755, 40.269789],
  RI: [-71.422132, 41.82355],
  SC: [-81.035, 33.836082],
  SD: [-99.901813, 44.368316],
  TN: [-86.784447, 35.860119],
  TX: [-97.563461, 31.054487],
  UT: [-111.892622, 40.150032],
  VT: [-72.731719, 44.045876],
  VA: [-78.169968, 37.769337],
  WA: [-121.490494, 47.38264],
  WV: [-80.954453, 38.349497],
  WI: [-89.616508, 44.268543],
  WY: [-107.30249, 42.755966],
  DC: [-77.036871, 38.907192],
};

export function getCountryCode(concert: ConcertMapInput): string | null {
  const state = concert.state?.trim().toLowerCase() ?? "";
  const city = concert.city?.trim().toLowerCase() ?? "";

  if (
    state === "uk" ||
    state === "england" ||
    state === "united kingdom" ||
    city === "london"
  ) {
    return "GB";
  }
  if (state === "france" || city === "paris") return "FR";
  if (state === "canada" || state === "on" || city === "toronto") return "CA";
  if (state === "japan" || city === "tokyo") return "JP";
  if (state === "australia" || city === "sydney") return "AU";

  const usState = normalizeStateCode(concert.state);
  if (usState) return "US";

  return null;
}

export function resolveConcertCoordinates(
  concert: ConcertMapInput,
): LngLat | null {
  if (
    concert.latitude != null &&
    concert.longitude != null &&
    Number.isFinite(concert.latitude) &&
    Number.isFinite(concert.longitude)
  ) {
    return [Number(concert.longitude), Number(concert.latitude)];
  }

  const city = concert.city?.trim().toLowerCase() ?? "";
  const state = concert.state?.trim().toLowerCase() ?? "";
  const cityKey = `${city},${state}`;
  if (CITY_COORDS[cityKey]) return CITY_COORDS[cityKey];

  const usState = normalizeStateCode(concert.state);
  if (usState && STATE_CENTROIDS[usState]) return STATE_CENTROIDS[usState];

  return null;
}

export type ConcertMapPoint = {
  id: string;
  name: string;
  venue: string;
  city: string;
  state: string;
  countryCode: string | null;
  coordinates: LngLat;
  stateCode: string | null;
};

export function getConcertMapPoints(
  concerts: ConcertMapInput[],
): ConcertMapPoint[] {
  const points: ConcertMapPoint[] = [];

  for (const concert of concerts) {
    const coordinates = resolveConcertCoordinates(concert);
    if (!coordinates) continue;

    points.push({
      id: concert.id,
      name: concert.concert_name,
      venue: concert.venue,
      city: concert.city,
      state: concert.state,
      countryCode: getCountryCode(concert),
      coordinates,
      stateCode: normalizeStateCode(concert.state),
    });
  }

  return points;
}

export function getCountryConcertCounts(
  concerts: ConcertMapInput[],
): Map<string, number> {
  const counts = new Map<string, number>();
  for (const concert of concerts) {
    const code = getCountryCode(concert);
    if (!code) continue;
    counts.set(code, (counts.get(code) ?? 0) + 1);
  }
  return counts;
}

/** ISO 3166-1 alpha-3 on Natural Earth / world-atlas 110m */
const ISO_A3_TO_A2: Record<string, string> = {
  USA: "US",
  GBR: "GB",
  FRA: "FR",
  CAN: "CA",
  JPN: "JP",
  AUS: "AU",
  DEU: "DE",
  ITA: "IT",
  ESP: "ES",
  MEX: "MX",
  BRA: "BR",
};

export function geographyCountryCode(geo: {
  properties?: { iso_a3?: string; name?: string };
}): string | null {
  const isoA3 = geo.properties?.iso_a3;
  if (isoA3 && ISO_A3_TO_A2[isoA3]) return ISO_A3_TO_A2[isoA3];
  const name = geo.properties?.name?.toLowerCase();
  if (name === "united states of america") return "US";
  if (name === "united kingdom") return "GB";
  if (name === "france") return "FR";
  if (name === "canada") return "CA";
  if (name === "japan") return "JP";
  if (name === "australia") return "AU";
  return null;
}
