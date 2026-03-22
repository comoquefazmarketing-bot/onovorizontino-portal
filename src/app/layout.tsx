import './globals.css';
import Ticker from '@/components/layout/Ticker';
import Header from '@/components/layout/Header';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body className="bg-black antialiased overflow-x-hidden">
        <Ticker />
        <Header />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}