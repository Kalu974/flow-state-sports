import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Power, Check, X, Inbox } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { getSites, SavedSite } from "@/lib/sitesStore";
import { addActivity, addReplan, useStore } from "@/lib/activityStore";

export default function DriverRoute() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const sites = useStore(getSites);
  const [removed, setRemoved] = useState<string[]>([]);

  const stops: SavedSite[] = useMemo(
    () => sites.filter((s) => !removed.includes(s.id)),
    [sites, removed]
  );

  const handleAction = (s: SavedSite, accepted: boolean) => {
    if (accepted) {
      addActivity({ driver: user?.name || "Chauffeur", siteName: s.name, kg: s.estimatedKg });
      toast.success("Collecte validée", { description: `${s.name} · ${s.estimatedKg} kg` });
    } else {
      addReplan({
        siteId: s.id,
        name: s.name,
        address: s.address,
        city: s.city,
        reason: "Site passé par le chauffeur",
      });
      toast("Site à replanifier", { description: s.name });
    }
    setTimeout(() => setRemoved((r) => [...r, s.id]), 50);
  };

  return (
    <div className="min-h-screen bg-background pb-10 max-w-md mx-auto flex flex-col">
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

      <section className="px-4 mt-5 flex-1">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-bold">File de collecte</h2>
          <span className="text-xs text-muted-foreground">{stops.length} arrêt{stops.length > 1 ? "s" : ""}</span>
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
                    {s.city} · Prédiction IA : <span className="text-primary font-semibold">{s.estimatedKg} kg</span>
                  </div>
                </div>
                <button
                  onClick={() => handleAction(s, true)}
                  aria-label="Valider"
                  className="w-11 h-11 rounded-2xl bg-secondary/15 text-secondary hover:bg-secondary hover:text-white flex items-center justify-center transition active:scale-95"
                >
                  <Check size={20} strokeWidth={3} />
                </button>
                <button
                  onClick={() => handleAction(s, false)}
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
