'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Banknote, Landmark, Loader2, Wallet } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function FinancialsPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleConnect = () => {
    setIsAnalyzing(true);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.floor(Math.random() * 10) + 5;
      });
    }, 500);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Step 2: Connect Your Financials</CardTitle>
          <CardDescription>
            Our AI analyzes your transaction history to determine your loan eligibility. This process is secure and private.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isAnalyzing ? (
            <div className="flex flex-col items-center justify-center text-center p-8 space-y-4">
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
              <h3 className="text-xl font-semibold">AI Analysis in Progress...</h3>
              <p className="text-muted-foreground">Analyzing transaction frequency & income stability...</p>
              <Progress value={progress} className="w-full max-w-md" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button onClick={handleConnect} className="text-left">
                <Card className="hover:border-primary hover:shadow-lg transition-all h-full">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-base font-medium">M-Pesa Statement</CardTitle>
                    <Banknote className="h-6 w-6 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Connect your M-Pesa account to upload your latest statement.</p>
                  </CardContent>
                </Card>
              </button>
              <button onClick={handleConnect} className="text-left">
                <Card className="hover:border-primary hover:shadow-lg transition-all h-full">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-base font-medium">Bank Statement</CardTitle>
                    <Landmark className="h-6 w-6 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Upload a PDF of your bank statement for the last 6 months.</p>
                  </CardContent>
                </Card>
              </button>
              <button onClick={handleConnect} className="text-left">
                <Card className="hover:border-primary hover:shadow-lg transition-all h-full">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-base font-medium">Digital Wallet</CardTitle>
                    <Wallet className="h-6 w-6 text-purple-500" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Connect other digital wallets for a comprehensive review.</p>
                  </CardContent>
                </Card>
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end mt-8">
        <Button asChild size="lg" disabled={!isAnalyzing || progress < 100}>
          <Link href="/apply/details">
            Next Step <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
