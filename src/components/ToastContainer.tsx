import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none font-sans">
      {toasts.map((t) => {
        const icons = {
          success: <CheckCircle2 className="w-4 h-4 text-[#00FF66] flex-shrink-0" />,
          warning: <AlertTriangle className="w-4 h-4 text-[#FFB800] flex-shrink-0" />,
          info: <Info className="w-4 h-4 text-white flex-shrink-0" />,
          error: <XCircle className="w-4 h-4 text-[#E61919] flex-shrink-0" />,
        };

        const borders = {
          success: 'border-[#00FF66]/40 bg-[#111111]/95',
          warning: 'border-[#FFB800]/40 bg-[#111111]/95',
          info: 'border-[#333333] bg-[#111111]/95',
          error: 'border-[#E61919]/50 bg-[#111111]/95',
        };

        return (
          <div
            key={t.id}
            className={`pointer-events-auto p-3.5 rounded-lg border shadow-2xl backdrop-blur-md text-[#E0E0E0] flex items-start gap-2.5 transform transition-all duration-300 animate-slideUp ${borders[t.type]}`}
          >
            {icons[t.type]}
            <div className="flex-1 min-w-0">
              <h5 className="text-xs font-bold text-white uppercase tracking-tight font-mono">{t.title}</h5>
              <p className="text-[11px] text-[#888888] mt-0.5 leading-snug">{t.message}</p>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-[#666666] hover:text-white p-1 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
