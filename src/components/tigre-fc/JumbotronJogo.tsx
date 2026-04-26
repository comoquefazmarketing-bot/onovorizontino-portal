'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import TigreFCPerfilPublico from './TigreFCPerfilPublico';
import DestaquesFifa from './DestaquesFifa'; // Certifique-se de que o arquivo existe na mesma pasta

// ── Design tokens ────────────────
const C = {
  gold: '#F5C400',
  cyan: '#00F3FF',
  red: '#FF2D55',
  purple: '#BF5FFF',
};

interface Time {
  nome: string;
  escudo_url: string | null;
  sigla?: string | null;
}

interface Jogo {
  id: number;
  competicao: string;
  rodada: string;
  data_hora: string;
  local: string | null;
  transmissao: string | null;
  mandante: Time;
  visitante: Time;
}

interface RankUser {
  apelido?: string | null;
  nome?: string | null;
  pontos: number;
}

interface Stats {
  capitao?: { nome: string; pts: number };
  heroi?: { nome: string; pts: number };
  ranking?: RankUser[];
  participantes?: number;
}

interface Props {
  jogo: Jogo;
  stats?: Stats;
  mercadoFechado?: boolean;
}

const FALLBACK = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/GARRA%20LOGO.png';

function Countdown({ dataHora }: { dataHora: string }) {
  const [t, setT] = useState({ h: '00', m: '00', s: '00', crit: false });

  useEffect(() => {
    const calc = () => {
      const diff = new Date(dataHora).getTime() - 90 * 60_000 - Date.now();
      if (diff <= 0) {
        setT({ h: '00', m: '00', s: '00', crit: true });
        return;
      }
      const h = Math.floor(diff / 3_600_000);
      const m = Math.floor((diff % 3_600_000) / 60_000);
      const s = Math.floor((diff % 60_000) / 1_000);
      setT({
        h: String(h).padStart(2, '0'),
        m: String(m).padStart(2, '0'),
        s: String(s).padStart(2, '0'),
        crit: h === 0 && m < 5
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [dataHora]);

  const block = (val: string, lbl: string, red = false) => (
    <div className="bg-[#111] border-2 rounded-xl p-2.5 text-center min-w-[70px]" style={{ borderColor: red ? C.red : '#333' }}>
      <span className="block text-5xl font-black italic leading-none" style={{ color: red ? C.red : '#fff', fontFamily: "'Barlow Condensed',sans-serif" }}>{val}</span>
      <span className="block text-[9px] font-black tracking-widest mt-1 opacity-50 uppercase">{lbl}</span>
    </div>
  );

  return (
    <div className="flex items-center justify-center gap-1.5 mb-6">
      {block(t.h, 'HORAS')}
      <span className="text-4xl font-black text-zinc-800">:</span>
      {block(t.m, 'MIN')}
      <span className="text-4xl font-black text-zinc-800">:</span>
      {block(t.s, 'SEG', t.crit)}
    </div>
  );
}

function Escudo({ src, alt, destaque }: { src: string | null; alt: string; destaque?: boolean }) {
  const [imgSrc, setImgSrc] = useState(src || FALLBACK);
  return (
    <div className={`w-[90px] h-[90px] bg-[#0d0d0d] rounded-3xl flex items-center justify-center overflow-hidden border shadow-2xl transition-transform hover:scale-105 ${destaque ? 'border-[#F5C400] border-2' : 'border-white/10'}`}>
      <img src={imgSrc} alt={alt} onError={() => setImgSrc(FALLBACK)} className="w-[65px] h-[65px] object-contain" />
    </div>
  );
}

export default function JumbotronJogo({ jogo, stats = {}, mercadoFechado = false }: Props) {
  const [perfilAberto, setPerfilAberto] = useState<string | null>(null);
  const [meuId, setMeuId] = useState<string>('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.id) setMeuId(session.user.id);
    });
  }, []);

  return (
    <div className="w-full max-w-[480px] mx-auto space-y-6">
      {/* CARD PRINCIPAL DO JOGO */}
      <div className="bg-black rounded-[32px] overflow-hidden relative border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.8)]">
        
        {/* Barra Estilizada de Scanline */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#00F3FF] to-transparent opacity-50 animate-pulse" />

        <div className="p-6 relative z-10">
          {/* Header Status */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full animate-pulse ${mercadoFechado ? 'bg-red-500' : 'bg-[#00F3FF]'}`} />
              <span className="text-[10px] font-black tracking-[0.2em]" style={{ color: mercadoFechado ? C.red : C.cyan }}>
                {mercadoFechado ? 'MERCADO FECHADO' : 'MERCADO ABERTO'}
              </span>
            </div>
            <span className="text-xs font-black tracking-widest text-[#F5C400] italic">
              {jogo.competicao.toUpperCase()}
            </span>
          </div>

          {!mercadoFechado && <Countdown dataHora={jogo.data_hora} />}

          {/* Confronto */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex flex-col items-center gap-3 flex-1">
              <Escudo src={jogo.mandante.escudo_url} alt={jogo.mandante.nome} />
              <span className="text-xs font-black text-white text-center leading-tight">{jogo.mandante.nome.toUpperCase()}</span>
            </div>

            <div className="flex flex-col items-center gap-2">
              <span className="text-2xl font-black italic text-white/10">VS</span>
              <div className="bg-white/5 px-3 py-1 rounded-full border border-white/10">
                <span className="text-[10px] font-bold text-[#F5C400]">
                  {new Date(jogo.data_hora).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} • {new Date(jogo.data_hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center gap-3 flex-1">
              <Escudo src={jogo.visitante.escudo_url} alt={jogo.visitante.nome} destaque />
              <span className="text-xs font-black text-[#F5C400] text-center leading-tight">{jogo.visitante.nome.toUpperCase()}</span>
            </div>
          </div>

          {/* Local e Transmissão */}
          {(jogo.local || jogo.transmissao) && (
            <div className="bg-zinc-900/50 rounded-2xl p-4 space-y-2 border border-white/5 mb-6">
              {jogo.local && (
                <div className="flex items-center justify-center gap-2 text-[11px] font-bold text-zinc-400">
                  <span className="opacity-100">📍</span> {jogo.local}
                </div>
              )}
              {jogo.transmissao && (
                <div className="flex items-center justify-center gap-2 text-[11px] font-black text-white">
                  <span className="text-lg">📺</span> {jogo.transmissao}
                </div>
              )}
            </div>
          )}

          {/* Botão de Convocação */}
          {mercadoFechado ? (
            <div className="w-full bg-zinc-900 rounded-2xl p-5 text-center text-zinc-500 font-black tracking-widest border border-white/5">
              🔒 ESCALAÇÕES BLOQUEADAS
            </div>
          ) : (
            <Link href={`/tigre-fc/escalar/${jogo.id}`} className="block w-full bg-[#F5C400] hover:bg-white text-black rounded-2xl p-5 text-center font-black tracking-tighter text-lg transition-all active:scale-95 shadow-[0_10px_30px_rgba(245,196,0,0.3)]">
              CONVOCAR ELITE →
            </Link>
          )}
        </div>
      </div>

      {/* SEÇÃO DE DESTAQUES (FIFA STYLE) */}
      <DestaquesFifa />

      {/* RANKING MINI */}
      {stats.ranking && (
        <div className="bg-zinc-900/30 rounded-3xl p-6 border border-white/5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[10px] font-black text-[#BF5FFF] tracking-[0.3em] uppercase">Global Ranking</h3>
            <span className="text-[9px] font-bold text-zinc-500 uppercase">{stats.participantes} Escalações</span>
          </div>
          <div className="space-y-2">
            {stats.ranking.slice(0, 3).map((r, i) => (
              <button 
                key={i}
                onClick={() => setPerfilAberto(r.apelido || r.nome || '')}
                className="w-full flex items-center justify-between bg-black/40 p-3 rounded-xl border border-white/5 hover:border-[#BF5FFF]/50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-black ${i === 0 ? 'text-[#F5C400]' : 'text-zinc-600'}`}>{i + 1}º</span>
                  <span className="text-xs font-bold text-white italic">{r.apelido || r.nome}</span>
                </div>
                <span className="text-xs font-black text-[#BF5FFF]">{r.pontos} <small className="text-[8px] opacity-50">PTS</small></span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* MODAL DE PERFIL */}
      {perfilAberto && (
        <TigreFCPerfilPublico
          targetUsuarioId={perfilAberto}
          viewerUsuarioId={meuId || undefined}
          onClose={() => setPerfilAberto(null)}
        />
      )}
    </div>
  );
}
