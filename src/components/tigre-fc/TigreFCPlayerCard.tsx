'use client';

type Player = {
  id: number;
  name: string;
  short: string;
  num: number;
  pos: string;
  foto: string;
};

type Props = {
  player: Player;
  size: number;
  isCapitao?: boolean;
  isHeroi?: boolean;
  isTopGoleador?: boolean; // top 3 gols da temporada
  selected?: boolean;
  onClick?: () => void;
};

export default function TigreFCPlayerCard({
  player, size, isCapitao, isHeroi, isTopGoleador, selected, onClick
}: Props) {
  const labelSize = Math.max(8, Math.round(size * 0.2));

  // Define borda e efeito baseado no status
  const getBorderColor = () => {
    if (isCapitao) return '#FFD700';
    if (isHeroi) return '#60a5fa';
    if (isTopGoleador) return '#4ade80';
    if (selected) return '#fff';
    return '#F5C400';
  };

  const getGlow = () => {
    if (isCapitao) return '0 0 12px rgba(255,215,0,.8), 0 0 24px rgba(255,215,0,.4)';
    if (isHeroi) return '0 0 12px rgba(96,165,250,.8), 0 0 24px rgba(96,165,250,.4)';
    if (isTopGoleador) return '0 0 8px rgba(74,222,128,.6)';
    return 'none';
  };

  const getBorderWidth = () => (isCapitao || isHeroi) ? '3px' : '2.5px';

  return (
    <>
      <style>{`
        @keyframes capitao-pulse { 0%,100%{box-shadow:0 0 10px rgba(255,215,0,.6),0 0 20px rgba(255,215,0,.3)} 50%{box-shadow:0 0 16px rgba(255,215,0,.9),0 0 32px rgba(255,215,0,.5)} }
        @keyframes heroi-pulse { 0%,100%{box-shadow:0 0 10px rgba(96,165,250,.6),0 0 20px rgba(96,165,250,.3)} 50%{box-shadow:0 0 16px rgba(96,165,250,.9),0 0 32px rgba(96,165,250,.5)} }
        @keyframes card-shimmer { 0%{background-position:-200% top} 100%{background-position:200% top} }
        .cap-glow { animation: capitao-pulse 1.5s ease-in-out infinite !important; }
        .heroi-glow { animation: heroi-pulse 1.5s ease-in-out infinite !important; }
      `}</style>

      <div
        onClick={onClick}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, cursor: onClick ? 'pointer' : 'default', position: 'relative' }}>

        {/* Badge flutuante */}
        {isCapitao && (
          <div style={{ position: 'absolute', top: -6, right: -6, zIndex: 20, width: 18, height: 18, borderRadius: '50%', background: '#FFD700', border: '2px solid #111', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 900, color: '#111', boxShadow: '0 0 8px rgba(255,215,0,.8)' }}>
            C
          </div>
        )}
        {isHeroi && !isCapitao && (
          <div style={{ position: 'absolute', top: -6, right: -6, zIndex: 20, width: 18, height: 18, borderRadius: '50%', background: '#60a5fa', border: '2px solid #111', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 900, color: '#fff', boxShadow: '0 0 8px rgba(96,165,250,.8)' }}>
            H
          </div>
        )}

        {/* Foto */}
        <div
          className={isCapitao ? 'cap-glow' : isHeroi ? 'heroi-glow' : ''}
          style={{
            width: size, height: size, borderRadius: '50%', overflow: 'hidden',
            border: `${getBorderWidth()} solid ${getBorderColor()}`,
            boxShadow: !isCapitao && !isHeroi ? getGlow() : undefined,
            position: 'relative', flexShrink: 0,
            background: 'rgba(0,0,0,0.4)',
          }}>
          <div style={{
            width: '100%', height: '100%',
            backgroundImage: `url(${player.foto})`,
            backgroundSize: '200% 100%',
            backgroundPosition: 'left top',
            backgroundRepeat: 'no-repeat',
          }} />

          {/* Shimmer dourado no capitão */}
          {isCapitao && (
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(105deg, transparent 40%, rgba(255,215,0,.25) 50%, transparent 60%)',
              backgroundSize: '200% 100%',
              animation: 'card-shimmer 2s linear infinite',
            }} />
          )}

          {/* Número */}
          <div style={{ position: 'absolute', bottom: -1, right: -1, width: 14, height: 14, borderRadius: '50%', background: '#000', border: `1px solid ${getBorderColor()}`, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <span style={{ color: getBorderColor(), fontSize: 5, fontWeight: 900 }}>{player.num}</span>
          </div>
        </div>

        {/* Nome */}
        <span style={{
          fontSize: labelSize, fontWeight: 900, color: isCapitao ? '#FFD700' : isHeroi ? '#60a5fa' : '#fff',
          textShadow: isCapitao ? '0 0 8px rgba(255,215,0,.8)' : isHeroi ? '0 0 8px rgba(96,165,250,.8)' : '0 1px 4px rgba(0,0,0,1)',
          textTransform: 'uppercase', whiteSpace: 'nowrap',
          maxWidth: size + 10, overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {player.short}
        </span>
      </div>
    </>
  );
}
