import { NextRequest, NextResponse } from 'next/server';
import { analyzeFinancialData, generateMockMpesaData } from '@/ai/services/financial-analysis';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phoneNumber, employmentStatus, monthlyIncome, useRealData } = body;

    // Validate inputs
    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    console.log('Analyzing financial data for:', phoneNumber);
    
    // Generate mock M-Pesa data (in production, this would fetch real data)
    const transactions = useRealData 
      ? [] // Would connect to real M-Pesa API
      : generateMockMpesaData(phoneNumber, 3);

    console.log(`Generated ${transactions.length} mock transactions`);

    // Call AI service
    const result = await analyzeFinancialData({
      phoneNumber,
      transactions,
      employmentStatus: employmentStatus || 'employed',
      monthlyIncome,
    });

    console.log('Financial analysis complete. Overall score:', result.overallScore);

    return NextResponse.json({
      success: true,
      data: {
        analysis: result,
        transactionCount: transactions.length,
        dateRange: {
          from: transactions[transactions.length - 1]?.date,
          to: transactions[0]?.date,
        },
      },
    });

  } catch (error) {
    console.error('Financial analysis error:', error);
    return NextResponse.json(
      {
        error: 'Failed to analyze financial data',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
