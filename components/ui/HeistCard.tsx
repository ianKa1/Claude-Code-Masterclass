import { Heist } from "@/types/firestore/heist";
import { Clock8, User, UserPlus } from "lucide-react";
import styles from "./HeistCard.module.css";

function formatDeadline(date: Date): string {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  // Format options
  const dateOptions: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  const formattedDate = date.toLocaleString("en-US", dateOptions);

  // Add relative time context
  if (days === 0) {
    return `Today, ${formattedDate}`;
  } else if (days === 1) {
    return `Tomorrow, ${formattedDate}`;
  } else if (days > 0 && days <= 7) {
    return `${days}d left - ${formattedDate}`;
  } else if (days < 0) {
    return `Overdue - ${formattedDate}`;
  }

  return formattedDate;
}

interface HeistCardProps {
  heist: Heist;
}

export default function HeistCard({ heist }: HeistCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{heist.title}</h3>
      </div>
      <div className={styles.body}>
        <p className={styles.description}>{heist.description}</p>
        <div className={styles.metadata}>
          <div className={styles.metaItem}>
            <UserPlus className={styles.icon} />
            <span className={styles.label}>Created by:</span>
            <span className={styles.value}>{heist.createdByCodename}</span>
          </div>
          <div className={styles.metaItem}>
            <User className={styles.icon} />
            <span className={styles.label}>Assigned to:</span>
            <span className={styles.value}>{heist.createdForCodename}</span>
          </div>
          <div className={styles.metaItem}>
            <Clock8 className={styles.icon} />
            <span className={styles.label}>Deadline:</span>
            <span className={styles.value}>
              {formatDeadline(heist.deadline)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
