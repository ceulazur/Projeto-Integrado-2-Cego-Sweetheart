import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Input } from '../components/ui/input';
import { useAuth } from '../contexts/AuthContext';

interface Order {
  id: string | number;
  produtoId: string | number;
  produtoNome: string;
  produtoImageUrl: string;
  produtoPrice: string;
  quantidade: number;
  total: string;
  data_pedido: string;
  status: string;
  clienteId: string | number;
  created_at: string;
}

interface FormData {
  motivo: string;
  descricao: string;
  contaBancaria: string;
  banco: string;
  agencia: string;
  conta: string;
  tipoConta: string;
  foto: File | null;
}

interface FormErrors {
  motivo?: string;
  descricao?: string;
  contaBancaria?: string;
  banco?: string;
  agencia?: string;
  conta?: string;
  tipoConta?: string;
  foto?: string;
}

export default function SolicitarReembolso() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    motivo: '',
    descricao: '',
    contaBancaria: '',
    banco: '',
    agencia: '',
    conta: '',
    tipoConta: '',
    foto: null
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Verificar se o motivo selecionado requer foto
  const motivosComFoto = ['produto_defeituoso', 'produto_diferente', 'arrependimento'];
  const precisaFoto = motivosComFoto.includes(formData.motivo);

  useEffect(() => {
    if (!user?.id) {
      navigate('/login');
      return;
    }

    if (!orderId) {
      navigate('/historico-pedidos');
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/api/pedidos/cliente/${String(user.id)}`);
        if (!response.ok) {
          throw new Error('Erro ao buscar pedido');
        }
        const orders = await response.json();
        
        const foundOrder = orders.find((o: Order) => String(o.id) === String(orderId));
        
        if (!foundOrder) {
          setError('Pedido não encontrado');
          return;
        }

        // Verificar se o pedido pertence ao usuário logado
        if (String(foundOrder.clienteId) !== String(user.id)) {
          setError('Você não tem permissão para acessar este pedido');
          return;
        }

        // Verificar se o pedido foi entregue
        if (foundOrder.status !== 'entregue') {
          setError('Só é possível solicitar reembolso para pedidos que foram entregues');
          return;
        }

        setOrder(foundOrder);
      } catch (err) {
        console.error('Erro ao buscar pedido:', err);
        setError('Erro ao carregar dados do pedido');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, user?.id, navigate]);

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    
    if (!formData.motivo.trim()) {
      newErrors.motivo = 'Motivo é obrigatório';
    }
    
    if (!formData.descricao.trim()) {
      newErrors.descricao = 'Descrição é obrigatória';
    } else if (formData.descricao.length < 20) {
      newErrors.descricao = 'Descrição deve ter pelo menos 20 caracteres';
    }
    
    if (!formData.banco.trim()) {
      newErrors.banco = 'Banco é obrigatório';
    }
    
    if (!formData.agencia.trim()) {
      newErrors.agencia = 'Agência é obrigatória';
    }
    
    if (!formData.conta.trim()) {
      newErrors.conta = 'Conta é obrigatória';
    }
    
    if (!formData.tipoConta.trim()) {
      newErrors.tipoConta = 'Tipo de conta é obrigatório';
    }

    // Validar foto se o motivo requer
    if (precisaFoto && !formData.foto) {
      newErrors.foto = 'Foto é obrigatória para este motivo';
    }
    
    setErrors(newErrors);
    return newErrors;
  };

  const handleInputChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, foto: 'Por favor, selecione apenas imagens' }));
        return;
      }

      // Validar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, foto: 'A imagem deve ter no máximo 5MB' }));
        return;
      }

      setFormData(prev => ({ ...prev, foto: file }));
      setErrors(prev => ({ ...prev, foto: undefined }));

      // Criar preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFoto = () => {
    setFormData(prev => ({ ...prev, foto: null }));
    setPreviewUrl(null);
    setErrors(prev => ({ ...prev, foto: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setError('Preencha todos os campos obrigatórios corretamente.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Se há foto para upload, fazer upload primeiro
      let fotoUrl = '';
      if (formData.foto) {
        const formDataUpload = new FormData();
        formDataUpload.append('file', formData.foto);
        
        const uploadResponse = await fetch('http://localhost:3000/api/upload', {
          method: 'POST',
          body: formDataUpload,
        });
        
        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          fotoUrl = uploadData.url;
        } else {
          throw new Error('Erro ao fazer upload da foto');
        }
      }

      // Buscar o artistHandle do produto
      let artistHandle = '';
      try {
        const produtoResponse = await fetch(`http://localhost:3000/api/products/${order?.produtoId}`);
        if (produtoResponse.ok) {
          const produto = await produtoResponse.json();
          artistHandle = produto.artistHandle;
        }
      } catch (error) {
        console.error('Erro ao buscar dados do produto:', error);
      }

      // Enviar dados para a API de reembolso
      const reembolsoData = {
        orderId: orderId,
        clienteNome: user?.firstName + ' ' + user?.lastName,
        clienteId: user?.id?.toString(),
        produtoNome: order?.produtoNome || '',
        produtoImageUrl: order?.produtoImageUrl || '',
        motivo: formData.motivo,
        descricao: formData.descricao,
        banco: formData.banco,
        agencia: formData.agencia,
        conta: formData.conta,
        tipoConta: formData.tipoConta,
        fotoUrl: fotoUrl,
        valorReembolso: order?.total || '',
        artistHandle: artistHandle
      };
      
      const response = await fetch('http://localhost:3000/api/reembolsos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reembolsoData),
      });

      if (response.ok) {
        // Navegar para a página de sucesso ou histórico
        navigate('/historico-pedidos');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao solicitar reembolso');
      }
    } catch (error) {
      console.error('Erro ao solicitar reembolso:', error);
      setError('Erro ao enviar solicitação. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user?.id) {
    return null;
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <Header />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
              <svg className="w-8 h-8 text-red-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-4">
              SOLICITAR REEMBOLSO
            </h1>
            <p className="text-xl text-gray-600">Carregando dados do pedido...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error && !order) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <Header />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-4">
              SOLICITAR REEMBOLSO
            </h1>
            <p className="text-xl text-red-600 mb-4">{error}</p>
            <button
              onClick={() => navigate('/historico-pedidos')}
              className="bg-gradient-to-r from-black to-gray-800 text-white px-8 py-4 rounded-2xl font-semibold hover:from-gray-800 hover:to-black transition-all duration-200"
            >
              Voltar ao Histórico
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />
      
      {/* Container principal responsivo */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Banner */}
        <div className="mb-8">
          <img
            src="/refund-hero.svg"
            alt="Refund illustration"
            className="w-full max-w-4xl mx-auto rounded-2xl shadow-lg opacity-80"
          />
        </div>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl lg:text-6xl font-bold mb-8 text-center">
            <span className="text-red-600">Solicitar</span> Reembolso
          </h1>
          
          {error && <div className="text-red-600 text-center font-semibold mb-6 text-lg">{error}</div>}

          {/* Informações do Pedido */}
          {order && (
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Pedido #{order.id}</h3>
              <div className="flex items-center gap-6">
                <img
                  src={order.produtoImageUrl || '/placeholder.svg'}
                  alt={order.produtoNome}
                  className="w-24 h-24 object-cover rounded-xl shadow-sm"
                />
                <div className="flex-1">
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">{order.produtoNome}</h4>
                  <div className="grid grid-cols-2 gap-4 text-lg">
                    <p className="text-gray-600">Quantidade: <span className="font-semibold">{order.quantidade}</span></p>
                    <p className="text-gray-600">Total: <span className="font-semibold">{order.total}</span></p>
                    <p className="text-gray-600">Data: <span className="font-semibold">{new Date(order.data_pedido).toLocaleDateString('pt-BR')}</span></p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <p className="text-2xl font-medium mb-8 text-center text-gray-700">
            Preencha os dados para solicitar o reembolso.
          </p>

          <form onSubmit={handleSubmit} noValidate className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-200">
            <div className="space-y-8">
              {/* Motivo do Reembolso */}
              <div>
                <label className="block text-xl font-semibold mb-4 text-gray-800">Motivo do Reembolso *</label>
                <select
                  value={formData.motivo}
                  onChange={handleInputChange('motivo')}
                  className="w-full h-16 text-lg px-6 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all duration-200 bg-white"
                >
                  <option value="">Selecione um motivo</option>
                  <option value="produto_defeituoso">Produto com defeito</option>
                  <option value="produto_diferente">Produto diferente do anunciado</option>
                  <option value="nao_recebido">Produto não recebido</option>
                  <option value="arrependimento">Arrependimento da compra</option>
                  <option value="duplicado">Pedido duplicado</option>
                  <option value="outro">Outro motivo</option>
                </select>
                {errors.motivo && <p className="text-red-600 text-sm mt-2">{errors.motivo}</p>}
              </div>

              {/* Descrição Detalhada */}
              <div>
                <label className="block text-xl font-semibold mb-4 text-gray-800">Descrição Detalhada *</label>
                <textarea
                  value={formData.descricao}
                  onChange={handleInputChange('descricao')}
                  placeholder="Descreva detalhadamente o motivo do reembolso..."
                  rows={4}
                  className="w-full text-lg px-6 py-4 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all duration-200 resize-none bg-white"
                />
                {errors.descricao && <p className="text-red-600 text-sm mt-2">{errors.descricao}</p>}
              </div>

              {/* Campo de Foto - aparece apenas para motivos específicos */}
              {precisaFoto && (
                <div>
                  <label className="block text-xl font-semibold mb-4 text-gray-800">
                    Foto do Produto * 
                    <span className="text-sm text-gray-500 ml-2">(Máximo 5MB)</span>
                  </label>
                  
                  {!previewUrl ? (
                    <div className="border-2 border-dashed border-red-300 rounded-xl p-8 text-center hover:border-red-400 transition-colors bg-gray-50">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="foto-upload"
                      />
                      <label
                        htmlFor="foto-upload"
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <svg className="w-16 h-16 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <span className="text-xl text-gray-600 mb-2">Clique para selecionar uma foto</span>
                        <span className="text-lg text-gray-500">ou arraste e solte aqui</span>
                      </label>
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={previewUrl}
                        alt="Preview da foto"
                        className="w-full max-w-md mx-auto rounded-xl shadow-lg"
                      />
                      <button
                        type="button"
                        onClick={removeFoto}
                        className="absolute top-4 right-4 bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                  
                  {errors.foto && <p className="text-red-600 text-sm mt-2">{errors.foto}</p>}
                  
                  <p className="text-lg text-gray-600 mt-4 text-center">
                    📸 Tire uma foto clara do produto para ajudar na análise do reembolso
                  </p>
                </div>
              )}

              {/* Dados Bancários */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Dados Bancários para Reembolso</h3>
                
                <Input
                  id="banco"
                  placeholder="Nome do Banco"
                  type="text"
                  value={formData.banco}
                  onChange={handleInputChange('banco')}
                  error={errors.banco}
                  required
                  className="h-16 text-lg px-6 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all duration-200 bg-white"
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Input
                    id="agencia"
                    placeholder="Agência"
                    type="text"
                    value={formData.agencia}
                    onChange={handleInputChange('agencia')}
                    error={errors.agencia}
                    required
                    className="h-16 text-lg px-6 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all duration-200 bg-white"
                  />

                  <Input
                    id="conta"
                    placeholder="Conta"
                    type="text"
                    value={formData.conta}
                    onChange={handleInputChange('conta')}
                    error={errors.conta}
                    required
                    className="h-16 text-lg px-6 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all duration-200 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xl font-semibold mb-4 text-gray-800">Tipo de Conta *</label>
                  <select
                    value={formData.tipoConta}
                    onChange={handleInputChange('tipoConta')}
                    className="w-full h-16 text-lg px-6 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all duration-200 bg-white"
                  >
                    <option value="">Selecione o tipo de conta</option>
                    <option value="corrente">Conta Corrente</option>
                    <option value="poupanca">Conta Poupança</option>
                    <option value="pagamento">Conta de Pagamento</option>
                  </select>
                  {errors.tipoConta && <p className="text-red-600 text-sm mt-2">{errors.tipoConta}</p>}
                </div>
              </div>

              {/* Botões */}
              <div className="flex gap-6 pt-8">
                <button
                  type="button"
                  onClick={() => navigate('/historico-pedidos')}
                  className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300 h-16 text-xl font-semibold rounded-2xl border-2 border-gray-300 transition-all duration-200 hover:shadow-lg"
                >
                  Cancelar
                </button>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 h-16 text-xl font-semibold disabled:opacity-50 rounded-2xl border-2 border-red-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
                >
                  {isSubmitting ? 'Enviando...' : 'Solicitar Reembolso'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
} 