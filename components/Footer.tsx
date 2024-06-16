import { useAppContext } from "@/contexts/AppContext";
import styles from "@/styles/Footer.module.scss";
import { Button } from "@mui/material";

const Footer = () => {
  const { isListening } = useAppContext();

  return (
    <footer className={styles.footer}>
      <Button
        sx={{ textTransform: "none" }}
        href="https://open.spotify.com/user/21h6osgmy2twlu7ichm7ygfhq?si=96fadda3e46144dc"
      >
        ✨ Follow Me ✨
      </Button>
      <Button
        sx={{ textTransform: "none" }}
        href="#nowPlaying"
        disabled={!isListening}
      >
        Now Playing
      </Button>
      <Button sx={{ textTransform: "none" }} href="#featuredSongs">
        Featured Songs
      </Button>
      <Button sx={{ textTransform: "none" }} href="#playlists">
        Playlists
      </Button>
    </footer>
  );
};

export default Footer;
