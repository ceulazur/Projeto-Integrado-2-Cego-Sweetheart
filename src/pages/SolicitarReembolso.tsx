import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Input } from '../components/ui/input';
import { useAuth } from '../contexts/AuthContext';

interface Order {
  id: string | number;
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
        valorReembolso: order?.total || ''
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
      <div className="bg-white flex max-w-[480px] w-full flex-col overflow-hidden items-stretch text-2xl font-normal mx-auto pt-4 pb-[122px]">
        <Header />
        <div className="z-10 w-full text-black font-medium -mt-2.5 px-[5px]">
          <div className="mt-[30px] text-center">
            <p>Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="bg-white flex max-w-[480px] w-full flex-col overflow-hidden items-stretch text-2xl font-normal mx-auto pt-4 pb-[122px]">
        <Header />
        <div className="z-10 w-full text-black font-medium -mt-2.5 px-[5px]">
          <div className="mt-[30px] text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => navigate('/historico-pedidos')}
              className="mt-4 bg-blue-600 text-white"
            >
              Voltar ao Histórico
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white flex max-w-[480px] w-full flex-col overflow-hidden items-stretch text-2xl font-normal mx-auto pt-4 pb-[122px]">
      <Header />
      
      <div className="z-10 w-full text-black font-medium -mt-2.5 px-[5px]">
        <div className="mt-[30px]">
          <img
            src="/refund-hero.svg"
            alt="Refund illustration"
            className="aspect-[2.08] object-contain w-full rounded-[20px] opacity-60"
          />
          
          <main className="w-full mt-2">
            <div className="text-4xl font-bold mb-[38px]">
              <span className="text-[rgba(245,0,0,1)]">Solicitar</span> Reembolso
            </div>
            
            {error && <div className="text-red-600 text-center font-semibold mb-2">{error}</div>}

            {/* Informações do Pedido */}
            {order && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Pedido #{order.id}</h3>
                <div className="flex items-center gap-4">
                  <img
                    src={order.produtoImageUrl || '/placeholder.svg'}
                    alt={order.produtoNome}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{order.produtoNome}</h4>
                    <p className="text-sm text-gray-600">Quantidade: {order.quantidade}</p>
                    <p className="text-sm text-gray-600">Total: {order.total}</p>
                    <p className="text-sm text-gray-600">Data: {new Date(order.data_pedido).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
              </div>
            )}

            <p className="text-2xl font-medium mb-[38px] text-black">
              Preencha os dados para solicitar o reembolso.
            </p>

            <form onSubmit={handleSubmit} noValidate>
              <div className="space-y-[38px]">
                {/* Motivo do Reembolso */}
                <div>
                  <label className="block text-lg font-medium mb-2">Motivo do Reembolso *</label>
                  <select
                    value={formData.motivo}
                    onChange={handleInputChange('motivo')}
                    className="w-full bg-[rgba(255,255,255,0.40)] min-h-[79px] px-12 py-[27px] text-2xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">Selecione um motivo</option>
                    <option value="produto_defeituoso">Produto com defeito</option>
                    <option value="produto_diferente">Produto diferente do anunciado</option>
                    <option value="nao_recebido">Produto não recebido</option>
                    <option value="arrependimento">Arrependimento da compra</option>
                    <option value="duplicado">Pedido duplicado</option>
                    <option value="outro">Outro motivo</option>
                  </select>
                  {errors.motivo && <p className="text-red-600 text-sm mt-1">{errors.motivo}</p>}
                </div>

                {/* Descrição Detalhada */}
                <div>
                  <label className="block text-lg font-medium mb-2">Descrição Detalhada *</label>
                  <textarea
                    value={formData.descricao}
                    onChange={handleInputChange('descricao')}
                    placeholder="Descreva detalhadamente o motivo do reembolso..."
                    rows={4}
                    className="w-full bg-[rgba(255,255,255,0.40)] px-12 py-[27px] text-2xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                  />
                  {errors.descricao && <p className="text-red-600 text-sm mt-1">{errors.descricao}</p>}
                </div>

                {/* Campo de Foto - aparece apenas para motivos específicos */}
                {precisaFoto && (
                  <div>
                    <label className="block text-lg font-medium mb-2">
                      Foto do Produto * 
                      <span className="text-sm text-gray-500 ml-2">(Máximo 5MB)</span>
                    </label>
                    
                    {!previewUrl ? (
                      <div className="border-2 border-dashed border-red-300 rounded-lg p-6 text-center hover:border-red-400 transition-colors">
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
                          <svg className="w-12 h-12 text-red-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <span className="text-lg text-gray-600">Clique para selecionar uma foto</span>
                          <span className="text-sm text-gray-500 mt-1">ou arraste e solte aqui</span>
                        </label>
                      </div>
                    ) : (
                      <div className="relative">
                        <img
                          src={previewUrl}
                          alt="Preview da foto"
                          className="w-full max-w-md mx-auto rounded-lg shadow-md"
                        />
                        <button
                          type="button"
                          onClick={removeFoto}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )}
                    
                    {errors.foto && <p className="text-red-600 text-sm mt-1">{errors.foto}</p>}
                    
                    <p className="text-sm text-gray-600 mt-2">
                      📸 Tire uma foto clara do produto para ajudar na análise do reembolso
                    </p>
                  </div>
                )}

                {/* Dados Bancários */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Dados Bancários para Reembolso</h3>
                  
                  <Input
                    id="banco"
                    placeholder="Nome do Banco"
                    type="text"
                    value={formData.banco}
                    onChange={handleInputChange('banco')}
                    error={errors.banco}
                    required
                    className="bg-[rgba(255,255,255,0.40)] min-h-[79px] px-12 py-[27px] text-2xl placeholder:text-black placeholder:opacity-70 border-red-500 focus:border-red-500 focus:ring-red-500"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      id="agencia"
                      placeholder="Agência"
                      type="text"
                      value={formData.agencia}
                      onChange={handleInputChange('agencia')}
                      error={errors.agencia}
                      required
                      className="bg-[rgba(255,255,255,0.40)] min-h-[79px] px-12 py-[27px] text-2xl placeholder:text-black placeholder:opacity-70 border-red-500 focus:border-red-500 focus:ring-red-500"
                    />

                    <Input
                      id="conta"
                      placeholder="Conta"
                      type="text"
                      value={formData.conta}
                      onChange={handleInputChange('conta')}
                      error={errors.conta}
                      required
                      className="bg-[rgba(255,255,255,0.40)] min-h-[79px] px-12 py-[27px] text-2xl placeholder:text-black placeholder:opacity-70 border-red-500 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-lg font-medium mb-2">Tipo de Conta *</label>
                    <select
                      value={formData.tipoConta}
                      onChange={handleInputChange('tipoConta')}
                      className="w-full bg-[rgba(255,255,255,0.40)] min-h-[79px] px-12 py-[27px] text-2xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">Selecione o tipo de conta</option>
                      <option value="corrente">Conta Corrente</option>
                      <option value="poupanca">Conta Poupança</option>
                      <option value="pagamento">Conta de Pagamento</option>
                    </select>
                    {errors.tipoConta && <p className="text-red-600 text-sm mt-1">{errors.tipoConta}</p>}
                  </div>
                </div>

                {/* Botões */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => navigate('/historico-pedidos')}
                    className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300 min-h-[81px] w-full gap-2.5 px-12 py-[26px] text-2xl font-normal rounded-[20px] border border-gray-300 transition-colors"
                  >
                    Cancelar
                  </button>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-[rgba(245,0,0,1)] text-white hover:bg-red-700 min-h-[81px] w-full gap-2.5 px-12 py-[26px] text-2xl font-normal disabled:opacity-50 rounded-[20px] border border-red-600 transition-colors"
                  >
                    {isSubmitting ? 'Enviando...' : 'Solicitar Reembolso'}
                  </button>
                </div>
              </div>
            </form>
          </main>
        </div>
      </div>
    </div>
  );
} 