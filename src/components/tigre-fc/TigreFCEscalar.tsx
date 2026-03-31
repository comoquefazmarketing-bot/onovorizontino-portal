'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import TigreFCLogin from '@/components/tigre-fc/TigreFCLogin';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const LOGO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/tigre-fc-logo.png';
const BASE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';
const MINUTOS_ANTECEDENCIA = 90; 

const PLAYERS = [
  { id: 1,  name: 'César Augusto',   short: 'César',      num: 31, pos: 'GOL', foto: BASE+'CESAR-AUGUSTO.jpg.webp' },
  { id: 2,  name: 'Jordi',             short: 'Jordi',      num: 93, pos: 'GOL', foto: BASE+'JORDI.jpg.webp' },
  { id: 3,  name: 'João Scapin',       short: 'Scapin',      num: 12, pos: 'GOL', foto: BASE+'JOAO-SCAPIN.jpg.webp' },
  { id: 4,  name: 'Lucas Ribeiro',     short: 'Lucas',      num: 1,  pos: 'GOL', foto: BASE+'LUCAS-RIBEIRO.jpg.webp' },
  { id: 5,  name: 'Lora',              short: 'Lora',         num: 2,  pos: 'LAT', foto: BASE+'LORA.jpg.webp' },
  { id: 6,  name: 'Castrillón',        short: 'Castrillón', num: 6,  pos: 'LAT', foto: BASE+'CASTRILLON.jpg.webp' },
  { id: 7,  name: 'Arthur Barbosa',    short: 'A.Barbosa',  num: 22, pos: 'LAT', foto: BASE+'ARTHUR-BARBOSA.jpg.webp' },
  { id: 8,  name: 'Sander',            short: 'Sander',     num: 33, pos: 'LAT', foto: BASE+'SANDER.jpg.webp' }, // ADICIONADO
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
  { id: 19, name: 'Luís Oyama',         short: 'Oyama',        num: 8,  pos: 'MEI', foto: BASE+'LUIS-OYAMA.jpg.webp' },
  { id: 20, name: 'Léo Naldi',         short: 'L.Naldi',     num: 7,  pos: 'MEI', foto: BASE+'LEO-NALDI.jpg.webp' },
  { id: 21, name: 'Rômulo',            short: 'Rômulo',      num: 10, pos: 'MEI', foto: BASE+'ROMULO.jpg.webp' },
  { id: 22, name: 'Matheus Bianqui',   short: 'Bianqui',     num: 11, pos: 'MEI', foto: BASE+'MATHEUS-BIANQUI.jpg.webp' },
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
  { id: 39, name: 'Ronald Barcellos',  short: 'Ronald',      num: 23, pos: 'ATA', foto: BASE+'RONALD-BARCELLOS.jpg.webp' },
];

const RESERVA_SLOTS = [
  { id: 'res_gol', pos: 'GOL', label: 'GOL' },
  { id: 'res_lat', pos: 'LAT', label: 'LAT' },
  { id: 'res_zag', pos: 'ZAG', label: 'ZAG' },
  { id: 'res_mei', pos: 'MEI', label: 'MEI' },
  { id: 'res_ata', pos: 'ATA', label: 'ATA' },
];

const FORMATIONS: Record<string, { id: string; label: string; x: number; y: number }[]> = {
  '4-3-3': [
    { id:'gk',  label:'GOL', x:50, y:88 }, { id:'rb',  label:'LAT', x:82, y:68 },
    { id:'cb1', label:'ZAG', x:62, y:72 }, { id:'cb2', label:'ZAG', x:38, y:72 },
    { id:'lb',  label:'LAT', x:18, y:68 }, { id:'cm1', label:'MEI', x:75, y:48 },
    { id:'cm2', label:'MEI', x:50, y:45 }, { id:'cm3', label:'MEI', x:25, y:48 },
    { id:'rw',  label:'ATA', x:80, y:22 }, { id:'st',  label:'ATA', x:50, y:15 },
    { id:'lw',  label:'ATA', x:20, y:22 },
  ],
  '4-4-2': [
    { id:'gk',  label:'GOL', x:50, y:88 }, { id:'rb',  label:'LAT', x:82, y:68 },
    { id:'cb1', label:'ZAG', x:62, y:72 }, { id:'cb2', label:'ZAG', x:38, y:72 },
    { id:'lb',  label:'LAT', x:18, y:68 }, { id:'rm',  label:'MEI', x:80, y:48 },
    { id:'cm1', label:'MEI', x:60, y:48 }, { id:'cm2', label:'MEI', x:40, y:48 },
    { id:'lm',  label:'MEI', x:20, y:48 }, { id:'st1', label:'ATA', x:65, y:20 },
    { id:'st2', label:'ATA', x:35, y:20 },
  ],
  '4-2-3-1': [
    { id:'gk',  label:'GOL', x:50, y:88 }, { id:'rb',  label:'LAT', x:82, y:68 },
    { id:'cb1', label:'ZAG', x:62, y:72 }, { id:'cb2', label:'ZAG', x:38, y:72 },
    { id:'lb',  label:'LAT', x:18, y:68 }, { id:'dm1', label:'MEI', x:62, y:55 },
    { id:'dm2', label:'MEI', x:38, y:55 }, { id:'am1', label:'MEI', x:80, y:35 },
    { id:'am2', label:'MEI', x:50, y:32 }, { id:'am3', label:'MEI', x:20, y:35 },
    { id:'st',  label:'ATA', x:50, y:15 },
  ],
  '3-5-2': [
    { id:'gk',  label:'GOL', x:50, y:88 }, { id:'cb1', label:'ZAG', x:50, y:72 },
    { id:'cb2', label:'ZAG', x:72, y:70 }, { id:'cb3', label:'ZAG', x:28, y:70 },
    { id:'rm',  label:'LAT', x:85, y:48 }, { id:'lm',  label:'LAT', x:15, y:48 },
    { id:'cm1', label:'MEI', x:50, y:50 }, { id:'cm2', label:'MEI', x:68, y:38 },
    { id:'cm3', label:'MEI', x:32, y:38 }, { id:'st1', label:'ATA', x:60, y:18 },
    { id:'st2', label:'ATA', x:40, y:18 },
  ],
  '3-4-3': [
    { id:'gk',  label:'GOL', x:50, y:88 }, { id:'cb1', label:'ZAG', x:50, y:72 },
    { id:'cb2', label:'ZAG', x:72, y:70 }, { id:'cb3', label:'ZAG', x:28, y:70 },
    { id:'rm',  label:'MEI', x:82, y:48 }, { id:'cm1', label:'MEI', x:60, y:48 },
    { id:'cm2', label:'MEI', x:40, y:48 }, { id:'lm',  label:'MEI', x:18, y:48 },
    { id:'rw',  label:'ATA', x:80, y:22 }, { id:'st',  label:'ATA', x:50, y:15 },
    { id:'lw',  label:'ATA', x:20, y:22 },
  ]
};

type Player = typeof PLAYERS[0];
type Lineup = Record<string, Player | null>;
type Step = 'login' | 'apelido' | 'escalar' | 'capitao' | 'heroi' | 'palpite' | 'confirmar' | 'salvo';

function PlayerCard({ player, size, isCapitao, isHeroi, isList }: { player: Player, size: number, isCapitao?: boolean, isHeroi?: boolean, isList?: boolean }) {
  if (isList) {
    return (
      <div style={{ width: '100%', textAlign: 'center' }}>
        <div style={{ width: size, height: size, margin: '0 auto 8px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #222', background: '#111' }}>
          <img src={player.foto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={player.short} />
        </div>
        <div style={{ fontSize: 10, fontWeight: 900, color: '#fff' }}>{player.short}</div>
        <div style={{ fontSize: 8, color: '#F5C400', fontWeight: 800 }}>{player.pos}</div>
      </div>
    );
  }

  return (
    <div className="player-card-container" style={{ width: size, textAlign: 'center', position: 'relative' }}>
      {isCapitao && <div style={{ position:'absolute', top:-12, left:'50%', transform:'translateX(-50%)', zIndex:10, fontSize:14 }}>👑</div>}
      {isHeroi && <div style={{ position:'absolute', top:-12, left:'50%', transform:'translateX(-50%)', zIndex:10, fontSize:14 }}>⭐</div>}
      
      <div style={{ 
        width: size, 
        height: size, 
        borderRadius: '50%', 
        overflow: 'hidden', 
        border: '2px solid #F5C400',
        background: '#111',
        position: 'relative',
        cursor: 'pointer'
      }}>
        <div className="sprite-image" style={{
          width: '100%',
          height: '100%',
          backgroundImage: `url(${player.foto})`,
          backgroundSize: '200% 100%', 
          backgroundPosition: 'left center', 
          backgroundRepeat: 'no-repeat',
          position: 'absolute',
          top: 0,
          left: 0,
          transition: 'background-position 0s steps(1)' 
        }} />
      </div>

      <div style={{ 
        background: '#F5C400', color: '#000', fontSize: Math.max(size * 0.18, 10), fontWeight: 900, 
        borderRadius: 4, marginTop: -10, position: 'relative', zIndex: 2, 
        padding: '2px 4px', whiteSpace: 'nowrap', overflow: 'hidden', textTransform: 'uppercase',
        border: '1px solid #000', boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
      }}>
        {player.short}
      </div>

      <style jsx>{`
        .player-card-container:hover .sprite-image { background-position: right center; }
        .player-card-container:active .sprite-image { background-position: right center; }
      `}</style>
    </div>
  );
}

export default function TigreFCEscalar({ jogoId }: { jogoId: number }) {
  const [mounted, setMounted]         = useState(false);
  const [step, setStep]                = useState<Step>('login');
  const [usuario, setUsuario]          = useState<any>(null);
  const [apelido, setApelido]          = useState('');
  const [formation, setFormation]      = useState('4-3-3');
  const [lineup, setLineup]            = useState<Lineup>({});
  const [selected, setSelected]        = useState<{ player: Player; from: string } | null>(null);
  const [filterPos, setFilterPos]      = useState('TODOS');
  const [capitao, setCapitao]          = useState<Player | null>(null);
  const [heroi, setHeroi]              = useState<Player | null>(null);
  const [palpite, setPalpite]          = useState({ mandante: 1, visitante: 0 });
  const [jogo, setJogo]                = useState<any>(null);
  const [saving, setSaving]            = useState(false);
  const [fieldWidth, setFieldWidth]   = useState(340);

  useEffect(() => {
    setMounted(true);
    const update = () => setFieldWidth(Math.min(window.innerWidth - 32, 450));
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const isMercadoAberto = () => {
    if (!jogo?.data_inicio) return true;
    const agora = new Date();
    const dataISO = jogo.data_inicio.replace(' ', 'T');
    const limite = new Date(new Date(dataISO).getTime() - (MINUTOS_ANTECEDENCIA * 60 * 1000));
    return agora < limite;
  };

  useEffect(() => {
    fetch('/api/proximo-jogo').then(r => r.json()).then(({ jogos }) => {
      const j = jogos?.find((j: any) => j.id === Number(jogoId)) || jogos?.[0];
      setJogo(j);
    });
  }, [jogoId]);

  useEffect(() => {
    if (!mounted) return;
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user) return;
      const { data: existing } = await supabase.from('tigre_fc_usuarios').select('*').eq('google_id', session.user.id).single();
      if (existing) {
        setUsuario(existing);
        recuperarEscalacao(existing.id);
        setStep('escalar');
      } else {
        setUsuario({ google_id: session.user.id, nome: session.user.user_metadata?.full_name || 'Torcedor', email: session.user.email });
        setStep('apelido');
      }
    });
  }, [jogoId, mounted]);

  const recuperarEscalacao = async (uid: string) => {
    try {
      const res = await fetch(`/api/tigre-fc/minha-escalacao?usuario_id=${uid}&jogo_id=${jogoId}`);
      const { escalacao, palpite: pal } = await res.json();
      if (escalacao) {
        setFormation(escalacao.formacao || '4-3-3');
        const l: Lineup = {};
        Object.entries(escalacao.lineup || {}).forEach(([k, v]: any) => { 
          if(v?.id) l[k] = PLAYERS.find(p => p.id === v.id) || null; 
        });
        setLineup(l);
        if (escalacao.capitao_id) setCapitao(PLAYERS.find(p => p.id === escalacao.capitao_id) || null);
        if (escalacao.heroi_id)   setHeroi(PLAYERS.find(p => p.id === escalacao.heroi_id) || null);
      }
      if (pal) setPalpite({ mandante: pal.gols_mandante, visitante: pal.gols_visitante });
    } catch (e) { console.error(e); }
  };

  const handleSalvarApelido = async () => {
    if (!apelido.trim()) return;
    const { data } = await supabase.from('tigre_fc_usuarios').insert({ google_id: usuario.google_id, nome: usuario.nome, email: usuario.email, apelido: apelido.trim().toUpperCase() }).select().single();
    if (data) { setUsuario(data); setStep('escalar'); }
  };

  const handleSalvar = async () => {
    if (!isMercadoAberto() || saving) return;
    setSaving(true);
    await supabase.from('tigre_fc_escalacoes').upsert({ usuario_id: usuario.id, jogo_id: jogoId, formacao: formation, lineup, capitao_id: capitao?.id, heroi_id: heroi?.id }, { onConflict: 'usuario_id,jogo_id' });
    await supabase.from('tigre_fc_palpites').upsert({ usuario_id: usuario.id, jogo_id: jogoId, gols_mandante: palpite.mandante, gols_visitante: palpite.visitante }, { onConflict: 'usuario_id,jogo_id' });
    setStep('salvo');
    setSaving(false);
  };

  const placePlayer = (slotId: string, player: Player, from: string) => {
    const resSlot = RESERVA_SLOTS.find(s => s.id === slotId);
    if (resSlot && player.pos !== resSlot.pos) return;
    setLineup(prev => {
      const next = { ...prev };
      if (from !== 'bench') next[from] = next[slotId] ?? null;
      next[slotId] = player;
      return next;
    });
    setSelected(null);
  };

  const handleTapSlot = (slotId: string) => {
    if (!isMercadoAberto()) return;
    const resSlot = RESERVA_SLOTS.find(s => s.id === slotId);
    if (resSlot) setFilterPos(resSlot.pos);
    if (selected) placePlayer(slotId, selected.player, selected.from);
    else { const p = lineup[slotId]; if (p) setSelected({ player: p, from: slotId }); }
  };

  if (!mounted) return null;

  const slots = FORMATIONS[formation] || FORMATIONS['4-3-3'];
  const usedIds = Object.values(lineup).filter(Boolean).map(p => p!.id);
  const filledCount = Object.keys(lineup).filter(k => !k.startsWith('res_') && lineup[k]).length;
  const escalados = Object.values(lineup).filter(Boolean) as Player[];
  const mercadoAberto = isMercadoAberto();

  if (step === 'login') return <TigreFCLogin jogoId={jogoId} onSuccess={(u) => { setUsuario(u); setStep(u.apelido ? 'escalar' : 'apelido'); if(u.apelido) recuperarEscalacao(u.id); }} />;

  if (step === 'apelido') return (
    <main style={{ minHeight:'100vh', background:'#080808', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24 }}>
      <img src={LOGO} style={{ width:64, marginBottom:16 }} />
      <div style={{ fontSize:22, fontWeight:900, color:'#F5C400', marginBottom:32 }}>Qual seu apelido, Tigre?</div>
      <input value={apelido} onChange={e => setApelido(e.target.value.toUpperCase())} placeholder="APELIDO" style={{ width:'100%', maxWidth:360, padding:16, background:'#111', border:'1px solid #333', borderRadius:12, color:'#fff', fontWeight:700, marginBottom:12 }} />
      <button onClick={handleSalvarApelido} style={{ width:'100%', maxWidth:360, padding:16, background:'#F5C400', borderRadius:12, fontWeight:900, border:'none' }}>Bora jogar! 🐯</button>
    </main>
  );

  if (step === 'salvo') return (
    <main style={{ minHeight:'100vh', background:'#080808', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24, textAlign:'center' }}>
      <div style={{ fontSize:64, marginBottom:16 }}>🐯</div>
      <div style={{ fontSize:28, fontWeight:900, color:'#F5C400', marginBottom:24 }}>Escalação Cravada!</div>
      <button onClick={() => window.location.href='/tigre-fc'} style={{ width:'100%', maxWidth:360, padding:16, background:'#F5C400', borderRadius:12, fontWeight:900, border:'none' }}>Voltar para Home</button>
    </main>
  );

  return (
    <main style={{ minHeight:'100vh', background:'#080808', color:'#fff', paddingBottom:120 }}>
      {/* Header */}
      <div style={{ background:'#F5C400', padding:16, display:'flex', alignItems:'center', justifyContent:'space-between', position: 'sticky', top:0, zIndex: 100 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <img src={LOGO} style={{ width:28 }} alt="Logo" />
          <span style={{ fontWeight:900, color:'#1a1a1a' }}>TIGRE FC</span>
        </div>
        {!mercadoAberto && <span style={{ fontSize:10, fontWeight:900, background:'#000', color:'#fff', padding:'4px 8px', borderRadius:4 }}>🔒 FECHADO</span>}
      </div>

      <div style={{ maxWidth:480, margin:'0 auto', padding:16 }}>
        {step === 'escalar' && (
          <>
            <div style={{ display:'flex', gap:6, marginBottom:20, overflowX:'auto', paddingBottom: 4 }}>
              {Object.keys(FORMATIONS).map(f => (
                <button key={f} onClick={() => { setFormation(f); setLineup({}); }} style={{ flexShrink:0, padding:'8px 16px', borderRadius:8, border:'none', background: formation===f?'#F5C400':'#1a1a1a', color: formation===f?'#000':'#555', fontWeight:900, fontSize:12 }}>{f}</button>
              ))}
            </div>

            {/* CAMPO */}
            <div style={{ perspective: '1200px', marginBottom: 30, display:'flex', justifyContent:'center' }}>
              <div style={{ 
                position:'relative', width:fieldWidth, height:fieldWidth * 1.4, 
                background:'#1a4a1a', borderRadius:4,
                transform: 'rotateX(20deg)', transformStyle: 'preserve-3d',
                transformOrigin: 'bottom center',
                boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
                border: '3px solid #fff',
                overflow: 'hidden'
              }}>
                <svg viewBox="0 0 68 105" preserveAspectRatio="none" style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', opacity: 0.6 }}>
                  <g fill="none" stroke="#fff" strokeWidth="0.6">
                    <line x1="0" y1="52.5" x2="68" y2="52.5" />
                    <circle cx="34" cy="52.5" r="9.15" />
                    <rect x="13.8" y="0" width="40.3" height="16.5" />
                    <rect x="13.8" y="88.5" width="40.3" height="16.5" />
                  </g>
                </svg>

                {slots.map(slot => {
                  const p = lineup[slot.id];
                  return (
                    <div key={slot.id} onClick={() => handleTapSlot(slot.id)} style={{ position:'absolute', left:`${slot.x}%`, top:`${slot.y}%`, transform:'translate(-50%,-50%) translateZ(40px)', cursor:'pointer', zIndex: Math.round(slot.y) }}>
                      {p ? (
                        <PlayerCard player={p} size={fieldWidth * 0.17} isCapitao={capitao?.id===p.id} isHeroi={heroi?.id===p.id} />
                      ) : (
                        <div style={{ width:38, height:38, borderRadius:'50%', border:'2px dashed rgba(255,255,255,0.4)', background:'rgba(0,0,0,0.3)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:900, fontSize:10 }}>{slot.label}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* BANCO */}
            <div style={{ background:'#111', borderRadius:16, padding:16, marginBottom:20, border:'1px solid #222' }}>
              <div style={{ fontSize:10, fontWeight:900, color:'#F5C400', letterSpacing:1, marginBottom:12 }}>BANCO DE RESERVAS</div>
              <div style={{ display:'flex', justifyContent:'space-between' }}>
                {RESERVA_SLOTS.map(slot => {
                  const p = lineup[slot.id];
                  return (
                    <div key={slot.id} onClick={() => handleTapSlot(slot.id)} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                       {p ? ( <PlayerCard player={p} size={42} /> ) : (
                         <div style={{ width:42, height:42, borderRadius:'50%', border:'1px dashed #333', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, color:'#444', fontWeight:800 }}>{slot.label}</div>
                       )}
                       <span style={{ fontSize:7, color:'#333', fontWeight:900 }}>RESERVA</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* LISTA DE JOGADORES PARA ESCOLHER */}
            <div style={{ display:'flex', gap:8, marginBottom:12, overflowX:'auto', paddingBottom:4 }}>
              {['TODOS','GOL','LAT','ZAG','MEI','ATA'].map(pos => (
                <button key={pos} onClick={() => setFilterPos(pos)} style={{ flexShrink:0, padding:'6px 12px', borderRadius:20, border:'none', background: filterPos===pos?'#fff':'#111', color: filterPos===pos?'#000':'#555', fontSize:10, fontWeight:900 }}>{pos}</button>
              ))}
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
              {PLAYERS.filter(p => (filterPos==='TODOS' || p.pos===filterPos) && !usedIds.includes(p.id)).map(p => (
                <div key={p.id} onClick={() => setSelected({ player:p, from:'bench' })} style={{ 
                  background:'#111', borderRadius:12, padding:8, textAlign:'center', border: selected?.player.id===p.id?'2px solid #F5C400':'1px solid #1a1a1a'
                }}>
                  <PlayerCard player={p} size={50} isList />
                </div>
              ))}
            </div>
          </>
        )}

        {/* ETAPAS POST-ESCALAÇÃO */}
        {step === 'capitao' && (
          <div style={{ textAlign:'center', padding:20 }}>
            <div style={{ fontSize:20, fontWeight:900, color:'#F5C400', marginBottom:8 }}>Quem é o Capitão? 👑</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginTop:24 }}>
              {escalados.map(p => (
                <div key={p.id} onClick={() => setCapitao(p)} style={{ padding:12, borderRadius:12, background: capitao?.id===p.id?'#F5C400':'#111', color: capitao?.id===p.id?'#000':'#fff' }}>
                  <img src={p.foto} style={{ width:40, height:40, borderRadius:'50%', marginBottom:8 }} alt={p.short} />
                  <div style={{ fontSize:10, fontWeight:900 }}>{p.short}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 'heroi' && (
          <div style={{ textAlign:'center', padding:20 }}>
            <div style={{ fontSize:20, fontWeight:900, color:'#F5C400', marginBottom:8 }}>Quem é o seu Herói? ⭐</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginTop:24 }}>
              {escalados.map(p => (
                <div key={p.id} onClick={() => setHeroi(p)} style={{ padding:12, borderRadius:12, background: heroi?.id===p.id?'#F5C400':'#111', color: heroi?.id===p.id?'#000':'#fff' }}>
                  <img src={p.foto} style={{ width:40, height:40, borderRadius:'50%', marginBottom:8 }} alt={p.short} />
                  <div style={{ fontSize:10, fontWeight:900 }}>{p.short}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 'palpite' && (
          <div style={{ textAlign:'center', padding:20 }}>
            <div style={{ fontSize:20, fontWeight:900, color:'#F5C400', marginBottom:32 }}>Qual o placar do jogo? 🐯</div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:20 }}>
              <div>
                <div style={{ fontSize:10, fontWeight:900, marginBottom:8 }}>NOVORIZONTINO</div>
                <input type="number" value={palpite.mandante} onChange={e => setPalpite({...palpite, mandante: Number(e.target.value)})} style={{ width:60, height:60, textAlign:'center', background:'#111', border:'1px solid #333', color:'#fff', fontSize:24, borderRadius:12, fontWeight:900 }} />
              </div>
              <div style={{ fontSize:20, fontWeight:900, color:'#333', marginTop:20 }}>X</div>
              <div>
                <div style={{ fontSize:10, fontWeight:900, marginBottom:8 }}>VISITANTE</div>
                <input type="number" value={palpite.visitante} onChange={e => setPalpite({...palpite, visitante: Number(e.target.value)})} style={{ width:60, height:60, textAlign:'center', background:'#111', border:'1px solid #333', color:'#fff', fontSize:24, borderRadius:12, fontWeight:900 }} />
              </div>
            </div>
          </div>
        )}

        {step === 'confirmar' && (
          <div style={{ textAlign:'center', padding:20 }}>
            <div style={{ fontSize:24, fontWeight:900, color:'#F5C400', marginBottom:8 }}>Tudo pronto?</div>
            <div style={{ background:'#111', padding:16, borderRadius:16, textAlign:'left', border:'1px solid #222', marginTop: 24 }}>
              <div style={{ fontWeight:900, marginBottom:12 }}>Capitão: {capitao?.name}</div>
              <div style={{ fontWeight:900, marginBottom:12 }}>Herói: {heroi?.name}</div>
              <div style={{ fontWeight:900 }}>Placar: {palpite.mandante} x {palpite.visitante}</div>
            </div>
          </div>
        )}
      </div>

      {/* Botão de Ação */}
      {['escalar','capitao','heroi','palpite','confirmar'].includes(step) && (
        <div style={{ position:'fixed', bottom:0, left:0, right:0, padding:20, background:'linear-gradient(transparent, #000 30%)', zIndex:100 }}>
          <button 
            onClick={() => {
              if (step==='escalar' && filledCount===11) setStep('capitao');
              else if (step==='capitao' && capitao) setStep('heroi');
              else if (step==='heroi' && heroi) setStep('palpite');
              else if (step==='palpite') setStep('confirmar');
              else if (step==='confirmar') handleSalvar();
            }}
            disabled={!mercadoAberto || (step==='escalar' && filledCount<11)}
            style={{ width:'100%', padding:18, borderRadius:16, border:'none', background: mercadoAberto?'#F5C400':'#1a1a1a', color:'#000', fontWeight:900, textTransform:'uppercase' }}>
            {!mercadoAberto ? 'MERCADO FECHADO' : step==='escalar' ? (filledCount<11 ? `FALTAM ${11-filledCount} JOGADORES` : 'ESCOLHER CAPITÃO →') : step==='confirmar' ? (saving ? 'SALVANDO...' : 'CONFIRMAR TUDO 🐯') : 'PRÓXIMO →'}
          </button>
        </div>
      )}
    </main>
  );
}
