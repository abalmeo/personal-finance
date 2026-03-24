export interface ResearchTopic {
  id: string;
  title: string;
  snippet: string;
  keyNumber: string;
  keyNumberLabel: string;
  source: string;
  sourceYear: number;
  category: 'retirement' | 'investing' | 'lifestyle' | 'planning';
  icon: string;
  argumentsFor: { title: string; detail: string }[];
  argumentsAgainst: { title: string; detail: string }[];
  context: string;
  takeaway: string;
}

export const researchTopics: ResearchTopic[] = [
  {
    id: 'four-percent-rule',
    title: 'Is the 4% Rule Still Valid?',
    snippet: 'The classic 4% withdrawal rate remains relevant but may need adjustment. Modern research suggests 3.9–4.7% depending on portfolio and time horizon.',
    keyNumber: '3.9–4.7%',
    keyNumberLabel: 'Updated safe withdrawal range',
    source: 'Morningstar (2025), Bengen (2025), ERN Research',
    sourceYear: 2025,
    category: 'retirement',
    icon: '📊',
    argumentsFor: [
      {
        title: 'Survived every historical crisis',
        detail: 'Backtesting shows the 4% rule survived the Great Depression, stagflation of the 1970s, the dot-com crash, and 2008 financial crisis. It\'s been remarkably resilient across 150 years of market data.',
      },
      {
        title: 'Early retirees have built-in flexibility',
        detail: 'Unlike traditional retirees, FIRE practitioners can reduce spending in downturns or pick up part-time work. This flexibility dramatically improves survival rates even at 4%+.',
      },
      {
        title: 'Recent conditions support it',
        detail: 'Bill Bengen updated his own rule to 4.7% in 2025, noting that diversified portfolios with small-cap and international exposure have historically supported higher rates.',
      },
    ],
    argumentsAgainst: [
      {
        title: '30 years isn\'t enough for early retirees',
        detail: 'The original Trinity Study tested 30-year periods. A 32-year-old retiring at 45 needs 50+ years. ERN\'s research shows safe rates drop to ~3.25% for 60-year horizons.',
      },
      {
        title: 'Lower future expected returns',
        detail: 'Current CAPE (Shiller P/E) ratios suggest lower forward returns than historical averages. If the next 30 years return 5% instead of 7%, the 4% rule\'s margin of safety shrinks significantly.',
      },
      {
        title: 'Healthcare costs weren\'t in the original model',
        detail: 'Rising healthcare costs, especially for pre-Medicare early retirees ($400–800/month individual), weren\'t factored into the original study\'s expense assumptions.',
      },
    ],
    context: 'The 4% rule comes from the 1998 Trinity Study, which backtested withdrawal strategies against historical market returns. It found that withdrawing 4% of your initial portfolio (adjusted for inflation) had about a 96% success rate over 30 years. The rule has become the cornerstone of retirement planning, but its applicability to early retirees with 50+ year horizons is debated.',
    takeaway: 'The 4% rule is a solid starting point, not a guarantee. If retiring before 50, consider using 3.5% for extra safety margin. If retiring after 55, 4% is well-supported by evidence.',
  },
  {
    id: 'rent-vs-buy',
    title: 'Renting vs Buying a Home',
    snippet: 'The 5% rule compares rent to 5% of home value annually. Below that threshold, renting may actually build more wealth through invested savings.',
    keyNumber: '5%',
    keyNumberLabel: 'Annual cost of ownership threshold',
    source: 'Ben Felix / PWL Capital',
    sourceYear: 2024,
    category: 'planning',
    icon: '🏠',
    argumentsFor: [
      {
        title: 'Forced savings and equity building',
        detail: 'Every mortgage payment builds equity. Over 30 years, you own an appreciating asset outright. Most renters don\'t have the discipline to invest the difference.',
      },
      {
        title: 'Inflation hedge with fixed-rate mortgage',
        detail: 'Your monthly payment stays locked while rents rise with inflation. After 15-20 years, a mortgage payment feels negligible compared to market rents.',
      },
      {
        title: 'Stability and control',
        detail: 'No risk of eviction or rent increases. You can renovate, build equity through improvements, and create long-term roots in a community.',
      },
    ],
    argumentsAgainst: [
      {
        title: 'Massive opportunity cost',
        detail: 'A $100K+ down payment invested in the S&P 500 at 7-10% returns often outperforms real estate appreciation (historically ~1% real return). The 5% rule: ownership costs 1% property tax + 1% maintenance + 3% cost of capital.',
      },
      {
        title: 'Hidden costs exceed expectations',
        detail: 'Maintenance, repairs, insurance, HOA fees, and property taxes add 2-3% annually to the purchase price. A new roof ($15K), HVAC system ($10K), or foundation issue can dwarf years of "equity building."',
      },
      {
        title: 'Mobility and career flexibility lost',
        detail: 'Selling costs 6-10% (realtor fees, closing costs). Being tied to a location limits career moves and income growth, which often matters more than housing equity in your 30s-40s.',
      },
    ],
    context: 'Ben Felix\'s 5% rule breaks down ownership cost: 1% property tax + 1% maintenance + 3% opportunity cost of capital = 5% of home value annually. If you can rent for less than this amount, renting and investing the difference often builds more wealth. Example: a $540K home costs ~$2,250/month to own by this rule. If you can rent equivalent housing for less, renting wins financially.',
    takeaway: 'Neither is universally better. Run the 5% rule for your specific market. In expensive cities, renting often wins. In affordable areas, buying often wins. Your personal timeline (staying 7+ years?) matters most.',
  },
  {
    id: 'index-vs-active',
    title: 'Index Funds vs Active Management',
    snippet: '94.1% of actively managed funds underperformed their benchmark over 20 years. The data overwhelmingly favors passive investing for most people.',
    keyNumber: '94.1%',
    keyNumberLabel: 'Active funds that underperform over 20 years',
    source: 'SPIVA U.S. Scorecard',
    sourceYear: 2024,
    category: 'investing',
    icon: '📈',
    argumentsFor: [
      {
        title: 'The numbers are overwhelming',
        detail: 'Over 20 years (2005–2024), 94.1% of all domestic equity funds underperformed the S&P 1500. On a risk-adjusted basis, it\'s 97.3%. This isn\'t a close call.',
      },
      {
        title: 'Lower fees compound massively',
        detail: 'Average equity fund fees dropped from 97 to 34 basis points (2001-2024), saving investors $116B annually. A 0.5% fee difference on $500K over 30 years = $200K+ in lost returns.',
      },
      {
        title: 'Tax efficiency',
        detail: 'Index funds have lower turnover, generating fewer taxable events. This can add 0.5-1% annually in after-tax returns compared to actively managed funds.',
      },
    ],
    argumentsAgainst: [
      {
        title: 'Small-cap active managers do outperform',
        detail: 'In 2024, 70% of small-cap active funds beat their benchmark. Markets aren\'t perfectly efficient in less-covered segments, creating opportunities for skilled managers.',
      },
      {
        title: 'Factor investing offers a middle path',
        detail: 'Tilting toward value, small-cap, and momentum factors has historically outperformed pure market-cap indexing by 1-2% annually. This is "smart beta" — systematic, not stock-picking.',
      },
      {
        title: 'Concentrated positions build extreme wealth',
        detail: 'Most wealth is built through concentrated bets (founding a company, heavy stock position). For wealth creation vs. preservation, some concentration can be rational.',
      },
    ],
    context: 'The SPIVA (S&P Indices Versus Active) Scorecard has been published since 2002 and is the industry gold standard for measuring active vs. passive performance. The data consistently shows that the vast majority of professional fund managers — with teams of analysts, research budgets, and information advantages — still can\'t beat a simple index fund after fees.',
    takeaway: 'For your core portfolio (80-90%), index funds are the evidence-based choice. If you enjoy stock-picking, limit it to 10% "fun money" — the data says you\'ll likely underperform, but the learning has value.',
  },
  {
    id: 'emergency-fund',
    title: 'How Much Emergency Fund Do You Need?',
    snippet: 'Traditional guidance says 3-6 months of expenses, but the right amount depends on income stability, household structure, and access to other liquidity.',
    keyNumber: '3-6 months',
    keyNumberLabel: 'Standard recommendation range',
    source: 'Federal Reserve SHED Survey',
    sourceYear: 2024,
    category: 'planning',
    icon: '🛡️',
    argumentsFor: [
      {
        title: 'Job loss can last longer than you think',
        detail: 'Average unemployment duration is 5-6 months. For specialized roles or during recessions, it can be 9-12 months. Being cash-poor during a job search leads to desperation decisions.',
      },
      {
        title: 'Healthcare gaps are real',
        detail: 'COBRA costs $600-2,000/month. Without employer coverage, a medical emergency without reserves can wipe out investment gains. Pre-Medicare early retirees are especially vulnerable.',
      },
      {
        title: '45% of Americans can\'t cover 3 months',
        detail: 'The 2024 Fed survey shows 30% of adults can\'t cover 3 months of expenses by any means. Having reserves puts you in a fundamentally stronger position than nearly half the population.',
      },
    ],
    argumentsAgainst: [
      {
        title: 'Opportunity cost is significant',
        detail: '$30K in a savings account at 4.5% earns $1,350/year. In the S&P 500, historically it earns $2,100-3,000/year. Over a decade, that difference compounds to $20K+.',
      },
      {
        title: 'Dual income changes the math',
        detail: 'With two earners, the probability of both losing income simultaneously is low. 2-3 months may be sufficient since one income can cover basics while the other job hunts.',
      },
      {
        title: 'Credit access provides backup',
        detail: 'A HELOC, unused credit cards, or Roth IRA contributions (withdrawable penalty-free) can serve as secondary emergency reserves, allowing you to keep more invested.',
      },
    ],
    context: 'Your current emergency fund of ~$30,700 represents approximately 3-4 months of estimated expenses. The "right" amount is personal — it should let you sleep at night while not hoarding too much in low-return cash. Consider your income stability, dependents, health status, and risk tolerance.',
    takeaway: 'At $30K with dual income and no dependents, you\'re well-positioned. Consider whether the extra cash above 3 months could work harder invested. But never go below 3 months — the peace of mind is worth the opportunity cost.',
  },
  {
    id: 'debt-vs-invest',
    title: 'Pay Off Debt or Invest First?',
    snippet: 'The mathematical crossover is around 6% — below that, investing wins. Above that, pay debt. But psychology and guaranteed returns make debt payoff compelling.',
    keyNumber: '~6%',
    keyNumberLabel: 'Interest rate crossover point',
    source: 'Fidelity / White Coat Investor',
    sourceYear: 2024,
    category: 'planning',
    icon: '⚖️',
    argumentsFor: [
      {
        title: 'Guaranteed return on debt payoff',
        detail: 'Paying off 5% debt = guaranteed 5% return with zero risk. The stock market might return 7-10%, but it might also return -20% in any given year. Debt payoff has no variance.',
      },
      {
        title: 'Psychological freedom is underrated',
        detail: 'Behavioral finance research shows debt-free individuals report significantly higher financial confidence and lower stress. The mental burden of debt affects career decisions, relationships, and health.',
      },
      {
        title: 'Prevents compounding against you',
        detail: 'Credit card debt at 20%+ compounds faster than any investment can grow. Even "moderate" debt at 7-8% is eroding wealth every month it persists.',
      },
    ],
    argumentsAgainst: [
      {
        title: 'Expected market returns exceed most debt rates',
        detail: 'Historical stock returns of 7-10% exceed most mortgage rates (6-7%), auto loans (4-6%), and student loans (4-7%). Over decades, the spread compounds significantly in favor of investing.',
      },
      {
        title: 'Never skip the employer 401(k) match',
        detail: 'An employer match is a 50-100% instant return. Even with 10% debt, contributing up to the match first is almost always mathematically correct.',
      },
      {
        title: 'Time in market can\'t be recovered',
        detail: 'Missing years of compound growth is permanent. A 25-year-old who delays investing 5 years to pay off $20K in student loans at 5% may lose $50K+ in lifetime returns.',
      },
    ],
    context: 'Your car loan at 4-6% APR is in the "invest first" zone mathematically. Credit cards paid in full means no high-interest debt. The real question is whether to make extra payments on the car or invest the difference.',
    takeaway: 'With your 4-6% car loan: minimum payments + invest the rest is the math-optimal play. But if the loan bothers you, paying it off faster is a valid choice — the peace of mind has real value.',
  },
  {
    id: 'fire-criticisms',
    title: 'The FIRE Movement: Criticisms & Defense',
    snippet: 'FIRE offers compelling freedom but faces valid concerns about healthcare costs, sequence risk over 50+ year horizons, and post-retirement identity challenges.',
    keyNumber: '3.25%',
    keyNumberLabel: 'Safe withdrawal rate for 60-year horizon',
    source: 'Early Retirement Now (ERN) Research Series',
    sourceYear: 2024,
    category: 'retirement',
    icon: '🔥',
    argumentsFor: [
      {
        title: 'Flexibility is the ultimate hedge',
        detail: 'Unlike traditional retirees locked into fixed income, FIRE practitioners can Coast FIRE (work part-time), Barista FIRE (keep employer health insurance), or adjust spending. This flexibility dramatically improves sustainability.',
      },
      {
        title: 'Healthcare has workable solutions',
        detail: 'ACA marketplace plans, healthcare sharing ministries, COBRA bridge strategies, and Roth conversion ladders for income management can keep costs manageable. It requires planning, not avoidance.',
      },
      {
        title: 'High reported life satisfaction',
        detail: 'Studies of early retirees consistently show high life satisfaction scores. The autonomy to choose how you spend time — even if that includes some work — is fundamentally different from being forced to work.',
      },
    ],
    argumentsAgainst: [
      {
        title: 'Healthcare is genuinely dangerous pre-Medicare',
        detail: 'Individual ACA plans cost $400-800/month. A serious illness without employer coverage can generate six-figure bills. This is the single biggest risk for early retirees under 65.',
      },
      {
        title: 'Sequence of returns risk is amplified',
        detail: 'A 50% market crash in year 1 of a 60-year retirement is far more devastating than in year 1 of a 30-year retirement. ERN shows success rates drop from 90% to ~60% with poor early returns.',
      },
      {
        title: 'Identity crisis is real and common',
        detail: '"Who am I without my career?" Many FIRE adherents report an unexpected identity vacuum post-retirement. Without structure, purpose, and social connections from work, depression can follow.',
      },
    ],
    context: 'The FIRE movement has grown from a niche community to mainstream awareness. It encompasses a spectrum from Lean FIRE (extreme frugality) to Fat FIRE (maintaining a premium lifestyle). The movement\'s core insight — that financial independence provides life optionality — is hard to argue with. The debate is about whether the math and psychology actually work in practice.',
    takeaway: 'FIRE isn\'t all-or-nothing. The path to financial independence — high savings rate, low debt, intentional spending — improves your life regardless of whether you fully "retire" early. Think of it as buying options on your future.',
  },
  {
    id: 'social-security',
    title: 'Social Security: Will It Be There?',
    snippet: 'Trust fund depletes in 2033, but that doesn\'t mean $0 benefits. Even without reform, the system can still pay 77% of scheduled benefits from ongoing payroll taxes.',
    keyNumber: '77%',
    keyNumberLabel: 'Benefits payable after 2033 depletion',
    source: 'Social Security Board of Trustees Report',
    sourceYear: 2025,
    category: 'retirement',
    icon: '🏛️',
    argumentsFor: [
      {
        title: 'It won\'t disappear — the math doesn\'t work that way',
        detail: 'Social Security is funded by current payroll taxes, not just the trust fund. Even at "depletion," ongoing taxes cover 77% of benefits. It\'s not a bank account going to zero.',
      },
      {
        title: 'Political will is incredibly strong',
        detail: 'Social Security is the most popular government program. No politician will vote for a 23% overnight benefit cut. Congress has always acted before — and will again.',
      },
      {
        title: 'Modest fixes solve the problem',
        detail: 'Small adjustments — raising the payroll tax cap, modest benefit tweaks, or adjusting the retirement age — can close the gap indefinitely. The solutions are known; only political will is needed.',
      },
    ],
    argumentsAgainst: [
      {
        title: 'Benefits will likely be reduced for higher earners',
        detail: 'The most politically feasible "fix" is means-testing or reducing benefits for higher-income retirees. At $250K+ household income, you\'re a likely target for reduced benefits.',
      },
      {
        title: 'Planning without it is just safer',
        detail: 'If you plan assuming 50-70% of projected benefits and then get more, that\'s a bonus. Planning on 100% and getting 77% is a retirement-damaging surprise.',
      },
      {
        title: 'Every year of delay makes fixes harder',
        detail: 'The 2025 Trustees Report moved depletion a year sooner (to 2033). Each year Congress delays action, the required adjustment gets steeper and more painful.',
      },
    ],
    context: '"Social Security is going bankrupt" is one of the most misunderstood claims in personal finance. The trust fund — which holds surplus from past collections — will deplete around 2033. But the program continues collecting payroll taxes indefinitely. The real question isn\'t whether you\'ll get benefits, but how much.',
    takeaway: 'Don\'t ignore Social Security, but don\'t depend on it at 100%. Plan for 70% of projected benefits as a conservative estimate. Any reform that increases benefits is a bonus.',
  },
  {
    id: 'crypto-allocation',
    title: 'Cryptocurrency in Your Portfolio',
    snippet: 'Modern portfolio theory suggests 1-5% crypto allocation can improve risk-adjusted returns. The optimal Sharpe ratio peaks at ~5% Bitcoin before benefits plateau.',
    keyNumber: '1-5%',
    keyNumberLabel: 'Optimal portfolio allocation',
    source: 'Bloomberg / Grayscale Research',
    sourceYear: 2024,
    category: 'investing',
    icon: '₿',
    argumentsFor: [
      {
        title: 'Diversification benefit is real',
        detail: 'Bitcoin shows low-to-negative correlation with traditional assets during certain periods. Adding 5% crypto to a 60/40 portfolio has historically improved risk-adjusted returns without proportional volatility increase.',
      },
      {
        title: 'Asymmetric upside potential',
        detail: 'At 1-5% allocation, your maximum downside is that 1-5%. But the upside in a crypto bull market can meaningfully boost total portfolio returns. It\'s a small bet with outsized potential.',
      },
      {
        title: 'Institutional adoption is accelerating',
        detail: 'Bitcoin ETFs, corporate treasury adoption, and central bank digital currencies are normalizing crypto. The infrastructure risk that plagued early adoption is largely resolved.',
      },
    ],
    argumentsAgainst: [
      {
        title: '50%+ drawdowns are normal',
        detail: 'Bitcoin has experienced multiple 50-80% crashes. The psychological impact of watching $15K become $5K causes many investors to panic sell at the bottom, locking in losses.',
      },
      {
        title: 'No fundamental cash flows',
        detail: 'Unlike stocks (earnings/dividends) or bonds (coupons), crypto generates no income. Returns depend entirely on someone paying more later. This makes valuation speculative by nature.',
      },
      {
        title: 'Regulatory risk remains significant',
        detail: 'Government regulation could dramatically impact valuations overnight. Bans, heavy taxation, or restrictive legislation remain real possibilities in many jurisdictions.',
      },
    ],
    context: 'Your current crypto allocation is ~$2,875 in Coinbase — less than 1% of your portfolio. This is well within the research-supported range. The question isn\'t whether to have crypto, but whether to increase it.',
    takeaway: 'Your current <1% allocation is conservative but reasonable. If you\'re comfortable with volatility, increasing to 3-5% is supported by portfolio theory. Don\'t go above 5% — the diversification benefit plateaus.',
  },
  {
    id: 'lifestyle-inflation',
    title: 'Lifestyle Inflation: Friend or Foe?',
    snippet: 'The hedonic treadmill suggests we adapt to higher spending without lasting happiness gains. But modern research shows adaptation isn\'t universal — intentional upgrades can permanently improve wellbeing.',
    keyNumber: 'Not universal',
    keyNumberLabel: 'Hedonic adaptation varies by person',
    source: 'Diener, Lucas & Scollon (2006, updated 2024)',
    sourceYear: 2024,
    category: 'lifestyle',
    icon: '✨',
    argumentsFor: [
      {
        title: 'What\'s the point of earning more if you never enjoy it?',
        detail: 'If your income grows from $200K to $300K but spending stays frozen, you\'re just accumulating numbers. The entire purpose of building wealth is optionality — including the option to enjoy life now.',
      },
      {
        title: 'Experiences create permanent happiness gains',
        detail: 'Research (UT Austin 2020) shows spending on experiences — travel, dining, adventures — creates lasting positive memories that don\'t fade like material purchases. These are worth upgrading.',
      },
      {
        title: 'Extreme frugality causes burnout',
        detail: 'FIRE adherents who cut too aggressively often burn out and swing to overspending. Sustainable financial plans include "lifestyle budget" for enjoyment. Balance prevents the pendulum swing.',
      },
    ],
    argumentsAgainst: [
      {
        title: 'Savings rate destruction is silent',
        detail: 'A 5% raise that becomes a 5% spending increase means zero progress on financial goals. Over a career, this single pattern is the #1 reason high earners retire broke.',
      },
      {
        title: 'Golden handcuffs limit freedom',
        detail: 'Once you adapt to a $15K/month lifestyle, you need $15K/month income to feel "normal." This limits career changes, entrepreneurship, and location flexibility — the opposite of financial independence.',
      },
      {
        title: 'Happiness research shows diminishing returns',
        detail: 'Going from $50K→$100K spending adds significant happiness. Going from $100K→$150K adds very little. Most lifestyle inflation happens above the diminishing returns threshold.',
      },
    ],
    context: 'This is especially relevant for you — balancing travel, great restaurants, and nicer things while saving for FIRE. The research says you don\'t have to choose. At $250K+ income, you\'re well past the $100K happiness threshold. The key is intentional spending on what actually makes you happy (experiences, connection) vs. unconscious spending on status.',
    takeaway: 'The answer isn\'t "stop spending" — it\'s "spend intentionally." Upgrade experiences (travel, dining with friends) aggressively. Be skeptical of material upgrades that become the new normal within weeks.',
  },
  {
    id: 'financial-advisors',
    title: 'Do You Need a Financial Advisor?',
    snippet: 'Vanguard\'s 25-year study shows advisors can add up to 3% annually through behavioral coaching and tax planning — but fees often erase gains for disciplined DIY investors.',
    keyNumber: 'Up to 3%',
    keyNumberLabel: 'Annual value-add from advisor (Vanguard Alpha)',
    source: 'Vanguard Advisor\'s Alpha (25th edition)',
    sourceYear: 2025,
    category: 'planning',
    icon: '🧑‍💼',
    argumentsFor: [
      {
        title: 'Behavioral coaching is worth 1-2% alone',
        detail: 'The biggest advisor value isn\'t stock-picking — it\'s preventing you from panic-selling in a crash. Vanguard found behavioral coaching worth up to 2% annually. One prevented panic sell in 2020 or 2022 could be worth $50K+.',
      },
      {
        title: 'Tax optimization adds real dollars',
        detail: 'Roth conversion strategies, tax-loss harvesting (up to 1.5% alpha), and asset location optimization (0.6% alpha) require expertise most DIYers don\'t have. At $250K+ income, tax planning matters enormously.',
      },
      {
        title: 'Estate and complexity planning',
        detail: 'Wills, trusts, beneficiary designations, insurance analysis, and multi-account coordination (Traditional 401k, Roth 401k, HSA, taxable) get complex. Mistakes have permanent consequences.',
      },
    ],
    argumentsAgainst: [
      {
        title: 'AUM fees compound against you',
        detail: '1% AUM fee on $360K = $3,600/year. On $1M (where you\'re headed) = $10,000/year. Over 20 years, that\'s $200K+ in fees + lost compound growth. Most advisors don\'t generate 1%+ alpha consistently.',
      },
      {
        title: 'Conflicts of interest are structural',
        detail: 'AUM-based advisors are incentivized to increase assets under management, not necessarily optimize your financial life. Recommending you pay off a mortgage (reducing investable assets) hurts their revenue.',
      },
      {
        title: 'DIY tools are incredibly good now',
        detail: 'Index funds, robo-advisors, free tax software, and communities like Bogleheads provide 90% of what an advisor offers. For a disciplined investor with a simple portfolio, the DIY path is well-paved.',
      },
    ],
    context: 'Vanguard\'s Advisor\'s Alpha study has been running for 25 years and is the most rigorous quantification of advisor value. The up to 3% figure includes behavioral coaching (2%), tax management (1.5%), spending strategy (1.2%), asset location (0.6%), and rebalancing (0.14%). But these aren\'t guaranteed — they depend on the advisor\'s skill and your specific situation.',
    takeaway: 'At your net worth and income, a fee-only financial planner (not AUM-based) for an annual checkup ($1,000-3,000/session) may be the sweet spot. You get tax optimization and a second set of eyes without the drag of ongoing AUM fees.',
  },
];

export const categoryLabels: Record<string, { label: string; color: string }> = {
  retirement: { label: 'Retirement', color: '#3b82f6' },
  investing: { label: 'Investing', color: '#10b981' },
  lifestyle: { label: 'Lifestyle', color: '#f59e0b' },
  planning: { label: 'Planning', color: '#8b5cf6' },
};
