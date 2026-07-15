import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { HiOutlineBars3, HiOutlineXMark } from "react-icons/hi2";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const logoPath = "/logos/techpulse_egypt_logo.png";

  const links = [{ name: "Home", path: "/" }];
  const protectedLinks = [
    { name: "Jobs", path: "/jobs" },
    { name: "Companies", path: "/companies" },
    { name: "Locations", path: "/locations" },
    { name: "Analytics", path: "/analytics" },
  ];

  function handleLogout() {
    logout();
    setOpen(false);
    navigate("/login");
  }

  return (
<nav className="fixed top-0 left-0 w-full z-50  bg-slate-950 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/20">      <div className="max-w-[1280px] mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* ================= Logo ================= */}
        <Link to="/" className="relative flex items-center">
          <img
            src={logoPath}
            alt="TechPulse Egypt"
            className="h-20 w-auto object-contain scale-[1.6] origin-left transition-all duration-300 hover:scale-[1.7]"
          />
        </Link>

        {/* ================= Menu ================= */}
        <div
          className={`
            absolute top-20 left-0 w-full bg-[#030712]/95 border-b border-white/[0.05] p-8 flex flex-col gap-6 transition-all duration-300
            md:static md:w-auto md:bg-transparent md:border-none md:p-0 md:flex-row md:items-center md:gap-8
            ${open ? "translate-y-0 opacity-100 visible" : "-translate-y-10 opacity-0 invisible md:translate-y-0 md:opacity-100 md:visible"}
          `}
        >
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `text-sm font-semibold transition ${isActive ? "text-blue-400" : "text-slate-300 hover:text-blue-400"}`
              }
            >
              {link.name}
            </NavLink>
          ))}

          {user &&
            protectedLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `text-sm font-semibold transition ${isActive ? "text-blue-400" : "text-slate-300 hover:text-blue-400"}`
                }
              >
                {link.name}
              </NavLink>
            ))}

          {!user ? (
            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
              <Link to="/login" onClick={() => setOpen(false)} className="text-slate-300 hover:text-blue-400 font-semibold text-sm">
                Login
              </Link>
              <Link to="/register" onClick={() => setOpen(false)} className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl font-semibold text-sm transition">
                Register
              </Link>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
              <span className="text-sky-400 text-sm font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Hi, {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="bg-white/5 hover:bg-white/10 text-slate-300 hover:text-red-400 px-5 py-2 rounded-xl font-semibold text-sm transition border border-white/5"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* ================= Mobile Button ================= */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-3xl text-slate-300">
          {open ? <HiOutlineXMark /> : <HiOutlineBars3 />}
        </button>
      </div>
    </nav>
  );
}