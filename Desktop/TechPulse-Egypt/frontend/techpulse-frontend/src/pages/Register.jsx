import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { User, Mail, Lock, UserPlus, Loader2, AlertCircle } from "lucide-react";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await register(name, email, password);
      alert("Registration completed successfully.\nPlease login.");
      navigate("/login");
    } catch (err) {
      setError(err.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    // تم إضافة pt-20 لضمان عدم التداخل مع الناف بار
    <div className="min-h-screen bg-[#030712] flex items-center justify-center p-6 relative overflow-hidden pt-20">
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 shadow-2xl relative"
      >
        <h1 className="text-3xl font-black text-center text-white mb-2">Create Account</h1>
        <p className="text-slate-400 text-center mb-8">Join TechPulse Egypt today</p>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 flex gap-2 text-red-400 text-sm">
            <AlertCircle size={18} />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            { label: "Full Name", icon: User, type: "text", val: name, set: setName, ph: "John Doe" },
            { label: "Email", icon: Mail, type: "email", val: email, set: setEmail, ph: "name@company.com" },
            { label: "Password", icon: Lock, type: "password", val: password, set: setPassword, ph: "••••••••" }
          ].map((field, idx) => (
            <div key={idx}>
              <label className="text-sm text-slate-400 ml-1">{field.label}</label>
              <div className="relative mt-2">
                <field.icon className="absolute left-3 top-3.5 text-slate-500" size={18} />
                <input type={field.type} required value={field.val} onChange={(e) => field.set(e.target.value)}
                  className="w-full rounded-xl bg-[#030712] border border-slate-700 py-3 pl-11 pr-4 text-white outline-none focus:border-blue-500 transition-colors" placeholder={field.ph} />
              </div>
            </div>
          ))}

          <button disabled={loading} className="mt-4 w-full rounded-xl bg-blue-600 py-3 font-bold text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex justify-center items-center gap-2">
            {loading ? <Loader2 size={18} className="animate-spin" /> : <><UserPlus size={18}/> Register</>}
          </button>
        </form>

        <p className="mt-8 text-center text-slate-400 text-sm">
          Already have an account? 
          <Link to="/login" className="ml-2 text-blue-400 hover:text-blue-300 font-semibold">Login</Link>
        </p>
      </motion.div>
    </div>
  );
}