import { NavLink } from "react-router-dom";
import { Map, ClipboardCheck, Gauge } from "lucide-react";

const tabs = [
  { to: "/driver", icon: Map, label: "Route", end: true },
  { to: "/driver/collecte", icon: ClipboardCheck, label: "Collecte" },
  { to: "/driver/jauge", icon: Gauge, label: "Jauge" },
];

export default function DriverNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur border-t border-border z-40 pb-safe">
      <div className="flex max-w-md mx-auto">
        {tabs.map((t) => (
          <NavLink key={t.to} to={t.to} end={t.end}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-all ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`
            }>
            {({ isActive }) => (
              <>
                <div className={`p-2 rounded-xl transition ${isActive ? "bg-primary/15" : ""}`}>
                  <t.icon size={22} />
                </div>
                {t.label}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
