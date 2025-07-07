import * as React from "react";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  title: string;
  artistHandle: string;
  price: string;
  imageUrl: string;
  shadowClass?: string;
  className?: string;
  productId?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  title,
  artistHandle,
  price,
  imageUrl,
  shadowClass = "shadow-[4px_4px_10px_rgba(0,0,0,1)]",
  className = "",
  productId
}) => {
  const navigate = useNavigate();

  const handleProductClick = () => {
    if (productId) {
      navigate(`/produto/${productId}`);
    } else {
      console.warn("ProductCard: productId não foi fornecido.");
      // Opcional: navegar para uma página de erro ou catálogo
    }
  };

  const handleBuyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Lógica para adicionar ao carrinho
    console.log(`Adicionando ${title} ao carrinho`);
  };

  return (
    <article 
      className={`flex flex-col pt-3.5 pb-7 border border-solid border-black border-opacity-60 min-h-[339px] w-[190px] ${shadowClass} ${className} cursor-pointer hover:shadow-lg transition-shadow`}
      onClick={handleProductClick}
    >
      <h3 className="text-2xl font-medium text-center text-red-600 truncate overflow-hidden whitespace-nowrap max-w-[90%] mx-auto block">
        {title}
      </h3>
      <div className="overflow-hidden self-center mt-2 max-w-full border-2 border-solid border-neutral-600 border-opacity-80 w-[158px]">
        <img
          src={imageUrl}
          className="object-contain w-full aspect-[0.91]"
          alt={`${title} artwork`}
        />
      </div>
      <p className="mt-2 text-sm text-center text-red-600">
        {artistHandle}
      </p>
      <p className="mt-2 text-sm font-extrabold text-center text-red-600">
        {price}
      </p>
      <button 
        className="gap-2.5 self-center px-12 py-2 mt-2 max-w-full text-xs font-medium text-white whitespace-nowrap bg-black rounded-3xl border border-solid border-zinc-600 min-h-[31px] w-[166px] hover:bg-gray-800 transition-colors"
        onClick={handleBuyClick}
      >
        COMPRAR
      </button>
    </article>
  );
}; 