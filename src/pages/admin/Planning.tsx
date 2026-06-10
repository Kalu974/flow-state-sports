import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, ChevronDown, TrendingUp } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { weekPlanning, driverRoutes, clients, trucks } from "@/lib/mockData";

const tintForTruck = (t: string) => trucks.find((x) => x.name === t)?.color || "#52B788";
const tolColor = { good: "bg-secondary/20 text-secondary", borderline: "bg-orange-500/20 text-orange-600", outlier: "bg-danger/20 text-danger" };

export default function Planning() {
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openCard, setOpenCard] = useState<string | null>(null);

  const generate = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setGenerated(true); }, 2000);
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-display font-extrabold">Planning & Générateur de tournées</h1>
        <p className="text-muted-foreground">Optimisation IA par jour et par véhicule</p>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-secondary/15 to-accent/15 border border-secondary/30 flex items-center gap-3">
        <TrendingUp className="text-primary" />
        <div>
          <div className="font-semibold text-sm">📈 Période haute (juin → septembre)</div>
          <div className="text-xs text-muted-foreground">Prédictions ajustées +20%</div>
        </div>
      </motion.div>

      {/* Week calendar */}
      <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {weekPlanning.map((d) => (
            <div key={d.day} className="border border-border rounded-xl p-3 hover:border-primary/40 transition">
              <div className="font-display font-bold text-lg mb-2">{d.day}</div>
              <div className="space-y-1.5">
                {d.trucks.map((t) => (
                  <div key={t.truck} className="flex items-center justify-between text-xs px-2 py-1.5 rounded-lg"
                    style={{ background: tintForTruck(t.truck) + "22" }}>
                    <span className="font-semibold" style={{ color: tintForTruck(t.truck) }}>{t.truck}</span>
                    <span className="text-foreground/80">{t.kg} kg</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Generate button */}
      <div className="text-center mb-8">
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={generate} disabled={loading}
          className="bg-gradient-primary text-white px-8 py-4 rounded-2xl font-semibold inline-flex items-center gap-3 shadow-soft hover:shadow-glow disabled:opacity-70">
          {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
          {loading ? "L'IA optimise vos tournées..." : "Générer les tournées"}
        </motion.button>
      </div>

      {/* Generated cards */}
      <AnimatePresence>
        {generated && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trucks.map((t) => {
              const cIds = driverRoutes[t.id] || [];
              const cs = cIds.map((id) => clients.find((c) => c.id === id)!);
              const totalKg = cs.reduce((s, c) => s + c.predictedKg, 0);
              const expanded = openCard === t.id;
              return (
                <motion.div key={t.id} layout
                  onClick={() => setOpenCard(expanded ? null : t.id)}
                  className="bg-card rounded-2xl p-5 shadow-card border border-border/50 cursor-pointer hover:shadow-soft">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold"
                        style={{ background: t.color }}>{t.name}</div>
                      <div>
                        <div className="font-semibold">{t.driver}</div>
                        <div className="text-xs text-muted-foreground">{t.type} · max {t.maxKg} kg</div>
                      </div>
                    </div>
                    <ChevronDown className={`transition ${expanded ? "rotate-180" : ""}`} size={18} />
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 rounded-lg bg-muted">
                      <div className="font-bold text-base">{cs.length}</div><div className="text-muted-foreground">arrêts</div>
                    </div>
                    <div className="p-2 rounded-lg bg-muted">
                      <div className="font-bold text-base">{totalKg} kg</div><div className="text-muted-foreground">estimés</div>
                    </div>
                    <div className="p-2 rounded-lg bg-muted">
                      <div className="font-bold text-base">06h30</div><div className="text-muted-foreground">départ</div>
                    </div>
                  </div>
                  <AnimatePresence>
                    {expanded && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="mt-4 space-y-2 overflow-hidden">
                        {cs.map((c, i) => (
                          <div key={c.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-xs w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center">{i + 1}</span>
                              <span className="font-medium">{c.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] px-2 py-0.5 rounded-full ${tolColor[c.tolerance]}`}>{c.tolerance}</span>
                              <span className="text-xs font-semibold">{c.predictedKg} kg</span>
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
