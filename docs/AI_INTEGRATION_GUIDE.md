# AI-Powered Onboarding Integration Guide

## Overview

This guide shows how to integrate the AI-powered verification and assessment system into your onboarding pages.

## Features

The AI system provides:
1. **Liveness Detection** - Detects photo/video spoofing attempts
2. **Face Matching** - Compares selfie with ID photo
3. **ID Verification** - Detects forged documents
4. **Credit Scoring** - AI-powered creditworthiness assessment
5. **Detailed Reasoning** - Explains why applications are approved/rejected

## Quick Start

### 1. Install Dependencies

The AI services use Genkit and Gemini AI (already installed in your project):
```bash
npm install @genkit-ai/google-genai genkit
```

### 2. Set up Environment Variables

Add your Gemini API key to `.env.local`:
```
GOOGLE_GENAI_API_KEY=your_api_key_here
```

Get your API key from: https://aistudio.google.com/app/apikey

### 3. Use in Your Onboarding Pages

#### Example: Individual Identity Verification

```typescript
'use client';

import { useState } from 'react';
import { AIProcessingStatus } from '@/components/ai/AIProcessingStatus';
import { AssessmentResult } from '@/components/ai/AssessmentResult';

export default function IdentityPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingSteps, setProcessingSteps] = useState([]);
  const [progress, setProgress] = useState(0);
  const [currentAction, setCurrentAction] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = async (formData) => {
    setIsProcessing(true);
    
    // Convert images to base64
    const livenessImageBase64 = await fileToBase64(formData.livenessImage);
    const idFrontBase64 = await fileToBase64(formData.idFront);
    const idBackBase64 = await fileToBase64(formData.idBack);

    try {
      const response = await fetch('/api/ai/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'individual',
          data: {
            livenessImage: livenessImageBase64,
            idFrontImage: idFrontBase64,
            idBackImage: idBackBase64,
            personalInfo: {
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
              phone: formData.phone,
              employmentType: formData.employmentType,
              monthlyIncome: formData.monthlyIncome
            },
            financialConnection: {
              type: formData.connectionType, // 'mpesa' | 'bank' | 'skip'
              accountInfo: formData.accountInfo
            }
          }
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // Show assessment results
        setResult(data.assessmentResult);
        setProcessingSteps(data.processingSteps);
      } else {
        // Show rejection reasons
        setResult(data.assessmentResult);
        setProcessingSteps(data.processingSteps);
      }
    } catch (error) {
      console.error('Processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (result) {
    return (
      <AssessmentResult
        result={result}
        onViewLoans={() => router.push('/borrower/loans')}
        onReturnToDashboard={() => router.push('/borrower/dashboard')}
      />
    );
  }

  if (isProcessing) {
    return (
      <AIProcessingStatus
        steps={processingSteps}
        currentProgress={progress}
        currentAction={currentAction}
        estimatedTimeRemaining={30}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Your form fields */}
    </form>
  );
}

// Helper function
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
```

## Testing the AI System

### Using Mock Data

The system includes a mock data generator for testing:

```typescript
import { MockDataGenerator } from '@/ai/services/mock-data-generator';

// Generate test profiles
const lowRiskProfile = MockDataGenerator.generateUserProfile('low');
const mediumRiskProfile = MockDataGenerator.generateUserProfile('medium');
const highRiskProfile = MockDataGenerator.generateUserProfile('high');

// Generate test transactions
const mpesaTransactions = MockDataGenerator.generateMpesaTransactions(3, lowRiskProfile);
const bankStatements = MockDataGenerator.generateBankStatements(6, lowRiskProfile);
```

### Test Scenarios

#### 1. Approved Application (Low Risk)
```typescript
{
  livenessImage: validSelfieBase64,
  idFrontImage: genuineIDBase64,
  personalInfo: {
    monthlyIncome: 80000,
    employmentType: 'employed'
  }
}
// Expected: Score 75-100, Approved
```

#### 2. Forged ID Detection
```typescript
{
  idFrontImage: forgedIDBase64, // AI will detect forgery indicators
}
// Expected: Rejection with detailed forgery reasons
```

#### 3. Face Mismatch
```typescript
{
  livenessImage: personABase64,
  idFrontImage: personBBase64, // Different people
}
// Expected: Rejection with face mismatch details
```

#### 4. Spoofing Attempt
```typescript
{
  livenessImage: photoOfPhotoBase64, // Picture of a picture
}
// Expected: Liveness check failure
```

## AI Response Examples

### Successful Approval

```json
{
  "success": true,
  "assessmentResult": {
    "creditScore": 82,
    "approvalStatus": "approved",
    "loanRecommendation": {
      "minAmount": 100000,
      "maxAmount": 240000,
      "interestRateMin": 8,
      "interestRateMax": 12,
      "termMin": 6,
      "termMax": 24
    },
    "riskLevel": "low",
    "keyInsights": [
      "Consistent monthly income of KES 80,000 detected",
      "Regular savings pattern indicates financial discipline",
      "No payment defaults in transaction history"
    ],
    "strengths": [
      "Stable employment with 36+ months tenure",
      "Low debt-to-income ratio (25%)",
      "Perfect payment history"
    ]
  }
}
```

### Rejection with Forgery Detection

```json
{
  "success": false,
  "assessmentResult": {
    "creditScore": 0,
    "approvalStatus": "rejected",
    "rejectionReasons": [
      "FORGERY DETECTED: Inconsistent font spacing on ID document",
      "FORGERY DETECTED: Missing holographic security features",
      "FORGERY DETECTED: Poor quality photo embedding indicates tampering"
    ],
    "improvementSuggestions": [
      "Please provide a genuine national ID or passport",
      "Ensure the document is recent and not expired",
      "Take clear, well-lit photos without glare"
    ]
  }
}
```

### Face Mismatch Rejection

```json
{
  "success": false,
  "assessmentResult": {
    "rejectionReasons": [
      "Face verification failed: Facial structure does not match ID photo",
      "Eye spacing and nose structure significantly different",
      "FRAUD INDICATORS: Potential identity theft attempt"
    ]
  }
}
```

## Advanced Features

### Real-time Progress Updates

For better UX, implement Server-Sent Events (SSE) or WebSocket:

```typescript
// Server-side (using SSE)
import { AIOnboardingOrchestrator } from '@/ai/services/onboarding-orchestrator';

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    async start(controller) {
      const orchestrator = new AIOnboardingOrchestrator((progress) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(progress)}\n\n`)
        );
      });
      
      const result = await orchestrator.processIndividualOnboarding(data);
      
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ type: 'complete', result })}\n\n`)
      );
      controller.close();
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  });
}

// Client-side
const eventSource = new EventSource('/api/ai/onboard-stream');
eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'complete') {
    setResult(data.result);
  } else {
    setProgress(data.progress);
    setCurrentAction(data.currentAction);
  }
};
```

## Best Practices

1. **Always validate images** before sending to AI
   - Check file size (< 5MB recommended)
   - Verify image format (JPEG/PNG)
   - Ensure minimum resolution (640x480)

2. **Handle errors gracefully**
   - Show user-friendly error messages
   - Provide retry options
   - Log errors for debugging

3. **Secure data transmission**
   - Use HTTPS only
   - Never log base64 images
   - Clear sensitive data after processing

4. **Optimize for performance**
   - Compress images before upload
   - Show loading states
   - Cache API responses when appropriate

5. **Test thoroughly**
   - Test with various document types
   - Test forgery detection
   - Test face matching edge cases
   - Test with poor quality images

## Troubleshooting

### "API key not found"
Make sure `GOOGLE_GENAI_API_KEY` is set in your `.env.local` file

### "Image processing failed"
- Check image format (must be JPEG/PNG)
- Verify base64 encoding is correct
- Ensure image size is reasonable

### "Low confidence scores"
- Improve image quality
- Ensure good lighting
- Use higher resolution images

## Next Steps

1. Integrate into your onboarding pages
2. Add your Gemini API key
3. Test with various scenarios
4. Customize the UI components
5. Add analytics tracking
6. Implement fraud prevention measures

## Support

For issues or questions:
- Check the AI service logs in console
- Review the processing steps array
- Test with mock data first
- Verify API key is valid
