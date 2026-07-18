import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Banknote,
  Clock,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    // مؤقتاً بيانات وهمية
    setTimeout(() => {
      setJob({
        id,
        title: "Senior React Developer",
        company: "TechSolutions Group",
        location: "Remote (US / Europe)",
        type: "Full-time",
        salary: "$90,000 - $120,000 / year",
        posted: "2 days ago",
        description:
          "We are looking for a passionate Senior React Developer to join our core team. You will be responsible for building scalable, high-performance web applications using modern React, Tailwind CSS, and state management tools.",
        requirements: [
          "3+ years of professional experience with React.js.",
          "Strong knowledge of JavaScript & TypeScript.",
          "Experience with Tailwind CSS.",
          "Experience working with REST APIs.",
        ],
      });

      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: "linear",
          }}
        >
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full" />
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-slate-950 py-12 px-4"
    >
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition mb-8"
        >
          <ArrowLeft size={20} />
          Back to Listings
        </button>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 md:p-10 shadow-2xl"
        >
          <div className="mb-8">
            <span className="inline-block px-4 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-sm font-semibold">
              {job.type}
            </span>

            <h1 className="text-4xl font-black text-white mt-5">
              {job.title}
            </h1>

            <p className="text-blue-400 mt-2 text-xl">
              {job.company}
            </p>

            <div className="grid md:grid-cols-3 gap-5 mt-8 text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-blue-500" />
                {job.location}
              </div>

              <div className="flex items-center gap-2">
                <Banknote size={18} className="text-blue-500" />
                {job.salary}
              </div>

              <div className="flex items-center gap-2">
                <Clock size={18} className="text-blue-500" />
                {job.posted}
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 my-8"></div>

          <h2 className="text-2xl font-bold text-white mb-5">
            About the role
          </h2>

          <p className="text-slate-300 leading-8">
            {job.description}
          </p>

          <div className="mt-10">
            <h2 className="text-2xl font-bold text-white mb-5">
              Requirements
            </h2>

            <ul className="space-y-4">
              {job.requirements.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-slate-300"
                >
                  <CheckCircle2
                    size={20}
                    className="text-blue-500 mt-1"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-10 mt-10 border-t border-slate-800">
            <button
              onClick={() => {
                if (!user) {
                  Swal.fire({
                    title: "Login Required",
                    html: `
                      <p style="color:#cbd5e1">
                        You need to login first before applying for this job.
                      </p>
                    `,
                    icon: "warning",
                    background: "#0f172a",
                    color: "#fff",
                    confirmButtonText: "Login",
                    showCancelButton: true,
                    cancelButtonText: "Cancel",
                    confirmButtonColor: "#2563eb",
                    cancelButtonColor: "#475569",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      navigate("/login");
                    }
                  });
                  return;
                }
                navigate(`/apply/${job.id}`);
              }}
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-8 rounded-2xl transition text-center shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)] active:scale-[0.98]"
            >
              Apply Now
            </button>

            <button
              onClick={() => navigate("/jobs")}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-2xl transition"
            >
              Back to Jobs
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}