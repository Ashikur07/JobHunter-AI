import { useState, useEffect } from "react";
import { MapPin, Phone, Linkedin, Github, Globe, Facebook, X, Save, Edit3, User } from "lucide-react";

export default function UserProfile({ session }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // ডাটা রাখার জন্য স্টেট
  const [formData, setFormData] = useState({
    bio: "", location: "", phone: "",
    links: { linkedin: "", github: "", portfolio: "", facebook: "" }
  });

  // ক্যানসেল করলে আগের ডাটায় ফিরে যাওয়ার জন্য ব্যাকআপ
  const [originalData, setOriginalData] = useState(null);

  // ডাটা লোড করা
  useEffect(() => {
    fetch("/api/user")
      .then(res => res.json())
      .then(res => {
        if(res.success && res.data) {
          const data = {
            bio: res.data.bio || "",
            location: res.data.location || "",
            phone: res.data.phone || "",
            links: {
              linkedin: res.data.links?.linkedin || "",
              github: res.data.links?.github || "",
              portfolio: res.data.links?.portfolio || "",
              facebook: res.data.links?.facebook || ""
            }
          };
          setFormData(data);
          setOriginalData(data); // ব্যাকআপ রেখে দিলাম
        }
      });
  }, []);

  // আপডেট হ্যান্ডলার
  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setOriginalData(formData); // সাকসেস হলে ব্যাকআপ আপডেট
        setIsEditing(false);
        alert("Profile Updated Successfully! 🎉");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ক্যানসেল হ্যান্ডলার
  const handleCancel = () => {
    setFormData(originalData); // আগের ডাটায় ফিরে গেলাম
    setIsEditing(false); // এডিট মোড বন্ধ
  };

  return (
    <div className="w-full bg-gray-800/50 backdrop-blur-sm rounded-3xl border border-gray-700 shadow-2xl overflow-hidden animate-fadeIn">
      
      {/* --- Banner Image --- */}
      <div className="h-40 bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30"></div>
      </div>
      
      <div className="px-8 pb-10 relative">
        
        {/* --- Header Section (Avatar & Actions) --- */}
        <div className="flex flex-col md:flex-row justify-between items-end -mt-16 mb-8">
          <div className="flex items-end gap-6">
            <div className="relative group">
              <img 
                src={session?.user?.image || "https://via.placeholder.com/150"} 
                alt="Profile" 
                className="w-32 h-32 rounded-full border-4 border-gray-900 shadow-2xl object-cover bg-gray-800"
              />
              <div className="absolute bottom-2 right-2 bg-green-500 w-5 h-5 rounded-full border-4 border-gray-900"></div>
            </div>
            <div className="mb-2">
              <h2 className="text-3xl font-bold text-white">{session?.user?.name}</h2>
              <p className="text-gray-400">{session?.user?.email}</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-4 md:mt-0">
            {isEditing ? (
              <>
                <button 
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-gray-700 hover:bg-gray-600 text-gray-300 transition"
                >
                  <X size={16} /> Cancel
                </button>
                <button 
                  onClick={handleUpdate}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/30 transition disabled:opacity-50"
                >
                  <Save size={16} /> {loading ? "Saving..." : "Save Changes"}
                </button>
              </>
            ) : (
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm bg-gray-700 hover:bg-gray-600 text-white border border-gray-600 transition hover:border-gray-500"
              >
                <Edit3 size={16} /> Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* --- Content Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Bio & Personal Info */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Bio Section */}
            <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-700/50">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <User size={18} className="text-blue-400"/> About Me
              </h3>
              {isEditing ? (
                <textarea 
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 text-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition resize-none"
                  rows="4"
                  placeholder="Write a short professional bio..."
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                />
              ) : (
                <p className="text-gray-400 leading-relaxed">
                  {formData.bio || "No bio added yet. Click edit to introduce yourself!"}
                </p>
              )}
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-900/50 p-5 rounded-2xl border border-gray-700/50 flex items-center gap-4">
                <div className="bg-blue-500/10 p-3 rounded-full text-blue-400"><MapPin size={20} /></div>
                <div className="flex-1">
                  <label className="text-xs text-gray-500 uppercase font-bold">Location</label>
                  {isEditing ? (
                    <input type="text" className="w-full bg-transparent border-b border-gray-600 focus:border-blue-500 outline-none text-white text-sm py-1" 
                      placeholder="City, Country"
                      value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
                  ) : (<p className="text-white font-medium">{formData.location || "N/A"}</p>)}
                </div>
              </div>

              <div className="bg-gray-900/50 p-5 rounded-2xl border border-gray-700/50 flex items-center gap-4">
                <div className="bg-green-500/10 p-3 rounded-full text-green-400"><Phone size={20} /></div>
                <div className="flex-1">
                  <label className="text-xs text-gray-500 uppercase font-bold">Phone</label>
                  {isEditing ? (
                    <input type="text" className="w-full bg-transparent border-b border-gray-600 focus:border-green-500 outline-none text-white text-sm py-1" 
                      placeholder="+880 1XXX..."
                      value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                  ) : (<p className="text-white font-medium">{formData.phone || "N/A"}</p>)}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Social Links */}
          <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-700/50 h-fit">
            <h3 className="text-lg font-bold text-white mb-6">Social Presence</h3>
            <div className="space-y-5">
              
              <SocialInput 
                icon={<Linkedin size={18} />} color="text-blue-400" label="LinkedIn" 
                isEditing={isEditing} value={formData.links.linkedin} 
                onChange={(v) => setFormData({...formData, links: {...formData.links, linkedin: v}})} 
              />
              
              <SocialInput 
                icon={<Github size={18} />} color="text-white" label="GitHub" 
                isEditing={isEditing} value={formData.links.github} 
                onChange={(v) => setFormData({...formData, links: {...formData.links, github: v}})} 
              />
              
              <SocialInput 
                icon={<Globe size={18} />} color="text-purple-400" label="Portfolio" 
                isEditing={isEditing} value={formData.links.portfolio} 
                onChange={(v) => setFormData({...formData, links: {...formData.links, portfolio: v}})} 
              />
              
              <SocialInput 
                icon={<Facebook size={18} />} color="text-blue-600" label="Facebook" 
                isEditing={isEditing} value={formData.links.facebook} 
                onChange={(v) => setFormData({...formData, links: {...formData.links, facebook: v}})} 
              />

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Helper Component for Social Inputs
function SocialInput({ icon, color, label, isEditing, value, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`p-2.5 rounded-lg bg-gray-800 border border-gray-700 ${color}`}>
        {icon}
      </div>
      <div className="flex-1 overflow-hidden">
        <label className="text-xs text-gray-500 block mb-0.5">{label}</label>
        {isEditing ? (
          <input 
            type="text" 
            className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs text-white focus:border-blue-500 outline-none"
            placeholder="Paste link..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        ) : (
          value ? (
            <a href={value} target="_blank" className="text-sm text-blue-400 hover:underline truncate block">
              {value.replace(/^https?:\/\/(www\.)?/, '')}
            </a>
          ) : <span className="text-xs text-gray-600">Not connected</span>
        )}
      </div>
    </div>
  );
}