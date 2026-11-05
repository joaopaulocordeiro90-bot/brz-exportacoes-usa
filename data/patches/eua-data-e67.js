
/* Correções de apresentação/benchmarks após auditoria e66; NÃO alterar observações CWR. */
(()=>{
 const D=window.E.deep;
 // Missing country-reclassification data is unknown, NOT a measured zero.
 const missing=new Set(['2026-09-03','2026-09-10','2026-09-17','2026-09-24']);
 D.nar.forEach(r=>{if(missing.has(r[0]))r[3]=null;});
 const now=window.E.dados.soja.wasde.at(-1)[1];
 D.nmy_wasde.soja[2026]=now; // same MY 26/27 reference as the official current WASDE
 const world=window.E.dados.soja.s.MUNDO;
 const pctFor=(my,goal)=>Object.fromEntries(world.filter(r=>r[1]===my&&r[2]>=1&&r[2]<=53)
   .map(r=>[String(r[2]),Math.round(1000*(r[3]+r[4])/goal)/10]));
 D.cur25=pctFor(2025,D.nmy_wasde.soja[2025]);
 D.cur26=pctFor(2026,now);
 D.cur_by_my=Object.assign(D.cur_by_my||{}, {'2025':D.cur25,'2026':D.cur26});
 D.perc_reference={week:'2026-10-01',history:'MY 2022–2025; same MY week',method:'empirical midrank',n_max:4};
})();
