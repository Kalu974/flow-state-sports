import { useEffect, useState } from "react";

export type Activity = {
  id: string;
  driver: string;
  siteName: string;
  kg: number;
  time: number;
};

export type ReplanSite = {
  id: string;
  siteId: string;
  name: string;
  address: string;
  city: string;
  reason: string;
  time: number;
};

export type Counters = { validated: number; alerts: number };

const A_KEY = "biocycle.activity";
const R_KEY = "biocycle.replan";
const C_KEY = "biocycle.counters";

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
export const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};

const read = <T,>(k: string, fb: T): T => {
  try {
    const r = localStorage.getItem(k);
    return r ? (JSON.parse(r) as T) : fb;
  } catch {
    return fb;
  }
};

export const getActivity = (): Activity[] => read<Activity[]>(A_KEY, []);
export const getReplan = (): ReplanSite[] => read<ReplanSite[]>(R_KEY, []);
export const getCounters = (): Counters => read<Counters>(C_KEY, { validated: 0, alerts: 0 });

export const addActivity = (a: Omit<Activity, "id" | "time">) => {
  const list = getActivity();
  list.unshift({ ...a, id: crypto.randomUUID(), time: Date.now() });
  localStorage.setItem(A_KEY, JSON.stringify(list.slice(0, 30)));
  const c = getCounters();
  c.validated += 1;
  localStorage.setItem(C_KEY, JSON.stringify(c));
  emit();
};

export const addReplan = (r: Omit<ReplanSite, "id" | "time">) => {
  const list = getReplan();
  list.unshift({ ...r, id: crypto.randomUUID(), time: Date.now() });
  localStorage.setItem(R_KEY, JSON.stringify(list));
  const c = getCounters();
  c.alerts += 1;
  localStorage.setItem(C_KEY, JSON.stringify(c));
  emit();
};

export const removeReplan = (id: string) => {
  const list = getReplan().filter((r) => r.id !== id);
  localStorage.setItem(R_KEY, JSON.stringify(list));
  emit();
};

export const emitChange = emit;

export function useStore<T>(getter: () => T): T {
  const [v, setV] = useState<T>(getter);
  useEffect(() => subscribe(() => setV(getter())), []);
  return v;
}

export const timeAgo = (ts: number) => {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `il y a ${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `il y a ${m} min`;
  const h = Math.floor(m / 60);
  return `il y a ${h}h`;
};
