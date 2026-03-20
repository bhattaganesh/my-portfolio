import React from 'react';

interface LogoMarkProps {
  size?: number;
  className?: string;
}

/**
 * "G" monogram — bold C-arc lettermark.
 *
 * Design:
 *   • Deep-space gradient background with glass border
 *   • Single bold white G shape as one unified SVG path
 *   • Crossbar integrated into the letterform (same white, no seams)
 *   • 64-unit grid, scales to any size
 */
export function LogoMark({ size = 32, className }: LogoMarkProps) {
  const id = React.useId();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Background */}
      <rect width="64" height="64" rx="16" fill={`url(#${id}-bg)`} />

      {/* Glass border */}
      <rect
        x="0.5"
        y="0.5"
        width="63"
        height="63"
        rx="15.5"
        stroke="white"
        strokeOpacity="0.1"
        strokeWidth="1"
        fill="none"
      />

      {/* Top shine */}
      <rect
        width="64"
        height="28"
        rx="16"
        fill={`url(#${id}-shine)`}
        opacity="0.08"
      />

      {/* G — single unified path: arc + integrated crossbar */}
      <path
        d="M50 17 A23 23 0 1 0 55 28 L35 28 L35 36 L44 36 A13 13 0 1 1 41 24Z"
        fill="white"
      />

      <defs>
        <linearGradient
          id={`${id}-bg`}
          x1="0"
          y1="0"
          x2="64"
          y2="64"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#020617" />
          <stop offset="35%" stopColor="#0f172a" />
          <stop offset="70%" stopColor="#1e3a8a" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
        <linearGradient
          id={`${id}-shine`}
          x1="0"
          y1="0"
          x2="0"
          y2="28"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default LogoMark;
