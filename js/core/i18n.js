
/* ═══════════════ SELETOR PT-BR / EN — camada isolada de interface ═══════════════ */
(function(){
  'use strict';
  const PT='pt-BR', EN='en';
  const EXACT={
    "BRZ · EUA: Exportações Americanas":"BRZ · U.S. Export Sales",
    "Exportações Americanas · USDA ESR":"U.S. Export Sales · USDA ESR",
    "Inicial":"Home",
    "Soja":"Soybeans",
    "Farelo":"Soybean Meal",
    "Farelo de soja":"Soybean Meal",
    "Óleo":"Soybean Oil",
    "Óleo de soja":"Soybean Oil",
    "Milho":"Corn",
    "Trigo":"Wheat",
    "Base":"Database",
    "Opções":"Options",
    "Dados":"Data",
    "Vendas Semanais":"Weekly Sales",
    "⚙ Edição":"⚙ Edit",
    "Ativar/desativar modo edição":"Enable/disable edit mode",
    "Idioma":"Language",
    "Português (Brasil)":"Portuguese (Brazil)",
    "Fonte":"Font",
    "Tamanho (px)":"Size (px)",
    "Cor do texto":"Text color",
    "Cor da série":"Series color",
    "todos do card":"entire card",
    "1 clique seleciona · 2 cliques edita · arraste move · quadradinho da legenda muda a cor da série":"1 click selects · 2 clicks edits · drag to move · the legend swatch changes the series color",
    "Exportações Americanas":"U.S. Export Sales","Vendas · embarques · programa USDA · China · Equipe Agrinvest":"Sales · shipments · USDA program · China · Agrinvest Team","Vendas · embarques · programa USDA · destinos · Equipe Agrinvest":"Sales · shipments · USDA program · destinations · Agrinvest Team","Relatório da semana · estimativas × USDA · comentário · Equipe Agrinvest":"Report of the week · estimates × USDA · commentary · Agrinvest Team","Séries semanais por destino · CSV · Excel · Equipe Agrinvest":"Weekly series by destination · CSV · Excel · Agrinvest Team",
    "USDA ESR · Soja, Farelo, Óleo, Milho e Trigo — Equipe Agrinvest":"USDA ESR · Soybeans, Soybean Meal, Soybean Oil, Corn and Wheat — Agrinvest Team",
    "Base de Dados":"Database",
    "5 sub-bases semanais por destino · export CSV — Equipe Agrinvest":"5 weekly destination datasets · CSV export — Agrinvest Team",
    "Snapshot do aplicativo":"App snapshot",
    "Gera um novo HTML autocontido com o estado atual (títulos editados inclusos). O arquivo funciona offline, inclusive o modo dinâmico.":"Creates a new self-contained HTML file with the current state, including edited titles. The file works offline, dynamic mode included.",
    "💾 SALVAR":"💾 SAVE",
    "⬇ EXPORTAR":"⬇ EXPORT",
    "🗑 Limpar salvamento":"🗑 Clear saved state",
    "Apaga o salvamento local desta máquina e recarrega no padrão da build":"Deletes the local saved state on this device and reloads the build defaults",
    "Último salvamento: 13/07/2026, 11:01:41":"Last saved: Jul 13, 2026, 11:01:41 AM",
    "As 5 sub-bases em CSV, de uma vez (mesmo conteúdo da aba Base).":"Downloads all 5 CSV datasets at once, with the same content shown in the Database tab.",
    "⬇ Baixar os 5 CSVs":"⬇ Download all 5 CSVs",
    "Paleta dos gráficos":"Chart palette",
    "Edita as três cores da casa e redesenha todos os cards. O snapshot preserva a escolha.":"Edits the three house colors and redraws every card. The snapshot preserves the selection.",
    "restaurar padrão":"reset to default",
    "Fonte e método":"Source and methodology",
    "séries semanais incorporadas do USDA-FAS Export Sales (jan/2022 → 08/10/2026), em múltiplos formatos, parseadas e validadas por âncoras oficiais e reconciliação contábil. Camada 1990–2026 da soja via série histórica mundial. Unidade: mil t. MYs: soja/milho set–ago · farelo/óleo out–set · trigo jun–mai.":"weekly USDA-FAS Export Sales readings incorporated (Jan/2022 → Sep 24, 2026), parsed from multiple formats and validated against official anchors and accounting reconciliations. The 1990–2026 soybean layer uses the world historical series. Unit: kt. MYs: soybeans/corn Sep–Aug · meal/oil Oct–Sep · wheat Jun–May.",
    "Base derivada de séries semanais USDA-FAS ESR (jan/2022 → 08/10/2026) · unidade: mil t · somente leitura; a edição vive nos parsers, não aqui.":"Database derived from weekly USDA-FAS ESR readings (Jan/2022 → Sep 24, 2026) · unit: kt · read-only; edits are handled in the parsers, not here.",
    "⬇ Exportar CSV":"⬇ Export CSV",
    "Base de Dados · Soja":"Database · Soybeans",
    "Base de Dados · Farelo de soja":"Database · Soybean Meal",
    "Base de Dados · Óleo de soja":"Database · Soybean Oil",
    "Base de Dados · Milho":"Database · Corn",
    "Base de Dados · Trigo":"Database · Wheat",
    "Semana (fim)":"Week Ending",
    "Destino":"Destination",
    "Sem. MY":"MY Week",
    "Embarcado":"Shipped",
    "A embarcar":"Outstanding",
    "AEmbarcar":"Outstanding",
    "Book MY+1":"MY+1 Book",
    "Semana":"Week",
    "SemMY":"MYWeek",
    "Temporada":"MY",
    "EUA: Relatório de Vendas e Embarques":"U.S.: Export Sales and Shipments Report",
    "Vendas e embarques dos EUA":"U.S. Export Sales and Shipments",
    "Volume em":"Volume in",
    "1000 tons":"1,000 tons",
    "Estimativas":"Estimates",
    "Faixa combinada entre safras":"Combined crop-year range",
    "Descritivo do report":"Report Commentary",
    "Comentário do relatório":"Report Commentary",
    "Texto automático com números e estimativas · editável · ⟳ regenera":"Automatic text based on figures and estimates · editable · ⟳ regenerates",
    "Texto gerado dos números e das estimativas · edite à vontade · ⟳ regenera":"Text generated from the figures and estimates · edit freely · ⟳ regenerates",
    "⟳ texto":"⟳ regenerate",
    "copiar":"copy",
    "copiado ✓":"copied ✓",
    "Regerar texto com os números atuais":"Regenerate text using the current figures",
    "Copiar texto":"Copy text",
    "Restaurar (limpa estimativas)":"Reset (clears estimates)",
    "Foto":"Snapshot",
    "DESTAQUES":"HIGHLIGHTS",
    "USDA: Vendas abaixo das expectativas, destaque para a soja que renovou recorde negativo para o ano comercial.":"USDA: Sales below expectations, led by soybeans at a new marketing-year low.",
    "USDA: Vendas acima das expectativas, com demanda firme na exportação.":"USDA: Sales above expectations, with firm export demand.",
    "USDA: Vendas dentro das expectativas divulgadas para quatro commodities.":"USDA: Sales within published expectations for four commodities.",
    "Estimativas Dow Jones: faixa combinada 26/27 + 27/28 para as cinco commodities, sem divisão publicada por MY; 27/28 = n/d.":"Dow Jones estimates: combined 26/27 + 27/28 range for all five commodities, with no published split by marketing year; 27/28 = n/a.",
    "Trigo e óleo de soja: faixas divulgadas sem divisão por MY, exibidas sob 26/27 por alinhamento; 27/28 = n/d.":"Wheat and soybean oil: ranges were published without an MY split; shown under 26/27 for alignment only; 27/28 = n/a.",
    "Farelo: faixa pré-relatório publicada como 200–60 mil t, com erro no intervalo; expectativa pendente de confirmação.":"Soybean meal: the pre-report range was printed as 200–60 kt, an invalid interval; expectation awaiting confirmation.",
    "USDA: Vendas dentro das expectativas em todas as commodities.":"USDA: Sales within expectations across all commodities.",
    "USDA: Vendas semanais mistas entre soja, milho e trigo.":"USDA: Mixed weekly sales across soybeans, corn and wheat.",
    "Sem consenso pré-relatório verificável para esta leitura; comparativos realizados contra a semana anterior e a média de quatro semanas.":"No independently verified pre-report consensus for this release; comparisons use the prior week and the four-week average.",
    "USDA: Vendas mistas na semana, sem direção única entre os produtos.":"USDA: Mixed weekly sales, with no clear direction across commodities.",
    "O USDA reportou vendas dentro do padrão recente.":"USDA reported sales in line with the recent pace.",
    "O USDA reportou vendas fracas para soja e milho americanos.":"USDA reported weak U.S. soybean and corn sales.",
    "O USDA reportou vendas fracas para soja americano.":"USDA reported weak U.S. soybean sales.",
    "O USDA reportou vendas fracas para milho americano.":"USDA reported weak U.S. corn sales.",
    "Soja:":"Soybeans:",
    "Farelo:":"Soybean Meal:",
    "Óleo de soja:":"Soybean Oil:",
    "Milho e trigo:":"Corn and Wheat:",
    "É a menor leitura do ano comercial.":"This is the lowest reading of the marketing year.",
    "O comprometido já cobre a meta para a temporada.":"Export commitments already cover the seasonal target.",
    "O comprometido praticamente cobre a meta para a temporada.":"Export commitments nearly cover the seasonal target.",
    "Média de 4 semanas em":"The 4-week average is",
    "com a demanda de exportação sustentada.":"with export demand holding firm.",
    "abaixo das expectativas":"below expectations",
    "dentro das expectativas":"within expectations",
    "acima das expectativas":"above expectations",
    "Tipografia global":"Global typography",
    "Título":"Title",
    "Subtítulo":"Subtitle",
    "Legendas":"Legends",
    "Eixo Y":"Y axis",
    "Eixo X":"X axis",
    "Valores":"Values",
    "Rodapé":"Footer",
    "Mostrar rodapé":"Show footer",
    "Restaurar card":"Reset card",
    "PNG do card (3×)":"Card PNG (3×)",
    "Sazonal: alinhar safras por semana do MY":"Seasonal: align crop years by MY week",
    "Semana selecionada do MY · Mi t · Δ do commit vs leitura anterior, por safra":"Selected MY week · Mmt · Δ in commitments vs prior reading, by crop year",
    "Semana selecionada do MY · Mi t · mesma semana, por safra":"Selected MY week · Mmt · same week, by crop year",
    "Semana selecionada do MY · composição do comprometido atual":"Selected MY week · current commitment mix",
    "Semana selecionada do MY · Mi t · commit por país":"Selected MY week · Mmt · commitments by country",
    "Em Mi t · embarcado na semana selecionada: safra passada → atual":"In Mmt · shipped in the selected week: previous crop year → current",
    "Semana selecionada do MY · Mi t · anatomia do commit por safra":"Selected MY week · Mmt · commitment breakdown by crop year",
    "Em Mi t · área: embarcado + carteira a embarcar":"In Mmt · area: shipped + outstanding sales",
    "Em mil t/semana · MY atual, pico destacado":"In kt/week · current MY, peak highlighted",
    "Em Mi t · embarcado na semana selecionada, barras nas células + total":"In Mmt · shipped in the selected week, in-cell bars + total",
    "Em mil t · embarcado na semana selecionada distribuído por destino":"In kt · shipped in the selected week by destination",
    "Em Mi t · commit na semana selecionada × anterior × ano":"In Mmt · commitments in the selected week × prior week × year ago",
    "Em Mi t/mês · por safra, marcadores mensais":"In Mmt/month · by crop year, monthly markers",
    "Em % do embarcado mundial · semana selecionada, heatmap":"In % of world shipments · selected week, heatmap",
    "Em Mi t · acumulado por semana do MY, 5 safras":"In Mmt · cumulative by MY week, 5 crop years",
    "Em Mi t · accumulated exports por semana do MY":"In Mmt · accumulated exports by MY week",
    "Em Mi t · vendido a embarcar por semana do MY":"In Mmt · outstanding sales by MY week",
    "Em mil t/semana · Δ do commit entre leituras, MY atual":"In kt/week · Δ in commitments between readings, current MY",
    "Em % da meta WASDE vigente":"In % of the current WASDE target",
    "Em Mi t · desvio vs ritmo da época (share médio × WASDE vigente), por safra · safra nova = book vs média histórica":"In Mmt · deviation from seasonal pace (average share × current WASDE), by crop year · new crop = book vs historical average",
    "Em Mi t · book da próxima safra por semana do ciclo · tracejado: projeção no ritmo médio ex-guerra (25/26 excluída)":"In Mmt · next-crop book by cycle week · dashed: projection at the average ex-war pace (25/26 excluded)",
    "Em % do programa de exportação USDA de cada safra · book da próxima safra por semana do ciclo · tracejado: projeção no ritmo médio ex-guerra (25/26 excluída)":"In % of each crop year's USDA export program · next-crop book by cycle week · dashed: projection at the average ex-war pace (25/26 excluded)",
    "Em Mi t · book de safra nova na semana selecionada de cada ciclo":"In Mmt · new-crop book in the selected week of each cycle",
    "Em % do total · top-5 destinos + unknown · última coluna = NC":"In % of total · top 5 destinations + unknown · last column = NC",
    "Em % do book acumulado NMY · mesma semana do ciclo · top-5 destinos + unknown":"In % of cumulative NMY book · same cycle week · top 5 destinations + unknown",
    "Em Mi t · NMY outstanding por semana, rótulo = safra vendida":"In Mmt · NMY outstanding by week, label = crop year sold",
    "Em % do programa de exportação USDA de cada safra · NMY outstanding por semana, rótulo = safra vendida":"In % of each crop year's USDA export program · NMY outstanding by week, label = crop year sold",
    "Em % · quanto do commit já virou embarque na semana selecionada":"In % · share of commitments already shipped in the selected week",
    "Em % · Δ do embarcado vs média histórica na semana selecionada":"In % · Δ in shipped volume vs historical average in the selected week",
    "Em % · comercialização típica 1990–2024 vs safra atual":"In % · typical 1990–2024 sales pace vs current crop year",
    "Em percentil · a semana atual contra a mesma semana desde 1990":"In percentile · current week vs the same week since 1990",
    "Em % · book de julho ÷ embarque final do MY vendido, 1990–2024":"In % · July book ÷ final MY shipments sold, 1990–2024",
    "Em mil t/semana · narrativa oficial (lista \"primarily\")":"In kt/week · official narrative (\"primarily\" list)",
    "Em mil t/semana · compras anônimas ganhando nome chinês":"In kt/week · anonymous purchases being switched to China",
    "Em Mi t · semana selecionada do MY · variação do commit":"In Mmt · selected MY week · change in commitments",
    "Em Mi t · mesma semana do MY · média histórica":"In Mmt · same MY week · historical average",
    "Em % · semana selecionada do MY":"In % · selected MY week",
    "Em Mi t · semana selecionada do MY · top 10 países":"In Mmt · selected MY week · top 10 countries",
    "Em Mi t · semana selecionada do MY · safra atual vs anterior":"In Mmt · selected MY week · current vs prior crop year",
    "Em Mi t · semana selecionada do MY · embarcado + a embarcar":"In Mmt · selected MY week · shipped + outstanding",
    "Em Mi t · safra atual · embarcado + a embarcar por semana do MY":"In Mmt · current crop year · shipped + outstanding by MY week",
    "Em mil t/semana · safra atual · pico destacado":"In kt/week · current crop year · peak highlighted",
    "Em Mi t · semana selecionada do MY · total por safra":"In Mmt · selected MY week · total by crop year",
    "Em mil t · semana selecionada do MY · embarcado":"In kt · selected MY week · shipped",
    "Em Mi t · semana atual vs anterior e ano passado":"In Mmt · current week vs prior week and year ago",
    "Em Mi t/mês · comparação entre safras":"In Mmt/month · crop-year comparison",
    "Em % do embarcado mundial · semana selecionada do MY":"In % of world shipments · selected MY week",
    "Em % do commitment mundial · semana selecionada do MY":"In % of world commitments · selected MY week",
    "Em Mi t · por semana do MY · últimas 5 safras":"In Mmt · by MY week · last 5 crop years",
    "Em mil t/semana · safra atual · variação do commit":"In kt/week · current crop year · change in commitments",
    "Em % da meta vigente · por semana do MY":"In % of current target · by MY week",
    "Em Mi t · commit vs ritmo histórico da meta USDA · safra nova = book NMY":"In Mmt · commitments vs historical pace of USDA target · new crop = NMY book",
    "Em Mi t · por semana do ciclo · projeção ex-guerra (25/26 excluída)":"In Mmt · by cycle week · ex-war projection (25/26 excluded)",
    "Em Mi t · mesma semana de cada ciclo · destino selecionado":"In Mmt · same week in each cycle · selected destination",
    "Em % da meta de cada safra · por semana do ciclo · projeção ex-guerra":"In % of each crop year's target · by cycle week · ex-war projection",
    "Em % · semana selecionada do MY · top 5 destinos + safra nova":"In % · selected MY week · top 5 destinations + new crop",
    "Em % · mesma semana do ciclo · top 5 destinos + unknown":"In % · same cycle week · top 5 destinations + unknown",
    "Em Mi t · por semana do ciclo · rótulo = safra vendida":"In Mmt · by cycle week · label = crop year sold",
    "Em % da meta de cada safra · por semana do ciclo":"In % of each crop year's target · by cycle week",
    "Em % · embarcado ÷ commit · semana selecionada do MY":"In % · shipped ÷ commitments · selected MY week",
    "Em % · desvio na mesma semana do MY · pós-guerra":"In % · deviation in the same MY week · post-war",
    "Em % · faixa histórica 1990–2024 vs safra atual":"In % · 1990–2024 historical range vs current crop year",
    "Em percentil · safra atual vs mesma semana desde 1990":"In percentile · current crop year vs same week since 1990",
    "Em % · book de julho ÷ embarque final · 1990–2024":"In % · July book ÷ final shipments · 1990–2024",
    "Em mil t/semana · destinos citados no relatório oficial":"In kt/week · destinations cited in the official report",
    "Em mil t/semana · reclassificação de compras anônimas":"In kt/week · reclassification of anonymous purchases",
    "Modo dinâmico: zoom, tooltip, linha↔barra, dados, tela cheia, CSV":"Dynamic mode: zoom, tooltip, line↔bar, data, full screen, CSV",
    "série oculta, filtrada no modo dinâmico":"hidden series, filtered in dynamic mode",
    "Modo dinâmico indisponível.":"Dynamic mode unavailable.",
    "Dinâmico indisponível:":"Dynamic mode unavailable:",
    "Falha ao ampliar:":"Unable to enlarge:",
    "restaurar":"restore",
    "salvar PNG":"save PNG",
    "baixar CSV":"download CSV",
    "tela cheia":"full screen",
    "zoom por seleção":"selection zoom",
    "desfazer zoom":"undo zoom",
    "linha":"line",
    "barra":"bar",
    "dados":"data",
    "Dados da série":"Series data",
    "fechar":"close",
    "atualizar":"refresh",
    "máx":"max",
    "mín":"min",
    "média":"average",
    "item":"item",
    "valor":"value",
    "grupo":"group",
    "origem":"source",
    "destino":"destination",
    "passo":"step",
    "índice":"index",
    "sem dados":"no data",
    "série curta":"insufficient history",
    "sem projeção":"no projection",
    "sem meta WASDE":"no WASDE target",
    "sem programa USDA":"no USDA export program",
    "todas as séries ocultas":"all series hidden",
    "sem book":"no book",
    "s/ dado":"no data",
    "sem movimento no MY":"no activity in the MY",
    "sem movimento":"no activity",
    "sem leituras pareadas":"no paired observations",
    "mediana histórica":"historical median",
    "MUNDO":"WORLD",
    "Mundo":"World",
    "Outros":"Others",
    "demais destinos":"other destinations",
    "book total":"total book",
    "safra atual":"current crop year",
    "ano passado":"year ago",
    "sem. passada":"prior week",
    "atual":"current",
    "alta":"increase",
    "queda":"decline",
    "embarcado":"shipped",
    "a embarcar":"outstanding",
    "commit safras":"crop-year commitments",
    "net sales":"net sales",
    "net da semana":"weekly net sales",
    "média 4 sem":"4-week average",
    "embarques/sem":"weekly exports",
    "net China":"China net sales",
    "projeção ex-guerra":"ex-war projection",
    "Commit ÷ WASDE":"Commitment",
    "linha 100%":"100%",
    "Commitment":"Commitment",
    "Sales New Crop":"New-Crop Sales",
    "Banda p10–p90 · 90–24":"p10–p90 range · 1990–2024",
    "Mediana":"Median",
    "25/26 · % do WASDE":"25/26 · % of WASDE",
    "Percentil histórico da semana - Soja":"Historical weekly percentile - Soybeans",
    "Percentil na amostra disponível - Soja":"Percentile in available sample - Soybeans",
    "Em percentil empírico · mesma semana do MY · histórico disponível 22/23–25/26":"Empirical percentile · same MY week · available 22/23–25/26 history",
    "switched documentado por MY":"documented switched by MY",
    "switched por MY":"switched by MY",
    "p50 da amostra observada (não 1990–2024)":"p50 of observed sample (not 1990–2024)",
    "Front-loading do book - Soja":"Book front-loading - Soybeans",
    "Exportações da semana":"Weekly exports",
    "Book MY seguinte":"Next-MY book",
    "Net da semana":"Weekly net sales",
    "Share por destino":"Destination share",
    "Execução por destino":"Export execution by destination",
    "Embarcado ÷ commit":"Shipped ÷ commit",
    "ZIP exportado · 5 bases CSV":"ZIP exported · 5 CSV datasets",
    "Paleta restaurada.":"Palette reset.",
    "Edições salvas ✓":"Edits saved ✓",
    "Não coube no navegador; use EXPORTAR.":"Browser storage is full; use EXPORT.",
    "Nenhum salvamento nesta máquina ainda.":"No saves on this device yet.",
    "Exportado com edições":"Exported with edits",
    "CSV exportado":"CSV exported",
    "Apagar o salvamento local desta máquina? Os cards voltam ao padrão desta build.":"Delete the local saved state on this device? Cards will return to this build's defaults."
  };
  const PHRASES=[
    ["Commit por destino: comparativos","Commitments by destination: comparisons"],
    ["Book da safra nova vs programa USDA","New-crop book vs USDA program"],
    ["Execução do commit por destino","Commitment execution by destination"],
    ["Composição do commit por safra","Commitment mix by crop year"],
    ["Share dos embarques por destino","Shipment share by destination"],
    ["Embarques mensais por safra","Monthly exports by crop year"],
    ["Embarcado: destino × safra","Shipped volume: destination × crop year"],
    ["Embarcado por destino","Shipped volume by destination"],
    ["Embarcado vs média histórica","Shipments vs historical average"],
    ["Book da safra nova por destino","New-crop book by destination"],
    ["Share do book NMY por safra","NMY book share by crop year"],
    ["Share do commit por safra","Commitment share by crop year"],
    ["Destinos do commit atual","Current commitment destinations"],
    ["Fluxo por safra e destino","Flow by crop year and destination"],
    ["Desvio do ritmo sazonal","Seasonal pace deviation"],
    ["Composição do commit","Commitment mix"],
    ["Book NMY vs programa USDA","NMY book vs USDA program"],
    ["Net sales por safra","Net sales by crop year"],
    ["Commit por destino","Commitments by destination"],
    ["Commit por safra","Commitments by crop year"],
    ["Embarques semanais","Weekly exports"],
    ["Commit acumulado","Cumulative commitments"],
    ["Embarcado acumulado","Cumulative shipments"],
    ["Net sales semanais","Weekly net sales"],
    ["Commit vs WASDE","Commitments vs WASDE"],
    ["Book da safra nova","New-crop book"],
    ["Book NMY acumulado","Cumulative NMY book"],
    ["Ritmo de comercialização","Sales pace"],
    ["Percentil histórico da semana","Historical weekly percentile"],
    ["Antecipação do book","Book front-loading"],
    ["Net sales para a China","Net sales to China"],
    ["Switched de unknown para China","Switched from unknown to China"],
    ["A embarcar","Outstanding sales"],
    ["EUA: Relatório de Vendas e Embarques","U.S.: Export Sales and Shipments Report"],
    ["vendas novas = Δ book","next-crop sales = Δ book"],
    ["seta: semana atual vs média 4 sem","arrow: current week vs 4-week average"],
    ["Estimativas: faixa conjunta 26/27 + 27/28, posicionada na primeira coluna por alinhamento, sem divisão entre safras. n/d = estimativa individual de 27/28 não divulgada.","Estimates: combined 26/27 + 27/28 range placed in the first column for alignment only, without a crop-year split. n/a = no separate 27/28 estimate published."],
    ["n/d","n/a"],
    ["Faixa combinada 26/27 + 27/28, não separada por safra","Combined 26/27 + 27/28 range; no split by crop year"],
    ["Expectativa exclusiva para 27/28 não divulgada; a faixa ao lado é combinada","No separate 27/28 estimate published; adjacent range is combined"],
    ["Semana anterior de farelo e óleo: safra velha MY 25/26, safra nova MY 26/27. Os anos efetivos estão indicados abaixo dos volumes.","Prior week for meal and oil: old crop MY 25/26, new crop MY 26/27. The applicable years are shown below the figures."],
    ["Os anos comerciais variam conforme a commodity; os valores estão identificados por MY.","Crop years differ by commodity; figures are labeled by MY."],
    ["Vendas e embarques dos EUA","U.S. Export Sales and Shipments"],
    ["Comentário do relatório","Report Commentary"],
    ["seta = atual vs média de 4 semanas","arrow = current vs 4-week average"],
    ["safra nova = Δ book","new crop = Δ book"],
    ["estimativas = total entre safras","estimates = current + next crop total"],
    ["Farelo de soja","Soybean Meal"],
    ["Óleo de soja","Soybean Oil"],
    ["Soja","Soybeans"],
    ["Milho","Corn"],
    ["Trigo","Wheat"],
    ["Execução por destino","Export execution by destination"],
    ["Em % do embarcado mundial · semana selecionada, heatmap","In % of world shipments · selected week, heatmap"],
    ["Em % do commitment mundial · semana selecionada do MY","In % of world commitments · selected MY week"],
    ["Em % · Δ do embarcado vs média histórica na semana selecionada","In % · Δ in shipped volume vs historical average in the selected week"],
    ["área: embarcado + carteira a embarcar","area: shipped + outstanding sales"],
    ["embarcado ÷ commit · última leitura · top-10 por commit","shipped ÷ commit · latest reading · top 10 by commit"],
    ["na semana selecionada","in the selected week"],
    ["vendido a embarcar","outstanding sales"],
    ["do embarcado mundial","of world shipments"],
    ["por commit","by commit"],
    ["Embarcado","Shipped"],
    ["embarcado","shipped"],
    ["A embarcar","Outstanding"],
    ["a embarcar","outstanding"],
    ["MUNDO","WORLD"],
    ["Mundo","World"],
    ["USDA: Vendas abaixo das expectativas","USDA: Sales below expectations"],
    ["USDA: Vendas dentro das expectativas","USDA: Sales within expectations"],
    ["Total* = corrente + nova","Total* = current + next crop"],
    ["safras conforme o calendário de cada commodity","crop years follow each commodity calendar"],
    ["Corrente / Total*","Current / Total*"],
    ["Corrente","Current"],
    ["Nova","Next crop"],
    ["com a soja na ponta fraca","with soybeans leading the weakness"],
    ["com o milho na ponta fraca","with corn leading the weakness"],
    ["com o farelo de soja na ponta fraca","with soybean meal leading the weakness"],
    ["com o óleo de soja na ponta fraca","with soybean oil leading the weakness"],
    ["com o trigo na ponta fraca","with wheat leading the weakness"],
    ["O comprometido já cobre a meta para a temporada.","Export commitments already cover the seasonal target."],
    ["O comprometido praticamente cobre a meta para a temporada.","Export commitments nearly cover the seasonal target."],
    ["Média de 4 semanas em","The 4-week average is"],
    ["abaixo das expectativas","below expectations"],
    ["dentro das expectativas","within expectations"],
    ["acima das expectativas","above expectations"],
    ["com a demanda de exportação sustentada","with export demand holding firm"],
    ["Soja:","Soybeans:"],
    ["Farelo:","Soybean Meal:"],
    ["Óleo de soja:","Soybean Oil:"],
    ["Milho e trigo:","Corn and Wheat:"],
    ["Vendas líquidas da semana","Weekly net sales"],
    ["Comprometido na exportação","Export commitments"],
    ["Destinos do commit","Commitment destinations"],
    ["Ranking de destinos","Destination ranking"],
    ["Quem ganhou, quem perdeu","Gainers and decliners"],
    ["Embarcado × a embarcar","Shipped × outstanding"],
    ["Anatomia do MY atual","Current MY breakdown"],
    ["Embarques semanais","Weekly exports"],
    ["Matriz destino × safra","Destination × crop-year matrix"],
    ["Fluxo safra → destino","Crop year → destination flow"],
    ["Atual × sem. passada × ano","Current × prior week × year ago"],
    ["Embarques mensais","Monthly exports"],
    ["Share por destino × safra","Destination share × crop year"],
    ["Ritmo sazonal vs meta USDA","Seasonal pace vs USDA target"],
    ["Share da safra nova por destino","New-crop share by destination"],
    ["Programa safra nova","New-crop program"],
    ["Início do programa por destino","Program start by destination"],
    ["Book do MY seguinte","Next-MY book"],
    ["Cohort pós-guerra","Post-war cohort"],
    ["Sazonalidade 36 anos","36-year seasonality"],
    ["Percentil histórico da semana","Historical weekly percentile"],
    ["Front-loading do book","Book front-loading"],
    ["Fluxo China - net sales","China flow - net sales"],
    ["compras anônimas ganhando nome chinês","anonymous purchases being switched to China"],
    ["comercialização típica","typical sales pace"],
    ["vendas líquidas","net sales"],
    ["vendas novas","new-crop sales"],
    ["Vendas Semanais","Weekly Sales"],
    ["Vendas Semana","Sales"],
    ["semana selecionada de cada ciclo","selected week in each cycle"],
    ["semana selecionada","selected week"],
    ["Semana selecionada","Selected week"],
    ["na mesma semana","in the same week"],
    ["mesma semana","same week"],
    ["semana até","week through"],
    ["por semana do MY","by MY week"],
    ["por semana","by week"],
    ["semana atual","current week"],
    ["semana anterior","prior week"],
    ["ano comercial","marketing year"],
    ["safra passada","previous crop year"],
    ["safra nova","new crop"],
    ["próxima safra","next crop year"],
    ["safras anteriores","previous crop years"],
    ["por safra","by crop year"],
    ["por destino","by destination"],
    ["por país","by country"],
    ["por mês","by month"],
    ["por semana","by week"],
    ["5 safras","5 crop years"],
    ["safras","crop years"],
    ["safra","crop year"],
    ["carteira a embarcar","outstanding sales"],
    ["quanto do commit já virou embarque","share of commitments already shipped"],
    ["comprometido atual","current commitments"],
    ["comprometido na exportação","export commitments"],
    ["O comprometido na exportação está em","Export commitments stand at"],
    ["com meta de","against a target of"],
    ["do USDA até o fim da temporada","from USDA through the end of the season"],
    ["Para alcançar a meta, o ritmo teria que ser de","To reach the target, the required pace would be"],
    ["na média semanal","on a weekly average"],
    ["da média do ano passado para o mesmo trecho","the year-ago average over the same period"],
    ["Na safra nova","For new crop"],
    ["na safra nova","for new crop"],
    ["As vendas semanais de soja","Weekly soybean sales for"],
    ["As vendas combinadas somaram","Combined sales totaled"],
    ["A safra corrente respondeu por","Current-crop sales totaled"],
    ["e a safra nova por","and new-crop sales totaled"],
    ["Na safra corrente, a média de 4 semanas está em","For current crop, the 4-week average is"],
    ["As vendas somaram","Sales totaled"],
    ["O milho somou","Corn sales totaled"],
    ["O trigo, já no MY","Wheat, already in MY"],
    ["marcou","posted"],
    ["somaram","totaled"],
    [", com ",", with "],
    ["na semana","for the week"],
    ["mil toneladas","kt"],
    ["em toneladas","in metric tons"],
    ["valores em toneladas","values in metric tons"],
    ["média 4 sem","4-week average"],
    ["média histórica","historical average"],
    ["média das safras anteriores","previous-crop average"],
    ["média safras ant.","previous-crop average"],
    ["média hist.","historical average"],
    ["média","average"],
    ["mediana","median"],
    ["período até","period through"],
    ["dados até","data through"],
    ["sem dados para","no data for"],
    ["sem série NMY para","no NMY series for"],
    ["programa de exportação USDA","USDA export program"],
    ["na virada","at rollover"],
    ["reconstruído da narrativa","reconstructed from the narrative"],
    ["validado no CWR","validated against CWR"],
    ["do programa","of the program"],
    ["tracejado","dashed"],
    ["safras em aberto: sem %","open crop years: no %"],
    ["última leitura","latest reading"],
    ["pico destacado","peak highlighted"],
    ["marcadores mensais","monthly markers"],
    ["barras nas células + total","in-cell bars + total"],
    ["distribuído por destino","allocated by destination"],
    ["três leituras","three readings"],
    ["composição do","mix of"],
    ["composição","mix"],
    ["anatomia","breakdown"],
    ["acumulado","cumulative"],
    ["acumulada","cumulative"],
    ["acumulado por","cumulative by"],
    ["ritmo médio","average pace"],
    ["ritmo da época","seasonal pace"],
    ["ritmo","pace"],
    ["desvio","deviation"],
    ["projeção","projection"],
    ["meta","target"],
    ["histórico","historical"],
    ["histórica","historical"],
    ["do ano passado","year ago"],
    ["ano passado","year ago"],
    ["mesmo trecho","same period"],
    ["temporada","season"],
    ["mundo","world"],
    ["países","countries"],
    ["somente leitura","read-only"],
    ["linhas","rows"],
    ["colunas","columns"],
    ["semanas","weeks"],
    ["semana","week"],
    ["Sem.","Wk."],
    ["sem.","wk."],
    ["Fonte:","Source:"],
    ["Em Mi t/mês","In Mmt/month"],
    ["Em Mi t","In Mmt"],
    ["Em %","In %"],
    ["Em mil t/semana","In kt/week"],
    ["Em mil t","In kt"],
    ["em Mi t","in Mmt"],
    ["em mil t","in kt"],
    ["Mi t/mês","Mmt/month"],
    ["Mi t","Mmt"],
    ["mil t/semana","kt/week"],
    ["mil t","kt"],
    ["Exportações","Exports"],
    ["exportações","exports"],
    ["Embarques","Exports"],
    ["embarques","exports"],
    ["embarque","shipment"],
    ["vendas","sales"],
    ["Vendas","Sales"],
    ["atual","current"],
    ["anterior","prior"],
    ["Média 4","4-Week Avg."],
    ["Média","Average"],
    ["Relatório","Report"],
    ["Estimativas","Estimates"],
    ["Volume","Volume"],
    ["Volume em","Volume in"],
    ["Fonte","Source"],
    ["seta","arrow"],
    ["país","country"],
    ["destinos","destinations"],
    ["destino","destination"],
    ["Outros","Others"]
  ];
  const MONTHS=[
    ["janeiro","January"],["fevereiro","February"],["março","March"],["abril","April"],["maio","May"],["junho","June"],
    ["julho","July"],["agosto","August"],["setembro","September"],["outubro","October"],["novembro","November"],["dezembro","December"],
    ["Fev","Feb"],["Mar","Mar"],["Abr","Apr"],["Mai","May"],["Jun","Jun"],["Jul","Jul"],
    ["Ago","Aug"],["Set","Sep"],["Out","Oct"],["Nov","Nov"],["Dez","Dec"],
    ["fev","Feb"],["mar","Mar"],["abr","Apr"],["mai","May"],["jun","Jun"],["jul","Jul"],
    ["set","Sep"],["out","Oct"],["nov","Nov"],["dez","Dec"]
  ];
  PHRASES.push(
    ["Comprometido vs programa USDA","Commitments vs USDA export program"],
    ["compromisso / WASDE vigente na época","commitments / contemporaneous WASDE"],
    ["Em % · mesma semana do MY","In % · same MY week"],
    ["anos anteriores","previous crop years"],
    ["Δ vs média:","Δ vs average:"],
    ["p.p.","pp"],
    ["sem metas históricas verificáveis","no verified historical targets"]
  );
  const PAIRS=[...PHRASES,...MONTHS].sort((a,b)=>b[0].length-a[0].length);
  const REVERSE_EXACT={};
  Object.entries(EXACT).forEach(([pt,en])=>{if(REVERSE_EXACT[en]===undefined)REVERSE_EXACT[en]=pt;});
  const REVERSE_PAIRS=PAIRS.map(([pt,en])=>[en,pt]).sort((a,b)=>b[0].length-a[0].length);
  const escapeRE=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  const replaceToken=(s,a,b)=>{
    if(!a||a===b)return s;
    const edge=/^[A-Za-zÀ-ÿ0-9]/.test(a)&&/[A-Za-zÀ-ÿ0-9]$/.test(a);
    if(!edge)return s.replace(new RegExp(escapeRE(a),'g'),b);
    return s.replace(new RegExp('(^|[^A-Za-zÀ-ÿ0-9])'+escapeRE(a)+'(?=$|[^A-Za-zÀ-ÿ0-9])','gu'),(all,prefix)=>prefix+b);
  };
  function translateCore(input,to){
    if(input==null)return input;
    const raw=String(input),m=raw.match(/^(\s*)([\s\S]*?)(\s*)$/);
    if(!m||!m[2])return raw;
    let s=m[2];
    if(to===EN){
      if(EXACT[s]!==undefined)s=EXACT[s];
      else{
        s=s.replace(/^Último salvamento:\s*/,'Last saved: ')
          .replace(/^(\d+)\s+linhas\s+·\s+(.+)$/,'$1 rows · $2')
          .replace(/^(\d+)\s+semanas\s+·\s+(.+)$/,'$1 weeks · $2')
          .replace(/^Temporada\s+(.+)$/,'MY $1')
          .replace(/^Exportado com edições\s*/,'Exported with edits ')
          .replace(/^CSV exportado\s*/,'CSV exported ')
          .replace(/^Falha ao ampliar:\s*/,'Unable to enlarge: ')
          .replace(/^Dinâmico indisponível:\s*/,'Dynamic mode unavailable: ');
        for(const [a,b] of PAIRS)s=replaceToken(s,a,b);
        s=s.replace(/\b(\d{2})\/(\d{2})\/(\d{2})\b/g,'$2/$1/$3')
          .replace(/(?<=\d)\.(?=\d{3}(?:\D|$))/g,'\uE000')
          .replace(/(\d),(\d)/g,'$1.$2')
          .replace(/\uE000/g,',');
      }
    }else{
      if(REVERSE_EXACT[s]!==undefined)s=REVERSE_EXACT[s];
      else{
        s=s.replace(/^Last saved:\s*/,'Último salvamento: ')
          .replace(/^(\d+)\s+rows\s+·\s+(.+)$/,'$1 linhas · $2')
          .replace(/^(\d+)\s+weeks\s+·\s+(.+)$/,'$1 semanas · $2')
          .replace(/^MY\s+(\d{2,4}\/\d{2,4})$/,'Temporada $1')
          .replace(/^Exported with edits\s*/,'Exportado com edições ')
          .replace(/^CSV exported\s*/,'CSV exportado ')
          .replace(/^Unable to enlarge:\s*/,'Falha ao ampliar: ')
          .replace(/^Dynamic mode unavailable:\s*/,'Dinâmico indisponível: ');
        for(const [a,b] of REVERSE_PAIRS)s=replaceToken(s,a,b);
        s=s.replace(/\b(\d{2})\/(\d{2})\/(\d{2})\b/g,'$2/$1/$3')
          .replace(/(?<=\d),(?=\d{3}(?:\D|$))/g,'\uE000')
          .replace(/(\d)\.(\d)/g,'$1,$2')
          .replace(/\uE000/g,'.');
      }
    }
    return m[1]+s+m[3];
  }

  const textSource=new WeakMap(),attrSource=new WeakMap();
  const ATTRS=['title','placeholder','aria-label','alt'];
  let current=PT,paused=false,exportPass=false,basePass=false,reverseUnknown=false;
  const skipNode=n=>{
    const p=n.nodeType===1?n:n.parentElement;
    if(!p)return true;
    if(p.closest('script,style,template,noscript,[data-noi18n]'))return true;
    const editable=p.closest('[contenteditable="true"]');
    return !!editable&&!editable.classList.contains('vend-txt');
  };
  function contextualText(n,src,to){
    if(to!==EN||!n.parentElement||!n.parentElement.matches('.vtab th.grp'))return null;
    const key=String(src).trim();
    const map={"Vendas Semana":"Sales","atual":"Current Week","anterior":"Prior Week","Média 4":"4-Week","semanas":"Average","<Média 4":"<4-Week","semanas>":"Average>"};
    if(map[key]===undefined)return null;
    const m=String(src).match(/^(\s*)([\s\S]*?)(\s*)$/);
    return m[1]+map[key]+m[3];
  }
  function setText(n,to){
    if(!n||n.nodeType!==3||skipNode(n))return;
    let src=textSource.get(n);
    if(src===undefined){
      src=(to===PT&&reverseUnknown)?translateCore(n.nodeValue,PT):n.nodeValue;
      textSource.set(n,src);
    }
    const context=contextualText(n,src,to);
    const value=context==null?(to===EN?translateCore(src,EN):src):context;
    if(n.nodeValue!==value)n.nodeValue=value;
  }
  function setAttrs(el,to){
    if(!el||el.nodeType!==1||skipNode(el))return;
    let src=attrSource.get(el);if(!src){src={};attrSource.set(el,src);}
    ATTRS.forEach(a=>{
      if(!el.hasAttribute(a))return;
      if(src[a]===undefined)src[a]=(to===PT&&reverseUnknown)?translateCore(el.getAttribute(a),PT):el.getAttribute(a);
      const value=to===EN?translateCore(src[a],EN):src[a];
      if(el.getAttribute(a)!==value)el.setAttribute(a,value);
    });
  }
  function translateTree(root,to,options){
    if(!root)return;
    const oldReverse=reverseUnknown;
    reverseUnknown=!!(options&&options.reverseUnknown);
    paused=true;
    try{
      if(root.nodeType===3)setText(root,to);
      else if(root.nodeType===1)setAttrs(root,to);
      const base=root.nodeType===9?root.documentElement:root;
      if(base){
        const w=document.createTreeWalker(base,NodeFilter.SHOW_TEXT);
        let n;while((n=w.nextNode()))setText(n,to);
        if(base.nodeType===1)setAttrs(base,to);
        base.querySelectorAll&&base.querySelectorAll('[title],[placeholder],[aria-label],[alt]').forEach(el=>setAttrs(el,to));
      }
    }finally{paused=false;reverseUnknown=oldReverse;}
  }
  function updateControls(){
    document.querySelectorAll('#lang-switch [data-lang]').forEach(b=>{
      const on=b.dataset.lang===current;
      b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));
    });
  }
  function translateHidden(from,to){
    document.querySelectorAll('.p-card').forEach(card=>{
      if(!card._hidden||!card._hidden.size)return;
      card._hidden=new Set([...card._hidden].map(x=>translateCore(x,to)));
    });
  }
  function refreshCharts(){
    try{
      if(typeof ECHM!=='undefined')ECHM.forEach((inst,card)=>{
        if(!inst||!inst.chart||!card||!card.dataset.card)return;
        let sp=specFor(card.dataset.card,card);
        if(typeof applySpecCardColors==='function')sp=applySpecCardColors(sp,card,card.dataset.card);
        if(sp)inst.chart.setOption(buildOption(sp,card,card.dataset.card,false),true);
      });
    }catch(e){}
  }
  function applyLanguage(lang,persist){
    const next=lang===EN?EN:PT,prev=current;
    if(prev!==next)translateHidden(prev,next);
    current=next;
    translateTree(document,current);
    document.documentElement.lang=current;
    document.documentElement.dataset.lang=current;
    // Garantir títulos e semanas no idioma efetivamente selecionado após a tradução.
    document.querySelectorAll('.p-card[data-card^="commitpct|"]').forEach(card=>{
      const commodity=(card.dataset.card||'').split('|')[1];
      const selector=card.querySelector('select[data-role="week"]');
      if(commodity&&typeof commitPctHeading==='function')commitPctHeading(card,commodity,selector?+selector.value:wkNow(commodity));
    });
    document.querySelectorAll('.p-card[data-card^="heatcommit|"]').forEach(card=>{
      const commodity=(card.dataset.card||'').split('|')[1],week=card.querySelector('select[data-role="week"]');
      const mode=card.querySelector('select[data-role="metric"]');
      if(commodity&&mode&&typeof heatCommitHeading==='function'){
        heatCommitHeading(card,commodity,week?+week.value:wkNow(commodity),mode.value);
        for(const o of mode.options)o.textContent=o.value==='volume'?(current===EN?'Volume (Mmt)':'Volume (Mi t)'):'Share (%)';
      }
    });
    updateControls();
    if(persist!==false){try{localStorage.setItem('brz_eua_language',current);}catch(e){}}
    try{if(typeof optStatus==='function')optStatus();}catch(e){}
    refreshCharts();
  }

  function deepTranslate(value,seen){
    if(current!==EN||value==null)return value;
    if(typeof value==='string')return translateCore(value,EN);
    if(typeof value==='function')return function(){
      const out=value.apply(this,arguments);
      return typeof out==='string'?translateCore(out,EN):out;
    };
    if(typeof value!=='object')return value;
    seen=seen||new WeakMap();if(seen.has(value))return seen.get(value);
    const out=Array.isArray(value)?[]:Object.create(Object.getPrototypeOf(value)||Object.prototype);
    seen.set(value,out);
    Object.keys(value).forEach(k=>out[k]=deepTranslate(value[k],seen));
    if(out.legend&&out.legend.selected){
      out.legend.selected=Object.fromEntries(Object.entries(out.legend.selected).map(([k,v])=>[translateCore(k,EN),v]));
    }
    return out;
  }

  window.BRZI18N={
    current:()=>current,
    t:s=>current===EN?translateCore(s,EN):s,
    toEnglish:s=>translateCore(s,EN),
    toPortuguese:s=>translateCore(s,PT),
    set:lang=>applyLanguage(lang,true),
    translateTree,
    translateOption:deepTranslate
  };

  if(typeof buildOption==='function'){
    const rawBuildOption=buildOption;
    buildOption=function(){return deepTranslate(rawBuildOption.apply(this,arguments));};
  }
  if(typeof genCSV==='function'){
    const rawGenCSV=genCSV;
    genCSV=function(sp,id){return rawGenCSV(current===EN?deepTranslate(sp):sp,id);};
  }
  if(typeof csvText==='function'){
    const rawCsvText=csvText;
    csvText=function(head,rows){return rawCsvText(current===EN?head.map(h=>translateCore(h,EN)):head,rows);};
  }
  if(typeof baixar==='function'){
    const rawBaixar=baixar;
    baixar=function(el,tit,cw,ch){return rawBaixar(el,current===EN?translateCore(tit,EN):tit,cw,ch);};
  }
  if(typeof renderVendas==='function'){
    const rawRenderVendas=renderVendas;
    const wrappedRenderVendas=function(){
      const wanted=current;
      if(wanted===EN)translateTree(document,PT,{reverseUnknown:true});
      try{return rawRenderVendas.apply(this,arguments);}
      finally{if(wanted===EN)translateTree(document,EN);}
    };
    renderVendas=wrappedRenderVendas;
    window.renderVendas=wrappedRenderVendas;
  }
  if(typeof window.dynOff==='function'){
    const rawDynOff=window.dynOff;
    window.dynOff=function(card,drop){
      const localize=current===EN&&!exportPass&&!basePass;
      if(localize&&card)translateTree(card,PT,{reverseUnknown:true});
      try{return rawDynOff.apply(this,arguments);}
      finally{if(localize)translateTree(document,EN);}
    };
  }
  if(typeof optStatus==='function'){
    const rawOptStatus=optStatus;
    optStatus=function(){
      if(current!==EN){rawOptStatus();return;}
      const el=document.getElementById('opt-status');if(!el)return;
      el.textContent=window.__SAVED__?'Last saved: '+new Date(window.__SAVED__.ts).toLocaleString('en-US'):'No saves on this device yet.';
    };
  }
  if(typeof collectState==='function'){
    const rawCollectState=collectState;
    collectState=function(){
      const wanted=current;
      if(wanted===EN)translateTree(document,PT,{reverseUnknown:true});
      let state;
      basePass=true;
      try{
        state=rawCollectState();
        /* O snapshot sempre guarda cada card na base PT, inclusive conteúdo
           editável recriado em EN antes que o MutationObserver o registre. */
        if(state&&state.cards)Object.values(state.cards).forEach(card=>{
          if(!card||typeof card.html!=='string')return;
          const box=document.createElement('div');
          box.innerHTML=card.html;
          translateTree(box,PT,{reverseUnknown:true});
          card.html=box.innerHTML;
        });
        state.ui=state.ui||{};state.ui.lang=wanted;
        return state;
      }finally{
        basePass=false;
        if(wanted===EN&&!exportPass)translateTree(document,EN);
      }
    };
  }
  const exportButton=document.getElementById('op-export');
  if(exportButton&&typeof exportButton.onclick==='function'){
    const rawExport=exportButton.onclick;
    exportButton.onclick=function(){
      const wanted=current;
      exportPass=true;
      if(wanted===EN){
        translateTree(document,PT,{reverseUnknown:true});
        document.documentElement.lang=PT;
      }
      try{return rawExport.apply(this,arguments);}
      finally{
        exportPass=false;
        if(wanted===EN){
          translateTree(document,EN);
          document.documentElement.lang=EN;
          document.documentElement.dataset.lang=EN;
        }
        updateControls();
      }
    };
  }
  const nativeAlert=window.alert.bind(window);
  const nativePrompt=window.prompt.bind(window);
  const nativeConfirm=window.confirm.bind(window);
  window.alert=(msg)=>nativeAlert(current===EN?translateCore(msg,EN):msg);
  window.prompt=(msg,def)=>nativePrompt(current===EN?translateCore(msg,EN):msg,def);
  window.confirm=(msg)=>nativeConfirm(current===EN?translateCore(msg,EN):msg);

  const observer=new MutationObserver(records=>{
    if(paused)return;
    records.forEach(r=>{
      if(r.type==='childList')r.addedNodes.forEach(n=>translateTree(n,current));
      else if(r.type==='characterData'){
        const n=r.target;if(skipNode(n))return;
        const src=textSource.get(n);
        if(current===EN){
          const expected=src===undefined?null:(contextualText(n,src,EN)||translateCore(src,EN));
          if(expected!==n.nodeValue)textSource.set(n,translateCore(n.nodeValue,PT));
          setText(n,EN);
        }else{textSource.set(n,n.nodeValue);}
      }else if(r.type==='attributes'){
        const el=r.target,a=r.attributeName;if(skipNode(el)||!ATTRS.includes(a))return;
        let src=attrSource.get(el);if(!src){src={};attrSource.set(el,src);}
        if(current===EN){
          const expected=src[a]===undefined?null:translateCore(src[a],EN);
          if(expected!==el.getAttribute(a))src[a]=translateCore(el.getAttribute(a),PT);
          setAttrs(el,EN);
        }else src[a]=el.getAttribute(a);
      }
    });
  });
  observer.observe(document.documentElement,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:ATTRS});
  document.getElementById('lang-switch')?.addEventListener('click',e=>{
    const b=e.target.closest('[data-lang]');if(b)applyLanguage(b.dataset.lang,true);
  });
  let initial=(window.__SAVED__&&window.__SAVED__.ui&&window.__SAVED__.ui.lang)||null;
  if(!initial){try{initial=localStorage.getItem('brz_eua_language');}catch(e){}}
  applyLanguage(initial===EN?EN:PT,false);
})();
