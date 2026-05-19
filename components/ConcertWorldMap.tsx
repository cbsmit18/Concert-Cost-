"use client";

import {
  geographyCountryCode,
  getCountryConcertCounts,
  getConcertMapPoints,
  type ConcertMapPoint,
  type LngLat,
} from "@/lib/concert-coordinates";
import type { ConcertMapInput } from "@/lib/concert-map-metrics";
import { ui } from "@/lib/ui-classes";
import { Minus, Plus, RotateCcw, Target } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";

const WORLD_GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const DEFAULT_CENTER: [number, number] = [0, 20];
const DEFAULT_ZOOM = 1;
const MIN_ZOOM = 1;
const MAX_ZOOM = 12;

type MapPosition = {
  coordinates: [number, number];
  zoom: number;
};

type ConcertWorldMapProps = {
  concerts: ConcertMapInput[];
  activePointId: string | null;
  activeCountryCode: string | null;
  onPointChange: (pointId: string | null) => void;
  onCountryChange: (countryCode: string | null) => void;
};

function fillForCount(count: number, max: number): string {
  if (count <= 0 || max <= 0)
    return "color-mix(in oklch, var(--color-base-300) 85%, transparent)";
  const t = 0.2 + (count / max) * 0.65;
  return `color-mix(in oklch, var(--color-primary) ${Math.round(t * 100)}%, var(--color-base-200))`;
}

function getViewForPoints(points: ConcertMapPoint[]): MapPosition {
  if (points.length === 0) {
    return { coordinates: DEFAULT_CENTER, zoom: DEFAULT_ZOOM };
  }

  const lngs = points.map((p) => p.coordinates[0]);
  const lats = points.map((p) => p.coordinates[1]);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);

  const center: [number, number] = [
    (minLng + maxLng) / 2,
    (minLat + maxLat) / 2,
  ];

  const lngSpan = maxLng - minLng;
  const latSpan = maxLat - minLat;
  const span = Math.max(lngSpan, latSpan, 0.5);

  let zoom = 1;
  if (span < 4) zoom = 5;
  else if (span < 12) zoom = 3.5;
  else if (span < 35) zoom = 2.2;
  else if (span < 80) zoom = 1.5;
  else zoom = 1.1;

  if (points.length === 1) zoom = Math.min(zoom + 1.5, MAX_ZOOM);

  return { coordinates: center, zoom };
}

export function ConcertWorldMap({
  concerts,
  activePointId,
  activeCountryCode,
  onPointChange,
  onCountryChange,
}: ConcertWorldMapProps) {
  const points = useMemo(() => getConcertMapPoints(concerts), [concerts]);
  const countryCounts = useMemo(
    () => getCountryConcertCounts(concerts),
    [concerts],
  );
  const maxCountryCount = useMemo(
    () => Math.max(0, ...Array.from(countryCounts.values())),
    [countryCounts],
  );

  const concertsView = useMemo(() => getViewForPoints(points), [points]);

  const [position, setPosition] = useState<MapPosition>({
    coordinates: DEFAULT_CENTER,
    zoom: DEFAULT_ZOOM,
  });

  const clampZoom = useCallback(
    (z: number) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z)),
    [],
  );

  const handleZoomIn = () => {
    setPosition((prev) => ({
      ...prev,
      zoom: clampZoom(prev.zoom * 1.4),
    }));
  };

  const handleZoomOut = () => {
    setPosition((prev) => ({
      ...prev,
      zoom: clampZoom(prev.zoom / 1.4),
    }));
  };

  const handleReset = () => {
    setPosition({
      coordinates: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
    });
  };

  const handleFitConcerts = () => {
    setPosition(concertsView);
  };

  return (
    <div
      className="rounded-xl border border-base-300/60 bg-base-200/40 overflow-hidden relative"
      role="group"
      aria-label="World concert map"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 pt-4 pb-2">
        <p className={ui.helperText}>
          Drag to pan, scroll or use buttons to zoom. Click pins for details.
        </p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="btn btn-sm btn-ghost btn-square"
            onClick={handleZoomOut}
            aria-label="Zoom out"
            title="Zoom out"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="text-xs tabular-nums min-w-[2.5rem] text-center text-base-content/70">
            {Math.round(position.zoom * 100)}%
          </span>
          <button
            type="button"
            className="btn btn-sm btn-ghost btn-square"
            onClick={handleZoomIn}
            aria-label="Zoom in"
            title="Zoom in"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="btn btn-sm btn-ghost gap-1"
            onClick={handleFitConcerts}
            disabled={points.length === 0}
            aria-label="Zoom to concerts"
            title="Zoom to concerts"
          >
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">Fit shows</span>
          </button>
          <button
            type="button"
            className="btn btn-sm btn-ghost btn-square"
            onClick={handleReset}
            aria-label="Reset map view"
            title="Reset view"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="w-full aspect-[2/1] min-h-[280px] max-h-[420px] bg-base-200/80 touch-none">
        <ComposableMap
          projection="geoEqualEarth"
          projectionConfig={{ scale: 155 }}
          width={800}
          height={400}
          style={{ width: "100%", height: "100%" }}
        >
          <ZoomableGroup
            zoom={position.zoom}
            center={position.coordinates}
            minZoom={MIN_ZOOM}
            maxZoom={MAX_ZOOM}
            onMoveEnd={(next) => setPosition(next)}
          >
            <Geographies geography={WORLD_GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const countryCode = geographyCountryCode(geo);
                  const count = countryCode
                    ? (countryCounts.get(countryCode) ?? 0)
                    : 0;
                  const isActive = countryCode === activeCountryCode;

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={() =>
                        countryCode &&
                        count > 0 &&
                        onCountryChange(countryCode)
                      }
                      onMouseLeave={() => onCountryChange(null)}
                      onClick={() =>
                        countryCode &&
                        count > 0 &&
                        onCountryChange(isActive ? null : countryCode)
                      }
                      style={{
                        default: {
                          fill: fillForCount(count, maxCountryCount),
                          stroke: "var(--color-base-300)",
                          strokeWidth: 0.4 / position.zoom,
                          outline: "none",
                          cursor: count > 0 ? "pointer" : "default",
                        },
                        hover: {
                          fill: fillForCount(
                            Math.max(count, 1),
                            maxCountryCount,
                          ),
                          stroke: "var(--color-primary)",
                          strokeWidth: 0.75 / position.zoom,
                          outline: "none",
                        },
                        pressed: { outline: "none" },
                      }}
                      className={isActive ? "opacity-100" : undefined}
                    />
                  );
                })
              }
            </Geographies>
            {points.map((point) => (
              <MapMarker
                key={point.id}
                point={point}
                isActive={point.id === activePointId}
                zoom={position.zoom}
                onSelect={onPointChange}
              />
            ))}
          </ZoomableGroup>
        </ComposableMap>
      </div>
    </div>
  );
}

function MapMarker({
  point,
  isActive,
  zoom,
  onSelect,
}: {
  point: ConcertMapPoint;
  isActive: boolean;
  zoom: number;
  onSelect: (id: string | null) => void;
}) {
  const baseR = 5 / Math.sqrt(zoom);
  const activeR = 7 / Math.sqrt(zoom);
  const ringR = 11 / Math.sqrt(zoom);

  return (
    <Marker coordinates={point.coordinates as LngLat}>
      <g
        onMouseEnter={() => onSelect(point.id)}
        onMouseLeave={() => onSelect(null)}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(isActive ? null : point.id);
        }}
        style={{ cursor: "pointer" }}
        role="button"
        aria-label={`${point.name} at ${point.venue}`}
      >
        <circle
          r={isActive ? activeR : baseR}
          className="fill-primary stroke-primary-content"
          strokeWidth={1.5 / zoom}
        />
        {isActive && (
          <circle
            r={ringR}
            className="fill-none stroke-primary"
            strokeWidth={1.5 / zoom}
            opacity={0.5}
          />
        )}
      </g>
    </Marker>
  );
}
