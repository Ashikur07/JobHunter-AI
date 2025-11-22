import { useState, useEffect } from "react";

export default function JobModal({ job, onClose, onUpdate }) {
  // স্টেটগুলো ইনিশিয়াল ভ্যালু দিয়ে রাখলাম
  const [status, setStatus] = useState('Applied');
  const [interviewDate, setInterviewDate] = useState('');
  const [note, setNote] = useState('');
  const [updating, setUpdating] = useState(false);

  // --- ফিক্স: ডাটা সিঙ্ক করার ম্যাজিক ---
  // যখনই নতুন কোনো 'job' আসবে, এই useEffect টা চলবে এবং ফর্ম ফিলাপ করে দেবে
  useEffect(() => {
    if (job) {
      setStatus(job.status || 'Applied');
      
      // তারিখ থাকলে সেটাকে yyyy-mm-dd ফরম্যাটে বসাচ্ছি
      const dateStr = job.interviewDate 
        ? new Date(job.interviewDate).toISOString().split('T')[0] 
        : "";
      setInterviewDate(dateStr);
      
      setNote(job.notes || "");
    }
  }, [job]); // [job] মানে হলো: job পাল্টালেই এই কোড চলবে

  if (!job) return null;

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/jobs/${job._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          status, 
          interviewDate, 
          notes: note 
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Updated Successfully! 🎉");
        onUpdate(); 
        onClose(); 
      }
    } catch (error) {
      console.error(error);
      alert("Failed to update");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-gray-800 w-full max-w-2xl rounded-2xl border border-gray-600 shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-700 flex justify-between items-start bg-gray-900/50 rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold text-white">{job.title}</h2>
            <p className="text-blue-400 text-lg font-medium">{job.company}</p>
            {job.postLink && (
              <a href={job.postLink} target="_blank" className="text-xs text-gray-500 hover:text-blue-400 underline mt-1 block">View Job Post ↗</a>
            )}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl transition">×</button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* --- EDIT SECTION --- */}
          <div className="md:col-span-2 bg-gray-900/50 p-4 rounded-xl border border-blue-900/30">
            <h3 className="text-sm font-bold text-blue-400 uppercase mb-3">Update Status & Progress</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Status Dropdown */}
              <div>
                <label className="text-xs text-gray-400 block mb-1">Current Status</label>
                <select 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 text-white focus:border-blue-500 outline-none"
                >
                  <option value="Applied">Applied</option>
                  <option value="Screening">Screening</option>
                  <option value="Interview">Interview / Viva</option>
                  <option value="Offer">Offer Received</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              {/* Date Picker */}
              <div>
                <label className="text-xs text-gray-400 block mb-1">Viva / Interview Date</label>
                <input 
                  type="date" 
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 text-white focus:border-blue-500 outline-none [color-scheme:dark]"
                />
              </div>
            </div>
          </div>

          {/* --- INFO --- */}
          <div className="space-y-4">
             <h3 className="text-sm font-bold text-gray-500 uppercase border-b border-gray-700 pb-1">Job Info</h3>
             <div><span className="text-xs text-gray-400 block">Location</span> <span className="text-white">{job.location || "Remote"}</span></div>
             <div><span className="text-xs text-gray-400 block">Salary</span> <span className="text-green-400">{job.salary || "N/A"}</span></div>
             <div><span className="text-xs text-gray-400 block">Applied On</span> <span className="text-gray-300">{new Date(job.applicationDate).toLocaleDateString()}</span></div>
          </div>

          <div className="space-y-4">
             <h3 className="text-sm font-bold text-gray-500 uppercase border-b border-gray-700 pb-1">Description</h3>
             <div className="text-sm text-gray-400 leading-relaxed h-24 overflow-y-auto pr-2">
               {job.description}
             </div>
          </div>
          
          {/* Notes */}
          <div className="md:col-span-2">
            <label className="text-xs text-gray-500 uppercase mb-1 block">My Notes</label>
            <textarea 
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm focus:border-blue-500 outline-none"
              rows="2"
              placeholder="Add personal notes here..."
            ></textarea>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700 bg-gray-900/50 rounded-b-2xl flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-white text-sm font-bold">Cancel</button>
          <button 
            onClick={handleUpdate}
            disabled={updating}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition disabled:opacity-50"
          >
            {updating ? "Saving..." : "Save Updates 💾"}
          </button>
        </div>

      </div>
    </div>
  );
}