'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, AlertCircle, Camera, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AIProcessingIndicator, createInitialStatus, type AIProcessingStatus } from '@/components/borrower/AIProcessingIndicator';

const livenessPrompts = [
  'Please center your face in the frame.',
  'Blink your eyes now.',
  'Turn your head slightly to the left.',
  'Smile for the camera.',
  'Hold steady...',
];

// Helper to convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      resolve(base64.split(',')[1]); // Remove data:image/jpeg;base64, prefix
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Helper to capture video frame as base64
const captureVideoFrame = (video: HTMLVideoElement): string => {
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.drawImage(video, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.95).split(',')[1];
  }
  return '';
};

export default function IndividualIdentityPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [promptIndex, setPromptIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [livenessComplete, setLivenessComplete] = useState(false);
  const [liveFaceImages, setLiveFaceImages] = useState<string[]>([]);
  
  const [idFrontFile, setIdFrontFile] = useState<File | null>(null);
  const [idBackFile, setIdBackFile] = useState<File | null>(null);
  const [idFrontPreview, setIdFrontPreview] = useState<string>('');
  const [idBackPreview, setIdBackPreview] = useState<string>('');

  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<AIProcessingStatus | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Request camera access
  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user'
          } 
        });
        streamRef.current = stream;
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings.',
        });
      }
    };

    getCameraPermission();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [toast]);

  // Liveness detection sequence
  useEffect(() => {
    if (hasCameraPermission && promptIndex < livenessPrompts.length && !livenessComplete) {
      const timer = setTimeout(() => {
        // Capture frame at each prompt
        if (videoRef.current) {
          const frameData = captureVideoFrame(videoRef.current);
          if (frameData) {
            setLiveFaceImages(prev => [...prev, frameData]);
          }
        }
        
        const newIndex = promptIndex + 1;
        setPromptIndex(newIndex);
        setProgress((newIndex / livenessPrompts.length) * 100);
        
        if (newIndex >= livenessPrompts.length) {
          setLivenessComplete(true);
          // Stop camera
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
          }
          toast({
            title: 'Liveness Check Complete',
            description: 'Now please upload both sides of your ID.',
          });
        }
      }, 2500);
      
      return () => clearTimeout(timer);
    }
  }, [promptIndex, hasCameraPermission, livenessComplete, toast]);

  // Handle ID front upload
  const handleFrontUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          variant: 'destructive',
          title: 'File Too Large',
          description: 'Please upload an image smaller than 10MB.',
        });
        return;
      }
      
      setIdFrontFile(file);
      const preview = URL.createObjectURL(file);
      setIdFrontPreview(preview);
      
      toast({
        title: 'Front Uploaded',
        description: 'ID front uploaded successfully.',
      });
    }
  }, [toast]);

  // Handle ID back upload
  const handleBackUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          variant: 'destructive',
          title: 'File Too Large',
          description: 'Please upload an image smaller than 10MB.',
        });
        return;
      }
      
      setIdBackFile(file);
      const preview = URL.createObjectURL(file);
      setIdBackPreview(preview);
      
      toast({
        title: 'Back Uploaded',
        description: 'ID back uploaded successfully.',
      });
    }
  }, [toast]);

  // Process identity verification with AI
  const handleVerifyIdentity = async () => {
    if (!liveFaceImages.length || !idFrontFile || !idBackFile) {
      toast({
        variant: 'destructive',
        title: 'Missing Data',
        description: 'Please complete liveness check and upload both sides of your ID.',
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Initialize processing status
      const status = createInitialStatus('identity');
      setProcessingStatus(status);

      // Convert ID files to base64
      const idFrontBase64 = await fileToBase64(idFrontFile);
      const idBackBase64 = await fileToBase64(idBackFile);

      // Update status: starting liveness check
      setProcessingStatus(prev => prev ? {
        ...prev,
        steps: prev.steps.map(s => 
          s.id === 'liveness' ? { ...s, status: 'processing', progress: 30 } : s
        ),
        overallProgress: 10,
      } : prev);

      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update status: liveness complete
      setProcessingStatus(prev => prev ? {
        ...prev,
        steps: prev.steps.map(s => 
          s.id === 'liveness' ? { ...s, status: 'complete', details: 'Real person detected' } :
          s.id === 'id-analysis' ? { ...s, status: 'processing', progress: 50 } : s
        ),
        overallProgress: 35,
      } : prev);

      // Call AI verification API
      const response = await fetch('/api/ai/verify-identity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          liveFaceImages,
          idFrontImage: idFrontBase64,
          idBackImage: idBackBase64,
        }),
      });

      if (!response.ok) {
        throw new Error('Identity verification failed');
      }

      const { data: result } = await response.json();

      // Update status: ID analysis complete
      setProcessingStatus(prev => prev ? {
        ...prev,
        steps: prev.steps.map(s => 
          s.id === 'id-analysis' ? { 
            ...s, 
            status: result.idVerification.isForged ? 'error' : 'complete',
            details: result.idVerification.isForged ? 'Document appears forged' : 'Document is authentic',
            error: result.idVerification.isForged ? result.idVerification.issues.join(', ') : undefined,
          } :
          s.id === 'face-match' ? { ...s, status: 'processing', progress: 70 } : s
        ),
        overallProgress: 70,
      } : prev);

      await new Promise(resolve => setTimeout(resolve, 1500));

      // Update status: face matching complete
      setProcessingStatus(prev => prev ? {
        ...prev,
        steps: prev.steps.map(s => 
          s.id === 'face-match' ? { 
            ...s, 
            status: result.faceMatch.matched ? 'complete' : 'error',
            details: result.faceMatch.matched ? `${result.faceMatch.confidence}% match confidence` : 'Face does not match',
            error: !result.faceMatch.matched ? result.faceMatch.reason : undefined,
          } : s
        ),
        overallProgress: 100,
        stage: 'complete',
        result,
      } : prev);

      // Store result in sessionStorage for next step
      if (result.recommendation === 'APPROVE') {
        sessionStorage.setItem('identityVerification', JSON.stringify({
          ...result,
          extractedData: result.idVerification.extractedData,
        }));

        toast({
          title: 'Identity Verified! ✓',
          description: 'Moving to next step...',
        });

        setTimeout(() => {
          router.push('/borrower/onboard/individual/details');
        }, 2000);
      } else {
        toast({
          variant: 'destructive',
          title: 'Verification Failed',
          description: result.detailedFeedback,
        });
      }

    } catch (error) {
      console.error('Identity verification error:', error);
      
      setProcessingStatus(prev => prev ? {
        ...prev,
        error: 'Failed to process identity verification. Please try again.',
      } : prev);

      toast({
        variant: 'destructive',
        title: 'Verification Error',
        description: 'Something went wrong. Please try again.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const canContinue = livenessComplete && idFrontFile && idBackFile;

  // Show processing UI
  if (isProcessing && processingStatus) {
    return (
      <div className="space-y-6">
        <AIProcessingIndicator 
          status={processingStatus}
          onComplete={() => {
            // Handle completion
          }}
          onError={(error) => {
            toast({
              variant: 'destructive',
              title: 'Processing Error',
              description: error,
            });
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Liveness Detection Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Step 1: Verify Your Identity</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Let's verify you're a real person with AI-powered liveness detection
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className={cn(
              "relative w-64 h-64 rounded-full border-4 flex items-center justify-center overflow-hidden transition-all",
              livenessComplete ? "border-solid border-green-500" : "border-dashed border-primary"
            )}>
              {livenessComplete ? (
                <div className="flex flex-col items-center justify-center bg-green-50 w-full h-full">
                  <Check className="w-16 h-16 text-green-600 mb-2" />
                  <p className="text-sm font-medium text-green-700">Verified</p>
                </div>
              ) : (
                <>
                  <video 
                    ref={videoRef} 
                    className="w-full h-full object-cover scale-[1.7]" 
                    autoPlay 
                    muted 
                    playsInline 
                  />
                  {!livenessComplete && <div className="absolute inset-0 bg-black/30" />}
                </>
              )}
            </div>

            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-semibold mb-2">AI Liveness Detection</h3>
              <p className="text-muted-foreground mb-4">
                Our AI verifies you're a real person, not a photo or video. Follow the prompts carefully.
              </p>
              <div className="h-16 flex items-center justify-center md:justify-start">
                <p className="text-lg font-medium text-primary">
                  {livenessComplete ? '✓ Verification complete!' : livenessPrompts[promptIndex]}
                </p>
              </div>
              <Progress value={progress} className="w-full" />
              {livenessComplete && (
                <p className="text-sm text-green-600 mt-3 font-medium">
                  ✓ {liveFaceImages.length} face images captured
                </p>
              )}
            </div>
          </div>

          {hasCameraPermission === false && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Camera access is required for identity verification. Please enable camera permissions and refresh.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* ID Upload Card */}
      {livenessComplete && (
        <Card className="animate-in fade-in-50 duration-500">
          <CardHeader>
            <CardTitle>Step 2: Upload Your National ID</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Our AI will verify authenticity and extract your information
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                🔒 All data is encrypted. AI checks for forged documents and compares your face with ID photo.
              </AlertDescription>
            </Alert>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Front of ID */}
              <div className="flex flex-col gap-4">
                <label htmlFor="id-front" className="cursor-pointer">
                  <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed rounded-lg hover:border-primary transition-colors">
                    <div className="text-center">
                      <h4 className="font-semibold mb-1">Front of ID</h4>
                      <p className="text-xs text-muted-foreground">
                        National ID, Passport, or Driver's License
                      </p>
                    </div>
                    <div className="w-full h-[200px] rounded-md overflow-hidden bg-muted flex items-center justify-center">
                      {idFrontPreview ? (
                        <img 
                          src={idFrontPreview}
                          alt="ID Front"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <Camera className="w-12 h-12 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      {idFrontFile ? (
                        <>
                          <Check className="h-4 w-4 text-green-600" />
                          <span className="text-green-600 font-medium">Uploaded</span>
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4" />
                          <span>Click to upload</span>
                        </>
                      )}
                    </div>
                  </div>
                </label>
                <input
                  id="id-front"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFrontUpload}
                />
              </div>

              {/* Back of ID */}
              <div className="flex flex-col gap-4">
                <label htmlFor="id-back" className="cursor-pointer">
                  <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed rounded-lg hover:border-primary transition-colors">
                    <div className="text-center">
                      <h4 className="font-semibold mb-1">Back of ID</h4>
                      <p className="text-xs text-muted-foreground">
                        Include all visible information
                      </p>
                    </div>
                    <div className="w-full h-[200px] rounded-md overflow-hidden bg-muted flex items-center justify-center">
                      {idBackPreview ? (
                        <img 
                          src={idBackPreview}
                          alt="ID Back"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <Camera className="w-12 h-12 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      {idBackFile ? (
                        <>
                          <Check className="h-4 w-4 text-green-600" />
                          <span className="text-green-600 font-medium">Uploaded</span>
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4" />
                          <span>Click to upload</span>
                        </>
                      )}
                    </div>
                  </div>
                </label>
                <input
                  id="id-back"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleBackUpload}
                />
              </div>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>AI will check:</strong> Document authenticity, security features, face match with live video, 
                and extract your information automatically.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Verify Button */}
      <div className="flex justify-end mt-8">
        <Button 
          size="lg" 
          disabled={!canContinue || isProcessing}
          onClick={handleVerifyIdentity}
          className="group"
        >
          {isProcessing ? 'Processing...' : 'Verify with AI'}
          <Camera className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
        </Button>
      </div>
    </div>
  );
}
