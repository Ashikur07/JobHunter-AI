export default function JobTable({ jobs, onViewDetails }) {
  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-xl">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-900 text-gray-400 text-xs uppercase tracking-wider">
            <th className="p-5 border-b border-gray-700">SL</th>
            <th className="p-5 border-b border-gray-700">Company</th>
            <th className="p-5 border-b border-gray-700">Role</th>
            <th className="p-5 border-b border-gray-700">Platform</th>
            <th className="p-5 border-b border-gray-700">Status</th>
            <th className="p-5 border-b border-gray-700 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="text-sm text-gray-300">
          {jobs.map((job, index) => (
            <tr key={job._id} className="hover:bg-gray-700/50 transition border-b border-gray-700/50 last:border-0">
              <td className="p-5 text-gray-500">{index + 1}</td>
              <td className="p-5 font-semibold text-white">{job.company}</td>
              <td className="p-5 text-blue-300">{job.title}</td>
              <td className="p-5">
                <span className="text-xs bg-gray-700 px-2 py-1 rounded">{job.platform}</span>
              </td>
              <td className="p-5">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  job.status === 'Applied' ? 'bg-blue-500/20 text-blue-400' : 
                  job.status === 'Interview' ? 'bg-yellow-500/20 text-yellow-400' : 
                  'bg-gray-600'
                }`}>
                  {job.status}
                </span>
              </td>
              <td className="p-5 text-right">
                <button 
                  onClick={() => onViewDetails(job)}
                  className="text-xs font-bold bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition"
                >
                  Details
                </button>
              </td>
            </tr>
          ))}
          {jobs.length === 0 && (
            <tr><td colSpan="6" className="p-10 text-center text-gray-500">No jobs tracked yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}