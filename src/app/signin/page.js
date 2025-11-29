"use client";
import { signIn } from "next-auth/react";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, ArrowLeft, Mail, Lock, User } from "lucide-react";

function SignInForm() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const isVerified = searchParams.get("verified");
  const urlError = searchParams.get("error");

  const handleGoogleLogin = () => {
    setLoading(true);
    signIn("google", { callbackUrl: "/dashboard" });
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setFormError(res.error);
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans flex items-center justify-center p-4 md:p-0">
      
      <div className="w-full max-w-5xl bg-gray-800/30 rounded-3xl border border-gray-700 shadow-2xl overflow-hidden flex flex-col md:flex-row animate-fadeIn h-[650px]"> {/* Fixed height for better alignment */}
        
        {/* --- LEFT SIDE: Image Banner (Hidden on Mobile) --- */}
        <div className="hidden md:flex flex-1 relative overflow-hidden">
            
            {/* 1. Background Image from Net */}
            <img 
              src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop" 
              alt="Office" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            {/* 2. Gradient Overlay (Jate text pora jay) */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-purple-900/90 mix-blend-multiply"></div>
            
            {/* 3. Content */}
            <div className="relative z-10 w-full h-full flex flex-col justify-between p-12 text-white">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                            <User size={24} className="text-white" />
                        </span>
                        <h2 className="text-2xl font-extrabold tracking-wide">JobHunter AI</h2>
                    </div>
                    <p className="text-blue-100 text-sm opacity-90 ml-1">Your intelligent career assistant.</p>
                </div>

                <div className="space-y-4">
                    <h1 className="text-5xl font-bold leading-tight drop-shadow-lg">
                    Welcome Back,<br/> Hunter!
                    </h1>
                    <p className="text-blue-100 text-lg max-w-sm leading-relaxed drop-shadow-md">
                    Unlock your career potential. Track applications, ace interviews, and land your dream job with AI.
                    </p>
                </div>

                <div className="text-xs text-blue-200 opacity-70">
                    &copy; {new Date().getFullYear()} JobHunter AI. All rights reserved.
                </div>
            </div>
        </div>

        {/* --- RIGHT SIDE: Login Form --- */}
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
                    <h2 className="text-3xl font-bold text-white mb-2">Sign In</h2>
                    <p className="text-gray-400 text-sm">Enter your credentials to access your account.</p>
                </div>

                {/* Alerts */}
                <div className="space-y-3 mb-6">
                    {isVerified && (
                    <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-3 rounded-xl text-xs text-center flex items-center justify-center gap-2">
                        ✅ <span>Email verified! Login now.</span>
                    </div>
                    )}
                    {urlError === "InvalidToken" && (
                    <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 p-3 rounded-xl text-xs text-center">
                        ⚠️ Link expired or invalid.
                    </div>
                    )}
                    {formError && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-xs text-center">
                        ⚠️ {formError}
                    </div>
                    )}
                </div>

                {/* Google Button */}
                <button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full bg-white hover:bg-gray-100 text-gray-900 font-bold py-3 rounded-xl transition flex items-center justify-center gap-3 shadow-md disabled:opacity-70 transform active:scale-[0.98] text-sm"
                >
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-5 w-5" alt="Google" />
                    <span>Sign in with Google</span>
                </button>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-800"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                        <span className="px-3 bg-gray-900 text-gray-500 uppercase">Or with email</span>
                    </div>
                </div>

                {/* Form */}
                <form className="space-y-4" onSubmit={handleEmailLogin}>
                    <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-gray-400 ml-1">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-3.5 top-3 h-4 w-4 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="email"
                                placeholder="name@example.com"
                                className="w-full bg-gray-800 border border-gray-700 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center ml-1">
                            <label className="block text-xs font-semibold text-gray-400">Password</label>
                            <a href="#" className="text-xs text-blue-400 hover:text-blue-300 hover:underline">Forgot?</a>
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-3.5 top-3 h-4 w-4 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="w-full bg-gray-800 border border-gray-700 rounded-xl py-2.5 pl-10 pr-10 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98] mt-2 text-sm"
                    >
                        {loading ? "Signing In..." : "Sign In"}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-500 text-xs">
                        New here?{" "}
                        <Link href="/register" className="text-blue-400 hover:text-blue-300 font-bold hover:underline transition">
                            Create an account
                        </Link>
                    </p>
                </div>

            </div>
        </div>
      </div>
    </div>
  );
}

export default function SignIn() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 text-sm animate-pulse">Loading...</p>
        </div>
      </div>
    }>
      <SignInForm />
    </Suspense>
  );
}