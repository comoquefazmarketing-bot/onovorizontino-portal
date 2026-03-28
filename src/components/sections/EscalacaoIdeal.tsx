'use client';
import { useState } from 'react';

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
    { id: 'gk',  label: 'GOL', x: 50, y: 88 },
    { id: 'rb',  label: 'LAT', x: 82, y: 70 },
    { id: 'cb1', label: 'ZAG', x: 62, y: 70 },
    { id: 'cb2', label: 'ZAG', x: 38, y: 70 },
    { id: 'lb',  label: 'LAT', x: 18, y: 70 },
    { id: 'cm1', label: 'MEI', x: 72, y: 50 },
    { id: 'cm2', label: 'MEI', x: 50, y: 46 },
    { id: 'cm3', label: 'MEI', x: 28, y: 50 },
    { id: 'rw',  label: 'ATA', x: 76, y: 24 },
    { id: 'st',  label: 'ATA', x: 50, y: 18 },
    { id: 'lw',  label: 'ATA', x: 24, y: 24 },
  ],
  '4-4-2': [
    { id: 'gk',  label: 'GOL', x: 50, y: 88 },
    { id: 'rb',  label: 'LAT', x: 82, y: 70 },
    { id: 'cb1', label: 'ZAG', x: 62, y: 70 },
    { id: 'cb2', label: 'ZAG', x: 38, y: 70 },
    { id: 'lb',  label: 'LAT', x: 18, y: 70 },
    { id: 'rm',  label: 'MEI', x: 80, y: 50 },
    { id: 'cm1', label: 'MEI', x: 60, y: 50 },
    { id: 'cm2', label: 'MEI', x: 40, y: 50 },
    { id: 'lm',  label: 'MEI', x: 20, y: 50 },
    { id: 'st1', label: 'ATA', x: 64, y: 22 },
    { id: 'st2', label: 'ATA', x: 36, y: 22 },
  ],
  '3-5-2': [
    { id: 'gk',  label: 'GOL', x: 50, y: 88 },
    { id: 'cb1', label: 'ZAG', x: 70, y: 72 },
    { id: 'cb2', label: 'ZAG', x: 50, y: 75 },
    { id: 'cb3', label: 'ZAG', x: 30, y: 72 },
    { id: 'rb',  label: 'LAT', x: 86, y: 52 },
    { id: 'cm1', label: 'MEI', x: 68, y: 50 },
    { id: 'cm2', label: 'MEI', x: 50, y: 46 },
    { id: 'cm3', label: 'MEI', x: 32, y: 50 },
    { id: 'lb',  label: 'LAT', x: 14, y: 52 },
    { id: 'st1', label: 'ATA', x: 64, y: 22 },
    { id: 'st2', label: 'ATA', x: 36, y: 22 },
  ],
  '4-2-3-1': [
    { id: 'gk',  label: 'GOL', x: 50, y: 88 },
    { id: 'rb',  label: 'LAT', x: 82, y: 70 },
    { id: 'cb1', label: 'ZAG', x: 62, y: 70 },
    { id: 'cb2', label: 'ZAG', x: 38, y: 70 },
    { id: 'lb',  label: 'LAT', x: 18, y: 70 },
    { id: 'dm1', label: 'MEI', x: 64, y: 57 },
    { id: 'dm2', label: 'MEI', x: 36, y: 57 },
    { id: 'rm',  label: 'MEI', x: 76, y: 38 },
    { id: 'am',  label: 'MEI', x: 50, y: 36 },
    { id: 'lm',  label: 'MEI', x: 24, y: 38 },
    { id: 'st',  label: 'ATA', x: 50, y: 18 },
  ],
};

type Player = typeof PLAYERS[0];
type Lineup = Record<string, Player | null>;

// Componente da foto do jogador com efeito sprite hover
function PlayerPhoto({ foto, size = 42, className = '' }: { foto: string; size?: number; className?: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={`overflow-hidden rounded-full ${className}`}
      style={{ width: size, height: size, position: 'relative' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* A imagem tem 2 poses lado a lado — mostramos metade por vez */}
      <img
        src={foto}
        alt=""
        draggable={false}
        style={{
          position: 'absolute',
          top: 0,
          left: hovered ? '-100%' : '0%',
          width: '200%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'top',
          transition: 'left 0.25s ease',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

export default function EscalacaoIdeal() {
  const [formation, setFormation] = useState('4-3-3');
  const [lineup, setLineup] = useState<Lineup>({});
  const [dragging, setDragging] = useState<{ player: Player; from: string } | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [filterPos, setFilterPos] = useState('TODOS');
  const [shared, setShared] = useState(false);

  const slots = FORMATIONS[formation];
  const usedIds = Object.values(lineup).filter(Boolean).map(p => p!.id);
  const filledCount = Object.values(lineup).filter(Boolean).length;

  const filteredPlayers = PLAYERS.filter(p => {
    if (filterPos !== 'TODOS' && p.pos !== filterPos) return false;
    return !usedIds.includes(p.id);
  });

  const handleDropOnSlot = (slotId: string) => {
    if (!dragging) return;
    const newLineup = { ...lineup };
    const { player, from } = dragging;
    if (from !== 'bench') {
      newLineup[from] = newLineup[slotId] || null;
    }
    newLineup[slotId] = player;
    setLineup(newLineup);
    setDragging(null);
    setDragOver(null);
  };

  const handleDropOnBench = () => {
    if (dragging && dragging.from !== 'bench') {
      setLineup(prev => ({ ...prev, [dragging.from]: null }));
    }
    setDragging(null);
    setDragOver(null);
  };

  const handleShare = () => {
    if (filledCount < 11) return;
    const lines = slots.map(s => {
      const p = lineup[s.id];
      return p ? `${s.label}: ${p.name} (${p.num})` : '';
    }).filter(Boolean);
    const text = `🟡⚫ MINHA ESCALAÇÃO IDEAL DO NOVORIZONTINO\n\nFormação: ${formation}\n\n${lines.join('\n')}\n\nMonte a sua em onovorizontino.com.br\n#Novorizontino #TigreDoVale #SerieB2026`;
    navigator.clipboard.writeText(text).then(() => {
      setShared(true);
      setTimeout(() => setShared(false), 3000);
    });
  };

  return (
    <main className="min-h-screen bg-black text-white pb-24">
      <div className="max-w-6xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1 h-8 bg-yellow-500" />
          <h1 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter">
            Monte sua <span className="text-yellow-500">Escalação</span>
          </h1>
        </div>
        <p className="text-zinc-400 text-sm mb-6 ml-4">Arraste os jogadores para o campo. Passe o mouse para ver a segunda pose.</p>

        {/* Formação */}
        <div className="flex gap-2 mb-6 flex-wrap ml-4">
          {Object.keys(FORMATIONS).map(f => (
            <button key={f} onClick={() => { setFormation(f); setLineup({}); setShared(false); }}
              className={`px-4 py-1.5 text-xs font-black uppercase tracking-widest transition-all ${
                formation === f ? 'bg-yellow-500 text-black' : 'border border-zinc-700 text-zinc-400 hover:border-yellow-500 hover:text-yellow-500'
              }`}>{f}</button>
          ))}
          <button onClick={() => { setLineup({}); setShared(false); }}
            className="px-4 py-1.5 text-xs font-black uppercase tracking-widest border border-zinc-800 text-zinc-600 hover:text-zinc-400 ml-auto">
            Limpar
          </button>
        </div>

        {/* Layout principal */}
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>

          {/* CAMPO */}
          <div
            style={{ position: 'relative', width: 360, height: 557, flexShrink: 0 }}
            onDragOver={e => e.preventDefault()}
            onDrop={handleDropOnBench}
          >
            {/* Fundo */}
            <div style={{ position: 'absolute', inset: 0, borderRadius: 8, overflow: 'hidden', background: '#2a7a2a' }}>
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 68 105" preserveAspectRatio="none">
                {[0,1,2,3,4,5,6].map(i => (
                  <rect key={i} x="0" y={i*15} width="68" height="7.5" fill={i%2===0?'rgba(255,255,255,0.04)':'transparent'} />
                ))}
                <rect x="2" y="3" width="64" height="99" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.6" />
                <line x1="2" y1="52.5" x2="66" y2="52.5" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
                <circle cx="34" cy="52.5" r="9.15" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
                <circle cx="34" cy="52.5" r="0.6" fill="rgba(255,255,255,0.5)" />
                <rect x="13.84" y="3" width="40.32" height="18.32" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
                <rect x="24.84" y="3" width="18.32" height="5.5" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
                <rect x="29.34" y="1.5" width="9.32" height="2" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.5" />
                <rect x="13.84" y="83.68" width="40.32" height="18.32" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
                <rect x="24.84" y="96.5" width="18.32" height="5.5" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
                <rect x="29.34" y="101.5" width="9.32" height="2" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.5" />
                <circle cx="34" cy="14" r="0.6" fill="rgba(255,255,255,0.4)" />
                <circle cx="34" cy="91" r="0.6" fill="rgba(255,255,255,0.4)" />
              </svg>
            </div>

            {/* Slots */}
            {slots.map(slot => {
              const player = lineup[slot.id];
              const isOver = dragOver === slot.id;
              const left = (slot.x / 100) * 360;
              const top = (slot.y / 100) * 557;
              return (
                <div
                  key={slot.id}
                  style={{
                    position: 'absolute',
                    left,
                    top,
                    transform: 'translate(-50%, -50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 3,
                    zIndex: 10,
                    cursor: player ? 'grab' : 'default',
                  }}
                  draggable={!!player}
                  onDragStart={() => player && setDragging({ player, from: slot.id })}
                  onDragOver={e => { e.preventDefault(); e.stopPropagation(); setDragOver(slot.id); }}
                  onDragLeave={() => setDragOver(null)}
                  onDrop={e => { e.stopPropagation(); handleDropOnSlot(slot.id); }}
                  onDoubleClick={() => player && setLineup(prev => ({ ...prev, [slot.id]: null }))}
                >
                  <div style={{
                    width: 44, height: 44,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: player ? '2.5px solid #F5C400' : isOver ? '2px dashed #F5C400' : '2px dashed rgba(255,255,255,0.4)',
                    background: player ? 'transparent' : isOver ? 'rgba(245,196,0,0.2)' : 'rgba(0,0,0,0.4)',
                    position: 'relative',
                    boxShadow: player ? '0 2px 10px rgba(0,0,0,0.7)' : 'none',
                    flexShrink: 0,
                  }}>
                    {player ? (
                      <PlayerPhoto foto={player.foto} size={44} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 18, fontWeight: 900 }}>+</span>
                      </div>
                    )}
                    {player && (
                      <div style={{
                        position: 'absolute', bottom: -1, right: -1,
                        width: 16, height: 16, borderRadius: '50%',
                        background: '#000', border: '1px solid #F5C400',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <span style={{ color: '#F5C400', fontSize: 6, fontWeight: 900 }}>{player.num}</span>
                      </div>
                    )}
                  </div>
                  <span style={{
                    fontSize: 7.5, fontWeight: 900, color: '#fff',
                    textShadow: '0 1px 4px rgba(0,0,0,1)',
                    textTransform: 'uppercase', whiteSpace: 'nowrap',
                    letterSpacing: '0.03em', maxWidth: 54,
                    overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {player ? player.short : slot.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* BANCO */}
          <div style={{ flex: 1, minWidth: 260, display: 'flex', flexDirection: 'column', gap: 10 }}>

            {/* Progresso */}
            <div className="bg-zinc-900 border border-zinc-800 p-3 rounded">
              <div className="flex justify-between items-center mb-2">
                <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Escalados</span>
                <span className={`text-sm font-black ${filledCount === 11 ? 'text-green-400' : 'text-white'}`}>{filledCount}/11</span>
              </div>
              <div className="h-1 bg-zinc-800 rounded overflow-hidden">
                <div style={{
                  height: '100%', borderRadius: 4, transition: 'width 0.3s',
                  width: `${(filledCount/11)*100}%`,
                  background: filledCount === 11 ? '#4ade80' : '#F5C400'
                }} />
              </div>
            </div>

            {/* Filtro */}
            <div className="flex gap-1.5 flex-wrap">
              {['TODOS','GOL','LAT','ZAG','MEI','ATA'].map(p => (
                <button key={p} onClick={() => setFilterPos(p)}
                  className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded transition-all ${
                    filterPos === p ? 'bg-yellow-500 text-black' : 'border border-zinc-800 text-zinc-500 hover:border-zinc-600'
                  }`}>{p}</button>
              ))}
            </div>

            {/* Lista */}
            <div
              style={{ maxHeight: 360, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}
              onDragOver={e => e.preventDefault()}
              onDrop={handleDropOnBench}
            >
              {filteredPlayers.map(player => (
                <div
                  key={player.id}
                  draggable
                  onDragStart={() => setDragging({ player, from: 'bench' })}
                  className="flex items-center gap-2 px-2.5 py-2 border border-zinc-800 hover:border-zinc-600 bg-zinc-900/50 cursor-grab select-none transition-all"
                >
                  <div style={{ width: 38, height: 38, borderRadius: '50%', overflow: 'hidden', border: '1px solid #3f3f46', flexShrink: 0 }}>
                    <PlayerPhoto foto={player.foto} size={38} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p className="text-white text-xs font-black uppercase truncate">{player.name}</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="text-[9px] text-zinc-600 uppercase font-black">{player.pos}</span>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#F5C400', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: '#000', fontSize: 8, fontWeight: 900 }}>{player.num}</span>
                    </div>
                  </div>
                </div>
              ))}
              {filteredPlayers.length === 0 && (
                <p className="text-zinc-600 text-xs text-center py-6 uppercase font-black">Todos escalados!</p>
              )}
            </div>

            {/* Compartilhar */}
            <button onClick={handleShare} disabled={filledCount < 11}
              className={`w-full py-3 text-xs font-black uppercase tracking-widest transition-all ${
                filledCount === 11 ? 'bg-yellow-500 text-black hover:opacity-90' : 'bg-zinc-900 text-zinc-600 cursor-not-allowed border border-zinc-800'
              }`}>
              {shared ? 'Copiado! Cole no Instagram' : filledCount === 11 ? 'Gerar para o Instagram' : `Faltam ${11-filledCount} jogador${11-filledCount>1?'es':''}`}
            </button>

            <p className="text-zinc-700 text-[9px] text-center uppercase tracking-widest">
              Duplo clique no campo para remover
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
