import Navbar from "@/components/Navbar";
import { Github, Linkedin, Mail, Phone, ExternalLink, Code2, Database, Layout, Terminal } from "lucide-react";

export default function DeveloperPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans selection:bg-blue-500/30">
      <Navbar />
      
      {/* --- HERO SECTION --- */}
      <div className="pt-32 pb-16 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none"></div>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10 relative z-10">
          
          {/* Image */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
            {/* TODO: Replace this URL with your real image later */}
            <img 
              src="/profile.png" 
              alt="Md Ashik Ali" 
              className="relative w-48 h-48 md:w-64 md:h-64 rounded-full border-4 border-gray-900 object-cover shadow-2xl"
            />
          </div>

          {/* Intro */}
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-2">Md Ashik Ali</h1>
            <p className="text-xl text-blue-400 font-medium mb-4">Front-End Focused MERN Stack Developer</p>
            <p className="text-gray-400 max-w-xl leading-relaxed mb-6">
              Passionate about creating interactive, user-friendly interfaces and contributing to innovative web projects. Experienced in building real-world web applications with modern technologies.
            </p>
            
            {/* Social Links */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <SocialLink href="mailto:ashik.ict.iu@gmail.com" icon={<Mail size={18}/>} text="Email" />
              <SocialLink href="tel:+8801743439382" icon={<Phone size={18}/>} text="Phone" />
              <SocialLink href="https://linkedin.com/in/ashik43" icon={<Linkedin size={18}/>} text="LinkedIn" />
              <SocialLink href="https://github.com/Ashikur07" icon={<Github size={18}/>} text="GitHub" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-20 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- LEFT COLUMN (Skills & Education) --- */}
        <div className="space-y-8">
          
          {/* Skills */}
          <Section title="Technical Skills" icon={<Terminal size={20}/>}>
            <SkillCategory title="Frontend" items={["React.js", "Next.js", "TypeScript", "Tailwind CSS", "Vite"]} />
            <SkillCategory title="Backend" items={["Node.js", "Express.js", "REST APIs", "Firebase", "Authentication"]} />
            <SkillCategory title="Database" items={["MongoDB", "PostgreSQL"]} />
            <SkillCategory title="Tools" items={["Git", "GitHub", "VS Code", "Postman", "Vercel", "Figma"]} />
          </Section>

          {/* Education */}
          <Section title="Education" icon={<Layout size={20}/>}>
            <div className="border-l-2 border-gray-700 pl-4 ml-1">
              <h4 className="font-bold text-lg">B.Sc in ICT</h4>
              <p className="text-blue-400">Islamic University, Bangladesh</p>
              <p className="text-sm text-gray-400 mt-1">Jan 2020 – Aug 2025</p>
              <p className="text-sm text-green-400 font-bold mt-1">CGPA: 3.53</p>
            </div>
          </Section>

          {/* Certifications */}
          <Section title="Certifications" icon={<ShieldCheckIcon size={20}/>}>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start gap-2">• Complete Web Development (Programming Hero, 2024)</li>
              <li className="flex items-start gap-2">• Front-End Development (EDGE Program, 2025)</li>
              <li className="flex items-start gap-2">• National RoboFest 2024 - Hackathon</li>
            </ul>
          </Section>
        </div>

        {/* --- RIGHT COLUMN (Experience & Projects) --- */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Experience */}
          <Section title="Work Experience" icon={<BriefcaseIcon size={20}/>}>
            <TimelineItem 
              role="Webmaster" 
              company="IEEE IU Student Branch" 
              date="Sep 2025 – Present"
              desc={[
                "Redesigned website UI/UX, increasing engagement by 35%.",
                "Launched 5+ digital initiatives, enhancing member participation."
              ]} 
            />
            <TimelineItem 
              role="Web Developer (Team Project)" 
              company="ICT Department, Islamic University" 
              date="Mar 2025 – May 2025"
              desc={[
                "Developed official Silver Jubilee website handling 500+ registrations.",
                "Optimized frontend and backend, reducing processing time by 40%."
              ]} 
            />
            <TimelineItem 
              role="Lab Assistant - Frontend" 
              company="EDGE Program, ICT Division" 
              date="May 2024 – Feb 2025"
              desc={[
                "Conducted React & JS workshops for 70+ trainees.",
                "Mentored students through real-world projects, boosting completion by 25%."
              ]} 
            />
          </Section>

          {/* Projects */}
          <Section title="Featured Projects" icon={<Code2 size={20}/>}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ProjectCard 
                title="Job Hunter AI" 
                tech="Next.js, MongoDB, Gemini AI, Telegram Bot"
                desc="A smart job tracking platform with AI automation and multi-platform support."
                link="https://job-hunter-ai-lcq6.vercel.app"
                target="_blank"
              />
              <ProjectCard 
                title="ICT Reunion Website" 
                tech="Next.js, Tailwind, Node.js, Express"
                desc="Event management system handling 500+ registrations and payments."
                link="https://www.ictiu.ac.bd"
                target="_blank"
              />
              <ProjectCard 
                title="LearnQuest (LMS)" 
                tech="React, Vite, Firebase, SSLCommerz"
                desc="E-Learning platform for 200+ learners with assignments and analytics."
                link="https://assignment-12-by-ashik.netlify.app"
                target="_blank"
              />
              <ProjectCard 
                title="BDJOB (Portal)" 
                tech="React, Vite, Express, MongoDB"
                desc="Secure job portal with encrypted login and smart filtering."
                link="https://assignment-11-by-ashik.netlify.app"
                target="_blank"
              />
            </div>
          </Section>

        </div>
      </div>
    </div>
  );
}

// --- Helper Components ---

function SocialLink({ href, icon, text }) {
  return (
    <a href={href} target="_blank" className="flex items-center gap-2 bg-gray-800 hover:bg-blue-600 px-4 py-2 rounded-full transition text-sm font-medium border border-gray-700 hover:border-blue-500">
      {icon} {text}
    </a>
  );
}

function Section({ title, icon, children }) {
  return (
    <div className="bg-gray-800/40 border border-gray-700/50 rounded-2xl p-6 md:p-8 hover:border-gray-600 transition">
      <div className="flex items-center gap-3 mb-6 border-b border-gray-700 pb-3">
        <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400">{icon}</div>
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function SkillCategory({ title, items }) {
  return (
    <div className="mb-4 last:mb-0">
      <h4 className="text-gray-400 text-sm font-bold uppercase mb-2">{title}</h4>
      <div className="flex flex-wrap gap-2">
        {items.map(item => (
          <span key={item} className="px-3 py-1 bg-gray-900 border border-gray-700 rounded-lg text-xs font-medium text-gray-300">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function TimelineItem({ role, company, date, desc }) {
  return (
    <div className="relative pl-6 pb-8 border-l-2 border-gray-700 last:border-0 last:pb-0">
      <div className="absolute -left-[9px] top-0 w-4 h-4 bg-blue-500 rounded-full border-4 border-gray-800"></div>
      <h3 className="text-lg font-bold text-white">{role}</h3>
      <p className="text-blue-400 text-sm font-medium">{company}</p>
      <p className="text-xs text-gray-500 mb-3">{date}</p>
      <ul className="space-y-1">
        {desc.map((d, i) => (
          <li key={i} className="text-gray-400 text-sm flex items-start gap-2">
            <span className="mt-1.5 w-1 h-1 bg-gray-500 rounded-full shrink-0"></span>
            {d}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ⚠️ ফিক্স: target প্রপ যোগ করা হয়েছে
function ProjectCard({ title, tech, desc, link, target }) {
  return (
    <div className="bg-gray-900 p-4 rounded-xl border border-gray-800 hover:border-blue-500/50 transition group">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold text-white group-hover:text-blue-400 transition">{title}</h4>
        {/* target প্রপ এখানে ব্যবহার করা হয়েছে */}
        <a href={link} target={target} className="text-gray-500 hover:text-white"><ExternalLink size={16}/></a>
      </div>
      <p className="text-xs text-blue-300 mb-2 font-mono">{tech}</p>
      <p className="text-sm text-gray-400 line-clamp-3">{desc}</p>
    </div>
  );
}

function BriefcaseIcon({size}) { return <Briefcase size={size}/> } // Wrapper for Lucide
import { Briefcase, ShieldCheck as ShieldCheckIcon } from "lucide-react"; // Import missing icons