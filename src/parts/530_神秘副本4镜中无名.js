// ===== 第四十三轮:神秘副本 4「镜中无名」(cur = MY4 = 17;第二张地图的关卡从 cur 18 起)=====
// 用户:首领是镜像的玩家自己,拥有玩家 500% 的属性;没有其他首领那些僵直和技能冷却,就是一模一样的玩家;周身一层淡淡的雾,身形时隐时现;最顶级的 AI
// 属性(进场时按主角当前 stats() 算,MIRS[星级] 倍率,见下):生命 / 攻击;减伤 = 主角的防御减伤 × x(上限 DEFMX 75%);暴击率 × x(上限 100%,暴击伤害同主角);闪避率 × x(上限 MIRK.dgMax)
// 不吃僵直 / 韧性 / 控制(update 敌人循环开头每帧清掉 st / sl / ms / air / kbv;dealt 不给后仰、不扣韧性;bigStun 无效);没有技能冷却和魔力限制(只有 0.1~0.3 秒的反应间隔)
// 武器 = 进场时主角拿的武器。外形 = 主角同一套纸娃娃(drawPBody,和影分身一样临时换状态画),离屏染成暗紫黑、透明度忽高忽低;雾 = VFX 图集的 smoke-puff
// AI:主角蓄力 / 放技能 / 飞弹飞来 → 瞬移闪开(threat,e.tpT 无敌);主角僵直、收招 → 立刻上来补刀;剑贴身打,法杖拉开距离
// 剑:四段连斩 cmb · 冲刺直戳 dash · 跃斩 leap(落地两道冲击波)· 瞬身斩 blink(消失 → 主角背后出现 → 重斩)· 落雷 zap(主角附近连落 4 道雷,有预警)
// 法杖:连发魔弹 bolt · 爆炎球 fire · 光柱 pil(主角附近 3 道,有预警)· 瞬身 blink(闪到远处接魔弹)· 跃斩 leap
// 掉落:火之大剑 / 火之法杖(MIRFW 几率,双倍爆率卡翻倍)、合成添加剂;每日任务「镜中的自己」
// 第四十四轮(用户:三星改成生命 ×5、攻击 ×2,一星 / 二星反推):按普通首领的星级比例(生命 1 : 1.8 : 3.2,攻击 1 : 1.4 : 1.9)从三星往回推再取整 ——
// 一星 生命 ×1.5 攻击 ×1 · 二星 ×3 / ×1.5 · 三星 ×5 / ×2;减伤 / 暴击率 / 闪避率 ×1 / ×1.5 / ×2(原来 ×5)。这是总倍率,不再乘 STK 的 hp / atk
const MY4=17,MIRS=[null,{hp:1.5,atk:1,x:1},{hp:3,atk:1.5,x:1.5},{hp:5,atk:2,x:2}],MIRK={dgMax:.4},MIRFW=.4;
const isMy=c=>c>=11&&c<=13||c==MY4||c==MY5,isM2=c=>c>=14&&c!=MY4&&c!=MY5;  // 第五十九轮:神秘副本 5 = cur 35
  // 神秘副本 / 第二张地图的关卡
let MIRZ=[];  // 落雷 / 光柱的落点:{x, t(<0 预警), k, dm}
const MIRT={k:'mir',f:1,wm:'sword',vy:0,gr:1};  // 选关页缩略图用的镜像
function mirClr(){MIRZ=[];MW=null;MWH=[]}
function mirNew(LM){const S=stats(),K=MIRS[LVSTAR]||MIRS[1],hp=Math.round(S.hp*K.hp);
  return {k:'mir',x:2940,y:GY-32,w:24,h:32,hp,max:hp,fl:0,f:-1,cd:1,act:null,dm:1,lm:LM,vy:0,gr:1,wm:P.mode,
    matk:S.atk*K.atk,mdr:Math.min(DEFMX,defR(S.def)*K.x),mcr:Math.min(1,S.cr/100*K.x),mdg:Math.min(MIRK.dgMax,S.dg/100*K.x)}}
// 招式伤害:主角攻击 ×5 × 招式倍率(暴击按主角的暴击伤害);hurt 里会再乘 EATK × BDMK,这里先除掉
function mirD(e,m){let d=e.matk*m;if(Math.random()<e.mcr)d*=critK();return d/(EATK*BDMK())}
function mirSwing(e,c,W,D,R){e.swT=0;e.swC=c;e.swW=W;e.swD=D;e.swR=R;e.swFrom=e.rc?{...e.rc}:null}
const mirBox=(e,w,h,y)=>{const cx=e.x+e.w/2;return {x:e.f>0?cx-4:cx-w+4,y:e.y+e.h/2+y-4,w,h}};
// 瞬移:smoke 两头冒烟;away = 拉开距离(闪避 / 法杖),否则闪到主角背后
function mirTp(e,away){const pc=P.x+12,ox=e.x+e.w/2;let nx;
  if(away){const d=pc-ARL>ARR-pc?-1:1;nx=pc+d*rnd(190,250);if(nx<ARL+20||nx>ARR-20)nx=pc-d*rnd(190,250)}else nx=pc-(P.f||1)*46;
  nx=Math.max(ARL+12,Math.min(ARR-12,nx));smoke(ox,e.y+16);e.x=nx-e.w/2;e.y=Math.min(e.y,GY-e.h);smoke(nx,e.y+16);e.f=sgn(pc-nx)||e.f;syn('blink')}
// ===== 第四十五轮(用户:镜像没有复制无名的技能,一直放主角没有的红色追踪弹)=====
// 改成用主角自己的技能:主武器(转职的职业;没转职 = 进场时拿的武器)的 8 个技能(没转职只有 4 个)+ 另一把武器的 H U I O;只用主角学过的,等级同主角;
// 冷却 = 主角此刻的冷却(skCdA);魔力无限。普攻也和主角一样:剑 = 四段连斩 / 冲刺直戳,法杖 = 白色球形闪电。
// 做法:镜像有一套自己的「主角状态」MW(假的 P、CD、飞弹 PB、雷云 CL / CL2、圣光领域 MGD、火鸟 MGT、光柱 MGP、火团 MGL、炎暴 STM、剑气 SQI、陨石 MET、风眼 WE、分身 CLN、闪电 Z)。
// mwRun(fn) 把这些全局变量临时换成镜像的,真主角包装成一个假目标 MW.px(E = [],B = 假目标,F = [],WEAR 无时装),直接调用主角的 useSk / skStep / pbStep / 各技能推进函数;
// 打到假目标的伤害在 dealt 开头(e.pp)记进 MWH,换回来以后用 hurt 打到真主角身上(伤害 = 主角技能伤害 × MIRS 攻击倍率,暴击按镜像暴击率)。画面同理:mwDraw 换进去画飞弹 / 技能 / 分身
let MW=null,MWH=[],MWON=0;
function mwNew(can){const fp=Object.assign({},P,{hit:new Set(),sk:null,cs:null,swT:null,mb:null,inv:0,stun:0,frz:0,ps:0,grab:0,gd2:0,wy:0,shd:0,shdT:0,met:0,qi:0,qiKE:0,uFs:0,ar:0,cd:0,run:0,fly:0,mp:1e9}),mm=JOB||P.mode,
    cd=()=>Array(8).fill(0),w={P:fp,mm,CD:{sword:cd(),staff:cd()},PB:[],CL:null,CL2:null,MGD:[],MGT:null,MGP:null,MGL:[],MGTc:null,MGPc:null,STM:[],SQI:[],MET:[],WE:[],CLN:null,Z:[],px:{pp:1,x:0,y:0,w:24,h:32,hp:1e9,max:1e9}};
  if(can){w.can=1;w.LN=canLN();w.mm='sword';fp.mode='sword'}  // 第四十六轮:灿灿用自己的技能表(mwRun 里换进 LN / JOB)
  fp.mode=w.mm;const L0=w.LN||LN;for(const m of ['sword','staff'])for(let i=0;i<8;i++)w.CD[m][i]=L0[m][i]?skCd(m,i,L0[m][i])*rnd(.2,.7):0;  // 开场各技能已经转了一部分冷却,不会一上来全放
  return w}
function mwRun(fn){const w=MW,s={P,CD,PB,CL,CL2,MGD,MGT,MGP,MGL,MGTc,MGPc,STM,SQI,MET,WE,CLN,Z,E,B,F,WEAR,ah,TOR,LCK,XYN,XYT,LN,JOB};
  P=w.P;if(w.LN){LN=w.LN;JOB=w.P.mode}CD=w.CD;PB=w.PB;CL=w.CL;CL2=w.CL2;MGD=w.MGD;MGT=w.MGT;MGP=w.MGP;MGL=w.MGL;MGTc=w.MGTc;MGPc=w.MGPc;STM=w.STM;SQI=w.SQI;MET=w.MET;WE=w.WE;CLN=w.CLN;Z=w.Z;
  E=[];B=w.px;F=[];WEAR={fash:w.can?'can':null,wing:null};TOR=[];LCK=null;MWON=1;
  try{fn()}finally{Object.assign(w,{CD,PB,CL,CL2,MGD,MGT,MGP,MGL,MGTc,MGPc,STM,SQI,MET,WE,CLN,Z});
    ({P,CD,PB,CL,CL2,MGD,MGT,MGP,MGL,MGTc,MGPc,STM,SQI,MET,WE,CLN,Z,E,B,F,WEAR,ah,TOR,LCK,XYN,XYT,LN,JOB}=s);MWON=0}}
// 镜像的属性:主角 stats() 换上镜像攻击,魔力无限
const mwS=e=>Object.assign({},stats(),{atk:e.matk,mp:1e9});
// 每帧推进镜像的技能和留在场上的东西;技能会移动施法者,推进完把位置同步回首领本体 e
function mwStep(e,dt,S2){const w=MW,fp=w.P,had=!!fp.sk;
  if(!had){fp.x=e.x;fp.y=e.y;fp.f=e.f;fp.mode=e.wm}
  Object.assign(w.px,{x:P.x,y:P.y,w:P.w,h:P.h,hp:1e9,max:1e9,st:0,air:0,kbv:0,ug:0});
  for(const m in w.CD)for(let i=0;i<8;i++)w.CD[m][i]=Math.max(0,w.CD[m][i]-dt);
  if(fp.cs){fp.cs.t+=dt;if(fp.cs.t>1)fp.cs=null}fp.inv-=dt;fp.ar=(fp.ar||0)-dt;fp.gr=!!e.gr;
  mwRun(()=>{P.mp=1e9;const all=[B];skStep(dt,S2,all);pbStep(dt,all,S2);stmStep(dt,S2,all);magStep(dt,S2,all);mgStep(dt,all);for(const z of Z)z.t-=dt;Z=Z.filter(z=>z.t>0);CL=clStep(CL,dt,S2,all);CL2=clStep(CL2,dt,S2,all)});
  if(had||fp.sk){e.x=gpCl(e,fp.x);e.y=Math.min(fp.y,GY-e.h);e.f=fp.f;if(!fp.sk){e.vy=0;e.gr=0}}
  mwHit(e)}
// 打到真主角:hurt 的伤害单位是「怪物攻击」,这里先除掉 EATK × BDMK(和 mirD 一样);连续多段只给很短的受击无敌
function mwHit(e){if(!MWH.length)return;const q=MWH;MWH=[];for(const d of q){let v=d;if(Math.random()<e.mcr)v*=critK();hurt(v/(EATK*BDMK()),{inv:.12,kb:sgn(P.x-e.x)*120})}}
// 放一个技能(m = 武器,i = 0~7);冷却按主角此刻的 skCdA(含时装 / 被动)
function mwCast(e,m,i,S2,f){const w=MW,fp=w.P;fp.mode=m;e.wm=m;fp.x=e.x;fp.y=e.y;fp.f=f||sgn(P.x-e.x)||e.f;e.f=fp.f;fp.gr=!!e.gr;
  const c0=w.CD[m][i];mwRun(()=>{P.mp=1e9;useSk(i,S2)});if(w.CD[m][i]>c0)w.CD[m][i]=w.LN?skCd(m,i,w.LN[m][i]):skCdA(m,i);
  e.x=gpCl(e,fp.x);e.y=Math.min(fp.y,GY-e.h);e.swT=null;e.act=fp.sk?'sk':null;if(!fp.sk)e.cd=rnd(.25,.45);mwHit(e)}
// 技能的出手距离 [最近, 最远](离主角的水平距离);null = 不主动用(法杖闪现只在躲招时用)
const MWR={sword:[[0,230],[0,150],[0,95],[40,380],[0,280],[0,300],[0,300],[0,240]],staff:[[0,340],null,[30,200],[0,100],[0,420],[50,360],[0,110],[0,360]]};  // 第四十六轮:火球 / 雷云 / 火鸟范围变小
function mwPick(ad){const w=MW,o=w.mm=='sword'?'staff':'sword',L=[],LL=w.LN||LN,EX=w.can?[['sword',CANSK.sword],['staff',CANSK.staff]]:[[w.mm,[...Array(JOB==w.mm?8:4).keys()]],[o,[0,1,2,3]]];
  for(const [m,ids] of EX)for(const i of ids){const r=MWR[m][i];if(!r||!LL[m][i]||w.CD[m][i]>0||ad<r[0]||ad>r[1])continue;if(m=='sword'&&i==2&&w.P.gd2>0)continue;L.push([m,i])}
  return L.length?pick(L):null}
function mirStep(e,dt){const pc=P.x+12,cx=e.x+e.w/2,dx=pc-cx,ad=Math.abs(dx),p2=e.hp<e.max*.5,sp=p2?1.15:1;
  if(!MW)MW=mwNew(e.can);const fp=MW.P,S2=mwS(e);
  if(!e.intro){e.intro=1;tx(e.can?'人造人·灿灿一号':'镜中无名',cx-20,e.y-30,e.can?'#a5d8ff':'#d0bfff');bsfx('g10_laugh')}
  if(p2&&!e.p2){e.p2=1;flash(e.can?'110,170,255':'110,80,200',.3);tx(e.can?'出力全开……':'身影越来越淡……也越来越快',cx-60,e.y-40,e.can?'#a5d8ff':'#d0bfff')}
  e.tpT=Math.max(0,(e.tpT||0)-dt);e.rx=(e.rx||0)-dt;e.an=(e.an||0)+dt;e.run=0;
  e.fogT=(e.fogT||0)-dt;if(e.fogT<=0&&!e.can){e.fogT=.16;VFX.spawn('smoke-puff',cx+rnd(-16,16),e.y+e.h*rnd(.15,.95),{s:rnd(.45,.75),a:.22,gr:.6,life:1.1,fps:11})}
  mwStep(e,dt,S2);if(e.can&&canStep(e,dt))return;  // 第四十六轮:灿灿的黑洞 / 无敌空间
  if(fp.sk){if(fp.sk.inv||fp.inv>0)e.tpT=Math.max(e.tpT,.05);e.act='sk';return}  // 放技能中:技能自己带着走
  if(e.act=='sk'){e.act=null;e.cd=rnd(.15,.35)/sp;if(e.can?Math.random()<.5:Math.random()<.6)e.wm=fp.mode=e.can?pick(['sword','staff']):MW.mm}
  e.vy+=1500*dt;e.y+=e.vy*dt;if(e.y>=GY-e.h){e.y=GY-e.h;e.vy=0;e.gr=1}else e.gr=0;
  if(e.lv){e.x=gpCl(e,e.x+e.lv*dt);e.lv*=Math.max(0,1-dt*10);if(Math.abs(e.lv)<5)e.lv=0}
  if(e.swT!=null){e.swT+=dt*sp;if(e.swT>e.swD+e.swR)e.swT=null}
  const sw=e.wm=='sword',end=()=>{e.act=null;e.cd=rnd(.1,.3)/sp};
  if(!e.act){e.f=sgn(dx)||e.f;
    if(e.rx<=0&&threat(e)){e.rx=p2?.4:.55;if(Math.random()<(p2?.85:.7)){  // 躲招:法杖学过闪现且冷却好了就用闪现,否则瞬移
        if((MW.LN||LN).staff[1]&&MW.CD.staff[1]<=0&&Math.random()<.5){mwCast(e,'staff',1,S2,-(sgn(dx)||e.f));e.f=sgn(dx)||e.f;return}e.act='dodge';e.T=0;e.hd=0;return}}
    const want=sw?52:190;e.cd-=dt*sp;
    if(ad>want+26||(!sw&&ad<want-60)){const d=ad>want+26?e.f:-e.f;e.x=gpCl(e,e.x+d*280*sp*dt);e.run=1}
    if(sw&&e.gr&&P.y+P.h<GY-70&&ad<130&&Math.random()<dt*3)e.vy=-560;  // 主角跳起来:跟着跳
    if(e.cd>0)return;
    if(fp.gd2>0&&ad<160){mwCast(e,'sword',2,S2);return}  // 天崩地裂第二段
    if(Math.random()<(p2?.7:.55)){const c=mwPick(ad);if(c){mwCast(e,c[0],c[1],S2);return}}
    const a=sw?(ad<80?'cmb':ad<260?'dash':null):(ad<420?'mb':null);if(!a){e.cd=.1;return}
    e.act=a;e.T=0;e.hd=0;e.n=0;return}
  e.T+=dt*sp;const T=e.T,a=e.act;
  if(a=='dodge'){if(!e.hd){e.hd=1;e.tpT=.35;mirTp(e,1);e.swT=null}if(T>.22){e.act=null;e.cd=0}return}
  if(a=='cmb'){const n=e.n,c=SW[n];if(e.hd!=n+1){e.hd=n+1;e.f=sgn(dx)||e.f;mirSwing(e,n,c.W,c.W+c.S,c.cd-c.W-c.S);e.lv=e.f*LUNGE[n]*6;e.hit=0;e.T=0;sfx('swing');return}
    if(!e.hit&&T>=c.W){e.hit=1;if(ov(P,mirBox(e,c.w+6,c.h,c.y)))hurt(mirD(e,c.m),{kb:e.f*(n==3?340:170)})}
    if(T>=c.cd*.85){e.n++;if(e.n>3||ad>120)end()}return}
  if(a=='mb'){const q=MGA[0],N=p2?4:3;  // 法杖普攻:和主角一样的白色球形闪电(MGA / MGV / MAGR),走镜像自己的 PB
    if(e.hd!=e.n+1){e.hd=e.n+1;e.f=sgn(dx)||e.f;mirSwing(e,'s',q[0],q[0],q[1]);e.T=0;e.sh=0;return}
    if(!e.sh&&T>=q[0]){e.sh=1;MW.PB.push({x:e.f>0?e.x+e.w:e.x-10,y:e.y+14,vx:e.f*MGV,dmg:Math.round(e.matk*q[2]),r:12,lb:1,hit:new Set(),rg:MAGR});psx('zap')}
    if(T>=q[0]+q[1]){e.n++;if(e.n>=N||ad<60)end()}return}
  if(a=='dash'){if(!e.hd){e.hd=1;e.f=sgn(dx)||e.f;mirSwing(e,2,.12,.5,.1);e.hit=0;sfx('swing')}  // 冲刺直戳(主角跑步中按攻击)
    if(T>=.12&&T<.42){e.x=gpCl(e,e.x+e.f*620*dt);e.tpT=Math.max(e.tpT,.04);e.run=1;
      if(!e.hit&&ov(P,mirBox(e,e.w+40,30,-6))){e.hit=1;hurt(mirD(e,1.6),{kb:e.f*320})}}
    if(T>.55)end();return}
  end()}
// 画镜像的飞弹 / 技能画面 / 分身(在主角的技能画面之后画)
function mwDraw(){if(!MW||!B||B.k!='mir'||B.hp<=0)return;PXL.run(()=>mwRun(()=>{drawShots();drawSk()}));mwRun(drawClone)}
// 落雷 / 光柱:预警结束落下(myStep 里推进)
function mirZStep(dt){const pc=P.x+12;
  for(const z of MIRZ){z.t+=dt;if(z.t>=0&&!z.h){z.h=1;
      if(z.k=='zap'){psx('zap');VFX.spawn('electric-impact',z.x,GY-26,{s:1.6});SFX5('m-bolt',z.x,GY+4,{s:1.4,sy:1.2,life:.5})}
      else{psx('boom');VFX.spawn('warm-explosion',z.x,GY-30,{s:1.4});SFX5('r-burst',z.x,GY-40,{s:1.5,life:.45,gr:.5})}
      shake=Math.max(shake,.15);if(Math.abs(pc-z.x)<34)hurt(z.dm,{kb:sgn(pc-z.x)*200})}}
  MIRZ=MIRZ.filter(z=>z.t<.4)}
function mirFx(){for(const z of MIRZ)if(z.t<0)DZ.zone(z.x-34-cam,68)}
// 画:和影分身一样,把主角的状态临时换成镜像的画一遍(离屏),整体染成暗紫黑;透明度忽高忽低(时隐时现),瞬移时淡出
const MIRP=['x','y','f','vx','vy','gr','fly','run','an','sk','cs','swT','swR','swD','swW','swC','swFrom','ch','stg','rc','rT','inv','stun','frz','ps','ar','at','mode','thr','wpv','grab','shdT','shd','wy','rglow'],MIRC={cv:null};
function drawMir(e,al){if(!e)return;{const k=MW&&MW.P.sk;if(k&&k.id=='zap'&&k.hid)return}  // 雷霆连斩:镜像隐身
  const W=cv.width,H=cv.height;let o=MIRC.cv;if(!o||o.width!=W||o.height!=H){o=MIRC.cv=document.createElement('canvas');o.width=W;o.height=H}
  const g=o.getContext('2d');g.setTransform(1,0,0,1,0,0);g.globalAlpha=1;g.globalCompositeOperation='source-over';g.filter='none';g.clearRect(0,0,W,H);g.setTransform(x.getTransform());g.imageSmoothingEnabled=false;
  const sv={};for(const k of MIRP)sv[k]=P[k];const W0=WEAR;if(e.can)WEAR={fash:'can',wing:null};  // 第四十六轮:灿灿 = LPC 女性图层
  const fp=MW&&MW.P;Object.assign(P,{x:e.x,y:e.y,f:e.f,vx:e.run?e.f*280:0,vy:e.vy||0,gr:!!e.gr,fly:0,run:e.run?1:0,an:e.an||0,sk:fp?fp.sk:null,cs:fp?fp.cs:null,swT:e.swT,swR:e.swR,swD:e.swD,swW:e.swW,swC:e.swC,swFrom:e.swFrom,ch:0,stg:e.stg,rc:e.rc,rT:e.rT,inv:0,stun:0,frz:0,ps:0,ar:0,at:e.swT!=null?.1:0,mode:(fp&&fp.sk?fp.mode:e.wm)||'sword',thr:e.thr,wpv:e.wpv,grab:0,shdT:0,shd:0,wy:0});
  const m=x;x=g;try{drawPBody()}finally{x=m;WEAR=W0;e.rc=P.rc;e.rT=P.rT;e.stg=P.stg;e.thr=P.thr;e.wpv=P.wpv;Object.assign(P,sv)}
  g.setTransform(1,0,0,1,0,0);g.globalCompositeOperation='source-atop';if(e.fl>0||!e.can){g.fillStyle=e.fl>0?'rgba(255,255,255,.55)':'rgba(34,16,58,.62)';g.fillRect(0,0,W,H)}
  x.save();x.setTransform(1,0,0,1,0,0);x.globalAlpha=al;x.drawImage(o,0,0);if(!e.can){x.globalCompositeOperation='lighter';x.globalAlpha=al*.25;x.drawImage(o,0,0)}x.restore()}
// 时隐时现:慢慢起伏 + 偶尔闪一下;瞬移 / 闪避时淡出;二阶段更淡
function mirAlpha(e){if(e.can)return e.act=='dodge'?Math.max(.1,Math.min(1,e.T/.22)):1;const t=performance.now()/1000;let a=.62+.2*Math.sin(t*2.1)+.1*Math.sin(t*7.3)-(e.p2?.12:0);
  if(Math.random()<.015)e.flk=.12;if(e.flk>0){e.flk-=1/60;a=.12}
  if(e.act=='blink'&&e.T<.32)a*=e.T<.2?Math.max(0,1-e.T/.2):(e.T-.2)/.12;if(e.act=='dodge')a*=Math.min(1,e.T/.22);
  return Math.max(.06,Math.min(.9,a))}
