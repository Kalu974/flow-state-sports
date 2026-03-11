import { motion } from "framer-motion";
import { Activity, Clock, CalendarCheck, Brain, Users } from "lucide-react";
import FeatureCard from "./FeatureCard";

const gymFeatures = [
  {
    icon: Clock,
    title: "Attente en temps réel",
    description: "Visualisez le temps d'attente pour chaque machine de votre salle. Plus besoin de tourner en rond.",
  },
  {
    icon: Users,
    title: "Affluence en direct",
    description: "Consultez le taux de fréquentation de votre salle à tout moment pour choisir le bon créneau.",
  },
  {
    icon: CalendarCheck,
    title: "Réservation par créneaux",
    description: "Réservez vos machines à l'avance par créneau horaire. Arrivez, entraînez-vous, partez.",
  },
  {
    icon: Brain,
    title: "Planificateur intelligent",
    description: "Planifiez votre séance : l'app adapte vos exercices aux machines libres et les réserve automatiquement.",
  },
  {
    icon: Activity,
    title: "Séance sans stress",
    description: "Suivez votre progression en temps réel avec une séance optimisée, sans aucune attente.",
  },
];

const GymSection = () => {
  return (
    <section id="salle" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-bold uppercase tracking-wider">Salle de Sport</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4">
            Entraîne-toi <span className="text-gradient-lime">sans attendre</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Toutes les fonctionnalités pour une expérience en salle fluide et optimale.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gymFeatures.map((feature, index) => (
            <FeatureCard key={feature.title} {...feature} index={index} />
          ))}
        </div>

        {/* Live demo mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-20 glass-card rounded-3xl p-8 max-w-3xl mx-auto"
        >
          <h3 className="text-sm font-bold text-primary mb-6 uppercase tracking-wider">Aperçu en direct — Machines</h3>
          <div className="space-y-4">
            {[
              { name: "Presse à cuisses", wait: 0, status: "Libre" },
              { name: "Banc développé couché", wait: 8, status: "8 min" },
              { name: "Poulie haute", wait: 3, status: "3 min" },
              { name: "Squat rack", wait: 15, status: "15 min" },
              { name: "Rameur", wait: 0, status: "Libre" },
            ].map((machine) => (
              <div key={machine.name} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                <span className="font-medium text-sm">{machine.name}</span>
                <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                  machine.wait === 0 
                    ? "bg-primary/15 text-primary" 
                    : machine.wait > 10 
                      ? "bg-destructive/15 text-destructive" 
                      : "bg-amber-500/15 text-amber-400"
                }`}>
                  {machine.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GymSection;
