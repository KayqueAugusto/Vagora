# 🤖 AI Resume Optimizer

O **AI Resume Optimizer** é uma aplicação Web desenvolvida para analisar currículos e descrições de vagas utilizando **Inteligência Artificial**, gerando automaticamente uma versão otimizada para **sistemas de recrutamento (ATS)** e um currículo final pronto para envio.

O projeto tem como foco **aplicação prática de IA + experiência do usuário**, ajudando candidatos a melhorar a compatibilidade do currículo com vagas específicas e processos seletivos automatizados.

---

## 📂 Estrutura do Projeto

```text
resume-ai-gemini-product-v4/
├── resume-frontend/   → Aplicação Web (React + Vite)
└── resume-backend/    → API e integração com IA (Node.js + Express)
````

---

### 🔹 Frontend (`resume-frontend/`)

Aplicação desenvolvida em **React + Vite + TypeScript**, com foco em interface moderna, responsiva e fácil utilização.

Tecnologias utilizadas:

* React (TypeScript)
* Vite
* TailwindCSS
* Consumo de API REST
* Interface de geração de currículo

Estrutura principal:

```text
resume-frontend/
├── src/
├── public/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
└── .env
```

---

### 🔹 Backend (`resume-backend/`)

API responsável por processar os dados do usuário, enviar instruções para o modelo de IA e retornar o currículo otimizado junto com a análise ATS.

Tecnologias utilizadas:

* Node.js
* Express
* TypeScript
* Integração com Google Gemini API
* Arquitetura em camadas

Estrutura principal:

```text
resume-backend/
├── src/
│   ├── controllers/
│   ├── services/
│   ├── providers/
│   ├── prompts/
│   ├── routes/
│   ├── types/
│   └── config/
├── package.json
└── tsconfig.json
```

---

# ⚙️ Como Rodar o Projeto

## ▶️ Backend

```bash
cd resume-backend
npm install
copy .env.example .env
npm run dev
```

---

## ▶️ Frontend

```bash
cd resume-frontend
npm install
copy .env.example .env
npm run dev
```

Acessar:

👉 [http://localhost:5173](http://localhost:5173)

---

# 🧠 Como funciona a aplicação

O sistema permite que o usuário informe:

1️⃣ Dados pessoais e de contato
2️⃣ Currículo atual
3️⃣ Descrição da vaga desejada

A partir dessas informações, a aplicação utiliza **Inteligência Artificial** para:

* analisar a aderência entre currículo e vaga
* identificar palavras-chave relevantes
* sugerir melhorias
* gerar um currículo otimizado

O resultado final inclui:

* 📄 currículo final limpo
* 📊 análise ATS separada
* 🧠 sugestões de melhoria
* 📥 versão pronta para exportação em PDF

---

## 🔍 Funcionalidades

* 📄 Análise de currículos utilizando IA
* 🎯 Identificação de palavras-chave da vaga
* 📊 Análise de aderência ATS
* 🧠 Sugestões automáticas de melhoria
* 📑 Geração de currículo otimizado
* 📥 Exportação para PDF
* 🎨 Interface moderna e responsiva

---

## ⚠️ Observações importantes

* O sistema **não armazena currículos em banco de dados**
* Os dados são processados apenas durante a geração do currículo
* A análise ATS é exibida separadamente do currículo final
* O PDF gerado contém apenas o currículo limpo

---

## 🧩 Requisitos Funcionais Atendidos

* Inserção de currículo atual
* Inserção da descrição da vaga
* Análise automática com IA
* Geração de currículo otimizado
* Exportação do currículo em PDF
* Interface responsiva

---

## 🚀 Tecnologias

### 💻 Frontend

* React (TypeScript)
* Vite
* TailwindCSS

### ⚙️ Backend

* Node.js
* Express
* TypeScript

### 🧠 Inteligência Artificial

* Google Gemini API

---

## 📌 Status do projeto

🚧 MVP em evolução

Melhorias planejadas:

* Download automático de PDF
* Templates diferentes de currículo
* Histórico de currículos gerados
* Melhor análise ATS
* Deploy público da aplicação

---

## 📬 Contribuição

Sugestões, melhorias e ideias são bem-vindas!

---

## 👤 Autor

**Kayque Augusto Cassiano Milhome**
Desenvolvedor Full Stack

---

## 📄 Licença

Projeto desenvolvido para portfólio.

