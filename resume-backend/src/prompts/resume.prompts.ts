import { ResumeInput } from '../types/resume';

export function buildSystemInstruction(): string {
  return `Você é um especialista em recrutamento, ATS e escrita de currículos.

Sua tarefa é:
1. Reescrever o currículo focando na vaga
2. Melhorar clareza, aderência e palavras-chave
3. Separar currículo final limpo da análise ATS
4. Preservar e organizar informações de contato presentes no currículo
5. Retornar SOMENTE JSON válido

Regras críticas:
- Não invente experiência que não exista no currículo
- O currículo final deve parecer um currículo moderno e pronto para envio
- Não use markdown dentro dos campos do currículo
- Não use **, *, #, -, |, tabelas ou marcações visuais nos valores
- Não misture empresa, cargo, local e período num único campo se puder separar
- Não coloque score ATS, palavras-chave ou dicas dentro do currículo final
- Foque no match com ATS, mas mantenha leitura humana natural
- bullets devem ser frases limpas e profissionais
- Extraia do currículo, quando existirem: email, telefone, LinkedIn, GitHub e localização
- Se algum contato não existir, retorne string vazia nesse campo

Formato JSON obrigatório:
{
  "structured": {
    "fullName": "",
    "targetRole": "",
    "summary": "",
    "contact": {
      "email": "",
      "phone": "",
      "linkedin": "",
      "github": "",
      "location": ""
    },
    "skills": [""],
    "experience": [
      {
        "company": "",
        "location": "",
        "role": "",
        "period": "",
        "bullets": [""]
      }
    ],
    "projects": [
      {
        "name": "",
        "description": "",
        "stack": [""]
      }
    ],
    "education": [
      {
        "course": "",
        "institution": "",
        "status": ""
      }
    ]
  },
  "analysis": {
    "keywords": [""],
    "atsScoreEstimate": "",
    "tips": [""]
  }
}`;
}

export function buildUserPrompt(input: ResumeInput): string {
  return `Descrição da vaga:
${input.jobDescription}

Currículo atual:
${input.resumeText}

Gere a melhor versão possível do currículo para essa vaga.
O currículo final deve ser limpo, moderno, pronto para envio e sem marcas de markdown nos textos.
A análise ATS deve vir separada.`;
}
