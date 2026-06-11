import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth, Role } from "@/lib/auth";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import Planning from "./pages/admin/Planning";
import Sites from "./pages/admin/Sites";
import Imprevus from "./pages/admin/Imprevus";
import DriverRoute from "./pages/driver/Route";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function Protected({ role, children }: { role: Role; children: JSX.Element }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  if (user.role !== role) return <Navigate to={user.role === "admin" ? "/admin" : "/driver"} replace />;
  return children;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner position="top-right" richColors />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/admin" element={<Protected role="admin"><AdminDashboard /></Protected>} />
            <Route path="/admin/planning" element={<Protected role="admin"><Planning /></Protected>} />
            <Route path="/admin/sites" element={<Protected role="admin"><Sites /></Protected>} />
            <Route path="/admin/imprevus" element={<Protected role="admin"><Imprevus /></Protected>} />
            <Route path="/driver" element={<Protected role="driver"><DriverRoute /></Protected>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
