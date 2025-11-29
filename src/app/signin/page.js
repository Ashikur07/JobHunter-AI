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
      
      <div className="w-full max-w-5xl bg-gray-800/30 rounded-3xl border border-gray-700 shadow-2xl overflow-hidden flex flex-col md:flex-row animate-fadeIn">
        
        {/* --- LEFT SIDE: Banner (Hidden on Mobile) --- */}
        <div className="hidden md:flex flex-1 bg-gradient-to-br from-blue-600 to-purple-700 p-10 flex-col justify-between relative overflow-hidden">
          {/* Abstract Background Shapes */}
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-black/10 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <h2 className="text-3xl font-extrabold text-white mb-2">JobHunter AI 🕵️‍♂️</h2>
            <p className="text-blue-100 text-sm">Your intelligent career assistant.</p>
          </div>

          <div className="relative z-10 space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Welcome Back, <br /> Hunter!
            </h1>
            <p className="text-blue-100 text-lg max-w-sm">
              Sign in to track your applications, manage interviews, and land your dream job.
            </p>
          </div>

          <div className="relative z-10 text-xs text-blue-200">
            &copy; {new Date().getFullYear()} JobHunter AI. All rights reserved.
          </div>
        </div>

        {/* --- RIGHT SIDE: Login Form --- */}
        <div className="flex-1 p-8 md:p-12 bg-gray-900 flex flex-col justify-center relative">
            
            {/* Back Button (Mobile Positioned inside padding) */}
            <button
              onClick={() => router.push("/")}
              className="absolute top-6 left-6 md:top-8 md:left-8 text-gray-500 hover:text-white transition flex items-center gap-2 text-sm font-medium group"
            >
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition" /> Back
            </button>

            <div className="max-w-md mx-auto w-full mt-8 md:mt-0">
                <div className="text-center md:text-left mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">Sign In</h2>
                    <p className="text-gray-400">Access your dashboard using your email.</p>
                </div>

                {/* --- ALERTS --- */}
                <div className="space-y-4 mb-6">
                    {isVerified && (
                    <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-3 rounded-xl text-sm text-center flex items-center justify-center gap-2">
                        ✅ <span>Email verified! You can now log in.</span>
                    </div>
                    )}

                    {urlError === "InvalidToken" && (
                    <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 p-3 rounded-xl text-sm text-center">
                        ⚠️ Verification link expired or invalid.
                    </div>
                    )}

                    {formError && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm text-center">
                        ⚠️ {formError}
                    </div>
                    )}
                </div>

                {/* --- GOOGLE LOGIN --- */}
                <button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full bg-white hover:bg-gray-100 text-gray-900 font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-3 shadow-md disabled:opacity-70 transform active:scale-[0.98]"
                >
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-5 w-5" alt="Google" />
                    <span>Sign in with Google</span>
                </button>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-gray-900 text-gray-500 font-medium uppercase">Or continue with</span>
                    </div>
                </div>

                {/* --- EMAIL FORM --- */}
                <form className="space-y-5" onSubmit={handleEmailLogin}>
                    
                    {/* Email Input */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-300 ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-500" />
                            <input
                                type="email"
                                placeholder="name@example.com"
                                className="w-full bg-gray-800/50 border border-gray-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    
                    {/* Password Input */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center ml-1">
                            <label className="block text-sm font-semibold text-gray-300">Password</label>
                            <a href="#" className="text-xs text-blue-400 hover:text-blue-300 hover:underline font-medium">Forgot password?</a>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-500" />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="w-full bg-gray-800/50 border border-gray-700 rounded-xl py-3 pl-12 pr-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-3.5 text-gray-500 hover:text-gray-300 transition focus:outline-none"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>
                    
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98] mt-4"
                    >
                        {loading ? "Signing In..." : "Sign In to Account"}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-gray-400 text-sm">
                        Don't have an account?{" "}
                        <Link href="/register" className="text-blue-400 hover:text-blue-300 font-bold hover:underline transition">
                            Sign up for free
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
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 animate-pulse">Loading...</p>
        </div>
      </div>
    }>
      <SignInForm />
    </Suspense>
  );
}