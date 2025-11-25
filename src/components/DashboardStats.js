export default function DashboardStats({ jobs }) {
  const total = jobs.length;
  const interviews = jobs.filter(j => j.status === 'Interview').length;
  const offers = jobs.filter(j => j.status === 'Offer').length;
  const rejected = jobs.filter(j => j.status === 'Rejected').length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <StatCard label="Total Applied" count={total} color="blue" icon="🚀" />
      <StatCard label="Interviews" count={interviews} color="yellow" icon="🎤" />
      <StatCard label="Offers" count={offers} color="green" icon="🎉" />
      <StatCard label="Rejected" count={rejected} color="red" icon="❌" />
    </div>
  );
}

function StatCard({ label, count, color, icon }) {
  const colors = {
    blue: "bg-blue-500/10 border-blue-500/30 text-blue-400",
    yellow: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
    green: "bg-green-500/10 border-green-500/30 text-green-400",
    red: "bg-red-500/10 border-red-500/30 text-red-400",
  };

  return (
    <div className={`p-4 rounded-xl border ${colors[color]} flex flex-col items-center justify-center shadow-lg`}>
      <span className="text-2xl mb-1">{icon}</span>
      <h3 className="text-3xl font-bold">{count}</h3>
      <p className="text-xs uppercase tracking-wider opacity-70">{label}</p>
    </div>
  );
}