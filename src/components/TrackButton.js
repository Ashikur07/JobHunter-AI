"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PlusCircle, CheckCircle } from "lucide-react";

export default function TrackButton({ job }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [tracked, setTracked] = useState(false);

  const handleTrack = async () => {
    // 1. Login na thakle login page e pathabo
    if (!session) {
      alert("Please login to track this job!");
      router.push("/signin");
      return;
    }

    // Nijer job track kora jabe na
    if (session.user.email === job.userEmail) {
      alert("You are already tracking this job!");
      return;
    }

    setLoading(true);

    try {
      // 2. Job Details niye notun entry create kora (Cloning)
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: job.title,
          company: job.company,
          location: job.location,
          salary: job.salary,
          description: job.description,
          postLink: job.postLink,
          platform: job.platform,
          status: "Applied" // Notun user er jonno surute Applied thakbe
        }),
      });

      if (res.ok) {
        setTracked(true);
        alert("Job added to your dashboard! 🚀");
        router.push("/dashboard/jobs"); // Dashboard e niye jabo
      }
    } catch (error) {
      console.error(error);
      alert("Failed to track job.");
    } finally {
      setLoading(false);
    }
  };

  if (tracked) {
    return (
      <button className="w-full bg-green-600/20 text-green-400 border border-green-600/50 py-3 rounded-xl font-bold flex items-center justify-center gap-2 cursor-default">
        <CheckCircle size={20} /> Added to Dashboard
      </button>
    );
  }

  return (
    <button 
      onClick={handleTrack}
      disabled={loading}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
    >
      {loading ? "Adding..." : <><PlusCircle size={20} /> Track This Job</>}
    </button>
  );
}