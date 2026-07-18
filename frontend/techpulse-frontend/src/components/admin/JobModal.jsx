import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Briefcase, Tag, Layers, Calendar, ChevronDown, Save } from "lucide-react";

export default function JobModal({ open, onClose, onSubmit, editingJob }) {
    const emptyJob = {
        JobCode: "", Title: "", Posted: new Date().toISOString().slice(0, 10),
        WorkType: "Remote", ExperienceLevel: "Junior", JobCategory: "Web Development"
    };

    const [form, setForm] = useState(emptyJob);

    useEffect(() => {
        setForm(editingJob || emptyJob);
    }, [editingJob, open]);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl p-8 shadow-2xl"
                    >
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold text-white">
                                {editingJob ? "Edit Job Posting" : "Create New Job"}
                            </h2>
                            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { name: "JobCode", label: "Job Code", icon: <Layers size={18} /> },
                                { name: "Title", label: "Job Title", icon: <Briefcase size={18} /> },
                                { name: "JobCategory", label: "Category", icon: <Tag size={18} /> },
                                { name: "Posted", label: "Date Posted", icon: <Calendar size={18} />, type: "date" }
                            ].map((field) => (
                                <div key={field.name} className="flex flex-col gap-2">
                                    <label className="text-xs font-semibold text-slate-500 uppercase">{field.label}</label>
                                    <div className="relative flex items-center text-slate-400 focus-within:text-blue-500">
                                        <span className="absolute left-3">{field.icon}</span>
                                        <input
                                            type={field.type || "text"}
                                            name={field.name}
                                            value={form[field.name]}
                                            onChange={handleChange}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-blue-500 transition-all text-white"
                                        />
                                    </div>
                                </div>
                            ))}

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-slate-500 uppercase">Work Type</label>
                                <select name="WorkType" value={form.WorkType} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 outline-none text-white appearance-none">
                                    <option>Remote</option><option>Hybrid</option><option>On-site</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-slate-500 uppercase">Experience Level</label>
                                <select name="ExperienceLevel" value={form.ExperienceLevel} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 outline-none text-white appearance-none">
                                    <option>Intern</option><option>Junior</option><option>Mid</option><option>Senior</option>
                                </select>
                            </div>

                            <div className="col-span-full flex justify-end gap-4 mt-6">
                                <button type="button" onClick={onClose} className="px-6 py-3 rounded-xl text-slate-400 hover:bg-slate-800 transition-all">Cancel</button>
                                <button type="submit" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20">
                                    <Save size={18} /> {editingJob ? "Update Changes" : "Save Job"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}