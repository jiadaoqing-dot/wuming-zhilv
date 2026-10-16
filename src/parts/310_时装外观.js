// ===== 时装外观:默认 / 风华剑仙 / 学院法师(q 为单位坐标画矩形,角色 24×32,面朝右)=====
// 翅膀:风华剑仙丝带(披帛),c 已经平移到角色左上角、面朝右的单位坐标;len 控制拖尾长短
function drawRibbon(c,t,fly,len){len=len==null?1:len;const a=fly?2.2:1,w1=Math.sin(t*4)*2*a,w2=Math.sin(t*4+1.3)*3*a,w3=Math.sin(t*4+2.4)*4*a,L=(fly?1.5:1)*len;
  const path=()=>{c.beginPath();c.moveTo(19,21);c.bezierCurveTo(27,8,20,-10+w1*.5,11,-7);c.bezierCurveTo(3,-4,3,7,-3*L+1,12+w1);c.bezierCurveTo(-9*L,16+w2,-14*L,21+w3,-22*L,24+w2);
    c.moveTo(19,21);c.bezierCurveTo(23,27,20+w2*.5,32,15-6*L,38+w3*.4)};
  c.save();c.lineCap='round';c.lineJoin='round';c.globalAlpha=.9;path();c.strokeStyle='#f783ac';c.lineWidth=3;c.stroke();path();c.strokeStyle='#ffdeeb';c.lineWidth=1.6;c.stroke();path();c.strokeStyle='rgba(255,255,255,.9)';c.lineWidth=.6;c.stroke();c.restore()}
// 翅膀统一入口(单位坐标,面朝右)。world=1 表示游戏里:学院法师翅膀不飞时由跟随的四角星单独绘制
function drawWing(c,id,t,fly,len,world){if(id=='fhw')drawRibbon(c,t,fly,len);else if(id=='xyw'){if(fly)drawBroom(c,t);else if(!world)drawStar4(c,len<.3?23:-7,len<.3?-1:4,5,t)}}
function drawBroom(c,t){const w=Math.sin(t*14)*1.2;c.save();
  c.fillStyle='#e8c27a';c.beginPath();c.moveTo(-12,25);c.lineTo(-25,20+w);c.lineTo(-27,27);c.lineTo(-25,34-w);c.lineTo(-12,30);c.closePath();c.fill();
  c.strokeStyle='#b07d3a';c.lineWidth=.7;for(const yy of [22,25,28,31]){c.beginPath();c.moveTo(-12,27.5);c.lineTo(-25,yy+(yy<27?w:-w));c.stroke()}
  c.fillStyle='#8d5524';c.fillRect(-12,26.2,44,2.4);c.fillStyle='#b08155';c.fillRect(-12,26.2,44,.8);c.fillStyle='#c92a2a';c.fillRect(-13.5,24.6,2.4,5.6);c.fillStyle='#ffd43b';c.fillRect(30,25.8,2.4,3.2);c.restore()}
function drawStar4(c,cx,cy,r,t){c.save();c.translate(cx,cy);const g=c.createRadialGradient(0,0,0,0,0,r*2.4);g.addColorStop(0,'rgba(255,236,153,.75)');g.addColorStop(1,'rgba(255,236,153,0)');c.fillStyle=g;c.fillRect(-r*2.4,-r*2.4,r*4.8,r*4.8);
  c.rotate(Math.sin(t*1.5)*.25);const k=1+.12*Math.sin(t*5),R=r*k,q=R*.32;c.beginPath();for(let i=0;i<8;i++){const a=i*Math.PI/4-Math.PI/2,rr=i%2?q:R;c.lineTo(Math.cos(a)*rr,Math.sin(a)*rr)}c.closePath();c.fillStyle='#ffd43b';c.fill();
  c.beginPath();for(let i=0;i<8;i++){const a=i*Math.PI/4-Math.PI/2,rr=(i%2?q:R)*.5;c.lineTo(Math.cos(a)*rr,Math.sin(a)*rr)}c.closePath();c.fillStyle='#fff9db';c.fill();c.restore()}
let STARP={x:0,y:0};
function starStep(dt){if(!(WEAR.wing=='xyw'||(WEAR.wing=='fhw'&&SET.art!==0)))return;const t=performance.now()/1000,k=Math.min(1,dt*5);STARP.x+=(P.x+12-P.f*30-STARP.x)*k;STARP.y+=(P.y+4+Math.sin(t*2.2)*5-STARP.y)*k;
  if(st=='play'&&!P.fly&&Math.random()<dt*8)pt({x:STARP.x+rnd(-3,3),y:STARP.y+rnd(-3,3),vx:rnd(-8,8),vy:rnd(4,16),c:pick(['#ffe066','#fff9db']),s:rnd(1,2),l:.45});
  if(st=='play'&&P.fly&&Math.random()<dt*24)pt({x:P.x+12-P.f*rnd(18,26),y:P.y+rnd(22,32),vx:-P.f*rnd(20,60),vy:rnd(-10,10),c:pick(['#ffe066','#fff9db','#e599f7']),sh:2,s:rnd(2,4),l:rnd(.3,.5)})}
// 翅膀挂件(不飞行时):像素美术下是自绘的像素丝带 / 四角星,原版几何画法仍是矢量四角星(丝带画在身上)
function drawStarF(cx){if(P.fly)return;const t=performance.now()/1000;if(SET.art!==0&&PEND.I&&(WEAR.wing=='xyw'||WEAR.wing=='fhw'))PEND.draw(x,WEAR.wing=='xyw'?1:0,STARP.x-cx,STARP.y,t,P.f);else if(WEAR.wing=='xyw')drawStar4(x,STARP.x-cx,STARP.y,5,t)}
// 雷云(2026-10-12 第七轮):乌云铺满整个天空 —— Clouds(Igor Gundarev,CC0)换成暗紫灰风暴色(图集 SKFX c-cloud0~4),三层横向循环飘动,全屏大雨,云里闪光
function drawCloud(CL){const t=performance.now()/1000,a=Math.max(0,Math.min(1,CL.t*2,(5-CL.t)*4));x.save();x.globalAlpha=a;
  x.fillStyle=LG(x,0,0,0,170,['rgba(12,10,24,.8)','rgba(28,26,46,.5)','rgba(0,0,0,0)']);x.fillRect(0,0,VW,170);
  x.strokeStyle='rgba(165,190,230,.45)';x.lineWidth=1;x.beginPath();for(let i=0;i<90;i++){const rx=(i*71.3+t*60)%VW,ry=50+((t*560+i*37)%(GY-50));x.moveTo(rx,ry);x.lineTo(rx-4,ry+12)}x.stroke();
  if(CL.fk>0||Math.random()<.04){x.save();x.globalCompositeOperation='lighter';const fx=CL.fx!=null&&CL.fk>0?CL.fx:rnd(40,VW-40),g=x.createRadialGradient(fx,40,0,fx,40,110);g.addColorStop(0,'rgba(200,225,255,.85)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(fx-110,-70,220,220);x.restore()}
  for(const [r,sp,s,y0] of [[0,9,1.05,8],[1,-14,1.25,34],[2,20,1.45,62]])for(let i=0;i<6;i++){const n='c-cloud'+((i+r*2)%5),m=VFX.M[n];if(!m)continue;const W=m.w*s,span=VW+W*1.2,xx=((i*span/6+t*sp+r*57)%span+span)%span-W*.6;
    VFX.frame(x,n,0,xx,y0+Math.sin(t*.7+i*1.3)*2,s,i%2?-1:1,0,1)}
  x.restore()}
function drawSk(){const m=P.mode,k=P.sk;
  if(k&&k.id=='bolt'){x.save();x.globalCompositeOperation='lighter';const g=x.createRadialGradient(P.x+12-cam,P.y+16,4,P.x+12-cam,P.y+16,44);g.addColorStop(0,'rgba(165,216,255,.75)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(P.x-cam-34,P.y-30,92,92);
    for(let i=0;i<3;i++){let ax=P.x+12+rnd(-50,50)+P.f*30,ay=P.y-72+rnd(0,40);const pts=[[ax,ay]];for(let j=0;j<4;j++){ax+=rnd(-22,22);ay+=rnd(16,28);pts.push([ax,ay])}x.globalAlpha=.45;poly(pts,8,'#4dabf7');x.globalAlpha=1;poly(pts,2,'#e7f5ff')}x.restore()}
  drawGiant();drawGd();drawAdv();drawMag();drawMg();if(k&&k.id=='zap'&&k.fs)drawZapFs(k);
  if(CL)drawCloud(CL);else if(CL2)drawCloud(CL2);  // 云铺满天空,两朵只画一层
  for(const z of Z){const a=(z.t/z.m)*rnd(.65,1);x.save();x.globalCompositeOperation='lighter';x.globalAlpha=a*.35;poly(z.p,z.big?16:11,'#4dabf7');x.globalAlpha=a*.75;poly(z.p,z.big?6:4,'#a5d8ff');for(const b of z.br)poly(b,2,'#74c0fc');x.globalAlpha=a;poly(z.p,2,'#fff');x.restore()}
}
function toggleSk(){if((st!='play'&&st!='town')||bagOpen||pn)return;skOpen=!skOpen;hideTip();keys.l=keys.r=0;ah=0;ar=0;$('sk').hidden=!skOpen;if(skOpen){if(skTab<2){skTab=P.mode=='staff'?1:0;skSel=null}renderSk()}else save()}
