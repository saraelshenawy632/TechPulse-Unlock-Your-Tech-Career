import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { Send, CheckCircle2, X, Loader2 } from "lucide-react";

export default function ApplyJob() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    applicantName: user?.name || "",
    applicantEmail: user?.email || "",
    resumeUrl: "",
    linkedInUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [error, setError] = useState("");

  useEffect(() => {
    let timer;
    if (submitted && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (submitted && countdown === 0) {
      navigate("/jobs");
    }
    return () => clearTimeout(timer);
  }, [submitted, countdown, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      JobID: parseInt(id),
      ApplicantName: formData.applicantName.trim(),
      ApplicantEmail: formData.applicantEmail.trim(),
      ResumeURL: formData.resumeUrl.trim() || null,
      LinkedInURL: formData.linkedInUrl.trim() || null,
    };

    try {
      const response = await fetch("http://localhost:5000/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to submit.");
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-slate-900/40 backdrop-blur-2xl border border-white/5 p-8 rounded-3xl shadow-2xl relative overflow-hidden"
      >
        {/* Decorative Glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/20 rounded-full blur-[100px]" />

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div key="form" exit={{ opacity: 0, x: -20 }}>
              <div className="mb-8">
                <h2 className="text-3xl font-black text-white mb-2">Apply for this role</h2>
                <p className="text-slate-400">Join our team by filling out the details below.</p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-2xl mb-6 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {[
                  { label: "Full Name", name: "applicantName", type: "text", placeholder: "Jane Doe" },
                  { label: "Email Address", name: "applicantEmail", type: "email", placeholder: "jane@example.com" },
                  { label: "Resume / CV URL", name: "resumeUrl", type: "url", placeholder: "https://drive.google.com/..." },
                  { label: "LinkedIn Profile (Optional)", name: "linkedInUrl", type: "url", placeholder: "https://linkedin.com/..." },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">{field.label}</label>
                    <input 
                      type={field.type}
                      required={field.name !== "linkedInUrl"}
                      value={formData[field.name]}
                      onChange={(e) => setFormData({...formData, [field.name]: e.target.value})}
                      placeholder={field.placeholder}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-700"
                    />
                  </div>
                ))}

                <button 
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <Send size={18} />}
                  {loading ? "Sending Application..." : "Submit Application"}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 text-center"
            >
              <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={48} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Application Sent!</h3>
              <p className="text-slate-400 mb-8">We've received your details. Redirecting in {countdown}s...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}