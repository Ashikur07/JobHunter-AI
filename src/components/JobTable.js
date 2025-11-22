import { useState, useEffect } from "react";

export default function JobTable({ jobs, onViewDetails }) {
  // --- Pagination States ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; 

  // নতুন ডাটা আসলে বা সার্চ করলে পেজ ১-এ ফেরত যাবে
  useEffect(() => {
    setCurrentPage(1);
  }, [jobs]);

  // --- Pagination Logic ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentJobs = jobs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(jobs.length / itemsPerPage);

  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-xl flex flex-col">
      
      {/* --- TABLE WRAPPER (Mobile Scroll) --- */}
      {/* overflow-x-auto দিয়েছি যাতে মোবাইলে ডানে-বামে স্ক্রল করা যায় */}
      <div className="overflow-x-auto w-full">
        
        {/* min-w-[900px] দিয়েছি যাতে মোবাইলে টেবিল কুঁচকে না যায়, বরং স্ক্রল হয় */}
        <table className="w-full text-left border-collapse table-fixed min-w-[900px]">
          <thead>
            <tr className="bg-gray-900 text-gray-400 text-xs uppercase tracking-wider">
              {/* Width Distribution (Total 100%) */}
              <th className="p-4 border-b border-gray-700 w-[5%] text-center">SL</th>
              <th className="p-4 border-b border-gray-700 w-[12%]">Applied Date</th>
              <th className="p-4 border-b border-gray-700 w-[30%]">Role / Title</th>
              <th className="p-4 border-b border-gray-700 w-[23%]">Company</th>
              <th className="p-4 border-b border-gray-700 w-[15%] text-center">Status</th>
              <th className="p-4 border-b border-gray-700 w-[15%] text-right">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-300">
            {currentJobs.map((job, index) => (
              <tr key={job._id} className="hover:bg-gray-700/50 transition border-b border-gray-700/50 last:border-0">
                
                {/* SL: Pagination maintain করে সিরিয়াল */}
                <td className="p-4 text-center text-gray-500 font-mono">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>
                
                {/* Date */}
                <td className="p-4 text-gray-400 text-xs">
                  {new Date(job.applicationDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                
                {/* Role */}
                <td className="p-4 font-bold text-white truncate" title={job.title}>
                   {job.title}
                </td>
                
                {/* Company */}
                <td className="p-4 text-blue-300 truncate" title={job.company}>
                   {job.company}
                </td>
                
                {/* Status */}
                <td className="p-4 text-center">
                  <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold tracking-wide inline-block w-24 text-center ${
                    job.status === 'Applied' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 
                    job.status === 'Interview' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 
                    job.status === 'Offer' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                    job.status === 'Rejected' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
                    'bg-gray-700 text-gray-400'
                  }`}>
                    {job.status}
                  </span>
                </td>
                
                {/* Action */}
                <td className="p-4 text-right">
                  <button 
                    onClick={() => onViewDetails(job)}
                    className="text-xs bg-gray-800 hover:bg-gray-700 text-white px-4 py-1.5 rounded border border-gray-600 transition whitespace-nowrap shadow-sm"
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
            
            {jobs.length === 0 && (
              <tr><td colSpan="6" className="p-10 text-center text-gray-500">No jobs found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- PAGINATION FOOTER --- */}
      {/* শুধু যদি ১ পেজের বেশি ডাটা থাকে তবেই দেখাবে */}
      {totalPages > 1 && (
        <div className="bg-gray-900/50 border-t border-gray-700 p-4 flex justify-between items-center sticky left-0">
          <span className="text-xs text-gray-500 hidden md:block">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, jobs.length)} of {jobs.length} entries
          </span>
          
          <div className="flex gap-2 w-full md:w-auto justify-center md:justify-end">
            <button 
              onClick={goToPrevPage} 
              disabled={currentPage === 1}
              className="px-4 py-2 text-xs font-bold bg-gray-800 border border-gray-600 rounded hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              Previous
            </button>
            
            <span className="text-xs text-gray-400 flex items-center px-3 font-mono bg-gray-800 rounded border border-gray-700">
              {currentPage} / {totalPages}
            </span>
            
            <button 
              onClick={goToNextPage} 
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-xs font-bold bg-gray-800 border border-gray-600 rounded hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}