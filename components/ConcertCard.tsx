import {

  formatCurrency,

  formatDate,

  getCostPerHour,

  getFunPointsPer100,

  getTopCostCategories,

  getTotalCost,

} from "@/lib/concert-metrics";

import { ui } from "@/lib/ui-classes";

import type { Concert } from "@/lib/types";

import { Calendar, MapPin } from "lucide-react";



export function ConcertCard({ concert }: { concert: Concert }) {

  const total = getTotalCost(concert);

  const costPerHour = getCostPerHour(concert);

  const funPoints = getFunPointsPer100(concert);

  const topCategories = getTopCostCategories(concert);



  return (

    <article

      className={`${ui.surfaceCard} motion-safe-hover-lift border-l-4 border-l-primary`}

    >

      <div className="card-body gap-4">

        <div className="flex justify-between items-start gap-2">

          <div className="min-w-0">

            <h3 className="card-title text-lg leading-tight">

              {concert.concert_name}

            </h3>

            <p className="text-sm text-primary font-medium">{concert.artist}</p>

          </div>

          <div className="badge badge-primary badge-lg shrink-0 min-h-9">

            {concert.fun_rating}/10

          </div>

        </div>



        <div className="text-sm text-base-content/70 space-y-2">

          <p className="flex items-start gap-2">

            <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-primary" aria-hidden />

            <span>

              {concert.venue} · {concert.city}, {concert.state}

            </span>

          </p>

          <p className="flex items-center gap-2">

            <Calendar className="h-4 w-4 shrink-0 text-primary" aria-hidden />

            <span>{formatDate(concert.concert_date)}</span>

          </p>

        </div>



        <div className="divider my-0" />



        <div className="grid grid-cols-2 gap-4">

          <MetricBox

            label="Total cost"

            value={formatCurrency(total)}

            highlight

          />

          <MetricBox

            label="Cost per hour"

            value={costPerHour !== null ? formatCurrency(costPerHour) : "—"}

          />

          <MetricBox

            label="Fun Points per $100"

            value={funPoints !== null ? funPoints.toFixed(2) : "—"}

            className="col-span-2"

          />

        </div>



        {topCategories.length > 0 && (

          <div className="flex flex-wrap gap-2">

            <span className={`${ui.helperText} w-full`}>Top costs</span>

            {topCategories.map((c) => (

              <span key={c.label} className="badge badge-outline">

                {c.label}: {formatCurrency(c.amount)}

              </span>

            ))}

          </div>

        )}



        {concert.notes && (

          <div className="rounded-lg bg-base-200 p-3 text-sm text-base-content/80">

            <span className="font-medium text-base-content">Notes: </span>

            {concert.notes}

          </div>

        )}

      </div>

    </article>

  );

}



function MetricBox({

  label,

  value,

  highlight,

  className = "",

}: {

  label: string;

  value: string;

  highlight?: boolean;

  className?: string;

}) {

  return (

    <div

      className={`rounded-lg bg-base-200/80 p-3 ${highlight ? "ring-2 ring-primary/30" : ""} ${className}`}

    >

      <p className={ui.helperText}>{label}</p>

      <p

        className={`font-bold text-base mt-0.5 ${highlight ? "text-primary text-lg" : ""}`}

      >

        {value}

      </p>

    </div>

  );

}

