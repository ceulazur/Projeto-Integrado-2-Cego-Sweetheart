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
          <h2 className="text-4xl lg:text-5xl font-bold mb-8 text-black">Pagamento via PIX</h2>
          
          <Card className="p-8 mb-12 rounded-2xl border-2 border-gray-200 bg-white shadow-lg">
            <div className="text-center mb-8">
              <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 mb-6">
                <div className="text-2xl lg:text-3xl font-bold text-green-600 mb-4">
                  Desconto de 3% aplicado!
                </div>
                <div className="text-lg text-green-700">
                  Total com desconto: R$ {total.toFixed(2).replace('.', ',')}
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                <div className="text-lg font-semibold text-gray-700 mb-4">
                  Tempo restante para pagamento:
                </div>
                <div className="text-4xl lg:text-5xl font-bold text-red-600 font-mono">
                  {formatarTempo(tempoRestante)}
                </div>
              </div>
              
              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
                <div className="text-xl lg:text-2xl font-bold text-blue-600 mb-4">
                  Código PIX
                </div>
                <div className="bg-white border-2 border-blue-300 rounded-xl p-4 mb-4">
                  <code className="text-sm lg:text-base break-all text-gray-800 font-mono">
                    {codigoPix}
                  </code>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(codigoPix);
                    alert('Código PIX copiado!');
                  }}
                  className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                  Copiar Código
                </button>
              </div>
            </div>
            
            <div className="space-y-4 text-lg lg:text-xl">
              <div className="flex justify-between">
                <span className="font-medium">Subtotal</span>
                <span className="font-semibold">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Custo de frete{freteData ? ` (${freteData.nome})` : ''}</span>
                <span className="font-semibold">R$ {frete.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span className="font-medium">Desconto (3%)</span>
                <span className="font-semibold">-R$ {descontoValor.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between pt-4 text-xl lg:text-2xl font-bold border-t-2 border-gray-200">
                <span>Total</span>
                <span>R$ {total.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default PagamentoPix; 