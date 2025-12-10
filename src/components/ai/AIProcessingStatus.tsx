/**
 * AI Processing Status Component
 * Shows real-time AI processing steps with animations
 */

'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, AlertCircle, Loader2, Shield, FileCheck, UserCheck, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface ProcessingStep {
  step: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  message: string;
  timestamp: Date;
}

interface AIProcessingStatusProps {
  steps: ProcessingStep[];
  currentProgress: number;
  currentAction: string;
  estimatedTimeRemaining?: number;
}

const stepIcons: Record<string, any> = {
  'Liveness Detection': Shield,
  'ID Verification': FileCheck,
  'Face Matching': UserCheck,
  'Financial Analysis': TrendingUp,
  'Credit Assessment': TrendingUp,
  'Business Registration': FileCheck,
  'Tax Verification': FileCheck,
};

export function AIProcessingStatus({
  steps,
  currentProgress,
  currentAction,
  estimatedTimeRemaining
}: AIProcessingStatusProps) {
  const [displayedProgress, setDisplayedProgress] = useState(0);

  // Smooth progress animation
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayedProgress((prev) => {
        if (prev >= currentProgress) {
          clearInterval(interval);
          return currentProgress;
        }
        return prev + 1;
      });
    }, 20);

    return () => clearInterval(interval);
  }, [currentProgress]);

  const getStatusIcon = (status: ProcessingStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'processing':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Circle className="h-5 w-5 text-gray-300" />;
    }
  };

  const getStatusBadge = (status: ProcessingStep['status']) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'processing':
        return <Badge className="bg-blue-500">Processing</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>AI Processing</CardTitle>
              <CardDescription>{currentAction}</CardDescription>
            </div>
            {estimatedTimeRemaining && estimatedTimeRemaining > 0 && (
              <Badge variant="outline">
                ~{estimatedTimeRemaining}s remaining
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Progress value={displayedProgress} className="h-3" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{displayedProgress}% Complete</span>
              <span className="font-medium text-foreground">{currentAction}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Processing Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Verification Steps</CardTitle>
          <CardDescription>
            Our AI is analyzing your information in real-time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {steps.map((step, index) => {
              const Icon = stepIcons[step.step] || Shield;
              
              return (
                <div
                  key={index}
                  className={`flex items-start gap-4 p-4 rounded-lg border transition-all ${
                    step.status === 'processing'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                      : step.status === 'completed'
                      ? 'border-green-500 bg-green-50 dark:bg-green-950'
                      : step.status === 'failed'
                      ? 'border-red-500 bg-red-50 dark:bg-red-950'
                      : 'border-gray-200 dark:border-gray-800'
                  }`}
                >
                  {/* Status Icon */}
                  <div className="mt-0.5">{getStatusIcon(step.status)}</div>

                  {/* Step Icon */}
                  <div className="mt-0.5">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm">{step.step}</h4>
                      {getStatusBadge(step.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">{step.message}</p>
                    {step.status !== 'pending' && (
                      <p className="text-xs text-muted-foreground">
                        {new Date(step.timestamp).toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
        <Shield className="h-5 w-5 text-blue-500 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-blue-900 dark:text-blue-100">
            Secure AI Processing
          </p>
          <p className="text-blue-700 dark:text-blue-300 mt-1">
            All data is encrypted and processed securely. Our AI uses advanced machine learning 
            to detect fraud and ensure accurate verification.
          </p>
        </div>
      </div>
    </div>
  );
}
