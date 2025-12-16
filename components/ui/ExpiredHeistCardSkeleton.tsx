import Skeleton from "./Skeleton";
import styles from "./ExpiredHeistCardSkeleton.module.css";

export default function ExpiredHeistCardSkeleton() {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <Skeleton variant="circular" width={16} height={16} />
          <Skeleton width="40%" height={16} />
        </div>
        <div className={styles.statusSection}>
          <Skeleton width={120} height={14} />
          <Skeleton width={80} height={24} />
        </div>
      </div>
      <div className={styles.metadata}>
        <Skeleton width={150} height={14} />
        <Skeleton width={150} height={14} />
      </div>
    </div>
  );
}
