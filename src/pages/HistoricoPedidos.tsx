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
  data_pedido: string;
}

// Modal de detalhes do pedido para o cliente
const OrderDetailsModal: React.FC<{
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'preparando':
        return { color: 'bg-blue-500', text: 'Preparando entrega', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' };
      case 'entregue':
        return { color: 'bg-green-500', text: 'Entregue', bgColor: 'bg-green-50', borderColor: 'border-green-200' };
      case 'transporte':
        return { color: 'bg-yellow-400', text: 'Em transporte', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' };
      case 'reembolsado':
        return { color: 'bg-red-500', text: 'Reembolsado', bgColor: 'bg-red-50', borderColor: 'border-red-200' };
      default:
        return { color: 'bg-red-500', text: 'Reembolsado', bgColor: 'bg-red-50', borderColor: 'border-red-200' };
    }
  };

  // Função para tratar datas inválidas
  const formatOrderDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      // Verifica se a data é válida (não é 1969 ou antes)
      if (date.getFullYear() < 1970) {
        return new Date().toLocaleDateString('pt-BR');
      }
      return date.toLocaleDateString('pt-BR');
    } catch (error) {
      return new Date().toLocaleDateString('pt-BR');
    }
  };

  const statusInfo = getStatusInfo(order.status);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header do Modal */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-xl">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold">Detalhes do Pedido</h2>
              <p className="text-blue-100 text-sm">#{order.id}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Status do Pedido */}
          <div className={`${statusInfo.bgColor} ${statusInfo.borderColor} border rounded-lg p-4 mb-6`}>
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full ${statusInfo.color}`}></div>
              <div>
                <h3 className="font-semibold text-gray-800">Status do Pedido</h3>
                <p className="text-gray-600">{statusInfo.text}</p>
              </div>
            </div>
          </div>

          {/* Informações do Produto */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Produto</h3>
            <div className="flex items-center gap-4">
              <img
                src={order.produtoImageUrl || '/placeholder.svg'}
                alt={order.produtoNome}
                className="w-16 h-16 object-cover rounded-lg shadow-sm"
              />
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{order.produtoNome}</h4>
                <p className="text-sm text-gray-600">Quantidade: {order.quantidade}</p>
                <p className="text-sm text-gray-600">Preço unitário: {order.produtoPrice}</p>
              </div>
            </div>
          </div>

          {/* Informações de Entrega */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Informações de Entrega</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Data do pedido:</span>
                <span className="font-medium">{formatOrderDate(order.data_pedido || order.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Forma de pagamento:</span>
                <span className="font-medium">{order.formaPagamento}</span>
              </div>
              {order.codigoRastreio && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Código de rastreio:</span>
                  <span className="font-medium text-blue-600">{order.codigoRastreio}</span>
                </div>
              )}
            </div>
          </div>

          {/* Resumo Financeiro */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Resumo Financeiro</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span>{order.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Frete:</span>
                <span>{order.frete}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="font-semibold text-gray-800">Total:</span>
                <span className="font-semibold text-gray-900">{order.total}</span>
              </div>
            </div>
          </div>

          {/* Ações */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Fechar
            </button>
            {order.codigoRastreio && (
              <button
                onClick={() => {
                  // Aqui você pode implementar a lógica para rastrear o pedido
                  window.open(`https://rastreamento.correios.com.br/app/index.php?objeto=${order.codigoRastreio}`, '_blank');
                }}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Rastrear Pedido
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente de filtro simplificado
const SimpleFilterButton: React.FC<{ value: string; onChange: (value: string) => void }> = ({ value, onChange }) => {
  return (
    <div className="relative max-w-lg mx-auto">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Filtrar Pedido"
        className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl leading-6 bg-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all duration-200 text-lg shadow-sm hover:shadow-md"
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
  orderDate: string;
  onTrackOrder: () => void;
  onViewDetails: () => void;
  onRequestRefund: () => void;
}> = ({ imageUrl, title, quantity, status, orderDate, onTrackOrder, onViewDetails, onRequestRefund }) => {
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'preparando':
        return { color: 'bg-blue-500', text: 'Preparando entrega' };
      case 'entregue':
        return { color: 'bg-green-500', text: 'Entregue' };
      case 'transporte':
        return { color: 'bg-yellow-400', text: 'Em transporte' };
      case 'reembolsado':
        return { color: 'bg-red-500', text: 'Reembolsado' };
      default:
        return { color: 'bg-red-500', text: 'Reembolsado' };
    }
  };

  const statusInfo = getStatusInfo(status);

  // Função para formatar a data
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (date.getFullYear() < 1970) {
        return new Date().toLocaleDateString('pt-BR');
      }
      return date.toLocaleDateString('pt-BR');
    } catch (error) {
      return new Date().toLocaleDateString('pt-BR');
    }
  };

  return (
    <article className="bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="p-8">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          {/* Imagem e informações do produto */}
          <div className="flex items-start gap-6 flex-1">
            <div className="relative">
              <img
                src={imageUrl || '/placeholder.svg'}
                alt={title}
                className="w-24 h-24 lg:w-32 lg:h-32 object-cover rounded-xl shadow-md"
              />
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                x{quantity}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 text-xl mb-2 truncate">{title}</h3>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-4 h-4 rounded-full ${statusInfo.color} shadow-sm`}></div>
                <span className="text-sm font-medium text-gray-700">{statusInfo.text}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Pedido em: {formatDate(orderDate)}</span>
              </div>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex flex-col gap-3 lg:gap-4 lg:min-w-[200px]">
            <button
              onClick={onTrackOrder}
              className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>LOCALIZAR PEDIDO</span>
              </div>
            </button>
            <button
              onClick={onViewDetails}
              className="group border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>DETALHES DO PEDIDO</span>
              </div>
            </button>
            <button 
              onClick={onRequestRefund}
              disabled={status !== 'entregue'}
              title={status !== 'entregue' ? 'Só é possível solicitar reembolso para pedidos entregues' : 'Solicitar reembolso'}
              className={`group font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
                status === 'entregue' 
                  ? 'border-2 border-gray-400 text-gray-600 hover:bg-gray-600 hover:text-white hover:border-gray-600 cursor-pointer' 
                  : 'bg-gray-200 text-gray-400 border-2 border-gray-200 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                <span>PEDIR REEMBOLSO</span>
              </div>
            </button>
          </div>
        </div>
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
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    
    // Simular código de rastreio baseado no ID do pedido
    const trackingCode = generateTrackingCode(orderId);
    
    // Gerar URL de rastreio simulada
    const trackingUrl = `https://rastreamento.correios.com.br/app/index.php?objeto=${trackingCode}`;
    
    // Abrir em nova aba
    window.open(trackingUrl, '_blank');
    
    // Mostrar confirmação
    console.log(`Rastreamento aberto para código: ${trackingCode}`);
  };

  // Função para gerar código de rastreio determinístico
  const generateTrackingCode = (orderId: string): string => {
    // Função hash simples para gerar código consistente
    const hash = (str: string) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      return Math.abs(hash);
    };
    
    const hashValue = hash(orderId);
    
    // Gerar código no formato BR + 9 dígitos + 2 letras
    const digits = String(hashValue).padStart(9, '0').slice(0, 9);
    const letters = String.fromCharCode(65 + (hashValue % 26)) + String.fromCharCode(65 + ((hashValue * 2) % 26));
    
    return `BR${digits}${letters}`;
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleRequestRefund = (orderId: string) => {
    navigate(`/solicitar-reembolso/${orderId}`);
  };

  const filteredOrders = orders
    .filter(order =>
      order.produtoNome.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => {
      // Ordenar por data de criação (mais recente primeiro)
      const dateA = new Date(a.data_pedido || a.created_at || a.data);
      const dateB = new Date(b.data_pedido || b.created_at || b.data);
      return dateB.getTime() - dateA.getTime();
    });

  if (!user?.id) {
    return null;
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <section className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
              <svg className="w-8 h-8 text-red-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-4">
              SEUS PEDIDOS
            </h1>
            <p className="text-xl text-gray-600">Carregando seus pedidos...</p>
          </section>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <section className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-4">
              SEUS PEDIDOS
            </h1>
            <p className="text-xl text-red-600 mb-4">Erro ao carregar pedidos</p>
            <p className="text-lg text-gray-500">Detalhes do erro: {error}</p>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />
      
      {/* Container principal responsivo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Cabeçalho da página */}
        <section className="text-center mb-12">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-4">
            SEUS PEDIDOS
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Você tem <span className="font-semibold text-red-600">{filteredOrders.length}</span> pedidos realizados
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-red-600 mx-auto rounded-full" />
        </section>

        {/* Filtro */}
        <div className="max-w-lg mx-auto mb-12">
          <SimpleFilterButton value={filter} onChange={setFilter} />
        </div>

        {/* Lista de pedidos */}
        <section className="max-w-5xl mx-auto" aria-label="Lista de pedidos">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white rounded-2xl shadow-lg p-12 border border-gray-100">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">Nenhum pedido encontrado</h3>
                <p className="text-gray-500 text-lg">
                  {filter ? 'Tente ajustar os filtros de busca' : 'Faça seu primeiro pedido!'}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-8">
              {filteredOrders.map((order) => (
                <SimpleOrderItem
                  key={order.id}
                  imageUrl={order.produtoImageUrl}
                  title={order.produtoNome}
                  quantity={order.quantidade}
                  status={order.status}
                  orderDate={order.data_pedido || order.created_at || order.data}
                  onTrackOrder={() => handleTrackOrder(order.id)}
                  onViewDetails={() => handleViewDetails(order)}
                  onRequestRefund={() => handleRequestRefund(order.id)}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Modal de Detalhes */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedOrder(null);
        }}
      />
    </main>
  );
};

export default HistoricoPedidos; 