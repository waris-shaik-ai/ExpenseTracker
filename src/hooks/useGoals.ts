"use client";

// ─── useGoals hook ────────────────────────────────────────────────────────────
// Full CRUD for savings goals stored in localStorage.

import { useState, useEffect } from "react";
import { Goal, GoalIcon } from "@/types/goal";

const KEY = "expense-tracker-goals";

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      setGoals(raw ? (JSON.parse(raw) as Goal[]) : []);
    } catch {
      setGoals([]);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) localStorage.setItem(KEY, JSON.stringify(goals));
  }, [goals, isLoaded]);

  // ── Add ───────────────────────────────────────────────────────────────────
  function addGoal(data: {
    title: string;
    targetAmount: number;
    deadline: string;
    icon: GoalIcon;
    color: string;
  }) {
    const goal: Goal = {
      id: crypto.randomUUID(),
      ...data,
      savedAmount: 0,
      status: "active",
      createdAt: new Date().toISOString().split("T")[0],
    };
    setGoals((prev) => [goal, ...prev]);
    return goal;
  }

  // ── Add savings to a goal ─────────────────────────────────────────────────
  function addSavings(id: string, amount: number) {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== id) return g;
        const newSaved = Math.min(g.savedAmount + amount, g.targetAmount);
        const completed = newSaved >= g.targetAmount;
        return {
          ...g,
          savedAmount: newSaved,
          status: completed ? "completed" : g.status,
          completedAt: completed ? new Date().toISOString().split("T")[0] : g.completedAt,
        };
      })
    );
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  function deleteGoal(id: string) {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  }

  // ── Mark completed manually ───────────────────────────────────────────────
  function completeGoal(id: string) {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === id
          ? { ...g, status: "completed", savedAmount: g.targetAmount, completedAt: new Date().toISOString().split("T")[0] }
          : g
      )
    );
  }

  return { goals, addGoal, addSavings, deleteGoal, completeGoal, isLoaded };
}