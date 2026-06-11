import { supabaseAdmin } from '@/lib/supabase-admin';

export const revalidate = 120;

interface RankingRow {
  posicao: number;
  apelido: string;
  nome: string;
  avatar_url: string | null;
  pontos_total: number;
}

async function getRankingGeral(): Promise<RankingRow[]> {
  const { data } = await supabaseAdmin
    .from('tigre_fc_usuarios')
    .select('apelido, nome, avatar_url, pontos_total')
    .order('pontos_total', { ascending: false })
    .limit(50);

  return (data ?? []).map((u, i) => ({ ...u, posicao: i + 1 }));
}

export default async function RankingPage() {
  let ranking: RankingRow[] = [];
  try {
    ranking = await getRankingGeral();
  } catch {
    // degradação graciosa
  }

  return (
    <main className="min-h-screen bg-black text-white font-['Barlow_Condensed',sans-serif]">
      <div className="border-b border-yellow-500/20 px-4 py-6 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-yellow-500 mb-1">Arena Tigre FC</p>
        <h1 className="text-4xl font-black italic uppercase tracking-tight">
          Ranking <span className="text-yellow-500">Geral</span>
        </h1>
      </div>

      <div className="max-w-xl mx-auto px-4 py-8">
        {ranking.length === 0 ? (
          <div className="text-center text-gray-500 py-20">
            <p className="font-black uppercase text-lg">Nenhuma pontuação ainda</p>
            <p className="text-sm mt-1">Escale seu time e acumule pontos!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {ranking.map(row => (
              <div
                key={row.apelido}
                className={`flex items-center gap-4 rounded-xl px-4 py-3 border ${
                  row.posicao === 1 ? 'bg-yellow-500/10 border-yellow-500/40' :
                  row.posicao === 2 ? 'bg-zinc-800 border-zinc-700' :
                  row.posicao === 3 ? 'bg-zinc-900 border-zinc-800' :
                  'bg-zinc-950 border-zinc-900'
                }`}
              >
                <span className={`text-2xl font-black w-8 text-center ${
                  row.posicao === 1 ? 'text-yellow-500' : 'text-gray-500'
                }`}>
                  {row.posicao === 1 ? '🏆' : row.posicao === 2 ? '🥈' : row.posicao === 3 ? '🥉' : row.posicao}
                </span>

                {row.avatar_url ? (
                  <img src={row.avatar_url} alt="" className="w-9 h-9 rounded-full object-cover" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-zinc-700 flex items-center justify-center text-sm font-black">
                    {(row.apelido ?? row.nome)?.[0]?.toUpperCase()}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="font-black uppercase truncate">{row.apelido ?? row.nome}</p>
                </div>

                <span className={`text-xl font-black ${row.posicao <= 3 ? 'text-yellow-500' : 'text-white'}`}>
                  {row.pontos_total ?? 0}
                  <span className="text-xs text-gray-500 ml-1 font-normal">pts</span>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
