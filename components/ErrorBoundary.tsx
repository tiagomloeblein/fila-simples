import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  constructor(props: Props) {
    super(props);
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#050505] text-white p-6">
          <div className="glass-panel p-8 rounded-3xl max-w-md text-center border border-red-500/20">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="text-red-500 w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold mb-2 brand-font">Ops! Algo deu errado.</h1>
            <p className="text-gray-400 mb-6 text-sm">
              Ocorreu um erro inesperado no sistema. Tente recarregar a página.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-white text-black font-bold py-3 px-6 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 w-full"
            >
              <RefreshCw size={18} />
              Recarregar Sistema
            </button>
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-6 p-4 bg-black/50 rounded-xl text-left overflow-auto max-h-32 text-xs font-mono text-red-300">
                {this.state.error?.toString()}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}