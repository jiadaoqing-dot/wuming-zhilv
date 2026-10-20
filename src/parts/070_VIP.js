// ===== VIP:商城累计消费 2500(VIPN,第三十七轮从 5000 降下来) 击杀点自动开通(永久)=====
const VIPN=2500;  // 第三十七轮:击杀点商店降价约一半,VIP 条件跟着减半
let KPS=0,KPC=0,SIGN={day:'',n:0,str:0,last:0,prev:''};
const isVip=()=>KPS>=VIPN;
// 通关奖励击杀点:VIP +25%(小数部分累积到下次,不会丢)
function kpGain(b){if(!isVip())return b;const v=b*1.25+KPC,n=Math.floor(v);KPC=+(v-n).toFixed(3);return n}
// 商店分阶段开放:旅者一开始就有,林王通关第二关(来到迷雾森林)后开放,荒漠通关第四关(来到噬沙荒漠)后开放
const SEROPEN=[()=>true,()=>CLR.includes(2),()=>CLR.includes(4)],SERHINT=['','通关第二关后开放','通关第四关后开放'];
let shopSer=0,shopTr='lei';
const shopIt=(i,j,rnd_)=>{const k=ALL[i];return gen(k,j,null,shopSer,shopSer==2&&BODY.includes(k)?shopTr:null,rnd_?0:1)};
const STR=it=>Object.keys(it.s).map(k=>NM[k]+'+'+wv(it,k)).join(' ')+' + 随机 3 条绿字';  // 商店展示:白字固定,绿字买到时随机
const lv=b=>b*(1+.12*(lvl-1));  // 第十六轮:每级 +12%(50 级 ×6.9),让等级本身更有分量
// 被动技能(2026-10-13 第十六轮重做,全部 5 级):[键, 名称, 说明, 满级, 每级主数值]。多效果的被动在 PSX 里写全文
// 体魄 生命 +6%/级 · 锐利 攻击 +5%/级 · 坚韧 防御 +6%/级 · 会心 暴击率 +2%、暴击伤害 +8%/级 · 羁绊(第四十八轮,原疾风)宠物冷却缩短上限 +1%/级 · 回春 每秒回生命 / 魔力各 0.1%/级(第四十九轮从 0.4% / 0.3% 降下来) · 法力 魔力 +6%、耗魔 -4%/级
const LNMAX=9;  // 第六十轮:主动技能最高 9 级(被动仍是各自的满级)
const PSD=[['dj','二段跳','在空中可以再跳一次',1,0],['hp','体魄','最大生命',5,.06],['atk','锐利','攻击力',5,.05],['def','坚韧','防御力',5,.06],['crt','会心','暴击率 / 暴击伤害',5,.02],['spd','羁绊','宠物技能冷却',5,0],['rec','回春','每秒回复生命 / 魔力',5,.001],['mp','法力','最大魔力 / 技能耗魔',5,.06]];
const PSV=Object.fromEntries(PSD.map(q=>[q[0],q[4]])),pl=k=>PS[k]|0,pb=k=>1+pl(k)*PSV[k];
const RECH=.001,RECM=.001;  // 回春每级:每秒回最大生命 / 最大魔力的比例
const PSX=(k,l)=>k=='dj'?'在空中可以再跳一次':k=='crt'?`暴击率 +${l*2}% · 暴击伤害 +${l*8}%(${(1.8+l*.08).toFixed(2)} 倍)`:k=='spd'?`钢盔小鸡技能冷却 -${l}% · 仓鼠「灵巧」冷却缩短上限 +${l}%(${20+l}%)`:k=='rec'?`每秒回复最大生命 ${(l*RECH*100).toFixed(1)}% · 最大魔力 ${(l*RECM*100).toFixed(1)}%`:k=='mp'?`最大魔力 +${l*6}% · 技能耗魔 -${l*4}%`:`${PSD.find(q=>q[0]==k)[2]} +${Math.round(l*PSV[k]*100)}%`;
const critK=()=>1.8+pl('crt')*.08+(godOn('cr')?.2:0);  // 第四十轮:上帝卡牌「暴击升级」+0.2  // 暴击倍率:基础 1.8 倍,会心每级 +0.08
// 装备固定属性合计(白字含锻造 + 绿字 + 强化 + 属性石);穿着的时装 / 翅膀再加它们的强化值(时装防御 / 翅膀暴击)
function eqSum(ks){const g={hp:0,mp:0,atk:0,def:0,cr:0,dg:0};for(const k of ks)eqAdd(g,EQ[k]);for(const t of ['fash','wing']){const c=WEAR[t]&&cosIt(WEAR[t]);if(c&&c.ev)g[EQE[t][0]]+=c.ev;if(c&&c.cu)g[c.cu.k]+=cuV(c.cu)}return g}  // 第五十六轮:时装 / 翅膀的诅咒
// 时装 / 翅膀的强化、增幅宝石数据(像装备一样有 en / ev / amp,存在 R19.cen)
function cosIt(id){const d=COSD[id];if(!d)return null;const c=R19.cen[id]||(R19.cen[id]={en:0,ev:0,v9:1});if(!c.v9){c.ev=Math.round((c.ev||0)*EQE16);c.v9=1}Object.assign(c,{cos:id,slot:d.t,tier:3,s:{},n:d.n});return c}
// 第三十三轮:百分比加成全部只加在「基础数值」上(角色基础 + 装备固定属性,不含被动 / 精灵 / 宠物等),各来源的百分比相加,避免数值膨胀
// 来源:强化荣誉、增幅宝石(穿着的 5 件装备 + 时装 + 翅膀)、时装 / 翅膀白字
function pctB(ks){const p={hp:0,atk:0,def:0,cr:0},L=[],H=hon();for(const k in p)if(H[k])p[k]+=H[k],L.push(['强化荣誉',k,H[k]]);
  const its=ks.map(k=>EQ[k]).concat(['fash','wing'].map(t=>WEAR[t]&&cosIt(WEAR[t])));for(const it of its)if(it&&it.amp&&AMP[it.amp]){p[it.amp]+=AMP[it.amp][1];L.push([AMP[it.amp][0],it.amp,AMP[it.amp][1]])}
  for(const t of ['fash','wing'])if(WEAR[t])for(const k in COSW[t]){const v=cosV(t,k,cosIt(WEAR[t]).fg);p[k]+=v;L.push([COSD[WEAR[t]].n,k,v])}
  p.L=L;return p}
const EQKS=()=>['head','body','ring','ear',P.mode];
function stats(){const ks=EQKS(),g=eqSum(ks),Q=pctB(ks),c=setTr();
  const fl={hp:lv(BHP)+BHPL*(lvl-1)+g.hp,mp:lv(BMP)+g.mp,atk:lv(10)+g.atk,def:lv(3)+BDEF+g.def};  // 基础数值
  const hp=Math.round(fl.hp*(1+Q.hp)*pb('hp')+sprV('hp')),am=1+atkTr(c,hp),cp=crdgP(g,c,Q),mp=Math.round(fl.mp*(1+tr2('ling',c))*pb('mp')+sprV('mp'));if(P)P.mpMax=mp;
  return {hp,mp,atk:Math.round((fl.atk*(1+Q.atk)*pb('atk')*am+sprV('atk')+(tr6('xue',c)?hp*XUE6:0))*(P.pAtk>0?1+petAtk():1)*(P.wy>0?1.3:1)),def:Math.round((fl.def*(1+Q.def+tr2('yu',c))*pb('def')+sprV('def'))*(P.pDef>0?1+petDef():1)),
    cr:+(cp.cr.reduce((s,q)=>s+q[1],0)).toFixed(1),dg:Math.min(DGMAX,+(cp.dg.reduce((s,q)=>s+q[1],0)).toFixed(1))}}
const BHP=220,BMP=60,BDEF=20,BHPL=20;  // 第三十三轮:基础生命 140 → 220、基础防御 +20、每升一级生命再 +20(第二十二轮:60 → 140)
const DGMAX=35;  // 暴击率不设上限;闪避率上限 35%(第十六轮:45 → 35,闪避太高会让首领招式没有威胁)
// 暴击率 / 闪避率来源明细(背包里显示)。百分比暴击(强化荣誉 / 暴击宝石 / 翅膀白字)只乘「基础暴击数值」= 装备暴击点数换算出的暴击率
function crdgP(g,c,Q){Q=Q||pctB(EQKS());const r=v=>+v.toFixed(1),cb=g.cr/CRPT,cr=[['装备',r(cb)]],dg=[['装备',r(g.dg/DGPT)]],nl=trv('lei',c),nj=c.ji||0;
  if(Q.cr&&cb)cr.push(['百分比加成 +'+Math.round(Q.cr*100)+'%',r(cb*Q.cr)]);if(pl('crt'))cr.push(['会心',pl('crt')*2]);if(nl)cr.push(['怒雷套',r(nl*100)]);if(sprV('cr'))cr.push(['精灵',sprV('cr')]);if(godOn('cr'))cr.push(['上帝卡牌',25]);
  if(nj>=2)dg.push(['神技套',r((nj>=4?JIDG[0]+JIDG[1]:JIDG[0])*trMul('ji'))]);if(sprV('dg'))dg.push(['精灵',sprV('dg')]);return {cr,dg}}
function atkTr(c,hp){let a=0;const nj=c.ji||0;if(nj>=2)a+=Math.min(P.combo||0,nj>=4?15:12)*(nj>=4?.02:.01)*trMul('ji');
  const nx=c.xue||0;if(nx>=2&&hp>0)a+=(nx>=4?.6:.25)*trMul('xue')*Math.max(0,Math.min(1,1-P.hp/hp));
  if(nj>=6)a+=Math.min(JI6N,P.jk||0)*JI6;  // 第四十二轮:神技 6 件击杀层数
  return a+m2Atk(hp)}  // 第五十七轮:大师二阶 神技 / 热血 四件
// 2026-10-13 第十三轮:关卡里只飘数字(伤害 / 回复),文字提示(技能名、状态、MISS、魔力不足……)都不显示;k:'d' 伤害 · 'c' 暴击
function tx(s,px,py,c,k){if(st=='play'&&!k&&!/^[+-]?\d+$/.test(String(s)))return;if(TX.length>=80)TX.shift();TX.push({s,x:px,y:py,t:.9,c,k})}  // 第五十一轮:飘字同时最多 80 个
function addItem(it){if(BAG.length<BAGN){BAG.push(it);tx('获得 '+it.n,P.x-20,P.y-20,it.tr?TRT[it.tr][1]:TR[it.tier][1]);return 1}tx('背包已满',P.x-14,P.y-20,'#ff8787','m');return 0}  // 第三十三轮:背包满了不自动出售、也不进仓库
// 第十五轮:关卡掉落率减半(小怪装备 / 蛇蛋、首领的装备和强化石);主线任务物品、转职凭证、女神碎片、仓鼠宠物蛋不受影响
const DROPK=.5;
