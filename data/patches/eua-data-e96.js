/* BRZ Exportações USA · e96 · 05Nov2026
   Fonte: USDA/FAS Country Detail by Commodity, XLSX do usuário.
   Semana encerrada 2026-10-29, MY 2026/27; trigo: semana 22,
   soja/milho: 9, farelo/óleo: 5. Unidade: mil toneladas (precisão 0,001).
   SHA-256 XLSX: 7710d1e343773b7267f80f0ef0519de24ba4fa548dd008a0b15c5ae1454f0bf5
   Todas as 5 seções verificadas: somatório de países = MUNDO nos campos
   net, embarques, acumulado, outstanding, commitment e next MY.
   Preservar expectativas pré-report já cadastradas em 29/10.
   Switched UNKNOWN→China depende de Weekly Highlights; NÃO inferir de net sales. */
(()=>{
 const U={"trigo":{"MUNDO":[["2026-10-29",2026,22,7800.65,4255.941,65.631]],"UNKNOWN":[["2026-10-29",2026,22,0,318.28,0]],"Mexico":[["2026-10-29",2026,22,1896.426,712.04,5.731]],"Philippines":[["2026-10-29",2026,22,1033.959,846.4,21.9]],"China":[["2026-10-29",2026,22,0,0,0]],"Korea Rep":[["2026-10-29",2026,22,667.794,587.82,0]],"Japan":[["2026-10-29",2026,22,928.004,350.418,0]],"Nigeria":[["2026-10-29",2026,22,150.277,50,0]],"Indonesia":[["2026-10-29",2026,22,247.274,266,0]],"Taiwan":[["2026-10-29",2026,22,384.06,204.1,0]],"Thailand":[["2026-10-29",2026,22,292.468,143.5,0]],"Venezuela":[["2026-10-29",2026,22,68.847,33,0]],"Colombia":[["2026-10-29",2026,22,216.076,56.05,0]]},"milho":{"MUNDO":[["2026-10-29",2026,9,11126.29,13664.909,401.94]],"UNKNOWN":[["2026-10-29",2026,9,0,3213.399,2.54]],"Mexico":[["2026-10-29",2026,9,4319.221,5084.678,375.4]],"Japan":[["2026-10-29",2026,9,1851.076,2185.84,24]],"China":[["2026-10-29",2026,9,0,0,0]],"Korea Rep":[["2026-10-29",2026,9,1313.973,388.773,0]],"Colombia":[["2026-10-29",2026,9,1315.5,937.786,0]],"Spain":[["2026-10-29",2026,9,252.012,132.5,0]],"Canada":[["2026-10-29",2026,9,70.085,117.956,0]],"Taiwan":[["2026-10-29",2026,9,76.82,200.437,0]],"Vietnam":[["2026-10-29",2026,9,14.841,39.727,0]],"Guatemala":[["2026-10-29",2026,9,146.797,137.079,0]],"Venezuela":[["2026-10-29",2026,9,0,80,0]]},"soja":{"MUNDO":[["2026-10-29",2026,9,12020.552,18213.27,1]],"UNKNOWN":[["2026-10-29",2026,9,0,5603.5,0]],"China":[["2026-10-29",2026,9,7570.067,8378,0]],"Mexico":[["2026-10-29",2026,9,783.841,1341.74,0]],"Egypt":[["2026-10-29",2026,9,682.586,168,0]],"Japan":[["2026-10-29",2026,9,415.624,325.77,1]],"Indonesia":[["2026-10-29",2026,9,232.592,316.083,0]],"Germany":[["2026-10-29",2026,9,58.99,0,0]],"Spain":[["2026-10-29",2026,9,296.521,205,0]],"Netherlands":[["2026-10-29",2026,9,258.286,0,0]],"Taiwan":[["2026-10-29",2026,9,105.693,252,0]],"Bangladesh":[["2026-10-29",2026,9,229.841,110,0]],"Pakistan":[["2026-10-29",2026,9,60.567,120,0]]},"farelo":{"MUNDO":[["2026-10-29",2026,5,1326.939,5124.205,0.284]],"UNKNOWN":[["2026-10-29",2026,5,0,579.81,0]],"China":[["2026-10-29",2026,5,0,0.26,0]],"Philippines":[["2026-10-29",2026,5,156.017,905.369,0]],"Mexico":[["2026-10-29",2026,5,202.753,683.789,0]],"Colombia":[["2026-10-29",2026,5,67.338,355.415,0]],"Canada":[["2026-10-29",2026,5,42.761,433.875,0]],"Vietnam":[["2026-10-29",2026,5,77.933,349.81,0.284]],"Ecuador":[["2026-10-29",2026,5,65.806,87.672,0]],"Venezuela":[["2026-10-29",2026,5,47.228,115,0]],"Guatemala":[["2026-10-29",2026,5,67.109,150.502,0]],"Dominican Rep":[["2026-10-29",2026,5,31.972,149.8,0]]},"oleo":{"MUNDO":[["2026-10-29",2026,5,8.513,29.453,0]],"UNKNOWN":[["2026-10-29",2026,5,0,0,0]],"China":[["2026-10-29",2026,5,0,0,0]],"India":[["2026-10-29",2026,5,0,0,0]],"Mexico":[["2026-10-29",2026,5,1.1,0.744,0]],"Colombia":[["2026-10-29",2026,5,0,0,0]],"Venezuela":[["2026-10-29",2026,5,0,0,0]],"Korea Rep":[["2026-10-29",2026,5,0,0,0]],"Dominican Rep":[["2026-10-29",2026,5,0.02,0,0]],"Guatemala":[["2026-10-29",2026,5,0.038,0,0]],"Canada":[["2026-10-29",2026,5,7.094,28.675,0]],"Algeria":[["2026-10-29",2026,5,0,0,0]],"Morocco":[["2026-10-29",2026,5,0,0,0]]}};
 const put=(arr,row)=>{const i=arr.findIndex(x=>Array.isArray(x)&&x[0]===row[0]);
   if(i>=0)arr[i]=row;else arr.push(row);
   arr.sort((a,b)=>String(a[0]).localeCompare(String(b[0])));};
 Object.entries(U).forEach(([com,ps])=>Object.entries(ps).forEach(([pais,lines])=>{
   const d=window.E.dados[com];if(!d.s[pais]){d.s[pais]=[];if(!d.paises.includes(pais))d.paises.push(pais);}
   lines.forEach(line=>put(d.s[pais],line));
 }));
 window.E.meta.atual='2026-10-29';window.E.meta.gerado='2026-11-05';
 const D=window.E.deep;
 D.vendActual=D.vendActual||{};
 D.vendActual['2026-10-29']={"trigo":{"cy":538.028,"nc":19.2},"milho":{"cy":1294.589,"nc":0},"soja":{"cy":1456.12,"nc":0},"farelo":{"cy":390.381,"nc":0.284},"oleo":{"cy":1.523,"nc":0}};
 D.official_2026_10_29={"trigo":{"cy":538.028,"nc":19.2,"exports":149.163,"accum":7800.65,"out":4255.941,"comm":12056.591,"nmy":65.631},"milho":{"cy":1294.589,"nc":0,"exports":1028.954,"accum":11126.29,"out":13664.909,"comm":24791.199,"nmy":401.94},"soja":{"cy":1456.12,"nc":0,"exports":2530.862,"accum":12020.552,"out":18213.27,"comm":30233.822,"nmy":1},"farelo":{"cy":390.381,"nc":0.284,"exports":244.848,"accum":1326.939,"out":5124.205,"comm":6451.144,"nmy":0.284},"oleo":{"cy":1.523,"nc":0,"exports":2.663,"accum":8.513,"out":29.453,"comm":37.966,"nmy":0}};
 put(D.nar,['2026-10-29',873.88,1591.88,null,0]);
 D.switched_status_2026_10_29='Country Detail recebido; switched Unknown para China não disponível sem Weekly Highlights. Campo null, não zero.';
 D.perc_vals={wexp:2530.862,net:1456.12,outst:18213.27,nmy:1,wk:9};
 D.perc_reference=Object.assign(D.perc_reference||{},{week:'2026-10-29',history:'MY 2022–2025; same MY week',method:'empirical midrank',n_max:4});
 const goal=window.E.dados.soja.wasde.at(-1)[1];
 const series=window.E.dados.soja.s.MUNDO;
 D.cur26=Object.fromEntries(series.filter(r=>r[1]===2026&&r[2]>=1&&r[2]<=53).map(r=>[String(r[2]),Math.round(1000*(r[3]+r[4])/goal)/10]));
 D.cur_by_my=Object.assign(D.cur_by_my||{},{'2026':D.cur26});
 D.country_audit_2026_10_29={"trigo":{"net":0,"exports":0,"accum":0,"out":0,"commit":0,"nmy":0,"next_my_net":0,"countries":59},"milho":{"net":0,"exports":0,"accum":0,"out":0,"commit":0,"nmy":0,"next_my_net":0,"countries":49},"soja":{"net":0,"exports":0,"accum":0,"out":0,"commit":0,"nmy":0,"next_my_net":0,"countries":46},"farelo":{"net":0,"exports":0,"accum":0,"out":0,"commit":0,"nmy":0,"next_my_net":0,"countries":55},"oleo":{"net":0,"exports":0,"accum":0,"out":0,"commit":0,"nmy":0,"next_my_net":0,"countries":22}};
 D.country_xlsx_precision_2026_10_29='0.001 thousand metric tons (full XLSX precision); cross-check 5 sections country sums zero difference';
})();
