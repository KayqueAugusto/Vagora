# Resume AI Gemini Product V4

Versão atualizada do MVP para otimizar currículo com Gemini API.

## O que mudou nesta edição

- Separação entre **currículo final** e **análise ATS**
- Botão de PDF abre apenas o **currículo limpo**, pronto para baixar/imprimir
- Melhorias de responsividade para evitar scroll horizontal no preview
- Markdown representa apenas o currículo final
- **Campos de contato no formulário**
- **Contato renderizado no cabeçalho** do currículo final e do PDF
- Dados informados manualmente no formulário têm prioridade sobre inferências da IA

## Estrutura

```text
resume-ai-gemini-product-v4/
├── resume-frontend/   # React + Vite + TypeScript + Tailwind
└── resume-backend/    # Node.js + Express + TypeScript
```

## Como rodar

### 1) Backend

```bash
cd resume-backend
npm install
copy .env.example .env
npm run dev
```

### 2) Frontend

```bash
cd resume-frontend
npm install
copy .env.example .env
npm run dev
```

## Backend .env

```env
PORT=3001
ALLOWED_ORIGIN=http://localhost:5173
GEMINI_API_KEY=coloque_sua_chave_aqui
GEMINI_MODEL=gemini-2.5-flash
```

## Frontend .env

```env
VITE_API_URL=http://localhost:3001/api
```


## V7

- Hierarquia tipográfica refinada no preview e no PDF
- Títulos de seção maiores que cargos e itens internos
- Datas mais discretas e alinhadas melhor visualmente
