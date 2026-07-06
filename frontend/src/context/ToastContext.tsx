import { createContext, useContext, useRef, useState, type ReactNode } from 'react';

interface ToastValue {
  showToast: (message: string) => void;
}

const ToastContext = createContext<ToastValue | null>(null);

/** Toast navy com check animado (SPEC §12.3). Sobe do rodapé e some em ~2,6s. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  const showToast = (msg: string) => {
    if (timer.current) clearTimeout(timer.current);
    setMessage(msg);
    timer.current = setTimeout(() => setMessage(null), 2600);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {message && (
        <div className="toast" role="status">
          <svg width="18" height="18" viewBox="0 0 18 18">
            <circle cx="9" cy="9" r="8" fill="none" stroke="#7CE0A0" strokeWidth="1.6" />
            <path
              d="M5.5 9.3 8 11.8 12.7 6.5"
              fill="none"
              stroke="#7CE0A0"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="toast-check"
            />
          </svg>
          <span>{message}</span>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast precisa estar dentro de <ToastProvider>');
  return ctx;
}
