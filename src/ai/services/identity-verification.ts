import { ai } from '../genkit';
import { z } from 'zod';

// Schema for identity verification result
const IdentityVerificationSchema = z.object({
  isValid: z.boolean(),
  confidence: z.number().min(0).max(100),
  faceMatch: z.object({
    matched: z.boolean(),
    confidence: z.number().min(0).max(100),
    reason: z.string(),
  }),
  idVerification: z.object({
    isForged: z.boolean(),
    confidence: z.number().min(0).max(100),
    issues: z.array(z.string()),
    extractedData: z.object({
      fullName: z.string(),
      idNumber: z.string(),
      dateOfBirth: z.string(),
      expiryDate: z.string().optional(),
      nationality: z.string().optional(),
    }),
  }),
  livenessCheck: z.object({
    passed: z.boolean(),
    confidence: z.number().min(0).max(100),
    suspiciousActivity: z.array(z.string()),
  }),
  recommendation: z.enum(['APPROVE', 'REJECT', 'MANUAL_REVIEW']),
  detailedFeedback: z.string(),
});

export type IdentityVerificationResult = z.infer<typeof IdentityVerificationSchema>;

/**
 * AI-powered identity verification service
 * Compares live face with ID photo and detects forged documents
 */
export const verifyIdentity = ai.defineFlow(
  {
    name: 'verifyIdentity',
    inputSchema: z.object({
      liveFaceImages: z.array(z.string()).describe('Base64 encoded images from liveness detection'),
      idFrontImage: z.string().describe('Base64 encoded front of ID'),
      idBackImage: z.string().describe('Base64 encoded back of ID'),
    }),
    outputSchema: IdentityVerificationSchema,
  },
  async (input) => {
    const { liveFaceImages, idFrontImage, idBackImage } = input;

    // Step 1: Analyze ID for forgery
    const idAnalysisPrompt = `
You are an expert document verification specialist. Analyze these ID images for authenticity.

Check for:
1. Document quality and printing consistency
2. Holograms, watermarks, and security features
3. Font consistency and spacing
4. Photo quality and alignment
5. Any signs of digital manipulation or forgery
6. Text clarity and barcode/MRZ integrity
7. Document expiry status

Extract all visible text including:
- Full name
- ID/Document number
- Date of birth
- Expiry date
- Nationality

Provide:
- Whether the document appears forged (true/false)
- Confidence score (0-100)
- List of specific issues found (if any)
- All extracted data

Be thorough and precise. If anything looks suspicious, flag it.
`;

    const idAnalysis = await ai.generate({
      model: 'googleai/gemini-1.5-pro',
      prompt: idAnalysisPrompt,
      config: {
        temperature: 0.1, // Low temperature for precise analysis
      },
      media: [
        { url: `data:image/jpeg;base64,${idFrontImage}`, contentType: 'image/jpeg' },
        { url: `data:image/jpeg;base64,${idBackImage}`, contentType: 'image/jpeg' },
      ],
      output: {
        schema: z.object({
          isForged: z.boolean(),
          confidence: z.number(),
          issues: z.array(z.string()),
          extractedData: z.object({
            fullName: z.string(),
            idNumber: z.string(),
            dateOfBirth: z.string(),
            expiryDate: z.string().optional(),
            nationality: z.string().optional(),
          }),
        }),
      },
    });

    // Step 2: Verify liveness detection
    const livenessPrompt = `
You are a biometric liveness detection expert. Analyze these sequential images from a liveness check.

Look for:
1. Consistent face across all frames
2. Natural eye blinking (not static or video playback)
3. Natural head movement (not photo manipulation)
4. Natural facial expressions (not a mask or deepfake)
5. Proper lighting variations (rules out printed photos)
6. Depth perception cues
7. Any signs of spoofing (holding up a photo, video playback, masks)

Determine:
- Whether this is a real, live person (true/false)
- Confidence score (0-100)
- Any suspicious activities detected

Be strict - if anything looks artificial or manipulated, flag it.
`;

    const livenessCheck = await ai.generate({
      model: 'googleai/gemini-1.5-pro',
      prompt: livenessPrompt,
      config: {
        temperature: 0.1,
      },
      media: liveFaceImages.map(img => ({
        url: `data:image/jpeg;base64,${img}`,
        contentType: 'image/jpeg',
      })),
      output: {
        schema: z.object({
          passed: z.boolean(),
          confidence: z.number(),
          suspiciousActivity: z.array(z.string()),
        }),
      },
    });

    // Step 3: Face matching
    const faceMatchPrompt = `
You are a facial recognition expert. Compare the face in the live images with the face on the ID document.

Analyze:
1. Facial structure and proportions
2. Eye shape, color, and position
3. Nose shape and size
4. Mouth and lip structure
5. Facial hair patterns
6. Skin tone and texture
7. Age consistency
8. Any visible identifying marks

Determine:
- Whether the faces match (true/false)
- Confidence score (0-100)
- Detailed explanation of your decision

Account for:
- Different lighting conditions
- Different angles
- Natural aging (if ID is old)
- Different expressions

Be thorough but fair - minor differences due to lighting or angle are acceptable.
`;

    const faceMatch = await ai.generate({
      model: 'googleai/gemini-1.5-pro',
      prompt: faceMatchPrompt,
      config: {
        temperature: 0.1,
      },
      media: [
        ...liveFaceImages.slice(0, 3).map(img => ({
          url: `data:image/jpeg;base64,${img}`,
          contentType: 'image/jpeg',
        })),
        { url: `data:image/jpeg;base64,${idFrontImage}`, contentType: 'image/jpeg' },
      ],
      output: {
        schema: z.object({
          matched: z.boolean(),
          confidence: z.number(),
          reason: z.string(),
        }),
      },
    });

    // Step 4: Generate final decision and feedback
    const overallValid = 
      !idAnalysis.output.isForged &&
      livenessCheck.output.passed &&
      faceMatch.output.matched;

    const avgConfidence = Math.round(
      (idAnalysis.output.confidence + 
       livenessCheck.output.confidence + 
       faceMatch.output.confidence) / 3
    );

    let recommendation: 'APPROVE' | 'REJECT' | 'MANUAL_REVIEW';
    let feedback: string;

    if (!overallValid) {
      if (idAnalysis.output.isForged) {
        recommendation = 'REJECT';
        feedback = `Identity verification failed. Your ID document appears to be forged or tampered with. Issues detected: ${idAnalysis.output.issues.join(', ')}. Please contact support if you believe this is an error.`;
      } else if (!livenessCheck.output.passed) {
        recommendation = 'REJECT';
        feedback = `Liveness detection failed. We could not verify that you are a real person in front of the camera. Issues: ${livenessCheck.output.suspiciousActivity.join(', ')}. Please try again with proper lighting and follow all prompts carefully.`;
      } else if (!faceMatch.output.matched) {
        recommendation = 'REJECT';
        feedback = `Face matching failed. The face in your live video does not match the face on your ID document. Reason: ${faceMatch.output.reason}. Please ensure you're using your own ID and try again.`;
      } else {
        recommendation = 'MANUAL_REVIEW';
        feedback = 'Your verification requires manual review by our team. We will contact you within 24 hours.';
      }
    } else if (avgConfidence < 70) {
      recommendation = 'MANUAL_REVIEW';
      feedback = 'Your verification is under review. While initial checks passed, we need additional verification to ensure accuracy. Our team will review within 24 hours.';
    } else {
      recommendation = 'APPROVE';
      feedback = `Identity verified successfully! Your ID is authentic, liveness check passed, and your face matches your ID photo with ${avgConfidence}% confidence.`;
    }

    return {
      isValid: overallValid,
      confidence: avgConfidence,
      faceMatch: faceMatch.output,
      idVerification: idAnalysis.output,
      livenessCheck: livenessCheck.output,
      recommendation,
      detailedFeedback: feedback,
    };
  }
);
