'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Check, Loader2, AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ProcessingStep = {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'processing' | 'complete' | 'error';
  progress?: number;
  details?: string;
  error?: string;
};

export type AIProcessingStatus = {
  stage: 'identity' | 'financial' | 'assessment' | 'complete';
  currentStep: string;
  steps: ProcessingStep[];
  overallProgress: number;
  result?: any;
  error?: string;
};

interface AIProcessingIndicatorProps {
  status: AIProcessingStatus;
  onComplete?: (result: any) => void;
  onError?: (error: string) => void;
}

export function AIProcessingIndicator({ status, onComplete, onError }: AIProcessingIndicatorProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    // Animate progress bar
    const timer = setTimeout(() => {
      setAnimatedProgress(status.overallProgress);
    }, 100);
    return () => clearTimeout(timer);
  }, [status.overallProgress]);

  useEffect(() => {
    if (status.stage === 'complete' && status.result && onComplete) {
      onComplete(status.result);
    }
  }, [status.stage, status.result, onComplete]);

  useEffect(() => {
    if (status.error && onError) {
      onError(status.error);
    }
  }, [status.error, onError]);

  const getStageTitle = () => {
    switch (status.stage) {
      case 'identity': return 'Verifying Identity';
      case 'financial': return 'Analyzing Financial Data';
      case 'assessment': return 'Generating Credit Assessment';
      case 'complete': return 'Assessment Complete';
      default: return 'Processing';
    }
  };

  const getStageDescription = () => {
    switch (status.stage) {
      case 'identity': 
        return 'Our AI is analyzing your photos and documents to verify your identity.';
      case 'financial': 
        return 'Analyzing your transaction history to understand your financial behavior.';
      case 'assessment': 
        return 'Calculating your credit score and generating loan recommendations.';
      case 'complete': 
        return 'Your application has been processed successfully!';
      default: 
        return 'Processing your application...';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">{getStageTitle()}</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              {getStageDescription()}
            </p>
          </div>
          {status.stage !== 'complete' && !status.error && (
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          )}
          {status.stage === 'complete' && (
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="h-6 w-6 text-green-600" />
            </div>
          )}
          {status.error && (
            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
              <X className="h-6 w-6 text-red-600" />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-medium">{Math.round(animatedProgress)}%</span>
          </div>
          <Progress value={animatedProgress} className="h-2" />
        </div>

        {/* Individual Steps */}
        <div className="space-y-3">
          {status.steps.map((step, index) => (
            <div
              key={step.id}
              className={cn(
                'p-4 rounded-lg border transition-all',
                step.status === 'complete' && 'bg-green-50 border-green-200',
                step.status === 'processing' && 'bg-blue-50 border-blue-200',
                step.status === 'error' && 'bg-red-50 border-red-200',
                step.status === 'pending' && 'bg-muted/50 border-border'
              )}
            >
              <div className="flex items-start gap-3">
                {/* Status Icon */}
                <div className="mt-0.5">
                  {step.status === 'complete' && (
                    <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                  {step.status === 'processing' && (
                    <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center">
                      <Loader2 className="h-4 w-4 text-white animate-spin" />
                    </div>
                  )}
                  {step.status === 'error' && (
                    <div className="h-6 w-6 rounded-full bg-red-500 flex items-center justify-center">
                      <AlertCircle className="h-4 w-4 text-white" />
                    </div>
                  )}
                  {step.status === 'pending' && (
                    <div className="h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600">{index + 1}</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h4 className={cn(
                    'font-medium text-sm',
                    step.status === 'complete' && 'text-green-900',
                    step.status === 'processing' && 'text-blue-900',
                    step.status === 'error' && 'text-red-900',
                    step.status === 'pending' && 'text-muted-foreground'
                  )}>
                    {step.title}
                  </h4>
                  <p className={cn(
                    'text-xs mt-1',
                    step.status === 'complete' && 'text-green-700',
                    step.status === 'processing' && 'text-blue-700',
                    step.status === 'error' && 'text-red-700',
                    step.status === 'pending' && 'text-muted-foreground'
                  )}>
                    {step.description}
                  </p>
                  
                  {/* Details or Error */}
                  {step.details && step.status === 'complete' && (
                    <p className="text-xs text-green-600 mt-2 font-medium">
                      ✓ {step.details}
                    </p>
                  )}
                  {step.error && step.status === 'error' && (
                    <p className="text-xs text-red-600 mt-2 font-medium">
                      ✗ {step.error}
                    </p>
                  )}
                  
                  {/* Step Progress */}
                  {step.status === 'processing' && step.progress !== undefined && (
                    <div className="mt-2">
                      <Progress value={step.progress} className="h-1" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Global Error */}
        {status.error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-900 text-sm">Processing Error</h4>
                <p className="text-sm text-red-700 mt-1">{status.error}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Helper function to create initial processing status
export function createInitialStatus(stage: AIProcessingStatus['stage']): AIProcessingStatus {
  const identitySteps: ProcessingStep[] = [
    {
      id: 'liveness',
      title: 'Liveness Detection',
      description: 'Verifying you are a real person',
      status: 'pending',
    },
    {
      id: 'id-analysis',
      title: 'ID Document Analysis',
      description: 'Checking document authenticity',
      status: 'pending',
    },
    {
      id: 'face-match',
      title: 'Face Matching',
      description: 'Comparing your face with ID photo',
      status: 'pending',
    },
  ];

  const financialSteps: ProcessingStep[] = [
    {
      id: 'data-fetch',
      title: 'Fetching Transaction Data',
      description: 'Retrieving your M-Pesa transaction history',
      status: 'pending',
    },
    {
      id: 'income-analysis',
      title: 'Income Analysis',
      description: 'Analyzing income patterns and stability',
      status: 'pending',
    },
    {
      id: 'spending-analysis',
      title: 'Spending Behavior',
      description: 'Evaluating spending patterns and habits',
      status: 'pending',
    },
    {
      id: 'debt-analysis',
      title: 'Debt Assessment',
      description: 'Analyzing existing debt obligations',
      status: 'pending',
    },
  ];

  const assessmentSteps: ProcessingStep[] = [
    {
      id: 'score-calculation',
      title: 'Credit Score Calculation',
      description: 'Computing your creditworthiness score',
      status: 'pending',
    },
    {
      id: 'risk-assessment',
      title: 'Risk Analysis',
      description: 'Evaluating default probability and risk factors',
      status: 'pending',
    },
    {
      id: 'loan-recommendation',
      title: 'Loan Recommendation',
      description: 'Generating personalized loan offers',
      status: 'pending',
    },
  ];

  let steps: ProcessingStep[] = [];
  if (stage === 'identity') steps = identitySteps;
  else if (stage === 'financial') steps = financialSteps;
  else if (stage === 'assessment') steps = assessmentSteps;

  return {
    stage,
    currentStep: steps[0]?.id || '',
    steps,
    overallProgress: 0,
  };
}
