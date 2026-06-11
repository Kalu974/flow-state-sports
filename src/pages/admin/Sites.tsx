import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Building2, Clock, Sun, Check } from "lucide-react";
import { toast } from "sonner";
import AdminLayout from "@/components/admin/AdminLayout";
import { addSite } from "@/lib/sitesStore";

const VAR_CITIES = [
  "Toulon", "Hyères", "La Seyne-sur-Mer", "Six-Fours-les-Plages", "Draguignan",
  "Fréjus", "Saint-Raphaël", "La Garde", "La Valette-du-Var", "Sanary-sur-Mer",
  "Solliès-Pont", "La Crau", "La Farlède", "Brignoles", "Saint-Mandrier",
];

const CATEGORIES = ["Restaurant", "Hôtel", "École / Cantine", "Fast-food", "Supermarché", "Autre"];

export default function Sites() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: "",
    category: "Restaurant",
    address: "",
    city: "Toulon",
    slotStart: "09:00",
    slotEnd: "11:00",
    seasonal: true,
  });

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.address) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    addSite(form);
    toast.success("Site ajouté avec succès", {
      description: `${form.name} (${form.city}, 83) intégré au planning IA`,
    });
    setTimeout(() => nav("/admin/planning"), 800);
  };

  return (
    <AdminLayout>
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => nav("/admin/planning")}
          className="p-2 rounded-xl bg-muted hover:bg-muted-foreground/10 transition"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-3xl font-display font-extrabold">Saisir un nouveau site</h1>
          <p className="text-muted-foreground">Ajouter un point de collecte au planning</p>
        </div>
      </div>

      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl bg-card rounded-3xl p-8 shadow-card border border-border/50 space-y-6"
      >
        {/* Nom + catégorie */}
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Building2 size={16} className="text-primary" /> Nom du site *
            </label>
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="ex: McDonald's Toulon Mayol"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
            />
          </div>
          <div>
            <label className="text-sm font-semibold mb-2 block">Catégorie</label>
            <select
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-primary outline-none"
            >
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Adresse */}
        <div className="grid md:grid-cols-3 gap-5">
          <div className="md:col-span-2">
            <label className="text-sm font-semibold mb-2 flex items-center gap-2">
              <MapPin size={16} className="text-primary" /> Adresse *
            </label>
            <input
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
              placeholder="ex: 12 rue des Oliviers"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-semibold mb-2 block">Commune (Var · 83)</label>
            <select
              value={form.city}
              onChange={(e) => set("city", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-primary outline-none"
            >
              {VAR_CITIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="text-xs text-muted-foreground bg-accent/10 border border-accent/20 rounded-xl p-3 flex items-center gap-2">
          <MapPin size={14} className="text-accent" />
          Zone de service restreinte au département du <strong>Var (83)</strong>
        </div>

        {/* Créneau horaire */}
        <div>
          <label className="text-sm font-semibold mb-2 flex items-center gap-2">
            <Clock size={16} className="text-primary" /> Créneau horaire contractuel
          </label>
          <div className="flex items-center gap-3">
            <input type="time" value={form.slotStart} onChange={(e) => set("slotStart", e.target.value)}
              className="px-4 py-3 rounded-xl border border-border bg-background focus:border-primary outline-none" />
            <span className="text-muted-foreground">→</span>
            <input type="time" value={form.slotEnd} onChange={(e) => set("slotEnd", e.target.value)}
              className="px-4 py-3 rounded-xl border border-border bg-background focus:border-primary outline-none" />
          </div>
        </div>

        {/* Saisonnalité */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-secondary/10 to-accent/10 border border-secondary/30">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <Sun className="text-orange-500 mt-0.5" size={22} />
              <div>
                <div className="font-semibold">Période de forte influence</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Juin → Septembre. Active la prédiction de volume saisonnier (+20%)
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => set("seasonal", !form.seasonal)}
              className={`relative w-14 h-8 rounded-full transition ${form.seasonal ? "bg-primary" : "bg-muted"}`}
            >
              <motion.div
                animate={{ x: form.seasonal ? 26 : 2 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="absolute top-1 w-6 h-6 rounded-full bg-white shadow"
              />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button type="button" onClick={() => nav("/admin/planning")}
            className="px-6 py-3 rounded-xl border border-border font-semibold hover:bg-muted transition">
            Retour
          </button>
          <button type="submit"
            className="px-6 py-3 rounded-xl bg-gradient-primary text-white font-semibold inline-flex items-center gap-2 shadow-soft hover:shadow-glow transition">
            <Check size={18} /> Valider
          </button>
        </div>
      </motion.form>
    </AdminLayout>
  );
}
