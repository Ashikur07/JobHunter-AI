import Navbar from "@/components/Navbar";
import Link from "next/link";
import { ArrowRight, MapPin, Briefcase, Zap, Layout, Smartphone, User } from "lucide-react";

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

  // ডিফল্ট ইউজার ইমেজ (যদি অ্যাপ্লিক্যান্টের ছবি না থাকে)
  const defaultUserImage = "https://cdn-icons-png.flaticon.com/512/149/149071.png"; 

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
      <Navbar />
      
      {/* --- HERO SECTION --- */}
      <div className="relative pt-40 pb-20 px-6 text-center">
        {/* Background Glows */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-600/20 blur-[100px] rounded-full pointer-events-none opacity-50"></div>

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          
          {/* New Feature Badge */}
          <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8 animate-fadeIn">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            New: Telegram Bot Integration
          </div>
          
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
            Track Jobs. <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              Get Hired.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl leading-relaxed">
            Stop using messy spreadsheets. Automate your job tracking with AI. 
            Save jobs from LinkedIn, BDJobs, or screenshots instantly.
          </p>
          
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <button className="w-full bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transform hover:-translate-y-1">
                Start Tracking Free <ArrowRight size={20}/>
              </button>
            </Link>
            <Link href="/about" className="w-full sm:w-auto">
              <button className="w-full bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition border border-gray-700">
                Learn More
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* --- FEATURES GRID --- */}
      <div className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard 
            icon={<Zap size={28} className="text-yellow-400"/>}
            title="AI Powered"
            desc="Automatically extracts details from links or screenshots instantly."
            color="border-yellow-500/20 hover:border-yellow-500/50"
          />
          <FeatureCard 
            icon={<Layout size={28} className="text-blue-400"/>}
            title="Organized Dashboard"
            desc="Keep all your applications in one place with status updates."
            color="border-blue-500/20 hover:border-blue-500/50"
          />
          <FeatureCard 
            icon={<Smartphone size={28} className="text-green-400"/>}
            title="Telegram Bot"
            desc="Save jobs directly from your phone while scrolling."
            color="border-green-500/20 hover:border-green-500/50"
          />
        </div>
      </div>

      {/* --- COMMUNITY ACTIVITY (New Card Design) --- */}
      <div className="bg-[#0b1121] border-t border-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Community Activity 🌏</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              See what jobs others are tracking. Join the hunt!
            </p>
          </div>
          
          {recentJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentJobs.map((job) => (
                <Link href={`/jobs/${job._id}`} key={job._id} className="group">
                  {/* Card Container */}
                  <div className="bg-[#161f32] border border-gray-700/50 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl h-full flex flex-col justify-between">
                    
                    <div>
                      {/* Icon & Date */}
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center border border-gray-700 shadow-inner">
                           <Briefcase size={20} className="text-gray-400" />
                        </div>
                        <span className="text-xs font-mono text-gray-500 bg-gray-900 px-2 py-1 rounded border border-gray-800">
                          {new Date(job.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </div>

                      {/* Title & Company */}
                      <h3 className="text-xl font-bold text-blue-400 mb-1 line-clamp-1 group-hover:text-blue-300 transition">
                        {job.title}
                      </h3>
                      <p className="text-gray-400 text-sm font-medium mb-5 line-clamp-1">
                        {job.company}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-gray-300 bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-700">
                          <MapPin size={10} className="text-blue-400"/> {job.location || "Remote"}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-gray-300 bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-700">
                          <Briefcase size={10} className="text-purple-400"/> {job.platform || "Web"}
                        </span>
                      </div>
                    </div>

                    {/* Footer: Tracked By */}
                    <div className="pt-4 border-t border-gray-700/50 flex items-center gap-3">
                      <img 
                        src={job.applicant?.image || defaultUserImage} 
                        alt="User" 
                        className="w-9 h-9 rounded-full border-2 border-gray-700 object-cover"
                      />
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Tracked by</p>
                        <p className="text-sm text-white font-semibold">
                          {job.applicant?.name || "Anonymous"}
                        </p>
                      </div>
                    </div>

                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-800/20 rounded-3xl border border-gray-800 border-dashed">
              <p className="text-gray-500 text-lg">No public activity yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc, color }) {
  return (
    <div className={`bg-gray-800/30 p-6 rounded-2xl border border-gray-700/50 transition duration-300 hover:-translate-y-1 ${color}`}>
      <div className="mb-4 bg-gray-900 w-fit p-3 rounded-xl border border-gray-800">{icon}</div>
      <h3 className="text-lg font-bold mb-2 text-white">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}