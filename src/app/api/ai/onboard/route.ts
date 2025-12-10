/**
 * API Route: AI Onboarding Processing
 * POST /api/ai/onboard
 */

import { NextRequest, NextResponse } from 'next/server';
import { AIOnboardingOrchestrator } from '@/ai/services/onboarding-orchestrator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body; // type: 'individual' | 'business'

    if (!type || !data) {
      return NextResponse.json(
        { error: 'Missing required fields: type and data' },
        { status: 400 }
      );
    }

    // Create orchestrator (progress updates could be sent via websocket/SSE in production)
    const orchestrator = new AIOnboardingOrchestrator();

    let result;
    if (type === 'individual') {
      result = await orchestrator.processIndividualOnboarding(data);
    } else if (type === 'business') {
      result = await orchestrator.processBusinessOnboarding(data);
    } else {
      return NextResponse.json(
        { error: 'Invalid type. Must be "individual" or "business"' },
        { status: 400 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('AI onboarding error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error during AI processing',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
