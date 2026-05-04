import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Opinião | Portal O Novorizontino',
  description: 'Colunas de opinião e crônicas esportivas sobre o Grêmio Novorizontino — perspectivas, análises e debates da torcida.',
  robots: { index: false, follow: false },
};

export default function OpiniaoPage() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 text-center"
      style={{ fontFamily: "'Barlow Condensed', system-ui, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,900;1,900&display=swap');`}</style>

      <div className="inline-flex items-center gap-3 mb-8 px-5 py-2 rounded-full border border-yellow-500/30 bg-yellow-500/5">
        <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
        <span className="text-yellow-500 text-[10px] font-black uppercase tracking-[0.4em]">Em Breve</span>
      </div>

      <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.85] mb-6">
        Opi<span className="text-yellow-500">nião</span>
      </h1>

      <p className="text-zinc-400 text-lg max-w-md leading-relaxed mb-10">
        Nossa seção de colunas e crônicas esportivas está sendo preparada. Em breve, você lerá as análises e opiniões dos colunistas do portal.
      </p>

      <p className="text-zinc-500 text-sm mb-8">
        Enquanto isso, confira nossas análises táticas e crônicas na seção de notícias:
      </p>

      <Link
        href="/noticias"
        className="inline-flex items-center gap-3 bg-yellow-500 hover:bg-yellow-400 text-black font-black text-sm uppercase tracking-widest px-8 py-4 rounded-xl transition-all active:scale-95"
      >
        Ver Todas as Notícias →
      </Link>

      <Link href="/" className="mt-8 text-zinc-600 hover:text-yellow-500 text-[10px] font-black uppercase tracking-widest transition-colors">
        ← Voltar ao Início
      </Link>
    </main>
  );
}
