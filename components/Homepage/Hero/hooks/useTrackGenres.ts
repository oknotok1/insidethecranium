import { useEffect, useState } from "react";

interface Track {
  id: string;
  artists: Array<{ id: string; name: string }>;
}

export const useTrackGenres = (
  track: Track | undefined,
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
            headers: accessToken
              ? {
                  access_token: accessToken,
                }
              : {},
          },
        );

        if (!response.ok) {
          // Log but don't throw - handle gracefully
          console.warn(
            `[useTrackGenres] API returned ${response.status}, falling back to no genres`,
          );
          setGenres([]);
          return;
        }

        const data = await response.json();

        // Handle case where API returns error with empty artists array
        if (!data.artists || data.artists.length === 0) {
          console.warn("[useTrackGenres] No artists data returned");
          setGenres([]);
          return;
        }

        // Collect all unique genres from all artists, limit to 3
        const allGenres = data.artists.flatMap(
          (artist: any) => artist.genres || [],
        );
        const uniqueGenres = [...new Set<string>(allGenres as string[])].slice(
          0,
          3,
        );
        setGenres(uniqueGenres);
      } catch (error) {
        console.error("[useTrackGenres] Failed to fetch genres:", error);
        setGenres([]); // Gracefully degrade to no genres
      }
    };

    fetchGenres();
    // We only depend on track.id and accessToken to avoid refetching when artist objects change reference
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track?.id, accessToken]);

  return genres;
};
