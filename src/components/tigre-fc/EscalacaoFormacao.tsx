'use client';
/**
 * EscalacaoFormacao — Tigre FC PS5/FIFA26 Edition
 * Jornada completa: Formação → Mercado → Campo → Banco → Capitão/Herói → Palpite → Reveal → Share
 * ATUALIZADO PARA 4ª RODADA: América-MG × Novorizontino | 12/04/2026 - 18:00 | Arena da Independência
 */

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { supabase } from '@/lib/supabase';

// ─── Assets ──────────────────────────────────────────────────────────────────
const BASE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';
const ESCUDO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png';
const ESCUDO_ADV = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ESCUDO%20AMERICA%20MINEIRO.png';
const PATA = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/GARRA%20LOGO.png';

// Fotos com fundo transparente para destaque
const FOTO_ROMULO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ROMULO%20FUNDO%20TRANSPARENTE.png';
const FOTO_CARLAO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/CARLAO%20FUNDO%20TRANSPARENTE.png';

// ─── Gatilho de rodada ───────────────────────────────────────────────────────
const RODADA_ENCERRADA = false; // Mantenha false enquanto o mercado estiver aberto

// Dados da 4ª Rodada
const RESULTADO_JOGO = {
  sofascore_id: null,
  adversario: 'América-MG',
  rodada: 'Série B 2026 · Rodada 4',
  placar_novo: 0,
  placar_adv: 0,
  data: '12/04/2026',
  local: 'Arena da Independência, Belo Horizonte',
  titulares_ids: new Set<number>([]),
  heroi_id: null,
  potm_id: null,
  ratings: {} as Record<number, number>,
};

// ─── Types ───────────────────────────────────────────────────────────────────
type Player = { id: number; name: string; short: string; num: number; pos: string; foto: string };
type Lineup = Record<string, Player | null>;
type Step = 'formation' | 'picking' | 'bench' | 'captain_hero' | 'score' | 'reveal' | 'share';
type SpecialMode = 'CAPTAIN' | 'HERO' | null;
type Slot = { id: string; x: number; y: number; pos: string; label: string };

// Interfaces de Props
interface Field3DProps {
  lineup: Lineup;
  slots: Slot[];
  activeSlot: string | null;
  activePlayer: Player | null;
  onSlotClick: (id: string) => void;
  specialMode: SpecialMode;
  captainId: number | null;
  heroId: number | null;
}

interface BenchAreaProps {
  lineup: Lineup;
  activeSlot: string | null;
  activePlayer: Player | null;
  onSlotClick: (id: string) => void;
  fieldFull: boolean;
}

interface PlayerPickerProps {
  lineup: Lineup;
  filterPos: string;
  setFilterPos: (p: string) => void;
  onSelect: (p: Player) => void;
  activeSlot: string | null;
  activePlayer: Player | null;
  step: Step;
  formation: string;
}

interface FifaCardProps {
  player: Player;
  isCaptain?: boolean;
  isHero?: boolean;
  isActive?: boolean;
  pulsing?: boolean;
  small?: boolean;
  onClick?: () => void;
}

// ─── PLAYERS (39 jogadores - mantenha o array completo do seu arquivo original) ─
const PLAYERS: Player[] = [
  { id: 1, name: 'César Augusto', short: 'César', num: 31, pos: 'GOL', foto: BASE + 'CESAR-AUGUSTO.jpg.webp' },
  { id: 2, name: 'Jordi', short: 'Jordi', num: 93, pos: 'GOL', foto: BASE + 'JORDI.jpg.webp' },
  { id: 3, name: 'João Scapin', short: 'Scapin', num: 12, pos: 'GOL', foto: BASE + 'JOAO-SCAPIN.jpg.webp' },
  { id: 4, name: 'Lucas Ribeiro', short: 'Lucas', num: 1, pos: 'GOL', foto: BASE + 'LUCAS-RIBEIRO.jpg.webp' },
  { id: 5, name: 'Lora', short: 'Lora', num: 2, pos: 'LAT', foto: BASE + 'LORA.jpg.webp' },
  { id: 6, name: 'Castrillón', short: 'Castrillón', num: 6, pos: 'LAT', foto: BASE + 'CASTRILLON.jpg.webp' },
  { id: 7, name: 'Arthur Barbosa', short: 'A.Barbosa', num: 22, pos: 'LAT', foto: BASE + 'ARTHUR-BARBOSA.jpg.webp' },
  { id: 8, name: 'Sander', short: 'Sander', num: 33, pos: 'LAT', foto: BASE + 'SANDER.jpg.webp' },
  { id: 9, name: 'Maykon Jesus', short: 'Maykon', num: 27, pos: 'LAT', foto: BASE + 'MAYKON-JESUS.jpg.webp' },
  { id: 10, name: 'Dantas', short: 'Dantas', num: 3, pos: 'ZAG', foto: BASE + 'DANTAAS.jpg.webp' },
  { id: 11, name: 'Eduardo Brock', short: 'E.Brock', num: 5, pos: 'ZAG', foto: BASE + 'EDUARDO-BROCK.jpg.webp' },
  { id: 12, name: 'Patrick', short: 'Patrick', num: 4, pos: 'ZAG', foto: BASE + 'PATRICK.jpg.webp' },
  { id: 13, name: 'Gabriel Bahia', short: 'G.Bahia', num: 14, pos: 'ZAG', foto: BASE + 'GABRIEL-BAHIA.jpg.webp' },
  { id: 14, name: 'Carlinhos', short: 'Carlinhos', num: 25, pos: 'ZAG', foto: BASE + 'CARLINHOS.jpg.webp' },
  { id: 15, name: 'Alemão', short: 'Alemão', num: 28, pos: 'ZAG', foto: BASE + 'ALEMAO.jpg.webp' },
  { id: 16, name: 'Renato Palm', short: 'R.Palm', num: 24, pos: 'ZAG', foto: BASE + 'RENATO-PALM.jpg.webp' },
  { id: 17, name: 'Alvariño', short: 'Alvariño', num: 35, pos: 'ZAG', foto: BASE + 'IVAN-ALVARINO.jpg.webp' },
  { id: 18, name: 'Bruno Santana', short: 'B.Santana', num: 33, pos: 'ZAG', foto: BASE + 'BRUNO-SANTANA.jpg.webp' },
  { id: 19, name: 'Luís Oyama', short: 'Oyama', num: 8, pos: 'MEI', foto: BASE + 'LUIS-OYAMA.jpg.webp' },
  { id: 20, name: 'Léo Naldi', short: 'L.Naldi', num: 7, pos: 'MEI', foto: BASE + 'LEO-NALDI.jpg.webp' },
  { id: 21, name: 'Rômulo', short: 'Rômulo', num: 10, pos: 'MEI', foto: FOTO_ROMULO },
  { id: 22, name: 'Matheus Bianqui', short: 'Bianqui', num: 11, pos: 'MEI', foto: BASE + 'MATHEUS-BIANQUI.jpg.webp' },
  { id: 23, name: 'Juninho', short: 'Juninho', num: 20, pos: 'MEI', foto: BASE + 'JUNINHO.jpg.webp' },
  { id: 24, name: 'Tavinho', short: 'Tavinho', num: 17, pos: 'MEI', foto: BASE + 'TAVINHO.jpg.webp' },
  { id: 25, name: 'Diego Galo', short: 'D.Galo', num: 29, pos: 'MEI', foto: BASE + 'DIEGO-GALO.jpg.webp' },
  { id: 26, name: 'Marlon', short: 'Marlon', num: 30, pos: 'MEI', foto: BASE + 'MARLON.jpg.webp' },
  { id: 27, name: 'Hector Bianchi', short: 'Hector', num: 16, pos: 'MEI', foto: BASE + 'HECTOR-BIACHI.jpg.webp' },
  { id: 28, name: 'Nogueira', short: 'Nogueira', num: 36, pos: 'MEI', foto: BASE + 'NOGUEIRA.jpg.webp' },
  { id: 29, name: 'Luiz Gabriel', short: 'L.Gabriel', num: 37, pos: 'MEI', foto: BASE + 'LUIZ-GABRIEL.jpg.webp' },
  { id: 30, name: 'Jhones Kauê', short: 'J.Kauê', num: 50, pos: 'MEI', foto: BASE + 'JHONES-KAUE.jpg.webp' },
  { id: 31, name: 'Robson', short: 'Robson', num: 9, pos: 'ATA', foto: BASE + 'ROBSON.jpg.webp' },
  { id: 32, name: 'Vinícius Paiva', short: 'V.Paiva', num: 13, pos: 'ATA', foto: BASE + 'VINICIUS-PAIVA.jpg.webp' },
  { id: 33, name: 'Hélio Borges', short: 'H.Borges', num: 18, pos: 'ATA', foto: BASE + 'HELIO-BORGES.jpg.webp' },
  { id: 34, name: 'Jardiel', short: 'Jardiel', num: 19, pos: 'ATA', foto: BASE + 'JARDIEL.jpg.webp' },
  { id: 35, name: 'Nicolas Careca', short: 'N.Careca', num: 21, pos: 'ATA', foto: BASE + 'NICOLAS-CARECA.jpg.webp' },
  { id: 36, name: 'Titi Ortiz', short: 'T.Ortiz', num: 15, pos: 'ATA', foto: BASE + 'TITI-ORTIZ.jpg.webp' },
  { id: 37, name: 'Diego Mathias', short: 'D.Mathias', num: 41, pos: 'ATA', foto: BASE + 'DIEGO-MATHIAS.jpg.webp' },
  { id: 38, name: 'Carlão', short: 'Carlão', num: 90, pos: 'ATA', foto: FOTO_CARLAO },
  { id: 39, name: 'Ronald Barcellos', short: 'Ronald', num: 23, pos: 'ATA', foto: BASE + 'RONALD-BARCELLOS.jpg.webp' },
];

// ─── Formações, Bench Slots, Cores, Estilos (cole do seu arquivo original) ─────
const FORMATIONS: Record<string, Slot[]> = { /* cole aqui do seu arquivo original */ };
const BENCH_SLOTS: Slot[] = [ /* cole aqui do seu arquivo original */ ];
const POS_COLORS: Record<string, string> = { /* cole aqui do seu arquivo original */ };

function imgStyle(pose: 'static' | 'celebration'): React.CSSProperties {
  // cole a função original
  if (pose === 'static') {
    return { position: 'absolute', top: '50%', left: '50%', width: '100%', height: '100%', objectFit: 'cover', objectPosition: '22% center', transform: 'translate(-50%, -50%) scale(1.4)' };
  }
  return { position: 'absolute', top: '50%', left: '50%', width: '100%', height: '100%', objectFit: 'cover', objectPosition: '78% center', transform: 'translate(-50%, -50%) scale(1.5)' };
}

function StadiumBg() { /* cole do original */ }

// ─── Componentes (FifaCard, EmptySlot, Field3D, BenchArea, PlayerPicker, HUD, FormationScreen, CaptainHeroScreen, LEDScoreboard, PackReveal, ShareScreen, calcularPontuacao, ResultadoScreen)
// Cole aqui **exatamente** como estavam no seu arquivo que funcionava antes

// Exemplo mínimo (substitua pelas suas funções completas):
function FifaCard({ player, isCaptain, isHero, isActive, pulsing, small = false, onClick }: FifaCardProps) { /* sua função original */ }
function EmptySlot({ pos, label, active, onClick }: any) { /* sua função original */ }
function Field3D(props: Field3DProps) { /* sua função original */ }
function BenchArea(props: BenchAreaProps) { /* sua função original */ }
function PlayerPicker(props: PlayerPickerProps) { /* sua função original */ }
function HUD({ step, filled, benchFilled, formation }: any) { /* sua função original */ }
function FormationScreen({ onSelect }: any) { /* sua função original */ }
function CaptainHeroScreen({ onSelectMode, captainId, heroId, onDone, lineup }: any) { /* sua função original */ }
function LEDScoreboard({ scoreTigre, setScoreTigre, scoreAdv, setScoreAdv, onConfirm }: any) { /* sua função original */ }
function PackReveal({ lineup, formation, captainId, heroId, onContinue }: any) { /* sua função original */ }
function ShareScreen({ lineup, formation, captainId, heroId, scoreTigre, scoreAdv, onReset }: any) { /* sua função original */ }
function calcularPontuacao(lineup: Lineup, captainId: number | null, heroId: number | null, palpiteTigre: number, palpiteAdv: number) { /* sua função original */ }
function ResultadoScreen({ lineup, formation, captainId, heroId, scoreTigre, scoreAdv, onGoRanking }: any) { /* sua função original */ }

// ─── Componente Principal ─────────────────────────────────────────────────────
export default function EscalacaoFormacao() {
  const router = useRouter();

  const [step, setStep] = useState<Step>('formation');
  const [formation, setFormation] = useState('4-2-3-1');
  const [lineup, setLineup] = useState<Lineup>({});
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const [activePlayer, setActivePlayer] = useState<Player | null>(null);
  const [filterPos, setFilterPos] = useState('TODOS');
  const [captainId, setCaptainId] = useState<number | null>(null);
  const [heroId, setHeroId] = useState<number | null>(null);
  const [specialMode, setSpecialMode] = useState<SpecialMode>(null);
  const [scoreTigre, setScoreTigre] = useState(1);
  const [scoreAdv, setScoreAdv] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const slots = useMemo(() => FORMATIONS[formation] ?? FORMATIONS['4-2-3-1'], [formation]);
  const fieldCount = useMemo(() => slots.filter(s => !!lineup[s.id]).length, [lineup, slots]);
  const benchCount = useMemo(() => BENCH_SLOTS.filter(bs => !!lineup[bs.id]).length, [lineup]);

  const isFieldFull = fieldCount === 11;
  const isGameField = step === 'picking' || step === 'bench';

  // Hidratação
  useEffect(() => {
    let alive = true;
    const loadSaved = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.id) return;

        const googleId = session.user.id;
        setUserId(googleId);

        const { data: esc, error } = await supabase.rpc('get_escalacao_usuario', { p_google_id: googleId });
        if (error || !esc) return;

        const safeLineup: Lineup = {};
        Object.entries(esc.lineup ?? {}).forEach(([k, v]: [string, any]) => {
          safeLineup[k] = v && typeof v === 'object' && 'id' in v ? (v as Player) : null;
        });

        setFormation(esc.formacao ?? '4-2-3-1');
        setLineup(safeLineup);
        setCaptainId(esc.capitao_id ?? null);
        setHeroId(esc.heroi_id ?? null);
        setScoreTigre(esc.placar_palpite_tigre ?? 1);
        setScoreAdv(esc.placar_palpite_adv ?? 0);

        const savedField = Object.values(safeLineup).filter(Boolean).length;
        const savedBench = BENCH_SLOTS.filter(bs => !!safeLineup[bs.id]).length;

        if (savedField === 11 && savedBench === 5 && esc.capitao_id && esc.heroi_id) setStep('share');
        else if (savedField === 11 && savedBench === 5) setStep('captain_hero');
        else if (savedField === 11) setStep('bench');
        else if (savedField > 0) setStep('picking');
      } catch (e) {
        console.warn('[TigreFC] Hydration error:', e);
      } finally {
        if (alive) setHydrated(true);
      }
    };
    loadSaved();
    return () => { alive = false; };
  }, []);

  // AutoSave
  const autoSave = useCallback(async () => {
    if (!userId || !hydrated) return;
    try {
      // seu código de upsert original aqui
      await supabase.rpc('upsert_escalacao', {
        p_google_id: userId,
        p_formacao: formation,
        p_lineup: lineup,
        p_capitao_id: captainId,
        p_heroi_id: heroId,
        p_palpite_tigre: scoreTigre,
        p_palpite_adv: scoreAdv,
      });
    } catch (e) {
      console.warn('[TigreFC] AutoSave error:', e);
    }
  }, [userId, hydrated, lineup, formation, captainId, heroId, scoreTigre, scoreAdv]);

  useEffect(() => {
    if (hydrated && userId) autoSave();
  }, [lineup, captainId, heroId, scoreTigre, scoreAdv, hydrated, userId, autoSave]);

  const handleReset = useCallback(() => {
    setStep('formation');
    setFormation('4-2-3-1');
    setLineup({});
    setActiveSlot(null);
    setActivePlayer(null);
    setFilterPos('TODOS');
    setCaptainId(null);
    setHeroId(null);
    setSpecialMode(null);
    setScoreTigre(1);
    setScoreAdv(0);
  }, []);

  const handleGoHome = useCallback(async () => {
    await autoSave();
    handleReset();
    router.push('/tigre-fc');
  }, [autoSave, handleReset, router]);

  // Adicione aqui as demais funções do seu arquivo original:
  // handleFormation, handleEscalacao, handleCaptainHeroDone, handleScoreConfirm, etc.

  return (
    <div style={{ minHeight: '100vh', background: '#050505', color: '#fff', fontFamily: "'Barlow Condensed', system-ui, sans-serif", overflowX: 'hidden' }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,700;0,900;1,700;1,900&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #1a1a1a; border-radius: 4px; }
      `}</style>

      {RODADA_ENCERRADA && Object.values(lineup).some(Boolean) ? (
        <ResultadoScreen
          lineup={lineup}
          formation={formation}
          captainId={captainId}
          heroId={heroId}
          scoreTigre={scoreTigre}
          scoreAdv={scoreAdv}
          onGoRanking={() => router.push('/tigre-fc')}
        />
      ) : (
        <>
          <HUD step={step} filled={fieldCount} benchFilled={benchCount} formation={formation} />

          <AnimatePresence mode="wait">
            {step === 'formation' && <FormationScreen onSelect={(f: string) => { /* handleFormation */ }} />}
            {step === 'captain_hero' && !specialMode && (
              <CaptainHeroScreen 
                onSelectMode={(m) => setSpecialMode(m)} 
                captainId={captainId} 
                heroId={heroId} 
                onDone={() => { /* handleCaptainHeroDone */ }} 
                lineup={lineup} 
              />
            )}
            {step === 'score' && (
              <LEDScoreboard 
                scoreTigre={scoreTigre} 
                setScoreTigre={setScoreTigre} 
                scoreAdv={scoreAdv} 
                setScoreAdv={setScoreAdv} 
                onConfirm={() => { /* handleScoreConfirm */ }} 
              />
            )}
            {step === 'reveal' && (
              <PackReveal 
                lineup={lineup} 
                formation={formation} 
                captainId={captainId} 
                heroId={heroId} 
                onContinue={() => setStep('share')} 
              />
            )}
            {step === 'share' && (
              <ShareScreen 
                lineup={lineup} 
                formation={formation} 
                captainId={captainId} 
                heroId={heroId} 
                scoreTigre={scoreTigre} 
                scoreAdv={scoreAdv} 
                onReset={handleGoHome} 
              />
            )}
          </AnimatePresence>

          {isGameField && (
            <motion.div 
              key="field" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
            >
              {/* Seu campo, banco e mercado aqui - cole do original */}
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
