'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import TigreFCLogin from '@/components/tigre-fc/TigreFCLogin';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const LOGO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/tigre-fc-logo.png';
const BASE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';
const MINUTOS_ANTECEDENCIA = 90; 

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
  '4-4-2': [
    { id:'gk',  label:'GOL', x:50, y:92 }, { id:'rb',  label:'LAT', x:85, y:72 },
    { id:'cb1', label:'ZAG', x:62, y:78 }, { id:'cb2', label:'ZAG', x:38, y:78 },
    { id:'lb',  label:'LAT', x:15, y:72 }, { id:'rm',  label:'MEI', x:82, y:48 },
    { id:'cm1', label:'MEI', x:60, y:52 }, { id:'cm2', label:'MEI', x:40, y:52 },
    { id:'lm',  label:'MEI', x:18, y:48 }, { id:'st1', label:'ATA', x:65, y:18 },
    { id:'st2', label:'ATA', x:35, y:18 },
  ],
};

type Player = typeof PLAYERS[0];
type Lineup = Record<string, Player | null>;

function PlayerCard({ player, size, isCapitao, isHeroi, isField }: { player: Player, size: number, isCapitao?: boolean, isHeroi?: boolean, isField?: boolean }) {
  return (
    <div className="player-card-container" style={{ width: size, animation: 'card-entry 0.6s ease-out backwards' }}>
      <div className={`main-card-body ${isCapitao || isHeroi ? 'elite-border' : ''}`} style={{
        position: 'relative', width: size, height: size * 1.38,
        background: '#111', borderRadius: '8px', overflow: 'hidden',
        border: `1.5px solid ${isCapitao || isHeroi ? '#F5C400' : 'rgba(255,255,255,0.1)'}`,
        transform: isField ? 'rotateX(-15deg)' : 'none', // Contraponto à inclinação do campo
        transition: 'all 0.4s'
      }}>
        <div className="shine-overlay" />
        
        {/* Foto Dinâmica: Alinhada à esquerda na lista / Alinhada à direita no campo */}
        <div style={{
          width: '200%', height: '100%',
          backgroundImage: `url(${player.foto})`,
          backgroundSize: 'cover',
          backgroundPosition: isField ? 'right center' : 'left center',
          transition: 'background-position 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)'
        }} />

        <div className="card-info-box">
          <div className="pos-tag">{player.pos}</div>
          <div className="name-tag">{player.short}</div>
        </div>

        {(isCapitao || isHeroi) && <div className="badge-elite">{isCapitao ? 'C' : 'H'}</div>}
      </div>

      <style jsx>{`
        .card-info-box {
          position: absolute; bottom: 0; width: 100%;
          background: rgba(0,0,0,0.85); padding: 4px 0;
          text-align: center; border-top: 1px solid #F5C400;
        }
        .pos-tag { color: #F5C400; font-size: 8px; font-weight: 900; }
        .name-tag { color: #fff; font-size: 10px; font-weight: 1000; text-transform: uppercase; }
        .badge-elite {
          position: absolute; top: 4px; right: 4px; background: #F5C400;
          color: #000; width: 18px; height: 18px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-weight: 900; font-size: 10px; box-shadow: 0 0 10px #F5C400;
        }
        .shine-overlay {
          position: absolute; top: 0; left: -100%; width: 50%; height: 100%;
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent);
          transform: skewX(-20deg); animation: shine 3s infinite; z-index: 2;
        }
        @keyframes shine { to { left: 150%; } }
        @keyframes card-entry { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}

export default function TigreFCEscalar({ jogoId }: { jogoId: number }) {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState('login');
  const [formation, setFormation] = useState('4-3-3');
  const [lineup, setLineup] = useState<Lineup>({});
  const [selected, setSelected] = useState<{ player: Player, fromSlot: string | null } | null>(null);
  const [fieldWidth, setFieldWidth] = useState(360);

  useEffect(() => {
    setMounted(true);
    const update = () => setFieldWidth(Math.min(window.innerWidth - 32, 450));
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const handleTapSlot = (slotId: string) => {
    const playerInSlot = lineup[slotId];

    if (selected) {
      // SWAP LOGIC: Troca o jogador de lugar entre slots ou tira do banco para o campo
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

  if (!mounted) return null;
  if (step === 'login') return <TigreFCLogin jogoId={jogoId} onSuccess={() => setStep('escalar')} />;

  const currentSlots = FORMATIONS[formation];
  const usedIds = Object.values(lineup).filter(Boolean).map(p => p!.id);

  return (
    <main style={{ minHeight:'100vh', background:'#050505', color:'#fff', overflowX: 'hidden' }}>
      {/* Header FIFA Style */}
      <div style={{ background:'#F5C400', padding:16, textAlign:'center', borderBottom:'4px solid #ccaa00', position: 'relative', zIndex: 100 }}>
        <span style={{ color:'#000', fontWeight: 1000, letterSpacing: 2 }}>TIGRE FC <span style={{ fontWeight: 400 }}>ELITE 26</span></span>
      </div>

      <div style={{ maxWidth: 480, margin: '0 auto', padding: '10px 16px' }}>
        
        {/* CONTAINER DO CAMPO 3D */}
        <div style={{ 
          perspective: '1200px', 
          marginBottom: 30,
          marginTop: 10
        }}>
          <div style={{
            width: fieldWidth,
            height: fieldWidth * 1.35,
            margin: '0 auto',
            background: 'linear-gradient(180deg, #1a4a1a 0%, #0a2a0a 100%)',
            borderRadius: '16px',
            position: 'relative',
            boxShadow: '0 30px 80px rgba(0,0,0,0.8), inset 0 0 100px rgba(0,0,0,0.5)',
            backgroundImage: `
              repeating-linear-gradient(0deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 40px, transparent 40px, transparent 80px),
              url('https://www.transparenttextures.com/patterns/carbon-fibre.png')
            `,
            border: '2px solid rgba(255,255,255,0.1)',
            // EFEITO 3D FIFA
            transform: 'rotateX(25deg)', 
            transformStyle: 'preserve-3d'
          }}>
            {/* Linhas do Gramado */}
            <div style={{ position:'absolute', top:'50%', width:'100%', height:'1px', background:'rgba(255,255,255,0.1)' }} />
            <div style={{ position:'absolute', top:'50%', left:'50%', width:fieldWidth*0.4, height:fieldWidth*0.4, border:'1px solid rgba(255,255,255,0.1)', borderRadius:'50%', transform:'translate(-50%, -50%)' }} />

            {currentSlots.map((slot) => (
              <div key={slot.id} onClick={() => handleTapSlot(slot.id)} style={{
                position: 'absolute', left: `${slot.x}%`, top: `${slot.y}%`,
                transform: 'translate(-50%, -50%) translateZ(30px)', // Faz os cards "saltarem" para fora do campo
                zIndex: 10, cursor: 'pointer', transition: 'all 0.3s'
              }}>
                {lineup[slot.id] ? (
                  <PlayerCard player={lineup[slot.id]!} size={fieldWidth * 0.17} isField />
                ) : (
                  <div style={{
                    width: 38, height: 38, borderRadius: '50%', 
                    border: '1.5px dashed #F5C400', color: '#F5C400',
                    display: 'flex', align_items: 'center', justify_content: 'center', fontSize: 14,
                    background: 'rgba(0,0,0,0.3)'
                  }}>+</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* MERCADO DE JOGADORES */}
        <div style={{ background:'#111', borderRadius:24, padding:20, border:'1px solid #222', boxShadow: '0 -10px 40px rgba(0,0,0,0.5)' }}>
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
      </div>

      {/* BOTÃO FIXO COM GLOW ANIMADO */}
      <div style={{ position:'fixed', bottom:0, width:'100%', padding:20, background:'linear-gradient(transparent, #000 70%)', zIndex: 1000 }}>
        <button className="confirm-btn">
          {usedIds.length < 11 ? `FALTAM ${11 - usedIds.length} JOGADORES` : 'CONFIRMAR ELITE 🐯'}
        </button>
      </div>

      <style jsx>{`
        .confirm-btn {
          width: 100%; padding: 22px; border-radius: 14px; border: none;
          background: linear-gradient(90deg, #F5C400, #ffdb4d, #F5C400);
          background-size: 200% auto; color: #000; font-weight: 1000;
          font-size: 14px; text-transform: uppercase; letter-spacing: 1px;
          box-shadow: 0 5px 25px rgba(245, 196, 0, 0.4); 
          cursor: pointer; transition: 0.4s;
          animation: glow-pulse 2s infinite;
        }
        @keyframes glow-pulse {
          0% { box-shadow: 0 0 10px rgba(245, 196, 0, 0.3); }
          50% { box-shadow: 0 0 30px rgba(245, 196, 0, 0.6); }
          100% { box-shadow: 0 0 10px rgba(245, 196, 0, 0.3); }
        }
      `}</style>
    </main>
  );
}
