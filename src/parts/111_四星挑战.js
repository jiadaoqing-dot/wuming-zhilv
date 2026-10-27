// ===== 第六十五轮(用户):四星挑战 = 魂类模式 =====
// 只在地图关卡开(C4LV:第一~十关 + 暗黑大陆主线关,不含神秘副本 / 十二魔 / 炼狱),三星通关后在星级页选第四张卡。
// 用户的要求:双方都不会出现数值碾压,伤害有上限(大师二阶的被动也一样),玩家和怪物用同一套数值,只看技巧。做法 = 伤害一律换算成「目标最大生命的百分比」:
//   怪打主角(hurt):raw ÷ (EATK × BDMK × LDM) = 招式系数(小怪普攻约 12、首领 14~34)× C4IN → 主角最大生命的百分比,一下最多 C4HC;不看防御,闪避率当 0
//   主角打怪(dealt):伤害 ÷ 主角攻击 = 招式倍率 r(最多 C4R;不是普攻的再 × C4SK[职业])× C4U → 目标最大生命的百分比,一下最多 C4C,首领每秒最多掉 C4PS;暴击固定 C4CR 几率 × C4CK,套装 / 二阶 / 宠物装备 / 称号的增伤都不算
//   大师二阶被动 m2Hit 按 C4C 的 2/3 封顶;生命药水每次进关最多 C4Q 瓶,不能用复活药水
// 没有经验 / 金币 / 击杀点 / 掉落;首领倒下给「挑战积分」R19.c4p:每关第一次 C4P1 + 关卡序号 × 3(R19.c4c 记首通),之后每次 C4P2。积分在村长那里换《无名之书》(581 分块)
STARK[4]={n:'四星',hp:1,atk:1,def:0,sp:1.12,xp:0,gd:0,dr:0,tq:[1,0,0,0],bq:[1,0,0,0],sq:[1,0,0,0],c:'#cc5de8'};
const C4LV=[1,2,3,4,5,6,7,8,9,10,14,15,16,18,19,20,21];
const C4IN=1/120,C4HC=.34,C4R=4,C4SK={sword:.3,staff:.2},C4PS=.04,C4U={m:.2,b:.01},C4C={m:.5,b:.03},C4CR=.1,C4CK=1.5,C4Q=3,C4P1=40,C4P2=8;
const isC4=()=>LVSTAR==4&&!INTOWN;
const c4OK=n=>C4LV.includes(n);
const c4Open=()=>C4LV.some(n=>starOf(n)>=3);  // 有一关三星通关,四星挑战和村长的积分商店就开了
const c4H=e=>e.max||e.h4||(e.h4=Math.max(1,e.hp));  // 小怪没有 e.max:第一次挨打时记下满血
function c4Hurt(b,S){const k=b/(EATK*BDMK()*Math.max(1,LDM));return Math.max(1,Math.round(S.hp*Math.min(C4HC,k*C4IN)))}
function c4Out(e,dm){const bo=!!e.max,h=c4H(e);let r=Math.min(C4R,dm/Math.max(1,stats().atk))*(NRMH?1:C4SK[P.mode]||.3),cr=0;  /* 校准(Playwright,首领冻结 7 秒 / 招):普攻一下 1%;一整套技能 剑 9%~14%、法 14%~21%(每秒上限之前) */if(Math.random()<C4CR){r*=C4CK;cr=1}
  if(P.mode=='sword'&&st=='play'&&!noCombo&&GT-(P.qiT||0)>.2){P.qiT=GT;P.qi=Math.min(QIMAX,(P.qi|0)+1)}  // 剑势照常累积
  let d=Math.min(h*r*(bo?C4U.b:C4U.m),h*(bo?C4C.b:C4C.m));if(e.dmK)d*=e.dmK(e);if(e.fsh>0){d*=.5;heatAdd(5)}
  if(bo){if(!(GT-(e.c4s??-9)<1)){e.c4s=GT;e.c4a=0}d=Math.min(d,Math.max(0,h*C4PS-e.c4a));e.c4a+=d}return [Math.max(1,Math.round(d)),cr]}
const c4M2=(q,d)=>isC4()?Math.round(c4H(q)*(q.max?C4C.b:C4C.m)*.66):d;
function c4Win(){const n=cur,L=R19.c4c=R19.c4c||[],first=!L.includes(n),g=first?C4P1+Math.max(0,C4LV.indexOf(n))*3:C4P2;if(first)L.push(n);R19.c4p=(R19.c4p|0)+g;
  tx('+'+g+' 挑战积分',P.x-14,P.y-76,'#e599f7');if(first)tx('四星首通!去找村长看看',P.x-40,P.y-90,'#e599f7');save()}
const c4Drops=n=>{const f=!(R19.c4c||[]).includes(n);return [{e:'📕',n:f?'首通 +'+(C4P1+Math.max(0,C4LV.indexOf(n))*3):'首通已领',c:'#e599f7'},{e:'🏅',n:'再通 +'+C4P2,c:'#e599f7'}]};  // 星级页「掉落物品」格子:四星只显示挑战积分
