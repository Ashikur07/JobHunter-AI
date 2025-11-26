import Navbar from "@/components/Navbar";
import Link from "next/link";
import { ArrowRight, MapPin, Briefcase, Zap, Layout, Smartphone } from "lucide-react";

// ডাটা আনার ফাংশন (Server Side)
async function getRecentJobs() {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/jobs?type=public`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    return [];
  }
}

export default async function LandingPage() {
  const recentJobs = await getRecentJobs();

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans selection:bg-blue-500/30">
      <Navbar />
      
      {/* --- HERO SECTION --- */}
      <div className="relative pt-32 pb-16 px-6 text-center overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6 animate-fadeIn">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            New: Telegram Bot Integration
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
            Track Jobs. <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Get Hired.</span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Stop using messy spreadsheets. Automate your job tracking with AI. 
            Save jobs from LinkedIn, BDJobs, or screenshots instantly.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/dashboard">
              <button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transform hover:-translate-y-1">
                Start Tracking Free <ArrowRight size={20}/>
              </button>
            </Link>
            <Link href="/about">
              <button className="bg-gray-800/50 hover:bg-gray-800 text-white px-8 py-4 rounded-xl font-bold text-lg transition border border-gray-700 flex items-center justify-center">
                Learn More
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* --- FEATURES GRID (তোমার পছন্দের ৩টা কার্ড) --- */}
      <div className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Zap size={32} className="text-yellow-400"/>}
            title="AI Powered"
            desc="Automatically extracts job details from job posts links or screenshots in seconds."
            color="hover:border-yellow-500/30"
          />
          <FeatureCard 
            icon={<Layout size={32} className="text-blue-400"/>}
            title="Organized Dashboard"
            desc="Keep all your applications in one place with status updates and interview dates."
            color="hover:border-blue-500/30"
          />
          <FeatureCard 
            icon={<Smartphone size={32} className="text-green-400"/>}
            title="Telegram Bot"
            desc="Save jobs directly from your phone using our smart Telegram bot while scrolling."
            color="hover:border-green-500/30"
          />
        </div>
      </div>

      {/* --- COMMUNITY ACTIVITY (Recent Jobs) --- */}
      <div className="bg-gray-900/50 border-t border-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Community Activity 🌏</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              See what jobs top talents in the community are applying to right now. Click to view details.
            </p>
          </div>
          
          {recentJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentJobs.map((job) => (
                <Link href={`/jobs/${job._id}`} key={job._id} className="group">
                  <div className="bg-gray-800/40 backdrop-blur-md border border-gray-700/50 p-6 rounded-2xl hover:border-blue-500/50 hover:bg-gray-800/80 transition-all duration-300 h-full flex flex-col justify-between relative overflow-hidden cursor-pointer shadow-lg hover:shadow-blue-500/10">
                    
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-2.5 bg-gray-700/30 rounded-xl text-2xl border border-gray-700/50">💼</div>
                        <span className="text-xs font-mono text-gray-500 bg-gray-900/80 px-2 py-1 rounded border border-gray-800">
                          {new Date(job.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition line-clamp-1">
                        {job.title}
                      </h3>
                      <p className="text-gray-400 font-medium mb-4 line-clamp-1 text-sm">{job.company}</p>

                      <div className="flex flex-wrap gap-2 mb-6">
                        <span className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-gray-300 bg-gray-700/30 px-2 py-1 rounded border border-gray-700/50">
                          <MapPin size={10} className="text-blue-400"/> {job.location || "Remote"}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-gray-300 bg-gray-700/30 px-2 py-1 rounded border border-gray-700/50">
                          <Briefcase size={10} className="text-purple-400"/> {job.platform || "Web"}
                        </span>
                      </div>
                    </div>

                    {/* Applicant Footer */}
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-700/50 mt-auto">
                      <img 
                        src={job.applicant?.image || "https://via.placeholder.com/30"} 
                        alt="User" 
                        className="w-8 h-8 rounded-full border border-gray-600 group-hover:border-blue-500 transition"
                      />
                      <div className="flex-1">
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">Tracked by</p>
                        <p className="text-xs font-bold text-gray-300 group-hover:text-white transition">
                          {job.applicant?.name || "Anonymous"}
                        </p>
                      </div>
                      <ArrowRight size={16} className="text-gray-600 group-hover:text-blue-400 transform group-hover:translate-x-1 transition" />
                    </div>

                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-800/20 rounded-3xl border border-gray-800 border-dashed">
              <p className="text-gray-500 text-lg">No public activity yet. Start tracking to appear here!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ফিচার কার্ড কম্পোনেন্ট
function FeatureCard({ icon, title, desc, color }) {
  return (
    <div className={`bg-gray-800/40 backdrop-blur p-8 rounded-3xl border border-gray-700/50 transition duration-300 hover:-translate-y-1 ${color} group`}>
      <div className="mb-6 p-4 bg-gray-900/50 rounded-2xl w-fit group-hover:scale-110 transition duration-300 border border-gray-800">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-white group-hover:text-blue-200 transition">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{desc}</p>
    </div>
  );
}