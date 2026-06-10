export type Client = {
  id: string;
  name: string;
  category: "restaurant" | "hotel" | "cafeteria";
  address: string;
  city: string;
  lat: number;
  lng: number;
  predictedKg: number;
  tolerance: "good" | "borderline" | "outlier";
};

export type Truck = {
  id: string;
  name: string;
  type: "VL" | "PL";
  maxKg: number;
  driver: string;
  color: string;
};

export const trucks: Truck[] = [
  { id: "vl1", name: "VL1", type: "VL", maxKg: 750, driver: "Marc Dubois", color: "#52B788" },
  { id: "vl2", name: "VL2", type: "VL", maxKg: 750, driver: "Sophie Martel", color: "#1A759F" },
  { id: "vl3", name: "VL3", type: "VL", maxKg: 750, driver: "Thomas Riva", color: "#74C69D" },
  { id: "pl1", name: "PL1", type: "PL", maxKg: 3500, driver: "Karim Belkacem", color: "#E76F51" },
];

export const clients: Client[] = [
  { id: "c1", name: "Le Bistrot Provençal", category: "restaurant", address: "12 rue des Oliviers", city: "Toulon", lat: 43.124, lng: 5.928, predictedKg: 85, tolerance: "good" },
  { id: "c2", name: "Hôtel Méditerranée", category: "hotel", address: "8 av. de la Mer", city: "Hyères", lat: 43.121, lng: 6.128, predictedKg: 180, tolerance: "good" },
  { id: "c3", name: "Café du Port", category: "restaurant", address: "Quai Cronstadt", city: "Toulon", lat: 43.118, lng: 5.929, predictedKg: 65, tolerance: "borderline" },
  { id: "c4", name: "Lycée Beaussier", category: "cafeteria", address: "Bd Pierre Toesca", city: "La Seyne", lat: 43.103, lng: 5.881, predictedKg: 220, tolerance: "good" },
  { id: "c5", name: "La Table d'Azur", category: "restaurant", address: "Place Centrale", city: "Sanary", lat: 43.116, lng: 5.802, predictedKg: 95, tolerance: "good" },
  { id: "c6", name: "Hôtel Pins Penchés", category: "hotel", address: "Corniche", city: "Toulon", lat: 43.099, lng: 5.961, predictedKg: 140, tolerance: "outlier" },
  { id: "c7", name: "Brasserie du Cours", category: "restaurant", address: "Cours Lafayette", city: "Toulon", lat: 43.126, lng: 5.932, predictedKg: 110, tolerance: "good" },
  { id: "c8", name: "Collège Django", category: "cafeteria", address: "Av. Jean Moulin", city: "La Farlède", lat: 43.183, lng: 6.045, predictedKg: 175, tolerance: "good" },
  { id: "c9", name: "Le Sud", category: "restaurant", address: "12 Place Liberté", city: "Toulon", lat: 43.124, lng: 5.929, predictedKg: 75, tolerance: "borderline" },
  { id: "c10", name: "Hôtel Bay View", category: "hotel", address: "Plage Almanarre", city: "Hyères", lat: 43.083, lng: 6.135, predictedKg: 160, tolerance: "good" },
  { id: "c11", name: "Le Mas des Oliviers", category: "restaurant", address: "Route de la Crau", city: "La Crau", lat: 43.151, lng: 6.075, predictedKg: 90, tolerance: "good" },
  { id: "c12", name: "Restaurant l'Ancre", category: "restaurant", address: "Port Saint-Mandrier", city: "Saint-Mandrier", lat: 43.077, lng: 5.928, predictedKg: 105, tolerance: "good" },
  { id: "c13", name: "Hôtel des Pradeaux", category: "hotel", address: "Plage des Sablettes", city: "La Seyne", lat: 43.086, lng: 5.886, predictedKg: 195, tolerance: "good" },
  { id: "c14", name: "Cantine Solliès", category: "cafeteria", address: "Place de l'École", city: "Solliès-Pont", lat: 43.190, lng: 6.040, predictedKg: 145, tolerance: "good" },
  { id: "c15", name: "Le Comptoir d'Hyères", category: "restaurant", address: "Place Massillon", city: "Hyères", lat: 43.120, lng: 6.129, predictedKg: 80, tolerance: "borderline" },
];

export const driverRoutes: Record<string, string[]> = {
  vl1: ["c1", "c3", "c7", "c9", "c12"],
  vl2: ["c2", "c10", "c15", "c11"],
  vl3: ["c4", "c5", "c13", "c6"],
  pl1: ["c8", "c14"],
};

export const hourlyData = [
  { hour: "06h", actual: 120, predicted: 110 },
  { hour: "07h", actual: 280, predicted: 260 },
  { hour: "08h", actual: 510, predicted: 490 },
  { hour: "09h", actual: 720, predicted: 710 },
  { hour: "10h", actual: 980, predicted: 940 },
  { hour: "11h", actual: 1240, predicted: 1180 },
  { hour: "12h", actual: 1490, predicted: 1420 },
  { hour: "13h", actual: 1650, predicted: 1620 },
  { hour: "14h", actual: 1820, predicted: 1780 },
  { hour: "15h", actual: 1980, predicted: 1940 },
];

export const recentActivity = [
  { id: 1, driver: "Marc Dubois", client: "Le Bistrot Provençal", kg: 92, time: "il y a 3 min" },
  { id: 2, driver: "Sophie Martel", client: "Hôtel Méditerranée", kg: 178, time: "il y a 8 min" },
  { id: 3, driver: "Thomas Riva", client: "Lycée Beaussier", kg: 215, time: "il y a 14 min" },
  { id: 4, driver: "Karim Belkacem", client: "Collège Django", kg: 168, time: "il y a 22 min" },
  { id: 5, driver: "Marc Dubois", client: "Café du Port", kg: 71, time: "il y a 31 min" },
];

export const weekPlanning = [
  { day: "Lun", trucks: [{ truck: "VL1", kg: 420 }, { truck: "VL2", kg: 510 }, { truck: "PL1", kg: 1850 }] },
  { day: "Mar", trucks: [{ truck: "VL1", kg: 480 }, { truck: "VL3", kg: 450 }, { truck: "PL1", kg: 2100 }] },
  { day: "Mer", trucks: [{ truck: "VL2", kg: 390 }, { truck: "VL3", kg: 520 }, { truck: "PL1", kg: 1950 }] },
  { day: "Jeu", trucks: [{ truck: "VL1", kg: 510 }, { truck: "VL2", kg: 490 }, { truck: "PL1", kg: 2200 }] },
  { day: "Ven", trucks: [{ truck: "VL1", kg: 620 }, { truck: "VL2", kg: 580 }, { truck: "VL3", kg: 560 }, { truck: "PL1", kg: 2450 }] },
  { day: "Sam", trucks: [{ truck: "VL2", kg: 410 }, { truck: "PL1", kg: 1700 }] },
];

export const arrivalSlots = [
  { truck: "VL1", color: "#52B788", start: 9.0, duration: 0.5 },
  { truck: "VL2", color: "#1A759F", start: 9.83, duration: 0.5 },
  { truck: "VL3", color: "#74C69D", start: 10.67, duration: 0.5 },
  { truck: "PL1", color: "#E76F51", start: 11.5, duration: 0.5 },
];
