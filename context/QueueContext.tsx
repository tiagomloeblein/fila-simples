import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Ticket, TicketStatus, ServiceType, UserConfig } from '../types';

interface QueueContextType {
  tickets: Ticket[];
  addTicket: (name: string, service: ServiceType, priority: boolean) => Ticket;
  updateTicketStatus: (id: string, status: TicketStatus, desk?: string) => void;
  deleteTicket: (id: string) => void;
  resetQueue: () => void;
  userConfig: UserConfig;
  updateUserConfig: (config: Partial<UserConfig>) => void;
}

const QueueContext = createContext<QueueContextType | undefined>(undefined);

const STORAGE_KEY = 'fluxo_simple_tickets';
const CONFIG_KEY = 'fluxo_simple_config';
const LAST_RESET_KEY = 'fluxo_simple_last_reset';

// BroadcastChannel permite comunicação entre abas (Kiosk -> TV -> Admin)
const channel = new BroadcastChannel('queue_sync_channel');

export const QueueProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [userConfig, setUserConfig] = useState<UserConfig>({ deskId: 'Guichê 01' });

  // Load Initial Data & Daily Reset Logic
  useEffect(() => {
    const checkDailyReset = () => {
      const lastReset = localStorage.getItem(LAST_RESET_KEY);
      const today = new Date().toLocaleDateString();

      if (lastReset !== today) {
        // Novo dia, reseta a fila
        setTickets([]);
        localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
        localStorage.setItem(LAST_RESET_KEY, today);
      } else {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) setTickets(JSON.parse(saved));
      }
    };

    checkDailyReset();

    // Carregar config do usuário
    const savedConfig = localStorage.getItem(CONFIG_KEY);
    if (savedConfig) setUserConfig(JSON.parse(savedConfig));

    // Listen to other tabs
    channel.onmessage = (event) => {
      if (event.data.type === 'SYNC_TICKETS') {
        setTickets(event.data.payload);
      }
    };

    return () => { channel.close(); };
  }, []);

  // Sync to Storage and Broadcast on change
  const syncState = (newTickets: Ticket[]) => {
    setTickets(newTickets);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newTickets));
    channel.postMessage({ type: 'SYNC_TICKETS', payload: newTickets });
  };

  const addTicket = (name: string, service: ServiceType, priority: boolean) => {
    // Gerar ID legível: S001, V002 etc ou Sequencial 001
    const prefix = service.charAt(0).toUpperCase();
    const count = tickets.length + 1;
    const readableId = `${prefix}${count.toString().padStart(3, '0')}`;

    const newTicket: Ticket = {
      id: readableId,
      rawId: count,
      name,
      service,
      status: TicketStatus.WAITING,
      createdAt: Date.now(),
      priority,
    };
    
    const updated = [...tickets, newTicket];
    syncState(updated);
    return newTicket;
  };

  const updateTicketStatus = (id: string, status: TicketStatus, desk?: string) => {
    const updated = tickets.map(t => {
      if (t.id === id) {
        const updates: Partial<Ticket> = { status };
        if (status === TicketStatus.IN_PROGRESS) {
          updates.startedAt = Date.now();
          updates.desk = desk || userConfig.deskId;
        }
        if (status === TicketStatus.DONE || status === TicketStatus.CANCELLED) updates.completedAt = Date.now();
        return { ...t, ...updates };
      }
      return t;
    });
    syncState(updated);
  };

  const deleteTicket = (id: string) => {
    const updated = tickets.filter(t => t.id !== id);
    syncState(updated);
  };

  const resetQueue = () => {
    syncState([]);
  };

  const updateUserConfig = (config: Partial<UserConfig>) => {
    const newConfig = { ...userConfig, ...config };
    setUserConfig(newConfig);
    localStorage.setItem(CONFIG_KEY, JSON.stringify(newConfig));
  };

  return (
    <QueueContext.Provider value={{ tickets, addTicket, updateTicketStatus, deleteTicket, resetQueue, userConfig, updateUserConfig }}>
      {children}
    </QueueContext.Provider>
  );
};

export const useQueue = () => {
  const context = useContext(QueueContext);
  if (!context) throw new Error("useQueue must be used within QueueProvider");
  return context;
};