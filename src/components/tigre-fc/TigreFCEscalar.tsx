'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

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
  { id: 39, name: 'Ronald Barcellos', short: 'Ronald',      num: 23, pos: 'ATA', foto: BASE+'RONALD-BARCELLOS.jpg.webp' },
];

const FORMATION_4231 = [
  { id: 'gk',  label: 'GOL', x: 50, y: 88 },
  { id: 'rb',  label: 'LAT', x: 82, y: 70 },
  { id: 'cb1', label: 'ZAG', x: 62, y: 75 },
  { id: 'cb2', label: 'ZAG', x: 38, y: 75 },
  { id: 'lb',  label: 'LAT', x: 18, y: 70 },
  { id: 'dm1', label: 'VOL', x: 60, y: 58 },
  { id: 'dm2', label: 'VOL', x: 40, y: 58 },
  { id: 'am1', label: 'ATA', x: 80, y: 40 },
  { id: 'am2', label: 'MEI', x: 50, y: 42 },
  { id: 'am3', label: 'ATA', x: 20, y: 40 },
  { id: 'st',  label: 'ATA', x: 50, y: 18 },
];

type Player = typeof PLAYERS[0];
type Lineup = Record<string, Player | null>;

function PlayerCard({ player, size, isField }: { player: Player, size: number, isField?: boolean }) {
  // LÓGICA DE POSICIONAMENTO:
  // Se estiver no campo (isField), mostra a pose da DIREITA.
  // Se estiver no mercado, mostra a pose da ESQUERDA.
  const backgroundPositionX = isField ? 'right' : 'left';

  return (
    <div style={{ width: size, animation: 'card-entry 0.5s ease-out' }}>
      <div style={{
        position: 'relative', width: size, height: size * 1.35,
        background: '#111', borderRadius: '6px', overflow: 'hidden',
        border: isField ? '2px solid #F5C400' : '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 4px 10px rgba(0,0,0,0.5)'
      }}>
        <div style={{
          width: '100%', height: '100%',
          backgroundImage: `url(${player.foto})`,
          backgroundSize: 'cover',
          backgroundPosition: `${backgroundPositionX} top`, // Troca de pose sem cortes centrais
          maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)'
        }} />
        <div style={{ 
          position: 'absolute', bottom: 0, width: '100%', 
          background: 'rgba(0,0,0,0.9)', 
          padding: '3px 0', textAlign: 'center',
          borderTop: '1px solid rgba(245,196,0,0.4)'
        }}>
          <div style={{ color: '#F5C400', fontSize: Math.max(size * 0.12, 7), fontWeight: 900 }}>{player.pos}</div>
          <div style={{ color: '#fff', fontSize: Math.max(size * 0.15, 9), fontWeight: 1000, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{player.short}</div>
        </div>
      </div>
    </div>
  );
}

export default function TigreFCEscalar({ jogoId }: { jogoId: number }) {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<'login' | 'escalar' | 'finalizado'>('login');
  const [lineup, setLineup] = useState<Lineup>({});
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [fieldWidth, setFieldWidth] = useState(360);
  const [filterPos, setFilterPos] = useState<string>('TODOS');

  useEffect(() => {
    setMounted(true);
    const update = () => setFieldWidth(Math.min(window.innerWidth - 32, 450));
    update();
    window.addEventListener('resize', update);
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setStep('escalar');
    });
    return () => window.removeEventListener('resize', update);
  }, []);

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
  };

  const selectPlayer = (player: Player) => {
    if (selectedSlot) {
      setLineup(prev => ({ ...prev, [selectedSlot]: player }));
      setSelectedSlot(null);
    }
  };

  if (!mounted) return null;

  if (step === 'login') return (
    <div style={{ minHeight: '100vh', background: '#050505', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
      <img src="https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/tigre-fc-logo.png" width={120} alt="Logo" />
      <button onClick={handleGoogleLogin} style={{ padding: '16px 32px', borderRadius: 12, background: '#F5C400', color: '#000', fontWeight: 900, border: 'none', cursor: 'pointer' }}>
        ENTRAR COM GOOGLE
      </button>
    </div>
  );

  const usedIds = Object.values(lineup).filter(Boolean).map(p => p!.id);
  const filteredPlayers = PLAYERS
    .filter(p => !usedIds.includes(p.id))
    .filter(p => filterPos === 'TODOS' || p.pos === filterPos);

  return (
    <main style={{ minHeight: '100vh', background: '#050505', color: '#fff', fontFamily: 'sans-serif' }}>
      <header style={{ background: '#F5C400', padding: 12, textAlign: 'center', fontWeight: 1000, color: '#000', fontSize: 18 }}>
        TIGRE FC ELITE 26
      </header>

      <div style={{ maxWidth: 480, margin: '0 auto', padding: '16px' }}>
        
        {/* CAMPO COM MARCAÇÕES FIDEDIGNAS */}
        <div style={{ 
          position: 'relative', width: fieldWidth, height: fieldWidth * 1.4, margin: '0 auto', 
          background: '#1a4a1a', borderRadius: 8, border: '4px solid #2a5a2a', 
          overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.6)' 
        }}>
          {/* Linhas Gramado */}
          <div style={{ position: 'absolute', top: '50%', width: '100%', height: 2, background: 'rgba(255,255,255,0.2)' }} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', width: 80, height: 80, border: '2px solid rgba(255,255,255,0.2)', borderRadius: '50%', transform: 'translate(-50%, -50%)' }} />
          <div style={{ position: 'absolute', top: 0, left: '20%', width: '60%', height: '12%', border: '2px solid rgba(255,255,255,0.2)', borderTop: 0 }} />
          <div style={{ position: 'absolute', bottom: 0, left: '15%', width: '70%', height: '18%', border: '2px solid rgba(255,255,255,0.2)', borderBottom: 0 }} />

          {/* Jogadores no Campo */}
          {FORMATION_4231.map((slot) => {
            const p = lineup[slot.id];
            const active = selectedSlot === slot.id;
            return (
              <div key={slot.id} onClick={() => setSelectedSlot(slot.id)} style={{
                position: 'absolute', left: `${slot.x}%`, top: `${slot.y}%`,
                transform: 'translate(-50%, -50%)', cursor: 'pointer', zIndex: 10
              }}>
                {p ? (
                  <PlayerCard player={p} size={fieldWidth * 0.18} isField={true} />
                ) : (
                  <div style={{ 
                    width: fieldWidth * 0.14, height: fieldWidth * 0.14, 
                    borderRadius: '50%', border: active ? '3px solid #F5C400' : '2px dashed rgba(255,255,255,0.4)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    background: active ? 'rgba(245,196,0,0.2)' : 'rgba(0,0,0,0.3)'
                  }}>
                    <span style={{ fontSize: 12, fontWeight: 900, color: active ? '#F5C400' : '#fff' }}>+</span>
                    <span style={{ fontSize: 8, fontWeight: 800, color: active ? '#F5C400' : '#aaa' }}>{slot.label}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* WIDGET INSTRUTIVO */}
        <div style={{ background: '#111', margin: '20px 0', padding: 15, borderRadius: 12, border: '1px solid #222' }}>
          <div style={{ color: '#F5C400', fontWeight: 900, fontSize: 13, marginBottom: 8 }}>🐯 GUIA DE ESCALAÇÃO:</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, fontSize: 11, color: '#ccc' }}>
            <p>• Clique em uma posição vazia <b>(+)</b> no campo.</p>
            <p>• Selecione o craque na lista do mercado abaixo.</p>
            <p>• <b>Dica:</b> Use os filtros por posição para agilizar!</p>
          </div>
        </div>

        {/* MERCADO DE JOGADORES */}
        <div id="mercado" style={{ background: '#0a0a0a', paddingBottom: 100 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', alignItems: 'center' }}>
            <span style={{ fontWeight: 900, color: '#F5C400', fontSize: 12 }}>MERCADO ELITE</span>
            <span style={{ fontSize: 11, color: '#666' }}>{usedIds.length} / 11 SELECIONADOS</span>
          </div>

          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 12, scrollbarWidth: 'none' }}>
            {['TODOS', 'GOL', 'LAT', 'ZAG', 'MEI', 'ATA'].map(pos => (
              <button key={pos} onClick={() => setFilterPos(pos)} style={{
                padding: '8px 16px', borderRadius: 20, border: 'none',
                background: filterPos === pos ? '#F5C400' : '#222',
                color: filterPos === pos ? '#000' : '#888',
                fontSize: 11, fontWeight: 900
              }}>{pos}</button>
            ))}
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap: 10 }}>
            {filteredPlayers.map(p => (
              <div key={p.id} onClick={() => selectPlayer(p)} style={{ opacity: selectedSlot ? 1 : 0.4, transform: selectedSlot ? 'scale(1)' : 'scale(0.95)', transition: '0.3s' }}>
                {/* No mercado isField é false -> Pose da ESQUERDA */}
                <PlayerCard player={p} size={(fieldWidth / 4) - 15} />
              </div>
            ))}
          </div>
        </div>

        {/* BOTÃO FINALIZAR */}
        <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', padding: 20, background: 'linear-gradient(transparent, #000 50%)', zIndex: 100 }}>
          <button 
            onClick={() => setStep('finalizado')}
            disabled={usedIds.length < 11}
            style={{ 
              width: '100%', padding: 20, borderRadius: 16, border: 'none',
              background: usedIds.length === 11 ? '#F5C400' : '#1a1a1a',
              color: usedIds.length === 11 ? '#000' : '#444',
              fontWeight: 1000, fontSize: 16, cursor: 'pointer'
            }}
          >
            {usedIds.length < 11 ? `FALTAM ${11 - usedIds.length} JOGADORES` : 'CONFIRMAR TIME 🐯'}
          </button>
        </div>
      </div>

      {step === 'finalizado' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 20 }}>
          <h1 style={{ color: '#F5C400', fontWeight: 1000, fontSize: 32 }}>TIME ESCALADO!</h1>
          <p style={{ color: '#fff', marginTop: 10 }}>Boa sorte na rodada, Felipe!</p>
          <button onClick={() => setStep('escalar')} style={{ marginTop: 30, background: '#F5C400', color: '#000', border: 'none', padding: '12px 24px', borderRadius: 8, fontWeight: 900 }}>VOLTAR</button>
        </div>
      )}

      <style jsx>{`
        @keyframes card-entry { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        button:active { transform: scale(0.98); }
      `}</style>
    </main>
  );
}
