'use client';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import html2canvas from 'html2canvas';

// Configuração do Cliente Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const BASE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';
const ASSETS = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ASSETS/';

const PLAYERS = [
  { id: 1,  name: 'César Augusto',   short: 'César',      num: 31, pos: 'GOL', foto: BASE+'CESAR-AUGUSTO.jpg.webp' },
  { id: 2,  name: 'Jordi',             short: 'Jordi',      num: 93, pos: 'GOL', foto: BASE+'JORDI.jpg.webp' },
  { id: 3,  name: 'João Scapin',       short: 'Scapin',      num: 12, pos: 'GOL', foto: BASE+'JOAO-SCAPIN.jpg.webp' },
  { id: 4,  name: 'Lucas Ribeiro',     short: 'Lucas',      num: 1,  pos: 'GOL', foto: BASE+'LUCAS-RIBEIRO.jpg.webp' },
  { id: 5,  name: 'Lora',              short: 'Lora',            num: 2,  pos: 'LAT', foto: BASE+'LORA.jpg.webp' },
  { id: 6,  name: 'Castrillón',         short: 'Castrillón', num: 6,  pos: 'LAT', foto: BASE+'CASTRILLON.jpg.webp' },
  { id: 7,  name: 'Arthur Barbosa',     short: 'A.Barbosa',  num: 22, pos: 'LAT', foto: BASE+'ARTHUR-BARBOSA.jpg.webp' },
  { id: 8,  name: 'Sander',             short: 'Sander',     num: 33, pos: 'LAT', foto: BASE+'SANDER.jpg.webp' },
  { id: 9,  name: 'Maykon Jesus',       short: 'Maykon',      num: 27, pos: 'LAT', foto: BASE+'MAYKON-JESUS.jpg.webp' },
  { id: 10, name: 'Dantas',             short: 'Dantas',      num: 3,  pos: 'ZAG', foto: BASE+'DANTAAS.jpg.webp' },
  { id: 11, name: 'Eduardo Brock',      short: 'E.Brock',     num: 5,  pos: 'ZAG', foto: BASE+'EDUARDO-BROCK.jpg.webp' },
  { id: 12, name: 'Patrick',             short: 'Patrick',     num: 4,  pos: 'ZAG', foto: BASE+'PATRICK.jpg.webp' },
  { id: 13, name: 'Gabriel Bahia',      short: 'G.Bahia',     num: 14, pos: 'ZAG', foto: BASE+'GABRIEL-BAHIA.jpg.webp' },
  { id: 14, name: 'Carlinhos',          short: 'Carlinhos',   num: 25, pos: 'ZAG', foto: BASE+'CARLINHOS.jpg.webp' },
  { id: 15, name: 'Alemão',             short: 'Alemão',      num: 28, pos: 'ZAG', foto: BASE+'ALEMAO.jpg.webp' },
  { id: 16, name: 'Renato Palm',         short: 'R.Palm',      num: 24, pos: 'ZAG', foto: BASE+'RENATO-PALM.jpg.webp' },
  { id: 17, name: 'Alvariño',            short: 'Alvariño',     num: 35, pos: 'ZAG', foto: BASE+'IVAN-ALVARINO.jpg.webp' },
  { id: 18, name: 'Bruno Santana',      short: 'B.Santana',   num: 33, pos: 'ZAG', foto: BASE+'BRUNO-SANTANA.jpg.webp' },
  { id: 19, name: 'Luís Oyama',          short: 'Oyama',           num: 8,  pos: 'MEI', foto: BASE+'LUIS-OYAMA.jpg.webp' },
  { id: 20, name: 'Léo Naldi',          short: 'L.Naldi',     num: 7,  pos: 'MEI', foto: BASE+'LEO-NALDI.jpg.webp' },
  { id: 21, name: 'Rômulo',             short: 'Rômulo',      num: 10, pos: 'MEI', foto: BASE+'ROMULO.jpg.webp' },
  { id: 22, name: 'Matheus Bianqui',  short: 'Bianqui',     num: 11, pos: 'MEI', foto: BASE+'MATHEUS-BIANQUI.jpg.webp' },
  { id: 23, name: 'Juninho',             short: 'Juninho',     num: 20, pos: 'MEI', foto: BASE+'JUNINHO.jpg.webp' },
  { id: 24, name: 'Tavinho',             short: 'Tavinho',     num: 17, pos: 'MEI', foto: BASE+'TAVINHO.jpg.webp' },
  { id: 25, name: 'Diego Galo',          short: 'D.Galo',      num: 29, pos: 'MEI', foto: BASE+'DIEGO-GALO.jpg.webp' },
  { id: 26, name: 'Marlon',             short: 'Marlon',      num: 30, pos: 'MEI', foto: BASE+'MARLON.jpg.webp' },
  { id: 27, name: 'Hector Bianchi',     short: 'Hector',      num: 16, pos: 'MEI', foto: BASE+'HECTOR-BIACHI.jpg.webp' },
  { id: 28, name: 'Nogueira',           short: 'Nogueira',     num: 36, pos: 'MEI', foto: BASE+'NOGUEIRA.jpg.webp' },
  { id: 29, name: 'Luiz Gabriel',       short: 'L.Gabriel',   num: 37, pos: 'MEI', foto: BASE+'LUIZ-GABRIEL.jpg.webp' },
  { id: 30, name: 'Jhones Kauê',         short: 'J.Kauê',      num: 50, pos: 'MEI', foto: BASE+'JHONES-KAUE.jpg.webp' },
  { id: 31, name: 'Robson',             short: 'Robson',      num: 9,  pos: 'ATA', foto: BASE+'ROBSON.jpg.webp' },
  { id: 32, name: 'Vinícius Paiva',     short: 'V.Paiva',     num: 13, pos: 'ATA', foto: BASE+'VINICIUS-PAIVA.jpg.webp' },
  { id: 33, name: 'Hélio Borges',       short: 'H.Borges',     num: 18, pos: 'ATA', foto: BASE+'HELIO-BORGES.jpg.webp' },
  { id: 34, name: 'Jardiel',             short: 'Jardiel',     num: 19, pos: 'ATA', foto: BASE+'JARDIEL.jpg.webp' },
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
      <div className="card-box" style={{ height: size * 1.35, border: isSelected ? '2px solid #F5C400' : '1px solid #333' }}>
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

export default function TigreFCEscalar({ jogoId = 3 }: { jogoId?: number }) {
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
        setLineup(prev => ({...prev, [selectedSlot]: p}));
        setSelectedSlot(null);
    }
  };

  const handleFinishAndShare = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      // 1. Salvar no Supabase
      const { error } = await supabase.from('escalacoes').insert([{
        user_id: user?.id || null,
        jogo_id: jogoId,
        jogadores_ids: usedIds,
        capitao_id: captain,
        heroi_id: hero,
        palpite_casa: palpite.home,
        palpite_fora: palpite.away,
        formacao: formationKey,
        criado_por: "Felipe Makarios"
      }]);

      if (error) throw error;

      // 2. Capturar e compartilhar (opcional se der erro no navegador)
      if (cardRef.current) {
        try {
          const canvas = await html2canvas(cardRef.current, { useCORS: true, scale: 2 });
          const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/png'));
          
          if (blob && navigator.share) {
            const file = new File([blob], 'meu-tigre-fc.png', { type: 'image/png' });
            await navigator.share({ 
              title: 'Minha Escalação Tigre FC', 
              text: 'Confira meu time para o jogo!',
              files: [file] 
            });
          }
        } catch (shareErr) {
          console.log("Compartilhamento não concluído");
        }
      }

      // 3. Redirecionamento Final
      alert("Escalação salva com sucesso!");
      router.push('/'); 
      setTimeout(() => { window.location.href = "/"; }, 500);

    } catch (err) { 
      console.error(err);
      alert("Erro ao salvar sua escalação."); 
    } finally { 
      setLoading(false); 
    }
  };

  if (!mounted) return null;

  return (
    <main className="container">
      <header className="header">TIGRE FC <span className="elite">ELITE 26</span></header>

      {step === 'escalar' && (
        <div className="content">
          <div className="formation-selector">
            {(Object.keys(FORMATIONS) as Array<keyof typeof FORMATIONS>).map(f => (
              <button key={f} className={formationKey === f ? 'active' : ''} 
                onClick={() => { setFormationKey(f); setLineup({}); setSelectedSlot(null); }}>
                {f}
              </button>
            ))}
          </div>

          <div className={`alert ${selectedSlot || specialMode ? 'highlight' : ''}`}>
             {specialMode === 'captain' && "🎖️ SELECIONE O CAPITÃO"}
             {specialMode === 'hero' && "⭐ SELECIONE O HERÓI"}
             {selectedSlot && !specialMode && "⚡ SELECIONE O ATLETA"}
             {!selectedSlot && !specialMode && "👉 MONTE SEU TIME"}
          </div>

          <div className="field" style={{ width: fieldWidth, height: fieldWidth * 1.35 }}>
            <div className="pitch-markings">
              <div className="center-line"></div>
              <div className="center-circle"></div>
              <div className="area top"><div className="small-area"></div></div>
              <div className="area bottom"><div className="small-area"></div><div className="penalty-spot"></div></div>
            </div>
            
            {FORMATIONS[formationKey].map(slot => {
              const p = lineup[slot.id];
              const isSel = selectedSlot === slot.id;
              return (
                <div key={slot.id} className="slot" onClick={() => { setSelectedSlot(isSel ? null : slot.id); setSpecialMode(null); }} style={{ left: `${slot.x}%`, top: `${slot.y}%` }}>
                  {p ? (
                    <PlayerCard player={p} size={fieldWidth * 0.16} isSelected={isSel} isCaptain={captain === p.id} isHero={hero === p.id} isField />
                  ) : (
                    <div className={`dot ${isSel ? 'active' : ''}`} style={{ width: fieldWidth * 0.11, height: fieldWidth * 0.11 }}>
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
                    {captain ? "CAPITÃO OK" : "ESCOLHER CAPITÃO"}
                </button>
                <button className={`spec-btn star ${specialMode === 'hero' ? 'active' : ''}`} onClick={() => { setSpecialMode('hero'); setSelectedSlot(null); }}>
                    {hero ? "HERÓI OK" : "ESCOLHER HERÓI"}
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

      {step === 'palpite' && (
        <div className="content">
            <div className="alert highlight">⚽ QUAL SEU PALPITE?</div>
            <div className="match-day-hud">
                <div className="hud-scoreboard">
                    <div className="hud-team"><img src={ASSETS+'shield-tigre.png'} className="hud-shield" /><span>TIGRE</span></div>
                    <div className="hud-inputs">
                        <input type="number" value={palpite.home} onChange={e => setPalpite({...palpite, home: parseInt(e.target.value)||0})} />
                        <div className="hud-divider">X</div>
                        <input type="number" value={palpite.away} onChange={e => setPalpite({...palpite, away: parseInt(e.target.value)||0})} />
                    </div>
                    <div className="hud-team"><div className="adv-shield-placeholder">?</div><span>ADV</span></div>
                </div>
            </div>
            <div className="dock">
                <button className="next-btn" onClick={() => setStep('compartilhar')}>GERAR CARD ➜</button>
            </div>
        </div>
      )}

      {step === 'compartilhar' && (
        <div className="content">
          <div id="final-card" ref={cardRef} className="card-capture">
             <div className="capture-header">
                <div className="header-logo">🐯 TIGRE FC</div>
                <div className="header-match">ESQUEMA {formationKey} | JOGO {jogoId}</div>
             </div>
             <div className="capture-field">
                <div className="pitch-markings"><div className="center-line"></div></div>
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
              {loading ? "SALVANDO..." : "🚀 SALVAR E COMPARTILHAR"}
            </button>
            <button className="exit-btn" onClick={() => router.push('/')}>🏠 VOLTAR AO INÍCIO</button>
            <button className="back-btn" onClick={() => setStep('escalar')}>↺ EDITAR TIME</button>
          </div>
        </div>
      )}

      <style jsx global>{`
        body { background: #000; margin: 0; font-family: 'Inter', sans-serif; color: #fff; overflow-x: hidden; }
        .header { background: #F5C400; color: #000; text-align: center; padding: 15px; font-weight: 900; font-size: 20px; position: sticky; top: 0; z-index: 100; }
        .content { display: flex; flex-direction: column; align-items: center; padding: 10px; max-width: 500px; margin: 0 auto; width: 100%; }
        
        .formation-selector { display: flex; gap: 4px; margin-bottom: 12px; background: #111; padding: 4px; border-radius: 8px; width: 100%; }
        .formation-selector button { flex: 1; padding: 8px 0; border: none; background: transparent; color: #666; font-weight: 800; font-size: 10px; cursor: pointer; border-radius: 6px; }
        .formation-selector button.active { background: #F5C400; color: #000; }

        .alert { background: #111; color: #555; width: 100%; text-align: center; padding: 12px; font-weight: 800; font-size: 11px; border-radius: 8px; margin-bottom: 12px; border: 1px solid #222; }
        .alert.highlight { background: #F5C400; color: #000; border-color: #F5C400; }

        .field { position: relative; background: #0d2b0d; border: 3px solid #1a4a1a; border-radius: 8px; overflow: hidden; margin-bottom: 20px; box-shadow: inset 0 0 60px rgba(0,0,0,0.5); }
        .pitch-markings { position: absolute; inset: 0; pointer-events: none; opacity: 0.3; }
        .center-line { position: absolute; top: 50%; width: 100%; height: 1.5px; background: #fff; }
        .center-circle { position: absolute; top: 50%; left: 50%; width: 60px; height: 60px; border: 1.5px solid #fff; border-radius: 50%; transform: translate(-50%, -50%); }
        .area { position: absolute; left: 50%; transform: translateX(-50%); width: 50%; height: 16%; border: 1.5px solid #fff; }
        .area.top { top: 0; border-top: none; }
        .area.bottom { bottom: 0; border-bottom: none; }
        .small-area { position: absolute; left: 50%; transform: translateX(-50%); width: 40%; height: 40%; border: 1.5px solid #fff; }
        .area.top .small-area { top: 0; border-top: none; }
        .area.bottom .small-area { bottom: 0; border-bottom: none; }
        .penalty-spot { position: absolute; bottom: 10%; left: 50%; width: 4px; height: 4px; background: #fff; border-radius: 50%; transform: translateX(-50%); }

        .slot { position: absolute; transform: translate(-50%, -50%); cursor: pointer; z-index: 20; }
        .dot { border-radius: 50%; border: 2px dashed rgba(255,255,255,0.15); display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.3); }
        .dot.active { border-color: #F5C400; background: rgba(245,196,0,0.1); box-shadow: 0 0 15px rgba(245,196,0,0.4); }
        .plus { color: rgba(255,255,255,0.2); font-size: 18px; }

        .market-section { width: 100%; background: #080808; border-radius: 12px; margin-top: 5px; padding-bottom: 120px; border: 1px solid #111; }
        .market-sticky-header { padding: 12px; background: #111; border-radius: 12px 12px 0 0; }
        .special-selectors { display: flex; gap: 6px; margin-bottom: 10px; }
        .spec-btn { flex: 1; padding: 10px; border-radius: 6px; font-size: 9px; font-weight: 900; border: 1px solid #333; background: #000; color: #fff; text-transform: uppercase; }
        .spec-btn.active { border-color: #F5C400; color: #F5C400; }
        
        .filters { display: flex; gap: 5px; overflow-x: auto; scrollbar-width: none; }
        .filters button { background: #222; border: none; color: #666; padding: 6px 12px; border-radius: 15px; font-size: 9px; font-weight: 800; }
        .filters button.f-active { background: #F5C400; color: #000; }
        
        .players-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; padding: 12px; }

        .match-day-hud { width: 100%; background: #111; border-radius: 12px; padding: 20px; margin: 20px 0; }
        .hud-scoreboard { display: flex; align-items: center; justify-content: space-around; }
        .hud-team { display: flex; flex-direction: column; align-items: center; font-size: 10px; font-weight: 900; color: #444; }
        .hud-shield { width: 45px; height: 45px; margin-bottom: 8px; }
        .adv-shield-placeholder { width: 45px; height: 45px; border: 2px dashed #222; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; margin-bottom: 8px; }
        .hud-inputs { display: flex; align-items: center; gap: 8px; }
        .hud-inputs input { width: 65px; height: 85px; background: #000; border: 2px solid #222; color: #F5C400; text-align: center; font-size: 44px; font-weight: 900; border-radius: 8px; }
        .hud-divider { font-weight: 900; color: #333; }

        .card-capture { width: 380px; background: #000; border: 8px solid #F5C400; padding: 20px; }
        .capture-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #F5C400; padding-bottom: 10px; margin-bottom: 15px; }
        .header-logo { font-weight: 1000; font-size: 20px; color: #F5C400; }
        .header-match { font-size: 10px; font-weight: 700; }
        .capture-field { position: relative; height: 400px; background: #0d2b0d; border-radius: 8px; border: 1.5px solid #1a4a1a; }
        .slot-mini { position: absolute; transform: translate(-50%, -50%); }
        .capture-footer { border-top: 2px solid #F5C400; margin-top: 15px; padding-top: 10px; }
        .footer-row { display: flex; justify-content: space-between; font-weight: 900; color: #F5C400; font-size: 14px; }
        .footer-author { color: #444; font-size: 9px; }

        .dock { position: fixed; bottom: 0; left: 0; width: 100%; padding: 20px; background: linear-gradient(transparent, #000 35%); display: flex; justify-content: center; z-index: 150; }
        .next-btn { width: 100%; max-width: 400px; padding: 18px; background: #F5C400; color: #000; border-radius: 12px; font-weight: 900; border: none; font-size: 15px; box-shadow: 0 5px 15px rgba(245,196,0,0.3); cursor: pointer; }
        .next-btn:disabled { background: #222; color: #444; box-shadow: none; cursor: not-allowed; }
        
        .share-actions { display: flex; flex-direction: column; gap: 10px; width: 100%; margin-top: 15px; }
        .share-btn { background: #F5C400; color: #000; padding: 18px; border-radius: 12px; font-weight: 900; border: none; font-size: 15px; cursor: pointer; }
        .exit-btn { background: #111; color: #fff; padding: 12px; border-radius: 12px; font-weight: 800; border: 1px solid #333; cursor: pointer; }
        .back-btn { background: transparent; border: none; color: #555; padding: 8px; font-weight: 800; font-size: 12px; text-decoration: underline; cursor: pointer; }
      `}</style>
    </main>
  );
}
