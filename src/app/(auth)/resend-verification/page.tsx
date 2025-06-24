'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { authService } from '@/lib/authService';
import { toast } from 'sonner';

export default function ResendVerificationPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await authService.resendVerification(email);
      if (response.success) {
        // TODO: Show success message
        toast.success(
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span>{response.message}</span>
          </div>,
          {
            duration: 3000,
          },
        );
      } else {
        setError(
          response.message ||
            'Failed to send verification email. Please try again.',
        );
      }
    } catch (err) {
      setError('Failed to send verification email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setIsLoading(true);
    try {
      const response = await authService.resendVerification(email);
      if (!response.success) {
        setError(
          response.message || 'Failed to resend email. Please try again.',
        );
      }
    } catch (err: any) {
      setError(
        err.response.data.message ||
          'Failed to resend email. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-border/50 shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-foreground">
          Resend Verification Email
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter your email address to receive a new verification link
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive" className="border-destructive/20">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-input border-border focus:ring-ring"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending Verification Email...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Send Verification Email
              </>
            )}
          </Button>
        </form>

        <div className="text-center">
          <Alert className="border-accent/20 bg-accent/10">
            <AlertDescription className="text-sm">
              Already verified your email?
              <Link
                href="/login"
                className="text-primary hover:text-primary/80 font-medium underline"
              >
                Sign in here
              </Link>
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>

      <CardFooter className="flex-col space-y-4">
        <Separator className="bg-border" />
        <Link
          href="/register"
          className="flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Registration
        </Link>
      </CardFooter>
    </Card>
  );
}
