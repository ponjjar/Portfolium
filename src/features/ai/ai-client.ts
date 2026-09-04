import { SummarizeProjectsRequest, SummarizeProjectsResponse, SuggestProfileRequest, SuggestProfileResponse, TranslateRequest, TranslateResponse } from './types';
import { ExternalAiConfig } from '@/components/ai/AiExternalConfigModal';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || '';

export class AiClient {
  static async summarizeProjects(request: SummarizeProjectsRequest): Promise<SummarizeProjectsResponse> {
    const response = await fetch(`${API_BASE_URL}/api/ai/summarize-projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to summarize projects: ${response.status} ${errorText}`);
    }

    return response.json();
  }

  static async suggestProfile(request: SuggestProfileRequest): Promise<SuggestProfileResponse> {
    const response = await fetch(`${API_BASE_URL}/api/ai/suggest-profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to suggest profile: ${response.status} ${errorText}`);
    }

    return response.json();
  }

  static async translate(request: TranslateRequest): Promise<TranslateResponse> {
    const response = await fetch(`${API_BASE_URL}/api/ai/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to translate: ${response.status} ${errorText}`);
    }

    return response.json();
  }

  static async fetchExternalSummary(
    config: ExternalAiConfig, 
    projectPrompt: string, 
    languageName: string
  ): Promise<string> {
    const systemPrompt = `Você é um redator especialista. Sua tarefa é criar um resumo extremamente curto e direto (máximo de 2 linhas) sobre o que é o projeto. Não inclua lista de tecnologias, não inclua funcionalidades em tópicos, e não use formatação markdown (como **). Retorne APENAS um parágrafo simples resumindo o objetivo do projeto.\n\nThe current interface language is ${languageName}.\nGenerate every user-visible response strictly in ${languageName}.\nDo not choose the language based on the README.\nKeep only proper names, product names and technical terms in their original form.\nDo not mix languages.`;

    if (config.provider === 'openai' || config.provider === 'ollama' || config.provider === 'custom') {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (config.apiKey) headers['Authorization'] = `Bearer ${config.apiKey}`;
      
      const res = await fetch(config.endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: config.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: projectPrompt }
          ],
          temperature: 0.7,
        })
      });
      if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
      const data = await res.json();
      return data.choices[0].message.content;
    } else if (config.provider === 'gemini') {
      const res = await fetch(`${config.endpoint}/models/${config.model}:generateContent?key=${config.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: { text: systemPrompt } },
          contents: [{ parts: [{ text: projectPrompt }] }]
        })
      });
      if (!res.ok) throw new Error(`Gemini API Error: ${res.statusText}`);
      const data = await res.json();
      return data.candidates[0].content.parts[0].text;
    }
    throw new Error('Unsupported provider');
  }
}
