import React from 'react';
import { ActionButton } from '../ui/ActionButton';

interface OrderItemProps {
  imageUrl: string;
  title: string;
  quantity: number;
  status?: 'entregue' | 'transporte' | 'devolvido';
  onTrackOrder?: () => void;
  onViewDetails?: () => void;
  onRequestRefund?: () => void;
}

const statusMap = {
  entregue: { color: 'bg-green-500', text: 'Entregue' },
  transporte: { color: 'bg-yellow-400', text: 'Em transporte' },
  devolvido: { color: 'bg-red-500', text: 'Devolvido/Reembolsado' },
};

export const OrderItem: React.FC<OrderItemProps> = ({
  imageUrl,
  title,
  quantity,
  status = 'transporte',
  onTrackOrder,
  onViewDetails,
  onRequestRefund
}) => {
  const statusInfo = statusMap[status];
  return (
    <article className="flex items-stretch gap-2 font-medium">
      <div className="text-xs text-black grow shrink-0 basis-0 w-fit">
        <div className="flex min-h-[86px] gap-[11px]">
          <img
            src={imageUrl}
            alt={title}
            className="aspect-[0.79] object-contain w-[68px] shadow-[1px_4px_4px_rgba(0,0,0,0.25)] shrink-0"
          />
          <div className="w-[185px] flex flex-col justify-center">
            <span className="font-light">{title} </span>
            <br />x {quantity}
            <div className="flex items-center gap-2 mt-1">
              <span className={`inline-block w-3 h-3 rounded-full ${statusInfo.color}`}></span>
              <span className="text-xs font-semibold">{statusInfo.text}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="text-[10px] text-[rgba(27,30,132,1)] flex flex-col gap-3">
        <ActionButton 
          variant="primary" 
          onClick={onTrackOrder}
          className="pl-[21px] pr-5"
        >
          LOCALIZAR PEDIDO
        </ActionButton>
        <ActionButton 
          variant="secondary" 
          onClick={onViewDetails}
          className="px-3.5"
        >
          DETALHES DO PEDIDO
        </ActionButton>
        <ActionButton 
          variant="secondary" 
          onClick={onRequestRefund}
          className="px-[22px]"
        >
          PEDIR REEMBOLSO
        </ActionButton>
      </div>
    </article>
  );
}; 