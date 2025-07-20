import React, { useEffect, useState } from 'react';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth, getCartKey } from '../contexts/AuthContext';
import { useUpdateProduct, useProducts } from '../hooks/useProducts';

const DEFAULT_FRETE = 52.72;

function gerarCodigoPixRealista() {
  // Exemplo de código copia e cola PIX (tipo chave aleatória + domínio)
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let chave = '';
  for (let i = 0; i < 32; i++) {
    chave += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `00020126580014BR.GOV.BCB.PIX0136${chave}@pix.banco.com.br5204000053039865407${(Math.random()*100+1).toFixed(2).replace('.', '')}5802BR5920NOME DO RECEBEDOR6009SAO PAULO62070503***6304ABCD`;
}

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

const PagamentoPix: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [frete, setFrete] = useState(DEFAULT_FRETE);
  const [freteData, setFreteData] = useState<FreteData | null>(null);
  const [codigoPix] = useState(gerarCodigoPixRealista());
  const [expiraEm, setExpiraEm] = useState<Date | null>(null);
  const [tempoRestante, setTempoRestante] = useState(120); // segundos
  const { user } = useAuth();
  const navigate = useNavigate();
  const updateProduct = useUpdateProduct();
  const { data: allProducts } = useProducts();

  const subtotal = cart.reduce((acc, item) => acc + (parseFloat(item.price.replace('R$', '').replace(',', '.')) * item.quantity), 0);
  const descontoPercent = 3;
  const descontoValor = ((subtotal + frete) * descontoPercent) / 100;
  const total = (subtotal + frete) - descontoValor;

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

    // Define o tempo de expiração para 2 minutos a partir de agora
    const agora = new Date();
    const expira = new Date(agora.getTime() + 2 * 60 * 1000);
    setExpiraEm(expira);
    setTempoRestante(120);
  }, [user?.id]);

  useEffect(() => {
    if (!expiraEm) return;
    const interval = setInterval(async () => {
      const agora = new Date();
      const diff = Math.max(0, Math.floor((expiraEm.getTime() - agora.getTime()) / 1000));
      setTempoRestante(diff);
      if (diff <= 0) {
        clearInterval(interval);
        
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
                formaPagamento: 'PIX'
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
    }, 1000);
    return () => clearInterval(interval);
  }, [expiraEm, navigate, cart, allProducts, updateProduct, user, subtotal, frete, total]);

  // Formata tempo mm:ss
  function formatarTempo(segundos: number) {
    const m = Math.floor(segundos / 60).toString().padStart(2, '0');
    const s = (segundos % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
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
        <h2 className="text-3xl font-bold mb-2 text-black">Pagamento via PIX</h2>
        <Card className="p-5 mb-10 rounded-3xl border border-black border-solid bg-white bg-opacity-90">
          <div className="flex flex-col items-center gap-4 mb-6">
            <span className="text-lg font-semibold text-black">Use o código abaixo para pagar via PIX:</span>
            <span className="text-xs font-mono bg-gray-100 px-2 py-2 rounded-lg border border-dashed border-gray-400 select-all break-all">
              {codigoPix}
            </span>
            <span className="text-base text-zinc-700 mt-2">Este código expira em <span className="font-bold text-black">{formatarTempo(tempoRestante)}</span></span>
          </div>
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
          <div className="flex justify-between mb-2.5">
            <span>Subtotal</span>
            <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
          </div>
          <div className="flex justify-between mb-5">
            <span>Custo de frete{freteData ? ` (${freteData.nome})` : ''}</span>
            <span>R$ {frete.toFixed(2).replace('.', ',')}</span>
          </div>
          <div className="flex justify-between mb-5 font-semibold">
            <span>Desconto (3%)</span>
            <span>-R$ {descontoValor.toFixed(2).replace('.', ',')}</span>
          </div>
          <div className="flex justify-between pt-2.5 text-lg font-semibold border-t border-solid border-t-black border-t-opacity-20">
            <span>Total</span>
            <span>R$ {total.toFixed(2).replace('.', ',')}</span>
          </div>
        </Card>
      </div>
    </main>
  );
};

export default PagamentoPix; 