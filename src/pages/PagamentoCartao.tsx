import React, { useEffect, useState } from 'react';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useNavigate } from 'react-router-dom';
import { useUpdateProduct, useProducts } from '../hooks/useProducts';
import { useAuth, getCartKey } from '../contexts/AuthContext';

import { CreditCard, Calendar, Lock, User, Building2, CreditCardIcon } from 'lucide-react';

const DEFAULT_FRETE = 52.72;

interface CartItem {
  id: string;
  title: string;
  price: string;
  imageUrl: string;
  quantity: number;
  category: string;
}

interface FreteData {
  codigo: string;
  nome: string;
  preco: number;
  prazo: number;
}

interface CardInfo {
  type: string;
  brand: string;
  isValid: boolean;
}

interface FormErrors {
  numero?: string;
  nome?: string;
  validade?: string;
  cvv?: string;
  cpf?: string;
  selectedBank?: string;
}

const BANKS = [
  { id: 'itau', name: 'Itaú', logo: '🏦' },
  { id: 'bradesco', name: 'Bradesco', logo: '🏦' },
  { id: 'santander', name: 'Santander', logo: '🏦' },
  { id: 'bb', name: 'Banco do Brasil', logo: '🏦' },
  { id: 'caixa', name: 'Caixa Econômica', logo: '🏦' },
  { id: 'nubank', name: 'Nubank', logo: '💜' },
  { id: 'inter', name: 'Banco Inter', logo: '🟡' },
  { id: 'c6', name: 'C6 Bank', logo: '⚫' },
  { id: 'outros', name: 'Outros', logo: '🏦' }
];

const TEST_CARD = {
  number: '4111 1111 1111 1111',
  name: 'TESTE TESTE',
  expiry: '12/25',
  cvv: '123',
  cpf: '123.456.789-00'
};

const PagamentoCartao: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [frete, setFrete] = useState(DEFAULT_FRETE);
  const [freteData, setFreteData] = useState<FreteData | null>(null);
  const [nome, setNome] = useState('');
  const [numero, setNumero] = useState('');
  const [validade, setValidade] = useState('');
  const [cvv, setCvv] = useState('');
  const [cpf, setCpf] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [installments, setInstallments] = useState('1');
  const [cardInfo, setCardInfo] = useState<CardInfo>({ type: '', brand: '', isValid: false });
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const updateProduct = useUpdateProduct();
  const { data: allProducts } = useProducts();
  const { user } = useAuth();
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    // Carregar dados do carrinho
    const stored = localStorage.getItem(getCartKey(user?.id));
    if (stored) {
      try {
        setCart(JSON.parse(stored));
      } catch {
        setCart([]);
      }
    }

    // Carregar dados do frete (compatibilidade com formato antigo e novo)
    const storedFrete = localStorage.getItem('selectedFrete');
    if (storedFrete) {
      try {
        const parsedFrete = JSON.parse(storedFrete);
        if (parsedFrete && typeof parsedFrete === 'object' && parsedFrete.preco) {
          setFrete(parsedFrete.preco);
          setFreteData(parsedFrete);
        } else {
          const freteNumber = Number(storedFrete);
          if (!isNaN(freteNumber)) {
            setFrete(freteNumber);
            setFreteData(null);
          } else {
            setFrete(DEFAULT_FRETE);
            setFreteData(null);
          }
        }
      } catch {
        const freteNumber = Number(storedFrete);
        if (!isNaN(freteNumber)) {
          setFrete(freteNumber);
          setFreteData(null);
        } else {
          setFrete(DEFAULT_FRETE);
          setFreteData(null);
        }
      }
    } else {
      setFrete(DEFAULT_FRETE);
      setFreteData(null);
    }
  }, [user?.id]);

  const subtotal = cart.reduce((acc, item) => acc + (parseFloat(item.price.replace('R$', '').replace(',', '.')) * item.quantity), 0);
  const total = subtotal + frete;
  const installmentValue = total / parseInt(installments);

  // Detectar bandeira do cartão
  const detectCardBrand = (number: string): string => {
    const cleanNumber = number.replace(/\s/g, '');
    
    if (/^4/.test(cleanNumber)) return 'Visa';
    if (/^5[1-5]/.test(cleanNumber)) return 'Mastercard';
    if (/^3[47]/.test(cleanNumber)) return 'American Express';
    if (/^6/.test(cleanNumber)) return 'Discover';
    if (/^(606282|3841)/.test(cleanNumber)) return 'Hipercard';
    if (/^(636368|438935|504175|451416|636297)/.test(cleanNumber)) return 'Elo';
    
    return 'Cartão';
  };

  // Validar número do cartão (algoritmo de Luhn)
  const validateCardNumber = (number: string): boolean => {
    const cleanNumber = number.replace(/\s/g, '');
    if (cleanNumber.length < 13 || cleanNumber.length > 19) return false;
    
    let sum = 0;
    let isEven = false;
    
    for (let i = cleanNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanNumber[i]);
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    return sum % 10 === 0;
  };

  // Validar data de validade
  const validateExpiry = (expiry: string): boolean => {
    if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;
    
    const [month, year] = expiry.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    const cardMonth = parseInt(month);
    const cardYear = parseInt(year);
    
    if (cardMonth < 1 || cardMonth > 12) return false;
    if (cardYear < currentYear || (cardYear === currentYear && cardMonth < currentMonth)) return false;
    
    return true;
  };

  // Máscara para número do cartão
  const maskCardNumber = (value: string) => {
    return value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').trim().slice(0, 19);
  };

  // Máscara para validade MM/AA
  const maskValidade = (value: string) => {
    value = value.replace(/\D/g, '');
    if (value.length > 2) value = value.slice(0,2) + '/' + value.slice(2,4);
    return value.slice(0, 5);
  };

  // Máscara para CPF (corrigida para aceitar só 11 dígitos)
  const maskCpf = (value: string) => {
    value = value.replace(/\D/g, '').slice(0, 11);
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    return value;
  };

  // Validação dos campos
  const validateFields = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!numero || numero.length !== 19 || !cardInfo.isValid) newErrors.numero = 'Número do cartão inválido';
    if (!nome) newErrors.nome = 'Nome obrigatório';
    if (!validade || validade.length !== 5 || !validateExpiry(validade)) newErrors.validade = 'Validade inválida';
    if (!cvv || cvv.length < 3) newErrors.cvv = 'CVV inválido';
    if (!cpf || cpf.length !== 14) newErrors.cpf = 'CPF inválido';
    if (!selectedBank) newErrors.selectedBank = 'Selecione o banco';
    return newErrors;
  };

  // Atualizar informações do cartão
  useEffect(() => {
    const cleanNumber = numero.replace(/\s/g, '');
    const brand = detectCardBrand(cleanNumber);
    const isValid = validateCardNumber(cleanNumber);
    
    setCardInfo({
      type: cleanNumber.length >= 13 ? 'credit' : '',
      brand,
      isValid
    });
  }, [numero]);

  // Preencher cartão de teste
  const fillTestCard = () => {
    setNumero(TEST_CARD.number);
    setNome(TEST_CARD.name);
    setValidade(TEST_CARD.expiry);
    setCvv(TEST_CARD.cvv);
    setCpf(TEST_CARD.cpf);
    setSelectedBank('nubank');
    setInstallments('1');
  };

  const isFormValid = nome && 
    numero.length === 19 && 
    cardInfo.isValid &&
    validade.length === 5 && 
    validateExpiry(validade) &&
    cvv.length >= 3 && 
    cpf.length === 14 &&
    selectedBank;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateFields();
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setIsProcessing(true);

    try {
      // Simular processamento de pagamento
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Verificar se é cartão de teste
      const isTestCard = numero.replace(/\s/g, '') === '4111111111111111';
      
      if (!isTestCard) {
        // Simular falha para cartões não-teste (exceto alguns específicos)
        const randomFail = Math.random() < 0.3; // 30% de chance de falha
        if (randomFail) {
          throw new Error('Cartão recusado. Verifique os dados e tente novamente.');
        }
      }

      // Salvar pedido na API para cada item do carrinho
      for (const item of cart) {
        const produtoAtual = allProducts?.find(p => p.id === item.id);
        if (produtoAtual) {
          const pedidoData = {
            clienteNome: `${user?.firstName} ${user?.lastName}`,
            clienteId: user?.id.toString(),
            produtoId: item.id,
            produtoNome: item.title,
            produtoImageUrl: item.imageUrl,
            produtoPrice: item.price,
            quantidade: item.quantity,
            subtotal: subtotal.toFixed(2),
            frete: frete.toFixed(2),
            total: total.toFixed(2),
            formaPagamento: `Cartão de Crédito - ${cardInfo.brand} (${installments}x)`
          };

          const response = await fetch('http://localhost:3000/api/pedidos', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(pedidoData),
          });

          if (!response.ok) {
            throw new Error('Erro ao criar pedido');
          }

          await updateProduct.mutateAsync({
            ...produtoAtual,
            quantity: Math.max(0, produtoAtual.quantity - item.quantity),
          });
        }
      }

      // Salvar dados do pedido
      if (user?.id) {
        localStorage.setItem(`lastOrderTotal_${user.id}`, JSON.stringify({ 
          subtotal, 
          frete, 
          total,
          installments: parseInt(installments),
          installmentValue
        }));
      }
      
      // Limpar carrinho
      localStorage.removeItem(getCartKey(user?.id));
      
      navigate('/pagamento-sucesso');
    } catch (error) {
      console.error('Erro ao finalizar compra:', error);
      alert(error instanceof Error ? error.message : 'Erro ao finalizar compra. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />
      
      {/* Container principal responsivo */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Banner */}
        <div className="mb-8">
          <img
            src="/checkout-banner.svg"
            alt="Banner checkout"
            className="w-full max-w-4xl mx-auto rounded-2xl shadow-lg"
          />
        </div>

        {/* Breadcrumb */}
        <nav className="mb-8 text-lg font-medium text-gray-600 max-w-4xl mx-auto">
          <span className="text-gray-500">Entrega &gt; </span>
          <span className="font-bold text-black">Pagamento</span>
        </nav>

        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold mb-8 text-black">Pagamento com Cartão</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Formulário do Cartão */}
            <Card className="p-8 rounded-2xl border-2 border-gray-200 bg-white shadow-lg">
              <div className="flex items-center gap-3 mb-8">
                <CreditCardIcon className="w-8 h-8 text-blue-600" />
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">Dados do Cartão</h3>
              </div>
              
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-3">
                    Número do Cartão
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={numero}
                      onChange={(e) => setNumero(maskCardNumber(e.target.value))}
                      placeholder="0000 0000 0000 0000"
                      className="w-full h-14 text-lg px-6 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                      required
                    />
                    {errors.numero && <p className="text-red-600 text-sm mt-1">{errors.numero}</p>}
                    {cardInfo.brand && (
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm font-semibold text-blue-600">
                        {cardInfo.brand}
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-3">
                    Nome no Cartão
                  </label>
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value.toUpperCase())}
                    placeholder="NOME COMO ESTÁ NO CARTÃO"
                    className="w-full h-14 text-lg px-6 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                    required
                  />
                  {errors.nome && <p className="text-red-600 text-sm mt-1">{errors.nome}</p>}
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-lg font-semibold text-gray-700 mb-3">
                      Validade
                    </label>
                    <input
                      type="text"
                      value={validade}
                      onChange={(e) => setValidade(maskValidade(e.target.value))}
                      placeholder="MM/AA"
                      className="w-full h-14 text-lg px-6 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                      required
                    />
                    {errors.validade && <p className="text-red-600 text-sm mt-1">{errors.validade}</p>}
                  </div>
                  <div>
                    <label className="block text-lg font-semibold text-gray-700 mb-3">
                      CVV
                    </label>
                    <input
                      type="text"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="123"
                      className="w-full h-14 text-lg px-6 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                      required
                    />
                    {errors.cvv && <p className="text-red-600 text-sm mt-1">{errors.cvv}</p>}
                  </div>
                </div>
                
                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-3">
                    CPF do Titular
                  </label>
                  <input
                    type="text"
                    value={cpf}
                    onChange={(e) => setCpf(maskCpf(e.target.value))}
                    placeholder="000.000.000-00"
                    className="w-full h-14 text-lg px-6 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                    required
                  />
                  {errors.cpf && <p className="text-red-600 text-sm mt-1">{errors.cpf}</p>}
                </div>
                
                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-3">
                    Banco Emissor
                  </label>
                  <Select value={selectedBank} onValueChange={setSelectedBank}>
                    <SelectTrigger className="h-14 text-lg px-6 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200">
                      <SelectValue placeholder="Selecione o banco" />
                    </SelectTrigger>
                    <SelectContent>
                      {BANKS.map((bank) => (
                        <SelectItem key={bank.id} value={bank.id}>
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{bank.logo}</span>
                            <span className="text-lg">{bank.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.selectedBank && <p className="text-red-600 text-sm mt-1">{errors.selectedBank}</p>}
                </div>
                
                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-3">
                    Parcelas
                  </label>
                  <Select value={installments} onValueChange={setInstallments}>
                    <SelectTrigger className="h-14 text-lg px-6 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}x de R$ {installmentValue.toFixed(2).replace('.', ',')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-black to-gray-800 text-white rounded-2xl py-6 text-2xl font-bold hover:from-gray-800 hover:to-black transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isProcessing ? 'PROCESSANDO...' : 'FINALIZAR PAGAMENTO'}
                </Button>
              </form>
            </Card>
            
            {/* Resumo da Compra */}
            <Card className="p-8 rounded-2xl border-2 border-gray-200 bg-white shadow-lg h-fit">
              <div className="flex items-center gap-3 mb-8">
                <Building2 className="w-8 h-8 text-green-600" />
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">Resumo da Compra</h3>
              </div>
              
              <div className="space-y-4 text-lg lg:text-xl">
                <div className="flex justify-between">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-semibold">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Custo de frete{freteData ? ` (${freteData.nome})` : ''}</span>
                  <span className="font-semibold">R$ {frete.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between pt-4 text-xl lg:text-2xl font-bold border-t-2 border-gray-200">
                  <span>Total</span>
                  <span>R$ {total.toFixed(2).replace('.', ',')}</span>
                </div>
                {parseInt(installments) > 1 && (
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mt-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-blue-600 mb-2">
                        Parcelado em {installments}x
                      </div>
                      <div className="text-xl font-bold text-blue-700">
                        R$ {installmentValue.toFixed(2).replace('.', ',')} por parcela
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PagamentoCartao; 