/* Expectativas pré-USDA/FAS · semana encerrada 29/10/2026; divulgação 05/11/2026.
   Fonte: "U.S. Grain, Soybean Weekly Export Sales Estimates — Oct. 29",
   quadro de 04/11/2026 enviado pelo usuário.
   Unidade: 1.000 toneladas. Faixas somam todos os marketing years (sem split).
   NÃO alterar realizados USDA, séries históricas, exportações nem E.meta.atual. */
(()=>{
  const D=window.E.deep;
  D.vendEst=D.vendEst||{};
  D.vendEst['2026-10-29']={
    __combined:true,
    trigo:{comb:[300,500]},
    milho:{comb:[800,1400]},
    soja:{comb:[950,2200]},
    farelo:{comb:[200,350]},
    oleo:{comb:[0,10]}
  };
  D.vendEstSources=D.vendEstSources||{};
  D.vendEstSources['2026-10-29']={
    reported_week:'2026-10-29',
    published:'2026-11-04',
    release:'2026-11-05',
    unit:'1000 t',
    kind:'comb',
    source:'U.S. Grain, Soybean Weekly Export Sales Estimates — Oct. 29 (imagem enviada pelo usuário)',
    note:'Faixas combinadas entre todas as safras comerciais; sem desdobramento por MY. Valores efetivos Oct. 22/Oct. 15 do quadro são somente comparação, não ingestão USDA.'
  };
  D.expectations_source_2026_10_29='Pré-report de 05/11/2026: trigo 300–500; milho 800–1400; soja 950–2200; farelo 200–350; óleo 0–10 mil t, todos MY combinados.';
})();
