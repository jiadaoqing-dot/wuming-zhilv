// ===== 第三十三轮:装备 2.0 =====
// 白字:每个部位固定几种属性(EQW,× 品质 / 系列系数),数值固定;只能用锻造石提升(it.fg 0~5,每级白字 +FGK)
// 绿字:3 条(it.gr = [[属性, 数值]…]),种类和数值在范围内随机(EQG × 系数);只能用洗脸券一次全部刷新
// 强化:每级按部位加固定数值(EQE:武器攻击 / 头饰魔力 / 战甲生命 / 项链防御 / 戒指暴击;时装防御 / 翅膀暴击),强化石品质决定加多少,Lv2 强化石(+4~+6)×EQE2;累计在 it.ev
// 增幅宝石:it.amp = cr / atk / hp / def,按百分比加在基础数值上(AMP);时装 / 翅膀的数据在 R19.cen[id](cosIt)
// 系数:hp / mp / atk = 品质 × 系列 m,def = 品质 × 系列 d,cr / dg = 原来的暴击闪避词条基准 b × CRPT / DGPT
const EQW={head:{hp:6,mp:6,atk:1,def:1.5},body:{hp:10,def:4},ear:{dg:.75,def:1.5},ring:{hp:6,atk:2},sword:{atk:5},staff:{atk:6.5}};  // 法杖攻击 = 剑 ×1.3(法师玻璃大炮)
const EQG={hp:[2,4],mp:[2,4],atk:[.4,.8],def:[.4,.8],cr:[.25,.5],dg:[.2,.4]};
// 第三十四轮:用户说强化固定值偏低,全部约 ×1.6(EQE16;老存档 it.ev / 时装 c.ev 在 migIt / cosIt 里按 v9 一次性 ×1.6)
const EQE={sword:['atk',[6,8,10,13]],staff:['atk',[6,8,10,13]],head:['mp',[20,24,30,40]],body:['hp',[40,48,60,80]],ear:['def',[6,8,10,13]],ring:['cr',[16,20,24,32]],fash:['def',[6,8,10,13]],wing:['cr',[16,20,24,32]]},EQE2=2.5,EQE16=1.6;
const FGK=.1,FGMX=5,WPN5=5,MSK=1.2;  // 锻造每级白字 +10%,最高 5 级;所有武器白字攻击 +5;大师装备白字 ×1.2
const AMP={cr:['暴击宝石',.15,'暴击率'],atk:['攻击宝石',.03,'攻击力'],hp:['HP宝石',.06,'生命值'],def:['防御宝石',.04,'防御力']};
// 时装 / 翅膀白字(百分比,加在基础数值上)
// 第三十四轮:时装 防御 / 攻击各 10%,翅膀 暴击 / 生命各 10%;时装 / 翅膀也能锻造(c.fg,每级白字百分比 ×(1+FGK),5 级 = 15%)
const COSW={fash:{def:.1,atk:.1},wing:{cr:.1,hp:.1}};
const cosV=(t,k,fg)=>COSW[t][k]*(1+FGK*(fg||0));
const SLR=[['发型','头饰'],['铠甲','战甲'],['耳坠','项链']],slRen=n=>SLR.reduce((s,[a,b])=>s.split(a).join(b),n);
function eqK(tier,g,ms){if(ms)g=Math.max(g||0,SER.length-1);const t=TR[tier][2],S=SER[g||0],b=[.5,.75,1,1.25][tier]*[1,1.3,1.6,1.9,2.2][g||0];return {hp:t*S.m,mp:t*S.m,atk:t*S.m,def:t*S.d,cr:b*CRPT,dg:b*DGPT}}
// 第四十二轮:火之武器 it.fw(1 火之大剑 / 火之法杖:机械系列 ×1.1,神秘副本 4 首领掉落 · 2 真~火之:再 ×1.2,击杀点制作书 + 熔炉制作);白字 / 绿字都乘 FWK
const FWK=[1,1.1,1.32],FWN={sword:['','火之大剑','真~火之大剑'],staff:['','火之法杖','真~火之法杖']};
const wG=it=>it?(it.fw?4+it.fw:it.g||0):0;  // 图标 / 手持武器用第几套外观(5 火之 / 6 真~火之)
function eqWhite(slot,tier,g,ms,fw){const K=eqK(tier,g,ms),s={};for(const [k,c] of Object.entries(EQW[slot]))s[k]=Math.max(1,Math.round(c*K[k]*(ms?MSK:1)*FWK[fw|0]))+(k=='atk'&&(slot=='sword'||slot=='staff')?WPN5:0);return s}
// 第五十八轮(用户):3 条绿字各自随机,可以重复(比如 3 条都是攻击);掉落 / 制作 / 洗练都一样
function greenRoll(it){const K=eqK(it.tier,it.g,it.ms),G=Object.keys(EQG),ks=[0,1,2].map(()=>pick(G));it.gr=ks.map(k=>{const [a,b]=EQG[k];return [k,Math.max(1,Math.round(K[k]*(a+Math.random()*(b-a))*(it.ms?MSK:1)*FWK[it.fw|0]*(it.m2?M2W:1)))]})}  // 第五十七轮:大师二阶绿字 ×3
const gRng=(it,k)=>{const K=eqK(it.tier,it.g,it.ms),[a,b]=EQG[k],m=(it.ms?MSK:1)*FWK[it.fw|0]*(it.m2?M2W:1);return [Math.max(1,Math.round(K[k]*a*m)),Math.max(1,Math.round(K[k]*b*m))]};
function fireW(slot,fw){return gen(slot,3,FWN[slot][fw],4,null,0,0,fw)}  // 史诗品质,机械系列为底
// 第四十三轮(用户回复):真~火之武器 = 用一把火之武器 + 材料升级(先找背包,再找身上的);返回 {it, b:背包序号(身上 = -1)}
function fwSrc(slot){const b=BAG.findIndex(q=>q.slot==slot&&q.fw==1);if(b>=0)return {it:BAG[b],b};const e=EQ[slot];return e&&e.fw==1?{it:e,b:-1}:null}
const enV=(slot,k,q)=>Math.round(EQE[slot][1][q]*(stnLv(k)>=2?EQE2:1));  // 强化到第 k 级、用品质 q 的强化石:这一级加多少
const wv=(it,k)=>Math.round(it.s[k]*(1+FGK*(it.fg||0)*(it.m2?M2FG:1)));  // 白字(含锻造;大师二阶锻造效果 ×6)
const eqPr=it=>Math.round((it.s.atk||0)*6+(it.s.def||0)*6+(it.s.hp||0)*.8+(it.s.mp||0)*.8+(it.s.cr||0)*.5+(it.s.dg||0)*.8)+2;
// 一件装备给的固定属性:白字(含锻造)+ 绿字 + 强化 + 属性石
function eqAdd(g,it){if(!it)return g;for(const k in it.s)g[k]+=wv(it,k);for(const [k,v] of it.gr||[])g[k]+=v;if(it.ev)g[EQE[it.slot][0]]+=evV(it);if(it.gem)for(const [k,v] of it.gem.a)g[k]+=v;if(it.cu)g[it.cu.k]+=cuV(it.cu);return g}
function gen(slot,tier,name,g,tr,fix,ms,fw){g=g||0;const s=eqWhite(slot,tier,g,ms,fw);
  const it={slot,tier,s,pr:0,fg:0,ev:0,v2:1,v3:1,v4:1,v5:1,v6:1,v7:1,v8:1,v9:1,n:name||(g?TR[tier][0]+'·'+(tr?TRT[tr][0]:SER[g].n)+SL[slot][0]:TR[tier][0]+SL[slot][0])};if(g)it.g=g;if(tr)it.tr=tr;if(ms)it.ms=2;if(fw)it.fw=fw;it.pr=eqPr(it);if(!fix)greenRoll(it);return it}  // fix=1:不带绿字(商店展示用,买到时再随机)
// 旧装备全部按新规则重建(白字固定、随机 3 条绿字,强化按普通品质换成固定值),名字里的部位改名(发型 → 头饰、铠甲 → 战甲、耳坠 → 项链)
function migIt(it){if(it&&it.v8&&!it.v9){it.ev=Math.round((it.ev||0)*EQE16);it.v9=1}if(it&&it.ms&&it.v8&&it.ms!=2){const o=it.s,K0=eqK(it.tier,it.g),K1=eqK(it.tier,it.g,1);it.s=eqWhite(it.slot,it.tier,it.g,1);it.gr=(it.gr||[]).map(([k,v])=>[k,Math.max(1,Math.round(v*K1[k]/K0[k]))]);it.ms=2;it.pr=eqPr(it)}/* 第四十一轮:大师装备按最高系列重算(ms=2 = 已重算)*/if(!it||it.v8)return;const en=Math.min(ENMX,it.en||0);it.s=eqWhite(it.slot,it.tier,it.g);it.fg=0;greenRoll(it);it.ev=0;for(let l=1;l<=en;l++)it.ev+=enV(it.slot,l,0);it.en=en;delete it.eb;it.pr=eqPr(it);if(it.n)it.n=slRen(it.n);it.v8=1;it.v9=1}
const curSer=()=>cur>=14?4:cur<=2?0:cur<=4?1:cur<=7?2:3;  // 第四十轮:第十一关掉机械系列  // 第六、七关也掉荒漠系列;第八关起掉雪原系列
// 掉落:按当前关卡掉对应系列;第五关的发型/铠甲/戒指/耳坠随机带 5 种特性之一,武器没有特性
function rollItem(t,g){const ks=Object.keys(SL),sl=ks[Math.random()*6|0];g=g!=null?g:curSer();
  return gen(sl,t!=null?t:rollQ(STK().tq),null,g,g>=2&&LVSTAR>=3&&BODY.includes(sl)?TRK[Math.random()*5|0]:null)}  // 第四十四轮:特性件只在三星掉  // 第十六轮:品质概率按星级(STARK.tq)
function setTr(){const c={};for(const k of TRS){const it=EQ[k];if(it&&it.tr)c[it.tr]=(c[it.tr]||0)+1}return c}
function trv(k,c){const n=(c||setTr())[k]||0,q=TRT[k];return (n>=4?q[3]+q[4]:n>=2?q[3]:0)*trMul(k)}
const trN=(k,c)=>(c||setTr())[k]||0,tr2=(k,c)=>trN(k,c)>=2?TRT[k][3]*trMul(k):0,tr4=(k,c)=>trN(k,c)>=4?TRT[k][4]*trMul(k):0,tr6=(k,c)=>trN(k,c)>=6;
// 邪灵 4 件:技能伤害加成(按当前最大魔力,stats 里缓存 P.mpMax)
function lingSkB(c){c=c||setTr();if(trN('ling',c)<4)return 0;return Math.min(LINGMX,(P&&P.mpMax||0)/LINGK/100)*trMul('ling')}
// 第四十一轮:大师制作装备的特性效果翻倍(用户:「设定为其他特性的 1 倍」= 多 100%);混穿时按这个特性里大师件数的比例:全是大师 ×2,一半 ×1.5
function trMul(k){let n=0,m=0;for(const s of BODY){const it=EQ[s];if(it&&it.tr==k){n++;m+=it.m2?M2TR:it.ms?2:1}}return n?m/n:1}  // 第五十七轮:大师二阶权重 4.5
function trCnt(k){return setTr()[k]||0}
let LDM=1,PS={},WZ=[],QD=qNew(),MAT={egg:0},LUCK=0,useLk=0,DLG=null,STN=stnNew(),CLR=[],cur=1,lvT=0,bsq=null,bmsg='',pn=null,fs=null,fmsg='',GM={god:0,ko:0,mp:0,luck:0,rc:0},GMSQ={s:'',t:0};
const BAGN=50;
