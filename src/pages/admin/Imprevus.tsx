import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ArrowLeft, ArrowRight, Truck, CheckCircle2, Clock, Zap } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";

type Incident = {
  id: string;
  truck: string;
  driver: string;
  time: string;
  message: string;
  severity: "high" | "medium" | "info";
  resolved?: boolean;
};

const INCIDENTS: Incident[] = [
  { id: "i1", truck: "VL1", driver: "Marc Dubois", time: "il y a 2 min", message: "Camion plein plus vite que prévu — surcharge évitée", severity: "high" },
  { id: "i2", truck: "VL3", driver: "Thomas Riva", time: "il y a 8 min", message: "Embouteillage A57, retard estimé 15 min", severity: "medium" },
  { id: "i3", truck: "PL1", driver: "Karim Belkacem", time: "il y a 14 min", message: "Client fermé — collecte reportée", severity: "info", resolved: true },
];

const REROUTED = [
  { client: "Le Sud", from: "VL1", to: "VL2", kg: 75 },
  { client: "Restaurant l'Ancre", from: "VL1", to: "VL2", kg: 105 },
  { client: "Brasserie du Cours", from: "VL1", to: "PL1", kg: 110 },
];

export default function Imprevus() {
  const nav = useNavigate();
  const [selected, setSelected] = useState<string>("i1");
  const current = INCIDENTS.find((i) => i.id === selected)!;

  return (
    <AdminLayout>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => nav("/admin/planning")} className="p-2 rounded-xl bg-muted hover:bg-muted-foreground/10 transition">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-3xl font-display font-extrabold">Gestion des imprévus</h1>
          <p className="text-muted-foreground">Alertes terrain & réajustement IA en temps réel</p>
        </div>
        <span className="ml-auto inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-danger/15 text-danger text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-danger animate-pulse" /> 2 incidents actifs
        </span>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Liste des notifications */}
        <div className="lg:col-span-2 bg-card rounded-3xl p-5 shadow-card border border-border/50">
          <h2 className="font-display font-bold mb-4 flex items-center gap-2">
            <AlertTriangle size={18} className="text-orange-500" /> Notifications terrain
          </h2>
          <div className="space-y-2.5">
            {INCIDENTS.map((i) => {
              const sevColor = i.severity === "high" ? "border-danger/40 bg-danger/5"
                : i.severity === "medium" ? "border-orange-400/40 bg-orange-500/5"
                : "border-border bg-muted/30";
              const active = selected === i.id;
              return (
                <motion.button
                  key={i.id}
                  whileHover={{ x: 4 }}
                  onClick={() => setSelected(i.id)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition ${sevColor} ${active ? "ring-2 ring-primary/40" : ""}`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <Truck size={16} className="text-primary" />
                      <span className="font-bold text-sm">{i.truck}</span>
                      <span className="text-xs text-muted-foreground">· {i.driver}</span>
                    </div>
                    {i.resolved ? (
                      <CheckCircle2 size={16} className="text-secondary" />
                    ) : (
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Clock size={10} /> {i.time}
                      </span>
                    )}
                  </div>
                  <div className="text-sm">{i.message}</div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Détail réajustement */}
        <div className="lg:col-span-3 space-y-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={selected}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl p-6 border border-primary/20"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-11 h-11 rounded-2xl bg-gradient-primary flex items-center justify-center">
                  <Zap className="text-white" size={20} />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Algorithme de réajustement</div>
                  <div className="font-display font-bold text-lg">Incident {current.truck} — basculement automatique</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {current.message}. L'IA a recalculé les itinéraires en <strong className="text-primary">1.4s</strong> et basculé
                les clients restants vers les véhicules disponibles dans la zone.
              </p>
            </motion.div>

            <motion.div
              key={selected + "-list"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-card rounded-3xl p-6 shadow-card border border-border/50"
            >
              <h3 className="font-display font-bold mb-4">Clients réaffectés</h3>
              <div className="space-y-2.5">
                {REROUTED.map((r, idx) => (
                  <motion.div
                    key={r.client}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.08 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-muted/40"
                  >
                    <div className="flex-1 font-semibold">{r.client}</div>
                    <span className="px-2.5 py-1 rounded-lg bg-danger/15 text-danger text-xs font-bold">{r.from}</span>
                    <ArrowRight size={16} className="text-muted-foreground" />
                    <span className="px-2.5 py-1 rounded-lg bg-secondary/20 text-secondary text-xs font-bold">{r.to}</span>
                    <span className="text-sm font-bold text-primary w-16 text-right">{r.kg} kg</span>
                  </motion.div>
                ))}
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3 text-center text-xs">
                <div className="p-3 rounded-xl bg-muted">
                  <div className="font-bold text-lg text-primary">3</div>
                  <div className="text-muted-foreground">clients basculés</div>
                </div>
                <div className="p-3 rounded-xl bg-muted">
                  <div className="font-bold text-lg text-primary">290 kg</div>
                  <div className="text-muted-foreground">tonnage transféré</div>
                </div>
                <div className="p-3 rounded-xl bg-muted">
                  <div className="font-bold text-lg text-secondary">0</div>
                  <div className="text-muted-foreground">collecte annulée</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </AdminLayout>
  );
}
