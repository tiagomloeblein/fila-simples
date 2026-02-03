# Fila Simples - Sistema de Gestão de Filas (MicroSaaS)

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

Um sistema de gestão de filas moderno, visualmente impactante e focado em experiência do usuário. Desenvolvido como um MVP (Minimum Viable Product) para MicroSaaS, ele utiliza **Inteligência Artificial (Google Gemini)** para gerar insights operacionais em tempo real.

## 🚀 Funcionalidades

O sistema é dividido em módulos integrados:

*   **📺 Visão TV (Painel de Chamada):**
    *   Interface "Glassmorphism" escura para TVs.
    *   Anúncio de voz (TTS) configurável (escolha de vozes do navegador).
    *   Sinal sonoro (chime) suave.
    *   Exibição de senha atual e próximas.
*   **🎫 Totem (Kiosk):**
    *   Interface simplificada para autoatendimento.
    *   Impressão automática estilizada para impressoras térmicas (58mm/80mm).
    *   Opção de Prioridade.
*   **📊 Dashboard & Admin:**
    *   Gestão de fila em tempo real (Chamar, Concluir, Cancelar).
    *   Gráficos de fluxo de atendimento.
    *   **Insights via IA:** Análise de eficiência gerada pelo Google Gemini.
    *   Histórico e restauração de senhas.
*   **⚙️ Configurações:**
    *   Personalização do nome do guichê.
    *   Seleção de voz para chamadas.
    *   "Zona de Perigo" para resetar a fila.

## 🛠️ Tecnologias Utilizadas

*   **Frontend:** React 19, TypeScript.
*   **Estilização:** Tailwind CSS (focado em Dark Mode).
*   **IA:** Google Gemini API (`@google/genai`).
*   **Ícones:** Lucide React.
*   **Gráficos:** Recharts.
*   **Build Tool:** Vite.

## 📦 Como Rodar o Projeto

Este projeto utiliza **Vite** para desenvolvimento rápido. Siga os passos abaixo:

### 1. Pré-requisitos
*   Node.js (v18 ou superior) instalado.
*   Uma **API Key** do Google Gemini (obtenha em [Google AI Studio](https://aistudio.google.com/)).

### 2. Instalação

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/seu-usuario/fila-simples.git
cd fila-simples
npm install
```

### 3. Configuração da API Key

Crie um arquivo `.env` na raiz do projeto (copie o exemplo abaixo) e adicione sua chave:

```env
API_KEY=sua_chave_do_gemini_aqui
```

> **Nota:** O sistema utiliza a variável `process.env.API_KEY` injetada pelo Vite.

### 4. Executando

Para rodar em ambiente de desenvolvimento:

```bash
npm run dev
```

Acesse no navegador: `http://localhost:5173`

*   **Senha do Admin:** `1234` (Padrão inicial)

## ⚠️ Status do Projeto

Este sistema é uma versão **Inicial (MVP)**. Ele foi desenhado para ser visualmente atraente e funcional para pequenas operações, mas possui limitações intencionais:

*   **Persistência:** Os dados são salvos no `localStorage` do navegador. Se limpar o cache, os dados somem. Não há backend (banco de dados real) nesta versão.
*   **Sincronização:** Utiliza `BroadcastChannel` para comunicação entre abas no mesmo navegador. Para funcionar em múltiplos dispositivos (ex: Celular do atendente + TV), seria necessário implementar um backend com WebSockets (Firebase, Supabase, Socket.io).

## 🤝 Contribuições

Sugestões e melhorias são muito bem-vindas! Se você deseja evoluir este projeto:

1.  Faça um Fork.
2.  Crie uma Branch (`git checkout -b feature/nova-feature`).
3.  Commit suas mudanças.
4.  Abra um Pull Request.

**Ideias para melhorias futuras:**
*   Implementar Backend (Node.js/Supabase).
*   Adicionar autenticação real de usuários.
*   Suporte a múltiplos departamentos/filas.
*   Relatórios exportáveis em PDF/Excel.

---

Desenvolvido com 💜 e IA.
