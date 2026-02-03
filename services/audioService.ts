let audioContext: AudioContext | null = null;

const getAudioContext = () => {
  if (!audioContext) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioContext = new AudioContextClass();
    }
  }
  return audioContext;
};

export const playNotificationSound = () => {
  const ctx = getAudioContext();
  if (!ctx) return;

  // Navegadores bloqueiam áudio até interação do usuário. 
  // O componente TvView já lida com o desbloqueio, mas é bom garantir o resume.
  if (ctx.state === 'suspended') {
    ctx.resume().catch(e => console.error("Audio context resume failed", e));
  }
  
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = 'sine';
  osc.frequency.setValueAtTime(500, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.1);
  
  gain.gain.setValueAtTime(0.1, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

  osc.start();
  osc.stop(ctx.currentTime + 0.5);
};

export const getVoices = (): Promise<SpeechSynthesisVoice[]> => {
  return new Promise((resolve) => {
    let voices = window.speechSynthesis.getVoices();
    if (voices.length) {
      resolve(voices);
      return;
    }
    window.speechSynthesis.onvoiceschanged = () => {
      voices = window.speechSynthesis.getVoices();
      resolve(voices);
    };
  });
};

export const speakTicket = async (text: string, voiceURI?: string) => {
  if (!('speechSynthesis' in window)) return;

  // Cancelar falas anteriores para não encavalar
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  
  const voices = await getVoices();
  const selectedVoice = voices.find(v => v.voiceURI === voiceURI);
  
  if (selectedVoice) {
    utterance.voice = selectedVoice;
  } else {
    // Fallback inteligente para pt-BR
    const ptVoice = voices.find(v => v.lang === 'pt-BR') || voices.find(v => v.lang.includes('pt'));
    if (ptVoice) utterance.voice = ptVoice;
  }

  utterance.lang = 'pt-BR';
  utterance.rate = 0.9;
  utterance.pitch = 1;
  
  window.speechSynthesis.speak(utterance);
};