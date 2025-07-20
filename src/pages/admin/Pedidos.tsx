import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import type { Usuario } from "../../contexts/UserContext";
import { useFilters } from '../../contexts/FilterContext';

type PedidoStatus = "preparando" | "transporte" | "entregue" | "reembolsado";

type Pedido = {
  id: number;
  clienteNome: string;
  clienteId: string;
  status: PedidoStatus;
  data: string;
  produtoId: number;
  produtoNome: string;
  formaPagamento: string;
  codigoRastreio?: string;
  artistHandle?: string; // Adicionado para mostrar o vendedor
  produtoPrice?: string;
  quantidade?: number;
  subtotal?: string;
  frete?: string;
  total?: string;
};

const statusColors: Record<PedidoStatus, string> = {
  "preparando": "text-blue-600 font-semibold",
  "transporte": "text-yellow-600 font-semibold",
  "entregue": "text-green-600 font-semibold",
  "reembolsado": "text-red-600 font-semibold",
};

// Função para mapear status do banco para exibição
const getStatusDisplay = (status: string): string => {
  switch (status) {
    case 'preparando':
      return 'Preparando Entrega';
    case 'transporte':
      return 'Em Transporte';
    case 'entregue':
      return 'Entregue';
    case 'reembolsado':
      return 'Reembolsado';
    default:
      return status;
  }
};

const Pedidos = () => {
  const { usuario } = useContext(UserContext);
  const { filters } = useFilters();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [pedidoSelecionado, setPedidoSelecionado] = useState<Pedido | null>(null);
  const [codigoRastreio, setCodigoRastreio] = useState("");
  const [statusSelecionado, setStatusSelecionado] = useState<PedidoStatus>("transporte");
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");

  // Função para formatar valores monetários
  const formatarValor = (valor: string | undefined): string => {
    if (!valor) return 'R$ 0,00';
    try {
      const numero = parseFloat(valor.replace('R$ ', '').replace(',', '.'));
      return `R$ ${numero.toFixed(2).replace('.', ',')}`;
    } catch {
      return valor;
    }
  };

  // Função para extrair valor numérico
  const extrairValor = (valor: string | undefined): number => {
    if (!valor) return 0;
    try {
      return parseFloat(valor.replace('R$ ', '').replace(',', '.'));
    } catch {
      return 0;
    }
  };

  // Identificação de admin e vendedor
  const isAdmin = usuario && (usuario.nome === "admin" || usuario.email === "admin");
  
  // Função para obter o artistHandle do vendedor
  const getVendorHandle = (usuario: Usuario | null) => {
    if (!usuario) return null;
    if (usuario.nome === 'Ceulazur' || usuario.email === 'ceulazur') {
      return '@ceulazur';
    }
    if (usuario.nome === 'Artemisia' || usuario.email === 'artemisia') {
      return '@artemisia';
    }
    return null;
  };

  const vendorHandle = getVendorHandle(usuario);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        let url = 'http://localhost:3000/api/pedidos';
        if (isAdmin && filters.vendor) {
          url += `?vendor=${encodeURIComponent(filters.vendor)}`;
        } else if (!isAdmin && vendorHandle) {
          url += `?vendor=${encodeURIComponent(vendorHandle)}`;
        }
        const response = await fetch(url);
        const data = await response.json();
        setPedidos(data);
      } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
        setPedidos([]);
      }
    };
    fetchPedidos();
  }, [isAdmin, vendorHandle, filters.vendor]);

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

  const salvarAlteracoes = async () => {
    if (!pedidoSelecionado) return;
    try {
      await fetch(`http://localhost:3000/api/pedidos/${pedidoSelecionado.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: statusSelecionado, codigoRastreio }),
      });
      // Recarrega os pedidos do backend com o filtro correto
      let url = 'http://localhost:3000/api/pedidos';
      if (isAdmin && filters.vendor) {
        url += `?vendor=${encodeURIComponent(filters.vendor)}`;
      } else if (!isAdmin && vendorHandle) {
        url += `?vendor=${encodeURIComponent(vendorHandle)}`;
      }
      const res = await fetch(url);
      setPedidos(await res.json());
      alert('Pedido atualizado com sucesso!');
      fecharModal();
    } catch (e) {
      alert('Erro ao atualizar pedido');
    }
  };

  // Calcular totais financeiros (apenas preço do produto, sem frete)
  const totalRecebido = pedidos
    .filter(pedido => pedido.status !== 'reembolsado' && pedido.subtotal)
    .reduce((sum, pedido) => sum + extrairValor(pedido.subtotal), 0);

  const totalReembolsado = pedidos
    .filter(pedido => pedido.status === 'reembolsado' && pedido.subtotal)
    .reduce((sum, pedido) => sum + extrairValor(pedido.subtotal), 0);

  const saldoLiquido = totalRecebido - totalReembolsado;

  // Filtrar pedidos por status
  const pedidosFiltrados = filtroStatus === "todos" 
    ? pedidos 
    : pedidos.filter(pedido => pedido.status === filtroStatus);

  return (
    <div className="p-8 pt-24">
      <h1 className="text-2xl font-bold mb-6">Pedidos</h1>
      
      {/* Resumo Financeiro */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-green-800">Total Recebido</h3>
          <p className="text-2xl font-bold text-green-600">R$ {totalRecebido.toFixed(2).replace('.', ',')}</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-red-800">Total Reembolsado</h3>
          <p className="text-2xl font-bold text-red-600">R$ {totalReembolsado.toFixed(2).replace('.', ',')}</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800">Saldo Líquido</h3>
          <p className={`text-2xl font-bold ${saldoLiquido >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
            R$ {saldoLiquido.toFixed(2).replace('.', ',')}
          </p>
        </div>
              </div>
        
        {/* Filtro de Status */}
        <div className="mb-4 flex justify-between items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtrar por Status:
            </label>
            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 bg-white"
            >
              <option value="todos">Todos os Pedidos</option>
              <option value="preparando">Preparando Entrega</option>
              <option value="transporte">Em Transporte</option>
              <option value="entregue">Entregue</option>
              <option value="reembolsado">Reembolsado</option>
            </select>
          </div>
          <div className="text-sm text-gray-600">
            Mostrando {pedidosFiltrados.length} de {pedidos.length} pedidos
          </div>
        </div>
        
                {pedidosFiltrados.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold">Nenhum pedido encontrado</h3>
            <p className="text-gray-500">
              {filtroStatus === "todos"
                ? (isAdmin 
                    ? "Não há pedidos registrados no sistema." 
                    : "Você ainda não recebeu nenhum pedido dos seus produtos.")
                : `Não há pedidos com status "${filtroStatus}" encontrados.`
              }
            </p>
          </div>
        ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">ID Pedido</th>
              <th className="border border-gray-300 p-2 text-left">Cliente</th>
              <th className="border border-gray-300 p-2 text-left">ID Cliente</th>
              {isAdmin && (
                <th className="border border-gray-300 p-2 text-left">Vendedor</th>
              )}
              <th className="border border-gray-300 p-2 text-left">Produto</th>
              <th className="border border-gray-300 p-2 text-left">Status</th>
              <th className="border border-gray-300 p-2 text-left">Data</th>
              <th className="border border-gray-300 p-2 text-left">Valor Recebido</th>
              <th className="border border-gray-300 p-2 text-left">Valor Reembolsado</th>
            </tr>
          </thead>
          <tbody>
            {pedidosFiltrados.map((pedido) => (
              <tr
                key={pedido.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => abrirModal(pedido)}
              >
                <td className="border border-gray-300 p-2">{pedido.id}</td>
                <td className="border border-gray-300 p-2">{pedido.clienteNome}</td>
                <td className="border border-gray-300 p-2">{pedido.clienteId}</td>
                {isAdmin && (
                  <td className="border border-gray-300 p-2">{pedido.artistHandle}</td>
                )}
                <td className="border border-gray-300 p-2">{pedido.produtoNome}</td>
                <td className={`border border-gray-300 p-2 ${statusColors[pedido.status]}`}>
                  {getStatusDisplay(pedido.status)}
                </td>
                <td className="border border-gray-300 p-2">{pedido.data}</td>
                <td className="border border-gray-300 p-2 font-semibold text-green-600">
                  {formatarValor(pedido.subtotal)}
                </td>
                <td className="border border-gray-300 p-2 font-semibold text-red-600">
                  {pedido.status === 'reembolsado' ? formatarValor(pedido.subtotal) : 'R$ 0,00'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

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
            
            {/* Informações Financeiras */}
            <div className="mt-4 p-3 bg-gray-50 rounded">
              <h3 className="font-semibold mb-2">Informações Financeiras</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p><strong>Preço unitário:</strong> 
                  <span className="text-green-600 font-semibold ml-1">
                    {formatarValor(pedidoSelecionado.produtoPrice)}
                  </span>
                </p>
                <p><strong>Quantidade:</strong> {pedidoSelecionado.quantidade || 1}</p>
                <p><strong>Subtotal:</strong> {formatarValor(pedidoSelecionado.subtotal)}</p>
                <p><strong>Frete:</strong> {formatarValor(pedidoSelecionado.frete)}</p>
                <p className="col-span-2"><strong>Total:</strong> 
                  <span className="font-semibold ml-1">
                    {formatarValor(pedidoSelecionado.total)}
                  </span>
                </p>
              </div>
            </div>

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
                <option value="preparando">Preparando Entrega</option>
                <option value="transporte">Em Transporte</option>
                <option value="entregue">Entregue</option>
                <option value="reembolsado">Reembolsado</option>
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