"use client";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  // ৩ ধরনের ইনপুট স্টেট
  const [activeTab, setActiveTab] = useState("link"); // ডিফল্টভাবে লিংক ট্যাব খোলা থাকবে
  const [inputUrl, setInputUrl] = useState("");
  const [inputText, setInputText] = useState("");
  const [image, setImage] = useState(null);
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [jobs, setJobs] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/jobs");
      const data = await res.json();
      if (data.success) setJobs(data.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleExtract = async () => {
    setLoading(true);
    setResult(null);

    try {
      let payload = {};
      
      // কোন ট্যাব একটিভ আছে তার ওপর ভিত্তি করে ডাটা পাঠাবো
      if (activeTab === "link") payload = { url: inputUrl };
      else if (activeTab === "screenshot") payload = { image };
      else if (activeTab === "text") payload = { text: inputText };

      if (Object.keys(payload).length === 0) return;

      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      
      if (data.success) setResult(data.data);
      else alert("Failed to extract info. Try another method.");
      
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!result) return;
    setSaving(true);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result),
      });
      const data = await res.json();
      if (data.success) {
        alert("Job Saved! 🎉");
        // রিসেট
        setInputUrl("");
        setInputText("");
        setImage(null);
        setResult(null);
        fetchJobs();
      }
    } catch (error) {
      console.error("Error saving:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8 text-blue-400">Job Hunter AI 🕵️‍♂️</h1>
      
      <div className="w-full max-w-3xl bg-gray-800 p-6 rounded-xl shadow-lg mb-10 border border-gray-700">
        
        {/* Tabs */}
        <div className="flex mb-6 border-b border-gray-700">
          <button onClick={() => setActiveTab("link")} className={`flex-1 pb-2 font-bold ${activeTab === "link" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400"}`}>🔗 Link Paste</button>
          <button onClick={() => setActiveTab("screenshot")} className={`flex-1 pb-2 font-bold ${activeTab === "screenshot" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400"}`}>📸 Screenshot</button>
          <button onClick={() => setActiveTab("text")} className={`flex-1 pb-2 font-bold ${activeTab === "text" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400"}`}>📝 Copy Text</button>
        </div>

        {/* Tab 1: Link Input */}
        {activeTab === "link" && (
          <input 
            type="text" 
            placeholder="Paste Job Link (LinkedIn, BDJobs, etc)..."
            className="w-full p-4 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 text-white mb-4"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
          />
        )}

        {/* Tab 2: Screenshot Input */}
        {activeTab === "screenshot" && (
          <div className="mb-4">
            <input 
              type="file" accept="image/*" onChange={handleImageUpload}
              className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:bg-blue-600 file:text-white cursor-pointer bg-gray-700 rounded-lg"
            />
            {image && <img src={image} alt="Preview" className="mt-2 h-40 object-contain mx-auto" />}
          </div>
        )}

        {/* Tab 3: Text Input */}
        {activeTab === "text" && (
          <textarea
            className="w-full p-4 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 text-white mb-4"
            rows="4"
            placeholder="Paste full job description text..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          ></textarea>
        )}

        {/* Extract Button */}
        <button
          onClick={handleExtract}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-bold transition disabled:opacity-50"
        >
          {loading ? "Fetching & Analyzing..." : "Extract Job Data 🚀"}
        </button>

        {/* Result Preview */}
        {result && (
          <div className="mt-6 p-4 bg-gray-700 rounded-lg border border-green-500 animate-fadeIn">
            <h3 className="text-green-400 font-bold mb-2">Preview:</h3>
            <p><strong>Title:</strong> {result.title}</p>
            <p><strong>Company:</strong> {result.company}</p>
            <button onClick={handleSave} disabled={saving} className="mt-4 w-full bg-green-600 hover:bg-green-700 py-2 rounded-lg font-bold transition">
              {saving ? "Saving..." : "Save to Database 💾"}
            </button>
          </div>
        )}
      </div>

      {/* Job List */}
      <div className="w-full max-w-5xl">
        <h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">Saved Jobs ({jobs.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <div key={job._id} className="bg-gray-800 p-5 rounded-lg border border-gray-700 hover:border-blue-500 transition">
              <h3 className="font-bold text-white truncate">{job.title}</h3>
              <p className="text-blue-400 text-sm">{job.company}</p>
              <p className="text-xs text-gray-400 mt-2">📅 {new Date(job.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}