// ===== 技能图标:启动时用画布画好,转成图片 =====
const ICON={};
(function mkIcons(){const N=48,mk=(id,c1,c2,fn)=>{const cv=document.createElement('canvas');cv.width=cv.height=N*4;const c=cv.getContext('2d');c.scale(4,4);const g=c.createLinearGradient(0,0,N,N);g.addColorStop(0,c1);g.addColorStop(1,c2);
    c.fillStyle=g;c.beginPath();c.roundRect?c.roundRect(0,0,N,N,9):c.rect(0,0,N,N);c.fill();c.strokeStyle='rgba(255,255,255,.25)';c.lineWidth=2;c.stroke();c.lineCap='round';c.lineJoin='round';fn(c);ICON[id]=cv.toDataURL()};
  const L=(c,pts,w,col)=>{c.strokeStyle=col;c.lineWidth=w;c.beginPath();c.moveTo(...pts[0]);for(const q of pts.slice(1))c.lineTo(...q);c.stroke()},
    F=(c,pts,col)=>{c.fillStyle=col;c.beginPath();c.moveTo(...pts[0]);for(const q of pts.slice(1))c.lineTo(...q);c.closePath();c.fill()},
    O=(c,x0,y0,r,col)=>{c.fillStyle=col;c.beginPath();c.arc(x0,y0,r,0,7);c.fill()},
    heart=(c,x0,y0,s,col)=>{c.fillStyle=col;c.beginPath();c.moveTo(x0,y0+s*.9);c.bezierCurveTo(x0-s*1.3,y0,x0-s*.7,y0-s*.9,x0,y0-s*.3);c.bezierCurveTo(x0+s*.7,y0-s*.9,x0+s*1.3,y0,x0,y0+s*.9);c.fill()},
    drop=(c,x0,y0,s,col)=>{c.fillStyle=col;c.beginPath();c.moveTo(x0,y0-s);c.bezierCurveTo(x0+s*.9,y0,x0+s*.8,y0+s*.9,x0,y0+s*.9);c.bezierCurveTo(x0-s*.8,y0+s*.9,x0-s*.9,y0,x0,y0-s);c.fill()},
    plus=(c,x0,y0)=>{O(c,x0,y0,8,'#2b8a3e');L(c,[[x0-4,y0],[x0+4,y0]],3,'#fff');L(c,[[x0,y0-4],[x0,y0+4]],3,'#fff')},
    cloud=(c,x0,y0,col)=>{for(const [a,b,r] of [[-10,2,8],[-2,-3,10],[8,0,9],[0,4,9]])O(c,x0+a,y0+b,r,col)};
  mk('sword0','#123049','#2f6fa8',c=>{for(const y of [15,24,33])L(c,[[6,y],[18,y]],2,'rgba(255,255,255,.6)');c.strokeStyle='#74c0fc';c.lineWidth=7;c.beginPath();c.arc(22,24,15,-1.25,1.25);c.stroke();c.strokeStyle='#fff';c.lineWidth=2.5;c.beginPath();c.arc(22,24,15,-1.25,1.25);c.stroke()});
  mk('sword1','#0d1233','#3b4cca',c=>{F(c,[[29,3],[14,26],[23,26],[17,45],[35,18],[26,18],[33,3]],'#ffe066');F(c,[[29,7],[19,24],[26,24],[22,36],[31,20],[24,20]],'#fff');for(const [a,b] of [[8,10],[40,32],[10,38]])O(c,a,b,2,'#a5d8ff')});
  mk('sword2','#2e1d0b','#9a6a1c',c=>{O(c,24,36,13,'rgba(255,212,59,.35)');L(c,[[24,36],[10,42]],2,'#ffd43b');L(c,[[24,36],[38,43]],2,'#ffd43b');L(c,[[24,36],[30,46]],2,'#ffd43b');L(c,[[4,38],[44,38]],3,'#5c3d1e');
    c.fillStyle='#e9ecef';c.fillRect(21,6,6,28);c.fillStyle='#fff';c.fillRect(23,7,2,26);c.fillStyle='#f1c40f';c.fillRect(14,6,20,4);c.fillStyle='#8d5524';c.fillRect(22,1,4,5)});
  mk('sword3','#071a33','#1864ab',c=>{c.save();c.translate(24,24);c.rotate(-Math.PI/4);const g=c.createLinearGradient(0,-6,0,6);g.addColorStop(0,'#74c0fc');g.addColorStop(.5,'#e7f5ff');g.addColorStop(1,'#339af0');c.fillStyle=g;
    c.beginPath();c.moveTo(-10,-6);c.lineTo(17,-5);c.lineTo(24,0);c.lineTo(17,5);c.lineTo(-10,6);c.closePath();c.fill();c.fillStyle='#1971c2';c.fillRect(-13,-11,4,22);c.fillStyle='#364fc7';c.fillRect(-21,-2,8,4);c.restore();c.globalAlpha=.6;O(c,38,10,2,'#e7f5ff');O(c,9,40,2,'#a5d8ff')});
  mk('staff1','#24103a','#7048e8',c=>{c.globalAlpha=.35;c.fillStyle='#e599f7';c.fillRect(7,16,9,20);c.globalAlpha=1;for(const xx of [20,25,30])O(c,xx,26,1.8,'#f3d9fa');c.fillStyle='#f3d9fa';c.fillRect(33,16,9,20);c.strokeStyle='#e599f7';c.lineWidth=2;c.beginPath();c.ellipse(37,26,10,15,0,0,7);c.stroke()});
  mk('staff0','#0b1028','#364fc7',c=>{cloud(c,24,11,'#868e96');L(c,[[24,16],[19,27],[26,27],[21,42]],5,'rgba(165,216,255,.55)');L(c,[[24,16],[19,27],[26,27],[21,42]],2,'#fff');c.strokeStyle='#74c0fc';c.lineWidth=2;c.beginPath();c.ellipse(21,42,10,3,0,0,7);c.stroke()});
  mk('staff2','#2e0e04','#c2410c',c=>{F(c,[[6,30],[20,18],[22,34]],'rgba(255,146,43,.6)');O(c,28,26,13,'#fa5252');O(c,29,25,10,'#ff922b');O(c,30,24,6.5,'#ffd43b');O(c,31,23,3,'#fff')});
  mk('staff3','#101216','#495057',c=>{cloud(c,24,13,'#343a40');cloud(c,24,10,'#5c5f66');for(const xx of [12,20,30,36])L(c,[[xx,26],[xx-3,34]],1.5,'rgba(165,216,255,.8)');L(c,[[22,20],[18,30],[24,30],[20,42]],2.5,'#ffe066');L(c,[[34,20],[31,28],[35,28],[32,36]],2,'#fff3bf')});
  mk('staff4','#170f2e','#5f3dc4',c=>{c.globalAlpha=.45;O(c,30,16,6,'#d0bfff');c.fillStyle='#d0bfff';c.fillRect(25,22,10,16);c.globalAlpha=1;O(c,17,18,6,'#f3f0ff');c.fillStyle='#f3f0ff';c.fillRect(12,24,10,16);L(c,[[22,30],[34,30]],2,'#b197fc');L(c,[[30,26],[35,30],[30,34]],2,'#b197fc')});
  mk('staff5','#2a1a0c','#a0703a',c=>{O(c,30,14,9,'#ff922b');O(c,30,14,6,'#8d6e4a');L(c,[[24,20],[12,8]],3,'rgba(255,169,77,.7)');c.strokeStyle='#e0b984';c.lineWidth=3;c.beginPath();c.arc(20,32,11,0,6.283);c.stroke();F(c,[[14,30],[20,24],[26,30],[24,38],[16,38]],'#8d6e4a')});
  mk('staff6','#0b2e28','#0ca678',c=>{for(let k=0;k<4;k++){c.strokeStyle=k%2?'#c3fae8':'#fff';c.lineWidth=2.5-k*.4;c.beginPath();c.ellipse(24,24,6+k*5,(6+k*5)*.6,0,k,k+4);c.stroke()}O(c,24,24,3,'#fff');O(c,10,12,2,'#ffa94d');O(c,39,36,2,'#a5d8ff')});
  mk('staff7','#3a0b0b','#e03131',c=>{for(const [a,b,h] of [[14,40,24],[24,40,32],[34,40,24]])F(c,[[a-6,b],[a,b-h],[a+6,b]],'rgba(255,169,77,.85)');F(c,[[18,40],[24,14],[30,40]],'#ffe066');O(c,24,30,4,'#fff')});
  mk('sword4','#06302a','#12b886',c=>{for(let i=0;i<3;i++)L(c,[[6,14+i*9],[26,14+i*9]],2,'rgba(195,250,232,.7)');c.strokeStyle='#e6fcf5';c.lineWidth=3;c.beginPath();c.arc(32,26,11,0,6.283);c.stroke();c.strokeStyle='#96f2d7';c.lineWidth=1.5;c.beginPath();c.arc(32,26,16,-.6,4.5);c.stroke();L(c,[[24,34],[40,18]],3,'#fff')});
  mk('sword5','#0b1d2e','#1c7ed6',c=>{O(c,24,22,8,'rgba(165,216,255,.5)');for(const [a,b,d,e] of [[8,8,40,36],[40,8,8,36],[24,4,24,40],[6,22,42,22]])L(c,[[a,b],[d,e]],2,'#e7f5ff');L(c,[[10,44],[38,44]],3,'#74c0fc');L(c,[[24,30],[24,46]],3,'#fff')});
  mk('sword6','#1c0b2e','#862e9c',c=>{c.strokeStyle='#f3d9fa';c.lineWidth=4;c.beginPath();c.arc(14,26,22,-1,1);c.stroke();c.strokeStyle='#e599f7';c.lineWidth=2;c.beginPath();c.arc(14,26,28,-.8,.8);c.stroke();for(const xx of [30,36,42])L(c,[[xx,18],[xx-8,26],[xx,34]],1.5,'rgba(208,191,255,.85)');O(c,38,26,3,'#fff')});
  mk('sword7','#3b0808','#e03131',c=>{const fl=(s,col)=>{c.fillStyle=col;c.beginPath();c.moveTo(24,40);c.bezierCurveTo(24-13*s,40,24-15*s,26,24-7*s,18);c.bezierCurveTo(24-6*s,24,24-2*s,24,24-3*s,20);c.bezierCurveTo(24-4*s,13,24+1*s,8,24+3*s,6);c.bezierCurveTo(24+2*s,13,24+9*s,15,24+10*s,22);c.bezierCurveTo(24+12*s,30,24+10*s,40,24,40);c.fill()};c.strokeStyle='#ff922b';c.lineWidth=2;for(let i=0;i<3;i++){c.beginPath();c.ellipse(24,30-i*7,15-i*3,4-i*.6,0,.3+i,4.6+i);c.stroke()}fl(1.25,'#c92a2a');fl(.85,'#ff6b35');fl(.5,'#ffd43b');O(c,24,33,2.5,'#fff9db')});
  const PB=['#0b3a2b','#2b8a3e'];
  mk('p_dj',...PB,c=>{L(c,[[13,30],[24,20],[35,30]],4,'#fff');L(c,[[13,20],[24,10],[35,20]],4,'#b2f2bb');c.fillStyle='#3a2a1a';c.fillRect(17,37,6,5);c.fillRect(26,37,6,5)});
  mk('p_hp',...PB,c=>heart(c,24,24,13,'#ff6b6b'));
  mk('p_mp',...PB,c=>{drop(c,24,24,14,'#4dabf7');O(c,20,26,3,'rgba(255,255,255,.6)')});
  mk('p_atk',...PB,c=>{c.save();c.translate(24,24);c.rotate(-Math.PI/4);c.fillStyle='#e9ecef';c.fillRect(-14,-3,24,6);c.fillStyle='#f1c40f';c.fillRect(-16,-7,3,14);c.fillStyle='#8d5524';c.fillRect(-22,-2,6,4);c.restore();F(c,[[36,6],[43,16],[39,16],[39,24],[33,24],[33,16],[29,16]],'#ff922b')});
  mk('p_def',...PB,c=>{F(c,[[24,6],[39,12],[37,30],[24,42],[11,30],[9,12]],'#ced4da');F(c,[[24,10],[35,14],[33,29],[24,38]],'#adb5bd');L(c,[[24,17],[24,31]],3,'#495057');L(c,[[17,24],[31,24]],3,'#495057')});
  mk('p_spd',...PB,c=>{for(const [y,w] of [[16,14],[24,20],[32,14]])L(c,[[6,y],[6+w,y]],3,'rgba(255,255,255,.7)');c.fillStyle='#e8590c';c.fillRect(24,14,10,16);c.fillRect(24,26,18,8);c.fillStyle='#fff';c.fillRect(24,32,18,3)});
  mk('p_hpr',...PB,c=>{heart(c,21,22,12,'#ff6b6b');plus(c,35,34)});
  mk('p_mpr',...PB,c=>{drop(c,21,22,13,'#4dabf7');plus(c,35,34)});
  // 第三十四轮修:第十六轮的新被动「回春」rec /「会心」crt 一直没有图标(显示成破图)。回春沿用生命回复图标;会心先用锐利,MENI 图集载入后换成暴击宝石图标(7Soul1,mkCrtIcon)
  ICON.p_rec=ICON.p_hpr;ICON.p_crt=ICON.p_atk})();
function mkCrtIcon(){if(!MENI.I)return;const N=192,cv=document.createElement('canvas');cv.width=cv.height=N;const c=cv.getContext('2d'),g=c.createLinearGradient(0,0,N,N);g.addColorStop(0,'#0b3a2b');g.addColorStop(1,'#2b8a3e');
  c.fillStyle=g;c.beginPath();c.roundRect?c.roundRect(0,0,N,N,36):c.rect(0,0,N,N);c.fill();c.strokeStyle='rgba(255,255,255,.25)';c.lineWidth=8;c.stroke();c.imageSmoothingEnabled=false;c.drawImage(MENI.I,MENI.P.amp_cr*34,0,34,34,28,28,136,136);ICON.p_crt=cv.toDataURL();if(typeof SKIMG!='undefined')delete SKIMG.p_crt}
if(MENI.I)mkCrtIcon();else{const im=new Image();im.onload=()=>{MENI.I=MENI.I||im;mkCrtIcon()};im.src=MENI.D}
let skTab=0,skSel=null;
// 主动技能必须按 H → U → I → O 的顺序学习(已经学会的不受影响,升级不限顺序)
const skCan=(w,i)=>i>=4&&!jobOk(w)?false:i==0||i==4||(LN[w][i]|0)>0||(LN[w][i-1]|0)>0;
