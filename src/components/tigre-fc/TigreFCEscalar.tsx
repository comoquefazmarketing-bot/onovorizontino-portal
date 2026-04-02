'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  }
);

const BASE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';

const PLAYERS = [
  { id: 1,  name: 'César Augusto',   short: 'César',      num: 31, pos: 'GOL', foto: BASE+'CESAR-AUGUSTO.jpg.webp' },
  { id: 2,  name: 'Jordi',             short: 'Jordi',      num: 93, pos: 'GOL', foto: BASE+'JORDI.jpg.webp' },
  { id: 3,  name: 'João Scapin',       short: 'Scapin',      num: 12, pos: 'GOL', foto: BASE+'JOAO-SCAPIN.jpg.webp' },
  { id: 4,  name: 'Lucas Ribeiro',     short: 'Lucas',      num: 1,  pos: 'GOL', foto: BASE+'LUCAS-RIBEIRO.jpg.webp' },
  { id: 5,  name: 'Lora',              short: 'Lora',         num: 2,  pos: 'LAT', foto: BASE+'LORA.jpg.webp' },
  { id: 6,  name: 'Castrillón',        short: 'Castrillón', num: 6,  pos: 'LAT', foto: BASE+'CASTRILLON.jpg.webp' },
  { id: 7,  name: 'Arthur Barbosa',    short: 'A.Barbosa',  num: 22, pos: 'LAT', foto: BASE+'ARTHUR-BARBOSA.jpg.webp' },
  { id: 8,  name: 'Sander',            short: 'Sander',     num: 33, pos: 'LAT', foto: BASE+'SANDER.jpg.webp' },
  { id: 9,  name: 'Maykon Jesus',      short: 'Maykon',      num: 27, pos: 'LAT', foto: BASE+'MAYKON-JESUS.jpg.webp' },
  { id: 10, name: 'Dantas',            short: 'Dantas',      num: 3,  pos: 'ZAG', foto: BASE+'DANTAAS.jpg.webp' },
  { id: 11, name: 'Eduardo Brock',     short: 'E.Brock',     num: 5,  pos: 'ZAG', foto: BASE+'EDUARDO-BROCK.jpg.webp' },
  { id: 12, name: 'Patrick',           short: 'Patrick',     num: 4,  pos: 'ZAG', foto: BASE+'PATRICK.jpg.webp' },
  { id: 13, name: 'Gabriel Bahia',     short: 'G.Bahia',     num: 14, pos: 'ZAG', foto: BASE+'GABRIEL-BAHIA.jpg.webp' },
  { id: 14, name: 'Carlinhos',         short: 'Carlinhos',   num: 25, pos: 'ZAG', foto: BASE+'CARLINHOS.jpg.webp' },
  { id: 15, name: 'Alemão',            short: 'Alemão',      num: 28, pos: 'ZAG', foto: BASE+'ALEMAO.jpg.webp' },
  { id: 16, name: 'Renato Palm',       short: 'R.Palm',      num: 24, pos: 'ZAG', foto: BASE+'RENATO-PALM.jpg.webp' },
  { id: 17, name: 'Alvariño',          short: 'Alvariño',    num: 35, pos: 'ZAG', foto: BASE+'IVAN-ALVARINO.jpg.webp' },
  { id: 18, name: 'Bruno Santana',     short: 'B.Santana',   num: 33, pos: 'ZAG', foto: BASE+'BRUNO-SANTANA.jpg.webp' },
  { id: 19, name: 'Luís Oyama',         short: 'Oyama',         num: 8,  pos: 'MEI', foto: BASE+'LUIS-OYAMA.jpg.webp' },
  { id: 20, name: 'Léo Naldi',         short: 'L.Naldi',     num: 7,  pos: 'MEI', foto: BASE+'LEO-NALDI.jpg.webp' },
  { id: 21, name: 'Rômulo',            short: 'Rômulo',      num: 10, pos: 'MEI', foto: BASE+'ROMULO.jpg.webp' },
  { id: 22, name: 'Matheus Bianqui',  short: 'Bianqui',     num: 11, pos: 'MEI', foto: BASE+'MATHEUS-BIANQUI.jpg.webp' },
  { id: 23, name: 'Juninho',           short: 'Juninho',     num: 20, pos: 'MEI', foto: BASE+'JUNINHO.jpg.webp' },
  { id: 24, name: 'Tavinho',           short: 'Tavinho',     num: 17, pos: 'MEI', foto: BASE+'TAVINHO.jpg.webp' },
  { id: 25, name: 'Diego Galo',         short: 'D.Galo',      num: 29, pos: 'MEI', foto: BASE+'DIEGO-GALO.jpg.webp' },
  { id: 26, name: 'Marlon',            short: 'Marlon',      num: 30, pos: 'MEI', foto: BASE+'MARLON.jpg.webp' },
  { id: 27, name: 'Hector Bianchi',    short: 'Hector',      num: 16, pos: 'MEI', foto: BASE+'HECTOR-BIACHI.jpg.webp' },
  { id: 28, name: 'Nogueira',          short: 'Nogueira',    num: 36, pos: 'MEI', foto: BASE+'NOGUEIRA.jpg.webp' },
  { id: 29, name: 'Luiz Gabriel',      short: 'L.Gabriel',   num: 37, pos: 'MEI', foto: BASE+'LUIZ-GABRIEL.jpg.webp' },
  { id: 30, name: 'Jhones Kauê',       short: 'J.Kauê',      num: 50, pos: 'MEI', foto: BASE+'JHONES-KAUE.jpg.webp' },
  { id: 31, name: 'Robson',            short: 'Robson',      num: 9,  pos: 'ATA', foto: BASE+'ROBSON.jpg.webp' },
  { id: 32, name: 'Vinícius Paiva',    short: 'V.Paiva',     num: 13, pos: 'ATA', foto: BASE+'VINICIUS-PAIVA.jpg.webp' },
  { id: 33, name: 'Hélio Borges',      short: 'H.Borges',    num: 18, pos: 'ATA', foto: BASE+'HELIO-BORGES.jpg.webp' },
  { id: 34, name: 'Jardiel',           short: 'Jardiel',     num: 19, pos: 'ATA', foto: BASE+'JARDIEL.jpg.webp' },
  { id: 35, name: 'Nicolas Careca',    short: 'N.Careca',    num: 21, pos: 'ATA', foto: BASE+'NICOLAS-CARECA.jpg.webp' },
  { id: 36, name: 'Titi Ortiz',        short: 'T.Ortiz',     num: 15, pos: 'ATA', foto: BASE+'TITI-ORTIZ.jpg.webp' },
  { id: 37, name: 'Diego Mathias',     short: 'D.Mathias',   num: 41, pos: 'ATA', foto: BASE+'DIEGO-MATHIAS.jpg.webp' },
  { id: 38, name: 'Carlão',            short: 'Carlão',      num: 90, pos: 'ATA', foto: BASE+'CARLAO.jpg.webp' },
  { id: 39, name: 'Ronald Barcellos', short: 'Ronald',      num: 23, pos: 'ATA', foto: BASE+'RONALD-BARCELLOS.jpg.webp' },
];

const FORMATION_4231 = [
  { id: 'gk',  label: 'GOL', x: 50, y: 90 },
  { id: 'rb',  label: 'LAT', x: 88, y: 72 },
  { id: 'cb1', label: 'ZAG', x: 65, y: 77 },
  { id: 'cb2', label: 'ZAG', x: 35, y: 77 },
  { id: 'lb',  label: 'LAT', x: 12, y: 72 },
  { id: 'dm1', label: 'VOL', x: 68, y: 58 },
  { id: 'dm2', label: 'VOL', x: 32, y: 58 },
  { id: 'am1', label: 'ATA', x: 85, y: 38 },
  { id: 'am2', label: 'MEI', x: 50, y: 40 },
  { id: 'am3', label: 'ATA', x: 15, y: 38 },
  { id: 'st',  label: 'ATA', x: 50, y: 15 },
];

type Player = typeof PLAYERS[0];
type Lineup = Record<string, Player | null>;

function PlayerCard({ player, size, isSelected, isCaptain, isHero, isField }: { player: Player, size: number, isSelected?: boolean, isCaptain?: boolean, isHero?: boolean, isField?: boolean }) {
  return (
    <div className={`card-wrapper ${isSelected ? 'selected' : ''}`} style={{ width: size }}>
      <div className="card-box" style={{ height: size * 1.35, border: isSelected ? '3px solid #F5C400' : '1px solid #333' }}>
        <img src={player.foto} alt={player.short} className="player-img" />
        {isCaptain && <div className="badge cap">C</div>}
        {isHero && <div className="badge star">⭐</div>}
        <div className="card-info">
          <div className="pos">{player.pos}</div>
          <div className="name">{player.short}</div>
        </div>
      </div>
      <style jsx>{`
        .card-wrapper { position: relative; transition: transform 0.2s; flex-shrink: 0; }
        .selected { transform: scale(1.05); z-index: 10; }
        .card-box { background: #111; border-radius: 6px; overflow: hidden; position: relative; width: 100%; box-shadow: 0 4px 10px rgba(0,0,0,0.5); }
        .player-img { width: 100%; height: 100%; object-fit: cover; object-position: center top; display: block; }
        .badge { position: absolute; top: 4px; right: 4px; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 900; z-index: 5; border: 1px solid #000; }
        .cap { background: #F5C400; color: #000; }
        .star { background: #fff; color: #000; }
        .card-info { position: absolute; bottom: 0; width: 100%; background: rgba(0,0,0,0.85); text-align: center; padding: 2px 0; border-top: 1px solid rgba(245,196,0,0.4); }
        .pos { color: #F5C400; font-size: 8px; font-weight: 900; }
        .name { color: #fff; font-size: 10px; font-weight: 900; text-transform: uppercase; white-space: nowrap; overflow: hidden; }
      `}</style>
    </div>
  );
}

export default function TigreFCEscalar({ jogoId = 3 }: { jogoId?: number }) {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<'escalar' | 'especiais' | 'palpite' | 'compartilhar'>('escalar');
  const [lineup, setLineup] = useState<Lineup>({});
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [captain, setCaptain] = useState<number | null>(null);
  const [hero, setHero] = useState<number | null>(null);
  const [palpite, setPalpite] = useState({ home: 0, away: 0 });
  const [filterPos, setFilterPos] = useState<string>('TODOS');
  const [fieldWidth, setFieldWidth] = useState(360);

  useEffect(() => {
    setMounted(true);
    const updateSize = () => setFieldWidth(Math.min(window.innerWidth - 32, 450));
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handleSlotClick = (slotId: string) => {
    if (selectedSlot === slotId) {
      setSelectedSlot(null);
    } else {
      setSelectedSlot(slotId);
    }
  };

  const selectFromMarket = (player: Player) => {
    if (selectedSlot) {
      setLineup(prev => ({ ...prev, [selectedSlot]: player }));
      setSelectedSlot(null);
    }
  };

  if (!mounted) return null;

  const usedIds = Object.values(lineup).filter(Boolean).map(p => p!.id);
  const isComplete = usedIds.length === 11;

  return (
    <main className="container">
      <header className="header">TIGRE FC <span>ELITE 26</span></header>

      {step === 'escalar' && (
        <div className="content">
          <div className="alert">
            {selectedSlot ? "⚡ TOQUE NO JOGADOR ABAIXO PARA ESCALAR" : "👉 TOQUE EM UM CÍRCULO (+) NO CAMPO"}
          </div>

          <div className="field" style={{ width: fieldWidth, height: fieldWidth * 1.4 }}>
            {FORMATION_4231.map(slot => {
              const p = lineup[slot.id];
              const isSel = selectedSlot === slot.id;
              return (
                <div key={slot.id} className="slot" onClick={() => handleSlotClick(slot.id)} style={{ left: `${slot.x}%`, top: `${slot.y}%` }}>
                  {p ? (
                    <PlayerCard player={p} size={fieldWidth * 0.17} isSelected={isSel} isField />
                  ) : (
                    <div className={`dot ${isSel ? 'active' : ''}`} style={{ width: fieldWidth * 0.12, height: fieldWidth * 0.12 }}>+</div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="market-box">
            <div className="market-header">MERCADO ELITE (JOGO {jogoId})</div>
            <div className="filters">
              {['TODOS', 'GOL', 'LAT', 'ZAG', 'MEI', 'ATA'].map(f => (
                <button key={f} className={filterPos === f ? 'f-active' : ''} onClick={() => setFilterPos(f)}>{f}</button>
              ))}
            </div>
            {/* CORREÇÃO DO LAYOUT: Overflow horizontal para não cortar fotos */}
            <div className="market-scroll">
              {PLAYERS.filter(p => !usedIds.includes(p.id))
                      .filter(p => filterPos === 'TODOS' || p.pos === filterPos)
                      .map(p => (
                <div key={p.id} onClick={() => selectFromMarket(p)} style={{ opacity: selectedSlot ? 1 : 0.4 }}>
                  <PlayerCard player={p} size={85} />
                </div>
              ))}
            </div>
          </div>

          <div className="dock">
            <button className="next-btn" disabled={!isComplete} onClick={() => setStep('especiais')}>
              {isComplete ? "DEFINIR LÍDERES ➜" : `FALTAM ${11 - usedIds.length} JOGADORES`}
            </button>
          </div>
        </div>
      )}

      {/* OS PRÓXIMOS PASSOS SEGUEM A LÓGICA DE CAPITÃO, PLACAR E COMPARTILHAR */}
      {/* ... (especiais, palpite, compartilhar) ... */}

      <style jsx global>{`
        body { background: #000; margin: 0; font-family: sans-serif; overflow-x: hidden; }
        .container { min-height: 100vh; color: #fff; padding-bottom: 100px; }
        .header { background: #F5C400; color: #000; text-align: center; padding: 15px; font-weight: 900; font-size: 20px; position: sticky; top: 0; z-index: 100; }
        .header span { opacity: 0.7; font-weight: 400; }
        .content { display: flex; flex-direction: column; align-items: center; padding: 10px; }
        .alert { background: #1a1a1a; color: #F5C400; width: 100%; text-align: center; padding: 12px; font-weight: 800; font-size: 11px; border-radius: 4px; margin-bottom: 10px; border: 1px solid #333; }
        .field { position: relative; background: #133313; border: 3px solid #1a4a1a; border-radius: 12px; overflow: hidden; box-shadow: inset 0 0 60px #000; }
        .slot { position: absolute; transform: translate(-50%, -50%); cursor: pointer; }
        .dot { border-radius: 50%; border: 2px dashed rgba(255,255,255,0.3); display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.05); color: #fff; font-weight: bold; }
        .dot.active { border-color: #F5C400; background: rgba(245,196,0,0.2); box-shadow: 0 0 15px #F5C400; }
        
        .market-box { width: 100%; margin-top: 15px; }
        .market-header { color: #F5C400; font-size: 12px; font-weight: 900; text-align: center; margin-bottom: 10px; }
        .filters { display: flex; gap: 5px; overflow-x: auto; padding-bottom: 10px; justify-content: center; }
        .filters button { background: #222; border: 1px solid #333; color: #888; padding: 6px 12px; border-radius: 4px; font-size: 10px; font-weight: 800; }
        .filters button.f-active { background: #F5C400; color: #000; }
        
        /* O SEGREDO DO LAYOUT ESTÁ AQUI */
        .market-scroll { 
          display: flex; 
          gap: 12px; 
          overflow-x: auto; 
          padding: 10px 16px 20px 16px; 
          scrollbar-width: none; /* Firefox */
        }
        .market-scroll::-webkit-scrollbar { display: none; } /* Chrome/Safari */

        .dock { position: fixed; bottom: 0; left: 0; width: 100%; padding: 20px; background: linear-gradient(transparent, #000 50%); z-index: 200; }
        .next-btn { width: 100%; padding: 18px; background: #F5C400; color: #000; border: none; border-radius: 8px; font-weight: 900; font-size: 16px; box-shadow: 0 4px 20px rgba(245,196,0,0.3); }
        .next-btn:disabled { background: #333; color: #666; box-shadow: none; }
      `}</style>
    </main>
  );
}
