'use client';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import TigreFCLogin from '@/components/tigre-fc/TigreFCLogin';

// CONFIGURAÇÃO SUPABASE COM PERSISTÊNCIA (Correção para não deslogar no Mobile)
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

// --- BASE DE DADOS COMPLETA ---
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
    { id: 'gk',  label: 'GOL', x: 50, y: 92 },
    { id: 'rb',  label: 'LAT', x: 85, y: 72 }, { id: 'cb1', label: 'ZAG', x: 62, y: 76 }, { id: 'cb2', label: 'ZAG', x: 38, y: 76 }, { id: 'lb',  label: 'LAT', x: 15, y: 72 },
    { id: 'cm1', label: 'MEI', x: 75, y: 52 }, { id: 'cm2', label: 'MEI', x: 50, y: 54 }, { id: 'cm3', label: 'MEI', x: 25, y: 52 },
    { id: 'rw',  label: 'ATA', x: 80, y: 28 }, { id: 'st',  label: 'ATA', x: 50, y: 20 }, { id: 'lw',  label: 'ATA', x: 20, y: 28 },
  ],
  '4-4-2': [
    { id: 'gk',  label: 'GOL', x: 50, y: 92 },
    { id: 'rb',  label: 'LAT', x: 85, y: 72 }, { id: 'cb1', label: 'ZAG', x: 62, y: 76 }, { id: 'cb2', label: 'ZAG', x: 38, y: 76 }, { id: 'lb',  label: 'LAT', x: 15, y: 72 },
    { id: 'rm',  label: 'MEI', x: 82, y: 52 }, { id: 'cm1', label: 'MEI', x: 60, y: 54 }, { id: 'cm2', label: 'MEI', x: 40, y: 54 }, { id: 'lm',  label: 'MEI', x: 18, y: 52 },
    { id: 'st1', label: 'ATA', x: 65, y: 24 }, { id: 'st2', label: 'ATA', x: 35, y: 24 },
  ],
};

export default function TigreFCEscalar({ jogoId }: { jogoId: number }) {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState('login');
  const [usuario, setUsuario] = useState<any>(null);
  const [formation, setFormation] = useState('4-3-3');
  const [lineup, setLineup] = useState<any>({});
  
  // LOGICA DE SELEÇÃO LIVRE
  const [activePlayer, setActivePlayer] = useState<any>(null);
  const [filterPos, setFilterPos] = useState('TODOS');
  
  const [capitao, setCapitao] = useState<any>(null);
  const [heroi, setHeroi] = useState<any>(null);
  const [palpite, setPalpite] = useState({ mandante: 1, visitante: 0 });
  const [saving, setSaving] = useState(false);
  const [mercadoAberto, setMercadoAberto] = useState(true);

  useEffect(() => {
    setMounted(true);
    checkSession();
  }, [jogoId]);

  async function checkSession() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) { setUsuario(session.user); setStep('escalar'); }
    
    const { data: jogo } = await supabase.from('tigre_fc_jogos').select('horario_jogo').eq('id', jogoId).single();
    if (jogo) {
      const limite = new Date(new Date(jogo.horario_jogo).getTime() - MINUTOS_ANTECEDENCIA * 60000);
      if (new Date() > limite) setMercadoAberto(false);
    }
  }

  const handleSlotClick = (slotId: string) => {
    if (!mercadoAberto) return;
    if (activePlayer) {
      // Se já tem um jogador selecionado na lista, coloca ele no slot
      setLineup({ ...lineup, [slotId]: activePlayer });
      setActivePlayer(null);
    } else if (lineup[slotId]) {
      // Se clicar num slot ocupado sem ter player selecionado, remove o jogador do campo
      const newLineup = { ...lineup };
      delete newLineup[slotId];
      setLineup(newLineup);
    }
  };

  const handleSalvar = async () => {
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
    } catch (e) { alert("Erro ao salvar!"); }
    finally { setSaving(false); }
  };

  if (!mounted) return null;
  if (step === 'login') return <TigreFCLogin jogoId={jogoId} onSuccess={(u) => { setUsuario(u); setStep('escalar'); }} />;

  const filledCount = Object.keys(lineup).length;

  return (
    <main style={{ minHeight: '100vh', background: '#050505', color: '#fff', paddingBottom: 180 }}>
      {/* Header Fixo */}
      <div style={{ background: '#F5C400', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 4px 15px rgba(0,0,0,0.5)' }}>
        <img src={LOGO} style={{ width: 22 }} />
        <div style={{ color: '#000', fontWeight: 1000, fontSize: 11, letterSpacing: 1 }}>TIGRE FC • {step.toUpperCase()}</div>
        <div style={{ color: '#000', fontWeight: 900, fontSize: 10 }}>{filledCount}/11</div>
      </div>

      <div style={{ maxWidth: 450, margin: '0 auto', padding: 16 }}>
        {step === 'escalar' && (
          <>
            {/* Formações */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 15 }}>
              {Object.keys(FORMATIONS).map(f => (
                <button key={f} onClick={() => { setFormation(f); setLineup({}); }} style={{ flex: 1, padding: '10px', borderRadius: 10, background: formation === f ? '#F5C400' : '#111', color: formation === f ? '#000' : '#444', border: 'none', fontWeight: 1000, fontSize: 12 }}>{f}</button>
              ))}
            </div>

            {/* CAMPO COM PERSPECTIVA 3D */}
            <div style={{ 
              position: 'relative', width: '100%', height: 480, 
              background: 'linear-gradient(to bottom, #1b5e20, #2e7d32)', 
              borderRadius: 20, border: '2px solid #333', overflow: 'hidden',
              perspective: '1000px', marginBottom: 20
            }}>
              <div style={{ 
                position: 'absolute', width: '100%', height: '110%', 
                transform: 'rotateX(25deg)', transformOrigin: 'bottom',
                background: 'repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(0,0,0,0.03) 40px, rgba(0,0,0,0.03) 80px)'
              }}>
                {/* Linhas do Campo */}
                <div style={{ position: 'absolute', top: 0, left: '8%', right: '8%', bottom: 0, border: '2px solid rgba(255,255,255,0.15)', borderBottom: 'none' }} />
                <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 2, background: 'rgba(255,255,255,0.15)' }} />
                <div style={{ position: 'absolute', top: '50%', left: '50%', width: 100, height: 100, border: '2px solid rgba(255,255,255,0.15)', borderRadius: '50%', transform: 'translate(-50%, -50%)' }} />
                
                {/* Slots de Jogadores */}
                {FORMATIONS[formation as keyof typeof FORMATIONS].map(slot => {
                  const p = lineup[slot.id];
                  return (
                    <div key={slot.id} onClick={() => handleSlotClick(slot.id)} style={{ position: 'absolute', left: `${slot.x}%`, top: `${slot.y}%`, transform: 'translate(-50%, -50%)', cursor: 'pointer' }}>
                      <div style={{ transform: 'rotateX(-25deg)', textAlign: 'center' }}>
                        {!p ? (
                          <div style={{ width: 45, height: 45, borderRadius: '50%', border: activePlayer ? '2px solid #F5C400' : '2px dashed rgba(255,255,255,0.3)', background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: activePlayer ? 'pulse 1.5s infinite' : 'none' }}>
                            <span style={{ fontSize: 10, color: '#fff', fontWeight: 900 }}>{slot.label}</span>
                          </div>
                        ) : (
                          <div style={{ width: 55, textAlign: 'center', position: 'relative' }}>
                            <div style={{ width: 52, height: 52, borderRadius: '50%', overflow: 'hidden', border: '2px solid #F5C400', background: '#000', margin: '0 auto' }}>
                              <img src={p.foto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div style={{ background: '#F5C400', color: '#000', fontSize: 8, fontWeight: 1000, borderRadius: 4, marginTop: -6, padding: '1px 4px', whiteSpace: 'nowrap', display: 'inline-block' }}>
                              {p.short.toUpperCase()}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* LISTA DE JOGADORES - SELEÇÃO LIVRE */}
            <div style={{ background: '#111', borderRadius: 20, padding: 15, border: '1px solid #222' }}>
              <div style={{ display: 'flex', gap: 6, marginBottom: 15, overflowX: 'auto', paddingBottom: 5 }}>
                {['TODOS', 'GOL', 'LAT', 'ZAG', 'MEI', 'ATA'].map(p => (
                  <button key={p} onClick={() => setFilterPos(p)} style={{ padding: '8px 15px', borderRadius: 12, background: filterPos === p ? '#F5C400' : '#222', color: filterPos === p ? '#000' : '#888', border: 'none', fontSize: 10, fontWeight: 1000 }}>{p}</button>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                {PLAYERS.filter(p => filterPos === 'TODOS' || p.pos === filterPos).map(p => {
                  const isSelected = Object.values(lineup).some((s: any) => s?.id === p.id);
                  const isActive = activePlayer?.id === p.id;
                  return (
                    <div key={p.id} onClick={() => !isSelected && setActivePlayer(p)} style={{ textAlign: 'center', opacity: isSelected ? 0.3 : 1, transition: '0.2s', transform: isActive ? 'scale(1.1)' : 'scale(1)' }}>
                      <div style={{ width: 60, height: 60, margin: '0 auto', borderRadius: '50%', overflow: 'hidden', border: isActive ? '3px solid #F5C400' : '2px solid #333', position: 'relative' }}>
                        <img src={p.foto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        {isSelected && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>✅</div>}
                      </div>
                      <div style={{ fontSize: 9, fontWeight: 800, marginTop: 5, color: isActive ? '#F5C400' : '#fff' }}>{p.short}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* OUTROS STEPS MANTIDOS */}
        {['capitao', 'heroi'].includes(step) && (
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ color: '#F5C400', fontWeight: 1000, letterSpacing: 1 }}>{step === 'capitao' ? 'QUEM É O CAPITÃO? 👑' : 'QUEM É O HERÓI? ⭐'}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginTop: 40 }}>
              {Object.values(lineup).map((p: any) => (
                <div key={p.id} onClick={() => step === 'capitao' ? setCapitao(p) : setHeroi(p)} style={{ opacity: (step==='capitao'?capitao:heroi)?.id === p.id ? 1 : 0.5 }}>
                  <div style={{ width: 80, height: 80, margin: '0 auto', borderRadius: '50%', overflow: 'hidden', border: (step==='capitao'?capitao:heroi)?.id === p.id ? '4px solid #F5C400' : '2px solid #333' }}>
                    <img src={p.foto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ marginTop: 10, fontWeight: 900, fontSize: 11 }}>{p.short.toUpperCase()}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 'palpite' && (
          <div style={{ textAlign: 'center', marginTop: 40 }}>
             <h2 style={{ color: '#F5C400', fontWeight: 1000 }}>PLACAR DO JOGO ⚽</h2>
             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, marginTop: 50 }}>
                <input type="number" value={palpite.mandante} onChange={(e)=>setPalpite({...palpite, mandante: parseInt(e.target.value)})} style={{ width: 80, height: 80, borderRadius: 20, background: '#111', border: '2px solid #333', color: '#fff', textAlign: 'center', fontSize: 32, fontWeight: 1000 }} />
                <div style={{ fontSize: 24, fontWeight: 1000 }}>X</div>
                <input type="number" value={palpite.visitante} onChange={(e)=>setPalpite({...palpite, visitante: parseInt(e.target.value)})} style={{ width: 80, height: 80, borderRadius: 20, background: '#111', border: '2px solid #333', color: '#fff', textAlign: 'center', fontSize: 32, fontWeight: 1000 }} />
             </div>
          </div>
        )}

        {step === 'sucesso' && (
          <div style={{ textAlign: 'center', padding: 50 }}>
            <h1 style={{ fontSize: 80 }}>🐯</h1>
            <h2 style={{ color: '#F5C400', fontWeight: 1000, fontSize: 24 }}>TIME ESCALADO!</h2>
            <button onClick={() => window.location.reload()} style={{ marginTop: 40, background: '#F5C400', color: '#000', padding: '18px 50px', borderRadius: 15, fontWeight: 1000, border: 'none', width: '100%' }}>VOLTAR AO INÍCIO</button>
          </div>
        )}
      </div>

      {/* BOTÃO DE AÇÃO FIXO */}
      {step !== 'sucesso' && (
        <div style={{ position: 'fixed', bottom: 0, width: '100%', padding: 20, background: 'linear-gradient(transparent, #000 40%)', zIndex: 100 }}>
          <button 
            disabled={saving || (step === 'escalar' && filledCount < 11)}
            onClick={() => {
              if (step === 'escalar') setStep('capitao');
              else if (step === 'capitao' && capitao) setStep('heroi');
              else if (step === 'heroi' && heroi) setStep('palpite');
              else if (step === 'palpite') handleSalvar();
            }}
            style={{ width: '100%', padding: 20, borderRadius: 20, background: '#F5C400', color: '#000', fontWeight: 1000, border: 'none', fontSize: 13, textTransform: 'uppercase', opacity: (step === 'escalar' && filledCount < 11) ? 0.5 : 1 }}
          >
            {step === 'escalar' ? (filledCount < 11 ? `FALTAM ${11 - filledCount} JOGADORES` : 'DEFINIR CAPITÃO →') :
             step === 'capitao' ? (capitao ? 'DEFINIR HERÓI →' : 'SELECIONE O CAPITÃO') :
             step === 'heroi' ? (heroi ? 'DAR PALPITE →' : 'SELECIONE O HERÓI') :
             (saving ? 'SALVANDO...' : 'FINALIZAR ESCALAÇÃO 🐯')}
          </button>
        </div>
      )}

      <style jsx global>{`
        @keyframes pulse {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(245, 196, 0, 0.4); }
          70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(245, 196, 0, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(245, 196, 0, 0); }
        }
      `}</style>
    </main>
  );
}
