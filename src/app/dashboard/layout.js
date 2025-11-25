"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // useRouter আনলাম
import { useSession, signOut } from "next-auth/react";
import { LayoutDashboard, PlusCircle, ListTodo, User, LogOut } from "lucide-react";
import Swal from "sweetalert2";
import { useEffect } from "react"; // useEffect আনলাম

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const { data: session, status } = useSession(); // status নিলাম
  const router = useRouter();

  // --- 🔒 SECURITY CHECK ---
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin"); // লগ-ইন না থাকলে ঘাড় ধাক্কা দিয়ে সাইন-ইন পেজে পাঠাবে
    }
  }, [status, router]);

  // লোডিং অবস্থায় কিছু দেখাবো না বা স্পিনার দেখাতে পারো
  if (status === "loading") {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading...</div>;
  }

  // যদি লগ-ইন না থাকে, কন্টেন্ট রেন্ডারই করব না (ফ্ল্যাশ বন্ধ হবে)
  if (!session) {
    return null;
  }

  // --- আগের কোড ---
  const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Add New Job", href: "/dashboard/add", icon: PlusCircle },
    { name: "My Applications", href: "/dashboard/jobs", icon: ListTodo },
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
      {/* Sidebar Code... (আগের মতোই থাকবে) */}
      <aside className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col fixed h-full z-20">
        <div className="h-16 flex items-center px-6 border-b border-gray-700">
          <Link href="/" className="hover:opacity-80 transition">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent cursor-pointer">
              JobHunter AI 🕵️‍♂️
            </h1>
          </Link>
        </div>

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
            <button onClick={handleLogout} className="text-gray-500 hover:text-red-400 hover:bg-gray-700 p-2 rounded-full transition">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 ml-64 p-8 bg-gray-900 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}