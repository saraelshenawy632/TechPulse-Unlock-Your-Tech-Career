import { useState, useEffect } from "react";
import { HiOutlineMapPin, HiOutlineBriefcase, HiChartBar } from "react-icons/hi2";
import Container from "../components/UI/Container";

export default function Locations() {
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch("/api/locations");
        const data = await response.json();
        setLocations(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLocations();
  }, []);

  if (isLoading) {
    return (
      <div className="py-24 bg-slate-950 flex justify-center items-center">
        <div className="flex gap-2">
          <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" />
          <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce delay-100" />
          <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce delay-200" />
        </div>
      </div>
    );
  }

  return (
    <section className="py-24 bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* خلفية جمالية (Glow) */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[128px] pointer-events-none" />
      
      <Container>
        <div className="flex flex-col items-center text-center mb-20">
          <span className="px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-4">
            Market Intelligence
          </span>
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
            Tech Employment <span className="text-indigo-500">Hubs</span>
          </h2>
          <p className="text-slate-400 max-w-lg text-lg">
            Analyzing geographical distribution of high-demand tech roles across Egypt's innovation centers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((loc, index) => {
            const city = loc.LocationName || "Unknown City";
            const jobs = loc.JobCount || 0;
            const percentage = loc.Percentage || 0;

            return (
              <div
                key={index}
                className="group relative bg-slate-900/30 backdrop-blur-xl border border-white/5 p-8 rounded-[2rem] transition-all duration-500 hover:border-indigo-500/30 hover:bg-slate-900/50"
              >
                <div className="flex justify-between items-start mb-8">
                  <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-indigo-500/20 transition-colors">
                    <HiOutlineMapPin className="w-7 h-7 text-indigo-400" />
                  </div>
                  <span className="text-3xl font-black text-white/10 group-hover:text-indigo-500/20 transition-colors">
                    0{index + 1}
                  </span>
                </div>

                <h3 className="text-2xl font-bold mb-6 group-hover:text-indigo-300 transition-colors">
                  {city}
                </h3>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-400">
                      <HiOutlineBriefcase className="w-4 h-4" />
                      <span className="text-sm">Active Jobs</span>
                    </div>
                    <span className="font-mono text-lg font-bold">{jobs.toLocaleString()}</span>
                  </div>

                  <div className="relative">
                    <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                      <span>Market Density</span>
                      <span>{percentage}%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-indigo-300 rounded-full transition-all duration-[2000ms] ease-out"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}