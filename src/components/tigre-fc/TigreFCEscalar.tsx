'use client';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import TigreFCLogin from '@/components/tigre-fc/TigreFCLogin';
import html2canvas from 'html2canvas';

// Configuração para NÃO DESLOGAR no mobile
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

// --- DADOS DOS JOGADORES ---
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

const FORMATIONS: Record<string, { id: string; label: string; x: number; y: number }[]> = {
  '4-3-3': [
    { id:'gk',  label:'GOL', x:50, y:88 }, { id:'rb',  label:'LAT', x:82, y:68 },
    { id:'cb1', label:'ZAG', x:62, y:72 }, { id:'cb2', label:'ZAG', x:38, y:72 },
    { id:'lb',  label:'LAT', x:18, y:68 }, { id:'cm1', label:'MEI', x:75, y:48 },
    { id:'cm2', label:'MEI', x:50, y:45 }, { id:'cm3', label:'MEI', x:25, y:48 },
    { id:'rw',  label:'ATA', x:80, y:22 }, { id:'st',  label:'ATA', x:50, y:15 },
    { id:'lw',  label:'ATA', x:20, y:22 },
  ],
  '4-4-2': [
    { id:'gk',  label:'GOL', x:50, y:88 }, { id:'rb',  label:'LAT', x:82, y:68 },
    { id:'cb1', label:'ZAG', x:62, y:72 }, { id:'cb2', label:'ZAG', x:38, y:72 },
    { id:'lb',  label:'LAT', x:18, y:68 }, { id:'rm',  label:'MEI', x:80, y:48 },
    { id:'cm1', label:'MEI', x:60, y:48 }, { id:'cm2', label:'MEI', x:40, y:48 },
    { id:'lm',  label:'MEI', x:20, y:48 }, { id:'st1', label:'ATA', x:65, y:20 },
    { id:'st2', label:'ATA', x:35, y:20 },
  ],
};

function PlayerCard({ player, size, isCapitao, isHeroi, isList }: any) {
  if (!player) return null;
  return (
    <div style={{ width: size, textAlign: 'center', position: 'relative' }}>
      {isCapitao && <div style={{ position:'absolute', top:-15, left:'50%', transform:'translateX(-50%)', zIndex:10, fontSize:16 }}>👑</div>}
      {isHeroi && <div style={{ position:'absolute', top:-15, left:'50%', transform:'translateX(-50%)', zIndex:10, fontSize:16 }}>⭐</div>}
      <div style={{ 
        width: size, height: size, borderRadius: '50%', overflow: 'hidden', 
        border: `2px solid ${isList ? '#222' : '#F5C400'}`, background: '#111', position: 'relative'
      }}>
        <img src={player.foto} style={{ width:'100%', height:'100%', objectFit:'cover' }} alt={player.short} />
      </div>
      <div style={{ 
        background: isList ? '#333' : '#F5C400', color: isList ? '#fff' : '#000', 
        fontSize: size * 0.18, fontWeight: 900, borderRadius: 4, marginTop: -8, 
        position: 'relative', zIndex: 2, padding: '1px 4px', whiteSpace: 'nowrap'
      }}>
        {player.short}
      </div>
    </div>
  );
}

export default function TigreFCEscalar({ jogoId }: { jogoId: number }) {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState('login');
  const [usuario, setUsuario] = useState<any>(null);
  const [formation, setFormation] = useState('4-3-3');
  const [lineup, setLineup] = useState<any>({});
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [capitao, setCapitao] = useState<any>(null);
  const [heroi, setHeroi] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUsuario(session.user);
        setStep('escalar');
      }
    });
  }, []);

  const handleSalvar = async () => {
    if (!usuario) return;
    setSaving(true);
    try {
      const { error } = await supabase.from('tigre_fc_escalacoes').upsert({
        usuario_id: usuario.id,
        jogo_id: jogoId,
        formacao: formation,
        lineup: lineup,
        capitao_id: capitao?.id,
        heroi_id: heroi?.id
      }, { onConflict: 'usuario_id,jogo_id' });

      if (error) throw error;
      setStep('salvo');
    } catch (e) {
      alert("Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  };

  const handleShare = async () => {
    if (!cardRef.current) return;
    setTimeout(async () => {
      const canvas = await html2canvas(cardRef.current!, { backgroundColor: '#050505', useCORS: true, scale: 2 });
      const image = canvas.toDataURL('image/png');
      if (navigator.share) {
        const blob = await (await fetch(image)).blob();
        const file = new File([blob], 'time.png', { type: 'image/png' });
        navigator.share({ title: 'Meu Time Tigre FC', files: [file] }).catch(() => {});
      } else {
        const link = document.createElement('a');
        link.href = image; link.download = 'meu-tigre.png'; link.click();
      }
    }, 200);
  };

  if (!mounted) return null;

  if (step === 'login') return <TigreFCLogin jogoId={jogoId} onSuccess={(u) => { setUsuario(u); setStep('escalar'); }} />;

  if (step === 'salvo') {
    return (
      <main style={{ minHeight:'100vh', background:'#000', padding:20, display:'flex', flexDirection:'column', alignItems:'center' }}>
        <h2 style={{ color:'#F5C400', fontWeight:900 }}>TIME ESCALADO! 🐯</h2>
        <div ref={cardRef} style={{ width: '100%', maxWidth: 380, background: '#050505', borderRadius: 24, padding: 20, border: '1px solid #222', marginTop: 20 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom: 15 }}>
             <div style={{ color:'#fff', fontSize:18, fontWeight:900 }}>{usuario?.email?.split('@')[0]}</div>
             <img src={LOGO} style={{ width: 30 }} />
          </div>
          <div style={{ position:'relative', width:'100%', height: 420, background: 'radial-gradient(circle, #1a4a1a 0%, #0d2b0d 100%)', borderRadius: 16 }}>
            {FORMATIONS[formation].map(slot => (
              <div key={slot.id} style={{ position:'absolute', left:`${slot.x}%`, top:`${slot.y}%`, transform:'translate(-50%,-50%)' }}>
                <PlayerCard player={lineup[slot.id]} size={45} isCapitao={capitao?.id === lineup[slot.id]?.id} isHeroi={heroi?.id === lineup[slot.id]?.id} />
              </div>
            ))}
          </div>
        </div>
        <button onClick={handleShare} style={{ width:'100%', maxWidth:380, marginTop:20, background:'#fff', color:'#000', padding:18, borderRadius:16, fontWeight:900, border:'none' }}>COMPARTILHAR 📸</button>
      </main>
    );
  }

  const filledCount = Object.keys(lineup).length;

  return (
    <main style={{ minHeight:'100vh', background:'#080808', color:'#fff', paddingBottom: 100 }}>
      <div style={{ background:'#F5C400', padding:12, display:'flex', justifyContent:'space-between', alignItems:'center', position:'sticky', top:0, zIndex:100 }}>
        <img src={LOGO} style={{ width: 22 }} />
        <span style={{ color:'#000', fontSize:10, fontWeight:1000 }}>{step.toUpperCase()}</span>
      </div>

      <div style={{ maxWidth:480, margin:'0 auto', padding:16 }}>
        {step === 'escalar' && (
          <>
            <div style={{ display:'flex', gap:8, marginBottom:15 }}>
              {Object.keys(FORMATIONS).map(f => (
                <button key={f} onClick={() => setFormation(f)} style={{ flex:1, padding:10, borderRadius:8, background: formation===f?'#F5C400':'#1a1a1a', color: formation===f?'#000':'#666', border:'none', fontWeight:900 }}>{f}</button>
              ))}
            </div>
            <div style={{ position:'relative', width:'100%', height: 460, background: 'radial-gradient(circle, #1a4a1a 0%, #0d2b0d 100%)', borderRadius: 12, border:'2px solid #222' }}>
               {FORMATIONS[formation].map(slot => (
                 <div key={slot.id} onClick={() => setSelectedSlot(slot.id)} style={{ position:'absolute', left:`${slot.x}%`, top:`${slot.y}%`, transform:'translate(-50%,-50%)' }}>
                    {lineup[slot.id] ? <PlayerCard player={lineup[slot.id]} size={50} /> : <div style={{ width:35, height:35, borderRadius:'50%', border:'1px dashed #fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:8 }}>{slot.label}</div>}
                 </div>
               ))}
            </div>
            {selectedSlot && (
              <div style={{ marginTop:20, background:'#111', padding:15, borderRadius:16, border:'1px solid #222' }}>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(75px, 1fr))', gap:10 }}>
                  {PLAYERS.filter(p => p.pos === FORMATIONS[formation].find(s => s.id === selectedSlot)?.label).map(p => (
                    <div key={p.id} onClick={() => { setLineup({...lineup, [selectedSlot]: p}); setSelectedSlot(null); }} style={{ textAlign:'center' }}>
                      <img src={p.foto} style={{ width:50, height:50, borderRadius:'50%', border: lineup[selectedSlot]?.id === p.id ? '2px solid #F5C400' : '1px solid #333' }} />
                      <div style={{ fontSize:9, marginTop:4 }}>{p.short}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {step === 'capitao' && (
          <div style={{ textAlign:'center' }}>
            <h3 style={{ color:'#F5C400', fontWeight:900 }}>QUEM SERÁ O CAPITÃO? 👑</h3>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:15, marginTop:20 }}>
               {Object.values(lineup).map((p: any) => (
                 <div key={p.id} onClick={() => setCapitao(p)} style={{ padding:10, borderRadius:12, border: capitao?.id===p.id ? '1px solid #F5C400' : '1px solid #1a1a1a' }}>
                    <PlayerCard player={p} size={60} isCapitao={capitao?.id===p.id} />
                 </div>
               ))}
            </div>
          </div>
        )}

        {step === 'heroi' && (
          <div style={{ textAlign:'center' }}>
            <h3 style={{ color:'#F5C400', fontWeight:900 }}>QUEM É O HERÓI? ⭐</h3>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:15, marginTop:20 }}>
               {Object.values(lineup).map((p: any) => (
                 <div key={p.id} onClick={() => setHeroi(p)} style={{ padding:10, borderRadius:12, border: heroi?.id===p.id ? '1px solid #F5C400' : '1px solid #1a1a1a' }}>
                    <PlayerCard player={p} size={60} isHeroi={heroi?.id===p.id} />
                 </div>
               ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ position:'fixed', bottom:0, width:'100%', padding:20, background:'linear-gradient(transparent, #000 40%)' }}>
         <button 
           onClick={() => {
              if(step === 'escalar' && filledCount === 11) setStep('capitao');
              else if(step === 'capitao' && capitao) setStep('heroi');
              else if(step === 'heroi' && heroi) handleSalvar();
           }}
           disabled={saving || (step === 'escalar' && filledCount < 11)}
           style={{ width:'100%', padding:20, borderRadius:16, background:'#F5C400', color:'#000', fontWeight:1000, border:'none' }}
         >
           {step === 'escalar' ? (filledCount < 11 ? `FALTAM ${11 - filledCount}` : 'PRÓXIMO →') : step === 'capitao' ? 'PRÓXIMO →' : (saving ? 'SALVANDO...' : 'FINALIZAR 🐯')}
         </button>
      </div>
    </main>
  );
}
