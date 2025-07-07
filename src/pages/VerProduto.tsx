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

export const VerProduto: React.FC = () => {
  const [selectedSize, setSelectedSize] = useState('P');
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { usuario } = useContext(UserContext);

  // Busca os dados do produto pelo ID da URL
  const { data: productData, isLoading, error } = useProduct(id || '');

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
  };

  const handleAddToCart = () => {
    if (!productData) return;
    // Busca o carrinho atual
    const stored = localStorage.getItem('cart');
    type CartItem = {
      id: string;
      title: string;
      price: string;
      imageUrl: string;
      quantity: number;
      category: string;
    };
    let cart: CartItem[] = [];
    if (stored) {
      try {
        cart = JSON.parse(stored);
      } catch { cart = []; }
    }
    // Verifica se o produto já está no carrinho
    const idx = cart.findIndex((item) => item.id === productData.id);
    if (idx >= 0) {
      cart[idx].quantity += 1;
        } else {
      const item: CartItem = {
        id: productData.id,
        title: productData.title,
        price: productData.price,
        imageUrl: productData.imageUrl,
        quantity: 1,
        category: productData.category || "Outro"
      };
      console.log('Adicionando ao carrinho:', item);
      cart.push(item);
        }
    localStorage.setItem('cart', JSON.stringify(cart));
    navigate('/carrinho');
  };

  const handleGoBack = () => {
    navigate('/catalogo');
  };

  if (isLoading) {
    return (
      <main className="flex overflow-hidden flex-col py-5 pr-1.5 mx-auto w-full bg-white max-w-[480px]">
        <Header />
        <div className="flex flex-col items-center mt-4 w-full">
          <p>Carregando produto...</p>
        </div>
      </main>
    );
  }

  if (error || !productData) {
    return (
      <main className="flex overflow-hidden flex-col py-5 pr-1.5 mx-auto w-full bg-white max-w-[480px]">
        <Header />
        <div className="flex flex-col items-center mt-4 w-full">
          <p className="text-red-600">Produto não encontrado ou erro ao carregar.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex overflow-hidden flex-col py-5 pr-1.5 mx-auto w-full bg-white max-w-[480px]">
      <Header />

      <div className="flex flex-col items-center mt-4 w-full">
        {/* Botão Voltar */}
        <button
          onClick={handleGoBack}
          className="self-start mb-4 px-4 py-2 text-sm font-medium text-blue-900 hover:text-blue-700 transition-colors"
        >
          ← Voltar ao Catálogo
        </button>

        <ProductImage
          src={productData.imageUrl}
          alt={`${productData.title} - Arte do artista ${productData.artistUsername}`}
        />

        <ProductInfo
          name={productData.title}
          price={productData.price}
        />

        <ArtistInfo
          username={productData.artistUsername}
          profileImage={productData.artistProfileImage}
        />

        <div className="shrink-0 self-stretch mt-2.5 h-px border border-black border-solid" />

        <ProductSpecs
          dimensions={productData.dimensions}
          framed={productData.framed}
        />

        <ProductDescription
          description={productData.description}
        />

        <ProductQuantity
          quantity={productData.quantity}
        />

        <section className="mt-2 w-64 max-w-full text-sm text-gray-700">
          <div>Categoria: <span className="font-bold text-black">{productData.category}</span></div>
        </section>
        {(productData.category === 'Camisa' || productData.category === 'Calça') && (
        <SizeSelector
          sizes={productData.availableSizes}
          defaultSize="P"
          onSizeChange={handleSizeChange}
        />
        )}

        <div className="flex justify-center w-full mt-4">
        <AddToCartButton 
          onAddToCart={handleAddToCart}
          disabled={productData.quantity === 0}
        />
        </div>
      </div>
    </main>
  );
};

export default VerProduto; 