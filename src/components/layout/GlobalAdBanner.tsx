'use client';

export default function GlobalAdBanner() {
  const VIDEO_URL = "https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/sign/imagens-portal/Encontre%20o%20lugar%20ideal%20(1280%20x%20100%20px)%20(1).mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83YWRmNjZiNC02ZTNlLTRmYjQtOTk0ZC05YzFkYjNiYTQ0YzIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZW5zLXBvcnRhbC9FbmNvbnRyZSBvIGx1Z2FyIGlkZWFsICgxMjgwIHggMTAwIHB4KSAoMSkubXA0IiwiaWF0IjoxNzc0NjM2MzE2LCJleHAiOjE4MDYxNzIzMTZ9.-6sjQURNz8kHVAaFg0CW6Ti0jltdiWF48v4bcVkGOMg";
  const VIDEO_FALLBACK = "https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/sign/imagens-portal/Encontre%20o%20lugar%20ideal%20(1280%20x%20100%20px).mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83YWRmNjZiNC02ZTNlLTRmYjQtOTk0ZC05YzFkYjNiYTQ0YzIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZW5zLXBvcnRhbC9FbmNvbnRyZSBvIGx1Z2FyIGlkZWFsICgxMjgwIHggMTAwIHB4KS5tcDQiLCJpYXQiOjE3NzQ2MzYzMjcsImV4cCI6MTgwNjE3MjMyN30.GN2Uyw4zYVzJq0Bd5uNF3X19ljiqp80-WltP-X27q5U";
  const LINK_URL = "https://www.borala.app.br/";

  return (
    <div className="w-full bg-black border-b border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 py-2">

        {/* Rótulo publicidade */}
        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 text-center mb-1">
          PUBLICIDADE
        </p>

        {/* Banner em vídeo clicável */}
        <a
          href={LINK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="block relative w-full overflow-hidden rounded-sm cursor-pointer group"
          style={{ height: '100px' }}
        >
          <video
            src={VIDEO_URL}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            onError={(e) => {
              const video = e.currentTarget;
              video.src = VIDEO_FALLBACK;
            }}
          />
          {/* Overlay sutil no hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
        </a>

      </div>
    </div>
  );
}
