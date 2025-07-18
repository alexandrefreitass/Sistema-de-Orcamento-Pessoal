# Sistema de Orçamento Pessoal - Aplicação Full-Stack

https://github.com/user-attachments/assets/0d1df7e3-1b39-4976-8193-e9c7426eecfa

<br/>

Este projeto consiste em uma aplicação web completa para a geração de orçamentos de serviços técnicos, desenvolvida com **React**, **TypeScript** e **Node.js**. A ferramenta oferece uma interface moderna para criar, visualizar e gerenciar orçamentos, com funcionalidades de exportação para PDF e salvamento de templates para reutilização.

---

## 🛠 Características

-   **Interface Web Moderna**: Interface intuitiva e responsiva desenvolvida com **React**, **Tailwind CSS** e **Shadcn/ui**.
-   **Geração de PDF**: Permite exportar orçamentos detalhados em formato PDF com layout profissional.
-   **Templates Salvos**: Funcionalidade para salvar e carregar modelos de orçamentos, agilizando o trabalho repetitivo.
-   **Backend Robusto**: API RESTful construída com **Node.js** e **Express** para gerenciar os dados.
-   **Banco de Dados Relacional**: Persistência de dados utilizando **PostgreSQL** com o ORM **Drizzle**.
-   **Responsividade**: Adaptado para funcionar perfeitamente em dispositivos móveis e desktops.

---

## 🚀 Funcionalidades

-   **Criação de Orçamentos**: Formulário completo para inserir dados do cliente, equipamento, diagnósticos e serviços prestados.
-   **Visualização em Tempo Real**: Preview instantâneo do orçamento em um formato profissional antes de salvar ou exportar.
-   **Cálculo Automático**: O valor total dos serviços é calculado e atualizado em tempo real.
-   **Exportação para PDF**: Gera um arquivo PDF bem formatado, pronto para ser enviado ao cliente.
-   **Integração com WhatsApp**: Botão para enviar um resumo do orçamento diretamente para o cliente via WhatsApp.
-   **Gerenciamento de Templates**: Salva orçamentos recorrentes como templates para uso futuro, carregando os dados no formulário com um clique.

---

## 📋 Como Usar

### 1. Configurar o Ambiente

Certifique-se de que possui Node.js 18+ e PostgreSQL instalados no sistema.

### 2. Executar a Aplicação

1.  Clone ou baixe o projeto.
2.  Instale as dependências com `npm install`.
3.  Configure a variável de ambiente `DATABASE_URL` para conectar ao seu banco de dados PostgreSQL.
4.  Execute as migrações do banco de dados com `npm run db:push`.
5.  Inicie a aplicação em modo de desenvolvimento com `npm run dev`.
6.  Acesse `http://localhost:5000` (ou a porta configurada) no seu navegador.

### 3. Gerar um Orçamento

1.  **Preencha o Formulário**:
    -   Insira os dados da empresa, do cliente e do equipamento.
    -   Adicione um ou mais diagnósticos.
    -   Liste os serviços realizados e seus respectivos preços.
2.  **Gere e Visualize**:
    -   Clique em "Gerar Orçamento". A aplicação mudará para a aba de visualização.
3.  **Exporte ou Envie**:
    -   Use os botões para imprimir, baixar o PDF ou enviar via WhatsApp.

---

## 🖥 Interface da Aplicação

A interface é organizada em abas para uma navegação clara:

-   **Formulário**: Área de entrada de dados, dividida em seções lógicas (Empresa, Cliente, Equipamento, etc.).
-   **Visualizar**: Painel que exibe o orçamento finalizado, com opções de exportação e envio.
-   **Salvos**: Seção para gerenciar templates de orçamentos, permitindo salvar, carregar e excluir modelos.

---

## 🧩 Estrutura do Projeto

```
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes React (UI e lógica)
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── lib/            # Utilitários e configurações (PDF, formatação)
│   │   └── hooks/          # Hooks customizados (useToast)
├── server/                 # Backend Node.js
│   ├── index.ts            # Ponto de entrada do servidor
│   ├── routes.ts           # Definição das rotas da API
│   └── storage.ts          # Lógica de acesso ao banco de dados
├── shared/                 # Código compartilhado (schemas)
│   └── schema.ts           # Schemas Zod para validação de dados
└── drizzle.config.ts       # Configuração do Drizzle ORM
```

---

## 💻 Requisitos Técnicos

-   **Node.js**: 18 ou superior
-   **Banco de Dados**: PostgreSQL
-   **Navegador**: Suporte moderno para JavaScript ES6+ e CSS3
-   **Dependências**: Listadas no arquivo `package.json`.

---

## 🎨 Tecnologias Utilizadas

### Backend

-   **Node.js**: Ambiente de execução JavaScript.
-   **Express**: Framework para a construção da API.
-   **TypeScript**: Tipagem estática para o código.
-   **Drizzle ORM**: ORM TypeScript-first para interação com o banco de dados.
-   **Zod**: Validação de schemas para garantir a integridade dos dados da API.

### Frontend

-   **React 18**: Biblioteca para construção da interface de usuário.
-   **Vite**: Ferramenta de build para o frontend.
-   **Tailwind CSS**: Framework CSS para estilização.
-   **Shadcn/ui**: Coleção de componentes de UI.
-   **TanStack Query**: Gerenciamento de estado do servidor e caching.
-   **React Hook Form**: Gerenciamento de formulários.
-   **jsPDF & jspdf-autotable**: Bibliotecas para a geração de PDF no cliente.

---

## 🔧 Lógica da Aplicação

O sistema opera com uma arquitetura cliente-servidor bem definida:

1.  **Coleta de Dados**: O `QuoteForm` utiliza `React Hook Form` e `Zod` para coletar e validar os dados do orçamento.
2.  **Requisição à API**: Ao submeter o formulário, uma requisição `POST` é enviada para a API backend (`/api/quotes`).
3.  **Persistência**: O servidor Express valida os dados novamente com o schema do Zod e utiliza o `Drizzle ORM` para salvar o orçamento no banco de dados PostgreSQL.
4.  **Geração de PDF**: A funcionalidade de exportação é executada no lado do cliente, utilizando `jsPDF` para construir o documento a partir dos dados do formulário.
5.  **Gerenciamento de Estado**: `TanStack Query` é usado para gerenciar o estado dos dados do servidor, como a lista de templates salvos, otimizando o caching e a invalidação.

---

## 📱 Responsividade

-   **Desktop**: Layout de tela cheia, facilitando a visualização e preenchimento dos campos.
-   **Mobile**: A interface se adapta a telas menores, com os componentes sendo empilhados verticalmente para garantir a usabilidade.

---

## ⚠️ Observações

1.  **Variáveis de Ambiente**: É crucial configurar a variável `DATABASE_URL` para que a aplicação se conecte ao banco de dados.
2.  **Logo da Empresa**: O logo utilizado no PDF e na interface pode ser substituído em `client/public/assets/logo.png`.
3.  **Dados Padrão**: Valores padrão, como o nome do técnico e o WhatsApp da empresa, podem ser alterados diretamente no componente `QuoteForm`.

---

## 🚀 Deploy no Replit

Este projeto está pré-configurado para deploy no Replit:

-   **Servidor**: O `server/index.ts` inicia um servidor Express na porta 5000.
-   **Build**: O script `build` no `package.json` prepara os arquivos do cliente e do servidor para produção.
-   **Start**: O comando `start` executa o servidor em modo de produção.

---

## 📝 Licença

Este projeto está disponível sob a licença MIT. Você pode usá-lo, modificá-lo e distribuí-lo livremente.