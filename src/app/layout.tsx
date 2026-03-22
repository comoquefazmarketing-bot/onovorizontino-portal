import './globals.css';
import Header from '@/components/layout/Header';
import Ticker from '@/components/sections/Ticker';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body className="bg-black antialiased">
        <Header />
        <Ticker />
        {children}
      </body>
    </html>
  );
}