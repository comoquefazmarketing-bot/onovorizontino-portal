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
  { id: 5,  name: 'Lora',              short: 'Lora',          num: 2,  pos: 'LAT', foto: BASE+'LORA.jpg.webp' },
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
  { id: 19, name: 'Luís Oyama',         short: 'Oyama',          num: 8,  pos: 'MEI', foto: BASE+'LUIS-OYAMA.jpg.webp' },
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
  { id: 'rb',  label: 'LAT', x: 88, y: 70 },
  { id: 'cb1', label: 'ZAG', x: 65, y: 75 },
  { id: 'cb2', label: 'ZAG', x: 35, y: 75 },
  { id: 'lb',  label: 'LAT', x: 12, y: 70 },
  { id: 'dm1', label: 'VOL', x: 68, y: 56 },
  { id: 'dm2', label: 'VOL', x: 32, y: 56 },
  { id: 'am1', label: 'ATA', x: 85, y: 35 },
  { id: 'am2', label: 'MEI', x: 50, y: 38 },
  { id: 'am3', label: 'ATA', x: 15, y: 35 },
  { id: 'st',  label: 'ATA', x: 50, y: 14 },
];

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
        .badge { position: absolute; top: 2px; right: 2px; width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 900; z-index: 5; border: 1px solid #000; box-shadow: 0 0 5px rgba(0,0,0,0.5); }
        .cap { background: #F5C400; color: #000; }
        .star { background: #fff; color: #000; }
        .card-info { position: absolute; bottom: 0; width: 100%; background: rgba(0,0,0,0.9); text-align: center; padding: 4px 0; border-top: 1px solid rgba(245,196,0,0.4); }
        .pos { color: #F5C400; font-size: 7px; font-weight: 900; line-height: 1; }
        .name { color: #fff; font-size: 9px; font-weight: 900; text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding: 0 1px; }
      `}</style>
    </div>
  );
}

export default function TigreFCEscalar({ jogoId = 3 }: { jogoId?: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'escalar' | 'especiais' | 'palpite' | 'compartilhar'>('escalar');
  const [lineup, setLineup] = useState<Lineup>({});
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [captain, setCaptain] = useState<number | null>(null);
  const [hero, setHero] = useState<number | null>(null);
  const [palpite, setPalpite] = useState({ home: 0, away: 0 });
  const [filterPos, setFilterPos] = useState<string>('TODOS');
  const [fieldWidth, setFieldWidth] = useState(360);
  const [specialGallery, setSpecialGallery] = useState<'captain' | 'hero' | null>(null);

  useEffect(() => {
    setMounted(true);
    const updateSize = () => setFieldWidth(Math.min(window.innerWidth - 20, 450));
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const usedIds = Object.values(lineup).filter(Boolean).map(p => p!.id);
  const isComplete = usedIds.length === 11;
  const captainObj = PLAYERS.find(p => p.id === captain);
  const heroObj = PLAYERS.find(p => p.id === hero);

  const handleDownload = async () => {
    if (cardRef.current) {
      const canvas = await html2canvas(cardRef.current, { useCORS: true, backgroundColor: '#000', scale: 2 });
      const link = document.createElement('a');
      link.download = `meu-tigre-fc.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
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
        palpite_fora: palpite.away
      }]);

      if (cardRef.current) {
        const canvas = await html2canvas(cardRef.current, { useCORS: true, scale: 2 });
        const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/png'));
        
        if (blob && navigator.share) {
          const file = new File([blob], 'meu-tigre-fc.png', { type: 'image/png' });
          try {
            await navigator.share({
              title: 'Minha Escalação Tigre FC',
              text: 'Confira minha escalação para o próximo jogo!',
              files: [file],
            });
          } catch (e) { handleDownload(); }
        } else {
          handleDownload();
        }
      }
      alert("Salvo com sucesso!");
      window.location.href = '/';
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <main className="container">
      <header className="header">TIGRE FC <span className="elite">ELITE 26</span></header>

      {/* STEP 1: ESCALAÇÃO */}
      {step === 'escalar' && (
        <div className="content">
          <div className={`alert ${selectedSlot ? 'highlight' : ''}`}>
            {selectedSlot ? "⚡ SELECIONE O ATLETA" : "👉 TOQUE NO (+) PARA ESCALAR"}
          </div>

          <div className="field" style={{ width: fieldWidth, height: fieldWidth * 1.4 }}>
            <div className="pitch-markings">
              <div className="center-line"></div>
              <div className="center-circle"></div>
              <div className="area top"></div>
              <div className="area bottom"></div>
            </div>
            {FORMATION_4231.map(slot => {
              const p = lineup[slot.id];
              const isSel = selectedSlot === slot.id;
              return (
                <div key={slot.id} className="slot" onClick={() => setSelectedSlot(isSel ? null : slot.id)} style={{ left: `${slot.x}%`, top: `${slot.y}%`, zIndex: isSel ? 100 : 10 }}>
                  {p ? (
                    <PlayerCard player={p} size={fieldWidth * 0.17} isSelected={isSel} isField />
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
              <div className="market-title">MERCADO DE ATLETAS</div>
              <div className="filters">
                {['TODOS', 'GOL', 'LAT', 'ZAG', 'MEI', 'ATA'].map(f => (
                  <button key={f} className={filterPos === f ? 'f-active' : ''} onClick={() => setFilterPos(f)}>{f}</button>
                ))}
              </div>
            </div>

            <div className="players-grid">
              {PLAYERS.filter(p => !usedIds.includes(p.id))
                      .filter(p => filterPos === 'TODOS' || p.pos === filterPos)
                      .map(p => (
                <div key={p.id} className="grid-item" onClick={() => selectedSlot && setLineup({...lineup, [selectedSlot]: p})} style={{ opacity: selectedSlot ? 1 : 0.4 }}>
                  <PlayerCard player={p} size={(fieldWidth / 3) - 16} />
                </div>
              ))}
            </div>
          </div>
          <div className="dock">
            <button className="next-btn" disabled={!isComplete} onClick={() => setStep('especiais')}>PRÓXIMO PASSO ➜</button>
          </div>
        </div>
      )}

      {/* STEP 2: ESPECIAIS (Capitão e Herói) */}
      {step === 'especiais' && (
        <div className="content">
            <div className="alert highlight">🏆 ESCOLHA OS LÍDERES</div>
            <div className="special-slots">
                <div className="special-card-area">
                  <span className="special-label">CAPITÃO</span>
                  <div className="special-slot cap" onClick={() => setSpecialGallery('captain')}>
                      {captainObj ? <PlayerCard player={captainObj} size={110} isField isCaptain /> : 
                      <div className="slot-placeholder"><span className="plus-special">+</span></div>}
                  </div>
                </div>
                <div className="special-card-area">
                  <span className="special-label">HERÓI</span>
                  <div className="special-slot star" onClick={() => setSpecialGallery('hero')}>
                      {heroObj ? <PlayerCard player={heroObj} size={110} isField isHero /> : 
                      <div className="slot-placeholder"><span className="plus-special">+</span></div>}
                  </div>
                </div>
            </div>

            {specialGallery && (
                <div className="special-gallery-overlay">
                    <div className="market-sticky-header">
                        <div className="market-title">ESCOLHA O {specialGallery === 'captain' ? 'CAPITÃO' : 'HERÓI'}</div>
                        <button className="close-gallery" onClick={() => setSpecialGallery(null)}>FECHAR X</button>
                    </div>
                    <div className="players-grid gallery-grid">
                        {PLAYERS.filter(p => usedIds.includes(p.id)).map(p => (
                            <div key={p.id} onClick={() => { if(specialGallery === 'captain') setCaptain(p.id); else setHero(p.id); setSpecialGallery(null); }}>
                                <PlayerCard player={p} size={(fieldWidth / 3) - 16} isCaptain={captain === p.id} isHero={hero === p.id} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <div className="dock">
              <button className="next-btn" disabled={!captain || !hero} onClick={() => setStep('palpite')}>DEFINIR PLACAR ➜</button>
            </div>
        </div>
      )}

      {/* STEP 3: PLACAR */}
      {step === 'palpite' && (
        <div className="content center-flex">
          <div className="alert highlight">⚽ QUAL SEU PALPITE?</div>
          <div className="match-day-hud">
            <div className="hud-scoreboard">
                <div className="hud-team"><img src={ASSETS+'shield-tigre.png'} className="hud-shield" /><span className="hud-name">TIGRE</span></div>
                <div className="hud-inputs">
                    <input type="number" value={palpite.home} onChange={e => setPalpite({...palpite, home: parseInt(e.target.value)||0})} />
                    <div className="hud-divider">X</div>
                    <input type="number" value={palpite.away} onChange={e => setPalpite({...palpite, away: parseInt(e.target.value)||0})} />
                </div>
                <div className="hud-team"><div className="adv-shield-placeholder">?</div><span className="hud-name">ADV</span></div>
            </div>
          </div>
          <div className="dock">
            <button className="next-btn" onClick={() => setStep('compartilhar')}>GERAR CARD FINAL ➜</button>
          </div>
        </div>
      )}

      {/* STEP 4: COMPARTILHAR */}
      {step === 'compartilhar' && (
        <div className="content">
          <div id="final-card" ref={cardRef} className="card-capture">
             <div className="capture-header">
                <div className="header-logo">🐯 TIGRE FC</div>
                <div className="header-match">JOGO {jogoId} | ELITE 26</div>
             </div>
             <div className="capture-field">
                {FORMATION_4231.map(slot => (
                   <div key={slot.id} className="slot-mini" style={{ left: `${slot.x}%`, top: `${slot.y}%` }}>
                      <PlayerCard 
                        player={lineup[slot.id]!} 
                        size={52} 
                        isCaptain={captain === lineup[slot.id]?.id} 
                        isHero={hero === lineup[slot.id]?.id} 
                        isField 
                      />
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
            <button className="back-btn" onClick={() => setStep('escalar')}>↺ REFAZER TUDO</button>
          </div>
        </div>
      )}

      <style jsx global>{`
        body { background: #000; margin: 0; font-family: 'Inter', sans-serif; color: #fff; overflow-x: hidden; }
        .container { min-height: 100vh; padding-bottom: 120px; }
        .header { background: #F5C400; color: #000; text-align: center; padding: 15px; font-weight: 900; font-size: 22px; position: sticky; top: 0; z-index: 200; box-shadow: 0 4px 20px rgba(0,0,0,0.5); }
        .elite { font-weight: 400; font-size: 14px; opacity: 0.8; }
        .content { display: flex; flex-direction: column; align-items: center; padding: 10px; width: 100%; max-width: 500px; margin: 0 auto; }
        .alert { background: #111; color: #666; width: 100%; text-align: center; padding: 14px; font-weight: 800; font-size: 12px; border-radius: 8px; margin-bottom: 15px; border: 1px solid #222; letter-spacing: 1px; }
        .alert.highlight { background: #F5C400; color: #000; box-shadow: 0 0 20px rgba(245,196,0,0.2); }
        
        .field { position: relative; background: #0a250a; border: 4px solid #1a4a1a; border-radius: 12px; overflow: hidden; box-shadow: inset 0 0 100px #000; margin-bottom: 25px; }
        .pitch-markings { position: absolute; inset: 0; opacity: 0.2; pointer-events: none; }
        .center-line { position: absolute; top: 50%; width: 100%; height: 2px; background: #fff; }
        .center-circle { position: absolute; top: 50%; left: 50%; width: 80px; height: 80px; border: 2px solid #fff; border-radius: 50%; transform: translate(-50%, -50%); }
        .area { position: absolute; left: 50%; transform: translateX(-50%); width: 160px; height: 70px; border: 2px solid #fff; }
        .area.top { top: -2px; border-radius: 0 0 40px 40px; }
        .area.bottom { bottom: -2px; border-radius: 40px 40px 0 0; }

        .slot { position: absolute; transform: translate(-50%, -50%); cursor: pointer; }
        .dot { border-radius: 50%; border: 2px dashed rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.05); transition: all 0.3s; }
        .dot.active { border-color: #F5C400; background: rgba(245,196,0,0.2); transform: scale(1.1); box-shadow: 0 0 15px #F5C400; }
        .plus { color: rgba(255,255,255,0.3); font-size: 24px; font-weight: 300; }

        .market-section { width: 100%; background: #080808; border-radius: 16px; border: 1px solid #111; overflow: hidden; }
        .market-sticky-header { background: #111; padding: 15px; border-bottom: 1px solid #222; }
        .market-title { font-size: 12px; font-weight: 900; color: #F5C400; margin-bottom: 10px; text-align: center; }
        .filters { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 5px; scrollbar-width: none; }
        .filters::-webkit-scrollbar { display: none; }
        .filters button { background: #1a1a1a; border: none; color: #666; padding: 8px 16px; border-radius: 20px; font-size: 10px; font-weight: 800; white-space: nowrap; transition: 0.2s; }
        .filters button.f-active { background: #F5C400; color: #000; }

        .players-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; padding: 15px; }
        
        .special-slots { display: flex; justify-content: center; gap: 30px; margin: 20px 0; }
        .special-card-area { display: flex; flex-direction: column; align-items: center; gap: 10px; }
        .special-label { font-size: 10px; font-weight: 900; color: #F5C400; }
        .slot-placeholder { width: 110px; height: 148px; border-radius: 8px; border: 2px dashed #333; display: flex; align-items: center; justify-content: center; background: #080808; }
        .plus-special { font-size: 30px; color: #222; }
        
        .special-gallery-overlay { position: fixed; inset: 0; background: #000; z-index: 300; overflow-y: auto; padding-top: 60px; }
        .close-gallery { float: right; background: #F5C400; color: #000; border: none; padding: 5px 12px; border-radius: 4px; font-size: 10px; font-weight: 900; }

        .match-day-hud { width: 100%; background: #080808; border: 1px solid #222; border-radius: 16px; margin: 20px 0; }
        .hud-scoreboard { display: flex; align-items: center; justify-content: space-around; padding: 40px 10px; }
        .hud-team { display: flex; flex-direction: column; align-items: center; gap: 10px; width: 80px; }
        .hud-shield { width: 50px; height: 50px; object-fit: contain; }
        .adv-shield-placeholder { width: 50px; height: 50px; border: 2px dashed #333; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; color: #333; }
        .hud-name { font-size: 10px; font-weight: 900; color: #666; }
        .hud-inputs { display: flex; align-items: center; gap: 10px; }
        .hud-inputs input { width: 70px; height: 90px; background: #000; border: 2px solid #222; border-radius: 12px; color: #F5C400; text-align: center; font-size: 48px; font-weight: 900; }
        .hud-divider { font-size: 24px; font-weight: 900; color: #333; }

        .card-capture { width: 380px; background: #000; border: 8px solid #F5C400; padding: 20px; position: relative; }
        .capture-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #F5C400; padding-bottom: 10px; }
        .header-logo { font-weight: 900; font-size: 18px; color: #F5C400; }
        .header-match { font-size: 10px; font-weight: 700; color: #fff; }
        .capture-field { position: relative; height: 450px; background: #0a250a; margin-bottom: 15px; border-radius: 8px; border: 1px solid #1a4a1a; }
        .slot-mini { position: absolute; transform: translate(-50%, -50%); }
        .capture-footer { border-top: 1px solid #F5C400; padding-top: 10px; }
        .footer-row { display: flex; justify-content: space-between; align-items: center; }
        .footer-placar { font-weight: 900; font-size: 14px; color: #F5C400; }
        .footer-author { font-size: 8px; color: #555; font-weight: 800; }

        .dock { position: fixed; bottom: 0; left: 0; width: 100%; padding: 25px; background: linear-gradient(transparent, #000 30%); display: flex; justify-content: center; z-index: 150; }
        .next-btn { width: 100%; max-width: 400px; padding: 20px; background: #F5C400; color: #000; border-radius: 14px; font-weight: 900; border: none; font-size: 16px; box-shadow: 0 10px 20px rgba(245,196,0,0.3); }
        .next-btn:disabled { background: #222; color: #444; box-shadow: none; }
        
        .share-actions { display: flex; flex-direction: column; gap: 12px; width: 100%; margin-top: 20px; }
        .share-btn { background: #F5C400; color: #000; width: 100%; padding: 20px; border-radius: 14px; font-weight: 900; border: none; cursor: pointer; font-size: 16px; }
        .back-btn { background: transparent; border: 1px solid #333; color: #666; padding: 15px; border-radius: 14px; cursor: pointer; font-weight: 700; }
      `}</style>
    </main>
  );
}
