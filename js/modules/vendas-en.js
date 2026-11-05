
/* ═══════════ BRZ EUA e88 · comentário de Vendas Semanais em inglês ═══════════
   Mesma lógica e mesmos números do gerarVendTexto em português, com texto nativo em inglês
   (antes o EN saía pela troca de palavras e misturava idiomas). Números em en-US. O comentário
   gerado é marcado com assinatura: ao trocar o idioma, só é refeito se não foi editado à mão. */
(function(){
'use strict';
const N=(v,d)=>{let s=Number(v||0).toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d});if(/^-0(\.0+)?$/.test(s))s=s.slice(1);return s;};
const f0b=x=>N(Math.round(x||0),0),f1e=x=>N(x,1);
const NM={soja:'soybeans',farelo:'soybean meal',oleo:'soybean oil',milho:'corn',trigo:'wheat'};
window.gerarVendTextoEN=function(card){
  const dados={};
  VEND_ORD.forEach(com=>{
    const v=_vendNet(com),ex=_vendExtras(com);
    const est=_vendParseEst(card?card.querySelector('[data-est="'+com+'-cy"]'):null);
    const estN=_vendParseEst(card?card.querySelector('[data-est="'+com+'-nc"]'):null);
    const estComb=_vendParseEst(card?card.querySelector('[data-est="'+com+'-comb"]'):null);
    const total=(v.atual==null&&v.atualN==null)?null:(v.atual||0)+(v.atualN||0);
    dados[com]={v,ex,est,estN,estComb,total,cls:estComb?_vendClasse(total,estComb):_vendClasse(v.atual,est),clsN:estComb?null:_vendClasse(v.atualN,estN)};
  });
  const clsTxt={abaixo:'below expectations',dentro:'within expectations',acima:'above expectations'};
  const votos=VEND_ORD.map(c=>dados[c].cls).filter(Boolean);
  const nAb=votos.filter(x=>x==='abaixo').length,nAc=votos.filter(x=>x==='acima').length,nDt=votos.filter(x=>x==='dentro').length;
  const soja=dados.soja,rec=soja.v.atual!=null&&soja.ex.menor!=null&&soja.v.atual<=soja.ex.menor+0.5;
  const tom=(rec&&soja.cls==='abaixo')?'abaixo':(nDt===votos.length&&votos.length?'dentro':(nAb>votos.length/2?'abaixo':(nAc>votos.length/2?'acima':'mistas')));
  let fraco=null,pior=0;VEND_ORD.forEach(c=>{const v=dados[c].v;if(v.atual==null||!(v.ma4>5))return;const dv=(v.atual-v.ma4)/Math.abs(v.ma4);if(dv<pior){pior=dv;fraco=c;}});
  let h1;
  if(tom==='abaixo')h1='USDA: Sales below expectations'+(rec?', with soybeans at a new marketing-year low.':(fraco?', '+NM[fraco]+' the weakest.':'.'));
  else if(tom==='acima')h1='USDA: Sales above expectations, with firm export demand.';
  else if(tom==='dentro')h1=votos.length===VEND_ORD.length?'USDA: Sales within expectations across all commodities.':'USDA: Sales within published expectations for four commodities.';
  else h1='USDA: Mixed sales in the week, no single direction across products.';
  const fracos=['soja','milho'].filter(c=>(dados[c].cls==='abaixo'||(dados[c].cls==null&&dados[c].v.atual<dados[c].v.ma4)));
  let sub=fracos.length?'USDA reported weak U.S. '+fracos.map(c=>NM[c]).join(' and ')+' sales.':'USDA reported sales in line with the recent pattern.';
  if(!votos.length){h1='USDA: Mixed weekly sales across soybeans, corn and wheat.';sub='No verifiable pre-report consensus for this reading; comparisons against the prior week and the 4-week average.';}
  const est2txt=e=>e?(' ('+f0b(e.min)+(e.min<0?' to ':'-')+f0b(e.max)+' kt)'):'';
  const combSales=(label,d,dec)=>{const ff=x=>dec===1?N(Math.round((x||0)*10)/10,1):f0b(x);
    let tx=label+': Combined sales totaled '+ff(d.total)+' kt'+(d.cls?', '+clsTxt[d.cls]+est2txt(d.estComb):'')+'.';
    if(d.v.atualN!=null&&Math.abs(d.v.atualN)>0.05)tx+=' Current-crop sales totaled '+ff(d.v.atual)+' kt and new-crop sales '+ff(d.v.atualN)+' kt.';
    return tx;};
  const s=soja;
  /* mesma precedência do texto em português: na faixa combinada, só a frase de vendas */
  let pSoja=s.estComb?combSales('Soybeans',s):('Soybeans: Weekly '+myLbl(s.ex.my)+' soybean sales totaled '+f0b(s.v.atual)+' kt'+(s.cls?', '+clsTxt[s.cls]+est2txt(s.est):'')+'.')
    +(rec?' The lowest reading of the marketing year.':'')+' Export commitments stand at '+f1e(s.ex.commit)+' Mmt'+(s.ex.meta!=null?', against a USDA target of '+f1e(s.ex.meta)+' Mmt for the season':'')+'.'
    +(s.ex.precisa!=null?(s.ex.precisa<15?(s.ex.commit>=s.ex.meta?' Commitments already cover the season target.':' Commitments practically cover the season target.')
      :' Reaching the target requires '+f0b(s.ex.precisa)+' kt per week on average'+(s.ex.lyMed!=null?(s.ex.precisa>=s.ex.lyMed?', above':', below')+' last year\'s average for the same stretch: '+f0b(s.ex.lyMed)+' kt.':'.')):'')
    +(!s.estComb&&s.v.atualN!=null&&s.v.atualN>0?' New crop: '+f0b(s.v.atualN)+' kt'+(s.clsN?', '+clsTxt[s.clsN]:'')+'.':'');
  const hi=(E.deep.weeklyHighlights||{})[s.v.data];
  if(hi&&hi.soja)pSoja+=' China totaled '+f0b(hi.soja.china_net)+' kt in net sales, including '+f0b(hi.soja.china_switched_from_unknown)+' kt switched from unknown destinations; Vietnam booked '+f0b(hi.soja.vietnam_net)+' kt, including '+f0b(hi.soja.vietnam_switched_from_unknown)+' kt reclassified from Unknown. Shipments to China reached '+f0b(hi.soja.china_exports)+' kt. Switched volumes are already in the weekly balances, not additional sales.';
  const fa=dados.farelo;
  let pFar=(fa.estComb?combSales('Soybean meal',fa):('Soybean meal: Sales totaled '+f0b(fa.v.atual)+' kt'+(fa.cls?', '+clsTxt[fa.cls]+est2txt(fa.est):'')+'.'))
    +(fa.estComb?' For the current crop, the 4-week average stands at ':' 4-week average at ')+f0b(fa.v.ma4)+' kt'+(fa.v.atual>=fa.v.ma4?', with export demand holding up.':'.');
  if(hi&&hi.farelo)pFar+=' Colombia ('+f0b(hi.farelo.net_destinations.Colombia)+' kt) and the Dominican Republic ('+f0b(hi.farelo.net_destinations.Dominican_Republic)+' kt) stood out; Saudi Arabia received '+f0b(hi.farelo.switched_unknown_to_saudi_arabia)+' kt reclassified from Unknown.';
  const ol=dados.oleo,olMini=Math.abs(ol.v.atual||0)<10,olTxt=olMini?N(Math.round((ol.v.atual||0)*10)/10,1):f0b(ol.v.atual);
  let pOl=ol.estComb?combSales('Soybean oil',ol,1):('Soybean oil: '+olTxt+' kt in the week'+(ol.cls?', '+clsTxt[ol.cls]:'')+'.');
  if(hi&&hi.oleo)pOl+=' Canada accounted for '+N(hi.oleo.net_destinations.Canada,1)+' kt of sales.';
  const mi=dados.milho,tg=dados.trigo;
  let pMT='Corn and wheat: '+(mi.estComb?combSales('Corn',mi).replace(/^Corn: /,''):('Corn totaled '+f0b(mi.v.atual)+' kt'+(mi.cls?', '+clsTxt[mi.cls]+est2txt(mi.est):'')
    +(mi.v.atualN!=null&&mi.v.atualN>0?', with '+f0b(mi.v.atualN)+' kt for the new crop'+(mi.clsN?', '+clsTxt[mi.clsN]+est2txt(mi.estN):''):'')+'.'))+' '
    +(tg.estComb?combSales('Wheat',tg):('Wheat, already in MY '+myLbl(tg.ex.my)+', posted '+f0b(tg.v.atual)+' kt'+(tg.cls?', '+clsTxt[tg.cls]+est2txt(tg.est):'')+(tg.v.atualN!=null&&tg.v.atualN>0?' and '+f0b(tg.v.atualN)+' kt for the new crop':'')+'.'));
  if(hi&&hi.milho&&hi.trigo)pMT+=' In corn, Unknown, Mexico and Japan led sales. Wheat posted the largest net sales of the marketing year, led by the Philippines ('+f0b(hi.trigo.net_destinations.Philippines)+' kt), with '+f0b(hi.trigo.switched_unknown_to_vietnam)+' kt switched from Unknown to Vietnam.';
  return '<p class="h1">'+h1+'</p><p class="sub">'+sub+'</p><p class="sec">HIGHLIGHTS</p><p>'+pSoja+'</p><p>'+pFar+'</p><p>'+pOl+'</p><p>'+pMT+'</p>';
};
new MutationObserver(()=>{document.querySelectorAll('.vend-wrap').forEach(el=>{const tx=el.querySelector('.vend-txt');if(tx&&el._genTxt&&tx.getAttribute('data-auto-sig')===_vendSig(tx.innerHTML))el._genTxt();});})
  .observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
})();
