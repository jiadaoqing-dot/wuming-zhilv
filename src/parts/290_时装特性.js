// ===== 时装特性:风华剑仙(御风 + 龙卷风)· 学院法师(锁敌雷电)=====
function fashCast(S){const f=WEAR.fash;
  if(f=='fh'){P.spdT=3;const lo=bossOn?2580:10,hi=xMax()+10,tx0=Math.max(lo,Math.min(hi,P.x+12+P.f*36));TOR.push({x:tx0,t:3,f:P.f,tk:.05,ph:rnd(0,6)});if(TOR.length>3)TOR.shift();
    ring(tx0,GY-4,4,40,'#c3fae8',.35,4,.3);burst(tx0,GY-20,12,['#e6fcf5','#c3fae8','#fff'],200,{sh:1,s:2,l:.3,dr:3});psx('dash')}
  if(f=='xy'){XYN++;XYT=10;if(XYN>=8){XYN=0;LCK={t:5,k:0,tg:null};tx('锁敌雷电!',P.x-14,P.y-52,'#ffe066');flash('220,235,255',.2);psx('thunder')}}}
function fashStep(dt,S,all){
  XYT-=dt;if(XYT<=0)XYN=0;
  const lo=bossOn?2575:0,hi=bossOn?ARR-5:WW;
  for(const t of TOR){t.t-=dt;t.tk-=dt;t.x+=t.f*80*dt;if(t.x<lo+20||t.x>hi-20){t.f*=-1;t.x=Math.max(lo+20,Math.min(hi-20,t.x))}
    if(Math.random()<dt*14)pt({x:t.x+rnd(-18,18),y:GY-rnd(4,20),vx:rnd(-60,60),vy:rnd(-160,-60),g:200,c:pick(['#c99a5b','#adb5bd','#e6fcf5']),ad:0,s:rnd(1.5,3),l:.5});
    if(t.tk<=0){t.tk=.3;const hb={x:t.x-22,y:GY-96,w:44,h:96};for(const e of all)if(!e.ug&&e.hp>0&&ov(hb,e))xDeal(e,Math.round(S.atk*.35*rnd(.9,1.1)))}}
  TOR=TOR.filter(t=>t.t>0);
  if(LCK){LCK.t-=dt;LCK.k-=dt;const tg=LCK.tg;if(!tg||tg.hp<=0||tg.ug||!all.includes(tg)||Math.abs(tg.x+tg.w/2-(P.x+12))>460)LCK.tg=nearE(all,P.x+12,P.y+16,420);
    if(LCK.k<=0&&LCK.tg){LCK.k=.5;const e=LCK.tg,cx=e.x+e.w/2,cy=e.y+e.h/2;Z.push({x:cx,t:.25,m:.25,top:0,...zpath(cx,0)});psx('zap');flash('210,230,255',.06);
      ring(cx,cy,4,30,'#a5d8ff',.25,3);burst(cx,cy,10,['#d0ebff','#fff','#74c0fc'],260,{sh:1,s:2,l:.25,dr:3});xDeal(e,Math.round(S.atk*rnd(.9,1.1)),'thunder')}
    if(LCK.t<=0)LCK=null}}
function drawTor(){const t=performance.now()/1000;
  for(const q of TOR){const a=Math.min(1,q.t/.3,(3-q.t)/.2+.2),bx=q.x-cam;x.save();x.globalAlpha=a*.85;
    for(let i=0;i<9;i++){const k=i/8,y=GY-4-k*92,w=6+k*22,ox=Math.sin(t*9+q.ph+k*4)*(3+k*6);x.strokeStyle=i%2?'rgba(230,252,245,.9)':'rgba(150,242,215,.75)';x.lineWidth=3;x.beginPath();x.ellipse(bx+ox,y,w,3+k*3,0,0,7);x.stroke()}
    x.strokeStyle='rgba(255,255,255,.8)';x.lineWidth=1.5;for(let i=0;i<3;i++){const s=(t*2.4+i/3)%1;x.beginPath();x.ellipse(bx+Math.sin(t*9+q.ph+s*4)*(3+s*6),GY-4-s*92,6+s*22,3+s*3,0,(t*12+i)%6.28,(t*12+i)%6.28+2.2);x.stroke()}x.restore()}
  if(LCK&&LCK.tg){const e=LCK.tg,cx=e.x+e.w/2-cam,cy=e.y+e.h/2,r=Math.max(e.w,e.h)/2+8;x.save();x.strokeStyle='rgba(255,224,102,.9)';x.lineWidth=2;x.setLineDash([5,4]);x.lineDashOffset=-t*40;x.beginPath();x.arc(cx,cy,r,0,7);x.stroke();x.setLineDash([]);
    for(let i=0;i<4;i++){const a=i*Math.PI/2+t*2;x.beginPath();x.moveTo(cx+Math.cos(a)*(r-4),cy+Math.sin(a)*(r-4));x.lineTo(cx+Math.cos(a)*(r+6),cy+Math.sin(a)*(r+6));x.stroke()}x.restore()}}
