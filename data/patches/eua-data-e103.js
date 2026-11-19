/* BRZ EUA e103 · USDA/FAS CWR Country Commodity Summary (XLSX) · semanas 05 e 12 Nov 2026.
   Fonte das 5 commodities: 235 destinos/linhas por semana; as 5 seções completas somam
   exatamente MUNDO nas métricas acumulado, outstanding, commitment, net e next MY.
   Unidade: 1000 toneladas, precisão de 0,001; sem inventar split de consenso.
   A semana 05/11 anterior é refinada do arredondamento PDF para XLSX.
   Nov12 switched UNKNOWN→China não está presente no XLSX: null (não zero).
   Dow Jones 18/11 para a semana 12/11: expectativas all MYs combinados.
*/
(()=>{
 'use strict';
 const E=window.E,H=E.deep,dt='2026-11-12',prev='2026-11-05';
 if(E.meta.atual!==prev)throw Error('e103 requer e102 publicada na base 05/11: '+E.meta.atual);
 const prevCountries={"trigo":{"UNKNOWN":[0,278.459,0],"Mexico":[1955.372,705.893,5.731],"Philippines":[1060.908,813.5,21.9],"China":[0,0,0],"Korea Rep":[668.061,587.653,0],"Japan":[928.301,398.562,0],"Nigeria":[202.622,0,0],"Indonesia":[289.756,268,0],"Taiwan":[384.06,204.1,0],"Thailand":[292.468,179,0],"Venezuela":[68.847,33,0],"Colombia":[216.076,56.05,0],"MUNDO":[8040.117,4199.318,65.631]},"milho":{"UNKNOWN":[0,3273.447,2.54],"Mexico":[4693.034,6666.16,969.76],"Japan":[1981.717,2120.84,24],"China":[0,0,0],"Korea Rep":[1313.973,590.812,0],"Colombia":[1539.472,1021.173,0],"Spain":[312.512,159.5,0],"Canada":[71.891,193.787,0],"Taiwan":[87.327,194.93,0],"Vietnam":[15.204,39.364,0],"Guatemala":[146.797,131.579,0],"Venezuela":[0,80,0],"MUNDO":[11995.369,15677.235,996.3]},"soja":{"UNKNOWN":[0,5369.4,10],"China":[8836.232,7801,0],"Mexico":[972.991,1205.111,0],"Egypt":[682.586,221,0],"Japan":[416.892,324.544,2.2],"Indonesia":[247.232,308.614,0],"Germany":[115.953,0,0],"Spain":[296.521,403,0],"Netherlands":[201.323,0,0],"Taiwan":[178.163,236.887,0],"Bangladesh":[401.029,55,0],"Pakistan":[60.567,126,0],"MUNDO":[13902.92,17485.674,12.2]},"farelo":{"UNKNOWN":[0,470.81,0],"China":[0,1.916,0],"Philippines":[256.323,850.071,0],"Mexico":[258.244,728.049,0],"Colombia":[141.523,348.815,0],"Canada":[54.081,433.617,0.1],"Vietnam":[141.344,341.375,0],"Ecuador":[65.806,86,0],"Venezuela":[47.228,144,0],"Guatemala":[67.109,150.502,0],"Dominican Rep":[61.421,124.05,0],"MUNDO":[1713.845,5098.243,0.1]},"oleo":{"UNKNOWN":[0,0,0],"Mexico":[1.421,1.194,0],"Colombia":[0,0,0],"Venezuela":[0,0,0],"Korea Rep":[0,0,0],"Dominican Rep":[0.02,0,0],"Guatemala":[0.038,0,0],"Canada":[8.623,28.068,0],"MUNDO":[10.364,29.296,0]}};
 const nowCountries={"trigo":{"UNKNOWN":[0,291.759,0],"Mexico":[1981.671,773.166,5.731],"Philippines":[1242.841,675.5,21.9],"China":[0,0,0],"Korea Rep":[668.061,589.714,0],"Japan":[951.16,466.962,0],"Nigeria":[202.622,0,0],"Indonesia":[365.059,198,0],"Taiwan":[435.878,154.75,0],"Thailand":[292.468,179,0],"Venezuela":[68.847,84.5,0],"Colombia":[216.076,56.05,0],"MUNDO":[8420.076,4164.158,65.631]},"milho":{"UNKNOWN":[0,3143.933,2.54],"Mexico":[5063.251,7222.199,1011.671],"Japan":[2040.814,2199.84,24],"China":[0,0,0],"Korea Rep":[1376.812,725.795,0],"Colombia":[1694.417,945.602,0],"Spain":[348.256,139.5,0],"Canada":[93.975,171.819,0],"Taiwan":[96.601,185.382,0],"Vietnam":[15.321,39.247,0],"Guatemala":[146.797,131.579,0],"Venezuela":[0,80,0],"MUNDO":[12937.966,16322.754,1038.211]},"soja":{"UNKNOWN":[0,5181.15,10],"China":[9527.91,7690,0],"Mexico":[1165.807,1319.621,0],"Egypt":[797.75,166,0],"Japan":[510.879,302.294,2.2],"Indonesia":[344.787,292.411,0],"Germany":[115.953,0,0],"Spain":[452.028,385.407,0],"Netherlands":[201.323,0,0],"Taiwan":[203.26,216.184,0],"Bangladesh":[401.029,55,0],"Pakistan":[60.567,120,0],"MUNDO":[15741.937,17147.615,12.2]},"farelo":{"UNKNOWN":[0,440.81,0],"China":[0,1.916,0],"Philippines":[306.903,803.951,0],"Mexico":[333.791,707.544,0],"Colombia":[158.634,357.422,0],"Canada":[67.355,438.485,1.058],"Vietnam":[147.602,336.009,0],"Ecuador":[65.806,86,0],"Venezuela":[47.228,184,0],"Guatemala":[67.109,150.502,0],"Dominican Rep":[61.421,144.05,0],"MUNDO":[1994.142,5015.997,1.058]},"oleo":{"UNKNOWN":[0,0,0],"Mexico":[1.782,1.017,0],"Colombia":[0,0,0],"Venezuela":[0,0,0],"Korea Rep":[0,0,0],"Dominican Rep":[0.021,0,0],"Guatemala":[0.038,0,0],"Canada":[9.668,27.715,0],"MUNDO":[11.771,28.766,0]}};
 const O={"2026-11-05":{"trigo":{"cy":182.844,"nc":0,"exports":239.467,"accum":8040.117,"out":4199.318,"comm":12239.435,"nmy":65.631},"milho":{"cy":2881.405,"nc":594.36,"exports":869.079,"accum":11995.369,"out":15677.235,"comm":27672.604,"nmy":996.3},"soja":{"cy":1154.772,"nc":11.2,"exports":1882.368,"accum":13902.92,"out":17485.674,"comm":31388.594,"nmy":12.2},"farelo":{"cy":360.944,"nc":-0.184,"exports":386.906,"accum":1713.845,"out":5098.243,"comm":6812.088,"nmy":0.1},"oleo":{"cy":1.694,"nc":0,"exports":1.851,"accum":10.364,"out":29.296,"comm":39.66,"nmy":0}},"2026-11-12":{"trigo":{"cy":344.799,"nc":0,"exports":379.959,"accum":8420.076,"out":4164.158,"comm":12584.234,"nmy":65.631},"milho":{"cy":1588.116,"nc":41.911,"exports":942.597,"accum":12937.966,"out":16322.754,"comm":29260.72,"nmy":1038.211},"soja":{"cy":1500.958,"nc":0,"exports":1839.017,"accum":15741.937,"out":17147.615,"comm":32889.552,"nmy":12.2},"farelo":{"cy":198.051,"nc":0.958,"exports":280.297,"accum":1994.142,"out":5015.997,"comm":7010.139,"nmy":1.058},"oleo":{"cy":0.877,"nc":0,"exports":1.407,"accum":11.771,"out":28.766,"comm":40.537,"nmy":0}}};
 const Est={"__combined":true,"trigo":{"comb":[200,400]},"milho":{"comb":[1400,1900]},"soja":{"comb":[1000,1500]},"farelo":{"comb":[300,400]},"oleo":{"comb":[0,10]}};
 const W={trigo:24,milho:11,soja:11,farelo:7,oleo:7};
 const put=(a,row)=>{const i=a.findIndex(x=>Array.isArray(x)&&x[0]===row[0]);if(i<0)a.push(row);else a[i]=row;a.sort((x,y)=>String(x[0]).localeCompare(String(y[0])));};
 for(const [date,pack] of [[prev,prevCountries],[dt,nowCountries]]){
  for(const [com,countries] of Object.entries(pack)){
   const base=E.dados[com],last=base.s.MUNDO.at(-1);
   if(date===dt&&last[0]!==prev)throw Error('e103 data anterior incorreta '+com);
   const o=O[date][com],m=countries.MUNDO;
   if(Math.abs(m[0]-o.accum)>0.000001||Math.abs(m[1]-o.out)>0.000001||Math.abs(m[0]+m[1]-o.comm)>0.000001)
     throw Error('e103 reconciliação World '+date+' '+com);
   for(const [country,values] of Object.entries(countries)){
    if(!base.s[country]){base.s[country]=[];if(!base.paises.includes(country))base.paises.push(country);}
    put(base.s[country],[date,2026,date===prev?W[com]-1:W[com],...values]);
   }
  }
  H.vendActual=H.vendActual||{};
  H.vendActual[date]=Object.fromEntries(Object.entries(O[date]).map(([com,v])=>[com,{cy:v.cy,nc:v.nc}]));
 }
 H.official_2026_11_05=O[prev];H.official_2026_11_12=O[dt];
 H.country_audit_2026_11_05={source:'USDA/FAS CWR CountryCommoditySummary XLSX — 05/11',precision_kt:0.001,rows:{trigo:60,milho:49,soja:46,farelo:56,oleo:23},status:'full-country reconciliation passed; tracked destinations made exact'};
 H.country_audit_2026_11_12={source:'USDA/FAS CWR CountryCommoditySummary XLSX — 12/11',precision_kt:0.001,rows:{trigo:60,milho:49,soja:46,farelo:57,oleo:23},status:'all 235 CWR country rows reconciled by commodity; tracked destinations stored exactly'};
 E.meta.atual=dt;E.meta.gerado='2026-11-19';
 H.vendEst=H.vendEst||{};H.vendEst[dt]=Est;
 H.vendEstSources=H.vendEstSources||{};
 H.vendEstSources[dt]={reported_week:dt,published:'2026-11-18',release:'2026-11-19',unit:'1000 t',kind:'comb',source:'Dow Jones: U.S. Grain, Soybean Weekly Export Sales Estimates — Nov. 12 (imagem 18/11)',note:'Consenso all MYs; realizado 05/11 e 29/10 na imagem é comparativo, não novas vendas.'};
 H.weeklyHighlights=H.weeklyHighlights||{};
 // A fonte é o Country Detail, não o PDF narrativo Weekly Highlights (não fornecido).
 H.weeklyHighlights[dt]={source:'USDA/FAS Country Commodity Summary XLSX',published:'2026-11-19',reported_period:'2026-11-06/2026-11-12',unit:'1000 t',noWeeklyHighlightsPdf:true,
  soja:{net:1500.958,next_my_net:0,weekly_exports:1839.017,china_net:580.678,china_exports:691.678,
     net_destinations:{China:580.678,Mexico:307.326,Turkey:175.397,Spain:137.914,Vietnam:130.962}},
  milho:{net:1588.116,next_my_net:41.911,weekly_exports:942.597,net_destinations:{Mexico:926.256,South_Korea:197.822,Japan:138.097,Panama:80.8,Colombia:79.374}},
  trigo:{net:344.799,next_my_net:0,weekly_exports:379.959,net_destinations:{Mexico:93.572,Japan:91.259,Venezuela:51.5,Philippines:43.933}},
  farelo:{net:198.051,next_my_net:0.958,weekly_exports:280.297,net_destinations:{Mexico:55.042,Venezuela:40,Netherlands:32.999,Panama:29.2,Colombia:25.718}},
  oleo:{net:0.877,weekly_exports:1.407,net_destinations:{Canada:0.692,Mexico:0.184}},
  note:'Países e net sales da CWR; sem reclassificações switched, daily reports ou destaques não disponíveis no XLSX.'};
 const chinaNet=580.678,chinaExports=691.678;
 put(H.nar,[dt,chinaNet,chinaExports,null,0]);
 H.switched_status_2026_11_12='Country Detail recebido; switched UNKNOWN→China exige Weekly Highlights, valor null (não assumido zero).';
 H.perc_vals={wexp:1839.017,net:1500.958,outst:17147.615,nmy:12.2,wk:11};
 H.perc_reference=Object.assign(H.perc_reference||{},{week:dt,history:'MY 2022–2025; same MY week',method:'empirical midrank',n_max:4});
 const goal=E.dados.soja.wasde.at(-1)[1];
 H.cur26=Object.fromEntries(E.dados.soja.s.MUNDO.filter(r=>r[1]===2026&&r[2]>=1&&r[2]<=53).map(r=>[String(r[2]),Math.round(1000*(r[3]+r[4])/goal)/10]));
 H.cur_by_my=Object.assign(H.cur_by_my||{},{'2026':H.cur26});
 H.expectations_vs_actual_2026_11_12=Object.fromEntries(Object.entries(O[dt]).map(([com,v])=>{const range=Est[com].comb,total=Math.round((v.cy+v.nc)*1000)/1000;return [com,{estimate_comb:range,actual_comb:total,within:total>=range[0]&&total<=range[1]}];}));
})();
