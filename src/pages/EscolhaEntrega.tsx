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
          <span className="font-bold text-black">Entrega</span> <span className="text-gray-500">&gt; Pagamento</span>
        </nav>

        <div className="max-w-4xl mx-auto">
          <section className="mb-12">
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
                  <span className="font-medium">Custo de frete</span>
                  <span className="font-semibold">R$ {frete.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between pt-4 text-xl lg:text-2xl font-bold border-t-2 border-gray-200">
                  <span>Total</span>
                  <span>R$ {total.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>
            </Card>
          </section>
          
          <section className="mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold mb-8 text-black">Entrega por</h2>
            
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-4 text-xl text-gray-600">Calculando frete...</span>
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-8">
                <p className="text-red-700 text-lg mb-4">{error}</p>
                <button
                  onClick={() => enderecoData && calcularFrete(enderecoData.cep)}
                  className="text-red-600 underline text-lg hover:text-red-800 transition-colors"
                >
                  Tentar novamente
                </button>
              </div>
            )}
            
            {!loading && !error && freteOptions.length > 0 && (
              <form className="space-y-6 mb-12">
                <fieldset>
                  <legend className="sr-only">Opções de entrega</legend>
                  {freteOptions.map((option, index) => (
                    <button
                      key={option.codigo}
                      type="button"
                      onClick={() => setSelected(option.codigo)}
                      className={`w-full border-2 flex items-center justify-between p-6 rounded-2xl transition-all duration-200 hover:shadow-lg mb-4 ${
                        selected === option.codigo 
                          ? 'border-blue-500 bg-blue-50 shadow-md' 
                          : 'border-gray-300 bg-white hover:border-gray-400'
                      }`}
                      aria-pressed={selected === option.codigo}
                    >
                      <div className="flex items-center gap-6">
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                          selected === option.codigo 
                            ? 'border-blue-500 bg-blue-500' 
                            : 'border-gray-300'
                        }`}>
                          {selected === option.codigo && (
                            <div className="w-4 h-4 bg-white rounded-full"></div>
                          )}
                        </div>
                        <div className="flex items-center gap-4">
                          <TruckIcon className="w-8 h-8 text-gray-600" />
                          <div className="text-left">
                            <div className="text-xl lg:text-2xl font-semibold mb-2">
                              {option.nome}
                            </div>
                            <div className="flex items-center gap-4 text-lg text-gray-600">
                              <div className="flex items-center gap-2">
                                <ClockIcon className="w-5 h-5" />
                                <span>{option.prazo} dias úteis</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl lg:text-3xl font-bold text-blue-600">
                          R$ {option.preco.toFixed(2).replace('.', ',')}
                        </div>
                      </div>
                    </button>
                  ))}
                </fieldset>
                
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-black to-gray-800 text-white rounded-2xl py-6 text-2xl font-bold hover:from-gray-800 hover:to-black transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  disabled={!selected}
                  onClick={handleContinue}
                >
                  CONTINUAR
                </Button>
              </form>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default EscolhaEntrega; 