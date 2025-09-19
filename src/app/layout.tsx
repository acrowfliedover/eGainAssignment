/**
 * Root layout for the minimal single-page app.
 * - Imports global Tailwind styles
 * - Sets basic metadata
 */
import type { Metadata } from 'next';
import '@/styles/global.css';

export const metadata: Metadata = {
  title: 'eGain Assignment',
  description: 'Single-page minimal app',
};

/**
 * Wraps all pages with a basic HTML structure.
 */
export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {props.children}
      </body>
    </html>
  );
}
