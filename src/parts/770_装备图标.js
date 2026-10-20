// ===== 装备图标:用和角色身上同一套绘制函数画出来(发型 = 头部、铠甲 = 躯干 + 肩甲、武器 = 武器本体),按 部位 + 系列 + 品质 缓存 =====
const EQIC={},EQIM={};
// 像素美术下的装备图标(第十八轮):7Soul1 的 496 RPG icons + CC0 Jewelry Icons,每个系列一件不同造型(art_src/eqicon/build_eqicon.py);行 = 部位,列 = 系列,每格 34×34;品质轮廓在这里加(精良起,史诗再加一圈斜角光晕)
const EQPX={I:null,D:'@@A:eq_atlas@@',C:34,R:{sword:0,staff:1,head:2,body:3,ring:4,ear:5}};{const im=new Image();im.onload=()=>{EQPX.I=im};im.src=EQPX.D}
const eqKey=it=>(SET.art!==0&&EQPX.I&&EQPX.R[it.slot]!=null?'p':'')+it.slot+wG(it)+'_'+it.tier;
function eqIconPx(c,it,col){const C=EQPX.C,pp=wG(it)==7&&PPF.I&&(it.slot=='sword'||it.slot=='staff'),SI=pp?PPF.I:EQPX.I,sx=pp?PPF.M.ic[0]+(it.slot=='staff'?C:0):Math.min(6,wG(it))*C,sy=pp?PPF.M.ic[1]:EQPX.R[it.slot]*C,S=2,N=C*2,o=(96-N)/2;c.imageSmoothingEnabled=false;  // 第五十九轮:紫焰魅影的图标在 PPF 图集
  if(it.tier>0){const t=document.createElement('canvas');t.width=t.height=C;const q=t.getContext('2d');q.drawImage(SI,sx,sy,C,C,0,0,C,C);q.globalCompositeOperation='source-in';q.fillStyle=col;q.fillRect(0,0,C,C);
    if(it.tier>=3){c.globalAlpha=.55;for(const [dx,dy] of [[-1,-1],[1,1],[-1,1],[1,-1],[-2,0],[2,0],[0,-2],[0,2]])c.drawImage(t,o+dx*S,o+dy*S,N,N);c.globalAlpha=1}
    for(const [dx,dy] of [[-1,0],[1,0],[0,-1],[0,1]])c.drawImage(t,o+dx*S,o+dy*S,N,N)}
  c.drawImage(SI,sx,sy,C,C,o,o,N,N)}
function eqIcon(it){const g=it.g||0,k=eqKey(it);if(EQIC[k])return EQIC[k];const N=96,cv=document.createElement('canvas');cv.width=cv.height=N;const c=cv.getContext('2d');c.lineJoin='round';c.lineCap='round';const col=TR[it.tier][1],ff=FLW;FLW=0;
  if(k[0]=='p'){FLW=ff;eqIconPx(c,it,col);EQIC[k]=cv.toDataURL();const im=new Image();im.src=EQIC[k];EQIM[k]=im;return EQIC[k]}
  try{c.translate(N/2,N/2);
    if(it.slot=='sword'||it.slot=='staff'){c.rotate(-Math.PI/4);c.scale(1.45,1.45);c.translate(it.slot=='sword'?-18.5:-14,0);drawWpn(c,it.slot,it.tier,null,0,g)}
    else if(it.slot=='head'){const H=HAIRS[g];c.scale(1.75,1.75);c.translate(4,40);chibiHead(c,{hero:1,hl:H[2],eye:'#2f7fd6',hg:g,helm:col},0,null,'#ffdcb8',H[1],H[0])}
    else if(it.slot=='body'){const A=ARMP[g];c.scale(3.6,3.6);c.translate(0,4.2);armorTorso(c,A,g,A.top,A.top2,col);for(const d of [-1,1]){c.save();c.translate(d*5.6,-11.4);c.scale(d,1);armorPad(c,A,g,col);c.restore()}}
    else if(it.slot=='ring'){c.scale(2.3,2.3);c.translate(0,1);drawRingIc(c,g,col)}
    else{c.scale(2.3,2.3);drawEarIc(c,g,col)}}catch(e){}
  FLW=ff;EQIC[k]=cv.toDataURL();const im=new Image();im.src=EQIC[k];EQIM[k]=im;return EQIC[k]}
const eqImg=(it,cls)=>`<img class="${cls||'eqi'}" src="${eqIcon(it)}" alt="">`;
function eqDraw(it,cx,cy,sz){eqIcon(it);const k=eqKey(it),im=EQIM[k];if(im&&im.complete&&im.naturalWidth){const sm=x.imageSmoothingEnabled;if(k[0]=='p')x.imageSmoothingEnabled=false;x.drawImage(im,cx-sz/2,cy-sz/2,sz,sz);x.imageSmoothingEnabled=sm}}
// —— 铠甲躯干(躯干坐标:原点在髋部,向上到 -14.4):深色内衬 + 胸甲 + 系列装饰 + 腰带 + 腿甲片 + 领口
function armorTorso(c,AP,g,topc,top2,pad){const T=AP.trim||'#ffd43b',gem=RGD(c,.2,-7.6,2.4,['#fff',pad||'#ff6b6b','#862e2e']);
  RR(c,-6.2,-12.8,12.4,13.6,4.6,AP.in||'#26304a',1.2);
  PG(c,[[-7,2.6],[-3,0],[-1,1.2],[-4.6,6.4]],LG(c,0,0,0,6,[topc,top2]),1.1);
  SMO(c,[[-5.6,-12.2],[6,-12.4],[7.4,-6.6],[5.4,-1.4],[-4.6,-1.4],[-6.6,-6.8]],LG(c,0,-12.4,0,-1.4,['#ffffff',topc,top2]),1.3);
  LN_(c,[[-5,-11.6],[5.4,-11.8]],g==2?'#ffe066':T,1.3);LN_(c,[[2.6,-10.6],[4.6,-4]],'rgba(255,255,255,.55)',1.4);
  if(g==1){LN_(c,[[-5.4,-3.4],[-2,-5.6],[2,-4.4],[5.6,-6.4]],'#7a5226',1.1);c.save();c.translate(.6,-7.4);c.rotate(-.5);E_(c,0,0,1.9,3.6,LG(c,0,-3.6,0,3.6,['#d3f9d8','#2f9e44']),.9);LN_(c,[[0,-3],[0,3]],'#1e5a2a',.6);c.restore();C_(c,3.6,-9.6,1.2,pad||'#ff6b6b',.6)}
  else if(g==2){PG(c,[[-6.2,-11],[-3.6,-12.2],[6.8,-2.6],[4.2,-1.4]],LG(c,-6,0,6,0,['#ff8787','#e03131','#a61e1e']),.9);C_(c,.4,-6.8,2.3,gem,.9)}
  else C_(c,.6,-7,1.9,gem,.9);
  RR(c,-6.8,-2.2,13.6,3.2,1.5,LG(c,0,-2.2,0,1,AP.belt||['#a0703a','#5c3a1e']),1);RR(c,.2,-2.8,4,4.2,1,LG(c,0,-2.8,0,1.4,['#fff3bf','#e8a400']),.9);
  PG(c,[[1.6,.8],[7.4,.6],[8.6,5.4],[3,6.2]],LG(c,0,0,0,6,[topc,top2]),1.1);LN_(c,[[2,1.6],[7.4,1.4]],T,.9);
  RR(c,-5.6,-14.4,11.2,3.4,1.7,(AP.sv||ARMP[0].sv)[0],1)}
// —— 肩甲(原点在肩膀):旅者 = 银色圆肩甲;林王 = 木肩甲 + 叶片;荒漠 = 金肩甲 + 尖刺。描边是品质颜色
function armorPad(c,AP,g,pc){const SV=AP.sv||ARMP[0].sv;
  if(g==2)PG(c,[[-2.6,-2.2],[-.4,-7],[1.6,-2.4]],LG(c,0,-7,0,-2,['#fff3bf','#e8a400']),.9);
  E_(c,-.2,-.2,4.2,3.1,LG(c,0,-3.3,0,2.9,['#ffffff',SV[1],SV[2]]),1.2);c.beginPath();c.ellipse(-.2,-.2,4.2,3.1,0,.2,2.9);c.strokeStyle=fc(pc);c.lineWidth=1.3;c.stroke();
  if(g==1){c.save();c.translate(-.6,-1.6);c.rotate(-.5);E_(c,0,0,1.6,3.6,LG(c,0,-3.6,0,3.6,['#d3f9d8','#40c057']),.8);c.restore()}}
// —— 画主角:c 已经平移到脚底、按朝向翻转;p 是姿势,L 是外观(heroLook)。返回剑刃根部 / 剑尖的局部坐标(画剑光用)
function drawHero(c,p,L,o){o=o||{};const t=o.t||0,lk=L.look,sk=o.ps?'#c3f0b8':(L.skin||'#ffdcb8'),robe=lk=='fh'||lk=='xy',arm_=L.armor&&!lk;
  const topc=lk=='fh'?'#ffffff':lk=='xy'?'#2b2c33':(L.top||'#3b6fd6'),top2=lk=='fh'?'#d8e2ec':lk=='xy'?'#15161a':(L.top2||'#2a4fa8');
  const legc=lk?'#3a3442':(L.leg||'#4a3a5c'),boot=lk=='fh'?'#3d4a52':(L.boot||'#6b3f1e'),hair=lk=='fh'?'#1d1b24':lk=='xy'?'#5c3a1e':(L.hair||'#6b3a1e'),hs=lk=='fh'?'long':lk=='xy'?'spiky':(L.hs||'spiky');
  const AP=ARMP[L.as]||ARMP[0],SV=AP.sv||ARMP[0].sv,TRM=AP.trim||'#ffd43b';  // 护甲配色按系列
  const R=RIG,hy=R.hipY,cl=Math.cos(p.lean),sl=Math.sin(p.lean),tf=(px,py)=>[px*cl-py*sl,hy+px*sl+py*cl];
  if(o.wing){c.save();c.scale(1.3,1.3);c.translate(-12,-32);drawWing(c,o.wing,t,o.fly,o.wlen==null?1:o.wlen,o.world);c.restore()}
  c.save();c.translate(p.x||0,p.y||0);if(p.sq)c.scale(1+p.sq*.45,1-p.sq);
  // 关节位置
  const SF=tf(R.shX,R.shY),SB=tf(-R.shX+.6,R.shY),G=tf(p.gx,p.gy),dw=[Math.cos(p.wa),Math.sin(p.wa)];
  const fA=ik2(SF[0],SF[1],G[0],G[1],R.up,R.fore),HF=fA.H;
  const fb=fk(p.aB),fb2=fk(p.aB+p.eB),freeB=[SB[0]+fb[0]*R.up+fb2[0]*R.fore,SB[1]+fb[1]*R.up+fb2[1]*R.fore],gB=[HF[0]-dw[0]*6.5,HF[1]-dw[1]*6.5];
  const bA=ik2(SB[0],SB[1],lerp(freeB[0],gB[0],p.two),lerp(freeB[1],gB[1],p.two),R.up,R.fore);
  const leg=(hx,h,k,col,front)=>{const K=[hx+Math.sin(h)*R.thigh,hy+Math.cos(h)*R.thigh],A=[K[0]+Math.sin(h-k)*R.shin,K[1]+Math.cos(h-k)*R.shin];
    TUBE(c,[[hx,hy],K],6,col);if(arm_){TUBE(c,[K,A],5.6,front?SV[1]:SV[2]);C_(c,K[0],K[1],2.4,LG(c,0,K[1]-2.4,0,K[1]+2.4,SV),1)}else TUBE(c,[K,A],5.2,col);
    c.save();c.translate(A[0],A[1]);c.rotate((h-k)*.35);RR(c,-2.8,-2,8.2,4.4,2.1,LG(c,0,-2,0,2.4,[boot,'#2b1a12']),1.1);if(arm_)RR(c,-2.2,-2.6,4.6,2,1,TRM,.7);c.restore()};
  const arm=(S,A,col,col2,front)=>{TUBE(c,[S,A.E],5,col);if(arm_){TUBE(c,[A.E,A.H],5,front?SV[1]:SV[2]);RR(c,A.E[0]-1.6,A.E[1]-1.6,3.2,3.2,1.2,TRM,.7)}else TUBE(c,[A.E,A.H],4.4,col2);
    C_(c,A.H[0],A.H[1],2.7,arm_?LG(c,0,A.H[1]-2.7,0,A.H[1]+2.7,['#8a5a2e','#4a2a14']):sk,1.1);
    if(arm_){c.save();c.translate(S[0],S[1]);c.rotate(p.lean*.6);armorPad(c,AP,L.as,L.pad||topc);c.restore()}};
  const wpn=()=>{c.save();c.translate(HF[0],HF[1]);c.rotate(p.wa);drawWpn(c,o.wk||'sword',o.tier,o.glow,t,o.wg);c.restore()};
  const spd=Math.min(1,Math.abs(o.spd||0)/250),sw=Math.sin(t*7)*1.6*(.4+spd);
  // 披风(在最后面):从肩膀垂下,跑得越快越往后飘
  if(arm_&&L.scarf){c.save();c.translate(0,hy);c.rotate(p.lean);const fl=spd*9+(p.lean>.2?(p.lean-.2)*10:0);
    c.beginPath();c.moveTo(-4.6,-12.4);c.bezierCurveTo(-10-fl*.4,-6,-12-fl*1.1+sw*.6,4-fl*.6,-14-fl*1.6+sw,11-fl*.9);c.lineTo(-6-fl*1.2+sw*.7,13-fl*.6);c.lineTo(-1-fl*.8+sw*.5,10.5-fl*.4);c.bezierCurveTo(-1,2,1,-6,2,-12.4);c.closePath();
    c.fillStyle=fc(LG(c,-14,0,2,0,['#7a1414',L.scarf,'#ff6b6b']));c.fill();c.strokeStyle=OL;c.lineWidth=1.2;c.stroke();
    LN_(c,[[-4,-8],[-9-fl*1.2+sw*.6,10-fl*.8]],'rgba(80,10,10,.45)',1);LN_(c,[[-1,-8],[-4-fl*.9+sw*.5,10-fl*.5]],'rgba(80,10,10,.35)',1);c.restore()}
  if(p.wb)wpn();
  if(p.two<.5)arm(SB,bA,top2,top2,0);
  leg(-R.hipX,p.hB,p.kB,lk?'#2c2734':(L.leg2||'#1f2236'),0);
  // 躯干(躯干坐标:原点在髋部,向上到脖子 -12.5)
  c.save();c.translate(0,hy);c.rotate(p.lean);
  if(robe){const w=Math.sin(t*3)*1.2;SMO(c,[[-6.4,-12.6],[6.4,-12.6],[8.6,-2],[10.6+w*.4,8.6],[0,9.8],[-10.6-w*.4,8.6],[-8.6,-2]],LG(c,0,-12.6,0,9.6,[topc,top2]),1.2);
    if(lk=='fh'){RR(c,-7.6,-3.2,15.2,3,1.4,'#38d9a9',1);TUBE(c,[[-6.6,-1.8],[-11-w,3],[-13-w*1.5,8]],1.6,'#38d9a9');LN_(c,[[-10,7.8],[10,7.8]],'#a5d8ff',1.4);LN_(c,[[-1.6,-12],[2.6,-4]],'#9fd8c8',1.2)}
    else{LN_(c,[[-10,7.6],[10,7.6]],'#7048e8',1.5);C_(c,3,-6,1.7,'#fab005',.8)}}
  else if(arm_)armorTorso(c,AP,L.as,topc,top2,L.pad);
  else{RR(c,-6.2,-12.8,12.4,13.4,4.6,LG(c,0,-12.8,0,.6,[topc,top2]),1.2);LN_(c,[[2.2,-11.4],[2.2,-3.6]],'rgba(255,255,255,.28)',1.6);
    RR(c,-6.6,-2.4,13.2,3.2,1.5,LG(c,0,-2.4,0,.8,[L.belt||'#ffd43b','#c98a00']),1);RR(c,1.4,-2.8,3.6,4,1,'#fff3bf',.8)}
  if(lk=='xy'){RR(c,-6.6,-14,13.2,3.8,1.9,'#c92a2a',1);for(const sx of [-3.6,0,3.6])c.fillStyle=fc('#fab005'),c.fillRect(sx,-13.8,1.5,3.4);TUBE(c,[[-4,-12],[-9-spd*4,-9+sw*.4-spd*3],[-12-spd*7,-4+sw*.6-spd*5]],2.6,'#c92a2a')}
  c.restore();
  leg(R.hipX,p.hF,p.kF,legc,1);
  // 头:挂在脖子上,跟着上身转,再加一点点头部自己的摆动(跑步时明显前倾)
  {const H=tf(R.headX,R.headY);c.save();c.translate(H[0],H[1]);c.rotate(p.lean*.35+p.head);c.scale(R.headS,R.headS);c.translate(-1,33);
    chibiHead(c,{...L,mouth:o.mouth,closed:o.closed,angry:o.angry,ps:o.ps},t,lk,sk,hair,hs);c.restore()}
  if(p.two>=.5)arm(SB,bA,top2,top2,0);
  if(!p.wb)wpn();
  if(p.two>=.5)C_(c,bA.H[0],bA.H[1],2.6,arm_?LG(c,0,bA.H[1]-2.6,0,bA.H[1]+2.6,['#8a5a2e','#4a2a14']):sk,1.1);  // 后手握在剑柄上(画在武器上面)
  arm(SF,fA,topc,top2,1);
  c.restore();
  const k1=1+(p.sq||0)*.45,k2=1-(p.sq||0),pt_=d=>[(p.x||0)+(HF[0]+dw[0]*d)*k1,(p.y||0)+(HF[1]+dw[1]*d)*k2];
  return {h:pt_(0),b:pt_(SWB+4),m:pt_(SWB+22),tip:pt_(SWL),wa:p.wa}}
// —— 剑光:记录剑刃快速移动时每帧的位置(世界坐标),画成一条跟着剑刃轨迹、慢慢消失的彩色光带
let SWTR=[];
// 记录:前手位置(世界坐标)+ 剑的角度 + 朝向。画的时候在相邻两帧之间按角度插值补点,剑光就是圆滑的月牙而不是折线
function trailRec(h,wa,f,col,b0,t0){const now=performance.now()/1000;SWTR.push({h,wa,f,t:now,col,b0,t0});SWTR=SWTR.filter(q=>now-q.t<.3)}
let THR=[];
function thrDraw(){const now=performance.now()/1000;THR=THR.filter(q=>now-q.t1<.3);x.save();
  for(const q of THR){const al=Math.max(0,1-(now-q.t1)/.3),y=q.y1,x0=q.x0-cam,x1=q.x1-cam,f=q.f,L=Math.abs(x1-x0);if(L<4)continue;const w=7+5*al;
    const g=x.createLinearGradient(x0,0,x1,0);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(.18,q.col+'99');g.addColorStop(.7,q.col);g.addColorStop(1,'#ffffff');
    x.globalAlpha=.8*al;x.fillStyle=g;x.beginPath();x.moveTo(x0,y);x.lineTo(x1-f*Math.min(18,L*.3),y-w);x.lineTo(x1+f*4,y);x.lineTo(x1-f*Math.min(18,L*.3),y+w);x.closePath();x.fill();
    x.globalAlpha=al;x.fillStyle='#ffffff';x.beginPath();x.moveTo(x0+f*L*.3,y);x.lineTo(x1-f*8,y-2.2);x.lineTo(x1+f*3,y);x.lineTo(x1-f*8,y+2.2);x.closePath();x.fill();
    for(let i=0;i<3;i++){const yy=y+(i-1)*w*.9;x.globalAlpha=.5*al;LN_(x,[[x0+f*L*(.15+i*.12),yy],[x0+f*L*(.55+i*.1),yy]],'#ffffff',1.2)}}
  x.restore();x.globalAlpha=1}
function trailDraw(){const now=performance.now()/1000,LF=.26;SWTR=SWTR.filter(q=>now-q.t<LF);if(SWTR.length<2)return;
  const D=[];for(let i=1;i<SWTR.length;i++){const a=SWTR[i-1],b=SWTR[i];if(b.t-a.t>.06||a.f!=b.f){D.push(null);continue}
    const da=angD(a.wa,b.wa),n=Math.max(1,Math.ceil(Math.max(Math.abs(da)/.07,Math.hypot(b.h[0]-a.h[0],b.h[1]-a.h[1])/6)));
    for(let k=(D.length&&D[D.length-1]?1:0);k<=n;k++){const q=k/n,wa=a.wa+da*q,hx=a.h[0]+(b.h[0]-a.h[0])*q,hy=a.h[1]+(b.h[1]-a.h[1])*q,dx=a.f*Math.cos(wa)*HSC,dy=Math.sin(wa)*HSC;
      const B0=a.b0!=null?a.b0/HSC+1:SWB+3,T0=a.t0!=null?a.t0/HSC+2:SWL+2;D.push({b:[hx+dx*B0-cam,hy+dy*B0],tip:[hx+dx*T0-cam,hy+dy*T0],al:Math.max(0,1-(now-(a.t+(b.t-a.t)*q))/LF),col:b.col})}}
  x.save();x.lineJoin='round';const m=(u,v,k)=>[u[0]+(v[0]-u[0])*k,u[1]+(v[1]-u[1])*k];
  for(let i=1;i<D.length;i++){const a=D[i-1],b=D[i];if(!a||!b)continue;const al=(a.al+b.al)/2;
    const quad=(k0,k1,fill,alpha)=>{x.globalAlpha=alpha;x.fillStyle=fill;x.beginPath();x.moveTo(...m(a.b,a.tip,k0));x.lineTo(...m(a.b,a.tip,k1));x.lineTo(...m(b.b,b.tip,k1));x.lineTo(...m(b.b,b.tip,k0));x.closePath();x.fill()};
    quad(0,1,b.col,al*.22);quad(.45,1,b.col,al*.38);quad(.8,1,'#ffffff',al*.75)}
  x.strokeStyle='#ffffff';x.lineCap='round';for(let i=1;i<D.length;i++){const a=D[i-1],b=D[i];if(!a||!b)continue;x.globalAlpha=(a.al+b.al)/2;x.lineWidth=2.6*(a.al+b.al)/2+.5;x.beginPath();x.moveTo(...a.tip);x.lineTo(...b.tip);x.stroke()}
  x.restore();x.globalAlpha=1}
// 静态姿势(背包纸娃娃、商城预览、开场 / 结局画面、漫画)
function heroStatic(c,o){o=o||{};const m=o.mode||'sword',t=o.t||0,br=Math.sin(t*2.6);let p=rP(STANCE[m],{gy:STANCE[m].gy+br*.35});
  if(o.pose=='raise')p=rP(p,{gx:4,gy:-14,wa:-1.45,lean:-.06,hF:.35,hB:-.3,aB:1.6,eB:.5});
  if(o.pose=='ride')p=rP(p,{hF:1.45,kF:1.65,hB:1.25,kB:1.6});
  return drawHero(c,p,o.look||heroLook(),{t,wk:m,wg:o.wg!=null?o.wg:(EQ[m]?EQ[m].g||0:0),tier:o.tier!=null?o.tier:(EQ[m]?EQ[m].tier:0),glow:o.glow,wing:o.wing,fly:o.fly,wlen:o.wlen})}
const HSC=1.05;  // 主角在场景里的缩放
function drawPBody(){
  const cx=P.x+12-cam,fy=P.y+P.h,tm=performance.now()/1000;
  if(P.ar>0){x.fillStyle='rgba(255,212,59,'+(.22+.12*Math.sin(performance.now()/60))+')';x.beginPath();x.ellipse(cx,P.y+12,22,28,0,0,7);x.fill()}
  if(P.gr&&!P.fly)SHD(x,cx,fy,11);
  if(P.stun>0){const t=performance.now()/90;for(let i=0;i<3;i++){const sx=cx+Math.cos(t+i*2.1)*12,sy=P.y-14+Math.sin(t+i*2.1)*3;CT('★',sx,sy,10,'#ffd43b','center',2.4)}}
  if(P.inv>0&&Math.floor(P.inv*10)%2)return;
  const air=!P.gr,rn=P.run&&!air&&Math.abs(P.vx)>1,walk=!air&&Math.abs(P.vx)>1;
  const rg=heroRig(),nowT=performance.now(),rdt=Math.min(.05,(nowT-(P.rT||nowT))/1000);P.rT=nowT;P.rglow=rg.glow;
  P.rc=rigSmooth(P.rc,rg.p,rdt,P.swT!=null&&P.swT<.4||!!P.sk||!!P.cs);
  const tier=EQ[P.mode]?EQ[P.mode].tier:0,L=heroLook();
  x.save();x.translate(Math.round(cx*RS)/RS,fy);x.scale(P.f*HSC,HSC);
  const HH=HERO(),pxh=HH.heroOn(L);if(pxh){x.restore();x.save()}
  let wp;if(pxh){HH.hero(x,cx,fy,tm);wp=HH.wgeo()}else wp=drawHero(x,P.rc,L,{t:tm,wk:P.mode,wg:EQ[P.mode]?EQ[P.mode].g||0:0,glow:rg.glow,tier,wing:L.wing,fly:P.fly,world:1,ps:P.ps>0,mouth:rg.mouth||(P.at>0||P.sk?'o':null),closed:rg.closed,angry:P.at>0||!!P.sk||!!P.cs,spd:P.vx});
  x.restore();
  // 剑光:剑刃转得快 / 移动得快时记录轨迹(世界坐标);拖剑跑时剑尖擦地冒火花
  if(P.mode=='sword'&&st=='play'){const W=v=>[P.x+12+P.f*HSC*v[0],fy+HSC*v[1]],B=W(wp.b),T=W(wp.tip),Hh=W(wp.h),pv=P.wpv,spd=pv&&pv.f==P.f&&rdt>0?Math.max(Math.abs(angD(pv.wa,wp.wa))/rdt*40,Math.hypot(T[0]-pv.T[0]-(P.x-pv.px),T[1]-pv.T[1])/rdt):0;
    const stab=(P.swC==2&&P.swT!=null&&P.swT>=P.swW-.01&&P.swT<P.swD+.05)||(P.sk&&P.sk.id=='rstab'&&P.sk.t>.05&&P.sk.t<.34);
    // 直戳的剑气:一道从身后一个身位一直延伸到剑尖的直线光束(跟着剑尖往前长)
    if(stab){if(!P.thr){P.thr={x0:P.x+12-P.f*30,f:P.f,col:WPAL[tier][3],t1:0};THR.push(P.thr)}P.thr.x1=T[0];P.thr.y1=T[1];P.thr.t1=performance.now()/1000}else P.thr=null;
    if(!stab&&(spd>420||(pv&&pv.on&&spd>200)))trailRec(Hh,wp.wa,P.f,WPAL[tier][3],wp.b0,wp.t0);P.wpv={wa:wp.wa,T,f:P.f,px:P.x,on:spd>420};
    if(P.run&&P.gr&&Math.abs(P.vx)>1&&T[1]>GY-6&&Math.random()<.5)pt({x:T[0],y:GY-1,vx:-P.f*rnd(40,120),vy:rnd(-90,-30),g:500,c:pick(['#ffe066','#fff3bf','#ff922b']),s:rnd(1.4,2.4),l:rnd(.2,.35)})}
  if(P.frz>0){x.save();x.globalAlpha=.75;RR(x,cx-17,P.y-22,34,P.h+24,6,LG(x,cx-17,0,cx+17,0,['rgba(208,235,255,.85)','rgba(116,192,252,.55)','rgba(231,245,255,.85)']),1.4);LN_(x,[[cx-10,P.y-16],[cx-4,P.y+2]],'#fff',1.4);x.restore()}
  if(rn){x.globalAlpha=.5;for(const [dy,l] of [[-24,14],[-16,18],[-8,12]])LN_(x,[[cx-P.f*14,fy+dy],[cx-P.f*(14+l),fy+dy]],'#fff',1.4);x.globalAlpha=1}
  if(rn&&P.mode=='staff'&&Math.random()<.45)pt({x:P.x+12-P.f*4+rnd(-5,5),y:fy-3,vx:-P.f*rnd(20,60),vy:rnd(-20,10),g:0,c:pick(['#e599f7','#d0bfff','#ffffff']),s:rnd(1.2,2.2),l:rnd(.25,.4)});  // 浮空飞行:脚下飘紫色光点
  if(P.ps>0){const t=performance.now()/200;for(let i=0;i<3;i++)C_(x,cx-8+i*8,P.y-14-((t+i*.7)%2)*8,1.8,'#69db7c',.6)}}
// 残影:只画剪影
function ghostShape(c,col){c.fillStyle=col;c.beginPath();c.ellipse(1,-33,11,10.5,0,0,7);c.fill();c.beginPath();c.roundRect(-7,-25,14,16,5);c.fill();c.fillRect(-6,-11,4,11);c.fillRect(2,-11,4,11);PG(c,[[-11,-36],[-13,-46],[-3,-44],[3,-50],[9,-44],[12,-38]],col,0)}

// =====================================================================
