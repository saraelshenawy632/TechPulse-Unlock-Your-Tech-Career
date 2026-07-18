import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HiOutlineHome, HiOutlineUsers, HiOutlineBriefcase,
  HiOutlineChartBar, HiOutlineDocumentText, HiOutlineArrowLeftOnRectangle,
  HiOutlineCog6Tooth,
} from "react-icons/hi2";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const menus = [
    { title: "Dashboard", icon: <HiOutlineHome size={22} />, path: "/admin" },
    { title: "Users", icon: <HiOutlineUsers size={22} />, path: "/admin/users" },
    { title: "Jobs", icon: <HiOutlineBriefcase size={22} />, path: "/admin/jobs" },
    { title: "Applications", icon: <HiOutlineDocumentText size={22} />, path: "/admin/applications" },
    { title: "Analytics", icon: <HiOutlineChartBar size={22} />, path: "/admin/analytics" },
    { title: "Settings", icon: <HiOutlineCog6Tooth size={22} />, path: "/admin/settings" },
  ];

  return (
    <aside className="w-72 bg-[#08111F] border-r border-slate-800 flex flex-col h-screen sticky top-0">
      {/* Logo Area */}
      <div className="h-24 flex items-center justify-center border-b border-slate-800">
        <motion.img 
            whileHover={{ scale: 1.05 }}
            src="/logos/techpulse_egypt_logo.png" 
            className="w-40 cursor-pointer" 
            alt="TechPulse" 
        />
      </div>

      {/* Menu Items */}
      <div className="flex-1 py-8 px-4 space-y-2">
        {menus.map((item, index) => (
          <motion.div 
            key={item.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 rounded-2xl px-5 py-3.5 transition-all duration-300 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                }`
              }
            >
              {item.icon}
              <span className="font-medium tracking-wide">{item.title}</span>
            </NavLink>
          </motion.div>
        ))}
      </div>

      {/* Logout Area */}
      <div className="p-5 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 text-slate-400 hover:text-red-400 transition-colors py-3 px-5 rounded-xl hover:bg-red-500/10"
        >
          <HiOutlineArrowLeftOnRectangle size={22} />
          <span className="font-semibold">Logout</span>
        </button>
      </div>
    </aside>
  );
}