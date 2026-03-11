import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, UtensilsCrossed, Ticket, ShoppingBag, MapPin, Plus, Minus, Check } from "lucide-react";
import { Link } from "react-router-dom";

const tabs = [
  { id: "vendors", label: "Vendeurs", icon: ShoppingBag },
  { id: "order", label: "Ma commande", icon: UtensilsCrossed },
  { id: "billetterie", label: "Billetterie", icon: Ticket },
  { id: "plan", label: "Plan du stade", icon: MapPin },
];

const vendors = [
  {
    name: "Le Grill du Stade",
    category: "Burgers & Grillades",
    wait: "~8 min",
    items: [
      { name: "Burger Classic", price: 8.5, emoji: "🍔" },
      { name: "Burger Double", price: 11, emoji: "🍔" },
      { name: "Frites maison", price: 4, emoji: "🍟" },
      { name: "Nuggets x6", price: 5.5, emoji: "🍗" },
    ],
  },
  {
    name: "Boissons Express",
    category: "Boissons",
    wait: "~4 min",
    items: [
      { name: "Coca-Cola 50cl", price: 3.5, emoji: "🥤" },
      { name: "Bière blonde 33cl", price: 5, emoji: "🍺" },
      { name: "Eau 50cl", price: 2, emoji: "💧" },
      { name: "Café", price: 2.5, emoji: "☕" },
    ],
  },
  {
    name: "Pizza Corner",
    category: "Pizzas & Snacks",
    wait: "~12 min",
    items: [
      { name: "Pizza Margherita", price: 7, emoji: "🍕" },
      { name: "Pizza Pepperoni", price: 8.5, emoji: "🍕" },
      { name: "Panini Jambon", price: 6, emoji: "🥪" },
    ],
  },
  {
    name: "Boutique Officielle",
    category: "Merchandising",
    wait: "~2 min",
    items: [
      { name: "Écharpe France", price: 15, emoji: "🧣" },
      { name: "Maillot domicile", price: 89, emoji: "👕" },
      { name: "Casquette", price: 22, emoji: "🧢" },
    ],
  },
];

const matches = [
  { id: 1, teams: "France vs Allemagne", date: "Samedi 15 mars", time: "21:00", competition: "Ligue des Nations", available: true },
  { id: 2, teams: "France vs Espagne", date: "Mardi 25 mars", time: "21:00", competition: "Ligue des Nations", available: true },
  { id: 3, teams: "Concert Coldplay", date: "Vendredi 4 avril", time: "20:00", competition: "Événement", available: false },
];

const entrySlots = [
  { time: "19:00 - 19:30", gate: "Porte A", spots: 120 },
  { time: "19:30 - 20:00", gate: "Porte A", spots: 45 },
  { time: "20:00 - 20:30", gate: "Porte A", spots: 8 },
  { time: "19:00 - 19:30", gate: "Porte C", spots: 200 },
  { time: "19:30 - 20:00", gate: "Porte C", spots: 90 },
  { time: "20:00 - 20:30", gate: "Porte C", spots: 15 },
];

const StadiumDemo = () => {
  const [activeTab, setActiveTab] = useState("vendors");
  const [selectedVendor, setSelectedVendor] = useState<number | null>(null);
  const [cart, setCart] = useState<Record<string, number>>({});

  const addToCart = (itemName: string) => {
    setCart((prev) => ({ ...prev, [itemName]: (prev[itemName] || 0) + 1 }));
  };

  const removeFromCart = (itemName: string) => {
    setCart((prev) => {
      const count = (prev[itemName] || 0) - 1;
      if (count <= 0) {
        const { [itemName]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [itemName]: count };
    });
  };

  const allItems = vendors.flatMap((v) => v.items.map((item) => ({ ...item, vendor: v.name })));
  const cartTotal = Object.entries(cart).reduce((total, [name, qty]) => {
    const item = allItems.find((i) => i.name === name);
    return total + (item?.price || 0) * qty;
  }, 0);
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="glass-card sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-bold font-[family-name:var(--font-display)]">
              <span className="text-gradient-lime">Stade de France</span>
            </h1>
            <p className="text-xs text-muted-foreground">Saint-Denis — France vs Allemagne • 21:00</p>
          </div>
          {cartCount > 0 && (
            <button
              onClick={() => setActiveTab("order")}
              className="relative bg-gradient-lime text-primary-foreground px-3 py-2 rounded-xl text-sm font-semibold"
            >
              <ShoppingBag size={18} />
              <span className="absolute -top-1.5 -right-1.5 bg-destructive text-destructive-foreground text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-5xl mx-auto px-6 pt-6">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSelectedVendor(null); }}
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
          {activeTab === "vendors" && selectedVendor === null && (
            <motion.div key="vendors" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <h2 className="text-2xl font-bold mb-2">Vendeurs du stade</h2>
              <p className="text-sm text-muted-foreground mb-8">Commandez et faites-vous livrer à votre siège</p>

              <div className="grid gap-4 md:grid-cols-2">
                {vendors.map((vendor, i) => (
                  <button
                    key={vendor.name}
                    onClick={() => setSelectedVendor(i)}
                    className="glass-card rounded-2xl p-5 text-left hover:border-primary/40 transition-colors group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-bold text-base group-hover:text-primary transition-colors">{vendor.name}</p>
                        <p className="text-xs text-muted-foreground">{vendor.category}</p>
                      </div>
                      <span className="text-xs bg-primary/15 text-primary px-2 py-1 rounded-full">{vendor.wait}</span>
                    </div>
                    <div className="flex gap-1 text-lg">
                      {vendor.items.slice(0, 4).map((item) => (
                        <span key={item.name}>{item.emoji}</span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "vendors" && selectedVendor !== null && (
            <motion.div key="vendor-detail" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <button onClick={() => setSelectedVendor(null)} className="text-sm text-muted-foreground hover:text-foreground mb-4 flex items-center gap-1">
                <ArrowLeft size={14} /> Retour aux vendeurs
              </button>
              <h2 className="text-2xl font-bold mb-1">{vendors[selectedVendor].name}</h2>
              <p className="text-sm text-muted-foreground mb-6">Livraison estimée : {vendors[selectedVendor].wait}</p>

              <div className="grid gap-3">
                {vendors[selectedVendor].items.map((item) => (
                  <div key={item.name} className="glass-card rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.emoji}</span>
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-sm text-primary font-semibold">{item.price.toFixed(2)} €</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {cart[item.name] ? (
                        <>
                          <button onClick={() => removeFromCart(item.name)} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-foreground hover:bg-surface-hover">
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-bold w-5 text-center">{cart[item.name]}</span>
                        </>
                      ) : null}
                      <button onClick={() => addToCart(item.name)} className="w-8 h-8 rounded-full bg-gradient-lime flex items-center justify-center text-primary-foreground hover:opacity-90">
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "order" && (
            <motion.div key="order" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <h2 className="text-2xl font-bold mb-2">Ma commande</h2>
              <p className="text-sm text-muted-foreground mb-6">Tribune Nord — Siège 42, Rang F</p>

              {cartCount === 0 ? (
                <div className="glass-card rounded-2xl p-12 text-center">
                  <ShoppingBag className="mx-auto mb-4 text-muted-foreground" size={40} />
                  <p className="text-muted-foreground">Votre panier est vide</p>
                  <button onClick={() => setActiveTab("vendors")} className="mt-4 text-primary text-sm font-semibold hover:underline">
                    Voir les vendeurs
                  </button>
                </div>
              ) : (
                <div className="glass-card rounded-2xl p-6">
                  <div className="space-y-3 mb-6">
                    {Object.entries(cart).map(([name, qty]) => {
                      const item = allItems.find((i) => i.name === name);
                      if (!item) return null;
                      return (
                        <div key={name} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{item.emoji}</span>
                            <div>
                              <p className="text-sm font-medium">{item.name} × {qty}</p>
                              <p className="text-xs text-muted-foreground">{item.vendor}</p>
                            </div>
                          </div>
                          <span className="text-sm font-semibold text-primary">{(item.price * qty).toFixed(2)} €</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between mb-6">
                    <span className="text-sm text-muted-foreground">Total</span>
                    <span className="text-xl font-bold text-gradient-lime">{cartTotal.toFixed(2)} €</span>
                  </div>

                  <button className="w-full bg-gradient-lime text-primary-foreground py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-lime">
                    Commander — Livraison ~12 min
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "billetterie" && (
            <motion.div key="billetterie" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <h2 className="text-2xl font-bold mb-2">Billetterie</h2>
              <p className="text-sm text-muted-foreground mb-8">Événements au Stade de France</p>

              <div className="space-y-4 mb-10">
                {matches.map((match) => (
                  <div key={match.id} className="glass-card rounded-2xl p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-bold text-base">{match.teams}</p>
                        <p className="text-xs text-muted-foreground">{match.competition} • {match.date} à {match.time}</p>
                      </div>
                      <button
                        disabled={!match.available}
                        className={`text-xs font-semibold px-4 py-2 rounded-full ${
                          match.available
                            ? "bg-gradient-lime text-primary-foreground hover:opacity-90"
                            : "bg-muted text-muted-foreground cursor-not-allowed"
                        }`}
                      >
                        {match.available ? "Acheter" : "Complet"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <h3 className="text-lg font-bold mb-4">Créneaux d'entrée — France vs Allemagne</h3>
              <div className="grid gap-3 md:grid-cols-2">
                {entrySlots.map((slot, i) => (
                  <div key={i} className="glass-card rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{slot.time}</p>
                      <p className="text-xs text-muted-foreground">{slot.gate} — {slot.spots} places</p>
                    </div>
                    <button className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                      slot.spots < 20
                        ? "bg-amber-500/15 text-amber-400"
                        : "bg-primary/15 text-primary"
                    }`}>
                      Choisir
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "plan" && (
            <motion.div key="plan" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <h2 className="text-2xl font-bold mb-2">Plan du stade</h2>
              <p className="text-sm text-muted-foreground mb-8">Votre siège : Tribune Nord, Rang F, Siège 42</p>

              {/* Stadium SVG representation */}
              <div className="glass-card rounded-2xl p-8 flex items-center justify-center">
                <div className="relative w-72 h-72 md:w-96 md:h-96">
                  {/* Oval stadium shape */}
                  <div className="absolute inset-0 border-2 border-border rounded-full" />
                  <div className="absolute inset-4 border-2 border-border/60 rounded-full" />
                  <div className="absolute inset-12 bg-primary/10 rounded-full flex items-center justify-center border border-primary/30">
                    <span className="text-xs text-muted-foreground">Pelouse</span>
                  </div>

                  {/* Your seat marker */}
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
                    <div className="w-4 h-4 rounded-full bg-primary animate-pulse shadow-lime" />
                    <span className="text-[10px] text-primary font-bold whitespace-nowrap">Votre siège</span>
                  </div>

                  {/* Gates */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-3 text-[10px] text-muted-foreground font-medium">Porte A</div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-3 text-[10px] text-muted-foreground font-medium">Porte C</div>
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 text-[10px] text-muted-foreground font-medium">Porte B</div>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 text-[10px] text-muted-foreground font-medium">Porte D</div>

                  {/* Vendor markers */}
                  <div className="absolute top-10 right-10 text-lg cursor-pointer hover:scale-125 transition-transform" title="Le Grill du Stade">🍔</div>
                  <div className="absolute bottom-10 left-10 text-lg cursor-pointer hover:scale-125 transition-transform" title="Pizza Corner">🍕</div>
                  <div className="absolute top-10 left-10 text-lg cursor-pointer hover:scale-125 transition-transform" title="Boissons Express">🥤</div>
                  <div className="absolute bottom-10 right-10 text-lg cursor-pointer hover:scale-125 transition-transform" title="Boutique Officielle">👕</div>

                  {/* Toilets */}
                  <div className="absolute left-4 top-1/3 text-sm cursor-pointer hover:scale-125 transition-transform" title="Toilettes">🚻</div>
                  <div className="absolute right-4 bottom-1/3 text-sm cursor-pointer hover:scale-125 transition-transform" title="Toilettes">🚻</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-6">
                <div className="glass-card rounded-xl p-3 text-center">
                  <p className="text-lg">🍔</p>
                  <p className="text-xs font-medium mt-1">Le Grill du Stade</p>
                  <p className="text-[10px] text-muted-foreground">~2 min à pied</p>
                </div>
                <div className="glass-card rounded-xl p-3 text-center">
                  <p className="text-lg">🥤</p>
                  <p className="text-xs font-medium mt-1">Boissons Express</p>
                  <p className="text-[10px] text-muted-foreground">~1 min à pied</p>
                </div>
                <div className="glass-card rounded-xl p-3 text-center">
                  <p className="text-lg">🍕</p>
                  <p className="text-xs font-medium mt-1">Pizza Corner</p>
                  <p className="text-[10px] text-muted-foreground">~4 min à pied</p>
                </div>
                <div className="glass-card rounded-xl p-3 text-center">
                  <p className="text-lg">👕</p>
                  <p className="text-xs font-medium mt-1">Boutique Officielle</p>
                  <p className="text-[10px] text-muted-foreground">~3 min à pied</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default StadiumDemo;
