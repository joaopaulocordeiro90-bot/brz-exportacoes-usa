/* BRZ Exportações USA · e98 · WASDE nº 677 · publicado 10/11/2026
   Fonte oficial USDA/WAOB: https://www.usda.gov/oce/commodity/wasde/wasde1126.txt
   Tabelas U.S. Wheat Supply and Use, U.S. Feed Grain and Corn Supply and Use,
   U.S. Soybeans and Products Supply and Use (WASDE-677, pp. 11, 12 e 15).
   Safra americana 2026/27; unidade interna: mil toneladas métricas.
   Soja: 1720 Mi bu × 27,2155 kt/Mi bu = 46.810,660 kt
   Milho: 3275 Mi bu × 25,4012 kt/Mi bu = 83.188,930 kt
   Trigo: 750 Mi bu × 27,2155 kt/Mi bu = 20.411,625 kt
   Farelo: 22700 mil short tons × 0,90718474 = 20.593,0936 kt
   Óleo: 400 Mi lb × 0,45359225 = 181,4369 kt
   Trigo, farelo e óleo sem mudanças nos volumes de exportação vs OUT/26.
   Nenhum dado semanal FAS (última leitura 29/10/2026) é alterado.
*/
(()=>{
  const release='2026-11-10';
  const newTargetsKt={
    soja:46810.66,
    milho:83188.93,
    trigo:20411.625,
    farelo:20593.0936,
    oleo:181.4369
  };
  const prevTargetsKt={
    soja:46130.2725,
    milho:83823.96,
    trigo:20411.625,
    farelo:20593.0936,
    oleo:181.4369
  };
  const E=window.E,D=E.deep;
  const put=(list,row)=>{
    const n=list.findIndex(x=>Array.isArray(x)&&x[0]===row[0]);
    if(n>=0)list[n]=row;
    else list.push(row);
    list.sort((a,b)=>String(a[0]).localeCompare(String(b[0])));
  };
  Object.entries(newTargetsKt).forEach(([com,target])=>{
    const d=E.dados[com];
    if(!d||!Array.isArray(d.wasde))throw Error('WASDE sem serie existente: '+com);
    const prev=d.wasde.find(r=>r[0]==='2026-10-09');
    if(!prev||Math.abs(prev[1]-prevTargetsKt[com])>0.0001)
      throw Error('WASDE outubro divergente da base canônica: '+com);
    put(d.wasde,[release,target]);
  });
  D.nmy_wasde=D.nmy_wasde||{};
  for(const [com,target] of Object.entries(newTargetsKt)){
    D.nmy_wasde[com]=D.nmy_wasde[com]||{};
    D.nmy_wasde[com][2026]=target;
  }
  // Percentuais materializados da safra de soja: reconstruir contra o novo
  // denominador; não alterar volume, semana ou séries de outras safras.
  const world=E.dados.soja.s.MUNDO;
  D.cur26=Object.fromEntries(world.filter(r=>r[1]===2026&&r[2]>=1&&r[2]<=53)
    .map(r=>[String(r[2]),Math.round(1000*(r[3]+r[4])/newTargetsKt.soja)/10]));
  D.cur_by_my=Object.assign(D.cur_by_my||{},{'2026':D.cur26});
  E.meta.wasde_atual=release;
  D.wasde_release_2026_11_10={
    source:'USDA/WAOB — WASDE-677',
    published:release,
    url:'https://www.usda.gov/oce/commodity/wasde/wasde1126.txt',
    marketing_year:'2026/27',
    unit:'thousand metric tons',
    targets:newTargetsKt,
    previous_targets:prevTargetsKt,
    exports_original:{soja:'1720 million bu',milho:'3275 million bu',
      trigo:'750 million bu',farelo:'22700 thousand short tons',
      oleo:'400 million lb'},
    fas_latest_week:E.meta.atual,
    note:'Atualização apenas do denominador WASDE; FAS permanece na última semana oficial.'
  };
})();