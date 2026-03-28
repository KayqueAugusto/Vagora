import { z } from 'zod';
import { GeminiProvider } from '../providers/gemini.provider';
import { buildSystemInstruction, buildUserPrompt } from '../prompts/resume.prompts';
import {
  EducationItem,
  ExperienceItem,
  ProjectItem,
  ResumeAnalysis,
  ResumeContact,
  ResumeInput,
  ResumeResult,
  ResumeStructured
} from '../types/resume';

const contactInputSchema = z.object({
  email: z.string().optional(),
  phone: z.string().optional(),
  linkedin: z.string().optional(),
  github: z.string().optional(),
  location: z.string().optional()
}).optional();

const inputSchema = z.object({
  fullName: z.string().optional(),
  resumeText: z.string().min(30, 'Cole um currículo com mais conteúdo.'),
  jobDescription: z.string().min(30, 'Cole a descrição da vaga.'),
  contact: contactInputSchema
});

const contactSchema = z.object({
  email: z.string().default(''),
  phone: z.string().default(''),
  linkedin: z.string().default(''),
  github: z.string().default(''),
  location: z.string().default('')
});

const experienceSchema = z.object({
  company: z.string().default(''),
  location: z.string().optional().default(''),
  role: z.string().default(''),
  period: z.string().default(''),
  bullets: z.array(z.string()).default([])
});

const projectSchema = z.object({
  name: z.string().default(''),
  description: z.string().default(''),
  stack: z.array(z.string()).default([])
});

const educationSchema = z.object({
  course: z.string().default(''),
  institution: z.string().optional().default(''),
  status: z.string().optional().default('')
});

const structuredSchema = z.object({
  fullName: z.string().default('Candidato(a)'),
  targetRole: z.string().default('Profissional de Tecnologia'),
  summary: z.string().default(''),
  contact: contactSchema,
  skills: z.array(z.string()).default([]),
  experience: z.array(experienceSchema).default([]),
  projects: z.array(projectSchema).default([]),
  education: z.array(educationSchema).default([])
});

const analysisSchema = z.object({
  keywords: z.array(z.string()).default([]),
  atsScoreEstimate: z.string().default('Bom'),
  tips: z.array(z.string()).default([])
});

const responseSchema = z.object({
  structured: structuredSchema,
  analysis: analysisSchema
});

export class ResumeService {
  private provider = new GeminiProvider();

  async process(payload: unknown): Promise<ResumeResult> {
    const input = inputSchema.parse(payload) as ResumeInput;

    const raw = await this.provider.generateJson(
      buildSystemInstruction(),
      buildUserPrompt(input)
    );

    const parsed = responseSchema.parse(JSON.parse(raw));
    const structured = this.normalizeStructured(parsed.structured as ResumeStructured, input.resumeText, input.contact);
    const analysis = this.normalizeAnalysis(parsed.analysis as ResumeAnalysis);
    const markdown = this.buildMarkdown(structured);
    const html = this.buildHtml(structured);

    return { markdown, html, structured, analysis };
  }

  private normalizeStructured(data: ResumeStructured, resumeText: string, inputContact?: ResumeInput['contact']): ResumeStructured {
    const extractedContact = extractContactFromResume(resumeText);
    const contact = normalizeContact(data.contact, extractedContact, inputContact);

    return {
      fullName: cleanText(data.fullName) || extractNameFromResume(resumeText) || 'Candidato(a)',
      targetRole: cleanText(data.targetRole) || 'Profissional de Tecnologia',
      summary: cleanText(data.summary) || 'Profissional com experiência prática e foco em desenvolver soluções alinhadas à vaga alvo.',
      contact,
      skills: dedupe(data.skills.map(cleanText).filter(Boolean)),
      experience: data.experience.map((item) => normalizeExperience(item)).filter((item) => item.company || item.role || item.bullets.length),
      projects: data.projects.map((item) => normalizeProject(item)).filter((item) => item.name && item.description),
      education: data.education.map((item) => normalizeEducation(item)).filter((item) => item.course)
    };
  }

  private normalizeAnalysis(data: ResumeAnalysis): ResumeAnalysis {
    return {
      keywords: dedupe(data.keywords.map(cleanText).filter(Boolean)),
      atsScoreEstimate: cleanText(data.atsScoreEstimate),
      tips: dedupe(data.tips.map(cleanText).filter(Boolean))
    };
  }

  private buildMarkdown(data: ResumeStructured): string {
    const contactLines = [
      data.contact.location,
      data.contact.phone,
      data.contact.email,
      data.contact.linkedin,
      data.contact.github
    ].filter(Boolean).map((value) => `- ${value}`).join('\n');

    const experiences = data.experience.map((item) => {
      const header = `### ${item.role}\n${item.company}${item.location ? ` — ${item.location}` : ''}\n${item.period}`;
      const bullets = item.bullets.map((bullet) => `- ${bullet}`).join('\n');
      return `${header}\n${bullets}`;
    }).join('\n\n');

    const projectsBlock = data.projects.length
      ? `\n## Projetos\n${data.projects.map((item) => {
          const stackLine = item.stack?.length ? `\nTecnologias: ${item.stack.join(', ')}` : '';
          return `### ${item.name}\n${item.description}${stackLine}`;
        }).join('\n\n')}`
      : '';

    const educationBlock = data.education.map((item) => {
      const parts = [item.course, item.institution, item.status].filter(Boolean);
      return `- ${parts.join(' — ')}`;
    }).join('\n');

    return `# ${data.fullName}\n\n## Cargo alvo\n${data.targetRole}${contactLines ? `\n\n## Contato\n${contactLines}` : ''}\n\n## Resumo profissional\n${data.summary}\n\n## Skills\n${data.skills.map((skill) => `- ${skill}`).join('\n')}\n\n## Experiência profissional\n${experiences}${projectsBlock}\n\n## Formação\n${educationBlock}`;
  }

  private buildHtml(data: ResumeStructured): string {
    const experienceCards = data.experience.map((item) => `
      <article class="entry">
        <div class="entry-top">
          <div>
            <h3 class="role-title">${escapeHtml(item.role)}</h3>
            <div class="company">${escapeHtml(item.company)}${item.location ? ` • ${escapeHtml(item.location)}` : ''}</div>
          </div>
          <div class="period">${escapeHtml(item.period)}</div>
        </div>
        <ul>${item.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join('')}</ul>
      </article>
    `).join('');

    const projectsSection = data.projects.length
      ? `<section class="section">
          <h2>Projetos</h2>
          <div class="stacked">
            ${data.projects.map((item) => `
              <article class="entry compact">
                <h3 class="card-title">${escapeHtml(item.name)}</h3>
                <p>${escapeHtml(item.description)}</p>
                ${item.stack?.length ? `<div class="meta">Tecnologias: ${escapeHtml(item.stack.join(', '))}</div>` : ''}
              </article>
            `).join('')}
          </div>
        </section>`
      : '';

    const educationSection = data.education.map((item) => `
      <article class="entry compact">
        <h3 class="card-title">${escapeHtml(item.course)}</h3>
        <div class="meta">${[item.institution, item.status].filter((v): v is string => Boolean(v)).map((v) => escapeHtml(v)).join(' · ')}</div>
      </article>
    `).join('');

    const contactItems = [
      data.contact.location,
      data.contact.phone,
      data.contact.email,
      data.contact.linkedin,
      data.contact.github
    ].filter(Boolean).map((item) => `<span>${escapeHtml(item)}</span>`).join('<span class="sep">•</span>');

    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(data.fullName)} - Currículo</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: Arial, Helvetica, sans-serif; margin: 0; background: #eef2f7; color: #0f172a; padding: 24px; }
    .page { width: 100%; max-width: 920px; margin: 0 auto; background: white; border-radius: 18px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); }
    .header { margin-bottom: 28px; }
    h1 { margin: 0; font-size: 36px; line-height: 1.15; word-break: break-word; }
    .role { margin-top: 8px; font-size: 19px; color: #000000; word-break: break-word; font-weight: 500; }
    .contact { margin-top: 14px; display: flex; flex-wrap: wrap; gap: 8px; font-size: 14px; color: #000000; }
    .sep { color: #000000; }
    .section { margin-top: 28px; }
    .section h2 { font-size: 20px; text-transform: uppercase; letter-spacing: 0.04em; font-weight: 700; margin: 0 0 14px; color: #000000; border-bottom: 2px solid #dbe1e8; padding-bottom: 8px; }
    p { line-height: 1.75; margin: 0; }
    .grid { display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(280px, 0.85fr); gap: 28px; }
    .entry { padding: 0 0 16px; margin-bottom: 20px; border-bottom: 1px solid #dbe1e8; }
    .entry.compact { padding-bottom: 12px; }
    .entry:last-child { margin-bottom: 0; }
    .entry-top { display: flex; gap: 16px; align-items: flex-start; justify-content: space-between; }
    .entry h3 { margin: 0; line-height: 1.35; }
    .role-title { font-size: 18px; font-weight: 600; color: #000000; }
    .card-title { font-size: 18px; font-weight: 600; color: #000000; }
    .company, .meta { margin-top: 6px; color: #000000; line-height: 1.6; font-size: 15px; }
    .period { white-space: nowrap; color: #000000; font-size: 14px; font-weight: 500; text-align: right; }
    ul { margin: 12px 0 0; padding-left: 20px; }
    li { margin-bottom: 10px; line-height: 1.7; overflow-wrap: anywhere; }
    .tag-list { display: flex; flex-wrap: wrap; gap: 8px; }
    .tag { background: #ffffff; color: #000000; border: 1px solid #d1d5db; border-radius: 999px; padding: 8px 12px; font-size: 13px; font-weight: 600; }
    .stacked { display: grid; gap: 16px; }
    @media print {
      body { background: white; padding: 0; }
      .page { box-shadow: none; border-radius: 0; max-width: 100%; }
    }
    @media (max-width: 800px) {
      body { padding: 12px; }
      .page { padding: 22px; }
      .grid { grid-template-columns: 1fr; }
      .entry-top { flex-direction: column; gap: 6px; }
      .period { white-space: normal; }
      h1 { font-size: 29px; }
    }
  </style>
</head>
<body>
  <main class="page">
    <header class="header">
      <h1>${escapeHtml(data.fullName)}</h1>
      <div class="role">${escapeHtml(data.targetRole)}</div>
      ${contactItems ? `<div class="contact">${contactItems}</div>` : ''}
    </header>

    <section class="section">
      <h2>Resumo profissional</h2>
      <p>${escapeHtml(data.summary)}</p>
    </section>

    <div class="grid">
      <div>
        <section class="section">
          <h2>Experiência profissional</h2>
          <div class="stacked">${experienceCards}</div>
        </section>
        ${projectsSection}
      </div>

      <div>
        <section class="section">
          <h2>Skills</h2>
          <div class="tag-list">
            ${data.skills.map((skill) => `<span class="tag">${escapeHtml(skill)}</span>`).join('')}
          </div>
        </section>

        <section class="section">
          <h2>Formação</h2>
          <div class="stacked">${educationSection}</div>
        </section>
      </div>
    </div>
  </main>
</body>
</html>`;
  }
}

function cleanText(value: string): string {
  return value
    .replace(/\*\*/g, '')
    .replace(/(?<!\w)\*(?!\w)/g, '')
    .replace(/\s+\|\s+/g, ' · ')
    .replace(/^[-#]+\s*/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanUrlLike(value: string): string {
  return cleanText(value)
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, 'www.')
    .trim();
}

function normalizeContact(modelContact: ResumeContact, extractedContact?: ResumeInput['contact'], inputContact?: ResumeInput['contact']): ResumeContact {
  return {
    email: cleanUrlLike(inputContact?.email || extractedContact?.email || modelContact?.email || ''),
    phone: cleanText(inputContact?.phone || extractedContact?.phone || modelContact?.phone || ''),
    linkedin: cleanUrlLike(inputContact?.linkedin || extractedContact?.linkedin || modelContact?.linkedin || ''),
    github: cleanUrlLike(inputContact?.github || extractedContact?.github || modelContact?.github || ''),
    location: cleanText(inputContact?.location || extractedContact?.location || modelContact?.location || '')
  };
}

function extractContactFromResume(resumeText: string): ResumeInput['contact'] {
  const emailMatch = resumeText.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  const phoneMatch = resumeText.match(/(?:\+?55\s*)?(?:\(?\d{2}\)?\s*)?(?:9?\d{4})[-\s]?\d{4}/);
  const linkedinMatch = resumeText.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[^\s)]+/i);
  const githubMatch = resumeText.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[^\s)]+/i);
  const locationMatch = resumeText.match(/([A-ZÀ-Ú][A-Za-zÀ-ú' -]+,\s*[A-ZÀ-Ú][A-Za-zÀ-ú' -]+,\s*Brasil)/);

  return {
    email: emailMatch?.[0] || '',
    phone: phoneMatch?.[0] || '',
    linkedin: linkedinMatch?.[0] || '',
    github: githubMatch?.[0] || '',
    location: locationMatch?.[0] || ''
  };
}

function normalizeExperience(item: ExperienceItem): ExperienceItem {
  const bullets = (item.bullets || []).map(cleanText).filter(Boolean);
  const company = cleanText(item.company || '');
  const role = cleanText(item.role || '');
  const fallbackTitle = role || company || 'Experiência Profissional';

  return {
    company: company || fallbackTitle,
    location: cleanText(item.location || ''),
    role: role || fallbackTitle,
    period: cleanText(item.period || 'Período não informado'),
    bullets: bullets.length ? bullets : ['Atuação profissional alinhada à vaga alvo.']
  };
}

function normalizeProject(item: ProjectItem): ProjectItem {
  return {
    name: cleanText(item.name || ''),
    description: cleanText(item.description || ''),
    stack: dedupe(
      (item.stack || [])
        .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
        .map((value) => cleanText(value))
    )
  };
}

function normalizeEducation(item: EducationItem): EducationItem {
  return {
    course: cleanText(item.course || ''),
    institution: cleanText(item.institution || ''),
    status: cleanText(item.status || '')
  };
}

function dedupe(values: string[]): string[] {
  return [...new Set(values)];
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function extractNameFromResume(resumeText: string): string {
  const lines = resumeText.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  return cleanText(lines[0] || '');
}