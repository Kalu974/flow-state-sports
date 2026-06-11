import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ArrowLeft, RefreshCw, Inbox, MapPin, Trash2 } from "lucide-react";
import { toast } from "sonner";
import AdminLayout from "@/components/admin/AdminLayout";
import { getReplan, removeReplan, useStore, timeAgo } from "@/lib/activityStore";

export default function Imprevus() {
  const nav = useNavigate();
  const replan = useStore(getReplan);

  const handleReplan = (id: string, name: string) => {
    removeReplan(id);
    toast.success("Site replanifié", { description: `${name} a été réintégré au planning IA` });
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
          <p className="text-muted-foreground">Sites passés par les chauffeurs & à replanifier</p>
        </div>
        <span className={`ml-auto inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${replan.length > 0 ? "bg-danger/15 text-danger" : "bg-secondary/15 text-secondary"}`}>
          <span className={`w-2 h-2 rounded-full ${replan.length > 0 ? "bg-danger animate-pulse" : "bg-secondary"}`} />
          {replan.length} site{replan.length > 1 ? "s" : ""} à replanifier
        </span>
      </div>

      <div className="bg-card rounded-3xl p-6 shadow-card border border-border/50">
        <h2 className="font-display font-bold mb-4 flex items-center gap-2">
          <AlertTriangle size={18} className="text-orange-500" /> Sites à replanifier
        </h2>

        {replan.length === 0 ? (
          <div className="text-center py-14">
            <Inbox size={40} className="mx-auto text-muted-foreground/50 mb-3" />
            <div className="font-display font-bold text-lg">Aucun site à replanifier</div>
            <div className="text-sm text-muted-foreground mt-1">
              Quand un chauffeur passe un site (✕), il apparaît ici pour réintégration.
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            <AnimatePresence initial={false}>
              {replan.map((r) => (
                <motion.div
                  key={r.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 60 }}
                  className="flex items-center gap-3 p-4 rounded-2xl border-2 border-danger/30 bg-danger/5"
                >
                  <div className="w-10 h-10 rounded-xl bg-danger/15 text-danger flex items-center justify-center shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm truncate">{r.name}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {r.address}, {r.city} · {timeAgo(r.time)}
                    </div>
                  </div>
                  <button
                    onClick={() => handleReplan(r.id, r.name)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-primary text-white text-xs font-semibold hover:shadow-glow transition"
                  >
                    <RefreshCw size={14} /> Replanifier
                  </button>
                  <button
                    onClick={() => handleDismiss(r.id)}
                    aria-label="Retirer"
                    className="p-2 rounded-xl hover:bg-danger/15 text-muted-foreground hover:text-danger transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
