# Projeto Fullstack Vite + React + Express + SQLite

## Visão Geral

Este projeto é um sistema completo de e-commerce de arte, com frontend em React (Vite, TypeScript, Tailwind, shadcn-ui) e backend em Node.js (Express, SQLite).

- **Frontend:** Vite + React + TypeScript + Tailwind CSS + shadcn-ui
- **Backend:** Express + SQLite (persistência local)
- **Scripts integrados:** Frontend e backend rodam juntos com um único comando

---

## Como rodar localmente

### Pré-requisitos
- Node.js 18+ (recomendado Node 20+)
- npm

### Instalação

```sh
# Clone o repositório
$ git clone <URL_DO_SEU_REPO>
$ cd <NOME_DA_PASTA>

# Instale as dependências
$ npm install
```

### Rodando o projeto (frontend + backend juntos)

```sh
# Inicie frontend e backend juntos
$ npm run dev
```
- O frontend (Vite) estará disponível em: http://localhost:5173
- O backend (API Express) estará disponível em: http://localhost:3000

> **Obs:** O comando `npm run dev` usa o pacote `concurrently` para rodar ambos os servidores ao mesmo tempo.

### Scripts úteis
- `npm run dev` — Inicia frontend e backend juntos
- `npm run server` — Inicia apenas o backend (Express)
- `npm run build` — Builda o frontend para produção
- `npm run lint` — Checa problemas de lint

---

## Estrutura do Projeto

```
├── src/
│   ├── components/         # Componentes React reutilizáveis
│   ├── pages/              # Páginas principais do app
│   ├── server/             # Código do backend Express
│   ├── hooks/              # Custom hooks
│   ├── contexts/           # Contextos React
│   └── ...
├── public/                 # Assets públicos
├── users.db                # Banco SQLite local
├── package.json            # Scripts e dependências
└── ...
```

---

## Cartão de Teste (Checkout)
- **Número:** 4111 1111 1111 1111
- **Nome:** Qualquer nome
- **Validade:** Qualquer data futura (ex: 12/25)
- **CVV:** 123
- **CPF:** Qualquer CPF válido (ex: 123.456.789-00)

---

## Observações
- O projeto é totalmente open source e pode ser customizado.

---

## Dúvidas?
Abra uma issue ou entre em contato com o desenvolvedor!
