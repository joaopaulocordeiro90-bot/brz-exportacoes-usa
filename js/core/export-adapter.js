/* ═══════════ BRZ EUA · adaptador de exportação (modularização GitHub Pages, 04/11/2026) ═══════════
   Única peça nova da migração. Não altera dados, cálculos, layout nem comportamento.
   O EXPORTAR HTML (exportarHTML em js/core/app.js) serializa document.documentElement, cria um Blob
   e baixa via a.click() com nome brz_eua_app_<build>.html. Na versão modular, essa serialização traria
   <link>/<script src> e imagens em arquivo. Este adaptador intercepta apenas esse clique (nome
   brz_eua_app_*.html, href blob:, conteúdo com a tag do próprio adaptador) e devolve CSS, scripts e
   imagens ao formato de arquivo único, nas mesmas posições. Resultado igual ao EXPORTAR HTML do original.
   Requer HTTP (GitHub Pages ou servidor local). Em file:// o navegador bloqueia a leitura dos arquivos;
   nesse caso a exportação é cancelada com aviso, sem gerar arquivo incompleto.
   Todos os outros downloads (PNG, CSV, XLSX, ZIP) passam direto, sem alteração. */
(function(){
'use strict';
var M={"styles":[{"tag":"<link rel=\"stylesheet\" href=\"css/01-base.css\">","open":"<style>","path":"css/01-base.css"},{"tag":"<link rel=\"stylesheet\" href=\"css/02-e88-dinamico.css\">","open":"<style id=\"brz-e88-dyn-style\">","path":"css/02-e88-dinamico.css"},{"tag":"<link rel=\"stylesheet\" href=\"css/03-e88-quadro.css\">","open":"<style id=\"brz-e88-quadro-style\">","path":"css/03-e88-quadro.css"},{"tag":"<link rel=\"stylesheet\" href=\"css/04-s31-zoom.css\">","open":"<style id=\"brz-s31-zoom-style\">","path":"css/04-s31-zoom.css"},{"tag":"<link rel=\"stylesheet\" href=\"css/05-e88-mobile.css\">","open":"<style id=\"brz-e88-mobile-style\">","path":"css/05-e88-mobile.css"},{"tag":"<link rel=\"stylesheet\" href=\"css/06-e88-home.css\">","open":"<style id=\"brz-e88-home-style\">","path":"css/06-e88-home.css"}],"scripts":[{"open_mod":"<script id=\"eua-data\" src=\"data/eua-data.js\">","open":"<script id=\"eua-data\">","path":"data/eua-data.js"},{"open_mod":"<script id=\"eua-state\" src=\"data/eua-state.js\">","open":"<script id=\"eua-state\">","path":"data/eua-state.js"},{"open_mod":"<script id=\"eua-data-e44\" src=\"data/patches/eua-data-e44.js\">","open":"<script id=\"eua-data-e44\">","path":"data/patches/eua-data-e44.js"},{"open_mod":"<script id=\"eua-data-e45\" src=\"data/patches/eua-data-e45.js\">","open":"<script id=\"eua-data-e45\">","path":"data/patches/eua-data-e45.js"},{"open_mod":"<script id=\"eua-data-e46\" src=\"data/patches/eua-data-e46.js\">","open":"<script id=\"eua-data-e46\">","path":"data/patches/eua-data-e46.js"},{"open_mod":"<script id=\"eua-data-e49\" src=\"data/patches/eua-data-e49.js\">","open":"<script id=\"eua-data-e49\">","path":"data/patches/eua-data-e49.js"},{"open_mod":"<script id=\"eua-data-e54\" src=\"data/patches/eua-data-e54.js\">","open":"<script id=\"eua-data-e54\">","path":"data/patches/eua-data-e54.js"},{"open_mod":"<script id=\"eua-data-e61\" src=\"data/patches/eua-data-e61.js\">","open":"<script id=\"eua-data-e61\">","path":"data/patches/eua-data-e61.js"},{"open_mod":"<script id=\"eua-data-e62\" src=\"data/patches/eua-data-e62.js\">","open":"<script id=\"eua-data-e62\">","path":"data/patches/eua-data-e62.js"},{"open_mod":"<script id=\"eua-data-e63\" src=\"data/patches/eua-data-e63.js\">","open":"<script id=\"eua-data-e63\">","path":"data/patches/eua-data-e63.js"},{"open_mod":"<script id=\"eua-vendest\" src=\"data/patches/eua-vendest.js\">","open":"<script id=\"eua-vendest\">","path":"data/patches/eua-vendest.js"},{"open_mod":"<script id=\"eua-data-e64\" src=\"data/patches/eua-data-e64.js\">","open":"<script id=\"eua-data-e64\">","path":"data/patches/eua-data-e64.js"},{"open_mod":"<script id=\"eua-data-e66\" src=\"data/patches/eua-data-e66.js\">","open":"<script id=\"eua-data-e66\">","path":"data/patches/eua-data-e66.js"},{"open_mod":"<script id=\"eua-data-e67\" src=\"data/patches/eua-data-e67.js\">","open":"<script id=\"eua-data-e67\">","path":"data/patches/eua-data-e67.js"},{"open_mod":"<script id=\"eua-data-e71\" src=\"data/patches/eua-data-e71.js\">","open":"<script id=\"eua-data-e71\">","path":"data/patches/eua-data-e71.js"},{"open_mod":"<script id=\"eua-estimates-e72\" src=\"data/patches/eua-estimates-e72.js\">","open":"<script id=\"eua-estimates-e72\">","path":"data/patches/eua-estimates-e72.js"},{"open_mod":"<script id=\"eua-data-e73\" src=\"data/patches/eua-data-e73.js\">","open":"<script id=\"eua-data-e73\">","path":"data/patches/eua-data-e73.js"},{"open_mod":"<script id=\"eua-data-e86\" src=\"data/patches/eua-data-e86.js\">","open":"<script id=\"eua-data-e86\">","path":"data/patches/eua-data-e86.js"},{"open_mod":"<script id=\"eua-data-e87\" src=\"data/patches/eua-data-e87.js\">","open":"<script id=\"eua-data-e87\">","path":"data/patches/eua-data-e87.js"},{"open_mod":"<script id=\"eua-estimates-2026-10-29\" src=\"data/patches/eua-estimates-2026-10-29.js\">","open":"<script id=\"eua-estimates-2026-10-29\">","path":"data/patches/eua-estimates-2026-10-29.js"},{"open_mod":"<script id=\"eua-data-e96\" src=\"data/patches/eua-data-e96.js\">","open":"<script id=\"eua-data-e96\">","path":"data/patches/eua-data-e96.js"},{"open_mod":"<script id=\"eua-wasde-2026-11-10\" src=\"data/patches/eua-wasde-2026-11-10.js\">","open":"<script id=\"eua-wasde-2026-11-10\">","path":"data/patches/eua-wasde-2026-11-10.js"},{"open_mod":"<script id=\"brz-dyn-native\" src=\"js/charts/dyn-native.js\">","open":"<script id=\"brz-dyn-native\">","path":"js/charts/dyn-native.js"},{"open_mod":"<script id=\"brz-fit\" src=\"js/charts/fit.js\">","open":"<script id=\"brz-fit\">","path":"js/charts/fit.js"},{"open_mod":"<script src=\"js/core/app.js\">","open":"<script>","path":"js/core/app.js"},{"open_mod":"<script id=\"brz-eua-quadro\" src=\"js/modules/quadro.js\">","open":"<script id=\"brz-eua-quadro\">","path":"js/modules/quadro.js"},{"open_mod":"<script id=\"brz-q-zoom\" src=\"js/charts/q-zoom.js\">","open":"<script id=\"brz-q-zoom\">","path":"js/charts/q-zoom.js"},{"open_mod":"<script id=\"brz-xlsx\" src=\"js/utils/excel-writer.js\">","open":"<script id=\"brz-xlsx\">","path":"js/utils/excel-writer.js"},{"open_mod":"<script id=\"brz-eua-base-export\" src=\"js/modules/base-export.js\">","open":"<script id=\"brz-eua-base-export\">","path":"js/modules/base-export.js"},{"open_mod":"<script id=\"brz-eua-vendas-en\" src=\"js/modules/vendas-en.js\">","open":"<script id=\"brz-eua-vendas-en\">","path":"js/modules/vendas-en.js"},{"open_mod":"<script id=\"brz-i18n\" src=\"js/core/i18n.js\">","open":"<script id=\"brz-i18n\">","path":"js/core/i18n.js"}],"images":[{"path":"assets/images/card-soja.jpg","mime":"image/jpeg"},{"path":"assets/images/card-farelo.jpg","mime":"image/jpeg"},{"path":"assets/images/card-oleo.jpg","mime":"image/jpeg"},{"path":"assets/images/card-milho.jpg","mime":"image/jpeg"},{"path":"assets/images/card-trigo.jpg","mime":"image/jpeg"},{"path":"assets/images/card-vendas.jpg","mime":"image/jpeg"},{"path":"assets/images/card-base.jpg","mime":"image/jpeg"}],"self":"<script src=\"js/core/export-adapter.js\"></script>"};
var proto=HTMLAnchorElement.prototype,origClick=proto.click;
var SNAP=/^brz_eua_app_.*\.html$/;
function isEN(){return document.documentElement.lang==='en';}
function getText(u){return fetch(u,{cache:'no-cache'}).then(function(r){if(!r.ok)throw new Error(u+' HTTP '+r.status);return r.text();});}
function getB64(u){return fetch(u,{cache:'no-cache'}).then(function(r){if(!r.ok)throw new Error(u+' HTTP '+r.status);return r.arrayBuffer();}).then(function(buf){
  var a=new Uint8Array(buf),bin='';for(var i=0;i<a.length;i+=0x8000)bin+=String.fromCharCode.apply(null,a.subarray(i,i+0x8000));return btoa(bin);});}
function once(h,t){var i=h.indexOf(t);if(i<0||h.indexOf(t,i+1)>=0)throw new Error('marcador ausente ou repetido: '+t.slice(0,80));return i;}
function spliceAt(h,i,len,rep){return h.slice(0,i)+rep+h.slice(i+len);}
function inlineAll(html){
  if(location.protocol==='file:')return Promise.reject(new Error('file://'));
  var jobs=[];
  M.styles.forEach(function(x){jobs.push(getText(x.path).then(function(c){x.c=c;}));});
  M.scripts.forEach(function(x){jobs.push(getText(x.path).then(function(c){x.c=c;}));});
  M.images.forEach(function(x){jobs.push(getB64(x.path).then(function(c){x.c=c;}));});
  return Promise.all(jobs).then(function(){
    var h=html,i;
    i=once(h,M.self);h=spliceAt(h,i,M.self.length,'');
    M.styles.forEach(function(x){i=once(h,x.tag);h=spliceAt(h,i,x.tag.length,x.open+x.c+'</style>');});
    M.scripts.forEach(function(x){
      i=once(h,x.open_mod);var after=i+x.open_mod.length;
      if(h.substr(after,9)==='</script>')h=spliceAt(h,i,x.open_mod.length,x.open+x.c);  /* conteúdo estático do arquivo */
      else h=spliceAt(h,i,x.open_mod.length,x.open);                                     /* conteúdo gravado em tempo de execução (ex.: eua-state) */
    });
    M.images.forEach(function(x){var t='url('+x.path+')';i=once(h,t);h=spliceAt(h,i,t.length,'url(data:'+x.mime+';base64,'+x.c+')');});
    return h;
  });
}
proto.click=function(){
  var a=this,name=String(a.download||''),href=String(a.href||'');
  if(!SNAP.test(name)||href.indexOf('blob:')!==0)return origClick.apply(a,arguments);
  fetch(href).then(function(r){return r.text();}).then(function(html){
    if(html.indexOf(M.self)<0){origClick.call(a);return;}
    return inlineAll(html).then(function(h){
      var b=document.createElement('a');
      b.href=URL.createObjectURL(new Blob([h],{type:'text/html;charset=utf-8'}));
      b.download=name;origClick.call(b);
      setTimeout(function(){URL.revokeObjectURL(b.href);},60000);
    });
  }).catch(function(e){
    console.error('[BRZ export-adapter]',e);
    alert(isEN()?'EXPORT HTML needs the platform opened over HTTP (GitHub Pages or a local server). Export cancelled; nothing was generated. ('+e.message+')'
               :'EXPORTAR HTML exige a plataforma aberta por HTTP (GitHub Pages ou servidor local). Exportação cancelada, nenhum arquivo gerado. ('+e.message+')');
  });
};
proto.click.__brzAdapter=true;
})();
