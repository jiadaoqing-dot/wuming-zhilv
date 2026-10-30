// ===== 物品菜单(第二十轮:左键单击弹出;右键也照样能用)=====
let CMR=null,CMF=0,cmT=0;
function cmItems(r){if(r=='ttl'){const L=TTLO.filter(ttlHas),w=ttlWorn();return L.length?[...L.map(id=>[(w==id?'✅ 佩戴中「':'· 佩戴「')+TTL[id].n+'」','tw_'+id]),[w?'✕ 不佩戴':'✅ 不佩戴','tw_']]:[]}  // 第六十八轮:佩戴称号
  const it=itOf(r);
  const mx=it&&it.mss?[['📤 取下技能石「'+MSS[it.mss.slice(2)][0]+'」','msx']]:[];
  if(/^b\d/.test(r)&&it)return [['🛡️ 穿戴','eq'],['💰 出售 +'+sellPr(it)+' 金币','sell'],...mx];
  if(/^e:/.test(r)&&it)return [['📤 卸下','un'],['💰 出售 +'+sellPr(it)+' 金币','sell'],...mx];
  const id=cosId(r);if(id){const on=WEAR[COSD[id].t]==id;return [[on?'📤 卸下':'👘 穿戴',on?'cu':'cw'],['💰 出售 +'+COSSELL+' 金币','csell']]}
  if(r&&r.startsWith('p:')){const k=r.slice(2);if(!POT[k])return null;const L=POTD[k][2]=='rev'?[]:[['🧪 使用','pu']];for(let i=0;i<3;i++)L.push(['⌨️ 放到快捷栏 '+(i+1)+(QS[i]==k?' ✓':''),'q'+i]);L.push(['💰 出售 1 瓶 +'+Math.floor(POTD[k][4]/2),'ps1']);return L}
  if(r&&r.startsWith('i:')&&/^ms\d+$/.test(r.slice(2))&&MSS[r.slice(4)])return [...WMODES.filter(k=>EQ[k]).map(k=>['💎 嵌入'+SL[k][0]+(EQ[k].mss?'(替换「'+MSS[EQ[k].mss.slice(2)][0]+'」)':''),'ms_'+k]),...itSellL(r.slice(2))];  // 第四十二轮:怪物技能石
  if(r&&r.startsWith('i:')&&/^cz\d+$/.test(r.slice(2))&&MISC[r.slice(2)]){const id=r.slice(2),L=cuMenu(id);return L[0][1]=='czy'?L:[...L,...itSellL(id)]}  // 第五十五轮:诅咒之力
  if(r&&r.startsWith('i:')){const id=r.slice(2);return [...(MISC[id]&&MISC[id][4]?[[MISC[id][4],'iu']]:[]),...itSellL(id)]}  // 第五十二轮修:原来只有出售,售价 0 的道具(上帝卡牌、双倍爆率卡、饲料)点了没反应、用不了
  return null}
function itSellL(id){const pr=itemPr(id),n=itemCnt(id);return pr?[['💰 出售 1 个 +'+pr,'is1'],...(n>1?[['💰 全部出售 +'+pr*n,'isa']]:[])]:[]}
function cmName(r){if(r=='ttl')return '<b>🏆 佩戴称号</b>';const it=itOf(r);if(it)return `<b style="color:${TR[it.tier][1]}">${nm(it)}</b>`;const id=cosId(r);if(id)return `<b style="color:#f783ac">${COSD[id].ic} ${COSD[id].n}</b>`;if(r.startsWith('p:'))return '<b>'+POTD[r.slice(2)][0]+'</b>';const q=itemList().find(v=>'i:'+v[0]==r);return q?'<b>'+q[2]+'</b>':''}
function openCM(r,cx,cy){const L=cmItems(r);if(!L)return;if(!L.length){hideTip();closeCM();sel=r;renderBag();return}  // 没有可做的操作(不能出售的剧情道具):只选中,显示说明
 hideTip();CMR=r;CMF=0;CSC=0;sel=r;renderBag();drawCM(cx,cy)}
function drawCM(cx,cy){const m=$('cm');let h=`<div class="cmh">${cmName(CMR)}</div>`;
  if(CMF){const id=cosId(CMR);h+=`<div class="cmw">确定出售「${COSD[id].n}」吗?<br>获得 ${COSSELL} 金币,出售后要重新用击杀点购买。</div><button data-c="csell">✔ 确定出售</button><button data-c="x">取消</button>`}
  else h+=cmItems(CMR).map(([l,a])=>`<button data-c="${a=='csell'?'csell?':a}">${l}</button>`).join('');
  m.innerHTML=h;m.hidden=false;if(cx!=null){const w=m.offsetWidth,hh=m.offsetHeight;m.style.left=Math.max(4,Math.min(innerWidth-w-4,cx+2))+'px';m.style.top=Math.max(4,Math.min(innerHeight-hh-4,cy+2))+'px'}}
function closeCM(){CMR=null;CMF=0;$('cm').hidden=true}
$('cm').addEventListener('click',e=>{const b=e.target.closest('[data-c]');if(!b||!CMR)return;const a=b.dataset.c;if(a=='x'){closeCM();return}if(a=='csell?'){CMF=1;drawCM();return}const r=CMR,m=$('cm'),lx=parseFloat(m.style.left),ly=parseFloat(m.style.top);closeCM();bagAct(a,r);if(/^cz_/.test(a)&&R19.cuP&&r.startsWith('i:')){CMR=r;sel=r;drawCM(lx-2,ly-2)}});  // 第五十六轮:诅咒刷出新属性后接着弹出「换 / 保留」
$('cm').addEventListener('contextmenu',e=>e.preventDefault());
addEventListener('pointerdown',e=>{if(!$('cm').hidden&&!e.target.closest('#cm'))closeCM()},true);
$('bag').addEventListener('contextmenu',e=>{e.preventDefault();const t=e.target.closest('[data-r]');if(t)openCM(t.dataset.r,e.clientX,e.clientY)});
