/**
 * AI Onboarding Orchestrator
 * Manages the complete AI-powered verification and assessment flow
 */

import { FaceVerificationService } from './face-verification';
import { IDVerificationService } from './id-verification';
import { CreditScoringService } from './credit-scoring';
import { MockDataGenerator } from './mock-data-generator';

export interface OnboardingProgress {
  step: 'identity' | 'documents' | 'financial' | 'assessment' | 'complete';
  progress: number; // 0-100
  currentAction: string;
  estimatedTimeRemaining: number; // seconds
}

export interface OnboardingResult {
  success: boolean;
  userId: string;
  assessmentResult: any;
  processingSteps: {
    step: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    message: string;
    timestamp: Date;
  }[];
}

export class AIOnboardingOrchestrator {
  private progressCallback?: (progress: OnboardingProgress) => void;
  private processingSteps: OnboardingResult['processingSteps'] = [];

  constructor(progressCallback?: (progress: OnboardingProgress) => void) {
    this.progressCallback = progressCallback;
  }

  /**
   * Process individual borrower onboarding
   */
  async processIndividualOnboarding(data: {
    livenessImage: string; // base64
    idFrontImage: string; // base64
    idBackImage: string; // base64
    personalInfo: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      employmentType: string;
      monthlyIncome: number;
    };
    financialConnection: {
      type: 'mpesa' | 'bank' | 'skip';
      accountInfo?: string;
    };
  }): Promise<OnboardingResult> {
    this.updateProgress('identity', 10, 'Starting identity verification...', 45);

    // Step 1: Liveness Detection
    this.addProcessingStep('Liveness Detection', 'processing', 'Analyzing live selfie for spoofing...');
    const livenessResult = await FaceVerificationService.performLivenessCheck(data.livenessImage);
    
    if (!livenessResult.isPassed) {
      this.addProcessingStep('Liveness Detection', 'failed', 
        `Liveness check failed: ${livenessResult.recommendations.join(', ')}`);
      return this.createRejectionResult(
        'Liveness verification failed',
        `We couldn't verify that you're a real person. ${livenessResult.recommendations.join(' ')}`
      );
    }
    
    this.addProcessingStep('Liveness Detection', 'completed', 
      `Passed with ${livenessResult.confidence}% confidence`);
    this.updateProgress('identity', 25, 'Verifying ID document...', 35);

    // Step 2: ID Document Verification
    this.addProcessingStep('ID Verification', 'processing', 'Analyzing ID for authenticity...');
    const idResult = await IDVerificationService.verifyIDDocument(
      data.idFrontImage,
      data.idBackImage
    );

    if (!idResult.isAuthentic || idResult.forgeryDetected) {
      this.addProcessingStep('ID Verification', 'failed',
        `ID verification failed: ${idResult.forgeryIndicators.join(', ')}`);
      return this.createRejectionResult(
        'ID document verification failed',
        idResult.forgeryDetected 
          ? `FORGERY DETECTED: ${idResult.forgeryIndicators.join('. ')}. Please provide a genuine ID document.`
          : `ID verification issues: ${idResult.warnings.join('. ')}`
      );
    }

    this.addProcessingStep('ID Verification', 'completed',
      `ID verified with ${idResult.confidence}% confidence`);
    this.updateProgress('identity', 40, 'Matching face with ID photo...', 25);

    // Step 3: Face Matching
    this.addProcessingStep('Face Matching', 'processing', 'Comparing your face with ID photo...');
    const faceMatchResult = await FaceVerificationService.verifyFaceMatch(
      data.livenessImage,
      data.idFrontImage
    );

    if (!faceMatchResult.isMatch || faceMatchResult.confidence < 75) {
      this.addProcessingStep('Face Matching', 'failed',
        `Face mismatch: ${faceMatchResult.reasons.join(', ')}`);
      return this.createRejectionResult(
        'Face verification failed',
        `The face in your selfie doesn't match the ID photo. ${faceMatchResult.reasons.join('. ')}. ${faceMatchResult.fraudIndicators.length > 0 ? 'FRAUD INDICATORS: ' + faceMatchResult.fraudIndicators.join('. ') : ''}`
      );
    }

    this.addProcessingStep('Face Matching', 'completed',
      `Face matched with ${faceMatchResult.confidence}% confidence`);
    this.updateProgress('financial', 60, 'Analyzing financial data...', 20);

    // Step 4: Generate Mock Financial Data
    this.addProcessingStep('Financial Analysis', 'processing', 'Fetching and analyzing financial data...');
    
    const userProfile = MockDataGenerator.generateUserProfile('low'); // TODO: Make dynamic
    userProfile.monthlyIncome = data.personalInfo.monthlyIncome;
    userProfile.employmentType = data.personalInfo.employmentType as any;

    const mpesaTransactions = data.financialConnection.type === 'mpesa' 
      ? MockDataGenerator.generateMpesaTransactions(3, userProfile)
      : [];
    
    const bankStatements = data.financialConnection.type === 'bank'
      ? MockDataGenerator.generateBankStatements(6, userProfile)
      : [];

    this.addProcessingStep('Financial Analysis', 'completed',
      `Analyzed ${mpesaTransactions.length + bankStatements.length} transactions`);
    this.updateProgress('assessment', 80, 'Calculating credit score...', 15);

    // Step 5: Credit Assessment
    this.addProcessingStep('Credit Assessment', 'processing', 'AI is evaluating your creditworthiness...');
    
    const creditAssessment = await CreditScoringService.assessIndividualCredit(
      userProfile,
      mpesaTransactions,
      bankStatements,
      true,
      faceMatchResult.confidence,
      idResult.confidence
    );

    this.addProcessingStep('Credit Assessment', 'completed',
      `Assessment complete: Score ${creditAssessment.creditScore}/100`);
    this.updateProgress('complete', 100, 'Onboarding complete!', 0);

    return {
      success: creditAssessment.approvalStatus !== 'rejected',
      userId: 'USER_' + Date.now(),
      assessmentResult: creditAssessment,
      processingSteps: this.processingSteps
    };
  }

  /**
   * Process business borrower onboarding
   */
  async processBusinessOnboarding(data: {
    businessInfo: {
      name: string;
      registrationNumber: string;
      yearsInOperation: number;
      industry: string;
      employeeCount: string;
      monthlyRevenue: number;
    };
    documents: {
      registrationCert: string; // base64
      taxCert: string; // base64
      addressProof?: string; // base64
    };
    representative: {
      name: string;
      idNumber: string;
      relationship: string;
    };
    financialConnection: {
      type: 'till' | 'bank' | 'manual';
      accountInfo?: string;
    };
  }): Promise<OnboardingResult> {
    this.updateProgress('documents', 15, 'Verifying business documents...', 40);

    // Step 1: Verify Registration Certificate
    this.addProcessingStep('Business Registration', 'processing', 'Verifying business registration...');
    const regResult = await IDVerificationService.verifyBusinessDocument(
      data.documents.registrationCert,
      'registration'
    );

    if (!regResult.isAuthentic) {
      this.addProcessingStep('Business Registration', 'failed', 'Registration verification failed');
      return this.createRejectionResult(
        'Business registration verification failed',
        `Registration document issues: ${regResult.forgeryIndicators.join('. ')}`
      );
    }

    this.addProcessingStep('Business Registration', 'completed', 'Registration verified');
    this.updateProgress('documents', 35, 'Verifying tax documents...', 30);

    // Step 2: Verify Tax Certificate
    this.addProcessingStep('Tax Verification', 'processing', 'Verifying KRA PIN certificate...');
    const taxResult = await IDVerificationService.verifyBusinessDocument(
      data.documents.taxCert,
      'tax'
    );

    if (!taxResult.isAuthentic) {
      this.addProcessingStep('Tax Verification', 'failed', 'Tax certificate verification failed');
      return this.createRejectionResult(
        'Tax certificate verification failed',
        `Tax document issues: ${taxResult.warnings.join('. ')}`
      );
    }

    this.addProcessingStep('Tax Verification', 'completed', 'Tax compliance verified');
    this.updateProgress('financial', 55, 'Analyzing business financials...', 25);

    // Step 3: Generate Mock Financial Data
    this.addProcessingStep('Financial Analysis', 'processing', 'Analyzing business transactions...');
    
    const businessProfile = MockDataGenerator.generateUserProfile('medium');
    const transactions = MockDataGenerator.generateMpesaTransactions(6, businessProfile);
    const statements = MockDataGenerator.generateBankStatements(12, businessProfile);

    this.addProcessingStep('Financial Analysis', 'completed',
      `Analyzed ${transactions.length + statements.length} business transactions`);
    this.updateProgress('assessment', 80, 'Calculating business credit score...', 15);

    // Step 4: Business Credit Assessment
    this.addProcessingStep('Credit Assessment', 'processing', 'AI is evaluating business creditworthiness...');
    
    const creditAssessment = await CreditScoringService.assessBusinessCredit(
      data.businessInfo,
      { transactions, statements },
      true,
      (regResult.confidence + taxResult.confidence) / 2
    );

    this.addProcessingStep('Credit Assessment', 'completed',
      `Business assessment complete: Score ${creditAssessment.creditScore}/100`);
    this.updateProgress('complete', 100, 'Business onboarding complete!', 0);

    return {
      success: creditAssessment.approvalStatus !== 'rejected',
      userId: 'BIZ_' + Date.now(),
      assessmentResult: creditAssessment,
      processingSteps: this.processingSteps
    };
  }

  /**
   * Update progress and notify callback
   */
  private updateProgress(
    step: OnboardingProgress['step'],
    progress: number,
    action: string,
    timeRemaining: number
  ) {
    if (this.progressCallback) {
      this.progressCallback({
        step,
        progress,
        currentAction: action,
        estimatedTimeRemaining: timeRemaining
      });
    }
  }

  /**
   * Add processing step to log
   */
  private addProcessingStep(
    step: string,
    status: 'pending' | 'processing' | 'completed' | 'failed',
    message: string
  ) {
    this.processingSteps.push({
      step,
      status,
      message,
      timestamp: new Date()
    });
  }

  /**
   * Create rejection result
   */
  private createRejectionResult(title: string, message: string): OnboardingResult {
    return {
      success: false,
      userId: '',
      assessmentResult: {
        creditScore: 0,
        approvalStatus: 'rejected',
        rejectionReasons: [message],
        riskLevel: 'very-high'
      },
      processingSteps: this.processingSteps
    };
  }
}
