'use client';
import React from 'react';

export default function VideoSection() {
  return (
    <div className="w-full bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800 my-10">
      <div className="flex items-center gap-4 mb-6">
        <div className="h-8 w-2 bg-yellow-500 rounded-full"></div>
        <h2 className="text-white font-black italic uppercase text-3xl tracking-tighter">Tigre TV</h2>
      </div>
      <div className="aspect-video w-full rounded-2xl overflow-hidden border-4 border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.3)]">
        <iframe 
          src="https://www.youtube.com/embed/videoseries?list=UU6lH7W_M_pU0z0_U_I_V_VQ" 
          className="w-full h-full"
          allowFullScreen
        />
      </div>
    </div>
  );
}