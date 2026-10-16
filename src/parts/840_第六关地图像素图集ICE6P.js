// ===== 第六关地图像素图集 ICE6P(art_src/lv/build_ice6.py):冰面、冰墙、裂纹、落雪雪团 / 雪堆、海豹雪洞、冰柱、雪花 =====
// 素材:Seasonal Platformer Tiles(GrafxKid,CC0)的星纹冰块和雪檐,其余按同一套配色自画
const ICE6P={I:null,D:'@@A:ice6_atlas@@',M:{"iceb":[0,0,16,16],"cap":[17,0,32,8],"strip":[50,0,32,9],"glint":[83,0,16,2],"crk1":[100,0,24,16],"crk2":[125,0,24,16],"crk3":[150,0,24,16],"clump":[175,0,76,36],"pile":[0,37,88,30],"hole":[89,37,44,16],"icl":[134,37,8,16],"sf1":[143,37,2,2],"sf2":[146,37,3,3]},
  init(){const im=new Image();im.onload=()=>{this.I=im};im.src=this.D},
  on(){return SET.art!==0&&!!this.I},
  spr(k,X,Y,c){const q=this.M[k];(c||x).drawImage(this.I,q[0],q[1],q[2],q[3],Math.round(X),Math.round(Y),q[2],q[3])},
  tile(k,X,Y,W,H){atlasTile(this.I,this.M[k],X,Y,W,H)},
  // 冰墙:冰块平铺 + 深色描边 + 顶上雪檐
  wall(X,Y,W,H,cap){X=Math.round(X);Y=Math.round(Y);this.tile('iceb',X,Y,W,H);R(X,Y,1,H,'#28385c');R(X+W-1,Y,1,H,'#28385c');if(cap){const q=this.M.cap;x.drawImage(this.I,q[0],q[1],Math.min(q[2],W+2),q[3],X-1,Y-4,Math.min(q[2],W+2),q[3])}},
  draw(t){x.save();x.imageSmoothingEnabled=false;
    for(const r of ICE6){const x0=Math.max(r[0],cam-10)-cam,x1=Math.min(r[1],cam+VW+10)-cam;if(x1<=x0)continue;this.tile('strip',x0,GY-3,x1-x0,9);
      for(let k=Math.floor((cam+x0)/60)*60;k<cam+x1;k+=60){const gx=Math.round(k-cam+((t*20)%60));if(gx>x0&&gx+16<x1)this.spr('glint',gx,GY-1)}}
    for(const b of IB6){const bx=b.x-cam;if(bx<-40||bx>VW+10)continue;this.wall(bx,GY-b.h,IBW,b.h+2,1)}
    for(const p of PL){if(!p.crk||p.gone)continue;const px=p.x-cam;if(px>VW+20||px+p.w<-20)continue;const lvl=p.cs?3:Math.min(2,p.n||0),jx=p.cs?Math.round(Math.sin(t*60)):0;
      if(lvl)for(let k=12;k<p.w-12;k+=36)this.spr('crk'+lvl,px+k-12+jx,p.y-2);
      if(p.cs&&Math.sin(t*30)>-.2)R(Math.round(px),Math.round(p.y-5),Math.round(p.w),3,'#e03131')}
    if(bossOn){const lx=ARL-22-cam;this.wall(lx,GY-160,26,160,1);for(let i=0;i<4;i++)this.spr('icl',lx+1+i*6,GY-156)}
    {const rx=ARR-cam;if(rx<VW+30){this.wall(rx,0,30,GY+2,0);for(let i=0;i<6;i++){x.save();x.translate(Math.round(rx+1),40+i*40);x.rotate(Math.PI/2);this.spr('icl',-4,0);x.restore()}}}
    for(let i=0;i<46;i++){const sp=(i%3)+1,fx=((i*97-cam*.4+Math.sin(t+i)*14)%VW+VW)%VW,fy=(t*22*sp+i*53)%GY;R(Math.round(fx),Math.round(fy),sp>2?3:2,sp>2?3:2,'#ffffff')}
    x.restore()}};
ICE6P.init();
function iceDraw(){const t=performance.now()/1000;
  if(ICE6P.on()){ICE6P.draw(t);return}
  for(const r of ICE6){const x0=Math.max(r[0],cam-10)-cam,x1=Math.min(r[1],cam+VW+10)-cam;if(x1<=x0)continue;RR(x,x0,GY-3,x1-x0,9,3,LG(x,0,GY-3,0,GY+6,['rgba(231,245,255,.95)','rgba(116,192,252,.75)']),1);
    x.save();x.beginPath();x.rect(x0,GY-3,x1-x0,9);x.clip();for(let k=Math.floor((cam+x0)/60)*60;k<cam+x1;k+=60){LN_(x,[[k-cam+((t*20)%60),GY-1],[k-cam+((t*20)%60)+16,GY-1]],'rgba(255,255,255,.9)',1.4)}x.restore()}
  for(const b of IB6){const bx=b.x-cam;if(bx<-40||bx>VW+10)continue;RR(x,bx,GY-b.h,IBW,b.h+2,5,LG(x,bx,0,bx+IBW,0,['#d0ebff','#a5d8ff','#e7f5ff']),1.4);LN_(x,[[bx+6,GY-b.h+6],[bx+6,GY-8]],'rgba(255,255,255,.85)',2);LN_(x,[[bx+20,GY-b.h+12],[bx+15,GY-b.h+22],[bx+22,GY-b.h+30]],'rgba(77,171,247,.6)',1.2);E_(x,bx+IBW/2,GY-b.h,IBW/2+3,4,'#ffffff',1.1)}
  for(const p of PL){if(!p.crk||p.gone)continue;const px=p.x-cam;if(px>VW+20||px+p.w<-20)continue;const lvl=p.cs?3:Math.min(2,p.n||0),jx=p.cs?Math.sin(t*60)*1.2:0;
    for(let k=0;k<lvl+1;k++){const cxk=px+p.w*(.25+k*.25)+jx;LN_(x,[[cxk,p.y-3],[cxk+4,p.y+3],[cxk-3,p.y+8],[cxk+2,p.y+14]],k<lvl?'#1c4f80':'rgba(28,79,128,.25)',1.3)}
    if(p.cs){x.globalAlpha=.5+.4*Math.sin(t*30);RR(x,px,p.y-5,p.w,4,2,'#e03131',0);x.globalAlpha=1}}
  if(bossOn){RR(x,ARL-22-cam,GY-160,26,160,6,LG(x,0,GY-160,0,GY,['#e7f5ff','#74c0fc']),1.4);for(let i=0;i<4;i++)PG(x,[[ARL-20+i*6-cam,GY-160],[ARL-17+i*6-cam,GY-146+(i%2)*6],[ARL-14+i*6-cam,GY-160]],'#e7f5ff',.8)}
  {const rx=ARR-cam;if(rx<VW+30){RR(x,rx,0,30,GY+2,6,LG(x,rx,0,rx+30,0,['#a5d8ff','#e7f5ff']),1.4);for(let i=0;i<6;i++)PG(x,[[rx-2,40+i*40],[rx-10,46+i*40],[rx-2,52+i*40]],'#d0ebff',.8)}}
  x.globalAlpha=.85;for(let i=0;i<46;i++){const sp=(i%3)+1,fx=((i*97-cam*.4+Math.sin(t+i)*14)%VW+VW)%VW,fy=(t*22*sp+i*53)%GY;C_(x,fx,fy,.8+sp*.45,'#ffffff',0)}x.globalAlpha=1}


