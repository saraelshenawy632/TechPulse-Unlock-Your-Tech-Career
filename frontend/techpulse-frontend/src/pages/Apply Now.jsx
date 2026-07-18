import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { Send, Loader2, AlertCircle } from "lucide-react";
import { success, error } from "../utils/alerts";

export default function ApplyJob() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    applicantName: user?.name || "",
    applicantEmail: user?.email || "",
    resumeUrl: "",
    linkedInUrl: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const payload = {
      JobID: parseInt(id),
      ApplicantName: formData.applicantName.trim(),
      ApplicantEmail: formData.applicantEmail.trim(),
      ResumeURL: formData.resumeUrl.trim() || null,
      LinkedInURL: formData.linkedInUrl.trim() || null
    };

    try {
      const response = await fetch("http://localhost:5000/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit application");
      }

      success("Application submitted successfully ");

      setTimeout(() => {
        navigate("/jobs");
      }, 1200);
    } catch (err) {
      const msg = err.message || "Application Failed";
      setErrorMsg(msg);
      error(msg);
    } finally {
      setLoading(false);
    }
  }

  // شاشة التحميل الاحترافية
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-5">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-lg">Submitting your application...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-500/20 rounded-full blur-[120px]" />
        
        <h1 className="text-3xl font-black text-white mb-2">Apply for this Job</h1>
        <p className="text-slate-400 mb-8">Complete the form below and submit your application.</p>

        {errorMsg && (
          <div className="mb-6 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-400 text-sm">
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm text-slate-400">Full Name</label>
            <input
              type="text"
              required
              value={formData.applicantName}
              onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
              className="mt-2 w-full rounded-xl bg-[#030712] border border-slate-700 py-3 px-4 text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-sm text-slate-400">Email</label>
            <input
              type="email"
              required
              value={formData.applicantEmail}
              onChange={(e) => setFormData({ ...formData, applicantEmail: e.target.value })}
              className="mt-2 w-full rounded-xl bg-[#030712] border border-slate-700 py-3 px-4 text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-sm text-slate-400">Resume URL</label>
            <input
              type="url"
              required
              value={formData.resumeUrl}
              onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
              placeholder="https://drive.google.com/..."
              className="mt-2 w-full rounded-xl bg-[#030712] border border-slate-700 py-3 px-4 text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-sm text-slate-400">LinkedIn URL (Optional)</label>
            <input
              type="url"
              value={formData.linkedInUrl}
              onChange={(e) => setFormData({ ...formData, linkedInUrl: e.target.value })}
              placeholder="https://linkedin.com/in/..."
              className="mt-2 w-full rounded-xl bg-[#030712] border border-slate-700 py-3 px-4 text-white outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-blue-600 hover:bg-blue-500 rounded-xl py-3 font-bold text-white transition flex justify-center items-center gap-2"
          >
            <Send size={18} />
            Submit Application
          </button>
        </form>
      </motion.div>
    </div>
  );
}