/**
 * AI-Powered Face Verification Service
 * Compares liveness selfie with uploaded ID photo using Gemini Vision API
 */

import { ai } from '../genkit';

export interface FaceMatchResult {
  isMatch: boolean;
  confidence: number; // 0-100
  reasons: string[];
  warnings: string[];
  fraudIndicators: string[];
}

export interface LivenessCheckResult {
  isPassed: boolean;
  confidence: number;
  spoofingDetected: boolean;
  spoofingType?: 'photo' | 'video' | 'mask' | 'none';
  qualityScore: number;
  recommendations: string[];
}

export class FaceVerificationService {
  /**
   * Compare liveness selfie with ID photo
   */
  static async verifyFaceMatch(
    livenessImageBase64: string,
    idPhotoBase64: string
  ): Promise<FaceMatchResult> {
    const prompt = `You are an expert biometric verification system. Compare these two facial images and determine if they are the same person.

Image 1: Live selfie captured during verification
Image 2: Photo from national ID card

Analyze the following aspects:
1. Facial structure (bone structure, face shape)
2. Eye shape, color, and spacing
3. Nose structure
4. Mouth and lip shape
5. Ear shape (if visible)
6. Skin tone consistency
7. Age consistency (accounting for photo age)
8. Any signs of digital manipulation

Provide your analysis in this JSON format:
{
  "isMatch": boolean,
  "confidence": number (0-100),
  "reasons": ["detailed reason 1", "detailed reason 2"],
  "warnings": ["any concerns"],
  "fraudIndicators": ["suspicious patterns if any"]
}

Be strict but fair. Minor differences due to lighting, angle, or photo quality are acceptable.
Major discrepancies in facial features indicate different people.`;

    try {
      const response = await ai.generate({
        model: 'googleai/gemini-2.0-flash-exp',
        prompt,
        config: {
          temperature: 0.1, // Low temperature for consistent results
        },
        media: [
          {
            url: `data:image/jpeg;base64,${livenessImageBase64}`,
            contentType: 'image/jpeg'
          },
          {
            url: `data:image/jpeg;base64,${idPhotoBase64}`,
            contentType: 'image/jpeg'
          }
        ],
        output: {
          format: 'json',
          schema: {
            type: 'object',
            properties: {
              isMatch: { type: 'boolean' },
              confidence: { type: 'number' },
              reasons: { type: 'array', items: { type: 'string' } },
              warnings: { type: 'array', items: { type: 'string' } },
              fraudIndicators: { type: 'array', items: { type: 'string' } }
            }
          }
        }
      });

      return response.output as FaceMatchResult;
    } catch (error) {
      console.error('Face verification error:', error);
      return {
        isMatch: false,
        confidence: 0,
        reasons: ['Technical error during verification'],
        warnings: ['Unable to complete verification'],
        fraudIndicators: []
      };
    }
  }

  /**
   * Perform liveness detection on selfie
   */
  static async performLivenessCheck(
    imageBase64: string
  ): Promise<LivenessCheckResult> {
    const prompt = `You are an advanced liveness detection system. Analyze this selfie image to determine if it's from a real, live person or a spoof attempt.

Check for:
1. Natural skin texture and pores
2. Micro-expressions and natural shadows
3. Eye reflection patterns (should show environment)
4. Screen glare or pixelation (indicates photo of photo)
5. Depth and 3D characteristics
6. Natural color gradients in skin
7. Paper edges or screen bezels in image
8. Video replay artifacts
9. Mask or prosthetic indicators
10. Image quality appropriate for live capture

Provide analysis in JSON format:
{
  "isPassed": boolean,
  "confidence": number (0-100),
  "spoofingDetected": boolean,
  "spoofingType": "photo" | "video" | "mask" | "none",
  "qualityScore": number (0-100),
  "recommendations": ["improvement suggestions"]
}

Be strict - financial security depends on accurate liveness detection.`;

    try {
      const response = await ai.generate({
        model: 'googleai/gemini-2.0-flash-exp',
        prompt,
        config: {
          temperature: 0.1,
        },
        media: {
          url: `data:image/jpeg;base64,${imageBase64}`,
          contentType: 'image/jpeg'
        },
        output: {
          format: 'json',
          schema: {
            type: 'object',
            properties: {
              isPassed: { type: 'boolean' },
              confidence: { type: 'number' },
              spoofingDetected: { type: 'boolean' },
              spoofingType: { type: 'string', enum: ['photo', 'video', 'mask', 'none'] },
              qualityScore: { type: 'number' },
              recommendations: { type: 'array', items: { type: 'string' } }
            }
          }
        }
      });

      return response.output as LivenessCheckResult;
    } catch (error) {
      console.error('Liveness check error:', error);
      return {
        isPassed: false,
        confidence: 0,
        spoofingDetected: true,
        spoofingType: 'none',
        qualityScore: 0,
        recommendations: ['Technical error - please retry']
      };
    }
  }
}
