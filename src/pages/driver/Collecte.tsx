import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Camera, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import DriverNav from "@/components/driver/DriverNav";
import { driverRoutes, clients } from "@/lib/mockData";
import { toast } from "sonner";

const catIcon = { restaurant: "🍽️", hotel: "🏨", cafeteria: "🏫" };

export default function Collecte() {
  const stops = driverRoutes.vl1.map((id) => clients.find((c) => c.id === id)!);
  const [idx, setIdx] = useState(0);
  const [weight, setWeight] = useState("");
  const [confetti, setConfetti] = useState(false);
  const c = stops[idx];

  const validate = () => {
    if (!weight) return toast.error("Saisir un poids");
    setConfetti(true);
    if (navigator.vibrate) navigator.vibrate([50, 30, 50]);
    toast.success(`${c.name} validé`, { description: `${weight} kg enregistrés` });
    setTimeout(() => {
      setConfetti(false);
      setWeight("");
      setIdx((i) => Math.min(stops.length - 1, i + 1));
    }, 1400);
  };

  return (
    <div className="min-h-screen bg-background pb-24 max-w-md mx-auto">
      <div className="sticky top-0 z-30 bg-card/95 backdrop-blur border-b border-border px-4 py-3 flex items-center justify-between">
        <button onClick={() => setIdx(Math.max(0, idx - 1))} disabled={idx === 0} className="p-2 disabled:opacity-30">
          <ChevronLeft />
        </button>
        <div className="text-center">
          <div className="text-xs text-muted-foreground">Progression</div>
          <div className="font-display font-bold">Arrêt {idx + 1} / {stops.length}</div>
        </div>
        <button onClick={() => setIdx(Math.min(stops.length - 1, idx + 1))} disabled={idx === stops.length - 1} className="p-2 disabled:opacity-30">
          <ChevronRight />
        </button>
      </div>

      {/* progress bar */}
      <div className="px-4 pt-3">
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div className="h-full bg-gradient-primary" animate={{ width: `${((idx + 1) / stops.length) * 100}%` }} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={c.id}
          initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
          className="p-5">
          <div className="bg-card rounded-3xl p-6 shadow-card border border-border/50">
            <div className="flex items-start gap-3 mb-5">
              <div className="text-4xl">{catIcon[c.category]}</div>
              <div className="flex-1">
                <h2 className="text-2xl font-display font-extrabold leading-tight">{c.name}</h2>
                <p className="text-sm text-muted-foreground mt-1">{c.address}, {c.city}</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-secondary/15 to-primary/10 border border-secondary/30 rounded-2xl p-4 mb-5">
              <div className="flex items-center gap-2 mb-1">
                <Leaf size={16} className="text-primary" />
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">Prédiction IA</span>
              </div>
              <div className="text-3xl font-display font-bold">{c.predictedKg} kg</div>
              <div className="text-xs text-muted-foreground">Poids estimé pour cette collecte</div>
            </div>

            <label className="block text-sm font-semibold mb-2">Poids réel collecté (kg)</label>
            <input
              type="number"
              inputMode="numeric"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="0"
              className="w-full text-4xl font-display font-bold text-center py-5 rounded-2xl bg-muted border-2 border-transparent focus:border-primary outline-none"
            />

            <button className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-2xl border border-border text-sm text-muted-foreground hover:bg-muted transition">
              <Camera size={16} /> Photo (anomalie)
            </button>

            <button onClick={validate}
              className="w-full mt-3 bg-gradient-primary text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-soft hover:shadow-glow transition">
              <CheckCircle2 size={20} /> Valider la collecte
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Confetti */}
      <AnimatePresence>
        {confetti && (
          <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 pointer-events-none z-50">
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div key={i}
                initial={{ x: "50vw", y: "50vh", opacity: 1, scale: 0 }}
                animate={{
                  x: `${Math.random() * 100}vw`,
                  y: `${Math.random() * 100}vh`,
                  opacity: 0,
                  scale: 1,
                  rotate: Math.random() * 360,
                }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="absolute w-2.5 h-2.5 rounded-sm"
                style={{ background: ["#2D6A4F", "#52B788", "#74C69D", "#1A759F"][i % 4] }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <DriverNav />
    </div>
  );
}
