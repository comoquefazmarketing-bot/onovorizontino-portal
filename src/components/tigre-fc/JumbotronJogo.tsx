// No JumbotronJogo.tsx, o botão de ação:
<Link href="/tigre-fc/escalar" style={{ textDecoration: 'none' }}>
  <div style={{
    background: mercadoFechado ? 'rgba(255,255,255,0.05)' : `linear-gradient(90deg, ${C.gold}, #FFE57E)`,
    padding: 24, borderRadius: 24, textAlign: 'center', 
    color: mercadoFechado ? 'rgba(255,255,255,0.2)' : '#000', 
    fontSize: 17, fontWeight: 1000, 
    cursor: mercadoFechado ? 'not-allowed' : 'pointer', 
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10
  }}>
    {mercadoFechado ? (
      'MERCADO ENCERRADO'
    ) : (
      <>
        <Users size={22} /> 
        {/* Se o nome do capitão não for '---', muda o texto do botão */}
        {capitao.nome === '---' ? 'CONVOCAR TITULARES →' : 'ALTERAR ESCALAÇÃO →'}
      </>
    )}
  </div>
</Link>
