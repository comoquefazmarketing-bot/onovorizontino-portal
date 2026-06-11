/**
 * LIMPEZA DE POSTS RASOS — Portal O Novorizontino
 *
 * Uso:
 *   node scripts/limpar-posts.mjs                  → modo dry-run (só lista)
 *   node scripts/limpar-posts.mjs --confirmar       → deleta permanentemente
 *
 * Pré-requisito: defina as variáveis de ambiente antes de rodar:
 *   export SUPABASE_URL="https://whoglnpvqjbaczgnebbn.supabase.co"
 *   export SUPABASE_SERVICE_ROLE_KEY="eyJ..."   ← Project Settings → API → service_role
 */

const SUPA_URL = process.env.SUPABASE_URL || 'https://whoglnpvqjbaczgnebbn.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const LIMITE_CHARS = 300;
const CONFIRMAR = process.argv.includes('--confirmar');

// ─── helpers ───────────────────────────────────────────────────────────────

function supa(path, options = {}) {
  if (!SERVICE_KEY) {
    throw new Error(
      '\n❌ SUPABASE_SERVICE_ROLE_KEY não definida.\n' +
      '   Vá em: Supabase → Project Settings → API → service_role (secret)\n' +
      '   Depois: export SUPABASE_SERVICE_ROLE_KEY="eyJ..."\n',
    );
  }
  return fetch(`${SUPA_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      ...(options.headers || {}),
    },
  });
}

function stripHtml(html) {
  return (html || '').replace(/<[^>]*>/g, '').trim();
}

function ehRaso(post) {
  const chars = stripHtml(post.conteudo).length;
  const semImagem = !post.imagem_capa || post.imagem_capa.trim() === '';
  return chars < LIMITE_CHARS || semImagem;
}

function motivo(post) {
  const m = [];
  if (stripHtml(post.conteudo).length < LIMITE_CHARS)
    m.push(`${stripHtml(post.conteudo).length} chars (< ${LIMITE_CHARS})`);
  if (!post.imagem_capa || post.imagem_capa.trim() === '') m.push('sem imagem');
  return m.join(' + ');
}

// ─── main ──────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🔍 Conectando ao Supabase...');

  // 1. Busca todos os posts
  const res = await supa(
    'postagens?select=id,titulo,slug,conteudo,imagem_capa,criado_em,status&limit=5000',
  );

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Supabase retornou ${res.status}: ${txt}`);
  }

  const posts = await res.json();
  console.log(`📦 Total de posts no banco: ${posts.length}`);

  // 2. Filtra rasos
  const rasos = posts.filter(ehRaso);
  const bons = posts.length - rasos.length;

  console.log(`✅ Posts com conteúdo real: ${bons}`);
  console.log(`🗑️  Posts rasos (serão removidos): ${rasos.length}`);

  if (rasos.length === 0) {
    console.log('\n✨ Banco já está limpo! Nenhum post raso encontrado.\n');
    return;
  }

  // 3. Mostra lista dos rasos
  console.log('\n──────────────────────────────────────────────────────────');
  console.log('POSTS QUE SERÃO REMOVIDOS:');
  console.log('──────────────────────────────────────────────────────────');
  rasos.forEach((p, i) => {
    const titulo = (p.titulo || '(sem título)').substring(0, 60);
    console.log(`${String(i + 1).padStart(3)}. ${titulo}`);
    console.log(`     slug: /noticias/${p.slug}`);
    console.log(`     motivo: ${motivo(p)}`);
  });
  console.log('──────────────────────────────────────────────────────────');

  if (!CONFIRMAR) {
    console.log('\n⚠️  MODO DRY-RUN — nenhum dado foi alterado.');
    console.log('   Para executar a limpeza de verdade, rode:');
    console.log('   node scripts/limpar-posts.mjs --confirmar\n');
    return;
  }

  // 4. Deleta em lotes de 100
  console.log('\n🗑️  Iniciando deleção...');
  const ids = rasos.map((p) => p.id);
  const slugs = rasos.map((p) => p.slug);
  const LOTE = 100;
  let deletados = 0;

  for (let i = 0; i < ids.length; i += LOTE) {
    const lote = ids.slice(i, i + LOTE);
    const idsStr = lote.map((id) => `"${id}"`).join(',');
    const del = await supa(`postagens?id=in.(${idsStr})`, { method: 'DELETE' });
    if (!del.ok) {
      const txt = await del.text();
      console.error(`  ❌ Erro no lote ${i / LOTE + 1}: ${del.status} ${txt}`);
    } else {
      deletados += lote.length;
      console.log(`  ✅ Lote ${Math.floor(i / LOTE) + 1}: ${lote.length} posts deletados`);
    }
  }

  // 5. Registra slugs removidos (para 410 Gone no middleware)
  console.log('\n📋 Registrando slugs removidos para resposta 410...');
  const slugRows = slugs.map((slug) => ({ slug, removido_em: new Date().toISOString() }));
  const regRes = await supa('slugs_removidos?on_conflict=slug', {
    method: 'POST',
    body: JSON.stringify(slugRows),
    headers: { Prefer: 'resolution=merge-duplicates' },
  });

  if (!regRes.ok) {
    const txt = await regRes.text();
    if (txt.includes('does not exist') || txt.includes('relation')) {
      console.warn('  ⚠️  Tabela slugs_removidos não existe ainda.');
      console.warn('      Execute no SQL Editor do Supabase:');
      console.warn('      CREATE TABLE slugs_removidos (slug TEXT PRIMARY KEY, removido_em TIMESTAMPTZ DEFAULT now());');
    } else {
      console.warn(`  ⚠️  Não foi possível registrar slugs: ${txt}`);
    }
  } else {
    console.log(`  ✅ ${slugs.length} slugs registrados`);
  }

  console.log(`\n✨ LIMPEZA CONCLUÍDA`);
  console.log(`   Posts deletados: ${deletados}`);
  console.log(`   Posts restantes: ${bons}`);
  console.log(`   O sitemap será regenerado automaticamente na próxima visita.\n`);
}

main().catch((err) => {
  console.error('\n❌', err.message);
  process.exit(1);
});
