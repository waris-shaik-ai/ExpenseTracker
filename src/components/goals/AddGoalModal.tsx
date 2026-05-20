"use client";

// ─── AddGoalModal ─────────────────────────────────────────────────────────────
// Full-screen modal to create a new savings goal.

import { useState } from "react";
import { X, Target } from "lucide-react";
import { GoalIcon } from "@/types/goal";

const ICONS: GoalIcon[] = [
  "🎯","🏠","✈️","💻","🚗","📱","🎓","💍",
  "🏋️","🎮","👗","📷","🛋️","🌴","💰","🎸",
];

const COLORS = [
  { label: "Emerald", value: "#10b981" },
  { label: "Blue",    value: "#3b82f6" },
  { label: "Purple",  value: "#a855f7" },
  { label: "Pink",    value: "#ec4899" },
  { label: "Orange",  value: "#f97316" },
  { label: "Red",     value: "#ef4444" },
  { label: "Teal",    value: "#14b8a6" },
  { label: "Indigo",  value: "#6366f1" },
];

interface Props {
  onAdd: (data: {
    title: string;
    targetAmount: number;
    deadline: string;
    icon: GoalIcon;
    color: string;
  }) => void;
  onClose: () => void;
}

const inputClass =
  "w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 " +
  "text-gray-800 dark:text-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all";

export default function AddGoalModal({ onAdd, onClose }: Props) {
  const [title,    setTitle]    = useState("");
  const [target,   setTarget]   = useState("");
  const [deadline, setDeadline] = useState("");
  const [icon,     setIcon]     = useState<GoalIcon>("🎯");
  const [color,    setColor]    = useState(COLORS[0].value);
  const [error,    setError]    = useState("");

  // Min date = tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  function handleSubmit() {
    setError("");
    if (!title.trim())            return setError("Give your goal a name!");
    const amt = parseFloat(target);
    if (isNaN(amt) || amt <= 0)   return setError("Enter a valid target amount.");
    if (!deadline)                return setError("Pick a deadline date.");

    onAdd({ title: title.trim(), targetAmount: amt, deadline, icon, color });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ animation: "fadeIn 0.2s ease" }}>

      <style>{`
        @keyframes fadeIn   { from { opacity:0 }               to { opacity:1 }               }
        @keyframes slideUp  { from { opacity:0; transform:translateY(24px) scale(0.97) }
                              to   { opacity:1; transform:translateY(0)    scale(1)    } }
      `}</style>

      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
        style={{ animation: "slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-100 dark:bg-emerald-900/40 p-2 rounded-xl">
              <Target size={18} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              New Savings Goal
            </h2>
          </div>
          <button onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-5 max-h-[70vh] overflow-y-auto">

          {/* Icon picker */}
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
              Pick an Icon
            </p>
            <div className="grid grid-cols-8 gap-1.5">
              {ICONS.map((ic) => (
                <button key={ic} onClick={() => setIcon(ic)}
                  className={[
                    "text-xl h-10 rounded-xl transition-all hover:scale-110 active:scale-95",
                    icon === ic
                      ? "bg-emerald-100 dark:bg-emerald-900/40 ring-2 ring-emerald-500 scale-110"
                      : "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700",
                  ].join(" ")}>
                  {ic}
                </button>
              ))}
            </div>
          </div>

          {/* Color picker */}
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
              Choose a Color
            </p>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map((c) => (
                <button key={c.value} onClick={() => setColor(c.value)}
                  className={[
                    "w-8 h-8 rounded-full transition-all hover:scale-110 active:scale-95",
                    color === c.value ? "ring-2 ring-offset-2 ring-gray-400 dark:ring-offset-gray-900 scale-110" : "",
                  ].join(" ")}
                  style={{ backgroundColor: c.value }}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="flex items-center gap-3 p-3 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ backgroundColor: color + "22" }}>
              {icon}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800 dark:text-white"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {title || "Your goal name"}
              </p>
              <p className="text-xs text-gray-400">
                {target ? `$${parseFloat(target).toLocaleString()}` : "$0"} target
              </p>
            </div>
          </div>

          {/* Goal name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Goal Name
            </label>
            <input className={inputClass} placeholder='e.g. "Buy a MacBook Pro"'
              value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          {/* Target amount */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Target Amount ($)
            </label>
            <input className={inputClass} type="number" min="1" step="1"
              placeholder="e.g. 2499"
              value={target} onChange={(e) => setTarget(e.target.value)} />
          </div>

          {/* Deadline */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Target Deadline
            </label>
            <input className={inputClass} type="date" min={minDate}
              value={deadline} onChange={(e) => setDeadline(e.target.value)} />
          </div>

          {error && (
            <p className="text-sm text-red-500 dark:text-red-400 font-medium">{error}</p>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit}
            className="flex-1 py-2.5 rounded-xl text-white text-sm font-bold transition-all hover:opacity-90 active:scale-95"
            style={{ backgroundColor: color }}>
            Create Goal 🎯
          </button>
        </div>
      </div>
    </div>
  );
}