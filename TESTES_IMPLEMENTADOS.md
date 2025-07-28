# Testes Automatizados - Sistema Cego Sweetheart

## Visão Geral

Este documento descreve os testes automatizados implementados para o sistema de e-commerce Cego Sweetheart, baseados nos casos de uso definidos.

## Casos de Uso Implementados

### 1. Autenticação (US01, US02, US03)
- **CT001**: Cadastro com dados válidos
- **CT002**: Cadastro com email inválido
- **CT003**: Cadastro com senhas diferentes
- **CT004**: Login com credenciais válidas
- **CT005**: Login com credenciais inválidas
- **CT006**: Atualização de dados pessoais

### 2. Visualização de Produtos (US04, US05, US06, US07)
- **CT007**: Exibir lista de produtos
- **CT008**: Exibir mensagem sem produtos
- **CT009**: Exibir detalhes do produto
- **CT010**: Produto não encontrado
- **CT011**: Filtrar produtos por nome
- **CT012**: Filtrar produtos por categoria
- **CT013**: Agrupar produtos por artista
- **CT014**: Filtrar por artista específico

### 3. Carrinho de Compras (US08, US09, US10, US11, US12)
- **CT015**: Adicionar produto ao carrinho
- **CT016**: Atualizar quantidade no carrinho
- **CT017**: Remover produto do carrinho
- **CT018**: Alterar quantidade do produto
- **CT019**: Alterar tamanho do produto
- **CT020**: Exibir resumo do pedido
- **CT021**: Finalizar compra com dados válidos
- **CT022**: Rejeitar finalização com carrinho vazio

### 4. Funcionalidades Administrativas (US17, US18, US24)
- **CT023**: Cadastro de artista com dados válidos
- **CT024**: Rejeitar cadastro com email existente
- **CT025**: Listar artistas cadastrados
- **CT026**: Editar dados do artista
- **CT027**: Excluir artista
- **CT028**: Listar solicitações de reembolso
- **CT029**: Aprovar reembolso
- **CT030**: Rejeitar reembolso

### 5. Histórico e Reembolsos (US19, US20, US21, US22)
- **CT031**: Exibir histórico de pedidos
- **CT032**: Exibir detalhes do pedido
- **CT033**: Exibir pedidos do artista
- **CT034**: Cancelar pedido antes do envio
- **CT035**: Impedir cancelamento de pedido enviado
- **CT036**: Solicitar reembolso
- **CT037**: Rejeitar solicitação sem motivo
- **CT038**: Impedir reembolso de pedido não entregue

## Casos de Uso Não Implementados

Os seguintes casos de uso não foram implementados no sistema atual:
- **US13-US16**: Cadastro e gerenciamento de produtos pelos artistas
- **US25-US26**: Notificações e status do pedido
- **US27**: Segurança e recuperação de conta

## Arquivos de Teste

### Testes Implementados
- `src/test/auth.test.tsx` - Testes de autenticação
- `src/test/products.test.tsx` - Testes de visualização de produtos
- `src/test/cart.test.tsx` - Testes de carrinho de compras
- `src/test/admin.test.tsx` - Testes de funcionalidades administrativas
- `src/test/orders.test.tsx` - Testes de histórico de pedidos e reembolsos

### Configuração
- `vitest.config.ts` - Configuração do Vitest
- `src/test/setup.ts` - Setup dos testes

## Planilhas de Resultados

### 1. Avaliando Automação
- **Arquivo**: `test-results-avaliando-automacao.csv`
- **Descrição**: Avaliação da prioridade de automação dos testes
- **Critérios**: Importância, Efetividade, Exemplaridade, Tempo, Integração

### 2. Escolhendo Valores de Entrada
- **Arquivo**: `test-results-escolhendo-valores.csv`
- **Descrição**: Classes de equivalência e valores de entrada para testes
- **Critérios**: Casos válidos e inválidos para cada funcionalidade

### 3. Execução de Testes
- **Arquivo**: `test-results-execucao.csv`
- **Descrição**: Resultados da execução dos testes automatizados
- **Critérios**: Passos, entradas, resultados esperados e encontrados

### 4. Reportando Bugs
- **Arquivo**: `test-results-reportando-bugs.csv`
- **Descrição**: Bugs e melhorias encontrados durante os testes
- **Critérios**: Tipo, criticidade, status e descrição detalhada

## Bugs Encontrados

### Críticos
- **CR1525**: Erro interno do servidor no cadastro de usuários

### Moderados
- **CR1526**: Quantidade não atualizada no ícone do carrinho
- **CR1527**: Validação muito restritiva de CEP
- **CR1529**: Email de notificação não enviado na aprovação de reembolso
- **CR1532**: Falta de loading state no carregamento de produtos

### Baixos
- **CR1528**: Busca não diferencia maiúsculas/minúsculas
- **CR1530**: Falta confirmação visual na solicitação de reembolso
- **CR1531**: Lista de artistas sem paginação

## Como Executar os Testes

### Instalação das Dependências
```bash
npm install
```

### Executar Todos os Testes
```bash
npm run test
```

### Executar Testes em Modo Watch
```bash
npm run test:ui
```

### Executar Testes Uma Vez
```bash
npm run test:run
```

## Tecnologias Utilizadas

- **Vitest**: Framework de testes
- **React Testing Library**: Biblioteca para testar componentes React
- **User Event**: Simulação de interações do usuário
- **Axios Mock**: Mock das chamadas de API
- **Jest DOM**: Matchers adicionais para DOM

## Estrutura dos Testes

Cada arquivo de teste segue a estrutura:
1. **Setup**: Mocks e configurações
2. **Test Wrapper**: Componente que envolve os testes
3. **Casos de Teste**: Testes específicos para cada funcionalidade
4. **Assertions**: Verificações dos resultados esperados

## Cobertura de Testes

Os testes cobrem:
- ✅ Autenticação de usuários
- ✅ Visualização de produtos
- ✅ Funcionalidades do carrinho
- ✅ Área administrativa
- ✅ Histórico de pedidos
- ✅ Sistema de reembolsos

## Próximos Passos

1. Implementar testes para casos de uso não cobertos
2. Adicionar testes de integração
3. Implementar testes de performance
4. Adicionar testes de acessibilidade
5. Implementar testes end-to-end 