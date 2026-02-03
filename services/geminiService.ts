import { GoogleGenAI } from "@google/genai";
import { Ticket, TicketStatus } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateQueueInsights = async (tickets: Ticket[]): Promise<string> => {
  if (!process.env.API_KEY) return "API Key não configurada. Configure a chave para receber insights.";

  const todayTickets = tickets.filter(t => {
    const date = new Date(t.createdAt);
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  });

  const summary = {
    total: todayTickets.length,
    waiting: todayTickets.filter(t => t.status === TicketStatus.WAITING).length,
    completed: todayTickets.filter(t => t.status === TicketStatus.DONE).length,
    inProgress: todayTickets.filter(t => t.status === TicketStatus.IN_PROGRESS).length,
    priority: todayTickets.filter(t => t.priority).length,
  };

  const prompt = `
    Você é um gerente de operações especialista em eficiência de filas.
    Analise os seguintes dados da fila de hoje e forneça 3 recomendações curtas e acionáveis (bullet points) para melhorar o fluxo.
    Seja direto e use um tom profissional e moderno.
    
    Dados:
    - Total de tickets hoje: ${summary.total}
    - Aguardando: ${summary.waiting}
    - Em atendimento: ${summary.inProgress}
    - Prioritários: ${summary.priority}
    - Concluídos: ${summary.completed}
    
    Responda em Português do Brasil. Formate como HTML simples (apenas tags <p>, <ul>, <li>, <strong>).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Não foi possível gerar insights no momento.";
  } catch (error) {
    console.error("Erro ao gerar insights:", error);
    return "Erro ao conectar com a IA para análise.";
  }
};