import { ImageResponse } from 'next/og';

export const dynamic = 'force-static';
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 40,
          background: 'linear-gradient(135deg, #020617 0%, #0f172a 35%, #1e3a8a 70%, #2563eb 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        {/* Shine */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 80,
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.08), transparent)',
          }}
        />

        {/* G ring */}
        <div
          style={{
            width: 140,
            height: 140,
            borderRadius: '50%',
            border: '34px solid white',
            position: 'absolute',
            top: 20,
            left: 20,
          }}
        />

        {/* Cut — removes upper-right for C opening */}
        <div
          style={{
            position: 'absolute',
            top: 5,
            right: 0,
            width: 78,
            height: 82,
            background: 'linear-gradient(135deg, #020617 0%, #0f172a 35%, #1e3a8a 70%, #2563eb 100%)',
          }}
        />

        {/* Crossbar — same white as ring, integrated */}
        <div
          style={{
            position: 'absolute',
            top: 76,
            left: 84,
            width: 66,
            height: 22,
            background: 'white',
          }}
        />
      </div>
    ),
    { ...size },
  );
}
