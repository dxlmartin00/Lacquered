import { Component, ErrorInfo, ReactNode } from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';


interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Laquered Runtime Caught Error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-[100dvh] w-screen bg-[#fff5f7] p-6 text-slate-800 select-none">
          <div className="max-w-md w-full pastel-card p-6 sm:p-8 rounded-3xl border border-pink-200 text-center space-y-4 shadow-lg shadow-pink-100">
            <div className="w-14 h-14 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center mx-auto shadow-xs">
              <AlertTriangle className="w-7 h-7 stroke-[2]" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-extrabold font-display text-slate-800">
                Something paused in Laquered
              </h2>
              <p className="text-xs text-slate-500">
                Your database and client records are safe. Tap below to reload the studio workspace.
              </p>
            </div>

            <button
              type="button"
              onClick={this.handleReload}
              className="w-full py-3 px-4 rounded-2xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md shadow-pink-200 tactile-btn"
            >
              <RotateCcw className="w-4 h-4 stroke-[2.5]" />
              <span>Reload Studio</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
