import dotenv from 'dotenv';

dotenv.config();

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) throw new Error(`Variável ${name} não definida.`);
  return value;
}

export const env = {
  port: Number(process.env.PORT ?? 3001),
  allowedOrigin: required('ALLOWED_ORIGIN', 'http://localhost:5173'),
  geminiApiKey: required('GEMINI_API_KEY'),
  geminiModel: required('GEMINI_MODEL', 'gemini-2.5-flash')
};
