import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { ProductImage } from '../components/sections/ProductImage';
import { ProductInfo } from '../components/sections/ProductInfo';
import { ArtistInfo } from '../components/sections/ArtistInfo';
import { ProductSpecs } from '../components/sections/ProductSpecs';
import { ProductDescription } from '../components/sections/ProductDescription';
import { ProductQuantity } from '../components/sections/ProductQuantity';
import { SizeSelector } from '../components/sections/SizeSelector';
import { AddToCartButton } from '../components/sections/AddToCartButton';

// Interface para os dados do produto (preparado para futura integração com banco)
interface ProductData {
  id: string;
  name: string;
  price: string;
  description: string;
  quantity: number;
  dimensions: string;
  framed: boolean;
  artistUsername: string;
  artistProfileImage: string;
  productImage: string;
  availableSizes: string[];
}

export const VerProduto: React.FC = () => {
  const [selectedSize, setSelectedSize] = useState('P');
  const navigate = useNavigate();

  // Dados mockados do produto (no futuro virão do banco de dados)
  const productData: ProductData = {
    id: "1",
    name: "Vulk",
    price: "R$ 50.00",
    description: "Uma obra de arte única que combina elementos modernos com técnicas tradicionais. Esta peça exclusiva do artista @Ceulazur representa a fusão entre o urbano e o natural, criando uma experiência visual impactante que transforma qualquer ambiente.",
    quantity: 8,
    dimensions: "20x20 cm",
    framed: true,
    artistUsername: "@Ceulazur",
    artistProfileImage: "https://cdn.builder.io/api/v1/image/assets/c9e61df7bfe543a0b7e24feda3172117/235d1fa082185e9c963e83352ff5b3b837f0f7e2?placeholderIfAbsent=true",
    productImage: "https://cdn.builder.io/api/v1/image/assets/c9e61df7bfe543a0b7e24feda3172117/8089281b600c138ef3c690b239ad0cdd8f3e8ff7?placeholderIfAbsent=true",
    availableSizes: ['P', 'M', 'G']
  };

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
  };

  const handleAddToCart = () => {
    console.log(`Adicionando ao carrinho: ${productData.name}, tamanho ${selectedSize}`);
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
          src={productData.productImage}
          alt={`${productData.name} - Arte do artista ${productData.artistUsername}`}
        />

        <ProductInfo
          name={productData.name}
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

        <SizeSelector
          sizes={productData.availableSizes}
          defaultSize="P"
          onSizeChange={handleSizeChange}
        />

        <AddToCartButton 
          onAddToCart={handleAddToCart}
          disabled={productData.quantity === 0}
        />
      </div>
    </main>
  );
};

export default VerProduto; 