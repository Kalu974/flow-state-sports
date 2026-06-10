import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Loader2, CheckCircle2, Leaf } from "lucide-react";
import DriverNav from "@/components/driver/DriverNav";
import { toast } from "sonner";

export default function Jauge() {
  const [current, setCurrent] = useState(317);
  const max = 750;
  const pct = (current / max) * 100;
  const [modalState, setModalState] = useState<"closed" | "loading" | "done">("closed");

  const color = pct < 70 ? "#2D6A4F" : pct < 90 ? "#F4A261" : "#E76F51";
  const gradFrom = pct < 70 ? "#52B788" : pct < 90 ? "#F4A261" : "#E76F51";

  const circumference = 2 * Math.PI * 80;
  const dash = (pct / 100) * circumference;

  const emergency = () => {
    setModalState("loading");
    setTimeout(() => {
      setModalState("done");
      toast.success("Redistribution effectuée", { description: "3 clients transférés à VL2" });
    }, 2200);
  };

  return (
    <div className="min-h-screen bg-background pb-24 max-w-md mx-auto px-5 pt-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-display font-extrabold">Jauge de charge</h1>
        <p className="text-sm text-muted-foreground">VL1 — Marc Dubois</p>
      </div>

      <div className="bg-card rounded-3xl p-8 shadow-card border border-border/50 flex flex-col items-center">
        <div className="relative w-64 h-64">
          <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
            <defs>
              <linearGradient id="gj" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={gradFrom} />
                <stop offset="100%" stopColor={color} />
              </linearGradient>
            </defs>
            <circle cx="100" cy="100" r="80" fill="none" stroke="hsl(var(--muted))" strokeWidth="18" />
            <motion.circle cx="100" cy="100" r="80" fill="none" stroke="url(#gj)" strokeWidth="18"
              strokeLinecap="round" strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: circumference - dash }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className={pct >= 90 ? "animate-pulse" : ""}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-5xl font-display font-extrabold" style={{ color }}>{Math.round(pct)}%</div>
            <div className="text-sm text-muted-foreground">de capacité</div>
          </div>
        </div>
        <div className="mt-5 text-center">
          <div className="text-3xl font-display font-bold">{current} <span className="text-muted-foreground text-xl">/ {max} kg</span></div>
          <div className="text-xs text-muted-foreground mt-1">Mise à jour à chaque collecte validée</div>
        </div>

        {/* Demo: simulate adding load */}
        <button onClick={() => setCurrent((v) => Math.min(max, v + 80))}
          className="mt-4 text-xs px-4 py-2 rounded-full bg-muted text-muted-foreground hover:bg-muted-foreground/10">
          + Simuler une collecte (+80 kg)
        </button>
      </div>

      <button onClick={emergency}
        className="w-full mt-6 bg-danger text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-soft hover:shadow-glow transition">
        <AlertTriangle size={20} /> 🚨 Camion plein — Redistribuer mes stops
      </button>

      <AnimatePresence>
        {modalState !== "closed" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur flex items-center justify-center z-50 p-6"
            onClick={() => modalState === "done" && setModalState("closed")}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="bg-card rounded-3xl p-8 max-w-sm w-full text-center">
              {modalState === "loading" ? (
                <>
                  <Leaf className="mx-auto text-primary animate-spin-slow mb-4" size={48} />
                  <h3 className="font-display font-bold text-xl mb-2">Recalcul en cours...</h3>
                  <p className="text-sm text-muted-foreground">L'IA réaffecte vos clients en surplus</p>
                </>
              ) : (
                <>
                  <CheckCircle2 className="mx-auto text-secondary mb-4" size={56} />
                  <h3 className="font-display font-bold text-xl mb-2">Redistribution réussie</h3>
                  <p className="text-sm text-muted-foreground mb-5">
                    3 clients transférés à <span className="font-semibold text-primary">VL2</span> — Son itinéraire est mis à jour
                  </p>
                  <button onClick={() => setModalState("closed")}
                    className="w-full bg-gradient-primary text-white font-semibold py-3 rounded-2xl">
                    OK
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <DriverNav />
    </div>
  );
}
