'use client';
import React from 'react';
export default function MainShortsSection() {
  const vids = [
    { id: 'y67NY0bJ-Yk', t: 'PREPARAÇÃO INTENSIVA' },
    { id: '2ds_0uOHlu0', t: 'HINO E TORCIDA NO JORJÃO' },
    { id: 'j983i0Sww2Y', t: 'GOL DA VITÓRIA' },
    { id: 'PLCfkciq3TE', t: 'GRITO DE GUERRA TIGRE' },
    { id: 'yP-BeKxW4wY', t: 'BASTIDORES DO ACESSO' }
  ];
  return (
    <section className="py-20 bg-black">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-1.5 h-8 bg-yellow-500"></div>
        <h2 className="text-white font-black italic uppercase text-3xl tracking-tighter">Shorts do Tigre</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
        {vids.map((v) => (
          <div key={v.id} className="relative aspect-[9/16] rounded-xl overflow-hidden border border-zinc-800 group hover:border-yellow-500 transition-all">
            <iframe src={"https://www.youtube.com/embed/" + v.id} className="absolute inset-0 w-full h-full object-cover" title={v.t} />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 pointer-events-none"></div>
            <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
               <p className="text-white font-black italic uppercase text-[10px] leading-tight">{v.t}</p>
               <p className="text-yellow-500 text-[8px] font-bold mt-1 uppercase">Tigre TV</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}