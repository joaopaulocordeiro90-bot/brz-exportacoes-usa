
/*BUILD-BEGIN*/
const WM='<use data-wm="1" href="#brzlogo" x="143" y="29" width="143" height="118" opacity="0.25"/>';
let HIDDEN=null; const HID=l=>!!(HIDDEN&&HIDDEN.has(l));
const DYN_HID_OK=new Set(['commit','accum','outst','book','bookpct','mensal','donut','grupo','area','wexp','sankey','ritmo','prognova','prognovapct']);
let NAVY='#1A3A5C',TEAL='#0D9488',BEGE='#B5963E',CINZA='#9aa3ad',PRETO='#000',GELO='#dfe5ea';
let LADDER=['#c9d1d8',CINZA,BEGE,TEAL,NAVY];
let PAL6=[NAVY,TEAL,BEGE,'#5b7ca6','#63b8b0','#8a9099'];
const NF1=new Intl.NumberFormat('pt-BR',{minimumFractionDigits:1,maximumFractionDigits:1});
const NF0=new Intl.NumberFormat('pt-BR',{maximumFractionDigits:0});
/* e88 (padrão BRZ SAFRA): sem −0; valor abaixo de 0,1 com 2 casas; eixo com casas pelo passo */
const NFX=[0,1,2,3,4].map(d=>new Intl.NumberFormat('pt-BR',{minimumFractionDigits:d,maximumFractionDigits:d}));
const nz=s=>/^-0(?:,0+)?$/.test(s)?s.slice(1):s;
const f1=v=>(v!==0&&Math.abs(v)<0.095)?nz(NFX[2].format(v)):nz(NF1.format(v)),f0=v=>nz(NF0.format(v));
function fTick(tk,min){const t=[...new Set((tk||[]).map(v=>+(+v).toFixed(9)))].sort((a,b)=>a-b);let st=Infinity;for(let i=1;i<t.length;i++){const d=t[i]-t[i-1];if(d>1e-12&&d<st)st=d;}if(!isFinite(st))st=1;
  let d=st>=1-1e-9?0:st>=0.1-1e-9?1:st>=0.01-1e-9?2:st>=0.001-1e-9?3:4;if(min!=null)d=Math.max(d,min);return v=>nz(NFX[d].format(v));}
const fTP=(tk,min)=>{const f=fTick(tk,min);return v=>f(v)+'%';};
const W=414,H=190,ML=30,MR=8,MT=8,MB=16;
const X=(v,a,b)=>ML+(v-a)/(b-a)*(W-ML-MR);
const Y=(v,a,b)=>H-MB-(v-a)/(b-a)*(H-MT-MB);
const AX=()=>`<line x1="${ML}" y1="${H-MB}" x2="${W-MR}" y2="${H-MB}" stroke="${PRETO}"/><line x1="${ML}" y1="${MT}" x2="${ML}" y2="${H-MB}" stroke="${PRETO}"/>`;
const TY=(vals,a,b,f)=>{const vv=[...new Set(vals.filter(v=>v>=a-1e-9&&v<=b+1e-9).map(v=>Math.abs(v)<1e-9?0:+(+v).toFixed(9)))].sort((p,q)=>p-q);if(f===f0||f===f1)f=fTick(vv,f===f1?1:0);return vv.map(v=>({v,l:f(v)})).filter((o,i,arr)=>!i||o.l!==arr[i-1].l).map(({v,l})=>`<text x="${ML-5}" y="${Y(v,a,b)+3}" class="ytick" text-anchor="end">${l}</text>`).join('');};

const MYM={soja:9,milho:9,farelo:10,oleo:10,trigo:6};
const MESES=['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
function periodEndISO(iso){
  /* As séries CWR já usam a data oficial de encerramento do período. */
  return iso||'';
}
function brDate(iso,shortYear){
  const p=(iso||'').split('-');if(p.length!==3)return iso||'';
  return p[2]+'/'+p[1]+'/'+(shortYear?p[0].slice(2):p[0]);
}
function mTicks(com){
  const m0=MYM[com],ref=new Date(2023,m0-1,1),out=[];
  for(let i=0;i<12;i++){
    const d=new Date(2023,m0-1+i,1);
    const wk=Math.floor((d-ref)/(7*864e5))+1;
    out.push({wk,l:MESES[(m0-1+i)%12]});
  }
  return out;
}
const TXM=com=>mTicks(com).map(t=>`<text x="${X(t.wk,1,53)}" y="${H-MB+13}" class="xlab" text-anchor="middle">${t.l}</text>`).join('');

const TXW=ks=>ks.map(k=>`<text x="${X(k,1,53)}" y="${H-MB+13}" class="xlab" text-anchor="middle">${k}</text>`).join('');
function LN(pts,a,b,xa,xb,cor,w2,dash){
  const seg=pts.filter(p=>p.v!=null);
  if(!seg.length)return'';
  const d=seg.map((p,i)=>(i?'L':'M')+X(p.x,xa,xb).toFixed(1)+' '+Y(p.v,a,b).toFixed(1)).join('');
  return `<path d="${d}" fill="none" stroke="${cor}" stroke-width="${w2||1.6}"${dash?` stroke-dasharray="${dash}"`:''}/>`;
}
const SW=inner=>`<svg viewBox="0 0 ${W} ${H}" width="100%" xmlns="http://www.w3.org/2000/svg" style="background:#fff">${WM}${inner}</svg>`;
const nice=v=>{const p=Math.pow(10,Math.floor(Math.log10(v||1)));const n=v/p;return (n<=1?1:n<=2?2:n<=2.5?2.5:n<=5?5:10)*p;};
function ticks4(mx){const t=nice(mx/3.2);const o=[];for(let v=0;v<=mx+t*0.999;v+=t)o.push(+v.toFixed(6));return o;}
const S=(com,pais)=>E.dados[com].s[pais]||[];
const MYS=com=>{const ys=[...new Set(S(com,'MUNDO').map(r=>r[1]))].sort((x,y)=>x-y);return ys.slice(-5);};
const myLbl=y=>String(y).slice(2)+'/'+String(y+1).slice(2);
const esc=v=>v==null?null:v/1000;
function multiMY(com,pais,idx,tit){
  const ys=MYS(com),xa=1,xb=53;
  let mx=0; const series=ys.map(y=>{
    const pts=S(com,pais).filter(r=>r[1]===y).map(r=>({x:r[2],v:idx==='cm'?(r[3]+r[4])/1000:idx==='ac'?r[3]/1000:r[4]/1000}));
    pts.forEach(p=>{if(p.v>mx)mx=p.v}); return {y,pts};
  }).filter(q=>!HID(myLbl(q.y)));
  mx=0;series.forEach(q=>q.pts.forEach(p=>{if(p.v>mx)mx=p.v}));
  if(mx===0)return SW(`<text x="${W/2}" y="${H/2}" text-anchor="middle" font-size="11" fill="#888">sem dados para ${pais}</text>`);
  const tk=ticks4(mx),b=tk[tk.length-1]*1.06;
  let s=AX()+TY(tk,0,b,f0)+TXM(com);
  series.forEach((q,i)=>{
    if(!q.pts.length)return;
    const ii=ys.indexOf(q.y);const cor=LADDER[ii+LADDER.length-ys.length]||NAVY;
    s+=LN(q.pts,0,b,xa,xb,cor,q.y===ys[ys.length-1]?2.6:1.5);
    const lp=q.pts[q.pts.length-1];
    
  });
  return SW(s);
}
const gCommit=(com,pais)=>multiMY(com,pais,'cm');
const gAccum=(com,pais)=>multiMY(com,pais,'ac');
const gOutst=(com,pais)=>multiMY(com,pais,'ou');
function gNet(com,pais,myY){
  const ys=MYS(com),y=(myY!=null&&ys.includes(myY))?myY:ys[ys.length-1];
  const rows=S(com,pais).filter(r=>r[1]===y);
  if(rows.length<3)return SW(`<text x="${W/2}" y="${H/2}" text-anchor="middle" font-size="11" fill="#888">série curta</text>`);
  const pts=[];
  for(let i=1;i<rows.length;i++){
    const dv=(rows[i][3]+rows[i][4])-(rows[i-1][3]+rows[i-1][4]);
    pts.push({x:rows[i][2],v:dv});
  }
  const ma=pts.map((p,i)=>({x:p.x,v:i>=3?(pts[i].v+pts[i-1].v+pts[i-2].v+pts[i-3].v)/4:null}));
  const mx=Math.max(...pts.map(p=>Math.abs(p.v)),1);
  const b=nice(mx),a=-b;
  let s=`<line x1="${ML}" y1="${Y(0,a,b)}" x2="${W-MR}" y2="${Y(0,a,b)}" stroke="${PRETO}"/>`+`<line x1="${ML}" y1="${MT}" x2="${ML}" y2="${H-MB}" stroke="${PRETO}"/>`+TY([-b,0,b],a,b,f0)+TXM(com);
  const bw=(W-ML-MR)/53*0.7;
  pts.forEach(p=>{const y0=Y(0,a,b),y1=Y(p.v,a,b);s+=`<rect x="${X(p.x,1,53)-bw/2}" y="${Math.min(y0,y1)}" width="${bw}" height="${Math.abs(y0-y1)}" fill="${p.v>=0?GELO:'#e8c9c9'}"/>`});
  s+=LN(ma,a,b,1,53,NAVY,2.2);
  
  return SW(s);
}
window.WASDE_SZN=window.WASDE_SZN||{};
function wasdeSwap(el,com){
  HIDDEN=el._hidden||null;
  let svg=gWasde(com);
  HIDDEN=null;
  svg=svg.replace(/(<text[^>]*?fill=")(?!#fff\b|#FFF\b|#ffffff\b|#FFFFFF\b|white\b)([^"]+)(")/g,'$1#000$3');
  const ch=el.querySelector('.chart');
  if(ch){ch.innerHTML=svg;if(typeof wmEnsure==='function')wmEnsure(el);}
  const lg=el.querySelector('.lg');
  if(lg&&typeof legHTML==='function')lg.innerHTML=legHTML({id:'wasde'},com)||'';
  if(window.typoApply)typoApply(el);
  if(window.BRZFIT)BRZFIT(el);
}
function gWasde(com){
  const rows=S(com,'MUNDO'),wmap=E.dados[com].wasde;
  if(!wmap.length)return SW(`<text x="${W/2}" y="${H/2}" text-anchor="middle" font-size="11" fill="#888">sem projeção</text>`);
  if(WASDE_SZN[com]){
    const ys=MYS(com),cy=ys[ys.length-1];
    const lad=i=>LADDER[i+LADDER.length-ys.length]||NAVY;
    const wAt=d=>{let v=wmap[0][1];for(const r of wmap){if(r[0]<=d)v=r[1];else break;}return v;};
    const a=0,b=115;
    let s=AX()+TY([0,25,50,75,100],a,b,v=>v+'%')+TXM(com);
    s+=`<line x1="${ML}" y1="${Y(100,a,b)}" x2="${W-MR}" y2="${Y(100,a,b)}" stroke="#666" stroke-dasharray="4 3"/>`;
    ys.forEach((y,i)=>{
      const pts2=rows.filter(r=>r[1]===y).map(r=>({x:r[2],v:(r[3]+r[4])/wAt(r[0])*100}));
      if(pts2.length<3)return;
      const ln=pts2.map(p=>X(p.x,1,53).toFixed(1)+','+Y(Math.min(p.v,b),a,b).toFixed(1)).join(' ');
      s+=`<polyline points="${ln}" fill="none" stroke="${lad(i)}" stroke-width="${y===cy?2.8:1.8}"/>`;
    });
    const cur=rows.filter(r=>r[1]===cy);
    if(cur.length){const r0=cur[cur.length-1];const v0=(r0[3]+r0[4])/wAt(r0[0])*100;
      s+=`<text x="${(X(r0[2],1,53)-4).toFixed(1)}" y="${(Y(Math.min(v0,b),a,b)-6).toFixed(1)}" font-size="9" font-weight="700" text-anchor="end" fill="#000">${f1(v0)}%</text>`;}
    const lx=W-MR-52;
    ys.forEach((y,i)=>{
      const y2=H-MB-8-(ys.length-1-i)*11;
      s+=`<rect x="${lx}" y="${y2-7}" width="9" height="9" fill="${lad(i)}"/><text x="${lx+13}" y="${y2}" font-size="8" font-weight="700" fill="#000">${myLbl(y)}</text>`;
    });
    return SW(s);
  }
  let wi=0,last=null; const pts=[];
  rows.forEach(r=>{
    while(wi<wmap.length&&wmap[wi][0]<=r[0]){last=wmap[wi][1];wi++;}
    if(last)pts.push({x:new Date(r[0]).getTime(),v:(r[3]+r[4])/last*100});
  });
  const xa=pts[0].x,xb=pts[pts.length-1].x,a=0,b=Math.max(115,Math.ceil(Math.max(...pts.map(p=>p.v))*1.08/25)*25);
  let s=AX()+TY([0,25,50,75,100,125,150,175,200,250,300].filter(v=>v<=b),a,b,v=>v+'%');
  ['2023','2024','2025','2026'].forEach(y=>{const t=new Date(y+'-01-01').getTime();if(t>xa&&t<xb)s+=`<text x="${X(t,xa,xb)}" y="${H-MB+13}" class="xlab" text-anchor="middle">${y}</text>`});
  s+=`<line x1="${ML}" y1="${Y(100,a,b)}" x2="${W-MR}" y2="${Y(100,a,b)}" stroke="#666" stroke-dasharray="4 3"/>`;
  s+=LN(pts,a,b,xa,xb,NAVY,2);
  const lp=pts[pts.length-1];
  s+=`<text x="${W-MR}" y="${Y(lp.v,a,b)-6}" font-size="8" text-anchor="end" font-weight="700" fill="${NAVY}">${f1(lp.v)}%</text>`;
  return SW(s);
}
function gRitmo(com){
  const ys=MYS(com),cy=ys[ys.length-1];
  const wm=E.dados[com].wasde;
  if(!wm||!wm.length)return SW(`<text x="${W/2}" y="${H/2}" text-anchor="middle" font-size="11" fill="#888">sem meta WASDE</text>`);
  const wAt=d=>{let v=wm[0][1];for(const r of wm){if(r[0]<=d)v=r[1];else break;}return v;};
  const finais={};ys.slice(0,-1).forEach(y=>{const rw=S(com,'MUNDO').filter(r=>r[1]===y);if(rw.length&&rw[rw.length-1][3]>0)finais[y]=rw[rw.length-1][3];});
  if(Object.keys(finais).length<2)return SW(`<text x="${W/2}" y="${H/2}" text-anchor="middle" font-size="11" fill="#888">histórico insuficiente</text>`);
  const shareLoo=(w,ex)=>{let s2=0,n=0;Object.keys(finais).forEach(ky=>{const y=+ky;if(y===ex)return;
    const rw=S(com,'MUNDO').filter(r=>r[1]===y&&r[2]<=w);if(!rw.length)return;
    s2+=rw[rw.length-1][3]/finais[y];n++;});return n>=2?s2/n:null;};
  const bookK=myLbl(cy+1)+' · book';
  const series=[];
  ys.forEach((y,i)=>{
    const k=myLbl(y);if(HID(k))return;
    const rows=S(com,'MUNDO').filter(r=>r[1]===y);
    const pts=[];rows.forEach(r=>{const sh=shareLoo(r[2],y);if(sh==null)return;
      pts.push({x:r[2],v:(r[3]-sh*wAt(r[0]))/1000});});
    if(pts.length>2)series.push({k,c:LADDER[i+LADDER.length-ys.length]||NAVY,w:y===cy?1.8:1.1,pts});
  });
  if(!HID(bookK)){
    const curB={};S(com,'MUNDO').filter(r=>r[1]===cy&&r[5]!=null).forEach(r=>{curB[r[2]]=r[5];});
    const pts=[];Object.keys(curB).map(Number).sort((a,b)=>a-b).forEach(w=>{
      let s2=0,n=0;Object.keys(finais).forEach(ky=>{const rw=S(com,'MUNDO').find(r=>r[1]===+ky&&r[2]===w&&r[5]!=null);if(rw){s2+=rw[5];n++;}});
      if(n>=2)pts.push({x:w,v:(curB[w]-s2/n)/1000});});
    if(pts.length>2)series.push({k:bookK,c:TEAL,w:1.4,dash:'3 3',pts});
  }
  if(!series.length)return SW(`<text x="${W/2}" y="${H/2}" text-anchor="middle" font-size="11" fill="#888">todas as séries ocultas</text>`);
  let vmax=0;series.forEach(s2=>s2.pts.forEach(p=>{const a=Math.abs(p.v);if(a>vmax)vmax=a;}));
  if(!(vmax>0))return SW('');
  const tk=ticks4(vmax),L2=tk[tk.length-1]*1.12;
  const tks=[...tk.filter(x=>x>0).map(x=>-x).reverse(),0,...tk.filter(x=>x>0)];
  let s=AX()+TY(tks,-L2,L2,f1)+TXM(com);
  s+=`<line x1="${ML}" y1="${Y(0,-L2,L2).toFixed(1)}" x2="${W-MR}" y2="${Y(0,-L2,L2).toFixed(1)}" stroke="#000" stroke-width="1" stroke-dasharray="2 2"/>`;
  series.forEach(s2=>{
    const ln=s2.pts.map(p=>X(p.x,1,53).toFixed(1)+','+Y(p.v,-L2,L2).toFixed(1)).join(' ');
    s+=`<polyline points="${ln}" fill="none" stroke="${s2.c}" stroke-width="${s2.w}"${s2.dash?` stroke-dasharray="${s2.dash}"`:''}/>`;
  });
  const curS=series.find(s2=>s2.k===myLbl(cy));
  if(curS&&curS.pts.length){const lp=curS.pts[curS.pts.length-1];const sg=lp.v>=0?'+':'\u2212';
    s+=`<circle cx="${X(lp.x,1,53)}" cy="${Y(lp.v,-L2,L2).toFixed(1)}" r="2.6" fill="${NAVY}"/>`;
    const lxR=X(lp.x,1,53),lstart=lxR<W/2;
    s+=`<text x="${lstart?Math.max(lxR+5,ML+4):Math.min(lxR,W-MR-4)}" y="${(Y(lp.v,-L2,L2)-7).toFixed(1)}" font-size="8" font-weight="700" text-anchor="${lstart?'start':'end'}" fill="#000">${sg}${f1(Math.abs(lp.v))} Mi t vs ritmo</text>`;}
  return SW(s);
}

function _cicloDe(d){const y=+d.slice(0,4);return +d.slice(5,7)>=9?y:y-1;}
function _cnBookCiclo(y,dLim){let s=0;(E.deep.nar||[]).forEach(r=>{if(_cicloDe(r[0])===y&&r[0]<=dLim)s+=(r[4]||0);});return Math.max(0,s);}
function nmyProgramKt(com,my){
  const m=E.deep&&E.deep.nmy_wasde&&E.deep.nmy_wasde[com];
  const v=m&&m[my];
  return Number.isFinite(v)&&v>0?v:null;
}
function gProgNova(com){
  const ys=MYS(com),cy=ys[ys.length-1];
  const MU=S(com,'MUNDO');
  const lad=i=>LADDER[i+LADDER.length-ys.length]||NAVY;
  const series=[];
  ys.forEach((y,i)=>{
    const k=myLbl(y+1);
    const pts=MU.filter(r=>r[1]===y&&r[5]!=null).map(r=>({x:r[2],v:r[5]/1000}));
    if(pts.length>2)series.push({k,y,c:lad(i),w:y===cy?2.8:1.8,pts});
  });
  if(!series.length)return SW(`<text x="${W/2}" y="${H/2}" text-anchor="middle" font-size="11" fill="#888">sem book</text>`);
  const kP='proje\u00e7\u00e3o ex-guerra';
  let proj=[];
  const cur=series.find(s2=>s2.y===cy);
  if(cur&&!HID(kP)){
    const lp=cur.pts[cur.pts.length-1];
    let v=lp.v*1000;proj.push({x:lp.x,v:lp.v});
    for(let w=lp.x+1;w<=53;w++){
      const ds=[];
      ys.slice(0,-1).forEach(y=>{if(y===2024)return; /* ciclo da guerra comercial excluido do ritmo */
        const a=MU.find(r=>r[1]===y&&r[2]===w-1&&r[5]!=null),b=MU.find(r=>r[1]===y&&r[2]===w&&r[5]!=null);
        if(a&&b)ds.push(b[5]-a[5]);});
      if(!ds.length)break;
      v+=ds.reduce((s2,x)=>s2+x,0)/ds.length;
      proj.push({x:w,v:v/1000});
    }
  }
  let vmax=0;
  series.forEach(s2=>{if(!HID(s2.k))s2.pts.forEach(p=>{if(p.v>vmax)vmax=p.v;});});
  proj.forEach(p=>{if(p.v>vmax)vmax=p.v;});
  if(!(vmax>0))return SW('');
  const tk=ticks4(vmax),L2=tk[tk.length-1]*1.08;
  let s=AX()+TY([0,...tk],0,L2,f1)+TXM(com);
  series.forEach(s2=>{
    if(HID(s2.k))return;
    const ln=s2.pts.map(p=>X(p.x,1,53).toFixed(1)+','+Y(p.v,0,L2).toFixed(1)).join(' ');
    s+=`<polyline points="${ln}" fill="none" stroke="${s2.c}" stroke-width="${s2.w}"/>`;
  });
  if(proj.length>1){
    const ln=proj.map(p=>X(p.x,1,53).toFixed(1)+','+Y(p.v,0,L2).toFixed(1)).join(' ');
    s+=`<polyline points="${ln}" fill="none" stroke="${TEAL}" stroke-width="2.2" stroke-dasharray="4 3"/>`;
    const fp=proj[proj.length-1];
    s+=`<circle cx="${X(fp.x,1,53).toFixed(1)}" cy="${Y(fp.v,0,L2).toFixed(1)}" r="2.4" fill="${TEAL}"/>`;
    s+=`<text x="${(X(fp.x,1,53)-5).toFixed(1)}" y="${(Y(fp.v,0,L2)-6).toFixed(1)}" font-size="9" font-weight="700" text-anchor="end" fill="#000">\u2248 ${f1(fp.v)} Mi t na virada</text>`;
  }
  if(cur&&cur.pts.length){
    const lp=cur.pts[cur.pts.length-1];
    s+=`<circle cx="${X(lp.x,1,53).toFixed(1)}" cy="${Y(lp.v,0,L2).toFixed(1)}" r="2.6" fill="${NAVY}"/>`;
    s+=`<text x="${(X(lp.x,1,53)-5).toFixed(1)}" y="${(Y(lp.v,0,L2)+12).toFixed(1)}" font-size="9" font-weight="700" text-anchor="end" fill="#000">sem ${lp.x}: ${f1(lp.v)}</text>`;
  }
  return SW(s);
}
function gProgNovaPct(com){
  const ys=MYS(com),cy=ys[ys.length-1];
  const MU=S(com,'MUNDO');
  const lad=i=>LADDER[i+LADDER.length-ys.length]||NAVY;
  const series=[];
  ys.forEach((y,i)=>{
    const alvo=nmyProgramKt(com,y+1);
    if(!alvo)return;
    const k=myLbl(y+1);
    const pts=MU.filter(r=>r[1]===y&&r[5]!=null).map(r=>({x:r[2],v:100*r[5]/alvo}));
    if(pts.length>2)series.push({k,y,alvo,c:lad(i),w:y===cy?2.8:1.8,pts});
  });
  if(!series.length)return SW(`<text x="${W/2}" y="${H/2}" text-anchor="middle" font-size="11" fill="#888">sem programa USDA</text>`);
  const kP='proje\u00e7\u00e3o ex-guerra';
  let proj=[];
  const cur=series.find(s2=>s2.y===cy);
  if(cur&&!HID(kP)){
    const lp=cur.pts[cur.pts.length-1];
    let v=lp.v*cur.alvo/100;proj.push({x:lp.x,v:lp.v});
    for(let w=lp.x+1;w<=53;w++){
      const ds=[];
      ys.slice(0,-1).forEach(y=>{if(y===2024)return; /* ciclo da guerra comercial excluído do ritmo */
        const a=MU.find(r=>r[1]===y&&r[2]===w-1&&r[5]!=null),b=MU.find(r=>r[1]===y&&r[2]===w&&r[5]!=null);
        if(a&&b)ds.push(b[5]-a[5]);});
      if(!ds.length)break;
      v+=ds.reduce((s2,x)=>s2+x,0)/ds.length;
      proj.push({x:w,v:100*v/cur.alvo});
    }
  }
  let vmax=0;
  series.forEach(s2=>{if(!HID(s2.k))s2.pts.forEach(p=>{if(p.v>vmax)vmax=p.v;});});
  proj.forEach(p=>{if(p.v>vmax)vmax=p.v;});
  if(!(vmax>0))return SW('');
  const tk=ticks4(vmax),L2=tk[tk.length-1]*1.08;
  let s=AX()+TY([0,...tk],0,L2,fTP([0,...tk],1))+TXM(com);
  series.forEach(s2=>{
    if(HID(s2.k))return;
    const ln=s2.pts.map(p=>X(p.x,1,53).toFixed(1)+','+Y(p.v,0,L2).toFixed(1)).join(' ');
    s+=`<polyline points="${ln}" fill="none" stroke="${s2.c}" stroke-width="${s2.w}"/>`;
  });
  if(proj.length>1){
    const ln=proj.map(p=>X(p.x,1,53).toFixed(1)+','+Y(p.v,0,L2).toFixed(1)).join(' ');
    s+=`<polyline points="${ln}" fill="none" stroke="${TEAL}" stroke-width="2.2" stroke-dasharray="4 3"/>`;
    const fp=proj[proj.length-1];
    s+=`<circle cx="${X(fp.x,1,53).toFixed(1)}" cy="${Y(fp.v,0,L2).toFixed(1)}" r="2.4" fill="${TEAL}"/>`;
    s+=`<text x="${(X(fp.x,1,53)-5).toFixed(1)}" y="${(Y(fp.v,0,L2)-6).toFixed(1)}" font-size="9" font-weight="700" text-anchor="end" fill="#000">\u2248 ${f1(fp.v)}% na virada</text>`;
  }
  if(cur&&cur.pts.length){
    const lp=cur.pts[cur.pts.length-1];
    s+=`<circle cx="${X(lp.x,1,53).toFixed(1)}" cy="${Y(lp.v,0,L2).toFixed(1)}" r="2.6" fill="${NAVY}"/>`;
    s+=`<text x="${(X(lp.x,1,53)-5).toFixed(1)}" y="${(Y(lp.v,0,L2)+12).toFixed(1)}" font-size="9" font-weight="700" text-anchor="end" fill="#000">Sem. ${lp.x}: ${f1(lp.v)}%</text>`;
    s+=`<text x="${W-MR}" y="${MT+8}" font-size="7.5" text-anchor="end" fill="#666">WASDE ${myLbl(cy+1)}: ${f1(cur.alvo/1000)} Mi t</text>`;
  }
  return SW(s);
}
function gIniProg(com,pais,wkSel){
  const alvo=(!pais||pais==='MUNDO')?null:pais;
  const ys=MYS(com),cy=ys[ys.length-1];
  const MU=S(com,'MUNDO');
  const wkRef=wkSel==null?MU[MU.length-1][2]:wkSel;
  const bars=[];
  ys.forEach(y=>{
    const row=MU.filter(r=>r[1]===y&&r[2]<=wkRef&&r[5]!=null).slice(-1)[0];
    if(!row)return;
    let pv=null;
    if(alvo!=null){
      /* outstanding NMY oficial do destino, última leitura na janela wkRef-4..wkRef */
      const rr=S(com,alvo).filter(r=>r[1]===y&&r[2]<=wkRef&&r[2]>=wkRef-4&&r[5]!=null).slice(-1)[0];
      if(rr)pv=rr[5];
      else if(alvo==='China')pv=_cnBookCiclo(y,row[0]); /* fallback: série própria da China */
    }
    bars.push({k:myLbl(y+1),tot:row[5],pv});
  });
  if(!bars.length)return SW(`<text x="${W/2}" y="${H/2}" text-anchor="middle" font-size="11" fill="#888">sem book</text>`);
  let vmax=0;bars.forEach(b=>{if(b.tot>vmax)vmax=b.tot;});
  const tk=ticks4(vmax/1000),L2=tk[tk.length-1]*1.12*1000;
  let s=AX()+TY([0,...tk],0,L2/1000,f1);
  const n=bars.length,bw=(W-ML-MR)/n*0.6;
  bars.forEach((b,i)=>{
    const cx=ML+(W-ML-MR)*(i+0.5)/n;
    const hT=(H-MT-MB)*b.tot/L2;
    const hP=b.pv!=null?(H-MT-MB)*Math.min(b.pv,b.tot)/L2:0;
    s+=`<rect x="${(cx-bw/2).toFixed(1)}" y="${(H-MB-hT).toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(hT-hP,0).toFixed(1)}" fill="${GELO}" stroke="${CINZA}" stroke-width="0.5"/>`;
    if(hP>0)s+=`<rect x="${(cx-bw/2).toFixed(1)}" y="${(H-MB-hP).toFixed(1)}" width="${bw.toFixed(1)}" height="${hP.toFixed(1)}" fill="${TEAL}"/>`;
    s+=`<text x="${cx.toFixed(1)}" y="${(H-MB-hT-4).toFixed(1)}" font-size="9" font-weight="700" text-anchor="middle" fill="#000">${f1(b.tot/1000)}</text>`;
    if(b.pv!=null){
      const pct=b.tot>0?Math.round(100*b.pv/b.tot):0;
      if(hP>15){
        s+=`<text x="${cx.toFixed(1)}" y="${(H-MB-hP/2+3).toFixed(1)}" font-size="9" font-weight="700" text-anchor="middle" fill="#fff">${pct}%</text>`;
      }else{
        s+=`<text x="${(cx+bw/2+3).toFixed(1)}" y="${(H-MB-Math.max(hP/2,4)+3).toFixed(1)}" font-size="9" font-weight="700" text-anchor="start" fill="#000">${pct}%</text>`;
      }
    }else if(alvo!=null){
      s+=`<text x="${cx.toFixed(1)}" y="${(H-MB-9).toFixed(1)}" font-size="7.5" text-anchor="middle" fill="#666">s/ dado</text>`;
    }
    s+=`<text x="${cx.toFixed(1)}" y="${H-MB+13}" class="xlab" text-anchor="middle">${b.k}</text>`;
  });
  s+=`<text x="${W-MR}" y="${MT+8}" font-size="9" font-weight="700" text-anchor="end" fill="#000">sem ${wkRef}</text>`;
  return SW(s);
}
function nmyDestAt(com,pais,y,wk){
  const r=cmAt(com,pais,y,wk);
  if(r&&r[5]!=null)return Math.max(0,r[5]);
  /* Fallback da China quando o CWR não abre o NMY por país. */
  if(com==='soja'&&pais==='China'&&y===2025&&y===MYS(com)[MYS(com).length-1]&&E.deep&&E.deep.cn_nmy_rec){
    const wr=cmAt(com,'MUNDO',y,wk),lim=wr&&wr[0];
    const rec=E.deep.cn_nmy_rec.filter(x=>!lim||x[0]<=lim).slice(-1)[0];
    if(rec)return Math.max(0,rec[1]||0);
  }
  return 0;
}
function nmyShareCtx(com,wkSel){
  const wk=wkSel==null?wkNow(com):wkSel,ys=MYS(com);
  /* Cada coluna representa a safra seguinte comprada na mesma semana do ciclo. */
  const cols=ys.map(y=>{
    const wr=cmAt(com,'MUNDO',y,wk),tot=wr&&wr[5]>0?wr[5]:0;
    return {y,l:myLbl(y+1),tot};
  });
  /* Mantém cores comparáveis: top-5 pela soma do book NMY nos ciclos exibidos. */
  const tops=E.dados[com].paises.filter(p=>p!=='MUNDO'&&p!=='UNKNOWN').map(p=>({
    p,v:cols.reduce((q,c)=>q+nmyDestAt(com,p,c.y,wk),0)
  })).filter(x=>x.v>0).sort((a,b)=>b.v-a.v||a.p.localeCompare(b.p)).slice(0,5).map(x=>x.p);
  return {wk,cols,tops};
}
function gShareSafra(com,wkSel){
  const ys=MYS(com),d=E.dados[com],wk=wkSel==null?wkNow(com):wkSel,cy=ys[ys.length-1];
  const tops=d.paises.filter(p=>p!=='MUNDO'&&p!=='UNKNOWN').slice(0,5);
  const curNmy=cmAt(com,'MUNDO',cy,wk),nmyTot=curNmy&&curNmy[5]>0?curNmy[5]:0;
  const cols=[...ys.map(y=>({y,nc:false,l:myLbl(y)})),...(nmyTot>0?[{y:cy,nc:true,l:myLbl(cy+1)+' NC'}]:[])];
  const n=cols.length,bw=(W-ML-MR)/n*0.6;
  let s=AX()+TY([0,25,50,75,100],0,100,v=>v+'%');
  cols.forEach((col,i)=>{
    const y=col.y,wl=cmAt(com,'MUNDO',y,wk);if(!wl)return;
    const tot=col.nc?nmyTot:(wl[3]+wl[4]);if(tot<=0)return;
    const cx=ML+(W-ML-MR)*(i+0.5)/n;
    let acc=0;
    const stack=tops.map((p,j)=>{
      const rl=cmAt(com,p,y,wk),v=col.nc?nmyDestAt(com,p,y,wk):(rl?rl[3]+rl[4]:0);
      return {v:v/tot*100,c:PAL6[j]};
    });
    const unk=cmAt(com,'UNKNOWN',y,wk);
    const unkV=col.nc?nmyDestAt(com,'UNKNOWN',y,wk):(unk?unk[3]+unk[4]:0);
    stack.push({v:unkV/tot*100,c:'#c9b06a'});
    stack.push({v:Math.max(0,100-stack.reduce((q,x)=>q+x.v,0)),c:'#e3e7eb'});
    stack.forEach(seg=>{
      const h2=(H-MT-MB)*seg.v/100;
      s+=`<rect x="${cx-bw/2}" y="${H-MB-acc-h2}" width="${bw}" height="${h2}" fill="${seg.c}"/>`;
      acc+=h2;
    });
    if(col.nc)s+=`<rect x="${cx-bw/2}" y="${MT}" width="${bw}" height="${H-MT-MB}" fill="none" stroke="${NAVY}" stroke-width="0.7" stroke-dasharray="2 2"/>`;
    s+=`<text x="${cx}" y="${H-MB+13}" class="xlab" text-anchor="middle">${col.l}</text>`;
  });
  return SW(s);
}
function gShareNMY(com,wkSel){
  const {wk,cols,tops}=nmyShareCtx(com,wkSel);
  if(!cols.some(c=>c.tot>0))return SW(`<text x="${W/2}" y="${H/2}" text-anchor="middle" font-size="11" fill="#888">sem book</text>`);
  const n=cols.length,bw=(W-ML-MR)/n*0.6;
  let s=AX()+TY([0,25,50,75,100],0,100,v=>v+'%');
  cols.forEach((col,i)=>{
    const y=col.y,tot=col.tot;
    const cx=ML+(W-ML-MR)*(i+0.5)/n;
    if(tot>0){
      let acc=0;
      const stack=tops.map((p,j)=>({v:nmyDestAt(com,p,y,wk)/tot*100,c:PAL6[j]}));
      stack.push({v:nmyDestAt(com,'UNKNOWN',y,wk)/tot*100,c:'#c9b06a'});
      stack.push({v:Math.max(0,100-stack.reduce((q,x)=>q+x.v,0)),c:'#e3e7eb'});
      stack.forEach(seg=>{
        const h2=(H-MT-MB)*seg.v/100;
        s+=`<rect x="${cx-bw/2}" y="${H-MB-acc-h2}" width="${bw}" height="${h2}" fill="${seg.c}"/>`;
        acc+=h2;
      });
      if(i===cols.length-1)s+=`<rect x="${cx-bw/2}" y="${MT}" width="${bw}" height="${H-MT-MB}" fill="none" stroke="${NAVY}" stroke-width="0.7" stroke-dasharray="2 2"/>`;
    }
    s+=`<text x="${cx}" y="${H-MB+13}" class="xlab" text-anchor="middle">${col.l}</text>`;
  });
  return SW(s);
}
/* e74: commitment (% do programa) por safra, mesmo MY-week, cada WASDE histórico vigente na data. */
function commitPctCtx(com,wkSel){
  const wk=wkSel==null?wkNow(com):wkSel;
  const ys=MYS(com),cy=ys[ys.length-1];
  const rows=S(com,'MUNDO'),wm=E.dados[com].wasde||[];
  const vals=ys.map(y=>{
    // Comparação exatamente na mesma semana: não imputar leituras ausentes.
    const r=rows.find(q=>q[1]===y&&q[2]===wk);
    if(!r)return null;
    let alvo=null;
    for(const w of wm){if(w[0]<=r[0]&&Number.isFinite(w[1])&&w[1]>0)alvo=w[1];else if(w[0]>r[0])break;}
    if(!(alvo>0))return null;
    return {y,wk,data:r[0],commit:r[3]+r[4],alvo,v:100*(r[3]+r[4])/alvo,cur:y===cy};
  }).filter(Boolean);
  const prev=vals.filter(v=>!v.cur),atual=vals.find(v=>v.cur)||null;
  const media=prev.length>=2?prev.reduce((t,v)=>t+v.v,0)/prev.length:null;
  const gap=atual&&media!=null?atual.v-media:null;
  return {com,wk,vals,prev,atual,media,gap};
}
/* e75: participação de um destino no commit MUNDO da mesma semana e do mesmo MY.
   Share por destino = commit país / commit MUNDO; não é % do WASDE. */
function commitPctShareCtx(com,pais,q){
  const vals=q.vals.map(v=>{
    const r=S(com,pais).find(z=>z[1]===v.y&&z[2]===q.wk);
    const wr=S(com,'MUNDO').find(z=>z[1]===v.y&&z[2]===q.wk);
    if(!r||!wr||!(wr[3]+wr[4]>0))return {y:v.y,value:null};
    return {y:v.y,value:100*(r[3]+r[4])/(wr[3]+wr[4])};
  });
  const hist=vals.slice(0,-1).map(v=>v.value).filter(Number.isFinite);
  const media=hist.length>=2?hist.reduce((a,b)=>a+b,0)/hist.length:null;
  const byYear=new Map(vals.map(v=>[v.y,v.value]));
  return {pais,byYear,media,histN:hist.length};
}
function commitPctDefaultPais(com){
  const opts=E.dados[com].paises.filter(p=>p!=='MUNDO'&&p!=='UNKNOWN');
  if(com==='soja'&&opts.includes('China'))return 'China';
  const cy=MYS(com).at(-1),wk=wkNow(com);
  const scored=opts.map(p=>{const r=S(com,p).find(z=>z[1]===cy&&z[2]===wk);
    return {p,v:r?r[3]+r[4]:-Infinity};}).sort((a,b)=>b.v-a.v);
  return scored.length?scored[0].p:'UNKNOWN';
}
function commitPctHeading(el,com,wk){
  const t=el.querySelector('.p-card-t'),sub=el.querySelector('.p-card-s');
  const en=document.documentElement.dataset.lang==='en';
  const names={soja:'Soybeans',milho:'Corn',trigo:'Wheat',farelo:'Soybean meal',oleo:'Soybean oil'};
  if(t)t.textContent=en?('U.S. '+names[com]+' - Total commitments vs. USDA export program'):(E.nome[com]+' EUA - Total comprometido vs. programa do USDA');
  if(sub)sub.textContent=en?('In % · week ('+wk+')'):('Em % · semana ('+wk+')');
}
function commitPctSharePath(points){
  if(!points.length)return '';
  if(points.length===1)return `M ${points[0].x} ${points[0].y}`;
  let d=`M ${points[0].x} ${points[0].y}`;
  for(let i=0;i<points.length-1;i++){
    const p0=points[Math.max(0,i-1)],p1=points[i],p2=points[i+1],p3=points[Math.min(points.length-1,i+2)];
    const c1x=p1.x+(p2.x-p0.x)/6,c1y=p1.y+(p2.y-p0.y)/6;
    const c2x=p2.x-(p3.x-p1.x)/6,c2y=p2.y-(p3.y-p1.y)/6;
    d+=` C ${c1x.toFixed(2)} ${c1y.toFixed(2)} ${c2x.toFixed(2)} ${c2y.toFixed(2)} ${p2.x} ${p2.y}`;
  }
  return d;
}
/* e78: régua independente para share do destino, com uma marca extra de folga visual.
   Não altera o percentual real; apenas a escala do eixo secundário. */
function commitPctShareAxis(values){
  /* e79: régua fixa do eixo direito para leitura estável e mais folga visual da linha.
     Mantém o layout sempre em 0–100%, com marcas de 20 em 20. */
  return {step:20,cap:100,ticks:[0,20,40,60,80,100]};
}
function gCommitPct(com,pais,wkSel){
  const q=commitPctCtx(com,wkSel);
  if(!q.vals.length)return SW(`<text x="${W/2}" y="${H/2}" text-anchor="middle" font-size="11" fill="#888">sem metas históricas verificáveis</text>`);
  const sh=commitPctShareCtx(com,pais,q);
  const bars=q.vals.map(v=>({l:myLbl(v.y),y:v.y,v:v.v,c:v.cur?TEAL:NAVY}));
  if(q.media!=null)bars.push({l:'Média '+q.prev.length+'a',y:null,v:q.media,c:'#a7b0b8'});
  const shareVals=bars.map(p=>p.y==null?sh.media:sh.byYear.get(p.y)).filter(Number.isFinite);
  const mxBar=Math.max(...bars.map(p=>p.v),1),tkBar=ticks4(mxBar),bBar=tkBar[tkBar.length-1]*1.15;
  const {cap:bShare,ticks:tkShare}=commitPctShareAxis(shareVals);
  // Extremidades simétricas (ML=30 e direita=30), com eixos conectados ao mesmo baseline.
  const plotR=W-30,axisR=plotR,plotW=plotR-ML,n=bars.length,bw=plotW/n*0.50;
  const yBar=v=>H-MB-(v)/(bBar)*(H-MT-MB), yShare=v=>H-MB-(v)/(bShare)*(H-MT-MB);
  let out=`<line x1="${ML}" y1="${H-MB}" x2="${plotR}" y2="${H-MB}" stroke="${PRETO}"/><line x1="${ML}" y1="${MT}" x2="${ML}" y2="${H-MB}" stroke="${PRETO}"/>`;
  out+=tkBar.filter(v=>v>=-1e-9&&v<=bBar+1e-9).map(v=>`<text x="${ML-5}" y="${yBar(v)+3}" class="ytick" text-anchor="end">${f0(v)}%</text>`).join('');
  out+=`<line x1="${axisR}" y1="${MT}" x2="${axisR}" y2="${H-MB}" stroke="${PRETO}"/>`;
  out+=tkShare.filter(v=>v>=-1e-9&&v<=bShare+1e-9).map(v=>`<text x="${axisR+4}" y="${yShare(v)+3}" class="ytick" text-anchor="start">${f0(v)}%</text>`).join('');
  bars.forEach((p,i)=>{
    const cx=ML+plotW*(i+0.5)/n,y=yBar(p.v);
    out+=`<rect x="${cx-bw/2}" y="${y}" width="${bw}" height="${Math.max(0,H-MB-y)}" fill="${p.c}"/>`;
    out+=`<text x="${cx}" y="${Math.max(MT+20,y-5)}" font-size="8" font-weight="700" text-anchor="middle" fill="#000">${f1(p.v)}%</text>`;
    out+=`<text x="${cx}" y="${H-MB+13}" class="xlab" text-anchor="middle">${p.l}</text>`;
  });
  if(q.gap!=null){
    const sign=q.gap>0?'+':'';
    out+=`<text x="${axisR-3}" y="${MT+8}" font-size="7.4" font-weight="700" text-anchor="end" fill="#555">Δ vs média: ${sign}${f1(q.gap)} p.p.</text>`;
  }
  // Linha share usa eixo da direita, com escala própria. Não ligar ausências e não converter null em zero.
  let trecho=[];
  const flush=()=>{if(trecho.length>1)out+=`<path d="${commitPctSharePath(trecho)}" stroke="#454545" stroke-width="1.45" stroke-linejoin="round" stroke-linecap="round" fill="none"/>`;
    trecho.forEach(pt=>{out+=`<circle cx="${pt.x}" cy="${pt.y}" r="1.45" fill="#454545"/>`;});
    trecho=[];};
  bars.forEach((p,i)=>{
    const v=p.y==null?sh.media:sh.byYear.get(p.y);
    if(!Number.isFinite(v)){flush();return;}
    const xx=ML+plotW*(i+0.5)/n,yy=yShare(Math.max(0,Math.min(bShare,v)));
    trecho.push({x:xx,y:yy});
  });flush();
  return SW(out).replace('<svg ','<svg data-commitpct-axis="e79" ');
}

function gRegua(com,pais,wkSel){
  const ys=MYS(com),wk=wkSel==null?wkNow(com):wkSel,cy=ys[ys.length-1];
  const vals=ys.map(y=>{const r=cmAt(com,pais,y,wk);return r?{y,v:(r[3]+r[4])/1000,cur:y===cy}:null;}).filter(Boolean);
  if(!vals.length)return SW(`<text x="${W/2}" y="${H/2}" text-anchor="middle" font-size="11" fill="#888">sem dados</text>`);
  const prev=vals.filter(x=>!x.cur);
  const med=prev.length?prev.reduce((q,x)=>q+x.v,0)/prev.length:null;
  const bars=[...vals.map(x=>({l:myLbl(x.y),v:x.v,c:x.cur?TEAL:NAVY})),
              ...(med!=null?[{l:'Média '+prev.length+' anos',v:med,c:'#a7b0b8'}]:[])];
  const mx=Math.max(...bars.map(x=>x.v));
  if(!(mx>0))return SW(`<text x="${W/2}" y="${H/2}" text-anchor="middle" font-size="11" fill="#888">sem compromisso na semana</text>`);
  const tk=ticks4(mx),b=tk[tk.length-1]*1.14;
  const n=bars.length,bw=(W-ML-MR)/n*0.52;
  let s=AX()+TY(tk,0,b,f0);
  bars.forEach((x,i)=>{
    const cx=ML+(W-ML-MR)*(i+0.5)/n,y=Y(x.v,0,b);
    s+=`<rect x="${cx-bw/2}" y="${y}" width="${bw}" height="${H-MB-y}" fill="${x.c}"/>`;
    s+=`<text x="${cx}" y="${y-5}" font-size="8" font-weight="700" text-anchor="middle" fill="#000">${mx<10?f1(x.v):f0(x.v)}</text>`;
    s+=`<text x="${cx}" y="${H-MB+13}" class="xlab" text-anchor="middle">${x.l}</text>`;
  });
  
  return SW(s);
}
function gBook(com,pais){
  const ys=MYS(com),xa=1,xb=53;
  let mx=0; const series=ys.map(y=>{
    const pts=S(com,pais).filter(r=>r[1]===y&&r[5]!=null).map(r=>({x:r[2],v:r[5]/1000}));
    pts.forEach(p=>{if(p.v>mx)mx=p.v}); return {y,pts};
  }).filter(q=>q.pts.length>2).filter(q=>!HID(myLbl(q.y+1)));
  mx=0;series.forEach(q=>q.pts.forEach(p=>{if(p.v>mx)mx=p.v}));
  if(!series.length||mx===0)return SW(`<text x="${W/2}" y="${H/2}" text-anchor="middle" font-size="11" fill="#888">sem série NMY para ${pais}</text>`);
  const tk=ticks4(mx),b=tk[tk.length-1]*1.06;
  let s=AX()+TY(tk,0,b,fTick(tk,1))+TXM(com);
  const rec=(com==='soja'&&pais==='China'&&ys[ys.length-1]===2025&&E.deep&&E.deep.cn_nmy_rec)?E.deep.cn_nmy_rec:null;
  series.forEach((q,i)=>{
    const ii=ys.indexOf(q.y);const cor=LADDER[ii+LADDER.length-ys.length]||NAVY;
    s+=LN(q.pts,0,b,xa,xb,cor,q.y===ys[ys.length-1]?2.4:1.4);
    if(rec&&q.y===ys[ys.length-1])return;
    const lp=q.pts[q.pts.length-1];
    
  });
  if(rec&&!HID(myLbl(ys[ys.length-1]+1))){
    const start=new Date('2025-09-01').getTime();
    const rpts=rec.map(r=>({x:Math.floor((new Date(r[0]).getTime()-start)/(7*864e5))+1,v:r[1]/1000}));
    const base=series.find(q=>q.y===ys[ys.length-1]);
    const anchor=base&&base.pts.length?[base.pts[base.pts.length-1]]:[];
    s+=LN([...anchor,...rpts],0,b,xa,xb,NAVY,2.2,'5 3');
    const lp=rpts[rpts.length-1];
    if(lp){s+=`<circle cx="${X(lp.x,xa,xb)}" cy="${Y(lp.v,0,b)}" r="2.6" fill="${NAVY}"/>`;
      if(lp){}}
    const cwrRec=rec[rec.length-1];
    s+=`<text x="${ML+4}" y="${MT+8}" font-size="7.5" text-anchor="start" fill="#888">tracejado abr–jul: reconstruído da narrativa (ESRQS aboliu NMY-país) · validado no CWR: ${f1(cwrRec?cwrRec[1]:0)}</text>`;
  }
  return SW(s);
}
function gBookPct(com,pais){
  const ys=MYS(com),cy=ys[ys.length-1],xa=1,xb=53;
  const series=ys.map(y=>{
    const alvo=nmyProgramKt(com,y+1);
    if(!alvo)return null;
    const pts=S(com,pais).filter(r=>r[1]===y&&r[5]!=null).map(r=>({x:r[2],v:100*r[5]/alvo}));
    return {y,alvo,pts};
  }).filter(Boolean).filter(q=>q.pts.length>2).filter(q=>!HID(myLbl(q.y+1)));
  const rec=(com==='soja'&&pais==='China'&&cy===2025&&E.deep&&E.deep.cn_nmy_rec&&!HID(myLbl(cy+1)))?E.deep.cn_nmy_rec:null;
  const alvoAtual=nmyProgramKt(com,cy+1);
  let rpts=[];
  if(rec&&alvoAtual){
    const start=new Date('2025-09-01').getTime();
    rpts=rec.map(r=>({x:Math.floor((new Date(r[0]).getTime()-start)/(7*864e5))+1,v:100*r[1]/alvoAtual}));
  }
  let mx=0;
  series.forEach(q=>q.pts.forEach(p=>{if(p.v>mx)mx=p.v;}));
  rpts.forEach(p=>{if(p.v>mx)mx=p.v;});
  if(!series.length||mx===0)return SW(`<text x="${W/2}" y="${H/2}" text-anchor="middle" font-size="11" fill="#888">sem série NMY para ${pais}</text>`);
  const tk=ticks4(mx),b=tk[tk.length-1]*1.06;
  let s=AX()+TY(tk,0,b,fTP(tk,1))+TXM(com);
  series.forEach(q=>{
    const ii=ys.indexOf(q.y),cor=LADDER[ii+LADDER.length-ys.length]||NAVY;
    s+=LN(q.pts,0,b,xa,xb,cor,q.y===cy?2.4:1.4);
    if(q.y===cy&&!rec&&q.pts.length){
      const lp=q.pts[q.pts.length-1];
      s+=`<circle cx="${X(lp.x,xa,xb).toFixed(1)}" cy="${Y(lp.v,0,b).toFixed(1)}" r="2.6" fill="${NAVY}"/>`;
      s+=`<text x="${(X(lp.x,xa,xb)-5).toFixed(1)}" y="${(Y(lp.v,0,b)-6).toFixed(1)}" font-size="9" font-weight="700" text-anchor="end" fill="#000">${f1(lp.v)}%</text>`;
    }
  });
  if(rpts.length){
    const base=series.find(q=>q.y===cy);
    const anchor=base&&base.pts.length?[base.pts[base.pts.length-1]]:[];
    s+=LN([...anchor,...rpts],0,b,xa,xb,NAVY,2.2,'5 3');
    const lp=rpts[rpts.length-1];
    s+=`<circle cx="${X(lp.x,xa,xb).toFixed(1)}" cy="${Y(lp.v,0,b).toFixed(1)}" r="2.6" fill="${NAVY}"/>`;
    s+=`<text x="${(X(lp.x,xa,xb)-5).toFixed(1)}" y="${(Y(lp.v,0,b)-6).toFixed(1)}" font-size="9" font-weight="700" text-anchor="end" fill="#000">${f1(lp.v)}%</text>`;
    s+=`<text x="${ML+4}" y="${MT+18}" font-size="7.5" text-anchor="start" fill="#888">tracejado abr–jul: reconstruído da narrativa · CWR: ${f1(lp.v)}% do programa</text>`;
  }
  if(alvoAtual)s+=`<text x="${W-MR}" y="${MT+8}" font-size="7.5" text-anchor="end" fill="#666">WASDE ${myLbl(cy+1)}: ${f1(alvoAtual/1000)} Mi t</text>`;
  return SW(s);
}
function cardsFor(com){
  const nm=E.nome[com];
  const wk=wkNow(com);
  return [
   {id:'netsafra',t:`Net sales por safra - ${nm}`,s:'Em Mi t · semana selecionada do MY · variação do commit',fn:gNetSafra,filt:1,sem:1,u:'Mi t'},
   {id:'regua',t:`Commit por safra - ${nm}`,s:'Em Mi t · mesma semana do MY · média histórica',fn:gRegua,filt:1,sem:1,u:'Mi t'},
   {id:'commitpct',t:`${nm} EUA - Total comprometido vs. programa do USDA`,s:`Em % · semana (${wk})`,fn:gCommitPct,filt:0,share:1,sem:1,u:'%'},
   {id:'donut',t:`Destinos do commit atual - ${nm}`,s:'Em % · semana selecionada do MY',fn:gDonut,filt:0,sem:1,u:'%'},
   {id:'rank',t:`Commit por destino - ${nm}`,s:'Em Mi t · semana selecionada do MY · top 10 países',fn:gRankDest,filt:0,sem:1,u:'Mi t'},
   {id:'dumb',t:`Embarcado por destino - ${nm}`,s:'Em Mi t · semana selecionada do MY · safra atual vs anterior',fn:gDumb,filt:0,sem:1,u:'Mi t'},
   {id:'grupo',t:`Composição do commit por safra - ${nm}`,s:'Em Mi t · semana selecionada do MY · embarcado + a embarcar',fn:gGrupo,filt:1,sem:1,u:'Mi t'},
   {id:'area',t:`Composição do commit - ${nm}`,s:'Em Mi t · safra atual · embarcado + a embarcar por semana do MY',fn:gAreaMY,filt:1,saf:1,u:'Mi t'},
   {id:'wexp',t:`Embarques semanais - ${nm}`,s:'Em mil t/semana · safra atual · pico destacado',fn:gWexpBars,filt:1,saf:1,u:'mil t'},
   {id:'matriz',t:`Embarcado: destino × safra - ${nm}`,s:'Em Mi t · semana selecionada do MY · total por safra',fn:gMatriz,filt:0,sem:1,u:'Mi t'},
   {id:'sankey',t:`Fluxo por safra e destino - ${nm}`,s:'Em mil t · semana selecionada do MY · embarcado',fn:gSankey,filt:0,sem:1,u:'mil t'},
   {id:'triplo',t:`Commit por destino: comparativos - ${nm}`,s:'Em Mi t · semana atual vs anterior e ano passado',fn:gTriplo,filt:0,sem:1,u:'Mi t'},
   {id:'mensal',t:`Embarques mensais por safra - ${nm}`,s:'Em Mi t/mês · comparação entre safras',fn:gMensal,filt:1,u:'Mi t/mês'},
   {id:'heat',t:`Share dos embarques por destino - ${nm}`,s:'Em % do embarcado mundial · semana selecionada do MY',fn:gHeat,filt:0,sem:1,u:'%'},
   {id:'heatcommit',t:`${nm} EUA - Share do commitment por destino`,s:`Em % do commitment mundial · semana (${wk})`,fn:gHeatCommit,filt:0,sem:1,metric:1,u:'%'},
   {id:'commit',t:`Commit acumulado - ${nm}`,s:'Em Mi t · por semana do MY · últimas 5 safras',fn:gCommit,filt:1,u:'Mi t'},
   {id:'accum',t:`Embarcado acumulado - ${nm}`,s:'Em Mi t · por semana do MY · últimas 5 safras',fn:gAccum,filt:1,u:'Mi t'},
   {id:'outst',t:`A embarcar - ${nm}`,s:'Em Mi t · por semana do MY · últimas 5 safras',fn:gOutst,filt:1,u:'Mi t'},
   {id:'net',t:`Net sales semanais - ${nm}`,s:'Em mil t/semana · safra atual · variação do commit',fn:gNet,filt:1,saf:1,u:'mil t'},
   {id:'wasde',t:`Commit vs WASDE - ${nm}`,s:'Em % da meta vigente · por semana do MY',fn:gWasde,filt:0,u:'%'},
   {id:'ritmo',t:`Desvio do ritmo sazonal - ${nm}`,s:'Em Mi t · commit vs ritmo histórico da meta USDA · safra nova = book NMY',fn:gRitmo,filt:0,u:'Mi t'},
   ...(com==='soja'?[
   {id:'prognova',t:`Book da safra nova - ${nm}`,s:'Em Mi t · por semana do ciclo · projeção ex-guerra (25/26 excluída)',fn:gProgNova,filt:0,u:'Mi t'},
   {id:'iniprog',t:`Book da safra nova por destino - ${nm}`,s:'Em Mi t · mesma semana de cada ciclo · destino selecionado',fn:gIniProg,filt:1,sem:1,u:'Mi t'}
   ]:[]),
   ...(['soja','milho'].includes(com)?[
   {id:'prognovapct',t:`Book da safra nova vs programa USDA - ${nm}`,s:'Em % da meta de cada safra · por semana do ciclo · projeção ex-guerra',fn:gProgNovaPct,filt:0,u:'%'}
   ]:[]),
   {id:'sharesafra',t:`Share do commit por safra - ${nm}`,s:'Em % · semana selecionada do MY · top 5 destinos + safra nova',fn:gShareSafra,filt:0,sem:1,u:'%'},
   {id:'sharenmy',t:`Share do book NMY por safra - ${nm}`,s:'Em % · mesma semana do ciclo · top 5 destinos + unknown',fn:gShareNMY,filt:0,sem:1,u:'%'},
   {id:'book',t:`Book NMY acumulado - ${nm}`,s:'Em Mi t · por semana do ciclo · rótulo = safra vendida',fn:gBook,filt:1,u:'Mi t'},
   ...(['soja','milho'].includes(com)?[
   {id:'bookpct',t:`Book NMY vs programa USDA - ${nm}`,s:'Em % da meta de cada safra · por semana do ciclo',fn:gBookPct,filt:1,u:'%'}
   ]:[]),
   {id:'exec',t:`Execução do commit por destino - ${nm}`,s:'Em % · embarcado ÷ commit · semana selecionada do MY',fn:gExec,filt:0,sem:1,u:'%'},
   {id:'cohort',t:`Embarcado vs média histórica - ${nm}`,s:'Em % · desvio na mesma semana do MY · pós-guerra',fn:gCohort,filt:0,sem:1,u:'%'},
  ].concat(com==='soja'?[
   {id:'saz',t:'Ritmo de comercialização - Soja',s:'Em % · faixa histórica 1990–2024 vs safra atual',fn:gSaz,filt:0,u:'%'},
   {id:'perc',t:'Percentil na amostra disponível - Soja',s:'Em percentil empírico · mesma semana do MY · histórico disponível 22/23–25/26',fn:gPerc,filt:0,u:'p'},
   {id:'fl',t:'Antecipação do book - Soja',s:'Em % · book de julho ÷ embarque final · 1990–2024',fn:gFL,filt:0,u:'%'},
   {id:'fluxocn',t:'Net sales para a China - Soja',s:'Em mil t/semana · destinos citados no relatório oficial',fn:gFluxoCN,filt:0,u:'mil t'},
   {id:'switched',t:'Switched de unknown para China - Soja',s:'Em mil t/semana · reclassificação de compras anônimas',fn:gSwitched,filt:0,u:'mil t'},
  ]:[]);
}

function _sojaCurvaAtual(){
 const rows=S('soja','MUNDO');
 if(!rows.length)return {};
 const my=rows[rows.length-1][1];
 const wm=E.dados.soja.wasde,alvo=wm.length?wm[wm.length-1][1]:null;
 if(!(alvo>0))return {};
 return Object.fromEntries(rows.filter(r=>r[1]===my&&r[2]>=1&&r[2]<=53)
   .map(r=>[String(r[2]),100*(r[3]+r[4])/alvo]));
}
function gSaz(){
  const saz=E.deep.saz,cur=_sojaCurvaAtual(),xa=1,xb=53,a=0,b=112;
  let s=AX()+TY([0,25,50,75,100],a,b,v=>v+'%')+TXM('soja');
  const ks=Object.keys(saz).map(Number).sort((x,y)=>x-y);
  const up=ks.map(k=>X(k,xa,xb).toFixed(1)+','+Y(saz[k][2],a,b).toFixed(1)).join(' ');
  const dn=ks.slice().reverse().map(k=>X(k,xa,xb).toFixed(1)+','+Y(saz[k][0],a,b).toFixed(1)).join(' ');
  s+=`<polygon points="${up} ${dn}" fill="${GELO}" opacity="0.8"/>`;
  s+=LN(ks.map(k=>({x:k,v:saz[k][1]})),a,b,xa,xb,PRETO,1.4);
  s+=LN(Object.keys(cur).map(Number).sort((x,y)=>x-y).map(k=>({x:k,v:cur[k]})),a,b,xa,xb,NAVY,2.6);
  
  
  return SW(s);
}
function _sojaPercentisDisponiveis(){
 const rr=S('soja','MUNDO');if(!rr.length)return [];
 const last=rr[rr.length-1],my=last[1],wk=last[2];
 const vals=(a,b)=>({
   wexp:a[3]-b[3],
   net:(a[3]+a[4])-(b[3]+b[4]),
   outst:a[4],nmy:a[5]
 });
 const getPair=y=>{
   const a=rr.find(r=>r[1]===y&&r[2]===wk);
   const b=rr.find(r=>r[1]===y&&r[2]===wk-1);
   return a&&b?vals(a,b):null;
 };
 const hist=[];for(const y of [...new Set(rr.map(r=>r[1]))]){
   if(y>=my)continue;const v=getPair(y);if(v)hist.push({y,v});
 }
 const pNow=getPair(my);
 const actual=E.deep.vendActual&&E.deep.vendActual[last[0]];
 if(pNow&&actual&&actual.soja&&Number.isFinite(actual.soja.cy))pNow.net=actual.soja.cy;
 if(pNow&&E.deep.perc_reference&&E.deep.perc_reference.week===last[0]){
   const known=E.deep.perc_vals||{};
   for(const k of ['wexp','net','outst','nmy'])if(Number.isFinite(known[k]))pNow[k]=known[k];
 }
 const entries=[['Exportações da semana','wexp'],['Net sales','net'],['Outstanding','outst'],['Book MY seguinte','nmy']];
 return entries.map(([label,k])=>{
   const refs=hist.map(h=>h.v[k]).filter(Number.isFinite),v=pNow?pNow[k]:null,n=refs.length;
   const lower=refs.filter(x=>x<v-1e-7).length,equal=refs.filter(x=>Math.abs(x-v)<=1e-7).length;
   return {label,k,n,v,p:(n>=3&&Number.isFinite(v))?100*(lower+equal/2)/n:null,yrs:hist.map(h=>h.y)};
 });
}
function gPerc(){
 const items=_sojaPercentisDisponiveis();
 E.deep.perc=Object.fromEntries(items.map(it=>[it.k,it.p]));
 const bw=W-ML-MR,rh=28,gap=14,top=26;let s='';
 s+=`<line x1="${ML+bw/2}" y1="${top-8}" x2="${ML+bw/2}" y2="${top+4*(rh+gap)-gap+4}" stroke="#888" stroke-dasharray="4 3"/>`;
 s+=`<text x="${ML+bw/2}" y="${top-12}" font-size="7.5" text-anchor="middle" fill="#666">p50 da amostra observada (não 1990–2024)</text>`;
 items.forEach((it,i)=>{
   const y=top+i*(rh+gap),v=Number.isFinite(it.v)?f0(it.v)+' mil t':'s/d';
   s+=`<text x="${ML}" y="${y-3}" font-size="8" font-weight="700" fill="#000">${it.label}</text><text x="${W-MR}" y="${y-3}" font-size="7.5" text-anchor="end" fill="#555">${v} · n=${it.n}</text>`;
   s+=`<rect x="${ML}" y="${y}" width="${bw}" height="12" fill="#eef1f4" rx="3"/>`;
   if(it.p!=null){s+=`<rect x="${ML}" y="${y}" width="${bw*it.p/100}" height="12" fill="${it.p>=50?TEAL:BEGE}" rx="3"/>`;
     s+=`<text x="${Math.min(ML+bw*it.p/100+4,W-MR-19)}" y="${y+10}" font-size="8" font-weight="700" fill="#000">p${f0(it.p)}</text>`;}
   else s+=`<text x="${ML+4}" y="${y+10}" font-size="8" fill="#666">histórico insuficiente</text>`;
 });
 return SW(s);
}
function gFL(){
  const fl=E.deep.fl,com=fl.filter(x=>x[2]!=null);
  const xa=1990,xb=2027,b=Math.max(...com.map(x=>x[2]))*1.15;
  let s=AX()+TY(ticks4(b*0.9),0,b,fTP(ticks4(b*0.9),0));
  [1990,2000,2010,2020].forEach(y=>s+=`<text x="${X(y,xa,xb)}" y="${H-MB+13}" class="xlab" text-anchor="middle">${y}</text>`);
  const bw=(W-ML-MR)/(xb-xa)*0.7;
  com.forEach(x=>{const y=Y(x[2],0,b);s+=`<rect x="${X(x[0],xa,xb)-bw/2}" y="${y}" width="${bw}" height="${H-MB-y}" fill="${NAVY}"/>`});
  const med=com.reduce((q,x)=>q+x[2],0)/com.length;
  s+=`<line x1="${ML}" y1="${Y(med,0,b)}" x2="${W-MR}" y2="${Y(med,0,b)}" stroke="#666" stroke-dasharray="4 3"/>`;
  s+=`<text x="${ML+4}" y="${Y(med,0,b)-4}" font-size="7.5" fill="#666">média ${f1(med)}%</text>`;
  const l25=fl.find(x=>x[0]===2025),l26=fl.find(x=>x[0]===2026);
  s+=`<text x="${W-MR}" y="${MT+9}" class="ytick" text-anchor="end">book jul/25: <tspan font-weight="700">${f1(l25[1])}</tspan> · jul/26: <tspan font-weight="700" fill="${TEAL}">${f1(l26[1])} Mi t</tspan></text>`;
  s+=`<text x="${W-MR}" y="${MT+21}" font-size="8" text-anchor="end" fill="#888">(safras em aberto: sem %)</text>`;
  return SW(s);
}
function gFluxoCN(){
  const nar=E.deep.nar.filter(r=>r[0]>='2024-06-01');
  const pts=nar.map(r=>({x:new Date(r[0]).getTime(),v:r[1]}));
  const ma=pts.map((p,i)=>({x:p.x,v:i>=3?(pts[i].v+pts[i-1].v+pts[i-2].v+pts[i-3].v)/4:null}));
  const mx=Math.max(...pts.map(p=>Math.abs(p.v)),1),b=nice(mx),a=-b;
  const xa=pts[0].x,xb=pts[pts.length-1].x;
  let s=`<line x1="${ML}" y1="${Y(0,a,b)}" x2="${W-MR}" y2="${Y(0,a,b)}" stroke="${PRETO}"/><line x1="${ML}" y1="${MT}" x2="${ML}" y2="${H-MB}" stroke="${PRETO}"/>`+TY([-b,0,b],a,b,f0);
  ['2024-09','2025-01','2025-09','2026-01'].forEach(dd=>{const t=new Date(dd+'-01').getTime();if(t>xa&&t<xb){const l=dd.split('-');s+=`<text x="${X(t,xa,xb)}" y="${H-MB+13}" class="xlab" text-anchor="middle">${l[1]}/${l[0].slice(2)}</text>`}});
  const bw=(W-ML-MR)/pts.length*0.72;
  pts.forEach(p=>{const y0=Y(0,a,b),y1=Y(p.v,a,b);s+=`<rect x="${X(p.x,xa,xb)-bw/2}" y="${Math.min(y0,y1)}" width="${bw}" height="${Math.abs(y0-y1)||0.5}" fill="${p.v>=0?GELO:'#e8c9c9'}"/>`});
  s+=LN(ma,a,b,xa,xb,NAVY,2.2);
  return SW(s);
}
function gSwitched(){
  const nar=E.deep.nar;
  const pts=nar.map(r=>({x:new Date(r[0]).getTime(),v:Number.isFinite(r[3])?r[3]:null,d:r[0]}));
  const mx=Math.max(...pts.filter(p=>p.v!=null).map(p=>p.v),1),b=nice(mx);
  const xa=pts[0].x,xb=pts[pts.length-1].x;
  let s=AX()+TY(ticks4(b*0.9),0,b,f0);
  ['2023','2024','2025','2026'].forEach(y=>{const t=new Date(y+'-01-01').getTime();if(t>xa&&t<xb)s+=`<text x="${X(t,xa,xb)}" y="${H-MB+13}" class="xlab" text-anchor="middle">${y}</text>`});
  const bw=(W-ML-MR)/pts.length*0.8;
  pts.forEach(p=>{if(p.v!=null&&p.v>0){const y=Y(Math.min(p.v,b),0,b);s+=`<rect x="${X(p.x,xa,xb)-bw/2}" y="${y}" width="${Math.max(bw,1)}" height="${H-MB-y}" fill="${TEAL}"/>`}});
  const acc={},noData={};nar.forEach(r=>{const d=new Date(r[0]);const my=d.getMonth()+1>=9?d.getFullYear():d.getFullYear()-1;if(Number.isFinite(r[3]))acc[my]=(acc[my]||0)+r[3];else noData[my]=(noData[my]||0)+1;});
  const tx=Object.keys(acc).sort().slice(-2).map(y=>myLbl(+y)+': '+f0(acc[y])+(noData[y]?'*':'')).join('  ·  ');
  s+=`<text x="${(ML+W-MR)/2}" y="${MT+9}" class="xlab" text-anchor="middle" font-size="7">switched por MY (mil t): ${tx}<title>* Semanas sem dado oficial não somadas (não representam zero).</title></text>`;
  return SW(s);
}
function gExec(com,wkSel){
  const d=E.dados[com],ult=E.meta.atual;
  const ys=MYS(com),cy=ys[ys.length-1],wk=wkSel==null?wkNow(com):wkSel;
  const items=d.paises.filter(p=>p!=='MUNDO'&&p!=='UNKNOWN').map(p=>{
    const r=cmAt(com,p,cy,wk);if(!r)return null;
    const cm=r[3]+r[4];
    return cm>0?{p,pct:r[3]/cm*100,cm}:null;
  }).filter(Boolean).sort((a,b)=>b.cm-a.cm).slice(0,10).sort((a,b)=>b.pct-a.pct);
  const rh=13,gap=3.2,top=18,MLL=ML+34,bw=W-MLL-40;
  let s=`<text x="${MLL}" y="${top-8}" font-size="7.5" fill="#666">embarcado ÷ commit · última leitura · top-10 por commit</text>`;
  items.forEach((it,i)=>{
    const y=top+i*(rh+gap);
    const cor=it.p==='China'?TEAL:NAVY;
    s+=`<text x="${MLL-4}" y="${y+11}" class="xlab" text-anchor="end"${it.p==='China'?' font-weight="700"':''}>${it.p}</text>`;
    s+=`<rect x="${MLL}" y="${y}" width="${bw}" height="${rh-3}" fill="#eef1f4" rx="2"/>`;
    s+=`<rect x="${MLL}" y="${y}" width="${bw*Math.min(it.pct,100)/100}" height="${rh-3}" fill="${cor}" rx="2"/>`;
    s+=`<text x="${MLL+bw+4}" y="${y+11}" font-size="8" font-weight="700" fill="#000">${f0(it.pct)}%</text>`;
  });
  return SW(s);
}
function gCohort(com,wkSel){
  const ys=MYS(com),cy=ys[ys.length-1],base=ys.slice(0,-1);
  const wm=S(com,'MUNDO');const wkRef=wkSel==null?(wm.length?wm[wm.length-1][2]:26):wkSel;
  const items=E.dados[com].paises.filter(p=>p!=='MUNDO'&&p!=='UNKNOWN').map(p=>{
    const at=(y)=>{const rr=S(com,p).filter(r=>r[1]===y&&r[2]<=wkRef);return rr.length?rr[rr.length-1][3]:null;};
    const cur=at(cy);const hist=base.map(at).filter(v=>v!=null);
    if(cur==null||hist.length<2)return null;
    const md=hist.reduce((q,v)=>q+v,0)/hist.length;
    if(md<150&&cur<150)return null;
    return {p,d:(cur-md)/Math.max(md,1)*100,cur};
  }).filter(Boolean).sort((a,b)=>b.d-a.d);
  const show=[...items.slice(0,5),...items.slice(-4)].filter((v,i,arr)=>arr.indexOf(v)===i);
  const mx=Math.max(...show.map(x=>Math.abs(x.d)),10),b=Math.min(nice(mx),300);
  const rh=13,gap=3.4,top=18,cx=ML+(W-ML-MR)/2,half=(W-ML-MR)/2-30;
  let s=`<line x1="${cx}" y1="${top-6}" x2="${cx}" y2="${top+show.length*(rh+gap)}" stroke="${PRETO}"/>`;
  s+=`<text x="${ML}" y="${top-8}" font-size="7.5" fill="#666">accum sem. ${wkRef} do MY ${myLbl(cy)} vs média das safras anteriores</text>`;
  show.forEach((it,i)=>{
    const y=top+i*(rh+gap),w2=Math.min(Math.abs(it.d),b)/b*half;
    const cor=it.d>=0?TEAL:BEGE;
    const lw=(it.p.length+String(f0(Math.abs(it.d))).length+3)*4.6;
    if(it.d>=0){s+=`<rect x="${cx}" y="${y}" width="${w2}" height="${rh-3}" fill="${cor}"/>`;
      const fit=cx+w2+4+lw<=W-2;
      s+=fit?`<text x="${cx+w2+4}" y="${y+10}" font-size="8" fill="#000">${it.p} <tspan font-weight="700">+${f0(it.d)}%</tspan></text>`
            :`<text x="${cx+w2-4}" y="${y+10}" font-size="8" text-anchor="end" fill="#fff">${it.p} <tspan font-weight="700">+${f0(it.d)}%</tspan></text>`;}
    else{s+=`<rect x="${cx-w2}" y="${y}" width="${w2}" height="${rh-3}" fill="${cor}"/>`;
      const fit=cx-w2-4-lw>=2;
      s+=fit?`<text x="${cx-w2-4}" y="${y+10}" font-size="8" text-anchor="end" fill="#000"><tspan font-weight="700">${f0(it.d)}%</tspan> ${it.p}</text>`
            :`<text x="${cx-w2+4}" y="${y+10}" font-size="8" fill="#fff"><tspan font-weight="700">${f0(it.d)}%</tspan> ${it.p}</text>`;}
  });
  return SW(s);
}


function wkNow(com){const M=S(com,'MUNDO');return M.length?M[M.length-1][2]:26;}
function weeksAvailable(com){const ys=MYS(com),cy=ys[ys.length-1];return [...new Set(S(com,'MUNDO').filter(r=>r[1]===cy).map(r=>r[2]))].sort((a,b)=>a-b);}
function cmAt(com,pais,y,wk){const rr=S(com,pais).filter(r=>r[1]===y&&r[2]<=wk);return rr.length?rr[rr.length-1]:null;}
function gNetSafra(com,pais,wkSel){
  const ys=MYS(com),wk=wkSel==null?wkNow(com):wkSel;
  const vals=ys.map(y=>{
    const a=cmAt(com,pais,y,wk),b=cmAt(com,pais,y,wk-1);
    return (a&&b&&a[2]!==b[2])?{y,v:((a[3]+a[4])-(b[3]+b[4]))/1000}:{y,v:null};
  }).filter(x=>x.v!=null);
  if(!vals.length)return SW(`<text x="${W/2}" y="${H/2}" text-anchor="middle" font-size="11" fill="#888">sem leituras pareadas</text>`);
  const mx=Math.max(...vals.map(x=>Math.abs(x.v)),0.05),b=nice(mx)*1.25,a=Math.min(0,...vals.map(x=>x.v))<0?-b:0;
  const n=vals.length,bw=(W-ML-MR)/n*0.5;
  let s=`<line x1="${ML}" y1="${Y(0,a,b)}" x2="${W-MR}" y2="${Y(0,a,b)}" stroke="${PRETO}"/><line x1="${ML}" y1="${MT}" x2="${ML}" y2="${H-MB}" stroke="${PRETO}"/>`+TY(a<0?[-b,0,b]:ticks4(b*0.85),a,b,f1);
  vals.forEach((x,i)=>{
    const cx=ML+(W-ML-MR)*(i+0.5)/n,y0=Y(0,a,b),y1=Y(x.v,a,b);
    s+=`<rect x="${cx-bw/2}" y="${Math.min(y0,y1)}" width="${bw}" height="${Math.abs(y0-y1)||1}" fill="${i===n-1?TEAL:NAVY}"/>`;
    s+=`<text x="${cx}" y="${Math.min(y0,y1)-5}" font-size="8" font-weight="700" text-anchor="middle" fill="#000">${f1(x.v)}</text>`;
    s+=`<text x="${cx}" y="${Y(0,a,b)+13}" class="xlab" text-anchor="middle">${myLbl(x.y)}</text>`;
  });
  return SW(s);
}
function gDonut(com,wkSel){
  const wk=wkSel==null?wkNow(com):wkSel,ys=MYS(com),cy=ys[ys.length-1];
  const wr=cmAt(com,'MUNDO',cy,wk); if(!wr)return SW('');
  const tot=wr[3]+wr[4];
  if(!(tot>0))return SW('');
  const tops=E.dados[com].paises.filter(p=>p!=='MUNDO'&&p!=='UNKNOWN').map(p=>{
    const r=cmAt(com,p,cy,wk);return r?{p,v:r[3]+r[4]}:null;
  }).filter(x=>x&&x.v>0).sort((a,b)=>b.v-a.v).slice(0,5);
  const ur=cmAt(com,'UNKNOWN',cy,wk);
  const segsAll=[...tops.map((x,i)=>({p:x.p,v:x.v,c:PAL6[i]})),{p:'Unknown',v:ur?ur[3]+ur[4]:0,c:'#c9b06a'}];
  segsAll.push({p:'Outros',v:Math.max(tot-segsAll.reduce((q,x)=>q+x.v,0),0),c:'#e3e7eb'});
  const segs=segsAll.filter(g=>!HID(g.p));
  const tot2=segs.reduce((q,x)=>q+x.v,0);
  if(!(tot2>0))return SW(`<text x="${W/2}" y="${H/2}" text-anchor="middle" font-size="11" fill="#888">todas as séries ocultas</text>`);
  const cx=W/2-40,cy2=(H-8)/2+4,R=74,r0=44;let ang=-Math.PI/2,s='';
  segs.forEach(g=>{
    const a2=ang+g.v/tot2*2*Math.PI,large=(a2-ang)>Math.PI?1:0;
    const x1=cx+R*Math.cos(ang),y1=cy2+R*Math.sin(ang),x2=cx+R*Math.cos(a2),y2=cy2+R*Math.sin(a2);
    const x3=cx+r0*Math.cos(a2),y3=cy2+r0*Math.sin(a2),x4=cx+r0*Math.cos(ang),y4=cy2+r0*Math.sin(ang);
    s+=`<path d="M${x1.toFixed(1)} ${y1.toFixed(1)} A${R} ${R} 0 ${large} 1 ${x2.toFixed(1)} ${y2.toFixed(1)} L${x3.toFixed(1)} ${y3.toFixed(1)} A${r0} ${r0} 0 ${large} 0 ${x4.toFixed(1)} ${y4.toFixed(1)} Z" fill="${g.c}"/>`;
    ang=a2;
  });
  s+=`<text x="${cx}" y="${cy2-2}" font-size="15" font-weight="800" text-anchor="middle" fill="#000">${f1(tot2/1000)}</text><text x="${cx}" y="${cy2+12}" font-size="8" text-anchor="middle" fill="#666">Mi t</text>`;
  segsAll.forEach((g,i)=>{
    const y=26+i*20,off=HID(g.p);
    s+=`<rect x="${W-118}" y="${y-8}" width="9" height="9" fill="${g.c}"${off?' opacity="0.35"':''}/><text x="${W-105}" y="${y}" font-size="8" ${off?'opacity="0.35" ':''}fill="#000">${g.p}</text>`;
    if(!off)s+=`<text x="${W-8}" y="${y}" font-size="8" font-weight="700" text-anchor="end" fill="#000">${f0(g.v/tot2*100)}%</text>`;
  });
  return SW(s);
}
function gRankDest(com,wkSel){
  const wk=wkSel==null?wkNow(com):wkSel,ys=MYS(com),cy=ys[ys.length-1];
  const items=E.dados[com].paises.filter(p=>p!=='MUNDO').map(p=>{
    const r=cmAt(com,p,cy,wk);return r?{p:p==='UNKNOWN'?'Unknown':p,v:(r[3]+r[4])/1000}:null;
  }).filter(x=>x&&x.v>0).sort((a,b)=>b.v-a.v).slice(0,10);
  const mx=items[0].v,rh=13,gap=3.4,top=14,MLL=ML+28,bw=W-MLL-40;
  let s='';
  items.forEach((it,i)=>{
    const y=top+i*(rh+gap),w2=it.v/mx*bw;
    const cor=it.p==='China'?TEAL:it.p==='Unknown'?'#c9b06a':NAVY;
    s+=`<text x="${MLL-4}" y="${y+11}" class="xlab" text-anchor="end"${it.p==='China'?' font-weight="700"':''}>${it.p}</text>`;
    s+=`<rect x="${MLL}" y="${y}" width="${w2}" height="${rh-3}" fill="${cor}" rx="2"/>`;
    s+=`<text x="${MLL+w2+4}" y="${y+11}" font-size="8" font-weight="700" fill="#000">${f1(it.v)}</text>`;
  });
  return SW(s);
}
function gAreaMY(com,pais,myY){
  const ys=MYS(com),cy=(myY!=null&&ys.includes(myY))?myY:ys[ys.length-1];
  const rows=S(com,pais).filter(r=>r[1]===cy);
  if(rows.length<3)return SW(`<text x="${W/2}" y="${H/2}" text-anchor="middle" font-size="11" fill="#888">série curta</text>`);
  const hA=HID('embarcado'),hO=HID('a embarcar');
  if(hA&&hO)return SW(`<text x="${W/2}" y="${H/2}" text-anchor="middle" font-size="11" fill="#888">todas as séries ocultas</text>`);
  const pts=rows.map(r=>({x:r[2],ac:r[3]/1000,ct:r[4]/1000,cm:(r[3]+r[4])/1000}));
  const top=p=>hA?p.ct:(hO?p.ac:p.cm);
  const mx=Math.max(...pts.map(top));
  if(!(mx>0))return SW(`<text x="${W/2}" y="${H/2}" text-anchor="middle" font-size="11" fill="#888">sem movimento no MY</text>`);
  const tk=ticks4(mx),b=tk[tk.length-1]*1.08;
  let s=AX()+TY(tk,0,b,f0)+TXM(com);
  const base=pts.slice().reverse().map(p=>X(p.x,1,53).toFixed(1)+','+Y(0,0,b).toFixed(1)).join(' ');
  if(!hA&&!hO){
    const up=pts.map(p=>X(p.x,1,53).toFixed(1)+','+Y(p.cm,0,b).toFixed(1)).join(' ');
    const md=pts.map(p=>X(p.x,1,53).toFixed(1)+','+Y(p.ac,0,b).toFixed(1)).join(' ');
    const mdRev=pts.slice().reverse().map(p=>X(p.x,1,53).toFixed(1)+','+Y(p.ac,0,b).toFixed(1)).join(' ');
    s+=`<polygon points="${up} ${mdRev}" fill="${TEAL}" opacity="0.45"/>`;
    s+=`<polygon points="${md} ${base}" fill="${NAVY}" opacity="0.9"/>`;
  }else if(hO){
    const md=pts.map(p=>X(p.x,1,53).toFixed(1)+','+Y(p.ac,0,b).toFixed(1)).join(' ');
    s+=`<polygon points="${md} ${base}" fill="${NAVY}" opacity="0.9"/>`;
  }else{
    const ct=pts.map(p=>X(p.x,1,53).toFixed(1)+','+Y(p.ct,0,b).toFixed(1)).join(' ');
    s+=`<polygon points="${ct} ${base}" fill="${TEAL}" opacity="0.45"/>`;
  }
  const lp=pts[pts.length-1];
  return SW(s);
}

function gGrupo(com,pais,wkSel){
  const ys=MYS(com),wk=wkSel==null?wkNow(com):wkSel;
  const vals=ys.map(y=>{const r=cmAt(com,pais,y,wk);return r?{y,ac:r[3]/1000,ou:r[4]/1000}:null;}).filter(Boolean);
  if(!vals.length)return SW('');
  const hA=HID('embarcado'),hO=HID('a embarcar');
  if(hA&&hO)return SW(`<text x="${W/2}" y="${H/2}" text-anchor="middle" font-size="11" fill="#888">todas as séries ocultas</text>`);
  const mx=Math.max(...vals.map(x=>hA?0:x.ac),...vals.map(x=>hO?0:x.ou));
  if(!(mx>0))return SW(`<text x="${W/2}" y="${H/2}" text-anchor="middle" font-size="11" fill="#888">sem movimento no MY</text>`);
  const tk=ticks4(mx),b=tk[tk.length-1]*1.15;
  const n=vals.length,gw=(W-ML-MR)/n,bw=gw*0.26;
  let s=AX()+TY(tk,0,b,f0);
  vals.forEach((x,i)=>{
    const cx=ML+gw*(i+0.5);
    const y1=Y(x.ac,0,b),y2=Y(x.ou,0,b);
    if(!hA&&!hO){
      s+=`<rect x="${cx-bw-2}" y="${y1}" width="${bw}" height="${H-MB-y1}" fill="${NAVY}"/>`;
      s+=`<rect x="${cx+2}" y="${y2}" width="${bw}" height="${H-MB-y2}" fill="${TEAL}"/>`;
      s+=`<text x="${cx-bw/2-2}" y="${y1-4}" font-size="8" font-weight="700" text-anchor="middle" fill="#000">${f1(x.ac)}</text>`;
      s+=`<text x="${cx+bw/2+2}" y="${y2-4}" font-size="8" font-weight="700" text-anchor="middle" fill="#000">${f1(x.ou)}</text>`;
    }else if(!hA){
      s+=`<rect x="${cx-bw/2}" y="${y1}" width="${bw}" height="${H-MB-y1}" fill="${NAVY}"/>`;
      s+=`<text x="${cx}" y="${y1-4}" font-size="8" font-weight="700" text-anchor="middle" fill="#000">${f1(x.ac)}</text>`;
    }else{
      s+=`<rect x="${cx-bw/2}" y="${y2}" width="${bw}" height="${H-MB-y2}" fill="${TEAL}"/>`;
      s+=`<text x="${cx}" y="${y2-4}" font-size="8" font-weight="700" text-anchor="middle" fill="#000">${f1(x.ou)}</text>`;
    }
    s+=`<text x="${cx}" y="${H-MB+13}" class="xlab" text-anchor="middle">${myLbl(x.y)}</text>`;
  });
  return SW(s);
}

function gDumb(com,wkSel){
  const ys=MYS(com),cy=ys[ys.length-1],py=ys[ys.length-2],wk=wkSel==null?wkNow(com):wkSel;
  const items=E.dados[com].paises.filter(p=>p!=='MUNDO'&&p!=='UNKNOWN').map(p=>{
    const a=cmAt(com,p,cy,wk),b=cmAt(com,p,py,wk);
    return (a||b)?{p,cur:a?a[3]/1000:0,old:b?b[3]/1000:0}:null;
  }).filter(Boolean).sort((x,y)=>(y.cur+y.old)-(x.cur+x.old)).slice(0,8);
  const mx=Math.max(...items.map(x=>Math.max(x.cur,x.old)));
  if(!(mx>0))return SW(`<text x="${W/2}" y="${H/2}" text-anchor="middle" font-size="11" fill="#888">sem movimento no MY</text>`);
  const rh=19,top=18,x0=ML+52,x1=W-MR-34;
  const XX=v=>x0+v/mx*(x1-x0);
  let s='';
  items.forEach((it,i)=>{
    const y=top+8+i*rh;
    s+=`<text x="${x0-8}" y="${y+3}" class="xlab" text-anchor="end"${it.p==='China'?' font-weight="700"':''}>${it.p}</text>`;
    s+=`<line x1="${XX(Math.min(it.old,it.cur))}" y1="${y}" x2="${XX(Math.max(it.old,it.cur))}" y2="${y}" stroke="#c7ced6" stroke-width="2.5"/>`;
    s+=`<circle cx="${XX(it.old)}" cy="${y}" r="4" fill="${CINZA}"/>`;
    s+=`<circle cx="${XX(it.cur)}" cy="${y}" r="4.5" fill="${it.cur>=it.old?TEAL:NAVY}"/>`;
    const right=it.cur>=it.old||XX(it.cur)-8-26<x0;
    s+=`<text x="${right?XX(Math.max(it.cur,it.old))+8:XX(it.cur)-8}" y="${y+3}" font-size="8" font-weight="700" text-anchor="${right?'start':'end'}" fill="#000">${f1(it.cur)}</text>`;
  });
  return SW(s);
}
function gWexpBars(com,pais,myY){
  const ys=MYS(com),cy=(myY!=null&&ys.includes(myY))?myY:ys[ys.length-1];
  const rows=S(com,pais).filter(r=>r[1]===cy);
  if(rows.length<3)return SW(`<text x="${W/2}" y="${H/2}" text-anchor="middle" font-size="11" fill="#888">série curta</text>`);
  const hB=HID('embarques/sem'),hM=HID('média 4 sem');
  if(hB&&hM)return SW(`<text x="${W/2}" y="${H/2}" text-anchor="middle" font-size="11" fill="#888">todas as séries ocultas</text>`);
  const pts=[];for(let i=1;i<rows.length;i++){const dv=(rows[i][3]-rows[i-1][3])/Math.max(rows[i][2]-rows[i-1][2],1);pts.push({x:rows[i][2],v:Math.max(dv,0)});}
  const ma=pts.map((p,i)=>{const a=pts.slice(Math.max(0,i-3),i+1);return {x:p.x,v:a.reduce((q,z)=>q+z.v,0)/a.length};});
  const mx=Math.max(...(!hB?pts.map(p=>p.v):[0]),...(!hM?ma.map(p=>p.v):[0]));
  if(!(mx>0))return SW(`<text x="${W/2}" y="${H/2}" text-anchor="middle" font-size="11" fill="#888">sem movimento no MY</text>`);
  const tk=ticks4(mx),b=tk[tk.length-1]*1.15;
  let s=AX()+TY(tk,0,b,f0)+TXM(com);
  const bw=(W-ML-MR)/53*0.72;
  if(!hB){
    let pk=pts[0];
    pts.forEach(p=>{const y=Y(p.v,0,b);s+=`<rect x="${X(p.x,1,53)-bw/2}" y="${y}" width="${bw}" height="${H-MB-y}" fill="${NAVY}"/>`;if(p.v>pk.v)pk=p;});
    s+=`<text x="${X(pk.x,1,53)}" y="${Y(pk.v,0,b)-5}" font-size="8" font-weight="700" text-anchor="middle" fill="${TEAL}">${f0(pk.v)}</text>`;
  }
  if(!hM){
    const ln=ma.map(p=>X(p.x,1,53).toFixed(1)+','+Y(p.v,0,b).toFixed(1)).join(' ');
    s+=`<polyline points="${ln}" fill="none" stroke="#fff" stroke-width="3.4" stroke-linejoin="round" opacity="0.85"/>`;
    s+=`<polyline points="${ln}" fill="none" stroke="${NAVY}" stroke-width="1.6" stroke-linejoin="round"/>`;
    if(hB){const lp=ma[ma.length-1];
      s+=`<text x="${X(lp.x,1,53)}" y="${Y(lp.v,0,b)-5}" font-size="8" font-weight="700" text-anchor="middle" fill="#000">${f0(lp.v)}</text>`;}
  }
  return SW(s);
}

function gHeat(com,wkSel){
  const ys=MYS(com),wk=wkSel==null?wkNow(com):wkSel;
  const tops=E.dados[com].paises.filter(p=>p!=='MUNDO'&&p!=='UNKNOWN').slice(0,8);
  const grid=tops.map(p=>ys.map(y=>{
    const r=cmAt(com,p,y,wk),wr=cmAt(com,'MUNDO',y,wk);
    return (r&&wr&&wr[3]>0)?r[3]/wr[3]*100:null;
  }));
  const mx=Math.max(...grid.flat().filter(v=>v!=null),1);
  const gridW=Math.min(ys.length*62,W-ML-MR-16),x0=Math.max(ML+28,(W-gridW)/2);
  const cw=gridW/ys.length,rh=(H-30-14)/tops.length;
  let s='';
  ys.forEach((y,j)=>s+=`<text x="${x0+cw*(j+0.5)}" y="${24}" class="xlab" text-anchor="middle">${myLbl(y)}</text>`);
  tops.forEach((p,i)=>{
    s+=`<text x="${x0-6}" y="${30+rh*(i+0.62)}" class="xlab" text-anchor="end"${p==='China'?' font-weight="700"':''}>${p}</text>`;
    ys.forEach((y,j)=>{
      const v=grid[i][j];
      const t=v==null?0:v/mx;
      const cor=v==null?'#f3f4f6':`rgb(${Math.round(255-(255-13)*t)},${Math.round(255-(255-148)*t)},${Math.round(255-(255-136)*t)})`;
      s+=`<rect x="${x0+cw*j+1.5}" y="${30+rh*i+1.5}" width="${cw-3}" height="${rh-3}" fill="${cor}" rx="2"/>`;
      if(v!=null)s+=`<text x="${x0+cw*(j+0.5)}" y="${30+rh*(i+0.66)}" font-size="8" font-weight="700" text-anchor="middle" fill="${t>0.55?'#fff':'#123'}">${f0(v)}</text>`;
    });
  });
  return SW(s);
}

function heatCommitHeading(el,com,wk,mode){
  const t=el.querySelector('.p-card-t'),sub=el.querySelector('.p-card-s');
  const en=document.documentElement.dataset.lang==='en';
  const nm={soja:'Soybeans',milho:'Corn',trigo:'Wheat',farelo:'Soybean meal',oleo:'Soybean oil'};
  if(t)t.textContent=en?(mode==='volume'?`U.S. ${nm[com]} - Commitments by destination`:`U.S. ${nm[com]} - Commitment share by destination`):(mode==='volume'?`${E.nome[com]} EUA - Commitment por destino`:`${E.nome[com]} EUA - Share do commitment por destino`);
  if(sub)sub.textContent=en?(mode==='volume'?`In Mmt · week (${wk}) · shipped + outstanding`:`In % of world commitments · week (${wk})`):(mode==='volume'?`Em Mi t · semana (${wk}) · embarcado + outstanding`:`Em % do commitment mundial · semana (${wk})`);
}
function heatCommitGrid(com,wkSel,metric){
  const ys=MYS(com),wk=wkSel==null?wkNow(com):wkSel,volume=metric==='volume';
  const tops=E.dados[com].paises.filter(p=>p!=='MUNDO'&&p!=='UNKNOWN').slice(0,8);
  const vals=tops.map(p=>ys.map(y=>{
    const r=cmAt(com,p,y,wk),wr=cmAt(com,'MUNDO',y,wk);
    if(!wr)return null;
    const pv=r?r[3]+r[4]:0,tv=wr[3]+wr[4];
    return volume?pv/1000:(tv>0?pv/tv*100:null);
  }));
  return {ys,wk,tops,vals,volume};
}
function gHeatCommit(com,wkSel,metric){
  const {ys,tops,vals,volume}=heatCommitGrid(com,wkSel,metric);
  const mx=Math.max(...vals.flat().filter(Number.isFinite),0.00001);
  // Posição e84 estava ~17px à esquerda no card. Equilibra nomes + células,
  // deslocando somente o heatmap de commitment, sem afetar os demais cards.
  const gridW=Math.min(ys.length*62,W-ML-MR-16),x0=Math.max(ML+42,(W-gridW)/2+16);
  const cw=gridW/ys.length,rh=(H-30-14)/tops.length;
  let out='';
  const fmt=v=>volume?(v>=1?f1(v):new Intl.NumberFormat('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2}).format(v)):f0(v);
  ys.forEach((y,j)=>out+=`<text x="${x0+cw*(j+0.5)}" y="24" class="xlab" text-anchor="middle">${myLbl(y)}</text>`);
  tops.forEach((p,i)=>{
    out+=`<text x="${x0-6}" y="${30+rh*(i+0.62)}" class="xlab" text-anchor="end"${p==='China'?' font-weight="700"':''}>${p}</text>`;
    ys.forEach((y,j)=>{
      const v=vals[i][j],t=v==null?0:v/mx;
      const cor=v==null?'#f3f4f6':`rgb(${Math.round(255-(255-13)*t)},${Math.round(255-(255-148)*t)},${Math.round(255-(255-136)*t)})`;
      out+=`<rect x="${x0+cw*j+1.5}" y="${30+rh*i+1.5}" width="${cw-3}" height="${rh-3}" fill="${cor}" rx="2"/>`;
      if(v!=null)out+=`<text x="${x0+cw*(j+0.5)}" y="${30+rh*(i+0.66)}" font-size="8" font-weight="700" text-anchor="middle" fill="${t>0.55?'#fff':'#123'}">${fmt(v)}</text>`;
    });
  });
  return SW(out).replace('<svg ','<svg data-heatcommit-v="e85" ');
}

function gMatriz(com,wkSel){
  const ys=MYS(com),wk=wkSel==null?wkNow(com):wkSel;
  const dests=E.dados[com].paises.filter(p=>p!=='MUNDO').slice(0,9);
  const grid=dests.map(p=>ys.map(y=>{const rr=cmAt(com,p,y,wk);return rr?rr[3]/1000:0;}));
  const totC=ys.map(y=>{const rr=cmAt(com,'MUNDO',y,wk);return rr?rr[3]/1000:0;});
  const mx=Math.max(...grid.flat(),0.001);
  const x0=ML+62,cw=(W-x0-MR)/ys.length,top=26,rh=(H-top-26)/dests.length;
  let s='';
  ys.forEach((y,j)=>s+=`<rect x="${x0+cw*j}" y="${top-15}" width="${cw-2}" height="14" fill="${NAVY}"/><text x="${x0+cw*(j+0.5)}" y="${top-4}" font-size="9" font-weight="700" text-anchor="middle" fill="#fff">${myLbl(y)}</text>`);
  dests.forEach((p,i)=>{
    const y=top+rh*i;
    s+=`<text x="${x0-6}" y="${y+rh*0.68}" class="xlab" text-anchor="end"${p==='China'?' font-weight="700"':''}>${p==='UNKNOWN'?'Unknown':p}</text>`;
    ys.forEach((yy,j)=>{
      const v=grid[i][j],w2=v/mx*(cw-30);
      s+=`<rect x="${x0+cw*j}" y="${y}" width="${cw-2}" height="${rh-2}" fill="${i%2?'#f6f8fa':'#fff'}"/>`;
      if(v>0)s+=`<rect x="${x0+cw*j+2}" y="${y+3}" width="${Math.max(w2,1)}" height="${rh-8}" fill="${p==='China'?TEAL:'#b9c6d4'}"/>`;
      s+=`<text x="${x0+cw*(j+1)-4}" y="${y+rh*0.68}" font-size="8" text-anchor="end" fill="#0F2638">${v>=10?f0(v):f1(v)}</text>`;
    });
  });
  const yT=top+rh*dests.length;
  s+=`<rect x="${x0}" y="${yT}" width="${cw*ys.length-2}" height="16" fill="${NAVY}"/>`;
  s+=`<text x="${x0-6}" y="${yT+12}" font-size="9" font-weight="700" text-anchor="end" fill="#000">Total</text>`;
  ys.forEach((yy,j)=>s+=`<text x="${x0+cw*(j+1)-4}" y="${yT+12}" font-size="9" font-weight="700" text-anchor="end" fill="#fff">${f0(totC[j])}</text>`);
  return SW(s);
}
function gSankey(com,wkSel){
  const ysAll=MYS(com);
  const wk=wkSel==null?wkNow(com):wkSel;
  const ys=ysAll.filter(y=>!HID(myLbl(y)));
  if(!ys.length)return SW(`<text x="${W/2}" y="${H/2}" text-anchor="middle" font-size="11" fill="#888">todas as séries ocultas</text>`);
  const dests=E.dados[com].paises.filter(p=>p!=='MUNDO'&&p!=='UNKNOWN').slice(0,6);
  const flow={};
  ys.forEach(y=>{
    const row={};let known=0;
    dests.forEach(p=>{const rr=cmAt(com,p,y,wk);const v=rr?rr[3]:0;row[p]=v;known+=v;});
    const wr=cmAt(com,'MUNDO',y,wk);const tot=wr?wr[3]:0;
    row['Outros']=Math.max(tot-known,0);row.__tot=Math.max(tot,known);flow[y]=row;
  });
  const nodesR=[...dests,'Outros'];
  const totAll=ys.reduce((q,y)=>q+flow[y].__tot,0);
  if(!(totAll>0))return SW('');
  const nHid=ysAll.length-ys.length;
  const x0=ML+40,x1=W-MR-58;
  const hAv=H-MT-MB-((ysAll.length-1)*4)-(nHid*3),hAvR=H-MT-MB-((nodesR.length-1)*4);
  let yL=MT;const posL={};
  ysAll.forEach(y=>{
    if(HID(myLbl(y))){posL[y]={y:yL,h:3,cur:yL,off:1};yL+=3+4;}
    else{const hh=flow[y].__tot/totAll*hAv;posL[y]={y:yL,h:hh,cur:yL};yL+=hh+4;}
  });
  const sumR={};nodesR.forEach(p=>sumR[p]=ys.reduce((q,y)=>q+flow[y][p],0));
  let yR=MT;const posR={};
  nodesR.forEach(p=>{const hh=sumR[p]/totAll*hAvR;posR[p]={y:yR,h:hh,cur:yR};yR+=hh+4;});
  const CORD={};dests.forEach((p,i)=>CORD[p]=PAL6[i]);CORD['Outros']='#d4d9de';
  let links='',nodes='';
  ys.forEach(y=>{
    nodesR.forEach(p=>{
      const v=flow[y][p];if(v<=0)return;
      const hh=v/totAll*Math.min(hAv,hAvR);
      const sy=posL[y].cur, ty=posR[p].cur;
      posL[y].cur+=hh; posR[p].cur+=hh;
      const mx1=x0+(x1-x0)*0.45,mx2=x0+(x1-x0)*0.55;
      links+=`<path d="M${x0} ${sy} C${mx1} ${sy} ${mx2} ${ty} ${x1} ${ty} L${x1} ${(ty+hh)} C${mx2} ${(ty+hh)} ${mx1} ${(sy+hh)} ${x0} ${(sy+hh)} Z" fill="${CORD[p]}" opacity="0.42"/>`;
    });
  });
  ysAll.forEach(y=>{
    const off=posL[y].off;
    nodes+=`<rect x="${x0-8}" y="${posL[y].y}" width="8" height="${Math.max(posL[y].h,1)}" fill="${NAVY}"${off?' opacity="0.35"':''}/><text x="${x0-12}" y="${posL[y].y+posL[y].h/2+3}" font-size="8" font-weight="700" text-anchor="end" ${off?'opacity="0.35" ':''}fill="#000">${myLbl(y)}</text>`;
  });
  nodesR.forEach(p=>{if(!(sumR[p]>0))return;
    nodes+=`<rect x="${x1}" y="${posR[p].y}" width="8" height="${Math.max(posR[p].h,1)}" fill="${CORD[p]}"/><text x="${x1+12}" y="${posR[p].y+posR[p].h/2+3}" font-size="8" fill="#000"${p==='China'?' font-weight="700"':''}>${p}</text>`;
  });
  return SW(links+nodes);
}

function gTriplo(com,wkSel){
  const ys=MYS(com),cy=ys[ys.length-1],py=ys[ys.length-2];
  const wk=wkSel==null?wkNow(com):wkSel;
  const items=E.dados[com].paises.filter(p=>p!=='MUNDO').slice(0,8).map(p=>{
    const a=cmAt(com,p,cy,wk);
    const b=cmAt(com,p,cy,wk-1);
    const c=cmAt(com,p,py,wk);
    return {p:p==='UNKNOWN'?'Unknown':p,cur:a?(a[3]+a[4])/1000:0,lw:b?(b[3]+b[4])/1000:0,ly:c?(c[3]+c[4])/1000:0};
  });
  const mx=Math.max(...items.map(x=>Math.max(x.cur,x.lw,x.ly)),0.001);
  const tk=ticks4(mx),b=tk[tk.length-1]*1.1;
  const n=items.length,gw=(W-ML-MR)/n,bw=Math.min(gw*0.2,9);
  let s=AX()+TY(tk,0,b,f0);
  items.forEach((x,i)=>{
    const cx=ML+gw*(i+0.5);
    [[x.ly,'#c9b08a'],[x.lw,'#8fa3b8'],[x.cur,NAVY]].forEach(([v,c],j)=>{
      const y=Y(v,0,b);s+=`<rect x="${cx+(j-1.5)*bw+1}" y="${y}" width="${bw-1}" height="${H-MB-y}" fill="${c}"/>`;
    });
    s+=`<text x="${cx}" y="${Y(x.cur,0,b)-4}" font-size="8" font-weight="700" text-anchor="middle" fill="#000">${x.cur>=10?f0(x.cur):f1(x.cur)}</text>`;
    s+=`<text x="${cx}" y="${H-MB+12}" class="xlab" text-anchor="middle">${x.p.length>9?x.p.slice(0,8)+'.':x.p}</text>`;
  });
  
  
  
  return SW(s);
}
function gMensal(com,pais){
  const ys=MYS(com),m0=MYM[com];
  let mx=0;
  const series=ys.map(y=>{
    const rows=S(com,pais).filter(r=>r[1]===y);
    const mes={};
    rows.forEach(r=>{const d=new Date(r[0]);const mi=(d.getMonth()+12-(m0-1))%12;if(!(mi in mes)||r[2]>mes[mi].wk)mes[mi]={ac:r[3],wk:r[2]};});
    const ks=Object.keys(mes).map(Number).sort((a,b2)=>a-b2);
    const pts=[];let prev=0,first=true;
    ks.forEach(k=>{const v=(mes[k].ac-prev)/1000;prev=mes[k].ac;
      if(first){first=false;if(k>0)return;}
      pts.push({x:k,v:Math.max(v,0)});});
    pts.forEach(p=>{if(p.v>mx)mx=p.v});
    return {y,pts};
  }).filter(q=>q.pts.length>1).filter(q=>!HID(myLbl(q.y)));
  mx=0;series.forEach(q=>q.pts.forEach(p=>{if(p.v>mx)mx=p.v}));
  if(!(mx>0))return SW(`<text x="${W/2}" y="${H/2}" text-anchor="middle" font-size="11" fill="#888">sem movimento</text>`);
  const tk=ticks4(mx),b=tk[tk.length-1]*1.1;
  let s=AX()+TY(tk,0,b,f0);
  for(let i=0;i<12;i++)s+=`<text x="${X(i,-0.4,11.4)}" y="${H-MB+13}" class="xlab" text-anchor="middle">${MESES[(m0-1+i)%12]}</text>`;
  series.forEach((q,i)=>{
    const ii=ys.indexOf(q.y);const cor=LADDER[ii+LADDER.length-ys.length]||NAVY;
    s+=LN(q.pts.map(p=>({x:p.x,v:p.v})),0,b,-0.4,11.4,cor,q.y===ys[ys.length-1]?2.4:1.4);
    q.pts.forEach(p=>s+=`<circle cx="${X(p.x,-0.4,11.4)}" cy="${Y(p.v,0,b)}" r="2.4" fill="${cor}"/>`);
  });
  const lq=series[series.length-1];
  
  return SW(s);
}

/*BUILD-END*/

/* ═══════════ CAMADA PRO (portada do HTML-mãe · ECharts via CDN) ═══════════ */
const NF=(v,d)=>v==null||isNaN(v)?'':new Intl.NumberFormat('pt-BR',{minimumFractionDigits:d==null?1:d,maximumFractionDigits:d==null?1:d}).format(v);
let ECH_P=null;
function ensureECharts(){
  if(window.echarts) return Promise.resolve();
  if(ECH_P) return ECH_P;
  const urls=['https://cdn.jsdelivr.net/npm/echarts@5.5.1/dist/echarts.min.js',
              'https://unpkg.com/echarts@5.5.1/dist/echarts.min.js'];
  ECH_P=urls.reduce((p,u)=>p.catch(()=>new Promise((res,rej)=>{
    const s=document.createElement('script');s.src=u;s.onload=res;s.onerror=()=>rej(new Error('cdn'));
    setTimeout(()=>rej(new Error('timeout')),7000);document.head.appendChild(s);
  })),Promise.reject()).catch(e=>{ECH_P=null;throw e;});
  return ECH_P;
}
const ECHM=new Map();
const FONT="'Arial Nova Cond','Arial Nova Condensed','Arial Narrow',Arial,sans-serif";
const ICO_FULL='path://M3 3h7v2H5v5H3V3zm18 0v7h-2V5h-5V3h7zM3 21v-7h2v5h5v2H3zm18 0h-7v-2h5v-5h2v7z';
const ICO_CSV='path://M4 2h10l6 6v14H4V2zm10 1.5V8h4.5L14 3.5zM7 12h2v6H7v-6zm4-2h2v8h-2v-8zm4 3h2v5h-2v-5z';
function genCSV(sp,id){
  let head=[],rows=[];
  const S2=sp.series||[];
  if(sp.kind==='line'||sp.kind==='combo'||(sp.kind==='bars'&&!sp.stacked)||sp.kind==='hbars'||(sp.kind==='bars'&&sp.stacked)){
    head=['x',...S2.map(s=>s.n)];
    sp.x.forEach((lb,i)=>rows.push([lb,...S2.map(s=>s.v[i]??'')]));
  } else if(sp.kind==='tline'||sp.kind==='tstack'){
    head=['data',...S2.map(s=>s.n)];
    const base=S2[0].tv;
    base.forEach((p,i)=>rows.push([p[0],...S2.map(s=>s.tv[i]?s.tv[i][1]:'')]));
  } else if(sp.kind==='tbars'){
    head=['data','delta'];sp.tv.forEach(p=>rows.push([p[0],p[1]]));
  } else if(sp.kind==='donut'){
    head=['item','valor'];sp.items.forEach(it=>rows.push([it.n,it.v]));
  } else if(sp.kind==='heat'){
    head=['destino',...sp.cols];sp.rows.forEach((r,ri)=>rows.push([r,...sp.vals[ri]]));
  } else if(sp.kind==='dumb'){
    head=['destino',sp.la,sp.lb,'delta'];sp.cats.forEach((c,i)=>rows.push([c,sp.a[i],sp.b[i],+(sp.a[i]-sp.b[i]).toFixed(3)]));
  } else return;
  const csv='\uFEFF'+head.join(';')+'\n'+rows.map(r=>r.map(v=>typeof v==='number'?String(v).replace('.',','):v).join(';')).join('\n');
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));
  a.download=id+'.csv';a.click();
}
function buildOption(sp,card,id,big){
  const vf=v=>NF(v,sp.fmt)+(sp.unit||'');
  const fs=big?12:9.5, fsAx=big?11:8.5;
  const FEAT={
    dataZoom:{yAxisIndex:'none',title:{zoom:'zoom por seleção',back:'desfazer zoom'}},
    magicType:{type:['line','bar'],title:{line:'linha',bar:'barra'}},
    restore:{title:'restaurar'},
    dataView:{readOnly:true,title:'dados',lang:['Dados da série','fechar','atualizar'],textareaBorderColor:'#D1D5DB',buttonColor:'#0D9488'},
    saveAsImage:{title:'salvar PNG',name:id,pixelRatio:2},
    myCSV:{show:true,title:'baixar CSV',icon:ICO_CSV,onclick:()=>genCSV(sp,id)}
  };
  if(!big) FEAT.myFull={show:true,title:'tela cheia',icon:ICO_FULL,onclick:()=>openDynModal(card,id)};
  const base={
    textStyle:{fontFamily:FONT,color:'#000'},animationDuration:250,
    tooltip:{trigger:'axis',confine:true,
      axisPointer:{type:'cross',label:{backgroundColor:'#0F2638',fontSize:fsAx},crossStyle:{color:'#94A3B8'}},
      backgroundColor:'#0F2638',borderWidth:0,textStyle:{color:'#fff',fontSize:big?12:10.5,fontFamily:FONT},valueFormatter:vf},
    legend:Object.assign({top:0,left:0,itemWidth:11,itemHeight:8,icon:'roundRect',textStyle:{fontSize:fs,fontFamily:FONT,color:'#000'}},(card&&card._hidden&&card._hidden.size)?{selected:Object.fromEntries([...card._hidden].map(n=>[n,false]))}:{}),
    grid:{left:big?56:40,right:big?24:14,top:big?40:26,bottom:big?64:40,containLabel:false},
    toolbox:{right:0,top:0,itemSize:big?16:11,itemGap:big?9:5,feature:FEAT},
    axisPointer:{link:[{xAxisIndex:'all'}]}
  };
  const yAxis={type:'value',axisLabel:{fontSize:fsAx,fontFamily:FONT,color:'#000',formatter:v=>NF(v,0)},
    axisLine:{show:true,lineStyle:{color:'#000'}},splitLine:{show:false}};
  const catX=x=>({type:'category',data:x,axisLabel:{fontSize:fsAx,fontFamily:FONT,color:'#000'},
    axisLine:{lineStyle:{color:'#000'}},axisTick:{alignWithLabel:true}});
  const dz=on=>on?[{type:'inside',xAxisIndex:0},{type:'slider',xAxisIndex:0,height:big?20:13,bottom:big?8:3,
    borderColor:'#D1D5DB',fillerColor:'rgba(13,148,136,.18)',handleStyle:{color:'#0D9488'},
    textStyle:{fontSize:fsAx-1,fontFamily:FONT}}]:[];
  if(sp.kind==='sankey'){
    const CORD={};sp.dests.forEach((p,i)=>CORD[p]=p==='Outros'?'#d4d9de':PAL6D[i]);
    const mkSer=off=>{
      const L2=sp.safras.filter(n=>!off.has(n)).map(n=>({name:n,depth:0,itemStyle:{color:NAVY}}));
      const lk=sp.links.filter(l=>!off.has(l.source));
      const act=new Set(lk.map(l=>l.target));
      const R2=sp.dests.filter(p=>act.has(p)).map(p=>({name:p,depth:1,itemStyle:{color:CORD[p]}}));
      return {type:'sankey',nodeAlign:'justify',left:big?46:26,right:big?96:72,top:big?40:30,bottom:big?16:8,
        nodeWidth:10,nodeGap:big?8:6,draggable:false,
        emphasis:{focus:'adjacency'},
        lineStyle:{color:'gradient',opacity:0.42,curveness:0.5},
        label:{fontFamily:FONT,fontSize:fsAx,color:'#000'},
        data:L2.concat(R2),links:lk};
    };
    const off0=(card&&card._hidden)?new Set([...card._hidden]):new Set();
    const optS={textStyle:{fontFamily:FONT,color:'#000'},animationDuration:250,
      tooltip:{trigger:'item',confine:true,backgroundColor:'#0F2638',borderWidth:0,
        textStyle:{color:'#fff',fontSize:big?12:10.5,fontFamily:FONT},
        formatter:p=>p.dataType==='edge'
          ?p.data.source+' \u2192 '+p.data.target+': <b>'+NF(p.data.value,0)+' mil t</b>'
          :p.name+': <b>'+NF(p.value,0)+' mil t</b>'},
      legend:{top:0,left:0,itemWidth:11,itemHeight:8,icon:'roundRect',
        textStyle:{fontSize:fs,fontFamily:FONT,color:'#000'},
        data:sp.safras.map(n=>({name:n,itemStyle:{color:NAVY}})),
        selected:Object.fromEntries(sp.safras.map(n=>[n,!off0.has(n)]))},
      toolbox:{right:0,top:0,itemSize:big?16:11,itemGap:big?9:5,
        feature:Object.assign({restore:FEAT.restore,saveAsImage:FEAT.saveAsImage},big?{}:{myFull:FEAT.myFull})},
      series:[mkSer(off0)]};
    optS.__sankeyRefilter=mkSer;
    return optS;
  }
  const mk=(single)=>single?{markPoint:{data:[{type:'max',name:'máx'},{type:'min',name:'mín'}],symbolSize:big?46:36,
      label:{fontSize:big?10:8,fontFamily:FONT,formatter:p=>NF(p.value,sp.fmt)},itemStyle:{color:'#0F2638'}},
    markLine:{data:[{type:'average',name:'média'}],symbol:'none',
      label:{fontSize:fsAx,fontFamily:FONT,formatter:p=>'média '+NF(p.value,sp.fmt)},lineStyle:{type:'dashed',color:'#94A3B8'}}}:{};
  if(sp.kind==='line'){
    return {...base,xAxis:catX(sp.x),yAxis:{...yAxis,min:sp.ymin,max:sp.ymax},dataZoom:dz(sp.x.length>20),
      series:sp.series.map(s=>({name:s.n,type:'line',data:s.v,color:s.c,symbol:'circle',symbolSize:sp.dots?4:0,
        lineStyle:{width:2},connectNulls:true,...(sp.series.length===1?mk(true):{})}))};
  }
  if(sp.kind==='tline'){
    const cats=sp.series[0].tv.map(p=>p[0]);
    const opt={...base,xAxis:catX(cats),yAxis,dataZoom:dz(true),
      series:sp.series.map((s,i)=>({name:s.n,type:'line',data:s.tv.map(p=>p[1]),color:s.c,symbol:'none',
        lineStyle:{width:i===0?2.2:1.6},sampling:'lttb',...(sp.series.length===1?mk(true):{})}))};
    (sp.ref||[]).forEach(r=>{opt.series[0].markLine=opt.series[0].markLine||{data:[],symbol:'none',lineStyle:{type:'dashed'}};
      opt.series[0].markLine.data.push({yAxis:r.y,name:r.n||'',lineStyle:{color:r.c||'#B5963E'},
        label:{formatter:r.n||String(r.y),fontSize:fsAx,fontFamily:FONT}});});
    opt.xAxis.axisLabel.formatter=v=>v.slice(2,7);
    return opt;
  }
  if(sp.kind==='tstack'){
    const cats=sp.series[0].tv.map(p=>p[0]);
    return {...base,xAxis:{...catX(cats),axisLabel:{...catX(cats).axisLabel,formatter:v=>v.slice(2,7)}},
      yAxis,dataZoom:dz(true),
      series:sp.series.map(s=>({name:s.n,type:'line',stack:'t',areaStyle:{opacity:.92},symbol:'none',
        data:s.tv.map(p=>p[1]),color:s.c,lineStyle:{width:.6}}))};
  }
  if(sp.kind==='tbars'){
    const cats=sp.tv.map(p=>p[0]);
    const ma=sp.tv.map((p,i)=>{const a=Math.max(0,i-3);const w=sp.tv.slice(a,i+1).map(q=>q[1]);
      return +(w.reduce((x,y)=>x+y,0)/w.length).toFixed(3);});
    return {...base,xAxis:{...catX(cats),axisLabel:{...catX(cats).axisLabel,formatter:v=>v.slice(2,7)}},
      yAxis,dataZoom:dz(true),
      series:[{name:sp.ln||'variação da semana',type:'bar',data:sp.tv.map(p=>({value:p[1],itemStyle:{color:p[1]>=0?sp.cpos:sp.cneg}})),barMaxWidth:8},
              {name:'média 4 sem',type:'line',data:ma,color:sp.cma||'#1A3A5C',symbol:'none',lineStyle:{width:1.8}}]};
  }
  if(sp.kind==='combo'){
    // Mesma régua desenhada no SVG: percentuais no esquerdo e share no direito.
    const maxBar=Math.max(...sp.series[0].v.filter(Number.isFinite),1);
    const aShare=commitPctShareAxis(sp.series[1].v);
    const opt={...base,grid:{...base.grid,left:big?38:31,right:big?49:34},xAxis:catX(sp.x),
      yAxis:[{...yAxis,min:0,max:maxBar*1.15,axisLabel:{...yAxis.axisLabel,formatter:v=>NF(v,0)+'%'}},
        {...yAxis,min:0,max:aShare.cap,interval:aShare.step,position:'right',
          axisLabel:{...yAxis.axisLabel,formatter:v=>NF(v,0)+'%',margin:5},
          axisLine:{show:true,onZero:false,lineStyle:{color:'#000',width:1}},
          axisTick:{show:false},splitLine:{show:false}}],dataZoom:dz(false),
      series:[{name:sp.series[0].n,type:'bar',yAxisIndex:0,
        data:sp.series[0].v.map((v,i)=>({value:v,itemStyle:{color:sp.series[0].ci[i]}})),barMaxWidth:big?44:26,
        label:{show:true,position:'top',fontSize:fsAx,fontFamily:FONT,formatter:p=>NF(p.value,1)+'%'}},
        {name:sp.series[1].n,type:'line',yAxisIndex:1,data:sp.series[1].v,color:'#454545',
        connectNulls:false,smooth:0.28,showSymbol:true,symbol:'circle',symbolSize:big?4.5:3,
        lineStyle:{width:big?1.65:1.45,color:'#454545'}}]};
    if(opt.toolbox&&opt.toolbox.feature)delete opt.toolbox.feature.magicType;
    return opt;
  }
  if(sp.kind==='bars'){
    return {...base,xAxis:catX(sp.x),yAxis:{...yAxis,min:sp.ymin},dataZoom:dz(sp.x.length>14),
      series:sp.series.map(s=>({name:s.n,type:'bar',stack:sp.stacked?'s':undefined,
        data:s.v.map((v,i)=>s.ci?{value:v,itemStyle:{color:s.ci[i]}}:v),color:s.c,barMaxWidth:big?46:28,
        label:sp.series.length===1?{show:true,position:'top',fontSize:fsAx,fontFamily:FONT,formatter:p=>NF(p.value,sp.fmt)}:undefined}))};
  }
  if(sp.kind==='hbars'){
    return {...base,tooltip:{...base.tooltip,axisPointer:{type:'shadow'}},
      yAxis:{type:'category',data:sp.x,inverse:true,axisLabel:{fontSize:fsAx,fontFamily:FONT,color:'#000'},axisLine:{lineStyle:{color:'#000'}}},
      xAxis:{type:'value',axisLabel:{fontSize:fsAx,fontFamily:FONT,color:'#000'},splitLine:{show:false}},
      series:[{name:sp.series[0].n,type:'bar',data:sp.series[0].v,color:sp.series[0].c,barMaxWidth:22,
        label:{show:true,position:'right',fontSize:fsAx,fontFamily:FONT,formatter:p=>NF(p.value,sp.fmt)}}]};
  }
  if(sp.kind==='donut'){
    return {...base,tooltip:{trigger:'item',backgroundColor:'#0F2638',borderWidth:0,
        textStyle:{color:'#fff',fontFamily:FONT},formatter:p=>`<b>${p.name}</b><br>${vf(p.value)} · ${p.percent}%`},
      legend:{...base.legend,orient:'vertical',right:0,top:'middle',left:'auto'},
      series:[{type:'pie',radius:['46%','74%'],center:['36%','54%'],
        data:sp.items.map(it=>({name:it.n,value:+it.v.toFixed(3),itemStyle:{color:it.c}})),
        label:{fontSize:fsAx,fontFamily:FONT,formatter:'{d}%'},
        emphasis:{scale:true,scaleSize:6}}]};
  }
  if(sp.kind==='heat'){
    return {...base,tooltip:{trigger:'item',backgroundColor:'#0F2638',borderWidth:0,textStyle:{color:'#fff',fontFamily:FONT},
        formatter:p=>`<b>${sp.rows[p.value[1]]} · ${sp.cols[p.value[0]]}</b><br>${vf(p.value[2])}`},
      grid:{left:big?90:66,right:big?60:34,top:big?30:18,bottom:big?40:26},
      xAxis:{type:'category',data:sp.cols,axisLabel:{fontSize:fsAx-1,fontFamily:FONT,color:'#000'},axisTick:{show:false}},
      yAxis:{type:'category',data:sp.rows,inverse:true,axisLabel:{fontSize:fsAx,fontFamily:FONT,color:'#000'}},
      visualMap:{min:0,max:Math.max(...sp.vals.flat().map(v=>v||0)),calculable:true,orient:'vertical',right:0,top:'middle',
        itemHeight:big?120:70,textStyle:{fontSize:fsAx-1,fontFamily:FONT},inRange:{color:['#F0FDFA',sp.c||TEAL,'#0F5148']}},
      series:[{type:'heatmap',data:sp.rows.flatMap((_,ri)=>sp.cols.map((__,ci)=>[ci,ri,+(sp.vals[ri][ci]||0).toFixed(2)])),label:{show:false}}]};
  }
  if(sp.kind==='dumb'){
    return {...base,tooltip:{...base.tooltip,axisPointer:{type:'shadow'},
        formatter:ps=>{const i=ps[0].dataIndex;
          return `<b>${sp.cats[i]}</b><br>${sp.la}: ${vf(sp.a[i])}<br>${sp.lb}: ${vf(sp.b[i])}<br>Δ ${NF(sp.a[i]-sp.b[i],2)}`;}},
      yAxis:{type:'category',data:sp.cats,inverse:true,axisLabel:{fontSize:fsAx,fontFamily:FONT,color:'#000'}},
      xAxis:{type:'value',axisLabel:{fontSize:fsAx,fontFamily:FONT,color:'#000'},splitLine:{show:false}},
      series:[{name:sp.lb,type:'scatter',data:sp.b,color:sp.cb,symbolSize:big?12:9},
              {name:sp.la,type:'scatter',data:sp.a.map((v,i)=>({value:v,itemStyle:{color:v>=sp.b[i]?sp.ca:(sp.cc||sp.ca)}})),color:sp.ca,symbolSize:big?15:11}]};
  }
  return null;
}
/* ── specFor: adaptador de dados dos cards EUA ── */
function specFor(idFull,card){
  const [cid,com]=idFull.split('|');
  const pais=card&&card._getPais?card._getPais():'MUNDO';
  const ys=MYS(com),wk=card&&card._getWeek?card._getWeek():wkNow(com);
  const myPick=card&&card._getMy?card._getMy():null;
  const cy=(myPick!=null&&ys.includes(myPick))?myPick:ys[ys.length-1];
  const nomP=pais==='MUNDO'?'Mundo':pais;
  const perMY=(idx)=>ys.map((y,i)=>{
    const v=Array(53).fill(null);
    S(com,pais).filter(r=>r[1]===y).forEach(r=>{v[r[2]-1]=+(idx(r)/1000).toFixed(2);});
    return {n:myLbl(y),v,c:LADDER[i+LADDER.length-ys.length]||'#1A3A5C'};
  });
  const X53=Array.from({length:53},(_,i)=>String(i+1));
  const dseries=(idx)=>S(com,pais).filter(r=>r[1]===cy).map(r=>[periodEndISO(r[0]),+(idx(r)).toFixed(1)]);
  if(cid==='commit') return {kind:'line',x:X53,series:perMY(r=>r[3]+r[4]),fmt:1,unit:' Mi t'};
  if(cid==='accum')  return {kind:'line',x:X53,series:perMY(r=>r[3]),fmt:1,unit:' Mi t'};
  if(cid==='outst')  return {kind:'line',x:X53,series:perMY(r=>r[4]),fmt:1,unit:' Mi t'};
  if(cid==='book'||cid==='bookpct'){
    const isPct=cid==='bookpct';
    const s2=ys.map((y,i)=>{const v=Array(53).fill(null),alvo=nmyProgramKt(com,y+1);
      if(isPct&&!alvo)return null;
      S(com,pais).filter(r=>r[1]===y&&r[5]!=null).forEach(r=>{
        v[r[2]-1]=+(isPct?100*r[5]/alvo:r[5]/1000).toFixed(isPct?3:2);});
      return {n:myLbl(y+1),v,c:LADDER[i+LADDER.length-ys.length]||'#1A3A5C'};}).filter(Boolean).filter(s=>s.v.some(x=>x!=null));
    if(com==='soja'&&pais==='China'&&E.deep&&E.deep.cn_nmy_rec){
      const start=new Date('2025-09-01').getTime();
      const tgt=s2.find(s=>s.n===myLbl(ys[ys.length-1]+1));
      const alvo=nmyProgramKt(com,ys[ys.length-1]+1);
      if(tgt)E.deep.cn_nmy_rec.forEach(r=>{const w2=Math.floor((new Date(r[0]).getTime()-start)/(7*864e5))+1;
        if(w2>=1&&w2<=53)tgt.v[w2-1]=+(isPct?100*r[1]/alvo:r[1]/1000).toFixed(3);});
    }
    if(!s2.length)return null;
    return {kind:'line',x:X53,series:s2,fmt:isPct?1:2,unit:isPct?'%':' Mi t'};
  }
  if(cid==='net'){
    const rows=S(com,pais).filter(r=>r[1]===cy);const tv=[];
    for(let i=1;i<rows.length;i++)tv.push([periodEndISO(rows[i][0]),+(((rows[i][3]+rows[i][4])-(rows[i-1][3]+rows[i-1][4]))).toFixed(1)]);
    if(tv.length<3)return null;
    return {kind:'tbars',tv,cpos:'#8fa3b8',cneg:'#c98f8a',fmt:0,unit:' mil t',ln:'net sales'};
  }
  if(cid==='wexp'){
    const rows=S(com,pais).filter(r=>r[1]===cy);const tv=[];
    for(let i=1;i<rows.length;i++){const d=Math.max(rows[i][2]-rows[i-1][2],1);tv.push([periodEndISO(rows[i][0]),+Math.max((rows[i][3]-rows[i-1][3])/d,0).toFixed(1)]);}
    if(tv.length<3||!tv.some(p=>p[1]>0))return null;
    return {kind:'tbars',tv,cpos:'#1A3A5C',cneg:'#c98f8a',fmt:0,unit:' mil t',ln:'embarques/sem'};
  }
  if(cid==='area'){
    const rows=S(com,pais).filter(r=>r[1]===cy);
    if(rows.length<3||!rows.some(r=>r[3]+r[4]>0))return null;
    return {kind:'tstack',fmt:1,unit:' Mi t',series:[
      {n:'embarcado',c:'#1A3A5C',tv:rows.map(r=>[periodEndISO(r[0]),+(r[3]/1000).toFixed(2)])},
      {n:'a embarcar',c:'#66b8b0',tv:rows.map(r=>[periodEndISO(r[0]),+(r[4]/1000).toFixed(2)])}]};
  }
  if(cid==='wasde'){
    const rows=S(com,'MUNDO'),wmap=E.dados[com].wasde;let wi=0,lastw=null;const tv=[];
    rows.forEach(r=>{while(wi<wmap.length&&wmap[wi][0]<=r[0]){lastw=wmap[wi][1];wi++;}
      if(lastw)tv.push([periodEndISO(r[0]),+((r[3]+r[4])/lastw*100).toFixed(1)]);});
    if(!tv.length)return null;
    return {kind:'tline',fmt:1,unit:'%',ref:[{y:100,n:'WASDE'}],series:[{n:'commit ÷ WASDE',c:'#1A3A5C',tv}]};
  }
  if(cid==='fluxocn'&&com==='soja'){
    const tv=E.deep.nar.filter(r=>r[0]>='2024-06-01').map(r=>[periodEndISO(r[0]),r[1]]);
    return {kind:'tbars',tv,cpos:'#8fa3b8',cneg:'#c98f8a',fmt:0,unit:' mil t',ln:'net sales China'};
  }
  if(cid==='switched'&&com==='soja'){
    const tv=E.deep.nar.map(r=>[periodEndISO(r[0]),Number.isFinite(r[3])?r[3]:null]);
    return {kind:'tbars',tv,cpos:'#0D9488',cneg:'#c98f8a',fmt:0,unit:' mil t',ln:'switched → China'};
  }
  if(cid==='ritmo'){
    const wm=E.dados[com].wasde;
    if(!wm||!wm.length)return null;
    const wAt=d=>{let v=wm[0][1];for(const r of wm){if(r[0]<=d)v=r[1];else break;}return v;};
    const finais={};ys.slice(0,-1).forEach(y=>{const rw=S(com,'MUNDO').filter(r=>r[1]===y);if(rw.length&&rw[rw.length-1][3]>0)finais[y]=rw[rw.length-1][3];});
    if(Object.keys(finais).length<2)return null;
    const shareLoo=(w,ex)=>{let s2=0,n=0;Object.keys(finais).forEach(ky=>{const y2=+ky;if(y2===ex)return;
      const rw=S(com,'MUNDO').filter(r=>r[1]===y2&&r[2]<=w);if(!rw.length)return;
      s2+=rw[rw.length-1][3]/finais[y2];n++;});return n>=2?s2/n:null;};
    const series=ys.map((y,i)=>{
      const v=Array(53).fill(null);
      S(com,'MUNDO').filter(r=>r[1]===y).forEach(r=>{const sh=shareLoo(r[2],y);if(sh==null)return;
        v[r[2]-1]=+((r[3]-sh*wAt(r[0]))/1000).toFixed(2);});
      return {n:myLbl(y),v,c:LADDER[i+LADDER.length-ys.length]||'#1A3A5C'};
    }).filter(s2=>s2.v.some(x=>x!=null));
    const vB=Array(53).fill(null);
    S(com,'MUNDO').filter(r=>r[1]===cy&&r[5]!=null).forEach(r=>{
      let s2=0,n=0;Object.keys(finais).forEach(ky=>{const rw=S(com,'MUNDO').find(x=>x[1]===+ky&&x[2]===r[2]&&x[5]!=null);if(rw){s2+=rw[5];n++;}});
      if(n>=2)vB[r[2]-1]=+((r[5]-s2/n)/1000).toFixed(2);});
    if(vB.some(x=>x!=null))series.push({n:myLbl(cy+1)+' · book',v:vB,c:'#0D9488'});
    if(!series.length)return null;
    return {kind:'line',x:Array.from({length:53},(_,i)=>String(i+1)),fmt:1,unit:' Mi t',ref:[{y:0,n:'ritmo'}],series};
  }
  if(cid==='prognova'||cid==='prognovapct'){
    const isPct=cid==='prognovapct';
    const MU=S(com,'MUNDO');
    const series=ys.map((y,i)=>{
      const v=Array(53).fill(null),alvo=nmyProgramKt(com,y+1);
      if(isPct&&!alvo)return null;
      MU.filter(r=>r[1]===y&&r[5]!=null).forEach(r=>{
        v[r[2]-1]=+(isPct?100*r[5]/alvo:r[5]/1000).toFixed(isPct?3:2);});
      return {n:myLbl(y+1),v,c:LADDER[i+LADDER.length-ys.length]||'#1A3A5C'};
    }).filter(Boolean).filter(s2=>s2.v.some(x=>x!=null));
    if(!series.length)return null;
    const cur=MU.filter(r=>r[1]===cy&&r[5]!=null);
    const alvoAtual=nmyProgramKt(com,cy+1);
    if(cur.length&&(!isPct||alvoAtual)){
      const lw=cur[cur.length-1][2];
      let v0=cur[cur.length-1][5];
      const cv=()=>isPct?100*v0/alvoAtual:v0/1000;
      const vP=Array(53).fill(null);vP[lw-1]=+cv().toFixed(isPct?3:2);
      for(let w=lw+1;w<=53;w++){
        const ds=[];
        ys.slice(0,-1).forEach(y=>{if(y===2024)return;
          const a=MU.find(r=>r[1]===y&&r[2]===w-1&&r[5]!=null),b=MU.find(r=>r[1]===y&&r[2]===w&&r[5]!=null);
          if(a&&b)ds.push(b[5]-a[5]);});
        if(!ds.length)break;
        v0+=ds.reduce((s2,x)=>s2+x,0)/ds.length;
        vP[w-1]=+cv().toFixed(isPct?3:2);
      }
      if(vP.filter(x=>x!=null).length>1)series.push({n:'proje\u00e7\u00e3o ex-guerra',v:vP,c:'#0D9488'});
    }
    return {kind:'line',x:Array.from({length:53},(_,i)=>String(i+1)),fmt:1,unit:isPct?'%':' Mi t',series};
  }
  if(cid==='sankey'){
    const dests=E.dados[com].paises.filter(p=>p!=='MUNDO'&&p!=='UNKNOWN').slice(0,6);
    const links=[];
    ys.forEach(y=>{
      let known=0;const yl=myLbl(y);
      dests.forEach(p=>{const rr=cmAt(com,p,y,wk);const v=rr?rr[3]:0;known+=v;if(v>0)links.push({source:yl,target:p,value:Math.round(v)});});
      const wr=cmAt(com,'MUNDO',y,wk);const tot=wr?wr[3]:0;
      const o=Math.max(tot-known,0);if(o>0)links.push({source:yl,target:'Outros',value:Math.round(o)});
    });
    if(!links.length)return null;
    return {kind:'sankey',links,safras:ys.map(myLbl),dests:[...dests,'Outros'],fmt:0,unit:' mil t'};
  }
  if(cid==='saz'&&com==='soja'){
    const sz=E.deep.saz,cur=_sojaCurvaAtual();
    const ks=Array.from({length:53},(_,i)=>i+1);
    const x=ks.map(String);
    const pick=i2=>ks.map(k=>sz[k]?sz[k][i2]:null);
    const vcur=ks.map(k=>cur[k]!=null?cur[k]:null);
    return {kind:'line',x,fmt:0,unit:'%',series:[
      {n:'p10',v:pick(0),c:'#c9d1d8'},{n:'mediana 90–24',v:pick(1),c:'#000'},
      {n:'p90',v:pick(2),c:'#c9d1d8'},{n:myLbl(cy)+' (%WASDE)',v:vcur,c:'#1A3A5C'}]};
  }
  if(cid==='mensal'){
    const m0=MYM[com];
    const x=Array.from({length:12},(_,i)=>MESES[(m0-1+i)%12]);
    const series=ys.map((y,i)=>{
      const rows=S(com,pais).filter(r=>r[1]===y);const mes={};
      rows.forEach(r=>{const d=new Date(r[0]);const mi=(d.getMonth()+12-(m0-1))%12;if(!(mi in mes)||r[2]>mes[mi].wk)mes[mi]={ac:r[3],wk:r[2]};});
      const ks2=Object.keys(mes).map(Number).sort((a,b)=>a-b);
      const v=Array(12).fill(null);let prev=0,first=true;
      ks2.forEach(k=>{const dv=(mes[k].ac-prev)/1000;prev=mes[k].ac;
        if(first){first=false;if(k>0)return;}
        v[k]=+Math.max(dv,0).toFixed(2);});
      return {n:myLbl(y),v,c:LADDER[i+LADDER.length-ys.length]||'#1A3A5C'};
    }).filter(s=>s.v.some(x2=>x2!=null));
    if(!series.length)return null;
    return {kind:'line',x,series,fmt:1,unit:' Mi t/mês',dots:true};
  }
  if(cid==='netsafra'){
    const vals=ys.map(y=>{const a=cmAt(com,pais,y,wk),b=cmAt(com,pais,y,wk-1);
      return (a&&b&&a[2]!==b[2])?{y,v:+(((a[3]+a[4])-(b[3]+b[4]))/1000).toFixed(2)}:null;}).filter(Boolean);
    if(!vals.length)return null;
    return {kind:'bars',x:vals.map(v2=>myLbl(v2.y)),fmt:2,unit:' Mi t',
      series:[{n:'net sales sem. '+wk+' · '+nomP,c:'#1A3A5C',v:vals.map(v2=>v2.v),ci:vals.map((v2,i)=>i===vals.length-1?'#0D9488':'#1A3A5C')}]};
  }
  if(cid==='commitpct'){
    const q=commitPctCtx(com,wk),sh=commitPctShareCtx(com,pais,q);
    const bars=q.vals.map(x=>({l:myLbl(x.y),y:x.y,v:+x.v.toFixed(3),cur:x.cur}));
    if(q.media!=null)bars.push({l:'Média '+q.prev.length+'a',y:null,v:+q.media.toFixed(3),cur:false,avg:true});
    if(!bars.length)return null;
    return {kind:'combo',x:bars.map(x=>x.l),fmt:1,unit:'%',
      series:[{n:'comprometido / WASDE',c:'#1A3A5C',type:'bar',
        v:bars.map(x=>x.v),ci:bars.map(x=>x.avg?'#a7b0b8':x.cur?'#0D9488':'#1A3A5C')},
      {n:'share '+pais+' / Mundo',c:'#454545',type:'line',
        v:bars.map(x=>{const v=x.y==null?sh.media:sh.byYear.get(x.y);return Number.isFinite(v)?+v.toFixed(3):null;})}]};
  }
  if(cid==='regua'){
    const vals=ys.map(y=>{const r=cmAt(com,pais,y,wk);return r?{y,v:+(((r[3]+r[4]))/1000).toFixed(1),cur:y===cy}:null;}).filter(Boolean);
    if(!vals.length)return null;
    const prev=vals.filter(v2=>!v2.cur);
    const med=prev.length?+(prev.reduce((q,v2)=>q+v2.v,0)/prev.length).toFixed(1):null;
    const x=[...vals.map(v2=>myLbl(v2.y)),...(med!=null?['Média '+prev.length+'a']:[])];
    const v=[...vals.map(v2=>v2.v),...(med!=null?[med]:[])];
    const ci=[...vals.map(v2=>v2.cur?'#0D9488':'#1A3A5C'),...(med!=null?['#a7b0b8']:[])];
    return {kind:'bars',x,fmt:1,unit:' Mi t',series:[{n:'commit sem. '+wk+' · '+nomP,c:'#1A3A5C',v,ci}]};
  }
  if(cid==='grupo'){
    const vals=ys.map(y=>{const r=cmAt(com,pais,y,wk);return r?{y,ac:+(r[3]/1000).toFixed(2),ou:+(r[4]/1000).toFixed(2)}:null;}).filter(Boolean);
    if(!vals.length||!vals.some(v2=>v2.ac+v2.ou>0))return null;
    return {kind:'bars',x:vals.map(v2=>myLbl(v2.y)),fmt:2,unit:' Mi t',series:[
      {n:'embarcado',c:'#1A3A5C',v:vals.map(v2=>v2.ac)},{n:'a embarcar',c:'#0D9488',v:vals.map(v2=>v2.ou)}]};
  }
  if(cid==='triplo'){
    const py=ys[ys.length-2];
    const items=E.dados[com].paises.filter(p=>p!=='MUNDO').slice(0,8).map(p=>{
      const a=cmAt(com,p,cy,wk),b=cmAt(com,p,cy,wk-1),c2=cmAt(com,p,py,wk);
      return {p:p==='UNKNOWN'?'Unknown':p,cur:a?+(((a[3]+a[4]))/1000).toFixed(2):0,
        lw:b?+(((b[3]+b[4]))/1000).toFixed(2):0,ly:c2?+(((c2[3]+c2[4]))/1000).toFixed(2):0};});
    return {kind:'bars',x:items.map(i2=>i2.p),fmt:2,unit:' Mi t',series:[
      {n:'ano passado',c:'#c9b08a',v:items.map(i2=>i2.ly)},
      {n:'sem. passada',c:'#8fa3b8',v:items.map(i2=>i2.lw)},
      {n:'atual',c:'#1A3A5C',v:items.map(i2=>i2.cur)}]};
  }
  if(cid==='donut'){
    const wr=cmAt(com,'MUNDO',cy,wk);if(!wr)return null;
    const tot=(wr[3]+wr[4])/1000;if(!(tot>0))return null;
    const tops=E.dados[com].paises.filter(p=>p!=='MUNDO'&&p!=='UNKNOWN').map(p=>{
      const r=cmAt(com,p,cy,wk);return r?{p,v:(r[3]+r[4])/1000}:null;}).filter(x2=>x2&&x2.v>0).sort((a,b)=>b.v-a.v).slice(0,5);
    const ur=cmAt(com,'UNKNOWN',cy,wk);
    const items=[...tops.map((x2,i)=>({n:x2.p,v:x2.v,c:PAL6[i]})),{n:'Unknown',v:ur?(ur[3]+ur[4])/1000:0,c:'#c9b06a'}];
    items.push({n:'Outros',v:Math.max(tot-items.reduce((q,x2)=>q+x2.v,0),0),c:'#e3e7eb'});
    return {kind:'donut',items,fmt:1,unit:' Mi t'};
  }
  if(cid==='rank'){
    const items=E.dados[com].paises.filter(p=>p!=='MUNDO').map(p=>{
      const r=cmAt(com,p,cy,wk);return r?{p:p==='UNKNOWN'?'Unknown':p,v:+(((r[3]+r[4]))/1000).toFixed(2)}:null;
    }).filter(x2=>x2&&x2.v>0).sort((a,b)=>b.v-a.v).slice(0,10);
    return {kind:'hbars',x:items.map(i2=>i2.p),fmt:2,unit:' Mi t',series:[{n:'commit '+myLbl(cy),c:'#1A3A5C',v:items.map(i2=>i2.v)}]};
  }
  if(cid==='exec'){
    const items=E.dados[com].paises.filter(p=>p!=='MUNDO'&&p!=='UNKNOWN').map(p=>{
      const r=cmAt(com,p,cy,wk);if(!r)return null;const cm2=r[3]+r[4];
      return cm2>0?{p,pct:+(r[3]/cm2*100).toFixed(0),cm:cm2}:null;}).filter(Boolean)
      .sort((a,b)=>b.cm-a.cm).slice(0,10).sort((a,b)=>b.pct-a.pct);
    return {kind:'hbars',x:items.map(i2=>i2.p),fmt:0,unit:'%',series:[{n:'embarcado ÷ commit',c:'#1A3A5C',v:items.map(i2=>i2.pct)}]};
  }
  if(cid==='cohort'){
    const base=ys.slice(0,-1);
    const items=E.dados[com].paises.filter(p=>p!=='MUNDO'&&p!=='UNKNOWN').map(p=>{
      const at=(y)=>{const rr=S(com,p).filter(r=>r[1]===y&&r[2]<=wk);return rr.length?rr[rr.length-1][3]:null;};
      const cur=at(cy);const hist=base.map(at).filter(v2=>v2!=null);
      if(cur==null||hist.length<2)return null;
      const md=hist.reduce((q,v2)=>q+v2,0)/hist.length;
      if(md<150&&cur<150)return null;
      return {p,d:+(((cur-md)/Math.max(md,1))*100).toFixed(0)};}).filter(Boolean).sort((a,b)=>b.d-a.d);
    const show=[...items.slice(0,5),...items.slice(-4)].filter((v2,i,arr)=>arr.indexOf(v2)===i);
    if(!show.length)return null;
    return {kind:'hbars',x:show.map(i2=>i2.p),fmt:0,unit:'%',series:[{n:'Δ vs média safras ant.',c:'#0D9488',v:show.map(i2=>i2.d)}]};
  }
  if(cid==='heat'){
    const tops=E.dados[com].paises.filter(p=>p!=='MUNDO'&&p!=='UNKNOWN').slice(0,8);
    const cols=ys.map(y=>myLbl(y));
    const vals=tops.map(p=>ys.map(y=>{
      const r=cmAt(com,p,y,wk),wr=cmAt(com,'MUNDO',y,wk);
      return (r&&wr&&wr[3]>0)?+(r[3]/wr[3]*100).toFixed(1):0;}));
    return {kind:'heat',rows:tops,cols,vals,fmt:1,unit:'%'};
  }
  if(cid==='heatcommit'){
    const metric=card&&card._getMode?card._getMode():'share';
    const grid=heatCommitGrid(com,wk,metric);
    const vals=grid.vals.map(row=>row.map(v=>v==null?null:+v.toFixed(metric==='volume'?3:1)));
    return {kind:'heat',rows:grid.tops,cols:grid.ys.map(y=>myLbl(y)),vals,fmt:metric==='volume'?2:1,unit:metric==='volume'?' Mi t':'%'};
  }
  if(cid==='dumb'){
    const py=ys[ys.length-2];
    const items=E.dados[com].paises.filter(p=>p!=='MUNDO'&&p!=='UNKNOWN').map(p=>{
      const a=cmAt(com,p,cy,wk),b=cmAt(com,p,py,wk);
      return (a||b)?{p,cur:a?+(a[3]/1000).toFixed(2):0,old:b?+(b[3]/1000).toFixed(2):0}:null;
    }).filter(Boolean).sort((x2,y2)=>(y2.cur+y2.old)-(x2.cur+x2.old)).slice(0,8);
    return {kind:'dumb',cats:items.map(i2=>i2.p),a:items.map(i2=>i2.cur),b:items.map(i2=>i2.old),
      la:myLbl(cy),lb:myLbl(py),ca:'#0D9488',cb:'#9aa3ad',fmt:2,unit:' Mi t'};
  }
  if(cid==='sharesafra'){
    const tops=E.dados[com].paises.filter(p=>p!=='MUNDO'&&p!=='UNKNOWN').slice(0,5);
    const curNmy=cmAt(com,'MUNDO',cy,wk),nmyTot=curNmy&&curNmy[5]>0?curNmy[5]:0;
    const cols=[...ys.map(y=>({y,nc:false,l:myLbl(y)})),...(nmyTot>0?[{y:cy,nc:true,l:myLbl(cy+1)+' NC'}]:[])];
    const x=cols.map(c2=>c2.l);
    const mk2=(p,i)=>({n:p,c:PAL6[i],v:cols.map(c2=>{
      const wl2=cmAt(com,'MUNDO',c2.y,wk),tot=c2.nc?nmyTot:(wl2?wl2[3]+wl2[4]:0);
      const rl=cmAt(com,p,c2.y,wk),v=c2.nc?nmyDestAt(com,p,c2.y,wk):(rl?rl[3]+rl[4]:0);
      return tot>0?+(v/tot*100).toFixed(1):0;})});
    const series=tops.map(mk2);
    const unk={n:'Unknown',c:'#c9b06a',v:cols.map(c2=>{
      const wl3=cmAt(com,'MUNDO',c2.y,wk),tot=c2.nc?nmyTot:(wl3?wl3[3]+wl3[4]:0);
      const rl=cmAt(com,'UNKNOWN',c2.y,wk),v=c2.nc?nmyDestAt(com,'UNKNOWN',c2.y,wk):(rl?rl[3]+rl[4]:0);
      return tot>0?+(v/tot*100).toFixed(1):0;})};
    series.push(unk);
    const outros={n:'Outros',c:'#e3e7eb',v:cols.map((c2,j)=>+Math.max(0,100-series.reduce((q,s)=>q+s.v[j],0)).toFixed(1))};
    series.push(outros);
    return {kind:'bars',stacked:true,x,series,fmt:1,unit:'%'};
  }
  if(cid==='sharenmy'){
    const {cols,tops}=nmyShareCtx(com,wk);
    if(!cols.some(c2=>c2.tot>0))return null;
    const x=cols.map(c2=>c2.l);
    const mk2=(p,i)=>({n:p,c:PAL6[i],v:cols.map(c2=>{
      const v=nmyDestAt(com,p,c2.y,wk);
      return c2.tot>0?+(v/c2.tot*100).toFixed(1):0;})});
    const series=tops.map(mk2);
    const unk={n:'Unknown',c:'#c9b06a',v:cols.map(c2=>{
      const v=nmyDestAt(com,'UNKNOWN',c2.y,wk);
      return c2.tot>0?+(v/c2.tot*100).toFixed(1):0;})};
    series.push(unk);
    const outros={n:'Outros',c:'#e3e7eb',v:cols.map((c2,j)=>c2.tot>0?+Math.max(0,100-series.reduce((q,s)=>q+s.v[j],0)).toFixed(1):0)};
    series.push(outros);
    return {kind:'bars',stacked:true,x,series,fmt:1,unit:'%'};
  }
  if(cid==='iniprog'){
    /* espelha gIniProg: book da safra nova por ciclo na semana de referência,
       com o destino selecionado destacado dentro do total. Empilhado, para o
       destino ser lido como fatia do book e não como barra ao lado. */
    const alvo=(pais&&pais!=='MUNDO')?pais:null;
    const MU=S(com,'MUNDO'),x=[],tot=[],parte=[];
    ys.forEach(y=>{
      const row=MU.filter(r=>r[1]===y&&r[2]<=wk&&r[5]!=null).slice(-1)[0];
      if(!row)return;
      let pv=null;
      if(alvo){
        const rr=S(com,alvo).filter(r=>r[1]===y&&r[2]<=wk&&r[2]>=wk-4&&r[5]!=null).slice(-1)[0];
        if(rr)pv=rr[5]; else if(alvo==='China')pv=_cnBookCiclo(y,row[0]);
      }
      x.push(myLbl(y+1));
      tot.push(+(row[5]/1000).toFixed(2));
      parte.push(pv==null?null:+(Math.min(pv,row[5])/1000).toFixed(2));
    });
    if(!x.length)return null;
    if(!alvo)return {kind:'bars',x,fmt:2,unit:' Mi t',
      series:[{n:'book total',c:'#1A3A5C',v:tot}]};
    if(!parte.some(v=>v!=null))return null;
    const resto=tot.map((t,i)=>parte[i]==null?+t.toFixed(2):+(t-parte[i]).toFixed(2));
    return {kind:'bars',stacked:true,x,fmt:2,unit:' Mi t',series:[
      {n:(alvo==='UNKNOWN'?'Unknown':alvo),c:'#0D9488',v:parte},
      {n:'demais destinos',c:'#dfe5ea',v:resto}]};
  }
  return null; // matriz, iniprog, perc e fl: estáticos
}
function applySpecCardColors(sp,card,idFull){
  if(!sp||!card)return sp;
  const cid=(idFull||'').split('|')[0];
  const cols=[...card.querySelectorAll('input.lgc')].map(i=>i.value).filter(Boolean);
  if(!cols.length)return sp;
  const seq=()=>{(sp.series||[]).forEach((s,i)=>{if(cols[i])s.c=cols[i];});};
  if(['commit','accum','outst','book','mensal','ritmo','prognova','grupo','triplo','area','sharesafra','sharenmy'].includes(cid))seq();
  else if(cid==='netsafra'&&sp.series&&sp.series[0])sp.series[0].ci=sp.series[0].v.map((_,i)=>i===sp.series[0].v.length-1?(cols[1]||cols[0]):cols[0]);
  else if(cid==='regua'&&sp.series&&sp.series[0])sp.series[0].ci=sp.x.map((x,i)=>x.indexOf('Média')===0?(cols[2]||'#a7b0b8'):(i===sp.x.length-2?(cols[1]||cols[0]):cols[0]));
  else if(['net','wexp','fluxocn'].includes(cid)){sp.cpos=cols[0];sp.cma=cols[1]||cols[0];}
  else if(cid==='switched')sp.cpos=cols[0];
  else if(cid==='saz'&&sp.series){if(sp.series[0])sp.series[0].c=cols[0];if(sp.series[1])sp.series[1].c=cols[1]||cols[0];if(sp.series[2])sp.series[2].c=cols[0];if(sp.series[3])sp.series[3].c=cols[2]||cols[0];}
  else if(cid==='dumb'){sp.cb=cols[0];sp.ca=cols[1]||cols[0];sp.cc=cols[2]||sp.ca;}
  else if(cid==='wasde'){if(sp.series&&sp.series[0])sp.series[0].c=cols[0];if(sp.ref&&sp.ref[0])sp.ref[0].c=cols[1]||'#B5963E';}
  else if(sp.series&&sp.series[0])sp.series[0].c=cols[0];
  return sp;
}
/* ── modal tela cheia ── */
function openDynModal(card,id){
  let m=document.getElementById('dynmodal');
  if(!m){
    m=document.createElement('div');m.id='dynmodal';
    m.innerHTML='<div class="dm-box"><div class="dm-head"><b id="dm-title"></b><button id="dm-close">✕</button></div><div class="dm-body" id="dm-body"></div></div>';
    document.body.appendChild(m);
    m.addEventListener('click',e=>{if(e.target===m)closeDynModal();});
    m.querySelector('#dm-close').onclick=closeDynModal;
    document.addEventListener('keydown',e=>{if(e.key==='Escape')closeDynModal();});
  }
  m.querySelector('#dm-title').textContent=card.querySelector('.p-card-t').textContent;
  m.style.display='flex';
  const body=m.querySelector('#dm-body');body.innerHTML='';
  const sp=applySpecCardColors(specFor(id,card),card,id);
  try{
    const ch=echarts.init(body,null,{renderer:'canvas'});
    const optB=buildOption(sp,card,id,true);
    ch.setOption(optB,true);
    if(optB.__sankeyRefilter)ch.on('legendselectchanged',ev=>{
      const off=new Set(Object.keys(ev.selected).filter(k=>ev.selected[k]===false));
      ch.setOption({series:[optB.__sankeyRefilter(off)]},{replaceMerge:['series']});
    });
    m._chart=ch;
    m._ro=new ResizeObserver(()=>ch.resize());m._ro.observe(body);
    requestAnimationFrame(()=>ch.resize());
  }catch(err){
    body.innerHTML='<div style="padding:22px;font:600 13px var(--font);color:#b3564d">Falha ao ampliar: '+err.message+'</div>';
  }
}
function closeDynModal(){
  const m=document.getElementById('dynmodal');
  if(!m||m.style.display==='none')return;
  if(m._chart){m._chart.dispose();m._chart=null;}
  if(m._ro){m._ro.disconnect();m._ro=null;}
  m.style.display='none';
}
let PAL6D=(typeof PAL6!=='undefined')?PAL6.slice():['#0D9488','#B5963E','#5B7DB1','#66b8b0','#c9b06a','#8a97a6'];
async function renderDyn(card,id){
  const sp=applySpecCardColors(specFor(id,card),card,id);
  if(!sp) return null;
  try{ await ensureECharts(); }
  catch(e){ toast('Modo dinâmico indisponível.'); return null; }
  const holder=document.createElement('div');
  holder.style.cssText='height:100%;min-height:0;';
  const chart=echarts.init(holder,null,{renderer:'canvas'});
  const opt0=buildOption(sp,card,id,false);
  chart.setOption(opt0);
  if(opt0.__sankeyRefilter)chart.on('legendselectchanged',ev=>{
    const off=new Set(Object.keys(ev.selected).filter(k=>ev.selected[k]===false));
    chart.setOption({series:[opt0.__sankeyRefilter(off)]},{replaceMerge:['series']});
  });
  const ro=new ResizeObserver(()=>chart.resize());ro.observe(holder);
  ECHM.set(card,{chart,ro});
  return holder;
}
const DYNSTATIC=new Map();
window.dynOff=function(card,drop){
  const ch=card.querySelector('.chart');
  const inst=ECHM.get(card);
  let sel=null;
  if(inst){
    try{const o=inst.chart.getOption();if(o&&o.legend&&o.legend[0])sel=o.legend[0].selected||null;}catch(e){}
    try{inst.chart.dispose();inst.ro.disconnect();}catch(e){} ECHM.delete(card);
  }
  if(drop){card._hidden=null;}
  else if(sel){const hid=new Set(Object.keys(sel).filter(k=>sel[k]===false));card._hidden=hid.size?hid:null;
    if(card._hidden&&!DYN_HID_OK.has((card.dataset.card||'').split('|')[0]))card._hidden=null;}
  if(ch&&ch.classList.contains('dynon')){
    ch.classList.remove('dynon');
    const b=card.querySelector('.mini.dyn');if(b)b.classList.remove('on');
    if(card._draw){DYNSTATIC.delete(card);card._draw();}
    else{
      /* card restaurado de snapshot: reconstrói via buildCard p/ aplicar o filtro,
         preservando selects, título/subtítulo e tamanhos editados */
      const pc=(card.dataset.card||'').split('|');
      const c2=(pc.length===2&&typeof cardsFor==='function')?cardsFor(pc[1]).find(x=>x.id===pc[0]):null;
      if(c2&&typeof buildCard==='function'){
        const hid=card._hidden;
        if(window.__SAVED__&&window.__SAVED__.cards)delete window.__SAVED__.cards[card.dataset.card];
        DYNSTATIC.delete(card);
        const novo=buildCard(pc[1],c2);
        const so=card.querySelectorAll('select'), sn=novo.querySelectorAll('select');
        sn.forEach((s2,i2)=>{const o2=so[i2];if(o2)s2.value=o2.value;});
        if(novo._syncControls)novo._syncControls();
        [['.p-card-t'],['.p-card-s']].forEach(([q])=>{
          const a=card.querySelector(q), b2=novo.querySelector(q);
          if(a&&b2){b2.textContent=a.textContent;if(a.style.fontSize)b2.style.fontSize=a.style.fontSize;}
        });
        novo._hidden=hid||null;
        card.replaceWith(novo);
        if(novo._hidden&&novo._draw)novo._draw();
        return;
      }
      ch.innerHTML=DYNSTATIC.get(card)||ch.innerHTML;
    }
  }
  if(drop)DYNSTATIC.delete(card);
};
window.injectDynBtn=function(card){
  const id=card.dataset.card;const pal=card.querySelector('.pal');
  if(!pal)return;
  if(!specFor(id,card))return;
  const stale=pal.querySelector('.mini.dyn'); if(stale) stale.remove();
  const b=document.createElement('button');b.className='mini dyn';
  b.title='Modo dinâmico: zoom, tooltip, linha↔barra, dados, tela cheia, CSV';b.textContent='⚡';
  b.onclick=async()=>{
    const ch=card.querySelector('.chart');
    if(ch.classList.contains('dynon')){dynOff(card);return;}
    b.textContent='…';
    let view=null;
    try{view=await renderDyn(card,id);}catch(err){b.textContent='⚡';toast('Dinâmico indisponível: '+err.message);return;}
    b.textContent='⚡';
    if(!view){return;}
    DYNSTATIC.set(card,ch.innerHTML);
    ch.innerHTML='';ch.appendChild(view);ch.classList.add('dynon');b.classList.add('on');
    const inst=ECHM.get(card);if(inst)inst.chart.resize();
  };
  pal.insertBefore(b,pal.querySelector('.png'));
};

function toast(m){const t=document.getElementById('toast');t.textContent=m;t.style.display='block';setTimeout(()=>t.style.display='none',2200);}
function baixar(el,tit,cwArg,chArg){
  const CW=cwArg||438,CH=chArg||264,K=3,AUTO=!!chArg;
  const CHR=AUTO?Math.round(CH*1.8):CH; /* área de render generosa; auto-crop depois */
  const clone=el.cloneNode(true);
  clone.querySelectorAll('.selrow,.pal,.tools,.ui-hint').forEach(x=>x.remove());
  clone.querySelectorAll('.sel').forEach(x=>x.classList.remove('sel'));
  clone.querySelectorAll('.lg span').forEach(sp2=>{if(sp2.title&&sp2.title.indexOf('oculta')>-1)sp2.remove();});
  clone.querySelectorAll('image[data-wm]').forEach(im=>{im.setAttribute('href',LOGO_HREF);im.setAttributeNS('http://www.w3.org/1999/xlink','xlink:href',LOGO_HREF);});
  clone.querySelectorAll('use').forEach(u=>{
    const img2=document.createElementNS('http://www.w3.org/2000/svg','image');
    ['x','y','width','height','opacity','transform'].forEach(a2=>{const v=u.getAttribute(a2); if(v)img2.setAttribute(a2,v);});
    img2.setAttribute('href',LOGO_HREF);
    img2.setAttribute('preserveAspectRatio','xMidYMid meet');
    u.replaceWith(img2);
  });
  clone.querySelectorAll('input.lgc').forEach(i2=>{const sw=document.createElement('i');sw.setAttribute('style','width:8px;height:8px;border-radius:2px;display:inline-block;flex:none;background:'+i2.value);i2.replaceWith(sw);});
  const _cs=getComputedStyle(el),_refs=new Set([...clone.innerHTML.matchAll(/var\((--c\d+)\)/g)].map(m=>m[1])),_colors={};
  _refs.forEach(k=>{const v=(_cs.getPropertyValue(k)||el.style.getPropertyValue(k)||'').trim();if(v)_colors[k]=v;});
  clone.style.cssText='width:'+CW+'px;height:'+CH+'px;margin:0;';
  Object.entries(_colors).forEach(([k,v])=>clone.style.setProperty(k,v));
  /* O SVG do PNG não pode depender de variáveis CSS do card original.
     Materializa todas as cores referenciadas, inclusive --c13, --c14 etc. */
  clone.querySelectorAll('[fill],[stroke]').forEach(n=>['fill','stroke'].forEach(a2=>{
    const raw=n.getAttribute(a2);if(!raw||raw.indexOf('var(')<0)return;
    const solid=raw.replace(/var\((--c\d+)\)/g,(all,k)=>_colors[k]||all);
    n.setAttribute(a2,solid);
  }));
  const css=`*{box-sizing:border-box;font-family:'Arial Nova Cond','Arial Narrow',Arial,sans-serif;}
  .p-card{background:#fff;border:none;border-radius:0;padding:10px 12px 8px;height:${AUTO?'auto':CH+'px'};display:flex;flex-direction:column;}
  .p-card-h{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:6px;}
  .p-card-t{font-weight:800;font-size:11px;color:#000;line-height:1.15;}
  .p-card-s{font-weight:400;font-size:10px;color:#000;margin-top:2px;}
  .chart{flex:1;min-height:0;} .chart svg{width:100%;height:100%;display:block;}
  .ytick{font-weight:700;font-size:8px;fill:#000;} .xlab{font-weight:700;font-size:8px;fill:#000;} .val{font-weight:700;font-size:8px;fill:#000;}
  .foot{font-size:8px;color:#000;margin-top:5px;padding-top:5px;display:flex;justify-content:space-between;}
  .cardtools{display:flex;flex-direction:column;align-items:flex-end;gap:3px;}
  .lg{display:flex;gap:8px;align-items:center;flex-wrap:wrap;justify-content:flex-end;max-width:255px;padding-top:2px;}
  .lg span{display:inline-flex;align-items:center;gap:4px;font-size:8.5px;font-weight:600;color:#000;white-space:nowrap;}
  .vtab{width:100%;border-collapse:collapse;font-size:17px;color:#000;margin-top:4px;border-top:2px solid #000;border-bottom:2px solid #000;}
  .vtab th{background:#D9D9D9;color:#000;font-weight:800;padding:8px 10px;border-bottom:1px solid #000;text-align:center;font-size:16px;}
  .vtab th.grp{background:#BFBFBF;font-size:16px;letter-spacing:.2px;}
  .vtab td{padding:8px 10px;border-bottom:1px solid #D9D9D9;text-align:right;background:#fff;}
  .vtab tbody tr:last-child td{border-bottom:none;}
  .vtab td.cm{text-align:left;font-weight:800;}
  .vtab td.est{background:#FBF7EC;text-align:center;}
  .vtab td.arw{text-align:center;font-weight:800;}
  .vtab td.ma{font-weight:800;}
  .mini,.tools{display:none;}
  .vend-txt{font-size:11px;line-height:1.5;color:#000;margin-top:10px;padding-top:8px;border-top:1px solid #E7ECF2;}
  .vend-txt p{margin:0 0 7px;}
  .vend-txt .h1{font-weight:800;}
  .vend-txt .sub{font-style:italic;}
  .vend-txt .sec{font-weight:800;letter-spacing:.4px;margin:9px 0 5px;}
  .vend-note{display:flex;flex-wrap:wrap;gap:4px 20px;color:#475569;font-size:10px;padding:6px 2px 1px;line-height:1.3;}
  .vend-yr{display:block;font-size:9px;color:#475569;}
  .vtab td.vend-est-nd{color:#64748b;font-style:italic;text-align:center;}
  .lg i{width:8px;height:8px;border-radius:2px;display:inline-block;flex:none;}`;
  const xml='<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="'+CW+'" height="'+CHR+'">'+
    '<foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml"><style>'+css+'</style>'+
    clone.outerHTML.replace(/&nbsp;/g,'\u00a0').replace(/<br\s*>/gi,'<br/>')+'</div></foreignObject></svg>';
  const img=new Image();
  img.onload=()=>{const c=document.createElement('canvas');c.width=CW*K;c.height=CHR*K;
    const g=c.getContext('2d');g.fillStyle='#fff';g.fillRect(0,0,c.width,c.height);g.drawImage(img,0,0,c.width,c.height);
    let out=c;
    if(AUTO){
      const d=g.getImageData(0,0,c.width,c.height).data;
      let yb=0;
      for(let y=c.height-1;y>=0;y--){
        let hit=false;
        for(let x=0;x<c.width;x+=9){const i2=(y*c.width+x)*4;if(d[i2]<250||d[i2+1]<250||d[i2+2]<250){hit=true;break;}}
        if(hit){yb=y;break;}
      }
      const hh=Math.min(c.height,yb+10*K);
      const c2=document.createElement('canvas');c2.width=c.width;c2.height=hh;
      const g2=c2.getContext('2d');g2.fillStyle='#fff';g2.fillRect(0,0,c2.width,c2.height);g2.drawImage(c,0,0);
      out=c2;
    }
    const a=document.createElement('a');a.download=tit.replace(/[^a-z0-9]+/gi,'_')+'.png';a.href=out.toDataURL('image/png');a.click();};
  img.onerror=()=>{ // fallback: só o svg
    const sv0=el.querySelector('.chart svg');
    if(!sv0)return;
    const svg=sv0.cloneNode(true);
    svg.querySelectorAll('[fill],[stroke]').forEach(n=>['fill','stroke'].forEach(a2=>{
      const raw=n.getAttribute(a2);if(!raw||raw.indexOf('var(')<0)return;
      n.setAttribute(a2,raw.replace(/var\((--c\d+)\)/g,(all,k)=>_colors[k]||all));
    }));
    svg.setAttribute('width',W);svg.setAttribute('height',H);
    const st2=document.createElementNS('http://www.w3.org/2000/svg','style');
    st2.textContent="text{font-family:'Arial Nova Cond','Arial Narrow',Arial,sans-serif;}.ytick{font-weight:700;font-size:8px;fill:#000;}.xlab{font-weight:700;font-size:8px;fill:#000;}.val{font-weight:700;font-size:8px;fill:#000;}";
    svg.insertBefore(st2,svg.firstChild);
    svg.querySelectorAll('image[data-wm]').forEach(im=>{im.setAttribute('href',LOGO_HREF);im.setAttributeNS('http://www.w3.org/1999/xlink','xlink:href',LOGO_HREF);});
    svg.querySelectorAll('use').forEach(u=>{
      const img3=document.createElementNS('http://www.w3.org/2000/svg','image');
      ['x','y','width','height','opacity'].forEach(a3=>{const v=u.getAttribute(a3); if(v)img3.setAttribute(a3,v);});
      img3.setAttribute('href',LOGO_HREF);img3.setAttribute('preserveAspectRatio','xMidYMid meet');
      u.replaceWith(img3);
    });
    const x2=new XMLSerializer().serializeToString(svg);
    const i2=new Image();i2.onload=()=>{const c=document.createElement('canvas');c.width=W*3;c.height=H*3;
      const g=c.getContext('2d');g.fillStyle='#fff';g.fillRect(0,0,c.width,c.height);g.drawImage(i2,0,0,c.width,c.height);
      const a=document.createElement('a');a.download=tit.replace(/[^a-z0-9]+/gi,'_')+'.png';a.href=c.toDataURL('image/png');a.click();};
    i2.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(x2);};
  img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(xml);
}

const BUILD='e96 · 05Nov';
let LOGO_URL='';
try{const _b64=null; }catch(e){}
function _mkLogoUrl(){try{const b64=LOGO_HREF.split(',')[1];const bin=atob(b64);const u8=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u8[i]=bin.charCodeAt(i);return URL.createObjectURL(new Blob([u8],{type:'image/png'}));}catch(e){return LOGO_HREF;}}
function wmEnsure(scope){const sv=(scope||document).querySelector('.chart svg');if(!sv)return;
  if(sv.querySelector('[data-wm]'))return;
  try{sv.insertAdjacentHTML('afterbegin',WM);}catch(e){}}
function wmFix(scope){if(!document.createElementNS)return;if(!LOGO_URL)LOGO_URL=_mkLogoUrl();
  (scope||document).querySelectorAll('image[data-wm]').forEach(im=>{
    if(im.getAttribute('href')!==LOGO_URL){im.setAttribute('href',LOGO_URL);try{im.setAttributeNS('http://www.w3.org/1999/xlink','xlink:href',LOGO_URL);}catch(e){}}
  });
  (scope||document).querySelectorAll('use[data-wm]').forEach(u=>{
    const im=document.createElementNS('http://www.w3.org/2000/svg','image');
    ['x','y','width','height','opacity'].forEach(a=>{const v=u.getAttribute(a);if(v)im.setAttribute(a,v);});
    im.setAttribute('href',LOGO_URL);try{im.setAttributeNS('http://www.w3.org/1999/xlink','xlink:href',LOGO_URL);}catch(e){}im.setAttribute('preserveAspectRatio','xMidYMid meet');im.setAttribute('data-wm','1');
    u.replaceWith(im);});}
const LOGO_HREF='data:image/png;base64,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';
function rerenderAll(){
  LADDER=['#c9d1d8',CINZA,BEGE,TEAL,NAVY];
  PAL6=[NAVY,TEAL,BEGE,'#5b7ca6','#63b8b0','#8a9099'];
  PAL6D=PAL6.slice();
  if(window.__SAVED__&&window.__SAVED__.cards)window.__SAVED__.cards={};
  E.coms.forEach(c=>{const g=document.getElementById('g-'+c);if(g&&(rendered[c]||g.children.length)){g.innerHTML='';rendered[c]=0;}});
  const on=document.querySelector('.screen.on');
  if(on&&on.id.startsWith('scr-')&&E.coms.includes(on.id.slice(4)))renderScreen(on.id.slice(4));
}
function collectState(){
  if(window.dynAllOff)try{dynAllOff();}catch(e){}
  document.querySelectorAll('.chart.dynon').forEach(ch=>{const c=ch.closest('.p-card');if(c&&window.dynOff)dynOff(c,true);});
  /* Abas ainda não renderizadas mantêm suas edições pendentes de migração. */
  const cards=Object.assign({},window.__SAVED__&&window.__SAVED__.cards||{});
  document.querySelectorAll('.p-card').forEach(c=>{
    const cl=c.cloneNode(true);
    const so=c.querySelectorAll('select'), sc=cl.querySelectorAll('select');
    so.forEach((s,i2)=>{[...sc[i2].options].forEach(o=>{if(o.value===s.value)o.setAttribute('selected','');else o.removeAttribute('selected');});});
    cl.querySelectorAll('image[data-wm]').forEach(im=>{
      const u=document.createElementNS('http://www.w3.org/2000/svg','use');
      ['x','y','width','height','opacity'].forEach(a=>{const v=im.getAttribute(a);if(v)u.setAttribute(a,v);});
      u.setAttribute('data-wm','1');u.setAttribute('href','#brzlogo');im.replaceWith(u);});
    cl.querySelectorAll('.mini.dyn').forEach(b=>b.remove());
    const chd=cl.querySelector('.chart'); if(chd) chd.classList.remove('dynon');
    cl.querySelectorAll('.sel').forEach(x=>x.classList.remove('sel'));
    const parts=String(c.dataset.card||'').split('|');
    const catalog=parts.length===2&&E.coms.includes(parts[1])?cardsFor(parts[1]).find(x=>x.id===parts[0]):null;
    cards[c.dataset.card]={html:cl.innerHTML, style:c.getAttribute('style')||'',
      sourceBuild:BUILD,sourceDataAtual:E.meta.atual,
      ...(catalog?{baseTitle:catalog.t,baseSubtitle:catalog.s}:{})};
  });
  return {v:2,build:BUILD,dataAtual:E.meta.atual,ts:Date.now(),cards,
    palette:{navy:NAVY,teal:TEAL,bege:BEGE},
    typo:{sizes:Object.assign({},window.TYPO?TYPO.sizes:{}),foot:window.TYPO?!!TYPO.foot:true}};
}
function saveState(){
  window.__SAVED__=collectState();
  let ok=true;
  try{ localStorage.setItem('brz_eua_state', JSON.stringify(window.__SAVED__)); }
  catch(e){ok=false;}
  optStatus();
  toast(ok?'Edições salvas ✓':'Não coube no navegador; use EXPORTAR.');
}
function optStatus(){
  const el=document.getElementById('opt-status'); if(!el)return;
  el.textContent=window.__SAVED__?('Último salvamento: '+new Date(window.__SAVED__.ts).toLocaleString('pt-BR')):'Nenhum salvamento nesta máquina ainda.';
}
function exportarHTML(){
  saveState();
  if(typeof select==='function')select(null);
  document.body.classList.remove('edit');
  const g2=document.getElementById('gear'); if(g2)g2.classList.remove('on');
  const ec=document.getElementById('editctrls'); if(ec)ec.style.display='none';
  const inl2=document.getElementById('inl'); if(inl2)inl2.style.display='none';
  const _t=document.getElementById('toast'); if(_t){_t.style.display='none';_t.textContent='';}
  const curScr=(document.querySelector('.screen.on')||{}).id||'scr-menu';
  show('scr-menu');
  document.querySelectorAll('.mini.dyn').forEach(b=>b.remove());
  document.querySelectorAll('script[src]').forEach(s=>{if(/echarts|sheetjs|xlsx/i.test(s.src))s.remove();});
  document.querySelectorAll('#typo-panel').forEach(el=>el.remove());
  const dm=document.getElementById('dynmodal'); if(dm)dm.remove();
  const st=document.getElementById('eua-state');
  st.textContent='window.__SAVED__='+JSON.stringify(window.__SAVED__)+';';
  /* outerHTML serializa defaultSelected, não o valor vivo do <select>.
     Espelha a seleção atual nos atributos para o HTML exportado reabrir
     exatamente na mesma semana, país, safra e filtro. */
  document.querySelectorAll('select').forEach(s=>{
    [...s.options].forEach((o,i2)=>{if(i2===s.selectedIndex)o.setAttribute('selected','');else o.removeAttribute('selected');});
  });
  const html=('<!DOCTYPE html>\n'+document.documentElement.outerHTML).replace(/<image\b[^>]*\bdata-wm="1"[^>]*>(?:\s*<\/image>)?/g,WM);
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([html],{type:'text/html;charset=utf-8'}));
  a.download='brz_eua_app_'+BUILD.split(' ')[0]+'.html';a.click();
  document.querySelectorAll('.p-card').forEach(c=>{if(typeof injectDynBtn==='function')injectDynBtn(c);});
  if(window.buildTypoPanel)buildTypoPanel();
  show(curScr);
  toast('Exportado com edições ('+BUILD+').');
}
function baixarTodosCSV(){
  const head=['Semana','Destino','MY','SemMY','Embarcado','AEmbarcar','Commit','BookMY1'];
  const files=E.coms.map(com=>{
    const d=E.dados[com],ordem=['MUNDO','UNKNOWN',...d.paises.filter(p=>p!=='MUNDO'&&p!=='UNKNOWN')],rows=[];
    ordem.forEach(p=>{(d.s[p]||[]).forEach(r=>rows.push([periodEndISO(r[0]),p==='MUNDO'?'MUNDO':(p==='UNKNOWN'?'Unknown':p),myLbl(r[1]),r[2],r[3],r[4],r[3]+r[4],r[5]]));});
    rows.sort((a,b)=>a[0]<b[0]?1:a[0]>b[0]?-1:(a[1]<b[1]?-1:1));
    return {name:'base_esr_'+com+'.csv',data:csvText(head,rows)};
  });
  const a=document.createElement('a');a.download='bases_esr_5_commodities.zip';a.href=URL.createObjectURL(zipStore(files));a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),3000);toast('ZIP exportado · 5 bases CSV');
}
function zipStore(files){
  const enc=new TextEncoder(),parts=[],cent=[],u16=n=>[n&255,(n>>>8)&255],u32=n=>[n&255,(n>>>8)&255,(n>>>16)&255,(n>>>24)&255];
  const join=arr=>{const n=arr.reduce((s,a)=>s+a.length,0),o=new Uint8Array(n);let p=0;arr.forEach(a=>{o.set(a,p);p+=a.length;});return o;};
  let tab=zipStore._crc;if(!tab){tab=zipStore._crc=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=(c&1)?0xEDB88320^(c>>>1):c>>>1;tab[n]=c>>>0;}}
  const crc32=b=>{let c=0xFFFFFFFF;for(const x of b)c=tab[(c^x)&255]^(c>>>8);return (c^0xFFFFFFFF)>>>0;};
  let off=0;
  files.forEach(f=>{
    const nb=enc.encode(f.name),db=enc.encode(f.data),crc=crc32(db);
    const lh=new Uint8Array([...u32(0x04034b50),...u16(20),...u16(0x0800),...u16(0),...u16(0),...u16(0),...u32(crc),...u32(db.length),...u32(db.length),...u16(nb.length),...u16(0)]);
    const local=join([lh,nb,db]);parts.push(local);
    const ch=new Uint8Array([...u32(0x02014b50),...u16(20),...u16(20),...u16(0x0800),...u16(0),...u16(0),...u16(0),...u32(crc),...u32(db.length),...u32(db.length),...u16(nb.length),...u16(0),...u16(0),...u16(0),...u16(0),...u32(0),...u32(off)]);
    cent.push(join([ch,nb]));off+=local.length;
  });
  const cd=join(cent),eocd=new Uint8Array([...u32(0x06054b50),...u16(0),...u16(0),...u16(files.length),...u16(files.length),...u32(cd.length),...u32(off),...u16(0)]);
  return new Blob([...parts,cd,eocd],{type:'application/zip'});
}


let _lgK=0;
function chip(lb,cor,bold){_lgK++;const hx=/^#[0-9a-fA-F]{3}$/.test(cor)?'#'+cor.slice(1).split('').map(x=>x+x).join(''):cor;return `<span${bold?' style="font-weight:800;color:#000"':''}><input type="color" class="lgc" data-var="--c${_lgK}" value="${hx}" title="Cor da série"><b class="etext">${lb}</b></span>`;}
function rewriteVars(svg,map){for(const m of map){svg=svg.split('"'+m.cor+'"').join('"var('+m.v+')"');}return svg;}
function legHTML(c,com,pais,my,wk){
  const cid=c.id, ys=MYS(com), cy=ys[ys.length-1];
  const lad=i=>LADDER[i+LADDER.length-ys.length]||NAVY;
  const safChips=(lblFn,presFn)=>ys.map((y,i)=>presFn(y)?chip(lblFn(y),lad(i),y===cy):'').join('');
  if(['commit','accum','outst'].includes(cid))
    return safChips(y=>myLbl(y),y=>S(com,pais).some(r=>r[1]===y));
  if(cid==='book'||cid==='bookpct')
    return safChips(y=>myLbl(y+1),y=>S(com,pais).some(r=>r[1]===y&&r[5]!=null)||(com==='soja'&&pais==='China'&&y===cy));
  if(cid==='prognova'||cid==='prognovapct')
    return safChips(y=>myLbl(y+1),y=>S(com,'MUNDO').some(r=>r[1]===y&&r[5]!=null))+chip('proje\u00e7\u00e3o ex-guerra',TEAL,false);
  if(cid==='iniprog')
    return (pais&&pais!=='MUNDO')?(chip(pais==='UNKNOWN'?'Unknown':pais,TEAL,true)+chip('demais destinos',GELO,false)):chip('book total',GELO,true);
  if(cid==='mensal')
    return safChips(y=>myLbl(y),y=>S(com,pais).some(r=>r[1]===y));
  if(cid==='saz') return chip('banda p10–p90 · 90–24',GELO)+chip('mediana',PRETO)+chip(myLbl(MYS(com).at(-1))+' · % do WASDE',NAVY,1);
  if(cid==='triplo') return chip('ano passado','#c9b08a')+chip('sem. passada','#8fa3b8')+chip('atual',NAVY,1);
  if(cid==='grupo') return chip('embarcado',NAVY)+chip('a embarcar',TEAL);
  if(cid==='area') return chip('embarcado',NAVY)+chip('a embarcar',TEAL);
  if(cid==='dumb'){const py=ys[ys.length-2];return chip(myLbl(py),CINZA)+chip(myLbl(cy)+' · alta',TEAL)+chip(myLbl(cy)+' · queda',NAVY);}
  if(cid==='sharesafra'){
    const tops=E.dados[com].paises.filter(p=>p!=='MUNDO'&&p!=='UNKNOWN').slice(0,5);
    return tops.map((p,i)=>chip(p,PAL6[i])).join('')+chip('Unknown','#c9b06a')+chip('Outros','#e3e7eb');
  }
  if(cid==='sharenmy'){
    const tops=nmyShareCtx(com,wk).tops;
    return tops.map((p,i)=>chip(p,PAL6[i])).join('')+chip('Unknown','#c9b06a')+chip('Outros','#e3e7eb');
  }
  if(cid==='regua') return chip('commit safras',NAVY)+chip('safra atual',TEAL,1)+chip('média','#a7b0b8');
  if(cid==='commitpct')return chip('anos anteriores',NAVY)+chip('safra atual',TEAL,1)+chip('média histórica','#a7b0b8')+'<span title="Share do compromisso do país no compromisso total mundial" style="display:inline-flex;align-items:center;gap:5px"><span aria-hidden="true" style="display:inline-block;position:relative;width:20px;height:10px;flex:0 0 auto"><span style="position:absolute;left:0;right:0;top:50%;border-top:2px solid #454545;transform:translateY(-50%);"></span><span style="position:absolute;left:50%;top:50%;width:4px;height:4px;background:#454545;border-radius:50%;transform:translate(-50%,-50%);"></span></span><b class="etext">share '+pais+'</b></span>';
  if(cid==='netsafra') return chip('net sales',NAVY)+chip('safra atual',TEAL,1);
  if(cid==='rank') return chip('commit '+myLbl(cy),NAVY);
  if(cid==='exec') return chip('embarcado ÷ commit',NAVY);
  if(cid==='cohort') return chip('Δ vs média hist.',TEAL);
  if(cid==='wasde') return (window.WASDE_SZN&&WASDE_SZN[com])?'':(chip('Commitment',NAVY,1)+chip('100%','#B5963E'));
  if(cid==='ritmo') return safChips(y=>myLbl(y),y=>S(com,'MUNDO').some(r=>r[1]===y))+chip(myLbl(cy+1)+' · book',TEAL,1);
  if(cid==='net') return chip('net da semana',GELO)+chip('média 4 sem',NAVY,1);
  if(cid==='fluxocn') return chip('net China',GELO)+chip('média 4 sem',NAVY,1);
  if(cid==='wexp') return chip('embarques/sem',NAVY)+chip('média 4 sem',NAVY,1);
  if(cid==='switched') return chip('switched → China',TEAL);
  return '';
}

const rendered={};
/* BRZ EUA — migração entre builds USDA (somente camada de apresentação).
   Os gráficos são regenerados com a base oficial atual. Nunca copiar o SVG ou séries de uma build anterior. */
function applyCardRebase(el,sv,c){
  if(!sv||typeof sv.html!=='string')return el;
  const old=document.createElement('div');old.innerHTML=sv.html;
  const title=old.querySelector('.p-card-t'),subtitle=old.querySelector('.p-card-s');
  const freshTitle=el.querySelector('.p-card-t'),freshSubtitle=el.querySelector('.p-card-s');
  const transferText=(previous,current,baseline)=>{
    if(!previous||!current)return;
    const text=(previous.textContent||'').trim();
    if(text && (baseline==null?text!==(current.textContent||'').trim():text!==String(baseline).trim()))current.textContent=previous.textContent;
    if(previous.getAttribute('style'))current.setAttribute('style',previous.getAttribute('style'));
  };
  transferText(title,freshTitle,sv.baseTitle);
  transferText(subtitle,freshSubtitle,sv.baseSubtitle);
  if(sv.style)el.setAttribute('style',sv.style);
  const oldSelects=Array.from(old.querySelectorAll('select[data-role]'));
  const rerender=[];
  for(const os of oldSelects){
    const role=os.dataset.role,ns=el.querySelector('select[data-role="'+role+'"]');
    if(!ns)continue;
    const selected=os.querySelector('option[selected]')?.value ?? os.value;
    if(Array.from(ns.options).some(o=>o.value===selected) && ns.value!==selected){ns.value=selected;rerender.push(role);}
  }
  if(rerender.length && typeof el._syncControls==='function')el._syncControls();
  /* Cores reaplicadas pela identidade da série/legenda, não por índice do gráfico. */
  const legends=new Map();
  old.querySelectorAll('.lg span').forEach(span=>{
    const name=(span.querySelector('b')?.textContent||'').trim();
    const input=span.querySelector('input.lgc');
    if(name&&input)legends.set(name,{color:input.getAttribute('value')||input.value,
      labelStyle:span.querySelector('b')?.getAttribute('style')||'',spanStyle:span.getAttribute('style')||''});
  });
  let redraw=false;
  const applyLegends=()=>{
    el.querySelectorAll('.lg span').forEach(span=>{
      const name=(span.querySelector('b')?.textContent||'').trim(),stored=legends.get(name),input=span.querySelector('input.lgc');
      if(!stored||!input)return;
      if(/^#[0-9a-f]{6}$/i.test(stored.color)){
        const cssVar=input.dataset.var;
        if(cssVar){el._vars=el._vars||{};if(el._vars[cssVar]!==stored.color){el._vars[cssVar]=stored.color;redraw=true;}el.style.setProperty(cssVar,stored.color);}
        input.value=stored.color;
      }
      if(stored.labelStyle&&span.querySelector('b'))span.querySelector('b').setAttribute('style',stored.labelStyle);
      if(stored.spanStyle&&!/opacity:\s*0(?:\.35)?;?/.test(stored.spanStyle))span.setAttribute('style',stored.spanStyle);
    });
  };
  applyLegends();
  if(redraw&&typeof el._draw==='function')el._draw();
  applyLegends();
  /* Fontes de rótulos nominais, sem reutilizar coordenadas ou valores antigos. */
  const oldLabels=new Map();
  old.querySelectorAll('.chart svg text').forEach(t=>{
    const value=(t.textContent||'').trim();
    if(!value||!/[^\W\d_]/u.test(value)||/\d/.test(value))return;
    if(t.hasAttribute('style'))oldLabels.set(value,t.getAttribute('style'));
  });
  el.querySelectorAll('.chart svg text').forEach(t=>{
    const value=(t.textContent||'').trim(),style=oldLabels.get(value);
    if(style)t.setAttribute('style',style);
  });
  /* Reaplicar após _draw(), que pode executar typoApply e redefinir fontes. */
  transferText(title,freshTitle,sv.baseTitle);
  transferText(subtitle,freshSubtitle,sv.baseSubtitle);
  return el;
}
function buildCard(com,c){
    const key=c.id+'|'+com;
    const sv=window.__SAVED__&&window.__SAVED__.cards&&window.__SAVED__.cards[key];
    if(sv && ((sv.sourceBuild && sv.sourceBuild!==BUILD) || (sv.sourceDataAtual && sv.sourceDataAtual!==E.meta.atual))){
      delete window.__SAVED__.cards[key];
      let rebuilt;
      try{rebuilt=buildCard(com,c);applyCardRebase(rebuilt,sv,c);}
      catch(e){window.__SAVED__.cards[key]=sv;throw e;}
      window.__SAVED__.cards[key]={html:rebuilt.innerHTML,style:rebuilt.getAttribute('style')||'',
        sourceBuild:BUILD,sourceDataAtual:E.meta.atual,baseTitle:c.t,baseSubtitle:c.s};
      return rebuilt;
    }
    if(sv && !(c.id==='commitpct' && (!sv.html.includes('data-role="country"')||!sv.html.includes('data-commitpct-axis="e79"'))) && !(c.id==='heatcommit'&&!sv.html.includes('data-role="metric"'))){
      const el=document.createElement('div');el.className='p-card';el.dataset.card=c.id+'|'+com;
      el.innerHTML=sv.html; if(sv.style)el.setAttribute('style',sv.style);
      reviveCard(el,com,c);
      return el;
    }
    const el=document.createElement('div');el.className='p-card';
    const hd=document.createElement('div');hd.className='p-card-h';
    hd.innerHTML=`<div><div class="p-card-t etext">${c.t}</div><div class="p-card-s etext">${c.s}</div></div>`;
    const tools=document.createElement('div');tools.className='cardtools';
    const lg=document.createElement('div');lg.className='lg';tools.appendChild(lg);
    const ctrow=document.createElement('div');ctrow.className='ctrow';tools.appendChild(ctrow);
    const selrow=document.createElement('div');selrow.className='selrow';ctrow.appendChild(selrow);
    const ch=document.createElement('div');ch.className='chart';
    let pais=c.share?commitPctDefaultPais(com):'MUNDO';let my=null;let wk=wkNow(com);let metric='share';
    el._vars={};
    const draw=()=>{
      _lgK=0;
      const lgHtml=legHTML(c,com,pais,my,wk)||'';
      const map=[...lgHtml.matchAll(/data-var="(--c\d+)" value="(#[0-9a-fA-F]{6})"/g)].map(m=>({v:m[1],cor:m[2]}));
      const seen={};const mapU=map.filter(m=>{if(seen[m.cor])return false;seen[m.cor]=m.v;return true;});
      HIDDEN=el._hidden||null;
      let svg;
      if(c.id==='heatcommit')svg=c.fn(com,wk,metric);
      else if(c.sem&&(c.filt||c.share))svg=c.fn(com,pais,wk);
      else if(c.sem)svg=c.fn(com,wk);
      else svg=c.saf?c.fn(com,pais,my):(c.filt?c.fn(com,pais):c.fn(com));
      HIDDEN=null;
      svg=svg.replace(/(<text[^>]*?fill=")(?!#fff\b|#FFF\b|#ffffff\b|#FFFFFF\b|white\b)([^"]+)(")/g,'$1#000$3');
      svg=rewriteVars(svg,mapU);
      svg=svg.replace(/<text([^>]*?) font-size="8"([^>]*?) font-weight="700"([^>]*)>/g,'<text class="val"$1$2$3>')
               .replace(/<text([^>]*?) font-weight="700"([^>]*?) font-size="8"([^>]*)>/g,'<text class="val"$1$2$3>');
      svg=svg.replace(/<text([^>]*?)class="([^"]*)"/g,'<text$1class="etext $2"')
               .replace(/<text(?![^>]*class=)([^>]*)>/g,'<text class="etext"$1>');
      svg=svg.replace(/(<text[^>]*?fill=")(#0F2638|#123)(")/g,'$1#000$3');
      map.forEach(m=>el.style.setProperty(m.v,seen[m.cor]===m.v?m.cor:el.style.getPropertyValue(seen[m.cor])||m.cor));
      mapU.forEach(m=>el.style.setProperty(m.v,el._vars[m.v]||m.cor));
      ch.innerHTML=svg;
      if(c.id==='commitpct')commitPctHeading(el,com,wk);
      if(c.id==='heatcommit')heatCommitHeading(el,com,wk,metric);
      wmFix(el);
      lg.innerHTML=lgHtml;
      lg.querySelectorAll('input.lgc').forEach(inp=>{const ov=el._vars[inp.dataset.var];if(ov)inp.value=ov;});
      if(el._hidden&&el._hidden.size){lg.querySelectorAll('span').forEach(sp2=>{const b2=sp2.querySelector('b');
        if(b2&&el._hidden.has(b2.textContent)){sp2.style.opacity='.35';sp2.title='série oculta, filtrada no modo dinâmico';}});}
      wirePal(el);
      if(window.typoApply)typoApply(el);
      if(window.BRZFIT)BRZFIT(el);
    };
    if(c.sem){
      const sw=document.createElement('select');sw.className='selp';sw.dataset.role='week';sw.style.maxWidth='72px';
      weeksAvailable(com).forEach(w=>{const o=document.createElement('option');o.value=w;o.textContent='Sem. '+w;if(w===wk)o.selected=true;sw.appendChild(o);});
      sw.onchange=()=>{wk=+sw.value;if(typeof dynOff==='function')dynOff(el,true);draw();};
      selrow.appendChild(sw);
    }
    if(c.id==='heatcommit'){
      const smode=document.createElement('select');smode.className='selp';smode.dataset.role='metric';
      smode.title='Alternar entre participação no total e volume absoluto de commitment';
      smode.style.maxWidth='112px';
      [{v:'share',pt:'Share (%)',en:'Share (%)'},{v:'volume',pt:'Volume (Mi t)',en:'Volume (Mmt)'}].forEach(a=>{
        const op=document.createElement('option');op.value=a.v;op.textContent=document.documentElement.dataset.lang==='en'?a.en:a.pt;smode.appendChild(op);
      });
      smode.value=metric;
      smode.onchange=()=>{metric=smode.value;if(typeof dynOff==='function')dynOff(el,true);draw();};
      selrow.appendChild(smode);
    }
    if(c.saf){
      const ss=document.createElement('select');ss.className='selp';ss.dataset.role='my';ss.style.maxWidth='64px';
      MYS(com).slice().reverse().forEach((y,i2)=>{const o=document.createElement('option');o.value=y;o.textContent='MY '+myLbl(y);if(i2===0)o.selected=true;ss.appendChild(o);});
      ss.onchange=()=>{my=+ss.value;if(typeof dynOff==='function')dynOff(el,true);draw();};
      selrow.appendChild(ss);
    }
    if(c.filt||c.share){
      const sel=document.createElement('select');sel.className='selp';sel.dataset.role='country';
      sel.title=c.share?'Share por destino: commitment do país ÷ commitment Mundo (mesma semana de cada MY)':'País';
      E.dados[com].paises.filter(p=>!c.share||p!=='MUNDO').forEach(p=>{const o=document.createElement('option');o.value=p;o.textContent=p==='MUNDO'?'Mundo':(p==='UNKNOWN'?'Unknown':p);if(p===pais)o.selected=true;sel.appendChild(o);});
      sel.onchange=()=>{pais=sel.value;if(typeof dynOff==='function')dynOff(el,true);draw();};
      selrow.appendChild(sel);
    }
    const pal=document.createElement('div');pal.className='pal';
    const rb=document.createElement('button');rb.className='mini rst';rb.textContent='↺';rb.title='Restaurar card';pal.appendChild(rb);
    const b=document.createElement('button');b.className='mini png';b.textContent='⤓';b.title='PNG do card (3×)';
    b.onclick=()=>baixar(el,(el.querySelector('.p-card-t')?.textContent||c.t)+(c.id==='heatcommit'?'_'+metric:'')+((c.filt||c.share)?'_'+pais:'')+(c.sem?'_sem_'+wk:''));pal.appendChild(b);
    if(c.id==='wasde'){
      const bs=document.createElement('button');bs.className='mini szn';bs.textContent='\u224b';bs.title='Sazonal: alinhar safras por semana do MY';
      bs.onclick=()=>{const on2=!bs.classList.contains('on');bs.classList.toggle('on',on2);WASDE_SZN[com]=on2;draw();};
      pal.appendChild(bs);
    }
    ctrow.appendChild(pal);
    const ft=document.createElement('div');ft.className='foot';
    ft.innerHTML=`<span class="etext">Fonte: USDA-FAS ESR · BRZ</span><span class="etext">${c.u}</span>`;
    el.appendChild(hd);el.appendChild(ch);el.appendChild(ft);
    hd.insertBefore(tools,null);
    el.dataset.card=c.id+'|'+com; el._getPais=()=>pais; el._getMy=()=>my;el._getWeek=()=>wk;el._getMode=()=>metric;
    el._syncControls=()=>{const sp=el.querySelector('select[data-role="country"]'),sm=el.querySelector('select[data-role="my"]'),sw=el.querySelector('select[data-role="week"]'),sv=el.querySelector('select[data-role="metric"]');if(sp)pais=sp.value;if(sm)my=+sm.value;if(sw)wk=+sw.value;if(sv)metric=sv.value;draw();};
    el._draw=draw;
    el._rebuild=()=>{const novo=buildCard(com,c);el.replaceWith(novo);};
    draw();
    if(typeof injectDynBtn==='function')injectDynBtn(el);
    return el;
}
function reviveCard(el,com,c){
  if(c.id==='heatcommit'&&!el.querySelector('select[data-role="metric"]')){
    const week=el.querySelector('select[data-role="week"]')?.value;
    const style=el.getAttribute('style');
    const titleFont=el.querySelector('.p-card-t')?.style.fontSize;
    const subFont=el.querySelector('.p-card-s')?.style.fontSize;
    if(window.__SAVED__&&window.__SAVED__.cards)delete window.__SAVED__.cards[c.id+'|'+com];
    const novo=buildCard(com,c);
    const sw=novo.querySelector('select[data-role="week"]');if(sw&&week)sw.value=week;
    if(style)novo.setAttribute('style',style);
    if(titleFont)novo.querySelector('.p-card-t').style.fontSize=titleFont;
    if(subFont)novo.querySelector('.p-card-s').style.fontSize=subFont;
    if(novo._syncControls)novo._syncControls();
    el.replaceWith(novo);
    return;
  }
  if(c.id==='commitpct'&&!el.querySelector('svg[data-commitpct-axis="e79"]')){
    const key=c.id+'|'+com,sw=el.querySelector('select[data-role="week"]');
    const oldWeek=sw?+sw.value:wkNow(com),oldCountry=el.querySelector('select[data-role="country"]')?.value,style=el.getAttribute('style');
    const oldT=el.querySelector('.p-card-t'),oldS=el.querySelector('.p-card-s');
    if(window.__SAVED__&&window.__SAVED__.cards)delete window.__SAVED__.cards[key];
    const novo=buildCard(com,c);
    const nw=novo.querySelector('select[data-role="week"]');if(nw)nw.value=String(oldWeek);
    const nc=novo.querySelector('select[data-role="country"]');if(nc&&oldCountry&&[...nc.options].some(o=>o.value===oldCountry))nc.value=oldCountry;
    if(style)novo.setAttribute('style',style);
    [[oldT,novo.querySelector('.p-card-t')],[oldS,novo.querySelector('.p-card-s')]].forEach(pair=>{
      if(pair[0]&&pair[1]&&pair[0].style.fontSize)pair[1].style.fontSize=pair[0].style.fontSize;});
    if(novo._syncControls)novo._syncControls();
    el.replaceWith(novo);
    return;
  }
  wmEnsure(el);
  wmFix(el);
  const sels=el.querySelectorAll('select');
  el._getPais=()=>{const s=[...sels].find(x=>x.dataset.role==='country')||[...sels].find(x=>x.options.length&&!x.style.maxWidth);return s?s.value:'MUNDO';};
  el._getMy=()=>{const s=[...sels].find(x=>x.dataset.role==='my');return s?+s.value:null;};
  el._getWeek=()=>{const s=[...sels].find(x=>x.dataset.role==='week');return s?+s.value:wkNow(com);};
  el._getMode=()=>{const s=[...sels].find(x=>x.dataset.role==='metric');return s?s.value:'share';};
  if(c.id==='commitpct')commitPctHeading(el,com,el._getWeek());
  if(c.id==='heatcommit')heatCommitHeading(el,com,el._getWeek(),el._getMode());
  el._rebuild=()=>{if(window.__SAVED__&&window.__SAVED__.cards)delete window.__SAVED__.cards[c.id+'|'+com];const novo=buildCard(com,c);el.replaceWith(novo);};
  sels.forEach(s=>{s.onchange=()=>{if(window.__SAVED__&&window.__SAVED__.cards)delete window.__SAVED__.cards[c.id+'|'+com];const novo=buildCard(com,c);const sn=novo.querySelectorAll('select');sels.forEach((o2,i2)=>{if(sn[i2])sn[i2].value=o2.value;});if(novo._syncControls)novo._syncControls();el.replaceWith(novo);};});
  const png=el.querySelector('.mini.png'); if(png)png.onclick=()=>baixar(el,(el.querySelector('.p-card-t')||{}).textContent||'card');
  el.querySelectorAll('.chart svg text').forEach(t=>{const f=t.getAttribute('fill');if(f&&f!=='white'&&!/^#f{3}(f{3})?$/i.test(f))t.setAttribute('fill','#000');});
  const dimK=[...el.querySelectorAll('.lg span')].filter(sp=>(sp.title||'').indexOf('oculta')>-1).map(sp=>{const b2=sp.querySelector('b');return b2?b2.textContent:null;}).filter(Boolean);
  el.querySelectorAll('.chart svg text[opacity="0.35"]').forEach(t=>{const k=(t.textContent||'').trim();if(k)dimK.push(k);});
  if(dimK.length&&typeof DYN_HID_OK!=='undefined'&&DYN_HID_OK.has((el.dataset.card||'').split('|')[0]))el._hidden=new Set(dimK);
  /* migração: cards assados em build antiga -> reconstrói preservando edições */
  const __sv=((el.querySelector('.chart svg')||{}).outerHTML)||'';
  if((c.id==='wexp'&&!/<polyline/.test(__sv))||(c.id==='ritmo'&&(__sv.match(/<polyline/g)||[]).length<3)){
    if(window.__SAVED__&&window.__SAVED__.cards)delete window.__SAVED__.cards[c.id+'|'+com];
    const novo=buildCard(com,c);
    const so=el.querySelectorAll('select'),sn=novo.querySelectorAll('select');
    sn.forEach((s2,i2)=>{const o2=so[i2];if(o2)s2.value=o2.value;});
    if(novo._syncControls)novo._syncControls();
    [['.p-card-t'],['.p-card-s']].forEach(([q])=>{const a=el.querySelector(q),b2=novo.querySelector(q);
      if(a&&b2){b2.textContent=a.textContent;if(a.style.fontSize)b2.style.fontSize=a.style.fontSize;}});
    novo._hidden=el._hidden||null;
    el.replaceWith(novo);
    if(novo._hidden&&novo._draw)novo._draw();
    return;
  }
  if(typeof wirePal==='function')wirePal(el);
  if(typeof injectDynBtn==='function')injectDynBtn(el);
  if((el.dataset.card||'').split('|')[0]==='iniprog'){
    const s0=el.querySelector('.p-card-s');
    if(s0&&s0.textContent.indexOf('semana selecionada')<0)s0.textContent='Em Mi t \u00b7 book de safra nova na semana selecionada de cada ciclo';
  }
  if((el.dataset.card||'').split('|')[0]==='wasde'){
    const com2=(el.dataset.card||'').split('|')[1];
    const tt=el.querySelector('.p-card-t'),ss2=el.querySelector('.p-card-s');
    if(tt&&tt.textContent.trim()==='Commit \u00f7 WASDE - '+E.nome[com2])tt.textContent='Commitment - '+E.nome[com2];
    if(ss2&&ss2.textContent.trim()==='Em % do projetado \u00b7 s\u00e9rie semanal, proje\u00e7\u00e3o do pr\u00f3prio ESR')ss2.textContent='Em % da meta WASDE vigente';
    el.querySelectorAll('.lg b').forEach(b2=>{const t2=b2.textContent.trim();
      if(t2==='Commit \u00f7 WASDE')b2.textContent='Commitment';
      else if(t2==='linha 100%')b2.textContent='100%';});
    const pal2=el.querySelector('.pal');
    let bs=el.querySelector('.mini.szn');
    if(!bs&&pal2){bs=document.createElement('button');bs.className='mini szn';bs.textContent='\u224b';bs.title='Sazonal: alinhar safras por semana do MY';pal2.appendChild(bs);}
    if(bs){
      const svOn=!!(window.__SAVED__&&window.__SAVED__.cards&&/mini szn on/.test(((window.__SAVED__.cards[el.dataset.card]||{}).html)||''));
      if(svOn)bs.classList.add('on');
      if(bs.classList.contains('on')){WASDE_SZN[com2]=true;wasdeSwap(el,com2);}
      bs.onclick=()=>{const on2=!bs.classList.contains('on');bs.classList.toggle('on',on2);WASDE_SZN[com2]=on2;if(el._draw)el._draw();else wasdeSwap(el,com2);};
    }
  }
  if(window.typoApply)typoApply(el);
  if(window.BRZFIT)BRZFIT(el);
}
function renderScreen(com){
  if(!E.coms.includes(com))return;
  if(rendered[com])return; rendered[com]=1;
  const scr=document.getElementById('g-'+com);
  if(!scr)return;
  if(scr.children.length){
    [...scr.children].forEach(el=>{const cid=(el.dataset.card||'').split('|')[0];const c=cardsFor(com).find(x=>x.id===cid);if(c)reviveCard(el,com,c);else el.remove();});
    /* reconciliação: cards do catálogo ausentes na grade adotada (introduzidos em builds novas) */
    const cat=cardsFor(com);
    cat.forEach((c,i)=>{
      if(scr.querySelector('[data-card="'+c.id+'|'+com+'"]'))return;
      const novo=buildCard(com,c);
      const prox=cat.slice(i+1).map(x=>scr.querySelector('[data-card="'+x.id+'|'+com+'"]')).find(Boolean);
      if(prox)scr.insertBefore(novo,prox);else scr.appendChild(novo);
    });
    return;
  }
  cardsFor(com).forEach(c=>scr.appendChild(buildCard(com,c)));
}

/* ═══ ABA: VENDAS SEMANAIS REPORT ═══ */
const VEND_ORD=['trigo','milho','soja','farelo','oleo'];
function _vendNet(com){
  const rows=S(com,'MUNDO');
  const n=rows.length;
  const cm=i=>rows[i][3]+rows[i][4];
  const reset=i=>cm(i)<cm(i-1)*0.5; /* virada real de MY: acumulado despenca */
  const officialAt=(i,k)=>{
    const d2=i>=0&&rows[i]?periodEndISO(rows[i][0]):null;
    const o=E.deep&&E.deep.vendActual&&d2&&E.deep.vendActual[d2]&&E.deep.vendActual[d2][com];
    return o&&o[k]!=null?o[k]:null;
  };
  const netAt=i=>{if(i<=0)return null;
    const official=officialAt(i,'cy');if(official!=null)return official;
    if(reset(i)){const carry=rows[i-1][5]!=null?rows[i-1][5]:0;return cm(i)-carry;} /* book antigo vira ponto de partida */
    return cm(i)-cm(i-1);};
  const bkAt=i=>{if(i<=0)return null;
    const official=officialAt(i,'nc');if(official!=null)return official;
    if(reset(i))return rows[i][5]!=null?rows[i][5]:null;
    return (rows[i][5]!=null&&rows[i-1][5]!=null)?rows[i][5]-rows[i-1][5]:null;};
  const atual=netAt(n-1),ant=netAt(n-2);
  const atualN=bkAt(n-1),antN=bkAt(n-2);
  const last4=[];for(let i=n-4;i<n;i++){const v=netAt(i);if(v!=null)last4.push(v);}
  const ma4=last4.length?last4.reduce((a,b)=>a+b,0)/last4.length:null;
  return {atual,ant,atualN,antN,ma4,data:periodEndISO(rows[n-1][0]),release:rows[n-1][0],my:rows[n-1][1]};
}
function _vendExtras(com){
  const rows=S(com,'MUNDO'),n=rows.length,r=rows[n-1];
  const cm=i=>rows[i][3]+rows[i][4];
  const my=r[1],sem=r[2];
  const commit=cm(n-1)/1000;
  const wm=E.dados[com].wasde;
  const meta=(wm&&wm.length)?wm[wm.length-1][1]/1000:null;
  const rest=Math.max(52-sem,1);
  const precisa=meta!=null?Math.max(meta-commit,0)*1000/rest:null;
  const ly=my-1;
  const lyRows=S(com,'MUNDO').filter(x=>x[1]===ly);
  let lyMed=null;
  if(lyRows.length){
    const at=lyRows.filter(x=>x[2]<=sem).slice(-1)[0];
    const fim=lyRows[lyRows.length-1];
    if(at&&fim&&fim[2]>at[2])lyMed=((fim[3]+fim[4])-(at[3]+at[4]))/(fim[2]-at[2]);
  }
  // menor leitura do MY vigente
  const idx0=rows.findIndex(x=>x[1]===my);
  let menor=null;
  for(let i=Math.max(idx0,1);i<n;i++){
    if(rows[i][1]!==my)continue;
    const d=(cm(i)<cm(i-1)*0.5)?(cm(i)-(rows[i-1][5]!=null?rows[i-1][5]:0)):(cm(i)-cm(i-1));
    if(menor==null||d<menor)menor=d;
  }
  return {my,sem,commit,meta,precisa,lyMed,menor};
}
function _vendParseEst(td){
  if(!td)return null;
  const t=(td.textContent||'').replace(/\s/g,'');
  const m=t.match(/^([+-]?\d[\d.,]*)a([+-]?\d[\d.,]*)$/i)||t.match(/^([+-]?\d[\d.,]*)-([+-]?\d[\d.,]*)$/);
  if(!m)return null;
  const num=s=>{if(s.includes(','))return +(s.replace(/\./g,'').replace(',','.'));if((s.match(/\./g)||[]).length===1&&!/\.\d{3}$/.test(s))return +s;return +(s.replace(/\./g,''));};
  const a=num(m[1]),b2=num(m[2]);
  return isNaN(a)||isNaN(b2)?null:{min:Math.min(a,b2),max:Math.max(a,b2)};
}
function _vendClasse(v,est){
  if(v==null||!est)return null;
  if(v<est.min)return 'abaixo';
  if(v>est.max)return 'acima';
  return 'dentro';
}
window.gerarVendTexto=function(card){
  const f0b=x=>{let r2=Math.round(x);if(r2===0)r2=0;return NF(r2,0);};
  const dados={};
  VEND_ORD.forEach(com=>{
    const v=_vendNet(com),ex=_vendExtras(com);
    const est=_vendParseEst(card?card.querySelector('[data-est="'+com+'-cy"]'):null);
    const estN=_vendParseEst(card?card.querySelector('[data-est="'+com+'-nc"]'):null);
    const estComb=_vendParseEst(card?card.querySelector('[data-est="'+com+'-comb"]'):null);
    const total=(v.atual==null&&v.atualN==null)?null:(v.atual||0)+(v.atualN||0);
    dados[com]={v,ex,est,estN,estComb,total,
      cls:estComb?_vendClasse(total,estComb):_vendClasse(v.atual,est),
      clsN:estComb?null:_vendClasse(v.atualN,estN)};
  });
  const clsTxt={abaixo:'abaixo das expectativas',dentro:'dentro das expectativas',acima:'acima das expectativas'};
  // manchete: pela distribuicao das classes (fallback: vs média 4 sem)
  const votos=VEND_ORD.map(c2=>dados[c2].cls).filter(Boolean); /* only source-verified expectations, not 4-week mean */
  const nAb=votos.filter(x=>x==='abaixo').length,nAc=votos.filter(x=>x==='acima').length,nDt=votos.filter(x=>x==='dentro').length;
  const soja=dados['soja'];
  const rec=soja.v.atual!=null&&soja.ex.menor!=null&&soja.v.atual<=soja.ex.menor+0.5;
  const tom=(rec&&soja.cls==='abaixo')?'abaixo':(nDt===votos.length&&votos.length?'dentro':(nAb>votos.length/2?'abaixo':(nAc>votos.length/2?'acima':'mistas')));
  let h1;
  let fraco=null,pior=0;
  VEND_ORD.forEach(c2=>{const v2=dados[c2].v;if(v2.atual==null||!(v2.ma4>5))return;
    const dv=(v2.atual-v2.ma4)/Math.abs(v2.ma4);if(dv<pior){pior=dv;fraco=c2;}});
  if(tom==='abaixo')h1='USDA: Vendas abaixo das expectativas'+(rec?', destaque para a soja que renovou recorde negativo para o ano comercial.':(fraco?', com '+(fraco==='soja'?'a soja':'o '+E.nome[fraco].toLowerCase())+' na ponta fraca.':'.'));
  else if(tom==='acima')h1='USDA: Vendas acima das expectativas, com demanda firme na exporta\u00e7\u00e3o.';
  else if(tom==='dentro')h1=votos.length===VEND_ORD.length?'USDA: Vendas dentro das expectativas em todas as commodities.':'USDA: Vendas dentro das expectativas divulgadas para quatro commodities.';
  else h1='USDA: Vendas mistas na semana, sem dire\u00e7\u00e3o \u00fanica entre os produtos.';
  const fracos=['soja','milho'].filter(c2=>(dados[c2].cls==='abaixo'||(dados[c2].cls==null&&dados[c2].v.atual<dados[c2].v.ma4)));
  let sub=fracos.length?('O USDA reportou vendas fracas para '+fracos.map(c2=>E.nome[c2].toLowerCase()).join(' e ')+' americano'+(fracos.length>1?'s':'')+'.')
                         :'O USDA reportou vendas dentro do padr\u00e3o recente.';
  if(!votos.length){h1='USDA: Vendas semanais mistas entre soja, milho e trigo.';sub='Sem consenso pré-relatório verificável para esta leitura; comparativos realizados contra a semana anterior e a média de quatro semanas.';}
  const est2txt=e2=>e2?(' ('+f0b(e2.min)+(e2.min<0?' a ':'-')+f0b(e2.max)+' mil t)'):'';
  const combSales=(label,d,dec)=>{
    const ff=x=>dec===1?NF(Math.round((x||0)*10)/10,1):f0b(x);
    let tx=label+': As vendas combinadas somaram '+ff(d.total)+' mil toneladas'
      +(d.cls?', '+clsTxt[d.cls]+est2txt(d.estComb):'')+'.';
    if(d.v.atualN!=null&&Math.abs(d.v.atualN)>0.05)
      tx+=' A safra corrente respondeu por '+ff(d.v.atual)+' mil t e a safra nova por '+ff(d.v.atualN)+' mil t.';
    return tx;
  };
  // soja
  const s=soja;
  let pSoja=s.estComb?combSales('Soja',s):('Soja: As vendas semanais de soja '+myLbl(s.ex.my)+' somaram '+f0b(s.v.atual)+' mil toneladas'
    +(s.cls?', '+clsTxt[s.cls]+est2txt(s.est):'')+'.')
    +(rec?' \u00c9 a menor leitura do ano comercial.':'')
    +' O comprometido na exporta\u00e7\u00e3o est\u00e1 em '+f1(s.ex.commit)+' Mi t'
    +(s.ex.meta!=null?', com meta de '+f1(s.ex.meta)+' Mi t do USDA at\u00e9 o fim da temporada':'')+'.'
    +(s.ex.precisa!=null?(s.ex.precisa<15?(s.ex.commit>=s.ex.meta?' O comprometido j\u00e1 cobre a meta para a temporada.':' O comprometido praticamente cobre a meta para a temporada.')
      :' Para alcan\u00e7ar a meta, o ritmo teria que ser de '+f0b(s.ex.precisa)+' mil t na m\u00e9dia semanal'
      +(s.ex.lyMed!=null?(s.ex.precisa>=s.ex.lyMed?', acima':', abaixo')+' da m\u00e9dia do ano passado para o mesmo trecho: '+f0b(s.ex.lyMed)+' mil t.':'.')):'')
    +(!s.estComb&&s.v.atualN!=null&&s.v.atualN>0?' Na safra nova, '+f0b(s.v.atualN)+' mil t'+(s.clsN?', '+clsTxt[s.clsN]:'')+'.':'');
  // Complemento oficial do Highlights: net sales China incluem switched, não vendas incrementais.
  const hi=(E.deep.weeklyHighlights||{})[s.v.data];
  if(hi&&hi.soja){
    pSoja+=' China somou '+f0b(hi.soja.china_net)+' mil t em vendas líquidas, incluindo '+f0b(hi.soja.china_switched_from_unknown)+' mil t transferidas de destinos desconhecidos; o Vietnã registrou '+f0b(hi.soja.vietnam_net)+' mil t, incluindo '+f0b(hi.soja.vietnam_switched_from_unknown)+' mil t reclassificadas de Unknown. Os embarques para a China alcançaram '+f0b(hi.soja.china_exports)+' mil t. Os volumes switched já estão incluídos nos saldos semanais, não são vendas adicionais.';
  }
  // farelo
  const fa=dados['farelo'];
  let pFar=(fa.estComb?combSales('Farelo',fa):('Farelo: As vendas somaram '+f0b(fa.v.atual)+' mil toneladas'+(fa.cls?', '+clsTxt[fa.cls]+est2txt(fa.est):'')+'.'))
    +(fa.estComb?' Na safra corrente, a m\u00e9dia de 4 semanas est\u00e1 em ':' M\u00e9dia de 4 semanas em ')+f0b(fa.v.ma4)+' mil t'
    +(fa.v.atual>=fa.v.ma4?', com a demanda de exporta\u00e7\u00e3o sustentada.':'.');
  if(hi&&hi.farelo)pFar+=' Destaque para Colômbia ('+f0b(hi.farelo.net_destinations.Colombia)+' mil t) e República Dominicana ('+f0b(hi.farelo.net_destinations.Dominican_Republic)+' mil t); a Arábia Saudita recebeu '+f0b(hi.farelo.switched_unknown_to_saudi_arabia)+' mil t reclassificadas de Unknown.';
  // oleo
  const ol=dados['oleo'];
  const olMini=Math.abs(ol.v.atual||0)<10;
  const olTxt=olMini?(()=>{let r1=Math.round((ol.v.atual||0)*10)/10;if(r1===0)r1=0;return NF(r1,1);})():f0b(ol.v.atual);
  let pOl=ol.estComb?combSales('\u00d3leo de soja',ol,1):('\u00d3leo de soja: '+olTxt+' mil t na semana'+(ol.cls?', '+clsTxt[ol.cls]:'')+'.');
  if(hi&&hi.oleo)pOl+=' Canadá respondeu por '+NF(hi.oleo.net_destinations.Canada,1)+' mil t das vendas.';
  // milho e trigo
  const mi=dados['milho'],tg=dados['trigo'];
  let pMT='Milho e trigo: '+(mi.estComb?combSales('Milho',mi).replace(/^Milho: /,''):('O milho somou '+f0b(mi.v.atual)+' mil toneladas'+(mi.cls?', '+clsTxt[mi.cls]+est2txt(mi.est):'')
    +(mi.v.atualN!=null&&mi.v.atualN>0?', com '+f0b(mi.v.atualN)+' mil t na safra nova'+(mi.clsN?', '+clsTxt[mi.clsN]+est2txt(mi.estN):''):'')+'.'))+' '
    +(tg.estComb?combSales('Trigo',tg):('O trigo, j\u00e1 no MY '+myLbl(tg.ex.my)+', marcou '+f0b(tg.v.atual)+' mil toneladas'
    +(tg.cls?', '+clsTxt[tg.cls]+est2txt(tg.est):'')
    +(tg.v.atualN!=null&&tg.v.atualN>0?' e '+f0b(tg.v.atualN)+' mil t na safra nova':'')+'.'));
  if(hi&&hi.milho&&hi.trigo)pMT+=' No milho, Unknown, México e Japão lideraram as vendas. O trigo registrou a maior venda líquida da safra, com destaque para Filipinas ('+f0b(hi.trigo.net_destinations.Philippines)+' mil t) e '+f0b(hi.trigo.switched_unknown_to_vietnam)+' mil t transferidas de Unknown para o Vietnã.';
  return '<p class="h1">'+h1+'</p>'
    +'<p class="sub">'+sub+'</p>'
    +'<p class="sec">DESTAQUES</p>'
    +'<p>'+pSoja+'</p><p>'+pFar+'</p><p>'+pOl+'</p><p>'+pMT+'</p>';
};
function buildVendTabela(){
  const el=document.createElement('div');el.className='p-card vend-wrap';el.dataset.card='vendsem|rep';
  const dref=_vendNet('soja').data;
  const dd=dref?dref.split('-'):null;
  const dtxt=dd?dd[2]+'/'+dd[1]+'/'+dd[0].slice(2):'';
  const store=(E.deep&&E.deep.vendEst)||{};
  /* Expectativas podem ser recebidas antes dos realizados da nova semana.
     Exibir na tabela original, mantendo as vendas oficiais com sua data. */
  const estWeek=Object.keys(store).filter(d=>d>=dref).sort().pop()||dref;
  const EST=store[estWeek]||null, pendingEst=estWeek>dref;
  el.dataset.estWeek=estWeek;
  const combinedAll=!!(EST&&EST.__combined);
  const combinedAny=!!(EST&&(combinedAll||VEND_ORD.some(c2=>EST[c2]&&EST[c2].comb)));
  /* As colunas conservam duas safras explícitas. Para períodos com calendários
     divergentes por commodity, as células mostram o MY específico da linha. */
  const sMY=VEND_ORD.map(com=>_vendNet(com).my);
  const reportMY=_vendNet('soja').my;
  const mixedMY=sMY.some(my=>my!==reportMY);
  const yearHeads=mixedMY?['MY da linha','MY seguinte']:[myLbl(reportMY),myLbl(reportMY+1)];
  let priorMY=false,rowsHtml='';
  VEND_ORD.forEach(com=>{
    const v=_vendNet(com);
    const rows=S(com,'MUNDO'), prevMY=rows.length>1?rows[rows.length-2][1]:v.my;
    const oldMY=prevMY!==reportMY;
    const differentMY=v.my!==reportMY;
    priorMY=priorMY||oldMY;
    const seta=(v.atual!=null&&v.ma4!=null)?(v.atual>=v.ma4?'<span style="color:#0D9488">\u25B2</span>':'<span style="color:#C0392B">\u25BC</span>'):'';
    const mini=Math.max(Math.abs(v.atual||0),Math.abs(v.ant||0),Math.abs(v.ma4||0))<10;
    const f=x=>{if(x==null)return'\u2014';
      if(mini){let r1=Math.round(x*10)/10;if(r1===0)r1=0;return NF(r1,1);}
      let r2=Math.round(x);if(r2===0)r2=0;return NF(r2,0);};
    const fx=k=>{const e=EST&&EST[com]&&EST[com][k],fe=n=>Number.isInteger(n)?String(n):String(n).replace('.',',');return e?(e[0]<0?(fe(e[0])+' a '+fe(e[1])):(fe(e[0])+'-'+fe(e[1]))):'\u2014';};
    const estCy='<td class="est etext" contenteditable="true" data-est="'+com+'-cy" spellcheck="false">'+fx('cy')+'</td>';
    const estNc='<td class="est etext" contenteditable="true" data-est="'+com+'-nc" spellcheck="false">'+fx('nc')+'</td>';
    const estComb='<td class="est etext vend-est-total" contenteditable="true" data-est="'+com+'-comb" spellcheck="false" title="Faixa combinada 26/27 + 27/28, não separada por safra">'+fx('comb')+'</td>'
      +'<td class="est vend-est-nd" title="Expectativa exclusiva para 27/28 não divulgada; a faixa ao lado é combinada">n/d</td>';
    const estCells=(EST&&EST[com]&&EST[com].comb)?estComb:(estCy+estNc);
    const mark=(my,year2)=>'<span class="vend-yr" title="MY '+myLbl(my+(year2?1:0))+'">'+myLbl(my+(year2?1:0))+'</span>';
    const currentNote=differentMY?mark(v.my,false):'';
    const nextNote=differentMY?mark(v.my,true):'';
    const prevNote=oldMY?mark(prevMY,false):'';
    const prevNextNote=oldMY?mark(prevMY,true):'';
    rowsHtml+='<tr>'
      +'<td class="cm etext">'+E.nome[com]+'</td>'
      +estCells
      +'<td class="etext"'+(differentMY?' title="MY '+myLbl(v.my)+'"':'')+'>'+f(v.atual)+currentNote+'</td>'
      +'<td class="etext"'+(differentMY?' title="MY '+myLbl(v.my+1)+'"':'')+'>'+f(v.atualN)+nextNote+'</td>'
      +'<td class="etext"'+(oldMY?' title="MY '+myLbl(prevMY)+'"':'')+'>'+f(v.ant)+prevNote+'</td>'
      +'<td class="etext"'+(oldMY?' title="MY '+myLbl(prevMY+1)+'"':'')+'>'+f(v.antN)+prevNextNote+'</td>'
      +'<td class="arw">'+seta+'</td><td class="ma etext">'+f(v.ma4)+'</td>'
      +'</tr>';
  });
  const note=(combinedAny?'<span>'+(pendingEst?'Expectativas para a semana de '+estWeek.slice(8,10)+'/'+estWeek.slice(5,7)+'/'+estWeek.slice(2,4)+' ainda sem resultado oficial. Os realizados exibidos correspondem à semana de '+dtxt+'. Faixas combinadas entre MY, sem divisão publicada por safra.':['2026-10-15','2026-10-22'].includes(dref)?'Estimativas Dow Jones: faixa combinada 26/27 + 27/28 para as cinco commodities, sem divisão publicada por MY; 27/28 = n/d.':'Trigo e óleo de soja: faixas divulgadas sem divisão por MY, exibidas sob 26/27 por alinhamento; 27/28 = n/d.')+'</span>':'')
    +(dref==='2026-10-08'?'<span>Farelo: faixa pré-relatório publicada como 200–60 mil t, com erro no intervalo; expectativa pendente de confirmação.</span>':'')
    +(priorMY?'<span>Semana anterior de farelo e óleo: safra velha MY 25/26, safra nova MY 26/27. Os anos efetivos est\u00e3o indicados abaixo dos volumes.</span>':'')
    +(mixedMY?'<span>Os anos comerciais variam conforme a commodity; os valores estão identificados por MY.</span>':'');
  el.innerHTML='<div class="p-card-h"><div>'
    +'<div class="p-card-t etext">EUA: Relat\u00f3rio de Vendas e Embarques</div>'
    +'<div class="p-card-s etext">Em mil t \u00b7 semana at\u00e9 '+dtxt+' \u00b7 net sales = \u0394 commit \u00b7 vendas novas = \u0394 book \u00b7 seta: semana atual vs m\u00e9dia 4 sem</div>'
    +'</div><div class="tools"><button class="mini rst" title="Restaurar (limpa estimativas)">\u21ba</button><button class="mini png" title="Foto">\ud83d\udcf7</button></div></div>'
    +'<table class="vtab"><thead>'
    +'<tr><th class="grp" rowspan="2">Volume em<br>1000 tons</th><th class="grp" colspan="2">Estimativas'+(pendingEst?'<br>'+estWeek.slice(8,10)+'/'+estWeek.slice(5,7):'')+'</th><th class="grp" colspan="2">Vendas Semana<br>atual'+(pendingEst?' ('+dref.slice(8,10)+'/'+dref.slice(5,7)+')':'')+'</th><th class="grp" colspan="2">Vendas Semana<br>anterior</th><th class="grp" colspan="2">&lt;M\u00e9dia 4<br>semanas&gt;</th></tr>'
    +'<tr><th>'+yearHeads[0]+'</th><th>'+yearHeads[1]+'</th><th>'+yearHeads[0]+'</th><th>'+yearHeads[1]+'</th><th>'+yearHeads[0]+'</th><th>'+yearHeads[1]+'</th><th></th><th></th></tr>'
    +'</thead><tbody>'+rowsHtml+'</tbody></table>'
    +(note?'<div class="vend-note">'+note+'</div>':'');
  el.querySelectorAll('[data-est]').forEach(td=>{td.addEventListener('input',()=>{
    const tc=document.querySelector('[data-card="vendtxt|rep"]');
    if(tc&&tc._genTxt)tc._genTxt();
  });});
  const png=el.querySelector('.mini.png');
  if(png)png.onclick=()=>{const r=el.getBoundingClientRect();baixar(el,'vendas_semanais',Math.round(r.width)||900,(Math.round(r.height)||320)+16);};
  if(window.typoApply)typoApply(el);
  const _tt=el.querySelector('.p-card-t');if(_tt)_tt.style.fontSize='18px';
  const _ts=el.querySelector('.p-card-s');if(_ts)_ts.style.fontSize='13px';
  return el;
}
function buildVendTexto(){
  const el=document.createElement('div');el.className='p-card vend-wrap';el.dataset.card='vendtxt|rep';
  const dref=_vendNet('soja').data;
  const dd=dref?dref.split('-'):null;
  const dtxt=dd?dd[2]+'/'+dd[1]+'/'+dd[0].slice(2):'';
  el.innerHTML='<div class="p-card-h"><div>'
    +'<div class="p-card-t etext">Coment\u00e1rio do relat\u00f3rio</div>'
    +'<div class="p-card-s etext">Texto autom\u00e1tico com n\u00fameros e estimativas \u00b7 edit\u00e1vel \u00b7 \u27f3 regenera</div>'
    +'</div><div class="tools"><button class="mini txr" title="Regerar texto com os n\u00fameros atuais">\u27f3 texto</button><button class="mini txc" title="Copiar texto">copiar</button></div></div>'
    +'<div class="vend-txt etext" contenteditable="true" spellcheck="false" data-week="'+dtxt+'" style="border-top:none;margin-top:2px;padding-top:0;"></div>';
  el._genTxt=()=>{const tx=el.querySelector('.vend-txt');
    const tab=document.querySelector('[data-card="vendsem|rep"]');
    let reportTab=tab;
    /* O texto do relatório realizado NÃO pode comparar 22/10 com expectativas
       futuras de 29/10; usar consenso da própria semana só nesta geração. */
    const actualWeek=_vendNet('soja').data;
    if(tab&&tab.dataset.estWeek&&tab.dataset.estWeek!==actualWeek){
      reportTab=tab.cloneNode(true);
      const historic=((E.deep||{}).vendEst||{})[actualWeek]||{};
      VEND_ORD.forEach(com=>{
        for(const k of ['cy','nc','comb']){
          const cell=reportTab.querySelector('[data-est="'+com+'-'+k+'"]');
          const range=historic[com]&&historic[com][k];
          if(cell)cell.textContent=range?range.join('-'):'—';
        }
      });
    }
    if(tx){const en2=document.documentElement.lang==='en'&&window.gerarVendTextoEN;tx.innerHTML=en2?gerarVendTextoEN(reportTab):gerarVendTexto(reportTab);tx.setAttribute('data-noi18n','');tx.setAttribute('data-auto-sig',_vendSig(tx.innerHTML));}};
  el._genTxt();
  const btr=el.querySelector('.mini.txr');
  if(btr)btr.onclick=()=>el._genTxt();
  const btc=el.querySelector('.mini.txc');
  if(btc)btc.onclick=()=>{const tx=el.querySelector('.vend-txt');
    if(!tx)return;
    try{navigator.clipboard.writeText(tx.innerText);btc.textContent='copiado \u2713';setTimeout(()=>{btc.textContent='copiar';},1400);}catch(e){}
  };
  if(window.typoApply)typoApply(el);
  return el;
}
function _vendSig(s){let h=5381;s=String(s||'');for(let i=0;i<s.length;i++)h=((h<<5)+h+s.charCodeAt(i))|0;return String(h>>>0);}
function _vendRestore(novo,keepHtml,selT){
  if(!keepHtml)return;
  const keep=document.createElement('div');keep.innerHTML=keepHtml;
  /* Não restaurar faixas salvas para uma semana diferente. Os demais títulos e
     ajustes manuais continuam elegíveis à restauração. */
  const oldEstWeek=keep.firstElementChild&&keep.firstElementChild.dataset.estWeek;
  const currentEstWeek=novo.dataset.estWeek;
  const canRestoreEstimate=!currentEstWeek
    ||(oldEstWeek?oldEstWeek===currentEstWeek:currentEstWeek===_vendNet('soja').data);
  if(canRestoreEstimate)novo.querySelectorAll('[data-est]').forEach(td=>{
    const old=keep.querySelector('[data-est="'+td.dataset.est+'"]');
    if(old&&old.textContent.trim())td.textContent=old.textContent.trim();
  });
  [['.p-card-t'],['.p-card-s']].forEach(function(q){
    const a2=keep.querySelector(q[0]),b2=novo.querySelector(q[0]);
    if(a2&&b2&&a2.textContent.trim()){const outdated=(novo.dataset.card==='vendsem|rep')&&(a2.textContent.trim()==='Vendas e embarques dos EUA'||a2.textContent.trim().startsWith('Em mil t · semana até'));if(!outdated){b2.textContent=a2.textContent;if(a2.style&&a2.style.fontSize)b2.style.fontSize=a2.style.fontSize;}}
  });
  const txO=keep.querySelector('.vend-txt'),txN=novo.querySelector('.vend-txt');
  if(txO&&txN&&txO.getAttribute('data-week')===txN.getAttribute('data-week')&&txO.innerHTML.trim()){txN.innerHTML=txO.innerHTML;novo.dataset.txtKept='1';['data-auto-sig','data-noi18n'].forEach(a=>{if(txO.hasAttribute(a))txN.setAttribute(a,txO.getAttribute(a));else txN.removeAttribute(a);});}
}
function renderVendas(){
  const g=document.getElementById('g-vendas');
  if(!g)return;
  const sv=k=>{const p2=g.querySelector('[data-card="'+k+'"]');
    if(p2)return p2.outerHTML;
    if(window.__SAVED__&&window.__SAVED__.cards&&window.__SAVED__.cards[k])return window.__SAVED__.cards[k].html;
    return null;};
  const kT=sv('vendsem|rep'), kX=sv('vendtxt|rep');
  const tab=buildVendTabela();
  _vendRestore(tab,kT);
  const txt=buildVendTexto();
  _vendRestore(txt,kX||kT);   /* legado: texto vivia dentro do card da tabela */
  txt._genTxt=txt._genTxt;    /* mantém */
  const pT=g.querySelector('[data-card="vendsem|rep"]'),pX=g.querySelector('[data-card="vendtxt|rep"]');
  if(pT)pT.remove(); if(pX)pX.remove();
  g.appendChild(tab); g.appendChild(txt);
  /* só agora a tabela existe no DOM: regenerar para que gerarVendTexto enxergue
     as células de estimativa. Não regenera se houver lapidação preservada. */
  const txEl=txt.querySelector('.vend-txt');
  if(txEl&&!txt.dataset.txtKept)txt._genTxt();
}
function ensureVendasTab(){
  const tm=document.getElementById('topmenu'),scrs=document.getElementById('screens');
  if(!tm||!scrs)return;
  if(!document.getElementById('scr-vendas')){
    const d=document.createElement('div');d.className='screen';d.id='scr-vendas';
    const g=document.createElement('div');g.className='grid2';g.id='g-vendas';d.appendChild(g);scrs.appendChild(d);
  }
  let b=tm.querySelector('button[data-go="scr-vendas"]');
  if(!b){
    b=document.createElement('button');b.textContent='Vendas Semanais';b.dataset.go='scr-vendas';
    const base=tm.querySelector('button[data-go="scr-base"]');
    if(base)tm.insertBefore(b,base);else tm.appendChild(b);
  }
  b.onclick=function(){show('scr-vendas');renderVendas();};
}
window.renderVendas=renderVendas;
window.buildVendTabela=buildVendTabela;window.buildVendTexto=buildVendTexto;

let baseCom='soja';
function fmtN(v){return v==null?'':NF1.format(v);}
let baseView='raw', baseSort={col:0,dir:-1}, baseMy=null;
const MYNOME={soja:['Sep','Aug'],milho:['Sep','Aug'],farelo:['Oct','Sep'],oleo:['Oct','Sep'],trigo:['Jun','May']};
function renderBaseReport(com){
  const M=E.dados[com].s['MUNDO'];
  const ys=MYS(com);
  const cyDef=M[M.length-1][1];
  const cy=(baseMy!=null&&ys.includes(baseMy))?baseMy:cyDef;
  const sel=document.getElementById('db-my');
  if(sel){
    sel.style.display='';
    sel.innerHTML=ys.slice().reverse().map(y=>'<option value="'+y+'"'+(y===cy?' selected':'')+'>Temporada '+myLbl(y)+'</option>').join('');
    sel.onchange=()=>{baseMy=+sel.value;renderBaseReport(com);};
  }
  const cm=i=>M[i][3]+M[i][4];
  const reset=i=>i>0&&cm(i)<cm(i-1)*0.5;
  const rows=[];
  for(let i=0;i<M.length;i++){
    const r=M[i];
    if(r[1]!==cy)continue;
    let wexp=null,net=null,nmyN=null;
    if(i>0){
      if(reset(i)){wexp=M[i][3];net=cm(i)-(M[i-1][5]!=null?M[i-1][5]:0);nmyN=r[5];}
      else{wexp=M[i][3]-M[i-1][3];net=cm(i)-cm(i-1);nmyN=(r[5]!=null&&M[i-1][5]!=null)?r[5]-M[i-1][5]:null;}
    }
    const dd=periodEndISO(r[0]).split('-');
    rows.push([dd[1]+'-'+dd[2]+'-'+dd[0], r[2], MYNOME[com][0]+' '+r[1]+'/'+MYNOME[com][1]+' '+(r[1]+1),'Standard',
      wexp,r[3],net,r[4],r[5],nmyN, r[0]]);
  }
  const s2=baseSort;
  rows.sort((a,b)=>{
    let va=a[s2.col],vb=b[s2.col];
    if(s2.col===0){va=a[10];vb=b[10];}
    if(va==null)return 1;if(vb==null)return -1;
    return (va<vb?-1:va>vb?1:0)*s2.dir;
  });
  const t=v=>v==null?'':Math.round(v*1000).toLocaleString('en-US');
  const HEADS=['Period Ending Date','Marketing Year Week Number','Marketing Year','MYCO Type','Weekly Exports','Accumulated Exports','Weekly Net Sales','Outstanding Sales','Next Year Outstanding Sales','Next Year Net Sales'];
  let th='<thead><tr><th colspan="4"></th><th colspan="4" style="text-align:center">Current Marketing Year</th><th colspan="2" style="text-align:center">Next Marketing Year</th></tr><tr>';
  HEADS.forEach((hh,i)=>{th+='<th>'+hh+' <span class="srt" data-col="'+i+'">\u21c5</span></th>';});
  th+='</tr></thead>';
  let tb='<tbody>';
  rows.forEach(r=>{
    tb+='<tr><td>'+r[0]+'</td><td>'+r[1]+'</td><td>'+r[2]+'</td><td>'+r[3]+'</td>'
      +'<td>'+t(r[4])+'</td><td>'+t(r[5])+'</td><td>'+t(r[6])+'</td><td>'+t(r[7])+'</td><td>'+t(r[8])+'</td><td>'+t(r[9])+'</td></tr>';
  });
  tb+='</tbody>';
  const tab=document.getElementById('db-table');tab.innerHTML=th+tb;
  tab.querySelectorAll('.srt').forEach(sp=>{sp.onclick=()=>{
    const c=+sp.dataset.col;
    if(baseSort.col===c)baseSort.dir*=-1;else baseSort={col:c,dir:-1};
    renderBaseReport(com);
  };});
  document.getElementById('db-meta').textContent=rows.length+' semanas · '+E.nome[com]+' · MY '+myLbl(cy)+' · MUNDO · valores em toneladas · período até '+periodEndISO(E.meta.atual)+' · release '+E.meta.gerado;
  const hs=document.getElementById('db-hscroll'),sc=document.getElementById('db-scroll');
  hs.firstElementChild.style.width=tab.scrollWidth+'px';
  hs.onscroll=()=>sc.scrollLeft=hs.scrollLeft; sc.onscroll=()=>hs.scrollLeft=sc.scrollLeft;
  const ton=v=>v==null?'':Math.round(v*1000);
  window.__baseRows={head:HEADS,rows:rows.map(r=>[r[0],r[1],r[2],r[3],ton(r[4]),ton(r[5]),ton(r[6]),ton(r[7]),ton(r[8]),ton(r[9])])};
}
function renderBase(com){
  baseCom=com;
  document.querySelectorAll('#base-tabs button[data-c]').forEach(b=>b.classList.toggle('active',b.dataset.c===com&&baseView==='raw'));
  document.querySelectorAll('#base-tabs .rep').forEach(b=>b.classList.toggle('on',b.dataset.r===com&&baseView==='report'));
  if(baseView==='report'){renderBaseReport(com);return;}
  const selMy=document.getElementById('db-my');
  if(selMy)selMy.style.display='none';
  const d=E.dados[com];
  const ordem=['MUNDO','UNKNOWN',...d.paises.filter(p=>p!=='MUNDO'&&p!=='UNKNOWN')];
  const rows=[];
  ordem.forEach(p=>{(d.s[p]||[]).forEach(r=>rows.push([periodEndISO(r[0]),p==='MUNDO'?'MUNDO':(p==='UNKNOWN'?'Unknown':p),myLbl(r[1]),r[2],r[3],r[4],r[3]+r[4],r[5]]));});
  rows.sort((a,b)=>a[0]<b[0]?1:a[0]>b[0]?-1:(a[1]<b[1]?-1:1));
  const th='<thead><tr><th>Semana (fim)</th><th>Destino</th><th>MY</th><th>Sem. MY</th><th>Embarcado</th><th>A embarcar</th><th>Commit</th><th>Book MY+1</th></tr></thead>';
  let tb='<tbody>';
  rows.forEach(r=>{tb+=`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td>${fmtN(r[4])}</td><td>${fmtN(r[5])}</td><td>${fmtN(r[6])}</td><td>${fmtN(r[7])}</td></tr>`;});
  tb+='</tbody>';
  const tab=document.getElementById('db-table');tab.innerHTML=th+tb;
  document.getElementById('db-meta').textContent=rows.length.toLocaleString('pt-BR')+' linhas · '+E.nome[com]+' · período até '+periodEndISO(E.meta.atual)+' · release '+E.meta.gerado;
  const hs=document.getElementById('db-hscroll'),sc=document.getElementById('db-scroll');
  hs.firstElementChild.style.width=tab.scrollWidth+'px';
  hs.onscroll=()=>sc.scrollLeft=hs.scrollLeft; sc.onscroll=()=>hs.scrollLeft=sc.scrollLeft;
  window.__baseRows={head:['Semana','Destino','MY','SemMY','Embarcado','AEmbarcar','Commit','BookMY1'],rows};
}
function csvCell(v){if(v==null)return'';let s=typeof v==='number'?String(v).replace('.',','):String(v);if(/[;"\n]/.test(s))s='"'+s.replace(/"/g,'""')+'"';return s;}
function csvText(head,rows){return '\ufeff'+[head.join(';'),...rows.map(r=>r.map(csvCell).join(';'))].join('\n');}
function csvBase(){
  const B=window.__baseRows;if(!B)return;
  const txt=csvText(B.head,B.rows);
  const a=document.createElement('a');a.download='base_esr_'+baseCom+'.csv';
  a.href='data:text/csv;charset=utf-8,'+encodeURIComponent(txt);a.click();
  toast('CSV exportado — '+B.rows.length.toLocaleString('pt-BR')+' linhas');
}
function show(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('on'));
  document.querySelectorAll('#topmenu button').forEach(b=>b.classList.toggle('active',b.dataset.go===id));
  document.getElementById(id).classList.add('on');
  if(id==='scr-base')renderBase(baseCom);
  else if(id==='scr-vendas'){if(typeof renderVendas==='function')renderVendas();}
  else renderScreen(id.replace('scr-',''));
  window.scrollTo(0,0);
  const com=id.replace('scr-','');
  if(window.BRZQEUA&&E.coms.includes(com))BRZQEUA.render(com);
  requestAnimationFrame(()=>{if(window.BRZFIT)document.querySelectorAll('#'+id+' .p-card').forEach(c=>BRZFIT(c));});
}
(function boot(){
  (function(){const MZ=['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
  const rel=E.meta&&E.meta.atual||'',gen=E.meta&&E.meta.gerado||'',cov=periodEndISO(rel),a=cov.split('-'),g=gen.split('-');
  const at=a.length===3?a[2]+'/'+MZ[+a[1]-1]+'/'+a[0]:'';
  const ge=g.length===3?g[2]+'/'+g[1]:'';
  document.getElementById('dt').textContent='dados até '+at+' · release '+ge+' · '+BUILD;})();
  const stateOk=s=>!!(s&&s.v>=2&&s.build===BUILD&&s.dataAtual===E.meta.atual);
  const stateUsable=s=>!!(s&&s.v>=2&&s.cards&&typeof s.cards==='object');
  try{const ls=localStorage.getItem('brz_eua_state');
    if(ls){const st=JSON.parse(ls);
      /* Migrar a cópia local mais recente, mesmo quando a versão USDA mudou. */
      if(stateUsable(st)&&(!stateUsable(window.__SAVED__)||Number(st.ts||0)>=Number(window.__SAVED__.ts||0)))window.__SAVED__=st;}
  }catch(e){}
  if(!stateOk(window.__SAVED__)){
    const old=window.__SAVED__;
    if(old&&old.v>=2&&old.cards&&typeof old.cards==='object'){
      const saved={};
      Object.entries(old.cards).forEach(([key,card])=>{
        if(!card||typeof card.html!=='string')return;
        saved[key]={...card,sourceBuild:card.sourceBuild||old.build||'legado',
          sourceDataAtual:card.sourceDataAtual||old.dataAtual||'legado'};
      });
      window.__SAVED__={...old,v:2,build:BUILD,dataAtual:E.meta.atual,cards:saved,
        migratedFrom:{build:old.build||null,dataAtual:old.dataAtual||null}};
    }else{
      window.__SAVED__=old?{v:2,build:BUILD,dataAtual:E.meta.atual,ts:old.ts||Date.now(),cards:{},palette:old.palette||null,typo:old.typo||null}:null;
    }
    E.coms.forEach(c=>{const g=document.getElementById('g-'+c);if(g)g.innerHTML='';});
  }
  if(window.__SAVED__&&window.__SAVED__.palette){
    NAVY=window.__SAVED__.palette.navy||NAVY;TEAL=window.__SAVED__.palette.teal||TEAL;BEGE=window.__SAVED__.palette.bege||BEGE;
    LADDER=['#c9d1d8',CINZA,BEGE,TEAL,NAVY];PAL6=[NAVY,TEAL,BEGE,'#5b7ca6','#63b8b0','#8a9099'];PAL6D=PAL6.slice();
  }
  const tm=document.getElementById('topmenu'),scrs=document.getElementById('screens');
  const FRESH=tm.children.length===0;
  const mk=(label,go)=>{const b=document.createElement('button');b.textContent=label;b.dataset.go=go;b.onclick=()=>show(go);tm.appendChild(b);return b;};
  if(FRESH){
    mk('Inicial','scr-menu');
    E.coms.forEach(c=>{
      mk(E.nome[c],'scr-'+c);
      const d=document.createElement('div');d.className='screen';d.id='scr-'+c;
      const g=document.createElement('div');g.className='grid2';g.id='g-'+c;d.appendChild(g);scrs.appendChild(d);
    });
    mk('Base','scr-base');
    mk('Opções','scr-opcoes');
    const eb=document.createElement('button');eb.id='gear';eb.textContent='⚙ Edição';eb.title='Ativar/desativar modo edição';
    document.querySelector('.topnav').appendChild(eb);
    const bt=document.getElementById('base-tabs');
    E.coms.forEach(c=>{const b=document.createElement('button');b.textContent='Base de Dados · '+E.nome[c];b.dataset.c=c;b.onclick=()=>renderBase(c);bt.appendChild(b);});
  } else {
    document.querySelectorAll('#topmenu button').forEach(b=>{b.onclick=()=>show(b.dataset.go);});
    document.querySelectorAll('#base-tabs button[data-c]').forEach(b=>{b.onclick=()=>{baseView='raw';renderBase(b.dataset.c);};});
  document.querySelectorAll('#base-tabs .rep').forEach(b=>{b.onclick=()=>{baseView='report';renderBase(b.dataset.r);};});
  }
  ensureVendasTab();
  document.getElementById('db-csv').onclick=csvBase;
  E.coms.forEach(c=>{const g=document.getElementById('g-'+c);if(g&&g.children.length){rendered[c]=0;}});
  document.querySelectorAll('.newscard').forEach(nc=>nc.onclick=()=>show(nc.dataset.go));
  document.getElementById('op-save').onclick=saveState;
  const oc=document.getElementById('op-clear'); if(oc)oc.onclick=()=>{if(confirm('Apagar o salvamento local desta máquina? Os cards voltam ao padrão desta build.')){try{localStorage.removeItem('brz_eua_state');}catch(e){} location.reload();}};
  document.getElementById('op-export').onclick=exportarHTML;
  optStatus();
  document.getElementById('op-csvs').onclick=baixarTodosCSV;
  document.getElementById('op-build').textContent='BUILD '+BUILD;
  document.getElementById('pc-navy').value=NAVY;document.getElementById('pc-teal').value=TEAL;document.getElementById('pc-bege').value=BEGE;
  const pc=(id,set)=>{const el=document.getElementById(id);el.oninput=()=>{set(el.value);rerenderAll();};};
  pc('pc-navy',v=>NAVY=v);pc('pc-teal',v=>TEAL=v);pc('pc-bege',v=>BEGE=v);
  document.getElementById('pc-reset').onclick=()=>{NAVY='#1A3A5C';TEAL='#0D9488';BEGE='#B5963E';
    document.getElementById('pc-navy').value=NAVY;document.getElementById('pc-teal').value=TEAL;document.getElementById('pc-bege').value=BEGE;rerenderAll();toast('Paleta restaurada.');};
  show('scr-menu');
})();

/* ═══════════ MODO EDIÇÃO (portado do HTML-mãe) ═══════════ */
const EDIT=()=>document.body.classList.contains('edit');
const gear=document.getElementById('gear');
const inl=document.getElementById('inl');
gear.onclick=()=>{
  const on=document.body.classList.toggle('edit');
  gear.classList.toggle('on',on);
  document.getElementById('editctrls').style.display=on?'flex':'none';
  if(!on){select(null); inl.style.display='none';}
  const tp=document.getElementById('typo-panel');
  if(tp)tp.style.display=on?'block':'none';
  if(on&&window.typoRefresh)typoRefresh();
};
let SEL=null;
function isSvgEl(el){return el && el.namespaceURI==='http://www.w3.org/2000/svg';}
function getSize(el){return parseFloat(getComputedStyle(el).fontSize)||10;}
function select(el){ if(SEL)SEL.classList.remove('sel'); SEL=el; if(el){el.classList.add('sel'); document.getElementById('fsz').value=Math.round(getSize(el));} }
function setSize(el,v){ el.style.fontSize=v+'px'; }
function setColor(el,v){ if(isSvgEl(el)) el.style.fill=v; else el.style.color=v; }
function setFam(el,v){ el.style.fontFamily=v; }
function togBold(el){ el.style.fontWeight=(parseInt(getComputedStyle(el).fontWeight)>=700)?'400':'800'; }
function togItal(el){ el.style.fontStyle=(getComputedStyle(el).fontStyle==='italic')?'normal':'italic'; }
let drag=null, moved=false;
document.addEventListener('pointerdown',e=>{
  if(!EDIT())return;
  if(e.target.closest('.topnav')||e.target.closest('.editbar')||e.target.closest('.pal')||e.target.closest('.subtabs')||e.target.closest('select')||e.target.closest('input')||e.target===inl)return;
  let el=null,type=null,f=1;
  const sv=e.target.closest('.chart svg');
  if(sv && sv.closest('.chart.dynon')) return;
  if(sv && e.target!==sv){ el=e.target; type='svg'; f=414/sv.getBoundingClientRect().width; }
  else { el=e.target.closest('.lg span')||e.target.closest('.etext'); if(el) type='html'; }
  if(!el)return;
  drag={el,type,f,sx:e.clientX,sy:e.clientY,bx:parseFloat(el.dataset.tx||0),by:parseFloat(el.dataset.ty||0)};
  moved=false;
});
document.addEventListener('pointermove',e=>{
  if(!drag)return;
  const dx=e.clientX-drag.sx, dy=e.clientY-drag.sy;
  if(Math.abs(dx)+Math.abs(dy)>3)moved=true;
  if(!moved)return;
  e.preventDefault();
  const tx=drag.bx+dx*(drag.type==='svg'?drag.f:1);
  const ty=drag.by+dy*(drag.type==='svg'?drag.f:1);
  if(drag.type==='svg'){ drag.el.setAttribute('transform',`translate(${tx.toFixed(1)} ${ty.toFixed(1)})`); }
  else { drag.el.style.position='relative'; drag.el.style.left=tx+'px'; drag.el.style.top=ty+'px'; }
  drag.el.dataset.tx=tx; drag.el.dataset.ty=ty;
});
document.addEventListener('pointerup',()=>{ drag=null; setTimeout(()=>{moved=false;},0); });
document.addEventListener('click',e=>{
  if(!EDIT())return;
  if(moved)return;
  if(e.target.closest('.newscard')||e.target.closest('.topnav')||e.target.closest('.editbar')||e.target.closest('.pal')||e.target.closest('input')||e.target===inl) return;
  const t=e.target.closest('.etext');
  if(t) select(t); else select(null);
});
document.addEventListener('dblclick',e=>{
  if(!EDIT())return;
  const t=e.target.closest('.etext'); if(!t)return;
  select(t);
  const r=t.getBoundingClientRect();
  inl.style.display='block';
  inl.style.left=(r.left+window.scrollX)+'px';
  inl.style.top=(r.top+window.scrollY-2)+'px';
  inl.style.width=Math.max(70,r.width+30)+'px';
  inl.value=t.textContent;
  inl.focus(); inl.select();
  const commit=()=>{t.textContent=inl.value; inl.style.display='none';};
  inl.onkeydown=ev=>{ if(ev.key==='Enter')commit(); if(ev.key==='Escape')inl.style.display='none'; };
  inl.onblur=()=>{ if(inl.style.display!=='none')commit(); };
});
function applyScope(fn){
  if(!SEL) return;
  if(document.getElementById('allcard').checked){
    const card=SEL.closest('.p-card')||SEL.closest('.screen');
    card.querySelectorAll('.etext').forEach(fn);
  } else fn(SEL);
}
document.getElementById('fsz').addEventListener('input',e=>applyScope(el=>setSize(el,parseFloat(e.target.value)||9)));
document.getElementById('szm').onclick=()=>applyScope(el=>setSize(el,getSize(el)-1));
document.getElementById('szp').onclick=()=>applyScope(el=>setSize(el,getSize(el)+1));
document.getElementById('fcol').addEventListener('input',e=>applyScope(el=>setColor(el,e.target.value)));
document.getElementById('ffam').addEventListener('change',e=>applyScope(el=>setFam(el,e.target.value)));
document.getElementById('fb').onclick=()=>applyScope(togBold);
document.getElementById('fi').onclick=()=>applyScope(togItal);

/* ═══════════ TIPOGRAFIA GLOBAL + RODAPÉ (portado do BRZ EXP SOYBEAN v30_7/8) ═══════════ */
window.TYPO={sizes:{},foot:true};
try{if(window.__SAVED__&&window.__SAVED__.typo){TYPO.sizes=window.__SAVED__.typo.sizes||{};TYPO.foot=window.__SAVED__.typo.foot!==false;}}catch(e){}
window.typoApply=function(scope){
  if(!window.TYPO)return;
  const inCard=!!(scope&&scope.classList&&scope.classList.contains('p-card'));
  TYPO_CATS.forEach((c,i)=>{
    const v=TYPO.sizes[i]; if(v==null)return;
    const sel=inCard?c[1].replace('.p-card ',''):c[1];
    (scope||document).querySelectorAll(sel).forEach(el2=>setSize(el2,v));
  });
  (scope||document).querySelectorAll(inCard?'.foot':'.p-card .foot').forEach(f=>{if(f.closest('.vend-wrap'))return;f.style.display=TYPO.foot?'':'none';});
};
const TYPO_CATS=[
  ['Título','.p-card .p-card-t'],
  ['Subtítulo','.p-card .p-card-s'],
  ['Legendas','.p-card .lg span b'],
  ['Eixo Y','.p-card .chart svg .ytick'],
  ['Eixo X','.p-card .chart svg .xlab'],
  ['Valores','.p-card .chart svg .val'],
  ['Rodapé','.p-card .foot span'],
];
function buildTypoPanel(){
  document.querySelectorAll('#typo-panel').forEach(el=>el.remove());
  const p=document.createElement('div');p.id='typo-panel';
  p.style.cssText='position:fixed;top:64px;right:14px;z-index:60;background:#fff;border:1px solid var(--line);border-radius:8px;padding:10px 12px;box-shadow:0 8px 24px rgba(15,38,56,.14);display:none;min-width:172px;font:600 10.5px var(--cond);color:#334155;';
  let html='<div style="font:800 11px var(--cond);color:#1A3A5C;margin-bottom:6px;">Tipografia global</div>';
  TYPO_CATS.forEach((c,i)=>{
    html+='<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin:3px 0;"><span>'+c[0]+'</span><input data-ti="'+i+'" type="number" min="5" max="48" step="1" style="width:52px;font:600 10.5px var(--cond);padding:2px 4px;border:1px solid var(--line);border-radius:4px;color:#334155;"></div>';
  });
  html+='<div style="border-top:1px solid var(--line);margin-top:6px;padding-top:6px;display:flex;align-items:center;gap:6px;"><input type="checkbox" id="typo-foot" checked><label for="typo-foot" style="cursor:pointer;">Mostrar rodapé</label></div>';
  p.innerHTML=html;
  document.body.appendChild(p);
  p.querySelectorAll('input[data-ti]').forEach(inp=>{
    inp.addEventListener('input',()=>{
      let v=parseFloat(inp.value); if(isNaN(v))return; v=Math.min(48,Math.max(5,v));
      document.querySelectorAll('.chart.dynon').forEach(ch=>{const c2=ch.closest('.p-card');if(c2&&window.dynOff)dynOff(c2);});
      TYPO.sizes[+inp.dataset.ti]=v;
      document.querySelectorAll(TYPO_CATS[+inp.dataset.ti][1]).forEach(el=>setSize(el,v));
    });
  });
  const cbFoot=p.querySelector('#typo-foot');
  if(cbFoot)cbFoot.addEventListener('change',e=>{
    const onf=e.target.checked;
    TYPO.foot=onf;
    document.querySelectorAll('.p-card .foot').forEach(f=>{if(f.closest('.vend-wrap'))return;f.style.display=onf?'':'none';});
  });
  if(document.body.classList.contains('edit'))p.style.display='block';
}
window.buildTypoPanel=buildTypoPanel;
window.typoRefresh=function(){
  const p=document.getElementById('typo-panel'); if(!p)return;
  p.querySelectorAll('input[data-ti]').forEach(inp=>{
    const st=TYPO.sizes[+inp.dataset.ti];
    if(st!=null){inp.value=st;return;}
    const el=document.querySelector(TYPO_CATS[+inp.dataset.ti][1]);
    inp.value=el?Math.round(parseFloat(getComputedStyle(el).fontSize)||0):'';
  });
  const cb=p.querySelector('#typo-foot');
  if(cb)cb.checked=!!TYPO.foot;
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',buildTypoPanel);else buildTypoPanel();

function wirePal(card){
  card.querySelectorAll('input.lgc').forEach(inp=>{
    inp.oninput=e=>{
      const v=e.target.dataset.var, val=e.target.value;
      card.style.setProperty(v,val);
      card._vars=card._vars||{}; card._vars[v]=val;
      card.querySelectorAll(`input.lgc[data-var="${v}"]`).forEach(o=>{if(o!==e.target)o.value=val;});
    };
  });
}
document.addEventListener('click',e=>{
  if(e.target.classList.contains('rst')){
    select(null);
    const c=e.target.closest('.p-card');
    if(c&&c.dataset.card==='vendsem|rep'){
      if(window.__SAVED__&&window.__SAVED__.cards)delete window.__SAVED__.cards['vendsem|rep'];
      c.replaceWith(buildVendTabela());
      return;
    }
    if(c&&c.dataset.card==='vendtxt|rep'){
      if(window.__SAVED__&&window.__SAVED__.cards)delete window.__SAVED__.cards['vendtxt|rep'];
      c.replaceWith(buildVendTexto());
      return;
    }
    if(window.dynOff) dynOff(c,true);
    if(c._rebuild) c._rebuild();
  }
});

