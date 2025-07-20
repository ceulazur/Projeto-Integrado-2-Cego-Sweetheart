import React from 'react';

export const ContentSection: React.FC = () => {
  return (
    <div className="space-y-16">
      {/* Destaques */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Por que escolher a Arte Única?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
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
              <span className="text-2xl">🚚</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Entrega Segura</h3>
            <p className="text-gray-600">
              Embalagem especializada para proteger sua arte durante o transporte.
            </p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💬</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Suporte Direto</h3>
            <p className="text-gray-600">
              Comunicação direta com os artistas para dúvidas e personalizações.
            </p>
          </div>
        </div>
      </section>

      {/* Estatísticas */}
      <section className="bg-red-600 text-white py-16 rounded-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-12">Nossos Números</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-red-100">Artistas</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">2000+</div>
              <div className="text-red-100">Peças Vendidas</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-red-100">Satisfação</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-red-100">Cidades</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Pronto para descobrir sua próxima peça favorita?
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Explore nosso catálogo e encontre a arte que fala com você.
        </p>
        <button className="bg-red-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-red-700 transition-colors">
          Ver Catálogo Completo
        </button>
      </section>
    </div>
  );
}; 