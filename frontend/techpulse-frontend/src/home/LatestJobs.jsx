import { useEffect, useState } from "react";
import { ImSpinner8 } from "react-icons/im";
import { motion } from "framer-motion";

import Container from "../components/UI/Container";
import JobCard from "../components/UI/JobCard";
import { getJobs } from "../services/jobService";

// إعدادات الأنيميشن
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function LatestJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const data = await getJobs(1, 6);
      setJobs(data.jobs || []);
    } catch (err) {
      console.error("Latest Jobs Error:", err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden">
      {/* خلفية جمالية */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[128px] rounded-full pointer-events-none" />
      
      <Container>
        <div className="mb-16 text-center md:text-left">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-white tracking-tight"
          >
            Latest <span className="text-indigo-400">Opportunities</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-slate-400 text-lg max-w-lg"
          >
            Explore the latest tech openings at Egypt's most innovative companies.
          </motion.p>
        </div>

        {loading ? (
          <div className="flex min-h-[320px] items-center justify-center">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            >
              <ImSpinner8 className="text-4xl text-indigo-500" />
            </motion.div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="flex min-h-[320px] items-center justify-center text-slate-500">
            No active jobs found at the moment.
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid gap-8 md:grid-cols-2 xl:grid-cols-3"
          >
            {jobs.map((job) => (
              <motion.div key={job.JobKey} variants={itemVariants}>
                <div className="group h-full transition-transform duration-300 hover:-translate-y-2">
                  <JobCard job={job} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </Container>
    </section>
  );
}