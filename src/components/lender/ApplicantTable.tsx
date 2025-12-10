'use client';
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, ArrowRight } from "lucide-react";
import type { Applicant } from "@/lib/data";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface ApplicantTableProps {
  applicants: Applicant[];
}

export function ApplicantTable({ applicants }: ApplicantTableProps) {
  const router = useRouter();

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Applicant Name</TableHead>
            <TableHead className="hidden md:table-cell">Date Applied</TableHead>
            <TableHead>Eligibility Score</TableHead>
            <TableHead>Risk Rating</TableHead>
            <TableHead className="text-center">Fraud Flags</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applicants.map((applicant) => (
            <TableRow key={applicant.id} className="cursor-pointer" onClick={() => router.push(`/lender/applicants/${applicant.id}`)}>
              <TableCell className="font-medium">{applicant.name}</TableCell>
              <TableCell className="hidden md:table-cell">{applicant.dateApplied}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                    <span className="font-semibold w-8">{applicant.eligibilityScore}</span>
                    <Progress value={applicant.eligibilityScore} className="w-24 h-2"/>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={cn({
                    'border-transparent bg-accent/20 text-accent': applicant.riskRating === 'Low',
                    'border-transparent bg-chart-3/20 text-chart-3': applicant.riskRating === 'Medium',
                    'border-transparent bg-destructive/20 text-destructive': applicant.riskRating === 'High',
                })}>
                  {applicant.riskRating}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                {applicant.fraudFlags > 0 ? (
                  <div className="flex items-center justify-center gap-1 text-destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <span>{applicant.fraudFlags}</span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm">
                  View Profile <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
