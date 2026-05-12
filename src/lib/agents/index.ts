// src/lib/agents/index.ts
// Equipe de IA do ecossistema TigreFC / O Novorizontino.
//
//  Léo    — MarketAgent   — Marketing & Social (copies, hype, VoxSports)
//  Carlos — AuditorAgent  — Back-office & Data Integrity (Supabase, RLS, jogadores)
//  Bruno  — DealerAgent   — Growth & Retention (notificações, usuários inativos)
//  Ana    — AnaAgent      — Escalação Inteligente (sugere XI, analisa lineup, ranking)

export { MarketAgent, generateHypeScript, generateBatchHype, ASSINATURA } from './MarketAgent';
export type { GameContext, HypeScript }                                    from './MarketAgent';

export { AuditorAgent, validarEscalacoes, syncStatusJogadores, auditoriaCompleta } from './AuditorAgent';
export type { AuditLog, EscalacaoRow, JogadorStatus }                              from './AuditorAgent';

export { DealerAgent, detectarInativos, gerarNotificacoes, rodarCampanha } from './DealerAgent';
export type { UsuarioInativo, PushPayload, CampanhaResult }                from './DealerAgent';

export { AnaAgent, sugerirEscalacao, analisarEscalacao, rankingElenco } from './AnaAgent';
export type { Player, SlotSuggestion, SuggestedLineup, AnalysisReport } from './AnaAgent';

// ─── Time completo ────────────────────────────────────────────────────────────

import { MarketAgent }  from './MarketAgent';
import { AuditorAgent } from './AuditorAgent';
import { DealerAgent }  from './DealerAgent';
import { AnaAgent }     from './AnaAgent';

export const Equipe = {
  leo:    MarketAgent,
  carlos: AuditorAgent,
  bruno:  DealerAgent,
  ana:    AnaAgent,

  apresentar(): void {
    [MarketAgent, AuditorAgent, DealerAgent, AnaAgent].forEach(a => {
      console.log(`👤 ${a.name} — ${a.role} (v${a.version})`);
    });
    console.log('É Nível Makarios! 🐯❄️');
  },
} as const;
