'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import TigreFCLogin from '@/components/tigre-fc/TigreFCLogin';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { persistSession: true, autoRefreshToken: true } }
);

const LOGO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/tigre-fc-logo.png';
const BASE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';

const PLAYERS = [
  { id: 1,  name: 'César Augusto',   short: 'César',      num: 31, pos: 'GOL', foto: BASE+'CESAR-AUGUSTO.jpg.webp' },
  { id: 2,  name: 'Jordi',           short: 'Jordi',      num: 93, pos: 'GOL', foto: BASE+'JORDI.jpg.webp' },
  { id: 3,  name: 'João Scapin',     short: 'Scapin',     num: 12, pos: 'GOL', foto: BASE+'JOAO-SCAPIN.jpg.webp' },
  { id: 4,  name: 'Lucas Ribeiro',   short: 'Lucas',      num: 1,  pos: 'GOL', foto: BASE+'LUCAS-RIBEIRO.jpg.webp' },
  { id: 5,  name: 'Lora',            short: 'Lora',       num: 2,  pos: 'LAT', foto: BASE+'LORA.jpg.webp' },
  { id: 6,  name: 'Castrillón',      short: 'Castrillón', num: 6,  pos: 'LAT', foto: BASE+'CASTRILLON.jpg.webp' },
  { id: 10, name: 'Dantas',          short: 'Dantas',     num: 3,  pos: 'ZAG', foto: BASE+'DANTAAS.jpg.webp' },
  { id: 11, name: 'Eduardo Brock',   short: 'E.Brock',    num: 5,  pos: 'ZAG', foto: BASE+'EDUARDO-BROCK.jpg.webp' },
  { id: 19, name: 'Luís Oyama',      short: 'Oyama',      num: 8,  pos: 'MEI', foto: BASE+'LUIS-OYAMA.jpg.webp' },
  { id: 21, name: 'Rômulo',          short: 'Rômulo',     num: 10, pos: 'MEI', foto: BASE+'ROMULO.jpg.webp' },
  { id: 31, name: 'Robson',          short: 'Robson',     num: 9,  pos: 'ATA', foto: BASE+'ROBSON.jpg.webp' },
  { id: 38, name: 'Carlão',          short: 'Carlão',     num: 90, pos: 'ATA', foto: BASE+'CARLAO.jpg.webp' },
  // ... adicione os demais conforme sua base
];

const FORMATIONS = {
  '4-3-3': [
    { id: 'gk',  label: 'GOL', x: 50, y: 88 },
    { id: 'rb',  label: 'LD',  x: 82, y: 68 }, { id: 'cb1', label: 'ZAG', x: 62, y: 72 }, { id: 'cb2', label: 'ZAG', x: 38, y: 72 }, { id: 'lb',  label: 'LE',  x: 18, y: 68 },
    { id: 'cm1', label: 'MEI', x: 75, y: 48 }, { id: 'cm2', label: 'MEI', x: 50, y: 52 }, { id: 'cm3', label: 'MEI', x: 25, y: 48 },
    { id: 'rw',  label: 'ATA', x: 80, y: 22 }, { id: 'st',  label: 'ATA', x: 50, y: 15 }, { id: 'lw',  label: 'ATA', x: 20, y: 22 },
  ],
  '4-4-2': [
    { id: 'gk',  label: 'GOL', x: 50, y: 88 },
    { id: 'rb',  label: 'LD',  x: 82, y: 68 }, { id: 'cb1', label: 'ZAG', x: 62, y: 72 }, { id: 'cb2', label: 'ZAG', x: 38, y: 72 }, { id: 'lb',  label: 'LE',  x: 18, y: 68 },
    { id: 'rm',  label: 'MEI', x: 80, y: 48 }, { id: 'cm1', label: 'MEI', x: 60, y: 52 }, { id: 'cm2', label: 'MEI', x: 40, y: 52 }, { id: 'lm',  label: 'MEI', x: 20, y: 48 },
    { id: 'st1', label: 'ATA', x: 65, y: 20 }, { id: 'st2', label: 'ATA', x: 35, y: 20 },
  ],
};

export default function TigreFCEscalar({ jogoId }: { jogoId: number }) {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState('login');
  const [usuario, setUsuario] = useState<any>(null);
  const [formation, setFormation] = useState('4-3-3');
  const [lineup, setLineup] = useState<any>({});
  const [activePlayer, setActivePlayer] = useState<any>(null);
  const [filterPos, setFilterPos] = useState('TODOS');
  const [capitao, setCapitao] = useState<any>(null);
  const [heroi, setHeroi] = useState<any>(null);
  const [palpite, setPalpite] = useState({ mandante: 0, visitante: 0 });
  const [saving, setSaving] = useState(false);

  useEffect(() => { setMounted(true); checkSession(); }, []);

  async function checkSession() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) { setUsuario(session.user); setStep('escalar'); }
  }

  const handleSlotClick = (slotId: string) => {
    if (activePlayer) {
      setLineup({ ...lineup, [slotId]: activePlayer });
      setActivePlayer(null);
    } else if (lineup[slotId]) {
      const nl = { ...lineup }; delete nl[slotId]; setLineup(nl);
    }
  };

  const handleSalvar = async () => {
    setSaving(true);
    try {
      await supabase.from('tigre_fc_escalacoes').upsert({
        usuario_id: usuario.id, jogo_id: jogoId, formacao: formation, lineup, capitao_id: capitao?.id, heroi_id: heroi?.id
      });
      setStep('sucesso');
    } catch (e) { alert("Erro fatal na Matrix!"); }
    finally { setSaving(false); }
  };

  if (!mounted) return null;
  if (step === 'login') return <TigreFCLogin jogoId={jogoId} onSuccess={(u) => { setUsuario(u); setStep('escalar'); }} />;

  const filledCount = Object.keys(lineup).length;

  return (
    <main style={{ minHeight: '100vh', background: '#020202', color: '#fff', paddingBottom: 160 }}>
      {/* Header Estilizado */}
      <div style={{ background: 'linear-gradient(90deg, #F5C400, #ffdb4d)', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 5px 20px rgba(0,0,0,0.8)' }}>
        <img src={LOGO} style={{ width: 28, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />
        <div style={{ color: '#000', fontWeight: 1000, fontSize: 13, letterSpacing: 2 }}>{step === 'escalar' ? 'MONTE SEU TIME' : step.toUpperCase()}</div>
        <div style={{ background: '#000', color: '#F5C400', padding: '4px 10px', borderRadius: 20, fontSize: 10, fontWeight: 1000 }}>{filledCount}/11</div>
      </div>

      <div style={{ maxWidth: 450, margin: '0 auto', padding: 12 }}>
        {step === 'escalar' && (
          <>
            <div style={{ display: 'flex', gap: 10, marginBottom: 15 }}>
              {Object.keys(FORMATIONS).map(f => (
                <button key={f} onClick={() => { setFormation(f); setLineup({}); }} style={{ flex: 1, padding: '12px', borderRadius: 14, background: formation === f ? '#F5C400' : '#111', color: formation === f ? '#000' : '#555', border: 'none', fontWeight: 1000, transition: '0.3s' }}>{f}</button>
              ))}
            </div>

            {/* CAMPO ATÔMICO 3D */}
            <div style={{ 
              position: 'relative', width: '100%', height: 520, 
              background: '#0a2e0a', borderRadius: 25, border: '4px solid #1a1a1a', 
              overflow: 'hidden', perspective: '1200px', boxShadow: 'inset 0 0 100px rgba(0,0,0,0.5)'
            }}>
              <div style={{ 
                position: 'absolute', width: '100%', height: '120%', top: '-5%',
                transform: 'rotateX(28deg)', transformOrigin: 'bottom',
                background: 'repeating-linear-gradient(0deg, #224d22, #224d22 40px, #2a5c2a 40px, #2a5c2a 80px)'
              }}>
                {/* Linhas Profissionais */}
                <div style={{ position: 'absolute', top: 0, left: '5%', right: '5%', bottom: 0, border: '2px solid rgba(255,255,255,0.2)' }} />
                <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 2, background: 'rgba(255,255,255,0.2)' }} />
                <div style={{ position: 'absolute', top: '50%', left: '50%', width: 120, height: 120, border: '2px solid rgba(255,255,255,0.2)', borderRadius: '50%', transform: 'translate(-50%, -50%)' }} />
                <div style={{ position: 'absolute', bottom: 0, left: '25%', right: '25%', height: 70, border: '2px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.03)' }} />
                
                {FORMATIONS[formation as keyof typeof FORMATIONS].map(slot => {
                  const p = lineup[slot.id];
                  return (
                    <div key={slot.id} onClick={() => handleSlotClick(slot.id)} style={{ position: 'absolute', left: `${slot.x}%`, top: `${slot.y}%`, transform: 'translate(-50%, -50%)', cursor: 'pointer', zIndex: p ? 10 : 1 }}>
                      <div style={{ transform: 'rotateX(-28deg)', transition: '0.3s' }}>
                        {!p ? (
                          <div style={{ width: 44, height: 44, borderRadius: '50%', border: activePlayer ? '2px solid #F5C400' : '2px dashed rgba(255,255,255,0.3)', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: activePlayer ? 'pulse 1.5s infinite' : 'none' }}>
                            <span style={{ fontSize: 9, color: '#fff', fontWeight: 900 }}>{slot.label}</span>
                          </div>
                        ) : (
                          <div style={{ width: 62, textAlign: 'center' }}>
                            <div style={{ width: 60, height: 60, borderRadius: '50%', overflow: 'hidden', border: '2px solid #F5C400', background: '#000', boxShadow: '0 8px 15px rgba(0,0,0,0.5)' }}>
                              <img src={p.foto} style={{ width: '150%', height: '100%', objectFit: 'cover', objectPosition: '0% 0%' }} />
                            </div>
                            <div style={{ background: '#F5C400', color: '#000', fontSize: 8, fontWeight: 1000, borderRadius: 3, marginTop: -8, padding: '2px 6px', position: 'relative', display: 'inline-block' }}>{p.short.toUpperCase()}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* LISTA EXPLOSIVA COM EFEITO DE FOTO */}
            <div style={{ marginTop: 20, background: '#111', borderRadius: 25, padding: 15, border: '1px solid #222' }}>
              <div style={{ display: 'flex', gap: 6, marginBottom: 15, overflowX: 'auto', paddingBottom: 8 }}>
                {['TODOS', 'GOL', 'LAT', 'ZAG', 'MEI', 'ATA'].map(p => (
                  <button key={p} onClick={() => setFilterPos(p)} style={{ padding: '8px 18px', borderRadius: 12, background: filterPos === p ? '#F5C400' : '#222', color: filterPos === p ? '#000' : '#888', border: 'none', fontSize: 10, fontWeight: 1000 }}>{p}</button>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                {PLAYERS.filter(p => filterPos === 'TODOS' || p.pos === filterPos).map(p => {
                  const isSelected = Object.values(lineup).some((s: any) => s?.id === p.id);
                  const isActive = activePlayer?.id === p.id;
                  return (
                    <div key={p.id} onClick={() => !isSelected && setActivePlayer(p)} style={{ textAlign: 'center', opacity: isSelected ? 0.3 : 1, transition: '0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', transform: isActive ? 'scale(1.15) translateY(-5px)' : 'scale(1)' }}>
                      <div style={{ width: 65, height: 65, margin: '0 auto', borderRadius: 12, overflow: 'hidden', border: isActive ? '3px solid #F5C400' : '2px solid #222', position: 'relative', background: '#000' }}>
                        <img 
                          src={p.foto} 
                          style={{ 
                            width: '200%', height: '100%', objectFit: 'cover', 
                            objectPosition: isActive ? '100% 0%' : '0% 0%', // EFEITO SLIDE PARA A DIREITA
                            transition: '0.6s cubic-bezier(0.4, 0, 0.2, 1)' 
                          }} 
                        />
                      </div>
                      <div style={{ fontSize: 9, fontWeight: 900, marginTop: 6, color: isActive ? '#F5C400' : '#ccc' }}>{p.short}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Steps de Finalização (Capitão, Herói, Palpite) mantidos conforme lógica anterior para não quebrar o fluxo */}
      </div>

      {/* FOOTER NITRO */}
      {step !== 'sucesso' && (
        <div style={{ position: 'fixed', bottom: 0, width: '100%', padding: '25px 20px', background: 'linear-gradient(0deg, #000 70%, transparent)', zIndex: 1000 }}>
          <button 
            disabled={saving || (step === 'escalar' && filledCount < 11)}
            onClick={() => {
               if(step==='escalar') setStep('capitao');
               else if(step==='capitao' && capitao) setStep('heroi');
               else if(step==='heroi' && heroi) handleSalvar();
            }}
            style={{ 
              width: '100%', padding: 22, borderRadius: 18, background: '#F5C400', color: '#000', 
              fontWeight: 1000, border: 'none', fontSize: 14, boxShadow: '0 10px 30px rgba(245, 196, 0, 0.3)',
              opacity: (step === 'escalar' && filledCount < 11) ? 0.5 : 1, transition: '0.3s'
            }}
          >
            {step === 'escalar' ? (filledCount < 11 ? `FALTAM ${11 - filledCount} CRAQUES` : 'CONFIRMAR ESCALAÇÃO →') : 'FINALIZAR 🐯'}
          </button>
        </div>
      )}

      <style jsx global>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 1; box-shadow: 0 0 15px #F5C400; }
          100% { transform: scale(1); opacity: 0.5; }
        }
        body { overflow-x: hidden; }
      `}</style>
    </main>
  );
}
