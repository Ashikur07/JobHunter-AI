"use client";
import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowLeft, Mail, Lock, User, UserPlus } from "lucide-react";

function RegisterForm() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Registration Successful! 📧 Please check your email to verify.");
        router.push("/signin");
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans flex items-center justify-center p-4 md:p-0">
      
      <div className="w-full max-w-5xl bg-gray-800/30 rounded-3xl border border-gray-700 shadow-2xl overflow-hidden flex flex-col md:flex-row animate-fadeIn h-[700px]"> 
        
        {/* --- LEFT SIDE: Image Banner (Hidden on Mobile) --- */}
        <div className="hidden md:flex flex-1 relative overflow-hidden">
            
            {/* Background Image */}
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop" 
              alt="Team working" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/90 to-blue-900/90 mix-blend-multiply"></div>
            
            {/* Content */}
            <div className="relative z-10 w-full h-full flex flex-col justify-between p-12 text-white">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                            <UserPlus size={24} className="text-white" />
                        </span>
                        <h2 className="text-2xl font-extrabold tracking-wide">JobHunter AI</h2>
                    </div>
                    <p className="text-purple-100 text-sm opacity-90 ml-1">Join the community.</p>
                </div>

                <div className="space-y-4">
                    <h1 className="text-5xl font-bold leading-tight drop-shadow-lg">
                    Start Your <br/> Journey!
                    </h1>
                    <p className="text-purple-100 text-lg max-w-sm leading-relaxed drop-shadow-md">
                    Create an account to unlock powerful tracking tools, AI insights, and land your dream job faster.
                    </p>
                </div>

                <div className="text-xs text-purple-200 opacity-70">
                    &copy; {new Date().getFullYear()} JobHunter AI. All rights reserved.
                </div>
            </div>
        </div>

        {/* --- RIGHT SIDE: Register Form --- */}
        <div className="flex-1 bg-gray-900 flex flex-col justify-center relative p-8 md:p-12 overflow-y-auto">
            
            {/* Back Button */}
            <button
              onClick={() => router.push("/")}
              className="absolute top-6 left-6 text-gray-500 hover:text-white transition flex items-center gap-2 text-sm font-medium group z-20"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition" /> Back
            </button>

            <div className="max-w-sm mx-auto w-full mt-6">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                    <p className="text-gray-400 text-sm">Join us today! It takes only a few steps.</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-xs text-center mb-6 flex items-center justify-center gap-2">
                        ⚠️ <span>{error}</span>
                    </div>
                )}

                {/* Google Button */}
                <button
                    onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                    className="w-full bg-white hover:bg-gray-100 text-gray-900 font-bold py-3 rounded-xl transition flex items-center justify-center gap-3 shadow-md transform active:scale-[0.98] text-sm"
                >
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-5 w-5" alt="Google" />
                    <span>Sign up with Google</span>
                </button>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-800"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                        <span className="px-3 bg-gray-900 text-gray-500 uppercase">Or register with email</span>
                    </div>
                </div>

                {/* Registration Form */}
                <form className="space-y-4" onSubmit={handleSubmit}>
                    
                    {/* Name Input */}
                    <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-gray-400 ml-1">Full Name</label>
                        <div className="relative group">
                            <User className="absolute left-3.5 top-3 h-4 w-4 text-gray-500 group-focus-within:text-purple-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="John Doe"
                                className="w-full bg-gray-800 border border-gray-700 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                                onChange={(e) => setForm({...form, name: e.target.value})}
                                required
                            />
                        </div>
                    </div>

                    {/* Email Input */}
                    <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-gray-400 ml-1">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-3.5 top-3 h-4 w-4 text-gray-500 group-focus-within:text-purple-500 transition-colors" />
                            <input
                                type="email"
                                placeholder="name@example.com"
                                className="w-full bg-gray-800 border border-gray-700 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                                onChange={(e) => setForm({...form, email: e.target.value})}
                                required
                            />
                        </div>
                    </div>
                    
                    {/* Password Input */}
                    <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-gray-400 ml-1">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-3.5 top-3 h-4 w-4 text-gray-500 group-focus-within:text-purple-500 transition-colors" />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Create a strong password"
                                className="w-full bg-gray-800 border border-gray-700 rounded-xl py-2.5 pl-10 pr-10 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                                onChange={(e) => setForm({...form, password: e.target.value})}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-gray-500 hover:text-white transition focus:outline-none"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>
                    
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98] mt-2 text-sm"
                    >
                        {loading ? "Creating Account..." : "Sign Up Free"}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-500 text-xs">
                        Already have an account?{" "}
                        <Link href="/signin" className="text-purple-400 hover:text-purple-300 font-bold hover:underline transition">
                            Log in here
                        </Link>
                    </p>
                </div>

            </div>
        </div>
      </div>
    </div>
  );
}

export default function Register() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 text-sm animate-pulse">Loading...</p>
        </div>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}