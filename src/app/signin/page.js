"use client";
import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // URL থেকে প্যারামিটার ধরা (যাতে মেসেজ দেখানো যায়)
  const isVerified = searchParams.get("verified");
  const urlError = searchParams.get("error");

  // Google Login Handler
  const handleGoogleLogin = () => {
    setLoading(true);
    signIn("google", { callbackUrl: "/dashboard" });
  };

  // Email/Password Login Handler
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
      setFormError(res.error); // পাসওয়ার্ড ভুল বা ভেরিফাই করা নেই
      setLoading(false);
    } else {
      router.push("/dashboard"); // সফল হলে ড্যাশবোর্ডে যাও
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 animate-fadeIn">
        
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
          <p className="text-gray-500 text-sm mt-2">Sign in to manage your job applications</p>
        </div>

        {/* --- ALERTS SECTION --- */}

        {/* 1. Success Message (Email Verified) */}
        {isVerified && (
          <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 text-sm text-center border border-green-200 flex items-center justify-center gap-2">
            ✅ <span>Email verified successfully! You can now log in.</span>
          </div>
        )}

        {/* 2. URL Error (Invalid Token / Link Expired) */}
        {urlError === "InvalidToken" && (
          <div className="bg-yellow-100 text-yellow-700 p-3 rounded-lg mb-4 text-sm text-center border border-yellow-200">
            ⚠️ Verification link expired or already used. Please try logging in.
          </div>
        )}
        {urlError === "TokenMissing" && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm text-center border border-red-200">
            ❌ Invalid verification link.
          </div>
        )}

        {/* 3. Form Submission Error (Wrong Password etc.) */}
        {formError && (
          <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm text-center border border-red-200">
            ⚠️ {formError}
          </div>
        )}

        {/* --- GOOGLE BUTTON --- */}
        <button 
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 border border-gray-300 py-3.5 rounded-lg hover:bg-gray-50 transition text-gray-700 font-semibold shadow-sm disabled:opacity-70"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-6 w-6" alt="Google" />
          {loading ? "Connecting..." : "Continue with Google"}
        </button>

        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="px-3 text-gray-400 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* --- EMAIL FORM --- */}
        <form className="space-y-4" onSubmit={handleEmailLogin}>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1">Email Address</label>
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-800 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1">Password</label>
            <input 
              type="password" 
              placeholder="Enter password" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-800 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition shadow-lg disabled:opacity-50 transform active:scale-95"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* --- FOOTER LINKS --- */}
        <div className="mt-6 text-center flex justify-between text-sm">
          <a href="#" className="text-blue-600 hover:underline">Forgot password?</a>
          <Link href="/register" className="text-gray-600 hover:text-blue-600 font-semibold">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}