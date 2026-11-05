/* BRZ Exportações USA · trava de interface local, sem servidor/Supabase.
   Atenção: GitHub Pages serve os arquivos publicamente. Isto é senha da interface,
   não autenticação na borda nem proteção contra acesso direto aos assets. */
(function(){
'use strict';
const KDF_SALT='bdb68e4315ad5f32f2876ae6d39dca89';
const EXPECTED_HASH='d581a7658e0871fd54ad9c3fef3c504aa2a2b57e0b05fe1e5467439048554922';
const ITERATIONS=260000;
const SESSION='brz_eua_local_gate_until_v1';
const gate=document.getElementById('brz-access-gate');
const form=document.getElementById('brz-gate-form');
const field=document.getElementById('brz-gate-password');
const error=document.getElementById('brz-gate-error');
const showBtn=document.getElementById('brz-gate-show');
const submit=form.querySelector('[type="submit"]');
const asBytes=hex=>new Uint8Array((hex.match(/.{2}/g)||[]).map(p=>parseInt(p,16)));
let attempts=0,lockedUntil=0;
function grant(){
  document.documentElement.classList.add('brz-access-granted');
  gate.hidden=true;
  field.value='';
}
function until(){try{return Number(sessionStorage.getItem(SESSION))||0;}catch{return 0;}}
async function verify(password){
  if(!globalThis.crypto||!crypto.subtle)throw Error('Este navegador não permite verificação local de senha em conexão insegura.');
  const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveBits']);
  const bits=await crypto.subtle.deriveBits({name:'PBKDF2',salt:asBytes(KDF_SALT),iterations:ITERATIONS,hash:'SHA-256'},key,256);
  const got=new Uint8Array(bits),exp=asBytes(EXPECTED_HASH);
  let delta=got.length^exp.length;
  for(let i=0;i<Math.min(got.length,exp.length);i++)delta|=got[i]^exp[i];
  return delta===0;
}
showBtn.addEventListener('click',()=>{
  const masked=field.type==='password';
  field.type=masked?'text':'password';
  showBtn.textContent=masked?'Ocultar':'Mostrar';
  field.focus();
});
form.addEventListener('submit',async ev=>{
  ev.preventDefault();error.textContent='';
  if(Date.now()<lockedUntil){error.textContent='Muitas tentativas. Tente novamente daqui a um minuto.';return;}
  submit.disabled=true;
  try{
    if(!await verify(field.value))throw Error('Senha incorreta.');
    try{sessionStorage.setItem(SESSION,String(Date.now()+8*60*60*1000));}catch{}
    attempts=0;grant();
  }catch(e){
    attempts++;field.value='';field.focus();
    if(attempts>=5){lockedUntil=Date.now()+60*1000;attempts=0;error.textContent='Limite de tentativas. Aguarde um minuto.';}
    else error.textContent=e.message||'Falha na verificação.';
  }finally{submit.disabled=false;}
});
if(until()>Date.now())grant();
function keepOfflineExport(){
  const original=window.exportarHTML;
  if(typeof original!=='function')return;
  window.exportarHTML=function(){
    /* HTML exportado foi criado para funcionar offline e sem tela de senha. */
    const nodes=[...document.querySelectorAll('[data-brz-cloud]')];
    const removed=nodes.filter(node=>node.isConnected).map(node=>{
      const anchor=document.createComment('BRZ_GATE_EXPORT');
      node.before(anchor);node.remove();return {node,anchor};
    });
    try{return original.apply(this,arguments);}
    finally{removed.forEach(({node,anchor})=>anchor.replaceWith(node));}
  };
  const exp=document.getElementById('op-export');
  if(exp)exp.onclick=window.exportarHTML;
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',keepOfflineExport,{once:true});
else keepOfflineExport();
})();
