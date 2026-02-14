import styles from "./Skeleton.module.css"

export default function Skeleton() {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.avatar} />
        <div className={styles.headerLines}>
          <div className={styles.line} style={{ width: "75%" }} />
          <div className={styles.line} style={{ width: "50%" }} />
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.line} style={{ width: "100%" }} />
        <div className={styles.line} style={{ width: "100%" }} />
        <div className={styles.line} style={{ width: "65%" }} />
      </div>
    </div>
  )
}
