import { useState } from 'react';

type Props = {
  onSubmit: (payload: {
    resumeText: string;
    jobDescription: string;
  }) => Promise<void>;
  loading: boolean;
};

export function ResumeForm({ onSubmit, loading }: Props) {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmit({ resumeText, jobDescription });
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">Descrição da vaga</label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Cole aqui a job description"
          rows={8}
          className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-500"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">Currículo atual</label>
        <textarea
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          placeholder="Cole aqui o currículo atual completo, inclusive com contato, LinkedIn, GitHub e localização se já existirem"
          rows={16}
          className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-500"
        />
        <p className="mt-2 text-xs leading-5 text-slate-500">
          O app tenta aproveitar automaticamente nome, contato, LinkedIn, GitHub e cidade quando essas informações já estiverem no currículo.
        </p>
      </div>

      <button type="submit" disabled={loading} className="rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">
        {loading ? 'Gerando currículo...' : 'Gerar currículo otimizado'}
      </button>
    </form>
  );
}
