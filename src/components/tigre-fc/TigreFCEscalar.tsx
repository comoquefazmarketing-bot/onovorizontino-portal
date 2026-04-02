'use client';

import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- CONFIGURAÇÃO SUPABASE ---
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { persistSession: true, autoRefreshToken: true } }
);

const LOGO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/tigre-fc-logo.png';
const BASE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';

// --- DADOS DOS JOGADORES ---
const PLAYERS = [
  { id: 1,  name: 'César Augusto',   short: 'César',      num: 31, pos: 'GOL', foto: BASE+'CESAR-AUGUSTO.jpg.webp' },
  { id: 2,  name: 'Jordi',           short: 'Jordi',      num: 93, pos: 'GOL', foto: BASE+'JORDI.jpg.webp' },
  { id: 3,  name: 'João Scapin',     short: 'Scapin',     num: 12, pos: 'GOL', foto: BASE+'JOAO-SCAPIN.jpg.webp' },
  { id: 4,  name: 'Lucas Ribeiro',   short: 'Lucas',      num: 1,  pos: 'GOL', foto: BASE+'LUCAS-RIBEIRO.jpg.webp' },
  { id: 5,  name: 'Lora',            short: 'Lora',       num: 2,  pos: 'LAT', foto: BASE+'LORA.jpg.webp' },
  { id: 6,  name: 'Castrillón',      short: 'Castrillón', num: 6,  pos: 'LAT', foto: BASE+'CASTRILLON.jpg.webp' },
  { id: 7,  name: 'Arthur Barbosa',  short: 'A.Barbosa',  num: 22, pos: 'LAT', foto: BASE+'ARTHUR-BARBOSA.jpg.webp' },
  { id: 8,  name: 'Sander',          short: 'Sander',     num: 33, pos: 'LAT', foto: BASE+'SANDER.jpg.webp' },
  { id: 9,  name: 'Maykon Jesus',    short: 'Maykon',     num: 27, pos: 'LAT', foto: BASE+'MAYKON-JESUS.jpg.webp' },
  { id: 10, name: 'Dantas',          short: 'Dantas',     num: 3,  pos: 'ZAG', foto: BASE+'DANTAAS.jpg.webp' },
  { id: 11, name: 'Eduardo Brock',   short: 'E.Brock',    num: 5,  pos: 'ZAG', foto: BASE+'EDUARDO-BROCK.jpg.webp' },
  { id: 12, name: 'Patrick',         short: 'Patrick',    num: 4,  pos: 'ZAG', foto: BASE+'PATRICK.jpg.webp' },
  { id: 13, name: 'Gabriel Bahia',   short: 'G.Bahia',    num: 14, pos: 'ZAG', foto: BASE+'GABRIEL-BAHIA.jpg.webp' },
  { id: 14, name: 'Carlinhos',       short: 'Carlinhos',  num: 25, pos: 'ZAG', foto: BASE+'CARLINHOS.jpg.webp' },
  { id: 15, name: 'Alemão',          short: 'Alemão',     num: 28, pos: 'ZAG', foto: BASE+'ALEMAO.jpg.webp' },
  { id: 16, name: 'Renato Palm',     short: 'R.Palm',     num: 24, pos: 'ZAG', foto: BASE+'RENATO-PALM.jpg.webp' },
  { id: 17, name: 'Alvariño',        short: 'Alvariño',   num: 35, pos: 'ZAG', foto: BASE+'IVAN-ALVARINO.jpg.webp' },
  { id: 18, name: 'Bruno Santana',   short: 'B.Santana',  num: 33, pos: 'ZAG', foto: BASE+'BRUNO-SANTANA.jpg.webp' },
  { id: 19, name: 'Luís Oyama',      short: 'Oyama',      num: 8,  pos: 'MEI', foto: BASE+'LUIS-OYAMA.jpg.webp' },
  { id: 20, name: 'Léo Naldi',       short: 'L.Naldi',    num: 7,  pos: 'MEI', foto: BASE+'LEO-NALDI.jpg.webp' },
  { id: 21, name: 'Rômulo',          short: 'Rômulo',     num: 10, pos: 'MEI', foto: BASE+'ROMULO.jpg.webp' },
  { id: 22, name: 'Matheus Bianqui', short: 'Bianqui',    num: 11, pos: 'MEI', foto: BASE+'MATHEUS-BIANQUI.jpg.webp' },
  { id: 23, name: 'Juninho',         short: 'Juninho',    num: 20, pos: 'MEI', foto: BASE+'JUNINHO.jpg.webp' },
  { id: 24, name: 'Tavinho',         short: 'Tavinho',    num: 17, pos: 'MEI', foto: BASE+'TAVINHO.jpg.webp' },
  { id: 25, name: 'Diego Galo',      short: 'D.Galo',     num: 29, pos: 'MEI', foto: BASE+'DIEGO-GALO.jpg.webp' },
  { id: 26, name: 'Marlon',          short: 'Marlon',     num: 30, pos: 'MEI', foto: BASE+'MARLON.jpg.webp' },
  { id: 27, name: 'Hector Bianchi',  short: 'Hector',     num: 16, pos: 'MEI', foto: BASE+'HECTOR-BIACHI.jpg.webp' },
  { id: 28, name: 'Nogueira',        short: 'Nogueira',   num: 36, pos: 'MEI', foto: BASE+'NOGUEIRA.jpg.webp' },
  { id: 29, name: 'Luiz Gabriel',    short: 'L.Gabriel',  num: 37, pos: 'MEI', foto: BASE+'LUIZ-GABRIEL.jpg.webp' },
  { id: 30, name: 'Jhones Kauê',     short: 'J.Kauê',     num: 50, pos: 'MEI', foto: BASE+'JHONES-KAUE.jpg.webp' },
  { id: 31, name: 'Robson',          short: 'Robson',     num: 9,  pos: 'ATA', foto: BASE+'ROBSON.jpg.webp' },
  { id: 32, name: 'Vinícius Paiva',  short: 'V.Paiva',    num: 13, pos: 'ATA', foto: BASE+'VINICIUS-PAIVA.jpg.webp' },
  { id: 33, name: 'Hélio Borges',    short: 'H.Borges',   num: 18, pos: 'ATA', foto: BASE+'HELIO-BORGES.jpg.webp' },
  { id: 34, name: 'Jardiel',         short: 'Jardiel',    num: 19, pos: 'ATA', foto: BASE+'JARDIEL.jpg.webp' },
  { id: 35, name: 'Nicolas Careca',  short: 'N.Careca',   num: 21, pos: 'ATA', foto: BASE+'NICOLAS-CARECA.jpg.webp' },
  { id: 36, name: 'Titi Ortiz',      short: 'T.Ortiz',    num: 15, pos: 'ATA', foto: BASE+'TITI-ORTIZ.jpg.webp' },
  { id: 37, name: 'Diego Mathias',   short: 'D.Mathias',  num: 41, pos: 'ATA', foto: BASE+'DIEGO-MATHIAS.jpg.webp' },
  { id: 38, name: 'Carlão',          short: 'Carlão',     num: 90, pos: 'ATA', foto: BASE+'CARLAO.jpg.webp' },
  { id: 39, name: 'Ronald Barcellos', short: 'Ronald',     num: 23, pos: 'ATA', foto: BASE+'RONALD-BARCELLOS.jpg.webp' },
];

const FORMATIONS: Record<string, any[]> = {
  '4-3-3': [
    { id:'gk', pos:'GOL', x:50, y:92 }, { id:'rb', pos:'LAT', x:85, y:72 }, { id:'cb1', pos:'ZAG', x:62, y:78 }, { id:'cb2', pos:'ZAG', x:38, y:78 }, { id:'lb', pos:'LAT', x:15, y:72 },
    { id:'cm1', pos:'MEI', x:75, y:52 }, { id:'cm2', pos:'MEI', x:50, y:55 }, { id:'cm3', pos:'MEI', x:25, y:52 },
    { id:'rw', pos:'ATA', x:80, y:22 }, { id:'st', pos:'ATA', x:50, y:12 }, { id:'lw', pos:'ATA', x:20, y:22 }
  ],
  '4-4-2': [
    { id:'gk', pos:'GOL', x:50, y:92 }, { id:'rb', pos:'LAT', x:85, y:72 }, { id:'cb1', pos:'ZAG', x:62, y:78 }, { id:'cb2', pos:'ZAG', x:38, y:78 }, { id:'lb', pos:'LAT', x:15, y:72 },
    { id:'rm', pos:'MEI', x:85, y:48 }, { id:'cm1', pos:'MEI', x:60, y:52 }, { id:'cm2', pos:'MEI', x:40, y:52 }, { id:'lm', pos:'MEI', x:15, y:48 },
    { id:'st1', pos:'ATA', x:65, y:18 }, { id:'st2', pos:'ATA', x:35, y:18 }
  ],
  '3-5-2': [
    { id:'gk', pos:'GOL', x:50, y:92 }, { id:'cb1', pos:'ZAG', x:70, y:78 }, { id:'cb2', pos:'ZAG', x:50, y:82 }, { id:'cb3', pos:'ZAG', x:30, y:78 },
    { id:'rm', pos:'MEI', x:88, y:45 }, { id:'cm1', pos:'MEI', x:65, y:52 }, { id:'cm2', pos:'MEI', x:50, y:55 }, { id:'cm3', pos:'MEI', x:35, y:52 }, { id:'lm', pos:'MEI', x:12, y:45 },
    { id:'st1', pos:'ATA', x:60, y:18 }, { id:'st2', pos:'ATA', x:40, y:18 }
  ]
};

// --- COMPONENTE PLAYER CARD (COM EFEITO GIF) ---
function PlayerCard({ player, size, isSelected, status, onClick }: any) {
  return (
    <div className={`card-wrapper ${isSelected ? 'selected' : ''}`} onClick={onClick} style={{ width: size }}>
      <div className={`card-body ${status}`}>
        <div className="photo-container">
            <div className="photo-sprite" style={{ backgroundImage: `url(${player.foto})` }} />
        </div>
        <div className="card-info">
          <span className="player-num">{player.num}</span>
          <span className="player-name">{player.short}</span>
        </div>
        {status === 'cap' && <div className="badge">C</div>}
        {status === 'hero' && <div className="badge hero">H</div>}
      </div>
      <style jsx>{`
        .card-wrapper { cursor: pointer; transition: transform 0.2s; perspective: 1000px; }
        .card-body { 
          position: relative; width: 100%; height: 140px; background: #111; 
          border-radius: 6px; overflow: hidden; border: 1px solid #333;
          display: flex; flex-direction: column;
        }
        .photo-container { flex: 1; position: relative; overflow: hidden; }
        .photo-sprite {
          width: 200%; height: 100%; background-size: 200% 100%;
          background-position: left center; transition: background-position 0.1s steps(1);
        }
        /* Efeito de Troca para GIF ao selecionar ou hover */
        .card-wrapper:hover .photo-sprite, .selected .photo-sprite {
          animation: player-gif 0.6s infinite steps(1);
        }
        @keyframes player-gif {
          0%, 100% { background-position: left center; }
          50% { background-position: right center; }
        }
        .card-info { background: #000; padding: 4px; text-align: center; }
        .player-num { display: block; color: #F5C400; font-size: 10px; font-weight: 900; }
        .player-name { color: #fff; font-size: 11px; text-transform: uppercase; font-weight: 700; }
        .selected .card-body { border-color: #F5C400; box-shadow: 0 0 15px rgba(245,196,0,0.3); }
        .cap { border: 2px solid #F5C400 !important; }
        .hero { border: 2px solid #00E5FF !important; }
        .badge { position: absolute; top: 5px; right: 5px; background: #F5C400; color: #000; width: 18px; height: 18px; border-radius: 50%; font-size: 10px; font-weight: 900; display: flex; align-items: center; justify-content: center; }
        .badge.hero { background: #00E5FF; }
      `}</style>
    </div>
  );
}

export default function TigreFCFantasy() {
  const [step, setStep] = useState<'escalar' | 'capitao' | 'heroi' | 'palpite' | 'share'>('escalar');
  const [formationKey, setFormationKey] = useState('4-3-3');
  const [lineup, setLineup] = useState<Record<string, Player | null>>({});
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const [filterPos, setFilterPos] = useState('GOL');
  const [capitao, setCapitao] = useState<number | null>(null);
  const [heroi, setHeroi] = useState<number | null>(null);
  const [palpite, setPalpite] = useState({ home: 0, away: 0 });

  // Lista ID's já usados para não repetir
  const usedIds = useMemo(() => Object.values(lineup).filter(Boolean).map(p => p!.id), [lineup]);

  const togglePlayer = (p: Player) => {
    if (usedIds.includes(p.id)) {
        // Remover se já estiver
        const entry = Object.entries(lineup).find(([_, player]) => player?.id === p.id);
        if (entry) setLineup({ ...lineup, [entry[0]]: null });
    } else {
        // Tenta encaixar no slot ativo ou no primeiro disponível da posição
        const targetSlot = activeSlot || FORMATIONS[formationKey].find(s => s.pos === p.pos && !lineup[s.id])?.id;
        if (targetSlot) {
            setLineup({ ...lineup, [targetSlot]: p });
            setActiveSlot(null);
        }
    }
  };

  const isComplete = Object.values(lineup).filter(Boolean).length === 11;

  return (
    <main className="fantasy-container">
      {/* HEADER DINÂMICO */}
      <header className="game-header">
        <img src={LOGO} alt="Tigre FC" />
        <div className="progress-bar">
            <div className={`dot ${step === 'escalar' ? 'active' : ''}`} />
            <div className={`dot ${step === 'capitao' ? 'active' : ''}`} />
            <div className={`dot ${step === 'heroi' ? 'active' : ''}`} />
            <div className={`dot ${step === 'palpite' ? 'active' : ''}`} />
        </div>
      </header>

      {/* ÁREA DO CAMPO (3D REPLICA) */}
      <div className="field-viewport">
        <div className="soccer-field">
          {/* Marcações do Campo */}
          <div className="field-lines">
            <div className="penalty-area top" />
            <div className="circle-middle" />
            <div className="line-middle" />
            <div className="penalty-area bottom" />
          </div>

          {/* Jogadores no Campo */}
          {FORMATIONS[formationKey].map(slot => {
            const p = lineup[slot.id];
            return (
              <div key={slot.id} className="player-slot" style={{ left: `${slot.x}%`, top: `${slot.y}%` }}>
                {p ? (
                   <div onClick={() => {
                       if(step === 'escalar') setLineup({...lineup, [slot.id]: null});
                       if(step === 'capitao') setCapitao(p.id);
                       if(step === 'heroi') setHeroi(p.id);
                   }}>
                     <PlayerCard 
                        player={p} 
                        size={60} 
                        status={capitao === p.id ? 'cap' : heroi === p.id ? 'hero' : ''} 
                        isSelected 
                    />
                   </div>
                ) : (
                  <button className={`add-placeholder ${activeSlot === slot.id ? 'active' : ''}`} onClick={() => {
                      setActiveSlot(slot.id);
                      setFilterPos(slot.pos);
                  }}>
                    <span>{slot.pos}</span>
                    <i />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* MERCADO DE JOGADORES (INVERSO - SEMPRE VISÍVEL NO STEP ESCALAR) */}
      {step === 'escalar' && (
        <section className="market-section">
          <div className="market-header">
            <div className="formation-select">
                {Object.keys(FORMATIONS).map(f => (
                    <button key={f} className={formationKey === f ? 'active' : ''} onClick={() => {setFormationKey(f); setLineup({});}}>{f}</button>
                ))}
            </div>
            <div className="pos-filters">
                {['GOL', 'ZAG', 'LAT', 'MEI', 'ATA'].map(pos => (
                    <button key={pos} className={filterPos === pos ? 'active' : ''} onClick={() => setFilterPos(pos)}>{pos}</button>
                ))}
            </div>
          </div>
          <div className="players-scroll">
            {PLAYERS.filter(p => p.pos === filterPos).map(p => (
                <PlayerCard 
                    key={p.id} 
                    player={p} 
                    size={85} 
                    isSelected={usedIds.includes(p.id)}
                    onClick={() => togglePlayer(p)} 
                />
            ))}
          </div>
        </section>
      )}

      {/* STEP PALPITE */}
      {step === 'palpite' && (
          <div className="palpite-overlay">
            <h3>PLACAR FINAL</h3>
            <div className="score-box">
                <input type="number" value={palpite.home} onChange={e => setPalpite({...palpite, home: Number(e.target.value)})} />
                <span>X</span>
                <input type="number" value={palpite.away} onChange={e => setPalpite({...palpite, away: Number(e.target.value)})} />
            </div>
          </div>
      )}

      {/* CONTROLES FLUTUANTES */}
      <footer className="footer-actions">
          {step === 'escalar' && (
              <button className="next-btn" disabled={!isComplete} onClick={() => setStep('capitao')}>
                  {isComplete ? 'ESCOLHER CAPITÃO' : `FALTAM ${11 - usedIds.length}`}
              </button>
          )}
          {step === 'capitao' && <button className="next-btn" disabled={!capitao} onClick={() => setStep('heroi')}>DEFINIR HERÓI</button>}
          {step === 'heroi' && <button className="next-btn" disabled={!heroi} onClick={() => setStep('palpite')}>DAR PALPITE</button>}
          {step === 'palpite' && <button className="next-btn" onClick={() => alert('Escalação salva! Felipe agradece.')}>CONFIRMAR TIME 🐯</button>}
          
          {step !== 'escalar' && <button className="back-link" onClick={() => setStep('escalar')}>VOLTAR</button>}
      </footer>

      <style jsx global>{`
        body { background: #000; margin: 0; font-family: sans-serif; color: #fff; overflow-x: hidden; }
        .fantasy-container { min-height: 100vh; display: flex; flex-direction: column; padding-bottom: 120px; }
        
        .game-header { display: flex; justify-content: space-between; align-items: center; padding: 15px; background: rgba(255,255,255,0.05); }
        .game-header img { height: 30px; }
        .progress-bar { display: flex; gap: 8px; }
        .dot { width: 8px; height: 8px; border-radius: 50%; background: #333; }
        .dot.active { background: #F5C400; box-shadow: 0 0 10px #F5C400; }

        .field-viewport { perspective: 1200px; padding: 20px 10px; margin-top: -30px; }
        .soccer-field { 
          position: relative; width: 100%; height: 520px; 
          background: linear-gradient(180deg, #1e5c2c 0%, #0a240f 100%);
          border-radius: 12px; transform: rotateX(25deg);
          box-shadow: 0 40px 60px rgba(0,0,0,0.8);
          border: 4px solid rgba(255,255,255,0.1);
        }
        .field-lines { position: absolute; inset: 0; pointer-events: none; }
        .penalty-area { position: absolute; left: 20%; width: 60%; height: 15%; border: 2px solid rgba(255,255,255,0.1); }
        .penalty-area.top { top: 0; border-top: none; }
        .penalty-area.bottom { bottom: 0; border-bottom: none; }
        .line-middle { position: absolute; top: 50%; width: 100%; height: 2px; background: rgba(255,255,255,0.1); }
        .circle-middle { position: absolute; top: 50%; left: 50%; width: 100px; height: 100px; border: 2px solid rgba(255,255,255,0.1); border-radius: 50%; transform: translate(-50%, -50%); }

        .player-slot { position: absolute; transform: translate(-50%, -50%); z-index: 10; }
        .add-placeholder { 
          width: 45px; height: 45px; border-radius: 50%; border: 2px dashed rgba(245,196,0,0.4);
          background: rgba(0,0,0,0.4); color: #F5C400; font-weight: 900; font-size: 9px;
          display: flex; align-items: center; justify-content: center; flex-direction: column;
        }
        .add-placeholder.active { border-color: #fff; background: #F5C400; color: #000; animation: pulse 1s infinite; }
        @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }

        .market-section { background: #0a0a0a; border-radius: 24px 24px 0 0; padding: 20px; border-top: 1px solid #222; }
        .market-header { margin-bottom: 15px; }
        .formation-select, .pos-filters { display: flex; gap: 8px; overflow-x: auto; margin-bottom: 10px; padding-bottom: 5px; }
        .market-header button { 
            background: #1a1a1a; border: 1px solid #333; color: #888; 
            padding: 8px 16px; border-radius: 20px; font-size: 11px; font-weight: 800;
        }
        .market-header button.active { background: #F5C400; color: #000; border-color: #F5C400; }
        .players-scroll { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }

        .footer-actions { position: fixed; bottom: 0; width: 100%; padding: 20px; background: linear-gradient(transparent, #000 40%); text-align: center; }
        .next-btn { 
          width: 100%; max-width: 400px; padding: 18px; border-radius: 14px; 
          border: none; background: #F5C400; color: #000; font-weight: 900;
          text-transform: uppercase; box-shadow: 0 10px 20px rgba(245,196,0,0.2);
        }
        .next-btn:disabled { background: #222; color: #444; box-shadow: none; }
        .back-link { display: block; margin-top: 10px; color: #666; font-size: 12px; border: none; background: none; }

        .palpite-overlay { position: fixed; top: 30%; left: 50%; transform: translateX(-50%); text-align: center; background: #111; padding: 30px; border-radius: 30px; border: 1px solid #F5C400; }
        .score-box { display: flex; align-items: center; gap: 15px; margin-top: 20px; }
        .score-box input { width: 70px; height: 70px; background: #000; border: 2px solid #333; border-radius: 12px; color: #fff; text-align: center; font-size: 32px; font-weight: 900; }
      `}</style>
    </main>
  );
}
