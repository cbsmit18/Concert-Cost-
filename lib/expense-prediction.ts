export type ArtistPopularity = "low" | "medium" | "high" | "veryHigh";

export type VenueSize = "small" | "medium" | "large" | "stadiumArena";

export type SeatingSection =
  | "generalAdmission"
  | "upperLevel"
  | "lowerLevel"
  | "floor"
  | "vipPremium";

export type ExpenseAddOns = {
  hotel: boolean;
  flight: boolean;
  parking: boolean;
};

export type ExpensePredictorInputs = {
  popularity: ArtistPopularity;
  venueSize: VenueSize;
  seatingSection: SeatingSection;
  addOns: ExpenseAddOns;
};

export type ExpenseEstimate = {
  expectedTicketPrice: number;
  hotelCost: number;
  flightCost: number;
  parkingCost: number;
  totalEstimatedCost: number;
};

export const BASE_TICKET_PRICES: Record<ArtistPopularity, number> = {
  low: 45,
  medium: 85,
  high: 150,
  veryHigh: 250,
};

export const VENUE_SIZE_MULTIPLIERS: Record<VenueSize, number> = {
  small: 0.9,
  medium: 1.0,
  large: 1.2,
  stadiumArena: 1.4,
};

export const SEATING_SECTION_MULTIPLIERS: Record<SeatingSection, number> = {
  generalAdmission: 1.0,
  upperLevel: 0.8,
  lowerLevel: 1.25,
  floor: 1.5,
  vipPremium: 2.25,
};

export const ADD_ON_COSTS = {
  hotel: 180,
  flight: 300,
  parking: 35,
} as const;

export const POPULARITY_LABELS: Record<ArtistPopularity, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  veryHigh: "Very High",
};

export const VENUE_SIZE_LABELS: Record<VenueSize, string> = {
  small: "Small",
  medium: "Medium",
  large: "Large",
  stadiumArena: "Stadium/Arena",
};

export const SEATING_SECTION_LABELS: Record<SeatingSection, string> = {
  generalAdmission: "General Admission",
  upperLevel: "Upper Level",
  lowerLevel: "Lower Level",
  floor: "Floor",
  vipPremium: "VIP/Premium",
};

export function calculateExpenseEstimate(
  inputs: ExpensePredictorInputs,
): ExpenseEstimate {
  const base = BASE_TICKET_PRICES[inputs.popularity];
  const venueMult = VENUE_SIZE_MULTIPLIERS[inputs.venueSize];
  const seatingMult = SEATING_SECTION_MULTIPLIERS[inputs.seatingSection];

  const expectedTicketPrice = Math.round(base * venueMult * seatingMult);

  const hotelCost = inputs.addOns.hotel ? ADD_ON_COSTS.hotel : 0;
  const flightCost = inputs.addOns.flight ? ADD_ON_COSTS.flight : 0;
  const parkingCost = inputs.addOns.parking ? ADD_ON_COSTS.parking : 0;

  const totalEstimatedCost =
    expectedTicketPrice + hotelCost + flightCost + parkingCost;

  return {
    expectedTicketPrice,
    hotelCost,
    flightCost,
    parkingCost,
    totalEstimatedCost,
  };
}
