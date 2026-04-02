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

function PlayerCard({ player, size, isField, isSelected, isCaptain, isHero }: { player: Player, size: number, isField?: boolean, isSelected?: boolean, isCaptain?: boolean, isHero?: boolean }) {
  if (!player) return null;
  return (
    <div className={`player-card ${isSelected ? 'selected' : ''}`} style={{ width: size }}>
      <div className="card-inner" style={{ height: size * 1.35, border: isSelected ? '3px solid #F5C400' : '1px solid rgba(255,255,255,0.1)' }}>
        <div className="photo" style={{ backgroundImage: `url(${player.foto})` }} />
        {isCaptain && <div className="badge cap">C</div>}
        {isHero && <div className="badge star">⭐</div>}
        <div className="info">
          <span className="pos-label">{player.pos}</span>
          <span className="name-label">{player.short}</span>
        </div>
      </div>
      <style jsx>{`
        .player-card { position: relative; transition: 0.3s; }
        .selected { transform: translateY(-10px) scale(1.1); z-index: 100; }
        .card-inner { background: #111; border-radius: 6px; overflow: hidden; position: relative; box-shadow: 0 4px 15px rgba(0,0,0,0.5); }
        .photo { width: 100%; height: 100%; background-size: cover; background-position: center top; }
        .badge { position: absolute; top: 4px; right: 4px; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 900; border: 1px solid #000; z-index: 5; }
        .cap { background: #F5C400; color: #000; }
        .star { background: #fff; color: #000; }
        .info { position: absolute; bottom: 0; width: 100%; background: rgba(0,0,0,0.85); text-align: center; padding: 2px 0; border-top: 1px solid #F5C400; }
        .pos-label { display: block; color: #F5C400; font-size: 8px; font-weight: 900; }
        .name-label { display: block; color: #fff; font-size: 10px; font-weight: 800; text-transform: uppercase; white-space: nowrap; overflow: hidden; }
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
  const [fieldWidth, setFieldWidth] = useState(360);
  const [filterPos, setFilterPos] = useState<string>('TODOS');

  useEffect(() => {
    setMounted(true);
    const update = () => setFieldWidth(Math.min(window.innerWidth - 20, 450));
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const handleSlotClick = (slotId: string) => {
    if (selectedSlot) {
      if (selectedSlot === slotId) {
        setSelectedSlot(null);
        return;
      }
      // Logica de troca/movimentação (funciona para slots vazios também)
      const p1 = lineup[selectedSlot];
      const p2 = lineup[slotId];
      setLineup(prev => ({ ...prev, [selectedSlot]: p2 || null, [slotId]: p1 || null }));
      setSelectedSlot(null);
    } else {
      setSelectedSlot(slotId);
    }
  };

  const selectMarketPlayer = (player: Player) => {
    if (selectedSlot) {
      setLineup(prev => ({ ...prev, [selectedSlot]: player }));
      setSelectedSlot(null);
    }
  };

  if (!mounted) return null;

  const usedIds = Object.values(lineup).filter(Boolean).map(p => p!.id);
  const allSet = usedIds.length === 11;

  return (
    <main className="app-container">
      <header className="main-header">
        TIGRE FC ELITE 26
      </header>

      {step === 'escalar' && (
        <div className="step-content">
          <div className="big-instruction">
            {selectedSlot ? "⚡ AGORA CLIQUE ONDE QUER COLOCAR O JOGADOR" : "👉 CLIQUE EM UM CÍRCULO (+) OU EM UM JOGADOR"}
          </div>

          <div className="field-area" style={{ width: fieldWidth, height: fieldWidth * 1.4 }}>
            {FORMATION_4231.map(slot => {
              const p = lineup[slot.id];
              const isSel = selectedSlot === slot.id;
              return (
                <div key={slot.id} className="slot-position" 
                     onClick={() => handleSlotClick(slot.id)}
                     style={{ left: `${slot.x}%`, top: `${slot.y}%` }}>
                  {p ? (
                    <PlayerCard player={p} size={fieldWidth * 0.17} isSelected={isSel} />
                  ) : (
                    <div className={`empty-dot ${isSel ? 'active' : ''}`} style={{ width: fieldWidth * 0.12, height: fieldWidth * 0.12 }}>
                      <span>+</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="market-section">
            <h2 className="market-title">MERCADO ELITE (JOGO {jogoId})</h2>
            <div className="filter-bar">
              {['TODOS', 'GOL', 'LAT', 'ZAG', 'MEI', 'ATA'].map(f => (
                <button key={f} onClick={() => setFilterPos(f)} className={filterPos === f ? 'active' : ''}>{f}</button>
              ))}
            </div>
            <div className="market-grid">
              {PLAYERS.filter(p => !usedIds.includes(p.id))
                      .filter(p => filterPos === 'TODOS' || p.pos === filterPos)
                      .map(p => (
                <div key={p.id} onClick={() => selectMarketPlayer(p)} style={{ opacity: selectedSlot ? 1 : 0.4 }}>
                  <PlayerCard player={p} size={(fieldWidth / 4) - 12} />
                </div>
              ))}
            </div>
          </div>

          <div className="bottom-bar">
            <button className="confirm-btn" disabled={!allSet} onClick={() => setStep('especiais')}>
              {allSet ? "CONFIRMAR TIME 🐯" : `ESCOLHA MAIS ${11 - usedIds.length} JOGADORES`}
            </button>
          </div>
        </div>
      )}

      {step === 'especiais' && (
        <div className="step-content specials">
          <div className="big-instruction gold">
            🏆 QUEM SÃO OS LÍDERES DO TIME?
          </div>
          <p className="hint">Escolha o Capitão (Líder) e o Herói (Craque do Jogo)</p>
          
          <div className="specials-grid">
            {Object.values(lineup).map(p => p && (
              <div key={p.id} className="special-card-item">
                <PlayerCard player={p} size={70} isCaptain={captain === p.id} isHero={hero === p.id} />
                <div className="special-actions">
                  <button onClick={() => setCaptain(p.id)} className={captain === p.id ? 'c-active' : ''}>CAPITÃO</button>
                  <button onClick={() => setHero(p.id)} className={hero === p.id ? 'h-active' : ''}>HERÓI</button>
                </div>
              </div>
            ))}
          </div>

          <div className="bottom-bar">
            <button className="confirm-btn" disabled={!captain || !hero} onClick={() => setStep('palpite')}>
              DEFINIR PLACAR ➜
            </button>
          </div>
        </div>
      )}

      {step === 'palpite' && (
        <div className="step-content center">
          <div className="big-instruction">🦁 QUANTO VAI SER O JOGO?</div>
          <div className="score-input-area">
            <div className="score-box">
              <span>NOVORIZONTINO</span>
              <input type="number" value={palpite.home} onChange={e => setPalpite({...palpite, home: Number(e.target.value)})} />
            </div>
            <div className="vs">X</div>
            <div className="score-box">
              <input type="number" value={palpite.away} onChange={e => setPalpite({...palpite, away: Number(e.target.value)})} />
              <span>VISITANTE</span>
            </div>
          </div>
          <button className="confirm-btn" onClick={() => setStep('compartilhar')}>FINALIZAR TUDO</button>
        </div>
      )}

      {step === 'compartilhar' && (
        <div className="step-content final">
          <div className="final-share-card" style={{ width: fieldWidth }}>
            <div className="final-header">MEU TIME ELITE</div>
            <div className="final-field">
              {FORMATION_4231.map(s => {
                const p = lineup[s.id];
                if (!p) return null;
                return (
                  <div key={s.id} className="slot-position" style={{ left: `${s.x}%`, top: `${s.y}%` }}>
                    <PlayerCard player={p} size={fieldWidth * 0.13} isCaptain={captain === p.id} isHero={hero === p.id} />
                  </div>
                );
              })}
            </div>
            <div className="final-footer">
              PLACAR: {palpite.home} X {palpite.away}
              <div className="url">ONOVORIZONTINO.COM.BR</div>
            </div>
          </div>
          <button className="new-btn" onClick={() => window.location.reload()}>NOVA ESCALAÇÃO</button>
        </div>
      )}

      <style jsx global>{`
        .app-container { background: #000; min-height: 100vh; color: #fff; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
        .main-header { background: #F5C400; color: #000; font-weight: 900; text-align: center; padding: 15px; font-size: 20px; box-shadow: 0 4px 20px rgba(245,196,0,0.3); }
        .step-content { display: flex; flex-direction: column; align-items: center; padding: 10px; }
        .big-instruction { background: #222; color: #F5C400; width: 100%; text-align: center; padding: 12px; font-weight: 800; font-size: 13px; border-radius: 8px; margin-bottom: 15px; border: 1px solid #333; }
        .big-instruction.gold { background: #F5C400; color: #000; font-size: 15px; }
        
        .field-area { position: relative; background: #133313; border: 3px solid #1a4a1a; border-radius: 12px; overflow: hidden; box-shadow: inset 0 0 80px rgba(0,0,0,0.6); }
        .slot-position { position: absolute; transform: translate(-50%, -50%); cursor: pointer; }
        
        .empty-dot { border-radius: 50%; border: 2px dashed rgba(255,255,255,0.3); display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.05); }
        .empty-dot.active { border-color: #F5C400; background: rgba(245,196,0,0.2); box-shadow: 0 0 15px #F5C400; }
        .empty-dot span { color: #fff; font-size: 18px; font-weight: bold; }

        .market-section { width: 100%; margin-top: 20px; padding-bottom: 120px; }
        .market-title { font-size: 14px; color: #F5C400; text-align: center; margin-bottom: 10px; font-weight: 900; }
        .filter-bar { display: flex; gap: 5px; overflow-x: auto; padding-bottom: 10px; }
        .filter-bar button { background: #1a1a1a; border: 1px solid #333; color: #888; padding: 6px 12px; border-radius: 4px; font-size: 10px; font-weight: 800; }
        .filter-bar button.active { background: #F5C400; color: #000; }
        .market-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }

        .bottom-bar { position: fixed; bottom: 0; left: 0; width: 100%; padding: 20px; background: linear-gradient(transparent, #000 40%); z-index: 500; }
        .confirm-btn { width: 100%; padding: 18px; background: #F5C400; color: #000; border: none; border-radius: 8px; font-weight: 900; font-size: 16px; cursor: pointer; }
        .confirm-btn:disabled { background: #333; color: #666; }

        .specials-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; width: 100%; margin-bottom: 100px; }
        .special-card-item { background: #111; padding: 8px; border-radius: 8px; text-align: center; }
        .special-actions { display: flex; gap: 4px; margin-top: 10px; }
        .special-actions button { flex: 1; padding: 8px 2px; font-size: 9px; font-weight: 900; border-radius: 4px; border: 1px solid #333; background: #222; color: #fff; }
        .special-actions .c-active { background: #F5C400; color: #000; }
        .special-actions .h-active { background: #fff; color: #000; }

        .score-input-area { display: flex; align-items: center; gap: 20px; margin: 40px 0; }
        .score-box { text-align: center; }
        .score-box span { display: block; font-size: 10px; margin-bottom: 5px; color: #F5C400; font-weight: 900; }
        .score-box input { width: 60px; height: 60px; background: #111; border: 2px solid #F5C400; border-radius: 8px; color: #fff; text-align: center; font-size: 24px; font-weight: 900; }
        .vs { font-size: 24px; font-weight: 900; color: #F5C400; }

        .final-share-card { background: #111; border: 4px solid #F5C400; border-radius: 15px; overflow: hidden; }
        .final-header { background: #F5C400; color: #000; text-align: center; padding: 10px; font-weight: 900; }
        .final-field { height: 400px; position: relative; background: linear-gradient(#133313, #000); }
        .final-footer { background: #000; padding: 15px; text-align: center; font-weight: 900; color: #F5C400; font-size: 18px; border-top: 2px solid #F5C400; }
        .url { font-size: 10px; color: #888; margin-top: 5px; }
        .new-btn { margin-top: 20px; padding: 12px 25px; border-radius: 20px; background: #F5C400; color: #000; font-weight: 900; border: none; }
      `}</style>
    </main>
  );
}
