import { motion } from "framer-motion";
import { HiOutlineBell, HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { useAuth } from "../../context/AuthContext";

export default function Topbar() {
    const { user } = useAuth();

    return (
        <motion.header 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="sticky top-0 z-20 bg-[#050816]/70 backdrop-blur-2xl border-b border-slate-800"
        >
            <div className="h-24 px-8 flex items-center justify-between">
                {/* Left Section */}
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        Dashboard
                    </h1>
                    <p className="text-slate-400 mt-1 text-sm font-medium">
                        Welcome back, <span className="text-blue-400">{user?.name}</span> 👋
                    </p>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-6">
                    {/* Search */}
                    <div className="relative">
                        <HiOutlineMagnifyingGlass size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-72 bg-slate-900/50 border border-slate-800 rounded-2xl pl-12 pr-4 py-3 text-white outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 transition-all"
                        />
                    </div>

                    {/* Notifications */}
                    <button className="relative p-3 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 transition-all group">
                        <HiOutlineBell size={22} className="text-slate-400 group-hover:text-white transition" />
                        <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#050816] animate-pulse"></span>
                    </button>

                    {/* Profile */}
                    <div className="flex items-center gap-4 pl-4 border-l border-slate-800">
                        <div className="text-right hidden md:block">
                            <h4 className="text-white font-semibold text-sm">{user?.name}</h4>
                            <p className="text-[11px] uppercase tracking-wider text-blue-400 font-bold">{user?.role}</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-900/20 ring-2 ring-slate-800">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </div>
            </div>
        </motion.header>
    );
}