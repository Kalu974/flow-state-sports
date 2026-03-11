import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Clock, Users, CalendarCheck, Brain, Activity, Dumbbell } from "lucide-react";
import { Link } from "react-router-dom";

const tabs = [
  { id: "machines", label: "Machines", icon: Dumbbell },
  { id: "affluence", label: "Affluence", icon: Users },
  { id: "reservation", label: "Réservation", icon: CalendarCheck },
  { id: "planificateur", label: "Planificateur", icon: Brain },
];

const machines = [
  { name: "Presse à cuisses", zone: "Bas du corps", wait: 0, status: "Libre" },
  { name: "Banc développé couché", zone: "Pectoraux", wait: 8, status: "8 min" },
  { name: "Poulie haute", zone: "Dos", wait: 3, status: "3 min" },
  { name: "Squat rack #1", zone: "Bas du corps", wait: 15, status: "15 min" },
  { name: "Squat rack #2", zone: "Bas du corps", wait: 0, status: "Libre" },
  { name: "Rameur", zone: "Cardio", wait: 0, status: "Libre" },
  { name: "Tapis de course #3", zone: "Cardio", wait: 5, status: "5 min" },
  { name: "Leg curl", zone: "Bas du corps", wait: 0, status: "Libre" },
  { name: "Développé épaules", zone: "Épaules", wait: 12, status: "12 min" },
  { name: "Curl biceps", zone: "Bras", wait: 0, status: "Libre" },
];

const hours = ["06h", "07h", "08h", "09h", "10h", "11h", "12h", "13h", "14h", "15h", "16h", "17h", "18h", "19h", "20h", "21h", "22h"];
const affluenceData = [15, 35, 60, 75, 50, 30, 55, 40, 25, 20, 30, 45, 70, 85, 95, 80, 40];

const creneaux = [
  { time: "06:00 - 07:00", spots: 8, total: 15 },
  { time: "07:00 - 08:00", spots: 3, total: 15 },
  { time: "08:00 - 09:00", spots: 0, total: 15 },
  { time: "09:00 - 10:00", spots: 5, total: 15 },
  { time: "10:00 - 11:00", spots: 10, total: 15 },
  { time: "12:00 - 13:00", spots: 2, total: 15 },
  { time: "17:00 - 18:00", spots: 0, total: 15 },
  { time: "18:00 - 19:00", spots: 1, total: 15 },
  { time: "19:00 - 20:00", spots: 4, total: 15 },
  { time: "20:00 - 21:00", spots: 7, total: 15 },
];

const planSteps = [
  { exercise: "Squat rack #2", duration: "15 min", status: "reserved", time: "18:00" },
  { exercise: "Presse à cuisses", duration: "12 min", status: "reserved", time: "18:15" },
  { exercise: "Leg curl", duration: "10 min", status: "reserved", time: "18:27" },
  { exercise: "Rameur", duration: "10 min", status: "reserved", time: "18:37" },
  { exercise: "Curl biceps", duration: "10 min", status: "available", time: "18:47" },
];

const GymDemo = () => {
  const [activeTab, setActiveTab] = useState("machines");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="glass-card sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-lg font-bold font-[family-name:var(--font-display)]">
              <span className="text-gradient-lime">Basic-Fit</span> Paris Bastille
            </h1>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span>Ouvert — 67% de fréquentation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-5xl mx-auto px-6 pt-6">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-gradient-lime text-primary-foreground shadow-lime"
                  : "glass-card text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {activeTab === "machines" && (
            <motion.div key="machines" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Machines en temps réel</h2>
                <span className="text-sm text-muted-foreground">{machines.filter(m => m.wait === 0).length} libres sur {machines.length}</span>
              </div>
              <div className="grid gap-3">
                {machines.map((machine) => (
                  <div key={machine.name} className="glass-card rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{machine.name}</p>
                      <p className="text-xs text-muted-foreground">{machine.zone}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                        machine.wait === 0
                          ? "bg-primary/15 text-primary"
                          : machine.wait > 10
                            ? "bg-destructive/15 text-destructive"
                            : "bg-amber-500/15 text-amber-400"
                      }`}>
                        {machine.status}
                      </span>
                      {machine.wait === 0 && (
                        <button className="bg-gradient-lime text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-full hover:opacity-90 transition-opacity">
                          Réserver
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "affluence" && (
            <motion.div key="affluence" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <h2 className="text-2xl font-bold mb-2">Affluence aujourd'hui</h2>
              <p className="text-sm text-muted-foreground mb-8">Mardi 11 mars 2026 — Mise à jour il y a 2 min</p>

              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-end gap-1 h-48">
                  {affluenceData.map((val, i) => {
                    const isNow = i === 12;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className={`w-full rounded-t-md transition-all ${
                            isNow ? "bg-gradient-lime" : val > 70 ? "bg-destructive/60" : val > 40 ? "bg-amber-500/50" : "bg-primary/30"
                          }`}
                          style={{ height: `${val}%` }}
                        />
                        <span className={`text-[10px] ${isNow ? "text-primary font-bold" : "text-muted-foreground"}`}>{hours[i]}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center gap-4 mt-6 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary/30" /> Calme</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500/50" /> Modéré</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-destructive/60" /> Élevé</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="glass-card rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-primary">67%</p>
                  <p className="text-xs text-muted-foreground mt-1">Maintenant</p>
                </div>
                <div className="glass-card rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-foreground">14h</p>
                  <p className="text-xs text-muted-foreground mt-1">Meilleur créneau</p>
                </div>
                <div className="glass-card rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-destructive">18h</p>
                  <p className="text-xs text-muted-foreground mt-1">Heure de pointe</p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "reservation" && (
            <motion.div key="reservation" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <h2 className="text-2xl font-bold mb-2">Réserver un créneau</h2>
              <p className="text-sm text-muted-foreground mb-8">Choisissez votre créneau pour garantir votre accès</p>

              <div className="grid gap-3">
                {creneaux.map((creneau) => (
                  <div key={creneau.time} className="glass-card rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{creneau.time}</p>
                      <p className="text-xs text-muted-foreground">{creneau.spots} places restantes</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-2 rounded-full bg-secondary overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            creneau.spots === 0 ? "bg-destructive" : creneau.spots < 4 ? "bg-amber-500" : "bg-primary"
                          }`}
                          style={{ width: `${((creneau.total - creneau.spots) / creneau.total) * 100}%` }}
                        />
                      </div>
                      <button
                        disabled={creneau.spots === 0}
                        className={`text-xs font-semibold px-4 py-1.5 rounded-full transition-opacity ${
                          creneau.spots === 0
                            ? "bg-muted text-muted-foreground cursor-not-allowed"
                            : "bg-gradient-lime text-primary-foreground hover:opacity-90"
                        }`}
                      >
                        {creneau.spots === 0 ? "Complet" : "Réserver"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "planificateur" && (
            <motion.div key="planificateur" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <h2 className="text-2xl font-bold mb-2">Séance planifiée</h2>
              <p className="text-sm text-muted-foreground mb-4">L'IA a optimisé votre séance « Bas du corps » pour éviter toute attente</p>

              <div className="glass-card rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-bold text-primary uppercase tracking-wider">Séance optimisée</p>
                    <p className="text-xs text-muted-foreground">Durée totale : 57 min • 0 min d'attente</p>
                  </div>
                  <span className="bg-primary/15 text-primary text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                    <Activity size={12} /> Optimal
                  </span>
                </div>

                <div className="space-y-0">
                  {planSteps.map((step, i) => (
                    <div key={step.exercise} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full ${step.status === "reserved" ? "bg-primary" : "bg-amber-500"}`} />
                        {i < planSteps.length - 1 && <div className="w-0.5 flex-1 bg-border" />}
                      </div>
                      <div className="pb-6 flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">{step.exercise}</p>
                            <p className="text-xs text-muted-foreground">{step.time} — {step.duration}</p>
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            step.status === "reserved" ? "bg-primary/15 text-primary" : "bg-amber-500/15 text-amber-400"
                          }`}>
                            {step.status === "reserved" ? "Réservé" : "Libre"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button className="w-full bg-gradient-lime text-primary-foreground py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-lime">
                Confirmer et réserver ma séance
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GymDemo;
