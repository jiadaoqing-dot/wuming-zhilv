// ===== 世界地图:插画风海岛(预渲染)+ 关卡节点 =====
// =====================================================================
const MAPN=[[118,272],[150,150],[262,92],[420,92],[548,210],[96,40],[196,40],[330,192],[560,300]],MAPT=[330,232];
let MAPBG=null;
// 插画风世界地图:新月形大陆环抱中央海湾,海湾中间的圆形岛是晨曦镇;大陆边缘有悬崖、浅滩与浪花
function mapBG(){if(MAPBG)return MAPBG;return MAPBG=mkL(VW,VH,(c,w,h)=>{SEED=42;
  const LAND=[[-30,380],[-30,-30],[670,-30],[670,340],[606,322],[580,286],[528,266],[478,252],[448,214],[428,172],[376,152],[300,150],[236,166],[204,202],[192,250],[208,298],[236,380]];
  const landPath=(dy)=>{const n=LAND.length,m=i=>[(LAND[i%n][0]+LAND[(i+1)%n][0])/2,(LAND[i%n][1]+LAND[(i+1)%n][1])/2+dy];c.beginPath();const s0=m(n-1);c.moveTo(s0[0],s0[1]);for(let i=0;i<n;i++){const q=m(i);c.quadraticCurveTo(LAND[i][0],LAND[i][1]+dy,q[0],q[1])}c.closePath()};
  const blob=(pts,fill,lw,cliff,cc)=>{if(cliff){c.save();c.translate(0,cliff);SMO(c,pts,cc||'#6b4a2e',0);c.restore()}SMO(c,pts,fill,lw==null?1.2:lw)};
  const speck=(x0,y0,x1,y1,n,cols)=>{for(let i=0;i<n;i++){c.fillStyle=cols[i%cols.length];c.beginPath();c.ellipse(x0+sr()*(x1-x0),y0+sr()*(y1-y0),1+sr()*2.4,.6+sr()*1.2,0,0,7);c.fill()}};
  // ===== 海洋 =====
  c.fillStyle=LG(c,0,0,0,h,['#0b4f99','#1971c2','#1c7ed6']);c.fillRect(0,0,w,h);
  for(const [a,b,r] of [[400,300,160],[150,330,90],[600,360,120]]){c.fillStyle=RGD(c,a,b,r,['rgba(116,192,252,.35)','rgba(116,192,252,0)']);c.fillRect(a-r,b-r,2*r,2*r)}
  // 浅滩光圈 + 浪花
  c.save();landPath(14);c.strokeStyle='rgba(165,232,255,.45)';c.lineWidth=26;c.lineJoin='round';c.stroke();c.strokeStyle='rgba(215,245,255,.55)';c.lineWidth=12;c.stroke();c.restore();
  for(let i=0;i<70;i++){const a=sr()*w,b=sr()*h;c.strokeStyle='rgba(255,255,255,'+(.25+sr()*.35)+')';c.lineWidth=1.1;c.beginPath();c.arc(a,b,3+sr()*4,3.5,5.9);c.stroke()}
  // ===== 大陆:悬崖侧面 + 顶面 =====
  landPath(14);c.fillStyle=LG(c,0,140,0,380,['#8a6a46','#5c4128']);c.fill();c.strokeStyle=OL;c.lineWidth=1.6;c.stroke();
  c.save();landPath(14);c.clip();for(let k=0;k<3;k++){c.save();c.translate(0,4+k*3.4);landPath(0);c.strokeStyle='rgba(43,26,18,.28)';c.lineWidth=1;c.stroke();c.restore()}c.restore();
  landPath(0);c.fillStyle=LG(c,0,0,0,h,['#9ad66b','#7cc456','#63b04a']);c.fill();c.strokeStyle=OL;c.lineWidth=1.6;c.stroke();
  c.save();landPath(0);c.clip();
  speck(-20,-20,660,380,500,['rgba(255,255,255,.12)','rgba(30,80,20,.12)','rgba(255,240,170,.1)']);
  // 雪山(左上,未开放)
  blob([[-30,-30],[220,-30],[230,30],[180,78],[100,96],[20,90],[-30,70]],LG(c,0,-30,0,96,['#ffffff','#d6ecfa']),1.3,7,'#8fb3d9');
  for(const [a,b,ww,hh] of [[40,70,90,74],[120,62,80,62],[180,50,60,48],[70,40,70,56]])mount(c,a,b,ww,hh,LG(c,a,b-hh,a,b,['#e7f5ff','#a5c8ec']),'#ffffff',1.2);
  // 火山(右上,未开放)
  blob([[460,-30],[670,-30],[670,150],[610,140],[540,110],[480,60]],LG(c,0,-30,0,150,['#5c3a2e','#3a2520']),1.3,7,'#2a1814');
  PG(c,[[540,96],[586,30],[610,30],[650,100]],LG(c,0,30,0,100,['#6b4332','#3a2520']),1.3);E_(c,598,30,13,4,'#ff6b35',1.1);for(const [a,b,d,e2] of [[596,34,580,70],[602,34,618,64],[590,52,570,92]])LN_(c,[[a,b],[(a+d)/2+3,(b+e2)/2],[d,e2]],'#ff922b',2);
  for(let i=0;i<4;i++){const k=i/4;C_(c,600+Math.sin(i*2)*6,18-i*9,5+i*2.5,'rgba(90,80,80,'+(.5-k*.1)+')',0)}
  // 沙漠高地(右)
  blob([[440,160],[520,150],[600,170],[670,170],[670,330],[600,316],[572,282],[520,262],[470,248],[446,212]],LG(c,0,150,0,330,['#ffe3a0','#f2bf6a']),1.3,6,'#b07d3a');
  c.strokeStyle='rgba(176,125,58,.55)';c.lineWidth=1.3;for(const [a,b,r] of [[480,200,9],[515,232,7],[600,248,10],[590,190,6],[640,290,8]]){c.beginPath();c.arc(a,b,r,0,4.8);c.stroke();c.beginPath();c.arc(a+r*.35,b-r*.1,r*.45,3,7.4);c.stroke()}
  {const a=548,b=194;PG(c,[[a-34,b+18],[a,b-20],[a+34,b+18]],LG(c,a-34,0,a+34,0,['#f6c87a','#d18a3a']),1.3);PG(c,[[a,b-20],[a+34,b+18],[a+8,b+18]],'rgba(80,40,10,.18)',0);for(let k=1;k<4;k++)LN_(c,[[a-34+k*8.5,b+18-k*9.5],[a+34-k*8.5,b+18-k*9.5]],'rgba(110,60,20,.45)',1);RR(c,a-6,b+6,12,12,2,'#5a3412',1.1)}
  for(const [a,b] of [[476,236],[620,214],[500,286]]){RR(c,a-2,b-12,4.4,13,2,'#40c057',.9);RR(c,a-6,b-9,3,6,1.5,'#40c057',.8)}
  // 毒棘密林(上中偏右)
  blob([[344,40],[430,26],[500,46],[520,96],[470,138],[392,144],[352,118]],LG(c,0,26,0,144,['#3d6b3a','#1f3d26']),1.3,6,'#1a2a18');
  for(let i=0;i<14;i++){const a=360+sr()*140,b=52+sr()*76;C_(c,a,b,6+sr()*5,LG(c,0,b-10,0,b+10,['#4c8a46','#244d2a']),1)}
  for(const [a,b] of [[388,120],[452,112],[480,72]]){RR(c,a-1.4,b-6,2.8,7,1,'#e9ecef',.7);E_(c,a,b-7,6,4,LG(c,0,b-11,0,b-3,['#e599f7','#9c36b5']),1)}
  c.fillStyle='rgba(190,90,230,.22)';c.beginPath();c.ellipse(430,92,72,20,0,0,7);c.fill();
  // 迷雾森林(上中偏左)
  blob([[200,52],[262,30],[332,44],[346,96],[318,140],[246,150],[208,120]],LG(c,0,30,0,150,['#5aa04a','#2f7a3a']),1.3,6,'#244d2a');
  for(let r=0;r<4;r++)for(let k=0;k<6;k++){const a=214+k*21+(r%2)*10,b=64+r*22;pine(c,a,b+12,26,['#2b6e35','#6db544',null,'#6b4423'],.9)}
  c.fillStyle='rgba(255,255,255,.3)';for(const [a,b,rx] of [[268,80,60],[250,128,48]]){c.beginPath();c.ellipse(a,b,rx,9,0,0,7);c.fill()}
  // 暗影高塔(左中:紫色岩台)
  blob([[60,110],[140,96],[210,118],[214,176],[176,204],[96,206],[52,170]],LG(c,0,96,0,206,['#7a68a8','#45386b']),1.3,8,'#2a2140');
  for(const [a,b,hh] of [[130,140,46],[156,150,62],[178,144,40],[108,156,30]]){RR(c,a-6,b-hh,12,hh,2,LG(c,a-6,0,a+6,0,['#3b2d63','#1d1530']),1.1);PG(c,[[a-8,b-hh],[a,b-hh-16],[a+8,b-hh]],'#5f3dc4',1.1);RR(c,a-2,b-hh+10,4,6,2,'#ffd43b',.6)}
  // 牛魔古堡(左下草原 + 城堡)
  blob([[-30,214],[80,206],[176,226],[196,276],[214,330],[226,380],[-30,380]],LG(c,0,206,0,380,['#a9e38a','#6cc04f']),1.2,0);
  for(let i=0;i<26;i++){const a=-10+sr()*170,b=250+sr()*110;if(Math.hypot(a-118,b-272)<30)continue;rtree(c,a,b,.42+sr()*.18,['#40c057','#2b8a3e','#8ce99a'],.9)}
  {const a=118,b=258;RR(c,a-16,b-22,32,22,2,LG(c,0,b-22,0,b,['#c5ccd6','#868e96']),1.1);for(const d of [-18,14]){RR(c,a+d-1,b-30,8,30,2,'#adb5bd',1.1);PG(c,[[a+d-3,b-30],[a+d+3,b-42],[a+d+9,b-30]],'#e03131',1.1)}RR(c,a-4,b-11,8,11,4,'#2b1a12',1)}
  // 河流:从雪山流进海湾
  c.strokeStyle=OL;c.lineWidth=7;c.beginPath();c.moveTo(190,80);c.bezierCurveTo(200,120,186,170,212,214);c.stroke();c.strokeStyle='#4dabf7';c.lineWidth=5;c.stroke();c.strokeStyle='rgba(255,255,255,.55)';c.lineWidth=1.2;c.stroke();
  c.restore();
  // ===== 晨曦镇:海湾中的圆形岛 + 女神像广场 =====
  {const a=MAPT[0],b=MAPT[1];c.strokeStyle='rgba(215,245,255,.6)';c.lineWidth=10;c.beginPath();c.ellipse(a,b+10,54,30,0,0,7);c.stroke();
   E_(c,a,b+9,50,26,LG(c,0,b-10,0,b+35,['#8a6a46','#5c4128']),1.6);E_(c,a,b,50,24,LG(c,0,b-24,0,b+24,['#e9cf9e','#c9a77a']),1.6);
   for(const [rx,ry,col] of [[40,19,'#d8bb88'],[29,13.6,'#e9d3a7'],[17,8,'#f3e2bf']])E_(c,a,b,rx,ry,col,1);
   for(let i=0;i<8;i++){const q=i*Math.PI/4;RR(c,a+Math.cos(q)*35-1.5,b+Math.sin(q)*16.5-1.5,3,3,1,'#3bc9db',0)}
   for(const [dx,dy,col] of [[-40,-6,'#e03131'],[38,-8,'#1c7ed6'],[-30,10,'#2b8a3e'],[30,10,'#e8590c']]){RR(c,a+dx-5,b+dy-6,10,9,1,'#fff3dc',.9);PG(c,[[a+dx-7,b+dy-6],[a+dx,b+dy-12],[a+dx+7,b+dy-6]],col,.9)}
   c.save();c.translate(a,b+4);c.scale(.42,.42);drawAngel(c,0,1);c.restore();
   // 木桥连到大陆
   for(let k=0;k<9;k++)RR(c,204+k*7,232+k*.5,6,12,1,'#a6713f',.8);LN_(c,[[202,232],[268,236]],'#6b4423',1.4);LN_(c,[[202,244],[268,248]],'#6b4423',1.4)}
  // 海上的船
  {const a=580,b=330;PG(c,[[a-26,b-6],[a+24,b-6],[a+16,b+8],[a-18,b+8]],LG(c,0,b-6,0,b+8,['#7a4a22','#4a2a12']),1.3);LN_(c,[[a-4,b-6],[a-4,b-42]],OL,1.6);
   PG(c,[[a-4,b-40],[a+16,b-34],[a+14,b-14],[a-4,b-12]],'#f8f1e0',1.1);PG(c,[[a-6,b-38],[a-22,b-30],[a-20,b-14],[a-6,b-12]],'#f1e6cc',1.1);LN_(c,[[a-30,b+10],[a+30,b+10]],'rgba(255,255,255,.6)',1.4)}
  // 云朵 + 暗角
  for(const [a,b,sc] of [[-6,346,1.4],[600,10,1.1],[300,-6,1],[640,350,1.2]]){c.globalAlpha=.85;cloudP(c,a,b,sc);c.globalAlpha=1}
  c.fillStyle=RGD(c,w/2,h/2,420,['rgba(0,0,0,0)','rgba(0,0,0,0)','rgba(10,20,40,.38)']);c.fillRect(0,0,w,h);
  // 关卡之间的小路
  c.setLineDash([3,4]);c.strokeStyle='rgba(255,246,214,.9)';c.lineWidth=2;c.beginPath();c.moveTo(205,238);for(const [a,b] of MAPN.slice(0,5))c.lineTo(a,b);c.stroke();
  c.beginPath();c.moveTo(548,210);c.bezierCurveTo(640,120,330,-6,96,40);c.stroke();c.beginPath();c.moveTo(96,40);c.quadraticCurveTo(146,58,196,40);c.stroke();c.setLineDash([]);
  for(const [a,b2] of [[172,58],[182,64],[214,60],[222,52],[206,66]])pine(c,a,b2,22,['#1e4a3e','#2f6b58','#ffffff','#3d2a1e'],.8)})}
// 世界地图(用户定制的插画,art_src/map/build_map.py → assets/map_bg.jpg,1125×633):牌子上的字已擦掉,这里按 MAPS 写关卡名 / 推荐等级 / 锁定 / 通关星;
// MAPP = 第 1~8 关牌子中心(逻辑坐标);牌子半宽 38、半高 15。图没加载好时用下面的旧地图
const MAPI={I:null,D:'@@J:map_bg@@'};{const im=new Image();im.onload=()=>{MAPI.I=im};im.src=MAPI.D}
const M1C=[354,6,144,24];  // 第六十七轮:第一张地图上的挑战模式开关(暗黑大陆按钮左边)
const MAPP=[[178,286],[170,207],[170,135],[374,317],[329,116],[435,52],[510,107],[377,204],[492,234],[546,318]];  // 第九关:火山脚下原来「??? 尚未开放」的牌子(游戏里画一块牌子盖住)  // 第八关幽魂都市用原来晨曦镇的牌子(2026-10-13:晨曦镇不再显示在地图上)
// 鼠标在地图上的位置(逻辑坐标,用来高亮牌子)
let MX_=-1,MY_=-1;addEventListener('mousemove',e=>{if(st!='map'&&st!='lvsel')return;const r=cv.getBoundingClientRect();MX_=(e.clientX-r.left)*VW/r.width;MY_=(e.clientY-r.top)*VH/r.height});
function drawMapC(t){x.imageSmoothingEnabled=true;x.drawImage(MAPI.I,0,0,VW,VH);
  // 火山口冒烟
  for(let i=0;i<4;i++){const k=(t*.22+i/4)%1;C_(x,512+Math.sin(k*6+i)*7+k*10,132-k*46,4+k*11,'rgba(90,80,80,'+(.5*(1-k))+')',0)}
  const nxt=MAPS.findIndex((m,i)=>!m.lock()&&!CLR.includes(i+1));
  MAPS.forEach((m,i)=>{const [a,b]=MAPP[i],lk=m.lock(),clr=CLR.includes(i+1),hv=mapHit(MX_,MY_)==i;
    if(i==8||i==9){RR(x,a-40,b-15,80,30,4,LG(x,0,b-15,0,b+15,['#9aa85a','#6f7d38']),1.4);x.strokeStyle='#3e4a1c';x.lineWidth=1.5;x.strokeRect(a-37.5,b-12.5,75,25)}  // 第九关的牌子(地图上没有画)
    if(i==nxt){x.save();x.globalCompositeOperation='lighter';E_(x,a,b,52+Math.sin(t*4)*3,26,RGD(x,a,b,52,['rgba(255,230,120,.55)','rgba(255,200,60,0)']),0);x.restore()}
    if(lk){x.fillStyle='rgba(18,20,30,.5)';x.beginPath();x.roundRect(a-38,b-15,76,30,4);x.fill()}
    else if(hv){x.fillStyle='rgba(255,255,220,.18)';x.beginPath();x.roundRect(a-38,b-15,76,30,4);x.fill()}
    CT(m.n.split(' · ')[1],a,b-1,12,lk?'#ced4da':'#fff','center',2.6,'#24320e');CT(lk?'🔒 通关上一关后解锁':m.d[1],a,b+11,8,lk?'#ced4da':'#fff3bf','center',2,'#24320e');
    {const sn=starOf(i+1);for(let k=0;k<sn;k++)CT('★',a+16+k*10,b-11,10,STARK[sn].c,'center',2.4,'#5a2e08')}});  // 第十六轮:牌子右上角画已通关的星数

  RR(x,14,318,130,30,13,LG(x,0,318,0,348,['#ffb84d','#e8590c']),1.8);CT('🏠 返回城镇',79,338,12,'#fff','center',2.6);
  if(c4Open())c4Btn(M1C,inR(MX_,MY_,M1C),t);  // 第六十七轮:挑战模式开关(和暗黑大陆右下角那个是同一个 C4M)
  CT(C4M?'⚔ 挑战模式开启中:点击关卡直接四星挑战(要先三星通关)':'点击地名选择星级 · 按 1~9、0 选择 · Esc 返回',408,350,9,C4M?'#f3d9fa':'#fff','center',2.4,C4M?'#3a0b4b':'#0b3a6b');
  if(performance.now()<msgU)CT(msg,320,58,13,'#ffe3e3','center',3,'#7a1f1f')}
function drawMap(){const t=performance.now()/1000;if(MPG==1&&MAPI2.I){drawMap2(t);return}if(MAPI.I){drawMapC(t);if(map2Open())map2Btn(t);return}x.imageSmoothingEnabled=false;x.drawImage(mapBG(),0,0,VW,VH);x.imageSmoothingEnabled=true;
  // 水面闪光、飘过的云影
  for(let i=0;i<10;i++){const a=(i*83+t*6)%VW,b=210+((i*47)%140);x.globalAlpha=.35+.35*Math.sin(t*3+i);C_(x,a,b,1,'#fff',0)}x.globalAlpha=1;
  for(let i=0;i<2;i++){const a=((t*8+i*360)%(VW+200))-100;x.fillStyle='rgba(20,40,70,.12)';x.beginPath();x.ellipse(a,120+i*130,70,18,0,0,7);x.fill()}
  // 火山冒烟
  for(let i=0;i<3;i++){const k=(t*.25+i/3)%1;C_(x,600+Math.sin(k*6+i)*6,22-k*40,5+k*10,'rgba(110,100,100,'+(.45*(1-k))+')',0)}
  RR(x,226,6,188,32,14,LG(x,0,6,0,38,['#8a5428','#4a2a12']),1.8);x.beginPath();x.roundRect(230,10,180,24,10);x.strokeStyle='rgba(255,212,59,.6)';x.lineWidth=1;x.stroke();CTG('世界地图',320,30,19);
  const nxt=MAPS.findIndex((m,i)=>!m.lock()&&!CLR.includes(i+1));
  MAPS.forEach((m,i)=>{const [a,b]=MAPN[i],lk=m.lock(),clr=CLR.includes(i+1);
    if(i==nxt){x.save();x.globalCompositeOperation='lighter';C_(x,a,b,26+Math.sin(t*4)*3,RGD(x,a,b,28,['rgba(255,230,120,.75)','rgba(255,200,60,0)']),0);x.restore()}
    C_(x,a,b,11,lk?LG(x,0,b-11,0,b+11,['#adb5bd','#495057']):LG(x,0,b-11,0,b+11,['#fff3bf','#fab005','#d9480f']),1.8);CT(lk?'🔒':String(i+1),a,b+4.5,lk?10:13,'#fff','center',lk?0:3);
    PLQ(x,a,b+24,m.n.split(' · ')[1],lk?'通关上一关后解锁':m.d[1],lk?'#adb5bd':null);{const sn=starOf(i+1);for(let k=0;k<sn;k++)CT('★',a+12+k*9,b-8,10,STARK[sn].c,'center',2.4)}});

  for(const [a,b] of [[598,74]])PLQ(x,a,b,'？？？','尚未开放','#adb5bd');
  RR(x,14,318,130,30,13,LG(x,0,318,0,348,['#ffb84d','#e8590c']),1.8);CT('🏠 返回城镇',79,338,12,'#fff','center',2.6);
  CT('点击地名进入关卡 · 按 1~9、0 选择 · Esc 返回',408,348,9,'#fff','center',2.4,'#0b3a6b');
  if(performance.now()<msgU)CT(msg,320,58,13,'#ffe3e3','center',3,'#7a1f1f')}
