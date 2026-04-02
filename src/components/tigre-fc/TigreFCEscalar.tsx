'use client';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

// Configuração Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  }
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

const FORMATION_433 = [
  { id:'gk',  label:'GOL', x:50, y:92 }, { id:'rb',  label:'LAT', x:85, y:72 },
  { id:'cb1', label:'ZAG', x:62, y:78 }, { id:'cb2', label:'ZAG', x:38, y:78 },
  { id:'lb',  label:'LAT', x:15, y:72 }, { id:'cm1', label:'MEI', x:75, y:52 },
  { id:'cm2', label:'MEI', x:50, y:55 }, { id:'cm3', label:'MEI', x:25, y:52 },
  { id:'rw',  label:'ATA', x:82, y:22 }, { id:'st',  label:'ATA', x:50, y:12 },
  { id:'lw',  label:'ATA', x:18, y:22 },
];

type Player = typeof PLAYERS[0];
type Lineup = Record<string, Player | null>;

function PlayerCard({ player, size, isField }: { player: Player, size: number, isField?: boolean }) {
  return (
    <div style={{ width: size, animation: 'card-entry 0.6s ease-out backwards' }}>
      <div style={{
        position: 'relative', width: size, height: size * 1.38,
        background: '#111', borderRadius: '8px', overflow: 'hidden',
        border: `1.5px solid rgba(255,255,255,0.1)`,
        transform: isField ? 'rotateX(-15deg)' : 'none',
        transition: 'all 0.4s'
      }}>
        <div style={{
          width: '100%', height: '100%',
          backgroundImage: `url(${player.foto})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)'
        }} />
        <div style={{ position: 'absolute', bottom: 0, width: '100%', background: 'rgba(0,0,0,0.85)', padding: '4px 0', textAlign: 'center', borderTop: '1px solid #F5C400' }}>
          <div style={{ color: '#F5C400', fontSize: Math.max(size * 0.1, 8), fontWeight: 900 }}>{player.pos}</div>
          <div style={{ color: '#fff', fontSize: Math.max(size * 0.14, 10), fontWeight: 1000, textTransform: 'uppercase' }}>{player.short}</div>
        </div>
      </div>
    </div>
  );
}

export default function TigreFCEscalar({ jogoId }: { jogoId: number }) {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<'login' | 'escalar' | 'finalizado'>('login');
  const [lineup, setLineup] = useState<Lineup>({});
  const [selected, setSelected] = useState<{ player: Player, fromSlot: string | null } | null>(null);
  const [fieldWidth, setFieldWidth] = useState(360);
  const [usuario, setUsuario] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setMounted(true);
    const update = () => setFieldWidth(Math.min(window.innerWidth - 32, 450));
    update();
    window.addEventListener('resize', update);
    
    // Auth Check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) { setUsuario(session.user); setStep('escalar'); }
    });

    return () => window.removeEventListener('resize', update);
  }, []);

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    });
  };

  const handleTapSlot = (slotId: string) => {
    const playerInSlot = lineup[slotId];
    if (selected) {
      setLineup(prev => ({ 
        ...prev, 
        [selected.fromSlot || 'temp']: playerInSlot || null, 
        [slotId]: selected.player 
      }));
      setSelected(null);
    } else if (playerInSlot) {
      setSelected({ player: playerInSlot, fromSlot: slotId });
    }
  };

  const handleSalvar = async () => {
    setSaving(true);
    try {
      // Exemplo de salvamento no Supabase
      const { error } = await supabase.from('escalacoes').upsert({
        user_id: usuario?.id,
        jogo_id: jogoId,
        time: lineup,
        updated_at: new Date()
      });
      if (error) throw error;
      setStep('finalizado');
    } catch (e) {
      console.error(e);
      alert("Erro ao salvar sua escalação.");
    } finally {
      setSaving(false);
    }
  };

  const handleShare = () => {
    const text = `🐯 Escalei meu time no Tigre FC Elite! Você consegue bater minha tática?`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + window.location.origin)}`);
  };

  if (!mounted) return null;

  if (step === 'login') return (
    <div style={{ height: '100vh', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <button onClick={handleGoogleLogin} style={{ padding: '20px 40px', borderRadius: 12, fontWeight: 900, cursor: 'pointer' }}>
            ENTRAR COM GOOGLE
        </button>
    </div>
  );

  const filledCount = Object.values(lineup).filter(Boolean).length;

  return (
    <main style={{ minHeight:'100vh', background:'#050505', color:'#fff', overflowX: 'hidden' }}>
      <div style={{ background:'#F5C400', padding:16, textAlign:'center', borderBottom:'4px solid #ccaa00' }}>
        <span style={{ color:'#000', fontWeight: 1000 }}>TIGRE FC ELITE 26</span>
      </div>

      <div style={{ maxWidth: 480, margin: '0 auto', padding: '10px 16px' }}>
        
        {step === 'escalar' && (
          <>
            {/* Campo 3D */}
            <div style={{ perspective: '1200px', margin: '20px 0' }}>
              <div style={{
                width: fieldWidth, height: fieldWidth * 1.3, margin: '0 auto',
                background: 'linear-gradient(180deg, #1a4a1a 0%, #0a2a0a 100%)',
                borderRadius: '16px', position: 'relative',
                transform: 'rotateX(20deg)', border: '2px solid rgba(255,255,255,0.1)'
              }}>
                {FORMATION_433.map((slot) => (
                  <div key={slot.id} onClick={() => handleTapSlot(slot.id)} style={{
                    position: 'absolute', left: `${slot.x}%`, top: `${slot.y}%`,
                    transform: 'translate(-50%, -50%)', zIndex: 10, cursor: 'pointer'
                  }}>
                    {lineup[slot.id] ? (
                      <PlayerCard player={lineup[slot.id]!} size={fieldWidth * 0.16} isField />
                    ) : (
                      <div style={{ width: 35, height: 35, borderRadius: '50%', border: '1.5px dashed #F5C400', color: '#F5C400', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Mercado */}
            <div style={{ background:'#111', borderRadius:20, padding:15, marginBottom: 100 }}>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:10 }}>
                {PLAYERS.filter(p => !Object.values(lineup).some(lp => lp?.id === p.id)).map(p => (
                  <div key={p.id} onClick={() => setSelected({ player: p, fromSlot: null })} style={{ cursor: 'pointer' }}>
                    <PlayerCard player={p} size={(fieldWidth/4) - 20} />
                  </div>
                ))}
              </div>
            </div>

            {/* Botão Fixo */}
            <div style={{ position:'fixed', bottom:0, left:0, width:'100%', padding:20, background:'linear-gradient(transparent, #000 60%)' }}>
                <button 
                  onClick={handleSalvar}
                  disabled={filledCount < 11 || saving}
                  style={{ width: '100%', padding: 20, borderRadius: 12, background: filledCount === 11 ? '#F5C400' : '#222', color: '#000', fontWeight: 1000, border: 'none' }}>
                  {saving ? 'SALVANDO...' : filledCount < 11 ? `FALTAM ${11 - filledCount} JOGADORES` : 'CONFIRMAR TIME 🐯'}
                </button>
            </div>
          </>
        )}

        {step === 'finalizado' && (
          <div style={{ textAlign: 'center', padding: '50px 20px' }}>
             <img src={LOGO} style={{ width: 100, marginBottom: 20 }} />
             <h2 style={{ color: '#F5C400' }}>TIME ESCALADO!</h2>
             <button onClick={handleShare} style={{ width: '100%', padding: 20, background: '#25D366', color: '#fff', borderRadius: 12, border: 'none', fontWeight: 900, marginTop: 20 }}>
               CHAMAR NO WHATSAPP
             </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes card-entry { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </main>
  );
}
