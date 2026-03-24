"use client";

import { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Flame, Target, TrendingUp, DollarSign, Coffee, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import {
  calculateFIREProjections,
  calculateRequiredSavings,
  calculateCoastFIRE,
  calculateBaristaFIRE,
  getFIREVariant,
} from "@/lib/fire-calculator";
import type { FIREInputs } from "@/lib/types";

function formatCurrency(value: number): string {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(0)}K`;
  }
  return `$${value.toFixed(0)}`;
}

function formatCurrencyFull(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

const inputClass =
  "w-full rounded-lg border border-[#2a2d37] bg-[#0f1117] px-4 py-2.5 text-sm text-gray-200 placeholder-gray-500 focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6] transition-colors";

const sliderClass =
  "w-full h-2 rounded-lg appearance-none cursor-pointer accent-[#3b82f6] bg-[#2a2d37]";

const cardClass =
  "bg-[#1a1d27] border border-[#2a2d37] rounded-xl p-6";

export default function FIRECalculator() {
  const [currentAge, setCurrentAge] = useState(32);
  const [currentAssets, setCurrentAssets] = useState(333970);
  const [monthlyContributions, setMonthlyContributions] = useState(3000);
  const [monthlyExpenses, setMonthlyExpenses] = useState(8000);
  const [expectedReturn, setExpectedReturn] = useState(7);
  const [inflationRate, setInflationRate] = useState(3);
  const [swr, setSwr] = useState(4);
  const [partTimeIncome, setPartTimeIncome] = useState(0);
  const [showBaristaFIRE, setShowBaristaFIRE] = useState(false);

  const swrDecimal = swr / 100;
  const inflationDecimal = inflationRate / 100;
  const returnDecimal = expectedReturn / 100;

  const inputs: FIREInputs = useMemo(
    () => ({
      currentAge,
      currentAssets,
      monthlyContributions,
      monthlyExpenses,
      expectedReturn: returnDecimal,
      targetAge: 65,
      inflationRate: inflationDecimal,
      safeWithdrawalRate: swrDecimal,
    }),
    [currentAge, currentAssets, monthlyContributions, monthlyExpenses, returnDecimal, inflationDecimal, swrDecimal]
  );

  const projections = useMemo(() => calculateFIREProjections(inputs), [inputs]);

  const fireAge = useMemo(() => {
    const found = projections.find((p) => p.reached);
    return found ? found.age : null;
  }, [projections]);

  const savingsRate = useMemo(() => {
    const totalIncome = monthlyContributions + monthlyExpenses;
    if (totalIncome === 0) return 0;
    return Math.round((monthlyContributions / totalIncome) * 100);
  }, [monthlyContributions, monthlyExpenses]);

  const fireVariant = useMemo(
    () => getFIREVariant(monthlyExpenses * 12),
    [monthlyExpenses]
  );

  const scenarios = useMemo(() => {
    const targetAges = [40, 45, 50] as const;
    return targetAges.map((targetAge) => {
      const years = targetAge - currentAge;
      const futureAnnualExpenses = monthlyExpenses * 12 * Math.pow(1 + inflationDecimal, years);
      const fireNumber = futureAnnualExpenses / swrDecimal;
      const requiredMonthly = calculateRequiredSavings({
        currentAge,
        currentAssets,
        targetAge,
        monthlyExpenses,
        expectedReturn: returnDecimal,
        inflationRate: inflationDecimal,
        safeWithdrawalRate: swrDecimal,
      });
      const achievable = requiredMonthly <= monthlyContributions;
      const close =
        !achievable && requiredMonthly <= monthlyContributions * 1.5;
      return {
        targetAge,
        fireNumber,
        requiredMonthly,
        achievable,
        close,
        status: achievable ? "achievable" : close ? "close" : "far",
      };
    });
  }, [currentAge, currentAssets, monthlyExpenses, monthlyContributions, returnDecimal, inflationDecimal, swrDecimal]);

  const coastFIRE = useMemo(
    () =>
      calculateCoastFIRE({
        currentAge,
        currentAssets,
        targetAge: 65,
        monthlyExpenses,
        expectedReturn: returnDecimal,
        inflationRate: inflationDecimal,
        safeWithdrawalRate: swrDecimal,
      }),
    [currentAge, currentAssets, monthlyExpenses, returnDecimal, inflationDecimal, swrDecimal]
  );

  const baristaFIRENumber = useMemo(() => {
    if (partTimeIncome <= 0) return null;
    return calculateBaristaFIRE({
      monthlyExpenses,
      partTimeMonthlyIncome: partTimeIncome,
      safeWithdrawalRate: swrDecimal,
      inflationRate: inflationDecimal,
      yearsUntilRetirement: (fireAge ?? 50) - currentAge,
    });
  }, [monthlyExpenses, partTimeIncome, swrDecimal, inflationDecimal, fireAge, currentAge]);

  const fullFIRENumber = useMemo(() => {
    const years = (fireAge ?? 50) - currentAge;
    const futureExpenses = monthlyExpenses * 12 * Math.pow(1 + inflationDecimal, years);
    return futureExpenses / swrDecimal;
  }, [monthlyExpenses, inflationDecimal, swrDecimal, fireAge, currentAge]);

  const sensitivityTable = useMemo(() => {
    const ages = [40, 45, 50, 55, 60];
    const returns = [0.05, 0.07, 0.09];
    return ages.map((age) => ({
      age,
      values: returns.map((r) => {
        const proj = calculateFIREProjections({
          ...inputs,
          expectedReturn: r,
          targetAge: 65,
        });
        const found = proj.find((p) => p.age === age);
        return found ? found.portfolioValue : 0;
      }),
    }));
  }, [inputs]);

  const chartData = useMemo(
    () =>
      projections.map((p) => ({
        age: p.age,
        portfolio: Math.round(p.portfolioValue),
        fireNumber: Math.round(p.fireNumber),
      })),
    [projections]
  );

  const statusColor = (status: string) => {
    if (status === "achievable") return "text-[#10b981]";
    if (status === "close") return "text-[#f59e0b]";
    return "text-[#ef4444]";
  };

  const statusBorder = (status: string) => {
    if (status === "achievable") return "border-[#10b981]/30";
    if (status === "close") return "border-[#f59e0b]/30";
    return "border-[#ef4444]/30";
  };

  const statusBg = (status: string) => {
    if (status === "achievable") return "bg-[#10b981]/5";
    if (status === "close") return "bg-[#f59e0b]/5";
    return "bg-[#ef4444]/5";
  };

  const statusLabel = (status: string) => {
    if (status === "achievable") return "On Track";
    if (status === "close") return "Close";
    return "Needs Work";
  };

  const fireAgeColor = fireAge
    ? fireAge <= 45 ? "text-[#10b981]" : fireAge <= 55 ? "text-[#f59e0b]" : "text-[#ef4444]"
    : "text-gray-500";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f59e0b]/10">
          <Flame className="h-5 w-5 text-[#f59e0b]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">FIRE Calculator</h1>
          <p className="text-sm text-gray-400">
            Financial Independence, Retire Early
          </p>
        </div>
      </div>

      {/* Savings Rate + FIRE Variant Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={cardClass}>
          <p className="text-sm text-gray-400">Savings Rate</p>
          <p className={`text-3xl font-bold mt-1 ${savingsRate >= 50 ? 'text-[#10b981]' : savingsRate >= 30 ? 'text-[#f59e0b]' : 'text-[#ef4444]'}`}>
            {savingsRate}%
          </p>
          <p className="text-xs text-gray-500 mt-1">of gross income (contributions / total)</p>
        </div>
        <div className={cardClass}>
          <p className="text-sm text-gray-400">FIRE Variant</p>
          <p className="text-xl font-bold mt-1" style={{ color: fireVariant.color }}>
            {fireVariant.label}
          </p>
          <p className="text-xs text-gray-500 mt-1">{fireVariant.description}</p>
          <p className="text-xs text-gray-500">{formatCurrencyFull(monthlyExpenses * 12)}/yr expenses</p>
        </div>
        <div className={cardClass}>
          <p className="text-sm text-gray-400">Projected FIRE Age</p>
          <p className={`text-3xl font-bold mt-1 ${fireAgeColor}`}>
            {fireAge ?? "65+"}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {fireAge ? `${fireAge - currentAge} years from now` : "Not reachable by 65 at current pace"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <div className={`${cardClass} lg:col-span-1 space-y-5`}>
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-[#3b82f6]" />
            Your Numbers
          </h2>

          {/* Current Age */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-400">
                Current Age
              </label>
              <span className="text-sm font-semibold text-white">
                {currentAge}
              </span>
            </div>
            <input
              type="range"
              min={18}
              max={60}
              value={currentAge}
              onChange={(e) => setCurrentAge(Number(e.target.value))}
              className={sliderClass}
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-500">18</span>
              <span className="text-xs text-gray-500">60</span>
            </div>
          </div>

          {/* Current Invested Assets */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Current Invested Assets
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                $
              </span>
              <input
                type="number"
                value={currentAssets}
                onChange={(e) => setCurrentAssets(Number(e.target.value))}
                className={`${inputClass} pl-7`}
              />
            </div>
          </div>

          {/* Monthly Contributions */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Monthly Contributions
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                $
              </span>
              <input
                type="number"
                value={monthlyContributions}
                onChange={(e) =>
                  setMonthlyContributions(Number(e.target.value))
                }
                className={`${inputClass} pl-7`}
              />
            </div>
          </div>

          {/* Monthly Expenses */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Monthly Expenses
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                $
              </span>
              <input
                type="number"
                value={monthlyExpenses}
                onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                placeholder="8,000"
                className={`${inputClass} pl-7`}
              />
            </div>
          </div>

          {/* Expected Annual Return */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-400">
                Expected Annual Return
              </label>
              <span className="text-sm font-semibold text-white">
                {expectedReturn}%
              </span>
            </div>
            <input
              type="range"
              min={3}
              max={12}
              step={0.5}
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(Number(e.target.value))}
              className={sliderClass}
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-500">3%</span>
              <span className="text-xs text-gray-500">12%</span>
            </div>
          </div>

          {/* Safe Withdrawal Rate */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-400">
                Safe Withdrawal Rate
              </label>
              <span className="text-sm font-semibold text-white">
                {swr}%
              </span>
            </div>
            <input
              type="range"
              min={3}
              max={5}
              step={0.25}
              value={swr}
              onChange={(e) => setSwr(Number(e.target.value))}
              className={sliderClass}
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-500">3% (conservative)</span>
              <span className="text-xs text-gray-500">5%</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {swr <= 3.5 ? "Conservative — recommended for retiring before 50" : swr <= 4 ? "Standard — based on the Trinity Study (30yr horizon)" : "Aggressive — higher risk of portfolio depletion"}
            </p>
          </div>

          {/* Inflation Rate */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-400">
                Inflation Rate
              </label>
              <span className="text-sm font-semibold text-white">
                {inflationRate}%
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              step={0.5}
              value={inflationRate}
              onChange={(e) => setInflationRate(Number(e.target.value))}
              className={sliderClass}
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-500">1%</span>
              <span className="text-xs text-gray-500">5%</span>
            </div>
          </div>

          {/* Coast FIRE */}
          <div
            className={`rounded-lg border p-4 ${
              coastFIRE.reached
                ? "border-[#10b981]/30 bg-[#10b981]/5"
                : "border-[#f59e0b]/30 bg-[#f59e0b]/5"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Target
                className={`h-4 w-4 ${
                  coastFIRE.reached ? "text-[#10b981]" : "text-[#f59e0b]"
                }`}
              />
              <span className="text-sm font-semibold text-white">
                Coast FIRE
              </span>
            </div>
            <p className="text-2xl font-bold text-white">
              {formatCurrencyFull(coastFIRE.coastFIRENumber)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Amount needed today to reach FIRE by 65 with no more contributions
            </p>
            <p
              className={`text-sm mt-1 ${
                coastFIRE.reached ? "text-[#10b981]" : "text-[#f59e0b]"
              }`}
            >
              {coastFIRE.reached
                ? "Reached! You could stop contributing and still retire by 65."
                : `Need ${formatCurrencyFull(coastFIRE.coastFIRENumber - currentAssets)} more`}
            </p>
          </div>

          {/* Barista FIRE (collapsible) */}
          <div className="rounded-lg border border-[#2a2d37] p-4">
            <button
              onClick={() => setShowBaristaFIRE(!showBaristaFIRE)}
              className="flex items-center justify-between w-full text-left"
            >
              <div className="flex items-center gap-2">
                <Coffee className="h-4 w-4 text-[#8b5cf6]" />
                <span className="text-sm font-semibold text-white">Barista FIRE</span>
              </div>
              {showBaristaFIRE ? (
                <ChevronUp className="h-4 w-4 text-gray-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-400" />
              )}
            </button>
            <p className="text-xs text-gray-500 mt-1">
              Retire early with part-time income covering some expenses
            </p>
            {showBaristaFIRE && (
              <div className="mt-3 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Expected Part-Time Monthly Income
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                      $
                    </span>
                    <input
                      type="number"
                      value={partTimeIncome}
                      onChange={(e) => setPartTimeIncome(Number(e.target.value))}
                      placeholder="2,000"
                      className={`${inputClass} pl-7`}
                    />
                  </div>
                </div>
                {baristaFIRENumber !== null && partTimeIncome > 0 && (
                  <div className="rounded-lg border border-[#8b5cf6]/30 bg-[#8b5cf6]/5 p-3">
                    <p className="text-sm text-gray-400">Barista FIRE Number</p>
                    <p className="text-xl font-bold text-[#8b5cf6]">
                      {formatCurrencyFull(baristaFIRENumber)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatCurrencyFull(fullFIRENumber - baristaFIRENumber)} less than full FIRE
                      ({formatCurrencyFull(fullFIRENumber)})
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Scenario Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {scenarios.map((s) => (
              <div
                key={s.targetAge}
                className={`${cardClass} ${statusBorder(s.status)} ${statusBg(s.status)}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-400">
                    Retire by {s.targetAge}
                  </h3>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      s.status === "achievable"
                        ? "bg-[#10b981]/15 text-[#10b981]"
                        : s.status === "close"
                        ? "bg-[#f59e0b]/15 text-[#f59e0b]"
                        : "bg-[#ef4444]/15 text-[#ef4444]"
                    }`}
                  >
                    {statusLabel(s.status)}
                  </span>
                </div>
                <p className="text-xl font-bold text-white mb-1">
                  {formatCurrencyFull(s.fireNumber)}
                </p>
                <p className="text-xs text-gray-500 mb-3">FIRE Number (inflation-adjusted)</p>
                <div className="border-t border-[#2a2d37] pt-3">
                  <p className="text-xs text-gray-500 mb-1">
                    Monthly Savings Needed
                  </p>
                  <p className={`text-lg font-semibold ${statusColor(s.status)}`}>
                    {s.requiredMonthly === 0
                      ? "Already there!"
                      : formatCurrencyFull(s.requiredMonthly)}
                  </p>
                  {s.requiredMonthly > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      Currently saving {formatCurrencyFull(monthlyContributions)}
                      /mo
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Spending Reality Callout */}
          <a href="/spending-reality" className="block rounded-xl border border-[#10b981]/20 bg-gradient-to-r from-[#10b981]/5 to-transparent p-4 hover:from-[#10b981]/10 transition-colors">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#10b981]/10">
                <Sparkles className="h-4 w-4 text-[#10b981]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#10b981]">Your real FIRE number may be ~20% lower</p>
                <p className="text-xs text-gray-400">Research shows spending naturally declines after 65. See the data →</p>
              </div>
            </div>
          </a>

          {/* Projection Chart */}
          <div className={cardClass}>
            <h2 className="text-lg font-semibold text-white mb-4">
              Portfolio Growth vs FIRE Number
            </h2>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="portfolioGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#3b82f6"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="#3b82f6"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#2a2d37"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="age"
                    stroke="#6b7280"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#6b7280"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v: number) => formatCurrency(v)}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1a1d27",
                      border: "1px solid #2a2d37",
                      borderRadius: "8px",
                      fontSize: "13px",
                    }}
                    labelStyle={{ color: "#e5e7eb", fontWeight: 600 }}
                    itemStyle={{ color: "#9ca3af" }}
                    formatter={(value) => [
                      formatCurrencyFull(Number(value ?? 0)),
                      "",
                    ]}
                    labelFormatter={(label) => `Age ${label}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="portfolio"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="url(#portfolioGradient)"
                    name="Portfolio Value"
                  />
                  <Area
                    type="monotone"
                    dataKey="fireNumber"
                    stroke="#ef4444"
                    strokeWidth={2}
                    strokeDasharray="6 4"
                    fill="none"
                    name="FIRE Number"
                  />
                  {fireAge && (
                    <ReferenceLine
                      x={fireAge}
                      stroke="#10b981"
                      strokeDasharray="4 4"
                      strokeWidth={1.5}
                      label={{
                        value: `FIRE at ${fireAge}`,
                        position: "top",
                        fill: "#10b981",
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center gap-6 mt-4 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-sm bg-[#3b82f6]" />
                Portfolio Value
              </div>
              <div className="flex items-center gap-2">
                <div className="h-0.5 w-3 border-t-2 border-dashed border-[#ef4444]" />
                FIRE Number ({(1 / swrDecimal).toFixed(0)}x expenses)
              </div>
              {fireAge && (
                <div className="flex items-center gap-2">
                  <div className="h-3 w-0.5 border-l-2 border-dashed border-[#10b981]" />
                  FIRE Date
                </div>
              )}
            </div>
          </div>

          {/* Sensitivity Table */}
          <div className={cardClass}>
            <h2 className="text-lg font-semibold text-white mb-4">
              Sensitivity Analysis
            </h2>
            <p className="text-sm text-gray-400 mb-4">
              Portfolio value at different ages and return rates
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#2a2d37]">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">
                      Age
                    </th>
                    <th className="text-right py-3 px-4 text-gray-400 font-medium">
                      5% Return
                    </th>
                    <th className="text-right py-3 px-4 text-[#3b82f6] font-medium">
                      7% Return
                    </th>
                    <th className="text-right py-3 px-4 text-gray-400 font-medium">
                      9% Return
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sensitivityTable.map((row) => (
                    <tr
                      key={row.age}
                      className="border-b border-[#2a2d37]/50 hover:bg-[#22262f] transition-colors"
                    >
                      <td className="py-3 px-4 text-white font-medium">
                        {row.age}
                      </td>
                      {row.values.map((val, i) => (
                        <td
                          key={i}
                          className={`py-3 px-4 text-right font-mono ${
                            i === 1 ? "text-[#3b82f6] font-semibold" : "text-gray-300"
                          }`}
                        >
                          {formatCurrencyFull(val)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
