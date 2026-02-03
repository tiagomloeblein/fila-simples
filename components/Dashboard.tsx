import React, { useState } from 'react';
import { useQueue } from '../context/QueueContext';
import { TicketStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Users, Clock, CheckCircle, RefreshCw, Sparkles, AlertCircle } from 'lucide-react';
import { generateQueueInsights } from '../services/geminiService';

export const Dashboard: React.FC = () => {
  const { tickets } = useQueue();
  const [insight, setInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);

  // Calculate Stats
  const waiting = tickets.filter(t => t.status === TicketStatus.WAITING).length;
  const inProgress = tickets.filter(t => t.status === TicketStatus.IN_PROGRESS).length;
  const done = tickets.filter(t => t.status === TicketStatus.DONE).length;
  
  // Avg Wait Calculation
  const finishedTickets = tickets.filter(t => t.completedAt && t.createdAt);
  const avgWait = finishedTickets.length > 0 
    ? Math.floor(finishedTickets.reduce((acc, t) => acc + ((t.completedAt! - t.createdAt) / 60000), 0) / finishedTickets.length)
    : 0;

  const chartData = [
    { name: 'Aguardando', value: waiting, color: '#fbbf24' },
    { name: 'Atendendo', value: inProgress, color: '#3b82f6' },
    { name: 'Concluído', value: done, color: '#10b981' },
    { name: 'Cancelado', value: tickets.filter(t => t.status === TicketStatus.CANCELLED).length, color: '#ef4444' },
  ];

  const handleGenerateInsights = async () => {
    setLoadingInsight(true);
    const result = await generateQueueInsights(tickets);
    setInsight(result);
    setLoadingInsight(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Dashboard Operacional</h2>
          <p className="text-gray-400">Visão geral em tempo real da sua operação.</p>
        </div>
        <button 
            onClick={handleGenerateInsights}
            disabled={loadingInsight}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-[0_0_15px_rgba(124,58,237,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {loadingInsight ? <RefreshCw className="animate-spin" size={18}/> : <Sparkles size={18} />}
            {loadingInsight ? 'Analisando...' : 'Insights IA'}
        </button>
      </div>

      {/* Insight Panel */}
      {insight && (
          <div className="glass-panel p-6 rounded-3xl border border-purple-500/30 bg-purple-900/10 mb-6 animate-fade-in relative overflow-hidden">
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>
             <div className="flex items-start gap-4 relative z-10">
                <div className="p-3 bg-purple-500/20 rounded-full text-purple-300 mt-1">
                    <Sparkles size={24} />
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-2">Análise de Eficiência</h3>
                    <div 
                        className="text-gray-300 prose prose-invert prose-p:my-1 prose-ul:my-2 prose-li:marker:text-purple-400"
                        dangerouslySetInnerHTML={{ __html: insight }} 
                    />
                </div>
                <button onClick={() => setInsight(null)} className="text-gray-500 hover:text-white"><AlertCircle size={20}/></button>
             </div>
          </div>
      )}

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Users />} label="Na Fila" value={waiting} color="text-amber-400" bg="bg-amber-400/10" border="border-amber-400/20" />
        <StatCard icon={<RefreshCw />} label="Em Atendimento" value={inProgress} color="text-blue-400" bg="bg-blue-400/10" border="border-blue-400/20" />
        <StatCard icon={<CheckCircle />} label="Concluídos" value={done} color="text-emerald-400" bg="bg-emerald-400/10" border="border-emerald-400/20" />
        <StatCard icon={<Clock />} label="Espera Média" value={`${avgWait} min`} color="text-pink-400" bg="bg-pink-400/10" border="border-pink-400/20" />
      </div>

      {/* Main Chart Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl min-h-[400px]">
          <h3 className="text-xl font-bold text-white mb-6">Fluxo de Atendimento</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barSize={60}>
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9ca3af', fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  hide 
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#1f1f2e', border: '1px solid #333', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="value" radius={[10, 10, 10, 10]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity Mini Feed */}
        <div className="glass-panel p-6 rounded-3xl">
          <h3 className="text-xl font-bold text-white mb-4">Atividade Recente</h3>
          <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
            {tickets.sort((a,b) => b.createdAt - a.createdAt).slice(0, 5).map(ticket => (
              <div key={ticket.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                <div className={`w-2 h-2 rounded-full ${ticket.status === TicketStatus.WAITING ? 'bg-amber-400' : ticket.status === TicketStatus.IN_PROGRESS ? 'bg-blue-400' : 'bg-gray-400'}`} />
                <div>
                  <p className="text-sm font-medium text-white">{ticket.name}</p>
                  <p className="text-xs text-gray-400">{ticket.service}</p>
                </div>
                <div className="ml-auto text-xs text-gray-500 font-mono">
                  {new Date(ticket.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              </div>
            ))}
            {tickets.length === 0 && <p className="text-gray-500 text-center py-4">Nenhuma atividade.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color, bg, border }: any) => (
  <div className={`glass-panel p-6 rounded-2xl border ${border} relative overflow-hidden`}>
    <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full ${bg} blur-xl`}></div>
    <div className="relative z-10 flex items-center justify-between">
      <div>
        <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">{label}</p>
        <p className="text-3xl font-bold text-white mt-1 brand-font">{value}</p>
      </div>
      <div className={`p-3 rounded-xl ${bg} ${color}`}>
        {React.cloneElement(icon, { size: 24 })}
      </div>
    </div>
  </div>
);