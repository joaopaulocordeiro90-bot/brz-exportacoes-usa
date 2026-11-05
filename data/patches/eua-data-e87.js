
/* e87 · 29Out2026 — Weekly Highlights USDA/FAS, reporting period 16–22 Oct 2026.
   Net sales and shipments are ALREADY in Country Detail e86; do not add them again.
   Switched is a reclassification of UNKNOWN sales, not an additional net sale. */
(()=>{
 const D=window.E.deep, day='2026-10-22';
 const put=(arr,row)=>{const i=arr.findIndex(x=>Array.isArray(x)&&x[0]===row[0]);
   if(i>=0)arr[i]=row;else arr.push(row);
   arr.sort((a,b)=>String(a[0]).localeCompare(String(b[0])));};
 // This is the exact soybean UNKNOWN -> China switched disclosed in Highlights.
 // Do not replace with China exports (1657 kt), China net sales (1627 kt), or sum of other switched.
 put(D.nar,[day,1627.0,1657.0,255.0,0]);
 D.switched_status_2026_10_22='Official USDA/FAS Weekly Highlights 16–22 Oct: 255.0 kt switched UNKNOWN -> China (soybeans); additional 110.0 kt UNKNOWN -> Vietnam, separate destination.';
 D.weeklyHighlights=D.weeklyHighlights||{};
 D.weeklyHighlights[day]={
  source:'USDA FAS Weekly Highlights Report',reported_period:'2026-10-16/2026-10-22',published:'2026-10-29',unit:'thousand metric tons',
  soja:{net:2576.4,weekly_exports:2384.1,weekly_exports_change_pct:18,china_net:1627.0,china_switched_from_unknown:255.0,china_decreases:33.9,china_exports:1657.0,
    spain_net:225.0,unknown_net:153.3,vietnam_net:123.1,vietnam_switched_from_unknown:110.0,vietnam_decreases:0.4,pakistan_net:120.0,
    reductions:{Mexico:50.8,Japan:49.5,Barbados:1.5},shipments:{China:1657.0,Mexico:200.5,Egypt:187.4,Algeria:96.3,Vietnam:74.4}},
  milho:{net:1303.9,weekly_exports:552.9,sales_change_pct:-15,exports_change_pct:-29,
    net_destinations:{Unknown:411.8,Mexico:318.9,Japan:251.0,South_Korea:124.9,Colombia:55.0},
    reductions:{El_Salvador:7.5,Guatemala:2.2,Barbados:0.7},shipments:{Mexico:333.0,Honduras:110.3,Colombia:56.0,Canada:12.9,Spain:11.4}},
  trigo:{net:849.8,next_my_net:22.0,weekly_exports:266.0,my_high:true,next_my_destination:'Peru',
    net_destinations:{Philippines:226.3,South_Korea:154.0,Indonesia:140.0,Vietnam:100.7,Mexico:93.3},
    switched_unknown_to_vietnam:76.0,shipments:{Vietnam:67.7,Philippines:63.3,Mexico:61.8,South_Korea:54.0,Honduras:14.1}},
  farelo:{net:347.5,weekly_exports:410.6,
    net_destinations:{Colombia:55.0,Dominican_Republic:52.0,Mexico:40.4,Saudi_Arabia:33.0,Morocco:30.0},
    switched_unknown_to_saudi_arabia:30.0,
    shipments:{Vietnam:59.0,Japan:50.0,South_Korea:45.1,Mexico:43.4,Honduras:38.2},optional_origin_outstanding:{Ecuador:6.3}},
  oleo:{net:11.6,weekly_exports:2.0,net_destinations:{Canada:11.3,Mexico:0.3},shipments:{Canada:1.6,Mexico:0.3}},
  soybean_own_account:{exports_for_own_account:1.8,destination:'Taiwan'},
  dailyReporting:[
   {commodity:'milho',destination:'Unknown',amount_kt:116.0,my:'2026/27'},
   {commodity:'soja',destination:'China',amount_kt:948.0,my:'2026/27'},
   {commodity:'soja',destination:'Spain',amount_kt:165.0,my:'2026/27'},
   {commodity:'soja',destination:'Unknown',amount_kt:261.0,my:'2026/27'}],
  dailyReportingNote:'Subset of transactions reported under daily reporting system for the weekly period. NOT incremental to the weekly net sales; avoid double-counting.'
 };
 D.weeklyHighlightsSource_2026_10_22={file:'WeeklyHighlightsReport.pdf',pages:[1,2,3],status:'verified',
  note:'Narrative, reclassifications and daily reports verified; net sales/exports already incorporated from Country Detail e86.'};
})();
