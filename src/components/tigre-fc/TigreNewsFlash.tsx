'use client';

import { useEffect, useState } from 'react';
import { supabase as sb } from '@/lib/supabase';

export default function TigreNewsFlash() {
  const [noticias, setNoticias] = useState<any[]>([]);

  useEffect(() => {
    async function fetchNews() {
      const { data } = await sb
        .from('postagens')
        .select('titulo')
        .eq('status', 'publicado')
        .order('criado_em', { ascending: false })
        .limit(5);
      
      if (data) setNoticias(data);
    }
    fetchNews();
  }, []);

  if (noticias.length === 0) return null;

  return (
    <div className="w-full bg-[#F5C400] overflow-hidden py-2 border-y border-black/10">
      <div className="flex whitespace-nowrap animate-marquee">
        {[...noticias, ...noticias].map((item, idx) => (
          <div key={idx} className="flex items-center mx-8">
            <span className="text-black font-black text-[11px] uppercase tracking-tighter italic">
              {item.titulo}
            </span>
            <span className="ml-8 text-black/30 font-black">//</span>
          </div>
        ))}
      </div>

      <style jsx>{`
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 30s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
