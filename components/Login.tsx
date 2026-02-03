import React, { useState } from 'react';
import { Lock } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '1234') { // Hardcoded para MVP
      onLogin();
    } else {
      setError(true);
      setPin('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
       <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]"></div>
      
      <div className="glass-panel p-8 rounded-3xl w-full max-w-sm border-t border-white/10 text-center">
        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="text-indigo-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Acesso Restrito</h2>
        <p className="text-gray-400 mb-6 text-sm">Digite o PIN administrativo (1234)</p>
        
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            maxLength={4}
            value={pin}
            onChange={(e) => {
              setPin(e.target.value);
              setError(false);
            }}
            placeholder="0000"
            className={`w-full bg-black/50 text-center text-2xl tracking-[0.5em] px-6 py-4 rounded-xl border-2 outline-none transition-all ${error ? 'border-red-500' : 'border-white/10 focus:border-indigo-500'}`}
          />
          {error && <p className="text-red-400 text-xs mt-2">Senha incorreta.</p>}
          
          <button
            type="submit"
            className="w-full mt-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};