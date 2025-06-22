import React from 'react';

interface ProductSpecsProps {
  dimensions: string;
  framed: boolean;
}

export const ProductSpecs: React.FC<ProductSpecsProps> = ({ dimensions, framed }) => {
  return (
    <section className="mt-11 w-64 max-w-full text-sm text-black min-h-[86px]">
      <h3 className="text-base font-bold">ESPECIFICAÇÕES</h3>
      <div className="mt-5 font-medium">
        <span style={{fontWeight: 300}}>Dimensões:</span>{' '}
        <span style={{fontWeight: 900}}>{dimensions}</span>
      </div>
      <div className="mt-5 font-light">
        Enquadrado: <span style={{fontWeight: 900}}>{framed ? 'Sim' : 'Não'}</span>
      </div>
    </section>
  );
}; 