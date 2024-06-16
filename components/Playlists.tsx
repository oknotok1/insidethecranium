import { UserPlaylists } from "@/types/spotify";
import styles from "@/styles/Playlists.module.scss";
import { useState } from "react";
import { Button } from "reactstrap";

const Playlists = ({ playlists: data }: { playlists: UserPlaylists }) => {
  const [playlists, setPlaylists] = useState(data.items.slice(0, 6));

  const convertToEmbedUrl = (playlistId: string) =>
    `https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`;

  const featuredPlaylistsIds = playlists.map((playlist) => playlist.id);

  const featuredPlaylistsEmbedUrls =
    featuredPlaylistsIds.map(convertToEmbedUrl);

  const handleViewMore = () => {
    // add 6 more playlists at a time
    const newPlaylists = data.items.slice(
      0,
      Math.min(playlists.length + 4, data.items.length)
    );

    setPlaylists(newPlaylists);
  };

  const handleShowAll = () => {
    setPlaylists(data.items);
  };

  return (
    <section>
      <div className={styles.container} id="playlists">
        <div>
          <h1>Playlists</h1>
          <p>
            I have curated <strong>{playlists.length}</strong> thus far. They
            {"'"}re mostly grouped by genres, and or moods. I know it{"'"}s
            excessive, but I can{"'"}t help it. I{"'"}ll be creating a directory
            soon to help you navigate through them.
          </p>
        </div>
        <div className={styles.playlists}>
          {featuredPlaylistsEmbedUrls.map((playlistUrl) => (
            <iframe
              key={playlistUrl}
              style={{
                borderRadius: "0.5rem",
                maxWidth: "50rem",
              }}
              src={playlistUrl}
              width="100%"
              height="100%"
              allowFullScreen={false}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          ))}
        </div>
        <div>
          <Button
            onClick={handleViewMore}
            disabled={playlists.length === data.items.length}
          >
            View More
          </Button>
          <Button color="info" onClick={handleShowAll}>
            Show All
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Playlists;
