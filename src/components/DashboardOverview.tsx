'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
  CreditCard,
  Landmark,
  PiggyBank,
  BarChart3,
} from 'lucide-react';
import type { Account, NetWorthSnapshot, ExpenseEntry } from '@/lib/types';

const fmt = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const cardClass = 'bg-[#1a1d27] border border-[#2a2d37] rounded-xl p-6';

const categoryLabels: Record<string, string> = {
  cash: 'Cash',
  retirement: 'Retirement',
  investment: 'Investments',
  debt: 'Debts',
};

const categoryIcons: Record<string, React.ReactNode> = {
  cash: <Wallet className="w-4 h-4" />,
  retirement: <Landmark className="w-4 h-4" />,
  investment: <BarChart3 className="w-4 h-4" />,
  debt: <CreditCard className="w-4 h-4" />,
};

const expenseCategoryColors: Record<string, { bg: string; text: string }> = {
  fixed: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
  variable_essentials: { bg: 'bg-amber-500/20', text: 'text-amber-400' },
  lifestyle: { bg: 'bg-purple-500/20', text: 'text-purple-400' },
  savings: { bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
};

const expenseCategoryLabels: Record<string, string> = {
  fixed: 'Fixed',
  variable_essentials: 'Essentials',
  lifestyle: 'Lifestyle',
  savings: 'Savings',
};

interface DashboardOverviewProps {
  accounts: Account[];
  netWorth: NetWorthSnapshot;
  expenses: ExpenseEntry[];
}

export default function DashboardOverview({
  accounts,
  netWorth,
  expenses,
}: DashboardOverviewProps) {
  const pieData = [
    { name: 'Cash', value: netWorth.cash, color: '#f59e0b' },
    { name: 'Retirement', value: netWorth.retirement, color: '#3b82f6' },
    { name: 'Investments', value: netWorth.investments, color: '#10b981' },
    { name: 'Debts', value: Math.abs(netWorth.debts), color: '#ef4444' },
  ];

  const totalAssets = netWorth.cash + netWorth.retirement + netWorth.investments;

  const groupedAccounts = (['cash', 'retirement', 'investment', 'debt'] as const).map(
    (cat) => ({
      category: cat,
      label: categoryLabels[cat],
      icon: categoryIcons[cat],
      accounts: accounts.filter(
        (a) => a.category === cat && a.balance !== 0
      ),
    })
  );

  const recentExpenses = expenses.slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-sm text-gray-400 mt-1">
          Your financial snapshot as of {new Date(netWorth.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      {/* Row 1 - Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Net Worth */}
        <div className={cardClass}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-400">Net Worth</span>
            <div className="p-2 rounded-lg bg-blue-500/10">
              <DollarSign className="w-4 h-4 text-blue-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{fmt.format(netWorth.total)}</p>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            <span className="text-xs text-emerald-400">+2.4% this month</span>
          </div>
        </div>

        {/* Total Assets */}
        <div className={cardClass}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-400">Total Assets</span>
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{fmt.format(totalAssets)}</p>
          <p className="text-xs text-gray-500 mt-2">Cash + Retirement + Investments</p>
        </div>

        {/* Total Debts */}
        <div className={cardClass}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-400">Total Debts</span>
            <div className="p-2 rounded-lg bg-red-500/10">
              <TrendingDown className="w-4 h-4 text-red-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-red-400">{fmt.format(netWorth.debts)}</p>
          <p className="text-xs text-gray-500 mt-2">Credit cards + Auto loan</p>
        </div>

        {/* Savings Rate */}
        <div className={cardClass}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-400">Savings Rate</span>
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <PiggyBank className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-400">~45%</p>
          <p className="text-xs text-gray-500 mt-2">Estimated monthly rate</p>
        </div>
      </div>

      {/* Row 2 - Pie Chart + Account Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Net Worth Breakdown */}
        <div className={cardClass}>
          <h2 className="text-lg font-semibold text-white mb-4">Net Worth Breakdown</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => fmt.format(Number(value))}
                  contentStyle={{
                    backgroundColor: '#1a1d27',
                    border: '1px solid #2a2d37',
                    borderRadius: '8px',
                    color: '#e5e7eb',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <div className="min-w-0">
                  <p className="text-xs text-gray-400">{item.name}</p>
                  <p className="text-sm font-medium text-white">
                    {item.name === 'Debts'
                      ? fmt.format(-item.value)
                      : fmt.format(item.value)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Account Summary */}
        <div className={cardClass + ' flex flex-col'}>
          <h2 className="text-lg font-semibold text-white mb-4">Account Summary</h2>
          <div className="overflow-y-auto flex-1 max-h-[460px] space-y-5 pr-1">
            {groupedAccounts.map(
              (group) =>
                group.accounts.length > 0 && (
                  <div key={group.category}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-gray-400">{group.icon}</span>
                      <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                        {group.label}
                      </h3>
                    </div>
                    <div className="space-y-1">
                      {group.accounts.map((account) => (
                        <div
                          key={`${account.name}-${account.lastFour}`}
                          className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-[#22262f] transition-colors"
                        >
                          <div>
                            <p className="text-sm text-white">{account.name}</p>
                            <p className="text-xs text-gray-500">
                              ****{account.lastFour}
                            </p>
                          </div>
                          <span
                            className={`text-sm font-medium ${
                              account.balance < 0
                                ? 'text-red-400'
                                : 'text-white'
                            }`}
                          >
                            {fmt.format(account.balance)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
            )}
          </div>
        </div>
      </div>

      {/* Row 3 - Recent Expenses */}
      <div className={cardClass}>
        <h2 className="text-lg font-semibold text-white mb-4">Recent Expenses</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2a2d37]">
                <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider pb-3">
                  Date
                </th>
                <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider pb-3">
                  Description
                </th>
                <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider pb-3">
                  Category
                </th>
                <th className="text-right text-xs font-medium text-gray-400 uppercase tracking-wider pb-3">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2d37]">
              {recentExpenses.map((expense, i) => {
                const catStyle =
                  expenseCategoryColors[expense.category] ??
                  expenseCategoryColors.fixed;
                return (
                  <tr
                    key={i}
                    className="hover:bg-[#22262f] transition-colors"
                  >
                    <td className="py-3 text-sm text-gray-400 whitespace-nowrap">
                      {new Date(expense.date + 'T00:00:00').toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="py-3 text-sm text-white">
                      {expense.description}
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${catStyle.bg} ${catStyle.text}`}
                      >
                        {expenseCategoryLabels[expense.category] ??
                          expense.category}
                      </span>
                    </td>
                    <td className="py-3 text-sm text-right font-medium text-white whitespace-nowrap">
                      {fmt.format(expense.amount)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
