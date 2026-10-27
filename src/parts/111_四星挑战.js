// ===== 第六十五轮(用户):四星挑战 = 魂类模式 =====
// C4LV:第一~十关 + 暗黑大陆主线关;第六十六轮(用户)加上神秘副本 1~5 和十二魔 1~12,三星通关后在星级页选第四张卡。
// 暗黑炼狱也能开四星(选层页的「四星」开关,572 分块),但没有积分、不进剧情,只记最高层 R19.tw4(用户:玩家的自我挑战)
// 用户的要求:双方都不会出现数值碾压,伤害有上限(大师二阶的被动也一样),玩家和怪物用同一套数值,只看技巧。做法 = 伤害一律换算成「目标最大生命的百分比」:
//   怪打主角(hurt):raw ÷ (EATK × BDMK × LDM × 首领自身倍率 c4n) = 招式系数(小怪普攻约 12、首领 14~34)× C4IN → 主角最大生命的百分比,一下最多 C4HC;不看防御,闪避率当 0
//   主角打怪(dealt):伤害 ÷ 主角攻击 = 招式倍率 r(最多 C4R;不是普攻的再 × C4SK[职业])× C4U → 目标最大生命的百分比,一下最多 C4C,首领每秒最多掉 C4PS;暴击固定 C4CR 几率 × C4CK,套装 / 二阶 / 宠物装备 / 称号的增伤都不算
//   大师二阶被动 m2Hit 按 C4C 的 2/3 封顶;生命药水每次进关最多 C4Q 瓶,不能用复活药水
// 没有经验 / 金币 / 击杀点 / 掉落;首领倒下给「挑战积分」R19.c4p:每关第一次 C4P1 + 关卡序号 × 3(R19.c4c 记首通),之后每次 C4P2。积分在村长那里换《无名之书》(581 分块)
STARK[4]={n:'四星',hp:1,atk:1,def:0,sp:1.12,xp:0,gd:0,dr:0,tq:[1,0,0,0],bq:[1,0,0,0],sq:[1,0,0,0],c:'#cc5de8'};
const C4LV=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,35,22,23,24,25,26,27,28,29,30,31,32,33];  // 第六十六轮:11~13 / 17 / 35 = 神秘副本 1~5,22~33 = 十二魔
const C4IN=1/120,C4HC=.34,C4R=4,C4SK={sword:.3,staff:.2},C4PS=.04,C4U={m:.2,b:.01},C4C={m:.5,b:.03},C4CR=.1,C4CK=1.5,C4Q=3,C4P1=40,C4P2=8;
const isC4=()=>LVSTAR==4&&!INTOWN;
// 第六十六轮:首领自身倍率 c4n —— 第八关以后的首领(bLate)、十二魔 / 擎天魔神 / 千钟之主等固定攻击的首领,攻击不等于 LDM,
//   按「首领攻击 ÷ LDM」归一,招式系数才和第一~七关一样落在 14~34;镜中无名 / 灿灿用主角的攻击 matk,按 C4MW(普攻一下约 7%)归一
const C4MW=8,c4N=e=>e.matk?Math.max(.01,e.matk/(EATK*BDMK()*Math.max(1,LDM)*C4MW)):e.dm>1?Math.max(.2,e.dm/Math.max(1,LDM)):1;
function c4Init(){if(!isC4())return;for(const e of [B,...E.filter(q=>q.twb)])if(e)e.c4n=c4N(e)}  // 140 init 最后调用(之后首领换阶段改 dm 的,倍率按进关时算)
const c4OK=n=>C4LV.includes(n);
const c4Open=()=>C4LV.some(n=>starOf(n)>=3);  // 有一关三星通关,四星挑战和村长的积分商店就开了
const c4H=e=>e.max||e.h4||(e.h4=Math.max(1,e.hp));  // 小怪没有 e.max:第一次挨打时记下满血
function c4Hurt(b,S){const n=bossOn&&B&&B.hp>0?(B.c4n??(B.c4n=c4N(B))):1,k=b/(EATK*BDMK()*Math.max(1,LDM)*n);return Math.max(1,Math.round(S.hp*Math.min(C4HC,k*C4IN)))}
function c4Out(e,dm){const bo=!!e.max,h=c4H(e);let r=Math.min(C4R,dm/Math.max(1,stats().atk))*(NRMH?1:C4SK[P.mode]||.3),cr=0;  /* 校准(Playwright,首领冻结 7 秒 / 招):普攻一下 1%;一整套技能 剑 9%~14%、法 14%~21%(每秒上限之前) */if(Math.random()<C4CR){r*=C4CK;cr=1}
  if(P.mode=='sword'&&st=='play'&&!noCombo&&GT-(P.qiT||0)>.2){P.qiT=GT;P.qi=Math.min(QIMAX,(P.qi|0)+1)}  // 剑势照常累积
  let d=Math.min(h*r*(bo?C4U.b:C4U.m),h*(bo?C4C.b:C4C.m));if(e.dmK)d*=e.dmK(e);if(e.fsh>0){d*=.5;heatAdd(5)}
  if(bo){if(!(GT-(e.c4s??-9)<1)){e.c4s=GT;e.c4a=0}d=Math.min(d,Math.max(0,h*C4PS-e.c4a));e.c4a+=d}return [Math.max(1,Math.round(d)),cr]}
const c4M2=(q,d)=>isC4()?Math.round(c4H(q)*(q.max?C4C.b:C4C.m)*.66):d;
function c4Win(){if(isTw(cur))return;const n=cur,L=R19.c4c=R19.c4c||[],first=!L.includes(n),g=first?C4P1+Math.max(0,C4LV.indexOf(n))*3:C4P2;if(first)L.push(n);R19.c4p=(R19.c4p|0)+g;
  tx('+'+g+' 挑战积分',P.x-14,P.y-76,'#e599f7');if(first)tx('四星首通!去找村长看看',P.x-40,P.y-90,'#e599f7');save()}
const c4Drops=n=>{const f=!(R19.c4c||[]).includes(n);return [{e:'📕',n:f?'首通 +'+(C4P1+Math.max(0,C4LV.indexOf(n))*3):'首通已领',c:'#e599f7'},{e:'🏅',n:'再通 +'+C4P2,c:'#e599f7'}]};  // 星级页「掉落物品」格子:四星只显示挑战积分
// 第六十七轮(用户):「挑战模式」总开关 C4M —— 暗黑大陆地图右下角的「挑战模式」(插画上画好的那块)、第一张地图左上、十二魔页 / 炼狱选层页左上的按钮(或按 4)都切它;
//   开着时点关卡直接进四星(不用在一~四星之间选),十二魔也按四星打(原来 dmsGo 固定三星,四星进不去);这一关没三星通关(十二魔 = 没打败过)就提示,不进
let C4M=0;  // 第六十八轮(用户):记住上次的开关状态 = 存进 R19.c4m(210 读档时取回)
const C4MB=[10,6,150,24];
function c4Tog(){if(!c4Open()){say('任意一关三星通关后,才能开启挑战模式');return}C4M=C4M?0:1;R19.c4m=C4M;save();sfx('coin');say(C4M?'⚔ 挑战模式已开启:点击关卡直接进入四星挑战':'挑战模式已关闭,点击关卡照常选星级')}
function c4Btn(R,hv,t,ow,k4){const [X,Y,W,H]=R;if(PUI.on())PUI.ns(x,'pC',6,6,6,6,X,Y,W,H);else RR(x,X,Y,W,H,6,'#16201a',1.4);
  if(C4M){x.fillStyle='rgba(204,93,232,'+(.28+.1*Math.sin(t*4))+')';x.fillRect(X+3,Y+3,W-6,H-6)}
  CT('挑战模式'+(k4?'(4)':'')+':'+(C4M?'开':'关'),X+W/2,Y+17,11,hv?'#fff':C4M?'#f3d9fa':'#ffd43b','center',2.4,ow||'#08200e')}
// 地图 / 选关页上点关卡时先过这里:挑战模式开着就直接四星,返回 true = 已经处理
function c4Map(n,go){if(!C4M||!c4OK(n))return false;if(!starOpen(n,4))say('挑战模式:这一关要先三星通关'+(isDm(n)?'(十二魔 = 先打败一次)':'')+',才能四星挑战');else go();return true}
