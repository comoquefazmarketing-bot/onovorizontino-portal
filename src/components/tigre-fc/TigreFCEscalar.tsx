'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { persistSession: true, autoRefreshToken: true } }
);

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
  { id:'gk',  label:'GOL', x:50, y:92 }, { id:'rb',  label:'LAT', x:85, y:72 },
  { id:'cb1', label:'ZAG', x:62, y:78 }, { id:'cb2', label:'ZAG', x:38, y:78 },
  { id:'lb',  label:'LAT', x:15, y:72 }, { id:'cm1', label:'MEI', x:75, y:52 },
  { id:'cm2', label:'MEI', x:50, y:55 }, { id:'cm3', label:'MEI', x:25, y:52 },
  { id:'rw',  label:'ATA', x:82, y:22 }, { id:'st',  label:'ATA', x:50, y:12 },
  { id:'lw',  label:'ATA', x:18, y:22 },
];

const RESERVES_SLOTS = ['res1', 'res2', 'res3', 'res4', 'res5'];

type Player = typeof PLAYERS[0];
type Lineup = Record<string, Player | null>;

function PlayerCard({ player, size, isCapitao, isHeroi, isField, isSelected }: { player: Player, size: number, isCapitao?: boolean, isHeroi?: boolean, isField?: boolean, isSelected?: boolean }) {
  return (
    <div style={{ width: size, animation: 'card-entry 0.6s ease-out' }}>
      <div style={{
        position: 'relative', width: size, height: size * 1.38,
        background: '#111', borderRadius: '8px', overflow: 'hidden',
        border: `1.5px solid ${isCapitao ? '#F5C400' : isHeroi ? '#00E5FF' : 'rgba(255,255,255,0.1)'}`,
        transform: isField ? 'rotateX(-15deg)' : 'none',
        boxShadow: isCapitao ? '0 0 15px rgba(245,196,0,0.5)' : isHeroi ? '0 0 15px rgba(0,229,255,0.5)' : 'none',
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        <div style={{
          width: '100%', height: '100%', 
          backgroundImage: `url(${player.foto})`,
          backgroundSize: '200% 100%', // Define o dobro da largura para a foto dupla
          backgroundPosition: isSelected || isField ? 'right center' : 'left center', // Slide da esquerda p/ direita
          transition: 'background-position 0.6s ease-in-out',
          maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)'
        }} />
        
        {isCapitao && <div style={{ position:'absolute', top:2, right:2, background:'#F5C400', color:'#000', fontSize:8, fontWeight:900, padding:'2px 4px', borderRadius:4, zIndex:5 }}>C</div>}
        {isHeroi && <div style={{ position:'absolute', top:2, left:2, background:'#00E5FF', color:'#000', fontSize:8, fontWeight:900, padding:'2px 4px', borderRadius:4, zIndex:5 }}>H</div>}

        <div style={{ position: 'absolute', bottom: 0, width: '100%', background: 'rgba(0,0,0,0.9)', padding: '4px 0', textAlign: 'center', zIndex:5 }}>
          <div style={{ color: isCapitao ? '#F5C400' : '#fff', fontSize: Math.max(size * 0.14, 9), fontWeight: 900 }}>{player.short}</div>
        </div>
      </div>
    </div>
  );
}

export default function TigreFCEscalar({ jogoId }: { jogoId: number }) {
  const [step, setStep] = useState<'login' | 'escalar' | 'reserva' | 'capitao' | 'heroi' | 'palpite' | 'confirmar' | 'finalizado'>('login');
  const [lineup, setLineup] = useState<Lineup>({});
  const [reserves, setReserves] = useState<Lineup>({});
  const [capitao, setCapitao] = useState<number | null>(null);
  const [heroi, setHeroi] = useState<number | null>(null);
  const [palpite, setPalpite] = useState({ mandante: 0, visitante: 0 });
  const [usuario, setUsuario] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [fieldWidth, setFieldWidth] = useState(360);

  useEffect(() => {
    const update = () => setFieldWidth(Math.min(window.innerWidth - 32, 450));
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
      user_id: usuario?.id,
      jogo_id: jogoId,
      jogadores: lineup,
      reservas: reserves,
      capitao_id: capitao,
      heroi_id: heroi,
      palpite: palpite,
      updated_at: new Date()
    });
    setSaving(false);
    if (!error) setStep('finalizado');
  };

  if (step === 'login') return (
    <div style={{ height:'100vh', background:'#050505', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column' }}>
        <img src={LOGO} style={{ width:120, marginBottom:40 }} />
        <button onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })} style={{ padding:'20px 40px', borderRadius:16, border:'none', background:'#fff', fontWeight:900, cursor:'pointer' }}>ENTRAR COM GOOGLE</button>
    </div>
  );

  const filledMain = Object.values(lineup).filter(Boolean) as Player[];
  const filledReserves = Object.values(reserves).filter(Boolean) as Player[];
  const allSelectedIds = [...filledMain, ...filledReserves].map(p => p.id);

  return (
    <main style={{ minHeight:'100vh', background:'#050505', color:'#fff', paddingBottom:140 }}>
      <div style={{ background:'#F5C400', padding:16, textAlign:'center', position:'sticky', top:0, zIndex:1000 }}>
        <div style={{ color:'#000', fontWeight:1000, fontSize:12 }}>{step.toUpperCase()}</div>
      </div>

      <div style={{ maxWidth: 480, margin: '0 auto', padding: '10px 16px' }}>
        
        {/* CAMPO 3D */}
        {(['escalar', 'reserva', 'capitao', 'heroi', 'confirmar'].includes(step)) && (
          <div style={{ perspective: '1200px', margin: '20px 0' }}>
            <div style={{
              width: fieldWidth, height: fieldWidth * 1.3, margin: '0 auto',
              background: 'linear-gradient(180deg, #1a4a1a 0%, #0a2a0a 100%)',
              borderRadius: '16px', position: 'relative', border: '2px solid rgba(255,255,255,0.1)',
              transform: 'rotateX(20deg)', transition: '0.5s'
            }}>
              {FORMATION.map((slot) => {
                const p = lineup[slot.id];
                return (
                  <div key={slot.id} onClick={() => step === 'escalar' && handleTapMain(slot.id, p)} style={{
                    position: 'absolute', left: `${slot.x}%`, top: `${slot.y}%`,
                    transform: 'translate(-50%, -50%)', zIndex: 10, cursor: 'pointer'
                  }}>
                    {p ? (
                      <div onClick={() => {
                        if(step === 'capitao') setCapitao(p.id);
                        if(step === 'heroi') setHeroi(p.id);
                      }}>
                        <PlayerCard player={p} size={fieldWidth * 0.16} isField isCapitao={capitao === p.id} isHeroi={heroi === p.id} isSelected />
                      </div>
                    ) : (
                      <div style={{ width: 35, height: 35, borderRadius: '50%', border: '1.5px dashed #F5C400', color: '#F5C400', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* BANCO DE RESERVAS (UI Especial) */}
        {step === 'reserva' && (
           <div style={{ background: '#111', borderRadius: 20, padding: 20, marginBottom: 20, border: '1px solid #333' }}>
             <h4 style={{ color: '#F5C400', fontSize: 12, marginBottom: 15, textAlign: 'center' }}>SELECIONE 5 RESERVAS</h4>
             <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
               {RESERVES_SLOTS.map(slotId => {
                 const p = reserves[slotId];
                 return (
                   <div key={slotId} onClick={() => handleTapReserve(slotId, p)} style={{ cursor: 'pointer' }}>
                      {p ? (
                        <PlayerCard player={p} size={fieldWidth * 0.15} isSelected />
                      ) : (
                        <div style={{ width: 50, height: 70, borderRadius: 8, border: '1px dashed #555', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555' }}>+</div>
                      )}
                   </div>
                 );
               })}
             </div>
           </div>
        )}

        {/* MERCADO COM LÓGICA DE OFFSET */}
        {(step === 'escalar' || step === 'reserva') && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:10, background:'#111', padding:15, borderRadius:20 }}>
            {PLAYERS.filter(p => !allSelectedIds.includes(p.id)).map(p => (
              <div key={p.id} onClick={() => step === 'escalar' ? handleSelectMain(p) : handleSelectReserve(p)} style={{ cursor:'pointer' }}>
                <PlayerCard player={p} size={(fieldWidth/4) - 20} />
              </div>
            ))}
          </div>
        )}

        {/* PALPITE E FINALIZAÇÃO */}
        {step === 'palpite' && (
          <div style={{ textAlign:'center', padding:40, background:'#111', borderRadius:24, border:'1px solid #F5C400' }}>
            <h3 style={{ color:'#F5C400', marginBottom:30 }}>PLACAR FINAL</h3>
            <div style={{ display:'flex', justifyContent:'center', alignItems:'center', gap:20 }}>
              <input type="number" value={palpite.mandante} onChange={e => setPalpite({...palpite, mandante: Number(e.target.value)})} style={{ width:70, height:70, textAlign:'center', borderRadius:15, border:'none', fontSize:28, fontWeight:900 }} />
              <div style={{ fontSize:24 }}>X</div>
              <input type="number" value={palpite.visitante} onChange={e => setPalpite({...palpite, visitante: Number(e.target.value)})} style={{ width:70, height:70, textAlign:'center', borderRadius:15, border:'none', fontSize:28, fontWeight:900 }} />
            </div>
          </div>
        )}

        {/* CONTROLES FIXOS */}
        <div style={{ position:'fixed', bottom:0, left:0, width:'100%', padding:20, background:'linear-gradient(transparent, #000 70%)', zIndex:2000 }}>
           <button onClick={handleNextStep} disabled={saving} style={{ width:'100%', padding:22, borderRadius:16, border:'none', background:'#F5C400', color:'#000', fontWeight:1000, fontSize:14 }}>
             {getButtonText()}
           </button>
           {step !== 'escalar' && step !== 'finalizado' && (
             <button onClick={handlePrevStep} style={{ width:'100%', background:'transparent', color:'#888', border:'none', marginTop:10 }}>← VOLTAR</button>
           )}
        </div>

      </div>
    </main>
  );

  function handleSelectMain(p: Player) {
    const empty = FORMATION.find(s => !lineup[s.id]);
    if(empty) setLineup({...lineup, [empty.id]: p});
  }

  function handleTapMain(id: string, p: Player | null) {
    if(p) setLineup({...lineup, [id]: null});
  }

  function handleSelectReserve(p: Player) {
    const empty = RESERVES_SLOTS.find(s => !reserves[s]);
    if(empty) setReserves({...reserves, [empty]: p});
  }

  function handleTapReserve(id: string, p: Player | null) {
    if(p) setReserves({...reserves, [id]: null});
  }

  function handleNextStep() {
    if (step === 'escalar' && filledMain.length === 11) setStep('reserva');
    else if (step === 'reserva' && filledReserves.length === 5) setStep('capitao');
    else if (step === 'capitao' && capitao) setStep('heroi');
    else if (step === 'heroi' && heroi) setStep('palpite');
    else if (step === 'palpite') setStep('confirmar');
    else if (step === 'confirmar') handleSalvar();
  }

  function handlePrevStep() {
    const steps: any[] = ['escalar', 'reserva', 'capitao', 'heroi', 'palpite', 'confirmar'];
    setStep(steps[steps.indexOf(step) - 1]);
  }

  function getButtonText() {
    if(saving) return "PROCESSANDO...";
    if(step === 'escalar') return filledMain.length < 11 ? `ESCALAR TITULARES (${filledMain.length}/11)` : "ESCOLHER RESERVAS →";
    if(step === 'reserva') return filledReserves.length < 5 ? `BANCO DE RESERVAS (${filledReserves.length}/5)` : "ESCOLHER CAPITÃO →";
    if(step === 'capitao') return !capitao ? "QUEM SERÁ O CAPITÃO?" : "ESCOLHER HERÓI →";
    if(step === 'heroi') return !heroi ? "QUEM SERÁ O HERÓI?" : "DEFINIR PLACAR →";
    return "CONFIRMAR TUDO 🐯";
  }
}
