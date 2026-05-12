'use client';
// src/components/voxsports/VoxSportsPanel.tsx
// Painel interno — fila de copies do Léo em tempo real via Supabase Realtime.

import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

interface CopyItem {
  id: number;
  jogo_id: number | null;
  evento: string;
  titulo: string;
  copy: string;
  publicado: boolean;
  criado_em: string;
}

const EVENTO_BADGE: Record<string, { label: string; cor: string }> = {
  gol:       { label: 'GOL',       cor: 'bg-yellow-500 text-black' },
  vitória:   { label: 'VITÓRIA',   cor: 'bg-emerald-500 text-black' },
  empate:    { label: 'EMPATE',    cor: 'bg-zinc-500 text-white' },
  inicio:    { label: 'INÍCIO',    cor: 'bg-blue-500 text-white' },
  pênalti:   { label: 'PÊNALTI',  cor: 'bg-orange-500 text-black' },
  intervalo: { label: 'INTERVALO', cor: 'bg-purple-500 text-white' },
  clima:     { label: 'CLIMA',     cor: 'bg-cyan-500 text-black' },
  'pre-jogo':{ label: 'PRÉ-JOGO', cor: 'bg-indigo-500 text-white' },
};

function Badge({ evento }: { evento: string }) {
  const cfg = EVENTO_BADGE[evento] ?? { label: evento.toUpperCase(), cor: 'bg-zinc-700 text-white' };
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-black tracking-widest uppercase ${cfg.cor}`}>
      {cfg.label}
    </span>
  );
}

function formatTs(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
  });
}

function CopyCard({ item, onPublicar, onDeletar }: {
  item: CopyItem;
  onPublicar: (id: number) => Promise<void>;
  onDeletar:  (id: number) => Promise<void>;
}) {
  const [copiadoIdx, setCopiadoIdx] = useState<number | null>(null);
  const [loading, setLoading] = useState<'pub' | 'del' | null>(null);

  const copiar = async (texto: string, idx: number) => {
    await navigator.clipboard.writeText(texto);
    setCopiadoIdx(idx);
    setTimeout(() => setCopiadoIdx(null), 1800);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`rounded-2xl border p-4 flex flex-col gap-3 ${
        item.publicado
          ? 'border-emerald-800/50 bg-emerald-950/20'
          : 'border-zinc-800 bg-zinc-900/60'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge evento={item.evento} />
          {item.publicado && (
            <span className="text-[9px] font-black tracking-widest text-emerald-400 uppercase">✓ Publicado</span>
          )}
          {item.jogo_id && (
            <span className="text-[9px] text-zinc-600">jogo #{item.jogo_id}</span>
          )}
        </div>
        <span className="text-[10px] text-zinc-600 whitespace-nowrap">{formatTs(item.criado_em)}</span>
      </div>

      {/* Título */}
      <p className="text-white font-black text-sm leading-snug">{item.titulo}</p>

      {/* Copy */}
      <div className="relative bg-zinc-950 rounded-xl p-3 border border-zinc-800">
        <p className="text-zinc-300 text-xs leading-relaxed whitespace-pre-wrap pr-8">{item.copy}</p>
        <button
          onClick={() => copiar(item.copy, item.id)}
          className="absolute top-2 right-2 text-zinc-600 hover:text-yellow-400 transition-colors"
          title="Copiar texto"
        >
          {copiadoIdx === item.id
            ? <span className="text-[9px] font-black text-emerald-400">✓</span>
            : <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
          }
        </button>
      </div>

      {/* Ações */}
      {!item.publicado && (
        <div className="flex gap-2">
          <button
            disabled={loading !== null}
            onClick={async () => { setLoading('pub'); await onPublicar(item.id); setLoading(null); }}
            className="flex-1 py-2 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-black uppercase tracking-wider transition-colors disabled:opacity-50"
          >
            {loading === 'pub' ? 'Publicando...' : '✓ Publicar'}
          </button>
          <button
            disabled={loading !== null}
            onClick={async () => { setLoading('del'); await onDeletar(item.id); setLoading(null); }}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-red-900/60 text-zinc-400 hover:text-red-400 text-xs font-black uppercase tracking-wider transition-colors disabled:opacity-50"
          >
            {loading === 'del' ? '...' : '✕'}
          </button>
        </div>
      )}
    </motion.div>
  );
}

// ─── Painel principal ─────────────────────────────────────────────────────────

export default function VoxSportsPanel() {
  const [items, setItems]       = useState<CopyItem[]>([]);
  const [loading, setLoading]   = useState(true);
  const [filtro, setFiltro]     = useState<'todos' | 'pendentes' | 'publicados'>('pendentes');
  const [eventoFiltro, setEventoFiltro] = useState<string>('todos');

  const carregarFila = useCallback(async () => {
    const query = supabase
      .from('voxsports_fila')
      .select('*')
      .order('criado_em', { ascending: false })
      .limit(100);

    const { data } = await query;
    setItems((data ?? []) as CopyItem[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    carregarFila();

    // Realtime — atualiza automaticamente quando Léo gera um novo copy
    const channel = supabase
      .channel('voxsports_fila_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'voxsports_fila' }, () => {
        carregarFila();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [carregarFila]);

  const publicar = async (id: number) => {
    await fetch('/api/voxsports/publicar', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    await carregarFila();
  };

  const deletar = async (id: number) => {
    await fetch('/api/voxsports/publicar', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const eventos = ['todos', ...Array.from(new Set(items.map(i => i.evento)))];

  const visíveis = items.filter(i => {
    const passaFiltro = filtro === 'todos' ? true : filtro === 'pendentes' ? !i.publicado : i.publicado;
    const passaEvento = eventoFiltro === 'todos' || i.evento === eventoFiltro;
    return passaFiltro && passaEvento;
  });

  const pendentes  = items.filter(i => !i.publicado).length;
  const publicados = items.filter(i =>  i.publicado).length;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1.5 h-10 bg-yellow-500 rounded-full" />
          <div>
            <h1 className="text-2xl font-black italic uppercase tracking-tighter leading-none">
              VoxSports
            </h1>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">
              Fila de copies · Léo · É Nível Makarios 🐯❄️
            </p>
          </div>
          <div className="ml-auto flex gap-3 text-center">
            <div>
              <div className="text-yellow-400 font-black text-xl">{pendentes}</div>
              <div className="text-zinc-600 text-[9px] uppercase tracking-widest">Pendentes</div>
            </div>
            <div>
              <div className="text-emerald-400 font-black text-xl">{publicados}</div>
              <div className="text-zinc-600 text-[9px] uppercase tracking-widest">Publicados</div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(['pendentes', 'todos', 'publicados'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors ${
                filtro === f ? 'bg-yellow-500 text-black' : 'bg-zinc-900 text-zinc-500 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
          <div className="w-px bg-zinc-800 mx-1" />
          {eventos.map(e => (
            <button
              key={e}
              onClick={() => setEventoFiltro(e)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors ${
                eventoFiltro === e ? 'bg-zinc-700 text-white' : 'bg-zinc-900 text-zinc-600 hover:text-white'
              }`}
            >
              {e}
            </button>
          ))}
        </div>

        {/* Lista */}
        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => (
              <div key={i} className="h-40 rounded-2xl bg-zinc-900 animate-pulse" />
            ))}
          </div>
        ) : visíveis.length === 0 ? (
          <div className="text-center py-20 text-zinc-600">
            <p className="text-4xl mb-3">🐯</p>
            <p className="font-black uppercase tracking-widest text-sm">Fila vazia</p>
            <p className="text-xs mt-1">O Léo ainda não gerou nenhum copy com esse filtro.</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="space-y-3">
              {visíveis.map(item => (
                <CopyCard
                  key={item.id}
                  item={item}
                  onPublicar={publicar}
                  onDeletar={deletar}
                />
              ))}
            </div>
          </AnimatePresence>
        )}

      </div>
    </div>
  );
}
