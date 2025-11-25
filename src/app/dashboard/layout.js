"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { LayoutDashboard, PlusCircle, ListTodo, User, LogOut } from "lucide-react";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Add New Job", href: "/dashboard/add", icon: PlusCircle },
    { name: "My Applications", href: "/dashboard/jobs", icon: ListTodo },
    { name: "Profile", href: "/dashboard/profile", icon: User },
  ];

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col fixed h-full z-20">
        
        {/* Logo Area */}
        <div className="h-16 flex items-center px-6 border-b border-gray-700">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            JobHunter AI 🕵️‍♂️
          </h1>
        </div>

        {/* Navigation Links */}
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

        {/* User Profile (Bottom Left - Like your screenshot) */}
        <div className="p-4 border-t border-gray-700 bg-gray-800/50">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 transition cursor-pointer group">
            <img 
              src={session?.user?.image || "https://via.placeholder.com/40"} 
              alt="User" 
              className="w-10 h-10 rounded-full border-2 border-blue-500"
            />
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{session?.user?.name}</p>
              <p className="text-xs text-gray-400 truncate">{session?.user?.email}</p>
            </div>
            <button onClick={() => signOut({ callbackUrl: "/" })} className="text-gray-500 hover:text-red-400">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 ml-64 p-8 bg-gray-900 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}