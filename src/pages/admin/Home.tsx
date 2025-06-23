import { Link } from "react-router-dom";

const Home = () => {
  // Dados simulados para mostrar no dashboard - adicionar lógica de estado ou API conforme necessário
  // Esses dados podem ser substituídos por estados ou props conforme a necessidade
  const totalProdutos = 20;
  const pedidosEmAberto = 5;
  const pedidosEnviados = 12;
  const pedidosCancelados = 3;

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
          <h2 className="text-lg font-semibold">Produtos</h2>
          <p className="text-3xl font-bold">{totalProdutos}</p>
        </div>
        <div className="bg-yellow-500 text-white p-6 rounded shadow text-center">
          <h2 className="text-lg font-semibold">Pedidos em aberto</h2>
          <p className="text-3xl font-bold">{pedidosEmAberto}</p>
        </div>
        <div className="bg-green-600 text-white p-6 rounded shadow text-center">
          <h2 className="text-lg font-semibold">Pedidos enviados</h2>
          <p className="text-3xl font-bold">{pedidosEnviados}</p>
        </div>
        <div className="bg-red-600 text-white p-6 rounded shadow text-center">
          <h2 className="text-lg font-semibold">Pedidos cancelados</h2>
          <p className="text-3xl font-bold">{pedidosCancelados}</p>
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
    </div>
  );
};

export default Home; 