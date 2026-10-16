// ===== 场景:分层视差背景(预先画到离屏画布,运行时只贴图)=====
// =====================================================================
// y0:图层只保留 y0 起高 h 的一条(背景层大多是透明的,裁掉能大幅减少贴图像素)
function mkL(w,h,fn,y0){y0=y0||0;const cv=document.createElement('canvas');cv.width=Math.ceil(w*RS);cv.height=Math.ceil(h*RS);const c=cv.getContext('2d');c.setTransform(RS,0,0,RS,0,-y0*RS);c.lineJoin='round';c.lineCap='round';fn(c,w,h+y0);cv.y0=y0;return cv}
function tileL(L,par,y,dx){const w=L.width/RS,h=L.height/RS;y=L.y0||0;let ox=-(((cam*par+(dx||0))%w+w)%w);ox=Math.floor(ox*RS)/RS;x.imageSmoothingEnabled=false;for(let px=ox;px<VW;px+=w)x.drawImage(L,px,y||0,w+1/RS,h);x.imageSmoothingEnabled=true}
let SEED=1;const sr=()=>(SEED=SEED*16807%2147483647)/2147483647;
const W3=(w,fn)=>{fn(0);fn(-w);fn(w)};  // 可平铺:边缘元素左右各再画一份
// 场景元素
function cloudP(c,a,b,s,col,sh){const pf=[[0,0,12],[13,-6,14],[27,0,11],[8,5,10],[20,5,10]];c.lineWidth=2.4;c.strokeStyle=sh||'rgba(120,150,190,.55)';for(const [px,py,r] of pf){c.beginPath();c.arc(a+px*s,b+py*s,r*s,0,7);c.stroke()}
  for(const [px,py,r] of pf){c.beginPath();c.arc(a+px*s,b+py*s,r*s,0,7);c.fillStyle=col||'#fff';c.fill()}if(!sh)for(const [px,py,r] of pf.slice(0,3)){c.beginPath();c.arc(a+px*s-r*s*.25,b+py*s-r*s*.3,r*s*.45,0,7);c.fillStyle='rgba(255,255,255,.7)';c.fill()}}
function mount(c,a,b,w,h,col,snow,lw){const L1=[a-w*.18,b-h*.75],T=[a,b-h],R1=[a+w*.2,b-h*.7],pk=[[a-w/2,b],L1,T,R1,[a+w/2,b]];PG(c,pk,col,lw==null?1.4:lw);
  PG(c,[T,R1,[a+w/2,b],[a+w*.08,b]],'rgba(20,30,70,.13)',0);
  if(snow){const lp=(p,k)=>[T[0]+(p[0]-T[0])*k,T[1]+(p[1]-T[1])*k];PG(c,[lp(L1,.9),T,lp(R1,.95),lp([a+w*.1,b-h*.6],1),[a+w*.03,b-h*.72],[a-w*.05,b-h*.62],[a-w*.11,b-h*.7]],snow,1)}}
function pine(c,a,b,h,cols,lw){const tw=h*.08;RR(c,a-tw/2,b-h*.25,tw,h*.25,1,cols[3]||'#6b4423',lw);for(let i=0;i<4;i++){const y0=b-h*.18-i*h*.2,ww=h*(.42-i*.08),y1=y0-h*.32;
  PG(c,[[a-ww,y0],[a-ww*.55,y0-h*.06],[a-ww*.75,y0-h*.08],[a-ww*.3,y0-h*.17],[a-ww*.45,y0-h*.18],[a,y1],[a+ww*.45,y0-h*.18],[a+ww*.3,y0-h*.17],[a+ww*.75,y0-h*.08],[a+ww*.55,y0-h*.06],[a+ww,y0]],LG(c,a-ww,0,a+ww,0,[cols[0],cols[1]]),lw);
  if(cols[2])PG(c,[[a+ww*.15,y0-h*.04],[a+ww*.5,y0-h*.1],[a+ww*.25,y0-h*.16]],cols[2],0)}}
function rtree(c,a,b,s,cols,lw){RR(c,a-3*s,b-26*s,6*s,26*s,2*s,cols[3]||'#7a4a22',lw);for(const [px,py,r] of [[-9,-30,11],[8,-31,12],[0,-42,13],[-2,-28,10]])C_(c,a+px*s,b+py*s,r*s,LG(c,0,b-55*s,0,b-18*s,[cols[2]||cols[0],cols[0],cols[1]]),lw);
  for(const [px,py,r] of [[-3,-46,4],[10,-36,3.4]])C_(c,a+px*s,b+py*s,r*s,'rgba(255,255,255,.35)',0)}
function bush(c,a,b,s,col,col2,lw){for(const [px,py,r] of [[-8,-5,7],[0,-9,9],[9,-5,7]])C_(c,a+px*s,b+py*s,r*s,LG(c,0,b-18*s,0,b,[col2||col,col]),lw);RR(c,a-15*s,b-5*s,30*s,5*s,2,col,0)}
function flower(c,a,b,col){LN_(c,[[a,b],[a,b-6]],'#2f9e44',1);for(let i=0;i<5;i++)C_(c,a+Math.cos(i*1.256)*2.2,b-7+Math.sin(i*1.256)*2.2,1.6,col,.5);C_(c,a,b-7,1.2,'#ffd43b',0)}
// 每关的配色与图层
const LVA={
 1:{sky:['#3fa3f5','#8fd0ff','#d8f1ff'],sun:1,ground:{lip:['#8ae05c','#4caf2f'],body:['#c08a52','#8a5a32'],stone:'#a6713f',dark:'#6b4423'},
   far(c,w,h){W3(w,o=>{mount(c,140+o,250,320,170,'#8fa9e8','#fff');mount(c,420+o,250,380,150,'#9db8ef','#fff');mount(c,760+o,250,300,190,'#839ee0','#fff')});RR(c,0,232,w,40,0,'#a8c4f0',0)},
   mid(c,w,h){SEED=11;W3(w,o=>{for(let i=0;i<14;i++){const a=i*w/14+o+30;C_(c,a,272,46+((i*37)%20),LG(c,0,220,0,300,['#9be27a','#5cb84a']),1.4)}});RR(c,0,262,w,60,0,'#5cb84a',0);
     SEED=7;W3(w,o=>{for(let i=0;i<9;i++){const a=i*w/9+o+50;if(i%3==1)pine(c,a,272,70,['#2f9e44','#51cf66','#8ce99a','#6b4423'],1.2);else rtree(c,a,270,1.1,['#40c057','#2b8a3e','#8ce99a'],1.2)}})},
   near(c,w,h){W3(w,o=>{for(let i=0;i<10;i++){const a=i*w/10+o+40;bush(c,a,302,1.2,'#2f9e44','#69db7c',1.2);if(i%2)for(let k=0;k<3;k++)flower(c,a+20+k*6,302,['#ff6b6b','#fff','#fcc419'][k])}
     for(let i=0;i<6;i++){const a=i*w/6+o+80;for(let k=0;k<5;k++)RR(c,a+k*14,284,5,18,1.5,'#c08a52',1);RR(c,a-2,288,70,4,1.5,'#a6713f',1);RR(c,a-2,296,70,3,1.5,'#a6713f',1)}})}},
 2:{sky:['#120c2e','#2e1f5e','#5b3a8f'],moon:1,stars:1,ground:{lip:['#b197fc','#7048e8'],body:['#5a4b78','#3a2f52'],stone:'#4b3e66',dark:'#2a2140'},
   far(c,w,h){W3(w,o=>{for(let i=0;i<6;i++){const a=i*w/6+o+60,th=110+((i*53)%60);RR(c,a,280-th,40,th,2,'#2a2048',1.2);PG(c,[[a-6,280-th],[a+20,280-th-36],[a+46,280-th]],'#3b2d63',1.2);for(let k=0;k<3;k++)RR(c,a+15,280-th+18+k*26,9,12,4,'#ffd43b',.8)}});RR(c,0,262,w,40,0,'#2a2048',0)},
   mid(c,w,h){W3(w,o=>{for(let i=0;i<7;i++){const a=i*w/7+o+40;TUBE(c,[[a,300],[a+4,250],[a-10,226],[a-22,214]],5,'#3d2f5c');TUBE(c,[[a+3,256],[a+18,236],[a+28,232]],3,'#3d2f5c');
     if(i%2){RR(c,a+40,272,18,28,8,'#6c6386',1.2);LN_(c,[[a+49,278],[a+49,290]],'#3d3654',1.5);LN_(c,[[a+44,283],[a+54,283]],'#3d3654',1.5)}}})},
   near(c,w,h){W3(w,o=>{for(let i=0;i<9;i++){const a=i*w/9+o+30;for(let k=0;k<3;k++)PG(c,[[a+k*7-3,302],[a+k*7,288-k*4],[a+k*7+3,302]],LG(c,0,284,0,302,['#e5dbff','#9775fa']),1);E_(c,a+30,298,9,6,'#5f3dc4',1.1);C_(c,a+28,295,1.6,'#e599f7',0)}})}},
 3:{sky:['#1c3f8f','#3f73c4','#8fbbe8'],moon:1,ground:{lip:['#94d82d','#5c940d'],body:['#9aa3ad','#6b737d'],stone:'#868e96',dark:'#495057'},
   far(c,w,h){SEED=5;W3(w,o=>{for(let i=0;i<16;i++)pine(c,i*w/16+o+20,276,120+((i*29)%50),['#2c5f8a','#3d74a3',null,'#2c4f72'],0)});RR(c,0,262,w,40,0,'#2c5f8a',0)},
   mid(c,w,h){W3(w,o=>{for(let i=0;i<8;i++)pine(c,i*w/8+o+60,300,120+((i*41)%45),['#2b6e35','#6db544','rgba(216,232,106,.45)','#7a4a22'],1.3)})},
   near(c,w,h){W3(w,o=>{for(let i=0;i<12;i++){const a=i*w/12+o+20;bush(c,a,302,1,'#2b8a3e','#82c91e',1.1);for(let k=0;k<4;k++)TUBE(c,[[a+18+k*3,302],[a+20+k*4,292-k*2]],1.4,'#5c940d',0)}})}},
 4:{sky:['#07201a','#123d2c','#2a6b45'],fog:1,fy:0,ground:{lip:['#5c940d','#2b5a12'],body:['#4a3a2a','#2e2418'],stone:'#3d3022',dark:'#1e1610'},
   far(c,w,h){W3(w,o=>{for(let i=0;i<8;i++){const a=i*w/8+o+30;RR(c,a,0,34,300,6,LG(c,a,0,a+34,0,['#1b3a2a','#28503a']),1.2);for(let k=0;k<3;k++)TUBE(c,[[a+6+k*10,0],[a+2+k*12,60+k*25],[a+8+k*10,110+((i+k)*23)%60]],2,'#2f9e44',0)}});RR(c,0,262,w,40,0,'#163626',0)},
   mid(c,w,h){W3(w,o=>{for(let i=0;i<8;i++){const a=i*w/8+o+60;for(let k=0;k<5;k++)PG(c,[[a+k*9-4,300],[a+k*9+(k%2?3:-3),268-k%3*8],[a+k*9+4,300]],'#2b5a3a',1.1);
     if(i%2){RR(c,a+44,286,4,14,2,'#e9ecef',.8);E_(c,a+46,286,9,6,LG(c,0,280,0,292,['#e599f7','#9c36b5']),1.1);C_(c,a+43,284,1.5,'#fff',0)}}})},
   near(c,w,h){W3(w,o=>{for(let i=0;i<10;i++){const a=i*w/10+o+20;TUBE(c,[[a,302],[a+10,290],[a+24,284]],2.6,'#3a5a2a');for(let k=0;k<3;k++)PG(c,[[a+6+k*6,291-k*2.4],[a+8+k*6,284-k*2.4],[a+10+k*6,290-k*2.4]],'#adb5bd',.6)}})}},
 5:{sky:['#ff9f5a','#ffc77a','#ffeaa8'],sun:1,ground:{lip:['#ffe08a','#e8b04a'],body:['#d9a35f','#a8733a'],stone:'#c08a4a',dark:'#7a5226'},
   far(c,w,h){W3(w,o=>{PG(c,[[200+o,262],[270+o,180],[340+o,262]],LG(c,200+o,0,340+o,0,['#f0b26a','#d98a3e']),1.4);PG(c,[[270+o,180],[340+o,262],[300+o,262]],'rgba(0,0,0,.1)',0);
     PG(c,[[600+o,262],[640+o,212],[680+o,262]],'#e8a45a',1.3);RR(c,800+o,200,120,62,6,'#e09a50',1.3);RR(c,40+o,214,90,48,6,'#e7a85e',1.3)});RR(c,0,252,w,40,0,'#f2c27b',0)},
   mid(c,w,h){W3(w,o=>{for(let i=0;i<6;i++){const a=i*w/6+o;SMO(c,[[a-40,300],[a+30,250],[a+110,268],[a+180,300]],LG(c,0,250,0,300,['#ffd8a0','#f0b06a']),1.3)}})},
   near(c,w,h){W3(w,o=>{for(let i=0;i<5;i++){const a=i*w/5+o+60;RR(c,a-4,262,9,40,4,'#40c057',1.2);RR(c,a-14,272,8,18,4,'#40c057',1.1);RR(c,a+6,266,8,16,4,'#40c057',1.1);RR(c,a-14,282,10,4,2,'#40c057',0);LN_(c,[[a,268],[a,296]],'#2f9e44',.8);
     E_(c,a+60,298,12,5,'#c99a5b',1.1);C_(c,a+92,297,3,'#f8f9fa',.8);RR(c,a+95,296,12,2.6,1,'#f8f9fa',.6)}})}}};
