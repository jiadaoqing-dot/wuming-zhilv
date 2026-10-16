// ===== 第三十九轮:神秘副本 2「梦魇幽驹」/ 神秘副本 3「深渊炎魔」=====
// 图集 GP(art_src/myst/build_gp.py,Gothicvania Patreon's Collection / ansimuz,CC0):梦魇 nm_i / nm_r、炎魔 dm_i / dm_a(攻击含吐息)、爆炎 bf_o / bf_b(蓝)、
//   火颅 sk_o / sk_b(蓝)、地狱犬 hh_r、火球 fb、场地背景 bg2(古堡室内)/ n_sky n_cld n_mnt n_twn(夜镇)+ n_flr(金砖地面)。原图朝左
// 数值:拥有第 2 / 第 3 块女神碎片开放(碎片来自第八 / 第十关首领),所以副本 2 = 第八关首领 ×1.2,副本 3 = 第十关首领 ×1.2(生命 / 防御 / 攻击都 ×1.2,BHN / BDF / B.dm)
// 梦魇幽驹 nmr:冲锋 chg(撞墙为止,一路留幽蓝鬼火;二阶段折返再冲一次)· 跃踏 stp(跳到主角头上,落地两道地面冲击波,二阶段再补一道)·
//   幽蓝火颅 skl(3 / 5 个火颅从天上飘下来追人,一段时间后直冲过来)· 鬃焰爆 nova(原地一圈大爆炸,半径 125)。半血以下二阶段:动作快 20%,鬼火更久
// 深渊炎魔 dmn(飞行):炎息横扫 brth(压低飞行,向前喷火慢慢推进)· 陨火雨 rain(飞到高处,火球落下,落点有预警;二阶段更多并留火)·
//   俯冲砸地 dive(锁定落点 → 俯冲 → 爆炸 + 地面冲击波,落地后喘息约 1 秒,可以趁机打)· 召唤地狱犬 hnd(从场地两边冲过来,跳过去)· 爆炎 ecl(仅二阶段)
const GP={I:null,D:'@@A:gp_atlas@@',M:{"nm_i":[0,0,128,96,4],"nm_r":[513,0,144,96,4],"dm_i":[1090,0,160,144,6],"dm_a":[0,145,240,192,11],"bf_o":[0,338,160,96,5],"bf_b":[801,338,160,96,5],"sk_o":[1602,338,96,112,8],"sk_b":[0,451,96,112,8],"hh_r":[769,451,67,32,5],"fb":[1105,451,19,16,3],"bg2":[1163,451,960,304,1],"n_sky":[2124,451,96,224,1],"n_cld":[2221,451,288,224,1],"n_mnt":[2510,451,96,224,1],"n_twn":[0,756,512,99,1],"n_flr":[513,756,1024,32,1]},
  init(){const im=new Image();im.onload=()=>{this.I=im};im.src=this.D},
  // 第 i 帧画到 (X,Y) 左上角,放大 s,f=-1 水平翻转
  fr(c,k,i,X,Y,s,f){const m=this.M[k];if(!m||!this.I)return;s=s||1;c.save();c.imageSmoothingEnabled=false;c.translate(Math.round(X),Math.round(Y));if(f<0){c.translate(m[2]*s,0);c.scale(-1,1)}c.drawImage(this.I,m[0]+(i%m[4])*m[2],m[1],m[2],m[3],0,0,m[2]*s,m[3]*s);c.restore()},
  on(e){return !!this.I&&(e.k=='nmr'||e.k=='dmn')},
  // 原图朝左:翻转后让锚点 (ax, ay)(脚底 / 身体底部中间)落在原点
  spr(c,k,i,ax,ay,s){c.save();c.scale(-s,s);this.fr(c,k,i,-ax,-ay,1);c.restore()},
  // 首领:c 已经平移到脚底中间、按朝向翻转(面朝右)、放大 1.1
  draw(c,e,t){const S=1/1.1;c.save();if(FLW)c.filter='brightness(2.6)';
    if(e.k=='nmr'){const S=1.45/1.1;  // 梦魇放大 1.45 倍(原图马比主角还小)
      if(e.p2){c.save();c.globalCompositeOperation='lighter';E_(c,0,-62,100,70,RGD(c,0,-62,100,['rgba(80,200,255,.35)','rgba(0,0,0,0)']),0);c.restore()}
      if(e.run)this.spr(c,'nm_r',Math.floor(t*14)%4,58,96,S);else this.spr(c,'nm_i',Math.floor(t*(e.act?12:7))%4,52,96,S)}
    else{const a=e.act,T=e.at||0;if(e.p2){c.save();c.globalCompositeOperation='lighter';E_(c,0,-60,80,70,RGD(c,0,-60,80,['rgba(255,140,60,.3)','rgba(0,0,0,0)']),0);c.restore()}
      if(a=='brth')this.spr(c,'dm_a',T<.9?Math.min(5,Math.floor(T/.9*6)):6+Math.floor(t*12)%5,150,168,S);else this.spr(c,'dm_i',Math.floor(t*9)%6,80,126,S)}
    c.restore()},
  // 副本 2 场地:古堡室内,地面对齐 GY;图下面用最后 30 像素铺到屏幕底
  arena2(t){const m=this.M.bg2;x.fillStyle='#0e1a1c';x.fillRect(0,0,VW,VH);if(!this.I)return;const ox=Math.round((ARL+ARR)/2-480-cam),oy=GY-268;x.save();x.imageSmoothingEnabled=false;
    x.drawImage(this.I,m[0],m[1],960,304,ox,oy,960,304);for(let y=oy+304;y<VH;y+=30)x.drawImage(this.I,m[0],m[1]+274,960,30,ox,y,960,30);x.restore();
    const g=x.createRadialGradient(320,180,120,320,180,420);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,12,24,.6)');x.fillStyle=g;x.fillRect(0,0,VW,VH)},
  // 副本 3 场地:夜镇天空 / 云 / 远山 / 小镇 + 金砖地面
  arena3(t){x.fillStyle='#0d1414';x.fillRect(0,0,VW,VH);if(!this.I)return;const M=this.M,k=1.35;x.save();x.imageSmoothingEnabled=false;
    const tile=(n,y,sc,par,dx)=>{const m=M[n],w=m[2]*sc,h=m[3]*sc;let s=((-(cam*par+(dx||0)))%w+w)%w-w;for(let X=s;X<VW;X+=w)x.drawImage(this.I,m[0],m[1],m[2],m[3],Math.round(X),Math.round(y),Math.ceil(w),Math.round(h))};
    tile('n_sky',0,k,0);tile('n_cld',0,k,.05,t*6);tile('n_mnt',GY-224*k+30,k,.15);tile('n_twn',GY-99,1,.35);tile('n_flr',GY,1,1);x.fillStyle='#1a1208';x.fillRect(0,GY+32,VW,VH-GY-32);x.restore();
    x.fillStyle='rgba(70,10,0,.18)';x.fillRect(0,0,VW,GY)}};
GP.init();
let GPH=[],GPW=[],GPS=[],GPF=[],GPB=[],GPD=[];  // 地面火 / 地面冲击波 / 火颅 / 落下的火球 / 爆炸画面 / 地狱犬
function gpClr(){GPH=[];GPW=[];GPS=[];GPF=[];GPB=[];GPD=[]}
function gpEnd(e,x_){e.act=null;e.run=0;e.cd=(e.p2?.75:1.05)+Math.random()*.5+(x_||0)}
const gpCl=(e,v)=>Math.max(ARL+10,Math.min(ARR-10-e.w,v));
// 爆炸:画面 + 半径 r 内的主角受到 dm 伤害
function gpBoom(x_,y_,k,s,dm,r){GPB.push({x:x_,y:y_,k,s,t:0});shake=Math.max(shake,.2);if(dm&&Math.hypot(P.x+12-x_,P.y+P.h/2-y_)<r)hurt(dm,{kb:sgn(P.x+12-x_)*360})}
// ---- 梦魇幽驹 ----
function nmrStep(e,dt){const pc=P.x+12,cx=e.x+e.w/2,dx=pc-cx,ad=Math.abs(dx),lo=e.hp<e.max*.5,sp=lo?1.2:1;e.pz=null;
  if(!e.intro){e.intro=1;banner('梦魇幽驹 · 踏着幽蓝鬼火、没有主人的马');bsfx('lz_growl')}
  if(lo&&!e.p2){e.p2=1;banner('梦魇幽驹的鬃毛烧成了一片幽蓝火海!');flash('120,200,255',.3)}
  if(!e.act){e.run=0;e.y+=(e.gy-e.y)*Math.min(1,dt*10);e.cd-=dt*sp;e.f=sgn(dx)||e.f;const want=ad>230?1:ad<100?-1:0;e.mv=want;if(want){e.run=want>0?1:0;e.x=gpCl(e,e.x+e.f*want*(want>0?120:70)*sp*dt)}
    if(e.cd>0)return;const Q=ad<140?['nova','stp','chg','skl']:['chg','chg','stp','skl'];if(e.p2)Q.push('chg','skl','nova');let a=pick(Q);if(a==e.la&&Math.random()<.6)a=pick(Q);
    e.act=a;e.la=a;e.at=0;e.hd=0;e.n=0;e.tx=pc;e.jx0=null;e.w2=0;return}
  e.at+=dt*sp;const T=e.at,a=e.act;
  if(a=='chg'){if(T<.7){e.pz='w';e.run=0;e.f=sgn(dx)||e.f;e.cdir=e.f;return}
    e.run=1;e.pz='s';e.f=e.cdir;const nx=e.x+e.cdir*560*sp*dt;
    if(e.lfx==null||Math.abs(cx-e.lfx)>40){e.lfx=cx;GPH.push({x:cx-22,w:44,t:e.p2?3.2:2.2,c:'b',dm:e.dm})}
    if(!e.hd&&ov(P,{x:e.x+10,y:e.y+14,w:e.w-20,h:e.h-14})&&hurt(18*e.dm,{kb:e.cdir*420}))e.hd=1;
    if(nx<=ARL+10||nx>=ARR-10-e.w){e.x=gpCl(e,nx);e.lfx=null;shake=Math.max(shake,.2);sfx('slam');burst(e.cdir>0?e.x+e.w:e.x,e.y+e.h/2,10,['#74c0fc','#e7f5ff'],160,{s:2.5,l:.35});
      e.n++;if(e.p2&&e.n<2){e.cdir=-e.cdir;e.hd=0;e.at=.45;return}gpEnd(e,.3);return}
    e.x=nx;return}
  if(a=='stp'){if(T<.5){e.pz='w';e.run=0;e.tx+=(pc-e.tx)*Math.min(1,dt*5);return}
    if(e.jx0==null)e.jx0=e.x;const k=Math.min(1,(T-.5)/.55),tx_=gpCl(e,e.tx-e.w/2);
    if(!e.hd){e.run=1;e.pz='s';e.x=e.jx0+(tx_-e.jx0)*k;e.y=e.gy-Math.sin(k*Math.PI)*130}
    if(k>=1&&!e.hd){e.hd=1;e.y=e.gy;e.run=0;sfx('slam');const c=e.x+e.w/2;gpBoom(c,GY-24,'b',.8,20*e.dm,e.w/2+34);shake=.35;for(const d of [-1,1])GPW.push({x:c,d,tr:0,hit:0,dm:e.dm,c:'b'});if(e.p2)e.w2=.45}
    if(e.w2>0){e.w2-=dt;if(e.w2<=0){const c=e.x+e.w/2;for(const d of [-1,1])GPW.push({x:c,d,tr:0,hit:0,dm:e.dm,c:'b'})}}
    if(T>1.6)gpEnd(e);return}
  if(a=='skl'){if(T<.75){e.pz='w';return}
    if(!e.hd){e.hd=1;sfx('cloud');const n=e.p2?5:3;for(let i=0;i<n;i++)GPS.push({x:ARL+80+Math.random()*(ARR-ARL-160),y:-30-i*24,vx:0,vy:60,t:0,hl:2.6+i*.35,k:'b',dm:e.dm})}
    if(T>1.2)gpEnd(e);return}
  if(a=='nova'){if(T<.85){e.pz='w';return}
    if(!e.hd){e.hd=1;sfx('boom');gpBoom(cx,GY-40,'b',1.5,22*e.dm,125)}
    if(T>1.4)gpEnd(e);return}
  gpEnd(e)}
// ---- 深渊炎魔(飞行)----
function dmnStep(e,dt){const pc=P.x+12,cx=e.x+e.w/2,dx=pc-cx,ad=Math.abs(dx),lo=e.hp<e.max*.5,sp=lo?1.2:1,low=GY-e.h-26,hi=GY-e.h-70;e.pz=null;
  const fly=(ty,k)=>{e.y+=(ty-e.y)*Math.min(1,dt*(k||3))};
  if(!e.intro){e.intro=1;banner('深渊炎魔 · 从女神沉睡的裂缝里爬出来的东西');bsfx('g10_shriek')}
  if(lo&&!e.p2){e.p2=1;banner('深渊炎魔张开了全部的翅膀!');flash('255,140,60',.3)}
  if(!e.act){e.cd-=dt*sp;e.f=sgn(dx)||e.f;const want=pc+(cx<pc?-1:1)*170-e.w/2;e.x=gpCl(e,e.x+(want-e.x)*Math.min(1,dt*1.2));fly(hi+Math.sin(performance.now()/400)*8,2);
    if(e.cd>0)return;const Q=['brth','rain','dive','hnd','brth','dive'];if(e.p2)Q.push('ecl','ecl','rain');let a=pick(Q);if(a==e.la&&Math.random()<.6)a=pick(Q);
    e.act=a;e.la=a;e.at=0;e.hd=0;e.n=0;e.tx=pc;e.dx0=e.x;e.dy0=e.y;e.tk=0;return}
  e.at+=dt*sp;const T=e.at,a=e.act;
  if(a=='brth'){fly(low,4);if(T<.9){e.pz='w';e.f=sgn(dx)||e.f;return}
    e.pz='s';e.x=gpCl(e,e.x+e.f*45*dt);if(!e.n){e.n=1;sfx('breath')}
    e.tk-=dt;if(e.tk<=0){e.tk=.22;const zx=e.f>0?cx+14:cx-189,zy=e.y+18;if(ov(P,{x:zx,y:zy,w:175,h:GY-zy}))hurt(8*e.dm,{kb:e.f*180,inv:.25})}
    if(T>2.5)gpEnd(e);return}
  if(a=='rain'){fly(36,3);if(T<.6){e.pz='w';return}
    if(!e.hd){e.hd=1;sfx('cloud');const n=e.p2?12:8;for(let i=0;i<n;i++)GPF.push({x:ARL+40+Math.random()*(ARR-ARL-80),y:-30,t:-(.5+i*.16),dm:e.dm,fire:e.p2&&i%3==0});GPF.push({x:pc,y:-30,t:-(.6+n*.16),dm:e.dm,fire:1})}
    if(T>2.4+(e.p2?.6:0))gpEnd(e,.2);return}
  if(a=='dive'){if(T<.75){e.pz='w';fly(hi-30,3);e.tx+=(pc-e.tx)*Math.min(1,dt*4);e.f=sgn(e.tx-cx)||e.f;e.dx0=e.x;e.dy0=e.y;return}
    if(T<1.05){e.pz='s';const k=(T-.75)/.3,tx_=gpCl(e,e.tx-e.w/2);e.x=e.dx0+(tx_-e.dx0)*k;e.y=e.dy0+(GY-e.h-e.dy0)*k*k;return}
    if(!e.hd){e.hd=1;e.y=GY-e.h;sfx('slam');const c=e.x+e.w/2;gpBoom(c,GY-30,'o',.9,22*e.dm,95);shake=.4;for(const d of [-1,1])GPW.push({x:c,d,tr:0,hit:0,dm:e.dm,c:'o'})}
    if(T<2.1){fly(GY-e.h,8);return}  // 落地喘息:这段时间够得着,可以打
    if(T<2.6){fly(hi,3);return}
    gpEnd(e);return}
  if(a=='hnd'){fly(hi,2);if(T<.7){e.pz='w';return}
    if(!e.hd){e.hd=1;sfx('howl');const n=e.p2?3:2;for(let i=0;i<n;i++){const d=i%2?-1:1;GPD.push({x:d>0?ARL-40:ARR+40,d,t:-i*.6,dm:e.dm})}}
    if(T>1.4)gpEnd(e);return}
  if(a=='ecl'){fly(hi,2);if(T<1){e.pz='w';e.tx+=(pc-e.tx)*Math.min(1,dt*3);return}
    if(!e.hd){e.hd=1;sfx('boom');gpBoom(e.tx,GY-40,'o',1.4,24*e.dm,80);GPH.push({x:e.tx-60,w:120,t:3,c:'o',dm:e.dm})}
    if(T>1.5)gpEnd(e);return}
  gpEnd(e)}
// 场上的东西:每帧推进 + 判定
function gpStep(dt){const pc=P.x+12,gr=P.y+P.h>=GY-4;
  for(const h of GPH)h.t-=dt;GPH=GPH.filter(h=>h.t>0);P.gpT=(P.gpT||0)-dt;
  if(gr&&P.gpT<=0){const h=GPH.find(h=>pc>h.x&&pc<h.x+h.w);if(h){P.gpT=.5;hurt(6*h.dm,{inv:.2})}}
  for(const w of GPW){w.x+=w.d*320*dt;w.tr+=320*dt;if(!w.hit&&gr&&Math.abs(pc-w.x)<20&&hurt(12*w.dm,{kb:w.d*300}))w.hit=1}GPW=GPW.filter(w=>w.tr<420&&w.x>ARL&&w.x<ARR);
  for(const s of GPS){s.t+=dt;if(s.t<s.hl){const a=Math.atan2(P.y+20-s.y,pc-s.x),v=s.y<60?160:85,k=Math.min(1,dt*2);s.vx+=(Math.cos(a)*v-s.vx)*k;s.vy+=(Math.sin(a)*v-s.vy)*k}
    else if(!s.dv){s.dv=1;const a=Math.atan2(P.y+28-s.y,pc-s.x);s.vx=Math.cos(a)*340;s.vy=Math.sin(a)*340}
    s.x+=s.vx*dt;s.y+=s.vy*dt;
    if(ov(P,{x:s.x-12,y:s.y-12,w:24,h:24})){s.d=1;hurt(12*s.dm,{kb:sgn(s.vx)*200});gpBoom(s.x,s.y,s.k,.5)}
    else if(s.y>GY-6||s.t>s.hl+2){s.d=1;gpBoom(s.x,Math.min(s.y,GY-10),s.k,.5)}}GPS=GPS.filter(s=>!s.d);
  for(const f of GPF){f.t+=dt;if(f.t<0)continue;f.y+=420*dt;if(f.y>=GY-8){f.d=1;gpBoom(f.x,GY-14,'o',.55,14*f.dm,40);if(f.fire)GPH.push({x:f.x-20,w:40,t:2,c:'o',dm:f.dm})}}GPF=GPF.filter(f=>!f.d);
  for(const b of GPB)b.t+=dt;GPB=GPB.filter(b=>b.t<.5);
  for(const d of GPD){d.t+=dt;if(d.t<0)continue;d.x+=d.d*270*dt;if(!d.hit&&gr&&Math.abs(pc-d.x)<22&&hurt(12*d.dm,{kb:d.d*320}))d.hit=1}GPD=GPD.filter(d=>d.t<0||(d.x>ARL-60&&d.x<ARR+60))}
// 画面(PXL 层,怪物之后画):预警范围、炎魔影子、地面火、冲击波、火球、火颅、地狱犬、爆炸
function gpFx(){const G=GP;if(!G.I)return;const t=performance.now()/1000,e=B;
  if(e&&e.hp>0&&e.act){const T=e.at||0,cx=e.x+e.w/2;
    if(e.k=='nmr'){if(e.act=='chg'&&T<.7){const d=e.cdir||e.f,a=d>0?cx:ARL,b=d>0?ARR:cx;DZ.zone(a-cam,b-a)}if(e.act=='stp'&&T<1.05)DZ.zone(e.tx-70-cam,140);if(e.act=='nova'&&T<.85)DZ.zone(cx-125-cam,250)}
    else if(e.k=='dmn'){if(e.act=='brth'&&T<.9)DZ.zone((e.f>0?cx+14:cx-189)-cam,175);if(e.act=='dive'&&T<1.05)DZ.zone(e.tx-95-cam,190);if(e.act=='ecl'&&T<1)DZ.zone(e.tx-80-cam,160)}}
  if(e&&e.k=='dmn'&&e.hp>0){const k=Math.max(.3,1-(GY-(e.y+e.h))/200);E_(x,e.x+e.w/2-cam,GY+2,34*k,5*k,'rgba(0,0,0,.4)',0)}
  x.save();
  for(const h of GPH){const n=Math.max(1,Math.round(h.w/24));x.globalAlpha=Math.min(1,h.t/.4)*.85;for(let i=0;i<n;i++)G.fr(x,h.c=='b'?'bf_b':'bf_o',1+(Math.floor(t*10)+i)%4,h.x-cam+i*24-10,GY-26,.28)}
  x.globalAlpha=1;
  for(const w of GPW)G.fr(x,w.c=='b'?'bf_b':'bf_o',1+Math.floor(t*14)%4,w.x-cam-29,GY-34,.36,w.d>0?-1:1);
  for(const f of GPF){DZ.zone(f.x-22-cam,44);if(f.t<0)continue;x.save();x.translate(Math.round(f.x-cam),Math.round(f.y));x.rotate(Math.PI/2);G.fr(x,'fb',Math.floor(t*12)%3,-19,-16,2);x.restore()}
  for(const s of GPS)G.fr(x,s.k=='b'?'sk_b':'sk_o',Math.floor(t*12+s.hl*7)%8,s.x-cam-24,s.y-30,.5);
  for(const d of GPD)if(d.t>=0)G.fr(x,'hh_r',Math.floor(t*14)%5,d.x-cam-44,GY-42,1.3,d.d>0?-1:1);
  for(const b of GPB)G.fr(x,b.k=='b'?'bf_b':'bf_o',Math.min(4,Math.floor(b.t/.5*5)),b.x-cam-90*b.s,b.y-52*b.s,b.s);
  x.restore()}
