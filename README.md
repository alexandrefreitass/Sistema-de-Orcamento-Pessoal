
# Sistema de Orçamentos

Sistema web profissional para geração de orçamentos de serviços técnicos de informática, desenvolvido com React, TypeScript e Node.js.

## 📋 Funcionalidades

- **Geração de Orçamentos**: Criação de orçamentos profissionais com dados do cliente, equipamento e serviços
- **Visualização em Tempo Real**: Preview do orçamento antes da finalização
- **Exportação para PDF**: Geração de PDF com layout profissional e formatação otimizada
- **Templates Salvos**: Salvamento de modelos de orçamento para reutilização
- **Persistência de Dados**: Armazenamento de orçamentos em banco de dados PostgreSQL
- **Interface Responsiva**: Design adaptável para desktop e mobile
- **Integração WhatsApp**: Envio direto de orçamentos via WhatsApp

## 🚀 Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca para interfaces de usuário
- **TypeScript** - Superset tipado do JavaScript
- **Tailwind CSS** - Framework CSS utilitário
- **Shadcn/ui** - Componentes de UI modernos
- **TanStack Query** - Gerenciamento de estado servidor
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de esquemas TypeScript
- **jsPDF** - Geração de documentos PDF
- **Wouter** - Roteamento minimalista

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web minimalista
- **TypeScript** - Tipagem estática
- **Drizzle ORM** - ORM TypeScript-first
- **PostgreSQL** - Banco de dados relacional

## 📦 Estrutura do Projeto

```
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── lib/           # Utilitários e configurações
│   │   └── hooks/         # Hooks customizados
│   └── public/            # Arquivos estáticos
├── server/                # Backend Node.js
│   ├── index.ts          # Servidor principal
│   ├── routes.ts         # Rotas da API
│   └── storage.ts        # Camada de dados
├── shared/               # Código compartilhado
│   └── schema.ts        # Esquemas de validação
└── data/                # Arquivos de banco de dados
```

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js 18+ 
- PostgreSQL

### Instalação

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd sistema-orcamentos
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o banco de dados**
```bash
# O sistema criará automaticamente as tabelas necessárias
npm run db:push
```

4. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

5. **Acesse a aplicação**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 📚 Como Usar

### 1. Criando um Novo Orçamento

1. Acesse a aba **"Formulário"**
2. Preencha os dados obrigatórios:
   - Ordem de serviço
   - Data
   - WhatsApp da empresa
   - Dados do cliente
   - Informações do equipamento
   - Diagnósticos
   - Serviços realizados
   - Nome do técnico

3. Clique em **"Gerar Orçamento"**

### 2. Visualizando o Orçamento

1. Após gerar, acesse a aba **"Visualizar"**
2. Revise todas as informações
3. Use as opções disponíveis:
   - **Imprimir**: Impressão direta
   - **Baixar PDF**: Download do arquivo
   - **WhatsApp**: Compartilhamento direto

### 3. Salvando Templates

1. Na aba **"Salvos"**, clique em **"Salvar Template"**
2. Defina um nome para o template
3. O template ficará disponível para reutilização

## 🔧 API Endpoints

### Orçamentos
- `GET /api/quotes` - Lista todos os orçamentos
- `GET /api/quotes/:id` - Busca orçamento específico
- `POST /api/quotes` - Cria novo orçamento
- `PUT /api/quotes/:id` - Atualiza orçamento
- `DELETE /api/quotes/:id` - Remove orçamento

### Templates Salvos
- `GET /api/saved-quotes` - Lista templates salvos
- `POST /api/saved-quotes` - Cria novo template
- `DELETE /api/saved-quotes/:id` - Remove template

## 📄 Exemplo de Orçamento

O sistema gera orçamentos com:
- Cabeçalho com logo da empresa
- Informações da ordem de serviço
- Dados completos do cliente
- Especificações do equipamento
- Diagnósticos realizados
- Tabela detalhada de serviços e valores
- Valor total
- Garantia de 30 dias
- Espaço para assinaturas

## 🎨 Personalização

### Logo da Empresa
Substitua o arquivo `client/public/assets/logo.png` pelo logo da sua empresa.

### Informações da Empresa
Edite os valores padrão em `client/src/components/quote-form.tsx`:
- WhatsApp da empresa
- Nome do técnico padrão

### Estilos do PDF
Personalize a aparência do PDF em `client/src/lib/pdf-generator.ts`.

## 🔒 Banco de Dados

O sistema utiliza PostgreSQL com as seguintes tabelas:

- **quotes**: Armazena orçamentos gerados
- **saved_quotes**: Armazena templates salvos

As migrações são gerenciadas pelo Drizzle ORM.

## 🚀 Deploy

Para fazer deploy na Replit:

1. Configure as variáveis de ambiente necessárias
2. O sistema rodará automaticamente na porta 5000
3. Acesse via URL fornecida pela Replit

## 📞 Suporte

Para dúvidas e suporte:
- Verifique a documentação
- Analise os logs do servidor
- Teste as funcionalidades em ambiente de desenvolvimento

## 📝 Licença

Sistema desenvolvido para uso interno de empresas de assistência técnica.

---

**Desenvolvido com ❤️ para profissionais de assistência técnica**
