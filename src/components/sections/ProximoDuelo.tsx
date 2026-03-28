'use client';
import { useEffect, useState } from 'react';

type Time = { nome: string; escudo_url: string; cor_primaria: string };
type Jogo = {
  id: number;
  competicao: string;
  rodada: string;
  data_hora: string;
  local: string;
  mandante: Time;
  visitante: Time;
};

function formatDataHora(iso: string) {
  const d = new Date(iso);
  const dias = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
  const dia = String(d.getDate()).padStart(2,'0');
  const mes = String(d.getMonth()+1).padStart(2,'0');
  const hora = String(d.getHours()).padStart(2,'0');
  const min = String(d.getMinutes()).padStart(2,'0');
  return {
    diaSemana: dias[d.getDay()],
    data: `${dia}/${mes}`,
    horario: `${hora}h${min === '00' ? '' : min}`,
    isHoje: new Date().toDateString() === d.toDateString(),
  };
}

export default function ProximoDuelo({ onJogoSelect }: {
  onJogoSelect?: (jogo: Jogo) => void;
}) {
  const [jogos, setJogos] = useState<Jogo[]>([]);
  const [selected, setSelected] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/proximo-jogo')
      .then(r => r.json())
      .then(({ jogos }) => {
        setJogos(jogos || []);
        if (jogos?.[0] && onJogoSelect) onJogoSelect(jogos[0]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = (i: number) => {
    setSelected(i);
    if (onJogoSelect) onJogoSelect(jogos[i]);
  };

  if (loading) {
    return (
      <div className="mb-5 rounded-xl border border-zinc-800 bg-zinc-900/50 h-32 animate-pulse" />
    );
  }

  if (jogos.length === 0) return null;

  const jogo = jogos[selected];
  const { diaSemana, data, horario, isHoje } = formatDataHora(jogo.data_hora);

  return (
    <div className="mb-5">
      {/* Tabs */}
      {jogos.length > 1 && (
        <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar">
          {jogos.map((j, i) => {
            const { diaSemana, data } = formatDataHora(j.data_hora);
            return (
              <button
                key={j.id}
                onClick={() => handleSelect(i)}
                className={`flex-shrink-0 px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded transition-all ${
                  selected === i ? 'bg-yellow-500 text-black' : 'border border-zinc-800 text-zinc-500'
                }`}
              >
                {j.competicao} • {diaSemana}, {data}
              </button>
            );
          })}
        </div>
      )}

      {/* Card */}
      <div className="relative overflow-hidden rounded-xl border border-zinc-800" style={{ background: 'linear-gradient(135deg,#0f0f0f,#1a1200)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-3 pb-1">
          <div className="flex items-center gap-2">
            {isHoje && (
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-red-500 text-[9px] font-black uppercase tracking-widest">Hoje</span>
              </span>
            )}
            <span className="text-zinc-500 text-[9px] font-black uppercase tracking-widest">
              {jogo.competicao} • {jogo.rodada}
            </span>
          </div>
          <span className="text-zinc-600 text-[9px] font-black uppercase tracking-widest hidden sm:block">
            {jogo.local}
          </span>
        </div>

        {/* Confronto */}
        <div className="flex items-center justify-between px-4 py-4">
          {/* Mandante */}
          <div className="flex flex-col items-center gap-2 flex-1">
            <img
              src={jogo.mandante.escudo_url}
              alt={jogo.mandante.nome}
              className="w-14 h-14 object-contain drop-shadow-lg"
            />
            <span className="text-white text-[10px] font-black uppercase text-center leading-tight">
              {jogo.mandante.nome}
            </span>
          </div>

          {/* Horário */}
          <div className="flex flex-col items-center gap-1 px-3">
            <span className="text-yellow-500 text-2xl font-black tracking-tighter">{horario}</span>
            <span className="text-zinc-600 text-[9px] font-black uppercase tracking-widest">
              {diaSemana}, {data}
            </span>
            <div className="flex items-center gap-1 mt-1">
              <div className="h-px w-5 bg-zinc-700" />
              <span className="text-zinc-700 text-[9px] font-black">VS</span>
              <div className="h-px w-5 bg-zinc-700" />
            </div>
          </div>

          {/* Visitante */}
          <div className="flex flex-col items-center gap-2 flex-1">
            <img
              src={jogo.visitante.escudo_url}
              alt={jogo.visitante.nome}
              className="w-14 h-14 object-contain drop-shadow-lg"
            />
            <span className="text-yellow-500 text-[10px] font-black uppercase text-center leading-tight">
              {jogo.visitante.nome}
            </span>
          </div>
        </div>

        {/* Local mobile */}
        <p className="text-zinc-700 text-[9px] font-black uppercase tracking-widest text-center pb-2 sm:hidden">
          {jogo.local}
        </p>

        {/* CTA */}
        <div className="px-4 pb-3">
          <p className="text-zinc-600 text-[9px] font-black uppercase tracking-widest text-center">
            Monte sua escalação ideal para este jogo abaixo
          </p>
        </div>

        {/* Borda decorativa */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />
      </div>
    </div>
  );
}
