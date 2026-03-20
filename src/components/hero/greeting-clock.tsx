'use client';

import { useSyncExternalStore } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { MapPin, Sun, Moon, Sunrise, Sunset } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';

type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

function getTimeOfDay(hour: number): TimeOfDay {
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

function getGreetingText(tod: TimeOfDay): string {
  switch (tod) {
    case 'morning': return 'Good morning';
    case 'afternoon': return 'Good afternoon';
    case 'evening': return 'Good evening';
    case 'night': return 'Good night';
  }
}

const ICON_COLORS: Record<TimeOfDay, string> = {
  morning: 'text-amber-500',
  afternoon: 'text-sky-500',
  evening: 'text-purple-500',
  night: 'text-indigo-400',
};

function TimeIcon({ timeOfDay }: { timeOfDay: TimeOfDay }) {
  const className = `w-10 h-10 ${ICON_COLORS[timeOfDay]}`;
  switch (timeOfDay) {
    case 'morning': return <Sunrise className={className} />;
    case 'afternoon': return <Sun className={className} />;
    case 'evening': return <Sunset className={className} />;
    case 'night': return <Moon className={className} />;
  }
}

/** Single animated digit that slides when value changes */
function AnimatedDigit({ value }: { value: string }) {
  return (
    <span className="relative inline-block w-[0.6em] h-[1.2em] overflow-hidden align-middle">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          className="absolute inset-0 flex items-center justify-center"
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30, mass: 0.8 }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/** Animated clock display — HH : MM : SS */
function ClockDisplay({ hours, minutes, seconds }: { hours: string; minutes: string; seconds: string }) {
  const digitPairs = [hours, minutes, seconds];

  return (
    <div className="flex items-center justify-center tabular-nums text-5xl sm:text-6xl font-bold font-display text-surface-800 dark:text-surface-100 leading-none">
      {digitPairs.map((pair, pairIdx) => (
        <span key={pairIdx} className="inline-flex items-center">
          {pairIdx > 0 && (
            <motion.span
              className="inline-flex flex-col items-center justify-center gap-[6px] w-6 sm:w-8"
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            >
              <span className="block w-[5px] h-[5px] sm:w-[6px] sm:h-[6px] rounded-full bg-primary-500 dark:bg-primary-400" />
              <span className="block w-[5px] h-[5px] sm:w-[6px] sm:h-[6px] rounded-full bg-primary-500 dark:bg-primary-400" />
            </motion.span>
          )}
          <AnimatedDigit value={pair[0]} />
          <AnimatedDigit value={pair[1]} />
        </span>
      ))}
    </div>
  );
}

const STATS = [
  { value: '4+', label: 'Yrs Exp' },
  { value: '1M+', label: 'Sites' },
  { value: '2+', label: 'Companies' },
] as const;

// Subscribe to a 1-second clock tick without synchronous setState in effects
let clockListeners: Array<() => void> = [];
let clockSnapshot = new Date();

if (typeof window !== 'undefined') {
  setInterval(() => {
    clockSnapshot = new Date();
    for (const l of clockListeners) l();
  }, 1000);
}

function subscribeClock(listener: () => void) {
  clockListeners.push(listener);
  return () => {
    clockListeners = clockListeners.filter((l) => l !== listener);
  };
}

function getClockSnapshot() {
  return clockSnapshot;
}

function getServerSnapshot() {
  return new Date();
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function subscribeMounted(_cb: () => void) {
  return () => {};
}
function getMountedSnapshot() {
  return true;
}
function getMountedServerSnapshot() {
  return false;
}

export function GreetingClock() {
  const prefersReducedMotion = useReducedMotion();
  const now = useSyncExternalStore(subscribeClock, getClockSnapshot, getServerSnapshot);
  const mounted = useSyncExternalStore(subscribeMounted, getMountedSnapshot, getMountedServerSnapshot);

  const hour = now.getHours();
  const timeOfDay = getTimeOfDay(hour);
  const greetingText = getGreetingText(timeOfDay);

  const pad = (n: number) => n.toString().padStart(2, '0');
  const hours = pad(hour);
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());

  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const ampm = hour >= 12 ? 'PM' : 'AM';

  // Render the same layout for both SSR and client — just hide content until mounted
  // This prevents layout shift / flickering on first load
  const contentOpacity = mounted ? 1 : 0;

  return (
    <div
      className="relative w-full h-full flex flex-col transition-opacity duration-500"
      style={{ opacity: contentOpacity }}
    >
      {/* Clock content */}
      <div className="flex-1 flex flex-col items-center justify-center gap-3 py-10 px-6">
        {/* Icon */}
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 15 }}
        >
          <motion.div
            animate={prefersReducedMotion ? undefined : { rotate: timeOfDay === 'night' ? [0, -5, 5, 0] : [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
          >
            <TimeIcon timeOfDay={timeOfDay} />
          </motion.div>
        </motion.div>

        {/* Greeting text */}
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={greetingText}
              className="text-base sm:text-lg font-medium text-surface-500 dark:text-surface-400 tracking-wide"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
            >
              {greetingText}
            </motion.p>
          </AnimatePresence>
        </motion.div>

        {/* Live clock */}
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <ClockDisplay hours={hours} minutes={minutes} seconds={seconds} />
          <p className="text-center text-base font-mono uppercase tracking-[0.25em] text-surface-600 dark:text-surface-300 mt-2 font-medium">
            {ampm}
          </p>
        </motion.div>

        {/* Date & Location */}
        <motion.div
          className="flex flex-col items-center gap-1 mt-1"
          initial={prefersReducedMotion ? undefined : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <p className="text-sm text-surface-600 dark:text-surface-400 font-medium">
            {dateStr}
          </p>
          <div className="flex items-center gap-1.5 text-surface-500 dark:text-surface-400 text-sm">
            <MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>{SITE_CONFIG.location}</span>
          </div>
        </motion.div>
      </div>

      {/* Stats row */}
      <motion.div
        className="grid grid-cols-3 border-t border-surface-200/60 dark:border-surface-800/60"
        initial={prefersReducedMotion ? undefined : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
      >
        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            className={`text-center py-5 ${
              i < STATS.length - 1 ? 'border-r border-surface-200/60 dark:border-surface-800/60' : ''
            }`}
          >
            <p className="text-2xl sm:text-3xl font-bold font-display text-surface-800 dark:text-surface-100 leading-none">
              {stat.value}
            </p>
            <p className="text-xs font-mono uppercase tracking-wider text-surface-500 dark:text-surface-400 mt-2">
              {stat.label}
            </p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
