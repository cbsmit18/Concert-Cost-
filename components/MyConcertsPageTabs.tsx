"use client";

import { ConcertForm } from "@/components/ConcertForm";
import { ConcertGrid } from "@/components/ConcertGrid";
import { EmptyState } from "@/components/EmptyState";
import { ui } from "@/lib/ui-classes";
import type { Concert } from "@/lib/types";
import { useState } from "react";

type TabId = "mine" | "add";

export function MyConcertsPageTabs({
  concerts,
  initialTab = "mine",
}: {
  concerts: Concert[];
  initialTab?: TabId;
}) {
  const [activeTab, setActiveTab] = useState<TabId>(initialTab);

  return (
    <>
      <section
        className="mb-6 rounded-2xl border border-base-300 bg-base-100 p-3 shadow-sm"
        aria-label="My concerts views"
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
            aria-selected={activeTab === "add"}
            className={`tab flex-1 min-h-11 transition-colors duration-200 ${
              activeTab === "add" ? "tab-active font-semibold" : ""
            }`}
            onClick={() => setActiveTab("add")}
          >
            Add Concert
          </button>
        </div>
      </section>

      {activeTab === "mine" ? (
        concerts.length === 0 ? (
          <EmptyState
            action={
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setActiveTab("add")}
              >
                Add your first concert
              </button>
            }
          />
        ) : (
          <ConcertGrid concerts={concerts} />
        )
      ) : (
        <ConcertForm />
      )}
    </>
  );
}
