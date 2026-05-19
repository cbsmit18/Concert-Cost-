"use client";

import {
  formatCurrency,
  getCategoryTotals,
  getFunPointsPer100,
  getTotalCost,
  truncateLabel,
} from "@/lib/concert-metrics";
import { ui } from "@/lib/ui-classes";
import type { Concert } from "@/lib/types";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const CHART_COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#06b6d4",
  "#f97316",
  "#64748b",
];

const ANIMATION_MS = 800;

export function DashboardCharts({ concerts }: { concerts: Concert[] }) {
  if (concerts.length === 0) return null;

  const categoryData = getCategoryTotals(concerts);
  const byConcert = concerts.map((c) => ({
    name: truncateLabel(c.concert_name),
    fullName: c.concert_name,
    totalCost: getTotalCost(c),
    funRating: c.fun_rating,
    funPoints: getFunPointsPer100(c) ?? 0,
  }));

  return (
    <section className="mt-10">
      <h2 className="text-section-title mb-4">Charts</h2>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ChartCard title="Spending by cost category">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                animationDuration={ANIMATION_MS}
                label={({ name, percent }) =>
                  `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                }
              >
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v) => formatCurrency(Number(v))}
                labelFormatter={(label) => `Category: ${label}`}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Total cost by concert">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={byConcert} margin={{ bottom: 48, left: 8, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.25} />
              <XAxis dataKey="name" angle={-25} textAnchor="end" height={60} />
              <YAxis tickFormatter={(v) => `$${v}`} />
              <Tooltip
                formatter={(v) => [formatCurrency(Number(v)), "Total cost"]}
                labelFormatter={(_, payload) =>
                  payload?.[0]?.payload?.fullName ?? "Concert"
                }
              />
              <Bar
                dataKey="totalCost"
                fill="#6366f1"
                name="Total cost"
                radius={[4, 4, 0, 0]}
                animationDuration={ANIMATION_MS}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Fun rating by concert">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={byConcert} margin={{ bottom: 48, left: 8, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.25} />
              <XAxis dataKey="name" angle={-25} textAnchor="end" height={60} />
              <YAxis domain={[0, 10]} />
              <Tooltip
                formatter={(v) => [`${v} out of 10`, "Fun rating"]}
                labelFormatter={(_, payload) =>
                  payload?.[0]?.payload?.fullName ?? "Concert"
                }
              />
              <Bar
                dataKey="funRating"
                fill="#ec4899"
                name="Fun rating"
                radius={[4, 4, 0, 0]}
                animationDuration={ANIMATION_MS}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Fun Points per $100 by concert">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={byConcert} margin={{ bottom: 48, left: 8, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.25} />
              <XAxis dataKey="name" angle={-25} textAnchor="end" height={60} />
              <YAxis />
              <Tooltip
                formatter={(v) => [Number(v).toFixed(2), "Fun Points per $100"]}
                labelFormatter={(_, payload) =>
                  payload?.[0]?.payload?.fullName ?? "Concert"
                }
              />
              <Bar
                dataKey="funPoints"
                fill="#10b981"
                name="Fun Points per $100"
                radius={[4, 4, 0, 0]}
                animationDuration={ANIMATION_MS}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </section>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`${ui.surfaceCard} motion-safe-hover-lift`}>
      <div className="card-body p-4 sm:p-6">
        <h3 className="text-section-title text-base mb-2">{title}</h3>
        <div className="w-full min-h-[280px] pt-2">{children}</div>
      </div>
    </div>
  );
}
