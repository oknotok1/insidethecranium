import { useEffect, useState } from "react";

import type { Track } from "@/types/spotify";

interface ArtistWithGenres {
  genres: string[];
}

interface GenresApiResponse {
  artists: ArtistWithGenres[];
}

export const useTrackGenres = (
  track: Pick<Track, "id" | "artists"> | undefined,
  accessToken: string | undefined,
) => {
  const [genres, setGenres] = useState<string[]>([]);

  useEffect(() => {
    const fetchGenres = async () => {
      if (!track?.artists?.length || !accessToken) {
        setGenres([]);
        return;
      }

      try {
        const artistIds = track.artists.map((a) => a.id).join(",");
        const response = await fetch(
          `/api/spotify/artists/genres?artistIds=${artistIds}`,
          {
            headers: { access_token: accessToken },
          },
        );

        if (!response.ok) {
          console.warn(
            `[useTrackGenres] API returned ${response.status}, falling back to no genres`,
          );
          setGenres([]);
          return;
        }

        const data = (await response.json()) as GenresApiResponse;

        if (!data.artists?.length) {
          console.warn("[useTrackGenres] No artists data returned");
          setGenres([]);
          return;
        }

        const allGenres = data.artists.flatMap((artist) => artist.genres || []);
        const uniqueGenres = [...new Set(allGenres)].slice(0, 3);
        setGenres(uniqueGenres);
      } catch (error) {
        console.error("[useTrackGenres] Failed to fetch genres:", error);
        setGenres([]);
      }
    };

    fetchGenres();
  }, [track?.id, accessToken]);

  return genres;
};
