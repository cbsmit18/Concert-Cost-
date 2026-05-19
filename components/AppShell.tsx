"use client";



import { PageFade } from "@/components/PageFade";

import { ThemeSelector } from "@/components/ThemeSelector";

import { createClient } from "@/lib/supabase/client";

import { BarChart3, ListMusic, LogOut, PlusCircle } from "lucide-react";

import Link from "next/link";

import { usePathname, useRouter } from "next/navigation";



const NAV = [

  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },

  { href: "/add", label: "Add Concert", icon: PlusCircle },

  { href: "/concerts", label: "My Concerts", icon: ListMusic },

];



export function AppShell({

  children,

  userEmail,

}: {

  children: React.ReactNode;

  userEmail: string;

}) {

  const pathname = usePathname();

  const router = useRouter();



  async function handleLogout() {

    const supabase = createClient();

    await supabase.auth.signOut();

    router.push("/login");

    router.refresh();

  }



  return (

    <div className="min-h-screen bg-base-200 flex flex-col">

      <header className="navbar bg-primary text-primary-content shadow-lg px-4 lg:px-8 min-h-[4.5rem]">

        <div className="flex-1 flex-col items-start gap-0.5 min-w-0">

          <span className="text-xl font-bold tracking-tight">

            Concert Cost Tracker

          </span>

          <span className="text-xs opacity-90 hidden sm:block font-normal">

            Track spending, fun, and value for every show you attend

          </span>

        </div>

        <div className="flex-none gap-2 items-center flex-wrap justify-end">

          <ThemeSelector compact onPrimaryBar />

          <div className="hidden md:flex flex-col items-end max-w-[12rem]">

            <span className="text-[10px] uppercase opacity-70">Signed in as</span>

            <span className="text-sm truncate w-full text-right">{userEmail}</span>

          </div>

          <button

            type="button"

            className="btn btn-sm btn-outline border-primary-content/40 text-primary-content hover:bg-primary-content hover:text-primary gap-1 min-h-11"

            onClick={handleLogout}

          >

            <LogOut className="h-4 w-4" aria-hidden />

            <span className="hidden sm:inline">Log out</span>

          </button>

        </div>

      </header>



      <div className="hidden sm:block bg-base-100 border-b border-base-300 shadow-sm sticky top-0 z-20">

        <div className="app-container">

          <div role="tablist" className="tabs tabs-lg tabs-bordered overflow-x-auto flex-nowrap">

            {NAV.map(({ href, label, icon: Icon }) => (

              <Link

                key={href}

                href={href}

                role="tab"

                className={`tab gap-2 whitespace-nowrap transition-colors duration-200 min-h-12 ${

                  pathname === href ? "tab-active font-semibold" : ""

                }`}

              >

                <Icon className="h-4 w-4" aria-hidden />

                {label}

              </Link>

            ))}

          </div>

        </div>

      </div>



      <div className="sm:hidden bg-base-100 border-b border-base-300 px-4 py-3 flex flex-col gap-2">

        <p className="text-xs text-base-content/60">

          Signed in as{" "}

          <span className="font-medium text-base-content">{userEmail}</span>

        </p>

      </div>



      <main className="flex-1 app-container py-8 pb-28 sm:pb-8">

        <PageFade>{children}</PageFade>

      </main>



      <nav className="btm-nav btm-nav-md sm:hidden bg-base-100 border-t border-base-300 z-30">

        {NAV.map(({ href, label, icon: Icon }) => (

          <Link

            key={href}

            href={href}

            className={`min-h-[3.5rem] transition-colors duration-200 ${

              pathname === href ? "active text-primary" : ""

            }`}

          >

            <Icon className="h-5 w-5" aria-hidden />

            <span className="btm-nav-label text-xs">{label}</span>

          </Link>

        ))}

      </nav>

    </div>

  );

}



