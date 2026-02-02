# 🛍️ E-commerce Sneaker Platform | SNEAKLINE

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![GraphQL](https://img.shields.io/badge/GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white)](https://graphql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)

[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

> 🇧🇷 **Loja #1 de Sneakers do Brasil** - Uma plataforma completa de e-commerce com foco no mercado brasileiro, featuring autenticação segura, processamento de pagamentos, e experiência de usuário moderna.

## 📋 Sobre o Projeto

Este projeto é uma plataforma de e-commerce completa desenvolvida como um monorepo TypeScript, especializada na venda de sneakers no mercado brasileiro. A aplicação oferece uma experiência de compra moderna com catálogo de produtos, carrinho de compras, autenticação de usuários, e processamento de pagamentos via Stripe.

### 🌟 Características Principais

- 🏪 **Catálogo de Produtos Completo** - Listagem, busca
- 👤 **Sistema de Autenticação** - JWT com refresh tokens e role-based access control
- 🛒 **Carrinho de Compras** - Gerenciamento de itens com cálculo automático de totais
- 💳 **Processamento de Pagamentos** - Integração segura com Stripe
- 📦 **Gestão de Pedidos** - Fluxo completo de pedido com status tracking
- 🏠 **Endereços de Entrega** - Cadastro e gerenciamento de endereços
- 🔍 **Busca Avançada** - Full-text search com PostgreSQL
- 📱 **Design Responsivo** - Experiência otimizada para desktop
- 🎨 **Interface Moderna** - UI components com Tailwind CSS e Shadcn UI
- ⚡ **Performance Otimizada** - Caching com Redis e lazy loading

## 🏗️ Arquitetura

```
ecommerce-monorepo/
├── apps/
│   ├── api/                 # Backend GraphQL API (Node.js + TypeScript)
│   │   ├── src/
│   │   │   ├── graphql/     # Resolvers e Schema GraphQL
│   │   │   ├── utils/       # Utilitários (auth, validation, rate limiting)
│   │   │   └── server/      # Configuração do servidor Express
│   │   └── prisma/          # Schema e migrations do banco de dados
│   └── web/                 # Frontend React (Next.js 15)
│       ├── src/
│       │   ├── features/    # Features organizadas por domínio
│       │   ├── components/  # Componentes UI reutilizáveis
│       │   ├── store/       # Estado global (Zustand)
│       │   └── api/         # Clientes GraphQL e hooks
│       └── public/          # Assets estáticos
├── package.json             # Scripts do monorepo
└── package.json             # Scripts do monorepo
```

## 🛠️ Stack Tecnológico

### Backend
- **Runtime**: Node.js com TypeScript
- **API Framework**: Apollo Server (GraphQL)
- **Banco de Dados**: PostgreSQL com Prisma ORM
- **Cache**: Redis para rate limiting e cache
- **Autenticação**: JWT com refresh tokens
- **Pagamentos**: Stripe
- **Upload de Imagens**: Cloudinary
- **Rate Limiting**: Redis-based sliding window

### Frontend
- **Framework**: Next.js 15 com App Router
- **UI Framework**: React 19
- **Styling**: Tailwind CSS + Shadcn UI
- **State Management**: Zustand
- **Client GraphQL**: Apollo Client
- **Form Handling**: React Hook Form com Zod validation
- **Testing**: Vitest + Playwright + Storybook

### Infraestrutura
- **Package Manager**: pnpm (monorepo)
- **Database**: PostgreSQL 13+ Prisma
- **Cache**: Redis 6+ Cloud
- **Type Generation**: GraphQL CodeGen
- **Development**: Hot reloading e ambiente de desenvolvimento completo

## 🚀 Getting Started

### Pré-requisitos

- Node.js 18+
- pnpm (recomendado)
- PostgreSQL 13+
- Redis 6+

### Instalação

1. **Clone o repositório**
   ```bash
   git clone <repository-url>
   cd ecommerce-monorepo
   ```

2. **Instale as dependências**
   ```bash
   pnpm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   # Copie os arquivos de ambiente
   cp apps/api/.env.example apps/api/.env
   cp apps/web/.env.example apps/web/.env
   
   # Configure suas credenciais (Stripe, Database, etc.)
   ```

4. **Configure o banco de dados PostgreSQL**
   ```bash
   # Crie um banco de dados para o projeto
   createdb ecommerce
   
   # Configure as variáveis de ambiente no apps/api/.env
   DATABASE_URL="postgresql://username:password@localhost:5432/ecommerce"
   ```

5. **Configure o Redis**
   ```bash
   # Inicie o serviço Redis
   redis-server
   
   # Configure no apps/api/.env
   REDIS_URL="redis://localhost:6379"
   ```

6. **Rode as migrations do banco de dados**
   ```bash
   cd apps/api
   pnpm prisma:migrate
   pnpm prisma:generate
   ```

7. **Inicie os serviços em terminais separados**
   
   **Terminal 1 - API Backend:**
   ```bash
   cd apps/api
   pnpm dev
   ```
   
   **Terminal 2 - Frontend Web:**
   ```bash
   cd apps/web
   pnpm dev
   ```

8. **Acesse as aplicações**
   - Frontend: http://localhost:3000
   - GraphQL Playground: http://localhost:4000/graphql
   - API Health Check: http://localhost:4000/health

### Scripts Úteis

```bash
# Database
pnpm db:migrate                  # Roda migrations do Prisma
pnpm db:seed                     # Popula banco com dados de exemplo

# Prisma
pnpm prisma:generate             # Gera Prisma Client
pnpm prisma:migrate              # Roda migrations
pnpm prisma:seed                 # Popula banco com dados de exemplo

# Development
pnpm dev                        # Inicia API e Web em modo desenvolvimento
pnpm dev:api                    # Inicia apenas API backend
pnpm dev:web                    # Inicia apenas frontend web

# Production
pnpm build                      # Build para produção de todos os apps
pnpm start:prod                 # Inicia aplicações em produção
pnpm start                      # Inicia aplicações (build + start)
pnpm start:api                  # Inicia apenas API em produção
pnpm start:web                  # Inicia apenas Web em produção

# Testing
pnpm test                       # Roda todos os testes (API + Web)
pnpm test:web                   # Roda testes do Web
pnpm test:coverage              # Roda testes com cobertura

# Quality Assurance
pnpm lint                       # Roda linting em todos os pacotes
pnpm lint:fix                   # Corrige problemas de lint automaticamente
pnpm lint:web                   # Roda lint apenas no Web
pnpm typecheck                  # Verifica tipos TypeScript em todos os apps
pnpm typecheck:api              # Verifica tipos apenas na API
pnpm typecheck:web              # Verifica tipos apenas no Web

# Maintenance
pnpm clean                      # Remove build artifacts e node_modules
pnpm clean:node_modules         # Remove apenas node_modules
pnpm setup                      # Setup completo do projeto (install + db + migrations + seed)
```

## 🎯 Features Detalhadas

### 🔐 Autenticação & Autorização

- **JWT Authentication**: Access tokens + Refresh tokens
- **Role-Based Access Control**: User e Admin roles
- **Password Security**: Bcrypt hashing com validação forte
- **Session Management**: Cookies httpOnly com configurações seguras

```typescript
// Exemplo de middleware de autenticação
export const requireAuth = (context: Context) => {
  if (!context.user) {
    throw new GraphQLError("Authentication required", {
      extensions: { code: "UNAUTHORIZED" }
    })
  }
  return context.user
}
```

### 🛒 Sistema de Carrinho

- **State Management**: Zustand para estado global do carrinho
- **Persistence**: Carrinho persistido em localStorage
- **Real-time Updates**: Atualização em tempo real de totais
- **Validation**: Validação de estoque e preços

### 💳 Processamento de Pagamentos

- **Stripe Integration**: Payment Intents com webhook handling
- **Idempotency**: Prevenção de pagamentos duplicados
- **Security**: Webhook signature verification
- **Brazilian Market**: Suporte para BRL e métodos locais

```typescript
// Criação de Payment Intent
const paymentIntent = await stripe.paymentIntents.create({
  amount: amountInCents,
  currency: "brl",
  metadata: { orderId: order.id.toString() }
})
```

### 🔍 Busca e Filtragem

- **Full-Text Search**: PostgreSQL
- **Input Sanitization**: Prevenção de SQL injection
- **Rate Limiting**: Proteção contra abuso de busca
- **Performance**: Queries otimizadas com indexes

## 🔒 Security Implementation

Este projeto implementa várias camadas de segurança:

### Autenticação
- ✅ JWT com refresh tokens
- ✅ Role-based access control (RBAC)
- ✅ Password strength requirements
- ✅ Secure cookie configuration

### API Security
- ✅ Input validation & sanitization
- ✅ SQL injection prevention
- ✅ Rate limiting com Redis
- ✅ CORS configuration
- ✅ Error handling sem information leakage

### Payment Security
- ✅ Stripe webhook signature verification
- ✅ Idempotency key handling
- ✅ Secure token management
- ✅ PCI compliance considerations

### Infrastructure Security
- ✅ Environment variables separation
- ✅ Database connection security
- ✅ Redis authentication
- ✅ Process isolation

## 🧪 Testing Strategy

### Frontend Testing
- **Unit Tests**: Vitest + Testing Library
- **Integration Tests**: Component interactions
- **E2E Tests**: Playwright com multi-browser support
- **Component Testing**: Storybook com visual testing

### Test Coverage
```bash
# Rodar todos os testes
pnpm test:web

# Verificar cobertura
pnpm test:web --coverage
```

## 📊 Performance & Optimization

### Frontend Optimizations
- **Code Splitting**: Lazy loading por rotas
- **Image Optimization**: Next.js Image component
- **Caching Strategy**: Apollo Client cache

### Backend Optimizations
- **Database Indexes**: Otimização de queries
- **Redis Caching**: Rate limiting e cache de dados
- **Connection Pooling**: Prisma connection management
- **Query Optimization**: N+1 prevention com DataLoader

## 🎨 UI/UX Features

- **Error Handling**: User-friendly error messages
- **Accessibility**: WCAG compliance considerations
- **Micro-interactions**: Transições e animações suaves


## 🚀 Deployment

### Production Setup

1. **Environment Variables**
   ```bash
   NODE_ENV=production
   DATABASE_URL=postgresql://...
   STRIPE_SECRET_KEY=sk_live_...
   REDIS_URL=redis://...
   ```

2. **Build Applications**
   ```bash
   pnpm build
   ```

3. **Inicie os serviços em produção**
   ```bash
   # Build as aplicações
   pnpm build
   
   # Inicie os serviços em terminais separados ou usando PM2
   # Terminal 1:
   cd apps/api && pnpm start
   
   # Terminal 2:
   cd apps/web && pnpm start
   ```
<div align="center">

[![Portfolio](https://img.shields.io/badge/Portfolio-Visit-blue?style=for-the-badge)](https://portifolio-rho-blush.vercel.app)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/jonatas-eduardo/)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-black?style=for-the-badge&logo=github)](https://github.com/Jonao6)

</div>
