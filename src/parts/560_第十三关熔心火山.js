// ===== 第四十二轮:第十三关「熔心火山」(第二张地图「暗黑大陆」左上角的火山(用户截图指定),cur = 16)=====
// 图集 FIRE(art_src/fire13/build_fire13.py):远景 Volcano Background(cubbic,CC-BY 3.0,天空改成暗红烟尘)· 地面 Tio Aimar 火山包(CC0)·
//   首领 焚天炎君 fk = Evil Wizard · 精英 炎术士 fsm = Wizard Pack · 小怪 火蠕虫 fwm = Fire Worm(三个都是 LuizMelo,CC0)· 小怪 熔岩牛头人 mmt(zaphgames,CC-BY 3.0)
// 数值约 = 第十二关 ×1.15(LM 25 · MHK 82 · BHN 14200 · BDF 46);掉落和前两关一样(机械系列、合成添加剂 30%、怪物技能石),另外 360 小鸟碎片 35%、女神灵魂碎片
// 首领招式:烈焰吐息 brth(面前 170 像素持续喷火)· 陨火雨 rain(主角附近落下 7 颗火球,二阶段 11 颗)· 熔岩潮 wave(两道贴地火浪,跳过去)·
//   炎遁 tele(消失后出现在主角身后,接着喷火)· 焚天炎爆 nova(蓄力 1.6 秒后 260 像素内爆炸,跑远躲开)。半血以下二阶段:动作快 20%
const E16=[['fwm',360],['mmt',480],['fwm',620],['fsm',820],['mmt',1000],['fwm',1160],['mmt',1300],['fsm',1500],['fwm',1660],['mmt',1820],['fwm',1960],['fsm',2140],['mmt',2260],['fwm',2380],['fsm',2520]];
const FIRE={I:null,D:'@@A:fire13_atlas@@',M:{"bg":[0,0,640,160],"gnd":[641,0,256,64],"ew_idle":[898,0,768,71,96,8],"ew_move":[0,161,768,71,96,8],"ew_attack":[769,161,768,71,96,8],"ew_hurt":[1538,161,384,71,96,4],"ew_death":[0,233,480,71,96,5],"wp_idle":[481,233,1128,138,188,6],"wp_run":[0,372,1504,138,188,8],"wp_attack1":[0,511,1504,138,188,8],"wp_attack2":[0,650,1504,138,188,8],"wp_hurt":[0,789,752,138,188,4],"wp_death":[0,928,1316,138,188,7],"fw_idle":[1317,928,702,56,78,9],"fw_walk":[0,1067,702,56,78,9],"fw_attack":[703,1067,1248,56,78,16],"fw_hurt":[0,1124,234,56,78,3],"fw_death":[235,1124,624,56,78,8],"fb_move":[860,1124,228,34,38,6],"fb_boom":[1089,1124,266,34,38,7],"mt_walk":[1356,1124,236,95,59,4],"mt_atk":[1593,1124,236,95,59,4]},
  A:{ew:[28.0,55,68],wp:[67.5,86,137],fw:[30.5,41,55],fb:[14.0,12,22],mt:[23.5,92,93]},
  P:{fwm:'fw',mmt:'mt',fsm:'wp',fk:'ew'},
  init(){const im=new Image();im.onload=()=>{this.I=im};im.src=this.D},
  on(e){return !!this.I&&!!this.P[e.k]},
  fr(c,k,i,X,Y,s,f){const m=this.M[k];if(!m||!this.I)return;const fw=m[4]||m[2],n=m[5]||1;i=((Math.floor(i)%n)+n)%n;s=s||1;c.save();c.imageSmoothingEnabled=false;c.translate(Math.round(X),Math.round(Y));if(f<0){c.translate(fw*s,0);c.scale(-1,1)}c.drawImage(this.I,m[0]+i*fw,m[1],fw,m[3],0,0,fw*s,m[3]*s);c.restore()},
  // 怪物:c 已经平移到脚底中间、按朝向翻转(面朝右);素材本来就朝右
  draw(c,e,t){const k=e.k,p=this.P[k],A=this.A[p],H=e.h/(e.max?1.1*(e.bsz||1):(e.vs||1)),s=H/A[1];let row=p=='mt'?'mt_walk':p+'_idle',fi=p=='mt'?0:t*8+(e.ph||0)*3;c.save();if(FLW)c.filter='brightness(2.6)';
    if(k=='fk'){const a=e.act,T=e.at||0;fi=t*8;
      if(a=='brth'||(a=='tele'&&e.n)){row='ew_attack';fi=T<.5?Math.min(3,T/.12):4+(t*10)%4}
      else if(a=='rain'||a=='nova'){row='ew_attack';fi=T<.3?T/.15:1;const lim=a=='nova'?1.6:.8;if(T<lim&&!FLW){const k_=Math.min(1,T/lim);c.filter='brightness('+(1+k_*.8)+') saturate('+(1+k_)+')'}}
      else if(a=='wave'){row='ew_attack';fi=T<.6?Math.min(3,T/.15):Math.min(7,4+(T-.6)/.06)}
      else if(a=='tele'){row='ew_move';fi=t*12;if(!FLW)c.globalAlpha=Math.max(.15,Math.abs(1-T/.35))}
      else if(e.st>0){row='ew_hurt';fi=t*10}else if(e.mv){row='ew_move';fi=t*10}}
    else{const st=e.s;
      if(k=='fwm'){if(st=='aim'||st=='bw'){row='fw_attack';fi=Math.min(8,e.t/.07)}else if(st=='sh'||st=='bt'){row='fw_attack';fi=9+Math.min(6,e.t/.05)}}
      else if(k=='mmt'){if(st=='mw'){row='mt_atk';fi=Math.min(1,e.t/.25)}else if(st=='mp'){row='mt_atk';fi=2+Math.min(1,e.t/.1)}else if(e.mv)fi=t*8}
      else if(k=='fsm'){if(st=='cw'||st=='ww'){row=st=='cw'?'wp_attack1':'wp_attack2';fi=Math.min(3,e.t/.15)}else if(st=='cs'||st=='ws'){row=st=='cs'?'wp_attack1':'wp_attack2';fi=4+Math.min(3,e.t/.07)}}
      if(row==p+'_idle'){if(e.st>0){row=p+'_hurt';fi=0}else if(e.mv){row=p+(p=='fw'?'_walk':'_run');fi=t*10}}}
    this.fr(c,row,fi,-A[0]*s,-A[2]*s,s,1);c.restore()},
  // 场景:暗红烟尘天空(纯色补底)+ 火山远景(视差)+ 火山地面
  bg(){const g=x.createLinearGradient(0,0,0,GY);g.addColorStop(0,'#2a0d08');g.addColorStop(1,'#6b2410');x.fillStyle=g;x.fillRect(0,0,VW,VH);const I=this.I,M=this.M;if(!I)return;x.imageSmoothingEnabled=false;
    {const m=M.bg,sc=1.6,w=m[2]*sc,h=m[3]*sc;for(let px=-(((cam*.3)%w)+w)%w;px<VW;px+=w)x.drawImage(I,m[0],m[1],m[2],m[3],Math.floor(px),Math.round(GY+10-h),Math.ceil(w),h)}
    {const m=M.gnd;for(let px=Math.floor((cam-4)/m[2])*m[2];px<cam+VW+4;px+=m[2])x.drawImage(I,m[0],m[1],m[2],m[3],Math.round(px-cam),GY-8,m[2],m[3])}},
  over(){x.fillStyle='rgba(255,90,20,.05)';x.fillRect(0,0,VW,VH)}};
FIRE.init();
let F16B=[],F16M=[],F16W=[];  // 火球(火蠕虫 / 炎术士 / 首领)· 陨火雨 · 贴地火浪
function f16Clr(){F16B=[];F16M=[];F16W=[]}
const f16Shot=(x0,y0,vx,dm,s,d)=>{F16B.push({x:x0,y:y0,vx,dm,s:s||1,d:d||10,tr:0,t:0});syn('proj')};
// ---- 火蠕虫:保持距离吐火球(直线);被贴身就咬一口 ----
function fwmStep(e,dt){const dm=e.dm,cx=e.x+e.w/2,pc=P.x+12,dx=pc-cx,ad=Math.abs(dx),lo=g8Lo(e),hi=g8Hi(e),cl=v=>Math.max(lo,Math.min(hi-e.w,v));
  e.cd=(e.cd==null?rnd(1,2):e.cd)-dt;e.pz=null;e.mv=0;const s=e.s;if(s)e.t+=dt;
  if(s=='aim'){e.pz='w';e.f=sgn(dx)||e.f;if(e.t>=.6){e.s='sh';e.t=0;f16Shot(cx+e.f*e.w*.6,e.y+e.h*.45,e.f*250,dm,1,10)}return}
  if(s=='sh'){e.pz='s';if(e.t>.3){e.s='rec';e.t=0}return}
  if(s=='bw'){e.pz='w';if(e.t>=.4){e.s='bt';e.t=0;e.hd=0}return}
  if(s=='bt'){e.pz='s';if(!e.hd&&ov(P,{x:e.f>0?cx:cx-46,y:e.y,w:46,h:e.h})&&hurt(9*dm,{kb:e.f*200}))e.hd=1;if(e.t>.3){e.s='rec';e.t=0}return}
  if(s=='rec'){if(e.t>.6){e.s=null;e.cd=rnd(1.3,2.1)}return}
  e.f=sgn(dx)||e.f;if(ad>150){e.x=cl(e.x+e.f*chV(50,ad)*dt);e.mv=1}else if(ad<110&&ad>50){e.x=cl(e.x-e.f*40*dt);e.mv=1}
  if(e.cd<=0){if(ad<50){if(!tok(e)){e.cd=.3;return}e.s='bw';e.t=0}else if(ad<MRNGR+20){if(!tok(e,1)){e.cd=.4;return}e.s='aim';e.t=0}}}
// ---- 熔岩牛头人:走近 → 全身熔岩化蓄力 → 火拳(打中后脚下炸开火花)----
function mmtStep(e,dt){const dm=e.dm,cx=e.x+e.w/2,pc=P.x+12,dx=pc-cx,ad=Math.abs(dx),lo=g8Lo(e),hi=g8Hi(e),cl=v=>Math.max(lo,Math.min(hi-e.w,v));
  e.cd=(e.cd==null?rnd(.6,1.4):e.cd)-dt;e.pz=null;e.mv=0;const s=e.s;if(s)e.t+=dt;
  if(s=='mw'){e.pz='w';e.f=sgn(dx)||e.f;if(e.t>=.5){e.s='mp';e.t=0;e.hd=0}return}
  if(s=='mp'){e.pz='s';e.x=cl(e.x+e.f*120*dt);if(!e.hd&&e.t>.05){e.hd=1;VFX.spawn('warm-explosion',cx+e.f*34,e.y+e.h*.45,{s:.8});if(ov(P,{x:e.f>0?cx:cx-64,y:e.y-6,w:64,h:e.h+6}))hurt(13*dm,{kb:e.f*300})}if(e.t>.3){e.s='rec';e.t=0}return}
  if(s=='rec'){if(e.t>.6){e.s=null;e.cd=rnd(.8,1.4)}return}
  e.f=sgn(dx)||e.f;if(ad>e.w/2+34){e.x=cl(e.x+e.f*chV(62,ad)*dt);e.mv=1}
  if(e.cd<=0&&ad<e.w/2+60&&Math.abs(P.y+P.h-(e.y+e.h))<70){if(!tok(e)){e.cd=.3;return}e.s='mw';e.t=0}}
// ---- 炎术士(精英):火焰法球(近,大范围)/ 大火球(远)----
function fsmStep(e,dt){const dm=e.dm,cx=e.x+e.w/2,pc=P.x+12,dx=pc-cx,ad=Math.abs(dx),lo=g8Lo(e),hi=g8Hi(e),cl=v=>Math.max(lo,Math.min(hi-e.w,v));
  e.cd=(e.cd==null?rnd(1,2):e.cd)-dt;e.pz=null;e.mv=0;const s=e.s;if(s)e.t+=dt;
  if(s=='cw'||s=='ww'){e.pz='w';e.f=sgn(dx)||e.f;if(e.t>=.6){e.s=s=='cw'?'cs':'ws';e.t=0;e.hd=0;if(s=='ww')f16Shot(cx+e.f*40,e.y+e.h*.4,e.f*230,dm,1.6,12)}return}
  if(s=='cs'){e.pz='s';if(!e.hd&&e.t>.06){e.hd=1;VFX.spawn('warm-explosion',cx+e.f*60,e.y+e.h*.45,{s:1.5});if(ov(P,{x:e.f>0?cx:cx-110,y:e.y-20,w:110,h:e.h+20}))hurt(14*dm,{kb:e.f*320})}if(e.t>.35){e.s='rec';e.t=0}return}
  if(s=='ws'){e.pz='s';if(e.t>.35){e.s='rec';e.t=0}return}
  if(s=='rec'){if(e.t>.7){e.s=null;e.cd=rnd(1.4,2.2)}return}
  e.f=sgn(dx)||e.f;if(ad>90){e.x=cl(e.x+e.f*chV(44,ad)*dt);e.mv=1}
  if(e.cd<=0&&Math.abs(P.y+P.h-(e.y+e.h))<90){if(ad<110){if(!tok(e)){e.cd=.3;return}e.s='cw';e.t=0}else if(ad<MRNGR+40){if(!tok(e,1)){e.cd=.4;return}e.s='ww';e.t=0}}}
// ---- 首领:焚天炎君 ----
function fkEnd(e,x_){e.act=null;e.mv=0;e.n=0;e.cd=(e.p2?.75:1.05)+Math.random()*.5+(x_||0)}
function fkStep(e,dt){const pc=P.x+12,cx=e.x+e.w/2,dx=pc-cx,ad=Math.abs(dx),lo=e.hp<e.max*.5,sp=lo?1.2:1;e.pz=null;
  if(!e.intro){e.intro=1;banner('焚天炎君 · 熔心火山的主人')}
  if(lo&&!e.p2){e.p2=1;flash('255,140,60',.3)}
  if(!e.act){e.mv=0;e.cd-=dt*sp;e.f=sgn(dx)||e.f;if(ad>140){e.mv=1;e.x=gpCl(e,e.x+e.f*76*sp*dt)}
    if(e.cd>0)return;const Q=ad<170?['brth','brth','wave','nova','tele']:['rain','wave','tele','rain','nova'];if(e.p2)Q.push('rain','tele');let a=pick(Q);if(a==e.la&&Math.random()<.7)a=pick(Q);
    if(a=='nova'&&(e.nc||0)>0)a=ad<170?'brth':'rain';
    e.act=a;e.la=a;e.at=0;e.hd=0;e.n=0;e.tk=0;return}
  e.at+=dt*sp;const T=e.at,a=e.act;e.nc=Math.max(0,(e.nc||0)-dt);
  if(a=='tele'){if(!e.n){e.pz='w';if(T>=.35){const nx=gpCl(e,pc-e.w/2-P.f*120);e.x=nx;e.f=sgn(pc-(nx+e.w/2))||e.f;VFX.spawn('warm-explosion',nx+e.w/2,e.y+e.h*.5,{s:1.4});syn('blink');e.n=1;e.at=0}return}
    }  // 现身后直接接烈焰吐息
  if(a=='brth'||a=='tele'){const T2=e.at;if(T2<.5){e.pz='w';e.f=sgn(pc-(e.x+e.w/2))||e.f;return}e.pz='s';const c2=e.x+e.w/2;
    e.tk-=dt;if(e.tk<=0){e.tk=.22;VFX.spawn('warm-explosion',c2+e.f*rnd(50,160),e.y+e.h*rnd(.35,.6),{s:rnd(.7,1.1)});if(ov(P,{x:e.f>0?c2+10:c2-180,y:e.y+e.h*.2,w:170,h:e.h*.6}))hurt(8*e.dm,{kb:e.f*160,inv:.35})}
    if(T2>1.5)fkEnd(e);return}
  if(a=='rain'){if(T<.8){e.pz='w';return}
    if(!e.hd){e.hd=1;e.pz='s';syn('boom');const n=e.p2?11:7;for(let i=0;i<n;i++)F16M.push({x:Math.max(cam+20,Math.min(cam+VW-20,pc+rnd(-200,200)*(i?1:0))),t:-i*.22-.6,dm:e.dm})}
    if(T>2.2)fkEnd(e);return}
  if(a=='wave'){if(T<.6){e.pz='w';return}if(!e.hd){e.hd=1;e.pz='s';shake=.3;syn('boom');VFX.spawn('earth-rupture',cx,GY,{s:1.4});for(const d of [-1,1])F16W.push({x:cx,d,tr:0,hit:0,dm:e.dm,sp:300})}
    if(T>1.4)fkEnd(e);return}
  if(a=='nova'){if(T<1.6){e.pz='w';if(Math.random()<dt*16)pt({x:cx+rnd(-60,60),y:e.y+rnd(0,e.h),vx:rnd(-30,30),vy:rnd(-80,-30),c:pick(['#ffa94d','#ff6b6b','#ffe066']),s:2,l:.4});return}
    if(!e.hd){e.hd=1;e.nc=lo?7:10;VFX.spawn('warm-explosion',cx,e.y+e.h*.5,{s:3.2});flash('255,150,60',.35);shake=.5;syn('boom');ring(cx,e.y+e.h*.5,10,260,'#ff922b',.5,6);if(Math.hypot(pc-cx,P.y+P.h/2-(e.y+e.h/2))<260)hurt(20*e.dm,{kb:sgn(pc-cx)*420})}
    if(T>2.1)fkEnd(e,.2);return}
  fkEnd(e)}
// 场上的东西:火球(直线飞,最多飞 MSHR,首领的不限)、陨火雨(先出预警圈再落下)、贴地火浪
function f16Step(dt){const pc=P.x+12,gr=P.y+P.h>=GY-4;
  for(const b of F16B){b.t+=dt;b.x+=b.vx*dt;b.tr+=Math.abs(b.vx)*dt;const r=9*b.s;if(ov(P,{x:b.x-r,y:b.y-r,w:2*r,h:2*r})){b.dd=1;hurt(b.d*b.dm,{kb:sgn(b.vx)*240})}if(b.tr>MSHR+60||b.x<cam-40||b.x>cam+VW+40)b.dd=1;if(b.dd)VFX.spawn('warm-explosion',b.x,b.y,{s:.7*b.s})}F16B=F16B.filter(b=>!b.dd);
  for(const m of F16M){m.t+=dt;if(m.t>=0&&!m.dd){m.dd=1;VFX.spawn('warm-explosion',m.x,GY-16,{s:1.5});syn('boom');shake=Math.max(shake,.15);if(Math.abs(pc-m.x)<40&&P.y+P.h>GY-70)hurt(14*m.dm,{kb:sgn(pc-m.x)*260})}}F16M=F16M.filter(m=>!m.dd||m.t<.3);
  for(const w of F16W){w.x+=w.d*w.sp*dt;w.tr+=w.sp*dt;w.ft=(w.ft||0)-dt;if(w.ft<=0){w.ft=.07;VFX.spawn('warm-explosion',w.x,GY-12,{s:.6})}
    if(!w.hit&&gr&&Math.abs(pc-w.x)<20&&hurt(12*w.dm,{kb:w.d*300}))w.hit=1}F16W=F16W.filter(w=>w.tr<440&&w.x>0&&w.x<WW)}
// 画面(PXL 层,怪物之后画):火球;陨火雨落点和焚天炎爆范围的地面法阵(DZ)
function f16Fx(){const M=FIRE;if(!M.I)return;const t=performance.now()/1000,e=B;
  for(const m of F16M)if(m.t<0&&m.t>-.7)DZ.zone(m.x-40-cam,80);
  if(e&&e.k=='fk'&&e.hp>0&&e.act=='nova'&&(e.at||0)<1.6)DZ.zone(e.x+e.w/2-260-cam,520);
  for(const b of F16B){const s=.9*b.s;M.fr(x,'fb_move',Math.floor(t*14),b.x-cam-17*s,b.y-19*s,s,b.vx<0?-1:1)}
  for(const m of F16M)if(m.t<0&&m.t>-.45){const k=(m.t+.45)/.45,s=1.4;x.save();x.translate(m.x-cam,(GY-16)*k-30*(1-k));x.rotate(Math.PI/2);M.fr(x,'fb_move',Math.floor(t*14),-17*s,-19*s,s,1);x.restore()}}
let C15B=[],C15W=[],C15S=[];  // 哥布林的炸弹 / 夜巫和夜王的贴地暗影波 / 夜王跃空斩的冲击波
function c15Clr(){C15B=[];C15W=[];C15S=[]}
// ---- 骷髅卫兵:举剑 → 一记重斩 ----
function skwStep(e,dt){const dm=e.dm,cx=e.x+e.w/2,pc=P.x+12,dx=pc-cx,ad=Math.abs(dx),lo=g8Lo(e),hi=g8Hi(e),cl=v=>Math.max(lo,Math.min(hi-e.w,v));
  e.cd=(e.cd==null?rnd(.6,1.4):e.cd)-dt;e.pz=null;e.mv=0;const s=e.s;if(s)e.t+=dt;
  if(s=='shd'){if(e.t>.5){e.s=null;e.cd=Math.min(e.cd,.3)}return}
  if(s=='sw'){e.pz='w';e.f=sgn(dx)||e.f;if(e.t>=.48){e.s='sl';e.t=0;e.hd=0}return}
  if(s=='sl'){e.pz='s';if(!e.hd&&e.t>.08&&ov(P,{x:e.f>0?cx:cx-60,y:e.y-6,w:60,h:e.h+6})&&hurt(11*dm,{kb:e.f*260}))e.hd=1;if(e.t>.3){e.s='rec';e.t=0}return}
  if(s=='rec'){if(e.t>.5){e.s=null;e.cd=rnd(.8,1.4)}return}
  e.f=sgn(dx)||e.f;if(ad>e.w/2+34){e.x=cl(e.x+e.f*chV(58,ad)*dt);e.mv=1}
  if(e.cd<=0&&ad<e.w/2+56&&Math.abs(P.y+P.h-(e.y+e.h))<70){if(!tok(e)){e.cd=.3;return}e.s='sw';e.t=0}}
// ---- 哥布林投弹手:保持距离扔炸弹(抛物线,落地爆炸);被贴身就捅一刀 ----
function gobStep(e,dt){const dm=e.dm,cx=e.x+e.w/2,pc=P.x+12,dx=pc-cx,ad=Math.abs(dx),lo=g8Lo(e),hi=g8Hi(e),cl=v=>Math.max(lo,Math.min(hi-e.w,v));
  e.cd=(e.cd==null?rnd(1,2):e.cd)-dt;e.pz=null;e.mv=0;const s=e.s;if(s)e.t+=dt;
  if(s=='aim'){e.pz='w';e.f=sgn(dx)||e.f;if(e.t>=.56){e.s='thr';e.t=0;const vx=Math.max(-300,Math.min(300,dx/.9));C15B.push({x:cx+e.f*10,y:e.y+e.h*.3,vx,vy:-330,dm,t:0});syn('proj')}return}
  if(s=='thr'){e.pz='s';if(e.t>.3){e.s='rec';e.t=0}return}
  if(s=='stw'){e.pz='w';if(e.t>=.4){e.s='stb';e.t=0;e.hd=0}return}
  if(s=='stb'){e.pz='s';if(!e.hd&&ov(P,{x:e.f>0?cx:cx-44,y:e.y,w:44,h:e.h})&&hurt(9*dm,{kb:e.f*200}))e.hd=1;if(e.t>.25){e.s='rec';e.t=0}return}
  if(s=='rec'){if(e.t>.6){e.s=null;e.cd=rnd(1.3,2.1)}return}
  e.f=sgn(dx)||e.f;if(ad>150){e.x=cl(e.x+e.f*chV(60,ad)*dt);e.mv=1}else if(ad<110&&ad>50){e.x=cl(e.x-e.f*46*dt);e.mv=1}
  if(e.cd<=0){if(ad<50){if(!tok(e)){e.cd=.3;return}e.s='stw';e.t=0}else if(ad<MRNGR+20){if(!tok(e,1)){e.cd=.4;return}e.s='aim';e.t=0}}}
// ---- 夜巫(精英):暗影挥斩(近,大范围)/ 暗影波(贴地,远,跳过去)----
function nwzStep(e,dt){const dm=e.dm,cx=e.x+e.w/2,pc=P.x+12,dx=pc-cx,ad=Math.abs(dx),lo=g8Lo(e),hi=g8Hi(e),cl=v=>Math.max(lo,Math.min(hi-e.w,v));
  e.cd=(e.cd==null?rnd(1,2):e.cd)-dt;e.pz=null;e.mv=0;const s=e.s;if(s)e.t+=dt;
  if(s=='cw'||s=='ww'){e.pz='w';e.f=sgn(dx)||e.f;if(e.t>=.6){e.s=s=='cw'?'cs':'ws';e.t=0;e.hd=0;
      if(s=='ww'){C15W.push({x:cx+e.f*30,d:e.f,tr:0,hit:0,dm,sp:260,k:'w'});syn('zap')}}return}
  if(s=='cs'){e.pz='s';if(!e.hd&&e.t>.06){e.hd=1;VFX.spawn('b-darkhit',cx+e.f*60,e.y+e.h*.5,{f:e.f,s:1.4});if(ov(P,{x:e.f>0?cx:cx-110,y:e.y-20,w:110,h:e.h+20}))hurt(14*dm,{kb:e.f*320})}if(e.t>.35){e.s='rec';e.t=0}return}
  if(s=='ws'){e.pz='s';if(e.t>.35){e.s='rec';e.t=0}return}
  if(s=='rec'){if(e.t>.7){e.s=null;e.cd=rnd(1.4,2.2)}return}
  e.f=sgn(dx)||e.f;if(ad>90){e.x=cl(e.x+e.f*chV(44,ad)*dt);e.mv=1}
  if(e.cd<=0&&Math.abs(P.y+P.h-(e.y+e.h))<90){if(ad<110){if(!tok(e)){e.cd=.3;return}e.s='cw';e.t=0}else if(ad<MRNGR+40){if(!tok(e,1)){e.cd=.4;return}e.s='ww';e.t=0}}}
// ---- 首领:夜王 ----
function nkEnd(e,x_){e.act=null;e.mv=0;e.cd=(e.p2?.75:1.05)+Math.random()*.5+(x_||0)}
// 王威震慑命中:眩晕 1 秒 + 打断正在放的技能(无敌、霸体都挡不住;GM 无敌除外)
function nkStun(){if(GM.god)return;P.stun=Math.max(P.stun||0,1);P.sk=null;P.ar=0;P.ch=0;P.vy=Math.max(P.vy,0);tx('被王威震慑了!',P.x-24,P.y-30,'#ffd43b');shake=Math.max(shake,.35)}
function nkStep(e,dt){const pc=P.x+12,cx=e.x+e.w/2,dx=pc-cx,ad=Math.abs(dx),lo=e.hp<e.max*.5,sp=lo?1.2:1;e.pz=null;
  if(!e.intro){e.intro=1;banner('夜王 · 永夜王城的主人')}
  if(lo&&!e.p2){e.p2=1;flash('200,160,255',.3)}
  if(e.daze>0){e.daze-=dt;e.mv=0;if(Math.random()<dt*6)pt({x:cx+rnd(-20,20),y:e.y-6,vx:rnd(-20,20),vy:rnd(-30,-10),c:'#ffe066',s:2,l:.4});return}
  if(!e.act){e.mv=0;e.y+=(e.gy-e.y)*Math.min(1,dt*10);e.cd-=dt*sp;e.f=sgn(dx)||e.f;if(ad>120){e.mv=1;e.x=gpCl(e,e.x+e.f*80*sp*dt)}
    if(e.cd>0)return;const Q=ad<140?['cmb','cmb','leap','roar']:['dash','leap','dash','roar'];if(e.p2)Q.push('roar','leap');let a=pick(Q);if(a==e.la&&Math.random()<.7)a=pick(Q);
    if(a=='roar'&&(e.rc||0)>0)a=ad<140?'cmb':'dash';
    e.act=a;e.la=a;e.at=0;e.hd=0;e.n=0;e.tx=pc;e.jx0=null;e.lt=null;e.hp0=e.hp;return}
  e.at+=dt*sp;const T=e.at,a=e.act;e.rc=Math.max(0,(e.rc||0)-dt);
  if(a=='cmb'){if(T<.45){e.pz='w';e.f=sgn(dx)||e.f;return}e.pz='s';e.x=gpCl(e,e.x+e.f*(T<1.1?110:0)*dt);
    for(const [i,t0] of [[0,.5],[1,.85]])if(e.n==i&&T>=t0){e.n++;VFX.spawn('m-claw',cx+e.f*60,e.y+e.h*.5,{f:e.f,s:2});syn('swing');if(ov(P,{x:e.f>0?cx:cx-100,y:e.y-10,w:100,h:e.h+10}))hurt(15*e.dm,{kb:e.f*300})}
    if(T>1.3)nkEnd(e);return}
  if(a=='dash'){if(T<.5){e.pz='w';e.f=sgn(dx)||e.f;return}
    if(T<1.1){e.pz='s';e.mv=1;const nx=gpCl(e,e.x+e.f*520*dt);if(Math.random()<dt*30)pt({x:cx-e.f*20,y:GY-4,vx:-e.f*rnd(40,120),vy:rnd(-60,-10),c:'#b197fc',s:2,l:.3});
      if(!e.hd&&ov(P,e)&&hurt(16*e.dm,{kb:e.f*420}))e.hd=1;if(nx==e.x)e.at=1.1;e.x=nx;return}
    if(T>1.5)nkEnd(e);return}
  if(a=='leap'){if(T<.5){e.pz='w';e.tx+=(pc-e.tx)*Math.min(1,dt*5);return}
    if(e.jx0==null)e.jx0=e.x;const k=Math.min(1,(T-.5)/.6),tx_=gpCl(e,e.tx-e.w/2);
    if(!e.hd){e.pz='s';e.x=e.jx0+(tx_-e.jx0)*k;e.y=e.gy-Math.sin(k*Math.PI)*170}
    if(k>=1&&!e.hd){e.hd=1;e.y=e.gy;e.lt=T;const c=e.x+e.w/2;VFX.spawn('earth-rupture',c,GY,{s:1.6});shake=.4;syn('boom');if(Math.abs(pc-c)<e.w/2+40&&P.y+P.h>GY-60)hurt(18*e.dm,{kb:sgn(pc-c)*360});for(const d of [-1,1])C15W.push({x:c,d,tr:0,hit:0,dm:e.dm,sp:300,k:'s'})}
    if(T>1.8)nkEnd(e);return}
  if(a=='roar'){if(T<1.4){e.pz='w';e.f=sgn(dx)||e.f;if(Math.random()<dt*14)pt({x:cx+rnd(-50,50),y:e.y+rnd(0,e.h),vx:(cx-(cx+rnd(-50,50)))*1.5,vy:rnd(-60,-20),c:pick(['#ffe066','#fff3bf','#ffd43b']),s:2,l:.4});
      if(e.hp0-e.hp>=e.max*.05){e.act=null;e.daze=1.5;e.cd=1;e.rc=6;banner('打断了夜王的蓄力!');VFX.spawn('r-burst',cx,e.y+e.h*.4,{s:1.4});return}return}
    if(!e.hd){e.hd=1;e.rc=lo?7:10;VFX.spawn('mass-release',cx,e.y+e.h*.5,{s:2.4});flash('255,230,150',.35);syn('boom');ring(cx,e.y+e.h*.5,10,300,'#ffe066',.5,6);if(Math.hypot(pc-cx,P.y+P.h/2-(e.y+e.h/2))<300)nkStun()}
    if(T>2)nkEnd(e,.2);return}
  nkEnd(e)}
// 场上的东西:炸弹(抛物线,落地 / 碰到主角爆炸)、贴地暗影波、冲击波
function c15Step(dt){const pc=P.x+12,gr=P.y+P.h>=GY-4;
  for(const b of C15B){b.t+=dt;b.x+=b.vx*dt;b.vy+=620*dt;b.y+=b.vy*dt;const hit=ov(P,{x:b.x-8,y:b.y-8,w:16,h:16});
    if(hit||b.y>=GY-6){b.d=1;VFX.spawn('warm-explosion',b.x,Math.min(b.y,GY-10),{s:1.1});syn('boom');if(Math.hypot(pc-b.x,P.y+P.h/2-Math.min(b.y,GY-10))<46)hurt(11*b.dm,{kb:sgn(pc-b.x)*260})}}C15B=C15B.filter(b=>!b.d);
  for(const w of C15W){w.x+=w.d*w.sp*dt;w.tr+=w.sp*dt;w.ft=(w.ft||0)-dt;if(w.ft<=0){w.ft=.07;VFX.spawn(w.k=='s'?'m-dust':'b-darkhit',w.x,GY-14,{f:w.d,s:w.k=='s'?1:.8})}
    if(!w.hit&&gr&&Math.abs(pc-w.x)<20&&hurt((w.k=='s'?13:11)*w.dm,{kb:w.d*300}))w.hit=1}C15W=C15W.filter(w=>w.tr<(w.k=='s'?420:360)&&w.x>0&&w.x<WW)}
// 画面(PXL 层,怪物之后画):炸弹;跃空斩落点预警(首领)
function c15Fx(){const M=CST;if(!M.I)return;const t=performance.now()/1000,e=B;
  if(e&&e.k=='nk'&&e.hp>0&&e.act=='leap'&&(e.at||0)<1.1)DZ.zone(e.tx-80-cam,160);if(e&&e.k=='nk'&&e.hp>0&&e.act=='roar'&&(e.at||0)<1.4)DZ.zone(e.x+e.w/2-300-cam,600);  // 王威震慑的范围
  for(const b of C15B)M.fr(x,'bomb_f',Math.floor(t*14)%4,b.x-cam-27.5*.7,b.y-43*.7+6,.7,b.vx<0?-1:1)}
// ---- 宠物仓鼠 ----
const hamNew=()=>({own:0,on:0,ht:0,b:{pow:0,shd:0,spd:0,cr:0},n:0});
let HAM=hamNew(),HMP={x:0,y:GY-16,vy:0,f:1,g:0,wv:0,cd:{},mv:0,ate:0},HPS=[],HCP=[],HSEL=-1;  // HMP:宠物仓鼠位置;HPS:丢出的瓜子壳;HCP:罩住怪物的大瓜子壳;HSEL:宠物界面选中的技能
const HKS={pow:['力气','技能伤害',1,3],shd:['壳硬','护盾量',1,3],spd:['灵巧','技能冷却缩短',.5,1.5],cr:['眼力','暴击率',.5,1.5]};  // [名称, 加什么, 每次最少, 最多](百分比)
const HSPM=()=>20+pl('spd'),hamOn=()=>HAM.own&&HAM.on&&!petOn(),hamB=k=>+Math.min(k=='spd'?HSPM():1e9,HAM.b[k]||0).toFixed(1);
const hamDmP=v=>Math.round(v*(1+hamB('pow')/100)),hamShP=()=>+(8*(1+hamB('shd')/100)).toFixed(1),hamCd=c=>+(c*(1-Math.min(HSPM(),hamB('spd'))/100)).toFixed(1);
const hamBT=()=>Object.keys(HKS).map(k=>HKS[k][0]+'('+HKS[k][1]+')+'+hamB(k)+'%').join(' · ');
const HSKD=[['嗑瓜子',()=>`关卡里(含神秘副本)遇到敌人时嗑一次瓜子,随机永久提升仓鼠自己的一项属性,一直叠加。<br>已嗑 ${HAM.n} 次:${hamBT()}`,15],  // 第十三轮:不再每关一次,正常走冷却
  ['瓜子壳护盾',()=>`给无名套上瓜子壳:护盾 = 最大生命的 ${hamShP()}%(6 秒),期间受到的伤害 -15%`,15],
  ['瓜子拍打',()=>`两片大瓜子壳把附近的一只敌人罩住:${hamDmP(120)}% 攻击力伤害并定身 1.5 秒(首领 0.6 秒)`,15],
  ['丢瓜子壳',()=>`朝最近的敌人丢瓜子壳:${hamDmP(60)}% 攻击力伤害`,15]];
// 第十五轮:灵巧(冷却缩短)最多 20%(HSPM(),第四十八轮起被动「羁绊」每级 +1%);到顶后嗑瓜子只在其他三项里随机,不在游戏里写出上限
function hamFeed(n,quiet){const L=[];for(let i=0;i<n;i++){const k=pick(Object.keys(HKS).filter(k=>k!='spd'||hamB('spd')<HSPM())),q=HKS[k];let v=Math.round(rnd(q[2],q[3])*10)/10;if(k=='spd')v=Math.min(v,+(HSPM()-hamB('spd')).toFixed(1));HAM.b[k]=+((HAM.b[k]||0)+v).toFixed(1);HAM.n++;L.push(q[0]+' +'+v+'%')}
  if(!quiet&&P)tx('仓鼠嗑了瓜子:'+L.join(' '),P.x-50,P.y-70,'#ffe066');save();return L}
function hamHatchT(){return HAM.ht?Math.max(0,HAM.ht-Date.now()):-1}
function hamHatchChk(){if(HAM.ht&&Date.now()>=HAM.ht){HAM.ht=0;if(!HAM.own){HAM.own=1;HAM.on=1;PET.on=0;fmsg='🐹 蛋壳裂开了!仓鼠出生了,已经设为出战宠物'}else{const L=hamFeed(3,1);fmsg='🐹 又孵出一只小仓鼠,它把瓜子全塞给了大仓鼠:'+L.join(' · ')}sfx('lvl');save();return 1}return 0}
function hamPetStep(dt,S,all){if(!hamOn())return;const p=HMP;p.g-=dt;p.wv-=dt;
  const lo=bossOn&&st=='play'?2570:0,hi=st=='play'?WW-22:twW()-22,tx_=P.x+12-P.f*34,dx=tx_-(p.x+11),ad=Math.abs(dx);
  if(ad>520){p.x=tx_-11;p.y=GY-16}
  const mv=ad>8;if(mv){p.f=sgn(dx);p.x+=sgn(dx)*Math.min(ad,(ad>140?330:160)*dt)}else p.f=P.f;p.x=Math.max(lo,Math.min(hi,p.x));p.mv=mv;
  p.vy+=1200*dt;p.y+=p.vy*dt;if(p.y>=GY-16){p.y=GY-16;p.vy=mv?-120:0}
  const hcr=hamB('cr');  // 第五十八轮:「眼力」加到暴击率里走 dealt 的暴击判定(暴击照样是紫色数字;原来单独 ×1.5 却显示白字)
  for(const q of HPS){q.t+=dt;q.a+=dt*16;const e=q.e,ex=e.x+e.w/2,ey=e.y+e.h/2,dd=Math.hypot(ex-q.x,ey-q.y)||1,m=Math.min(dd,420*dt);q.x+=(ex-q.x)/dd*m;q.y+=(ey-q.y)/dd*m;
    if(dd<10||e.hp<=0||q.t>1.5){q.d=1;if(e.hp>0&&all.includes(e)&&!e.ug){pDeal(e,Math.round(q.dmg*rnd(.9,1.1)),null,hcr);burst(q.x,q.y,5,['#3a3640','#e9e4dc'],120,{s:2,l:.3})}}}HPS=HPS.filter(q=>!q.d);
  for(const c of HCP){c.t+=dt;const e=c.e;if(e.hp>0){c.x=e.x+e.w/2;c.y=e.y+e.h}if(c.t>=.25&&!c.h){c.h=1;sfx('peck');if(e.hp>0&&all.includes(e)&&!e.ug){pDeal(e,Math.round(c.dmg*rnd(.9,1.1)),null,hcr);e.st=Math.max(e.st||0,isBig(e)?.6:1.5);tx('罩住了!',c.x-12,e.y-16,'#ffe066')}}}HCP=HCP.filter(c=>c.t<1.4);
  if(st!='play')return;
  for(const k in p.cd)p.cd[k]-=dt;if(p.g>0)return;
  const near=all.filter(e=>!e.ug&&e.hp>0&&Math.abs(e.x+e.w/2-(P.x+12))<360);if(!near.length)return;
  for(const i of [0,1,2,3]){if(p.cd[i]>0)continue;
    if(i==0){hamFeed(1);burst(p.x+11,p.y+6,6,['#e9e4dc','#3a3640'],90,{s:2,l:.3})}
    else if(i==1){if(P.hshT>0)continue;P.hsh=Math.round(S.hp*hamShP()/100);P.hshT=6;P.hdr=.15;ring(P.x+12,P.y+16,4,40,'#e9e4dc',.4,4);tx('瓜子壳护盾!',P.x-14,P.y-30,'#ffe066');sfx('buff')}
    else if(i==2){const e=nearE(near,p.x+11,p.y+8,300);if(!e)continue;HCP.push({e,x:e.x+e.w/2,y:e.y+e.h,t:0,dmg:S.atk*hamDmP(120)/100})}
    else{const e=nearE(near,p.x+11,p.y+8,400)||near[0];p.f=sgn(e.x+e.w/2-p.x-11);HPS.push({e,x:p.x+11,y:p.y+4,t:0,a:0,dmg:S.atk*hamDmP(60)/100});sfx('swing')}
    p.cd[i]=hamCd(HSKD[i][2]);p.g=1;p.wv=.45;break}}
// ---- 图集 / 绘制 ----
const MYST={I:null,D:'@@A:myst_atlas@@',M:{"hall":[0,0,768,300,1],"floor":[769,0,64,60,1],"lion":[834,0,96,104,1],"ham":[0,301,64,56,11],"gar":[705,301,64,72,1],"fire":[770,301,32,40,4],"braz":[899,301,40,52,1],"post":[940,301,16,66,1],"bshell":[957,301,48,64,1],"crown":[1006,301,16,11,1],"seed":[0,374,12,7,1],"shell":[13,374,12,7,1],"egg":[26,374,18,22,1],"chain":[45,374,6,8,1]},
  init(){const im=new Image();im.onload=()=>{this.I=im};im.src=this.D},
  // 第 i 帧画到 (X,Y) 左上角,放大 s,f=-1 水平翻转;m = [x, y, 帧宽, 帧高, 帧数]
  fr(c,k,i,X,Y,s,f){const m=this.M[k];if(!m||!this.I)return;s=s||1;c.save();c.imageSmoothingEnabled=false;c.translate(Math.round(X),Math.round(Y));if(f<0){c.translate(m[2]*s,0);c.scale(-1,1)}c.drawImage(this.I,m[0]+(i%m[4])*m[2],m[1],m[2],m[3],0,0,m[2]*s,m[3]*s);c.restore()},
  on(e){return !!this.I&&e.k=='ham'},
  hamF(o,t){if(o.st>0)return 9;const a=o.act;if(a=='eat'||a=='shell')return 4+Math.floor(t*6)%2;if(a=='throw')return (o.at||0)<.5?6:7;if(a=='trap')return 8;if(o.mv)return 2+Math.floor(t*8)%2;return Math.floor(t*2)%2},
  // 首领:c 已经平移到脚底中间、按朝向翻转(面朝右)
  draw(c,e,t){const H=e.h/(1.1*(e.bsz||1)),s=H/48,fi=this.hamF(e,t);
    c.save();if(FLW)c.filter='brightness(2.6)';
    if(e.bf_){c.save();c.globalCompositeOperation='lighter';E_(c,0,-H*.45,H*.75,H*.55,RGD(c,0,-H*.45,H*.75,[e.bf_.v>0?'rgba(255,90,90,.35)':'rgba(120,230,140,.3)','rgba(0,0,0,0)']),0);c.restore()}
    this.fr(c,'ham',fi,-32*s,-56*s,s);this.fr(c,'crown',0,1*s,(fi==9?-48:-50)*s,s);
    if(e.hsd>0){c.save();c.globalCompositeOperation='lighter';c.globalAlpha=.55+.15*Math.sin(t*8);c.strokeStyle='#fff3bf';c.lineWidth=2;c.beginPath();c.ellipse(0,-H*.5,H*.8,H*.62,0,0,7);c.stroke();c.globalAlpha=.12;c.fillStyle='#e9e4dc';c.fill();c.restore()}
    c.restore()},
  // 大瓜子壳:合拢程度 k(0 = 两片分开 70 像素,1 = 合上),a 透明度
  clam(cx,k,a){const m=this.M.bshell,o=Math.round(70*(1-k));x.save();x.globalAlpha=a;this.fr(x,'bshell',0,cx-cam+o,GY-64,1);this.fr(x,'bshell',0,cx-cam-48-o,GY-64,1,-1);x.restore()},
  // 背景:石墙(ox = 背景图左边的世界坐标)+ 地砖 + 石像鬼
  hall(ox){if(!this.I){x.fillStyle='#1a1922';x.fillRect(0,0,VW,VH);return}const m=this.M.hall;x.fillStyle='#121118';x.fillRect(0,0,VW,VH);x.save();x.imageSmoothingEnabled=false;
    const sx=Math.max(0,Math.floor(cam-ox)),sw=Math.min(VW,m[2]-sx);if(sw>0)x.drawImage(this.I,m[0]+sx,m[1],sw,m[3],Math.round(ox+sx-cam),GY-m[3],sw,m[3]);
    const f=this.M.floor;for(let gx=Math.floor(cam/64)*64;gx<cam+VW;gx+=64)x.drawImage(this.I,f[0],f[1],64,60,Math.round(gx-cam),GY,64,60);
    x.restore();for(const gx of [150,618])this.fr(x,'gar',0,ox+gx-32-cam,32,1)},
  hall2(ox){const m=this.M.hall,w=MYW-ox;if(!this.I)return;x.save();x.imageSmoothingEnabled=false;x.drawImage(this.I,m[0],m[1],w,m[3],Math.round(ox-cam),GY-m[3],w,m[3]);x.restore()},  // 大厅右段:背景图开头再接一段(接缝落在柱子上)
  // 火盆:铁盆 + 4 帧火焰 + 暖光
  braz(wx,t){const X=wx-cam;x.save();x.globalCompositeOperation='lighter';C_(x,X,GY-80,60+Math.sin(t*7+wx)*4,RGD(x,X,GY-80,64,['rgba(255,140,40,.35)','rgba(255,90,20,.1)','rgba(0,0,0,0)']),0);E_(x,X,GY+3,36,5,'rgba(255,140,40,.25)',0);x.restore();
    this.fr(x,'braz',0,X-20,GY-52,1);this.fr(x,'fire',Math.floor(t*10+wx)%4,X-26,GY-114,1.6)},
  // 石狮头入口:两边石灯柱(小火苗)+ 铁链 + 石狮 + 嘴里的光球 + W
  lion(wx,i,t){const X=wx-cam,[rgb,lt]=MYOC[i],k=.5+.5*Math.sin(t*3+i),S=1.5;
    for(const d of [-1,1]){const px=X+d*86;this.fr(x,'post',0,px-12,GY-99,S);
      x.save();x.globalCompositeOperation='lighter';C_(x,px,GY-108,13+k*3,RGD(x,px,GY-108,16,['rgba('+rgb+',.75)','rgba(0,0,0,0)']),0);x.restore();
      for(let j=0;j<4;j++){const h=4+((Math.floor(t*12)+j*3)%5);x.fillStyle=j<2?lt:'rgb('+rgb+')';x.fillRect(Math.round(px-3+j%2*3),Math.round(GY-99-h-(j>>1)*3),3,h)}
      for(let j=0;j<=8;j++){const u=j/8,cx=px+(X+d*52-px)*u,cy=GY-88+(GY-46-(GY-88))*u+Math.sin(u*Math.PI)*12;this.fr(x,'chain',0,cx-3,cy-4,1)}}
    this.fr(x,'lion',0,X-72,GY-156,S);
    const oy=GY-40;x.save();x.globalCompositeOperation='lighter';C_(x,X,oy,26+k*4,RGD(x,X,oy,30,['rgba('+rgb+',.95)','rgba('+rgb+',.35)','rgba(0,0,0,0)']),0);x.restore();
    C_(x,X,oy,13+k*1.5,'rgb('+rgb+')',0);C_(x,X-3,oy-3,7,lt,0);
    for(let j=0;j<6;j++){const q=(t*.7+j/6)%1,a=j*1.05+t;x.fillStyle=lt;x.fillRect(Math.round(X+Math.cos(a)*22*(1-q)),Math.round(oy+Math.sin(a)*20*(1-q)),1,1)}
    CT('W',X,oy+7,20,'#fff3bf','center',3,'#3b2a00');PLQ(x,X,GY-174,'神秘副本 '+(i+1),MYNM[i])},
  // 光柱(城里的神秘光柱 / 大厅的回城光柱)
  pillar(wx,gy,t,rgb,nm,sub){const X=wx-cam,w=14+Math.sin(t*4)*3;x.save();x.globalCompositeOperation='lighter';const g=x.createLinearGradient(X-w,0,X+w,0);g.addColorStop(0,'rgba('+rgb+',0)');g.addColorStop(.5,'rgba('+rgb+',.8)');g.addColorStop(1,'rgba('+rgb+',0)');x.fillStyle=g;x.fillRect(X-w,gy-150,2*w,150);
    x.fillStyle='rgba(255,255,255,.55)';x.fillRect(Math.round(X-1),gy-150,3,150);for(let i=0;i<10;i++){const k=(t*.6+i/10)%1;x.fillStyle='rgba(255,255,255,'+(1-k)+')';x.fillRect(Math.round(X+Math.sin(i*2.3+t*3)*10),Math.round(gy-k*150),1,2)}
    E_(x,X,gy-1,24,5,'rgba('+rgb+',.55)',0);x.restore();PLQ(x,X,gy-164,nm,sub)},
  // 大厅(在 drawTown 里代替晨曦镇的背景 / NPC)
  hub(t){this.hall(0);if(cam+VW>768)this.hall2(768);this.braz(110,t);this.braz(MYW-50,t);this.pillar(44,GY,t,'120,220,255','回城光柱','晨曦镇');
    for(let i=0;i<myOpen();i++)this.lion(MYLX[i],i,t);
    for(let i=0;i<24;i++){const q=(t*.04+i*.37)%1,px=(i*97.3)%MYW-cam,py=GY-20-q*240;x.fillStyle='rgba(255,230,190,'+(.35*Math.sin(q*Math.PI))+')';x.fillRect(Math.round(px+Math.sin(t+i)*6),Math.round(py),1,1)}
    const g=x.createRadialGradient(320,180,140,320,180,420);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.55)');x.fillStyle=g;x.fillRect(0,0,VW,VH)},
  // 首领场地(神秘副本):同一个大厅,背景图中心对准场地中心
  arena(t){const ox=(ARL+ARR)/2-384;this.hall(ox);this.braz(ARL+40,t);this.braz(ARR-20,t)}};
MYST.init();
// 神秘副本的招式画面(PXL 层,怪物之后画)
function myFx(){const t=performance.now()/1000,e=B;if(cur==MY5){pfgFx();return}if(cur==MY4){mirFx();canFx()}if(cur>=12){gpFx();return}
  if(e&&e.hp>0&&e.act=='trap'&&e.at<.85){const k=Math.min(1,e.at/.85);DZ.zone(e.tx-36-cam,72);x.save();x.globalAlpha=.35+.4*k;MYST.clam(e.tx,0,.5);x.restore()}
  for(const c of HCL){if(c.t<0){DZ.zone(c.x-36-cam,72);continue}const k=Math.min(1,c.t/.25);MYST.clam(c.x,k,c.t>1.3?Math.max(0,(1.6-c.t)/.3):1)}
  for(const s of HSH){x.save();x.translate(Math.round(s.x-cam),Math.round(s.y));x.rotate(s.a);MYST.fr(x,'shell',0,-12,-7,2);x.restore()}}
// 宠物仓鼠(PXL 层)+ 主角身上的瓜子壳护盾
function drawHamPet(){if(!hamOn()||!MYST.I)return;const p=HMP,t=performance.now()/1000;
  PXL.run(()=>{const hop=p.mv?-Math.round(Math.abs(Math.sin(t*12))*2):0,fi=p.wv>0?7:p.mv?2+Math.floor(t*10)%2:Math.floor(t*2)%2;x.save();x.translate(Math.round(p.x+11-cam),Math.round(p.y+16));SHD(x,0,0,10);x.scale(p.f,1);MYST.fr(x,'ham',fi,-16,-28+hop,.5);x.restore();
    for(const q of HPS){x.save();x.translate(Math.round(q.x-cam),Math.round(q.y));x.rotate(q.a);MYST.fr(x,'shell',0,-6,-3,1);x.restore()}
    for(const c of HCP){const k=Math.min(1,c.t/.25),a=c.t>1.1?Math.max(0,(1.4-c.t)/.3):1,o=Math.round(26*(1-k));x.save();x.globalAlpha=a;x.translate(Math.round(c.x-cam),Math.round(c.y));MYST.fr(x,'bshell',0,o,-32,.5);MYST.fr(x,'bshell',0,-24-o,-32,.5,-1);x.restore()}},true,PXL.bb([[p.x+11-cam,p.y+16],...HPS.map(q=>[q.x-cam,q.y]),...HCP.map(c=>[c.x-cam,c.y])],56))}
function drawHamShd(){if(!(P.hshT>0&&P.hsh>0))return;const t=performance.now()/1000,px=P.x+12-cam,py=P.y+16;x.save();x.globalCompositeOperation='lighter';x.globalAlpha=.45+.15*Math.sin(t*6);x.strokeStyle='#ffe8a3';x.lineWidth=1.6;x.beginPath();x.ellipse(px,py,20,26,0,0,7);x.stroke();x.restore()}
let HEGG='';function heggEm(){if(!HEGG&&MYST.I){const c=document.createElement('canvas');c.width=36;c.height=44;const g=c.getContext('2d');MYST.fr(g,'egg',0,0,0,2);HEGG=c.toDataURL()}  // 仓鼠宠物蛋图标(背包 / 宠物界面)
  return HEGG?`<img src="${HEGG}" alt="" style="width:1.1em;height:1.35em;image-rendering:pixelated;vertical-align:-.25em">`:'🥚'}
let HIMG=null;function hamImg(){if(HIMG||!MYST.I)return HIMG||'';const c=document.createElement('canvas');c.width=128;c.height=112;const g=c.getContext('2d');MYST.fr(g,'ham',0,0,0,2);return HIMG=c.toDataURL()}
// 宠物界面里仓鼠的部分
function rHam(){const eg=MAT.hegg||0,ht=hamHatchT();
  let h=`<h4>🐹 宠物仓鼠</h4>`;
  if(ht>=0){const m=Math.floor(ht/60000),s=Math.floor(ht/1000)%60;h+=`<p>🥚 正在孵化……还要 <b>${m} 分 ${String(s).padStart(2,'0')} 秒</b>(关掉游戏也会继续计时)</p>`}
  if(!HAM.own){h+=`<p class="tag">神秘地带的「瓜子大王」被击败时有 5% 几率掉一颗仓鼠宠物蛋,花 10 分钟孵化成宠物仓鼠。</p>`}
  else{h+=(hamImg()?`<img class="pv" src="${hamImg()}" alt="">`:'')+`<b>仓鼠 · 已嗑瓜子 ${HAM.n} 次</b> <button data-p="hon">${HAM.on?'✅ 出战中':'⬜ 休息中'}</button><br><span class="tag">仓鼠和钢盔小鸡同时只能出战一只。点技能查看详细数值。</span>`;
    h+=`<div class="psk">`+HSKD.map((q,i)=>`<div data-p="hsk${i}" style="cursor:pointer${HSEL==i?';box-shadow:0 0 0 2px #ffd43b':''}">${mniEm(i)}<b>${q[0]}</b> <span class="tag">${q[2]?'冷却 '+hamCd(q[2])+' 秒':'每关一次'}</span>${HSEL==i?'<br><span class="tag">'+q[1]()+'</span>':''}</div>`).join('')+'</div>'}
  h+=`<p>${heggEm()} 仓鼠宠物蛋 × <b>${eg}</b> <button data-p="hhat" ${eg>0&&ht<0?'':'disabled'}>🥚 孵化(10 分钟)</button>${HAM.own?' <span class="tag">已经有仓鼠了:多孵出来的小仓鼠会把瓜子全塞给它(嗑瓜子 3 次)</span>':''}</p>`;
  return h}
