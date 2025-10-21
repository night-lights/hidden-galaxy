import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Hidden Galaxy',
  description:
    '3D interactive visualization of code dependencies as a cosmic solar system',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
