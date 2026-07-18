import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ShieldCheck, Search, ChevronLeft, ChevronRight, User } from "lucide-react";

export default function UserTable({ users, onDelete, onRole }) {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const pageSize = 5;

    const filteredUsers = useMemo(() => {
        return users.filter(user =>
            user.Name.toLowerCase().includes(search.toLowerCase()) ||
            user.Email.toLowerCase().includes(search.toLowerCase())
        );
    }, [users, search]);

    const totalPages = Math.ceil(filteredUsers.length / pageSize);
    const displayedUsers = filteredUsers.slice((page - 1) * pageSize, page * pageSize);

    return (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl mt-8 overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-center p-8 gap-4 border-b border-slate-800">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <User className="text-blue-500" /> Users Management
                </h2>
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-3.5 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        className="w-full bg-slate-800 border border-slate-700 pl-10 pr-4 py-3 rounded-xl outline-none focus:border-blue-500 transition-all text-white"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-slate-950/50">
                        <tr>
                            {["Name", "Email", "Role", "Actions"].map((head) => (
                                <th key={head} className="p-5 text-left text-slate-400 text-sm font-semibold uppercase">{head}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        <AnimatePresence mode="popLayout">
                            {displayedUsers.length > 0 ? displayedUsers.map((user) => (
                                <motion.tr 
                                    key={user.Id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="hover:bg-slate-800/50 transition-colors"
                                >
                                    <td className="p-5 font-bold text-white">{user.Name}</td>
                                    <td className="p-5 text-slate-300">{user.Email}</td>
                                    <td className="p-5">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.Role === "Admin" ? "bg-red-500/10 text-red-400" : "bg-blue-500/10 text-blue-400"}`}>
                                            {user.Role}
                                        </span>
                                    </td>
                                    <td className="p-5">
                                        <div className="flex gap-2">
                                            <button onClick={() => onRole(user)} className="p-2 text-green-400 hover:bg-green-500/10 rounded-lg transition-all"><ShieldCheck size={18} /></button>
                                            <button onClick={() => onDelete(user)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-all"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </motion.tr>
                            )) : (
                                <tr><td colSpan="4" className="p-10 text-center text-slate-500">No Users Found</td></tr>
                            )}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-between p-6 border-t border-slate-800">
                    <button disabled={page === 1} onClick={() => setPage(page - 1)} className="p-2 bg-slate-800 rounded-xl disabled:opacity-50 hover:bg-slate-700 transition"><ChevronLeft size={20} /></button>
                    <span className="text-sm text-slate-400 font-medium">Page {page} of {totalPages}</span>
                    <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="p-2 bg-slate-800 rounded-xl disabled:opacity-50 hover:bg-slate-700 transition"><ChevronRight size={20} /></button>
                </div>
            )}
        </div>
    );
}