import { NextRequest, NextResponse } from "next/server";

import { logger } from "@/utils/logger";
import { SPOTIFY_API } from "@/utils/spotify";

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
    params.append(
      "redirect_uri",
      "http://127.0.0.1:3000/api/spotify/auth/callback",
    );
    params.append("client_id", SPOTIFY_CLIENT_ID || "");
    params.append("client_secret", SPOTIFY_CLIENT_SECRET || "");

    const response = await fetch(SPOTIFY_API.TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
      cache: "no-store", // OAuth tokens should not be cached
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error_description || `HTTP ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      refresh_token: data.refresh_token,
      access_token: data.access_token,
      expires_in: data.expires_in,
    });
  } catch (err: any) {
    logger.error("Token Exchange API", err.message);
    return NextResponse.json(
      {
        error: "Failed to exchange token",
        details: err.message,
      },
      { status: 500 },
    );
  }
}
