'use client';

import { useState } from 'react';
import type { ExperienceItem } from '@/data/experience';
import { Timeline } from '@/components/experience/timeline';
import { cn } from '@/lib/utils';

interface Props {
  experience: ExperienceItem[];
}

type FilterValue = 'all' | 'work' | 'education';

const tabs = [
  { label: 'All', value: 'all' as FilterValue },
  { label: 'Work', value: 'work' as FilterValue },
  { label: 'Education', value: 'education' as FilterValue },
] as const;

export function ExperienceClient({ experience }: Props) {
  const [filter, setFilter] = useState<FilterValue>('all');

  const filtered =
    filter === 'all' ? experience : experience.filter((e) => e.type === filter);

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex gap-2 mb-8" role="tablist" aria-label="Filter experience by type">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            role="tab"
            aria-selected={filter === tab.value}
            onClick={() => setFilter(tab.value)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150',
              filter === tab.value
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-surface-100 text-surface-600 hover:bg-surface-200 dark:bg-surface-800 dark:text-surface-400 dark:hover:bg-surface-700',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <Timeline items={filtered} />
    </div>
  );
}
