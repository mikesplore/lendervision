'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, ArrowLeft, AlertCircle, Smartphone, Building } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function IndividualFinancialsPage() {
  const [selectedOption, setSelectedOption] = useState<'mpesa' | 'bank' | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('+254712345678');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // Proceed to success screen
      window.location.href = '/borrower/onboard/individual/assessment';
    }, 2000);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Step 3: Connect Your Finances</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            This helps us analyze your financial activity and generate your credit assessment.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              🔒 <strong>Your data is secure.</strong> We only read transaction data and never store your passwords or account credentials.
            </AlertDescription>
          </Alert>

          <Tabs 
            value={selectedOption || ''} 
            onValueChange={(val) => setSelectedOption(val as 'mpesa' | 'bank' | null)}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="mpesa" className="flex items-center gap-2 data-[state=active]:bg-green-100 data-[state=active]:text-green-700">
                <Smartphone className="h-4 w-4" />
                <span className="hidden sm:inline">M-Pesa</span>
              </TabsTrigger>
              <TabsTrigger value="bank" className="flex items-center gap-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
                <Building className="h-4 w-4" />
                <span className="hidden sm:inline">Bank Account</span>
              </TabsTrigger>
            </TabsList>

            {/* M-Pesa Tab */}
            <TabsContent value="mpesa">
              <Card className="border-green-200 bg-green-50/30">
                <CardContent className="space-y-6 pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-5 w-5 text-green-600" />
                      <h3 className="font-semibold text-green-900">Connect Your M-Pesa Account</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      We'll analyze your M-Pesa transactions from the last 90 days to understand your spending patterns.
                    </p>

                    <div className="space-y-2">
                      <Label htmlFor="mpesa-phone">Phone Number</Label>
                      <Input
                        id="mpesa-phone"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+254712345678"
                        className="border-green-300 focus-visible:ring-green-500"
                      />
                      <p className="text-xs text-muted-foreground">
                        The phone number linked to your M-Pesa account
                      </p>
                    </div>

                    <div className="bg-green-100 border border-green-300 rounded-lg p-4 space-y-2">
                      <p className="text-sm font-medium text-green-900">What we'll access:</p>
                      <ul className="text-sm text-green-800 space-y-1">
                        <li>✓ Last 90 days of transaction history</li>
                        <li>✓ Daily transaction patterns</li>
                        <li>✓ Average monthly transaction volume</li>
                        <li>✓ Balance patterns and trends</li>
                      </ul>
                    </div>

                    <Alert className="border-green-300 bg-green-50">
                      <AlertCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        You'll be redirected to M-Pesa to authorize this connection. We never see your PIN.
                      </AlertDescription>
                    </Alert>

                    <Button 
                      onClick={handleConnect}
                      disabled={!phoneNumber || loading}
                      className="w-full bg-green-600 hover:bg-green-700"
                      size="lg"
                    >
                      {loading ? 'Connecting...' : 'Connect M-Pesa'} 
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Bank Account Tab */}
            <TabsContent value="bank">
              <Card className="border-blue-200 bg-blue-50/30">
                <CardContent className="space-y-6 pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Building className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold text-blue-900">Connect Your Bank Account</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      We'll analyze 6-12 months of bank statements to understand your financial health.
                    </p>

                    <div className="space-y-2">
                      <Label htmlFor="bank-name">Bank Name</Label>
                      <Input
                        id="bank-name"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        placeholder="e.g., KCB, Equity, I&M Bank"
                        className="border-blue-300 focus-visible:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="account-number">Account Number</Label>
                      <Input
                        id="account-number"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        placeholder="Your account number"
                        className="border-blue-300 focus-visible:ring-blue-500"
                      />
                    </div>

                    <div className="bg-blue-100 border border-blue-300 rounded-lg p-4 space-y-2">
                      <p className="text-sm font-medium text-blue-900">What we'll access:</p>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>✓ 6-12 months of bank statements</li>
                        <li>✓ Monthly income patterns</li>
                        <li>✓ Expense trends</li>
                        <li>✓ Cash balance health</li>
                      </ul>
                    </div>

                    <Alert className="border-blue-300 bg-blue-50">
                      <AlertCircle className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-blue-800">
                        You'll be redirected to your bank to authorize this connection. Your credentials are never stored.
                      </AlertDescription>
                    </Alert>

                    <Button 
                      onClick={handleConnect}
                      disabled={!bankName || !accountNumber || loading}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      size="lg"
                    >
                      {loading ? 'Connecting...' : 'Connect Bank Account'} 
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Skip Option */}
          <div className="text-center pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-3">
              Want to skip for now? We'll still generate an assessment, but with limited data.
            </p>
            <Button variant="ghost" asChild>
              <Link href="/borrower/onboard/individual/assessment">
                Skip and Continue
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <Button variant="outline" asChild>
          <Link href="/borrower/onboard/individual/details">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>
    </div>
  );
}
