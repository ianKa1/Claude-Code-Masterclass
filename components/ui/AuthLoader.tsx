"use client";

import styles from "./AuthLoader.module.css";

export default function AuthLoader() {
  return (
    <div className={styles.container}>
      <div className={styles.spinner} />
    </div>
  );
}
