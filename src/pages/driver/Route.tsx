import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Power, Check, X, Inbox, Boxes, AlertCircle, Truck } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { getSites, SavedSite } from "@/lib/sitesStore";
import { addActivity, addReplan, useStore } from "@/lib/activityStore";

const TRUCK_MAX_BINS = 32;
const KG_PER_BIN = 24;

export default function DriverRoute() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const sites = useStore(getSites);
  const [removed, setRemoved] = useState<string[]>([]);
  const [truckBins, setTruckBins] = useState(0);
  const [picks, setPicks] = useState<Record<string, number>>({}); // siteId -> bins picked

  const stops: SavedSite[] = useMemo(
    () => sites.filter((s) => !removed.includes(s.id)),
    [sites, removed]
  );

  const full = truckBins >= TRUCK_MAX_BINS;
  const fillPct = Math.round((truckBins / TRUCK_MAX_BINS) * 100);

  const setPick = (id: string, n: number, max: number) => {
    const clamped = Math.max(0, Math.min(max, n));
    setPicks((p) => ({ ...p, [id]: clamped }));
  };

  const handleValidate = (s: SavedSite) => {
    const taken = picks[s.id] ?? s.bins;
    if (taken === 0) {
      toast.error("Indique au moins 1 bac pris ou utilise ✕ pour passer");
      return;
    }
    const wouldExceed = truckBins + taken > TRUCK_MAX_BINS;
    if (wouldExceed) {
      toast.error("Capacité dépassée", { description: "Retourne au site pour vider le camion." });
      return;
    }
    const kg = taken * KG_PER_BIN;
    addActivity({
      driver: user?.name || "Chauffeur",
      siteName: s.name, binsTaken: taken, binsTotal: s.bins, kg,
    });
    setTruckBins((b) => b + taken);
    const remaining = s.bins - taken;
    if (remaining > 0) {
      addReplan({
        siteId: s.id, name: s.name, address: s.address, city: s.city,
        reason: `Collecte partielle (${taken}/${s.bins})`,
        binsRemaining: remaining,
        slotStart: s.slotStart, slotEnd: s.slotEnd,
      });
      toast.success(`Collecte partielle · ${taken}/${s.bins} bacs`, {
        description: `${remaining} bac${remaining > 1 ? "s" : ""} → imprévus`,
      });
    } else {
      toast.success("Collecte validée", { description: `${s.name} · ${taken} bacs (${kg} kg)` });
    }
    setTimeout(() => setRemoved((r) => [...r, s.id]), 50);
  };

  const handleSkip = (s: SavedSite) => {
    addReplan({
      siteId: s.id, name: s.name, address: s.address, city: s.city,
      reason: "Site passé par le chauffeur",
      binsRemaining: s.bins,
      slotStart: s.slotStart, slotEnd: s.slotEnd,
    });
    toast("Site à replanifier", { description: s.name });
    setTimeout(() => setRemoved((r) => [...r, s.id]), 50);
  };

  const returnToBase = () => {
    setTruckBins(0);
    toast.success("Camion vidé", { description: "Tu peux reprendre ta tournée 🌿" });
  };

  return (
    <div className="min-h-screen bg-background pb-10 max-w-md mx-auto flex flex-col">
      <header className="sticky top-0 z-30 bg-card/95 backdrop-blur border-b border-border px-5 py-4 flex items-center justify-between">
        <div>
          <div className="text-[11px] text-muted-foreground uppercase tracking-wider">Chauffeur</div>
          <div className="font-display font-bold text-base">{user?.name}</div>
        </div>
        <button onClick={() => { logout(); nav("/"); }} aria-label="Déconnexion"
          className="w-11 h-11 rounded-2xl bg-muted hover:bg-danger/15 hover:text-danger flex items-center justify-center transition">
          <Power size={20} />
        </button>
      </header>

      {/* Truck capacity */}
      <div className="px-4 mt-4">
        <div className={`rounded-2xl p-4 border ${full ? "bg-danger/10 border-danger/40" : "bg-card border-border/50"} shadow-card`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Truck size={18} className={full ? "text-danger" : "text-primary"} />
              <div className="font-display font-bold text-sm">Camion</div>
            </div>
            <div className={`text-sm font-bold ${full ? "text-danger" : "text-primary"}`}>
              {truckBins} / {TRUCK_MAX_BINS} bacs
            </div>
          </div>
          <div className="h-2.5 rounded-full bg-muted overflow-hidden">
            <motion.div className={`h-full ${full ? "bg-danger" : "bg-gradient-primary"}`}
              animate={{ width: `${fillPct}%` }} transition={{ type: "spring", stiffness: 120, damping: 20 }} />
          </div>
          {full && (
            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
              className="mt-3 flex items-center gap-3 text-sm">
              <AlertCircle size={18} className="text-danger shrink-0" />
              <span className="text-danger font-semibold flex-1">Capacité max atteinte — retour au site</span>
              <button onClick={returnToBase}
                className="px-3 py-1.5 rounded-lg bg-danger text-white text-xs font-bold">Vider</button>
            </motion.div>
          )}
        </div>
      </div>

      <section className="px-4 mt-5 flex-1">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-bold">File de collecte</h2>
          <span className="text-xs text-muted-foreground">{stops.length} arrêt{stops.length > 1 ? "s" : ""}</span>
        </div>

        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {stops.map((s, i) => {
              const picked = picks[s.id] ?? s.bins;
              return (
                <motion.div key={s.id} layout
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 120, scale: 0.9 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className={`bg-card rounded-2xl p-3.5 shadow-card border border-border/50 ${full ? "opacity-60" : ""}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 shrink-0 rounded-2xl flex items-center justify-center text-white font-display font-bold text-lg ${i === 0 ? "bg-gradient-primary shadow-glow" : "bg-muted-foreground/50"}`}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm truncate">{s.name}</div>
                      <div className="text-[11px] text-muted-foreground truncate">
                        {s.city}
                        {s.hasSlot && <> · {s.slotStart}→{s.slotEnd}</>}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mr-1">
                      <Boxes size={14} className="text-primary" />
                      <span>Bacs pris</span>
                    </div>
                    <button disabled={full} onClick={() => setPick(s.id, picked - 1, s.bins)}
                      className="w-8 h-8 rounded-lg bg-muted hover:bg-muted-foreground/10 font-bold disabled:opacity-40">−</button>
                    <div className="w-12 text-center font-bold text-base">{picked}</div>
                    <button disabled={full} onClick={() => setPick(s.id, picked + 1, s.bins)}
                      className="w-8 h-8 rounded-lg bg-muted hover:bg-muted-foreground/10 font-bold disabled:opacity-40">+</button>
                    <span className="text-[11px] text-muted-foreground">/ {s.bins} prévu{s.bins > 1 ? "s" : ""}</span>

                    <div className="ml-auto flex items-center gap-2">
                      <button onClick={() => handleValidate(s)} disabled={full} aria-label="Valider"
                        className="w-10 h-10 rounded-xl bg-secondary/15 text-secondary hover:bg-secondary hover:text-white flex items-center justify-center transition active:scale-95 disabled:opacity-40">
                        <Check size={18} strokeWidth={3} />
                      </button>
                      <button onClick={() => handleSkip(s)} aria-label="Passer"
                        className="w-10 h-10 rounded-xl bg-danger/10 text-danger hover:bg-danger hover:text-white flex items-center justify-center transition active:scale-95">
                        <X size={18} strokeWidth={3} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {stops.length === 0 && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 rounded-3xl bg-card border border-border/50">
              <Inbox size={36} className="mx-auto text-muted-foreground/60 mb-2" />
              <div className="font-display font-bold">Aucun site à collecter</div>
              <div className="text-sm text-muted-foreground px-6 mt-1">
                Les nouveaux sites saisis par l'administrateur apparaîtront ici.
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
