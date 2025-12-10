'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import Link from 'next/link';

// Mock data for lender dashboard
const mockLenderData = {
  institutionInfo: {
    name: 'QuickScore Lending',
    email: 'contact@quickscore.com',
    phone: '+254700123456',
    registrationNumber: 'REG-2024-001',
  },
  metrics: {
    totalApplications: 156,
    autoApproved: 89,
    flagged: 42,
    rejected: 25,
  },
};

export default function LenderDashboard() {
  const { institutionInfo, metrics } = mockLenderData;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Lender Dashboard</h1>
              <p className="text-sm text-muted-foreground">{institutionInfo.name}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Applications</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalApplications}</div>
              <p className="text-xs text-muted-foreground mt-1">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Auto-Approved</CardTitle>
              <CheckCircle className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{metrics.autoApproved}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {metrics.totalApplications > 0 
                  ? `${((metrics.autoApproved / metrics.totalApplications) * 100).toFixed(1)}% of total`
                  : '0% of total'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Flagged for Review</CardTitle>
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{metrics.flagged}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {metrics.totalApplications > 0 
                  ? `${((metrics.flagged / metrics.totalApplications) * 100).toFixed(1)}% of total`
                  : '0% of total'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Rejected</CardTitle>
              <XCircle className="w-4 h-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{metrics.rejected}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {metrics.totalApplications > 0 
                  ? `${((metrics.rejected / metrics.totalApplications) * 100).toFixed(1)}% of total`
                  : '0% of total'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Applications Queue */}
        <Card>
          <CardHeader>
            <CardTitle>Application Queue</CardTitle>
            <CardDescription>Recent loan applications awaiting review</CardDescription>
          </CardHeader>
          <CardContent>
            {metrics.totalApplications === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Users className="w-12 h-12 text-slate-300 mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No Applications Yet</h3>
                <p className="text-slate-600 max-w-md">
                  You haven't received any loan applications yet. Applications will appear here when borrowers submit their requests.
                </p>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Application list will be displayed here</p>
                <p className="text-sm mt-2">Feature coming soon</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Institution Info */}
        <Card>
          <CardHeader>
            <CardTitle>Institution Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Institution Name</p>
                <p className="font-semibold">{institutionInfo.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-semibold">{institutionInfo.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-semibold">{institutionInfo.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Registration Number</p>
                <p className="font-semibold">{institutionInfo.registrationNumber}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
