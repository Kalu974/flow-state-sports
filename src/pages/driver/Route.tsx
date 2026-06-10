import { useState } from "react";
import { motion } from "framer-motion";
import { Navigation, ChevronUp, LogOut } from "lucide-react";
import DriverNav from "@/components/driver/DriverNav";
import { driverRoutes, clients } from "@/lib/mockData";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";

export default function DriverRoute() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const stops = driverRoutes.vl1.map((id) => clients.find((c) => c.id === id)!);
  const [sheetOpen, setSheetOpen] = useState(true);
  const loadPct = 42;

  return (
    <div className="min-h-screen bg-background relative pb-24 max-w-md mx-auto">
      {/* Top bar */}
      <div className="sticky top-0 z-30 bg-card/95 backdrop-blur border-b border-border px-4 py-3 flex items-center justify-between">
        <div>
          <div className="font-display font-bold text-sm">{user?.name}</div>
          <div className="text-[11px] text-muted-foreground">Fin estimée · 14h20</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[10px] text-muted-foreground">Charge</div>
            <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-gradient-primary transition-all" style={{ width: `${loadPct}%` }} />
            </div>
            <div className="text-[10px] font-semibold text-primary mt-0.5">{loadPct}%</div>
          </div>
          <button onClick={() => { logout(); nav("/"); }} className="p-2 rounded-xl bg-muted">
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {/* Map */}
      <div className="relative h-[60vh] overflow-hidden" style={{ background: "linear-gradient(135deg, #e8f5ed, #d6ecf2)" }}>
        <svg viewBox="0 0 400 500" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          {/* land */}
          <path d="M0,400 Q80,300 180,340 T380,260 L400,260 L400,500 L0,500 Z" fill="#74C69D44" stroke="#52B788" />
          <path d="M30,200 Q120,150 220,180 T390,140" fill="none" stroke="#1A759F33" strokeDasharray="4 4" />
          {/* route polyline */}
          <polyline points="60,420 130,360 200,300 270,250 340,180"
            fill="none" stroke="#2D6A4F" strokeWidth="4" strokeLinecap="round" strokeDasharray="0" />
          {/* stops */}
          {[[60, 420], [130, 360], [200, 300], [270, 250], [340, 180]].map(([x, y], i) => (
            <g key={i}>
              {i === 0 && <circle cx={x} cy={y} r="16" fill="#52B788" opacity="0.3" className="animate-pulse-pin" />}
              <circle cx={x} cy={y} r="10" fill={i === 0 ? "#2D6A4F" : "#fff"} stroke="#2D6A4F" strokeWidth="2.5" />
              <text x={x} y={y + 4} fontSize="11" fontWeight="700" textAnchor="middle"
                fill={i === 0 ? "#fff" : "#2D6A4F"}>{i + 1}</text>
            </g>
          ))}
        </svg>

        <button className="absolute bottom-4 right-4 bg-gradient-primary text-white px-5 py-3 rounded-2xl font-semibold shadow-glow flex items-center gap-2 text-sm">
          <Navigation size={16} /> Démarrer la navigation
        </button>
      </div>

      {/* Bottom sheet */}
      <motion.div
        animate={{ height: sheetOpen ? "auto" : 80 }}
        className="bg-card rounded-t-3xl shadow-2xl -mt-6 relative z-20 overflow-hidden">
        <button onClick={() => setSheetOpen(!sheetOpen)} className="w-full flex items-center justify-center py-3">
          <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full" />
        </button>
        <div className="px-5 pb-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-bold">3 prochains arrêts</h3>
            <ChevronUp className={`transition ${sheetOpen ? "" : "rotate-180"}`} size={18} />
          </div>
          {sheetOpen && (
            <div className="space-y-2">
              {stops.slice(0, 3).map((s, i) => (
                <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold ${i === 0 ? "bg-gradient-primary" : "bg-muted-foreground/40"}`}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">{s.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{s.address}, {s.city}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-primary">{["09:15", "09:45", "10:20"][i]}</div>
                    <div className="text-[10px] text-muted-foreground">~{s.predictedKg} kg</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      <DriverNav />
    </div>
  );
}
