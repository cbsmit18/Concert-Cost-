"use client";

import { formatCurrency } from "@/lib/concert-metrics";
import {
  calculateExpenseEstimate,
  SEATING_SECTION_LABELS,
  type ExpenseAddOns,
  type SeatingSection,
} from "@/lib/expense-prediction";
import {
  formatInferredExpenseSummary,
  inferExpenseContextFromConcert,
  type UpcomingConcertExpenseHints,
} from "@/lib/infer-expense-from-concert";
import { ui } from "@/lib/ui-classes";
import { useMemo, useState } from "react";

const SEATING_OPTIONS = Object.entries(SEATING_SECTION_LABELS) as [
  SeatingSection,
  string,
][];

export type ConcertExpensePredictorProps = {
  concert: UpcomingConcertExpenseHints;
};

export function ConcertExpensePredictor({ concert }: ConcertExpensePredictorProps) {
  const inferred = useMemo(
    () => inferExpenseContextFromConcert(concert),
    [concert],
  );

  const [seatingSection, setSeatingSection] =
    useState<SeatingSection>("generalAdmission");
  const [addOns, setAddOns] = useState<ExpenseAddOns>({
    hotel: false,
    flight: false,
    parking: false,
  });

  const estimate = useMemo(
    () =>
      calculateExpenseEstimate({
        popularity: inferred.popularity,
        venueSize: inferred.venueSize,
        seatingSection,
        addOns,
      }),
    [inferred, seatingSection, addOns],
  );

  function toggleAddOn(key: keyof ExpenseAddOns) {
    setAddOns((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-semibold text-base-content/80">
          Expense estimate
        </h4>
        <p className={ui.helperText}>
          Ticket price uses auto-detected artist and venue signals from this
          event. Choose seating and travel add-ons below.
        </p>
        <p className="text-xs mt-2 text-base-content/70">
          <span className="font-medium text-base-content">Auto-detected:</span>{" "}
          {formatInferredExpenseSummary(inferred)}
        </p>
      </div>

      <label className="form-control w-full">
        <span className="label-text font-medium text-xs">Seating section</span>
        <select
          className="select select-bordered select-sm w-full"
          value={seatingSection}
          onChange={(e) => setSeatingSection(e.target.value as SeatingSection)}
        >
          {SEATING_OPTIONS.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>

      <fieldset className="space-y-2">
        <legend className="text-xs font-medium text-base-content/70">
          Optional add-ons
        </legend>
        <label className="label cursor-pointer justify-start gap-3 py-1">
          <input
            type="checkbox"
            className="checkbox checkbox-sm checkbox-primary"
            checked={addOns.hotel}
            onChange={() => toggleAddOn("hotel")}
          />
          <span className="label-text">Hotel needed</span>
        </label>
        <label className="label cursor-pointer justify-start gap-3 py-1">
          <input
            type="checkbox"
            className="checkbox checkbox-sm checkbox-primary"
            checked={addOns.flight}
            onChange={() => toggleAddOn("flight")}
          />
          <span className="label-text">Flight needed</span>
        </label>
        <label className="label cursor-pointer justify-start gap-3 py-1">
          <input
            type="checkbox"
            className="checkbox checkbox-sm checkbox-primary"
            checked={addOns.parking}
            onChange={() => toggleAddOn("parking")}
          />
          <span className="label-text">Parking reservation needed</span>
        </label>
      </fieldset>

      <div className="border-t border-base-300/60 pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-base-content/70">Expected ticket price</span>
          <span className="font-medium">
            {formatCurrency(estimate.expectedTicketPrice)}
          </span>
        </div>

        {addOns.hotel && (
          <div className="flex justify-between text-sm">
            <span className="text-base-content/70">Hotel</span>
            <span className="font-medium">
              {formatCurrency(estimate.hotelCost)}
            </span>
          </div>
        )}

        {addOns.flight && (
          <div className="flex justify-between text-sm">
            <span className="text-base-content/70">Flight</span>
            <span className="font-medium">
              {formatCurrency(estimate.flightCost)}
            </span>
          </div>
        )}

        {addOns.parking && (
          <div className="flex justify-between text-sm">
            <span className="text-base-content/70">Parking reservation</span>
            <span className="font-medium">
              {formatCurrency(estimate.parkingCost)}
            </span>
          </div>
        )}

        <div className="rounded-xl bg-primary/10 border border-primary/20 px-4 py-3 mt-3 flex justify-between items-center gap-2">
          <span className="font-semibold text-base-content">
            Total estimated cost
          </span>
          <span className="text-xl font-bold text-primary">
            {formatCurrency(estimate.totalEstimatedCost)}
          </span>
        </div>

        <p className={`${ui.helperText} pt-1`}>
          Estimate only. Actual prices may vary based on demand, fees, resale
          pricing, and availability.
        </p>
      </div>
    </div>
  );
}
