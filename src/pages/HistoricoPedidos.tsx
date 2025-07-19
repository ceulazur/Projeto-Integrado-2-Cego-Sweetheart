import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Header } from '../components/layout/Header';

interface Order {
  id: string;
  clienteNome: string;
  clienteId: string;
  status: string;
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

// Componente de filtro simplificado
const SimpleFilterButton: React.FC<{ value: string; onChange: (value: string) => void }> = ({ value, onChange }) => {
  return (
    <div className="flex w-full items-stretch gap-0.5 text-[10px] text-[rgba(27,30,132,1)] font-medium mt-3.5">
      <img
        src="https://api.builder.io/api/v1/image/assets/c9e61df7bfe543a0b7e24feda3172117/0a1837e8ea5698e9dc31e07f096a1be0096fd0ca?placeholderIfAbsent=true"
        alt="Filter icon"
        className="aspect-[1] object-contain w-6 shrink-0 rounded-[50%]"
      />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Filtrar Pedido"
        className="bg-white border flex min-h-[26px] items-center gap-2.5 justify-center grow shrink basis-auto px-12 py-[7px] rounded-[20px] border-[rgba(27,30,132,1)] border-solid hover:bg-gray-50 transition-colors outline-none text-center"
        style={{ fontSize: '15px' }}
      />
    </div>
  );
};

// Componente de item de pedido simplificado
const SimpleOrderItem: React.FC<{
  imageUrl: string;
  title: string;
  quantity: number;
  status: string;
  onTrackOrder: () => void;
  onViewDetails: () => void;
  onRequestRefund: () => void;
}> = ({ imageUrl, title, quantity, status, onTrackOrder, onViewDetails, onRequestRefund }) => {
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'entregue':
        return { color: 'bg-green-500', text: 'Entregue' };
      case 'transporte':
        return { color: 'bg-yellow-400', text: 'Em transporte' };
      default:
        return { color: 'bg-red-500', text: 'Devolvido/Reembolsado' };
    }
  };

  const statusInfo = getStatusInfo(status);

  return (
    <article className="flex items-stretch gap-2 font-medium">
      <div className="text-xs text-black grow shrink-0 basis-0 w-fit">
        <div className="flex min-h-[86px] gap-[11px]">
          <img
            src={imageUrl || '/placeholder.svg'}
            alt={title}
            className="aspect-[0.79] object-contain w-[68px] shadow-[1px_4px_4px_rgba(0,0,0,0.25)] shrink-0"
          />
          <div className="w-[185px] flex flex-col justify-center">
            <span className="font-light">{title}</span>
            <br />x {quantity}
            <div className="flex items-center gap-2 mt-1">
              <span className={`inline-block w-3 h-3 rounded-full ${statusInfo.color}`}></span>
              <span className="text-xs font-semibold">{statusInfo.text}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="text-[10px] text-[rgba(27,30,132,1)] flex flex-col gap-3">
        <button 
          onClick={onTrackOrder}
          className="min-h-7 gap-2.5 text-[13px] font-medium px-8 py-1.5 rounded-[20px] border border-solid bg-[rgba(27,30,132,1)] text-white border-[rgba(96,96,96,1)] pl-[21px] pr-5"
        >
          LOCALIZAR PEDIDO
        </button>
        <button 
          onClick={onViewDetails}
          className="min-h-7 gap-2.5 text-[13px] font-medium px-8 py-1.5 rounded-[20px] border border-solid bg-[rgba(245,0,0,0)] text-[rgba(245,0,0,1)] border-[rgba(245,0,0,1)] px-3.5"
        >
          DETALHES DO PEDIDO
        </button>
        <button 
          onClick={onRequestRefund}
          className="min-h-7 gap-2.5 text-[13px] font-medium px-8 py-1.5 rounded-[20px] border border-solid bg-[rgba(245,0,0,0)] text-[rgba(245,0,0,1)] border-[rgba(245,0,0,1)] px-[22px]"
        >
          PEDIR REEMBOLSO
        </button>
      </div>
    </article>
  );
};

// Componente principal de histórico de pedidos
const HistoricoPedidos: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (!user?.id) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/api/pedidos/cliente/${user.id}`);
        if (!response.ok) {
          throw new Error('Erro ao buscar pedidos');
        }
        const data = await response.json();
        setOrders(data);
      } catch (err: unknown) {
        const error = err as Error;
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?.id, navigate]);

  const handleTrackOrder = (orderId: string) => {
    console.log(`Rastrear pedido ${orderId}`);
    // Implementar lógica de rastreamento
  };

  const handleViewDetails = (orderId: string) => {
    console.log(`Ver detalhes do pedido ${orderId}`);
    // Implementar lógica de visualização de detalhes
  };

  const handleRequestRefund = (orderId: string) => {
    console.log(`Pedir reembolso para o pedido ${orderId}`);
    // Implementar lógica de pedido de reembolso
  };

  const filteredOrders = orders.filter(order =>
    order.produtoNome.toLowerCase().includes(filter.toLowerCase())
  );

  if (!user?.id) {
    return null;
  }

  if (loading) {
    return (
      <main className="flex overflow-hidden flex-col pt-4 pb-7 mx-auto w-full bg-white max-w-[480px]">
        <Header />
        <div className="w-full mt-2">
          <section className="flex flex-col text-[rgba(250,0,0,1)] text-center">
            <h1 className="text-4xl font-extrabold">SEUS PEDIDOS</h1>
            <p className="text-[15px] font-normal mt-2.5">Carregando...</p>
          </section>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex overflow-hidden flex-col pt-4 pb-7 mx-auto w-full bg-white max-w-[480px]">
        <Header />
        <div className="w-full mt-2">
          <section className="flex flex-col text-[rgba(250,0,0,1)] text-center">
            <h1 className="text-4xl font-extrabold">SEUS PEDIDOS</h1>
            <p className="text-[15px] font-normal mt-2.5 text-red-600">Erro ao carregar pedidos</p>
            <p className="text-[12px] text-gray-500 mt-2">Detalhes do erro: {error}</p>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="flex overflow-hidden flex-col pt-4 pb-7 mx-auto w-full bg-white max-w-[480px]">
      <Header />
      <div className="w-full mt-2">
        <section className="flex flex-col text-[rgba(250,0,0,1)] text-center">
          <h1 className="text-4xl font-extrabold">SEUS PEDIDOS</h1>
          <p className="text-[15px] font-normal mt-2.5">
            Você tem {filteredOrders.length} pedidos realizados
          </p>
          <div className="border self-stretch min-h-px w-full mt-2.5 border-black border-solid" />
        </section>

        <SimpleFilterButton value={filter} onChange={setFilter} />

        <section className="mt-6" aria-label="Lista de pedidos">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhum pedido encontrado</p>
            </div>
          ) : (
            <div className="flex flex-col gap-[17px]">
              {filteredOrders.map((order) => (
                <SimpleOrderItem
                  key={order.id}
                  imageUrl={order.produtoImageUrl}
                  title={order.produtoNome}
                  quantity={order.quantidade}
                  status={order.status}
                  onTrackOrder={() => handleTrackOrder(order.id)}
                  onViewDetails={() => handleViewDetails(order.id)}
                  onRequestRefund={() => handleRequestRefund(order.id)}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default HistoricoPedidos; 