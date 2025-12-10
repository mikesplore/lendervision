# QuickScore AI-Powered Lending Platform

## 🚀 Overview

QuickScore is an intelligent lending platform that uses **Google Gemini AI** to automatically verify identities, detect fraud, and assess creditworthiness. The system provides detailed explanations for every decision, making the lending process transparent and fair.

## ✨ AI-Powered Features

### 1. **Liveness Detection**
- Detects photo/video replay attacks
- Identifies mask or prosthetic attempts
- Analyzes skin texture and micro-expressions
- Prevents spoofing with advanced AI

### 2. **Face Matching**
- Compares live selfie with ID photo
- Accounts for aging and lighting differences
- Detects face swapping attempts
- Provides confidence scores (0-100%)

### 3. **ID Verification**
- Validates document authenticity
- Detects forged or tampered IDs
- Extracts personal information automatically
- Checks security features (holograms, watermarks)

### 4. **Credit Scoring**
- Analyzes M-Pesa and bank transactions
- Evaluates income stability patterns
- Calculates debt-to-income ratios
- Provides detailed reasoning for scores

### 5. **Intelligent Rejection Reasoning**
- Explains exactly why applications fail
- Detects and reports forgery attempts
- Provides improvement suggestions
- Offers actionable next steps

## 🏗️ Architecture

```
src/
├── ai/
│   ├── services/
│   │   ├── face-verification.ts      # Liveness & face matching
│   │   ├── id-verification.ts        # ID authenticity checking
│   │   ├── credit-scoring.ts         # AI credit assessment
│   │   ├── mock-data-generator.ts    # Test data generation
│   │   └── onboarding-orchestrator.ts # Process coordination
│   ├── genkit.ts                     # Gemini AI configuration
│   └── flows/                        # Genkit AI flows
│
├── components/
│   └── ai/
│       ├── AIProcessingStatus.tsx    # Real-time progress UI
│       └── AssessmentResult.tsx      # Detailed results display
│
├── app/
│   ├── api/
│   │   └── ai/
│   │       └── onboard/
│   │           └── route.ts          # AI processing endpoint
│   └── borrower/
│       └── onboard/
│           ├── individual/           # Individual borrower flow
│           └── business/             # Business borrower flow
│
└── docs/
    ├── AI_INTEGRATION_GUIDE.md       # Integration instructions
    └── ONBOARDING_DOCUMENTATION.md   # Process documentation
```

## 🔧 Setup

### 1. Install Dependencies

Already installed in your project:
```bash
npm install @genkit-ai/google-genai genkit
```

### 2. Get Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Copy the key

### 3. Configure Environment

Create `.env.local`:
```env
GOOGLE_GENAI_API_KEY=your_api_key_here
```

### 4. Run the Application

```bash
npm run dev
```

Visit `http://localhost:9002`

## 📊 AI Services

### Face Verification Service

```typescript
import { FaceVerificationService } from '@/ai/services/face-verification';

// Check if selfie is from a real person
const livenessResult = await FaceVerificationService.performLivenessCheck(
  imageBase64
);

if (!livenessResult.isPassed) {
  console.log('Spoofing detected:', livenessResult.spoofingType);
  console.log('Recommendations:', livenessResult.recommendations);
}

// Compare selfie with ID photo
const faceMatchResult = await FaceVerificationService.verifyFaceMatch(
  selfieBase64,
  idPhotoBase64
);

if (!faceMatchResult.isMatch) {
  console.log('Face mismatch reasons:', faceMatchResult.reasons);
  console.log('Fraud indicators:', faceMatchResult.fraudIndicators);
}
```

### ID Verification Service

```typescript
import { IDVerificationService } from '@/ai/services/id-verification';

// Verify ID authenticity
const idResult = await IDVerificationService.verifyIDDocument(
  frontImageBase64,
  backImageBase64
);

if (idResult.forgeryDetected) {
  console.log('FORGERY DETECTED!');
  console.log('Indicators:', idResult.forgeryIndicators);
  // Example: ["Inconsistent fonts", "Missing hologram", "Poor photo quality"]
}

// Extracted data is automatically populated
console.log('Name:', idResult.extractedData.fullName);
console.log('ID Number:', idResult.extractedData.idNumber);
console.log('DOB:', idResult.extractedData.dateOfBirth);
```

### Credit Scoring Service

```typescript
import { CreditScoringService } from '@/ai/services/credit-scoring';
import { MockDataGenerator } from '@/ai/services/mock-data-generator';

// Generate test data
const profile = MockDataGenerator.generateUserProfile('low'); // or 'medium', 'high'
const mpesaData = MockDataGenerator.generateMpesaTransactions(3, profile);
const bankData = MockDataGenerator.generateBankStatements(6, profile);

// Get AI assessment
const assessment = await CreditScoringService.assessIndividualCredit(
  profile,
  mpesaData,
  bankData,
  true,  // identity verified
  92,    // face match confidence
  88     // ID authenticity confidence
);

console.log('Credit Score:', assessment.creditScore);
console.log('Status:', assessment.approvalStatus);
console.log('Risk Level:', assessment.riskLevel);

if (assessment.approvalStatus === 'rejected') {
  console.log('Rejection reasons:', assessment.rejectionReasons);
  // Example: ["Forged ID detected: Missing security features"]
}

if (assessment.approvalStatus === 'approved') {
  console.log('Loan range:', assessment.loanRecommendation);
  console.log('Strengths:', assessment.strengths);
  console.log('AI Insights:', assessment.keyInsights);
}
```

## 🧪 Testing

### Test Scenarios

#### ✅ Approved Application
```typescript
const response = await fetch('/api/ai/onboard', {
  method: 'POST',
  body: JSON.stringify({
    type: 'individual',
    data: {
      livenessImage: validSelfieBase64,
      idFrontImage: genuineIDBase64,
      personalInfo: {
        monthlyIncome: 80000,
        employmentType: 'employed'
      },
      financialConnection: { type: 'mpesa' }
    }
  })
});
// Expected: Score 75+, Approved
```

#### ❌ Forged ID Detection
```typescript
// Upload a clearly forged ID
const response = await fetch('/api/ai/onboard', {
  method: 'POST',
  body: JSON.stringify({
    type: 'individual',
    data: {
      idFrontImage: forgedIDBase64,  // AI detects forgery
      // ... other data
    }
  })
});
// Expected: Rejection with detailed forgery indicators
// Example: "Inconsistent fonts", "Missing watermarks", "Photo tampering detected"
```

#### ❌ Face Mismatch
```typescript
// Upload selfie of different person than ID
const response = await fetch('/api/ai/onboard', {
  method: 'POST',
  body: JSON.stringify({
    type: 'individual',
    data: {
      livenessImage: personABase64,
      idFrontImage: personBBase64,  // Different people
      // ... other data
    }
  })
});
// Expected: "Face verification failed: Facial features do not match"
```

#### ❌ Spoofing Attempt
```typescript
// Upload a photo of a photo (print out or screen)
const response = await fetch('/api/ai/onboard', {
  method: 'POST',
  body: JSON.stringify({
    type: 'individual',
    data: {
      livenessImage: photoOfPhotoBase64,  // Picture of picture
      // ... other data
    }
  })
});
// Expected: "Liveness check failed: Photo spoofing detected"
```

### Mock Data Generator

```typescript
import { MockDataGenerator } from '@/ai/services/mock-data-generator';

// Generate different risk profiles
const lowRisk = MockDataGenerator.generateUserProfile('low');
// { monthlyIncome: 80000, employmentType: 'employed', hasDefaultedLoans: false }

const highRisk = MockDataGenerator.generateUserProfile('high');
// { monthlyIncome: 20000, hasDefaultedLoans: true, savingsPattern: 'none' }

// Generate realistic transactions
const mpesa = MockDataGenerator.generateMpesaTransactions(3, lowRisk);
// Returns 90 days of M-Pesa history with salaries, bills, etc.

const bank = MockDataGenerator.generateBankStatements(6, lowRisk);
// Returns 6 months of bank statements
```

## 📱 UI Components

### AI Processing Status

Shows real-time processing with progress bar:

```typescript
import { AIProcessingStatus } from '@/components/ai/AIProcessingStatus';

<AIProcessingStatus
  steps={[
    { step: 'Liveness Detection', status: 'completed', message: 'Passed with 94% confidence' },
    { step: 'ID Verification', status: 'processing', message: 'Analyzing document...' },
    { step: 'Face Matching', status: 'pending', message: 'Waiting...' }
  ]}
  currentProgress={45}
  currentAction="Verifying ID document authenticity..."
  estimatedTimeRemaining={30}
/>
```

### Assessment Result Display

Shows comprehensive results with reasoning:

```typescript
import { AssessmentResult } from '@/components/ai/AssessmentResult';

<AssessmentResult
  result={assessmentData}
  onViewLoans={() => router.push('/borrower/loans')}
  onReturnToDashboard={() => router.push('/borrower/dashboard')}
/>
```

## 🎯 Key Features

### Fraud Detection

The AI system detects:
- ✅ Forged ID documents
- ✅ Face spoofing (photos, videos, masks)
- ✅ Identity theft attempts
- ✅ Document tampering
- ✅ Mismatched information

### Transparent Reasoning

Every decision includes:
- ✅ Credit score breakdown (6 factors)
- ✅ Approval/rejection reasons
- ✅ Strengths and weaknesses
- ✅ Improvement suggestions
- ✅ AI-generated insights

### Smart Assessment

The AI analyzes:
- ✅ Income stability patterns
- ✅ Expense management
- ✅ Debt burden
- ✅ Payment history
- ✅ Financial behavior
- ✅ Employment history

## 📖 Documentation

- **[AI Integration Guide](./docs/AI_INTEGRATION_GUIDE.md)** - How to integrate AI into your pages
- **[Onboarding Documentation](./ONBOARDING_DOCUMENTATION.md)** - Complete onboarding flow details

## 🔐 Security

- All images encrypted in transit
- No credentials stored
- Read-only financial data access
- AI processing logged for audit
- Fraud attempts reported

## 🚦 API Endpoints

### POST `/api/ai/onboard`

Process onboarding with AI verification:

```typescript
// Request
{
  "type": "individual" | "business",
  "data": {
    // For individuals
    "livenessImage": "base64...",
    "idFrontImage": "base64...",
    "idBackImage": "base64...",
    "personalInfo": { ... },
    "financialConnection": { ... }
  }
}

// Response
{
  "success": true,
  "userId": "USER_123456",
  "assessmentResult": {
    "creditScore": 82,
    "approvalStatus": "approved",
    "loanRecommendation": { ... },
    "keyInsights": [ ... ],
    "strengths": [ ... ],
    "weaknesses": [ ... ]
  },
  "processingSteps": [ ... ]
}
```

## 🎨 Example Responses

### Successful Approval

```json
{
  "creditScore": 85,
  "approvalStatus": "approved",
  "riskLevel": "low",
  "loanRecommendation": {
    "minAmount": 100000,
    "maxAmount": 250000,
    "interestRateMin": 8,
    "interestRateMax": 11,
    "termMin": 6,
    "termMax": 24
  },
  "keyInsights": [
    "Consistent salary deposits every month for 24+ months",
    "Low debt-to-income ratio of 22% indicates good financial health",
    "Regular savings pattern detected, averaging KES 15,000 per month"
  ],
  "strengths": [
    "Stable employment with verified income",
    "Excellent payment history with no defaults",
    "Strong savings discipline"
  ]
}
```

### Forged ID Rejection

```json
{
  "creditScore": 0,
  "approvalStatus": "rejected",
  "rejectionReasons": [
    "FORGERY DETECTED: ID document shows inconsistent font spacing and sizing",
    "FORGERY DETECTED: Missing holographic security features expected on genuine Kenyan IDs",
    "FORGERY DETECTED: Photo appears to be digitally inserted rather than printed",
    "SECURITY ALERT: Document shows signs of tampering and should not be accepted"
  ],
  "improvementSuggestions": [
    "Please provide a genuine, unaltered national ID or passport",
    "Ensure the document has all original security features",
    "Take clear photos in good lighting without glare or shadows"
  ]
}
```

### Face Mismatch Rejection

```json
{
  "creditScore": 0,
  "approvalStatus": "rejected",
  "rejectionReasons": [
    "Face verification failed: The person in the live selfie does not match the ID photo",
    "Significant differences detected: Different eye shape and spacing",
    "Facial bone structure inconsistency: Different jaw and cheekbone structure",
    "FRAUD ALERT: Potential identity theft or impersonation attempt detected"
  ],
  "fraudIndicators": [
    "Facial features mismatch suggests different individuals",
    "Identity verification confidence below security threshold (43%)"
  ]
}
```

## 🛠️ Development

```bash
# Run development server
npm run dev

# Run Genkit developer UI (for testing AI flows)
npm run genkit:dev

# Build for production
npm run build

# Type check
npm run typecheck
```

## 📈 Next Steps

1. ✅ Set up Gemini API key
2. ✅ Test with mock data
3. ✅ Integrate into onboarding pages
4. ✅ Customize assessment criteria
5. ✅ Add fraud reporting
6. ✅ Implement analytics tracking

## 💡 Tips

- Start with mock data to understand AI responses
- Test all fraud scenarios thoroughly
- Customize rejection messages for your brand
- Monitor AI confidence scores
- Adjust scoring weights based on your risk appetite
- Log all AI decisions for compliance

## 🆘 Troubleshooting

**AI not working?**
- Check `GOOGLE_GENAI_API_KEY` in `.env.local`
- Verify API key is valid at [AI Studio](https://aistudio.google.com/)
- Check console for error messages

**Low confidence scores?**
- Improve image quality (resolution, lighting)
- Use clear, unobstructed photos
- Ensure images are JPEG/PNG format

**Need help?**
- Check the [Integration Guide](./docs/AI_INTEGRATION_GUIDE.md)
- Review example code in `/app/api/ai/`
- Test with `MockDataGenerator` first

---

**Built with ❤️ using Google Gemini AI, Next.js, and Genkit**
