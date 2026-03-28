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
  const CARD_W = 540;
  const CARD_H = 960;
  const FIELD_W = 320;
  const FIELD_H = 495;
  const FIELD_X = (CARD_W - FIELD_W) / 2;
  const FIELD_Y = 120;

  return (
    <div style={{ width: CARD_W, height: CARD_H, background: '#0a0a0a', position: 'relative', overflow: 'hidden', fontFamily: 'Impact, Arial Black, sans-serif' }}>

      {/* Topo amarelo */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 110, background: '#F5C400', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
        <span style={{ fontSize: 12, fontWeight: 900, color: '#000', textTransform: 'uppercase', letterSpacing: '0.3em' }}>O NOVORIZONTINO</span>
        <span style={{ fontSize: 28, fontWeight: 900, color: '#000', fontStyle: 'italic', textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 1 }}>MINHA ESCALAÇÃO</span>
        <span style={{ fontSize: 15, fontWeight: 900, color: 'rgba(0,0,0,0.5)', fontStyle: 'italic', textTransform: 'uppercase' }}>Formação {formation}</span>
      </div>

      {/* Campo */}
      <div style={{ position: 'absolute', left: FIELD_X, top: FIELD_Y, width: FIELD_W, height: FIELD_H, borderRadius: 6, overflow: 'hidden', background: '#2a7a2a' }}>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 68 105" preserveAspectRatio="none">
          {[0,1,2,3,4,5,6].map(i => <rect key={i} x="0" y={i*15} width="68" height="7.5" fill={i%2===0?'rgba(255,255,255,0.05)':'transparent'} />)}
          <rect x="2" y="3" width="64" height="99" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="0.7" />
          <line x1="2" y1="52.5" x2="66" y2="52.5" stroke="rgba(255,255,255,0.35)" strokeWidth="0.6" />
          <circle cx="34" cy="52.5" r="9.15" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="0.6" />
          <rect x="13.84" y="3" width="40.32" height="18.32" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
          <rect x="24.84" y="3" width="18.32" height="5.5" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.5" />
          <rect x="13.84" y="83.68" width="40.32" height="18.32" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
          <rect x="24.84" y="96.5" width="18.32" height="5.5" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.5" />
        </svg>
        {slots.map(slot => {
          const player = lineup[slot.id];
          if (!player) return null;
          return (
            <div key={slot.id} style={{ position: 'absolute', left: (slot.x/100)*FIELD_W, top: (slot.y/100)*FIELD_H, transform: 'translate(-50%,-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, zIndex: 10 }}>
              <div style={{ width: 38, height: 38, borderRadius: '50%', border: '2px solid #F5C400', backgroundImage: `url(${player.foto})`, backgroundSize: '200% 100%', backgroundPosition: 'left top', backgroundRepeat: 'no-repeat', boxShadow: '0 2px 8px rgba(0,0,0,0.8)' }} />
              <span style={{ fontSize: 7, fontWeight: 900, color: '#fff', textShadow: '0 1px 3px rgba(0,0,0,1)', textTransform: 'uppercase', whiteSpace: 'nowrap', maxWidth: 44, overflow: 'hidden', textOverflow: 'ellipsis' }}>{player.short}</span>
            </div>
          );
        })}
      </div>

      {/* Laterais */}
      <div style={{ position: 'absolute', top: 110, left: 0, width: FIELD_X, height: FIELD_H, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 22, color: '#F5C400', opacity: 0.12, fontStyle: 'italic', fontWeight: 900, textTransform: 'uppercase', writingMode: 'vertical-rl', transform: 'rotate(180deg)', letterSpacing: '0.1em' }}>TIGRE</span>
      </div>
      <div style={{ position: 'absolute', top: 110, right: 0, width: FIELD_X, height: FIELD_H, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 22, color: '#F5C400', opacity: 0.12, fontStyle: 'italic', fontWeight: 900, textTransform: 'uppercase', writingMode: 'vertical-rl', letterSpacing: '0.1em' }}>VALE</span>
      </div>

      {/* CTA inferior */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 225, borderTop: '3px solid #F5C400', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <span style={{ fontSize: 28, fontWeight: 900, color: '#fff', fontStyle: 'italic', textTransform: 'uppercase' }}>QUAL É A SUA?</span>
        <span style={{ fontSize: 13, color: '#F5C400', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'center' }}>#tigredovale #novorizontino #serieb2026</span>
        <span style={{ fontSize: 11, color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'Arial, sans-serif' }}>onovorizontino.com.br</span>
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

        {/* Header */}
        <div className="flex items-center gap-3 mb-1">
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
          style={{ position: 'relative', width: fieldWidth, height: fieldHeight, margin: '0 auto', touchAction: 'none' }}
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

        {/* Botão gerar story */}
        <div className="mt-6 sticky bottom-4">
          <button onClick={handleGenerate} disabled={filledCount < 11 || generating}
            className={`w-full py-4 text-sm font-black uppercase tracking-widest transition-all rounded ${
              filledCount === 11 ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' : 'bg-zinc-900 text-zinc-600 cursor-not-allowed border border-zinc-800'
            }`}>
            {generating ? 'Gerando story...' : filledCount === 11 ? 'Baixar Story para o Instagram' : `Faltam ${11-filledCount} jogador${11-filledCount>1?'es':''}`}
          </button>
          {filledCount === 11 && (
            <p className="text-yellow-500 text-[10px] text-center uppercase tracking-widest mt-2">
              Salva e posta nos stories com #tigredovale!
            </p>
          )}
          <p className="text-zinc-700 text-[9px] text-center uppercase tracking-widest mt-1">
            Duplo clique no campo para remover jogador
          </p>
        </div>

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
