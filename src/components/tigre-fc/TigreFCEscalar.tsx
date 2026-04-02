'use client';

import { useState, useMemo, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- INTERFACES ---
interface Player {
  id: number;
  name: string;
  short: string;
  num: number;
  pos: string;
  foto: string;
}

interface PageProps {
  params: {
    jogoId: string;
  };
}

// --- CONFIGURAÇÃO SUPABASE ---
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const LOGO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/tigre-fc-logo.png';
const BASE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';

// --- DADOS DOS JOGADORES ---
const PLAYERS: Player[] = [
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
    { id:'gk', pos:'GOL', x:50, y:90 }, { id:'rb', pos:'LAT', x:85, y:70 }, { id:'cb1', pos:'ZAG', x:62, y:75 }, { id:'cb2', pos:'ZAG', x:38, y:75 }, { id:'lb', pos:'LAT', x:15, y:70 },
    { id:'cm1', pos:'MEI', x:75, y:48 }, { id:'cm2', pos:'MEI', x:50, y:52 }, { id:'cm3', pos:'MEI', x:25, y:48 },
    { id:'rw', pos:'ATA', x:80, y:20 }, { id:'st', pos:'ATA', x:50, y:12 }, { id:'lw', pos:'ATA', x:20, y:20 }
  ],
  '4-4-2': [
    { id:'gk', pos:'GOL', x:50, y:90 }, { id:'rb', pos:'LAT', x:85, y:70 }, { id:'cb1', pos:'ZAG', x:62, y:75 }, { id:'cb2', pos:'ZAG', x:38, y:75 }, { id:'lb', pos:'LAT', x:15, y:70 },
    { id:'rm', pos:'MEI', x:85, y:45 }, { id:'cm1', pos:'MEI', x:60, y:50 }, { id:'cm2', pos:'MEI', x:40, y:50 }, { id:'lm', pos:'MEI', x:15, y:45 },
    { id:'st1', pos:'ATA', x:65, y:18 }, { id:'st2', pos:'ATA', x:35, y:18 }
  ]
};

// --- COMPONENTE CARD ---
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
        .card-wrapper { cursor: pointer; transition: transform 0.2s; position: relative; }
        .card-body { 
          position: relative; width: 100%; height: 110px; background: #111; 
          border-radius: 6px; overflow: hidden; border: 1px solid #333;
          display: flex; flex-direction: column;
        }
        .photo-container { flex: 1; position: relative; overflow: hidden; background: #0a0a0a; }
        .photo-sprite {
          width: 200%; height: 100%; background-size: cover;
          background-position: left center; transition: background-position 0.1s steps(1);
        }
        .card-wrapper:hover .photo-sprite, .selected .photo-sprite {
          animation: player-gif 0.8s infinite steps(1);
        }
        @keyframes player-gif {
          0%, 100% { background-position: left center; }
          50% { background-position: right center; }
        }
        .card-info { background: #000; padding: 2px; text-align: center; }
        .player-num { display: block; color: #F5C400; font-size: 9px; font-weight: 900; }
        .player-name { color: #fff; font-size: 9px; text-transform: uppercase; font-weight: 700; white-space: nowrap; overflow: hidden; }
        .selected .card-body { border-color: #F5C400; box-shadow: 0 0 10px rgba(245,196,0,0.4); }
        .cap { border: 2px solid #F5C400 !important; }
        .hero { border: 2px solid #00E5FF !important; }
        .badge { position: absolute; top: -5px; right: -5px; background: #F5C400; color: #000; width: 16px; height: 16px; border-radius: 50%; font-size: 10px; font-weight: 900; display: flex; align-items: center; justify-content: center; z-index: 10; }
        .badge.hero { background: #00E5FF; }
      `}</style>
    </div>
  );
}

export default function TigreFCFantasy({ params }: PageProps) {
  const jogoId = params.jogoId;

  // ESTADOS
  const [step, setStep] = useState<'escalar' | 'capitao' | 'heroi' | 'palpite' | 'share'>('escalar');
  const [formationKey, setFormationKey] = useState('4-3-3');
  const [lineup, setLineup] = useState<Record<string, Player | null>>({});
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const [filterPos, setFilterPos] = useState('GOL');
  const [capitao, setCapitao] = useState<number | null>(null);
  const [heroi, setHeroi] = useState<number | null>(null);
  const [palpite, setPalpite] = useState({ home: 0, away: 0 });
  const [saving, setSaving] = useState(false);

  // Cálculos derivados
  const filledCount = useMemo(() => Object.values(lineup).filter(Boolean).length, [lineup]);
  const usedIds = useMemo(() => Object.values(lineup).filter(Boolean).map(p => p!.id), [lineup]);

  const togglePlayer = (p: Player) => {
    const isAlreadySelected = usedIds.includes(p.id);
    
    if (isAlreadySelected) {
        const entry = Object.entries(lineup).find(([_, player]) => player?.id === p.id);
        if (entry) setLineup({ ...lineup, [entry[0]]: null });
    } else {
        const targetSlot = activeSlot || FORMATIONS[formationKey].find(s => s.pos === p.pos && !lineup[s.id])?.id;
        if (targetSlot) {
            setLineup({ ...lineup, [targetSlot]: p });
            setActiveSlot(null);
        }
    }
  };

  const handleSalvar = async () => {
      setSaving(true);
      try {
          // Lógica de inserção no Supabase usando jogoId
          const { error } = await supabase.from('escalacoes').insert({
              jogo_id: jogoId,
              jogadores: usedIds,
              capitao_id: capitao,
              heroi_id: heroi,
              palpite_home: palpite.home,
              palpite_away: palpite.away
          });

          if (error) throw error;
          setStep('share');
      } catch (err) {
          console.error(err);
          alert("Erro ao salvar escalação.");
      } finally {
          setSaving(false);
      }
  };

  return (
    <main className="fantasy-container">
      <header className="game-header">
        <img src={LOGO} alt="Tigre FC" />
        <div className="step-indicator">
            {['Escalar', 'Capitão', 'Herói', 'Palpite'].map((s, i) => (
                <div key={s} className={`dot ${i <= ['escalar', 'capitao', 'heroi', 'palpite'].indexOf(step) ? 'active' : ''}`} />
            ))}
        </div>
      </header>

      {/* CAMPO EM PERSPECTIVA */}
      <div className="field-viewport">
        <div className="soccer-field">
          <div className="field-lines">
            <div className="penalty-area top" />
            <div className="circle-middle" />
            <div className="line-middle" />
            <div className="penalty-area bottom" />
          </div>

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
                        size={55} 
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
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* SELEÇÃO INVERSA / FILTROS */}
      {step === 'escalar' && (
        <section className="market-section">
          <div className="market-controls">
            <div className="group">
                {Object.keys(FORMATIONS).map(f => (
                    <button key={f} className={formationKey === f ? 'active' : ''} onClick={() => {setFormationKey(f); setLineup({});}}>{f}</button>
                ))}
            </div>
            <div className="group">
                {['GOL', 'ZAG', 'LAT', 'MEI', 'ATA'].map(pos => (
                    <button key={pos} className={filterPos === pos ? 'active' : ''} onClick={() => setFilterPos(pos)}>{pos}</button>
                ))}
            </div>
          </div>
          <div className="players-grid">
            {PLAYERS.filter(p => p.pos === filterPos).map(p => (
                <PlayerCard 
                    key={p.id} 
                    player={p} 
                    size={'100%'} 
                    isSelected={usedIds.includes(p.id)}
                    onClick={() => togglePlayer(p)} 
                />
            ))}
          </div>
        </section>
      )}

      {/* TELA DE PALPITE */}
      {step === 'palpite' && (
          <div className="palpite-box">
              <h3 style={{fontWeight: 900, fontSize: 14, color: '#F5C400'}}>PLACAR DO JOGO</h3>
              <div className="inputs">
                <div className="team-input">
                    <span style={{fontSize: 10, display:'block', marginBottom: 5}}>TIGRE</span>
                    <input type="number" placeholder="0" value={palpite.home} onChange={e => setPalpite({...palpite, home: +e.target.value})} />
                </div>
                <span className="x-mark">X</span>
                <div className="team-input">
                    <span style={{fontSize: 10, display:'block', marginBottom: 5}}>VISITANTE</span>
                    <input type="number" placeholder="0" value={palpite.away} onChange={e => setPalpite({...palpite, away: +e.target.value})} />
                </div>
              </div>
          </div>
      )}

      {/* BOTÃO DE AÇÃO FIXO */}
      <footer className="action-footer">
          <button 
            className="main-button"
            disabled={saving || (step === 'escalar' && filledCount < 11) || (step === 'capitao' && !capitao) || (step === 'heroi' && !heroi)}
            onClick={() => {
                if (step === 'escalar') setStep('capitao');
                else if (step === 'capitao') setStep('heroi');
                else if (step === 'heroi') setStep('palpite');
                else if (step === 'palpite') handleSalvar();
            }}
          >
              {saving ? 'PROCESSANDO...' : 
               step === 'escalar' ? (filledCount < 11 ? `FALTAM ${11 - filledCount} JOGADORES` : 'ESCOLHER CAPITÃO →') :
               step === 'capitao' ? (capitao ? 'CONFIRMAR CAPITÃO' : 'SELECIONE O CAPITÃO NO CAMPO') :
               step === 'heroi' ? (heroi ? 'CONFIRMAR HERÓI' : 'SELECIONE O HERÓI NO CAMPO') : 'SALVAR ESCALAÇÃO'}
          </button>
          {step !== 'escalar' && <button className="back-btn" onClick={() => setStep('escalar')}>Recomeçar Escalação</button>}
      </footer>

      <style jsx global>{`
        .fantasy-container { background: #000; min-height: 100vh; color: #fff; padding-bottom: 140px; font-family: sans-serif; }
        .game-header { padding: 15px; display: flex; justify-content: space-between; align-items: center; }
        .game-header img { height: 25px; }
        .step-indicator { display: flex; gap: 6px; }
        .dot { width: 8px; height: 8px; border-radius: 50%; background: #222; }
        .dot.active { background: #F5C400; box-shadow: 0 0 8px #F5C400; }

        .field-viewport { perspective: 1000px; padding: 10px; margin-top: -20px; overflow: hidden; }
        .soccer-field { 
          position: relative; width: 100%; height: 460px; background: #1a4a1a; 
          border-radius: 8px; transform: rotateX(15deg); border: 2px solid rgba(255,255,255,0.1);
          background-image: linear-gradient(#225c22 50%, #1a4a1a 50%); background-size: 100% 40px;
        }
        .field-lines { position: absolute; inset: 0; border: 1px solid rgba(255,255,255,0.2); }
        .line-middle { position: absolute; top: 50%; width: 100%; height: 1px; background: rgba(255,255,255,0.2); }
        .player-slot { position: absolute; transform: translate(-50%, -50%); z-index: 5; }
        
        .add-placeholder { 
          width: 38px; height: 38px; border-radius: 50%; border: 1px dashed #F5C400;
          background: rgba(0,0,0,0.6); color: #F5C400; font-size: 8px; font-weight: 900;
        }
        .add-placeholder.active { background: #F5C400; color: #000; border-style: solid; box-shadow: 0 0 15px #F5C400; }

        .market-section { padding: 20px; background: #050505; border-radius: 20px 20px 0 0; margin-top: -15px; position: relative; z-index: 20; border-top: 1px solid #1a1a1a; }
        .market-controls { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
        .group { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 5px; }
        .group::-webkit-scrollbar { display: none; }
        .group button { padding: 8px 16px; border-radius: 20px; border: 1px solid #222; background: #111; color: #666; font-size: 10px; font-weight: 800; white-space: nowrap; }
        .group button.active { background: #F5C400; color: #000; border-color: #F5C400; }
        
        .players-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }

        .action-footer { position: fixed; bottom: 0; width: 100%; padding: 20px; background: linear-gradient(transparent, #000 40%); z-index: 100; text-align: center; }
        .main-button { width: 100%; max-width: 450px; padding: 20px; border-radius: 18px; background: #F5C400; color: #000; border: none; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px; }
        .main-button:disabled { background: #1a1a1a; color: #444; }
        .back-btn { margin-top: 12px; background: none; border: none; color: #888; font-size: 11px; text-decoration: underline; cursor: pointer; }

        .palpite-box { text-align: center; padding: 40px 20px; background: #050505; margin-top: -20px; border-radius: 20px; }
        .inputs { display: flex; justify-content: center; align-items: flex-end; gap: 15px; margin-top: 20px; }
        .team-input input { width: 70px; height: 70px; background: #111; border: 2px solid #333; border-radius: 15px; color: #fff; text-align: center; font-size: 28px; font-weight: 900; }
        .team-input input:focus { border-color: #F5C400; outline: none; }
        .x-mark { font-weight: 900; color: #333; font-size: 20px; padding-bottom: 20px; }
      `}</style>
    </main>
  );
}
