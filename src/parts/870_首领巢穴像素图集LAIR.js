// ===== 首领巢穴像素图集 LAIR(art_src/lv/build_lair.py,素材见脚本开头):七关巢穴各一张图 + 第五关洞穴的墙 / 洞顶 / 侧墙 / 栅门 =====
// M:[图集 x, y, 宽, 高];巢穴图底边 = 地面 GY,左边相对巢穴原点的偏移见 LAIR.OX
// 图集平铺:q = [x,y,w,h],在屏幕 (X,Y,W,H) 里平铺,只画屏幕里的部分
function atlasTile(I,q,X,Y,W,H){const [qx,qy,w,h]=q;X=Math.round(X);Y=Math.round(Y);
  for(let yy=0;yy<H;yy+=h)for(let xx=Math.max(0,Math.floor(-X/w)*w);xx<W&&X+xx<VW;xx+=w){const cw=Math.min(w,W-xx),ch=Math.min(h,H-yy);x.drawImage(I,qx,qy,cw,ch,X+xx,Y+yy,cw,ch)}}
const LAIR={I:null,D:'@@A:lair_atlas@@',M:{"l3":[0,0,232,342],"l2":[234,0,148,304],"l1":[384,0,184,216],"l6":[570,0,234,192],"l4":[806,0,214,172],"l7":[0,344,152,164],"c5gate":[154,344,26,120],"c5ceil":[182,344,160,84],"c5side":[344,344,34,64],"c5wall":[380,344,32,32]},OX:{l1:-6,l2:-14,l3:-34,l4:-32,l6:-42,l7:-76},
  init(){const im=new Image();im.onload=()=>{this.I=im};im.src=this.D},
  on(){return SET.art!==0&&!!this.I},
  spr(k,X,Y){const q=this.M[k];x.drawImage(this.I,q[0],q[1],q[2],q[3],Math.round(X),Math.round(Y),q[2],q[3])},
  // 在 (X,Y,W,H) 里平铺 k,只画屏幕里的部分
  tile(k,X,Y,W,H){atlasTile(this.I,this.M[k],X,Y,W,H)},
  lair(o){const k='l'+cur,q=this.M[k];if(!q)return;x.save();x.imageSmoothingEnabled=false;this.spr(k,o+this.OX[k],GY-q[3]);x.restore()}};
LAIR.init();
// 各关首领的巢穴(世界坐标)
function lair(){const t=performance.now()/1000,bx=3020-cam;if(bx>VW+60||bx<-260)return;
  if(LAIR.on()){LAIR.lair(cur==7?RX7-cam:bx);return}
  if(cur==1){for(const [a,h] of [[0,150],[130,150]]){RR(x,bx+a,GY-h,40,h,3,LG(x,0,GY-h,0,GY,['#a5b4c8','#6b7a90']),1.4);PG(x,[[bx+a-6,GY-h],[bx+a+20,GY-h-44],[bx+a+46,GY-h]],'#e03131',1.4);LN_(x,[[bx+a+20,GY-h-44],[bx+a+20,GY-h-62]],OL,1.2);PG(x,[[bx+a+20,GY-h-62],[bx+a+34,GY-h-57],[bx+a+20,GY-h-52]],'#ffd43b',1)}
    RR(x,bx+30,GY-118,110,118,3,LG(x,0,GY-118,0,GY,['#b9c6d8','#7b8aa0']),1.4);for(let k=0;k<6;k++)RR(x,bx+32+k*18,GY-128,12,12,2,'#9aa8bd',1.1);RR(x,bx+66,GY-62,38,62,18,'#2b1a12',1.4);RR(x,bx+78,GY-100,14,18,7,'#ffd43b',1)}
  else if(cur==2){RR(x,bx,GY-230,120,230,6,LG(x,bx,0,bx+120,0,['#3b2d63','#1a1430']),1.6);PG(x,[[bx-12,GY-230],[bx+60,GY-300],[bx+132,GY-230]],'#5f3dc4',1.6);for(let k=0;k<3;k++)RR(x,bx+48,GY-200+k*50,24,30,12,'#be4bdb',1.1);RR(x,bx+40,GY-60,40,60,20,'#0b0716',1.4);x.save();x.globalCompositeOperation='lighter';C_(x,bx+60,GY-185,30,RGD(x,bx+60,GY-185,30,['rgba(204,93,232,.6)','rgba(0,0,0,0)']),0);x.restore()}
  else if(cur==3){RR(x,bx+20,GY-200,70,200,20,LG(x,bx+20,0,bx+90,0,['#8a5a2e','#5c3a1e']),1.6);for(const [a,b,r] of [[0,-230,60],[80,-240,64],[40,-280,58],[-30,-200,40],[110,-200,44]])C_(x,bx+40+a,GY+b,r,LG(x,0,GY+b-r,0,GY+b+r,['#a9e34b','#2f9e44']),1.6);RR(x,bx+38,GY-70,34,70,17,'#2b1a12',1.4);C_(x,bx+63,GY-180,4,'#fab005',1)}
  else if(cur==6){SMO(x,[[bx-40,GY],[bx-20,GY-130],[bx+50,GY-190],[bx+140,GY-150],[bx+190,GY]],LG(x,0,GY-190,0,GY,['#f8fbff','#a9c6e2']),1.6);RR(x,bx+36,GY-90,64,90,30,'#1c3a5e',1.4);for(let i=0;i<6;i++)PG(x,[[bx+40+i*10,GY-82],[bx+44+i*10,GY-66+(i%2)*8],[bx+48+i*10,GY-82]],'#e7f5ff',.8);for(const a of [0,150])E_(x,bx+a,GY-4,14,5,'#ffffff',1)}
  else if(cur==7){const rx=RX7-cam;SMO(x,[[rx-74,GY],[rx-60,GY-92],[rx-34,ROCKY-4],[rx+18,ROCKY-8],[rx+50,GY-110],[rx+76,GY]],LG(x,0,ROCKY,0,GY,['#8a94a6','#4a5266']),1.6);SMO(x,[[rx-40,ROCKY+6],[rx-30,ROCKY-6],[rx+18,ROCKY-10],[rx+40,ROCKY+4],[rx+10,ROCKY+12],[rx-20,ROCKY+12]],'#ffffff',1.2);LN_(x,[[rx-20,GY-60],[rx-8,GY-90],[rx+4,GY-70]],'rgba(30,35,55,.5)',1.4);RR(x,rx-22,GY-40,44,40,20,'#141625',1.4)}
  else if(cur==4){SMO(x,[[bx-30,GY],[bx-10,GY-120],[bx+60,GY-170],[bx+150,GY-130],[bx+180,GY]],LG(x,0,GY-170,0,GY,['#5c5a4e','#2e2c24']),1.6);RR(x,bx+40,GY-82,56,82,28,'#120f0b',1.4);for(const a of [10,120])C_(x,bx+a,GY-8,5,'#e9ecef',1)}}
function cave5(){const t=performance.now()/1000,cx=2540-cam;if(cx>=VW)return;
  if(LAIR.on()){x.save();x.imageSmoothingEnabled=false;LAIR.tile('c5wall',cx,0,700,GY);LAIR.tile('c5ceil',cx,0,700,84);LAIR.tile('c5side',cx-4,0,34,GY-120);LAIR.tile('c5side',3180-cam,0,24,GY);if(bossOn)LAIR.spr('c5gate',cx+6,GY-120);x.restore();
    for(const p of PL)if(p.y==GY){const x0=Math.max(2540,cam),x1=Math.min(3200,cam+VW);if(x1>x0){if(LTL.on())LTL.ground({x:x0,w:x1-x0,y:GY});else drawGround({x:x0,w:x1-x0,y:GY},LVA[5].ground,lvArt())}}return}
  RR(x,cx,0,700,GY,0,LG(x,0,0,0,GY,['#4a2e14','#6b4423','#7a5230']),0);for(let i=0;i<14;i++)RR(x,cx+40+i*46,70+(i*53)%170,16,10,4,'#5c3a1e',.8);
  x.fillStyle=LG(x,0,0,0,CY+20,['#2e1c0c','#4a2e14']);x.fillRect(cx,0,700,CY);for(let i=0;i<16;i++)PG(x,[[cx+30+i*40,CY-2],[cx+40+i*40,CY+10+(i*7)%16],[cx+50+i*40,CY-2]],'#3d2815',1.1);LN_(x,[[cx,CY],[cx+700,CY]],OL,1.6);
  RR(x,cx-4,0,34,GY-120,6,'#3d2815',1.4);RR(x,3180-cam,0,24,GY,6,'#3d2815',1.4);if(bossOn){RR(x,cx+6,GY-120,24,120,4,'#4a321c',1.3);for(let i=0;i<4;i++)RR(x,cx+2+i*5,GY-116+i*28,26,8,3,'#5c3a1e',.8)}
  for(const p of PL)if(p.y==GY){const x0=Math.max(2540,cam),x1=Math.min(3200,cam+VW);if(x1>x0){if(LTL.on())LTL.ground({x:x0,w:x1-x0,y:GY});else drawGround({x:x0,w:x1-x0,y:GY},LVA[5].ground,lvArt())}}}
// =====================================================================
