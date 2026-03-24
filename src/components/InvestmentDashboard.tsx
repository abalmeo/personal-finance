'use client';

import { accounts, allocationData } from '@/lib/data';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';
import { TrendingUp, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';

const fmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const pct = (value: number, total: number) => ((value / total) * 100).toFixed(1);

const investmentAccounts = accounts.filter(
  (a) => a.category === 'investment' || a.category === 'retirement'
);
const totalInvested = investmentAccounts.reduce((s, a) => s + a.balance, 0);

const targetAllocation = [
  { name: 'Retirement 401k', target: 55, color: '#3b82f6' },
  { name: 'Taxable Brokerage', target: 30, color: '#10b981' },
  { name: 'Cash & Savings', target: 8, color: '#f59e0b' },
  { name: 'Crypto', target: 3, color: '#8b5cf6' },
  { name: 'HSA', target: 4, color: '#06b6d4' },
];

const totalAllocation = allocationData.reduce((s, a) => s + a.value, 0);

const comparisonData = allocationData.map((item) => {
  const target = targetAllocation.find((t) => t.name === item.name);
  const currentPct = (item.value / totalAllocation) * 100;
  return {
    name: item.name,
    current: Math.round(currentPct * 10) / 10,
    target: target?.target ?? 0,
    color: item.color,
    diff: Math.round((currentPct - (target?.target ?? 0)) * 10) / 10,
  };
});

const recommendations = [
  {
    priority: 'high',
    title: 'Max out Alvin\'s 401(k)',
    description: 'Close the gap to $23,500/yr annual limit. Every dollar saves ~30%+ in taxes.',
    icon: AlertTriangle,
  },
  {
    priority: 'high',
    title: 'Increase Katrina\'s 401(k)',
    description: 'Increase from $500/mo to at least $1,500/mo. Tax-deferred growth is extremely valuable at your income level.',
    icon: AlertTriangle,
  },
  {
    priority: 'high',
    title: 'Open Backdoor Roth IRAs',
    description: 'Both of you can contribute $7,000/yr each ($14,000 total). Tax-free growth forever.',
    icon: TrendingUp,
  },
  {
    priority: 'medium',
    title: 'Max out HSA',
    description: 'Triple tax advantage — contribute $4,300/yr and invest the balance instead of holding cash.',
    icon: TrendingUp,
  },
  {
    priority: 'medium',
    title: 'Consolidate TOD Account',
    description: 'Shift individual stock picks toward index fund core (VTI/VXUS). Keep stock picks ≤10% of portfolio.',
    icon: ArrowRight,
  },
  {
    priority: 'low',
    title: 'Close Zero-Balance Accounts',
    description: 'Simplify by closing accounts with $0 or near-zero balances (Online Savings $0.14, etc.)',
    icon: CheckCircle,
  },
];

const priorityColor = {
  high: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
  medium: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  low: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20' },
};

interface TooltipPayloadItem {
  name: string;
  value: number;
  payload: { color: string; name: string };
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayloadItem[] }) {
  if (!active || !payload?.length) return null;
  const data = payload[0];
  return (
    <div className="bg-[#1a1d27] border border-[#2a2d37] rounded-lg p-3 shadow-xl">
      <p className="text-sm font-medium text-white">{data.payload.name}</p>
      <p className="text-sm text-gray-400">{fmt.format(data.value)}</p>
      <p className="text-xs text-gray-500">{pct(data.value, totalAllocation)}% of portfolio</p>
    </div>
  );
}

export default function InvestmentDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Investment Allocation</h1>
        <p className="text-gray-400 mt-1">Portfolio analysis and rebalancing recommendations</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#1a1d27] border border-[#2a2d37] rounded-xl p-6">
          <p className="text-sm text-gray-400">Total Invested</p>
          <p className="text-2xl font-bold text-white mt-1">{fmt.format(totalInvested)}</p>
          <p className="text-xs text-gray-500 mt-1">Retirement + Brokerage + Crypto + HSA</p>
        </div>
        <div className="bg-[#1a1d27] border border-[#2a2d37] rounded-xl p-6">
          <p className="text-sm text-gray-400">Retirement Accounts</p>
          <p className="text-2xl font-bold text-blue-400 mt-1">
            {fmt.format(accounts.filter((a) => a.category === 'retirement').reduce((s, a) => s + a.balance, 0))}
          </p>
          <p className="text-xs text-gray-500 mt-1">63% of invested assets</p>
        </div>
        <div className="bg-[#1a1d27] border border-[#2a2d37] rounded-xl p-6">
          <p className="text-sm text-gray-400">Taxable Investments</p>
          <p className="text-2xl font-bold text-green-400 mt-1">
            {fmt.format(accounts.filter((a) => a.category === 'investment').reduce((s, a) => s + a.balance, 0))}
          </p>
          <p className="text-xs text-gray-500 mt-1">Brokerage + Crypto + HSA</p>
        </div>
      </div>

      {/* Allocation Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-[#1a1d27] border border-[#2a2d37] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Current Allocation</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {allocationData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {allocationData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-gray-400">{item.name}</span>
                <span className="text-sm text-white ml-auto">{pct(item.value, totalAllocation)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Current vs Target Bar Chart */}
        <div className="bg-[#1a1d27] border border-[#2a2d37] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Current vs Target Allocation</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2d37" />
                <XAxis type="number" domain={[0, 70]} tick={{ fill: '#9ca3af', fontSize: 12 }} tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="name" tick={{ fill: '#9ca3af', fontSize: 11 }} width={120} />
                <Tooltip
                  contentStyle={{ background: '#1a1d27', border: '1px solid #2a2d37', borderRadius: 8 }}
                  labelStyle={{ color: '#fff' }}
                  formatter={(value) => [`${value}%`]}
                />
                <Legend wrapperStyle={{ color: '#9ca3af' }} />
                <Bar dataKey="current" fill="#3b82f6" name="Current" radius={[0, 4, 4, 0]} />
                <Bar dataKey="target" fill="#3b82f680" name="Target" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {comparisonData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <span className="text-gray-400">{item.name}</span>
                <span className={item.diff > 5 ? 'text-amber-400' : item.diff < -5 ? 'text-red-400' : 'text-green-400'}>
                  {item.diff > 0 ? '+' : ''}{item.diff}% {item.diff > 5 ? 'overweight' : item.diff < -5 ? 'underweight' : 'on target'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Individual Holdings */}
      <div className="bg-[#1a1d27] border border-[#2a2d37] rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">All Investment Accounts</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2a2d37]">
                <th className="text-left text-sm font-medium text-gray-400 pb-3">Account</th>
                <th className="text-left text-sm font-medium text-gray-400 pb-3">Type</th>
                <th className="text-right text-sm font-medium text-gray-400 pb-3">Balance</th>
                <th className="text-right text-sm font-medium text-gray-400 pb-3">% of Portfolio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2d37]">
              {investmentAccounts
                .sort((a, b) => b.balance - a.balance)
                .map((account) => (
                  <tr key={account.lastFour} className="hover:bg-[#22262f]">
                    <td className="py-3">
                      <div className="text-sm font-medium text-white">{account.name}</div>
                      <div className="text-xs text-gray-500">...{account.lastFour}</div>
                    </td>
                    <td className="py-3">
                      <span className="text-xs px-2 py-1 rounded-full bg-[#22262f] text-gray-300 capitalize">
                        {account.subcategory?.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="py-3 text-right text-sm font-medium text-white">
                      {fmt.format(account.balance)}
                    </td>
                    <td className="py-3 text-right text-sm text-gray-400">
                      {pct(account.balance, totalInvested)}%
                    </td>
                  </tr>
                ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-[#2a2d37]">
                <td colSpan={2} className="pt-3 text-sm font-semibold text-white">Total</td>
                <td className="pt-3 text-right text-sm font-bold text-white">{fmt.format(totalInvested)}</td>
                <td className="pt-3 text-right text-sm text-gray-400">100%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-[#1a1d27] border border-[#2a2d37] rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Action Items</h2>
        <div className="space-y-3">
          {recommendations.map((rec, i) => {
            const colors = priorityColor[rec.priority as keyof typeof priorityColor];
            const Icon = rec.icon;
            return (
              <div key={i} className={`flex items-start gap-4 p-4 rounded-lg border ${colors.bg} ${colors.border}`}>
                <Icon className={`w-5 h-5 mt-0.5 ${colors.text}`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-white">{rec.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${colors.bg} ${colors.text} capitalize`}>
                      {rec.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">{rec.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
