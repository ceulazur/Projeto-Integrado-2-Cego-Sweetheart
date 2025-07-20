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
      <nav className="mb-5 text-sm font-light text-black max-sm:text-xs px-4">
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
            <span>R$ {FRETE.toFixed(2).replace('.', ',')}</span>
          </div>
          <div className="flex justify-between pt-2.5 text-lg font-semibold border-t border-solid border-t-black border-t-opacity-20">
            <span>Total</span>
            <span>R$ {total.toFixed(2).replace('.', ',')}</span>
          </div>
        </Card>
      </section>
      <form className="flex flex-col gap-4 px-4" onSubmit={handleContinue} autoComplete="off">
        <h2 className="mb-6 text-4xl font-bold text-black max-sm:mb-5 max-sm:text-3xl">Dados da entrega</h2>
        <Input
          id="street"
          placeholder="Rua"
          value={street}
          onChange={e => setStreet(e.target.value)}
          required
        />
        <div className="flex gap-3.5 max-md:flex-col max-md:gap-2.5">
          <Input
            id="city"
            placeholder="Cidade"
            value={city}
            onChange={e => setCity(e.target.value)}
            required
            disabled={enderecoCompleto !== null}
          />
          <div className="relative">
          <Input
            id="cep"
            placeholder="CEP"
            value={cep}
              onChange={handleCepChange}
            required
              maxLength={9}
              inputMode="numeric"
            />
            {cepLoading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
              </div>
            )}
          </div>
        </div>
        
        {cepError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-800 text-sm">{cepError}</p>
          </div>
        )}
        
        {enderecoCompleto && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-green-800 text-sm">
              <strong>Endereço encontrado:</strong> {enderecoCompleto.logradouro}, {enderecoCompleto.bairro}, {enderecoCompleto.localidade} - {enderecoCompleto.uf}
            </p>
          </div>
        )}
        <div className="flex gap-3.5 max-md:flex-col max-md:gap-2.5">
          <Input
            id="number"
            placeholder="Número"
            value={number}
            onChange={e => setNumber(e.target.value)}
            required
          />
          <Input
            id="complement"
            placeholder="Complemento (Opcional)"
            value={complement}
            onChange={e => setComplement(e.target.value)}
          />
        </div>
        <Input
          id="cpfCnpj"
          placeholder="CPF"
          value={cpfCnpj}
          onChange={e => setCpfCnpj(maskCpf(e.target.value))}
          required
          maxLength={14}
          inputMode="numeric"
        />
        <Button type="submit" className="mt-8 mb-4 bg-black text-white focus:ring-black focus:border-black">CONTINUAR</Button>
      </form>
    </main>
  );
};

export default Entrega; 