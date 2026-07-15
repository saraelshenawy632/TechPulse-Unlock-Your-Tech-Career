import { useEffect, useState } from "react";
import {
  HiOutlineBriefcase,
  HiOutlineBuildingOffice2,
  HiOutlineGlobeAlt,
  HiOutlineMapPin,
} from "react-icons/hi2"; //  تم تصحيح مسار الاستيراد هنا

import Container from "../components/UI/Container";
import StatCard from "../components/UI/StatCard";
import { getStats } from "../services/jobService";

export default function Stats() {
  const [stats, setStats] = useState({
    jobs: 0,
    companies: 0,
    cities: 0,
    countries: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getStats();
        setStats({
          jobs: data?.jobs ?? 0,
          companies: data?.companies ?? 0,
          cities: data?.cities ?? 0,
          countries: data?.countries ?? 0,
        });
      } catch (error) {
        console.error("Stats Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const statsConfig = [
    {
      key: "jobs",
      title: "Active Jobs",
      value: stats.jobs,
      icon: <HiOutlineBriefcase className="w-6 h-6 text-indigo-400 group-hover:text-indigo-300 transition-colors" />,
      gradient: "from-indigo-500/10 to-indigo-500/2"
    },
    {
      key: "companies",
      title: "Partner Companies",
      value: stats.companies,
      icon: <HiOutlineBuildingOffice2 className="w-6 h-6 text-sky-400 group-hover:text-sky-300 transition-colors" />,
      gradient: "from-sky-500/10 to-sky-500/2"
    },
    {
      key: "countries",
      title: "Target Countries",
      value: stats.countries,
      icon: <HiOutlineGlobeAlt className="w-6 h-6 text-emerald-400 group-hover:text-emerald-300 transition-colors" />,
      gradient: "from-emerald-500/10 to-emerald-500/2"
    },
    {
      key: "cities",
      title: "Covered Cities",
      value: stats.cities,
      icon: <HiOutlineMapPin className="w-6 h-6 text-rose-400 group-hover:text-rose-300 transition-colors" />,
      gradient: "from-rose-500/10 to-rose-500/2"
    }
  ];

  return (
    <section className="py-12 md:py-16 bg-slate-950/20">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {statsConfig.map((item) => (
            <div
              key={item.key}
              className="group relative overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-900/40 p-5 md:p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-slate-700/80 hover:shadow-lg hover:shadow-slate-950/50"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

              <div className="relative z-10 flex items-center justify-between gap-4">
                <div className="space-y-2 min-w-0">
                  <span className="text-xs md:text-sm font-semibold text-slate-400 block tracking-wide truncate">
                    {item.title}
                  </span>
                  
                  {loading ? (
                    <div className="h-8 w-24 bg-slate-800 rounded-lg animate-pulse" />
                  ) : (
                    <h3 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
                      {item.value.toLocaleString()}
                    </h3>
                  )}
                </div>

                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 group-hover:border-slate-700/80 transition-all duration-300 shrink-0">
                  {item.icon}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}