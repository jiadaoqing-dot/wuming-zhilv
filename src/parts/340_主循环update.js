// 主角的飞弹(普攻球形闪电、火球、圣光球……):飞行 + 命中 all 里的敌人(第四十五轮从 update 里拆出来,镜中无名 mwRun 里也调用)
function pbStep(dt,all,S){
  for(let i=PB.length-1;i>=0;i--){const b=PB[i];if(b.mc&&P.sk!==b.mc&&Math.abs(b.vx)<1)b.vx=sgn(b.vx)*220;if(b.x0==null)b.x0=b.x;b.x+=b.vx*dt;if(b.fb)weAbs(b.x,b.y,'fire');let gone=b.x<cam-30||b.x>cam+VW+30||(b.rg&&Math.abs(b.x-b.x0)>b.rg);const d=sgn(b.vx);
    if(b.gl){if(Math.random()<.6)pt({x:b.x-d*6,y:b.y+rnd(-5,5),vx:-d*rnd(20,60),vy:rnd(-30,30),c:pick(['#ffd43b','#fff3bf','#fff']),sh:2,s:rnd(3,5),l:.3});if(Math.abs(b.vx)>=1&&(gone||all.some(e=>!e.ug&&e.hp>0&&ov({x:b.x-b.r,y:b.y-b.r,w:2*b.r,h:2*b.r},e)))){holyBoom(b,S);PB.splice(i,1)}continue}  // 第二十七轮 W空 圣光球:碰到第一个敌人或飞到尽头就炸开
    if(b.wv)for(let n=0;n<2;n++)pt({x:b.x-d*rnd(10,30),y:b.y+rnd(-28,28),vx:-d*rnd(60,160),vy:rnd(-30,30),c:pick(['#ffe066','#fff3bf']),sh:1,s:2,l:.25});
    if(b.fb){for(let n=0;n<2;n++)pt({x:b.x-d*6+rnd(-4,4),y:b.y+rnd(-4,4),vx:-d*rnd(20,70),vy:rnd(-70,-10),c:pick(['#ff922b','#ffd43b','#ff6b35']),sh:2,s:rnd(6,10),l:rnd(.25,.45)});if(Math.random()<.25)pt({x:b.x-d*10,y:b.y,vx:-d*20,vy:-40,c:'rgba(70,64,60,.45)',ad:0,s:5,gr:1.5,l:.6})}
    if(b.lb&&Math.random()<(b.big?.9:.5))pt({x:b.x-d*rnd(4,14),y:b.y+rnd(-8,8),vx:-d*rnd(20,80),vy:rnd(-50,50),c:pick(['#fff','#e7f5ff','#a5d8ff','#d0bfff']),sh:1,s:rnd(1.5,3),l:.25});
    for(const e of all)if(!b.hit.has(e)&&ov({x:b.x-b.r,y:b.y-b.r,w:2*b.r,h:2*b.r},e)){b.hit.add(e);hitFx=b.wv?'wave':b.lb?'thunder':null;if(b.fb)mkF(e);NRMH=b.lb?1:0;dealt(e,Math.round(b.dmg*(.9+Math.random()*.2)));NRMH=0;hitFx=null;if(b.lb&&b.big){VFX.spawn('x-star',e.x+e.w/2,e.y+e.h/2,{s:1.1,life:.6,add:1,gr:.5});shake=Math.max(shake,.12)}if(b.fb){explode(b.x+d*6,b.y);SFX5('r-burst',e.x+e.w/2,e.y+e.h/2,{s:1,life:.4,gr:.4});for(const o of all)if(o!==e&&!b.hit.has(o)&&!o.ug&&Math.abs(o.x+o.w/2-(e.x+e.w/2))<o.w/2+80&&Math.abs(o.y+o.h/2-(e.y+e.h/2))<90){mkF(o);dealt(o,Math.round(b.dmg*.4),{ns:1})}}if(b.sl)e.sl=2;if(!b.big&&!b.pierce)gone=true}
    if(gone)PB.splice(i,1)}
}
function update(dt){
  if(busy())return;GT+=dt;
  if(FX.hs>0){FX.hs-=dt;fxStep(dt*.2);return}
  const S=stats();{const cs=P.cryT>0?.5:1;for(const w in CD)for(let i=0;i<CD[w].length;i++)CD[w][i]=Math.max(0,CD[w][i]-dt*cs)}  // 哭声(第八关首领):技能冷却变慢
  if(P.swT!=null)P.swT+=dt;if(P.mb&&(P.swT==null||P.swT>=P.mb.t||P.mode!='staff'))mbFire();if(P.cs){P.cs.t+=dt;if(P.cs.t>1)P.cs=null}
  // 预备结束、真正挥出去的瞬间,招式带着身体向前冲
  if(P.mode!='staff'&&P.swT!=null&&!P.lunged&&P.swT>=P.swW){P.lunged=1;if(P.gr&&!P.sk)P.lv=P.f*(P.mode=='fist'?(P.swC==-1?20:FLUNGE[P.swC]):P.swC==-1?LUNGEH:LUNGE[P.swC])*6}
  P.ar=(P.ar||0)-dt;P.sct=(P.sct||0)-dt;P.frz=Math.max(0,(P.frz||0)-dt);if(P.grab&&(!B||!(B.act=='hug'||(B.act=='bite'&&B.gs=='hold'))))P.grab=0;const stn=P.stun>0||P.frz>0||!!P.grab;if(stn){P.stun-=dt;sq=-1;jq=0;ar=0;lq=0;uq=dq=0;P.ch=0}
  if(sq>=0){useSk(sq,S);sq=-1}
  // 地面攻击时停下脚步:普攻出招到收招、蓄力、施法的前 0.35 秒都不能走动;位移只来自招式自带的前冲
  const atkLock=P.gr&&!P.fly&&((P.swT!=null&&P.swT<P.swD+P.swR)||(ah&&P.ch>.08)||(P.cs&&P.cs.t<.35));
  const d=P.sk||stn||atkLock?0:(keys.r-keys.l)*(P.chm>0&&isDm(cur)&&!INTOWN?-1:1);  // 第五十六轮:阿斯莫德的魅惑 = 左右颠倒
  // 减速:蛛丝命中、沙尘、站在蛛网上都会让移动速度 -40%(取最强的一个,不叠加)
  let sf=1;P.wz=0;if(P.slw>0){P.slw-=dt;sf=.6}if(P.sand>0){P.sand-=dt;sf=.6}
  for(const w of WZ)if(P.y+P.h>=GY-2&&P.x+P.w>w.x&&P.x<w.x+w.w){P.wz=1;sf=.6}
  if(P.pdT>0){P.pdT-=dt;if(Math.random()<dt*28)pt({x:P.x+rnd(0,24),y:P.y+rnd(0,32),vx:rnd(-10,10),vy:rnd(-55,-25),c:pick(['#ffd43b','#fff3bf','#ffe066']),sh:1,s:rnd(1.5,2.5),l:.4})}  // 第四十四轮:完美闪避增伤期间身上冒金光
  m2Tick(dt);P.spdT=(P.spdT||0)-dt;P.apen=(P.apen||0)-dt;P.pAtk=(P.pAtk||0)-dt;P.pDef=(P.pDef||0)-dt;P.hshT=(P.hshT||0)-dt;if(P.hshT<=0)P.hdr=0;
  if(P.sk){if(P.run)P.rkT=.35;P.run=0}else if(P.rkT>0){P.rkT-=dt;if(d){P.run=1;P.rkT=0}}if(!d)P.run=0;  // 第五十四轮(用户):放技能(位移技能、冲刺直戳)时先停跑,技能结束后 0.35 秒内还按着方向键就自动接着跑,不用再双击
  {const mk_=mvK();P.vx=d*170*mk_*(!P.gr&&!P.fly?mk_:1)*sf*(P.run?1.65:1)*(P.spdT>0?1.35:1)*(P.fly?1.1:1)}if(d)P.f=d;  // 第三十三轮:跳在空中时水平速度再乘一次移速倍率 → 移速越快跳得越远
  // 冰面:摩擦力小,加速慢、松开方向键还会滑一段
  {const onIce=cur==6&&!INTOWN&&P.gr&&!P.fly&&(P.onP&&P.onP.y<GY?P.onP.ice:iceAt(P.x+12));if(onIce&&!P.sk){P.ivx=(P.ivx||0)+(P.vx-(P.ivx||0))*Math.min(1,dt*(d?2.6:1.1));if(Math.abs(P.ivx)>40&&Math.random()<dt*14)pt({x:P.x+12-sgn(P.ivx)*6,y:P.y+P.h-1,vx:-P.ivx*.2,vy:rnd(-30,-10),c:'#e7f5ff',ad:0,s:2,l:.3});P.vx=P.ivx}else P.ivx=P.vx}
  if(P.run&&P.gr&&d){P.dt_=(P.dt_||0)-dt;if(P.dt_<=0){P.dt_=.07;pt({x:P.x+12-P.f*8,y:P.y+P.h-2,vx:-P.f*rnd(30,70),vy:rnd(-40,-10),c:'rgba(205,195,175,.65)',ad:0,s:rnd(3,5),gr:1.2,l:.35})}}
  if(jq&&!stn)doJump();jq=0;
  if(P.spdT>0&&d&&Math.random()<dt*20)pt({x:P.x+12-P.f*10,y:P.y+rnd(6,30),vx:-P.f*rnd(60,120),vy:rnd(-10,10),c:pick(['#c3fae8','#e6fcf5']),sh:1,s:1.5,l:.25});
  if(WEAR.fash=='fh'&&Math.random()<dt*5)pt({x:P.x+rnd(0,24),y:P.y+rnd(0,32),vx:rnd(-8,8),vy:rnd(-30,-10),c:pick(['#e6fcf5','#c3fae8','#fff']),s:rnd(1,2),l:rnd(.5,.9)});
  // 冲刺攻击:跑步(双击方向键)时按攻击,立刻变成冲刺直戳——向前冲一段距离,沿途的怪物被刺中并击退
  if(ah&&P.mode=='sword'&&P.run&&P.gr&&!P.fly&&!P.sk&&P.cd<=0&&!stn){ah=0;P.ch=0;P.run=0;P.sk={id:'rstab',t:0,hit:new Set()};P.cd=.55;P.ct=0;P.swT=null;sfx('dash');sfx('swing');flash('220,235,255',.08)}
  if(ah)P.ch+=dt;
  if(ar){ar=0;const hv=P.ch>=.7;P.ch=0;if(P.cd<=0&&!P.sk)strike(hv)}
  if(uq||dq){const u=uq;uq=dq=0;if(!stn&&P.cd<=0&&!P.sk)special(u,S)}
  if(lq){lq=0;P.mode=LMODE=nextMode(P.mode);P.ch=0}  // 第六十九轮:Q 在 剑 → 法杖 → 拳套 之间轮换
  P.kbx=(P.kbx||0)*Math.max(0,1-dt*7);flyPhys(dt,S);if(P.lv){if(!P.gr||P.sk)P.lv=0;else{P.lv*=Math.exp(-6*dt);if(Math.abs(P.lv)<6)P.lv=0}}P.x+=(P.vx+P.kbx+(P.lv||0))*dt;P.x=Math.max(bossOn?2570:0,Math.min(xMax(),P.x));
  P.py=P.y;P.y+=P.vy*dt;P.gr=false;if(P.fly){const top=cur==5&&bossOn?CY+4:6;if(P.y<top){P.y=top;P.vy=0}}
  P.onP=null;for(const p of PL)if(!p.gone&&P.vy>=0&&P.py+P.h<=p.y+1&&P.y+P.h>=p.y&&P.x+P.w>p.x&&P.x<p.x+p.w){P.y=p.y-P.h;P.vy=0;P.gr=true;P.dj=0;P.fly=0;P.onP=p}
  if(!INTOWN){if(cur==6){lv6Player(dt);snowStep(dt)}if(cur==7)lv7Update(dt);if(cur==8)g8Step(dt);if(cur==9)v9Step(dt);if(cur==10)s10Step(dt);nbStep(dt);if(isMy(cur))myStep(dt);if(cur==14)m14Step(dt);if(cur==15)c15Step(dt);if(cur==16)f16Step(dt);if(cur==18)n18Step(dt);if(cur==19)a19Step(dt);if(cur==20)a20Step(dt);if(cur==21)i21Step(dt);if(isDm(cur))dmStep(dt);if(isTw(cur))twStep(dt)}
  if(P.gr&&!P.onP){P.sfX=P.x;P.sfY=P.y}  // 记下最近一次站在地面的位置(复活用)
  if(P.y>VH+100)P.hp=0;
  P.at-=dt;P.cd-=dt;P.ujc=Math.max(0,(P.ujc||0)-dt);P.sjc=Math.max(0,(P.sjc||0)-dt);P.inv-=dt;P.ct-=dt;P.an+=dt*(d&&P.gr?(P.run?1.8:1):0);P.mp=GM.mp?S.mp:Math.min(S.mp,P.mp+(1+S.mp*RECM*pl('rec'))*dt);{const c=setTr();if(P.hp>0){P.hp+=S.hp*RECH*pl('rec')*dt;const y=tr4('yu',c);if(y){P.yuT=(P.yuT||0)+dt;if(P.yuT>=YUTK){P.yuT-=YUTK;P.hp+=S.hp*y}}else P.yuT=0}}P.hp=Math.min(P.hp,S.hp);P.cbT=(P.cbT||0)-dt;if(P.cbT<=0)P.combo=0;
  waveStep(dt);{const z=gateZ();if(z>GZ&&st=='play'){tx(z>=ZB.length?'前往首领的巢穴!':'区域已清除!继续前进 →',P.x-30,P.y-40,'#d0bfff');sfx('buff');flash('200,180,255',.15)}GZ=z}
  if(P.x>2700&&!RTP)bossOn=true;
  const all=bossOn&&B.hp>0?[...E,B]:E;
  skStep(dt,S,all);fistTick(dt);zStep(dt,S,all);smStep(dt,all);godTick(dt);mscStep(dt);palStep(dt,all);fashStep(dt,S,all);petStep(dt,S,all);hamPetStep(dt,S,all);sprStep(dt);starStep(dt);
  if(P.mode!='staff'&&P.at>0&&P.hb&&!(P.swT!=null&&P.swT<P.hbW)){const h=P.hb,hb={x:P.f>0?P.x-6:P.x-h.w,y:P.y+h.y,w:h.w+P.w+6,h:h.h};  // 第二十九轮:判定框往后盖住主角身体,和主角重叠的怪也打得到(原来从身体前沿才开始算)
    for(const e of all)if(!P.hit.has(e)&&ov(hb,e)){P.hit.add(e);hitFx=P.mode=='fist'?'punch':P.cmb==-1?'heavy':null;NRMH=1;dealt(e,Math.round(S.atk*h.m*(.9+Math.random()*.2)));NRMH=0;hitFx=null;if(h.brk)fBrk(e);if(!isBig(e)&&!e.ug){const K=P.cmb==3||P.cmb==-1?2:1;e.kbv=P.f*KBV*K*(iceAt(e.x+e.w/2)?1.6:1)}}}  // 击退(第四段 / 重击加倍);第二十一轮:每下 0.32 秒僵直取消,僵直改走小怪韧性 mobPz(和法师一样),击退只推开怪物、不打断它的动作
  pbStep(dt,all,S);  // 第四十五轮:主角飞弹循环改成独立的 pbStep(镜中无名的飞弹也用它)
  for(const e of all){SFXB=e.max?1:0;  // 首领 AI 里的音效走外部素材
    if(e.k=='mir'){e.st=0;e.sl=0;e.ms=0;e.air=0;e.kbv=0;e.ca=0;e.ug=0}  // 第四十三轮:镜中无名不吃任何僵直 / 减速 / 控制
    if((e===B||e.twb)&&e.k!='mir'&&BLN[cur])bsaStep(e,dt);  // 第四十四轮:首领霸体阶段(第四十五轮:只在第八关以后,BLN 里的关卡)
    e.fl-=dt;e.hst=(e.hst||0)-dt;if(e.pzm)poiseStep(e,dt);e.mx=(e.mx||0)-dt;e.sl=(e.sl||0)-dt;e.ms=(e.ms||0)-dt;const ed=(e.sl>0?dt*.5:e.ms>0?dt*.6:dt)*STK().sp*(e.saT>0?BSAK:1);  // 第十六轮:二 / 三星怪物动作快 6% / 12%
    e.ar=(e.ar||0)-dt;e.sct=(e.sct||0)-dt;e.bld=(e.bld||0)-dt;e.mkT=(e.mkT||0)-dt;e.mkF=(e.mkF||0)-dt;
    if(e.air){if(e.hold>0){e.hold-=dt;continue}if(e.hang>0&&e.avy>=0){e.hang-=dt;e.y+=Math.sin(GT*7+e.x)*.25;continue}e.avy+=2800*dt;e.y+=e.avy*dt;if(e.y>=e.ay0&&e.avy>0){e.y=e.ay0;e.air=0;e.st=Math.max(e.st||0,.3);burst(e.x+e.w/2,e.y+e.h,6,'rgba(205,195,175,.8)',90,{ad:0,s:4,l:.3});if(e.dropIn){e.dropIn=0;if(e.y+e.h>=GY-4)VFX.spawn('landing-dust',e.x+e.w/2,e.y+e.h,{s:1})}}continue}
    if(e.kbv){e.x+=e.kbv*dt;e.kbv*=Math.max(0,1-dt*(iceAt(e.x+e.w/2)?1.3:6));if(Math.abs(e.kbv)<15){e.kbv=0;e.bmp=null}else iceBump(e,dt)}
    if(!e.max&&e.zi>=0){const b=ZB[e.zi],a=zLo(e);if(e.x+e.w>b)e.x=b-e.w;if(e.x<a)e.x=a}
    if(e.st>0){e.st-=dt;continue}
    e.tnt=(e.tnt||0)-dt;const dc=!e.max&&decoyOf(e),px0=P.x,py0=P.y;if(dc){P.x=dc.x+dc.w/2-12;P.y=dc.y+dc.h-P.h;DECOY=1}  // 被召唤物吸引的那只小怪改为追打召唤物(第十九轮:召唤时 10% 几率吸引一只,见 smLure)
    const tw0=e.twb&&isTw(cur)?twIn(e):null;  // 第五十六轮:暗黑炼狱的首领按自己原来的关卡推进
    if(e.ca>0){e.ca-=dt;e.x+=e.f*260*dt}const sx0=e.x;eskStep(e,ed);const ekf=e.max?'act':'s',ea0=e[ekf];
    if(MVK[e.k])mobStep(e,ed);  // 第十六轮:一~七关小怪走招式库
    else if(e.k=='king')kingStep(e,ed);else if(e.k=='mage')mageStep(e,ed);else if(e.k=='sco')scoBStep(e,ed);
    else if(e.k=='bear')bearStep(e,ed);else if(e.k=='wiz')wizStep(e,ed);else if(e.k=='andr')andrStep(e,ed);
    else if(e.k=='boss')mntStep(e,ed);
    else if(e.k=='gfly'||e.k=='gfly2')gflyStep(e,ed);else if(e.k=='gland'||e.k=='gland2')glandStep(e,ed);else if(e.k=='yin')yinStep(e,ed);else if(e.k=='cradle')cradleStep(e,ed);
    else if(e.k=='imp')impStep(e,ed);else if(e.k=='fwisp')fwispStep(e,ed);else if(e.k=='golem')golemStep(e,ed);else if(e.k=='oni')oniStep(e,ed);else if(e.k=='lava')lavaStep(e,ed);else if(e.k=='lclone')lcloneStep(e,ed);
    else if(e.k=='wimp')wimpStep(e,ed);else if(e.k=='eye')eyeStep(e,ed);else if(e.k=='swing')swingStep(e,ed);else if(e.k=='gui')guiStep(e,ed);else if(e.k=='ham')hamStep(e,ed);else if(e.k=='nmr')nmrStep(e,ed);else if(e.k=='dmn')dmnStep(e,ed);else if(e.k=='mir')mirStep(e,ed);
    else if(e.k=='gbot')gbotStep(e,ed);else if(e.k=='zdr')zdrStep(e,ed);else if(e.k=='tank')tankStep(e,ed);else if(e.k=='mech')mechStep(e,ed);else if(e.k=='skw')skwStep(e,ed);else if(e.k=='gob')gobStep(e,ed);else if(e.k=='nwz')nwzStep(e,ed);else if(e.k=='nk')nkStep(e,ed);else if(e.k=='fwm')fwmStep(e,ed);else if(e.k=='mmt')mmtStep(e,ed);else if(e.k=='fsm')fsmStep(e,ed);else if(e.k=='fk')fkStep(e,ed);else if(e.k=='nja')njaStep(e,ed);else if(e.k=='nsh')nshStep(e,ed);else if(e.k=='ron')ronStep(e,ed);else if(e.k=='nb')oboStep(e,ed);else if(e.k=='ckb')ckbStep(e,ed);else if(e.k=='ckr')ckrStep(e,ed);else if(e.k=='alm')almStep(e,ed);else if(e.k=='rsh')rshStep(e,ed);else if(e.k=='rtu')rtuStep(e,ed);else if(e.k=='rgn')rgnStep(e,ed);else if(e.k=='ifa')ifaStep(e,ed);else if(e.k=='ifs')ifsStep(e,ed);else if(e.k=='ifg')ifgStep(e,ed);else if(DMST[e.k])DMST[e.k](e,ed);
    if(!MVK[e.k]&&e.k!='mir'&&!ea0&&e[ekf]&&!eskUse(e,e[ekf])){e[ekf]=null;e.t=0;e.at=0;e.cd=Math.max(e.cd||0,.3)}  // 第三十五轮:技能冷却 / 魔力不够,取消刚选的招
    seek(e,sx0,ed);
    if(dc){P.x=px0;P.y=py0;DECOY=0}
    esfx(e);if(tw0)twOut(tw0);
    if(atkOn(e)&&ov(P,atkBox(e))&&!(e.tpT>0)&&!(e.dg>0)&&!e.ug&&!e.lp&&!(e.bcT>GT)&&hurt(CDMG[e.k]*(e.dm||1))&&(e.bcT=GT+.6)&&e.k=='ysco')poison(4,.025);
  }
  SFXB=0;zClampAll();bossVoice(dt);
  if(P.ps>0){P.ps-=dt;P.pt-=dt;if(P.pt<=0){P.pt+=.5;if(!GM.god){const d=Math.max(1,Math.round(S.hp*P.pp));P.hp-=d;tx('-'+d,P.x+6,P.y-6,'#8ce99a')}}}
  if(cur==19)almRev();  // 第四十八轮:闹钟小怪原地复活一次
  for(let i=E.length-1;i>=0;i--)if(E[i].hp<=0){const e=E[i];if(e.k=='fwisp')V9.bm.push({x:e.x+e.w/2,y:e.y+e.h/2,t:.4});sfxStop(e.sh);sfxStop(e.gl);if(e.max)sfxAll();reward(e);qKill();qM2(e);E.splice(i,1)}  // 小怪不再掉落回血药瓶
  for(let i=F.length-1;i>=0;i--){const f=F[i];if(f.hm){const a=Math.atan2(P.y+16-f.y,P.x+12-f.x),k=Math.min(1,dt*1.4);f.vx+=(Math.cos(a)*85-f.vx)*k;f.vy+=(Math.sin(a)*85-f.vy)*k;f.hl-=dt;if(f.hl<=0){burst(f.x,f.y,8,['#a8ffe8','#2fbf9f'],90,{s:2,l:.3});F.splice(i,1);continue}}  // 鬼火:慢慢追踪玩家
    f.x+=f.vx*dt;f.y+=f.vy*dt;if(!f.ng)f.vy+=(f.g||120)*dt;
    if(f.ox==null){f.ox=f.x;f.mb=!(bossOn&&B&&B.hp>0&&Math.abs(f.x-(B.x+B.w/2))<B.w/2+140)}if(!f.gb&&!f.hm&&Math.abs(f.x-f.ox)>(f.mb?MSHR:BSHR)){burst(f.x,f.y,6,['#fff','#ced4da'],90,{s:2,l:.25});F.splice(i,1);continue}  // 第二十二轮:小怪飞弹射程上限(首领身边发出的不限)
    if(f.gb&&cur==6&&solidAt(f.x-6,f.x+6,GY)){if(f.bnc>0){f.vx=-f.vx;f.bnc--;f.x+=f.vx*dt*2;burst(f.x,f.y,6,['#fff','#a5d8ff'],120,{s:2,l:.25})}else{F.splice(i,1);continue}}
    if(f.snow&&f.y>=GY-14){F.splice(i,1);sfx('boom');shake=Math.max(shake,.2);burst(f.x,GY-10,22,['#fff','#e7f5ff','#d0ebff'],260,{s:4,l:.5,g:600});ring(f.x,GY-4,6,60,'#fff',.35,4,.3);if(Math.abs(P.x+12-f.x)<34&&P.y+P.h>GY-40)hurt(f.dmg);
      for(let k=0;k<7;k++)F.push({x:f.x+rnd(-8,8),y:GY-18,vx:rnd(-260,260),vy:rnd(-430,-230),g:700,c:5,dmg:7*LDM});continue}
    const hr=8*(f.s||1)*SHHK;if(ov(P,{x:f.x-hr,y:f.y-hr,w:2*hr,h:2*hr})){mImp(f,1);{const hh=hurt(f.dmg||(f.c==2?13:f.c==1?10:12)*LDM);if(hh&&f.web)slowP(2);if(hh&&f.sn)slowP(1.2);if(hh&&f.sd)sandP(1);if(hh&&f.ht)heatAdd(f.ht)}BFX.end(f,1);F.splice(i,1)}else if(f.y>GY||f.y<-150||f.x<cam-50||f.x>cam+VW+50){mImp(f,f.y>GY?.8:.45);if(f.y>GY)BFX.end(f,0);if(f.web&&f.y>GY)WZ.push({x:f.x-25,w:50,t:4});if(f.hz&&f.y>GY)HZ.push({x:f.x-22,w:44,t:f.hz=='poi'?3:2.5,k:f.hz});F.splice(i,1)}}
  for(const w of WZ)w.t-=dt;WZ=WZ.filter(w=>w.t>0);hzStep(dt);
  gdStep(dt);
  for(let i=I.length-1;i>=0;i--)if(ov(P,I[i])){P.hp=Math.min(S.hp,P.hp+15);sfx('coin');tx('+15',P.x,P.y-6,'#69db7c');I.splice(i,1)}
  if((cur==19||isTw(cur))&&bossOn&&B.k=='alm'&&B.hp<=0&&!endT)almMorph();  // 第六十二轮:暗黑炼狱第 19 层也是千钟之主  // 第四十八轮:千钟之主还有命就变身
  if(isTw(cur))twChk(dt);else if(bossOn&&B.hp<=0&&!endT&&B.k=='pfg'&&!B.sdOK)pfgSD(dt);  // 第五十九轮:擎天魔神先自爆、再结算  // 第五十六轮:暗黑炼狱(两个首领都倒下才算这层通关)
  else if(bossOn&&B.hp<=0&&!endT&&B.can)canDie();  // 第四十六轮:人造人·灿灿一号
  else if(bossOn&&B.hp<=0&&!endT)bossWin();  // 第五十九轮:首领倒下的结算拆成 bossWin(一键扫荡也用它)
  for(const t of TX){t.t-=dt;t.y-=22*dt}TX=TX.filter(t=>t.t>0);
  if(P.hp<=0){st='dead';CHI=1;sfx('lose')}
  if(INTOWN)cam=Math.max(0,Math.min(twW()-VW,P.x+12-VW/2));else{const tc=bossOn?WW-VW:Math.max(0,Math.min(WW-VW,gateX()-VW,P.x-VW/2+12));cam=bossOn||Math.abs(tc-cam)>40?cam+(tc-cam)*Math.min(1,dt*(bossOn?5:6)):tc}shake=Math.max(0,shake-dt);fxStep(dt);
}
// 首领倒下的结算:击杀点、掉落、各关清场、女神碎片、讨伐任务(第五十九轮从 update 里拆出来,一键扫荡 sweepGo 也调用)
function bossWin(){endT=-1;CLRP=1;sfxAll();B.sh=null;B.gl=null;sfx('win');tx('站到通关光柱上按 W 完成关卡',P.x-50,P.y-62,'#ffe066');F=[];TOR=[];LCK=null;if(isC4())c4Win();else{const g=kpGain(Math.round((KPCL+KPLV*(isDm(cur)?18:cur==21?17:cur==20?16:cur==19?15:cur==18?14:cur>=14?Math.min(cur,16)-3:Math.min(cur,10)))*(1+(STK().gd-1)*.5)));KP+=g;tx('+'+g+' 击杀点'+(isVip()?'(VIP)':''),P.x-14,P.y-76,'#ff8787')}if(cur==MY4){qDay();if(QD.d[1].s==1)QD.d[1].p=1}qM2B();reward(B);if(isDm(cur)&&!isC4())dmDrop(B);if(cur==6&&!JOB&&!(MAT.job>0)&&!GD.some(g=>g.k=='job'))gdDrop(B,{k:'job',n:1});if(!isC4()){const K=STK();for(let j=0;j<2;j++)if(!j||Math.random()<DROPK*K.dr*DBLK())gdDrop(B,{k:'eq',it:rollItem(rollQ(K.bq),cur==11?1:null)});if(cur==12&&Math.random()<GODDR*DBLK())gdDrop(B,{k:'gc',id:pick(['gc1','gc2']),n:1});if(MSS[cur]&&Math.random()<MSDR*DBLK())gdDrop(B,{k:'gc',id:'ms'+cur,n:1});if(cur==16&&Math.random()<.35*DBLK())gdDrop(B,{k:'gc',id:'b360',n:1});  // 第四十二轮:360 小鸟碎片  // 第四十轮:神秘副本 2 掉上帝卡牌 25% · 副本 3 掉合成添加剂 35% · 第十一关 30%  // 第三十八轮:神秘副本 1 瓜子大王掉林王系列(副本 2 / 3 掉雪原系列)  // 第十六轮:首领必掉 1 件(品质按星级 bq),第 2 件看掉落率
      bossDrop19(K);tx('首领掉落了战利品,落地后会自动飞到你身上',P.x-60,P.y-48,'#d0bfff')}if(cur==5||cur==7){B.T=[];B.Z=[];B.R=[];B.S=[];B.ult=0;B.act=null;B.ug=0;F=F.filter(f=>!(f.c>=17&&f.c<=19))}if(cur==6){B.wv=[];B.sp=[];B.zn=[];B.blz=0;B.act=null}if(cur==7){E=E.filter(e=>!e.sum);W7E=performance.now()}if(cur==8){B.act=null;B.ug=0;E=E.filter(e=>!e.sum);G8.cr=[];G8.hd=[];G8.cl=[];G8.ds=[];G8.vis=0;G8.lampOff=0;G8.wn=0;G8.bk=0;}if(cur==9){B.act=null;E=E.filter(e=>!e.sum);V9.pl=[];V9.rw=[];V9.cz=[];V9.ch=null;V9.gp=null;P.heat=0;P.ovh=0;P.burn=0;banner('熔岩冷却了……魔神化成了黑石')}if(cur==10){B.act=null;B.ug=0;B.hide=0;S10.sb=[];S10.bm=[];S10.af=[];S10.wind=0;F=[];banner('归蝇的黑翼散成了羽毛……幽灵船慢慢降到了海面上')}if(cur==14){B.act=null;mkClr();E=E.filter(e=>!e.sum);banner('钢铁暴君冒着黑烟停了下来……要塞的齿轮慢慢停转')}else if(cur==15){B.act=null;c15Clr();banner('夜王跪倒在王座前……永夜王城的钟声停了')}else if(cur==16){B.act=null;f16Clr();banner('焚天炎君的火焰熄灭了……火山口慢慢冷却下来')}else if(cur==18){B.act=null;n18Clr();banner('影主·胧化作一缕青烟……月影忍城的灯一盏盏熄灭了')}else if(cur==19){B.act=null;B.seaT=0;a19Clr();E=E.filter(e=>!e.sum);banner('最后一声铃响……千钟之主终于睡着了,钟楼安静了下来')}else if(cur==21){B.act=null;i21Clr();banner('炎狱巨像崩成了一地冷却的黑石……熔渊的火慢慢熄灭了')}else if(cur==20){B.act=null;a20Clr();banner('金核炮神的核心熄灭了……机库的灯一排排亮了起来')}else if(isDm(cur)){B.act=null;B.y=B.gy;dmClr();banner(DMD[dmI()].n+'倒下了……封魔柱重新亮起了微光')}else if(cur==MY5)pfgWin();else if(cur==MY4){B.act=null;mirClr();gpClr();if(!isC4()){canArm();if(Math.random()<MIRFW*DBLK())gdDrop(B,{k:'eq',it:fireW(pick(WMODES),1)})}}else if(cur>=11){B.act=null;HSH=[];HCL=[];gpClr();if(cur>=12)banner(cur==12?'梦魇幽驹的鬼火熄灭了……原地只剩一副空马鞍':'深渊炎魔坠进了自己的火里……裂缝慢慢合上了');else if(isC4())banner('瓜子大王倒下了……');else if(Math.random()<.05*DBLK()){gdDrop(B,{k:'hegg',n:1});banner('瓜子大王倒下了……留下了一颗暖乎乎的蛋!')}else banner('瓜子大王倒下了……这次没有留下蛋(5% 掉落)')}if(SOULV[cur]&&!soulHas(cur)&&!GD.some(g=>g.k=='soul')){gdDrop(B,{k:'soul',n:1,lv:cur});banner(SOULV[cur])}P.grab=0;P.frz=0;P.fzA=0;P.slw=P.sand=0;P.ps=0;qBoss()}
function rf(o,ox,oy,w,h,c){const fx=o.f>0?o.x+ox:o.x+o.w-ox-w;x.fillStyle=o.fl>0?'#fff':c;x.fillRect(Math.round(fx-cam),Math.round(o.y+oy),w,h)}
function R(px,py,w,h,c){x.fillStyle=c;x.fillRect(Math.round(px),Math.round(py),w,h)}
const GL=300; // 苍蓝巨剑剑身长度(像素)
function blade(ox,oy,a,len,c){x.save();x.translate(P.x+ox-cam,P.y+oy);x.scale(P.f,1);x.rotate(a);x.fillStyle=c||'#dfe6e9';x.fillRect(0,-2,len,4);x.fillStyle='#fff';x.fillRect(2,-1,len-4,1);x.fillStyle='#f1c40f';x.fillRect(-2,-5,3,10);x.fillStyle='#8d5524';x.fillRect(-7,-1.5,5,3);x.restore()}
