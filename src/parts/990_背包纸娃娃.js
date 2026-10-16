// ===== 背包纸娃娃 / 商城预览 =====
function drawDoll(c){const g=c.getContext('2d');g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,c.width,c.height);const k=c.width/112;g.scale(k,k);
  g.fillStyle=RGD(g,56,120,90,['rgba(255,255,255,.55)','rgba(255,255,255,0)']);g.fillRect(0,0,112,188);
  {const L=heroLook(),H=HERO();if(H.ready()&&(H===LPC||!L.look)){g.save();g.translate(56,178);SHD(g,0,0,26);g.scale(2,2);H.doll(g,L);g.restore();return}}
  g.save();g.translate(36,178);SHD(g,0,0,26);g.scale(2,2);{const L=heroLook();heroStatic(g,{mode:P.mode,t:0,look:L,wing:L.wing,wlen:.25,tint:EQ[P.mode]?TR[EQ[P.mode].tier][1]:null})}g.restore()}
function drawChick(c,t,o){o=o||{};const w=o.wave>0,hop=o.mv?-Math.abs(Math.sin(t*12))*2:0;c.save();c.translate(0,hop);
  E_(c,-3,0,2.6,1.4,'#f76707',.8);E_(c,3,0,2.6,1.4,'#f76707',.8);PG(c,[[-10,-9],[-14,-12],[-13,-7]],'#fcc419',1);
  E_(c,0,-8,10,8.6,LG(c,0,-17,0,0,['#fff3bf','#ffe066','#fcc419']),1.3);E_(c,1,-5,5.6,4.2,'#fff9db',0);E_(c,-4.6,-8,4.4,3,'#fab005',1,-.3);
  E_(c,3,-17,7.4,6.6,LG(c,0,-24,0,-11,['#fff3bf','#ffe066']),1.3);EYE(c,6,-17.4,1.7,2.1,'#212529');E_(c,7.4,-14.2,1.4,.7,'rgba(255,120,120,.6)',0);PG(c,[[9.6,-16.6],[13.4,-15.4],[9.6,-14]],'#f76707',1);
  c.beginPath();c.ellipse(3,-20,8.6,6.4,0,Math.PI,0);c.closePath();FS_(c,LG(c,0,-27,0,-20,['#dee2e6','#868e96']),1.3);RR(c,-6.4,-21,18.8,2.6,1.3,'#495057',1);C_(c,3,-26.6,1.3,'#495057',.8);E_(c,0,-24,2.2,1,'rgba(255,255,255,.6)',0);
  c.save();c.translate(10,-8);c.rotate(w?-1.1+Math.sin(t*20)*.4:-.2+Math.sin(t*4)*.15);LN_(c,[[0,0],[0,-7]],'#8d5524',1.4);c.beginPath();c.moveTo(0,-5);c.arc(0,-5,9,-2.4,-.7);c.closePath();FS_(c,'#e03131',1.1);for(const a of [-2.1,-1.7,-1.3,-.95])LN_(c,[[0,-5],[Math.cos(a)*9,-5+Math.sin(a)*9]],'#fff',.7);c.restore();c.restore()}
function drawPet(){if(!petOn())return;const p=PETS,t=performance.now()/1000;
  // 像素:画进 PXL 像素层(旋转的扇子也对齐像素格);走路时也保留原版的小跳
  if(TPX.on()){PXL.run(()=>{const m=TPX.M.chick,f=TPX.M.fan,hop=p.mv?-Math.round(Math.abs(Math.sin(t*12))*2):0;x.save();x.translate(Math.round(p.x+11-cam),Math.round(p.y+20));SHD(x,0,0,12);
    x.scale(p.f,1);x.imageSmoothingEnabled=false;TPX.spr(x,'chick',TPX.chickF(t,{wave:p.wv,mv:p.mv}),-m.ax,-m.ay+hop);x.restore();
    for(const q of PF){x.save();x.translate(Math.round(q.x-cam),Math.round(q.y));x.rotate(q.a);x.imageSmoothingEnabled=false;x.drawImage(TPX.I,f.x,f.y,f.w,f.h,-f.ax,-f.ay,f.w,f.h);x.restore()}});return}
  x.save();x.translate(p.x+11-cam,p.y+20);x.scale(p.f*1.3,1.3);SHD(x,0,0,9);drawChick(x,t,{wave:p.wv,mv:p.mv});x.restore();
  for(const q of PF){x.save();x.translate(q.x-cam,q.y);x.rotate(q.a);x.beginPath();x.moveTo(0,0);x.arc(0,0,10,-Math.PI*.9,-Math.PI*.1);x.closePath();FS_(x,'#e03131',1.1);
    for(let a=.2;a<.85;a+=.17)LN_(x,[[0,0],[Math.cos(-a*Math.PI)*10,Math.sin(-a*Math.PI)*10]],'#fff',.8);x.restore()}}
function pvImg(k){const t=.3,c=document.createElement('canvas'),g=c.getContext('2d');
  if(k=='spr'){c.width=c.height=144;g.scale(2,2);drawFairy(g,36,36,t,2)}
  else if(k=='pet'&&TPX.on()){c.width=c.height=144;g.imageSmoothingEnabled=false;g.translate(24,18);g.scale(2,2);TPX.spr(g,'chick',TPX.M.chick.stand,0,0)}
  else if(k=='pet'){c.width=c.height=144;g.scale(2,2);g.translate(32,66);g.scale(2.1,2.1);drawChick(g,t,{})}
  else if(COSD[k].t=='wing'&&HERO().ready()&&(HERO()===LPC||!WEAR.fash)){c.width=216;c.height=288;g.scale(2,2);g.translate(44,130);g.scale(2,2);HERO().pv(g,k,t)}
  else if(COSD[k].t=='fash'&&HERO()===LPC&&LPC.ready()){c.width=216;c.height=288;g.scale(2,2);g.translate(44,130);g.scale(2,2);LPC.pvF(g,k,t)}
  else{c.width=216;c.height=288;g.scale(2,2);const d=COSD[k];g.translate(40,132);g.scale(1.9,1.9);
    heroStatic(g,{t,look:{...heroLook(),look:d.t=='fash'?k:null},wing:d.t=='wing'?k:null,fly:k=='xyw',pose:k=='xyw'?'ride':null,wlen:.5})}
  return c.toDataURL()}

