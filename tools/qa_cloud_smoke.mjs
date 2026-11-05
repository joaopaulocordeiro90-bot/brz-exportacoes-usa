import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';

const ENDPOINT='https://ckamifxyfmdjcomldsdb.supabase.co/functions/v1/brz-eua-gateway';
const sections={display_state:{revision:1,payload:{}},language:{revision:1,payload:{}}};
let saveCalls=0;
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const page=await browser.newPage({acceptDownloads:true,viewport:{width:1440,height:900}});
const errors=[];
page.on('pageerror',e=>errors.push(String(e.message)));
await page.route(ENDPOINT,async route=>{
  const req=JSON.parse(route.request().postData()||'{}');
  let data={ok:false,error:'unknown_action'},status=200;
  switch(req.action){
    case 'login': data={ok:true,token:'a'.repeat(64),expires_at:new Date(Date.now()+8*3600_000).toISOString()};break;
    case 'read': data={ok:true,sections};break;
    case 'save': {
      assert.equal(req.expected_revision,sections[req.section].revision);
      const r=++sections[req.section].revision;
      sections[req.section].payload=req.payload;
      saveCalls++;
      data={ok:true,revision:r,section:req.section};break;
    }
    case 'history': data={ok:true,current:[],history:[],backups:[]};break;
    case 'logout': data={ok:true};break;
    default:status=400;
  }
  await route.fulfill({status,contentType:'application/json',headers:{'access-control-allow-origin':'*'},body:JSON.stringify(data)});
});
await page.goto('http://127.0.0.1:8000/',{waitUntil:'load',timeout:45000});
await page.locator('#brz-access-gate').waitFor();
assert.equal(await page.locator('#brz-access-gate').isVisible(),true);
assert.equal(await page.evaluate(()=>getComputedStyle(document.querySelector('.topnav')).visibility),'hidden');
await page.locator('#brz-gate-password').fill('123456');
await page.locator('#brz-gate-form button[type=submit]').click();
await page.waitForFunction(()=>document.documentElement.classList.contains('brz-access-granted'),{timeout:25000});
assert.equal(await page.locator('#brz-access-gate').isVisible(),false);
assert(await page.evaluate(()=>Boolean(window.E&&window.E.meta&&window.BRZSYNC)));
// Pré-USDA: somente a tabela original recebe as cinco expectativas.
await page.locator('#topmenu button[data-go="scr-vendas"]').click();
const tab=page.locator('[data-card="vendsem|rep"]');
await tab.waitFor({state:'visible'});
assert.equal(await page.locator('#brz-vendas-pre-report').count(),0,'Tabela extra não foi eliminada');
assert.equal(await page.locator('#g-vendas .vtab').count(),1,'Deve existir uma só tabela');
assert.equal(await tab.getAttribute('data-est-week'),'2026-10-29');
const text=await tab.innerText();
assert(text.includes('Estimativas')&&text.includes('29/10'));
assert(text.includes('Vendas Semana')&&text.includes('29/10'));
assert(text.includes('Estimativas'));
assert((await tab.locator('[data-est="trigo-comb"]').innerText())==='300-500');
for(const [com,range] of [['trigo','300-500'],['milho','800-1400'],['soja','950-2200'],['farelo','200-350'],['oleo','0-10']]){
 const cell=tab.locator('[data-est="'+com+'-comb"]');
 assert.equal(await cell.innerText(),range,com+' deve estar na tabela original');
}
assert.equal(await page.evaluate(()=>E.meta.atual),'2026-10-29');
assert.equal(await page.evaluate(()=>E.deep.vendActual['2026-10-29'].soja.cy),1456.12);
assert.equal(await page.evaluate(()=>E.deep.vendActual['2026-10-29'].trigo.nc),19.2);
assert.equal(await page.evaluate(()=>E.deep.vendActual['2026-10-29'].farelo.nc),0.284);
assert.equal(await page.evaluate(()=>E.deep.nar.find(r=>r[0]==='2026-10-29')[3]),null);
assert.equal(await page.evaluate(()=>E.dados.soja.s.MUNDO.at(-1)[3]+E.dados.soja.s.MUNDO.at(-1)[4]),30233.822);
assert.equal(await page.evaluate(()=>E.dados.milho.s.MUNDO.at(-1)[3]+E.dados.milho.s.MUNDO.at(-1)[4]),24791.199);
assert.equal(await page.evaluate(()=>E.dados.trigo.s.MUNDO.at(-1)[3]+E.dados.trigo.s.MUNDO.at(-1)[4]),12056.591);
assert.equal(await page.evaluate(()=>E.dados.farelo.s.MUNDO.at(-1)[3]+E.dados.farelo.s.MUNDO.at(-1)[4]),6451.144);
assert.equal(await page.evaluate(()=>E.dados.oleo.s.MUNDO.at(-1)[3]+E.dados.oleo.s.MUNDO.at(-1)[4]),37.966);
const officialComment=await page.locator('[data-card="vendtxt|rep"] .vend-txt').innerText();
assert(officialComment.includes('1.456'),'Comentário deve tratar o realizado 29/10');
assert(officialComment.includes('950-2.200'),'Comentário deve comparar o realizado 29/10 com seu consenso original');
await page.locator('#topmenu button[data-go="scr-opcoes"]').click();
await page.locator('#op-save').click();
await page.waitForTimeout(2500);
assert(saveCalls>0,'Salvar não iniciou sincronização');
const downloadEvent=page.waitForEvent('download',{timeout:35000});
await page.locator('#op-export').click();
const download=await downloadEvent;
const html=await fs.readFile(await download.path(),'utf8');
assert(html.startsWith('<!DOCTYPE html>'));
assert(html.includes('window.__SAVED__'));
assert(html.includes('window.E'));
assert(!html.includes('brz-access-gate'),'Exportação contém tela de senha dependente da nuvem');
assert(!html.includes('js/core/cloud-sync.js'),'Exportação mantém dependência nuvem');
assert(!html.includes('src="js/core/app.js"'),'Exportação mantém scripts externos');
assert(errors.length===0,'Erros JS no navegador: '+errors.slice(0,5).join('; '));
console.log('SMOKE OK — senha, sincronização, exportação autocontida. Salvos:',saveCalls,'Tamanho exportação:',html.length);
await browser.close();
