import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { ProductImage } from '../components/sections/ProductImage';
import { ProductInfo } from '../components/sections/ProductInfo';
import { ArtistInfo } from '../components/sections/ArtistInfo';
import { ProductSpecs } from '../components/sections/ProductSpecs';
import { ProductDescription } from '../components/sections/ProductDescription';
import { ProductQuantity } from '../components/sections/ProductQuantity';
import { SizeSelector } from '../components/sections/SizeSelector';
import { AddToCartButton } from '../components/sections/AddToCartButton';
import { useProduct, Product } from '../hooks/useProducts';
import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import { useAuth, getCartKey } from '../contexts/AuthContext';
import { FreteCalculator } from '../components/sections/FreteCalculator';

interface FreteOption {
  codigo: string;
  nome: string;
  preco: number;
  prazo: number;
}

export const VerProduto: React.FC = () => {
  const [selectedSize, setSelectedSize] = useState('P');
  const [selectedFrete, setSelectedFrete] = useState<FreteOption | null>(null);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { usuario } = useContext(UserContext);
  const { user } = useAuth();

  const { data: productData, isLoading, error } = useProduct(id || '');

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
  };

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(Math.max(1, Math.min(newQuantity, productData?.quantity || 1)));
  };

  const handleAddToCart = () => {
    if (!user?.id) {
      navigate('/login');
      return;
    }
    if (!productData) return;
    
    const stored = localStorage.getItem(getCartKey(user?.id));
    type CartItem = {
      id: string;
      title: string;
      price: string;
      imageUrl: string;
      quantity: number;
      category: string;
      size?: string;
    };
    let cart: CartItem[] = [];
    if (stored) {
      try {
        cart = JSON.parse(stored);
      } catch { cart = []; }
    }
    
    const idx = cart.findIndex((item) => item.id === productData.id);
    if (idx >= 0) {
      cart[idx].quantity += quantity;
    } else {
      const item: CartItem = {
        id: productData.id,
        title: productData.title,
        price: productData.price,
        imageUrl: productData.imageUrl,
        quantity,
        category: productData.category || "Outro",
        size: selectedSize
      };
      cart.push(item);
    }
    localStorage.setItem(getCartKey(user?.id), JSON.stringify(cart));
    navigate('/carrinho');
  };

  const handleGoBack = () => {
    navigate('/catalogo');
  };

  const handleFreteSelect = (frete: FreteOption) => {
    setSelectedFrete(frete);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="bg-white rounded-xl p-8">
            <div className="animate-pulse">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gray-200 h-96 rounded-lg"></div>
                <div className="space-y-4">
                  <div className="bg-gray-200 h-8 rounded w-3/4"></div>
                  <div className="bg-gray-200 h-6 rounded w-1/2"></div>
                  <div className="bg-gray-200 h-4 rounded w-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !productData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="bg-white rounded-xl p-8 text-center">
            <div className="text-red-500 text-lg mb-4">
              Produto não encontrado ou erro ao carregar.
            </div>
            <button
              onClick={handleGoBack}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              Voltar ao Catálogo
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalPrice = parseFloat(productData.price.replace('R$ ', '').replace(',', '.')) * quantity;
  const fretePrice = selectedFrete ? selectedFrete.preco : 0;
  const finalTotal = totalPrice + fretePrice;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
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
                <a href="/catalogo" className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                  Catálogo
                </a>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="ml-4 text-sm font-medium text-gray-500">{productData.title}</span>
              </div>
            </li>
          </ol>
        </nav>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Coluna da Esquerda - Imagem */}
            <div className="p-8">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={productData.imageUrl}
                  alt={`${productData.title} - Arte do artista ${productData.artistUsername}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Coluna da Direita - Informações */}
            <div className="p-8 bg-gray-50">
              <div className="space-y-6">
                {/* Título e Preço */}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {productData.title}
                  </h1>
                  <p className="text-2xl font-bold text-red-600">
                    {productData.price}
                  </p>
                </div>

                {/* Informações do Artista */}
                <div className="flex items-center space-x-4 p-4 bg-white rounded-lg">
                  <img
                    src={productData.artistProfileImage}
                    alt={productData.artistUsername}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{productData.artistUsername}</p>
                    <p className="text-sm text-gray-600">Artista</p>
                  </div>
                </div>

                {/* Especificações */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-lg">
                    <p className="text-sm text-gray-600">Dimensões</p>
                    <p className="font-semibold">{productData.dimensions}</p>
                  </div>
                  <div className="p-4 bg-white rounded-lg">
                    <p className="text-sm text-gray-600">Emoldurado</p>
                    <p className="font-semibold">{productData.framed ? 'Sim' : 'Não'}</p>
                  </div>
                </div>

                {/* Descrição */}
                <div className="p-4 bg-white rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Descrição</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {productData.description}
                  </p>
                </div>

                {/* Quantidade */}
                <div className="p-4 bg-white rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">Quantidade</span>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleQuantityChange(quantity - 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-semibold">{quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(quantity + 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {productData.quantity} unidades disponíveis
                  </p>
                </div>

                {/* Seletor de Tamanho (se aplicável) */}
                {(productData.category === 'Camisa' || productData.category === 'Calça') && (
                  <div className="p-4 bg-white rounded-lg">
                    <SizeSelector
                      sizes={productData.availableSizes}
                      defaultSize="P"
                      onSizeChange={handleSizeChange}
                    />
                  </div>
                )}

                {/* Calculadora de Frete */}
                <div className="p-4 bg-white rounded-lg">
                  <FreteCalculator
                    onFreteSelect={handleFreteSelect}
                    selectedFrete={selectedFrete}
                    cepOrigem="01001-000"
                  />
                </div>

                {/* Resumo do Pedido */}
                {selectedFrete && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-900 mb-3">
                      Resumo do Pedido
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Produto ({quantity}x):</span>
                        <span className="font-medium">{productData.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span className="font-medium">R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Frete ({selectedFrete.nome}):</span>
                        <span className="font-medium">
                          R$ {selectedFrete.preco.toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between font-semibold text-lg">
                          <span>Total:</span>
                          <span className="text-blue-600">
                            R$ {finalTotal.toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Botão de Comprar */}
                <button
                  onClick={handleAddToCart}
                  disabled={productData.quantity <= 0}
                  className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-colors ${
                    productData.quantity > 0
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  }`}
                >
                  {productData.quantity > 0 ? 'Adicionar ao Carrinho' : 'Produto Indisponível'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerProduto; 