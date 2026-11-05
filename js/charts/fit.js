
/* ═══════════ BRZ · ajuste automático de rótulos (padrão BRZ SAFRA) ═══════════
   Roda depois de cada desenho de cartão, já com o tamanho de fonte do painel de tipografia:
   nenhum texto sai da área do gráfico, rótulo de categoria longo é abreviado e rótulos de valor
   que se sobrepõem deixam de competir (zero e repetidos saem primeiro). Não altera dados. */
(function(){
'use strict';
const isAxis=t=>t.classList.contains('ytick')||t.classList.contains('xlab');
const isZero=s=>/^[−\-+]?0(?:[.,]0+)?\s*%?$/.test(String(s).trim());
const ov=(a,b)=>Math.min(a.x+a.width,b.x+b.width)-Math.max(a.x,b.x)>1.2&&Math.min(a.y+a.height,b.y+b.height)-Math.max(a.y,b.y)>1.2;
function shiftX(t,dx){const x=parseFloat(t.getAttribute('x')||'0');t.setAttribute('x',(x+dx).toFixed(1));t.querySelectorAll('tspan[x]').forEach(s=>s.setAttribute('x',(parseFloat(s.getAttribute('x'))+dx).toFixed(1)));}
function shiftY(t,dy){const y=parseFloat(t.getAttribute('y')||'0');t.setAttribute('y',(y+dy).toFixed(1));t.querySelectorAll('tspan[y]').forEach(s=>s.setAttribute('y',(parseFloat(s.getAttribute('y'))+dy).toFixed(1)));}
window.BRZFIT=function(card){
  try{
    const svg=card&&card.querySelector&&card.querySelector('.chart svg');if(!svg||!svg.isConnected)return;
    if(!svg.getBoundingClientRect().width)return;
    const vb=svg.viewBox&&svg.viewBox.baseVal,W=vb&&vb.width?vb.width:414,H=vb&&vb.height?vb.height:190;
    const texts=[...svg.querySelectorAll('text')].filter(t=>!t.closest('[data-wm]')&&t.textContent.trim()&&t.getAttribute('display')!=='none'&&!t.getAttribute('transform'));
    texts.forEach(t=>{
      let b;try{b=t.getBBox();}catch(e){return;}if(!b||!b.width)return;
      const anchor=t.getAttribute('text-anchor')||'start';
      if(b.x<0.5){
        if(anchor==='end'&&t.classList.contains('xlab')&&!t.querySelector('tspan')){
          let s=t.textContent.replace(/\.$/,'').trim(),g=0;
          while(b.x<0.5&&s.length>3&&g++<40){s=s.slice(0,-1).trimEnd();t.textContent=s+'.';b=t.getBBox();}
          if(!t.getAttribute('data-full'))t.setAttribute('data-full','1');
        }
        b=t.getBBox();if(b.x<0.5)shiftX(t,0.5-b.x);
      }
      b=t.getBBox();if(b.x+b.width>W-0.5)shiftX(t,(W-0.5)-(b.x+b.width));
      b=t.getBBox();if(b.y<0.2)shiftY(t,0.2-b.y);else if(b.y+b.height>H-0.2)shiftY(t,(H-0.2)-(b.y+b.height));
    });
    const bx=texts.map((t,i)=>{let b=null;try{b=t.getBBox();}catch(e){}return {t,b,i,axis:isAxis(t),z:isZero(t.textContent)};}).filter(o=>o.b&&o.b.width);
    for(let i=0;i<bx.length;i++)for(let j=i+1;j<bx.length;j++){
      const A=bx[i],B=bx[j];if(A.h||B.h||(A.axis&&B.axis))continue;if(!ov(A.b,B.b))continue;
      let L=A.axis?B:B.axis?A:(A.z&&!B.z)?A:(B.z&&!A.z)?B:(A.t.textContent.trim()===B.t.textContent.trim()?B:B);
      L.t.setAttribute('display','none');L.h=true;
    }
  }catch(e){}
};
})();
