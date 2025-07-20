import { Link } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

type PedidoStatus = "preparando" | "transporte" | "entregue" | "reembolsado";
type Pedido = {
  id: number;
  clienteNome: string;
  clienteId: string;
  status: PedidoStatus;
  data: string;
  produtoId: number;
  produtoNome: string;
  formaPagamento: string;
  codigoRastreio?: string;
};

const Home = () => {
  const { data: produtos, isLoading } = useProducts();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loadingPedidos, setLoadingPedidos] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetch("http://localhost:3000/api/pedidos")
      .then(res => res.json())
      .then(data => setPedidos(data))
      .finally(() => setLoadingPedidos(false));
  }, []);

  // Calcular estatísticas baseadas nos dados reais
  const totalProdutos = produtos?.length || 0;
  const produtosComEstoque = produtos?.filter(p => p.quantity > 0).length || 0;
  const produtosSemEstoque = produtos?.filter(p => p.quantity === 0).length || 0;
  
  // Estatísticas reais dos pedidos
  const pedidosEmTransporte = pedidos.filter((p) => p.status === 'transporte').length;
  const pedidosEntregues = pedidos.filter((p) => p.status === 'entregue').length;
  const pedidosReembolsados = pedidos.filter((p) => p.status === 'reembolsado').length;

  if (isLoading || loadingPedidos) {
    return (
      <div className="p-8 pt-24 max-w-6xl mx-auto">
        <div className="text-center">
          <p>Carregando estatísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 pt-24 max-w-6xl mx-auto">
      {/* Banner com logo e texto */}
      <div className="flex items-center gap-6 mb-10">
        <img src="/logo.svg" alt="Cego Sweetheart Logo" className="h-20" />
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Bem-vindo ao Cego Sweetheart</h1>
          <p className="text-gray-600 mt-1">Seu painel de controle para gerenciar produtos e pedidos</p>
        </div>
      </div>

      {/* Estatísticas rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-purple-600 text-white p-6 rounded shadow text-center">
          <h2 className="text-lg font-semibold">Total de Produtos</h2>
          <p className="text-3xl font-bold">{totalProdutos}</p>
        </div>
        <div className="bg-green-600 text-white p-6 rounded shadow text-center">
          <h2 className="text-lg font-semibold">Com Estoque</h2>
          <p className="text-3xl font-bold">{produtosComEstoque}</p>
        </div>
        <div className="bg-yellow-500 text-white p-6 rounded shadow text-center">
          <h2 className="text-lg font-semibold">Pedidos em Transporte</h2>
          <p className="text-3xl font-bold">{pedidosEmTransporte}</p>
        </div>
        <div className="bg-red-600 text-white p-6 rounded shadow text-center">
          <h2 className="text-lg font-semibold">Sem Estoque</h2>
          <p className="text-3xl font-bold">{produtosSemEstoque}</p>
        </div>
      </div>

      {/* Estatísticas de pedidos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        <div className="bg-blue-600 text-white p-6 rounded shadow text-center">
          <h2 className="text-lg font-semibold">Pedidos Entregues</h2>
          <p className="text-3xl font-bold">{pedidosEntregues}</p>
        </div>
        <div className="bg-orange-600 text-white p-6 rounded shadow text-center">
          <h2 className="text-lg font-semibold">Pedidos Reembolsados</h2>
          <p className="text-3xl font-bold">{pedidosReembolsados}</p>
        </div>
      </div>

      {/* Links rápidos */}
      <div className="flex flex-wrap gap-6">
        <Link
          to="/admin/produtos"
          className="flex-1 min-w-[150px] bg-blue-600 text-white py-4 rounded shadow text-center hover:bg-blue-700 transition"
        >
          Gerenciar Produtos
        </Link>
        <Link
          to="/admin/pedidos"
          className="flex-1 min-w-[150px] bg-green-600 text-white py-4 rounded shadow text-center hover:bg-green-700 transition"
        >
          Ver Pedidos
        </Link>
        <Link
          to="/admin/perfil"
          className="flex-1 min-w-[150px] bg-gray-600 text-white py-4 rounded shadow text-center hover:bg-gray-700 transition"
        >
          Meu Perfil
        </Link>
      </div>

      {/* Lista dos produtos mais recentes */}
      {user && (user.email === "admin" || user.email === "admin@admin.com") && produtos && produtos.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-6">Produtos Mais Recentes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {produtos.slice(0, 6).map((produto) => (
              <div key={produto.id} className="border rounded p-4 shadow-sm">
                <img
                  src={produto.imageUrl}
                  alt={produto.title}
                  className="w-full h-32 object-cover rounded mb-3"
                />
                <h3 className="font-semibold text-sm">{produto.title}</h3>
                <p className="text-gray-600 text-xs">{produto.artistHandle}</p>
                <p className="font-bold text-sm">{produto.price}</p>
                <p className="text-xs text-gray-500">Estoque: {produto.quantity}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home; 