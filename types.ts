export enum TicketStatus {
  WAITING = 'AGUARDANDO',
  IN_PROGRESS = 'EM ATENDIMENTO',
  DONE = 'CONCLUÍDO',
  CANCELLED = 'CANCELADO'
}

export enum ServiceType {
  SALES = 'Vendas',
  SUPPORT = 'Suporte',
  FINANCIAL = 'Financeiro',
  RETURNS = 'Devoluções'
}

export interface Ticket {
  id: string; // Número da senha (ex: A001)
  rawId: number; // ID numérico sequencial
  name: string;
  service: ServiceType;
  status: TicketStatus;
  createdAt: number; // timestamp
  startedAt?: number;
  completedAt?: number;
  priority: boolean;
  desk?: string; // Qual guichê atendeu
}

export type ViewMode = 'DASHBOARD' | 'QUEUE' | 'KIOSK' | 'TV' | 'LOGIN' | 'SETTINGS';

export interface QueueStats {
  totalWaiting: number;
  totalServed: number;
  avgWaitTimeMinutes: number;
  busiestService: string;
}

export interface UserConfig {
  deskId: string; // "Guichê 01", "Mesa 05"
  voiceURI?: string; // ID da voz selecionada no navegador
}