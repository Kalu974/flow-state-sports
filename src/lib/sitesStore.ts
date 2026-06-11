import { emitChange } from "./activityStore";

export type SavedSite = {
  id: string;
  name: string;
  category: string;
  address: string;
  city: string;
  slotStart: string;
  slotEnd: string;
  seasonal: boolean;
  estimatedKg: number;
  lat: number; // 0..100 normalized within Var map viewBox
  lng: number;
  createdAt: number;
};

const KEY = "biocycle.sites";

const kgForCategory = (cat: string): number => {
  const c = cat.toLowerCase();
  if (c.includes("hôtel") || c.includes("hotel")) return 120 + Math.round(Math.random() * 80);
  if (c.includes("école") || c.includes("cantine")) return 150 + Math.round(Math.random() * 90);
  if (c.includes("supermarché")) return 200 + Math.round(Math.random() * 120);
  if (c.includes("fast")) return 90 + Math.round(Math.random() * 60);
  return 60 + Math.round(Math.random() * 80);
};

// approximate coords per city in normalized map space (0-300 x 0-180 viewBox used in MiniMap)
const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  "Toulon": { lng: 135, lat: 130 },
  "Hyères": { lng: 190, lat: 135 },
  "La Seyne-sur-Mer": { lng: 120, lat: 145 },
  "Six-Fours-les-Plages": { lng: 110, lat: 150 },
  "Draguignan": { lng: 200, lat: 70 },
  "Fréjus": { lng: 250, lat: 95 },
  "Saint-Raphaël": { lng: 260, lat: 100 },
  "La Garde": { lng: 145, lat: 128 },
  "La Valette-du-Var": { lng: 140, lat: 122 },
  "Sanary-sur-Mer": { lng: 100, lat: 140 },
  "Solliès-Pont": { lng: 160, lat: 108 },
  "La Crau": { lng: 155, lat: 118 },
  "La Farlède": { lng: 152, lat: 112 },
  "Brignoles": { lng: 175, lat: 80 },
  "Saint-Mandrier": { lng: 118, lat: 152 },
};

export const getSites = (): SavedSite[] => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as SavedSite[]) : [];
  } catch {
    return [];
  }
};

export const addSite = (
  site: Omit<SavedSite, "id" | "createdAt" | "estimatedKg" | "lat" | "lng">
): SavedSite => {
  const list = getSites();
  const base = CITY_COORDS[site.city] || { lng: 150, lat: 110 };
  const s: SavedSite = {
    ...site,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    estimatedKg: Math.round(kgForCategory(site.category) * (site.seasonal ? 1.2 : 1)),
    lat: base.lat + (Math.random() - 0.5) * 14,
    lng: base.lng + (Math.random() - 0.5) * 14,
  };
  list.unshift(s);
  localStorage.setItem(KEY, JSON.stringify(list));
  emitChange();
  return s;
};
