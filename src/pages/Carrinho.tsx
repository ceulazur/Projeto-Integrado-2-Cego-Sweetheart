import React, { useEffect, useState } from 'react';
import { Header } from '../components/layout/Header';
import { TrashIcon } from '@heroicons/react/24/outline';

interface CartItem {
  id: string;
  title: string;
  price: string;
  imageUrl: string;
  quantity: number;
  category: string;
}

const Carrinho: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    // Busca os produtos do carrinho do localStorage
    const stored = localStorage.getItem('cart');
    if (stored) {
      try {
        setCart(JSON.parse(stored));
      } catch {
        setCart([]);
      }
    }
  }, []);

  // Atualiza quantidade de um item
  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    const updatedCart = cart.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Remove item do carrinho
  const handleRemove = (id: string) => {
    const updatedCart = cart.filter(item => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  return (
    <main className="bg-white flex max-w-[480px] w-full flex-col overflow-hidden items-stretch text-2xl font-normal mx-auto pt-4 pb-[122px]">
      <Header />
      <div className="z-10 w-full text-black font-medium px-[5px] mt-6">
        <h2 className="text-xl font-bold mb-4 text-center">Meu Carrinho</h2>
        {cart.length === 0 ? (
          <div className="text-center text-gray-500 mt-12">Seu carrinho está vazio.</div>
        ) : (
          <>
          <ul className="flex flex-col gap-6">
            {cart.map((item) => (
              <li key={item.id} className="flex gap-4 items-center border-b pb-4">
                <img src={item.imageUrl} alt={item.title} className="w-20 h-20 object-cover rounded border" />
                <div className="flex-1 flex flex-col gap-1">
                  <span className="text-base font-bold">{item.title}</span>
                  <span className="text-sm text-gray-600">Categoria: <span className="font-semibold">{item.category}</span></span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-600">Quantidade:</span>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={e => handleQuantityChange(item.id, Number(e.target.value))}
                      className="w-14 px-2 py-1 border rounded text-base text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
                      style={{ fontSize: '1rem' }}
                    />
                  </div>
                  <span className="text-base font-bold text-green-700">{item.price}</span>
                </div>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="p-2 rounded hover:bg-red-100 transition-colors"
                  title="Remover do carrinho"
                >
                  <TrashIcon className="w-6 h-6 text-red-500" />
                </button>
              </li>
            ))}
          </ul>
          <div className="flex flex-col items-center mt-8 gap-4">
            <button
              className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-colors shadow"
              style={{ letterSpacing: 1 }}
              onClick={() => {}}
            >
              Prosseguir para compra
            </button>
          </div>
          </>
        )}
      </div>
    </main>
  );
};

export default Carrinho; 