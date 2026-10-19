// ===== 第三十五轮:敌人技能冷却 + 魔力(用户要求)=====
// 每个敌人每个技能各自冷却:放完一个技能,这个技能要等 CD 结束才能再放;技能越多的敌人 CD 越长(小怪 ESC0 + ESC1 × 技能数,首领 ESB0 + ESB1 × 技能数)
// 魔力:满 100,每放一个技能扣 ESMP(首领 ESMPB);不够扣时进入回蓝:每秒回 ESRG,回到 15%(ESRT)才继续放技能(回蓝期间只走动 / 追人,不出招)
// 小怪(招式库 MVK)在 mobStep 选招时判断;其他小怪和首领在 update 的敌人循环里判断(新动作刚开始时不满足就取消,过一会儿再选)
const ESKN={slime:2,bat:2,skel:3,snake:3,ape:3,ysco:5,bsco:5,spi:5,ost:3,pen:4,pen2:4,seal:4,seal2:4,dog:5,dog2:5,gfly:3,gfly2:3,gland:3,gland2:3,imp:2,fwisp:1,golem:1,oni:3,wimp:2,eye:2,swing:1,gbot:1,zdr:1,tank:1,skw:1,gob:2,nwz:2,fwm:2,mmt:1,fsm:2,nja:2,nsh:2,ron:2,ckb:2,ckr:2,rsh:2,rtu:2,ifa:2,ifs:2,
  king:5,mage:4,sco:5,bear:9,wiz:8,andr:7,boss:5,yin:3,lava:5,gui:5,ham:4,nmr:4,dmn:5,mech:4,nk:4,fk:5,nb:6,alm:6,rgn:6,ifg:6,baal:5,dagon:5,molo:5};
const ESC0=1.2,ESC1=1,ESB0=2,ESB1=.9,ESMP=10,ESMPB=8,ESRG=6,ESRT=15;
const ESKX={rec:1,hid:1,rest:1,up:1,morph:1,intro:1};  // 不算技能的状态(收招 / 隐身 / 休息 / 变身)
const eskCd=e=>{const n=ESKN[e.k]||(e.max?5:2);return e.max?ESB0+ESB1*n:ESC0+ESC1*n};
function eskStep(e,dt){if(e.ekc==null){if(!e.esnm)e.emp=100;e.ekc={}}if(e.esnm){for(const k in e.ekc)e.ekc[k]-=dt;return}for(const k in e.ekc)e.ekc[k]-=dt;if(e.erg){e.emp=Math.min(100,e.emp+ESRG*dt);if(e.emp>=ESRT)e.erg=0}}
// 能不能放技能 a:能就扣魔力、开始冷却,返回 true
function eskUse(e,a){if(ESKX[a]||GM.ko)return true;if(e.ekc==null)eskStep(e,0);if(e.esnm){if((e.ekc[a]||0)>0)return false;e.ekc[a]=eskCd(e);return true}  // 第四十八轮:第十五关起首领只有技能冷却
  if(e.erg||(e.ekc[a]||0)>0)return false;const c=e.max?ESMPB:ESMP;if(e.emp<c){e.erg=1;return false}
  e.emp-=c;e.ekc[a]=eskCd(e);if(e.emp<c)e.erg=1;return true}
function eskBack(e,a){if(ESKX[a]||GM.ko||!e.ekc)return;if(e.esnm){e.ekc[a]=0;return}e.ekc[a]=0;e.emp=Math.min(100,e.emp+(e.max?ESMPB:ESMP));if(e.emp>=(e.max?ESMPB:ESMP)&&e.emp>=ESRT)e.erg=0}  // 拿不到攻击令牌:退回
const MVK={};
// 史莱姆:弹跳撞(三连跳,每次落地小范围伤害,跳起或后退躲)· 黏液喷射(抛物线,落地留黏液 2.5 秒,站上去减速)
MVK.slime={idle(e,dt,dx,ad){if(ad<300)mvWalk(e,dt,42,40,dx,ad);else mvPatrol(e,dt,30)},
  pick(e,dx,ad,dy){if(Math.abs(dy)>60)return null;if(ad<80)return 'hop';if(ad<230&&Math.random()<.55)return 'spit';return null},at:{spit:2},
  mv:{hop(e,dt,dx){const T=e.t;if(T<.4){e.pz='w';e.f=sgn(dx)||e.f;return}const k=T-.4,n=Math.floor(k/.3);if(n>=3){e.y=GY-e.h;if(k>1.15)mvEnd(e,1.1,.3);return}
      const u=(k-n*.3)/.3;if(e.pn<=n){e.pn=n+1;e.hvx=Math.max(-170,Math.min(170,(P.x+12-(e.x+e.w/2))/.3));e.hd=0;e.f=sgn(e.hvx)||e.f}
      e.pz='s';e.x+=e.hvx*dt;e.y=GY-e.h-Math.sin(u*Math.PI)*34;if(u>.85&&!e.hd){e.hd=1;VFX.spawn('landing-dust',e.x+e.w/2,GY-2,{s:.7});mvHit(e,{x:e.x-10,y:GY-30,w:e.w+20,h:30},6,{kb:e.f*220})}},
    spit(e,dt,dx){e.f=sgn(dx)||e.f;if(e.t<.5){e.pz='w';return}if(!e.hd){e.hd=1;e.pz='s';mvArc(e,3,5,.8,700,e.x+e.w/2+e.f*8,e.y+4,.3,{hz:'slow',s:1.2});sfx('proj')}if(e.t>.8)mvEnd(e,1.6)}}};
// 蝙蝠:俯冲(锁定位置后直线穿过,之后飞回高处)· 超声波(直线慢弹,打中减速)· 吸血(半血以下:俯冲命中回自己 15% 血)
MVK.bat={idle(e,dt,dx,ad){e.ph+=dt*4;if(e.by0==null)e.by0=e.by;e.by+=(e.by0-e.by)*Math.min(1,dt*1.5);e.y=e.by+Math.sin(e.ph)*26;if(ad<320){e.f=sgn(dx)||e.f;if(ad>50)e.x+=e.f*70*dt}},
  pick(e,dx,ad){if(ad<170)return e.hp<e.hp0*.5&&Math.random()<.6?'drain':'dive';if(ad<320&&Math.random()<.45)return 'sonic';return null},at:{sonic:2},
  // 第三十三轮:出招那一刻就记下主角的位置(e.ltx / e.lty),之后主角走开也不再跟着调整,俯冲时间 0.32 → 0.45 秒,走开就能躲掉
  mv:{dive(e,dt,dx){if(e.ltx==null||e.t<dt*1.5){e.ltx=P.x+12-e.w/2;e.lty=P.y+P.h-e.h;e.f=sgn(dx)||e.f}if(e.t<.4){e.pz='w';return}if(!e.hd2){e.hd2=1;const T=.45;e.dvx=(e.ltx-e.x)/T+e.f*80;e.dvy=(e.lty-e.y)/T}
      if(e.t<.98){e.pz='s';e.x+=e.dvx*dt;e.y+=e.dvy*dt;if(e.y>GY-e.h)e.y=GY-e.h;if(!e.hd&&mvHit(e,e,e.s=='drain'?7:6,{kb:e.f*200})){e.hd=1;if(e.s=='drain'){e.hp=Math.min(e.hp0,e.hp+e.hp0*.15);tx('吸血',e.x+e.w/2,e.y-14,'#ff8787')}}return}
      e.y+=(e.by-e.y)*Math.min(1,dt*3);if(e.t>1.4){e.ltx=null;mvEnd(e,1.3)}},
    sonic(e,dt,dx){e.f=sgn(dx)||e.f;if(e.t<.5){e.pz='w';return}if(!e.hd){e.hd=1;e.pz='s';const a=Math.atan2(P.y+16-(e.y+e.h/2),dx);F.push({x:e.x+e.w/2+e.f*10,y:e.y+e.h/2,vx:Math.cos(a)*150,vy:Math.sin(a)*150,ng:1,c:2,dmg:4*e.dm,sn:1,s:.8});sfx('shot')}if(e.t>.8)mvEnd(e,1.5)}}};
MVK.bat.mv.drain=MVK.bat.mv.dive;
// 骷髅兵:双连斩(第二下踏前一步并击退,躲开第一下就离开)· 投骨(抛物线)· 骨盾(六成血以下:护盾 = 25% 血,持续 3 秒)
MVK.skel={idle(e,dt,dx,ad){if(ad<300)mvWalk(e,dt,65,38,dx,ad)},
  pick(e,dx,ad,dy){if(e.hp<e.hp0*.6&&!(e.hsd>0)&&e.cd2<=0&&ad<120)return 'guard';if(ad<62&&Math.abs(dy)<40)return 'slash2';if(ad>90&&ad<260&&Math.random()<.5)return 'bone';return null},at:{bone:2,guard:0},
  mv:{slash2(e,dt,dx){const T=e.t;if(T<.42){e.pz='w';if(T<.3)e.f=sgn(dx)||e.f;return}e.pz='s';
      if(e.pn<1){e.pn=1;sfx('swing');mvHit(e,mvBox(e,40,e.h+6,-4),7,{inv:.2})}if(T>=.6&&T<.72)e.x+=e.f*110*dt;if(T>=.72&&e.pn<2){e.pn=2;sfx('swing');mvHit(e,mvBox(e,48,e.h+8,-4),9,{kb:e.f*300})}
      if(T>1.05)mvEnd(e,1.3,.3)},
    bone(e,dt,dx){e.f=sgn(dx)||e.f;if(e.t<.5){e.pz='w';return}if(!e.hd){e.hd=1;e.pz='s';mvArc(e,15,6,.75,650,e.x+e.w/2+e.f*10,e.y+8,.3,{s:1});sfx('proj')}if(e.t>.85)mvEnd(e,1.5)},
    guard(e,dt){e.pz='w';if(e.t>.45&&!e.hd){e.hd=1;e.hsd=Math.round(e.hp0*.25);e.hsT=3;e.cd2=8;ring(e.x+e.w/2,e.y+e.h/2,4,30,'#e9ecef',.35,4);tx('骨盾',e.x+e.w/2,e.y-18,'#e9ecef')}if(e.t>.7)mvEnd(e,.8)}}};
// 蛇:毒牙突刺(前摇后直线突进,命中中毒)· 盘绕甩尾(贴身 360° 甩尾击退,跳起躲)· 喷毒(抛物线,落地留毒雾 3 秒)
MVK.snake={idle(e,dt,dx,ad){if(ad<260)mvWalk(e,dt,55,70,dx,ad);else mvPatrol(e,dt,40)},
  pick(e,dx,ad,dy){if(Math.abs(dy)>30)return null;if(ad<64&&Math.random()<.5)return 'coil';if(ad<140)return 'fang';if(ad<270&&Math.random()<.6)return 'venom';return null},at:{venom:2},
  mv:{fang(e,dt,dx){if(e.t<.45){e.pz='w';e.f=sgn(dx)||e.f;return}if(e.t<.75){e.pz='s';e.x+=e.f*240*dt;if(!e.hd&&mvHit(e,mvBox(e,30,e.h,0),7,{kb:e.f*200})){e.hd=1;poison(3,.02)}return}if(e.t>1.1)mvEnd(e,1.5,.3)},
    coil(e,dt){if(e.t<.4){e.pz='w';return}if(!e.hd){e.hd=1;e.pz='s';sfx('swing');for(const d of [-1,1])slash(e.x+e.w/2+d*18,e.y+e.h-10,20,-1,1,d,'#8ce99a',.2,4);mvHit(e,{x:e.x-34,y:e.y-6,w:e.w+68,h:e.h+6},8,{kb:sgn(P.x+12-(e.x+e.w/2))*320})}if(e.t>.8)mvEnd(e,1.2)},
    venom(e,dt,dx){e.f=sgn(dx)||e.f;if(e.t<.5){e.pz='w';return}if(!e.hd){e.hd=1;e.pz='s';mvArc(e,3,5,.8,700,e.x+e.w/2+e.f*10,e.y+2,.3,{hz:'poi',s:1.1});sfx('proj')}if(e.t>.8)mvEnd(e,1.7)}}};
// 猿:跳砸(跳到玩家头顶砸地,落点有预警,跳起躲)· 捶胸(七成血以下一次:攻击 +35% 持续 5 秒,蓄力中霸体)· 投石(抛物线,伤害高)
MVK.ape={idle(e,dt,dx,ad){e.vy=(e.vy||0)+1500*dt;e.y+=e.vy*dt;if(e.y>=GY-e.h){e.y=GY-e.h;e.vy=0;e.gr=1}else e.gr=0;if(!e.gr)return;if(ad<300)mvWalk(e,dt,80,60,dx,ad)},
  pick(e,dx,ad,dy){if(!e.gr)return null;if(e.hp<e.hp0*.7&&!e.bst&&!e.bstd)return 'roar';if(ad<190&&Math.abs(dy)<60)return 'slam';if(ad<300&&Math.random()<.5)return 'rock';return null},at:{rock:2,roar:0},
  mv:{slam(e,dt,dx){if(e.t<.45){e.pz='w';e.f=sgn(dx)||e.f;e.lx=e.x+Math.max(-220,Math.min(220,P.x+12-e.w/2-e.x));return}
      if(!e.hd2){e.hd2=1;e.ap=1;e.gr=0;e.vy=-520;e.jx=(e.lx-e.x)/.72;sfx('eatk')}e.pz='s';e.vy+=1500*dt;e.y+=e.vy*dt;e.x+=e.jx*dt;
      if(e.y>=GY-e.h&&e.vy>0){e.y=GY-e.h;e.vy=0;e.gr=1;e.ap=0;e.jx=0;if(!e.hd){e.hd=1;shake=Math.max(shake,.15);sfx('slam');VFX.spawn('landing-dust',e.x+e.w/2,GY-2,{s:1.1});const r=e.w/2+40;if(P.gr)mvHit(e,{x:e.x+e.w/2-r,y:GY-50,w:2*r,h:50},10,{kb:sgn(P.x+12-(e.x+e.w/2))*300})}
        if(e.t>1.6)mvEnd(e,1.4,.4)}},
    roar(e,dt){e.pz='w';e.ar=.3;if(e.t>.6&&!e.hd){e.hd=1;e.bst=5;e.bstd=1;e.dm0=e.dm;e.dm=e.dm*1.35;shake=Math.max(shake,.1);ring(e.x+e.w/2,e.y+e.h/2,6,44,'#ff922b',.4,5);tx('捶胸怒吼',e.x+e.w/2,e.y-20,'#ff922b');sfx('roar')}if(e.t>.9)mvEnd(e,.6)},
    rock(e,dt,dx){e.f=sgn(dx)||e.f;if(e.t<.55){e.pz='w';return}if(!e.hd){e.hd=1;e.pz='s';mvArc(e,14,9,.85,800,e.x+e.w/2+e.f*12,e.y-6,.35,{s:1.2});sfx('proj')}if(e.t>.9)mvEnd(e,1.6)}}};
// 黄蝎 / 黑蝎(精英):钳击二连(第二下击退)· 尾刺突进(直线突进,命中中毒)· 潜沙(钻进沙里追 1.2 秒,从脚下钻出,预警圈)· 黑蝎另有 毒雾(身边留毒雾 3.5 秒)/ 硬甲(护盾 30% 血)
MVK.ysco={idle(e,dt,dx,ad){if(ad<280)mvWalk(e,dt,60,50,dx,ad);else mvPatrol(e,dt,35)},
  pick(e,dx,ad,dy){const bk=e.k=='bsco';if(bk&&e.hp<e.hp0*.5&&!(e.hsd>0)&&e.cd2<=0)return 'armor';if(Math.abs(dy)>30)return null;if(ad<70)return bk&&Math.random()<.3?'fog':'pinch';if(ad<170&&Math.random()<.6)return 'sting';if(ad<300&&Math.random()<.45)return 'sand';return null},at:{armor:0,fog:0},
  mv:{pinch(e,dt,dx){const T=e.t;if(T<.4){e.pz='w';if(T<.28)e.f=sgn(dx)||e.f;return}e.pz='s';if(e.pn<1){e.pn=1;mvHit(e,mvBox(e,36,e.h+6,-4),7,{inv:.2})}if(T>=.62&&e.pn<2){e.pn=2;sfx('swing');e.x+=e.f*10;mvHit(e,mvBox(e,42,e.h+8,-4),8,{kb:e.f*300})}if(T>.95)mvEnd(e,1.3,.3)},
    sting(e,dt,dx){if(e.t<.5){e.pz='w';e.f=sgn(dx)||e.f;return}if(e.t<.82){e.pz='s';e.x+=e.f*(e.k=='bsco'?210:250)*dt;if(!e.hd&&mvHit(e,mvBox(e,30,e.h,0),8,{kb:e.f*180})){e.hd=1;poison(4,.025)}return}if(e.t>1.2)mvEnd(e,1.6,.3)},
    sand(e,dt,dx){const T=e.t;if(T<.4){e.pz='w';if(!e.hd2){e.hd2=1;burst(e.x+e.w/2,GY-4,10,['#e6cc98','#d9a961'],120,{ad:0,s:3,l:.4})}return}
      if(T<1.6){e.ug=1;e.pz=null;if(e.ux==null)e.ux=e.x+e.w/2;e.udir=sgn(P.x+12-e.ux)||1;e.ux+=e.udir*Math.min(130*dt,Math.abs(P.x+12-e.ux));e.x=e.ux-e.w/2;return}
      if(T<1.95){e.pz='w';return}
      if(!e.hd){e.hd=1;e.ug=0;e.pz='s';e.f=sgn(dx)||e.f;shake=Math.max(shake,.1);burst(e.x+e.w/2,GY-6,14,['#e6cc98','#fff'],180,{ad:0,s:3,l:.4,g:500});const r=e.w/2+14;mvHit(e,{x:e.x+e.w/2-r,y:GY-60,w:2*r,h:60},9,{kb:sgn(dx)*300});e.ux=null}
      if(T>2.4)mvEnd(e,1.6,.3)},
    fog(e,dt){e.pz='w';if(e.t>.5&&!e.hd){e.hd=1;HZ.push({x:e.x+e.w/2-55,w:110,t:3.5,k:'poi'});tx('毒雾',e.x+e.w/2,e.y-18,'#8ce99a')}if(e.t>.8)mvEnd(e,1.4)},
    armor(e,dt){e.pz='w';if(e.t>.45&&!e.hd){e.hd=1;e.hsd=Math.round(e.hp0*.3);e.hsT=4;e.cd2=10;ring(e.x+e.w/2,e.y+e.h/2,4,34,'#9775fa',.35,4);tx('硬甲',e.x+e.w/2,e.y-18,'#d0bfff')}if(e.t>.7)mvEnd(e,.8)}}};
MVK.bsco=MVK.ysco;
// 蜘蛛(矢量 / 图集按 s = pw / pj / sp / bu 画):跳扑 pw→pj · 吐丝 sp(命中减速,落地变蛛网)· 潜沙 bu(沙痕追踪后钻出)· 新:结网 trap(在玩家脚下布一张蛛网 4 秒,站在上面减速)
MVK.spi={idle(e,dt,dx,ad){e.lf=(e.lf||0)-dt;if(ad<340){e.f=sgn(dx)||e.f;if(ad>70)e.x+=e.f*50*dt}else mvPatrol(e,dt,30)},
  pick(e,dx,ad,dy){if(ad>340)return null;const r=Math.random();if(ad<170&&r<.5)return 'pw';if(ad>=110&&r<.75)return 'sp';if(r<.88)return 'trap';return 'bu'},at:{sp:2,trap:2},
  mv:{pw(e,dt,dx){e.pz='w';e.f=sgn(dx)||e.f;if(e.t>=.5){e.s='pj';e.t=0;const T=.55;e.vx=Math.max(-340,Math.min(340,dx/T));e.vy=-412}},
    pj(e,dt){e.pz='s';e.vy+=1500*dt;e.x+=e.vx*dt;e.y+=e.vy*dt;if(e.y>=GY-e.h){e.y=GY-e.h;e.lf=.25;mvHit(e,{x:e.x-18,y:GY-24,w:e.w+36,h:24},10);mvEnd(e,1.5,.5)}},
    sp(e,dt,dx){e.f=sgn(dx)||e.f;if(e.t<.35){e.pz='w';return}if(!e.hd){e.hd=1;e.pz='s';const ox=e.x+e.w/2,oy=e.y,T=.75;F.push({x:ox,y:oy,vx:(P.x+12-ox)/T,vy:(P.y+16-oy-.5*120*T*T)/T,c:4,web:1,dmg:4*e.dm})}if(e.t>.65)mvEnd(e,1.8)},
    trap(e,dt){e.pz='w';if(e.t>.45&&!e.hd){e.hd=1;const px=P.x+12;WZ.push({x:px-28,w:56,t:4});for(let i=0;i<6;i++)pt({x:px+rnd(-20,20),y:GY-4,vx:rnd(-20,20),vy:rnd(-40,-10),c:'#f1f3f5',s:2,l:.3});if(P.gr)slowP(1.2)}if(e.t>.7)mvEnd(e,1.6)},
    bu(e,dt,dx,ad){e.ug=1;if(e.t<1.45){e.f=sgn(dx)||e.f;e.x+=e.f*Math.min(160*dt,ad);return}if(e.t<1.8){e.pz='w';return}if(!e.hd){e.hd=1;e.ug=0;e.lf=.3;mvHit(e,{x:e.x-8,y:GY-34,w:e.w+16,h:34},9)}if(e.t>2.1)mvEnd(e,1.8)}}};
// 鸵鸟(矢量画法按 s = cw / ch / pk / kw / kk):疯狂冲刺 cw→ch · 连续啄击 pk(第三下击退)· 鸵鸟踢 kw→kk(玩家在身后时)· 新:刨沙 sand(踢起 3 团沙,打中沙尘迷眼)
MVK.ost={idle(e,dt,dx,ad){e.an=(e.an||0)+dt;if(ad>420){mvPatrol(e,dt,40);return}const beh=sgn(dx)!=e.f;if(beh){e.bt=(e.bt||0)+dt;if(e.bt>.5){e.f=sgn(dx);e.bt=0}return}e.bt=0;if(ad>40)e.x+=e.f*115*dt},
  pick(e,dx,ad){if(ad>420)return null;const beh=sgn(dx)!=e.f;if(beh)return ad<75?'kw':null;if(ad<60)return 'pk';if(ad>130)return Math.random()<.35?'sand':'cw';return null},at:{sand:2},
  mv:{cw(e,dt){e.pz='w';if(e.t>=.6){e.s='ch';e.t=0;e.hd=0}},
    ch(e,dt){e.pz='s';e.x+=e.f*430*dt;if(!e.hd&&mvHit(e,{x:e.x,y:e.y+10,w:e.w,h:e.h-10},12,{kb:e.f*460}))e.hd=1;if(e.t>.85)mvEnd(e,1.1,.6)},
    pk(e,dt){e.pz=e.t<.4?'w':'s';for(let i=0;i<3;i++)if(e.t>=.4+i*.25&&e.pn==i){e.pn++;sfx('peck');const hb={x:e.f>0?e.x+e.w-4:e.x-30,y:e.y+12,w:34,h:32};if(i<2)mvHit(e,hb,5,{inv:.15});else mvHit(e,hb,7,{kb:e.f*420})}if(e.t>1.15)mvEnd(e,1,.6)},
    kw(e,dt){e.pz='w';if(e.t>=.6){e.s='kk';e.t=0;mvHit(e,{x:e.f>0?e.x-44:e.x+e.w,y:e.y+16,w:44,h:28},14,{kb:-e.f*480})}},
    kk(e,dt){e.pz='s';if(e.t>.2){e.f*=-1;mvEnd(e,1,.5)}},
    sand(e,dt,dx){e.f=sgn(dx)||e.f;if(e.t<.5){e.pz='w';return}if(!e.hd){e.hd=1;e.pz='s';for(let i=0;i<3;i++)mvArc(e,16,4,.6+i*.08,900,e.x+e.w/2-e.f*10,e.y+e.h-10,.25+i*.1,{s:.7,sd:1});sfx('proj')}if(e.t>.8)mvEnd(e,1.5)}}};
// 企鹅 / 精英企鹅(图集按 s = sw / sl / tk / tkl / th / pk / dz 播动作):肚皮滑行 sw→sl(撞墙反弹;四成概率变成来回两趟的旋转滑行)· 啄击 pk · 扔冰块 th(精英连扔 3 个)· 精英:滑铲 tk→tkl(击飞)· 撞墙 3 次眩晕 dz
MVK.pen={idle(e,dt,dx,ad){if(ad<340){e.f=sgn(dx)||e.f;if(ad>60)e.x+=e.f*55*dt;else if(ad<30)e.x-=e.f*30*dt}else mvPatrol(e,dt,35);blkPush(e)},
  pick(e,dx,ad,dy){if(ad>360||Math.abs(dy)>80)return null;const el=e.k=='pen2',r=Math.random();if(ad<46)return 'pk';if(el)return r<.35?'th':r<.65?'tk':'sw';return r<.55?'sw':'th'},at:{th:2,dz:0},
  mv:{dz(e,dt){e.pz=null;if(e.t>2)mvEnd(e,.8)},
    sw(e,dt){e.pz='w';if(e.t>=.5){e.s='sl';e.t=0;e.hd=0;e.bn=0;e.tn=0;e.spin=Math.random()<.4?1:0}},tk(e,dt){e.pz='w';if(e.t>=.55){e.s='tkl';e.t=0;e.hd=0;e.bn=0;e.spin=0}},
    sl(e,dt){const tk=e.s=='tkl',sp=tk?520:(e.spin?330:400);e.pz='s';const nx=e.x+e.f*sp*dt,b=solidAt(nx,nx+e.w,e.y+e.h)||zWall(e,nx);
      if(b){e.f*=-1;e.bn++;e.hd=0;sfx('peck');burst(e.f<0?e.x+e.w:e.x,e.y+e.h-6,8,['#fff','#d0ebff'],140,{s:2,l:.3})}else e.x=nx;
      if(e.spin&&!tk&&e.t>.9&&!e.tn){e.tn=1;e.f*=-1;e.hd=0}
      if(Math.random()<dt*30)pt({x:e.x+e.w/2-e.f*10,y:e.y+e.h-2,vx:-e.f*rnd(40,90),vy:rnd(-60,-20),c:pick(['#fff','#e7f5ff']),ad:0,s:rnd(2,3),l:.35});
      if(!e.hd&&mvHit(e,{x:e.x,y:e.y+e.h*.4,w:e.w,h:e.h*.6},tk?12:8,{kb:e.f*(tk?520:420)})){e.hd=1;if(tk)P.vy=-560}
      if(e.bn>3){e.s='dz';e.t=0;return}if(e.t>(tk?1.2:e.spin?1.9:1.6))mvEnd(e,1.2,.4)},
    pk(e,dt){e.pz=e.t<.25?'w':'s';for(let i=0;i<2;i++)if(e.t>=.3+i*.25&&e.pn==i){e.pn++;sfx('peck');mvHit(e,{x:e.f>0?e.x+e.w-6:e.x-26,y:e.y+4,w:32,h:e.h},5,{inv:.15})}if(e.t>.85&&e.t<1.15)e.x-=e.f*150*dt;if(e.t>1.2)mvEnd(e,.9)},
    th(e,dt,dx){const n=e.k=='pen2'?3:1;e.pz=e.t<.42?'w':'s';e.f=sgn(dx)||e.f;for(let i=0;i<n;i++)if(e.t>=.45+i*.28&&e.pn==i){e.pn++;sfx('proj');mvArc(e,5,6,.8,600,e.x+e.w/2+e.f*10,e.y+4,.3,{})}if(e.t>.6+n*.28)mvEnd(e,1.4)}}};
MVK.pen.mv.tkl=MVK.pen.mv.sl;MVK.pen2=MVK.pen;
// 海豹 / 精英海豹(hid / ball / dig 用矢量画法):潜伏 hid → 靠近就跳出击飞 pop · 喷冰球 in(贴地,撞墙反弹;精英 3 个)· 拍击 slp · 钻雪 dig · 精英:雪球 cu→ball(能撞飞其他小怪)· 新:冰锥 ice(3 根抛物线冰锥)
MVK.seal={idle(e,dt,dx,ad){if(e.hid0==null){e.hid0=1;e.s='hid';e.t=0;e.ug=1;return}if(ad<300){e.f=sgn(dx)||e.f;if(ad>70)e.x+=e.f*38*dt}else mvPatrol(e,dt,25);blkPush(e)},
  pick(e,dx,ad){if(ad>340)return null;const el=e.k=='seal2',r=Math.random();if(ad>240&&r<.3)return 'dig';if(ad<70)return el&&r<.4?'cu':'slp';if(r<.3)return 'ice';return el&&r<.6?'cu':'in'},at:{in:2,ice:2,dig:0,hid:0},
  mv:{hid(e,dt,dx,ad){e.ug=1;e.pz=null;if(ad<75&&Math.abs(P.y+P.h-GY)<60&&tok(e)){e.s='pop';e.t=0;e.ug=0;e.vy=-430;e.hd=0;sfx('roar');burst(e.x+e.w/2,GY-4,16,['#fff','#e7f5ff','#d0ebff'],220,{s:3,l:.5,g:500})}},
    pop(e,dt,dx){e.pz='s';e.vy+=1500*dt;e.y+=e.vy*dt;if(!e.hd&&mvHit(e,{x:e.x-6,y:e.y-6,w:e.w+12,h:e.h+12},10,{kb:sgn(dx)*300})){e.hd=1;P.vy=-480}if(e.y>=GY-e.h&&e.vy>0){e.y=GY-e.h;mvEnd(e,.8,.4)}},
    dig(e,dt){e.pz='w';if(e.t>.5){e.s='hid';e.t=0;e.ug=1;burst(e.x+e.w/2,GY-4,10,['#fff','#e7f5ff'],140,{s:3,l:.4,g:400})}},
    in(e,dt,dx){e.f=sgn(dx)||e.f;const n=e.k=='seal2'?3:1;e.pz=e.t<.6?'w':'s';for(let i=0;i<n;i++)if(e.t>=.6+i*.3&&e.pn==i){e.pn++;sfx('shot');F.push({x:e.x+e.w/2+e.f*16,y:GY-10,vx:e.f*300,vy:0,ng:1,gb:1,bnc:1,c:7,dmg:7*e.dm})}if(e.t>.75+n*.3)mvEnd(e,1.5)},
    ice(e,dt,dx){e.f=sgn(dx)||e.f;e.pz=e.t<.55?'w':'s';for(let i=0;i<3;i++)if(e.t>=.55+i*.12&&e.pn==i){e.pn++;sfx('proj');mvArc(e,5,6,.7+i*.1,700,e.x+e.w/2+e.f*10,e.y,.2+i*.15,{})}if(e.t>1.1)mvEnd(e,1.6)},
    slp(e,dt){e.pz=e.t<.6?'w':'s';if(e.t>=.6&&!e.hd){e.hd=1;sfx('slam');shake=Math.max(shake,.08);mvHit(e,{x:e.f>0?e.x+e.w-10:e.x-44,y:e.y-14,w:54,h:e.h+14},11,{kb:e.f*360})}if(e.t>1)mvEnd(e,1.1)},
    cu(e,dt,dx){e.pz='w';if(e.t>.5){e.s='ball';e.t=0;e.bn=0;e.hd=0;e.bh=new Set();e.f=sgn(dx)||e.f;e.rot=0}},
    ball(e,dt){e.pz=null;e.rot=(e.rot||0)+e.f*dt*9;const nx=e.x+e.f*270*dt,b=solidAt(nx,nx+e.w,e.y+e.h)||zWall(e,nx);
      if(b){e.f*=-1;e.bn++;e.hd=0;shake=Math.max(shake,.08);sfx('boom');burst(e.f<0?e.x+e.w:e.x,e.y+e.h/2,10,['#fff','#d0ebff'],160,{s:3,l:.4})}else e.x=nx;
      if(Math.random()<dt*20)pt({x:e.x+e.w/2-e.f*16,y:GY-3,vx:-e.f*rnd(30,80),vy:rnd(-50,-10),c:'#fff',ad:0,s:rnd(2,4),l:.4});
      const hb={x:e.x-6,y:GY-40,w:e.w+12,h:40};if(!e.hd&&mvHit(e,hb,12,{kb:e.f*440}))e.hd=1;
      for(const o of E)if(o!==e&&!o.ug&&!e.bh.has(o)&&ov(hb,o)){e.bh.add(o);xDeal(o,Math.round(o.hp0*.6));o.kbv=e.f*380;o.st=Math.max(o.st||0,.8);if(!isBig(o))launch(o);tx('被雪球撞飞!',o.x+o.w/2,o.y-20,'#a5d8ff')}
      if(e.t>3.4||e.bn>2){burst(e.x+e.w/2,e.y+e.h/2,14,['#fff','#e7f5ff'],180,{s:3,l:.4});mvEnd(e,1.6,.5)}}}};
MVK.seal2=MVK.seal;
// 普通狗 / 双头狗(图集动作;双头狗喷冰的冰雾按 s='sp' 画):低身冲刺 cw→ds · 撕咬 bt · 新:围猎 hw(先后跳拉开距离再冲刺)· 双头狗:双咬 db · 双头喷冰 sp(减速)· 狂犬冲撞 cw→rs(反弹连撞 3 次)· 新:嚎叫 howl(附近的狗 5 秒内攻击 +30%)
MVK.dog={idle(e,dt,dx,ad){const el=e.k=='dog2';if(ad<380){e.f=sgn(dx)||e.f;if(ad>50)e.x+=e.f*(el?70:95)*dt;else if(ad<26)e.x-=e.f*40*dt}else mvPatrol(e,dt,40)},
  pick(e,dx,ad,dy){if(ad>360||Math.abs(dy)>70)return null;const el=e.k=='dog2',r=Math.random();
    if(el){if(e.cd2<=0&&r<.2)return 'howl';if(ad<60)return r<.55?'db':'sp';if(ad<160)return r<.5?'sp':'cw';return 'cw'}
    if(ad<44)return 'bt';if(ad<120&&r<.35)return 'hw';if(ad<240)return 'cw';return null},at:{sp:2,howl:0},
  mv:{cw(e,dt,dx){e.pz='w';if(e.t<.3)e.f=sgn(dx)||e.f;if(e.t>=(e.k=='dog2'?.75:.6)){e.s=e.k=='dog2'?'rs':'ds';e.t=0;e.hd=0;e.bn=0;sfx('dash')}},
    hw(e,dt,dx){if(e.t<.3){e.pz='w';e.f=sgn(dx)||e.f;e.x-=e.f*220*dt;return}e.s='cw';e.t=.25},
    ds(e,dt){const el=e.k=='dog2';e.pz='s';const lo=e.zi>=0?zLo(e):ARL,hi=e.zi>=0?ZB[e.zi]:ARR,nx=e.x+e.f*(el?500:540)*dt;
      if(nx<lo+2||nx+e.w>hi-2){if(!el){e.x=Math.max(lo,Math.min(hi-e.w,nx));e.f*=-1;mvEnd(e,.9,.5);return}e.f*=-1;e.bn++;e.hd=0;shake=Math.max(shake,.12);sfx('boom');burst(e.f<0?e.x+e.w:e.x,e.y+e.h/2,12,['#fff','#d0ebff'],180,{s:3,l:.35})}else e.x=nx;
      if(Math.random()<dt*30)pt({x:e.x+e.w/2-e.f*12,y:GY-2,vx:-e.f*rnd(40,110),vy:rnd(-60,-15),c:'#fff',ad:0,s:rnd(2,3.4),l:.35});
      if(!e.hd&&mvHit(e,{x:e.x,y:e.y+e.h*.25,w:e.w,h:e.h*.75},el?12:9,{kb:e.f*(el?460:380)}))e.hd=1;
      if(el?(e.bn>=3||e.t>3.2):e.t>.42)mvEnd(e,el?1.3:.9,.5)},
    bt(e,dt){e.pz=(e.t<.26||(e.t>.44&&e.t<.58))?'w':'s';for(let i=0;i<2;i++)if(e.t>=.28+i*.32&&e.pn==i){e.pn++;sfx('peck');if(i==1)e.x+=e.f*16;mvHit(e,{x:e.f>0?e.x+e.w-8:e.x-26,y:e.y-4,w:34,h:e.h+6},6,{inv:.18})}if(e.t>.95)mvEnd(e,.9,.5)},
    db(e,dt,dx){e.pz=e.t<.5?'w':'s';if(e.t>=.5&&!e.hd){e.hd=1;sfx('eatk');for(const d of [-1,1])burst(d>0?e.x+e.w+10:e.x-10,e.y+8,6,['#fff','#ced4da'],140,{sh:1,s:2,l:.2});mvHit(e,{x:e.x-34,y:e.y+2,w:e.w+68,h:e.h-2},11,{kb:sgn(dx)*300})}if(e.t>.85)mvEnd(e,1.3,.5)},
    sp(e,dt){e.pz=e.t<.55?'w':'s';if(e.t>=.55&&e.t<1.25&&!e.hd){const len=Math.min(1,(e.t-.55)/.2)*95;for(const d of [-1,1]){const x0=d>0?e.x+e.w:e.x-len;if(mvHit(e,{x:x0,y:e.y-22,w:len,h:e.h+22},7)){e.hd=1;slowP(1.6);break}}}if(e.t>1.45)mvEnd(e,1.3,.5)},
    howl(e,dt){e.pz='w';if(e.t>.5&&!e.hd){e.hd=1;e.cd2=12;sfx('roar');ring(e.x+e.w/2,e.y+e.h/2,6,60,'#a5d8ff',.4,5);for(const o of E)if((o.k=='dog'||o.k=='dog2')&&o.hp>0&&!o.bst&&Math.abs(o.x-e.x)<260){o.bst=5;o.dm0=o.dm;o.dm=o.dm*1.3;tx('攻击↑',o.x+o.w/2,o.y-16,'#ff8787')}tx('嚎叫',e.x+e.w/2,e.y-18,'#a5d8ff')}if(e.t>.8)mvEnd(e,1)}}};
MVK.dog.mv.rs=MVK.dog.mv.ds;MVK.dog2=MVK.dog;
// 怪物此刻是否在"出招":不出招时身体碰到不会掉血
function atkOn(e){if(e.ca>0)return true;if(MVK[e.k])return false;switch(e.k){
  case 'slime':case 'bat':case 'skel':return e.sw>0;
  case 'snake':case 'ysco':case 'bsco':return e.lg>0;
  case 'ape':return !e.gr&&!!e.ap;
  case 'king':return e.act=='charge'&&e.at>=.6;
  case 'boss':return e.act=='charge'&&e.at>=.8;
  default:return false}}
const atkBox=e=>e.sw>0?{x:e.x-6,y:e.y-4,w:e.w+12,h:e.h+8}:e;
function forceAtk(e){tx('霸体·反击!',e.x+e.w/2,e.y-18,'#ff922b');const dx=P.x+12-(e.x+e.w/2),f=sgn(dx);
  if(MVK[e.k]){if(!e.s){e.cd=0;e.rec=0}if(e.x+e.w>cam&&e.x<cam+VW)sfx('eatk');return}
  switch(e.k){case 'snake':case 'ysco':case 'bsco':e.f=f;e.lg=0;e.rec=0;e.wu2=.35;e.lc=1.4;break;
    case 'spi':e.s='pw';e.t=.4;break;
    case 'ost':e.f=f;if(Math.abs(dx)<70){e.s='pk';e.t=0;e.pn=0}else{e.s='cw';e.t=.3;e.hd=0}break;
    case 'ape':e.f=f;if(e.gr){e.rec=0;e.wu2=.35}break;
    case 'mage':e.fire=Math.min(e.fire,.6);break;
    case 'boss':case 'king':case 'sco':case 'andr':case 'bear':case 'wiz':if(!e.act)e.cd=0;break;
    case 'dog':case 'dog2':if(!e.s)e.cd=0;break;
    case 'gfly':case 'gfly2':case 'gland':case 'gland2':if(!e.s&&!e.dis)e.cd=0;break;case 'yin':case 'lava':case 'ham':if(!e.act)e.cd=0;break;case 'cradle':case 'lclone':break;
    case 'imp':case 'fwisp':case 'golem':case 'oni':if(!e.s)e.cd=0;break;case 'wimp':case 'eye':if(!e.s)e.cd=0;break;case 'gbot':case 'zdr':case 'tank':case 'skw':case 'gob':case 'nwz':case 'fwm':case 'mmt':case 'fsm':case 'nja':case 'nsh':case 'ron':case 'ckb':case 'ckr':case 'rsh':case 'rtu':case 'ifa':case 'ifs':if(!e.s)e.cd=0;break;case 'mech':case 'nk':case 'fk':case 'nb':case 'alm':case 'rgn':case 'ifg':case 'baal':case 'dagon':case 'molo':if(!e.act)e.cd=0;break;case 'swing':break;case 'gui':if(!e.act&&e.intro==2)e.cd=0;break;
    case 'pen':case 'pen2':case 'seal':case 'seal2':if(!e.s){e.cd=0;e.rec=0}break;
    default:e.f=f;e.sw=0;e.rec=0;e.wu=.35;e.acd=1.6}
  if(e.x+e.w>cam&&e.x<cam+VW)sfx('eatk')}
