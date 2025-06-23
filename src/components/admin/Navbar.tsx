import { useState, useContext } from "react";
import { Bars3Icon, MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from "@heroicons/react/24/solid";
import {
  HomeIcon,
  Squares2X2Icon,
  ShoppingBagIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { usuario } = useContext(UserContext);

  const flexBetween = "flex items-center justify-between";

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // propagar esse valor para filtro global, contexto ou props
  };

  return (
    <nav>
      {/* Barra superior */}
      <div className={`${flexBetween} fixed top-0 z-40 w-full py-6 bg-white shadow-md px-8`}>
        {/* Esquerda: menu + logo + busca + filtro */}
        <div className="flex items-center gap-4">
          <Bars3Icon
            className="h-6 w-6 text-gray-700 cursor-pointer"
            onClick={() => setIsMenuOpen(true)}
          />

          <img src="/logo.svg" alt="Logo" className="h-10" />
          <h4 className="mt-2 font-semibold text-gray-800" style={{ fontSize: "15px" }}>
            Cego Sweetheart
          </h4>

          {/* Barra de pesquisa */}
          <div className="relative ml-6">
            <input
              type="text"
              placeholder="Pesquisar produtos..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Botão filtro */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-1 border border-gray-300 rounded px-3 py-1 hover:bg-gray-100"
            aria-label="Abrir filtros"
          >
            <FunnelIcon className="w-5 h-5 text-gray-600" />
            <span className="hidden sm:inline text-gray-700">Filtros</span>
          </button>
        </div>

        {/* Direita: ícone de perfil */}
        <div>
          <Link to="/admin/perfil" aria-label="Perfil">
            {usuario.fotoUrl ? (
              <img
                src={usuario.fotoUrl}
                alt="Foto do perfil"
                className="h-7 w-7 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-blue-500"
              />
            ) : (
              <UserCircleIcon className="h-7 w-7 text-gray-700 hover:text-blue-500 cursor-pointer" />
            )}
          </Link>
        </div>
      </div>

      {/* Sidebar lateral */}
      {isMenuOpen && (
        <div className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 px-6 py-8 flex flex-col gap-6">
          {/* Logo no topo da sidebar */}
          <div className="flex justify-center mb-6">
            <img src="/logo.svg" alt="Logo" className="h-12" />
            <h2 className="mt-2 text-lg font-semibold text-gray-800">Cego Sweetheart</h2>
          </div>
          {/* Botão de fechar */}
          <div className="flex justify-end">
            <XMarkIcon
              className="h-6 w-6 text-gray-700 cursor-pointer"
              onClick={() => setIsMenuOpen(false)}
            />
          </div>

          {/* Itens do menu */}
          <ul className="flex flex-col gap-6 text-gray-800">
            <li className="flex items-center gap-3">
              <HomeIcon className="h-5 w-5 text-gray-600" />
              <Link to="/admin/home" className="hover:text-blue-500" onClick={() => setIsMenuOpen(false)}>
                Início
              </Link>
            </li>
            <li className="flex items-center gap-3">
              <Squares2X2Icon className="h-5 w-5 text-gray-600" />
              <Link to="/admin/produtos" className="hover:text-blue-500" onClick={() => setIsMenuOpen(false)}>
                Produtos
              </Link>
            </li>
            <li className="flex items-center gap-3">
              <ShoppingBagIcon className="h-5 w-5 text-gray-600" />
              <Link to="/admin/pedidos" className="hover:text-blue-500" onClick={() => setIsMenuOpen(false)}>
                Pedidos
              </Link>
            </li>
          </ul>
        </div>
      )}

      {/* Painel de filtros - exemplo simples */}
      {isFilterOpen && (
        <div className="fixed top-16 right-8 bg-white border border-gray-300 rounded shadow p-4 z-50 w-64">
          <h3 className="font-semibold mb-2">Filtros</h3>
          <p className="text-gray-600"> Adicionar os filtros</p>
          <button
            className="mt-4 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            onClick={() => setIsFilterOpen(false)}
          >
            Fechar
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 