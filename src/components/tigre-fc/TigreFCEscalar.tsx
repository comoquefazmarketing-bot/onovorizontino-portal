'use client';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import TigreFCLogin from '@/components/tigre-fc/TigreFCLogin';

// Configuração robusta do Supabase para evitar deslogue repentino
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

const FORMATIONS: Record<string, { id: string; label: string; x: number; y: number }[]> = {
  '4-3-3': [
    { id:'gk',  label:'GOL', x:50, y:92 }, { id:'rb',  label:'LAT', x:85, y:72 },
    { id:'cb1', label:'ZAG', x:62, y:78 }, { id:'cb2', label:'ZAG', x:38, y:78 },
    { id:'lb',  label:'LAT', x:15, y:72 }, { id:'cm1', label:'MEI', x:75, y:52 },
    { id:'cm2', label:'MEI', x:50, y:55 }, { id:'cm3', label:'MEI', x:25, y:52 },
    { id:'rw',  label:'ATA', x:82, y:22 }, { id:'st',  label:'ATA', x:50, y:12 },
    { id:'lw',  label:'ATA', x:18, y:22 },
  ],
};

type Player = typeof PLAYERS[0];
type Lineup = Record<string, Player | null>;

function PlayerCard({ player, size, isCapitao, isHeroi, isField }: { player: Player, size: number, isCapitao?: boolean, isHeroi?: boolean, isField?: boolean }) {
  return (
    <div style={{ width: size, animation: 'card-entry 0.6s ease-out backwards' }}>
      <div style={{
        position: 'relative', width: size, height: size * 1.38,
        background: '#111', borderRadius: '8px', overflow: 'hidden',
        border: `1.5px solid ${isCapitao || isHeroi ? '#F5C400' : 'rgba(255,255,255,0.1)'}`,
        transform: isField ? 'rotateX(-15deg)' : 'none',
        transition: 'all 0.4s'
      }}>
        <div style={{
          width: '200%', height: '100%',
          backgroundImage: `url(${player.foto})`,
          backgroundSize: 'cover',
          backgroundPosition: isField ? 'right center' : 'left center',
          transition: 'background-position 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
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

  useEffect(() => {
    setMounted(true);
    const update = () => setFieldWidth(Math.min(window.innerWidth - 32, 450));
    update();
    window.addEventListener('resize', update);
    
    // Escuta mudanças na autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setUsuario(session.user);
        setStep('escalar');
      } else {
        setStep('login');
      }
    });

    return () => {
      window.removeEventListener('resize', update);
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account', // select_account é melhor que 'consent' para evitar loops
        },
      },
    });
    if (error) console.error("Erro Login:", error.message);
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

  const handleShare = async () => {
    const text = `🐯 Montei meu timaço de ELITE no Tigre FC! Você consegue bater minha escalação? Monte a sua agora!`;
    const url = window.location.origin;

    if (navigator.share) {
      try {
        await navigator.share({ title: 'Tigre FC Elite', text, url });
      } catch (err) { console.log(err); }
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`);
    }
  };

  if (!mounted) return null;
  
  if (step === 'login') return (
    <div style={{ minHeight: '100vh', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ textAlign: 'center', width: '100%', maxWidth: 400 }}>
        <img src={LOGO} style={{ width: 120, marginBottom: 30 }} alt="Tigre FC" />
        <h1 style={{ color: '#F5C400', fontWeight: 1000, marginBottom: 10 }}>BEM-VINDO À ELITE</h1>
        <p style={{ color: '#888', marginBottom: 40 }}>Faça login para escalar o seu time para o jogo.</p>
        <button 
          onClick={handleGoogleLogin}
          style={{ 
            width: '100%', padding: 20, borderRadius: 16, border: 'none', background: '#fff', 
            color: '#000', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, cursor: 'pointer' 
          }}>
          <img src="https://www.google.com/favicon.ico" style={{ width: 20 }} />
          ENTRAR COM GOOGLE
        </button>
      </div>
    </div>
  );

  const currentSlots = FORMATIONS['4-3-3'];
  const usedIds = Object.values(lineup).filter(Boolean).map(p => p!.id);

  return (
    <main style={{ minHeight:'100vh', background:'#050505', color:'#fff', overflowX: 'hidden' }}>
      {/* Header */}
      <div style={{ background:'#F5C400', padding:16, textAlign:'center', borderBottom:'4px solid #ccaa00', zIndex: 100, position: 'relative' }}>
        <span style={{ color:'#000', fontWeight: 1000, letterSpacing: 2 }}>TIGRE FC <span style={{ fontWeight: 400 }}>ELITE 26</span></span>
      </div>

      <div style={{ maxWidth: 480, margin: '0 auto', padding: '10px 16px' }}>
        
        {step === 'escalar' && (
          <>
            <div style={{ perspective: '1200px', marginBottom: 30, marginTop: 10 }}>
              <div style={{
                width: fieldWidth, height: fieldWidth * 1.35, margin: '0 auto',
                background: 'linear-gradient(180deg, #1a4a1a 0%, #0a2a0a 100%)',
                borderRadius: '16px', position: 'relative',
                boxShadow: '0 30px 80px rgba(0,0,0,0.8), inset 0 0 100px rgba(0,0,0,0.5)',
                backgroundImage: `repeating-linear-gradient(0deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 40px, transparent 40px, transparent 80px)`,
                border: '2px solid rgba(255,255,255,0.1)',
                transform: 'rotateX(25deg)', transformStyle: 'preserve-3d'
              }}>
                <div style={{ position:'absolute', top:'50%', width:'100%', height:'1px', background:'rgba(255,255,255,0.1)' }} />
                <div style={{ position:'absolute', top:'50%', left:'50%', width:fieldWidth*0.4, height:fieldWidth*0.4, border:'1px solid rgba(255,255,255,0.1)', borderRadius:'50%', transform:'translate(-50%, -50%)' }} />

                {currentSlots.map((slot) => (
                  <div key={slot.id} onClick={() => handleTapSlot(slot.id)} style={{
                    position: 'absolute', left: `${slot.x}%`, top: `${slot.y}%`,
                    transform: 'translate(-50%, -50%) translateZ(35px)',
                    zIndex: 10, cursor: 'pointer', transition: '0.3s'
                  }}>
                    {lineup[slot.id] ? (
                      <PlayerCard player={lineup[slot.id]!} size={fieldWidth * 0.17} isField />
                    ) : (
                      <div style={{
                        width: 38, height: 38, borderRadius: '50%', 
                        border: '1.5px dashed #F5C400', color: '#F5C400',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
                        background: 'rgba(0,0,0,0.3)'
                      }}>+</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Mercado */}
            <div style={{ background:'#111', borderRadius:24, padding:20, border:'1px solid #222', marginBottom: 120 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:15 }}>
                <span style={{ fontWeight:900, color:'#F5C400', fontSize:12 }}>MERCADO ELITE</span>
                <span style={{ fontSize:10, color:'#555' }}>{usedIds.length}/11 SELECIONADOS</span>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:12 }}>
                {PLAYERS.filter(p => !usedIds.includes(p.id)).map(p => (
                  <div key={p.id} onClick={() => setSelected({ player: p, fromSlot: null })} style={{ cursor: 'pointer' }}>
                    <PlayerCard player={p} size={(fieldWidth/4) - 18} />
                  </div>
                ))}
              </div>
            </div>

            {/* Botão de Finalizar */}
            <div style={{ position:'fixed', bottom:0, left:0, width:'100%', padding:20, background:'linear-gradient(transparent, #000 70%)', zIndex: 1000 }}>
              <button 
                onClick={() => setStep('finalizado')}
                disabled={usedIds.length < 11}
                style={{ 
                  width: '100%', padding: '22px', borderRadius: '14px', border: 'none',
                  background: usedIds.length === 11 ? 'linear-gradient(90deg, #F5C400, #ffdb4d, #F5C400)' : '#1a1a1a',
                  color: '#000', fontWeight: 1000, fontSize: 14, textTransform: 'uppercase',
                  boxShadow: usedIds.length === 11 ? '0 5px 25px rgba(245, 196, 0, 0.4)' : 'none'
                }}>
                {usedIds.length < 11 ? `FALTAM ${11 - usedIds.length} JOGADORES` : 'FINALIZAR ESCALAÇÃO 🐯'}
              </button>
            </div>
          </>
        )}

        {step === 'finalizado' && (
          <div style={{ textAlign: 'center', padding: '40px 0', animation: 'card-entry 0.6s ease' }}>
            <div style={{ background: '#111', padding: 30, borderRadius: 24, border: '2px solid #F5C400', marginBottom: 30 }}>
              <img src={LOGO} style={{ width: 80, marginBottom: 20 }} />
              <h2 style={{ color: '#F5C400', fontWeight: 1000 }}>TIME ESCALADO!</h2>
              <p style={{ color: '#888', fontSize: 14 }}>Seu time de elite já está na base de dados.</p>
            </div>

            <button 
              onClick={handleShare}
              style={{ 
                width:'100%', padding:22, borderRadius:16, background:'#25D366', color:'#fff', 
                fontWeight:1000, border:'none', fontSize:16, marginBottom: 15, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10
              }}>
              CONVIDAR AMIGOS (WHATSAPP)
            </button>

            <button 
              onClick={() => setStep('escalar')}
              style={{ background:'transparent', color:'#F5C400', border:'none', fontWeight:900, cursor:'pointer' }}>
              REVISAR MEU TIME
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes card-entry { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </main>
  );
}
