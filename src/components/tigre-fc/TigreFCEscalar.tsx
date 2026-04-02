'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- CONFIGURAÇÃO SUPABASE (PERSISTÊNCIA ATIVA) ---
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { persistSession: true, autoRefreshToken: true } }
);

// --- CONSTANTES DE ATIVOS (FIDELIDADE ABSOLUTA) ---
const LOGO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/tigre-fc-logo.png';
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
  { id: 39, name: 'Ronald Barcellos',  short: 'Ronald',      num: 23, pos: 'ATA', foto: BASE+'RONALD-BARCELLOS.jpg.webp' },
];

const FORMATION = [
  { id:'gk',  label:'GOL', x:50, y:90 }, { id:'rb',  label:'LAT', x:85, y:72 },
  { id:'cb1', label:'ZAG', x:62, y:78 }, { id:'cb2', label:'ZAG', x:38, y:78 },
  { id:'lb',  label:'LAT', x:15, y:72 }, { id:'cm1', label:'MEI', x:75, y:52 },
  { id:'cm2', label:'MEI', x:50, y:55 }, { id:'cm3', label:'MEI', x:25, y:52 },
  { id:'rw',  label:'ATA', x:82, y:22 }, { id:'st',  label:'ATA', x:50, y:12 },
  { id:'lw',  label:'ATA', x:18, y:22 },
];

const RESERVES_SLOTS = ['res1', 'res2', 'res3', 'res4', 'res5'];

type Player = typeof PLAYERS[0];

// --- COMPONENTE PLAYER CARD (ESTILO ULTIMATE TEAM) ---
function PlayerCard({ player, size, isCapitao, isHeroi, isField, isSelected }: { player: Player, size: number, isCapitao?: boolean, isHeroi?: boolean, isField?: boolean, isSelected?: boolean }) {
  const borderColor = isCapitao ? '#F5C400' : isHeroi ? '#00E5FF' : 'rgba(255,255,255,0.2)';
  
  return (
    <div className="card-container" style={{ width: size }}>
      <div className={`card-body ${isCapitao ? 'gold' : isHeroi ? 'hero' : ''}`} style={{
        position: 'relative', width: size, height: size * 1.38,
        background: '#111', borderRadius: '6px', overflow: 'hidden',
        border: `2px solid ${borderColor}`,
        boxShadow: isCapitao ? '0 0 20px rgba(245,196,0,0.4)' : isHeroi ? '0 0 20px rgba(0,229,255,0.4)' : 'none',
        transform: isField ? 'rotateX(-10deg)' : 'none',
        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      }}>
        {/* Efeito Shine */}
        <div className="shine-effect" />
        
        {/* Foto com Offset Dinâmico */}
        <div style={{
          width: '100%', height: '100%', 
          backgroundImage: `url(${player.foto})`,
          backgroundSize: '200% 100%',
          backgroundPosition: isSelected || isField ? 'right center' : 'left center',
          transition: 'background-position 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
          maskImage: 'linear-gradient(to bottom, black 75%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 75%, transparent 100%)'
        }} />

        {/* Badge de Posição/Número */}
        <div style={{ position: 'absolute', top: 4, left: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: size*0.15, fontWeight: 900, color: borderColor }}>{player.num}</span>
            <span style={{ fontSize: size*0.08, color: '#fff', opacity: 0.7 }}>{player.pos}</span>
        </div>

        {/* Nome do Jogador */}
        <div style={{ 
          position: 'absolute', bottom: 0, width: '100%', 
          background: 'rgba(0,0,0,0.85)', padding: '5px 0', 
          textAlign: 'center', borderTop: `1px solid ${borderColor}` 
        }}>
          <div style={{ color: '#fff', fontSize: Math.max(size * 0.12, 10), fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {player.short}
          </div>
        </div>
      </div>

      <style jsx>{`
        .card-container:hover .card-body { transform: scale(1.05) translateY(-5px); z-index: 100; }
        .shine-effect {
          position: absolute; top: 0; left: -100%; width: 50%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          transform: skewX(-20deg); animation: shine 4s infinite; z-index: 2;
        }
        @keyframes shine { 0% { left: -100%; } 20% { left: 150%; } 100% { left: 150%; } }
        @keyframes card-entry { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .card-body { animation: card-entry 0.5s ease-out; }
      `}</style>
    </div>
  );
}

// --- COMPONENTE PRINCIPAL ---
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
    const update = () => setFieldWidth(Math.min(window.innerWidth - 32, 500));
    update();
    window.addEventListener('resize', update);
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) { setUsuario(session.user); setStep('escalar'); }
    });
    return () => window.removeEventListener('resize', update);
  }, []);

  const handleSalvar = async () => {
    setSaving(true);
    const { error } = await supabase.from('escalacoes_elite').upsert({
      user_id: usuario?.id, jogo_id: jogoId, jogadores: lineup, reservas: reserves,
      capitao_id: capitao, heroi_id: heroi, palpite: palpite, updated_at: new Date()
    });
    if (!error) setStep('finalizado');
    setSaving(false);
  };

  if (step === 'login') return (
    <div style={{ height:'100vh', background:'#000', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
        <img src={LOGO} style={{ width: 140, marginBottom: 40, filter: 'drop-shadow(0 0 20px #F5C400)' }} />
        <button onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })} style={{ 
          padding: '20px 40px', borderRadius: 12, border: 'none', background: '#F5C400', 
          color: '#000', fontWeight: 900, cursor: 'pointer', boxShadow: '0 10px 30px rgba(245,196,0,0.3)' 
        }}>ENTRAR COM GOOGLE</button>
    </div>
  );

  const filledMain = Object.values(lineup).filter(Boolean).length;
  const filledRes = Object.values(reserves).filter(Boolean).length;
  const allSelectedIds = [...Object.values(lineup), ...Object.values(reserves)].filter(Boolean).map(p => p!.id);

  return (
    <main style={{ minHeight:'100vh', background:'#050505', color:'#fff', paddingBottom:180, overflowX:'hidden' }}>
      
      {/* Header Estilo EA */}
      <div style={{ 
        background: 'linear-gradient(90deg, #F5C400 0%, #FFD700 100%)', 
        padding: '15px 20px', position: 'sticky', top: 0, zIndex: 2000, 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <img src={LOGO} style={{ width: 40 }} />
        <div style={{ color: '#000', fontWeight: 1000, fontSize: 13, textTransform: 'uppercase' }}>
          {step === 'escalar' ? `ESQUADRÃO: ${filledMain}/11 | ${filledRes}/5` : step}
        </div>
        <div style={{ width: 40 }} />
      </div>

      <div style={{ maxWidth: 500, margin: '0 auto', padding: '10px' }}>
        
        {/* CAMPO COM PERSPECTIVA 3D */}
        <div style={{ perspective: '1500px', margin: '30px 0 50px 0' }}>
          <div className="soccer-field" style={{
            width: fieldWidth, height: fieldWidth * 1.35, margin: '0 auto',
            background: 'radial-gradient(circle at center, #2e7d32 0%, #1b5e20 100%)',
            borderRadius: '20px', position: 'relative', transform: 'rotateX(20deg)',
            border: '4px solid rgba(255,255,255,0.1)', boxShadow: '0 30px 60px rgba(0,0,0,0.5)'
          }}>
            {/* Linhas do Campo */}
            <div style={{ position: 'absolute', top: '50%', width: '100%', height: '2px', background: 'rgba(255,255,255,0.1)' }} />
            <div style={{ position: 'absolute', top: '50%', left: '50%', width: 100, height: 100, border: '2px solid rgba(255,255,255,0.1)', borderRadius: '50%', transform: 'translate(-50%, -50%)' }} />

            {FORMATION.map((slot) => {
              const p = lineup[slot.id];
              const isActive = activeSlot === slot.id;
              return (
                <div key={slot.id} onClick={() => step === 'escalar' && setActiveSlot(slot.id)} style={{
                  position: 'absolute', left: `${slot.x}%`, top: `${slot.y}%`, 
                  transform: 'translate(-50%, -50%)', zIndex: 10
                }}>
                  {p ? (
                    <div onClick={() => {
                        if(step === 'capitao') setCapitao(p.id);
                        if(step === 'heroi') setHeroi(p.id);
                    }}>
                        <PlayerCard player={p} size={fieldWidth * 0.17} isField isCapitao={capitao === p.id} isHeroi={heroi === p.id} isSelected />
                    </div>
                  ) : (
                    <div className={isActive ? 'slot-active' : 'slot-empty'}>
                        <span style={{ fontSize: 18 }}>+</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* BANCO DE RESERVAS */}
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 24, padding: 20, marginBottom: 30, border: '1px solid rgba(255,255,255,0.05)' }}>
            <h4 style={{ color: '#F5C400', fontSize: 11, fontWeight: 900, marginBottom: 15, textAlign:'center', textTransform:'uppercase' }}>Banco de Suplentes</h4>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
                {RESERVES_SLOTS.map(id => {
                    const p = reserves[id];
                    const isActive = activeSlot === id;
                    return (
                        <div key={id} onClick={() => step === 'escalar' && setActiveSlot(id)} style={{ cursor: 'pointer' }}>
                            {p ? <PlayerCard player={p} size={fieldWidth * 0.15} isSelected /> : 
                            <div className={isActive ? 'slot-res-active' : 'slot-res-empty'}>+</div>}
                        </div>
                    );
                })}
            </div>
        </div>

        {/* MERCADO (DRAWER/MODAL) */}
        {activeSlot && step === 'escalar' && (
          <div className="market-overlay">
             <div className="market-content">
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding: '20px 20px 10px 20px' }}>
                    <h3 style={{ fontSize: 14, fontWeight: 900, color: '#F5C400' }}>ESCOLHER JOGADOR</h3>
                    <button onClick={() => setActiveSlot(null)} style={{ background:'rgba(255,255,255,0.1)', border:'none', color:'#fff', padding:'8px 15px', borderRadius:8, fontWeight:900 }}>X</button>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:12, padding: 20, maxHeight: '60vh', overflowY: 'auto' }}>
                    {PLAYERS.filter(p => !allSelectedIds.includes(p.id)).map(p => (
                        <div key={p.id} onClick={() => {
                            if(RESERVES_SLOTS.includes(activeSlot)) setReserves({...reserves, [activeSlot]: p});
                            else setLineup({...lineup, [activeSlot]: p});
                            setActiveSlot(null);
                        }}>
                            <PlayerCard player={p} size={(fieldWidth/4) - 20} />
                        </div>
                    ))}
                </div>
             </div>
          </div>
        )}

        {/* PASSO DE PALPITE */}
        {step === 'palpite' && (
          <div style={{ textAlign:'center', padding:40, background:'#111', borderRadius:24, border:'2px solid #F5C400', animation: 'card-entry 0.5s ease' }}>
            <h3 style={{ color:'#F5C400', fontWeight: 1000, marginBottom:30 }}>PLACAR DO JOGO</h3>
            <div style={{ display:'flex', justifyContent:'center', alignItems:'center', gap:25 }}>
              <div style={{ textAlign:'center' }}>
                <span style={{ fontSize:10, opacity:0.6, display:'block', marginBottom:10 }}>TIGRE FC</span>
                <input type="number" value={palpite.mandante} onChange={e => setPalpite({...palpite, mandante: Number(e.target.value)})} style={{ width:80, height:80, textAlign:'center', borderRadius:16, border:'none', background:'#222', color:'#fff', fontSize:32, fontWeight:900 }} />
              </div>
              <div style={{ fontSize:24, fontWeight:900, marginTop:20 }}>X</div>
              <div style={{ textAlign:'center' }}>
                <span style={{ fontSize:10, opacity:0.6, display:'block', marginBottom:10 }}>ADVERSÁRIO</span>
                <input type="number" value={palpite.visitante} onChange={e => setPalpite({...palpite, visitante: Number(e.target.value)})} style={{ width:80, height:80, textAlign:'center', borderRadius:16, border:'none', background:'#222', color:'#fff', fontSize:32, fontWeight:900 }} />
              </div>
            </div>
          </div>
        )}

        {/* TELA FINALIZADA */}
        {step === 'finalizado' && (
            <div style={{ textAlign:'center', padding:40, animation: 'card-entry 0.6s ease' }}>
                <div style={{ background:'#111', padding:40, borderRadius:30, border:'2px solid #F5C400' }}>
                    <img src={LOGO} style={{ width: 80, marginBottom:20 }} />
                    <h2 style={{ fontWeight:1000, color:'#F5C400' }}>TIME ENVIADO!</h2>
                    <p style={{ opacity:0.7, fontSize:14 }}>Sua escalação de elite foi salva com sucesso, Felipe.</p>
                </div>
                <button onClick={() => window.location.reload()} style={{ marginTop:20, background:'none', border:'none', color:'#F5C400', fontWeight:900 }}>NOVA ESCALAÇÃO</button>
            </div>
        )}

        {/* BOTÃO DE AÇÃO DINÂMICO (ESTILO EA) */}
        {step !== 'finalizado' && (
            <div style={{ position:'fixed', bottom:0, left:0, width:'100%', padding:'30px 20px', background:'linear-gradient(transparent, #000 50%)', zIndex:3000 }}>
                <button 
                    disabled={saving}
                    onClick={() => {
                        if(step==='escalar' && filledMain===11 && filledRes===5) setStep('capitao');
                        else if(step==='capitao' && capitao) setStep('heroi');
                        else if(step==='heroi' && heroi) setStep('palpite');
                        else if(step==='palpite') setStep('confirmar');
                        else if(step==='confirmar') handleSalvar();
                    }}
                    style={{ 
                        width:'100%', padding:22, borderRadius:16, border:'none', 
                        background: (filledMain === 11 && filledRes === 5) || step !== 'escalar' ? '#F5C400' : '#222',
                        color:'#000', fontWeight:1000, fontSize:15, textTransform:'uppercase', letterSpacing:'1px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)', cursor:'pointer', transition:'all 0.3s'
                    }}>
                    {getBtnText(step, filledMain, filledRes, capitao, heroi, saving)}
                </button>
                {step !== 'escalar' && (
                    <button onClick={() => setStep('escalar')} style={{ width:'100%', background:'transparent', color:'#888', border:'none', marginTop:15, fontWeight:700 }}>VOLTAR À ESCALAÇÃO</button>
                )}
            </div>
        )}

      </div>

      <style jsx global>{`
        body { background: #050505; }
        .slot-empty { 
            width: 45px; height: 45px; border-radius: 50%; border: 2px dashed #F5C400; 
            color: #F5C400; display: flex; align-items: center; justifyContent: center;
            background: rgba(245,196,0,0.05); transition: 0.3s;
        }
        .slot-active { 
            width: 50px; height: 50px; border-radius: 50%; border: 3px solid #F5C400; 
            color: #F5C400; display: flex; align-items: center; justifyContent: center;
            background: rgba(245,196,0,0.2); animation: pulse 1s infinite;
        }
        .slot-res-empty {
            width: 50px; height: 65px; border-radius: 8px; border: 1px dashed #444;
            display: flex; align-items: center; justifyContent: center; color: #444;
        }
        .slot-res-active {
            width: 50px; height: 65px; border-radius: 8px; border: 2px solid #F5C400;
            display: flex; align-items: center; justifyContent: center; color: #F5C400;
            background: rgba(245,196,0,0.1); animation: pulse 1s infinite;
        }
        .market-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.85); z-index: 4000; display: flex; align-items: flex-end;
        }
        .market-content {
            width: 100%; background: #0a0a0a; border-radius: 30px 30px 0 0;
            border-top: 2px solid #F5C400; animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes pulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.1); opacity: 0.7; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
      `}</style>
    </main>
  );
}

function getBtnText(step: any, m: number, r: number, cap: any, her: any, sav: boolean) {
    if(sav) return "PROCESSANDO...";
    if(step === 'escalar') return (m === 11 && r === 5) ? "DEFINIR CAPITÃO →" : `FALTAM ${11-m} TITULARES`;
    if(step === 'capitao') return !cap ? "ESCOLHA O CAPITÃO NO CAMPO" : "DEFINIR HERÓI DA RODADA →";
    if(step === 'heroi') return !her ? "ESCOLHA O HERÓI NO CAMPO" : "DAR PALPITE FINAL →";
    return "FINALIZAR ESCALAÇÃO 🐯";
}
