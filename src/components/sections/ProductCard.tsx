import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, getCartKey } from '../../contexts/AuthContext';

interface ProductCardProps {
  title: string;
  artistHandle: string;
  price: string;
  imageUrl: string;
  shadowClass?: string;
  className?: string;
  productId?: string;
  quantity?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  title,
  artistHandle,
  price,
  imageUrl,
  shadowClass = "shadow-lg",
  className = "",
  productId,
  quantity = 1
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleProductClick = () => {
    if (productId) {
      navigate(`/produto/${productId}`);
    } else {
      console.warn("ProductCard: productId não foi fornecido.");
    }
  };

  const handleBuyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user?.id) {
      navigate('/login');
      return;
    }
    if (!productId) return;
    
    const item = {
      id: productId,
      title,
      price,
      imageUrl,
      quantity: 1,
      category: '',
    };
    
    const cartKey = getCartKey(user?.id);
    const stored = localStorage.getItem(cartKey);
    let cart: Array<{id: string, title: string, price: string, imageUrl: string, quantity: number, category: string}> = [];
    if (stored) {
      try {
        cart = JSON.parse(stored);
      } catch {
        cart = [];
      }
    }
    
    const idx = cart.findIndex((p) => p.id === productId);
    if (idx >= 0) {
      cart[idx].quantity += 1;
    } else {
      cart.push(item);
    }
    localStorage.setItem(cartKey, JSON.stringify(cart));
    navigate('/carrinho');
  };

  return (
    <article 
      className={`flex flex-col h-full bg-white rounded-xl overflow-hidden ${shadowClass} ${className} cursor-pointer transition-all duration-300 hover:shadow-xl group`}
      onClick={handleProductClick}
    >
      {/* Imagem do Produto */}
      <div className="relative overflow-hidden aspect-square">
        <img
          src={imageUrl}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          alt={`${title} artwork`}
        />
        {quantity <= 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold text-lg">SEM ESTOQUE</span>
          </div>
        )}
      </div>

      {/* Informações do Produto */}
      <div className="flex flex-col flex-grow p-4 space-y-3">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-red-600 transition-colors">
          {title}
        </h3>
        
        <p className="text-sm text-gray-600 font-medium">
          {artistHandle}
        </p>
        
        <div className="flex items-center justify-between mt-auto">
          <p className="text-xl font-bold text-red-600">
            {price}
          </p>
          
          <button 
            className={`px-4 py-2 text-sm font-semibold text-white rounded-lg transition-all duration-200 ${
              quantity > 0 
                ? 'bg-red-600 hover:bg-red-700 hover:scale-105' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
            onClick={quantity > 0 ? handleBuyClick : undefined}
            disabled={quantity <= 0}
          >
            {quantity > 0 ? 'Comprar' : 'Indisponível'}
          </button>
        </div>
      </div>
    </article>
  );
}; 