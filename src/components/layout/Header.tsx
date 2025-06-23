import React from 'react';
import { useScrollTop } from '../../hooks/useScrollTop';
import { useAuth } from '../../contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '../ui/dropdown-menu';
import { Sheet, SheetTrigger, SheetContent } from '../ui/sheet';
import { Product } from '../../hooks/useProducts';

type Artist = {
  artistHandle: string;
  artistUsername: string;
  artistProfileImage: string;
};

export const Header: React.FC = () => {
  const navigateAndScroll = useScrollTop();
  const { user, isAuthenticated, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const frameRef = React.useRef<HTMLDivElement>(null);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [searchResults, setSearchResults] = React.useState<Product[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = React.useState(false);
  const [artists, setArtists] = React.useState<Artist[]>([]);
  const [filterMenuOpen, setFilterMenuOpen] = React.useState(false);
  const [artistMenuOpen, setArtistMenuOpen] = React.useState(false);
  const [selectedArtist, setSelectedArtist] = React.useState<Artist | null>(null);
  const searchRef = React.useRef<HTMLDivElement>(null);
  const serverUrl = "http://localhost:3000";

  const handlePedidos = () => {
    navigateAndScroll('/pedidos');
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
  const fetchArtists = async () => {
    try {
      const res = await fetch(`${serverUrl}/api/artists`);
      if (res.ok) {
        setArtists(await res.json());
      }
    } catch (e) {
      console.error('Erro ao buscar artistas', e);
    }
  };

  // Autosuggest com debounce
  React.useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      setIsDropdownVisible(false);
      return;
    }
    const timer = setTimeout(async () => {
      let url = `${serverUrl}/api/products/search?q=${encodeURIComponent(searchTerm)}`;
      if (selectedArtist?.artistHandle) {
        url += `&artist=${encodeURIComponent(selectedArtist.artistHandle)}`;
      }
      try {
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data);
          setIsDropdownVisible(data.length > 0);
        } else {
          setSearchResults([]);
          setIsDropdownVisible(false);
        }
      } catch {
        setSearchResults([]);
        setIsDropdownVisible(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, selectedArtist]);

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

  return (
    <header className="w-full bg-white">
      <div ref={frameRef} className="max-w-[480px] w-full mx-auto pl-0 pr-8 relative">
        {/* Barra superior */}
        <div className="flex justify-between items-center py-0.25">
          {/* Logo e nome */}
          <div 
            className="flex items-center space-x-1 cursor-pointer" 
            onClick={() => navigateAndScroll('/')}
          >
            <img
              src="/logo.svg"
              alt="CEGO Logo"
              className="w-16 h-16"
            />
            <div className="text-2xl font-bold">
              <span className="text-red-600 font-['MaryKate'] text-[30px] mt-2 inline-block">CEGO</span>{" "}
              <span className="text-blue-900 font-['MaryKate'] text-[30px] mt-2 inline-block">SWEETHEART</span>
            </div>
          </div>

          {/* Menu mobile e Menu */}
          <div className="flex items-center space-x-4">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <button onClick={() => setSidebarOpen(true)} aria-label="Abrir menu lateral">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </SheetTrigger>
              {sidebarOpen && (
                <>
                  {/* Overlay cobre exatamente do canto esquerdo do frame até o início da sidebar, agora mais à esquerda */}
                  <div className="fixed inset-y-0 z-40 bg-black/60" style={{ left: 'calc(50% - 256px)', width: '208px' }}></div>
                  {/* Sidebar encostada no canto direito do frame */}
                  <div className="fixed z-50 top-0 right-1/2 flex flex-col h-full w-72 max-w-full bg-white shadow-xl border-l border-gray-200" style={{ transform: 'translateX(240px)', maxWidth: '480px' }}>
                    <div className="bg-blue-900 text-white text-lg font-bold flex items-center justify-center px-6 py-4 relative">
                      <button onClick={() => setSidebarOpen(false)} aria-label="Fechar menu" className="absolute left-2 top-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white bg-blue-900 rounded-full p-1 shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      MENU
                    </div>
                    <nav className="flex-1 divide-y divide-gray-200 bg-white flex flex-col">
                      <a href="/catalogo" className="block px-6 py-4 text-xl hover:bg-gray-100">Catálogo</a>
                      <a href="/" className="block px-6 py-4 text-xl hover:bg-gray-100">Home</a>
                      <a href="/sobre" className="block px-6 py-4 text-xl hover:bg-gray-100">Sobre</a>
                      <a href="/artistas" className="block px-6 py-4 text-xl hover:bg-gray-100">Artistas</a>
                      <div className="mt-auto flex flex-col divide-y divide-gray-200">
                        <a href="/contato" className="block px-6 py-4 text-xl font-bold flex items-center gap-2 hover:bg-gray-100">
                          <img src="/email_icon.svg" alt="Contato" className="w-6 h-6 text-black" />
                          Contato
                        </a>
                        <a href="/ajuda" className="block px-6 py-4 text-xl font-bold flex items-center gap-2 hover:bg-gray-100">
                          <img src="/help_outline_icon.svg" alt="Ajuda" className="w-6 h-6 text-black" />
                          Ajuda
                        </a>
                        <a href="/politicas" className="block px-6 py-4 text-xl font-bold flex items-center gap-2 hover:bg-gray-100">
                          <img src="/bookmark_icon.svg" alt="Políticas" className="w-6 h-6 text-black" />
                          Políticas
                        </a>
                      </div>
                    </nav>
                  </div>
                </>
              )}
            </Sheet>
          </div>
        </div>

        {/* Linha divisória */}
        <div className="border-b-2 border-black"></div>

        {/* Barra de navegação */}
        <nav className="flex justify-between items-center py-4">
          {/* Ícone do carrinho */}
          <button className="text-blue-900 -mt-0.5">
            <img
              src="/cart-icon.svg"
              alt="Carrinho"
              className="w-5 h-5"
            />
          </button>

          {/* Botão Minha conta com Dropdown */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="text-sm text-blue-900 flex items-center space-x-1 font-inter font-bold focus:outline-none"
                >
                  <img
                    src="/chevron-down-icon.svg"
                    alt="Expandir menu"
                    className="w-4 h-4"
                  />
                  <span>{`Olá, ${user?.firstName}`}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[160px]">
                <DropdownMenuItem onClick={handlePedidos}>
                  Meus pedidos
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-700">
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <button
              className="text-sm text-blue-900 flex items-center space-x-1 font-inter font-bold"
              onClick={() => navigateAndScroll('/login')}
            >
              <img
                src="/chevron-down-icon.svg"
                alt="Expandir menu"
                className="w-4 h-4"
              />
              <span>Minha conta</span>
            </button>
          )}

          {/* Ícone de pesquisa */}
          <button className="text-blue-900" onClick={() => setSearchOpen(true)}>
            <img
              src="/search-icon.svg"
              alt="Pesquisar"
              className="w-5 h-5"
            />
          </button>
        </nav>

        {/* Overlay e modal de pesquisa */}
        {searchOpen && (
          <div className="fixed inset-0 z-50 flex justify-center items-start" style={{ pointerEvents: 'auto' }}>
            <div className="max-w-[480px] w-full h-full mx-auto bg-black/80 flex flex-col relative" style={{ pointerEvents: 'auto' }}>
              <button
                className="absolute right-4 top-4 z-10"
                onClick={() => setSearchOpen(false)}
                aria-label="Fechar pesquisa"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="flex flex-col items-center w-full mt-10 px-6">
                <img src="/logo.svg" alt="Logo" className="w-24 h-24 mb-4" />
                <div className="w-full flex flex-col gap-4" ref={searchRef}>
                  <div className="relative">
                    <button
                      className="flex items-center gap-2 text-white text-xl mb-2 px-2 py-1 bg-black/30 rounded hover:bg-black/50"
                      onClick={() => {
                        setFilterMenuOpen((v) => !v);
                        if (!artists.length) fetchArtists();
                      }}
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                      {selectedArtist ? (
                        <span>{selectedArtist.artistUsername || selectedArtist.artistHandle}</span>
                      ) : (
                        <span>Todas Categorias</span>
                      )}
                    </button>
                    {filterMenuOpen && (
                      <div className="absolute left-0 mt-2 w-56 bg-white rounded shadow-lg z-50 text-black">
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-gray-100"
                          onClick={() => {
                            setSelectedArtist(null);
                            setFilterMenuOpen(false);
                          }}
                        >
                          Todas Categorias
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center justify-between"
                          onClick={() => setArtistMenuOpen((v) => !v)}
                        >
                          Filtrar por artista
                          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                        </button>
                        {artistMenuOpen && (
                          <div className="ml-4 mt-1 border-l border-gray-200 pl-2">
                            {artists.map((artist) => (
                              <button
                                key={artist.artistHandle}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                                onClick={() => {
                                  setSelectedArtist(artist);
                                  setFilterMenuOpen(false);
                                  setArtistMenuOpen(false);
                                }}
                              >
                                <img src={artist.artistProfileImage} alt={artist.artistUsername} className="w-6 h-6 rounded-full" />
                                <span>{artist.artistUsername || artist.artistHandle}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded bg-transparent border-b border-white text-white text-2xl placeholder-white focus:outline-none"
                      placeholder={selectedArtist ? `Buscar em ${selectedArtist.artistUsername || selectedArtist.artistHandle}` : "Procurar por.."}
                      autoFocus
                      value={searchTerm}
                      onChange={e => {
                        setSearchTerm(e.target.value);
                        setIsDropdownVisible(true);
                      }}
                      onFocus={() => setIsDropdownVisible(searchResults.length > 0)}
                    />
                    {/* Autosuggest */}
                    {isDropdownVisible && (
                      <div className="absolute left-0 right-0 mt-1 bg-white rounded shadow-lg z-50 text-black max-h-80 overflow-y-auto" style={{top: '100%'}}>
                        {searchResults.length > 0 ? (
                          <ul>
                            {searchResults.map((product) => (
                              <li key={product.id}>
                                <div
                                  className="flex items-center gap-4 p-3 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => {
                                    setSearchOpen(false);
                                    setSearchTerm("");
                                    setIsDropdownVisible(false);
                                    navigateAndScroll(`/produto/${product.id}`);
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
                </div>
              </div>
              {/* Resultados da pesquisa (placeholder) */}
              <div className="flex-1"></div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
