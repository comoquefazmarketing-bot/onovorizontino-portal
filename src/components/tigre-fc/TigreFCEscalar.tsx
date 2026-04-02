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
  { id: 'gk',  label: 'GOL', x: 50, y: 92 },
  { id: 'rb',  label: 'LAT', x: 85, y: 75 },
  { id: 'cb1', label: 'ZAG', x: 63, y: 80 },
  { id: 'cb2', label: 'ZAG', x: 37, y: 80 },
  { id: 'lb',  label: 'LAT', x: 15, y: 75 },
  { id: 'dm1', label: 'VOL', x: 65, y: 60 },
  { id: 'dm2', label: 'VOL', x: 35, y: 60 },
  { id: 'am1', label: 'ATA', x: 80, y: 40 },
  { id: 'am2', label: 'MEI', x: 50, y: 45 },
  { id: 'am3', label: 'ATA', x: 20, y: 40 },
  { id: 'st',  label: 'ATA', x: 50, y: 18 },
];

type Player = typeof PLAYERS[0];
type Lineup = Record<string, Player | null>;

function PlayerCard({ player, size, isSelected, isCaptain, isHero, isField }: { player: Player, size: number, isSelected?: boolean, isCaptain?: boolean, isHero?: boolean, isField?: boolean }) {
  const bgPos = isField ? 'right' : 'left';
  return (
    <div className={`card-wrapper ${isSelected ? 'selected' : ''}`} style={{ width: size }}>
      <div className="card-box" style={{ height: size * 1.35, border: isSelected ? '3px solid #F5C400' : '1px solid #333' }}>
        <div className="player-img-bg" style={{ backgroundImage: `url(${player.foto})`, backgroundPosition: `${bgPos} top` }} />
        {isCaptain && <div className="badge cap">C</div>}
        {isHero && <div className="badge star">⭐</div>}
        <div className="card-info">
          <div className="pos">{player.pos}</div>
          <div className="name">{player.short}</div>
        </div>
      </div>
      <style jsx>{`
        .card-wrapper { position: relative; transition: transform 0.2s; flex-shrink: 0; }
        .card-box { background: #111; border-radius: 4px; overflow: hidden; position: relative; width: 100%; box-shadow: 0 4px 10px rgba(0,0,0,0.5); }
        .player-img-bg { width: 100%; height: 100%; background-size: cover; display: block; }
        .badge { position: absolute; top: 2px; right: 2px; width: 16px; height: 16px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 900; z-index: 5; border: 1px solid #000; }
        .cap { background: #F5C400; color: #000; }
        .star { background: #fff; color: #000; }
        .card-info { position: absolute; bottom: 0; width: 100%; background: rgba(0,0,0,0.9); text-align: center; padding: 2px 0; border-top: 1px solid rgba(245,196,0,0.3); }
        .pos { color: #F5C400; font-size: 7px; font-weight: 900; }
        .name { color: #fff; font-size: 9px; font-weight: 800; text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      `}</style>
    </div>
  );
}

export default function TigreFCEscalar({ jogoId = 3 }: { jogoId?: number }) {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<'escalar' | 'especiais' | 'palpite' | 'final'>('escalar');
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

  if (!mounted) return null;

  const usedIds = Object.values(lineup).filter(Boolean).map(p => p!.id);
  const isComplete = usedIds.length === 11;

  return (
    <main className="container">
      <header className="header">TIGRE FC <span>ELITE 26</span></header>

      {step === 'escalar' && (
        <div className="content">
          <div className={`alert ${selectedSlot ? 'highlight' : ''}`}>
            {selectedSlot ? "⚡ SELECIONE O JOGADOR NA LISTA ABAIXO" : "👉 TOQUE EM UM CÍRCULO (+) NO CAMPO"}
          </div>

          {/* CAMPO REALISTA COM DEMARCAÇÕES */}
          <div className="field-container" style={{ width: fieldWidth, height: fieldWidth * 1.35 }}>
            <div className="pitch-lines">
               <div className="center-circle"></div>
               <div className="center-line"></div>
               <div className="penalty-area top"></div>
               <div className="penalty-area bottom"></div>
            </div>
            {FORMATION_4231.map(slot => {
              const p = lineup[slot.id];
              const isSel = selectedSlot === slot.id;
              return (
                <div key={slot.id} className="slot" onClick={() => setSelectedSlot(isSel ? null : slot.id)} style={{ left: `${slot.x}%`, top: `${slot.y}%` }}>
                  {p ? (
                    <PlayerCard player={p} size={fieldWidth * 0.16} isSelected={isSel} isField />
                  ) : (
                    <div className={`dot ${isSel ? 'active' : ''}`} style={{ width: fieldWidth * 0.1, height: fieldWidth * 0.1 }}>+</div>
                  )}
                </div>
              );
            })}
          </div>

          {/* MERCADO GRID 3x3 */}
          <div className="market-box">
            <div className="market-header">MERCADO ELITE (JOGO {jogoId})</div>
            <div className="filters">
              {['TODOS', 'GOL', 'LAT', 'ZAG', 'MEI', 'ATA'].map(f => (
                <button key={f} className={filterPos === f ? 'f-active' : ''} onClick={() => setFilterPos(f)}>{f}</button>
              ))}
            </div>
            <div className="players-grid">
              {PLAYERS.filter(p => !usedIds.includes(p.id))
                      .filter(p => filterPos === 'TODOS' || p.pos === filterPos)
                      .map(p => (
                <div key={p.id} onClick={() => { if(selectedSlot) { setLineup(prev => ({ ...prev, [selectedSlot]: p })); setSelectedSlot(null); } }} 
                     style={{ opacity: selectedSlot ? 1 : 0.4 }}>
                  <PlayerCard player={p} size={(fieldWidth/3) - 12} />
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

      {step === 'especiais' && (
        <div className="content">
           <div className="alert highlight">🏆 ESCOLHA SEU CAPITÃO E HERÓI</div>
           <div className="especiais-list">
              {Object.values(lineup).map(p => p && (
                <div key={p.id} className="esp-card" onClick={() => {}}>
                  <PlayerCard player={p} size={60} isCaptain={captain === p.id} isHero={hero === p.id} isField />
                  <div className="esp-btns">
                    <button className={captain === p.id ? 'active' : ''} onClick={() => setCaptain(p.id)}>CAPITÃO</button>
                    <button className={hero === p.id ? 'active' : ''} onClick={() => setHero(p.id)}>HERÓI</button>
                  </div>
                </div>
              ))}
           </div>
           <div className="dock">
             <button className="next-btn" disabled={!captain || !hero} onClick={() => setStep('palpite')}>DEFINIR PLACAR ➜</button>
           </div>
        </div>
      )}

      {step === 'palpite' && (
        <div className="content">
          <div className="palpite-box">
             <h3>QUAL SEU PALPITE?</h3>
             <div className="score-row">
                <div className="team">
                   <img src="/logo-tigre.png" alt="Tigre" />
                   <span>TIGRE</span>
                </div>
                <input type="number" value={palpite.home} onChange={e => setPalpite({...palpite, home: parseInt(e.target.value)||0})} />
                <span className="vs">X</span>
                <input type="number" value={palpite.away} onChange={e => setPalpite({...palpite, away: parseInt(e.target.value)||0})} />
                <div className="team">
                   <div className="adv-placeholder">?</div>
                   <span>ADV</span>
                </div>
             </div>
             <button className="next-btn" onClick={() => setStep('final')}>FINALIZAR TIME 🐯</button>
          </div>
        </div>
      )}

      <style jsx global>{`
        body { background: #000; margin: 0; font-family: sans-serif; }
        .container { min-height: 100vh; color: #fff; padding-bottom: 100px; }
        .header { background: #F5C400; color: #000; text-align: center; padding: 15px; font-weight: 900; position: sticky; top: 0; z-index: 100; }
        
        /* CAMPO REALISTA */
        .field-container { position: relative; background: #1a4a1a; border: 4px solid #fff; border-radius: 8px; margin: 10px auto; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.8); }
        .pitch-lines { position: absolute; inset: 0; pointer-events: none; }
        .center-line { position: absolute; top: 50%; left: 0; width: 100%; height: 2px; background: rgba(255,255,255,0.5); }
        .center-circle { position: absolute; top: 50%; left: 50%; width: 80px; height: 80px; border: 2px solid rgba(255,255,255,0.5); border-radius: 50%; transform: translate(-50%, -50%); }
        .penalty-area { position: absolute; left: 50%; width: 60%; height: 15%; border: 2px solid rgba(255,255,255,0.5); transform: translateX(-50%); }
        .top { top: -2px; border-top: none; }
        .bottom { bottom: -2px; border-bottom: none; }

        .slot { position: absolute; transform: translate(-50%, -50%); cursor: pointer; z-index: 20; }
        .dot { border-radius: 50%; border: 2px dashed #fff; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.3); color: #fff; font-weight: bold; }
        .dot.active { border-color: #F5C400; background: rgba(245,196,0,0.2); transform: scale(1.2); }

        .market-box { width: 100%; padding: 10px; }
        .players-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; padding: 10px 0; }
        .filters { display: flex; gap: 5px; overflow-x: auto; padding-bottom: 10px; }
        .filters button { background: #222; border: 1px solid #333; color: #888; padding: 6px 12px; border-radius: 4px; font-size: 10px; font-weight: 800; }
        .filters button.f-active { background: #F5C400; color: #000; }

        .especiais-list { display: flex; flex-direction: column; gap: 10px; width: 100%; padding: 10px; }
        .esp-card { background: #111; padding: 10px; border-radius: 8px; display: flex; align-items: center; gap: 15px; border: 1px solid #333; }
        .esp-btns { display: flex; gap: 5px; flex: 1; }
        .esp-btns button { flex: 1; padding: 8px; font-size: 10px; font-weight: 900; background: #222; color: #fff; border: 1px solid #444; border-radius: 4px; }
        .esp-btns button.active { background: #F5C400; color: #000; }

        .palpite-box { background: #111; padding: 30px 20px; border-radius: 12px; width: 90%; text-align: center; border: 1px solid #F5C400; }
        .score-row { display: flex; align-items: center; justify-content: center; gap: 15px; margin: 20px 0; }
        .score-row input { width: 60px; height: 60px; text-align: center; font-size: 24px; font-weight: 900; background: #000; border: 2px solid #F5C400; color: #fff; border-radius: 8px; }
        .vs { font-weight: 900; color: #F5C400; }

        .dock { position: fixed; bottom: 0; left: 0; width: 100%; padding: 20px; background: linear-gradient(transparent, #000 50%); z-index: 200; }
        .next-btn { width: 100%; padding: 18px; background: #F5C400; color: #000; border: none; border-radius: 8px; font-weight: 900; font-size: 16px; }
      `}</style>
    </main>
  );
}
