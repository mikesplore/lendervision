import { applicants } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  Mail,
  MessageSquare,
  Percent,
  Phone,
  ShieldCheck,
  ShieldX,
  ThumbsDown,
  ThumbsUp,
} from 'lucide-react';
import { EligibilityGauge } from '@/components/lender/EligibilityGauge';
import { IncomeChart } from '@/components/lender/IncomeChart';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

export default function ApplicantProfilePage({ params }: { params: { id: string } }) {
  const applicant = applicants.find((a) => a.id === params.id);
  
  if (!applicant) {
    notFound();
  }

  const applicantImage = PlaceHolderImages.find((p) => p.id === applicant.photoId);

  const riskRatingLower = applicant.aiScores.riskRating.toLowerCase();
  
  const getRiskBadgeClass = () => {
    switch (riskRatingLower) {
      case 'low risk':
        return 'bg-accent/20 text-accent';
      case 'medium risk':
        return 'bg-chart-3/20 text-chart-3';
      case 'high risk':
        return 'bg-destructive/20 text-destructive';
      default:
        return 'bg-secondary';
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8">
      <header className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/lender/dashboard"><ArrowLeft /></Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold font-headline">Applicant: {applicant.name}</h1>
          <p className="text-muted-foreground">ID: {applicant.id}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Panel A: Left */}
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader className="items-center text-center">
              <Avatar className="w-24 h-24 mb-4">
                {applicantImage && <AvatarImage src={applicantImage.imageUrl} alt={applicant.name} data-ai-hint={applicantImage.imageHint} />}
                <AvatarFallback>{applicant.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl">{applicant.name}</CardTitle>
              <div className="text-muted-foreground space-y-1 text-sm pt-2">
                <div className="flex items-center justify-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>{applicant.email}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{applicant.phone}</span>
                </div>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6 space-y-6 text-center">
              <div className="flex justify-center">
                <EligibilityGauge score={applicant.aiScores.loanEligibility.score} tier={applicant.aiScores.loanEligibility.tier} />
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">AI Risk Score</h4>
                <Badge className={cn('text-sm capitalize', getRiskBadgeClass())}>{riskRatingLower}</Badge>
                <p className="text-sm text-muted-foreground">Expected Default Probability: <span className="font-semibold text-foreground">{applicant.aiScores.defaultProbability}%</span></p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Panel B: Center */}
        <div className="lg:col-span-6 space-y-6">
          <Tabs defaultValue="insights">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="insights">AI Insights & Fraud Alerts</TabsTrigger>
              <TabsTrigger value="financials">Financials & Affordability</TabsTrigger>
            </TabsList>
            <TabsContent value="insights">
              <Card>
                <CardHeader>
                  <CardTitle>AI Analysis Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h4 className="font-semibold mb-3">Fraud Detection</h4>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-3">
                                {applicant.fraudAnalysis.livenessDetection ? <ShieldCheck className="h-5 w-5 text-accent mt-0.5 shrink-0" /> : <ShieldX className="h-5 w-5 text-destructive mt-0.5 shrink-0" />}
                                <div>
                                    <strong>Liveness Detection:</strong>
                                    <span className={cn("font-semibold ml-2", applicant.fraudAnalysis.livenessDetection ? "text-accent" : "text-destructive")}>
                                        {applicant.fraudAnalysis.livenessDetection ? "Passed" : "Failed"}
                                    </span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                {applicant.fraudAnalysis.idAuthentic ? <ShieldCheck className="h-5 w-5 text-accent mt-0.5 shrink-0" /> : <ShieldX className="h-5 w-5 text-destructive mt-0.5 shrink-0" />}
                                <div>
                                    <strong>ID Document:</strong>
                                    <span className={cn("font-semibold ml-2", applicant.fraudAnalysis.idAuthentic ? "text-accent" : "text-destructive")}>
                                        {applicant.fraudAnalysis.idAuthentic ? "Authentic" : "Potential Forgery"}
                                    </span>
                                </div>
                            </li>
                            {applicant.fraudAnalysis.deviceIntelligence.length > 0 && (
                                <li className="flex items-start gap-3">
                                    <AlertTriangle className="h-5 w-5 text-chart-3 mt-0.5 shrink-0" />
                                    <div>
                                        <strong>Device Intelligence:</strong>
                                        <ul className="list-disc pl-5 mt-1 text-muted-foreground">
                                            {applicant.fraudAnalysis.deviceIntelligence.map((insight, i) => <li key={i}>{insight}</li>)}
                                        </ul>
                                    </div>
                                </li>
                            )}
                        </ul>
                    </div>
                    <Separator />
                     <div>
                        <h4 className="font-semibold mb-3">Behavioral Insights</h4>
                         <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
                            {applicant.fraudAnalysis.behavioralInsights.map((insight, i) => <li key={i}>{insight}</li>)}
                        </ul>
                    </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="financials">
              <Card>
                <CardHeader>
                  <CardTitle>Income vs. Obligations</CardTitle>
                  <CardDescription>AI-calculated monthly averages from provided financial documents.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                            <p className="text-sm text-muted-foreground">Avg. Monthly Income</p>
                            <p className="text-2xl font-bold">KES {applicant.financials.avgMonthlyIncome.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Avg. Monthly Debt</p>
                            <p className="text-2xl font-bold">KES {applicant.financials.avgMonthlyDebt.toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="h-64">
                        <IncomeChart data={applicant.financials.history} />
                    </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Panel C: Right */}
        <div className="lg:col-span-3 space-y-6">
           <Card>
              <CardHeader>
                <CardTitle>AI Recommendation</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                 <div>
                    <p className="text-sm text-muted-foreground">Recommended Loan Limit</p>
                    <p className="text-4xl font-bold">KES {applicant.recommendations.loanLimit.toLocaleString()}</p>
                </div>
                 <div>
                    <p className="text-sm text-muted-foreground">Recommended Interest Rate</p>
                    <p className="text-2xl font-bold flex items-center justify-center gap-1">{applicant.recommendations.interestRate}<Percent className="h-6 w-6" /></p>
                </div>
              </CardContent>
           </Card>
           <Card>
               <CardHeader>
                   <CardTitle>Lender Notes</CardTitle>
               </CardHeader>
               <CardContent>
                   <Textarea placeholder="Add manual notes for this applicant..." rows={5} />
               </CardContent>
           </Card>
           <div className="sticky bottom-6 space-y-2 pt-4">
                <h4 className="text-sm font-semibold text-center mb-2">Decision Tools</h4>
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" size="lg">
                    <ThumbsUp className="mr-2" />Approve Loan
                </Button>
                <Button variant="secondary" className="w-full" size="lg">
                    <MessageSquare className="mr-2" />Request More Info
                </Button>
                <Button variant="destructive" className="w-full" size="lg">
                    <ThumbsDown className="mr-2" />Decline
                </Button>
           </div>
        </div>
      </div>
    </div>
  );
}
