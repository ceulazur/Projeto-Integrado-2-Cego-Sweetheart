import React, { useState, useEffect } from 'react';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';

const deliveryOptions = [
  {
    id: 'pac',
    name: 'PAC Promocional',
    description: 'Chega segunda-feira 02/06',
    price: 39.90,
  },
  {
    id: 'sedex',
    name: 'SEDEX Promocional',
    description: 'Chega segunda-feira 02/06',
    price: 59.90,
  },
  {
    id: 'nuvem',
    name: 'Nuvem',
    description: 'Chega segunda-feira 02/06',
    price: 35.00,
  },
];

interface CartItem {
  id: string;
  title: string;
  price: string;
  imageUrl: string;
  quantity: number;
  category: string;
}

const EscolhaEntrega: React.FC = () => {
  const [selected, setSelected] = useState('sedex');
  const [cart, setCart] = useState<CartItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('cart');
    if (stored) {
      try {
        setCart(JSON.parse(stored));
      } catch {
        setCart([]);
      }
    }
  }, []);

  const selectedOption = deliveryOptions.find(opt => opt.id === selected) || deliveryOptions[0];
  const frete = selectedOption.price;
  const subtotal = cart.reduce((acc, item) => acc + (parseFloat(item.price.replace('R$', '').replace(',', '.')) * item.quantity), 0);
  const total = subtotal + frete;

  function handleContinue(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    localStorage.setItem('selectedFrete', frete.toString());
    navigate('/pagamento');
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
        <span className="font-bold text-black">Entrega</span> <span className="font-normal text-zinc-500">&gt; Pagamento</span>
      </nav>
      <section className="px-4 mb-10">
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
      </section>
      <section className="px-4">
        <h2 className="text-4xl font-bold mb-6 text-black">Entrega por</h2>
        <form className="bg-[rgba(70,70,70,0)] border overflow-hidden pb-[13px] px-[5px] rounded-[20px] border-[rgba(96,96,96,1)] border-solid mb-8">
          <fieldset>
            <legend className="sr-only">Opções de entrega</legend>
            {deliveryOptions.map((option, index) => (
              <div
                key={option.id}
                className={`flex min-h-[57px] w-full items-center gap-[40px_50px] justify-between ${index > 0 ? 'mt-[11px]' : ''} ${index === 2 ? 'pb-2' : ''}`}
              >
                <div className={`self-stretch flex items-stretch gap-2.5 my-auto ${index === 0 ? 'w-56 pr-3 pb-1.5' : index === 1 ? 'w-56 pb-1.5 px-0.5' : 'w-[227px] pb-[7px] px-0.5'}`}>
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="radio"
                      name="delivery"
                      value={option.id}
                      checked={selected === option.id}
                      onChange={() => setSelected(option.id)}
                      className="sr-only"
                    />
                    <div
                      className={`flex w-5 shrink-0 h-5 my-auto rounded-full border-black border-solid ${selected === option.id ? 'bg-black border' : 'bg-white border'}`}
                      aria-hidden="true"
                    />
                    <div className="flex flex-col items-stretch">
                      <div className="text-xl font-bold text-black">{option.name}</div>
                      <div className={`font-normal mt-${index === 2 ? '2' : '[7px]'} ${index === 2 ? 'text-[15px]' : 'text-sm'}`}>{option.description}</div>
                    </div>
                  </label>
                </div>
                <div className="text-xl font-bold text-right self-stretch my-auto text-black">R$ {option.price.toFixed(2).replace('.', ',')}</div>
              </div>
            ))}
          </fieldset>
        </form>
        <Button
          type="button"
          className="w-full bg-black text-white rounded-2xl py-5 text-2xl font-semibold mt-2 focus:ring-black focus:border-black"
          disabled={!selected}
          onClick={handleContinue}
        >
          CONTINUAR PARA PAGAMENTO
        </Button>
      </section>
    </main>
  );
};

export default EscolhaEntrega; 