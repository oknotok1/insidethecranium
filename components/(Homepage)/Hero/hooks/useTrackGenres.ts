import { useState, useEffect } from "react";
import axios from "axios";

interface Track {
  id: string;
  artists: Array<{ id: string; name: string }>;
}

export const useTrackGenres = (track: Track | undefined, accessToken: string | undefined) => {
  const [genres, setGenres] = useState<string[]>([]);

  useEffect(() => {
    const fetchGenres = async () => {
      if (!track?.artists?.length || !accessToken) {
        setGenres([]);
        return;
      }

      try {
        const artistIds = track.artists.map((a) => a.id).join(",");
        const response = await axios.get(
          `/api/spotify/artists/genres?artistIds=${artistIds}`,
          {
            headers: {
              access_token: accessToken,
            },
          }
        );

        // Collect all unique genres from all artists, limit to 3
        const allGenres = response.data.artists.flatMap(
          (artist: any) => artist.genres || []
        );
        const uniqueGenres = [...new Set<string>(allGenres as string[])].slice(0, 3);
        setGenres(uniqueGenres);
      } catch (error) {
        console.error("Failed to fetch genres:", error);
        setGenres([]);
      }
    };

    fetchGenres();
  }, [track?.id, accessToken]);

  return genres;
};
