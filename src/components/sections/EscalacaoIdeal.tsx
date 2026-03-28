'use client';
import { useState } from 'react';

const BASE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';

const PLAYERS = [
  // Goleiros
  { id: 1,  name: 'César Augusto',   short: 'César',      num: 31, pos: 'GOL', foto: BASE + 'CESAR-AUGUSTO.jpg.webp' },
  { id: 2,  name: 'Jordi',           short: 'Jordi',       num: 93, pos: 'GOL', foto: BASE + 'JORDI.jpg.webp' },
  { id: 3,  name: 'João Scapin',     short: 'Scapin',      num: 12, pos: 'GOL', foto: BASE + 'JOAO-SCAPIN.jpg.webp' },
  { id: 4,  name: 'Lucas Ribeiro',   short: 'Lucas',       num: 1,  pos: 'GOL', foto: BASE + 'LUCAS-RIBEIRO.jpg.webp' },
  // Laterais
  { id: 5,  name: 'Lora',            short: 'Lora',        num: 2,  pos: 'LAT', foto: BASE + 'LORA.jpg.webp' },
  { id: 6,  name: 'Castrillón',      short: 'Castrillón',  num: 6,  pos: 'LAT', foto: BASE + 'CASTRILLON.jpg.webp' },
  { id: 7,  name: 'Arthur Barbosa',  short: 'A.Barbosa',   num: 22, pos: 'LAT', foto: BASE + 'ARTHUR-BARBOSA.jpg.webp' },
  { id: 8,  name: 'Mayk',            short: 'Mayk',        num: 26, pos: 'LAT', foto: BASE + 'MAYK.jpg.webp' },
  { id: 9,  name: 'Maykon Jesus',    short: 'Maykon',      num: 27, pos: 'LAT', foto: BASE + 'MAYKON-JESUS.jpg.webp' },
  // Zagueiros
  { id: 10, name: 'Dantas',          short: 'Dantas',      num: 3,  pos: 'ZAG', foto: BASE + 'DANTAAS.jpg.webp' },
  { id: 11, name: 'Eduardo Brock',   short: 'E.Brock',     num: 5,  pos: 'ZAG', foto: BASE + 'EDUARDO-BROCK.jpg.webp' },
  { id: 12, name: 'Patrick',         short: 'Patrick',     num: 4,  pos: 'ZAG', foto: BASE + 'PATRICK.jpg.webp' },
  { id: 13, name: 'Gabriel Bahia',   short: 'G.Bahia',     num: 14, pos: 'ZAG', foto: BASE + 'GABRIEL-BAHIA.jpg.webp' },
  { id: 14, name: 'Carlinhos',       short: 'Carlinhos',   num: 25, pos: 'ZAG', foto: BASE + 'CARLINHOS.jpg.webp' },
  { id: 15, name: 'Alemão',          short: 'Alemão',      num: 28, pos: 'ZAG', foto: BASE + 'ALEMAO.jpg.webp' },
  { id: 16, name: 'Renato Palm',     short: 'R.Palm',      num: 24, pos: 'ZAG', foto: BASE + 'RENATO-PALM.jpg.webp' },
  { id: 17, name: 'Alvariño',        short: 'Alvariño',    num: 35, pos: 'ZAG', foto: BASE + 'IVAN-ALVARINO.jpg.webp' },
  { id: 18, name: 'Bruno Santana',   short: 'B.Santana',   num: 33, pos: 'ZAG', foto: BASE + 'BRUNO-SANTANA.jpg.webp' },
  // Meias/Volantes
  { id: 19, name: 'Luís Oyama',      short: 'Oyama',       num: 8,  pos: 'MEI', foto: BASE + 'LUIS-OYAMA.jpg.webp' },
  { id: 20, name: 'Léo Naldi',       short: 'L.Naldi',     num: 7,  pos: 'MEI', foto: BASE + 'LEO-NALDI.jpg.webp' },
  { id: 21, name: 'Rômulo',          short: 'Rômulo',      num: 10, pos: 'MEI', foto: BASE + 'ROMULO.jpg.webp' },
  { id: 22, name: 'Matheus Bianqui', short: 'Bianqui',     num: 11, pos: 'MEI', foto: BASE + 'MATHEUS-BIANQUI.jpg.webp' },
  { id: 23, name: 'Juninho',         short: 'Juninho',     num: 20, pos: 'MEI', foto: BASE + 'JUNINHO.jpg.webp' },
  { id: 24, name: 'Tavinho',         short: 'Tavinho',     num: 17, pos: 'MEI', foto: BASE + 'TAVINHO.jpg.webp' },
  { id: 25, name: 'Diego Galo',      short: 'D.Galo',      num: 29, pos: 'MEI', foto: BASE + 'DIEGO-GALO.jpg.webp' },
  { id: 26, name: 'Marlon',          short: 'Marlon',      num: 30, pos: 'MEI', foto: BASE + 'MARLON.jpg.webp' },
  { id: 27, name: 'Hector Bianchi',  short: 'Hector',      num: 16, pos: 'MEI', foto: BASE + 'HECTOR-BIACHI.jpg.webp' },
  { id: 28, name: 'Nogueira',        short: 'Nogueira',    num: 36, pos: 'MEI', foto: BASE + 'NOGUEIRA.jpg.webp' },
  { id: 29, name: 'Luiz Gabriel',    short: 'L.Gabriel',   num: 37, pos: 'MEI', foto: BASE + 'LUIZ-GABRIEL.jpg.webp' },
  { id: 30, name: 'Jhones Kauê',     short: 'J.Kauê',      num: 50, pos: 'MEI', foto: BASE + 'JHONES-KAUE.jpg.webp' },
  // Atacantes
  { id: 31, name: 'Robson',          short: 'Robson',      num: 9,  pos: 'ATA', foto: BASE + 'ROBSON.jpg.webp' },
  { id: 32, name: 'Vinícius Paiva',  short: 'V.Paiva',     num: 13, pos: 'ATA', foto: BASE + 'VINICIUS-PAIVA.jpg.webp' },
  { id: 33, name: 'Hélio Borges',    short: 'H.Borges',    num: 18, pos: 'ATA', foto: BASE + 'HELIO-BORGES.jpg.webp' },
  { id: 34, name: 'Jardiel',         short: 'Jardiel',     num: 19, pos: 'ATA', foto: BASE + 'JARDIEL.jpg.webp' },
  { id: 35, name: 'Nicolas Careca',  short: 'N.Careca',    num: 21, pos: 'ATA', foto: BASE + 'NICOLAS-CARECA.jpg.webp' },
  { id: 36, name: 'Titi Ortiz',      short: 'T.Ortiz',     num: 15, pos: 'ATA', foto: BASE + 'TITI-ORTIZ.jpg.webp' },
  { id: 37, name: 'Diego Mathias',   short: 'D.Mathias',   num: 41, pos: 'ATA', foto: BASE + 'DIEGO-MATHIAS.jpg.webp' },
  { id: 38, name: 'Carlão',          short: 'Carlão',      num: 90, pos: 'ATA', foto: BASE + 'CARLAO.jpg.webp' },
  { id: 39, name: 'Ronald Barcellos',short: 'Ronald',      num: 23, pos: 'ATA', foto: BASE + 'RONALD-BARCELLOS.jpg.webp' },
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
      // Se origem é outro slot
      const displaced = newLineup[slotId];
      newLineup[from] = displaced || null;
    }
    newLineup[slotId] = player;
    setLineup(newLineup);
    setDragging(null);
    setDragOver(null);
  };

  const handleDropOnBench = () => {
    if (dragging && dragging.from !== 'bench') {
      const newLineup = { ...lineup };
      newLineup[dragging.from] = null;
      setLineup(newLineup);
    }
    setDragging(null);
    setDragOver(null);
  };

  const changeFormation = (f: string) => {
    setFormation(f);
    setLineup({});
    setShared(false);
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
        <p className="text-zinc-400 text-sm mb-6 ml-4">Arraste os jogadores do banco para o campo. Seu time ideal do Tigre.</p>

        {/* Formação */}
        <div className="flex gap-2 mb-6 flex-wrap ml-4">
          {Object.keys(FORMATIONS).map(f => (
            <button key={f} onClick={() => changeFormation(f)}
              className={`px-4 py-1.5 text-xs font-black uppercase tracking-widest transition-all ${
                formation === f ? 'bg-yellow-500 text-black' : 'border border-zinc-700 text-zinc-400 hover:border-yellow-500 hover:text-yellow-500'
              }`}>
              {f}
            </button>
          ))}
          <button onClick={() => { setLineup({}); setShared(false); }}
            className="px-4 py-1.5 text-xs font-black uppercase tracking-widest border border-zinc-800 text-zinc-600 hover:text-zinc-400 ml-auto">
            Limpar
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">

          {/* CAMPO — proporção real 68x105 */}
          <div
            className="relative mx-auto w-full"
            style={{ maxWidth: 440, aspectRatio: '68/105' }}
            onDragOver={e => e.preventDefault()}
            onDrop={handleDropOnBench}
          >
            {/* Fundo do campo */}
            <div className="absolute inset-0 rounded-lg overflow-hidden" style={{ background: '#2a7a2a' }}>
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 68 105" preserveAspectRatio="none">
                {/* Listras */}
                {[0,1,2,3,4,5,6].map(i => (
                  <rect key={i} x="0" y={i*15} width="68" height="7.5" fill={i%2===0?'rgba(255,255,255,0.04)':'transparent'} />
                ))}
                {/* Borda */}
                <rect x="2" y="3" width="64" height="99" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.6" />
                {/* Linha do meio */}
                <line x1="2" y1="52.5" x2="66" y2="52.5" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
                {/* Círculo central */}
                <circle cx="34" cy="52.5" r="9.15" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
                <circle cx="34" cy="52.5" r="0.6" fill="rgba(255,255,255,0.4)" />
                {/* Área grande top */}
                <rect x="13.84" y="3" width="40.32" height="18.32" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
                {/* Área pequena top */}
                <rect x="24.84" y="3" width="18.32" height="5.5" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
                {/* Gol top */}
                <rect x="29.34" y="1.5" width="9.32" height="2" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.5" />
                {/* Área grande bottom */}
                <rect x="13.84" y="83.68" width="40.32" height="18.32" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
                {/* Área pequena bottom */}
                <rect x="24.84" y="96.5" width="18.32" height="5.5" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
                {/* Gol bottom */}
                <rect x="29.34" y="101.5" width="9.32" height="2" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.5" />
                {/* Ponto pênalti top */}
                <circle cx="34" cy="14" r="0.6" fill="rgba(255,255,255,0.4)" />
                {/* Ponto pênalti bottom */}
                <circle cx="34" cy="91" r="0.6" fill="rgba(255,255,255,0.4)" />
              </svg>
            </div>

            {/* Slots dos jogadores */}
            {slots.map(slot => {
              const player = lineup[slot.id];
              const isOver = dragOver === slot.id;
              return (
                <div
                  key={slot.id}
                  className="absolute flex flex-col items-center gap-1 cursor-pointer z-10"
                  style={{ left: `${slot.x}%`, top: `${slot.y}%`, transform: 'translate(-50%, -50%)' }}
                  onDragOver={e => { e.preventDefault(); e.stopPropagation(); setDragOver(slot.id); }}
                  onDragLeave={() => setDragOver(null)}
                  onDrop={e => { e.stopPropagation(); handleDropOnSlot(slot.id); }}
                  draggable={!!player}
                  onDragStart={() => player && setDragging({ player, from: slot.id })}
                  onDoubleClick={() => player && setLineup(prev => ({ ...prev, [slot.id]: null }))}
                >
                  {/* Foto ou slot vazio */}
                  <div className="relative" style={{ width: 42, height: 42 }}>
                    <div
                      className="w-full h-full rounded-full overflow-hidden transition-all duration-150"
                      style={{
                        border: player ? '2.5px solid #F5C400' : isOver ? '2px dashed #F5C400' : '2px dashed rgba(255,255,255,0.4)',
                        background: player ? 'transparent' : isOver ? 'rgba(245,196,0,0.2)' : 'rgba(0,0,0,0.4)',
                        boxShadow: player ? '0 2px 10px rgba(0,0,0,0.6)' : 'none',
                      }}
                    >
                      {player ? (
                        <img
                          src={player.foto}
                          alt={player.name}
                          className="w-full h-full object-cover object-top"
                          draggable={false}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-white/40 text-lg font-black">+</span>
                        </div>
                      )}
                    </div>
                    {/* Número da camisa */}
                    {player && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-black border border-yellow-500 flex items-center justify-center">
                        <span className="text-yellow-500 font-black" style={{ fontSize: 7 }}>{player.num}</span>
                      </div>
                    )}
                  </div>
                  {/* Nome */}
                  <span
                    className="text-white font-black uppercase text-center"
                    style={{
                      fontSize: 7,
                      textShadow: '0 1px 4px rgba(0,0,0,1)',
                      maxWidth: 52,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      letterSpacing: '0.02em',
                    }}
                  >
                    {player ? player.short : slot.label}
                  </span>
                </div>
              );
            })}

            {/* Logo no centro */}
            <div className="absolute" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)', opacity: 0.08, pointerEvents: 'none' }}>
              <div className="text-white font-black italic text-2xl uppercase tracking-tighter text-center leading-tight">
                O NOVO<br/>ORIZONTINO
              </div>
            </div>
          </div>

          {/* BANCO DE JOGADORES */}
          <div className="flex flex-col gap-3">

            {/* Progresso */}
            <div className="bg-zinc-900 border border-zinc-800 p-3 rounded">
              <div className="flex justify-between items-center mb-2">
                <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Escalados</span>
                <span className={`text-sm font-black ${filledCount === 11 ? 'text-green-400' : 'text-white'}`}>
                  {filledCount}/11
                </span>
              </div>
              <div className="h-1 bg-zinc-800 rounded overflow-hidden">
                <div
                  className="h-full rounded transition-all duration-300"
                  style={{ width: `${(filledCount/11)*100}%`, background: filledCount === 11 ? '#4ade80' : '#F5C400' }}
                />
              </div>
            </div>

            {/* Filtro posição */}
            <div className="flex gap-1.5 flex-wrap">
              {['TODOS','GOL','LAT','ZAG','MEI','ATA'].map(p => (
                <button key={p} onClick={() => setFilterPos(p)}
                  className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded transition-all ${
                    filterPos === p ? 'bg-yellow-500 text-black' : 'border border-zinc-800 text-zinc-500 hover:border-zinc-600'
                  }`}>
                  {p}
                </button>
              ))}
            </div>

            {/* Lista jogadores */}
            <div
              className="flex-1 overflow-y-auto flex flex-col gap-1"
              style={{ maxHeight: 320 }}
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
                  <div className="w-9 h-9 rounded-full overflow-hidden border border-zinc-700 flex-shrink-0">
                    <img src={player.foto} alt={player.name} className="w-full h-full object-cover object-top" draggable={false} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-black uppercase truncate">{player.name}</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="text-[9px] text-zinc-600 uppercase font-black">{player.pos}</span>
                    <div className="w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center">
                      <span className="text-black font-black" style={{ fontSize: 8 }}>{player.num}</span>
                    </div>
                  </div>
                </div>
              ))}
              {filteredPlayers.length === 0 && (
                <p className="text-zinc-600 text-xs text-center py-6 uppercase font-black">Todos escalados!</p>
              )}
            </div>

            {/* Botão compartilhar */}
            <button
              onClick={handleShare}
              disabled={filledCount < 11}
              className={`w-full py-3 text-xs font-black uppercase tracking-widest transition-all ${
                filledCount === 11
                  ? 'bg-yellow-500 text-black hover:opacity-90'
                  : 'bg-zinc-900 text-zinc-600 cursor-not-allowed border border-zinc-800'
              }`}
            >
              {shared
                ? 'Copiado! Cole no Instagram'
                : filledCount === 11
                  ? 'Gerar para o Instagram'
                  : `Faltam ${11 - filledCount} jogador${11-filledCount > 1 ? 'es' : ''}`}
            </button>

            <p className="text-zinc-700 text-[9px] text-center uppercase tracking-widest">
              Duplo clique no campo para remover o jogador
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
