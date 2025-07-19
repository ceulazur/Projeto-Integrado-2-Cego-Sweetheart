import React, { useState } from 'react';
import { useOrders } from '../../hooks/useOrders';
import { FilterButton } from './FilterButton';
import { OrderItem } from './OrderItem';

export const OrdersSection: React.FC = () => {
  const [filter, setFilter] = useState("");
  const { data: orders = [], isLoading, error } = useOrders();

  console.log('OrdersSection renderizando:', { isLoading, error, ordersCount: orders.length });

  const handleFilterOrders = () => {
    // Lógica de filtro, se necessário
  };

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

  if (isLoading) {
    return (
      <main className="w-full mt-2">
        <section className="flex flex-col text-[rgba(250,0,0,1)] text-center">
          <h1 className="text-4xl font-extrabold">SEUS PEDIDOS</h1>
          <p className="text-[15px] font-normal mt-2.5">Carregando...</p>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="w-full mt-2">
        <section className="flex flex-col text-[rgba(250,0,0,1)] text-center">
          <h1 className="text-4xl font-extrabold">SEUS PEDIDOS</h1>
          <p className="text-[15px] font-normal mt-2.5 text-red-600">Erro ao carregar pedidos</p>
          <p className="text-[12px] text-gray-500 mt-2">Detalhes do erro: {error.message}</p>
        </section>
      </main>
    );
  }

  return (
    <main className="w-full mt-2">
      <section className="flex flex-col text-[rgba(250,0,0,1)] text-center">
        <h1 className="text-4xl font-extrabold">SEUS PEDIDOS</h1>
        <p className="text-[15px] font-normal mt-2.5">
          Você tem {filteredOrders.length} pedidos realizados
        </p>
        <div className="border self-stretch min-h-px w-full mt-2.5 border-black border-solid" />
      </section>

      <FilterButton value={filter} onChange={setFilter} />

      <section className="mt-6" aria-label="Lista de pedidos">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Nenhum pedido encontrado</p>
          </div>
        ) : (
          <div className="flex flex-col gap-[17px]">
            {filteredOrders.map((order) => (
              <OrderItem
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
    </main>
  );
}; 