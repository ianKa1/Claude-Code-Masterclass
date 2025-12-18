"use client";

import { useCallback } from "react";
import Link from "next/link";
import { Heist } from "@/types/firestore/heist";
import { Clock8, User, UserPlus } from "lucide-react";
import { formatDeadline } from "@/lib/date-utils";
import styles from "./HeistCard.module.css";

interface HeistCardProps {
  heist: Heist;
  onClick?: () => void;
}

export default function HeistCard({ heist, onClick }: HeistCardProps) {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (onClick) {
          onClick();
        }
      }
    },
    [onClick],
  );

  const cardContent = (
    <>
      <div className={styles.header}>
        <h3 className={styles.title}>{heist.title}</h3>
      </div>
      <div className={styles.body}>
        <p className={styles.description}>{heist.description}</p>
        <div className={styles.metadata}>
          <div className={styles.metaItem}>
            <UserPlus className={styles.icon} aria-hidden="true" />
            <span className={styles.label}>Created by:</span>
            <span className={styles.value}>{heist.createdByCodename}</span>
          </div>
          <div className={styles.metaItem}>
            <User className={styles.icon} aria-hidden="true" />
            <span className={styles.label}>Assigned to:</span>
            <span className={styles.value}>{heist.createdForCodename}</span>
          </div>
          <div className={styles.metaItem}>
            <Clock8 className={styles.icon} aria-hidden="true" />
            <span className={styles.label}>Deadline:</span>
            <span className={styles.value}>
              {formatDeadline(heist.deadline)}
            </span>
          </div>
        </div>
      </div>
    </>
  );

  if (onClick) {
    return (
      <div
        className={styles.card}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label={`View heist: ${heist.title}`}
      >
        {cardContent}
      </div>
    );
  }

  return (
    <Link href={`/heists/${heist.id}`} className={styles.card}>
      {cardContent}
    </Link>
  );
}
