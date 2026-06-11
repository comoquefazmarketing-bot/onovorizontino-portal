'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const LOGO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/tigre-fc-logo.png';

const PLAYERS = [
  { id: 1,  name: 'César Augusto',    pos: 'GOL' }, { id: 2,  name: 'Jordi',            pos: 'GOL' },
  { id: 3,  name: 'João Scapin',      pos: 'GOL' }, { id: 4,  name: 'Lucas Ribeiro',    pos: 'GOL' },
  { id: 5,  name: 'Lora',             pos: 'LAT' }, { id: 6,  name: 'Castrillón',       pos: 'LAT' },
  { id: 7,  name: 'Arthur Barbosa',   pos: 'LAT' }, { id: 8,  name: 'Mayk',             pos: 'LAT' },
  { id: 9,  name: 'Maykon Jesus',     pos: 'LAT' }, { id: 10, name: 'Dantas',           pos: 'ZAG' },
  { id: 11, name: 'Eduardo Brock',    pos: 'ZAG' }, { id: 12, name: 'Patrick',          pos: 'ZAG' },
  { id: 13, name: 'Gabriel Bahia',    pos: 'ZAG' }, { id: 14, name: 'Carlinhos',        pos: 'ZAG' },
  { id: 15, name: 'Alemão',           pos: 'ZAG' }, { id: 16, name: 'Renato Palm',      pos: 'ZAG' },
  { id: 17, name: 'Alvariño',         pos: 'ZAG' }, { id: 18, name: 'Bruno Santana',    pos: 'ZAG' },
  { id: 19, name: 'Luís Oyama',       pos: 'MEI' }, { id: 20, name: 'Léo Naldi',        pos: 'MEI' },
  { id: 21, name: 'Rômulo',           pos: 'MEI' }, { id: 22, name: 'Matheus Bianqui',  pos: 'MEI' },
  { id: 23, name: 'Juninho',          pos: 'MEI' }, { id: 24, name: 'Tavinho',          pos: 'MEI' },
  { id: 25, name: 'Diego Galo',       pos: 'MEI' }, { id: 26, name: 'Marlon',           pos: 'MEI' },
  { id: 27, name: 'Hector Bianchi',   pos: 'MEI' }, { id: 28, name: 'Nogueira',         pos: 'MEI' },
  { id: 29, name: 'Luiz Gabriel',     pos: 'MEI' }, { id: 30, name: 'Jhones Kauê',      pos: 'MEI' },
  { id: 31, name: 'Robson',           pos: 'ATA' }, { id: 32, name: 'Vinícius Paiva',   pos: 'ATA' },
  { id: 33, name: 'Hélio Borges',     pos: 'ATA' }, { id: 34, name: 'Jardiel',          pos: 'ATA' },
  { id: 35, name: 'Nicolas Careca',   pos: 'ATA' }, { id: 36, name: 'Titi Ortiz',       pos: 'ATA' },
  { id: 37, name: 'Diego Mathias',    pos: 'ATA' }, { id: 38, name: 'Carlão',           pos: 'ATA' },
  { id: 39, name: 'Ronald Barcellos', pos: 'ATA' },
];

type Evento = { player_id: number; tipo: string };
type Jogo = { id: number; competicao: string; data_hora: string; mandante: any; visitante: any };

const TIPOS_EVENTO = ['gol','assist','titular','clean_sheet','amarelo','vermelho'];
const TIPO_LABEL: Record<string,string> = { gol:'+8 Gol', assist:'+5 Assist', titular:'+2 Titular', clean_sheet:'+5 Sem gol', amarelo:'-2 Amarelo', vermelho:'-5 Vermelho' };
const TIPO_COLOR: Record<string,string> = { gol:'#4ade80', assist:'#60a5fa', titular:'#a78bfa', clean_sheet:'#34d399', amarelo:'#fbbf24', vermelho:'#f87171' };

export default function TigreFCAdminPage() {
  const [secret, setSecret] = useState('');
  const [autenticado, setAutenticado] = useState(false);
  const [jogos, setJogos] = useState<Jogo[]>([]);
  const [jogoId, setJogoId] = useState<number | null>(null);
  const [golsMandante, setGolsMandante] = useState(0);
  const [golsVisitante, setGolsVisitante] = useState(0);
  const [heroiId, setHeroiId] = useState<number | null>(null);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [processing, setProcessing] = useState(false);
  const [resultado, setResultado] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [filterPos, setFilterPos] = useState('TODOS');

  useEffect(() => {
    if (!autenticado) return;
    // Carrega jogos
    supabase.from('jogos').select('id,competicao,data_hora,mandante_slug,visitante_slug')
      .eq('ativo', true).order('data_hora', { ascending: false }).limit(20)
      .then(({ data }) => {
        if (data) fetchJogosComEscudos(data);
      });
    // Carrega stats gerais
    Promise.all([
      supabase.from('tigre_fc_usuarios').select('id', { count: 'exact', head: true }),
      supabase.from('tigre_fc_escalacoes').select('id', { count: 'exact', head: true }),
      supabase.from('tigre_fc_resultados').select('id', { count: 'exact', head: true }).eq('processado', true),
    ]).then(([u, e, r]) => {
      setStats({ usuarios: u.count, escalacoes: e.count, rodadas: r.count });
    });
  }, [autenticado]);

  const fetchJogosComEscudos = async (jogosRaw: any[]) => {
    const slugs = [...new Set([...jogosRaw.map(j => j.mandante_slug), ...jogosRaw.map(j => j.visitante_slug)])];
    const { data: times } = await supabase.from('times_serie_b').select('slug,nome,escudo_url').in('slug', slugs);
    const timesMap = Object.fromEntries((times || []).map(t => [t.slug, t]));
    setJogos(jogosRaw.map(j => ({
      ...j,
      mandante: timesMap[j.mandante_slug] || { nome: j.mandante_slug, escudo_url: '' },
      visitante: timesMap[j.visitante_slug] || { nome: j.visitante_slug, escudo_url: '' },
    })));
  };

  const addEvento = (player_id: number, tipo: string) => {
    setEventos(prev => [...prev, { player_id, tipo }]);
  };

  const removeEvento = (i: number) => {
    setEventos(prev => prev.filter((_, idx) => idx !== i));
  };

  const processar = async () => {
    if (!jogoId) return alert('Selecione um jogo');
    setProcessing(true);
    setResultado(null);
    try {
      const res = await fetch('/api/tigre-fc/processar-resultado', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
        body: JSON.stringify({ jogo_id: jogoId, gols_mandante: golsMandante, gols_visitante: golsVisitante, heroi_id: heroiId, eventos }),
      });
      const data = await res.json();
      setResultado(data);
    } catch(e) { setResultado({ error: 'Erro de conexão' }); }
    setProcessing(false);
  };

  const jogo = jogos.find(j => j.id === jogoId);
  const playersFiltered = PLAYERS.filter(p => filterPos === 'TODOS' || p.pos === filterPos);

  if (!autenticado) return (
    <main style={{ minHeight:'100vh', background:'#080808', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24 }}>
      <img src={LOGO} style={{ width:64, marginBottom:16 }} />
      <div style={{ fontSize:22, fontWeight:900, color:'#F5C400', marginBottom:32, fontFamily:'system-ui' }}>Admin Tigre FC</div>
      <div style={{ width:'100%', maxWidth:360, background:'#111', border:'1px solid #1a1a1a', borderRadius:12, padding:24 }}>
        <div style={{ fontSize:13, color:'#555', marginBottom:12, fontFamily:'system-ui' }}>Senha de administrador</div>
        <input type="password" value={secret} onChange={e => setSecret(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && setAutenticado(true)}
          placeholder="••••••••"
          style={{ width:'100%', padding:'12px', background:'#0a0a0a', border:'1px solid #222', borderRadius:8, color:'#fff', fontSize:16, marginBottom:12, boxSizing:'border-box' }} />
        <button onClick={() => setAutenticado(true)} style={{ width:'100%', padding:'12px', background:'#F5C400', color:'#111', fontWeight:900, fontSize:14, border:'none', borderRadius:8, cursor:'pointer', textTransform:'uppercase', letterSpacing:1, fontFamily:'system-ui' }}>
          Entrar
        </button>
      </div>
    </main>
  );

  return (
    <main style={{ minHeight:'100vh', background:'#080808', color:'#fff', fontFamily:'system-ui', paddingBottom:80 }}>

      {/* Header */}
      <div style={{ background:'#F5C400', padding:'14px 20px', display:'flex', alignItems:'center', gap:12 }}>
        <img src={LOGO} style={{ width:36, height:36, objectFit:'contain' }} />
        <div style={{ fontWeight:900, fontSize:18, color:'#1a1a1a', letterSpacing:-0.5 }}>TIGRE FC — ADMIN</div>
        <div style={{ marginLeft:'auto', fontSize:11, color:'rgba(0,0,0,0.5)', fontWeight:700, textTransform:'uppercase', letterSpacing:1 }}>Painel de Resultados</div>
      </div>

      <div style={{ maxWidth:720, margin:'0 auto', padding:'24px 16px' }}>

        {/* Stats */}
        {stats && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginBottom:24 }}>
            {[
              ['Torcedores', stats.usuarios],
              ['Escalações', stats.escalacoes],
              ['Rodadas processadas', stats.rodadas],
            ].map(([l,v]) => (
              <div key={l as string} style={{ background:'#111', border:'1px solid #1a1a1a', borderRadius:8, padding:16 }}>
                <div style={{ fontSize:11, color:'#555', textTransform:'uppercase', letterSpacing:1, marginBottom:4 }}>{l}</div>
                <div style={{ fontSize:28, fontWeight:900, color:'#F5C400' }}>{v ?? '—'}</div>
              </div>
            ))}
          </div>
        )}

        {/* Seleção do jogo */}
        <div style={{ background:'#111', border:'1px solid #1a1a1a', borderRadius:12, padding:20, marginBottom:16 }}>
          <div style={{ fontSize:11, color:'#F5C400', textTransform:'uppercase', letterSpacing:2, marginBottom:12, fontWeight:900 }}>1. Selecione o jogo</div>
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            {jogos.map(j => (
              <button key={j.id} onClick={() => setJogoId(j.id)}
                style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', background: jogoId===j.id?'#1a1200':'#0a0a0a', border: jogoId===j.id?'1px solid #F5C400':'1px solid #1a1a1a', borderRadius:8, cursor:'pointer', textAlign:'left' }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:900, color: jogoId===j.id?'#F5C400':'#fff', textTransform:'uppercase' }}>
                    {j.mandante?.nome} × {j.visitante?.nome}
                  </div>
                  <div style={{ fontSize:10, color:'#555', marginTop:2 }}>{j.competicao} · {new Date(j.data_hora).toLocaleDateString('pt-BR')}</div>
                </div>
                {jogoId===j.id && <div style={{ width:8, height:8, borderRadius:'50%', background:'#F5C400' }} />}
              </button>
            ))}
          </div>
        </div>

        {/* Placar */}
        {jogo && (
          <div style={{ background:'#111', border:'1px solid #1a1a1a', borderRadius:12, padding:20, marginBottom:16 }}>
            <div style={{ fontSize:11, color:'#F5C400', textTransform:'uppercase', letterSpacing:2, marginBottom:16, fontWeight:900 }}>2. Placar final</div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:24 }}>
              <div style={{ textAlign:'center' }}>
                <div style={{ fontSize:11, color:'#555', textTransform:'uppercase', letterSpacing:1, marginBottom:8 }}>{jogo.mandante?.nome}</div>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <button onClick={() => setGolsMandante(m => Math.max(0,m-1))} style={{ width:36, height:36, borderRadius:'50%', border:'1px solid #333', background:'transparent', color:'#fff', fontSize:18, cursor:'pointer' }}>−</button>
                  <span style={{ fontSize:48, fontWeight:900, color:'#F5C400', width:56, textAlign:'center' }}>{golsMandante}</span>
                  <button onClick={() => setGolsMandante(m => Math.min(20,m+1))} style={{ width:36, height:36, borderRadius:'50%', border:'1px solid #333', background:'transparent', color:'#fff', fontSize:18, cursor:'pointer' }}>+</button>
                </div>
              </div>
              <span style={{ fontSize:28, color:'#333', fontWeight:900 }}>×</span>
              <div style={{ textAlign:'center' }}>
                <div style={{ fontSize:11, color:'#555', textTransform:'uppercase', letterSpacing:1, marginBottom:8 }}>{jogo.visitante?.nome}</div>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <button onClick={() => setGolsVisitante(v => Math.max(0,v-1))} style={{ width:36, height:36, borderRadius:'50%', border:'1px solid #333', background:'transparent', color:'#fff', fontSize:18, cursor:'pointer' }}>−</button>
                  <span style={{ fontSize:48, fontWeight:900, color:'#F5C400', width:56, textAlign:'center' }}>{golsVisitante}</span>
                  <button onClick={() => setGolsVisitante(v => Math.min(20,v+1))} style={{ width:36, height:36, borderRadius:'50%', border:'1px solid #333', background:'transparent', color:'#fff', fontSize:18, cursor:'pointer' }}>+</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Herói */}
        {jogo && (
          <div style={{ background:'#111', border:'1px solid #1a1a1a', borderRadius:12, padding:20, marginBottom:16 }}>
            <div style={{ fontSize:11, color:'#F5C400', textTransform:'uppercase', letterSpacing:2, marginBottom:12, fontWeight:900 }}>3. Herói da partida</div>
            <div style={{ display:'flex', gap:6, marginBottom:10, overflowX:'auto' }}>
              {['TODOS','GOL','LAT','ZAG','MEI','ATA'].map(p => (
                <button key={p} onClick={() => setFilterPos(p)}
                  style={{ flexShrink:0, padding:'4px 10px', fontSize:10, fontWeight:900, textTransform:'uppercase', border:'none', borderRadius:4, cursor:'pointer', background: filterPos===p?'#F5C400':'#1a1a1a', color: filterPos===p?'#111':'#555' }}>
                  {p}
                </button>
              ))}
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:6 }}>
              {playersFiltered.map(p => (
                <button key={p.id} onClick={() => setHeroiId(heroiId===p.id?null:p.id)}
                  style={{ padding:'8px 6px', background: heroiId===p.id?'#1a1200':'#0a0a0a', border: heroiId===p.id?'1px solid #F5C400':'1px solid #1a1a1a', borderRadius:6, cursor:'pointer', textAlign:'center' }}>
                  <div style={{ fontSize:11, fontWeight:900, color: heroiId===p.id?'#F5C400':'#fff', textTransform:'uppercase' }}>{p.name}</div>
                  <div style={{ fontSize:9, color:'#444', marginTop:2 }}>{p.pos}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Eventos */}
        {jogo && (
          <div style={{ background:'#111', border:'1px solid #1a1a1a', borderRadius:12, padding:20, marginBottom:16 }}>
            <div style={{ fontSize:11, color:'#F5C400', textTransform:'uppercase', letterSpacing:2, marginBottom:12, fontWeight:900 }}>4. Eventos dos jogadores</div>

            {/* Eventos adicionados */}
            {eventos.length > 0 && (
              <div style={{ marginBottom:16, display:'flex', flexDirection:'column', gap:4 }}>
                {eventos.map((ev, i) => {
                  const pl = PLAYERS.find(p => p.id === ev.player_id);
                  return (
                    <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'8px 12px', background:'#0a0a0a', border:'1px solid #1a1a1a', borderRadius:6 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <div style={{ width:8, height:8, borderRadius:'50%', background: TIPO_COLOR[ev.tipo] || '#888', flexShrink:0 }} />
                        <span style={{ fontSize:12, fontWeight:700, color:'#fff' }}>{pl?.name}</span>
                        <span style={{ fontSize:10, color: TIPO_COLOR[ev.tipo], fontWeight:900, textTransform:'uppercase', letterSpacing:1 }}>{TIPO_LABEL[ev.tipo]}</span>
                      </div>
                      <button onClick={() => removeEvento(i)} style={{ background:'none', border:'none', color:'#555', fontSize:16, cursor:'pointer', padding:'0 4px' }}>×</button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Adicionar evento */}
            <AddEventoForm players={playersFiltered} tiposEvento={TIPOS_EVENTO} tipoLabel={TIPO_LABEL} tipoColor={TIPO_COLOR}
              filterPos={filterPos} onFilterPos={setFilterPos} onAdd={addEvento} />
          </div>
        )}

        {/* Botão processar */}
        {jogo && (
          <button onClick={processar} disabled={processing}
            style={{ width:'100%', padding:'18px', background: processing?'#1a1a1a':'#F5C400', color: processing?'#444':'#111', fontWeight:900, fontSize:16, border:'none', borderRadius:12, cursor: processing?'not-allowed':'pointer', textTransform:'uppercase', letterSpacing:1 }}>
            {processing ? 'Processando pontuações...' : '🐯 Processar Resultado e Calcular Pontos'}
          </button>
        )}

        {/* Resultado */}
        {resultado && (
          <div style={{ marginTop:16, background: resultado.error?'rgba(248,113,113,0.1)':'rgba(74,222,128,0.1)', border: `1px solid ${resultado.error?'#f87171':'#4ade80'}`, borderRadius:12, padding:20 }}>
            {resultado.error ? (
              <div style={{ color:'#f87171', fontWeight:900 }}>❌ {resultado.error}</div>
            ) : (
              <>
                <div style={{ fontSize:16, fontWeight:900, color:'#4ade80', marginBottom:12 }}>✅ {resultado.message}</div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
                  <div style={{ background:'rgba(0,0,0,0.3)', borderRadius:8, padding:12, textAlign:'center' }}>
                    <div style={{ fontSize:24, fontWeight:900, color:'#F5C400' }}>{resultado.processados}</div>
                    <div style={{ fontSize:10, color:'#555', textTransform:'uppercase' }}>Usuários pontuados</div>
                  </div>
                  <div style={{ background:'rgba(0,0,0,0.3)', borderRadius:8, padding:12, textAlign:'center' }}>
                    <div style={{ fontSize:24, fontWeight:900, color:'#F5C400' }}>{resultado.badges_gerados}</div>
                    <div style={{ fontSize:10, color:'#555', textTransform:'uppercase' }}>Badges gerados</div>
                  </div>
                  {resultado.craque && (
                    <div style={{ background:'rgba(0,0,0,0.3)', borderRadius:8, padding:12, textAlign:'center' }}>
                      <div style={{ fontSize:14, fontWeight:900, color:'#F5C400' }}>🏆 {resultado.craque.pts} pts</div>
                      <div style={{ fontSize:10, color:'#555', textTransform:'uppercase' }}>Craque da rodada</div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

function AddEventoForm({ players, tiposEvento, tipoLabel, tipoColor, filterPos, onFilterPos, onAdd }: any) {
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);
  const [selectedTipo, setSelectedTipo] = useState('gol');

  const handleAdd = () => {
    if (!selectedPlayer) return;
    onAdd(selectedPlayer, selectedTipo);
    setSelectedPlayer(null);
  };

  const playersFiltered = players.filter((p: any) => filterPos === 'TODOS' || p.pos === filterPos);

  return (
    <div style={{ display:'grid', gap:12 }}>
      <div style={{ display:'flex', gap:6, overflowX:'auto' }}>
        {['TODOS','GOL','LAT','ZAG','MEI','ATA'].map((p: string) => (
          <button key={p} onClick={() => onFilterPos(p)}
            style={{ flexShrink:0, padding:'4px 10px', fontSize:10, fontWeight:900, textTransform:'uppercase' as const, border:'none', borderRadius:4, cursor:'pointer', background: filterPos===p?'#F5C400':'#1a1a1a', color: filterPos===p?'#111':'#555' }}>
            {p}
          </button>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:4, maxHeight:200, overflowY:'auto' }}>
        {playersFiltered.map((p: any) => (
          <button key={p.id} onClick={() => setSelectedPlayer(selectedPlayer===p.id?null:p.id)}
            style={{ padding:'6px 4px', background: selectedPlayer===p.id?'rgba(245,196,0,0.15)':'transparent', border: selectedPlayer===p.id?'1px solid #F5C400':'1px solid transparent', borderRadius:4, cursor:'pointer', textAlign:'center' as const }}>
            <div style={{ fontSize:10, fontWeight:900, color: selectedPlayer===p.id?'#F5C400':'#888', textTransform:'uppercase' as const }}>{p.name}</div>
          </button>
        ))}
      </div>

      <div style={{ display:'flex', gap:6, flexWrap:'wrap' as const }}>
        {tiposEvento.map((t: string) => (
          <button key={t} onClick={() => setSelectedTipo(t)}
            style={{ padding:'6px 12px', fontSize:11, fontWeight:900, textTransform:'uppercase' as const, border:`1px solid ${selectedTipo===t?tipoColor[t]:'#1a1a1a'}`, borderRadius:6, cursor:'pointer', background: selectedTipo===t?`${tipoColor[t]}20`:'transparent', color: selectedTipo===t?tipoColor[t]:'#555' }}>
            {tipoLabel[t]}
          </button>
        ))}
      </div>

      <button onClick={handleAdd} disabled={!selectedPlayer}
        style={{ padding:'10px', background: selectedPlayer?'#F5C400':'#1a1a1a', color: selectedPlayer?'#111':'#444', fontWeight:900, fontSize:13, border:'none', borderRadius:8, cursor: selectedPlayer?'pointer':'not-allowed', textTransform:'uppercase' as const, letterSpacing:1 }}>
        + Adicionar Evento
      </button>
    </div>
  );
}
