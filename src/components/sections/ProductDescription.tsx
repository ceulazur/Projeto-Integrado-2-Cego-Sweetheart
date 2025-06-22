import React from 'react';

interface ProductDescriptionProps {
  description: string;
}

export const ProductDescription: React.FC<ProductDescriptionProps> = ({ description }) => {
  return (
    <section className="mt-8 w-64 max-w-full text-sm text-black min-h-[60px]">
      <h3 className="text-base font-bold">DESCRIÇÃO</h3>
      <div className="mt-3 font-light leading-relaxed">
        {description}
      </div>
    </section>
  );
}; 