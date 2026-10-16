// ===== 鼠标拖动:背包装备 → 左边部位(穿戴);已穿戴 → 右边格子(卸下);时装 / 翅膀同理 =====
let DRG=null,dragT=0;
const dragOK=r=>/^(b\d|e:)/.test(r)?!!itOf(r):/^[wc]:/.test(r)?!!cosId(r):false;
$('bag').addEventListener('pointerdown',e=>{if(e.pointerType!='mouse'||e.button!==0)return;const t=e.target.closest('[data-r]');if(!t||!dragOK(t.dataset.r))return;DRG={r:t.dataset.r,el:t,x0:e.clientX,y0:e.clientY,on:0}});
function dragTargets(r){const b=$('bag');if(/^b\d/.test(r))return [b.querySelector(`[data-r="e:${itOf(r).slot}"]`),b.querySelector('.pd')];if(r[0]=='c')return [b.querySelector(`[data-r="w:${COSD[cosId(r)].t}"]`),b.querySelector('.pd')];return [b.querySelector('.bright')]}
addEventListener('pointermove',e=>{if(!DRG)return;const g=$('dg');
  if(!DRG.on){if(Math.hypot(e.clientX-DRG.x0,e.clientY-DRG.y0)<6)return;DRG.on=1;hideTip();closeCM();const q=DRG.el.getBoundingClientRect();g.innerHTML=DRG.el.innerHTML;g.style.width=q.width+'px';g.style.height=q.height+'px';g.style.fontSize=q.height*.42+'px';g.style.borderColor=getComputedStyle(DRG.el).borderColor;g.hidden=false;DRG.el.classList.add('dsrc');document.body.classList.add('drg');for(const t of dragTargets(DRG.r))if(t)t.classList.add('dtg')}
  g.style.left=e.clientX-g.offsetWidth/2+'px';g.style.top=e.clientY-g.offsetHeight/2+'px'});
addEventListener('pointerup',e=>{if(!DRG)return;const d=DRG;DRG=null;if(!d.on)return;dragT=performance.now();$('dg').hidden=true;document.body.classList.remove('drg');$('bag').querySelectorAll('.dsrc,.dtg').forEach(q=>q.classList.remove('dsrc','dtg'));
  const el=document.elementFromPoint(e.clientX,e.clientY),t=el&&el.closest('[data-r]'),r2=t&&t.dataset.r,inPD=el&&el.closest('.pd'),inR=el&&el.closest('.bright');
  if(/^b\d/.test(d.r)){const it=itOf(d.r);if(r2=='e:'+it.slot||(inPD&&!(r2&&r2.startsWith('e:'))))bagAct('eq',d.r);else if(r2&&r2.startsWith('e:')){bmsg='这件装备要放到「'+SL[it.slot][0]+'」栏';renderBag()}}
  else if(d.r[0]=='e'){if(inR)bagAct('un',d.r)}
  else if(d.r[0]=='c'){const ty=COSD[cosId(d.r)].t;if(r2=='w:'+ty||(inPD&&!(r2&&r2.startsWith('w:')&&r2!='w:'+ty)))bagAct('cw',d.r)}
  else if(d.r[0]=='w'){if(inR)bagAct('cu',d.r)}});

// 悬停说明(电脑);手机上点一下在下方显示
var canHover=matchMedia('(hover:hover)').matches;
function showTip(h,ev){if(CMR)return;const t=$('tip');t.innerHTML=h;t.hidden=false;moveTip(ev)}
function moveTip(ev){const t=$('tip');if(t.hidden)return;const w=t.offsetWidth,h=t.offsetHeight;let lx=ev.clientX+14,ly=ev.clientY+14;if(lx+w>innerWidth-6)lx=ev.clientX-w-14;if(ly+h>innerHeight-6)ly=Math.max(6,innerHeight-h-6);t.style.left=Math.max(6,lx)+'px';t.style.top=ly+'px'}
function hideTip(){$('tip').hidden=true}
$('bag').addEventListener('mouseover',e=>{if(!canHover||DRG&&DRG.on)return;const t=e.target.closest('[data-r]'),r=t&&t.dataset.r,it=t&&itOf(r);
  if(r&&r.startsWith('p:')&&POTD[r.slice(2)]){showTip(potTip(r.slice(2)),e);return}
  if(r&&r.startsWith('i:')){const q=itemList().find(v=>'i:'+v[0]==r);if(q){showTip(`<b style="font-size:13.5px">${q[1]} ${q[2]}</b><br><span class="tg">道具 · ×${q[3]}</span><hr>${itemDesc(q[0])}`+(itemPr(q[0])?'<hr><span class="tg">左键:出售</span>':''),e);return}}
  if(r&&/^[wc]:/.test(r)){const id=r[0]=='w'?WEAR[r.slice(2)]:r.slice(2);if(id){showTip(cosTip(id)+`<hr><span class="tg">${WEAR[COSD[id].t]==id?'左键:卸下 / 出售 · 双击直接卸下':'左键:穿戴 / 出售 · 双击直接穿戴 · 可拖到左边穿戴'}</span>`,e);return}}
  if(it&&/^(b\d|e:)/.test(r))showTip(tipItem(it,r[0]),e);else hideTip()});
// 穿戴 / 卸下时装、翅膀(on=true 穿戴)
function wearC(id,on){const d=COSD[id];if(!d||!OWN.includes(id))return;WEAR[d.t]=on?id:null;if(d.t=='wing'&&!on)P.fly=0;const S=stats();P.hp=Math.min(P.hp,S.hp);P.mp=Math.min(P.mp,S.mp);save()}
$('bag').addEventListener('mousemove',moveTip);$('bag').addEventListener('mouseleave',hideTip);
// 装备筛选:t = 品质(-1 全部)、g = 系列(-1 全部)、tr = 特性('*' 全部,'' 无特性);BSA = 一键「全部出售」待确认的背包下标
let BF={t:-1,g:-1,tr:'*'},BSA=null;
const bfOk=it=>(BF.t<0||it.tier==BF.t)&&(BF.g<0||(it.g||0)==BF.g)&&(BF.tr=='*'||(BF.tr==''?!it.tr:it.tr==BF.tr));
const bfOn=()=>BF.t>=0||BF.g>=0||BF.tr!='*';
let bagTab=0,bagPg=0,BFO=0,lastClk={r:null,t:0};  // bagPg 背包当前页 · BFO 装备筛选展开
const dbl=r=>{const t=performance.now(),d=lastClk.r==r&&t-lastClk.t<380;lastClk=d?{r:null,t:0}:{r,t};return d};
function bagDbl(r){const it=itOf(r);if(!it)return;hideTip();
  if(r[0]=='b'){const i=+r.slice(1),old=EQ[it.slot];EQ[it.slot]=it;BAG.splice(i,1);if(old)BAG.push(old)}else if(BAG.length<BAGN){BAG.push(it);EQ[r.slice(2)]=null}
  sel=null;const S=stats();P.hp=Math.min(P.hp,S.hp);P.mp=Math.min(P.mp,S.mp);renderBag()}
$('bag').addEventListener('click',e=>{if(performance.now()-dragT<250||performance.now()-cmT<700)return;const t=e.target.closest('[data-r]');if(!t)return;const r=t.dataset.r;
  if(r[0]=='F'&&r.length>1&&'tgr'.includes(r[1])){const v=r.slice(2);if(r[1]=='t')BF.t=+v;else if(r[1]=='g')BF.g=+v;else BF.tr=v;sel=null;bagPg=0;bsq=null;BSA=null;bmsg='';renderBag();return}
  if(r=='auto'){bsq=autoPlan();BSA=BAG.map((q,i)=>i).filter(i=>bfOk(BAG[i]));bmsg='';sel=null;renderBag();$('bag').querySelector('.dt').scrollIntoView({block:'nearest',behavior:'smooth'});return}
  if(r=='autoy'){const ids=bsq||[];let g=0;for(const i of [...ids].sort((a,b)=>b-a)){g+=sellPr(BAG[i]);msOff(BAG[i]);BAG.splice(i,1)}gold+=g;bsq=null;sel=null;bmsg='已出售 '+ids.length+' 件,获得 '+g+' 金币。';save();renderBag();return}
  if(r=='ally'){const ids=BSA||[];let g=0;for(const i of [...ids].sort((a,b)=>b-a)){g+=sellPr(BAG[i]);msOff(BAG[i]);BAG.splice(i,1)}gold+=g;sfx('coin');bsq=null;BSA=null;sel=null;bmsg='已出售 '+ids.length+' 件装备,获得 '+g+' 金币。';save();renderBag();return}
  bsq=null;BSA=null;bmsg='';if(r=='auton'){renderBag();return}
  if(r=='x'){toggleBag();return}
  if(r=='-')return;
  if(/^pg\d+$/.test(r)){bagPg=+r.slice(2);sel=null;hideTip();renderBag();return}
  if(r=='flt'){BFO=BFO?0:1;renderBag();return}
  if(/^t[0-4]$/.test(r)){bagTab=+r[1];bagPg=0;sel=null;CSC=0;hideTip();renderBag();return}
  if(r=='csell'){CSC=1;renderBag();return}if(r=='csellN'){CSC=0;renderBag();return}
  if(['eq','sell','un','cw','cu','pu','q0','q1','q2','ps1','psa','is1','isa','csellY'].includes(r)){if(sel)bagAct(r=='csellY'?'csell':r,sel);return}
  CSC=0;
  if(r[0]=='w'||r[0]=='c'){const id=cosId(r);if(!id){sel=null;renderBag();return}hideTip();if(r[0]=='w')bagTab=COSD[id].t=='fash'?1:2;if(canHover&&dbl(r)){wearC(id,WEAR[COSD[id].t]!=id);sel=null;renderBag()}else lcm(r,e);return}
  if(r.startsWith('p:')||r.startsWith('i:')){hideTip();if(canHover&&dbl(r)&&r[0]=='p'&&POTD[r.slice(2)][2]!='rev'){bagAct('pu',r);return}lcm(r,e);return}
  if(canHover&&/^(b\d|e:)/.test(r)&&dbl(r)){bagDbl(r);return}if(itOf(r)){lcm(r,e);return}sel=null;
  renderBag()});
// 第二十轮:左键单击物品 = 选中 + 弹出菜单(使用 / 穿戴 / 出售 / 快捷栏);双击照旧直接穿戴 / 喝药(第一下弹出的菜单在第二下按下时自动关掉)
function lcm(r,e){sel=r;if(cmItems(r))openCM(r,e.clientX,e.clientY);else renderBag()}
function openP(n){if((st!='play'&&st!='town')||bagOpen||skOpen||DLG)return;pn=n;fs=null;spSel=null;fmsg='';GM.rc=0;keys.l=keys.r=0;ah=0;ar=0;$('pn').hidden=false;renderP()}
function closeP(){pn=null;fmsg='';$('pn').hidden=true;save()}
function toggleP(n){if(pn==n)closeP();else{if(pn)closeP();openP(n)}}
function renderP(){$('pn').innerHTML=pn=='sign'?rSign():pn=='set'?rSet():pn=='shop'?rShop():pn=='forge'?rForge():pn=='fuse'?rFuse():pn=='quest'?rQuest():pn=='mall'?rMall():pn=='book'?rBook():pn=='wh'?rWh():pn=='spr'?rSpr():pn=='pet'?rPet():pn=='pot'?rPot():rGM()}
// VIP 说明(商城底栏;第四十三轮起不再单独占一块)
const VIPB=['击败怪物获得的经验 +10%','通关击杀点 +25%','强化成功率 +10%'];
// 商城预览图:把角色 / 精灵 / 宠物画到小画布上
