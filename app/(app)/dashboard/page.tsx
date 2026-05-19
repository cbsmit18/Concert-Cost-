import { ConcertMapDashboard } from "@/components/ConcertMapDashboard";
import { DashboardCharts } from "@/components/DashboardCharts";
import { DashboardStats } from "@/components/DashboardStats";
import { PageHeader } from "@/components/PageHeader";
import { DASHBOARD_DEMO_CONCERTS } from "@/lib/dashboard-demo-concerts";
import { getUserConcerts } from "@/lib/concerts";
import Link from "next/link";

export default async function DashboardPage() {
  const loggedConcerts = await getUserConcerts();
  const usingDemo = loggedConcerts.length === 0;
  const concerts = usingDemo ? DASHBOARD_DEMO_CONCERTS : loggedConcerts;

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Your concert spending, fun ratings, and value metrics in one place."
      />

      {usingDemo && (
        <div className="alert alert-info shadow-sm mb-6">
          <span>
            Showing <strong>demo concerts</strong> so you can explore the
            dashboard.{" "}
            <Link href="/concerts?tab=add" className="link link-primary">
              Log your first concert
            </Link>{" "}
            to replace this with your own data.
          </span>
        </div>
      )}

      <div className="space-y-8">
        <ConcertMapDashboard
          concerts={loggedConcerts}
          enableSampleFallback={usingDemo}
        />
        <DashboardStats concerts={concerts} />
        <DashboardCharts concerts={concerts} />
      </div>
    </>
  );
}
