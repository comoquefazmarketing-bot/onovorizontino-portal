'use client';

import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- CONFIGURAÇÃO SUPABASE ---
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { persistSession: true, autoRefreshToken: true } }
);

// --- CONSTANTES DE ATIVOS ---
const LOGO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/tigre-fc-logo.png';
const BASE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';

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

const FORMATION = [
  { id:'gk',  label:'GOL', x:50, y:92 }, 
  { id:'rb',  label:'LAT', x:82, y:72 },
  { id:'cb1', label:'ZAG', x:62, y:78 }, 
  { id:'cb2', label:'ZAG', x:38, y:78 },
  { id:'lb',  label:'LAT', x:18, y:72 }, 
  { id:'cm1', label:'MEI', x:75, y:52 },
  { id:'cm2', label:'MEI', x:50, y:55 }, 
  { id:'cm3', label:'MEI', x:25, y:52 },
  { id:'rw',  label:'ATA', x:80, y:22 }, 
  { id:'st',  label:'ATA', x:50, y:12 },
  { id:'lw',  label:'ATA', x:20, y:22 },
];

const RESERVES_SLOTS = ['res1', 'res2', 'res3', 'res4', 'res5'];

type Player = typeof PLAYERS[0];

// --- COMPONENTE PLAYER CARD (PADRÃO FC 25 / ULTIMATE TEAM) ---
function PlayerCard({ player, size, isCapitao, isHeroi, isField, isSelected, onClick }: any) {
  return (
    <div 
      onClick={onClick}
      style={{ 
        width: size, 
        animation: 'card-entry 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        cursor: 'pointer'
      }}
    >
      <div className={`card-container ${isCapitao ? 'cap' : isHeroi ? 'hero' : ''}`} style={{
        position: 'relative', width: size, height: size * 1.38,
        background: '#1a1a1a', borderRadius: '4px', overflow: 'hidden',
        border: `1px solid rgba(255,255,255,0.2)`,
        boxShadow: '0 10px 20px rgba(0,0,0,0.5)',
        transition: 'all 0.3s ease',
        transformStyle: 'preserve-3d'
      }}>
        {/* Camada de Foto */}
        <div style={{
          width: '100%', height: '100%', 
          backgroundImage: `url(${player.foto})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)'
        }} />

        {/* Overlay de Informações */}
        <div style={{ 
            position: 'absolute', bottom: 0, width: '100%', 
            background: 'linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)', 
            padding: '8px 0', textAlign: 'center' 
        }}>
          <div style={{ color: '#F5C400', fontSize: size * 0.1, fontWeight: 900, letterSpacing: -0.5 }}>{player.num}</div>
          <div style={{ color: '#fff', fontSize: size * 0.14, fontWeight: 800, textTransform: 'uppercase' }}>{player.short}</div>
        </div>

        {/* Shine Effect */}
        <div className="shine-effect" />
      </div>

      <style jsx>{`
        .card-container:hover { transform: scale(1.1) translateY(-5px); z-index: 50; }
        .cap { border: 2px solid #F5C400 !important; box-shadow: 0 0 20px rgba(245, 196, 0, 0.4) !important; }
        .hero { border: 2px solid #00E5FF !important; box-shadow: 0 0 20px rgba(0, 229, 255, 0.4) !important; }
        .shine-effect {
          position: absolute; top: 0; left: -100%; width: 50%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transform: skewX(-20deg);
          animation: shine 3s infinite;
        }
        @keyframes shine { to { left: 200%; } }
      `}</style>
    </div>
  );
}

export default function TigreFCEscalar({ jogoId }: { jogoId: number }) {
  const [step, setStep] = useState<'login' | 'escalar' | 'capitao' | 'heroi' | 'palpite' | 'confirmar' | 'finalizado'>('login');
  const [lineup, setLineup] = useState<Record<string, Player | null>>({});
  const [reserves, setReserves] = useState<Record<string, Player | null>>({});
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const [capitao, setCapitao] = useState<number | null>(null);
  const [heroi, setHeroi] = useState<number | null>(null);
  const [palpite, setPalpite] = useState({ mandante: 0, visitante: 0 });
  const [usuario, setUsuario] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [fieldWidth, setFieldWidth] = useState(360);

  useEffect(() => {
    const update = () => setFieldWidth(Math.min(window.innerWidth, 500));
    update();
    window.addEventListener('resize', update);
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) { setUsuario(session.user); setStep('escalar'); }
    });
    return () => window.removeEventListener('resize', update);
  }, []);

  const allSelectedIds = useMemo(() => {
    return [...Object.values(lineup), ...Object.values(reserves)].filter(Boolean).map(p => p!.id);
  }, [lineup, reserves]);

  const handleSalvar = async () => {
    setSaving(true);
    const { error } = await supabase.from('escalacoes_elite').upsert({
      user_id: usuario?.id,
      jogo_id: jogoId,
      jogadores: lineup,
      reservas: reserves,
      capitao_id: capitao,
      heroi_id: heroi,
      palpite: palpite,
      updated_at: new Date()
    });
    if (!error) setStep('finalizado');
    setSaving(false);
  };

  const filledMain = Object.values(lineup).filter(Boolean).length;
  const filledRes = Object.values(reserves).filter(Boolean).length;

  if (step === 'login') return <div style={{ height:'100vh', background:'#000' }} />;

  return (
    <main style={{ minHeight:'100vh', background:'#000', color:'#fff', overflowX: 'hidden' }}>
      
      {/* HUD SUPERIOR - GLASSMORPHISM */}
      <nav style={{ 
        position: 'sticky', top: 0, zIndex: 100, 
        background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(15px)',
        padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <img src={LOGO} alt="Tigre FC" style={{ height: 35 }} />
        <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 10, color: '#F5C400', fontWeight: 900 }}>STATUS DA ESCALAÇÃO</div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>{filledMain}/11 TITULARES</div>
        </div>
      </nav>

      <div style={{ maxWidth: 500, margin: '0 auto', position: 'relative' }}>
        
        {/* CAMPO DE JOGO - ESTÉTICA FIFA/FC 26 */}
        <div style={{ 
          perspective: '1500px', 
          marginTop: -20,
          marginBottom: 40,
          filter: activeSlot ? 'blur(5px) brightness(0.3)' : 'none',
          transition: 'all 0.4s ease'
        }}>
          <div style={{
            width: '100%', height: fieldWidth * 1.4,
            background: 'radial-gradient(circle at 50% 100%, #1e5d2c 0%, #0a200f 100%)',
            position: 'relative',
            transform: 'rotateX(25deg)',
            transformOrigin: 'bottom',
            border: '4px solid rgba(255,255,255,0.05)',
            boxShadow: '0 50px 100px rgba(0,0,0,0.8)'
          }}>
            {/* Linhas do Campo */}
            <div style={{ position: 'absolute', top: '50%', width: '100%', height: 2, background: 'rgba(255,255,255,0.1)' }} />
            <div style={{ 
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                width: 120, height: 120, border: '2px solid rgba(255,255,255,0.1)', borderRadius: '50%' 
            }} />
            <div style={{ position: 'absolute', bottom: 0, left: '25%', width: '50%', height: '15%', border: '2px solid rgba(255,255,255,0.1)', borderBottom: 'none' }} />

            {/* Renderização dos Slots de Jogadores */}
            {FORMATION.map((slot) => {
              const p = lineup[slot.id];
              return (
                <div key={slot.id} style={{
                  position: 'absolute', left: `${slot.x}%`, top: `${slot.y}%`, 
                  transform: 'translate(-50%, -50%) translateZ(20px)',
                  zIndex: 10
                }}>
                  {p ? (
                    <PlayerCard 
                      player={p} 
                      size={fieldWidth * 0.17} 
                      isCapitao={capitao === p.id} 
                      isHeroi={heroi === p.id}
                      onClick={() => {
                        if (step === 'escalar') setLineup({...lineup, [slot.id]: null});
                        if (step === 'capitao') setCapitao(p.id);
                        if (step === 'heroi') setHeroi(p.id);
                      }} 
                    />
                  ) : (
                    <button 
                      onClick={() => step === 'escalar' && setActiveSlot(slot.id)}
                      className="add-btn"
                    >
                      <span style={{ fontSize: 10 }}>{slot.label}</span>
                      <span style={{ fontSize: 20 }}>+</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* BANCO DE RESERVAS */}
        <section style={{ padding: '0 20px 120px' }}>
          <h3 style={{ fontSize: 12, color: '#666', fontWeight: 900, marginBottom: 15, textAlign: 'center' }}>SUPLENTES</h3>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
            {RESERVES_SLOTS.map(id => {
              const p = reserves[id];
              return (
                <div key={id} style={{ flex: 1, maxWidth: 70 }}>
                  {p ? (
                    <PlayerCard player={p} size={fieldWidth * 0.14} onClick={() => step === 'escalar' && setReserves({...reserves, [id]: null})} />
                  ) : (
                    <div onClick={() => step === 'escalar' && setActiveSlot(id)} className="reserve-empty">
                      +
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* MODAL MERCADO - FULLSCREEN OVERLAY */}
        {activeSlot && (
          <div className="market-overlay">
            <div className="market-content">
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingBottom:20 }}>
                    <h2 style={{ fontSize: 18, fontWeight: 900 }}>CONTRATAR JOGADOR</h2>
                    <button onClick={() => setActiveSlot(null)} style={{ background: '#333', border: 'none', color: '#fff', borderRadius: '50%', width: 30, height: 30 }}>✕</button>
                </div>
                
                <div className="players-grid">
                    {PLAYERS.filter(p => !allSelectedIds.includes(p.id)).map(p => (
                        <PlayerCard 
                          key={p.id} 
                          player={p} 
                          size={100} 
                          onClick={() => {
                            if(RESERVES_SLOTS.includes(activeSlot)) setReserves({...reserves, [activeSlot]: p});
                            else setLineup({...lineup, [activeSlot]: p});
                            setActiveSlot(null);
                          }}
                        />
                    ))}
                </div>
            </div>
          </div>
        )}

        {/* HUD DE PALPITE */}
        {step === 'palpite' && (
            <div className="step-modal">
                <h2 style={{ color: '#F5C400' }}>QUAL O PLACAR?</h2>
                <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                    <input type="number" className="score-input" value={palpite.mandante} onChange={e => setPalpite({...palpite, mandante: Number(e.target.value)})} />
                    <span style={{ fontSize: 32, fontWeight: 900 }}>X</span>
                    <input type="number" className="score-input" value={palpite.visitante} onChange={e => setPalpite({...palpite, visitante: Number(e.target.value)})} />
                </div>
            </div>
        )}

        {/* BOTÃO DE AÇÃO PRINCIPAL - FOOTER FIXO */}
        <div style={{ 
            position: 'fixed', bottom: 0, left: 0, width: '100%', 
            padding: '20px', background: 'linear-gradient(0deg, #000 60%, transparent 100%)', zIndex: 1000 
        }}>
            <button 
                className="main-action-btn"
                onClick={() => {
                    if (step === 'escalar' && filledMain === 11 && filledRes === 5) setStep('capitao');
                    else if (step === 'capitao' && capitao) setStep('heroi');
                    else if (step === 'heroi' && heroi) setStep('palpite');
                    else if (step === 'palpite') setStep('confirmar');
                    else if (step === 'confirmar') handleSalvar();
                }}
            >
                {saving ? "PROCESSANDO..." : getBtnText(step, filledMain, filledRes, capitao, heroi)}
            </button>
            {step !== 'escalar' && (
                <button onClick={() => setStep('escalar')} style={{ width: '100%', marginTop: 10, background: 'transparent', border: 'none', color: '#666', fontSize: 12, fontWeight: 700 }}>REVISAR TIME</button>
            )}
        </div>

      </div>

      <style jsx global>{`
        @font-face { font-family: 'FC24'; src: url('https://fonts.cdnfonts.com/css/din-alternate'); }
        body { font-family: 'DIN Alternate', sans-serif; background: #000; margin: 0; }
        
        .add-btn {
          width: 50px; height: 50px; border-radius: 50%;
          background: rgba(245, 196, 0, 0.1); border: 2px dashed #F5C400;
          color: #F5C400; display: flex; flex-direction: column; 
          align-items: center; justify-content: center; font-weight: 900;
          transition: all 0.3s;
        }
        .add-btn:hover { background: rgba(245, 196, 0, 0.3); transform: scale(1.2); }

        .reserve-empty {
            height: 80px; border-radius: 8px; border: 1px dashed #333;
            display: flex; alignItems: center; justifyContent: center; color: #333; font-size: 24px;
        }

        .market-overlay {
            position: fixed; inset: 0; background: rgba(0,0,0,0.9);
            backdrop-filter: blur(20px); z-index: 2000; padding: 20px;
            animation: fadeIn 0.3s ease;
        }
        .market-content { max-width: 500px; margin: 0 auto; height: 100%; display: flex; flex-direction: column; }
        .players-grid { 
            display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; 
            overflow-y: auto; padding-bottom: 50px;
        }

        .main-action-btn {
            width: 100%; padding: 20px; border-radius: 12px; border: none;
            background: linear-gradient(90deg, #F5C400 0%, #D4AC00 100%);
            color: #000; font-weight: 900; font-size: 14px; text-transform: uppercase;
            letter-spacing: 1px; box-shadow: 0 10px 20px rgba(245, 196, 0, 0.2);
            transition: all 0.3s;
        }
        .main-action-btn:active { transform: scale(0.95); }

        .score-input {
            width: 80px; height: 80px; background: #111; border: 2px solid #333;
            border-radius: 16px; color: #fff; font-size: 40px; text-align: center; font-weight: 900;
        }

        .step-modal {
            position: fixed; top: 40%; left: 50%; transform: translate(-50%, -50%);
            width: 90%; max-width: 400px; background: #0a0a0a; border: 1px solid #333;
            padding: 30px; border-radius: 24px; text-align: center; z-index: 1500;
            box-shadow: 0 30px 60px rgba(0,0,0,1);
        }

        @keyframes card-entry {
          from { opacity: 0; transform: translateY(20px) scale(0.8); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </main>
  );
}

function getBtnText(step: string, m: number, r: number, cap: any, her: any) {
    if(step === 'escalar') return (m === 11 && r === 5) ? "AVANÇAR PARA CAPITÃO" : "ESCALAÇÃO INCOMPLETA";
    if(step === 'capitao') return !cap ? "ESCOLHA O CAPITÃO (C)" : "DEFINIR HERÓI";
    if(step === 'heroi') return !her ? "ESCOLHA O HERÓI (H)" : "PLACAR FINAL";
    return "CONFIRMAR TUDO 🐯";
}
