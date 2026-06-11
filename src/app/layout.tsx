import './globals.css';
import Ticker from '@/components/sections/Ticker';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br" className="scroll-smooth">
      <body className="bg-black antialiased">
        <Ticker />
        {children}
      </body>
    </html>
  );
}