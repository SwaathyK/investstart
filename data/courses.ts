export interface Topic {
  title: string
  description?: string
}

export interface Module {
  id: number
  title: string
  description: string
  topics: Topic[]
  outcome: string
  duration: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
}

export interface Track {
  id: number
  title: string
  description: string
  color: string
  icon: string
  modules: Module[]
}

export const coursesData: Track[] = [
  {
    id: 1,
    title: 'Personal Finance & Foundations',
    description: 'Build a solid financial foundation before you start investing',
    color: 'blue',
    icon: '💰',
    modules: [
      {
        id: 1,
        title: 'Money Basics',
        description: 'Understanding the fundamentals of personal finance',
        duration: '45 min',
        level: 'Beginner',
        topics: [
          { title: 'What Is Personal Finance?' },
          { title: 'Net Worth & Cash Flow' },
          { title: 'Budgeting Methods (50/30/20, Zero-Based, Envelope)' },
          { title: 'Emergency Funds & Safety Nets' },
          { title: 'Interest, Debt, and Credit Scores' },
        ],
        outcome: 'User understands financial health before investing.',
      },
      {
        id: 2,
        title: 'Intro to Investing',
        description: 'Learn why investing matters and what to expect',
        duration: '40 min',
        level: 'Beginner',
        topics: [
          { title: 'Why Invest? (Time Value of Money)' },
          { title: 'Risk vs. Reward' },
          { title: 'Compound Interest' },
          { title: 'Types of Investors (Passive, Active, Hybrid)' },
          { title: 'Misconceptions & Myths' },
        ],
        outcome: 'User knows why investing matters and what to expect.',
      },
      {
        id: 3,
        title: 'Setting Goals',
        description: 'Create your investment plan and build your first portfolio',
        duration: '50 min',
        level: 'Beginner',
        topics: [
          { title: 'Short-, Medium-, and Long-Term Goals' },
          { title: 'Understanding Risk Tolerance' },
          { title: 'Creating an Investment Plan' },
          { title: '"How Much Should I Invest?"' },
          { title: 'Building Your First Simple Portfolio' },
        ],
        outcome: 'User has a clear investment plan and knows how to start.',
      },
    ],
  },
  {
    id: 2,
    title: 'Beginner Investing',
    description: 'Master the basics of the stock market and investment vehicles',
    color: 'green',
    icon: '📈',
    modules: [
      {
        id: 4,
        title: 'The Stock Market',
        description: 'Learn how stocks work and how to buy your first stock',
        duration: '55 min',
        level: 'Beginner',
        topics: [
          { title: 'What Is a Stock?' },
          { title: 'Stock Exchanges & Market Mechanics' },
          { title: 'How to Buy Your First Stock' },
          { title: 'Brokers, Apps, and Fees' },
          { title: 'Order Types (Market, Limit, Stop)' },
        ],
        outcome: 'User can confidently buy their first stock.',
      },
      {
        id: 5,
        title: 'Investment Vehicles',
        description: 'Explore different types of investments available',
        duration: '60 min',
        level: 'Beginner',
        topics: [
          { title: 'Stocks' },
          { title: 'Bonds' },
          { title: 'Mutual Funds' },
          { title: 'Index Funds' },
          { title: 'ETFs' },
          { title: 'Real Estate (REITs & Buying Property)' },
          { title: 'Commodities' },
          { title: 'Crypto (High-Level)' },
          { title: 'Cash & Money Markets' },
        ],
        outcome: 'User understands different investment options.',
      },
      {
        id: 6,
        title: 'Passive Investing',
        description: 'Learn the power of passive investing strategies',
        duration: '45 min',
        level: 'Beginner',
        topics: [
          { title: 'What Is Passive Investing?' },
          { title: 'Index Funds vs ETFs' },
          { title: 'Dollar-Cost Averaging' },
          { title: 'The 3-Fund Portfolio' },
          { title: 'Automatic Investing Setup' },
        ],
        outcome: 'User can set up a passive investment strategy.',
      },
    ],
  },
  {
    id: 3,
    title: 'Intermediate Investing',
    description: 'Dive deeper into analysis, portfolio construction, and taxes',
    color: 'yellow',
    icon: '📊',
    modules: [
      {
        id: 7,
        title: 'Stock Analysis Fundamentals',
        description: 'Learn to analyze companies like a pro',
        duration: '70 min',
        level: 'Intermediate',
        topics: [
          { title: 'Understanding Financial Statements' },
          { title: 'Revenue, Profit, and Cash Flow' },
          { title: 'Key Metrics (P/E, EPS, ROE, Debt Ratios)' },
          { title: 'Valuation Basics' },
          { title: 'Case Study: Analyzing a Real Company' },
        ],
        outcome: 'User can analyze stocks using fundamental analysis.',
      },
      {
        id: 8,
        title: 'Technical Analysis',
        description: 'Master chart reading and technical indicators',
        duration: '65 min',
        level: 'Intermediate',
        topics: [
          { title: 'Price Charts' },
          { title: 'Support and Resistance' },
          { title: 'Trend Lines' },
          { title: 'Indicators (RSI, MACD, Moving Averages)' },
          { title: 'Chart Patterns' },
        ],
        outcome: 'User can read charts and use technical indicators.',
      },
      {
        id: 9,
        title: 'Portfolio Construction',
        description: 'Build and manage a diversified portfolio',
        duration: '60 min',
        level: 'Intermediate',
        topics: [
          { title: 'Asset Allocation' },
          { title: 'Diversification Deep-Dive' },
          { title: 'Portfolio Rebalancing' },
          { title: 'Risk Management' },
          { title: 'Portfolio Optimization Models (Intro)' },
        ],
        outcome: 'User can construct and manage a well-diversified portfolio.',
      },
      {
        id: 10,
        title: 'Taxes & Accounts',
        description: 'Navigate taxes and choose the right investment accounts',
        duration: '50 min',
        level: 'Intermediate',
        topics: [
          { title: 'Taxable vs. Retirement Accounts' },
          { title: 'Capital Gains Taxes' },
          { title: 'Tax-Efficient Investing' },
          { title: 'Tax-Loss Harvesting' },
          { title: 'Global Tax Differences (Optional)' },
        ],
        outcome: 'User understands tax implications and account types.',
      },
    ],
  },
  {
    id: 4,
    title: 'Advanced Investing',
    description: 'Master options, advanced strategies, and alternative investments',
    color: 'orange',
    icon: '🚀',
    modules: [
      {
        id: 11,
        title: 'Options Trading',
        description: 'Learn options trading from basics to advanced strategies',
        duration: '80 min',
        level: 'Advanced',
        topics: [
          { title: 'What Are Options?' },
          { title: 'Calls vs Puts' },
          { title: 'Time Decay, Greeks, Volatility' },
          { title: 'Basic Strategies (Covered Calls, Cash-Secured Puts)' },
          { title: 'Spreads, Straddles, Iron Condors' },
        ],
        outcome: 'User understands options and can use basic strategies.',
      },
      {
        id: 12,
        title: 'Trading & Market Strategies',
        description: 'Explore different trading styles and market strategies',
        duration: '75 min',
        level: 'Advanced',
        topics: [
          { title: 'Day Trading Foundations' },
          { title: 'Swing Trading Methods' },
          { title: 'Momentum vs Value Investing' },
          { title: 'Arbitrage Basics' },
          { title: 'Algorithmic Trading (Intro)' },
        ],
        outcome: 'User understands different trading strategies.',
      },
      {
        id: 13,
        title: 'Alternative Investments',
        description: 'Explore beyond traditional stocks and bonds',
        duration: '70 min',
        level: 'Advanced',
        topics: [
          { title: 'Crypto Deep Dive' },
          { title: 'Venture Capital' },
          { title: 'Private Equity' },
          { title: 'Real Estate Investing (Advanced)' },
          { title: 'Art, Collectibles, and Other Alternatives' },
        ],
        outcome: 'User understands alternative investment options.',
      },
      {
        id: 14,
        title: 'Macroeconomics',
        description: 'Understand how the economy affects markets',
        duration: '65 min',
        level: 'Advanced',
        topics: [
          { title: 'Monetary Policy & Central Banks' },
          { title: 'Interest Rates' },
          { title: 'Inflation & Deflation' },
          { title: 'Market Cycles' },
          { title: 'Global Economic Indicators' },
        ],
        outcome: 'User understands macroeconomic factors affecting markets.',
      },
    ],
  },
  {
    id: 5,
    title: 'Behavioral Finance & Psychology',
    description: 'Master your emotions and avoid common investing mistakes',
    color: 'red',
    icon: '🧠',
    modules: [
      {
        id: 15,
        title: 'Investor Psychology',
        description: 'Understand cognitive biases and build healthy investing habits',
        duration: '55 min',
        level: 'Intermediate',
        topics: [
          { title: 'Cognitive Biases (FOMO, Overconfidence, Loss Aversion)' },
          { title: 'Emotional Investing' },
          { title: 'Trading Discipline' },
          { title: 'Building Healthy Habits' },
          { title: 'Avoiding Scams & FOMO Pumps' },
        ],
        outcome: 'User can recognize and avoid common psychological pitfalls.',
      },
    ],
  },
  {
    id: 6,
    title: 'Practical & Hands-On',
    description: 'Apply your knowledge with real-world tools and scenarios',
    color: 'purple',
    icon: '🛠️',
    modules: [
      {
        id: 16,
        title: 'Tools & Technology',
        description: 'Master the tools you need for successful investing',
        duration: '50 min',
        level: 'Intermediate',
        topics: [
          { title: 'Brokerage Platforms' },
          { title: 'Portfolio Trackers' },
          { title: 'Screeners & Charting Tools' },
          { title: 'News & Research Tools' },
        ],
        outcome: 'User knows which tools to use for investing.',
      },
      {
        id: 17,
        title: 'Real-World Scenarios',
        description: 'Learn to invest in different life situations',
        duration: '60 min',
        level: 'Intermediate',
        topics: [
          { title: 'Building a Portfolio at Age 18–29' },
          { title: 'Investing for Families' },
          { title: 'Investing for Retirement' },
          { title: 'Investing With High or Low Income' },
          { title: 'Managing Risk During Recessions' },
        ],
        outcome: 'User can adapt their strategy to their life situation.',
      },
      {
        id: 18,
        title: 'Capstone Projects',
        description: 'Apply everything you\'ve learned with hands-on projects',
        duration: '90 min',
        level: 'Advanced',
        topics: [
          { title: 'Build your own portfolio' },
          { title: 'Analyze a stock & write a report' },
          { title: 'Create a long-term plan' },
          { title: 'Simulated trading challenge' },
          { title: 'Risk assessment & strategy selection' },
        ],
        outcome: 'User has completed practical projects demonstrating mastery.',
      },
    ],
  },
]

export interface SimulationScenario {
  id: number
  title: string
  description: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  duration: string
  rounds: number
}

export const simulationScenarios: SimulationScenario[] = [
  {
    id: 1,
    title: 'Bull Market: "Everything\'s Going Up!"',
    description: 'Navigate a rising market and avoid FOMO while maintaining discipline',
    difficulty: 'Beginner',
    duration: '20 min',
    rounds: 2,
  },
  {
    id: 2,
    title: 'Bear Market / Crash: "Everything\'s Falling"',
    description: 'Stay calm during market downturns and make smart decisions',
    difficulty: 'Intermediate',
    duration: '25 min',
    rounds: 2,
  },
  {
    id: 3,
    title: '2008-Style Crisis Simulation',
    description: 'Experience a full market cycle from boom to bust to recovery',
    difficulty: 'Advanced',
    duration: '40 min',
    rounds: 3,
  },
  {
    id: 4,
    title: 'Meme Stock / Bubble Mania',
    description: 'Learn to resist hype and maintain discipline during market manias',
    difficulty: 'Intermediate',
    duration: '20 min',
    rounds: 2,
  },
]

