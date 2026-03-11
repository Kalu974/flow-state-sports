import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 glass-card"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className="text-2xl font-bold font-[family-name:var(--font-display)]">
          <span className="text-gradient-lime">FLOW</span>
          <span className="text-foreground">SPORT</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          <a href="#salle" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">Salle de Sport</a>
          <a href="#stade" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">Stade</a>
          <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">Fonctionnalités</a>
          <button className="bg-gradient-lime text-primary-foreground px-5 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
            Télécharger
          </button>
        </div>

        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-foreground">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="md:hidden px-6 pb-4 flex flex-col gap-4"
        >
          <a href="#salle" className="text-muted-foreground hover:text-foreground transition-colors">Salle de Sport</a>
          <a href="#stade" className="text-muted-foreground hover:text-foreground transition-colors">Stade</a>
          <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Fonctionnalités</a>
          <button className="bg-gradient-lime text-primary-foreground px-5 py-2 rounded-lg text-sm font-semibold">
            Télécharger
          </button>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
