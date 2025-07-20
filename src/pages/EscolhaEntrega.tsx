import React, { useState, useEffect } from 'react';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth, getCartKey } from '../contexts/AuthContext';
import { TruckIcon, ClockIcon } from '@heroicons/react/24/outline';

interface FreteOption {
  codigo: string;
  nome: string;
  preco: number;
  prazo: number;
}

interface EnderecoData {
  street: string;
  city: string;
  cep: string;
  number: string;
  complement: string;
  cpfCnpj: string;
}

interface CartItem {
  id: string;
  title: string;
  price: string;
  imageUrl: string;
  quantity: number;
  category: string;
}

const EscolhaEntrega: React.FC = () => {
  const [selected, setSelected] = useState<string>('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [freteOptions, setFreteOptions] = useState<FreteOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [enderecoData, setEnderecoData] = useState<EnderecoData | null>(null);
  const navigate = useNavigate();
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

    // Carregar dados do endereço
    const enderecoStored = localStorage.getItem('enderecoEntrega');
    if (enderecoStored) {
      try {
        const endereco = JSON.parse(enderecoStored);
        setEnderecoData(endereco);
        calcularFrete(endereco.cep);
      } catch {
        setError('Erro ao carregar dados do endereço');
        setLoading(false);
      }
    } else {
      setError('Dados do endereço não encontrados');
      setLoading(false);
    }
  }, [user?.id]);

  const calcularFrete = async (cepDestino: string) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/frete/calcular', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cepOrigem: '01001-000', // CEP de São Paulo
          cepDestino: cepDestino.replace(/\D/g, ''),
          peso: 1000, // 1kg
          comprimento: 20,
          altura: 20,
          largura: 20
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setFreteOptions(data.servicos);
        if (data.servicos.length > 0) {
          setSelected(data.servicos[0].codigo);
        }
      } else {
        setError(data.error || 'Erro ao calcular frete');
      }
    } catch (error) {
      setError('Erro ao calcular frete');
    } finally {
      setLoading(false);
    }
  };

  const selectedOption = freteOptions.find(opt => opt.codigo === selected);
  const frete = selectedOption?.preco || 0;
  const subtotal = cart.reduce((acc, item) => acc + (parseFloat(item.price.replace('R$', '').replace(',', '.')) * item.quantity), 0);
  const total = subtotal + frete;

  function handleContinue(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    
    // Salvar dados do frete selecionado
    const freteData = {
      codigo: selectedOption?.codigo,
      nome: selectedOption?.nome,
      preco: selectedOption?.preco,
      prazo: selectedOption?.prazo
    };
    localStorage.setItem('selectedFrete', JSON.stringify(freteData));
    
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
        
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            <span className="ml-3 text-lg">Calculando frete...</span>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 text-sm">{error}</p>
            <button
              onClick={() => enderecoData && calcularFrete(enderecoData.cep)}
              className="mt-2 text-red-600 underline text-sm"
            >
              Tentar novamente
            </button>
          </div>
        )}
        
        {!loading && !error && freteOptions.length > 0 && (
        <form className="bg-[rgba(70,70,70,0)] border overflow-hidden pb-[13px] px-[5px] rounded-[20px] border-[rgba(96,96,96,1)] border-solid mb-8">
          <fieldset>
            <legend className="sr-only">Opções de entrega</legend>
              {freteOptions.map((option, index) => (
              <div
                  key={option.codigo}
                  className={`flex min-h-[57px] w-full items-center gap-[40px_50px] justify-between ${index > 0 ? 'mt-[11px]' : ''}`}
              >
                  <div className="self-stretch flex items-stretch gap-2.5 my-auto w-56 pr-3 pb-1.5">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="radio"
                      name="delivery"
                        value={option.codigo}
                        checked={selected === option.codigo}
                        onChange={() => setSelected(option.codigo)}
                      className="sr-only"
                    />
                    <div
                        className={`flex w-5 shrink-0 h-5 my-auto rounded-full border-black border-solid ${selected === option.codigo ? 'bg-black border' : 'bg-white border'}`}
                      aria-hidden="true"
                    />
                    <div className="flex flex-col items-stretch">
                        <div className="text-xl font-bold text-black flex items-center gap-2">
                          <TruckIcon className="w-5 h-5" />
                          {option.nome}
                        </div>
                        <div className="font-normal mt-[7px] text-sm flex items-center gap-1">
                          <ClockIcon className="w-4 h-4" />
                          {option.prazo} dia{option.prazo > 1 ? 's' : ''} úteis
                        </div>
                    </div>
                  </label>
                </div>
                  <div className="text-xl font-bold text-right self-stretch my-auto text-black">
                    R$ {option.preco.toFixed(2).replace('.', ',')}
                  </div>
              </div>
            ))}
          </fieldset>
        </form>
        )}
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