"use client";

// ── Goals page ────────────────────────────────────────────────────────────────

import { useState } from "react";
import { Plus, Trophy, Target, Sparkles } from "lucide-react";
import { useGoals } from "@/hooks/useGoals";
import { useToast, ToastContainer } from "@/components/Toast";
import GoalCard from "@/components/goals/GoalCard";
import AddGoalModal from "@/components/goals/AddGoalModal";

export default function GoalsPage() {
  const { goals, addGoal, addSavings, deleteGoal, completeGoal, isLoaded } = useGoals();
  const { toasts, showToast, removeToast } = useToast();
  const [showModal, setShowModal] = useState(false);

  if (!isLoaded) return <div className="text-center text-gray-400 py-20">Loading…</div>;

  const active    = goals.filter((g) => g.status === "active");
  const completed = goals.filter((g) => g.status === "completed");
  const totalSaved = goals.reduce((s, g) => s + g.savedAmount, 0);
  const totalTarget = goals.reduce((s, g) => s + g.targetAmount, 0);

  return (
    <>
      <div className="flex flex-col gap-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Savings Goals
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Set goals, track progress, celebrate wins 🎉
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 active:scale-95
                       text-white px-4 py-2.5 rounded-2xl text-sm font-bold shadow-lg shadow-emerald-500/25
                       transition-all duration-200"
          >
            <Plus size={16} /> New Goal
          </button>
        </div>

        {/* Summary stats */}
        {goals.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Total Goals",   value: String(goals.length),              icon: "🎯", color: "blue"    },
              { label: "Active",        value: String(active.length),             icon: "⚡", color: "orange"  },
              { label: "Achieved",      value: String(completed.length),          icon: "🏆", color: "emerald" },
              { label: "Total Saved",   value: `$${totalSaved.toFixed(0)}`,       icon: "💰", color: "purple"  },
            ].map(({ label, value, icon, color }) => (
              <div key={label}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 shadow-sm">
                <p className="text-xl">{icon}</p>
                <p className={`text-xl font-bold text-${color}-600 dark:text-${color}-400 mt-1`}
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {value}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Overall progress bar */}
        {totalTarget > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-emerald-500" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Overall Progress
                </span>
              </div>
              <span className="text-sm font-bold text-gray-600 dark:text-gray-300">
                ${totalSaved.toFixed(0)}
                <span className="text-gray-400 font-normal"> / ${totalTarget.toLocaleString()}</span>
              </span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-700"
                style={{ width: `${Math.min((totalSaved / totalTarget) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-2 text-right">
              {((totalSaved / totalTarget) * 100).toFixed(1)}% of all goals funded
            </p>
          </div>
        )}

        {/* Empty state */}
        {goals.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-20 h-20 rounded-3xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-4xl">
              🎯
            </div>
            <div className="text-center">
              <h3 className="font-bold text-gray-800 dark:text-white text-lg"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                No goals yet
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                Create your first savings goal and start building toward it!
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white
                         px-6 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-emerald-500/25
                         transition-all active:scale-95"
            >
              <Plus size={16} /> Create First Goal
            </button>
          </div>
        )}

        {/* Active goals grid */}
        {active.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Target size={16} className="text-blue-500" />
              <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                Active · {active.length}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {active.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onAddSavings={addSavings}
                  onDelete={deleteGoal}
                  onComplete={completeGoal}
                  onShowToast={showToast}
                />
              ))}
            </div>
          </div>
        )}

        {/* Completed goals grid */}
        {completed.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Trophy size={16} className="text-yellow-500" />
              <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                Achieved · {completed.length}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 opacity-80">
              {completed.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onAddSavings={addSavings}
                  onDelete={deleteGoal}
                  onComplete={completeGoal}
                  onShowToast={showToast}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <AddGoalModal
          onAdd={(data) => {
            addGoal(data);
            showToast(`"${data.title}" goal created!`, "success", "🎯");
          }}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* Toasts */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}