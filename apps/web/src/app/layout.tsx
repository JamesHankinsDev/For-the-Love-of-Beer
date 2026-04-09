import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'For the Love of Beer — Brewery Dashboard',
  description: 'Manage your brewery, customize stamps, and track visitor engagement.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
