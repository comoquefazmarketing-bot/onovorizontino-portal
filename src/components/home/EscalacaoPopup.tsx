'use client';
import { useState, useEffect } from 'react';

const GOLD = '#F5C400';
const STORAGE_KEY = 'v14_popup_rodada8_serieB_2026';

type Time = { nome: string; escudo_url: string; sigla?: string };
type Jogo = {
  rodada: string;
  competicao: string;
  data_hora: string;
  local: string;
  mandante: Time;
  visitante: Time;
};

function formatDataCompleta(iso: string) {
  try {
    const d = new Date(iso);
    const dias = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
    const meses = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
    const hora = String(d.getHours()).padStart(2,'0');
    const min = String(d.getMinutes()).padStart(2,'0');
    return {
      diaSemana: dias[d.getDay()],
      dataFormatada: `${d.getDate()} de ${meses[d.getMonth()]}`,
      horario: `${hora}h${min === '00' ? '' : min}`,
    };
  } catch {
    return { diaSemana: '', dataFormatada: '', horario: '' };
  }
}

export default function PopupProximoJogo() {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [jogo, setJogo] = useState<Jogo | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (localStorage.getItem(STORAGE_KEY)) return;

    fetch('/api/proximo-jogo')
      .then(r => r.json())
      .then(({ jogos }) => {
        if (!jogos?.[0]) return;
        setJogo(jogos[0]);
        const t = setTimeout(() => {
          setVisible(true);
          localStorage.setItem(STORAGE_KEY, '1');
        }, 3500);
        return () => clearTimeout(t);
      })
      .catch(() => {});
  }, []);

  if (!visible || !jogo) return null;

  const close = () => {
    setClosing(true);
    setTimeout(() => setVisible(false), 350);
  };

  const { diaSemana, dataFormatada, horario } = formatDataCompleta(jogo.data_hora);
  const isNovo = (t: Time) => t.nome?.toLowerCase().includes('novorizontino');
  const adversario = isNovo(jogo.mandante) ? jogo.visitante : jogo.mandante;
  const eMandante  = isNovo(jogo.mandante);

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,900;1,900&display=swap');
        .pjp-font { font-family:'Barlow Condensed',sans-serif; text-transform:uppercase; }
        @keyframes pjp-enter {
          from { transform:translate(-50%,32px); opacity:0; }
          to   { transform:translate(-50%,0);    opacity:1; }
        }
        @keyframes pjp-exit {
          to { transform:translate(-50%,24px); opacity:0; }
        }
        .pjp-pulse { animation: pjp-dot-blink 1.2s ease-in-out infinite; }
        @keyframes pjp-dot-blink {
          0%,100% { opacity:1; } 50% { opacity:0.2; }
        }
      `}</style>

      {/* Overlay */}
      <div
        onClick={close}
        style={{
          position:'fixed', inset:0, zIndex:9998,
          background:'rgba(0,0,0,0.88)', backdropFilter:'blur(14px)',
          opacity: closing ? 0 : 1, transition:'opacity 0.35s',
        }}
      />

      {/* Card */}
      <div
        className="pjp-font"
        style={{
          position:'fixed', bottom:'8vh', left:'50%',
          zIndex:9999, width:'92%', maxWidth:420,
          background:'#070707',
          border:`2px solid ${GOLD}`,
          borderRadius:14,
          padding:'44px 24px 28px',
          boxShadow:`0 50px 120px rgba(0,0,0,0.95), 0 0 60px rgba(245,196,0,0.07)`,
          animation: closing
            ? 'pjp-exit 0.35s forwards'
            : 'pjp-enter 0.55s cubic-bezier(0.16,1,0.3,1) forwards',
        }}
      >
        {/* Fechar */}
        <button
          onClick={close}
          aria-label="Fechar"
          style={{
            position:'absolute', top:12, right:12,
            background:'rgba(255,255,255,0.06)', border:'none',
            color:'#aaa', fontSize:15, width:28, height:28,
            borderRadius:4, cursor:'pointer', lineHeight:'28px',
            transition:'color 0.2s',
          }}
        >✕</button>

        {/* Badge rodada */}
        <div style={{ marginBottom:18, display:'flex', alignItems:'center', gap:10 }}>
          <div style={{
            background:GOLD, padding:'3px 10px', borderRadius:2,
            display:'inline-flex', alignItems:'center', gap:6,
          }}>
            <span className="pjp-pulse" style={{ width:6, height:6, borderRadius:'50%', background:'#000', display:'inline-block' }} />
            <span style={{ color:'#000', fontSize:9, fontWeight:900, letterSpacing:'0.3em' }}>
              {jogo.competicao} · {jogo.rodada}
            </span>
          </div>
          <span style={{ color:'rgba(255,255,255,0.25)', fontSize:9, fontWeight:900, letterSpacing:'0.15em' }}>
            {eMandante ? 'EM CASA' : 'FORA'}
          </span>
        </div>

        {/* Headline */}
        <h2 style={{
          color:'#fff', fontSize:30, fontWeight:900, fontStyle:'italic',
          lineHeight:0.92, margin:'0 0 6px',
        }}>
          PRÓXIMO<br/>
          <span style={{ color:GOLD, fontSize:42, textShadow:`0 0 24px rgba(245,196,0,0.4)` }}>
            DUELO
          </span>
        </h2>

        {/* Data e hora */}
        <p style={{
          color:'rgba(255,255,255,0.45)', fontSize:11,
          letterSpacing:'0.15em', margin:'0 0 20px',
        }}>
          {diaSemana}, {dataFormatada} · <strong style={{ color:'rgba(255,255,255,0.7)' }}>{horario}</strong>
        </p>

        {/* Confronto */}
        <div style={{
          display:'flex', alignItems:'center', justifyContent:'center', gap:12,
          background:'rgba(255,255,255,0.025)',
          border:'1px solid rgba(255,255,255,0.07)',
          borderRadius:10, padding:'22px 10px', marginBottom:16,
        }}>
          {/* Mandante */}
          <TeamBlock time={jogo.mandante} label="MANDANTE" isNovo={isNovo(jogo.mandante)} />

          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, padding:'0 4px' }}>
            <div style={{ width:28, height:1, background:'rgba(255,255,255,0.12)' }} />
            <span style={{ fontSize:13, fontWeight:900, color:'rgba(255,255,255,0.18)' }}>VS</span>
            <div style={{ width:28, height:1, background:'rgba(255,255,255,0.12)' }} />
          </div>

          {/* Visitante */}
          <TeamBlock time={jogo.visitante} label="VISITANTE" isNovo={isNovo(jogo.visitante)} />
        </div>

        {/* Local */}
        <p style={{
          color:'rgba(255,255,255,0.3)', fontSize:10,
          textAlign:'center', letterSpacing:'0.12em', margin:'0 0 22px',
        }}>
          📍 {jogo.local}
        </p>

        {/* CTA primário */}
        <a
          href="/tigre-fc"
          style={{
            display:'block', background:GOLD, color:'#000',
            padding:'20px', textAlign:'center',
            fontSize:17, fontWeight:900, fontStyle:'italic',
            textDecoration:'none', borderRadius:6,
            letterSpacing:'0.04em',
            boxShadow:`0 10px 32px rgba(245,196,0,0.28)`,
            transition:'filter 0.2s, transform 0.15s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.filter='brightness(1.1)'; (e.currentTarget as HTMLElement).style.transform='translateY(-1px)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.filter='brightness(1)'; (e.currentTarget as HTMLElement).style.transform='translateY(0)'; }}
        >
          MONTE SUA ESCALAÇÃO IDEAL →
        </a>

        {/* Link secundário */}
        <a
          href="/tabela"
          style={{
            display:'block', textAlign:'center', marginTop:12,
            color:'rgba(255,255,255,0.3)', fontSize:10,
            letterSpacing:'0.15em', textDecoration:'none',
            transition:'color 0.2s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color=GOLD; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color='rgba(255,255,255,0.3)'; }}
        >
          VER TABELA DE CLASSIFICAÇÃO →
        </a>

        {/* Borda decorativa inferior */}
        <div style={{
          position:'absolute', bottom:0, left:0, right:0, height:2,
          background:`linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
          borderRadius:'0 0 14px 14px',
        }} />
      </div>
    </>
  );
}

function TeamBlock({ time, label, isNovo }: { time: Time; label: string; isNovo: boolean }) {
  const escudo = time.escudo_url ||
    'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png';

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
      <div style={{
        width:72, height:72,
        display:'flex', alignItems:'center', justifyContent:'center',
        filter: isNovo
          ? `drop-shadow(0 0 12px rgba(245,196,0,0.5))`
          : `drop-shadow(0 4px 8px rgba(0,0,0,0.4))`,
      }}>
        <img
          src={escudo}
          alt={time.nome}
          style={{ width:'100%', height:'100%', objectFit:'contain' }}
          onError={e => { (e.currentTarget as HTMLImageElement).style.display='none'; }}
        />
      </div>
      <span style={{
        fontSize:9, fontWeight:900, letterSpacing:'0.1em',
        color: isNovo ? GOLD : 'rgba(255,255,255,0.4)',
        textAlign:'center', lineHeight:1.2,
      }}>
        {label}
      </span>
    </div>
  );
}
