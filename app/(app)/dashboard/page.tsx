import { DashboardCharts } from "@/components/DashboardCharts";

import { DashboardStats } from "@/components/DashboardStats";

import { EmptyState } from "@/components/EmptyState";

import { PageHeader } from "@/components/PageHeader";

import { getUserConcerts } from "@/lib/concerts";

import Link from "next/link";



export default async function DashboardPage() {

  const concerts = await getUserConcerts();



  return (

    <>

      <PageHeader

        title="Dashboard"

        description="Your concert spending, fun ratings, and value metrics in one place."

      />



      {concerts.length === 0 ? (

        <EmptyState

          action={

            <Link href="/add" className="btn btn-primary">

              Add your first concert

            </Link>

          }

        />

      ) : (

        <div className="space-y-8">

          <DashboardStats concerts={concerts} />

          <DashboardCharts concerts={concerts} />

        </div>

      )}

    </>

  );

}

