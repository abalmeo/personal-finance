'use client';

import { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import { Sparkles, TrendingDown, Heart, Plane, DollarSign, ShieldCheck, ArrowDown } from 'lucide-react';
import { getSpendingByAge, calculateAdjustedFIRENumber } from '@/lib/fire-calculator';
import type { SpendingPhase } from '@/lib/fire-calculator';

const fmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

const cardClass = 'bg-[#1a1d27] border border-[#2a2d37] rounded-xl p-6';
const sliderClass = 'w-full h-2 rounded-lg appearance-none cursor-pointer accent-[#3b82f6] bg-[#2a2d37]';
const inputClass = 'w-full rounded-lg border border-[#2a2d37] bg-[#0f1117] px-4 py-2.5 text-sm text-gray-200 focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6] transition-colors';

const phaseColors: Record<SpendingPhase, string> = {
  'Working': '#3b82f6',
  'Go-Go': '#10b981',
  'Slow-Go': '#f59e0b',
  'No-Go': '#8b5cf6',
};

const blsData = [
  { category: 'Transportation', age5564: 14443, age6574: 10899, age75: 6448, change: -55, icon: '🚗' },
  { category: 'Food', age5564: 6800, age6574: 6303, age75: 4349, change: -36, icon: '🍽️' },
  { category: 'Housing', age5564: 18006, age6574: 15838, age75: 13375, change: -26, icon: '🏠' },
  { category: 'Entertainment', age5564: 2488, age6574: 2488, age75: 1422, change: -43, icon: '🎭' },
  { category: 'Healthcare', age5564: 3943, age6574: 5188, age75: 4910, change: +25, icon: '🏥' },
  { category: 'Total Spending', age5564: 56267, age6574: 48656, age75: 36673, change: -35, icon: '📊' },
];

const blsBarData = blsData.filter(d => d.category !== 'Total Spending').map(d => ({
  name: d.category,
  '55-64': d.age5564,
  '65-74': d.age6574,
  '75+': d.age75,
}));

export default function SpendingReality() {
  const [currentAge, setCurrentAge] = useState(32);
  const [monthlyExpenses, setMonthlyExpenses] = useState(8000);
  const [retirementAge, setRetirementAge] = useState(50);

  const annualExpenses = monthlyExpenses * 12;

  const spendingData = useMemo(
    () => getSpendingByAge({ baseAnnualExpenses: annualExpenses, currentAge }),
    [annualExpenses, currentAge]
  );

  const adjustedFIRE = useMemo(
    () => calculateAdjustedFIRENumber({ monthlyExpenses, retirementAge }),
    [monthlyExpenses, retirementAge]
  );

  const age84Data = spendingData.find(d => d.age === 84);
  const realDeclineAt84 = age84Data ? Math.round((1 - age84Data.declineFactor) * 100) : 26;

  const chartData = useMemo(
    () => spendingData.map(d => ({
      age: d.age,
      traditional: d.traditional,
      adjusted: d.adjusted,
      phase: d.phase,
    })),
    [spendingData]
  );

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#10b981]/10">
          <Sparkles className="h-5 w-5 text-[#10b981]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Spending Reality Check</h1>
          <p className="text-sm text-gray-400">What research says about how you&apos;ll actually spend in retirement</p>
        </div>
      </div>

      {/* Key Insight Banner */}
      <div className="bg-gradient-to-r from-[#10b981]/10 to-[#3b82f6]/10 border border-[#10b981]/20 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-2">
          You&apos;ll likely need ~{adjustedFIRE.savingsReduction}% less than you think
        </h2>
        <p className="text-gray-300 text-sm leading-relaxed">
          Research from Blanchett (2014), the BLS Consumer Expenditure Survey, and JP Morgan&apos;s study of 5M+ retirees
          consistently shows that <span className="text-[#10b981] font-semibold">spending naturally declines 1-2% per year after age 65</span>.
          By age 84, most people spend ~{realDeclineAt84}% less in real terms than they did at retirement.
          Your FIRE number may be significantly lower than traditional calculators suggest.
        </p>
      </div>

      {/* Inputs */}
      <div className={`${cardClass} grid grid-cols-1 sm:grid-cols-3 gap-6`}>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-400">Current Age</label>
            <span className="text-sm font-semibold text-white">{currentAge}</span>
          </div>
          <input type="range" min={25} max={55} value={currentAge} onChange={e => setCurrentAge(Number(e.target.value))} className={sliderClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Monthly Expenses</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
            <input type="number" value={monthlyExpenses} onChange={e => setMonthlyExpenses(Number(e.target.value))} className={`${inputClass} pl-7`} />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-400">Target Retirement Age</label>
            <span className="text-sm font-semibold text-white">{retirementAge}</span>
          </div>
          <input type="range" min={35} max={65} value={retirementAge} onChange={e => setRetirementAge(Number(e.target.value))} className={sliderClass} />
        </div>
      </div>

      {/* Adjusted FIRE Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={cardClass}>
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="h-4 w-4 text-[#ef4444]" />
            <p className="text-sm text-gray-400">Traditional FIRE Number</p>
          </div>
          <p className="text-2xl font-bold text-gray-400 line-through">{fmt.format(adjustedFIRE.traditionalFIRE)}</p>
          <p className="text-xs text-gray-500 mt-1">Assumes flat spending forever</p>
        </div>
        <div className="bg-gradient-to-br from-[#10b981]/10 to-[#1a1d27] border border-[#10b981]/30 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="h-4 w-4 text-[#10b981]" />
            <p className="text-sm text-gray-400">Research-Based FIRE Number</p>
          </div>
          <p className="text-2xl font-bold text-[#10b981]">{fmt.format(adjustedFIRE.adjustedFIRE)}</p>
          <p className="text-xs text-gray-500 mt-1">Accounts for natural spending decline</p>
          <p className="text-sm text-[#10b981] mt-2 font-medium">
            <ArrowDown className="h-3 w-3 inline" /> {fmt.format(adjustedFIRE.traditionalFIRE - adjustedFIRE.adjustedFIRE)} less needed
          </p>
        </div>
        <div className={cardClass}>
          <div className="flex items-center gap-2 mb-3">
            <Heart className="h-4 w-4 text-[#8b5cf6]" />
            <p className="text-sm text-gray-400">The Real Risk</p>
          </div>
          <p className="text-lg font-bold text-[#8b5cf6]">Under-living</p>
          <p className="text-xs text-gray-400 mt-2 leading-relaxed">
            88% of retirees die with most savings unspent. Average withdrawal rate is only 2.1%, not 4%.
            The bigger risk may be not enjoying life enough.
          </p>
          <p className="text-xs text-gray-500 mt-1 italic">— Bill Perkins, Die With Zero</p>
        </div>
      </div>

      {/* Spending Smile Chart */}
      <div className={cardClass}>
        <h2 className="text-lg font-semibold text-white mb-1">The Retirement Spending Smile</h2>
        <p className="text-sm text-gray-400 mb-4">
          Traditional models (red) assume flat spending. Research (green) shows natural decline.
          The green area is money you don&apos;t actually need to save.
        </p>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2d37" vertical={false} />
              <XAxis dataKey="age" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}K`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1d27', border: '1px solid #2a2d37', borderRadius: '8px', fontSize: '13px' }}
                labelStyle={{ color: '#e5e7eb', fontWeight: 600 }}
                labelFormatter={(label) => `Age ${label}`}
                formatter={(value, name) => [
                  fmt.format(Number(value)),
                  name === 'traditional' ? 'Traditional (flat)' : 'Research-based',
                ]}
              />
              <Area type="monotone" dataKey="traditional" stroke="#ef4444" strokeWidth={2} strokeDasharray="6 4" fill="none" name="traditional" />
              <Area type="monotone" dataKey="adjusted" stroke="#10b981" strokeWidth={2.5} fill="url(#savingsGradient)" name="adjusted" />
              <ReferenceLine x={65} stroke="#6b7280" strokeDasharray="4 4" label={{ value: 'Go-Go (65)', position: 'top', fill: '#10b981', fontSize: 11 }} />
              <ReferenceLine x={75} stroke="#6b7280" strokeDasharray="4 4" label={{ value: 'Slow-Go (75)', position: 'top', fill: '#f59e0b', fontSize: 11 }} />
              <ReferenceLine x={85} stroke="#6b7280" strokeDasharray="4 4" label={{ value: 'No-Go (85)', position: 'top', fill: '#8b5cf6', fontSize: 11 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center gap-6 mt-4 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <div className="h-0.5 w-4 border-t-2 border-dashed border-[#ef4444]" />
            Traditional (flat spending + inflation)
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-[#10b981]" />
            Research-based (with natural decline)
          </div>
        </div>
      </div>

      {/* Retirement Phases */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={`${cardClass} border-[#10b981]/20`}>
          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-[#10b981]/15 text-[#10b981]">Ages 65-74</span>
          <h3 className="text-lg font-bold text-white mt-3">Go-Go Years</h3>
          <p className="text-sm text-gray-400 mt-2">
            The active phase. Travel peaks, dining out stays high, but commuting and work expenses disappear.
            Spending declines ~1%/year in real terms.
          </p>
          <p className="text-xs text-gray-500 mt-3">Peak travel: 3.6 trips/year at 60-65</p>
        </div>
        <div className={`${cardClass} border-[#f59e0b]/20`}>
          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-[#f59e0b]/15 text-[#f59e0b]">Ages 75-84</span>
          <h3 className="text-lg font-bold text-white mt-3">Slow-Go Years</h3>
          <p className="text-sm text-gray-400 mt-2">
            Activity slows. Less travel, less eating out, less transportation.
            Spending declines ~2%/year in real terms — the steepest decline phase.
          </p>
          <p className="text-xs text-gray-500 mt-3">Travel drops to 2.5-2.8 trips/year</p>
        </div>
        <div className={`${cardClass} border-[#8b5cf6]/20`}>
          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-[#8b5cf6]/15 text-[#8b5cf6]">Ages 85+</span>
          <h3 className="text-lg font-bold text-white mt-3">No-Go Years</h3>
          <p className="text-sm text-gray-400 mt-2">
            Healthcare rises but everything else drops more. Overall spending is ~26% below initial retirement levels.
            The slight uptick at the end is the &quot;smile&quot;.
          </p>
          <p className="text-xs text-gray-500 mt-3">Healthcare becomes 16% of budget (up from 9%)</p>
        </div>
      </div>

      {/* BLS Category Breakdown */}
      <div className={cardClass}>
        <h2 className="text-lg font-semibold text-white mb-1">How Spending Changes by Category</h2>
        <p className="text-sm text-gray-400 mb-4">Bureau of Labor Statistics Consumer Expenditure Survey data</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2a2d37]">
                  <th className="text-left py-3 px-3 text-gray-400 font-medium">Category</th>
                  <th className="text-right py-3 px-3 text-gray-400 font-medium">55-64</th>
                  <th className="text-right py-3 px-3 text-gray-400 font-medium">65-74</th>
                  <th className="text-right py-3 px-3 text-gray-400 font-medium">75+</th>
                  <th className="text-right py-3 px-3 text-gray-400 font-medium">Change</th>
                </tr>
              </thead>
              <tbody>
                {blsData.map(row => (
                  <tr key={row.category} className={`border-b border-[#2a2d37]/50 hover:bg-[#22262f] ${row.category === 'Total Spending' ? 'font-semibold' : ''}`}>
                    <td className="py-3 px-3 text-white">
                      <span className="mr-2">{row.icon}</span>
                      {row.category}
                    </td>
                    <td className="py-3 px-3 text-right text-gray-300">{fmt.format(row.age5564)}</td>
                    <td className="py-3 px-3 text-right text-gray-300">{fmt.format(row.age6574)}</td>
                    <td className="py-3 px-3 text-right text-gray-300">{fmt.format(row.age75)}</td>
                    <td className={`py-3 px-3 text-right font-semibold ${row.change < 0 ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
                      {row.change > 0 ? '+' : ''}{row.change}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bar Chart */}
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={blsBarData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2d37" />
                <XAxis type="number" tick={{ fill: '#9ca3af', fontSize: 11 }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}K`} />
                <YAxis type="category" dataKey="name" tick={{ fill: '#9ca3af', fontSize: 11 }} width={110} />
                <Tooltip
                  contentStyle={{ background: '#1a1d27', border: '1px solid #2a2d37', borderRadius: 8 }}
                  labelStyle={{ color: '#fff' }}
                  formatter={(value) => [fmt.format(Number(value))]}
                />
                <Bar dataKey="55-64" fill="#3b82f6" name="Ages 55-64" radius={[0, 4, 4, 0]} />
                <Bar dataKey="65-74" fill="#10b981" name="Ages 65-74" radius={[0, 4, 4, 0]} />
                <Bar dataKey="75+" fill="#8b5cf6" name="Ages 75+" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Happiness Research */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`${cardClass} border-[#f59e0b]/20`}>
          <div className="flex items-center gap-2 mb-4">
            <Plane className="h-5 w-5 text-[#f59e0b]" />
            <h2 className="text-lg font-semibold text-white">Your Experience Window</h2>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-[#f59e0b]">Peak travel: Ages 55-70</p>
              <p className="text-xs text-gray-400 mt-1">
                This is when you&apos;ll travel most — 3.6 trips/year. After 70, it drops steadily.
                Don&apos;t defer all your travel dreams to retirement — <span className="text-white font-medium">invest in experiences during your window</span>.
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-[#10b981]">Experiences &gt; Things</p>
              <p className="text-xs text-gray-400 mt-1">
                Research consistently shows experiences create more lasting happiness than possessions.
                They build memories, foster relationships, and are more enjoyable to share.
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-[#3b82f6]">The $100K threshold</p>
              <p className="text-xs text-gray-400 mt-1">
                Happiness research (Kahneman/Killingsworth 2023) shows emotional well-being plateaus around $100K for most people.
                At your income level ($250K+), <span className="text-white font-medium">you&apos;re well past the point where more money = more happiness</span>.
                Focus on how you spend, not how much more you save.
              </p>
            </div>
          </div>
        </div>

        <div className={`${cardClass} border-[#8b5cf6]/20`}>
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="h-5 w-5 text-[#8b5cf6]" />
            <h2 className="text-lg font-semibold text-white">What the Numbers Mean for You</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#10b981]/10 text-sm font-bold text-[#10b981]">1</div>
              <div>
                <p className="text-sm font-medium text-white">Your expenses will naturally decline</p>
                <p className="text-xs text-gray-400 mt-1">
                  Current: {fmt.format(annualExpenses)}/yr. By age 84: ~{fmt.format(Math.round(annualExpenses * 0.74))}/yr in today&apos;s dollars.
                  That&apos;s {fmt.format(Math.round(annualExpenses * 0.26))}/yr you won&apos;t need.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#3b82f6]/10 text-sm font-bold text-[#3b82f6]">2</div>
              <div>
                <p className="text-sm font-medium text-white">You can save {fmt.format(adjustedFIRE.traditionalFIRE - adjustedFIRE.adjustedFIRE)} less</p>
                <p className="text-xs text-gray-400 mt-1">
                  Research-based FIRE number: {fmt.format(adjustedFIRE.adjustedFIRE)} vs traditional {fmt.format(adjustedFIRE.traditionalFIRE)}.
                  That&apos;s a {adjustedFIRE.savingsReduction}% reduction.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f59e0b]/10 text-sm font-bold text-[#f59e0b]">3</div>
              <div>
                <p className="text-sm font-medium text-white">Don&apos;t feel guilty about enjoying now</p>
                <p className="text-xs text-gray-400 mt-1">
                  You&apos;re balancing saving and living well — and the data says that&apos;s exactly right.
                  Your &quot;Go-Go years&quot; of peak experiences are limited. Use them.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sources */}
      <div className={`${cardClass} text-xs text-gray-500`}>
        <p className="font-medium text-gray-400 mb-2">Research Sources</p>
        <ul className="space-y-1 list-disc list-inside">
          <li>Blanchett, D. (2014). &quot;Exploring the Retirement Consumption Puzzle.&quot; Journal of Financial Planning.</li>
          <li>Bureau of Labor Statistics. Consumer Expenditure Survey, 2023-2024.</li>
          <li>JP Morgan Asset Management (2025). &quot;Retirement by the Numbers.&quot; Study of 5M+ retirees.</li>
          <li>Kitces, M. &quot;Safe Withdrawal Rates with Decreasing Retirement Spending.&quot;</li>
          <li>Kahneman, D., Killingsworth, M., Mellers, B. (2023). Income and emotional well-being.</li>
          <li>Perkins, B. (2020). Die With Zero. Mariner Books.</li>
        </ul>
      </div>
    </div>
  );
}
