import './globals.css';
import Ticker from '@/components/layout/Ticker';
import GlobalAdBanner from '@/components/layout/GlobalAdBanner';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body className="bg-black antialiased">
        <Ticker />
        <GlobalAdBanner />
        {children}
      </body>
    </html>
  );
}
