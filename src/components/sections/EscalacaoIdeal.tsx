'use client';
import { useState, useRef, useEffect } from 'react';

const BASE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';

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
    { id: 'gk', label: 'GOL', x: 50, y: 88 },
    { id: 'rb', label: 'LAT', x: 82, y: 70 },
    { id: 'cb1', label: 'ZAG', x: 62, y: 70 },
    { id: 'cb2', label: 'ZAG', x: 38, y: 70 },
    { id: 'lb', label: 'LAT', x: 18, y: 70 },
    { id: 'cm1', label: 'MEI', x: 72, y: 50 },
    { id: 'cm2', label: 'MEI', x: 50, y: 46 },
    { id: 'cm3', label: 'MEI', x: 28, y: 50 },
    { id: 'rw', label: 'ATA', x: 76, y: 24 },
    { id: 'st', label: 'ATA', x: 50, y: 18 },
    { id: 'lw', label: 'ATA', x: 24, y: 24 },
  ],
  '4-4-2': [
    { id: 'gk', label: 'GOL', x: 50, y: 88 },
    { id: 'rb', label: 'LAT', x: 82, y: 70 },
    { id: 'cb1', label: 'ZAG', x: 62, y: 70 },
    { id: 'cb2', label: 'ZAG', x: 38, y: 70 },
    { id: 'lb', label: 'LAT', x: 18, y: 70 },
    { id: 'rm', label: 'MEI', x: 80, y: 50 },
    { id: 'cm1', label: 'MEI', x: 60, y: 50 },
    { id: 'cm2', label: 'MEI', x: 40, y: 50 },
    { id: 'lm', label: 'MEI', x: 20, y: 50 },
    { id: 'st1', label: 'ATA', x: 64, y: 22 },
    { id: 'st2', label: 'ATA', x: 36, y: 22 },
  ],
  '3-5-2': [
    { id: 'gk', label: 'GOL', x: 50, y: 88 },
    { id: 'cb1', label: 'ZAG', x: 70, y: 72 },
    { id: 'cb2', label: 'ZAG', x: 50, y: 75 },
    { id: 'cb3', label: 'ZAG', x: 30, y: 72 },
    { id: 'rb', label: 'LAT', x: 86, y: 52 },
    { id: 'cm1', label: 'MEI', x: 68, y: 50 },
    { id: 'cm2', label: 'MEI', x: 50, y: 46 },
    { id: 'cm3', label: 'MEI', x: 32, y: 50 },
    { id: 'lb', label: 'LAT', x: 14, y: 52 },
    { id: 'st1', label: 'ATA', x: 64, y: 22 },
    { id: 'st2', label: 'ATA', x: 36, y: 22 },
  ],
  '4-2-3-1': [
    { id: 'gk', label: 'GOL', x: 50, y: 88 },
    { id: 'rb', label: 'LAT', x: 82, y: 70 },
    { id: 'cb1', label: 'ZAG', x: 62, y: 70 },
    { id: 'cb2', label: 'ZAG', x: 38, y: 70 },
    { id: 'lb', label: 'LAT', x: 18, y: 70 },
    { id: 'dm1', label: 'MEI', x: 64, y: 57 },
    { id: 'dm2', label: 'MEI', x: 36, y: 57 },
    { id: 'rm', label: 'MEI', x: 76, y: 38 },
    { id: 'am', label: 'MEI', x: 50, y: 36 },
    { id: 'lm', label: 'MEI', x: 24, y: 38 },
    { id: 'st', label: 'ATA', x: 50, y: 18 },
  ],
};

type Player = typeof PLAYERS[0];
type Lineup = Record<string, Player | null>;

function SpritePhoto({ foto, size }: { foto: string; size: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: size, height: size, borderRadius: '50%',
        backgroundImage: `url(${foto})`,
        backgroundSize: '200% 100%',
        backgroundPosition: hovered ? 'right top' : 'left top',
        backgroundRepeat: 'no-repeat',
        transition: 'background-position 0.25s ease',
        flexShrink: 0,
      }}
    />
  );
}

// Card Instagram Story — proporcao 9:16
function StoryCard({ lineup, slots, formation }: { lineup: Lineup; slots: typeof FORMATIONS['4-3-3']; formation: string }) {
  // 9:16 story — campo ocupa 70% da altura
  const CARD_W = 540;
  const CARD_H = 960;
  const FIELD_W = 500;
  const FIELD_H = 670;
  const FIELD_X = (CARD_W - FIELD_W) / 2;
  const FIELD_Y = 140;

  return (
    <div style={{ width: CARD_W, height: CARD_H, background: '#080808', position: 'relative', overflow: 'hidden', fontFamily: 'Impact, Arial Black, sans-serif' }}>

      {/* Gradiente de fundo diagonal */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, #1a1200 0%, #080808 50%, #001a00 100%)', opacity: 0.8 }} />

      {/* Linha decorativa esquerda */}
      <div style={{ position: 'absolute', top: 0, left: 18, width: 4, height: '100%', background: '#F5C400', opacity: 0.6 }} />
      <div style={{ position: 'absolute', top: 0, left: 26, width: 1, height: '100%', background: '#F5C400', opacity: 0.2 }} />

      {/* Linha decorativa direita */}
      <div style={{ position: 'absolute', top: 0, right: 18, width: 4, height: '100%', background: '#F5C400', opacity: 0.6 }} />
      <div style={{ position: 'absolute', top: 0, right: 26, width: 1, height: '100%', background: '#F5C400', opacity: 0.2 }} />

      {/* Topo — header compacto */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 130, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, zIndex: 20 }}>
        <img
          src="https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/LOGO%20-%20O%20NOVORIZONTINO%20(1).png"
          alt="O Novorizontino"
          style={{ height: 44, objectFit: 'contain', marginBottom: 2 }}
        />
        <span style={{ fontSize: 38, fontWeight: 900, color: '#fff', fontStyle: 'italic', textTransform: 'uppercase', letterSpacing: '-0.03em', lineHeight: 1 }}>MINHA ESCALAÇÃO</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 2 }}>
          <div style={{ height: 2, width: 30, background: '#F5C400' }} />
          <span style={{ fontSize: 14, fontWeight: 900, color: '#F5C400', fontStyle: 'italic', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{formation}</span>
          <div style={{ height: 2, width: 30, background: '#F5C400' }} />
        </div>
      </div>

      {/* Campo grande — full width quase */}
      <div style={{ position: 'absolute', left: FIELD_X, top: FIELD_Y, width: FIELD_W, height: FIELD_H, borderRadius: 8, overflow: 'hidden', background: '#2d8a2d', zIndex: 10, boxShadow: '0 0 40px rgba(0,0,0,0.8)' }}>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 68 105" preserveAspectRatio="none">
          {[0,1,2,3,4,5,6].map(i => <rect key={i} x="0" y={i*15} width="68" height="7.5" fill={i%2===0?'rgba(255,255,255,0.06)':'transparent'} />)}
          <rect x="1.5" y="2" width="65" height="101" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8" />
          <line x1="1.5" y1="52.5" x2="66.5" y2="52.5" stroke="rgba(255,255,255,0.5)" strokeWidth="0.7" />
          <circle cx="34" cy="52.5" r="9.15" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.7" />
          <circle cx="34" cy="52.5" r="0.8" fill="rgba(255,255,255,0.6)" />
          <rect x="13.84" y="2" width="40.32" height="18.32" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="0.6" />
          <rect x="24.84" y="2" width="18.32" height="6" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="0.5" />
          <rect x="30" y="0.5" width="8" height="2" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
          <rect x="13.84" y="84.68" width="40.32" height="18.32" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="0.6" />
          <rect x="24.84" y="97" width="18.32" height="6" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="0.5" />
          <rect x="30" y="102.5" width="8" height="2" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
          <circle cx="34" cy="13" r="0.8" fill="rgba(255,255,255,0.5)" />
          <circle cx="34" cy="92" r="0.8" fill="rgba(255,255,255,0.5)" />
        </svg>

        {slots.map(slot => {
          const player = lineup[slot.id];
          if (!player) return null;
          const pSize = 50;
          return (
            <div key={slot.id} style={{ position: 'absolute', left: (slot.x/100)*FIELD_W, top: (slot.y/100)*FIELD_H, transform: 'translate(-50%,-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, zIndex: 10 }}>
              {/* Sombra do círculo */}
              <div style={{ width: pSize + 4, height: pSize + 4, borderRadius: '50%', background: 'rgba(0,0,0,0.5)', position: 'absolute', top: -2, left: -2 }} />
              <div style={{
                width: pSize, height: pSize, borderRadius: '50%',
                border: '2.5px solid #F5C400',
                backgroundImage: `url(${player.foto})`,
                backgroundSize: '200% 100%',
                backgroundPosition: 'left top',
                backgroundRepeat: 'no-repeat',
                boxShadow: '0 3px 12px rgba(0,0,0,0.9)',
                position: 'relative', zIndex: 2,
              }} />
              {/* Badge número */}
              <div style={{ position: 'absolute', top: pSize - 10, right: -6, width: 18, height: 18, borderRadius: '50%', background: '#F5C400', border: '1.5px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3 }}>
                <span style={{ color: '#000', fontSize: 7, fontWeight: 900 }}>{player.num}</span>
              </div>
              {/* Nome com fundo */}
              <div style={{ background: 'rgba(0,0,0,0.75)', borderRadius: 3, padding: '2px 5px', position: 'relative', zIndex: 2 }}>
                <span style={{ fontSize: 9, fontWeight: 900, color: '#fff', textTransform: 'uppercase', whiteSpace: 'nowrap', maxWidth: 58, overflow: 'hidden', textOverflow: 'ellipsis', display: 'block', letterSpacing: '0.02em' }}>{player.short}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Faixa CTA inferior */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 148, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, zIndex: 20 }}>
        <div style={{ height: 2, width: '80%', background: 'linear-gradient(90deg, transparent, #F5C400, transparent)', marginBottom: 2 }} />
        <span style={{ fontSize: 30, fontWeight: 900, color: '#fff', fontStyle: 'italic', textTransform: 'uppercase', letterSpacing: '-0.01em', lineHeight: 1 }}>QUAL É A SUA?</span>
        <span style={{ fontSize: 11, color: '#F5C400', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em' }}>#tigredovale #novorizontino #serieb2026</span>
        {/* Botão viral — quem vê o story sabe exatamente onde ir */}
        <div style={{ background: '#F5C400', borderRadius: 4, padding: '6px 16px', marginTop: 2 }}>
          <span style={{ fontSize: 12, fontWeight: 900, color: '#000', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'Arial Black, sans-serif' }}>
            👉 onovorizontino.com.br/escalacao
          </span>
        </div>
      </div>
    </div>
  );
}

export default function EscalacaoIdeal() {
  const [formation, setFormation] = useState('4-3-3');
  const [lineup, setLineup] = useState<Lineup>({});
  const [dragging, setDragging] = useState<{ player: Player; from: string } | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [filterPos, setFilterPos] = useState('TODOS');
  const [generating, setGenerating] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [fieldWidth, setFieldWidth] = useState(340);
  const fieldRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Campo responsivo — mede largura disponível
  useEffect(() => {
    const update = () => {
      const w = Math.min(window.innerWidth - 32, 420);
      setFieldWidth(w);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const fieldHeight = Math.round(fieldWidth * (105 / 68));
  const slotSize = Math.max(32, Math.round(fieldWidth * 0.115));
  const fontSize = Math.max(6, Math.round(fieldWidth * 0.022));

  const slots = FORMATIONS[formation];
  const usedIds = Object.values(lineup).filter(Boolean).map(p => p!.id);
  const filledCount = Object.values(lineup).filter(Boolean).length;
  const filteredPlayers = PLAYERS.filter(p =>
    (filterPos === 'TODOS' || p.pos === filterPos) && !usedIds.includes(p.id)
  );

  const handleDropOnSlot = (slotId: string) => {
    if (!dragging) return;
    const newLineup = { ...lineup };
    const { player, from } = dragging;
    if (from !== 'bench') newLineup[from] = newLineup[slotId] || null;
    newLineup[slotId] = player;
    setLineup(newLineup);
    setDragging(null);
    setDragOver(null);
  };

  const handleDropOnBench = () => {
    if (dragging && dragging.from !== 'bench') setLineup(prev => ({ ...prev, [dragging.from]: null }));
    setDragging(null);
    setDragOver(null);
  };

  // Toque mobile — tap para selecionar e depois colocar no slot
  const [selected, setSelected] = useState<{ player: Player; from: string } | null>(null);

  const handleTapPlayer = (player: Player) => {
    setSelected({ player, from: 'bench' });
  };

  const handleTapSlot = (slotId: string) => {
    if (!selected) {
      // se o slot tem jogador, seleciona ele para mover
      const p = lineup[slotId];
      if (p) setSelected({ player: p, from: slotId });
      return;
    }
    handleDropOnSlot(slotId);
    // reutiliza lógica de drop
    const newLineup = { ...lineup };
    const { player, from } = selected;
    if (from !== 'bench') newLineup[from] = newLineup[slotId] || null;
    newLineup[slotId] = player;
    setLineup(newLineup);
    setSelected(null);
  };

  const handleGenerate = async () => {
    if (filledCount < 11) return;
    setGenerating(true);
    setShowCard(true);
    await new Promise(r => setTimeout(r, 600));
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(cardRef.current!, { scale: 2, useCORS: true, allowTaint: true, backgroundColor: '#0a0a0a', logging: false });
      const link = document.createElement('a');
      link.download = 'escalacao-tigre-novorizontino.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (e) { console.error(e); }
    setGenerating(false);
    setShowCard(false);
  };

  return (
    <main className="min-h-screen bg-black text-white pb-28">
      <div className="max-w-lg mx-auto px-4 py-8">

        {/* PRÓXIMO DUELO */}
        <div className="mb-5 rounded-lg overflow-hidden border border-yellow-500/30 bg-zinc-900/80">
          <div className="bg-yellow-500 px-4 py-1.5 flex items-center justify-between">
            <span className="text-black font-black text-[10px] uppercase tracking-[0.25em]">⚽ Próximo Duelo — Série B 2026</span>
            <span className="text-black font-black text-[10px] uppercase">Rd. 2</span>
          </div>
          <div className="flex items-center justify-between px-4 py-4">
            {/* Time da casa */}
            <div className="flex flex-col items-center gap-2 flex-1">
              <img
                src="https://upload.wikimedia.org/wikipedia/pt/thumb/4/42/Juventude.png/200px-Juventude.png"
                alt="Juventude"
                style={{ width: 48, height: 48, objectFit: 'contain', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}
              />
              <span className="text-white font-black text-xs uppercase">Juventude</span>
            </div>
            {/* Info */}
            <div className="flex flex-col items-center gap-1 px-2">
              <span className="text-yellow-500 font-black text-2xl italic">VS</span>
              <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider">31 Mar • 19h</span>
              <span className="text-zinc-600 text-[9px] uppercase tracking-wider">Alfredo Jaconi</span>
            </div>
            {/* Novorizontino */}
            <div className="flex flex-col items-center gap-2 flex-1">
              <img
                src="https://upload.wikimedia.org/wikipedia/pt/thumb/8/89/Gremio_Novorizontino_2010.png/200px-Gremio_Novorizontino_2010.png"
                alt="Novorizontino"
                style={{ width: 48, height: 48, objectFit: 'contain', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}
              />
              <span className="text-white font-black text-xs uppercase">Novorizontino</span>
            </div>
          </div>
          <div className="px-4 pb-3">
            <p className="text-yellow-500/70 text-[10px] font-bold uppercase tracking-widest text-center">
              Monte a escalação ideal para esse jogo! 🟡⚫
            </p>
          </div>
        </div>

        {/* PRÓXIMO DUELO */}
        <div style={{
          background: 'linear-gradient(135deg, #111 0%, #1a1200 100%)',
          border: '1px solid #F5C400',
          borderRadius: 10, padding: '14px 16px', marginBottom: 16,
        }}>
          <p style={{ fontSize: 9, color: '#F5C400', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', margin: '0 0 10px' }}>
            ⚡ Próximo Duelo — Série B 2026
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            {/* Novorizontino */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1 }}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Gr%C3%AAmio_Novorizontino_logo.svg/240px-Gr%C3%AAmio_Novorizontino_logo.svg.png"
                alt="Novorizontino" style={{ width: 48, height: 48, objectFit: 'contain' }} />
              <span style={{ fontSize: 9, color: '#fff', fontWeight: 900, textTransform: 'uppercase', textAlign: 'center' }}>Novorizontino</span>
            </div>
            {/* Info central */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <span style={{ fontSize: 22, fontWeight: 900, color: '#F5C400', fontStyle: 'italic' }}>VS</span>
              <span style={{ fontSize: 9, color: '#aaa', fontWeight: 700, textAlign: 'center' }}>31/03 • 19h</span>
              <span style={{ fontSize: 8, color: '#666', fontWeight: 700, textAlign: 'center' }}>Alfredo Jaconi</span>
            </div>
            {/* Juventude */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1 }}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Esporte_Clube_Juventude_logo.svg/240px-Esporte_Clube_Juventude_logo.svg.png"
                alt="Juventude" style={{ width: 48, height: 48, objectFit: 'contain' }} />
              <span style={{ fontSize: 9, color: '#fff', fontWeight: 900, textTransform: 'uppercase', textAlign: 'center' }}>Juventude</span>
            </div>
          </div>
          <p style={{ fontSize: 9, color: '#555', textAlign: 'center', margin: '10px 0 0', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Monte a escalação ideal para esse jogo 👆
          </p>
        </div>
          <div className="w-1 h-7 bg-yellow-500" />
          <h1 className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter">
            Monte sua <span className="text-yellow-500">Escalação</span>
          </h1>
        </div>
        <p className="text-zinc-500 text-xs mb-4 ml-4">
          {selected ? `✅ Selecionado: ${selected.player.name} — toque na posição no campo` : 'Toque em um jogador para selecioná-lo, depois toque na posição no campo.'}
        </p>

        {/* Formação */}
        <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
          {Object.keys(FORMATIONS).map(f => (
            <button key={f} onClick={() => { setFormation(f); setLineup({}); setSelected(null); }}
              className={`flex-shrink-0 px-3 py-1.5 text-xs font-black uppercase tracking-widest transition-all ${
                formation === f ? 'bg-yellow-500 text-black' : 'border border-zinc-700 text-zinc-400'
              }`}>{f}</button>
          ))}
          <button onClick={() => { setLineup({}); setSelected(null); }}
            className="flex-shrink-0 px-3 py-1.5 text-xs font-black uppercase tracking-widest border border-zinc-800 text-zinc-600 ml-auto">
            Limpar
          </button>
        </div>

        {/* Barra de progresso */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-1.5 bg-zinc-800 rounded overflow-hidden">
            <div style={{ width: `${(filledCount/11)*100}%`, background: filledCount===11?'#4ade80':'#F5C400', height: '100%', transition: 'width 0.3s', borderRadius: 4 }} />
          </div>
          <span className={`text-xs font-black ${filledCount===11?'text-green-400':'text-zinc-400'}`}>{filledCount}/11</span>
        </div>

        {/* CAMPO responsivo */}
        <div
          ref={fieldRef}
          style={{ position: 'relative', width: fieldWidth, height: fieldHeight, margin: '0 auto' }}
          onDragOver={e => e.preventDefault()}
          onDrop={handleDropOnBench}
        >
          {/* Fundo campo */}
          <div style={{ position: 'absolute', inset: 0, borderRadius: 8, overflow: 'hidden', background: '#2a7a2a' }}>
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
          </div>

          {/* Slots */}
          {slots.map(slot => {
            const player = lineup[slot.id];
            const isOver = dragOver === slot.id;
            const isSelectedSlot = selected?.from === slot.id;
            return (
              <div
                key={slot.id}
                style={{
                  position: 'absolute',
                  left: (slot.x/100)*fieldWidth,
                  top: (slot.y/100)*fieldHeight,
                  transform: 'translate(-50%,-50%)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                  zIndex: 10, cursor: 'pointer',
                }}
                draggable={!!player}
                onDragStart={() => player && setDragging({ player, from: slot.id })}
                onDragOver={e => { e.preventDefault(); e.stopPropagation(); setDragOver(slot.id); }}
                onDragLeave={() => setDragOver(null)}
                onDrop={e => { e.stopPropagation(); handleDropOnSlot(slot.id); }}
                onDoubleClick={() => player && setLineup(prev => ({ ...prev, [slot.id]: null }))}
                onClick={() => handleTapSlot(slot.id)}
              >
                <div style={{
                  width: slotSize, height: slotSize, borderRadius: '50%', overflow: 'hidden', position: 'relative',
                  border: isSelectedSlot ? `2.5px solid #fff` : player ? '2.5px solid #F5C400' : selected ? '2px dashed #F5C400' : isOver ? '2px dashed #F5C400' : '2px dashed rgba(255,255,255,0.35)',
                  background: player ? 'transparent' : selected ? 'rgba(245,196,0,0.15)' : 'rgba(0,0,0,0.4)',
                  boxShadow: player ? '0 2px 8px rgba(0,0,0,0.7)' : 'none',
                  flexShrink: 0,
                  transition: 'border 0.15s',
                }}>
                  {player
                    ? <SpritePhoto foto={player.foto} size={slotSize} />
                    : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: selected ? '#F5C400' : 'rgba(255,255,255,0.35)', fontSize: slotSize * 0.4, fontWeight: 900 }}>+</span>
                      </div>
                  }
                  {player && (
                    <div style={{ position: 'absolute', bottom: -1, right: -1, width: 14, height: 14, borderRadius: '50%', background: '#000', border: '1px solid #F5C400', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                      <span style={{ color: '#F5C400', fontSize: 5, fontWeight: 900 }}>{player.num}</span>
                    </div>
                  )}
                </div>
                <span style={{
                  fontSize, fontWeight: 900, color: '#fff',
                  textShadow: '0 1px 4px rgba(0,0,0,1)',
                  textTransform: 'uppercase', whiteSpace: 'nowrap',
                  maxWidth: slotSize + 10, overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {player ? player.short : slot.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* BANCO — grade 3 colunas no mobile */}
        <div className="mt-5">
          {/* Filtro */}
          <div className="flex gap-1.5 mb-3 overflow-x-auto no-scrollbar">
            {['TODOS','GOL','LAT','ZAG','MEI','ATA'].map(p => (
              <button key={p} onClick={() => setFilterPos(p)}
                className={`flex-shrink-0 px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded transition-all ${
                  filterPos === p ? 'bg-yellow-500 text-black' : 'border border-zinc-800 text-zinc-500'
                }`}>{p}</button>
            ))}
          </div>

          {/* Grid de jogadores */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
            {filteredPlayers.map(player => {
              const isSel = selected?.player.id === player.id;
              return (
                <div
                  key={player.id}
                  draggable
                  onDragStart={() => setDragging({ player, from: 'bench' })}
                  onClick={() => { setSelected(isSel ? null : { player, from: 'bench' }); }}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                    padding: '8px 4px', border: isSel ? '1.5px solid #F5C400' : '0.5px solid #3f3f46',
                    background: isSel ? 'rgba(245,196,0,0.1)' : 'rgba(24,24,27,0.5)',
                    cursor: 'pointer', borderRadius: 6, transition: 'all 0.15s',
                    userSelect: 'none',
                  }}
                >
                  <div style={{ width: 46, height: 46, borderRadius: '50%', overflow: 'hidden', border: isSel ? '2px solid #F5C400' : '1px solid #3f3f46', flexShrink: 0, position: 'relative' }}>
                    <SpritePhoto foto={player.foto} size={46} />
                    <div style={{ position: 'absolute', bottom: -1, right: -1, width: 16, height: 16, borderRadius: '50%', background: '#F5C400', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: '#000', fontSize: 7, fontWeight: 900 }}>{player.num}</span>
                    </div>
                  </div>
                  <p style={{ color: isSel ? '#F5C400' : '#fff', fontSize: 9, fontWeight: 900, textTransform: 'uppercase', textAlign: 'center', margin: 0, lineHeight: 1.2, maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {player.short}
                  </p>
                  <span style={{ fontSize: 8, color: '#52525b', fontWeight: 900, textTransform: 'uppercase' }}>{player.pos}</span>
                </div>
              );
            })}
            {filteredPlayers.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: '#52525b' }}>
                <p style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase' }}>Todos escalados!</p>
              </div>
            )}
          </div>
        </div>

        {/* Espaço para o botão fixo não cobrir conteúdo */}
        <div className="h-24" />
      </div>

      {/* Botão FIXO no rodapé — nunca sobrepõe campo */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50, background: '#000', borderTop: '1px solid #27272a', padding: '10px 16px 14px' }}>
        <button onClick={handleGenerate} disabled={filledCount < 11 || generating}
          className={`w-full py-4 text-sm font-black uppercase tracking-widest transition-all rounded ${
            filledCount === 11 ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20 active:opacity-80' : 'bg-zinc-900 text-zinc-600 cursor-not-allowed border border-zinc-800'
          }`}>
          {generating ? '⏳ Gerando story...' : filledCount === 11 ? '📸 Baixar Story para o Instagram' : `Faltam ${11-filledCount} jogador${11-filledCount>1?'es':''}  •  ${filledCount}/11`}
        </button>
        {filledCount === 11 && (
          <div className="flex flex-col items-center gap-1.5 mt-2">
            {/* Ícones sociais */}
            <div className="flex items-center gap-3">
              <span className="text-zinc-600 text-[9px] uppercase tracking-widest">Compartilhe em</span>
              {/* Instagram */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-zinc-400">
                <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2"/>
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/>
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
              </svg>
              {/* WhatsApp */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-zinc-400">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/>
                <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.95-1.418A9.96 9.96 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
              {/* X */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-zinc-400">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              {/* Facebook */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-zinc-400">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </div>
            <p className="text-yellow-500 text-[9px] uppercase tracking-widest">
              #tigredovale — Monte a sua em onovorizontino.com.br
            </p>
          </div>
        )}
      </div>

      {/* Card escondido para captura */}
      {showCard && (
        <div style={{ position: 'fixed', top: -9999, left: -9999, zIndex: -1 }}>
          <div ref={cardRef}>
            <StoryCard lineup={lineup} slots={slots} formation={formation} />
          </div>
        </div>
      )}
    </main>
  );
}
