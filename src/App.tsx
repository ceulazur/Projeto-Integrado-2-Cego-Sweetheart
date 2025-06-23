import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import Catalogo from "./pages/Catalogo";
import VerProduto from "./pages/VerProduto";
import { AuthProvider } from "./contexts/AuthContext";
import { UserProvider } from "./contexts/UserContext";

// Admin pages
import AdminLayout from "./components/admin/AdminLayout";
import AdminHome from "./pages/admin/Home";
import AdminProdutos from "./pages/admin/Produtos";
import AdminPedidos from "./pages/admin/Pedidos";
import AdminPerfil from "./pages/admin/Perfil";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <UserProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Rotas públicas */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/catalogo" element={<Catalogo />} />
              <Route path="/produto/:id" element={<VerProduto />} />
              
              {/* Rotas de admin */}
              <Route path="/admin" element={<AdminLayout><AdminHome /></AdminLayout>} />
              <Route path="/admin/home" element={<AdminLayout><AdminHome /></AdminLayout>} />
              <Route path="/admin/produtos" element={<AdminLayout><AdminProdutos /></AdminLayout>} />
              <Route path="/admin/pedidos" element={<AdminLayout><AdminPedidos /></AdminLayout>} />
              <Route path="/admin/perfil" element={<AdminLayout><AdminPerfil /></AdminLayout>} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </UserProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
