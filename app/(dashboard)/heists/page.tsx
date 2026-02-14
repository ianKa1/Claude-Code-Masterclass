const sections = [
  {
    id: "active",
    key: "active-heists",
    title: "Your Active Heists",
    description: "Currently in progress",
  },
  {
    id: "assigned",
    key: "assigned-heists",
    title: "Heists You've Assigned",
    description: "Delegated to your crew",
  },
  {
    id: "expired",
    key: "expired-heists",
    title: "All Expired Heists",
    description: "Past operations",
  },
];

export default function HeistsPage() {
  return (
    <div className="page-content">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Mission Control</h1>
        <p className="mt-2 text-body">Plan it. Staff it. Pull it off.</p>
      </div>
      {sections.map((section) => (
        <div key={section.id} className={section.key}>
          <h2>{section.title}</h2>
          <p className="text-sm text-body">{section.description}</p>
        </div>
      ))}
    </div>
  );
}
