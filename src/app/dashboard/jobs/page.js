"use client";
import { useState, useEffect } from "react";
import JobTable from "@/components/JobTable";
import JobModal from "@/components/JobModal";
import { Search } from "lucide-react";

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
    <div className="animate-fadeIn">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">My Applications</h1>
          <p className="text-gray-400 text-sm mt-1">
            Total Tracked: <span className="text-blue-400 font-bold">{jobs.length}</span> jobs
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-3 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Search by role, company..." 
            className="w-full bg-gray-800 border border-gray-700 text-white pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:border-blue-500 transition shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="text-center text-gray-500 py-20">Loading your applications...</div>
      ) : (
        <JobTable jobs={filteredJobs} onViewDetails={setSelectedJob} />
      )}

      {/* Modal */}
      <JobModal 
        job={selectedJob} 
        onClose={() => setSelectedJob(null)} 
        onUpdate={fetchJobs} 
      />
    </div>
  );
}