# Cardápio Digital · CMS

Painel administrativo do restaurante para o projeto Cardápio Digital. Consome a API NestJS (`menu-backend`) — nenhum dado fica fixo no código.

**Stack:** Vite · React 19 · TypeScript · Tailwind CSS 4 · shadcn/ui (base-ui) · Axios · TanStack Query · React Router

## Funcionalidades

| Área | O que faz |
| --- | --- |
| **Categorias** | Listar, cadastrar, editar (nome e situação) e excluir |
| **Produtos** | Listar, cadastrar, editar e excluir, com **filtro por categoria**, foto, descrição e preço |
| **Mesas** | Listar, cadastrar, editar (nome e situação) e excluir |
| **Comandas** | Lista as comandas **em aberto**, com nº de pedidos e total; "Ver pedidos" mostra o detalhe |
| **Pedidos** | Lista os pedidos vinculados às comandas e altera o status de cada um |
| **Kanban (bônus)** | Visão em colunas (Novo → Em preparo → Pronto → Entregue). Arrastar o cartão para a próxima coluna chama a API; também há o botão de avançar (útil no celular) |

Os dados de Comandas e Pedidos se atualizam sozinhos a cada 15 s.

### Regra do status dos pedidos

A API só aceita avançar **uma etapa por vez** (`NEW → PREPARING → READY → DELIVERY`). O Kanban destaca a única coluna de destino válida e, se o cartão for solto em outra, mostra um aviso sem chamar a API. A mudança aparece na hora e é desfeita automaticamente se a API recusar.

## Como rodar

Pré-requisito: o `menu-backend` rodando (por padrão em `http://localhost:3000`).

```bash
npm install
cp .env.example .env   # ajuste VITE_API_URL se a API estiver em outro endereço
npm run dev
```

Outros comandos: `npm run build` (checa tipos e gera o build) e `npm run lint`.

## Ajustes necessários na API

O CMS depende de três pequenas mudanças no `menu-backend`:

1. `DELETE /categories/:id` e `DELETE /products/:id` chamavam `save()` em vez de `remove()`, então nada era excluído.
2. Novo `GET /guest-checks?status=OPENED` para listar comandas (com a mesa).
3. `GET /orders` passa a devolver `guestCheck` (com a mesa) e `items` (com o produto), para ligar cada pedido à sua comanda.

Sem essas mudanças as telas de Comandas e Pedidos não funcionam e a exclusão de categorias/produtos não surte efeito.

## Estrutura

```
src/
├── cases/<entidade>/     dtos, services (Axios), hooks (TanStack Query) e componentes da entidade
├── pages/                uma página por rota
├── components/
│   ├── layout/           menu lateral
│   ├── shared/           toast, estados de tela, diálogos reutilizáveis
│   └── ui/               componentes shadcn/ui
├── hooks/                hooks genéricos
└── lib/                  instância do Axios, formatação
```
