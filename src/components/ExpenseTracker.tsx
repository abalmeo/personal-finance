"use client";

import { useState, useMemo } from "react";
import { sampleExpenses } from "@/lib/data";
import type { ExpenseEntry } from "@/lib/types";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Home,
  ShoppingCart,
  Sparkles,
  PiggyBank,
  ArrowUpDown,
} from "lucide-react";

const fmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const fmtShort = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const categoryColors: Record<ExpenseEntry["category"], string> = {
  fixed: "#3b82f6",
  variable_essentials: "#10b981",
  lifestyle: "#f59e0b",
  savings: "#8b5cf6",
};

const categoryLabels: Record<ExpenseEntry["category"], string> = {
  fixed: "Fixed",
  variable_essentials: "Variable Essentials",
  lifestyle: "Lifestyle",
  savings: "Savings",
};

const categoryIcons: Record<ExpenseEntry["category"], typeof Home> = {
  fixed: Home,
  variable_essentials: ShoppingCart,
  lifestyle: Sparkles,
  savings: PiggyBank,
};

const badgeClasses: Record<ExpenseEntry["category"], string> = {
  fixed: "bg-[#3b82f6]/15 text-[#3b82f6] border-[#3b82f6]/30",
  variable_essentials: "bg-[#10b981]/15 text-[#10b981] border-[#10b981]/30",
  lifestyle: "bg-[#f59e0b]/15 text-[#f59e0b] border-[#f59e0b]/30",
  savings: "bg-[#8b5cf6]/15 text-[#8b5cf6] border-[#8b5cf6]/30",
};

type SortKey = "date" | "description" | "category" | "subcategory" | "amount";
type SortDir = "asc" | "desc";

function CustomPieTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1a1d27] border border-[#2a2d37] rounded-lg p-3 shadow-lg">
      <p className="text-sm" style={{ color: payload[0].payload.color }}>
        {payload[0].name}: {fmt.format(payload[0].value)}
      </p>
    </div>
  );
}

function CustomBarTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1a1d27] border border-[#2a2d37] rounded-lg p-3 shadow-lg">
      <p className="text-sm text-gray-300 mb-1">{label}</p>
      <p className="text-sm text-[#3b82f6]">{fmt.format(payload[0].value)}</p>
    </div>
  );
}

export default function ExpenseTracker() {
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const totalSpent = sampleExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Category totals
  const categoryTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    for (const e of sampleExpenses) {
      totals[e.category] = (totals[e.category] || 0) + e.amount;
    }
    return totals;
  }, []);

  // Pie chart data
  const pieData = useMemo(() => {
    return (Object.keys(categoryLabels) as ExpenseEntry["category"][]).map((cat) => ({
      name: categoryLabels[cat],
      value: categoryTotals[cat] || 0,
      color: categoryColors[cat],
    }));
  }, [categoryTotals]);

  // Bar chart data - top 8 subcategories
  const barData = useMemo(() => {
    const subs: Record<string, number> = {};
    for (const e of sampleExpenses) {
      subs[e.subcategory] = (subs[e.subcategory] || 0) + e.amount;
    }
    return Object.entries(subs)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, value]) => ({ name, value }));
  }, []);

  // Sorted expenses
  const sortedExpenses = useMemo(() => {
    const sorted = [...sampleExpenses].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "date":
          cmp = a.date.localeCompare(b.date);
          break;
        case "description":
          cmp = a.description.localeCompare(b.description);
          break;
        case "category":
          cmp = a.category.localeCompare(b.category);
          break;
        case "subcategory":
          cmp = a.subcategory.localeCompare(b.subcategory);
          break;
        case "amount":
          cmp = a.amount - b.amount;
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const allCategories: ExpenseEntry["category"][] = [
    "fixed",
    "variable_essentials",
    "lifestyle",
    "savings",
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Expense Tracker</h1>

      {/* Top - Monthly Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total */}
        <div className="bg-[#1a1d27] border border-[#2a2d37] rounded-xl p-6 sm:col-span-2 lg:col-span-1">
          <p className="text-sm text-gray-400 uppercase tracking-wider">
            Total Spent
          </p>
          <p className="text-3xl font-bold text-white mt-1">{fmt.format(totalSpent)}</p>
          <p className="text-xs text-gray-500 mt-1">March 2026</p>
        </div>

        {/* Category cards */}
        {allCategories.map((cat) => {
          const Icon = categoryIcons[cat];
          const total = categoryTotals[cat] || 0;
          const pct = totalSpent > 0 ? (total / totalSpent) * 100 : 0;
          return (
            <div
              key={cat}
              className="bg-[#1a1d27] border border-[#2a2d37] rounded-xl p-6"
            >
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4" style={{ color: categoryColors[cat] }} />
                <p className="text-sm text-gray-400">{categoryLabels[cat]}</p>
              </div>
              <p className="text-2xl font-bold text-white mt-2">
                {fmt.format(total)}
              </p>
              <p className="text-xs mt-1" style={{ color: categoryColors[cat] }}>
                {pct.toFixed(1)}% of total
              </p>
            </div>
          );
        })}
      </div>

      {/* Middle - Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-[#1a1d27] border border-[#2a2d37] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Spending by Category
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  paddingAngle={2}
                >
                  {pieData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
                <Legend
                  formatter={(value) => (
                    <span className="text-sm text-gray-300">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-[#1a1d27] border border-[#2a2d37] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Top Subcategories
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                layout="vertical"
                margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2d37" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  axisLine={{ stroke: "#2a2d37" }}
                  tickLine={false}
                  tickFormatter={(v) => `$${v}`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  axisLine={{ stroke: "#2a2d37" }}
                  tickLine={false}
                  width={100}
                />
                <Tooltip content={<CustomBarTooltip />} />
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom - Expense Table */}
      <div className="bg-[#1a1d27] border border-[#2a2d37] rounded-xl overflow-hidden">
        <div className="p-6 pb-0">
          <h2 className="text-lg font-semibold text-white mb-4">All Expenses</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2a2d37]">
                {(
                  [
                    ["date", "Date"],
                    ["description", "Description"],
                    ["category", "Category"],
                    ["subcategory", "Subcategory"],
                    ["amount", "Amount"],
                  ] as [SortKey, string][]
                ).map(([key, label]) => (
                  <th
                    key={key}
                    onClick={() => handleSort(key)}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-200 transition-colors select-none"
                  >
                    <div className="flex items-center gap-1">
                      {label}
                      <ArrowUpDown
                        className={`h-3 w-3 ${
                          sortKey === key ? "text-[#3b82f6]" : "text-gray-600"
                        }`}
                      />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2d37]">
              {sortedExpenses.map((expense, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-[#22262f] transition-colors"
                >
                  <td className="px-6 py-4 text-gray-300 whitespace-nowrap">
                    {new Date(expense.date + "T00:00:00").toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 text-white font-medium">
                    {expense.description}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        badgeClasses[expense.category]
                      }`}
                    >
                      {categoryLabels[expense.category]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {expense.subcategory}
                  </td>
                  <td className="px-6 py-4 text-white font-medium text-right whitespace-nowrap">
                    {fmt.format(expense.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
