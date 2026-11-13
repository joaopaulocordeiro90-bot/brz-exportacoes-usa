/* BRZ EUA e102 · USDA/FAS ESR semana encerrada 05/11/2026, publicado 12/11/2026.
 Fontes enviadas: ESR WEEKLY REPORT (292 p., Highlights 1–3, BELL 19/28/36/40/44,
 Country Detail CWR 151–212); expectativas Dow Jones de 12/11 (imagem).
 Valores em 1000 toneladas, precisão do PDF 0,1 mil t. Sem falsa precisão.
 Consenso = vendas todos MY combinados; MY corrente e novo separados no realizado.
 Reclassificação Netherlands→Germany 60 mil t (embarques de 08/10), não é venda nova.
*/
(()=>{
 'use strict';
 const E=window.E,H=E.deep,dt='2026-11-05',release='2026-11-12',wk={trigo:23,milho:10,soja:10,farelo:6,oleo:6};
 if(E.meta.atual!=='2026-10-29')throw Error('e102 requer a base e101 FAS 29/10');
 const U={"trigo":{"MUNDO":[8040.1,4199.3,65.6],"UNKNOWN":[0,278.5,0],"Mexico":[1955.4,705.9,5.7],"Philippines":[1060.9,813.5,21.9],"China":[0,0,0],"Korea Rep":[668.1,587.7,0],"Japan":[928.3,398.6,0],"Nigeria":[202.6,0,0],"Indonesia":[289.8,268,0],"Taiwan":[384.1,204.1,0],"Thailand":[292.5,179,0],"Venezuela":[68.8,33,0],"Colombia":[216.1,56.1,0]},"milho":{"MUNDO":[11995.4,15677.2,996.3],"UNKNOWN":[0,3273.4,2.5],"Mexico":[4693,6666.2,969.8],"Japan":[1981.7,2120.8,24],"China":[0,0,0],"Korea Rep":[1314,590.8,0],"Colombia":[1539.5,1021.2,0],"Spain":[312.5,159.5,0],"Canada":[71.9,193.8,0],"Taiwan":[87.3,194.9,0],"Vietnam":[15.2,39.4,0],"Guatemala":[146.8,131.6,0],"Venezuela":[0,80,0]},"soja":{"MUNDO":[13902.9,17485.7,12.2],"UNKNOWN":[0,5369.4,10],"China":[8836.2,7801,0],"Mexico":[973,1205.1,0],"Egypt":[682.6,221,0],"Japan":[416.9,324.5,2.2],"Indonesia":[247.2,308.6,0],"Germany":[116,0,0],"Spain":[296.5,403,0],"Netherlands":[201.3,0,0],"Taiwan":[178.2,236.9,0],"Bangladesh":[401,55,0],"Pakistan":[60.6,126,0]},"farelo":{"MUNDO":[1713.8,5098.2,0.1],"UNKNOWN":[0,470.8,0],"China":[0,1.9,0],"Philippines":[256.3,850.1,0],"Mexico":[258.2,728,0],"Colombia":[141.5,348.8,0],"Canada":[54.1,433.6,0.1],"Vietnam":[141.3,341.4,0],"Ecuador":[65.8,86,0],"Venezuela":[47.2,144,0],"Guatemala":[67.1,150.5,0],"Dominican Rep":[61.4,124.1,0]},"oleo":{"MUNDO":[10.4,29.3,0],"UNKNOWN":[0,0,0],"Mexico":[1.4,1.2,0],"Colombia":[0,0,0],"Venezuela":[0,0,0],"Korea Rep":[0,0,0],"Dominican Rep":[0,0,0],"Guatemala":[0,0,0],"Canada":[8.6,28.1,0]}};
 const A={"trigo":{"cy":182.8,"nc":0,"exports":239.5,"accum":8040.1,"out":4199.3,"comm":12239.4,"nmy":65.6},"milho":{"cy":2881.4,"nc":594.4,"exports":869.1,"accum":11995.4,"out":15677.2,"comm":27672.6,"nmy":996.3},"soja":{"cy":1154.8,"nc":11.2,"exports":1882.4,"accum":13902.9,"out":17485.7,"comm":31388.6,"nmy":12.2},"farelo":{"cy":360.9,"nc":-0.2,"exports":386.9,"accum":1713.8,"out":5098.2,"comm":6812.1,"nmy":0.1},"oleo":{"cy":1.7,"nc":0,"exports":1.9,"accum":10.4,"out":29.3,"comm":39.7,"nmy":0}};
 const F={"__combined":true,"trigo":{"comb":[350,650]},"milho":{"comb":[1000,3600]},"soja":{"comb":[800,2000]},"farelo":{"comb":[250,500]},"oleo":{"comb":[0,10]}};
 const put=(arr,row)=>{const i=arr.findIndex(x=>Array.isArray(x)&&x[0]===row[0]);if(i>=0)arr[i]=row;else arr.push(row);arr.sort((a,b)=>String(a[0]).localeCompare(String(b[0])));};
 for(const [com,countries] of Object.entries(U)){
  const base=E.dados[com],last=base?.s?.MUNDO?.at(-1);
  if(!last||last[0]!=='2026-10-29'||Math.abs(countries.MUNDO[0]+countries.MUNDO[1]-A[com].comm)>0.11)throw Error('e102 CWR/MUNDO inconsistente '+com);
  for(const [country,v] of Object.entries(countries)){
   if(!base.s[country]){base.s[country]=[];if(!base.paises.includes(country))base.paises.push(country);}
   put(base.s[country],[dt,2026,wk[com],...v]);
  }
 }
 // Country Detail inclui os valores RESTATADOS de 29/10 em Alemanha e Holanda.
 // Revisar apenas essa data comprovada; não inventar a série 08/10–22/10.
 for(const [country,accum] of [['Germany',116],['Netherlands',201.3]]){
  const row=E.dados.soja.s[country].find(r=>r[0]==='2026-10-29'&&r[1]===2026);
  if(!row)throw Error('Reclassificação sem base '+country);
  row[3]=accum;
 }
 E.meta.atual=dt;E.meta.gerado=release;
 H.vendActual=H.vendActual||{};H.vendActual[dt]=Object.fromEntries(Object.entries(A).map(([k,v])=>[k,{cy:v.cy,nc:v.nc}]));
 H.official_2026_11_05=A;
 H.vendEst=H.vendEst||{};H.vendEst[dt]=F;
 H.vendEstSources=H.vendEstSources||{};
 H.vendEstSources[dt]={reported_week:dt,published:release,release,unit:'1000 t',kind:'comb',source:'Dow Jones — U.S. Grain, Soybean Weekly Export Sales Estimates — Nov. 5, imagem de 12/11/2026',note:'Faixas por todos os MYs combinados; colunas Oct 29 e Oct 22 são realizados anteriores, não novas vendas.'};
 H.country_audit_2026_11_05={source:'CWR Country Detail by Commodity',pages:'151–212',unit:'1000 t',precision_kt:0.1,section_countries:{trigo:60,milho:49,soja:46,farelo:56,oleo:23},note:'CWR somente uma casa decimal; monitorados atualizados, países ausentes em óleo preservados. Valores restatados Alemanha/Holanda de 29/10 conferidos; sem inferência de semanas anteriores.'};
 put(H.nar,[dt,689.2,1266.2,246,0]);
 H.switched_status_2026_11_05='UNKNOWN→China soja: 246 mil t, reclassificação, NÃO venda adicional.';
 H.weeklyHighlights=H.weeklyHighlights||{};
 H.weeklyHighlights[dt]={source:'USDA/FAS ESR Weekly Highlights',published:release,reported_period:'2026-10-30/2026-11-05',unit:'1000 t',
  soja:{net:1154.8,next_my_net:11.2,weekly_exports:1882.4,china_net:689.2,china_switched_from_unknown:246,china_decreases:139.7,china_exports:1266.2,unknown_net:-234.1,bangladesh_net:116.2,bangladesh_switched_from_unknown:110,algeria_net:100,spain_net:198,shipments:{China:1266.2,Mexico:189.2,Bangladesh:171.2,Taiwan:72.5,Italy:47.1}},
  milho:{net:2881.4,next_my_net:594.4,weekly_exports:869.1,my_high:true,mexico_net:1955.3,colombia_net:307.4,colombia_switched_from_unknown:100,spain_net:87.5,spain_switched_from_unknown:55,south_korea_net:202,shipments:{Mexico:373.8,Colombia:224,Japan:130.6,Spain:60.5,Italy:33.2}},
  trigo:{net:182.8,weekly_exports:239.5,my_low:true,switched_unknown_to_indonesia:40,switched_unknown_to_thailand:33.5},
  farelo:{net:360.9,next_my_net:-0.2,weekly_exports:386.9,switched_unknown_to_colombia:40,switched_unknown_to_vietnam:50,unknown_net:-109},
  oleo:{net:1.7,weekly_exports:1.9,net_destinations:{Canada:0.9,Mexico:0.8}},
  soybean_export_adjustment:{reported_shipment_week:'2026-10-08',amount_kt:60,from:'Netherlands',to:'Germany',type:'destination correction',incremental_net_sales:false},
  dailyReporting:[{commodity:'milho',destination:'Mexico',amount_kt:1560.38,my:'2026/27'},{commodity:'milho',destination:'Mexico',amount_kt:594.36,my:'2027/28'},{commodity:'milho',destination:'South Korea',amount_kt:136,my:'2026/27'},{commodity:'milho',destination:'Unknown',amount_kt:101,my:'2026/27'},{commodity:'soja',destination:'China',amount_kt:272,my:'2026/27'},{commodity:'soja',destination:'Spain',amount_kt:167,my:'2026/27'},{commodity:'soja',destination:'Unknown',amount_kt:134,my:'2026/27'}],
  dailyReportingNote:'Subconjunto dos negócios semanais, sem soma adicional.'};
 H.weeklyHighlightsSource_2026_11_05={file:'ESR_WEEKLY_REPORT_2026_11_05.pdf',pages:[1,2,3],status:'verified'};
 H.perc_vals={wexp:1882.4,net:1154.8,outst:17485.7,nmy:12.2,wk:10};
 H.perc_reference=Object.assign(H.perc_reference||{},{week:dt,history:'MY 2022–2025; same MY week',method:'empirical midrank',n_max:4});
 const goal=E.dados.soja.wasde.at(-1)[1];
 H.cur26=Object.fromEntries(E.dados.soja.s.MUNDO.filter(r=>r[1]===2026&&r[2]>=1&&r[2]<=53).map(r=>[String(r[2]),Math.round(1000*(r[3]+r[4])/goal)/10]));
 H.cur_by_my=Object.assign(H.cur_by_my||{},{'2026':H.cur26});
 H.expectations_vs_actual_2026_11_05=Object.fromEntries(Object.entries(A).map(([com,a])=>{const range=F[com].comb,total=Math.round((a.cy+a.nc)*10)/10;return [com,{estimate_comb:range,actual_comb:total,within:total>=range[0]&&total<=range[1]}];}));
})();
