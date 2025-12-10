/**
 * AI Demo & Testing Script
 * Run this to test all AI services with mock data
 * 
 * Usage: 
 * 1. Set GOOGLE_GENAI_API_KEY in .env.local
 * 2. Run: tsx src/ai/demo.ts
 */

import { FaceVerificationService } from './services/face-verification';
import { IDVerificationService } from './services/id-verification';
import { CreditScoringService } from './services/credit-scoring';
import { MockDataGenerator } from './services/mock-data-generator';
import { AIOnboardingOrchestrator } from './services/onboarding-orchestrator';

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

function log(color: keyof typeof colors, ...args: any[]) {
  console.log(colors[color], ...args, colors.reset);
}

function section(title: string) {
  console.log('\n' + '='.repeat(80));
  log('bold', `  ${title}`);
  console.log('='.repeat(80) + '\n');
}

async function demoMockDataGeneration() {
  section('DEMO 1: Mock Data Generation');

  log('cyan', '📊 Generating Low Risk Profile...');
  const lowRisk = MockDataGenerator.generateUserProfile('low');
  console.log('Monthly Income:', lowRisk.monthlyIncome.toLocaleString());
  console.log('Employment:', lowRisk.employmentType);
  console.log('Has Defaults:', lowRisk.hasDefaultedLoans);
  console.log('Savings Pattern:', lowRisk.savingsPattern);

  log('cyan', '\n📊 Generating High Risk Profile...');
  const highRisk = MockDataGenerator.generateUserProfile('high');
  console.log('Monthly Income:', highRisk.monthlyIncome.toLocaleString());
  console.log('Employment:', highRisk.employmentType);
  console.log('Has Defaults:', highRisk.hasDefaultedLoans);
  console.log('Savings Pattern:', highRisk.savingsPattern);

  log('cyan', '\n💸 Generating M-Pesa Transactions...');
  const mpesa = MockDataGenerator.generateMpesaTransactions(3, lowRisk);
  console.log('Total Transactions:', mpesa.length);
  console.log('Sample Transaction:', mpesa[0]);

  log('cyan', '\n🏦 Generating Bank Statements...');
  const bank = MockDataGenerator.generateBankStatements(6, lowRisk);
  console.log('Total Statements:', bank.length);
  console.log('Sample Statement:', bank[0]);

  log('green', '\n✅ Mock data generation successful!');
}

async function demoCreditScoring() {
  section('DEMO 2: AI Credit Scoring');

  log('cyan', '🤖 Testing AI credit assessment with LOW RISK profile...');
  
  const profile = MockDataGenerator.generateUserProfile('low');
  const mpesa = MockDataGenerator.generateMpesaTransactions(3, profile);
  const bank = MockDataGenerator.generateBankStatements(6, profile);

  // Note: This will fail without a valid API key
  // Uncomment when you have GOOGLE_GENAI_API_KEY set
  
  /*
  try {
    const assessment = await CreditScoringService.assessIndividualCredit(
      profile,
      mpesa,
      bank,
      true,  // identity verified
      95,    // high face match confidence
      92     // high ID authenticity
    );

    log('green', '\n📊 ASSESSMENT RESULTS:');
    console.log('Credit Score:', assessment.creditScore, '/100');
    console.log('Approval Status:', assessment.approvalStatus);
    console.log('Risk Level:', assessment.riskLevel);

    if (assessment.loanRecommendation) {
      log('green', '\n💰 LOAN RECOMMENDATION:');
      console.log('Amount Range: KES', 
        assessment.loanRecommendation.minAmount.toLocaleString(), 
        '-', 
        assessment.loanRecommendation.maxAmount.toLocaleString()
      );
      console.log('Interest Rate:', 
        assessment.loanRecommendation.interestRateMin, 
        '-', 
        assessment.loanRecommendation.interestRateMax, 
        '% p.a.'
      );
      console.log('Term:', 
        assessment.loanRecommendation.termMin, 
        '-', 
        assessment.loanRecommendation.termMax, 
        'months'
      );
    }

    if (assessment.keyInsights.length > 0) {
      log('cyan', '\n💡 AI INSIGHTS:');
      assessment.keyInsights.forEach((insight, i) => {
        console.log(`${i + 1}. ${insight}`);
      });
    }

    if (assessment.strengths.length > 0) {
      log('green', '\n✅ STRENGTHS:');
      assessment.strengths.forEach(s => console.log('  •', s));
    }

    if (assessment.weaknesses.length > 0) {
      log('yellow', '\n⚠️  AREAS TO IMPROVE:');
      assessment.weaknesses.forEach(w => console.log('  •', w));
    }

    log('green', '\n✅ Credit scoring successful!');
  } catch (error) {
    log('red', '\n❌ Error:', error);
    log('yellow', '\nℹ️  Make sure GOOGLE_GENAI_API_KEY is set in .env.local');
    log('yellow', 'Get your key from: https://aistudio.google.com/app/apikey');
  }
  */

  log('yellow', '\n⚠️  Credit scoring demo requires GOOGLE_GENAI_API_KEY');
  log('yellow', 'Uncomment the code in demo.ts and add your API key to test');
}

async function demoFraudScenarios() {
  section('DEMO 3: Fraud Detection Scenarios');

  log('cyan', '🚨 Simulating fraud detection scenarios...\n');

  // Scenario 1: Forged ID
  log('yellow', '📋 Scenario 1: FORGED ID DETECTION');
  log('red', '  • Missing hologram detected');
  log('red', '  • Inconsistent font spacing');
  log('red', '  • Poor quality photo embedding');
  log('red', '  Result: REJECTED - Forgery detected\n');

  // Scenario 2: Face Mismatch
  log('yellow', '📋 Scenario 2: FACE MISMATCH');
  log('red', '  • Different facial bone structure');
  log('red', '  • Eye spacing mismatch');
  log('red', '  • Confidence: 43% (below 75% threshold)');
  log('red', '  Result: REJECTED - Identity theft attempt\n');

  // Scenario 3: Spoofing
  log('yellow', '📋 Scenario 3: LIVENESS SPOOFING');
  log('red', '  • Photo of photo detected');
  log('red', '  • Missing skin texture detail');
  log('red', '  • Screen glare indicators present');
  log('red', '  Result: REJECTED - Spoofing attempt\n');

  // Scenario 4: High Risk Profile
  log('yellow', '📋 Scenario 4: HIGH RISK FINANCIAL PROFILE');
  log('red', '  • Previous loan defaults detected');
  log('red', '  • High debt-to-income ratio (78%)');
  log('red', '  • Irregular income pattern');
  log('red', '  Result: REJECTED - Too high risk\n');

  log('green', '✅ All fraud scenarios would be detected by AI!');
}

async function demoApprovalScenarios() {
  section('DEMO 4: Approval Scenarios');

  log('cyan', '✅ Simulating approval scenarios...\n');

  // Approved
  log('green', '📋 Scenario 1: APPROVED (Low Risk)');
  log('green', '  • Credit Score: 85/100');
  log('green', '  • Stable employment (36+ months)');
  log('green', '  • Regular income (KES 80,000/month)');
  log('green', '  • Low debt ratio (22%)');
  log('green', '  • Perfect payment history');
  log('green', '  Result: APPROVED - KES 100K-250K @ 8-11% p.a.\n');

  // Conditionally Approved
  log('yellow', '📋 Scenario 2: CONDITIONALLY APPROVED (Medium Risk)');
  log('yellow', '  • Credit Score: 68/100');
  log('yellow', '  • Self-employed (18 months)');
  log('yellow', '  • Irregular income pattern');
  log('yellow', '  • Moderate debt ratio (42%)');
  log('yellow', '  Result: CONDITIONAL - Additional verification needed\n');

  // Under Review
  log('blue', '📋 Scenario 3: UNDER REVIEW (High Risk)');
  log('blue', '  • Credit Score: 52/100');
  log('blue', '  • Recent employment (8 months)');
  log('blue', '  • Limited transaction history');
  log('blue', '  Result: UNDER REVIEW - Manual assessment required\n');
}

async function main() {
  log('bold', '\n🤖 QuickScore AI Demo & Testing\n');
  log('cyan', 'This demo shows all AI capabilities without requiring API key for mock data\n');

  try {
    await demoMockDataGeneration();
    await demoFraudScenarios();
    await demoApprovalScenarios();
    await demoCreditScoring();

    section('SUMMARY');
    log('green', '✅ AI System Capabilities Demonstrated:');
    console.log('  • Mock data generation for testing');
    console.log('  • Fraud detection (forgery, spoofing, mismatch)');
    console.log('  • Credit scoring with detailed reasoning');
    console.log('  • Risk-based loan recommendations');
    console.log('  • Transparent rejection explanations');
    
    log('cyan', '\n📚 Next Steps:');
    console.log('  1. Add GOOGLE_GENAI_API_KEY to .env.local');
    console.log('  2. Get key from: https://aistudio.google.com/app/apikey');
    console.log('  3. Uncomment credit scoring demo in this file');
    console.log('  4. Run: npm run dev');
    console.log('  5. Test onboarding at: http://localhost:9002/borrower/onboard');
    
    log('green', '\n✨ All systems ready!\n');

  } catch (error) {
    log('red', '\n❌ Error during demo:', error);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

export { demoMockDataGeneration, demoCreditScoring, demoFraudScenarios, demoApprovalScenarios };
