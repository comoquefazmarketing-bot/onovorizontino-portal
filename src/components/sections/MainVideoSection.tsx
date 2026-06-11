import React from 'react';
import { createClient } from '@/utils/supabase/server';

export default async function MainVideoSection() {
  const supabase = await createClient();

  const { data: videos } = await supabase
    .from('videos')
    .select('*')
    .eq('ativo', true)
    .order('created_at', { ascending: false })
    .limit(5);

  if (!videos || videos.length === 0) return null;

  return (
    <section className="py-12 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-8 w-2 bg-yellow-500 rounded-full"></div>
          <h2 className="text-white font-black italic uppercase text-3xl tracking-tighter">TIGRE TV</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {videos.map((vid) => (
            <div key={vid.id} className="group relative">
              <div className="relative aspect-[9/16] w-full overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 transition-all duration-500 group-hover:border-yellow-500">
                <iframe
                  src={"https://www.youtube.com/embed/" + vid.youtube_id}
                  className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                ></iframe>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none"></div>
                <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
                  <p className="text-white font-black italic uppercase text-[10px] leading-tight">
                    {vid.titulo}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
