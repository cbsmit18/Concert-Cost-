import { fetchUpcomingConcerts } from "@/lib/upcoming-concerts/fetchUpcomingConcerts";

import { NextResponse } from "next/server";



export async function GET(request: Request) {

  const { searchParams } = new URL(request.url);

  const city = searchParams.get("city")?.trim() ?? "";

  const artist = searchParams.get("artist")?.trim() || undefined;



  if (!city) {

    return NextResponse.json(

      { error: "City is required." },

      { status: 400 },

    );

  }



  try {

    const concerts = await fetchUpcomingConcerts({ city, artist });

    return NextResponse.json({ concerts });

  } catch {

    return NextResponse.json(

      { error: "Unable to load concerts right now." },

      { status: 500 },

    );

  }

}

