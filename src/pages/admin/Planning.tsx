import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, ChevronDown, TrendingUp, PlusCircle, AlertTriangle, MapPin, Inbox, Clock, Boxes, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { trucks } from "@/lib/mockData";
import { getSites, SavedSite } from "@/lib/sitesStore";
import { getExtraTours, getReplan, useStore } from "@/lib/activityStore";

const MAX_BINS = 32;

type Stop = { site: SavedSite; bins: number };
type Tour = { truck: typeof trucks[number]; stops: Stop[]; totalBins: number };

// Generate tours: fill truck to MAX_BINS, avoid stops with identical slotStart on the same truck
function generateTours(sites: SavedSite[]): Tour[] {
  if (sites.length === 0) return [];
  // sort: timed first (by slotStart), then untimed (heaviest first)
  const sorted = [...sites].sort((a, b) => {
    if (a.hasSlot && b.hasSlot) return (a.slotStart || "").localeCompare(b.slotStart || "");
    if (a.hasSlot) return -1;
    if (b.hasSlot) return 1;
    return b.bins - a.bins;
  });

  const tours: Tour[] = [];
  for (const s of sorted) {
    // try to place into an existing tour without time conflict & with room
    let placed = false;
    for (const t of tours) {
      if (t.totalBins + s.bins > MAX_BINS) continue;
      if (s.hasSlot && t.stops.some((st) => st.site.hasSlot && st.site.slotStart === s.slotStart)) continue;
      t.stops.push({ site: s, bins: s.bins });
      t.totalBins += s.bins;
      placed = true;
      break;
    }
    if (!placed) {
      if (tours.length >= trucks.length) {
        // overflow: stack on last
        const t = tours[tours.length - 1];
        t.stops.push({ site: s, bins: s.bins });
        t.totalBins += s.bins;
        continue;
      }
      tours.push({ truck: trucks[tours.length], stops: [{ site: s, bins: s.bins }], totalBins: s.bins });
    }
  }
  return tours;
}

export default function Planning() {
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openCard, setOpenCard] = useState<string | null>(null);
  const [sitesOpen, setSitesOpen] = useState(false);
  const savedSites = useStore(getSites);
  const replan = useStore(getReplan);
  const extraTours = useStore(getExtraTours);
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
          <p className="text-muted-foreground">Optimisation IA — capacité {MAX_BINS} bacs / camion</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => nav("/admin/sites")}
            className="bg-gradient-primary text-white px-6 py-3.5 rounded-2xl font-semibold inline-flex items-center gap-2.5 shadow-soft hover:shadow-glow transition">
            <PlusCircle size={20} /> Saisir des sites
          </motion.button>
          <button onClick={() => nav("/admin/imprevus")}
            className="relative px-5 py-3.5 rounded-2xl border-2 border-danger/30 bg-danger/5 text-danger font-semibold inline-flex items-center gap-2 hover:bg-danger/10 transition">
            <AlertTriangle size={18} /> Gérer les imprévus
            {replan.length > 0 && (
              <motion.span
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 min-w-6 h-6 px-1.5 rounded-full bg-danger text-white text-[11px] font-bold flex items-center justify-center shadow-lg">
                {replan.length}
                <span className="absolute inset-0 rounded-full bg-danger animate-ping opacity-40" />
              </motion.span>
            )}
          </button>
        </div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-secondary/15 to-accent/15 border border-secondary/30 flex items-center gap-3">
        <TrendingUp className="text-primary" />
        <div>
          <div className="font-semibold text-sm">📈 Lundi & vendredi — journées de pointe</div>
          <div className="text-xs text-muted-foreground">Pas de tournée le week-end · prédictions ajustées +20% en saison</div>
        </div>
      </motion.div>

      <div className="mb-6 bg-card rounded-2xl shadow-card border border-border/50 overflow-hidden">
        <button onClick={() => setSitesOpen((v) => !v)}
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/40 transition">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <MapPin size={18} className="text-primary" />
            </div>
            <div className="text-left">
              <div className="font-display font-bold">Sites de collecte enregistrés</div>
              <div className="text-xs text-muted-foreground">
                {savedSites.length} site{savedSites.length > 1 ? "s" : ""} · {savedSites.reduce((s, x) => s + x.bins, 0)} bacs au total
              </div>
            </div>
          </div>
          <ChevronDown className={`transition ${sitesOpen ? "rotate-180" : ""}`} size={18} />
        </button>
        <AnimatePresence>
          {sitesOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-border/50">
              {savedSites.length === 0 ? (
                <div className="px-5 py-10 text-center">
                  <Inbox size={32} className="mx-auto text-muted-foreground/60 mb-2" />
                  <div className="text-sm text-muted-foreground">Aucun site enregistré</div>
                  <button onClick={() => nav("/admin/sites")}
                    className="mt-3 text-xs font-semibold text-primary hover:underline">+ Saisir un premier site</button>
                </div>
              ) : (
                <div className="divide-y divide-border/50">
                  {savedSites.map((s) => (
                    <div key={s.id} className="px-5 py-3 flex items-center justify-between gap-3 hover:bg-muted/30 transition">
                      <div className="min-w-0">
                        <div className="font-semibold text-sm truncate">{s.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{s.category} · {s.address}, {s.city}</div>
                      </div>
                      <div className="flex items-center gap-3 whitespace-nowrap">
                        <span className="text-[11px] font-bold text-primary">{s.bins} bac{s.bins > 1 ? "s" : ""}</span>
                        {s.hasSlot && <span className="text-xs text-muted-foreground">{s.slotStart}→{s.slotEnd}</span>}
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
              const fillPct = Math.round((tour.totalBins / MAX_BINS) * 100);
              const extras = extraTours.filter((e) => e.type === "fill" && e.truckId === t.id);
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
                        <div className="text-xs text-muted-foreground">{t.type} · max {MAX_BINS} bacs</div>
                      </div>
                    </div>
                    <ChevronDown className={`transition ${expanded ? "rotate-180" : ""}`} size={18} />
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Remplissage</span>
                      <span className="font-bold" style={{ color: t.color }}>{tour.totalBins}/{MAX_BINS} bacs · {fillPct}%</span>
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
                      <div className="font-bold text-base">{tour.totalBins}</div><div className="text-muted-foreground">bacs</div>
                    </div>
                    <div className="p-2 rounded-lg bg-muted">
                      <div className="font-bold text-base">06h30</div><div className="text-muted-foreground">départ</div>
                    </div>
                  </div>
                  <AnimatePresence>
                    {expanded && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="mt-4 space-y-2 overflow-hidden">
                        {tour.stops.map((st, i) => (
                          <div key={st.site.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50 text-sm">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-xs w-5 h-5 shrink-0 rounded-full bg-primary text-white flex items-center justify-center">{i + 1}</span>
                              <span className="font-medium truncate">{st.site.name}</span>
                              {st.site.hasSlot && (
                                <span className="text-[10px] text-muted-foreground inline-flex items-center gap-0.5">
                                  <Clock size={10} /> {st.site.slotStart}
                                </span>
                              )}
                            </div>
                            <span className="text-xs font-semibold text-primary whitespace-nowrap">{st.bins} bacs</span>
                          </div>
                        ))}
                        {extras.map((e) => (
                          <div key={e.id} className="flex items-center justify-between p-2 rounded-lg bg-accent/15 border border-accent/40 text-sm">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-xs w-5 h-5 shrink-0 rounded-full bg-accent text-white flex items-center justify-center">
                                <Plus size={11} />
                              </span>
                              <span className="font-medium truncate text-accent">{e.siteName}</span>
                              <span className="text-[10px] text-accent/80 uppercase font-bold">Ajout</span>
                            </div>
                            <span className="text-xs font-semibold text-accent whitespace-nowrap">{e.bins} bacs</span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}

            {/* Extra "new" tours added from imprevus */}
            {extraTours.filter((e) => e.type === "new").map((e) => (
              <motion.div key={e.id} layout
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-accent/5 rounded-2xl p-5 shadow-card border-2 border-accent/50 relative">
                <span className="absolute -top-3 left-4 px-2.5 py-0.5 rounded-full bg-accent text-white text-[10px] font-bold uppercase tracking-wider">
                  Tournée ajoutée
                </span>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-accent text-white">
                      <Plus size={20} />
                    </div>
                    <div>
                      <div className="font-semibold text-accent">Tournée d'appoint</div>
                      <div className="text-xs text-muted-foreground">Suite à un imprévu</div>
                    </div>
                  </div>
                  <Boxes className="text-accent" size={18} />
                </div>
                <div className="p-3 rounded-lg bg-card text-sm">
                  <div className="font-semibold">{e.siteName}</div>
                  <div className="text-xs text-muted-foreground">{e.address}, {e.city}</div>
                  <div className="flex items-center gap-3 mt-1.5 text-xs">
                    <span className="font-bold text-accent">{e.bins} bac{e.bins > 1 ? "s" : ""}</span>
                    {e.slotStart && <span className="text-muted-foreground">{e.slotStart}→{e.slotEnd}</span>}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
