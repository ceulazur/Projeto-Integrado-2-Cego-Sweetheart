import * as React from "react";
import { Header } from "../components/layout/Header";
import { CatalogSection } from "../components/sections/CatalogSection";

interface CatalogoProps {
  className?: string;
}

const Catalogo: React.FC<CatalogoProps> = ({ className = "" }) => {
  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      <Header />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <a href="/" className="text-gray-500 hover:text-gray-700">
                  Início
                </a>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-4 text-sm font-medium text-gray-500">Catálogo</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-8">
        <CatalogSection />
      </main>

      {/* Newsletter Section */}
      <section className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Fique por dentro das novidades
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Receba notificações sobre novos artistas, peças exclusivas e ofertas especiais.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Seu melhor email"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <button className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors">
                Inscrever
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Catalogo; 