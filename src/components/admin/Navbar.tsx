import { useState, useContext, useEffect, useRef } from "react";
import { Bars3Icon, MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from "@heroicons/react/24/solid";
import {
  HomeIcon,
  Squares2X2Icon,
  ShoppingBagIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import { useAuth } from "../../contexts/AuthContext";
import { Product } from "../../hooks/useProducts";
import { useFilters, FilterState } from "../../contexts/FilterContext";
import { useVendors } from '../../hooks/useVendors';

// Usar o tipo Product importado, que já é completo
type SearchResult = Product;

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  
  const { usuario, loading } = useContext(UserContext);
  const { logout } = useAuth();
  const { filters, setFilters, resetFilters, isDefault } = useFilters();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const { data: vendors } = useVendors();

  const flexBetween = "flex items-center justify-between";
  const serverUrl = "http://localhost:3000";

  // Efeito para buscar produtos com debounce
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      setIsDropdownVisible(false);
      return;
    }

    const debounceTimer = setTimeout(async () => {
      try {
        const response = await fetch(`${serverUrl}/api/products/search?q=${searchTerm}`);
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data);
          setIsDropdownVisible(data.length > 0);
        } else {
          setSearchResults([]);
          setIsDropdownVisible(false);
        }
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        setSearchResults([]);
        setIsDropdownVisible(false);
      }
    }, 300); // 300ms de debounce

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  // Efeito para fechar o dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsDropdownVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout(); // Usa a função de logout do AuthContext
    // Opcional: limpar o localStorage se você ainda o usa para persistência
    localStorage.removeItem("admin-user"); 
    navigate("/admin/login");
  };

  // Identificação de admin
  const isAdmin = usuario && (usuario.nome === "admin" || usuario.email === "admin");

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

          {/* Barra de pesquisa com Dropdown */}
          <div className="relative ml-6" ref={searchRef}>
            <input
              type="text"
              placeholder="Pesquisar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsDropdownVisible(searchTerm.trim() !== "" && searchResults.length > 0)}
              className="w-full md:w-80 pl-10 pr-4 py-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            
            {isDropdownVisible && (
              <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
                {searchResults.length > 0 ? (
                  <ul>
                    {searchResults.map((product) => (
                      <li key={product.id}>
                        <div
                          className="flex items-center gap-4 p-3 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            navigate('/admin/produtos', { 
                              state: { productToEdit: product } 
                            });
                            setIsDropdownVisible(false);
                            setSearchTerm("");
                          }}
                        >
                          <img 
                            src={product.imageUrl.startsWith('http') ? product.imageUrl : `${serverUrl}${product.imageUrl}`} 
                            alt={product.title} 
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div>
                            <p className="font-semibold text-gray-800">{product.title}</p>
                            <p className="text-sm text-gray-500">{product.price}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    Nenhum produto encontrado.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Botão filtro */}
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-1 border border-gray-300 rounded px-3 py-1 hover:bg-gray-100"
              aria-label="Abrir filtros"
            >
              <FunnelIcon className="w-5 h-5 text-gray-600" />
              <span className="hidden sm:inline text-gray-700">Filtros</span>
              {!isDefault && (
                 <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-blue-500 border-2 border-white" />
              )}
            </button>
          </div>
        </div>

        {/* Direita: ícone de perfil e logout */}
        <div className="flex items-center gap-4">
          <Link to="/admin/perfil" aria-label="Perfil">
            {loading ? (
              <div className="h-7 w-7 rounded-full bg-gray-300 animate-pulse" />
            ) : usuario?.fotoUrl ? (
              <img
                src={`${serverUrl}${usuario.fotoUrl}`}
                alt="Foto do perfil"
                className="h-7 w-7 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-blue-500"
              />
            ) : (
              <UserCircleIcon className="h-7 w-7 text-gray-700 hover:text-blue-500 cursor-pointer" />
            )}
          </Link>
          <button
            onClick={handleLogout}
            className="ml-2 px-3 py-1 text-sm rounded bg-red-100 text-red-700 hover:bg-red-200 border border-red-300"
          >
            Sair
          </button>
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
            {isAdmin && (
              <li className="flex items-center gap-3">
                <UserCircleIcon className="h-5 w-5 text-gray-600" />
                <Link to="/admin/cadastrar-vendedor" className="hover:text-blue-500" onClick={() => setIsMenuOpen(false)}>
                  Cadastrar Vendedor
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Painel de filtros */}
      {isFilterOpen && (
        <div className="fixed top-20 right-8 bg-white border border-gray-200 rounded-lg shadow-xl p-6 z-50 w-80">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Filtros</h3>
             <button
                onClick={resetFilters}
                className="text-sm text-blue-600 hover:underline disabled:text-gray-400 disabled:no-underline"
                disabled={isDefault}
              >
                Limpar Filtros
              </button>
          </div>
          
          <div className="flex flex-col gap-5">
            {/* Filtro de vendedor (apenas admin) */}
            {isAdmin && vendors && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vendedor</label>
                <select
                  value={filters.vendor || ''}
                  onChange={e => setFilters(f => ({ ...f, vendor: e.target.value }))}
                  className="w-full border border-gray-300 rounded p-2 text-sm"
                >
                  <option value="">Todos</option>
                  {vendors.map(vendor => (
                    <option key={vendor.id} value={
                      vendor.email === 'ceulazur' ? '@ceulazur' :
                      vendor.email === 'artemisia' ? '@artemisia' :
                      vendor.email === 'admin' ? '@admin' : vendor.email
                    }>
                      {vendor.firstName} {vendor.lastName} ({vendor.email})
                    </option>
                  ))}
                </select>
              </div>
            )}
            {/* Ordenar por */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ordenar por</label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters(f => ({ ...f, sortBy: e.target.value as FilterState['sortBy'] }))}
                className="w-full border border-gray-300 rounded p-2 text-sm"
              >
                <option value="default">Padrão</option>
                <option value="price-asc">Preço: Menor para Maior</option>
                <option value="price-desc">Preço: Maior para Menor</option>
                <option value="title-asc">Título (A-Z)</option>
                <option value="title-desc">Título (Z-A)</option>
              </select>
            </div>
            {/* Preço Máximo */}
            <div>
               <label htmlFor="max-price" className="block text-sm font-medium text-gray-700 mb-1">
                Preço Máximo: R$ {filters.priceRange.max}
              </label>
              <input
                id="max-price"
                type="range"
                min="0"
                max="2000"
                step="50"
                value={filters.priceRange.max}
                onChange={(e) => setFilters(f => ({ ...f, priceRange: { ...f.priceRange, max: Number(e.target.value) }}))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
             {/* Status da Moldura */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Moldura</label>
              <select
                value={filters.frameStatus}
                onChange={(e) => setFilters(f => ({ ...f, frameStatus: e.target.value as FilterState['frameStatus'] }))}
                className="w-full border border-gray-300 rounded p-2 text-sm"
              >
                <option value="all">Todos</option>
                <option value="framed">Com Moldura</option>
                <option value="unframed">Sem Moldura</option>
              </select>
            </div>
            {/* Em Estoque */}
            <div className="flex items-center gap-2">
              <input
                id="in-stock"
                type="checkbox"
                checked={filters.inStockOnly}
                onChange={(e) => setFilters(f => ({ ...f, inStockOnly: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="in-stock" className="text-sm text-gray-700">Apenas produtos em estoque</label>
            </div>
          </div>

          <button
            className="mt-6 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => setIsFilterOpen(false)}
          >
            Ver Resultados
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 