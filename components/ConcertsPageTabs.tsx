"use client";



import { ConcertGrid } from "@/components/ConcertGrid";

import { EmptyState } from "@/components/EmptyState";

import { UpcomingConcertsTab } from "@/components/UpcomingConcertsTab";

import { ui } from "@/lib/ui-classes";

import type { Concert } from "@/lib/types";

import Link from "next/link";

import { useState } from "react";



type TabId = "mine" | "upcoming";



export function ConcertsPageTabs({ concerts }: { concerts: Concert[] }) {

  const [activeTab, setActiveTab] = useState<TabId>("mine");



  return (

    <>

      <section

        className="mb-6 rounded-2xl border border-base-300 bg-base-100 p-3 shadow-sm"

        aria-label="Concert views"

      >

        <p className={`${ui.helperText} mb-2 px-1 font-medium`}>Browse</p>

        <div

          role="tablist"

          className="tabs tabs-boxed bg-base-200 p-1 w-full"

        >

          <button

            type="button"

            role="tab"

            aria-selected={activeTab === "mine"}

            className={`tab flex-1 min-h-11 transition-colors duration-200 ${

              activeTab === "mine" ? "tab-active font-semibold" : ""

            }`}

            onClick={() => setActiveTab("mine")}

          >

            My Concerts

          </button>

          <button

            type="button"

            role="tab"

            aria-selected={activeTab === "upcoming"}

            className={`tab flex-1 min-h-11 transition-colors duration-200 ${

              activeTab === "upcoming" ? "tab-active font-semibold" : ""

            }`}

            onClick={() => setActiveTab("upcoming")}

          >

            Upcoming Concerts

          </button>

        </div>

      </section>



      {activeTab === "mine" ? (

        concerts.length === 0 ? (

          <EmptyState

            action={

              <Link href="/add" className="btn btn-primary">

                Add your first concert

              </Link>

            }

          />

        ) : (

          <ConcertGrid concerts={concerts} />

        )

      ) : (

        <UpcomingConcertsTab />

      )}

    </>

  );

}

