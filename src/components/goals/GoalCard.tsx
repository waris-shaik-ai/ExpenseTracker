"use client";

// ─── GoalCard ─────────────────────────────────────────────────────────────────
// Single goal card with progress ring, deadline, savings projections.

import { useState } from "react";
import { Trash2, Plus, Trophy, Clock, TrendingUp, CheckCircle } from "lucide-react";
import { Goal } from "@/types/goal";

interface Props {
  goal: Goal;
  onAddSavings: (id: string, amount: number) => void;
  onDelete: (id: string) => void;
  onComplete: (id: string) => void;
  onShowToast: (msg: string, type: "success" | "error" | "info" | "warning", emoji?: string) => void;
}

// ── Circular progress ring ────────────────────────────────────────────────────
function ProgressRing({
  percentage,
  color,
  size = 88,
}: {
  percentage: number;
  color: string;
  size?: number;
}) {
  const r    = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const dash = Math.min((percentage / 100) * circ, circ);

  return (
    <div className="relative flex items-center justify-center flex-shrink-0">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth="7"
          className="stroke-gray-100 dark:stroke-gray-700" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth="7"
          stroke={color}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.8s cubic-bezier(0.34,1.56,0.64,1)" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center leading-none">
        <span className="text-sm font-bold text-gray-800 dark:text-white">
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
  );
}

// ── Days remaining label ──────────────────────────────────────────────────────
function daysLeft(deadline: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(deadline + "T00:00:00");
  return Math.ceil((end.getTime() - today.getTime()) / 86400000);
}

function friendlyDeadline(days: number): { label: string; urgent: boolean } {
  if (days < 0)  return { label: "Overdue",        urgent: true  };
  if (days === 0) return { label: "Due today!",     urgent: true  };
  if (days === 1) return { label: "Due tomorrow",   urgent: true  };
  if (days <= 7)  return { label: `${days}d left`,  urgent: true  };
  if (days <= 30) return { label: `${days}d left`,  urgent: false };
  const months = Math.round(days / 30);
  return { label: `~${months}mo left`, urgent: false };
}

// ── Main GoalCard ─────────────────────────────────────────────────────────────
export default function GoalCard({ goal, onAddSavings, onDelete, onComplete, onShowToast }: Props) {
  const [adding, setAdding]   = useState(false);
  const [amount, setAmount]   = useState("");

  const pct       = goal.targetAmount > 0 ? (goal.savedAmount / goal.targetAmount) * 100 : 0;
  const remaining = goal.targetAmount - goal.savedAmount;
  const days      = daysLeft(goal.deadline);
  const { label: dayLabel, urgent } = friendlyDeadline(days);
  const isCompleted = goal.status === "completed";

  // How much to save per day / week / month to hit goal
  const perDay   = days > 0 && remaining > 0 ? remaining / days : null;
  const perWeek  = perDay ? perDay * 7  : null;
  const perMonth = perDay ? perDay * 30 : null;

  function handleAdd() {
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) {
      onShowToast("Enter a valid amount!", "error");
      return;
    }
    if (val > remaining) {
      onShowToast(`Only $${remaining.toFixed(2)} more needed!`, "warning", "⚠️");
      return;
    }
    onAddSavings(goal.id, val);
    const newSaved = goal.savedAmount + val;
    if (newSaved >= goal.targetAmount) {
      onShowToast(`🎉 Goal "${goal.title}" completed!`, "success", "🏆");
    } else {
      onShowToast(`$${val.toFixed(2)} added to "${goal.title}"`, "success", "💰");
    }
    setAmount("");
    setAdding(false);
  }

  return (
    <div className={[
      "relative bg-white dark:bg-gray-800 rounded-3xl border shadow-sm overflow-hidden",
      "transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5",
      isCompleted
        ? "border-emerald-200 dark:border-emerald-800"
        : "border-gray-100 dark:border-gray-700",
    ].join(" ")}>

      {/* Completed ribbon */}
      {isCompleted && (
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
          <Trophy size={10} /> ACHIEVED
        </div>
      )}

      <div className="p-5">
        {/* Top row: icon + title + ring */}
        <div className="flex items-start gap-4">
          {/* Icon bubble */}
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-sm"
            style={{ backgroundColor: goal.color + "22", border: `1.5px solid ${goal.color}44` }}
          >
            {goal.icon}
          </div>

          {/* Title + deadline */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-800 dark:text-white text-base leading-tight truncate"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {goal.title}
            </h3>
            <div className={[
              "flex items-center gap-1 mt-1 text-xs font-medium",
              urgent ? "text-red-500 dark:text-red-400" : "text-gray-400 dark:text-gray-500",
            ].join(" ")}>
              <Clock size={11} />
              {dayLabel}
            </div>
          </div>

          {/* Progress ring */}
          <ProgressRing percentage={pct} color={goal.color} size={80} />
        </div>

        {/* Amount row */}
        <div className="mt-4 flex items-end justify-between">
          <div>
            <p className="text-xs text-gray-400 dark:text-gray-500">Saved</p>
            <p className="text-xl font-bold text-gray-800 dark:text-white"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              ${goal.savedAmount.toFixed(0)}
              <span className="text-sm font-normal text-gray-400 ml-1">
                / ${goal.targetAmount.toLocaleString()}
              </span>
            </p>
          </div>
          {!isCompleted && remaining > 0 && (
            <p className="text-xs text-gray-400">
              <span className="font-semibold text-gray-600 dark:text-gray-300">
                ${remaining.toFixed(0)}
              </span> to go
            </p>
          )}
        </div>

        {/* Progress bar */}
        <div className="mt-3 w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
          <div
            className="h-2 rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, backgroundColor: goal.color }}
          />
        </div>

        {/* Projections */}
        {!isCompleted && perDay !== null && days > 0 && (
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-gray-400 dark:text-gray-500">
            <TrendingUp size={11} className="flex-shrink-0" />
            Save{" "}
            <span className="font-semibold text-gray-600 dark:text-gray-300">
              ${perDay.toFixed(0)}/day
            </span>
            {" · "}
            <span className="font-semibold text-gray-600 dark:text-gray-300">
              ${perWeek!.toFixed(0)}/wk
            </span>
            {" · "}
            <span className="font-semibold text-gray-600 dark:text-gray-300">
              ${perMonth!.toFixed(0)}/mo
            </span>
          </div>
        )}

        {/* Add savings input */}
        {!isCompleted && adding && (
          <div className="mt-4 flex gap-2">
            <input
              type="number"
              min="1"
              step="0.01"
              placeholder="Amount to add"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              autoFocus
              className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700
                         bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white
                         px-3 py-2 text-sm focus:outline-none focus:ring-2"
              style={{ "--tw-ring-color": goal.color } as React.CSSProperties}
            />
            <button onClick={handleAdd}
              className="px-4 py-2 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
              style={{ backgroundColor: goal.color }}>
              Add
            </button>
            <button onClick={() => { setAdding(false); setAmount(""); }}
              className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-500 text-sm transition-colors hover:bg-gray-200 dark:hover:bg-gray-600">
              ✕
            </button>
          </div>
        )}

        {/* Action buttons */}
        <div className="mt-4 flex items-center gap-2">
          {!isCompleted && (
            <>
              <button
                onClick={() => setAdding(!adding)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
                style={{ backgroundColor: goal.color }}
              >
                <Plus size={15} /> Add Savings
              </button>
              <button
                onClick={() => {
                  onComplete(goal.id);
                  onShowToast(`"${goal.title}" marked as achieved! 🎉`, "success", "🏆");
                }}
                className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 transition-colors"
                title="Mark as completed"
              >
                <CheckCircle size={18} />
              </button>
            </>
          )}
          <button
            onClick={() => {
              onDelete(goal.id);
              onShowToast(`"${goal.title}" deleted`, "info");
            }}
            className="p-2 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            title="Delete goal"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}