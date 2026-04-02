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
  // Lógica solicitada: Esquerda no mercado, Direita no campo
  const bgPos = isField ? 'right' : 'left';

  return (
    <div className={`card-wrapper ${isSelected ? 'selected' : ''}`} style={{ width: size }}>
      <div className="card-box" style={{ height: size * 1.35, border: isSelected ? '3px solid #F5C400' : '1px solid #333' }}>
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
        .selected { transform: scale(1.08); z-index: 10; }
        .card-box { background: #111; border-radius: 6px; overflow: hidden; position: relative; width: 100%; box-shadow: 0 4px 10px rgba(0,0,0,0.5); }
        .badge { position: absolute; top: 4px; right: 4px; width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 900; z-index: 5; border: 1px solid #000; }
        .cap { background: #F5C400; color: #000; }
        .star { background: #fff; color: #000; }
        .card-info { position: absolute; bottom: 0; width: 100%; background: rgba(0,0,0,0.9); text-align: center; padding: 3px 0; border-top: 1px solid rgba(245,196,0,0.4); }
        .pos { color: #F5C400; font-size: 8px; font-weight: 900; line-height: 1; }
        .name { color: #fff; font-size: 10px; font-weight: 900; text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding: 0 2px; }
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
    // Se clicar no slot que já está selecionado, desseleciona
    if (selectedSlot === slotId) {
      setSelectedSlot(null);
      return;
    }
    // Se o slot já tiver jogador, permite trocar ou selecionar para mover
    setSelectedSlot(slotId);
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
          <div className={`alert ${selectedSlot ? 'highlight' : ''}`}>
            {selectedSlot ? "⚡ SELECIONE O JOGADOR NA LISTA ABAIXO" : "👉 TOQUE EM UM CÍRCULO (+) NO CAMPO"}
          </div>

          <div className="field" style={{ width: fieldWidth, height: fieldWidth * 1.4 }}>
            {FORMATION_4231.map(slot => {
              const p = lineup[slot.id];
              const isSel = selectedSlot === slot.id;
              return (
                <div key={slot.id} className="slot" onClick={() => handleSlotClick(slot.id)} style={{ left: `${slot.x}%`, top: `${slot.y}%`, zIndex: isSel ? 50 : 10 }}>
                  {p ? (
                    <PlayerCard player={p} size={fieldWidth * 0.17} isSelected={isSel} isField />
                  ) : (
                    <div className={`dot ${isSel ? 'active' : ''}`} style={{ width: fieldWidth * 0.12, height: fieldWidth * 0.12 }}>
                      <span className="plus">+</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="market-section">
            <div className="market-sticky-header">
              <div className="market-title">MERCADO DE ATLETAS</div>
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
                <div key={p.id} className="grid-item" onClick={() => selectFromMarket(p)} style={{ opacity: selectedSlot ? 1 : 0.4 }}>
                  <PlayerCard player={p} size={(fieldWidth / 3) - 16} />
                </div>
              ))}
            </div>
          </div>

          <div className="dock">
            <button className="next-btn" disabled={!isComplete} onClick={() => setStep('especiais')}>
              {isComplete ? "DEFINIR LÍDERES ➜" : `ESCALADOS: ${usedIds.length}/11`}
            </button>
          </div>
        </div>
      )}

      {/* OS PRÓXIMOS PASSOS: ESPECIAIS, PALPITE, COMPARTILHAR */}
      {step === 'especiais' && (
        <div className="content">
           <div className="alert highlight">🏆 QUEM SÃO OS LÍDERES DO TIME?</div>
           <div className="especiais-grid">
              {Object.values(lineup).map(p => p && (
                <div key={p.id} className="especial-row">
                   <PlayerCard player={p} size={70} isCaptain={captain === p.id} isHero={hero === p.id} isField />
                   <div className="especial-actions">
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

      <style jsx global>{`
        body { background: #000; margin: 0; font-family: 'Inter', sans-serif; overflow-x: hidden; }
        .container { min-height: 100vh; color: #fff; padding-bottom: 120px; }
        .header { background: #F5C400; color: #000; text-align: center; padding: 15px; font-weight: 1000; font-size: 20px; position: sticky; top: 0; z-index: 100; box-shadow: 0 4px 15px rgba(0,0,0,0.5); }
        .header span { opacity: 0.6; font-weight: 400; margin-left: 5px; }
        
        .content { display: flex; flex-direction: column; align-items: center; padding: 10px; width: 100%; max-width: 500px; margin: 0 auto; }
        
        .alert { background: #111; color: #666; width: 100%; text-align: center; padding: 12px; font-weight: 800; font-size: 11px; border-radius: 6px; margin-bottom: 10px; border: 1px solid #222; transition: 0.3s; }
        .alert.highlight { background: #F5C400; color: #000; border-color: #F5C400; animation: pulse 1.5s infinite; }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.7; } 100% { opacity: 1; } }

        .field { position: relative; background: #133313; border: 3px solid #1a4a1a; border-radius: 12px; overflow: hidden; box-shadow: inset 0 0 80px #000; margin-bottom: 20px; }
        .slot { position: absolute; transform: translate(-50%, -50%); cursor: pointer; }
        .dot { border-radius: 50%; border: 2px dashed rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.03); color: #fff; }
        .dot.active { border-color: #F5C400; background: rgba(245,196,0,0.15); box-shadow: 0 0 15px rgba(245,196,0,0.4); }
        .plus { font-size: 20px; opacity: 0.3; }

        .market-section { width: 100%; background: #080808; border-radius: 12px 12px 0 0; padding-top: 10px; }
        .market-sticky-header { position: sticky; top: 55px; background: #080808; z-index: 80; padding: 10px 0; }
        .market-title { color: #F5C400; font-size: 11px; font-weight: 900; text-align: center; letter-spacing: 1px; margin-bottom: 10px; }
        
        .filters { display: flex; gap: 6px; overflow-x: auto; padding: 0 10px 10px; scrollbar-width: none; }
        .filters::-webkit-scrollbar { display: none; }
        .filters button { background: #151515; border: 1px solid #222; color: #666; padding: 8px 16px; border-radius: 20px; font-size: 10px; font-weight: 800; white-space: nowrap; }
        .filters button.f-active { background: #F5C400; color: #000; border-color: #F5C400; }

        .players-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; padding: 10px; }
        .grid-item { display: flex; justify-content: center; }

        .especiais-grid { width: 100%; display: flex; flex-direction: column; gap: 10px; }
        .especial-row { background: #111; padding: 10px; border-radius: 8px; display: flex; align-items: center; gap: 15px; border: 1px solid #222; }
        .especial-actions { display: flex; flex-direction: column; gap: 8px; flex: 1; }
        .especial-actions button { padding: 10px; border-radius: 6px; border: 1px solid #333; background: #1a1a1a; color: #fff; font-weight: 900; font-size: 10px; }
        .especial-actions button.active.cap { background: #F5C400; color: #000; border-color: #F5C400; }
        .especial-actions button.active.star { background: #fff; color: #000; border-color: #fff; }

        .dock { position: fixed; bottom: 0; left: 0; width: 100%; padding: 20px; background: linear-gradient(transparent, #000 40%); z-index: 200; display: flex; justify-content: center; }
        .next-btn { width: 100%; max-width: 400px; padding: 18px; background: #F5C400; color: #000; border: none; border-radius: 12px; font-weight: 1000; font-size: 16px; box-shadow: 0 10px 30px rgba(245,196,0,0.3); transition: 0.3s; }
        .next-btn:disabled { background: #222; color: #444; box-shadow: none; }
      `}</style>
    </main>
  );
}
