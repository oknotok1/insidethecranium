import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const user_id = "21h6osgmy2twlu7ichm7ygfhq";
  const url = `https://api.spotify.com/v1/users/${user_id}/playlists`;

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
