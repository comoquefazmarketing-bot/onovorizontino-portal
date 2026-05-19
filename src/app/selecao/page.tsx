'use client';

import { useState, useEffect, useRef } from 'react';
import type { Metadata } from 'next';
import SelecaoNewsGrid from '@/components/sections/SelecaoNewsGrid';
import CopaSubnav from '@/components/layout/CopaSubnav';
import CopaFerramentasTeaser from '@/components/sections/CopaFerramentasTeaser';

/* ─────────────────────────────────────────────
   TIPOS
───────────────────────────────────────────── */
type Posicao = 'Todos' | 'Goleiro' | 'Defensor' | 'Meio-campo' | 'Atacante';

interface Jogador {
  nome: string;
  apelido: string;
  posicao: Exclude<Posicao, 'Todos'>;
  clube: string;
  bandeira: string;
  camisa: number;
  destaque?: boolean;
  iniciais: string;
}

interface Jogo {
  data: string;
  hora: string;
  adversario: string;
  bandeiraAdv: string;
  fase: string;
  estadio: string;
  cidade: string;
  resultado?: string;
}


interface Curiosidade {
  numero: string;
  descricao: string;
  icone: string;
}

/* ─────────────────────────────────────────────
   DADOS — CONVOCAÇÃO ANCELOTTI (Mai/2026)
───────────────────────────────────────────── */
const jogadores: Jogador[] = [
  // Goleiros
  { nome: 'Alisson Becker',     apelido: 'Alisson',     posicao: 'Goleiro',    clube: 'Liverpool',       bandeira: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', camisa: 1,  iniciais: 'AL' },
  { nome: 'Ederson Moraes',     apelido: 'Ederson',     posicao: 'Goleiro',    clube: 'Fenerbahçe',      bandeira: '🇹🇷', camisa: 12, iniciais: 'ED' },
  { nome: 'Weverton',           apelido: 'Weverton',    posicao: 'Goleiro',    clube: 'Grêmio',          bandeira: '🇧🇷', camisa: 23, iniciais: 'WV' },
  // Defensores — Zagueiros
  { nome: 'Marquinhos',         apelido: 'Marquinhos',  posicao: 'Defensor',   clube: 'PSG',             bandeira: '🇫🇷', camisa: 4,  destaque: true, iniciais: 'MA' },
  { nome: 'Gabriel Magalhães',  apelido: 'Gabriel M.',  posicao: 'Defensor',   clube: 'Arsenal',         bandeira: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', camisa: 3,  iniciais: 'GM' },
  { nome: 'Bremer',             apelido: 'Bremer',      posicao: 'Defensor',   clube: 'Juventus',        bandeira: '🇮🇹', camisa: 5,  iniciais: 'BR' },
  { nome: 'Ibañez',             apelido: 'Ibañez',      posicao: 'Defensor',   clube: 'Al-Ahli',         bandeira: '🇸🇦', camisa: 13, iniciais: 'IB' },
  { nome: 'Léo Pereira',        apelido: 'Léo Pereira', posicao: 'Defensor',   clube: 'Flamengo',        bandeira: '🇧🇷', camisa: 14, iniciais: 'LP' },
  // Defensores — Laterais
  { nome: 'Wesley Andrade',     apelido: 'Wesley',      posicao: 'Defensor',   clube: 'Roma',            bandeira: '🇮🇹', camisa: 2,  iniciais: 'WE' },
  { nome: 'Alex Sandro',        apelido: 'Alex Sandro', posicao: 'Defensor',   clube: 'Flamengo',        bandeira: '🇧🇷', camisa: 6,  iniciais: 'AS' },
  { nome: 'Douglas Santos',     apelido: 'D. Santos',   posicao: 'Defensor',   clube: 'Zenit',           bandeira: '🇷🇺', camisa: 22, iniciais: 'DS' },
  { nome: 'Danilo Luiz',        apelido: 'Danilo',      posicao: 'Defensor',   clube: 'Flamengo',        bandeira: '🇧🇷', camisa: 25, iniciais: 'DA' },
  // Meio-campo
  { nome: 'Casemiro',           apelido: 'Casemiro',    posicao: 'Meio-campo', clube: 'Man. United',     bandeira: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', camisa: 16, iniciais: 'CA' },
  { nome: 'Bruno Guimarães',    apelido: 'Bruno G.',    posicao: 'Meio-campo', clube: 'Newcastle',       bandeira: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', camisa: 8,  destaque: true, iniciais: 'BG' },
  { nome: 'Danilo Santos',      apelido: 'D. Santos',   posicao: 'Meio-campo', clube: 'Botafogo',        bandeira: '🇧🇷', camisa: 15, iniciais: 'DN' },
  { nome: 'Lucas Paquetá',      apelido: 'Paquetá',     posicao: 'Meio-campo', clube: 'Flamengo',        bandeira: '🇧🇷', camisa: 21, iniciais: 'PQ' },
  { nome: 'Fabinho',            apelido: 'Fabinho',     posicao: 'Meio-campo', clube: 'Al-Ittihad',      bandeira: '🇸🇦', camisa: 17, iniciais: 'FA' },
  // Atacantes
  { nome: 'Vinícius Júnior',    apelido: 'Vini Jr.',    posicao: 'Atacante',   clube: 'Real Madrid',     bandeira: '🇪🇸', camisa: 7,  destaque: true, iniciais: 'VJ' },
  { nome: 'Neymar Jr.',         apelido: 'Neymar',      posicao: 'Atacante',   clube: 'Santos',          bandeira: '🇧🇷', camisa: 10, destaque: true, iniciais: 'NJ' },
  { nome: 'Raphinha',           apelido: 'Raphinha',    posicao: 'Atacante',   clube: 'Barcelona',       bandeira: '🇪🇸', camisa: 11, destaque: true, iniciais: 'RA' },
  { nome: 'Endrick Felipe',     apelido: 'Endrick',     posicao: 'Atacante',   clube: 'Lyon',            bandeira: '🇫🇷', camisa: 9,  destaque: true, iniciais: 'EN' },
  { nome: 'Gabriel Martinelli', apelido: 'Martinelli',  posicao: 'Atacante',   clube: 'Arsenal',         bandeira: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', camisa: 19, iniciais: 'MT' },
  { nome: 'Luiz Henrique',      apelido: 'Luiz H.',     posicao: 'Atacante',   clube: 'Zenit',           bandeira: '🇷🇺', camisa: 18, iniciais: 'LH' },
  { nome: 'Matheus Cunha',      apelido: 'M. Cunha',    posicao: 'Atacante',   clube: 'Man. United',     bandeira: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', camisa: 20, iniciais: 'MC' },
  { nome: 'Rayan',              apelido: 'Rayan',       posicao: 'Atacante',   clube: 'Bournemouth',     bandeira: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', camisa: 26, iniciais: 'RY' },
  { nome: 'Igor Thiago',        apelido: 'Igor Thiago', posicao: 'Atacante',   clube: 'Brentford',       bandeira: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', camisa: 24, iniciais: 'IT' },
];

const jogos: Jogo[] = [
  // Amistosos preparatórios (i=0, i=1)
  { data: '31 Mai', hora: 'A def.', adversario: 'Panamá',        bandeiraAdv: '🇵🇦', fase: 'Amistoso Preparatório',   estadio: 'Maracanã',                  cidade: 'Rio de Janeiro, Brasil' },
  { data: '06 Jun', hora: 'A def.', adversario: 'Egito',         bandeiraAdv: '🇪🇬', fase: 'Amistoso Preparatório',   estadio: 'Huntington Bank Field',      cidade: 'Cleveland, EUA' },
  // Fase de grupos — Grupo C: Brasil, Marrocos, Haiti, Escócia (i=2, i=3, i=4)
  { data: '13 Jun', hora: '19:00',  adversario: 'Marrocos',      bandeiraAdv: '🇲🇦', fase: 'Grupo C – Rodada 1',      estadio: 'MetLife Stadium',            cidade: 'Nova Iorque/NJ, EUA' },
  { data: '19 Jun', hora: '21:30',  adversario: 'Haiti',         bandeiraAdv: '🇭🇹', fase: 'Grupo C – Rodada 2',      estadio: 'Lincoln Financial Field',    cidade: 'Filadélfia, EUA' },
  { data: '24 Jun', hora: 'A def.', adversario: 'Escócia',       bandeiraAdv: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', fase: 'Grupo C – Rodada 3',      estadio: 'Hard Rock Stadium',          cidade: 'Miami, EUA' },
  // Mata-mata (i=5, i=6, i=7, i=8)
  { data: '29 Jun', hora: 'A def.', adversario: 'Oitavas de Final', bandeiraAdv: '🏆', fase: 'Mata-mata',             estadio: 'A definir',                  cidade: 'EUA / Canadá / México' },
  { data: '05 Jul', hora: 'A def.', adversario: 'Quartas de Final', bandeiraAdv: '🏆', fase: 'Mata-mata',             estadio: 'A definir',                  cidade: 'EUA / Canadá / México' },
  { data: '15 Jul', hora: 'A def.', adversario: 'SEMIFINAL',        bandeiraAdv: '🌟', fase: 'Semifinal',             estadio: 'A definir',                  cidade: 'EUA' },
  { data: '19 Jul', hora: '18:00',  adversario: 'GRANDE FINAL',     bandeiraAdv: '🏆', fase: 'Final — Copa do Mundo 2026', estadio: 'MetLife Stadium',       cidade: 'Nova York, EUA' },
];


const curiosidades: Curiosidade[] = [
  { numero: '5×', descricao: 'Maior campeão do mundo. Brasil é o único país pentacampeão e busca o hexatítulo.', icone: '🏆' },
  { numero: '26', descricao: 'Jogadores convocados para a Copa do Mundo 2026 por Carlo Ancelotti.', icone: '📋' },
  { numero: '2.062', descricao: 'Gols marcados pela Seleção ao longo da história. Pelé é o maior artilheiro com 77 gols.', icone: '⚽' },
  { numero: '64', descricao: 'Participações consecutivas em Copas do Mundo — único país com essa marca histórica.', icone: '🌍' },
  { numero: 'R$ 81', descricao: 'Bilhões em movimentação econômica estimada pela Copa do Mundo de 2026 para o Brasil.', icone: '📊' },
  { numero: '1,2 bi', descricao: 'Torcedores ao redor do mundo que acompanham a Seleção Brasileira. A maior torcida do planeta.', icone: '💛' },
];

const opcoesPoll = [
  { id: 1, nome: 'Vinícius Jr.', emoji: '⚡' },
  { id: 2, nome: 'Neymar',       emoji: '✨' },
  { id: 3, nome: 'Endrick',      emoji: '🔥' },
  { id: 4, nome: 'Raphinha',     emoji: '🎯' },
];

/* ─────────────────────────────────────────────
   COMPONENTE PRINCIPAL
───────────────────────────────────────────── */
export default function VerdeEAmarelo() {
  const [filtroPos, setFiltroPos] = useState<Posicao>('Todos');
  const [votado, setVotado] = useState<number | null>(null);
  const [votos, setVotos] = useState({ 1: 48, 2: 31, 3: 15, 4: 6 });
  const [confetes, setConfetes] = useState<{ id: number; x: number; delay: number; dur: number; color: string }[]>([]);
  const heroRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  const coresCon = ['#009c3b', '#ffdf00', '#002776', '#ffffff', '#00b347', '#ffd700'];

  useEffect(() => {
    const itens = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 6,
      dur: 4 + Math.random() * 5,
      color: coresCon[Math.floor(Math.random() * coresCon.length)],
    }));
    setConfetes(itens);

    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const jogadoresFiltrados = filtroPos === 'Todos'
    ? jogadores
    : jogadores.filter(j => j.posicao === filtroPos);

  const totalVotos = Object.values(votos).reduce((a, b) => a + b, 0);

  function votar(id: number) {
    if (votado !== null) return;
    setVotado(id);
    setVotos(v => ({ ...v, [id]: v[id as keyof typeof v] + 1 }));
  }

  const posicoes: Posicao[] = ['Todos', 'Goleiro', 'Defensor', 'Meio-campo', 'Atacante'];
  const corPosicao: Record<string, string> = {
    Goleiro: '#f59e0b',
    Defensor: '#3b82f6',
    'Meio-campo': '#8b5cf6',
    Atacante: '#ef4444',
  };

  return (
    <>
      {/* ── ESTILOS GLOBAIS DA SEÇÃO ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Oswald:wght@400;600;700&display=swap');

        :root {
          --verde: #009c3b;
          --verde-claro: #00c94a;
          --amarelo: #ffdf00;
          --amarelo-escuro: #e6c800;
          --azul: #002776;
          --azul-claro: #003daa;
        }

        .ve-titulo { font-family: 'Bebas Neue', 'Impact', sans-serif; letter-spacing: 0.04em; }
        .ve-subtitulo { font-family: 'Oswald', sans-serif; }

        /* Confete */
        @keyframes confeteFall {
          0%   { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        .confete { position: absolute; width: 8px; height: 8px; border-radius: 2px; pointer-events: none; }

        /* Hero shimmer */
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .ve-shimmer {
          background: linear-gradient(90deg, var(--verde) 0%, var(--amarelo) 30%, #fff 50%, var(--amarelo) 70%, var(--verde) 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }

        /* Pulse verde */
        @keyframes pulseVerde {
          0%, 100% { box-shadow: 0 0 0 0 rgba(0,156,59,0.7); }
          50%       { box-shadow: 0 0 0 14px rgba(0,156,59,0); }
        }
        .ve-pulse { animation: pulseVerde 2.5s infinite; }

        /* Fade-in-up */
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ve-fadein { animation: fadeInUp 0.6s ease both; }
        .ve-fadein-1 { animation-delay: 0.1s; }
        .ve-fadein-2 { animation-delay: 0.25s; }
        .ve-fadein-3 { animation-delay: 0.4s; }
        .ve-fadein-4 { animation-delay: 0.55s; }

        /* Diagonal stripe BG */
        .ve-stripes {
          background: repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 8px,
            rgba(255,223,0,0.04) 8px,
            rgba(255,223,0,0.04) 16px
          );
        }

        /* Card jogador hover */
        .card-jogador {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .card-jogador:hover {
          transform: translateY(-6px) scale(1.02);
          box-shadow: 0 12px 32px rgba(0,156,59,0.35);
        }

        /* Botão filtro ativo */
        .btn-filtro-ativo {
          background: linear-gradient(135deg, var(--verde), var(--verde-claro));
          color: #fff;
          border-color: var(--verde-claro);
          box-shadow: 0 4px 14px rgba(0,156,59,0.5);
        }

        /* Barra de votos */
        @keyframes barraGrow {
          from { width: 0; }
        }
        .barra-voto { animation: barraGrow 0.8s ease both; }

        /* Faixa diagonal decorativa */
        .ve-faixa::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 4px;
          background: linear-gradient(90deg, var(--verde), var(--amarelo), var(--azul));
        }

        /* Star pattern */
        .ve-stars-bg {
          background-image: radial-gradient(circle, rgba(255,223,0,0.08) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        /* Scroll bar section */
        .ve-section { scroll-margin-top: 80px; }

        /* Live badge */
        @keyframes livePulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
        .ve-live-dot { animation: livePulse 1s infinite; }

        /* Jogo card hover */
        .card-jogo {
          transition: border-color 0.2s, background 0.2s, transform 0.2s;
        }
        .card-jogo:hover {
          border-color: var(--amarelo);
          background: rgba(255,223,0,0.05);
          transform: translateX(4px);
        }
      `}</style>

      {/* Sub-nav Copa 2026 — link para /copa */}
      <CopaSubnav />

      <div className="bg-[#030a04] min-h-screen text-white overflow-x-hidden">

        {/* ══════════════════════════════════════
            HERO — "A SELEÇÃO ESTÁ DE VOLTA"
        ══════════════════════════════════════ */}
        <section
          ref={heroRef}
          className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden ve-section"
          id="hero"
          aria-label="Seção especial da Seleção Brasileira"
        >
          {/* Confetes */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-20" aria-hidden="true">
            {confetes.map(c => (
              <div
                key={c.id}
                className="confete"
                style={{
                  left: `${c.x}%`,
                  top: '-20px',
                  backgroundColor: c.color,
                  animationName: 'confeteFall',
                  animationDuration: `${c.dur}s`,
                  animationDelay: `${c.delay}s`,
                  animationIterationCount: 'infinite',
                  animationTimingFunction: 'linear',
                }}
              />
            ))}
          </div>

          {/* Fundo gradiente */}
          <div
            className="absolute inset-0 z-0"
            style={{
              background: 'radial-gradient(ellipse at 20% 50%, rgba(0,156,59,0.25) 0%, transparent 60%), radial-gradient(ellipse at 80% 30%, rgba(255,223,0,0.15) 0%, transparent 50%), radial-gradient(ellipse at 50% 100%, rgba(0,39,118,0.3) 0%, transparent 60%), #030a04',
            }}
            aria-hidden="true"
          />

          {/* Stripes diagonais */}
          <div className="absolute inset-0 z-0 ve-stripes opacity-60" aria-hidden="true" />

          {/* Losango central decorativo */}
          <div
            className="absolute z-0 w-[600px] h-[600px] opacity-[0.06]"
            style={{
              background: 'conic-gradient(from 0deg, #009c3b, #ffdf00, #002776, #009c3b)',
              clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
              borderRadius: '12px',
              animation: 'shimmer 8s linear infinite',
            }}
            aria-hidden="true"
          />

          {/* Conteúdo Hero */}
          <div className="relative z-10 flex flex-col items-center text-center px-4 py-20 max-w-5xl mx-auto">

            {/* Badge topo */}
            <div className="ve-fadein ve-fadein-1 inline-flex items-center gap-2 bg-[#002776]/80 border border-[#ffdf00]/40 rounded-full px-5 py-2 mb-8 backdrop-blur-sm">
              <span className="ve-live-dot w-2 h-2 rounded-full bg-[#ffdf00] inline-block" />
              <span className="ve-subtitulo text-[#ffdf00] text-xs font-bold tracking-[0.2em] uppercase">
                Copa do Mundo 2026 · EUA · Canadá · México
              </span>
            </div>

            {/* Título principal */}
            <h1 className="ve-fadein ve-fadein-2 ve-titulo text-[min(22vw,180px)] leading-none mb-4 select-none">
              <span className="ve-shimmer">VERDE</span>
              <br />
              <span style={{ color: '#ffdf00', textShadow: '0 0 60px rgba(255,223,0,0.5)' }}>E AMARELO</span>
            </h1>

            {/* Subtítulo */}
            <p className="ve-fadein ve-fadein-3 ve-subtitulo text-lg md:text-2xl text-white/80 font-light tracking-widest uppercase mb-10 max-w-2xl">
              A <strong className="text-[#009c3b] font-bold">Seleção Canarinho</strong> convocada por{' '}
              <strong className="text-[#ffdf00]">Carlo Ancelotti</strong>. O hexacampeonato começa aqui.
            </p>

            {/* CTAs */}
            <div className="ve-fadein ve-fadein-4 flex flex-wrap justify-center gap-4">
              <a
                href="#convocacao"
                className="ve-pulse inline-flex items-center gap-2 bg-[#009c3b] hover:bg-[#00b347] text-white font-bold px-8 py-3 rounded-full transition-colors ve-subtitulo text-sm tracking-wider uppercase shadow-lg"
                aria-label="Ver convocação completa"
              >
                ⚽ Ver Convocação
              </a>
              <a
                href="#agenda"
                className="inline-flex items-center gap-2 bg-transparent hover:bg-[#ffdf00]/10 text-[#ffdf00] font-bold px-8 py-3 rounded-full border border-[#ffdf00]/60 transition-colors ve-subtitulo text-sm tracking-wider uppercase"
                aria-label="Ver agenda de jogos"
              >
                📅 Agenda de Jogos
              </a>
            </div>

            {/* Escudos / stats mini */}
            <div className="ve-fadein ve-fadein-4 mt-14 flex flex-wrap justify-center gap-8 text-center">
              {[
                { num: '26', label: 'Convocados' },
                { num: '5×', label: 'Campeão Mundial' },
                { num: '#1', label: 'Ranking FIFA' },
                { num: 'Hex', label: 'Nosso Objetivo' },
              ].map(s => (
                <div key={s.label} className="flex flex-col items-center">
                  <span className="ve-titulo text-3xl md:text-4xl" style={{ color: '#ffdf00' }}>{s.num}</span>
                  <span className="ve-subtitulo text-xs text-white/50 uppercase tracking-widest mt-1">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Seta scroll */}
          <a
            href="#convocacao"
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white/40 hover:text-white/80 transition-colors"
            aria-label="Rolar para baixo"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </a>
        </section>

        {/* ══════════════════════════════════════
            CONVOCAÇÃO — DESTAQUE ANCELOTTI
        ══════════════════════════════════════ */}
        <section className="ve-section relative py-20 px-4 ve-faixa ve-stars-bg" id="convocacao">
          <div className="max-w-6xl mx-auto">

            {/* Header da seção */}
            <div className="text-center mb-14">
              <span className="ve-subtitulo text-[#009c3b] text-xs font-bold tracking-[0.25em] uppercase block mb-3">
                📋 Anunciada hoje por Carlo Ancelotti
              </span>
              <h2 className="ve-titulo text-5xl md:text-7xl mb-4">
                <span className="text-white">A CONVOCAÇÃO</span>{' '}
                <span style={{ color: '#ffdf00' }}>OFICIAL</span>
              </h2>
              <div className="w-24 h-1 mx-auto rounded-full" style={{ background: 'linear-gradient(90deg, #009c3b, #ffdf00)' }} />
            </div>

            {/* Card destaque Ancelotti */}
            <div
              className="relative rounded-2xl p-6 md:p-10 mb-12 overflow-hidden border border-[#ffdf00]/20"
              style={{ background: 'linear-gradient(135deg, rgba(0,39,118,0.6) 0%, rgba(0,10,30,0.9) 100%)' }}
            >
              <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{ background: 'linear-gradient(90deg, #009c3b, #ffdf00, #002776)' }} aria-hidden="true" />
              <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #ffdf00, transparent)' }} aria-hidden="true" />

              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div
                  className="w-20 h-20 rounded-full flex-shrink-0 flex items-center justify-center text-4xl border-2 border-[#ffdf00]/50"
                  style={{ background: 'linear-gradient(135deg, #009c3b, #002776)' }}
                  aria-hidden="true"
                >🎩</div>
                <div className="flex-1">
                  <p className="ve-subtitulo text-[#ffdf00] text-xs font-bold tracking-[0.2em] uppercase mb-1">Técnico da Seleção Brasileira</p>
                  <h3 className="ve-titulo text-4xl md:text-5xl text-white mb-2">Carlo Ancelotti</h3>
                  <p className="text-white/70 text-sm leading-relaxed max-w-2xl">
                    3× campeão da Champions League, tricampeão pelo Real Madrid. O italiano mais vitorioso da história
                    assume o Brasil com o objetivo claro: trazer o hexacampeonato. A lista dos 26 guerreiros está anunciada.
                  </p>
                </div>
                <div className="flex-shrink-0 text-center">
                  <div className="ve-titulo text-5xl text-[#ffdf00]">26</div>
                  <div className="ve-subtitulo text-xs text-white/50 uppercase tracking-wider">Convocados</div>
                </div>
              </div>

              <blockquote className="mt-6 pl-4 border-l-2 border-[#009c3b] italic text-white/80 text-sm">
                "Temos o melhor elenco do mundo. Estou aqui para ganhar a Copa — esse é o único objetivo."
                <footer className="not-italic text-white/50 text-xs mt-1">— Carlo Ancelotti, coletiva de convocação · 18 Mai 2026</footer>
              </blockquote>
            </div>

            {/* Filtros por posição */}
            <div className="flex flex-wrap justify-center gap-3 mb-8" role="group" aria-label="Filtrar jogadores por posição">
              {posicoes.map(pos => (
                <button
                  key={pos}
                  onClick={() => setFiltroPos(pos)}
                  className={`ve-subtitulo px-5 py-2 rounded-full text-sm font-semibold border transition-all tracking-wider uppercase
                    ${filtroPos === pos
                      ? 'btn-filtro-ativo'
                      : 'border-white/20 text-white/60 hover:border-[#009c3b]/60 hover:text-white'}`}
                  aria-pressed={filtroPos === pos}
                >
                  {pos === 'Todos' ? '⚽ Todos (26)' : pos}
                  {pos !== 'Todos' && ` (${jogadores.filter(j => j.posicao === pos).length})`}
                </button>
              ))}
            </div>

            {/* Grid jogadores */}
            <div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3"
              role="list"
              aria-label="Elenco convocado"
            >
              {jogadoresFiltrados.map((j, idx) => (
                <article
                  key={j.nome}
                  className="card-jogador relative rounded-xl overflow-hidden cursor-default"
                  style={{
                    background: 'linear-gradient(160deg, rgba(0,30,12,0.95) 0%, rgba(0,10,30,0.98) 100%)',
                    border: j.destaque ? '1px solid rgba(255,223,0,0.5)' : '1px solid rgba(255,255,255,0.06)',
                    animationDelay: `${idx * 0.03}s`,
                  }}
                  role="listitem"
                  aria-label={`${j.apelido}, ${j.posicao}, ${j.clube}`}
                >
                  {j.destaque && (
                    <div
                      className="absolute top-0 right-0 w-0 h-0"
                      style={{ borderTop: '28px solid #ffdf00', borderLeft: '28px solid transparent' }}
                      aria-label="Jogador destaque"
                    />
                  )}

                  {/* Avatar com iniciais */}
                  <div className="flex flex-col items-center pt-5 px-3 pb-3">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg mb-2 border-2"
                      style={{
                        background: `linear-gradient(135deg, ${corPosicao[j.posicao] || '#009c3b'}33, ${corPosicao[j.posicao] || '#009c3b'}88)`,
                        borderColor: `${corPosicao[j.posicao] || '#009c3b'}66`,
                      }}
                      aria-hidden="true"
                    >
                      {j.iniciais}
                    </div>

                    {/* Nome */}
                    <p className="ve-subtitulo font-bold text-white text-center text-xs leading-tight mb-1">
                      {j.apelido}
                    </p>

                    {/* Badge posição */}
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full mb-2 ve-subtitulo uppercase tracking-wider"
                      style={{
                        background: `${corPosicao[j.posicao] || '#009c3b'}22`,
                        color: corPosicao[j.posicao] || '#009c3b',
                        border: `1px solid ${corPosicao[j.posicao] || '#009c3b'}44`,
                      }}
                    >
                      {j.posicao === 'Meio-campo' ? 'Meio' : j.posicao}
                    </span>

                    {/* Clube */}
                    <div className="flex items-center gap-1">
                      <span className="text-base" aria-hidden="true">{j.bandeira}</span>
                      <span className="text-white/50 text-[10px] ve-subtitulo">{j.clube}</span>
                    </div>
                  </div>

                  {/* Camisa */}
                  <div
                    className="absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ background: 'rgba(0,156,59,0.6)' }}
                    aria-label={`Camisa ${j.camisa}`}
                  >
                    {j.camisa}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            AGENDA DE JOGOS
        ══════════════════════════════════════ */}
        <section className="ve-section py-20 px-4" id="agenda" style={{ background: 'linear-gradient(180deg, #030a04 0%, #030816 100%)' }}>
          <div className="max-w-4xl mx-auto">

            <div className="text-center mb-14">
              <span className="ve-subtitulo text-[#ffdf00] text-xs font-bold tracking-[0.25em] uppercase block mb-3">📅 Copa do Mundo 2026</span>
              <h2 className="ve-titulo text-5xl md:text-7xl text-white mb-2">NOSSA <span style={{ color: '#009c3b' }}>JORNADA</span></h2>
              <div className="w-24 h-1 mx-auto rounded-full" style={{ background: 'linear-gradient(90deg, #ffdf00, #009c3b)' }} />
            </div>

            <div className="space-y-3" role="list" aria-label="Jogos do Brasil na Copa do Mundo 2026">
              {jogos.map((jogo, i) => (
                <article
                  key={i}
                  className="card-jogo relative rounded-xl px-5 py-4 border border-white/8 overflow-hidden"
                  style={{ background: 'rgba(0,10,20,0.8)' }}
                  role="listitem"
                >
                  {/* Indicador de fase */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl" style={{ background: i >= 5 ? '#ffdf00' : '#009c3b' }} aria-hidden="true" />

                  <div className="flex flex-wrap items-center gap-3 pl-3">
                    {/* Data/Hora */}
                    <div className="flex-shrink-0 text-center min-w-[60px]">
                      <div className="ve-titulo text-xl text-[#ffdf00]">{jogo.data}</div>
                      <div className="ve-subtitulo text-xs text-white/40">{jogo.hora} BRT</div>
                    </div>

                    {/* Confronto */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl" aria-hidden="true">🇧🇷</span>
                        <span className="ve-subtitulo font-bold text-white text-sm hidden sm:block">Brasil</span>
                      </div>
                      <span className="ve-titulo text-white/40 text-lg">VS</span>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl" aria-hidden="true">{jogo.bandeiraAdv}</span>
                        <span className="ve-subtitulo font-bold text-white text-sm">{jogo.adversario}</span>
                      </div>
                    </div>

                    {/* Info jogo */}
                    <div className="flex-shrink-0 text-right hidden md:block">
                      <div className="ve-subtitulo text-xs text-white/60">{jogo.estadio}</div>
                      <div className="ve-subtitulo text-xs text-white/40">{jogo.cidade}</div>
                    </div>

                    {/* Fase badge */}
                    <div
                      className="flex-shrink-0 text-[10px] font-bold px-3 py-1 rounded-full ve-subtitulo uppercase tracking-wider"
                      style={{
                        background: i >= 5 ? 'rgba(255,223,0,0.12)' : 'rgba(0,156,59,0.12)',
                        color: i >= 5 ? '#ffdf00' : '#00c94a',
                        border: `1px solid ${i >= 5 ? 'rgba(255,223,0,0.3)' : 'rgba(0,156,59,0.3)'}`,
                      }}
                    >
                      {i < 2 ? 'Amistoso' : i < 5 ? 'Grupos' : i === 8 ? '🏆 Final' : 'Mata-mata'}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            FERRAMENTAS DA COPA
        ══════════════════════════════════════ */}
        <CopaFerramentasTeaser />

        {/* ══════════════════════════════════════
            NOTÍCIAS DA SELEÇÃO
        ══════════════════════════════════════ */}
        <section className="ve-section py-20 px-4 ve-stars-bg" id="noticias" style={{ background: '#030a04' }}>
          <div className="max-w-6xl mx-auto">

            <div className="text-center mb-14">
              <span className="ve-subtitulo text-[#009c3b] text-xs font-bold tracking-[0.25em] uppercase block mb-3">🗞️ Direto do Gramado</span>
              <h2 className="ve-titulo text-5xl md:text-7xl text-white mb-2">ÚLTIMAS <span style={{ color: '#ffdf00' }}>NOTÍCIAS</span></h2>
              <div className="w-24 h-1 mx-auto rounded-full" style={{ background: 'linear-gradient(90deg, #009c3b, #ffdf00)' }} />
            </div>

            {/* Grid dinâmico — busca da tabela postagens, categoria "Seleção Brasileira" */}
            <SelecaoNewsGrid />
          </div>
        </section>

        {/* ══════════════════════════════════════
            GALERIA / TORCIDA
        ══════════════════════════════════════ */}
        <section
          className="ve-section py-20 px-4"
          id="galeria"
          style={{ background: 'linear-gradient(135deg, rgba(0,39,118,0.2) 0%, #030a04 50%, rgba(0,156,59,0.1) 100%)' }}
        >
          <div className="max-w-6xl mx-auto">

            <div className="text-center mb-14">
              <span className="ve-subtitulo text-[#ffdf00] text-xs font-bold tracking-[0.25em] uppercase block mb-3">🎉 Pátria Amada Brasil</span>
              <h2 className="ve-titulo text-5xl md:text-7xl text-white mb-2">TORCIDA <span style={{ color: '#009c3b' }}>CANARINHO</span></h2>
              <div className="w-24 h-1 mx-auto rounded-full" style={{ background: 'linear-gradient(90deg, #002776, #009c3b, #ffdf00)' }} />
            </div>

            {/* Mosaico de emojis / torcida */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { emoji: '🇧🇷', titulo: 'Vai, Brasil!', desc: 'A maior torcida do planeta unida por um sonho.' },
                { emoji: '⚽', titulo: 'O Hexa é Nosso', desc: 'Cinco estrelas. Uma missão. Escrever a história.' },
                { emoji: '🏆', titulo: 'Copa do Mundo 2026', desc: 'EUA, Canadá e México recebem a maior festa do futebol.' },
                { emoji: '💛', titulo: 'Amor ao Futebol', desc: 'Do Maracanã ao MetLife. O verde e amarelo não para.' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="card-jogador rounded-2xl p-6 text-center border border-white/8"
                  style={{ background: 'rgba(0,20,10,0.8)' }}
                >
                  <div className="text-5xl mb-4" role="img" aria-label={item.titulo}>{item.emoji}</div>
                  <h3 className="ve-titulo text-xl text-[#ffdf00] mb-2">{item.titulo}</h3>
                  <p className="text-white/50 text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Faixa motivacional */}
            <div
              className="mt-8 rounded-2xl p-8 text-center relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #002776, #001040)' }}
            >
              <div className="absolute inset-0 ve-stripes opacity-30" aria-hidden="true" />
              <p className="ve-titulo text-3xl md:text-5xl relative z-10">
                <span style={{ color: '#009c3b' }}>CINCO</span>{' '}
                <span className="text-white">ESTRELAS.</span>{' '}
                <span style={{ color: '#ffdf00' }}>UM DESTINO.</span>
              </p>
              <p className="ve-subtitulo text-white/60 text-sm mt-3 relative z-10 tracking-widest uppercase">
                O hexacampeonato é uma questão de tempo. E esse tempo é agora.
              </p>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            ESTATÍSTICAS E CURIOSIDADES
        ══════════════════════════════════════ */}
        <section className="ve-section py-20 px-4" id="stats" style={{ background: '#030a04' }}>
          <div className="max-w-6xl mx-auto">

            <div className="text-center mb-14">
              <span className="ve-subtitulo text-[#009c3b] text-xs font-bold tracking-[0.25em] uppercase block mb-3">📊 Números que Emocionam</span>
              <h2 className="ve-titulo text-5xl md:text-7xl text-white mb-2">BRASIL <span style={{ color: '#ffdf00' }}>EM DADOS</span></h2>
              <div className="w-24 h-1 mx-auto rounded-full" style={{ background: 'linear-gradient(90deg, #009c3b, #ffdf00)' }} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {curiosidades.map((c, i) => (
                <div
                  key={i}
                  className="card-jogador rounded-xl p-6 border border-white/8 relative overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, rgba(0,20,10,0.95), rgba(0,10,30,0.95))' }}
                >
                  <div
                    className="absolute -right-6 -bottom-6 text-7xl opacity-10 select-none pointer-events-none"
                    aria-hidden="true"
                  >{c.icone}</div>

                  <div className="text-3xl mb-3" role="img" aria-label={c.icone}>{c.icone}</div>
                  <div className="ve-titulo text-4xl md:text-5xl mb-2" style={{ color: '#ffdf00' }}>{c.numero}</div>
                  <p className="text-white/60 text-sm leading-relaxed">{c.descricao}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            ENQUETE / VOTAÇÃO
        ══════════════════════════════════════ */}
        <section
          className="ve-section py-20 px-4 ve-stars-bg"
          id="enquete"
          style={{ background: 'linear-gradient(180deg, #030a04, #020810)' }}
        >
          <div className="max-w-xl mx-auto">

            <div className="text-center mb-10">
              <span className="ve-subtitulo text-[#ffdf00] text-xs font-bold tracking-[0.25em] uppercase block mb-3">🗳️ A voz da torcida</span>
              <h2 className="ve-titulo text-4xl md:text-6xl text-white mb-2">
                QUEM SERÁ O <span style={{ color: '#009c3b' }}>CRAQUE</span>?
              </h2>
              <p className="text-white/50 text-sm ve-subtitulo">Vote no seu favorito para artilheiro do Brasil no Mundial</p>
              <div className="w-24 h-1 mx-auto rounded-full mt-4" style={{ background: 'linear-gradient(90deg, #ffdf00, #009c3b)' }} />
            </div>

            <div
              className="rounded-2xl overflow-hidden border border-white/10 relative"
              style={{ background: 'rgba(0,15,8,0.95)' }}
              role="form"
              aria-label="Enquete: quem será o artilheiro"
            >
              <div className="h-1" style={{ background: 'linear-gradient(90deg, #009c3b, #ffdf00, #002776)' }} aria-hidden="true" />
              <div className="p-6 space-y-3">
                {opcoesPoll.map(op => {
                  const pct = Math.round(((votos[op.id as keyof typeof votos]) / (totalVotos + (votado !== null ? 1 : 0))) * 100);
                  const isVotado = votado === op.id;
                  return (
                    <button
                      key={op.id}
                      onClick={() => votar(op.id)}
                      disabled={votado !== null}
                      className={`w-full text-left rounded-xl overflow-hidden border transition-all relative
                        ${votado !== null
                          ? isVotado
                            ? 'border-[#009c3b]/60'
                            : 'border-white/8 opacity-70'
                          : 'border-white/12 hover:border-[#009c3b]/40 cursor-pointer'
                        }`}
                      style={{ background: 'rgba(0,25,15,0.8)' }}
                      aria-label={`Votar em ${op.nome}`}
                      aria-pressed={isVotado}
                    >
                      {/* Barra de progresso */}
                      {votado !== null && (
                        <div
                          className="barra-voto absolute inset-y-0 left-0 rounded-xl transition-all"
                          style={{
                            width: `${pct}%`,
                            background: isVotado
                              ? 'linear-gradient(90deg, rgba(0,156,59,0.35), rgba(0,200,80,0.2))'
                              : 'rgba(255,255,255,0.04)',
                          }}
                          aria-hidden="true"
                        />
                      )}

                      <div className="relative flex items-center justify-between px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl" aria-hidden="true">{op.emoji}</span>
                          <span className="ve-subtitulo font-bold text-white text-sm">{op.nome}</span>
                          {isVotado && <span className="text-[#009c3b] text-lg" aria-label="Seu voto">✓</span>}
                        </div>
                        {votado !== null && (
                          <span className="ve-titulo text-xl" style={{ color: isVotado ? '#ffdf00' : 'rgba(255,255,255,0.4)' }}>
                            {pct}%
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Footer enquete */}
              <div className="px-6 pb-5 text-center">
                {votado !== null ? (
                  <p className="text-[#009c3b] text-xs ve-subtitulo font-semibold">
                    ✅ Voto computado! {totalVotos + 1} pessoas já votaram.
                  </p>
                ) : (
                  <p className="text-white/30 text-xs ve-subtitulo">{totalVotos} votos · Toque para votar</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            RODAPÉ DA SEÇÃO
        ══════════════════════════════════════ */}
        <div
          className="py-12 px-4 text-center"
          style={{ background: 'linear-gradient(180deg, #020810, #030a04)' }}
        >
          <div className="ve-titulo text-2xl md:text-3xl mb-2">
            <span style={{ color: '#009c3b' }}>BRASIL</span>{' '}
            <span className="text-white">·</span>{' '}
            <span style={{ color: '#ffdf00' }}>HEXACAMPEÃO</span>{' '}
            <span className="text-white">·</span>{' '}
            <span style={{ color: '#002776' }}>2026</span>
          </div>
          <p className="text-white/30 text-xs ve-subtitulo tracking-widest uppercase">
            Portal O Novorizontino · Cobertura especial Copa do Mundo
          </p>
        </div>

      </div>
    </>
  );
}
