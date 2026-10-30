// ===== 防重复领取 =====
// ① 防多开:同一个浏览器只让最新打开的页面运行,旧页面立刻存一次档后暂停(否则两个页面各自签到 / 领奖再互相覆盖存档,就能重复领取)
const TABID=Math.random().toString(36).slice(2);let DUP=0;
try{localStorage.setItem('wuming-tab',TABID)}catch(e){}
function dupChk(){if(DUP)return;let v=null;try{v=localStorage.getItem('wuming-tab')}catch(e){}if(v&&v!=TABID){save();DUP=1;hideTip();for(const k of ['bag','sk','pn','cm'])$(k).hidden=true}}
addEventListener('storage',e=>{if(e.key=='wuming-tab')dupChk()});
// ② 防调时间:记下见过的最晚时间 TMX,系统时间被调回 10 分钟以上时,签到 / 每日任务 / 每日限购暂停,直到时间追上
let TMX=0;const timeBad=()=>Date.now()<TMX-600000,TBMSG='⚠️ 检测到系统时间被调回过,签到、每日任务和每日限购暂时不可用,等时间恢复正常后再来';
// 第三十九轮:金币 / 经验 / 技能点 / 击杀点变成 NaN、null 或负数时归零(第十关主线任务曾经把金币和经验加成 NaN:NaN 和任何价格比较都是 false,于是买东西不扣钱、经验也不再升级)
function fixNum(){if(!Number.isFinite(gold)||gold<0)gold=0;if(!Number.isFinite(exp)||exp<0)exp=0;if(!Number.isFinite(sp)||sp<0)sp=0;if(!Number.isFinite(KP)||KP<0)KP=0;if(!Number.isFinite(KPS))KPS=0}
function save(){if(DUP)return;fixNum();TMX=Math.max(TMX,Date.now());try{localStorage.setItem(SK_KEY,JSON.stringify({lvl,exp,gold,sp,EQ,BAG,LN,STN2:STN,CLR,STAR,QD,MAT,LUCK,PS,KP,KPS,KPC,SIGN,OWN,WEAR,SPR,PET,HAM,POT,QS,RVD,TMX,JOB,R19,pm:P?P.mode:LMODE,sw01:1,v16:1,sv:SAVEV,gv:GAMEV}))}catch(e){}}
function loadSave(){try{const d=JSON.parse(localStorage.getItem(SK_KEY));if(d&&d.lvl){for(let v=(d.sv|0)+1;v<=SAVEV;v++)if(SAVEMIG[v])SAVEMIG[v](d);lvl=d.lvl;exp=d.exp;gold=d.gold;sp=d.sp;EQ=d.EQ;BAG=d.BAG;LN=d.LN;STN=stnLoad(d);CLR=d.CLR||[];STAR=d.STAR||{};for(const n of CLR)if(!(STAR[n]>=1))STAR[n]=1;
    // 第十六轮旧存档:等级压到 50、技能等级压到 5(多出来的技能点按新花费退还)、旧被动换算成新被动(9 级 → 5 级),经验按新曲线清零
    if(!d.v16){lvl=Math.min(LVMAX,lvl);exp=0;let rf=0;for(const w of ['sword','staff'])for(let i=0;i<8;i++){const v=LN[w][i]|0;if(v>LNMAX){for(let L=LNMAX+1;L<=v;L++)rf+=skCost(w+i,L).sp;LN[w][i]=LNMAX}}
      const o=d.PS||{},n={},cv=v=>Math.min(5,Math.ceil((v|0)*5/9));for(const k of ['hp','mp','atk','def','spd'])if(o[k])n[k]=cv(o[k]);if(o.dj)n.dj=1;const r=Math.max(o.hpr|0,o.mpr|0);if(r)n.rec=cv(r);d.PS=n;sp=(sp|0)+rf}QD=d.QD||qNew();if(QD.mi==null){QD.mi=0;QD.ms=0;QD.mp=0}QD.on=1;MAT=d.MAT||{egg:0};LUCK=d.LUCK||0;PS=d.PS||{};for(const it of [EQ.staff,...BAG])if(it&&it.slot=='staff'&&!it.v2){it.s.atk=Math.round(it.s.atk*6.5/4);it.pr=Math.round(it.pr*1.3);it.v2=1}
    R19=Object.assign(r19New(),d.R19);C4M=R19.c4m?1:0;R19.mr=Object.assign(r19New().mr,R19.mr);for(const w of ['sword','staff'])if(LN[w]&&!(LN[w][0]>0))LN[w][0]=1;  // 第三十三轮:剑士 / 法师的 H 技能一开始就会
    for(const it of [...Object.values(EQ),...BAG,...R19.wh])if(it){if(it.n)it.n=it.n.replace('头盔','发型');migIt(it)}  // 第三十三轮:旧装备按装备 2.0 重建(仓库里的也一样)
    KP=d.KP||0;OWN=(d.OWN||[]).filter(k=>COSD[k]);WEAR=Object.assign({fash:null,wing:null},d.WEAR);for(const s in WEAR)if(WEAR[s]&&!OWN.includes(WEAR[s]))WEAR[s]=null;
    SPR=Object.assign(sprNew(),d.SPR);SPR.pt=Object.assign(sprNew().pt,SPR.pt);if(sprFree()<0)for(const k in SPR.pt)SPR.pt[k]=0;  // 每级点数改少了:超出的加点自动重置
    PET=Object.assign(petNew(),d.PET);HAM=Object.assign(hamNew(),d.HAM);HAM.b=Object.assign(hamNew().b,HAM.b);
    // 旧存档没有消费记录:按已拥有的时装 / 翅膀价格补算
    KPS=d.KPS!=null?d.KPS:OWN.reduce((t,k)=>t+COSD[k].kp,0);KPC=d.KPC||0;POT=d.POT||potNew();for(const k in POT)if(!POTD[k]||!(POT[k]>0))delete POT[k];QS=(Array.isArray(d.QS)?d.QS:[]).concat([null,null,null]).slice(0,3).map((k,i)=>POTD[k]?k:['hp1','mp1','rev'][i]);RVD=d.RVD||'';  // 旧存档:送 8 瓶初级生命 + 8 瓶初级魔力
    SIGN=Object.assign({day:'',n:0,str:0,last:0,prev:''},d.SIGN);TMX=d.TMX||0;JOB=d.JOB||null;LMODE=WMODES.includes(d.pm)?d.pm:'sword';if(P)P.mode=LMODE;for(const w of WMODES){LN[w]=LN[w]||(w=='fist'?[1]:[]);while(LN[w].length<8)LN[w].push(0)}if(EQ&&!EQ.fist)EQ.fist=gen('fist',0,'新手拳套');if(!d.sw01){const a=LN.staff;[a[0],a[1]]=[a[1],a[0]]}while(lvl<LVMAX&&exp>=expNeed(lvl)){exp-=expNeed(lvl);lvl++;sp+=SPLV}if(lvl>=LVMAX)exp=0;fixNum();atsFix();return true}}catch(e){}return false}  // 第二十二轮:经验曲线变短,旧存档攒着的经验读档时直接升级(return true 前的 while)
function clearSave(){try{localStorage.removeItem(SK_KEY)}catch(e){}}
try{hasSave=!!localStorage.getItem(SK_KEY)}catch(e){}
