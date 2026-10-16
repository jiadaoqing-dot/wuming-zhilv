// ===== 首领攻击像素化(2026-10-12 第二版):特效全部来自 BFX2 图集(art_src/bfx/build_bfx2.py,素材见那个脚本开头)=====
// 地面预警 DZ:符文圆环(Earth Impact,Cethiel,CC0)染红压扁;落石 BTA:灰石块(Floor Effects,hernandack,CC0)换沙岩色;
// 沙浪:Tornado(devnewton,CC0)换沙黄;冰刺:Freeze Spell(Clint Bellanger,CC-BY 3.0);蝎王毒柱:Pixel FX Pack(CodeManu,CC0)
// 第二十四轮:首领不再显示攻击范围 / 预警(地面红色符文带 DZ.zone、瞄准圈 DZ.mark、头顶感叹号 WARN、各种预警线),玩家看首领的前摇动作自己预判。
// BWQ=1 期间(画首领本体、首领招式效果时)这些预警不画,改成记下 bwT,首领本体在 monPose 里做蓄力前摇(后仰 + 压扁 + 发抖,幅度比原来大)。BWOFF=0 可恢复预警
const BWOFF=1;let BWQ=0,BWE=null;
function bwHit(){const e=BWE||B;if(e)e.bwT=GT}
function bwSkip(){if(BWOFF){if(BWQ)bwHit();return true}return false}  // 第二十五轮:小怪、关卡机关的预警也一律不画
function BW(f){const q=BWQ;BWQ=1;try{f()}finally{BWQ=q}}
const DZ={
  // 地面预警魔法阵:sx = 屏幕左边,w = 宽度。宽的区域排成一串圆环
  zone(sx,w){if(bwSkip())return;const m=VFX.M['z-rune'],I=VFX.I4;if(!I||!m)return;const t=performance.now()/1000,i=Math.floor(t*m.fps)%m.n,W=Math.max(12,Math.round(w)),n=Math.max(1,Math.round(W/60)),cw=W/n;
    x.save();x.imageSmoothingEnabled=false;x.globalAlpha*=.8+.2*Math.sin(t*20);
    for(let k=0;k<n;k++){const X=Math.round(sx+k*cw);x.drawImage(I,((i+k)%m.n)*m.w,m.y,m.w,m.h,X,GY-9,Math.round(cw),18)}
    x.globalCompositeOperation='lighter';x.globalAlpha*=.45;for(let k=0;k<n;k++)x.drawImage(I,((i+k+4)%m.n)*m.w,m.y,m.w,m.h,Math.round(sx+k*cw),GY-9,Math.round(cw),18);x.restore()},
  // 小号瞄准标记(圆形,中心在 cx,cy)
  mark(cx,cy,r){if(bwSkip())return;const m=VFX.M['z-rune'],I=VFX.I4;if(!I||!m)return;const t=performance.now()/1000,i=Math.floor(t*m.fps)%m.n;
    x.save();x.imageSmoothingEnabled=false;x.globalAlpha*=.75+.25*Math.sin(t*16);x.drawImage(I,i*m.w,m.y,m.w,m.h,Math.round(cx-r),Math.round(cy-r),Math.round(2*r),Math.round(2*r));x.restore()}};
const BTA={
  // 落石:画在屏幕坐标,cx = 中心,by = 底边(放大 1.5 倍)
  spr(k,cx,by,a){const m=VFX.M['z-rock'],I=VFX.I4;if(!I||!m)return;const w=Math.round(m.w*1.5),h=Math.round(m.h*1.5);x.save();x.imageSmoothingEnabled=false;if(a!=null)x.globalAlpha*=a;x.drawImage(I,0,m.y,m.w,m.h,Math.round(cx-w/2),Math.round(by-h),w,h);x.restore()}};
// =====================================================================
// ===== 第六关 · 极寒雪山:冰面滑行、落雪、裂冰、冰墙;企鹅 / 海豹 / 北极熊 =====
// =====================================================================
// 平台:ice = 冰面(会滑),crk = 裂冰(踩 3 次或站 1.6 秒后裂开,1.2 秒后坍塌,7 秒后重新冻上)
const PL6=[{x:0,y:GY,w:WW},{x:420,y:236,w:120,ice:1},{x:660,y:196,w:100},{x:930,y:230,w:130,ice:1},{x:1190,y:186,w:110},{x:1440,y:150,w:100,crk:1},{x:1660,y:210,w:120,crk:1,ice:1},{x:1900,y:172,w:110,crk:1},{x:2150,y:226,w:120,ice:1,crk:1},{x:2380,y:190,w:100,crk:1}];
const E6=Array.from({length:28},(_,i)=>[i%4==3?(i%8==3?'pen2':'seal2'):i%4==1?'seal':'pen',360+i*80]);
const ICE6=[[480,880],[1280,1700],[1980,2420],[2700,3060]];  // 地面上的冰面区域
const IB6=[{x:745,h:44},{x:1190,h:40},{x:1625,h:48},{x:2065,h:44},{x:2480,h:40}];  // 冰墙(宽 30,可以跳上去站着)
const IBW=30;
let SNW={t:4,L:[]};  // 落雪
const iceAt=xx=>cur==6&&ICE6.some(r=>xx>r[0]&&xx<r[1]);
// 实心检测:冰墙、关卡边界、首领战的左右墙。返回 1 / 冰墙对象 / null
// 区域边界:小怪(非首领、非召唤)不能离开自己的区域;第六关的滑行 / 雪球把边界当成墙
const zLo=e=>0,zHi=e=>ZB[e.zi];  // 第二十五轮:一~七关也放开(原来玩家退回上一段时,小怪卡在区域边界上不动)  // 第八~十关(2026-10-13 第十二轮):小怪可以追出自己的区域(往回追玩家)
const zWall=(e,nx)=>!e.max&&e.zi>=0&&(nx<zLo(e)+1||nx+e.w>zHi(e)-1);
function zClampAll(){for(const e of E)if(!e.max&&e.zi>=0&&e.hp>0){const lo=zLo(e),hi=zHi(e);if(e.x<lo)e.x=lo;if(e.x+e.w>hi)e.x=hi-e.w}}
function solidAt(xl,xr,yb){if(xl<0||xr>WW)return 1;if(bossOn&&cur>=5&&(xl<ARL||xr>ARR))return 1;if(cur!=6)return null;
  for(const b of IB6)if(xr>b.x&&xl<b.x+IBW&&(yb==null||yb>GY-b.h+2))return b;return null}
// 地面怪物撞到冰墙:推出去并掉头
function blkPush(e){if(cur!=6||e.ug||e.air)return 0;for(const b of IB6)if(e.x+e.w>b.x&&e.x<b.x+IBW&&e.y+e.h>GY-b.h+2){if(e.x+e.w/2<b.x+IBW/2)e.x=b.x-e.w;else e.x=b.x+IBW;e.f*=-1;return 1}return 0}
function lv6Plats(){return PL6.map(p=>({...p})).concat(IB6.map(b=>({x:b.x,y:GY-b.h,w:IBW,blk:1,ice:1})))}
// 玩家:冰墙横向阻挡 + 裂冰计数
function lv6Player(dt){
  for(const b of IB6)if(P.x+P.w>b.x&&P.x<b.x+IBW&&P.y+P.h>GY-b.h+3){if(P.x+P.w/2<b.x+IBW/2)P.x=b.x-P.w;else P.x=b.x+IBW;P.ivx=0}
  const on=P.gr?P.onP:null;
  for(const p of PL){if(!p.crk)continue;
    if(p.gone){p.rt-=dt;if(p.rt<=0){p.gone=0;p.cs=0;p.n=0;p.ot=0;burst(p.x+p.w/2,p.y,10,['#e7f5ff','#a5d8ff'],120,{s:2,l:.4})}continue}
    if(on===p){if(P.lastOn!==p){p.n=(p.n||0)+1;if(!p.cs&&p.n<3)burst(P.x+12,p.y,5,['#e7f5ff','#fff'],90,{s:2,l:.3,g:300})}p.ot=(p.ot||0)+dt;if(!p.cs&&(p.n>=3||p.ot>1.6)){p.cs=1;p.ct=1.2;sfx('zap');tx('冰面裂开了!',p.x+p.w/2-20,p.y-14,'#a5d8ff')}}
    else p.ot=Math.max(0,(p.ot||0)-dt*.5);
    if(p.cs){p.ct-=dt;if(p.ct<=0){p.gone=1;p.rt=7;sfx('boom');shake=Math.max(shake,.12);for(let i=0;i<14;i++)pt({x:p.x+rnd(0,p.w),y:p.y+rnd(0,12),vx:rnd(-60,60),vy:rnd(-60,40),g:900,c:pick(['#d0ebff','#a5d8ff','#fff']),ad:0,s:rnd(3,6),l:rnd(.8,1.2)});if(on===p){P.gr=false}}}}
  P.lastOn=on}
// 落雪:屏幕上方先飘雪花 + 地面红色预警,1.1 秒后大团积雪砸下来;怪物被砸到伤害很高并被压住,可以拿来压制怪物
function snowStep(dt){if(cur!=6||bossOn)return;SNW.t-=dt;
  if(SNW.t<=0){SNW.t=rnd(3.6,5.6);const ahead=E.filter(e=>!e.ug&&Math.abs(e.x-P.x)<320&&e.x>cam&&e.x<cam+VW).sort((a,b)=>Math.abs(a.x-P.x)-Math.abs(b.x-P.x))[0];
    const sx=ahead&&Math.random()<.65?ahead.x+ahead.w/2:P.x+12+P.f*rnd(40,180);SNW.L.push({x:Math.max(40,Math.min(WW-40,sx)),w:74,t:0})}
  for(const z of SNW.L){z.t+=dt;if(z.t>=1.1&&!z.h){z.h=1;shake=Math.max(shake,.15);sfx('boom');const lo=z.x-z.w/2,hi=z.x+z.w/2;
      for(let i=0;i<16;i++)pt({x:z.x+rnd(-z.w/2,z.w/2),y:GY-rnd(4,30),vx:rnd(-120,120),vy:rnd(-220,-60),g:700,c:pick(['#fff','#e7f5ff','#d0ebff']),ad:0,s:rnd(3,6),l:rnd(.6,1)});
      if(P.x+P.w>lo&&P.x<hi&&hurt(9*LDM))slowP(1.2);
      for(const e of E)if(!e.ug&&e.x+e.w>lo&&e.x<hi){xDeal(e,Math.max(Math.round(e.hp0*.35),Math.round(stats().atk*1.5)));e.st=Math.max(e.st||0,1.3);e.s=e.s=='hid'?e.s:null;tx('被雪埋住了!',e.x+e.w/2,e.y-18,'#d0ebff')}}}
  SNW.L=SNW.L.filter(z=>z.t<2.4)}
function snowDraw(){if(cur!=6)return;const t=performance.now()/1000;
  for(const z of SNW.L){const zx=z.x-cam;if(zx<-80||zx>VW+80)continue;
    if(ICE6P.on()){x.save();x.imageSmoothingEnabled=false;
      if(z.t<1.1){DZ.zone(zx-z.w/2,z.w);if(!BWOFF)for(let i=0;i<8;i++)R(Math.round(zx-z.w/2+((i*29+t*30)%z.w)),Math.round((t*120+i*47)%(GY*.8)),3,3,'#fff');WARN(x,zx,GY-22,.8)}
      else if(z.t<1.3){const k=(z.t-1.1)/.2,yb=-40+k*(GY+10);ICE6P.spr('clump',zx-38,yb-34)}
      else{x.globalAlpha=Math.max(0,1-(z.t-1.3)/1.1);ICE6P.spr('pile',zx-44,GY-28)}
      x.restore();continue}
    if(z.t<1.1){DZ.zone(zx-z.w/2,z.w);
      for(let i=0;i<8;i++)C_(x,zx-z.w/2+((i*29+t*30)%z.w),((t*120+i*47)%(GY*.8)),2.2,'#fff',0);WARN(x,zx,GY-22,.8)}
    else if(z.t<1.3){const k=(z.t-1.1)/.2,yb=-40+k*(GY+10);SMO(x,[[zx-z.w/2,yb],[zx-z.w*.3,yb-26],[zx,yb-34],[zx+z.w*.3,yb-24],[zx+z.w/2,yb]],'#f8f9fa',1.4)}
    else{x.globalAlpha=Math.max(0,1-(z.t-1.3)/1.1);SMO(x,[[zx-z.w/2-6,GY+2],[zx-z.w*.3,GY-20],[zx,GY-26],[zx+z.w*.3,GY-18],[zx+z.w/2+6,GY+2]],LG(x,0,GY-26,0,GY,['#ffffff','#d0ebff']),1.3);x.globalAlpha=1}}}
// 冰面上被击退的怪会继续滑,撞到别的怪两个都受伤
function iceBump(e,dt){if(cur!=6||Math.abs(e.kbv||0)<130)return;const S=stats();
  for(const o of E)if(o!==e&&!o.ug&&!(e.bmp&&e.bmp.has(o))&&ov(e,o)){(e.bmp=e.bmp||new Set()).add(o);xDeal(o,Math.round(S.atk*.8));xDeal(e,Math.round(S.atk*.4));o.kbv=e.kbv*.8;e.kbv*=.4;o.st=Math.max(o.st||0,.4);tx('冰面撞击!',o.x+o.w/2,o.y-16,'#a5d8ff');sfx('hit')}
  const b=solidAt(e.x,e.x+e.w,e.y+e.h)||(zWall(e,e.x)?1:null);if(b){e.x=e.kbv>0?(b===1?e.x-4:b.x-e.w):(b===1?e.x+4:b.x+IBW);e.kbv=-e.kbv*.35;xDeal(e,Math.round(S.atk*.5));e.st=Math.max(e.st||0,.5)}}
// 冰球 / 冰块投射物:c=5 冰块(抛物线)· c=6 大雪球(落地爆成碎冰)· gb=1 贴地冰球(撞墙反弹)
function aimArc(ox,oy,tx_,ty,T,g){return {vx:(tx_-ox)/T,vy:(ty-oy-.5*g*T*T)/T}}

