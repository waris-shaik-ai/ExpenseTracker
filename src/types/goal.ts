// ─── Goal Types ───────────────────────────────────────────────────────────────

export type GoalStatus = "active" | "completed" | "failed";

export type GoalIcon =
  | "🎯" | "🏠" | "✈️" | "💻" | "🚗" | "📱" | "🎓" | "💍"
  | "🏋️" | "🎮" | "👗" | "📷" | "🛋️" | "🌴" | "💰" | "🎸";

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  savedAmount: number;
  deadline: string;       // ISO date "YYYY-MM-DD"
  icon: GoalIcon;
  color: string;          // tailwind color key
  status: GoalStatus;
  createdAt: string;      // ISO date
  completedAt?: string;
}