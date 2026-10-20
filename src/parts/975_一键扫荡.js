// ===== 第五十九轮:地图关卡一键扫荡(用户:三星通关以后开启)=====
// 选关页(从世界地图进来的关卡)右上角「⚡ 一键扫荡」:按三星难度把这一关结算一遍 —— 真的进关(enterLv),把所有区域的小怪逐个 reward,
//   再按首领倒下结算 bossWin(击杀点、首领掉落、讨伐任务都一样),地上的东西全部捡起,然后回城、回到选关页,弹出这次的收获
// 神秘副本 / 十二魔封印 / 暗黑炼狱不能扫荡;背包空位不足 SWBAG 格时不扫(装备会捡不起来)
const SWBAG=4;
const sweepOK=n=>LVS.m==0&&!isTw(n)&&!isDm(n)&&!isMy(n)&&starOf(n)>=3;
const SWPB=[476,6,104,24];  // 按钮位置(选关页标题栏右边)
function sweepGo(){const n=LVS.i+1;if(!sweepOK(n)){say('三星通关以后才能一键扫荡');return}
  if(BAGN-BAG.length<SWBAG){say('背包空位不足 '+SWBAG+' 格,先整理一下再扫荡');return}
  const g0=gold,k0=KP,b0=BAG.length,l0=lvl,LV={...LVS};let nm=0;
  enterLv(n,3);
  try{const L=E.filter(e=>!e.sum);for(const q of WQ)for(const k of q)L.push(mk(k,P.x,WLM));WQ=WQ.map(()=>[]);E=[];
    for(const e of L){reward(e);nm++}
    bossOn=true;B.hp=0;bossWin();pickUp(1)}
  catch(err){console.warn('sweep',err)}
  toTown();st='lvsel';LVS=LV;sfx('lvl');
  const it=BAG.length-b0;say('⚡ 扫荡完成:击败 '+nm+' 只怪物 + 首领 · 金币 +'+(gold-g0)+' · 击杀点 +'+(KP-k0)+(it>0?' · 装备 '+it+' 件':'')+(lvl>l0?' · 升到 Lv'+lvl:''));msgU=performance.now()+5000}
function sweepDraw(n,hv){if(!sweepOK(n))return;const [X,Y,W,H]=SWPB,on=hv=='sw',t=performance.now()/1000;
  if(PUI.on())PUI.ns(x,'pC',6,6,6,6,X,Y,W,H);else RR(x,X,Y,W,H,6,'#2a1f3c',1.4);
  if(on){x.save();x.strokeStyle='rgba(255,212,59,'+(.7+.3*Math.sin(t*6))+')';x.lineWidth=2;x.strokeRect(X+1,Y+1,W-2,H-2);x.restore()}
  CT('⚡ 一键扫荡',X+W/2,Y+17,11,on?'#fff':'#ffe066','center',2.4,'#3a1d0a')}
const sweepHit=(mx,my)=>{const [X,Y,W,H]=SWPB;return sweepOK(LVS.i+1)&&mx>=X&&mx<=X+W&&my>=Y&&my<=Y+H}
