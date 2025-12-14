"use client";

import { useHeists } from "@/hooks/useHeists";

export default function HeistsTester() {
  const activeHeists = useHeists("active");
  const assignedHeists = useHeists("assigned");
  const expiredHeists = useHeists("expired");

  return (
    <div className="heists-tester">
      <section className="heist-section">
        <h4>Active Heists (assigned to me)</h4>
        {activeHeists.loading && <p className="status">Loading...</p>}
        {activeHeists.error && (
          <p className="error">Error: {activeHeists.error.message}</p>
        )}
        {!activeHeists.loading &&
          !activeHeists.error &&
          activeHeists.heists.length === 0 && (
            <p className="empty">No active heists</p>
          )}
        {!activeHeists.loading && !activeHeists.error && (
          <ul className="heist-list">
            {activeHeists.heists.map((heist) => (
              <li key={heist.id}>{heist.title}</li>
            ))}
          </ul>
        )}
      </section>

      <section className="heist-section">
        <h4>Assigned Heists (created by me)</h4>
        {assignedHeists.loading && <p className="status">Loading...</p>}
        {assignedHeists.error && (
          <p className="error">Error: {assignedHeists.error.message}</p>
        )}
        {!assignedHeists.loading &&
          !assignedHeists.error &&
          assignedHeists.heists.length === 0 && (
            <p className="empty">No assigned heists</p>
          )}
        {!assignedHeists.loading && !assignedHeists.error && (
          <ul className="heist-list">
            {assignedHeists.heists.map((heist) => (
              <li key={heist.id}>{heist.title}</li>
            ))}
          </ul>
        )}
      </section>

      <section className="heist-section">
        <h4>Expired Heists (all users)</h4>
        {expiredHeists.loading && <p className="status">Loading...</p>}
        {expiredHeists.error && (
          <p className="error">Error: {expiredHeists.error.message}</p>
        )}
        {!expiredHeists.loading &&
          !expiredHeists.error &&
          expiredHeists.heists.length === 0 && (
            <p className="empty">No expired heists</p>
          )}
        {!expiredHeists.loading && !expiredHeists.error && (
          <ul className="heist-list">
            {expiredHeists.heists.map((heist) => (
              <li key={heist.id}>{heist.title}</li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
