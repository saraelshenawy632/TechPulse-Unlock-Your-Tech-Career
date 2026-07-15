import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Banknote, Clock, ArrowLeft, Briefcase, CheckCircle2 } from "lucide-react";

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // محاكاة جلب البيانات
    setTimeout(() => {
      setJob({
        id: id,
        title: "Senior React Developer",
        company: "TechSolutions Group",
        location: "Remote (US / Europe)",
        type: "Full-time",
        salary: "$90,000 - $120,000 / year",
        posted: "2 days ago",
        description: "We are looking for a passionate Senior React Developer to join our core team. You will be responsible for building scalable, high-performance web applications using modern React, Tailwind CSS, and state management tools.",
        requirements: [
          "3+ years of professional experience with React.js and modern state management.",
          "Strong proficiency in JavaScript, TypeScript, and modern CSS frameworks like Tailwind CSS.",
          "Experience with building responsive designs and optimizing web performance.",
          "Familiarity with RESTful APIs, Git, and agile workflows."
        ]
      });
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
        <div className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full" />
      </motion.div>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="min-h-screen bg-slate-950 py-12 px-4"
    >
      <div className="max-w-3xl mx-auto">
        {/* زر العودة */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition mb-8"
        >
          <ArrowLeft size={20} /> Back to Listings
        </button>

        {/* الكارت الرئيسي */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 md:p-10 shadow-2xl"
        >
          {/* Header */}
          <div className="mb-8">
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-sm font-bold tracking-wide uppercase border border-blue-500/20">
              {job.type}
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-white mt-4 mb-3 tracking-tight">{job.title}</h1>
            <p className="text-xl text-blue-400 font-semibold">{job.company}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 text-slate-400">
              <div className="flex items-center gap-2"><MapPin size={18} className="text-blue-500" /> {job.location}</div>
              <div className="flex items-center gap-2"><Banknote size={18} className="text-blue-500" /> {job.salary}</div>
              <div className="flex items-center gap-2"><Clock size={18} className="text-blue-500" /> {job.posted}</div>
            </div>
          </div>

          <div className="h-px bg-slate-800 my-8" />

          {/* Description */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">About the role</h2>
            <p className="text-slate-300 leading-relaxed text-lg">{job.description}</p>
          </div>

          {/* Requirements */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-6">Requirements</h2>
            <ul className="space-y-4">
              {job.requirements.map((req, index) => (
                <li key={index} className="flex items-start gap-3 text-slate-300">
                  <CheckCircle2 size={22} className="text-blue-500 shrink-0 mt-0.5" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Area */}
          <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-slate-800">
            <Link
              to={`/apply/${job.id}`}
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-8 rounded-2xl transition text-center shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)] active:scale-[0.98]"
            >
              Apply Now
            </Link>
            <button
              onClick={() => navigate("/jobs")}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 px-8 rounded-2xl transition active:scale-[0.98]"
            >
              Save for later
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}