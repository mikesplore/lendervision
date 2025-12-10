'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, Camera, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const livenessPrompts = [
  'Please center your face in the frame.',
  'Blink your eyes now.',
  'Turn your head slightly to the left.',
  'Smile for the camera.',
  'Verification in progress...',
];

export default function IdentityPage() {
  const { toast } = useToast();
  const [promptIndex, setPromptIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [livenessComplete, setLivenessComplete] = useState(false);

  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
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
          description: 'Please enable camera permissions in your browser settings to use this app.',
        });
      }
    };

    getCameraPermission();
  }, [toast]);


  useEffect(() => {
    if (hasCameraPermission && promptIndex < livenessPrompts.length) {
      const timer = setTimeout(() => {
        setPromptIndex(promptIndex + 1);
        setProgress(((promptIndex + 1) / livenessPrompts.length) * 100);
      }, 2000);
      return () => clearTimeout(timer);
    } else if (hasCameraPermission) {
      setLivenessComplete(true);
       if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    }
  }, [promptIndex, hasCameraPermission]);

  const livenessImage = PlaceHolderImages.find(p => p.id === 'liveness-check');
  const idFrontImage = PlaceHolderImages.find(p => p.id === 'id-card-front');
  const idBackImage = PlaceHolderImages.find(p => p.id === 'id-card-back');

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Step 1: Verify Your Identity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative w-64 h-64 rounded-full border-4 border-dashed border-primary flex items-center justify-center overflow-hidden">
                <video ref={videoRef} className="w-full h-full object-cover scale-[1.7]" autoPlay muted playsInline />
                {!livenessComplete && <div className="absolute inset-0 bg-black/30" />}
            </div>

            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-semibold mb-2">Liveness Detection</h3>
              <p className="text-muted-foreground mb-4">
                To prevent fraud, we need to verify you're a real person.
              </p>
              <div className="h-16 flex items-center justify-center md:justify-start">
                <p className="text-lg font-medium text-primary">{livenessPrompts[promptIndex]}</p>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {livenessComplete && (
        <Card className="animate-in fade-in-50 duration-500">
            <CardHeader>
                <CardTitle>Upload Your National ID</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
                <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed rounded-lg">
                    <h4 className="font-semibold">Front of ID</h4>
                    <div className="w-[300px] h-[190px] rounded-md overflow-hidden bg-muted flex items-center justify-center">
                        {idFrontImage ? (
                            <Image 
                                src={idFrontImage.imageUrl}
                                alt={idFrontImage.description}
                                data-ai-hint={idFrontImage.imageHint}
                                width={300}
                                height={190}
                                className="rounded-md object-cover w-full h-full"
                            />
                        ) : <Camera className="w-12 h-12 text-muted-foreground" />}
                    </div>
                    <Button variant="outline"><Upload className="mr-2 h-4 w-4" /> Upload File</Button>
                </div>
                <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed rounded-lg">
                    <h4 className="font-semibold">Back of ID</h4>
                     <div className="w-[300px] h-[190px] rounded-md overflow-hidden bg-muted flex items-center justify-center">
                        {idBackImage ? (
                            <Image 
                                src={idBackImage.imageUrl}
                                alt={idBackImage.description}
                                data-ai-hint={idBackImage.imageHint}
                                width={300}
                                height={190}
                                className="rounded-md object-cover w-full h-full"
                            />
                        ) : <Camera className="w-12 h-12 text-muted-foreground" />}
                    </div>
                    <Button variant="outline"><Upload className="mr-2 h-4 w-4" /> Upload File</Button>
                </div>
            </CardContent>
        </Card>
      )}

      <div className="flex justify-end mt-8">
        <Button asChild size="lg" disabled={!livenessComplete}>
          <Link href="/apply/financials">
            Next Step <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
