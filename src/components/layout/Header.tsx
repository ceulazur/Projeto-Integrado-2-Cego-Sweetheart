import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="w-full bg-white">
      <div className="container mx-auto px-4">
        {/* Barra superior */}
        <div className="flex justify-between items-center py-4">
          {/* Logo e nome */}
          <div className="flex items-center space-x-2">
            <img
              src="/logo.png"
              alt="CEGO Logo"
              className="w-12 h-12"
            />
            <div className="text-2xl font-bold">
              <span className="text-red-600">CEGO</span>
              <span className="text-blue-900">SWEETHEART</span>
            </div>
          </div>

          {/* Menu mobile e Minha conta */}
          <div className="flex items-center space-x-4">
            <button className="text-sm text-blue-900 flex items-center space-x-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <span>Minha conta</span>
            </button>
            <button className="lg:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Linha divisória */}
        <div className="border-b-2 border-black"></div>

        {/* Barra de navegação */}
        <nav className="flex justify-between items-center py-2">
          {/* Botão de menu com ícone */}
          <button className="bg-blue-900 p-1 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>

          {/* Área de busca (opcional, conforme imagem) */}
          <div className="flex-1"></div>
        </nav>
      </div>
    </header>
  );
};
