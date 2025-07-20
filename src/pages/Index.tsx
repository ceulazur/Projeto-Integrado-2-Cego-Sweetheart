import React, { useState, useEffect } from 'react';
import { Header } from '../components/layout/Header';
import { InfoSection } from '../components/sections/InfoSection';
import { useScrollTop } from '../hooks/useScrollTop';
import { useProducts } from '../hooks/useProducts';
import { Product } from '../hooks/useProducts';

export default function Index() {
  const navigateAndScroll = useScrollTop();
  const { data: products, isLoading } = useProducts();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  // Seleciona 3 produtos em estoque para exibir
  useEffect(() => {
    if (products && products.length > 0) {
      const inStockProducts = products.filter(product => product.quantity > 0);
      const shuffled = inStockProducts.sort(() => 0.5 - Math.random());
      setFeaturedProducts(shuffled.slice(0, 3));
    }
  }, [products]);

  const handleProductClick = (productId: string) => {
    navigateAndScroll(`/produto/${productId}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section - Baseada na imagem de referência */}
      <section className="relative w-full bg-black text-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Coluna da Esquerda - Texto */}
            <div className="flex items-center p-8 lg:p-16">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                  <span className="block">Criativo.</span>
                  <span className="block">Autêntico.</span>
                  <span className="block">Belo.</span>
                </h1>
                <p className="text-xl lg:text-2xl text-gray-300 max-w-md">
                  Descubra arte única e produtos autênticos dos melhores artistas independentes.
                </p>
              </div>
            </div>

            {/* Coluna da Direita - Imagem Principal */}
            <div className="relative h-96 lg:h-auto lg:min-h-[700px]">
              <div className="relative h-full w-full flex items-center justify-center p-2 lg:p-6">
                <img
                  src="/tomate.png"
                  alt="Arte Tomate"
                  className="w-full h-full object-cover lg:object-contain max-w-none scale-110"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Descrição e Call to Action */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Coluna da Esquerda - Texto e Botão */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                  Arte Autêntica para sua Casa
                </h2>
                <p className="text-lg lg:text-xl text-red-600 font-semibold leading-relaxed">
                  A Cego Sweetheart é uma loja online que abraça artistas e seus 
                  produtos únicos no intuito de vender aos nossos clientes estilo, 
                  autenticidade e beleza.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Cada peça conta uma história única, criada com paixão e dedicação 
                  pelos melhores artistas independentes do Brasil.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => navigateAndScroll('/catalogo')}
                  className="bg-red-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-red-700 transition-colors transform hover:scale-105"
                >
                  COMPRE AGORA
                </button>
                <button 
                  onClick={() => navigateAndScroll('/historico-pedidos')}
                  className="border-2 border-red-600 text-red-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-red-600 hover:text-white transition-colors"
                >
                  Acompanhar Pedido
                </button>
              </div>
            </div>

            {/* Coluna da Direita - Produtos em Destaque */}
            <div className="grid grid-cols-3 gap-4">
              {isLoading ? (
                // Loading state
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
                ))
              ) : featuredProducts.length > 0 ? (
                // Produtos em destaque
                featuredProducts.map((product, index) => (
                  <div 
                    key={product.id}
                    className="aspect-square bg-white rounded-lg overflow-hidden shadow-lg cursor-pointer transform hover:scale-105 transition-transform duration-300 group"
                    onClick={() => handleProductClick(product.id)}
                  >
                    <div className="relative w-full h-full">
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:brightness-110 transition-all duration-300"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <h3 className="text-white text-sm font-semibold truncate">
                          {product.title}
                        </h3>
                        <p className="text-white text-xs opacity-90">
                          {product.price}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                // Fallback quando não há produtos
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <div className="text-2xl mb-2">🎨</div>
                      <p className="text-sm">Produto {index + 1}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Destaques */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Por que escolher a Cego Sweetheart?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Conectamos você diretamente aos artistas, garantindo autenticidade 
              e qualidade em cada peça.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow-lg">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Arte Autêntica</h3>
              <p className="text-gray-600">
                Cada peça é única e autenticada pelos próprios artistas.
              </p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-lg">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💝</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Estilo Único</h3>
              <p className="text-gray-600">
                Produtos que refletem sua personalidade e gosto único.
              </p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-lg">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Beleza Natural</h3>
              <p className="text-gray-600">
                Beleza que vem da autenticidade e criatividade dos artistas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Sobre Nós</h3>
              <p className="text-gray-300">
                A Cego Sweetheart valoriza cada artista parceiro e seus trabalhos únicos, 
                trazendo arte autêntica direto para sua casa.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Contato</h3>
              <p className="text-gray-300">
                Email: contato@cegosweetheart.com<br />
                Tel: (11) 99999-9999
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Redes Sociais</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white">Instagram</a>
                <a href="#" className="text-gray-300 hover:text-white">Facebook</a>
                <a href="#" className="text-gray-300 hover:text-white">Twitter</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 Cego Sweetheart. Todos os direitos reservados.</p>
          </div>
      </div>
      </footer>
    </div>
  );
}
