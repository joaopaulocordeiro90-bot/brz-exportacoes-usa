/* BRZ Exportações USA — administração sincronizada. Somente edições; USDA permanece imutável no build. */
(function(){
'use strict';
const ENDPOINT="https://ckamifxyfmdjcomldsdb.supabase.co/functions/v1/brz-eua-gateway";
const TOKEN="brz_eua_cloud_session_v1", REVS="brz_eua_cloud_revisions_v1",
      SHADOWS="brz_eua_cloud_shadows_v1", DIRTY="brz_eua_cloud_pending_v1";
const SECTIONS=["display_state","language"], STORE={display_state:"brz_eua_state",language:"brz_eua_language"};
let revisions=readJSON(REVS,{}), shadows=readJSON(SHADOWS,{}), dirty=new Set(readJSON(DIRTY,[]).filter(s=>SECTIONS.includes(s)));
let enabled=false,suspended=false,blocked=false,working=false,saveTimer=0,editTimer=0,refreshTimer=0;
function readJSON(key,fallback){try{return JSON.parse(localStorage.getItem(key)||"")||fallback;}catch{return fallback;}}
function token(){try{return sessionStorage.getItem(TOKEN)||"";}catch{return "";}}
function persist(){suspended=true;try{localStorage.setItem(REVS,JSON.stringify(revisions));localStorage.setItem(SHADOWS,JSON.stringify(shadows));localStorage.setItem(DIRTY,JSON.stringify([...dirty]));}finally{suspended=false;}}
function toastStatus(message,isError){
  let el=document.getElementById("brz-sync-status");
  if(!el){el=document.createElement("aside");el.id="brz-sync-status";el.dataset.brzCloud="1";
    el.style.cssText="position:fixed;bottom:14px;right:14px;z-index:2147483000;background:white;border:1px solid #dae5ec;border-left:3px solid #0d9488;border-radius:5px;padding:8px 11px;max-width:340px;box-shadow:0 3px 10px #152e4025;font:600 11px/1.4 Arial;color:#19354d;pointer-events:none";
    document.body.append(el);}
  el.style.borderLeftColor=isError?"#b42318":"#0d9488";el.textContent=message;
}
function errorFor(a){
  switch(a){case "invalid_credentials":return "Senha incorreta.";case "too_many_attempts":return "Muitas tentativas; aguarde 15 minutos.";
    case "unauthorized":return "Sua sessão expirou.";case "conflict":return "Outra sessão alterou os dados. Nenhuma edição local foi sobrescrita. Exporte seu HTML e recarregue para conciliar.";
    case "too_large":return "O tamanho das edições excede o limite do servidor.";
    default:return "Falha na comunicação com o Supabase.";}
}
async function request(action,params={},secret=""){
  const t=secret||token();let r;
  try{r=await fetch(ENDPOINT,{method:"POST",mode:"cors",cache:"no-store",
    headers:{"Content-Type":"application/json",...(t?{"Authorization":"Bearer "+t}:{})},
    body:JSON.stringify({action,...params})});}catch{throw Error("Sem conexão com o Supabase.");}
  let a;try{a=await r.json();}catch{throw Error("Resposta inválida do Supabase.");}
  if(!r.ok||!a.ok){const e=Error(errorFor(a.error));e.code=a.error;throw e;}
  return a;
}
function sectionPayload(section){
  const raw=localStorage.getItem(STORE[section]);
  if(section==="language")return {value:raw||"pt-BR"};
  if(!raw)return null;
  try{const s=JSON.parse(raw);return s&&typeof s==="object"&&!Array.isArray(s)?s:null;}catch{return null;}
}
function saveLocalBackup(section,oldValue){
  if(!oldValue)return;
  try{localStorage.setItem("brz_eua_cloud_backup_"+section+"_"+Date.now(),oldValue);}catch{}
}
function hydrate(remote){
  let changed=false;
  suspended=true;
  try{
    for(const section of SECTIONS){
      const obj=remote&&remote[section];if(!obj)continue;
      const rev=Number(obj.revision),payload=obj.payload;
      if(!Number.isSafeInteger(rev)||rev<1||!payload||typeof payload!=="object"||Array.isArray(payload))continue;
      const local=localStorage.getItem(STORE[section]);
      const emptyRemote=rev===1&&Object.keys(payload).length===0;
      if(emptyRemote){
        if(local&&sectionPayload(section)){dirty.add(section);}
        revisions[section]=rev;continue;
      }
      const next=section==="language"?String(payload.value||"pt-BR"):JSON.stringify(payload);
      if(local!==next){
        if(dirty.has(section)){
          blocked=true;toastStatus("Há edições locais pendentes em "+section+". O banco não sobrescreveu esses dados.",true);
          continue;
        }
        saveLocalBackup(section,local);
        localStorage.setItem(STORE[section],next);
        changed=true;
      }
      revisions[section]=rev;
      shadows[section]=JSON.stringify(payload);
    }
    persist();
  }finally{suspended=false;}
  return changed;
}
async function login(pin){
  if(!/^[0-9]{6}$/.test(pin))throw Error("Informe os seis dígitos da senha.");
  const a=await request("login",{pin});
  try{sessionStorage.setItem(TOKEN,a.token);}catch{throw Error("Não foi possível guardar a sessão neste navegador.");}
  try{
    const d=await request("read",{},a.token);
    hydrate(d.sections);
    sessionStorage.setItem("brz_eua_cloud_gate_open","yes");
    location.reload();return true;
  }catch(e){sessionStorage.removeItem(TOKEN);sessionStorage.removeItem("brz_eua_cloud_gate_open");throw e;}
}
async function logout(){
  try{await request("logout");}catch{}
  try{sessionStorage.removeItem(TOKEN);sessionStorage.removeItem("brz_eua_cloud_gate_open");}catch{}
  document.documentElement.classList.remove("brz-access-granted");location.reload();
}
function queue(section){
  if(!enabled||suspended||blocked||!token()||!SECTIONS.includes(section))return;
  dirty.add(section);persist();toastStatus("BRZ EUA: alteração registrada; sincronizando…");
  clearTimeout(saveTimer);saveTimer=setTimeout(flush,900);
}
async function flush(){
  if(working||blocked||!enabled||!token()||!dirty.size)return;
  working=true;
  try{
    while(dirty.size&&!blocked){
      const section=dirty.values().next().value;
      const payload=sectionPayload(section);
      if(!payload){dirty.delete(section);persist();continue;}
      const serialized=JSON.stringify(payload);
      if(serialized===shadows[section]){dirty.delete(section);persist();continue;}
      const revision=Number(revisions[section]);
      if(!Number.isSafeInteger(revision)||revision<1)throw Error("Revisão não carregada. Refaça o login.");
      const a=await request("save",{section,payload,expected_revision:revision});
      revisions[section]=a.revision;shadows[section]=serialized;dirty.delete(section);persist();
      toastStatus("BRZ EUA: alterações sincronizadas ✓");
    }
  }catch(e){
    if(e.code==="conflict")blocked=true;
    persist();toastStatus("BRZ EUA: "+e.message+" Edições mantidas neste navegador.",true);
  }finally{working=false;}
}
async function refresh(){
  if(!enabled||blocked||working||dirty.size||!token())return;
  try{
    const a=await request("read");const changed=hydrate(a.sections);
    if(changed&&!blocked){toastStatus("Alterações de outra sessão encontradas; atualizando…");location.reload();}
  }catch(e){
    if(e.code==="unauthorized"){await logout();}
    else toastStatus("Banco temporariamente indisponível; dados locais preservados.",true);
  }
}
function markOpen(){
  const gate=document.getElementById("brz-access-gate");if(gate)gate.hidden=true;
  document.documentElement.classList.add("brz-access-granted");
}
async function start(){
  if(!token())return;
  try{
    const d=await request("read");
    const changed=hydrate(d.sections);
    if(changed&&!blocked){location.reload();return;}
    enabled=true;markOpen();
    toastStatus(blocked?"BRZ EUA: conflito local pendente. Faça backup antes de conciliar.":"BRZ EUA: conectado · sincronização ativa",blocked);
    if(dirty.size&&!blocked)flush();
    refreshTimer=setInterval(refresh,45000);
  }catch(e){
    if(e.code==="unauthorized")sessionStorage.removeItem(TOKEN);
    toastStatus("BRZ EUA: "+e.message,true);
  }
}
function scheduleAutoSave(delay=1300){
  if(!enabled||blocked||!token())return;
  clearTimeout(editTimer);
  editTimer=setTimeout(()=>{
    if(!enabled||blocked||!token()||document.hidden)return;
    if(document.activeElement?.isContentEditable)return; /* aguarda blur, evita truncar texto em digitação */
    if(typeof window.saveState==="function"){
      try{window.saveState();}catch(e){toastStatus("Não foi possível salvar a edição.",true);}
    }
  },delay);
}
function hookStorage(){
  const native=Storage.prototype.setItem;
  Storage.prototype.setItem=function(k,value){
    const result=native.apply(this,arguments);
    if(this===localStorage&&!suspended){
      if(k===STORE.display_state)queue("display_state");
      if(k===STORE.language)queue("language");
    }
    return result;
  };
}
function setupAutoSave(){
  document.addEventListener("focusout",e=>{
    if(e.target?.isContentEditable||e.target?.closest?.("[contenteditable]"))scheduleAutoSave(400);
  },true);
  document.addEventListener("change",e=>{
    if(e.target?.closest?.(".p-card"))scheduleAutoSave(600);
  },true);
  document.addEventListener("pointerup",e=>{
    if(document.body.classList.contains("edit")&&e.target?.closest?.(".p-card"))scheduleAutoSave(1700);
  },true);
  document.addEventListener("keydown",e=>{
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="s"&&token()){
      e.preventDefault();if(typeof window.saveState==="function")window.saveState();
    }
  });
}
function keepSingleFileExport(){
  if(typeof window.exportarHTML!=="function")return;
  const original=window.exportarHTML;
  window.exportarHTML=function(){
    const nodes=[...document.querySelectorAll('[data-brz-cloud],#brz-history-trigger,#brz-history-modal,#brz-history-styles,#brz-sync-status')];
    const removed=nodes.filter(n=>n.isConnected).map(node=>{
      const anchor=document.createComment("BRZ_CLOUD_TEMP");
      node.parentNode.insertBefore(anchor,node);node.remove();
      return {node,anchor};
    });
    try{return original.apply(this,arguments);}
    finally{removed.forEach(({node,anchor})=>{anchor.replaceWith(node);});}
  };
  /* O app original registra o onclick durante a execução síncrona; reatribuir ao wrapper. */
  const exportBtn=document.getElementById('op-export');
  if(exportBtn)exportBtn.onclick=window.exportarHTML;
}
async function history(){return request("history");}
async function backupSnapshot(){
  if(blocked||working||dirty.size)throw Error("Há alterações pendentes. Resolva antes do backup.");
  return request("read");
}
async function restoreRevision(section,revision,expected_revision){
  if(blocked||working||dirty.size)throw Error("Não é seguro restaurar enquanto existem alterações locais pendentes.");
  const r=await request("restore",{section,revision,expected_revision});await refresh();return r;
}
async function importSnapshot(sections){
  if(blocked||working||dirty.size)throw Error("Não é seguro importar enquanto existem alterações locais pendentes.");
  if(!sections||typeof sections!=="object"||SECTIONS.some(s=>!sections[s]))throw Error("Arquivo de backup inválido.");
  const r=await request("read"),expected={};
  SECTIONS.forEach(s=>expected[s]=Number(r.sections[s].revision));
  const x=await request("import",{sections,expected});await refresh();return x;
}
window.BRZSYNC={login,logout,refresh,flush,history,backupSnapshot,restoreRevision,importSnapshot,version:"eua-cloud-v1"};
hookStorage();setupAutoSave();keepSingleFileExport();
window.addEventListener("focus",()=>{if(!document.hidden){if(dirty.size&&!blocked)flush();else refresh();}});
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});
else start();
})();