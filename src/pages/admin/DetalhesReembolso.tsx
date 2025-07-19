import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

export default function DetalhesReembolso() {
  const navigate = useNavigate();
  const { reembolsoId } = useParams<{ reembolsoId: string }>();
  const { user } = useAuth();
  const [reembolso, setReembolso] = useState<Reembolso | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [action, setAction] = useState<'aprovar' | 'rejeitar' | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!user?.id) {
      navigate('/admin/login');
      return;
    }

    if (!reembolsoId) {
      navigate('/admin/reembolsos');
      return;
    }

    fetchReembolso();
  }, [reembolsoId, user?.id, navigate]);

  const fetchReembolso = async () => {
    try {
      setLoading(true);
      console.log('🔍 Buscando reembolso com ID:', reembolsoId);
      
      const response = await fetch(`http://localhost:3000/api/reembolsos/${reembolsoId}`);
      console.log('📊 Resposta da busca:', response.status, response.statusText);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📋 Dados do reembolso:', data);
        setReembolso(data);
      } else {
        console.error('❌ Erro ao buscar reembolso:', response.status);
        setError('Erro ao carregar detalhes do reembolso');
      }
    } catch (err) {
      console.error('❌ Erro na busca:', err);
      setError('Erro ao carregar detalhes do reembolso');
    } finally {
      setLoading(false);
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

  const handleAction = (actionType: 'aprovar' | 'rejeitar') => {
    setAction(actionType);
    setShowConfirmModal(true);
  };

  const confirmAction = async () => {
    if (!action || !reembolso) return;

    setProcessing(true);
    try {
      // Converter 'aprovar' para 'aprovado' e 'rejeitar' para 'rejeitado'
      const status = action === 'aprovar' ? 'aprovado' : 'rejeitado';
      
      console.log('🔄 Enviando requisição:', {
        url: `http://localhost:3000/api/reembolsos/${reembolso.id}`,
        method: 'PUT',
        status: status
      });

      const response = await fetch(`http://localhost:3000/api/reembolsos/${reembolso.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: status }),
      });

      console.log('📊 Resposta do servidor:', response.status, response.statusText);

      if (response.ok) {
        // Navegar de volta para a lista
        navigate('/admin/reembolsos');
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Erro na resposta:', errorData);
        setError(`Erro ao ${action} reembolso`);
      }
    } catch (err) {
      console.error('❌ Erro na requisição:', err);
      setError(`Erro ao ${action} reembolso`);
    } finally {
      setProcessing(false);
      setShowConfirmModal(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Carregando detalhes...</div>
        </div>
      </div>
    );
  }

  if (error || !reembolso) {
    return (
      <div className="p-6">
        <div className="text-red-600 text-center">{error || 'Reembolso não encontrado'}</div>
        <button
          onClick={() => navigate('/admin/reembolsos')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate('/admin/reembolsos')}
            className="p-2 text-gray-600 hover:text-gray-900"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Detalhes do Reembolso</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            reembolso.status === 'pendente' ? 'bg-yellow-500 text-white' :
            reembolso.status === 'aprovado' ? 'bg-green-500 text-white' :
            'bg-red-500 text-white'
          }`}>
            {reembolso.status === 'pendente' ? 'Pendente' :
             reembolso.status === 'aprovado' ? 'Aprovado' : 'Rejeitado'}
          </span>
          <span className="text-gray-600">#{reembolso.id}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informações do Pedido */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">Informações do Pedido</h2>
          <div className="flex items-center gap-4 mb-4">
            <img
              src={reembolso.produtoImageUrl}
              alt={reembolso.produtoNome}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div>
              <h3 className="font-medium text-gray-900">{reembolso.produtoNome}</h3>
              <p className="text-sm text-gray-600">Pedido #{reembolso.orderId}</p>
              <p className="text-lg font-bold text-gray-900">{reembolso.valorReembolso}</p>
            </div>
          </div>
          <div className="space-y-2">
            <p><strong>Cliente:</strong> {reembolso.clienteNome}</p>
            <p><strong>Data da solicitação:</strong> {new Date(reembolso.dataSolicitacao || reembolso.created_at).toLocaleString('pt-BR')}</p>
            {reembolso.status !== 'pendente' && (
              <p><strong>Status:</strong> <span className={`px-2 py-1 rounded text-sm font-medium ${
                reembolso.status === 'aprovado' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {reembolso.status === 'aprovado' ? 'Aprovado' : 'Rejeitado'}
              </span></p>
            )}
          </div>
        </div>

        {/* Informações do Reembolso */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">Detalhes do Reembolso</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Motivo</label>
              <p className="text-gray-900">{getMotivoText(reembolso.motivo)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{reembolso.descricao}</p>
            </div>
            {reembolso.fotoUrl && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Foto do Produto</label>
                <img
                  src={reembolso.fotoUrl}
                  alt="Foto do produto"
                  className="w-full max-w-md rounded-lg border"
                />
              </div>
            )}
          </div>
        </div>

        {/* Dados Bancários */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">Dados Bancários</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Banco</label>
              <p className="text-gray-900">{reembolso.banco}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Agência</label>
              <p className="text-gray-900">{reembolso.agencia}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Conta</label>
              <p className="text-gray-900">{reembolso.conta}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tipo de Conta</label>
              <p className="text-gray-900 capitalize">{reembolso.tipoConta}</p>
            </div>
          </div>
        </div>

        {/* Ações */}
        {reembolso.status === 'pendente' && (
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4">Ações</h2>
            <div className="space-y-3">
              <button
                onClick={() => handleAction('aprovar')}
                disabled={processing}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing && action === 'aprovar' ? 'Processando...' : 'Aprovar Reembolso'}
              </button>
              <button
                onClick={() => handleAction('rejeitar')}
                disabled={processing}
                className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing && action === 'rejeitar' ? 'Processando...' : 'Rejeitar Reembolso'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Confirmação */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              Confirmar {action === 'aprovar' ? 'Aprovação' : 'Rejeição'}
            </h3>
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja {action === 'aprovar' ? 'aprovar' : 'rejeitar'} este reembolso?
              {action === 'aprovar' && ' O valor será reembolsado para o cliente.'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={confirmAction}
                disabled={processing}
                className={`flex-1 py-2 px-4 rounded-lg font-medium text-white ${
                  action === 'aprovar' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {processing ? 'Processando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 