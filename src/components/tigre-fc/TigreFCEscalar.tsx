'use client';
import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const BASE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';
const ESCUDOS = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ESCUDOS/';

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
    { id: 'gk', x: 50, y: 88 }, { id: 'rb', x: 82, y: 70 }, { id: 'cb1', x: 62, y: 76 }, { id: 'cb2', x: 38, y: 76 }, { id: 'lb', x: 18, y: 70 },
    { id: 'm1', x: 50, y: 55 }, { id: 'm2', x: 72, y: 48 }, { id: 'm3', x: 28, y: 48 }, { id: 'st', x: 50, y: 15 }, { id: 'rw', x: 80, y: 22 }, { id: 'lw', x: 20, y: 22 }
  ],
  '4-4-2': [
    { id: 'gk', x: 50, y: 88 }, { id: 'rb', x: 82, y: 70 }, { id: 'cb1', x: 62, y: 76 }, { id: 'cb2', x: 38, y: 76 }, { id: 'lb', x: 18, y: 70 },
    { id: 'm1', x: 65, y: 50 }, { id: 'm2', x: 35, y: 50 }, { id: 'm3', x: 85, y: 45 }, { id: 'm4', x: 15, y: 45 }, { id: 'st1', x: 58, y: 18 }, { id: 'st2', x: 42, y: 18 }
  ],
  '4-2-3-1': [
    { id: 'gk', x: 50, y: 88 }, { id: 'rb', x: 82, y: 70 }, { id: 'cb1', x: 62, y: 76 }, { id: 'cb2', x: 38, y: 76 }, { id: 'lb', x: 18, y: 70 },
    { id: 'dm1', x: 62, y: 58 }, { id: 'dm2', x: 38, y: 58 }, { id: 'am1', x: 50, y: 38 }, { id: 'am2', x: 78, y: 35 }, { id: 'am3', x: 22, y: 35 }, { id: 'st', x: 50, y: 14 }
  ]
};

type Player = typeof PLAYERS[0];
type Lineup = Record<string, Player | null>;

function PlayerCard({ player, size, isSelected, isCaptain, isHero, isField }: { player: Player, size: number, isSelected?: boolean, isCaptain?: boolean, isHero?: boolean, isField?: boolean }) {
  return (
    <div className={`card-wrapper ${isSelected ? 'selected' : ''}`} style={{ width: size }}>
      <div className="card-box" style={{ height: size * 1.35, border: isSelected ? '2px solid #F5C400' : '1px solid #333' }}>
        <img src={player.foto} alt={player.short} crossOrigin="anonymous" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: isField ? 'right top' : 'left top' }} />
        {isCaptain && <div className="badge cap">C</div>}
        {isHero && <div className="badge star">⭐</div>}
        <div className="card-info">
          <div className="pos">{player.pos}</div>
          <div className="name">{player.short}</div>
        </div>
      </div>
      <style jsx>{`
        .card-wrapper { position: relative; transition: transform 0.2s; flex-shrink: 0; margin: 0 auto; }
        .card-box { background: #111; border-radius: 4px; overflow: hidden; position: relative; width: 100%; box-shadow: 0 4px 10px rgba(0,0,0,0.5); }
        .badge { position: absolute; top: 2px; right: 2px; width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 900; z-index: 5; border: 1px solid #000; }
        .cap { background: #F5C400; color: #000; }
        .star { background: #fff; color: #000; }
        .card-info { position: absolute; bottom: 0; width: 100%; background: rgba(0,0,0,0.9); text-align: center; padding: 2px 0; }
        .pos { color: #F5C400; font-size: 6px; font-weight: 900; }
        .name { color: #fff; font-size: 8px; font-weight: 900; text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      `}</style>
    </div>
  );
}

export default function TigreFCEscalar({ jogoId }: { jogoId: string | number }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'escalar' | 'palpite'>('escalar');
  const [formationKey, setFormationKey] = useState<keyof typeof FORMATIONS>('4-3-3');
  const [lineup, setLineup] = useState<Lineup>({});
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [specialMode, setSpecialMode] = useState<'captain' | 'hero' | null>(null);
  const [captain, setCaptain] = useState<number | null>(null);
  const [hero, setHero] = useState<number | null>(null);
  const [filterPos, setFilterPos] = useState<string>('TODOS');
  const [fieldWidth, setFieldWidth] = useState(360);
  const [gameData, setGameData] = useState({ home: 'TIGRE', away: 'ADVERSÁRIO', logoAway: '' });
  const [palpite, setPalpite] = useState({ home: 0, away: 0 });

  useEffect(() => {
    setMounted(true);
    const init = async () => {
      const { data: jogo } = await supabase.from('jogos').select('*').eq('id', jogoId).single();
      if (jogo) setGameData({ home: 'TIGRE', away: jogo.adversario?.toUpperCase() || 'ADVERSÁRIO', logoAway: `${ESCUDOS}${jogo.adversario_slug}.png` });
      
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('escalacoes').select('*').eq('usuario_id', user.id).eq('jogo_id', jogoId).order('created_at', { ascending: false }).limit(1).single();
        if (data) {
          setFormationKey(data.formacao as keyof typeof FORMATIONS);
          setCaptain(data.capitao_id); setHero(data.heroi_id);
          const saved = typeof data.lineup === 'string' ? JSON.parse(data.lineup) : data.lineup;
          const newLineup: Lineup = {};
          Object.keys(saved).forEach(k => {
             const p = PLAYERS.find(pl => pl.id === (saved[k]?.id || saved[k]));
             if (p) newLineup[k] = p;
          });
          setLineup(newLineup);
        }
      }
    };
    init();
    const up = () => setFieldWidth(Math.min(window.innerWidth - 20, 450));
    up(); window.addEventListener('resize', up);
    return () => window.removeEventListener('resize', up);
  }, [jogoId]);

  const handlePlayerClick = useCallback((p: Player) => {
    if (specialMode === 'captain') { setCaptain(p.id); setSpecialMode(null); }
    else if (specialMode === 'hero') { setHero(p.id); setSpecialMode(null); }
    else if (selectedSlot) { setLineup(prev => ({...prev, [selectedSlot]: p})); setSelectedSlot(null); }
  }, [specialMode, selectedSlot]);

  const currentIds = Object.values(lineup).filter(Boolean).map(p => p!.id);
  const is11 = currentIds.length === 11;
  const isComplete = is11 && captain !== null && hero !== null;

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const lineupData: any = {};
      Object.keys(lineup).forEach(key => {
        if (lineup[key]) lineupData[key] = { id: lineup[key]!.id, short: lineup[key]!.short };
      });

      const { error } = await supabase.from('escalacoes').insert({
        usuario_id: user.id,
        jogo_id: Number(jogoId),
        formacao: formationKey,
        lineup: lineupData,
        capitao_id: captain,
        heroi_id: hero,
        palpite_casa: palpite.home,
        palpite_fora: palpite.away
      });

      if (error) throw error;
      router.push('/tigre-fc/minhas-escalacoes');
    } catch (err: any) {
      alert("ERRO AO SALVAR: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <main className="main">
      <header className="top-bar">TIGRE FC <span className="gold">ELITE 26</span></header>

      {step === 'escalar' ? (
        <div className="view">
          <div className="form-selector">
            {(Object.keys(FORMATIONS) as Array<keyof typeof FORMATIONS>).map(f => (
              <button key={f} className={formationKey === f ? 'active' : ''} onClick={() => {setFormationKey(f); setLineup({}); setCaptain(null); setHero(null);}}>{f}</button>
            ))}
          </div>

          <div className={`status-msg ${isComplete ? 'ready' : (is11 ? 'needs-special' : '')}`}>
            {currentIds.length < 11 ? `SELECIONE MAIS ${11 - currentIds.length} JOGADORES` : (isComplete ? "TIME CONFIRMADO!" : "AGORA ESCOLHA SEU CAPITÃO E HERÓI")}
          </div>

          <div className="field" style={{ width: fieldWidth, height: fieldWidth * 1.35 }}>
            <div className="grass"></div>
            <div className="marks"><div className="outline"></div><div className="mid"></div><div className="circle"></div></div>
            {FORMATIONS[formationKey].map(slot => {
              const p = lineup[slot.id];
              return (
                <div key={slot.id} className="slot" onClick={() => {setSelectedSlot(slot.id); setSpecialMode(null);}} style={{ left: `${slot.x}%`, top: `${slot.y}%` }}>
                  {p ? <PlayerCard player={p} size={fieldWidth * 0.16} isCaptain={captain === p.id} isHero={hero === p.id} isField={true} /> 
                     : <div className={`plus ${selectedSlot === slot.id ? 'sel' : ''}`} style={{ width: fieldWidth * 0.11, height: fieldWidth * 0.11 }}>+</div>}
                </div>
              );
            })}
          </div>

          <div className="market">
            <div className="special-row">
              <button className={`btn-spec cap ${specialMode === 'captain' ? 'on' : ''} ${is11 && !captain ? 'neon-yellow' : ''}`} onClick={() => setSpecialMode('captain')}>
                {captain ? "CAPITÃO ✓" : "ESCOLHER CAPITÃO"}
              </button>
              <button className={`btn-spec her ${specialMode === 'hero' ? 'on' : ''} ${is11 && !hero ? 'neon-white' : ''}`} onClick={() => setSpecialMode('hero')}>
                {hero ? "HERÓI ✓" : "ESCOLHER HERÓI"}
              </button>
            </div>
            <div className="filter-row">
              {['TODOS', 'GOL', 'LAT', 'ZAG', 'MEI', 'ATA'].map(f => (
                <button key={f} className={filterPos === f ? 'active' : ''} onClick={() => setFilterPos(f)}>{f}</button>
              ))}
            </div>
            <div className="grid">
              {(specialMode ? (Object.values(lineup).filter(Boolean) as Player[]) : PLAYERS.filter(p => !currentIds.includes(p.id)))
                .filter(p => filterPos === 'TODOS' || p.pos === filterPos)
                .map(p => (
                  <div key={p.id} onClick={() => handlePlayerClick(p)}><PlayerCard player={p} size={(fieldWidth/3)-14} isField={false} /></div>
              ))}
            </div>
          </div>
          <div className="footer-dock">
            <button className="go-btn" disabled={!isComplete} onClick={() => setStep('palpite')}>PRÓXIMO PASSO ➜</button>
          </div>
        </div>
      ) : (
        <div className="palpite-view">
          <h2 className="title">PALPITE FINAL</h2>
          <div className="match-card">
            <div className="team">
              <div className="shield"><img src={`${ESCUDOS}tigre.png`} alt="Tigre" /></div>
              <p>TIGRE</p>
              <div className="control">
                <button onClick={() => setPalpite(p => ({...p, home: Math.max(0, p.home - 1)}))}>-</button>
                <span>{palpite.home}</span>
                <button onClick={() => setPalpite(p => ({...p, home: p.home + 1}))}>+</button>
              </div>
            </div>
            <div className="vs">VS</div>
            <div className="team">
              <div className="shield"><img src={gameData.logoAway} alt="Adv" onError={(e) => e.currentTarget.src=`${ESCUDOS}generic.png`} /></div>
              <p>{gameData.away}</p>
              <div className="control">
                <button onClick={() => setPalpite(p => ({...p, away: Math.max(0, p.away - 1)}))}>-</button>
                <span>{palpite.away}</span>
                <button onClick={() => setPalpite(p => ({...p, away: p.away + 1}))}>+</button>
              </div>
            </div>
          </div>
          <div className="final-actions">
            <button className="back" onClick={() => setStep('escalar')}>VOLTAR</button>
            <button className="save" disabled={loading} onClick={handleSave}>{loading ? 'SALVANDO...' : 'CONFIRMAR TUDO'}</button>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes neonY { 0%, 100% { box-shadow: 0 0 5px #F5C400; border-color: #F5C400; } 50% { box-shadow: 0 0 20px #F5C400; border-color: #fff; } }
        @keyframes neonW { 0%, 100% { box-shadow: 0 0 5px #fff; border-color: #fff; } 50% { box-shadow: 0 0 20px #fff; border-color: #F5C400; } }
        body { background: #000; color: #fff; margin: 0; font-family: sans-serif; }
        .top-bar { background: #F5C400; color: #000; padding: 15px; text-align: center; font-weight: 900; }
        .view { display: flex; flex-direction: column; align-items: center; padding: 10px; max-width: 500px; margin: 0 auto; }
        .status-msg { width: 100%; padding: 12px; background: #111; text-align: center; font-weight: 800; font-size: 11px; border-radius: 8px; margin-bottom: 10px; }
        .status-msg.needs-special { color: #F5C400; border: 1px solid #F5C400; }
        .status-msg.ready { background: #F5C400; color: #000; }
        .field { position: relative; background: #1a4a1a; border-radius: 10px; overflow: hidden; }
        .grass { position: absolute; inset: 0; background: repeating-linear-gradient(0deg, #143d14 0, #143d14 40px, #1a4a1a 40px, #1a4a1a 80px); }
        .marks { position: absolute; inset: 0; }
        .outline { position: absolute; inset: 10px; border: 1px solid rgba(255,255,255,0.2); }
        .mid { position: absolute; top: 50%; width: 100%; height: 1px; background: rgba(255,255,255,0.2); }
        .circle { position: absolute; top: 50%; left: 50%; width: 60px; height: 60px; border: 1px solid rgba(255,255,255,0.2); border-radius: 50%; transform: translate(-50%,-50%); }
        .slot { position: absolute; transform: translate(-50%, -50%); z-index: 10; }
        .plus { border-radius: 50%; border: 2px dashed #444; display: flex; align-items: center; justify-content: center; color: #444; }
        .plus.sel { border-color: #F5C400; color: #F5C400; }
        .market { width: 100%; padding-bottom: 100px; margin-top: 20px; }
        .special-row { display: flex; gap: 10px; margin-bottom: 20px; }
        .btn-spec { flex: 1; padding: 14px; border-radius: 10px; background: #111; border: 1px solid #333; color: #555; font-weight: 900; font-size: 10px; }
        .btn-spec.on { border-color: #F5C400; color: #fff; }
        .neon-yellow { animation: neonY 1s infinite !important; }
        .neon-white { animation: neonW 1s infinite !important; }
        .filter-row { display: flex; gap: 8px; overflow-x: auto; margin-bottom: 15px; scrollbar-width: none; }
        .filter-row button { background: #111; border: 1px solid #222; color: #666; padding: 7px 15px; border-radius: 20px; font-size: 10px; font-weight: 800; }
        .filter-row button.active { background: #fff; color: #000; }
        .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        .footer-dock { position: fixed; bottom: 0; left: 0; width: 100%; padding: 20px; background: linear-gradient(transparent, #000 50%); display: flex; justify-content: center; z-index: 100; }
        .go-btn { width: 100%; max-width: 400px; padding: 18px; background: #F5C400; color: #000; border: none; border-radius: 12px; font-weight: 900; }
        .palpite-view { min-height: 80vh; padding: 40px 20px; display: flex; flex-direction: column; align-items: center; }
        .match-card { display: flex; align-items: center; gap: 20px; width: 100%; justify-content: space-between; margin-bottom: 50px; }
        .team { display: flex; flex-direction: column; align-items: center; }
        .shield { width: 80px; height: 80px; background: #111; border-radius: 15px; padding: 10px; display: flex; align-items: center; justify-content: center; }
        .shield img { max-width: 100%; max-height: 100%; }
        .control { display: flex; align-items: center; background: #111; border-radius: 10px; padding: 5px; margin-top: 10px; }
        .control button { width: 30px; height: 30px; background: #222; border: none; color: #fff; border-radius: 5px; }
        .control span { width: 30px; text-align: center; font-weight: 900; color: #F5C400; }
        .final-actions { display: flex; flex-direction: column; gap: 10px; width: 100%; max-width: 400px; }
        .save { padding: 20px; background: #F5C400; border: none; border-radius: 12px; font-weight: 900; }
        .back { padding: 15px; background: transparent; border: 1px solid #333; color: #555; border-radius: 12px; }
      `}</style>
    </main>
  );
}
