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

  // Máscara para CPF
  const maskCpf = (value: string) => {
    value = value.replace(/\D/g, '');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    return value;
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
    if (!isFormValid) return;

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
    <main className="relative mx-auto my-0 w-full min-h-screen bg-white max-w-[480px] flex flex-col items-stretch text-2xl font-normal pt-4 pb-[122px]">
      <Header />
      
      {/* Banner */}
      <div className="z-10 w-full text-black font-medium -mt-2.5 px-[5px]">
        <div className="mt-[30px]">
          <img
            src="/checkout-banner.svg"
            alt="Banner checkout"
            className="aspect-[2.08] object-contain w-full rounded-[20px]"
          />
        </div>
      </div>

      {/* Breadcrumb */}
      <nav className="mb-5 text-sm font-light text-black max-sm:text-xs px-4 mt-[17px]">
        <span className="font-normal text-zinc-500">Entrega &gt; </span>
        <span className="font-bold text-black">Pagamento</span>
      </nav>

      <div className="px-4">
        <h2 className="text-3xl font-bold mb-2 text-black">Pagamento com Cartão de Crédito</h2>
        
        {/* Resumo da Compra */}
        <Card className="p-5 mb-6 rounded-3xl border border-black border-solid bg-white bg-opacity-90">
          {cart.length > 0 && (
            <div className="flex flex-col gap-4 pb-5 mb-5 border-b border-solid border-b-black border-b-opacity-20">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <img src={item.imageUrl} alt={item.title} className="shrink-0 rounded-lg h-[75px] w-[59px] object-cover bg-gray-200" />
                  <div>
                    <h3 className="mb-1.5 text-base">{item.title}</h3>
                    <p className="text-base text-stone-500">x {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex justify-between mb-2.5">
            <span>Subtotal</span>
            <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
          </div>
          <div className="flex justify-between mb-5">
            <span>Custo de frete{freteData ? ` (${freteData.nome})` : ''}</span>
            <span>R$ {frete.toFixed(2).replace('.', ',')}</span>
          </div>
          <div className="flex justify-between pt-2.5 text-lg font-semibold border-t border-solid border-t-black border-t-opacity-20">
            <span>Total</span>
            <span>R$ {total.toFixed(2).replace('.', ',')}</span>
          </div>
        </Card>

        {/* Botão Cartão de Teste */}
        <Button
          onClick={fillTestCard}
          className="w-full mb-6 border-2 border-dashed border-blue-500 text-blue-600 hover:bg-blue-50 rounded-2xl py-3 bg-white"
        >
          <CreditCardIcon className="w-5 h-5 mr-2" />
          Preencher Cartão de Teste
        </Button>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit} autoComplete="off">
          {/* Informações do Cartão */}
          <Card className="p-5 rounded-2xl border-2 border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold">Informações do Cartão</h3>
              {cardInfo.brand && (
                <span className="ml-auto text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {cardInfo.brand}
                </span>
              )}
            </div>

            {/* Nome do Titular */}
            <label className="block mb-4">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium">Nome do Titular</span>
              </div>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={nome}
                onChange={e => setNome(e.target.value)}
                required
                maxLength={50}
                placeholder="Como está impresso no cartão"
              />
            </label>

            {/* Número do Cartão */}
            <label className="block mb-4">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium">Número do Cartão</span>
                {numero.length > 0 && (
                  <span className={`ml-auto text-xs px-2 py-1 rounded-full ${
                    cardInfo.isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {cardInfo.isValid ? '✓ Válido' : '✗ Inválido'}
                  </span>
                )}
              </div>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={numero}
                onChange={e => setNumero(maskCardNumber(e.target.value))}
                required
                maxLength={19}
                inputMode="numeric"
                placeholder="0000 0000 0000 0000"
              />
            </label>

            {/* Validade e CVV */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <label className="block">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium">Validade</span>
                  {validade.length === 5 && (
                    <span className={`ml-auto text-xs px-2 py-1 rounded-full ${
                      validateExpiry(validade) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {validateExpiry(validade) ? '✓ Válida' : '✗ Inválida'}
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={validade}
                  onChange={e => setValidade(maskValidade(e.target.value))}
                  required
                  maxLength={5}
                  inputMode="numeric"
                  placeholder="MM/AA"
                />
              </label>
              <label className="block">
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium">CVV</span>
                </div>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={cvv}
                  onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0,4))}
                  required
                  maxLength={4}
                  inputMode="numeric"
                  placeholder="123"
                />
              </label>
            </div>

            {/* CPF */}
            <label className="block mb-4">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium">CPF do Titular</span>
              </div>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={cpf}
                onChange={e => setCpf(maskCpf(e.target.value))}
                required
                maxLength={14}
                inputMode="numeric"
                placeholder="000.000.000-00"
              />
            </label>
          </Card>

          {/* Banco Emissor */}
          <Card className="p-5 rounded-2xl border-2 border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold">Banco Emissor</h3>
            </div>
            <Select value={selectedBank} onValueChange={setSelectedBank}>
              <SelectTrigger className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base">
                <SelectValue placeholder="Selecione o banco emissor" />
              </SelectTrigger>
              <SelectContent>
                {BANKS.map((bank) => (
                  <SelectItem key={bank.id} value={bank.id}>
                    <div className="flex items-center gap-2">
                      <span>{bank.logo}</span>
                      <span>{bank.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Card>

          {/* Parcelamento */}
          <Card className="p-5 rounded-2xl border-2 border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold">Parcelamento</h3>
            </div>
            <Select value={installments} onValueChange={setInstallments}>
              <SelectTrigger className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base">
                <SelectValue placeholder="Selecione o número de parcelas" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num === 1 
                      ? `À vista - R$ ${total.toFixed(2).replace('.', ',')}`
                      : `${num}x de R$ ${(total / num).toFixed(2).replace('.', ',')} - Total: R$ ${total.toFixed(2).replace('.', ',')}`
                    }
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Card>

          {/* Botão de Pagamento */}
          <Button
            type="submit"
            className="w-full bg-black text-white rounded-2xl py-5 text-2xl font-semibold mt-4 focus:ring-2 focus:ring-black focus:border-black disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!isFormValid || isProcessing}
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                Processando...
              </div>
            ) : (
              `FINALIZAR PAGAMENTO - ${installments}x de R$ ${installmentValue.toFixed(2).replace('.', ',')}`
            )}
          </Button>
        </form>
      </div>
    </main>
  );
};

export default PagamentoCartao; 