'use client';
import { useState, useRef, useEffect } from 'react';
import ProximoDuelo from '@/components/sections/ProximoDuelo';

const BASE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';
const LOGO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/LOGO%20-%20O%20NOVORIZONTINO%20(1).png';

const PLAYERS = [
  { id: 1,  name: 'César Augusto',    short: 'César',      num: 31, pos: 'GOL', foto: BASE + 'CESAR-AUGUSTO.jpg.webp' },
  { id: 2,  name: 'Jordi',            short: 'Jordi',      num: 93, pos: 'GOL', foto: BASE + 'JORDI.jpg.webp' },
  { id: 3,  name: 'João Scapin',      short: 'Scapin',     num: 12, pos: 'GOL', foto: BASE + 'JOAO-SCAPIN.jpg.webp' },
  { id: 4,  name: 'Lucas Ribeiro',    short: 'Lucas',      num: 1,  pos: 'GOL', foto: BASE + 'LUCAS-RIBEIRO.jpg.webp' },
  { id: 5,  name: 'Lora',             short: 'Lora',       num: 2,  pos: 'LAT', foto: BASE + 'LORA.jpg.webp' },
  { id: 6,  name: 'Castrillón',       short: 'Castrillón', num: 6,  pos: 'LAT', foto: BASE + 'CASTRILLON.jpg.webp' },
  { id: 7,  name: 'Arthur Barbosa',   short: 'A.Barbosa',  num: 22, pos: 'LAT', foto: BASE + 'ARTHUR-BARBOSA.jpg.webp' },
  { id: 8,  name: 'Mayk',             short: 'Mayk',       num: 26, pos: 'LAT', foto: BASE + 'MAYK.jpg.webp' },
  { id: 9,  name: 'Maykon Jesus',     short: 'Maykon',     num: 27, pos: 'LAT', foto: BASE + 'MAYKON-JESUS.jpg.webp' },
  { id: 10, name: 'Dantas',           short: 'Dantas',     num: 3,  pos: 'ZAG', foto: BASE + 'DANTAAS.jpg.webp' },
  { id: 11, name: 'Eduardo Brock',    short: 'E.Brock',    num: 5,  pos: 'ZAG', foto: BASE + 'EDUARDO-BROCK.jpg.webp' },
  { id: 12, name: 'Patrick',          short: 'Patrick',    num: 4,  pos: 'ZAG', foto: BASE + 'PATRICK.jpg.webp' },
  { id: 13, name: 'Gabriel Bahia',    short: 'G.Bahia',    num: 14, pos: 'ZAG', foto: BASE + 'GABRIEL-BAHIA.jpg.webp' },
  { id: 14, name: 'Carlinhos',        short: 'Carlinhos',  num: 25, pos: 'ZAG', foto: BASE + 'CARLINHOS.jpg.webp' },
  { id: 15, name: 'Alemão',           short: 'Alemão',     num: 28, pos: 'ZAG', foto: BASE + 'ALEMAO.jpg.webp' },
  { id: 16, name: 'Renato Palm',      short: 'R.Palm',     num: 24, pos: 'ZAG', foto: BASE + 'RENATO-PALM.jpg.webp' },
  { id: 17, name: 'Alvariño',         short: 'Alvariño',   num: 35, pos: 'ZAG', foto: BASE + 'IVAN-ALVARINO.jpg.webp' },
  { id: 18, name: 'Bruno Santana',    short: 'B.Santana',  num: 33, pos: 'ZAG', foto: BASE + 'BRUNO-SANTANA.jpg.webp' },
  { id: 19, name: 'Luís Oyama',       short: 'Oyama',      num: 8,  pos: 'MEI', foto: BASE + 'LUIS-OYAMA.jpg.webp' },
  { id: 20, name: 'Léo Naldi',        short: 'L.Naldi',    num: 7,  pos: 'MEI', foto: BASE + 'LEO-NALDI.jpg.webp' },
  { id: 21, name: 'Rômulo',           short: 'Rômulo',     num: 10, pos: 'MEI', foto: BASE + 'ROMULO.jpg.webp' },
  { id: 22, name: 'Matheus Bianqui',  short: 'Bianqui',    num: 11, pos: 'MEI', foto: BASE + 'MATHEUS-BIANQUI.jpg.webp' },
  { id: 23, name: 'Juninho',          short: 'Juninho',    num: 20, pos: 'MEI', foto: BASE + 'JUNINHO.jpg.webp' },
  { id: 24, name: 'Tavinho',          short: 'Tavinho',    num: 17, pos: 'MEI', foto: BASE + 'TAVINHO.jpg.webp' },
  { id: 25, name: 'Diego Galo',       short: 'D.Galo',     num: 29, pos: 'MEI', foto: BASE + 'DIEGO-GALO.jpg.webp' },
  { id: 26, name: 'Marlon',           short: 'Marlon',     num: 30, pos: 'MEI', foto: BASE + 'MARLON.jpg.webp' },
  { id: 27, name: 'Hector Bianchi',   short: 'Hector',     num: 16, pos: 'MEI', foto: BASE + 'HECTOR-BIACHI.jpg.webp' },
  { id: 28, name: 'Nogueira',         short: 'Nogueira',   num: 36, pos: 'MEI', foto: BASE + 'NOGUEIRA.jpg.webp' },
  { id: 29, name: 'Luiz Gabriel',     short: 'L.Gabriel',  num: 37, pos: 'MEI', foto: BASE + 'LUIZ-GABRIEL.jpg.webp' },
  { id: 30, name: 'Jhones Kauê',      short: 'J.Kauê',     num: 50, pos: 'MEI', foto: BASE + 'JHONES-KAUE.jpg.webp' },
  { id: 31, name: 'Robson',           short: 'Robson',     num: 9,  pos: 'ATA', foto: BASE + 'ROBSON.jpg.webp' },
  { id: 32, name: 'Vinícius Paiva',   short: 'V.Paiva',    num: 13, pos: 'ATA', foto: BASE + 'VINICIUS-PAIVA.jpg.webp' },
  { id: 33, name: 'Hélio Borges',     short: 'H.Borges',   num: 18, pos: 'ATA', foto: BASE + 'HELIO-BORGES.jpg.webp' },
  { id: 34, name: 'Jardiel',          short: 'Jardiel',    num: 19, pos: 'ATA', foto: BASE + 'JARDIEL.jpg.webp' },
  { id: 35, name: 'Nicolas Careca',   short: 'N.Careca',   num: 21, pos: 'ATA', foto: BASE + 'NICOLAS-CARECA.jpg.webp' },
  { id: 36, name: 'Titi Ortiz',       short: 'T.Ortiz',    num: 15, pos: 'ATA', foto: BASE + 'TITI-ORTIZ.jpg.webp' },
  { id: 37, name: 'Diego Mathias',    short: 'D.Mathias',  num: 41, pos: 'ATA', foto: BASE + 'DIEGO-MATHIAS.jpg.webp' },
  { id: 38, name: 'Carlão',           short: 'Carlão',     num: 90, pos: 'ATA', foto: BASE + 'CARLAO.jpg.webp' },
  { id: 39, name: 'Ronald Barcellos', short: 'Ronald',     num: 23, pos: 'ATA', foto: BASE + 'RONALD-BARCELLOS.jpg.webp' },
];

const FORMATIONS: Record<string, { id: string; label: string; x: number; y: number }[]> = {
  '4-3-3': [
    { id: 'gk',  label: 'GOL', x: 50, y: 88 }, { id: 'rb',  label: 'LAT', x: 82, y: 70 },
    { id: 'cb1', label: 'ZAG', x: 62, y: 70 }, { id: 'cb2', label: 'ZAG', x: 38, y: 70 },
    { id: 'lb',  label: 'LAT', x: 18, y: 70 }, { id: 'cm1', label: 'MEI', x: 72, y: 50 },
    { id: 'cm2', label: 'MEI', x: 50, y: 46 }, { id: 'cm3', label: 'MEI', x: 28, y: 50 },
    { id: 'rw',  label: 'ATA', x: 76, y: 24 }, { id: 'st',  label: 'ATA', x: 50, y: 18 },
    { id: 'lw',  label: 'ATA', x: 24, y: 24 },
  ],
  '4-4-2': [
    { id: 'gk',  label: 'GOL', x: 50, y: 88 }, { id: 'rb',  label: 'LAT', x: 82, y: 70 },
    { id: 'cb1', label: 'ZAG', x: 62, y: 70 }, { id: 'cb2', label: 'ZAG', x: 38, y: 70 },
    { id: 'lb',  label: 'LAT', x: 18, y: 70 }, { id: 'rm',  label: 'MEI', x: 80, y: 50 },
    { id: 'cm1', label: 'MEI', x: 60, y: 50 }, { id: 'cm2', label: 'MEI', x: 40, y: 50 },
    { id: 'lm',  label: 'MEI', x: 20, y: 50 }, { id: 'st1', label: 'ATA', x: 64, y: 22 },
    { id: 'st2', label: 'ATA', x: 36, y: 22 },
  ],
  '3-5-2': [
    { id: 'gk',  label: 'GOL', x: 50, y: 88 }, { id: 'cb1', label: 'ZAG', x: 70, y: 72 },
    { id: 'cb2', label: 'ZAG', x: 50, y: 75 }, { id: 'cb3', label: 'ZAG', x: 30, y: 72 },
    { id: 'rb',  label: 'LAT', x: 86, y: 52 }, { id: 'cm1', label: 'MEI', x: 68, y: 50 },
    { id: 'cm2', label: 'MEI', x: 50, y: 46 }, { id: 'cm3', label: 'MEI', x: 32, y: 50 },
    { id: 'lb',  label: 'LAT', x: 14, y: 52 }, { id: 'st1', label: 'ATA', x: 64, y: 22 },
    { id: 'st2', label: 'ATA', x: 36, y: 22 },
  ],
  '4-2-3-1': [
    { id: 'gk',  label: 'GOL', x: 50, y: 88 }, { id: 'rb',  label: 'LAT', x: 82, y: 70 },
    { id: 'cb1', label: 'ZAG', x: 62, y: 70 }, { id: 'cb2', label: 'ZAG', x: 38, y: 70 },
    { id: 'lb',  label: 'LAT', x: 18, y: 70 }, { id: 'dm1', label: 'MEI', x: 64, y: 57 },
    { id: 'dm2', label: 'MEI', x: 36, y: 57 }, { id: 'rm',  label: 'MEI', x: 76, y: 38 },
    { id: 'am',  label: 'MEI', x: 50, y: 36 }, { id: 'lm',  label: 'MEI', x: 24, y: 38 },
    { id: 'st',  label: 'ATA', x: 50, y: 18 },
  ],
};

type Player = typeof PLAYERS[0];
type Lineup = Record<string, Player | null>;
type Jogo = { competicao: string; data_hora: string; mandante: { nome: string; escudo_url: string }; visitante: { nome: string; escudo_url: string } };

function SpritePhoto({ foto, size }: { foto: string; size: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ width: size, height: size, borderRadius: '50%', backgroundImage: `url(${foto})`, backgroundSize: '200% 100%', backgroundPosition: hovered ? 'right top' : 'left top', backgroundRepeat: 'no-repeat', transition: 'background-position 0.25s ease', flexShrink: 0 }}
    />
  );
}

function FieldSvg() {
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 68 105" preserveAspectRatio="none">
      {[0,1,2,3,4,5,6].map(i => <rect key={i} x="0" y={i*15} width="68" height="7.5" fill={i%2===0?'rgba(255,255,255,0.04)':'transparent'} />)}
      <rect x="2" y="3" width="64" height="99" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.6" />
      <line x1="2" y1="52.5" x2="66" y2="52.5" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
      <circle cx="34" cy="52.5" r="9.15" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
      <circle cx="34" cy="52.5" r="0.6" fill="rgba(255,255,255,0.5)" />
      <rect x="13.84" y="3" width="40.32" height="18.32" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
      <rect x="24.84" y="3" width="18.32" height="5.5" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.4" />
      <rect x="29.34" y="1.5" width="9.32" height="2" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.4" />
      <rect x="13.84" y="83.68" width="40.32" height="18.32" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
      <rect x="24.84" y="96.5" width="18.32" height="5.5" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.4" />
      <rect x="29.34" y="101.5" width="9.32" height="2" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.4" />
      <circle cx="34" cy="14" r="0.6" fill="rgba(255,255,255,0.4)" />
      <circle cx="34" cy="91" r="0.6" fill="rgba(255,255,255,0.4)" />
    </svg>
  );
}

// ─── Lead Modal ──────────────────────────────────────────────────────────────
function LeadModal({ onConfirm, onClose }: { onConfirm: () => void; onClose: () => void }) {
  const [nome, setNome] = useState('');
  const [whats, setWhats] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const handleSubmit = async () => {
    if (!nome.trim() || whats.replace(/\D/g,'').length < 10) {
      setErro('Preencha nome e WhatsApp válido para continuar.');
      return;
    }
    setLoading(true);
    try {
      await fetch('https://whoglnpvqjbaczgnebbn.supabase.co/rest/v1/leads_escalacao', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''}`,
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({ nome: nome.trim(), whatsapp: whats.replace(/\D/g,''), origem: 'escalacao', criado_em: new Date().toISOString() }),
      });
    } catch (e) { console.error(e); }
    setLoading(false);
    onConfirm();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ width: '100%', maxWidth: 480, background: '#111', borderRadius: '20px 20px 0 0', padding: '28px 20px 36px', borderTop: '3px solid #F5C400' }} onClick={e => e.stopPropagation()}>
        <div style={{ width: 36, height: 4, background: '#333', borderRadius: 2, margin: '0 auto 20px' }} />
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">📸</span>
          <h2 className="text-white font-black uppercase italic text-xl tracking-tighter">Quase lá, Tigre!</h2>
        </div>
        <p className="text-zinc-400 text-sm mb-6 leading-relaxed">Deixa seu nome e WhatsApp para baixar o story. Você receberá novidades do Tigre em primeira mão!</p>
        <div className="flex flex-col gap-3 mb-4">
          <input type="text" name="name" autoComplete="name" placeholder="Seu nome" value={nome} onChange={e => setNome(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white text-sm font-medium placeholder-zinc-600 focus:outline-none focus:border-yellow-500 transition-colors" />
          <input type="tel" name="tel" autoComplete="tel" placeholder="WhatsApp (DDD + número)" value={whats} onChange={e => setWhats(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white text-sm font-medium placeholder-zinc-600 focus:outline-none focus:border-yellow-500 transition-colors" />
          {erro && <p className="text-red-400 text-xs font-bold">{erro}</p>}
        </div>
        <p className="text-zinc-600 text-[9px] uppercase tracking-widest mb-4 text-center">Seus dados são usados apenas pelo Portal O Novorizontino.</p>
        <button onClick={handleSubmit} disabled={loading} data-track="escalacao_lead_submit" className="w-full py-4 bg-yellow-500 text-black font-black uppercase tracking-widest text-sm rounded-lg active:opacity-80 transition-all">
          {loading ? 'Salvando...' : 'Baixar meu Story'}
        </button>
      </div>
    </div>
  );
}

// ─── Story Card 9:16 ─────────────────────────────────────────────────────────
function StoryCard({ lineup, slots, formation, jogo, palpite }: {
  lineup: Lineup;
  slots: { id: string; label: string; x: number; y: number }[];
  formation: string;
  jogo: Jogo | null;
  palpite: { mandante: number; visitante: number };
}) {
  const CW = 540; const CH = 960;
  const FW = 500; const FH = 520;
  const FX = (CW - FW) / 2;
  const FY = 265;

  const formatHorario = (iso: string) => {
    const d = new Date(iso);
    return `${String(d.getHours()).padStart(2,'0')}h${String(d.getMinutes()).padStart(2,'0') === '00' ? '' : String(d.getMinutes()).padStart(2,'0')}`;
  };
  const formatData = (iso: string) => {
    const d = new Date(iso);
    const dias = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
    return `${dias[d.getDay()]}, ${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}`;
  };

  return (
    <div style={{ width: CW, height: CH, background: '#080808', position: 'relative', overflow: 'hidden', fontFamily: 'Impact, Arial Black, sans-serif' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg,#1a1200,#080808 50%,#001a00)', opacity: 0.8 }} />
      <div style={{ position: 'absolute', top: 0, left: 18, width: 4, height: '100%', background: '#F5C400', opacity: 0.6 }} />
      <div style={{ position: 'absolute', top: 0, right: 18, width: 4, height: '100%', background: '#F5C400', opacity: 0.6 }} />

      {/* Header */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: FY, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', paddingTop: 24, gap: 0, zIndex: 20 }}>

        {/* Logo */}
        <img src={LOGO} alt="O Novorizontino" style={{ height: 36, objectFit: 'contain', marginBottom: 14 }} />

        {/* Escudos confrontando */}
        {jogo && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, width: '100%', padding: '0 50px', marginBottom: 10 }}>
            {/* Mandante */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, flex: 1 }}>
              <img src={jogo.mandante.escudo_url} alt={jogo.mandante.nome}
                style={{ width: 72, height: 72, objectFit: 'contain', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.8))' }} />
              <span style={{ fontSize: 10, color: '#aaa', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{jogo.mandante.nome}</span>
            </div>

            {/* Centro — horário + palpite */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1 }}>
              <span style={{ fontSize: 11, color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{formatData(jogo.data_hora)}</span>
              <span style={{ fontSize: 14, fontWeight: 900, color: '#F5C400', letterSpacing: '0.05em' }}>{formatHorario(jogo.data_hora)}</span>
              {/* Palpite */}
              <div style={{ background: 'rgba(245,196,0,0.12)', border: '1.5px solid #F5C400', borderRadius: 8, padding: '6px 16px', marginTop: 2 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 11, color: '#aaa', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>PALPITE</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 2 }}>
                  <span style={{ fontSize: 32, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{palpite.mandante}</span>
                  <span style={{ fontSize: 18, fontWeight: 900, color: '#F5C400' }}>×</span>
                  <span style={{ fontSize: 32, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{palpite.visitante}</span>
                </div>
              </div>
            </div>

            {/* Visitante */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, flex: 1 }}>
              <img src={jogo.visitante.escudo_url} alt={jogo.visitante.nome}
                style={{ width: 72, height: 72, objectFit: 'contain', filter: 'drop-shadow(0 4px 12px rgba(245,196,0,0.25))' }} />
              <span style={{ fontSize: 10, color: '#F5C400', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{jogo.visitante.nome}</span>
            </div>
          </div>
        )}

        {/* Título + formação */}
        <span style={{ fontSize: 28, fontWeight: 900, color: '#fff', fontStyle: 'italic', textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 1, marginTop: jogo ? 0 : 16 }}>MINHA ESCALAÇÃO</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
          <div style={{ height: 2, width: 24, background: '#F5C400' }} />
          <span style={{ fontSize: 12, fontWeight: 900, color: '#F5C400', fontStyle: 'italic', textTransform: 'uppercase' }}>{formation}</span>
          <div style={{ height: 2, width: 24, background: '#F5C400' }} />
        </div>
      </div>

      {/* Campo */}
      <div style={{ position: 'absolute', left: FX, top: FY, width: FW, height: FH, borderRadius: 8, overflow: 'hidden', background: '#2d8a2d', zIndex: 10, boxShadow: '0 0 40px rgba(0,0,0,0.8)' }}>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 68 105" preserveAspectRatio="none">
          {[0,1,2,3,4,5,6].map(i => <rect key={i} x="0" y={i*15} width="68" height="7.5" fill={i%2===0?'rgba(255,255,255,0.06)':'transparent'} />)}
          <rect x="1.5" y="2" width="65" height="101" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8" />
          <line x1="1.5" y1="52.5" x2="66.5" y2="52.5" stroke="rgba(255,255,255,0.5)" strokeWidth="0.7" />
          <circle cx="34" cy="52.5" r="9.15" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.7" />
          <rect x="13.84" y="2" width="40.32" height="18.32" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="0.6" />
          <rect x="24.84" y="2" width="18.32" height="6" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="0.5" />
          <rect x="13.84" y="84.68" width="40.32" height="18.32" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="0.6" />
          <rect x="24.84" y="97" width="18.32" height="6" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="0.5" />
        </svg>
        {slots.map(slot => {
          const player = lineup[slot.id];
          if (!player) return null;
          const PS = 42;
          return (
            <div key={slot.id} style={{ position: 'absolute', left: (slot.x/100)*FW, top: (slot.y/100)*FH, transform: 'translate(-50%,-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, zIndex: 10 }}>
              <div style={{ width: PS, height: PS, borderRadius: '50%', border: '2.5px solid #F5C400', backgroundImage: `url(${player.foto})`, backgroundSize: '200% 100%', backgroundPosition: 'left top', backgroundRepeat: 'no-repeat', boxShadow: '0 3px 12px rgba(0,0,0,0.9)', position: 'relative', flexShrink: 0 }}>
                <div style={{ position: 'absolute', bottom: -2, right: -4, width: 16, height: 16, borderRadius: '50%', background: '#F5C400', border: '1.5px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: '#000', fontSize: 6, fontWeight: 900 }}>{player.num}</span>
                </div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.75)', borderRadius: 3, padding: '2px 6px' }}>
                <span style={{ fontSize: 15, fontWeight: 900, color: '#fff', textTransform: 'uppercase', whiteSpace: 'nowrap', display: 'block', maxWidth: 70, overflow: 'hidden', textOverflow: 'ellipsis' }}>{player.short}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: CH - FY - FH, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 7, zIndex: 20 }}>
        <div style={{ height: 2, width: '75%', background: 'linear-gradient(90deg,transparent,#F5C400,transparent)' }} />
        <span style={{ fontSize: 28, fontWeight: 900, color: '#fff', fontStyle: 'italic', textTransform: 'uppercase' }}>QUAL É A SUA?</span>
        <span style={{ fontSize: 11, color: '#F5C400', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'center' }}>#tigredovale #novorizontino #serieb2026</span>
        <span style={{ fontSize: 12, color: '#888', textTransform: 'uppercase', letterSpacing: '0.12em', fontStyle: 'italic', fontWeight: 900 }}>onovorizontino.com.br</span>
      </div>
    </div>
  );
}

  const formatHorario = (iso: string) => {
    const d = new Date(iso);
    return `${String(d.getHours()).padStart(2,'0')}h${String(d.getMinutes()).padStart(2,'0') === '00' ? '' : String(d.getMinutes()).padStart(2,'0')}`;
  };
  const formatData = (iso: string) => {
    const d = new Date(iso);
    const dias = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
    return `${dias[d.getDay()]}, ${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}`;
  };

  return (
    <div style={{ width: CW, height: CH, background: '#080808', position: 'relative', overflow: 'hidden', fontFamily: 'Impact, Arial Black, sans-serif' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg,#1a1200,#080808 50%,#001a00)', opacity: 0.8 }} />
      <div style={{ position: 'absolute', top: 0, left: 18, width: 4, height: '100%', background: '#F5C400', opacity: 0.6 }} />
      <div style={{ position: 'absolute', top: 0, right: 18, width: 4, height: '100%', background: '#F5C400', opacity: 0.6 }} />

      {/* Header */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: FY, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, zIndex: 20, padding: '0 40px' }}>
        <img src={LOGO} alt="O Novorizontino" style={{ height: 38, objectFit: 'contain' }} />
        {jogo && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, width: '100%', justifyContent: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
              <img src={jogo.mandante.escudo_url} alt={jogo.mandante.nome} style={{ width: 42, height: 42, objectFit: 'contain' }} />
              <span style={{ fontSize: 8, color: '#aaa', fontWeight: 900, textTransform: 'uppercase' }}>{jogo.mandante.nome}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <span style={{ fontSize: 20, fontWeight: 900, color: '#F5C400' }}>{formatHorario(jogo.data_hora)}</span>
              <span style={{ fontSize: 8, color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{formatData(jogo.data_hora)} • {jogo.competicao}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
              <img src={jogo.visitante.escudo_url} alt={jogo.visitante.nome} style={{ width: 42, height: 42, objectFit: 'contain' }} />
              <span style={{ fontSize: 8, color: '#F5C400', fontWeight: 900, textTransform: 'uppercase' }}>{jogo.visitante.nome}</span>
            </div>
          </div>
        )}
        <span style={{ fontSize: 30, fontWeight: 900, color: '#fff', fontStyle: 'italic', textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 1 }}>MINHA ESCALAÇÃO</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ height: 2, width: 24, background: '#F5C400' }} />
          <span style={{ fontSize: 12, fontWeight: 900, color: '#F5C400', fontStyle: 'italic', textTransform: 'uppercase' }}>{formation}</span>
          <div style={{ height: 2, width: 24, background: '#F5C400' }} />
        </div>
      </div>

      {/* Campo */}
      <div style={{ position: 'absolute', left: FX, top: FY, width: FW, height: FH, borderRadius: 8, overflow: 'hidden', background: '#2d8a2d', zIndex: 10, boxShadow: '0 0 40px rgba(0,0,0,0.8)' }}>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 68 105" preserveAspectRatio="none">
          {[0,1,2,3,4,5,6].map(i => <rect key={i} x="0" y={i*15} width="68" height="7.5" fill={i%2===0?'rgba(255,255,255,0.06)':'transparent'} />)}
          <rect x="1.5" y="2" width="65" height="101" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8" />
          <line x1="1.5" y1="52.5" x2="66.5" y2="52.5" stroke="rgba(255,255,255,0.5)" strokeWidth="0.7" />
          <circle cx="34" cy="52.5" r="9.15" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.7" />
          <rect x="13.84" y="2" width="40.32" height="18.32" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="0.6" />
          <rect x="24.84" y="2" width="18.32" height="6" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="0.5" />
          <rect x="13.84" y="84.68" width="40.32" height="18.32" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="0.6" />
          <rect x="24.84" y="97" width="18.32" height="6" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="0.5" />
        </svg>
        {slots.map(slot => {
          const player = lineup[slot.id];
          if (!player) return null;
          const PS = 46;
          return (
            <div key={slot.id} style={{ position: 'absolute', left: (slot.x/100)*FW, top: (slot.y/100)*FH, transform: 'translate(-50%,-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, zIndex: 10 }}>
              <div style={{ width: PS, height: PS, borderRadius: '50%', border: '2.5px solid #F5C400', backgroundImage: `url(${player.foto})`, backgroundSize: '200% 100%', backgroundPosition: 'left top', backgroundRepeat: 'no-repeat', boxShadow: '0 3px 12px rgba(0,0,0,0.9)', position: 'relative', flexShrink: 0 }}>
                <div style={{ position: 'absolute', bottom: -2, right: -4, width: 17, height: 17, borderRadius: '50%', background: '#F5C400', border: '1.5px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: '#000', fontSize: 6, fontWeight: 900 }}>{player.num}</span>
                </div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.75)', borderRadius: 3, padding: '2px 4px' }}>
                <span style={{ fontSize: 8, fontWeight: 900, color: '#fff', textTransform: 'uppercase', whiteSpace: 'nowrap', display: 'block', maxWidth: 52, overflow: 'hidden', textOverflow: 'ellipsis' }}>{player.short}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: CH - FY - FH, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, zIndex: 20 }}>
        <div style={{ height: 2, width: '75%', background: 'linear-gradient(90deg,transparent,#F5C400,transparent)' }} />
        <span style={{ fontSize: 30, fontWeight: 900, color: '#fff', fontStyle: 'italic', textTransform: 'uppercase' }}>QUAL É A SUA?</span>
        <span style={{ fontSize: 11, color: '#F5C400', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'center' }}>#tigredovale #novorizontino #serieb2026</span>
        <span style={{ fontSize: 10, color: '#444', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'Arial, sans-serif' }}>onovorizontino.com.br</span>
      </div>
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function EscalacaoIdeal() {
  const [formation, setFormation] = useState('4-3-3');
  const [lineup, setLineup] = useState<Lineup>({});
  const [selected, setSelected] = useState<{ player: Player; from: string } | null>(null);
  const [dragging, setDragging] = useState<{ player: Player; from: string } | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [filterPos, setFilterPos] = useState('TODOS');
  const [generating, setGenerating] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [fieldWidth, setFieldWidth] = useState(340);
  const [jogoAtual, setJogoAtual] = useState<Jogo | null>(null);
  const [palpite, setPalpite] = useState({ mandante: 0, visitante: 1 });
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => setFieldWidth(Math.min(window.innerWidth - 32, 420));
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const fieldHeight = Math.round(fieldWidth * (105 / 68));
  const slotSize = Math.max(32, Math.round(fieldWidth * 0.115));
  const labelSize = Math.max(6, Math.round(fieldWidth * 0.022));
  const slots = FORMATIONS[formation];
  const usedIds = Object.values(lineup).filter(Boolean).map(p => p!.id);
  const filledCount = Object.values(lineup).filter(Boolean).length;
  const filteredPlayers = PLAYERS.filter(p => (filterPos === 'TODOS' || p.pos === filterPos) && !usedIds.includes(p.id));

  const placePlayer = (slotId: string, player: Player, from: string) => {
    setLineup(prev => {
      const next = { ...prev };
      if (from !== 'bench') next[from] = next[slotId] ?? null;
      next[slotId] = player;
      return next;
    });
  };

  const handleTapSlot = (slotId: string) => {
    if (selected) { placePlayer(slotId, selected.player, selected.from); setSelected(null); }
    else { const p = lineup[slotId]; if (p) setSelected({ player: p, from: slotId }); }
  };

  const handleDropOnSlot = (slotId: string) => {
    if (!dragging) return;
    placePlayer(slotId, dragging.player, dragging.from);
    setDragging(null); setDragOver(null);
  };

  const handleDropOnBench = () => {
    if (dragging && dragging.from !== 'bench') setLineup(prev => ({ ...prev, [dragging.from]: null }));
    setDragging(null); setDragOver(null);
  };

  const handleGenerate = () => { if (filledCount < 11) return; setShowLeadModal(true); };

  const doGenerate = async () => {
    setShowLeadModal(false); setGenerating(true); setShowCard(true);
    await new Promise(r => setTimeout(r, 600));
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(cardRef.current!, { scale: 2, useCORS: true, allowTaint: true, backgroundColor: '#080808', logging: false });
      const link = document.createElement('a');
      link.download = 'escalacao-tigre-novorizontino.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (e) { console.error(e); }
    setGenerating(false); setShowCard(false);
  };

  return (
    <main className="min-h-screen bg-black text-white" style={{ paddingBottom: 90 }}>
      <div className="max-w-lg mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <a href="/" className="flex items-center justify-center w-8 h-8 border border-zinc-700 rounded hover:border-yellow-500 transition-colors flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </a>
          <div className="w-1 h-7 bg-yellow-500" />
          <h1 className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter">
            Monte sua <span className="text-yellow-500">Escalação</span>
          </h1>
        </div>

        {/* Próximo duelo — dinâmico via Supabase */}
        <ProximoDuelo onJogoSelect={setJogoAtual} />

        {/* Instrução */}
        <p className="text-zinc-500 text-xs mb-3">
          {selected ? `✅ ${selected.player.name} selecionado — toque na posição no campo` : 'Toque em um jogador, depois toque na posição no campo.'}
        </p>

        {/* Formações */}
        <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar">
          {Object.keys(FORMATIONS).map(f => (
            <button key={f} onClick={() => { setFormation(f); setLineup({}); setSelected(null); }}
              data-track="escalacao_formacao"
              data-track-label={f}
              className={`flex-shrink-0 px-3 py-1.5 text-xs font-black uppercase tracking-widest transition-all ${formation === f ? 'bg-yellow-500 text-black' : 'border border-zinc-700 text-zinc-400'}`}>{f}</button>
          ))}
          <button onClick={() => { setLineup({}); setSelected(null); }}
            className="flex-shrink-0 px-3 py-1.5 text-xs font-black uppercase tracking-widest border border-zinc-800 text-zinc-600 ml-auto">Limpar</button>
        </div>

        {/* Progresso */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-1.5 bg-zinc-800 rounded overflow-hidden">
            <div style={{ width: `${(filledCount/11)*100}%`, background: filledCount===11?'#4ade80':'#F5C400', height: '100%', transition: 'width 0.3s', borderRadius: 4 }} />
          </div>
          <span className={`text-xs font-black ${filledCount===11?'text-green-400':'text-zinc-400'}`}>{filledCount}/11</span>
        </div>

        {/* Campo */}
        <div style={{ position: 'relative', width: fieldWidth, height: fieldHeight, margin: '0 auto' }} onDragOver={e => e.preventDefault()} onDrop={handleDropOnBench}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: 8, overflow: 'hidden', background: '#2a7a2a' }}>
            <FieldSvg />
          </div>
          {slots.map(slot => {
            const player = lineup[slot.id];
            const isOver = dragOver === slot.id;
            const isSelFrom = selected?.from === slot.id;
            return (
              <div key={slot.id} style={{ position: 'absolute', left: (slot.x/100)*fieldWidth, top: (slot.y/100)*fieldHeight, transform: 'translate(-50%,-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, zIndex: 10, cursor: 'pointer' }}
                draggable={!!player}
                onDragStart={() => player && setDragging({ player, from: slot.id })}
                onDragOver={e => { e.preventDefault(); e.stopPropagation(); setDragOver(slot.id); }}
                onDragLeave={() => setDragOver(null)}
                onDrop={e => { e.stopPropagation(); handleDropOnSlot(slot.id); }}
                onDoubleClick={() => player && setLineup(prev => ({ ...prev, [slot.id]: null }))}
                onClick={() => handleTapSlot(slot.id)}
              >
                <div style={{ width: slotSize, height: slotSize, borderRadius: '50%', overflow: 'hidden', position: 'relative', border: isSelFrom ? '2.5px solid #fff' : player ? '2.5px solid #F5C400' : selected ? '2px dashed #F5C400' : isOver ? '2px dashed #F5C400' : '2px dashed rgba(255,255,255,0.35)', background: player ? 'transparent' : selected ? 'rgba(245,196,0,0.15)' : 'rgba(0,0,0,0.4)', boxShadow: player ? '0 2px 8px rgba(0,0,0,0.7)' : 'none', transition: 'border 0.15s', flexShrink: 0 }}>
                  {player ? <SpritePhoto foto={player.foto} size={slotSize} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ color: selected ? '#F5C400' : 'rgba(255,255,255,0.35)', fontSize: slotSize*0.4, fontWeight: 900 }}>+</span></div>}
                  {player && <div style={{ position: 'absolute', bottom: -1, right: -1, width: 14, height: 14, borderRadius: '50%', background: '#000', border: '1px solid #F5C400', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}><span style={{ color: '#F5C400', fontSize: 5, fontWeight: 900 }}>{player.num}</span></div>}
                </div>
                <span style={{ fontSize: labelSize, fontWeight: 900, color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,1)', textTransform: 'uppercase', whiteSpace: 'nowrap', maxWidth: slotSize+10, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {player ? player.short : slot.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Banco */}
        <div className="mt-5">
          <div className="flex gap-1.5 mb-3 overflow-x-auto no-scrollbar">
            {['TODOS','GOL','LAT','ZAG','MEI','ATA'].map(p => (
              <button key={p} onClick={() => setFilterPos(p)}
                className={`flex-shrink-0 px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded transition-all ${filterPos===p?'bg-yellow-500 text-black':'border border-zinc-800 text-zinc-500'}`}>{p}</button>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6 }}>
            {filteredPlayers.map(player => {
              const isSel = selected?.player.id === player.id;
              return (
                <div key={player.id} draggable onDragStart={() => setDragging({ player, from: 'bench' })} onClick={() => setSelected(isSel ? null : { player, from: 'bench' })}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '8px 4px', border: isSel ? '1.5px solid #F5C400' : '0.5px solid #3f3f46', background: isSel ? 'rgba(245,196,0,0.1)' : 'rgba(24,24,27,0.5)', cursor: 'pointer', borderRadius: 6, transition: 'all 0.15s', userSelect: 'none' }}>
                  <div style={{ width: 46, height: 46, borderRadius: '50%', overflow: 'hidden', border: isSel?'2px solid #F5C400':'1px solid #3f3f46', flexShrink: 0, position: 'relative' }}>
                    <SpritePhoto foto={player.foto} size={46} />
                    <div style={{ position: 'absolute', bottom: -1, right: -1, width: 16, height: 16, borderRadius: '50%', background: '#F5C400', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: '#000', fontSize: 7, fontWeight: 900 }}>{player.num}</span>
                    </div>
                  </div>
                  <p style={{ color: isSel?'#F5C400':'#fff', fontSize: 9, fontWeight: 900, textTransform: 'uppercase', textAlign: 'center', margin: 0, lineHeight: 1.2, maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{player.short}</p>
                  <span style={{ fontSize: 8, color: '#52525b', fontWeight: 900, textTransform: 'uppercase' }}>{player.pos}</span>
                </div>
              );
            })}
            {filteredPlayers.length === 0 && (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2rem', color: '#52525b' }}>
                <p style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase' }}>Todos escalados!</p>
              </div>
            )}
          </div>
        </div>

        {/* Picker de palpite */}
        {jogoAtual && (
          <div className="mt-5 rounded-xl border border-zinc-800 overflow-hidden" style={{ background: 'linear-gradient(135deg,#0f0f0f,#1a1200)' }}>
            <div className="flex items-center gap-2 px-4 pt-3 pb-2">
              <span className="text-base">🎯</span>
              <span className="text-white font-black uppercase text-xs tracking-widest">Meu Palpite</span>
              <span className="text-zinc-600 text-[9px] uppercase tracking-widest ml-auto">Aparece no story</span>
            </div>
            <div className="flex items-center justify-between px-4 pb-4 gap-3">
              {/* Mandante */}
              <div className="flex flex-col items-center gap-2 flex-1">
                <img src={jogoAtual.mandante.escudo_url} alt={jogoAtual.mandante.nome} className="w-10 h-10 object-contain" />
                <span className="text-white text-[10px] font-black uppercase text-center leading-tight">{jogoAtual.mandante.nome}</span>
                <div className="flex items-center gap-3">
                  <button onClick={() => setPalpite(p => ({ ...p, mandante: Math.max(0, p.mandante - 1) }))}
                    className="w-9 h-9 rounded-full border border-zinc-700 text-white font-black text-lg flex items-center justify-center active:bg-zinc-800 transition-colors">−</button>
                  <span className="text-yellow-500 font-black text-3xl w-8 text-center">{palpite.mandante}</span>
                  <button onClick={() => setPalpite(p => ({ ...p, mandante: Math.min(9, p.mandante + 1) }))}
                    className="w-9 h-9 rounded-full border border-zinc-700 text-white font-black text-lg flex items-center justify-center active:bg-zinc-800 transition-colors">+</button>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center pb-2">
                <span className="text-zinc-600 font-black text-2xl">×</span>
              </div>
              {/* Visitante */}
              <div className="flex flex-col items-center gap-2 flex-1">
                <img src={jogoAtual.visitante.escudo_url} alt={jogoAtual.visitante.nome} className="w-10 h-10 object-contain" />
                <span className="text-yellow-500 text-[10px] font-black uppercase text-center leading-tight">{jogoAtual.visitante.nome}</span>
                <div className="flex items-center gap-3">
                  <button onClick={() => setPalpite(p => ({ ...p, visitante: Math.max(0, p.visitante - 1) }))}
                    className="w-9 h-9 rounded-full border border-zinc-700 text-white font-black text-lg flex items-center justify-center active:bg-zinc-800 transition-colors">−</button>
                  <span className="text-yellow-500 font-black text-3xl w-8 text-center">{palpite.visitante}</span>
                  <button onClick={() => setPalpite(p => ({ ...p, visitante: Math.min(9, p.visitante + 1) }))}
                    className="w-9 h-9 rounded-full border border-zinc-700 text-white font-black text-lg flex items-center justify-center active:bg-zinc-800 transition-colors">+</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Botão fixo rodapé */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50, background: '#000', borderTop: '1px solid #27272a', padding: '10px 16px 16px' }}>
        <button onClick={handleGenerate} disabled={filledCount < 11 || generating}
          data-track="escalacao_baixar_story"
          data-track-label={`Formação ${formation} - ${filledCount}/11`}
          className={`w-full py-4 text-sm font-black uppercase tracking-widest transition-all rounded ${filledCount===11?'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20 active:opacity-80':'bg-zinc-900 text-zinc-600 cursor-not-allowed border border-zinc-800'}`}>
          {generating ? 'Gerando story...' : filledCount===11 ? 'Baixar Story para o Instagram' : `Faltam ${11-filledCount} jogador${11-filledCount>1?'es':''}  •  ${filledCount}/11`}
        </button>
        {filledCount===11 && <p className="text-yellow-500 text-[9px] text-center uppercase tracking-widest mt-1.5">Salva e posta nos stories com #tigredovale!</p>}
      </div>

      {/* Modal lead */}
      {showLeadModal && <LeadModal onConfirm={doGenerate} onClose={() => setShowLeadModal(false)} />}

      {/* Card oculto */}
      {showCard && (
        <div style={{ position: 'fixed', top: -9999, left: -9999, zIndex: -1 }}>
          <div ref={cardRef}>
            <StoryCard lineup={lineup} slots={slots} formation={formation} jogo={jogoAtual} palpite={palpite} />
          </div>
        </div>
      )}
    </main>
  );
}
