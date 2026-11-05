
/* ═══════════ BRZ EUA e88 · Base de Dados → Excel (.xlsx) completo (padrão BRZ SAFRA) ═══════════
   Uma planilha por base: séries CWR por commodity e destino, metas WASDE (safra corrente e nova),
   vendas oficiais da semana, expectativas pré-release, fluxo da China e fontes.
   Números como número, datas como data, cabeçalho fixo e filtro. Safras nunca misturadas. */
(function(){
'use strict';
const en=()=>document.documentElement.lang==='en';
const T=(pt,e)=>en()?e:pt;
const MYL=y=>String(y).slice(2)+'/'+String(+y+1).slice(2);
const P=p=>p==='MUNDO'?'Mundo':p==='UNKNOWN'?'Unknown':p;
function sheets(){
  const S=[];
  E.coms.forEach(c=>{
    const rows=[];
    Object.entries(E.dados[c].s).forEach(([p,arr])=>(arr||[]).forEach(r=>rows.push([r[0],MYL(r[1]),r[2],P(p),r[3],r[4],(r[3]!=null&&r[4]!=null)?+(r[3]+r[4]).toFixed(3):null,r[5]])));
    rows.sort((a,b)=>a[0]<b[0]?-1:a[0]>b[0]?1:(a[3]==='Mundo'?-1:b[3]==='Mundo'?1:a[3].localeCompare(b[3])));
    S.push({name:'ESR '+E.nome[c],rows:[['Semana até','MY','Semana do MY','Destino','Embarcado acumulado (mil t)','A embarcar (mil t)','Comprometido (mil t)','Book safra seguinte (mil t)']].concat(rows),
      widths:[13,8,13,20,24,17,20,25],fmt:{0:'date',4:'n1',5:'n1',6:'n1',7:'n1'}});
  });
  const wa=[['Commodity','Data do WASDE','Meta de exportação, MY corrente (mil t)']];
  E.coms.forEach(c=>(E.dados[c].wasde||[]).forEach(w=>wa.push([E.nome[c],w[0],w[1]])));
  S.push({name:'Metas WASDE',rows:wa,widths:[16,15,36],fmt:{1:'date',2:'n1'}});
  const nm=[['Commodity','MY','Meta de exportação, safra nova (mil t)']],NW=(E.deep&&E.deep.nmy_wasde)||{};
  Object.keys(NW).forEach(c=>Object.keys(NW[c]).sort().forEach(y=>nm.push([(E.nome&&E.nome[c])||c,MYL(+y),NW[c][y]])));
  S.push({name:'Metas safra nova',rows:nm,widths:[16,8,36],fmt:{2:'n1'}});
  const va=[['Semana até','Commodity','Net sales safra corrente (mil t)','Net sales safra seguinte (mil t)']],VA=(E.deep&&E.deep.vendActual)||{};
  Object.keys(VA).sort().forEach(d=>Object.entries(VA[d]).forEach(([c,o])=>{if(c.startsWith('__')||!o)return;va.push([d,(E.nome&&E.nome[c])||c,o.cy,o.nc]);}));
  S.push({name:'Vendas oficiais',rows:va,widths:[13,16,30,30],fmt:{0:'date',2:'n1',3:'n1'}});
  const ve=[['Semana até','Commodity','Corrente mín','Corrente máx','Seguinte mín','Seguinte máx','Combinada mín','Combinada máx']],VE=(E.deep&&E.deep.vendEst)||{};
  const mm=(a,i)=>Array.isArray(a)&&a[i]!=null?a[i]:null;
  Object.keys(VE).sort().forEach(d=>Object.entries(VE[d]).forEach(([c,o])=>{if(c.startsWith('__')||!o||typeof o!=='object')return;ve.push([d,(E.nome&&E.nome[c])||c,mm(o.cy,0),mm(o.cy,1),mm(o.nc,0),mm(o.nc,1),mm(o.comb,0),mm(o.comb,1)]);}));
  S.push({name:'Expectativas pré-release',rows:ve,widths:[13,16,13,13,13,13,14,14],fmt:{0:'date',2:'n0',3:'n0',4:'n0',5:'n0',6:'n0',7:'n0'}});
  const na=[['Semana até','China net sales (mil t)','China embarques (mil t)','Switched Unknown → China (mil t)','China net safra seguinte (mil t)']];
  ((E.deep&&E.deep.nar)||[]).forEach(r=>na.push([r[0],r[1],r[2],r[3],r[4]]));
  S.push({name:'China fluxo',rows:na,widths:[13,22,22,30,30],fmt:{0:'date',1:'n1',2:'n1',3:'n1',4:'n1'}});
  S.push({name:'Fontes e notas',rows:[['Campo','Valor'],['Arquivo','BRZ EUA '+(typeof BUILD!=='undefined'?BUILD:'')],['Dados até',(E.meta||{}).atual||''],['Release',(E.meta||{}).gerado||''],
    ['Fonte','USDA FAS, Export Sales Report (CWR por destino e Weekly Highlights); metas de exportação do WASDE'],['Unidade','mil t'],
    ['Regras','Safra corrente e safra nova em colunas separadas; switched sem observação fica vazio, não zero; expectativas combinadas não são divididas por safra']],widths:[18,120],fmt:{},filter:false});
  return S;
}
const lbl=()=>T('⬇ Excel · base completa','⬇ Excel · full database');
function exportAll(btn){
  if(!window.BRZXLSX)return Promise.resolve(0);
  if(btn){btn.disabled=true;btn.textContent='…';}
  return window.BRZXLSX.download('BRZ_EUA_base_completa_'+((E.meta||{}).atual||'')+'.xlsx',sheets()).then(sz=>{if(typeof toast==='function')toast(T('Excel gerado ✓','Excel generated ✓'));return sz;})
    .finally(()=>{if(btn){btn.disabled=false;btn.textContent=lbl();}});
}
function mount(){
  document.querySelectorAll('#db-xlsx,#op-xlsx').forEach(x=>x.remove());
  const a=document.getElementById('db-csv');
  if(a){const b=document.createElement('button');b.id='db-xlsx';b.className='primary';b.type='button';b.textContent=lbl();b.onclick=()=>exportAll(b);a.insertAdjacentElement('afterend',b);}
  const o=document.getElementById('op-csvs');
  if(o){const b=document.createElement('button');b.id='op-xlsx';b.type='button';b.textContent=lbl();b.onclick=()=>exportAll(b);o.insertAdjacentElement('afterend',b);}
}
function init(){mount();new MutationObserver(()=>{document.querySelectorAll('#db-xlsx,#op-xlsx').forEach(b=>{if(!b.disabled)b.textContent=lbl();});}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  window.BRZEUAXLSX={sheets,exportAll};}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
