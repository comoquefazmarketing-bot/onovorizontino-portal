'use client';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import TigreFCPlayerCard from '@/components/tigre-fc/TigreFCPlayerCard';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const LOGO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/tigre-fc-logo.png';
const BASE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';

const PLAYERS = [
  { id: 1,  name: 'César Augusto',   short: 'César',      num: 31, pos: 'GOL', foto: BASE+'CESAR-AUGUSTO.jpg.webp' },
  { id: 2,  name: 'Jordi',           short: 'Jordi',      num: 93, pos: 'GOL', foto: BASE+'JORDI.jpg.webp' },
  { id: 3,  name: 'João Scapin',     short: 'Scapin',     num: 12, pos: 'GOL', foto: BASE+'JOAO-SCAPIN.jpg.webp' },
  { id: 4,  name: 'Lucas Ribeiro',   short: 'Lucas',      num: 1,  pos: 'GOL', foto: BASE+'LUCAS-RIBEIRO.jpg.webp' },
  { id: 5,  name: 'Lora',            short: 'Lora',       num: 2,  pos: 'LAT', foto: BASE+'LORA.jpg.webp' },
  { id: 6,  name: 'Castrillón',      short: 'Castrillón', num: 6,  pos: 'LAT', foto: BASE+'CASTRILLON.jpg.webp' },
  { id: 7,  name: 'Arthur Barbosa',  short: 'A.Barbosa',  num: 22, pos: 'LAT', foto: BASE+'ARTHUR-BARBOSA.jpg.webp' },
  { id: 8,  name: 'Mayk',            short: 'Mayk',       num: 26, pos: 'LAT', foto: BASE+'MAYK.jpg.webp' },
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
  { id: 39, name: 'Ronald Barcellos',short: 'Ronald',     num: 23, pos: 'ATA', foto: BASE+'RONALD-BARCELLOS.jpg.webp' },
];

const FORMATIONS: Record<string, { id: string; label: string; x: number; y: number }[]> = {
  '4-3-3': [
    { id:'gk', label:'GOL', x:50, y:88 }, { id:'rb', label:'LAT', x:82, y:70 },
    { id:'cb1', label:'ZAG', x:62, y:70 }, { id:'cb2', label:'ZAG', x:38, y:70 },
    { id:'lb', label:'LAT', x:18, y:70 }, { id:'cm1', label:'MEI', x:72, y:50 },
    { id:'cm2', label:'MEI', x:50, y:46 }, { id:'cm3', label:'MEI', x:28, y:50 },
    { id:'rw', label:'ATA', x:76, y:24 }, { id:'st', label:'ATA', x:50, y:18 },
    { id:'lw', label:'ATA', x:24, y:24 },
  ],
  '4-4-2': [
    { id:'gk', label:'GOL', x:50, y:88 }, { id:'rb', label:'LAT', x:82, y:70 },
    { id:'cb1', label:'ZAG', x:62, y:70 }, { id:'cb2', label:'ZAG', x:38, y:70 },
    { id:'lb', label:'LAT', x:18, y:70 }, { id:'rm', label:'MEI', x:80, y:50 },
    { id:'cm1', label:'MEI', x:60, y:50 }, { id:'cm2', label:'MEI', x:40, y:50 },
    { id:'lm', label:'MEI', x:20, y:50 }, { id:'st1', label:'ATA', x:64, y:22 },
    { id:'st2', label:'ATA', x:36, y:22 },
  ],
  '3-5-2': [
    { id:'gk', label:'GOL', x:50, y:88 }, { id:'cb1', label:'ZAG', x:70, y:72 },
    { id:'cb2', label:'ZAG', x:50, y:75 }, { id:'cb3', label:'ZAG', x:30, y:72 },
    { id:'rb', label:'LAT', x:86, y:52 }, { id:'cm1', label:'MEI', x:68, y:50 },
    { id:'cm2', label:'MEI', x:50, y:46 }, { id:'cm3', label:'MEI', x:32, y:50 },
    { id:'lb', label:'LAT', x:14, y:52 }, { id:'st1', label:'ATA', x:64, y:22 },
    { id:'st2', label:'ATA', x:36, y:22 },
  ],
  '4-2-3-1': [
    { id:'gk', label:'GOL', x:50, y:88 }, { id:'rb', label:'LAT', x:82, y:70 },
    { id:'cb1', label:'ZAG', x:62, y:70 }, { id:'cb2', label:'ZAG', x:38, y:70 },
    { id:'lb', label:'LAT', x:18, y:70 }, { id:'dm1', label:'MEI', x:64, y:57 },
    { id:'dm2', label:'MEI', x:36, y:57 }, { id:'rm', label:'MEI', x:76, y:38 },
    { id:'am', label:'MEI', x:50, y:36 }, { id:'lm', label:'MEI', x:24, y:38 },
    { id:'st', label:'ATA', x:50, y:18 },
  ],
};

type Player = typeof PLAYERS[0];
type Lineup = Record<string, Player | null>;
type Step = 'login' | 'apelido' | 'escalar' | 'capitao' | 'heroi' | 'palpite' | 'confirmar' | 'salvo';

export default function TigreFCEscalar({ jogoId }: { jogoId: number }) {
  const [step, setStep] = useState<Step>('login');
  const [usuario, setUsuario] = useState<any>(null);
  const [apelido, setApelido] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [formation, setFormation] = useState('4-3-3');
  const [lineup, setLineup] = useState<Lineup>({});
  const [selected, setSelected] = useState<{ player: Player; from: string } | null>(null);
  const [filterPos, setFilterPos] = useState('TODOS');
  const [capitao, setCapitao] = useState<Player | null>(null);
  const [heroi, setHeroi] = useState<Player | null>(null);
  const [palpite, setPalpite] = useState({ mandante: 1, visitante: 0 });
  const [jogo, setJogo] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [fieldWidth, setFieldWidth] = useState(340);

  useEffect(() => {
    const update = () => setFieldWidth(Math.min(window.innerWidth - 32, 420));
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    fetch('/api/proximo-jogo').then(r => r.json()).then(({ jogos }) => {
      const j = jogos?.find((j: any) => j.id === jogoId) || jogos?.[0];
      if (j) setJogo(j);
    });
  }, [jogoId]);

  // Login Google via Supabase Auth
  const handleLogin = async () => {
    setLoginLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/tigre-fc/escalar/${jogoId}` }
    });
    if (error) { console.error(error); setLoginLoading(false); }
  };

  // Verifica sessão ao voltar do redirect
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user) return;
      const u = session.user;
      // Busca ou cria usuário no banco
      const { data: existing } = await supabase
        .from('tigre_fc_usuarios')
        .select('*')
        .eq('google_id', u.id)
        .single();
      if (existing) {
        setUsuario(existing);
        setStep('escalar');
      } else {
        setUsuario({ google_id: u.id, nome: u.user_metadata?.full_name || u.email, email: u.email, avatar_url: u.user_metadata?.avatar_url });
        setStep('apelido');
      }
    });
  }, []);

  const handleSalvarApelido = async () => {
    if (!apelido.trim()) return;
    const { data } = await supabase.from('tigre_fc_usuarios').insert({
      google_id: usuario.google_id, nome: usuario.nome, email: usuario.email,
      avatar_url: usuario.avatar_url, apelido: apelido.trim().toUpperCase()
    }).select().single();
    if (data) { setUsuario(data); setStep('escalar'); }
  };

  const slots = FORMATIONS[formation];
  const usedIds = Object.values(lineup).filter(Boolean).map(p => p!.id);
  const filledCount = Object.values(lineup).filter(Boolean).length;
  const escalados = Object.values(lineup).filter(Boolean) as Player[];
  const filteredPlayers = PLAYERS.filter(p => (filterPos === 'TODOS' || p.pos === filterPos) && !usedIds.includes(p.id));
  const fieldHeight = Math.round(fieldWidth * (105 / 68));
  const slotSize = Math.max(30, Math.round(fieldWidth * 0.11));

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

  const handleSalvar = async () => {
    if (!usuario || !capitao || !heroi) return;
    setSaving(true);
    try {
      await supabase.from('tigre_fc_escalacoes').upsert({
        usuario_id: usuario.id, jogo_id: jogoId, formacao: formation,
        lineup: lineup, capitao_id: capitao.id, heroi_id: heroi.id
      }, { onConflict: 'usuario_id,jogo_id' });
      await supabase.from('tigre_fc_palpites').upsert({
        usuario_id: usuario.id, jogo_id: jogoId,
        gols_mandante: palpite.mandante, gols_visitante: palpite.visitante
      }, { onConflict: 'usuario_id,jogo_id' });
      setStep('salvo');
    } catch(e) { console.error(e); }
    setSaving(false);
  };

  // ── STEP: LOGIN ──
  if (step === 'login') return (
    <main style={{ minHeight:'100vh', background:'#080808', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24 }}>
      <img src={LOGO} style={{ width:80, marginBottom:20 }} />
      <div style={{ fontSize:28, fontWeight:900, color:'#F5C400', marginBottom:4 }}>TIGRE FC</div>
      <div style={{ fontSize:12, color:'#555', letterSpacing:3, textTransform:'uppercase', marginBottom:40 }}>Fantasy League · Novorizontino</div>
      <div style={{ background:'#111', border:'1px solid #ffffff10', borderRadius:16, padding:32, width:'100%', maxWidth:360, textAlign:'center' }}>
        <div style={{ fontSize:16, fontWeight:700, color:'#fff', marginBottom:8 }}>Entre para jogar</div>
        <div style={{ fontSize:13, color:'#555', marginBottom:24 }}>Monte sua escalação, crave o placar e dispute com os torcedores do Tigre!</div>
        <button onClick={handleLogin} disabled={loginLoading}
          style={{ width:'100%', padding:'14px', background:'#fff', color:'#1a1a1a', border:'none', borderRadius:12, fontSize:15, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:10 }}>
          <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          {loginLoading ? 'Entrando...' : 'Entrar com Google'}
        </button>
      </div>
    </main>
  );

  // ── STEP: APELIDO ──
  if ((step as string) === 'apelido') return (
    <main style={{ minHeight:'100vh', background:'#080808', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24 }}>
      <img src={LOGO} style={{ width:64, marginBottom:16 }} />
      <div style={{ fontSize:22, fontWeight:900, color:'#F5C400', marginBottom:32 }}>Qual seu apelido, Tigre?</div>
      <div style={{ width:'100%', maxWidth:360 }}>
        <input value={apelido} onChange={e => setApelido(e.target.value.slice(0,20))} placeholder="Ex: TIGRAO017" maxLength={20}
          style={{ width:'100%', padding:'14px', background:'#111', border:'1px solid #333', borderRadius:12, color:'#fff', fontSize:16, fontWeight:700, textTransform:'uppercase', marginBottom:12, boxSizing:'border-box' }} />
        <button onClick={handleSalvarApelido} disabled={!apelido.trim()}
          style={{ width:'100%', padding:'14px', background:'#F5C400', color:'#1a1a1a', border:'none', borderRadius:12, fontSize:15, fontWeight:900, cursor:'pointer' }}>
          Bora jogar! 🐯
        </button>
      </div>
    </main>
  );

  // ── STEP: SALVO ──
  if (step === 'salvo') return (
    <main style={{ minHeight:'100vh', background:'#080808', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24, textAlign:'center' }}>
      <div style={{ fontSize:64, marginBottom:16 }}>🐯</div>
      <div style={{ fontSize:28, fontWeight:900, color:'#F5C400', marginBottom:8 }}>Escalação Cravada!</div>
      <div style={{ fontSize:14, color:'#555', marginBottom:32 }}>Boa sorte, {usuario?.apelido || usuario?.nome}! Que o Tigre mite hoje.</div>
      <div style={{ background:'#111', borderRadius:16, padding:24, width:'100%', maxWidth:360, marginBottom:16 }}>
        <div style={{ fontSize:12, color:'#F5C400', letterSpacing:3, textTransform:'uppercase', marginBottom:12 }}>Seu palpite</div>
        <div style={{ fontSize:32, fontWeight:900, color:'#fff' }}>
          {jogo?.mandante?.nome} <span style={{ color:'#F5C400' }}>{palpite.mandante} × {palpite.visitante}</span> {jogo?.visitante?.nome}
        </div>
        <div style={{ fontSize:12, color:'#444', marginTop:8 }}>Capitão: {capitao?.name} · Herói: {heroi?.name}</div>
      </div>
      <a href="/tigre-fc" style={{ display:'block', background:'#F5C400', color:'#1a1a1a', fontWeight:900, fontSize:14, textTransform:'uppercase', padding:'14px 32px', borderRadius:12, textDecoration:'none' }}>
        Ver meu ranking
      </a>
    </main>
  );

  // ── STEPS PRINCIPAIS: ESCALAR / CAPITAO / HEROI / PALPITE / CONFIRMAR ──
  const steps: Step[] = ['escalar','capitao','heroi','palpite','confirmar'];
  const stepIdx = steps.indexOf(step);
  const stepLabels = ['Escalar','Capitão','Herói','Palpite','Confirmar'];

  return (
    <main style={{ minHeight:'100vh', background:'#080808', color:'#fff', fontFamily:'system-ui,sans-serif', paddingBottom:100 }}>

      {/* Header */}
      <div style={{ background:'#F5C400', padding:'14px 16px', display:'flex', alignItems:'center', gap:12 }}>
        <a href="/tigre-fc" style={{ color:'#1a1a1a', textDecoration:'none', fontWeight:900, fontSize:20 }}>←</a>
        <img src={LOGO} style={{ width:32, height:32, objectFit:'contain' }} />
        <div style={{ fontSize:16, fontWeight:900, color:'#1a1a1a', letterSpacing:-0.5 }}>TIGRE FC</div>
        {usuario && (
          <div style={{ marginLeft:'auto', fontSize:12, fontWeight:700, color:'#1a1a1a', opacity:0.7 }}>
            {usuario.apelido || usuario.nome}
          </div>
        )}
      </div>

      {/* Progress */}
      <div style={{ display:'flex', borderBottom:'1px solid #111' }}>
        {steps.map((s, i) => (
          <div key={s} style={{ flex:1, padding:'10px 4px', textAlign:'center', fontSize:10, fontWeight:900, textTransform:'uppercase', letterSpacing:1, color: i === stepIdx ? '#F5C400' : i < stepIdx ? '#444' : '#333', borderBottom: i === stepIdx ? '2px solid #F5C400' : '2px solid transparent' }}>
            {i < stepIdx ? '✓' : stepLabels[i]}
          </div>
        ))}
      </div>

      <div style={{ maxWidth:480, margin:'0 auto', padding:'0 16px' }}>

        {/* ── ESCALAR ── */}
        {step === 'escalar' && (
          <>
            <div style={{ display:'flex', gap:6, margin:'16px 0 12px', overflowX:'auto' }}>
              {Object.keys(FORMATIONS).map(f => (
                <button key={f} onClick={() => { setFormation(f); setLineup({}); setSelected(null); }}
                  style={{ flexShrink:0, padding:'6px 12px', fontSize:11, fontWeight:900, textTransform:'uppercase', border:'none', borderRadius:6, cursor:'pointer', background: formation===f ? '#F5C400' : '#1a1a1a', color: formation===f ? '#1a1a1a' : '#555' }}>
                  {f}
                </button>
              ))}
              <button onClick={() => { setLineup({}); setSelected(null); }}
                style={{ flexShrink:0, padding:'6px 12px', fontSize:11, fontWeight:900, textTransform:'uppercase', border:'1px solid #222', borderRadius:6, cursor:'pointer', background:'transparent', color:'#444', marginLeft:'auto' }}>
                Limpar
              </button>
            </div>

            {/* Progresso */}
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
              <div style={{ flex:1, height:4, background:'#1a1a1a', borderRadius:2, overflow:'hidden' }}>
                <div style={{ width:`${(filledCount/11)*100}%`, height:'100%', background: filledCount===11 ? '#4ade80' : '#F5C400', transition:'width 0.3s' }} />
              </div>
              <span style={{ fontSize:11, fontWeight:900, color: filledCount===11 ? '#4ade80' : '#555' }}>{filledCount}/11</span>
            </div>

            {/* Campo */}
            <div style={{ position:'relative', width:fieldWidth, height:fieldHeight, margin:'0 auto', borderRadius:8, overflow:'hidden', background:'#2a7a2a' }}>
              <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%' }} viewBox="0 0 68 105" preserveAspectRatio="none">
                {[0,1,2,3,4,5,6].map(i => <rect key={i} x="0" y={i*15} width="68" height="7.5" fill={i%2===0?'rgba(255,255,255,0.04)':'transparent'} />)}
                <rect x="2" y="3" width="64" height="99" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.6" />
                <line x1="2" y1="52.5" x2="66" y2="52.5" stroke="rgba(255,255,255,0.25)" strokeWidth="0.5" />
                <circle cx="34" cy="52.5" r="9.15" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.5" />
                <rect x="13.84" y="3" width="40.32" height="18.32" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
                <rect x="13.84" y="83.68" width="40.32" height="18.32" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
              </svg>
              {slots.map(slot => {
                const player = lineup[slot.id];
                const isSel = selected?.from === slot.id;
                return (
                  <div key={slot.id} onClick={() => handleTapSlot(slot.id)}
                    style={{ position:'absolute', left:`${slot.x}%`, top:`${slot.y}%`, transform:'translate(-50%,-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:2, cursor:'pointer', zIndex:10 }}>
                    <div style={{ width:slotSize, height:slotSize, borderRadius:'50%', overflow:'hidden', border: isSel ? '2.5px solid #fff' : player ? '2.5px solid #F5C400' : selected ? '2px dashed #F5C400' : '2px dashed rgba(255,255,255,0.3)', background: player ? 'transparent' : 'rgba(0,0,0,0.35)', flexShrink:0, position:'relative' }}>
                      {player ? (
                        <div style={{ width:'100%', height:'100%', backgroundImage:`url(${player.foto})`, backgroundSize:'200% 100%', backgroundPosition:'left top', backgroundRepeat:'no-repeat' }} />
                      ) : (
                        <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:slotSize*0.35, color: selected ? '#F5C400' : 'rgba(255,255,255,0.3)', fontWeight:900 }}>+</div>
                      )}
                      {player && capitao?.id === player.id && (
                        <div style={{ position:'absolute', top:-4, right:-4, width:14, height:14, background:'#F5C400', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:8, fontWeight:900, color:'#1a1a1a' }}>C</div>
                      )}
                    </div>
                    <span style={{ fontSize:Math.max(8, slotSize*0.19), fontWeight:900, color:'#fff', textShadow:'0 1px 3px rgba(0,0,0,1)', textTransform:'uppercase', whiteSpace:'nowrap', maxWidth:slotSize+12, overflow:'hidden', textOverflow:'ellipsis' }}>
                      {player ? player.short : slot.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Banco */}
            <div style={{ marginTop:16 }}>
              <div style={{ display:'flex', gap:6, marginBottom:10, overflowX:'auto' }}>
                {['TODOS','GOL','LAT','ZAG','MEI','ATA'].map(p => (
                  <button key={p} onClick={() => setFilterPos(p)}
                    style={{ flexShrink:0, padding:'5px 10px', fontSize:10, fontWeight:900, textTransform:'uppercase', border:'none', borderRadius:6, cursor:'pointer', background: filterPos===p ? '#F5C400' : '#1a1a1a', color: filterPos===p ? '#1a1a1a' : '#555' }}>
                    {p}
                  </button>
                ))}
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:6 }}>
                {filteredPlayers.map(player => {
                  const isSel = selected?.player.id === player.id;
                  return (
                    <div key={player.id} onClick={() => setSelected(isSel ? null : { player, from:'bench' })}
                      style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, padding:'8px 4px', border: isSel ? '1.5px solid #F5C400' : '0.5px solid #1a1a1a', background: isSel ? 'rgba(245,196,0,0.1)' : '#0d0d0d', cursor:'pointer', borderRadius:8 }}>
                      <div style={{ width:44, height:44, borderRadius:'50%', overflow:'hidden', border: isSel ? '2px solid #F5C400' : '1px solid #222', position:'relative' }}>
                        <div style={{ width:'100%', height:'100%', backgroundImage:`url(${player.foto})`, backgroundSize:'200% 100%', backgroundPosition:'left top' }} />
                        <div style={{ position:'absolute', bottom:-1, right:-1, width:15, height:15, background:'#F5C400', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:6, fontWeight:900, color:'#1a1a1a' }}>{player.num}</div>
                      </div>
                      <span style={{ fontSize:9, fontWeight:900, color: isSel ? '#F5C400' : '#fff', textTransform:'uppercase', textAlign:'center', maxWidth:'100%', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{player.short}</span>
                      <span style={{ fontSize:8, color:'#444', fontWeight:700 }}>{player.pos}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* ── CAPITÃO ── */}
        {step === 'capitao' && (
          <div style={{ marginTop:16 }}>
            <div style={{ fontSize:18, fontWeight:900, color:'#F5C400', marginBottom:4 }}>Escolha o Capitão</div>
            <div style={{ fontSize:13, color:'#555', marginBottom:20 }}>O capitão tem seus pontos dobrados. Escolha com sabedoria!</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
              {escalados.map(player => (
                <div key={player.id} onClick={() => setCapitao(player)}
                  style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6, padding:'12px 6px', border: capitao?.id===player.id ? '2px solid #F5C400' : '1px solid #1a1a1a', background: capitao?.id===player.id ? 'rgba(245,196,0,0.12)' : '#0d0d0d', cursor:'pointer', borderRadius:10 }}>
                  <div style={{ position:'relative' }}>
                    <div style={{ width:52, height:52, borderRadius:'50%', overflow:'hidden', border: capitao?.id===player.id ? '2px solid #F5C400' : '1px solid #333' }}>
                      <div style={{ width:'100%', height:'100%', backgroundImage:`url(${player.foto})`, backgroundSize:'200% 100%', backgroundPosition:'left top' }} />
                    </div>
                    {capitao?.id===player.id && <div style={{ position:'absolute', top:-4, right:-4, width:18, height:18, background:'#F5C400', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:900, color:'#1a1a1a' }}>C</div>}
                  </div>
                  <span style={{ fontSize:10, fontWeight:900, color: capitao?.id===player.id ? '#F5C400' : '#fff', textTransform:'uppercase', textAlign:'center' }}>{player.short}</span>
                  <span style={{ fontSize:9, color:'#444' }}>{player.pos}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── HERÓI ── */}
        {step === 'heroi' && (
          <div style={{ marginTop:16 }}>
            <div style={{ fontSize:18, fontWeight:900, color:'#F5C400', marginBottom:4 }}>Quem vai ser o Herói?</div>
            <div style={{ fontSize:13, color:'#555', marginBottom:20 }}>Escolha o jogador que vai se destacar. Acertou? +10 pontos!</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
              {escalados.map(player => (
                <div key={player.id} onClick={() => setHeroi(player)}
                  style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6, padding:'12px 6px', border: heroi?.id===player.id ? '2px solid #F5C400' : '1px solid #1a1a1a', background: heroi?.id===player.id ? 'rgba(245,196,0,0.12)' : '#0d0d0d', cursor:'pointer', borderRadius:10 }}>
                  <div style={{ width:52, height:52, borderRadius:'50%', overflow:'hidden', border: heroi?.id===player.id ? '2px solid #F5C400' : '1px solid #333' }}>
                    <div style={{ width:'100%', height:'100%', backgroundImage:`url(${player.foto})`, backgroundSize:'200% 100%', backgroundPosition:'left top' }} />
                  </div>
                  <span style={{ fontSize:10, fontWeight:900, color: heroi?.id===player.id ? '#F5C400' : '#fff', textTransform:'uppercase', textAlign:'center' }}>{player.short}</span>
                  <span style={{ fontSize:9, color:'#444' }}>{player.pos}</span>
                  {heroi?.id===player.id && <span style={{ fontSize:9, fontWeight:900, color:'#F5C400' }}>⭐ Herói</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PALPITE ── */}
        {step === 'palpite' && (
          <div style={{ marginTop:24, textAlign:'center' }}>
            <div style={{ fontSize:18, fontWeight:900, color:'#F5C400', marginBottom:4 }}>Crave o Placar!</div>
            <div style={{ fontSize:13, color:'#555', marginBottom:28 }}>Placar exato vale +15 pts. Resultado certo +5 pts.</div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:24 }}>
              {/* Mandante */}
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:10 }}>
                {jogo && <img src={jogo.mandante.escudo_url} style={{ width:52, height:52, objectFit:'contain' }} />}
                <span style={{ fontSize:11, fontWeight:900, color:'#ccc', textTransform:'uppercase' }}>{jogo?.mandante?.nome || 'Mandante'}</span>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <button onClick={() => setPalpite(p => ({ ...p, mandante: Math.max(0,p.mandante-1) }))} style={{ width:36, height:36, borderRadius:'50%', border:'1px solid #333', background:'transparent', color:'#fff', fontSize:18, cursor:'pointer' }}>−</button>
                  <span style={{ fontSize:40, fontWeight:900, color:'#F5C400', width:44, textAlign:'center' }}>{palpite.mandante}</span>
                  <button onClick={() => setPalpite(p => ({ ...p, mandante: Math.min(9,p.mandante+1) }))} style={{ width:36, height:36, borderRadius:'50%', border:'1px solid #333', background:'transparent', color:'#fff', fontSize:18, cursor:'pointer' }}>+</button>
                </div>
              </div>
              <span style={{ fontSize:28, fontWeight:900, color:'#333' }}>×</span>
              {/* Visitante */}
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:10 }}>
                {jogo && <img src={jogo.visitante.escudo_url} style={{ width:52, height:52, objectFit:'contain' }} />}
                <span style={{ fontSize:11, fontWeight:900, color:'#F5C400', textTransform:'uppercase' }}>{jogo?.visitante?.nome || 'Visitante'}</span>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <button onClick={() => setPalpite(p => ({ ...p, visitante: Math.max(0,p.visitante-1) }))} style={{ width:36, height:36, borderRadius:'50%', border:'1px solid #333', background:'transparent', color:'#fff', fontSize:18, cursor:'pointer' }}>−</button>
                  <span style={{ fontSize:40, fontWeight:900, color:'#F5C400', width:44, textAlign:'center' }}>{palpite.visitante}</span>
                  <button onClick={() => setPalpite(p => ({ ...p, visitante: Math.min(9,p.visitante+1) }))} style={{ width:36, height:36, borderRadius:'50%', border:'1px solid #333', background:'transparent', color:'#fff', fontSize:18, cursor:'pointer' }}>+</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── CONFIRMAR ── */}
        {step === 'confirmar' && (
          <div style={{ marginTop:20 }}>
            <div style={{ fontSize:18, fontWeight:900, color:'#F5C400', marginBottom:16 }}>Confirme sua escalação</div>
            <div style={{ background:'#111', borderRadius:12, padding:16, marginBottom:12 }}>
              <div style={{ fontSize:10, color:'#555', textTransform:'uppercase', letterSpacing:2, marginBottom:8 }}>Formação</div>
              <div style={{ fontSize:15, fontWeight:700, color:'#fff' }}>{formation}</div>
            </div>
            <div style={{ background:'#111', borderRadius:12, padding:16, marginBottom:12 }}>
              <div style={{ fontSize:10, color:'#555', textTransform:'uppercase', letterSpacing:2, marginBottom:8 }}>Capitão</div>
              <div style={{ fontSize:15, fontWeight:700, color:'#F5C400' }}>👑 {capitao?.name}</div>
            </div>
            <div style={{ background:'#111', borderRadius:12, padding:16, marginBottom:12 }}>
              <div style={{ fontSize:10, color:'#555', textTransform:'uppercase', letterSpacing:2, marginBottom:8 }}>Herói da Partida</div>
              <div style={{ fontSize:15, fontWeight:700, color:'#F5C400' }}>⭐ {heroi?.name}</div>
            </div>
            <div style={{ background:'#111', borderRadius:12, padding:16, marginBottom:24 }}>
              <div style={{ fontSize:10, color:'#555', textTransform:'uppercase', letterSpacing:2, marginBottom:8 }}>Palpite</div>
              <div style={{ fontSize:22, fontWeight:900, color:'#fff' }}>
                {jogo?.mandante?.nome} <span style={{ color:'#F5C400' }}>{palpite.mandante} × {palpite.visitante}</span> {jogo?.visitante?.nome}
              </div>
            </div>
            <button onClick={handleSalvar} disabled={saving}
              style={{ width:'100%', padding:'16px', background:'#F5C400', color:'#1a1a1a', border:'none', borderRadius:12, fontSize:16, fontWeight:900, cursor:'pointer', textTransform:'uppercase', letterSpacing:1 }}>
              {saving ? 'Salvando...' : '🐯 Confirmar Escalação'}
            </button>
          </div>
        )}
      </div>

      {/* Botão rodapé */}
      {['escalar','capitao','heroi','palpite'].includes(step) && (
        <div style={{ position:'fixed', bottom:0, left:0, right:0, background:'#000', borderTop:'1px solid #111', padding:'10px 16px 16px' }}>
          <button
            onClick={() => {
              if (step==='escalar' && filledCount===11) setStep('capitao');
              else if (step==='capitao' && capitao) setStep('heroi');
              else if (step==='heroi' && heroi) setStep('palpite');
              else if (step==='palpite') setStep('confirmar');
            }}
            disabled={
              (step==='escalar' && filledCount<11) ||
              (step==='capitao' && !capitao) ||
              (step==='heroi' && !heroi)
            }
            style={{ width:'100%', padding:'14px', border:'none', borderRadius:12, fontSize:15, fontWeight:900, textTransform:'uppercase', letterSpacing:1, cursor:'pointer',
              background: (step==='escalar'&&filledCount<11)||(step==='capitao'&&!capitao)||(step==='heroi'&&!heroi) ? '#1a1a1a' : '#F5C400',
              color: (step==='escalar'&&filledCount<11)||(step==='capitao'&&!capitao)||(step==='heroi'&&!heroi) ? '#333' : '#1a1a1a'
            }}>
            {step==='escalar' ? (filledCount<11 ? `Escale ${11-filledCount} jogador${11-filledCount>1?'es':''} ainda` : 'Próximo — Escolher Capitão →') :
             step==='capitao' ? (capitao ? `Capitão: ${capitao.short} — Próximo →` : 'Escolha o capitão') :
             step==='heroi' ? (heroi ? `Herói: ${heroi.short} — Próximo →` : 'Escolha o herói') :
             'Próximo — Confirmar →'}
          </button>
        </div>
      )}

    </main>
  );
}
