// ===== 第四十八轮:第十五关「不眠钟楼」(第二张地图「暗黑大陆」,cur = 19)闹钟关卡,难度质变 =====
// 图集 ALC(art_src/clock19/build_clock19.py):闹钟怪 / 电铃弹 / 火铃弹 = Cute Sprites Pack 1(Master484,CC-BY 3.0);第三形态绿钟 = 红钟色相旋转
//   场景(用户要钟楼背景)= GothicVania Church(ansimuz,CC0)面板 / 石柱 / 地砖 + LPC 落地钟(Sharm / William.Thompsonj,CC-BY 3.0);BGM bgm19 / bgm19b
// 小怪:瞌睡钟 ckb(蓝,近身:翻滚冲撞 / 铃震)· 怒铃钟 ckr(红,远程:电铃弹 / 火铃抛射);被打倒后原地睡 1.6 秒再响铃复活一次(满血),第二次倒下才真正死亡
// 首领「千钟之主」alm:三条命,每次被打倒就睡下 → 响铃 → 变成更大的新闹钟形态(蓝 → 红 → 绿毒钟),伤害一次比一次高;从这一关起首领没有魔力限制,只有技能冷却(ESNM)
//   校准(用户第四十八轮,参考配置:翅膀时装、全身锻造 +2 / 强化 +6、大师套、火之武器、精灵满攻击、技能全 +5;实测法师一套技能 ≈ 13.7 万):
//   生命 2 / 5 / 8 套技能 = ALHP;参考主角生命 9423、防御 823,首领一招(基础 15)打掉 1/12、1/9、1/6 = ALDM(第四十九轮第二版再 ×1.35:用户觉得伤害不够)
// 首领招式:铃震 ring(身边一圈冲击)· 弹跳砸 hop(跳到主角头上砸地,二形态起两道冲击波)· 电铃弹 bolt(扇形 3 / 5 / 7 发)·
//   火铃雨 fire(二形态起:天上落火球,地面有预警)· 叫醒 call(二形态起:叫来 2 只闹钟)· 毒海 sea(第三形态:地面全被毒雾盖住 8 秒,站在地上每 0.5 秒掉 1% 最大生命,飞起来或站平台上躲开)
const E19=[['ckb',360],['ckr',520],['ckb',660],['ckb',840],['ckr',980],['ckb',1120],['ckr',1280],['ckb',1440],['ckb',1580],['ckr',1720],['ckb',1880],['ckr',2020],['ckb',2160],['ckr',2300],['ckb',2440],['ckb',2540]];
const PL19=[{x:0,y:GY,w:WW},{x:2680,y:206,w:110},{x:2960,y:206,w:110}];  // 首领场地两侧的浮台(躲毒海)
const ALHP=[274000,685000,1100000],ALDM=[55,74,112],ALSZ=[1,1.3,1.6],ALNM=['千钟之主 · 晨钟','千钟之主 · 怒钟','千钟之主 · 末日之钟'];
const ALC={I:null,D:'@@A:alc_atlas@@',M:{"b_stand":[0,0,32,32,32,1],"b_walk":[0,33,128,32,32,4],"b_alarm":[0,66,64,32,32,2],"b_damage":[0,99,32,32,32,1],"b_death":[0,132,32,32,32,1],"b_sleep":[0,165,32,32,32,1],"r_stand":[0,198,32,32,32,1],"r_walk":[0,231,128,32,32,4],"r_alarm":[0,264,64,32,32,2],"r_damage":[0,297,32,32,32,1],"r_death":[0,330,32,32,32,1],"r_sleep":[0,363,32,32,32,1],"g_stand":[0,396,32,32,32,1],"g_walk":[0,429,128,32,32,4],"g_alarm":[0,462,64,32,32,2],"g_damage":[0,495,32,32,32,1],"g_death":[0,528,32,32,32,1],"g_sleep":[0,561,32,32,32,1],"z":[0,594,24,8,8,3],"el":[0,603,32,16,16,2],"fb":[0,620,48,16,16,3],"p0":[0,637,160,192,160,1],"p1":[0,830,128,192,128,1],"p2":[0,1023,128,192,128,1],"p3":[0,1216,80,192,80,1],"p4":[0,1409,64,192,64,1],"col":[0,1602,114,190,114,1],"gnd":[0,1793,48,40,48,1],"gnd2":[0,1834,48,41,48,1],"gclk":[0,1876,96,96,32,3]},
  A:[14.5,30,32],  // 身体中心 x / 身体高 / 脚底 y
  init(){const im=new Image();im.onload=()=>{this.I=im};im.src=this.D},
  on(e){return !!this.I&&(e.k=='ckb'||e.k=='ckr'||e.k=='alm')},
  fr(c,k,i,X,Y,s,f,a){const m=this.M[k];if(!m||!this.I)return;const fw=m[4],n=m[5];i=((Math.floor(i)%n)+n)%n;c.save();c.imageSmoothingEnabled=false;if(a!=null)c.globalAlpha*=a;c.translate(Math.round(X),Math.round(Y));if(f<0){c.translate(fw*s,0);c.scale(-1,1)}c.drawImage(this.I,m[0]+i*fw,m[1],fw,m[3],0,0,fw*s,m[3]*s);c.restore()},
  col(e){return e.k=='alm'?'brg'[Math.min(2,(e.form||1)-1)]:e.k=='ckr'?'r':'b'},
  // 怪物:c 已经平移到脚底中间、按朝向翻转(面朝右);素材本来就朝右
  draw(c,e,t){const p=this.col(e),A=this.A,H=e.h/(e.max?1.1*(e.bsz||1):(e.vs||1)),s=H/A[1];let row='stand',fi=0;const s_=e.s,a=e.act,T=e.at||0;c.save();if(FLW)c.filter='brightness(2.6)';
    if(s_=='slp'||a=='morph'&&T<1.6){const tt=a=='morph'?T:e.t;row=tt<.4?'death':'sleep'}
    else if(s_=='wak'||a=='morph'){row='alarm';fi=t*16}
    else if(e.k=='alm'&&a&&a!='hop'&&(e.pz=='w'||a!='dash'&&a!='lunge'&&T<.9)){row='alarm';fi=t*14}
    else if(s_=='aim'||s_=='rg'){row='alarm';fi=t*14}
    else if(e.st>0){row='damage'}else if(e.mv||s_=='ds'||a=='hop'||a=='dash'||a=='lunge'){row='walk';fi=t*(a=='dash'?18:10)}
    this.fr(c,p+'_'+row,fi,-A[0]*s,-A[2]*s,s,1);c.restore()},
  // 场景(第四十八轮,用户要钟楼背景):GothicVania Church(ansimuz,CC0)的哥特窗 / 烛台墙 / 祭坛 / 石像鬼面板拼成远景墙(视差 .3)+ 骷髅石柱(视差 .6)+ LPC 落地钟(摆锤 3 帧,视差 .8)+ 石地砖
  bg(){const I=this.I,M=this.M,t=performance.now()/1000;x.fillStyle='#272638';x.fillRect(0,0,VW,VH);if(!I)return;x.imageSmoothingEnabled=false;
    {const seq=['p0','p1','p3','p2','p1','p4'],s=1.5,L=seq.reduce((a,k)=>a+M[k][2]*s,0),o=((cam*.3)%L+L)%L;for(let px=-o,i=0;px<VW;i++){const m=M[seq[i%seq.length]],w=m[2]*s;if(px+w>0)x.drawImage(I,m[0],m[1],m[2],m[3],Math.floor(px),GY-m[3]*s+4,Math.ceil(w),m[3]*s);px+=w}}
    x.fillStyle='rgba(20,16,30,.35)';x.fillRect(0,0,VW,GY);
    {const m=M.gclk,s=1.6,gap=230,o=((cam*.8)%gap+gap)%gap,f=[0,1,2,1][Math.floor(t*2.4)%4];for(let px=-o+60;px<VW+40;px+=gap)x.drawImage(I,m[0]+f*32,m[1],32,96,Math.round(px),GY-96*s+2,32*s,96*s)}
    {const m=M.col,s=1.35,gap=340,o=((cam*.6)%gap+gap)%gap;x.save();x.filter='brightness(.8)';for(let px=-o-40;px<VW+120;px+=gap)x.drawImage(I,m[0],m[1],m[2],m[3],Math.round(px),GY-m[3]*s+6,m[2]*s,m[3]*s);x.restore()}
    {const m=M.gnd;for(let px=Math.floor((cam-4)/48)*48;px<cam+VW+4;px+=48)x.drawImage(I,m[0],m[1],48,40,Math.round(px-cam),GY-6,48,40)}
    {const m=M.gnd2;for(const p of PL)if(p.y<GY&&p.x-cam<VW+20&&p.x+p.w-cam>-20){for(let q=0;q<p.w;q+=48){const w=Math.min(48,p.w-q);x.drawImage(I,m[0],m[1],w,20,Math.round(p.x+q-cam),Math.round(p.y-4),w,20)}}}},
  over(){x.fillStyle='rgba(60,40,90,.06)';x.fillRect(0,0,VW,VH);if(B&&B.k=='alm'&&(B.seaT||0)>0){x.fillStyle='rgba(60,140,40,.10)';x.fillRect(0,0,VW,VH)}}};
ALC.init();
let A19S=[],A19F=[],A19W=[];  // 电铃弹 / 火铃弹(直线 / 抛射)· 天上落下的火铃 · 贴地冲击波
function a19Clr(){A19S=[];A19F=[];A19W=[]}
const a19Shot=(x0,y0,vx,vy,dm,k,d,g)=>{A19S.push({x:x0,y:y0,vx,vy,dm,k,d:d||10,g:g||0,t:0});syn('proj')};
// ---- 复活:小怪倒下 → 原地睡 1.6 秒(打不到)→ 响铃 0.5 秒 → 满血复活(只一次)----
function almRev(){for(const e of E)if(e.hp<=0&&(e.k=='ckb'||e.k=='ckr')&&!e.rev&&!e.sum){e.rev=1;e.hp=1;e.ug=1;e.s='slp';e.t=0;e.mv=0;e.hd=1;tx('倒下了……',e.x+e.w/2-16,e.y-10,'#ced4da')}}
function almWake(e,dt){e.t+=dt;e.pz=null;e.mv=0;if(e.s=='slp'){if(e.t>1.6){e.s='wak';e.t=0;syn('blink')}return 1}
  if(e.s=='wak'){if(e.t>.5){e.s=null;e.ug=0;e.hp=e.hp0;e.cd=.6;tx('叮铃铃——复活!',e.x+e.w/2-30,e.y-12,'#ffe066');ring(e.x+e.w/2,e.y+e.h/2,6,50,'#ffe066',.35,4)}return 1}return 0}
// ---- 瞌睡钟(蓝,近身):翻滚冲撞 / 铃震 ----
function ckbStep(e,dt){if(almWake(e,dt))return;const dm=e.dm,cx=e.x+e.w/2,pc=P.x+12,dx=pc-cx,ad=Math.abs(dx),lo=g8Lo(e),hi=g8Hi(e),cl=v=>Math.max(lo,Math.min(hi-e.w,v));
  e.cd=(e.cd==null?rnd(.8,1.5):e.cd)-dt;e.pz=null;e.mv=0;const s=e.s;if(s)e.t+=dt;
  if(s=='aim'){e.pz='w';e.f=sgn(dx)||e.f;if(e.t>=.4){e.s='ds';e.t=0;e.hd=0}return}
  if(s=='ds'){e.pz='s';e.x=cl(e.x+e.f*360*dt);if(!e.hd&&ov(P,{x:e.x-4,y:e.y+4,w:e.w+8,h:e.h-4})&&hurt(12*dm,{kb:e.f*260}))e.hd=1;if(e.t>.4){e.s='rec';e.t=0}return}
  if(s=='rg'){e.pz=e.t<.5?'w':'s';if(e.t>=.5&&!e.hd){e.hd=1;ring(cx,e.y+e.h/2,6,80,'#ffd43b',.35,4);syn('boom');if(Math.abs(pc-cx)<80&&Math.abs(P.y+P.h-(e.y+e.h))<60)hurt(13*dm,{kb:sgn(dx)*300})}if(e.t>.8){e.s='rec';e.t=0}return}
  if(s=='rec'){if(e.t>.6){e.s=null;e.cd=rnd(1,1.7)}return}
  e.f=sgn(dx)||e.f;if(ad>50){e.x=cl(e.x+e.f*chV(62,ad)*dt);e.mv=1}
  if(e.cd<=0&&Math.abs(P.y+P.h-(e.y+e.h))<70&&ad<220){if(!tok(e)){e.cd=.3;return}e.s=ad<80&&Math.random()<.5?'rg':'aim';e.t=0;e.hd=0}}
// ---- 怒铃钟(红,远程):电铃弹(直线,一次 1~3 发)/ 火铃抛射(落地小范围)----
function ckrStep(e,dt){if(almWake(e,dt))return;const dm=e.dm,cx=e.x+e.w/2,pc=P.x+12,dx=pc-cx,ad=Math.abs(dx),lo=g8Lo(e),hi=g8Hi(e),cl=v=>Math.max(lo,Math.min(hi-e.w,v));
  e.cd=(e.cd==null?rnd(1,2):e.cd)-dt;e.pz=null;e.mv=0;const s=e.s;if(s)e.t+=dt;
  if(s=='aim'){e.pz='w';e.f=sgn(dx)||e.f;if(e.t>=.5){e.s='rec';e.t=0;const y0=e.y+e.h*.45;
      if(Math.random()<.6){const n=Math.random()<.4?3:1;for(let i=0;i<n;i++)a19Shot(cx+e.f*14,y0,e.f*280,(i-(n-1)/2)*60,dm,'el',10)}
      else{const T=.9,vx=(pc-cx)/T;a19Shot(cx,y0,vx,-300,dm,'fb',12,660)}}return}
  if(s=='rec'){e.pz=e.t<.2?'s':null;if(e.t>.8){e.s=null;e.cd=rnd(1.3,2.2)}return}
  e.f=sgn(dx)||e.f;if(ad>150){e.x=cl(e.x+e.f*chV(54,ad)*dt);e.mv=1}else if(ad<100){e.x=cl(e.x-e.f*46*dt);e.mv=1}  // 第四十九轮修:远程令牌只在 MRNGR(170)以内给,原来 170~260 之间不走也不打
  if(e.cd<=0&&ad<MRNGR+40){if(!tok(e,1)){e.cd=.4;return}e.s='aim';e.t=0}}
// ---- 首领:千钟之主 ----
function almInit(){const K=STK();B.form=1;B.esnm=1;B.hp=B.max=Math.round(ALHP[0]*K.hp);B.dm=ALDM[0]*K.atk}  // 防御 = init 里的 BDF[19] + 星级加值
function almEnd(e,x_){e.act=null;e.mv=0;e.n=0;e.hn=0;e.cd=[1.2,.95,.75][e.form-1]+Math.random()*.4+(x_||0)}
// 打倒:还有命就进入变身(e.ug 打不到),hp 先留 1 防止被当成死亡
function almMorph(){const e=B;if(!(e.form<3))return;e.hp=1;e.ug=1;e.act='morph';e.at=0;e.mv=0;e.y=e.gy||e.y;A19F=[];e.seaT=0;sfxAll();flash('255,240,200',.3);banner('叮铃铃铃——!千钟之主又醒了过来……')}
function almGrow(e){const K=STK(),f=++e.form,k=ALSZ[f-1]/ALSZ[f-2],bot=e.y+e.h;e.w=Math.round(e.w*k);e.h=Math.round(e.h*k);e.bsz=(e.bsz||1)*k;e.y=bot-e.h;e.gy=e.y;e.x=gpCl(e,e.x);
  e.hp=e.max=Math.round(ALHP[f-1]*K.hp);e.dm=ALDM[f-1]*K.atk;e.saN=0;e.ug=0;e.act=null;e.cd=1;shake=.5;syn('boom');ring(e.x+e.w/2,e.y+e.h/2,12,220,f==3?'#8ce99a':'#ff8787',.5,6);banner(ALNM[f-1])}
function almStep(e,dt){const pc=P.x+12,cx=e.x+e.w/2,dx=pc-cx,ad=Math.abs(dx),F=e.form||1,dm=e.dm;e.pz=null;
  if(!e.intro){e.intro=1;banner(ALNM[0])}
  e.seaCd=(e.seaCd||0)-dt;
  if(e.act=='morph'){e.at+=dt;const T=e.at;if(T>=1.6&&!e.n){e.n=1;syn('blink')}if(T>=2.4)almGrow(e);return}
  if(!e.act){e.mv=0;e.cd-=dt;e.f=sgn(dx)||e.f;if(ad>130){e.mv=1;e.x=gpCl(e,e.x+e.f*(66+F*14)*dt)}
    if(e.cd>0)return;const Q=ad<170?['ring','lunge','lunge','hop','dash']:['dash','dash','hop','bolt'];if(F>=2)Q.push('fire','call');if(F>=3&&e.seaCd<=0)Q.push('sea','sea','sea');let a=pick(Q);if(a==e.la&&Math.random()<.7)a=pick(Q);  // 第二版:物理招为主(冲撞 / 指针连斩 / 连跳砸),电铃弹、火铃雨少出
    if(a=='call'&&E.filter(q=>q.sum&&q.hp>0).length>=4)a='bolt';e.act=a;e.la=a;e.at=0;e.hd=0;e.n=0;return}
  e.at+=dt;const T=e.at,a=e.act;
  if(a=='ring'){e.pz=T<.7?'w':'s';if(T>=.7&&!e.hd){e.hd=1;const R=160+F*40;syn('boom');shake=.35;ring(cx,e.y+e.h/2,10,R,'#ffe066',.45,6);if(F>=2)ring(cx,e.y+e.h/2,8,R*.7,'#ff8787',.35,5);
      if(Math.abs(pc-cx)<R&&Math.abs(P.y+P.h/2-(e.y+e.h/2))<R*.6)hurt(15*dm,{kb:sgn(dx)*380})}if(T>1.1)almEnd(e);return}
  if(a=='hop'){const gy=e.gy||GY-e.h;if(T<.35){e.pz='w';e.f=sgn(dx)||e.f;e.hx=Math.max(ARL+10,Math.min(ARR-e.w-10,pc-e.w/2));e.x0=e.x;return}
    if(T<1.05){const u=(T-.35)/.7;e.pz='s';e.x=e.x0+(e.hx-e.x0)*u;e.y=gy-Math.sin(u*Math.PI)*(120+F*20);return}
    if(!e.hd){e.hd=1;e.y=gy;shake=.5;syn('boom');VFX.spawn('earth-rupture',e.x+e.w/2,GY,{s:1.2+F*.3});ring(e.x+e.w/2,GY-20,10,130+F*30,'#ffd43b',.4,6);const c2=e.x+e.w/2;
      if(Math.abs(pc-c2)<e.w/2+60&&P.y+P.h>GY-80)hurt(18*dm,{kb:sgn(pc-c2)*420});if(F>=2)for(const d of [-1,1])A19W.push({x:c2,d,tr:0,hit:0,dm,sp:300+F*30})}
    e.y=gy;if(T>1.25&&(e.hn||0)<F-1){e.hn=(e.hn||0)+1;e.at=0;e.hd=0;return}if(T>1.5){e.hn=0;almEnd(e,.1)}return}  // 第二版:二形态连跳 2 次、三形态 3 次
  // 冲撞(第二版):蓄力后贴地横冲,撞墙震地;二形态来回 2 趟、三形态 3 趟
  if(a=='dash'){if(T<.55){e.pz='w';e.f=sgn(dx)||e.f;e.dp=0;e.d2=0;e.hd=0;return}
    e.d2+=dt;if(e.d2<0){e.pz='w';return}e.pz='s';e.mv=1;const gx=e.x+e.f*(430+F*60)*dt,nx=gpCl(e,gx);e.x=nx;e.ft=(e.ft||0)-dt;if(e.ft<=0){e.ft=.06;VFX.spawn('smoke-puff',e.x+e.w/2-e.f*e.w*.4,GY-10,{s:.9,a:.8})}
    if(!e.hd&&ov(P,{x:e.x+6,y:e.y+e.h*.2,w:e.w-12,h:e.h*.8})&&hurt(16*dm,{kb:e.f*480}))e.hd=1;
    if(nx!==gx||e.d2>1.2){if(nx!==gx){shake=.3;syn('boom');VFX.spawn('earth-rupture',e.f>0?e.x+e.w:e.x,GY,{s:1})}if(++e.dp>=F)almEnd(e,.3);else{e.f=sgn(pc-(e.x+e.w/2))||-e.f;e.d2=-.35;e.hd=0}}return}
  // 指针连斩(第二版):贴身往前踏步连砍 1 + 形态数 段,最后一下最重;连段中间只给 0.3 秒无敌,站着不动会吃满
  if(a=='lunge'){const nH=1+F,D=.42;if(T<.45){e.pz='w';e.f=sgn(dx)||e.f;return}const k=Math.floor((T-.45)/D),u=T-.45-k*D;
    if(k>=nH){e.pz=null;if(u>.4)almEnd(e,.2);return}e.pz='s';if(u<.05)e.f=sgn(dx)||e.f;if(u<.16){e.mv=1;e.x=gpCl(e,e.x+e.f*260*dt)}
    if(e.n<=k&&u>=.12){e.n=k+1;const L=k==nH-1,c2=e.x+e.w/2,W=56+e.w*.35;VFX.spawn(L?'m-claw2':'m-claw',c2+e.f*(e.w*.3+20),e.y+e.h*.5,{f:e.f,s:1.3+F*.3});sfx('eatk');if(L){shake=.25}
      if(ov(P,{x:e.f>0?c2:c2-W-e.w*.2,y:e.y,w:W+e.w*.2,h:e.h}))hurt((L?13:9)*dm,L?{kb:e.f*420}:{kb:e.f*200,inv:.3})}return}
  if(a=='bolt'){e.pz=T<.6?'w':'s';if(T<.6)e.f=sgn(dx)||e.f;const vol=F;
    for(let v=0;v<vol;v++)if(T>=.6+v*.35&&e.n<=v){e.n=v+1;const n=1+F*2,y0=e.y+e.h*.45,ang=Math.atan2(P.y+P.h/2-y0,dx);for(let i=0;i<n;i++){const q=ang+(i-(n-1)/2)*.14;a19Shot(cx+e.f*20,y0,Math.cos(q)*(300+F*30),Math.sin(q)*(300+F*30),dm,'el',13)}}
    if(T>.9+vol*.35)almEnd(e);return}
  if(a=='fire'){e.pz=T<.6?'w':'s';if(T>=.6&&!e.n){e.n=1;const n=4+F*2;syn('proj');for(let i=0;i<n;i++){const fx=i==0?pc:Math.max(ARL+20,Math.min(ARR-20,pc+rnd(-320,320)));A19F.push({x:fx,y:-20-i*30,t:-.2*i,dm,warn:1})}}
    if(T>1.4)almEnd(e,.2);return}
  if(a=='call'){e.pz=T<.6?'w':'s';if(T>=.6&&!e.n){e.n=1;syn('blink');for(const d of [-1,1]){const k=d<0?'ckb':'ckr',m=mk(k,Math.max(ARL+20,Math.min(ARR-60,cx+d*rnd(140,220))),LMNOW());m.sum=1;m.rev=1;m.f=-d;E.push(m);VFX.spawn('smoke-puff',m.x+m.w/2,m.y+m.h/2,{s:1.2})}}
    if(T>1.2)almEnd(e,.3);return}
  if(a=='sea'){e.pz=T<1?'w':'s';if(T>=1&&!e.n){e.n=1;e.seaT=8;e.seaCd=18;e.sTk=.5;flash('80,180,60',.3);syn('boom');tx('毒海!快离开地面!',pc-50,P.y-40,'#8ce99a')}if(T>1.4)almEnd(e,.2);return}
  almEnd(e)}
const LMNOW=()=>WLM||1;
// 场上的东西:电铃弹 / 火铃弹、天上落的火铃(落点预警)、贴地冲击波(跳过去)、毒海(站在地上持续掉血)
function a19Step(dt){const pc=P.x+12,gr=P.y+P.h>=GY-4;
  for(const b of A19S){b.t+=dt;b.vy+=b.g*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;const r=b.k=='fb'?8:7;if(ov(P,{x:b.x-r,y:b.y-r,w:2*r,h:2*r})){b.dd=1;hurt(b.d*b.dm,{kb:sgn(b.vx)*200})}
    if(b.k=='fb'&&b.g&&b.y>=GY-6){b.dd=1;VFX.spawn('warm-explosion',b.x,GY-10,{s:.8});if(Math.abs(pc-b.x)<36&&P.y+P.h>GY-40)hurt(b.d*b.dm*.8,{kb:sgn(pc-b.x)*240})}
    if(b.t>4||b.y>GY+10||b.x<cam-60||b.x>cam+VW+60)b.dd=1}A19S=A19S.filter(b=>!b.dd);
  for(const f of A19F){f.t+=dt;if(f.t<.8)continue;f.y+=560*dt;if(f.y>=GY-8&&!f.dd){f.dd=1;VFX.spawn('warm-explosion',f.x,GY-12,{s:1.3});syn('boom');if(Math.abs(pc-f.x)<46&&P.y+P.h>GY-70)hurt(14*f.dm,{kb:sgn(pc-f.x)*300})}}A19F=A19F.filter(f=>!f.dd);
  for(const w of A19W){w.x+=w.d*w.sp*dt;w.tr+=w.sp*dt;w.ft=(w.ft||0)-dt;if(w.ft<=0){w.ft=.06;VFX.spawn('smoke-puff',w.x,GY-14,{s:.8,a:.8})}if(!w.hit&&gr&&Math.abs(pc-w.x)<20&&hurt(12*w.dm,{kb:w.d*300}))w.hit=1}A19W=A19W.filter(w=>w.tr<480&&w.x>0&&w.x<WW);
  const e=B;if(e&&e.k=='alm'&&e.hp>0&&(e.seaT||0)>0){e.seaT-=dt;e.sTk-=dt;if(e.sTk<=0){e.sTk+=.5;if(gr&&!P.fly&&!GM.god&&P.hp>0){const d=Math.max(1,Math.round(stats().hp*.01));P.hp-=d;tx('-'+d,P.x+6,P.y-6,'#8ce99a')}}}
  if(!(B&&B.k=='alm'&&B.hp>0)){A19F=[];if(B)B.seaT=0}}
// 画面(PXL 层,怪物之后画):电铃弹 / 火铃弹 · 落下的火铃 + 地面预警 · 睡觉的 Z · 毒海(Ninja Adventure 烟雾帧染绿,铺满地面)· 首领招式预警
function a19Fx(){const M=ALC;if(!M.I)return;const t=performance.now()/1000,e=B;x.imageSmoothingEnabled=false;
  if(e&&e.k=='alm'&&e.hp>0){const cx=e.x+e.w/2,F=e.form||1;if(e.act=='ring'&&(e.at||0)<.7){const R=160+F*40;DZ.zone(cx-R-cam,2*R)}if(e.act=='hop'&&(e.at||0)<1.05&&e.hx!=null)DZ.zone(e.hx+e.w/2-e.w/2-60-cam,e.w+120);if(e.act=='sea'&&(e.at||0)<1)DZ.zone(0,VW)}
  for(const f of A19F){if(f.t<.8)DZ.zone(f.x-46-cam,92);else M.fr(x,'fb',t*12,f.x-cam-16,f.y-16,2,1)}
  for(const b of A19S){if(b.k=='el')M.fr(x,'el',t*10,b.x-cam-12,b.y-12,1.5,1);else{x.save();x.translate(Math.round(b.x-cam),Math.round(b.y));x.rotate(Math.atan2(b.vy,b.vx));M.fr(x,'fb',t*12,-12,-12,1.5,1);x.restore()}}
  const zz=q=>{for(let i=0;i<3;i++){const k=((t*.8+i/3)%1);M.fr(x,'z',i,q.x+q.w*.7-cam+k*14,q.y-4-k*26,1.5,1,1-k)}};
  for(const q of E)if(q.s=='slp')zz(q);if(e&&e.k=='alm'&&e.act=='morph'&&(e.at||0)>.4&&(e.at||0)<1.6)zz(e);
  if(e&&e.k=='alm'&&(e.seaT||0)>0){const a=Math.min(1,e.seaT/.6,(8-e.seaT)/.4+.2);x.save();x.filter='sepia(1) hue-rotate(60deg) saturate(2.4) brightness(.85)';for(let i=0;i<14;i++){const px=((i*52-(cam*.9)%52)+VW*2)%(VW+52)-26;VFX.frame(x,'m-smoke',(Math.floor(t*8)+i)%6,px,GY-8+Math.sin(t*3+i)*3,2.4,i%2?-1:1,0,.75*a,.55)}x.restore()}
  x.imageSmoothingEnabled=true}
// 第十五关首领的怪物技能石
MSS[19]=['千钟之主','连环闹铃','虚影朝屏幕里最近的 6 个敌人各射出一道电铃弹,每道 攻击×3','multi',3,6,'warm-explosion'];
MISC.ms19=['怪物技能石 · 千钟之主',`在背包里左键点它,选择嵌入剑或法杖(每把武器嵌 1 颗,两把武器各自蓄力)。用嵌着它的武器攻击敌人蓄力 ${MSCN} 次后按 <b>N</b>:召唤「千钟之主」的虚影放出「连环闹铃」——${MSS[19][2]}。第 15 关首领 ${MSDR*100}% 掉落。`,'',0];MENI.P.ms19=41;
