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
];

// Mapeia IDs → objeto Player para lookup O(1)
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

// ─── Tipos ────────────────────────────────────────────────────────────────────
type Player = (typeof PLAYERS)[0];
type Lineup = Record<string, Player | null>;
type FormationKey = keyof typeof FORMATIONS;
type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

// ─── Sub-componente PlayerCard ─────────────────────────────────────────────────
function PlayerCard({
  player, size, isSelected, isCaptain, isHero, isField
}: {
  player: Player; size: number; isSelected?: boolean;
  isCaptain?: boolean; isHero?: boolean; isField?: boolean;
}) {
  return (
    <div className={`card-wrapper ${isSelected ? 'selected' : ''}`} style={{ width: size }}>
      <div className="card-box" style={{
        height: size * 1.35,
        border: isCaptain
          ? '2px solid #FFD700'
          : isHero
          ? '2px solid #60a5fa'
          : isSelected
          ? '2px solid #F5C400'
          : '1px solid #333'
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

// ─── Indicador de status de salvamento ───────────────────────────────────────
function SaveIndicator({ status }: { status: SaveStatus }) {
  if (status === 'idle') return null;

  const config = {
    saving: { color: '#F5C400', text: '◌ salvando...', opacity: 0.7 },
    saved:  { color: '#4ade80', text: '✓ salvo',        opacity: 1   },
    error:  { color: '#f87171', text: '✗ erro ao salvar', opacity: 1  },
  }[status];

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 5,
      color: config.color, opacity: config.opacity,
      fontSize: 10, fontWeight: 900, letterSpacing: 1,
      transition: 'all 0.3s ease',
    }}>
      {config.text}
    </div>
  );
}

// ─── Componente Principal ─────────────────────────────────────────────────────
export default function TigreFCEscalar({ jogoId = 3 }: { jogoId?: number }) {
  const router = useRouter();

  // ── Auth & User ──────────────────────────────────────────────────────────────
  const [usuarioId, setUsuarioId] = useState<string | null>(null);
  const [mounted,   setMounted]   = useState(false);

  // ── Escalação ────────────────────────────────────────────────────────────────
  const [formationKey,      setFormationKey]      = useState<FormationKey>('4-2-3-1');
  const [lineup,            setLineup]            = useState<Lineup>({});
  const [reserves,          setReserves]          = useState<(Player | null)[]>([null, null, null, null, null]);
  const [captain,           setCaptain]           = useState<number | null>(null);
  const [hero,              setHero]              = useState<number | null>(null);

  // ── UI ───────────────────────────────────────────────────────────────────────
  const [selectedSlot,         setSelectedSlot]         = useState<string | null>(null);
  const [selectedReserveIndex, setSelectedReserveIndex] = useState<number | null>(null);
  const [specialMode,          setSpecialMode]          = useState<'captain' | 'hero' | null>(null);
  const [filterPos,            setFilterPos]            = useState<string>('TODOS');
  const [fieldWidth,           setFieldWidth]           = useState(360);

  // ── Save/Load ────────────────────────────────────────────────────────────────
  const [saveStatus,      setSaveStatus]      = useState<SaveStatus>('idle');
  const [isLoadingData,   setIsLoadingData]   = useState(true);   // tela de carregamento inicial
  const [confirming,      setConfirming]      = useState(false);  // botão confirmar

  // Refs para controle de debounce e skip do primeiro render
  const saveTimerRef    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitialLoad   = useRef(true);  // bloqueia auto-save enquanto restauramos do DB
  const isSavingRef     = useRef(false); // evita saves concorrentes

  // ── Resize ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    setMounted(true);
    const updateSize = () => setFieldWidth(Math.min(window.innerWidth - 20, 450));
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // ── Inicialização: busca sessão → usuario_id → escalação salva ────────────────
  useEffect(() => {
    if (!mounted) return;

    async function init() {
      setIsLoadingData(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) { setIsLoadingData(false); return; }

        // Regra de ouro: nunca usar auth.uid() diretamente — sempre converter pelo google_id
        const { data: u } = await supabase
          .from('tigre_fc_usuarios')
          .select('id')
          .eq('google_id', session.user.id)
          .single();

        if (!u) { setIsLoadingData(false); return; }
        setUsuarioId(u.id);

        await carregarEscalacao(u.id);
      } finally {
        setIsLoadingData(false);
        // Libera o auto-save apenas após o carregamento completo
        // (usa setTimeout para garantir que os estados acima já foram aplicados)
        setTimeout(() => { isInitialLoad.current = false; }, 0);
      }
    }

    init();
  }, [mounted]);

  // ── LOAD: restaura escalação do banco de forma null-safe ──────────────────────
  const carregarEscalacao = async (uid: string) => {
    const { data: esc, error } = await supabase
      .from('tigre_fc_escalacoes')
      .select('formacao, lineup, capitao_id, heroi_id, reservas')
      .eq('usuario_id', uid)
      .eq('jogo_id', jogoId)
      .maybeSingle();

    if (error || !esc) return; // sem escalação salva → estado vazio (OK)

    // Restaura formação (com fallback seguro)
    const savedFormation = (esc.formacao as FormationKey) || '4-2-3-1';
    if (savedFormation in FORMATIONS) setFormationKey(savedFormation);

    // Restaura lineup: suporta { slot: playerId } OU { slot: { id: playerId } }
    if (esc.lineup && typeof esc.lineup === 'object') {
      const restoredLineup: Lineup = {};
      for (const [slot, val] of Object.entries(esc.lineup)) {
        if (!val) continue;
        const playerId = typeof val === 'object'
          ? Number((val as { id: number }).id)   // objeto completo legado
          : Number(val);                          // apenas o ID (formato atual)

        if (!isNaN(playerId) && playerId > 0) {
          restoredLineup[slot] = PLAYERS_MAP[playerId] ?? null;
        }
      }
      setLineup(restoredLineup);
    }

    // Restaura capitão e herói (null-safe)
    if (esc.capitao_id) setCaptain(Number(esc.capitao_id));
    if (esc.heroi_id)   setHero(Number(esc.heroi_id));

    // Restaura reservas: array de IDs salvo no banco
    if (Array.isArray(esc.reservas)) {
      const restoredReserves: (Player | null)[] = Array(5).fill(null);
      (esc.reservas as (number | null)[]).forEach((id, idx) => {
        if (idx < 5 && id != null) {
          restoredReserves[idx] = PLAYERS_MAP[Number(id)] ?? null;
        }
      });
      setReserves(restoredReserves);
    }
  };

  // ── SAVE: upsert com lógica de debounce ──────────────────────────────────────
  const executarSave = useCallback(async (
    uid: string,
    currentLineup: Lineup,
    currentFormation: FormationKey,
    currentCaptain: number | null,
    currentHero: number | null,
    currentReserves: (Player | null)[]
  ) => {
    if (isSavingRef.current) return;
    isSavingRef.current = true;
    setSaveStatus('saving');

    try {
      // Serializa o lineup como { slot: playerId } para economizar espaço no JSONB
      const lineupParaSalvar: Record<string, number> = {};
      for (const [slot, player] of Object.entries(currentLineup)) {
        if (player) lineupParaSalvar[slot] = player.id;
      }

      // Serializa reservas como array de IDs (nullable)
      const reservasParaSalvar = currentReserves.map(p => p?.id ?? null);

      const { error } = await supabase
        .from('tigre_fc_escalacoes')
        .upsert(
          {
            usuario_id: uid,
            jogo_id:    jogoId,
            formacao:   currentFormation,
            lineup:     lineupParaSalvar,
            capitao_id: currentCaptain,
            heroi_id:   currentHero,
            reservas:   reservasParaSalvar,
            // atualizado_em é atualizado pelo Supabase via trigger,
            // mas adicionamos aqui como fallback para tabelas sem trigger
            atualizado_em: new Date().toISOString(),
          },
          // onConflict na chave composta (usuario_id, jogo_id)
          { onConflict: 'usuario_id,jogo_id' }
        );

      setSaveStatus(error ? 'error' : 'saved');
    } catch {
      setSaveStatus('error');
    } finally {
      isSavingRef.current = false;
      // Limpa o indicador após 2 segundos
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  }, [jogoId]);

  // ── Efeito de auto-save com debounce de 800ms ─────────────────────────────────
  useEffect(() => {
    // Não salva durante o carregamento inicial nem se não tiver usuário
    if (isInitialLoad.current || !usuarioId) return;

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

    saveTimerRef.current = setTimeout(() => {
      executarSave(usuarioId, lineup, formationKey, captain, hero, reserves);
    }, 800);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [lineup, reserves, captain, hero, formationKey, usuarioId, executarSave]);

  // ── Confirmar Escalação: save imediato + navega ───────────────────────────────
  const confirmarEscalacao = async () => {
    if (!isComplete || !usuarioId || confirming) return;
    setConfirming(true);

    // Cancela qualquer debounce pendente e salva na hora
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    await executarSave(usuarioId, lineup, formationKey, captain, hero, reserves);

    // Navega para a página de palpite do jogo
    router.push(`/tigre-fc/palpite/${jogoId}`);
  };

  // ── Interações do Campo ───────────────────────────────────────────────────────
  const currentTitulares  = Object.values(lineup).filter(Boolean) as Player[];
  const currentReservesFilled = reserves.filter(Boolean) as Player[];
  const occupiedIds       = [...currentTitulares.map(p => p.id), ...currentReservesFilled.map(p => p.id)];
  const lineupCompleta    = currentTitulares.length === 11;
  const isComplete        = lineupCompleta && captain !== null && hero !== null;

  const handlePlayerClick = (p: Player) => {
    if (specialMode === 'captain') {
      setCaptain(p.id);
      setSpecialMode(null);
    } else if (specialMode === 'hero') {
      setHero(p.id);
      setSpecialMode(null);
    } else if (selectedSlot !== null) {
      // Se o slot já tem jogador, devolve o antigo ao "mercado"
      setLineup(prev => ({ ...prev, [selectedSlot]: p }));
      setSelectedSlot(null);
    } else if (selectedReserveIndex !== null) {
      const newReserves = [...reserves];
      newReserves[selectedReserveIndex] = p;
      setReserves(newReserves);
      setSelectedReserveIndex(null);
    }
  };

  const handleSlotClick = (slotId: string) => {
    setSelectedSlot(prev => prev === slotId ? null : slotId);
    setSelectedReserveIndex(null);
    setSpecialMode(null);
  };

  const handleReserveClick = (idx: number) => {
    setSelectedReserveIndex(prev => prev === idx ? null : idx);
    setSelectedSlot(null);
    setSpecialMode(null);
  };

  // ── Guardar placeholder enquanto monta / carrega ──────────────────────────────
  if (!mounted) return <div style={{ minHeight: '100vh', background: '#000' }} />;

  return (
    <main className="container">
      {/* ── Header ─────────────────────────────────────────────────────────────── */}
      <header className="header">
        <span>TIGRE FC <span className="elite">ELITE 26</span></span>
        <SaveIndicator status={saveStatus} />
      </header>

      {/* ── Carregamento Inicial ─────────────────────────────────────────────── */}
      {isLoadingData ? (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          minHeight: 'calc(100vh - 56px)', gap: 12, color: '#F5C400'
        }}>
          <div style={{ fontSize: 28, animation: 'spin 1s linear infinite' }}>⚽</div>
          <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: 3, opacity: 0.7 }}>
            CARREGANDO SEU TIME...
          </div>
        </div>
      ) : (
        <div className="content">
          {/* ── Seletor de Formação ──────────────────────────────────────────── */}
          <div className="formation-selector">
            {(Object.keys(FORMATIONS) as FormationKey[]).map(f => (
              <button
                key={f}
                className={formationKey === f ? 'active' : ''}
                onClick={() => {
                  if (formationKey === f) return;
                  // Ao trocar formação: mantém jogadores, limpa slots incompatíveis
                  setFormationKey(f);
                  setLineup({});
                  setCaptain(null);
                  setHero(null);
                }}
              >
                {f}
              </button>
            ))}
          </div>

          {/* ── Campo ────────────────────────────────────────────────────────── */}
          <div className="field" style={{ width: fieldWidth, height: fieldWidth * 1.35 }}>
            <div className="grass-pattern" />
            <div className="pitch-markings">
              <div className="center-line" />
              <div className="center-circle" />
              <div className="area top"><div className="small-area" /><div className="penalty-spot" /></div>
              <div className="area bottom"><div className="small-area" /><div className="penalty-spot" /></div>
            </div>

            {FORMATIONS[formationKey].map(slot => {
              const p = lineup[slot.id];
              const isSel = selectedSlot === slot.id;
              return (
                <div
                  key={slot.id}
                  className="slot"
                  onClick={() => handleSlotClick(slot.id)}
                  style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
                >
                  {p ? (
                    <PlayerCard
                      player={p}
                      size={fieldWidth * 0.16}
                      isSelected={isSel}
                      isCaptain={captain === p.id}
                      isHero={hero === p.id}
                      isField
                    />
                  ) : (
                    <div
                      className={`dot ${isSel ? 'active' : ''}`}
                      style={{ width: fieldWidth * 0.11, height: fieldWidth * 0.11 }}
                    >
                      <span className="plus">+</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ── Banco de Reservas ────────────────────────────────────────────── */}
          <div className="reserves-container" style={{ width: fieldWidth }}>
            <div className="reserves-header">BANCO DE RESERVAS</div>
            <div className="reserves-row">
              {reserves.map((p, idx) => {
                const isSel = selectedReserveIndex === idx;
                return (
                  <div key={idx} className="reserve-slot" onClick={() => handleReserveClick(idx)}>
                    {p ? (
                      <PlayerCard player={p} size={fieldWidth * 0.15} isSelected={isSel} />
                    ) : (
                      <div className={`dot-reserve ${isSel ? 'active' : ''}`}>+</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Mercado de Jogadores ─────────────────────────────────────────── */}
          <div className="market-section">
            {/* Sticky: Capitão, Herói e Filtros */}
            <div className="market-sticky-header">
              <div className="special-selectors">
                <button
                  className={[
                    'spec-btn',
                    specialMode === 'captain' ? 'active' : '',
                    captain                   ? 'done'   : '',
                    !captain && lineupCompleta ? 'glow-active' : ''
                  ].join(' ')}
                  onClick={() => { setSpecialMode('captain'); setSelectedSlot(null); setSelectedReserveIndex(null); }}
                >
                  {captain ? '✅ CAPITÃO' : '👑 CAPITÃO'}
                </button>
                <button
                  className={[
                    'spec-btn',
                    specialMode === 'hero' ? 'active' : '',
                    hero                  ? 'done'   : '',
                    !hero && lineupCompleta ? 'glow-active' : ''
                  ].join(' ')}
                  onClick={() => { setSpecialMode('hero'); setSelectedSlot(null); setSelectedReserveIndex(null); }}
                >
                  {hero ? '✅ HERÓI' : '⭐ HERÓI'}
                </button>
              </div>

              <div className="filters">
                {['TODOS', 'GOL', 'LAT', 'ZAG', 'MEI', 'ATA'].map(f => (
                  <button key={f} className={filterPos === f ? 'f-active' : ''} onClick={() => setFilterPos(f)}>
                    {f}
                  </button>
                ))}
              </div>

              {/* Dica contextual quando modo especial está ativo */}
              {specialMode && (
                <div style={{
                  marginTop: 8, padding: '8px 12px',
                  background: 'rgba(245,196,0,0.08)',
                  border: '1px solid rgba(245,196,0,0.2)',
                  borderRadius: 8,
                  fontSize: 11, fontWeight: 700, color: '#F5C400',
                  textAlign: 'center', letterSpacing: 1
                }}>
                  {specialMode === 'captain'
                    ? '👆 Toque no jogador que vai dobrar os pontos'
                    : '👆 Toque no jogador que vai ser o craque da partida'}
                </div>
              )}
            </div>

            {/* Grid de jogadores */}
            <div className="players-grid">
              {(specialMode ? currentTitulares : PLAYERS.filter(p => !occupiedIds.includes(p.id)))
                .filter(p => filterPos === 'TODOS' || p.pos === filterPos)
                .map(p => (
                  <div key={p.id} className="grid-item" onClick={() => handlePlayerClick(p)}>
                    <PlayerCard
                      player={p}
                      size={(fieldWidth / 3) - 16}
                      isCaptain={captain === p.id}
                      isHero={hero === p.id}
                    />
                  </div>
                ))}
            </div>
          </div>

          {/* ── Dock / Botão Confirmar ────────────────────────────────────────── */}
          <div className="dock">
            {/* Progress de preenchimento */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 10 }}>
              <div style={{ fontSize: 10, fontWeight: 900, color: lineupCompleta ? '#4ade80' : '#555', letterSpacing: 1 }}>
                {lineupCompleta ? '✓' : `${currentTitulares.length}/11`} TITULARES
              </div>
              <div style={{ fontSize: 10, fontWeight: 900, color: captain ? '#4ade80' : '#555', letterSpacing: 1 }}>
                {captain ? '✓' : '○'} CAPITÃO
              </div>
              <div style={{ fontSize: 10, fontWeight: 900, color: hero ? '#4ade80' : '#555', letterSpacing: 1 }}>
                {hero ? '✓' : '○'} HERÓI
              </div>
            </div>

            <button
              className="next-btn"
              disabled={!isComplete || confirming}
              onClick={confirmarEscalacao}
            >
              {confirming ? 'SALVANDO... ⏳' : 'CONFIRMAR ESCALAÇÃO ➜'}
            </button>
          </div>
        </div>
      )}

      {/* ── Estilos ──────────────────────────────────────────────────────────────── */}
      <style jsx global>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes neon-glow {
          0%, 100% { box-shadow: 0 0 5px #F5C400; transform: scale(1); }
          50% { box-shadow: 0 0 15px #F5C400; transform: scale(1.02); }
        }

        body { background: #000; margin: 0; font-family: 'Inter', sans-serif; color: #fff; }

        .header {
          background: #F5C400; color: #000; padding: 15px 20px;
          font-weight: 900; font-size: 18px; font-style: italic;
          text-transform: uppercase; letter-spacing: 1px;
          position: sticky; top: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
        }
        .elite { font-size: 12px; opacity: 0.6; margin-left: 8px; }

        .content {
          display: flex; flex-direction: column; align-items: center;
          padding: 10px; max-width: 500px; margin: 0 auto; width: 100%;
        }

        /* Formação */
        .formation-selector {
          display: flex; gap: 4px; margin-bottom: 12px;
          background: #111; padding: 4px; border-radius: 8px; width: 100%;
        }
        .formation-selector button {
          flex: 1; padding: 8px; border: none; background: transparent;
          color: #555; font-weight: 800; font-size: 10px; border-radius: 6px; cursor: pointer;
        }
        .formation-selector button.active { background: #F5C400; color: #000; }

        /* Campo */
        .field {
          position: relative; background: #1a4a1a;
          border: 3px solid #333; border-radius: 12px;
          overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
        .grass-pattern {
          position: absolute; inset: 0;
          background-color: #2d5a27;
          background-image:
            linear-gradient(90deg, rgba(255,255,255,0.03) 50%, transparent 50%),
            linear-gradient(rgba(255,255,255,0.03) 50%, transparent 50%);
          background-size: 20% 10%;
        }
        .pitch-markings {
          position: absolute; inset: 0; pointer-events: none;
          border: 2px solid rgba(255,255,255,0.2); margin: 5px;
        }
        .center-line { position: absolute; top: 50%; width: 100%; height: 2px; background: rgba(255,255,255,0.2); }
        .center-circle {
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 70px; height: 70px;
          border: 2px solid rgba(255,255,255,0.2); border-radius: 50%;
        }
        .area {
          position: absolute; left: 50%; transform: translateX(-50%);
          width: 50%; height: 18%; border: 2px solid rgba(255,255,255,0.2);
        }
        .area.top    { top: 0; border-top: none; }
        .area.bottom { bottom: 0; border-bottom: none; }
        .small-area {
          position: absolute; left: 50%; transform: translateX(-50%);
          width: 40%; height: 35%; border: 2px solid rgba(255,255,255,0.15);
        }
        .area.top    .small-area { top: 0; border-top: none; }
        .area.bottom .small-area { bottom: 0; border-bottom: none; }
        .penalty-spot {
          position: absolute; left: 50%; transform: translateX(-50%);
          width: 4px; height: 4px; background: rgba(255,255,255,0.4); border-radius: 50%;
        }
        .area.top    .penalty-spot { bottom: 20%; }
        .area.bottom .penalty-spot { top: 20%; }

        .slot {
          position: absolute; transform: translate(-50%, -50%);
          cursor: pointer; z-index: 20; transition: all 0.2s ease;
        }
        .dot {
          border-radius: 50%; border: 2px dashed rgba(255,255,255,0.2);
          display: flex; align-items: center; justify-content: center;
          background: rgba(0,0,0,0.3); backdrop-filter: blur(2px);
          transition: all 0.2s;
        }
        .dot.active { border-color: #F5C400; background: rgba(245,196,0,0.2); scale: 1.1; }
        .plus { color: rgba(255,255,255,0.4); font-size: 20px; font-weight: 300; }

        /* Reservas */
        .reserves-container {
          margin-top: 15px; background: #080808;
          padding: 12px; border-radius: 12px; border: 1px solid #111;
        }
        .reserves-header { font-size: 9px; font-weight: 900; color: #444; letter-spacing: 2px; text-align: center; margin-bottom: 10px; }
        .reserves-row { display: flex; justify-content: center; gap: 6px; }
        .dot-reserve {
          width: 45px; height: 60px; background: #111; border: 1px dashed #222;
          border-radius: 4px; display: flex; align-items: center; justify-content: center;
          color: #333; font-size: 16px; transition: all 0.2s; cursor: pointer;
        }
        .dot-reserve.active { border-color: #F5C400; background: #1a1a1a; color: #F5C400; }

        /* Mercado */
        .market-section { width: 100%; margin-top: 20px; background: #050505; padding-bottom: 140px; }
        .market-sticky-header {
          position: sticky; top: 56px; background: #000;
          z-index: 80; padding: 10px 0; border-bottom: 1px solid #111;
        }
        .special-selectors { display: flex; gap: 8px; margin-bottom: 10px; }
        .spec-btn {
          flex: 1; padding: 12px; border-radius: 8px;
          font-size: 10px; font-weight: 900;
          border: 1px solid #222; background: #111; color: #666;
          transition: 0.3s; cursor: pointer;
        }
        .spec-btn.active { border-color: #F5C400; color: #F5C400; background: rgba(245,196,0,0.05); }
        .spec-btn.done   { border-color: #F5C400; background: #F5C400; color: #000; }
        .glow-active     { animation: neon-glow 1.5s infinite; border-color: #F5C400 !important; color: #fff !important; }

        .filters { display: flex; gap: 5px; overflow-x: auto; padding-bottom: 5px; scrollbar-width: none; }
        .filters::-webkit-scrollbar { display: none; }
        .filters button {
          padding: 6px 14px; border-radius: 20px; border: 1px solid #222;
          background: #111; color: #666; font-size: 9px; font-weight: 800;
          white-space: nowrap; cursor: pointer;
        }
        .filters button.f-active { background: #fff; color: #000; border-color: #fff; }

        .players-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 15px; }
        .grid-item { cursor: pointer; }

        /* Dock */
        .dock {
          position: fixed; bottom: 0; left: 0; width: 100%;
          padding: 14px 20px 20px;
          background: linear-gradient(transparent, #000 40%);
          display: flex; flex-direction: column; align-items: center; z-index: 150;
        }
        .next-btn {
          width: 100%; max-width: 440px; padding: 18px;
          background: #F5C400; color: #000; border-radius: 12px;
          font-weight: 900; border: none; font-size: 15px; letter-spacing: 1px;
          box-shadow: 0 4px 20px rgba(245,196,0,0.25); cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .next-btn:not(:disabled):hover  { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(245,196,0,0.35); }
        .next-btn:not(:disabled):active { transform: scale(0.97); }
        .next-btn:disabled { background: #1a1a1a; color: #444; box-shadow: none; cursor: not-allowed; }

        ::-webkit-scrollbar { width: 0; }
      `}</style>
    </main>
  );
}
