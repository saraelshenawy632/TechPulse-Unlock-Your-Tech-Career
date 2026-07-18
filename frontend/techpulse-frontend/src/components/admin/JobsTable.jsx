import { motion, AnimatePresence } from "framer-motion";
import { Edit2, Trash2 } from "lucide-react";

export default function JobTable({ jobs, onEdit, onDelete, page, setPage, totalPages }) {
    
    // تم حذف منطق التقسيم الداخلي واستبداله بـ jobs مباشرة
    const currentJobs = jobs;

    return (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-950/50">
                        <tr>
                            {["Job Title", "Category", "Work Type", "Experience", "Posted", "Actions"].map((head) => (
                                <th key={head} className="p-5 text-slate-400 text-sm font-semibold uppercase">{head}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        <AnimatePresence>
                            {currentJobs.length > 0 ? currentJobs.map((job) => (
                                <motion.tr 
                                    key={job.JobKey}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="hover:bg-slate-800/50 transition-colors"
                                >
                                    <td className="p-5 font-bold text-white">{job.Title}</td>
                                    <td className="p-5 text-slate-300">{job.JobCategory}</td>
                                    <td className="p-5"><span className="bg-slate-800 px-3 py-1 rounded-full text-xs text-blue-400">{job.WorkType}</span></td>
                                    <td className="p-5 text-slate-300">{job.ExperienceLevel}</td>
                                    <td className="p-5 text-slate-400">{job.Posted}</td>
                                    <td className="p-5">
                                        <div className="flex gap-2">
                                            <button onClick={() => onEdit(job)} className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"><Edit2 size={18} /></button>
                                            <button onClick={() => onDelete(job)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-all"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </motion.tr>
                            )) : (
                                <tr><td colSpan="6" className="p-10 text-center text-slate-500">No Jobs Found</td></tr>
                            )}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center gap-5 mt-8 p-6 border-t border-slate-800">
                <button 
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="bg-slate-800 px-5 py-3 rounded-xl disabled:opacity-40 hover:bg-slate-700 transition"
                >
                    Previous
                </button>
                
                <span className="text-slate-400">Page {page} of {totalPages}</span>
                
                <button 
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="bg-slate-800 px-5 py-3 rounded-xl disabled:opacity-40 hover:bg-slate-700 transition"
                >
                    Next
                </button>
            </div>
        </div>
    );
}