"use client";

import { Heist } from "@/types/firestore/heist";
import { Target, Clock, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatExpiredDate } from "@/lib/date-utils";
import styles from "./ExpiredHeistCard.module.css";

interface ExpiredHeistCardProps {
  heist: Heist;
  onClick?: () => void;
}

export default function ExpiredHeistCard({
  heist,
  onClick,
}: ExpiredHeistCardProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.push(`/heists/${heist.id}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  // Determine status badge
  const status = heist.finalStatus === "success" ? "COMPLETED" : "FAILED";
  const statusClass =
    heist.finalStatus === "success"
      ? styles.statusSuccess
      : styles.statusFailed;

  return (
    <div
      className={styles.card}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`View expired heist: ${heist.title}`}
    >
      {/* Header row: title + timestamp/status */}
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <Target className={styles.missionIcon} />
          <h3 className={styles.title}>{heist.title}</h3>
        </div>
        <div className={styles.statusSection}>
          <Clock className={styles.clockIcon} />
          <span className={styles.timestamp}>
            {formatExpiredDate(heist.deadline)}
          </span>
          <span className={`${styles.statusBadge} ${statusClass}`}>
            {status}
          </span>
        </div>
      </div>

      {/* Metadata row: To/By users */}
      <div className={styles.metadata}>
        <div className={styles.metaItem}>
          <User className={styles.userIcon} />
          <span className={styles.label}>To:</span>
          <span className={styles.targetUser}>
            @{heist.createdForCodename || "Unknown Agent"}
          </span>
        </div>
        <div className={styles.metaItem}>
          <User className={styles.userIcon} />
          <span className={styles.label}>By:</span>
          <span className={styles.creatorUser}>
            @{heist.createdByCodename || "Unknown Agent"}
          </span>
        </div>
      </div>
    </div>
  );
}
