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
assert.equal(await page.evaluate(()=>E.meta.gerado),'2026-11-05');
assert.equal(await page.evaluate(()=>E.meta.wasde_atual),'2026-11-10');
assert.equal(await page.evaluate(()=>BUILD),'e99 · 11Nov');
assert((await page.locator('#dt').innerText()).includes('WASDE 10/11/26'));
const wasde=await page.evaluate(()=>{
 const result={};
 for(const com of ['soja','milho','trigo','farelo','oleo']){
  const d=E.dados[com],old=d.wasde.find(r=>r[0]==='2026-10-09');
  const now=d.wasde.find(r=>r[0]==='2026-11-10');
  const actual=d.s.MUNDO.at(-1),cum=actual[3],comm=actual[3]+actual[4];
  result[com]={latest:d.wasde.at(-1),old,now,
    released:d.wasde.filter(x=>x[0]==='2026-11-10').length,
    date:actual[0],week:actual[2],cum,comm,
    curPct:commitPctCtx(com).atual.v,
    goalNow:wasdeGoalAtObservation(com,actual),
    goalBefore:wasdeGoalAtObservation(com,d.s.MUNDO.at(-2)),
    nmyGoal:E.deep.nmy_wasde[com][2026]};
 }
 result.cur26=E.deep.cur26['9'];
 result.trendSvg=gWasde('soja');
 return result;
});
const expected={
 soja:{old:46130.2725,goal:46810.66,week:9,accum:12020.552,comm:30233.822},
 milho:{old:83823.96,goal:83188.93,week:9,accum:11126.29,comm:24791.199},
 trigo:{old:20411.625,goal:20411.625,week:22,accum:7800.65,comm:12056.591},
 farelo:{old:20593.0936,goal:20593.0936,week:5,accum:1326.939,comm:6451.144},
 oleo:{old:181.4369,goal:181.4369,week:5,accum:8.513,comm:37.966}
};
const near=(a,b,msg)=>assert(Math.abs(a-b)<0.0005,msg+' '+a+' vs '+b);
for(const [com,e] of Object.entries(expected)){
 const d=wasde[com];
 assert.equal(d.released,1,'duplicate WASDE '+com);
 assert.equal(d.now[0],'2026-11-10');
 assert.equal(d.latest[0],'2026-11-10');
 assert.equal(d.date,'2026-10-29','latest FAS date '+com);
 assert.equal(d.week,e.week);
 near(d.old[1],e.old,'October preserved '+com);
 near(d.now[1],e.goal,'Nov target '+com);
 near(d.nmyGoal,e.goal,'next program reference '+com);
 near(d.goalNow,e.goal,'current graph target '+com);
 near(d.goalBefore,e.old,'historical graph target '+com);
 near(d.cum,e.accum,'FAS shipped '+com);
 near(d.comm,e.comm,'FAS commitment '+com);
 near(d.curPct,e.comm/e.goal*100,'current commitment % '+com);
}
assert.equal(wasde.cur26,64.6,'percentile cached soy 2026/27');
assert(wasde.trendSvg.includes('64,6%'),'historical WASDE chart latest point should show revised program %');
// Não mudar metas retroativamente em observações históricas.
const prior=await page.evaluate(()=>{
 const r=E.dados.soja.s.MUNDO.find(x=>x[0]==='2026-10-22');
 return {wasde:wasdeGoalAtObservation('soja',r),current:E.dados.soja.wasde.at(-1)[1]};
});
near(prior.wasde,46130.2725,'historic soybean 22Oct unchanged');
assert.notEqual(prior.wasde,prior.current);

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
// USDA/FAS: o total deve reconciliar China + não-China identificado + UNKNOWN.
// Curvas multi-MY não podem tratar UNKNOWN como compras de outros destinos.
const comparison=await page.evaluate(()=>{
 const C=window.BRZChinaNonChina;
 const now=C.seriesAt(2026,9),old=C.seriesAt(2025,9),missing=C.seriesAt(2021,9);
 return {now,old,missing,years:C.defaultConfig().compare};
});
near(comparison.now.china,15948.067,'soja China semana 9');
near(comparison.now.other,8682.255,'soja não-China semana 9');
near(comparison.now.unknown,5603.5,'soja UNKNOWN separado');
near(comparison.now.total,30233.822,'commitment soja semana 9');
near(comparison.now.china+comparison.now.other+comparison.now.unknown,comparison.now.total,'reconciliação china/outros/unknown');
near(comparison.now.otherPct,28.7170310,'share não-China do total');
near(comparison.old.other,13424.9,'comparativo não-China 2025/26 semana 9');
assert.equal(comparison.missing,null,'histórico 2021/22 insuficiente na semana 9');
assert.deepEqual(comparison.years,[2025],'comparador inicial: último MY');
const compareCard=page.locator('[data-card="cnnoncommit|soja"]');
assert.equal(await compareCard.count(),1,'único card novo');
assert(await compareCard.locator('svg[data-cnnon-graph]').isVisible(),'gráfico SVG renderizado');
assert.equal(await compareCard.locator('select[data-role="week"]').inputValue(),'9');
assert.equal(await compareCard.locator('select[data-role="metric"]').inputValue(),'volume');
assert.equal(await compareCard.locator('circle[data-cnnon-point="2026-china"]').count(),1);
assert.equal(await compareCard.locator('circle[data-cnnon-point="2026-other"]').count(),1);
assert.equal(await compareCard.locator('circle[data-cnnon-point="2025-china"]').count(),1);
assert((await compareCard.locator('.china-metrics').innerText()).includes('8,7'));
const width=await compareCard.evaluate(el=>el.getBoundingClientRect().width);
assert(width>600,'card novo deve ocupar ambas as colunas: '+width);
await compareCard.locator('select[data-role="week"]').selectOption('7');
assert.equal(await compareCard.locator('select[data-role="week"]').inputValue(),'7','corte até semana 7');
assert.equal(await compareCard.locator('circle[data-cnnon-point="2026-china"]').count(),1);
await compareCard.locator('select[data-role="week"]').selectOption('9');
await compareCard.locator('select[data-role="metric"]').selectOption('share');
assert((await compareCard.locator('.china-metrics').innerText()).includes('28,7%'),'modo share');
await compareCard.locator('input[data-compare-year="2024"]').check();
assert.equal(await compareCard.locator('circle[data-cnnon-point="2024-other"]').count(),1);
assert.equal(await compareCard.locator('input[data-compare-year="2024"]').isChecked(),true);
await page.evaluate(()=>saveState());
const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('brz_eua_state')).cards['cnnoncommit|soja']);
assert(saved.html.includes('data-compare-year="2024" checked'),'sobreposições salvas');
await page.reload({waitUntil:'load'});
await page.waitForFunction(()=>document.documentElement.classList.contains('brz-access-granted'));
await page.evaluate(()=>show('scr-soja'));
const restored=page.locator('[data-card="cnnoncommit|soja"]');
assert.equal(await restored.locator('select[data-role="metric"]').inputValue(),'share','share persistente');
assert.equal(await restored.locator('input[data-compare-year="2024"]').isChecked(),true,'ano persistente');
assert.equal(await restored.locator('select[data-role="week"]').inputValue(),'9');
await restored.locator('.mini.rst').click();
assert.equal(await restored.locator('select[data-role="metric"]').inputValue(),'volume','reset de metric');
assert.equal(await restored.locator('input[data-compare-year="2024"]').isChecked(),false,'reset de ano');
const soyCard=page.locator('[data-card="netsafra|soja"]');
// Um cartão antigo pode preservar seleção manual nesta build; exercer explicitamente a semana corrente antes do teste.
await soyCard.locator('select[data-role="week"]').selectOption('9');
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
assert(html.includes('china-nonchina')&&html.includes('data-cnnon-graph'),'gráfico China/Não-China deve permanecer no HTML exportado');
assert(html.includes('cnnoncommit|soja'),'novo card no HTML exportado');
assert(!html.includes('id="brz-access-gate"'));
assert(!html.includes('src="js/core/gate-handler.js"'));
assert(!html.includes('src="js/core/cloud-sync.js"'));
assert(!html.includes('supabase.co'));
assert(!urls.some(url=>/supabase\.co/.test(url)));
assert.deepEqual(errors,[]);
console.log('STATIC SMOKE OK — senha, 88 cartões, cinco faixas, exportação offline, sem Supabase');
await browser.close();
