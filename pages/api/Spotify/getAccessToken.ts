import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } =
  process.env;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const token = Buffer.from(
    `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");
  const url = "https://accounts.spotify.com/api/token";
  const params = new URLSearchParams();
  params.append("grant_type", "refresh_token");
  SPOTIFY_REFRESH_TOKEN &&
    params.append("refresh_token", SPOTIFY_REFRESH_TOKEN);

  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    const { data } = await axios.post(url, params, {
      headers: {
        Authorization: `Basic ${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    res.status(200).json(data.access_token);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
