import "./globals.css";
export const metadata = { title: "Portal O Novorizontino" };
export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body>{children}</body>
    </html>
  );
}
