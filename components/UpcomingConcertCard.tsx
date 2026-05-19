import { ConcertExpensePredictor } from "@/components/ConcertExpensePredictor";
import { formatDate } from "@/lib/concert-metrics";

import type { UpcomingConcert } from "@/lib/upcoming-concerts/types";

import { ui } from "@/lib/ui-classes";

import { Calendar, ExternalLink, MapPin } from "lucide-react";



export function UpcomingConcertCard({ concert }: { concert: UpcomingConcert }) {

  const showArtistSubtitle =

    concert.artist.toLowerCase() !== concert.eventName.toLowerCase();



  return (

    <article

      className={`${ui.surfaceCard} motion-safe-hover-lift border-l-4 border-l-primary`}

    >

      <div className="card-body gap-4">

        <div>

          <h3 className="card-title text-lg leading-tight">{concert.eventName}</h3>

          {showArtistSubtitle && (

            <p className="text-sm text-primary font-medium">{concert.artist}</p>

          )}

        </div>



        <div className="text-sm text-base-content/70 space-y-2">

          <p className="flex items-center gap-2">

            <Calendar className="h-4 w-4 shrink-0 text-primary" aria-hidden />

            <span>{formatDate(concert.date)}</span>

          </p>

          <p className="flex items-start gap-2">

            <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-primary" aria-hidden />

            <span>

              {concert.venue} · {concert.city}, {concert.state}

            </span>

          </p>

        </div>



        {concert.ticketUrl ? (

          <a

            href={concert.ticketUrl}

            target="_blank"

            rel="noopener noreferrer"

            className="btn btn-outline btn-sm w-fit gap-2"

          >

            <ExternalLink className="h-4 w-4" aria-hidden />

            Get tickets

          </a>

        ) : (

          <p className={ui.helperText}>No ticket link available</p>

        )}

        <div className="border-t border-base-300/60 pt-4 mt-2">
          <ConcertExpensePredictor concert={concert} />
        </div>

      </div>

    </article>

  );

}

