/**
 * AI-Powered ID Document Verification Service
 * Validates ID authenticity and extracts information using Gemini Vision API
 */

import { ai } from '../genkit';

export interface IDVerificationResult {
  isAuthentic: boolean;
  confidence: number; // 0-100
  forgeryDetected: boolean;
  forgeryIndicators: string[];
  extractedData: {
    fullName: string;
    idNumber: string;
    dateOfBirth: string;
    gender: string;
    nationality: string;
    issueDate?: string;
    expiryDate?: string;
  };
  qualityIssues: string[];
  warnings: string[];
  recommendations: string[];
}

export class IDVerificationService {
  /**
   * Verify ID document authenticity and extract data
   */
  static async verifyIDDocument(
    frontImageBase64: string,
    backImageBase64?: string
  ): Promise<IDVerificationResult> {
    const prompt = `You are an expert document forensics system specialized in Kenyan National IDs. Analyze this ID document for authenticity and extract personal information.

SECURITY CHECKS (Critical):
1. Hologram presence and quality
2. Microprinting clarity
3. Color shifting ink (if visible)
4. Paper texture and quality
5. Font consistency and official typography
6. Photo quality and embedding
7. UV features (if visible)
8. Barcode/QR code presence
9. Security thread visibility
10. Official seals and stamps

FORGERY INDICATORS TO CHECK:
- Pixelation or digital manipulation artifacts
- Inconsistent fonts or spacing
- Poor photo quality or obvious photo replacement
- Missing security features
- Blurred or smudged text
- Color inconsistencies
- Incorrect ID format or layout
- Tampered or altered information
- Low resolution printing
- Cut and paste indicators

INFORMATION TO EXTRACT:
- Full name (as appears on ID)
- ID number
- Date of birth
- Gender
- Nationality
- Issue date (if visible)
- Expiry date (if visible)

Provide analysis in JSON format:
{
  "isAuthentic": boolean,
  "confidence": number (0-100),
  "forgeryDetected": boolean,
  "forgeryIndicators": ["specific red flags found"],
  "extractedData": {
    "fullName": "string",
    "idNumber": "string",
    "dateOfBirth": "YYYY-MM-DD",
    "gender": "Male" | "Female",
    "nationality": "Kenyan",
    "issueDate": "YYYY-MM-DD or null",
    "expiryDate": "YYYY-MM-DD or null"
  },
  "qualityIssues": ["image quality problems"],
  "warnings": ["any concerns"],
  "recommendations": ["what user should do"]
}

Be extremely thorough. Financial fraud prevention depends on accurate ID verification.
If confidence is below 70%, mark as potential forgery.`;

    try {
      const media = [
        {
          url: `data:image/jpeg;base64,${frontImageBase64}`,
          contentType: 'image/jpeg'
        }
      ];

      if (backImageBase64) {
        media.push({
          url: `data:image/jpeg;base64,${backImageBase64}`,
          contentType: 'image/jpeg'
        });
      }

      const response = await ai.generate({
        model: 'googleai/gemini-2.0-flash-exp',
        prompt,
        config: {
          temperature: 0.1,
        },
        media,
        output: {
          format: 'json',
          schema: {
            type: 'object',
            properties: {
              isAuthentic: { type: 'boolean' },
              confidence: { type: 'number' },
              forgeryDetected: { type: 'boolean' },
              forgeryIndicators: { type: 'array', items: { type: 'string' } },
              extractedData: {
                type: 'object',
                properties: {
                  fullName: { type: 'string' },
                  idNumber: { type: 'string' },
                  dateOfBirth: { type: 'string' },
                  gender: { type: 'string' },
                  nationality: { type: 'string' },
                  issueDate: { type: ['string', 'null'] },
                  expiryDate: { type: ['string', 'null'] }
                }
              },
              qualityIssues: { type: 'array', items: { type: 'string' } },
              warnings: { type: 'array', items: { type: 'string' } },
              recommendations: { type: 'array', items: { type: 'string' } }
            }
          }
        }
      });

      return response.output as IDVerificationResult;
    } catch (error) {
      console.error('ID verification error:', error);
      return {
        isAuthentic: false,
        confidence: 0,
        forgeryDetected: true,
        forgeryIndicators: ['Technical error during verification'],
        extractedData: {
          fullName: '',
          idNumber: '',
          dateOfBirth: '',
          gender: '',
          nationality: ''
        },
        qualityIssues: ['Unable to process image'],
        warnings: ['Verification failed - please retry with clearer image'],
        recommendations: ['Ensure good lighting and clear photo']
      };
    }
  }

  /**
   * Verify business registration documents
   */
  static async verifyBusinessDocument(
    documentImageBase64: string,
    documentType: 'registration' | 'tax' | 'address'
  ): Promise<IDVerificationResult> {
    const prompts = {
      registration: `Analyze this Kenyan business registration certificate for authenticity. Check for official seals, signatures, registration number format, and document quality.`,
      tax: `Analyze this Kenyan KRA PIN certificate for authenticity. Verify PIN format, official stamps, and document legitimacy.`,
      address: `Analyze this proof of address document (utility bill/lease). Verify it's recent, legitimate, and matches business information.`
    };

    const prompt = `You are a document verification expert. ${prompts[documentType]}

Check for:
1. Official government seals and watermarks
2. Correct document format and layout
3. Valid registration/PIN number format
4. Signature authenticity
5. Date validity and recency
6. Document quality and printing
7. Any signs of forgery or tampering

Provide detailed analysis in the same JSON format as ID verification.`;

    try {
      const response = await ai.generate({
        model: 'googleai/gemini-2.0-flash-exp',
        prompt,
        config: {
          temperature: 0.1,
        },
        media: {
          url: `data:image/jpeg;base64,${documentImageBase64}`,
          contentType: 'image/jpeg'
        },
        output: {
          format: 'json',
          schema: {
            type: 'object',
            properties: {
              isAuthentic: { type: 'boolean' },
              confidence: { type: 'number' },
              forgeryDetected: { type: 'boolean' },
              forgeryIndicators: { type: 'array', items: { type: 'string' } },
              extractedData: { type: 'object' },
              qualityIssues: { type: 'array', items: { type: 'string' } },
              warnings: { type: 'array', items: { type: 'string' } },
              recommendations: { type: 'array', items: { type: 'string' } }
            }
          }
        }
      });

      return response.output as IDVerificationResult;
    } catch (error) {
      console.error('Business document verification error:', error);
      return {
        isAuthentic: false,
        confidence: 0,
        forgeryDetected: true,
        forgeryIndicators: ['Verification failed'],
        extractedData: {
          fullName: '',
          idNumber: '',
          dateOfBirth: '',
          gender: '',
          nationality: ''
        },
        qualityIssues: ['Processing error'],
        warnings: ['Unable to verify document'],
        recommendations: ['Please upload a clearer image']
      };
    }
  }
}
