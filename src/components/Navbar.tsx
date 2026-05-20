"use client";

import { Moon, Sun, Wallet, LayoutDashboard, PlusCircle, Brain, Target, Trophy } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/",         label: "Dashboard", icon: LayoutDashboard },
  { href: "/expenses", label: "Expenses",  icon: PlusCircle      },
  { href: "/insights", label: "Insights",  icon: Brain           },
  { href: "/budget",   label: "Budget",    icon: Target          },
  { href: "/goals",    label: "Goals",     icon: Trophy          },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="bg-emerald-500 p-1.5 rounded-lg">
              <Wallet size={16} className="text-white" />
            </div>
            <span className="text-base font-bold text-gray-900 dark:text-white tracking-tight"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Expense<span className="text-emerald-500">Tracker</span>
            </span>
          </Link>

          {/* Nav links - desktop */}
          <div className="hidden sm:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link key={href} href={href}
                  className={[
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                    active
                      ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800",
                  ].join(" ")}
                >
                  <Icon size={15} />
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Theme toggle */}
          <button onClick={toggleTheme} aria-label="Toggle dark mode"
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400
                       hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex-shrink-0">
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

        {/* Mobile bottom tabs */}
        <div className="sm:hidden flex border-t border-gray-100 dark:border-gray-800">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href}
                className={[
                  "flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors",
                  active ? "text-emerald-600 dark:text-emerald-400" : "text-gray-400 dark:text-gray-500",
                ].join(" ")}
              >
                <Icon size={17} />
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}