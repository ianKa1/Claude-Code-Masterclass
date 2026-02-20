import { Clock8, Zap, Users, Trophy } from "lucide-react";
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      {/* Decorative noise overlay */}
      <div className={styles.noise} />

      {/* Diagonal split background */}
      <div className={styles.diagonalBg} />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.classified}>
            <span>CLASSIFIED</span>
            <div className={styles.barcode} />
          </div>

          <h1 className={styles.title}>
            <span className={styles.titleLine1}>
              P<Clock8 className={styles.logo} strokeWidth={2.75} />
              cket
            </span>
            <span className={styles.titleLine2}>Heist</span>
          </h1>

          <p className={styles.tagline}>Tiny missions. Big office mischief.</p>

          <p className={styles.description}>
            Your coworkers need you. Accept secret missions, complete audacious
            office heists, and become a legend in the break room.
          </p>

          <div className={styles.cta}>
            <Link href="/signup" className={styles.primaryBtn}>
              <span>Accept Your Mission</span>
              <div className={styles.btnShine} />
            </Link>
            <Link href="/login" className={styles.secondaryBtn}>
              Agent Login
            </Link>
          </div>
        </div>

        {/* Decorative geometric elements */}
        <div className={styles.geometric1} />
        <div className={styles.geometric2} />
        <div className={styles.geometric3} />
      </section>

      {/* Features Grid */}
      <section className={styles.features}>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>
            <Zap size={32} />
          </div>
          <h3>Quick Missions</h3>
          <p>48-hour deadlines. In and out. No traces.</p>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>
            <Users size={32} />
          </div>
          <h3>Secret Codenames</h3>
          <p>Every agent gets a unique alias. Stay anonymous.</p>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>
            <Trophy size={32} />
          </div>
          <h3>Office Legend</h3>
          <p>Complete heists. Build your reputation. Own the water cooler.</p>
        </div>
      </section>
    </div>
  );
}
