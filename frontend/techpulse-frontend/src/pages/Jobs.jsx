import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImSpinner8 } from "react-icons/im";
import Container from "../components/UI/Container";
import JobCard from "../components/UI/JobCard";
import JobsFilter from "../components/UI/JobsFilter";
import Pagination from "../jobs/Pagination";
import { getJobs, searchJobs } from "../services/jobService";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [activeFilters, setActiveFilters] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // هذا التنسيق يضمن أن أي input أو select أو button داخل حاوية الفلتر 
  // سيأخذ خلفية كحلية ولون نص أبيض
  const filterOverrides = `
    .filter-container input, 
    .filter-container select {
      background-color: #030712 !important;
      color: #ffffff !important;
      border: 1px solid #1e293b !important;
    }
    .filter-container option {
      background-color: #030712 !important;
      color: #ffffff !important;
    }
    .filter-container button {
      background-color: #2563eb !important;
      color: white !important;
    }
  `;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (isSearching && activeFilters) {
      executeSearch(activeFilters, page);
    } else {
      loadJobs(page);
    }
  }, [page]);

  async function loadJobs(pageNumber = 1) {
    try {
      setLoading(true);
      const data = await getJobs(pageNumber);
      setJobs(data.jobs || []);
      setTotalPages(data.totalPages || 1);
      setTotalJobs(data.total || 0);
    } catch (err) {
      console.error("Jobs Fetching Error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function executeSearch(filters, pageNumber = 1) {
    try {
      setLoading(true);
      const data = await searchJobs({ ...filters, page: pageNumber });
      setJobs(data.jobs || []);
      setTotalPages(data.totalPages || 1);
      setTotalJobs(data.total || 0);
    } catch (err) {
      console.error("Search API Error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(filters) {
    setActiveFilters(filters);
    setIsSearching(true);
    setPage(1);
    await executeSearch(filters, 1);
  }

  return (
    <section className="py-20 bg-[#030712] min-h-screen relative overflow-hidden">
      <style>{filterOverrides}</style>
      
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none" />

      <Container>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center md:text-left"
        >
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Opportunities</span>
          </h1>
          <p className="mt-4 text-slate-400 text-lg">
            Found <span className="text-blue-400 font-bold">{totalJobs.toLocaleString()}</span> professional tech roles.
          </p>
        </motion.div>

        {/* تمت إضافة كلاس filter-container هنا ليتم استهدافه بواسطة الـ CSS أعلاه */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="filter-container bg-[#030712] border border-slate-800 p-6 md:p-8 rounded-3xl shadow-2xl mb-12"
        >
          <JobsFilter onSearch={handleSearch} />
        </motion.div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-24"
            >
              <ImSpinner8 className="text-5xl text-blue-500 animate-spin mb-4" />
              <p className="text-blue-400 font-medium tracking-widest uppercase text-sm">Querying database...</p>
            </motion.div>
          ) : jobs.length === 0 ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20 bg-slate-950/30 rounded-3xl border border-slate-800"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-white">No jobs found</h3>
              <p className="text-slate-400 mt-2">Try adjusting your filters to find what you're looking for.</p>
            </motion.div>
          ) : (
            <motion.div 
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {jobs.map((job) => (
                  <motion.div
                    key={job.JobKey}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="h-full"
                  >
                    <JobCard job={job} />
                  </motion.div>
                ))}
              </div>

              <div className="mt-16 flex justify-center">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </section>
  );
}