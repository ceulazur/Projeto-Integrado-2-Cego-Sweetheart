# Documentação de Testes

Este diretório contém toda a documentação relacionada aos testes automatizados do sistema.

## Estrutura de Arquivos

### 📋 Casos de Uso
- **`casosdeuso.txt`** - Histórias de usuário (US01-US27) que servem como base para os testes

### 📊 Planilhas de Avaliação
- **`trabalho final v e v - Avaliando Automação (1).csv`** - Template para avaliar prioridade de automação
- **`trabalho final v e v - Escolhendo Valores de Entrada (1).csv`** - Template para definir classes de equivalência
- **`trabalho final v e v - Execução (1).csv`** - Template para registrar resultados de execução
- **`trabalho final v e v - Reportando Bugs.csv`** - Template para reportar bugs encontrados

### 📈 Resultados dos Testes
- **`test-results-avaliando-automacao.csv`** - Resultados da avaliação de automação
- **`test-results-escolhendo-valores.csv`** - Valores de entrada definidos para os testes

### 📝 Documentação Técnica
- **`IMPLEMENTACOES_REALIZADAS.md`** - Detalhes das implementações realizadas
- **`RESULTADO_FINAL_TESTES.md`** - Resumo final dos resultados dos testes
- **`README.md`** - Este arquivo

## Status dos Testes

### ✅ Testes Implementados
- **37 testes passando** de 38 total
- **Taxa de sucesso: 97.4%**

### 📁 Arquivos de Teste
Os arquivos de teste estão localizados em `src/test/`:
- `admin.test.tsx` - Testes de funcionalidades administrativas
- `auth.test.tsx` - Testes de autenticação
- `products.test.tsx` - Testes de visualização de produtos
- `cart.test.tsx` - Testes de carrinho de compras
- `orders.test.tsx` - Testes de pedidos e reembolsos

### 🔧 Configuração
- `src/test/setup.ts` - Configuração global dos testes
- `src/test/mocks/` - Mocks e componentes simulados

## Casos de Uso Cobertos

### ✅ Implementados e Testados
- **US01-US03**: Cadastro e login de clientes
- **US04-US07**: Visualização de produtos e detalhes
- **US08-US12**: Carrinho de compras e finalização
- **US17-US18**: Cadastro e gerenciamento de artistas
- **US19-US22**: Histórico de pedidos e reembolsos
- **US24**: Acompanhamento de reembolsos (admin)

### ❌ Não Implementados
- **US13-US16**: Cadastro e gerenciamento de produtos pelos artistas
- **US25-US26**: Notificações e status do pedido
- **US27**: Segurança e recuperação de conta

## Tecnologias Utilizadas

- **Vitest** - Framework de testes
- **React Testing Library** - Biblioteca para testar componentes React
- **User Event** - Simulação de interações do usuário
- **Jest DOM** - Matchers para DOM

## Como Executar os Testes

```bash
# Executar todos os testes
npm run test:run

# Executar testes em modo watch
npm run test

# Executar testes com cobertura
npm run test:coverage
```

## Próximos Passos

1. **Implementar casos de uso faltantes** (US13-US16, US25-US27)
2. **Adicionar testes de integração**
3. **Implementar testes end-to-end**
4. **Adicionar testes de performance**
5. **Melhorar cobertura de código**

## Contato

Para dúvidas sobre os testes, consulte a documentação técnica ou entre em contato com a equipe de desenvolvimento. 