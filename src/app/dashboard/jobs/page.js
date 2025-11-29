"use client";
import { useState, useEffect } from "react";
import JobTable from "@/components/JobTable";
import JobModal from "@/components/JobModal";
import { Search, Briefcase, Filter } from "lucide-react";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // ডাটা লোড করা
  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/jobs");
      const data = await res.json();
      if (data.success) {
        setJobs(data.data);
        setFilteredJobs(data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  // সার্চ লজিক
  useEffect(() => {
    const results = jobs.filter(job => 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.location && job.location.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredJobs(results);
  }, [searchTerm, jobs]);

  return (
    <div className="animate-fadeIn pb-20 md:pb-0">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-8 gap-6">
        
        {/* Title & Stats Card */}
        <div className="w-full lg:w-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">My Applications</h1>
          
          {/* Stats Card (New Design) */}
          <div className="bg-gray-800/80 border border-gray-700/50 p-5 rounded-2xl flex items-center gap-5 shadow-lg backdrop-blur-sm max-w-sm hover:border-blue-500/30 transition duration-300">
            <div className="p-4 bg-blue-500/10 rounded-xl text-blue-400 shadow-inner border border-blue-500/10">
              <Briefcase size={28} />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Total Tracked</p>
              <div className="flex items-baseline gap-2">
                <h2 className="text-4xl font-extrabold text-white">{jobs.length}</h2>
                <span className="text-sm font-medium text-gray-500">jobs found</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="w-full lg:w-[450px]">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="text-gray-500 group-focus-within:text-blue-500 transition-colors" size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Search by role, company, or location..." 
              className="block w-full bg-gray-900/80 border border-gray-700 text-white rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm text-sm placeholder-gray-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <Filter size={16} className="text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* --- TABLE SECTION --- */}
      <div className="bg-gray-800/30 border border-gray-700/30 rounded-2xl overflow-hidden shadow-2xl">
        {isLoading ? (
          <div className="text-center text-gray-500 py-32 flex flex-col items-center gap-4">
             <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
             <p className="animate-pulse">Loading your applications...</p>
          </div>
        ) : (
          <JobTable jobs={filteredJobs} onViewDetails={setSelectedJob} />
        )}
      </div>

      {/* Modal */}
      <JobModal 
        job={selectedJob} 
        onClose={() => setSelectedJob(null)} 
        onUpdate={fetchJobs} 
      />
    </div>
  );
}