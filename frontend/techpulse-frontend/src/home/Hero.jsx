import { useEffect, useState } from "react";
import { getStats } from "../services/jobService";
import { HiOutlineBriefcase, HiOutlineBuildingOffice2, HiOutlineMapPin, HiOutlineGlobeAlt, HiMagnifyingGlass } from "react-icons/hi2";
import { motion, useSpring, useTransform, useMotionValue } from "framer-motion";

// مكون العد مع تعديل المدة لتكون أبطأ (4 ثوانٍ)
function Counter({ value }) {
  const motionValue = useMotionValue(0);
  // زيادة الـ duration تجعل العد أبطأ وأكثر سلاسة
  const springValue = useSpring(motionValue, { duration: 4, bounce: 0 });
  const rounded = useTransform(springValue, (latest) => Math.round(latest));

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  return <motion.span>{rounded}</motion.span>;
}

function Hero() {
  const [stats, setStats] = useState({ jobs: 0, companies: 0, cities: 0, countries: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await getStats();
        setStats({
          jobs: Number(data?.jobs ?? data?.Jobs ?? 0),
          companies: Number(data?.companies ?? data?.Companies ?? 0),
          cities: Number(data?.cities ?? data?.Cities ?? 0),
          countries: Number(data?.countries ?? data?.Countries ?? 0),
        });
      } catch (err) {
        console.error("Stats Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    window.location.href = `/jobs?search=${encodeURIComponent(searchQuery)}`;
  };

  const statItems = [
    { label: "Active Jobs", val: stats.jobs, icon: HiOutlineBriefcase },
    { label: "Companies", val: stats.companies, icon: HiOutlineBuildingOffice2 },
    { label: "Cities", val: stats.cities, icon: HiOutlineMapPin },
    { label: "Countries", val: stats.countries, icon: HiOutlineGlobeAlt },
  ];

  return (
    <section className="relative w-full pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden bg-slate-950">
      {/* الخلفية التفاعلية */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[10%] w-[30%] h-[30%] bg-sky-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-widest"
          >
            Egypt's #1 Tech Career Platform
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tighter leading-[0.9]">
            Shape Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-sky-400">Future</span>
            <br />In Technology
          </h1>

          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
            Connect with top-tier companies. Explore thousands of high-impact opportunities tailored to your skills.
          </p>

          <form 
            onSubmit={handleSearch} 
            className="group relative flex items-center bg-white/5 backdrop-blur-md border border-white/10 p-2 rounded-3xl hover:border-indigo-500/50 transition-all duration-300"
          >
            <HiMagnifyingGlass className="ml-4 w-6 h-6 text-slate-400 group-hover:text-indigo-400 transition-colors" />
            <input
              type="text"
              placeholder="Search by job title, company, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none text-white placeholder-slate-500 text-lg py-4 px-4 focus:outline-none focus:ring-0"
            />
            <button 
              type="submit" 
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 shadow-[0_0_20px_-5px_rgba(79,70,229,0.5)]"
            >
              Search
            </button>
          </form>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
            {statItems.map((item, idx) => (
              <div 
                key={idx} 
                className="bg-white/5 border border-white/5 p-6 rounded-3xl hover:bg-white/10 transition-all group"
              >
                <div className="flex justify-center mb-3">
                  <item.icon className="w-8 h-8 text-indigo-400 group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-2xl md:text-3xl font-black text-white mb-1">
                  {loading ? (
                    <span className="animate-pulse">--</span>
                  ) : (
                    <>
                      <Counter value={item.val} />+
                    </>
                  )}
                </div>
                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;