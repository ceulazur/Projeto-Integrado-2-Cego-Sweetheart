import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { OrdersSection } from '../components/sections/OrdersSection';
import { useAuth } from '../contexts/AuthContext';

const HistoricoPedidos: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.id) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user?.id) {
    return null; // Não renderiza nada enquanto redireciona
  }

  return (
    <div className="bg-white flex max-w-[480px] w-full flex-col overflow-hidden items-stretch mx-auto pt-4 pb-[122px] min-h-screen">
      <Header />
      <div className="z-10 w-full px-[9px]">
        <OrdersSection />
      </div>
    </div>
  );
};

export default HistoricoPedidos; 