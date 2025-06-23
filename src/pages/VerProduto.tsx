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
import { useProduct } from '../hooks/useProducts';
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

  const handleAddToCart = async () => {
    if (!usuario) {
      alert('Você precisa estar logado para comprar.');
      navigate('/login');
      return;
    }
    if (productData) {
      try {
        const res = await fetch('http://localhost:3000/api/pedidos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            clienteNome: usuario.nome,
            clienteId: usuario.id,
            produtoId: productData.id,
            produtoNome: productData.title,
            formaPagamento: 'Pix',
          })
        });
        const data = await res.json();
        if (res.ok) {
          alert('Pedido realizado com sucesso!');
        } else {
          alert(data.error || 'Erro ao criar pedido');
        }
      } catch (e) {
        alert('Erro ao conectar com o servidor.');
      }
    }
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