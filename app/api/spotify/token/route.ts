import axios from "axios";
import { NextResponse } from "next/server";

const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } =
  process.env;

export async function POST() {
  const token = Buffer.from(
    `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");
  const url = "https://accounts.spotify.com/api/token";
  const params = new URLSearchParams();
  params.append("grant_type", "refresh_token");
  SPOTIFY_REFRESH_TOKEN &&
    params.append("refresh_token", SPOTIFY_REFRESH_TOKEN);

  try {
    const { data } = await axios.post(url, params, {
      headers: {
        Authorization: `Basic ${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return NextResponse.json({ access_token: data.access_token });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
