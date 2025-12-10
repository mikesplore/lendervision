# QuickScore Borrower Onboarding Documentation

## Overview

QuickScore offers two distinct onboarding flows for borrowers:

1. **Individual Borrower Onboarding** - For personal loan applications
2. **Business Borrower Onboarding** - For business loan applications

Both flows are designed to collect necessary information, verify identity, assess creditworthiness, and provide personalized loan recommendations.

---

## Individual Borrower Onboarding Flow

### Step 1: Identity Verification (`/borrower/onboard/individual/identity`)

**Purpose**: Verify the applicant's identity and prevent fraud.

**Features**:
- **Liveness Detection**: 5-step guided facial recognition process
  - Center face in frame
  - Blink eyes
  - Turn head left
  - Smile for camera
  - Verification processing
- **ID Document Upload**: Front and back of national ID/passport
- **Camera Permission**: Requires browser camera access
- **Security**: Encrypted data, reviewed only by compliance team

**Data Collected**:
- Live facial images (5 poses)
- National ID front and back photos
- Basic identity verification

**Next Step**: Personal Details

---

### Step 2: Personal Details (`/borrower/onboard/individual/details`)

**Purpose**: Collect personal and contact information.

**Form Fields**:
- **Name**: First name, last name (pre-filled from ID)
- **Date of Birth**: From ID verification
- **Contact Information**:
  - Email address
  - Phone number
- **Residential Address**:
  - Street address
  - City (Kenya only)
  - Country (fixed to Kenya)
- **Employment Information**:
  - Employment status (Employed/Self-employed/Unemployed/Student/Retired)
  - Employer name (if employed)
- **Income Information**:
  - Monthly income range (optional but recommended)
  - Used for loan amount recommendations

**Validation**: All required fields must be completed before proceeding.

**Next Step**: Financial Data Connection

---

### Step 3: Financial Data Connection (`/borrower/onboard/individual/financials`)

**Purpose**: Connect financial accounts to analyze spending patterns and creditworthiness.

**Options**:
1. **M-Pesa Account**:
   - Phone number linked to M-Pesa
   - Analyzes last 90 days of transactions
   - Access: transaction volume, daily patterns, balance trends

2. **Bank Account**:
   - Bank name and account number
   - Analyzes 6-12 months of statements
   - Access: monthly income patterns, expense trends, cash balance health

3. **Skip Option**: Continue with limited data (reduced assessment accuracy)

**Security Features**:
- No password/PIN storage
- Encrypted connections
- Read-only access to transaction data

**Next Step**: Credit Assessment

---

### Step 4: Credit Assessment (`/borrower/onboard/individual/assessment`)

**Purpose**: Generate personalized loan recommendations based on collected data.

**Assessment Components**:
- **Credit Score**: 0-100 scale based on financial activity
- **Approval Status**: Approved/Conditionally Approved/Under Review
- **Loan Metrics**:
  - Approved loan range (KES)
  - Interest rate range (% p.a.)
  - Repayment period range (months)
- **Key Insights**: AI-generated analysis of financial health
- **Financial Summary**: Income, expenses, savings metrics

**Results Display**:
- Visual progress indicators
- Color-coded status badges
- Detailed breakdown of assessment factors
- Email confirmation sent to user

**Completion**: Redirects to borrower dashboard for loan exploration.

---

## Business Borrower Onboarding Flow

### Step 1: Business Information (`/borrower/onboard/business/info`)

**Purpose**: Collect basic business details for verification.

**Form Fields**:
- **Business Name**: Legal registered name
- **Registration Number**: BRN from business registry
- **Date of Incorporation**: Business age calculation
- **Business Type**: Sole proprietorship/Partnership/Limited Liability/Corporation/Cooperative
- **Industry Sector**: 12 predefined categories
- **Business Address**: Headquarters location
- **Website**: Optional online presence verification

**Validation**: Cross-checked against government registries.

**Next Step**: Document Upload

---

### Step 2: Document Verification (`/borrower/onboard/business/documents`)

**Purpose**: Verify business legitimacy through official documents.

**Required Documents**:
1. **Business Registration Certificate** (Required)
   - Extracts: Registration number, incorporation date, business name, structure
   - Verifies business legitimacy

2. **Tax ID / PIN Certificate** (Required)
   - Confirms tax compliance status
   - Cross-verifies registration number

3. **Proof of Address** (Optional but recommended)
   - Utility bill, lease agreement, property deed
   - Confirms business location

**Process**:
- Secure encrypted upload
- Manual review by compliance team (24-48 hours)
- Status updates via email

**Next Step**: Authorized Representative

---

### Step 3: Authorized Representative (`/borrower/onboard/business/representative`)

**Purpose**: Verify the person applying has authority to borrow on behalf of the business.

**Form Fields**:
- **Full Name**: Representative's legal name
- **Relationship to Business**:
  - Owner (≥51% stake)
  - Director/Board Member
  - Manager/Authorized Signatory
  - Other (specify)
- **Personal ID Number**: For identity verification
- **Contact Information**:
  - Email address
  - Phone number

**Authority Verification**: Role determines borrowing authority level.

**Next Step**: Financial Data Connection

---

### Step 4: Business Financial Data (`/borrower/onboard/business/financials`)

**Purpose**: Analyze business financial health and cash flow patterns.

**Data Sources**:
1. **Till/Paybill Number**:
   - Business M-Pesa account
   - Analyzes: transaction volume, daily revenue, payment consistency, customer concentration

2. **Bank Account**:
   - Business bank account details
   - Analyzes: 6-12 months statements, revenue patterns, expense trends, cash balance

3. **Manual Upload**:
   - Direct bank statement upload
   - Manual review (2-3 business days)

**Additional Information**:
- **Employee Count**: Business size indicator
- **Monthly Revenue**: Estimated average (verified against data)
- **Loan Purpose**: Working capital, equipment, expansion, etc.
- **Desired Loan Amount**: Requested amount in KES
- **Preferred Term**: Repayment period in months

**Next Step**: Business Credit Assessment

---

### Step 5: Business Credit Assessment (`/borrower/onboard/business/assessment`)

**Purpose**: Generate comprehensive business credit analysis and loan recommendations.

**Assessment Components**:
- **Business Credit Score**: 0-100 scale
- **Approval Status**: Approved/Conditionally Approved/Under Review
- **Loan Terms**:
  - Approved loan range (KES)
  - Interest rate range (% p.a.)
  - Repayment period range (months)
- **Financial Health Metrics**:
  - Revenue consistency (Growing/Stable/Declining)
  - Monthly volatility (Low/Medium/High)
  - Cash inflow frequency (Daily/Weekly/Monthly)
  - Risk level assessment
- **Key Insights**: AI analysis of business performance
- **Conditions**: Additional requirements for conditional approvals

**Business-Specific Analysis**:
- Transaction patterns and seasonality
- Employee growth indicators
- Industry risk factors
- Cash flow predictability

**Completion**: Full assessment results with next steps for loan application.

---

## Technical Implementation Details

### Navigation & Progress Tracking

**Progress Component**: `ApplicationProgress.tsx`
- Visual step indicator with current/completed/pending states
- Automatic path detection (individual vs business)
- Clickable navigation between completed steps

**Layout Components**:
- Individual: `layout.tsx` with progress tracker
- Business: `layout.tsx` with progress tracker
- Consistent header with QuickScore branding

### Data Flow & Storage

**Firebase Integration**:
- User profiles stored in `users/{uid}`
- Borrower data in `borrowers/{uid}`
- Real-time data fetching in dashboards
- Secure authentication with role-based access

**Form Validation**:
- Required field validation
- Email/phone format checking
- Conditional field display based on selections

### Security & Compliance

**Data Protection**:
- Encrypted file uploads
- Secure API connections
- No sensitive credential storage
- Compliance team manual reviews

**User Experience**:
- Loading states during processing
- Error handling with user-friendly messages
- Progress indicators for long operations
- Email confirmations for major actions

### Assessment Algorithm

**Individual Scoring Factors**:
- Identity verification completeness
- Financial data connectivity
- Transaction consistency
- Income stability patterns
- Credit utilization indicators

**Business Scoring Factors**:
- Business registration verification
- Financial transaction volume
- Revenue consistency
- Industry risk assessment
- Representative authority confirmation

---

## User Journey Summary

### Individual Borrower
1. **Identity** → Liveness + ID upload
2. **Details** → Personal information
3. **Financials** → Account connection
4. **Assessment** → Credit score & loan offers

### Business Borrower
1. **Business Info** → Company details
2. **Documents** → Legal verification
3. **Representative** → Authority confirmation
4. **Financials** → Business data connection
5. **Assessment** → Business credit analysis

Both flows culminate in personalized loan recommendations and dashboard access for loan exploration and application.</content>
<parameter name="filePath">/workspaces/lendervision/ONBOARDING_DOCUMENTATION.md