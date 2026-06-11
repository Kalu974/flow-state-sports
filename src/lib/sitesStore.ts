export type SavedSite = {
  id: string;
  name: string;
  category: string;
  address: string;
  city: string;
  slotStart: string;
  slotEnd: string;
  seasonal: boolean;
  createdAt: number;
};

const KEY = "biocycle.sites";

export const getSites = (): SavedSite[] => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as SavedSite[]) : [];
  } catch {
    return [];
  }
};

export const addSite = (site: Omit<SavedSite, "id" | "createdAt">): SavedSite => {
  const list = getSites();
  const s: SavedSite = { ...site, id: crypto.randomUUID(), createdAt: Date.now() };
  list.unshift(s);
  localStorage.setItem(KEY, JSON.stringify(list));
  return s;
};
