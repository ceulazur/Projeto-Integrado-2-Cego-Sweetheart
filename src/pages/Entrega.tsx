import React, { useState, useEffect } from 'react';
import { Header } from '../components/layout/Header';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useAuth, getCartKey } from '../contexts/AuthContext';

interface CartItem {
  id: string;
  title: string;
  price: string;
  imageUrl: string;
  quantity: number;
  category: string;
}

const FRETE = 0.00;

const Entrega: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [cep, setCep] = useState('');
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState('');
  const [enderecoCompleto, setEnderecoCompleto] = useState<{
    logradouro: string;
    bairro: string;
    localidade: string;
    uf: string;
  } | null>(null);
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const stored = localStorage.getItem(getCartKey(user?.id));
    if (stored) {
      try {
        setCart(JSON.parse(stored));
      } catch {
        setCart([]);
      }
    }
  }, [user?.id]);

  const subtotal = cart.reduce((acc, item) => acc + (parseFloat(item.price.replace('R$', '').replace(',', '.')) * item.quantity), 0);
  const total = subtotal + FRETE;

  // Função para aplicar máscara de CPF
  function maskCpf(value: string) {
    // Remove tudo que não for número
    value = value.replace(/\D/g, '');
    // Aplica a máscara
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    return value;
  }

  // Função para formatar CEP
  function formatarCep(value: string) {
    const cleanValue = value.replace(/\D/g, '');
    return cleanValue.replace(/^(\d{5})(\d{3})$/, '$1-$2');
  }

  // Função para buscar CEP
  const buscarCep = async (cepValue: string) => {
    if (cepValue.length !== 9) return;
    
    try {
      setCepLoading(true);
      setCepError('');
      
      const response = await fetch(`/api/cep/${cepValue.replace(/\D/g, '')}`);
      const data = await response.json();
      
      if (response.ok) {
        setEnderecoCompleto(data);
        setStreet(data.logradouro);
        setCity(data.localidade);
        setCepError('');
      } else {
        setCepError('CEP não encontrado');
        setEnderecoCompleto(null);
      }
    } catch (error) {
      setCepError('Erro ao buscar CEP');
      setEnderecoCompleto(null);
    } finally {
      setCepLoading(false);
    }
  };

  // Função para lidar com mudança do CEP
  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 9) {
      const formattedCep = formatarCep(value);
      setCep(formattedCep);
      
      if (formattedCep.length === 9) {
        buscarCep(formattedCep);
      } else {
        setCepError('');
        setEnderecoCompleto(null);
      }
    }
  };

  function handleContinue(e: React.FormEvent) {
    e.preventDefault();
    
    // Salvar dados do endereço no localStorage
    const enderecoData = {
      street,
      city,
      cep,
      number,
      complement,
      cpfCnpj
    };
    localStorage.setItem('enderecoEntrega', JSON.stringify(enderecoData));
    
    navigate('/escolha-entrega');
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
                  <span className="font-semibold">R$ {FRETE.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between pt-4 text-xl lg:text-2xl font-bold border-t-2 border-gray-200">
                  <span>Total</span>
                  <span>R$ {total.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>
            </Card>
          </section>
          
          <form className="flex flex-col gap-6" onSubmit={handleContinue} autoComplete="off">
            <h2 className="text-4xl lg:text-5xl font-bold text-black mb-8">Dados da entrega</h2>
            
            <div className="grid gap-6">
              <Input
                id="street"
                placeholder="Rua"
                value={street}
                onChange={e => setStreet(e.target.value)}
                required
                className="h-14 text-lg px-6 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
              />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Input
                  id="city"
                  placeholder="Cidade"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  required
                  disabled={enderecoCompleto !== null}
                  className="h-14 text-lg px-6 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 disabled:bg-gray-100"
                />
                
                <div className="relative">
                  <Input
                    id="cep"
                    placeholder="CEP"
                    value={cep}
                    onChange={handleCepChange}
                    required
                    maxLength={9}
                    className="h-14 text-lg px-6 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                  />
                  {cepLoading && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Input
                  id="number"
                  placeholder="Número"
                  value={number}
                  onChange={e => setNumber(e.target.value)}
                  required
                  className="h-14 text-lg px-6 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                />
                
                <Input
                  id="complement"
                  placeholder="Complemento (opcional)"
                  value={complement}
                  onChange={e => setComplement(e.target.value)}
                  className="h-14 text-lg px-6 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                />
              </div>
              
              <Input
                id="cpfCnpj"
                placeholder="CPF/CNPJ"
                value={cpfCnpj}
                onChange={e => setCpfCnpj(maskCpf(e.target.value))}
                required
                maxLength={14}
                className="h-14 text-lg px-6 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
              />
            </div>
            
            {cepError && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-red-700 text-lg">
                {cepError}
              </div>
            )}
            
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-black to-gray-800 text-white rounded-2xl py-6 text-2xl font-bold mt-8 hover:from-gray-800 hover:to-black transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              CONTINUAR
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Entrega; 