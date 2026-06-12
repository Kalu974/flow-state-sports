import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MapPin, Building2, Clock, Sun, Check, Trash2, Boxes, CalendarDays, Inbox } from "lucide-react";
import { toast } from "sonner";
import AdminLayout from "@/components/admin/AdminLayout";
import { addSite, getSites, removeSite } from "@/lib/sitesStore";
import { useStore } from "@/lib/activityStore";

const VAR_CITIES = [
  "Toulon", "Hyères", "La Seyne-sur-Mer", "Six-Fours-les-Plages", "Draguignan",
  "Fréjus", "Saint-Raphaël", "La Garde", "La Valette-du-Var", "Sanary-sur-Mer",
  "Solliès-Pont", "La Crau", "La Farlède", "Brignoles", "Saint-Mandrier",
];

const CATEGORIES = ["Restaurant", "Hôtel", "École / Cantine", "Fast-food", "Supermarché", "Autre"];

export default function Sites() {
  const nav = useNavigate();
  const sites = useStore(getSites);
  const [form, setForm] = useState({
    name: "",
    category: "Restaurant",
    address: "",
    city: "Toulon",
    hasSlot: false,
    slotStart: "09:00",
    slotEnd: "11:00",
    seasonal: true,
    bins: 2,
  });

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.address) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    if (form.bins < 1) {
      toast.error("Le nombre de bacs doit être au moins 1");
      return;
    }
    addSite({
      name: form.name,
      category: form.category,
      address: form.address,
      city: form.city,
      hasSlot: form.hasSlot,
      slotStart: form.hasSlot ? form.slotStart : undefined,
      slotEnd: form.hasSlot ? form.slotEnd : undefined,
      seasonal: form.seasonal,
      bins: form.bins,
    });
    toast.success("Site ajouté", {
      description: `${form.name} · ${form.bins} bac${form.bins > 1 ? "s" : ""}`,
    });
    setForm((f) => ({ ...f, name: "", address: "", bins: 2 }));
  };

  const handleDelete = (id: string, name: string) => {
    removeSite(id);
    toast("Site supprimé", { description: name });
  };

  return (
    <AdminLayout>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => nav("/admin/planning")} className="p-2 rounded-xl bg-muted hover:bg-muted-foreground/10 transition">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-3xl font-display font-extrabold">Saisir des sites</h1>
          <p className="text-muted-foreground">Ajouter & gérer vos points de collecte</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-3 bg-card rounded-3xl p-6 lg:p-8 shadow-card border border-border/50 space-y-5"
        >
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Building2 size={16} className="text-primary" /> Nom du site *
              </label>
              <input value={form.name} onChange={(e) => set("name", e.target.value)}
                placeholder="ex: McDonald's Toulon Mayol"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition" />
            </div>
            <div>
              <label className="text-sm font-semibold mb-2 block">Catégorie</label>
              <select value={form.category} onChange={(e) => set("category", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-primary outline-none">
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <div className="md:col-span-2">
              <label className="text-sm font-semibold mb-2 flex items-center gap-2">
                <MapPin size={16} className="text-primary" /> Adresse *
              </label>
              <input value={form.address} onChange={(e) => set("address", e.target.value)}
                placeholder="ex: 12 rue des Oliviers"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
            <div>
              <label className="text-sm font-semibold mb-2 block">Commune (Var · 83)</label>
              <select value={form.city} onChange={(e) => set("city", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-primary outline-none">
                {VAR_CITIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Boxes size={16} className="text-primary" /> Nombre de bacs sur site *
            </label>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => set("bins", Math.max(1, form.bins - 1))}
                className="w-11 h-11 rounded-xl bg-muted hover:bg-muted-foreground/10 font-bold text-lg">−</button>
              <input type="number" min={1} max={20} value={form.bins}
                onChange={(e) => set("bins", Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 text-center px-3 py-3 rounded-xl border border-border bg-background font-bold text-lg" />
              <button type="button" onClick={() => set("bins", form.bins + 1)}
                className="w-11 h-11 rounded-xl bg-muted hover:bg-muted-foreground/10 font-bold text-lg">+</button>
              <span className="text-xs text-muted-foreground">≈ {form.bins * 24} kg / passage</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-border/60 bg-muted/30">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-start gap-3">
                <Clock className="text-primary mt-0.5" size={18} />
                <div>
                  <div className="font-semibold text-sm">Horaire contractuel</div>
                  <div className="text-xs text-muted-foreground">Optionnel — laisse vide si flexible</div>
                </div>
              </div>
              <button type="button" onClick={() => set("hasSlot", !form.hasSlot)}
                className={`relative w-12 h-7 rounded-full transition ${form.hasSlot ? "bg-primary" : "bg-muted-foreground/30"}`}>
                <motion.div animate={{ x: form.hasSlot ? 22 : 2 }} transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="absolute top-1 w-5 h-5 rounded-full bg-white shadow" />
              </button>
            </div>
            {form.hasSlot && (
              <div className="flex items-center gap-3 pl-8">
                <input type="time" value={form.slotStart} onChange={(e) => set("slotStart", e.target.value)}
                  className="px-3 py-2 rounded-lg border border-border bg-background outline-none" />
                <span className="text-muted-foreground">→</span>
                <input type="time" value={form.slotEnd} onChange={(e) => set("slotEnd", e.target.value)}
                  className="px-3 py-2 rounded-lg border border-border bg-background outline-none" />
              </div>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-r from-secondary/10 to-accent/10 border border-secondary/30">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <Sun className="text-orange-500 mt-0.5" size={20} />
                <div>
                  <div className="font-semibold text-sm">Période de forte influence</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Juin → Septembre · +20% volume</div>
                </div>
              </div>
              <button type="button" onClick={() => set("seasonal", !form.seasonal)}
                className={`relative w-12 h-7 rounded-full transition ${form.seasonal ? "bg-primary" : "bg-muted-foreground/30"}`}>
                <motion.div animate={{ x: form.seasonal ? 22 : 2 }} transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="absolute top-1 w-5 h-5 rounded-full bg-white shadow" />
              </button>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-accent/10 border border-accent/20 text-xs text-muted-foreground flex items-center gap-2">
            <CalendarDays size={14} className="text-accent shrink-0" />
            Lundi & vendredi = journées chargées (pas de tournée le week-end) — pondération auto par l'IA
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={() => nav("/admin/planning")}
              className="px-5 py-3 rounded-xl border border-border font-semibold hover:bg-muted transition">
              Retour
            </button>
            <button type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-primary text-white font-semibold inline-flex items-center gap-2 shadow-soft hover:shadow-glow transition">
              <Check size={18} /> Ajouter le site
            </button>
          </div>
        </motion.form>

        {/* Liste des sites */}
        <div className="lg:col-span-2 bg-card rounded-3xl p-6 shadow-card border border-border/50">
          <h2 className="font-display font-bold flex items-center gap-2 mb-4">
            <MapPin size={18} className="text-primary" /> Sites enregistrés
            <span className="ml-auto text-xs font-semibold bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">
              {sites.length}
            </span>
          </h2>
          {sites.length === 0 ? (
            <div className="text-center py-12">
              <Inbox size={32} className="mx-auto text-muted-foreground/50 mb-2" />
              <div className="text-sm text-muted-foreground">Aucun site enregistré</div>
            </div>
          ) : (
            <div className="space-y-2 max-h-[560px] overflow-auto pr-1">
              <AnimatePresence initial={false}>
                {sites.map((s) => (
                  <motion.div key={s.id} layout
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -40 }}
                    className="p-3 rounded-xl border border-border/60 hover:border-primary/40 hover:bg-muted/30 transition flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate">{s.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{s.category} · {s.city}</div>
                      <div className="flex items-center gap-3 mt-1.5 text-[11px]">
                        <span className="font-bold text-primary">{s.bins} bac{s.bins > 1 ? "s" : ""}</span>
                        {s.hasSlot && <span className="text-muted-foreground">{s.slotStart}→{s.slotEnd}</span>}
                        {s.seasonal && <span className="text-orange-500">☀ saison</span>}
                      </div>
                    </div>
                    <button onClick={() => handleDelete(s.id, s.name)}
                      aria-label="Supprimer"
                      className="p-2 rounded-lg hover:bg-danger/15 text-muted-foreground hover:text-danger transition">
                      <Trash2 size={15} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
