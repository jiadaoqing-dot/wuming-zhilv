// ===== 第四十七轮:第十四关「月影忍城」(第二张地图「暗黑大陆」上方月亮下的蓝瓦城郭(用户附图),cur = 18)日本忍者风格 =====
// 图集 NJA(art_src/ninja14/build_ninja14.py):首领 影主·胧 nb = Martial Hero · 小怪 影忍 nja / 飞镖忍 nsh = Martial Hero 2(飞镖忍换色)· 精英 浪人 ron = Martial Hero 3(三个都是 LuizMelo,CC0)
//   飞镖(Loel,CC0)· 苦无(kungfu4000,CC0)· 替身木头(Gothul,OGA-BY 4.0)· 远景 = 用户附图;地面 / 浮台借第十二关 CST 的石地面(压暗偏蓝)
// 数值约 = 第十三关 ×1.15(LM 29 · MHK 90 · BHN 16300 · BDF 50);掉落和前几关一样(机械系列、合成添加剂、怪物技能石)
// 小怪:影忍 —— 远处隐身(几乎看不见)摸过来,现身后拿匕首突进;飞镖忍 —— 保持距离扔飞镖,或往主角脚下撒铁蒺藜(地面陷阱,踩到受伤 + 减速);浪人(精英)—— 两连斩 / 居合突进
// 首领招式:苦无连射 kun(扇形 5 把,二阶段 7 把 ×2 轮)· 疾风突进 dash(冲过场地)· 瞬身 tp(冒烟消失 → 出现在主角身后补一刀)·
//   居合·一闪 iai(蓄力 1 秒,面前一刀超高单体伤害,看到地面红框就跳开)· 影爆 aoe(跃起后落地,260 像素内大范围伤害 + 两道贴地冲击波)·
//   分身术 cln(两侧出现 2 个分身依次突进,二阶段 3 个)· 替身术(被动:每 12 秒 / 二阶段 8 秒一次,挨打时留下一根木头,本体出现在主角身后反击,这一下不掉血)
const E18=[['nja',360],['nsh',500],['nja',640],['ron',840],['nsh',1000],['nja',1140],['nsh',1280],['ron',1480],['nja',1640],['nsh',1800],['nja',1940],['ron',2120],['nsh',2240],['nja',2380],['ron',2520]];
const NJA={I:null,D:'@@A:nja_atlas@@',M:{"nb_idle":[0,0,1600,73,200,8],"nb_run":[0,74,1600,73,200,8],"nb_a1":[0,148,1200,73,200,6],"nb_a2":[0,222,1200,73,200,6],"nb_jump":[0,296,400,73,200,2],"nb_fall":[0,370,400,73,200,2],"nb_hit":[0,444,800,73,200,4],"nb_death":[0,518,1200,73,200,6],"nj_idle":[0,592,800,89,200,4],"nj_run":[0,682,1600,89,200,8],"nj_a1":[0,772,800,89,200,4],"nj_a2":[0,862,800,89,200,4],"nj_jump":[0,952,400,89,200,2],"nj_fall":[0,1042,400,89,200,2],"nj_hit":[0,1132,600,89,200,3],"nj_death":[0,1222,1400,89,200,7],"rn_idle":[0,1312,1260,98,126,10],"rn_run":[0,1411,1008,98,126,8],"rn_a1":[0,1510,882,98,126,7],"rn_a2":[0,1609,756,98,126,6],"rn_a3":[0,1708,1134,98,126,9],"rn_jump":[0,1807,378,98,126,3],"rn_fall":[0,1906,378,98,126,3],"rn_hit":[0,2005,378,98,126,3],"rn_death":[0,2104,1386,98,126,11],"bg":[0,2203,310,200],"shu":[312,2203,21,21],"kun":[335,2203,12,6],"log":[349,2203,32,32]},
  // 帧里身体的位置:[身体中心 x, 身体高, 脚底 y](build_ninja14.py 按待机第 0 帧算)
  A:{nb:[94.5,52,71],nj:[97.5,56,86],rn:[68.0,39,82]},
  P:{nja:'nj',nsh:'nj',ron:'rn',nb:'nb'},
  init(){const im=new Image();im.onload=()=>{this.I=im};im.src=this.D},
  on(e){return !!this.I&&!!this.P[e.k]},
  fr(c,k,i,X,Y,s,f){const m=this.M[k];if(!m||!this.I)return;const fw=m[4]||m[2],n=m[5]||1;i=((Math.floor(i)%n)+n)%n;s=s||1;c.save();c.imageSmoothingEnabled=false;c.translate(Math.round(X),Math.round(Y));if(f<0){c.translate(fw*s,0);c.scale(-1,1)}c.drawImage(this.I,m[0]+i*fw,m[1],fw,m[3],0,0,fw*s,m[3]*s);c.restore()},
  // 首领 / 分身的帧:返回 [行, 帧]
  nbRow(e,t){const a=e.act,T=e.at||0;
    if(a=='kun')return ['nb_a2',T<.45?T/.15:3+Math.min(2,(T-.45)/.08)];
    if(a=='dash')return T<.4?['nb_a1',0]:e.n?['nb_a1',3+Math.min(2,(T-e.lt)/.06)]:['nb_run',t*18];
    if(a=='tp')return e.n?['nb_a1',Math.min(5,(T)/.07)]:['nb_jump',0];
    if(a=='iai')return T<1?['nb_a1',Math.min(1,T/.3)]:['nb_a1',2+Math.min(3,(T-1)/.05)];
    if(a=='aoe')return T<.5?['nb_jump',0]:T<1.3?['nb_fall',t*6]:['nb_a2',3+Math.min(2,(T-1.3)/.08)];
    if(a=='cln')return ['nb_a2',Math.min(2,T/.2)];
    if(e.st>0)return ['nb_hit',t*10];if(e.mv)return ['nb_run',t*12];return ['nb_idle',t*8]},
  // 怪物:c 已经平移到脚底中间、按朝向翻转(面朝右);素材本来就朝右
  draw(c,e,t){const k=e.k,p=this.P[k],A=this.A[p],H=e.h/(e.max?1.1*(e.bsz||1):(e.vs||1)),s=H/A[1];let row=p+'_idle',fi=t*8+(e.ph||0)*3;c.save();if(FLW)c.filter='brightness(2.6)';
    if(k=='nb'){[row,fi]=this.nbRow(e,t);if(e.act=='tp'&&!e.n&&!FLW)c.globalAlpha=Math.max(.05,1-(e.at||0)/.3);if(e.act=='iai'&&(e.at||0)<1&&!FLW)c.filter='brightness('+(1+(e.at||0)*.7)+')'}
    else{const st=e.s;if(k=='nsh'&&!FLW)c.filter='hue-rotate(150deg) saturate(.85) brightness(.95)';
      if(k=='nja'){if(st=='aim'){row='nj_a1';fi=Math.min(1,e.t/.15)}else if(st=='ds'){row='nj_a1';fi=2+Math.min(1,e.t/.1)}else if(st=='hid'&&e.mv){row='nj_run';fi=t*14}
        if(!FLW&&e.al!=null)c.globalAlpha=e.al}
      else if(k=='nsh'){if(st=='aim'||st=='tw'){row='nj_a2';fi=Math.min(1,e.t/.2)}else if(st=='sh'||st=='tp'){row='nj_a2';fi=2+Math.min(1,e.t/.1)}}
      else if(k=='ron'){if(st=='w1'){row='rn_a1';fi=Math.min(2,e.t/.15)}else if(st=='s1'){row='rn_a1';fi=3+Math.min(3,e.t/.06)}else if(st=='s2'){row='rn_a2';fi=Math.min(5,e.t/.06)}else if(st=='wi'){row='rn_a3';fi=Math.min(3,e.t/.18)}else if(st=='si'){row='rn_a3';fi=4+Math.min(4,e.t/.05)}}
      if(row==p+'_idle'){if(e.st>0){row=p+'_hit';fi=0}else if(e.mv){row=p+'_run';fi=t*10}}}
    this.fr(c,row,fi,-A[0]*s,-A[2]*s,s,1);c.restore()},
  // 场景:夜空(用户附图顶上的颜色)+ 蓝瓦城郭远景(视差,左右交替镜像接缝)+ 石地面(CST,压暗偏蓝)
  bg(){const g=x.createLinearGradient(0,0,0,GY);g.addColorStop(0,'#0e1630');g.addColorStop(1,'#1f2f55');x.fillStyle=g;x.fillRect(0,0,VW,VH);const I=this.I;if(!I)return;x.imageSmoothingEnabled=false;
    {const m=this.M.bg,sc=1.15,w=m[2]*sc,h=m[3]*sc,o=((cam*.25)%(2*w)+2*w)%(2*w);for(let px=-o,i=0;px<VW;px+=w,i++){x.save();x.translate(Math.floor(px),Math.round(GY+18-h));if(i%2){x.translate(Math.ceil(w),0);x.scale(-1,1)}x.drawImage(I,m[0],m[1],m[2],m[3],0,0,Math.ceil(w),h);x.restore()}const ty=Math.round(GY+18-h),fg=x.createLinearGradient(0,ty,0,ty+60);fg.addColorStop(0,'#0e1630');fg.addColorStop(1,'rgba(14,22,48,0)');x.fillStyle=fg;x.fillRect(0,ty-1,VW,61)}
    x.fillStyle='rgba(10,16,40,.28)';x.fillRect(0,0,VW,GY);
    if(CST.I){const m=CST.M.gnd;x.save();x.filter='brightness(.72) saturate(.55) hue-rotate(95deg)';for(let px=Math.floor((cam-4)/m[2])*m[2];px<cam+VW+4;px+=m[2])x.drawImage(CST.I,m[0],m[1],m[2],m[3],Math.round(px-cam),GY-6,m[2],m[3]);x.restore()}},
  over(){x.fillStyle='rgba(40,60,140,.06)';x.fillRect(0,0,VW,VH)}};
NJA.init();
let N18S=[],N18T=[],N18C=[],N18L=[],N18W=[];  // 飞镖 / 苦无 · 铁蒺藜 · 首领分身 · 替身木头 · 影爆冲击波
function n18Clr(){N18S=[];N18T=[];N18C=[];N18L=[];N18W=[]}
const n18Shot=(x0,y0,vx,vy,dm,k,d)=>{N18S.push({x:x0,y:y0,vx,vy,dm,k,d:d||9,t:0,tr:0});syn('proj')};
// ---- 影忍:远处隐身摸过来 → 现身 → 匕首突进 ----
function njaStep(e,dt){const dm=e.dm,cx=e.x+e.w/2,pc=P.x+12,dx=pc-cx,ad=Math.abs(dx),lo=g8Lo(e),hi=g8Hi(e),cl=v=>Math.max(lo,Math.min(hi-e.w,v));
  e.cd=(e.cd==null?rnd(.8,1.6):e.cd)-dt;e.pz=null;e.mv=0;const s=e.s;if(s)e.t+=dt;e.al=Math.min(1,(e.al==null?1:e.al)+dt*3);
  if(s=='hid'){e.al=Math.max(.1,e.al-dt*6);if(e.st>0){e.s=null;e.al=1;VFX.spawn('smoke-puff',cx,e.y+e.h/2,{s:.8});return}e.f=sgn(dx)||e.f;e.x=cl(e.x+e.f*120*dt);e.mv=1;
    if(ad<95||e.t>4){e.s='aim';e.t=0;e.al=.25;VFX.spawn('smoke-puff',cx,e.y+e.h/2,{s:.9});syn('blink')}return}
  if(s=='aim'){e.pz='w';e.f=sgn(dx)||e.f;if(e.t>=.35){e.s='ds';e.t=0;e.hd=0}return}
  if(s=='ds'){e.pz='s';e.x=cl(e.x+e.f*400*dt);if(!e.hd&&ov(P,{x:e.f>0?cx:cx-40,y:e.y+6,w:40,h:e.h-6})&&hurt(12*dm,{kb:e.f*260}))e.hd=1;if(e.t>.3){e.s='rec';e.t=0}return}
  if(s=='rec'){if(e.t>.7){e.s=null;e.cd=rnd(1.2,2)}return}
  e.f=sgn(dx)||e.f;if(ad>60){e.x=cl(e.x+e.f*chV(58,ad)*dt);e.mv=1}
  if(e.cd<=0&&Math.abs(P.y+P.h-(e.y+e.h))<70){if(ad>150){e.s='hid';e.t=0;VFX.spawn('smoke-puff',cx,e.y+e.h/2,{s:.9});e.cd=1}else if(ad<130){if(!tok(e)){e.cd=.3;return}e.s='aim';e.t=0}}}
// ---- 飞镖忍:保持距离扔飞镖(一~三枚)/ 往主角脚下撒铁蒺藜 ----
function nshStep(e,dt){const dm=e.dm,cx=e.x+e.w/2,pc=P.x+12,dx=pc-cx,ad=Math.abs(dx),lo=g8Lo(e),hi=g8Hi(e),cl=v=>Math.max(lo,Math.min(hi-e.w,v));
  e.cd=(e.cd==null?rnd(1,2):e.cd)-dt;e.pz=null;e.mv=0;const s=e.s;if(s)e.t+=dt;
  if(s=='aim'||s=='tw'){e.pz='w';e.f=sgn(dx)||e.f;if(e.t>=.45){e.t=0;e.s=s=='aim'?'sh':'tp';const y0=e.y+e.h*.4;
      if(s=='aim'){const n=Math.random()<.4?3:1;for(let i=0;i<n;i++)n18Shot(cx+e.f*16,y0,e.f*300,(i-(n-1)/2)*70,dm,'shu',9)}
      else{N18T.push({x:Math.max(lo+10,Math.min(hi-10,pc)),t:0,arm:.5,life:9,dm});syn('proj')}}return}
  if(s=='sh'||s=='tp'){e.pz='s';if(e.t>.3){e.s='rec';e.t=0}return}
  if(s=='rec'){if(e.t>.6){e.s=null;e.cd=rnd(1.3,2.2)}return}
  e.f=sgn(dx)||e.f;if(ad>150){e.x=cl(e.x+e.f*chV(52,ad)*dt);e.mv=1}else if(ad<100){e.x=cl(e.x-e.f*48*dt);e.mv=1}  // 第四十九轮修:170~260 之间原来不走也不打
  if(e.cd<=0&&ad<MRNGR+40){if(!tok(e,1)){e.cd=.4;return}e.s=N18T.length<6&&Math.random()<.4?'tw':'aim';e.t=0}}
// ---- 浪人(精英):两连斩 / 居合突进 ----
function ronStep(e,dt){const dm=e.dm,cx=e.x+e.w/2,pc=P.x+12,dx=pc-cx,ad=Math.abs(dx),lo=g8Lo(e),hi=g8Hi(e),cl=v=>Math.max(lo,Math.min(hi-e.w,v));
  e.cd=(e.cd==null?rnd(.8,1.5):e.cd)-dt;e.pz=null;e.mv=0;const s=e.s;if(s)e.t+=dt;
  const sl=(w,d,kb)=>{if(!e.hd&&ov(P,{x:e.f>0?cx:cx-w,y:e.y-8,w,h:e.h+8})&&hurt(d*dm,{kb:e.f*kb}))e.hd=1};
  if(s=='w1'){e.pz='w';e.f=sgn(dx)||e.f;if(e.t>=.45){e.s='s1';e.t=0;e.hd=0}return}
  if(s=='s1'){e.pz='s';e.x=cl(e.x+e.f*60*dt);sl(70,11,160);if(e.t>.22){e.s='s2';e.t=0;e.hd=0}return}
  if(s=='s2'){e.pz='s';e.x=cl(e.x+e.f*60*dt);sl(76,13,300);if(e.t>.35){e.s='rec';e.t=0}return}
  if(s=='wi'){e.pz='w';e.f=sgn(dx)||e.f;if(e.t>=.7){e.s='si';e.t=0;e.hd=0;syn('blink')}return}
  if(s=='si'){e.pz='s';if(e.t<.2)e.x=cl(e.x+e.f*520*dt);sl(90,16,360);if(e.t>.45){e.s='rec';e.t=0}return}
  if(s=='rec'){if(e.t>.75){e.s=null;e.cd=rnd(1.1,1.8)}return}
  e.f=sgn(dx)||e.f;if(ad>e.w/2+40){e.x=cl(e.x+e.f*chV(56,ad)*dt);e.mv=1}
  if(e.cd<=0&&Math.abs(P.y+P.h-(e.y+e.h))<80){if(ad<e.w/2+60){if(!tok(e)){e.cd=.3;return}e.s='w1';e.t=0}else if(ad<220&&Math.random()<.5){if(!tok(e)){e.cd=.3;return}e.s='wi';e.t=0}else e.cd=.4}}
// ---- 首领:影主·胧 ----
function oboEnd(e,x_){e.act=null;e.mv=0;e.n=0;e.cd=(e.p2?.7:1)+Math.random()*.45+(x_||0)}
function oboBehind(e){const pc=P.x+12;return gpCl(e,pc-e.w/2-P.f*90)}
function oboStep(e,dt){const pc=P.x+12,cx=e.x+e.w/2,dx=pc-cx,ad=Math.abs(dx),lo=e.hp<e.max*.5,sp=lo?1.2:1;e.pz=null;
  if(!e.intro){e.intro=1;e.subC=6;banner('影主·胧 · 月影忍城之主')}
  if(lo&&!e.p2){e.p2=1;flash('120,140,255',.3);tx('影分身之术……',cx-30,e.y-20,'#b197fc')}
  // 替身术:挨打时这一下不掉血,原地留下木头,本体出现在主角身后反击
  e.subC=(e.subC||0)-dt;if(e.lhp!=null&&e.hp<e.lhp&&e.hp>0&&e.subC<=0&&e.act!='iai'){e.hp=e.lhp;e.subC=e.p2?8:12;N18L.push({x:cx,y:e.y+e.h*.55,t:0,f:e.f});VFX.spawn('smoke-puff',cx,e.y+e.h/2,{s:1.6});syn('blink');tx('替身术!',cx-20,e.y-24,'#ffe066');if(e.gy)e.y=e.gy;
    e.x=oboBehind(e);e.f=sgn(pc-(e.x+e.w/2))||e.f;VFX.spawn('smoke-puff',e.x+e.w/2,e.y+e.h/2,{s:1.4});e.act='tp';e.n=1;e.at=0;e.hd=0}
  e.lhp=e.hp;if(e.act!='aoe'&&e.gy&&e.y<e.gy)e.y=Math.min(e.gy,e.y+360*dt);  // 招式被打断时从半空落回地面
  if(!e.act){e.mv=0;e.cd-=dt*sp;e.f=sgn(dx)||e.f;if(ad>150){e.mv=1;e.x=gpCl(e,e.x+e.f*90*sp*dt)}
    if(e.cd>0)return;const Q=ad<160?['iai','tp','aoe','kun','cln']:['kun','dash','tp','cln','kun','dash'];if(e.p2)Q.push('cln','aoe','iai');let a=pick(Q);if(a==e.la&&Math.random()<.7)a=pick(Q);
    e.act=a;e.la=a;e.at=0;e.hd=0;e.n=0;e.tk=0;e.lt=0;if(a=='aoe')e.ax=cx;return}
  e.at+=dt*sp;const T=e.at,a=e.act,dm=e.dm;
  if(a=='kun'){e.pz=T<.45?'w':'s';if(T<.45)e.f=sgn(dx)||e.f;const vol=e.p2?2:1;
    for(let v=0;v<vol;v++)if(T>=.45+v*.45&&e.n<=v){e.n=v+1;const n=e.p2?7:5,y0=e.y+e.h*.45,ang=Math.atan2(P.y+P.h/2-y0,dx);for(let i=0;i<n;i++){const q=ang+(i-(n-1)/2)*.13;n18Shot(cx+e.f*20,y0,Math.cos(q)*360,Math.sin(q)*360,dm,'kun',10)}}
    if(T>.8+vol*.45)oboEnd(e);return}
  if(a=='dash'){if(T<.4){e.pz='w';e.f=sgn(dx)||e.f;return}if(!e.n){e.pz='s';const nx=gpCl(e,e.x+e.f*620*dt*sp);const stop=nx==e.x||(T>1.1);e.x=nx;
      if(Math.random()<dt*20)VFX.spawn('smoke-puff',e.x+e.w/2-e.f*20,e.y+e.h*.8,{s:.6,a:.5});
      if(!e.hd&&ov(P,{x:e.x,y:e.y+10,w:e.w,h:e.h-10})&&hurt(15*dm,{kb:e.f*380}))e.hd=1;if(stop){e.n=1;e.lt=T}return}
    if(T-e.lt>.4)oboEnd(e);return}
  if(a=='tp'){if(!e.n){e.pz='w';if(T>=.3){VFX.spawn('smoke-puff',cx,e.y+e.h/2,{s:1.4});e.x=oboBehind(e);e.f=sgn(pc-(e.x+e.w/2))||e.f;VFX.spawn('smoke-puff',e.x+e.w/2,e.y+e.h/2,{s:1.4});syn('blink');e.n=1;e.at=0}return}
    e.pz=T<.2?'w':'s';if(T>=.2&&!e.hd){const c2=e.x+e.w/2;if(ov(P,{x:e.f>0?c2:c2-110,y:e.y,w:110,h:e.h})){hurt(14*dm,{kb:e.f*300});e.hd=1}}if(T>.6)oboEnd(e);return}
  if(a=='iai'){if(T<1){e.pz='w';if(Math.random()<dt*14)pt({x:cx+e.f*rnd(10,40),y:e.y+e.h*rnd(.3,.6),vx:0,vy:rnd(-40,-10),c:pick(['#fff','#e7f5ff']),s:1.6,l:.3});return}
    if(!e.hd){e.hd=1;e.pz='s';syn('boom');flash('255,255,255',.25);shake=.35;hitstop(.08);if(ov(P,{x:e.f>0?cx:cx-170,y:e.y-10,w:170,h:e.h+10}))hurt(32*dm,{kb:e.f*460})}
    if(T>1.5)oboEnd(e,.2);return}
  if(a=='aoe'){const gy=e.gy||GY-e.h;if(T<.5){e.pz='w';e.y=gy-T/.5*70;return}if(T<1.3){e.y=gy-70+Math.sin((T-.5)*8)*3;return}
    if(!e.hd){e.hd=1;e.pz='s';e.y=gy;shake=.5;syn('boom');flash('140,150,255',.3);VFX.spawn('earth-rupture',cx,GY,{s:1.8});VFX.spawn('smoke-puff',cx,GY-20,{s:2.4});ring(cx,GY-20,10,260,'#91a7ff',.45,6);
      if(Math.abs(pc-cx)<260&&P.y+P.h>GY-90)hurt(19*dm,{kb:sgn(pc-cx)*420});for(const d of [-1,1])N18W.push({x:cx,d,tr:0,hit:0,dm,sp:320})}
    e.y=gy;if(T>1.9)oboEnd(e,.2);return}
  if(a=='cln'){e.pz=T<.4?'w':'s';if(T>=.4&&!e.n){e.n=1;const n=e.p2?3:2;syn('blink');for(let i=0;i<n;i++){const sd=i%2?1:-1,x0=Math.max(ARL+20,Math.min(ARR-60,pc+sd*(170+i*30)));N18C.push({x:x0,y:e.y,w:e.w,h:e.h,f:-sd,t:-i*.35,dm,hd:0});VFX.spawn('smoke-puff',x0+e.w/2,e.y+e.h/2,{s:1.3})}}
    if(T>1.1)oboEnd(e,.3);return}
  oboEnd(e)}
// 场上的东西:飞镖 / 苦无(直线飞)、铁蒺藜(落地 0.5 秒后生效,踩到受伤 + 减速)、首领分身(出现 → 突进 → 消失)、替身木头、影爆的贴地冲击波(黑烟,跳过去)
function n18Step(dt){const pc=P.x+12,gr=P.y+P.h>=GY-4;
  for(const b of N18S){b.t+=dt;b.x+=b.vx*dt;b.y+=b.vy*dt;b.tr+=Math.hypot(b.vx,b.vy)*dt;const r=b.k=='shu'?7:6;if(ov(P,{x:b.x-r,y:b.y-r,w:2*r,h:2*r})){b.dd=1;hurt(b.d*b.dm,{kb:sgn(b.vx)*180})}
    if(b.tr>MSHR+120||b.y>GY||b.y<-40||b.x<cam-40||b.x>cam+VW+40)b.dd=1}N18S=N18S.filter(b=>!b.dd);
  for(const q of N18T){q.t+=dt;if(q.t>=q.arm&&!q.dd&&gr&&Math.abs(pc-q.x)<16&&hurt(7*q.dm,{kb:0,inv:.3})){q.dd=1;slowP(1.5);tx('铁蒺藜',q.x-14,GY-30,'#adb5bd')}if(q.t>q.life)q.dd=1}N18T=N18T.filter(q=>!q.dd);
  for(const c of N18C){c.t+=dt;if(c.t<0)continue;if(c.t<.45){c.f=sgn(pc-(c.x+c.w/2))||c.f;continue}if(c.t<.85){c.x+=c.f*560*dt;if(!c.hd&&ov(P,{x:c.x,y:c.y+10,w:c.w,h:c.h-10})&&hurt(12*c.dm,{kb:c.f*320}))c.hd=1}else if(!c.dd){c.dd=1;VFX.spawn('smoke-puff',c.x+c.w/2,c.y+c.h/2,{s:1.2})}}N18C=N18C.filter(c=>!c.dd);
  for(const l of N18L)l.t+=dt;N18L=N18L.filter(l=>l.t<1.4);
  for(const w of N18W){w.x+=w.d*w.sp*dt;w.tr+=w.sp*dt;w.ft=(w.ft||0)-dt;if(w.ft<=0){w.ft=.06;VFX.spawn('smoke-puff',w.x,GY-14,{s:.8,a:.8})}if(!w.hit&&gr&&Math.abs(pc-w.x)<20&&hurt(12*w.dm,{kb:w.d*300}))w.hit=1}N18W=N18W.filter(w=>w.tr<440&&w.x>0&&w.x<WW);
  if(!(B&&B.k=='nb'&&B.hp>0))N18C=[]}
// 画面(PXL 层,怪物之后画):飞镖(转)/ 苦无(朝飞行方向)· 铁蒺藜(地上 3 枚小飞镖,没生效时半透明)· 分身(半透明紫色)· 替身木头 · 居合 / 影爆的地面预警
function n18Fx(){const M=NJA;if(!M.I)return;const t=performance.now()/1000,I=M.I,e=B;x.imageSmoothingEnabled=false;
  if(e&&e.k=='nb'&&e.hp>0){const cx=e.x+e.w/2;if(e.act=='iai'&&(e.at||0)<1)DZ.zone((e.f>0?cx:cx-170)-cam,170);if(e.act=='aoe'&&(e.at||0)<1.3)DZ.zone(cx-260-cam,520)}
  for(const q of N18T){const m=M.M.shu,a=q.t<q.arm?.5:.9;x.save();x.globalAlpha=a;for(let i=0;i<3;i++){x.save();x.translate(Math.round(q.x-cam+(i-1)*7),GY-3);x.scale(1,.45);x.rotate(i*1.3);x.drawImage(I,m[0],m[1],m[2],m[3],-5,-5,10,10);x.restore()}x.restore()}
  for(const b of N18S){const m=M.M[b.k];x.save();x.translate(Math.round(b.x-cam),Math.round(b.y));if(b.k=='shu'){x.rotate(t*18);x.drawImage(I,m[0],m[1],m[2],m[3],-7,-7,14,14)}else{x.rotate(Math.atan2(b.vy,b.vx));x.filter='brightness(3.2)';x.drawImage(I,m[0],m[1],m[2],m[3],-12,-6,24,12)}x.restore()}
  for(const l of N18L){const m=M.M.log,k=Math.min(1,l.t/.15),a=l.t>1?Math.max(0,(1.4-l.t)/.4):1;x.save();x.globalAlpha=a;x.translate(Math.round(l.x-cam),Math.round(l.y));x.rotate(l.f*.4*k);x.drawImage(I,m[0],m[1],m[2],m[3],-24,-24,48,48);x.restore()}
  for(const c of N18C){if(c.t<0)continue;const f={...e,x:c.x,y:c.y,w:c.w,h:c.h,f:c.f,act:c.t<.45?null:'dash',at:c.t<.45?0:.5,n:0,mv:0,st:0},a=(c.t<.15?c.t/.15:1)*.6;
    x.save();x.globalAlpha=a;x.filter='hue-rotate(220deg) saturate(1.6) brightness(1.2)';x.translate(Math.round(c.x+c.w/2-cam),Math.round(c.y+c.h));x.scale(c.f,1);try{M.draw(x,f,t)}catch(err){}x.restore()}
  x.imageSmoothingEnabled=true}
// 第十四关首领的怪物技能石
MSS[18]=['影主·胧','千本苦无','虚影朝屏幕里最近的 8 个敌人各掷出一把苦无,每把 攻击×2.4','multi',2.4,8,'smoke-puff'];
MISC.ms18=['怪物技能石 · 影主·胧',`在背包里左键点它,选择嵌入剑、法杖或拳套(每把武器嵌 1 颗,各自蓄力)。用嵌着它的武器攻击敌人蓄力 ${MSCN} 次后按 <b>N</b>:召唤「影主·胧」的虚影放出「千本苦无」——${MSS[18][2]}。第 14 关首领 ${MSDR*100}% 掉落。`,'',0];MENI.P.ms18=41;
