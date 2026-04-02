'use client';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

// Configuração do Cliente Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const BASE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';

const PLAYERS = [
  { id: 1,  name: 'César Augusto',   short: 'César',      num: 31, pos: 'GOL', foto: BASE+'CESAR-AUGUSTO.jpg.webp' },
  { id: 2,  name: 'Jordi',             short: 'Jordi',      num: 93, pos: 'GOL', foto: BASE+'JORDI.jpg.webp' },
  { id: 3,  name: 'João Scapin',       short: 'Scapin',      num: 12, pos: 'GOL', foto: BASE+'JOAO-SCAPIN.jpg.webp' },
  { id: 4,  name: 'Lucas Ribeiro',     short: 'Lucas',      num: 1,  pos: 'GOL', foto: BASE+'LUCAS-RIBEIRO.jpg.webp' },
  { id: 5,  name: 'Lora',              short: 'Lora',            num: 2,  pos: 'LAT', foto: BASE+'LORA.jpg.webp' },
  { id: 6,  name: 'Castrillón',          short: 'Castrillón', num: 6,  pos: 'LAT', foto: BASE+'CASTRILLON.jpg.webp' },
  { id: 7,  name: 'Arthur Barbosa',      short: 'A.Barbosa',  num: 22, pos: 'LAT', foto: BASE+'ARTHUR-BARBOSA.jpg.webp' },
  { id: 8,  name: 'Sander',              short: 'Sander',     num: 33, pos: 'LAT', foto: BASE+'SANDER.jpg.webp' },
  { id: 9,  name: 'Maykon Jesus',        short: 'Maykon',      num: 27, pos: 'LAT', foto: BASE+'MAYKON-JESUS.jpg.webp' },
  { id: 10, name: 'Dantas',              short: 'Dantas',      num: 3,  pos: 'ZAG', foto: BASE+'DANTAAS.jpg.webp' },
  { id: 11, name: 'Eduardo Brock',       short: 'E.Brock',     num: 5,  pos: 'ZAG', foto: BASE+'EDUARDO-BROCK.jpg.webp' },
  { id: 12, name: 'Patrick',              short: 'Patrick',     num: 4,  pos: 'ZAG', foto: BASE+'PATRICK.jpg.webp' },
  { id: 13, name: 'Gabriel Bahia',       short: 'G.Bahia',     num: 14, pos: 'ZAG', foto: BASE+'GABRIEL-BAHIA.jpg.webp' },
  { id: 14, name: 'Carlinhos',           short: 'Carlinhos',   num: 25, pos: 'ZAG', foto: BASE+'CARLINHOS.jpg.webp' },
  { id: 15, name: 'Alemão',              short: 'Alemão',      num: 28, pos: 'ZAG', foto: BASE+'ALEMAO.jpg.webp' },
  { id: 16, name: 'Renato Palm',          short: 'R.Palm',      num: 24, pos: 'ZAG', foto: BASE+'RENATO-PALM.jpg.webp' },
  { id: 17, name: 'Alvariño',             short: 'Alvariño',     num: 35, pos: 'ZAG', foto: BASE+'IVAN-ALVARINO.jpg.webp' },
  { id: 18, name: 'Bruno Santana',       short: 'B.Santana',   num: 33, pos: 'ZAG', foto: BASE+'BRUNO-SANTANA.jpg.webp' },
  { id: 19, name: 'Luís Oyama',           short: 'Oyama',            num: 8,  pos: 'MEI', foto: BASE+'LUIS-OYAMA.jpg.webp' },
  { id: 20, name: 'Léo Naldi',           short: 'L.Naldi',     num: 7,  pos: 'MEI', foto: BASE+'LEO-NALDI.jpg.webp' },
  { id: 21, name: 'Rômulo',              short: 'Rômulo',      num: 10, pos: 'MEI', foto: BASE+'ROMULO.jpg.webp' },
  { id: 22, name: 'Matheus Bianqui',  short: 'Bianqui',     num: 11, pos: 'MEI', foto: BASE+'MATHEUS-BIANQUI.jpg.webp' },
  { id: 23, name: 'Juninho',              short: 'Juninho',     num: 20, pos: 'MEI', foto: BASE+'JUNINHO.jpg.webp' },
  { id: 24, name: 'Tavinho',              short: 'Tavinho',     num: 17, pos: 'MEI', foto: BASE+'TAVINHO.jpg.webp' },
  { id: 25, name: 'Diego Galo',           short: 'D.Galo',      num: 29, pos: 'MEI', foto: BASE+'DIEGO-GALO.jpg.webp' },
  { id: 26, name: 'Marlon',              short: 'Marlon',      num: 30, pos: 'MEI', foto: BASE+'MARLON.jpg.webp' },
  { id: 27, name: 'Hector Bianchi',      short: 'Hector',      num: 16, pos: 'MEI', foto: BASE+'HECTOR-BIACHI.jpg.webp' },
  { id: 28, name: 'Nogueira',            short: 'Nogueira',     num: 36, pos: 'MEI', foto: BASE+'NOGUEIRA.jpg.webp' },
  { id: 29, name: 'Luiz Gabriel',        short: 'L.Gabriel',   num: 37, pos: 'MEI', foto: BASE+'LUIZ-GABRIEL.jpg.webp' },
  { id: 30, name: 'Jhones Kauê',          short: 'J.Kauê',      num: 50, pos: 'MEI', foto: BASE+'JHONES-KAUE.jpg.webp' },
  { id: 31, name: 'Robson',              short: 'Robson',      num: 9,  pos: 'ATA', foto: BASE+'ROBSON.jpg.webp' },
  { id: 32, name: 'Vinícius Paiva',      short: 'V.Paiva',     num: 13, pos: 'ATA', foto: BASE+'VINICIUS-PAIVA.jpg.webp' },
  { id: 33, name: 'Hélio Borges',        short: 'H.Borges',     num: 18, pos: 'ATA', foto: BASE+'HELIO-BORGES.jpg.webp' },
  { id: 34, name: 'Jardiel',              short: 'Jardiel',     num: 19, pos: 'ATA', foto: BASE+'JARDIEL.jpg.webp' },
  { id: 35, name: 'Nicolas Careca',      short: 'N.Careca',     num: 21, pos: 'ATA', foto: BASE+'NICOLAS-CARECA.jpg.webp' },
  { id: 36, name: 'Titi Ortiz',          short: 'T.Ortiz',     num: 15, pos: 'ATA', foto: BASE+'TITI-ORTIZ.jpg.webp' },
  { id: 37, name: 'Diego Mathias',       short: 'D.Mathias',   num: 41, pos: 'ATA', foto: BASE+'DIEGO-MATHIAS.jpg.webp' },
  { id: 38, name: 'Carlão',              short: 'Carlão',      num: 90, pos: 'ATA', foto: BASE+'CARLAO.jpg.webp' },
  { id: 39, name: 'Ronald Barcellos', short: 'Ronald',      num: 23, pos: 'ATA', foto: BASE+'RONALD-BARCELLOS.jpg.webp' },
];

const FORMATIONS = {
  '4-2-3-1': [
    { id: 'gk',  x: 50, y: 88 },
    { id: 'rb',  x: 82, y: 68 }, { id: 'cb1', x: 62, y: 75 }, { id: 'cb2', x: 38, y: 75 }, { id: 'lb',  x: 18, y: 68 },
    { id: 'dm1', x: 40, y: 55 }, { id: 'dm2', x: 60, y: 55 },
    { id: 'rw',  x: 80, y: 32 }, { id: 'am',  x: 50, y: 38 }, { id: 'lw',  x: 20, y: 32 },
    { id: 'st',  x: 50, y: 15 }
  ],
  '4-3-3': [
    { id: 'gk', x: 50, y: 88 },
    { id: 'rb', x: 82, y: 68 }, { id: 'cb1', x: 62, y: 75 }, { id: 'cb2', x: 38, y: 75 }, { id: 'lb', x: 18, y: 68 },
    { id: 'm1', x: 50, y: 55 }, { id: 'm2', x: 75, y: 48 }, { id: 'm3', x: 25, y: 48 },
    { id: 'st', x: 50, y: 15 }, { id: 'rw', x: 80, y: 24 }, { id: 'lw', x: 20, y: 24 }
  ],
  '4-4-2': [
    { id: 'gk', x: 50, y: 88 },
    { id: 'rb', x: 82, y: 68 }, { id: 'cb1', x: 62, y: 75 }, { id: 'cb2', x: 38, y: 75 }, { id: 'lb', x: 18, y: 68 },
    { id: 'm1', x: 65, y: 50 }, { id: 'm2', x: 35, y: 50 }, { id: 'm3', x: 85, y: 45 }, { id: 'm4', x: 15, y: 45 },
    { id: 'st1', x: 60, y: 18 }, { id: 'st2', x: 40, y: 18 }
  ],
  '3-5-2': [
    { id: 'gk', x: 50, y: 88 },
    { id: 'cb1', x: 50, y: 75 }, { id: 'cb2', x: 75, y: 72 }, { id: 'cb3', x: 25, y: 72 },
    { id: 'm1', x: 50, y: 55 }, { id: 'm2', x: 72, y: 45 }, { id: 'm3', x: 28, y: 45 }, { id: 'm4', x: 88, y: 40 }, { id: 'm5', x: 12, y: 40 },
    { id: 'st1', x: 60, y: 18 }, { id: 'st2', x: 40, y: 18 }
  ]
};

type Player = typeof PLAYERS[0];
type Lineup = Record<string, Player | null>;

function PlayerCard({ player, size, isSelected, isCaptain, isHero, isField }: { player: Player, size: number, isSelected?: boolean, isCaptain?: boolean, isHero?: boolean, isField?: boolean }) {
  const bgPos = isField ? 'right' : 'left';
  return (
    <div className={`card-wrapper ${isSelected ? 'selected' : ''}`} style={{ width: size }}>
      <div className="card-box" style={{ height: size * 1.35, border: isSelected ? '2px solid #F5C400' : '1px solid #333' }}>
        <div className="player-img" style={{
          width: '100%', height: '100%',
          backgroundImage: `url(${player.foto})`,
          backgroundSize: 'cover',
          backgroundPosition: `${bgPos} top`
        }} />
        {isCaptain && <div className="badge cap">C</div>}
        {isHero && <div className="badge star">⭐</div>}
        <div className="card-info">
          <div className="pos">{player.pos}</div>
          <div className="name">{player.short}</div>
        </div>
      </div>
      <style jsx>{`
        .card-wrapper { position: relative; transition: transform 0.2s; flex-shrink: 0; margin: 0 auto; }
        .selected { transform: scale(1.08); z-index: 50; }
        .card-box { background: #111; border-radius: 4px; overflow: hidden; position: relative; width: 100%; box-shadow: 0 4px 10px rgba(0,0,0,0.5); }
        .badge { position: absolute; top: 2px; right: 2px; width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 900; z-index: 5; border: 1px solid #000; }
        .cap { background: #F5C400; color: #000; }
        .star { background: #fff; color: #000; }
        .card-info { position: absolute; bottom: 0; width: 100%; background: rgba(0,0,0,0.9); text-align: center; padding: 2px 0; border-top: 1px solid rgba(245,196,0,0.3); }
        .pos { color: #F5C400; font-size: 7px; font-weight: 900; line-height: 1; }
        .name { color: #fff; font-size: 9px; font-weight: 900; text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding: 0 1px; }
      `}</style>
    </div>
  );
}

export default function TigreFCEscalar({ jogoId = 3 }) {
  const [mounted, setMounted] = useState(false);
  const [formationKey, setFormationKey] = useState<keyof typeof FORMATIONS>('4-2-3-1');
  const [lineup, setLineup] = useState<Lineup>({});
  const [reserves, setReserves] = useState<(Player | null)[]>([null, null, null, null, null]);
  
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedReserveIndex, setSelectedReserveIndex] = useState<number | null>(null);
  const [specialMode, setSpecialMode] = useState<'captain' | 'hero' | null>(null);
  
  const [captain, setCaptain] = useState<number | null>(null);
  const [hero, setHero] = useState<number | null>(null);
  const [filterPos, setFilterPos] = useState<string>('TODOS');
  const [fieldWidth, setFieldWidth] = useState(360);

  useEffect(() => {
    setMounted(true);
    const updateSize = () => setFieldWidth(Math.min(window.innerWidth - 20, 450));
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const currentTitulares = Object.values(lineup).filter(Boolean) as Player[];
  const currentReserves = reserves.filter(Boolean) as Player[];
  const occupiedIds = [...currentTitulares.map(p => p.id), ...currentReserves.map(p => p.id)];
  
  const lineupCompleta = currentTitulares.length === 11;
  const isComplete = lineupCompleta && captain && hero;

  const handlePlayerClick = (p: Player) => {
    if (specialMode === 'captain') {
      setCaptain(p.id);
      setSpecialMode(null);
    } else if (specialMode === 'hero') {
      setHero(p.id);
      setSpecialMode(null);
    } else if (selectedSlot) {
      setLineup(prev => ({...prev, [selectedSlot]: p}));
      setSelectedSlot(null);
    } else if (selectedReserveIndex !== null) {
      const newReserves = [...reserves];
      newReserves[selectedReserveIndex] = p;
      setReserves(newReserves);
      setSelectedReserveIndex(null);
    }
  };

  if (!mounted) return null;

  return (
    <main className="container">
      <header className="header">TIGRE FC <span className="elite">ELITE 26</span></header>

      <div className="content">
        <div className="formation-selector">
          {(Object.keys(FORMATIONS) as Array<keyof typeof FORMATIONS>).map(f => (
            <button key={f} className={formationKey === f ? 'active' : ''} 
              onClick={() => { setFormationKey(f); setLineup({}); setReserves([null,null,null,null,null]); setCaptain(null); setHero(null); }}>
              {f}
            </button>
          ))}
        </div>

        {/* Campo Estilo Jorjão */}
        <div className="field" style={{ width: fieldWidth, height: fieldWidth * 1.35 }}>
          {/* Gramado Quadriculado */}
          <div className="grass-pattern"></div>
          
          <div className="pitch-markings">
            <div className="center-line"></div>
            <div className="center-circle"></div>
            <div className="area top"><div className="small-area"></div><div className="penalty-spot"></div><div className="area-arc"></div></div>
            <div className="area bottom"><div className="small-area"></div><div className="penalty-spot"></div><div className="area-arc"></div></div>
          </div>
          
          {FORMATIONS[formationKey].map(slot => {
            const p = lineup[slot.id];
            const isSel = selectedSlot === slot.id;
            return (
              <div key={slot.id} className="slot" onClick={() => { setSelectedSlot(isSel ? null : slot.id); setSelectedReserveIndex(null); setSpecialMode(null); }} style={{ left: `${slot.x}%`, top: `${slot.y}%` }}>
                {p ? (
                  <PlayerCard player={p} size={fieldWidth * 0.16} isSelected={isSel} isCaptain={captain === p.id} isHero={hero === p.id} isField />
                ) : (
                  <div className={`dot ${isSel ? 'active' : ''}`} style={{ width: fieldWidth * 0.11, height: fieldWidth * 0.11 }}>
                    <span className="plus">+</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Banco de Reservas */}
        <div className="reserves-container" style={{ width: fieldWidth }}>
          <div className="reserves-header">BANCO DE RESERVAS</div>
          <div className="reserves-row">
            {reserves.map((p, idx) => {
              const isSel = selectedReserveIndex === idx;
              return (
                <div key={idx} className="reserve-slot" onClick={() => { setSelectedReserveIndex(isSel ? null : idx); setSelectedSlot(null); setSpecialMode(null); }}>
                  {p ? (
                    <PlayerCard player={p} size={fieldWidth * 0.15} isSelected={isSel} />
                  ) : (
                    <div className={`dot-reserve ${isSel ? 'active' : ''}`}>+</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="market-section">
          <div className="market-sticky-header">
            <div className="special-selectors">
              <button 
                className={`spec-btn ${specialMode === 'captain' ? 'active' : ''} ${captain ? 'done' : ''} ${!captain && lineupCompleta ? 'glow-active' : ''}`} 
                onClick={() => { setSpecialMode('captain'); setSelectedSlot(null); setSelectedReserveIndex(null); }}
              >
                {captain ? "✅ CAPITÃO" : "CAPITÃO"}
              </button>
              <button 
                className={`spec-btn ${specialMode === 'hero' ? 'active' : ''} ${hero ? 'done' : ''} ${!hero && lineupCompleta ? 'glow-active' : ''}`} 
                onClick={() => { setSpecialMode('hero'); setSelectedSlot(null); setSelectedReserveIndex(null); }}
              >
                {hero ? "✅ HERÓI" : "HERÓI"}
              </button>
            </div>
            <div className="filters">
              {['TODOS', 'GOL', 'LAT', 'ZAG', 'MEI', 'ATA'].map(f => (
                <button key={f} className={filterPos === f ? 'f-active' : ''} onClick={() => setFilterPos(f)}>{f}</button>
              ))}
            </div>
          </div>

          <div className="players-grid">
            {(specialMode ? currentTitulares : PLAYERS.filter(p => !occupiedIds.includes(p.id)))
              .filter(p => filterPos === 'TODOS' || p.pos === filterPos)
              .map(p => (
              <div key={p.id} className="grid-item" onClick={() => handlePlayerClick(p)}>
                <PlayerCard player={p} size={(fieldWidth / 3) - 16} isCaptain={captain === p.id} isHero={hero === p.id} />
              </div>
            ))}
          </div>
        </div>
        
        <div className="dock">
          <button className="next-btn" disabled={!isComplete}>CONFIRMAR ESCALAÇÃO ➜</button>
        </div>
      </div>

      <style jsx global>{`
        body { background: #000; margin: 0; font-family: 'Inter', sans-serif; color: #fff; }
        .header { background: #F5C400; color: #000; text-align: center; padding: 15px; font-weight: 900; font-size: 20px; position: sticky; top: 0; z-index: 100; text-transform: uppercase; font-style: italic; }
        .content { display: flex; flex-direction: column; align-items: center; padding: 10px; max-width: 500px; margin: 0 auto; width: 100%; }
        
        /* Formação */
        .formation-selector { display: flex; gap: 4px; margin-bottom: 12px; background: #111; padding: 4px; border-radius: 8px; width: 100%; }
        .formation-selector button { flex: 1; padding: 8px; border: none; background: transparent; color: #555; font-weight: 800; font-size: 10px; border-radius: 6px; }
        .formation-selector button.active { background: #F5C400; color: #000; }

        /* Estilização do Campo Jorjão */
        .field { position: relative; background: #1a4a1a; border: 3px solid #333; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        
        /* Gramado Quadriculado (Checkerboard) */
        .grass-pattern {
          position: absolute;
          inset: 0;
          background-color: #2d5a27;
          background-image: 
            linear-gradient(90deg, rgba(255,255,255,0.03) 50%, transparent 50%),
            linear-gradient(rgba(255,255,255,0.03) 50%, transparent 50%);
          background-size: 20% 10%; /* Cria o aspecto de faixas horizontais e blocos */
        }

        .pitch-markings { position: absolute; inset: 0; pointer-events: none; border: 2px solid rgba(255,255,255,0.2); margin: 5px; }
        .center-line { position: absolute; top: 50%; width: 100%; height: 2px; background: rgba(255,255,255,0.2); }
        .center-circle { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 70px; height: 70px; border: 2px solid rgba(255,255,255,0.2); border-radius: 50%; }
        
        .area { position: absolute; left: 50%; transform: translateX(-50%); width: 50%; height: 18%; border: 2px solid rgba(255,255,255,0.2); }
        .area.top { top: 0; border-top: none; }
        .area.bottom { bottom: 0; border-bottom: none; }
        
        .small-area { position: absolute; left: 50%; transform: translateX(-50%); width: 40%; height: 35%; border: 2px solid rgba(255,255,255,0.15); }
        .area.top .small-area { top: 0; border-top: none; }
        .area.bottom .small-area { bottom: 0; border-bottom: none; }
        
        .penalty-spot { position: absolute; left: 50%; transform: translateX(-50%); width: 4px; height: 4px; background: rgba(255,255,255,0.4); border-radius: 50%; }
        .area.top .penalty-spot { bottom: 20%; }
        .area.bottom .penalty-spot { top: 20%; }

        .slot { position: absolute; transform: translate(-50%, -50%); cursor: pointer; z-index: 20; transition: all 0.2s ease; }
        .dot { border-radius: 50%; border: 2px dashed rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.3); backdrop-filter: blur(2px); }
        .dot.active { border-color: #F5C400; background: rgba(245,196,0,0.2); scale: 1.1; }
        .plus { color: rgba(255,255,255,0.4); font-size: 20px; font-weight: 300; }

        /* Reservas */
        .reserves-container { margin-top: 15px; background: #080808; padding: 12px; border-radius: 12px; border: 1px solid #111; }
        .reserves-header { font-size: 9px; font-weight: 900; color: #444; letter-spacing: 2px; text-align: center; margin-bottom: 10px; }
        .reserves-row { display: flex; justify-content: center; gap: 6px; }
        .dot-reserve { width: 45px; height: 60px; background: #111; border: 1px dashed #222; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #333; font-size: 16px; transition: all 0.2s; }
        .dot-reserve.active { border-color: #F5C400; background: #1a1a1a; color: #F5C400; }

        /* Mercado */
        .market-section { width: 100%; margin-top: 20px; background: #050505; padding-bottom: 120px; }
        .market-sticky-header { position: sticky; top: 55px; background: #000; z-index: 80; padding: 10px 0; border-bottom: 1px solid #111; }
        .special-selectors { display: flex; gap: 8px; margin-bottom: 10px; }
        .spec-btn { flex: 1; padding: 12px; border-radius: 8px; font-size: 10px; font-weight: 900; border: 1px solid #222; background: #111; color: #666; transition: 0.3s; }
        .spec-btn.active { border-color: #F5C400; color: #F5C400; background: rgba(245,196,0,0.05); }
        .spec-btn.done { border-color: #F5C400; background: #F5C400; color: #000; }
        
        .filters { display: flex; gap: 5px; overflow-x: auto; padding-bottom: 5px; scrollbar-width: none; }
        .filters::-webkit-scrollbar { display: none; }
        .filters button { padding: 6px 14px; border-radius: 20px; border: 1px solid #222; background: #111; color: #666; font-size: 9px; font-weight: 800; white-space: nowrap; }
        .filters button.f-active { background: #fff; color: #000; border-color: #fff; }
        
        .players-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 15px; }

        /* Rodapé */
        .dock { position: fixed; bottom: 0; left: 0; width: 100%; padding: 20px; background: linear-gradient(transparent, #000 40%); display: flex; justify-content: center; z-index: 150; }
        .next-btn { width: 100%; max-width: 400px; padding: 18px; background: #F5C400; color: #000; border-radius: 12px; font-weight: 900; border: none; font-size: 15px; box-shadow: 0 4px 15px rgba(245,196,0,0.2); cursor: pointer; }
        .next-btn:disabled { background: #222; color: #444; box-shadow: none; cursor: not-allowed; }

        @keyframes neon-glow {
          0%, 100% { box-shadow: 0 0 5px #F5C400; transform: scale(1); }
          50% { box-shadow: 0 0 15px #F5C400; transform: scale(1.02); }
        }
        .glow-active { animation: neon-glow 1.5s infinite; border-color: #F5C400 !important; color: #fff !important; }
      `}</style>
    </main>
  );
}
