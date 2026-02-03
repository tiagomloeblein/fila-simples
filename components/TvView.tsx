import React, { useEffect, useRef, useState } from 'react';
import { useQueue } from '../context/QueueContext';
import { TicketStatus } from '../types';
import { playNotificationSound, speakTicket } from '../services/audioService';
import { Volume2, Maximize2 } from 'lucide-react';

export const TvView: React.FC = () => {
  const { tickets, userConfig } = useQueue();
  const lastProcessedTicketId = useRef<string | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(false);

  // Get the last called ticket (In Progress)
  const currentTicket = tickets
    .filter(t => t.status === TicketStatus.IN_PROGRESS)
    .sort((a,b) => (b.startedAt || 0) - (a.startedAt || 0))[0];

  const nextTickets = tickets
    .filter(t => t.status === TicketStatus.WAITING)
    .slice(0, 3);

  // Effect para tocar som e falar
  useEffect(() => {
    if (audioEnabled && currentTicket && currentTicket.id !== lastProcessedTicketId.current) {
      // Novo ticket chamado!
      lastProcessedTicketId.current = currentTicket.id;
      
      playNotificationSound();
      
      // Delay pequeno para a fala não sobrepor o chime
      setTimeout(() => {
        const textToSpeak = `Senha ${currentTicket.id}, comparecer ao ${currentTicket.desk || 'Guichê'}`;
        speakTicket(textToSpeak, userConfig.voiceURI);
      }, 1000);
    }
  }, [currentTicket, audioEnabled, userConfig.voiceURI]);

  // Handle User Interaction to Unlock Audio Context
  const enableAudio = () => {
    setAudioEnabled(true);
    // Tocar um som silencioso ou breve para destravar o contexto
    playNotificationSound();
    
    // Tentar tela cheia
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(err => console.log(err));
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col p-8 relative overflow-hidden">
      {!audioEnabled && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center">
            <button 
                onClick={enableAudio}
                className="group relative px-8 py-6 bg-indigo-600 rounded-3xl text-white font-bold text-2xl flex flex-col items-center gap-4 hover:scale-105 transition-all shadow-[0_0_50px_rgba(79,70,229,0.5)]"
            >
                <div className="p-4 bg-white/10 rounded-full group-hover:bg-white/20 transition-colors">
                    <Maximize2 size={40} />
                </div>
                <span>Iniciar Painel TV</span>
                <span className="text-sm text-indigo-200 font-normal">Clique para ativar som e tela cheia</span>
            </button>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-black to-black"></div>
      
      <header className="relative z-10 flex justify-between items-center mb-12 border-b border-white/10 pb-6">
        <h1 className="text-4xl font-bold text-white brand-font">Fila <span className="text-indigo-500">Simples</span> TV</h1>
        <div className="text-2xl text-gray-400 font-mono">
          {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </div>
      </header>

      <div className="flex-1 grid grid-cols-12 gap-8 relative z-10">
        {/* Main Call Area */}
        <div className="col-span-8 flex items-center justify-center">
          {currentTicket ? (
            <div className="w-full text-center space-y-8 animate-pulse-gentle">
              <h2 className="text-4xl text-gray-400 uppercase tracking-widest">Senha Atual</h2>
              <div className="text-[12rem] leading-none font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 brand-font">
                {currentTicket.id}
              </div>
              <div className="space-y-2">
                <p className="text-5xl font-medium text-white">{currentTicket.name}</p>
                <p className="text-3xl text-indigo-400">{currentTicket.service}</p>
              </div>
              <div className="inline-block px-8 py-3 rounded-full bg-indigo-600/20 border border-indigo-500 text-indigo-300 text-xl font-bold uppercase tracking-widest mt-8">
                {currentTicket.desk || 'Guichê --'}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-600">
              <p className="text-4xl">Aguardando chamada...</p>
            </div>
          )}
        </div>

        {/* Sidebar List */}
        <div className="col-span-4 glass-panel rounded-3xl p-8 border border-white/10 flex flex-col">
          <h3 className="text-2xl font-bold text-gray-300 mb-6 uppercase tracking-wider">Próximos</h3>
          <div className="space-y-4 flex-1">
            {nextTickets.map((ticket, idx) => (
              <div key={ticket.id} className="p-6 rounded-2xl bg-white/5 border border-white/5 flex justify-between items-center">
                <div>
                  <span className="text-3xl font-bold text-white block">{ticket.id}</span>
                  <span className="text-gray-400 text-sm">{ticket.name.split(' ')[0]}</span>
                </div>
                {ticket.priority && (
                   <span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_red]"></span>
                )}
              </div>
            ))}
            {nextTickets.length === 0 && <p className="text-gray-600">Fila vazia.</p>}
          </div>
          
          <div className="mt-auto pt-6 border-t border-white/10 text-center">
            <p className="text-gray-500 text-sm">Retire sua senha no totem.</p>
          </div>
        </div>
      </div>
    </div>
  );
};