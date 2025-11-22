export default function Navbar({ totalJobs }) {
  return (
    <nav className="fixed top-0 w-full bg-gray-900/80 backdrop-blur-md border-b border-gray-800 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent cursor-pointer">
          JobHunter AI 🕵️‍♂️
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">
            Tracked Jobs: <span className="text-white font-bold text-lg">{totalJobs}</span>
          </span>
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
            U
          </div>
        </div>
      </div>
    </nav>
  );
}