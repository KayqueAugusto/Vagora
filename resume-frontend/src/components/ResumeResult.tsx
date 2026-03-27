import { ResumeResponse } from '../types/resume';

type Props = {
  result: ResumeResponse;
};

export function ResumeResult({ result }: Props) {
  const { structured, analysis, markdown, html } = result;

  function copyMarkdown() {
    navigator.clipboard.writeText(markdown);
  }

  function openPrintableVersion() {
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.open();
    win.document.write(html);
    win.document.close();
  }

  const contactItems = [
    structured.contact.location,
    structured.contact.phone,
    structured.contact.email,
    structured.contact.linkedin,
    structured.contact.github
  ].filter(Boolean);

  return (
    <div className="grid gap-6">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h2 className="break-words text-[2rem] font-bold leading-tight text-black">
              {structured.fullName}
            </h2>

            <p className="mt-2 break-words text-xl font-medium text-black">
              {structured.targetRole}
            </p>

            {contactItems.length ? (
              <div className="mt-4 flex flex-wrap gap-x-3 gap-y-2 text-sm text-black">
                {contactItems.map((item, index) => (
                  <span key={`${item}-${index}`} className="break-all">
                    {index > 0 ? '• ' : ''}
                    {item}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-end">
            <button
              onClick={copyMarkdown}
              className="rounded-2xl border border-slate-300 px-4 py-3 font-medium text-black"
            >
              Copiar currículo em markdown
            </button>

            <button
              onClick={openPrintableVersion}
              className="rounded-2xl bg-slate-900 px-4 py-3 font-medium text-white"
            >
              Abrir currículo para PDF
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="min-w-0 space-y-8">
            <Section title="Resumo profissional">
              <p className="break-words leading-8 text-black">{structured.summary}</p>
            </Section>

            <Section title="Experiência profissional">
              <div className="space-y-8">
                {structured.experience.map((item, index) => (
                  <article
                    key={`${item.company}-${item.role}-${index}`}
                    className="border-b border-slate-200 pb-6 last:border-b-0 last:pb-0"
                  >
                    <div className="grid gap-1 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
                      <div className="min-w-0">
                        <h4 className="break-words text-lg font-semibold leading-snug text-black">
                          {item.role}
                        </h4>

                        <p className="mt-1 break-words text-sm font-medium leading-6 text-black">
                          {[item.company, item.location].filter(Boolean).join(' • ')}
                        </p>
                      </div>

                      <p className="text-sm font-medium leading-6 text-black md:text-right md:whitespace-nowrap">
                        {item.period}
                      </p>
                    </div>

                    <ul className="mt-4 space-y-2 text-black">
                      {item.bullets.map((bullet, bulletIndex) => (
                        <li key={`${bullet}-${bulletIndex}`} className="flex gap-3">
                          <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-black" />
                          <span className="min-w-0 break-words leading-7">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </Section>

            {structured.projects.length ? (
              <Section title="Projetos">
                <div className="space-y-5">
                  {structured.projects.map((item, index) => (
                    <article
                      key={`${item.name}-${index}`}
                      className="rounded-2xl border border-slate-200 p-5"
                    >
                      <h4 className="break-words text-lg font-semibold text-black">
                        {item.name}
                      </h4>

                      <p className="mt-3 break-words leading-8 text-black">
                        {item.description}
                      </p>

                      {item.stack?.length ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {item.stack.map((tech, techIndex) => (
                            <span
                              key={`${tech}-${techIndex}`}
                              className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-black"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </article>
                  ))}
                </div>
              </Section>
            ) : null}
          </div>

          <div className="min-w-0 space-y-8">
            <Section title="Skills">
              <TagList items={structured.skills} />
            </Section>

            <Section title="Formação">
              <div className="space-y-5">
                {structured.education.map((item, index) => (
                  <article
                    key={`${item.course}-${index}`}
                    className="border-b border-slate-200 pb-5 last:border-b-0 last:pb-0"
                  >
                    <h4 className="break-words text-lg font-semibold leading-snug text-black">
                      {item.course}
                    </h4>

                    {(item.institution || item.status) ? (
                      <p className="mt-1 break-words text-sm font-medium leading-6 text-black">
                        {[item.institution, item.status].filter(Boolean).join(' • ')}
                      </p>
                    ) : null}
                  </article>
                ))}
              </div>
            </Section>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h3 className="text-lg font-bold text-black">Análise ATS</h3>

        <p className="mt-2 text-sm leading-6 text-black">
          Esta parte serve apenas para orientar melhorias. Ela não entra no currículo final nem na versão para PDF.
        </p>

        <div className="mt-6 grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
          <Section title="Aderência estimada">
            <div className="inline-flex rounded-2xl border border-slate-300 px-4 py-2 text-sm font-bold text-black">
              {analysis.atsScoreEstimate}
            </div>
          </Section>

          <Section title="Palavras-chave relevantes">
            <TagList items={analysis.keywords} />
          </Section>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
          <Section title="Dicas finais">
            <ul className="space-y-3 text-black">
              {analysis.tips.map((tip, index) => (
                <li key={`${tip}-${index}`} className="flex gap-3">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-black" />
                  <span className="min-w-0 break-words leading-7">{tip}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Currículo em markdown">
            <pre className="max-h-[360px] overflow-auto rounded-2xl bg-slate-950 p-4 text-sm leading-6 text-slate-100 whitespace-pre-wrap break-words">
              {markdown}
            </pre>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="min-w-0">
      <h3 className="mb-4 text-lg font-bold uppercase tracking-[0.04em] text-black">
        {title}
      </h3>
      {children}
    </section>
  );
}

function TagList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, index) => (
        <span
          key={`${item}-${index}`}
          className="max-w-full break-words rounded-full border border-slate-300 px-3 py-2 text-sm font-medium text-black"
        >
          {item}
        </span>
      ))}
    </div>
  );
}