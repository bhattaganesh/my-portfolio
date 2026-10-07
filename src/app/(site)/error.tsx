'use client';
import { useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <div className="pt-24 pb-16">
      <Container className="text-center">
        <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-4">Something went wrong</h2>
        <p className="text-surface-500 mb-6">An unexpected error occurred. Please try again.</p>
        <div className="flex gap-4 justify-center">
          <Button onClick={reset} variant="primary">
            Try Again
          </Button>
          <Button href="/" variant="outline">
            Go Home
          </Button>
        </div>
      </Container>
    </div>
  );
}
