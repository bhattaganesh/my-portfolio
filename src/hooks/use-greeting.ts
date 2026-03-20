'use client';

import { useState, useEffect } from 'react';

function getGreeting(hour: number): string {
  if (hour >= 5 && hour < 12) return 'Good morning';
  if (hour >= 12 && hour < 17) return 'Good afternoon';
  if (hour >= 17 && hour < 21) return 'Good evening';
  return 'Good night';
}

/**
 * Returns a time-based greeting string.
 * SSR renders a neutral "Hi" to avoid hydration mismatches.
 * The client-side greeting is set in a useEffect.
 */
export function useGreeting(): string {
  const [greeting, setGreeting] = useState('Hi');

  useEffect(() => {
    setGreeting(getGreeting(new Date().getHours()));
  }, []);

  return greeting;
}
