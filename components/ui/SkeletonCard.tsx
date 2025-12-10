import Skeleton from './Skeleton'
import styles from './SkeletonCard.module.css'

export default function SkeletonCard() {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Skeleton variant="circular" width={48} height={48} />
        <div className={styles.headerText}>
          <Skeleton width="70%" />
          <Skeleton width="50%" />
        </div>
      </div>
      <div className={styles.body}>
        <Skeleton width="100%" />
        <Skeleton width="100%" />
        <Skeleton width="60%" />
      </div>
    </div>
  )
}
