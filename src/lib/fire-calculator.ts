import type { FIREInputs, FIREProjection } from './types';

/**
 * Projects portfolio growth year by year from currentAge to 65.
 * Uses compound growth with inflation-adjusted expenses.
 * FIRE number = annualExpenses / safeWithdrawalRate.
 */
export function calculateFIREProjections(inputs: FIREInputs): FIREProjection[] {
  const {
    currentAge,
    currentAssets,
    monthlyContributions,
    monthlyExpenses,
    expectedReturn,
    inflationRate,
    safeWithdrawalRate,
  } = inputs;

  const maxAge = 65;
  const currentYear = new Date().getFullYear();
  const annualContributions = monthlyContributions * 12;
  const baseAnnualExpenses = monthlyExpenses * 12;

  const projections: FIREProjection[] = [];
  let portfolioValue = currentAssets;
  let hasReached = false;

  for (let age = currentAge; age <= maxAge; age++) {
    const yearsFromNow = age - currentAge;
    const year = currentYear + yearsFromNow;

    // Inflate expenses each year
    const annualExpenses = baseAnnualExpenses * Math.pow(1 + inflationRate, yearsFromNow);
    const fireNumber = annualExpenses / safeWithdrawalRate;

    if (portfolioValue >= fireNumber) {
      hasReached = true;
    }

    projections.push({
      age,
      year,
      portfolioValue: Math.round(portfolioValue * 100) / 100,
      annualContributions,
      annualExpenses: Math.round(annualExpenses * 100) / 100,
      fireNumber: Math.round(fireNumber * 100) / 100,
      reached: hasReached,
    });

    // Grow portfolio for next year
    portfolioValue = portfolioValue * (1 + expectedReturn) + annualContributions;
  }

  return projections;
}

/**
 * Calculates the monthly savings needed to reach FIRE by targetAge.
 * Uses future value of annuity formula solved for payment.
 * FIRE number is inflation-adjusted to the target retirement year.
 */
export function calculateRequiredSavings(params: {
  currentAge: number;
  currentAssets: number;
  targetAge: number;
  monthlyExpenses: number;
  expectedReturn: number;
  inflationRate?: number;
  safeWithdrawalRate?: number;
}): number {
  const {
    currentAge,
    currentAssets,
    targetAge,
    monthlyExpenses,
    expectedReturn,
    inflationRate = 0.03,
    safeWithdrawalRate = 0.04,
  } = params;

  const years = targetAge - currentAge;
  if (years <= 0) return 0;

  // Inflate expenses to the target retirement year, then apply SWR
  const futureAnnualExpenses = monthlyExpenses * 12 * Math.pow(1 + inflationRate, years);
  const fireNumber = futureAnnualExpenses / safeWithdrawalRate;

  // Future value of current assets
  const futureValueOfCurrent = currentAssets * Math.pow(1 + expectedReturn, years);

  // Amount still needed from contributions
  const gap = fireNumber - futureValueOfCurrent;
  if (gap <= 0) return 0;

  // Future value of annuity factor: ((1+r)^n - 1) / r
  const fvFactor = (Math.pow(1 + expectedReturn, years) - 1) / expectedReturn;
  const annualSavingsNeeded = gap / fvFactor;

  return Math.round((annualSavingsNeeded / 12) * 100) / 100;
}

/**
 * Calculates the Coast FIRE number: the amount needed today that will
 * compound to the FIRE number by targetAge with zero additional contributions.
 * FIRE number is inflation-adjusted to the target retirement year.
 */
export function calculateCoastFIRE(params: {
  currentAge: number;
  currentAssets: number;
  targetAge: number;
  monthlyExpenses: number;
  expectedReturn: number;
  inflationRate?: number;
  safeWithdrawalRate?: number;
}): { coastFIRENumber: number; reached: boolean } {
  const {
    currentAge,
    currentAssets,
    targetAge,
    monthlyExpenses,
    expectedReturn,
    inflationRate = 0.03,
    safeWithdrawalRate = 0.04,
  } = params;

  const years = targetAge - currentAge;
  // Inflate expenses to the target year
  const futureAnnualExpenses = monthlyExpenses * 12 * Math.pow(1 + inflationRate, years);
  const fireNumber = futureAnnualExpenses / safeWithdrawalRate;

  // Coast FIRE number = FIRE number discounted back to today
  const coastFIRENumber = fireNumber / Math.pow(1 + expectedReturn, years);

  return {
    coastFIRENumber: Math.round(coastFIRENumber * 100) / 100,
    reached: currentAssets >= coastFIRENumber,
  };
}

/**
 * Calculates the Barista FIRE number: the portfolio needed if you have
 * part-time income covering some expenses in retirement.
 */
export function calculateBaristaFIRE(params: {
  monthlyExpenses: number;
  partTimeMonthlyIncome: number;
  safeWithdrawalRate?: number;
  inflationRate?: number;
  yearsUntilRetirement: number;
}): number {
  const {
    monthlyExpenses,
    partTimeMonthlyIncome,
    safeWithdrawalRate = 0.04,
    inflationRate = 0.03,
    yearsUntilRetirement,
  } = params;

  const futureAnnualExpenses = monthlyExpenses * 12 * Math.pow(1 + inflationRate, yearsUntilRetirement);
  const futurePartTimeIncome = partTimeMonthlyIncome * 12 * Math.pow(1 + inflationRate, yearsUntilRetirement);
  const annualGap = Math.max(0, futureAnnualExpenses - futurePartTimeIncome);

  return Math.round((annualGap / safeWithdrawalRate) * 100) / 100;
}

/**
 * Returns the FIRE variant label based on annual expenses.
 */
export function getFIREVariant(annualExpenses: number): { label: string; description: string; color: string } {
  if (annualExpenses < 50000) {
    return { label: 'Lean FIRE', description: 'Minimalist, covers basics', color: '#10b981' };
  }
  if (annualExpenses <= 100000) {
    return { label: 'Standard FIRE', description: 'Comfortable lifestyle', color: '#3b82f6' };
  }
  return { label: 'Fat FIRE', description: 'Premium lifestyle with travel & dining', color: '#f59e0b' };
}

/**
 * Age-based spending decline rates from research:
 * - Blanchett 2014: 26% real decline by age 84
 * - BLS Consumer Expenditure Survey: 35% decline from 55-64 to 75+
 * - JP Morgan 2025 (5M+ retirees): >30% decline between 60-85
 *
 * Returns real (today's dollars) decline factor for a given age.
 */
function getSpendingDeclineFactor(age: number): number {
  if (age < 65) return 1.0;
  if (age <= 74) {
    // Go-Go years: -1.0% real decline per year
    return Math.pow(0.99, age - 64);
  }
  if (age <= 84) {
    // Slow-Go years: -2.0% real decline per year (on top of Go-Go decline)
    const goGoDecline = Math.pow(0.99, 10); // 10 years of Go-Go
    return goGoDecline * Math.pow(0.98, age - 74);
  }
  // No-Go years: -1.0% real decline per year (on top of previous)
  const goGoDecline = Math.pow(0.99, 10);
  const slowGoDecline = Math.pow(0.98, 10);
  return goGoDecline * slowGoDecline * Math.pow(0.99, age - 84);
}

export type SpendingPhase = 'Working' | 'Go-Go' | 'Slow-Go' | 'No-Go';

export interface SpendingByAge {
  age: number;
  traditional: number;  // flat model (inflation only)
  adjusted: number;     // with research-based decline
  real: number;         // today's dollars (adjusted, no inflation)
  phase: SpendingPhase;
  declineFactor: number;
}

/**
 * Projects spending by age using both the traditional flat model
 * and the research-based declining model.
 */
export function getSpendingByAge(params: {
  baseAnnualExpenses: number;
  currentAge: number;
  inflationRate?: number;
}): SpendingByAge[] {
  const { baseAnnualExpenses, currentAge, inflationRate = 0.03 } = params;
  const maxAge = 90;
  const results: SpendingByAge[] = [];

  for (let age = currentAge; age <= maxAge; age++) {
    const yearsFromNow = age - currentAge;
    const inflationFactor = Math.pow(1 + inflationRate, yearsFromNow);
    const traditional = baseAnnualExpenses * inflationFactor;
    const declineFactor = getSpendingDeclineFactor(age);
    const adjusted = traditional * declineFactor;
    const real = baseAnnualExpenses * declineFactor;

    let phase: SpendingPhase = 'Working';
    if (age >= 85) phase = 'No-Go';
    else if (age >= 75) phase = 'Slow-Go';
    else if (age >= 65) phase = 'Go-Go';

    results.push({
      age,
      traditional: Math.round(traditional),
      adjusted: Math.round(adjusted),
      real: Math.round(real),
      phase,
      declineFactor: Math.round(declineFactor * 1000) / 1000,
    });
  }

  return results;
}

/**
 * Calculates adjusted FIRE projections accounting for spending decline.
 * Uses the present value of a declining spending stream instead of flat spending.
 */
export function calculateAdjustedFIRENumber(params: {
  monthlyExpenses: number;
  retirementAge: number;
  inflationRate?: number;
  expectedReturn?: number;
  safeWithdrawalRate?: number;
}): {
  traditionalFIRE: number;
  adjustedFIRE: number;
  savingsReduction: number;
  extraYearsOfFreedom: number;
} {
  const {
    monthlyExpenses,
    retirementAge,
    inflationRate = 0.03,
    expectedReturn = 0.07,
    safeWithdrawalRate = 0.04,
  } = params;

  const baseAnnual = monthlyExpenses * 12;

  // Traditional: flat spending adjusted for inflation at retirement age
  const traditionalFIRE = baseAnnual / safeWithdrawalRate;

  // Adjusted: present value of declining spending stream over 30 years of retirement
  // Discount rate = expectedReturn, spending declines per research model
  let pvSpending = 0;
  for (let year = 0; year < 35; year++) {
    const age = retirementAge + year;
    const declineFactor = getSpendingDeclineFactor(age);
    // Real spending in year = base * decline factor
    // Discount to retirement date at real return rate (nominal - inflation)
    const realReturn = (1 + expectedReturn) / (1 + inflationRate) - 1;
    pvSpending += (baseAnnual * declineFactor) / Math.pow(1 + realReturn, year);
  }

  // Traditional PV for comparison (flat spending, same 35 year horizon)
  const realReturn = (1 + expectedReturn) / (1 + inflationRate) - 1;
  let pvTraditional = 0;
  for (let year = 0; year < 35; year++) {
    pvTraditional += baseAnnual / Math.pow(1 + realReturn, year);
  }

  const adjustedFIRE = traditionalFIRE * (pvSpending / pvTraditional);
  const savingsReduction = ((traditionalFIRE - adjustedFIRE) / traditionalFIRE) * 100;

  // Extra years of freedom: how many fewer years of saving at $3K/mo
  // Rough estimate based on savings reduction
  const yearlySavings = 36000; // approximate
  const extraYearsOfFreedom = Math.round((traditionalFIRE - adjustedFIRE) / yearlySavings);

  return {
    traditionalFIRE: Math.round(traditionalFIRE),
    adjustedFIRE: Math.round(adjustedFIRE),
    savingsReduction: Math.round(savingsReduction * 10) / 10,
    extraYearsOfFreedom: Math.max(0, extraYearsOfFreedom),
  };
}
