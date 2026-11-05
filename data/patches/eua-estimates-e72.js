
/* Expectativas públicas pré-ESR, 15/10/2026, semana encerrada em 08/10/2026.
   Unidade interna: mil toneladas. Não transformar inconsistências editoriais em números. */
(function(){
  const D=window.E.deep;
  window.E.meta.gerado='2026-10-16'; // Friday release after Monday holiday
  D.vendEst=D.vendEst||{};
  D.vendEst['2026-10-08']={
    trigo:{comb:[300,600]},
    milho:{cy:[500,1200],nc:[0,50]},
    soja:{cy:[500,1200],nc:[0,50]},
    /* Farelo: Barchart 15/10 publicou '200,000 to 60,000 MT': faixa invertida,
       não há fonte primária verificável para o valor correto. Não preencher. */
    oleo:{comb:[0,10]}
  };
  D.vendEstSources=D.vendEstSources||{};
  D.vendEstSources['2026-10-08']={
    published:'2026-10-15', release:'2026-10-16', reported_week:'2026-10-08', unit:'1000 t',
    trigo:{kind:'comb',source:'Barchart/Reuters',url:'https://tateandlyle.websol.barchart.com/?module=futureDetail&region=&selected=news&storyID=7972629&symbol=ZMZ26'},
    milho:{kind:'cy_nc',source:'Barchart/Reuters',url:'https://www.inkl.com/news/corn-slips-into-thursdays-close-with-brazil-production-hike'},
    soja:{kind:'cy_nc',source:'Barchart/Reuters',url:'https://finance.yahoo.com/markets/commodities/articles/soybeans-fall-despite-another-round-220113258.html'},
    farelo:{kind:'unverified',verbatim:'200,000 to 60,000 MT',reason:'published range is reversed; no verified correction'},
    oleo:{kind:'comb',source:'Barchart/Reuters',note:'0-10 kt range, MY split not published'}
  };
  D.expectations_source_2026_10_08='Pre-report Barchart/Reuters 15-Oct-2026: wheat 300-600 kt; corn & soybeans 2026/27 500-1200 kt, 2027/28 0-50 kt; soybean oil 0-10 kt combined/undivided; soybean meal unresolved source typo 200-60 kt.';
})();
