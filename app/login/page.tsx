import { LoginForm } from "@/components/LoginForm";

import { ThemeSelector } from "@/components/ThemeSelector";

import { Check, Guitar } from "lucide-react";



export default function LoginPage() {

  return (

    <div className="min-h-screen flex flex-col bg-base-200">

      <header className="navbar bg-primary text-primary-content shadow-lg px-4 lg:px-8 min-h-[4.5rem]">

        <div className="flex-1">

          <span className="text-xl font-bold tracking-tight">

            Concert Cost Tracker

          </span>

        </div>

        <div className="flex-none">

          <ThemeSelector compact onPrimaryBar />

        </div>

      </header>



      <div className="hero flex-1 py-10 sm:py-12 lg:py-16 bg-gradient-to-br from-primary/10 via-base-200 to-secondary/10">

        <div className="hero-content app-container flex-col lg:flex-row gap-10 lg:gap-16 items-center w-full max-w-none px-4">

          <div className="flex-1 text-center lg:text-left max-w-xl w-full">

            <div className="inline-flex items-center justify-center rounded-2xl bg-primary/10 p-5 mb-6">

              <Guitar className="h-12 w-12 sm:h-16 sm:w-16 text-primary" aria-hidden />

            </div>

            <h1 className="text-page-title text-4xl sm:text-5xl leading-tight">

              Concert Cost Tracker

            </h1>

            <p className="py-4 text-lg text-base-content/80">

              A friendly place to remember every show, track what you spent, rate

              how much fun you had, and see which concerts were the best value.

            </p>

            <ul className="space-y-3 text-left text-base text-base-content/75 inline-block">

              <FeatureItem text="Log tickets, travel, food, merch, and more" />

              <FeatureItem text="See cost per hour and Fun Points per $100" />

              <FeatureItem text="Charts and stats on your personal dashboard" />

              <FeatureItem text="Your data is private — only you can see it" />

            </ul>



            <div className="hidden lg:block mt-10">

              <p className="text-xs font-semibold uppercase tracking-wide text-base-content/50 mb-3">

                After you log in

              </p>

              <div className="grid grid-cols-3 gap-3">

                <PreviewStat label="Total spent" value="$1,240" />

                <PreviewStat label="Concerts" value="6" />

                <PreviewStat label="Avg fun" value="8.4 / 10" />

              </div>

            </div>

          </div>



          <div className="w-full max-w-md shrink-0 px-0 sm:px-2">

            <LoginForm />

          </div>

        </div>

      </div>

    </div>

  );

}



function FeatureItem({ text }: { text: string }) {

  return (

    <li className="flex items-start gap-3">

      <span className="badge badge-primary badge-sm mt-1 shrink-0 p-1">

        <Check className="h-3 w-3" aria-hidden />

      </span>

      <span>{text}</span>

    </li>

  );

}



function PreviewStat({ label, value }: { label: string; value: string }) {

  return (

    <div className="surface-card motion-safe-hover-lift">

      <div className="p-4">

        <p className="text-helper">{label}</p>

        <p className="text-xl font-bold text-primary mt-1">{value}</p>

      </div>

    </div>

  );

}

