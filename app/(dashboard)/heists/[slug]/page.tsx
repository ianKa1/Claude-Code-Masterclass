"use client";

import { use } from "react";
import { useHeist } from "@/hooks/useHeist";
import {
  formatDeadline,
  getTimeRemaining,
  formatDateTime,
} from "@/lib/date-utils";
import {
  Target,
  User,
  UserPlus,
  Clock8,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import Skeleton from "@/components/ui/Skeleton";
import { Heist } from "@/types/firestore/heist";
import styles from "./page.module.css";

interface HeistDetailsPageProps {
  params: Promise<{ slug: string }>;
}

interface ErrorStateProps {
  icon: React.ReactNode;
  title: string;
  message: string;
}

interface MetadataCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClassName?: string;
}

function ErrorState({ icon, title, message }: ErrorStateProps) {
  return (
    <div className="page-content">
      <div className={styles.errorContainer}>
        {icon}
        <h2 className={styles.errorTitle}>{title}</h2>
        <p className={styles.errorMessage}>{message}</p>
      </div>
    </div>
  );
}

function MetadataCard({
  icon,
  label,
  value,
  valueClassName,
}: MetadataCardProps) {
  return (
    <div className={styles.metaCard}>
      <div className={styles.metaIcon}>{icon}</div>
      <div className={styles.metaContent}>
        <span className={styles.metaLabel}>{label}</span>
        <span className={`${styles.metaValue} ${valueClassName || ""}`}>
          {value}
        </span>
      </div>
    </div>
  );
}

function getStatusBadge(heist: Heist) {
  if (heist.isActive) {
    return { label: "ACTIVE", className: styles.statusActive };
  }

  if (heist.finalStatus === "success") {
    return { label: "COMPLETED", className: styles.statusSuccess };
  }

  return { label: "FAILED", className: styles.statusFailed };
}

function getStatusIcon(finalStatus: "success" | "failure") {
  if (finalStatus === "success") {
    return {
      icon: <CheckCircle2 className={styles.successIcon} aria-hidden="true" />,
      textClassName: styles.successText,
      label: "Success",
    };
  }

  return {
    icon: <XCircle className={styles.failIcon} aria-hidden="true" />,
    textClassName: styles.failText,
    label: "Failed",
  };
}

export default function HeistDetailsPage({ params }: HeistDetailsPageProps) {
  const { slug } = use(params);
  const { heist, loading, error, notFound } = useHeist(slug);

  if (loading) {
    return (
      <div className="page-content">
        <div className={styles.container} role="status" aria-live="polite">
          <span className="sr-only">Loading heist details, please wait...</span>
          <Skeleton
            variant="rectangular"
            height="3rem"
            className={styles.titleSkeleton}
            aria-hidden="true"
          />
          <Skeleton
            variant="rectangular"
            height="6rem"
            className={styles.descriptionSkeleton}
            aria-hidden="true"
          />
          <div className={styles.metadataGrid} aria-hidden="true">
            <Skeleton variant="rectangular" height="5rem" />
            <Skeleton variant="rectangular" height="5rem" />
            <Skeleton variant="rectangular" height="5rem" />
            <Skeleton variant="rectangular" height="5rem" />
          </div>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <ErrorState
        icon={<AlertCircle className={styles.errorIcon} aria-hidden="true" />}
        title="Heist Not Found"
        message="The heist you're looking for doesn't exist or has been deleted."
      />
    );
  }

  if (error) {
    return (
      <ErrorState
        icon={<AlertCircle className={styles.errorIcon} aria-hidden="true" />}
        title="Error Loading Heist"
        message={
          error.message || "Failed to load heist details. Please try again."
        }
      />
    );
  }

  if (!heist) {
    return null;
  }

  const statusBadge = getStatusBadge(heist);
  const isExpired = !heist.isActive;

  return (
    <div className="page-content">
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <Target className={styles.titleIcon} aria-hidden="true" />
            <h1 className={styles.title}>{heist.title}</h1>
          </div>
          <span
            className={`${styles.statusBadge} ${statusBadge.className}`}
            role="status"
            aria-label={`Heist status: ${statusBadge.label}`}
          >
            {statusBadge.label}
          </span>
        </div>

        <div className={styles.descriptionSection}>
          <h3 className={styles.sectionLabel}>Mission Brief</h3>
          <p className={styles.description}>{heist.description}</p>
        </div>

        <div className={styles.metadataGrid}>
          <MetadataCard
            icon={<User aria-hidden="true" />}
            label="Assigned To"
            value={heist.createdForCodename}
          />

          <MetadataCard
            icon={<UserPlus aria-hidden="true" />}
            label="Created By"
            value={heist.createdByCodename}
          />

          <MetadataCard
            icon={<Clock8 aria-hidden="true" />}
            label="Deadline"
            value={formatDeadline(heist.deadline)}
          />

          {heist.isActive && (
            <MetadataCard
              icon={<Calendar aria-hidden="true" />}
              label="Time Remaining"
              value={getTimeRemaining(heist.deadline)}
            />
          )}

          {isExpired &&
            heist.finalStatus &&
            (() => {
              const statusDisplay = getStatusIcon(heist.finalStatus);
              return (
                <MetadataCard
                  icon={statusDisplay.icon}
                  label="Final Status"
                  value={statusDisplay.label}
                  valueClassName={statusDisplay.textClassName}
                />
              );
            })()}

          <MetadataCard
            icon={<Calendar aria-hidden="true" />}
            label="Created"
            value={formatDateTime(heist.createdAt)}
          />
        </div>
      </div>
    </div>
  );
}
