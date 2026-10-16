// ===== 装备外观(按系列):-1 = 没穿 · 0 旅者 · 1 林王 · 2 荒漠。品质颜色用在宝石、发带、肩甲描边上 =====
// 铠甲:没穿 = 布衣(没有护甲、没有披风);旅者 = 蓝色胸甲 + 银甲;林王 = 绿色木甲 + 叶片肩甲 + 胸口叶纹;荒漠 = 金甲 + 斜挎红腰巾 + 尖刺肩甲
const ARMP={'-1':{top:'#4a7fe0',top2:'#22448f'},0:{top:'#4a7fe0',top2:'#22448f',sv:['#f1f5fa','#b9c7d8','#7b8da6'],trim:'#ffd43b',in:'#26304a',belt:['#a0703a','#5c3a1e']},
  1:{top:'#69c46f',top2:'#22663a',sv:['#f0dfb8','#c09460','#7a5226'],trim:'#a9e34b',in:'#2c3a24',belt:['#8a5a2e','#4a2a14']},2:{top:'#ffd56b',top2:'#c0841c',sv:['#fff6d0','#f0be4a','#a8701a'],trim:'#e03131',in:'#5a2a14',belt:['#e03131','#8a1414']},
  3:{top:'#d0ebff',top2:'#4d8fcc',sv:['#ffffff','#bfe0f7','#6a9cc4'],trim:'#74c0fc',in:'#1c3550',belt:['#8fb8de','#3a5f86']}};  // 3 雪原:冰蓝银甲
// 发型:[样式, 发色, 高光]。没穿 / 旅者 = 刺头(旅者多一条品质色头带);林王 = 马尾 + 叶冠;荒漠 = 缠头巾
const HAIRS={'-1':['hero','#8a3b1e','#e0874a'],0:['hero','#8a3b1e','#e0874a'],1:['forest','#2f5a3a','#8fd18a'],2:['desert','#c98a2a','#ffe08a'],3:['desert','#dbe8f5','#ffffff']};
ARMP[4]=ARMP[3];HAIRS[4]=HAIRS[3];  // 第四十轮:机械系列(4)在原版几何画法里沿用雪原外观
function heroLook(){const tc=k=>EQ[k]?TR[EQ[k].tier][1]:null,sg=k=>EQ[k]?Math.min(3,EQ[k].g||0):-1,as=sg('body'),hg=sg('head'),A=ARMP[as],H=HAIRS[hg];
  return {hero:1,hs:H[0],hair:H[1],hl:H[2],hg,as,eye:'#2f7fd6',top:A.top,top2:A.top2,belt:'#8a5a2e',scarf:'#d6332f',leg:'#2b2f45',boot:'#6b3f1e',armor:as>=0?1:0,
  look:WEAR.fash,pad:tc('body'),helm:tc('head'),ear:tc('ear'),wing:WEAR.wing}}
// 头部(发型 / 脸 / 帽子),主角骨骼动画和 NPC 共用。头中心在 (1,-33),半径约 10.6
function chibiHead(c,o,t,lk,sk,hair,hs){
  // 头
  const HX=1,HY=-33;if(o.beard){}
  (HAIR[hs]||HAIR.spiky)(c,hair,t,{hl:o.hl,skin:sk,capc:o.capc,back:1,band:!lk&&o.hg==0?o.helm:null,hq:o.helm});
  E_(c,HX,HY,10.6,10.1,LG(c,0,HY-10,0,HY+10,[sk,o.ps?'#9edb8f':'#f7c79c']),1.2);
  if(o.closed){LN_(c,[[2.8,-32],[6.8,-32]],'#3b2a1a',1.1);LN_(c,[[-2.8,-32],[.2,-32]],'#3b2a1a',1)}
  else if(hs=='hero'||o.hero){EYE(c,5.6,-31.4,2.9,3.9,o.eye||'#2f7fd6');EYE(c,-.8,-31.4,2.4,3.6,o.eye||'#2f7fd6',.6)}
  else{EYE(c,5.3,-32.2,2.55,3.4,o.eye||'#3d7be0');EYE(c,-.9,-32.2,2.15,3.15,o.eye||'#3d7be0',.6)}
  const bc=o.brow||'#3b2414';LN_(c,o.angry?[[3,-37],[7.6,-35.6]]:[[3.2,-36.8],[7.4,-37.3]],bc,1.1);LN_(c,[[-2.6,-36.6],[.6,-36.8]],bc,1);
  E_(c,7.2,-28.6,1.7,.9,'rgba(255,120,120,.45)',0);E_(c,-2.2,-28.6,1.4,.8,'rgba(255,120,120,.35)',0);
  if(o.mouth=='o')E_(c,4.6,-26.8,1.2,1.4,'#7a2b2b',.6);else{c.beginPath();c.arc(4.4,-28.2,1.7,.35,2.6);c.strokeStyle=fc('#5a2b1a');c.lineWidth=.9;c.stroke()}
  if(o.beard)SMO(c,[[-4,-29],[8,-29],[9,-24],[5,-18],[1,-16],[-2,-20]],o.beard,1.1);
  if(o.must)SMO(c,[[0,-28.6],[4.5,-30],[9,-28.6],[4.5,-27.4]],o.must,.8);
  // 前发(写在发型里的前刘海已经画过;长发 / 学院帽需要额外的层)
  if(hs=='long'){SMO(c,[[-2,-40],[4,-43],[11,-38],[11.5,-30],[8,-35],[3,-38]],LG(c,0,-44,0,-30,['#3a3846','#1a1a1f']),1.1)}
  if(hs=='hero'&&o.hg==0&&o.helm&&!lk){RR(c,-6,-43.8,17,3.4,1.7,LG(c,0,-44.6,0,-40.6,['#fff',o.helm]),1.1)}
  if(hs=='hero'){PG(c,[[-8,-41],[-5,-34],[-2,-39],[1,-33.6],[3.4,-38.4],[6,-34],[8,-38.6],[10.6,-33],[11,-38],[13.6,-31],[12,-41],[6,-46],[-2,-46]],LG(c,0,-47,0,-33,[o.hl||'#e0874a',hair]),1.2);
    PG(c,[[9.6,-37],[13.4,-26],[10.4,-30],[8.6,-34]],hair,1)}
  if(hs=='forest'){SMO(c,[[-9,-37],[-7,-46],[1,-48.5],[9,-46],[12.6,-38],[12,-31],[9.4,-35],[7,-40],[2,-42],[-3,-40],[-6,-35]],LG(c,0,-49,0,-31,[o.hl||'#8fd18a',hair]),1.2);
    for(const [a,b,r] of [[-6,-46,-.9],[-1.5,-49,-.3],[4,-49,.3],[9,-46.5,.9]]){c.save();c.translate(a,b);c.rotate(r);E_(c,0,-1.6,1.7,3.4,LG(c,0,-5,0,2,['#d3f9d8','#40c057']),.9);c.restore()}
    if(o.helm)C_(c,1.2,-47.4,1.7,o.helm,.8)}
  if(hs=='desert'){PG(c,[[9.8,-37],[12.6,-27.5],[10,-30],[8.4,-34]],hair,1);
    SMO(c,[[-11,-36],[-11,-45],[-3,-51],[7,-50.5],[13,-44],[12.6,-36],[6,-38.6],[0,-39],[-6,-38]],LG(c,0,-51,0,-36,['#fffaf0','#f1e3c6','#d6c29a']),1.3);
    LN_(c,[[-10,-41.5],[0,-45.5],[12,-41.5]],'rgba(160,120,60,.55)',1);LN_(c,[[-9,-46],[2,-49.5],[11,-45.5]],'rgba(160,120,60,.45)',1);
    RR(c,-10.6,-40.6,23.6,2.6,1.3,'#e8a400',.9);PG(c,[[1.5,-46.4],[4.2,-42.6],[1.5,-38.8],[-1.2,-42.6]],RGD(c,.8,-44,4,['#fff',o.helm||'#e03131','#7a1f1f']),1)}
  if(lk=='fh'){E_(c,1,-47.5,5.2,4,'#1d1b24',1.1);RR(c,-6,-49,15,1.6,.8,'#ffd43b',.7);C_(c,9.6,-48.2,1.6,'#63e6be',.8)}
  if(o.ear&&!lk)C_(c,-2.6,-27,1.3,o.ear,.7);
  if(o.helm&&!lk&&!o.hero&&hs!='hero'){RR(c,-10,-41.8,22,4.2,2,LG(c,0,-42,0,-37.6,['#fff',o.helm]),1.1);C_(c,1,-39.7,1.6,'#fff3bf',.7)}
  if(lk=='xy'||o.hat=='wizard'){const hc=o.hatc||'#2b2c33';E_(c,1,-41,15,3.6,hc,1.2);PG(c,[[-8,-42],[9,-42],[5,-52],[0,-58],[-8,-61],[-4,-54]],hc,1.2);RR(c,-7.5,-44.5,16,3,1,'#7048e8',.8);C_(c,-8,-61,1.8,'#ffd43b',.8)}
  if(o.hat=='crown')PG(c,[[-6,-42],[-7,-50],[-3,-46],[1,-52],[5,-46],[9,-50],[8,-42]],LG(c,0,-52,0,-42,['#fff3bf','#fab005']),1.1);
  if(o.hat=='hood')SMO(c,[[-12,-30],[-12,-44],[0,-49],[12,-42],[12,-34],[6,-42],[-4,-42]],o.hatc||'#5f3dc4',1.2);
  if(o.hat=='band')RR(c,-10,-40,22,3.4,1.6,o.hatc||'#c92a2a',1);
}
function drawChibi(c,o){const t=o.t||0,lk=o.look,sk=o.ps?'#c3f0b8':(o.skin||'#ffdcb8'),robe=lk=='fh'||lk=='xy'||o.robe;
  const topc=lk=='fh'?'#ffffff':lk=='xy'?'#2b2c33':(o.top||'#3b6fd6'),top2=lk=='fh'?'#d8e2ec':lk=='xy'?'#15161a':(o.top2||'#2a4fa8');
  const legc=lk?'#3a3442':(o.leg||'#4a3a5c'),boot=lk=='fh'?'#3d4a52':(o.boot||'#6b3f1e'),hair=lk=='fh'?'#1d1b24':lk=='xy'?'#5c3a1e':(o.hair||'#6b3a1e'),hs=lk=='fh'?'long':lk=='xy'?'spiky':(o.hs||'spiky');
  // 姿势参数(主角动作系统传进来):lean 上身前倾(弧度,正 = 向前)、sq 下蹲压缩、dy 整体上下、armB 后手角度、legs 两腿角度
  const bob=(o.run?-Math.abs(Math.sin(o.ph*2))*1.3:(o.air||o.fly)?0:Math.sin(t*3)*.45)+(o.dy||0);
  if(o.wing){c.save();c.scale(1.3,1.3);c.translate(-12,-32);drawWing(c,o.wing,t,o.fly,o.wlen==null?1:o.wlen,o.world);c.restore()}
  let la=0,lb=0;if(o.ride){la=-1.35;lb=-1.05}else if(o.fly){la=.25;lb=.5}else if(o.air){la=-.6;lb=.4}else if(o.run){la=Math.sin(o.ph)*.9;lb=-la}else if(o.sit){la=-1.45;lb=-1.45}
  if(o.legs){la=o.legs[0];lb=o.legs[1]}
  c.save();c.translate(0,bob);if(o.sq)c.scale(1+o.sq*.45,1-o.sq);
  chLeg(c,-3,lb,legc,boot);chLeg(c,3,la,legc,boot);
  if(o.lean){c.translate(0,-11);c.rotate(o.lean);c.translate(0,11)}
  // 后手(跑步时和腿反向摆动)
  const aB=o.armB!=null?o.armB:o.run?1.5-Math.sin(o.ph)*.85:(o.air||o.fly)?2.3:1.62;chArm(c,-4.5,-19,aB,robe?topc:top2,sk,7);
  // 身体
  if(robe){const w=Math.sin(t*3)*1.2;SMO(c,[[-6.5,-24],[6.5,-24],[9,-12],[11+w*.4,-3],[0,-1.5],[-11-w*.4,-3],[-9,-12]],LG(c,0,-24,0,-2,[topc,top2]),1.2);
    if(lk=='fh'){LN_(c,[[-2,-23],[3,-14]],'#9fd8c8',1.2);LN_(c,[[3,-23],[-1,-16]],'#9fd8c8',1.2);RR(c,-8,-14.5,16,3,1.4,'#38d9a9',1);TUBE(c,[[-7,-13],[-12-w,-7],[-14-w*1.5,-1]],1.6,'#38d9a9');LN_(c,[[-10.5,-3.2],[10.5,-3.2]],'#a5d8ff',1.4)}
    else if(lk=='xy'){LN_(c,[[-10.6,-3.4],[10.6,-3.4]],'#7048e8',1.4);C_(c,3.5,-17,1.8,'#fab005',.8);RR(c,-1.4,-23,2.8,7,1,'#f1f3f5',.7);LN_(c,[[0,-22],[0,-17]],'#c92a2a',1.2)}
    else{RR(c,-7.5,-14.5,15,3,1.4,o.belt||'#c9a227',1)}}
  else{RR(c,-7,-24.5,14,15,5,LG(c,0,-24,0,-10,[topc,top2]),1.2);RR(c,-7.4,-13.8,14.8,3.2,1.4,LG(c,0,-14,0,-10.6,[o.belt||'#ffd43b','#c98a00']),1);RR(c,1.2,-14.2,3.6,4,1,'#fff3bf',.8);
    LN_(c,[[2,-23],[2,-15]],'rgba(255,255,255,.25)',1.6)}
  // 围巾 / 领子
  const sw=Math.sin(t*4+(o.ph||0))*1.6;
  if(lk=='xy'){RR(c,-7,-25.6,14,4,2,'#c92a2a',1);for(const sx of [-4,0,4])c.fillStyle=fc('#fab005'),c.fillRect(sx,-25.4,1.6,3.6);TUBE(c,[[-4,-23],[-9,-18+sw*.3],[-11,-12+sw*.5]],2.6,'#c92a2a')}
  else if(!robe&&o.scarf){RR(c,-7,-25.8,14,4.2,2,o.scarf,1);PG(c,[[-6,-24.5],[-14,-23.5+sw],[-13,-19+sw],[-6,-21.5]],o.scarf,1)}
  if(o.pad){E_(c,4.5,-22,4.2,2.8,LG(c,0,-25,0,-19,['#fff',o.pad]),1)}
  chibiHead(c,o,t,lk,sk,hair,hs);
  // 前手 + 武器
  const w=o.wpn;if(w){const aa=w.arm!=null?w.arm:.9,hx=4.5+Math.cos(aa)*8,hy=-19+Math.sin(aa)*8;
    if(w.k=='sword'&&w.a<-1.9){c.save();c.translate(hx,hy);c.rotate(w.a);SWORD(c,w.len||26,w.tint,w.glow);c.restore();chArm(c,4.5,-19,aa,robe?topc:topc,sk,8)}
    else{chArm(c,4.5,-19,aa,robe?topc:topc,sk,8);c.save();c.translate(hx,hy);
      if(w.k=='sword'){c.rotate(w.a);SWORD(c,w.len||26,w.tint,w.glow)}else if(w.k=='staff')STAFF(c,w.glow,w.tint);
      else if(w.k=='hammer'){c.rotate(w.a||-.6);TUBE(c,[[0,4],[0,-14]],2.4,'#8a5a2e');RR(c,-6,-20,12,7,2,LG(c,0,-20,0,-13,['#dee2e6','#868e96']),1.2)}
      else if(w.k=='cane'){TUBE(c,[[0,-6],[0,18]],2,'#8a5a2e');c.beginPath();c.arc(-3,-6,3,Math.PI,0);c.strokeStyle=OL;c.lineWidth=4.4;c.stroke();c.strokeStyle='#8a5a2e';c.lineWidth=2;c.stroke()}
      else if(w.k=='bag'){SMO(c,[[-5,0],[5,0],[7,9],[0,11],[-7,9]],'#c08a4a',1.1);LN_(c,[[-3,1],[3,1]],OL,1)}
      else if(w.k=='flask'){RR(c,-1.8,-9,3.6,4,1,'#c08a4a',.9);C_(c,0,-1,5.6,RGD(c,-1.5,-2.5,6.5,['#fff','#ff8fab','#d6336c']),1.2);E_(c,-1.8,-2.6,1.3,1.8,'rgba(255,255,255,.8)',0);const k=(t*1.3)%1;C_(c,1.5*Math.sin(t*5),-10-k*9,1+k*.8,'rgba(255,200,220,'+(1-k)+')',0)}
      else if(w.k=='book'){c.rotate(-.3);RR(c,-5,-6,10,12,1.5,'#7048e8',1.1);RR(c,-3.6,-5,8,10,1,'#fff9db',.6)}
      c.restore()}}
  else chArm(c,4.5,-19,1.1,robe?topc:topc,sk,8);
  c.restore()}
const lerp=(a,b,q)=>a+(b-a)*q,eo=q=>1-Math.pow(1-Math.max(0,Math.min(1,q)),3),eio=q=>{q=Math.max(0,Math.min(1,q));return q<.5?4*q*q*q:1-Math.pow(-2*q+2,3)/2},cl01=q=>Math.max(0,Math.min(1,q));
// =====================================================================
