// src/components/videos/TVNovorizontino.tsx
// SERVER COMPONENT — busca RSS do canal oficial
// Se o RSS falhar, usa fallback com vídeos hardcoded recentes

import Link from 'next/link';

export const revalidate = 1800;

const CHANNEL_ID   = 'UCUQG_P8Y_POiYW7LqAldQVg';
const CHANNEL_URL  = 'https://www.youtube.com/c/TVNovorizontino';
const CREDIT_URL   = 'https://www.gremionovorizontino.com.br/tv-novorizontino/';
const RSS_URL      = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

type Video = {
  id: string;
  title: string;
  thumb: string;
  url: string;
  tag: string;
};

// ── Vídeos recentes hardcoded — atualizar manualmente ────────
// Fonte: gremionovorizontino.com.br/tv-novorizontino/
// Substitua os IDs quando novos vídeos saírem no canal
const FALLBACK_VIDEOS: Video[] = [
  {
    id: 'DIA_TREINO_ATHLETIC', // substitua pelo ID real
    title: 'DIA DE TREINO | Novorizontino focado na preparação para confronto com o Athletic',
    thumb: `https://img.youtube.com/vi/0HZIdQTE8mI/mqdefault.jpg`,
    url:   'https://www.youtube.com/c/TVNovorizontino',
    tag:   '⚽ Treino',
  },
  {
    id: 'PRE_JOGO_ATHLETIC',
    title: 'PRÉ-JOGO | Juninho e Enderson Moreira falam antes do confronto com o Athletic',
    thumb: `https://img.youtube.com/vi/cp-3Q09-XuE/mqdefault.jpg`,
    url:   'https://www.youtube.com/c/TVNovorizontino',
    tag:   '⚡ Pré-Jogo',
  },
  {
    id: 'BASTIDORES_VITORIA',
    title: 'BASTIDORES | Primeira vitória do Tigre do Vale no Brasileirão B 2026',
    thumb: `https://img.youtube.com/vi/y67NY0bJ-Yk/mqdefault.jpg`,
    url:   'https://www.youtube.com/c/TVNovorizontino',
    tag:   '🎥 Bastidores',
  },
  {
    id: 'POS_JOGO_AMERICA',
    title: 'PÓS-JOGO | Enderson Moreira e Diego Galo falam após vitória sobre o América-MG',
    thumb: `https://img.youtube.com/vi/VSAo_acIKRQ/mqdefault.jpg`,
    url:   'https://www.youtube.com/c/TVNovorizontino',
    tag:   '📊 Pós-Jogo',
  },
  {
    id: 'BASTIDORES_SAO_BERNARDO',
    title: 'BASTIDORES | Vitória sobre o São Bernardo e liderança da Copa Sul-Sudeste',
    thumb: `https://img.youtube.com/vi/KGmiSUJhoAU/mqdefault.jpg`,
    url:   'https://www.youtube.com/c/TVNovorizontino',
    tag:   '🎥 Bastidores',
  },
  {
    id: 'PRE_JOGO_OPERARIO',
    title: 'PRÉ-JOGO | Jean Rodrigues e Miguel Contiero falam antes do jogo contra o Operário-PR',
    thumb: `https://img.youtube.com/vi/0HZIdQTE8mI/mqdefault.jpg`,
    url:   'https://www.youtube.com/c/TVNovorizontino',
    tag:   '⚡ Pré-Jogo',
  },
  {
    id: 'TOCA_DA_RAPOSA',
    title: 'DIA DE TREINO | Novorizontino finaliza preparação na Toca da Raposa antes do América-MG',
    thumb: `https://img.youtube.com/vi/cp-3Q09-XuE/mqdefault.jpg`,
    url:   'https://www.youtube.com/c/TVNovorizontino',
    tag:   '⚽ Treino',
  },
];

// ── Parser XML do RSS ─────────────────────────────────────────
function parseRSS(xml: string): Video[] {
  const entries = xml.match(/<entry>([\s\S]*?)<\/entry>/g) ?? [];
  return entries.slice(0, 8).map(entry => {
    const id    = (entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/) ?? [])[1] ?? '';
    const title = (entry.match(/<title>(.*?)<\/title>/)           ?? [])[1] ?? '';
    const clean = title.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'");
    const tag   = getTag(clean);
    return {
      id,
      title: clean,
      thumb: `https://i.ytimg.com/vi/${id}/mqdefault.jpg`,
      url:   `https://www.youtube.com/watch?v=${id}`,
      tag,
    };
  }).filter(v => v.id);
}

function getTag(t: string): string {
  const u = t.toUpperCase();
  if (u.includes('PÓS-JOGO') || u.includes('POS-JOGO')) return '📊 Pós-Jogo';
  if (u.includes('PRÉ-JOGO') || u.includes('PRE-JOGO')) return '⚡ Pré-Jogo';
  if (u.includes('BASTIDOR'))  return '🎥 Bastidores';
  if (u.includes('TREINO'))    return '⚽ Treino';
  if (u.includes('AO VIVO'))   return '🔴 Ao Vivo';
  if (u.includes('ENTREVISTA') || u.includes('FALA') || u.includes('COLETIVA')) return '🎙️ Entrevista';
  return '📺 TV Novo';
}

// ── Card ──────────────────────────────────────────────────────
function VideoCard({ video, destaque = false }: { video: Video; destaque?: boolean }) {
  return (
    <a
      href={video.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group block bg-[#0a0a0a] rounded-2xl overflow-hidden border border-white/5 hover:border-yellow-500/40 transition-all duration-300 ${destaque ? 'md:col-span-2' : ''}`}
    >
      <div className="relative aspect-video bg-zinc-900 overflow-hidden">
        <img
          src={video.thumb}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-red-600/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100 shadow-lg">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white ml-1"><path d="M8 5v14l11-7z" /></svg>
          </div>
        </div>
        <div className="absolute top-3 left-3 text-black text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider bg-yellow-500">
          {video.tag}
        </div>
      </div>
      <div className="p-4">
        <h3 className={`text-white font-black italic uppercase leading-tight group-hover:text-yellow-500 transition-colors ${destaque ? 'text-base md:text-lg line-clamp-2' : 'text-sm line-clamp-2'}`}>
          {video.title}
        </h3>
        <div className="flex items-center gap-1 mt-2">
          <svg viewBox="0 0 24 24" className="w-3 h-3 fill-red-600 flex-shrink-0">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"/><path d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="white"/>
          </svg>
          <span className="text-zinc-600 text-[9px] font-bold uppercase tracking-widest">TV Novorizontino</span>
        </div>
      </div>
    </a>
  );
}

// ── Componente principal ──────────────────────────────────────
export default async function TVNovorizontino() {
  let videos: Video[] = [];

  try {
    const res = await fetch(RSS_URL, {
      next: { revalidate: 1800 },
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Portal/1.0)' },
    });
    if (res.ok) {
      const xml = await res.text();
      const parsed = parseRSS(xml);
      if (parsed.length >= 3) videos = parsed;
    }
  } catch {
    // RSS falhou → usa fallback
  }

  // Se RSS falhou ou retornou poucos vídeos, usa hardcoded
  if (videos.length === 0) videos = FALLBACK_VIDEOS;

  const [destaque, ...resto] = videos;
  const sidebar = resto.slice(0, 2);
  const medios  = resto.slice(2, 6);

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">

      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-1 h-7 bg-red-600 rounded-full block" />
            <span className="text-red-500 text-[9px] font-black uppercase tracking-[0.4em]">Canal Oficial</span>
          </div>
          <h2 className="text-white text-3xl md:text-4xl font-black italic uppercase tracking-tighter">
            TV <span className="text-yellow-500">Novorizontino</span>
          </h2>
          <p className="text-zinc-500 text-sm mt-1">Treinos, bastidores, entrevistas e jogos do Tigre do Vale</p>
        </div>
        <a
          href={CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-black uppercase text-xs tracking-widest px-5 py-3 rounded-xl transition-colors self-start"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white flex-shrink-0">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"/>
            <path d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="white"/>
          </svg>
          Inscrever-se
        </a>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Destaque — 2 colunas */}
        <VideoCard video={destaque} destaque />

        {/* Lateral — 2 cards empilhados */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4">
          {sidebar.map(v => <VideoCard key={v.id} video={v} />)}
        </div>

        {/* Segunda linha — 4 cards */}
        {medios.map(v => <VideoCard key={v.id} video={v} />)}
      </div>

      {/* Créditos */}
      <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-6 border-t border-white/5">
        <p className="text-zinc-600 text-xs leading-relaxed">
          Conteúdo produzido pelo{' '}
          <a href={CREDIT_URL} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-yellow-500 transition-colors font-bold">
            Grêmio Novorizontino Futebol SA
          </a>
          {' '}no canal{' '}
          <a href={CHANNEL_URL} target="_blank" rel="noopener noreferrer" className="text-red-500 hover:text-red-400 transition-colors font-bold">
            TV Novorizontino
          </a>
          . Reproduzido como serviço à torcida. Todos os direitos reservados ao clube.
        </p>
        <a href={CREDIT_URL} target="_blank" rel="noopener noreferrer" className="text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-yellow-500 transition-colors whitespace-nowrap">
          Site oficial →
        </a>
      </div>
    </section>
  );
}
