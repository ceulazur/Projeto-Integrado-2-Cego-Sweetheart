import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface Reembolso {
  id: string;
  orderId: string;
  clienteNome: string;
  clienteId: string;
  produtoNome: string;
  produtoImageUrl: string;
  motivo: string;
  descricao: string;
  banco: string;
  agencia: string;
  conta: string;
  tipoConta: string;
  fotoUrl: string;
  status: 'pendente' | 'aprovado' | 'rejeitado';
  dataSolicitacao?: string;
  valorReembolso: string;
  created_at: string;
}

export default function Reembolsos() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reembolsos, setReembolsos] = useState<Reembolso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('todos');

  useEffect(() => {
    if (!user?.id) {
      navigate('/admin/login');
      return;
    }

    fetchReembolsos();
  }, [user?.id, navigate]);

  const fetchReembolsos = async () => {
    try {
      setLoading(true);
      
      // Determinar o vendor handle baseado no usuário logado
      let vendorHandle = '';
      if (user?.email === 'ceulazur') {
        vendorHandle = '@ceulazur';
      } else if (user?.email === 'artemisia') {
        vendorHandle = '@artemisia';
      }
      
      // Construir URL com filtro de vendor se aplicável
      let url = 'http://localhost:3000/api/reembolsos';
      if (vendorHandle && user?.email !== 'admin') {
        url += `?vendor=${encodeURIComponent(vendorHandle)}`;
      }
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setReembolsos(data);
      } else {
        setError('Erro ao carregar reembolsos');
      }
    } catch (err) {
      setError('Erro ao carregar reembolsos');
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pendente':
        return { color: 'bg-yellow-500', text: 'Pendente', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' };
      case 'aprovado':
        return { color: 'bg-green-500', text: 'Aprovado', bgColor: 'bg-green-50', borderColor: 'border-green-200' };
      case 'rejeitado':
        return { color: 'bg-red-500', text: 'Rejeitado', bgColor: 'bg-red-50', borderColor: 'border-red-200' };
      default:
        return { color: 'bg-gray-500', text: 'Desconhecido', bgColor: 'bg-gray-50', borderColor: 'border-gray-200' };
    }
  };

  const getMotivoText = (motivo: string) => {
    const motivos = {
      'produto_defeituoso': 'Produto com defeito',
      'produto_diferente': 'Produto diferente do anunciado',
      'nao_recebido': 'Produto não recebido',
      'arrependimento': 'Arrependimento da compra',
      'duplicado': 'Pedido duplicado',
      'outro': 'Outro motivo'
    };
    return motivos[motivo as keyof typeof motivos] || motivo;
  };

  const filteredReembolsos = reembolsos.filter(reembolso => {
    if (filter === 'todos') return true;
    return reembolso.status === filter;
  });

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Carregando reembolsos...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-red-600 text-center">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Gerenciar Reembolsos</h1>
        <p className="text-gray-600">Aprove ou rejeite solicitações de reembolso dos clientes</p>
      </div>

      {/* Filtros */}
      <div className="mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('todos')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'todos' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Todos ({reembolsos.length})
          </button>
          <button
            onClick={() => setFilter('pendente')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'pendente' 
                ? 'bg-yellow-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Pendentes ({reembolsos.filter(r => r.status === 'pendente').length})
          </button>
          <button
            onClick={() => setFilter('aprovado')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'aprovado' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Aprovados ({reembolsos.filter(r => r.status === 'aprovado').length})
          </button>
          <button
            onClick={() => setFilter('rejeitado')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'rejeitado' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Rejeitados ({reembolsos.filter(r => r.status === 'rejeitado').length})
          </button>
        </div>
      </div>

      {/* Lista de Reembolsos */}
      <div className="space-y-4">
        {filteredReembolsos.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Nenhum reembolso encontrado
          </div>
        ) : (
          filteredReembolsos.map((reembolso) => {
            const statusInfo = getStatusInfo(reembolso.status);
            return (
              <div
                key={reembolso.id}
                className={`${statusInfo.bgColor} ${statusInfo.borderColor} border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow`}
                onClick={() => navigate(`/admin/reembolsos/${reembolso.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={reembolso.produtoImageUrl}
                      alt={reembolso.produtoNome}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{reembolso.produtoNome}</h3>
                      <p className="text-sm text-gray-600">Cliente: {reembolso.clienteNome}</p>
                      <p className="text-sm text-gray-600">Pedido: #{reembolso.orderId}</p>
                      <p className="text-sm text-gray-600">Motivo: {getMotivoText(reembolso.motivo)}</p>
                      <p className="text-sm font-medium text-gray-900">Valor: {reembolso.valorReembolso}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color} text-white`}>
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                      {statusInfo.text}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(reembolso.dataSolicitacao || reembolso.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                
                {reembolso.status === 'pendente' && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      <strong>Descrição:</strong> {reembolso.descricao.substring(0, 100)}...
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
} 