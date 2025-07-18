import React, { useEffect, useState } from 'react';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useUpdateProduct, useProducts } from '../hooks/useProducts';
import { useAuth, getCartKey } from '../contexts/AuthContext';

const DEFAULT_FRETE = 52.72;

interface CartItem {
  id: string;
  title: string;
  price: string;
  imageUrl: string;
  quantity: number;
  category: string;
}

const PagamentoCartao: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [frete, setFrete] = useState(DEFAULT_FRETE);
  const [nome, setNome] = useState('');
  const [numero, setNumero] = useState('');
  const [validade, setValidade] = useState('');
  const [cvv, setCvv] = useState('');
  const [cpf, setCpf] = useState('');
  const navigate = useNavigate();
  const updateProduct = useUpdateProduct();
  const { data: allProducts } = useProducts();
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
    const storedFrete = localStorage.getItem('selectedFrete');
    if (storedFrete && !isNaN(Number(storedFrete))) {
      setFrete(Number(storedFrete));
    } else {
      setFrete(DEFAULT_FRETE);
    }
  }, [user?.id]);

  const subtotal = cart.reduce((acc, item) => acc + (parseFloat(item.price.replace('R$', '').replace(',', '.')) * item.quantity), 0);
  const total = subtotal + frete;

  // Máscara para número do cartão
  function maskCardNumber(value: string) {
    return value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').trim().slice(0, 19);
  }
  // Máscara para validade MM/AA
  function maskValidade(value: string) {
    value = value.replace(/\D/g, '');
    if (value.length > 2) value = value.slice(0,2) + '/' + value.slice(2,4);
    return value.slice(0, 5);
  }
  // Máscara para CPF
  function maskCpf(value: string) {
    value = value.replace(/\D/g, '');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    return value;
  }

  const isFormValid = nome && numero.length === 19 && validade.length === 5 && cvv.length >= 3 && cpf.length === 14;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      // Salvar pedido na API para cada item do carrinho
      for (const item of cart) {
        const produtoAtual = allProducts?.find(p => p.id === item.id);
        if (produtoAtual) {
          // Criar pedido na API
          const pedidoData = {
            clienteNome: `${user?.firstName} ${user?.lastName}`,
            clienteId: user?.id.toString(),
            produtoId: item.id,
            produtoNome: item.title,
            produtoImageUrl: item.imageUrl,
            produtoPrice: item.price,
            quantidade: item.quantity,
            subtotal: subtotal.toFixed(2),
            frete: frete.toFixed(2),
            total: total.toFixed(2),
            formaPagamento: 'Cartão de Crédito'
          };

          const response = await fetch('http://localhost:3000/api/pedidos', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(pedidoData),
          });

          if (!response.ok) {
            throw new Error('Erro ao criar pedido');
          }

          // Descontar estoque dos produtos
          await updateProduct.mutateAsync({
            ...produtoAtual,
            quantity: Math.max(0, produtoAtual.quantity - item.quantity),
          });
        }
      }

      // Salvar o valor total do pedido para exibir na tela de sucesso
      if (user?.id) {
        localStorage.setItem(`lastOrderTotal_${user.id}`, JSON.stringify({ subtotal, frete, total }));
      }
      
      // Limpar o carrinho do usuário após finalizar a compra
      localStorage.removeItem(getCartKey(user?.id));
      navigate('/pagamento-sucesso');
    } catch (error) {
      console.error('Erro ao finalizar compra:', error);
      alert('Erro ao finalizar compra. Tente novamente.');
    }
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
        <h2 className="text-3xl font-bold mb-2 text-black">Pagamento com Cartão de Crédito</h2>
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
        <form className="flex flex-col gap-4" onSubmit={handleSubmit} autoComplete="off">
          <label className="text-lg font-semibold text-black">Nome impresso no cartão
            <input
              type="text"
              className="w-full border border-black rounded-2xl px-4 py-3 mt-1 text-xl"
              value={nome}
              onChange={e => setNome(e.target.value)}
              required
              maxLength={50}
            />
          </label>
          <label className="text-lg font-semibold text-black">Número do cartão
            <input
              type="text"
              className="w-full border border-black rounded-2xl px-4 py-3 mt-1 text-xl"
              value={numero}
              onChange={e => setNumero(maskCardNumber(e.target.value))}
              required
              maxLength={19}
              inputMode="numeric"
              placeholder="0000 0000 0000 0000"
            />
          </label>
          <div className="flex gap-4">
            <label className="flex-1 text-lg font-semibold text-black">Validade (MM/AA)
              <input
                type="text"
                className="w-full border border-black rounded-2xl px-4 py-3 mt-1 text-xl"
                value={validade}
                onChange={e => setValidade(maskValidade(e.target.value))}
                required
                maxLength={5}
                inputMode="numeric"
                placeholder="MM/AA"
              />
            </label>
            <label className="flex-1 text-lg font-semibold text-black">CVV
              <input
                type="text"
                className="w-full border border-black rounded-2xl px-4 py-3 mt-1 text-xl"
                value={cvv}
                onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0,4))}
                required
                maxLength={4}
                inputMode="numeric"
                placeholder="CVV"
              />
            </label>
          </div>
          <label className="text-lg font-semibold text-black">CPF do titular
            <input
              type="text"
              className="w-full border border-black rounded-2xl px-4 py-3 mt-1 text-xl"
              value={cpf}
              onChange={e => setCpf(maskCpf(e.target.value))}
              required
              maxLength={14}
              inputMode="numeric"
              placeholder="000.000.000-00"
            />
          </label>
          <Button
            type="submit"
            className="w-full bg-black text-white rounded-2xl py-5 text-2xl font-semibold mt-2 focus:ring-black focus:border-black"
            disabled={!isFormValid}
          >
            FINALIZAR PAGAMENTO
          </Button>
        </form>
      </div>
    </main>
  );
};

export default PagamentoCartao; 