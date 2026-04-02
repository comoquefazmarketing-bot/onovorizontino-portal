'use client';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import TigreFCLogin from '@/components/tigre-fc/TigreFCLogin';
import html2canvas from 'html2canvas';

// CONFIGURAÇÃO SUPABASE COM PERSISTÊNCIA (Correção Mobile)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);

const LOGO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/tigre-fc-logo.png';
const BASE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';
const MINUTOS_ANTECEDENCIA = 90; 

// --- BASE DE DADOS INTEGRAL ---
const PLAYERS = [
  { id: 1,  name: 'César Augusto',   short: 'César',      num: 31, pos: 'GOL', foto: BASE+'CESAR-AUGUSTO.jpg.webp' },
  { id: 2,  name: 'Jordi',           short: 'Jordi',      num: 93, pos: 'GOL', foto: BASE+'JORDI.jpg.webp' },
  { id: 3,  name: 'João Scapin',     short: 'Scapin',     num: 12, pos: 'GOL', foto: BASE+'JOAO-SCAPIN.jpg.webp' },
  { id: 4,  name: 'Lucas Ribeiro',   short: 'Lucas',      num: 1,  pos: 'GOL', foto: BASE+'LUCAS-RIBEIRO.jpg.webp' },
  { id: 5,  name: 'Lora',            short: 'Lora',       num: 2,  pos: 'LAT', foto: BASE+'LORA.jpg.webp' },
  { id: 6,  name: 'Castrillón',      short: 'Castrillón', num: 6,  pos: 'LAT', foto: BASE+'CASTRILLON.jpg.webp' },
  { id: 7,  name: 'Arthur Barbosa',  short: 'A.Barbosa',  num: 22, pos: 'LAT', foto: BASE+'ARTHUR-BARBOSA.jpg.webp' },
  { id: 8,  name: 'Mayk',            short: 'Mayk',       num: 26, pos: 'LAT', foto: BASE+'MAYK.jpg.webp' },
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

const FORMATIONS = {
  '4-3-3': [
    { id: 'gk',  label: 'GOL', x: 50, y: 88 },
    { id: 'rb',  label: 'LAT', x: 82, y: 68 }, { id: 'cb1', label: 'ZAG', x: 62, y: 72 }, { id: 'cb2', label: 'ZAG', x: 38, y: 72 }, { id: 'lb',  label: 'LAT', x: 18, y: 68 },
    { id: 'cm1', label: 'MEI', x: 75, y: 48 }, { id: 'cm2', label: 'MEI', x: 50, y: 45 }, { id: 'cm3', label: 'MEI', x: 25, y: 48 },
    { id: 'rw',  label: 'ATA', x: 80, y: 22 }, { id: 'st',  label: 'ATA', x: 50, y: 15 }, { id: 'lw',  label: 'ATA', x: 20, y: 22 },
  ],
  '4-4-2': [
    { id: 'gk',  label: 'GOL', x: 50, y: 88 },
    { id: 'rb',  label: 'LAT', x: 82, y: 68 }, { id: 'cb1', label: 'ZAG', x: 62, y: 72 }, { id: 'cb2', label: 'ZAG', x: 38, y: 72 }, { id: 'lb',  label: 'LAT', x: 18, y: 68 },
    { id: 'rm',  label: 'MEI', x: 80, y: 48 }, { id: 'cm1', label: 'MEI', x: 60, y: 48 }, { id: 'cm2', label: 'MEI', x: 40, y: 48 }, { id: 'lm',  label: 'MEI', x: 20, y: 48 },
    { id: 'st1', label: 'ATA', x: 65, y: 20 }, { id: 'st2', label: 'ATA', x: 35, y: 20 },
  ],
};

// Componente de Card Individual
function PlayerCard({ player, size=50, isCapitao, isHeroi, onClick }: any) {
  if (!player) return (
    <div onClick={onClick} style={{ width: size, height: size, borderRadius:'50%', border:'2px dashed rgba(255,255,255,0.4)', background:'rgba(0,0,0,0.3)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
      <span style={{ fontSize:20, color:'#fff', fontWeight:100 }}>+</span>
    </div>
  );
  return (
    <div onClick={onClick} style={{ width: size, textAlign:'center', position:'relative', cursor:'pointer' }}>
      {isCapitao && <div style={{ position:'absolute', top:-15, left:'50%', transform:'translateX(-50%)', zIndex:10, fontSize:16 }}>👑</div>}
      {isHeroi && <div style={{ position:'absolute', top:-15, left:'50%', transform:'translateX(-50%)', zIndex:10, fontSize:16 }}>⭐</div>}
      <div style={{ width: size, height: size, borderRadius:'50%', overflow:'hidden', border:'2px solid #F5C400', background:'#111' }}>
        <img src={player.foto} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
      </div>
      <div style={{ background:'#F5C400', color:'#000', fontSize: size*0.18, fontWeight:1000, borderRadius:4, marginTop:-8, position:'relative', zIndex:2, padding:'1px 4px', whiteSpace:'nowrap', boxShadow:'0 2px 4px rgba(0,0,0,0.3)' }}>
        {player.short.toUpperCase()}
      </div>
    </div>
  );
}

export default function TigreFCEscalar({ jogoId }: { jogoId: number }) {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState('login');
  const [usuario, setUsuario] = useState<any>(null);
  const [mercadoAberto, setMercadoAberto] = useState(true);
  const [formation, setFormation] = useState('4-3-3');
  const [lineup, setLineup] = useState<any>({});
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [filterPos, setFilterPos] = useState('TODOS');
  const [capitao, setCapitao] = useState<any>(null);
  const [heroi, setHeroi] = useState<any>(null);
  const [palpite, setPalpite] = useState({ mandante: 1, visitante: 0 });
  const [saving, setSaving] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    checkSessionAndMarket();
  }, [jogoId]);

  async function checkSessionAndMarket() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      setUsuario(session.user);
      setStep('escalar');
    }

    const { data: jogo } = await supabase.from('tigre_fc_jogos').select('horario_jogo').eq('id', jogoId).single();
    if (jogo) {
      const limite = new Date(new Date(jogo.horario_jogo).getTime() - MINUTOS_ANTECEDENCIA * 60000);
      if (new Date() > limite) setMercadoAberto(false);
    }
  }

  const handleSalvar = async () => {
    if (!usuario || !mercadoAberto) return;
    setSaving(true);
    try {
      const { error } = await supabase.from('tigre_fc_escalacoes').upsert({
        usuario_id: usuario.id, jogo_id: jogoId, formacao: formation, lineup, capitao_id: capitao?.id, heroi_id: heroi?.id
      }, { onConflict: 'usuario_id,jogo_id' });

      await supabase.from('tigre_fc_palpites').upsert({
        usuario_id: usuario.id, jogo_id: jogoId, gols_mandante: palpite.mandante, gols_visitante: palpite.visitante
      }, { onConflict: 'usuario_id,jogo_id' });

      if (error) throw error;
      setStep('sucesso');
    } catch (e) { alert("Erro ao salvar sua escalação."); }
    finally { setSaving(false); }
  };

  if (!mounted) return null;
  if (step === 'login') return <TigreFCLogin jogoId={jogoId} onSuccess={(u) => { setUsuario(u); setStep('escalar'); }} />;

  const filledCount = Object.keys(lineup).length;

  return (
    <main style={{ minHeight:'100vh', background:'#080808', color:'#fff', paddingBottom:120 }}>
      {/* Header Fixo */}
      <div style={{ background:'#F5C400', padding:'12px 20px', display:'flex', justifyContent:'space-between', alignItems:'center', position:'sticky', top:0, zIndex:100, boxShadow:'0 2px 10px rgba(0,0,0,0.5)' }}>
        <img src={LOGO} style={{ width:24 }} />
        <div style={{ color:'#000', fontWeight:1000, fontSize:11, letterSpacing:1 }}>{step.toUpperCase()}</div>
        {!mercadoAberto && <div style={{ color:'red', fontSize:10, fontWeight:900 }}>FECHADO</div>}
      </div>

      <div style={{ maxWidth:450, margin:'0 auto', padding:16 }}>
        
        {step === 'escalar' && (
          <>
            <div style={{ display:'flex', gap:8, marginBottom:20 }}>
              {Object.keys(FORMATIONS).map(f => (
                <button key={f} onClick={() => { setFormation(f); setLineup({}); }} style={{ flex:1, padding:12, borderRadius:12, background: formation===f?'#F5C400':'#1a1a1a', color: formation===f?'#000':'#666', border:'none', fontWeight:1000, fontSize:12 }}>{f}</button>
              ))}
            </div>

            {/* CAMPO 3D COM PERSPECTIVA REAL */}
            <div style={{ 
              position:'relative', width:'100%', height:500, 
              background:'radial-gradient(circle at center, #2e7d32 0%, #1b5e20 100%)', 
              borderRadius:24, border:'3px solid #333', overflow:'hidden',
              perspective: '1200px'
            }}>
              <div style={{ 
                position:'absolute', width:'100%', height:'100%', 
                transform:'rotateX(25deg)', transformOrigin:'bottom'
              }}>
                {/* Linhas do Gramado */}
                <div style={{ position:'absolute', top:'50%', left:0, right:0, height:2, background:'rgba(255,255,255,0.15)' }} />
                <div style={{ position:'absolute', top:'50%', left:'50%', width:120, height:120, border:'2px solid rgba(255,255,255,0.15)', borderRadius:'50%', transform:'translate(-50%, -50%)' }} />
                
                {FORMATIONS[formation as keyof typeof FORMATIONS].map(slot => (
                  <div key={slot.id} style={{ position:'absolute', left:`${slot.x}%`, top:`${slot.y}%`, transform:'translate(-50%, -50%)' }}>
                    <PlayerCard 
                      player={lineup[slot.id]} 
                      size={55} 
                      onClick={() => { setSelectedSlot(slot); setFilterPos(slot.label); }} 
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* GAVETA DE SELEÇÃO (OVERLAY) */}
            {selectedSlot && (
              <div style={{ position:'fixed', bottom:0, left:0, right:0, background:'#0f0f0f', borderTop:'3px solid #F5C400', borderTopLeftRadius:30, borderTopRightRadius:30, zIndex:1000, padding:20, maxHeight:'75vh', overflowY:'auto', boxShadow:'0 -10px 30px rgba(0,0,0,0.8)' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:20, alignItems:'center' }}>
                  <div style={{ fontWeight:1000, fontSize:14, color:'#F5C400' }}>SELECIONAR {selectedSlot.label}</div>
                  <button onClick={() => setSelectedSlot(null)} style={{ background:'#222', border:'none', color:'#fff', padding:'8px 15px', borderRadius:10, fontWeight:900, fontSize:12 }}>VOLTAR</button>
                </div>

                <div style={{ display:'flex', gap:6, marginBottom:20, overflowX:'auto', paddingBottom:5 }}>
                  {['TODOS', 'GOL', 'LAT', 'ZAG', 'MEI', 'ATA'].map(p => (
                    <button key={p} onClick={() => setFilterPos(p)} style={{ padding:'8px 16px', borderRadius:20, background: filterPos===p?'#F5C400':'#1a1a1a', color: filterPos===p?'#000':'#fff', border:'none', fontSize:10, fontWeight:1000 }}>{p}</button>
                  ))}
                </div>

                <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:15 }}>
                  {PLAYERS.filter(p => filterPos==='TODOS' || p.pos===filterPos).map(p => {
                    const isSelected = Object.values(lineup).some((s:any) => s?.id === p.id);
                    return (
                      <div key={p.id} onClick={() => { if(!isSelected){ setLineup({...lineup, [selectedSlot.id]: p}); setSelectedSlot(null); } }} style={{ textAlign:'center', opacity: isSelected?0.3:1 }}>
                        <div style={{ width:70, height:70, margin:'0 auto', borderRadius:'50%', overflow:'hidden', border: isSelected?'none':'2px solid #333' }}>
                          <img src={p.foto} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                        </div>
                        <div style={{ fontSize:10, fontWeight:800, marginTop:6 }}>{p.short}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {/* STEPS DE CAPITÃO E HERÓI */}
        {['capitao', 'heroi'].includes(step) && (
          <div style={{ textAlign:'center' }}>
            <h2 style={{ color:'#F5C400', fontWeight:1000, fontSize:22, fontStyle:'italic' }}>
              {step==='capitao' ? 'QUEM SERÁ O CAPITÃO? 👑' : 'QUEM É O SEU HERÓI? ⭐'}
            </h2>
            <p style={{ color:'#666', fontSize:12, marginBottom:30 }}>{step==='capitao' ? 'O capitão ganha pontos dobrados!' : 'O herói garante bônus se marcar gol.'}</p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:20 }}>
              {Object.values(lineup).map((p:any) => (
                <div key={p.id} onClick={() => step==='capitao' ? setCapitao(p) : setHeroi(p)} style={{ transform: (step==='capitao'?capitao:heroi)?.id===p.id ? 'scale(1.1)' : 'scale(1)', transition:'0.2s' }}>
                  <PlayerCard player={p} size={80} isCapitao={capitao?.id===p.id} isHeroi={heroi?.id===p.id} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP DE PALPITE PLACAR */}
        {step === 'palpite' && (
          <div style={{ textAlign:'center', marginTop:40 }}>
            <h2 style={{ color:'#F5C400', fontWeight:1000 }}>PLACAR FINAL ⚽</h2>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:20, marginTop:40 }}>
              <div>
                <div style={{ fontSize:10, color:'#F5C400', fontWeight:900, marginBottom:8 }}>AMAZONAS</div>
                <input type="number" value={palpite.mandante} onChange={(e)=>setPalpite({...palpite, mandante: parseInt(e.target.value)})} style={{ width:75, height:75, borderRadius:20, background:'#111', border:'2px solid #333', color:'#fff', textAlign:'center', fontSize:32, fontWeight:1000 }} />
              </div>
              <div style={{ fontSize:24, fontWeight:1000, marginTop:20 }}>X</div>
              <div>
                <div style={{ fontSize:10, color:'#888', fontWeight:900, marginBottom:8 }}>VISITANTE</div>
                <input type="number" value={palpite.visitante} onChange={(e)=>setPalpite({...palpite, visitante: parseInt(e.target.value)})} style={{ width:75, height:75, borderRadius:20, background:'#111', border:'2px solid #333', color:'#fff', textAlign:'center', fontSize:32, fontWeight:1000 }} />
              </div>
            </div>
          </div>
        )}

        {/* SUCESSO */}
        {step === 'sucesso' && (
          <div style={{ textAlign:'center', padding:40 }}>
            <div style={{ fontSize:60, marginBottom:20 }}>🐯</div>
            <h2 style={{ color:'#F5C400', fontWeight:1000, fontSize:28 }}>ESCALADO!</h2>
            <p style={{ color:'#888', lineHeight:1.5 }}>Sua escalação e palpite foram salvos no sistema do Tigre FC.</p>
            <button onClick={() => window.location.reload()} style={{ marginTop:40, background:'#fff', color:'#000', padding:'18px 40px', borderRadius:16, fontWeight:1000, border:'none', width:'100%' }}>VOLTAR</button>
          </div>
        )}
      </div>

      {/* Botão de Ação Fixo */}
      {step !== 'sucesso' && (
        <div style={{ position:'fixed', bottom:0, width:'100%', padding:20, background:'linear-gradient(transparent, #000 40%)', zIndex:200 }}>
          <button 
            disabled={!mercadoAberto || saving || (step==='escalar' && filledCount < 11)}
            onClick={() => {
              if (step==='escalar') setStep('capitao');
              else if (step==='capitao' && capitao) setStep('heroi');
              else if (step==='heroi' && heroi) setStep('palpite');
              else if (step==='palpite') handleSalvar();
            }}
            style={{ 
              width:'100%', padding:22, borderRadius:20, background: mercadoAberto?'#F5C400':'#222', color:'#000', 
              fontWeight:1000, border:'none', fontSize:14, textTransform:'uppercase',
              opacity: (step==='escalar' && filledCount<11) ? 0.5 : 1
            }}
          >
            {!mercadoAberto ? 'MERCADO FECHADO' : 
             step==='escalar' ? (filledCount<11 ? `ESCALAR MAIS ${11-filledCount}` : 'PRÓXIMO: CAPITÃO →') :
             step==='capitao' ? 'PRÓXIMO: HERÓI →' :
             step==='heroi' ? 'DAR PALPITE →' :
             (saving ? 'SALVANDO...' : 'CONFIRMAR ESCALAÇÃO 🐯')}
          </button>
        </div>
      )}
    </main>
  );
}
