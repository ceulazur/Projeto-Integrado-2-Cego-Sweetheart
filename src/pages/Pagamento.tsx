import React, { useState, useEffect } from 'react';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';

interface CartItem {
  id: string;
  title: string;
  price: string;
  imageUrl: string;
  quantity: number;
  category: string;
}

const paymentMethods = [
  {
    id: 'boleto',
    icon: 'https://cdn.builder.io/api/v1/image/assets/c9e61df7bfe543a0b7e24feda3172117/6293456d304eb962e81e1178c7f815d62d47f6de?placeholderIfAbsent=true',
    title: 'Boleto Bancário',
    discount: '5% de desconto',
  },
  {
    id: 'pix',
    icon: 'https://cdn.builder.io/api/v1/image/assets/c9e61df7bfe543a0b7e24feda3172117/3f2b7db6ded9ed397bf5378abd6bbba4a02472f0?placeholderIfAbsent=true',
    title: 'PIX',
    discount: '3% de desconto',
  },
  {
    id: 'credit-card',
    icon: 'https://cdn.builder.io/api/v1/image/assets/c9e61df7bfe543a0b7e24feda3172117/afa9c7a4f3b4bc7e5964b4e96820b5c8653f4624?placeholderIfAbsent=true',
    title: 'Cartão De Credito',
    discount: '5% de desconto',
  },
];

const DEFAULT_FRETE = 52.72;

const Pagamento: React.FC = () => {
  const [selected, setSelected] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [frete, setFrete] = useState(DEFAULT_FRETE);

  useEffect(() => {
    const stored = localStorage.getItem('cart');
    if (stored) {
      try {
        setCart(JSON.parse(stored));
      } catch {
        setCart([]);
      }
    }
    const storedFrete = localStorage.getItem('selectedFrete');
    if (storedFrete && !isNaN(Number(storedFrete))) {
      setFrete(Number(storedFrete));
    } else {
      setFrete(DEFAULT_FRETE);
    }
  }, []);

  const subtotal = cart.reduce((acc, item) => acc + (parseFloat(item.price.replace('R$', '').replace(',', '.')) * item.quantity), 0);
  const total = subtotal + frete;

  function handleFinish(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    if (selected === 'credit-card') {
      window.location.href = '/pagamento-cartao';
      return;
    }
    // Aqui pode ser feita a lógica de finalização
    alert('Compra finalizada!');
  }

  return (
    <main className="relative mx-auto my-0 w-full min-h-screen bg-white max-w-[480px] flex flex-col items-stretch text-2xl font-normal pt-4 pb-[122px]">
      <Header />
      <div className="z-10 w-full text-black font-medium -mt-2.5 px-[5px]">
        <div className="mt-[30px]">
          <img
            src="/checkout-banner.svg"
            alt="Banner checkout"
            className="aspect-[2.08] object-contain w-full rounded-[20px]"
          />
        </div>
      </div>
      <nav className="mb-5 text-sm font-light text-black max-sm:text-xs px-4 mt-[17px]">
        <span className="font-normal text-zinc-500">Entrega &gt; </span>
        <span className="font-bold text-black">Pagamento</span>
      </nav>
      <div className="px-4">
        <h2 className="text-3xl font-bold mb-2 text-black">Pagamento por</h2>
        <div className="flex flex-col gap-4 mb-8">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              type="button"
              onClick={() => setSelected(method.id)}
              className={`border flex w-full flex-col overflow-hidden items-stretch justify-center px-[11px] py-[5px] rounded-[20px] border-[rgba(96,96,96,1)] border-solid transition-all duration-150
                ${selected === method.id ? 'border-2 border-black bg-zinc-100' : ''}`}
              aria-pressed={selected === method.id}
            >
              <div className="flex w-full items-center gap-[40px_100px] justify-between text-left">
                <div className="flex gap-[11px] my-auto">
                  <img
                    src={method.icon}
                    className="aspect-[1] object-contain w-9 shrink-0"
                    alt={`${method.title} icon`}
                  />
                  <div className="flex flex-col items-stretch">
                    <div className="text-2xl font-semibold">
                      {method.title}
                    </div>
                    <div className="text-xl font-normal z-10 mt-[-5px]">
                      {method.discount}
                    </div>
                  </div>
                </div>
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/c9e61df7bfe543a0b7e24feda3172117/f7dc1d7f2d2c31115f5e1c59702190a167dae1e8?placeholderIfAbsent=true"
                  className="aspect-[1] object-contain w-9 self-stretch shrink-0 my-auto"
                  alt={selected === method.id ? "Selecionado" : "Não selecionado"}
                />
              </div>
            </button>
          ))}
        </div>
        <Card className="p-5 mb-10 rounded-3xl border border-black border-solid bg-white bg-opacity-90">
          {cart.length > 0 && (
            <div className="flex flex-col gap-4 pb-5 mb-5 border-b border-solid border-b-black border-b-opacity-20">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <img src={item.imageUrl} alt={item.title} className="shrink-0 rounded-lg h-[75px] w-[59px] object-cover bg-gray-200" />
                  <div>
                    <h3 className="mb-1.5 text-base">{item.title}</h3>
                    <p className="text-base text-stone-500">x {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="flex justify-between mb-2.5">
            <span>Subtotal</span>
            <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
          </div>
          <div className="flex justify-between mb-5">
            <span>Custo de frete</span>
            <span>R$ {frete.toFixed(2).replace('.', ',')}</span>
          </div>
          <div className="flex justify-between pt-2.5 text-lg font-semibold border-t border-solid border-t-black border-t-opacity-20">
            <span>Total</span>
            <span>R$ {total.toFixed(2).replace('.', ',')}</span>
          </div>
        </Card>
        <Button
          type="button"
          className="w-full bg-black text-white rounded-2xl py-5 text-2xl font-semibold mt-2 focus:ring-black focus:border-black"
          disabled={!selected}
          onClick={handleFinish}
        >
          FINALIZAR COMPRA
        </Button>
      </div>
    </main>
  );
};

export default Pagamento; 