import Navbar from "@/components/Navbar";
import { Bot, ShieldCheck, Zap, Users, Globe, Code } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans selection:bg-blue-500/30">
      <Navbar />
      
      {/* Hero Section */}
      <div className="pt-32 pb-20 px-6 text-center max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          Revolutionizing Job Hunting
        </h1>
        <p className="text-lg text-gray-400 leading-relaxed">
          Job Hunter AI is not just a tool; it's your personal career assistant. We combine advanced AI with intuitive design to help you organize, track, and land your dream job without the chaos of spreadsheets.
        </p>
      </div>

      {/* Mission Section */}
      <div className="max-w-6xl mx-auto px-6 mb-20">
        <div className="bg-gray-800/30 border border-gray-700 p-8 md:p-12 rounded-3xl text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-300 max-w-3xl mx-auto">
            To empower job seekers in Bangladesh and beyond by automating the tedious parts of the application process, allowing them to focus on what truly matters—preparing for interviews and upskilling.
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <h2 className="text-3xl font-bold mb-10 text-center">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Bot size={32} className="text-blue-400"/>}
            title="AI Automation"
            desc="Our Gemini-powered engine extracts job details from links, text, and even screenshots instantly."
          />
          <FeatureCard 
            icon={<ShieldCheck size={32} className="text-green-400"/>}
            title="Secure & Private"
            desc="Your data is yours. We use advanced encryption and secure authentication to keep your career moves private."
          />
          <FeatureCard 
            icon={<Zap size={32} className="text-yellow-400"/>}
            title="Lightning Fast"
            desc="Save jobs via our Telegram bot in seconds without even opening the website."
          />
          <FeatureCard 
            icon={<Users size={32} className="text-purple-400"/>}
            title="Community Driven"
            desc="See what others are applying for and stay motivated with our community activity feed."
          />
          <FeatureCard 
            icon={<Globe size={32} className="text-cyan-400"/>}
            title="Multi-Platform"
            desc="Access your dashboard from Mobile, Desktop, or Telegram. Seamless synchronization everywhere."
          />
          <FeatureCard 
            icon={<Code size={32} className="text-pink-400"/>}
            title="Modern Tech"
            desc="Built with Next.js 15, MongoDB, and Tailwind CSS for a smooth, app-like experience."
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 hover:border-blue-500/50 transition duration-300 hover:-translate-y-1">
      <div className="mb-4 bg-gray-900 w-fit p-3 rounded-xl">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{desc}</p>
    </div>
  );
}