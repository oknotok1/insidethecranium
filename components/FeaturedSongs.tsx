import styles from "@/styles/FeaturedSongs.module.scss";
import { FeaturedSong } from "@/types/contentful";

const FeaturedSongs = ({
  featuredSongs,
}: {
  featuredSongs?: FeaturedSong[];
}) => {
  const extractSongId = (url: string) => {
    const urlParts = url.split("/");
    return urlParts[urlParts.length - 1];
  };

  const convertToEmbedUrl = (songId: string) =>
    `https://open.spotify.com/embed/track/${songId}?utm_source=generator`;

  const featuredSongsIds = featuredSongs?.map((song) =>
    extractSongId(song.url)
  );
  const featuredSongsEmbedUrls = featuredSongsIds?.map(convertToEmbedUrl);

  if (!featuredSongsEmbedUrls) return null;

  return (
    <section>
      <div className={styles.featuredSongs} id="featuredSongs">
        <h1>Current Earworms</h1>
        <p>I{"'"}m digging these songs.</p>
        <div className={styles.songs}>
          {featuredSongsEmbedUrls.map((songUrl) => (
            <iframe
              key={songUrl}
              style={{
                borderRadius: "0.5rem",
                maxWidth: "50rem",
              }}
              src={songUrl}
              width="100%"
              height="100%"
              allowFullScreen={false}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSongs;
