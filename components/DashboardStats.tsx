import {
  formatCurrency,
  getDashboardSummary,
} from "@/lib/concert-metrics";
import { ui } from "@/lib/ui-classes";
import type { Concert } from "@/lib/types";
import {
  Clock,
  DollarSign,
  Mic2,
  PartyPopper,
  Sparkles,
  Star,
  Trophy,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const STAT_ICONS: Record<string, LucideIcon> = {
  "Total concerts": Mic2,
  "Total spent": DollarSign,
  "Avg cost per concert": Wallet,
  "Avg fun rating": Star,
  "Avg cost per hour": Clock,
  "Best value concert": Trophy,
  "Most expensive": Sparkles,
  "Highest fun rating": PartyPopper,
};

export function DashboardStats({ concerts }: { concerts: Concert[] }) {
  const s = getDashboardSummary(concerts);

  if (concerts.length === 0) {
    return null;
  }

  const headline = [
    { title: "Total concerts", value: String(s.totalConcerts), large: true },
    { title: "Total spent", value: formatCurrency(s.totalSpent), large: true },
  ];

  const items = [
    {
      title: "Avg cost per concert",
      value: formatCurrency(s.avgCostPerConcert),
    },
    {
      title: "Avg fun rating",
      value: s.avgFunRating.toFixed(1),
      desc: "out of 10",
    },
    {
      title: "Avg cost per hour",
      value:
        s.avgCostPerHour !== null ? formatCurrency(s.avgCostPerHour) : "—",
    },
    {
      title: "Best value concert",
      value: s.bestValue?.concert.concert_name ?? "—",
      desc: s.bestValue
        ? `${s.bestValue.funPoints.toFixed(2)} Fun Points per $100`
        : undefined,
    },
    {
      title: "Most expensive",
      value: s.mostExpensive?.concert.concert_name ?? "—",
      desc: s.mostExpensive
        ? formatCurrency(s.mostExpensive.total)
        : undefined,
    },
    {
      title: "Highest fun rating",
      value: s.highestFun?.concert.concert_name ?? "—",
      desc: s.highestFun ? `${s.highestFun.rating} / 10` : undefined,
    },
  ];

  return (
    <section>
      <h2 className="text-section-title mb-4">Summary stats</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        {headline.map((item) => (
          <StatCard key={item.title} {...item} />
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <StatCard key={item.title} {...item} />
        ))}
      </div>
    </section>
  );
}

function StatCard({
  title,
  value,
  desc,
  large,
}: {
  title: string;
  value: string;
  desc?: string;
  large?: boolean;
}) {
  const Icon = STAT_ICONS[title] ?? Mic2;

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
        <p
          className={`font-bold text-primary truncate mt-2 ${
            large ? "text-3xl" : "text-xl"
          }`}
        >
          {value}
        </p>
        {desc && (
          <p className={`${ui.helperText} mt-1 line-clamp-2`}>{desc}</p>
        )}
      </div>
    </div>
  );
}
