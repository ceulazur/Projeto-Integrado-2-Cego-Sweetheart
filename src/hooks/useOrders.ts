import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';

interface Order {
  id: string;
  clienteNome: string;
  clienteId: string;
  status: 'preparando' | 'entregue' | 'transporte' | 'devolvido';
  statusEntrega: string;
  data: string;
  produtoId: string;
  produtoNome: string;
  produtoImageUrl: string;
  produtoPrice: string;
  quantidade: number;
  subtotal: string;
  frete: string;
  total: string;
  formaPagamento: string;
  codigoRastreio: string;
  created_at: string;
}

export const useOrders = () => {
  const { user } = useAuth();
  
  console.log('useOrders hook:', { userId: user?.id, user });
  
  return useQuery({
    queryKey: ['orders', user?.id],
    queryFn: async (): Promise<Order[]> => {
      if (!user?.id) { return []; }
      const response = await fetch(`http://localhost:3000/api/pedidos/cliente/${user.id}`);
      if (!response.ok) { throw new Error('Erro ao buscar pedidos'); }
      return response.json();
    },
    enabled: !!user?.id,
  });
}; 