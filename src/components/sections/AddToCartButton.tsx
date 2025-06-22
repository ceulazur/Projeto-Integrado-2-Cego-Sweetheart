import React from 'react';

interface AddToCartButtonProps {
  onAddToCart?: () => void;
  disabled?: boolean;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  onAddToCart,
  disabled = false
}) => {
  const handleClick = () => {
    if (!disabled && onAddToCart) {
      onAddToCart();
    }
  };

  return (
    <button
      className={`gap-2.5 self-stretch py-4 pr-7 pl-7 mt-16 max-w-full text-base font-medium text-white bg-black rounded-3xl border border-solid border-zinc-600 min-h-[49px] w-[262px] ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800 transition-colors'
      }`}
      onClick={handleClick}
      disabled={disabled}
    >
      ADICIONAR AO CARRINHO
    </button>
  );
}; 