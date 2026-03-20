import React from 'react';
import { Linkedin, Github, Facebook, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SITE_CONFIG } from '@/lib/constants';

interface SocialLink {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  ariaLabel: string;
}

const SOCIAL_LINKS: SocialLink[] = [
  {
    label: 'LinkedIn',
    href: SITE_CONFIG.socials.linkedin,
    icon: Linkedin,
    ariaLabel: `Ganesh Bhatt on LinkedIn (opens in new tab)`,
  },
  {
    label: 'GitHub',
    href: SITE_CONFIG.socials.github,
    icon: Github,
    ariaLabel: `Ganesh Bhatt on GitHub (opens in new tab)`,
  },
  {
    label: 'Facebook',
    href: SITE_CONFIG.socials.facebook,
    icon: Facebook,
    ariaLabel: `Ganesh Bhatt on Facebook (opens in new tab)`,
  },
];

interface SocialLinksProps {
  className?: string;
  size?: number;
  showLabels?: boolean;
  iconClassName?: string;
  linkClassName?: string;
  orientation?: 'horizontal' | 'vertical';
}

export function SocialLinks({
  className,
  size = 20,
  showLabels = false,
  iconClassName,
  linkClassName,
  orientation = 'horizontal',
}: SocialLinksProps) {
  return (
    <nav
      aria-label="Social media profiles"
      className={cn(
        'flex gap-2',
        orientation === 'vertical' && 'flex-col',
        className,
      )}
    >
      {SOCIAL_LINKS.map(({ label, href, icon: Icon, ariaLabel }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={ariaLabel}
          className={cn(
            /* Layout */
            'inline-flex items-center gap-2',
            /* Sizing — min 44px tap target */
            'min-w-[44px] min-h-[44px]',
            showLabels ? 'px-3 py-2 rounded-lg' : 'p-2.5 rounded-lg',
            /* Color */
            'text-surface-500 dark:text-surface-400',
            'hover:text-primary-500 dark:hover:text-primary-400',
            /* Background */
            'hover:bg-surface-100 dark:hover:bg-surface-800',
            /* Transitions */
            'transition-all duration-200 ease-in-out',
            /* Focus */
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
            'focus-visible:ring-offset-white dark:focus-visible:ring-offset-surface-950',
            linkClassName,
          )}
        >
          <Icon
            size={size}
            strokeWidth={1.75}
            className={cn('shrink-0', iconClassName)}
            aria-hidden="true"
          />
          {showLabels && (
            <span className="text-sm font-medium leading-none">{label}</span>
          )}
        </a>
      ))}
    </nav>
  );
}

export default SocialLinks;
