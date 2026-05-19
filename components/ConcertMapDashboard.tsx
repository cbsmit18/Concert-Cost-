"use client";

import { ConcertWorldMap } from "@/components/ConcertWorldMap";
import {
  getConcertMapSummary,
  type ConcertMapInput,
} from "@/lib/concert-map-metrics";
import { getCountryCode } from "@/lib/concert-coordinates";
import { DASHBOARD_DEMO_CONCERTS } from "@/lib/dashboard-demo-concerts";
import { ui } from "@/lib/ui-classes";
import type { Concert } from "@/lib/types";
import { Building2, Map, MapPin, Route } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMemo, useState } from "react";

export type ConcertMapDashboardProps = {
  concerts: Concert[];
  /** When true and concerts is empty, show demo data for preview */
  enableSampleFallback?: boolean;
};

function MapSummaryCard({
  title,
  value,
  desc,
  icon: Icon,
}: {
  title: string;
  value: string;
  desc?: string;
  icon: LucideIcon;
}) {
  return (
    <div className={`${ui.surfaceCard} motion-safe-hover-lift`}>
      <div className="card-body p-5">
        <div className="flex items-center gap-3">
          <span className={ui.iconWrap} aria-hidden>
            <Icon className="h-5 w-5" />
          </span>
          <p className="text-xs font-medium uppercase tracking-wide text-base-content/50">
            {title}
          </p>
        </div>
        <p className="font-bold text-primary truncate mt-2 text-xl">{value}</p>
        {desc && <p className={`${ui.helperText} mt-1 line-clamp-2`}>{desc}</p>}
      </div>
    </div>
  );
}

const COUNTRY_NAMES: Record<string, string> = {
  US: "United States",
  GB: "United Kingdom",
  FR: "France",
  CA: "Canada",
  JP: "Japan",
  AU: "Australia",
};

export function ConcertMapDashboard({
  concerts,
  enableSampleFallback = true,
}: ConcertMapDashboardProps) {
  const usingDemo = enableSampleFallback && concerts.length === 0;
  const displayConcerts: ConcertMapInput[] = usingDemo
    ? DASHBOARD_DEMO_CONCERTS
    : concerts;

  const summary = useMemo(
    () => getConcertMapSummary(displayConcerts),
    [displayConcerts],
  );

  const [activePointId, setActivePointId] = useState<string | null>(null);
  const [activeCountryCode, setActiveCountryCode] = useState<string | null>(
    null,
  );

  const activePoint = activePointId
    ? displayConcerts.find((c) => c.id === activePointId)
    : null;

  const concertsInActiveCountry = activeCountryCode
    ? displayConcerts.filter(
        (c) => getCountryCode(c) === activeCountryCode,
      )
    : [];

  const favoriteVenueLabel = summary.favoriteVenue
    ? `${summary.favoriteVenue.venue} (${summary.favoriteVenue.count} show${summary.favoriteVenue.count === 1 ? "" : "s"})`
    : "—";

  const mostVisitedLabel = summary.mostVisitedState
    ? `${summary.mostVisitedState.stateName} (${summary.mostVisitedState.count})`
    : "—";

  return (
    <section aria-labelledby="concert-map-heading">
      <div className="flex flex-wrap items-end justify-between gap-2 mb-4">
        <h2 id="concert-map-heading" className="text-section-title">
          Concert Map
        </h2>
        {usingDemo && (
          <span className="badge badge-outline badge-primary text-xs">
            Sample data preview
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MapSummaryCard
          title="Total states visited"
          value={String(summary.totalStatesVisited)}
          icon={Map}
        />
        <MapSummaryCard
          title="Most visited state"
          value={mostVisitedLabel}
          icon={MapPin}
        />
        <MapSummaryCard
          title="Favorite venue"
          value={favoriteVenueLabel}
          icon={Building2}
        />
        <MapSummaryCard
          title="Furthest trip traveled"
          value={summary.furthestTripLabel}
          icon={Route}
        />
      </div>

      <div className={`${ui.surfaceCard} p-5 sm:p-6`}>
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_minmax(12rem,16rem)] gap-6">
          <ConcertWorldMap
            concerts={displayConcerts}
            activePointId={activePointId}
            activeCountryCode={activeCountryCode}
            onPointChange={setActivePointId}
            onCountryChange={setActiveCountryCode}
          />

          <aside className="flex flex-col gap-4">
            <div className="rounded-xl bg-base-200/60 border border-base-300/50 p-4 min-h-[8rem]">
              <p className="text-xs font-medium uppercase tracking-wide text-base-content/50 mb-2">
                Map detail
              </p>
              {activePoint ? (
                <>
                  <p className="text-lg font-bold text-primary">
                    {activePoint.concert_name}
                  </p>
                  <p className={`${ui.bodyText} mt-1`}>
                    {activePoint.venue} · {activePoint.city}
                    {activePoint.state ? `, ${activePoint.state}` : ""}
                  </p>
                </>
              ) : activeCountryCode ? (
                <>
                  <p className="text-lg font-bold text-primary">
                    {COUNTRY_NAMES[activeCountryCode] ?? activeCountryCode}
                  </p>
                  <p className={`${ui.bodyText} mt-1`}>
                    {concertsInActiveCountry.length} concert
                    {concertsInActiveCountry.length === 1 ? "" : "s"}
                  </p>
                  <ul
                    className={`${ui.helperText} mt-3 space-y-1 max-h-32 overflow-y-auto`}
                  >
                    {concertsInActiveCountry.slice(0, 5).map((c) => (
                      <li key={c.id} className="truncate">
                        {c.concert_name}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className={ui.helperText}>
                  Hover or click a country or pin on the world map for details.
                </p>
              )}
            </div>

            <div className="text-sm text-base-content/70">
              <p>
                <span className="font-medium text-base-content">
                  Concerts by state:
                </span>{" "}
                {summary.countsByState.length === 0
                  ? "No state data yet."
                  : summary.countsByState
                      .slice(0, 6)
                      .map((s) => `${s.stateCode} (${s.count})`)
                      .join(", ")}
                {summary.countsByState.length > 6 ? "…" : ""}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
