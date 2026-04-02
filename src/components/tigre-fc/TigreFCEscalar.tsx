'use client';

import { useState, useMemo, useEffect, useRef, use } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- CONFIGURAÇÃO E CONSTANTES ---
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);

const LOGO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/tigre-fc-logo.png';
const BASE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';
const MINUTOS_TRAVA = 90; // Mercado fecha 1h30 antes do jogo

// --- BANCO DE DADOS DE JOGADORES COMPLETO ---
interface Player {
  id: number;
  name: string;
  short: string;
  num: number;
  pos: 'GOL' | 'LAT' | 'ZAG' | 'MEI' | 'ATA';
  foto: string;
}

const PLAYERS: Player[] = [
  { id: 1,  name: 'César Augusto',   short: 'César',      num: 31, pos: 'GOL', foto: BASE+'CESAR-AUGUSTO.jpg.webp' },
  { id: 2,  name: 'Jordi',             short: 'Jordi',      num: 93, pos: 'GOL', foto: BASE+'JORDI.jpg.webp' },
  { id: 3,  name: 'João Scapin',       short: 'Scapin',      num: 12, pos: 'GOL', foto: BASE+'JOAO-SCAPIN.jpg.webp' },
  { id: 4,  name: 'Lucas Ribeiro',     short: 'Lucas',      num: 1,  pos: 'GOL', foto: BASE+'LUCAS-RIBEIRO.jpg.webp' },
  { id: 5,  name: 'Lora',               short: 'Lora',        num: 2,  pos: 'LAT', foto: BASE+'LORA.jpg.webp' },
  { id: 6,  name: 'Castrillón',        short: 'Castrillón', num: 6,  pos: 'LAT', foto: BASE+'CASTRILLON.jpg.webp' },
  { id: 7,  name: 'Arthur Barbosa',  short: 'A.Barbosa',  num: 22, pos: 'LAT', foto: BASE+'ARTHUR-BARBOSA.jpg.webp' },
  { id: 8,  name: 'Sander',             short: 'Sander',      num: 33, pos: 'LAT', foto: BASE+'SANDER.jpg.webp' },
  { id: 9,  name: 'Maykon Jesus',      short: 'Maykon',      num: 27, pos: 'LAT', foto: BASE+'MAYKON-JESUS.jpg.webp' },
  { id: 10, name: 'Dantas',             short: 'Dantas',      num: 3,  pos: 'ZAG', foto: BASE+'DANTAAS.jpg.webp' },
  { id: 11, name: 'Eduardo Brock',   short: 'E.Brock',     num: 5,  pos: 'ZAG', foto: BASE+'EDUARDO-BROCK.jpg.webp' },
  { id: 12, name: 'Patrick',         short: 'Patrick',     num: 4,  pos: 'ZAG', foto: BASE+'PATRICK.jpg.webp' },
  { id: 13, name: 'Gabriel Bahia',   short: 'G.Bahia',     num: 14, pos: 'ZAG', foto: BASE+'GABRIEL-BAHIA.jpg.webp' },
  { id: 14, name: 'Carlinhos',       short: 'Carlinhos',   num: 25, pos: 'ZAG', foto: BASE+'CARLINHOS.jpg.webp' },
  { id: 15, name: 'Alemão',          short: 'Alemão',      num: 28, pos: 'ZAG', foto: BASE+'ALEMAO.jpg.webp' },
  { id: 16, name: 'Renato Palm',     short: 'R.Palm',      num: 24, pos: 'ZAG', foto: BASE+'RENATO-PALM.jpg.webp' },
  { id: 17, name: 'Alvariño',        short: 'Alvariño',    num: 35, pos: 'ZAG', foto: BASE+'IVAN-ALVARINO.jpg.webp' },
  { id: 18, name: 'Bruno Santana',   short: 'B.Santana',   num: 33, pos: 'ZAG', foto: BASE+'BRUNO-SANTANA.jpg.webp' },
  { id: 19, name: 'Luís Oyama',      short: 'Oyama',       num: 8,  pos: 'MEI', foto: BASE+'LUIS-OYAMA.jpg.webp' },
  { id: 20, name: 'Léo Naldi',       short: 'L.Naldi',     num: 7,  pos: 'MEI', foto: BASE+'LEO-NALDI.jpg.webp' },
  { id: 21, name: 'Rômulo',          short: 'Rômulo',      num: 10, pos: 'MEI', foto: BASE+'ROMULO.jpg.webp' },
  { id: 22, name: 'Matheus Bianqui', short: 'Bianqui',     num: 11, pos: 'MEI', foto: BASE+'MATHEUS-BIANQUI.jpg.webp' },
  { id: 23, name: 'Juninho',         short: 'Juninho',     num: 20, pos: 'MEI', foto: BASE+'JUNINHO.jpg.webp' },
  { id: 24, name: 'Tavinho',         short: 'Tavinho',     num: 17, pos: 'MEI', foto: BASE+'TAVINHO.jpg.webp' },
  { id: 25, name: 'Diego Galo',      short: 'D.Galo',      num: 29, pos: 'MEI', foto: BASE+'DIEGO-GALO.jpg.webp' },
  { id: 26, name: 'Marlon',          short: 'Marlon',      num: 30, pos: 'MEI', foto: BASE+'MARLON.jpg.webp' },
  { id: 27, name: 'Hector Bianchi',  short: 'Hector',      num: 16, pos: 'MEI', foto: BASE+'HECTOR-BIACHI.jpg.webp' },
  { id: 28, name: 'Nogueira',        short: 'Nogueira',    num: 36, pos: 'MEI', foto: BASE+'NOGUEIRA.jpg.webp' },
  { id: 29, name: 'Luiz Gabriel',    short: 'L.Gabriel',   num: 37, pos: 'MEI', foto: BASE+'LUIZ-GABRIEL.jpg.webp' },
  { id: 30, name: 'Jhones Kauê',     short: 'J.Kauê',      num: 50, pos: 'MEI', foto: BASE+'JHONES-KAUE.jpg.webp' },
  { id: 31, name: 'Robson',          short: 'Robson',      num: 9,  pos: 'ATA', foto: BASE+'ROBSON.jpg.webp' },
  { id: 32, name: 'Vinícius Paiva',  short: 'V.Paiva',     num: 13, pos: 'ATA', foto: BASE+'VINICIUS-PAIVA.jpg.webp' },
  { id: 33, name: 'Hélio Borges',    short: 'H.Borges',    num: 18, pos: 'ATA', foto: BASE+'HELIO-BORGES.jpg.webp' },
  { id: 34, name: 'Jardiel',         short: 'Jardiel',     num: 19, pos: 'ATA', foto: BASE+'JARDIEL.jpg.webp' },
  { id: 35, name: 'Nicolas Careca',  short: 'N.Careca',    num: 21, pos: 'ATA', foto: BASE+'NICOLAS-CARECA.jpg.webp' },
  { id: 36, name: 'Titi Ortiz',      short: 'T.Ortiz',     num: 15, pos: 'ATA', foto: BASE+'TITI-ORTIZ.jpg.webp' },
  { id: 37, name: 'Diego Mathias',   short: 'D.Mathias',   num: 41, pos: 'ATA', foto: BASE+'DIEGO-MATHIAS.jpg.webp' },
  { id: 38, name: 'Carlão',          short: 'Carlão',      num: 90, pos: 'ATA', foto: BASE+'CARLAO.jpg.webp' },
  { id: 39, name: 'Ronald Barcellos', short: 'Ronald',      num: 23, pos: 'ATA', foto: BASE+'RONALD-BARCELLOS.jpg.webp' },
];

const FORMATIONS: Record<string, { id: string; pos: string; x: number; y: number }[]> = {
  '4-3-3': [
    { id:'gk', pos:'GOL', x:50, y:88 }, { id:'rb', pos:'LAT', x:82, y:68 }, { id:'cb1', pos:'ZAG', x:62, y:75 }, { id:'cb2', pos:'ZAG', x:38, y:75 }, { id:'lb', pos:'LAT', x:18, y:68 },
    { id:'cm1', pos:'MEI', x:75, y:48 }, { id:'cm2', pos:'MEI', x:50, y:52 }, { id:'cm3', pos:'MEI', x:25, y:48 },
    { id:'rw', pos:'ATA', x:80, y:20 }, { id:'st', pos:'ATA', x:50, y:12 }, { id:'lw', pos:'ATA', x:20, y:20 }
  ],
  '4-4-2': [
    { id:'gk', pos:'GOL', x:50, y:88 }, { id:'rb', pos:'LAT', x:82, y:68 }, { id:'cb1', pos:'ZAG', x:62, y:75 }, { id:'cb2', pos:'ZAG', x:38, y:75 }, { id:'lb', pos:'LAT', x:18, y:68 },
    { id:'rm', pos:'MEI', x:82, y:45 }, { id:'cm1', pos:'MEI', x:60, y:50 }, { id:'cm2', pos:'MEI', x:40, y:50 }, { id:'lm', pos:'MEI', x:18, y:45 },
    { id:'st1', pos:'ATA', x:65, y:18 }, { id:'st2', pos:'ATA', x:35, y:18 }
  ],
  '3-5-2': [
    { id:'gk', pos:'GOL', x:50, y:88 }, { id:'cb1', pos:'ZAG', x:70, y:75 }, { id:'cb2', pos:'ZAG', x:50, y:75 }, { id:'cb3', pos:'ZAG', x:30, y:75 },
    { id:'rm', pos:'MEI', x:85, y:48 }, { id:'cm1', pos:'MEI', x:65, y:52 }, { id:'cm2', pos:'MEI', x:50, y:55 }, { id:'cm3', pos:'MEI', x:35, y:52 }, { id:'lm', pos:'MEI', x:15, y:48 },
    { id:'st1', pos:'ATA', x:60, y:18 }, { id:'st2', pos:'ATA', x:40, y:18 }
  ]
};

// --- COMPONENTES ATÔMICOS ---

function PlayerCard({ player, size, isSelected, status, onClick }: any) {
  return (
    <div className={`card-wrapper ${isSelected ? 'selected' : ''}`} onClick={onClick} style={{ width: size }}>
      <div className={`card-body ${status}`}>
        <div className="photo-container">
          <div className="photo-sprite" style={{ backgroundImage: `url(${player.foto})` }} />
        </div>
        <div className="card-info">
          <span className="player-num">{player.num}</span>
          <span className="player-name">{player.short}</span>
        </div>
        {status === 'cap' && <div className="status-badge cap">C</div>}
        {status === 'hero' && <div className="status-badge hero">H</div>}
      </div>
      <style jsx>{`
        .card-wrapper { cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); position: relative; }
        .card-wrapper:active { transform: scale(0.92); }
        .card-body { 
          position: relative; width: 100%; height: 95px; background: #111; 
          border-radius: 8px; overflow: hidden; border: 1px solid #333;
          display: flex; flex-direction: column;
        }
        .photo-container { flex: 1; position: relative; overflow: hidden; background: radial-gradient(circle, #222 0%, #000 100%); }
        .photo-sprite { width: 200%; height: 100%; background-size: contain; background-repeat: no-repeat; background-position: left bottom; transition: 0.2s; }
        .card-wrapper:hover .photo-sprite, .selected .photo-sprite { animation: player-gif 0.8s infinite steps(1); }
        @keyframes player-gif { 0%, 100% { background-position: left bottom; } 50% { background-position: right bottom; } }
        .card-info { background: #000; padding: 4px 2px; text-align: center; border-top: 1px solid #222; }
        .player-num { display: block; color: #F5C400; font-size: 10px; font-weight: 1000; line-height: 1; }
        .player-name { color: #fff; font-size: 8px; text-transform: uppercase; font-weight: 800; white-space: nowrap; }
        .selected .card-body { border-color: #F5C400; box-shadow: 0 0 15px rgba(245,196,0,0.3); }
        .cap { border: 2px solid #F5C400 !important; }
        .hero { border: 2px solid #00E5FF !important; }
        .status-badge { position: absolute; top: 2px; right: 2px; width: 18px; height: 18px; border-radius: 50%; font-size: 10px; font-weight: 1000; display: flex; align-items: center; justify-content: center; z-index: 5; box-shadow: 0 2px 5px rgba(0,0,0,0.5); }
        .status-badge.cap { background: #F5C400; color: #000; }
        .status-badge.hero { background: #00E5FF; color: #000; }
      `}</style>
    </div>
  );
}

// --- PÁGINA PRINCIPAL ---

export default function TigreFCFullFantasy({ params }: { params: Promise<{ jogoId: string }> }) {
  const resolvedParams = use(params);
  
  // Estados de UI e Lógica
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<'login' | 'escalar' | 'capitao' | 'heroi' | 'palpite' | 'share'>('login');
  const [formationKey, setFormationKey] = useState('4-3-3');
  const [lineup, setLineup] = useState<Record<string, Player | null>>({});
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const [filterPos, setFilterPos] = useState<'TODOS' | 'GOL' | 'ZAG' | 'LAT' | 'MEI' | 'ATA'>('TODOS');
  const [capitao, setCapitao] = useState<number | null>(null);
  const [heroi, setHeroi] = useState<number | null>(null);
  const [palpite, setPalpite] = useState({ home: 0, away: 0 });
  const [saving, setSaving] = useState(false);
  const [mercadoAberto, setMercadoAberto] = useState(true);
  const [gameData, setGameData] = useState<any>(null);

  // Inicialização e Verificação de Sessão
  useEffect(() => {
    setMounted(true);
    checkUser();
    fetchGameDetails();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      setUser(session.user);
      setStep('escalar');
      loadExistingEscalacao(session.user.id);
    }
  };

  const fetchGameDetails = async () => {
    const { data } = await supabase.from('jogos').select('*').eq('id', resolvedParams.jogoId).single();
    if (data) {
      setGameData(data);
      const gameTime = new Date(data.data_hora).getTime();
      const now = new Date().getTime();
      if (now > (gameTime - MINUTOS_TRAVA * 60000)) {
        setMercadoAberto(false);
      }
    }
  };

  const loadExistingEscalacao = async (userId: string) => {
    const { data } = await supabase
      .from('escalacoes')
      .select('*')
      .eq('user_id', userId)
      .eq('jogo_id', resolvedParams.jogoId)
      .single();

    if (data) {
      setPalpite({ home: data.palpite_home, away: data.palpite_away });
      setCapitao(data.capitao_id);
      setHeroi(data.heroi_id);
      // Mapear IDs de volta para o objeto lineup (simplificado para o exemplo)
      const restoredLineup: any = {};
      data.jogadores.forEach((id: number, index: number) => {
        const player = PLAYERS.find(p => p.id === id);
        const slotId = FORMATIONS[formationKey][index]?.id;
        if (player && slotId) restoredLineup[slotId] = player;
      });
      setLineup(restoredLineup);
    }
  };

  // Lógica de Escalação
  const usedIds = useMemo(() => 
    Object.values(lineup).filter((p): p is Player => p !== null).map(p => p.id), 
  [lineup]);

  const filledCount = usedIds.length;

  const filteredPlayers = useMemo(() => {
    return filterPos === 'TODOS' ? PLAYERS : PLAYERS.filter(p => p.pos === filterPos);
  }, [filterPos]);

  const togglePlayer = (p: Player) => {
    if (!mercadoAberto) return;
    const isAlreadySelected = usedIds.includes(p.id);

    if (isAlreadySelected) {
      const entry = Object.entries(lineup).find(([_, player]) => player?.id === p.id);
      if (entry) {
        setLineup(prev => ({ ...prev, [entry[0]]: null }));
        if (p.id === capitao) setCapitao(null);
        if (p.id === heroi) setHeroi(null);
      }
    } else {
      const targetSlot = activeSlot || FORMATIONS[formationKey].find(s => s.pos === p.pos && !lineup[s.id])?.id;
      if (targetSlot) {
        setLineup(prev => ({ ...prev, [targetSlot]: p }));
        setActiveSlot(null);
      }
    }
  };

  const handleSalvar = async () => {
    if (!user) return setStep('login');
    setSaving(true);
    try {
      const payload = {
        user_id: user.id,
        jogo_id: parseInt(resolvedParams.jogoId),
        jogadores: usedIds,
        capitao_id: capitao,
        heroi_id: heroi,
        palpite_home: palpite.home,
        palpite_away: palpite.away,
        updated_at: new Date()
      };

      const { error } = await supabase.from('escalacoes').upsert(payload);
      if (error) throw error;
      setStep('share');
    } catch (err) {
      alert("Erro ao salvar sua elite. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  if (!mounted) return null;

  return (
    <main className="app-container">
      {/* HEADER DINÂMICO */}
      <header className="main-header">
        <div className="header-content">
          <img src={LOGO} className="logo" alt="Tigre FC" />
          <div className="game-info">
            <span className="game-label">{gameData ? `${gameData.mandante} x ${gameData.visitante}` : 'CARREGANDO JOGO...'}</span>
            <div className={`market-badge ${mercadoAberto ? 'open' : 'closed'}`}>
              {mercadoAberto ? 'MERCADO ABERTO' : 'MERCADO FECHADO'}
            </div>
          </div>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(['login','escalar','capitao','heroi','palpite','share'].indexOf(step) / 5) * 100}%` }} />
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL (SCROLLABLE) */}
      <div className="scroll-content">
        
        {/* O CAMPO - SEMPRE VISÍVEL NO TOPO DURANTE ESCALAÇÃO */}
        <section className="field-section">
          <div className="field-container">
            <div className="grass">
              {FORMATIONS[formationKey].map(slot => {
                const p = lineup[slot.id];
                return (
                  <div key={slot.id} className="slot-wrapper" style={{ left: `${slot.x}%`, top: `${slot.y}%` }}>
                    {p ? (
                      <PlayerCard 
                        player={p} 
                        size={52} 
                        status={capitao === p.id ? 'cap' : heroi === p.id ? 'hero' : ''} 
                        isSelected 
                        onClick={() => {
                          if (step === 'escalar') togglePlayer(p);
                          if (step === 'capitao') setCapitao(p.id);
                          if (step === 'heroi') setHeroi(p.id);
                        }}
                      />
                    ) : (
                      <button 
                        className={`empty-slot ${activeSlot === slot.id ? 'active' : ''}`}
                        onClick={() => { setActiveSlot(slot.id); setFilterPos(slot.pos as any); }}
                      >
                        <span className="slot-pos">{slot.pos}</span>
                        <div className="plus-icon">+</div>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ÁREA DE SELEÇÃO / MERCADO */}
        {step === 'escalar' && (
          <section className="market-drawer">
            <div className="drawer-header">
              <div className="formation-selector">
                {Object.keys(FORMATIONS).map(f => (
                  <button key={f} className={formationKey === f ? 'active' : ''} onClick={() => { setFormationKey(f); setLineup({}); }}>{f}</button>
                ))}
              </div>
              <div className="pos-filters">
                {['TODOS', 'GOL', 'ZAG', 'LAT', 'MEI', 'ATA'].map(pos => (
                  <button key={pos} className={filterPos === pos ? 'active' : ''} onClick={() => setFilterPos(pos as any)}>{pos}</button>
                ))}
              </div>
            </div>
            <div className="players-list">
              {filteredPlayers.map(p => (
                <PlayerCard 
                  key={p.id} 
                  player={p} 
                  size={'100%'} 
                  isSelected={usedIds.includes(p.id)} 
                  onClick={() => togglePlayer(p)} 
                />
              ))}
            </div>
          </section>
        )}

        {/* PASSOS DE DECISÃO */}
        {(step === 'capitao' || step === 'heroi') && (
          <div className="decision-overlay">
            <div className="instruction-card">
              <h2>{step === 'capitao' ? 'ESCOLHA O CAPITÃO' : 'ESCOLHA O HERÓI'}</h2>
              <p>{step === 'capitao' ? 'O capitão pontua dobrado!' : 'O herói ganha bônus de mística!'}</p>
            </div>
          </div>
        )}

        {/* PALPITE DE PLACAR */}
        {step === 'palpite' && (
          <div className="palpite-container">
            <div className="score-board">
              <div className="team">
                <span className="team-name">NOVORIZONTINO</span>
                <input type="number" value={palpite.home} onChange={e => setPalpite({...palpite, home: +e.target.value})} />
              </div>
              <div className="vs">X</div>
              <div className="team">
                <span className="team-name">VISITANTE</span>
                <input type="number" value={palpite.away} onChange={e => setPalpite({...palpite, away: +e.target.value})} />
              </div>
            </div>
          </div>
        )}

        {/* FINALIZADO / SHARE */}
        {step === 'share' && (
          <div className="success-screen">
            <div className="success-card">
              <div className="check-icon">✓</div>
              <h1>TIME CONFIRMADO!</h1>
              <p>Sua escalação para o jogo {resolvedParams.jogoId} está garantida na base de dados.</p>
              <button className="share-wa" onClick={() => window.open(`https://wa.me/?text=Escalei meu time no Tigre FC! Veja se consegue me bater!`)}>
                CONVIDAR AMIGOS NO WHATSAPP
              </button>
              <button className="reset-btn" onClick={() => window.location.reload()}>REVISAR ESCALAÇÃO</button>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER DE AÇÃO FIXO */}
      {step !== 'share' && (
        <footer className="footer-actions">
          <div className="footer-content">
            {step !== 'escalar' && step !== 'login' && (
              <button className="btn-secondary" onClick={() => {
                if (step === 'capitao') setStep('escalar');
                if (step === 'heroi') setStep('capitao');
                if (step === 'palpite') setStep('heroi');
              }}>VOLTAR</button>
            )}
            
            <button 
              className="btn-primary"
              disabled={saving || !mercadoAberto || (step === 'escalar' && filledCount < 11) || (step === 'capitao' && !capitao) || (step === 'heroi' && !heroi)}
              onClick={() => {
                if (step === 'escalar') setStep('capitao');
                else if (step === 'capitao') setStep('heroi');
                else if (step === 'heroi') setStep('palpite');
                else if (step === 'palpite') handleSalvar();
              }}
            >
              {saving ? 'PROCESSANDO...' : 
               !mercadoAberto ? 'MERCADO FECHADO' :
               step === 'escalar' ? (filledCount < 11 ? `FALTAM ${11 - filledCount}` : 'DEFINIR CAPITÃO →') :
               step === 'palpite' ? 'CONFIRMAR ELITE 🐯' : 'PRÓXIMO →'}
            </button>
          </div>
        </footer>
      )}

      <style jsx global>{`
        :root { --gold: #F5C400; --dark: #000; --card-bg: #0a0a0a; --hero-blue: #00E5FF; }
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        body { margin: 0; background: var(--dark); color: #fff; font-family: 'Inter', system-ui, sans-serif; overflow-x: hidden; }
        
        .app-container { display: flex; flex-direction: column; height: 100vh; }
        
        /* HEADER */
        .main-header { background: rgba(0,0,0,0.95); backdrop-filter: blur(10px); z-index: 100; border-bottom: 1px solid #111; }
        .header-content { padding: 12px 20px; display: flex; justify-content: space-between; align-items: center; }
        .logo { height: 28px; }
        .game-info { text-align: right; }
        .game-label { font-size: 10px; color: #888; font-weight: 800; display: block; }
        .market-badge { font-size: 9px; font-weight: 1000; padding: 2px 6px; border-radius: 4px; display: inline-block; margin-top: 2px; }
        .market-badge.open { background: #25D366; color: #000; }
        .market-badge.closed { background: #ff4444; color: #fff; }
        .progress-bar { height: 3px; background: #111; width: 100%; }
        .progress-fill { height: 100%; background: var(--gold); transition: width 0.5s ease; box-shadow: 0 0 10px var(--gold); }

        /* SCROLL AREA */
        .scroll-content { flex: 1; overflow-y: auto; padding-bottom: 100px; }

        /* FIELD */
        .field-section { padding: 15px; perspective: 1000px; }
        .field-container { 
          width: 100%; max-width: 450px; margin: 0 auto; aspect-ratio: 1/1.1;
          background: #1a4a1a; border-radius: 12px; position: relative;
          border: 3px solid rgba(255,255,255,0.1); overflow: hidden;
          box-shadow: inset 0 0 50px rgba(0,0,0,0.5);
        }
        .grass {
          width: 100%; height: 100%; position: relative;
          background-image: 
            linear-gradient(rgba(255,255,255,0.05) 2px, transparent 2px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 2px, transparent 2px);
          background-size: 20% 20%;
        }
        .slot-wrapper { position: absolute; transform: translate(-50%, -50%); z-index: 10; transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .empty-slot {
          width: 40px; height: 40px; border-radius: 50%; border: 2px dashed var(--gold);
          background: rgba(0,0,0,0.4); display: flex; flex-direction: column; align-items: center; justify-content: center;
          cursor: pointer; transition: 0.3s;
        }
        .empty-slot.active { background: var(--gold); transform: scale(1.1); border-style: solid; }
        .slot-pos { font-size: 8px; font-weight: 1000; color: var(--gold); }
        .empty-slot.active .slot-pos { color: #000; }
        .plus-icon { font-size: 14px; font-weight: 1000; color: var(--gold); line-height: 1; }
        .empty-slot.active .plus-icon { color: #000; }

        /* MARKET DRAWER */
        .market-drawer { background: #0a0a0a; border-top: 2px solid #111; padding: 20px; border-radius: 24px 24px 0 0; }
        .drawer-header { margin-bottom: 20px; }
        .formation-selector, .pos-filters { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 10px; margin-bottom: 10px; }
        .formation-selector button, .pos-filters button {
          white-space: nowrap; padding: 8px 16px; border-radius: 8px; border: 1px solid #222;
          background: #111; color: #666; font-size: 11px; font-weight: 800; transition: 0.2s;
        }
        .formation-selector button.active, .pos-filters button.active { background: var(--gold); color: #000; border-color: var(--gold); }
        .players-list { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }

        /* DECISION OVERLAY */
        .decision-overlay { padding: 20px; text-align: center; }
        .instruction-card { background: #111; padding: 20px; border-radius: 16px; border-left: 4px solid var(--gold); }
        .instruction-card h2 { color: var(--gold); margin: 0; font-size: 18px; font-weight: 1000; }
        .instruction-card p { color: #666; margin: 5px 0 0; font-size: 12px; }

        /* PALPITE */
        .score-board { display: flex; align-items: center; justify-content: center; gap: 20px; padding: 40px 0; }
        .team { text-align: center; }
        .team-name { display: block; font-size: 10px; font-weight: 900; color: #555; margin-bottom: 10px; }
        .score-board input {
          width: 70px; height: 80px; background: #111; border: 2px solid #222; border-radius: 16px;
          color: #fff; text-align: center; font-size: 32px; font-weight: 1000;
        }
        .vs { font-size: 24px; font-weight: 1000; color: var(--gold); }

        /* FOOTER */
        .footer-actions { position: fixed; bottom: 0; width: 100%; background: linear-gradient(transparent, #000 30%); padding: 20px; z-index: 200; }
        .footer-content { max-width: 500px; margin: 0 auto; display: flex; gap: 12px; }
        .btn-primary { 
          flex: 2; padding: 18px; border-radius: 14px; border: none; font-weight: 1000; text-transform: uppercase;
          background: var(--gold); color: #000; cursor: pointer; box-shadow: 0 4px 15px rgba(245,196,0,0.3);
        }
        .btn-primary:disabled { background: #222; color: #444; box-shadow: none; cursor: not-allowed; }
        .btn-secondary { flex: 1; padding: 18px; border-radius: 14px; border: 1px solid #333; background: #000; color: #fff; font-weight: 800; }

        /* SUCCESS SCREEN */
        .success-screen { padding: 40px 20px; animation: slideUp 0.5s ease; }
        .success-card { background: #111; border: 2px solid var(--gold); padding: 40px 20px; border-radius: 30px; text-align: center; }
        .check-icon { width: 60px; height: 60px; background: var(--gold); color: #000; border-radius: 50%; font-size: 30px; line-height: 60px; margin: 0 auto 20px; font-weight: 1000; }
        .share-wa { width: 100%; padding: 18px; background: #25D366; color: #fff; border: none; border-radius: 12px; font-weight: 1000; margin-bottom: 12px; cursor: pointer; }
        .reset-btn { background: transparent; border: none; color: var(--gold); font-weight: 800; cursor: pointer; }

        @keyframes slideUp { from { transform: translateY(50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </main>
  );
}
