"use client";



import { AlertBanner } from "@/components/ui/AlertBanner";

import { COST_FIELDS, getTotalCostFromParts } from "@/lib/concert-metrics";

import { ui } from "@/lib/ui-classes";

import { createClient } from "@/lib/supabase/client";

import { useRouter } from "next/navigation";

import { useMemo, useState } from "react";

import { toast } from "sonner";



const emptyCosts = () =>

  Object.fromEntries(COST_FIELDS.map(({ key }) => [key, "0"])) as Record<

    (typeof COST_FIELDS)[number]["key"],

    string

  >;



const initialState = () => ({

  concert_name: "",

  artist: "",

  venue: "",

  city: "",

  state: "",

  concert_date: "",

  distance_from_home: "",

  hours_at_event: "3",

  notes: "",

  fun_rating: 7,

  ...emptyCosts(),

});



export function ConcertForm() {

  const router = useRouter();

  const [form, setForm] = useState(initialState);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [ratingPulse, setRatingPulse] = useState(false);



  const costNumbers = useMemo(

    () =>

      Object.fromEntries(

        COST_FIELDS.map(({ key }) => [key, parseFloat(form[key]) || 0]),

      ) as Record<(typeof COST_FIELDS)[number]["key"], number>,

    [form],

  );



  const totalCost = getTotalCostFromParts(costNumbers);



  function updateField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {

    setForm((prev) => ({ ...prev, [key]: value }));

    if (key === "fun_rating") {

      setRatingPulse(true);

      window.setTimeout(() => setRatingPulse(false), 200);

    }

  }



  async function handleSubmit(e: React.FormEvent) {

    e.preventDefault();

    setLoading(true);

    setError(null);



    const supabase = createClient();

    const {

      data: { user },

    } = await supabase.auth.getUser();



    if (!user) {

      setError("You must be logged in to save a concert.");

      setLoading(false);

      return;

    }



    const { error: insertError } = await supabase.from("concerts").insert({

      user_id: user.id,

      concert_name: form.concert_name.trim(),

      artist: form.artist.trim(),

      venue: form.venue.trim(),

      city: form.city.trim(),

      state: form.state.trim(),

      concert_date: form.concert_date,

      distance_from_home: parseFloat(form.distance_from_home) || 0,

      hours_at_event: parseFloat(form.hours_at_event) || 1,

      ticket_cost: costNumbers.ticket_cost,

      ticket_fees: costNumbers.ticket_fees,

      parking_cost: costNumbers.parking_cost,

      food_drink_cost: costNumbers.food_drink_cost,

      merchandise_cost: costNumbers.merchandise_cost,

      lodging_cost: costNumbers.lodging_cost,

      travel_cost: costNumbers.travel_cost,

      other_cost: costNumbers.other_cost,

      fun_rating: form.fun_rating,

      notes: form.notes.trim() || null,

    });



    setLoading(false);



    if (insertError) {

      setError(

        insertError.message.includes("duplicate")

          ? "Something went wrong saving this concert. Please try again."

          : insertError.message,

      );

      return;

    }



    toast.success("Concert saved!", {

      description: "View it on My Concerts or add another show.",

    });

    setForm(initialState());

    router.refresh();

  }



  return (

    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">

      {error && (

        <AlertBanner type="error" message={error} onDismiss={() => setError(null)} />

      )}



      <SectionCard step="Step 1" title="Concert details" subtitle="Tell us where you went and when.">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">

          <Field label="Concert name" required>

            <input

              className="input input-bordered input-sm md:input-md w-full"

              value={form.concert_name}

              onChange={(e) => updateField("concert_name", e.target.value)}

              required

            />

          </Field>

          <Field label="Artist or band" required>

            <input

              className="input input-bordered input-sm md:input-md w-full"

              value={form.artist}

              onChange={(e) => updateField("artist", e.target.value)}

              required

            />

          </Field>

          <Field label="Venue" required>

            <input

              className="input input-bordered input-sm md:input-md w-full"

              value={form.venue}

              onChange={(e) => updateField("venue", e.target.value)}

              required

            />

          </Field>

          <Field label="City" required>

            <input

              className="input input-bordered input-sm md:input-md w-full"

              value={form.city}

              onChange={(e) => updateField("city", e.target.value)}

              required

            />

          </Field>

          <Field label="State" required>

            <input

              className="input input-bordered input-sm md:input-md w-full"

              value={form.state}

              onChange={(e) => updateField("state", e.target.value)}

              required

            />

          </Field>

          <Field label="Concert date" required>

            <input

              type="date"

              className="input input-bordered input-sm md:input-md w-full"

              value={form.concert_date}

              onChange={(e) => updateField("concert_date", e.target.value)}

              required

            />

          </Field>

          <Field label="Distance from home (miles)">

            <input

              type="number"

              min="0"

              step="0.1"

              className="input input-bordered input-sm md:input-md w-full"

              value={form.distance_from_home}

              onChange={(e) =>

                updateField("distance_from_home", e.target.value)

              }

            />

          </Field>

          <Field label="Approx. hours at event" required>

            <input

              type="number"

              min="0.5"

              step="0.5"

              className="input input-bordered input-sm md:input-md w-full"

              value={form.hours_at_event}

              onChange={(e) => updateField("hours_at_event", e.target.value)}

              required

            />

            <p className={ui.helperText + " mt-1"}>

              Used to calculate cost per hour.

            </p>

          </Field>

          <Field label="Notes" className="md:col-span-2">

            <textarea

              className="textarea textarea-bordered textarea-sm md:textarea-md w-full"

              rows={3}

              value={form.notes}

              onChange={(e) => updateField("notes", e.target.value)}

              placeholder="Optional memories, setlist highlights, etc."

            />

          </Field>

        </div>

      </SectionCard>



      <SectionCard step="Step 2" title="Costs" subtitle="Enter what you spent. Leave blank fields as zero.">

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">

          {COST_FIELDS.map(({ key, label }) => (

            <Field key={key} label={label}>

              <label className="input input-bordered input-sm md:input-md flex items-center gap-2 w-full">

                <span className="text-base-content/50">$</span>

                <input

                  type="number"

                  min="0"

                  step="0.01"

                  className="grow min-h-10"

                  value={form[key]}

                  onChange={(e) => updateField(key, e.target.value)}

                />

              </label>

            </Field>

          ))}

        </div>

        <div

          className="mt-4 rounded-xl bg-primary/10 px-4 py-3 flex justify-between items-center border border-primary/20 sticky bottom-24 sm:bottom-auto sm:static z-10 shadow-md sm:shadow-none"

          aria-live="polite"

        >

          <span className="font-medium">Total concert cost</span>

          <span className="text-2xl font-bold text-primary">

            ${totalCost.toFixed(2)}

          </span>

        </div>

      </SectionCard>



      <SectionCard

        step="Step 3"

        title="How fun was it?"

        subtitle="Rate from 1 (Terrible Time) to 10 (Best Time Ever)."

      >

        <div className="flex justify-between text-xs text-base-content/60">

          <span>Terrible Time (1)</span>

          <span

            className={`font-semibold text-lg text-primary transition-transform duration-200 ${

              ratingPulse ? "scale-105" : "scale-100"

            }`}

          >

            {form.fun_rating}

          </span>

          <span>Best Time Ever (10)</span>

        </div>

        <input

          type="range"

          min={1}

          max={10}

          step={1}

          value={form.fun_rating}

          onChange={(e) =>

            updateField("fun_rating", parseInt(e.target.value, 10))

          }

          className="range range-primary"

        />

      </SectionCard>



      <button

        type="submit"

        className="btn btn-primary btn-lg min-h-12 w-full sm:w-auto"

        disabled={loading}

      >

        {loading && (

          <span className="loading loading-spinner loading-sm" aria-hidden />

        )}

        {loading ? "Saving…" : "Save concert"}

      </button>

    </form>

  );

}



function SectionCard({

  step,

  title,

  subtitle,

  children,

}: {

  step: string;

  title: string;

  subtitle: string;

  children: React.ReactNode;

}) {

  return (

    <div className={`${ui.surfaceCard} motion-safe-hover-lift`}>

      <div className="card-body">

        <div className="flex items-center gap-2 mb-1">

          <span className="badge badge-primary badge-outline">{step}</span>

          <h2 className="text-section-title">{title}</h2>

        </div>

        <p className={ui.helperText + " -mt-1"}>{subtitle}</p>

        {children}

      </div>

    </div>

  );

}



function Field({

  label,

  children,

  required,

  className = "",

}: {

  label: string;

  children: React.ReactNode;

  required?: boolean;

  className?: string;

}) {

  return (

    <label className={`form-control w-full ${className}`}>

      <span className="label-text font-medium">

        {label}

        {required && <span className="text-error"> *</span>}

      </span>

      {children}

    </label>

  );

}

