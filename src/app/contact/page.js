"use client";

import Navbar from "@/components/Navbar";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";
import Swal from "sweetalert2";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: data.error || "Something went wrong!",
          background: "#1e293b",
          color: "#fff",
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Message Sent!",
          text: "Your message has been sent successfully.",
          background: "#1e293b",
          color: "#fff",
        });

        setForm({ name: "", email: "", subject: "", message: "" });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: "Failed to send your message.",
        background: "#1e293b",
        color: "#fff",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans selection:bg-blue-500/30">
      <Navbar />

      <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Get in Touch</h1>
          <p className="text-gray-400">
            Have questions or feedback? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-gray-800/50 p-8 rounded-3xl border border-gray-700">
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-500/10 p-3 rounded-lg text-blue-400">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-bold uppercase">Email</p>
                    <p className="text-lg">ashik.ict.iu@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-green-500/10 p-3 rounded-lg text-green-400">
                    <Phone size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-bold uppercase">Phone</p>
                    <p className="text-lg">+880 1743-439382</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-purple-500/10 p-3 rounded-lg text-purple-400">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-bold uppercase">Location</p>
                    <p className="text-lg">Rajshahi, Bangladesh</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-800/30 p-8 rounded-3xl border border-gray-700 backdrop-blur-sm">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    className="w-full bg-gray-900 border border-gray-600 rounded-xl p-3 focus:border-blue-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full bg-gray-900 border border-gray-600 rounded-xl p-3 focus:border-blue-500 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="What is this about?"
                  className="w-full bg-gray-900 border border-gray-600 rounded-xl p-3 focus:border-blue-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">
                  Message
                </label>
                <textarea
                  rows="4"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Write your message here..."
                  className="w-full bg-gray-900 border border-gray-600 rounded-xl p-3 focus:border-blue-500 outline-none transition resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2"
              >
                {loading ? "Sending..." : "Send Message"} <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
