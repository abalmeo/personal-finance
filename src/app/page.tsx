import { accounts, currentNetWorth, sampleExpenses } from '@/lib/data';
import DashboardOverview from '@/components/DashboardOverview';

export default function Home() {
  return (
    <DashboardOverview
      accounts={accounts}
      netWorth={currentNetWorth}
      expenses={sampleExpenses}
    />
  );
}
