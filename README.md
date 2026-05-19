# Concert Cost Tracker

Next.js app for logging concert costs, fun ratings, and dashboard analytics. Uses Supabase for auth and data.

## Project location

`C:\ACCY\Concert-Cost-`

## Setup

1. Copy `.env.local.example` to `.env.local` and add your Supabase URL and anon key.
2. Install dependencies: `npm install`
3. Run dev server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000)

## GitHub

Remote: `https://github.com/cbsmit18/Concert-Cost-.git`

## Deploy on Vercel

1. Import the GitHub repo and use **Framework Preset: Next.js**.
2. **Do not** set Output Directory to `public` — leave it empty so Vercel uses the Next.js build (`.next`). The `public/` folder is only for static assets, not build output.
3. Add environment variables (Production and Preview):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. After the first deploy, in Supabase → **Authentication → URL configuration**, add your Vercel URL and `https://<your-app>.vercel.app/auth/callback`.
