"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { LayoutDashboard, PlusCircle, ListTodo, User, LogOut } from "lucide-react";
import Swal from "sweetalert2";
import { useEffect } from "react";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const router = useRouter();

  // --- 🔒 SECURITY CHECK ---
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading...</div>;
  }

  if (!session) {
    return null;
  }

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Add New Job", href: "/dashboard/add", icon: PlusCircle },
    { name: "Applications", href: "/dashboard/jobs", icon: ListTodo },
    { name: "Profile", href: "/dashboard/profile", icon: User },
  ];

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You will be logged out.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, Logout!',
      background: '#1f2937',
      color: '#fff',
      iconColor: '#f87171'
    }).then((result) => {
      if (result.isConfirmed) {
        signOut({ callbackUrl: "/" });
      }
    })
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      
      {/* --- MOBILE HEADER (Visible only on Mobile) --- */}
      <header className="md:hidden fixed top-0 w-full h-16 bg-gray-800 border-b border-gray-700 z-30 flex items-center justify-between px-4 shadow-md">
        {/* Logo */}
        <Link href="/" className="hover:opacity-80 transition">
          <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            JobHunter AI 🕵️‍♂️
          </h1>
        </Link>

        {/* Mobile Profile & Logout */}
        <div className="flex items-center gap-3">
          <img 
            src={session?.user?.image || "https://via.placeholder.com/40"} 
            alt="User" 
            className="w-8 h-8 rounded-full border border-blue-500 object-cover"
          />
          <button onClick={handleLogout} className="text-gray-400 hover:text-red-400">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* --- SIDEBAR (Visible only on Desktop) --- */}
      <aside className="hidden md:flex w-64 bg-gray-800 border-r border-gray-700 flex-col fixed h-full z-20">
        
        {/* Desktop Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-700">
          <Link href="/" className="hover:opacity-80 transition">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent cursor-pointer">
              JobHunter AI 🕵️‍♂️
            </h1>
          </Link>
        </div>

        {/* Desktop Nav Links */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
                    : "text-gray-400 hover:bg-gray-700 hover:text-white"
                }`}>
                  <item.icon size={20} />
                  <span className="font-medium text-sm">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Desktop Profile Footer */}
        <div className="p-4 border-t border-gray-700 bg-gray-800/50">
          <div className="flex items-center gap-3 p-2 rounded-lg transition group">
            <img 
              src={session?.user?.image || "https://via.placeholder.com/40"} 
              alt="User" 
              className="w-10 h-10 rounded-full border-2 border-blue-500 object-cover"
            />
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{session?.user?.name}</p>
              <p className="text-xs text-gray-400 truncate">{session?.user?.email}</p>
            </div>
            <button onClick={handleLogout} className="text-gray-500 hover:text-red-400 hover:bg-gray-700 p-2 rounded-full transition" title="Logout">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </aside>

      {/* --- MOBILE BOTTOM NAVIGATION (Visible only on Mobile) --- */}
      <nav className="md:hidden fixed bottom-0 w-full bg-gray-800 border-t border-gray-700 z-30 flex justify-around items-center h-16 px-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className="flex flex-col items-center justify-center w-full h-full">
              <div className={`flex flex-col items-center gap-1 transition-all ${
                isActive ? "text-blue-400" : "text-gray-500 hover:text-gray-300"
              }`}>
                <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{item.name.replace("My ", "").replace("New ", "")}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* --- MAIN CONTENT AREA --- */}
      {/* মোবাইলের জন্য উপরে এবং নিচে মার্জিন (mt-16, mb-16) দেওয়া হয়েছে */}
      {/* ডেস্কটপের জন্য বামে মার্জিন (md:ml-64) এবং প্যাডিং (md:p-8) দেওয়া হয়েছে */}
      <main className="flex-1 bg-gray-900 overflow-y-auto 
                       md:ml-64 p-4 md:p-8 
                       mt-16 mb-16 md:mt-0 md:mb-0">
        {children}
      </main>
    </div>
  );
}