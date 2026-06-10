import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Role = "admin" | "driver";
type User = { email: string; role: Role; name: string };

type AuthCtx = {
  user: User | null;
  login: (email: string, password: string) => Role;
  logout: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const stored = localStorage.getItem("biocycle_user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = (email: string, _password: string): Role => {
    const role: Role = email.toLowerCase().includes("driver") || email.toLowerCase().includes("pilote") || email.toLowerCase().includes("conducteur") ? "driver" : "admin";
    const u: User = { email, role, name: role === "admin" ? "Camille Dubreuil" : "Marc Dubois" };
    setUser(u);
    localStorage.setItem("biocycle_user", JSON.stringify(u));
    return role;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("biocycle_user");
  };

  return <Ctx.Provider value={{ user, login, logout }}>{children}</Ctx.Provider>;
}

export const useAuth = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth outside provider");
  return c;
};
