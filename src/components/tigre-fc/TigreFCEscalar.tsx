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
  const bgPos = isField ? 'right' : 'left';
  return (
    <div className={`card-wrapper ${isSelected ? 'selected' : ''}`} style={{ width: size }}>
      <div className="card-box" style={{ height: size * 1.35, border: isSelected ? '2px solid #F5C400' : '1px solid #333' }}>
        <div style={{
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
        .card-box { background: #111; border-radius: 4px; overflow: hidden; position: relative; width: 100%; box-shadow: 0 4px 10px rgba(0,0,0,0.5); }
        .badge { position: absolute; top: 2px; right: 2px; width: 16px; height: 16px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 900; z-index: 5; border: 1px solid #000; }
        .cap { background: #F5C400; color: #000; }
        .star { background: #fff; color: #000; }
        .card-info { position: absolute; bottom: 0; width: 100%; background: rgba(0,0,0,0.9); text-align: center; padding: 2px 0; border-top: 1px solid rgba(245,196,0,0.4); }
        .pos { color: #F5C400; font-size: 7px; font-weight: 900; line-height: 1; }
        .name { color: #fff; font-size: 9px; font-weight: 900; text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding: 0 1px; }
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
    const updateSize = () => setFieldWidth(Math.min(window.innerWidth - 20, 450));
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
            {selectedSlot ? "⚡ SELECIONE O ATLETA" : "👉 TOQUE NO (+) PARA ESCALAR"}
          </div>

          {/* CAMPO REALISTA COM DEMARCAÇÕES */}
          <div className="field" style={{ width: fieldWidth, height: fieldWidth * 1.35 }}>
            <div className="pitch-markings">
              <div className="center-line"></div>
              <div className="center-circle"></div>
              <div className="area top"></div>
              <div className="area bottom"></div>
              <div className="goal top"></div>
              <div className="goal bottom"></div>
            </div>
            {FORMATION_4231.map(slot => {
              const p = lineup[slot.id];
              const isSel = selectedSlot === slot.id;
              return (
                <div key={slot.id} className="slot" onClick={() => setSelectedSlot(isSel ? null : slot.id)} style={{ left: `${slot.x}%`, top: `${slot.y}%`, zIndex: isSel ? 50 : 10 }}>
                  {p ? (
                    <PlayerCard player={p} size={fieldWidth * 0.16} isSelected={isSel} isField />
                  ) : (
                    <div className={`dot ${isSel ? 'active' : ''}`} style={{ width: fieldWidth * 0.1, height: fieldWidth * 0.1 }}>+</div>
                  )}
                </div>
              );
            })}
          </div>

          {/* MERCADO JUSTINHO ABAIXO DO CAMPO */}
          <div className="market-section">
            <div className="market-header">
              <div className="filters">
                {['TODOS', 'GOL', 'LAT', 'ZAG', 'MEI', 'ATA'].map(f => (
                  <button key={f} className={filterPos === f ? 'f-active' : ''} onClick={() => setFilterPos(f)}>{f}</button>
                ))}
              </div>
            </div>

            <div className="players-grid">
              {PLAYERS.filter(p => !usedIds.includes(p.id))
                      .filter(p => filterPos === 'TODOS' || p.pos === filterPos)
                      .map(p => (
                <div key={p.id} className="grid-item" onClick={() => { if(selectedSlot) { setLineup(prev => ({ ...prev, [selectedSlot]: p })); setSelectedSlot(null); } }} 
                     style={{ opacity: selectedSlot ? 1 : 0.4 }}>
                  <PlayerCard player={p} size={(fieldWidth / 3) - 8} />
                </div>
              ))}
            </div>
          </div>

          <div className="dock">
            <button className="next-btn" disabled={!isComplete} onClick={() => setStep('especiais')}>
              {isComplete ? "PRÓXIMO PASSO ➜" : `ESCALADOS: ${usedIds.length}/11`}
            </button>
          </div>
        </div>
      )}

      {step === 'especiais' && (
        <div className="content">
           <div className="alert highlight">🏆 CAPITÃO E HERÓI</div>
           <div className="especiais-list">
              {Object.values(lineup).map(p => p && (
                <div key={p.id} className="esp-row">
                   <PlayerCard player={p} size={60} isCaptain={captain === p.id} isHero={hero === p.id} isField />
                   <div className="esp-actions">
                      <button className={captain === p.id ? 'active cap' : ''} onClick={() => setCaptain(p.id)}>CAPITÃO</button>
                      <button className={hero === p.id ? 'active star' : ''} onClick={() => setHero(p.id)}>HERÓI</button>
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
          <div className="alert highlight">🎯 PLACAR DO JOGO</div>
          <div className="palpite-box">
            <div className="p-row">
              <div className="p-team">🐯<span>TIGRE</span></div>
              <input type="number" value={palpite.home} onChange={e => setPalpite({...palpite, home: parseInt(e.target.value)||0})} />
              <span className="p-vs">X</span>
              <input type="number" value={palpite.away} onChange={e => setPalpite({...palpite, away: parseInt(e.target.value)||0})} />
              <div className="p-team">⚽<span>ADV</span></div>
            </div>
          </div>
          <div className="dock">
            <button className="next-btn" onClick={() => setStep('compartilhar')}>FINALIZAR TUDO ➜</button>
          </div>
        </div>
      )}

      <style jsx global>{`
        body { background: #000; margin: 0; font-family: sans-serif; }
        .container { min-height: 100vh; color: #fff; padding-bottom: 120px; }
        .header { background: #F5C400; color: #000; text-align: center; padding: 12px; font-weight: 900; font-size: 18px; position: sticky; top: 0; z-index: 100; }
        .header span { opacity: 0.6; font-size: 12px; }
        .content { display: flex; flex-direction: column; align-items: center; width: 100%; max-width: 500px; margin: 0 auto; padding: 10px; }
        
        .alert { background: #111; color: #888; width: 100%; text-align: center; padding: 10px; font-weight: 800; font-size: 11px; border-radius: 4px; margin-bottom: 8px; border: 1px solid #222; }
        .alert.highlight { background: #F5C400; color: #000; border-color: #F5C400; }

        /* CAMPO COM DEMARCAÇÕES */
        .field { 
          position: relative; 
          background: #1a4a1a; 
          background-image: repeating-linear-gradient(0deg, #1a4a1a, #1a4a1a 10%, #1e531e 10%, #1e531e 20%);
          border: 2px solid #fff; 
          border-radius: 4px; 
          overflow: hidden;
          margin-bottom: 5px; /* Deixa colado no mercado */
        }
        .pitch-markings { position: absolute; inset: 0; pointer-events: none; opacity: 0.4; }
        .center-line { position: absolute; top: 50%; width: 100%; height: 2px; background: #fff; }
        .center-circle { position: absolute; top: 50%; left: 50%; width: 60px; height: 60px; border: 2px solid #fff; border-radius: 50%; transform: translate(-50%, -50%); }
        .area { position: absolute; left: 50%; width: 50%; height: 12%; border: 2px solid #fff; transform: translateX(-50%); }
        .area.top { top: 0; border-top: none; }
        .area.bottom { bottom: 0; border-bottom: none; }
        
        .slot { position: absolute; transform: translate(-50%, -50%); cursor: pointer; }
        .dot { border-radius: 50%; border: 1px dashed #fff; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.3); color: #fff; font-size: 14px; }
        .dot.active { border-color: #F5C400; background: rgba(245,196,0,0.2); }

        /* MERCADO GRID 3x3 JUSTINHO */
        .market-section { width: 100%; background: #080808; border-radius: 8px; padding: 5px; }
        .filters { display: flex; gap: 4px; overflow-x: auto; padding-bottom: 8px; scrollbar-width: none; }
        .filters button { background: #151515; border: 1px solid #222; color: #666; padding: 6px 10px; border-radius: 4px; font-size: 9px; font-weight: 800; }
        .filters button.f-active { background: #F5C400; color: #000; }

        .players-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
        .grid-item { display: flex; justify-content: center; }

        /* ESPECIAIS E PALPITE */
        .especiais-list { width: 100%; display: flex; flex-direction: column; gap: 8px; }
        .esp-row { background: #111; padding: 8px; border-radius: 6px; display: flex; align-items: center; gap: 10px; border: 1px solid #222; }
        .esp-actions { display: flex; gap: 6px; flex: 1; }
        .esp-actions button { flex: 1; padding: 10px; border-radius: 4px; border: 1px solid #333; background: #1a1a1a; color: #fff; font-weight: 900; font-size: 9px; }
        .esp-actions button.active.cap { background: #F5C400; color: #000; }
        .esp-actions button.active.star { background: #fff; color: #000; }

        .palpite-box { background: #111; padding: 20px; border-radius: 10px; width: 100%; border: 1px solid #222; }
        .p-row { display: flex; align-items: center; justify-content: center; gap: 10px; }
        .p-team { display: flex; flex-direction: column; align-items: center; font-size: 9px; font-weight: 900; color: #888; }
        .p-row input { width: 50px; height: 50px; background: #000; border: 2px solid #333; border-radius: 6px; color: #F5C400; text-align: center; font-size: 24px; font-weight: 900; }
        .p-vs { font-weight: 900; color: #333; }

        .dock { position: fixed; bottom: 0; left: 0; width: 100%; padding: 15px; background: linear-gradient(transparent, #000 40%); z-index: 200; display: flex; justify-content: center; }
        .next-btn { width: 100%; max-width: 400px; padding: 15px; background: #F5C400; color: #000; border: none; border-radius: 8px; font-weight: 900; font-size: 14px; }
        .next-btn:disabled { background: #222; color: #444; }
      `}</style>
    </main>
  );
}
