"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // একটিভ লিংক দেখানোর জন্য

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  // একটিভ লিংক চেক করার ফাংশন
  const isActive = (path) => pathname === path ? "text-blue-400 font-bold" : "text-gray-300 hover:text-white";

  return (
    <nav className="fixed top-0 w-full bg-gray-900/90 backdrop-blur-md border-b border-gray-800 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
        
        {/* 1. LOGO */}
        <Link href="/">
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent cursor-pointer tracking-tight">
            JobHunter AI 🕵️‍♂️
          </h1>
        </Link>

        {/* 2. CENTER LINKS (Desktop Only) */}
        <div className="hidden md:flex gap-8 text-sm font-medium">
          <Link href="/" className={isActive("/")}>Home</Link>
          <Link href="/about" className={isActive("/about")}>About</Link>
          <Link href="/contact" className={isActive("/contact")}>Contact</Link>
          <Link href="/developer" className={isActive("/developer")}>Developer</Link>
        </div>
        
        {/* 3. RIGHT SIDE (Auth Buttons) */}
        <div className="flex items-center gap-4">
          {session ? (
            // লগ-ইন অবস্থায়
            <>
              <Link href="/dashboard">
                <button className={`text-sm font-semibold px-4 py-2 rounded-lg transition ${pathname === '/dashboard' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>
                  Dashboard
                </button>
              </Link>
              
              <div className="flex items-center gap-3 border-l border-gray-700 pl-4 ml-2">
                <img 
                  src={session.user.image} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full border border-blue-500"
                />
                <button 
                  onClick={() => signOut({ callbackUrl: "/" })} 
                  className="text-xs text-red-400 hover:text-red-300 font-bold border border-red-500/30 px-3 py-1.5 rounded-full hover:bg-red-500/10 transition"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            // লগ-আউট অবস্থায়
            <div className="flex gap-3">
              <Link href="/signin">
                <button className="text-gray-300 hover:text-white text-sm font-bold px-3 py-2">
                  Log In
                </button>
              </Link>
              <Link href="/signin">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg shadow-blue-500/20 transition transform hover:scale-105">
                  Register
                </button>
              </Link>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}