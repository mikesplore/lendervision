import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, Loader2 } from "lucide-react";
import { Logo } from "@/components/shared/Logo";

export default function BorrowerDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <header className="p-4 md:p-6 border-b">
        <Logo />
      </header>
      <main className="container mx-auto max-w-2xl py-8 md:py-16 px-4">
        <div className="flex flex-col items-center text-center space-y-8">
            <Card className="w-full text-center">
                <CardHeader>
                    <div className="mx-auto bg-yellow-100 dark:bg-yellow-900/50 p-3 rounded-full w-fit">
                      <Clock className="w-10 h-10 text-yellow-500" />
                    </div>
                    <CardTitle className="text-3xl mt-4">Application Under Review</CardTitle>
                    <CardDescription className="text-base">
                        Our AI is currently scoring your profile. You will receive a notification shortly.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4 text-left p-4 border rounded-lg">
                        <h3 className="font-semibold mb-4">Your Application Checklist</h3>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="w-6 h-6 text-green-500" />
                                <span className="font-medium">Identity Verification</span>
                            </div>
                            <span className="text-sm text-green-500 font-semibold">Verified</span>
                        </div>
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="w-6 h-6 text-green-500" />
                                <span className="font-medium">M-Pesa Statement</span>
                            </div>
                            <span className="text-sm text-green-500 font-semibold">Analyzed</span>
                        </div>
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Loader2 className="w-6 h-6 text-primary animate-spin" />
                                <span className="font-medium">Risk Profile Assessment</span>
                            </div>
                            <span className="text-sm text-primary font-semibold">In Progress</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <p className="text-muted-foreground text-sm">
                You can safely close this window. We will notify you via SMS and email once the review is complete.
            </p>
        </div>
      </main>
    </div>
  );
}
