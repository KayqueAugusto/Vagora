import { ResumeResponse } from '../types/resume';

const API_URL = import.meta.env.VITE_API_URL;

export async function processResume(payload: {
  fullName?: string;
  resumeText: string;
  jobDescription: string;
}): Promise<ResumeResponse> {
  const response = await fetch(`${API_URL}/resume/process`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const raw = await response.text();
  let data: any = null;

  try {
    data = raw ? JSON.parse(raw) : null;
  } catch {
    throw new Error(raw || 'Resposta inválida do backend.');
  }

  if (!response.ok) {
    throw new Error(data?.details || data?.message || 'Erro ao processar currículo.');
  }

  return data as ResumeResponse;
}
