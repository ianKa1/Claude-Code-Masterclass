"use client";

import { useHeists } from "@/lib/firebase/useHeists";

const sections = [
  {
    id: "active" as const,
    title: "Your Active Heists",
    description: "Currently in progress",
  },
  {
    id: "assigned" as const,
    title: "Heists You've Assigned",
    description: "Delegated to your crew",
  },
  {
    id: "expired" as const,
    title: "All Expired Heists",
    description: "Past operations",
  },
];

export default function HeistsPage() {
  const activeData = useHeists("active");
  const assignedData = useHeists("assigned");
  const expiredData = useHeists("expired");

  const dataByFilter = {
    active: activeData,
    assigned: assignedData,
    expired: expiredData,
  };

  return (
    <div className="page-content">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Mission Control</h1>
        <p className="mt-2 text-body">Plan it. Staff it. Pull it off.</p>
      </div>

      {sections.map((section) => {
        const { heists, loading, error } = dataByFilter[section.id];

        return (
          <div key={section.id} className="mb-6">
            <h2 className="text-xl font-semibold">{section.title}</h2>
            <p className="text-sm text-body mb-3">{section.description}</p>

            {loading && <p className="text-body">Loading...</p>}

            {error && <p className="text-error">{error}</p>}

            {!loading && !error && heists.length === 0 && (
              <p className="text-body italic">No heists found.</p>
            )}

            {!loading && !error && heists.length > 0 && (
              <ul className="list-disc list-inside">
                {heists.map((heist) => (
                  <li key={heist.id} className="text-body">
                    {heist.title}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
