import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Leaf, RefreshCw, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export default function Login() {
  const nav = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("admin@biocycle.fr");
  const [password, setPassword] = useState("demo1234");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const role = login(email, password);
    toast.success(`Bienvenue ${role === "admin" ? "Administrateur" : "Conducteur"}`);
    nav(role === "admin" ? "/admin" : "/driver", { replace: true });
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-6"
      style={{ background: "linear-gradient(135deg, #1B4332 0%, #1A759F 100%)" }}>
      {/* Animated blobs */}
      <div className="absolute top-0 -left-32 w-96 h-96 rounded-full bg-secondary/30 blur-3xl animate-blob" />
      <div className="absolute bottom-0 -right-32 w-[500px] h-[500px] rounded-full bg-accent/30 blur-3xl animate-blob" style={{ animationDelay: "3s" }} />
      <div className="absolute top-1/2 left-1/3 w-72 h-72 rounded-full bg-sage/20 blur-3xl animate-blob" style={{ animationDelay: "6s" }} />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass rounded-3xl p-10 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-20 h-20 rounded-2xl bg-gradient-primary flex items-center justify-center mb-5 shadow-glow">
              <Leaf className="text-white absolute" size={36} strokeWidth={2.2} />
              <RefreshCw className="text-white/40 absolute" size={64} strokeWidth={1.5} />
            </div>
            <h1 className="text-4xl font-display font-extrabold text-white tracking-tight">BioCycle</h1>
            <p className="text-white/80 mt-2 text-sm">Collecte intelligente. Impact réel.</p>
          </div>

          <form onSubmit={submit} className="space-y-5">
            <FloatingInput label="Email" type="email" value={email} onChange={setEmail} />
            <FloatingInput label="Mot de passe" type="password" value={password} onChange={setPassword} />

            <button type="submit"
              className="w-full bg-gradient-primary text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 hover:shadow-glow transition-all hover:scale-[1.01]">
              Se connecter <ArrowRight size={18} />
            </button>

            <div className="text-center text-white/70 text-xs space-y-1 pt-2">
              <p>Démo : <span className="text-white">admin@biocycle.fr</span> → Admin</p>
              <p>Démo : <span className="text-white">driver@biocycle.fr</span> → Conducteur</p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

function FloatingInput({ label, type, value, onChange }: { label: string; type: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder=" "
        required
        className="peer w-full bg-white/10 border border-white/20 text-white rounded-2xl px-4 pt-6 pb-2 outline-none focus:border-secondary focus:bg-white/15 transition-all placeholder-transparent"
      />
      <label className="absolute left-4 top-2 text-xs text-white/70 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs pointer-events-none">
        {label}
      </label>
    </div>
  );
}
