import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { ProductImage } from '../components/sections/ProductImage';
import { ProductInfo } from '../components/sections/ProductInfo';
import { ArtistInfo } from '../components/sections/ArtistInfo';
import { ProductSpecs } from '../components/sections/ProductSpecs';
import { SizeSelector } from '../components/sections/SizeSelector';
import { AddToCartButton } from '../components/sections/AddToCartButton';

export const VerProduto: React.FC = () => {
  const [selectedSize, setSelectedSize] = useState('P');
  const navigate = useNavigate();

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
  };

  const handleAddToCart = () => {
    console.log(`Adicionando ao carrinho: Vulk, tamanho ${selectedSize}`);
    // Add your cart logic here
  };

  const handleGoBack = () => {
    navigate('/catalogo');
  };

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
          src="https://cdn.builder.io/api/v1/image/assets/c9e61df7bfe543a0b7e24feda3172117/8089281b600c138ef3c690b239ad0cdd8f3e8ff7?placeholderIfAbsent=true"
          alt="Vulk - Arte do artista @Ceulazur"
        />

        <ProductInfo
          name="Vulk"
          price="R$ 50.00"
        />

        <ArtistInfo
          username="@Ceulazur"
          profileImage="https://cdn.builder.io/api/v1/image/assets/c9e61df7bfe543a0b7e24feda3172117/235d1fa082185e9c963e83352ff5b3b837f0f7e2?placeholderIfAbsent=true"
        />

        <div className="shrink-0 self-stretch mt-2.5 h-px border border-black border-solid" />

        <ProductSpecs
          dimensions="20x20 cm"
          framed={true}
        />

        <SizeSelector
          sizes={['P', 'M', 'G']}
          defaultSize="P"
          onSizeChange={handleSizeChange}
        />

        <AddToCartButton onAddToCart={handleAddToCart} />
      </div>
    </main>
  );
};

export default VerProduto; 