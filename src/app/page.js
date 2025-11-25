import Navbar from "@/components/Navbar";
import Link from "next/link";

// ডাটা নিয়ে আসার ফাংশন (Server Side)
async function getRecentJobs() {
  try {
    // API থেকে পাবলিক জবগুলো আনছি
    // process.env.NEXTAUTH_URL অবশ্যই .env.local এ থাকতে হবে
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/jobs?type=public`, { 
      cache: 'no-store' // প্রতিবার নতুন ডাটা দেখাবে
    });
    
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching public jobs:", error);
    return [];
  }
}

export default async function LandingPage() {
  const recentJobs = await getRecentJobs();

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      
      {/* 1. Navbar (উপরে থাকবে) */}
      <Navbar />
      
      {/* 2. Hero Section (তোমার পছন্দ করা ডিজাইন) */}
      <div className="flex flex-col items-center justify-center pt-32 px-6 text-center">
        <div className="mb-6 flex justify-center">
          <span className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-400 ring-1 ring-white/10 hover:ring-white/20 transition cursor-pointer">
            New: Save jobs via Telegram Bot! 🤖
          </span>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent mb-6 animate-fadeIn">
          Job Hunter AI 🕵️‍♂️
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mb-10">
          Stop using spreadsheets. Automate your job tracking with AI. 
          Save jobs from LinkedIn, BDJobs, and more with just one click.
        </p>
        
        <div className="flex gap-4">
          <Link href="/dashboard">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-bold text-lg transition shadow-lg shadow-blue-500/30 hover:scale-105 transform">
              Start Tracking 🚀
            </button>
          </Link>
          <Link href="/about">
            <button className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-full font-bold text-lg transition border border-gray-700">
              Learn More
            </button>
          </Link>
        </div>
      </div>

      {/* 3. Features Grid */}
      <div className="max-w-6xl mx-auto mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 px-6 pb-20 border-b border-gray-800">
        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 hover:border-blue-500/50 transition duration-300">
          <div className="text-4xl mb-4">🤖</div>
          <h3 className="text-xl font-bold mb-2 text-blue-100">AI Powered</h3>
          <p className="text-gray-400">Automatically extracts job details from job posts links or screenshots.</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 hover:border-purple-500/50 transition duration-300">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-xl font-bold mb-2 text-purple-100">Organized Dashboard</h3>
          <p className="text-gray-400">Keep all your applications in one place with status updates and interview dates.</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 hover:border-green-500/50 transition duration-300">
          <div className="text-4xl mb-4">📱</div>
          <h3 className="text-xl font-bold mb-2 text-green-100">Telegram Bot</h3>
          <p className="text-gray-400">Save jobs directly from your phone using our smart Telegram bot.</p>
        </div>
      </div>

      {/* 4. Recent Activity Section (নতুন যুক্ত করা হয়েছে) */}
      <div className="max-w-7xl mx-auto py-20 px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-2">Community Activity</h2>
          <p className="text-gray-400">See what jobs people are tracking right now</p>
        </div>
        
        {recentJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentJobs.map((job) => (
              <div key={job._id} className="bg-gray-900/50 p-6 rounded-xl border border-gray-700 hover:border-blue-500/50 transition hover:-translate-y-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-white truncate pr-2" title={job.title}>{job.title}</h3>
                  <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded border border-gray-700">
                    {new Date(job.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <p className="text-blue-400 font-medium mb-4 truncate">{job.company}</p>
                <div className="flex items-center text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    📍 {job.location || "Remote"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-800/30 rounded-xl border border-gray-800">
            <p className="text-gray-500">No public activity yet. Be the first to track a job!</p>
          </div>
        )}
      </div>

    </div>
  );
}