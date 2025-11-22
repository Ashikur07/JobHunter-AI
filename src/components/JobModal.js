export default function JobModal({ job, onClose }) {
  if (!job) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-gray-800 w-full max-w-2xl rounded-2xl border border-gray-600 shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-700 flex justify-between items-start bg-gray-900/50 rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold text-white">{job.title}</h2>
            <p className="text-blue-400 text-lg font-medium">{job.company}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl transition">×</button>
        </div>

        {/* Body (Scrollable) */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Basic Info */}
          <div className="space-y-4">
             <h3 className="text-sm font-bold text-gray-500 uppercase border-b border-gray-700 pb-1">Job Info</h3>
             <div>
               <span className="text-xs text-gray-400 block">Location</span>
               <span className="text-white">{job.location || "Remote"}</span>
             </div>
             <div>
               <span className="text-xs text-gray-400 block">Salary</span>
               <span className="text-green-400 font-mono">{job.salary || "Not mentioned"}</span>
             </div>
             <div>
               <span className="text-xs text-gray-400 block">Platform / Link</span>
               <div className="flex items-center gap-2">
                 <span className="text-white">{job.platform}</span>
                 {job.postLink && <a href={job.postLink} target="_blank" className="text-blue-400 text-xs hover:underline">Open Link ↗</a>}
               </div>
             </div>
          </div>

          {/* Application Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-500 uppercase border-b border-gray-700 pb-1">My Application</h3>
            <div>
               <span className="text-xs text-gray-400 block">Current Status</span>
               <span className="px-2 py-1 bg-blue-900 text-blue-200 rounded text-xs">{job.status}</span>
            </div>
            <div>
               <span className="text-xs text-gray-400 block">Applied On</span>
               <span className="text-white">{new Date(job.applicationDate).toLocaleDateString()}</span>
            </div>
            <div>
               <span className="text-xs text-gray-400 block">Salary Expectation</span>
               <span className="text-gray-300">{job.salaryExpectation || "-"}</span>
            </div>
          </div>

          {/* Description (Full Width) */}
          <div className="md:col-span-2">
             <h3 className="text-sm font-bold text-gray-500 uppercase border-b border-gray-700 pb-1 mb-2">Summary</h3>
             <div className="bg-gray-900 p-4 rounded-lg text-gray-300 text-sm leading-relaxed">
               {job.description}
             </div>
          </div>

          {/* Notes Section */}
          <div className="md:col-span-2">
             <h3 className="text-sm font-bold text-gray-500 uppercase border-b border-gray-700 pb-1 mb-2">My Notes</h3>
             <p className="text-gray-400 italic">{job.notes || "No notes added yet."}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700 bg-gray-900/50 rounded-b-2xl flex justify-end">
          <button onClick={onClose} className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-bold transition">
            Close
          </button>
        </div>

      </div>
    </div>
  );
}