"use client";

// ─── Toast System ─────────────────────────────────────────────────────────────
// Lightweight toast notifications — no external library needed.
// Usage:
//   const { toasts, showToast } = useToast();
//   showToast("Saved!", "success");
//   <ToastContainer toasts={toasts} />

import { useState, useCallback } from "react";
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  emoji?: string;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (message: string, type: ToastType = "info", emoji?: string) => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, message, type, emoji }]);
      // Auto-remove after 3.5s
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3500);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, showToast, removeToast };
}

// ── Toast UI component ────────────────────────────────────────────────────────

const ICONS: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle size={16} className="text-emerald-500" />,
  error:   <XCircle    size={16} className="text-red-500"     />,
  info:    <Info       size={16} className="text-blue-500"    />,
  warning: <AlertTriangle size={16} className="text-yellow-500" />,
};

const STYLES: Record<ToastType, string> = {
  success: "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/30",
  error:   "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/30",
  info:    "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/30",
  warning: "border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/30",
};

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  return (
    <div
      className={[
        "flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-lg",
        "animate-in slide-in-from-right-full duration-300",
        "min-w-[260px] max-w-[360px]",
        STYLES[toast.type],
      ].join(" ")}
      style={{
        animation: "slideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
    >
      {toast.emoji ? (
        <span className="text-lg flex-shrink-0">{toast.emoji}</span>
      ) : (
        <span className="flex-shrink-0">{ICONS[toast.type]}</span>
      )}
      <p className="text-sm font-medium text-gray-800 dark:text-gray-100 flex-1">
        {toast.message}
      </p>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 flex-shrink-0 ml-1"
      >
        <X size={14} />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(100%) scale(0.8); }
          to   { opacity: 1; transform: translateX(0)   scale(1);   }
        }
      `}</style>
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 items-end">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onRemove={onRemove} />
        ))}
      </div>
    </>
  );
}