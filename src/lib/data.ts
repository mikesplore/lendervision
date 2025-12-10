export type Applicant = {
  id: string;
  name: string;
  dateApplied: string;
  eligibilityScore: number;
  riskRating: 'Low' | 'Medium' | 'High';
  fraudFlags: number;
  photoId: string;
  email: string;
  phone: string;
  aiScores: {
    loanEligibility: {
      score: number;
      tier: 'Excellent' | 'Good' | 'Fair' | 'Poor';
    };
    riskRating: 'LOW RISK' | 'MEDIUM RISK' | 'HIGH RISK';
    defaultProbability: number;
  };
  fraudAnalysis: {
    livenessDetection: boolean;
    idAuthentic: boolean;
    deviceIntelligence: string[];
    behavioralInsights: string[];
  };
  financials: {
    avgMonthlyIncome: number;
    avgMonthlyDebt: number;
    history: { month: string; income: number; obligations: number }[];
  };
  recommendations: {
    loanLimit: number;
    interestRate: number;
  };
};

export const applicants: Applicant[] = [
  {
    id: 'app-1',
    name: 'Jane Doe',
    dateApplied: '2024-05-20',
    eligibilityScore: 88,
    riskRating: 'Low',
    fraudFlags: 0,
    photoId: 'applicant-1',
    email: 'jane.d@example.com',
    phone: '+254 722 123 456',
    aiScores: {
      loanEligibility: { score: 88, tier: 'Excellent' },
      riskRating: 'LOW RISK',
      defaultProbability: 1.2,
    },
    fraudAnalysis: {
      livenessDetection: true,
      idAuthentic: true,
      deviceIntelligence: [],
      behavioralInsights: [
        'Consistent M-Pesa transaction history.',
        'Positive seasonal income pattern detected.',
        'Low debt-to-income ratio.',
      ],
    },
    financials: {
      avgMonthlyIncome: 75000,
      avgMonthlyDebt: 15000,
      history: [
        { month: 'Jan', income: 72000, obligations: 14000 },
        { month: 'Feb', income: 78000, obligations: 15500 },
        { month: 'Mar', income: 74000, obligations: 14500 },
        { month: 'Apr', income: 76000, obligations: 16000 },
      ],
    },
    recommendations: {
      loanLimit: 50000,
      interestRate: 12,
    },
  },
  {
    id: 'app-2',
    name: 'John Smith',
    dateApplied: '2024-05-20',
    eligibilityScore: 65,
    riskRating: 'Medium',
    fraudFlags: 2,
    photoId: 'applicant-2',
    email: 'j.smith@example.com',
    phone: '+254 711 987 654',
    aiScores: {
      loanEligibility: { score: 65, tier: 'Good' },
      riskRating: 'MEDIUM RISK',
      defaultProbability: 8.5,
    },
    fraudAnalysis: {
      livenessDetection: true,
      idAuthentic: true,
      deviceIntelligence: [
        'Applicant logged in from a device previously associated with 2 fraudulent accounts.',
        'IP address located in a high-risk region.',
      ],
      behavioralInsights: [
        'Irregular income deposits.',
        'High number of transactions to gambling services.',
      ],
    },
    financials: {
      avgMonthlyIncome: 45000,
      avgMonthlyDebt: 25000,
      history: [
        { month: 'Jan', income: 50000, obligations: 22000 },
        { month: 'Feb', income: 30000, obligations: 28000 },
        { month: 'Mar', income: 48000, obligations: 24000 },
        { month: 'Apr', income: 52000, obligations: 26000 },
      ],
    },
    recommendations: {
      loanLimit: 15000,
      interestRate: 18,
    },
  },
  {
    id: 'app-3',
    name: 'Alice Johnson',
    dateApplied: '2024-05-19',
    eligibilityScore: 92,
    riskRating: 'Low',
    fraudFlags: 0,
    photoId: 'applicant-3',
    email: 'alice.j@example.com',
    phone: '+254 733 555 888',
    aiScores: {
      loanEligibility: { score: 92, tier: 'Excellent' },
      riskRating: 'LOW RISK',
      defaultProbability: 0.9,
    },
    fraudAnalysis: {
      livenessDetection: true,
      idAuthentic: true,
      deviceIntelligence: [],
      behavioralInsights: ['Long, stable credit history.', 'Multiple consistent income sources.'],
    },
    financials: {
      avgMonthlyIncome: 120000,
      avgMonthlyDebt: 30000,
      history: [
        { month: 'Jan', income: 118000, obligations: 29000 },
        { month: 'Feb', income: 122000, obligations: 31000 },
        { month: 'Mar', income: 120000, obligations: 30000 },
        { month: 'Apr', income: 125000, obligations: 30500 },
      ],
    },
    recommendations: {
      loanLimit: 100000,
      interestRate: 11.5,
    },
  },
    {
    id: 'app-4',
    name: 'Bob Brown',
    dateApplied: '2024-05-18',
    eligibilityScore: 45,
    riskRating: 'High',
    fraudFlags: 1,
    photoId: 'applicant-4',
    email: 'b.brown@example.com',
    phone: '+254 744 111 222',
    aiScores: {
      loanEligibility: { score: 45, tier: 'Fair' },
      riskRating: 'HIGH RISK',
      defaultProbability: 25.0,
    },
    fraudAnalysis: {
      livenessDetection: true,
      idAuthentic: false,
      deviceIntelligence: ['ID document appears to be digitally altered.'],
      behavioralInsights: ['No credit history found.', 'Income source cannot be verified.'],
    },
    financials: {
      avgMonthlyIncome: 20000,
      avgMonthlyDebt: 18000,
      history: [
        { month: 'Jan', income: 21000, obligations: 17000 },
        { month: 'Feb', income: 19000, obligations: 18000 },
        { month: 'Mar', income: 20000, obligations: 19000 },
        { month: 'Apr', income: 20000, obligations: 18000 },
      ],
    },
    recommendations: {
      loanLimit: 0,
      interestRate: 0,
    },
  },
  {
    id: 'app-5',
    name: 'Charlie Davis',
    dateApplied: '2024-05-17',
    eligibilityScore: 78,
    riskRating: 'Low',
    fraudFlags: 0,
    photoId: 'applicant-5',
    email: 'charlie.d@example.com',
    phone: '+254 755 333 444',
    aiScores: {
      loanEligibility: { score: 78, tier: 'Good' },
      riskRating: 'LOW RISK',
      defaultProbability: 4.1,
    },
    fraudAnalysis: {
      livenessDetection: true,
      idAuthentic: true,
      deviceIntelligence: [],
      behavioralInsights: ['Stable gig-economy income.', 'Consistent rent payments visible.'],
    },
    financials: {
      avgMonthlyIncome: 60000,
      avgMonthlyDebt: 20000,
      history: [
        { month: 'Jan', income: 58000, obligations: 20000 },
        { month: 'Feb', income: 62000, obligations: 20000 },
        { month: 'Mar', income: 61000, obligations: 20000 },
        { month: 'Apr', income: 59000, obligations: 20000 },
      ],
    },
    recommendations: {
      loanLimit: 35000,
      interestRate: 14,
    },
  },
  {
    id: 'app-6',
    name: 'Diana Prince',
    dateApplied: '2024-05-21',
    eligibilityScore: 55,
    riskRating: 'Medium',
    fraudFlags: 0,
    photoId: 'applicant-6',
    email: 'diana.p@example.com',
    phone: '+254 766 777 888',
    aiScores: {
      loanEligibility: { score: 55, tier: 'Fair' },
      riskRating: 'MEDIUM RISK',
      defaultProbability: 15.3,
    },
    fraudAnalysis: {
      livenessDetection: true,
      idAuthentic: true,
      deviceIntelligence: [],
      behavioralInsights: [
        'High debt-to-income ratio.',
        'Recently took on multiple new credit lines.',
      ],
    },
    financials: {
      avgMonthlyIncome: 80000,
      avgMonthlyDebt: 65000,
      history: [
        { month: 'Jan', income: 82000, obligations: 60000 },
        { month: 'Feb', income: 78000, obligations: 62000 },
        { month: 'Mar', income: 81000, obligations: 68000 },
        { month: 'Apr', income: 80000, obligations: 70000 },
      ],
    },
    recommendations: {
      loanLimit: 10000,
      interestRate: 22,
    },
  },
];
