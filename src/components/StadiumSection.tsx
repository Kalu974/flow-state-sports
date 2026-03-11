import { motion } from "framer-motion";
import { ShoppingBag, Ticket, MapPin, UtensilsCrossed } from "lucide-react";
import FeatureCard from "./FeatureCard";
import heroStadium from "@/assets/hero-stadium.jpg";

const stadiumFeatures = [
  {
    icon: UtensilsCrossed,
    title: "Commande au siège",
    description: "Parcourez tous les vendeurs du stade, passez commande et faites-vous livrer directement à votre place.",
  },
  {
    icon: Ticket,
    title: "Billetterie intelligente",
    description: "Achetez vos billets avec un créneau d'entrée précis pour éviter les files d'attente aux portes.",
  },
  {
    icon: MapPin,
    title: "Navigation dans le stade",
    description: "Retrouvez facilement votre siège, les toilettes, les points de vente les plus proches.",
  },
  {
    icon: ShoppingBag,
    title: "Tous les vendeurs réunis",
    description: "Un seul endroit pour voir tous les stands : burgers, boissons, merchandising. Commandez en un tap.",
  },
];

const StadiumSection = () => {
  return (
    <section id="stade" className="py-24 px-6 relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 opacity-10">
        <img src={heroStadium} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="absolute inset-0 bg-background/95" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-bold uppercase tracking-wider">Expérience Stade</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4">
            Le stade, <span className="text-gradient-lime">sans bouger</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Commandez, accédez et profitez du spectacle sans quitter votre siège.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {stadiumFeatures.map((feature, index) => (
            <FeatureCard key={feature.title} {...feature} index={index} />
          ))}
        </div>

        {/* Order mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-20 glass-card rounded-3xl p-8 max-w-md mx-auto"
        >
          <h3 className="text-sm font-bold text-primary mb-2 uppercase tracking-wider">Commande en cours</h3>
          <p className="text-muted-foreground text-xs mb-6">Tribune Nord — Siège 42, Rang F</p>
          
          <div className="space-y-3 mb-6">
            {[
              { item: "🍔 Burger Classic", price: "8,50 €", vendor: "Le Grill du Stade" },
              { item: "🍟 Frites maison", price: "4,00 €", vendor: "Le Grill du Stade" },
              { item: "🥤 Coca-Cola 50cl", price: "3,50 €", vendor: "Boissons Express" },
            ].map((order) => (
              <div key={order.item} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                <div>
                  <p className="text-sm font-medium">{order.item}</p>
                  <p className="text-xs text-muted-foreground">{order.vendor}</p>
                </div>
                <span className="text-sm font-semibold text-primary">{order.price}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="text-lg font-bold text-gradient-lime">16,00 €</span>
          </div>

          <div className="bg-primary/10 rounded-xl p-3 text-center">
            <p className="text-primary text-sm font-semibold">🚴 Livraison dans ~12 min</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StadiumSection;
