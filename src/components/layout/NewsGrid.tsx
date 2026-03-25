'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function PostagensGrid() {
  const postagens = [
    {
      id: 'd1d0971b',
      titulo: 'GUIA DO JOGO: NOVORIZONTINO X LONDRINA',
      slug: 'pre-jogo-novorizontino-x-londrina-serie-b-2026',
      categoria: 'Pré-Jogo',
      imagem: 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/sign/imagens-portal/Novorizontino%20x%20Londrina.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83YWRmNjZiNC02ZTNlLTRmYjQtOTk0ZC05YzFkYjNiYTQ0YzIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZW5zLXBvcnRhbC9Ob3Zvcml6b250aW5vIHggTG9uZHJpbmEucG5nIiwiaWF0IjoxNzc0MTQ2MzgwLCJleHAiOjE4MDU2ODIzODB9.g0fC63gO5E6vJpShAbTgnN_BxqBoGrjPCCks_F6AdNs'
    },
    {
      import Head from "next/head";
import Image from "next/image";

// ─────────────────────────────────────────────────────────────
//  DADOS DA PARTIDA — edite aqui para atualizar a ficha técnica
// ─────────────────────────────────────────────────────────────
const META = {
  title:
    "O Vício do Vice: Novorizontino estreia na Série B com apatia e castigo no Jorjão",
  description:
    "A expectativa era de festa. O Tigre entrou soberbo e saiu de cabeça baixa: Londrina venceu por 3 a 1 em estreia melancólica da Série B 2026.",
  author: "Felipe Makarios",
  authorRole: "Fundador do Portal O Novorizontino",
  publishedDate: "2026-03-22",
  url: "https://www.onovorizontino.com.br/noticias/estreia-serie-b-novorizontino-x-londrina-2026",
  ogImage:
    "https://www.onovorizontino.com.br/assets/logos/LOGO%20-%20O%20NOVORIZONTINO.png",
  keywords:
    "Novorizontino, Série B 2026, Londrina, estreia, Enderson Moreira, Jorjão",
};

const FICHA = {
  mandante: "Novorizontino",
  visitante: "Londrina",
  placarMandante: 1,
  placarVisitante: 3,
  local: "Estádio Jorge Ismael de Biasi (Jorjão)",
  publico: "1.282",
  tecnico: "Enderson Moreira",
  proxJogo: "Juventude",
  proxData: "31/03",
  proxLocal: "Caxias do Sul (fora)",
  gols: [
    {
      tempo: "3'",
      periodo: "2ºT",
      jogador: "Bruno Santos",
      equipe: "Londrina",
      tipo: "adversario",
    },
    {
      tempo: "12'",
      periodo: "2ºT",
      jogador: "Lucas Marques",
      equipe: "Londrina",
      tipo: "adversario",
    },
    {
      tempo: "43'",
      periodo: "2ºT",
      jogador: "André Luiz",
      equipe: "Londrina",
      tipo: "adversario",
    },
    {
      tempo: "50'",
      periodo: "2ºT",
      jogador: "Carlão",
      equipe: "Novorizontino",
      tipo: "proprio",
    },
  ],
};

// ─────────────────────────────────────────────────────────────

export default function EstreiaSerieB() {
  return (
    <>
      <Head>
        <title>{META.title}</title>
        <meta name="description" content={META.description} />
        <meta name="author" content={META.author} />
        <meta name="keywords" content={META.keywords} />
        <meta
          name="robots"
          content="index, follow, max-snippet:-1, max-image-preview:large"
        />
        <link rel="canonical" href={META.url} />

        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:url" content={META.url} />
        <meta property="og:image" content={META.ogImage} />
        <meta property="og:locale" content="pt_BR" />
        <meta property="og:site_name" content="Portal O Novorizontino" />
        <meta
          property="article:published_time"
          content={`${META.publishedDate}T21:00:00-03:00`}
        />
        <meta property="article:author" content={META.author} />
        <meta property="article:section" content="Série B" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />
        <meta name="twitter:image" content={META.ogImage} />

        {/* Schema.org JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "NewsArticle",
              headline: META.title,
              description: META.description,
              author: {
                "@type": "Person",
                name: META.author,
                jobTitle: META.authorRole,
                url: "https://www.onovorizontino.com.br",
              },
              publisher: {
                "@type": "Organization",
                name: "Portal O Novorizontino",
                logo: {
                  "@type": "ImageObject",
                  url: META.ogImage,
                },
              },
              datePublished: `${META.publishedDate}T21:00:00-03:00`,
              url: META.url,
              image: META.ogImage,
              keywords: META.keywords,
            }),
          }}
        />

        {/* Fontes de impacto via Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:ital,wght@0,400;0,500;1,400;1,500&display=swap"
          rel="stylesheet"
        />

        <style>{`
          :root {
            --amarelo: #F5C400;
            --amarelo-escuro: #C49B00;
            --preto: #0A0A0A;
            --preto-suave: #111111;
            --cinza-quente: #1C1C1C;
            --cinza-medio: #2E2E2E;
            --cinza-texto: #A8A8A8;
            --branco: #F0EDE8;
            --vermelho-gol: #E53535;
          }

          body { margin: 0; background: var(--preto); }

          /* Textura de grain sutil */
          .grain::before {
            content: '';
            position: fixed;
            inset: 0;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
            pointer-events: none;
            z-index: 9999;
            opacity: 0.35;
          }

          .font-display { font-family: 'Bebas Neue', sans-serif; }
          .font-condensed { font-family: 'Barlow Condensed', sans-serif; }
          .font-body { font-family: 'Barlow', sans-serif; }

          /* Linha decorativa amarela */
          .stripe-left {
            border-left: 4px solid var(--amarelo);
            padding-left: 1.25rem;
          }

          /* Barra de progresso animada no topo */
          @keyframes progress {
            from { width: 0% }
            to { width: 100% }
          }
          .progress-bar {
            animation: progress 3s ease-out forwards;
          }

          /* Fade in staggered */
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .fade-up { animation: fadeUp 0.7s ease forwards; }
          .delay-1 { animation-delay: 0.1s; opacity: 0; }
          .delay-2 { animation-delay: 0.25s; opacity: 0; }
          .delay-3 { animation-delay: 0.4s; opacity: 0; }
          .delay-4 { animation-delay: 0.55s; opacity: 0; }
          .delay-5 { animation-delay: 0.7s; opacity: 0; }

          /* Placar animado */
          @keyframes scorePop {
            0% { transform: scale(0.7); opacity: 0; }
            60% { transform: scale(1.08); }
            100% { transform: scale(1); opacity: 1; }
          }
          .score-pop { animation: scorePop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.4s forwards; opacity: 0; }

          /* Separador diagonal */
          .diagonal-divider {
            height: 3px;
            background: linear-gradient(90deg, var(--amarelo) 0%, var(--amarelo-escuro) 50%, transparent 100%);
          }

          /* Card de gol */
          .gol-card:hover { transform: translateX(4px); }
          .gol-card { transition: transform 0.2s ease; }

          /* Citação de destaque */
          .pull-quote::before {
            content: '"';
            font-family: 'Bebas Neue', sans-serif;
            font-size: 8rem;
            line-height: 0.6;
            color: var(--amarelo);
            display: block;
            margin-bottom: 0.5rem;
          }
        `}</style>
      </Head>

      <div className="grain" style={{ background: "var(--preto)", minHeight: "100vh" }}>

        {/* ── BARRA AMARELA TOPO ── */}
        <div style={{ background: "var(--preto)", borderBottom: "1px solid #222" }}>
          <div
            className="progress-bar"
            style={{ height: "3px", background: "var(--amarelo)" }}
          />
          <div
            className="fade-up delay-1"
            style={{
              maxWidth: "900px",
              margin: "0 auto",
              padding: "0.75rem 1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              className="font-condensed"
              style={{ color: "var(--amarelo)", fontSize: "0.8rem", letterSpacing: "0.15em", fontWeight: 700 }}
            >
              PORTAL O NOVORIZONTINO
            </span>
            <span
              className="font-condensed"
              style={{ color: "var(--cinza-texto)", fontSize: "0.75rem", letterSpacing: "0.1em" }}
            >
              SÉRIE B 2026 · RODADA 1
            </span>
          </div>
        </div>

        {/* ── HERO ── */}
        <header
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            padding: "3rem 1.5rem 2rem",
          }}
        >
          {/* Tag editorial */}
          <div className="fade-up delay-1" style={{ marginBottom: "1.25rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <span
              className="font-condensed"
              style={{
                background: "var(--amarelo)",
                color: "var(--preto)",
                padding: "0.2rem 0.75rem",
                fontSize: "0.7rem",
                fontWeight: 800,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}
            >
              ANÁLISE
            </span>
            <span
              className="font-condensed"
              style={{
                border: "1px solid #333",
                color: "var(--cinza-texto)",
                padding: "0.2rem 0.75rem",
                fontSize: "0.7rem",
                fontWeight: 600,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}
            >
              SÉRIE B · 22.03.2026
            </span>
          </div>

          {/* Título Principal */}
          <h1
            className="font-display fade-up delay-2"
            style={{
              fontSize: "clamp(2.8rem, 8vw, 5.5rem)",
              lineHeight: 0.95,
              color: "var(--branco)",
              margin: "0 0 0.5rem",
              letterSpacing: "0.02em",
            }}
          >
            O VÍCIO<br />
            <span style={{ color: "var(--amarelo)" }}>DO VICE</span>
          </h1>

          <div className="diagonal-divider fade-up delay-2" style={{ margin: "1.25rem 0" }} />

          {/* Subtítulo */}
          <p
            className="font-condensed fade-up delay-3"
            style={{
              fontSize: "clamp(1rem, 3vw, 1.3rem)",
              color: "var(--cinza-texto)",
              fontWeight: 600,
              letterSpacing: "0.05em",
              margin: "0 0 2.5rem",
              textTransform: "uppercase",
            }}
          >
            Novorizontino estreia na Série B com apatia e castigo no Jorjão
          </p>

          {/* ── PLACAR PRINCIPAL ── */}
          <div
            className="score-pop"
            style={{
              background: "var(--cinza-quente)",
              border: "1px solid #2a2a2a",
              padding: "2rem",
              display: "grid",
              gridTemplateColumns: "1fr auto 1fr",
              alignItems: "center",
              gap: "1rem",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Faixa diagonal de fundo */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(135deg, transparent 40%, rgba(245,196,0,0.04) 100%)",
                pointerEvents: "none",
              }}
            />

            {/* Mandante */}
            <div style={{ textAlign: "center" }}>
              <p
                className="font-condensed"
                style={{ color: "var(--cinza-texto)", fontSize: "0.7rem", letterSpacing: "0.2em", margin: "0 0 0.4rem", textTransform: "uppercase" }}
              >
                MANDANTE
              </p>
              <p
                className="font-display"
                style={{ fontSize: "clamp(1.2rem, 4vw, 1.8rem)", color: "var(--branco)", margin: 0, letterSpacing: "0.05em" }}
              >
                {FICHA.mandante.toUpperCase()}
              </p>
            </div>

            {/* Placar */}
            <div style={{ textAlign: "center", padding: "0 1.5rem" }}>
              <div
                className="font-display"
                style={{
                  fontSize: "clamp(3rem, 10vw, 5rem)",
                  lineHeight: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <span style={{ color: "var(--vermelho-gol)" }}>{FICHA.placarMandante}</span>
                <span style={{ color: "#333", fontSize: "0.6em" }}>×</span>
                <span style={{ color: "var(--amarelo)" }}>{FICHA.placarVisitante}</span>
              </div>
              <p
                className="font-condensed"
                style={{ color: "var(--cinza-texto)", fontSize: "0.65rem", letterSpacing: "0.2em", margin: "0.25rem 0 0", textTransform: "uppercase" }}
              >
                RESULTADO FINAL
              </p>
            </div>

            {/* Visitante */}
            <div style={{ textAlign: "center" }}>
              <p
                className="font-condensed"
                style={{ color: "var(--cinza-texto)", fontSize: "0.7rem", letterSpacing: "0.2em", margin: "0 0 0.4rem", textTransform: "uppercase" }}
              >
                VISITANTE
              </p>
              <p
                className="font-display"
                style={{ fontSize: "clamp(1.2rem, 4vw, 1.8rem)", color: "var(--amarelo)", margin: 0, letterSpacing: "0.05em" }}
              >
                {FICHA.visitante.toUpperCase()}
              </p>
            </div>
          </div>

          {/* Autor */}
          <div
            className="fade-up delay-4"
            style={{
              marginTop: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "var(--amarelo)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span
                className="font-display"
                style={{ color: "var(--preto)", fontSize: "1rem" }}
              >
                FM
              </span>
            </div>
            <div>
              <p
                className="font-condensed"
                style={{ margin: 0, color: "var(--branco)", fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.05em" }}
              >
                {META.author}
              </p>
              <p
                className="font-condensed"
                style={{ margin: 0, color: "var(--cinza-texto)", fontSize: "0.75rem", letterSpacing: "0.08em" }}
              >
                {META.authorRole}
              </p>
            </div>
          </div>
        </header>

        {/* ── CORPO DO ARTIGO ── */}
        <main
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            padding: "0 1.5rem 4rem",
          }}
        >
          <div className="diagonal-divider" style={{ marginBottom: "2.5rem" }} />

          {/* Parágrafo de abertura — destaque */}
          <p
            className="font-body fade-up delay-3 stripe-left"
            style={{
              fontSize: "clamp(1.05rem, 2.5vw, 1.2rem)",
              lineHeight: 1.75,
              color: "var(--branco)",
              marginBottom: "2.5rem",
              fontStyle: "italic",
            }}
          >
            A expectativa era de festa. O torcedor do Grêmio Novorizontino ainda
            sentia o gosto doce do vice-campeonato paulista e, embalado por aquela
            campanha histórica, pouco mais de{" "}
            <strong style={{ color: "var(--amarelo)", fontStyle: "normal" }}>
              1.200 torcedores
            </strong>{" "}
            foram ao Estádio Jorge Ismael de Biasi na noite deste domingo (22). O
            clima era de <em>"o acesso é questão de honra"</em>. Mas o que vimos
            em campo foi um balde de água gelada que congelou qualquer entusiasmo.
          </p>

          {/* Corpo normal */}
          <p
            className="font-body fade-up delay-4"
            style={{ fontSize: "1rem", lineHeight: 1.85, color: "#C8C4BE", marginBottom: "2rem" }}
          >
            O time que entrou no gramado não parecia o mesmo que encarou os
            gigantes do estado há poucas semanas. O Novorizontino se mostrou{" "}
            <strong style={{ color: "var(--branco)" }}>apático, desligado</strong>{" "}
            e, acima de tudo,{" "}
            <strong style={{ color: "var(--branco)" }}>soberbo</strong>. Parecia
            que o "status" de vice-campeão bastaria para ganhar o jogo sozinho.
            Ledo engano. No primeiro tempo, o Tigre até teve volume, mas parou nas
            mãos de{" "}
            <strong style={{ color: "var(--amarelo)" }}>Maurício Kozlinski</strong>
            , o goleiro do Londrina, que frustrou as poucas tentativas reais de
            Robson e Tavinho.
          </p>

          {/* ── CITAÇÃO DE DESTAQUE 1 ── */}
          <blockquote
            className="pull-quote fade-up delay-3"
            style={{
              borderLeft: "none",
              padding: "1.5rem 2rem",
              margin: "2.5rem 0",
              background: "var(--cinza-quente)",
              position: "relative",
            }}
          >
            <p
              className="font-condensed"
              style={{
                fontSize: "clamp(1.4rem, 4vw, 2rem)",
                color: "var(--branco)",
                lineHeight: 1.3,
                fontWeight: 700,
                margin: 0,
                fontStyle: "italic",
              }}
            >
              Parecia que o status de vice-campeão bastaria para ganhar o jogo
              sozinho. Ledo engano.
            </p>
            <div
              style={{
                marginTop: "1rem",
                borderTop: "1px solid #2a2a2a",
                paddingTop: "0.75rem",
              }}
            >
              <span
                className="font-condensed"
                style={{ color: "var(--amarelo)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em" }}
              >
                ANÁLISE DA REDAÇÃO
              </span>
            </div>
          </blockquote>

          {/* Seção: O Desmoronamento */}
          <h2
            className="font-display fade-up delay-2"
            style={{
              fontSize: "clamp(1.8rem, 5vw, 2.8rem)",
              color: "var(--amarelo)",
              margin: "2.5rem 0 1rem",
              letterSpacing: "0.04em",
            }}
          >
            O DESMORONAMENTO
          </h2>

          <p
            className="font-body fade-up delay-3"
            style={{ fontSize: "1rem", lineHeight: 1.85, color: "#C8C4BE", marginBottom: "1.5rem" }}
          >
            A alegria da arquibancada foi, minuto a minuto, dando lugar a um
            silêncio preocupante. E o pior aconteceu no segundo tempo. Aos{" "}
            <strong style={{ color: "var(--vermelho-gol)" }}>3 minutos</strong>,
            após um erro de posicionamento da zaga que levou a famosa "bola nas
            costas",{" "}
            <strong style={{ color: "var(--branco)" }}>Bruno Santos</strong> —
            que recém havia entrado — driblou o goleiro César e abriu o placar.
            Ali, a preocupação virou medo.
          </p>

          <p
            className="font-body fade-up delay-3"
            style={{ fontSize: "1rem", lineHeight: 1.85, color: "#C8C4BE", marginBottom: "2.5rem" }}
          >
            O time de{" "}
            <strong style={{ color: "var(--branco)" }}>Enderson Moreira</strong>{" "}
            não reagiu. Pelo contrário, continuou errando detalhes bobos, passes
            curtos e coberturas básicas. Aos{" "}
            <strong style={{ color: "var(--vermelho-gol)" }}>12 minutos</strong>,
            em uma tabela que a defesa apenas assistiu,{" "}
            <strong style={{ color: "var(--branco)" }}>Lucas Marques</strong>{" "}
            ampliou para 2 a 0. Foi o sinal para os primeiros torcedores,
            indignados com a falta de brio, começarem a se levantar e abandonar o
            estádio.
          </p>

          {/* ── TIMELINE DE GOLS ── */}
          <div
            className="fade-up delay-3"
            style={{
              background: "var(--cinza-quente)",
              border: "1px solid #222",
              padding: "1.75rem",
              marginBottom: "2.5rem",
            }}
          >
            <p
              className="font-condensed"
              style={{
                color: "var(--amarelo)",
                fontSize: "0.7rem",
                fontWeight: 800,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                margin: "0 0 1.25rem",
                borderBottom: "1px solid #2a2a2a",
                paddingBottom: "0.75rem",
              }}
            >
              ⚽ LINHA DO TEMPO — GOLS DA PARTIDA
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {FICHA.gols.map((gol, i) => (
                <div
                  key={i}
                  className="gol-card"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "80px 1fr auto",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "0.75rem 1rem",
                    background: gol.tipo === "proprio" ? "rgba(245,196,0,0.06)" : "rgba(229,53,53,0.06)",
                    borderLeft: `3px solid ${gol.tipo === "proprio" ? "var(--amarelo)" : "var(--vermelho-gol)"}`,
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <span
                      className="font-display"
                      style={{
                        fontSize: "1.5rem",
                        color: gol.tipo === "proprio" ? "var(--amarelo)" : "var(--vermelho-gol)",
                        display: "block",
                        lineHeight: 1,
                      }}
                    >
                      {gol.tempo}
                    </span>
                    <span
                      className="font-condensed"
                      style={{ color: "var(--cinza-texto)", fontSize: "0.65rem", letterSpacing: "0.1em" }}
                    >
                      {gol.periodo}
                    </span>
                  </div>

                  <div>
                    <p
                      className="font-condensed"
                      style={{ margin: 0, color: "var(--branco)", fontSize: "1rem", fontWeight: 700, letterSpacing: "0.03em" }}
                    >
                      {gol.jogador}
                    </p>
                    <p
                      className="font-condensed"
                      style={{ margin: 0, color: "var(--cinza-texto)", fontSize: "0.75rem", letterSpacing: "0.08em" }}
                    >
                      {gol.equipe}
                    </p>
                  </div>

                  <span
                    className="font-condensed"
                    style={{
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      letterSpacing: "0.15em",
                      padding: "0.2rem 0.6rem",
                      background: gol.tipo === "proprio" ? "rgba(245,196,0,0.15)" : "rgba(229,53,53,0.15)",
                      color: gol.tipo === "proprio" ? "var(--amarelo)" : "var(--vermelho-gol)",
                      textTransform: "uppercase",
                    }}
                  >
                    {gol.tipo === "proprio" ? "TIGRE" : "LONDRINA"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Seção: A Revolta Final */}
          <h2
            className="font-display fade-up delay-2"
            style={{
              fontSize: "clamp(1.8rem, 5vw, 2.8rem)",
              color: "var(--amarelo)",
              margin: "2.5rem 0 1rem",
              letterSpacing: "0.04em",
            }}
          >
            A REVOLTA FINAL
          </h2>

          <p
            className="font-body fade-up delay-3"
            style={{ fontSize: "1rem", lineHeight: 1.85, color: "#C8C4BE", marginBottom: "1.5rem" }}
          >
            A humilhação se completou aos{" "}
            <strong style={{ color: "var(--vermelho-gol)" }}>43 minutos</strong>.
            Após uma falha boba de{" "}
            <strong style={{ color: "var(--branco)" }}>Léo Naldi</strong> na
            interceptação,{" "}
            <strong style={{ color: "var(--branco)" }}>André Luiz</strong> bateu
            cruzado e fez o terceiro. A debandada foi geral.
          </p>

          <p
            className="font-body fade-up delay-3"
            style={{ fontSize: "1rem", lineHeight: 1.85, color: "#C8C4BE", marginBottom: "2.5rem" }}
          >
            O gol de honra de{" "}
            <strong style={{ color: "var(--amarelo)" }}>Carlão</strong>, nos
            acréscimos (50'), após um bate-rebate na área, não serviu nem para
            consolo. Foi o gol que ninguém comemorou.
          </p>

          {/* ── CITAÇÃO VEREDITO ── */}
          <div
            className="fade-up delay-3"
            style={{
              borderTop: "3px solid var(--amarelo)",
              borderBottom: "3px solid var(--amarelo)",
              padding: "2rem 1.5rem",
              margin: "2.5rem 0",
              position: "relative",
            }}
          >
            <p
              className="font-condensed"
              style={{
                fontSize: "0.65rem",
                color: "var(--amarelo)",
                fontWeight: 800,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                margin: "0 0 1rem",
              }}
            >
              ▲ VEREDITO DA ARQUIBANCADA
            </p>
            <p
              className="font-body"
              style={{
                fontSize: "clamp(1rem, 2.5vw, 1.15rem)",
                lineHeight: 1.75,
                color: "var(--branco)",
                margin: 0,
                fontStyle: "italic",
              }}
            >
              O Novorizontino entrou com{" "}
              <strong style={{ fontStyle: "normal" }}>"salto alto"</strong>. Ficou
              claro que o time ainda está vislumbrado com o espelho do Paulistão,
              esquecendo que a Série B é uma{" "}
              <strong style={{ color: "var(--amarelo)", fontStyle: "normal" }}>
                guerra de trincheiras
              </strong>{" "}
              que não aceita desleixo. Detalhes ganham jogos, e hoje o Tigre ignorou
              todos eles.
            </p>
          </div>

          <p
            className="font-body fade-up delay-3"
            style={{ fontSize: "1rem", lineHeight: 1.85, color: "#C8C4BE", marginBottom: "3rem" }}
          >
            Se o objetivo é o acesso, a mentalidade precisa mudar antes da viagem
            para <strong style={{ color: "var(--branco)" }}>Caxias do Sul</strong>{" "}
            para enfrentar o <strong style={{ color: "var(--branco)" }}>Juventude</strong>.
            O Paulistão acabou. A Série B começou, e o tombo da estreia foi um
            aviso:{" "}
            <strong style={{ color: "var(--amarelo)" }}>
              nome e medalha não sobem ninguém de divisão.
            </strong>
          </p>

          {/* ── FICHA TÉCNICA — CARD DE GUERRA ── */}
          <div
            className="fade-up delay-4"
            style={{
              background: "var(--preto-suave)",
              border: "1px solid var(--amarelo)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Header da ficha */}
            <div
              style={{
                background: "var(--amarelo)",
                padding: "0.75rem 1.5rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                className="font-display"
                style={{ color: "var(--preto)", fontSize: "1.3rem", letterSpacing: "0.08em" }}
              >
                FICHA TÉCNICA
              </span>
              <span
                className="font-condensed"
                style={{ color: "var(--preto)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.2em" }}
              >
                SÉRIE B 2026 · RD. 1
              </span>
            </div>

            {/* Conteúdo da ficha */}
            <div style={{ padding: "1.5rem" }}>
              {/* Placar resumo */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1.5rem",
                  paddingBottom: "1.25rem",
                  borderBottom: "1px solid #2a2a2a",
                }}
              >
                <span
                  className="font-condensed"
                  style={{ color: "var(--branco)", fontSize: "1.1rem", fontWeight: 700 }}
                >
                  {FICHA.mandante}
                </span>
                <span
                  className="font-display"
                  style={{ fontSize: "2rem", color: "var(--amarelo)" }}
                >
                  {FICHA.placarMandante} × {FICHA.placarVisitante}
                </span>
                <span
                  className="font-condensed"
                  style={{ color: "var(--amarelo)", fontSize: "1.1rem", fontWeight: 700 }}
                >
                  {FICHA.visitante}
                </span>
              </div>

              {/* Dados da partida */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "1rem",
                  marginBottom: "1.5rem",
                }}
              >
                {[
                  { label: "LOCAL", value: FICHA.local },
                  { label: "PÚBLICO", value: `${FICHA.publico} presentes` },
                  { label: "TÉCNICO", value: FICHA.tecnico },
                ].map((item) => (
                  <div key={item.label}>
                    <p
                      className="font-condensed"
                      style={{
                        margin: "0 0 0.2rem",
                        fontSize: "0.65rem",
                        letterSpacing: "0.2em",
                        color: "var(--amarelo)",
                        fontWeight: 700,
                      }}
                    >
                      {item.label}
                    </p>
                    <p
                      className="font-condensed"
                      style={{ margin: 0, fontSize: "0.9rem", color: "var(--branco)", fontWeight: 600 }}
                    >
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Gols compactos */}
              <div style={{ marginBottom: "1.5rem", borderTop: "1px solid #2a2a2a", paddingTop: "1.25rem" }}>
                <p
                  className="font-condensed"
                  style={{
                    margin: "0 0 0.75rem",
                    fontSize: "0.65rem",
                    letterSpacing: "0.2em",
                    color: "var(--amarelo)",
                    fontWeight: 700,
                  }}
                >
                  GOLS
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {FICHA.gols.map((gol, i) => (
                    <span
                      key={i}
                      className="font-condensed"
                      style={{
                        fontSize: "0.8rem",
                        padding: "0.3rem 0.75rem",
                        border: `1px solid ${gol.tipo === "proprio" ? "rgba(245,196,0,0.4)" : "rgba(229,53,53,0.4)"}`,
                        color: gol.tipo === "proprio" ? "var(--amarelo)" : "#E57373",
                        fontWeight: 600,
                      }}
                    >
                      {gol.jogador} {gol.tempo}/{gol.periodo}
                    </span>
                  ))}
                </div>
              </div>

              {/* Próximo jogo */}
              <div
                style={{
                  background: "rgba(245,196,0,0.07)",
                  border: "1px solid rgba(245,196,0,0.2)",
                  padding: "1rem 1.25rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                }}
              >
                <div>
                  <p
                    className="font-condensed"
                    style={{ margin: "0 0 0.2rem", fontSize: "0.65rem", letterSpacing: "0.2em", color: "var(--amarelo)", fontWeight: 700 }}
                  >
                    PRÓXIMO COMPROMISSO
                  </p>
                  <p
                    className="font-condensed"
                    style={{ margin: 0, color: "var(--branco)", fontSize: "1rem", fontWeight: 700 }}
                  >
                    vs {FICHA.proxJogo} · {FICHA.proxData}
                  </p>
                  <p
                    className="font-condensed"
                    style={{ margin: 0, color: "var(--cinza-texto)", fontSize: "0.8rem" }}
                  >
                    {FICHA.proxLocal}
                  </p>
                </div>
                <span
                  className="font-condensed"
                  style={{
                    background: "var(--amarelo)",
                    color: "var(--preto)",
                    fontSize: "0.7rem",
                    fontWeight: 800,
                    letterSpacing: "0.15em",
                    padding: "0.4rem 0.9rem",
                  }}
                >
                  SÉRIE B
                </span>
              </div>
            </div>
          </div>

          {/* ── RODAPÉ DO ARTIGO ── */}
          <div
            className="fade-up delay-5"
            style={{
              marginTop: "3rem",
              paddingTop: "1.5rem",
              borderTop: "1px solid #222",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "0.75rem",
            }}
          >
            <span
              className="font-condensed"
              style={{ color: "var(--cinza-texto)", fontSize: "0.75rem", letterSpacing: "0.1em" }}
            >
              © 2026 Portal O Novorizontino · Novo Horizonte, SP
            </span>
            <a
              href="https://www.onovorizontino.com.br"
              className="font-condensed"
              style={{
                color: "var(--amarelo)",
                fontSize: "0.75rem",
                letterSpacing: "0.15em",
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              VOLTAR AO PORTAL →
            </a>
          </div>
        </main>
      </div>
    </>
  );
}
    },
    {
      id: 'tyger-001',
      titulo: 'O VÍCIO DO VICE: APATIA E CASTIGO NO JORJÃO',
      slug: 'estreia-serie-b-novorizontino-x-londrina',
      categoria: 'Crônica',
      imagem: 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/sign/imagens-portal/vslondrina.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83YWRmNjZiNC02ZTNlLTRmYjQtOTk0ZC05YzFkYjNiYTQ0YzIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZW5zLXBvcnRhbC92c2xvbmRyaW5hLndlYnAiLCJpYXQiOjE3NzQzNzU0MDcsImV4cCI6MTgwNTkxMTQwN30.mAQzfFxhIUfHbW-_RkNrddSovLpysfXeHe3V6x5SZtI'
    },
    {
      id: '9e74dda1',
      titulo: 'O ACESSO É QUESTÃO DE HONRA: REPARAÇÃO HISTÓRICA 2026',
      slug: 'o-acesso-e-questao-de-honra-2026',
      categoria: 'Destaque',
      imagem: 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/sign/imagens-portal/destaque-honra.webp.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83YWRmNjZiNC02ZTNlLTRmYjQtOTk0ZC05YzFkYjNiYTQ0YzIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZW5zLXBvcnRhbC9kZXN0YXF1ZS1ob25yYS53ZWJwLnBuZyIsImlhdCI6MTc3NDE0NjM2NCwiZXhwIjoxODA1NjgyMzY0fQ.KuGvgD_8ITeZv4dQniaTO9yRek6WIZXlaPJJaAQmBWk'
    },
    {
      id: 'f6af5f16',
      titulo: 'O Tabuleiro de Enderson Moreira: Esquema 2026',
      slug: 'o-tabuleiro-de-enderson-moreira-2026',
      categoria: 'Análise Tática',
      imagem: 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/sign/imagens-portal/Enderson%20Moreira.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83YWRmNjZiNC02ZTNlLTRmYjQtOTk0ZC05YzFkYjNiYTQ0YzIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZW5zLXBvcnRhbC9FbmRlcnNvbiBNb3JlaXJhLndlYnAiLCJpYXQiOjE3NzQxNDYzNzIsImV4cCI6MTgwNTY4MjM3Mn0.lmSr3c20d5ypwtK3a2Tj6WFcrIan0Domoy6JXrMtw6M'
    },
    {
      id: 'c185a57a',
      titulo: 'A ARMADURA DE 2026: CONHEÇA OS GUERREIROS DO TIGRE',
      slug: 'os-escolhidos-reforcos-tigre-2026',
      categoria: 'Elenco',
      imagem: 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/sign/imagens-portal/reforcos.webp.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83YWRmNjZiNC02ZTNlLTRmYjQtOTk0ZC05YzFkYjNiYTQ0YzIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZW5zLXBvcnRhbC9yZWZvcmNvcy53ZWJwLndlYnAiLCJpYXQiOjE3NzQxMjY0NDIsImV4cCI6MTgwNTY2MjQ0Mn0.dUxEHfrMjNJiFvlRdkwi3-8K6NTfwHjP9mqEtGJG-YM'
    }
  ];

  return (
    <section className="relative z-20 w-full bg-black py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-10 border-l-8 border-yellow-500 pl-6">
          <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">Postagens</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {postagens.map((post, index) => (
            <Link 
              key={post.id} 
              href={`/noticias/${post.slug}`}
              className={`relative group cursor-pointer border border-white/10 bg-zinc-900 overflow-hidden ${index === 0 ? 'md:col-span-2 h-[500px]' : 'h-[350px]'}`}
            >
              <Image 
                src={post.imagem} 
                alt={post.titulo} 
                fill 
                className="object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
                unoptimized 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
              <div className="absolute bottom-0 p-6 z-20">
                <span className="bg-yellow-500 text-black px-2 py-0.5 font-black text-[10px] uppercase mb-2 inline-block italic">{post.categoria}</span>
                <h3 className={`${index === 0 ? 'text-4xl' : 'text-xl'} font-black uppercase italic leading-none text-white group-hover:text-yellow-500 transition-colors`}>
                  {post.titulo}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
