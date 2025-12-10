'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, User, Building2, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

// Mock applicants data
const mockApplicants = [
  {
    id: 'APP-2024-156',
    name: 'Jane Wanjiku',
    type: 'Individual',
    email: 'jane.w@email.com',
    phone: '+254712345678',
    amount: 75000,
    creditScore: 82,
    status: 'pending',
    submittedDate: '2024-12-10',
    aiRecommendation: 'Approve',
  },
  {
    id: 'APP-2024-155',
    name: 'Tech Solutions Ltd',
    type: 'Business',
    email: 'info@techsolutions.co.ke',
    phone: '+254700123456',
    amount: 500000,
    creditScore: 85,
    status: 'flagged',
    submittedDate: '2024-12-09',
    aiRecommendation: 'Manual Review',
    flagReason: 'High debt-to-income ratio',
  },
  {
    id: 'APP-2024-154',
    name: 'John Kamau',
    type: 'Individual',
    email: 'j.kamau@email.com',
    phone: '+254722334455',
    amount: 100000,
    creditScore: 78,
    status: 'approved',
    submittedDate: '2024-12-08',
    aiRecommendation: 'Approve',
  },
  {
    id: 'APP-2024-153',
    name: 'Green Farm Co-op',
    type: 'Business',
    email: 'admin@greenfarm.co.ke',
    phone: '+254733445566',
    amount: 750000,
    creditScore: 68,
    status: 'flagged',
    submittedDate: '2024-12-08',
    aiRecommendation: 'Manual Review',
    flagReason: 'Inconsistent revenue pattern',
  },
  {
    id: 'APP-2024-152',
    name: 'Mary Akinyi',
    type: 'Individual',
    email: 'mary.a@email.com',
    phone: '+254744556677',
    amount: 50000,
    creditScore: 45,
    status: 'rejected',
    submittedDate: '2024-12-07',
    aiRecommendation: 'Reject',
    rejectionReason: 'Identity verification failed - forged document detected',
  },
  {
    id: 'APP-2024-151',
    name: 'Samuel Omondi',
    type: 'Individual',
    email: 's.omondi@email.com',
    phone: '+254755667788',
    amount: 120000,
    creditScore: 88,
    status: 'approved',
    submittedDate: '2024-12-07',
    aiRecommendation: 'Approve',
  },
  {
    id: 'APP-2024-150',
    name: 'Urban Retail Ltd',
    type: 'Business',
    email: 'contact@urbanretail.co.ke',
    phone: '+254766778899',
    amount: 950000,
    creditScore: 79,
    status: 'approved',
    submittedDate: '2024-12-06',
    aiRecommendation: 'Approve',
  },
  {
    id: 'APP-2024-149',
    name: 'Grace Njeri',
    type: 'Individual',
    email: 'grace.n@email.com',
    phone: '+254777889900',
    amount: 65000,
    creditScore: 72,
    status: 'pending',
    submittedDate: '2024-12-06',
    aiRecommendation: 'Approve',
  },
];

export default function ApplicantsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredApplicants = mockApplicants.filter((applicant) => {
    const matchesSearch = applicant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      applicant.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || applicant.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'flagged':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Loan Applicants</h1>
          <p className="text-muted-foreground mt-1">Review and manage loan applications</p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterStatus === 'all' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('all')}
              size="sm"
            >
              All
            </Button>
            <Button
              variant={filterStatus === 'pending' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('pending')}
              size="sm"
            >
              Pending
            </Button>
            <Button
              variant={filterStatus === 'flagged' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('flagged')}
              size="sm"
            >
              Flagged
            </Button>
            <Button
              variant={filterStatus === 'approved' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('approved')}
              size="sm"
            >
              Approved
            </Button>
            <Button
              variant={filterStatus === 'rejected' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('rejected')}
              size="sm"
            >
              Rejected
            </Button>
          </div>
        </div>

        {/* Applicants List */}
        <Card>
          <CardHeader>
            <CardTitle>Applications ({filteredApplicants.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredApplicants.map((applicant) => (
                <div key={applicant.id} className="border rounded-lg p-4 hover:bg-slate-50 transition">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                        {applicant.type === 'Business' ? (
                          <Building2 className="w-5 h-5 text-slate-600" />
                        ) : (
                          <User className="w-5 h-5 text-slate-600" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{applicant.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {applicant.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{applicant.id} • {applicant.submittedDate}</p>
                        <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                          <span>{applicant.email}</span>
                          <span>{applicant.phone}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(applicant.status)}
                      <Badge className={
                        applicant.status === 'approved' ? 'bg-green-100 text-green-700' :
                        applicant.status === 'flagged' ? 'bg-yellow-100 text-yellow-700' :
                        applicant.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }>
                        {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Loan Amount</p>
                      <p className="font-semibold">KES {applicant.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Credit Score</p>
                      <p className="font-semibold">{applicant.creditScore}/100</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">AI Recommendation</p>
                      <p className="font-semibold text-sm">{applicant.aiRecommendation}</p>
                    </div>
                  </div>

                  {applicant.flagReason && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mb-3">
                      <p className="text-xs text-yellow-800">
                        <strong>Flag Reason:</strong> {applicant.flagReason}
                      </p>
                    </div>
                  )}

                  {applicant.rejectionReason && (
                    <div className="bg-red-50 border border-red-200 rounded p-2 mb-3">
                      <p className="text-xs text-red-800">
                        <strong>Rejection Reason:</strong> {applicant.rejectionReason}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Link href={`/lender/applicants/${applicant.id}`} className="flex-1">
                      <Button size="sm" variant="outline" className="w-full">View Full Profile</Button>
                    </Link>
                    {applicant.status === 'pending' || applicant.status === 'flagged' ? (
                      <>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">Approve</Button>
                        <Button size="sm" variant="destructive">Reject</Button>
                      </>
                    ) : null}
                  </div>
                </div>
              ))}

              {filteredApplicants.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No applicants found matching your criteria.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
