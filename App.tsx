import React, { useState, useEffect } from 'react';
import { QueueProvider } from './context/QueueContext';
import { Dashboard } from './components/Dashboard';
import { QueueList } from './components/QueueList';
import { Kiosk } from './components/Kiosk';
import { TvView } from './components/TvView';
import { Login } from './components/Login';
import { Settings } from './components/Settings';
import { ViewMode } from './types';
import { LayoutDashboard, List, Tv, UserPlus, Menu, X, Settings as SettingsIcon, LogOut } from 'lucide-react';

const AppContent: React.FC = () => {
  const [view, setView] = useState<ViewMode>('LOGIN'); // Start at login
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Auto-login check (simulated session)
  useEffect(() => {
    const session = sessionStorage.getItem('fluxo_auth');
    if (session === 'true') {
      setIsAuthenticated(true);
      setView('DASHBOARD');
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('fluxo_auth', 'true');
    setView('DASHBOARD');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('fluxo_auth');
    setView('LOGIN');
  };

  // Public views (No Auth required)
  if (view === 'KIOSK') {
    return (
      <div className="relative">
        <button 
          onClick={() => setView(isAuthenticated ? 'DASHBOARD' : 'LOGIN')}
          className="fixed top-4 right-4 z-50 p-2 bg-black/50 text-white/50 hover:text-white rounded-full backdrop-blur-md print:hidden"
        >
          <X size={20} />
        </button>
        <Kiosk />
      </div>
    );
  }

  if (view === 'TV') {
    return (
      <div className="relative">
         <button 
          onClick={() => setView(isAuthenticated ? 'DASHBOARD' : 'LOGIN')}
          className="fixed top-4 right-4 z-50 p-2 bg-black/50 text-white/50 hover:text-white rounded-full backdrop-blur-md"
        >
          <X size={20} />
        </button>
        <TvView />
      </div>
    );
  }

  if (!isAuthenticated && view === 'LOGIN') {
    return (
      <div>
         <div className="fixed top-4 right-4 flex gap-2 z-50">
            <button onClick={() => setView('KIOSK')} className="text-xs text-gray-500 hover:text-white">Kiosk</button>
            <button onClick={() => setView('TV')} className="text-xs text-gray-500 hover:text-white">TV</button>
         </div>
         <Login onLogin={handleLogin} />
      </div>
    );
  }

  const NavItem = ({ mode, icon, label }: { mode: ViewMode, icon: React.ReactNode, label: string }) => (
    <button
      onClick={() => {
        setView(mode);
        setMobileMenuOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
        ${view === mode 
          ? 'bg-white text-black font-semibold shadow-[0_0_20px_rgba(255,255,255,0.3)]' 
          : 'text-gray-400 hover:bg-white/5 hover:text-white'}
      `}
    >
      <span className={view === mode ? 'text-indigo-600' : 'text-gray-500 group-hover:text-white'}>
        {icon}
      </span>
      {label}
    </button>
  );

  const renderView = () => {
    switch(view) {
      case 'DASHBOARD': return <Dashboard />;
      case 'QUEUE': return <QueueList />;
      case 'SETTINGS': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#050505] text-white selection:bg-indigo-500 selection:text-white">
      {/* Mobile Menu Toggle */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 bg-zinc-800 rounded-lg border border-zinc-700">
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 glass-panel border-r border-white/5 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-8">
          <h1 className="text-2xl font-bold tracking-tighter flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500"></div>
            Fila Simples
          </h1>
        </div>

        <nav className="px-4 space-y-2">
          <NavItem mode="DASHBOARD" icon={<LayoutDashboard size={20} />} label="Visão Geral" />
          <NavItem mode="QUEUE" icon={<List size={20} />} label="Gestão de Fila" />
          <NavItem mode="SETTINGS" icon={<SettingsIcon size={20} />} label="Configurações" />
          
          <div className="my-4 border-t border-white/5 mx-4"></div>
          <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Modos Públicos</p>
          <NavItem mode="KIOSK" icon={<UserPlus size={20} />} label="Abrir Totem" />
          <NavItem mode="TV" icon={<Tv size={20} />} label="Abrir TV" />
        </nav>

        <div className="absolute bottom-0 w-full p-6 border-t border-white/5">
           <button 
             onClick={handleLogout}
             className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-left"
           >
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-700 to-gray-600 flex items-center justify-center text-xs font-bold">ADM</div>
            <div>
              <p className="text-sm font-medium">Sair</p>
              <p className="text-xs text-gray-500">Encerrar sessão</p>
            </div>
            <LogOut size={16} className="ml-auto text-gray-500" />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto h-screen relative">
        {/* Decorative Background Elements */}
        <div className="fixed top-0 left-64 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="relative z-10">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <QueueProvider>
      <AppContent />
    </QueueProvider>
  );
};

export default App;