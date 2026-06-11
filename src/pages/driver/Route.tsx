import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Power, Check, X, Truck } from "lucide-react";
import { toast } from "sonner";
import DriverNav from "@/components/driver/DriverNav";
import { driverRoutes, clients } from "@/lib/mockData";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";

const MAX_KG = 750;
const MAX_M3 = 20;

export default function DriverRoute() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const initial = driverRoutes.vl1.map((id) => clients.find((c) => c.id === id)!);
  const [stops, setStops] = useState(initial);
  const [loadKg, setLoadKg] = useState(317);

  const loadM3 = +(loadKg / MAX_KG * MAX_M3).toFixed(1);
  const pctKg = Math.min(100, (loadKg / MAX_KG) * 100);

  const handleAction = (id: string, accepted: boolean) => {
    const stop = stops.find((s) => s.id === id);
    if (!stop) return;
    if (accepted) {
      setLoadKg((v) => Math.min(MAX_KG, v + stop.predictedKg));
      toast.success("Collecte validée", { description: `${stop.name} · ${stop.predictedKg} kg` });
    } else {
      toast("Site passé", { description: stop.name });
    }
    setTimeout(() => setStops((arr) => arr.filter((s) => s.id !== id)), 50);
  };

  const barColor = pctKg < 70 ? "bg-gradient-primary" : pctKg < 90 ? "bg-orange-500" : "bg-danger";

  return (
    <div className="min-h-screen bg-background pb-24 max-w-md mx-auto flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-card/95 backdrop-blur border-b border-border px-5 py-4 flex items-center justify-between">
        <div>
          <div className="text-[11px] text-muted-foreground uppercase tracking-wider">Chauffeur</div>
          <div className="font-display font-bold text-base">{user?.name}</div>
        </div>
        <button
          onClick={() => { logout(); nav("/"); }}
          aria-label="Déconnexion"
          className="w-11 h-11 rounded-2xl bg-muted hover:bg-danger/15 hover:text-danger flex items-center justify-center transition"
        >
          <Power size={20} />
        </button>
      </header>

      {/* Bandeau capacité */}
      <section className="mx-4 mt-4 rounded-3xl bg-gradient-to-br from-card to-muted/40 border border-border/60 shadow-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <Truck size={18} className="text-primary" />
          <div className="font-display font-bold text-sm">État du camion · VL1</div>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="p-3 rounded-2xl bg-background/60">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Volume</div>
            <div className="font-display font-extrabold text-xl">
              {loadM3} <span className="text-muted-foreground text-sm font-bold">/ {MAX_M3} m³</span>
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-background/60">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Poids</div>
            <div className="font-display font-extrabold text-xl">
              {loadKg} <span className="text-muted-foreground text-sm font-bold">/ {MAX_KG} kg</span>
            </div>
          </div>
        </div>
        <div className="relative h-3 bg-muted rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${barColor} rounded-full`}
            animate={{ width: `${pctKg}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
        <div className="text-right text-[11px] mt-1.5 font-semibold text-muted-foreground">{Math.round(pctKg)}% chargé</div>
      </section>

      {/* Liste collecte */}
      <section className="px-4 mt-5 flex-1">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-bold">File de collecte</h2>
          <span className="text-xs text-muted-foreground">{stops.length} arrêts</span>
        </div>

        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {stops.map((s, i) => (
              <motion.div
                key={s.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 120, scale: 0.9 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="flex items-center gap-3 bg-card rounded-2xl p-3.5 shadow-card border border-border/50"
              >
                <div className={`w-11 h-11 shrink-0 rounded-2xl flex items-center justify-center text-white font-display font-bold text-lg ${i === 0 ? "bg-gradient-primary shadow-glow" : "bg-muted-foreground/50"}`}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm truncate">{s.name}</div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    Prédiction IA : <span className="text-primary font-semibold">{s.predictedKg} kg</span> (±10%)
                  </div>
                </div>
                <button
                  onClick={() => handleAction(s.id, true)}
                  aria-label="Valider"
                  className="w-11 h-11 rounded-2xl bg-secondary/15 text-secondary hover:bg-secondary hover:text-white flex items-center justify-center transition active:scale-95"
                >
                  <Check size={20} strokeWidth={3} />
                </button>
                <button
                  onClick={() => handleAction(s.id, false)}
                  aria-label="Passer"
                  className="w-11 h-11 rounded-2xl bg-danger/10 text-danger hover:bg-danger hover:text-white flex items-center justify-center transition active:scale-95"
                >
                  <X size={20} strokeWidth={3} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          {stops.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 rounded-3xl bg-card border border-border/50"
            >
              <div className="text-5xl mb-2">🎉</div>
              <div className="font-display font-bold">Tournée terminée</div>
              <div className="text-sm text-muted-foreground">Tous les sites ont été traités</div>
            </motion.div>
          )}
        </div>
      </section>

      <DriverNav />
    </div>
  );
}
