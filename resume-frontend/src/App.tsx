import { useState } from 'react';
import { ResumeForm } from './components/ResumeForm';
import { ResumeResult } from './components/ResumeResult';
import { processResume } from './services/api';
import { ResumeResponse } from './types/resume';

export default function App() {
  const [result, setResult] = useState<ResumeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(payload: {
    resumeText: string;
    jobDescription: string;
  }) {
    try {
      setLoading(true);
      setError('');
      const response = await processResume(payload);
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 overflow-hidden rounded-[28px] bg-slate-950 px-6 py-10 text-white shadow-xl sm:px-8">
          <span className="inline-flex rounded-full border border-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-200">
            Vagora
          </span>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight sm:text-5xl">
            Otimize seu currículo para a vaga e gere uma versão pronta para ATS e PDF.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
            Seu currículo adaptado automaticamente para cada vaga, com foco no que os recrutadores realmente procuram.
          </p>
        </header>

        <div className="grid gap-8 xl:grid-cols-[420px_minmax(0,1fr)] xl:items-start">
          <div className="xl:sticky xl:top-6">
            <ResumeForm onSubmit={handleSubmit} loading={loading} />
            {error ? (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            ) : null}
          </div>

          <div className="min-w-0">
            {result ? (
              <ResumeResult result={result} />
            ) : (
              <div className="flex min-h-[520px] items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Seu resultado aparece aqui</h2>
                  <p className="mt-3 max-w-md text-slate-600">
                    Cole a vaga e o currículo atual. O sistema vai tentar extrair contato, reorganizar a experiência e gerar uma versão final mais limpa para envio.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
