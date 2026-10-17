// ===== 时装 / 翅膀(击杀点商店)· 精灵 / 宠物(金币商店)=====
const COSD={
 fh:{t:'fash',n:'风华剑仙',ic:'☁️',kp:3000,d:'仙人白衣、墨发高髻、玉簪轻绾,衣袂与发丝随风飘动,周身萦绕仙气。',tr:'【御风】每次释放技能:移动速度 +35%(3 秒),并在身前召唤一道龙卷风,持续 3 秒、缓缓向前推进,每 0.3 秒对卷入的敌人造成 35% 攻击力伤害(可暴击,不会打僵敌人)。最多同时存在 3 道,再召唤会替换最早的一道。'},
 xy:{t:'fash',n:'学院法师',ic:'🎓',kp:3000,d:'魔法学院的黑色长袍、尖顶巫师帽,配一条红金条纹围巾。',tr:'【学识】所有技能冷却 -10%。累计释放 8 次技能后召唤「锁敌雷电」,持续 5 秒:自动锁定附近的敌人,每 0.5 秒落下一道雷电,伤害等于普通攻击(可暴击,不会造成僵直)。10 秒内没有放技能,计数清零。'},
 fhw:{t:'wing',n:'风华剑仙翅膀',ic:'🎀',kp:3000,d:'一缕仙气丝带(披帛)绕身而过。飞行时背后展开一对白色羽翼(像素美术下所有翅膀飞行都是这对羽翼;原版几何画法是丝带随风舒展)。',tr:'翅膀可以飞行:在空中再按一次跳跃起飞(学会二段跳的话是第三下),飞行中 W / S 控制高度(按住跳跃也能上升)、A / D 控制方向,不按就悬停,按 S 落到地面或平台上结束;飞行每秒消耗 8 + 2.5% 最大魔力。'},
 xyw:{t:'wing',n:'学院法师翅膀',ic:'🧹',kp:3000,d:'一把施了魔法的扫帚,平时化作一颗四角星在身后跟随。飞行时背后展开一对白色羽翼(像素美术下所有翅膀飞行都是这对羽翼;原版几何画法是骑着扫帚飞行)。',tr:'翅膀可以飞行:在空中再按一次跳跃起飞(学会二段跳的话是第三下),飞行中 W / S 控制高度(按住跳跃也能上升)、A / D 控制方向,不按就悬停,按 S 落到地面或平台上结束;飞行每秒消耗 8 + 2.5% 最大魔力。'}};
const SPRP_=59990,PETP_=69000;  // 第四十五轮:时装 / 翅膀 990 → 3000 击杀点
// 精灵属性:[键, 名称, 每点数值, 单位];每级 1 点(50 级共 50 点),每项最多 50 点
const SPK=[['hp','生命',40,''],['mp','魔力',40,''],['atk','攻击',10,''],['def','防御',3,''],['cr','暴击率',.24,'%'],['dg','闪避率',.06,'%']],SPKV=Object.fromEntries(SPK.map(q=>[q[0],q[2]]));
const sprNew=()=>({own:0,on:1,lv:1,exp:0,pt:{hp:0,mp:0,atk:0,def:0,cr:0,dg:0}}),petNew=()=>({own:0,on:1,lv:1,exp:0,sk:[]});
let KP=0,OWN=[],WEAR={fash:null,wing:null},SPR=sprNew(),PET=petNew(),mallTab=0,spSel=null,TOR=[],LCK=null,XYN=0,XYT=0,PF=[],SPRP={x:0,y:0},PETS={x:0,y:GY-20,vy:0,f:1,an:0,g:0,wv:0,cd:{}};
const sprV=k=>SPR.own&&SPR.on?+(SPR.pt[k]*SPKV[k]).toFixed(1):0;
const sprNeed=l=>80+l*30,sprFree=()=>SPR.lv-Object.values(SPR.pt).reduce((a,b)=>a+b,0);
const petNeed=l=>400*l+120*l*l,petOn=()=>PET.own&&PET.on;
const petAtk=()=>(10+PET.lv*.5)/100,petDef=()=>(10+PET.lv*.5)/100,fanM=()=>.6+PET.lv*.02;
// 宠物技能:[名称, 说明函数, 冷却]
// 2026-10-13 第十三轮:宠物技能冷却统一 15 秒(仓鼠的同样 15 秒,另受「灵巧」缩短)
const PSK={atk:['鼓舞·攻',()=>`挥扇为无名加油:攻击力 +${Math.round(petAtk()*100)}%,持续 8 秒`,15],def:['鼓舞·守',()=>`挥扇为无名加油:防御力 +${Math.round(petDef()*100)}%,持续 8 秒`,15],
  fan:['回旋扇',()=>`掷出扇子飞向敌人再旋回,去程、回程各造成一次 ${Math.round(fanM()*100)}% 攻击力伤害`,15],slow:['迟缓之风',()=>'给场上随机一只怪物施加减速,5 秒内移动和出招速度减半',15]};
const PSKK=Object.keys(PSK);
const petCd=k=>+(PSK[k][2]*(1-.01*pl('spd'))).toFixed(1);  // 第四十八轮(用户):被动「羁绊」每级小鸡技能冷却 -1%
function sprGain(n){if(!SPR.own)return;SPR.exp+=n;let up=0;while(SPR.lv<50&&SPR.exp>=sprNeed(SPR.lv)){SPR.exp-=sprNeed(SPR.lv);SPR.lv++;up++}if(SPR.lv>=50)SPR.exp=0;return up}
function petLv(){let up=0;while(PET.lv<20&&PET.exp>=petNeed(PET.lv)){PET.exp-=petNeed(PET.lv);PET.lv++;up++;
    if(PET.lv%5==0){const left=PSKK.filter(k=>!PET.sk.includes(k));if(left.length){const k=pick(left);PET.sk.push(k);if(P)tx('小鸡领悟了「'+PSK[k][0]+'」!',P.x-30,P.y-90,'#ffd43b')}}}
  if(PET.lv>=20)PET.exp=0;if(up&&P)tx('宠物升级! Lv'+PET.lv,P.x-10,P.y-76,'#ffe066');return up}
let PAUSED=0;
const busy=()=>bagOpen||skOpen||!!pn||PAUSED;
const ALL=Object.keys(SL);
// 强化加成:第三十三轮起改成固定数值(EQE / enV,累计在 it.ev),旧的百分比 it.eb 在 migIt 里删掉
const EM=it=>1+.08*(it&&it.en||0)+.06*(it&&it.fg||0);  // 第三十三轮:只用于售价 / 精灵吸收经验(强化加的属性改成固定值 it.ev)
const nm=it=>it.n+(it.en?' +'+it.en:'');
const sellPr=it=>Math.round(it.pr*EM(it)),buyPr=it=>it.pr*4;
// 强化石价格 / 基础成功率(+11、+12 只有 VIP 能强化)
const STP=[0,20,35,60,100,160,250,380,550,800,1200,1800,2600];
const enFee=(it,k)=>Math.ceil(STP[k]*(1+it.tier*.5)/10)*10;  // 强化手续费:每次尝试都收,成功失败都扣
const SR=[0,.95,.9,.85,.75,.65,.55,.45,.35,.25,.15,.12,.08];
const ENMX=9,ENMAX=()=>ENMX;  // 第四十七轮(用户):放开到 +9(Lv3 强化石 +7~+9,强化荣誉 +7~+9 按第三十二轮的表)· 第十九轮:强化最高 +6(VIP 也一样);Lv3 / Lv4 强化石删除(第三十二轮试过 +10,用户第三十三轮决定先保持 +6,+7~+10 留给以后)
const srOf=(k,lk)=>GM.luck?1:Math.min(1,SR[k]+(isVip()?.1:0)+(lk||0));  // lk = 幸运宝石加成(.25 / .35 / .5)  // VIP 强化成功率 +10%
