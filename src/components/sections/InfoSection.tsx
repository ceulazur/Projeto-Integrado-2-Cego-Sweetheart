import React from 'react';
import { ActionButton } from '../ui/ActionButton';
import { useScrollTop } from '../../hooks/useScrollTop';

export const InfoSection: React.FC = () => {
  const navigateAndScroll = useScrollTop();

  return (
    <>
      <div className="w-full mt-4 ml-1">
        <img
          src="/homepage-hero.svg"
          alt="Hero illustration"
          className="w-[425px] aspect-[2.08] object-cover"
        />
      </div>
      
      <section className="flex items-stretch gap-[11px] mt-2.5">
        <div className="flex flex-col items-stretch flex-1">
          <div className="z-10 flex min-h-[219px] items-center gap-2.5 overflow-hidden text-[15px] text-[rgba(27,30,132,1)] font-bold">
            <div className="w-[165px] my-auto">
              A Cego Sweetheart é uma loja online que abraça artistas e seus
              produtos únicos no intuito de vender aos nossos clientes estilo,
              autenticidade e beleza.
            </div>
            <div className="self-stretch flex w-12 shrink-0 h-12 my-auto" />
          </div>
          <div>
            <ActionButton 
              variant="primary" 
              className="w-[180px] -ml-1 h-[40px] flex items-center justify-center"
              onClick={() => navigateAndScroll('/login')}
            >
              Comprar agora
            </ActionButton>
          </div>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/c9e61df7bfe543a0b7e24feda3172117/30381b65f68a5cdf3e4d6e9322c556ef33feb71f?placeholderIfAbsent=true"
            alt="Featured product"
            className="aspect-[0.88] object-contain w-[191px] mt-[11px]"
          />
        </div>
        <div className="flex flex-col items-stretch text-[rgba(245,0,0,1)] flex-1">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/c9e61df7bfe543a0b7e24feda3172117/d4b5f1a4b33802df94177bff8c0305f781b737ef?placeholderIfAbsent=true"
            alt="Product showcase"
            className="aspect-[0.86] object-contain w-[189px]"
          />
          <div className="z-10 flex min-h-[219px] items-center gap-2.5 overflow-hidden text-[15px] font-bold">
            <div className="w-[165px] my-auto">
              A Cego Sweetheart valoriza cada artista parceiro e seus
              trabalhos únicos, trazendo arte autêntica
              direto para sua casa.
            </div>
            <div className="self-stretch flex w-12 shrink-0 h-12 my-auto" />
          </div>
          <div className="-ml-2">
            <ActionButton 
              variant="secondary" 
              className="w-[200px] mt-4 h-[40px] flex items-center justify-center -ml-1"
              onClick={() => navigateAndScroll('/login')}
            >
              Acompanhar pedido
            </ActionButton>
          </div>
        </div>
      </section>
    </>
  );
};
