import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, LabelList } from "recharts";
import { motion } from "framer-motion";
import { PieChart as PieIcon, BarChart as BarIcon } from "lucide-react";

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"];

export default function Charts({ jobs = [] }) {
    // معالجة البيانات
    const categoryMap = jobs.reduce((acc, job) => {
        const cat = job.JobCategory || "Other";
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
    }, {});

    const categoryData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

    const workTypeMap = jobs.reduce((acc, job) => {
        const type = job.WorkType || "Unknown";
        acc[type] = (acc[type] || 0) + 1;
        return acc;
    }, {});

    const workTypeData = Object.entries(workTypeMap).map(([name, jobs]) => ({ name, jobs }));

    if (!jobs.length) return <div className="bg-slate-900 rounded-3xl p-12 text-center text-slate-400 border border-slate-800">No Analytics Data Available</div>;

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-10">
            
            {/* Category Chart */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-blue-500/10 p-3 rounded-2xl"><PieIcon className="text-blue-500" size={24} /></div>
                    <h2 className="text-xl font-bold text-white">Jobs By Category</h2>
                </div>
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={5}>
                                {categoryData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                            <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: "12px" }} />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            {/* Work Type Chart */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-green-500/10 p-3 rounded-2xl"><BarIcon className="text-green-500" size={24} /></div>
                    <h2 className="text-xl font-bold text-white">Work Types Distribution</h2>
                </div>
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={workTypeData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip cursor={{ fill: '#1e293b' }} contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: "12px" }} />
                            <Bar dataKey="jobs" fill="#3B82F6" radius={[8, 8, 0, 0]} barSize={50}>
                                {workTypeData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>
        </div>
    );
}