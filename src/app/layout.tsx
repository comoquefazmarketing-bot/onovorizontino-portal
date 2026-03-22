import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Portal O Novorizontino | A Era de Ouro",
  description: "Acompanhe tudo sobre o Grêmio Novorizontino e a inauguração do CT Gino de Biasi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" className="scroll-smooth">
      <head>
        {/* Google Analytics - G-J10P2E3X5X */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-J10P2E3X5X"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-J10P2E3X5X');
          }
        </Script>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}