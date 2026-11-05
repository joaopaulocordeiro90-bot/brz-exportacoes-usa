/* Regressão independente de Supabase: edição e96 reaplicada sobre build e97. */
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:1380,height:900}});
const errors=[];
page.on('pageerror',e=>errors.push(String(e)));
await page.route('**/js/core/gate-handler.js',async route=>{
 const response=await route.fetch();let s=await response.text();
 s=s.replace('bdb68e4315ad5f32f2876ae6d39dca89','746573742d73616c742d66726f6e74656e64')
 .replace('d581a7658e0871fd54ad9c3fef3c504aa2a2b57e0b05fe1e5467439048554922','c53bdfa605294d5175dc26b8764c7c5ad5d3c229b8c3cbdad63d5201f290ebb7');
 await route.fulfill({response,body:s});
});
await page.goto('http://127.0.0.1:8000/',{waitUntil:'load'});
await page.locator('#brz-gate-password').fill('qa-test-password');
await page.locator('#brz-gate-form button[type="submit"]').click();
await page.waitForFunction(()=>document.documentElement.classList.contains('brz-access-granted'));
const prior=await page.evaluate(()=>{
 show('scr-soja');
 const card=document.querySelector('[data-card="netsafra|soja"]');
 if(!card)throw Error('missing chart');
 card.querySelector('.p-card-t').textContent='TÍTULO EDITADO PELO USUÁRIO';
 card.querySelector('.p-card-t').style.fontSize='22px';
 card.querySelector('.p-card-s').textContent='Subtítulo personalizado';
 const svg=card.querySelector('.chart svg');
 if(svg)svg.insertAdjacentHTML('beforeend','<text class="old-build-marker">OLD DATA</text>');
 saveState();
 return {build:BUILD,old:window.__SAVED__.cards['netsafra|soja'],count:Object.keys(window.__SAVED__.cards).length};
});
assert.equal(prior.build,'e96 · 05Nov');
assert(prior.old.html.includes('OLD DATA'));
let upgraded=false;
await page.route('**/js/core/app.js',async route=>{
 const response=await route.fetch();let s=await response.text();
 assert(s.includes("const BUILD='e96 · 05Nov';"));
 s=s.replace("const BUILD='e96 · 05Nov';","const BUILD='e97 · 12Nov';");
 s="E.meta.atual='2026-11-05';\n"+s;
 upgraded=true;
 await route.fulfill({response,body:s});
});
await page.reload({waitUntil:'load'});
await page.waitForFunction(()=>document.documentElement.classList.contains('brz-access-granted'));
assert(upgraded);
await page.evaluate(()=>show('scr-soja'));
const after=await page.evaluate(()=>{
 const card=document.querySelector('[data-card="netsafra|soja"]');
 return {
  title:card.querySelector('.p-card-t')?.textContent,
  sub:card.querySelector('.p-card-s')?.textContent,
  fontsize:card.querySelector('.p-card-t')?.style.fontSize,
  hasSvg:!!card.querySelector('.chart svg'),
  frozen:card.innerHTML.includes('OLD DATA'),
  dataAtual:window.__SAVED__.cards['netsafra|soja'].sourceDataAtual,
  sourceBuild:window.__SAVED__.cards['netsafra|soja'].sourceBuild,
  count:Object.keys(window.__SAVED__.cards).length
 };
});
assert.equal(after.title,'TÍTULO EDITADO PELO USUÁRIO');
assert.equal(after.sub,'Subtítulo personalizado');
assert.equal(after.fontsize,'22px');
assert(after.hasSvg);
assert.equal(after.frozen,false);
assert.equal(after.dataAtual,'2026-11-05');
assert.equal(after.sourceBuild,'e97 · 12Nov');
assert(after.count>=prior.count);
assert.deepEqual(errors,[]);
console.log('STANDALONE REBASE OK',JSON.stringify({count:after.count,build:after.sourceBuild}));
await browser.close();
