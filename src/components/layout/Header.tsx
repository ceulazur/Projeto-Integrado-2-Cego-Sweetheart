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

export const Header: React.FC = () => {
  const navigateAndScroll = useScrollTop();
  const { user, isAuthenticated, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const frameRef = React.useRef<HTMLDivElement>(null);

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
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

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
          <button className="text-blue-900">
            <img
              src="/search-icon.svg"
              alt="Pesquisar"
              className="w-5 h-5"
            />
          </button>
        </nav>
      </div>
    </header>
  );
};
