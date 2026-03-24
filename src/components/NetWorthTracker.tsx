"use client";

import { accounts, currentNetWorth } from "@/lib/data";
import type { Account } from "@/lib/types";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Banknote,
  Landmark,
  TrendingUp,
  CreditCard,
} from "lucide-react";

const fmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const fmtFull = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// Generate 12 months of mock historical data (April 2025 - March 2026)
const historicalData = (() => {
  const months = [
    "Apr 2025", "May 2025", "Jun 2025", "Jul 2025",
    "Aug 2025", "Sep 2025", "Oct 2025", "Nov 2025",
    "Dec 2025", "Jan 2026", "Feb 2026", "Mar 2026",
  ];

  // Start values around $280K total, end at current values
  const startCash = 36000;
  const startRetirement = 170000;
  const startInvestments = 95000;
  const startDebts = -21000;

  const endCash = currentNetWorth.cash;
  const endRetirement = currentNetWorth.retirement;
  const endInvestments = currentNetWorth.investments;
  const endDebts = currentNetWorth.debts;

  return months.map((month, i) => {
    const progress = i / (months.length - 1);
    // Add some realistic variation
    const variation = () => (Math.sin(i * 1.7) * 0.02 + Math.cos(i * 2.3) * 0.015);

    const cash = Math.round(startCash + (endCash - startCash) * progress + startCash * variation());
    const retirement = Math.round(startRetirement + (endRetirement - startRetirement) * progress + startRetirement * variation());
    const investments = Math.round(startInvestments + (endInvestments - startInvestments) * progress + startInvestments * variation());
    const debts = Math.round(startDebts + (endDebts - startDebts) * progress);

    return {
      month,
      Cash: cash,
      Retirement: retirement,
      Investments: investments,
      Debts: Math.abs(debts),
      total: cash + retirement + investments + debts,
    };
  });
})();

const categoryConfig: Record<
  Account["category"],
  { label: string; icon: typeof Banknote; color: string }
> = {
  cash: { label: "Cash", icon: Banknote, color: "#f59e0b" },
  retirement: { label: "Retirement", icon: Landmark, color: "#3b82f6" },
  investment: { label: "Investments", icon: TrendingUp, color: "#10b981" },
  debt: { label: "Debts", icon: CreditCard, color: "#ef4444" },
};

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload) return null;
  return (
    <div className="bg-[#1a1d27] border border-[#2a2d37] rounded-lg p-3 shadow-lg">
      <p className="text-sm font-medium text-gray-300 mb-2">{label}</p>
      {payload.map((entry: any) => (
        <p key={entry.name} className="text-sm" style={{ color: entry.color }}>
          {entry.name}: {fmt.format(entry.value)}
        </p>
      ))}
      <p className="text-sm font-medium text-white mt-2 pt-2 border-t border-[#2a2d37]">
        Net Worth: {fmt.format(
          payload.reduce((sum: number, e: any) => {
            return sum + (e.name === "Debts" ? -e.value : e.value);
          }, 0)
        )}
      </p>
    </div>
  );
}

export default function NetWorthTracker() {
  const assets = currentNetWorth.cash + currentNetWorth.retirement + currentNetWorth.investments;
  const debts = Math.abs(currentNetWorth.debts);
  const assetsPercent = (assets / (assets + debts)) * 100;

  const categories: Account["category"][] = ["cash", "retirement", "investment", "debt"];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Net Worth Tracker</h1>

      {/* Top Section - Net Worth Summary */}
      <div className="bg-[#1a1d27] border border-[#2a2d37] rounded-xl p-6">
        <p className="text-sm text-gray-400 uppercase tracking-wider">Total Net Worth</p>
        <p className="text-4xl font-bold text-white mt-1">
          {fmtFull.format(currentNetWorth.total)}
        </p>

        <div className="mt-6 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">
              Assets: <span className="text-[#10b981] font-medium">{fmt.format(assets)}</span>
            </span>
            <span className="text-gray-400">
              Debts: <span className="text-[#ef4444] font-medium">{fmt.format(debts)}</span>
            </span>
          </div>
          <div className="h-3 w-full rounded-full overflow-hidden bg-[#ef4444]/30">
            <div
              className="h-full rounded-full bg-[#10b981]"
              style={{ width: `${assetsPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>{assetsPercent.toFixed(1)}% Assets</span>
            <span>{(100 - assetsPercent).toFixed(1)}% Debts</span>
          </div>
        </div>
      </div>

      {/* Middle - Net Worth Over Time Chart */}
      <div className="bg-[#1a1d27] border border-[#2a2d37] rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Net Worth Over Time</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={historicalData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2d37" />
              <XAxis
                dataKey="month"
                tick={{ fill: "#9ca3af", fontSize: 12 }}
                axisLine={{ stroke: "#2a2d37" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#9ca3af", fontSize: 12 }}
                axisLine={{ stroke: "#2a2d37" }}
                tickLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="Cash"
                stackId="1"
                stroke="#f59e0b"
                fill="#f59e0b"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="Retirement"
                stackId="1"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="Investments"
                stackId="1"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom - Account Details */}
      <div className="space-y-6">
        {categories.map((cat) => {
          const config = categoryConfig[cat];
          const Icon = config.icon;
          const catAccounts = accounts.filter((a) => a.category === cat);
          // Skip zero-balance debt accounts
          const filtered =
            cat === "debt"
              ? catAccounts.filter((a) => a.balance !== 0)
              : catAccounts;
          if (filtered.length === 0) return null;
          const total = filtered.reduce((sum, a) => sum + a.balance, 0);

          return (
            <div key={cat}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5" style={{ color: config.color }} />
                  <h3 className="text-lg font-semibold text-white">{config.label}</h3>
                </div>
                <span
                  className="text-lg font-bold"
                  style={{ color: config.color }}
                >
                  {fmtFull.format(Math.abs(total))}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((account) => (
                  <div
                    key={account.lastFour + account.name}
                    className="bg-[#1a1d27] border border-[#2a2d37] rounded-xl p-6 hover:bg-[#22262f] transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-300">
                          {account.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          ****{account.lastFour}
                        </p>
                      </div>
                      {account.subcategory && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-400 border border-[#2a2d37]">
                          {account.subcategory}
                        </span>
                      )}
                    </div>
                    <p
                      className="text-2xl font-bold mt-3"
                      style={{ color: config.color }}
                    >
                      {cat === "debt"
                        ? fmtFull.format(Math.abs(account.balance))
                        : fmtFull.format(account.balance)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
