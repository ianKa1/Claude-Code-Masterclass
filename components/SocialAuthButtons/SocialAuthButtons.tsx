import { Github } from "lucide-react";
import styles from "./SocialAuthButtons.module.css";

export default function SocialAuthButtons() {
  return (
    <>
      <p className={styles.divider}>or</p>
      <div className={styles.buttonGroup}>
        <button type="button" className={styles.socialBtn}>
          Continue with Google
        </button>
        <button type="button" className={styles.socialBtn}>
          <Github size={16} />
          Continue with GitHub
        </button>
      </div>
    </>
  );
}
