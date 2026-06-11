import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, ChevronDown, TrendingUp, PlusCircle, AlertTriangle, MapPin, Inbox } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { trucks } from "@/lib/mockData";
import { getSites, SavedSite } from "@/lib/sitesStore";
import { useStore } from "@/lib/activityStore";

const MAX_KG = 750;

type Tour = { truck: typeof trucks[number]; stops: SavedSite[]; totalKg: number };

function generateTours(sites: SavedSite[]): Tour[] {
  if (sites.length === 0) return [];
  const sorted = [...sites].sort((a, b) => b.estimatedKg - a.estimatedKg);
  const tours: Tour[] = [];
  let current: Tour | null = null;
  let truckIdx = 0;
  for (const s of sorted) {
    if (!current || current.totalKg + s.estimatedKg > MAX_KG) {
      if (truckIdx >= trucks.length) break;
      current = { truck: trucks[truckIdx++], stops: [], totalKg: 0 };
      tours.push(current);
    }
    current.stops.push(s);
    current.totalKg += s.estimatedKg;
  }
  return tours;
}

export default function Planning() {
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openCard, setOpenCard] = useState<string | null>(null);
  const [sitesOpen, setSitesOpen] = useState(false);
  const savedSites = useStore(getSites);
  const nav = useNavigate();

  const tours = generateTours(savedSites);

  const generate = () => {
    if (savedSites.length === 0) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setGenerated(true); }, 1600);
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-extrabold">Planning & Générateur de tournées</h1>
          <p className="text-muted-foreground">Optimisation IA — camions max {MAX_KG} kg</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => nav("/admin/sites")}
            className="bg-gradient-primary text-white px-6 py-3.5 rounded-2xl font-semibold inline-flex items-center gap-2.5 shadow-soft hover:shadow-glow transition"
          >
            <PlusCircle size={20} /> Saisir des sites
          </motion.button>
          <button
            onClick={() => nav("/admin/imprevus")}
            className="px-5 py-3.5 rounded-2xl border-2 border-danger/30 bg-danger/5 text-danger font-semibold inline-flex items-center gap-2 hover:bg-danger/10 transition"
          >
            <AlertTriangle size={18} /> Gérer les imprévus
          </button>
        </div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-secondary/15 to-accent/15 border border-secondary/30 flex items-center gap-3">
        <TrendingUp className="text-primary" />
        <div>
          <div className="font-semibold text-sm">📈 Période haute (juin → septembre)</div>
          <div className="text-xs text-muted-foreground">Prédictions ajustées +20% sur les sites saisonniers</div>
        </div>
      </motion.div>

      <div className="mb-6 bg-card rounded-2xl shadow-card border border-border/50 overflow-hidden">
        <button
          onClick={() => setSitesOpen((v) => !v)}
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/40 transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <MapPin size={18} className="text-primary" />
            </div>
            <div className="text-left">
              <div className="font-display font-bold">Sites de collecte enregistrés</div>
              <div className="text-xs text-muted-foreground">
                {savedSites.length} site{savedSites.length > 1 ? "s" : ""} dans la base
              </div>
            </div>
          </div>
          <ChevronDown className={`transition ${sitesOpen ? "rotate-180" : ""}`} size={18} />
        </button>
        <AnimatePresence>
          {sitesOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-border/50"
            >
              {savedSites.length === 0 ? (
                <div className="px-5 py-10 text-center">
                  <Inbox size={32} className="mx-auto text-muted-foreground/60 mb-2" />
                  <div className="text-sm text-muted-foreground">Aucun site enregistré pour le moment</div>
                  <button
                    onClick={() => nav("/admin/sites")}
                    className="mt-3 text-xs font-semibold text-primary hover:underline"
                  >
                    + Saisir un premier site
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-border/50">
                  {savedSites.map((s) => (
                    <div key={s.id} className="px-5 py-3 flex items-center justify-between gap-3 hover:bg-muted/30 transition">
                      <div className="min-w-0">
                        <div className="font-semibold text-sm truncate">{s.name}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {s.category} · {s.address}, {s.city}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 whitespace-nowrap">
                        <span className="text-[11px] font-bold text-primary">{s.estimatedKg} kg</span>
                        <span className="text-xs text-muted-foreground">{s.slotStart}→{s.slotEnd}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="text-center mb-8">
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={generate} disabled={loading || savedSites.length === 0}
          className="bg-gradient-primary text-white px-8 py-4 rounded-2xl font-semibold inline-flex items-center gap-3 shadow-soft hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
          {loading ? "L'IA optimise vos tournées..." : "Générer les tournées"}
        </motion.button>
        {savedSites.length === 0 && (
          <p className="text-xs text-muted-foreground mt-3">Saisis au moins un site pour générer une tournée.</p>
        )}
      </div>

      <AnimatePresence>
        {generated && tours.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tours.map((tour) => {
              const t = tour.truck;
              const expanded = openCard === t.id;
              const fillPct = Math.round((tour.totalKg / MAX_KG) * 100);
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
                        <div className="text-xs text-muted-foreground">{t.type} · max {MAX_KG} kg</div>
                      </div>
                    </div>
                    <ChevronDown className={`transition ${expanded ? "rotate-180" : ""}`} size={18} />
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Remplissage</span>
                      <span className="font-bold" style={{ color: t.color }}>{fillPct}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full transition-all" style={{ width: `${fillPct}%`, background: t.color }} />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 rounded-lg bg-muted">
                      <div className="font-bold text-base">{tour.stops.length}</div><div className="text-muted-foreground">arrêt{tour.stops.length > 1 ? "s" : ""}</div>
                    </div>
                    <div className="p-2 rounded-lg bg-muted">
                      <div className="font-bold text-base">{tour.totalKg} kg</div><div className="text-muted-foreground">estimés</div>
                    </div>
                    <div className="p-2 rounded-lg bg-muted">
                      <div className="font-bold text-base">06h30</div><div className="text-muted-foreground">départ</div>
                    </div>
                  </div>
                  <AnimatePresence>
                    {expanded && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="mt-4 space-y-2 overflow-hidden">
                        {tour.stops.map((c, i) => (
                          <div key={c.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50 text-sm">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-xs w-5 h-5 shrink-0 rounded-full bg-primary text-white flex items-center justify-center">{i + 1}</span>
                              <span className="font-medium truncate">{c.name}</span>
                            </div>
                            <span className="text-xs font-semibold text-primary whitespace-nowrap">{c.estimatedKg} kg</span>
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
