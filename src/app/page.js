"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import JobInputForm from "@/components/JobInputForm";
import JobTable from "@/components/JobTable";
import JobModal from "@/components/JobModal";

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  
  // --- Search State ---
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  // --- Search Logic ---
  useEffect(() => {
    // সার্চবক্সে কিছু লিখলে এই ফিল্টার চলবে
    const results = jobs.filter(job => 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.location && job.location.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredJobs(results);
  }, [searchTerm, jobs]);

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/jobs");
      const data = await res.json();
      if (data.success) {
        setJobs(data.data);
        setFilteredJobs(data.data); // শুরুতে সব জব দেখাবে
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 font-sans text-white">
      <Navbar totalJobs={jobs.length} />
      
      <main className="pt-24 px-4 max-w-7xl mx-auto pb-10">
        
        <JobInputForm onJobAdded={fetchJobs} />

        {/* --- SEARCH BAR SECTION --- */}
        <div className="flex justify-between items-center mb-4 mt-8">
          <h2 className="text-xl font-bold text-gray-200 border-l-4 border-blue-500 pl-3">
            Tracked Applications ({filteredJobs.length})
          </h2>
          
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search by Title, Company or Location..." 
              className="bg-gray-800 border border-gray-700 text-white text-sm rounded-full pl-10 pr-4 py-2 w-64 md:w-80 focus:border-blue-500 outline-none transition focus:w-96"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {/* Search Icon */}
            <svg className="w-4 h-4 text-gray-500 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
        </div>

        {/* ফিল্টার করা জবগুলো টেবিলে পাঠাচ্ছি */}
        <JobTable jobs={filteredJobs} onViewDetails={setSelectedJob} />
      
      </main>

      <JobModal 
        job={selectedJob} 
        onClose={() => setSelectedJob(null)} 
        onUpdate={fetchJobs}
      />
    </div>
  );
}