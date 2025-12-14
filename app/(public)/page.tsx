import { Clock8, ArrowRight, Zap, Users, Target } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="splash-page">
      <div className="splash-grid">
        {/* Animated grid background */}
        <div className="grid-lines" />

        {/* Main content */}
        <div className="splash-content">
          {/* Status badge */}
          <div className="status-badge">
            <div className="status-pulse" />
            <span>RECRUITING NOW</span>
          </div>

          {/* Logo with animation */}
          <div className="splash-logo">
            <h1 className="logo-text">
              P<Clock8 className="logo-icon" strokeWidth={2.75} />
              CKET
              <br />
              HEIST
            </h1>
          </div>

          {/* Tagline */}
          <p className="splash-tagline">Tiny missions. Big office mischief.</p>

          {/* Mission brief */}
          <div className="mission-brief">
            <p className="brief-text">
              Your office is about to get interesting. Create secret missions,
              assign covert tasks, and turn everyday chaos into legendary
              heists. No capes required.
            </p>
          </div>

          {/* Features grid */}
          <div className="features-grid">
            <div className="feature-card">
              <Target className="feature-icon" />
              <h3>Create Missions</h3>
              <p>Design mischievous tasks</p>
            </div>
            <div className="feature-card">
              <Users className="feature-icon" />
              <h3>Assign Teams</h3>
              <p>Recruit your accomplices</p>
            </div>
            <div className="feature-card">
              <Zap className="feature-icon" />
              <h3>Track Chaos</h3>
              <p>Watch mayhem unfold</p>
            </div>
          </div>

          {/* CTA */}
          <div className="splash-cta">
            <Link href="/signup" className="cta-button">
              <span>Join the Heist</span>
              <ArrowRight className="cta-arrow" strokeWidth={2.5} />
            </Link>
            <p className="cta-subtext">
              Already recruited?{" "}
              <Link href="/login" className="login-link">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="splash-decor">
          <div className="decor-circle decor-circle-1" />
          <div className="decor-circle decor-circle-2" />
          <div className="decor-line decor-line-1" />
          <div className="decor-line decor-line-2" />
        </div>
      </div>
    </div>
  );
}
