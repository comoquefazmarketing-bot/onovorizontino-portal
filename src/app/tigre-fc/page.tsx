// Dentro da função init() no seu arquivo page.tsx
async function init() {
  setIsLoading(true);
  try {
    const { data: { session } } = await sb.auth.getSession();
    let meuUsuarioId: string | null = null;
    
    if (session?.user?.id) {
      const { data: u } = await sb
        .from('tigre_fc_usuarios')
        .select('id')
        .eq('google_id', session.user.id)
        .maybeSingle();
      if (u) {
        meuUsuarioId = u.id;
        setMeuId(u.id);
      }
    }

    const [resJogo, resRank] = await Promise.all([
      sb.from('jogos_tigre').select('*, mandante:times(*), visitante:times(*)').eq('ativo', true).maybeSingle(),
      sb.from('tigre_fc_usuarios')
        .select('id, nome, apelido, avatar_url, pontos_total')
        .not('pontos_total', 'is', null)
        .order('pontos_total', { ascending: false })
        .limit(10)
    ]);

    // --- NOVO BLOCO: BUSCAR ESCALAÇÃO SALVA ---
    let dadosEscalacao = { capitao: '---', heroi: '---' };
    if (meuUsuarioId && resJogo.data) {
      const { data: esc } = await sb
        .from('tigre_fc_escalacoes')
        .select('capitao_nome, heroi_nome')
        .eq('usuario_id', meuUsuarioId)
        .eq('jogo_id', resJogo.data.id)
        .maybeSingle();

      if (esc) {
        dadosEscalacao = {
          capitao: esc.capitao_nome || '---',
          heroi: esc.heroi_nome || '---'
        };
      }
    }
    // ------------------------------------------

    if (resJogo.data) {
      const gameData = resJogo.data;
      // Blindagem do Avaí já existente
      if (gameData.mandante_slug === 'avai' || gameData.mandante?.nome?.toUpperCase() === 'AVAÍ') {
        gameData.mandante.escudo_url = URL_AVAI;
        gameData.competicao = "COPA SUL-SUDESTE";
      }
      setJogo(gameData);
      
      // Atualiza o statsFinal com os nomes vindos do banco
      setStatsState(prev => ({
        ...prev,
        capitao: { nome: dadosEscalacao.capitao, pts: 0 },
        heroi: { nome: dadosEscalacao.heroi, pts: 0 }
      }));
    }
    // ... restante do código de ranking
