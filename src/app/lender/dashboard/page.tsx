import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, BarChart, AlertTriangle, CheckCircle } from "lucide-react";
import { ApplicantTable } from "@/components/lender/ApplicantTable";
import { applicants } from "@/lib/data";

export default function LenderDashboard() {
  const totalApplications = applicants.length;
  const autoApproved = applicants.filter(a => a.riskRating === 'Low' && a.fraudFlags === 0).length;
  const forReview = applicants.filter(a => a.riskRating === 'Medium').length;
  const rejected = applicants.filter(a => a.riskRating === 'High').length;

  return (
    <div className="p-4 md:p-8 space-y-8">
      <header className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">Loan Officer Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, here's your application overview.</p>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications Today</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalApplications}</div>
            <p className="text-xs text-muted-foreground">+2 from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Auto-Approved by AI</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{autoApproved}</div>
            <p className="text-xs text-muted-foreground">{Math.round((autoApproved / totalApplications) * 100)}% of total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flagged for Review</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{forReview}</div>
            <p className="text-xs text-muted-foreground">Medium risk profiles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected (Fraud/High Risk)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejected}</div>
            <p className="text-xs text-muted-foreground">High risk or fraud flags</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Incoming Queue</h2>
        <ApplicantTable applicants={applicants} />
      </div>
    </div>
  );
}
