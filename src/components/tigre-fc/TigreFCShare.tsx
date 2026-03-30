'use client';
import { useRef, useState } from 'react';

const LOGO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/tigre-fc-logo.png';
const ESCUDO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png';

type Props = {
  usuario: any;
  escalacao: any;
  palpite: { mandante: number; visitante: number };
  jogoId: number;
  onClose: () => void;
};

export default function TigreFCShare({ usuario, escalacao, palpite, jogoId, onClose }: Props) {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const [gerado, setGerado] = useState(false);
  const [imgUrl, setImgUrl] = useState('');
  const [gerando, setGerando] = useState(false);

  const gerarImagem = async () => {
    setGerando(true);
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    // Story 9:16 — 1080×1920
    canvas.width  = 1080;
    canvas.height = 1920;

    // Fundo
    ctx.fillStyle = '#080808';
    ctx.fillRect(0, 0, 1080, 1920);

    // Gradiente dourado no topo
    const grad = ctx.createLinearGradient(0, 0, 0, 400);
    grad.addColorStop(0, '#F5C40020');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1080, 400);

    // Linha topo
    ctx.fillStyle = '#F5C400';
    ctx.fillRect(0, 0, 1080, 8);

    // Logo
    try {
      const logo = await loadImage(LOGO);
      ctx.drawImage(logo, 60, 60, 100, 100);
    } catch {}

    // Título
    ctx.fillStyle = '#F5C400';
    ctx.font      = 'bold 52px system-ui, sans-serif';
    ctx.fillText('TIGRE FC', 180, 100);
    ctx.fillStyle = '#666';
    ctx.font      = '28px system-ui';
    ctx.fillText('Fantasy League · Novorizontino', 180, 145);

    // Nome do torcedor
    ctx.fillStyle = '#fff';
    ctx.font      = 'bold 72px system-ui';
    ctx.fillText((usuario?.apelido || usuario?.nome || 'TORCEDOR').toUpperCase(), 60, 260);

    // Nível
    const nivelColors: Record<string,string> = { Novato:'#6b7280', Fiel:'#F5C400', Garra:'#F5C400', Lenda:'#FFD700' };
    ctx.fillStyle = nivelColors[usuario?.nivel] || '#F5C400';
    ctx.font      = 'bold 36px system-ui';
    ctx.fillText(usuario?.nivel?.toUpperCase() || 'NOVATO', 60, 320);

    // Campo de futebol
    const campoX = 80, campoY = 380;
    const campoW = 920, campoH = Math.round(campoW * (105/68));

    // Fundo do campo
    ctx.fillStyle = '#2a7a2a';
    ctx.beginPath();
    ctx.roundRect(campoX, campoY, campoW, campoH, 16);
    ctx.fill();

    // Linhas do campo
    ctx.strokeStyle = 'rgba(255,255,255,0.25)';
    ctx.lineWidth   = 3;
    ctx.strokeRect(campoX + 20, campoY + 20, campoW - 40, campoH - 40);

    // Linha do meio
    ctx.beginPath();
    ctx.moveTo(campoX + 20, campoY + campoH/2);
    ctx.lineTo(campoX + campoW - 20, campoY + campoH/2);
    ctx.stroke();

    // Círculo central
    ctx.beginPath();
    ctx.arc(campoX + campoW/2, campoY + campoH/2, campoW * 0.12, 0, Math.PI * 2);
    ctx.stroke();

    // Jogadores no campo
    const slots433 = [
      { id:'gk', x:.50, y:.88 }, { id:'rb', x:.82, y:.70 }, { id:'cb1', x:.62, y:.70 },
      { id:'cb2', x:.38, y:.70 }, { id:'lb', x:.18, y:.70 }, { id:'cm1', x:.72, y:.50 },
      { id:'cm2', x:.50, y:.46 }, { id:'cm3', x:.28, y:.50 }, { id:'rw', x:.76, y:.24 },
      { id:'st', x:.50, y:.18 }, { id:'lw', x:.24, y:.24 },
    ];

    for (const slot of slots433) {
      const px = Math.round(slot.x * campoW);
      const py = Math.round(slot.y * campoH);
      const cx = campoX + px;
      const cy = campoY + py;
      const r  = 52;

      const playerData = escalacao?.lineup?.[slot.id];
      const playerId   = playerData?.id;
      const isCapitao  = escalacao?.capitao_id === playerId;
      const isHeroi    = escalacao?.heroi_id    === playerId;

      // Círculo do jogador
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle   = '#1a1a1a';
      ctx.fill();
      ctx.strokeStyle = isCapitao ? '#FFD700' : isHeroi ? '#60a5fa' : '#F5C400';
      ctx.lineWidth   = isCapitao || isHeroi ? 5 : 3;
      ctx.stroke();

      // Badge C ou H
      if (isCapitao) {
        ctx.beginPath();
        ctx.arc(cx + 36, cy - 36, 18, 0, Math.PI * 2);
        ctx.fillStyle = '#FFD700';
        ctx.fill();
        ctx.fillStyle = '#111';
        ctx.font = 'bold 20px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText('C', cx + 36, cy - 29);
        ctx.textAlign = 'left';
      } else if (isHeroi) {
        ctx.beginPath();
        ctx.arc(cx + 36, cy - 36, 18, 0, Math.PI * 2);
        ctx.fillStyle = '#60a5fa';
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 20px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText('H', cx + 36, cy - 29);
        ctx.textAlign = 'left';
      }

      // Nome do jogador
      if (playerData?.short) {
        ctx.fillStyle = isCapitao ? '#FFD700' : isHeroi ? '#60a5fa' : '#fff';
        ctx.font = 'bold 22px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText(playerData.short.toUpperCase(), cx, cy + r + 24);
        ctx.textAlign = 'left';
      }
    }

    // Palpite
    const py = campoY + campoH + 60;
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.roundRect(60, py, 960, 180, 12);
    ctx.fill();

    ctx.fillStyle = '#555';
    ctx.font      = '28px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('MEU PALPITE', 540, py + 48);
    ctx.fillStyle = '#F5C400';
    ctx.font      = 'bold 80px system-ui';
    ctx.fillText(`${palpite.mandante} × ${palpite.visitante}`, 540, py + 150);
    ctx.textAlign = 'left';

    // CTA
    const ctaY = py + 220;
    ctx.fillStyle = '#F5C400';
    ctx.font      = 'bold 38px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('Faça sua escalação!', 540, ctaY);
    ctx.fillStyle = '#555';
    ctx.font      = '30px system-ui';
    ctx.fillText('onovorizontino.com.br/tigre-fc', 540, ctaY + 52);
    ctx.textAlign = 'left';

    // Linha rodapé
    ctx.fillStyle = '#F5C400';
    ctx.fillRect(0, 1912, 1080, 8);

    setImgUrl(canvas.toDataURL('image/jpeg', 0.92));
    setGerado(true);
    setGerando(false);
  };

  const loadImage = (src: string): Promise<HTMLImageElement> =>
    new Promise((res, rej) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload  = () => res(img);
      img.onerror = rej;
      img.src = src;
    });

  const baixar = () => {
    const a = document.createElement('a');
    a.href     = imgUrl;
    a.download = 'tigre-fc-minha-escalacao.jpg';
    a.click();
  };

  const compartilharWhatsApp = () => {
    const texto = encodeURIComponent(
      `🐯 Minha escalação pro jogo do Tigre tá pronta!\n\nSou ${usuario?.apelido || usuario?.nome} no Tigre FC e meu palpite é ${palpite.mandante} × ${palpite.visitante}.\n\nDuvido você fazer mais pontos que eu! 😤\n\nFaça a sua: onovorizontino.com.br/tigre-fc`
    );
    window.open(`https://wa.me/?text=${texto}`, '_blank');
  };

  return (
    <div style={{ position:'fixed', inset:0, zIndex:9999, background:'rgba(0,0,0,0.9)', display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>

      <div style={{ width:'100%', maxWidth:400, background:'#0a0a0a', borderRadius:20, border:'1px solid #F5C400', overflow:'hidden' }}>

        {/* Header */}
        <div style={{ background:'#F5C400', padding:'14px 20px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ fontWeight:900, fontSize:16, color:'#111' }}>🐯 Convocação Confirmada!</div>
          <button onClick={onClose} style={{ background:'none', border:'none', fontSize:20, color:'#111', cursor:'pointer', fontWeight:900 }}>×</button>
        </div>

        <div style={{ padding:24 }}>
          <p style={{ fontSize:14, color:'#aaa', marginBottom:20, lineHeight:1.6 }}>
            Sua escalação foi salva! Gera a imagem para mandar no grupo e chamar mais torcedores.
          </p>

          {/* Canvas oculto para geração */}
          <canvas ref={canvasRef} style={{ display:'none' }} />

          {/* Preview */}
          {gerado && imgUrl && (
            <div style={{ marginBottom:20, borderRadius:12, overflow:'hidden', border:'1px solid #333' }}>
              <img src={imgUrl} style={{ width:'100%', display:'block' }} alt="Escalação" />
            </div>
          )}

          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {!gerado ? (
              <button onClick={gerarImagem} disabled={gerando}
                style={{ width:'100%', padding:'14px', background:'#F5C400', color:'#111', border:'none', borderRadius:12, fontWeight:900, fontSize:15, cursor:'pointer', textTransform:'uppercase', letterSpacing:1 }}>
                {gerando ? '⟳ Gerando imagem...' : '🎨 Gerar imagem do meu time'}
              </button>
            ) : (
              <>
                <button onClick={baixar}
                  style={{ width:'100%', padding:'14px', background:'#F5C400', color:'#111', border:'none', borderRadius:12, fontWeight:900, fontSize:14, cursor:'pointer', textTransform:'uppercase', letterSpacing:1 }}>
                  ⬇️ Baixar imagem
                </button>
                <button onClick={compartilharWhatsApp}
                  style={{ width:'100%', padding:'14px', background:'#25D366', color:'#fff', border:'none', borderRadius:12, fontWeight:900, fontSize:14, cursor:'pointer', textTransform:'uppercase', letterSpacing:1 }}>
                  📲 Enviar no WhatsApp
                </button>
                <button onClick={gerarImagem}
                  style={{ width:'100%', padding:'10px', background:'transparent', color:'#555', border:'1px solid #222', borderRadius:12, fontWeight:700, fontSize:13, cursor:'pointer' }}>
                  ↻ Regenerar
                </button>
              </>
            )}
            <button onClick={compartilharWhatsApp}
              style={{ width:'100%', padding:'12px', background:'transparent', color:'#25D366', border:'1px solid #25D36640', borderRadius:12, fontWeight:700, fontSize:13, cursor:'pointer' }}>
              Compartilhar só o link (sem imagem)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
