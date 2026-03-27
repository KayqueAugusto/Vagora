import { env } from '../config/env';

export class GeminiProvider {
  async generateJson(systemInstruction: string, userPrompt: string): Promise<string> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${env.geminiModel}:generateContent`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': env.geminiApiKey
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemInstruction }]
        },
        contents: [
          {
            parts: [{ text: userPrompt }]
          }
        ],
        generationConfig: {
          temperature: 0.4,
          responseMimeType: 'application/json'
        }
      })
    });

    const rawText = await response.text();

    if (!response.ok) {
      throw new Error(`Erro no provider Gemini: ${response.status} - ${rawText}`);
    }

    const data = JSON.parse(rawText) as any;
    const content = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content || typeof content !== 'string') {
      throw new Error('Resposta inválida do provider Gemini.');
    }

    return content;
  }
}
