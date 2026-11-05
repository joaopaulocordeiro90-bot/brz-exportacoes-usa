
/* Expectativas de mercado (consenso pré-report) por semana, em mil t.
   Formato normal: {"<data ISO>":{<com>:{cy:[min,max],nc:[min,max]}}}.
   Quando a fonte publica somente o total entre safras, usar __combined:true e
   <com>:{comb:[min,max]}; a faixa fica em uma célula própria, sem fundir colunas.
   cy = célula da esquerda, nc = da direita; chave ausente renderiza travessão.
   As células seguem contenteditable: dá para sobrescrever à mão. */
(function(){
  window.E.deep=window.E.deep||{};
  window.E.deep.vendEst={
    /* sem48. Só entram as commodities em que a faixa recebida cabe numa célula
       sem ambiguidade, isto é, onde o realizado da safra corrente é igual ao
       total: trigo (já no MY 26/27, sem componente de safra nova) e óleo.
       FORA, de propósito:
         soja e milho — consenso de 06/08 só chegou somado (1000-2200 e 900-1500),
           falta o split por safra;
         farelo — faixa 150-300 recebida sem dizer se é corrente ou somada, e neste
           semana isso inverte o veredito (corrente 101,4 = abaixo · somado 248,1 = dentro).
       Preencher à mão ou completar o store quando o split chegar. */
    /* sem48. Faixas como o João as posicionou na tabela dele em 06/08. */
    "2026-07-30":{trigo:{cy:[200,400]},milho:{nc:[900,1500]},soja:{nc:[1000,2200]},
                  farelo:{cy:[150,300]},oleo:{cy:[0,10]}},
    /* sem49, consenso pré-report de 13/08.
       soja 25/26 vem NEGATIVA: analistas projetavam cancelamentos líquidos de
       200 a 300 mil t. O parser aceita sinal, faixa gravada como -300--200.
       milho: WSJ deu faixa única de 700 a 2.600 mil t sem dizer a safra;
       colocada em 26/27 seguindo o critério que o João usou na sem48.
       farelo e óleo: faixas sem safra declarada, na coluna corrente. */
    "2026-08-06":{trigo:{cy:[200,500]},milho:{nc:[700,2600]},
                  soja:{cy:[-300,-200],nc:[1500,1900]},
                  farelo:{cy:[100,400]},oleo:{cy:[1,10]}},
    /* sem50, consenso pré-report de 20/08. A fonte declara explicitamente que
       as faixas englobam todas as safras; não existe split 25/26 x 26/27. */
    "2026-08-13":{__combined:true,trigo:{comb:[200,450]},milho:{comb:[1000,1800]},
                  soja:{comb:[1000,2600]},farelo:{comb:[150,450]},oleo:{comb:[0,10]}},
    /* sem51, consenso pré-report Barchart/Brugler de 26/08. Trigo, milho e soja
       vieram separados por safra; farelo e óleo foram publicados como total
       entre safra corrente e nova. */
    "2026-08-20":{trigo:{cy:[250,550]},milho:{cy:[-200,400],nc:[600,1600]},
                  soja:{cy:[-200,200],nc:[1500,3000]},farelo:{comb:[200,800]},oleo:{comb:[-2,17]}},
    /* sem52, faixas pré-report publicadas em 03/09. CFE/GrainsPrices para grãos;
       feed QT/Ag Source para farelo e feed QT/White Front para óleo. Farelo e
       óleo vieram como total entre safra corrente e nova. */
    "2026-08-27":{trigo:{cy:[350,650]},milho:{cy:[-200,200],nc:[500,1600]},
                  soja:{cy:[-200,200],nc:[1400,2500]},farelo:{comb:[150,1000]},oleo:{comb:[-7.5,7.5]}}
  };
})();
