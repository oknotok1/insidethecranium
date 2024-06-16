import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const url = `https://api.spotify.com/v1/me/player/currently-playing`;

  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    const { data } = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${req.headers.access_token}`,
      },
    });

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
