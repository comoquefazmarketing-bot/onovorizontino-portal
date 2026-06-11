'use client';

import { useState } from 'react';

interface PostRaso {
  id: string;
  titulo: string;
  slug: string;
  status: string;
  criado_em: string;
  chars: number;
  tem_imagem: boolean;
  motivo: string;
}

interface AuditoriaResult {
  total_posts: number;
  total_rasos: number;
  limite_chars: number;
  posts_rasos: PostRaso[];
}

interface LimpezaResult {
  sucesso?: boolean;
  deletados?: number;
  slugs_removidos?: string[];
  mensagem?: string;
  erro?: string;
}

export default function LimparPostsPage() {
  const [secret, setSecret] = useState('');
  const [auditoria, setAuditoria] = useState<AuditoriaResult | null>(null);
  const [resultado, setResultado] = useState<LimpezaResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [fase, setFase] = useState<'idle' | 'auditado' | 'deletado'>('idle');

  async function auditar() {
    if (!secret) return;
    setLoading(true);
    setAuditoria(null);
    setResultado(null);
    try {
      const res = await fetch(`/api/admin/auditoria-posts?secret=${encodeURIComponent(secret)}`);
      const data = await res.json();
      if (res.ok) {
        setAuditoria(data);
        setFase('auditado');
      } else {
        setResultado({ erro: data.erro || 'Erro desconhecido' });
      }
    } finally {
      setLoading(false);
    }
  }

  async function executarLimpeza() {
    if (!secret || !auditoria) return;
    if (!confirm(`Tem certeza? Isso vai DELETAR PERMANENTEMENTE ${auditoria.total_rasos} posts do banco de dados. Esta ação é irreversível.`)) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/limpar-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret, confirmar: true }),
      });
      const data = await res.json();
      setResultado(data);
      if (data.sucesso) {
        setFase('deletado');
        setAuditoria(null);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen bg-black text-white p-6"
      style={{ fontFamily: "'Barlow Condensed', system-ui, sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,700;0,900;1,900&display=swap');`}</style>

      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h1 className="text-5xl font-black italic uppercase tracking-tighter text-yellow-500 leading-none">
            Limpeza de Posts
          </h1>
          <p className="text-zinc-400 text-sm mt-2">
            Identifica e remove posts com conteúdo raso (&lt;300 chars) ou sem imagem de capa.
            Necessário para aprovação no Google AdSense.
          </p>
        </div>

        {/* Auth */}
        <div className="flex gap-3 mb-8">
          <input
            type="password"
            placeholder="ADMIN_SECRET"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm font-mono focus:border-yellow-500 focus:outline-none"
          />
          <button
            onClick={auditar}
            disabled={loading || !secret}
            className="bg-yellow-500 hover:bg-yellow-400 disabled:opacity-40 text-black font-black text-sm uppercase tracking-widest px-8 py-3 rounded-xl transition-all whitespace-nowrap"
          >
            {loading && fase === 'idle' ? 'Auditando...' : 'Auditar Posts'}
          </button>
        </div>

        {/* Resultado de erro */}
        {resultado?.erro && (
          <div className="mb-6 p-5 bg-red-950 border border-red-500 rounded-2xl">
            <p className="text-red-400 font-black uppercase text-sm">Erro: {resultado.erro}</p>
          </div>
        )}

        {/* Resultado de sucesso pós-delete */}
        {fase === 'deletado' && resultado?.sucesso && (
          <div className="mb-6 p-6 bg-green-950 border border-green-500 rounded-2xl">
            <p className="text-green-400 font-black uppercase text-xl mb-2">
              ✅ {resultado.deletados} posts deletados com sucesso!
            </p>
            <p className="text-zinc-400 text-xs mb-4">
              O sitemap será regenerado automaticamente na próxima visita. O Google irá desindexar os slugs removidos gradualmente.
            </p>
            {resultado.slugs_removidos && resultado.slugs_removidos.length > 0 && (
              <details className="mt-2">
                <summary className="text-zinc-500 text-xs cursor-pointer font-bold uppercase tracking-widest">
                  Ver slugs removidos ({resultado.slugs_removidos.length})
                </summary>
                <div className="mt-3 max-h-48 overflow-y-auto space-y-1">
                  {resultado.slugs_removidos.map((s) => (
                    <p key={s} className="text-zinc-600 text-xs font-mono">/{s}</p>
                  ))}
                </div>
              </details>
            )}
          </div>
        )}

        {/* Resultado da auditoria */}
        {auditoria && fase === 'auditado' && (
          <>
            {/* Cards de resumo */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="p-5 bg-white/[0.03] border border-white/5 rounded-2xl text-center">
                <p className="text-3xl font-black text-white">{auditoria.total_posts}</p>
                <p className="text-zinc-500 text-[9px] font-black uppercase tracking-widest mt-1">Total de posts</p>
              </div>
              <div className="p-5 bg-red-950/40 border border-red-500/30 rounded-2xl text-center">
                <p className="text-3xl font-black text-red-400">{auditoria.total_rasos}</p>
                <p className="text-zinc-500 text-[9px] font-black uppercase tracking-widest mt-1">Posts rasos / sem imagem</p>
              </div>
              <div className="p-5 bg-green-950/40 border border-green-500/30 rounded-2xl text-center">
                <p className="text-3xl font-black text-green-400">{auditoria.total_posts - auditoria.total_rasos}</p>
                <p className="text-zinc-500 text-[9px] font-black uppercase tracking-widest mt-1">Posts que ficam</p>
              </div>
            </div>

            {auditoria.total_rasos === 0 ? (
              <div className="p-6 bg-green-950 border border-green-500 rounded-2xl text-center">
                <p className="text-green-400 font-black uppercase">Nenhum post raso encontrado! O banco está limpo.</p>
              </div>
            ) : (
              <>
                {/* Botão de deleção */}
                <div className="mb-6 p-5 bg-red-950/30 border border-red-500/40 rounded-2xl flex items-center justify-between gap-4">
                  <div>
                    <p className="text-red-400 font-black uppercase text-sm">
                      Deletar permanentemente {auditoria.total_rasos} posts
                    </p>
                    <p className="text-zinc-500 text-xs mt-1">Esta ação é irreversível. Faça backup antes se necessário.</p>
                  </div>
                  <button
                    onClick={executarLimpeza}
                    disabled={loading}
                    className="flex-shrink-0 bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white font-black text-sm uppercase tracking-widest px-8 py-3 rounded-xl transition-all"
                  >
                    {loading ? 'Deletando...' : '🗑️ Executar Limpeza'}
                  </button>
                </div>

                {/* Lista dos posts rasos */}
                <div>
                  <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-4">
                    Posts que serão removidos ({auditoria.total_rasos})
                  </p>
                  <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                    {auditoria.posts_rasos.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-start gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:border-red-500/20 transition-all"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-black text-sm truncate">{p.titulo || '(sem título)'}</p>
                          <p className="text-zinc-600 text-[10px] font-mono mt-0.5">/noticias/{p.slug}</p>
                        </div>
                        <div className="flex-shrink-0 flex items-center gap-3 text-right">
                          <div className="text-right">
                            <p className="text-red-400 text-xs font-black">{p.chars} chars</p>
                            <p className="text-zinc-600 text-[9px]">
                              {p.tem_imagem ? '✅ imagem' : '❌ sem imagem'}
                            </p>
                          </div>
                          <span className="px-2 py-1 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-[8px] font-black uppercase whitespace-nowrap">
                            {p.motivo}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
