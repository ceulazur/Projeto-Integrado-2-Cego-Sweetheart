import React, { useEffect, useState } from 'react';
import { Header } from '../components/layout/Header';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useAuth, getCartKey } from '../contexts/AuthContext';

const FRETE = 52.72;

interface CartItem {
  id: string;
  title: string;
  price: string;
  imageUrl: string;
  quantity: number;
  category: string;
}

const PagamentoSucesso: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orderTotal, setOrderTotal] = useState<{subtotal:number, frete:number, total:number}|null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    if (user?.id) {
      const lastOrder = localStorage.getItem(`lastOrderTotal_${user.id}`);
      if (lastOrder) {
        try {
          setOrderTotal(JSON.parse(lastOrder));
        } catch {
          setOrderTotal(null);
        }
      }
    }
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

  function handleBack() {
    navigate('/catalogo');
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
          <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-8 text-black">
            Pagamento Realizado com <span className="text-blue-600">sucesso</span>
          </h1>
          
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
                <span className="font-semibold">R$ {orderTotal ? orderTotal.subtotal.toFixed(2).replace('.', ',') : subtotal.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Custo de frete</span>
                <span className="font-semibold">R$ {orderTotal ? orderTotal.frete.toFixed(2).replace('.', ',') : FRETE.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between pt-4 text-xl lg:text-2xl font-bold border-t-2 border-gray-200">
                <span>Total</span>
                <span>R$ {orderTotal ? orderTotal.total.toFixed(2).replace('.', ',') : (subtotal + FRETE).toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
          </Card>
          
          <section className="text-center mb-12">
            <h2 className="text-4xl lg:text-6xl font-bold leading-tight text-black mb-8">
              Muito obrigado por<br />comprar <br />na <br />
              <span className="text-red-600">Cego Sweetheart</span>!
            </h2>
          </section>
          
          <Button
            type="button"
            className="w-full bg-gradient-to-r from-black to-gray-800 text-white rounded-2xl py-6 text-2xl font-bold hover:from-gray-800 hover:to-black transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            onClick={handleBack}
          >
            VOLTAR PARA CATALOGO
          </Button>
        </div>
      </div>
    </main>
  );
};

export default PagamentoSucesso; 