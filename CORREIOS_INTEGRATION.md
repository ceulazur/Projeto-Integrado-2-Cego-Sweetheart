# Integração com Correios

Este projeto inclui uma integração com APIs de correios para cálculo de frete e validação de CEPs.

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