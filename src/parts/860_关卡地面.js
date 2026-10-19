// ===== 关卡地面 / 浮空平台 / 大树像素化(LTL,像素化第 ③ 步,art_src/lv/build_ltl.py,一关一张图集)=====
// 一~三关 SunnyLand Forest 地块 + 大橡树 / 弯干树 / 松树(按关换色调)· 四关 Gothicvania Swamp · 五关 Desert Tilesets(限色成像素)· 六七关 Seasonal Platformer Tiles 冬天的雪地(七关夜色);看 build_ltl.py
// gnd = 可平铺的地面条(草顶在 GY-oy);plat = 4 块 16×h(左端、中段、中段 2、右端);tree = 大树([世界 x, 种类],脚底在 GY,画在人物身后)
const LTL={L:{
    1:{D:'@@A:ltl1@@',M:{"gnd":{"x":0,"y":0,"w":256,"h":64,"oy":3},"plat":{"y":64,"h":32,"oy":3},"tree":{"oak":{"x":0,"y":98,"w":210,"h":223,"ax":102},"twist":{"x":212,"y":98,"w":111,"h":109,"ax":58},"pine":{"x":325,"y":98,"w":73,"h":124,"ax":42}}},trees:[[250,'oak'],[700,'twist'],[980,'pine'],[1360,'oak'],[1720,'pine'],[2010,'twist'],[2300,'pine'],[2620,'oak']]},
    2:{D:'@@A:ltl2@@',M:{"gnd":{"x":0,"y":0,"w":256,"h":64,"oy":3},"plat":{"y":64,"h":32,"oy":3},"tree":{"oak":{"x":0,"y":98,"w":210,"h":223,"ax":102},"twist":{"x":212,"y":98,"w":111,"h":109,"ax":58},"pine":{"x":325,"y":98,"w":73,"h":124,"ax":42}}},trees:[[260,'oak'],[760,'pine'],[1150,'twist'],[1600,'oak'],[2050,'pine'],[2500,'twist']]},
    3:{D:'@@A:ltl3@@',M:{"gnd":{"x":0,"y":0,"w":256,"h":64,"oy":3},"plat":{"y":64,"h":32,"oy":3},"tree":{"oak":{"x":0,"y":98,"w":210,"h":223,"ax":102},"twist":{"x":212,"y":98,"w":111,"h":109,"ax":58},"pine":{"x":325,"y":98,"w":73,"h":124,"ax":42}}},trees:[[200,'oak'],[620,'twist'],[900,'pine'],[1300,'oak'],[1700,'pine'],[2000,'twist'],[2400,'oak']]},
    4:{D:'@@A:ltl4@@',M:{"gnd":{"x":0,"y":0,"w":400,"h":64,"oy":8},"plat":{"y":64,"h":32,"oy":4},"tree":{"oak":{"x":0,"y":98,"w":210,"h":223,"ax":102},"weed":{"x":212,"y":98,"w":38,"h":34,"ax":22},"bush":{"x":252,"y":98,"w":45,"h":32,"ax":17}}},trees:[[240,'oak'],[560,'weed'],[820,'bush'],[1200,'oak'],[1500,'weed'],[1900,'oak'],[2250,'bush'],[2500,'weed']]},
    5:{D:'@@A:ltl5@@',M:{"gnd":{"x":0,"y":0,"w":192,"h":64,"oy":4},"plat":{"y":64,"h":24,"oy":3},"tree":{"cactus":{"x":0,"y":90,"w":59,"h":70,"ax":28},"pillar":{"x":61,"y":90,"w":64,"h":87,"ax":32},"cacti":{"x":127,"y":90,"w":42,"h":47,"ax":18}}},trees:[[250,'cactus'],[600,'cacti'],[880,'pillar'],[1300,'cactus'],[1620,'cacti'],[1950,'pillar'],[2300,'cactus']]},
    6:{D:'@@A:ltl6@@',M:{"gnd":{"x":0,"y":0,"w":192,"h":64,"oy":3},"plat":{"y":64,"h":32,"oy":3},"tree":{"bigpine":{"x":0,"y":98,"w":120,"h":128,"ax":60},"pine":{"x":122,"y":98,"w":60,"h":64,"ax":30},"ball":{"x":184,"y":98,"w":32,"h":28,"ax":16}}},trees:[[260,'bigpine'],[800,'pine'],[1100,'bigpine'],[1550,'pine'],[2050,'bigpine'],[2450,'pine']]},
    7:{D:'@@A:ltl7@@',M:{"gnd":{"x":0,"y":0,"w":192,"h":64,"oy":3},"plat":{"y":64,"h":32,"oy":3},"tree":{"bigpine":{"x":0,"y":98,"w":120,"h":128,"ax":60},"pine":{"x":122,"y":98,"w":60,"h":64,"ax":30},"ball":{"x":184,"y":98,"w":32,"h":28,"ax":16}}},trees:[[300,'bigpine'],[600,'pine'],[1150,'bigpine'],[1600,'pine'],[1850,'bigpine'],[2450,'pine']]}
  },I:{},
  init(){for(const k in this.L){const im=new Image();im.onload=()=>{this.I[k]=im};im.src=this.L[k].D}},
  on(){return SET.art!==0&&!!this.I[cur]},
  trees(){const L=this.L[cur],I=this.I[cur];x.imageSmoothingEnabled=false;
    for(const [wx,k] of L.trees){const m=L.M.tree[k],sx=Math.round(wx-cam-m.ax);if(sx>VW||sx+m.w<0)continue;x.drawImage(I,m.x,m.y,m.w,m.h,sx,GY-m.h+2,m.w,m.h)}x.imageSmoothingEnabled=true},
  ground(p){const M=this.L[cur].M.gnd,I=this.I[cur],x0=Math.max(p.x,cam-4),x1=Math.min(p.x+p.w,cam+VW+4);if(x1<=x0)return;
    x.save();x.beginPath();x.rect(x0-cam,0,x1-x0,VH);x.clip();x.imageSmoothingEnabled=false;
    for(let px=Math.floor(x0/M.w)*M.w;px<x1;px+=M.w)x.drawImage(I,M.x,M.y,M.w,M.h,Math.round(px-cam),GY-M.oy,M.w,M.h);x.restore()},
  // 平台:左端 + 中段(两种交替,按宽度裁)+ 右端;每块 16 宽、plat.h 高
  plat(p){const M=this.L[cur].M.plat,I=this.I[cur],px=Math.round(p.x-cam),y=Math.round(p.y-M.oy),w=Math.round(p.w),h=M.h;x.imageSmoothingEnabled=false;
    x.drawImage(I,0,M.y,16,h,px,y,16,h);for(let k=16;k<w-16;k+=16){const q=Math.min(16,w-16-k);x.drawImage(I,((k>>4)%3==2?2:1)*16,M.y,q,h,px+k,y,q,h)}x.drawImage(I,48,M.y,16,h,px+w-16,y,16,h);x.imageSmoothingEnabled=true}};LTL.init();
const BGC={};
function lvArt(){if(BGC[cur])return BGC[cur];const A=LVA[cur],W=960;const o={far:mkL(W,A.fy==0?306:270,A.far,A.fy==0?0:36),mid:mkL(W,200,A.mid,104),near:mkL(W,72,A.near,236),
  tile:mkL(96,76,(c,w,h)=>{const G=A.ground;c.translate(0,12);c.fillStyle=LG(c,0,0,0,64,G.body);c.fillRect(0,0,w,64);for(let r=0;r<3;r++)for(let k=-1;k<3;k++){const bx=k*40+(r%2)*20+4,by=10+r*18;RR(c,bx,by,34,14,4,LG(c,0,by,0,by+14,[G.stone,G.dark]),1.1);E_(c,bx+9,by+4,6,2,'rgba(255,255,255,.15)',0)}
    c.translate(0,-8);c.beginPath();c.moveTo(-2,0);c.lineTo(w+2,0);c.lineTo(w+2,9);for(let px=w;px>=0;px-=12)c.quadraticCurveTo(px-6,18,px-12,9);c.lineTo(-2,9);c.closePath();FS_(c,LG(c,0,0,0,16,G.lip),0);
    c.beginPath();for(let px=w;px>=0;px-=12){c.moveTo(px,9);c.quadraticCurveTo(px-6,18,px-12,9)}c.strokeStyle=OL;c.lineWidth=1.4;c.stroke();LN_(c,[[-2,.8],[w+2,.8]],OL,1.4);LN_(c,[[-2,2.6],[w+2,2.6]],'rgba(255,255,255,.35)',1.4)}),
  sky:mkL(VW,VH,c=>{c.fillStyle=LG(c,0,0,0,GY,A.sky);c.fillRect(0,0,VW,VH);
    if(A.stars)for(let i=0;i<50;i++)C_(c,(i*97)%VW,(i*53)%170,i%7?1:1.6,'rgba(255,249,219,'+(.5+.5*((i*7)%3)/2)+')',0);
    if(A.sun){const sx=500,sy=cur==5?78:60;C_(c,sx,sy,70,RGD(c,sx,sy,70,['rgba(255,240,180,.75)','rgba(255,220,120,0)']),0);C_(c,sx,sy,26,RGD(c,sx-6,sy-6,30,['#fffbe6','#ffe066','#ffb52e']),1.4)}
    if(A.moon){const sx=520,sy=70;C_(c,sx,sy,80,RGD(c,sx,sy,80,['rgba(220,230,255,.5)','rgba(0,0,0,0)']),0);C_(c,sx,sy,30,RGD(c,sx-8,sy-8,34,['#ffffff','#e7f0ff','#b9c9ea']),1.2);for(const [a,b,r] of [[-9,-6,5],[8,6,6],[4,-12,3]])C_(c,sx+a,sy+b,r,'rgba(160,175,210,.45)',0)}}),
  fog:A.fog?mkL(VW,120,c=>{c.fillStyle=LG(c,0,180,0,300,['rgba(120,200,150,0)','rgba(150,90,200,.22)','rgba(120,200,150,.28)']);c.fillRect(0,180,VW,120)},180):null,
  clouds:mkL(W,160,(c,w)=>{W3(w,o2=>{for(let i=0;i<5;i++)cloudP(c,i*w/5+o2+30,40+((i*37)%70),.9+((i*13)%5)/10,cur==2?'#4b3a78':cur==4?'#2f5a45':cur==7?'#3a4470':'#fff',cur==2?'rgba(20,10,40,.6)':cur==4||cur==7?'rgba(10,20,40,.6)':null)})})};
  return BGC[cur]=o}
function bg(){if(isTw(cur)){CST.bg();x.fillStyle='rgba(8,48,18,.42)';x.fillRect(0,0,VW,VH);return}  /* 第五十六轮:暗黑炼狱 = 永夜王城的城堡压一层绿光 */if(isDm(cur)){dmBg();return}if(cur==21){IFN.bg();return}if(cur==20){RBT.bg();return}if(cur==19){ALC.bg();return}if(cur==18){NJA.bg();return}if(cur==16){FIRE.bg();return}if(cur==15){CST.bg();return}if(cur==14){MECH.bg();return}if(cur>=11){const t=performance.now()/1000;if(cur==12)GP.arena2(t);else if(cur==13)GP.arena3(t);else{MYST.arena(t);if(cur==MY4){x.fillStyle='rgba(20,10,36,.55)';x.fillRect(0,0,VW,VH)}}return}if(cur==10){if(SHIP10.I)SHIP10.bg();else{x.fillStyle='#0b1420';x.fillRect(0,0,VW,VH)}return}  // 第十关:像素场景 SHIP10
  if(cur==9){if(VOL9.I)VOL9.bg();else{x.fillStyle='#1c0507';x.fillRect(0,0,VW,VH)}return}  // 第九关:像素场景 VOL9
  if(cur==8){if(CITY8.I)CITY8.bg();else{x.fillStyle='#07060f';x.fillRect(0,0,VW,VH)}return}  // 第八关:像素场景 CITY8(没有矢量兜底)
  const A=LVA[cur]||LVA[1],L=lvArt(),t=performance.now()/1000;
  const px=LBG.on();if(px)LBG.draw(t);else{
  x.imageSmoothingEnabled=false;x.drawImage(L.sky,0,0,VW,VH);x.imageSmoothingEnabled=true;if(cur==7)moon7();
  tileL(L.clouds,.06,0,t*6);tileL(L.far,.15,0);tileL(L.mid,.4,0)}
  if(A.fog){x.imageSmoothingEnabled=false;x.drawImage(L.fog,0,180,VW,120);x.imageSmoothingEnabled=true;for(let i=0;i<14;i++){const fx=((i*131-cam*.7)%VW+VW)%VW,fy=90+(i*47)%180+Math.sin(t*2+i)*8;x.globalAlpha=.35;C_(x,fx,fy,3.4,'#d8f5a2',0);x.globalAlpha=.9;C_(x,fx,fy,1.4,'#f4fce3',0)}x.globalAlpha=1}
  if(!px)tileL(L.near,.75,0);
  if(LTL.on())LTL.trees();
  lair();
  for(const p of PL)if(p.y==GY){if(LTL.on())LTL.ground(p);else drawGround(p,A.ground,L)}else if(LTL.on()){if(!p.blk&&!p.gone&&p.x-cam<VW+20&&p.x+p.w-cam>-20)LTL.plat(p)}else drawPlat(p,A.ground);
  if(cur==5)cave5();
  if(cur==6){iceDraw();snowDraw()}if(cur==7)lv7Draw();
  for(const w of WZ){const wx=w.x-cam;x.globalAlpha=Math.min(1,w.t);x.strokeStyle='#f1f3f5';x.lineWidth=1.5;x.beginPath();for(let i=0;i<=5;i++){x.moveTo(wx+w.w/2,GY-2);x.lineTo(wx+i*w.w/5,GY-10+(i%2)*4)}x.moveTo(wx,GY-4);x.lineTo(wx+w.w,GY-4);x.stroke();x.globalAlpha=1}hzDraw()}
function drawGround(p,G,L){const x0=Math.max(p.x,cam-4),x1=Math.min(p.x+p.w,cam+VW+4);if(x1<=x0)return;
  x.save();x.beginPath();x.rect(x0-cam,GY-6,x1-x0,90);x.clip();x.imageSmoothingEnabled=false;for(let px=Math.floor(x0/96)*96;px<x1;px+=96)x.drawImage(L.tile,Math.floor((px-cam)*RS)/RS,GY-4,96+1/RS,76);x.imageSmoothingEnabled=true;x.restore()}
function drawPlat(p,G){const px=p.x-cam;if(px>VW+20||px+p.w<-20)return;if(p.blk||p.gone)return;
  if(cur==6&&p.ice)G={...G,lip:['#e7f5ff','#74c0fc'],body:['#a5d8ff','#5c9ad6'],stone:'#d0ebff'};
  E_(x,px+p.w/2,p.y+24,p.w*.45,4,'rgba(0,0,0,.18)',0);RR(x,px,p.y+1,p.w,15,7,LG(x,0,p.y,0,p.y+16,G.body),1.4);for(let k=8;k<p.w-10;k+=26)RR(x,px+k,p.y+5,18,7,3,G.stone,.8);
  RR(x,px-3,p.y-4,p.w+6,9,4.5,LG(x,0,p.y-4,0,p.y+5,G.lip),1.4);LN_(x,[[px+2,p.y-2],[px+p.w-2,p.y-2]],'rgba(255,255,255,.4)',1.2);
  for(let k=10;k<p.w-6;k+=22)E_(x,px+k,p.y+5,2.6,3.6+(k%3),G.lip[1],.8)}
