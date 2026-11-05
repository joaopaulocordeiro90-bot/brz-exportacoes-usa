
/* Semana encerrada em 06/08/2026, CWR publicado em 13/08. Valores em mil t.
   Fonte: CWRCountryCommoditySummary (xlsx). Cross-check MUNDO commit = outstanding
   + accum: OK nas 5. Soja/milho sem49 · trigo sem10 (MY 26/27) · farelo e óleo sem45.
   Metas: WASDE de agosto (12/08/2026), medida doméstica convertida e conferida
   contra as tabelas mundiais em MMT. */
(function(){
  const U={"trigo":{"MUNDO":[["2026-08-06",2026,10,3482.4,3990.6,26.9]],"UNKNOWN":[["2026-08-06",2026,10,0.0,411.3,0.0]],"Mexico":[["2026-08-06",2026,10,829.7,886.9,0.0]],"Philippines":[["2026-08-06",2026,10,474.1,484.4,26.9]],"Korea Rep":[["2026-08-06",2026,10,371.1,440.2,0.0]],"Japan":[["2026-08-06",2026,10,372.6,573.5,0.0]],"Nigeria":[["2026-08-06",2026,10,95.3,100.0,0.0]],"Indonesia":[["2026-08-06",2026,10,65.0,138.5,0.0]],"Taiwan":[["2026-08-06",2026,10,163.1,214.6,0.0]],"Thailand":[["2026-08-06",2026,10,68.0,154.1,0.0]],"Venezuela":[["2026-08-06",2026,10,68.8,0.0,0.0]],"Colombia":[["2026-08-06",2026,10,134.5,45.9,0.0]]},"milho":{"MUNDO":[["2026-08-06",2025,49,80066.1,7437.0,10575.0]],"UNKNOWN":[["2026-08-06",2025,49,0.0,1781.9,2067.5]],"Mexico":[["2026-08-06",2025,49,23053.9,2039.6,3983.8]],"Japan":[["2026-08-06",2025,49,14392.3,1454.6,1690.6]],"China":[["2026-08-06",2025,49,0.0,0.0,0.0]],"Korea Rep":[["2026-08-06",2025,49,8433.7,499.7,1022.1]],"Colombia":[["2026-08-06",2025,49,8269.9,522.1,799.3]],"Spain":[["2026-08-06",2025,49,4664.9,112.5,142.0]],"Canada":[["2026-08-06",2025,49,694.9,66.1,21.7]],"Taiwan":[["2026-08-06",2025,49,3421.2,112.9,63.9]],"Vietnam":[["2026-08-06",2025,49,1827.1,26.1,0.0]],"Guatemala":[["2026-08-06",2025,49,1516.8,32.5,27.8]],"Venezuela":[["2026-08-06",2025,49,1678.2,35.8,0.0]]},"soja":{"MUNDO":[["2026-08-06",2025,49,39586.7,2203.0,10132.7]],"UNKNOWN":[["2026-08-06",2025,49,0.0,541.2,3598.1]],"China":[["2026-08-06",2025,49,12357.1,141.0,4557.0]],"Mexico":[["2026-08-06",2025,49,4862.6,241.9,1293.5]],"Egypt":[["2026-08-06",2025,49,4786.2,227.9,136.6]],"Japan":[["2026-08-06",2025,49,2160.6,212.6,157.4]],"Indonesia":[["2026-08-06",2025,49,2250.4,248.1,52.9]],"Germany":[["2026-08-06",2025,49,1020.0,0.0,0.0]],"Spain":[["2026-08-06",2025,49,1065.5,0.0,0.0]],"Netherlands":[["2026-08-06",2025,49,784.0,0.0,0.0]],"Taiwan":[["2026-08-06",2025,49,1339.8,143.5,66.5]],"Bangladesh":[["2026-08-06",2025,49,1181.2,0.0,0.0]],"Pakistan":[["2026-08-06",2025,49,1092.7,0.0,0.0]]},"farelo":{"MUNDO":[["2026-08-06",2025,45,15016.2,2758.8,1716.5]],"UNKNOWN":[["2026-08-06",2025,45,0.0,243.0,432.2]],"Philippines":[["2026-08-06",2025,45,3188.9,549.5,238.5]],"Mexico":[["2026-08-06",2025,45,2427.4,494.0,324.2]],"Colombia":[["2026-08-06",2025,45,1844.8,322.6,44.0]],"Canada":[["2026-08-06",2025,45,697.0,198.4,167.8]],"Vietnam":[["2026-08-06",2025,45,710.6,43.8,106.3]],"Ecuador":[["2026-08-06",2025,45,725.2,119.3,39.0]],"Venezuela":[["2026-08-06",2025,45,437.4,45.0,0.0]],"Guatemala":[["2026-08-06",2025,45,474.9,16.1,110.7]],"Dominican Rep":[["2026-08-06",2025,45,606.4,97.8,43.0]]},"oleo":{"MUNDO":[["2026-08-06",2025,45,355.4,17.5,4.9]],"UNKNOWN":[["2026-08-06",2025,45,0.0,0.0,0.0]],"China":[["2026-08-06",2025,45,0.0,0.0,0.0]],"India":[["2026-08-06",2025,45,0.0,0.0,0.0]],"Mexico":[["2026-08-06",2025,45,90.3,0.9,0.5]],"Colombia":[["2026-08-06",2025,45,31.8,0.0,0.0]],"Venezuela":[["2026-08-06",2025,45,79.0,0.0,0.0]],"Korea Rep":[["2026-08-06",2025,45,0.0,0.0,0.0]],"Dominican Rep":[["2026-08-06",2025,45,41.5,0.0,0.0]],"Guatemala":[["2026-08-06",2025,45,25.4,0.0,0.0]],"Canada":[["2026-08-06",2025,45,21.5,16.5,4.4]],"Algeria":[["2026-08-06",2025,45,0.0,0.0,0.0]],"Morocco":[["2026-08-06",2025,45,30.0,0.0,0.0]]}};
  Object.keys(U).forEach(com=>Object.keys(U[com]).forEach(pais=>{
    const a=window.E.dados[com].s[pais]||(window.E.dados[com].s[pais]=[]);
    U[com][pais].forEach(row=>{
      const i=a.findIndex(r=>r[0]===row[0]);
      if(i>=0)a[i]=row;else a.push(row);
    });
    a.sort((x,y)=>x[0].localeCompare(y[0]));
  }));
  window.E.meta.atual="2026-08-06";
  window.E.meta.gerado="2026-08-13";
  const WA={"soja": 41367.6, "milho": 86364.1, "trigo": 21092.0, "farelo": 18597.3, "oleo": 442.3};
  Object.keys(WA).forEach(com=>{
    const a=window.E.dados[com].wasde;
    const i=a.findIndex(r=>r[0]==="2026-08-12");
    if(i>=0)a[i]=["2026-08-12",WA[com]];else a.push(["2026-08-12",WA[com]]);
    a.sort((x,y)=>String(x[0]).localeCompare(String(y[0])));
  });
  if(window.E.deep){
    const put=(a,row)=>{const i=a.findIndex(r=>r[0]===row[0]);if(i>=0)a[i]=row;else a.push(row);a.sort((x,y)=>String(x[0]).localeCompare(String(y[0])));};
    put(window.E.deep.nar,["2026-08-06",65.936,0,0,1446]);
    put(window.E.deep.cn_nmy_rec,["2026-08-06",4557]);
    window.E.deep.cur25["49"]=101.0;
    window.E.deep.perc_vals={wexp:269.7,net:75.1,outst:2203.0,nmy:10132.7,wk:49};
    const fl=window.E.deep.fl.find(r=>r[0]===2026);
    if(fl)fl[1]=10.133;else window.E.deep.fl.push([2026,10.133,null]);
    /* metas de safra nova, WASDE de agosto: soja 1.660 mi bu inalterada,
       milho sobe de 3.200 para 3.275 mi bu */
    window.E.deep.nmy_wasde=window.E.deep.nmy_wasde||{};
    window.E.deep.nmy_wasde.soja=Object.assign({},window.E.deep.nmy_wasde.soja,{2026:45177.8});
    window.E.deep.nmy_wasde.milho=Object.assign({},window.E.deep.nmy_wasde.milho,{2026:83188.9});
  }
})();
