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
assert.equal(await page.evaluate(()=>E.meta.atual),'2026-11-05');
assert.equal(await page.evaluate(()=>E.meta.gerado),'2026-11-12');
assert.equal(await page.evaluate(()=>E.meta.wasde_atual),'2026-11-10');
assert.equal(await page.evaluate(()=>BUILD),'e102 · 13Nov');
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
 result.cur26=E.deep.cur26['10'];
 result.trendSvg=gWasde('soja');
 return result;
});
const expected={
 soja:{old:46130.2725,goal:46810.66,week:10,accum:13902.9,comm:31388.6},
 milho:{old:83823.96,goal:83188.93,week:10,accum:11995.4,comm:27672.6},
 trigo:{old:20411.625,goal:20411.625,week:23,accum:8040.1,comm:12239.4},
 farelo:{old:20593.0936,goal:20593.0936,week:6,accum:1713.8,comm:6812.0},
 oleo:{old:181.4369,goal:181.4369,week:6,accum:10.4,comm:39.7}
};
const near=(a,b,msg)=>assert(Math.abs(a-b)<0.0005,msg+' '+a+' vs '+b);
for(const [com,e] of Object.entries(expected)){
 const d=wasde[com];
 assert.equal(d.released,1,'duplicate WASDE '+com);
 assert.equal(d.now[0],'2026-11-10');
 assert.equal(d.latest[0],'2026-11-10');
 assert.equal(d.date,'2026-11-05','latest FAS date '+com);
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
assert.equal(wasde.cur26,67.1,'percentile cached soy 2026/27');
assert(wasde.trendSvg.includes('67,1%'),'historical WASDE chart latest point should show revised program %');
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
for(const [com,week] of Object.entries({soja:10,milho:10,trigo:23,farelo:6,oleo:6})){
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
 const now=C.seriesAt(2026,10),old=C.seriesAt(2025,10),missing=C.seriesAt(2021,10);
 return {now,old,missing,years:C.defaultConfig().compare};
});
near(comparison.now.china,16637.2,'soja China semana 10');
near(comparison.now.other,9382,'soja não-China semana 10');
near(comparison.now.unknown,5369.4,'soja UNKNOWN separado');
near(comparison.now.total,31388.6,'commitment soja semana 10');
near(comparison.now.china+comparison.now.other+comparison.now.unknown,comparison.now.total,'reconciliação china/outros/unknown');
near(comparison.now.otherPct,29.889832614388666,'share não-China do total');
assert(Number.isFinite(comparison.old.other),'MY anterior com dados na semana 10');
assert(comparison.missing===null||Number.isFinite(comparison.missing.total),'MY antigo sem interpolação de faltantes');
assert.deepEqual(comparison.years,[2025],'comparador inicial: último MY');
const compareCard=page.locator('[data-card="cnnoncommit|soja"]');
assert.equal(await compareCard.count(),1,'único card novo');
assert(await compareCard.locator('svg[data-cnnon-graph]').isVisible(),'gráfico SVG renderizado');
assert.equal(await compareCard.locator('select[data-role="week"]').inputValue(),'10');
assert.equal(await compareCard.locator('select[data-role="metric"]').inputValue(),'volume');
assert.equal(await compareCard.locator('circle[data-cnnon-point="2026-china"]').count(),1);
assert.equal(await compareCard.locator('circle[data-cnnon-point="2026-other"]').count(),1);
assert.equal(await compareCard.locator('circle[data-cnnon-point="2025-china"]').count(),1);
assert((await compareCard.locator('.china-metrics').innerText()).includes('9,4'));
const dims=await compareCard.evaluate(el=>({width:el.getBoundingClientRect().width,height:el.getBoundingClientRect().height}));
assert(dims.width>600,'card em duas colunas: '+dims.width);
assert(dims.height<650,'card compacto, altura não exagerada: '+JSON.stringify(dims));

assert.equal(await compareCard.locator('[data-cnnon-endlabel="china"]').count(),1,'rótulo da China');
assert.equal(await compareCard.locator('[data-cnnon-endlabel="other"]').count(),1,'rótulo não-China');
const current=compareCard.locator('path[data-cnnon-series="2026-china"]').first();
const history=compareCard.locator('path[data-cnnon-series="2025-china"]').first();
assert.equal(await current.getAttribute('stroke-width'),'3.4','linha atual destacada');
assert.equal(await history.getAttribute('stroke-width'),'2.1','linha histórica perceptível');
assert((await history.getAttribute('stroke-dasharray')).length>0,'linha histórica tracejada');
assert.equal(await compareCard.locator('line[data-cnnon-selected-week]').count(),1,'indicador da semana X');
const svgHover=compareCard.locator('svg[data-cnnon-graph]');
await svgHover.scrollIntoViewIfNeeded(); // o card está abaixo da dobra na aba Soja
const hoverRect=await svgHover.boundingBox();
assert(hoverRect&&hoverRect.width>500,'área SVG de leitura');
const pointerX=w=>hoverRect.x+(58+(w-1)/52*783)/900*hoverRect.width;
const pointerY=v=>hoverRect.y+v/288*hoverRect.height;
await page.mouse.move(pointerX(7),pointerY(135));
await page.waitForTimeout(170);
const hovered=await page.evaluate(()=>{
 const card=document.querySelector('[data-card="cnnoncommit|soja"]');
 const chart=card.querySelector('.cnnon-chart'),svg=chart.querySelector('svg[data-cnnon-graph]'),
       tt=chart.querySelector('.cnnon-tooltip'),rect=svg.getBoundingClientRect(),matrix=svg.getScreenCTM();
 const pt=svg.createSVGPoint();pt.x=rect.left+rect.width*(58+(7-1)/52*783)/900;pt.y=rect.top+rect.height*135/288;
 const svgp=matrix?pt.matrixTransform(matrix.inverse()):null;
 return {ready:chart.dataset.cnnonHover,hidden:tt?.hidden,layer:svg.querySelector('[data-cnnon-hover-layer]')?.getAttribute('visibility'),
   chart:chart.getBoundingClientRect().toJSON(),svg:rect.toJSON(),matrix:matrix?String(matrix):null,
   svgPointer:svgp?{x:svgp.x,y:svgp.y}:null};
});
assert.equal(hovered.hidden,false,'hover should open tooltip '+JSON.stringify({hovered,errors}));
const tt=compareCard.locator('.cnnon-tooltip');
assert(await tt.isVisible(),'tooltip mouse disponível');
let textHover=await tt.innerText();
assert(textHover.includes('Semana 7'),'hover com snap à semana 7');
assert(textHover.includes('MY 2026/27')&&textHover.includes('MY 2025/26'),'tooltip por safra');
assert(textHover.includes('China')&&textHover.includes('Não-China')&&textHover.includes('UNKNOWN'),'colunas detalhadas e UNKNOWN');
assert.equal(await compareCard.locator('[data-cnnon-hover-layer]').getAttribute('visibility'),'visible','crosshair ativo');
assert(await compareCard.locator('[data-cnnon-hover-markers] circle').count()>=2,'marcadores de série');
await page.mouse.move(pointerX(8),pointerY(160));
assert((await tt.innerText()).includes('Semana 8'),'tooltip dinâmico na semana 8');
await page.mouse.move(hoverRect.x-20,hoverRect.y-20);
assert.equal(await tt.isVisible(),false,'tooltip fecha ao retirar mouse');
await svgHover.focus();
await svgHover.press('ArrowLeft');
assert((await tt.innerText()).includes('Semana 9'),'navegação acessível por teclado');
await svgHover.press('Escape');
assert.equal(await tt.isVisible(),false,'Escape fecha tooltip');
assert.equal(await compareCard.locator('[data-cnnon-kpi]').count(),0,'não depender de HTML legado dos cards');
assert.equal(await compareCard.locator('.cnnon-kpi').count(),0,'restaurado resumo compacto da e99');
assert((await compareCard.locator('.china-metrics').innerText()).includes('UNKNOWN'),'resumo e99 preservado');
await compareCard.locator('[data-cnnon-preset="clear"]').click();
assert.equal(await compareCard.locator('input[data-compare-year="2025"]').isChecked(),false,'limpar comparações');
assert.equal(await compareCard.locator('path[data-cnnon-series="2025-china"]').count(),0,'somente MY atual');
await compareCard.locator('[data-cnnon-preset="last"]').click();
assert.equal(await compareCard.locator('input[data-compare-year="2025"]').isChecked(),true,'preset atual + anterior');
assert.equal(await compareCard.locator('path[data-cnnon-series="2025-china"]').count()>0,true,'série anterior restaurada');

await compareCard.locator('select[data-role="week"]').selectOption('7');
assert.equal(await compareCard.locator('select[data-role="week"]').inputValue(),'7','corte até semana 7');
assert.equal(await compareCard.locator('circle[data-cnnon-point="2026-china"]').count(),1);
await compareCard.locator('select[data-role="week"]').selectOption('10');
await compareCard.locator('select[data-role="metric"]').selectOption('share');
assert((await compareCard.locator('.china-metrics').innerText()).includes('29,9%'),'modo share');
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
assert.equal(await restored.locator('select[data-role="week"]').inputValue(),'10');
await restored.locator('.mini.rst').click();
assert.equal(await restored.locator('select[data-role="metric"]').inputValue(),'volume','reset de metric');
assert.equal(await restored.locator('input[data-compare-year="2024"]').isChecked(),false,'reset de ano');
const soyCard=page.locator('[data-card="netsafra|soja"]');
// Um cartão antigo pode preservar seleção manual nesta build; exercer explicitamente a semana corrente antes do teste.
await soyCard.locator('select[data-role="week"]').selectOption('10');
assert.equal(await soyCard.locator('select[data-role="week"]').inputValue(),'10');
await soyCard.locator('select[data-role="week"]').selectOption('7');
assert.equal(await soyCard.locator('select[data-role="week"]').inputValue(),'7','navegação histórica manual preservada');
await soyCard.locator('select[data-role="week"]').selectOption('10');
assert.equal(await soyCard.locator('select[data-role="week"]').inputValue(),'10','retorno à semana oficial');
await page.locator('#topmenu button[data-go="scr-vendas"]').click();
const table=page.locator('[data-card="vendsem|rep"]');
console.log('page errors before sales table:',errors); await table.waitFor({timeout:8000});
assert.equal(await page.locator('#g-vendas .vtab').count(),1);
for(const [com,expect] of Object.entries({trigo:'350-650',milho:'1000-3600',soja:'800-2000',farelo:'250-500',oleo:'0-10'}))
  assert.equal(await table.locator('[data-est="'+com+'-comb"]').innerText(),expect);
assert.equal(await page.evaluate(()=>E.deep.vendActual['2026-10-29'].soja.cy),1456.12,'prior FAS preserved');
assert.equal(await page.evaluate(()=>E.deep.vendActual['2026-11-05'].soja.cy),1154.8,'soy weekly');
assert.equal(await page.evaluate(()=>E.deep.vendActual['2026-11-05'].milho.nc),594.4,'corn next MY');
assert.equal(await page.evaluate(()=>E.deep.vendActual['2026-11-05'].farelo.nc),-0.2,'meal negative next MY');
assert.equal(await page.evaluate(()=>E.deep.expectations_vs_actual_2026_11_05.trigo.within),false,'wheat below estimate');
assert.equal(await page.evaluate(()=>E.deep.expectations_vs_actual_2026_11_05.milho.actual_comb),3475.8,'corn total combined');
assert.equal(await page.evaluate(()=>E.dados.soja.s.Germany.find(r=>r[0]==='2026-10-29')[3]),116,'German revised');
assert.equal(await page.evaluate(()=>E.dados.soja.s.Netherlands.find(r=>r[0]==='2026-10-29')[3]),201.3,'Dutch revised');
assert.equal(await page.evaluate(()=>E.deep.weeklyHighlights['2026-11-05'].soja.china_switched_from_unknown),246,'switched is reclassification');
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
assert(html.includes('eua-data-e102')&&html.includes('2026-11-05'),'FAS 05Nov in exported HTML');
assert(html.includes('brz-cnnon-e101-style'),'estilos novos embutidos no HTML exportado');
assert(html.includes('data-cnnon-crosshair-x'),'crosshair exportado junto ao gráfico');
assert(!html.includes('id="brz-access-gate"'));
assert(!html.includes('src="js/core/gate-handler.js"'));
assert(!html.includes('src="js/core/cloud-sync.js"'));
assert(!html.includes('supabase.co'));
assert(!urls.some(url=>/supabase\.co/.test(url)));
assert.deepEqual(errors,[]);
console.log('STATIC SMOKE OK — senha, 88 cartões, cinco faixas, exportação offline, sem Supabase');
await browser.close();
