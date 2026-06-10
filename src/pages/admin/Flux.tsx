import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCw, AlertTriangle } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { arrivalSlots } from "@/lib/mockData";
import { toast } from "sonner";

export default function Flux() {
  const [slots, setSlots] = useState(arrivalSlots);
  const [recalcKey, setRecalcKey] = useState(0);

  // Timeline 9h - 13h
  const startH = 9, endH = 13;
  const span = endH - startH;
  const pct = (v: number) => ((v - startH) / span) * 100;

  // Detect congestion (any slot starting < 0.5h after previous)
  const sorted = [...slots].sort((a, b) => a.start - b.start);
  const congestion = sorted.some((s, i) => i > 0 && s.start - sorted[i - 1].start < 0.5);

  const recalc = () => {
    // re-space evenly with 50 min between starts
    const newSlots = slots.map((s, i) => ({ ...s, start: 9 + i * 0.83 }));
    setSlots(newSlots);
    setRecalcKey((k) => k + 1);
    toast.success("Arrivées recalculées", { description: "Espacement minimal de 20 min garanti" });
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-display font-extrabold">Flux entrants — La Farlède</h1>
          <p className="text-muted-foreground">Gestion des créneaux d'arrivée camions</p>
        </div>
        <button onClick={recalc}
          className="bg-gradient-primary text-white px-5 py-3 rounded-2xl font-semibold flex items-center gap-2 shadow-soft hover:shadow-glow transition">
          <RotateCw size={18} /> Recalculer les arrivées
        </button>
      </div>

      <AnimatePresence>
        {congestion && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mb-4 p-4 rounded-2xl bg-orange-500/15 border border-orange-500/40 flex items-center gap-3 animate-pulse">
            <AlertTriangle className="text-orange-500" />
            <div>
              <div className="font-semibold text-sm">Congestion détectée</div>
              <div className="text-xs text-muted-foreground">Au moins deux arrivées sont trop rapprochées — cliquez Recalculer.</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
        <h3 className="font-display font-bold text-lg mb-6">Chronologie 09h → 13h</h3>

        {/* Hour axis */}
        <div className="relative ml-20 mb-3 h-6 border-b border-border">
          {Array.from({ length: span + 1 }).map((_, i) => (
            <div key={i} className="absolute -top-1 -translate-x-1/2 text-xs text-muted-foreground" style={{ left: `${(i / span) * 100}%` }}>
              {String(startH + i).padStart(2, "0")}h
            </div>
          ))}
        </div>

        {/* Truck lanes */}
        <div className="space-y-4">
          {slots.map((s) => (
            <div key={s.truck} className="flex items-center gap-4">
              <div className="w-16 text-sm font-bold" style={{ color: s.color }}>{s.truck}</div>
              <div className="relative flex-1 h-14 bg-muted rounded-xl">
                <motion.div
                  key={recalcKey + s.truck}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1, left: `${pct(s.start)}%`, width: `${(s.duration / span) * 100}%` }}
                  transition={{ type: "spring", stiffness: 120, damping: 18 }}
                  className="absolute top-1.5 bottom-1.5 rounded-lg flex items-center justify-center text-white text-xs font-semibold shadow-soft"
                  style={{ background: s.color }}>
                  {Math.floor(s.start)}h{String(Math.round((s.start % 1) * 60)).padStart(2, "0")}
                </motion.div>
              </div>
            </div>
          ))}
        </div>

        {/* Buffer indicator */}
        <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
          <div className="w-6 h-1 rounded bg-secondary" /> Tampon minimum 20 minutes entre chaque arrivée
        </div>
      </div>
    </AdminLayout>
  );
}
