'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, AlertCircle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function LenderInfoPage() {
  const [formData, setFormData] = useState({
    institutionName: 'FastCredit Finance Ltd',
    registrationNumber: 'REG/2023/12345',
    country: 'Kenya',
    businessType: 'microfinance',
    website: 'www.fastcredit.co.ke',
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Welcome, Lender!</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Let's set up your lending institution on QuickScore
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              We'll verify your institution and set you up to start funding loans. The process typically takes 2-5 business days.
            </AlertDescription>
          </Alert>

          {/* Institution Name */}
          <div className="space-y-2">
            <Label htmlFor="institutionName">Institution Name *</Label>
            <Input
              id="institutionName"
              value={formData.institutionName}
              onChange={(e) => handleChange('institutionName', e.target.value)}
              placeholder="e.g., FastCredit Finance Ltd"
            />
            <p className="text-xs text-muted-foreground">Your legal business name</p>
          </div>

          {/* Registration Number */}
          <div className="space-y-2">
            <Label htmlFor="registrationNumber">Registration Number *</Label>
            <Input
              id="registrationNumber"
              value={formData.registrationNumber}
              onChange={(e) => handleChange('registrationNumber', e.target.value)}
              placeholder="e.g., REG/2023/12345"
            />
            <p className="text-xs text-muted-foreground">Business registration number</p>
          </div>

          {/* Country & Business Type */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country">Country of Operation *</Label>
              <Select value={formData.country} onValueChange={(value) => handleChange('country', value)}>
                <SelectTrigger id="country">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Kenya">Kenya</SelectItem>
                  <SelectItem value="Uganda">Uganda</SelectItem>
                  <SelectItem value="Tanzania">Tanzania</SelectItem>
                  <SelectItem value="Rwanda">Rwanda</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessType">Institution Type *</Label>
              <Select value={formData.businessType} onValueChange={(value) => handleChange('businessType', value)}>
                <SelectTrigger id="businessType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank">Commercial Bank</SelectItem>
                  <SelectItem value="microfinance">Microfinance Institution (MFI)</SelectItem>
                  <SelectItem value="p2p">P2P Lender</SelectItem>
                  <SelectItem value="fintech">Fintech Lender</SelectItem>
                  <SelectItem value="credit-union">Credit Union / SACCO</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Website */}
          <div className="space-y-2">
            <Label htmlFor="website">Website (Optional)</Label>
            <Input
              id="website"
              type="url"
              value={formData.website}
              onChange={(e) => handleChange('website', e.target.value)}
              placeholder="www.yourcompany.com"
            />
            <p className="text-xs text-muted-foreground">Helps us verify your institution</p>
          </div>

          {/* Timeline */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-blue-900">Onboarding Timeline</h4>
                <ol className="space-y-2 text-sm text-blue-900">
                  <li><strong>Step 1:</strong> Institution Info (this page)</li>
                  <li><strong>Step 2:</strong> Upload Lending Certificate (5-10 min)</li>
                  <li><strong>Step 3:</strong> Admin Profile Setup (5 min)</li>
                  <li><strong>Step 4:</strong> Configure Loan Products (10-15 min)</li>
                  <li><strong>Step 5:</strong> Compliance Review (2-5 business days)</li>
                  <li><strong>Step 6:</strong> Go Live & Start Lending!</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-end mt-8">
        <Button asChild size="lg" className="group">
          <Link href="/lender/onboard/certificate">
            Next Step <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
