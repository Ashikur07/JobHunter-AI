import Navbar from "@/components/Navbar";
import dbConnect from "@/lib/mongodb";
import Job from "@/models/Job";
import User from "@/models/User";
import Link from "next/link";
import { MapPin, Calendar, DollarSign, Building, Mail, Linkedin, Github, ArrowLeft, ExternalLink } from "lucide-react";
import TrackButton from "@/components/TrackButton"; // Notun Component Import

async function getJobDetails(id) {
  try {
    await dbConnect();
    const job = await Job.findById(id).lean();
    if (!job) return null;
    
    const user = await User.findOne({ email: job.userEmail }).lean();
    
    // Object ID ke string e convert korchi jate client component e pass kora jay (Very Important)
    job._id = job._id.toString();
    job.applicationDate = job.applicationDate ? job.applicationDate.toISOString() : null;
    job.createdAt = job.createdAt ? job.createdAt.toISOString() : null;
    
    // User er info clean korchi
    const applicant = user ? {
      name: user.name,
      image: user.image,
      email: user.email, // Mailto er jonno lagbe
      bio: user.bio,
      links: user.links
    } : null;

    return { ...job, applicant };
  } catch (error) {
    return null;
  }
}

export default async function JobDetailsPage({ params }) {
  const { id } = await params;
  const job = await getJobDetails(id);

  if (!job) return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold text-gray-500">Job Not Found 😕</h1>
      <Link href="/" className="text-blue-400 hover:underline">Go Back Home</Link>
    </div>
  );

  // Client Component e pass korar jonno data prepare kora
  const jobForTracking = {
    title: job.title,
    company: job.company,
    location: job.location,
    salary: job.salary,
    description: job.description,
    postLink: job.postLink,
    platform: job.platform,
    userEmail: job.userEmail
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans selection:bg-blue-500/30">
      <Navbar />

      <div className="max-w-6xl mx-auto pt-32 pb-20 px-6">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition">
          <ArrowLeft size={18}/> Back to Feed
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- Left Column: Job Details --- */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-800/50 backdrop-blur border border-gray-700 p-8 rounded-3xl shadow-xl">
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">{job.title}</h1>
                  <div className="flex items-center gap-3 text-xl text-blue-400 font-medium">
                    <Building size={24}/> {job.company}
                  </div>
                </div>
                <span className={`px-5 py-2 rounded-full text-sm font-bold border uppercase tracking-wide ${
                  job.status === 'Applied' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                  job.status === 'Interview' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 
                  job.status === 'Offer' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                  'bg-gray-700 text-gray-400 border-gray-600'
                }`}>
                  {job.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <DetailBox icon={<MapPin size={20} className="text-blue-500"/>} label="Location" value={job.location || "Remote"} />
                <DetailBox icon={<DollarSign size={20} className="text-green-500"/>} label="Salary" value={job.salary || "Negotiable"} />
                <DetailBox icon={<Calendar size={20} className="text-purple-500"/>} label="Applied On" value={job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "N/A"} />
              </div>

              <div className="prose prose-invert max-w-none">
                <h3 className="text-lg font-bold text-white mb-4 border-b border-gray-700 pb-2">Job Summary</h3>
                <div className="text-gray-300 leading-relaxed whitespace-pre-wrap text-base bg-gray-900/30 p-6 rounded-xl border border-gray-700/50">
                  {job.description || "No description provided for this job."}
                </div>
              </div>

              {/* --- ACTION BUTTONS --- */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-700">
                {job.postLink && (
                  <a href={job.postLink} target="_blank" className="inline-flex justify-center items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-bold transition border border-gray-600 w-full sm:w-auto">
                    View Original Post <ExternalLink size={18}/>
                  </a>
                )}
                
                {/* Track Button Component */}
                <div className="w-full sm:w-auto sm:flex-1">
                  <TrackButton job={jobForTracking} />
                </div>
              </div>

            </div>
          </div>

          {/* --- Right Column: Tracker Profile --- */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 backdrop-blur border border-gray-700 p-8 rounded-3xl sticky top-24 shadow-xl">
              <h3 className="text-xs font-bold text-gray-500 uppercase mb-8 tracking-wider text-center">Tracked By</h3>
              
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6 group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-30 group-hover:opacity-75 transition duration-500"></div>
                  <img 
                    src={job.applicant?.image || "https://via.placeholder.com/150"} 
                    alt="User" 
                    className="relative w-28 h-28 rounded-full border-4 border-gray-900 object-cover shadow-2xl bg-gray-800"
                  />
                  <div className="absolute bottom-2 right-2 bg-green-500 w-5 h-5 rounded-full border-4 border-gray-900"></div>
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-2">{job.applicant?.name || "Anonymous"}</h2>
                <p className="text-gray-400 text-sm mb-8 px-2 leading-relaxed">
                  {job.applicant?.bio || "Tech enthusiast and proactive job hunter."}
                </p>

                <div className="w-full space-y-3">
                  {job.applicant?.links?.linkedin && (
                    <SocialLink href={job.applicant.links.linkedin} icon={<Linkedin size={18}/>} label="LinkedIn Profile" color="text-[#0077b5] border-[#0077b5]/20 bg-[#0077b5]/10 hover:bg-[#0077b5]/20" />
                  )}
                  {job.applicant?.links?.github && (
                    <SocialLink href={job.applicant.links.github} icon={<Github size={18}/>} label="GitHub Profile" color="text-white border-gray-600 bg-gray-700/50 hover:bg-gray-700" />
                  )}
                  
                  {/* Mailto Link Added Here */}
                  {job.applicant?.email ? (
                    <a 
                      href={`mailto:${job.applicant.email}`}
                      className="flex items-center justify-center gap-3 w-full border border-gray-600 hover:bg-gray-700/50 text-gray-300 py-3 rounded-xl transition font-medium cursor-pointer"
                    >
                      <Mail size={18}/> Send Message
                    </a>
                  ) : (
                    <button disabled className="flex items-center justify-center gap-3 w-full border border-gray-700 text-gray-600 py-3 rounded-xl cursor-not-allowed">
                        <Mail size={18}/> Email Private
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function DetailBox({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 text-gray-300 bg-gray-900/50 p-4 rounded-xl border border-gray-700/50">
      {icon}
      <div>
        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">{label}</p>
        <p className="text-sm font-bold text-white truncate w-32">{value}</p>
      </div>
    </div>
  );
}

function SocialLink({ href, icon, label, color }) {
  return (
    <a href={href} target="_blank" className={`flex items-center justify-center gap-3 w-full py-3 rounded-xl transition font-medium border ${color}`}>
      {icon} {label}
    </a>
  );
}