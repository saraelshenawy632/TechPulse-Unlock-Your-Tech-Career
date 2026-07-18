import { CheckCircle2, Clock, XCircle, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

export default function ApplicationStats({ dashboard }) {
    const stats = [
        {
            title: "Total Applications",
            value: dashboard?.Applications || 0,
            color: "text-blue-400",
            bg: "bg-blue-400/10",
            icon: <BarChart3 size={24} />
        },
        {
            title: "Pending",
            value: dashboard?.PendingApplications || 0,
            color: "text-yellow-400",
            bg: "bg-yellow-400/10",
            icon: <Clock size={24} />
        },
        {
            title: "Accepted",
            value: dashboard?.AcceptedApplications || 0,
            color: "text-green-400",
            bg: "bg-green-400/10",
            icon: <CheckCircle2 size={24} />
        },
        {
            title: "Rejected",
            value: dashboard?.RejectedApplications || 0,
            color: "text-red-400",
            bg: "bg-red-400/10",
            icon: <XCircle size={24} />
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {stats.map((item, index) => (
                <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-slate-900 border border-slate-800 rounded-3xl p-6 transition-all duration-300 hover:border-slate-600 hover:shadow-2xl group overflow-hidden relative"
                >
                    {/* خلفية تظهر عند التمرير */}
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity ${item.bg}`} />
                    
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider">
                                {item.title}
                            </p>
                            <h2 className={`text-4xl font-black mt-3 ${item.color}`}>
                                {item.value}
                            </h2>
                        </div>
                        <div className={`p-3 rounded-2xl ${item.bg} ${item.color}`}>
                            {item.icon}
                        </div>
                    </div>
                    
                    {/* الخط السفلي المتحرك */}
                    <div className="mt-6 w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div 
                            className={`h-full ${item.color.replace('text', 'bg')}`}
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ delay: 0.5, duration: 1 }}
                        />
                    </div>
                </motion.div>
            ))}
        </div>
    );
}