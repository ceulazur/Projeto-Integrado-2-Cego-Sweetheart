import React, { useState } from "react";

type PedidoStatus = "Cancelado" | "Enviado" | "Em aberto" | "Concluído";

type Pedido = {
  id: number;
  clienteNome: string;
  clienteId: string;
  status: PedidoStatus;
  data: string;
  produtoId: number;
  produtoNome: string;
  formaPagamento: string;
  codigoRastreio?: string; // opcional inicialmente
};

const pedidosData: Pedido[] = [
  {
    id: 101,
    clienteNome: "Jhordanna Gonçalves",
    clienteId: "CLT-001",
    status: "Enviado",
    data: "2025-06-20",
    produtoId: 1,
    produtoNome: "NotionMe",
    formaPagamento: "Cartão de Crédito",
  },
  {
    id: 102,
    clienteNome: "Carlos Silva",
    clienteId: "CLT-002",
    status: "Cancelado",
    data: "2025-06-18",
    produtoId: 2,
    produtoNome: "Boné Cego Sweetheart",
    formaPagamento: "Boleto Bancário",
  },
  {
    id: 103,
    clienteNome: "Ana Paula",
    clienteId: "CLT-003",
    status: "Em aberto",
    data: "2025-06-19",
    produtoId: 3,
    produtoNome: "NotionMe",
    formaPagamento: "Pix",
  },
];

const statusColors: Record<PedidoStatus, string> = {
  "Cancelado": "text-red-600 font-semibold",
  "Enviado": "text-green-600 font-semibold",
  "Em aberto": "text-yellow-600 font-semibold",
  "Concluído": "text-blue-600 font-semibold",
};

const Pedidos = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>(pedidosData);
  const [modalAberto, setModalAberto] = useState(false);
  const [pedidoSelecionado, setPedidoSelecionado] = useState<Pedido | null>(null);
  const [codigoRastreio, setCodigoRastreio] = useState("");
  const [statusSelecionado, setStatusSelecionado] = useState<PedidoStatus>("Em aberto");

  const abrirModal = (pedido: Pedido) => {
    setPedidoSelecionado(pedido);
    setCodigoRastreio(pedido.codigoRastreio || "");
    setStatusSelecionado(pedido.status);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setPedidoSelecionado(null);
  };

  const salvarAlteracoes = () => {
    if (!pedidoSelecionado) return;

    const novosPedidos = pedidos.map((p) =>
      p.id === pedidoSelecionado.id
        ? { ...p, codigoRastreio, status: statusSelecionado }
        : p
    );

    setPedidos(novosPedidos);
    alert(`Pedido atualizado com sucesso!`);
    fecharModal();
  };

  return (
    <div className="p-8 pt-24">
      <h1 className="text-2xl font-bold mb-6">Pedidos</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2 text-left">ID Pedido</th>
            <th className="border border-gray-300 p-2 text-left">Cliente</th>
            <th className="border border-gray-300 p-2 text-left">ID Cliente</th>
            <th className="border border-gray-300 p-2 text-left">Status</th>
            <th className="border border-gray-300 p-2 text-left">Data</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((pedido) => (
            <tr
              key={pedido.id}
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => abrirModal(pedido)}
            >
              <td className="border border-gray-300 p-2">{pedido.id}</td>
              <td className="border border-gray-300 p-2">{pedido.clienteNome}</td>
              <td className="border border-gray-300 p-2">{pedido.clienteId}</td>
              <td className={`border border-gray-300 p-2 ${statusColors[pedido.status]}`}>
                {pedido.status}
              </td>
              <td className="border border-gray-300 p-2">{pedido.data}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {modalAberto && pedidoSelecionado && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={fecharModal}
        >
          <div
            className="bg-white p-6 rounded shadow-lg max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Detalhes do Pedido #{pedidoSelecionado.id}</h2>

            <p><strong>Produto:</strong> {pedidoSelecionado.produtoNome} (ID: {pedidoSelecionado.produtoId})</p>
            <p><strong>Forma de pagamento:</strong> {pedidoSelecionado.formaPagamento}</p>

            <div className="mt-4">
              <label className="block font-semibold mb-1" htmlFor="codigoRastreio">
                Código de rastreio:
              </label>
              <input
                type="text"
                id="codigoRastreio"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={codigoRastreio}
                onChange={(e) => setCodigoRastreio(e.target.value)}
                placeholder="Digite o código de rastreio para compartilhar"
              />
            </div>

            <div className="mt-4">
              <label className="block font-semibold mb-1" htmlFor="statusPedido">
                Status do pedido:
              </label>
              <select
                id="statusPedido"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={statusSelecionado}
                onChange={(e) => setStatusSelecionado(e.target.value as PedidoStatus)}
              >
                <option value="Em aberto">Em aberto</option>
                <option value="Enviado">Enviado</option>
                <option value="Cancelado">Cancelado</option>
                <option value="Concluído">Concluído</option>
              </select>
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <button
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                onClick={fecharModal}
              >
                Cancelar
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={salvarAlteracoes}
              >
                Salvar e Compartilhar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pedidos; 