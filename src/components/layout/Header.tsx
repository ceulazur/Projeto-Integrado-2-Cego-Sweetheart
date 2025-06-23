import React from 'react';
import { useScrollTop } from '../../hooks/useScrollTop';
import { useAuth } from '../../contexts/AuthContext';

export const Header: React.FC = () => {
  const navigateAndScroll = useScrollTop();
  const { user, isAuthenticated } = useAuth();

  const handleAccountClick = () => {
    if (isAuthenticated) {
      // TODO: Implementar menu de usuário
      console.log('Abrir menu de usuário');
    } else {
      navigateAndScroll('/login');
    }
  };

  const handleAdminClick = () => {
    navigateAndScroll('/admin');
  };

  return (
    <header className="w-full bg-white">
      <div className="max-w-[1000px] mx-auto pl-0 pr-8">
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
            <button>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
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

          {/* Botão Minha conta */}
          <button 
            className="text-sm text-blue-900 flex items-center space-x-1 font-inter font-bold"
            onClick={handleAccountClick}
          >
            <img
              src="/chevron-down-icon.svg"
              alt="Expandir menu"
              className="w-4 h-4"
            />
            <span>{isAuthenticated ? `Olá, ${user?.firstName}` : 'Minha conta'}</span>
          </button>

          {/* Link para Admin */}
          {isAuthenticated && (
            <button 
              className="text-sm text-purple-600 font-inter font-bold hover:text-purple-800 transition-colors"
              onClick={handleAdminClick}
            >
              Admin
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
