/* BRZ EUA e99 · Soja: China x destinos não-China, curvas de commitment por MY.
   Fonte única: E.dados.soja.s (USDA/FAS). Não modifica números nem séries.
   UNKNOWN fica separado: não é atribuído à China nem ao não-China identificado. */
(function(){
'use strict';
const ID='cnnoncommit',CARD=ID+'|soja',NS='http://www.w3.org/2000/svg';
const NAVY='#1A3A5C',TEAL='#0D9488',HIST_DASH=['7 5','3 4','10 4 2 4','2 5','9 3'];
const fmt=n=>new Intl.NumberFormat('pt-BR',{minimumFractionDigits:1,maximumFractionDigits:1}).format(n);
const label=y=>String(y)+'/'+String((y+1)%100).padStart(2,'0');
function years(){
  return [...new Set((window.E?.dados?.soja?.s?.MUNDO||[]).map(r=>r[1]))].sort((a,b)=>a-b);
}
function rows(year){
  const s=window.E?.dados?.soja?.s||{};
  const world=(s.MUNDO||[]).filter(r=>r[1]===year);
  const indexed=key=>new Map((s[key]||[]).filter(r=>r[1]===year).map(r=>[r[2],r]));
  const ch=indexed('China'),un=indexed('UNKNOWN');
  return world.map(w=>{
    const c=ch.get(w[2]),u=un.get(w[2]),total=w[3]+w[4];
    if(!c||!u||!(total>0))return {week:w[2],missing:true};
    const china=c[3]+c[4],unknown=u[3]+u[4],other=total-china-unknown;
    if(china<0||unknown<0||other< -0.02||!Number.isFinite(other))return {week:w[2],missing:true};
    return {week:w[2],year,total,china,other:Math.max(0,other),unknown,
      chinaPct:china/total*100,otherPct:Math.max(0,other)/total*100,unknownPct:unknown/total*100};
  }).sort((a,b)=>a.week-b.week);
}
function seriesAt(year,week){return rows(year).find(r=>r.week===week&&!r.missing)||null;}
function defaultConfig(){
 const yy=years(),cur=yy.at(-1),past=yy.filter(y=>y!==cur);
 const w=rows(cur).filter(r=>!r.missing).at(-1)?.week||1;
 return {week:w,mode:'volume',compare:past.length?[past.at(-1)]:[]};
}
function fromSnapshot(saved,base){
 if(!saved||typeof saved.html!=='string')return base;
 const root=document.createElement('div');root.innerHTML=saved.html;
 const title=root.querySelector('.p-card-t'),sub=root.querySelector('.p-card-s');
 const sel=(role)=>root.querySelector('select[data-role="'+role+'"]');
 const readSel=role=>{const s=sel(role);return s?(s.querySelector('option[selected]')?.value||s.value):null;};
 const sameData=saved.sourceDataAtual===window.E.meta.atual;
 const cmp=[...root.querySelectorAll('input[data-compare-year][checked]')].map(x=>+x.dataset.compareYear)
   .filter(y=>years().includes(y)&&y!==years().at(-1));
 return {week:sameData?Math.max(1,Math.min(base.week,Number(readSel('week'))||base.week)):base.week,
     mode:['volume','share'].includes(readSel('metric'))?readSel('metric'):base.mode,
     compare:root.querySelectorAll('input[data-compare-year]').length?cmp:base.compare,
     title:title?.textContent||null,sub:sub?.textContent||null,
     titleStyle:title?.getAttribute('style')||null,subStyle:sub?.getAttribute('style')||null,
     style:saved.style||null};
}
function graphic(config){
 const yy=years(),cur=yy.at(-1);
 const sel=[...new Set([cur,...config.compare])].sort((a,b)=>a-b);
 const all=sel.flatMap(y=>rows(y).filter(p=>!p.missing&&p.week<=config.week));
 const keys=config.mode==='share'?['chinaPct','otherPct']:['china','other'];
 const ymax=config.mode==='share'?100:Math.max(5,Math.ceil(Math.max(0,...all.flatMap(r=>keys.map(k=>r[k]/1000)))/5)*5);
 const toValue=(r,k)=>config.mode==='share'?r[k]:r[k]/1000;
 const maxY=config.mode==='share'?100:ymax;
 const X=w=>58+(w-1)/52*783, Y=v=>244-v/maxY*208, parts=[];
 const escape=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
 parts.push('<svg data-cnnon-graph="1" viewBox="0 0 900 288" width="100%" xmlns="'+NS+'" role="img" aria-label="Curvas de commitment soja China e destinos não-China, em '+(config.mode==='share'?'percentual':'milhões de toneladas')+' até a semana '+config.week+'" style="display:block;background:#fff;border-radius:4px">');
 // Graphic grid with reference axis.
 const yTicks=config.mode==='share'?[0,25,50,75,100]:[0,.25,.5,.75,1].map(q=>q*maxY);
 yTicks.forEach(v=>parts.push('<line x1="58" y1="'+Y(v).toFixed(1)+'" x2="841" y2="'+Y(v).toFixed(1)+'" stroke="#e6ebef" stroke-width="1"/><text x="49" y="'+(Y(v)+3).toFixed(1)+'" font-size="11" fill="#6b7280" text-anchor="end">'+fmt(v)+(config.mode==='share'?'%':'')+'</text>'));
 [1,5,9,13,17,21,25,29,33,37,41,45,49,53].forEach(w=>parts.push('<text x="'+X(w).toFixed(1)+'" y="269" font-size="10" text-anchor="middle" fill="#6b7280">'+w+'</text>'));
 parts.push('<text x="450" y="286" text-anchor="middle" font-size="10" fill="#6b7280">Semana do MY (set–ago)</text>');
 parts.push('<line x1="'+X(config.week).toFixed(1)+'" y1="29" x2="'+X(config.week).toFixed(1)+'" y2="244" stroke="#64748b" stroke-dasharray="2 4" stroke-width="1"/>');
 const legends=[];
 const sorted=sel.filter(y=>y!==cur).concat(cur);
 for(const year of sorted){
  const historical=year!==cur,index=yy.indexOf(year),dash=historical?HIST_DASH[index%HIST_DASH.length]:'';
  const r=rows(year).filter(p=>!p.missing&&p.week<=config.week);
  for(const [kind,key,color] of [['china',keys[0],NAVY],['other',keys[1],TEAL]]){
    let segments=[],seg=[],lastWeek=null;
    const flush=()=>{if(seg.length>1)segments.push(seg);seg=[]};
    for(const p of r){if(lastWeek!==null&&p.week-lastWeek>1)flush();seg.push(p);lastWeek=p.week;}
    flush();
    for(const block of segments){
      const path=block.map((p,i)=>(i?'L':'M')+X(p.week).toFixed(1)+' '+Y(toValue(p,key)).toFixed(1)).join(' ');
      parts.push('<path d="'+path+'" fill="none" stroke="'+color+'" stroke-width="'+(historical?'1.9':'3.3')+'" stroke-opacity="'+(historical?'0.63':'1')+'"'+(dash?' stroke-dasharray="'+dash+'"':'')+' stroke-linecap="round" stroke-linejoin="round"/>');
    }
    if(r.length===1){const p=r[0];parts.push('<circle cx="'+X(p.week).toFixed(1)+'" cy="'+Y(toValue(p,key)).toFixed(1)+'" r="2.7" fill="'+color+'"/>');}
    // Week X is a point of comparison; never replace missing data by zero.
    const selected=r.find(p=>p.week===config.week);
    if(selected){
      const v=toValue(selected,key),shown=fmt(v)+(config.mode==='share'?'%':' Mi t');
      parts.push('<circle data-cnnon-point="'+year+'-'+kind+'" cx="'+X(config.week).toFixed(1)+'" cy="'+Y(v).toFixed(1)+'" r="'+(historical?'3.5':'5')+'" fill="'+color+'" fill-opacity="'+(historical?'0.75':'1')+'" stroke="#fff" stroke-width="1.4"><title>'+escape(label(year)+' · '+(kind==='china'?'China':'Não-China')+' · '+shown)+'</title></circle>');
      if(!historical)parts.push('<text x="'+Math.min(864,X(config.week)+8).toFixed(1)+'" y="'+(Y(v)+(kind==='china'?-11:15)).toFixed(1)+'" font-size="12" font-weight="700" fill="'+color+'">'+shown+'</text>');
    }
    legends.push({year,kind,color,dash,now:!historical,missing:!selected});
  }
 }
 parts.push('</svg>');
 return {svg:parts.join(''),legends,years:sorted,at:Object.fromEntries(sorted.map(y=>[y,seriesAt(y,config.week)]))};
}
function build(com,c,saved){
 const base=defaultConfig(),config=fromSnapshot(saved,base);
 const el=document.createElement('div');
 el.className='p-card';el.dataset.card=CARD;el.style.gridColumn='1 / -1';
 el.style.minWidth='0';el.style.height='auto';el.style.minHeight='455px';
 if(config.style){el.style.cssText=config.style;el.style.gridColumn='1 / -1';el.style.height='auto';el.style.minHeight='455px';}
 el.innerHTML='<div class="p-card-h"><div><div class="p-card-t etext">'+c.t+'</div><div class="p-card-s etext">'+c.s+'</div></div><div class="cardtools"><div class="selrow" data-cnnon-controls="1" style="display:flex;align-items:center;flex-wrap:wrap;gap:6px"></div><div class="pal"></div></div></div><div class="china-year-controls" style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;padding:8px 15px 1px;font-size:11px"><strong>Comparar MY:</strong></div><div class="chart" style="padding:4px 8px 0;min-height:240px"></div><div class="china-metrics" style="padding:2px 15px 9px"></div><div class="lg china-legend" style="display:flex;flex-wrap:wrap;column-gap:16px;row-gap:5px;padding:2px 14px 12px;font-size:11px"></div><div class="foot"><span class="etext">Fonte: USDA/FAS ESR · China / Não-China identificado / UNKNOWN</span><span class="etext">Mi t · Share</span></div>';
 const title=el.querySelector('.p-card-t'),sub=el.querySelector('.p-card-s');
 if(config.title&&config.title!==c.t)title.textContent=config.title;
 if(config.sub&&config.sub!==c.s)sub.textContent=config.sub;
 if(config.titleStyle)title.setAttribute('style',config.titleStyle);
 if(config.subStyle)sub.setAttribute('style',config.subStyle);
 const controls=el.querySelector('[data-cnnon-controls]'),yearbar=el.querySelector('.china-year-controls');
 const wk=document.createElement('select');wk.dataset.role='week';wk.className='selp';wk.title='Exibir compromisso acumulado até a semana escolhida';wk.style.maxWidth='108px';
 for(let week=1;week<=53;week++){const opt=document.createElement('option');opt.value=week;opt.textContent='Sem. '+week;wk.appendChild(opt);}
 wk.value=String(config.week);controls.appendChild(wk);
 const mode=document.createElement('select');mode.dataset.role='metric';mode.className='selp';mode.title='Alternar entre volume e participação';mode.style.maxWidth='144px';
 for(const [v,t] of [['volume','Volume (Mi t)'],['share','Share (%)']]){const opt=document.createElement('option');opt.value=v;opt.textContent=t;mode.appendChild(opt);}
 mode.value=config.mode;controls.appendChild(mode);
 const lastYear=years().at(-1);
 for(const y of years().filter(y=>y!==lastYear)){
  const lab=document.createElement('label');lab.style.cssText='display:inline-flex;gap:4px;align-items:center;cursor:pointer;white-space:nowrap';
  const cb=document.createElement('input');cb.type='checkbox';cb.dataset.compareYear=String(y);cb.checked=config.compare.includes(y);
  if(cb.checked)cb.setAttribute('checked','');
  lab.appendChild(cb);lab.appendChild(document.createTextNode(label(y)));yearbar.appendChild(lab);
 }
 const pal=el.querySelector('.pal');
 const reset=document.createElement('button');reset.className='mini rst';reset.textContent='↺';reset.title='Reiniciar comparação e filtros';
 const png=document.createElement('button');png.className='mini png';png.textContent='⤓';png.title='Exportar gráfico PNG';
 pal.append(reset,png);
 const sync=()=>{
   for(const select of [wk,mode])for(const o of select.options){if(o.value===select.value)o.setAttribute('selected','');else o.removeAttribute('selected');}
   for(const cb of yearbar.querySelectorAll('input')){if(cb.checked)cb.setAttribute('checked','');else cb.removeAttribute('checked');}
 };
 const draw=()=>{
  const graph=graphic(config);
  el.querySelector('.chart').innerHTML=graph.svg;
  const lg=el.querySelector('.china-legend');lg.innerHTML='';
  for(const l of graph.legends){
   const sp=document.createElement('span');sp.style.cssText='display:inline-flex;gap:5px;align-items:center;color:#344054';
   sp.innerHTML='<svg width="24" height="9" viewBox="0 0 24 9"><line x1="1" y1="4.5" x2="23" y2="4.5" stroke="'+l.color+'" stroke-width="'+(l.now?'3':'2')+'"'+(l.dash?' stroke-dasharray="'+l.dash+'"':'')+' /></svg><b>'+label(l.year)+' '+(l.kind==='china'?'China':'Não-China')+'</b>'+(l.missing?' <span style="opacity:.5">—</span>':'');
   lg.appendChild(sp);
  }
  const metrics=el.querySelector('.china-metrics'),current=graph.at[lastYear];
  const line=(y,d)=>{
   if(!d)return '<span style="color:#64748b">'+label(y)+': sem leitura completa na sem. '+config.week+'</span>';
   const value=(k)=>fmt(config.mode==='share'?d[k+'Pct']:d[k]/1000)+(config.mode==='share'?'%':' Mi t');
   return '<b>'+label(y)+'</b> · China <b style="color:'+NAVY+'">'+value('china')+'</b> · Não-China <b style="color:'+TEAL+'">'+value('other')+'</b> · UNKNOWN '+fmt(d.unknown/1000)+' Mi t';
  };
  metrics.innerHTML='<div style="font-size:12px;line-height:1.6">'+line(lastYear,current)+'</div><div style="font-size:10px;color:#667085;margin-top:3px">Não-China = MUNDO − China − UNKNOWN. Share (%) = respectivo destino ÷ commitment MUNDO. UNKNOWN é mantido fora das duas linhas; lacunas no histórico não são preenchidas.</div>';
  sync();
  if(typeof window.wmFix==='function')window.wmFix(el);
  if(window.BRZFIT)window.BRZFIT(el);
 };
 wk.onchange=()=>{config.week=Number(wk.value);draw();};
 mode.onchange=()=>{config.mode=mode.value;draw();};
 yearbar.onchange=()=>{config.compare=[...yearbar.querySelectorAll('input:checked')].map(x=>Number(x.dataset.compareYear));draw();};
 reset.onclick=()=>{const d=defaultConfig();config.week=d.week;config.mode=d.mode;config.compare=d.compare;wk.value=String(config.week);mode.value=config.mode;yearbar.querySelectorAll('input').forEach(cb=>cb.checked=config.compare.includes(Number(cb.dataset.compareYear)));draw();};
 png.onclick=()=>{if(typeof window.baixar==='function')window.baixar(el,'soja_china_nao_china_semana_'+config.week,920,490);};
 el._getWeek=()=>config.week;el._getMode=()=>config.mode;el._draw=draw;
 el._syncControls=()=>{config.week=Number(wk.value);config.mode=mode.value;config.compare=[...yearbar.querySelectorAll('input:checked')].map(x=>Number(x.dataset.compareYear));draw();};
 el._rebuild=()=>{const newer=build(com,c,null);el.replaceWith(newer);};
 draw();return el;
}
window.BRZChinaNonChina={build,revive:(el,com,c)=>{const sv={html:el.innerHTML,style:el.getAttribute('style'),sourceDataAtual:window.E.meta.atual};const newer=build(com,c,sv);el.replaceWith(newer);return newer;},rows,seriesAt,graphic,defaultConfig};
})();