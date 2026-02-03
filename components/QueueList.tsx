import React, { useState } from 'react';
import { useQueue } from '../context/QueueContext';
import { Ticket, TicketStatus } from '../types';
import { Play, Check, X, Clock, Settings, RotateCcw, History, List as ListIcon } from 'lucide-react';

export const QueueList: React.FC = () => {
  const { tickets, updateTicketStatus, userConfig } = useQueue();
  const [tab, setTab] = useState<'ACTIVE' | 'HISTORY'>('ACTIVE');

  // Active Data
  const waitingTickets = tickets.filter(t => t.status === TicketStatus.WAITING).sort((a,b) => (b.priority === a.priority) ? 0 : b.priority ? 1 : -1);
  const activeTickets = tickets.filter(t => t.status === TicketStatus.IN_PROGRESS);

  // History Data
  const historyTickets = tickets
    .filter(t => t.status === TicketStatus.DONE || t.status === TicketStatus.CANCELLED)
    .sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0));

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white">Gestão de Fila</h2>
          <p className="text-gray-400 mt-1 flex items-center gap-2">
            Operando em: <span className="text-indigo-400 font-semibold">{userConfig.deskId}</span>
          </p>
        </div>
        
        {/* Tab Switcher */}
        <div className="bg-white/5 p-1 rounded-xl flex gap-1">
            <button 
                onClick={() => setTab('ACTIVE')}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${tab === 'ACTIVE' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
                <ListIcon size={16} /> Fila Ativa
            </button>
            <button 
                onClick={() => setTab('HISTORY')}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${tab === 'HISTORY' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
                <History size={16} /> Histórico
            </button>
        </div>
      </div>

      {tab === 'ACTIVE' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 overflow-y-auto">
            {/* Waiting Column */}
            <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 box-shadow-glow"></span>
                Aguardando ({waitingTickets.length})
                </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {waitingTickets.length === 0 && (
                <div className="col-span-full p-8 rounded-2xl border border-dashed border-gray-700 text-center text-gray-500">
                    Fila vazia. Tome um café ☕
                </div>
                )}
                {waitingTickets.map(ticket => (
                <TicketCard 
                    key={ticket.id} 
                    ticket={ticket} 
                    onAction={() => updateTicketStatus(ticket.id, TicketStatus.IN_PROGRESS, userConfig.deskId)}
                    onCancel={() => updateTicketStatus(ticket.id, TicketStatus.CANCELLED)}
                    actionLabel="Chamar"
                    actionIcon={<Play size={16} />}
                    variant="waiting"
                />
                ))}
            </div>
            </div>

            {/* In Progress Column */}
            <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 box-shadow-glow"></span>
                Em Atendimento ({activeTickets.length})
                </h3>
            </div>

            <div className="space-y-4">
                {activeTickets.length === 0 && (
                <div className="p-8 rounded-2xl border border-dashed border-gray-700 text-center text-gray-500">
                    Nenhum atendimento ativo.
                </div>
                )}
                {activeTickets.map(ticket => (
                <TicketCard 
                    key={ticket.id} 
                    ticket={ticket} 
                    onAction={() => updateTicketStatus(ticket.id, TicketStatus.DONE)}
                    onCancel={() => updateTicketStatus(ticket.id, TicketStatus.WAITING)} 
                    actionLabel="Concluir"
                    actionIcon={<Check size={16} />}
                    variant="active"
                />
                ))}
            </div>
            </div>
        </div>
      ) : (
        <div className="animate-fade-in flex-1 overflow-y-auto">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {historyTickets.length === 0 && (
                     <div className="col-span-full text-center text-gray-500 py-12">
                         Nenhum histórico de atendimento hoje.
                     </div>
                )}
                {historyTickets.map(ticket => (
                     <div key={ticket.id} className="glass-panel p-4 rounded-xl border border-white/5 flex flex-col gap-3 relative overflow-hidden">
                        {ticket.status === TicketStatus.DONE ? (
                            <div className="absolute top-0 right-0 p-2 bg-green-500/10 text-green-500 text-xs font-bold rounded-bl-xl">CONCLUÍDO</div>
                        ) : (
                            <div className="absolute top-0 right-0 p-2 bg-red-500/10 text-red-500 text-xs font-bold rounded-bl-xl">CANCELADO</div>
                        )}
                        
                        <div>
                            <span className="text-xl font-bold text-white">{ticket.id}</span>
                            <p className="text-gray-400 text-sm">{ticket.name}</p>
                            <p className="text-xs text-gray-600">{ticket.service}</p>
                        </div>
                        
                        <div className="text-xs text-gray-500 flex gap-4 mt-auto pt-2 border-t border-white/5">
                             <span>Criado: {new Date(ticket.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                             {ticket.completedAt && (
                                 <span>Fim: {new Date(ticket.completedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                             )}
                        </div>

                        <button 
                            onClick={() => updateTicketStatus(ticket.id, TicketStatus.WAITING)}
                            className="w-full mt-2 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium text-indigo-300 flex items-center justify-center gap-2 transition-colors"
                        >
                            <RotateCcw size={14} /> Restaurar para Fila
                        </button>
                     </div>
                ))}
             </div>
        </div>
      )}
    </div>
  );
};

interface TicketCardProps {
  ticket: Ticket;
  onAction: () => void;
  onCancel: () => void;
  actionLabel: string;
  actionIcon: React.ReactNode;
  variant: 'waiting' | 'active';
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket, onAction, onCancel, actionLabel, actionIcon, variant }) => {
  const isPriority = ticket.priority;
  
  return (
    <div className={`
      relative overflow-hidden rounded-2xl border transition-all duration-300 group
      ${variant === 'active' 
        ? 'bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border-blue-500/30' 
        : 'glass-panel border-white/10 hover:border-white/20 hover:bg-white/5'}
    `}>
      {isPriority && (
        <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg uppercase tracking-wider">
          Prioridade
        </div>
      )}
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <span className="text-3xl font-bold text-white brand-font tracking-tight">{ticket.id}</span>
            <h4 className="text-lg font-medium text-gray-200 mt-1">{ticket.name}</h4>
          </div>
          <div className="flex flex-col items-end gap-1">
             <span className={`text-xs px-2 py-1 rounded-md border ${
               variant === 'active' ? 'bg-blue-500/20 border-blue-500/40 text-blue-300' : 'bg-gray-800 border-gray-700 text-gray-400'
             }`}>
               {ticket.service}
             </span>
             {ticket.desk && variant === 'active' && (
               <span className="text-xs text-indigo-300 font-mono mt-1">{ticket.desk}</span>
             )}
          </div>
        </div>

        <div className="flex items-center text-xs text-gray-500 mb-6 gap-4">
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {new Date(ticket.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </span>
          {variant === 'active' && ticket.startedAt && (
             <span className="flex items-center gap-1 text-blue-400">
             <Play size={12} />
             Início: {new Date(ticket.startedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
           </span>
          )}
        </div>

        <div className="flex gap-3">
          <button 
            onClick={onAction}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all
              ${variant === 'active' 
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' 
                : 'bg-white text-black hover:bg-gray-100'}
            `}
          >
            {actionIcon} {actionLabel}
          </button>
          
          <button 
            onClick={onCancel}
            className="p-2.5 rounded-xl border border-white/10 text-gray-400 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 transition-all"
            title={variant === 'active' ? "Devolver para fila" : "Cancelar"}
          >
            {variant === 'active' ? <Clock size={18} /> : <X size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};