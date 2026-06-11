'use client';

/**
 * TigreFCShare v5.0 — PADRÃO PREMIUM "MENINA DOS OLHOS"
 * * Ajustes Aplicados:
 * 1. Foco exclusivo no lado DIREITO das fotos (comemoração).
 * 2. Círculos de atletas GIGANTES (Raio 85).
 * 3. Identidade real do Usuário (Google/Cadastro) no Header.
 * 4. Tipografia Georgia + System-UI com efeitos de Glow e Glassmorphism.
 * 5. Sem zoom interno, apenas crop lateral.
 */

import { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Assets ──────────────────────────────────────────────────────────────────

const ESCUDO_TIGRE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ESCUDOS/novorizontino.png';
const PATA_LOGO    = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/GARRA%20LOGO.png';

// ─── Formações ───────────────────────────────────────────────────────────────

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

type Player = { id: number; short: string; pos: string; foto: string; num: number; };

type Props = {
  usuario: {
    display_name?: string; apelido?: string; nome?: string;
    nivel?: string; xp?: number; avatar_url?: string;
  };
  escalacao: {
    formacao?: string; lineup_json?: Record<string, Player>;
    lineup?: Record<string, Player>; capitan_id?: number | null;
    heroi_id?: number | null; score_tigre?: number; score_adv?: number;
  };
  onClose: () => void;
  nomeAdversario?: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function loadImg(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Falha: ${src}`));
    img.src = src.includes('?') ? src : `${src}?cb=${Date.now()}`;
  });
}

/**
 * Função Premium: Desenha o círculo do jogador focando na METADE DIREITA (ação)
 */
function drawPlayerCircle(ctx: CanvasRenderingContext2D, img: HTMLImageElement, cx: number, cy: number, r: number) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();

  // Foco na DIREITA:
  const sWidth = img.width / 2;
  const sHeight = img.height;
  const sx = img.width / 2; // Começa no meio para pegar a direita

  const scale = (r * 2) / Math.min(sWidth, sHeight);
  const dW = sWidth * scale;
  const dH = sHeight * scale;

  ctx.drawImage(img, sx, 0, sWidth, sHeight, cx - dW / 2, cy - dH / 2, dW, dH);
  ctx.restore();
}

function drawCircleImage(ctx: CanvasRenderingContext2D, img: HTMLImageElement, cx: number, cy: number, r: number) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();
  const s = r * 2;
  ctx.drawImage(img, cx - r, cy - r, s, s);
  ctx.restore();
}

// ─── Desenhador Principal (Padrão Premium) ──────────────────────────────────

async function gerarCardCanvas(
  canvas: HTMLCanvasElement,
  usuario: Props['usuario'],
  escalacao: Props['escalacao'],
  nomeAdversario: string
): Promise<void> {
  const ctx = canvas.getContext('2d', { alpha: false })!;
  const W = 1080, H = 1920;
  canvas.width = W; canvas.height = H;

  // 1. FUNDO
  ctx.fillStyle = '#050505';
  ctx.fillRect(0, 0, W, H);

  // 2. HEADER DE IDENTIDADE (Usuário Logado)
  const nomeUsuario = (usuario.display_name || usuario.apelido || usuario.nome || 'TORCEDOR').toUpperCase();
  const avatarUrl = usuario.avatar_url;

  if (avatarUrl) {
    try {
      const imgAvatar = await loadImg(avatarUrl);
      ctx.strokeStyle = '#F5C400';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(150, 160, 80, 0, Math.PI * 2);
      ctx.stroke();
      drawCircleImage(ctx, imgAvatar, 150, 160, 75);
    } catch (e) {}
  }

  ctx.textAlign = 'left';
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 52px Georgia, serif';
  ctx.fillText(nomeUsuario, 260, 155);
  
  ctx.fillStyle = '#F5C400';
  ctx.font = 'bold 28px system-ui';
  ctx.fillText(`CONVOCADO • NÍVEL ${usuario.nivel?.toUpperCase() || 'NOVATO'}`, 260, 195);

  // 3. CAMPO
  const campoW = W - 100;
  const campoH = campoW * 1.45;
  const campoX = 50;
  const campoY = 320;

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(campoX, campoY, campoW, campoH, 40);
  ctx.clip();
  for (let i = 0; i < 12; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#123b10' : '#164a13';
    ctx.fillRect(campoX, campoY + (i * campoH/12), campoW, campoH/12);
  }
  const fieldGrad = ctx.createRadialGradient(W/2, campoY + campoH/2, 0, W/2, campoY + campoH/2, campoW);
  fieldGrad.addColorStop(0, 'rgba(255,255,255,0.05)');
  fieldGrad.addColorStop(1, 'rgba(0,0,0,0.4)');
  ctx.fillStyle = fieldGrad;
  ctx.fillRect(campoX, campoY, campoW, campoH);
  ctx.restore();

  // 4. JOGADORES (GIGANTES + DIREITA)
  const playerR = 85; 
  const lineup = escalacao.lineup_json ?? escalacao.lineup ?? {};
  const slots = FORMATIONS[escalacao.formacao || '4-3-3'];

  for (const slot of slots) {
    const player = lineup[slot.id];
    const cx = campoX + slot.x * campoW;
    const cy = campoY + slot.y * campoH;

    if (player?.foto) {
      try {
        const foto = await loadImg(player.foto);
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 30;
        ctx.shadowOffsetY = 15;

        ctx.beginPath();
        ctx.arc(cx, cy, playerR + 8, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        ctx.shadowBlur = 0;

        drawPlayerCircle(ctx, foto, cx, cy, playerR);

        const label = player.short.toUpperCase();
        ctx.font = 'bold 32px system-ui';
        const tw = ctx.measureText(label).width;
        ctx.fillStyle = 'rgba(0,0,0,0.85)';
        ctx.beginPath();
        ctx.roundRect(cx - (tw/2 + 20), cy + playerR + 15, tw + 40, 55, 12);
        ctx.fill();
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.fillText(label, cx, cy + playerR + 53);
      } catch (e) {}
    }
  }

  // 5. PLACAR
  const placarY = campoY + campoH + 100;
  ctx.textAlign = 'center';
  ctx.fillStyle = '#F5C400';
  ctx.font = 'bold 34px system-ui';
  ctx.fillText(`NOVORIZONTINO  ×  ${nomeAdversario.toUpperCase()}`, W/2, placarY - 10);

  const scoreT = String(escalacao.score_tigre ?? 0);
  const scoreA = String(escalacao.score_adv ?? 0);
  ctx.font = 'bold italic 180px Georgia, serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.shadowColor = 'rgba(245,196,0,0.5)';
  ctx.shadowBlur = 40;
  ctx.fillText(`${scoreT} : ${scoreA}`, W/2, placarY + 160);
  ctx.shadowBlur = 0;

  // 6. RODAPÉ
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.font = 'bold 30px system-ui';
  ctx.fillText('CONVOCAÇÃO OFICIAL TIGRE FC', W/2, H - 150);
  ctx.fillStyle = '#F5C400';
  ctx.font = '26px system-ui';
  ctx.fillText('onovorizontino.com.br/tigre-fc', W/2, H - 100);
}

// ─── Componente React ─────────────────────────────────────────────────────────

export default function TigreFCShare({ usuario, escalacao, onClose, nomeAdversario = 'Adversário' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imgUrl, setImgUrl] = useState('');
  const [gerando, setGerando] = useState(false);

  const gerar = useCallback(async () => {
    if (!canvasRef.current) return;
    setGerando(true);
    try {
      await gerarCardCanvas(canvasRef.current, usuario, escalacao, nomeAdversario);
      setImgUrl(canvasRef.current.toDataURL('image/jpeg', 0.95));
    } catch (e) {
      console.error(e);
    } finally {
      setGerando(false);
    }
  }, [usuario, escalacao, nomeAdversario]);

  const baixar = () => {
    const a = document.createElement('a');
    a.href = imgUrl;
    a.download = `tigre-fc-card.jpg`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm bg-zinc-950 rounded-[2rem] border border-zinc-800 overflow-hidden shadow-2xl p-5">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-white font-bold">Compartilhar Time</h2>
            <button onClick={onClose} className="text-zinc-500">✕</button>
        </div>

        <canvas ref={canvasRef} className="hidden" />

        {imgUrl ? (
          <div className="space-y-4">
            <img src={imgUrl} className="w-full rounded-2xl border border-zinc-800" alt="Card" />
            <button onClick={baixar} className="w-full py-4 bg-[#F5C400] text-black font-black rounded-xl uppercase tracking-tighter">
              Download do Card
            </button>
            <button onClick={() => setImgUrl('')} className="w-full text-zinc-500 text-xs uppercase font-bold">Gerar outro</button>
          </div>
        ) : (
          <button onClick={gerar} disabled={gerando} className="w-full py-12 border-2 border-dashed border-zinc-800 rounded-3xl text-zinc-500 font-bold hover:border-[#F5C400] hover:text-[#F5C400] transition-all">
            {gerando ? 'ESTILIZANDO CARD PREMIUM...' : 'CLIQUE PARA GERAR CARD'}
          </button>
        )}
      </motion.div>
    </div>
  );
}
