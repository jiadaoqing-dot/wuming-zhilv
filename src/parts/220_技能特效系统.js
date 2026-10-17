// 第五十一轮(卡顿优化):光晕贴图缓存 —— 每种颜色画一张 64×64 的径向渐变,粒子直接缩放贴上
const GLWC=new Map();function glowS(c){let v=GLWC.get(c);if(v)return v;v=document.createElement('canvas');v.width=v.height=64;const g=v.getContext('2d'),q=g.createRadialGradient(32,32,0,32,32,32);q.addColorStop(0,c);q.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=q;g.fillRect(0,0,64,64);if(GLWC.size<300)GLWC.set(c,v);return v}
// ===== 技能特效系统:粒子、光环、刀光、残影、地裂、焦痕、光柱、闪屏、压暗、顿帧 =====
let PT=[],RG=[],SLS=[],GH=[],CRK=[],DEC=[],PIL=[],FX={fl:0,fc:'255,255,255',hs:0,dk:0},hitFx=null;
const rnd=(a,b)=>a+Math.random()*(b-a),pick=a=>a[Math.random()*a.length|0];
function pt(o){if(PT.length>650)PT.splice(0,PT.length-650);const p=Object.assign({vx:0,vy:0,g:0,dr:0,l:.5,s:3,c:'#fff',sh:0,ad:1},o);p.m=p.l;PT.push(p)}
function burst(x0,y0,n,c,sp,o){for(let i=0;i<n;i++){const a=Math.random()*6.283,v=sp*rnd(.3,1);pt(Object.assign({x:x0,y:y0,vx:Math.cos(a)*v,vy:Math.sin(a)*v,c:Array.isArray(c)?pick(c):c,l:rnd(.25,.55)},o))}}
function ring(x0,y0,r0,r1,c,l,w,fl){RG.push({x:x0,y:y0,r0,r1,c,l,m:l,w:w||4,fl:fl||1})}
function slash(x0,y0,r,a0,a1,f,c,l,w){SLS.push({x:x0,y:y0,r,a0,a1,f,c,l,m:l,w:w||4})}
function ghost(c,l){GH.push({x:P.x,y:P.y,f:P.f,c,l,m:l,pf:HERO().gf()})}
function pillar(x0,w,c,l){PIL.push({x:x0,w,c,l,m:l})}
function flash(rgb,a){FX.fc=rgb;FX.fl=Math.max(FX.fl,a)}
function hitstop(t){FX.hs=Math.max(FX.hs,t)}
function crack(x0,n,len){for(let i=0;i<n;i++){const d=i%2?1:-1,p=[[x0,GY+1]];let px=x0,py=GY+1;const L=len*rnd(.5,1);while(Math.abs(px-x0)<L){px+=d*rnd(8,18);py=GY+1+rnd(0,9);p.push([px,py])}CRK.push({p,l:1.3,m:1.3})}}
function zpath(cx,top){const p=[[cx+rnd(-10,10),top]];for(let y=top+rnd(14,24);y<GY;y+=rnd(14,26))p.push([cx+rnd(-18,18),y]);p.push([cx+rnd(-4,4),GY]);
  const br=[];for(let i=0;i<3;i++){const s=p[1+(Math.random()*Math.max(1,p.length-3)|0)],q=[[s[0],s[1]]];let bx=s[0],by=s[1];const d=Math.random()<.5?-1:1;for(let j=0;j<3;j++){bx+=d*rnd(8,22);by+=rnd(10,22);q.push([bx,by])}br.push(q)}return {p,br}}
function fxStep(dt){
  for(const p of PT){p.l-=dt;const k=Math.max(0,1-p.dr*dt);p.vx*=k;p.vy=p.vy*k+p.g*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;if(p.bn&&p.y>GY-2){p.y=GY-2;p.vy*=-.35;p.vx*=.6}}PT=PT.filter(p=>p.l>0);
  for(const L of [RG,SLS,GH,CRK,DEC,PIL])for(const q of L)q.l-=dt;RG=RG.filter(q=>q.l>0);SLS=SLS.filter(q=>q.l>0);GH=GH.filter(q=>q.l>0);CRK=CRK.filter(q=>q.l>0);DEC=DEC.filter(q=>q.l>0);PIL=PIL.filter(q=>q.l>0);
  FX.fl=Math.max(0,FX.fl-dt*3.5);FX.dk=Math.max(0,FX.dk-dt*1.6)}
function poly(pts,w,c){x.strokeStyle=c;x.lineWidth=w;x.beginPath();x.moveTo(pts[0][0]-cam,pts[0][1]);for(const q of pts)x.lineTo(q[0]-cam,q[1]);x.stroke()}
// 画在角色后面:焦痕、地裂、残影
function drawFXBack(){
  for(const d of DEC){x.globalAlpha=Math.min(1,d.l/d.m*1.5)*.75;x.fillStyle=d.c;x.beginPath();x.ellipse(d.x-cam,GY+1,d.w,4,0,0,7);x.fill()}x.globalAlpha=1;
  for(const c of CRK){const a=Math.min(1,c.l/c.m*2);x.globalAlpha=a;poly(c.p,3,'#2b1d0e');x.globalCompositeOperation='lighter';poly(c.p,1.5,'rgba(255,200,80,'+(.9*a)+')');x.globalCompositeOperation='source-over'}x.globalAlpha=1;
  for(const g of GH){x.globalAlpha=g.l/g.m*.7;if(g.pf){(g.pf.h||PXA).ghost(x,g);continue}x.save();x.translate(g.x+12-cam,g.y+32);x.scale(g.f*HSC,HSC);ghostShape(x,g.c);x.restore()}x.globalAlpha=1}
// 画在最上层(叠加发光):光柱、光环、刀光、粒子
function drawFX(){HST=HST.filter(h=>(h.l-=1/60)>0);for(const h of HST){const k=1-h.l/h.m,r=h.r*(.5+k*.7);x.globalAlpha=Math.min(1,h.l/h.m*1.8);PG(x,Array.from({length:16},(_,i)=>{const rr=i%2?r*.42:r,q=h.a+i*Math.PI/8;return [h.x-cam+Math.cos(q)*rr,h.y+Math.sin(q)*rr]}),h.cr?'#ffd43b':'#fff9db',1.2);if(h.cr)C_(x,h.x-cam,h.y,r*.32,'#ff922b',0)}x.globalAlpha=1;
  x.save();x.globalCompositeOperation='lighter';
  for(const q of PIL){const a=q.l/q.m,g=x.createLinearGradient(q.x-cam-q.w,0,q.x-cam+q.w,0);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(.5,q.c);g.addColorStop(1,'rgba(0,0,0,0)');x.globalAlpha=a;x.fillStyle=g;x.fillRect(q.x-cam-q.w,0,2*q.w,GY)}
  // 光环、刀光、火花用实色画(亮色背景上也清楚),光晕和光柱才用叠加发光
  x.globalCompositeOperation='source-over';
  for(const q of RG){const k=1-q.l/q.m,e=1-(1-k)*(1-k),r=q.r0+(q.r1-q.r0)*e,a=Math.max(0,q.l/q.m),w=Math.max(1,q.w*(1-k*.6));x.beginPath();x.ellipse(q.x-cam,q.y,Math.max(1,r),Math.max(1,r*q.fl),0,0,7);
    x.globalAlpha=a*.35;x.strokeStyle=q.c;x.lineWidth=w*2.4;x.stroke();x.globalAlpha=a;x.lineWidth=w;x.stroke();x.globalAlpha=a*.9;x.strokeStyle='#fff';x.lineWidth=Math.max(1,w*.35);x.stroke()}
  for(const s of SLS){const k=1-s.l/s.m,pg=Math.min(1,k/.35),a=s.l/s.m,A=v=>s.f>0?v:Math.PI-v,st=A(s.a0),en=A(s.a0+(s.a1-s.a0)*pg),ccw=s.f<0?s.a1>s.a0:s.a1<s.a0;
    x.globalAlpha=a*.4;x.strokeStyle=s.c;x.lineWidth=s.w*3.2;x.beginPath();x.arc(s.x-cam,s.y,s.r,st,en,ccw);x.stroke();
    x.globalAlpha=a*.8;x.lineWidth=s.w*1.6;x.beginPath();x.arc(s.x-cam,s.y,s.r,st,en,ccw);x.stroke();
    x.globalAlpha=a;x.strokeStyle='#fff';x.lineWidth=Math.max(1,s.w*.6);x.beginPath();x.arc(s.x-cam,s.y,s.r,st,en,ccw);x.stroke()}
  for(const p of PT){const a=Math.max(0,p.l/p.m);x.globalAlpha=a;const add=p.sh==2&&p.ad;x.globalCompositeOperation=add?'lighter':'source-over';
    if(p.sh==1){x.strokeStyle=p.c;x.lineWidth=p.s;x.beginPath();x.moveTo(p.x-cam,p.y);x.lineTo(p.x-cam-p.vx*.035,p.y-p.vy*.035);x.stroke()}
    else if(p.sh==2){const r=p.s*(1+(1-a)*(p.gr||0));x.drawImage(glowS(p.c),p.x-cam-r,p.y-r,2*r,2*r)}  // 第五十一轮:光晕粒子改用缓存贴图(原来每个粒子每帧新建一个径向渐变)
    else{x.fillStyle=p.c;const z=p.s*(p.gr?1+(1-a)*p.gr:1);x.fillRect(p.x-cam-z/2,p.y-z/2,z,z)}
  }
  x.restore()}
// 命中特效:每次命中都有火花;暴击金色光环;重击/技能有顿帧
let HST=[];  // 命中星爆(卡通打击感)
function hitFX(e,cr){const cx=e.x+e.w/2,cy=e.y+e.h/2,k=hitFx;VFX.hit(e,k,cr);if(HST.length<24)HST.push({x:cx+rnd(-6,6),y:cy+rnd(-6,6),l:cr?.22:.15,m:cr?.22:.15,r:cr?26:15,cr,a:Math.random()*6});
  burst(cx,cy,cr?12:5,cr?['#ffe066','#fff3bf']:['#fff','#fff3bf'],cr?300:200,{sh:1,s:2,l:.22,dr:4});
  if(cr){ring(cx,cy,6,34,'#ffd43b',.28,3);hitstop(.05)}
  if(k=='heavy'){ring(cx,cy,4,40,'#fff',.25,4);hitstop(.07);burst(cx,cy,8,'#e7f5ff',320,{sh:1,s:3,l:.25,dr:5})}
  else if(k=='dash'){burst(cx,cy,10,['#74c0fc','#e7f5ff'],320,{sh:1,s:2,l:.25,dr:4});hitstop(.04)}
  else if(k=='thunder'){burst(cx,cy,6,['#a5d8ff','#fff'],260,{sh:1,s:2,l:.18,dr:3})}
  else if(k=='slam'){burst(cx,cy,10,['#ffd43b','#fff'],260,{sh:1,s:3,l:.3,dr:3})}
  else if(k=='wave'){burst(cx,cy,10,['#ffe066','#fff3bf'],300,{sh:1,s:2,l:.25,dr:4});ring(cx,cy,4,30,'#ffe066',.22,3)}}
function explode(x0,y0){VFX.spawn('warm-explosion',x0,y0+10);burst(x0,y0,14,['#e8590c','#ff922b','#fab005'],200,{s:6,l:.4,dr:4,gr:.8});flash('255,150,60',.2);shake=Math.max(shake,.18);hitstop(.04);ring(x0,y0,6,70,'#ff922b',.42,7);ring(x0,y0,4,42,'#ffe066',.3,3);
  burst(x0,y0,24,['#ff922b','#ffd43b','#ff6b35','#ffe066'],260,{sh:2,s:rnd(8,13),l:.45,dr:3.5,gr:.6});burst(x0,y0,16,['#ffd43b','#fff3bf'],380,{sh:1,s:2,g:500,l:.5,dr:1});
  for(let i=0;i<8;i++)pt({x:x0+rnd(-14,14),y:y0+rnd(-10,10),vx:rnd(-40,40),vy:rnd(-90,-30),c:'rgba(70,64,60,.55)',ad:0,s:rnd(6,10),gr:1.2,l:rnd(.6,.9),dr:1})}
