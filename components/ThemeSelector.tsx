"use client";



import { useEffect, useState } from "react";

import { Palette } from "lucide-react";



const THEMES = ["light", "dark", "corporate", "emerald", "synthwave"] as const;



const STORAGE_KEY = "concert-tracker-theme";



const themeLabels: Record<(typeof THEMES)[number], string> = {

  light: "Light",

  dark: "Dark",

  corporate: "Corporate",

  emerald: "Emerald",

  synthwave: "Synthwave",

};



export function ThemeSelector({

  className = "",

  compact = false,

  onPrimaryBar = false,

}: {

  className?: string;

  compact?: boolean;

  onPrimaryBar?: boolean;

}) {

  const [theme, setTheme] = useState("light");

  const [mounted, setMounted] = useState(false);



  useEffect(() => {

    const saved = localStorage.getItem(STORAGE_KEY) ?? "light";

    setTheme(saved);

    document.documentElement.setAttribute("data-theme", saved);

    setMounted(true);

  }, []);



  function handleChange(next: string) {

    setTheme(next);

    localStorage.setItem(STORAGE_KEY, next);

    document.documentElement.setAttribute("data-theme", next);

  }



  const selectClass = onPrimaryBar

    ? "select select-bordered select-sm min-w-[8rem] bg-primary-content/10 text-primary-content border-primary-content/30"

    : "select select-bordered select-sm min-w-[8rem] bg-base-100";



  if (!mounted) {

    return (

      <select className={`${selectClass} ${className}`} disabled aria-label="Theme">

        <option>Theme</option>

      </select>

    );

  }



  return (

    <label

      className={`flex items-center gap-2 ${compact ? "" : "form-control w-full max-w-xs"} ${className}`}

    >

      <Palette className={`h-4 w-4 shrink-0 ${onPrimaryBar ? "text-primary-content" : "text-primary"}`} aria-hidden />

      {!compact && (

        <span className={`label-text text-xs font-medium ${onPrimaryBar ? "text-primary-content" : ""}`}>

          Theme

        </span>

      )}

      <select

        className={selectClass}

        value={theme}

        onChange={(e) => handleChange(e.target.value)}

        aria-label="Choose app theme"

      >

        {THEMES.map((t) => (

          <option key={t} value={t}>

            {themeLabels[t]}

          </option>

        ))}

      </select>

    </label>

  );

}

