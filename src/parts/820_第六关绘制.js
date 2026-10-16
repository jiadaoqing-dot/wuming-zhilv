// ===== 第六关绘制:企鹅 / 海豹 / 北极熊(原点在脚底中间,面朝右)=====
function drawPen(c,e,t){const el=e.k=='pen2',k=el?1.15:1,s=e.s,mv=(e.mvs||0)>.3&&!s;c.save();c.scale(k,k);SHD(c,0,0,11);
  const flip=(fx,fy,ang,big)=>{c.save();c.translate(fx,fy);c.rotate(ang);E_(c,0,5,3,7*(big||1),'#1f2a44',1.1);c.restore()};
  const body=(ex)=>{E_(c,-4,0,4,1.8,'#f59f00',1);E_(c,4,0,4,1.8,'#f59f00',1);
    E_(c,0,-13,11,13.5,LG(c,0,-27,0,0,['#3b4a6b','#1f2a44','#151c30']),1.3);E_(c,2.4,-11,7.6,10.4,LG(c,0,-21,0,0,['#ffffff','#e7f0fa']),0);
    if(el){PG(c,[[-6,-25],[-4,-31],[-1,-26],[2,-33],[4,-26],[7,-30],[7,-24]],LG(c,0,-33,0,-24,['#e7f5ff','#74c0fc']),1);RR(c,-9,-17.5,19,3.4,1.6,'#e03131',1);PG(c,[[-7,-16],[-12,-10+Math.sin(t*8)*1.5],[-8,-9]],'#e03131',1)}
    if(s=='dz'){LN_(c,[[3,-21],[6,-18]],'#fff',1);LN_(c,[[6,-21],[3,-18]],'#fff',1)}else{EYE(c,5,-19.5,1.9,2.3,'#14101c');if(ex)LN_(c,[[2.6,-23],[7,-22]],OL,1)}
    PG(c,[[8.6,-18.6],[13.4,-16.8],[8.6,-15.2]],'#ff922b',1);E_(c,6,-15,1.6,.8,'rgba(255,140,140,.55)',0)};
  if(s=='sl'||s=='tkl'){c.translate(-4,-9);c.rotate(1.45);body(1);flip(8,-12,.9);c.restore();
    if(s=='tkl'){c.save();c.globalAlpha=.6;for(let i=0;i<3;i++)LN_(c,[[-22-i*6,-6+i*4],[-34-i*8,-6+i*4]],'#fff',1.4);c.restore()}return}
  let rot=0;if(mv)rot=Math.sin(t*11+(e.ph||0))*.16;if(s=='sw'||s=='tk')rot=.55;if(s=='pk')rot=e.pz=='s'?.35:-.1;if(s=='dz')rot=Math.sin(t*6)*.25;
  c.rotate(rot);flip(-9,-15,.35);body(s=='th'||s=='pk'||s=='sw'||s=='tk');
  if(s=='th'){const up=e.pz=='w';flip(7,-14,up?-2.6:-.6);if(up)RR(c,4,-34,8,8,2,LG(c,0,-34,0,-26,['#ffffff','#a5d8ff']),1)}
  else flip(7,-13,s=='pk'?-.9:.15+(mv?Math.sin(t*11)*.3:0));
  c.restore();if(s=='dz'){const q=t*7;for(let i=0;i<3;i++)CT('★',Math.cos(q+i*2.1)*10,-34*k+Math.sin(q+i*2.1)*3,8,'#ffd43b','center',2)}}
function drawSeal(c,e,t){const el=e.k=='seal2',k=el?1.12:1,s=e.s,c1=el?'#8492a8':'#b8c4d6',c2=el?'#4c5870':'#7d8ca3';c.save();c.scale(k,k);
  if((s=='hid'||(s=='dig'&&e.t>.3))&&ICE6P.on()){c.imageSmoothingEnabled=false;ICE6P.spr('hole',-22,-15,c);if(Math.sin(t*1.7+(e.ph||0))>.75){c.fillStyle='#fff';c.fillRect(-3,-8,2,2);c.fillRect(2,-8,2,2)}c.restore();return}
  if(s=='hid'||(s=='dig'&&e.t>.3)){E_(c,0,-3,20,7,LG(c,0,-10,0,0,['#ffffff','#d6e4f0']),1.2);E_(c,2,-5,6,2.6,'#2b3448',.8);
    if(Math.sin(t*1.7+(e.ph||0))>.75){C_(c,0,-6,1.2,'#fff',0);C_(c,4,-6,1.2,'#fff',0)}c.restore();return}
  if(s=='ball'){const r=21;c.save();c.translate(0,-r);c.rotate(e.rot||0);C_(c,0,0,r,RGD(c,-6,-6,r*1.4,['#ffffff','#e7f0fa','#b7cde2']),1.5);
    for(const [a,b,rr] of [[-8,-6,4],[7,5,3],[5,-10,2.5],[-6,9,3]])C_(c,a,b,rr,'rgba(170,195,220,.6)',0);E_(c,0,0,7,5,c1,.9);EYE(c,2,-1,1.5,1.8,'#14101c');c.restore();
    SHD(c,0,0,18);c.restore();return}
  SHD(c,0,0,16);let tilt=0,hy=0;if(s=='pop')tilt=-.5;if(s=='in'&&e.pz=='w')hy=-3;if(s=='cu')tilt=Math.sin(t*20)*.08;if(s=='dig')c.translate(0,(e.t/.3)*8);
  c.rotate(tilt);
  E_(c,-17,-3,5,2.6,c2,1,-.4);E_(c,-17,-1,5,2.4,c2,1,.4);
  SMO(c,[[-18,-2],[-12,-11],[0,-15],[10,-17+hy],[16,-10],[12,-1],[-4,0]],LG(c,0,-18,0,0,[c1,c2]),1.3);E_(c,2,-3,11,3.4,'rgba(255,255,255,.35)',0);
  if(el)for(const [a,b] of [[-10,-8],[-3,-11],[-6,-5]])C_(c,a,b,1.6,'rgba(30,40,60,.35)',0);
  const hx=12,hyy=-14+hy,puff=s=='in'&&e.pz=='w'?1.25:1;C_(c,hx,hyy,8.4*puff,LG(c,0,hyy-8,0,hyy+8,[c1,c2]),1.2);
  if(el)PG(c,[[hx-6,hyy-6],[hx-5,hyy-12],[hx-2,hyy-8],[hx+1,hyy-13],[hx+3,hyy-8],[hx+6,hyy-11],[hx+6,hyy-5]],LG(c,0,hyy-13,0,hyy-5,['#e7f5ff','#74c0fc']),1);
  EYE(c,hx+3,hyy-2,2.2,2.6,'#14101c');E_(c,hx+7.6,hyy+1.4,1.6,1.2,'#14101c',0);
  if(s=='in'&&e.pz=='s')C_(c,hx+8,hyy+3,2.2,'#2b1a12',.6);
  for(const d of [-1,1])LN_(c,[[hx+6,hyy+2.6],[hx+12,hyy+2.6+d*2]],'rgba(43,26,18,.6)',.6);
  const fa=s=='slp'?(e.pz=='w'?-2.4:.6):s=='cu'?-.6:.5+Math.sin(t*3)*.15;c.save();c.translate(5,-6);c.rotate(fa);E_(c,0,5,3,6.5,c2,1.1);c.restore();
  if(s=='slp'&&e.pz=='w')WARN(c,4,-34,.7);
  c.restore()}
// 北极熊:四足 / 站立 / 趴滑 / 坐地眩晕 四种基本姿势
function drawBear(c,e,t){if(KB.bear(c,e,t))return;const a=e.act,at=e.at||0,rg=e.rage,W='#f8f9fa',W2='#d5dfea',W3='#b4c3d3',eyeC=rg?'#e03131':'#14101c';
  const legQ=(lx,ph,lift)=>{const sw=Math.sin(ph)*5;RR(c,lx-7+sw*.3,-26-(lift||0),14,26,6,LG(c,0,-26,0,0,[W,W2]),1.3);E_(c,lx+2+sw,-(lift||0)-1,9,4.5,W3,1.2);for(const k of [-3,1,5])LN_(c,[[lx+k+sw+2,-3-(lift||0)],[lx+k+sw+2,-1-(lift||0)]],'#495057',.8)};
  const head=(hx,hy,open,down)=>{C_(c,hx-9,hy-15,6.5,W,1.2);C_(c,hx-9,hy-15,3.2,'#ffc9c9',0);E_(c,hx,hy,19,16,LG(c,0,hy-16,0,hy+16,[W,W2]),1.4);
    E_(c,hx+14,hy+6+(down||0),11,8,W,1.2);E_(c,hx+22,hy+2+(down||0),4.6,3.4,'#212529',1);
    if(e.dz>0&&!e.kn){CT('@',hx+5,hy+2,9,'#495057','center',0)}else{E_(c,hx+5,hy-4,3,3.4,'#fff',.8);C_(c,hx+5.8,hy-3.6,1.8,eyeC,0);LN_(c,[[hx+1,hy-10],[hx+9,hy-8+(rg?2:0)]],OL,1.6)}
    if(open)PG(c,[[hx+8,hy+9],[hx+28,hy+8],[hx+22,hy+18],[hx+10,hy+15]],'#862e2e',1.1);else LN_(c,[[hx+12,hy+11],[hx+24,hy+9]],OL,1.1);
    if(rg){c.save();c.globalCompositeOperation='lighter';C_(c,hx+5.8,hy-3.6,7,RGD(c,hx+5.8,hy-3.6,7,['rgba(255,80,80,.8)','rgba(0,0,0,0)']),0);c.restore()}};
  const frost=(pts)=>{if(!rg)return;for(const [px,py,h] of pts)PG(c,[[px-4,py],[px,py-h],[px+4,py]],LG(c,0,py-h,0,py,['#e7f5ff','#4dabf7']),1)};
  const arm=(sx,sy,ex,ey)=>{TUBE(c,[[sx,sy],[ex,ey]],14,W);E_(c,ex,ey,9,7.5,W2,1.2)};
  const pz=e.pz,walkPh=(e.mvs||0)>.3?t*9:0;
  // —— 趴着滑冰
  if(e.gs=='belly'){SHD(c,0,0,60);E_(c,-50,-14,8,6,W2,1.1);E_(c,-2,-20,58,20,LG(c,0,-40,0,0,[W,W2]),1.5);frost([[-30,-36,10],[-12,-39,12],[6,-38,10]]);arm(30,-14,70,-6);head(66,-26,1,2);c.globalAlpha=.6;for(let i=0;i<3;i++)LN_(c,[[-70-i*10,-8-i*6],[-96-i*10,-8-i*6]],'#fff',1.6);c.globalAlpha=1;return}
  // —— 坐地(眩晕)/ 跪地(暴风雪后累趴)
  if(e.dz>0){SHD(c,0,0,46);if(e.kn){const br=Math.sin(t*4)*1.5;E_(c,-6,-30+br,46,26,LG(c,0,-56,0,-4,[W,W2]),1.5);legQ(-30,0);arm(24,-30,40,-4);head(46,-24,1,3);CT('💦',60,-52,12,'#74c0fc','center',0)}
    else{E_(c,-6,-34,38,32,LG(c,0,-66,0,-2,[W,W2]),1.5);E_(c,-26,-4,11,7,W2,1.2);E_(c,18,-4,11,7,W2,1.2);arm(-24,-50,-30,-20);arm(20,-50,26,-22);c.save();c.translate(10,-72);c.rotate(Math.sin(t*5)*.15);head(0,0,0);c.restore()}return}
  // —— 站立类动作
  const stand=(a=='slam'&&pz=='w')||(a=='combo'&&e.n>=2&&pz=='w')||a=='roar'||a=='hug'||a=='bliz'||(a=='ball'&&pz=='w');
  if(stand){SHD(c,0,0,44);const sh=Math.sin(t*40)*(pz=='w'?.8:0);
    E_(c,-12,-5,11,7,W2,1.2);E_(c,14,-5,11,7,W2,1.2);E_(c,-26,-50,6,5,W2,1);
    E_(c,0+sh,-56,31,46,LG(c,0,-102,0,-10,[W,W2]),1.5);E_(c,7+sh,-50,19,32,'rgba(255,255,255,.55)',0);frost([[-24,-80,10],[-28,-62,12],[-26,-42,10]]);
    let L=[-14,-84,-36,-118],Rr=[18,-84,34,-120],open=0,hy=-112;
    if(a=='slam'||a=='combo'){L=[-14,-84,-20,-128];Rr=[18,-84,26,-130]}
    else if(a=='hug'){if(e.gs=='hold'){L=[-14,-84,34,-62];Rr=[18,-84,40,-74]}else if(pz=='w'){L=[-14,-84,-52,-100];Rr=[18,-84,58,-102];open=1}else{L=[-14,-84,40,-80];Rr=[18,-84,52,-86];open=1}}
    else if(a=='roar'||a=='bliz'){L=[-14,-84,-44,-74];Rr=[18,-84,48,-76];open=at>.4;hy=-116}
    else if(a=='ball'){L=[-14,-84,-4,-132];Rr=[18,-84,14,-134]}
    arm(L[0]+sh,L[1],L[2]+sh,L[3]);head(8+sh,hy,open);arm(Rr[0]+sh,Rr[1],Rr[2]+sh,Rr[3]);
    if(a=='ball')C_(c,6,-150,17,RGD(c,0,-156,22,['#ffffff','#e7f0fa','#b7cde2']),1.4);
    if(a=='hug'&&pz=='w'&&!e.gs)WARN(c,8,-148,1.2);
    if((a=='roar'||a=='bliz')&&at>.4){c.save();c.globalAlpha=.6;for(let i=0;i<3;i++){c.beginPath();c.arc(36,hy+6,14+i*10+(t*40%10),-.7,.7);c.strokeStyle='#e7f5ff';c.lineWidth=2;c.stroke()}c.restore()}
    return}
  // —— 四足(走路 / 熊掌 / 冲撞 / 砸地出手 / 扔雪球出手 / 三连击)
  SHD(c,0,0,54);const run=a=='charge'&&at>=.9,ph=run?t*18:walkPh;
  let lean=0;if(pz=='w'&&a=='charge')lean=-.06;if(run)lean=.06;
  c.save();c.rotate(lean);
  C_(c,-54,-44,6.5,W2,1.1);
  legQ(-36,ph+Math.PI);legQ(-20,ph);
  E_(c,-4,-38,50,27,LG(c,0,-65,0,-11,[W,W2]),1.5);E_(c,0,-24,36,8,'rgba(180,195,211,.35)',0);frost([[-34,-60,12],[-16,-64,14],[2,-63,12],[20,-58,10]]);
  // 前腿:熊掌拍击时抬起 / 拍下
  const pawA=a=='paw'||a=='combo';if(pawA&&pz=='w'){legQ(20,0);arm(34,-44,52,-82);}
  else if((pawA||a=='slam'||a=='combo')&&pz=='s'){legQ(20,0);arm(34,-44,74,-8)}
  else{legQ(22,ph+Math.PI);legQ(36,ph)}
  const hd=a=='charge'&&pz=='w'?6:run?4:0;head(52,-48+hd,(a=='charge'&&at<.5)||(pawA&&pz=='s')||(a=='slam'&&pz=='s'),hd?2:0);
  c.restore()}
// 怪物绘制入口(MON 表里注册)
MON.dog=drawDog;MON.dog2=drawDog;MON.andr=MON.wiz=(c,e,t)=>ARS.boss(c,e,t);MON.pen=drawPen;MON.pen2=drawPen;MON.seal=drawSeal;MON.seal2=drawSeal;MON.bear=drawBear;
