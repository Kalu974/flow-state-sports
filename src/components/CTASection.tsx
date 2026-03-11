import { motion } from "framer-motion";

const CTASection = () => {
  return (
    <section className="py-24 px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto text-center glass-card rounded-3xl p-12 md:p-16 relative overflow-hidden"
      >
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Prêt à dire adieu aux <span className="text-gradient-lime">files d'attente</span> ?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Rejoins FlowSport et transforme ton expérience sportive. Disponible bientôt sur iOS et Android.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="bg-gradient-lime text-primary-foreground px-8 py-3.5 rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity shadow-lime w-full sm:w-auto">
              S'inscrire à la bêta
            </button>
            <button className="border border-border bg-surface hover:bg-surface-hover text-foreground px-8 py-3.5 rounded-xl font-semibold text-lg transition-colors w-full sm:w-auto">
              En savoir plus
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default CTASection;
