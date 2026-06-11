'use client';
export default function ShortsTigre() {
  const shorts = [
    { id: 1, thumb: 'https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg', titulo: 'MAIOR SURPRESA DE 2026' },
    { id: 2, thumb: 'https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg', titulo: 'HINO E TORCIDA NO JORJÃO' },
    { id: 3, thumb: 'https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg', titulo: 'L.C. GOIANO: O MITO' },
    { id: 4, thumb: 'https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg', titulo: 'GRITO DE GUERRA TIGRE' },
    { id: 5, thumb: 'https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg', titulo: 'BASTIDORES DO ACESSO' },
  ];

  return (
    <div className="py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1.5 h-6 bg-yellow-500 rounded-full" />
        <h2 className="text-2xl font-black italic uppercase text-white tracking-tighter">Shorts do <span className="text-yellow-500">Tigre</span></h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {shorts.map((video) => (
          <div key={video.id} className="group cursor-pointer relative aspect-[9/16] bg-[#111] rounded-2xl overflow-hidden border border-white/5 hover:border-yellow-500/50 transition-all">
            <img src={video.thumb} className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
               <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                  <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-white border-b-[8px] border-b-transparent ml-1" />
               </div>
            </div>
            <p className="absolute bottom-4 left-4 right-4 text-[10px] font-bold text-white uppercase leading-tight">{video.titulo}</p>
          </div>
        ))}
      </div>
    </div>
  );
}