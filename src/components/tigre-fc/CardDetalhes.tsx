import React from 'react';

export default function ExtratoPontos({ detalhes, palpite, resultadoReal }) {
  return (
    <div className="bg-yellow-50 p-6 rounded-xl border-2 border-yellow-500 shadow-lg">
      <h2 className="text-2xl font-bold text-black mb-4">Seu Extrato Tigre FC 🐯</h2>
      
      {/* Resumo de Bônus Especiais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border border-yellow-200">
          <p className="text-sm text-gray-500">Palpite: {palpite.gols_m}x{palpite.gols_v}</p>
          <p className="font-bold">Resultado Real: {resultadoReal.gols_m}x{resultadoReal.gols_v}</p>
          <span className="text-green-600 font-bold">
            {palpite.gols_m === resultadoReal.gols_m && palpite.gols_v === resultadoReal.gols_v 
              ? "🎯 Placar Exato! +15 pts" 
              : "✅ Resultado Certo! +5 pts"}
          </span>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border border-yellow-200">
          <p className="text-sm text-gray-500">Bônus Herói</p>
          <p className="font-bold">Herói Escolhido: {detalhes.find(d => d.is_heroi)?.atleta_nome}</p>
          <span className={detalhes.find(d => d.is_heroi && d.is_heroi_real) ? "text-green-600 font-bold" : "text-gray-400"}>
             {detalhes.find(d => d.is_heroi && d.is_heroi_real) ? "🦸 Acertou o Herói! +10 pts" : "❌ Errou o Herói"}
          </span>
        </div>
      </div>

      {/* Lista de Jogadores */}
      <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
        <table className="w-full text-left">
          <thead className="bg-black text-white text-xs uppercase">
            <tr>
              <th className="p-3">Jogador</th>
              <th className="p-3 text-center">Nota</th>
              <th className="p-3 text-center">Mult.</th>
              <th className="p-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {detalhes.map((atleta, index) => (
              <tr key={index} className={atleta.is_capitao ? "bg-yellow-50" : ""}>
                <td className="p-3">
                  <span className="font-bold">{atleta.atleta_nome}</span>
                  {atleta.is_capitao && <span className="ml-2 text-xs bg-black text-white px-2 py-1 rounded">C</span>}
                </td>
                <td className="p-3 text-center text-gray-600">{atleta.ponto_base}</td>
                <td className="p-3 text-center text-gray-600">x{atleta.multiplicador}</td>
                <td className="p-3 text-right font-bold text-black">{atleta.ponto_final}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <p className="mt-4 text-[10px] text-gray-400 text-center uppercase tracking-widest">
        Dados verificados via SofaScore • Transparência Tigre FC
      </p>
    </div>
  );
}
