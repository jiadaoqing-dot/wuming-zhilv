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
const isMy=c=>c>=11&&c<=13||c==MY4,isM2=c=>c>=14&&c!=MY4;  // 神秘副本 / 第二张地图的关卡
let MIRZ=[];  // 落雷 / 光柱的落点:{x, t(<0 预警), k, dm}
const MIRT={k:'mir',f:1,wm:'sword',vy:0,gr:1};  // 选关页缩略图用的镜像
function mirClr(){MIRZ=[]}
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
function mirStep(e,dt){const pc=P.x+12,cx=e.x+e.w/2,dx=pc-cx,ad=Math.abs(dx),sw=e.wm=='sword',p2=e.hp<e.max*.5,sp=p2?1.15:1;
  if(!e.intro){e.intro=1;tx('镜中无名',cx-20,e.y-30,'#d0bfff');bsfx('g10_laugh')}
  if(p2&&!e.p2){e.p2=1;flash('110,80,200',.3);tx('身影越来越淡……也越来越快',cx-60,e.y-40,'#d0bfff')}
  e.vy+=1500*dt;e.y+=e.vy*dt;if(e.y>=GY-e.h){e.y=GY-e.h;e.vy=0;e.gr=1}else e.gr=0;
  if(e.lv){e.x=gpCl(e,e.x+e.lv*dt);e.lv*=Math.max(0,1-dt*10);if(Math.abs(e.lv)<5)e.lv=0}
  e.tpT=Math.max(0,(e.tpT||0)-dt);e.rx=(e.rx||0)-dt;e.an=(e.an||0)+dt;e.run=0;
  if(e.swT!=null){e.swT+=dt*sp;if(e.swT>e.swD+e.swR)e.swT=null}
  e.fogT=(e.fogT||0)-dt;if(e.fogT<=0){e.fogT=.16;VFX.spawn('smoke-puff',cx+rnd(-16,16),e.y+e.h*rnd(.15,.95),{s:rnd(.45,.75),a:.22,gr:.6,life:1.1,fps:11})}
  const end=()=>{e.act=null;e.cd=rnd(.1,.3)/sp};
  if(!e.act){e.f=sgn(dx)||e.f;
    if(e.rx<=0&&threat(e)){e.rx=p2?.4:.55;if(Math.random()<(p2?.85:.7)){e.act='dodge';e.T=0;e.hd=0;return}}
    const want=sw?52:190;e.cd-=dt*sp;
    if(ad>want+26||(!sw&&ad<want-60)){const d=ad>want+26?e.f:-e.f;e.x=gpCl(e,e.x+d*280*sp*dt);e.run=1}
    if(sw&&e.gr&&P.y+P.h<GY-70&&ad<130&&Math.random()<dt*3)e.vy=-560;  // 主角跳起来:跟着跳
    if(e.cd>0)return;
    const pun=P.stun>0||!!(P.sk&&P.sk.t>.2)||P.cd>.35;
    const Q=sw?(ad<80?(pun?['cmb','cmb','blink']:['cmb','cmb','leap','blink']):ad<260?['dash','dash','leap','blink']:['zap','blink','dash','leap'])
      :(ad<90?['blink','leap','bolt']:ad<320?['bolt','bolt','fire','pil']:['pil','fire','blink','bolt']);
    let a=pick(Q);if(a==e.la&&Math.random()<.5)a=pick(Q);e.act=a;e.la=a;e.T=0;e.hd=0;e.n=0;return}
  e.T+=dt*sp;const T=e.T,a=e.act;
  if(a=='dodge'){if(!e.hd){e.hd=1;e.tpT=.35;mirTp(e,1);e.swT=null}if(T>.22){e.act=null;e.cd=0}return}
  if(a=='cmb'){const n=e.n,c=SW[n];if(e.hd!=n+1){e.hd=n+1;e.f=sgn(dx)||e.f;mirSwing(e,n,c.W,c.W+c.S,c.cd-c.W-c.S);e.lv=e.f*LUNGE[n]*6;e.hit=0;e.T=0;sfx('swing');return}
    if(!e.hit&&T>=c.W){e.hit=1;if(ov(P,mirBox(e,c.w+6,c.h,c.y)))hurt(mirD(e,c.m),{kb:e.f*(n==3?340:170)})}
    if(T>=c.cd*.85){e.n++;if(e.n>3||ad>120)end()}return}
  if(a=='bolt'){const q=MGA[0],N=p2?5:4;if(e.hd!=e.n+1){e.hd=e.n+1;e.f=sgn(dx)||e.f;mirSwing(e,'s',q[0],q[0],q[1]*.6);e.T=0;e.sh=0;return}
    if(!e.sh&&T>=q[0]){e.sh=1;const x0=e.f>0?e.x+e.w+4:e.x-4,y0=e.y+14,g=Math.atan2(P.y+16-y0,pc-x0);F.push({x:x0,y:y0,vx:Math.cos(g)*340,vy:Math.sin(g)*340,ng:1,c:19,s:1.1,dmg:mirD(e,1.67)});psx('fire')}
    if(T>=q[0]+q[1]*.6){e.n++;if(e.n>=N)end()}return}
  if(a=='fire'){if(!e.hd){e.hd=1;mirSwing(e,'sh',MGA[1][0],MGA[1][0],.4)}
    if(e.hd==1&&T>=MGA[1][0]){e.hd=2;F.push({x:e.f>0?e.x+e.w+6:e.x-6,y:e.y+12,vx:e.f*260,vy:0,ng:1,c:19,s:2.2,dmg:mirD(e,3)});psx('fire');shake=Math.max(shake,.12)}
    if(T>.75)end();return}
  if(a=='dash'){if(!e.hd){e.hd=1;e.f=sgn(dx)||e.f;mirSwing(e,2,.12,.5,.1);e.hit=0;sfx('swing')}
    if(T>=.12&&T<.42){e.x=gpCl(e,e.x+e.f*620*dt);e.tpT=Math.max(e.tpT,.04);e.run=1;
      if(!e.hit&&ov(P,mirBox(e,e.w+40,30,-6))){e.hit=1;hurt(mirD(e,2),{kb:e.f*320})}}
    if(T>.55)end();return}
  if(a=='leap'){if(!e.hd){e.hd=1;e.vy=-520;e.gr=0;e.jvx=Math.max(-420,Math.min(420,dx/.7));e.f=sgn(dx)||e.f;if(sw)mirSwing(e,-1,.6,.72,.4);else mirSwing(e,'sh',.6,.6,.4)}
    if(e.hd==1){e.x=gpCl(e,e.x+e.jvx*dt);if(T>.15&&e.gr){e.hd=2;e.T=0;const c=e.x+e.w/2;sfx('slam');shake=Math.max(shake,.3);VFX.spawn('earth-rupture',c,GY,{s:1.3});
      if(Math.abs(pc-c)<70&&P.y+P.h>GY-50)hurt(mirD(e,3),{kb:sgn(pc-c)*380});for(const d of [-1,1])GPW.push({x:c,d,tr:0,hit:0,dm:mirD(e,1.4)/12,c:'b'})}return}
    if(T>.35)end();return}
  if(a=='blink'){if(T<.2){e.tpT=.3;return}
    if(e.hd==0){e.hd=1;e.T=.2;mirTp(e,!sw)}
    if(e.hd==1&&T>=.32){e.hd=2;if(sw){mirSwing(e,-1,.03,.13,.45);sfx('heavy');if(ov(P,mirBox(e,80,62,-22)))hurt(mirD(e,2.6),{kb:e.f*360})}
      else{e.act='bolt';e.n=0;e.hd=0;return}}
    if(T>.75)end();return}
  if(a=='zap'||a=='pil'){if(!e.hd){e.hd=1;mirSwing(e,sw?-1:'sh',.2,.3,.4);const N=a=='zap'?4:3;
      for(let i=0;i<N;i++){const lead=P.vx*(.5+i*.3)*.6;MIRZ.push({x:Math.max(ARL+20,Math.min(ARR-20,pc+lead+(i?rnd(-60,60):0))),t:-(.55+i*.3),k:a,dm:mirD(e,a=='zap'?2.2:2.4)})}psx(a=='zap'?'thunder':'fire')}
    if(T>.6)end();return}
  end()}
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
function drawMir(e,al){if(!e)return;const W=cv.width,H=cv.height;let o=MIRC.cv;if(!o||o.width!=W||o.height!=H){o=MIRC.cv=document.createElement('canvas');o.width=W;o.height=H}
  const g=o.getContext('2d');g.setTransform(1,0,0,1,0,0);g.globalAlpha=1;g.globalCompositeOperation='source-over';g.filter='none';g.clearRect(0,0,W,H);g.setTransform(x.getTransform());g.imageSmoothingEnabled=false;
  const sv={};for(const k of MIRP)sv[k]=P[k];
  Object.assign(P,{x:e.x,y:e.y,f:e.f,vx:e.run?e.f*280:0,vy:e.vy||0,gr:!!e.gr,fly:0,run:e.run?1:0,an:e.an||0,sk:null,cs:null,swT:e.swT,swR:e.swR,swD:e.swD,swW:e.swW,swC:e.swC,swFrom:e.swFrom,ch:0,stg:e.stg,rc:e.rc,rT:e.rT,inv:0,stun:0,frz:0,ps:0,ar:0,at:e.swT!=null?.1:0,mode:e.wm||'sword',thr:e.thr,wpv:e.wpv,grab:0,shdT:0,shd:0,wy:0});
  const m=x;x=g;try{drawPBody()}finally{x=m;e.rc=P.rc;e.rT=P.rT;e.stg=P.stg;e.thr=P.thr;e.wpv=P.wpv;Object.assign(P,sv)}
  g.setTransform(1,0,0,1,0,0);g.globalCompositeOperation='source-atop';g.fillStyle=e.fl>0?'rgba(255,255,255,.55)':'rgba(34,16,58,.62)';g.fillRect(0,0,W,H);
  x.save();x.setTransform(1,0,0,1,0,0);x.globalAlpha=al;x.drawImage(o,0,0);x.globalCompositeOperation='lighter';x.globalAlpha=al*.25;x.drawImage(o,0,0);x.restore()}
// 时隐时现:慢慢起伏 + 偶尔闪一下;瞬移 / 闪避时淡出;二阶段更淡
function mirAlpha(e){const t=performance.now()/1000;let a=.62+.2*Math.sin(t*2.1)+.1*Math.sin(t*7.3)-(e.p2?.12:0);
  if(Math.random()<.015)e.flk=.12;if(e.flk>0){e.flk-=1/60;a=.12}
  if(e.act=='blink'&&e.T<.32)a*=e.T<.2?Math.max(0,1-e.T/.2):(e.T-.2)/.12;if(e.act=='dodge')a*=Math.min(1,e.T/.22);
  return Math.max(.06,Math.min(.9,a))}
