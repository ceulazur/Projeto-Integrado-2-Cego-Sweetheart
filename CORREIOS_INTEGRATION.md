# Integração com Correios e Sistema de Frete

## 📦 **Sistema de Status de Pedidos**

### **Fluxo de Status (Baseado em E-commerces Famosos)**

O sistema agora segue o fluxo padrão dos principais e-commerces:

1. **🔄 Preparando Entrega** (Status inicial)
   - Pedido confirmado e pago
   - Produto sendo preparado para envio
   - Vendedor organizando embalagem

2. **🚚 Em Transporte** 
   - Produto enviado aos Correios
   - Código de rastreio disponível
   - Em trânsito para entrega

3. **✅ Entregue**
   - Produto entregue ao cliente
   - Pedido finalizado com sucesso

4. **💰 Reembolsado**
   - Pedido cancelado/reembolsado
   - Valor devolvido ao cliente

### **Cores dos Status**
- **Preparando**: Azul (`bg-blue-500`)
- **Em Transporte**: Amarelo (`bg-yellow-400`) 
- **Entregue**: Verde (`bg-green-500`)
- **Reembolsado**: Vermelho (`bg-red-500`)

### **Migração Realizada**
- ✅ 12 pedidos migrados de "confirmado" para "preparando"
- ✅ 2 pedidos mantidos como "entregue"
- ✅ Novos pedidos começam automaticamente como "preparando"

## 📋 **Sistema de Histórico de Pedidos**

### **Ordenação Inteligente**
O histórico de pedidos do usuário agora é organizado por data de forma inteligente:

- **🔄 Ordenação Automática**: Pedidos mais recentes aparecem primeiro
- **📅 Múltiplas Fontes de Data**: Usa `data_pedido`, `created_at` ou `data` (qual for mais recente)
- **🔍 Filtros Mantêm Ordenação**: Mesmo com filtros ativos, a ordenação é preservada
- **📱 Interface Melhorada**: Data do pedido visível em cada item

### **Fluxo de Ordenação**
1. **Backend**: SQL ordena por data de criação (DESC)
2. **Frontend**: JavaScript reforça ordenação após filtros
3. **Fallback**: Se data inválida, usa data atual
4. **Exibição**: Data formatada em português brasileiro

### **Teste de Ordenação**
- ✅ Script `test-order-sorting.cjs` verifica ordenação
- ✅ 11 pedidos testados com cliente ID 4
- ✅ Ordenação correta: pedidos de 20/07/2025 antes de 18/07/2025

## Funcionalidades Implementadas

### 1. **Busca de CEP**
- Validação automática de formato
- Busca de endereço completo via ViaCEP
- Formatação automática (00000-000)

### 2. **Cálculo de Frete**
- Simulação de preços PAC e SEDEX
- Cálculo baseado em distância e peso
- Prazos de entrega realistas

### 3. **Simulação de Rastreio**
- Geração de códigos de rastreio determinísticos
- Formato: BR + 9 dígitos + 2 letras (ex: BR000000049XU)
- Redirecionamento para site oficial dos Correios
- Botão "LOCALIZAR PEDIDO" no histórico de pedidos

### 4. **Componente React**
- Interface amigável para cálculo de frete
- Integração na página de produto
- Resumo do pedido com frete

### 5. **Fluxo de Entrega**
- Validação automática de CEP na tela de entrega
- Preenchimento automático de endereço
- Cálculo de frete real na tela de escolha de entrega
- Integração completa com o fluxo de checkout

## APIs Utilizadas

### ViaCEP (Gratuita)
- **URL**: https://viacep.com.br/ws/{cep}/json
- **Limite**: 45.000 requisições por hora
- **Uso**: Busca de endereços por CEP

### BrasilAPI (Gratuita)
- **URL**: https://brasilapi.com.br/api
- **Limite**: 100 requisições por minuto
- **Uso**: Dados complementares (não usado no cálculo de frete)

## Estrutura dos Arquivos

```
src/
├── server/
│   ├── correios.ts          # Serviço de integração
│   └── index.ts             # Rotas da API
├── components/sections/
│   └── FreteCalculator.tsx  # Componente React
└── pages/
    ├── VerProduto.tsx       # Página com integração
    ├── Entrega.tsx          # Tela de dados de entrega
    └── EscolhaEntrega.tsx   # Tela de escolha de frete
```

## Rotas da API

### GET `/api/cep/:cep`
Busca informações de um CEP.

**Exemplo:**
```bash
GET /api/cep/01310-100
```

**Resposta:**
```json
{
  "cep": "01310-100",
  "logradouro": "Avenida Paulista",
  "bairro": "Bela Vista",
  "localidade": "São Paulo",
  "uf": "SP"
}
```

### POST `/api/frete/calcular`
Calcula opções de frete.

**Exemplo:**
```bash
POST /api/frete/calcular
{
  "cepOrigem": "01001-000",
  "cepDestino": "01310-100",
  "peso": 1000,
  "comprimento": 20,
  "altura": 20,
  "largura": 20
}
```

**Resposta:**
```json
{
  "cepOrigem": "01001-000",
  "cepDestino": "01310-100",
  "servicos": [
    {
      "codigo": "PAC",
      "nome": "PAC",
      "preco": 18.50,
      "prazo": 3
    },
    {
      "codigo": "SEDEX",
      "nome": "SEDEX",
      "preco": 28.00,
      "prazo": 1
    }
  ]
}
```

## Como Usar

### 1. **No Frontend (React)**

#### Componente de Frete
```tsx
import { FreteCalculator } from '../components/sections/FreteCalculator';

function ProdutoPage() {
  const [selectedFrete, setSelectedFrete] = useState(null);

  const handleFreteSelect = (frete) => {
    setSelectedFrete(frete);
  };

  return (
    <FreteCalculator
      onFreteSelect={handleFreteSelect}
      selectedFrete={selectedFrete}
      cepOrigem="01001-000"
    />
  );
}
```

#### Fluxo de Entrega
```tsx
// Tela de Entrega (Entrega.tsx)
// - Validação automática de CEP
// - Preenchimento automático de endereço
// - Salvamento dos dados no localStorage

// Tela de Escolha de Entrega (EscolhaEntrega.tsx)
// - Cálculo automático de frete baseado no CEP
// - Exibição de opções PAC e SEDEX
// - Seleção e salvamento do frete escolhido

// Telas de Pagamento (Pagamento.tsx, PagamentoCartao.tsx, PagamentoPix.tsx)
// - Carregamento compatível com formato antigo e novo
// - Exibição do nome do serviço de frete
// - Preservação de todos os dados do frete
```

### 2. **Compatibilidade de Dados**

O sistema agora suporta dois formatos de frete:

#### Formato Antigo (Compatibilidade)
```javascript
// Apenas o valor numérico
localStorage.setItem('selectedFrete', '52.72');
```

#### Formato Novo (Dados Completos)
```javascript
// Objeto com informações completas
const freteData = {
  codigo: '04510',
  nome: 'PAC',
  preco: 15.50,
  prazo: 5
};
localStorage.setItem('selectedFrete', JSON.stringify(freteData));
```

#### Lógica de Parsing
```javascript
function parseFrete(storedFrete) {
  if (!storedFrete) return { frete: 52.72, freteData: null };
  
  try {
    const parsedFrete = JSON.parse(storedFrete);
    if (parsedFrete && typeof parsedFrete === 'object' && parsedFrete.preco) {
      return { frete: parsedFrete.preco, freteData: parsedFrete };
    }
  } catch {
    // Fallback para formato antigo
  }
  
  const freteNumber = Number(storedFrete);
  return { 
    frete: !isNaN(freteNumber) ? freteNumber : 52.72, 
    freteData: null 
  };
}
```

### 2. **No Backend (Node.js)**

```javascript
import { CorreiosService } from './correios.js';

// Buscar CEP
const endereco = await CorreiosService.buscarCep('01310-100');

// Calcular frete
const frete = await CorreiosService.calcularFrete(
  '01001-000', // origem
  '01310-100', // destino
  1000,        // peso em gramas
  20,          // comprimento
  20,          // altura
  20           // largura
);
```

## Configuração

### 1. **Instalar Dependências**
```bash
npm install axios
```

### 2. **Configurar CEP de Origem**
No arquivo `src/server/correios.ts`, altere o CEP padrão:
```typescript
private static readonly CEP_ORIGEM = '01001-000'; // São Paulo
```

### 3. **Configurar Dimensões Padrão**
No componente `FreteCalculator.tsx`:
```typescript
peso: 1000,        // 1kg
comprimento: 20,   // 20cm
altura: 20,        // 20cm
largura: 20        // 20cm
```

## Testando a Integração

Execute os scripts de teste:
```bash
# Teste básico da API
node test-correios.cjs

# Teste do fluxo de entrega
node test-entrega-flow.cjs

# Teste da API de produtos
node test-api.cjs

# Teste do proxy do frontend
node test-frontend.cjs

# Teste de compatibilidade do frete
node test-frete-compatibility.cjs

# Teste da nova API Frete Click
node test-frete-click.cjs

# Teste da simulação de rastreio
node test-rastreio-simulation.cjs

# Teste da validação de cartão
node test-cartao-validation.cjs
```

Certifique-se de que o servidor está rodando em `http://localhost:3000`.

## APIs Utilizadas

### 1. **ViaCEP** (Busca de CEP)
- **URL**: `https://viacep.com.br/ws/{cep}/json`
- **Função**: Buscar informações de endereço por CEP
- **Gratuita**: Sim, sem necessidade de API key
- **Dados**: Logradouro, bairro, cidade, UF, etc.

### 2. **Frete Click** (Cálculo de Frete)
- **URL**: `https://www.freteclick.com.br/api/frete`
- **Função**: Calcular preços e prazos de frete
- **Gratuita**: Sim, sem necessidade de token
- **Dados**: Preços reais de PAC, SEDEX e outras transportadoras
- **Fallback**: Cálculo simulado se a API falhar

### 3. **Simulação de Frete** (Fallback)
- **Método**: Cálculo simulado baseado em distância e peso
- **Base**: Dados do ViaCEP para determinar origem/destino
- **Algoritmo**: Fórmulas de preço para PAC e SEDEX
- **Uso**: Apenas quando a API principal falha

## Simulação de Rastreio

### Como Funciona
A simulação de rastreio gera códigos determinísticos baseados no ID do pedido:

```javascript
// Função de geração de código
function generateTrackingCode(orderId) {
  const hash = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  };
  
  const hashValue = hash(orderId);
  const digits = String(hashValue).padStart(9, '0').slice(0, 9);
  const letters = String.fromCharCode(65 + (hashValue % 26)) + 
                  String.fromCharCode(65 + ((hashValue * 2) % 26));
  
  return `BR${digits}${letters}`;
}
```

### Exemplos de Códigos
- Pedido 1: `BR000000049XU`
- Pedido 2: `BR000000050YW`
- Pedido 10: `BR000001567HO`
- Pedido 100: `BR000048625FK`

### URL de Rastreio
Os códigos gerados redirecionam para o site oficial dos Correios:
```
https://rastreamento.correios.com.br/app/index.php?objeto=BR000000049XU
```

### Funcionalidades
- ✅ Códigos determinísticos (mesmo ID = mesmo código)
- ✅ Formato válido (BR + 9 dígitos + 2 letras)
- ✅ Redirecionamento para site oficial
- ✅ Toast de confirmação com código
- ✅ Abertura em nova aba

### Localização no Código
- **Arquivo**: `src/pages/HistoricoPedidos.tsx`
- **Função**: `handleTrackOrder()`
- **Botão**: "LOCALIZAR PEDIDO" (linha 246)

## Tela de Pagamento por Cartão Melhorada

### Funcionalidades Implementadas

#### 1. **Validação de Cartão**
- **Algoritmo de Luhn**: Validação matemática do número do cartão
- **Detecção de Bandeira**: Visa, Mastercard, American Express, Discover, Hipercard, Elo
- **Validação de Data**: Verifica se a data não está expirada
- **Feedback Visual**: Indicadores em tempo real (✓ Válido / ✗ Inválido)

#### 2. **Parcelamento**
- **Opções**: 1x a 12x
- **Cálculo Automático**: Valor da parcela calculado automaticamente
- **Exibição Clara**: Mostra valor da parcela e total
- **Formato**: "3x de R$ 25,00 - Total: R$ 75,00"

#### 3. **Seleção de Banco Emissor**
- **Bancos Disponíveis**: Itaú, Bradesco, Santander, BB, Caixa, Nubank, Inter, C6, Outros
- **Interface**: Dropdown com ícones e nomes
- **Obrigatório**: Campo obrigatório para finalizar pagamento

#### 4. **Cartão de Teste**
- **Botão Dedicado**: "Preencher Cartão de Teste"
- **Dados Automáticos**: Preenche todos os campos automaticamente
- **Sempre Aprovado**: Cartão 4111 1111 1111 1111 sempre passa
- **Toast de Confirmação**: Notifica quando preenchido

#### 5. **Interface Melhorada**
- **Cards Organizados**: Informações agrupadas em cards
- **Ícones**: Lucide React icons para melhor UX
- **Validação Visual**: Cores e indicadores de status
- **Loading State**: Animação durante processamento
- **Responsivo**: Design adaptado para mobile

### Cartão de Teste
```javascript
const TEST_CARD = {
  number: '4111 1111 1111 1111',
  name: 'TESTE TESTE',
  expiry: '12/25',
  cvv: '123',
  cpf: '123.456.789-00'
};
```

### Validação de Cartão
```javascript
// Algoritmo de Luhn
function validateCardNumber(number) {
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
}
```

### Detecção de Bandeira
```javascript
function detectCardBrand(number) {
  const cleanNumber = number.replace(/\s/g, '');
  
  if (/^4/.test(cleanNumber)) return 'Visa';
  if (/^5[1-5]/.test(cleanNumber)) return 'Mastercard';
  if (/^3[47]/.test(cleanNumber)) return 'American Express';
  if (/^6/.test(cleanNumber)) return 'Discover';
  if (/^(606282|3841)/.test(cleanNumber)) return 'Hipercard';
  if (/^(636368|438935|504175|451416|636297)/.test(cleanNumber)) return 'Elo';
  
  return 'Cartão';
}
```

### Localização no Código
- **Arquivo**: `src/pages/PagamentoCartao.tsx`
- **Componentes**: Cards organizados por seção
- **Validação**: Funções de validação em tempo real
- **Teste**: Script `test-cartao-validation.cjs`

## Limitações Atuais

### 1. **API Externa**
- Dependência da disponibilidade da API Frete Click
- Fallback para cálculo simulado em caso de falha

### 2. **Dimensões Fixas**
- Peso padrão de 1kg
- Dimensões padrão de 20x20x20cm

### 3. **CEP de Origem Fixo**
- CEP de origem configurado como São Paulo

### 4. **Rastreio Simulado**
- Códigos de rastreio são simulados (não reais)
- Não há rastreamento real de pacotes



## Melhorias Futuras

### 1. **API Oficial dos Correios**
```javascript
// Implementar contrato comercial
const correiosAPI = new CorreiosAPI({
  usuario: 'seu_usuario',
  senha: 'sua_senha',
  contrato: 'seu_contrato'
});
```

### 2. **Cálculo por Produto**
```javascript
// Dimensões específicas por produto
const frete = await calcularFretePorProduto(
  produto.id,
  cepDestino,
  quantidade
);
```

### 3. **Cache de Resultados**
```javascript
// Cache para evitar requisições repetidas
const cache = new Map();
const frete = await getFreteWithCache(cepOrigem, cepDestino);
```

### 4. **Múltiplos CEPs de Origem**
```javascript
// Diferentes CEPs por região
const cepsOrigem = {
  'SP': '01001-000',
  'RJ': '20040-007',
  'MG': '30112-000'
};
```

## Troubleshooting

### Erro: "CEP não encontrado"
- Verifique se o CEP está no formato correto
- Alguns CEPs podem não existir na base dos Correios

### Erro: "Erro ao calcular frete"
- Verifique a conexão com a internet
- Verifique se as APIs estão funcionando

### Erro: "Servidor não responde"
- Certifique-se de que o servidor está rodando
- Verifique se a porta 3000 está disponível

## Suporte

Para dúvidas ou problemas:
1. Verifique os logs do servidor
2. Execute o script de teste
3. Consulte a documentação das APIs
4. Abra uma issue no repositório 