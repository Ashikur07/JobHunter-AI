import { useState } from "react";

export default function JobInputForm({ onJobAdded }) {
  const [activeTab, setActiveTab] = useState("link");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleExtract = async () => {
    if (!input) return;
    setLoading(true);
    
    try {
      const payload = activeTab === "link" ? { url: input } : { text: input };
      
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        // Auto Save to DB
        const saveRes = await fetch("/api/jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data.data),
        });
        const savedData = await saveRes.json();
        
        if (savedData.success) {
          onJobAdded(); // Notify parent to refresh list
          setInput("");
          alert("Job Added Successfully! 🎉");
        }
      } else {
        alert("Failed to extract data.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg mb-8">
      <div className="flex gap-6 mb-4 border-b border-gray-700 pb-2">
        <button onClick={() => setActiveTab("link")} className={`text-sm font-bold pb-1 transition ${activeTab === "link" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400 hover:text-white"}`}>🔗 Link Paste</button>
        <button onClick={() => setActiveTab("text")} className={`text-sm font-bold pb-1 transition ${activeTab === "text" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400 hover:text-white"}`}>📝 Text Paste</button>
      </div>

      <div className="flex gap-3">
        <input 
          type="text" 
          placeholder={activeTab === "link" ? "Paste Job Link (LinkedIn/BDJobs)..." : "Paste Job Description..."}
          className="flex-1 bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 focus:border-blue-500 outline-none text-white placeholder-gray-500 transition"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button 
          onClick={handleExtract}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold transition disabled:opacity-50 shadow-lg shadow-blue-500/20"
        >
          {loading ? "Processing..." : "Add Job 🚀"}
        </button>
      </div>
    </div>
  );
}