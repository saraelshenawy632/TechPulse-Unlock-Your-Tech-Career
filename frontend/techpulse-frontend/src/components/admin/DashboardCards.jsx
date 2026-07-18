import { Briefcase, Building2, MapPin, Globe, FileText } from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardCards({ dashboard }) {
    const cards = [
        { title: "Jobs", value: dashboard?.Jobs || 0, icon: <Briefcase size={22} />, color: "text-blue-500", bg: "bg-blue-500/10" },
        { title: "Companies", value: dashboard?.Companies || 0, icon: <Building2 size={22} />, color: "text-purple-500", bg: "bg-purple-500/10" },
        { title: "Locations", value: dashboard?.Locations || 0, icon: <MapPin size={22} />, color: "text-green-500", bg: "bg-green-500/10" },
        { title: "Platforms", value: dashboard?.Platforms || 0, icon: <Globe size={22} />, color: "text-amber-500", bg: "bg-amber-500/10" },
        { title: "Applications", value: dashboard?.Applications || 0, icon: <FileText size={22} />, color: "text-rose-500", bg: "bg-rose-500/10" },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
            {cards.map((card, index) => (
                <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-slate-900 rounded-3xl p-6 border border-slate-800 hover:border-slate-600 transition-all shadow-xl group"
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-400 text-sm font-medium">{card.title}</p>
                            <h3 className="text-3xl font-bold mt-2 text-white">{card.value}</h3>
                        </div>
                        <div className={`p-3 rounded-2xl ${card.bg} ${card.color} group-hover:scale-110 transition-transform`}>
                            {card.icon}
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}