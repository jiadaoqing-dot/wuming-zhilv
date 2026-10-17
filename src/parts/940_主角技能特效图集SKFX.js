// ===== 首领攻击特效第二张图集 BFX2(art_src/bfx/build_bfx2.py):地面预警符文圆环、落石、沙浪龙卷、冰晶、毒柱、冲击波圆环 =====
const BFX2={D:'@@A:bfx2_atlas@@',M:{"z-rune":{"y":0,"w":64,"h":64,"n":8,"px":32,"py":32,"fps":10,"loop":true,"im":4},"z-rock":{"y":64,"w":34,"h":20,"n":1,"px":17,"py":10,"fps":12,"loop":false,"im":4},"s-tor":{"y":84,"w":48,"h":64,"n":6,"px":24,"py":64,"fps":14,"loop":true,"im":4},"i-cry0":{"y":148,"w":40,"h":40,"n":4,"px":20,"py":40,"fps":12,"loop":false,"im":4},"i-cry1":{"y":188,"w":40,"h":40,"n":4,"px":20,"py":40,"fps":12,"loop":false,"im":4},"i-cry2":{"y":228,"w":40,"h":40,"n":4,"px":20,"py":40,"fps":12,"loop":false,"im":4},"p-gey":{"y":268,"w":44,"h":82,"n":24,"px":22,"py":82,"fps":40,"loop":false,"im":4},"w-ring":{"y":350,"w":60,"h":60,"n":18,"px":30,"py":30,"fps":30,"loop":false,"im":4}},
  init(){Object.assign(VFX.M,this.M);const im=new Image();im.onload=()=>{VFX.I4=im};im.src=this.D}};
BFX2.init();
// ===== 主角技能特效图集 SKFX(art_src/skfx/build_skfx.py,2026-10-12 第六轮):Light / Cosmic Time / Fire Wrath - Magic Effect(Cethiel,CC0)、2D Spell Effects(Mikodrak,CC0)=====
// 发光帧(亮度当透明度),都用叠加(add:1)画。剑士 I 金色光爆、S+空格 紫色魔法阵 / 漩涡、WW+空格 红色火环 / 火爆;法师落雷光柱、闪现 / 风眼光漩涡等
const SKFX={D:'@@A:skfx_atlas@@',M:{"g-burst":{"y":0,"w":108,"h":112,"n":5,"px":54,"py":56,"fps":12,"loop":false,"im":5},"g-orb":{"y":112,"w":68,"h":72,"n":5,"px":34,"py":36,"fps":12,"loop":false,"im":5},"b-orb":{"y":184,"w":68,"h":72,"n":5,"px":34,"py":36,"fps":12,"loop":false,"im":5},"v-wing":{"y":256,"w":128,"h":119,"n":5,"px":64,"py":59,"fps":12,"loop":false,"im":5},"v-clock":{"y":375,"w":72,"h":71,"n":5,"px":36,"py":35,"fps":12,"loop":false,"im":5},"v-vortex":{"y":446,"w":112,"h":112,"n":5,"px":56,"py":56,"fps":12,"loop":false,"im":5},"v-ring":{"y":558,"w":90,"h":96,"n":5,"px":45,"py":48,"fps":12,"loop":false,"im":5},"v-gear":{"y":654,"w":73,"h":80,"n":5,"px":36,"py":40,"fps":12,"loop":false,"im":5},"r-ring":{"y":734,"w":112,"h":110,"n":5,"px":56,"py":55,"fps":12,"loop":false,"im":5},"r-ball":{"y":844,"w":112,"h":112,"n":5,"px":56,"py":56,"fps":12,"loop":false,"im":5},"r-cross":{"y":956,"w":144,"h":111,"n":5,"px":72,"py":55,"fps":12,"loop":false,"im":5},"r-wing":{"y":1067,"w":122,"h":128,"n":5,"px":61,"py":64,"fps":12,"loop":false,"im":5},"r-burst":{"y":1195,"w":126,"h":128,"n":5,"px":63,"py":64,"fps":12,"loop":false,"im":5},"m-swirl":{"y":1323,"w":93,"h":96,"n":5,"px":46,"py":48,"fps":12,"loop":false,"im":5},"t-swirl":{"y":1419,"w":108,"h":112,"n":5,"px":54,"py":56,"fps":12,"loop":false,"im":5},"m-bolt":{"y":1531,"w":71,"h":150,"n":11,"px":35,"py":150,"fps":22,"loop":false,"im":5},"c-cloud0":{"y":1681,"w":246,"h":54,"n":1,"px":123,"py":27,"fps":12,"loop":false,"im":5},"c-cloud1":{"y":1735,"w":250,"h":64,"n":1,"px":125,"py":32,"fps":12,"loop":false,"im":5},"c-cloud2":{"y":1799,"w":174,"h":56,"n":1,"px":87,"py":28,"fps":12,"loop":false,"im":5},"c-cloud3":{"y":1855,"w":122,"h":60,"n":1,"px":61,"py":30,"fps":12,"loop":false,"im":5},"c-cloud4":{"y":1915,"w":116,"h":58,"n":1,"px":58,"py":29,"fps":12,"loop":false,"im":5},"met-rock":{"y":1973,"w":120,"h":108,"n":1,"px":60,"py":54,"fps":12,"loop":false,"im":5}},
  init(){Object.assign(VFX.M,this.M);const im=new Image();im.onload=()=>{VFX.I5=im};im.src=this.D}};
// 第二十七轮:法师技能特效 MG27(art_src/skfx/build_mg27.py):法阵 = 4 summoning circles(Luke.RUSTLTD,CC0)上色;激光 / 光柱 = Lasers and beams(Rawdanitsu,CC0)的横截面拉长
const MG27={D:'@@A:mg27_atlas@@',M:{"mc-fire":{"y":0,"w":112,"h":112,"n":1,"px":56,"py":56,"fps":12,"loop":false,"im":6},"mc-gold":{"y":112,"w":112,"h":112,"n":1,"px":56,"py":56,"fps":12,"loop":false,"im":6},"mc-blue":{"y":224,"w":112,"h":112,"n":1,"px":56,"py":56,"fps":12,"loop":false,"im":6},"bm-red":{"y":336,"w":64,"h":18,"n":1,"px":32,"py":9,"fps":12,"loop":false,"im":6},"bm-blue":{"y":354,"w":40,"h":16,"n":1,"px":20,"py":8,"fps":12,"loop":false,"im":6}},
  init(){Object.assign(VFX.M,this.M);const im=new Image();im.onload=()=>{VFX.I6=im;mgIcons()};im.src=this.D}};
SKFX.init();MG27.init();
// 第二十九轮:特效图集 FX29(art_src/skfx/build_fx29.py):Free Pixel Effects Pack(CodeManu,CC0)+ Lasers and beams(Rawdanitsu,CC0)
// 怪物飞弹不再画成圆球:每种飞弹换一种花样特效(FX29.S:[特效, 大小]);火鸟图腾的火团、苍穹光柱的深色光柱、第二关首领的粗激光也用这里的帧
const FX29={D:'@@A:fx29_atlas@@',M:﻿{"x-sun":{"y":0,"w":60,"h":56,"n":16,"px":30,"py":28,"fps":15,"loop":true,"im":7},"x-vortex":{"y":56,"w":76,"h":73,"n":16,"px":38,"py":36,"fps":15,"loop":true,"im":7},"x-nebula":{"y":129,"w":75,"h":76,"n":16,"px":37,"py":38,"fps":15,"loop":true,"im":7},"x-midnight":{"y":205,"w":56,"h":56,"n":16,"px":28,"py":28,"fps":15,"loop":true,"im":7},"x-fel":{"y":261,"w":71,"h":70,"n":16,"px":35,"py":35,"fps":15,"loop":true,"im":7},"x-bluefire":{"y":331,"w":45,"h":42,"n":16,"px":22,"py":21,"fps":15,"loop":true,"im":7},"x-fire":{"y":373,"w":24,"h":51,"n":16,"px":12,"py":25,"fps":15,"loop":true,"im":7},"x-phantom":{"y":424,"w":69,"h":71,"n":16,"px":34,"py":35,"fps":15,"loop":true,"im":7},"x-bubble":{"y":495,"w":50,"h":53,"n":16,"px":25,"py":26,"fps":15,"loop":true,"im":7},"x-lash":{"y":548,"w":44,"h":42,"n":15,"px":22,"py":21,"fps":15,"loop":true,"im":7},"x-spell":{"y":590,"w":46,"h":48,"n":15,"px":23,"py":24,"fps":15,"loop":true,"im":7},"x-lball":{"y":638,"w":56,"h":65,"n":20,"px":28,"py":32,"fps":15,"loop":true,"im":7},"x-flame":{"y":703,"w":43,"h":126,"n":16,"px":21,"py":120,"fps":15,"loop":true,"im":7},"x-boom":{"y":829,"w":96,"h":96,"n":16,"px":48,"py":48,"fps":15,"loop":true,"im":7},"x-arc":{"y":925,"w":77,"h":77,"n":16,"px":38,"py":38,"fps":15,"loop":true,"im":7},"x-star":{"y":1002,"w":77,"h":77,"n":16,"px":38,"py":38,"fps":15,"loop":true,"im":7},"bm-purp":{"y":1079,"w":64,"h":24,"n":1,"px":32,"py":12,"fps":12,"loop":false,"im":7},"bm-dark":{"y":1103,"w":16,"h":40,"n":1,"px":8,"py":20,"fps":12,"loop":false,"im":7}},
  S:{u:['x-sun',.32],1:['x-midnight',.5],3:['x-fel',.3],7:['x-nebula',.32],8:['x-spell',.5],9:['x-sun',.34],10:['x-phantom',.34],12:['x-vortex',.36],17:['x-sun',.38],18:['x-nebula',.38],19:['x-vortex',.4]},
  init(){Object.assign(VFX.M,this.M);const im=new Image();im.onload=()=>{VFX.I7=im};im.src=this.D},
  of(f){return VFX.ok()&&VFX.I7?this.S[f.c==null?'u':f.c]:null},
  shot(f,fx,fy,t){const q=this.of(f);if(!q)return false;if(f.sd==null)f.sd=Math.random()*16;const s=f.s||1,n=q[0];x.save();x.globalCompositeOperation='lighter';
    VFX.frame(x,n,Math.floor(t*15+f.sd),fx,fy,q[1]*s,f.vx<0?-1:1,n=='x-sun'||n=='x-nebula'?t*4*sgn(f.vx||1):0,1);x.restore();return true}};
FX29.init();
// 第二十七轮:法师新进阶技能的图标用 MG27 / SMN 图集拼(图集载入后替换 ICON)
function mgIcons(){const N=192,mk=(id,c1,c2,fn)=>{const cv=document.createElement('canvas');cv.width=cv.height=N;const c=cv.getContext('2d');c.imageSmoothingEnabled=false;const g=c.createLinearGradient(0,0,N,N);g.addColorStop(0,c1);g.addColorStop(1,c2);
    c.fillStyle=g;c.beginPath();c.roundRect?c.roundRect(0,0,N,N,36):c.rect(0,0,N,N);c.fill();c.strokeStyle='rgba(255,255,255,.25)';c.lineWidth=8;c.stroke();c.save();c.globalCompositeOperation='lighter';fn(c);c.restore();ICON[id]=cv.toDataURL();delete SKIMG[id]},
    fr=(c,n,cx,cy,s,sy)=>{const m=VFX.M[n];c.save();c.translate(cx,cy);c.scale(s,s*(sy||1));c.drawImage(VFX.I6,0,m.y,m.w,m.h,-m.px,-m.py,m.w,m.h);c.restore()};
  mk('staff5','#2e2405','#a07a10',c=>fr(c,'mc-gold',96,96,1.55));
  mk('staff6','#2e0e04','#c2410c',c=>{fr(c,'mc-fire',96,150,1.4,.3);c.globalCompositeOperation='source-over';if(SMN.I)SMN.fr(c,'b',1,96,92,4.6,1)});
  mk('staff7','#0b1028','#1864ab',c=>{fr(c,'bm-blue',96,96,2,6);fr(c,'mc-blue',96,172,1.4,.3)});
  if(skOpen)renderSk()}
// 技能特效快捷方式:叠加画、默认停在最后一帧
const SFX5=(n,x0,y0,o)=>VFX.spawn(n,x0,y0,Object.assign({add:1,hold:1,fi:.04},o||{}));

const NPCLOOK={
  '技能导师':{hs:'elf',hair:'#d0bfff',hl:'#f3f0ff',eye:'#7048e8',robe:1,top:'#7048e8',top2:'#4b2bb5',belt:'#ffd43b',wpn:{k:'staff',arm:.95,glow:'rgba(229,153,247,.6)'},skin:'#ffe3c8'},
  '装备商人':{hs:'cap',hair:'#8a5a2e',capc:'#e8590c',eye:'#2f9e44',top:'#ff922b',top2:'#e8590c',belt:'#8a5a32',must:'#6b3a1e',wpn:{k:'bag',arm:1.1},skin:'#ffd8b0'},
  '药剂师':{hs:'twin',hair:'#96f2d7',hl:'#e6fcf5',eye:'#0ca678',robe:1,top:'#38d9a9',top2:'#0b7285',belt:'#ffd43b',hat:'band',hatc:'#ff8fab',wpn:{k:'flask',arm:.55},skin:'#ffe3c8'},
  '强化师':{hs:'bald',hair:'#868e96',eye:'#1c7ed6',top:'#2b8a3e',top2:'#1e6b30',belt:'#6b4423',beard:'#adb5bd',angry:1,wpn:{k:'hammer',arm:.5,a:-.7},skin:'#f2c9a0'},
  '仓库管理员':{hs:'twin',hair:'#c0582a',eye:'#1c7ed6',robe:1,top:'#364fc7',top2:'#7a2e3a',belt:'#6b4423',skin:'#ffe3c8'}};  // 第三十二轮:只给 Ars / 旧版人物形象兜底用
function drawNPC(c,a,look,t,f,k){if(k&&PXA.npc(c,k,a,t,f||1))return;c.save();c.translate(a,GY);c.scale(f||1,1);SHD(c,0,0,14);c.scale(1.1,1.1);drawChibi(c,{...look,t});c.restore()}
function drawTown(){const t=performance.now()/1000,c0=Math.round(cam),I=TWN.I;
  if(MYS)MYST.hub(t);else{x.fillStyle='#8fd3ff';x.fillRect(0,0,VW,VH);
  if(TWN.ready()){x.imageSmoothingEnabled=false;x.drawImage(I.far,0,0);x.drawImage(I.hill,-Math.round(cam*.35),0);x.drawImage(I.back,-Math.round(cam*.7),0);x.drawImage(I.main,-c0,0);x.imageSmoothingEnabled=true}
  x.save();x.translate(-c0,0);
  // 路灯的暖光
  x.save();x.globalCompositeOperation='lighter';for(const a of TWN.lamps){const b=GY-44;C_(x,a,b,14+Math.sin(t*3+a)*1.5,RGD(x,a,b,15,['rgba(255,214,120,.45)','rgba(0,0,0,0)']),0)}x.restore();
  // 药剂师木箱上的药水冒泡泡
  for(let i=0;i<4;i++){const k=(t*.5+i/4)%1,bx=[505,514,523,509][i];C_(x,bx+Math.sin(k*9+i)*2,GY-46-k*26,1+k*1.6,['rgba(255,170,170,','rgba(180,220,255,','rgba(255,236,150,','rgba(180,255,200,'][i]+(.7*(1-k))+')',0)}
  // 熔炉(LPC Blacksmith 小熔炉 3 帧火光)+ 炉口光晕 + 烟囱冒烟
  {const fx=TWN.forge;if(I.forge){x.imageSmoothingEnabled=false;x.drawImage(I.forge,(Math.floor(t*8)%3)*64,0,64,128,fx-32,GY-128,64,128);x.imageSmoothingEnabled=true}
   x.save();x.globalCompositeOperation='lighter';C_(x,fx,GY-40,22+Math.sin(t*9)*2,RGD(x,fx,GY-40,24,['rgba(255,150,50,.55)','rgba(0,0,0,0)']),0);x.restore();
   for(let i=0;i<3;i++){const k=(t*.6+i/3)%1;C_(x,fx-14+Math.sin(k*6)*4,GY-130-k*50,4+k*7,'rgba(220,220,230,'+(.5*(1-k))+')',0)}
   if(Math.random()<.08)pt({x:fx+rnd(-8,8),y:GY-36,vx:rnd(-20,20),vy:rnd(-80,-40),c:pick(['#ffd43b','#ff922b']),s:1.5,l:.5,sh:1})}
  // 传送门(高台 B 上):5 帧漩涡 + 淡紫光
  {const [px_,py_]=TWN.portal,m=TPX.M.portal;x.save();x.globalCompositeOperation='lighter';E_(x,px_,py_-50,40,52,RGD(x,px_,py_-50,52,['rgba(132,94,247,'+(.28+.08*Math.sin(t*3))+')','rgba(0,0,0,0)']),0);x.restore();
   if(TPX.I){x.imageSmoothingEnabled=false;TPX.spr(x,'portal',Math.floor(t*m.fps)%m.n,px_-m.ax,py_-m.ay);x.imageSmoothingEnabled=true}
   for(let i=0;i<6;i++){const k=(t*.8+i/6)%1;x.fillStyle='#e7f5ff';x.fillRect(Math.round(px_+Math.cos(i*2+t)*22*(1-k)),Math.round(py_-46+Math.sin(i*2+t)*26*(1-k)),1,1)}
   PLQ(x,px_,py_-118,'传送门','世界地图')}
  // 女神像(通关第二关后出现,广场中央)
  if(CLR.includes(2)&&TPX.I){const sx=TWN.statue,tb=GY-50,m=TPX.M.statue,g=.55+.3*Math.sin(t*2.5);x.imageSmoothingEnabled=false;TPX.spr(x,'statue',0,sx-m.ax,GY-m.ay);x.imageSmoothingEnabled=true;
    x.save();x.globalCompositeOperation='lighter';x.globalAlpha=g*.6;x.strokeStyle='#66d9e8';x.lineWidth=4;x.beginPath();x.moveTo(sx-6,GY-14);x.lineTo(sx-6,GY-28);x.arc(sx,GY-28,6,Math.PI,0);x.lineTo(sx+6,GY-14);x.stroke();x.restore();
    for(let i=0;i<6;i++){const k=(t*.35+i/6)%1;x.globalAlpha=Math.sin(k*Math.PI)*.8;x.fillStyle='#fff3bf';x.fillRect(Math.round(sx-60+((i*47)%120)),Math.round(tb-10-k*60),1,1)}x.globalAlpha=1;PLQ(x,sx,GY-112,'女神像')}
  // 书架(第三十一轮,Bookshelf / AlejandroHaibi,CC0)
  if(BOOK.I){const bx=TWN.shelf;x.imageSmoothingEnabled=false;x.drawImage(BOOK.I,0,0,34,60,bx-17,GY-60,34,60);x.imageSmoothingEnabled=true;PLQ(x,bx,GY-74,'书架','阅读书籍')}
  PLQ(x,TWN.forge,GY-140,'熔炉','合成强化石');
  // NPC(y 不在地面的 NPC 整体平移过去画)
  for(const n of NPCS){const dy=n.y-GY;x.save();x.translate(0,dy);drawNPC(x,n.x,NPCLOOK[n.n],t+n.x,P.x+12<n.x?-1:1,n.n);const px_=PXA.has(n.n)||LNPC.on(n.n);PLQ(x,n.x,GY-(px_?64:76),n.n,{'技能导师':'学习 / 升级技能','药剂师':'购买药水','装备商人':'买卖装备','强化师':'强化装备','仓库管理员':'存取物品'}[n.n]);if(mqGiver(n.n))CT(mqDone()?'❓':'❗',n.x,GY-(px_?84:96)+Math.sin(t*5)*3,16,'#ffd43b','center',3);x.restore()}
  if(CLR.includes(3))drawChief();
  totemDraw(t);  // 第四十七轮:部落图腾 + 星界财宝
  x.restore();if(soulN()>0)MYST.pillar(MYTP[0],MYTP[1],t,'177,151,252','神秘光柱','神秘地带')}  // 神秘光柱:技能导师树屋高台右端
  drawSM();PXL.run(drawTor,TOR.length>0||!!LCK);drawPet();drawHamPet();PXL.run(drawShots,F.length+PB.length>0);drawStarF(cam);PXL.run(trailDraw,SWTR.length>1);drawP();drawHamShd();PXL.run(thrDraw,THR.length>0);PXL.run(()=>drawFairy(x,SPRP.x-cam,SPRP.y,t,1,P.f),!!(SPR.own&&SPR.on),PXL.bb([[SPRP.x-cam,SPRP.y]],48));
  // 前景(草丛、垂下的叶丛)盖在人物前面,显出前后层次
  if(TWN.ready()&&!MYS){x.imageSmoothingEnabled=false;x.drawImage(I.fg,-c0,0);x.imageSmoothingEnabled=true}
  if(FX.dk>0){x.fillStyle='rgba(8,12,28,'+FX.dk+')';x.fillRect(0,0,VW,VH)}PXL.run(()=>{drawSk();drawFX();VFX.draw()});drawSkBar();if(FX.fl>0){x.fillStyle='rgba('+FX.fc+','+FX.fl+')';x.fillRect(-10,-10,VW+20,VH+20)}drawTX();x.globalAlpha=1;
  // 标题(像素羊皮纸卷轴)+ 操作提示
  {const tn=MYS?'神秘地带':'晨曦镇';if(PUI.on()){const w=Math.round(PUI.tw(tn,24)+76);PUI.h3(x,'hdr',320-w/2,12,w,30,30,null,1);CT(tn,320,36,24,'#5a2e12','center',2,'#fff3d6')}else CTG(tn,320,36,24)}
  CT(MYS?'走到发光的石狮嘴前按 W 进入神秘副本,回城光柱按 W 返回晨曦镇':'← → 在镇上走动,走到 NPC、熔炉或传送门前按 W 互动',320,54,9,'#fff','center',2.4,'#3a1d0a');
  // 互动气泡(世界坐标 → 屏幕)
  {const q=!DLG&&townSpot();if(q){const qx=q.x-c0,by=q.y-(q.bh||(q.n=='传送门'?150:q.n=='熔炉'?160:106))+Math.sin(t*5)*2,txt_='W '+(q.v||(q.n=='村长'?'对话':'交谈'));
    if(PUI.on()){const bw=Math.round(PUI.tw(txt_,11)+24),bx=Math.round(qx-bw/2),yy=Math.round(by-12),tx_=Math.round(qx);PUI.ns(x,'tG2',9,8,10,8,bx,yy,bw,22);
      for(let r=0;r<5;r++){x.fillStyle='#3a1d0a';x.fillRect(tx_-5+r,yy+20+r,11-2*r,1);if(r<4){x.fillStyle='#f4a13a';x.fillRect(tx_-4+r,yy+20+r,9-2*r,1)}}
      CT(txt_,qx,by+3,11,'#fff','center',2.6,'#7a3a08')}
    else{x.font='900 11px '+CTF;const bw=x.measureText(txt_).width+22;RR(x,qx-bw/2,by-11,bw,20,10,LG(x,0,by-11,0,by+9,['#ffe066','#f08c00']),1.6);PG(x,[[qx-5,by+8],[qx,by+14],[qx+5,by+8]],'#f08c00',1.2);CT(txt_,qx,by+4,11,'#fff','center',2.6,'#7a3a08')}}}
  if(performance.now()<msgU&&!DLG){x.font='900 12px '+CTF;const mw=x.measureText(msg).width+30;RR(x,320-mw/2,70,mw,24,12,'rgba(43,26,18,.82)',1.4);CT(msg,320,87,12,'#fff3bf','center',2.4)}
  drawDlg()}
function drawChief(){const a=TWN.chief,t=performance.now()/1000;drawNPC(x,a,{hs:'old',hair:'#f1f3f5',beard:'#f8f9fa',eye:'#5c3a1e',robe:1,top:'#5c7cfa',top2:'#364fc7',belt:'#ffd43b',wpn:{k:'cane',arm:1.1},skin:'#f7d2b0',closed:1},t,P.x+12<a?-1:1,'村长');
  PLQ(x,a,GY-76,'村长');if(chiefNew()||mqGiver('村长'))CT(!chiefNew()&&mqDone()?'❓':'❗',a,GY-96+Math.sin(t*5)*3,16,'#ffd43b','center',3)}
// 女神(漫画 + 女神像):原点在脚底中间
// 女神(漫画 + 女神像):原点在脚尖,面朝前。修长的身形、长发、垂到脚踝的长裙,踮着脚尖;
// 背后一对向两侧大大展开、末端下垂的羽翼。stone=1 是石像:灰白石质,羽翼边缘有发光的金色裂纹
function drawAngel(c,t,stone){const S=!!stone,wf=S?0:Math.sin(t*2.4)*3,tw=t||0;
  const wc=S?['#f4f0f2','#cfc7ce','#958c9a']:['#ffffff','#eef4ff','#b9cbe8'],skin=S?LG(c,0,-70,0,0,['#ece7ea','#b8b0b9']):'#ffe3c8',hairC=S?['#d9d2d8','#9d949f']:['#fff3bf','#f2b632'],dress=S?['#e3dde1','#a69ea8']:['#ffffff','#dbe4ff'];
  // —— 羽翼(先画,在身体后面)
  for(const d of [-1,1]){c.save();c.scale(d,1);
    const pts=[[5,-50],[14,-66+wf*.4],[34,-78+wf],[60,-80+wf],[84,-72+wf],[100,-56+wf*.8],[106,-34+wf*.5],[103,-12+wf*.3]];
    const sc=[[96,-8],[90,-18],[82,-13],[75,-23],[66,-19],[58,-28],[48,-24],[40,-33],[30,-30],[20,-38],[10,-42]];
    c.beginPath();c.moveTo(...pts[0]);for(let i=1;i<pts.length-1;i++){const mx=(pts[i][0]+pts[i+1][0])/2,my=(pts[i][1]+pts[i+1][1])/2;c.quadraticCurveTo(pts[i][0],pts[i][1],mx,my)}c.lineTo(...pts[pts.length-1]);
    let pv=pts[pts.length-1];for(const q of sc){c.quadraticCurveTo((pv[0]+q[0])/2+1,Math.max(pv[1],q[1])+7,q[0],q[1]);pv=q}c.closePath();
    c.fillStyle=fc(LG(c,0,-80,0,-10,wc));c.fill();c.strokeStyle=OL;c.lineWidth=1.4;c.lineJoin='round';c.stroke();
    // 羽毛层次:三排弧线
    c.strokeStyle=S?'rgba(110,100,115,.45)':'rgba(140,170,220,.5)';c.lineWidth=1;
    for(const [k,o] of [[.35,0],[.6,1],[.82,2]]){c.beginPath();for(let i=0;i<7;i++){const u=i/6,px=12+u*(84-o*6),py=-62+wf+u*(18+o*6)+o*10+Math.sin(u*3.1)*-10*(1-k);if(!i)c.moveTo(px,py);else c.quadraticCurveTo(px-6,py+5,px,py)}c.stroke()}
    for(let i=0;i<6;i++){const px=30+i*12,py=-60+wf+i*4;LN_(c,[[px,py],[px+8,py+16+i*1.5]],S?'rgba(110,100,115,.35)':'rgba(140,170,220,.4)',1)}
    if(S){// 发光的金色裂纹
      const cr=[[[40,-77],[46,-70],[54,-73],[60,-66]],[[84,-72],[86,-62],[93,-58]],[[103,-30],[98,-24],[100,-16]],[[18,-62],[24,-56],[30,-58]],[[64,-32],[70,-38],[76,-36]]];
      c.save();c.globalCompositeOperation='lighter';for(const L of cr){c.globalAlpha=.35+.25*Math.sin(tw*2+L[0][0]);LN_(c,L,'#ffd43b',3.2)}c.restore();for(const L of cr)LN_(c,L,'#f59f00',1)}
    c.restore()}
  // —— 长发(背后)
  SMO(c,[[-8,-64],[-11,-52],[-12,-40],[-8,-34],[0,-36],[8,-34],[12,-40],[11,-52],[8,-64]],LG(c,0,-66,0,-34,hairC),1.2);
  // —— 腿:踮着脚尖,一条腿伸直点地,一条腿微微后屈
  TUBE(c,[[-1.4,-16],[-1,-6],[-.4,0]],2.6,S?'#c9c1c8':'#ffe3c8');TUBE(c,[[2,-16],[3.4,-8],[5.6,-4]],2.6,S?'#b8b0b9':'#ffd8b0');
  // —— 长裙(随风向一侧飘)
  const sw=S?0:Math.sin(tw*2)*1.5;SMO(c,[[-5.5,-49],[5.5,-49],[4.6,-38],[8+sw,-24],[10+sw,-14],[3,-15],[-2,-13],[-8+sw*.5,-15],[-6.5,-26],[-4.6,-38]],LG(c,0,-50,0,-13,dress),1.3);
  LN_(c,[[-1,-36],[-3+sw*.5,-16]],S?'rgba(110,100,115,.4)':'rgba(150,170,220,.5)',1);LN_(c,[[2.4,-36],[5+sw,-17]],S?'rgba(110,100,115,.4)':'rgba(150,170,220,.5)',1);
  if(!S)LN_(c,[[-4.6,-38],[4.6,-38]],'#ffd43b',1.4);
  // —— 手臂:自然垂在身体两侧、稍稍张开
  TUBE(c,[[-5,-48],[-9,-40],[-12,-31]],2.4,S?'#d2cbd1':'#ffe3c8');TUBE(c,[[5,-48],[9,-40],[12,-31]],2.4,S?'#d2cbd1':'#ffe3c8');
  // —— 头 + 刘海 + 垂在胸前的发丝
  E_(c,0,-57,6,6.8,skin,1.2);
  SMO(c,[[-7,-58],[-6.5,-64.5],[0,-67],[6.5,-64.5],[7,-58],[4,-62],[0,-61],[-4,-62]],LG(c,0,-67,0,-58,hairC),1.1);
  TUBE(c,[[-5.6,-58],[-6.4,-50],[-5,-42]],2.6,hairC[1]);TUBE(c,[[5.6,-58],[6.4,-50],[5,-42]],2.6,hairC[1]);
  LN_(c,[[-3.2,-56.4],[-1.2,-56.4]],S?'#8a8290':'#5c3a1e',.9);LN_(c,[[1.2,-56.4],[3.2,-56.4]],S?'#8a8290':'#5c3a1e',.9);c.beginPath();c.arc(0,-53.4,1,.3,2.8);c.strokeStyle=OL;c.lineWidth=.7;c.stroke();
  if(!S){c.save();c.strokeStyle='#ffd43b';c.lineWidth=1.8;c.beginPath();c.ellipse(0,-71,7,2.2,0,0,7);c.stroke();c.restore()}}
// =====================================================================
