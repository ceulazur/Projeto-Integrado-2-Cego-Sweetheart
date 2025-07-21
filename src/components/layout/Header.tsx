import React, { useEffect, useState } from 'react';
import { useScrollTop } from '../../hooks/useScrollTop';
import { useAuth, getCartKey } from '../../contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '../ui/dropdown-menu';
import { Sheet, SheetTrigger, SheetContent } from '../ui/sheet';
import { Product } from '../../hooks/useProducts';
import { useVendors } from '../../hooks/useVendors';
import { useProducts } from '../../hooks/useProducts';
import { ShoppingCartIcon, UserIcon, MagnifyingGlassIcon, Bars3Icon } from '@heroicons/react/24/outline';

type Artist = {
  artistHandle: string;
  artistUsername: string;
  artistProfileImage: string;
};

export const Header: React.FC = () => {
  const navigateAndScroll = useScrollTop();
  const { user, isAuthenticated, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [searchResults, setSearchResults] = React.useState<Product[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = React.useState(false);
  const [artists, setArtists] = React.useState<Artist[]>([]);
  const [filterMenuOpen, setFilterMenuOpen] = React.useState(false);
  const [artistMenuOpen, setArtistMenuOpen] = React.useState(false);
  const [selectedArtist, setSelectedArtist] = React.useState<Artist | null>(null);
  const searchRef = React.useRef<HTMLDivElement>(null);
  const { data: vendors } = useVendors();
  const { data: allProducts } = useProducts();
  const [artistProducts, setArtistProducts] = React.useState<Product[]>([]);
  const [cartCount, setCartCount] = useState(0);

  const handlePedidos = () => {
    navigateAndScroll('/historico-pedidos');
  };

  const handleLogout = () => {
    logout();
    navigateAndScroll('/');
  };

  const handleAdminClick = () => {
    navigateAndScroll('/admin');
  };

  // Função para travar/destravar o scroll do body
  React.useEffect(() => {
    if (sidebarOpen || searchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen, searchOpen]);

  // Buscar artistas ao abrir filtro
  React.useEffect(() => {
    if (vendors) {
      const uniqueArtists = vendors.map(vendor => ({
        artistHandle: vendor.email === 'ceulazur' ? '@ceulazur' : vendor.email === 'artemisia' ? '@artemisia' : '@admin',
        artistUsername: vendor.firstName + (vendor.lastName ? ' ' + vendor.lastName : ''),
        artistProfileImage: vendor.fotoUrl || '/placeholder.svg',
      }));
      setArtists(uniqueArtists);
      }
  }, [vendors]);

  // Atualiza produtos do artista ao selecionar
  React.useEffect(() => {
    if (selectedArtist && allProducts) {
      const filtered = allProducts.filter(p => p.artistHandle === selectedArtist.artistHandle);
      setArtistProducts(filtered);
    } else {
      setArtistProducts([]);
    }
  }, [selectedArtist, allProducts]);

  // Autosuggest com debounce
  React.useEffect(() => {
    if (!selectedArtist) {
      setSearchResults([]);
      setIsDropdownVisible(false);
      return;
    }
    if (searchTerm.trim() === "") {
      setSearchResults(artistProducts);
      setIsDropdownVisible(artistProducts.length > 0);
      return;
    }
    const timer = setTimeout(() => {
      const filtered = artistProducts.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filtered);
      setIsDropdownVisible(filtered.length > 0);
    }, 200);
    return () => clearTimeout(timer);
  }, [searchTerm, selectedArtist, artistProducts]);

  // Fechar dropdown ao clicar fora
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsDropdownVisible(false);
        setFilterMenuOpen(false);
        setArtistMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fechar autosuggest ao abrir menu de filtro
  React.useEffect(() => {
    if (filterMenuOpen || artistMenuOpen) {
      setIsDropdownVisible(false);
    }
  }, [filterMenuOpen, artistMenuOpen]);

  // Fechar menu de filtro ao abrir autosuggest
  React.useEffect(() => {
    if (isDropdownVisible) {
      setFilterMenuOpen(false);
      setArtistMenuOpen(false);
    }
  }, [isDropdownVisible]);

  useEffect(() => {
    function updateCartCount() {
      const stored = localStorage.getItem(getCartKey(user?.id));
      if (stored) {
        try {
          const cart = JSON.parse(stored);
          const count = Array.isArray(cart) ? cart.reduce((acc, item) => acc + (item.quantity || 1), 0) : 0;
          setCartCount(count);
        } catch {
          setCartCount(0);
        }
      } else {
        setCartCount(0);
      }
    }
    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    return () => window.removeEventListener('storage', updateCartCount);
  }, [user]);

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 sm:space-x-3 cursor-pointer min-w-0" 
            onClick={() => navigateAndScroll('/')}
          >
            <img
              src="/logo.svg"
              alt="CEGO Logo"
              className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0"
            />
            <div className="text-lg sm:text-xl font-bold truncate">
              <span className="text-red-600 font-['MaryKate']">CEGO</span>{" "}
              <span className="text-blue-900 font-['MaryKate']">SWEETHEART</span>
            </div>
          </div>

          {/* Navegação Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <a 
              href="/" 
              className="text-gray-700 hover:text-red-600 font-medium transition-colors"
            >
              Início
            </a>
            <a 
              href="/catalogo" 
              className="text-gray-700 hover:text-red-600 font-medium transition-colors"
            >
              Catálogo
            </a>
          </nav>

          {/* Ações do Usuário */}
          <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4">
            {/* Carrinho */}
            <button
              onClick={() => navigateAndScroll('/carrinho')}
              className="relative p-2 text-gray-700 hover:text-red-600 transition-colors"
            >
              <ShoppingCartIcon className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Usuário - só aparece no desktop/tablet */}
            {isAuthenticated ? (
              <div className="hidden md:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center space-x-2 p-2 text-gray-700 hover:text-red-600 transition-colors">
                      <UserIcon className="w-6 h-6" />
                      <span className="hidden lg:block font-medium truncate max-w-32">
                        {user?.firstName || 'Usuário'}
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={handlePedidos}>
                      Meus Pedidos
                    </DropdownMenuItem>
                    {user?.email === 'admin' && (
                      <DropdownMenuItem onClick={handleAdminClick}>
                        Painel Admin
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2 lg:space-x-3">
                <a 
                  href="/login"
                  className="text-gray-700 hover:text-red-600 font-medium transition-colors text-sm lg:text-base"
                >
                  Entrar
                </a>
                <a 
                  href="/register"
                  className="bg-red-600 text-white px-3 lg:px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors text-sm lg:text-base"
                >
                  Cadastrar
                </a>
              </div>
            )}

            {/* Menu Mobile - sempre visível no mobile */}
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <button className="md:hidden p-2 text-gray-700 hover:text-red-600 transition-colors">
                  <Bars3Icon className="w-6 h-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="py-6">
                  <h2 className="text-lg font-semibold mb-4">Menu</h2>
                  <nav className="space-y-2">
                    <a 
                      href="/" 
                      className="block py-2 text-gray-700 hover:text-red-600 transition-colors"
                      onClick={() => setSidebarOpen(false)}
                    >
                      Início
                    </a>
                    <a 
                      href="/catalogo" 
                      className="block py-2 text-gray-700 hover:text-red-600 transition-colors"
                      onClick={() => setSidebarOpen(false)}
                    >
                      Catálogo
                    </a>
                    <a 
                      href="/carrinho" 
                      className="block py-2 text-gray-700 hover:text-red-600 transition-colors"
                      onClick={() => setSidebarOpen(false)}
                    >
                      Carrinho ({cartCount})
                    </a>
                    {/* Meus Pedidos removido do menu mobile */}
                    {user?.email === 'admin' && (
                      <a 
                        href="/admin" 
                        className="block py-2 text-gray-700 hover:text-red-600 transition-colors"
                        onClick={() => setSidebarOpen(false)}
                      >
                        Painel Admin
                      </a>
                    )}
                  </nav>

                  {isAuthenticated ? (
                    <button
                      onClick={() => {
                        handleLogout();
                        setSidebarOpen(false);
                      }}
                      className="w-full mt-6 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Sair
                    </button>
                  ) : (
                    <div className="mt-6 space-y-2">
                      <a 
                        href="/login"
                        className="block w-full text-center py-2 text-gray-700 hover:text-red-600 transition-colors"
                        onClick={() => setSidebarOpen(false)}
                      >
                        Entrar
                      </a>
                      <a 
                        href="/register"
                        className="block w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors text-center"
                        onClick={() => setSidebarOpen(false)}
                      >
                        Cadastrar
                      </a>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};
