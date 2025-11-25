"use client";
import { useSession } from "next-auth/react";
import UserProfile from "@/components/UserProfile";

export default function ProfilePage() {
  const { data: session } = useSession();

  return (
    <div className="max-w-5xl mx-auto animate-fadeIn">
      
      <div className="mb-8 border-b border-gray-800 pb-6">
        <h1 className="text-3xl font-bold text-white">My Profile</h1>
        <p className="text-gray-400 mt-2">
          Manage your personal details and professional links. 
          These details can be useful when generating resumes (Future feature 😉).
        </p>
      </div>

      {/* Profile Component */}
      <div className="bg-gray-800/30 p-1 rounded-2xl border border-gray-700/50 shadow-xl">
        <UserProfile session={session} />
      </div>

    </div>
  );
}