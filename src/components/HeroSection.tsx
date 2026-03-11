import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import heroGym from "@/assets/hero-gym.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroGym} alt="Salle de sport moderne" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/80" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block bg-gradient-lime text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-full mb-6 uppercase tracking-wider">
            Zéro attente. 100% performance.
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] mb-6"
        >
          Fini la{" "}
          <span className="text-gradient-lime">frustration</span>
          <br />
          de l'affluence
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
        >
          Réservez vos machines, commandez depuis votre siège, et profitez pleinement
          de votre expérience sportive — en salle comme au stade.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a href="#salle" className="bg-gradient-lime text-primary-foreground px-8 py-3.5 rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity shadow-lime">
            🏋️ Salle de Sport
          </a>
          <a href="#stade" className="border border-border bg-surface hover:bg-surface-hover text-foreground px-8 py-3.5 rounded-xl font-semibold text-lg transition-colors">
            🏟️ Expérience Stade
          </a>
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <ArrowDown className="text-primary" size={28} />
      </motion.div>
    </section>
  );
};

export default HeroSection;
