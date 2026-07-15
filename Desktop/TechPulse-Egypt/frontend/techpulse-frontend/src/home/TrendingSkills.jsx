import { useEffect, useState, useCallback } from "react";
import { TrendingUp, ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react";

export default function TrendingSkills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  const useFallbackData = useCallback(() => {
    setSkills([
      { SkillName: "React.js", Category: "Frontend", JobCount: 1240, DemandPercentage: 41.8, trend: 14.2 },
      { SkillName: "Python", Category: "AI / Data Science", JobCount: 1050, DemandPercentage: 35.4, trend: 11.5 },
      { SkillName: "SQL Server", Category: "Data Analytics", JobCount: 890, DemandPercentage: 30.0, trend: 8.9 },
      { SkillName: "Node.js", Category: "Backend", JobCount: 750, DemandPercentage: 25.2, trend: 5.1 },
      { SkillName: "Docker", Category: "DevOps", JobCount: 420, DemandPercentage: 14.1, trend: -1.2 },
      { SkillName: "Power BI", Category: "Data Analytics", JobCount: 380, DemandPercentage: 12.8, trend: 3.4 },
    ]);
  }, []);

  useEffect(() => {
    async function fetchSkills() {
      try {
        // نستخدم المسار النسبي /api لتستفيد من الـ Proxy الذي أعددناه في vite.config.js
        const response = await fetch("/api/trending-skills");
        if (!response.ok) throw new Error("Server error");
        
        const data = await response.json();
        
        // التحقق من أن البيانات ليست null أو فارغة
        if (data && Array.isArray(data) && data.length > 0) {
          // معالجة البيانات لضمان عدم وجود قيم null
          const sanitizedData = data.map(item => ({
            SkillName: item.SkillName || item.skillname || "Unknown",
            Category: item.Category || item.category || "General",
            JobCount: item.JobCount || item.jobcount || 0,
            DemandPercentage: item.DemandPercentage || item.demandpercentage || 0,
            trend: item.trend || 0
          }));
          setSkills(sanitizedData);
        } else {
          useFallbackData();
        }
      } catch (error) {
        console.error("Error loading skills:", error);
        useFallbackData();
      } finally {
        setLoading(false);
      }
    }

    fetchSkills();
  }, [useFallbackData]);

  if (loading) {
    return (
      <div className="bg-slate-900/30 border border-slate-800/60 rounded-3xl p-6 h-[400px] flex flex-col justify-center items-center backdrop-blur-md">
        <Loader2 size={32} className="text-indigo-500 animate-spin mb-3" />
        <p className="text-slate-400 text-sm font-medium">Analyzing market trends...</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-slate-900/40 to-slate-950/20 border border-slate-800/60 rounded-3xl p-6 backdrop-blur-md shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400">
            <TrendingUp size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Trending Tech Skills</h3>
            <p className="text-xs text-slate-400">Most demanded skills in Egypt's market</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {skills.map((skill, index) => (
          <div key={index} className="group p-3.5 bg-slate-900/20 border border-slate-800/40 rounded-xl hover:border-indigo-500/30 transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-black text-slate-500 w-4">#{index + 1}</span>
                <div>
                  <h4 className="text-sm font-bold text-slate-100">{skill.SkillName}</h4>
                  <span className="text-[10px] text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                    {skill.Category}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-300 block">{Number(skill.JobCount).toLocaleString()} Jobs</span>
                <div className={`flex items-center justify-end text-xs font-bold ${skill.trend >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                  {skill.trend >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {Math.abs(skill.trend)}%
                </div>
              </div>
            </div>
            
            <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-900/60">
              <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${skill.DemandPercentage}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}