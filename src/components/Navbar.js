"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, LayoutDashboard, LogOut, User, Home, Info, Phone, Code, ArrowRight } from "lucide-react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path) => pathname === path ? "text-blue-400 font-bold" : "text-gray-300 hover:text-white";
  const mobileActive = (path) => pathname === path ? "bg-blue-600/10 text-blue-400" : "text-gray-300 hover:bg-gray-800";

  return (
    <nav className="fixed top-0 w-full bg-[#0f172a]/90 backdrop-blur-md border-b border-gray-800 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
        
        {/* 1. LOGO */}
        <Link href="/" onClick={() => setIsOpen(false)}>
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent cursor-pointer tracking-tight flex items-center gap-2">
            JobHunter AI <span className="text-2xl">🕵️‍♂️</span>
          </h1>
        </Link>

        {/* 2. DESKTOP LINKS */}
        <div className="hidden md:flex gap-8 text-sm font-medium">
          <Link href="/" className={isActive("/")}>Home</Link>
          <Link href="/about" className={isActive("/about")}>About</Link>
          <Link href="/contact" className={isActive("/contact")}>Contact</Link>
          <Link href="/developer" className={isActive("/developer")}>Developer</Link>
        </div>
        
        {/* 3. DESKTOP AUTH */}
        <div className="hidden md:flex items-center gap-4">
          {status === "authenticated" ? (
            <>
              <Link href="/dashboard">
                <button className={`text-sm font-semibold px-4 py-2 rounded-lg transition ${pathname === '/dashboard' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>
                  Dashboard
                </button>
              </Link>
              
              <div className="flex items-center gap-3 border-l border-gray-700 pl-4 ml-2">
                <img 
                  src={session?.user?.image || "https://via.placeholder.com/40"} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full border border-blue-500 object-cover"
                />
                <button 
                  onClick={() => signOut({ callbackUrl: "/" })} 
                  className="text-xs text-gray-400 hover:text-red-400 font-bold transition"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex gap-3">
              <Link href="/signin">
                <button className="text-gray-300 hover:text-white text-sm font-bold px-3 py-2">
                  Log In
                </button>
              </Link>
              <Link href="/register">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg shadow-blue-500/20 transition transform hover:scale-105">
                  Register
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* 4. MOBILE MENU BUTTON */}
        <button 
          className="md:hidden text-gray-300 hover:text-white focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

      </div>

      {/* --- MOBILE MENU DROPDOWN --- */}
      {isOpen && (
        <div className="md:hidden bg-[#0f172a] border-b border-gray-800 shadow-2xl absolute w-full left-0 top-16 px-4 py-6 animate-fadeIn h-screen overflow-y-auto pb-24">
          <div className="flex flex-col space-y-2">
            
            {/* Nav Links */}
            <div className="bg-gray-800/30 rounded-2xl p-2 border border-gray-800">
              <MobileLink href="/" icon={<Home size={20}/>} label="Home" active={mobileActive("/")} onClick={() => setIsOpen(false)} />
              <MobileLink href="/about" icon={<Info size={20}/>} label="About" active={mobileActive("/about")} onClick={() => setIsOpen(false)} />
              <MobileLink href="/contact" icon={<Phone size={20}/>} label="Contact" active={mobileActive("/contact")} onClick={() => setIsOpen(false)} />
              <MobileLink href="/developer" icon={<Code size={20}/>} label="Developer" active={mobileActive("/developer")} onClick={() => setIsOpen(false)} />
            </div>

            <div className="my-4"></div>

            {/* Auth Section - Logic Improved */}
            {status === "authenticated" ? (
              <div className="space-y-4 animate-fadeIn">
                {/* Profile Card */}
                <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-2xl border border-gray-700/50">
                   <img 
                    src={session.user.image || "https://via.placeholder.com/40"} 
                    alt="Profile" 
                    className="w-12 h-12 rounded-full border-2 border-blue-500 object-cover shadow-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-bold text-white truncate">{session.user.name}</p>
                    <p className="text-xs text-gray-400 truncate">{session.user.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Link href="/dashboard" onClick={() => setIsOpen(false)} className="col-span-2">
                    <button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-900/20 transition">
                      <LayoutDashboard size={18}/> Go to Dashboard
                    </button>
                  </Link>
                  
                  <button 
                    onClick={() => { signOut({ callbackUrl: "/" }); setIsOpen(false); }} 
                    className="col-span-2 flex items-center justify-center gap-2 bg-red-500/10 text-red-400 border border-red-500/20 py-3.5 rounded-xl font-bold text-sm hover:bg-red-500/20 transition"
                  >
                    <LogOut size={18}/> Logout
                  </button>
                </div>
              </div>
            ) : (
              // Guest User View
              <div className="space-y-4 animate-fadeIn">
                 {/* Guest CTA Buttons */}
                 <div className="grid grid-cols-1 gap-3">
                  <Link href="/register" onClick={() => setIsOpen(false)}>
                    <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-blue-900/30 hover:scale-[1.02] transition">
                      Start Tracking Free <ArrowRight size={20}/>
                    </button>
                  </Link>
                  
                  <Link href="/about" onClick={() => setIsOpen(false)}>
                    <button className="w-full bg-gray-800 border border-gray-700 text-gray-300 py-3.5 rounded-xl font-bold hover:bg-gray-700 transition">
                      Learn More
                    </button>
                  </Link>
                </div>

                <div className="text-center pt-4">
                  <p className="text-gray-500 text-sm">Already have an account?</p>
                  <Link href="/signin" onClick={() => setIsOpen(false)} className="text-blue-400 font-bold hover:underline">
                    Log In Here
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

// Helper for Mobile Links
function MobileLink({ href, icon, label, active, onClick }) {
  return (
    <Link href={href} onClick={onClick}>
      <div className={`flex items-center gap-4 px-4 py-3.5 rounded-xl font-medium transition ${active}`}>
        {icon}
        <span className="text-base">{label}</span>
      </div>
    </Link>
  );
}