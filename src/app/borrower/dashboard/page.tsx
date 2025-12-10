'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function BorrowerDashboard() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Welcome back. Your dashboard will appear here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
