import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const page=await browser.newPage({acceptDownloads:true,viewport:{width:1440,height:900}});
const errors=[],urls=[];
page.on('pageerror',e=>errors.push(String(e)));
page.on('request',r=>urls.push(r.url()));
// Test only: replace verifier values in memory, never publish a valid password.
await page.route('**/js/core/gate-handler.js',async route=>{
  const response=await route.fetch();
  let code=await response.text();
  assert(code.includes("const EXPECTED_HASH='7ec918667972eff2aaf4506fa911126580d2d528d30d9370ed69c4699964df52'"));
  code=code.replace("0bed476b092efc156b2d97a673ce3af5","746573742d73616c742d66726f6e74656e64")
    .replace("7ec918667972eff2aaf4506fa911126580d2d528d30d9370ed69c4699964df52","e9fbb7360c5e7f4f1fafd3c62bd8430d10aeefbb5b796fe5c79e1b4f85866045");
  await route.fulfill({response,body:code});
});
await page.goto('http://127.0.0.1:8000/',{waitUntil:'load'});
const gate=page.locator('#brz-access-gate');
assert(await gate.isVisible());
await page.locator('#brz-gate-password').fill('senha-errada');
await page.locator('#brz-gate-form button[type="submit"]').click();
await page.waitForFunction(()=>document.querySelector('#brz-gate-error').textContent.includes('incorreta'));
assert(await gate.isVisible());
await page.locator('#brz-gate-password').fill('314159');
await page.locator('#brz-gate-form button[type="submit"]').click();
await page.waitForFunction(()=>document.documentElement.classList.contains('brz-access-granted'));
assert.equal(await gate.isVisible(),false);
assert.equal(await page.evaluate(()=>E.meta.atual),'2026-10-29');
assert.equal(await page.evaluate(()=>Object.keys(__SAVED__.cards).length),88);
// Regressão: cards originalmente serializados em semana 7 da soja,
// semana 21 do trigo e semana 4 do óleo devem renderizar a última semana oficial.
// A migração jamais deve congelar week 7/4/21 num snapshot antigo.
for(const [com,week] of Object.entries({soja:9,milho:9,trigo:22,farelo:5,oleo:5})){
  await page.evaluate(com=>show('scr-'+com),com);
  const state=await page.evaluate(com=>{
    const grid=document.getElementById('g-'+com);
    const selects=[...grid.querySelectorAll('[data-card] select[data-role="week"]')];
    return {weeks:selects.map(s=>Number(s.value)),fresh:window.E.dados[com].s.MUNDO.at(-1)[2],
      world:window.E.dados[com].s.MUNDO.at(-1)[0],count:selects.length};
  },com);
  assert.equal(state.fresh,week,`USDA week ${com}`);
  assert(state.count>=5,`gráficos semanais ${com}`);
  assert(state.weeks.every(w=>w===week),`snapshot obsoleto ${com}: ${JSON.stringify(state)}`);
}
await page.evaluate(()=>show('scr-soja'));
const soyCard=page.locator('[data-card="netsafra|soja"]');
assert.equal(await soyCard.locator('select[data-role="week"]').inputValue(),'9');
await soyCard.locator('select[data-role="week"]').selectOption('7');
assert.equal(await soyCard.locator('select[data-role="week"]').inputValue(),'7','navegação histórica manual preservada');
await soyCard.locator('select[data-role="week"]').selectOption('9');
assert.equal(await soyCard.locator('select[data-role="week"]').inputValue(),'9','retorno à semana oficial');
await page.locator('#topmenu button[data-go="scr-vendas"]').click();
const table=page.locator('[data-card="vendsem|rep"]');
await table.waitFor();
assert.equal(await page.locator('#g-vendas .vtab').count(),1);
for(const [com,expect] of Object.entries({trigo:'300-500',milho:'800-1400',soja:'950-2200',farelo:'200-350',oleo:'0-10'}))
  assert.equal(await table.locator('[data-est="'+com+'-comb"]').innerText(),expect);
assert.equal(await page.evaluate(()=>E.deep.vendActual['2026-10-29'].soja.cy),1456.12);
const palette=await page.evaluate(()=>__SAVED__.palette);
assert(palette&&palette.navy);
await page.locator('#topmenu button[data-go="scr-opcoes"]').click();
await page.locator('#op-save').click();
assert(await page.evaluate(()=>Boolean(JSON.parse(localStorage.getItem('brz_eua_state')))));
const downloaded=page.waitForEvent('download',{timeout:65000});
await page.locator('#op-export').click();
const file=await downloaded;
const html=await fs.readFile(await file.path(),'utf8');
assert(html.startsWith('<!DOCTYPE html>'));
assert(html.includes('window.E')&&html.includes('window.__SAVED__'));
assert(!html.includes('id="brz-access-gate"'));
assert(!html.includes('src="js/core/gate-handler.js"'));
assert(!html.includes('src="js/core/cloud-sync.js"'));
assert(!html.includes('supabase.co'));
assert(!urls.some(url=>/supabase\.co/.test(url)));
assert.deepEqual(errors,[]);
console.log('STATIC SMOKE OK — senha, 88 cartões, cinco faixas, exportação offline, sem Supabase');
await browser.close();
