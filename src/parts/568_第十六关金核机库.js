// ===== 第五十三轮:第十六关「金核机库」(第二张地图「暗黑大陆」下方正中的金色机器人,cur = 20)机械关卡,难度延续第十五关 =====
// 图集 RBT(art_src/robot20/build_robot20.py):首领 / 地面机器人 = Mecha platformer / Pixelart(Shiv,CC0),首领由蓝色换成金色;
//   吊顶炮塔 / 子弹 / 爆炸 / 地砖 = Warped City(ansimuz,CC0),炮塔上下翻转挂在天花板;场景 = Warped Sci-Fi Lab(ansimuz,CC0);BGM bgm20 / bgm20b(build_audio.py r53)
// 小怪:盾卫机兵 rsh(地面,近战:盾牌冲撞 / 盾击震地)· 吊顶炮塔 rtu(挂在天花板上沿着顶部滑动,远程:三连射 / 投弹)
// 首领「金核炮神」rgn:只有一条命、没有魔力(esnm),以远程为主,喜欢拉开距离:
//   速射机炮 gun(扇形连射)· 炮火覆盖 art(对着天上开炮,远处一片地面预警后落弹)· 蓄能主炮 beam(水平贯穿全场的光束,跳起来或站浮台躲)·
//   能量虹吸 drain(三颗追踪能量球,每颗偷 1/3 × 25% 最大魔力,一轮三颗加起来最多 25%,第五十九轮用户要求)· 被靠近:反制震地 ctr(大击退)→ 后撤步 bstep → 马上接机炮;生命一半以下「过载」:出招更快、炮弹更多
//   校准:生命 2.4M(一星,约 17.5 套参考技能,千钟之主三条命合计约 2.06M);伤害 RGDM 95(介于千钟之主二、三形态)
const E20=[['rsh',360],['rtu',500],['rsh',660],['rtu',820],['rsh',980],['rsh',1120],['rtu',1260],['rsh',1420],['rtu',1560],['rsh',1700],['rsh',1880],['rtu',2020],['rsh',2160],['rtu',2300],['rsh',2440],['rtu',2520]];
const PL20=[{x:0,y:GY,w:WW},{x:540,y:212,w:110},{x:1180,y:212,w:110},{x:1860,y:212,w:110},{x:2680,y:212,w:110},{x:2980,y:212,w:110}];  // 浮台:够得着吊顶炮塔,首领场地两块躲主炮
const RGHP=2400000,RGDM=95,RTUY=GY-200;  // RTUY:吊顶炮塔挂的高度(炮塔顶部)
const RBT={I:null,D:'@@A:rbt_atlas@@',M:{"gt":[0,0,320,72,64,5],"gb":[0,73,576,32,32,18],"st":[0,106,144,48,48,3],"sb":[0,155,576,32,32,18],"mz":[0,188,273,23,39,7],"tur":[0,212,150,23,25,6],"bl":[0,236,45,11,15,3],"hit":[0,248,45,11,15,3],"ex":[0,260,330,52,55,6],"back":[0,313,320,240,320,1],"middle":[0,554,320,240,320,1],"front":[0,795,320,240,320,1],"sup":[0,1036,16,240,16,1],"tank1":[0,1277,48,122,48,1],"tank2":[0,1400,48,122,48,1],"tank3":[0,1523,48,122,48,1],"gnd":[0,1646,48,40,48,1]},
  MZ:[[14,69],[39,63],[47,45],[43,16],[16,2]],  // 金核炮神上半身 5 个角度(下 → 上)的炮口位置(帧内坐标)
  init(){const im=new Image();im.onload=()=>{this.I=im};im.src=this.D},
  on(e){return !!this.I&&(e.k=='rsh'||e.k=='rtu'||e.k=='rgn')},
  fr(c,k,i,X,Y,s,a){const m=this.M[k];if(!m||!this.I)return;const fw=m[4],n=m[5];i=((Math.floor(i)%n)+n)%n;c.save();c.imageSmoothingEnabled=false;if(a!=null)c.globalAlpha*=a;c.drawImage(this.I,m[0]+i*fw,m[1],fw,m[3],Math.round(X),Math.round(Y),fw*s,m[3]*s);c.restore()},
  aimI(a){return Math.max(0,Math.min(4,Math.round(2+a/(Math.PI/4))))},  // a:相对水平的仰角(向上为正)
  // 怪物:c 已经平移到脚底中间、按朝向翻转(面朝右)
  draw(c,e,t){const vs=e.max?1.1*(e.bsz||1):(e.vs||1),H=e.h/vs;c.save();if(FLW)c.filter='brightness(2.6)';
    if(e.k=='rgn'){const s=H/52,leg=e.act=='bstep'?16:e.mv?Math.floor(t*14)%15:0,ai=e.act&&e.act!='ctr'&&e.act!='bstep'?this.aimI(e.aim||0):e.act=='ctr'?0:1;
      this.fr(c,'gb',leg,-17*s,-32*s,s);this.fr(c,'gt',ai,-17*s,-72*s,s);
      if((e.mzT||0)>0){const q=this.MZ[ai];this.fr(c,'mz',Math.floor((.12-e.mzT)/.12*7),(q[0]-17)*s,(q[1]-72-11)*s,s*.8)}}
    else if(e.k=='rsh'){const s=H/47,st=e.s,leg=e.mv||st=='ds'?Math.floor(t*(st=='ds'?22:12))%15:0,top=st=='aim'||st=='sl'&&e.t<.35?1:st=='ds'||st=='sl'?2:0;
      this.fr(c,'sb',leg,(4-20)*s,(26-58)*s,s);this.fr(c,'st',top,-20*s,-58*s,s)}
    else if(e.k=='rtu'){const s=H/23,fi=e.s=='aim'?Math.floor(t*16)%6:e.s=='rec'?5:0;this.fr(c,'tur',fi,-12.5*s,-23*s,s)}
    c.restore()},
  // 场景:实验室墙(视差 .3)+ 玻璃罐(.6)+ 前景支柱(.9)+ 天花板钢梁(地砖倒过来)+ 地面
  bg(){const I=this.I,M=this.M;x.fillStyle='#061820';x.fillRect(0,0,VW,VH);if(!I)return;x.imageSmoothingEnabled=false;
    const lay=(k,par,s,y0)=>{const m=M[k],w=m[2]*s,o=((cam*par)%w+w)%w;for(let px=-o;px<VW;px+=w)x.drawImage(I,m[0],m[1],m[2],m[3],Math.floor(px),y0,Math.ceil(w),m[3]*s)};
    lay('back',.3,1.5,-20);x.fillStyle='rgba(4,16,22,.25)';x.fillRect(0,0,VW,GY);lay('middle',.6,1.3,GY-272);lay('front',.85,1.5,-20);
    {const m=M.gnd;for(let px=Math.floor((cam*.95-4)/48)*48;px<cam*.95+VW+4;px+=48){x.save();x.translate(Math.round(px-cam*.95),RTUY);x.scale(1,-1);x.drawImage(I,m[0],m[1],48,40,0,0,48,40);x.restore()}}
    {const m=M.gnd;for(let px=Math.floor((cam-4)/48)*48;px<cam+VW+4;px+=48)x.drawImage(I,m[0],m[1],48,40,Math.round(px-cam),GY-6,48,40)}
    {const m=M.gnd;for(const p of PL)if(p.y<GY&&p.x-cam<VW+20&&p.x+p.w-cam>-20){for(let q=0;q<p.w;q+=48){const w=Math.min(48,p.w-q);x.drawImage(I,m[0],m[1],w,16,Math.round(p.x+q-cam),Math.round(p.y-3),w,16)}}}}};
RBT.init();
ESKX.bstep=1;  // 后撤步不算技能(不进冷却)
let A20S=[],A20M=[],A20B=[],A20O=[],A20X=[];  // 子弹 / 炮弹(抛射)· 炮火落点 · 主炮光束 · 虹吸能量球 · 爆炸动画
function a20Clr(){A20S=[];A20M=[];A20B=[];A20O=[];A20X=[]}
const a20Shot=(x0,y0,vx,vy,dm,d,g)=>{A20S.push({x:x0,y:y0,vx,vy,dm,d,g:g||0,t:0});syn('proj')};
const a20Boom=(bx,by,r,dm,d)=>{A20X.push({x:bx,y:by,t:0,s:r/26});syn('boom');shake=Math.max(shake,.2);const pc=P.x+12;if(dm&&Math.abs(pc-bx)<r&&Math.abs(P.y+P.h/2-by)<r+10)hurt(d*dm,{kb:sgn(pc-bx)*280})};
// ---- 盾卫机兵(地面,近战):盾牌冲撞 / 盾击震地 ----
function rshStep(e,dt){const dm=e.dm,cx=e.x+e.w/2,pc=P.x+12,dx=pc-cx,ad=Math.abs(dx),lo=g8Lo(e),hi=g8Hi(e),cl=v=>Math.max(lo,Math.min(hi-e.w,v));
  e.cd=(e.cd==null?rnd(.8,1.5):e.cd)-dt;e.pz=null;e.mv=0;const s=e.s;if(s)e.t+=dt;
  if(s=='aim'){e.pz='w';e.f=sgn(dx)||e.f;if(e.t>=.45){e.s='ds';e.t=0;e.hd=0}return}
  if(s=='ds'){e.pz='s';e.x=cl(e.x+e.f*330*dt);if(!e.hd&&ov(P,{x:e.f>0?cx:e.x-6,y:e.y+4,w:e.w/2+10,h:e.h-4})&&hurt(13*dm,{kb:e.f*320}))e.hd=1;if(e.t>.38){e.s='rec';e.t=0}return}
  if(s=='sl'){e.pz=e.t<.45?'w':'s';if(e.t>=.45&&!e.hd){e.hd=1;ring(cx+e.f*16,GY-6,6,74,'#69db7c',.35,4);syn('boom');VFX.spawn('earth-rupture',cx+e.f*16,GY,{s:.8});if(Math.abs(pc-cx-e.f*16)<74&&P.y+P.h>GY-50)hurt(12*dm,{kb:sgn(dx)*300})}if(e.t>.8){e.s='rec';e.t=0}return}
  if(s=='rec'){if(e.t>.6){e.s=null;e.cd=rnd(1,1.7)}return}
  e.f=sgn(dx)||e.f;if(ad>46){e.x=cl(e.x+e.f*chV(60,ad)*dt);e.mv=1}
  if(e.cd<=0&&Math.abs(P.y+P.h-(e.y+e.h))<70&&ad<200){if(!tok(e)){e.cd=.3;return}e.s=ad<76&&Math.random()<.5?'sl':'aim';e.t=0;e.hd=0}}
// ---- 吊顶炮塔(挂在天花板,远程):三连射(瞄准主角)/ 投弹(落地小范围爆炸);沿天花板慢慢滑到主角斜上方 ----
function rtuStep(e,dt){const dm=e.dm,cx=e.x+e.w/2,pc=P.x+12,dx=pc-cx,ad=Math.abs(dx),lo=g8Lo(e),hi=g8Hi(e),cl=v=>Math.max(lo,Math.min(hi-e.w,v));
  e.cd=(e.cd==null?rnd(1,2):e.cd)-dt;e.pz=null;e.mv=0;e.y=RTUY;const s=e.s;if(s)e.t+=dt;
  if(s=='aim'){e.pz='w';e.f=sgn(dx)||e.f;const by=e.y+e.h;if(e.bomb){if(e.t>=.5){e.s='rec';e.t=0;a20Shot(cx,by,0,40,dm,11,520);e.bk=1}}
    else if(e.t>=.45){const k=Math.floor((e.t-.45)/.16);if(k<3&&e.n<=k){e.n=k+1;const a=Math.atan2(P.y+P.h/2-by,dx);a20Shot(cx,by,Math.cos(a)*270,Math.sin(a)*270,dm,8)}if(k>=3){e.s='rec';e.t=0}}return}
  if(s=='rec'){e.pz=e.t<.15?'s':null;if(e.t>.8){e.s=null;e.cd=rnd(1.4,2.2)}return}
  e.f=sgn(dx)||e.f;if(ad>140){e.x=cl(e.x+e.f*chV(46,ad)*dt);e.mv=1}  // 远程令牌只在 170(MRNGR)以内给:超过 140 就滑过去
  if(e.cd<=0&&ad<MRNGR+20){if(!tok(e,1)){e.cd=.4;return}e.s='aim';e.t=0;e.n=0;e.bomb=ad<60&&Math.random()<.6}}
// ---- 首领:金核炮神 ----
function rgInit(){const K=STK();B.esnm=1;B.hp=B.max=Math.round(RGHP*K.hp);B.dm=RGDM*K.atk;B.aim=0;B.od=0;B.ctc=0}
function rgEnd(e,x_){e.act=null;e.mv=0;e.n=0;e.cd=(e.od?.7:1)+Math.random()*.4+(x_||0)}
function rgnStep(e,dt){const pc=P.x+12,cx=e.x+e.w/2,dx=pc-cx,ad=Math.abs(dx),dm=e.dm,od=e.od;e.pz=null;e.mzT=Math.max(0,(e.mzT||0)-dt);e.ctc=(e.ctc||0)-dt;
  if(!e.intro){e.intro=1;banner('金核炮神 · 启动')}
  if(!od&&e.hp<e.max*.5){e.od=1;flash('255,210,90',.3);shake=.4;syn('boom');banner('金核炮神 · 过载!出招更快、炮弹更多')}
  const mzP=()=>{const q=RBT.MZ[RBT.aimI(e.aim)],vs=1.1*(e.bsz||1),s=e.h/vs/52*vs;return [cx+e.f*(q[0]-17)*s,e.y+e.h+(q[1]-72)*s]};
  if(!e.act){e.mv=0;e.cd-=dt;e.f=sgn(dx)||e.f;e.aim=0;
    if(ad<100&&e.ctc<=0&&Math.abs(P.y+P.h-(e.y+e.h))<90){e.act='ctr';e.at=0;e.hd=0;e.n=0;e.ctc=3;return}  // 被靠近:反制
    const wall=e.x<=ARL+12||e.x+e.w>=ARR-12;if(ad<180&&!wall){e.mv=1;e.x=gpCl(e,e.x-e.f*70*dt)}else if(ad>320){e.mv=1;e.x=gpCl(e,e.x+e.f*80*dt)}  // 拉开距离
    if(e.cd>0)return;let Q=['gun','gun','art','beam','drain'];if(ad>240)Q.push('art','art');if(od)Q.push('beam','art');let a=e.nx||pick(Q);e.nx=null;if(a==e.la&&Math.random()<.6)a=pick(Q);
    e.act=a;e.la=a;e.at=0;e.hd=0;e.n=0;return}
  e.at+=dt;const T=e.at,a=e.act;
  if(a=='gun'){const n=od?8:6,W=.55;if(T<W){e.pz='w';e.f=sgn(dx)||e.f;e.aim=Math.atan2(-(P.y+P.h/2-(e.y+e.h*.45)),ad);return}e.pz='s';
    const k=Math.floor((T-W)/.09);if(k<n&&e.n<=k){e.n=k+1;e.mzT=.12;const [mx,my]=mzP(),ang=Math.atan2(P.y+P.h/2-my,pc-mx)+(k-(n-1)/2)*.07;a20Shot(mx,my,Math.cos(ang)*420,Math.sin(ang)*420,dm,5)}
    if(T>W+n*.09+.35)rgEnd(e);return}
  if(a=='art'){e.aim=Math.PI/2;e.f=sgn(dx)||e.f;if(T<.7){e.pz='w';return}e.pz='s';const n=(od?8:5);
    if(!e.hd){e.hd=1;e.mzT=.12;syn('boom');shake=.2;for(let i=0;i<n;i++){const fx=i==0?pc:Math.max(ARL+20,Math.min(ARR-20,pc+rnd(-260,260)));A20M.push({x:fx,t:-.15*i,dm,d:13})}}
    if(T>1.5)rgEnd(e,.2);return}
  if(a=='beam'){if(T<1.1){e.pz='w';e.f=sgn(dx)||e.f;e.aim=0;if(T>.3&&!e.hd){e.hd=1;const [mx]=mzP();A20B.push({y:GY-22,f:e.f,x0:mx,t:0,dm,hit:0})}return}  // 光束贴着地面上方(主角身体高度):要跳起来或站上浮台躲
    e.pz='s';if(T<1.5)e.mzT=.12;if(T>1.9){if(od&&!e.n){e.n=1;e.hd=0;e.at=.25;return}rgEnd(e,.2)}return}  // 过载时连发两次
  if(a=='drain'){if(T<.7){e.pz='w';e.f=sgn(dx)||e.f;e.aim=.4;return}e.pz='s';if(!e.hd){e.hd=1;e.mzT=.12;const [mx,my]=mzP();const g={d:0};for(let i=0;i<3;i++)A20O.push({x:mx,y:my,vx:e.f*(120+i*40),vy:-60+i*60,t:-i*.12,dm,g});syn('blink')}
    if(T>1.3)rgEnd(e);return}
  if(a=='ctr'){e.pz=T<.28?'w':'s';e.aim=-Math.PI/2;if(T>=.28&&!e.hd){e.hd=1;shake=.4;syn('boom');VFX.spawn('earth-rupture',cx,GY,{s:1.6});ring(cx,GY-16,10,130,'#ffd43b',.45,6);if(ad<120&&P.y+P.h>GY-90)hurt(14*dm,{kb:sgn(dx)*560})}
    if(T>.6){e.act='bstep';e.at=0;e.bd=-sgn(dx)||-e.f;e.x0=e.x}return}
  if(a=='bstep'){const u=Math.min(1,T/.45),gy=e.gy||GY-e.h;e.x=gpCl(e,e.x0+e.bd*220*u);e.y=gy-Math.sin(u*Math.PI)*40;if(Math.random()<dt*30)VFX.spawn('smoke-puff',cx,GY-8,{s:.8,a:.8});
    if(T>=.45){e.y=gy;rgEnd(e,-.6);e.nx='gun'}return}
  rgEnd(e)}
// 场上的东西:子弹 / 炸弹、炮火落点(预警 .9 秒后落弹爆炸)、主炮光束(蓄力时是细线,发射时贯穿全场)、虹吸能量球(慢慢追人,打中偷魔力)
function a20Step(dt){const pc=P.x+12;
  for(const b of A20S){b.t+=dt;b.vy+=b.g*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;if(ov(P,{x:b.x-6,y:b.y-5,w:12,h:10})){b.dd=1;A20X.push({x:b.x,y:b.y,t:0,s:.5,k:'hit'});hurt(b.d*b.dm,{kb:sgn(b.vx||1)*180})}
    if(b.g&&b.y>=GY-6){b.dd=1;a20Boom(b.x,GY-14,34,b.dm,b.d)}if(b.t>3||b.y>GY+10||b.x<cam-60||b.x>cam+VW+60)b.dd=1}A20S=A20S.filter(b=>!b.dd);
  for(const m of A20M){m.t+=dt;if(m.t>=.9&&!m.dd){m.dd=1;a20Boom(m.x,GY-20,44,m.dm,m.d)}}A20M=A20M.filter(m=>!m.dd);
  for(const b of A20B){b.t+=dt;if(b.t>=.8&&b.t<1.15&&!b.hit){const inL=b.f>0?pc>b.x0:pc<b.x0;if(inL&&Math.abs(P.y+P.h/2-b.y)<16&&hurt(20*b.dm,{kb:b.f*420}))b.hit=1}if(b.t>=.8&&!b.sn){b.sn=1;syn('zap');shake=Math.max(shake,.3)}}A20B=A20B.filter(b=>b.t<1.25);
  for(const o of A20O){o.t+=dt;if(o.t<0)continue;const a=Math.atan2(P.y+P.h/2-o.y,pc-o.x),sp=Math.min(200,90+o.t*60);o.vx+=(Math.cos(a)*sp-o.vx)*Math.min(1,dt*2.2);o.vy+=(Math.sin(a)*sp-o.vy)*Math.min(1,dt*2.2);o.x+=o.vx*dt;o.y+=o.vy*dt;
    if(ov(P,{x:o.x-7,y:o.y-7,w:14,h:14})){o.dd=1;if(hurt(6*o.dm,{kb:0})){const S=stats(),g=o.g||{d:0},d=Math.max(0,Math.min(Math.round(S.mp*.25/3),Math.round(S.mp*.25)-g.d,Math.floor(P.mp)));g.d+=d;P.mp-=d;if(d)tx('魔力被偷走 -'+d,P.x-20,P.y-30,'#74c0fc');if(B&&B.k=='rgn'&&B.hp>0){B.hp=Math.min(B.max,B.hp+Math.round(B.max*.008))}}}if(o.t>4.5)o.dd=1}A20O=A20O.filter(o=>!o.dd);
  for(const q of A20X)q.t+=dt;A20X=A20X.filter(q=>q.t<.5);
  if(!(B&&B.k=='rgn'&&B.hp>0)){A20M=[];A20B=[];A20O=[]}}
function a20Fx(){const M=RBT;if(!M.I)return;const t=performance.now()/1000,e=B;x.imageSmoothingEnabled=false;
  for(const m of A20M)if(m.t>=0&&m.t<.9){const u=m.t/.9;M.fr(x,'hit',t*10,m.x-cam-11,GY-12,1.5,.5+.5*u);x.save();x.translate(Math.round(m.x-cam),Math.round(-30+(GY-10+30)*u*u));x.rotate(Math.PI/2);M.fr(x,'bl',t*12,-15,-8,2);x.restore()}  // 预警关闭(BWOFF):炮弹从天上落下来 + 落点闪光
  for(const b of A20B){const x0=b.x0-cam,x1=b.f>0?VW+20:-20;if(b.t<.8){x.save();x.globalAlpha=.35+.35*Math.sin(t*30);x.strokeStyle='#ffe066';x.lineWidth=1;x.beginPath();x.moveTo(x0,b.y);x.lineTo(x1,b.y);x.stroke();x.restore()}
    else{const k=1-Math.abs((b.t-.97)/.2);x.save();x.globalCompositeOperation='lighter';x.globalAlpha=Math.max(0,Math.min(1,k+.3));for(let px=Math.min(x0,x1);px<Math.max(x0,x1);px+=30){M.fr(x,'mz',3,px,b.y-20,1.7,1);M.fr(x,'mz',4,px+12,b.y-12,1,1)}x.restore()}}
  for(const b of A20S)M.fr(x,'bl',t*12,b.x-cam-7,b.y-5,1);
  for(const o of A20O)if(o.t>=0){x.save();x.globalCompositeOperation='lighter';M.fr(x,'hit',t*10,o.x-cam-11,o.y-8,1.5);x.restore()}
  for(const q of A20X){if(q.k=='hit')M.fr(x,'hit',q.t/.5*3,q.x-cam-7,q.y-5,1);else M.fr(x,'ex',q.t/.5*6,q.x-cam-27.5*q.s*1.6,q.y-26*q.s*1.6,q.s*1.6)}
  x.imageSmoothingEnabled=true}
// 第十六关首领的怪物技能石
MSS[20]=['金核炮神','炮火覆盖','虚影朝屏幕里最近的 6 个敌人各轰一发炮弹,每发 攻击×3','multi',3,6,'warm-explosion'];
MISC.ms20=['怪物技能石 · 金核炮神',`在背包里左键点它,选择嵌入剑、法杖或拳套(每把武器嵌 1 颗,各自蓄力)。用嵌着它的武器攻击敌人蓄力 ${MSCN} 次后按 <b>N</b>:召唤「金核炮神」的虚影放出「炮火覆盖」——${MSS[20][2]}。第 16 关首领 ${MSDR*100}% 掉落。`,'',0];MENI.P.ms20=41;
