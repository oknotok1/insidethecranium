import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: "Authorization code is required" },
        { status: 400 },
      );
    }

    const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;

    // Exchange authorization code for tokens
    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", "http://127.0.0.1:3000/api/callback");
    params.append("client_id", SPOTIFY_CLIENT_ID || "");
    params.append("client_secret", SPOTIFY_CLIENT_SECRET || "");

    const { data } = await axios.post(
      "https://accounts.spotify.com/api/token",
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    return NextResponse.json({
      success: true,
      refresh_token: data.refresh_token,
      access_token: data.access_token,
      expires_in: data.expires_in,
    });
  } catch (err: any) {
    console.error("Token exchange error:", err.response?.data || err.message);
    return NextResponse.json(
      {
        error: "Failed to exchange token",
        details: err.response?.data || err.message,
      },
      { status: 500 },
    );
  }
}
