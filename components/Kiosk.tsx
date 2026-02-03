import React, { useState } from 'react';
import { useQueue } from '../context/QueueContext';
import { ServiceType } from '../types';
import { ChevronRight, Ticket as TicketIcon, Printer } from 'lucide-react';

export const Kiosk: React.FC = () => {
  const { addTicket } = useQueue();
  const [name, setName] = useState('');
  const [service, setService] = useState<ServiceType>(ServiceType.SALES);
  const [priority, setPriority] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [lastTicket, setLastTicket] = useState<{id: string, name: string, service: string, date: string} | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    const ticket = addTicket(name, service, priority);
    
    // Preparar dados para impressão
    setLastTicket({
      id: ticket.id,
      name: ticket.name,
      service: ticket.service,
      date: new Date().toLocaleString()
    });

    setSubmitted(true);
    
    // Auto print (opcional, pode ser bloqueado pelo browser sem interação)
    setTimeout(() => {
      window.print();
    }, 500);
    
    // Reset
    setTimeout(() => {
      setName('');
      setService(ServiceType.SALES);
      setPriority(false);
      setSubmitted(false);
      setLastTicket(null);
    }, 5000);
  };

  if (submitted && lastTicket) {
    return (
      <>
        {/* Tela de Feedback Visual */}
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center animate-fade-in relative overflow-hidden print:hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/20 to-transparent pointer-events-none"></div>
          <div className="w-24 h-24 rounded-full bg-emerald-500 flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(16,185,129,0.4)] animate-bounce-gentle">
            <TicketIcon className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-2 brand-font">Senha Gerada!</h2>
          <p className="text-6xl font-bold text-emerald-400 my-6">{lastTicket.id}</p>
          <p className="text-gray-500">Retire seu comprovante.</p>
        </div>

        {/* Layout de Impressão (Só aparece no papel) */}
        <div className="hidden print:block text-black p-4 text-center font-mono">
          <h1 className="text-2xl font-bold mb-2">Fila Simples</h1>
          <div className="border-b border-black my-2"></div>
          <h2 className="text-4xl font-bold my-4">{lastTicket.id}</h2>
          <p className="text-lg">{lastTicket.service}</p>
          {priority && <p className="font-bold uppercase mt-2">Prioridade</p>}
          <div className="border-b border-black my-4"></div>
          <p className="text-sm">{lastTicket.name}</p>
          <p className="text-xs mt-1">{lastTicket.date}</p>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden print:hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-lg relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-white mb-4 brand-font tracking-tight">Fila Simples</h1>
          <p className="text-gray-400 text-lg">Retire sua senha digital para atendimento.</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-3xl shadow-2xl border-t border-white/10">
          <div className="space-y-6">
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Seu Nome</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Digite seu nome completo"
                className="w-full bg-white text-gray-900 px-6 py-4 rounded-xl border-2 border-transparent focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all placeholder-gray-400 text-lg font-medium"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Tipo de Serviço</label>
              <div className="relative">
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value as ServiceType)}
                  className="w-full bg-white text-gray-900 px-6 py-4 rounded-xl border-2 border-transparent focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all appearance-none text-lg font-medium"
                >
                  {Object.values(ServiceType).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                  <ChevronRight className="rotate-90" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors" onClick={() => setPriority(!priority)}>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${priority ? 'bg-indigo-500 border-indigo-500' : 'border-gray-500'}`}>
                {priority && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
              </div>
              <div>
                <span className="text-white font-medium block">Atendimento Prioritário</span>
                <span className="text-xs text-gray-400">Idosos, gestantes, PNE.</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-lg py-5 rounded-xl shadow-xl shadow-indigo-600/20 transform active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
            >
              <Printer className="w-5 h-5" />
              Gerar Senha
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};