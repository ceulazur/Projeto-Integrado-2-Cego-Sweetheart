import React from "react";
import { ActionButton } from "./ActionButton";

export const ContentSection = () => {
  return (
    <section className="mt-2.5">
      <div className="flex flex-col relative aspect-[2.08] w-[389px] max-w-full text-[15px] text-white font-bold whitespace-nowrap mt-2.5 pt-[85px] pb-12 px-0.5">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/c9e61df7bfe543a0b7e24feda3172117/ddc1f9ea31b7878961ee5f50ef9bc293b936e634?placeholderIfAbsent=true"
          alt="Background"
          className="absolute h-full w-full object-cover inset-0"
        />
        <h1>
          Criativo
          <br />
          Autentico
          <br />
          Belo
        </h1>
      </div>
      <div className="flex items-stretch gap-[11px] mt-2.5">
        <div className="flex flex-col items-stretch flex-1">
          <div className="z-10 flex min-h-[219px] items-center gap-2.5 overflow-hidden text-[15px] text-[rgba(27,30,132,1)] font-bold">
            <p className="w-[165px] my-auto">
              A Cego Sweetheart é uma loja online que abraça artistas e seus
              produtos únicos no intuito de vender aos nossos clientes estilo,
              autenticidade e beleza.
            </p>
          </div>
          <ActionButton variant="primary">Comprar agora</ActionButton>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/c9e61df7bfe543a0b7e24feda3172117/30381b65f68a5cdf3e4d6e9322c556ef33feb71f?placeholderIfAbsent=true"
            alt="Product"
            className="aspect-[0.88] object-contain w-[191px] mt-[11px]"
          />
        </div>
        <div className="flex flex-col items-stretch text-[rgba(245,0,0,1)] flex-1">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/c9e61df7bfe543a0b7e24feda3172117/d4b5f1a4b33802df94177bff8c0305f781b737ef?placeholderIfAbsent=true"
            alt="Product"
            className="aspect-[0.86] object-contain w-[189px]"
          />
          <div className="flex h-[180px] items-center gap-2.5 overflow-hidden text-[15px] font-bold w-[180px] mt-[11px]">
            <p className="w-[165px] my-auto">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation.
            </p>
          </div>
          <ActionButton variant="secondary">Acompanhar pedido</ActionButton>
        </div>
      </div>
    </section>
  );
}; 