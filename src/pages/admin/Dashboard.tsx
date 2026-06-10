import { motion } from "framer-motion";
import { Leaf, Truck, CheckCircle2, AlertTriangle, Download } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { useEffect, useState } from "react";
import { hourlyData, recentActivity, trucks, clients } from "@/lib/mockData";
import { toast } from "sonner";
import AdminLayout from "@/components/admin/AdminLayout";

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const dur = 1200;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [to]);
  return <span>{v.toLocaleString("fr-FR")}{suffix}</span>;
}

function StatCard({ icon: Icon, label, value, tint, suffix, delay }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className="bg-card rounded-2xl p-6 shadow-card border border-border/50 hover:shadow-soft transition">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${tint}`}><Icon size={20} className="text-white" /></div>
      </div>
      <div className="text-3xl font-display font-bold text-foreground"><Counter to={value} suffix={suffix} /></div>
      <div className="text-sm text-muted-foreground mt-1">{label}</div>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const exportBluebob = () => {
    toast.loading("Préparation du fichier Bluebob...", { id: "bb" });
    setTimeout(() => {
      const blob = new Blob(["BioCycle Bluebob Export\n" + new Date().toISOString()], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "biocycle-bluebob-export.txt"; a.click();
      URL.revokeObjectURL(url);
      toast.success("Export Bluebob envoyé ✓", { id: "bb", description: "247 enregistrements transférés" });
    }, 1400);
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-display font-extrabold">Tableau de bord</h1>
          <p className="text-muted-foreground">Vue d'ensemble en temps réel — Var (83)</p>
        </div>
        <button onClick={exportBluebob}
          className="bg-gradient-teal text-white font-semibold px-5 py-3 rounded-2xl flex items-center gap-2 shadow-soft hover:shadow-glow transition hover:scale-[1.02]">
          <Download size={18} /> Exporter Bluebob
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Leaf} label="Biodéchets aujourd'hui (kg)" value={1980} tint="bg-gradient-primary" delay={0} />
        <StatCard icon={Truck} label="Camions en circulation" value={4} tint="bg-accent" delay={0.1} suffix=" (3 VL + 1 PL)" />
        <StatCard icon={CheckCircle2} label="Collectes validées" value={11} tint="bg-secondary" delay={0.2} suffix=" / 15" />
        <StatCard icon={AlertTriangle} label="Alertes actives" value={2} tint="bg-danger" delay={0.3} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="xl:col-span-2 bg-card rounded-2xl p-6 shadow-card border border-border/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-lg">Collecte horaire (kg)</h3>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-primary" /> Réel</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-accent" /> Prédiction</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={hourlyData}>
              <defs>
                <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#52B788" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#52B788" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gb" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1A759F" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#1A759F" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
              <Area type="monotone" dataKey="actual" stroke="#2D6A4F" strokeWidth={2.5} fill="url(#ga)" />
              <Area type="monotone" dataKey="predicted" stroke="#1A759F" strokeWidth={2.5} strokeDasharray="5 5" fill="url(#gb)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
          <h3 className="font-display font-bold text-lg mb-4">Positions camions</h3>
          <MiniMap />
          <div className="mt-4 space-y-2">
            {trucks.map((t) => (
              <div key={t.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: t.color }} />
                  <span className="font-medium">{t.name}</span>
                  <span className="text-muted-foreground text-xs">{t.driver}</span>
                </div>
                <span className="text-xs text-muted-foreground">En route</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
        className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
        <h3 className="font-display font-bold text-lg mb-4">Activité récente</h3>
        <div className="space-y-3">
          {recentActivity.map((a) => (
            <div key={a.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-secondary/20 flex items-center justify-center">
                  <CheckCircle2 size={18} className="text-secondary" />
                </div>
                <div>
                  <div className="font-medium text-sm">{a.driver} <span className="text-muted-foreground font-normal">a validé</span> {a.client}</div>
                  <div className="text-xs text-muted-foreground">{a.time}</div>
                </div>
              </div>
              <div className="text-sm font-semibold text-primary">{a.kg} kg</div>
            </div>
          ))}
        </div>
      </motion.div>
    </AdminLayout>
  );
}

function MiniMap() {
  // Stylized region of Var
  const pts = trucks.map((t, i) => ({
    color: t.color,
    x: 20 + (i * 60) % 200 + Math.random() * 40,
    y: 30 + (i * 45) % 120,
    name: t.name,
  }));
  return (
    <div className="relative w-full h-44 rounded-xl overflow-hidden" style={{ background: "linear-gradient(135deg, #e8f5ed, #d6ecf2)" }}>
      <svg viewBox="0 0 300 180" className="w-full h-full">
        <path d="M20,140 Q60,90 120,110 T220,80 T290,120 L290,170 L20,170 Z" fill="#74C69D33" stroke="#52B788" strokeWidth="1.5" />
        <path d="M40,80 Q100,50 160,70 T280,40" fill="none" stroke="#1A759F55" strokeWidth="1.5" strokeDasharray="3 3" />
        {pts.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="10" fill={p.color} opacity="0.25" className="animate-pulse-pin" />
            <circle cx={p.x} cy={p.y} r="5" fill={p.color} />
            <text x={p.x + 8} y={p.y + 3} fontSize="9" fill="#1B2D27" fontWeight="600">{p.name}</text>
          </g>
        ))}
      </svg>
      <div className="absolute bottom-2 right-2 text-[10px] text-muted-foreground bg-white/70 px-2 py-0.5 rounded">Var · 83</div>
    </div>
  );
}
