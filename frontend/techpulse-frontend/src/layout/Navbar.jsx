import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { HiOutlineBars3, HiOutlineXMark } from "react-icons/hi2";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // للتأكد مما يصل من الـ Context
  console.log("Current User:", user);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/login", { replace: true });
  };

  const links = [{ name: "Home", path: "/" }];
  const protectedLinks = [
    { name: "Jobs", path: "/jobs" },
    { name: "Companies", path: "/companies" },
    { name: "Locations", path: "/locations" },
    { name: "Analytics", path: "/analytics" },
  ];
  const adminLinks = [{ name: "Dashboard", path: "/admin" }];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-slate-950/80 backdrop-blur-lg border-b border-white/10 shadow-lg">
      <div className="max-w-[1280px] mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src="/logos/techpulse_egypt_logo.png" alt="Logo" className="h-20 w-auto object-contain scale-[1.6]" />
        </Link>

        <div className={`absolute top-20 left-0 w-full bg-slate-900/95 p-8 flex flex-col gap-6 md:static md:w-auto md:bg-transparent md:p-0 md:flex-row transition-all ${open ? "opacity-100 visible" : "opacity-0 invisible md:opacity-100 md:visible"}`}>
          {links.map((link) => (
            <NavLink key={link.name} to={link.path} onClick={() => setOpen(false)} className={({ isActive }) => `text-sm font-medium ${isActive ? "text-blue-400" : "text-slate-300"}`}>
              {link.name}
            </NavLink>
          ))}
          
          {user && protectedLinks.map((link) => (
            <NavLink key={link.name} to={link.path} onClick={() => setOpen(false)} className={({ isActive }) => `text-sm font-medium ${isActive ? "text-blue-400" : "text-slate-300"}`}>
              {link.name}
            </NavLink>
          ))}

          {/* رابط الأدمن يظهر فقط إذا كان الـ role هو Admin */}
          {user?.role === "Admin" && adminLinks.map((link) => (
            <NavLink key={link.name} to={link.path} onClick={() => setOpen(false)} className={({ isActive }) => `text-sm font-medium ${isActive ? "text-blue-400" : "text-slate-300"}`}>
              {link.name}
            </NavLink>
          ))}

          {!user ? (
            <div className="flex flex-col md:flex-row gap-4">
              <Link to="/login" onClick={() => setOpen(false)} className="text-slate-300 text-sm">Login</Link>
              <Link to="/register" onClick={() => setOpen(false)} className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm">Register</Link>
            </div>
          ) : (
            <button onClick={handleLogout} className="text-slate-300 hover:text-red-400 text-sm">Logout</button>
          )}
        </div>
        <button onClick={() => setOpen(!open)} className="md:hidden text-3xl text-slate-300">{open ? <HiOutlineXMark /> : <HiOutlineBars3 />}</button>
      </div>
    </nav>
  );
}