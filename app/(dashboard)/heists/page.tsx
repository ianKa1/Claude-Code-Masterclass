export default function HeistsPage() {
  return (
    <div className="page-content">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Mission Control</h1>
        <p className="mt-2 text-body">
          Welcome back, agent. Below you'll find your active operations, assigned missions, and the archives of past exploits. Choose wisely — every heist counts.
        </p>
      </div>
      <div className="active-heists">
        <h2>Your Active Heists</h2>
      </div>
      <div className="assigned-heists">
        <h2>Heists You've Assigned</h2>
      </div>
      <div className="expired-heists">
        <h2>All Expired Heists</h2>
      </div>
    </div>
  )
}