import React, { useState, useEffect } from 'react';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useAuth, getCartKey } from '../contexts/AuthContext';

interface CartItem {
  id: string;
  title: string;
  price: string;
  imageUrl: string;
  quantity: number;
  category: string;
}

interface FreteData {
  codigo: string;
  nome: string;
  preco: number;
  prazo: number;
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
  },
];

const DEFAULT_FRETE = 52.72;

const Pagamento: React.FC = () => {
  const [selected, setSelected] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [frete, setFrete] = useState(DEFAULT_FRETE);
  const [freteData, setFreteData] = useState<FreteData | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    // Carregar dados do carrinho
    const stored = localStorage.getItem(getCartKey(user?.id));
    if (stored) {
      try {
        setCart(JSON.parse(stored));
      } catch {
        setCart([]);
      }
    }

    // Carregar dados do frete (compatibilidade com formato antigo e novo)
    const storedFrete = localStorage.getItem('selectedFrete');
    if (storedFrete) {
      try {
        // Tentar parsear como JSON (novo formato)
        const parsedFrete = JSON.parse(storedFrete);
        if (parsedFrete && typeof parsedFrete === 'object' && parsedFrete.preco) {
          // Novo formato: objeto com dados completos
          setFrete(parsedFrete.preco);
          setFreteData(parsedFrete);
        } else {
          // Formato antigo: apenas número
          const freteNumber = Number(storedFrete);
          if (!isNaN(freteNumber)) {
            setFrete(freteNumber);
            setFreteData(null);
          } else {
            setFrete(DEFAULT_FRETE);
            setFreteData(null);
          }
        }
      } catch {
        // Se não conseguir parsear como JSON, tentar como número
        const freteNumber = Number(storedFrete);
        if (!isNaN(freteNumber)) {
          setFrete(freteNumber);
          setFreteData(null);
        } else {
          setFrete(DEFAULT_FRETE);
          setFreteData(null);
        }
      }
    } else {
      setFrete(DEFAULT_FRETE);
      setFreteData(null);
    }
  }, [user?.id]);

  const subtotal = cart.reduce((acc, item) => acc + (parseFloat(item.price.replace('R$', '').replace(',', '.')) * item.quantity), 0);
  const total = subtotal + frete;

  // Cálculo do desconto conforme método selecionado
  let descontoPercent = 0;
  if (selected === 'boleto') descontoPercent = 5;
  if (selected === 'pix') descontoPercent = 3;
  const descontoValor = ((subtotal + frete) * descontoPercent) / 100;
  const totalComDesconto = (subtotal + frete) - descontoValor;

  function handleFinish(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    if (selected === 'credit-card') {
      window.location.href = '/pagamento-cartao';
      return;
    }
    if (selected === 'pix') {
      window.location.href = '/pagamento-pix';
      return;
    }
    // Aqui pode ser feita a lógica de finalização
    alert('Compra finalizada!');
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />
      
      {/* Container principal responsivo */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Banner */}
        <div className="mb-8">
          <img
            src="/checkout-banner.svg"
            alt="Banner checkout"
            className="w-full max-w-4xl mx-auto rounded-2xl shadow-lg"
          />
        </div>

        {/* Breadcrumb */}
        <nav className="mb-8 text-lg font-medium text-gray-600 max-w-4xl mx-auto">
          <span className="text-gray-500">Entrega &gt; </span>
          <span className="font-bold text-black">Pagamento</span>
        </nav>

        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold mb-8 text-black">Pagamento por</h2>
          
          <div className="grid gap-6 mb-12">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                type="button"
                onClick={() => setSelected(method.id)}
                className={`border-2 flex w-full items-center justify-between p-6 rounded-2xl transition-all duration-200 hover:shadow-lg ${
                  selected === method.id 
                    ? 'border-black bg-gray-50 shadow-md' 
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
                aria-pressed={selected === method.id}
              >
                <div className="flex items-center gap-6">
                  <img
                    src={method.icon}
                    className="w-16 h-16 object-contain"
                    alt={`${method.title} icon`}
                  />
                  <div className="text-left">
                    <div className="text-2xl lg:text-3xl font-semibold mb-2">
                      {method.title}
                    </div>
                    <div className="text-lg lg:text-xl text-gray-600">
                      {method.discount || <span className="invisible">placeholder</span>}
                    </div>
                  </div>
                </div>
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                  selected === method.id 
                    ? 'border-black bg-black' 
                    : 'border-gray-300'
                }`}>
                  {selected === method.id && (
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  )}
                </div>
              </button>
            ))}
          </div>

          <Card className="p-8 mb-12 rounded-2xl border-2 border-gray-200 bg-white shadow-lg">
            {cart.length > 0 && (
              <div className="flex flex-col gap-6 pb-6 mb-6 border-b-2 border-gray-100">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-6 items-center">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="w-20 h-20 lg:w-24 lg:h-24 rounded-xl object-cover bg-gray-200 shadow-sm" 
                    />
                    <div className="flex-1">
                      <h3 className="text-xl lg:text-2xl font-semibold mb-2">{item.title}</h3>
                      <p className="text-lg text-gray-600">x {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="space-y-4 text-lg lg:text-xl">
              <div className="flex justify-between">
                <span className="font-medium">Subtotal</span>
                <span className="font-semibold">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Custo de frete{freteData ? ` (${freteData.nome})` : ''}</span>
                <span className="font-semibold">R$ {frete.toFixed(2).replace('.', ',')}</span>
              </div>
              {descontoPercent > 0 && (
                <div className="flex justify-between text-green-600">
                  <span className="font-medium">Desconto ({descontoPercent}%)</span>
                  <span className="font-semibold">-R$ {descontoValor.toFixed(2).replace('.', ',')}</span>
                </div>
              )}
              <div className="flex justify-between pt-4 text-xl lg:text-2xl font-bold border-t-2 border-gray-200">
                <span>Total</span>
                <span>R$ {totalComDesconto.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
          </Card>

          <Button
            type="button"
            className="w-full bg-gradient-to-r from-black to-gray-800 text-white rounded-2xl py-6 text-2xl font-bold mt-8 hover:from-gray-800 hover:to-black transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            disabled={!selected}
            onClick={handleFinish}
          >
            CONTINUAR PAGAMENTO
          </Button>
        </div>
      </div>
    </main>
  );
};

export default Pagamento; 