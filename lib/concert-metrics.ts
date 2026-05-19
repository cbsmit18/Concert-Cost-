import type { Concert } from "./types";



export const COST_FIELDS = [

  { key: "ticket_cost" as const, label: "Tickets" },

  { key: "ticket_fees" as const, label: "Ticket fees" },

  { key: "parking_cost" as const, label: "Parking" },

  { key: "food_drink_cost" as const, label: "Food & drink" },

  { key: "merchandise_cost" as const, label: "Merchandise" },

  { key: "lodging_cost" as const, label: "Lodging" },

  { key: "travel_cost" as const, label: "Travel / gas" },

  { key: "other_cost" as const, label: "Other" },

];



export function getCostValue(concert: Concert, key: (typeof COST_FIELDS)[number]["key"]) {

  return Number(concert[key]) || 0;

}



export function getTotalCost(concert: Concert): number {

  return COST_FIELDS.reduce((sum, { key }) => sum + getCostValue(concert, key), 0);

}



export function getTotalCostFromParts(costs: Record<(typeof COST_FIELDS)[number]["key"], number>): number {

  return COST_FIELDS.reduce((sum, { key }) => sum + (Number(costs[key]) || 0), 0);

}



export function getCostPerHour(concert: Concert): number | null {

  const hours = Number(concert.hours_at_event);

  if (!hours || hours <= 0) return null;

  return getTotalCost(concert) / hours;

}



export function getFunPerDollar(concert: Concert): number | null {

  const total = getTotalCost(concert);

  if (total <= 0) return null;

  return concert.fun_rating / total;

}



export function getFunPointsPer100(concert: Concert): number | null {

  const perDollar = getFunPerDollar(concert);

  if (perDollar === null) return null;

  return perDollar * 100;

}



export function formatCurrency(amount: number): string {

  return new Intl.NumberFormat("en-US", {

    style: "currency",

    currency: "USD",

    minimumFractionDigits: 2,

    maximumFractionDigits: 2,

  }).format(amount);

}



export function formatDate(dateStr: string): string {

  const [y, m, d] = dateStr.split("-").map(Number);

  return new Date(y, m - 1, d).toLocaleDateString("en-US", {

    month: "short",

    day: "numeric",

    year: "numeric",

  });

}



export function truncateLabel(label: string, max = 18): string {

  return label.length > max ? `${label.slice(0, max)}…` : label;

}



export function getTopCostCategories(concert: Concert, limit = 3) {

  return COST_FIELDS.map(({ key, label }) => ({

    label,

    amount: getCostValue(concert, key),

  }))

    .filter((c) => c.amount > 0)

    .sort((a, b) => b.amount - a.amount)

    .slice(0, limit);

}



export function getCategoryTotals(concerts: Concert[]) {

  return COST_FIELDS.map(({ key, label }) => ({

    name: label,

    value: concerts.reduce((sum, c) => sum + getCostValue(c, key), 0),

  })).filter((c) => c.value > 0);

}



export type DashboardSummary = {

  totalConcerts: number;

  totalSpent: number;

  avgCostPerConcert: number;

  avgFunRating: number;

  avgCostPerHour: number | null;

  bestValue: { concert: Concert; funPoints: number } | null;

  mostExpensive: { concert: Concert; total: number } | null;

  highestFun: { concert: Concert; rating: number } | null;

};



export function getDashboardSummary(concerts: Concert[]): DashboardSummary {

  if (concerts.length === 0) {

    return {

      totalConcerts: 0,

      totalSpent: 0,

      avgCostPerConcert: 0,

      avgFunRating: 0,

      avgCostPerHour: null,

      bestValue: null,

      mostExpensive: null,

      highestFun: null,

    };

  }



  const totals = concerts.map(getTotalCost);

  const totalSpent = totals.reduce((a, b) => a + b, 0);

  const costPerHours = concerts

    .map(getCostPerHour)

    .filter((v): v is number => v !== null);

  const funPoints = concerts

    .map((c) => ({ concert: c, funPoints: getFunPointsPer100(c) }))

    .filter((x): x is { concert: Concert; funPoints: number } => x.funPoints !== null);



  return {

    totalConcerts: concerts.length,

    totalSpent,

    avgCostPerConcert: totalSpent / concerts.length,

    avgFunRating:

      concerts.reduce((s, c) => s + c.fun_rating, 0) / concerts.length,

    avgCostPerHour:

      costPerHours.length > 0

        ? costPerHours.reduce((a, b) => a + b, 0) / costPerHours.length

        : null,

    bestValue:

      funPoints.length > 0

        ? funPoints.reduce((best, cur) =>

            cur.funPoints > best.funPoints ? cur : best,

          )

        : null,

    mostExpensive: concerts.reduce(

      (best, c) => {

        const t = getTotalCost(c);

        return !best || t > best.total ? { concert: c, total: t } : best;

      },

      null as { concert: Concert; total: number } | null,

    ),

    highestFun: concerts.reduce(

      (best, c) =>

        !best || c.fun_rating > best.rating

          ? { concert: c, rating: c.fun_rating }

          : best,

      null as { concert: Concert; rating: number } | null,

    ),

  };

}

