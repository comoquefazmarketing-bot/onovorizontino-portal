import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Copa do Mundo 2026 — Tabela, Simulador e Calculadora | Portal O Novorizontino',
  description:
    'Tabela de grupos, simulador de resultados e calculadora de classificação da Copa do Mundo 2026. Todos os 12 grupos, 48 seleções. Simule os jogos e veja quem passa de fase.',
  keywords: [
    'Copa do Mundo 2026', 'tabela grupos Copa 2026', 'simulador Copa 2026',
    'classificação Copa do Mundo', 'grupos FIFA 2026', 'Brasil Copa 2026',
  ],
  openGraph: {
    title: 'Copa do Mundo 2026 — Tabela, Simulador e Calculadora',
    description: 'Simule os resultados da Copa do Mundo 2026 e veja quem avança para o mata-mata.',
    url: 'https://www.onovorizontino.com.br/copa',
    type: 'website',
  },
  alternates: { canonical: 'https://www.onovorizontino.com.br/copa' },
};

export default function CopaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
