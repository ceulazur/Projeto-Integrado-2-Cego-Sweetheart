import React, { useEffect, useState } from "react";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import Catalogo from "./pages/Catalogo";
import VerProduto from "./pages/VerProduto";
import Carrinho from "./pages/Carrinho";
import Entrega from "./pages/Entrega";
import Pagamento from "./pages/Pagamento";
import EscolhaEntrega from "./pages/EscolhaEntrega";
import PagamentoSucesso from "./pages/PagamentoSucesso";
import PagamentoCartao from "./pages/PagamentoCartao";
import PagamentoPix from "./pages/PagamentoPix";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { UserProvider } from "./contexts/UserContext";
import { FilterProvider } from "./contexts/FilterContext";

// Admin pages
import AdminLayout from "./components/admin/AdminLayout";
import AdminHome from "./pages/admin/Home";
import AdminProdutos from "./pages/admin/Produtos";
import AdminPedidos from "./pages/admin/Pedidos";
import AdminPerfil from "./pages/admin/Perfil";
import AdminLogin from "./pages/admin/AdminLogin";
import CadastrarVendedor from "./pages/admin/CadastrarVendedor";
import Vendedores from "./pages/admin/Vendedores";
import Reembolsos from "./pages/admin/Reembolsos";
import DetalhesReembolso from "./pages/admin/DetalhesReembolso";
import HistoricoPedidos from "./pages/HistoricoPedidos";
import SolicitarReembolso from "./pages/SolicitarReembolso";

const RequireAdminAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated && !user) {
      navigate("/admin/login", { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><span>Verificando autenticação...</span></div>;
  }

  return <>{children}</>;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      retryDelay: 1000,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <UserProvider>
        <FilterProvider>
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
                  <Route path="/carrinho" element={<Carrinho />} />
                  <Route path="/entrega" element={<Entrega />} />
                  <Route path="/pagamento" element={<Pagamento />} />
                  <Route path="/escolha-entrega" element={<EscolhaEntrega />} />
                  <Route path="/pagamento-sucesso" element={<PagamentoSucesso />} />
                  <Route path="/pagamento-cartao" element={<PagamentoCartao />} />
                  <Route path="/pagamento-pix" element={<PagamentoPix />} />
                  <Route path="/historico-pedidos" element={<HistoricoPedidos />} />
                  <Route path="/solicitar-reembolso/:orderId" element={<SolicitarReembolso />} />
                  
                  {/* Login admin */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  
                  {/* Rotas de admin protegidas */}
                  <Route path="/admin" element={<RequireAdminAuth><AdminLayout><AdminHome /></AdminLayout></RequireAdminAuth>} />
                  <Route path="/admin/home" element={<RequireAdminAuth><AdminLayout><AdminHome /></AdminLayout></RequireAdminAuth>} />
                  <Route path="/admin/produtos" element={<RequireAdminAuth><AdminLayout><AdminProdutos /></AdminLayout></RequireAdminAuth>} />
                  <Route path="/admin/pedidos" element={<RequireAdminAuth><AdminLayout><AdminPedidos /></AdminLayout></RequireAdminAuth>} />
                  <Route path="/admin/perfil" element={<RequireAdminAuth><AdminLayout><AdminPerfil /></AdminLayout></RequireAdminAuth>} />
                  <Route path="/admin/cadastrar-vendedor" element={<RequireAdminAuth><AdminLayout><CadastrarVendedor /></AdminLayout></RequireAdminAuth>} />
                  <Route path="/admin/vendedores" element={<RequireAdminAuth><AdminLayout><Vendedores /></AdminLayout></RequireAdminAuth>} />
                  <Route path="/admin/reembolsos" element={<RequireAdminAuth><AdminLayout><Reembolsos /></AdminLayout></RequireAdminAuth>} />
                  <Route path="/admin/reembolsos/:reembolsoId" element={<RequireAdminAuth><AdminLayout><DetalhesReembolso /></AdminLayout></RequireAdminAuth>} />
                  
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
        </FilterProvider>
      </UserProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
