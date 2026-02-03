import React, { useState, useEffect } from 'react';
import { useQueue } from '../context/QueueContext';
import { Save, Volume2, Trash2, AlertTriangle } from 'lucide-react';
import { getVoices } from '../services/audioService';

export const Settings: React.FC = () => {
  const { userConfig, updateUserConfig, resetQueue } = useQueue();
  const [desk, setDesk] = useState(userConfig.deskId);
  const [selectedVoice, setSelectedVoice] = useState(userConfig.voiceURI || '');
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [saved, setSaved] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    const loadVoices = async () => {
      const voices = await getVoices();
      const ptVoices = voices.filter(v => v.lang.includes('pt'));
      setAvailableVoices(ptVoices.length > 0 ? ptVoices : voices);
    };
    loadVoices();
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserConfig({ 
      deskId: desk,
      voiceURI: selectedVoice
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const testVoice = () => {
    if (!selectedVoice) return;
    const utterance = new SpeechSynthesisUtterance("Teste de voz. Senha A 0 0 1.");
    const voice = availableVoices.find(v => v.voiceURI === selectedVoice);
    if (voice) utterance.voice = voice;
    window.speechSynthesis.speak(utterance);
  };

  const handleReset = () => {
    resetQueue();
    setShowResetConfirm(false);
    alert("Fila resetada com sucesso!");
  };

  return (
    <div className="animate-fade-in max-w-lg">
       <h2 className="text-3xl font-bold text-white mb-6">Configurações</h2>
       
       <div className="glass-panel p-8 rounded-3xl border-t border-white/10 space-y-8">
         <form onSubmit={handleSave} className="space-y-6">
           <div>
             <label className="block text-gray-400 text-sm font-medium mb-2">Identificação deste posto</label>
             <input
                type="text"
                value={desk}
                onChange={(e) => setDesk(e.target.value)}
                className="w-full bg-white/5 text-white px-4 py-3 rounded-xl border border-white/10 focus:border-indigo-500 outline-none"
                placeholder="Ex: Guichê 01, Mesa 03..."
             />
             <p className="text-xs text-gray-500 mt-2">Este nome aparecerá na TV quando você chamar uma senha.</p>
           </div>

           <div>
             <label className="block text-gray-400 text-sm font-medium mb-2">Voz de Chamada (TV)</label>
             <div className="flex gap-2">
                <select
                    value={selectedVoice}
                    onChange={(e) => setSelectedVoice(e.target.value)}
                    className="w-full bg-white/5 text-white px-4 py-3 rounded-xl border border-white/10 focus:border-indigo-500 outline-none"
                >
                    <option value="">Padrão do Sistema</option>
                    {availableVoices.map(voice => (
                    <option key={voice.voiceURI} value={voice.voiceURI}>
                        {voice.name}
                    </option>
                    ))}
                </select>
                <button 
                    type="button" 
                    onClick={testVoice}
                    className="p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10"
                    title="Testar voz"
                >
                    <Volume2 size={20} />
                </button>
             </div>
             <p className="text-xs text-gray-500 mt-2">Selecione a voz que será usada no painel da TV.</p>
           </div>

           <button
            type="submit"
            className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${saved ? 'bg-green-500 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}
           >
             {saved ? 'Salvo!' : <><Save size={18} /> Salvar Configuração</>}
           </button>
         </form>

         {/* Zona de Perigo */}
         <div className="pt-6 border-t border-white/10">
            <h3 className="text-red-400 font-bold mb-4 flex items-center gap-2">
                <AlertTriangle size={20} />
                Zona de Perigo
            </h3>
            
            {!showResetConfirm ? (
                <button 
                    onClick={() => setShowResetConfirm(true)}
                    className="w-full border border-red-500/30 text-red-400 hover:bg-red-500/10 px-4 py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                    <Trash2 size={18} />
                    Zerar Fila de Hoje
                </button>
            ) : (
                <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl text-center">
                    <p className="text-white text-sm mb-4">Tem certeza? Isso apagará todas as senhas de hoje.</p>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => setShowResetConfirm(false)}
                            className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg text-sm"
                        >
                            Cancelar
                        </button>
                        <button 
                            onClick={handleReset}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm font-bold"
                        >
                            Confirmar Reset
                        </button>
                    </div>
                </div>
            )}
         </div>
       </div>
    </div>
  );
};