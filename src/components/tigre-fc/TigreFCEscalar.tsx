'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const BASE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';

const PLAYERS = [
  { id: 1,  name: 'César Augusto',    short: 'César',      num: 31, pos: 'GOL', foto: BASE+'CESAR-AUGUSTO.jpg.webp' },
  { id: 2,  name: 'Jordi',            short: 'Jordi',      num: 93, pos: 'GOL', foto: BASE+'JORDI.jpg.webp' },
  { id: 3,  name: 'João Scapin',      short: 'Scapin',     num: 12, pos: 'GOL', foto: BASE+'JOAO-SCAPIN.jpg.webp' },
  { id: 4,  name: 'Lucas Ribeiro',    short: 'Lucas',      num: 1,  pos: 'GOL', foto: BASE+'LUCAS-RIBEIRO.jpg.webp' },
  { id: 5,  name: 'Lora',             short: 'Lora',       num: 2,  pos: 'LAT', foto: BASE+'LORA.jpg.webp' },
  { id: 6,  name: 'Castrillón',       short: 'Castrillón', num: 6,  pos: 'LAT', foto: BASE+'CASTRILLON.jpg.webp' },
  { id: 7,  name: 'Arthur Barbosa',   short: 'A.Barbosa',  num: 22, pos: 'LAT', foto: BASE+'ARTHUR-BARBOSA.jpg.webp' },
  { id: 8,  name: 'Sander',           short: 'Sander',     num: 33, pos: 'LAT', foto: BASE+'SANDER.jpg.webp' },
  { id: 9,  name: 'Maykon Jesus',     short: 'Maykon',     num: 27, pos: 'LAT', foto: BASE+'MAYKON-JESUS.jpg.webp' },
  { id: 10, name: 'Dantas',           short: 'Dantas',     num: 3,  pos: 'ZAG', foto: BASE+'DANTAAS.jpg.webp' },
  { id: 11, name: 'Eduardo Brock',    short: 'E.Brock',    num: 5,  pos: 'ZAG', foto: BASE+'EDUARDO-BROCK.jpg.webp' },
  { id: 12, name: 'Patrick',          short: 'Patrick',    num: 4,  pos: 'ZAG', foto: BASE+'PATRICK.jpg.webp' },
  { id: 13, name: 'Gabriel Bahia',    short: 'G.Bahia',    num: 14, pos: 'ZAG', foto: BASE+'GABRIEL-BAHIA.jpg.webp' },
  { id: 14, name: 'Carlinhos',        short: 'Carlinhos',  num: 25, pos: 'ZAG', foto: BASE+'CARLINHOS.jpg.webp' },
  { id: 15, name: 'Alemão',           short: 'Alemão',     num: 28, pos: 'ZAG', foto: BASE+'ALEMAO.jpg.webp' },
  { id: 16, name: 'Renato Palm',      short: 'R.Palm',     num: 24, pos: 'ZAG', foto: BASE+'RENATO-PALM.jpg.webp' },
  { id: 17, name: 'Alvariño',         short: 'Alvariño',   num: 35, pos: 'ZAG', foto: BASE+'IVAN-ALVARINO.jpg.webp' },
  { id: 18, name: 'Bruno Santana',    short: 'B.Santana',  num: 33, pos: 'ZAG', foto: BASE+'BRUNO-SANTANA.jpg.webp' },
  { id: 19, name: 'Luís Oyama',       short: 'Oyama',      num: 8,  pos: 'MEI', foto: BASE+'LUIS-OYAMA.jpg.webp' },
  { id: 20, name: 'Léo Naldi',        short: 'L.Naldi',    num: 7,  pos: 'MEI', foto: BASE+'LEO-NALDI.jpg.webp' },
  { id: 21, name: 'Rômulo',           short: 'Rômulo',     num: 10, pos: 'MEI', foto: BASE+'ROMULO.jpg.webp' },
  { id: 22, name: 'Matheus Bianqui',  short: 'Bianqui',    num: 11, pos: 'MEI', foto: BASE+'MATHEUS-BIANQUI.jpg.webp' },
  { id: 23, name: 'Juninho',          short: 'Juninho',    num: 20, pos: 'MEI', foto: BASE+'JUNINHO.jpg.webp' },
  { id: 24, name: 'Tavinho',          short: 'Tavinho',    num: 17, pos: 'MEI', foto: BASE+'TAVINHO.jpg.webp' },
  { id: 25, name: 'Diego Galo',       short: 'D.Galo',     num: 29, pos: 'MEI', foto: BASE+'DIEGO-GALO.jpg.webp' },
  { id: 26, name: 'Marlon',           short: 'Marlon',     num: 30, pos: 'MEI', foto: BASE+'MARLON.jpg.webp' },
  { id: 27, name: 'Hector Bianchi',   short: 'Hector',     num: 16, pos: 'MEI', foto: BASE+'HECTOR-BIACHI.jpg.webp' },
  { id: 28, name: 'Nogueira',         short: 'Nogueira',   num: 36, pos: 'MEI', foto: BASE+'NOGUEIRA.jpg.webp' },
  { id: 29, name: 'Luiz Gabriel',     short: 'L.Gabriel',  num: 37, pos: 'MEI', foto: BASE+'LUIZ-GABRIEL.jpg.webp' },
  { id: 30, name: 'Jhones Kauê',      short: 'J.Kauê',     num: 50, pos: 'MEI', foto: BASE+'JHONES-KAUE.jpg.webp' },
  { id: 31, name: 'Robson',           short: 'Robson',     num: 9,  pos: 'ATA', foto: BASE+'ROBSON.jpg.webp' },
  { id: 32, name: 'Vinícius Paiva',   short: 'V.Paiva',    num: 13, pos: 'ATA', foto: BASE+'VINICIUS-PAIVA.jpg.webp' },
  { id: 33, name: 'Hélio Borges',     short: 'H.Borges',   num: 18, pos: 'ATA', foto: BASE+'HELIO-BORGES.jpg.webp' },
  { id: 34, name: 'Jardiel',          short: 'Jardiel',    num: 19, pos: 'ATA', foto: BASE+'JARDIEL.jpg.webp' },
  { id: 35, name: 'Nicolas Careca',   short: 'N.Careca',   num: 21, pos: 'ATA', foto: BASE+'NICOLAS-CARECA.jpg.webp' },
  { id: 36, name: 'Titi Ortiz',       short: 'T.Ortiz',    num: 15, pos: 'ATA', foto: BASE+'TITI-ORTIZ.jpg.webp' },
  { id: 37, name: 'Diego Mathias',    short: 'D.Mathias',  num: 41, pos: 'ATA', foto: BASE+'DIEGO-MATHIAS.jpg.webp' },
  { id: 38, name: 'Carlão',           short: 'Carlão',     num: 90, pos: 'ATA', foto: BASE+'CARLAO.jpg.webp' },
  { id: 39, name: 'Ronald Barcellos', short: 'Ronald',     num: 23, pos: 'ATA', foto: BASE+'RONALD-BARCELLOS.jpg.webp' },
  { id: 99, name: 'Enderson Moreira', short: 'Enderson',    num: 0,  pos: 'TEC', foto: BASE+'TEC-ENDERSON.jpg.webp' },
];

const PLAYERS_MAP: Record<number, (typeof PLAYERS)[0]> = {};
PLAYERS.forEach(p => { PLAYERS_MAP[p.id] = p; });

const FORMATIONS = {
  '4-2-3-1': [
    { id: 'gk',  x: 50, y: 88 },
    { id: 'rb',  x: 82, y: 68 }, { id: 'cb1', x: 62, y: 75 }, { id: 'cb2', x: 38, y: 75 }, { id: 'lb',  x: 18, y: 68 },
    { id: 'dm1', x: 40, y: 55 }, { id: 'dm2', x: 60, y: 55 },
    { id: 'rw',  x: 80, y: 32 }, { id: 'am',  x: 50, y: 38 }, { id: 'lw',  x: 20, y: 32 },
    { id: 'st',  x: 50, y: 15 }
  ],
  '4-3-3': [
    { id: 'gk', x: 50, y: 88 },
    { id: 'rb', x: 82, y: 68 }, { id: 'cb1', x: 62, y: 75 }, { id: 'cb2', x: 38, y: 75 }, { id: 'lb', x: 18, y: 68 },
    { id: 'm1', x: 50, y: 55 }, { id: 'm2', x: 75, y: 48 }, { id: 'm3', x: 25, y: 48 },
    { id: 'st', x: 50, y: 15 }, { id: 'rw', x: 80, y: 24 }, { id: 'lw', x: 20, y: 24 }
  ],
  '4-4-2': [
    { id: 'gk', x: 50, y: 88 },
    { id: 'rb', x: 82, y: 68 }, { id: 'cb1', x: 62, y: 75 }, { id: 'cb2', x: 38, y: 75 }, { id: 'lb', x: 18, y: 68 },
    { id: 'm1', x: 65, y: 50 }, { id: 'm2', x: 35, y: 50 }, { id: 'm3', x: 85, y: 45 }, { id: 'm4', x: 15, y: 45 },
    { id: 'st1', x: 60, y: 18 }, { id: 'st2', x: 40, y: 18 }
  ],
  '3-5-2': [
    { id: 'gk', x: 50, y: 88 },
    { id: 'cb1', x: 50, y: 75 }, { id: 'cb2', x: 75, y: 72 }, { id: 'cb3', x: 25, y: 72 },
    { id: 'm1', x: 50, y: 55 }, { id: 'm2', x: 72, y: 45 }, { id: 'm3', x: 28, y: 45 }, { id: 'm4', x: 88, y: 40 }, { id: 'm5', x: 12, y: 40 },
    { id: 'st1', x: 60, y: 18 }, { id: 'st2', x: 40, y: 18 }
  ]
};

type Player = (typeof PLAYERS)[0];
type Lineup = Record<string, Player | null>;
type FormationKey = keyof typeof FORMATIONS;
type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

function PlayerCard({ player, size, isSelected, isCaptain, isHero, isField }: any) {
  return (
    <div className={`card-wrapper ${isSelected ? 'selected' : ''}`} style={{ width: size }}>
      <div className="card-box" style={{
        height: size * 1.35,
        border: isCaptain ? '2px solid #FFD700' : isHero ? '2px solid #60a5fa' : isSelected ? '2px solid #F5C400' : '1px solid #333'
      }}>
        <div className="player-img" style={{
          width: '100%', height: '100%',
          backgroundImage: `url(${player.foto})`,
          backgroundSize: 'cover',
          backgroundPosition: `${isField ? 'right' : 'left'} top`
        }} />
        {isCaptain && <div className="badge cap">C</div>}
        {isHero    && <div className="badge star">H</div>}
        <div className="card-info">
          <div className="pos">{player.pos}</div>
          <div className="name">{player.short}</div>
        </div>
      </div>
      <style jsx>{`
        .card-wrapper { position: relative; transition: transform 0.2s; flex-shrink: 0; margin: 0 auto; }
        .selected { transform: scale(1.08); z-index: 50; }
        .card-box { background: #111; border-radius: 4px; overflow: hidden; position: relative; width: 100%; box-shadow: 0 4px 10px rgba(0,0,0,0.5); }
        .badge { position: absolute; top: 2px; right: 2px; width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 900; z-index: 5; border: 1px solid #000; }
        .cap  { background: #FFD700; color: #000; }
        .star { background: #60a5fa; color: #fff; }
        .card-info { position: absolute; bottom: 0; width: 100%; background: rgba(0,0,0,0.9); text-align: center; padding: 2px 0; border-top: 1px solid rgba(245,196,0,0.3); }
        .pos  { color: #F5C400; font-size: 7px; font-weight: 900; line-height: 1; }
        .name { color: #fff; font-size: 9px; font-weight: 900; text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding: 0 1px; }
      `}</style>
    </div>
  );
}

function SaveIndicator({ status }: { status: SaveStatus }) {
  if (status === 'idle') return null;
  const config = {
    saving: { color: '#F5C400', text: '◌ salvando...', opacity: 0.7 },
    saved:  { color: '#4ade80', text: '✓ salvo',        opacity: 1   },
    error:  { color: '#f87171', text: '✗ erro ao salvar', opacity: 1  },
  }[status];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: config.color, opacity: config.opacity, fontSize: 10, fontWeight: 900 }}>{config.text}</div>
  );
}

export default function TigreFCEscalar({ jogoId = 3 }: { jogoId?: number }) {
  const router = useRouter();
  const [usuarioId, setUsuarioId] = useState<string | null>(null);
  const [mounted,   setMounted]   = useState(false);
  const [formationKey, setFormationKey] = useState<FormationKey>('4-2-3-1');
  const [lineup, setLineup] = useState<Lineup>({});
  const [reserves, setReserves] = useState<(Player | null)[]>([null, null, null, null, null]);
  const [captain, setCaptain] = useState<number | null>(null);
  const [hero, setHero] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedReserveIndex, setSelectedReserveIndex] = useState<number | null>(null);
  const [specialMode, setSpecialMode] = useState<'captain' | 'hero' | null>(null);
  const [filterPos, setFilterPos] = useState<string>('TODOS');
  const [fieldWidth, setFieldWidth] = useState(360);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [confirming, setConfirming] = useState(false);
  
  const saveTimerRef = useRef<any>(null);
  const isInitialLoad = useRef(true);
  const isSavingRef = useRef(false);

  useEffect(() => {
    setMounted(true);
    const updateSize = () => setFieldWidth(Math.min(window.innerWidth - 20, 450));
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    async function init() {
      setIsLoadingData(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) { setIsLoadingData(false); return; }
        const { data: u } = await supabase.from('tigre_fc_usuarios').select('id').eq('google_id', session.user.id).single();
        if (!u) { setIsLoadingData(false); return; }
        setUsuarioId(u.id);
        await carregarEscalacao(u.id);
      } finally {
        setIsLoadingData(false);
        setTimeout(() => { isInitialLoad.current = false; }, 0);
      }
    }
    init();
  }, [mounted]);

  const carregarEscalacao = async (uid: string) => {
    const { data: esc } = await supabase.from('tigre_fc_escalacoes').select('*').eq('usuario_id', uid).eq('jogo_id', jogoId).maybeSingle();
    if (!esc) return;
    setFormationKey((esc.formacao as FormationKey) || '4-2-3-1');
    if (esc.lineup) {
      const restored: Lineup = {};
      Object.entries(esc.lineup).forEach(([slot, pid]) => { restored[slot] = PLAYERS_MAP[Number(pid)] || null; });
      setLineup(restored);
    }
    setCaptain(esc.capitao_id ? Number(esc.capitao_id) : null);
    setHero(esc.heroi_id ? Number(esc.heroi_id) : null);
    if (Array.isArray(esc.reservas)) {
      const res = Array(5).fill(null);
      esc.reservas.forEach((id: any, i: number) => { if (i < 5 && id) res[i] = PLAYERS_MAP[Number(id)]; });
      setReserves(res);
    }
  };

  const executarSave = useCallback(async (uid: string, currLineup: Lineup, currForm: FormationKey, currCap: number | null, currHero: number | null, currRes: any[]) => {
    if (isSavingRef.current) return;
    isSavingRef.current = true;
    setSaveStatus('saving');
    try {
      const lineupIds: any = {};
      Object.entries(currLineup).forEach(([s, p]) => { if (p) lineupIds[s] = p.id; });
      const resIds = currRes.map(p => p?.id || null);
      
      const { error } = await supabase.from('tigre_fc_escalacoes').upsert({
        usuario_id: uid, jogo_id: jogoId, formacao: currForm, lineup: lineupIds,
        capitao_id: currCap, heroi_id: currHero, reservas: resIds, atualizado_em: new Date().toISOString()
      }, { onConflict: 'usuario_id,jogo_id' });
      
      setSaveStatus(error ? 'error' : 'saved');
      return !error;
    } catch { setSaveStatus('error'); return false; } finally {
      isSavingRef.current = false;
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  }, [jogoId]);

  useEffect(() => {
    if (isInitialLoad.current || !usuarioId) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => { 
      executarSave(usuarioId, lineup, formationKey, captain, hero, reserves); 
    }, 800);
  }, [lineup, reserves, captain, hero, formationKey, usuarioId, executarSave]);

  const confirmarEscalacao = async () => {
    if (!isComplete || !usuarioId || confirming) return;
    setConfirming(true);
    
    // Salva uma última vez antes de ir
    const ok = await executarSave(usuarioId, lineup, formationKey, captain, hero, reserves);
    
    if (ok) {
      // Verificamos se o palpite existe antes de navegar para evitar 404
      const { data: palpite } = await supabase
        .from('tigre_fc_palpites')
        .select('id')
        .eq('usuario_id', usuarioId)
        .eq('jogo_id', jogoId)
        .maybeSingle();

      if (palpite) {
        // Se o palpite existe, vai para a tela de palpite que permite compartilhar
        router.push(`/tigre-fc/palpite/${jogoId}`);
      } else {
        // Se NÃO tem palpite ainda, manda para a tela de criar palpite
        // Substitua pela sua rota real de criar palpite se for diferente
        router.push(`/tigre-fc/fazer-palpite/${jogoId}`);
      }
    } else {
      setConfirming(false);
    }
  };

  const currentTitulares = Object.values(lineup).filter(Boolean) as Player[];
  const occupiedIds = [...currentTitulares.map(p => p.id), ...reserves.filter(p => p).map(p => p!.id)];
  const isComplete = currentTitulares.length === 11 && captain !== null && hero !== null;

  if (!mounted) return <div style={{ background: '#000', minHeight: '100vh' }} />;

  return (
    <main className="container">
      <header className="header">
        <span>TIGRE FC <span className="elite">ELITE 26</span></span>
        <SaveIndicator status={saveStatus} />
      </header>

      {isLoadingData ? (
        <div className="loader">⚽ CARREGANDO...</div>
      ) : (
        <div className="content">
          <div className="formation-selector">
            {Object.keys(FORMATIONS).map((f: any) => (
              <button key={f} className={formationKey === f ? 'active' : ''} onClick={() => setFormationKey(f)}>{f}</button>
            ))}
          </div>

          <div className="field" style={{ width: fieldWidth, height: fieldWidth * 1.35 }}>
            <div className="grass" />
            
            {/* Slot do Técnico Enderson Moreira */}
            <div className="coach-area" style={{ position: 'absolute', left: '4%', top: '45%' }}>
              <PlayerCard player={PLAYERS.find(p => p.id === 99)} size={fieldWidth * 0.14} />
              <div className="label">TÉCNICO</div>
            </div>

            {FORMATIONS[formationKey].map((slot: any) => {
              const p = lineup[slot.id];
              const isSel = selectedSlot === slot.id;
              return (
                <div key={slot.id} className="slot" onClick={() => { setSelectedSlot(slot.id); setSelectedReserveIndex(null); setSpecialMode(null); }} style={{ left: `${slot.x}%`, top: `${slot.y}%` }}>
                  {p ? <PlayerCard player={p} size={fieldWidth * 0.16} isSelected={isSel} isCaptain={captain === p.id} isHero={hero === p.id} isField /> : <div className={`dot ${isSel ? 'active' : ''}`}>+</div>}
                </div>
              );
            })}
          </div>

          {/* Banco de Reservas */}
          <div className="reserves" style={{ width: fieldWidth }}>
            <div className="res-title">BANCO DE RESERVAS</div>
            <div className="res-row">
              {reserves.map((p, i) => (
                <div key={i} onClick={() => { setSelectedReserveIndex(i); setSelectedSlot(null); setSpecialMode(null); }}>
                  {p ? <PlayerCard player={p} size={fieldWidth * 0.15} isSelected={selectedReserveIndex === i} /> : <div className="dot-res">+</div>}
                </div>
              ))}
            </div>
          </div>

          {/* Mercado / Seleção */}
          <div className="market">
             <div className="sticky-nav">
                <div className="special-btns">
                  <button className={`s-btn ${captain ? 'done' : ''}`} onClick={() => setSpecialMode('captain')}>👑 {captain ? 'CAPITÃO OK' : 'CAPITÃO'}</button>
                  <button className={`s-btn ${hero ? 'done' : ''}`} onClick={() => setSpecialMode('hero')}>⭐ {hero ? 'HERÓI OK' : 'HERÓI'}</button>
                </div>
                <div className="pos-filters">
                  {['TODOS', 'GOL', 'ZAG', 'MEI', 'ATA'].map(f => <button key={f} onClick={() => setFilterPos(f)} className={filterPos === f ? 'active' : ''}>{f}</button>)}
                </div>
             </div>
             <div className="grid">
                {(specialMode ? currentTitulares : PLAYERS.filter(p => !occupiedIds.includes(p.id) && p.id !== 99))
                  .filter(p => filterPos === 'TODOS' || p.pos === filterPos)
                  .map(p => (
                    <div key={p.id} onClick={() => {
                      if (specialMode === 'captain') { setCaptain(p.id); setSpecialMode(null); }
                      else if (specialMode === 'hero') { setHero(p.id); setSpecialMode(null); }
                      else if (selectedSlot) { setLineup({...lineup, [selectedSlot]: p}); setSelectedSlot(null); }
                      else if (selectedReserveIndex !== null) { 
                        const r = [...reserves]; r[selectedReserveIndex] = p; setReserves(r); setSelectedReserveIndex(null); 
                      }
                    }}>
                      <PlayerCard player={p} size={(fieldWidth/3)-15} />
                    </div>
                  ))}
             </div>
          </div>

          <div className="dock">
             <button className="confirm-btn" disabled={!isComplete || confirming} onClick={confirmarEscalacao}>
               {confirming ? 'SALVANDO...' : 'CONFIRMAR E VER PALPITE ➜'}
             </button>
          </div>
        </div>
      )}

      <style jsx global>{`
        body { background: #000; color: #fff; margin: 0; font-family: sans-serif; }
        .header { background: #F5C400; color: #000; padding: 15px; font-weight: 900; display: flex; justify-content: space-between; position: sticky; top: 0; z-index: 100; }
        .content { display: flex; flex-direction: column; align-items: center; padding: 10px; padding-bottom: 120px; }
        .formation-selector { display: flex; gap: 5px; width: 100%; margin-bottom: 10px; }
        .formation-selector button { flex: 1; padding: 8px; background: #111; color: #555; border: none; border-radius: 4px; font-weight: 900; }
        .formation-selector button.active { background: #F5C400; color: #000; }
        .field { background: #1a4a1a; position: relative; border-radius: 8px; border: 2px solid #333; overflow: hidden; }
        .grass { position: absolute; inset: 0; background: linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px); background-size: 20px 20px; }
        .slot { position: absolute; transform: translate(-50%, -50%); z-index: 20; }
        .dot { width: 40px; height: 40px; border-radius: 50%; border: 2px dashed #444; display: flex; align-items: center; justify-content: center; color: #444; }
        .dot.active { border-color: #F5C400; color: #F5C400; }
        .label { font-size: 8px; font-weight: 900; color: #F5C400; text-align: center; margin-top: 2px; }
        .reserves { margin-top: 15px; background: #080808; padding: 10px; border-radius: 8px; }
        .res-title { font-size: 9px; color: #444; text-align: center; margin-bottom: 8px; font-weight: 900; }
        .res-row { display: flex; justify-content: center; gap: 8px; }
        .dot-res { width: 40px; height: 55px; background: #111; border: 1px dashed #333; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #333; }
        .market { width: 100%; margin-top: 20px; }
        .sticky-nav { position: sticky; top: 50px; background: #000; z-index: 50; padding: 10px 0; }
        .special-btns { display: flex; gap: 8px; margin-bottom: 10px; }
        .s-btn { flex: 1; padding: 10px; background: #111; border: 1px solid #222; color: #666; font-weight: 900; border-radius: 6px; }
        .s-btn.done { background: #F5C400; color: #000; }
        .pos-filters { display: flex; gap: 5px; overflow-x: auto; }
        .pos-filters button { padding: 5px 12px; background: #111; border: none; border-radius: 15px; color: #555; font-size: 10px; font-weight: 900; }
        .pos-filters button.active { background: #fff; color: #000; }
        .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 15px; }
        .dock { position: fixed; bottom: 0; left: 0; width: 100%; padding: 20px; background: linear-gradient(transparent, #000 30%); z-index: 100; display: flex; justify-content: center; }
        .confirm-btn { width: 100%; max-width: 400px; padding: 18px; background: #F5C400; border: none; border-radius: 10px; font-weight: 900; font-size: 14px; cursor: pointer; }
        .confirm-btn:disabled { background: #222; color: #444; }
      `}</style>
    </main>
  );
}
