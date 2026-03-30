'use client';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import TigreFCLogin from '@/components/tigre-fc/TigreFCLogin';
import TigreFCPlayerCard from '@/components/tigre-fc/TigreFCPlayerCard';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const LOGO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/tigre-fc-logo.png';
const BASE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';

const PLAYERS = [
  { id: 1,  name: 'César Augusto',    short: 'César',      num: 31, pos: 'GOL', foto: BASE+'CESAR-AUGUSTO.jpg.webp' },
  { id: 2,  name: 'Jordi',            short: 'Jordi',      num: 93, pos: 'GOL', foto: BASE+'JORDI.jpg.webp' },
  { id: 3,  name: 'João Scapin',      short: 'Scapin',     num: 12, pos: 'GOL', foto: BASE+'JOAO-SCAPIN.jpg.webp' },
  { id: 4,  name: 'Lucas Ribeiro',    short: 'Lucas',      num: 1,  pos: 'GOL', foto: BASE+'LUCAS-RIBEIRO.jpg.webp' },
  { id: 5,  name: 'Lora',             short: 'Lora',       num: 2,  pos: 'LAT', foto: BASE+'LORA.jpg.webp' },
  { id: 6,  name: 'Castrillón',       short: 'Castrillón', num: 6,  pos: 'LAT', foto: BASE+'CASTRILLON.jpg.webp' },
  { id: 7,  name: 'Arthur Barbosa',   short: 'A.Barbosa',  num: 22, pos: 'LAT', foto: BASE+'ARTHUR-BARBOSA.jpg.webp' },
  { id: 8,  name: 'Mayk',             short: 'Mayk',       num: 26, pos: 'LAT', foto: BASE+'MAYK.jpg.webp' },
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

const FORMATIONS: Record<string, { id: string; label: string; x: number; y: number }[]> = {
  '4-3-3': [
    { id:'gk',  label:'GOL', x:50, y:88 }, { id:'rb',  label:'LAT', x:82, y:70 },
    { id:'cb1', label:'ZAG', x:62, y:70 }, { id:'cb2', label:'ZAG', x:38, y:70 },
    { id:'lb',  label:'LAT', x:18, y:70 }, { id:'cm1', label:'MEI', x:72, y:50 },
    { id:'cm2', label:'MEI', x:50, y:46 }, { id:'cm3', label:'MEI', x:28, y:50 },
    { id:'rw',  label:'ATA', x:76, y:24 }, { id:'st',  label:'ATA', x:50, y:18 },
    { id:'lw',  label:'ATA', x:24, y:24 },
  ],
  '4-4-2': [
    { id:'gk',  label:'GOL', x:50, y:88 }, { id:'rb',  label:'LAT', x:82, y:70 },
    { id:'cb1', label:'ZAG', x:62, y:70 }, { id:'cb2', label:'ZAG', x:38, y:70 },
    { id:'lb',  label:'LAT', x:18, y:70 }, { id:'rm',  label:'MEI', x:80, y:50 },
    { id:'cm1', label:'MEI', x:60, y:50 }, { id:'cm2', label:'MEI', x:40, y:50 },
    { id:'lm',  label:'MEI', x:20, y:50 }, { id:'st1', label:'ATA', x:64, y:22 },
    { id:'st2', label:'ATA', x:36, y:22 },
  ],
  '3-5-2': [
    { id:'gk',  label:'GOL', x:50, y:88 }, { id:'cb1', label:'ZAG', x:70, y:72 },
    { id:'cb2', label:'ZAG', x:50, y:75 }, { id:'cb3', label:'ZAG', x:30, y:72 },
    { id:'rb',  label:'LAT', x:86, y:52 }, { id:'cm1', label:'MEI', x:68, y:50 },
    { id:'cm2', label:'MEI', x:50, y:46 }, { id:'cm3', label:'MEI', x:32, y:50 },
    { id:'lb',  label:'LAT', x:14, y:52 }, { id:'st1', label:'ATA', x:64, y:22 },
    { id:'st2', label:'ATA', x:36, y:22 },
  ],
  '4-2-3-1': [
    { id:'gk',  label:'GOL', x:50, y:88 }, { id:'rb',  label:'LAT', x:82, y:70 },
    { id:'cb1', label:'ZAG', x:62, y:70 }, { id:'cb2', label:'ZAG', x:38, y:70 },
    { id:'lb',  label:'LAT', x:18, y:70 }, { id:'dm1', label:'MEI', x:64, y:57 },
    { id:'dm2', label:'MEI', x:36, y:57 }, { id:'rm',  label:'MEI', x:76, y:38 },
    { id:'am',  label:'MEI', x:50, y:36 }, { id:'lm',  label:'MEI', x:24, y:38 },
    { id:'st',  label:'ATA', x:50, y:18 },
  ],
};

type Player = typeof PLAYERS[0];
type Lineup = Record<string, Player | null>;
type Step = 'login' | 'apelido' | 'escalar' | 'capitao' | 'heroi' | 'palpite' | 'confirmar' | 'salvo';
type SaveStatus = 'idle' | 'saving' | 'saved';

export default function TigreFCEscalar({ jogoId }: { jogoId: number }) {
  const [step, setStep]           = useState<Step>('login');
  const [usuario, setUsuario]     = useState<any>(null);
  const [apelido, setApelido]     = useState('');
  const [formation, setFormation] = useState('4-3-3');
  const [lineup, setLineup]       = useState<Lineup>({});
  const [selected, setSelected]   = useState<{ player: Player; from: string } | null>(null);
  const [filterPos, setFilterPos] = useState('TODOS');
  const [capitao, setCapitao]     = useState<Player | null>(null);
  const [heroi, setHeroi]         = useState<Player | null>(null);
  const [palpite, setPalpite]     = useState({ mandante: 1, visitante: 0 });
  const [jogo, setJogo]           = useState<any>(null);
  const [saving, setSaving]       = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [fieldWidth, setFieldWidth] = useState(340);
  const autoSaveTimer = useRef<NodeJS.Timeout | null>(null);

  // ── Responsive field width ──────────────────────────────────────────────
  useEffect(() => {
    const update = () => setFieldWidth(Math.min(window.innerWidth - 32, 420));
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // ── Busca dados do jogo ─────────────────────────────────────────────────
  useEffect(() => {
    fetch('/api/proximo-jogo').then(r => r.json()).then(({ jogos }) => {
      const j = jogos?.find((j: any) => j.id === jogoId) || jogos?.[0];
      if (j) setJogo(j);
    });
  }, [jogoId]);

  // ── Verifica sessão + recupera escalação salva ──────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user) return;
      const u = session.user;

      const { data: existing } = await supabase
        .from('tigre_fc_usuarios').select('*')
        .eq('google_id', u.id).single();

      if (existing) {
        setUsuario(existing);
        await recuperarEscalacao(existing.id);
        setStep('escalar');
      } else {
        setUsuario({
          google_id: u.id,
          nome: u.user_metadata?.full_name || u.email?.split('@')[0] || 'Torcedor',
          email: u.email,
          avatar_url: u.user_metadata?.avatar_url || null,
        });
        setStep('apelido');
      }
    });
  }, [jogoId]);

  // ── Recupera escalação existente ────────────────────────────────────────
  const recuperarEscalacao = async (usuarioId: string) => {
    try {
      const res = await fetch(`/api/tigre-fc/minha-escalacao?usuario_id=${usuarioId}&jogo_id=${jogoId}`);
      const { escalacao, palpite: palSalvo } = await res.json();
      if (escalacao) {
        setFormation(escalacao.formacao || '4-3-3');
        const savedLineup: Lineup = {};
        for (const [slotId, p] of Object.entries(escalacao.lineup as Record<string, any>)) {
          if (p?.id) {
            const found = PLAYERS.find(pl => pl.id === p.id);
            savedLineup[slotId] = found || null;
          }
        }
        setLineup(savedLineup);
        if (escalacao.capitao_id) setCapitao(PLAYERS.find(p => p.id === escalacao.capitao_id) || null);
        if (escalacao.heroi_id)   setHeroi(PLAYERS.find(p => p.id === escalacao.heroi_id)   || null);
      }
      if (palSalvo) setPalpite({ mandante: palSalvo.gols_mandante, visitante: palSalvo.gols_visitante });
    } catch (e) { console.error('Erro ao recuperar escalação:', e); }
  };

  // ── Auto-save com debounce 800ms ────────────────────────────────────────
  useEffect(() => {
    if (!usuario?.id || step === 'login' || step === 'apelido' || step === 'salvo') return;
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    setSaveStatus('saving');
    autoSaveTimer.current = setTimeout(async () => {
      try {
        await fetch('/api/tigre-fc/minha-escalacao', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            usuario_id: usuario.id, jogo_id: jogoId,
            formacao: formation, lineup,
            capitao_id: capitao?.id ?? null,
            heroi_id:   heroi?.id   ?? null,
            palpite,
          }),
        });
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } catch (e) { setSaveStatus('idle'); }
    }, 800);
    return () => { if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current); };
  }, [formation, lineup, capitao, heroi, palpite, usuario?.id]);

  // ── Salvar apelido ──────────────────────────────────────────────────────
  const handleSalvarApelido = async () => {
    if (!apelido.trim()) return;
    const { data } = await supabase.from('tigre_fc_usuarios').insert({
      google_id: usuario.google_id, nome: usuario.nome, email: usuario.email,
      avatar_url: usuario.avatar_url, apelido: apelido.trim().toUpperCase(),
    }).select().single();
    if (data) { setUsuario(data); setStep('escalar'); }
  };

  // ── Salvar escalação final ──────────────────────────────────────────────
  const handleSalvar = async () => {
    if (!usuario || !capitao || !heroi) return;
    setSaving(true);
    try {
      await supabase.from('tigre_fc_escalacoes').upsert({
        usuario_id: usuario.id, jogo_id: jogoId, formacao: formation,
        lineup, capitao_id: capitao.id, heroi_id: heroi.id,
      }, { onConflict: 'usuario_id,jogo_id' });
      await supabase.from('tigre_fc_palpites').upsert({
        usuario_id: usuario.id, jogo_id: jogoId,
        gols_mandante: palpite.mandante, gols_visitante: palpite.visitante,
      }, { onConflict: 'usuario_id,jogo_id' });
      setStep('salvo');
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  // ── Helpers de campo ────────────────────────────────────────────────────
  const slots        = FORMATIONS[formation];
  const usedIds      = Object.values(lineup).filter(Boolean).map(p => p!.id);
  const filledCount  = Object.values(lineup).filter(Boolean).length;
  const escalados    = Object.values(lineup).filter(Boolean) as Player[];
  const filteredPlayers = PLAYERS.filter(p =>
    (filterPos === 'TODOS' || p.pos === filterPos) && !usedIds.includes(p.id)
  );
  const fieldHeight = Math.round(fieldWidth * (105 / 68));
  const slotSize    = Math.max(30, Math.round(fieldWidth * 0.11));

  const placePlayer = (slotId: string, player: Player, from: string) => {
    setLineup(prev => {
      const next = { ...prev };
      if (from !== 'bench') next[from] = next[slotId] ?? null;
      next[slotId] = player;
      return next;
    });
    setSelected(null);
  };

  const handleTapSlot = (slotId: string) => {
    if (selected) { placePlayer(slotId, selected.player, selected.from); }
    else { const p = lineup[slotId]; if (p) setSelected({ player: p, from: slotId }); }
  };

  // ════════════════════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════════════════════

  // ── LOGIN — componente unificado Google + Email ──────────────────────
  if (step === 'login') return (
    <TigreFCLogin
      jogoId={jogoId}
      onSuccess={async (u) => {
        setUsuario(u);
        if (u.apelido) {
          await recuperarEscalacao(u.id);
          setStep('escalar');
        } else {
          setStep('apelido');
        }
      }}
    />
  );

  // ── APELIDO ──────────────────────────────────────────────────────────
  if (step === 'apelido') return (
    <main style={{ minHeight:'100vh', background:'#080808', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24 }}>
      <img src={LOGO} style={{ width:64, marginBottom:16 }} />
      <div style={{ fontSize:22, fontWeight:900, color:'#F5C400', marginBottom:32 }}>Qual seu apelido, Tigre?</div>
      <div style={{ width:'100%', maxWidth:360 }}>
        <input
          value={apelido}
          onChange={e => setApelido(e.target.value.slice(0, 20))}
          placeholder="Ex: TIGRAO017"
          maxLength={20}
          onKeyDown={e => e.key === 'Enter' && handleSalvarApelido()}
          style={{ width:'100%', padding:'14px', background:'#111', border:'1px solid #333', borderRadius:12, color:'#fff', fontSize:16, fontWeight:700, textTransform:'uppercase', marginBottom:12, boxSizing:'border-box' as const }}
        />
        <button
          onClick={handleSalvarApelido}
          disabled={!apelido.trim()}
          style={{ width:'100%', padding:'14px', background: apelido.trim()?'#F5C400':'#1a1a1a', color: apelido.trim()?'#1a1a1a':'#444', border:'none', borderRadius:12, fontSize:15, fontWeight:900, cursor: apelido.trim()?'pointer':'not-allowed' }}>
          Bora jogar! 🐯
        </button>
      </div>
    </main>
  );

  // ── SALVO ────────────────────────────────────────────────────────────
  if (step === 'salvo') return (
    <main style={{ minHeight:'100vh', background:'#080808', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24, textAlign:'center' }}>
      <div style={{ fontSize:64, marginBottom:16 }}>🐯</div>
      <div style={{ fontSize:28, fontWeight:900, color:'#F5C400', marginBottom:8 }}>Escalação Cravada!</div>
      <div style={{ fontSize:14, color:'#555', marginBottom:32 }}>
        Boa sorte, {usuario?.apelido || usuario?.nome}! Que o Tigre mite!
      </div>
      <div style={{ background:'#111', borderRadius:16, padding:24, width:'100%', maxWidth:360, marginBottom:16 }}>
        <div style={{ fontSize:12, color:'#F5C400', letterSpacing:3, textTransform:'uppercase', marginBottom:12 }}>Seu palpite</div>
        <div style={{ fontSize:28, fontWeight:900, color:'#fff' }}>
          {jogo?.mandante?.nome}&nbsp;
          <span style={{ color:'#F5C400' }}>{palpite.mandante} × {palpite.visitante}</span>
          &nbsp;{jogo?.visitante?.nome}
        </div>
        <div style={{ fontSize:12, color:'#444', marginTop:8 }}>
          Capitão: {capitao?.name} · Herói: {heroi?.name}
        </div>
      </div>
      <div style={{ display:'flex', gap:8, width:'100%', maxWidth:360 }}>
        <a href="/tigre-fc/ranking" style={{ flex:1, display:'block', background:'#111', border:'1px solid #1a1a1a', color:'#fff', fontWeight:900, fontSize:13, textTransform:'uppercase', padding:'14px', borderRadius:12, textDecoration:'none', textAlign:'center' }}>
          🏆 Ranking
        </a>
        <a href="/tigre-fc" style={{ flex:1, display:'block', background:'#F5C400', color:'#1a1a1a', fontWeight:900, fontSize:13, textTransform:'uppercase', padding:'14px', borderRadius:12, textDecoration:'none', textAlign:'center' }}>
          Home →
        </a>
      </div>
    </main>
  );

  // ── STEPS PRINCIPAIS ─────────────────────────────────────────────────
  const steps: Step[]    = ['escalar', 'capitao', 'heroi', 'palpite', 'confirmar'];
  const stepIdx          = steps.indexOf(step);
  const stepLabels       = ['Escalar', 'Capitão', 'Herói', 'Palpite', 'Confirmar'];
  const canAdvance =
    (step === 'escalar'  && filledCount === 11) ||
    (step === 'capitao'  && !!capitao) ||
    (step === 'heroi'    && !!heroi) ||
    (step === 'palpite');

  return (
    <main style={{ minHeight:'100vh', background:'#080808', color:'#fff', fontFamily:'system-ui,sans-serif', paddingBottom:100 }}>

      {/* ── Header ── */}
      <div style={{ background:'#F5C400', padding:'14px 16px', display:'flex', alignItems:'center', gap:12 }}>
        <a href="/tigre-fc" style={{ color:'#1a1a1a', textDecoration:'none', fontWeight:900, fontSize:20 }}>←</a>
        <img src={LOGO} style={{ width:32, height:32, objectFit:'contain' }} />
        <div style={{ fontSize:16, fontWeight:900, color:'#1a1a1a', letterSpacing:-0.5 }}>TIGRE FC</div>
        <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:8 }}>
          {saveStatus === 'saving' && (
            <span style={{ fontSize:9, color:'#5a4800', fontWeight:700, textTransform:'uppercase', letterSpacing:1 }}>⟳ Salvando</span>
          )}
          {saveStatus === 'saved' && (
            <span style={{ fontSize:9, color:'#1a6600', fontWeight:700, textTransform:'uppercase', letterSpacing:1 }}>✓ Salvo</span>
          )}
          {usuario && (
            <span style={{ fontSize:12, fontWeight:700, color:'#1a1a1a', opacity:0.7 }}>
              {usuario.apelido || usuario.nome}
            </span>
          )}
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div style={{ display:'flex', borderBottom:'1px solid #111' }}>
        {steps.map((s, i) => (
          <div key={s} style={{ flex:1, padding:'10px 4px', textAlign:'center', fontSize:10, fontWeight:900, textTransform:'uppercase', letterSpacing:1, color: i === stepIdx ? '#F5C400' : i < stepIdx ? '#444' : '#333', borderBottom: i === stepIdx ? '2px solid #F5C400' : '2px solid transparent', cursor: i < stepIdx ? 'pointer' : 'default' }}
            onClick={() => { if (i < stepIdx) setStep(steps[i]); }}>
            {i < stepIdx ? '✓' : stepLabels[i]}
          </div>
        ))}
      </div>

      <div style={{ maxWidth:480, margin:'0 auto', padding:'0 16px' }}>

        {/* ════ ESCALAR ════ */}
        {step === 'escalar' && (
          <>
            {/* Seletor de formação */}
            <div style={{ display:'flex', gap:6, margin:'16px 0 12px', overflowX:'auto' }}>
              {Object.keys(FORMATIONS).map(f => (
                <button key={f}
                  onClick={() => { setFormation(f); setLineup({}); setSelected(null); setCapitao(null); setHeroi(null); }}
                  style={{ flexShrink:0, padding:'6px 12px', fontSize:11, fontWeight:900, textTransform:'uppercase', border:'none', borderRadius:6, cursor:'pointer', background: formation === f ? '#F5C400' : '#1a1a1a', color: formation === f ? '#1a1a1a' : '#555' }}>
                  {f}
                </button>
              ))}
              <button
                onClick={() => { setLineup({}); setSelected(null); setCapitao(null); setHeroi(null); }}
                style={{ flexShrink:0, padding:'6px 12px', fontSize:11, fontWeight:900, textTransform:'uppercase', border:'1px solid #222', borderRadius:6, cursor:'pointer', background:'transparent', color:'#444', marginLeft:'auto' }}>
                Limpar
              </button>
            </div>

            {/* Barra de progresso */}
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
              <div style={{ flex:1, height:4, background:'#1a1a1a', borderRadius:2, overflow:'hidden' }}>
                <div style={{ width:`${(filledCount/11)*100}%`, height:'100%', background: filledCount === 11 ? '#4ade80' : '#F5C400', transition:'width 0.3s' }} />
              </div>
              <span style={{ fontSize:11, fontWeight:900, color: filledCount === 11 ? '#4ade80' : '#555' }}>
                {filledCount}/11
              </span>
            </div>

            {/* Campo */}
            <div style={{ position:'relative', width:fieldWidth, height:fieldHeight, margin:'0 auto', borderRadius:8, overflow:'hidden', background:'#2a7a2a' }}>
              <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%' }} viewBox="0 0 68 105" preserveAspectRatio="none">
                {[0,1,2,3,4,5,6].map(i => (
                  <rect key={i} x="0" y={i*15} width="68" height="7.5" fill={i%2===0 ? 'rgba(255,255,255,0.04)' : 'transparent'} />
                ))}
                <rect x="2"     y="3"     width="64"    height="99"    fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.6" />
                <line x1="2"    y1="52.5" x2="66"       y2="52.5"                  stroke="rgba(255,255,255,0.25)" strokeWidth="0.5" />
                <circle cx="34" cy="52.5" r="9.15"                     fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.5" />
                <rect x="13.84" y="3"     width="40.32" height="18.32" fill="none" stroke="rgba(255,255,255,0.2)"  strokeWidth="0.5" />
                <rect x="13.84" y="83.68" width="40.32" height="18.32" fill="none" stroke="rgba(255,255,255,0.2)"  strokeWidth="0.5" />
              </svg>

              {slots.map(slot => {
                const player = lineup[slot.id];
                const isSel  = selected?.from === slot.id;
                return (
                  <div key={slot.id}
                    onClick={() => handleTapSlot(slot.id)}
                    style={{ position:'absolute', left:`${slot.x}%`, top:`${slot.y}%`, transform:'translate(-50%,-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:2, cursor:'pointer', zIndex:10 }}>
                    {player ? (
                      // ── Slot preenchido com TigreFCPlayerCard ──
                      <TigreFCPlayerCard
                        player={player}
                        size={slotSize}
                        isCapitao={capitao?.id === player.id}
                        isHeroi={heroi?.id === player.id}
                        selected={isSel}
                      />
                    ) : (
                      // ── Slot vazio ──
                      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:2 }}>
                        <div style={{ width:slotSize, height:slotSize, borderRadius:'50%', border: selected ? '2px dashed #F5C400' : '2px dashed rgba(255,255,255,0.3)', background:'rgba(0,0,0,0.35)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:slotSize*0.35, color: selected ? '#F5C400' : 'rgba(255,255,255,0.3)', fontWeight:900 }}>
                          +
                        </div>
                        <span style={{ fontSize:Math.max(8, slotSize*0.19), fontWeight:900, color:'rgba(255,255,255,0.5)', textShadow:'0 1px 3px rgba(0,0,0,1)', textTransform:'uppercase' }}>
                          {slot.label}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Banco de jogadores */}
            <div style={{ marginTop:16 }}>
              <div style={{ display:'flex', gap:6, marginBottom:10, overflowX:'auto' }}>
                {['TODOS','GOL','LAT','ZAG','MEI','ATA'].map(p => (
                  <button key={p} onClick={() => setFilterPos(p)}
                    style={{ flexShrink:0, padding:'5px 10px', fontSize:10, fontWeight:900, textTransform:'uppercase', border:'none', borderRadius:6, cursor:'pointer', background: filterPos === p ? '#F5C400' : '#1a1a1a', color: filterPos === p ? '#1a1a1a' : '#555' }}>
                    {p}
                  </button>
                ))}
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:6 }}>
                {filteredPlayers.map(player => {
                  const isSel = selected?.player.id === player.id;
                  return (
                    <div key={player.id}
                      onClick={() => setSelected(isSel ? null : { player, from:'bench' })}
                      style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, padding:'8px 4px', border: isSel ? '1.5px solid #F5C400' : '0.5px solid #1a1a1a', background: isSel ? 'rgba(245,196,0,0.1)' : '#0d0d0d', cursor:'pointer', borderRadius:8 }}>
                      <div style={{ width:44, height:44, borderRadius:'50%', overflow:'hidden', border: isSel ? '2px solid #F5C400' : '1px solid #222', position:'relative' }}>
                        <div style={{ width:'100%', height:'100%', backgroundImage:`url(${player.foto})`, backgroundSize:'200% 100%', backgroundPosition:'left top' }} />
                        <div style={{ position:'absolute', bottom:-1, right:-1, width:15, height:15, background:'#F5C400', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:6, fontWeight:900, color:'#1a1a1a' }}>
                          {player.num}
                        </div>
                      </div>
                      <span style={{ fontSize:9, fontWeight:900, color: isSel ? '#F5C400' : '#fff', textTransform:'uppercase', textAlign:'center', maxWidth:'100%', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                        {player.short}
                      </span>
                      <span style={{ fontSize:8, color:'#444', fontWeight:700 }}>{player.pos}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* ════ CAPITÃO ════ */}
        {step === 'capitao' && (
          <div style={{ marginTop:16 }}>
            <div style={{ fontSize:18, fontWeight:900, color:'#F5C400', marginBottom:4 }}>Escolha o Capitão</div>
            <div style={{ fontSize:13, color:'#555', marginBottom:20 }}>O capitão tem seus pontos dobrados. Escolha com sabedoria!</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
              {escalados.map(player => (
                <div key={player.id} onClick={() => setCapitao(player)}
                  style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6, padding:'16px 6px', border: capitao?.id === player.id ? '2px solid #FFD700' : '1px solid #1a1a1a', background: capitao?.id === player.id ? 'rgba(255,215,0,0.08)' : '#0d0d0d', cursor:'pointer', borderRadius:10, transition:'all .2s' }}>
                  <TigreFCPlayerCard
                    player={player}
                    size={52}
                    isCapitao={capitao?.id === player.id}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════ HERÓI ════ */}
        {step === 'heroi' && (
          <div style={{ marginTop:16 }}>
            <div style={{ fontSize:18, fontWeight:900, color:'#F5C400', marginBottom:4 }}>Quem vai ser o Herói?</div>
            <div style={{ fontSize:13, color:'#555', marginBottom:20 }}>Escolha o jogador que vai se destacar. Acertou? +10 pontos!</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
              {escalados.map(player => (
                <div key={player.id} onClick={() => setHeroi(player)}
                  style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6, padding:'16px 6px', border: heroi?.id === player.id ? '2px solid #60a5fa' : '1px solid #1a1a1a', background: heroi?.id === player.id ? 'rgba(96,165,250,0.08)' : '#0d0d0d', cursor:'pointer', borderRadius:10, transition:'all .2s' }}>
                  <TigreFCPlayerCard
                    player={player}
                    size={52}
                    isHeroi={heroi?.id === player.id}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════ PALPITE ════ */}
        {step === 'palpite' && (
          <div style={{ marginTop:24, textAlign:'center' }}>
            <div style={{ fontSize:18, fontWeight:900, color:'#F5C400', marginBottom:4 }}>Crave o Placar!</div>
            <div style={{ fontSize:13, color:'#555', marginBottom:28 }}>
              Placar exato vale +15 pts. Resultado certo +5 pts.
            </div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:24 }}>
              {/* Mandante */}
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:10 }}>
                {jogo && <img src={jogo.mandante.escudo_url} style={{ width:52, height:52, objectFit:'contain' }} />}
                <span style={{ fontSize:11, fontWeight:900, color:'#ccc', textTransform:'uppercase' }}>{jogo?.mandante?.nome || 'Mandante'}</span>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <button onClick={() => setPalpite(p => ({ ...p, mandante: Math.max(0, p.mandante-1) }))} style={{ width:36, height:36, borderRadius:'50%', border:'1px solid #333', background:'transparent', color:'#fff', fontSize:18, cursor:'pointer' }}>−</button>
                  <span style={{ fontSize:40, fontWeight:900, color:'#F5C400', width:44, textAlign:'center' }}>{palpite.mandante}</span>
                  <button onClick={() => setPalpite(p => ({ ...p, mandante: Math.min(9, p.mandante+1) }))} style={{ width:36, height:36, borderRadius:'50%', border:'1px solid #333', background:'transparent', color:'#fff', fontSize:18, cursor:'pointer' }}>+</button>
                </div>
              </div>
              <span style={{ fontSize:28, fontWeight:900, color:'#333' }}>×</span>
              {/* Visitante */}
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:10 }}>
                {jogo && <img src={jogo.visitante.escudo_url} style={{ width:52, height:52, objectFit:'contain' }} />}
                <span style={{ fontSize:11, fontWeight:900, color:'#F5C400', textTransform:'uppercase' }}>{jogo?.visitante?.nome || 'Visitante'}</span>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <button onClick={() => setPalpite(p => ({ ...p, visitante: Math.max(0, p.visitante-1) }))} style={{ width:36, height:36, borderRadius:'50%', border:'1px solid #333', background:'transparent', color:'#fff', fontSize:18, cursor:'pointer' }}>−</button>
                  <span style={{ fontSize:40, fontWeight:900, color:'#F5C400', width:44, textAlign:'center' }}>{palpite.visitante}</span>
                  <button onClick={() => setPalpite(p => ({ ...p, visitante: Math.min(9, p.visitante+1) }))} style={{ width:36, height:36, borderRadius:'50%', border:'1px solid #333', background:'transparent', color:'#fff', fontSize:18, cursor:'pointer' }}>+</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════ CONFIRMAR ════ */}
        {step === 'confirmar' && (
          <div style={{ marginTop:20 }}>
            <div style={{ fontSize:18, fontWeight:900, color:'#F5C400', marginBottom:16 }}>Confirme sua escalação</div>

            <div style={{ background:'#111', borderRadius:12, padding:16, marginBottom:10 }}>
              <div style={{ fontSize:10, color:'#555', textTransform:'uppercase', letterSpacing:2, marginBottom:6 }}>Formação</div>
              <div style={{ fontSize:15, fontWeight:700, color:'#fff' }}>{formation}</div>
            </div>

            <div style={{ background:'linear-gradient(135deg,#1a1200,#111)', border:'1px solid #FFD70060', borderRadius:12, padding:16, marginBottom:10 }}>
              <div style={{ fontSize:10, color:'#FFD700', textTransform:'uppercase', letterSpacing:2, marginBottom:6 }}>👑 Capitão — pontos dobrados</div>
              <div style={{ fontSize:15, fontWeight:700, color:'#FFD700' }}>{capitao?.name}</div>
            </div>

            <div style={{ background:'linear-gradient(135deg,#001a2a,#111)', border:'1px solid #60a5fa60', borderRadius:12, padding:16, marginBottom:10 }}>
              <div style={{ fontSize:10, color:'#60a5fa', textTransform:'uppercase', letterSpacing:2, marginBottom:6 }}>⭐ Herói — +10 pts se acertar</div>
              <div style={{ fontSize:15, fontWeight:700, color:'#60a5fa' }}>{heroi?.name}</div>
            </div>

            <div style={{ background:'#111', borderRadius:12, padding:16, marginBottom:24 }}>
              <div style={{ fontSize:10, color:'#555', textTransform:'uppercase', letterSpacing:2, marginBottom:6 }}>🎯 Palpite</div>
              <div style={{ fontSize:22, fontWeight:900, color:'#fff' }}>
                {jogo?.mandante?.nome}&nbsp;
                <span style={{ color:'#F5C400' }}>{palpite.mandante} × {palpite.visitante}</span>
                &nbsp;{jogo?.visitante?.nome}
              </div>
            </div>

            <button onClick={handleSalvar} disabled={saving}
              style={{ width:'100%', padding:'16px', background: saving ? '#1a1a1a' : '#F5C400', color: saving ? '#444' : '#1a1a1a', border:'none', borderRadius:12, fontSize:16, fontWeight:900, cursor: saving ? 'not-allowed' : 'pointer', textTransform:'uppercase', letterSpacing:1 }}>
              {saving ? 'Salvando...' : '🐯 Confirmar Escalação'}
            </button>
          </div>
        )}
      </div>

      {/* ── Botão rodapé fixo ── */}
      {['escalar','capitao','heroi','palpite'].includes(step) && (
        <div style={{ position:'fixed', bottom:0, left:0, right:0, background:'rgba(0,0,0,0.95)', borderTop:'1px solid #111', padding:'10px 16px 20px', backdropFilter:'blur(8px)' }}>
          <button
            onClick={() => {
              if (step === 'escalar' && filledCount === 11) setStep('capitao');
              else if (step === 'capitao' && capitao)       setStep('heroi');
              else if (step === 'heroi'   && heroi)         setStep('palpite');
              else if (step === 'palpite')                  setStep('confirmar');
            }}
            disabled={!canAdvance}
            style={{ width:'100%', padding:'14px', border:'none', borderRadius:12, fontSize:15, fontWeight:900, textTransform:'uppercase', letterSpacing:1, cursor: canAdvance ? 'pointer' : 'not-allowed', background: canAdvance ? '#F5C400' : '#1a1a1a', color: canAdvance ? '#1a1a1a' : '#333' }}>
            {step === 'escalar'
              ? (filledCount < 11 ? `Escale ${11-filledCount} jogador${11-filledCount > 1 ? 'es' : ''} ainda` : 'Próximo — Escolher Capitão →')
              : step === 'capitao'
              ? (capitao ? `Capitão: ${capitao.short} — Próximo →` : 'Escolha o capitão')
              : step === 'heroi'
              ? (heroi ? `Herói: ${heroi.short} — Próximo →` : 'Escolha o herói')
              : 'Próximo — Confirmar →'}
          </button>
        </div>
      )}
    </main>
  );
}
