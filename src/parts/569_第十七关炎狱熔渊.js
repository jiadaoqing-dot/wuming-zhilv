// ===== 第五十四轮:第十七关「炎狱熔渊」(第二张地图「暗黑大陆」右下角的熔岩要塞,cur = 21)火焰元素关卡,难度 = 金核机库 ×1.07 =====
// 图集 IFN(art_src/fire21/build_fire21.py):首领 = Golem(Redshrike / William.Thompsonj,CC-BY 4.0)按亮度换成熔岩配色;小怪 = Wartaur(Redshrike,CC-BY 4.0)赤红配色 / Sparky(surt,CC-BY 4.0)原样;
//   三个都来自 Emcee Flesher 整理的 Dark Fantasy Platformer Bestiary;场景 = Warped Caves(ansimuz,CC0)按亮度换成熔岩洞;地上的火焰 / 爆炸 = 已有图集 BFX 的 b-flame / b-firebomb;BGM bgm21 / bgm21b(build_audio.py r54)
// 用户要求:怪物所有技能都是大范围、持久存在的强力 AOE;首领体型目前最大;小怪更密集、韧性更高(e.pzx)、伤害更高
// 地火 I21Z:地面上持续燃烧的火区(踩在里面每 0.45 秒掉一次血,跳起来 / 站浮台不掉);火柱 I21P:地面先冒小火苗 0.8 秒,然后喷出贯穿上下的火柱;陨火 I21M:从天上落下,落地爆炸并留下地火
// 小怪:炎斧兽 ifa(地面近战:举斧劈地 → 前方一片地火 · 跃起砸地 → 落点两侧大片地火)· 火灵 ifs(飞行远程:投下三颗火种 → 三片地火 · 扇形火雨)
// 首领「炎狱巨像」ifg:只有一条命、没有魔力(esnm);熔岩重拳 slam / 炎爆震地 quake(火浪向两边推开)/ 陨火天降 rain / 地火喷柱 pillar / 熔火冲锋 rush(身后留下一路地火)/ 贴身践踏 stomp;
//   生命一半以下「熔核暴走」:地火烧得更久、陨火更多、火柱更多,每 6 秒脚下爆出一圈地火
//   校准:生命 = 金核炮神 2.4M × 1.07;伤害 = 95 × 1.07
const E21=[['ifa',340],['ifs',440],['ifa',540],['ifa',660],['ifs',760],['ifa',860],['ifa',980],['ifs',1080],['ifa',1180],['ifa',1290],['ifs',1390],['ifa',1490],['ifa',1600],['ifs',1700],['ifa',1800],['ifa',1910],['ifs',2010],['ifa',2110],['ifa',2220],['ifs',2320],['ifa',2420],['ifa',2500]];
const PL21=[{x:0,y:GY,w:WW},{x:620,y:222,w:96},{x:1300,y:222,w:96},{x:1960,y:222,w:96},{x:2640,y:206,w:96},{x:3020,y:206,w:96}];  // 浮台:躲地火用,首领场地两块
const IGHP=Math.round(2400000*1.07),IGDM=95*1.07,IFPZ=1.8;  // IFPZ:小怪韧性倍率
const IFN={I:null,D:'@@A:ifn_atlas@@',M:{"gi":[0,0,64,72,64,1],"gw":[0,73,384,72,64,6],"ga":[0,146,384,72,64,6],"ww":[0,219,320,80,80,4],"wa":[0,300,400,80,80,5],"sp":[0,381,64,16,16,4],"fb":[0,398,80,16,16,5],"bk":[0,415,240,176,240,1],"md":[0,592,272,176,272,1],"gnd":[0,769,32,32,32,1],"plt":[0,802,32,22,32,1]},
  init(){const im=new Image();im.onload=()=>{this.I=im};im.src=this.D},
  on(e){return !!this.I&&(e.k=='ifa'||e.k=='ifs'||e.k=='ifg')},
  fr(c,k,i,X,Y,s,a,r){const m=this.M[k];if(!m||!this.I)return;const fw=m[4],n=m[5];i=((Math.floor(i)%n)+n)%n;c.save();c.imageSmoothingEnabled=false;if(a!=null)c.globalAlpha*=a;
    if(r){c.translate(Math.round(X+fw*s/2),Math.round(Y+m[3]*s/2));c.rotate(r);c.drawImage(this.I,m[0]+i*fw,m[1],fw,m[3],-fw*s/2,-m[3]*s/2,fw*s,m[3]*s)}else c.drawImage(this.I,m[0]+i*fw,m[1],fw,m[3],Math.round(X),Math.round(Y),fw*s,m[3]*s);c.restore()},
  // 怪物:c 已经平移到脚底中间、按朝向翻转(面朝右)
  draw(c,e,t){const vs=e.max?1.1*(e.bsz||1):(e.vs||1),H=e.h/vs;c.save();if(FLW)c.filter='brightness(2.6)';
    if(e.k=='ifg'){const s=H/58,a=e.act,T=e.at||0;let k='gi',i=0;
      if(a=='slam'||a=='rain'||a=='pillar'){k='ga';i=e.pz=='w'?(T<.35?1:2):3}else if(a=='quake'||a=='stomp'){k='ga';i=e.pz=='w'?(T<.25?4:5):3}
      else if(a=='rush'||e.mv){k='gw';i=t*(a=='rush'?14:7)}
      this.fr(c,k,i,-22*s,-72*s,s)}
    else if(e.k=='ifa'){const s=H/44,st=e.s;let k='ww',i=e.mv?t*9:0;if(st=='aim'||st=='jw')i=0,k='wa';else if(st=='sw'||st=='js')k='wa',i=1+Math.min(2,e.t/.08);else if(st=='rec')k='wa',i=4;this.fr(c,k,i,-32*s,-80*s,s)}
    else if(e.k=='ifs'){const s=H/16;this.fr(c,'sp',t*(e.s=='aim'||e.s=='rn'?16:9),-8*s,-16*s,s)}
    c.restore()},
  // 场景:熔岩火林远景(视差 .25)+ 焦黑岩壁(.55,两张交替翻转)+ 岩块地面 / 浮台
  bg(){const I=this.I,M=this.M;x.fillStyle='#2e0a0c';x.fillRect(0,0,VW,VH);if(!I)return;x.imageSmoothingEnabled=false;
    {const m=M.bk,s=VH/m[3]*1.05,w=m[2]*s,o=((cam*.25)%w+w)%w;for(let px=-o;px<VW;px+=w)x.drawImage(I,m[0],m[1],m[2],m[3],Math.floor(px),-8,Math.ceil(w),m[3]*s);x.fillStyle='rgba(16,3,6,.62)';x.fillRect(0,0,VW,VH)}  // 远景压暗:让熔岩配色的怪物从背景里跳出来
    {const m=M.md,s=1.7,w=m[2]*s,o=((cam*.55)%(w*2)+w*2)%(w*2);x.filter='brightness(.45) saturate(.8)';for(let px=-o,k=0;px<VW;px+=w,k++){x.save();x.translate(Math.floor(px)+(k%2?w:0),GY-m[3]*s+40);if(k%2)x.scale(-1,1);x.drawImage(I,m[0],m[1],m[2],m[3],0,0,Math.ceil(w),m[3]*s);x.restore()}x.filter='none'}
    {const t=performance.now()/1000;x.save();x.globalCompositeOperation='lighter';x.globalAlpha=.07+.04*Math.sin(t*1.7);x.fillStyle='#ff6a1a';x.fillRect(0,GY-90,VW,90);x.restore()}  // 地面附近的火光(只是给已有贴图加一层亮度,不画形状)
    {const m=M.gnd;for(let px=Math.floor((cam-4)/32)*32;px<cam+VW+4;px+=32){x.drawImage(I,m[0],m[1],32,32,Math.round(px-cam),GY-4,32,32);x.drawImage(I,m[0],m[1]+16,32,16,Math.round(px-cam),GY+28,32,32)}}
    {const m=M.plt;for(const p of PL)if(p.y<GY&&p.x-cam<VW+20&&p.x+p.w-cam>-20){for(let q=0;q<p.w;q+=32){const w=Math.min(32,p.w-q);x.drawImage(I,m[0],m[1],w,m[3],Math.round(p.x+q-cam),Math.round(p.y-4),w,m[3])}}}}};
IFN.init();
let I21Z=[],I21P=[],I21M=[],I21F=[];  // 地火 · 火柱 · 陨火 · 火灵的火种 / 火雨
function i21Clr(){I21Z=[];I21P=[];I21M=[];I21F=[]}
const i21Od=()=>B&&B.k=='ifg'&&B.od?1:0;
// 地火:x0 ~ x1(会被首领场地 / 世界边界夹住),life 秒;同一时间只算一次伤害(P.i21T)
const i21Zone=(x0,x1,life,dm,d)=>{x0=Math.max(0,x0);x1=Math.min(WW,x1);if(x1-x0<8)return;I21Z.push({x0,x1,t:0,life,dm,d});if(I21Z.length>40)I21Z.shift()};
const i21Pil=(px,dm,d,dl)=>I21P.push({x:px,t:-(dl||0),dm,d,hit:0});
const i21Met=(px,dm,d,dl,zl)=>I21M.push({x:px,y:-30-rnd(0,40),vy:120,t:-(dl||0),dm,d,zl:zl||3.5,tx:px});
const i21Boom=(bx,r,dm,d)=>{VFX.spawn('b-firebomb',bx,GY-12,{s:r/30});syn('boom');shake=Math.max(shake,.25);const pc=P.x+12;if(Math.abs(pc-bx)<r&&P.y+P.h>GY-r*.9)hurt(d*dm,{kb:sgn(pc-bx)*300})};
// ---- 炎斧兽(地面近战):举斧劈地 → 前方地火 · 跃起砸地 → 落点两侧大片地火 ----
function ifaStep(e,dt){const dm=e.dm,cx=e.x+e.w/2,pc=P.x+12,dx=pc-cx,ad=Math.abs(dx),lo=g8Lo(e),hi=g8Hi(e),cl=v=>Math.max(lo,Math.min(hi-e.w,v));
  e.cd=(e.cd==null?rnd(.6,1.2):e.cd)-dt;e.pz=null;e.mv=0;const s=e.s;if(s)e.t+=dt;
  if(s=='aim'){e.pz='w';e.f=sgn(dx)||e.f;if(e.t>=.5){e.s='sw';e.t=0;e.hd=0}return}
  if(s=='sw'){e.pz='s';if(!e.hd&&e.t>=.12){e.hd=1;const fx=cx+e.f*34;i21Boom(fx,46,dm,15);i21Zone(fx+(e.f>0?-20:-130),fx+(e.f>0?130:20),3.5,dm,5)}if(e.t>.35){e.s='rec';e.t=0}return}
  if(s=='jw'){e.pz='w';e.f=sgn(dx)||e.f;if(e.t>=.4){e.s='js';e.t=0;e.hd=0;e.x0=e.x;e.jx=cl(e.x+Math.max(-170,Math.min(170,dx)))}return}
  if(s=='js'){e.pz='s';const u=Math.min(1,e.t/.5);e.x=e.x0+(e.jx-e.x0)*u;e.y=GY-e.h-Math.sin(u*Math.PI)*70;if(u>=1&&!e.hd){e.hd=1;e.y=GY-e.h;const fx=e.x+e.w/2;i21Boom(fx,62,dm,17);i21Zone(fx-110,fx+110,4,dm,5)}if(e.t>.6){e.s='rec';e.t=0}return}
  if(s=='rec'){if(e.t>.55){e.s=null;e.cd=rnd(.9,1.5)}return}
  e.f=sgn(dx)||e.f;if(ad>50){e.x=cl(e.x+e.f*chV(66,ad)*dt);e.mv=1}
  if(e.cd<=0&&Math.abs(P.y+P.h-(e.y+e.h))<80&&ad<220){if(!tok(e)){e.cd=.3;return}e.s=ad>90&&Math.random()<.45?'jw':'aim';e.t=0;e.hd=0}}
// ---- 火灵(飞行远程):投下三颗火种(落地变成三片地火)· 扇形火雨(五颗,落地小爆炸 + 小片地火)----
function ifsStep(e,dt){const dm=e.dm,cx=e.x+e.w/2,pc=P.x+12,dx=pc-cx,ad=Math.abs(dx),lo=g8Lo(e),hi=g8Hi(e),cl=v=>Math.max(lo,Math.min(hi-e.w,v));
  e.cd=(e.cd==null?rnd(.8,1.6):e.cd)-dt;e.pz=null;e.mv=0;e.y=e.by+Math.sin(performance.now()/400+e.ph)*6;const s=e.s;if(s)e.t+=dt;
  if(s=='aim'){e.pz='w';e.f=sgn(dx)||e.f;if(e.t>=.5){e.s='rec';e.t=0;for(let i=-1;i<=1;i++)I21F.push({x:cx,y:e.y+e.h,vx:i*70+dx*.4,vy:-40,g:420,dm,d:9,zw:70,zl:4});syn('proj')}return}
  if(s=='rn'){e.pz=e.t<.45?'w':'s';if(e.t>=.45&&!e.hd){e.hd=1;for(let i=0;i<5;i++){const a=Math.PI/2+(i-2)*.32;I21F.push({x:cx,y:e.y+e.h,vx:Math.cos(a)*160+e.f*30,vy:Math.sin(a)*160,g:200,dm,d:7,zw:44,zl:3})}syn('proj')}if(e.t>.8){e.s='rec';e.t=0}return}
  if(s=='rec'){if(e.t>.7){e.s=null;e.cd=rnd(1.2,2)}return}
  e.f=sgn(dx)||e.f;if(ad>120){e.x=cl(e.x+e.f*chV(52,ad)*dt);e.mv=1}  // 远程令牌只在 170(MRNGR)以内给:超过 120 就飞过去
  if(e.cd<=0&&ad<MRNGR+20){if(!tok(e,1)){e.cd=.4;return}e.s=ad<70&&Math.random()<.5?'rn':'aim';e.t=0;e.hd=0}}
// ---- 首领:炎狱巨像 ----
function igInit(){const K=STK();B.esnm=1;B.hp=B.max=Math.round(IGHP*K.hp);B.dm=IGDM*K.atk;B.od=0;B.stc=0;B.avT=6}
function igEnd(e,x_){e.act=null;e.mv=0;e.n=0;e.cd=(e.od?.8:1.15)+Math.random()*.4+(x_||0)}
function ifgStep(e,dt){const pc=P.x+12,cx=e.x+e.w/2,dx=pc-cx,ad=Math.abs(dx),dm=e.dm,od=e.od,zl=od?6:4.5;e.pz=null;e.stc=(e.stc||0)-dt;
  if(!e.intro){e.intro=1;banner('炎狱巨像 · 苏醒')}
  if(!od&&e.hp<e.max*.5){e.od=1;flash('255,120,40',.35);shake=.5;syn('boom');banner('炎狱巨像 · 熔核暴走!地火更久、陨火更多')}
  if(od){e.avT-=dt;if(e.avT<=0){e.avT=6;i21Boom(cx,90,dm,10);i21Zone(cx-150,cx+150,zl,dm,6)}}
  if(!e.act){e.cd-=dt;e.f=sgn(dx)||e.f;e.mv=0;
    if(ad<e.w/2+50&&e.stc<=0&&P.y+P.h>GY-120){e.act='stomp';e.at=0;e.hd=0;e.stc=3.5;return}  // 贴身:践踏
    if(ad>e.w/2+70){e.mv=1;e.x=gpCl(e,e.x+e.f*42*dt)}
    if(e.cd>0)return;let Q=['slam','slam','quake','rain','pillar','rush'];if(ad>220)Q.push('rain','pillar','rush');if(od)Q.push('quake','rain');let a=pick(Q);if(a==e.la&&Math.random()<.6)a=pick(Q);
    e.act=a;e.la=a;e.at=0;e.hd=0;e.n=0;return}
  e.at+=dt;const T=e.at,a=e.act;
  if(a=='slam'){if(T<.75){e.pz='w';e.f=sgn(dx)||e.f;return}e.pz='s';if(!e.hd){e.hd=1;const fx=cx+e.f*(e.w/2+30);i21Boom(fx,80,dm,22);i21Zone(fx-(e.f>0?40:240),fx+(e.f>0?240:40),zl,dm,7);VFX.spawn('earth-rupture',fx,GY,{s:1.8})}
    if(T>1.25)igEnd(e);return}
  if(a=='quake'){if(T<.7){e.pz='w';return}e.pz='s';const k=Math.floor((T-.7)/.14);if(e.n<=k&&k<6){e.n=k+1;if(!k){shake=.5;syn('boom');i21Boom(cx,100,dm,18)}const r0=e.w/2+k*70;for(const sd of [-1,1]){const fx=cx+sd*(r0+35);VFX.spawn('b-firebomb',fx,GY-10,{s:1.1});i21Zone(fx-38,fx+38,zl-k*.3,dm,7)}}  // 火浪一节一节往两边推开
    if(T>1.8)igEnd(e,.2);return}
  if(a=='rain'){if(T<.8){e.pz='w';e.f=sgn(dx)||e.f;return}e.pz='s';if(!e.hd){e.hd=1;shake=.25;syn('boom');const n=od?10:7;for(let i=0;i<n;i++){const fx=i==0?pc:i==1?pc+rnd(-90,90):Math.max(ARL+20,Math.min(ARR-20,pc+rnd(-300,300)));i21Met(fx,dm,16,.12*i,zl-1)}}
    if(T>1.6)igEnd(e,.2);return}
  if(a=='pillar'){if(T<.6){e.pz='w';return}e.pz='s';const n=od?6:4,k=Math.floor((T-.6)/.32);if(e.n<=k&&k<n){e.n=k+1;i21Pil(Math.max(ARL+20,Math.min(ARR-20,pc+(k%2?rnd(-60,60):0))),dm,14)}
    if(T>.6+n*.32+.6)igEnd(e,.3);return}
  if(a=='rush'){if(T<.6){e.pz='w';e.f=sgn(dx)||e.f;e.x0=e.x;return}e.pz='s';e.mv=1;const ox=e.x;e.x=gpCl(e,e.x+e.f*260*dt);const back=cx-e.f*(e.w/2);if(!e.hd||Math.abs(back-e.lz)>60){e.hd=1;e.lz=back;i21Zone(back-34,back+34,zl,dm,6)}
    if(!e.rh&&ov(P,e)&&hurt(18*dm,{kb:e.f*480}))e.rh=1;if(T>1.7||e.x==ox&&T>.8){e.rh=0;shake=.3;syn('boom');i21Boom(cx+e.f*e.w/2,70,dm,12);igEnd(e,.2)}return}
  if(a=='stomp'){e.pz=T<.4?'w':'s';if(T>=.4&&!e.hd){e.hd=1;shake=.45;i21Boom(cx,e.w/2+80,dm,16);i21Zone(cx-e.w/2-120,cx+e.w/2+120,zl*.7,dm,6);if(ad<e.w/2+90)hurt(4*dm,{kb:sgn(dx)*620})}if(T>.9)igEnd(e,-.3);return}
  igEnd(e)}
// 场上的火:地火 / 火柱 / 陨火 / 火种 / 火雨
function i21Step(dt){const pc=P.x+12,onG=P.y+P.h>=GY-4;P.i21T=(P.i21T||0)-dt;
  for(const z of I21Z){z.t+=dt;if(onG&&P.i21T<=0&&z.t>.15&&z.t<z.life-.2&&pc>z.x0&&pc<z.x1&&hurt(z.d*z.dm,{kb:0}))P.i21T=.45}I21Z=I21Z.filter(z=>z.t<z.life);
  for(const p of I21P){p.t+=dt;if(p.t>=0&&p.t<.8&&!p.w0){p.w0=1;syn('blink')}if(p.t>=.8&&!p.sn){p.sn=1;syn('boom');shake=Math.max(shake,.25)}if(p.t>=.8&&p.t<3.2&&Math.abs(pc-p.x)<24&&P.i21T<=0&&hurt(p.d*p.dm,{kb:sgn(pc-p.x)*260}))P.i21T=.45}I21P=I21P.filter(p=>p.t<3.4);
  for(const m of I21M){m.t+=dt;if(m.t<0)continue;m.vy+=520*dt;m.y+=m.vy*dt;if(m.y>=GY-14){m.dd=1;i21Boom(m.x,56,m.dm,m.d);i21Zone(m.x-60,m.x+60,m.zl,m.dm,6)}}I21M=I21M.filter(m=>!m.dd);
  for(const f of I21F){f.vy+=f.g*dt;f.x+=f.vx*dt;f.y+=f.vy*dt;if(ov(P,{x:f.x-6,y:f.y-6,w:12,h:12})){f.dd=1;hurt(f.d*f.dm,{kb:sgn(f.vx||1)*160});VFX.spawn('b-firebomb',f.x,f.y+8,{s:.6})}
    else if(f.y>=GY-6){f.dd=1;VFX.spawn('b-firebomb',f.x,GY-6,{s:.7});i21Zone(f.x-f.zw,f.x+f.zw,f.zl,f.dm,5)}if(f.x<cam-80||f.x>cam+VW+80)f.dd=1}I21F=I21F.filter(f=>!f.dd);
  if(bossOn&&!(B&&B.k=='ifg'&&B.hp>0)){I21P=[];I21M=[]}}
function i21Fx(){const t=performance.now()/1000;if(!VFX.ok()||!VFX.I3)return;x.imageSmoothingEnabled=false;
  for(const z of I21Z){const a=Math.min(1,z.t/.2,(z.life-z.t)/.4);if(a<=0)continue;for(let px=z.x0+6,i=0;px<z.x1-2;px+=12,i++){const sx=px-cam;if(sx<-20||sx>VW+20)continue;VFX.frame(x,'b-flame',Math.floor(t*12+i*1.7)%5,sx,GY+2,1.05+(i%3)*.18,1,0,a)}}
  for(const p of I21P){const sx=p.x-cam;if(p.t<0)continue;if(p.t<.8){for(let k=-1;k<=1;k++)VFX.frame(x,'b-flame',Math.floor(t*14+k)%5,sx+k*9,GY+2,.6+p.t*.5,1,0,.7)}
    else{const a=Math.min(1,(3.2-p.t)/.3);x.save();x.globalCompositeOperation='lighter';for(let y=GY+2,k=0;y>-20;y-=52,k++)VFX.frame(x,'b-flame',Math.floor(t*14+k)%5,sx,y,2.4,k%2?-1:1,0,a,1.75);x.restore()}}
  for(const m of I21M)if(m.t>=0){IFN.fr(x,'fb',1,m.x-cam-16,m.y-16,2.2,1,Math.PI/2);if(m.y<GY-40)VFX.frame(x,'b-flame',Math.floor(t*14)%5,m.x-cam,GY+2,.55,1,0,.5+.4*Math.sin(t*20))}  // 预警关闭(BWOFF):陨火从天上落下来 + 落点冒小火苗
  for(const f of I21F)IFN.fr(x,'fb',Math.floor(t*12)%2?0:1,f.x-cam-12,f.y-12,1.5,1,Math.atan2(f.vy,f.vx));
  x.imageSmoothingEnabled=true}
// 第十七关首领的怪物技能石
MSS[21]=['炎狱巨像','陨火天降','虚影朝屏幕里最近的 6 个敌人各砸下一颗陨火,每颗 攻击×3','multi',3,6,'warm-explosion'];
MISC.ms21=['怪物技能石 · 炎狱巨像',`在背包里左键点它,选择嵌入剑、法杖或拳套(每把武器嵌 1 颗,各自蓄力)。用嵌着它的武器攻击敌人蓄力 ${MSCN} 次后按 <b>N</b>:召唤「炎狱巨像」的虚影放出「陨火天降」——${MSS[21][2]}。第 17 关首领 ${MSDR*100}% 掉落。`,'',0];MENI.P.ms21=41;
