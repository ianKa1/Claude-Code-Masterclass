"use client";

import { useHeists } from "@/hooks/useHeists";
import HeistCard from "@/components/ui/HeistCard";
import SkeletonCard from "@/components/ui/SkeletonCard";
import ExpiredHeistCard from "@/components/ui/ExpiredHeistCard";
import ExpiredHeistCardSkeleton from "@/components/ui/ExpiredHeistCardSkeleton";
import styles from "./page.module.css";

export default function HeistsPage() {
  const {
    heists: activeHeists,
    loading: activeLoading,
    error: activeError,
  } = useHeists("active");
  const {
    heists: assignedHeists,
    loading: assignedLoading,
    error: assignedError,
  } = useHeists("assigned");
  const {
    heists: expiredHeists,
    loading: expiredLoading,
    error: expiredError,
  } = useHeists("expired");

  return (
    <div className="page-content">
      {/* Section 1: Active Heists */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Your Active Heists</h2>

        {activeLoading && (
          <div className={styles.cardGrid}>
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {!activeLoading && activeError && (
          <p className={styles.error}>
            Failed to load heists. Please try again.
          </p>
        )}

        {!activeLoading && !activeError && activeHeists.length === 0 && (
          <p className={styles.empty}>No active heists assigned to you yet.</p>
        )}

        {!activeLoading && !activeError && activeHeists.length > 0 && (
          <div className={styles.cardGrid}>
            {activeHeists.map((heist) => (
              <HeistCard key={heist.id} heist={heist} />
            ))}
          </div>
        )}
      </section>

      {/* Section 2: Assigned Heists */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Heists You&apos;ve Assigned</h2>

        {assignedLoading && (
          <div className={styles.cardGrid}>
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {!assignedLoading && assignedError && (
          <p className={styles.error}>
            Failed to load heists. Please try again.
          </p>
        )}

        {!assignedLoading && !assignedError && assignedHeists.length === 0 && (
          <p className={styles.empty}>
            You haven&apos;t assigned any heists yet.
          </p>
        )}

        {!assignedLoading && !assignedError && assignedHeists.length > 0 && (
          <div className={styles.cardGrid}>
            {assignedHeists.map((heist) => (
              <HeistCard key={heist.id} heist={heist} />
            ))}
          </div>
        )}
      </section>

      {/* Section 3: Expired Heists */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Expired Heists</h2>

        {expiredLoading && (
          <div className={styles.expiredCardList}>
            <ExpiredHeistCardSkeleton />
            <ExpiredHeistCardSkeleton />
          </div>
        )}

        {!expiredLoading && expiredError && (
          <p className={styles.error}>
            Failed to load expired heists. Please try again.
          </p>
        )}

        {!expiredLoading && !expiredError && expiredHeists.length === 0 && (
          <p className={styles.empty}>No expired heists yet.</p>
        )}

        {!expiredLoading && !expiredError && expiredHeists.length > 0 && (
          <div className={styles.expiredCardList}>
            {expiredHeists.map((heist) => (
              <ExpiredHeistCard key={heist.id} heist={heist} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
