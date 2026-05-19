"use client";



import { AlertBanner } from "@/components/ui/AlertBanner";

import { getAuthErrorMessage } from "@/lib/auth-messages";

import { ui } from "@/lib/ui-classes";

import { createClient } from "@/lib/supabase/client";

import { useRouter } from "next/navigation";

import { useState } from "react";



export function LoginForm() {

  const router = useRouter();

  const [mode, setMode] = useState<"login" | "signup">("login");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState<{

    type: "error" | "success";

    text: string;

  } | null>(null);



  async function handleSubmit(e: React.FormEvent) {

    e.preventDefault();

    setLoading(true);

    setMessage(null);



    const supabase = createClient();



    if (mode === "signup") {

      const { error } = await supabase.auth.signUp({

        email,

        password,

        options: {

          emailRedirectTo: `${window.location.origin}/auth/callback`,

        },

      });

      setLoading(false);

      if (error) {

        setMessage({

          type: "error",

          text: getAuthErrorMessage(error.message),

        });

        return;

      }

      setMessage({

        type: "success",

        text: "Account created! Check your email to confirm, or log in if confirmation is turned off.",

      });

      return;

    }



    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (error) {

      setMessage({

        type: "error",

        text: getAuthErrorMessage(error.message),

      });

      return;

    }

    router.push("/dashboard");

    router.refresh();

  }



  return (

    <div className={`${ui.surfaceCard} w-full`}>

      <div className="card-body gap-5 p-6 sm:p-8">

        <div>

          <h2 className="text-section-title text-2xl">

            {mode === "login" ? "Welcome back" : "Create your account"}

          </h2>

          <p className={`${ui.helperText} mt-1`}>

            {mode === "login"

              ? "Log in to track your concerts and spending."

              : "Sign up to start logging concerts and costs."}

          </p>

        </div>



        <div role="tablist" className="tabs tabs-boxed bg-base-200 p-1">

          <button

            type="button"

            role="tab"

            className={`tab flex-1 min-h-11 transition-colors duration-200 ${

              mode === "login" ? "tab-active" : ""

            }`}

            onClick={() => setMode("login")}

          >

            Log in

          </button>

          <button

            type="button"

            role="tab"

            className={`tab flex-1 min-h-11 transition-colors duration-200 ${

              mode === "signup" ? "tab-active" : ""

            }`}

            onClick={() => setMode("signup")}

          >

            Sign up

          </button>

        </div>



        <form onSubmit={handleSubmit} className="space-y-5">

          <div className="rounded-box bg-base-200/60 p-4 space-y-4">

            <AlignedField id="email" label="Email">

              <input

                id="email"

                type="email"

                className="input input-bordered input-sm md:input-md w-full bg-base-100"

                value={email}

                onChange={(e) => setEmail(e.target.value)}

                required

                autoComplete="email"

                placeholder="you@example.com"

              />

            </AlignedField>

            <AlignedField id="password" label="Password">

              <input

                id="password"

                type="password"

                className="input input-bordered input-sm md:input-md w-full bg-base-100"

                value={password}

                onChange={(e) => setPassword(e.target.value)}

                required

                minLength={6}

                autoComplete={

                  mode === "login" ? "current-password" : "new-password"

                }

                placeholder="At least 6 characters"

              />

            </AlignedField>

          </div>



          {message && (

            <AlertBanner type={message.type} message={message.text} />

          )}



          <button

            type="submit"

            className="btn btn-primary btn-block btn-md min-h-11"

            disabled={loading}

          >

            {loading && (

              <span className="loading loading-spinner loading-sm" aria-hidden />

            )}

            {loading

              ? "Please wait…"

              : mode === "login"

                ? "Log in"

                : "Create account"}

          </button>

        </form>

      </div>

    </div>

  );

}



function AlignedField({

  id,

  label,

  children,

}: {

  id: string;

  label: string;

  children: React.ReactNode;

}) {

  return (

    <div className="form-control w-full">

      <label

        htmlFor={id}

        className="label py-0 pb-1 sm:hidden"

      >

        <span className="label-text font-medium">{label}</span>

      </label>

      <div className="flex flex-col gap-1 sm:grid sm:grid-cols-[5.5rem_1fr] sm:items-center sm:gap-x-4">

        <label

          htmlFor={id}

          className="hidden sm:block text-sm font-medium text-right text-base-content/80"

        >

          {label}

        </label>

        {children}

      </div>

    </div>

  );

}

