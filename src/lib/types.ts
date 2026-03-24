export interface Account {
  name: string;
  lastFour: string;
  balance: number;
  category: 'cash' | 'retirement' | 'investment' | 'debt';
  subcategory?: string;
}

export interface NetWorthSnapshot {
  date: string;
  cash: number;
  retirement: number;
  investments: number;
  debts: number;
  total: number;
}

export interface ExpenseEntry {
  date: string;
  description: string;
  amount: number;
  category: 'fixed' | 'variable_essentials' | 'lifestyle' | 'savings';
  subcategory: string;
}

export interface FIREProjection {
  age: number;
  year: number;
  portfolioValue: number;
  annualContributions: number;
  annualExpenses: number;
  fireNumber: number;
  reached: boolean;
}

export interface FIREInputs {
  currentAge: number;
  currentAssets: number;
  monthlyContributions: number;
  monthlyExpenses: number;
  expectedReturn: number; // as decimal, e.g. 0.07
  targetAge: number;
  inflationRate: number; // as decimal, e.g. 0.03
  safeWithdrawalRate: number; // as decimal, e.g. 0.04 (4% rule)
}

export interface AllocationItem {
  name: string;
  value: number;
  color: string;
  target?: number;
}
