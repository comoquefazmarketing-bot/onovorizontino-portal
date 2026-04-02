'use client';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import html2canvas from 'html2canvas';

// Configuração do Cliente Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  }
);

const BASE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';
const ASSETS = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ASSETS/';

const PLAYERS = [
  { id: 1,  name: 'César Augusto',   short: 'César',      num: 31, pos: 'GOL', foto: BASE+'CESAR-AUGUSTO.jpg.webp' },
  { id: 2,  name: 'Jordi',             short: 'Jordi',      num: 93, pos: 'GOL', foto: BASE+'JORDI.jpg.webp' },
  { id: 3,  name: 'João Scapin',       short: 'Scapin',      num: 12, pos: 'GOL', foto: BASE+'JOAO-SCAPIN.jpg.webp' },
  { id: 4,  name: 'Lucas Ribeiro',     short: 'Lucas',      num: 1,  pos: 'GOL', foto: BASE+'LUCAS-RIBEIRO.jpg.webp' },
  { id: 5,  name: 'Lora',              short: 'Lora',           num: 2,  pos: 'LAT', foto: BASE+'LORA.jpg.webp' },
  { id: 6,  name: 'Castrillón',         short: 'Castrillón', num: 6,  pos: 'LAT', foto: BASE+'CASTRILLON.jpg.webp' },
  { id: 7,  name: 'Arthur Barbosa',     short: 'A.Barbosa',  num: 22, pos: 'LAT', foto: BASE+'ARTHUR-BARBOSA.jpg.webp' },
  { id: 8,  name: 'Sander',             short: 'Sander',     num: 33, pos: 'LAT', foto: BASE+'SANDER.jpg.webp' },
  { id: 9,  name: 'Maykon Jesus',       short: 'Maykon',      num: 27, pos: 'LAT', foto: BASE+'MAYKON-JESUS.jpg.webp' },
  { id: 10, name: 'Dantas',             short: 'Dantas',      num: 3,  pos: 'ZAG', foto: BASE+'DANTAAS.jpg.webp' },
  { id: 11, name: 'Eduardo Brock',      short: 'E.Brock',     num: 5,  pos: 'ZAG', foto: BASE+'EDUARDO-BROCK.jpg.webp' },
  { id: 12, name: 'Patrick',            short: 'Patrick',     num: 4,  pos: 'ZAG', foto: BASE+'PATRICK.jpg.webp' },
  { id: 13, name: 'Gabriel Bahia',      short: 'G.Bahia',     num: 14, pos: 'ZAG', foto: BASE+'GABRIEL-BAHIA.jpg.webp' },
  { id: 14, name: 'Carlinhos',          short: 'Carlinhos',   num: 25, pos: 'ZAG', foto: BASE+'CARLINHOS.jpg.webp' },
  { id: 15, name: 'Alemão',             short: 'Alemão',      num: 28, pos: 'ZAG', foto: BASE+'ALEMAO.jpg.webp' },
  { id: 16, name: 'Renato Palm',        short: 'R.Palm',      num: 24, pos: 'ZAG', foto: BASE+'RENATO-PALM.jpg.webp' },
  { id: 17, name: 'Alvariño',           short: 'Alvariño',     num: 35, pos: 'ZAG', foto: BASE+'IVAN-ALVARINO.jpg.webp' },
  { id: 18, name: 'Bruno Santana',      short: 'B.Santana',   num: 33, pos: 'ZAG', foto: BASE+'BRUNO-SANTANA.jpg.webp' },
  { id: 19, name: 'Luís Oyama',          short: 'Oyama',           num: 8,  pos: 'MEI', foto: BASE+'LUIS-OYAMA.jpg.webp' },
  { id: 20, name: 'Léo Naldi',          short: 'L.Naldi',     num: 7,  pos: 'MEI', foto: BASE+'LEO-NALDI.jpg.webp' },
  { id: 21, name: 'Rômulo',             short: 'Rômulo',      num: 10, pos: 'MEI', foto: BASE+'ROMULO.jpg.webp' },
  { id: 22, name: 'Matheus Bianqui',  short: 'Bianqui',     num: 11, pos: 'MEI', foto: BASE+'MATHEUS-BIANQUI.jpg.webp' },
  { id: 23, name: 'Juninho',            short: 'Juninho',     num: 20, pos: 'MEI', foto: BASE+'JUNINHO.jpg.webp' },
  { id: 24, name: 'Tavinho',            short: 'Tavinho',     num: 17, pos: 'MEI', foto: BASE+'TAVINHO.jpg.webp' },
  { id: 25, name: 'Diego Galo',          short: 'D.Galo',      num: 29, pos: 'MEI', foto: BASE+'DIEGO-GALO.jpg.webp' },
  { id: 26, name: 'Marlon',             short: 'Marlon',      num: 30, pos: 'MEI', foto: BASE+'MARLON.jpg.webp' },
  { id: 27, name: 'Hector Bianchi',     short: 'Hector',      num: 16, pos: 'MEI', foto: BASE+'HECTOR-BIACHI.jpg.webp' },
  { id: 28, name: 'Nogueira',           short: 'Nogueira',     num: 36, pos: 'MEI', foto: BASE+'NOGUEIRA.jpg.webp' },
  { id: 29, name: 'Luiz Gabriel',       short: 'L.Gabriel',   num: 37, pos: 'MEI', foto: BASE+'LUIZ-GABRIEL.jpg.webp' },
  { id: 30, name: 'Jhones Kauê',        short: 'J.Kauê',      num: 50, pos: 'MEI', foto: BASE+'JHONES-KAUE.jpg.webp' },
  { id: 31, name: 'Robson',             short: 'Robson',      num: 9,  pos: 'ATA', foto: BASE+'ROBSON.jpg.webp' },
  { id: 32, name: 'Vinícius Paiva',     short: 'V.Paiva',     num: 13, pos: 'ATA', foto: BASE+'VINICIUS-PAIVA.jpg.webp' },
  { id: 33, name: 'Hélio Borges',       short: 'H.Borges',     num: 18, pos: 'ATA', foto: BASE+'HELIO-BORGES.jpg.webp' },
  { id: 34, name: 'Jardiel',            short: 'Jardiel',     num: 19, pos: 'ATA', foto: BASE+'JARDIEL.jpg.webp' },
  { id: 35, name: 'Nicolas Careca',     short: 'N.Careca',     num: 21, pos: 'ATA', foto: BASE+'NICOLAS-CARECA.jpg.webp' },
  { id: 36, name: 'Titi Ortiz',         short: 'T.Ortiz',     num: 15, pos: 'ATA', foto: BASE+'TITI-ORTIZ.jpg.webp' },
  { id: 37, name: 'Diego Mathias',      short: 'D.Mathias',   num: 41, pos: 'ATA', foto: BASE+'DIEGO-MATHIAS.jpg.webp' },
  { id: 38, name: 'Carlão',             short: 'Carlão',      num: 90, pos: 'ATA', foto: BASE+'CARLAO.jpg.webp' },
  { id: 39, name: 'Ronald Barcellos',  short: 'Ronald',      num: 23, pos: 'ATA', foto: BASE+'RONALD-BARCELLOS.jpg.webp' },
];

const FORMATIONS = {
  '4-3-3': [
    { id: 'gk', x: 50, y: 90 },
    { id: 'rb', x: 85, y: 72 }, { id: 'cb1', x: 65, y: 78 }, { id: 'cb2', x: 35, y: 78 }, { id: 'lb', x: 15, y: 72 },
    { id: 'm1', x: 50, y: 55 }, { id: 'm2', x: 75, y: 48 }, { id: 'm3', x: 25, y: 48 },
    { id: 'st', x: 50, y: 15 }, { id: 'rw', x: 82, y: 22 }, { id: 'lw', x: 18, y: 22 }
  ],
  '4-4-2': [
    { id: 'gk', x: 50, y: 90 },
    { id: 'rb', x: 85, y: 72 }, { id: 'cb1', x: 65, y: 78 }, { id: 'cb2', x: 35, y: 78 }, { id: 'lb', x: 15, y: 72 },
    { id: 'm1', x: 70, y: 50 }, { id: 'm2', x: 30, y: 50 }, { id: 'm3', x: 90, y: 45 }, { id: 'm4', x: 10, y: 45 },
    { id: 'st1', x: 60, y: 18 }, { id: 'st2', x: 40, y: 18 }
  ],
  '3-5-2': [
    { id: 'gk', x: 50, y: 90 },
    { id: 'cb1', x: 50, y: 78 }, { id: 'cb2', x: 75, y: 75 }, { id: 'cb3', x: 25, y: 75 },
    { id: 'm1', x: 50, y: 55 }, { id: 'm2', x: 70, y: 48 }, { id: 'm3', x: 30, y: 48 }, { id: 'w1', x: 90, y: 40 }, { id: 'w2', x: 10, y: 40 },
    { id: 'st1', x: 60, y: 18 }, { id: 'st2', x: 40, y: 18 }
  ],
  '4-2-3-1': [
    { id: 'gk', x: 50, y: 90 },
    { id: 'rb', x: 85, y: 72 }, { id: 'cb1', x: 65, y: 78 }, { id: 'cb2', x: 35, y: 78 }, { id: 'lb', x: 15, y: 72 },
    { id: 'dm1', x: 65, y: 58 }, { id: 'dm2', x: 35, y: 58 },
    { id: 'am1', x: 50, y: 38 }, { id: 'am2', x: 82, y: 35 }, { id: 'am3', x: 18, y: 35 },
    { id: 'st', x: 50, y: 14 }
  ],
  '5-3-2': [
    { id: 'gk', x: 50, y: 90 },
    { id: 'cb1', x: 50, y: 80 }, { id: 'cb2', x: 72, y: 78 }, { id: 'cb3', x: 28, y: 78 }, { id: 'rwb', x: 90, y: 65 }, { id: 'lwb', x: 10, y: 65 },
    { id: 'm1', x: 50, y: 50 }, { id: 'm2', x: 75, y: 45 }, { id: 'm3', x: 25, y: 45 },
    { id: 'st1', x: 62, y: 18 }, { id: 'st2', x: 38, y: 18 }
  ]
};

type Player = typeof PLAYERS[0];
type Lineup = Record<string, Player | null>;

function PlayerCard({ player, size, isSelected, isCaptain, isHero, isField }: { player: Player, size: number, isSelected?: boolean, isCaptain?: boolean, isHero?: boolean, isField?: boolean }) {
  const bgPos = isField ? 'right' : 'left';
  return (
    <div className={`card-wrapper ${isSelected ? 'selected' : ''}`} style={{ width: size }}>
      <div className="card-box" style={{ height: size * 1.35, border: isSelected ? '3px solid #F5C400' : '1px solid #333' }}>
        <div className="player-img" style={{
          width: '100%', height: '100%',
          backgroundImage: `url(${player.foto})`,
          backgroundSize: 'cover',
          backgroundPosition: `${bgPos} top`
        }} />
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
        .card-box { background: #111; border-radius: 6px; overflow: hidden; position: relative; width: 100%; box-shadow: 0 4px 10px rgba(0,0,0,0.5); }
        .badge { position: absolute; top: 2px; right: 2px; width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 900; z-index: 5; border: 1px solid #000; }
        .cap { background: #F5C400; color: #000; }
        .star { background: #fff; color: #000; }
        .card-info { position: absolute; bottom: 0; width: 100%; background: rgba(0,0,0,0.9); text-align: center; padding: 4px 0; }
        .pos { color: #F5C400; font-size: 7px; font-weight: 900; }
        .name { color: #fff; font-size: 9px; font-weight: 900; text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      `}</style>
    </div>
  );
}

export default function TigreFCEscalar({ jogoId = 3 }: { jogoId?: number }) {
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

  useEffect(() => {
    setMounted(true);
    const updateSize = () => setFieldWidth(Math.min(window.innerWidth - 20, 450));
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const usedPlayers = Object.values(lineup).filter(Boolean) as Player[];
  const usedIds = usedPlayers.map(p => p.id);
  const isComplete = usedIds.length === 11 && captain && hero;

  const handlePlayerClick = (p: Player) => {
    if (specialMode === 'captain') {
        setCaptain(p.id);
        setSpecialMode(null);
    } else if (specialMode === 'hero') {
        setHero(p.id);
        setSpecialMode(null);
    } else if (selectedSlot) {
        setLineup({...lineup, [selectedSlot]: p});
        setSelectedSlot(null);
    }
  };

  const handleFinishAndShare = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from('escalacoes').insert([{
        user_id: user?.id || null,
        jogo_id: jogoId,
        jogadores_ids: usedIds,
        capitao_id: captain,
        heroi_id: hero,
        palpite_casa: palpite.home,
        palpite_fora: palpite.away,
        formacao: formationKey
      }]);

      if (cardRef.current) {
        const canvas = await html2canvas(cardRef.current, { useCORS: true, scale: 2 });
        const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/png'));
        if (blob && navigator.share) {
          const file = new File([blob], 'meu-tigre-fc.png', { type: 'image/png' });
          await navigator.share({ title: 'Minha Escalação Tigre FC', files: [file] });
        }
      }
      alert("Salvo com sucesso!");
      window.location.href = '/';
    } catch (err) { alert("Erro ao salvar."); } finally { setLoading(false); }
  };

  if (!mounted) return null;

  return (
    <main className="container">
      <header className="header">TIGRE FC <span className="elite">ELITE 26</span></header>

      {step === 'escalar' && (
        <div className="content">
          
          <div className="formation-selector">
            {Object.keys(FORMATIONS).map(f => (
              <button key={f} className={formationKey === f ? 'active' : ''} 
                onClick={() => { setFormationKey(f as any); setLineup({}); setSelectedSlot(null); }}>
                {f}
              </button>
            ))}
          </div>

          <div className="alert highlight">
            {specialMode ? `SELECIONE O ${specialMode.toUpperCase()}` : (selectedSlot ? "ESCOLHA O JOGADOR" : "MONTE SEU TIME")}
          </div>

          <div className="field" style={{ width: fieldWidth, height: fieldWidth * 1.4 }}>
            <div className="pitch-markings">
              <div className="center-line"></div>
              <div className="center-circle"></div>
              <div className="penalty-spot top"></div>
              <div className="penalty-spot bottom"></div>
              <div className="area top">
                <div className="small-area"></div>
              </div>
              <div className="area bottom">
                <div className="small-area"></div>
              </div>
            </div>
            
            {FORMATIONS[formationKey].map(slot => {
              const p = lineup[slot.id];
              const isSel = selectedSlot === slot.id;
              return (
                <div key={slot.id} className="slot" onClick={() => { setSelectedSlot(isSel ? null : slot.id); setSpecialMode(null); }} style={{ left: `${slot.x}%`, top: `${slot.y}%` }}>
                  {p ? (
                    <PlayerCard player={p} size={fieldWidth * 0.17} isSelected={isSel} isCaptain={captain === p.id} isHero={hero === p.id} isField />
                  ) : (
                    <div className={`dot ${isSel ? 'active' : ''}`} style={{ width: fieldWidth * 0.12, height: fieldWidth * 0.12 }}>
                      <span className="plus">+</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="market-section">
            <div className="market-sticky-header">
              <div className="special-selectors">
                <button className={`spec-btn cap ${specialMode === 'captain' ? 'active' : ''}`} onClick={() => { setSpecialMode('captain'); setSelectedSlot(null); }}>
                    {captain ? "CAP: " + PLAYERS.find(p=>p.id===captain)?.short : "ESCOLHER CAPITÃO"}
                </button>
                <button className={`spec-btn star ${specialMode === 'hero' ? 'active' : ''}`} onClick={() => { setSpecialMode('hero'); setSelectedSlot(null); }}>
                    {hero ? "HERÓI: " + PLAYERS.find(p=>p.id===hero)?.short : "ESCOLHER HERÓI"}
                </button>
              </div>
              <div className="filters">
                {['TODOS', 'GOL', 'LAT', 'ZAG', 'MEI', 'ATA'].map(f => (
                  <button key={f} className={filterPos === f ? 'f-active' : ''} onClick={() => setFilterPos(f)}>{f}</button>
                ))}
              </div>
            </div>
            <div className="players-grid">
              {(specialMode ? usedPlayers : PLAYERS.filter(p => !usedIds.includes(p.id)))
                .filter(p => filterPos === 'TODOS' || p.pos === filterPos)
                .map(p => (
                <div key={p.id} className="grid-item" onClick={() => handlePlayerClick(p)}>
                  <PlayerCard player={p} size={(fieldWidth / 3) - 16} isCaptain={captain === p.id} isHero={hero === p.id} />
                </div>
              ))}
            </div>
          </div>
          
          <div className="dock">
            <button className="next-btn" disabled={!isComplete} onClick={() => setStep('palpite')}>PRÓXIMO PASSO ➜</button>
          </div>
        </div>
      )}

      {/* ETAPAS DE PALPITE E COMPARTILHAMENTO (LÓGICA IGUAL, APENAS ATUALIZADO NO CAMPO) */}
      {step === 'compartilhar' && (
        <div className="content">
          <div id="final-card" ref={cardRef} className="card-capture">
             <div className="capture-header">
                <div className="header-logo">🐯 TIGRE FC</div>
                <div className="header-match">ESQUEMA {formationKey} | JOGO {jogoId}</div>
             </div>
             <div className="capture-field">
                {FORMATIONS[formationKey].map(slot => (
                   <div key={slot.id} className="slot-mini" style={{ left: `${slot.x}%`, top: `${slot.y}%` }}>
                      {lineup[slot.id] && <PlayerCard 
                        player={lineup[slot.id]!} 
                        size={52} 
                        isCaptain={captain === lineup[slot.id]?.id} 
                        isHero={hero === lineup[slot.id]?.id} 
                        isField 
                      />}
                   </div>
                ))}
             </div>
             <div className="capture-footer">
                <div className="footer-row">
                  <div className="footer-placar">PALPITE: {palpite.home} x {palpite.away}</div>
                  <div className="footer-author">BY FELIPE MAKARIOS</div>
                </div>
             </div>
          </div>
          <div className="share-actions">
            <button className="share-btn" onClick={handleFinishAndShare} disabled={loading}>
              {loading ? "PROCESSANDO..." : "🚀 SALVAR E COMPARTILHAR"}
            </button>
          </div>
        </div>
      )}

      <style jsx global>{`
        body { background: #000; margin: 0; font-family: 'Inter', sans-serif; color: #fff; }
        .header { background: #F5C400; color: #000; text-align: center; padding: 15px; font-weight: 900; }
        .content { display: flex; flex-direction: column; align-items: center; padding: 10px; max-width: 500px; margin: 0 auto; }
        
        .formation-selector { display: flex; gap: 5px; margin-bottom: 10px; background: #111; padding: 5px; border-radius: 10px; width: 100%; }
        .formation-selector button { flex: 1; padding: 8px; border: none; background: transparent; color: #555; font-weight: 800; font-size: 11px; cursor: pointer; border-radius: 6px; }
        .formation-selector button.active { background: #F5C400; color: #000; }

        .field { position: relative; background: #123512; border: 4px solid #1a4a1a; border-radius: 8px; overflow: hidden; margin-bottom: 20px; }
        .pitch-markings { position: absolute; inset: 0; pointer-events: none; }
        .center-line { position: absolute; top: 50%; width: 100%; height: 2px; background: rgba(255,255,255,0.2); }
        .center-circle { position: absolute; top: 50%; left: 50%; width: 70px; height: 70px; border: 2px solid rgba(255,255,255,0.2); border-radius: 50%; transform: translate(-50%, -50%); }
        .area { position: absolute; left: 50%; transform: translateX(-50%); width: 50%; height: 18%; border: 2px solid rgba(255,255,255,0.2); }
        .area.top { top: 0; }
        .area.bottom { bottom: 0; }
        .small-area { position: absolute; left: 50%; transform: translateX(-50%); width: 40%; height: 40%; border: 2px solid rgba(255,255,255,0.2); }
        .area.top .small-area { top: 0; }
        .area.bottom .small-area { bottom: 0; }
        .penalty-spot { position: absolute; left: 50%; width: 4px; height: 4px; background: #fff; border-radius: 50%; transform: translateX(-50%); }
        .penalty-spot.top { top: 12%; }
        .penalty-spot.bottom { bottom: 12%; }

        .slot { position: absolute; transform: translate(-50%, -50%); cursor: pointer; z-index: 10; }
        .dot { border-radius: 50%; border: 2px dashed rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.2); }
        .dot.active { border-color: #F5C400; background: rgba(245,196,0,0.1); }
        .plus { color: #333; font-size: 20px; }

        .market-section { width: 100%; background: #080808; border-radius: 12px; margin-top: 10px; padding-bottom: 100px; }
        .market-sticky-header { padding: 15px; border-bottom: 1px solid #111; }
        .special-selectors { display: flex; gap: 8px; margin-bottom: 10px; }
        .spec-btn { flex: 1; padding: 10px; border-radius: 6px; font-size: 9px; font-weight: 800; border: 1px solid #222; background: #000; color: #fff; }
        .spec-btn.active { border-color: #F5C400; }
        .filters { display: flex; gap: 5px; overflow-x: auto; scrollbar-width: none; }
        .filters button { background: #111; border: none; color: #444; padding: 6px 12px; border-radius: 15px; font-size: 10px; font-weight: 800; }
        .filters button.f-active { background: #F5C400; color: #000; }
        .players-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; padding: 15px; }

        .dock { position: fixed; bottom: 0; left: 0; width: 100%; padding: 20px; background: linear-gradient(transparent, #000 40%); display: flex; justify-content: center; }
        .next-btn { width: 100%; max-width: 400px; padding: 18px; background: #F5C400; color: #000; border-radius: 12px; font-weight: 900; border: none; }
        .next-btn:disabled { background: #222; color: #444; }

        .card-capture { width: 380px; background: #000; border: 6px solid #F5C400; padding: 15px; }
        .capture-field { position: relative; height: 420px; background: #123512; border-radius: 6px; margin: 10px 0; }
        .slot-mini { position: absolute; transform: translate(-50%, -50%); }
      `}</style>
    </main>
  );
}
