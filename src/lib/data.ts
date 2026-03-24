import type { Account, NetWorthSnapshot, ExpenseEntry, AllocationItem } from './types';

export const accounts: Account[] = [
  // Cash accounts
  { name: 'High Yield Savings', lastFour: '9020', balance: 46.57, category: 'cash', subcategory: 'savings' },
  { name: 'CHASE SAVINGS', lastFour: '3060', balance: 2859.57, category: 'cash', subcategory: 'savings' },
  { name: 'Share Savings', lastFour: '0516', balance: 5.00, category: 'cash', subcategory: 'savings' },
  { name: 'Savings Account', lastFour: '3730', balance: 1153.53, category: 'cash', subcategory: 'savings' },
  { name: 'Online Savings', lastFour: '3412', balance: 0.14, category: 'cash', subcategory: 'savings' },
  { name: 'EveryDay Checking', lastFour: '9480', balance: 0.00, category: 'cash', subcategory: 'checking' },
  { name: 'Robinhood Spending', lastFour: '7867', balance: 0.00, category: 'cash', subcategory: 'checking' },
  { name: 'Emergency Funds', lastFour: '1698', balance: 30728.54, category: 'cash', subcategory: 'emergency' },
  { name: 'Liquid House Down Payment', lastFour: '3094', balance: 7527.50, category: 'cash', subcategory: 'goal' },

  // Retirement accounts
  { name: 'Traditional 401(k)', lastFour: '9455', balance: 120273.01, category: 'retirement', subcategory: '401k' },
  { name: 'Roth 401(k)', lastFour: '9456', balance: 26245.19, category: 'retirement', subcategory: 'roth-401k' },
  { name: 'Katrina DOORDASH 401(K)', lastFour: '9429', balance: 63851.78, category: 'retirement', subcategory: '401k' },

  // Investment accounts
  { name: 'Individual Investment', lastFour: '4792', balance: 2194.79, category: 'investment', subcategory: 'brokerage' },
  { name: 'Robinhood Individual', lastFour: '1895', balance: 13604.26, category: 'investment', subcategory: 'brokerage' },
  { name: 'Individual - TOD', lastFour: '4709', balance: 103759.77, category: 'investment', subcategory: 'brokerage' },
  { name: 'HSA Wealthcare Saver', lastFour: 'HSA', balance: 1166.38, category: 'investment', subcategory: 'hsa' },
  { name: 'Coinbase Crypto', lastFour: 'COIN', balance: 2874.72, category: 'investment', subcategory: 'crypto' },

  // Debt accounts
  { name: 'Blue Cash Preferred', lastFour: '4000', balance: -851.49, category: 'debt', subcategory: 'credit-card' },
  { name: 'CREDIT CARD', lastFour: '6714', balance: -582.64, category: 'debt', subcategory: 'credit-card' },
  { name: 'Venture X', lastFour: '4373', balance: -1372.01, category: 'debt', subcategory: 'credit-card' },
  { name: 'Vehicle Loan', lastFour: '7388', balance: -14846.72, category: 'debt', subcategory: 'auto-loan' },
  { name: 'Savor Card', lastFour: '4064', balance: 0, category: 'debt', subcategory: 'credit-card' },
  { name: 'Quicksilver Card', lastFour: '1018', balance: 0, category: 'debt', subcategory: 'credit-card' },
  { name: 'Active Cash Card', lastFour: '4642', balance: 0, category: 'debt', subcategory: 'credit-card' },
];

const cashTotal = accounts
  .filter((a) => a.category === 'cash')
  .reduce((sum, a) => sum + a.balance, 0);

const retirementTotal = accounts
  .filter((a) => a.category === 'retirement')
  .reduce((sum, a) => sum + a.balance, 0);

const investmentTotal = accounts
  .filter((a) => a.category === 'investment')
  .reduce((sum, a) => sum + a.balance, 0);

const debtTotal = accounts
  .filter((a) => a.category === 'debt')
  .reduce((sum, a) => sum + a.balance, 0);

export const currentNetWorth: NetWorthSnapshot = {
  date: '2026-03-23',
  cash: cashTotal,
  retirement: retirementTotal,
  investments: investmentTotal,
  debts: debtTotal,
  total: cashTotal + retirementTotal + investmentTotal + debtTotal,
};

export const sampleExpenses: ExpenseEntry[] = [
  { date: '2026-03-01', description: 'Rent', amount: 2200, category: 'fixed', subcategory: 'Housing' },
  { date: '2026-03-01', description: 'Car Insurance', amount: 185, category: 'fixed', subcategory: 'Insurance' },
  { date: '2026-03-01', description: 'Vehicle Loan Payment', amount: 425, category: 'fixed', subcategory: 'Auto Loan' },
  { date: '2026-03-02', description: 'Spotify Premium', amount: 11.99, category: 'lifestyle', subcategory: 'Subscriptions' },
  { date: '2026-03-03', description: 'Trader Joe\'s Groceries', amount: 78.42, category: 'variable_essentials', subcategory: 'Groceries' },
  { date: '2026-03-05', description: 'Electric Bill', amount: 94.50, category: 'fixed', subcategory: 'Utilities' },
  { date: '2026-03-06', description: 'Chipotle', amount: 14.75, category: 'lifestyle', subcategory: 'Dining Out' },
  { date: '2026-03-08', description: 'Gas Station', amount: 52.30, category: 'variable_essentials', subcategory: 'Transportation' },
  { date: '2026-03-10', description: 'Costco Groceries', amount: 142.87, category: 'variable_essentials', subcategory: 'Groceries' },
  { date: '2026-03-12', description: 'Internet Bill', amount: 65.00, category: 'fixed', subcategory: 'Utilities' },
  { date: '2026-03-14', description: 'Dinner with friends', amount: 48.90, category: 'lifestyle', subcategory: 'Dining Out' },
  { date: '2026-03-15', description: '401(k) Contribution', amount: 1500, category: 'savings', subcategory: 'Retirement' },
  { date: '2026-03-15', description: 'Phone Bill', amount: 45.00, category: 'fixed', subcategory: 'Utilities' },
  { date: '2026-03-18', description: 'Amazon Household Items', amount: 34.22, category: 'variable_essentials', subcategory: 'Household' },
  { date: '2026-03-20', description: 'Gym Membership', amount: 49.99, category: 'lifestyle', subcategory: 'Fitness' },
];

export const allocationData: AllocationItem[] = [
  {
    name: 'Retirement 401k',
    value: retirementTotal,
    color: '#3b82f6',
  },
  {
    name: 'Taxable Brokerage',
    value: accounts
      .filter((a) => a.category === 'investment' && a.subcategory === 'brokerage')
      .reduce((sum, a) => sum + a.balance, 0),
    color: '#10b981',
  },
  {
    name: 'Cash & Savings',
    value: cashTotal,
    color: '#f59e0b',
  },
  {
    name: 'Crypto',
    value: accounts
      .filter((a) => a.subcategory === 'crypto')
      .reduce((sum, a) => sum + a.balance, 0),
    color: '#8b5cf6',
  },
  {
    name: 'HSA',
    value: accounts
      .filter((a) => a.subcategory === 'hsa')
      .reduce((sum, a) => sum + a.balance, 0),
    color: '#06b6d4',
  },
];
