import React from 'react';

interface ProductInfoProps {
  name: string;
  price: string;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({ name, price }) => {
  return (
    <section className="self-stretch mt-3.5 text-4xl font-medium text-center text-red-600">
      <div>
        <h2 style={{fontSize: '36px'}}>{name}</h2>
        <br />
        <br />
        <p style={{fontWeight: 900, fontSize: '24px'}}>{price}</p>
      </div>
      <div className="mt-1.5 w-full border border-black border-solid min-h-px" />
    </section>
  );
}; 