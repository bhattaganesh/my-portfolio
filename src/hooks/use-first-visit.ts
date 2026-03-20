'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'portfolio_visited';

/**
 * Returns true only on the visitor's first page load.
 * SSR always returns false to avoid hydration mismatches.
 * Sets a localStorage flag so subsequent visits return false.
 * try/catch handles incognito / privacy-restricted browsers.
 */
export function useFirstVisit(): boolean {
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        localStorage.setItem(STORAGE_KEY, '1');
        setIsFirstVisit(true);
      }
    } catch {
      // localStorage unavailable — default to not first visit
    }
  }, []);

  return isFirstVisit;
}
