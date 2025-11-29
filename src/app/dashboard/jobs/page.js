"use client";
import { useState, useEffect } from "react";
import JobTable from "@/components/JobTable";
import JobModal from "@/components/JobModal";
import { Search, Briefcase } from "lucide-react";

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
    // Change 1: px-2 দিয়েছি (খুবই অল্প গ্যাপ), যাতে হেডার আর টেবিল একই লাইনে থাকে
    <div className="animate-fadeIn px-2 md:p-6 max-w-7xl mx-auto">
      
      {/* Header & Search Container */}
      {/* Change 2: mb-6 (সার্চ বারের নিচে স্পেস ঠিক রেখেছি) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-3">
        
        {/* Title Section */}
        <div className="w-full md:w-auto">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg hidden sm:block">
               <Briefcase className="text-blue-400" size={24} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between md:justify-start gap-3">
                <h1 className="text-xl md:text-3xl font-bold text-white tracking-tight">
                  My Applications
                </h1>
                {/* Badge */}
                <span className="px-2 py-0.5 text-[10px] md:text-sm font-medium text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full">
                  {jobs.length} Tracked
                </span>
              </div>
              
              <p className="hidden md:block text-gray-400 text-sm mt-1">
                Manage and track your career opportunities efficiently.
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-96 group mt-1 md:mt-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Search by role, company..." 
            className="w-full bg-gray-900/50 border border-gray-700 text-white text-sm pl-9 pr-4 py-3 rounded-lg md:rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm hover:border-gray-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table Section */}
      {/* Change 3: টেবিল এবং হেডারের অ্যালাইনমেন্ট এক রাখতে এখানে আর আলাদা করে margin/border সরাইনি, সব প্যারেন্ট px-2 এর সাথে মিল থাকবে */}
      <div className="bg-gray-900/30 border border-gray-800 rounded-lg md:rounded-2xl overflow-hidden shadow-xl backdrop-blur-sm">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p>Loading your applications...</p>
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