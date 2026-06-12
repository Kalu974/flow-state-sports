import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ArrowLeft, Inbox, MapPin, Trash2, Plus, Truck } from "lucide-react";
import { toast } from "sonner";
import AdminLayout from "@/components/admin/AdminLayout";
import { addExtraTour, getReplan, removeReplan, useStore, timeAgo } from "@/lib/activityStore";
import { trucks } from "@/lib/mockData";

export default function Imprevus() {
  const nav = useNavigate();
  const replan = useStore(getReplan);

  const handleNewTour = (r: ReturnType<typeof getReplan>[number]) => {
    addExtraTour({
      type: "new",
      fromReplanId: r.id,
      siteName: r.name, address: r.address, city: r.city, bins: r.binsRemaining,
      slotStart: r.slotStart, slotEnd: r.slotEnd,
    });
    removeReplan(r.id);
    toast.success("Nouvelle tournée créée", { description: `${r.name} ajoutée au planning (bleu)` });
  };

  const handleFill = (r: ReturnType<typeof getReplan>[number], truckId: string) => {
    addExtraTour({
      type: "fill", truckId,
      fromReplanId: r.id,
      siteName: r.name, address: r.address, city: r.city, bins: r.binsRemaining,
      slotStart: r.slotStart, slotEnd: r.slotEnd,
    });
    removeReplan(r.id);
    const t = trucks.find((x) => x.id === truckId);
    toast.success("Tournée complétée", { description: `${r.name} ajoutée à ${t?.name} · ${t?.driver}` });
  };

  const handleDismiss = (id: string) => {
    removeReplan(id);
    toast("Site retiré de la liste");
  };

  return (
    <AdminLayout>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => nav("/admin/planning")} className="p-2 rounded-xl bg-muted hover:bg-muted-foreground/10 transition">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-3xl font-display font-extrabold">Gestion des imprévus</h1>
          <p className="text-muted-foreground">Propose une tournée d'appoint ou complète un camion existant</p>
        </div>
        <span className={`ml-auto inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${replan.length > 0 ? "bg-danger/15 text-danger" : "bg-secondary/15 text-secondary"}`}>
          <span className={`w-2 h-2 rounded-full ${replan.length > 0 ? "bg-danger animate-pulse" : "bg-secondary"}`} />
          {replan.length} site{replan.length > 1 ? "s" : ""} à replanifier
        </span>
      </div>

      <div className="bg-card rounded-3xl p-6 shadow-card border border-border/50">
        <h2 className="font-display font-bold mb-4 flex items-center gap-2">
          <AlertTriangle size={18} className="text-orange-500" /> Sites en attente
        </h2>

        {replan.length === 0 ? (
          <div className="text-center py-14">
            <Inbox size={40} className="mx-auto text-muted-foreground/50 mb-3" />
            <div className="font-display font-bold text-lg">Aucun imprévu</div>
            <div className="text-sm text-muted-foreground mt-1">
              Les sites passés ou collectés partiellement par les chauffeurs apparaîtront ici.
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {replan.map((r) => (
                <motion.div key={r.id} layout
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 60 }}
                  className="p-4 rounded-2xl border-2 border-danger/30 bg-danger/5 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-danger/15 text-danger flex items-center justify-center shrink-0">
                      <MapPin size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm truncate">{r.name}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {r.address}, {r.city} · {timeAgo(r.time)}
                      </div>
                      <div className="text-[11px] mt-0.5">
                        <span className="font-bold text-danger">{r.binsRemaining} bac{r.binsRemaining > 1 ? "s" : ""} restant{r.binsRemaining > 1 ? "s" : ""}</span>
                        <span className="text-muted-foreground"> · {r.reason}</span>
                      </div>
                    </div>
                    <button onClick={() => handleDismiss(r.id)} aria-label="Retirer"
                      className="p-2 rounded-xl hover:bg-danger/15 text-muted-foreground hover:text-danger transition">
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-2 pl-1">
                    <button onClick={() => handleNewTour(r)}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-primary text-white text-sm font-semibold hover:shadow-glow transition">
                      <Plus size={16} /> Nouvelle tournée
                    </button>
                    <div className="relative">
                      <select
                        defaultValue=""
                        onChange={(e) => e.target.value && handleFill(r, e.target.value)}
                        className="w-full appearance-none px-4 py-2.5 pl-10 rounded-xl bg-accent text-white text-sm font-semibold cursor-pointer hover:bg-accent/90 transition outline-none">
                        <option value="" disabled>Compléter un camion…</option>
                        {trucks.map((t) => (
                          <option key={t.id} value={t.id} className="text-foreground">
                            {t.name} — {t.driver}
                          </option>
                        ))}
                      </select>
                      <Truck size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white pointer-events-none" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
