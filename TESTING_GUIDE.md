# Testing Guide: AI-Powered Identity Verification

## Quick Start

### 1. Activate the New Identity Page

Replace the old hardcoded version with the AI-powered version:

```bash
cd /workspaces/lendervision

# Backup old version
mv src/app/borrower/onboard/individual/identity/page.tsx src/app/borrower/onboard/individual/identity/page-backup.tsx

# Activate new version
mv src/app/borrower/onboard/individual/identity-new.tsx src/app/borrower/onboard/individual/identity/page.tsx
```

### 2. Access the Page

With your dev server running (`npm run dev`), navigate to:
```
http://localhost:9002/borrower/onboard/individual/identity
```

---

## Testing Scenarios

### Scenario 1: Happy Path (Should APPROVE)

**Steps**:
1. Allow camera access when prompted
2. Follow all liveness prompts:
   - Center your face
   - Blink your eyes
   - Turn head left
   - Smile
   - Hold steady
3. Upload a CLEAR, HIGH-QUALITY ID photo (front)
4. Upload a CLEAR, HIGH-QUALITY ID photo (back)
5. Click "Verify with AI"

**Expected Result**:
- ✅ Liveness check: PASSED
- ✅ ID verification: AUTHENTIC
- ✅ Face match: MATCHED (high confidence %)
- ✅ Recommendation: APPROVE
- ✅ Auto-redirect to details page after 2 seconds

**What AI Checks**:
- Your face is consistent across all liveness frames
- Natural blinking and movement detected
- ID security features present (holograms, watermarks)
- ID text is clear and properly formatted
- Face on ID matches your live face
- Document is not expired

---

### Scenario 2: Forged ID (Should REJECT)

**Steps**:
1. Complete liveness check normally
2. Upload a SUSPICIOUS ID:
   - Photocopy of an ID
   - Screenshot of an ID
   - Edited image with inconsistent fonts
   - ID with poor print quality
3. Click "Verify with AI"

**Expected Result**:
- ✅ Liveness check: PASSED
- ❌ ID verification: FORGED
- ⏸️ Face match: NOT PERFORMED
- ❌ Recommendation: REJECT
- 📋 Detailed feedback explaining why (e.g., "Inconsistent font spacing detected", "Missing security watermarks")

**AI Should Detect**:
- Inconsistent printing quality
- Missing security features
- Font irregularities
- Digital manipulation artifacts
- Poor resolution indicating photocopy

---

### Scenario 3: Face Mismatch (Should REJECT)

**Steps**:
1. Complete liveness check normally
2. Upload someone ELSE's ID (friend, family member, or Google image)
3. Click "Verify with AI"

**Expected Result**:
- ✅ Liveness check: PASSED
- ✅ ID verification: AUTHENTIC
- ❌ Face match: NOT MATCHED
- ❌ Recommendation: REJECT
- 📋 Feedback: "Face in live video does not match ID photo. Reason: [specific differences]"

**AI Should Detect**:
- Different facial structure
- Different eye shape/color
- Different nose/mouth features
- Age inconsistency
- Skin tone differences

---

### Scenario 4: No Camera Access (Should ERROR)

**Steps**:
1. DENY camera permission when browser prompts
2. Observe error message

**Expected Result**:
- ❌ Red error alert appears
- 📋 "Camera access is required for identity verification"
- 🔒 Cannot proceed without camera

---

### Scenario 5: Incomplete Upload (Should DISABLE)

**Steps**:
1. Complete liveness check
2. Upload only FRONT of ID (not back)
3. Try to click "Verify with AI"

**Expected Result**:
- Button should be DISABLED
- Cannot submit until both ID sides uploaded

---

## Observing AI Processing

When you click "Verify with AI", you'll see:

### Step 1: Liveness Detection Analysis
```
⏳ Processing...
"Verifying you are a real person"
```

### Step 2: ID Document Analysis
```
⏳ Processing...
"Checking document authenticity"
- Analyzing security features
- Checking for forgery signs
- Extracting text data
```

### Step 3: Face Matching
```
⏳ Processing...
"Comparing your face with ID photo"
- Analyzing facial features
- Computing confidence score
```

### Final Result
Either:
- ✅ All green checkmarks → APPROVED → Redirect
- ❌ Red X with detailed error → REJECTED → Show feedback
- ⚠️ Yellow warning → MANUAL_REVIEW → Instructions provided

---

## Understanding AI Feedback

### Good Feedback Examples

**Identity Verified**:
> "Identity verified successfully! Your ID is authentic, liveness check passed, and your face matches your ID photo with 94% confidence."

**Forged ID Detected**:
> "Identity verification failed. Your ID document appears to be forged or tampered with. Issues detected: Inconsistent font spacing in ID number field, missing holographic overlay, poor print resolution suggesting photocopy. Please contact support if you believe this is an error."

**Face Mismatch**:
> "Face matching failed. The face in your live video does not match the face on your ID document. Reason: Significant differences in facial structure (jawline, nose shape) and eye color. Please ensure you're using your own ID and try again."

**Liveness Failed**:
> "Liveness detection failed. We could not verify that you are a real person in front of the camera. Issues: Static face detected (no natural movement), consistent lighting suggesting photo, no depth perception detected. Please try again with proper lighting and follow all prompts carefully."

---

## Debugging

### Check Console Logs

Open browser DevTools (F12) and watch Console for:
```
Starting identity verification...
Generated X mock transactions
Identity verification complete: APPROVE/REJECT
Credit assessment complete: APPROVED - Score: 85
```

### Check Network Tab

Look for API calls:
- `POST /api/ai/verify-identity` - Should return 200 with result
- Response should have `success: true` and `data` object

### Check SessionStorage

After successful verification:
```javascript
// In browser console
console.log(JSON.parse(sessionStorage.getItem('identityVerification')));
```

Should contain:
- Confidence scores
- Extracted data (name, DOB, ID number)
- Verification status
- Recommendation

---

## Troubleshooting

### "Failed to verify identity"
**Cause**: Gemini API error or rate limit
**Solution**: Check `.env` has valid `GOOGLE_GENAI_API_KEY`

### Images not uploading
**Cause**: File size too large
**Solution**: Ensure images < 10MB

### Camera not working
**Cause**: Browser permissions or HTTPS required
**Solution**: 
- Allow camera in browser settings
- If on remote dev, may need HTTPS

### Processing takes too long
**Cause**: Large images or slow AI response
**Solution**: 
- Compress images before upload
- Gemini API can take 5-15 seconds for vision analysis

### Always getting REJECT
**Cause**: AI being too strict
**Solution**: 
- Use high-quality, well-lit photos
- Ensure ID is current (not expired)
- Try different lighting angles

---

## Expected Processing Times

- **Liveness Check**: 12-15 seconds (2.5s per prompt × 5 prompts)
- **File Upload**: < 1 second
- **AI Verification**: 10-20 seconds
  - Liveness analysis: ~5 seconds
  - ID forgery detection: ~8 seconds  
  - Face matching: ~7 seconds
- **Total Time**: ~30-40 seconds

---

## Next Steps After Testing

Once identity verification works:

1. **Update Details Page** to use extracted data
2. **Update Financials Page** with real AI analysis
3. **Update Assessment Page** with real credit scoring
4. **Test end-to-end flow** with data passing between pages

---

## Questions to Answer While Testing

1. ✅ Does the AI correctly identify authentic IDs?
2. ✅ Does it detect obviously fake/forged IDs?
3. ✅ Does face matching work accurately?
4. ✅ Is the feedback helpful and specific?
5. ✅ Are false positives/negatives acceptable?
6. ✅ Is processing time acceptable (30-40s)?
7. ✅ Do users understand what's happening during processing?
8. ✅ Are errors handled gracefully?

---

## Demo Images for Testing

If you need test images:

**Good Quality ID** (should PASS):
- High resolution (1200x800+)
- Clear text
- Proper lighting
- No glare or shadows
- All security features visible

**Bad Quality ID** (should FAIL):
- Photocopy or screenshot
- Blurry text
- Edited/manipulated
- Low resolution
- Missing security features

Let me know what you observe and I'll help tune the AI parameters! 🧪
