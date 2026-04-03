'use client';

/**
 * TigreFCShare v2 — Canvas API Nativo
 *
 * Story 9:16 (1080×1920) para Instagram/WhatsApp.
 * Desenha tudo via canvas: campo com listras + linhas, fotos dos jogadores
 * com clip circular, avatar do usuário, placar e branding premium.
 *
 * Zero dependências externas — mais robusto que html2canvas.
 */

import { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Assets ──────────────────────────────────────────────────────────────────

const ESCUDO_TIGRE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ESCUDOS/novorizontino.png';
const PATA_LOGO    = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/GARRA%20LOGO.png';

// ─── Formações (todas suportadas) ────────────────────────────────────────────

const FORMATIONS: Record<string, { id: string; x: number; y: number; pos: string }[]> = {
  '4-2-3-1': [
    { id: 'gk',  x: .50, y: .88, pos: 'GOL' },
    { id: 'rb',  x: .82, y: .68, pos: 'LAT' }, { id: 'cb1', x: .62, y: .75, pos: 'ZAG' }, { id: 'cb2', x: .38, y: .75, pos: 'ZAG' }, { id: 'lb', x: .18, y: .68, pos: 'LAT' },
    { id: 'dm1', x: .35, y: .57, pos: 'MEI' }, { id: 'dm2', x: .65, y: .57, pos: 'MEI' },
    { id: 'am1', x: .50, y: .38, pos: 'MEI' }, { id: 'rw',  x: .80, y: .27, pos: 'ATA' }, { id: 'lw',  x: .20, y: .27, pos: 'ATA' },
    { id: 'st',  x: .50, y: .13, pos: 'ATA' },
  ],
  '4-3-3': [
    { id: 'gk',  x: .50, y: .85, pos: 'GOL' },
    { id: 'rb',  x: .82, y: .65, pos: 'LAT' }, { id: 'cb1', x: .62, y: .72, pos: 'ZAG' }, { id: 'cb2', x: .38, y: .72, pos: 'ZAG' }, { id: 'lb', x: .18, y: .65, pos: 'LAT' },
    { id: 'm1',  x: .50, y: .50, pos: 'MEI' }, { id: 'm2',  x: .75, y: .42, pos: 'MEI' }, { id: 'm3',  x: .25, y: .42, pos: 'MEI' },
    { id: 'st',  x: .50, y: .13, pos: 'ATA' }, { id: 'rw',  x: .80, y: .20, pos: 'ATA' }, { id: 'lw',  x: .20, y: .20, pos: 'ATA' },
  ],
  '4-4-2': [
    { id: 'gk',  x: .50, y: .88, pos: 'GOL' },
    { id: 'rb',  x: .85, y: .68, pos: 'LAT' }, { id: 'cb1', x: .62, y: .75, pos: 'ZAG' }, { id: 'cb2', x: .38, y: .75, pos: 'ZAG' }, { id: 'lb', x: .15, y: .68, pos: 'LAT' },
    { id: 'm1',  x: .20, y: .48, pos: 'MEI' }, { id: 'm2',  x: .40, y: .48, pos: 'MEI' }, { id: 'm3',  x: .60, y: .48, pos: 'MEI' }, { id: 'm4', x: .80, y: .48, pos: 'MEI' },
    { id: 'st1', x: .35, y: .18, pos: 'ATA' }, { id: 'st2', x: .65, y: .18, pos: 'ATA' },
  ],
  '3-5-2': [
    { id: 'gk',  x: .50, y: .88, pos: 'GOL' },
    { id: 'cb1', x: .50, y: .75, pos: 'ZAG' }, { id: 'cb2', x: .75, y: .72, pos: 'ZAG' }, { id: 'cb3', x: .25, y: .72, pos: 'ZAG' },
    { id: 'm1',  x: .50, y: .52, pos: 'MEI' }, { id: 'm2',  x: .25, y: .46, pos: 'MEI' }, { id: 'm3',  x: .75, y: .46, pos: 'MEI' }, { id: 'm4', x: .10, y: .38, pos: 'MEI' }, { id: 'm5', x: .90, y: .38, pos: 'MEI' },
    { id: 'st1', x: .38, y: .18, pos: 'ATA' }, { id: 'st2', x: .62, y: .18, pos: 'ATA' },
  ],
  '5-4-1': [
    { id: 'gk',  x: .50, y: .88, pos: 'GOL' },
    { id: 'cb1', x: .50, y: .78, pos: 'ZAG' }, { id: 'cb2', x: .70, y: .75, pos: 'ZAG' }, { id: 'cb3', x: .30, y: .75, pos: 'ZAG' }, { id: 'rb', x: .88, y: .68, pos: 'LAT' }, { id: 'lb', x: .12, y: .68, pos: 'LAT' },
    { id: 'm1',  x: .35, y: .48, pos: 'MEI' }, { id: 'm2',  x: .65, y: .48, pos: 'MEI' }, { id: 'm3',  x: .15, y: .40, pos: 'MEI' }, { id: 'm4', x: .85, y: .40, pos: 'MEI' },
    { id: 'st',  x: .50, y: .18, pos: 'ATA' },
  ],
};

const POS_CORES: Record<string, string> = {
  GOL: '#F5C400', ZAG: '#3B82F6', LAT: '#06B6D4', MEI: '#22C55E', ATA: '#EF4444',
};

const NIVEL_CORES: Record<string, string> = {
  Novato: '#71717A', Torcedor: '#3B82F6', Fiel: '#F5C400',
  Fanático: '#EF4444', Lenda: '#9333EA',
};

// ─── Tipos ────────────────────────────────────────────────────────────────────

type Player = {
  id: number; short: string; pos: string; foto: string; num: number;
};

type Props = {
  usuario: {
    display_name?: string;
    apelido?: string;
    nome?: string;
    nivel?: string;
    xp?: number;
    avatar_url?: string;
  };
  escalacao: {
    formacao?: string;
    lineup_json?: Record<string, Player>;
    lineup?: Record<string, Player>;       // alias legado
    capitan_id?: number | null;
    capitao_id?: number | null;            // alias legado
    heroi_id?: number | null;
    score_tigre?: number;
    score_adv?: number;
    mandante?: number;                     // alias legado
    visitante?: number;                    // alias legado
  };
  onClose: () => void;
  nomeAdversario?: string;
};

// ─── Helper: carrega imagem com CORS ─────────────────────────────────────────

function loadImg(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img    = new Image();
    img.crossOrigin = 'anonymous';
    img.onload  = () => resolve(img);
    img.onerror = () => reject(new Error(`Falha: ${src}`));
    // Cache-bust para evitar CORS block em imagens cacheadas sem header
    img.src = src.includes('?') ? src : `${src}?cb=${Date.now()}`;
  });
}

// ─── Helper: clip circular ────────────────────────────────────────────────────

function drawCircleImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  cx: number, cy: number, r: number
) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();
  // Centraliza mantendo proporção
  const s = r * 2;
  ctx.drawImage(img, cx - r, cy - r, s, s);
  ctx.restore();
}

// ─── Desenhador principal ─────────────────────────────────────────────────────

async function gerarCardCanvas(
  canvas: HTMLCanvasElement,
  usuario: Props['usuario'],
  escalacao: Props['escalacao'],
  nomeAdversario: string
): Promise<void> {
  const ctx = canvas.getContext('2d')!;

  // Story 9:16
  const W = 1080, H = 1920;
  canvas.width  = W;
  canvas.height = H;

  // ── FUNDO ────────────────────────────────────────────────────────────────

  ctx.fillStyle = '#080808';
  ctx.fillRect(0, 0, W, H);

  // Gradiente diagonal de atmosfera
  const bgGrad = ctx.createRadialGradient(W * 0.5, H * 0.15, 0, W * 0.5, H * 0.15, W * 0.8);
  bgGrad.addColorStop(0,   'rgba(245,196,0,0.07)');
  bgGrad.addColorStop(0.6, 'rgba(0,0,0,0)');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // Grain sutil (noise)
  for (let i = 0; i < 12000; i++) {
    const gx = Math.random() * W;
    const gy = Math.random() * H;
    ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.018})`;
    ctx.fillRect(gx, gy, 1, 1);
  }

  // ── BARRA TOPO ────────────────────────────────────────────────────────────

  const topBar = ctx.createLinearGradient(0, 0, W, 0);
  topBar.addColorStop(0,   'transparent');
  topBar.addColorStop(0.3, '#F5C400');
  topBar.addColorStop(0.7, '#F5C400');
  topBar.addColorStop(1,   'transparent');
  ctx.fillStyle = topBar;
  ctx.fillRect(0, 0, W, 8);

  // ── HEADER: ESCUDO + TIGRE FC ─────────────────────────────────────────────

  let escudo: HTMLImageElement | null = null;
  let pataImg: HTMLImageElement | null = null;
  let avatarImg: HTMLImageElement | null = null;

  try { escudo  = await loadImg(ESCUDO_TIGRE); } catch {}
  try { pataImg = await loadImg(PATA_LOGO);    } catch {}

  const headerY = 60;

  if (escudo) {
    ctx.drawImage(escudo, 60, headerY, 110, 110);
  }

  // Tigre FC
  ctx.fillStyle = '#F5C400';
  ctx.font      = 'bold italic 72px Georgia, serif';
  ctx.fillText('TIGRE FC', 200, headerY + 68);

  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.font      = '32px system-ui';
  ctx.fillText('Fantasy League · Novorizontino', 200, headerY + 110);

  // ── SEPARADOR ─────────────────────────────────────────────────────────────

  const sep1Grad = ctx.createLinearGradient(0, 0, W, 0);
  sep1Grad.addColorStop(0, 'transparent');
  sep1Grad.addColorStop(0.5, 'rgba(245,196,0,0.4)');
  sep1Grad.addColorStop(1, 'transparent');
  ctx.fillStyle = sep1Grad;
  ctx.fillRect(60, 200, W - 120, 1);

  // ── PERFIL DO TORCEDOR ────────────────────────────────────────────────────

  const displayName = (usuario.apelido || usuario.display_name || usuario.nome || 'TORCEDOR').toUpperCase();
  const nivel       = usuario.nivel || 'Novato';
  const nivelCor    = NIVEL_CORES[nivel] ?? '#F5C400';
  const avatarUrl   = usuario.avatar_url
    || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}`;

  // Avatar circular
  try {
    avatarImg = await loadImg(avatarUrl);
  } catch {}

  const avatarX = 80, avatarY = 230, avatarR = 54;

  // Anel de nível
  ctx.beginPath();
  ctx.arc(avatarX + avatarR, avatarY + avatarR, avatarR + 5, 0, Math.PI * 2);
  ctx.strokeStyle = nivelCor;
  ctx.lineWidth   = 4;
  ctx.stroke();

  // Glow de nível
  ctx.shadowColor = nivelCor;
  ctx.shadowBlur  = 20;
  ctx.stroke();
  ctx.shadowBlur  = 0;

  if (avatarImg) {
    drawCircleImage(ctx, avatarImg, avatarX + avatarR, avatarY + avatarR, avatarR);
  } else {
    ctx.beginPath();
    ctx.arc(avatarX + avatarR, avatarY + avatarR, avatarR, 0, Math.PI * 2);
    ctx.fillStyle = '#222';
    ctx.fill();
  }

  // Nome e nível
  ctx.fillStyle = '#FFFFFF';
  ctx.font      = 'bold 56px Georgia, serif';
  ctx.fillText(displayName, avatarX + avatarR * 2 + 24, avatarY + 50);

  ctx.fillStyle = nivelCor;
  ctx.font      = 'bold 30px system-ui';
  ctx.fillText(`${nivel.toUpperCase()} · ${usuario.xp ?? 0} XP`, avatarX + avatarR * 2 + 24, avatarY + 96);

  // ── CAMPO ─────────────────────────────────────────────────────────────────

  const campoX = 60;
  const campoY = 360;
  const campoW = W - 120;
  const campoH = Math.round(campoW * (105 / 68)); // proporção real FIFA

  // Fundo do campo com listras
  const stripeCount = 10;
  const stripeH     = campoH / stripeCount;
  const campoRadius = 20;

  // Clip arredondado para o campo inteiro
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(campoX, campoY, campoW, campoH, campoRadius);
  ctx.clip();

  for (let i = 0; i < stripeCount; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#1a5218' : '#1f6b1d';
    ctx.fillRect(campoX, campoY + i * stripeH, campoW, stripeH);
  }

  // Textura grain no gramado
  for (let i = 0; i < 6000; i++) {
    const gx = campoX + Math.random() * campoW;
    const gy = campoY + Math.random() * campoH;
    ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.06})`;
    ctx.fillRect(gx, gy, 1.5, 1.5);
  }

  // Iluminação central (refletores)
  const fieldGlow = ctx.createRadialGradient(
    campoX + campoW / 2, campoY + campoH / 2, 0,
    campoX + campoW / 2, campoY + campoH / 2, campoW * 0.7
  );
  fieldGlow.addColorStop(0,   'rgba(255,255,220,0.08)');
  fieldGlow.addColorStop(0.6, 'rgba(0,0,0,0)');
  fieldGlow.addColorStop(1,   'rgba(0,0,0,0.35)');
  ctx.fillStyle = fieldGlow;
  ctx.fillRect(campoX, campoY, campoW, campoH);

  ctx.restore(); // fim clip campo

  // ── LINHAS DO CAMPO (neon branco) ─────────────────────────────────────────

  const lw = 3; // espessura das linhas
  ctx.strokeStyle = 'rgba(255,255,255,0.65)';
  ctx.lineWidth   = lw;
  ctx.shadowColor = 'rgba(255,255,255,0.3)';
  ctx.shadowBlur  = 6;

  const mg = 28; // margem interna

  // Borda externa
  ctx.beginPath();
  ctx.roundRect(campoX + mg, campoY + mg, campoW - mg * 2, campoH - mg * 2, 6);
  ctx.stroke();

  // Linha do meio
  ctx.beginPath();
  ctx.moveTo(campoX + mg, campoY + campoH / 2);
  ctx.lineTo(campoX + campoW - mg, campoY + campoH / 2);
  ctx.stroke();

  // Círculo central
  const circR = campoW * 0.10;
  ctx.beginPath();
  ctx.arc(campoX + campoW / 2, campoY + campoH / 2, circR, 0, Math.PI * 2);
  ctx.stroke();

  // Ponto central
  ctx.beginPath();
  ctx.arc(campoX + campoW / 2, campoY + campoH / 2, 8, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.fill();

  // Área superior (grande)
  const areaW = campoW * 0.55;
  const areaH = campoH * 0.15;
  ctx.strokeStyle = 'rgba(255,255,255,0.65)';
  ctx.beginPath();
  ctx.strokeRect(campoX + (campoW - areaW) / 2, campoY + mg, areaW, areaH);

  // Área inferior (grande)
  ctx.beginPath();
  ctx.strokeRect(campoX + (campoW - areaW) / 2, campoY + campoH - mg - areaH, areaW, areaH);

  // Pequena área superior
  const smallW = campoW * 0.28, smallH = campoH * 0.06;
  ctx.beginPath();
  ctx.strokeRect(campoX + (campoW - smallW) / 2, campoY + mg, smallW, smallH);
  ctx.beginPath();
  ctx.strokeRect(campoX + (campoW - smallW) / 2, campoY + campoH - mg - smallH, smallW, smallH);

  // Pontos de pênalti
  [[0.5, 0.79], [0.5, 0.21]].forEach(([px, py]) => {
    ctx.beginPath();
    ctx.arc(campoX + px * campoW, campoY + py * campoH, 7, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.fill();
  });

  // Cantos
  [[mg, mg], [campoW - mg, mg], [mg, campoH - mg], [campoW - mg, campoH - mg]].forEach(([cx, cy]) => {
    ctx.beginPath();
    ctx.arc(campoX + cx, campoY + cy, 18, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.stroke();
  });

  // Marca d'água Pata
  if (pataImg) {
    ctx.save();
    ctx.globalAlpha = 0.055;
    const pw = 220;
    ctx.drawImage(pataImg, campoX + campoW / 2 - pw / 2, campoY + campoH / 2 - pw / 2, pw, pw);
    ctx.restore();
  }

  ctx.shadowBlur = 0;

  // ── JOGADORES NO CAMPO ────────────────────────────────────────────────────

  const lineup   = escalacao.lineup_json ?? escalacao.lineup ?? {};
  const formacao = escalacao.formacao ?? '4-3-3';
  const slots    = FORMATIONS[formacao] ?? FORMATIONS['4-3-3'];
  const capitaoId = escalacao.capitan_id ?? escalacao.capitao_id ?? null;
  const heroiId   = escalacao.heroi_id   ?? null;

  const playerR = 46; // raio do círculo do jogador

  for (const slot of slots) {
    const player    = lineup[slot.id] as Player | undefined;
    const cx        = campoX + slot.x * campoW;
    const cy        = campoY + slot.y * campoH;
    const isCap     = player && player.id === capitaoId;
    const isHero    = player && player.id === heroiId;
    const posCor    = POS_CORES[slot.pos] ?? '#888';
    const borderCor = isCap ? '#F5C400' : isHero ? '#00F3FF' : posCor;

    // Sombra projetada do jogador
    ctx.beginPath();
    ctx.arc(cx, cy + 6, playerR, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.filter    = 'blur(8px)';
    ctx.fill();
    ctx.filter    = 'none';

    // Círculo de fundo
    ctx.beginPath();
    ctx.arc(cx, cy, playerR, 0, Math.PI * 2);
    ctx.fillStyle = '#111111';
    ctx.fill();

    // Foto do jogador (com clip circular)
    if (player?.foto) {
      try {
        const foto = await loadImg(player.foto);
        drawCircleImage(ctx, foto, cx, cy, playerR - 3);
      } catch {
        // Fallback: inicial do nome
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.arc(cx, cy, playerR - 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = posCor;
        ctx.font      = `bold 36px system-ui`;
        ctx.textAlign = 'center';
        ctx.fillText((player.short?.[0] ?? slot.pos[0]).toUpperCase(), cx, cy + 13);
        ctx.textAlign = 'left';
      }
    } else {
      // Slot vazio
      ctx.beginPath();
      ctx.arc(cx, cy, playerR - 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.04)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.setLineDash([6, 4]);
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle   = 'rgba(255,255,255,0.2)';
      ctx.font        = 'bold 22px system-ui';
      ctx.textAlign   = 'center';
      ctx.fillText(slot.pos, cx, cy + 8);
      ctx.textAlign   = 'left';
      continue;
    }

    // Borda colorida por posição / capitão / herói
    ctx.beginPath();
    ctx.arc(cx, cy, playerR, 0, Math.PI * 2);
    ctx.strokeStyle = borderCor;
    ctx.lineWidth   = isCap || isHero ? 5 : 3;
    ctx.shadowColor = borderCor;
    ctx.shadowBlur  = isCap || isHero ? 18 : 8;
    ctx.stroke();
    ctx.shadowBlur  = 0;

    // Badge C ou H
    if (isCap || isHero) {
      const bx = cx + playerR * 0.65, by = cy - playerR * 0.65;
      ctx.beginPath();
      ctx.arc(bx, by, 18, 0, Math.PI * 2);
      ctx.fillStyle   = isCap ? '#F5C400' : '#00F3FF';
      ctx.shadowColor = isCap ? '#F5C400' : '#00F3FF';
      ctx.shadowBlur  = 12;
      ctx.fill();
      ctx.shadowBlur  = 0;
      ctx.fillStyle   = '#000';
      ctx.font        = 'bold 20px system-ui';
      ctx.textAlign   = 'center';
      ctx.fillText(isCap ? 'C' : 'H', bx, by + 7);
      ctx.textAlign   = 'left';
    }

    // Nome abaixo do círculo
    if (player?.short) {
      const label    = player.short.toUpperCase();
      const fontSize = 22;
      ctx.font       = `bold ${fontSize}px system-ui`;
      const tw = ctx.measureText(label).width;

      // Fundo semitransparente atrás do nome
      ctx.fillStyle = 'rgba(0,0,0,0.65)';
      ctx.beginPath();
      ctx.roundRect(cx - tw / 2 - 8, cy + playerR + 6, tw + 16, fontSize + 10, 6);
      ctx.fill();

      ctx.fillStyle = isCap ? '#F5C400' : isHero ? '#00F3FF' : '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(label, cx, cy + playerR + 24);
      ctx.textAlign = 'left';
    }
  }

  // ── PLACAR ────────────────────────────────────────────────────────────────

  const scoreTigre = escalacao.score_tigre ?? escalacao.mandante  ?? 0;
  const scoreAdv   = escalacao.score_adv   ?? escalacao.visitante ?? 0;

  const placarY = campoY + campoH + 48;
  const placarH = 200;

  // Card de fundo
  ctx.fillStyle = 'rgba(255,255,255,0.03)';
  ctx.beginPath();
  ctx.roundRect(60, placarY, W - 120, placarH, 20);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.07)';
  ctx.lineWidth   = 1;
  ctx.stroke();

  // Escudo Tigre
  if (escudo) {
    ctx.drawImage(escudo, 100, placarY + 40, 80, 80);
  }

  // Placar central
  ctx.fillStyle = '#F5C400';
  ctx.font      = 'bold italic 100px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.shadowColor = '#F5C400';
  ctx.shadowBlur  = 30;
  ctx.fillText(String(scoreTigre), W / 2 - 80, placarY + 130);
  ctx.shadowBlur  = 0;

  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.font      = 'bold 60px Georgia, serif';
  ctx.fillText(':', W / 2, placarY + 120);

  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.font      = 'bold italic 100px Georgia, serif';
  ctx.fillText(String(scoreAdv), W / 2 + 80, placarY + 130);

  ctx.fillStyle = '#F5C400';
  ctx.font      = 'bold 22px system-ui';
  ctx.fillText('MEU PALPITE', W / 2, placarY + 28);

  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.font      = '20px system-ui';
  ctx.fillText(`Novorizontino  ×  ${nomeAdversario}`, W / 2, placarY + 172);
  ctx.textAlign = 'left';

  // ── FORMAÇÃO BADGE ────────────────────────────────────────────────────────

  const badgeY = placarY + placarH + 30;
  ctx.fillStyle = 'rgba(245,196,0,0.1)';
  ctx.beginPath();
  const badgeLabel = formacao;
  ctx.font = 'bold 26px system-ui';
  const badgeW = ctx.measureText(badgeLabel).width + 48;
  ctx.roundRect(W / 2 - badgeW / 2, badgeY, badgeW, 46, 23);
  ctx.fill();
  ctx.strokeStyle = 'rgba(245,196,0,0.35)';
  ctx.lineWidth   = 1;
  ctx.stroke();
  ctx.fillStyle   = '#F5C400';
  ctx.textAlign   = 'center';
  ctx.fillText(badgeLabel, W / 2, badgeY + 32);
  ctx.textAlign   = 'left';

  // ── CTA ───────────────────────────────────────────────────────────────────

  const ctaY = H - 220;

  // Linha separadora
  const sep2 = ctx.createLinearGradient(0, 0, W, 0);
  sep2.addColorStop(0, 'transparent');
  sep2.addColorStop(0.5, 'rgba(245,196,0,0.3)');
  sep2.addColorStop(1, 'transparent');
  ctx.fillStyle = sep2;
  ctx.fillRect(60, ctaY - 30, W - 120, 1);

  ctx.fillStyle = '#F5C400';
  ctx.font      = 'bold italic 44px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('Faça sua escalação!', W / 2, ctaY + 20);

  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.font      = '30px system-ui';
  ctx.fillText('onovorizontino.com.br/tigre-fc', W / 2, ctaY + 70);

  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  ctx.font      = '24px system-ui';
  ctx.fillText('#TigreFC  #Novorizontino', W / 2, ctaY + 118);
  ctx.textAlign = 'left';

  // ── BARRA RODAPÉ ──────────────────────────────────────────────────────────

  const botBar = ctx.createLinearGradient(0, 0, W, 0);
  botBar.addColorStop(0,   'transparent');
  botBar.addColorStop(0.3, '#F5C400');
  botBar.addColorStop(0.7, '#F5C400');
  botBar.addColorStop(1,   'transparent');
  ctx.fillStyle = botBar;
  ctx.fillRect(0, H - 8, W, 8);
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function TigreFCShare({ usuario, escalacao, onClose, nomeAdversario = 'Adversário' }: Props) {
  const canvasRef           = useRef<HTMLCanvasElement>(null);
  const [gerado,  setGerado]  = useState(false);
  const [imgUrl,  setImgUrl]  = useState('');
  const [gerando, setGerando] = useState(false);
  const [erro,    setErro]    = useState('');

  const gerar = useCallback(async () => {
    if (!canvasRef.current) return;
    setGerando(true);
    setErro('');
    try {
      await gerarCardCanvas(canvasRef.current, usuario, escalacao, nomeAdversario);
      setImgUrl(canvasRef.current.toDataURL('image/jpeg', 0.93));
      setGerado(true);
    } catch (e) {
      console.error(e);
      setErro('Erro ao gerar imagem. Tente novamente.');
    } finally {
      setGerando(false);
    }
  }, [usuario, escalacao, nomeAdversario]);

  const baixar = useCallback(() => {
    if (!imgUrl) return;
    const a      = document.createElement('a');
    a.href       = imgUrl;
    a.download   = `tigre-fc-${(usuario.apelido || usuario.display_name || 'meu-time').replace(/\s+/g, '-').toLowerCase()}.jpg`;
    a.click();
  }, [imgUrl, usuario]);

  const compartilharNativo = useCallback(async () => {
    if (!imgUrl) return;
    try {
      const blob = await (await fetch(imgUrl)).blob();
      const file = new File([blob], 'tigre-fc-escalacao.jpg', { type: 'image/jpeg' });
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Tigre FC — Minha Escalação',
          text:  `Minha escalação pro próximo jogo do Tigre! Palpite: ${escalacao.score_tigre ?? 0}×${escalacao.score_adv ?? 0} #TigreFC`,
        });
      } else {
        baixar();
      }
    } catch {}
  }, [imgUrl, escalacao, baixar]);

  const compartilharWhatsApp = useCallback(() => {
    const nome  = usuario.apelido || usuario.display_name || usuario.nome || 'Um torcedor';
    const st    = escalacao.score_tigre ?? escalacao.mandante  ?? 0;
    const sa    = escalacao.score_adv   ?? escalacao.visitante ?? 0;
    const texto = encodeURIComponent(
      `🐯 Minha escalação pro jogo do Tigre tá pronta!\n\nSou ${nome} no Tigre FC e meu palpite é ${st} × ${sa}.\n\nDuvido você fazer mais pontos que eu! 😤\n\nFaça a sua: onovorizontino.com.br/tigre-fc`
    );
    window.open(`https://wa.me/?text=${texto}`, '_blank');
  }, [usuario, escalacao]);

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1,   y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
        className="w-full max-w-sm bg-zinc-950 rounded-[2rem] border border-zinc-800 overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="relative flex items-center justify-between px-6 py-4 border-b border-zinc-900"
          style={{ background: 'linear-gradient(135deg, rgba(245,196,0,0.08), transparent)' }}>
          <div className="flex items-center gap-3">
            <img src={ESCUDO_TIGRE} className="w-8 h-8 object-contain" alt="" />
            <div>
              <p className="text-white font-black italic uppercase tracking-tighter text-sm leading-none">Convocação Confirmada</p>
              <p className="text-zinc-600 text-[9px] uppercase tracking-widest font-bold mt-0.5">Tigre FC · Fantasy League</p>
            </div>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition text-lg font-light">
            ✕
          </button>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-zinc-500 text-xs leading-relaxed">
            Gera o card da sua escalação para mandar no grupo e chamar mais torcedores para o portal! 🐯
          </p>

          {/* Canvas oculto */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Preview */}
          <AnimatePresence>
            {gerado && imgUrl && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="rounded-2xl overflow-hidden border border-zinc-800 shadow-xl"
              >
                <img src={imgUrl} className="w-full block" alt="Card de escalação" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Erro */}
          {erro && (
            <p className="text-red-400 text-xs font-bold text-center bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">
              {erro}
            </p>
          )}

          {/* Botões */}
          <div className="flex flex-col gap-2.5">

            {!gerado ? (
              /* ─ GERAR ─ */
              <motion.button
                onClick={gerar}
                disabled={gerando}
                whileTap={{ scale: 0.97 }}
                animate={!gerando ? {
                  boxShadow: ['0 0 15px rgba(245,196,0,0.2)', '0 0 30px rgba(245,196,0,0.45)', '0 0 15px rgba(245,196,0,0.2)'],
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
                className="relative w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest overflow-hidden transition-all"
                style={{ background: 'linear-gradient(135deg, #F5C400, #D97706)', color: '#000' }}
              >
                {/* Shimmer */}
                {!gerando && (
                  <motion.div
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 pointer-events-none"
                  />
                )}
                <span className="relative flex items-center justify-center gap-2">
                  {gerando ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      Gerando card...
                    </>
                  ) : (
                    '🎨 Gerar Card do Meu Time'
                  )}
                </span>
              </motion.button>

            ) : (
              /* ─ COMPARTILHAR ─ */
              <>
                {/* Compartilhar nativo (mobile) / Download (desktop) */}
                <motion.button
                  onClick={compartilharNativo}
                  whileTap={{ scale: 0.97 }}
                  animate={{
                    boxShadow: ['0 0 15px rgba(245,196,0,0.2)', '0 0 35px rgba(245,196,0,0.5)', '0 0 15px rgba(245,196,0,0.2)'],
                  }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                  className="relative w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, #F5C400, #D97706)', color: '#000' }}
                >
                  <motion.div
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 pointer-events-none"
                  />
                  <span className="relative flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Compartilhar Agora
                  </span>
                </motion.button>

                {/* WhatsApp */}
                <button onClick={compartilharWhatsApp}
                  className="w-full py-3.5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95"
                  style={{ background: '#25D366', color: '#fff', boxShadow: '0 0 20px rgba(37,211,102,0.25)' }}>
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm.029 18.88a9.896 9.896 0 01-4.988-1.34L3 18.5l1.004-3.952A9.929 9.929 0 012.07 12.03C2.07 6.545 6.545 2.07 12.029 2.07c2.651 0 5.142 1.033 7.018 2.909a9.895 9.895 0 012.903 7.01c0 5.486-4.475 9.891-9.921 9.891z"/>
                    </svg>
                    Enviar no WhatsApp
                  </span>
                </button>

                {/* Download */}
                <button onClick={baixar}
                  className="w-full py-3 rounded-2xl font-bold text-xs uppercase tracking-widest border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-600 transition-all active:scale-95">
                  ⬇ Salvar imagem
                </button>

                {/* Regenerar */}
                <button onClick={gerar}
                  className="w-full py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest text-zinc-700 hover:text-zinc-400 transition">
                  ↻ Regenerar
                </button>
              </>
            )}

            {/* WhatsApp sem imagem (sempre visível) */}
            <button onClick={compartilharWhatsApp}
              className="w-full py-2.5 rounded-xl font-bold text-xs border border-zinc-900 text-zinc-600 hover:text-green-400 hover:border-green-500/20 transition">
              Compartilhar só o link (sem imagem)
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
