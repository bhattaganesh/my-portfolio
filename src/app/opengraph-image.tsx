import { ImageResponse } from 'next/og';

export const dynamic = 'force-static';
export const alt = 'Ganesh Prasad Bhatt – Senior Full-Stack Developer';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1e2f7a 0%, #4c6ef5 50%, #748ffc 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Logo badge */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 20,
            background: 'linear-gradient(135deg, #020617 0%, #0f172a 35%, #1e3a8a 70%, #2563eb 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            marginBottom: 32,
            border: '1px solid rgba(255,255,255,0.15)',
          }}
        >
          {/* G ring */}
          <div
            style={{
              width: 62,
              height: 62,
              borderRadius: '50%',
              border: '15px solid white',
              position: 'absolute',
              top: 9,
              left: 9,
            }}
          />
          {/* Cut */}
          <div
            style={{
              position: 'absolute',
              top: 2,
              right: 0,
              width: 35,
              height: 36,
              background: 'linear-gradient(135deg, #020617 0%, #0f172a 35%, #1e3a8a 70%, #2563eb 100%)',
            }}
          />
          {/* Crossbar — same white, integrated */}
          <div
            style={{
              position: 'absolute',
              top: 34,
              left: 37,
              width: 30,
              height: 10,
              background: 'white',
            }}
          />
        </div>
        <div
          style={{
            fontSize: '56px',
            fontWeight: 700,
            color: 'white',
            lineHeight: 1.2,
            marginBottom: '16px',
          }}
        >
          Ganesh Prasad Bhatt
        </div>
        <div
          style={{
            fontSize: '28px',
            color: 'rgba(255, 255, 255, 0.85)',
            lineHeight: 1.4,
            marginBottom: '32px',
          }}
        >
          Senior Full-Stack Developer · PHP · React · WordPress · Gutenberg
        </div>
        <div
          style={{
            fontSize: '20px',
            color: 'rgba(255, 255, 255, 0.6)',
          }}
        >
          ganeshbhatt.com.np
        </div>
      </div>
    ),
    { ...size },
  );
}
