'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

// ─── Fotos dos jogadores (path dentro de imagens-portal/JOGADORES/) ───────────
const BASE_S   = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';
const FALLBACK = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/GARRA%20LOGO.png';

// short (uppercase, sem acento) → arquivo de foto
const FOTO_MAP: { short: string; foto: string }[] = [
  { short:'JORDI',       foto:'JORDI.jpg.webp' },
  { short:'CESAR',       foto:'CESAR-AUGUSTO.jpg.webp' },
  { short:'SCAPIN',      foto:'JOAO-SCAPIN.jpg.webp' },
  { short:'LUCAS',       foto:'LUCAS-RIBEIRO.jpg.webp' },
  { short:'PAULO',       foto:'PAULO-HENRIQUE.jpg.webp' },
  { short:'PATRICK',     foto:'PATRICK.jpg.webp' },
  { short:'RENATO',      foto:'RENATO-PALM.jpg.webp' },
  { short:'BROCK',       foto:'EDUARDO-BROCK.jpg.webp' },
  { short:'ALVARINO',    foto:'IVAN-ALVARINO.jpg.webp' },
  { short:'CARLINHOS',   foto:'CARLINHOS.jpg.webp' },
  { short:'DANTAS',      foto:'DANTAS.jpg.webp' },
  { short:'ARTHUR',      foto:'ARTHUR-BARBOSA.jpg.webp' },
  { short:'ANTONY',      foto:'ANTONY.jpg.webp' },
  { short:'ALEMAO',      foto:'ALEMAO.jpg.webp' },
  { short:'SANDER',      foto:'SANDER.jpg.webp' },
  { short:'MAYKON',      foto:'MAYKON-JESUS.jpg.webp' },
  { short:'CASTRILLON',  foto:'NILSON-CASTRILLON.jpg.webp' },
  { short:'LORA',        foto:'LORA.jpg.webp' },
  { short:'OYAMA',       foto:'LUIS-OYAMA.jpg.webp' },
  { short:'MARLON',      foto:'MARLON.jpg.webp' },
  { short:'NALDI',       foto:'LEO-NALDI.jpg.webp' },
  { short:'BAHIA',       foto:'GABRIEL-BAHIA.jpg.webp' },
  { short:'BIANQUI',     foto:'MATHEUS-BIANQUI.jpg.webp' },
  { short:'ROMULO',      foto:'ROMULO.jpg.webp' },
  { short:'JUNINHO',     foto:'JUNINHO.jpg.webp' },
  { short:'TAVINHO',     foto:'TAVINHO.jpg.webp' },
  { short:'TITI',        foto:'TITI-ORTIZ.jpg.webp' },
  { short:'GALO',        foto:'DIEGO-GALO.jpg.webp' },
  { short:'HECTOR',      foto:'HECTOR-BIANCHI.jpg.webp' },
  { short:'CONTIERO',    foto:'MIGUEL-CONTIERO.jpg.webp' },
  { short:'NOGUEIRA',    foto:'NOGUEIRA.jpg.webp' },
  { short:'ROBSON',      foto:'ROBSON.jpg.webp' },
  { short:'VINICIUS',    foto:'VINICIUS-PAIVA.jpg.webp' },
  { short:'RONALD',      foto:'RONALD-BARCELLOS.jpg.webp' },
  { short:'CARECA',      foto:'NICOLAS-CARECA.jpg.webp' },
  { short:'CARLAO',      foto:'CARLAO.jpg.webp' },
  { short:'HELIO',       foto:'HELIO-BORGES.jpg.webp' },
  { short:'JARDIEL',     foto:'JARDIEL.jpg.webp' },
  { short:'MATHIAS',     foto:'DIEGO-MATHIAS.jpg.webp' },
  { short:'KAUE',        foto:'JHONES-KAUE.jpg.webp' },
];

// Normaliza string para comparação: maiúsculas, sem acentos
function norm(s: string): string {
  return s.toUpperCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^A-Z]/g, ' ')
    .trim();
}

function resolverFoto(nomeShort: string): string {
  const n = norm(nomeShort);
  // Tenta match exato ou parcial com qualquer token do nome
  const tokens = n.split(' ').filter(t => t.length > 2);
  for (const entry of FOTO_MAP) {
    const e = norm(entry.short);
    if (tokens.some(t => e.includes(t) || t.includes(e))) {
      return BASE_S + entry.foto;
    }
  }
  return FALLBACK;
}

// ─── Tipos ───────────────────────────────────────────────────────────────────
interface Destaque {
  nomeShort: string;
  rating: number | null;
  gols: number;
  assists: number;
  foto: string;
}

interface DadosDestaques {
  capitao: Destaque | null;
  heroi: Destaque | null;
  rodada: string | number;
  descricaoJogo: string; // ex: "Sport 1×0 Novorizontino"
}

// ─── Card FIFA ────────────────────────────────────────────────────────────────
function CardFuturistaUT26({
  j, tipo,
}: {
  j: Destaque;
  tipo: 'CAPITÃO' | 'HERÓI';
}) {
  const isCap = tipo === 'CAPITÃO';
  const color = isCap ? '#F5C400' : '#00F3FF';
  const labelBônus = isCap ? 'RATING × 2' : 'RATING + 50%';
  const [fotoSrc, setFotoSrc] = useState(j.foto);

  return (
    <div className="relative group animate-in fade-in zoom-in duration-1000">
      {/* Glow Atmosférico */}
      <div
        className="absolute -inset-8 blur-[60px] opacity-20 group-hover:opacity-40 transition duration-1000"
        style={{ backgroundColor: color }}
      />

      <div className="relative w-[190px] h-[270px] overflow-hidden" style={{ borderRadius: '18px' }}>
        {/* Estrutura Poligonal */}
        <div
          className="absolute inset-0 bg-[#080808] border-[1.5px]"
          style={{
            borderColor: `${color}66`,
            clipPath: 'polygon(0% 15%, 15% 0%, 85% 0%, 100% 15%, 100% 85%, 80% 100%, 20% 100%, 0% 85%)',
          }}
        >
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          <div
            className="absolute inset-0 opacity-30"
            style={{ background: `radial-gradient(circle at top right, ${color}33, transparent)` }}
          />
          <div className="absolute inset-0 z-10 opacity-20 bg-gradient-to-tr from-transparent via-white to-transparent -translate-x-full animate-[shimmer_8s_infinite]" />

          <div className="relative z-20 p-5 h-full flex flex-col justify-between">
            {/* Header: Rating e Badge */}
            <div className="flex justify-between items-start">
              <div className="flex flex-col leading-none">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-[1000] text-white italic tracking-tighter drop-shadow-md">
                    {j.rating != null ? j.rating.toFixed(1) : '—'}
                  </span>
                </div>
                <span className="text-[7px] font-black uppercase tracking-[0.2em] opacity-80" style={{ color }}>
                  {labelBônus}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <div
                  className="px-2 py-0.5 text-[8px] font-black text-black uppercase italic skew-x-[-10deg]"
                  style={{ backgroundColor: color }}
                >
                  {tipo}
                </div>
                <div className="w-full h-[1px] mt-1 bg-white/20" />
                {(j.gols > 0 || j.assists > 0) && (
                  <div className="mt-1 flex gap-1 text-[7px] font-black text-zinc-400">
                    {j.gols > 0 && <span style={{ color }}>⚽ {j.gols}</span>}
                    {j.assists > 0 && <span>🎯 {j.assists}</span>}
                  </div>
                )}
              </div>
            </div>

            {/* Foto do jogador */}
            <div className="absolute inset-0 flex items-center justify-center pt-6 pointer-events-none">
              <img
                src={fotoSrc}
                alt={j.nomeShort}
                onError={() => setFotoSrc(FALLBACK)}
                className="h-48 object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)] scale-110 group-hover:scale-[1.2] transition-all duration-700 ease-out"
                style={{
                  maskImage: 'linear-gradient(to bottom, black 65%, transparent 92%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, black 65%, transparent 92%)',
                }}
              />
            </div>

            {/* Footer: nome */}
            <div className="relative z-30 w-full text-center">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/20" />
                <div className="w-1.5 h-1.5 rotate-45 border border-white/40" style={{ backgroundColor: color }} />
                <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/20" />
              </div>
              <p className="text-white font-[1000] text-[13px] uppercase italic tracking-tighter drop-shadow-sm">
                {j.nomeShort}
              </p>
              <div className="mt-0.5">
                <span className="text-[5px] text-zinc-500 font-bold uppercase tracking-[0.5em]">
                  Data Broadcast Protocol
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Cantoneiras */}
        <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-white/20" />
        <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-white/20" />
      </div>
    </div>
  );
}

// ─── Skeleton de loading ──────────────────────────────────────────────────────
function CardSkeleton({ color }: { color: string }) {
  return (
    <div className="relative w-[190px] h-[270px] rounded-[18px] overflow-hidden animate-pulse"
      style={{ background: '#111', border: `1.5px solid ${color}22` }}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-white/5" />
      </div>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function DestaquesFifa() {
  const [dados, setDados]     = useState<DadosDestaques | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [ratingsRes, jogoRes] = await Promise.allSettled([
          fetch('/api/tigre-fc/sofascore-ultimo-jogo-ratings'),
          supabase
            .from('jogos')
            .select('rodada, mandante_slug, visitante_slug, placar_mandante, placar_visitante')
            .eq('finalizado', true)
            .order('data_hora', { ascending: false })
            .limit(1)
            .maybeSingle(),
        ]);

        const ratings = ratingsRes.status === 'fulfilled'
          ? await ratingsRes.value.json().catch(() => null)
          : null;

        const jogoDb = jogoRes.status === 'fulfilled' ? jogoRes.value.data : null;

        if (!ratings?.capitao) { setLoading(false); return; }

        // Descrição do jogo: "Sport 1×0 Novorizontino" ou "Novorizontino 2×1 Cuiabá"
        let descricaoJogo = '';
        if (ratings.jogo) {
          const { mandante, visitante, placar } = ratings.jogo;
          descricaoJogo = `${mandante} ${placar} ${visitante}`;
        }

        const build = (raw: any): Destaque => ({
          nomeShort: raw.nomeShort ?? raw.nome ?? '—',
          rating:    raw.rating ?? null,
          gols:      raw.gols ?? 0,
          assists:   raw.assists ?? 0,
          foto:      resolverFoto(raw.nomeShort ?? raw.nome ?? ''),
        });

        setDados({
          capitao:      ratings.capitao ? build(ratings.capitao) : null,
          heroi:        ratings.heroi   ? build(ratings.heroi)   : null,
          rodada:       jogoDb?.rodada ?? '—',
          descricaoJogo,
        });
      } catch (err) {
        console.error('[DestaquesFifa]', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const semDados = !loading && (!dados?.capitao && !dados?.heroi);

  return (
    <section className="my-16 flex flex-col items-center">
      {/* Título */}
      <div className="relative inline-block mb-14">
        <div className="absolute -inset-x-20 -inset-y-10 bg-yellow-500/5 blur-[80px] rounded-full scale-y-50 animate-pulse" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-yellow-500/50" />
          <h2 className="text-[10px] font-black text-white uppercase tracking-[0.8em] italic">
            The Best <span className="text-yellow-500">Tigre FC</span>
          </h2>
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-yellow-500/50" />
        </div>
        <div className="flex flex-col items-center mt-3">
          <p className="px-3 py-0.5 bg-zinc-900/50 border border-white/5 rounded-full text-[8px] text-zinc-400 font-black uppercase tracking-[0.3em]">
            {loading
              ? 'Carregando...'
              : semDados
              ? 'Aguardando resultado'
              : `Rodada ${dados?.rodada} · ${dados?.descricaoJogo}`}
          </p>
        </div>
      </div>

      <div className="flex justify-center gap-12 flex-wrap px-4">
        {loading ? (
          <>
            <CardSkeleton color="#F5C400" />
            <CardSkeleton color="#00F3FF" />
          </>
        ) : semDados ? (
          <p className="text-zinc-600 text-sm font-bold text-center">
            Ratings do SofaScore ainda não disponíveis para este jogo.
          </p>
        ) : (
          <>
            {dados?.capitao && <CardFuturistaUT26 j={dados.capitao} tipo="CAPITÃO" />}
            {dados?.heroi   && <CardFuturistaUT26 j={dados.heroi}   tipo="HERÓI"   />}
          </>
        )}
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          0%   { transform: translateX(-150%) skewX(-20deg); }
          100% { transform: translateX(150%)  skewX(-20deg); }
        }
      `}</style>
    </section>
  );
}
