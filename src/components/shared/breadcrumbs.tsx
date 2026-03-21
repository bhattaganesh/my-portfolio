import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex items-center flex-wrap gap-1 text-sm text-surface-500 dark:text-surface-400">
        <li>
          <Link
            href="/"
            className="flex items-center hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            aria-label="Home"
          >
            <Home className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </li>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1">
              <ChevronRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className="text-surface-700 dark:text-surface-300 font-medium truncate max-w-[200px]"
                  aria-current="page"
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
