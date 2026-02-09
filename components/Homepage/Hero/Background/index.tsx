import styles from "./styles.module.scss";

export const HeroBackground = () => (
  <>
    <div className={styles.background}>
      <div
        className={styles.backgroundOverlay}
        style={{
          background:
            "radial-gradient(circle at 30% 50%, rgba(61, 56, 245, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 50%, rgba(139, 135, 255, 0.1) 0%, transparent 50%)",
        }}
      />
    </div>

    <div className={styles.animatedBackground}>
      <div
        className={styles.gradientBlobLeft}
        style={{ backgroundColor: "rgba(61, 56, 245, 0.25)" }}
      />
      <div
        className={styles.gradientBlobRight}
        style={{ backgroundColor: "rgba(139, 135, 255, 0.2)" }}
      />
    </div>
  </>
);
