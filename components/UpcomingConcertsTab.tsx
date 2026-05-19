"use client";



import { UpcomingConcertCard } from "@/components/UpcomingConcertCard";

import { AlertBanner } from "@/components/ui/AlertBanner";

import type { UpcomingConcert } from "@/lib/upcoming-concerts/types";

import { ui } from "@/lib/ui-classes";

import { useEffect, useState } from "react";



const SEARCH_CITY_KEY = "concert-tracker-search-city";



type SearchStatus = "idle" | "loading" | "success" | "error";



export function UpcomingConcertsTab() {

  const [city, setCity] = useState("");

  const [artist, setArtist] = useState("");

  const [status, setStatus] = useState<SearchStatus>("idle");

  const [results, setResults] = useState<UpcomingConcert[]>([]);



  useEffect(() => {

    const saved = localStorage.getItem(SEARCH_CITY_KEY);

    if (saved) setCity(saved);

  }, []);



  async function handleSearch(e: React.FormEvent) {

    e.preventDefault();

    const trimmedCity = city.trim();

    if (!trimmedCity) return;



    setStatus("loading");

    setResults([]);



    try {

      const params = new URLSearchParams({ city: trimmedCity });

      if (artist.trim()) params.set("artist", artist.trim());



      const res = await fetch(`/api/upcoming-concerts?${params.toString()}`);

      if (!res.ok) {

        setStatus("error");

        return;

      }



      const data = (await res.json()) as { concerts: UpcomingConcert[] };

      setResults(data.concerts ?? []);

      localStorage.setItem(SEARCH_CITY_KEY, trimmedCity);

      setStatus("success");

    } catch {

      setStatus("error");

    }

  }



  return (

    <div className="space-y-6">

      <div className={`${ui.surfaceCard} motion-safe-hover-lift`}>

        <div className="card-body gap-4">

          <div>

            <h2 className="text-section-title">Find upcoming shows</h2>

            <p className={ui.helperText}>

              Search by city or area. Add an artist name to narrow results.

            </p>

          </div>



          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <label className="form-control w-full sm:col-span-1">

              <span className="label-text font-medium">

                City / area <span className="text-error">*</span>

              </span>

              <input

                type="text"

                className="input input-bordered input-sm md:input-md w-full"

                placeholder="e.g. Los Angeles, Chicago, NY"

                value={city}

                onChange={(e) => setCity(e.target.value)}

                required

                disabled={status === "loading"}

              />

            </label>

            <label className="form-control w-full sm:col-span-1">

              <span className="label-text font-medium">Artist (optional)</span>

              <input

                type="text"

                className="input input-bordered input-sm md:input-md w-full"

                placeholder="e.g. Ava Stone"

                value={artist}

                onChange={(e) => setArtist(e.target.value)}

                disabled={status === "loading"}

              />

            </label>

            <div className="sm:col-span-2">

              <button

                type="submit"

                className="btn btn-primary btn-md min-h-11"

                disabled={status === "loading" || !city.trim()}

              >

                {status === "loading" && (

                  <span

                    className="loading loading-spinner loading-sm"

                    aria-hidden

                  />

                )}

                Search

              </button>

            </div>

          </form>

        </div>

      </div>



      {status === "loading" && (

        <div className="flex items-center gap-3 text-base-content/70 py-4">

          <span className="loading loading-spinner loading-md text-primary" />

          <span>Searching upcoming concerts…</span>

        </div>

      )}



      {status === "error" && (

        <AlertBanner type="error" message="Unable to load concerts right now." />

      )}



      {status === "success" && results.length === 0 && (

        <p className={`${ui.bodyText} text-center py-8`}>

          No upcoming concerts found for this search.

        </p>

      )}



      {status === "success" && results.length > 0 && (

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {results.map((concert) => (

            <UpcomingConcertCard key={concert.id} concert={concert} />

          ))}

        </div>

      )}

    </div>

  );

}

