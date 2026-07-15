import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, Loader2, AlertCircle } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    // تم إضافة pt-20 لضمان عدم التداخل مع الناف بار
    <div className="min-h-screen bg-[#030712] flex items-center justify-center p-6 relative overflow-hidden pt-20">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 shadow-2xl relative"
      >
        <h1 className="text-3xl font-black text-center text-white mb-2">Welcome Back</h1>
        <p className="text-slate-400 text-center mb-8">Login to your TechPulse account</p>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-red-400 text-sm">
            <AlertCircle size={18} />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm text-slate-400 ml-1">Email</label>
            <div className="relative mt-2">
              <Mail className="absolute left-3 top-3.5 text-slate-500" size={18} />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} 
                className="w-full rounded-xl border border-slate-700 bg-[#030712] py-3 pl-11 pr-4 text-white outline-none focus:border-blue-500 transition-colors" placeholder="name@company.com" />
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-400 ml-1">Password</label>
            <div className="relative mt-2">
              <Lock className="absolute left-3 top-3.5 text-slate-500" size={18} />
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} 
                className="w-full rounded-xl border border-slate-700 bg-[#030712] py-3 pl-11 pr-4 text-white outline-none focus:border-blue-500 transition-colors" placeholder="••••••••" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-bold text-white transition-all hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-600/20 active:scale-95">
            {loading ? <Loader2 size={18} className="animate-spin" /> : <><LogIn size={18} /> Login</>}
          </button>
        </form>

        <p className="mt-8 text-center text-slate-400 text-sm">
          Don't have an account? 
          <Link to="/register" className="ml-2 text-blue-400 hover:text-blue-300 font-semibold">Register</Link>
        </p>
      </motion.div>
    </div>
  );
}