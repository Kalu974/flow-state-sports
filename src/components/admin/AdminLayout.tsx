import { ReactNode, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, CalendarRange, Bell, LogOut, Menu, X, Leaf } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { motion, AnimatePresence } from "framer-motion";

const nav = [
  { to: "/admin", icon: LayoutDashboard, label: "Tableau de bord", end: true },
  { to: "/admin/planning", icon: CalendarRange, label: "Planning & Tournées" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const nav2 = useNavigate();
  const [open, setOpen] = useState(false);

  const Sidebar = () => (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border h-screen flex flex-col">
      <div className="p-6 flex items-center gap-3 border-b border-sidebar-border">
        <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
          <Leaf className="text-white" size={20} />
        </div>
        <div>
          <div className="font-display font-extrabold text-lg text-sidebar-foreground">BioCycle</div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Console Admin</div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {nav.map((n) => (
          <NavLink key={n.to} to={n.to} end={n.end} onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive ? "bg-gradient-primary text-white shadow-soft" : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`
            }>
            <n.icon size={18} /> {n.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-sidebar-border">
        <button onClick={() => { logout(); nav2("/"); }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-muted-foreground hover:bg-sidebar-accent transition">
          <LogOut size={18} /> Déconnexion
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop sidebar */}
      <div className="hidden lg:block"><Sidebar /></div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)} className="fixed inset-0 bg-black/50 z-40 lg:hidden" />
            <motion.div initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }}
              className="fixed left-0 top-0 z-50 lg:hidden"><Sidebar /></motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border bg-card/60 backdrop-blur flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setOpen(true)} className="lg:hidden p-2 -ml-2">
              {open ? <X /> : <Menu />}
            </button>
            <div className="font-display font-semibold text-foreground">Bonjour, {user?.name?.split(" ")[0]} 🌿</div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-xl hover:bg-muted transition">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger animate-pulse" />
            </button>
            <div className="w-9 h-9 rounded-full bg-gradient-primary flex items-center justify-center text-white text-sm font-semibold">
              {user?.name?.[0]}
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
