"use client";
import JobInputForm from "@/components/JobInputForm";
import { useRouter } from "next/navigation";

export default function AddJobPage() {
  const router = useRouter();

  // জব অ্যাড হলে লিস্ট পেজে নিয়ে যাবো
  const handleJobAdded = () => {
    // একটু সময় নিয়ে রিডাইরেক্ট করছি যাতে ইউজার সাকসেস মেসেজ দেখতে পায়
    setTimeout(() => {
      router.push("/dashboard/jobs");
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn">
      {/* Header Section */}
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-3xl font-bold text-white mb-2">Track a New Application 🚀</h1>
        <p className="text-gray-400">
          Found a job? Paste the link, text description, or upload a screenshot below.
        </p>
      </div>

      {/* Input Form */}
      <div className="bg-gray-800/50 p-1 rounded-2xl border border-gray-700 shadow-2xl">
        <JobInputForm onJobAdded={handleJobAdded} />
      </div>

      {/* Helpful Tips */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <TipCard icon="🔗" title="Link Paste" desc="Best for LinkedIn & BDJobs. We fetch details automatically." />
        <TipCard icon="📸" title="Screenshot" desc="Great for mobile users. Just snap and upload." />
        <TipCard icon="📝" title="Text Paste" desc="Copy job description text and paste it directly." />
      </div>
    </div>
  );
}

function TipCard({ icon, title, desc }) {
  return (
    <div className="bg-gray-800 p-5 rounded-xl border border-gray-700 hover:border-blue-500/50 transition">
      <div className="text-2xl mb-3">{icon}</div>
      <h3 className="font-bold text-white mb-1">{title}</h3>
      <p className="text-sm text-gray-400">{desc}</p>
    </div>
  );
}