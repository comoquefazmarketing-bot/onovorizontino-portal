'use client';
import Link from 'next/link';
import { useState } from 'react';

const TIGRE_FC_LOGO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/tigre-fc-logo.png';

const faqs = [
  ['É de graça?','Sim, 100% gratuito. Não tem nada pra pagar, sem assinatura, sem compra dentro do jogo. Entra e joga.'],
  ['Precisa saber muito de futebol?','Não precisa ser nenhum especialista. Se você acompanha o Tigre e sabe mais ou menos quem joga bem, já dá pra competir.'],
  ['Posso mudar minha escalação depois?','Pode! Você altera até o apito inicial. Depois que o jogo começa, fica travada.'],
  ['O que é o capitão?','O capitão tem os pontos dobrados. Se ele faz um gol (+8), você recebe +16. Escolha com cuidado!'],
  ['Tem prêmio pra quem ganhar?','O campeão de cada rodada ganha destaque no portal e badge exclusivo. Em breve, prêmios físicos também!'],
  ['Posso jogar com meus amigos?','Em breve! As ligas privadas chegam na fase 2. Você cria uma liga com código e compete só com a galera do grupo.'],
];

const steps = [
  ['01','Entra com o Google','Um clique só. Sem senha pra criar, sem formulário chato. Entra com sua conta do Google e escolhe seu apelido de torcedor.'],
  ['02','Monta sua escalação','Escolhe 11 jogadores do Novorizontino. Arrasta pro campo, define a formação e arma o time do jeito que você acha certo.'],
  ['03','Define o capitão','O capitão tem os pontos dobrados. Escolheu o Oyama e ele fez um golaço? Seus pontos vão lá em cima.'],
  ['04','Aponta o herói','Quem vai brilhar hoje? Acertou o herói real da partida? São +10 pontos garantidos direto na sua conta.'],
  ['05','Crava o placar','Acertou o placar exato? +15 pts. Acertou só quem ganhou? +5 pts. Quanto mais certeiro, mais alto você sobe.'],
  ['06','Sobe no ranking','Quanto melhor o Tigre jogar, mais você pontua. Acompanha o ranking ao vivo e prova quem é o melhor torcedor.'],
];

const pontos: [string, string, string][] = [
  ['Gol marcado','+8','p'],['Assistência','+5','p'],
  ['Titular 60+ min','+2','p'],['Sem tomar gol','+5','p'],
  ['Placar exato','+15','p'],['Resultado certo','+5','p'],
  ['Herói da partida','+10','p'],['Capitão','×2','m'],
  ['Cartão amarelo','-2','n'],['Cartão vermelho','-5','n'],
];

const niveis = [
  ['🌱','Novato','0–99 pts'],
  ['⚡','Fiel','100–299'],
  ['🔥','Garra','300–599'],
  ['🐯','Lenda','600+ pts'],
];

const badges = ['Craque da Rodada','Hat-trick','Streak 3 jogos','Cravou o Placar','Tigre do Vale','Pódio Top 3','Herói Certeiro','Garra Total'];

export default function TigreFCSobre() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeLevel, setActiveLevel] = useState(3);

  const toggleFaq = (i: number) => setOpenFaq(openFaq === i ? null : i);

  return (
    <main style={{ background: '#080808', minHeight: '100vh', fontFamily: "'Barlow', system-ui, sans-serif", color: '#fff' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,700;0,900;1,900&family=Barlow:wght@400;500&display=swap');
        @keyframes float{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-12px) rotate(2deg)}}
        @keyframes scanH{0%{top:-2px}100%{top:100%}}
        @keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
        @keyframes glow{0%,100%{box-shadow:0 0 20px rgba(245,196,0,.3)}50%{box-shadow:0 0 40px rgba(245,196,0,.7)}}
        @keyframes particleFloat{0%{transform:translateY(0);opacity:.6}100%{transform:translateY(-120px);opacity:0}}
        .bc{font-family:'Barlow Condensed',sans-serif}
        .hero-logo{animation:float 4s ease-in-out infinite;filter:drop-shadow(0 0 30px rgba(245,196,0,.5))}
        .hero-scan{position:absolute;left:0;right:0;height:1px;background:rgba(245,196,0,.15);animation:scanH 6s linear infinite;pointer-events:none}
        .cta-btn::after{content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;background:rgba(255,255,255,.3);transform:skewX(-20deg);animation:shimmer 3s ease-in-out 2s infinite}
        .step-row{transition:background .2s;cursor:default}
        .step-row::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:#F5C400;transform:scaleY(0);transform-origin:bottom;transition:transform .4s}
        .step-row:hover{background:#0c0c0c}.step-row:hover::before{transform:scaleY(1)}
        .step-n{transition:color .3s}.step-row:hover .step-n{color:#F5C400 !important}
        .step-row:hover .step-desc{color:#888 !important}
        .pt-row{transition:background .2s}.pt-row:hover{background:#0f0f0f}
        .lvl-card{transition:all .3s;cursor:default}
        .bdg{transition:all .3s;cursor:default}.bdg:hover{border-color:#F5C400 !important;color:#F5C400 !important;background:#1a1200 !important}
        .faq-a{max-height:0;overflow:hidden;transition:max-height .4s ease,padding .4s ease}
        .faq-open .faq-a{max-height:200px;padding:0 24px 20px !important}
        .faq-q-text{transition:color .2s}.faq-q-text:hover{color:#fff}
        .faq-open .faq-q-text{color:#F5C400 !important}
      `}</style>

      {/* HERO */}
      <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'60px 20px', position:'relative', background:'radial-gradient(ellipse 80% 60% at 50% 40%,#1a1200 0%,#080808 70%)', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(245,196,0,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(245,196,0,.03) 1px,transparent 1px)', backgroundSize:'60px 60px', pointerEvents:'none' }} />
        <div className="hero-scan" />

        <div className="bc" style={{ fontSize:11, fontWeight:700, letterSpacing:6, color:'#F5C400', textTransform:'uppercase', opacity:.7, marginBottom:12 }}>
          Fantasy League · Novorizontino · Série B 2026
        </div>
        <img src={TIGRE_FC_LOGO} className="hero-logo" alt="Tigre FC" style={{ width:100, height:100, objectFit:'contain', margin:'0 0 20px' }} />
        <h1 className="bc" style={{ fontSize:'clamp(64px,16vw,140px)', fontWeight:900, fontStyle:'italic', textTransform:'uppercase', letterSpacing:-3, lineHeight:.85, animation:'fadeUp .8s .5s both', color:'#fff' }}>
          <span style={{ WebkitTextStroke:'2px rgba(255,255,255,.15)', color:'transparent' }}>ENTRA</span><br/>
          NO <span style={{ color:'#F5C400' }}>JOGO</span>
        </h1>
        <p style={{ fontSize:15, color:'#666', maxWidth:360, lineHeight:1.6, margin:'20px auto 0' }}>
          Monta o time do Tigre, crava o placar e prova pra galera quem manja mais de futebol.
        </p>
        <Link href="/tigre-fc" className="cta-btn" style={{ marginTop:36, display:'inline-flex', alignItems:'center', gap:12, background:'#F5C400', color:'#111', fontSize:14, fontWeight:900, letterSpacing:3, textTransform:'uppercase', padding:'16px 36px', borderRadius:4, textDecoration:'none', animation:'glow 2s ease-in-out 2s infinite', position:'relative', overflow:'hidden' }}>
          <img src={TIGRE_FC_LOGO} style={{ width:22, height:22, objectFit:'contain' }} />
          Jogar agora — grátis
        </Link>
        <div style={{ position:'absolute', bottom:30, left:'50%', transform:'translateX(-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:8, opacity:.4 }}>
          <span className="bc" style={{ fontSize:9, letterSpacing:4, textTransform:'uppercase', color:'#555' }}>scroll</span>
          <div style={{ width:1, height:40, background:'linear-gradient(to bottom,transparent,#F5C400)' }} />
        </div>
      </div>

      {/* COMO FUNCIONA */}
      <div style={{ padding:'80px 20px', maxWidth:680, margin:'0 auto' }}>
        <div className="bc" style={{ fontSize:10, fontWeight:700, letterSpacing:5, color:'#F5C400', textTransform:'uppercase', opacity:.6, marginBottom:8 }}>Passo a passo</div>
        <h2 className="bc" style={{ fontSize:'clamp(36px,7vw,64px)', fontWeight:900, fontStyle:'italic', textTransform:'uppercase', letterSpacing:-2, lineHeight:.9, marginBottom:40, color:'#fff' }}>
          Como <span style={{ color:'#F5C400' }}>funciona</span>
        </h2>
        <div style={{ display:'grid', gap:1, background:'#111' }}>
          {steps.map(([n,t,d]) => (
            <div key={n} className="step-row" style={{ background:'#080808', display:'grid', gridTemplateColumns:'auto 1fr', position:'relative', overflow:'hidden' }}>
              <div className="step-n bc" style={{ fontSize:52, fontWeight:900, fontStyle:'italic', color:'#111', padding:'20px 20px 20px 24px', lineHeight:1, minWidth:80, textAlign:'right' }}>{n}</div>
              <div style={{ padding:'24px 24px 24px 0', borderLeft:'1px solid #111' }}>
                <div className="bc" style={{ fontSize:18, fontWeight:900, textTransform:'uppercase', letterSpacing:1, color:'#fff', marginBottom:4 }}>{t}</div>
                <div className="step-desc" style={{ fontSize:13, color:'#555', lineHeight:1.5 }}>{d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ height:1, background:'#111' }} />

      {/* PONTUAÇÃO */}
      <div style={{ padding:'80px 0', maxWidth:680, margin:'0 auto' }}>
        <div style={{ padding:'0 20px', marginBottom:40 }}>
          <div className="bc" style={{ fontSize:10, fontWeight:700, letterSpacing:5, color:'#F5C400', textTransform:'uppercase', opacity:.6, marginBottom:8 }}>Sistema de pontos</div>
          <h2 className="bc" style={{ fontSize:'clamp(36px,7vw,64px)', fontWeight:900, fontStyle:'italic', textTransform:'uppercase', letterSpacing:-2, lineHeight:.9, color:'#fff' }}>
            Quanto vale <span style={{ color:'#F5C400' }}>cada jogada</span>
          </h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:1, background:'#111' }}>
          {pontos.map(([l,v,c]) => (
            <div key={l} className="pt-row" style={{ background:'#080808', padding:20, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span className="bc" style={{ fontSize:12, color:'#444', textTransform:'uppercase', letterSpacing:1, fontWeight:700 }}>{l}</span>
              <span className="bc" style={{ fontSize:28, fontWeight:900, fontStyle:'italic', lineHeight:1, color: c==='p'?'#4ade80':c==='n'?'#f87171':'#60a5fa' }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ height:1, background:'#111' }} />

      {/* NÍVEIS */}
      <div style={{ padding:'80px 20px', maxWidth:680, margin:'0 auto' }}>
        <div className="bc" style={{ fontSize:10, fontWeight:700, letterSpacing:5, color:'#F5C400', textTransform:'uppercase', opacity:.6, marginBottom:8 }}>Progressão</div>
        <h2 className="bc" style={{ fontSize:'clamp(36px,7vw,64px)', fontWeight:900, fontStyle:'italic', textTransform:'uppercase', letterSpacing:-2, lineHeight:.9, marginBottom:32, color:'#fff' }}>
          Sobe de <span style={{ color:'#F5C400' }}>nível</span>
        </h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
          {niveis.map(([icon,nome,pts],i) => (
            <div key={nome} className="lvl-card" onClick={() => setActiveLevel(i)}
              style={{ background: activeLevel===i?'#1a1200':'#0e0e0e', border: activeLevel===i?'1px solid #F5C400':'1px solid #111', padding:'20px 12px', textAlign:'center', borderRadius:4, position:'relative', overflow:'hidden' }}>
              {activeLevel===i && <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'#F5C400' }} />}
              <span style={{ fontSize:24, display:'block', marginBottom:8 }}>{icon}</span>
              <div className="bc" style={{ fontSize:13, fontWeight:900, textTransform:'uppercase', letterSpacing:1, color: activeLevel===i?'#F5C400':'#fff' }}>{nome}</div>
              <div className="bc" style={{ fontSize:10, color:'#333', marginTop:4 }}>{pts}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ height:1, background:'#111' }} />

      {/* BADGES */}
      <div style={{ padding:'80px 20px', maxWidth:680, margin:'0 auto' }}>
        <div className="bc" style={{ fontSize:10, fontWeight:700, letterSpacing:5, color:'#F5C400', textTransform:'uppercase', opacity:.6, marginBottom:8 }}>Conquistas</div>
        <h2 className="bc" style={{ fontSize:'clamp(36px,7vw,64px)', fontWeight:900, fontStyle:'italic', textTransform:'uppercase', letterSpacing:-2, lineHeight:.9, marginBottom:32, color:'#fff' }}>
          Coleciona <span style={{ color:'#F5C400' }}>badges</span>
        </h2>
        <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
          {badges.map(b => (
            <div key={b} className="bdg" style={{ display:'inline-flex', alignItems:'center', gap:8, background:'#0e0e0e', border:'1px solid #161616', padding:'10px 16px', borderRadius:2, fontSize:12, fontWeight:700, textTransform:'uppercase', letterSpacing:2, color:'#333', fontFamily:"'Barlow Condensed',sans-serif" }}>
              <div style={{ width:20, height:2, background:'currentColor', flexShrink:0 }} />{b}
            </div>
          ))}
        </div>
      </div>

      <div style={{ height:1, background:'#111' }} />

      {/* FAQ */}
      <div style={{ padding:'80px 20px', maxWidth:680, margin:'0 auto' }}>
        <div className="bc" style={{ fontSize:10, fontWeight:700, letterSpacing:5, color:'#F5C400', textTransform:'uppercase', opacity:.6, marginBottom:8 }}>Dúvidas</div>
        <h2 className="bc" style={{ fontSize:'clamp(36px,7vw,64px)', fontWeight:900, fontStyle:'italic', textTransform:'uppercase', letterSpacing:-2, lineHeight:.9, marginBottom:32, color:'#fff' }}>
          Perguntas <span style={{ color:'#F5C400' }}>frequentes</span>
        </h2>
        <div style={{ display:'flex', flexDirection:'column', gap:1, background:'#111' }}>
          {faqs.map(([q,a],i) => (
            <div key={i} className={openFaq===i?'faq-open':''} style={{ background:'#080808' }}>
              <div className="faq-q-text" onClick={() => toggleFaq(i)} style={{ padding:'20px 24px', display:'flex', justifyContent:'space-between', alignItems:'center', cursor:'pointer', fontSize:16, fontWeight:700, textTransform:'uppercase', letterSpacing:1, color: openFaq===i?'#F5C400':'#666', userSelect:'none', fontFamily:"'Barlow Condensed',sans-serif" }}>
                {q}
                <div style={{ width:16, height:16, position:'relative', flexShrink:0 }}>
                  <div style={{ position:'absolute', width:'100%', height:1.5, background: openFaq===i?'#F5C400':'#444', top:'50%', transform:'translateY(-50%)', borderRadius:1 }} />
                  <div style={{ position:'absolute', width:1.5, height: openFaq===i?0:'100%', background:'#444', left:'50%', transform:'translateX(-50%)', borderRadius:1, transition:'height .3s' }} />
                </div>
              </div>
              <div className="faq-a" style={{ fontSize:14, color:'#555', lineHeight:1.7, padding:'0 24px' }}>{a}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA FINAL */}
      <div style={{ background:'#F5C400', padding:'80px 20px', textAlign:'center', position:'relative', overflow:'hidden' }}>
        <div className="bc" style={{ position:'absolute', fontSize:200, fontWeight:900, fontStyle:'italic', color:'rgba(0,0,0,.06)', whiteSpace:'nowrap', top:'50%', left:'50%', transform:'translate(-50%,-50%)', pointerEvents:'none', letterSpacing:-8 }}>TIGRE FC</div>
        <h2 className="bc" style={{ fontSize:'clamp(40px,10vw,88px)', fontWeight:900, fontStyle:'italic', color:'#111', textTransform:'uppercase', letterSpacing:-3, lineHeight:.85, marginBottom:16, position:'relative' }}>
          É DE GRAÇA.<br/>É DO TIGRE.<br/>É PRA VOCÊ.
        </h2>
        <p style={{ fontSize:14, color:'rgba(0,0,0,.5)', marginBottom:32, position:'relative' }}>Entra agora e monta sua primeira escalação.</p>
        <Link href="/tigre-fc" style={{ display:'inline-flex', alignItems:'center', gap:12, background:'#111', color:'#F5C400', fontSize:13, fontWeight:900, letterSpacing:3, textTransform:'uppercase', padding:'16px 36px', borderRadius:2, textDecoration:'none', fontFamily:"'Barlow Condensed',sans-serif", position:'relative' }}>
          <img src={TIGRE_FC_LOGO} style={{ width:22, height:22, objectFit:'contain' }} />
          Jogar agora
        </Link>
      </div>
    </main>
  );
}
