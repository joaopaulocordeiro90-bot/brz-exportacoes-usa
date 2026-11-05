# BRZ EUA (Exportacoes USA) . modularizar.py
# Separa o HTML de arquivo unico na estrutura modular (css/, js/, data/, assets/images/).
# Extracao byte a byte: nenhum conteudo e alterado. Gera tambem js/core/export-adapter.js.
# Se a versao nova tiver bloco <style>/<script> com id nao mapeado, o script para com erro:
# acrescente o id em STYLE_MAP ou SCRIPT_MAP e rode de novo.
import re, os, json, base64, hashlib, shutil
ADAPTER_TPL=r'''/* ═══════════ BRZ EUA · adaptador de exportação (modularização GitHub Pages, 04/11/2026) ═══════════
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
var M=__MANIFEST__;
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
'''
import sys
if len(sys.argv)!=3:
    sys.exit('uso: python3 modularizar.py <BRZ_SAFRA_arquivo_unico.html> <pasta_saida>')
SRC,OUT=sys.argv[1],sys.argv[2]
raw=open(SRC,'rb').read()
s=raw.decode('utf-8')
assert s.encode('utf-8')==raw

# ---- tokenizer de topo (mesma regra do parser HTML para raw text) ----
blocks=[];i=0
while True:
    m=re.compile(r'<!--|<(script|style)\b',re.I).search(s,i)
    if not m: break
    if m.group(0)=='<!--':
        i=s.find('-->',m.end())+3; continue
    tag=m.group(1).lower(); te=s.find('>',m.end())
    close=re.compile(r'</'+tag+r'[\s/>]',re.I).search(s,te+1); ce=s.find('>',close.start())
    blocks.append(dict(tag=tag,start=m.start(),end=ce+1,open=s[m.start():te+1],cs=te+1,ce=close.start(),close=s[close.start():ce+1]))
    i=ce+1
assert all(b['close'] in ('</style>','</script>') for b in blocks)

STYLE_MAP={None:'css/01-base.css','brz-e88-dyn-style':'css/02-e88-dinamico.css','brz-e88-quadro-style':'css/03-e88-quadro.css',
 'brz-s31-zoom-style':'css/04-s31-zoom.css','brz-e88-mobile-style':'css/05-e88-mobile.css','brz-e88-home-style':'css/06-e88-home.css'}
SCRIPT_MAP={'__HISTORY__':'INLINE','eua-data':'data/eua-data.js','eua-state':'data/eua-state.js',
 'brz-dyn-native':'js/charts/dyn-native.js','brz-fit':'js/charts/fit.js',None:'js/core/app.js','brz-eua-quadro':'js/modules/quadro.js',
 'brz-q-zoom':'js/charts/q-zoom.js','brz-xlsx':'js/utils/excel-writer.js','brz-eua-base-export':'js/modules/base-export.js',
 'brz-eua-vendas-en':'js/modules/vendas-en.js','brz-i18n':'js/core/i18n.js'}
for _p in ['e44','e45','e46','e49','e54','e61','e62','e63','e64','e66','e67','e71','e73','e86','e87']:
    SCRIPT_MAP['eua-data-'+_p]='data/patches/eua-data-%s.js'%_p
SCRIPT_MAP['eua-vendest']='data/patches/eua-vendest.js'
SCRIPT_MAP['eua-estimates-e72']='data/patches/eua-estimates-e72.js'
ADAPTER='js/core/export-adapter.js'
for p in list(STYLE_MAP.values())+list(SCRIPT_MAP.values())+[ADAPTER]:
    assert not __import__('re').search(r'echarts|sheetjs|xlsx',p,__import__('re').I), p  # exportarHTML remove <script src> com esses termos

if os.path.exists(OUT): sys.exit('pasta de saida ja existe: '+OUT)
manifest={'styles':[],'scripts':[],'images':[],'self':'<script src="%s"></script>'%ADAPTER}
files={}
pieces=[];pos=0
for b in blocks:
    idm=re.search(r'id="([^"]+)"',b['open']); bid=idm.group(1) if idm else None
    content=s[b['cs']:b['ce']]
    pieces.append(s[pos:b['start']]); pos=b['end']
    if b['tag']=='style':
        if bid not in STYLE_MAP: sys.exit('bloco <style> sem destino no mapa: id=%r'%bid)
        dest=STYLE_MAP[bid]
        if dest=='INLINE': pieces.append(s[b['start']:b['end']]); continue
        tagtxt='<link rel="stylesheet" href="%s">'%dest
        manifest['styles'].append({'tag':tagtxt,'open':b['open'],'path':dest})
        files[dest]=content; pieces.append(tagtxt)
    else:
        if bid not in SCRIPT_MAP: sys.exit('bloco <script> sem destino no mapa: id=%r'%bid)
        dest=SCRIPT_MAP[bid]
        if dest=='INLINE': pieces.append(s[b['start']:b['end']]); continue
        attrs=b['open'][len('<script'):-1]  # ex: ' id="safra-data"'
        tagopen='<script%s src="%s">'%(attrs,dest)
        manifest['scripts'].append({'open_mod':tagopen,'open':b['open'],'path':dest})
        files[dest]=content
        extra='<script src="%s"></script>'%ADAPTER if bid is None else ''
        pieces.append(tagopen+'</script>'+extra)
pieces.append(s[pos:])
html=''.join(pieces)

# ---- imagens dos cartões da tela inicial ----
NAMES={'scr-soja':'card-soja','scr-farelo':'card-farelo','scr-oleo':'card-oleo','scr-milho':'card-milho','scr-trigo':'card-trigo','scr-vendas':'card-vendas','scr-base':'card-base'}
EXT={'image/jpeg':'jpg','image/svg+xml':'svg'}
imgbytes={}
def rep(m):
    go,mime,b64=m.group(1),m.group(2),m.group(3)
    data=base64.b64decode(b64,validate=True)
    assert base64.b64encode(data).decode()==b64, 'base64 nao canonico'
    path='assets/images/%s.%s'%(NAMES[go],EXT[mime])
    imgbytes[path]=data
    manifest['images'].append({'path':path,'mime':mime})
    return m.group(0).replace('url(data:%s;base64,%s)'%(mime,b64),'url(%s)'%path)
html,nimg=re.subn(r'<div class="newscard[^"]*" data-go="([a-z\-]+)" style="background-image:url\(data:([a-z/+]+);base64,([A-Za-z0-9+/=]+)\)">',rep,html)
if nimg!=7: print('AVISO: %d imagens de cartao convertidas (esperado 7 no e95)'%nimg)

# ---- grava ----
def w(path,data):
    full=os.path.join(OUT,path); os.makedirs(os.path.dirname(full),exist_ok=True)
    tmp=full+'.tmp'; open(tmp,'wb').write(data); os.replace(tmp,full)
for p,c in files.items(): w(p,c.encode('utf-8'))
for p,d in imgbytes.items(): w(p,d)
w('index.html',html.encode('utf-8'))
w('original/'+os.path.basename(SRC),raw)
w('tools/manifest.json',json.dumps(manifest,ensure_ascii=False,indent=1).encode('utf-8'))
w(ADAPTER,ADAPTER_TPL.replace('__MANIFEST__',json.dumps(manifest,ensure_ascii=False)).encode('utf-8'))
print('styles ext',len(manifest['styles']),'scripts ext',len(manifest['scripts']),'imgs',len(manifest['images']))
print('index bytes',len(html.encode('utf-8')))

print('ok:',OUT)
