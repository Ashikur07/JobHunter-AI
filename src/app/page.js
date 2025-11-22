"use client";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [image, setImage] = useState(null); // ছবি রাখার জন্য স্টেট
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [jobs, setJobs] = useState([]);
  const fileInputRef = useRef(null); // ফাইল ইনপুট ধরার জন্য

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

  // ছবি কনভার্ট করার ফাংশন (File -> Base64)
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // ছবি প্রিভিউ দেখানোর জন্য
        setInput(""); // ছবি দিলে টেক্সট বক্স ক্লিয়ার করে দেব
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExtract = async () => {
    if (!input && !image) return;
    setLoading(true);
    setResult(null);

    try {
      // আমরা টেক্সট অথবা ছবি পাঠাচ্ছি
      const payload = image ? { image } : { text: input };

      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) setResult(data.data);
      else alert("Something went wrong!");
    } catch (error) {
      console.error("Error:", error);
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
        setInput("");
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
        
        {/* Image Upload Section */}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-300">Option 1: Upload Screenshot (Best for Mobile)</label>
          <input 
            type="file" 
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="block w-full text-sm text-gray-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-600 file:text-white
              hover:file:bg-blue-700 cursor-pointer bg-gray-700 rounded-lg"
          />
          {/* Image Preview */}
          {image && (
            <div className="mt-2 relative w-full h-48 bg-gray-900 rounded-lg overflow-hidden border border-blue-500">
              <img src={image} alt="Preview" className="w-full h-full object-contain" />
              <button 
                onClick={() => { setImage(null); fileInputRef.current.value = ""; }}
                className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full text-xs"
              >
                ❌
              </button>
            </div>
          )}
        </div>

        <div className="text-center text-gray-500 my-2">- OR -</div>

        {/* Text Input Section */}
        <textarea
          className="w-full p-4 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 text-white mb-4"
          rows="3"
          placeholder="Option 2: Paste Job Description Text..."
          value={input}
          onChange={(e) => { setInput(e.target.value); setImage(null); }}
          disabled={!!image} // ছবি থাকলে টেক্সট বন্ধ থাকবে
        ></textarea>

        <button
          onClick={handleExtract}
          disabled={loading || (!input && !image)}
          className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Analyzing Image/Text..." : "Extract Info 🚀"}
        </button>

        {/* Result & Save Preview */}
        {result && (
          <div className="mt-6 p-4 bg-gray-700 rounded-lg border border-green-500 animate-fadeIn">
            <h3 className="text-green-400 font-bold mb-2">Ready to Save:</h3>
            <p><strong>Title:</strong> {result.title}</p>
            <p><strong>Company:</strong> {result.company}</p>
            <p><strong>Salary:</strong> {result.salary}</p>
            <button
              onClick={handleSave}
              disabled={saving}
              className="mt-4 w-full bg-green-600 hover:bg-green-700 py-2 rounded-lg font-bold transition"
            >
              {saving ? "Saving..." : "Confirm & Save 💾"}
            </button>
          </div>
        )}
      </div>

      {/* Saved Jobs List */}
      <div className="w-full max-w-5xl">
        <h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">My Saved Jobs ({jobs.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <div key={job._id} className="bg-gray-800 p-5 rounded-lg border border-gray-700 hover:border-blue-500 transition shadow-md">
              <h3 className="text-xl font-bold text-white truncate">{job.title}</h3>
              <p className="text-blue-400 font-semibold">{job.company}</p>
              <p className="text-gray-400 text-sm mt-1">📍 {job.location || "Remote"}</p>
              <div className="mt-4 flex justify-between items-center">
                <span className="bg-blue-900 text-blue-200 px-2 py-1 rounded text-xs font-bold">{job.status}</span>
                <span className="text-xs text-gray-500">{new Date(job.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}