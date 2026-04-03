'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import html2canvas from 'html2canvas';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const BASE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';
const ASSETS = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ASSETS/';

const PLAYERS = [
  { id: 1,  name: 'César Augusto',   short: 'César',      num: 31, pos: 'GOL', foto: BASE+'CESAR-AUGUSTO.jpg.webp' },
  { id: 2,  name: 'Jordi',           short: 'Jordi',      num: 93, pos: 'GOL', foto: BASE+'JORDI.jpg.webp' },
  { id: 3,  name: 'João Scapin',     short: 'Scapin',     num: 12, pos: 'GOL', foto: BASE+'JOAO-SCAPIN.jpg.webp' },
  { id: 4,  name: 'Lucas Ribeiro',   short: 'Lucas',      num: 1,  pos: 'GOL', foto: BASE+'LUCAS-RIBEIRO.jpg.webp' },
  { id: 5,  name: 'Lora',            short: 'Lora',       num: 2,  pos: 'LAT', foto: BASE+'LORA.jpg.webp' },
  { id: 6,  name: 'Castrillón',      short: 'Castrillón', num: 6,  pos: 'LAT', foto: BASE+'CASTRILLON.jpg.webp' },
  { id: 7,  name: 'Arthur Barbosa',  short: 'A.Barbosa',  num: 22, pos: 'LAT', foto: BASE+'ARTHUR-BARBOSA.jpg.webp' },
  { id: 8,  name: 'Sander',          short: 'Sander',     num: 33, pos: 'LAT', foto: BASE+'SANDER.jpg.webp' },
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
    { id: 'gk', x: 50, y: 88 },
    { id: 'rb', x: 82, y: 70 }, { id: 'cb1', x: 62, y: 76 }, { id: 'cb2', x: 38, y: 76 }, { id: 'lb', x: 18, y: 70 },
    { id: 'm1', x: 50, y: 55 }, { id: 'm2', x: 72, y: 48 }, { id: 'm3', x: 28, y: 48 },
    { id: 'st', x: 50, y: 15 }, { id: 'rw', x: 80, y: 22 }, { id: 'lw', x: 20, y: 22 }
  ],
  '4-4-2': [
    { id: 'gk', x: 50, y: 88 },
    { id: 'rb', x: 82, y: 70 }, { id: 'cb1', x: 62, y: 76 }, { id: 'cb2', x: 38, y: 76 }, { id: 'lb', x: 18, y: 70 },
    { id: 'm1', x: 65, y: 50 }, { id: 'm2', x: 35, y: 50 }, { id: 'm3', x: 85, y: 45 }, { id: 'm4', x: 15, y: 45 },
    { id: 'st1', x: 58, y: 18 }, { id: 'st2', x: 42, y: 18 }
  ],
  '4-2-3-1': [
    { id: 'gk', x: 50, y: 88 },
    { id: 'rb', x: 82, y: 70 }, { id: 'cb1', x: 62, y: 76 }, { id: 'cb2', x: 38, y: 76 }, { id: 'lb', x: 18, y: 70 },
    { id: 'dm1', x: 62, y: 58 }, { id: 'dm2', x: 38, y: 58 },
    { id: 'am1', x: 50, y: 38 }, { id: 'am2', x: 78, y: 35 }, { id: 'am3', x: 22, y: 35 },
    { id: 'st', x: 50, y: 14 }
  ]
};

type Player = typeof PLAYERS[0];
type Lineup = Record<string, Player | null>;

function PlayerCard({ player, size, isSelected, isCaptain, isHero, isField }: { player: Player, size: number, isSelected?: boolean, isCaptain?: boolean, isHero?: boolean, isField?: boolean }) {
  return (
    <div className={`card-wrapper ${isSelected ? 'selected' : ''}`} style={{ width: size }}>
      <div className="card-box" style={{ height: size * 1.35, border: isSelected ? '2px solid #F5C400' : '1px solid #333' }}>
        <img 
          src={`${player.foto}`} 
          alt={player.short}
          crossOrigin="anonymous"
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover',
            // AJUSTE CRÍTICO: Posição à esquerda para o mercado
            objectPosition: isField ? 'center top' : 'left top',
            display: 'block'
          }}
        />
        {isCaptain && <div className="badge cap">C</div>}
        {isHero && <div className="badge star">⭐</div>}
        <div className="card-info">
          <div className="pos">{player.pos}</div>
          <div className="name">{player.short}</div>
        </div>
      </div>
      <style jsx>{`
        .card-wrapper { position: relative; transition: transform 0.2s; flex-shrink: 0; margin: 0 auto; }
        .selected { transform: scale(1.08); z-index: 50; }
        .card-box { background: #111; border-radius: 4px; overflow: hidden; position: relative; width: 100%; box-shadow: 0 4px 10px rgba(0,0,0,0.5); }
        .badge { position: absolute; top: 2px; right: 2px; width: 16px; height: 16px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 900; z-index: 5; border: 1px solid #000; }
        .cap { background: #F5C400; color: #000; }
        .star { background: #fff; color: #000; }
        .card-info { position: absolute; bottom: 0; width: 100%; background: rgba(0,0,0,0.9); text-align: center; padding: 2px 0; border-top: 1px solid rgba(245,196,0,0.3); }
        .pos { color: #F5C400; font-size: 6px; font-weight: 900; line-height: 1; }
        .name { color: #fff; font-size: 8px; font-weight: 900; text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding: 0 1px; }
      `}</style>
    </div>
  );
}

export default function TigreFCEscalar() {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'escalar' | 'palpite' | 'compartilhar'>('escalar');
  const [formationKey, setFormationKey] = useState<keyof typeof FORMATIONS>('4-3-3');
  const [lineup, setLineup] = useState<Lineup>({});
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [specialMode, setSpecialMode] = useState<'captain' | 'hero' | null>(null);
  const [captain, setCaptain] = useState<number | null>(null);
  const [hero, setHero] = useState<number | null>(null);
  const [palpite, setPalpite] = useState({ home: 0, away: 0 });
  const [filterPos, setFilterPos] = useState<string>('TODOS');
  const [fieldWidth, setFieldWidth] = useState(360);

  // IMPORTAÇÃO AUTOMÁTICA DO SUPABASE
  useEffect(() => {
    setMounted(true);
    const fetchLineup = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
            .from('escalacoes')
            .select('*')
            .eq('usuario_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (data && !error) {
            setFormationKey(data.formacao as keyof typeof FORMATIONS);
            setCaptain(data.capitao_id);
            setHero(data.heroi_id);
            
            const savedLineup = typeof data.lineup === 'string' ? JSON.parse(data.lineup) : data.lineup;
            const newLineup: Lineup = {};
            Object.keys(savedLineup).forEach(slotId => {
                const pId = savedLineup[slotId]?.id || savedLineup[slotId];
                const match = PLAYERS.find(p => p.id === pId);
                if (match) newLineup[slotId] = match;
            });
            setLineup(newLineup);
        }
    };
    fetchLineup();
    const updateSize = () => setFieldWidth(Math.min(window.innerWidth - 20, 450));
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const changeFormation = (key: keyof typeof FORMATIONS) => {
    setFormationKey(key);
    setLineup({});
    setSelectedSlot(null);
    setCaptain(null);
    setHero(null);
  };

  const currentUsedIds = Object.values(lineup).filter(Boolean).map(p => p!.id);
  const playersCount = currentUsedIds.length;
  const isComplete = playersCount === 11 && captain !== null && hero !== null;

  const handlePlayerClick = useCallback((p: Player) => {
    if (specialMode === 'captain') { setCaptain(p.id); setSpecialMode(null); }
    else if (specialMode === 'hero') { setHero(p.id); setSpecialMode(null); }
    else if (selectedSlot) { setLineup(prev => ({...prev, [selectedSlot]: p})); setSelectedSlot(null); }
  }, [specialMode, selectedSlot]);

  if (!mounted) return null;

  return (
    <main className="container">
      <header className="header">TIGRE FC <span className="elite">ELITE 26</span></header>

      {step === 'escalar' && (
        <div className="content">
          <div className="formation-selector">
            {(Object.keys(FORMATIONS) as Array<keyof typeof FORMATIONS>).map(f => (
              <button key={f} className={formationKey === f ? 'active' : ''} onClick={() => changeFormation(f)}>{f}</button>
            ))}
          </div>

          <div className={`alert ${playersCount === 11 && (!captain || !hero) ? 'highlight' : ''}`}>
             {playersCount < 11 ? `FALTA(M) ${11 - playersCount} JOGADOR(ES)` : (isComplete ? "✅ PRONTO PARA O JOGO" : "🎖️ ESCOLHA CAPITÃO E HERÓI")}
          </div>

          {/* CAMPO FIDEDIGNO QUADRICULADO */}
          <div className="field" style={{ width: fieldWidth, height: fieldWidth * 1.35 }}>
            <div className="pitch-grass"></div>
            <div className="pitch-markings">
              <div className="pitch-outline"></div>
              <div className="center-line"></div>
              <div className="center-circle"></div>
              <div className="penalty-area top"><div className="goal-area"></div><div className="penalty-arc"></div></div>
              <div className="penalty-area bottom"><div className="goal-area"></div><div className="penalty-arc"></div></div>
            </div>
            
            {FORMATIONS[formationKey].map(slot => {
              const p = lineup[slot.id];
              return (
                <div key={slot.id} className="slot" onClick={() => { setSelectedSlot(slot.id); setSpecialMode(null); }} style={{ left: `${slot.x}%`, top: `${slot.y}%` }}>
                  {p ? <PlayerCard player={p} size={fieldWidth * 0.16} isCaptain={captain === p.id} isHero={hero === p.id} isField /> 
                     : <div className={`dot ${selectedSlot === slot.id ? 'active' : ''}`} style={{ width: fieldWidth * 0.11, height: fieldWidth * 0.11 }}>+</div>}
                </div>
              );
            })}
          </div>

          <div className="market-section">
            <div className="special-selectors">
                <button className={`spec-btn ${specialMode === 'captain' ? 'active' : ''}`} onClick={() => setSpecialMode('captain')}>CAPITÃO</button>
                <button className={`spec-btn ${specialMode === 'hero' ? 'active' : ''}`} onClick={() => setSpecialMode('hero')}>HERÓI</button>
            </div>
            <div className="filters">
                {['TODOS', 'GOL', 'LAT', 'ZAG', 'MEI', 'ATA'].map(f => (
                  <button key={f} className={filterPos === f ? 'f-active' : ''} onClick={() => setFilterPos(f)}>{f}</button>
                ))}
            </div>
            <div className="players-grid">
              {(specialMode ? (Object.values(lineup).filter(Boolean) as Player[]) : PLAYERS.filter(p => !currentUsedIds.includes(p.id)))
                .filter(p => filterPos === 'TODOS' || p.pos === filterPos)
                .map(p => (
                <div key={p.id} className="grid-item" onClick={() => handlePlayerClick(p)}>
                  <PlayerCard player={p} size={(fieldWidth / 3) - 16} />
                </div>
              ))}
            </div>
          </div>
          
          <div className="dock">
            <button className="next-btn" disabled={!isComplete} onClick={() => setStep('palpite')}>PRÓXIMO PASSO ➜</button>
          </div>
        </div>
      )}

      {/* Estilos Globais e do Componente */}
      <style jsx global>{`
        body { background: #000; margin: 0; font-family: 'Inter', sans-serif; color: #fff; }
        .header { background: #F5C400; color: #000; text-align: center; padding: 15px; font-weight: 900; }
        .content { display: flex; flex-direction: column; align-items: center; padding: 10px; max-width: 500px; margin: 0 auto; width: 100%; }
        
        /* CAMPO */
        .field { position: relative; border-radius: 8px; overflow: hidden; background: #1a4a1a; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .pitch-grass { 
            position: absolute; inset: 0;
            background-image: linear-gradient(rgba(255,255,255,0.05) 50%, transparent 50%),
                              linear-gradient(90deg, rgba(255,255,255,0.05) 50%, transparent 50%);
            background-size: 45px 45px;
        }
        .pitch-markings { position: absolute; inset: 0; pointer-events: none; }
        .pitch-outline { position: absolute; inset: 10px; border: 2px solid rgba(255,255,255,0.3); }
        .center-line { position: absolute; top: 50%; width: 100%; height: 2px; background: rgba(255,255,255,0.3); }
        .center-circle { position: absolute; top: 50%; left: 50%; width: 80px; height: 80px; border: 2px solid rgba(255,255,255,0.3); border-radius: 50%; transform: translate(-50%, -50%); }
        .penalty-area { position: absolute; left: 50%; transform: translateX(-50%); width: 60%; height: 18%; border: 2px solid rgba(255,255,255,0.3); }
        .penalty-area.top { top: 10px; border-top: none; }
        .penalty-area.bottom { bottom: 10px; border-bottom: none; }
        .goal-area { position: absolute; left: 50%; transform: translateX(-50%); width: 50%; height: 40%; border: 2px solid rgba(255,255,255,0.3); }
        .top .goal-area { top: 0; border-top: none; }
        .bottom .goal-area { bottom: 0; border-bottom: none; }

        .slot { position: absolute; transform: translate(-50%, -50%); z-index: 10; cursor: pointer; }
        .dot { border-radius: 50%; border: 2px dashed rgba(255,255,255,0.4); display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.2); font-weight: 900; }
        .dot.active { border-color: #F5C400; background: rgba(245,196,0,0.2); }

        /* MERCADO */
        .market-section { width: 100%; padding-bottom: 120px; margin-top: 20px; }
        .filters { display: flex; gap: 8px; overflow-x: auto; margin: 15px 0; scrollbar-width: none; }
        .filters button { background: #111; border: 1px solid #333; color: #666; padding: 8px 15px; border-radius: 20px; font-size: 10px; font-weight: 800; white-space: nowrap; }
        .filters button.f-active { background: #fff; color: #000; }
        .players-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        .spec-btn { flex: 1; padding: 12px; border-radius: 8px; background: #111; border: 1px solid #333; color: #fff; font-weight: 900; }
        .spec-btn.active { border-color: #F5C400; color: #F5C400; }
        .special-selectors { display: flex; gap: 10px; }

        .alert { width: 100%; text-align: center; padding: 12px; background: #111; border-radius: 8px; font-weight: 800; margin-bottom: 15px; }
        .alert.highlight { background: #F5C400; color: #000; }

        .dock { position: fixed; bottom: 0; left: 0; width: 100%; padding: 20px; background: linear-gradient(transparent, #000 50%); display: flex; justify-content: center; z-index: 150; }
        .next-btn { width: 100%; max-width: 400px; padding: 18px; background: #F5C400; border: none; border-radius: 12px; font-weight: 900; }
        .formation-selector { display: flex; gap: 5px; width: 100%; margin-bottom: 15px; }
        .formation-selector button { flex: 1; padding: 10px; background: #111; border: none; border-radius: 6px; color: #555; font-weight: 800; }
        .formation-selector button.active { background: #F5C400; color: #000; }
      `}</style>
    </main>
  );
}
