// ===== 第四十六轮:神秘副本 4 隐藏首领「人造人·灿灿一号」(用户埋的伏笔,每日任务「人造人灿灿一号」)=====
// 打倒镜中无名后在关卡里等 10 秒,首领场地里出现第二道传送光柱(CNS,通关光柱左边);站上去按 W 进入:HP / MP 不回复,地上的掉落先自动捡起,神秘副本 4 记为通关
// 灿灿 = B.k 'mir' + B.can:共用镜中无名的「主角技能」AI(MW / mwRun / mwCast,不吃僵直、按主角闪避率闪开);mwRun 里把 LN / JOB 换成她自己的(w.LN),所以没学过的技能她也会
// 外形 = 主角同一套纸娃娃,图层换成 LPC 女性体型(WEAR.fash 临时换成 'can',见 LPC.keys),不染色、不时隐时现
// 技能 CANSK:剑 1 冲刺斩 / 4 苍蓝巨剑 / 5 疾风踏斩 / 6 绝息风斩 / 8 焚天炎暴,法 1 落雷 / 2 闪现 / 3 火球 / 5 影分身 / 7 火鸟图腾;等级 = 2 + 星级(最高 5)
// 专属:黑洞 —— 主角头顶上方出现黑洞 3 秒,把主角往中心拉,靠近中心每 0.5 秒受伤(CNBH);
//       无敌空间 —— 原地展开蓝色领域 3 秒(VFX mc-blue 法阵 + b-shield 护罩),领域里的人(灿灿和主角都一样)不受任何伤害、不可选中;灿灿在里面用法杖普攻
// 属性:和镜中无名同一档(MIRS[星级]),生命再 ×CANK.hp。掉落(没有装备):合成添加剂、随机增幅宝石、Lv3 强化石、星界财宝、高级属性石、洗脸券、360 小鸟碎片
const CANSK={sword:[0,3,4,5,7],staff:[0,1,2,4,6]},CANK={hp:1.3},CNR=70,CNBH={r:46,pull:170,tk:.5,m:.6,y:GY-80};
let CNS=null;  // 第二道光柱:{t 倒计时, on 已出现}
const CNX=()=>RPX()-260,nearCN=()=>CNS&&CNS.on&&st=='play'&&cur==MY4&&Math.abs(P.x+12-CNX())<30&&P.gr;
function canArm(){CNS={t:10,on:0}}
function canTick(dt){if(!CNS||CNS.on||cur!=MY4||st!='play')return;CNS.t-=dt;
  if(CNS.t<=0){CNS.on=1;flash('120,170,255',.35);psx('blink');VFX.spawn('rift-portal',CNX(),GY-60,{s:2,life:1.2,add:1,a:.8});banner('……场地另一边又亮起了一道光柱')}}
function canGo(){if(!nearCN())return false;pickUp(1);CLRP=0;CNS=null;
  if(!CLR.includes(cur))CLR.push(cur);if(!(STAR[cur]>=LVSTAR))STAR[cur]=LVSTAR;
  const lm=B.lm;mirClr();F=[];TOR=[];LCK=null;B=canNew(lm);B.gy=B.y;B.def=0;B.dm=1;B.star=LVSTAR;endT=0;bossOn=true;
  flash('150,200,255',.6);shake=.3;sfx('lvl');save();banner('人造人·灿灿一号:「终于见面了,无名。」');return true}
function canNew(lm){const S=stats(),K=MIRS[LVSTAR]||MIRS[1],hp=Math.round(S.hp*K.hp*CANK.hp),pc=P.x+12,mid=(ARL+ARR)/2;
  return {k:'mir',can:1,x:pc<mid?ARR-60:ARL+36,y:GY-32,w:24,h:32,hp,max:hp,fl:0,f:pc<mid?-1:1,cd:1.2,act:null,dm:1,lm,vy:0,gr:1,wm:'sword',bhC:5,fdC:9,
    matk:S.atk*K.atk,mdr:Math.min(DEFMX,defR(S.def)*K.x),mcr:Math.min(1,S.cr/100*K.x),mdg:Math.min(MIRK.dgMax,S.dg/100*K.x)}}
// 灿灿自己的技能等级表(没列出的技能 = 0,不会用)
function canLN(){const l=Math.min(5,2+(LVSTAR||1)),L={sword:Array(8).fill(0),staff:Array(8).fill(0)};for(const m in CANSK)for(const i of CANSK[m])L[m][i]=l;return L}
// 每帧(在 mirStep 里、技能推进之后):黑洞推进;无敌空间期间返回 1(mirStep 不再走普通 AI)
function canStep(e,dt){const pc=P.x+12,cx=e.x+e.w/2,p2=e.hp<e.max*.5,h=e.bh;e.bhC-=dt;e.fdC-=dt;
  if(h){h.t+=dt;if(h.t>=0){const dx=h.x-pc,dy=h.y-(P.y+P.h/2);
      if(Math.abs(dx)>2&&!(P.sk&&P.sk.inv))P.x=Math.max(pLo(),Math.min(xMax(),P.x+sgn(dx)*Math.min(Math.abs(dx),CNBH.pull*dt)));
      h.tk-=dt;if(h.tk<=0){h.tk+=CNBH.tk;if(Math.abs(dx)<CNBH.r&&Math.abs(dy)<CNBH.r+30){hurt(mirD(e,CNBH.m),{inv:.1,kb:0});VFX.spawn('void-implosion',h.x,h.y,{s:.9})}}
      if(h.t>=3){e.bh=null;VFX.spawn('void-implosion',h.x,h.y,{s:1.6});psx('boom')}}}
  if(e.act=='fld'){const f=e.fld;e.T+=dt;e.ug=1;e.x=gpCl(e,f.x-e.w/2);e.f=sgn(pc-cx)||e.f;e.wm=MW.P.mode='staff';e.run=0;
    if(Math.abs(pc-f.x)<CNR)P.inv=Math.max(P.inv,.05);  // 主角站进领域里也一样不受伤害
    if(e.swT!=null){e.swT+=dt;if(e.swT>e.swD+e.swR)e.swT=null}
    e.fsh=(e.fsh||0)-dt;if(e.fsh<=0&&Math.abs(pc-cx)>CNR){const q=MGA[0];e.fsh=p2?.45:.6;mirSwing(e,'s',q[0],q[0],q[1]);
      MW.PB.push({x:e.f>0?e.x+e.w:e.x-10,y:e.y+14,vx:e.f*MGV,dmg:Math.round(e.matk*q[2]),r:12,lb:1,hit:new Set(),rg:MAGR});psx('zap')}
    if(e.T>=3){e.act=null;e.fld=null;e.ug=0;e.cd=.2}return 1}
  if(e.act||MW.P.sk||e.cd>0||!e.gr)return 0;
  if(e.fdC<=0&&e.hp<e.max*.9&&Math.random()<.5){e.fdC=p2?9:12;e.act='fld';e.T=0;e.fsh=.4;e.fld={x:cx};e.swT=null;psx('buff');flash('110,170,255',.2);tx('无敌空间',cx-20,e.y-30,'#74c0fc');return 1}
  if(e.bhC<=0){e.bhC=p2?7:10;e.bh={x:Math.max(ARL+40,Math.min(ARR-40,pc)),y:CNBH.y,t:-.6,tk:0};mirSwing(e,'s',.15,.15,.3);psx('cloud');FX.dk=Math.max(FX.dk,.3);tx('黑洞',cx-10,e.y-30,'#b197fc')}
  return 0}
// 画:第二道光柱(rift-portal 竖着拉长)/ 黑洞 / 蓝色领域(都是 VFX 图集里已有的帧)
function canFx(){const t=performance.now()/1000,e=B;
  if(CNS&&CNS.on){const px=CNX()-cam;if(px>-60&&px<VW+60){const m=VFX.M['rift-portal'];if(m){const i=Math.floor(t*m.fps)%m.n;x.save();x.globalCompositeOperation='lighter';VFX.frame(x,'rift-portal',i,px,GY-70,1.6,1,0,.85,2.4);x.restore()}
      PLQ(x,px,GY-150,'未知的光柱','站上来按 W 进入')}}
  if(!e||!e.can||e.hp<=0)return;
  if(e.bh){const h=e.bh,m=VFX.M['rift-portal'],k=h.t<0?Math.max(.15,1+h.t/.6):Math.min(1,(3-h.t)/.3+.2);if(m){const i=Math.floor(t*m.fps)%m.n;VFX.frame(x,'rift-portal',i,h.x-cam,h.y,1.7*k,1,-t*3,.95)}
    const v=VFX.M['void-implosion'];if(v&&h.t>=0){const i=Math.floor(t*v.fps)%v.n;VFX.frame(x,'void-implosion',i,h.x-cam,h.y,1.1*k,1,t*2,.8)}}
  if(e.act=='fld'&&e.fld){const a=Math.max(0,Math.min(1,e.T/.2,(3-e.T)/.3)),fx=e.fld.x-cam,mc=VFX.M['mc-blue'],sh=VFX.M['b-shield'];  // 地上转动的蓝色法阵 + 半透明蓝色护罩
    if(mc)mgG('mc-blue',fx,GY-2,2*CNR/mc.w,t*.8,.9*a);
    if(sh){x.save();x.globalCompositeOperation='lighter';VFX.frame(x,'b-shield',Math.floor(t*(sh.fps||10))%sh.n,fx,GY-CNR*.62,2*CNR/sh.w,1,0,.45*a,.85);x.restore()}}}
// 灿灿倒下:击杀点 / 经验金币照常,掉落见上;每日任务「人造人灿灿一号」
function canDie(){endT=-1;CLRP=1;sfxAll();sfx('win');tx('站到通关光柱上按 W 完成关卡',P.x-50,P.y-62,'#ffe066');F=[];TOR=[];LCK=null;
  {const g=kpGain(Math.round((KPCL+KPLV*10)*1.5*(1+(STK().gd-1)*.5)));KP+=g;tx('+'+g+' 击杀点'+(isVip()?'(VIP)':''),P.x-14,P.y-76,'#ff8787')}
  qDay();if(QD.d[4]&&QD.d[4].s==1)QD.d[4].p=1;reward(B);
  const dk=DBLK(),K=STK(),n=v=>Math.max(1,rollN(v*K.dr/1.6*dk));
  gdDrop(B,{k:'add',n:n(1.5)});gdDrop(B,{k:'gc',id:'amp_'+pick(Object.keys(AMP)),n:1});gdDrop(B,{k:'stn',lv:3,q:0,n:n(1.5)});gdDrop(B,{k:'gc',id:'astr',n:1});
  if(Math.random()<.5*dk)gdDrop(B,{k:'ats',it:atsNew(2),n:1});gdDrop(B,{k:'gc',id:'wash',n:n(1.5)});if(Math.random()<.5*dk)gdDrop(B,{k:'gc',id:'b360',n:1});
  tx('首领掉落了战利品,落地后会自动飞到你身上',P.x-60,P.y-48,'#d0bfff');B.act=null;B.bh=null;B.fld=null;mirClr();gpClr();banner('灿灿一号停止了运转……「下次……一定……」');
  P.grab=0;P.frz=0;P.fzA=0;P.slw=P.sand=0;P.ps=0;qBoss()}
// ===== 新道具:高级属性石(3 条属性,数值 ×1.5)· 星界财宝(打开得金币 + 击杀点)=====
ATSQ.push({n:'高级属性石',c:'#ffa94d',m:1.5,pr:200});
MISC.astr=['星界财宝','从星界坠落的宝箱。在背包里点「打开」:获得金币 3000~6000 和击杀点 60~120。人造人·灿灿一号掉落。','',0,'🎁 打开'];
Object.assign(MENI.P,{A2:44,astr:45});  // art_src/ui/build_meni.py 第四十六轮追加
function astrOpen(){MAT.astr--;const g=Math.round(rnd(3000,6000)),k=Math.round(rnd(60,120));gold+=g;KP+=k;sfx('coin');save();return '🎁 星界财宝:金币 +'+g+' · 击杀点 +'+k}
