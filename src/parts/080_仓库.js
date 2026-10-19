// ===== 第十九轮(2026-10-13):属性石 · 小礼袋与 NPC 好感 · 合成添加剂 · 幸运宝石 · 双倍爆率卡 · 宠物饲料 · 商城道具与随机物品栏 =====
// 属性石:低级 1 条、中级 2 条随机词条(同一颗不重复);中级每条数值 ×1.2(清单没给中级数值,先这样)。在熔炉镶嵌,每件装备 1 颗,新的替换旧的,不能拆,出售装备不返还
const ATSD={atk:['攻击',10,15],mp:['魔力',200,220],def:['防御',20,30],cr:['暴击',80,90],dg:['闪避',50,60]},ATSQ=[{n:'低级属性石',c:'#4dabf7',m:1,pr:50},{n:'中级属性石',c:'#9775fa',m:1.2,pr:120}];
// 第五十八轮(用户):每条属性单独随机,可以重复(比如高级属性石 3 条都是攻击)
function atsNew(q){const K0=Object.keys(ATSD),ks=Array.from({length:q+1},()=>pick(K0));return {q,a:ks.map(k=>{const d=ATSD[k];return [k,Math.round((d[1]+Math.random()*(d[2]-d[1]))*ATSQ[q].m)]})}}
const atsTxt=g=>g.a.map(([k,v])=>ATSD[k][0]+' +'+v).join(' · ');
// 关卡掉落(首领倒下时每样判定一次;双倍爆率卡 ×2):低级属性石 30% · 中级 12% · 小礼袋 50%(小怪 2%) · Lv1 强化石 10% · 第七~十关再判定 Lv2 强化石 7%
const DRX={a0:.3,a1:.12,gift:.5,giftM:.02};
// 第四十五轮:首领掉强化石 / 合成添加剂(三星的期望数量 [Lv1, Lv2, 添加剂];一星 / 二星按掉落率 1 : 1.3 : 1.6 打折)—— 第一~六关 1.2 / 0 / 0.1 · 第七~十关和神秘副本 1 / 2 1.5 / 1.5 / 0.5 · 第二张地图、副本 3 / 4 1.7 / 2.4 / 1.3
const STDR=c=>c<=6?[1.2,0,.1,0]:c<=12?[1.5,1.5,.5,c>=8&&c<=10?.25:0]:[1.7,2.4,1.3,.5];  // 第四十七轮:第 4 项 = Lv3 强化石(第八~十关、第二张地图)
const rollN=v=>Math.floor(v)+(Math.random()<v%1?1:0);
function bossDrop19(K){const dk=DBLK(),r=v=>Math.random()<v*dk;if(r(DRX.a0))gdDrop(B,{k:'ats',it:atsNew(0),n:1});if(r(DRX.a1))gdDrop(B,{k:'ats',it:atsNew(1),n:1});if(r(DRX.gift))gdDrop(B,{k:'gift',n:1});
  {const d=STDR(cur),m=K.dr/1.6*dk,a=rollN(d[0]*m),b=rollN(d[1]*m),c=rollN(d[2]*m),e3=rollN(d[3]*m);if(e3)gdDrop(B,{k:'stn',lv:3,q:0,n:e3});if(a)gdDrop(B,{k:'stn',lv:1,q:0,n:a});if(b)gdDrop(B,{k:'stn',lv:2,q:0,n:b});if(c)gdDrop(B,{k:'add',n:c})}}  // 关卡只掉普通品质(高品质只能熔炉合成)
// 存档字段 R19:aff 好感 {NPC 名:{v 好感, d 今天领过的日期}} · ats 背包里的属性石 · dbl 双倍爆率卡到期时间 · mr 商城随机物品栏 {day, n 今天买了几次, L 三个货}
let R19=r19New(),skMsg='',GSEL={e:null,s:-1,ok:0};
function r19New(){return {aff:{},ats:[],dbl:0,mr:{day:'',n:0,L:[]},wh:[],cen:{},rc:[],god:{cr:0,pal:0,pk:0},mse:'',peq:{own:[],on:[]},mem:{c:-1,L:[],ok:-1}}}  // 第四十八轮:peq 宠物装备 · mem 记忆晶片  // 第四十轮:god 上帝卡牌  // 第三十三轮:cen 时装 / 翅膀的强化与增幅宝石 · rc 已学会的制作书
// ===== 第三十二轮:仓库(主城仓库管理员桂婶)=====
// 装备可以在背包和仓库之间存取(仓库 WHN 格,存在 R19.wh);关卡里背包满了只提示「背包已满」(第三十三轮)
// 第四十一轮:仓库分三页 装备 / 道具 / 药水(WHT);道具存在 R19.whi {id:数量}(id 和 itemList 一样:MISC 道具 / egg / luck / s+级+品质 强化石),药水存在 R19.whp {药水:数量};道具和药水不限数量
const WHN=100;let WHT=0;
const WHX=['soul','job','hegg'];  // 不能存的道具(任务道具 / 宠物蛋)
function itemSet(id,v){v=Math.max(0,v|0);if(MISC[id]||id=='egg')MAT[id]=v;else if(id=='luck')LUCK=v;else if(id[0]=='s')STN[+id[1]][+id[2]]=v}
const whItN=id=>id=='luck'?'高级幸运宝石':id=='egg'?'蛇蛋':MISC[id]?MISC[id][0]:id[0]=='s'?stnName(+id[1],+id[2]):id,whItE=id=>id=='luck'?mniEm('luck'):id=='egg'?'🥚':MISC[id]?mniEm(id):id[0]=='s'?stnEm(+id[1],+id[2]):'';
// 第四十三轮:改成表格(同商城):装备页左边背包、右边仓库;道具 / 药水页两列表格,每行 背包数 / 仓库数 + 存取按钮
function rWh(){const W=R19.wh,I=R19.whi||(R19.whi={}),Q=R19.whp||(R19.whp={});
  const er=(it,a)=>({ic:eqImg(it,'eqs'),n:nm(it),nc:TR[it.tier][1],d:ST(it),p:`<span style="color:${TR[it.tier][1]}">${TR[it.tier][0]}</span>`,a});
  const tb=(i,t)=>`<button data-p="Wt_${i}" ${WHT==i?'class="on" disabled':''}>${t}</button>`,row2=(ic,n,a,b,k,dp,tk)=>{const to=b&&(tk!='WQ'||potTot()<POTMAX);
    return {ic,n,p:`背包 <b>${a}</b><br>仓库 <b>${b}</b>`,a:`<button data-p="${dp}|${k}|1" ${a?'':'disabled'}>存1</button><button data-p="${dp}|${k}|0" ${a?'':'disabled'}>全存</button><button data-p="${tk}|${k}|1" ${to?'':'disabled'}>取1</button><button data-p="${tk}|${k}|0" ${to?'':'disabled'}>全取</button>`}};
  let h=hd('📦 仓库')+giftBox('仓库管理员')+`<div class="tag">装备 ${WHN} 格,道具和药水不限数量(任务道具和宠物蛋不能存)。关卡里背包满了,新装备会留在地上(提示「背包已满」)。</div>`+fm();
  h+=`<div class="mtk">${tb(0,'⚔️ 装备')}${tb(1,'📦 道具')}${tb(2,'🧪 药水')}</div>`;
  if(WHT==1){const ids=[...new Set([...itemList().map(r=>r[0]).filter(id=>id[0]!='T'&&!WHX.includes(id)),...Object.keys(I).filter(k=>I[k]>0)])];
    return h+mtTable('wi',ids.map(id=>{const r=row2(whItE(id),whItN(id),itemCnt(id),I[id]|0,id,'WI','WO');r.d=MISC[id]?MISC[id][1].split(/[。;]/)[0]:'';return r}),['说明','数量','存 / 取'],{nil:'背包和仓库里都没有可以存的道具'})}
  if(WHT==2){const ks=POTK.filter(k=>(POT[k]|0)||(Q[k]|0));
    return h+`<div class="tag">药水背包 ${potTot()} / ${POTMAX}</div>`+mtTable('wp',ks.map(k=>{const r=row2(potEm(k),POTD[k][0],POT[k]|0,Q[k]|0,k,'WP','WQ');r.d=k=='rev'?'倒下时原地复活':'恢复 '+potAmt(k);return r}),['说明','数量','存 / 取'],{nil:'背包和仓库里都没有药水'})}
  h+=`<div class="mt2"><div><div class="msp"><b>背包 ${BAG.length} / ${BAGN}</b><button data-p="Wa" ${BAG.length&&W.length<WHN?'':'disabled'}>全部存入</button></div>`+mtTable('wb',BAG.map((it,i)=>er(it,`<button data-p="Wd${i}" ${W.length<WHN?'':'disabled'}>存入 →</button>`)),['属性','品质','操作'],{one:1,per:8,nil:'背包是空的'})+
    `</div><div><div class="msp"><b>仓库 ${W.length} / ${WHN}</b></div>`+mtTable('ww',W.map((it,i)=>er(it,`<button data-p="Wt${i}" ${BAG.length<BAGN?'':'disabled'}>← 取出</button>`)),['属性','品质','操作'],{one:1,per:8,nil:'仓库是空的'})+`</div></div>`;
  return h}
function whAct(r){if(!/^W[adtIOPQ]/.test(r))return 0;const W=R19.wh,I=R19.whi||(R19.whi={}),Q=R19.whp||(R19.whp={});
  if(r.startsWith('Wt_')){WHT=+r.slice(3);return 1}
  if(/^W[IOPQ]\|/.test(r)){const [a,k,o]=r.split('|'),one=o=='1';
    if(a=='WI'){if(WHX.includes(k)||k[0]=='T')return 1;const n=one?Math.min(1,itemCnt(k)):itemCnt(k);if(n>0){itemSet(k,itemCnt(k)-n);I[k]=(I[k]|0)+n;fmsg='存入 '+whItN(k)+' ×'+n}}
    else if(a=='WO'){const n=one?Math.min(1,I[k]|0):I[k]|0;if(n>0){I[k]-=n;if(!I[k])delete I[k];itemSet(k,itemCnt(k)+n);fmsg='取出 '+whItN(k)+' ×'+n}}
    else if(a=='WP'){if(!POTD[k])return 1;const n=one?Math.min(1,POT[k]|0):POT[k]|0;if(n>0){POT[k]-=n;if(!POT[k])delete POT[k];Q[k]=(Q[k]|0)+n;fmsg='存入 '+POTD[k][0]+' ×'+n}}
    else{if(!POTD[k])return 1;const n=Math.min(one?1:Q[k]|0,Q[k]|0,POTMAX-potTot());if(n>0){Q[k]-=n;if(!Q[k])delete Q[k];POT[k]=(POT[k]|0)+n;fmsg='取出 '+POTD[k][0]+' ×'+n}else fmsg='药水背包满了'}
    save();return 1}
  const i=+r.slice(2);
  if(r=='Wa'){const n=Math.min(BAG.length,WHN-W.length);W.push(...BAG.splice(0,n));fmsg=n?'存入了 '+n+' 件装备':'仓库满了'}
  else if(r[1]=='d'){if(BAG[i]&&W.length<WHN){const it=BAG.splice(i,1)[0];W.push(it);fmsg='已存入 '+nm(it)}}
  else if(W[i]&&BAG.length<BAGN){const it=W.splice(i,1)[0];BAG.push(it);fmsg='已取出 '+nm(it)}
  return 1}
const dblOn=()=>R19.dbl>Date.now(),DBLK=()=>(dblOn()?2:1)*(1+DICEB);  // 第五十七轮(用户):幸运骰子和双倍爆率卡叠加(相乘)  // 第四十八轮:幸运骰子(原来和双倍爆率卡不叠加)
// 新道具放在 MAT 里:[名称, 说明, (占位), 出售价, 使用按钮文字]
const MISC={add:['合成添加剂','熔炉合成强化石时,每次合成要放 1 瓶(3 颗同级同品质 + 1 瓶 → 1 颗高一档品质)。神秘副本 3 首领 35%、第十一关首领 30% 掉落,也会在 🏪 商城的随机物品栏出现。','',0],
  gc1:['上帝卡牌 · 暴击升级','使用后 2 小时内:暴击率 +25%、暴击伤害 +20%。神秘副本 2(梦魇幽驹)首领 25% 掉落(两张卡随机一张)。只在关卡里计时,再用一张会叠加时长。','',0,'🃏 使用'],
  gc2:['上帝卡牌 · 来个好伙计','使用后 2 小时内:第一张地图十个首领里随机一个(50 级)变成你的打手,在关卡里跟着你一起打怪(攻击力 = 你的 80%)。神秘副本 2(梦魇幽驹)首领 25% 掉落。只在关卡里计时,生效中再用一张只叠加时长、不换首领。','',0,'🃏 使用'],
  gift:['小礼袋','在晨曦镇和 NPC 对话打开面板后赠送,每个好感度 +1(上限 999)。好感度满 50 后,每天可以找这位 NPC 领取一次奖励。关卡里掉落,也可以在商城购买。','',5],
  food:['宠物饲料','喂给出战的钢盔小鸡:获得当前等级升级所需经验的 20%(满级后不能用)。','',0,'🍞 喂给小鸡'],
  lk1:['低级幸运宝石','强化时在强化师那里选用,本次强化成功率 +25%。','',0],lk2:['中级幸运宝石','强化时在强化师那里选用,本次强化成功率 +35%。','',0],
  dbl:['双倍爆率卡','使用后 30 分钟内,关卡里所有掉落物的掉落几率翻倍(装备、属性石、小礼袋、强化石、蛇蛋、上帝卡牌、合成添加剂、怪物技能石、宠物蛋、360 小鸟碎片……;必掉的东西不变)。村长的好感奖励。','',0,'✨ 使用']};
function itemUse(id){if(!(MAT[id]>0))return '';if(id=='astr')return astrOpen();if(/^ms\d+$/.test(id)&&MSS[id.slice(2)])return msEquip(id);
  if(id=='dbl'){R19.dbl=Math.max(Date.now(),R19.dbl)+30*60000;MAT.dbl--;sfx('lvl');save();return '✨ 双倍爆率生效,还剩 '+Math.ceil((R19.dbl-Date.now())/60000)+' 分钟'}
  if(id=='food'){if(!PET.own)return '还没有宠物(钢盔小鸡)';if(PET.lv>=20)return '小鸡已经满级了';MAT.food--;PET.exp+=Math.ceil(petNeed(PET.lv)*.2);petLv();sfx('buff');save();return '🍞 小鸡吃得很开心:Lv '+PET.lv+' · 经验 '+PET.exp+' / '+petNeed(PET.lv)}
  if(id=='gc1'||id=='gc2'){const G=godOf(),k=id=='gc1'?'cr':'pal',on=godOn(k);G[k]=Math.max(0,G[k]||0)+GODT;if(k=='pal'&&(!on||!G.pk))G.pk=1+Math.floor(Math.random()*10);MAT[id]--;sfx('buff');save();
    return k=='cr'?'🃏 暴击升级生效:暴击率 +25%、暴击伤害 +20%,还剩 '+godLeft('cr'):'🃏 来个好伙计:'+PALN[G.pk-1]+'(Lv50)成了你的打手!还剩 '+godLeft('pal')+',进关卡后跟着你战斗'}
  return ''}
