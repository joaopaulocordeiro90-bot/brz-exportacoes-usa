
/* ═══════════ BRZ · modo dinâmico nativo (padrão BRZ SAFRA, EUA e88) ═══════════
   Substitui o ECharts via CDN: o arquivo funciona 100% offline. Implementa em SVG o subconjunto da
   API que o app usa (init, setOption com merge de séries, getOption, resize, dispose,
   on('legendselectchanged'), dispatchAction) e os tipos dos cartões do EUA: linha, linha por data,
   barras simples e empilhadas, área empilhada, barras horizontais, combinado com dois eixos,
   rosca, mapa de calor, halteres e sankey. Recursos: dica com mira, legenda clicável, zoom por
   arraste (duplo clique desfaz), linha ↔ barra, média e máx/mín, tabela de dados, PNG 3×, CSV
   e tela cheia. */
(function(){
'use strict';
if(window.echarts&&!window.echarts.__brzNative)return;
const NS='http://www.w3.org/2000/svg';
const FF="'Arial Nova Cond','Arial Nova Condensed','Arial Narrow',Arial,sans-serif";
const isEN=()=>document.documentElement.lang==='en';
const L=(pt,en)=>isEN()?en:pt;
const loc=()=>isEN()?'en-US':'pt-BR';
const S=(tag,a,p)=>{const e=document.createElementNS(NS,tag);if(a)for(const k in a)if(a[k]!=null)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e;};
const E=(tag,cls,p)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(p)p.appendChild(e);return e;};
const esc=s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
function nice(lo,hi,target){
  if(!isFinite(lo)||!isFinite(hi)){lo=0;hi=1;}
  if(hi<=lo)hi=lo+(Math.abs(lo)||1);
  const raw=(hi-lo)/(target||5),p=Math.pow(10,Math.floor(Math.log10(raw))),n=raw/p;
  const step=(n<=1?1:n<=2?2:n<=2.5?2.5:n<=5?5:10)*p;
  const a=Math.floor(lo/step+1e-9)*step,b=Math.ceil(hi/step-1e-9)*step,t=[];
  for(let v=a;v<=b+step*1e-6;v+=step)t.push(+v.toFixed(10));
  return {lo:a,hi:b,step,ticks:t};
}
const nz=s=>/^-0(?:[.,]0+)?$/.test(s)?s.slice(1):s;
const fnum=(v,step)=>{const d=!isFinite(step)||step>=1?0:Math.min(4,Math.ceil(-Math.log10(step)-1e-9));return nz(Number(v).toLocaleString(loc(),{minimumFractionDigits:d,maximumFractionDigits:d}));};
function axLabel(ax,v,step){const f=ax&&ax.axisLabel&&ax.axisLabel.formatter;if(typeof f==='function')return String(f(v));const s=fnum(v,step);return typeof f==='string'?f.replace('{value}',s):s;}
const val=it=>it==null?null:(typeof it==='object'&&!Array.isArray(it))?('value' in it?it.value:null):it;
const icol=(it,s)=>(it&&typeof it==='object'&&it.itemStyle&&it.itemStyle.color)||s.color||'#64748B';
function norm(s){return (s.data||[]).map((it,i)=>{
  if(it==null)return {i,x:i,y:null,item:it};
  if(Array.isArray(it))return {i,x:it[0],y:it[1],item:it};
  if(typeof it==='object'&&Array.isArray(it.value))return {i,x:it.value[0],y:it.value[1],item:it};
  if(typeof it==='object'&&'value' in it)return {i,x:i,y:it.value,item:it};
  return {i,x:i,y:it,item:it};});}
const mk=c=>`<span style="display:inline-block;margin-right:5px;border-radius:2px;width:8px;height:8px;background:${c}"></span>`;
function tipEl(){let t=document.getElementById('dyntip');if(!t){t=E('div','',document.body);t.id='dyntip';}t.setAttribute('data-noi18n','');return t;}
function textW(s,fs){return String(s).length*fs*0.5;}
function hexRGB(h){h=String(h||'#000').trim();if(h[0]==='#'){if(h.length===4)h='#'+h[1]+h[1]+h[2]+h[2]+h[3]+h[3];return [parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];}
  const m=h.match(/\d+/g);return m?m.slice(0,3).map(Number):[0,0,0];}
function ramp(cols,t){t=Math.max(0,Math.min(1,t));const n=cols.length-1,k=Math.min(n-1,Math.floor(t*n)),f=t*n-k,a=hexRGB(cols[k]),b=hexRGB(cols[k+1]);
  return 'rgb('+a.map((v,i)=>Math.round(v+(b[i]-v)*f)).join(',')+')';}
const lum=c=>{const r=hexRGB(c);return (0.299*r[0]+0.587*r[1]+0.114*r[2])/255;};
function arcPath(cx,cy,r0,r1,a0,a1){const big=a1-a0>Math.PI?1:0,p=(r,a)=>[cx+r*Math.cos(a),cy+r*Math.sin(a)];
  const [x0,y0]=p(r1,a0),[x1,y1]=p(r1,a1),[x2,y2]=p(r0,a1),[x3,y3]=p(r0,a0);
  return `M${x0.toFixed(2)} ${y0.toFixed(2)}A${r1} ${r1} 0 ${big} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}L${x2.toFixed(2)} ${y2.toFixed(2)}A${r0} ${r0} 0 ${big} 0 ${x3.toFixed(2)} ${y3.toFixed(2)}Z`;}
const pct=(v,ref)=>{const s=String(v==null?'':v).trim();return s.endsWith('%')?parseFloat(s)/100*ref:parseFloat(s);};

class NChart{
  constructor(dom){
    this.dom=dom;this.opt=null;this.sel={};this.zoom=null;this.zoomC=null;this.magic=false;this.h={};this.dead=false;this._init=false;
    dom.innerHTML='';
    this.root=E('div','ndyn',dom);this.root.setAttribute('data-noi18n','');
    this.top=E('div','ndyn-top',this.root);this.leg=E('div','ndyn-leg',this.top);this.tools=E('div','ndyn-tools',this.top);
    this.box=E('div','ndyn-svg',this.root);
  }
  on(ev,fn){(this.h[ev]=this.h[ev]||[]).push(fn);}
  emit(ev,a){(this.h[ev]||[]).forEach(f=>{try{f(a);}catch(e){}});}
  getOption(){return {legend:[{selected:Object.assign({},this.sel)}]};}
  dispatchAction(a){if(!a||a.name==null)return;if(a.type==='legendSelect')this.sel[a.name]=true;else if(a.type==='legendUnSelect')this.sel[a.name]=false;else return;this.render();}
  kind(){const s=(this.opt&&this.opt.series)||[];return s.length&&s[0].type==='pie'?'pie':s.length&&s[0].type==='sankey'?'sankey':s.length&&s[0].type==='heatmap'?'heat':'cart';}
  legendItems(){
    const o=this.opt||{},s=o.series||[],k=this.kind();
    if(k==='pie')return (s[0].data||[]).map(d=>({name:d.name,color:icol(d,s[0])}));
    if(k==='heat')return [];
    if(o.legend&&Array.isArray(o.legend.data)&&o.legend.data.length)return o.legend.data.map(d=>typeof d==='string'?{name:d,color:'#1A3A5C'}:{name:d.name,color:(d.itemStyle&&d.itemStyle.color)||'#1A3A5C'});
    return s.filter(x=>x.name!=null).map(x=>({name:x.name,color:x.color||(x.lineStyle&&x.lineStyle.color)||'#94A3B8'}));
  }
  setOption(opt,notMerge){
    if(notMerge&&typeof notMerge==='object'&&this.opt){this.opt=Object.assign({},this.opt,opt||{});this.render();return;}
    this.opt=opt||{};const ls=(this.opt.legend&&this.opt.legend.selected)||{};
    const names=this.legendItems().map(i=>i.name);
    if(notMerge||!this._init){this.sel={};names.forEach(n=>{this.sel[n]=ls[n]!==false;});this._init=true;}
    else names.forEach(n=>{if(!(n in this.sel))this.sel[n]=ls[n]!==false;});
    this.render();
  }
  resize(){this.render();}
  dispose(){this.dead=true;this.hideTip();this.dom.innerHTML='';}
  hideTip(){const t=document.getElementById('dyntip');if(t)t.style.display='none';if(this.ui)this.ui.innerHTML='';}
  feat(){return (this.opt&&this.opt.toolbox&&this.opt.toolbox.feature)||{};}
  drawLegend(){
    this.leg.innerHTML='';
    this.legendItems().forEach(it=>{
      const b=E('button',this.sel[it.name]===false?'off':'',this.leg);b.type='button';
      b.innerHTML=`<i style="background:${it.color}"></i>${esc(it.name)}`;
      b.title=L('Clique para ocultar ou mostrar a série','Click to hide or show the series');
      b.onclick=()=>{this.sel[it.name]=this.sel[it.name]===false;
        const card=this.dom.closest&&this.dom.closest('.p-card');if(card){const off=Object.keys(this.sel).filter(k=>this.sel[k]===false);card._hidden=off.length?new Set(off):null;}
        this.emit('legendselectchanged',{name:it.name,selected:Object.assign({},this.sel)});this.render();};
    });
  }
  drawTools(zoomable){
    this.tools.innerHTML='';const F=this.feat(),add=(txt,title,fn,on,dis)=>{const b=E('button',on?'on':'',this.tools);b.type='button';b.textContent=txt;b.title=title;if(dis)b.disabled=true;b.onclick=fn;return b;};
    if(zoomable)add('↺',L('Desfazer zoom (arraste no gráfico para dar zoom)','Reset zoom (drag on the chart to zoom)'),()=>{this.zoom=null;this.zoomC=null;this.render();},false,!(this.zoom||this.zoomC));
    if(F.magicType&&this.kind()==='cart')add('⇄',L('Linha ↔ barra','Line ↔ bar'),()=>{this.magic=!this.magic;this.render();},this.magic);
    if(F.dataView||this.kind()!=='cart')add(L('dados','data'),L('Tabela com os valores','Table with the values'),()=>this.dataView());
    if(F.saveAsImage)add('PNG',L('Salvar PNG 3×','Save PNG 3×'),()=>this.png());
    if(F.myCSV)add('CSV',L('Baixar CSV','Download CSV'),()=>{try{F.myCSV.onclick();}catch(e){}});
    if(F.myFull)add('⤢',L('Tela cheia','Full screen'),()=>{try{F.myFull.onclick();}catch(e){}});
  }
  frame(){
    if(this.viewEl){this.viewEl.remove();this.viewEl=null;}
    this.box.innerHTML='';this.svg=null;
    const W=Math.floor(this.box.clientWidth),HH=Math.floor(this.box.clientHeight);
    if(W<60||HH<50)return null;
    this.big=HH>=300;this.root.classList.toggle('big',this.big);
    const svg=S('svg',{viewBox:`0 0 ${W} ${HH}`,width:W,height:HH,'font-family':FF},this.box);this.svg=svg;this.W=W;this.H=HH;
    return {svg,W,HH};
  }
  tipper(){
    const tip=tipEl();
    return {tip,show:(html,ev)=>{if(!html){tip.style.display='none';return;}tip.innerHTML=html;tip.style.display='block';
      const tw=tip.offsetWidth,th=tip.offsetHeight;let x=ev.clientX+14,y=ev.clientY+14;if(x+tw>innerWidth-6)x=ev.clientX-tw-14;if(y+th>innerHeight-6)y=ev.clientY-th-14;tip.style.left=Math.max(4,x)+'px';tip.style.top=Math.max(4,y)+'px';}};
  }
  render(){
    if(this.dead||!this.opt)return;
    const k=this.kind();
    this.drawLegend();
    if(k==='pie')return this.renderPie();
    if(k==='sankey')return this.renderSankey();
    if(k==='heat')return this.renderHeat();
    return this.renderCart();
  }
  /* ── rosca ── */
  renderPie(){
    this.drawTools(false);const fr=this.frame();if(!fr)return;const {svg,W,HH}=fr,o=this.opt,s=o.series[0],big=this.big,fs=big?11:8.5;
    const items=(s.data||[]).map((d,i)=>({i,name:d.name,v:+val(d)||0,c:icol(d,s)})).filter(d=>this.sel[d.name]!==false&&d.v>0);
    const tot=items.reduce((a,d)=>a+d.v,0);if(!(tot>0))return;
    const R=Math.min(W,HH)/2,c=s.center||['50%','50%'],cx=pct(c[0],W),cy=pct(c[1],HH),rr=s.radius||['46%','74%'];
    const r0=pct(rr[0],R*2)/2*1.0,r1=pct(rr[1],R*2)/2;
    let a=-Math.PI/2;this.hit=[];
    const g=S('g',null,svg);
    items.forEach(d=>{const a1=a+d.v/tot*Math.PI*2;
      const p=S('path',{d:arcPath(cx,cy,r0,r1,a,a1-0.0001),fill:d.c,stroke:'#fff','stroke-width':1},g);
      const mid=(a+a1)/2,pc=d.v/tot*100;
      if(pc>=4){const lx=cx+(r1+ (big?16:11))*Math.cos(mid),ly=cy+(r1+(big?16:11))*Math.sin(mid);const t=S('text',{x:lx.toFixed(1),y:(ly+fs*0.35).toFixed(1),'text-anchor':Math.cos(mid)>=0?'start':'end','font-size':fs,'font-weight':700,fill:'#000'},g);t.textContent=nz(pc.toLocaleString(loc(),{maximumFractionDigits:0}))+'%';}
      this.hit.push({d,a0:a,a1,pc,p});a=a1;});
    const {tip,show}=this.tipper(),fmt=o.tooltip&&o.tooltip.formatter;
    const ov=S('rect',{x:0,y:0,width:W,height:HH,fill:'transparent','data-ui':'1'},svg);
    const pick=ev=>{const r=svg.getBoundingClientRect(),x=(ev.clientX-r.left)*W/r.width-cx,y=(ev.clientY-r.top)*HH/r.height-cy,d=Math.hypot(x,y);
      if(d<r0||d>r1+4)return null;let ang=Math.atan2(y,x);if(ang<-Math.PI/2)ang+=Math.PI*2;return this.hit.find(h=>ang>=h.a0&&ang<h.a1)||null;};
    ov.addEventListener('pointermove',ev=>{const h=pick(ev);this.hit.forEach(x=>x.p.setAttribute('opacity',h&&x!==h?'.55':'1'));if(!h){tip.style.display='none';return;}
      const p={name:h.d.name,value:h.d.v,percent:+h.pc.toFixed(1),marker:mk(h.d.c),color:h.d.c,seriesName:s.name||''};
      show(typeof fmt==='function'?fmt(p):`${p.marker}<b>${esc(p.name)}</b>: ${esc(fnum(p.value,0.1))} · ${esc(fnum(p.percent,0.1))}%`,ev);});
    ov.addEventListener('pointerleave',()=>{tip.style.display='none';this.hit.forEach(x=>x.p.setAttribute('opacity','1'));});
  }
  /* ── mapa de calor ── */
  renderHeat(){
    this.drawTools(false);const fr=this.frame();if(!fr)return;const {svg,W,HH}=fr,o=this.opt,big=this.big,fs=big?11:8.5;
    const xa=(Array.isArray(o.xAxis)?o.xAxis[0]:o.xAxis)||{},ya=(Array.isArray(o.yAxis)?o.yAxis[0]:o.yAxis)||{},cols=xa.data||[],rows=ya.data||[];
    const vm=o.visualMap||{},lo=vm.min!=null?vm.min:0,hi=vm.max!=null?vm.max:1,cr=(vm.inRange&&vm.inRange.color)||['#F0FDFA','#0D9488','#0F5148'];
    const padL=Math.max(40,Math.min(130,Math.max(...rows.map(r=>textW(r,fs)),10)+12)),pad={l:padL,r:big?50:30,t:big?10:6,b:big?24:16};
    const pw=W-pad.l-pad.r,ph=HH-pad.t-pad.b;if(pw<30||ph<24)return;
    const cw=pw/Math.max(1,cols.length),rh=ph/Math.max(1,rows.length);
    const g=S('g',{'font-size':fs,'font-weight':700,fill:'#000'},svg);this.hit=[];
    rows.forEach((r,ri)=>{const t=S('text',{x:pad.l-5,y:(pad.t+rh*(ri+0.5)+fs*0.35).toFixed(1),'text-anchor':'end'},g);t.textContent=r;});
    const every=Math.max(1,Math.ceil((Math.max(...cols.map(c=>textW(c,fs)),8)+6)/cw));
    cols.forEach((c,ci)=>{if(ci%every)return;const t=S('text',{x:(pad.l+cw*(ci+0.5)).toFixed(1),y:pad.t+ph+fs+4,'text-anchor':'middle'},g);t.textContent=c;});
    const s=o.series[0];
    (s.data||[]).forEach(d=>{const v=Array.isArray(d)?d:(d.value||[]);const ci=v[0],ri=v[1],x=v[2];if(ri==null||ci==null)return;
      const t=hi>lo?(x-lo)/(hi-lo):0,col=x==null?'#F3F4F6':ramp(cr,t);
      const rx=pad.l+cw*ci+1.2,ry=pad.t+rh*ri+1.2;S('rect',{x:rx.toFixed(1),y:ry.toFixed(1),width:Math.max(1,cw-2.4).toFixed(1),height:Math.max(1,rh-2.4).toFixed(1),rx:2,fill:col},svg);
      if(cw>=26&&rh>=12&&x!=null){const tt=S('text',{x:(pad.l+cw*(ci+0.5)).toFixed(1),y:(pad.t+rh*(ri+0.5)+fs*0.35).toFixed(1),'text-anchor':'middle','font-size':fs*0.95,'font-weight':700,fill:lum(col)<0.55?'#fff':'#12293f'},svg);tt.textContent=fnum(x,Math.abs(x)<10?0.1:1);}
      this.hit.push({ci,ri,x,px:pad.l+cw*(ci+0.5),py:pad.t+rh*(ri+0.5),d});});
    /* régua de cores */
    const gx=pad.l+pw+(big?14:8),gh=Math.min(ph,big?140:80),gy=pad.t+(ph-gh)/2,gid='hg'+Math.random().toString(36).slice(2,8);
    const lg=S('linearGradient',{id:gid,x1:0,y1:1,x2:0,y2:0},S('defs',null,svg));cr.forEach((c,i)=>S('stop',{offset:(i/(cr.length-1)*100)+'%','stop-color':c},lg));
    S('rect',{x:gx,y:gy,width:big?10:7,height:gh,fill:`url(#${gid})`,rx:2},svg);
    const t1=S('text',{x:gx+(big?5:3.5),y:gy-3,'text-anchor':'middle','font-size':fs*0.9,fill:'#000'},svg);t1.textContent=fnum(hi,hi<10?0.1:1);
    const t0=S('text',{x:gx+(big?5:3.5),y:gy+gh+fs,'text-anchor':'middle','font-size':fs*0.9,fill:'#000'},svg);t0.textContent=fnum(lo,1);
    const {tip,show}=this.tipper(),fmt=o.tooltip&&o.tooltip.formatter;
    this.ui=S('g',{'data-ui':'1','pointer-events':'none'},svg);
    const ov=S('rect',{x:pad.l,y:pad.t,width:pw,height:ph,fill:'transparent','data-ui':'1'},svg);
    ov.addEventListener('pointermove',ev=>{const r=svg.getBoundingClientRect(),mx=(ev.clientX-r.left)*W/r.width,my=(ev.clientY-r.top)*HH/r.height;
      const ci=Math.floor((mx-pad.l)/cw),ri=Math.floor((my-pad.t)/rh),h=this.hit.find(q=>q.ci===ci&&q.ri===ri);
      this.ui.innerHTML='';if(!h){tip.style.display='none';return;}
      S('rect',{x:pad.l+cw*ci,y:pad.t+rh*ri,width:cw,height:rh,fill:'none',stroke:'#12293f','stroke-width':1.5},this.ui);
      const p={value:[ci,ri,h.x],data:h.d,marker:mk('#0D9488'),name:cols[ci]};show(typeof fmt==='function'?fmt(p):`<b>${esc(rows[ri])} · ${esc(cols[ci])}</b><br>${esc(fnum(h.x,0.1))}`,ev);});
    ov.addEventListener('pointerleave',()=>{tip.style.display='none';this.ui.innerHTML='';});
  }
  /* ── sankey (duas colunas: safra → destino) ── */
  renderSankey(){
    this.drawTools(false);const fr=this.frame();if(!fr)return;const {svg,W,HH}=fr,o=this.opt,s=o.series[0],big=this.big,fs=big?11:8.5;
    const nodes=s.data||[],links=(s.links||[]).filter(l=>l.value>0);
    const L0=nodes.filter(n=>(n.depth||0)===0),R0=nodes.filter(n=>(n.depth||0)===1);
    const sumL={},sumR={};links.forEach(l=>{sumL[l.source]=(sumL[l.source]||0)+l.value;sumR[l.target]=(sumR[l.target]||0)+l.value;});
    const Lf=L0.filter(n=>sumL[n.name]>0),Rf=R0.filter(n=>sumR[n.name]>0);if(!Lf.length||!Rf.length)return;
    const padL=pct(s.left!=null?s.left:30,W),padR=pct(s.right!=null?s.right:80,W),padT=pct(s.top!=null?s.top:10,HH),padB=pct(s.bottom!=null?s.bottom:8,HH);
    const x0=padL,x1=W-padR,nw=s.nodeWidth||10,gap=s.nodeGap||6,ph=HH-padT-padB;
    const tot=Math.max(Lf.reduce((a,n)=>a+sumL[n.name],0),Rf.reduce((a,n)=>a+sumR[n.name],0));
    const k=Math.min((ph-gap*(Lf.length-1))/tot,(ph-gap*(Rf.length-1))/tot);
    const pos={};let y=padT;Lf.forEach(n=>{const h=sumL[n.name]*k;pos['L'+n.name]={y,h,cur:y,c:(n.itemStyle&&n.itemStyle.color)||'#1A3A5C'};y+=h+gap;});
    y=padT;Rf.forEach(n=>{const h=sumR[n.name]*k;pos['R'+n.name]={y,h,cur:y,c:(n.itemStyle&&n.itemStyle.color)||'#94A3B8'};y+=h+gap;});
    const gL=S('g',null,svg),gN=S('g',null,svg);this.hit=[];
    links.forEach(l=>{const a=pos['L'+l.source],b=pos['R'+l.target];if(!a||!b)return;const h=l.value*k,sy=a.cur,ty=b.cur;a.cur+=h;b.cur+=h;
      const xa=x0+nw,xb=x1,m1=xa+(xb-xa)*0.45,m2=xa+(xb-xa)*0.55;
      const p=S('path',{d:`M${xa} ${sy}C${m1} ${sy} ${m2} ${ty} ${xb} ${ty}L${xb} ${ty+h}C${m2} ${ty+h} ${m1} ${sy+h} ${xa} ${sy+h}Z`,fill:b.c,opacity:.42},gL);
      this.hit.push({l,p});});
    Lf.forEach(n=>{const q=pos['L'+n.name];S('rect',{x:x0,y:q.y,width:nw,height:Math.max(1,q.h),fill:q.c},gN);const t=S('text',{x:x0-4,y:(q.y+q.h/2+fs*0.35).toFixed(1),'text-anchor':'end','font-size':fs,'font-weight':700,fill:'#000'},gN);t.textContent=n.name;});
    Rf.forEach(n=>{const q=pos['R'+n.name];S('rect',{x:x1,y:q.y,width:nw,height:Math.max(1,q.h),fill:q.c},gN);if(q.h>=fs*0.8||Rf.length<=8){const t=S('text',{x:x1+nw+4,y:(q.y+q.h/2+fs*0.35).toFixed(1),'font-size':fs,fill:'#000','font-weight':n.name==='China'?700:400},gN);t.textContent=n.name;}});
    const {tip,show}=this.tipper(),fmt=o.tooltip&&o.tooltip.formatter;
    this.hit.forEach(h=>{h.p.style.cursor='default';
      h.p.addEventListener('pointermove',ev=>{this.hit.forEach(x=>x.p.setAttribute('opacity',x===h?.75:.18));const p={dataType:'edge',data:h.l,name:h.l.source+' → '+h.l.target,value:h.l.value};
        show(typeof fmt==='function'?fmt(p):`${esc(p.name)}: <b>${esc(fnum(h.l.value,1))}</b>`,ev);});
      h.p.addEventListener('pointerleave',()=>{tip.style.display='none';this.hit.forEach(x=>x.p.setAttribute('opacity',.42));});});
  }
  /* ── cartesiano: linha, barra, pilha, área, horizontal, combinado, halteres ── */
  renderCart(){
    const o=this.opt,xa=(Array.isArray(o.xAxis)?o.xAxis[0]:o.xAxis)||{},yas=Array.isArray(o.yAxis)?o.yAxis:[o.yAxis||{}];
    const horiz=(yas[0]||{}).type==='category',catX=!horiz&&xa.type==='category';
    this.valueX=!catX&&!horiz;const zoomable=!!o.dataZoom&&(this.valueX||catX);
    this.drawTools(zoomable);
    const fr=this.frame();if(!fr)return;const {svg,W,HH}=fr,big=this.big,fs=big?11:8.5,two=yas.length>1;
    const series=(o.series||[]).map(s=>{let type=s.type;if(this.magic&&!horiz){if(type==='line'&&!s.areaStyle)type='bar';else if(type==='bar')type='line';}return Object.assign({},s,{type,_p:norm(s)});});
    const vis=series.filter(s=>this.sel[s.name]!==false);
    const catY=horiz?(yas[0].data||[]):null;
    const anyLab=vis.some(s=>s.label&&s.label.show&&s.label.position==='right');
    const padL=horiz?Math.max(28,Math.min(130,Math.max(...catY.map(c=>textW(c,fs)),10)+12)):(big?50:34);
    const named=yas.some(a=>a&&a.name);
    const pad={l:padL,r:two?(big?46:32):(anyLab?(big?44:30):(big?18:12)),t:(two||named)?(big?22:16):(big?14:10),b:big?26:17};
    const pw=W-pad.l-pad.r,ph=HH-pad.t-pad.b;if(pw<30||ph<24)return;
    const defs=S('defs',null,svg),cid='ndc'+Math.random().toString(36).slice(2,9);
    S('rect',{x:pad.l,y:pad.t-12,width:pw,height:ph+12},S('clipPath',{id:cid},defs));
    /* eixo X (categorias com janela de zoom, ou valores) */
    let X,xInv,nC=0,band=0,xlo=0,xhi=1,c0=0,c1=-1;
    if(catX){const all=(xa.data||[]).length||Math.max(1,...series.map(s=>s._p.length));c0=this.zoomC?this.zoomC[0]:0;c1=this.zoomC?this.zoomC[1]:all-1;nC=c1-c0+1;band=pw/nC;
      X=i=>pad.l+band*(i-c0+0.5);xInv=px=>Math.max(c0,Math.min(c1,c0+Math.floor((px-pad.l)/band)));}
    else{
      let lo=xa.min!=null?xa.min:Infinity,hi=xa.max!=null?xa.max:-Infinity;
      if(xa.min==null||xa.max==null)vis.forEach(s=>s._p.forEach(p=>{const v=horiz?(Array.isArray(p.item)?p.item[0]:p.y):p.x;if(v==null||typeof v!=='number')return;if(xa.min==null)lo=Math.min(lo,v);if(xa.max==null)hi=Math.max(hi,v);}));
      if(horiz){lo=Math.min(0,lo);}
      if(!isFinite(lo))lo=0;if(!isFinite(hi))hi=lo+1;
      if(xa.min==null||xa.max==null){const nt=nice(lo,hi,big?8:5);if(xa.min==null)lo=nt.lo;if(xa.max==null)hi=nt.hi;}
      if(this.zoom&&this.valueX){lo=this.zoom[0];hi=this.zoom[1];}
      xlo=lo;xhi=hi;X=v=>pad.l+(v-lo)/(hi-lo)*pw;xInv=px=>lo+(px-pad.l)/pw*(hi-lo);
    }
    const inWin=p=>catX?(p.i>=c0&&p.i<=c1):(horiz||(p.x>=xlo-1e-9&&p.x<=xhi+1e-9));
    /* eixos Y */
    const yDom=yas.map((ya,ai)=>{
      if(ya.type==='category')return null;
      let lo=ya.scale?Infinity:0,hi=-Infinity;const acc={},accN={};
      vis.filter(s=>(s.yAxisIndex||0)===ai).forEach(s=>{
        const stk=s.stack&&!this.magic?s.stack:null;
        s._p.forEach(p=>{if(p.y==null||typeof p.y!=='number'||!inWin(p))return;
          if(stk){const k=stk+'|'+p.i;if(p.y>=0){acc[k]=(acc[k]||0)+p.y;hi=Math.max(hi,acc[k]);}else{accN[k]=(accN[k]||0)+p.y;lo=Math.min(lo,accN[k]);}}
          else{hi=Math.max(hi,p.y);lo=Math.min(lo,p.y);}});
        if(s.markLine&&s.markLine.data)s.markLine.data.forEach(m=>{if(m&&typeof m.yAxis==='number'){hi=Math.max(hi,m.yAxis);lo=Math.min(lo,m.yAxis);}});
      });
      if(!isFinite(hi))hi=1;if(!isFinite(lo))lo=0;
      if(ya.scale){const sp=(hi-lo)||Math.abs(hi)||1;lo-=sp*0.18;hi+=sp*0.12;}
      const anyLabTop=vis.some(s=>(s.yAxisIndex||0)===ai&&s.label&&s.label.show&&(s.label.position||'top')==='top');
      if(anyLabTop&&ya.max==null)hi=hi>0?hi*1.12:hi;
      const Lo=ya.min!=null?ya.min:lo,Hi=ya.max!=null?ya.max:hi;
      if(ya.interval>0){const t=[];for(let v=Lo;v<=Hi+1e-9;v+=ya.interval)t.push(+v.toFixed(10));return {lo:Lo,hi:Hi,ticks:t,step:ya.interval};}
      const nt=nice(Lo,Hi,big?6:4),dl=ya.min!=null?ya.min:nt.lo,dh=ya.max!=null?ya.max:nt.hi;
      return {lo:dl,hi:dh,ticks:nt.ticks.filter(t=>t>=dl-1e-9&&t<=dh+1e-9),step:nt.step};
    });
    const Y=(v,ai)=>{const d=yDom[ai||0];return pad.t+ph-(v-d.lo)/((d.hi-d.lo)||1)*ph;};
    const nCY=horiz?catY.length:0,bandY=horiz?ph/Math.max(1,nCY):0,inv=horiz&&(yas[0].inverse!==false);
    const YC=i=>pad.t+bandY*((inv?i:(nCY-1-i))+0.5);
    /* desenho dos eixos */
    const axis=S('g',{fill:'#000','font-size':fs,'font-weight':700},svg);
    S('line',{x1:pad.l,y1:pad.t+ph,x2:pad.l+pw,y2:pad.t+ph,stroke:'#000','stroke-width':1},axis);
    S('line',{x1:pad.l,y1:pad.t,x2:pad.l,y2:pad.t+ph,stroke:'#000','stroke-width':1},axis);
    if(catX){
      const lab=xa.data||[],fmtx=xa.axisLabel&&typeof xa.axisLabel.formatter==='function'?xa.axisLabel.formatter:null;
      const labs=lab.map(s=>fmtx?String(fmtx(s)):String(s)),maxW=Math.max(...labs.slice(c0,c1+1).map(s=>textW(s,fs)),8),every=Math.max(1,Math.ceil((maxW+6)/band));
      let lastL=null;for(let i=c0;i<=c1;i++){if((i-c0)%every)continue;const l=labs[i]==null?'':labs[i];if(l===lastL)continue;lastL=l;const t=S('text',{x:X(i),y:pad.t+ph+fs+4,'text-anchor':'middle'},axis);t.textContent=l;}
    }else{
      const nt=nice(xlo,xhi,big?8:5);const ticks=nt.ticks.filter(v=>v>=xlo-1e-9&&v<=xhi+1e-9).map(v=>({v,l:axLabel(xa,v,nt.step)}));
      const minGap=big?42:26;let lastX=-1e9;
      ticks.forEach(tk=>{const x=X(tk.v);if(x-lastX<minGap)return;lastX=x;const t=S('text',{x,y:pad.t+ph+fs+4,'text-anchor':'middle'},axis);t.textContent=tk.l;});
    }
    yas.forEach((ya,ai)=>{
      if(ya.type==='category'){catY.forEach((c,i)=>{const t=S('text',{x:pad.l-5,y:YC(i)+fs*0.35,'text-anchor':'end'},axis);t.textContent=c;});return;}
      const d=yDom[ai],right=ai===1||ya.position==='right',xA=right?pad.l+pw:pad.l;
      if(right)S('line',{x1:xA,y1:pad.t,x2:xA,y2:pad.t+ph,stroke:'#000','stroke-width':1},axis);
      const seen=new Set();
      d.ticks.forEach(v=>{if(v<d.lo-1e-9||v>d.hi+1e-9)return;const lb=axLabel(ya,v,d.step);if(seen.has(lb))return;seen.add(lb);const t=S('text',{x:right?xA+5:xA-5,y:Y(v,ai)+fs*0.35,'text-anchor':right?'start':'end'},axis);t.textContent=lb;});
      if(ya.name){const t=S('text',{x:xA,y:pad.t-6,'text-anchor':right?'end':'start','font-weight':600},axis);t.textContent=ya.name;}
    });
    /* séries */
    const g=S('g',{'clip-path':`url(#${cid})`},svg),gl=S('g',null,svg);
    const barSeries=vis.filter(s=>s.type==='bar');
    const groups=[];barSeries.forEach(s=>{const k=s.stack&&!this.magic?'st:'+s.stack:'se:'+s.name;if(!groups.includes(k))groups.push(k);});
    const acc={},accN={},accA={};this.hit=[];
    const labFmt=(s,p)=>{const f=s.label&&s.label.formatter;const pr={value:p.y,dataIndex:p.i,seriesName:s.name,data:p.item,name:catX?(xa.data||[])[p.i]:''};return typeof f==='function'?String(f(pr)):fnum(p.y,Math.abs(p.y)<10?0.1:1);};
    vis.forEach(s=>{
      const col=s.color||'#64748B',ai=s.yAxisIndex||0,pts=s._p;
      if(s.type==='bar'&&horiz){
        const nG=Math.max(1,barSeries.length),gi=barSeries.indexOf(s),bh=Math.min(s.barMaxWidth||22,bandY*0.7/nG);
        pts.forEach(p=>{const v=Array.isArray(p.item)?p.item[0]:p.y,ci=Array.isArray(p.item)?catY.indexOf(p.item[1]):p.i;if(v==null||ci<0)return;
          const cy=YC(ci)+(gi-(nG-1)/2)*bh*1.08,x0=X(0),x1=X(v);
          S('rect',{x:Math.min(x0,x1).toFixed(2),y:(cy-bh/2).toFixed(2),width:Math.max(0.5,Math.abs(x1-x0)).toFixed(2),height:bh.toFixed(2),rx:1.5,fill:icol(p.item,s)},g);
          if(s.label&&s.label.show){const t=S('text',{x:(x1+(v>=0?4:-4)).toFixed(1),y:(cy+fs*0.35).toFixed(1),'text-anchor':v>=0?'start':'end','font-size':fs,'font-weight':700,fill:'#000'},gl);t.textContent=labFmt(s,{y:v,i:ci,item:p.item});}
          this.hit.push({s,p,px:x1,py:cy,ci});});
      }else if(s.type==='bar'){
        const gk=s.stack&&!this.magic?'st:'+s.stack:'se:'+s.name,gi=groups.indexOf(gk),nG=Math.max(1,groups.length);
        let bw;if(catX)bw=Math.min((s.barMaxWidth||Infinity)*(big?1.3:1),band*0.64/nG);else bw=s.barWidth?s.barWidth*(big?1.3:1):Math.max(2,pw/((xhi-xlo)||1)*0.62);
        pts.forEach(p=>{if(p.y==null||typeof p.y!=='number'||!inWin(p))return;
          const cx=(catX?X(p.i):X(p.x))+(catX?(gi-(nG-1)/2)*bw*1.06:0);
          let y0=0,y1=p.y;if(s.stack&&!this.magic){const k=s.stack+'|'+p.i;if(p.y>=0){y0=acc[k]||0;y1=y0+p.y;acc[k]=y1;}else{y0=accN[k]||0;y1=y0+p.y;accN[k]=y1;}}
          const a=Y(y0,ai),b=Y(y1,ai);S('rect',{x:(cx-bw/2).toFixed(2),y:Math.min(a,b).toFixed(2),width:Math.max(1,bw).toFixed(2),height:Math.max(0.5,Math.abs(a-b)).toFixed(2),rx:1.5,fill:icol(p.item,s)},g);
          if(s.label&&s.label.show&&(s.label.position||'top')==='top'&&bw>=6){const t=S('text',{x:cx.toFixed(1),y:(Math.min(a,b)-3).toFixed(1),'text-anchor':'middle','font-size':fs*0.95,'font-weight':700,fill:'#000'},gl);t.textContent=labFmt(s,p);}
          this.hit.push({s,p,px:cx,py:b});});
      }else if(s.type==='line'){
        let q=pts.filter(p=>p.y!=null&&typeof p.y==='number').map(p=>{let yv=p.y;if(s.stack&&s.areaStyle){const k=s.stack+'|'+p.i;const b0=accA[k]||0;yv=b0+p.y;accA[k]=yv;return {p,x:catX?X(p.i):X(p.x),y:Y(yv,ai),y0:Y(b0,ai)};}return {p,x:catX?X(p.i):X(p.x),y:Y(yv,ai)};}).sort((a,b)=>a.x-b.x);
        if(!catX){const i0=q.findIndex(r=>r.p.x>=xlo),i1=q.length-1-[...q].reverse().findIndex(r=>r.p.x<=xhi);if(i0>=0&&i1>=i0)q=q.slice(Math.max(0,i0-1),Math.min(q.length,i1+2));else q=[];}
        else q=q.filter(r=>r.p.i>=c0-1&&r.p.i<=c1+1);
        const ls=s.lineStyle||{},dash=ls.type==='dashed'?'5 3':ls.type==='dotted'?'2 3':null,w=(ls.width||1.8)*(big?1.2:1),lc=ls.color||col;
        if(s.areaStyle&&q.length>1){const top=q.map((r,i)=>(i?'L':'M')+r.x.toFixed(1)+' '+r.y.toFixed(1)).join(''),bot=[...q].reverse().map(r=>'L'+r.x.toFixed(1)+' '+(r.y0!=null?r.y0:Y(0,ai)).toFixed(1)).join('');
          S('path',{d:top+bot+'Z',fill:col,'fill-opacity':s.areaStyle.opacity!=null?s.areaStyle.opacity:0.35,stroke:'none'},g);}
        const segs=[];let cur=[];
        if(s.connectNulls===false){pts.forEach(p=>{if(p.y==null||!inWin(p)){if(cur.length)segs.push(cur);cur=[];return;}const r=q.find(z=>z.p===p);if(r)cur.push(r);});if(cur.length)segs.push(cur);}else segs.push(q);
        segs.forEach(sg=>{if(sg.length>1){const at={d:sg.map((r,i)=>(i?'L':'M')+r.x.toFixed(1)+' '+r.y.toFixed(1)).join(''),fill:'none',stroke:lc,'stroke-width':w,'stroke-linejoin':'round','stroke-linecap':'round'};if(dash)at['stroke-dasharray']=dash;S('path',at,g);}});
        const sym=s.symbol!=='none'&&s.symbolSize!==0&&s.showSymbol!==false&&(catX?(q.length<=60||s.showSymbol):!!s.showSymbol);
        if(sym)q.forEach(r=>{if(!inWin(r.p))return;S('circle',{cx:r.x.toFixed(1),cy:r.y.toFixed(1),r:((s.symbolSize||5)/2)*(big?1.1:0.85),fill:lc,stroke:'#fff','stroke-width':0.8},g);});
        q.forEach(r=>this.hit.push({s,p:r.p,px:r.x,py:r.y}));
      }else if(s.type==='scatter'){
        pts.forEach(p=>{let v,ci;if(horiz){if(Array.isArray(p.item)){v=p.item[0];ci=catY.indexOf(p.item[1]);}else{v=p.y;ci=p.i;}}else{v=p.y;ci=p.i;}if(v==null||ci<0||(horiz&&v==null))return;
          const cx=horiz?X(v):(catX?X(p.i):X(p.x)),cy=horiz?YC(ci):Y(v,ai);
          S('circle',{cx:cx.toFixed(1),cy:cy.toFixed(1),r:((s.symbolSize||10)/2)*(big?0.95:0.62),fill:icol(p.item,s),stroke:'#fff','stroke-width':1},g);this.hit.push({s,p,px:cx,py:cy,ci});});
      }
      /* média, referências e máximo/mínimo */
      if(s.markLine&&s.markLine.data&&!horiz){const vv=pts.filter(p=>typeof p.y==='number'&&inWin(p)).map(p=>p.y);
        s.markLine.data.forEach(m=>{let yv=null,lab='';if(m&&m.type==='average'&&vv.length){yv=vv.reduce((a,b)=>a+b,0)/vv.length;}else if(m&&typeof m.yAxis==='number')yv=m.yAxis;if(yv==null)return;
          const f=(m.label&&m.label.formatter)||(s.markLine.label&&s.markLine.label.formatter);lab=typeof f==='function'?f({value:yv,name:m.name}):typeof f==='string'?f:(m.name||'');
          const lc=(m.lineStyle&&m.lineStyle.color)||(s.markLine.lineStyle&&s.markLine.lineStyle.color)||'#94A3B8',yy=Y(yv,ai);
          S('line',{x1:pad.l,y1:yy,x2:pad.l+pw,y2:yy,stroke:lc,'stroke-dasharray':'4 3','stroke-width':1.1},gl);
          if(lab){const t=S('text',{x:pad.l+pw-2,y:yy-3,'text-anchor':'end','font-size':fs*0.9,'font-weight':700,fill:'#334155'},gl);t.textContent=lab;}});}
      if(s.markPoint&&s.markPoint.data&&!horiz&&s.type!=='scatter'){const vv=pts.filter(p=>typeof p.y==='number'&&inWin(p));if(vv.length>2){
        const mx=vv.reduce((a,b)=>b.y>a.y?b:a),mn=vv.reduce((a,b)=>b.y<a.y?b:a),f=s.markPoint.label&&s.markPoint.label.formatter;
        [[mx,-7],[mn,12]].forEach(([p,dy])=>{const px=catX?X(p.i):X(p.x),py=Y(p.y,ai)+dy;const t=S('text',{x:px.toFixed(1),y:py.toFixed(1),'text-anchor':'middle','font-size':fs*0.9,'font-weight':800,fill:'#0F2638'},gl);t.textContent=typeof f==='function'?f({value:p.y}):fnum(p.y,0.1);});}}
    });
    /* interação */
    this.ui=S('g',{'data-ui':'1','pointer-events':'none'},svg);
    const ov=S('rect',{x:pad.l,y:pad.t,width:pw,height:ph,fill:'transparent','data-ui':'1',style:'touch-action:pan-y;cursor:'+(zoomable?'crosshair':'default')},svg);
    const loc0=ev=>{const r=svg.getBoundingClientRect();return {x:(ev.clientX-r.left)*W/r.width,y:(ev.clientY-r.top)*HH/r.height};};
    const {tip,show}=this.tipper();
    const vf=(o.tooltip&&o.tooltip.valueFormatter)||(v=>fnum(v,0.1));
    const cross=(x,y)=>{this.ui.innerHTML='';if(x!=null)S('line',{x1:x,y1:pad.t,x2:x,y2:pad.t+ph,stroke:'#94A3B8','stroke-dasharray':'3 3'},this.ui);if(y!=null)S('line',{x1:pad.l,y1:y,x2:pad.l+pw,y2:y,stroke:'#CBD5E1','stroke-dasharray':'3 3'},this.ui);};
    const trig=(o.tooltip&&o.tooltip.trigger)||'axis',fmt=o.tooltip&&o.tooltip.formatter;
    const param=(h)=>({seriesName:h.s.name,color:icol(h.p.item,h.s),marker:mk(icol(h.p.item,h.s)),value:h.p.item&&typeof h.p.item==='object'&&Array.isArray(h.p.item.value)?h.p.item.value:(Array.isArray(h.p.item)?h.p.item:(horiz&&h.s.type==='bar'?(Array.isArray(h.p.item)?h.p.item[0]:h.p.y):h.p.y)),data:h.p.item,name:horiz?catY[h.ci!=null?h.ci:h.p.i]:(catX?(xa.data||[])[h.p.i]:''),dataIndex:h.ci!=null?h.ci:h.p.i,axisValue:catX?(xa.data||[])[h.p.i]:undefined});
    const hover=ev=>{
      const m=loc0(ev);
      if(this.drag){const x0=Math.min(this.drag.x,m.x),x1=Math.max(this.drag.x,m.x);this.ui.innerHTML='';S('rect',{x:x0,y:pad.t,width:Math.max(1,x1-x0),height:ph,fill:'rgba(13,148,136,.15)',stroke:'#0D9488'},this.ui);tip.style.display='none';return;}
      if(horiz){const ci=Math.max(0,Math.min(nCY-1,Math.floor((m.y-pad.t)/bandY))),idx=inv?ci:(nCY-1-ci);
        const ps=vis.map(s=>{const h=this.hit.find(h=>h.s===s&&(h.ci!=null?h.ci:h.p.i)===idx);return h?param(h):null;}).filter(Boolean);
        cross(null,YC(idx));if(!ps.length){tip.style.display='none';return;}
        show(typeof fmt==='function'?fmt(ps):`<b>${esc(catY[idx])}</b><br>`+ps.map(p=>`<div class="row">${p.marker}${esc(p.seriesName||'')}: <b>${esc(vf(Array.isArray(p.value)?p.value[0]:p.value))}</b></div>`).join(''),ev);return;}
      if(trig==='item'){let best=null,bd=(big?16:11)**2;this.hit.forEach(h=>{const d=(h.px-m.x)**2+(h.py-m.y)**2;if(d<bd){bd=d;best=h;}});cross(best?best.px:null,best?best.py:null);
        if(!best){tip.style.display='none';return;}const p=param(best);show(typeof fmt==='function'?fmt(p):`${p.marker}${esc(p.seriesName)}: <b>${esc(vf(Array.isArray(p.value)?p.value[1]:p.value))}</b>`,ev);return;}
      let ps=[],cx=m.x,head='';
      if(catX){const i=xInv(m.x);cx=X(i);head=(xa.data||[])[i];const fx=xa.axisLabel&&typeof xa.axisLabel.formatter==='function'?xa.axisLabel.formatter:null;
        ps=vis.map(s=>{const h=this.hit.find(h=>h.s===s&&h.p.i===i);return h?param(h):null;}).filter(Boolean);head=head==null?'':String(head);if(fx&&/^\d{4}-\d{2}-\d{2}$/.test(head))head=head;}
      else{const xv=xInv(m.x),tol=Math.max(1.5,(xhi-xlo)/60);
        vis.forEach(s=>{let best=null,bd=Infinity;this.hit.forEach(h=>{if(h.s!==s)return;const d=Math.abs(h.p.x-xv);if(d<bd){bd=d;best=h;}});if(best&&bd<=tol)ps.push(param(best));});
        if(ps.length){const h0=this.hit.find(h=>h.p.item===ps[0].data);if(h0)cx=h0.px;}head=axLabel(xa,Math.round(xv),1);}
      cross(cx,null);
      if(!ps.length){tip.style.display='none';return;}
      const html=typeof fmt==='function'?fmt(ps):`<b>${esc(head)}</b><br>`+ps.map(p=>`<div class="row">${p.marker}${esc(p.seriesName)}: <b>${esc(vf(Array.isArray(p.value)?p.value[1]:p.value))}</b></div>`).join('');
      show(html,ev);
    };
    ov.addEventListener('pointermove',hover);
    ov.addEventListener('pointerleave',ev=>{if(!this.drag&&ev.pointerType==='mouse'){this.ui.innerHTML='';tip.style.display='none';}});
    ov.addEventListener('pointerdown',ev=>{if(ev.button>0)return;if(zoomable){this.drag={x:loc0(ev).x};try{ov.setPointerCapture(ev.pointerId);}catch(e){}}hover(ev);});
    ov.addEventListener('pointerup',ev=>{if(!this.drag)return;const m=loc0(ev),a=Math.min(this.drag.x,m.x),b=Math.max(this.drag.x,m.x);this.drag=null;this.ui.innerHTML='';
      if(b-a>6){if(catX){const i0=xInv(a),i1=xInv(b);if(i1-i0>=1){this.zoomC=[i0,i1];tip.style.display='none';this.render();return;}}
        else{const z0=Math.max(xlo,xInv(a)),z1=Math.min(xhi,xInv(b));if(z1-z0>0.5){this.zoom=[z0,z1];tip.style.display='none';this.render();return;}}}hover(ev);});
    ov.addEventListener('pointercancel',()=>{this.drag=null;this.ui.innerHTML='';});
    if(zoomable)ov.addEventListener('dblclick',()=>{if(this.zoom||this.zoomC){this.zoom=null;this.zoomC=null;this.render();}});
  }
  /* tabela de dados */
  dataView(){
    if(this.viewEl){this.viewEl.remove();this.viewEl=null;return;}
    const o=this.opt,k=this.kind(),vf=(o.tooltip&&o.tooltip.valueFormatter)||(v=>fnum(v,0.1));
    let head=[],rows=[];
    if(k==='pie'){const s=o.series[0],tot=(s.data||[]).reduce((a,d)=>a+(+val(d)||0),0);head=['',L('valor','value'),'%'];rows=(s.data||[]).map(d=>[d.name,vf(+val(d)||0),fnum((+val(d)||0)/tot*100,0.1)+'%']);}
    else if(k==='sankey'){head=[L('origem','source'),L('destino','target'),L('valor','value')];rows=(o.series[0].links||[]).filter(l=>l.value>0).map(l=>[l.source,l.target,fnum(l.value,1)]);}
    else if(k==='heat'){const xa=(Array.isArray(o.xAxis)?o.xAxis[0]:o.xAxis)||{},ya=(Array.isArray(o.yAxis)?o.yAxis[0]:o.yAxis)||{},cols=xa.data||[],rws=ya.data||[],m={};
      (o.series[0].data||[]).forEach(d=>{const v=Array.isArray(d)?d:(d.value||[]);m[v[1]+'|'+v[0]]=v[2];});head=[''].concat(cols);rows=rws.map((r,ri)=>[r].concat(cols.map((c,ci)=>m[ri+'|'+ci]==null?'':vf(m[ri+'|'+ci]))));}
    else{const xa=(Array.isArray(o.xAxis)?o.xAxis[0]:o.xAxis)||{},yas=Array.isArray(o.yAxis)?o.yAxis:[o.yAxis||{}],horiz=(yas[0]||{}).type==='category',catX=!horiz&&xa.type==='category';
      const ss=(o.series||[]).filter(s=>this.sel[s.name]!==false);head=[''].concat(ss.map(s=>s.name||''));
      const keys=horiz?(yas[0].data||[]):catX?(xa.data||[]):[...new Set(ss.flatMap(s=>norm(s).map(p=>p.x)))].sort((a,b)=>a-b);
      rows=keys.map((key,ki)=>[key].concat(ss.map(s=>{const p=norm(s).find(q=>horiz||catX?q.i===ki:q.x===key);const v=p?(horiz&&Array.isArray(p.item)?p.item[0]:p.y):null;return v==null||typeof v!=='number'?'':vf(v);})));}
    const v=E('div','ndyn-view',this.root);this.viewEl=v;
    v.innerHTML=`<div class="ndyn-vh"><b>${esc(L('Dados','Data'))}</b><button type="button">✕</button></div><table><thead><tr>${head.map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>`+
      rows.map(r=>`<tr>${r.map(c=>`<td>${esc(c)}</td>`).join('')}</tr>`).join('')+`</tbody></table>`;
    v.querySelector('button').onclick=()=>{v.remove();this.viewEl=null;};
  }
  /* PNG 3× com legenda e marca d'água da casa */
  png(){
    if(!this.svg)return;
    const W=this.W,LH=this.big?26:18,HT=this.H+LH,fsL=this.big?11:9;
    const out=S('svg',{xmlns:NS,width:W,height:HT,viewBox:`0 0 ${W} ${HT}`,'font-family':FF});
    S('rect',{x:0,y:0,width:W,height:HT,fill:'#fff'},out);
    let x=6;this.legendItems().forEach(it=>{if(this.sel[it.name]===false)return;S('rect',{x,y:LH/2-5,width:9,height:9,rx:2,fill:it.color},out);
      const t=S('text',{x:x+13,y:LH/2+3,'font-size':fsL,'font-weight':700,fill:'#000'},out);t.textContent=it.name;x+=13+textW(it.name,fsL)+14;});
    const g=S('g',{transform:`translate(0,${LH})`},out);
    [...this.svg.childNodes].forEach(n=>{if(n.getAttribute&&n.getAttribute('data-ui'))return;g.appendChild(n.cloneNode(true));});
    const logo=typeof LOGO_HREF!=='undefined'?LOGO_HREF:(typeof LOGO_HREF_get==='function'?LOGO_HREF_get():'');
    if(logo){const im=S('image',{x:W/2-70,y:LH+this.H/2-57,width:140,height:115,opacity:.25,preserveAspectRatio:'xMidYMid meet'},out);im.setAttribute('href',logo);}
    const url='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(new XMLSerializer().serializeToString(out)),img=new Image(),K=3;
    const nm=((this.feat().saveAsImage||{}).name||'grafico').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9]+/g,'_');
    img.onload=()=>{const c=document.createElement('canvas');c.width=W*K;c.height=HT*K;const ctx=c.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,c.width,c.height);ctx.drawImage(img,0,0,c.width,c.height);
      const a=document.createElement('a');a.download='BRZ_EUA_'+nm+'_dinamico.png';a.href=c.toDataURL('image/png');a.click();};
    img.src=url;
  }
}
window.echarts={__brzNative:true,version:'brz-nativo-e88',init:dom=>new NChart(dom)};
})();
