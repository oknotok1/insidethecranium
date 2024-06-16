import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "contentful";

const { CONTENTFUL_SPACE_ID, CONTENTFUL_ACCESS_TOKEN } = process.env;

if (!CONTENTFUL_SPACE_ID || !CONTENTFUL_ACCESS_TOKEN) {
  throw new Error("Contentful space ID and access token must be defined");
}

const client = createClient({
  space: CONTENTFUL_SPACE_ID,
  accessToken: CONTENTFUL_ACCESS_TOKEN,
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });

  const { entryId }: { entryId?: string } = req.query;

  if (entryId) {
    try {
      const response = await client.getEntry(entryId);

      if (!response) return res.status(404).json({ error: "Entry not found" });

      res.status(200).json(response.fields.featuredSongs);
    } catch (error) {
      console.error("Error fetching entry from Contentful:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    try {
      const response = await client.getEntries();

      if (response.items.length === 0)
        return res.status(404).json({ error: "No entries found" });

      res.status(200).json(response.items);
    } catch (error) {
      console.error("Error fetching entries from Contentful:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};
