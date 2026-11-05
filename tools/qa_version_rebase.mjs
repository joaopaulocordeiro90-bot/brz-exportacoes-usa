/* BRZ EUA — regression: e96→e97, zero writes to the real Supabase. */
import {chromium} from "playwright";
import assert from "node:assert/strict";
const ENDPOINT="https://ckamifxyfmdjcomldsdb.supabase.co/functions/v1/brz-eua-gateway";
const sections={display_state:{revision:1,payload:{}},language:{revision:1,payload:{}}};
let saveCount=0,servedNewBuild=false;
const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
const page=await browser.newPage({viewport:{width:1380,height:900},acceptDownloads:true});
const errors=[];
page.on("pageerror",e=>errors.push(e.message));
await page.route(ENDPOINT,async route=>{
 const body=JSON.parse(route.request().postData()||"{}");
 let result={ok:false,error:"unknown_action"},status=200;
 if(body.action==="login")result={ok:true,token:"a".repeat(64)};
 else if(body.action==="read")result={ok:true,sections};
 else if(body.action==="save"){
   const state=sections[body.section];
   assert.equal(body.expected_revision,state.revision,"revision mismatch in mock");
   state.payload=body.payload;state.revision++;saveCount++;
   result={ok:true,section:body.section,revision:state.revision};
 }
 else if(body.action==="history")result={ok:true,current:[],history:[],backups:[]};
 else status=400;
 await route.fulfill({status,contentType:"application/json",headers:{"access-control-allow-origin":"*"},body:JSON.stringify(result)});
});
await page.goto("http://127.0.0.1:8000/",{waitUntil:"load"});
await page.locator("#brz-gate-password").fill("123456");
await page.locator("#brz-gate-form button[type=submit]").click();
await page.waitForFunction(()=>document.documentElement.classList.contains("brz-access-granted"),{timeout:20000});
const original=await page.evaluate(()=>{
 show("scr-soja");
 const card=document.querySelector('[data-card="netsafra|soja"]');
 assert=null;
 if(!card)throw Error("soja card absent");
 const series=card.querySelector(".lg span input.lgc");
 card.querySelector(".p-card-t").textContent="TÍTULO EDITADO PELO USUÁRIO";
 card.querySelector(".p-card-t").style.fontSize="22px";
 card.querySelector(".p-card-s").textContent="Subtítulo editado";
 if(series){series.value="#123456";card.style.setProperty(series.dataset.var,"#123456");}
 const svg=card.querySelector(".chart svg");
 if(svg)svg.insertAdjacentHTML("beforeend",'<text class="old-build-marker">VALOR ANTIGO 100</text>');
 saveState();
 return {build:BUILD,data:E.meta.atual,cardCount:Object.keys(window.__SAVED__.cards).length};
});
assert.equal(original.build,"e96 · 05Nov");
await page.waitForTimeout(2200);
assert(saveCount>=1,"e95 save not synchronized");
const oldState=sections.display_state.payload;
assert(oldState.cards["netsafra|soja"].html.includes("VALOR ANTIGO 100"));
const sentinel="__qa_unopened_card|soja";
const pendingCard={html:'<div class="qa-pending">SNAPSHOT DE OUTRA ABA</div>',style:"",
  sourceBuild:"e96 · 05Nov",sourceDataAtual:original.data};
oldState.cards[sentinel]=pendingCard;
await page.evaluate(({sentinel,pendingCard})=>{
 const stored=JSON.parse(localStorage.getItem("brz_eua_state"));
 stored.cards[sentinel]=pendingCard;
 localStorage.setItem("brz_eua_state",JSON.stringify(stored));
},{sentinel,pendingCard});
const totalKeys=Object.keys(oldState.cards).length;
assert(totalKeys>1,"expected multiple cards");
await page.route("**/js/core/app.js",async route=>{
 const res=await route.fetch();
 let source=await res.text();
 assert(source.includes("const BUILD='e96 · 05Nov';"));
 source=source.replace("const BUILD='e96 · 05Nov';","const BUILD='e97 · 12Nov';");
 source="E.meta.atual='2026-11-05';\n"+source;
 servedNewBuild=true;
 await route.fulfill({response:res,body:source});
});
await page.reload({waitUntil:"load"});
await page.waitForFunction(()=>document.documentElement.classList.contains("brz-access-granted"),{timeout:20000});
assert(servedNewBuild);
const before=await page.evaluate(()=>({
 build:BUILD,data:E.meta.atual,from:window.__SAVED__?.migratedFrom,
 card:window.__SAVED__?.cards["netsafra|soja"],
 count:Object.keys(window.__SAVED__?.cards||{}).length
}));
assert.equal(before.build,"e97 · 12Nov");
assert.equal(before.data,"2026-11-05");
assert.equal(before.from.build,"e96 · 05Nov");
assert.equal(before.card.sourceBuild,"e96 · 05Nov");
await page.evaluate(()=>show("scr-soja"));
const next=await page.evaluate(()=>{
 const card=document.querySelector('[data-card="netsafra|soja"]');
 return {title:card.querySelector(".p-card-t").textContent,
   sub:card.querySelector(".p-card-s").textContent,
   font:card.querySelector(".p-card-t").style.fontSize,
   svg:!!card.querySelector(".chart svg"),
   oldSvgMarker:card.innerHTML.includes("VALOR ANTIGO 100"),
   updatedBuild:window.__SAVED__.cards["netsafra|soja"].sourceBuild,
   updatedData:window.__SAVED__.cards["netsafra|soja"].sourceDataAtual};
});
assert.equal(next.title,"TÍTULO EDITADO PELO USUÁRIO");
assert.equal(next.sub,"Subtítulo editado");
assert.equal(next.font,"22px");
assert(next.svg);
assert.equal(next.oldSvgMarker,false,"Old USDA SVG copied into new build");
assert.equal(next.updatedBuild,"e97 · 12Nov");
assert.equal(next.updatedData,"2026-11-05");
await page.evaluate(()=>saveState());
const kept=await page.evaluate(sentinel=>({
 count:Object.keys(window.__SAVED__.cards).length,
 pending:Object.values(window.__SAVED__.cards).filter(s=>s.sourceBuild!=="e97 · 12Nov").length,
 pendingKept:window.__SAVED__.cards[sentinel]?.html?.includes("SNAPSHOT DE OUTRA ABA")||false
}),sentinel);
assert(kept.count>=totalKeys,"Unrendered cards lost on save");
assert(kept.pendingKept,"Unopened card snapshot lost on save");
assert.deepEqual(errors,[],"Browser JavaScript errors");
console.log("VERSION REBASE PASS",JSON.stringify({before:original,after:next,carried:kept,remoteSaveCount:saveCount}));
await browser.close();
