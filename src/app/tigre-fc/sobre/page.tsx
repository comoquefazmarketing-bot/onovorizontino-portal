export const metadata = {
  title: 'Tigre FC — O Fantasy do Novorizontino',
  description: 'Monta sua escalação, crava o placar e prova pra galera quem manja mais do Tigre do Vale. Grátis, fácil e pra todo torcedor.',
};

export default function TigreFCSobrePage() {
  return (
    <main style={{ background: '#080808', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,700;0,900;1,900&family=Barlow:wght@400;500&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}
        :root{--gold:#F5C400;--dark:#080808}
        @keyframes fadeUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes float{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-12px) rotate(2deg)}}
        @keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}
        @keyframes scanH{0%{top:-2px}100%{top:100%}}
        @keyframes particleFloat{0%{transform:translateY(0) translateX(0);opacity:.6}100%{transform:translateY(-120px) translateX(20px);opacity:0}}
        @keyframes glow{0%,100%{box-shadow:0 0 20px rgba(245,196,0,.3)}50%{box-shadow:0 0 40px rgba(245,196,0,.7)}}
        .hero{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:60px 20px;position:relative;background:radial-gradient(ellipse 80% 60% at 50% 40%,#1a1200 0%,#080808 70%);overflow:hidden}
        .hero-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(245,196,0,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(245,196,0,.03) 1px,transparent 1px);background-size:60px 60px;pointer-events:none}
        .hero-scan{position:absolute;left:0;right:0;height:1px;background:rgba(245,196,0,.15);animation:scanH 6s linear infinite;pointer-events:none}
        .hero-particles{position:absolute;inset:0;pointer-events:none}
        .particle{position:absolute;width:3px;height:3px;background:#F5C400;border-radius:50%;animation:particleFloat linear infinite}
        .hero-eyebrow{font-family:'Barlow Condensed',sans-serif;font-size:11px;font-weight:700;letter-spacing:6px;color:#F5C400;text-transform:uppercase;opacity:.7;animation:fadeIn 1s .2s both}
        .hero-logo{width:100px;height:100px;object-fit:contain;animation:float 4s ease-in-out infinite,fadeIn .8s .4s both;filter:drop-shadow(0 0 30px rgba(245,196,0,.5));margin:20px 0}
        .hero-h1{font-family:'Barlow Condensed',sans-serif;font-size:clamp(64px,16vw,140px);font-weight:900;font-style:italic;text-transform:uppercase;letter-spacing:-3px;line-height:.85;animation:fadeUp .8s .5s both;color:#fff}
        .hero-h1 .gold{color:#F5C400}
        .hero-h1 .outline{-webkit-text-stroke:2px rgba(255,255,255,.15);color:transparent}
        .hero-sub{font-size:15px;color:#666;max-width:360px;line-height:1.6;margin:20px auto 0;animation:fadeUp .8s .7s both;font-family:'Barlow',sans-serif}
        .hero-cta{margin-top:36px;display:inline-flex;align-items:center;gap:12px;background:#F5C400;color:#111;font-family:'Barlow Condensed',sans-serif;font-size:14px;font-weight:900;letter-spacing:3px;text-transform:uppercase;padding:16px 36px;border-radius:4px;text-decoration:none;animation:fadeUp .8s .9s both,glow 2s ease-in-out 2s infinite;position:relative;overflow:hidden}
        .hero-cta::after{content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;background:rgba(255,255,255,.3);transform:skewX(-20deg);animation:shimmer 3s ease-in-out 2s infinite}
        .hero-scroll{position:absolute;bottom:30px;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:8px;animation:fadeIn 1s 1.5s both;opacity:.4}
        .hero-scroll span{font-size:9px;letter-spacing:4px;text-transform:uppercase;color:#555;font-family:'Barlow Condensed',sans-serif}
        .scroll-line{width:1px;height:40px;background:linear-gradient(to bottom,transparent,#F5C400)}
        .section{padding:80px 20px;max-width:680px;margin:0 auto}
        .sec-pre{font-family:'Barlow Condensed',sans-serif;font-size:10px;font-weight:700;letter-spacing:5px;color:#F5C400;text-transform:uppercase;opacity:.6;margin-bottom:8px}
        .sec-h{font-family:'Barlow Condensed',sans-serif;font-size:clamp(36px,7vw,64px);font-weight:900;font-style:italic;text-transform:uppercase;letter-spacing:-2px;line-height:.9;margin-bottom:40px;color:#fff}
        .sec-h .g{color:#F5C400}
        .how-steps{display:grid;gap:1px;background:#111}
        .how-step{background:#080808;display:grid;grid-template-columns:auto 1fr;gap:0;cursor:default;transition:background .2s;position:relative;overflow:hidden}
        .how-step::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:#F5C400;transform:scaleY(0);transform-origin:bottom;transition:transform .4s ease}
        .how-step:hover{background:#0c0c0c}
        .how-step:hover::before{transform:scaleY(1)}
        .how-step-n{font-family:'Barlow Condensed',sans-serif;font-size:52px;font-weight:900;font-style:italic;color:#111;padding:20px 20px 20px 24px;line-height:1;transition:color .3s;min-width:80px;text-align:right}
        .how-step:hover .how-step-n{color:#F5C400}
        .how-step-body{padding:24px 24px 24px 0;border-left:1px solid #111}
        .how-step-title{font-family:'Barlow Condensed',sans-serif;font-size:18px;font-weight:900;text-transform:uppercase;letter-spacing:1px;color:#fff;margin-bottom:4px}
        .how-step-desc{font-size:13px;color:#555;line-height:1.5;font-family:'Barlow',sans-serif}
        .how-step:hover .how-step-desc{color:#888}
        .pts-wrap{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:#111}
        .pt{background:#080808;padding:20px;display:flex;justify-content:space-between;align-items:center;position:relative;overflow:hidden;transition:background .2s;cursor:default}
        .pt:hover{background:#0f0f0f}
        .pt-label{font-size:12px;color:#444;text-transform:uppercase;letter-spacing:1px;font-family:'Barlow Condensed',sans-serif;font-weight:700}
        .pt-val{font-family:'Barlow Condensed',sans-serif;font-size:28px;font-weight:900;font-style:italic;line-height:1}
        .pt-val.p{color:#4ade80}.pt-val.n{color:#f87171}.pt-val.m{color:#60a5fa}
        .lvl-cards{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:16px}
        .lvl-card{background:#0e0e0e;border:1px solid #111;padding:20px 12px;text-align:center;border-radius:4px;transition:all .3s;cursor:default;position:relative;overflow:hidden}
        .lvl-card:hover,.lvl-card.active{border-color:#F5C400;background:#1a1200}
        .lvl-card:hover::before,.lvl-card.active::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:#F5C400}
        .lvl-icon{font-size:24px;display:block;margin-bottom:8px}
        .lvl-name{font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:900;text-transform:uppercase;letter-spacing:1px;color:#fff}
        .lvl-card:hover .lvl-name,.lvl-card.active .lvl-name{color:#F5C400}
        .lvl-pts-t{font-size:10px;color:#333;margin-top:4px;font-family:'Barlow Condensed',sans-serif}
        .badges-grid{display:flex;flex-wrap:wrap;gap:8px}
        .bdg{display:inline-flex;align-items:center;gap:8px;background:#0e0e0e;border:1px solid #161616;padding:10px 16px;border-radius:2px;font-family:'Barlow Condensed',sans-serif;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#333;transition:all .3s;cursor:default}
        .bdg:hover{border-color:#F5C400;color:#F5C400;background:#1a1200}
        .bdg-line{width:20px;height:2px;background:currentColor;flex-shrink:0}
        .faq{display:flex;flex-direction:column;gap:1px;background:#111}
        .faq-i{background:#080808}
        .faq-q{padding:20px 24px;display:flex;justify-content:space-between;align-items:center;cursor:pointer;font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#666;transition:color .2s;user-select:none}
        .faq-q:hover{color:#fff}
        .faq-cross{width:16px;height:16px;position:relative;flex-shrink:0}
        .faq-cross::before,.faq-cross::after{content:'';position:absolute;background:#444;border-radius:1px;transition:all .3s}
        .faq-cross::before{width:100%;height:1.5px;top:50%;transform:translateY(-50%)}
        .faq-cross::after{width:1.5px;height:100%;left:50%;transform:translateX(-50%)}
        .faq-i.open .faq-q{color:#F5C400}
        .faq-i.open .faq-cross::before,.faq-i.open .faq-cross::after{background:#F5C400}
        .faq-i.open .faq-cross::after{transform:translateX(-50%) rotate(90deg);opacity:0}
        .faq-a{max-height:0;overflow:hidden;transition:max-height .4s ease,padding .4s ease;font-size:14px;color:#555;line-height:1.7;padding:0 24px;font-family:'Barlow',sans-serif}
        .faq-i.open .faq-a{max-height:200px;padding:0 24px 20px}
        .cta-end{background:#F5C400;padding:80px 20px;text-align:center;position:relative;overflow:hidden}
        .cta-end::before{content:'TIGRE FC';position:absolute;font-family:'Barlow Condensed',sans-serif;font-size:200px;font-weight:900;font-style:italic;color:rgba(0,0,0,.06);white-space:nowrap;top:50%;left:50%;transform:translate(-50%,-50%);pointer-events:none;letter-spacing:-8px}
        .cta-end-h{font-family:'Barlow Condensed',sans-serif;font-size:clamp(40px,10vw,88px);font-weight:900;font-style:italic;color:#111;text-transform:uppercase;letter-spacing:-3px;line-height:.85;margin-bottom:16px;position:relative}
        .cta-end-p{font-size:14px;color:rgba(0,0,0,.5);margin-bottom:32px;position:relative;font-family:'Barlow',sans-serif}
        .cta-end-btn{display:inline-flex;align-items:center;gap:12px;background:#111;color:#F5C400;font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:900;letter-spacing:3px;text-transform:uppercase;padding:16px 36px;border-radius:2px;text-decoration:none;transition:background .2s;position:relative}
        .cta-end-btn:hover{background:#000}
        .reveal{opacity:0;transform:translateY(30px);transition:opacity .7s ease,transform .7s ease}
        .reveal.in{opacity:1;transform:translateY(0)}
        .divider{height:1px;background:#111}
      `}</style>

      {/* HERO */}
      <div className="hero">
        <div className="hero-grid"></div>
        <div className="hero-scan"></div>
        <div className="hero-particles" id="particles"></div>
        <div className="hero-eyebrow">Fantasy League · Novorizontino · Série B 2026</div>
        <img src="https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/tigre-fc-logo.png" className="hero-logo" alt="Tigre FC"/>
        <h1 className="hero-h1">
          <span className="outline">ENTRA</span><br/>
          NO <span className="gold">JOGO</span>
        </h1>
        <p className="hero-sub">Monta o time do Tigre, crava o placar e prova pra galera quem manja mais de futebol.</p>
        <a href="/tigre-fc" className="hero-cta">
          <img src="https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/tigre-fc-logo.png" style={{width:22,height:22,objectFit:'contain'}}/>
          Jogar agora — grátis
        </a>
        <div className="hero-scroll">
          <span>scroll</span>
          <div className="scroll-line"></div>
        </div>
      </div>

      {/* COMO JOGAR */}
      <div className="section reveal">
        <div className="sec-pre">Passo a passo</div>
        <div className="sec-h">Como <span className="g">funciona</span></div>
        <div className="how-steps">
          {[
            ['01','Entra com o Google','Um clique só. Sem senha pra criar, sem formulário chato. Entra com sua conta do Google e escolhe seu apelido de torcedor.'],
            ['02','Monta sua escalação','Escolhe 11 jogadores do Novorizontino. Arrasta pro campo, define a formação e arma o time do jeito que você acha certo.'],
            ['03','Define o capitão','O capitão tem os pontos dobrados. Escolheu o Oyama e ele fez um golaço? Seus pontos vão lá em cima.'],
            ['04','Aponta o herói','Quem vai brilhar hoje? Acertou o herói real da partida? São +10 pontos garantidos direto na sua conta.'],
            ['05','Crava o placar','Acertou o placar exato? +15 pts. Acertou só quem ganhou? +5 pts. Quanto mais certeiro, mais alto você sobe.'],
            ['06','Sobe no ranking','Quanto melhor o Tigre jogar, mais você pontua. Acompanha o ranking ao vivo e prova quem é o melhor torcedor.'],
          ].map(([n,t,d]) => (
            <div key={n} className="how-step">
              <div className="how-step-n">{n}</div>
              <div className="how-step-body">
                <div className="how-step-title">{t}</div>
                <div className="how-step-desc">{d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="divider"></div>

      {/* PONTUAÇÃO */}
      <div style={{padding:'80px 0',maxWidth:680,margin:'0 auto'}} className="reveal">
        <div style={{padding:'0 20px'}}>
          <div className="sec-pre">Sistema de pontos</div>
          <div className="sec-h">Quanto vale <span className="g">cada jogada</span></div>
        </div>
        <div className="pts-wrap">
          {[
            ['Gol marcado','+8','p'],['Assistência','+5','p'],
            ['Titular 60+ min','+2','p'],['Sem tomar gol','+5','p'],
            ['Placar exato','+15','p'],['Resultado certo','+5','p'],
            ['Herói da partida','+10','p'],['Capitão','×2','m'],
            ['Cartão amarelo','-2','n'],['Cartão vermelho','-5','n'],
          ].map(([l,v,c]) => (
            <div key={l} className="pt">
              <span className="pt-label">{l}</span>
              <span className={`pt-val ${c}`}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="divider"></div>

      {/* NÍVEIS */}
      <div className="section reveal">
        <div className="sec-pre">Progressão</div>
        <div className="sec-h">Sobe de <span className="g">nível</span></div>
        <div className="lvl-cards">
          {[
            ['🌱','Novato','0–99 pts'],
            ['⚡','Fiel','100–299'],
            ['🔥','Garra','300–599'],
            ['🐯','Lenda','600+ pts'],
          ].map(([icon,nome,pts],i) => (
            <div key={nome} className={`lvl-card${i===3?' active':''}`}>
              <span className="lvl-icon">{icon}</span>
              <div className="lvl-name">{nome}</div>
              <div className="lvl-pts-t">{pts}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="divider"></div>

      {/* BADGES */}
      <div className="section reveal">
        <div className="sec-pre">Conquistas</div>
        <div className="sec-h">Coleciona <span className="g">badges</span></div>
        <div className="badges-grid">
          {['Craque da Rodada','Hat-trick','Streak 3 jogos','Cravou o Placar','Tigre do Vale','Pódio Top 3','Herói Certeiro','Garra Total'].map(b => (
            <div key={b} className="bdg"><div className="bdg-line"></div>{b}</div>
          ))}
        </div>
      </div>

      <div className="divider"></div>

      {/* FAQ */}
      <div className="section reveal">
        <div className="sec-pre">Dúvidas</div>
        <div className="sec-h">Perguntas <span className="g">frequentes</span></div>
        <div className="faq" id="faq">
          {[
            ['É de graça?','Sim, 100% gratuito. Não tem nada pra pagar, sem assinatura, sem compra dentro do jogo. Entra e joga.'],
            ['Precisa saber muito de futebol?','Não precisa ser nenhum especialista. Se você acompanha o Tigre e sabe mais ou menos quem joga bem, já dá pra competir.'],
            ['Posso mudar minha escalação depois?','Pode! Você altera até o apito inicial. Depois que o jogo começa, fica travada.'],
            ['O que é o capitão?','O capitão tem os pontos dobrados. Se ele faz um gol (+8), você recebe +16. Escolha com cuidado!'],
            ['Tem prêmio pra quem ganhar?','O campeão de cada rodada ganha destaque no portal e badge exclusivo. Em breve, prêmios físicos também!'],
            ['Posso jogar com meus amigos?','Em breve! As ligas privadas chegam na fase 2. Você cria uma liga com código e compete só com a galera do grupo.'],
          ].map(([q,a],i) => (
            <div key={i} className="faq-i">
              <div className="faq-q" onClick={(e)=>{
                const item=(e.currentTarget as HTMLElement).parentElement!;
                const open=item.classList.contains('open');
                document.querySelectorAll('.faq-i').forEach(x=>x.classList.remove('open'));
                if(!open)item.classList.add('open');
              }}>
                {q}<div className="faq-cross"></div>
              </div>
              <div className="faq-a">{a}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA FINAL */}
      <div className="cta-end reveal">
        <div className="cta-end-h">É DE GRAÇA.<br/>É DO TIGRE.<br/>É PRA VOCÊ.</div>
        <p className="cta-end-p">Entra agora e monta sua primeira escalação.</p>
        <a href="/tigre-fc" className="cta-end-btn">
          <img src="https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/tigre-fc-logo.png" style={{width:22,height:22,objectFit:'contain'}}/>
          Jogar agora
        </a>
      </div>

      <script dangerouslySetInnerHTML={{__html:`
        const pc=document.getElementById('particles');
        if(pc){for(let i=0;i<25;i++){const p=document.createElement('div');p.className='particle';p.style.cssText='left:'+Math.random()*100+'%;top:'+Math.random()*100+'%;width:'+(Math.random()*3+1)+'px;height:'+(Math.random()*3+1)+'px;animation-duration:'+(Math.random()*6+4)+'s;animation-delay:'+(Math.random()*6)+'s;opacity:'+(Math.random()*.5);pc.appendChild(p);}}
        const obs=new IntersectionObserver(e=>{e.forEach(x=>{if(x.isIntersecting)x.target.classList.add('in')})},{threshold:0.1});
        document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));
      `}}/>
    </main>
  );
}
