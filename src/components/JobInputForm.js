import { useState, useRef } from "react";

export default function JobInputForm({ onJobAdded }) {
  const [activeTab, setActiveTab] = useState("link"); // link, screenshot, text
  const [input, setInput] = useState("");
  const [image, setImage] = useState(null); // ছবি রাখার জন্য
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // ছবি কনভার্ট করার ফাংশন
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setInput(""); // ছবি দিলে টেক্সট বক্স ক্লিয়ার
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExtract = async () => {
    if (!input && !image) return;
    setLoading(true);
    
    try {
      let payload = {};
      // কোন ট্যাব একটিভ তার ওপর ভিত্তি করে ডাটা রেডি করি
      if (activeTab === "link") payload = { url: input };
      else if (activeTab === "text") payload = { text: input };
      else if (activeTab === "screenshot") payload = { image: image };

      // 1. Extract Data
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        // 2. Auto Save to DB
        const saveRes = await fetch("/api/jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data.data),
        });
        const savedData = await saveRes.json();
        
        if (savedData.success) {
          onJobAdded(); // লিস্ট রিফ্রেশ
          // সব রিসেট করি
          setInput("");
          setImage(null);
          if(fileInputRef.current) fileInputRef.current.value = "";
          alert("Job Added Successfully! 🎉");
        }
      } else {
        alert("Failed to extract data. Try again.");
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
      
      {/* --- TABS --- */}
      <div className="flex gap-6 mb-6 border-b border-gray-700 pb-2 overflow-x-auto">
        <button onClick={() => setActiveTab("link")} className={`text-sm font-bold pb-1 whitespace-nowrap transition ${activeTab === "link" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400 hover:text-white"}`}>🔗 Link Paste</button>
        <button onClick={() => setActiveTab("screenshot")} className={`text-sm font-bold pb-1 whitespace-nowrap transition ${activeTab === "screenshot" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400 hover:text-white"}`}>📸 Screenshot</button>
        <button onClick={() => setActiveTab("text")} className={`text-sm font-bold pb-1 whitespace-nowrap transition ${activeTab === "text" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400 hover:text-white"}`}>📝 Text Paste</button>
      </div>

      {/* --- INPUT AREA --- */}
      <div className="flex flex-col md:flex-row gap-3">
        
        {/* CASE 1: LINK INPUT */}
        {activeTab === "link" && (
          <input 
            type="text" 
            placeholder="Paste Job Link (LinkedIn/BDJobs)..."
            className="flex-1 bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 focus:border-blue-500 outline-none text-white placeholder-gray-500 text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        )}

        {/* CASE 2: SCREENSHOT INPUT */}
        {activeTab === "screenshot" && (
          <div className="flex-1">
            <input 
              type="file" 
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="block w-full text-sm text-gray-400
                file:mr-4 file:py-2.5 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-bold
                file:bg-gray-700 file:text-blue-400
                hover:file:bg-gray-600 cursor-pointer bg-gray-900 rounded-lg border border-gray-600"
            />
            {/* Image Preview */}
            {image && (
              <div className="mt-3 relative w-full h-32 bg-gray-900 rounded-lg border border-gray-600 flex items-center justify-center overflow-hidden">
                <img src={image} alt="Preview" className="h-full object-contain" />
                <button 
                  onClick={() => { setImage(null); if(fileInputRef.current) fileInputRef.current.value = ""; }}
                  className="absolute top-1 right-1 bg-red-600/80 hover:bg-red-600 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center"
                >✕</button>
              </div>
            )}
          </div>
        )}

        {/* CASE 3: TEXT INPUT */}
        {activeTab === "text" && (
          <textarea
            rows="2" 
            placeholder="Paste Job Description..."
            className="flex-1 bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 focus:border-blue-500 outline-none text-white placeholder-gray-500 text-sm resize-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          ></textarea>
        )}

        {/* SUBMIT BUTTON */}
        <button 
          onClick={handleExtract}
          disabled={loading || (!input && !image)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20 h-fit whitespace-nowrap"
        >
          {loading ? "Analyzing..." : "Add Job 🚀"}
        </button>
      </div>
    </div>
  );
}