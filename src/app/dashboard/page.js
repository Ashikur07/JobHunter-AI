"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Briefcase, CheckCircle, Clock, XCircle, FileText } from "lucide-react"; // আইকন ইম্পোর্ট

export default function DashboardOverview() {
  const { data: session } = useSession();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetch("/api/jobs").then(res => res.json()).then(data => {
      if(data.success) setJobs(data.data);
    });
  }, []);

  // Stats Calculation
  const total = jobs.length;
  const applied = jobs.filter(j => j.status === 'Applied').length;
  const interview = jobs.filter(j => j.status === 'Interview').length;
  const offer = jobs.filter(j => j.status === 'Offer').length;
  const rejected = jobs.filter(j => j.status === 'Rejected').length;

  // Chart Data
  const pieData = [
    { name: 'Applied', value: applied, color: '#3b82f6' }, // Blue
    { name: 'Interview', value: interview, color: '#eab308' }, // Yellow
    { name: 'Offer', value: offer, color: '#22c55e' }, // Green
    { name: 'Rejected', value: rejected, color: '#ef4444' }, // Red
  ];

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white">Welcome back, {session?.user?.name}! 👋</h2>
        <p className="text-gray-400">Here is your job hunt overview.</p>
      </div>

      {/* Summary Cards with Icons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card 
          title="Total Jobs" 
          count={total} 
          color="bg-gray-800 border-gray-700" 
          icon={<Briefcase size={24} className="text-gray-400" />} 
        />
        <Card 
          title="Interviews" 
          count={interview} 
          color="bg-yellow-500/10 border-yellow-500/30 text-yellow-400" 
          icon={<Clock size={24} className="text-yellow-400" />} 
        />
        <Card 
          title="Offers" 
          count={offer} 
          color="bg-green-500/10 border-green-500/30 text-green-400" 
          icon={<CheckCircle size={24} className="text-green-400" />} 
        />
        <Card 
          title="Rejected" 
          count={rejected} 
          color="bg-red-500/10 border-red-500/30 text-red-400" 
          icon={<XCircle size={24} className="text-red-400" />} 
        />
      </div>

      {/* Graphs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Status Chart */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 h-[400px] flex flex-col"> {/* হাইট ফিক্সড করলাম */}
          <h3 className="text-lg font-bold mb-4">Application Status</h3>
          <div className="flex-1 w-full min-h-0"> {/* flex-1 দিয়ে বাকি জায়গাটা চার্টকে দিলাম */}
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={pieData} 
                  innerRadius={60} 
                  outerRadius={80} 
                  paddingAngle={5} 
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} itemStyle={{ color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-400 mt-4">
            {pieData.map(item => (
              <div key={item.name} className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full" style={{backgroundColor: item.color}}></span>
                {item.name}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Text */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 h-[400px] overflow-y-auto"> {/* হাইট ফিক্সড করলাম */}
          <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {jobs.slice(0, 10).map(job => ( // ১০টা জব দেখাবে
              <div key={job._id} className="flex justify-between items-center border-b border-gray-700 pb-2 last:border-0 hover:bg-gray-700/30 p-2 rounded transition">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-gray-700 rounded-lg">
                     <FileText size={16} className="text-blue-400"/>
                   </div>
                   <div>
                    <p className="font-bold text-white text-sm">{job.company}</p>
                    <p className="text-xs text-gray-400">{job.title}</p>
                   </div>
                </div>
                <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase ${
                  job.status === 'Applied' ? 'bg-blue-500/10 text-blue-400' : 
                  job.status === 'Interview' ? 'bg-yellow-500/10 text-yellow-400' : 
                  job.status === 'Offer' ? 'bg-green-500/10 text-green-400' : 
                  'bg-red-500/10 text-red-400'
                }`}>{job.status}</span>
              </div>
            ))}
            {jobs.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <p>No activity yet.</p>
                </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

// আপডেটেড কার্ড কম্পোনেন্ট (আইকন সহ)
function Card({ title, count, color, icon }) {
  return (
    <div className={`p-6 rounded-xl border shadow-lg ${color} flex items-center justify-between transition hover:scale-105 duration-200`}>
      <div>
        <p className="text-xs uppercase tracking-wider opacity-70 mb-1 font-bold">{title}</p>
        <h3 className="text-3xl font-extrabold">{count}</h3>
      </div>
      <div className="p-3 bg-white/5 rounded-full backdrop-blur-sm">
        {icon}
      </div>
    </div>
  );
}