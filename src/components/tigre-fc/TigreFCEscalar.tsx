'use client';
import { useState, useEffect, useRef } from 'react';
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

// REPOSICIONAMENTO ESTRATÉGICO PARA EVITAR ENCAVALAMENTO
const FORMATION_4231 = [
  { id: 'gk',  label: 'GOL', x: 50, y: 90 },
  { id: 'rb',  label: 'LAT', x: 88, y: 72 }, // Mais para a direita
  { id: 'cb1', label: 'ZAG', x: 65, y: 77 }, // Mais afastado do centro
  { id: 'cb2', label: 'ZAG', x: 35, y: 77 }, // Mais afastado do centro
  { id: 'lb',  label: 'LAT', x: 12, y: 72 }, // Mais para a esquerda
  { id: 'dm1', label: 'VOL', x: 68, y: 58 }, // Linha de volantes mais larga
  { id: 'dm2', label: 'VOL', x: 32, y: 58 }, 
  { id: 'am1', label: 'ATA', x: 85, y: 38 }, // Ponta direita
  { id: 'am2', label: 'MEI', x: 50, y: 40 }, // Meia central
  { id: 'am3', label: 'ATA', x: 15, y: 38 }, // Ponta esquerda
  { id: 'st',  label: 'ATA', x: 50, y: 15 }, // Centroavante isolado no topo
];

type Player = typeof PLAYERS[0];
type Lineup = Record<string, Player | null>;

function PlayerCard({ player, size, isField, isSelected, isCaptain, isHero }: { player: Player, size: number, isField?: boolean, isSelected?: boolean, isCaptain?: boolean, isHero?: boolean }) {
  const backgroundPositionX = isField ? 'right' : 'left';
  
  return (
    <div className={`player-card-container ${isSelected ? 'floating' : ''}`} style={{ width: size, position: 'relative' }}>
      <div style={{
        position: 'relative', width: size, height: size * 1.35,
        background: '#111', borderRadius: '6px', overflow: 'hidden',
        border: isSelected ? '3px solid #F5C400' : isField ? '1.5px solid rgba(245, 196, 0, 0.5)' : '1px solid rgba(255,255,255,0.1)',
        boxShadow: isSelected ? '0 0 25px #F5C400' : '0 4px 10px rgba(0,0,0,0.5)',
        transition: '0.3s all cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        zIndex: isSelected ? 100 : 1
      }}>
        {/* FIFA Glossy Effect */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)', zIndex: 2 }} />
        
        <div style={{
          width: '100%', height: '100%',
          backgroundImage: `url(${player.foto})`,
          backgroundSize: 'cover',
          backgroundPosition: `${backgroundPositionX} top`,
          maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)'
        }} />

        {/* Badges */}
        {isCaptain && <div className="badge captain">C</div>}
        {isHero && <div className="badge hero">⭐</div>}

        <div style={{ 
          position: 'absolute', bottom: 0, width: '100%', 
          background: 'rgba(0,0,0,0.9)', 
          padding: '3px 0', textAlign: 'center',
          borderTop: '1px solid rgba(245,196,0,0.4)',
          zIndex: 3
        }}>
          <div style={{ color: '#F5C400', fontSize: Math.max(size * 0.12, 7), fontWeight: 900 }}>{player.pos}</div>
          <div style={{ color: '#fff', fontSize: Math.max(size * 0.14, 8.5), fontWeight: 1000, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{player.short}</div>
        </div>
      </div>
      <style jsx>{`
        .badge { position: absolute; top: 5px; right: 5px; width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 900; z-index: 10; border: 1px solid #000; }
        .captain { background: #F5C400; color: #000; }
        .hero { background: #fff; color: #000; }
        .floating { transform: translateY(-10px) scale(1.15); }
      `}</style>
    </div>
  );
}

export default function TigreFCEscalar({ jogoId }: { jogoId: number }) {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<'login' | 'escalar' | 'especiais' | 'palpite' | 'compartilhar'>('login');
  const [lineup, setLineup] = useState<Lineup>({});
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [captain, setCaptain] = useState<number | null>(null);
  const [hero, setHero] = useState<number | null>(null);
  const [palpite, setPalpite] = useState({ home: 0, away: 0 });
  const [fieldWidth, setFieldWidth] = useState(360);
  const [filterPos, setFilterPos] = useState<string>('TODOS');

  useEffect(() => {
    setMounted(true);
    const update = () => setFieldWidth(Math.min(window.innerWidth - 32, 450));
    update();
    window.addEventListener('resize', update);
    supabase.auth.getSession().then(({ data: { session } }) => { if (session) setStep('escalar'); });
    return () => window.removeEventListener('resize', update);
  }, []);

  const handleSlotClick = (slotId: string) => {
    if (selectedSlot && lineup[selectedSlot] && lineup[slotId]) {
      const p1 = lineup[selectedSlot];
      const p2 = lineup[slotId];
      setLineup(prev => ({ ...prev, [selectedSlot]: p2, [slotId]: p1 }));
      setSelectedSlot(null);
      return;
    }
    setSelectedSlot(slotId === selectedSlot ? null : slotId);
  };

  const selectPlayer = (player: Player) => {
    if (selectedSlot) {
      setLineup(prev => ({ ...prev, [selectedSlot]: player }));
      setSelectedSlot(null);
    }
  };

  if (!mounted) return null;

  if (step === 'login') return (
    <div className="fifa-bg" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
      <div className="spotlight" />
      <img src="https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/tigre-fc-logo.png" width={150} className="glow-logo" />
      <button onClick={() => setStep('escalar')} className="btn-primary">INICIAR ESCALAÇÃO</button>
    </div>
  );

  const usedIds = Object.values(lineup).filter(Boolean).map(p => p!.id);
  const filteredPlayers = PLAYERS.filter(p => !usedIds.includes(p.id)).filter(p => filterPos === 'TODOS' || p.pos === filterPos);
  const allSet = usedIds.length === 11;

  return (
    <main className="fifa-bg" style={{ minHeight: '100vh', color: '#fff', paddingBottom: 100 }}>
      <header className="fifa-header">
        <div className="header-content">TIGRE FC <span>ELITE 26</span></div>
      </header>

      {step === 'escalar' && (
        <div style={{ maxWidth: 480, margin: '0 auto', padding: 16 }}>
          {/* CAMPO */}
          <div className="soccer-field" style={{ width: fieldWidth, height: fieldWidth * 1.5 }}>
            {FORMATION_4231.map((slot) => {
              const p = lineup[slot.id];
              const active = selectedSlot === slot.id;
              return (
                <div key={slot.id} onClick={() => handleSlotClick(slot.id)} style={{
                  position: 'absolute', left: `${slot.x}%`, top: `${slot.y}%`,
                  transform: 'translate(-50%, -50%)', zIndex: active ? 110 : slot.y // zIndex baseado na altura para evitar encavalamento visual
                }}>
                  {p ? (
                    <PlayerCard player={p} size={fieldWidth * 0.17} isField isSelected={active} />
                  ) : (
                    <div className={`empty-slot ${active ? 'active' : ''}`} style={{ width: fieldWidth * 0.13, height: fieldWidth * 0.13 }}>
                      <span className="plus">+</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* MERCADO */}
          <div className="mercado-container">
            <div className="mercado-tabs">
              {['TODOS', 'GOL', 'LAT', 'ZAG', 'MEI', 'ATA'].map(pos => (
                <button key={pos} onClick={() => setFilterPos(pos)} className={filterPos === pos ? 'tab active' : 'tab'}>{pos}</button>
              ))}
            </div>
            <div className="players-grid">
              {filteredPlayers.map(p => (
                <div key={p.id} onClick={() => selectPlayer(p)} style={{ opacity: selectedSlot ? 1 : 0.3 }}>
                  <PlayerCard player={p} size={(fieldWidth / 4) - 15} />
                </div>
              ))}
            </div>
          </div>

          <div className="footer-action">
            <button disabled={!allSet} onClick={() => setStep('especiais')} className="btn-confirm">
              {allSet ? 'DEFINIR CAPITÃO & HERÓI ➜' : `FALTAM ${11 - usedIds.length} JOGADORES`}
            </button>
          </div>
        </div>
      )}

      {step === 'especiais' && (
        <div className="overlay-step">
          <h2>QUEM SÃO SEUS LÍDERES?</h2>
          <div className="especiais-list">
             {Object.values(lineup).map(p => p && (
               <div key={p.id} className="especial-item">
                  <PlayerCard player={p} size={80} isField isCaptain={captain === p.id} isHero={hero === p.id} />
                  <div className="especial-btns">
                    <button onClick={() => setCaptain(p.id)} className={captain === p.id ? 'active' : ''}>CAPITÃO</button>
                    <button onClick={() => setHero(p.id)} className={hero === p.id ? 'active' : ''}>HERÓI</button>
                  </div>
               </div>
             ))}
          </div>
          <button disabled={!captain || !hero} onClick={() => setStep('palpite')} className="btn-confirm">PRÓXIMO: PLACAR</button>
        </div>
      )}

      {step === 'palpite' && (
        <div className="overlay-step">
          <h2>PALPITE DO TIGRE</h2>
          <div className="scoreboard">
            <div className="team">NOVORIZONTINO <input type="number" value={palpite.home} onChange={e => setPalpite({...palpite, home: parseInt(e.target.value)})} /></div>
            <div className="vs">X</div>
            <div className="team"><input type="number" value={palpite.away} onChange={e => setPalpite({...palpite, away: parseInt(e.target.value)})} /> VISITANTE</div>
          </div>
          <button onClick={() => setStep('compartilhar')} className="btn-confirm">FINALIZAR E COMPARTILHAR</button>
        </div>
      )}

      {step === 'compartilhar' && (
        <div className="overlay-step" style={{ padding: 10 }}>
           <div className="final-card" style={{ width: fieldWidth, height: fieldWidth * 1.6 }}>
              <div className="card-header">MEU TIME ELITE - JOGO {jogoId}</div>
              <div className="mini-field">
                {FORMATION_4231.map(s => lineup[s.id] && (
                  <div key={s.id} style={{ position: 'absolute', left: `${s.x}%`, top: `${s.y}%`, transform: 'translate(-50%, -50%)' }}>
                    <PlayerCard player={lineup[s.id]!} size={fieldWidth * 0.12} isField isCaptain={captain === lineup[s.id]?.id} isHero={hero === lineup[s.id]?.id} />
                  </div>
                ))}
              </div>
              <div className="card-footer">
                <div>PLACAR: {palpite.home} X {palpite.away}</div>
                <div className="brand">ONOVORIZONTINO.COM.BR</div>
              </div>
           </div>
           <button onClick={() => window.location.reload()} className="btn-primary" style={{ marginTop: 20 }}>NOVA ESCALAÇÃO</button>
        </div>
      )}

      <style jsx global>{`
        body { margin: 0; background: #000; overflow-x: hidden; }
        .fifa-bg { background: radial-gradient(circle at center, #0a0a0a 0%, #000 100%); position: relative; }
        .spotlight { position: absolute; top: -10%; left: 50%; transform: translateX(-50%); width: 100%; height: 60%; background: radial-gradient(ellipse at center, rgba(245,196,0,0.15) 0%, transparent 70%); pointer-events: none; }
        
        .fifa-header { background: #F5C400; padding: 15px; box-shadow: 0 5px 20px rgba(245,196,0,0.3); }
        .header-content { color: #000; font-weight: 1000; text-align: center; font-size: 20px; letter-spacing: -1px; }
        .header-content span { opacity: 0.7; font-weight: 500; font-size: 14px; }

        .soccer-field { position: relative; margin: 0 auto; background: #133313; border-radius: 12px; border: 4px solid #1a4a1a; box-shadow: inset 0 0 100px rgba(0,0,0,0.5), 0 20px 50px rgba(0,0,0,0.8); overflow: hidden; }
        .empty-slot { border-radius: 50%; border: 2px dashed rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.05); transition: 0.3s; }
        .empty-slot.active { border-color: #F5C400; background: rgba(245,196,0,0.1); box-shadow: 0 0 15px #F5C400; }
        .plus { color: rgba(255,255,255,0.5); font-weight: 900; }

        .mercado-container { margin-top: 25px; }
        .mercado-tabs { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 15px; scrollbar-width: none; }
        .tab { padding: 10px 20px; background: #111; border: 1px solid #222; color: #666; border-radius: 8px; font-weight: 900; font-size: 12px; }
        .tab.active { background: #F5C400; color: #000; border-color: #F5C400; }
        
        .players-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }

        .footer-action { position: fixed; bottom: 0; left: 0; width: 100%; padding: 20px; background: linear-gradient(transparent, #000 40%); z-index: 200; }
        .btn-confirm { width: 100%; padding: 20px; background: #F5C400; color: #000; border: none; border-radius: 12px; font-weight: 1000; font-size: 16px; box-shadow: 0 10px 20px rgba(245,196,0,0.3); }
        .btn-confirm:disabled { background: #1a1a1a; color: #444; box-shadow: none; }

        .overlay-step { display: flex; flex-direction: column; align-items: center; padding-top: 40px; animation: fadeIn 0.5s; }
        .especiais-list { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 100px; padding: 20px; }
        .especial-item { background: #111; padding: 10px; border-radius: 12px; text-align: center; }
        .especial-btns { display: flex; gap: 5px; margin-top: 8px; }
        .especial-btns button { flex: 1; padding: 5px; font-size: 9px; font-weight: 900; border: 1px solid #333; background: #000; color: #fff; border-radius: 4px; }
        .especial-btns button.active { background: #F5C400; color: #000; }

        .scoreboard { display: flex; align-items: center; gap: 20px; margin: 40px 0; }
        .scoreboard input { width: 60px; height: 60px; background: #111; border: 2px solid #F5C400; color: #fff; text-align: center; font-size: 24px; font-weight: 900; border-radius: 10px; }

        .final-card { background: #111; border: 4px solid #F5C400; border-radius: 20px; position: relative; overflow: hidden; display: flex; flex-direction: column; }
        .mini-field { flex: 1; background: url('https://www.transparenttextures.com/patterns/carbon-fibre.png'), linear-gradient(#133313, #0a0a0a); position: relative; }
        .card-header { background: #F5C400; color: #000; padding: 10px; text-align: center; font-weight: 1000; }
        .card-footer { padding: 15px; background: #000; text-align: center; border-top: 2px solid #F5C400; font-weight: 900; }
        .brand { font-size: 10px; color: #F5C400; margin-top: 5px; }

        .btn-primary { padding: 15px 30px; background: #F5C400; color: #000; font-weight: 1000; border-radius: 30px; border: none; }
        
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </main>
  );
}
