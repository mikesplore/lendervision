import { NextRequest, NextResponse } from 'next/server';
import { assessCreditworthiness } from '@/ai/services/credit-assessment';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { applicantInfo, identityVerification, financialAnalysis, loanRequest } = body;

    // Validate inputs
    if (!applicantInfo || !identityVerification || !financialAnalysis) {
      return NextResponse.json(
        { error: 'Missing required assessment data' },
        { status: 400 }
      );
    }

    console.log('Assessing creditworthiness for:', applicantInfo.fullName);
    
    // Call AI service
    const result = await assessCreditworthiness({
      applicantInfo,
      identityVerification,
      financialAnalysis,
      loanRequest,
    });

    console.log('Credit assessment complete:', result.approvalStatus, '- Score:', result.creditScore);

    return NextResponse.json({
      success: true,
      data: result,
    });

  } catch (error) {
    console.error('Credit assessment error:', error);
    return NextResponse.json(
      {
        error: 'Failed to assess creditworthiness',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
