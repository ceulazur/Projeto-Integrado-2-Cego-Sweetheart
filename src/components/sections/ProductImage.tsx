import React from 'react';

interface ProductImageProps {
  src: string;
  alt: string;
}

export const ProductImage: React.FC<ProductImageProps> = ({ src, alt }) => {
  return (
    <div className="overflow-hidden self-stretch px-8 border border-solid border-zinc-800 border-opacity-80 shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
      <img
        src={src}
        className="object-contain w-full aspect-[1.01]"
        alt={alt}
      />
    </div>
  );
}; 