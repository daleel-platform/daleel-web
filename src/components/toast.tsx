import { useState, useCallback, type ReactNode } from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { ToastContext, type ToastItem, type ToastType } from './toast-context';

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = 'info') => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      setToasts((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        removeToast(id);
      }, 4000);
    },
    [removeToast],
  );

  const success = useCallback(
    (message: string) => showToast(message, 'success'),
    [showToast],
  );
  const error = useCallback(
    (message: string) => showToast(message, 'error'),
    [showToast],
  );
  const info = useCallback(
    (message: string) => showToast(message, 'info'),
    [showToast],
  );

  return (
    <ToastContext.Provider value={{ showToast, success, error, info }}>
      {children}
      <div
        aria-live="polite"
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={cn(
              'pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border text-xs font-medium animate-in slide-in-from-bottom-5 duration-200 bg-white',
              toast.type === 'success' && 'border-emerald-200 text-emerald-800',
              toast.type === 'error' && 'border-red-200 text-red-800',
              toast.type === 'info' && 'border-teal-200 text-teal-800',
            )}
          >
            {toast.type === 'success' && (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            )}
            {toast.type === 'error' && (
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
            )}
            {toast.type === 'info' && (
              <Info className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
            )}
            <p className="flex-1 leading-relaxed text-slate-800">
              {toast.message}
            </p>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              aria-label="Dismiss notification"
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
