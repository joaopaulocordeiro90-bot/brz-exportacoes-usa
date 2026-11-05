
/* ═══════════ BRZ EUA e88 · Quadro da semana (padrão do quadro de estimativas da BRZ SAFRA) ═══════════
   Topo de cada commodity: fluxo da semana (net sales safra corrente e nova, embarques), posição
   acumulada (comprometido, % do programa USDA, embarcado, book da safra nova) contra semana anterior,
   média de 4 semanas, mesma semana do MY anterior e média das safras anteriores; destinos da semana;
   leitura no padrão da mesa. Tudo calculado de E.dados (CWR) e E.deep (vendas oficiais);
   nenhum número digitado aqui. Safra corrente e safra nova nunca se misturam. */
(function(){
'use strict';
const en=()=>document.documentElement.lang==='en';
const T=(pt,e)=>en()?e:pt;
const esc=s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const NFQ=[0,1,2,3].map(d=>new Intl.NumberFormat('pt-BR',{minimumFractionDigits:d,maximumFractionDigits:d}));
const nf=(v,d)=>{if(v==null||!isFinite(v))return 'n/d';let s=NFQ[d].format(v);if(/^-0(,0+)?$/.test(s))s=s.slice(1);return s.replace(/^-/,'−');};
const sg=(v,d)=>{if(v==null||!isFinite(v))return 'n/d';const r=Number(v.toFixed(d));return (r===0?'':r>0?'+':'−')+nf(Math.abs(r),d);};
const tone=(v,eps)=>v==null||!isFinite(v)?'q-na':Math.abs(v)<eps?'q-flat':v>0?'q-up':'q-down';
const MES=['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'],MES_EN=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const dBR=iso=>{const p=String(iso||'').split('-');return p.length===3?p[2]+'/'+p[1]+'/'+p[0].slice(2):String(iso||'');};
const mRef=iso=>{const p=String(iso||'').split('-');return p.length>=2?(en()?MES_EN[+p[1]-1]:MES[+p[1]-1])+'/'+p[0].slice(2):'';};
const NOME=c=>(E.nome&&E.nome[c])||c;
const NOME_EN={soja:'Soybeans',farelo:'Soybean meal',oleo:'Soybean oil',milho:'Corn',trigo:'Wheat'};
const nomeC=c=>en()?(NOME_EN[c]||NOME(c)):NOME(c);
const paisN=p=>p==='MUNDO'?T('Mundo','World'):p==='UNKNOWN'?'Unknown':p;
const ST={};
/* ── núcleo de cálculo ── */
const rowAt=(com,p,y,w)=>(E.dados[com].s[p]||[]).find(r=>r[1]===y&&r[2]===w)||null;
function official(com,r,k){if(!r)return null;const d=typeof periodEndISO==='function'?periodEndISO(r[0]):r[0];const o=E.deep&&E.deep.vendActual&&E.deep.vendActual[d]&&E.deep.vendActual[d][com];return o&&o[k]!=null?o[k]:null;}
function netCY(com,p,y,w){const a=rowAt(com,p,y,w);if(!a)return null;
  if(p==='MUNDO'){const o=official(com,a,'cy');if(o!=null)return o;}
  const b=rowAt(com,p,y,w-1);if(b)return (a[3]+a[4])-(b[3]+b[4]);
  const prev=(E.dados[com].s[p]||[]).filter(r=>r[1]===y-1),last=prev[prev.length-1];
  return last&&last[5]!=null?(a[3]+a[4])-last[5]:null;}
function netNC(com,p,y,w){const a=rowAt(com,p,y,w);if(!a)return null;
  if(p==='MUNDO'){const o=official(com,a,'nc');if(o!=null)return o;}
  if(a[5]==null)return null;const b=rowAt(com,p,y,w-1);if(b)return b[5]!=null?a[5]-b[5]:null;return a[5];}
function expW(com,p,y,w){const a=rowAt(com,p,y,w);if(!a)return null;const b=rowAt(com,p,y,w-1);return b?a[3]-b[3]:a[3];}
/* série MUNDO em ordem de data, com a mesma regra da tabela Vendas Semanais (virada de MY e vendas oficiais) */
function netIdx(com,R,i,kind){if(i<=0||!R[i]||!R[i-1])return null;const a=R[i],b=R[i-1],reset=(a[3]+a[4])<(b[3]+b[4])*0.5;
  if(kind==='cy'){const o=official(com,a,'cy');if(o!=null)return o;return reset?(a[3]+a[4])-(b[5]!=null?b[5]:0):(a[3]+a[4])-(b[3]+b[4]);}
  if(kind==='nc'){const o=official(com,a,'nc');if(o!=null)return o;if(reset)return a[5]!=null?a[5]:null;return (a[5]!=null&&b[5]!=null)?a[5]-b[5]:null;}
  return a[1]!==b[1]?a[3]:a[3]-b[3];}
const commit=(com,p,y,w)=>{const r=rowAt(com,p,y,w);return r?r[3]+r[4]:null;};
const accum=(com,p,y,w)=>{const r=rowAt(com,p,y,w);return r?r[3]:null;};
const book=(com,p,y,w)=>{const r=rowAt(com,p,y,w);return r&&r[5]!=null?r[5]:null;};
const mean=a=>{const v=a.filter(x=>x!=null&&isFinite(x));return v.length?v.reduce((p,q)=>p+q,0)/v.length:null;};
function alvoAt(com,date){let a=null;for(const w of (E.dados[com].wasde||[])){if(w[0]<=date&&Number.isFinite(w[1])&&w[1]>0)a=w[1];else if(w[0]>date)break;}return a;}
function ctx(com,wkSel){
  const ys=MYS(com),cy=ys[ys.length-1],py=cy-1,weeks=weeksAvailable(com),w=wkSel!=null&&weeks.includes(+wkSel)?+wkSel:weeks[weeks.length-1];
  const r=rowAt(com,'MUNDO',cy,w);if(!r)return null;
  const prevYs=ys.slice(0,-1);
  const alvo=alvoAt(com,r[0]),wl=(E.dados[com].wasde||[]).filter(x=>x[0]<=r[0]).slice(-1)[0];
  const pctOf=(y,ww,f)=>{const rr=rowAt(com,'MUNDO',y,ww);if(!rr)return null;const a=alvoAt(com,rr[0]);return a?100*f(rr)/a:null;};
  const fCm=rr=>rr[3]+rr[4],fAc=rr=>rr[3];
  const nmyAlvo=typeof nmyProgramKt==='function'?nmyProgramKt(com,cy+1):null;
  const R=(E.dados[com].s.MUNDO||[]).slice().sort((a,b)=>a[0]<b[0]?-1:a[0]>b[0]?1:0),ix=R.indexOf(r);
  const m4=k=>{const v=[0,1,2,3].map(j=>netIdx(com,R,ix-j,k)).filter(x=>x!=null);return v.length===4?v.reduce((a,b)=>a+b,0)/4:null;};
  const ma4=m4('cy'),ma4N=m4('nc'),ma4E=m4('exp');
  const cmNow=fCm(r),rest=Math.max(52-w,1),falta=alvo!=null?Math.max(alvo-cmNow,0):null;
  const latest=w===weeks[weeks.length-1],dP=typeof periodEndISO==='function'?periodEndISO(r[0]):r[0];
  const relD=latest&&E.meta&&E.meta.gerado?E.meta.gerado:new Date(Date.parse(dP+'T00:00:00Z')+7*864e5).toISOString().slice(0,10);
  const dPos=alvo!=null&&alvo<1500?3:2;
  return {com,ys,cy,py,w,weeks,r,date:dP,release:relD,alvo,dPos,wasdeData:wl?wl[0]:null,nmyAlvo,prevYs,
    flow:[
      {k:'netcy',pt:'Net sales safra '+myLbl(cy),e:'Net sales '+myLbl(cy),u:'mil t',now:netIdx(com,R,ix,'cy'),prev:netIdx(com,R,ix-1,'cy'),ma4,ly:netCY(com,'MUNDO',py,w)},
      {k:'netnc',pt:'Net sales safra '+myLbl(cy+1),e:'Net sales '+myLbl(cy+1),u:'mil t',now:netIdx(com,R,ix,'nc'),prev:netIdx(com,R,ix-1,'nc'),ma4:ma4N,ly:netNC(com,'MUNDO',py,w)},
      {k:'exp',pt:'Embarques '+myLbl(cy),e:'Shipments '+myLbl(cy),u:'mil t',now:netIdx(com,R,ix,'exp'),prev:netIdx(com,R,ix-1,'exp'),ma4:ma4E,ly:expW(com,'MUNDO',py,w)}],
    pos:[
      {k:'cm',pt:'Comprometido '+myLbl(cy),e:'Commitments '+myLbl(cy),u:'Mi t',d:dPos,s:1000,now:cmNow,prev:commit(com,'MUNDO',cy,w-1),ly:commit(com,'MUNDO',py,w),avg:mean(prevYs.map(y=>commit(com,'MUNDO',y,w)))},
      {k:'cmpct',pt:'% do programa USDA',e:'% of USDA program',u:'%',d:1,s:1,now:pctOf(cy,w,fCm),prev:pctOf(cy,w-1,fCm),ly:pctOf(py,w,fCm),avg:mean(prevYs.map(y=>pctOf(y,w,fCm)))},
      {k:'ac',pt:'Embarcado acumulado '+myLbl(cy),e:'Accumulated exports '+myLbl(cy),u:'Mi t',d:dPos,s:1000,now:r[3],prev:accum(com,'MUNDO',cy,w-1),ly:accum(com,'MUNDO',py,w),avg:mean(prevYs.map(y=>accum(com,'MUNDO',y,w)))},
      {k:'acpct',pt:'% do programa embarcado',e:'% of program shipped',u:'%',d:1,s:1,now:pctOf(cy,w,fAc),prev:pctOf(cy,w-1,fAc),ly:pctOf(py,w,fAc),avg:mean(prevYs.map(y=>pctOf(y,w,fAc)))},
      {k:'bk',pt:'Book safra '+myLbl(cy+1),e:'New-crop book '+myLbl(cy+1),u:'Mi t',d:dPos,s:1000,now:r[5],prev:book(com,'MUNDO',cy,w-1),ly:book(com,'MUNDO',py,w),avg:mean(prevYs.map(y=>book(com,'MUNDO',y,w)))}
    ].concat(nmyAlvo?[{k:'bkpct',pt:'Book % do programa '+myLbl(cy+1),e:'Book % of '+myLbl(cy+1)+' program',u:'%',d:1,s:1,now:r[5]!=null?100*r[5]/nmyAlvo:null,prev:null,ly:null,avg:null}]:[]),
    falta,rest,precisa:falta!=null?falta/rest:null,ma4};
}
function destinos(com,c){
  const ps=(E.dados[com].paises||[]).filter(p=>p!=='MUNDO');const cmW=commit(com,'MUNDO',c.cy,c.w);
  const rows=ps.map(p=>{const cm=commit(com,p,c.cy,c.w);if(cm==null)return null;const ly=commit(com,p,c.py,c.w);
    return {p,net:netCY(com,p,c.cy,c.w),exp:expW(com,p,c.cy,c.w),cm,sh:cmW?100*cm/cmW:null,ly,dly:ly?100*(cm/ly-1):null};}).filter(Boolean);
  rows.sort((a,b)=>(b.net==null?-1e12:b.net)-(a.net==null?-1e12:a.net));
  return {rows,tot:{p:'MUNDO',net:netCY(com,'MUNDO',c.cy,c.w),exp:expW(com,'MUNDO',c.cy,c.w),cm:cmW,sh:100,ly:commit(com,'MUNDO',c.py,c.w)}};
}
/* ── leitura no padrão da mesa ── */
function leitura(com,c,D){
  const f=c.flow,n=f[0],nn=f[1],x=f[2],p=c.pos,cm=p[0],cmp=p[1],out=[];
  const cmpTxt=(a,b,pt,e)=>{if(a==null||b==null)return '';const d=a-b;if(Math.abs(d)<0.5)return T(', em linha com '+pt,', in line with '+e);return T(', '+nf(Math.abs(d),0)+' mil t '+(d>0?'acima':'abaixo')+' d'+pt,', '+nf(Math.abs(d),0)+' kt '+(d>0?'above':'below')+' '+e);};
  if(n.now!=null)out.push(T(nomeC(com)+': net sales de '+nf(n.now,0)+' mil t na safra '+myLbl(c.cy)+' na semana até '+dBR(c.date),nomeC(com)+': net sales of '+nf(n.now,0)+' kt for '+myLbl(c.cy)+' in the week through '+dBR(c.date))
    +cmpTxt(n.now,n.ma4,'a média de 4 semanas ('+nf(n.ma4,0)+' mil t)','the 4-week average ('+nf(n.ma4,0)+' kt)')+'.');
  if(nn.now!=null&&Math.abs(nn.now)>=0.5)out.push(T('Safra '+myLbl(c.cy+1)+': '+sg(nn.now,0)+' mil t.','New crop '+myLbl(c.cy+1)+': '+sg(nn.now,0)+' kt.'));
  if(x.now!=null)out.push(T('Embarques de '+nf(x.now,0)+' mil t'+(x.ma4!=null?', contra '+nf(x.ma4,0)+' mil t na média de 4 semanas':'')+'.','Shipments of '+nf(x.now,0)+' kt'+(x.ma4!=null?', against a 4-week average of '+nf(x.ma4,0)+' kt':'')+'.'));
  if(cm.now!=null&&cmp.now!=null)out.push(T('Comprometido em '+nf(cm.now/1000,c.dPos)+' Mi t, '+nf(cmp.now,1)+'% do programa USDA'+(cmp.avg!=null?(Math.abs(cmp.now-cmp.avg)<0.5?', em linha com a média das safras anteriores na mesma semana ('+nf(cmp.avg,1)+'%)':', contra '+nf(cmp.avg,1)+'% na média das safras anteriores na mesma semana'):'')+'.',
    'Commitments at '+nf(cm.now/1000,c.dPos)+' Mmt, '+nf(cmp.now,1)+'% of the USDA program'+(cmp.avg!=null?(Math.abs(cmp.now-cmp.avg)<0.5?', in line with the earlier-crop average for the same week ('+nf(cmp.avg,1)+'%)':', against '+nf(cmp.avg,1)+'% on average for the same week of earlier crops'):'')+'.'));
  if(c.precisa!=null&&c.falta>0)out.push(T('Faltam '+nf(c.falta/1000,c.dPos)+' Mi t para o programa, '+nf(c.precisa,0)+' mil t por semana até o fim do MY'+(c.ma4!=null?(c.ma4>=c.precisa?'; a média de 4 semanas cobre esse ritmo':'; a média de 4 semanas fica abaixo desse ritmo'):'')+'.',
    nf(c.falta/1000,c.dPos)+' Mmt left to reach the program, '+nf(c.precisa,0)+' kt per week through the end of the MY'+(c.ma4!=null?(c.ma4>=c.precisa?'; the 4-week average covers that pace':'; the 4-week average runs below that pace'):'')+'.'));
  const top=D.rows.filter(r=>r.net!=null&&r.net>=0.5&&r.p!=='UNKNOWN').slice(0,2);
  if(top.length)out.push(T((top.length>1?top[0].p+' e '+top[1].p+' lideraram as compras, com ':top[0].p+' liderou as compras, com ')+top.map(r=>nf(r.net,0)).join(' e ')+' mil t.',
    (top.length>1?top[0].p+' and '+top[1].p+' led purchases at ':top[0].p+' led purchases at ')+top.map(r=>nf(r.net,0)).join(' and ')+' kt.'));
  return out.join(' ');
}
/* ── tela ── */
function render(com){
  const scr=document.getElementById('scr-'+com);if(!scr||!E.coms.includes(com))return;
  let root=scr.querySelector(':scope > .rev-wrap[data-q-root="eua-'+com+'"]');
  if(!root){root=document.createElement('div');root.className='rev-wrap q26';root.dataset.qRoot='eua-'+com;scr.insertBefore(root,scr.querySelector('.grid2'));}
  const st=ST[com]=ST[com]||{w:null};const c=ctx(com,st.w);if(!c){root.innerHTML='';return;}
  const D=destinos(com,c);
  const wOpt=c.weeks.slice().reverse().map(w=>`<option value="${w}"${w===c.w?' selected':''}>${esc(T('Sem. ','Wk. ')+w)}</option>`).join('');
  const prog=c.alvo!=null?T(' · programa USDA '+nf(c.alvo/1000,2)+' Mi t (WASDE '+mRef(c.wasdeData)+')',' · USDA program '+nf(c.alvo/1000,2)+' Mmt (WASDE '+mRef(c.wasdeData)+')'):'';
  const head=`<div class="q-head"><div><h2>${esc(T('Quadro da semana','Week at a glance'))} · ${esc(nomeC(com))}</h2><div class="q-sub">${esc(T('USDA ESR · semana até '+dBR(c.date)+' · release '+dBR(c.release)+' · MY '+myLbl(c.cy)+' semana '+c.w,'USDA ESR · week through '+dBR(c.date)+' · release '+dBR(c.release)+' · MY '+myLbl(c.cy)+' week '+c.w)+prog)}</div></div>`+
    `<div class="q-tools"><label>${esc(T('Semana','Week'))}<select data-q-ewk>${wOpt}</select></label></div></div>`;
  const py=myLbl(c.py);
  const tf=`<div class="q-scroll"><table class="q-table"><thead><tr><th class="q-l">${esc(T('Fluxo da semana','Weekly flow'))}<small>${esc(T('mil t','kt'))}</small></th><th class="q-now">${esc(T('Semana '+c.w,'Week '+c.w))}<small>${esc(dBR(c.date))}</small></th><th>${esc(T('Semana anterior','Prior week'))}</th><th>${esc(T('Média 4 semanas','4-week avg'))}</th><th>${esc(T('Mesma semana '+py,'Same week '+py))}</th><th>${esc(T('vs '+py,'vs '+py))}</th></tr></thead><tbody>`+
    c.flow.map(r=>{const d=r.now!=null&&r.ly!=null?r.now-r.ly:null;return `<tr><td class="q-l">${esc(T(r.pt,r.e))}</td><td class="q-now"><b>${esc(nf(r.now,0))}</b></td><td>${esc(nf(r.prev,0))}</td><td>${esc(nf(r.ma4,0))}</td><td>${esc(nf(r.ly,0))}</td><td class="${tone(d,0.5)}">${esc(sg(d,0))}</td></tr>`;}).join('')+`</tbody></table></div>`;
  const tp=`<div class="q-scroll q-gap"><table class="q-table"><thead><tr><th class="q-l">${esc(T('Posição acumulada','Cumulative position'))}<small>${esc(T('Mi t, salvo indicação','Mmt unless stated'))}</small></th><th class="q-now">${esc(T('Semana '+c.w,'Week '+c.w))}</th><th>${esc(T('Semana anterior','Prior week'))}</th><th>${esc(T('Mesma semana '+py,'Same week '+py))}</th><th>${esc(T('Média safras anteriores','Earlier-crop avg'))}<small>${esc(T('mesma semana','same week'))}</small></th><th>${esc(T('vs média','vs avg'))}</th></tr></thead><tbody>`+
    c.pos.map(r=>{const v=x=>x==null?null:x/r.s,d=r.now!=null&&r.avg!=null?v(r.now)-v(r.avg):null,pp=r.u==='%';
      return `<tr><td class="q-l">${esc(T(r.pt,r.e))}</td><td class="q-now"><b>${esc(nf(v(r.now),r.d)+(pp&&r.now!=null?'%':''))}</b></td><td>${esc(nf(v(r.prev),r.d)+(pp&&r.prev!=null?'%':''))}</td><td>${esc(nf(v(r.ly),r.d)+(pp&&r.ly!=null?'%':''))}</td><td>${esc(nf(v(r.avg),r.d)+(pp&&r.avg!=null?'%':''))}</td><td class="${tone(d,pp?0.05:0.005)}">${esc(sg(d,r.d)+(pp&&d!=null?' p.p.':''))}</td></tr>`;}).join('')+`</tbody></table></div>`;
  const read=`<div class="q-note q-read">${esc(leitura(com,c,D))}</div>`;
  const main=`<div class="q-card q-maincard"><div class="q-card-h"><div><div class="q-card-t">${esc(nomeC(com))} · ${esc(T('vendas, embarques e programa','sales, shipments and program'))}</div><div class="q-card-s">${esc(T('Net sales = variação do comprometido; book = vendas da safra seguinte; % do programa sobre o WASDE vigente na data de cada semana','Net sales = change in commitments; book = sales for the following crop; % of program over the WASDE in force at each week'))}</div></div>`+
    `<div class="q-tools" data-noexport><button type="button" class="q-btn" data-q-ecsv="main">CSV</button><button type="button" class="q-btn" data-q-epng="main">PNG 3×</button></div></div>${tf}${tp}${read}</div>`;
  const shown=st.all?D.rows:D.rows.slice(0,10);
  const td=`<div class="q-scroll"><table class="q-table q-uf"><thead><tr><th class="q-l">${esc(T('Destino','Destination'))}</th><th class="q-now">${esc(T('Net sales semana','Net sales week'))}<small>${esc(T('mil t','kt'))}</small></th><th>${esc(T('Embarques semana','Shipments week'))}<small>${esc(T('mil t','kt'))}</small></th><th>${esc(T('Comprometido','Commitments'))}<small>Mi t</small></th><th>${esc(T('Share','Share'))}<small>%</small></th><th>${esc(T('Mesma semana '+py,'Same week '+py))}<small>Mi t</small></th><th>${esc(T('vs '+py,'vs '+py))}<small>%</small></th></tr></thead><tbody>`+
    shown.map(r=>`<tr class="${r.p==='China'?'q-hl':''}"><td class="q-l"><b>${esc(paisN(r.p))}</b></td><td class="q-now ${tone(r.net,0.5)}">${esc(sg(r.net,0))}</td><td>${esc(nf(r.exp,0))}</td><td>${esc(nf(r.cm/1000,c.dPos))}</td><td>${esc(nf(r.sh,1))}</td><td>${esc(nf(r.ly==null?null:r.ly/1000,c.dPos))}</td><td class="${tone(r.dly,0.05)}">${esc(r.dly==null?'n/d':sg(r.dly,1))}</td></tr>`).join('')+
    `<tr class="q-tot"><td class="q-l"><b>${esc(T('Mundo','World'))}</b></td><td class="q-now"><b>${esc(sg(D.tot.net,0))}</b></td><td><b>${esc(nf(D.tot.exp,0))}</b></td><td><b>${esc(nf(D.tot.cm/1000,c.dPos))}</b></td><td>100,0</td><td>${esc(nf(D.tot.ly==null?null:D.tot.ly/1000,c.dPos))}</td><td class="${tone(D.tot.ly?100*(D.tot.cm/D.tot.ly-1):null,0.05)}">${esc(D.tot.ly?sg(100*(D.tot.cm/D.tot.ly-1),1):'n/d')}</td></tr></tbody></table></div>`+
    (D.rows.length>10?`<div class="q-foot"><span>${esc(T('Destinos monitorados no painel; Unknown = destino desconhecido','Destinations tracked in the panel; Unknown = unknown destination'))}</span><button type="button" class="q-more" data-q-eall>${esc(st.all?T('Mostrar os 10 principais','Show top 10'):T('Ver os '+D.rows.length+' destinos','See all '+D.rows.length+' destinations'))}</button></div>`:'');
  const dest=`<div class="q-card q-ufcard"><div class="q-card-h"><div><div class="q-card-t">${esc(nomeC(com))} · ${esc(T('destinos da semana','destinations of the week'))}</div><div class="q-card-s">${esc(T('Ordenado pelo net sales da semana na safra '+myLbl(c.cy),'Sorted by the week\'s net sales for '+myLbl(c.cy)))}</div></div>`+
    `<div class="q-tools" data-noexport><button type="button" class="q-btn" data-q-ecsv="dest">CSV</button><button type="button" class="q-btn" data-q-epng="dest">PNG 3×</button></div></div>${td}</div>`;
  const src=`<div class="q-src">${esc(T('Fonte: USDA FAS, Export Sales Report (CWR por destino); metas de exportação do WASDE vigente em cada data. Safra corrente e safra nova calculadas em separado.','Source: USDA FAS Export Sales Report (CWR by destination); export targets from the WASDE in force at each date. Current and new crop computed separately.'))}</div>`;
  root.innerHTML=head+main+dest+src;
  root._ctx=c;root._dest=D;
}
/* CSV e PNG */
function csv(com,which){
  const root=document.querySelector('[data-q-root="eua-'+com+'"]');if(!root||!root._ctx)return;const c=root._ctx,D=root._dest;
  const q=s=>'"'+String(s==null?'':s).replace(/"/g,'""')+'"',n=(v,d)=>v==null||!isFinite(v)?'':v.toFixed(d).replace('.',',');
  let rows;
  if(which==='dest')rows=[['Destino','Net sales semana (mil t)','Embarques semana (mil t)','Comprometido (Mi t)','Share (%)','Mesma semana '+myLbl(c.py)+' (Mi t)','vs '+myLbl(c.py)+' (%)']].concat(D.rows.concat([D.tot]).map(r=>[paisN(r.p),n(r.net,1),n(r.exp,1),n(r.cm/1000,3),n(r.sh,2),n(r.ly==null?null:r.ly/1000,3),n(r.dly,2)]));
  else rows=[['Indicador','Semana '+c.w,'Semana anterior','Média 4 semanas / média safras anteriores','Mesma semana '+myLbl(c.py)]].concat(c.flow.map(r=>[r.pt+' (mil t)',n(r.now,1),n(r.prev,1),n(r.ma4,1),n(r.ly,1)])).concat(c.pos.map(r=>[r.pt+(r.u==='%'?' (%)':' (Mi t)'),n(r.now==null?null:r.now/r.s,3),n(r.prev==null?null:r.prev/r.s,3),n(r.avg==null?null:r.avg/r.s,3),n(r.ly==null?null:r.ly/r.s,3)]));
  const u=URL.createObjectURL(new Blob(['\ufeff'+rows.map(r=>r.map(q).join(';')).join('\r\n')],{type:'text/csv;charset=utf-8'}));
  const a=document.createElement('a');a.href=u;a.download='BRZ_EUA_quadro_'+com+'_'+which+'_sem'+c.w+'.csv';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),3000);
}
const PROPS=['display','position','width','height','min-width','max-width','margin-top','margin-right','margin-bottom','margin-left','padding-top','padding-right','padding-bottom','padding-left','border-top-width','border-right-width','border-bottom-width','border-left-width','border-top-style','border-right-style','border-bottom-style','border-left-style','border-top-color','border-right-color','border-bottom-color','border-left-color','border-top-left-radius','border-top-right-radius','border-bottom-left-radius','border-bottom-right-radius','background-color','color','font-family','font-size','font-weight','line-height','letter-spacing','text-align','vertical-align','white-space','box-sizing','flex-grow','flex-shrink','flex-basis','flex-direction','flex-wrap','align-items','justify-content','gap','border-collapse','border-spacing','font-variant-numeric','opacity'];
function png(com,which){
  const root=document.querySelector('[data-q-root="eua-'+com+'"]');if(!root)return;const src=root.querySelector(which==='dest'?'.q-ufcard':'.q-maincard');if(!src)return;
  const wasX=src.classList.contains('q-expanded');if(wasX)src.classList.remove('q-expanded');
  const W=Math.ceil(src.getBoundingClientRect().width),K=3,cl=src.cloneNode(true),A=[src,...src.querySelectorAll('*')],B=[cl,...cl.querySelectorAll('*')];
  A.forEach((e,i)=>{const cs=getComputedStyle(e);let s='';for(const p of PROPS){const v=cs.getPropertyValue(p);if(v!=='')s+=p+':'+v+';';}B[i].setAttribute('style',s);});
  cl.querySelectorAll('[data-noexport]').forEach(x=>x.remove());cl.style.margin='0';cl.style.width=W+'px';cl.style.position='relative';
  if(wasX)src.classList.add('q-expanded');
  const ft=document.createElement('div');ft.setAttribute('style',"margin-top:8px;font:400 10px 'Arial Nova Cond','Arial Narrow',Arial,sans-serif;color:#64748B");ft.textContent=T('Fonte: USDA FAS · ESR · BRZ EUA','Source: USDA FAS · ESR · BRZ EUA');cl.appendChild(ft);
  if(typeof LOGO_HREF!=='undefined'){const wm=document.createElement('img');wm.setAttribute('src',LOGO_HREF);wm.setAttribute('style','position:absolute;left:50%;top:50%;width:150px;transform:translate(-50%,-50%);opacity:.25');cl.appendChild(wm);}
  const host=document.createElement('div');host.setAttribute('style','position:absolute;left:-20000px;top:0;width:'+W+'px');host.appendChild(cl);document.body.appendChild(host);const Hh=Math.ceil(cl.getBoundingClientRect().height);host.remove();
  const svg='<svg xmlns="http://www.w3.org/2000/svg" width="'+W+'" height="'+Hh+'"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml">'+new XMLSerializer().serializeToString(cl)+'</div></foreignObject></svg>';
  const img=new Image();img.onload=()=>{const cv=document.createElement('canvas');cv.width=W*K;cv.height=Hh*K;const g=cv.getContext('2d');g.fillStyle='#fff';g.fillRect(0,0,cv.width,cv.height);g.drawImage(img,0,0,cv.width,cv.height);
    const a=document.createElement('a');a.download='BRZ_EUA_quadro_'+com+'_'+which+'.png';a.href=cv.toDataURL('image/png');a.click();};
  img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
}
document.addEventListener('change',e=>{const s=e.target.closest('[data-q-ewk]');if(!s)return;const root=s.closest('[data-q-root]');const com=root.dataset.qRoot.replace('eua-','');(ST[com]=ST[com]||{}).w=+s.value;render(com);});
document.addEventListener('click',e=>{const t=e.target,root=t.closest('[data-q-root^="eua-"]');if(!root)return;const com=root.dataset.qRoot.replace('eua-','');
  const cb=t.closest('[data-q-ecsv]');if(cb){csv(com,cb.dataset.qEcsv);return;}
  const pb=t.closest('[data-q-epng]');if(pb){png(com,pb.dataset.qEpng);return;}
  if(t.closest('[data-q-eall]')){(ST[com]=ST[com]||{}).all=!(ST[com]||{}).all;render(com);}});
new MutationObserver(()=>{const on=document.querySelector('.screen.on');if(!on)return;const com=on.id.replace('scr-','');if(E.coms.includes(com))render(com);}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
window.BRZQEUA={render,ctx,destinos};
})();
