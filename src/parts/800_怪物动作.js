// ===== 第二十五轮:首领前摇按招式区分(预警全部去掉了,看动作判断是哪一招)=====
// 10 种前摇:rear 后仰蓄力(正面重击)· crouch 下蹲(跳 / 砸地 / 从脚下炸开)· back 后撤刨地(冲撞 / 俯冲)· rise 拉高上浮(天上落下来的招)·
// roar 鼓起狂抖(怒吼 / 强化 / 全场爆)· aim 前探瞄准(飞弹 / 吐息)· sink 下沉(从地里钻出来的招)· sway 左右大摇摆(横扫 / 贴地横穿)·
// spin 原地转身(瞬移 / 漩涡 / 弹幕环)· hop 原地跳动(连续落点 / 召唤)
const BWS={
  rear:(o,n)=>{o.lean=-.24+Math.sin(n*55)*.03;o.sx=1.09;o.sy=.88;o.dx=-3+Math.sin(n*70)*1.2},
  crouch:(o,n)=>{o.sx=1.2;o.sy=.7+Math.sin(n*30)*.025;o.dx=Math.sin(n*60)*.8},
  back:(o,n)=>{o.lean=.2;o.sx=1.06;o.sy=.9;o.dx=-7-Math.abs(Math.sin(n*14))*5},
  rise:(o,n)=>{o.lean=Math.sin(n*5)*.05;o.sx=.86;o.sy=1.2;o.dy=-8-Math.sin(n*9)*3},
  roar:(o,n)=>{const q=Math.sin(n*40);o.sx=1.14+q*.07;o.sy=1.14-q*.07;o.dx=Math.sin(n*90)*2.5},
  aim:(o,n)=>{o.lean=.13+Math.sin(n*7)*.04;o.sx=1.05;o.sy=.95;o.dx=4},
  sink:(o,n)=>{o.sx=1.12;o.sy=.8;o.dy=8+Math.sin(n*24)*1.5},
  sway:(o,n)=>{o.lean=Math.sin(n*10)*.24;o.sx=1.04;o.sy=.96},
  spin:(o,n)=>{const c=Math.cos(n*15);o.sx=Math.abs(c)<.15?.15*Math.sign(c||1):c;o.sy=1.04},
  hop:(o,n)=>{const q=Math.abs(Math.sin(n*12));o.dy=-q*11;o.sy=.88+q*.16;o.sx=1.1-q*.12}};
function bwPose(o,f,n){f(o,n)}
const BWP={
  boss:{slam:'rear',charge:'back',leap:'crouch',stomp:'hop',roar:'roar'},
  mage:{volley:'aim',rain:'rise',chain:'rear',field:'sink',mirror:'spin'},
  king:{bite:'rear',charge:'back',spit:'aim',tail:'sway',shed:'rise',buff:'roar'},
  sco:{combo:'rear',claw:'rear',sweep:'sway',sting:'aim',burrow:'sink',buff:'roar'},
  andr:{wake:'roar',rise:'rise',gys:'crouch',ring:'spin',orb:'aim',pull:'sway',sink:'sink',storm:'roar'},
  bear:{paw:'rear',slam:'rise',combo:'rear',charge:'back',ball:'aim',skate:'crouch',roar:'roar',hug:'sway',pillars:'sink',aval:'hop',bliz:'spin'},
  wiz:{fan:'aim',col:'sink',tp:'spin',barr:'rear',rain:'rise',imp:'crouch',pack:'hop',thorn:'sway',rite:'roar',morph:'roar'},
  yin:{tpc:'spin',lane:'sway',cage:'sink',tear:'rise',echo:'roar',palm:'rear'},
  lava:{brth:'aim',spout:'hop',hunt:'sink',met:'rise',tsu:'sway',crs:'crouch',nova:'roar'},
  gui:{swoop:'back',fan:'aim',pull:'spin',fth:'roar',xb:'rise',ecl:'crouch'},
  ham:{eat:'hop',shell:'crouch',trap:'sink',throw:'aim'},
  nmr:{chg:'back',stp:'crouch',skl:'roar',nova:'rise'},dmn:{brth:'aim',rain:'rise',dive:'back',hnd:'roar',ecl:'aim'},mech:{msl:'rise',gun:'aim',jmp:'crouch',call:'roar'},nk:{cmb:'aim',dash:'back',leap:'crouch',roar:'rise'},fk:{brth:'aim',rain:'rise',wave:'crouch',nova:'roar',tele:'back'},nb:{kun:'aim',dash:'back',tp:'back',iai:'aim',aoe:'rise',cln:'roar'},alm:{ring:'roar',hop:'crouch',bolt:'aim',fire:'rise',call:'roar',sea:'rise',morph:'rise'},rgn:{gun:'aim',art:'rise',beam:'aim',drain:'roar',ctr:'crouch',bstep:'back'},ifg:{slam:'rise',quake:'roar',rain:'rise',pillar:'aim',rush:'back',stomp:'crouch'},baal:{cleave:'rise',leap:'crouch',meteor:'rise',wave:'roar',crown:'rise'},dagon:{beam:'aim',lash:'aim',tide:'rise',rain:'rise',dive:'back'},molo:{chop:'rise',charge:'back',altar:'roar',quake:'crouch',brand:'rise'},asmo:{kiss:'aim',tether:'roar',tide:'rise',combo:'aim',step:'back',rain:'rise'},beli:{lie:'rise',guard:'crouch',ride:'back',judge:'rise',combo:'aim'},asta:{breath:'aim',fore:'rise',sweep:'rise',quake:'crouch'},belz:{slash:'aim',spit:'aim',egg:'crouch',blink:'rise',dash:'back',devour:'roar'},mamm:{swing:'rise',smash:'crouch',burst:'rise',ramp:'rise',leap:'crouch',rain:'roar'},levi:{combo:'aim',arc:'rise',blade:'aim',trap:'crouch',roll:'back',abyss:'roar'},pfg:{cleave:'rise',slam:'crouch',rain:'roar',pillar:'rise'}};
// ===== 怪物动作(冒险岛式):走路一颠一颠、出招前后仰蓄力(压扁)、出招时前扑拉长、收招回弹、挨打后仰 =====
const MWUP={king:{bite:[.5,.75],charge:[.6,9],spit:[.5,.7],buff:[.5,.8],tail:[.5,.7],shed:[.8,1]},sco:{claw:[.45,.65],sweep:[.4,.65],sting:[.6,.75],buff:[.5,.8]}};
function monPose(e,t){const now=performance.now()/1000,o={lean:0,sx:1,sy:1,dy:0},big=e.max?.45:1;
  const mv=Math.abs(e.x-(e.pdx==null?e.x:e.pdx));e.pdx=e.x;e.mvs=(e.mvs||0)*.8+(mv>.15?1:0)*.2;
  if(e.fire!=null){if(e.pf!=null&&e.fire>e.pf+.1)e.shotAt=now;e.pf=e.fire}
  let wu=0,sk=0;const cus='pz' in e,ca=e.act=='combo'&&e.cact?e.cact:e.act,cat=e.act=='combo'&&e.cact?e.cat:e.at;
  if(cus&&e.pz=='w')wu=1;else if(cus&&e.pz=='s')sk=1;else if(cus&&!MWUP[e.k]);  // 第二十五轮:蛇王 / 巨蝎设过 pz 以后也继续按 MWUP 判断
  else if(e.wu>0||e.wu2>0)wu=1;else if(e.sw>0||e.lg>0)sk=1;
  else if(e.s=='pw'||e.s=='cw'||e.s=='kw'||(e.s=='sp'&&e.t>0))wu=1;else if(e.s=='pj'||e.s=='ch'||e.s=='kk'||(e.s=='pk'&&e.t>=.4))sk=1;
  else if(MWUP[e.k]&&ca){const w=MWUP[e.k][ca];if(w){if(cat<w[0])wu=1;else if(cat<w[1])sk=1}}
  else if(e.k=='mage'&&e.fire<.55&&!(e.tpT>0))wu=1;
  if(e.shotAt&&now-e.shotAt<.22)sk=Math.max(sk,.8);
  if(e.max&&BWOFF&&!sk&&GT-(e.bwT??-9)<.15)wu=1;  // 第二十四轮:本来要显示预警的时候,首领一定在做前摇
  if(e.max&&BWOFF&&e.act&&!sk&&!e.ug&&e.at<.4)wu=1;  // 第二十五轮:每招开头至少 0.4 秒前摇动作
  const bwk=e.max&&BWOFF&&wu?1.8:1;  // 没有预警了,首领前摇幅度加大
  if(e.max&&BWOFF&&wu&&!(e.st>0)){bwPose(o,BWS[(BWP[e.k]||{})[e.act]]||BWS.rear,now);e._wu=1;e._sk=0;return o}  // 第二十五轮:不同招式不同前摇(挨打也不打断)
  if(e.k=='ape'&&!e.gr&&e.ap){o.lean=.25;o.sx=1.08;o.sy=.94}
  else if(e.hst>0||e.st>0){const q=Math.min(1,Math.max(e.hst>0?e.hst/HSTUN:0,e.st>0?e.st/.3:0)),hb=e.max?.55:1,j=e.hst>0?Math.sin(now*70)*.6*q:0;o.lean=-.28*q*hb;o.sx=1-.08*q*hb;o.sy=1+.05*q*hb;o.dy=-j*hb}  // 挨打后仰(第十三轮起首领也有,幅度小一点)
  else if(wu){const tr=Math.sin(now*55)*.025*bwk;o.lean=(-.17*bwk+tr)*big;o.sx=1+.1*big*bwk;o.sy=1-.13*big*bwk;if(bwk>1)o.dx=Math.sin(now*70)*1.2}
  else if(sk){o.lean=.2*big*sk;o.sx=1+.16*big*sk;o.sy=1-.09*big*sk}
  else if(e.rec>0){o.lean=-.06*big;o.sy=.96}
  else if(!cus&&e.mvs>.3&&!e.air&&e.k!='bat'&&e.k!='slime'){const ph=now*13+(e.ph||0);o.dy=-Math.abs(Math.sin(ph))*2.2*big;o.lean=.05*big+Math.sin(ph)*.04*big;o.sy=1+Math.abs(Math.sin(ph))*.04}
  else{o.sy=1+Math.sin(now*3+(e.ph||0))*.025}
  e._wu=wu;e._sk=sk;return o}
// 怪物飞弹(卡通火球 / 魔法球 / 毒液 / 蛛丝)和主角法术弹
function drawShot1(f,t){const s=f.s||1,fx=f.x-cam,fy=f.y,sp=Math.hypot(f.vx,f.vy)||1,dx=-f.vx/sp,dy=-f.vy/sp;
    if(FX29.shot(f,fx,fy,t))return;  // 第二十九轮:圆球换成花样特效
    if(f.c==24&&MECH.shot(f,fx,fy,t))return;if(f.c>=17&&ARS.shot(f,fx,fy,t))return;if(f.c==8&&GH8.fire(f,fx,fy,t))return;if(f.c==9&&VOL9.fire(f,fx,fy,t))return;if((f.c==10||f.c==12||f.c==13)&&SHIP10.fire(f,fx,fy,t))return;if(BFX.shot(f,fx,fy,t))return;
    if(f.c==14){VFX.frame(x,'z-rock',0,fx,fy,.55*s,1,t*6,1);return}  // 第十六轮:猿的石块 = BFX2 落石(Floor Effects,hernandack,CC0)
    if(f.c==16){VFX.frame(x,'m-dust',Math.floor(t*12+fx)%4,fx,fy,.6*s,1,0,.9);return}  // 鸵鸟踢起的沙团 = 烟尘帧
    if(f.c==15){x.save();x.filter='brightness(2.6) sepia(.35)';SHIP10.fr(x,'shard',Math.floor(t*10),fx-7,fy-7,1,1);x.restore();return}  // 骷髅兵的骨片 = 幽灵船碎片帧
    if(f.c>=5){// 第六关:冰块(旋转的冰晶)· 大雪球 · 贴地冰球
      if(f.c==6){const r=8*s;if(KB.ball(x,fx,fy,r/14,t*8*sgn(f.vx)))return;C_(x,fx,fy,r,RGD(x,fx-r*.3,fy-r*.3,r*1.3,['#ffffff','#e7f0fa','#a9c6e2']),1.4);for(const [a,b,rr] of [[-.3,.2,.22],[.35,-.25,.16],[.1,.45,.14]])C_(x,fx+a*r,fy+b*r,rr*r,'rgba(160,190,220,.55)',0);return}
      x.save();x.translate(fx,fy);x.rotate(t*(f.c==7?14*sgn(f.vx):8));if(f.c==7){C_(x,0,0,7,RGD(x,-2,-2,8,['#ffffff','#a5d8ff','#4dabf7']),1.2);LN_(x,[[-4,0],[4,0]],'#fff',1.2);LN_(x,[[0,-4],[0,4]],'#fff',1.2)}
      else PG(x,[[0,-7],[6,0],[0,7],[-6,0]],LG(x,0,-7,0,7,['#ffffff','#a5d8ff','#4dabf7']),1.2);x.restore();return}
    const P_={undefined:['#ff922b','#ffe066','#e8590c',8],1:['#9b4dff','#f3d9fa','#5f3dc4',7],2:['#7048e8','#d0bfff','#3b1f8f',10],3:['#40c057','#d3f9d8','#2b8a3e',7],4:['#f1f3f5','#ffffff','#adb5bd',6]}[f.c]||['#ff922b','#ffe066','#e8590c',8],r=P_[3]*s;
    x.save();x.globalCompositeOperation='lighter';C_(x,fx,fy,r*2,RGD(x,fx,fy,r*2,[P_[0]+'cc','rgba(0,0,0,0)']),0);x.restore();
    if(f.c==4){for(let i=0;i<6;i++){const a=i*Math.PI/3+t*2;LN_(x,[[fx,fy],[fx+Math.cos(a)*r*1.3,fy+Math.sin(a)*r*1.3]],'#f1f3f5',1)}C_(x,fx,fy,r*.7,'#fff',1);return}
    if(f.c!=3){x.beginPath();x.moveTo(fx+dy*r,fy-dx*r);x.quadraticCurveTo(fx+dx*r*3.2,fy+dy*r*3.2,fx-dy*r,fy+dx*r);x.closePath();x.globalAlpha=.75;FS_(x,P_[0],0);x.globalAlpha=1}
    C_(x,fx,fy,r,RGD(x,fx-r*.3,fy-r*.3,r*1.2,[P_[1],P_[0],P_[2]]),1.2);C_(x,fx-r*.35,fy-r*.35,r*.28,'rgba(255,255,255,.85)',0);
    if(f.c==1||f.c==2){for(let i=0;i<4;i++){const a=t*6+i*1.57;C_(x,fx+Math.cos(a)*r*1.4,fy+Math.sin(a)*r*1.4,1.2*s,'#f3d9fa',0)}}}
// 第二十六轮:怪物飞弹画面放大(小怪 ×SHVM、首领身边发出的 ×SHVB),判定半径 ×SHHK;贴地紫条(c==2)不放大
const SHVM=1.6,SHVB=1.9,SHHK=1.25,SHX={3:1.6,15:1.5,16:1.4},SHC={1:'190,120,255',2:'170,140,255',3:'120,255,120',4:'230,240,255',5:'200,230,255',6:'230,240,255',7:'170,220,255',8:'120,255,220',9:'255,150,60',14:'255,220,160',15:'255,255,230',16:'255,230,170',17:'255,200,100',18:'150,220,255',19:'255,90,90'};
function drawShots(){const t=performance.now()/1000;
  for(const f of F){const fx=f.x-cam,fy=f.y,k=(f.mb===false?SHVB:SHVM)*(SHX[f.c]||1),hc=SHC[f.c]||'255,200,120';if(!FX29.of(f)){const r=12*(f.s||1)*k;x.save();x.globalCompositeOperation='lighter';C_(x,fx,fy,r,RGD(x,fx,fy,r,['rgba('+hc+',.75)','rgba('+hc+',.3)','rgba(0,0,0,0)']),0);x.restore()}  // 亮色光晕,深色背景上也看得清
   if(f.c==2)RR(x,fx-12*(f.s||1)*k,GY-3,24*(f.s||1)*k,3,1.5,'rgba(190,75,219,.85)',0);
    x.save();x.translate(fx,fy);x.scale(k,k);x.translate(-fx,-fy);drawShot1(f,t);x.restore()}
  for(const b of PB){const bx=b.x-cam,d=sgn(b.vx);if(VFX.shot(b,bx,d,t))continue;
    if(b.wv){x.save();x.globalCompositeOperation='lighter';const A=v=>d>0?v:Math.PI-v,st=A(-1.25),en=A(1.25),ccw=d<0;
      for(let k=3;k>=0;k--){const ox=bx-d*k*16-d*22;x.globalAlpha=k?.28/k:1;x.strokeStyle='#ffd43b';x.lineWidth=14;x.beginPath();x.arc(ox,b.y,30,st,en,ccw);x.stroke();x.strokeStyle='#fff3bf';x.lineWidth=6;x.beginPath();x.arc(ox,b.y,30,st,en,ccw);x.stroke()}x.restore()}
    else if(b.fb){x.save();x.globalCompositeOperation='lighter';C_(x,bx,b.y,34,RGD(x,bx,b.y,34,['rgba(255,200,80,.9)','rgba(255,100,40,.45)','rgba(0,0,0,0)']),0);x.restore();
      x.beginPath();x.moveTo(bx,b.y-13);x.quadraticCurveTo(bx-d*40,b.y+Math.sin(t*30)*4,bx,b.y+13);x.closePath();FS_(x,LG(x,bx-d*40,0,bx,0,['rgba(255,107,53,0)','#ff6b35']),0);
      C_(x,bx,b.y,13,RGD(x,bx-3,b.y-3,15,['#fff9db','#ffd43b','#ff6b35','#c92a2a']),1.4);E_(x,bx+d*3,b.y-2,2,3,'#3a1d0a',0);E_(x,bx+d*8,b.y-2,1.8,2.8,'#3a1d0a',0)}
    else{const r=b.r,col=b.col||(b.big?'#cc5de8':'#4dabf7');x.save();x.globalCompositeOperation='lighter';C_(x,bx,b.y,r*2.4,RGD(x,bx,b.y,r*2.4,[col+'cc','rgba(0,0,0,0)']),0);x.restore();
      x.beginPath();x.moveTo(bx,b.y-r);x.quadraticCurveTo(bx-d*r*4,b.y,bx,b.y+r);x.closePath();x.globalAlpha=.6;FS_(x,col,0);x.globalAlpha=1;
      C_(x,bx,b.y,r,RGD(x,bx-r*.3,b.y-r*.3,r*1.2,['#ffffff',col]),1.1);const a=t*8;PG(x,[0,1,2,3,4,5,6,7].map(i=>{const rr=i%2?r*.3:r*.75,q=a+i*Math.PI/4;return [bx+Math.cos(q)*rr,b.y+Math.sin(q)*rr]}),'#fff',0)}}}
// 回血道具:小红药瓶
function drawPickups(){const t=performance.now()/1000;for(const i of I){const px=i.x-cam+7,py=i.y+7+Math.sin(t*4+i.x)*2;
  x.save();x.globalCompositeOperation='lighter';C_(x,px,py,12,RGD(x,px,py,12,['rgba(255,135,135,.6)','rgba(0,0,0,0)']),0);x.restore();
  RR(x,px-2.2,py-9,4.4,4,1,'#c08a4a',1);C_(x,px,py,6.4,RGD(x,px-2,py-2,7,['#ffc9c9','#fa5252','#c92a2a']),1.2);E_(x,px-2,py-2,1.6,2.2,'rgba(255,255,255,.8)',0)}}
// 召唤物重绘(飞鸟 / 藤蔓)
function drawSM(){const t=performance.now()/1000;
  const bar=s=>{if(s.hp<s.max){RR(x,s.x-cam-2,s.y-9,s.w+4,4,2,'#2b1a12',0);RR(x,s.x-cam-1,s.y-8,(s.w+2)*Math.max(0,s.hp)/s.max,2,1,'#51cf66',0)}};
  PXL.run(()=>{const b=SM.bird;if(b&&!(b.t<2&&Math.floor(t*8)%2)){x.globalAlpha=b.inv>.45?.55:1;SMN.fr(x,'b',Math.floor(t*(b.st=='dive'?14:10))%6,b.x+b.w/2-cam,b.y+b.h/2,1,b.f);x.globalAlpha=1;bar(b)}
    const v=SM.vine;if(v&&!(v.t<2&&Math.floor(t*8)%2)){const bx=v.x+10-cam;x.globalAlpha=v.inv>.45?.55:1;
      if(v.wh>0)SMN.fr(x,'pa',Math.min(6,Math.floor((1-v.wh/.3)*7)),bx,GY,1.5,v.f,v.gw);else SMN.fr(x,'pi',Math.floor(t*6)%4,bx,GY,1.5,v.f,v.gw);x.globalAlpha=1;bar(v)}
    SMX=SMX.filter(q=>(q.t+=1/60)<.9);for(const q of SMX)SMN.fr(x,'pd',Math.min(9,Math.floor(q.t/.09)),q.x-cam,GY,1.5,q.f)},!!(SM.bird||SM.vine||SMX.length))}  // 第五十一轮:没有召唤物时跳过这一层

// =====================================================================
