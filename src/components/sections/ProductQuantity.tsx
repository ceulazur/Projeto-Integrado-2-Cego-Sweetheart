import React from 'react';

interface ProductQuantityProps {
  quantity: number;
}

export const ProductQuantity: React.FC<ProductQuantityProps> = ({ quantity }) => {
  const getQuantityText = (qty: number) => {
    if (qty === 0) return 'Esgotado';
    if (qty === 1) return 'Última unidade';
    if (qty <= 5) return `${qty} unidades restantes`;
    return `${qty} unidades disponíveis`;
  };

  const getQuantityColor = (qty: number) => {
    if (qty === 0) return 'text-red-600';
    if (qty <= 5) return 'text-orange-600';
    return 'text-green-600';
  };

  return (
    <section className="mt-6 w-64 max-w-full text-sm text-black min-h-[40px]">
      <h3 className="text-base font-bold">QUANTIDADE</h3>
      <div className={`mt-3 font-medium ${getQuantityColor(quantity)}`}>
        {getQuantityText(quantity)}
      </div>
    </section>
  );
}; 