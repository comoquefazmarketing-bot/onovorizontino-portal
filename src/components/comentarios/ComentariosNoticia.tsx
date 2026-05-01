'use client';

import { useEffect, useState, useTransition } from 'react';
import { createClient, type Session } from '@supabase/supabase-js';
import Image from 'next/image';

/**
 * Comentários por matéria — Portal O Novorizontino
 *
 * Backend: tabela `comentarios_postagens` + RPCs
 *   - listar_comentarios_postagem(p_postagem_id)
 *   - comentario_postar(p_postagem_id, p_conteudo, p_parent_id?)
 *   - comentario_deletar(p_comentario_id)
 *   - comentario_denunciar(p_comentario_id)
 *
 * Auth: Google via Supabase Auth (mesmo do Tigre FC).
 * Visitante deslogado VÊ comentários mas não pode postar/responder.
 *
 * Dependências:
 *   npm install @supabase/supabase-js
 *
 * Variáveis de ambiente esperadas (já devem existir):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY
 *
 * Como usar:
 *   <ComentariosNoticia postagemId={post.id} />
 */

// ────── tipos ──────
type Comentario = {
  id: string;
  postagem_id: string;
  parent_id: string | null;
  usuario_id: string;
  apelido: string;
  avatar_url: string | null;
  nivel: string;
  conteudo: string;
  criado_em: string;
  atualizado_em: string;
  eh_resposta: boolean;
};

type Props = {
  postagemId: string;
};

// ────── client (lazy) ──────
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

// ────── helpers ──────
function tempoRelativo(iso: string) {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'agora';
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h`;
  const dias = Math.floor(h / 24);
  if (dias < 7) return `${dias}d`;
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

// ════════════════════════════════════════════════════════════════════
// COMPONENTE
// ════════════════════════════════════════════════════════════════════
export default function ComentariosNoticia({ postagemId }: Props) {
  const [supabase] = useState(getSupabase);
  const [session, setSession] = useState<Session | null>(null);
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [texto, setTexto] = useState('');
  const [respondendoA, setRespondendoA] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, startTransition] = useTransition();

  // Carrega sessão atual + listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) =>
      setSession(sess),
    );
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  // Carrega comentários
  const recarregar = async () => {
    setCarregando(true);
    const { data, error } = await supabase.rpc('listar_comentarios_postagem', {
      p_postagem_id: postagemId,
    });
    if (error) {
      setErro('Não foi possível carregar os comentários.');
      setCarregando(false);
      return;
    }
    setComentarios((data ?? []) as Comentario[]);
    setCarregando(false);
  };

  useEffect(() => {
    recarregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postagemId]);

  // Realtime: assina mudanças nesta postagem
  useEffect(() => {
    const canal = supabase
      .channel(`comentarios:${postagemId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comentarios_postagens',
          filter: `postagem_id=eq.${postagemId}`,
        },
        () => recarregar(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(canal);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postagemId, supabase]);

  // Login Google
  const loginGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.href },
    });
  };

  // Postar
  const postar = () => {
    if (!texto.trim()) return;
    setErro(null);
    startTransition(async () => {
      const { error } = await supabase.rpc('comentario_postar', {
        p_postagem_id: postagemId,
        p_conteudo: texto.trim(),
        p_parent_id: respondendoA,
      });
      if (error) {
        setErro(error.message ?? 'Erro ao publicar comentário');
        return;
      }
      setTexto('');
      setRespondendoA(null);
      await recarregar();
    });
  };

  // Deletar (autor)
  const deletar = async (id: string) => {
    if (!confirm('Apagar este comentário?')) return;
    const { error } = await supabase.rpc('comentario_deletar', {
      p_comentario_id: id,
    });
    if (error) {
      setErro(error.message);
      return;
    }
    await recarregar();
  };

  // Denunciar
  const denunciar = async (id: string) => {
    if (!session) {
      alert('Faça login para denunciar.');
      return;
    }
    if (!confirm('Denunciar este comentário?')) return;
    const { error } = await supabase.rpc('comentario_denunciar', {
      p_comentario_id: id,
    });
    if (error) {
      setErro(error.message);
      return;
    }
    alert('Denúncia registrada.');
    await recarregar();
  };

  // Agrupa: raízes + suas respostas
  const raizes = comentarios.filter((c) => !c.parent_id);
  const respostasDe = (parentId: string) =>
    comentarios.filter((c) => c.parent_id === parentId);

  // ────── render ──────
  return (
    <section
      id="comentarios"
      className="border-t border-white/5 bg-zinc-900/20 py-12 px-4"
    >
      <div className="max-w-3xl mx-auto">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#F5C400] text-[10px] font-black uppercase tracking-[0.5em]">
            🗣️ Bate-Bola da Torcida
          </h2>
          <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
            {comentarios.length}{' '}
            {comentarios.length === 1 ? 'comentário' : 'comentários'}
          </span>
        </div>

        {/* Form de comentário */}
        {session ? (
          <div className="mb-8 rounded-xl border border-white/5 bg-black/40 p-4">
            {respondendoA && (
              <div className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#F5C400]">
                <span>↳ Respondendo</span>
                <button
                  onClick={() => setRespondendoA(null)}
                  className="text-zinc-500 hover:text-white"
                  aria-label="Cancelar resposta"
                >
                  (cancelar)
                </button>
              </div>
            )}
            <textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              maxLength={2000}
              rows={3}
              placeholder={
                respondendoA
                  ? 'Sua resposta, torcedor…'
                  : 'Mete sua opinião, torcedor… (máx. 2000)'
              }
              className="w-full bg-zinc-950 text-zinc-200 text-sm rounded-md p-3
                         border border-white/5 focus:border-[#F5C400]/50
                         focus:outline-none resize-none placeholder-zinc-600"
            />
            <div className="flex items-center justify-between mt-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                {texto.length}/2000
              </span>
              <button
                onClick={postar}
                disabled={enviando || texto.trim().length < 2}
                className="bg-[#F5C400] disabled:bg-zinc-800 disabled:text-zinc-600
                           text-black text-[10px] font-black px-5 py-2.5
                           uppercase tracking-[0.2em] italic
                           hover:bg-yellow-400 transition-colors
                           disabled:cursor-not-allowed"
              >
                {enviando ? 'Postando…' : 'Postar'}
              </button>
            </div>
            {erro && (
              <p className="mt-2 text-xs text-red-400 font-bold">{erro}</p>
            )}
          </div>
        ) : (
          <div className="mb-8 rounded-xl border border-[#F5C400]/20 bg-black/40 p-6 text-center">
            <p className="text-zinc-300 text-sm mb-4">
              Faça login pra entrar no <strong>bate-bola</strong> e mostrar de que lado tá.
            </p>
            <button
              onClick={loginGoogle}
              className="bg-[#F5C400] text-black text-[10px] font-black px-6 py-3
                         uppercase tracking-[0.3em] italic hover:bg-yellow-400
                         transition-colors"
            >
              Entrar com Google
            </button>
          </div>
        )}

        {/* Lista de comentários */}
        {carregando ? (
          <p className="text-zinc-500 text-sm">Carregando…</p>
        ) : raizes.length === 0 ? (
          <p className="text-zinc-500 text-sm italic">
            Seja o primeiro a comentar.
          </p>
        ) : (
          <ul className="space-y-6">
            {raizes.map((c) => (
              <li
                key={c.id}
                className="rounded-xl border border-white/5 bg-black/30 p-4"
              >
                <ItemComentario
                  c={c}
                  euId={session?.user?.id}
                  onResponder={() => setRespondendoA(c.id)}
                  onDeletar={() => deletar(c.id)}
                  onDenunciar={() => denunciar(c.id)}
                />

                {/* Respostas */}
                {respostasDe(c.id).length > 0 && (
                  <ul className="mt-4 ml-6 pl-4 border-l-2 border-[#F5C400]/20 space-y-4">
                    {respostasDe(c.id).map((r) => (
                      <li key={r.id}>
                        <ItemComentario
                          c={r}
                          euId={session?.user?.id}
                          onDeletar={() => deletar(r.id)}
                          onDenunciar={() => denunciar(r.id)}
                          // sem onResponder em respostas (1 nível só)
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════
// SUB-COMPONENTE: item individual de comentário
// ════════════════════════════════════════════════════════════════════
function ItemComentario({
  c,
  euId,
  onResponder,
  onDeletar,
  onDenunciar,
}: {
  c: Comentario;
  euId?: string;
  onResponder?: () => void;
  onDeletar?: () => void;
  onDenunciar?: () => void;
}) {
  const meu = euId === c.usuario_id;

  return (
    <article className="flex gap-3">
      {/* Avatar */}
      <div className="shrink-0">
        {c.avatar_url ? (
          <Image
            src={c.avatar_url}
            alt={c.apelido}
            width={40}
            height={40}
            className="rounded-full ring-1 ring-[#F5C400]/30"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-[#F5C400] font-black text-sm">
            {c.apelido?.[0]?.toUpperCase() ?? '?'}
          </div>
        )}
      </div>

      {/* Corpo */}
      <div className="flex-1 min-w-0">
        <header className="flex items-center gap-2 flex-wrap">
          <span className="text-white font-black uppercase italic text-sm tracking-tight">
            {c.apelido}
          </span>
          <span className="text-[9px] font-black uppercase tracking-widest text-[#F5C400]/80 bg-[#F5C400]/10 px-1.5 py-0.5 rounded">
            {c.nivel}
          </span>
          <span className="text-zinc-600 text-xs">·</span>
          <span className="text-zinc-500 text-xs">{tempoRelativo(c.criado_em)}</span>
        </header>

        <p className="text-zinc-300 text-sm leading-relaxed mt-1 whitespace-pre-wrap break-words">
          {c.conteudo}
        </p>

        <footer className="flex items-center gap-3 mt-2">
          {onResponder && (
            <button
              onClick={onResponder}
              className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-[#F5C400] transition-colors"
            >
              Responder
            </button>
          )}
          {meu && onDeletar && (
            <button
              onClick={onDeletar}
              className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-red-400 transition-colors"
            >
              Apagar
            </button>
          )}
          {!meu && onDenunciar && (
            <button
              onClick={onDenunciar}
              className="text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-zinc-300 transition-colors"
              title="Denunciar"
            >
              ⚐ Denunciar
            </button>
          )}
        </footer>
      </div>
    </article>
  );
}
