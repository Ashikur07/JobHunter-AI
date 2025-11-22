"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import JobInputForm from "@/components/JobInputForm";
import JobTable from "@/components/JobTable";
import JobModal from "@/components/JobModal";

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/jobs");
      const data = await res.json();
      if (data.success) setJobs(data.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 font-sans text-white">
      <Navbar totalJobs={jobs.length} />
      
      <main className="pt-24 px-4 max-w-7xl mx-auto pb-10">
        <JobInputForm onJobAdded={fetchJobs} />
        <JobTable jobs={jobs} onViewDetails={setSelectedJob} />
      </main>

      <JobModal job={selectedJob} onClose={() => setSelectedJob(null)} />
    </div>
  );
}