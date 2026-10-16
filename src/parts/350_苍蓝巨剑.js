// ===== 苍蓝巨剑:巨大的幻影之剑悬在身后上空(剑柄朝后上、剑尖斜指前下方约 35°),蓄满后沿剑身方向刺落插进地面 =====
// 新版:蓄力 1 秒,巨剑在双手处凝聚、剑身朝身后上方 45°;出剑时从身后经过头顶抡下,砸向前方地面
const GCH=1,GA0=-Math.PI*.75,GA1=.09;
function gGeo(k){const st=k.formed?k.t-k.ft:0,ph=Math.min(1,k.t/GCH),t=performance.now()/1000;
  let a=GA0+Math.sin(t*3)*.03*(1-ph);if(k.formed){const e=Math.min(1,st/.3);a=GA0+(GA1-GA0)*Math.pow(e,2.4)}
  return {hx:P.x+12+P.f*3,hy:P.y+4,a,ph}}
function gBladePath(c,L,t){const w=Math.sin(t*9);c.beginPath();c.moveTo(0,-20);
  for(let i=1;i<=9;i++){const u=i/9,px=u*(L-26),hy=-20*(1-u*.55);c.quadraticCurveTo(px-L/22,hy-11-(i%2?5:2)-w*1.5*(1-u),px,hy)}  // 剑背:火焰 / 云纹状的锯齿
  c.lineTo(L,0);c.lineTo(L-30,15);c.quadraticCurveTo(L*.5,20,0,17);c.closePath()}
// 苍蓝巨剑的剑:Fantasy Sword Set(melle,CC0)的宽刃剑,剑柄压短、缩成剑身 300 像素;2026-10-13 第十一轮换成暗黑风格:黑紫暗钢 + 暗红剑芯 + 剑刃倒钩锯齿 + 描边,外发光暗紫(art_src/skfx/build_gsword.py);
// 图上半 = 剑,下半 = 暗紫色发光剪影;M = [宽, 高, 护手 x, 中线 y],剑尖朝右,护手对准巨剑的原点
const GSW={I:null,D:'@@A:gsword@@',M:[404, 155, 96, 77]};{const im=new Image();im.onload=()=>{GSW.I=im};im.src=GSW.D}
function drawGiant(){const k=P.sk;if(!k||k.id!='giant')return;const f=P.f,ph=Math.min(1,k.t/GCH),st=k.formed?k.t-k.ft:0,t=performance.now()/1000,G=gGeo(k),x0=P.x+12;
  const fade=k.formed&&st>.3?Math.max(0,1-(st-.3)/.45):1,al=(k.formed?1:.15+.85*ph)*fade;
  if(!k.formed){x.globalAlpha=.25+.2*Math.sin(t*12);RR(x,Math.min(x0-30*f,x0+f*420)-cam,GY-4,450,4,2,'#9d4edd',0);x.globalAlpha=1}
  // 手中凝聚的光球
  if(!k.formed){const hx=G.hx-cam,hy=G.hy,r=4+ph*12+Math.sin(t*20)*1.5;x.save();x.globalCompositeOperation='lighter';C_(x,hx,hy,r*3.2,RGD(x,hx,hy,r*3.2,['rgba(230,190,255,.95)','rgba(123,44,191,.5)','rgba(0,0,0,0)']),0);C_(x,hx,hy,r,'#f3e8ff',0);x.restore();C_(x,hx,hy,r*.55,'#14061e',0)}
  x.save();x.beginPath();x.rect(-20,-200,VW+40,GY+203);x.clip();x.translate(G.hx-cam,G.hy);x.scale(f,1);x.rotate(G.a);x.translate(30,0);x.scale(k.formed?1:.55+.45*ph,k.formed?1:.55+.45*ph);x.globalAlpha=al;const L=GL;
  if(GSW.I){const m=GSW.M;x.imageSmoothingEnabled=false;  // 2026-10-13 第十轮:像素巨剑图(GSW),外圈蓝色发光 + 飘散的光点
    x.save();x.globalAlpha=al*.35;x.filter='brightness(.15)';x.drawImage(GSW.I,0,m[1],m[0],m[1],-m[2]-2,-m[3]-2,m[0]+4,m[1]+4);x.filter='none';  // 外圈先铺一层黑雾,再叠暗紫色发光
    x.globalCompositeOperation='lighter';x.globalAlpha=al*(.4+.15*Math.sin(t*8));x.drawImage(GSW.I,0,m[1],m[0],m[1],-m[2],-m[3],m[0],m[1]);
    for(let i=0;i<7;i++){const u=((t*.8+i/7)%1),px=u*L*.9,py=-22+Math.sin(t*6+i)*4;x.globalAlpha=al*(1-u)*.8;C_(x,px,py-u*14,6*(1-u)+2,i%2?'rgba(199,125,255,.8)':'rgba(255,77,109,.6)',0)}x.restore();x.globalAlpha=al;
    x.drawImage(GSW.I,0,0,m[0],m[1],-m[2],-m[3],m[0],m[1])}
  else{
  // 外圈发光
  x.save();x.globalCompositeOperation='lighter';gBladePath(x,L,t);x.strokeStyle='rgba(77,171,247,.5)';x.lineWidth=22;x.lineJoin='round';x.stroke();x.strokeStyle='rgba(165,216,255,.55)';x.lineWidth=10;x.stroke();
  for(let i=0;i<7;i++){const u=((t*.8+i/7)%1),px=u*L*.9,py=-24+Math.sin(t*6+i)*4;x.globalAlpha=al*(1-u)*.8;C_(x,px,py-u*14,7*(1-u)+2,'rgba(165,216,255,.8)',0)}x.restore();x.globalAlpha=al;
  // 剑身
  gBladePath(x,L,t);x.fillStyle=LG(x,0,-30,0,18,['#4dabf7','#e7f5ff','#a5d8ff','#1c7ed6']);x.fill();x.strokeStyle='#1864ab';x.lineWidth=1.6;x.lineJoin='round';x.stroke();
  x.strokeStyle='rgba(255,255,255,.95)';x.lineWidth=2.2;x.beginPath();x.moveTo(6,2);x.lineTo(L-34,2);x.stroke();
  // 云纹
  x.strokeStyle='rgba(24,100,171,.55)';x.lineWidth=1.6;for(const [cx,cy,r] of [[48,-6,7],[110,-4,6],[168,-3,5],[222,-1,4]]){x.beginPath();x.arc(cx,cy,r,0,4.6);x.stroke();x.beginPath();x.arc(cx+r*.4,cy-r*.15,r*.45,3,7.6);x.stroke()}
  // 护手:向后扫的双翼
  for(const d of [-1,1]){x.beginPath();x.moveTo(2,d*8);x.quadraticCurveTo(-6,d*30,-26,d*44);x.quadraticCurveTo(-12,d*26,-14,d*12);x.quadraticCurveTo(-8,d*16,-4,d*6);x.closePath();x.fillStyle=LG(x,0,d*44,0,0,['#74c0fc','#d0ebff']);x.fill();x.strokeStyle='#1864ab';x.lineWidth=1.4;x.stroke()}
  RR(x,-50,-6,40,12,5,LG(x,0,-6,0,6,['#3b5bdb','#1c2f8a']),1.3);for(let i=0;i<4;i++)LN_(x,[[-46+i*9,-6],[-41+i*9,6]],'#91a7ff',1.2);
  x.save();x.globalCompositeOperation='lighter';C_(x,-58,0,16,RGD(x,-58,0,16,['rgba(255,255,255,.95)','rgba(116,192,252,.5)','rgba(0,0,0,0)']),0);x.restore();C_(x,-58,0,6.5,'#ffffff',1.2);
  }
  x.restore();x.globalAlpha=1;
  if(k.formed&&st<.42){const e=Math.min(1,st/.3),a1=GA0+(GA1-GA0)*Math.pow(e,2.4),a0=Math.max(GA0,a1-1.3);x.save();x.translate(G.hx-cam,G.hy);x.scale(f,1);x.globalAlpha=Math.max(0,1-Math.max(0,st-.3)/.12)*.75;x.globalCompositeOperation='lighter';
    for(const [r,w,c2] of [[300,26,'rgba(123,44,191,.5)'],[300,10,'rgba(224,170,255,.85)'],[200,14,'rgba(201,24,74,.45)']]){x.beginPath();x.arc(0,0,r,a0,a1);x.strokeStyle=c2;x.lineWidth=w;x.stroke()}x.restore();x.globalAlpha=1}}
function drawP(){
  {const k=P.sk;if(k&&k.id=='zap'){if(k.hid)return;
    if(k.fin!=null&&!k.done){const oy=-130*(1-(k.drop||0));P.y+=oy;x.globalAlpha=.9;drawPBody();x.globalAlpha=1;P.y-=oy;return}}}
  PXL.run(()=>drawPAura(1),P.wy>0);drawPBody();PXL.run(()=>drawPAura(0),P.shdT>0&&P.shd>0)}
function txt(s,px,py,sz,c,al){x.font='bold '+sz+'px "Noto Sans SC","PingFang SC","Microsoft YaHei",sans-serif';x.fillStyle=c;x.textAlign=al||'center';x.fillText(s,px,py)}
