import { NextRequest, NextResponse } from 'next/server';
import { verifyIdentity } from '@/ai/services/identity-verification';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { liveFaceImages, idFrontImage, idBackImage } = body;

    // Validate inputs
    if (!liveFaceImages || !Array.isArray(liveFaceImages) || liveFaceImages.length === 0) {
      return NextResponse.json(
        { error: 'Live face images are required' },
        { status: 400 }
      );
    }

    if (!idFrontImage || !idBackImage) {
      return NextResponse.json(
        { error: 'Both sides of ID are required' },
        { status: 400 }
      );
    }

    console.log('Starting identity verification...');
    
    // Call AI service
    const result = await verifyIdentity({
      liveFaceImages,
      idFrontImage,
      idBackImage,
    });

    console.log('Identity verification complete:', result.recommendation);

    return NextResponse.json({
      success: true,
      data: result,
    });

  } catch (error) {
    console.error('Identity verification error:', error);
    return NextResponse.json(
      {
        error: 'Failed to verify identity',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
