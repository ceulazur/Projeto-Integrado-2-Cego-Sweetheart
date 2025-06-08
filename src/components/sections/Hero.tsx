import React from 'react';

export const Hero: React.FC = () => {
  return (
    <section className="flex flex-col relative aspect-[2.08] w-[425px] max-w-full text-[15px] text-white font-bold whitespace-nowrap mt-2.5 pt-[85px] pb-12 px-0.5">
      <img
        src="https://cdn.builder.io/api/v1/image/assets/c9e61df7bfe543a0b7e24feda3172117/ddc1f9ea31b7878961ee5f50ef9bc293b936e634?placeholderIfAbsent=true"
        alt="Hero background"
        className="absolute h-full w-full object-cover inset-0"
      />
      <div className="relative z-10">
        Criativo
        <br />
        Autentico
        <br />
        Belo
      </div>
    </section>
  );
};
