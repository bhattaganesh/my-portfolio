import { ImageResponse } from 'next/og';

export const dynamic = 'force-static';

/**
 * 192x192 PWA icon — same SVG "G" path as icon.svg and LogoMark component.
 */
export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 192,
          height: 192,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg
          width="192"
          height="192"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="64" height="64" rx="16" fill="url(#bg)" />
          <rect
            x="0.5"
            y="0.5"
            width="63"
            height="63"
            rx="15.5"
            stroke="white"
            stroke-opacity="0.1"
            stroke-width="1"
            fill="none"
          />
          <rect
            width="64"
            height="28"
            rx="16"
            fill="url(#shine)"
            opacity="0.08"
          />
          <path
            d="M50 17 A23 23 0 1 0 55 28 L35 28 L35 36 L44 36 A13 13 0 1 1 41 24Z"
            fill="white"
          />
          <defs>
            <linearGradient
              id="bg"
              x1="0"
              y1="0"
              x2="64"
              y2="64"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stop-color="#020617" />
              <stop offset="35%" stop-color="#0f172a" />
              <stop offset="70%" stop-color="#1e3a8a" />
              <stop offset="100%" stop-color="#2563eb" />
            </linearGradient>
            <linearGradient
              id="shine"
              x1="0"
              y1="0"
              x2="0"
              y2="28"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stop-color="white" />
              <stop offset="100%" stop-color="white" stop-opacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    ),
    { width: 192, height: 192 },
  );
}
