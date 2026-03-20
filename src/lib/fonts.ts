import { Inter, JetBrains_Mono } from 'next/font/google';
import localFont from 'next/font/local';

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const cabinetGrotesk = localFont({
  src: [
    {
      path: '../../public/fonts/cabinet-grotesk/CabinetGrotesk-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/cabinet-grotesk/CabinetGrotesk-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/cabinet-grotesk/CabinetGrotesk-Extrabold.woff2',
      weight: '800',
      style: 'normal',
    },
  ],
  variable: '--font-cabinet',
  display: 'swap',
});
