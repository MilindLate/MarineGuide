
import type {Metadata} from 'next';
import './globals.css';
import { Shell } from '@/components/layout/Shell';

export const metadata: Metadata = {
  title: 'MarineGuide | Maritime Intelligence Platform',
  description: 'Resilient Logistics & Dynamic Supply Chain Optimization',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=DM+Mono&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <div className="flex flex-col h-screen w-full">
          <div className="chrome-bar shrink-0">
            <div className="chrome-bar-segment bg-[#4285f4]" />
            <div className="chrome-bar-segment bg-[#ea4335]" />
            <div className="chrome-bar-segment bg-[#fbbc04]" />
            <div className="chrome-bar-segment bg-[#34a853]" />
          </div>
          <Shell>{children}</Shell>
        </div>
      </body>
    </html>
  );
}
