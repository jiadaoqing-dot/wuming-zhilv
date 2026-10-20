// ===== 第五十九轮:神秘副本 5「擎天魔神」(cur = MY5 = 35)+ 紫焰魅影武器(it.fw = 3)=====
// 用户:按目前的属性(生命 4.5 万 / 攻击 1 万 / 防御 5233 / 暴击 115% / 闪避 27.7%)做神秘地带 5 的首领;体型高到接近太空,技能范围大;
//   只有三星掉目前最强的武器(攻击 = 真~火之武器 ×2.2);首领死后 2 秒自爆,秒杀一切,要卡无敌时间躲开
// 图集 PPF(art_src/ppf/build_ppf.py):首领 = Boss: Minotaur(chierit,CC-BY 4.0)换成紫焰配色;紫色火焰 = N64 Fire(n64guy,CC0);武器 / 图标 = 真~火之武器换成紫色
// 首领 pfg:画面高 PFVH(脚底在地面,头顶差不多碰到画面顶),判定框只取身体中段;不会被击退 / 浮空;没有魔力(esnm)
// 招式(范围都很大):巨斧横扫 cleave(面前 430 像素的低位横扫,跳起来躲)· 震地 slam(两道贴地紫焰浪冲向两边,跳过去)·
//   紫焰陨落 rain(满场落火,落点地上先冒小火苗)· 焰柱 pillar(主角脚下 + 两边冒出通天火柱,火苗预警 0.9 秒)· 二阶段(生命 < 50%):更快、更多
// 自爆:生命归零后不会马上结算,PFSD 秒倒计时后全屏爆炸 —— 主角此刻没有无敌(P.inv / 技能无敌 P.sk.inv)就直接倒下(复活药水救起来以后照样结算)
const MY5=35,PFVH=340,PFSD=2,PFDR=.3;  // PFDR:三星掉紫焰魅影武器的几率(双倍爆率卡翻倍)
// 数值(按用户截图的属性校准:四件大师二阶邪灵 + 真~火之武器,把 stats 换成截图数字,对着不动的首领连放技能 40 秒 → 剑 2.5 万 / 法杖 6 万 每秒):
//   三星生命 300 万 ≈ 法杖纯输出 50 秒、剑 2 分钟(实战要躲招,大约翻倍);攻击 dm 360 → 巨斧横扫约 1.09 万(截图生命的 24%)、震地浪 9400、陨火 5100
const PFHP=[0,1000000,1800000,3000000],PFDM=[0,190,260,360];
const PPF={I:null,D:'@@A:ppf_atlas@@',M:{"g_i":[0,0,204,122,16,134,119],"g_w":[0,123,204,122,12,134,119],"g_a":[0,246,204,122,16,134,119],"sw":[0,369,74,19,1,0,0],"st":[0,389,76,76,1,0,0],"ic":[0,466,34,34,2,0,0],"fr":[0,501,16,16,15,0,0],"ff":[0,518,32,32,15,0,0]},
  init(){const im=new Image();im.onload=()=>{this.I=im};im.src=this.D},
  on(e){return !!this.I&&e.k=='pfg'},
  fr(c,n,i,X,Y,h,a){const m=this.M[n];if(!m||!this.I)return;const s=h/m[6];i=Math.max(0,Math.min(m[4]-1,Math.floor(i)));c.save();c.imageSmoothingEnabled=false;if(a!=null)c.globalAlpha*=a;
    c.drawImage(this.I,m[0]+i*m[2],m[1],m[2],m[3],Math.round(X-m[5]*s),Math.round(Y-m[6]*s),m[2]*s,m[3]*s);c.restore()},
  // 火焰帧:n = 'fr'(单团火苗)/ 'ff'(一片火墙),脚底中点 (X, Y),宽 w 高 h
  fl(c,n,i,X,Y,w,h){const m=this.M[n];if(!this.I)return;i=((Math.floor(i)%m[4])+m[4])%m[4];c.drawImage(this.I,m[0]+i*m[2],m[1],m[2],m[3],Math.round(X-w/2),Math.round(Y-h),Math.round(w),Math.round(h))},
  // 首领:c 已经平移到脚底中间、按朝向翻转(原图面朝右)
  draw(c,e,t){const vs=1.1*(e.bsz||1),H=PFVH/vs,a=e.act,T=e.at||0,w=e.pz=='w';let n='i',i=t*8;
    if(a=='cleave'){n='a';i=T<PCW?T/PCW*9:9+(T-PCW)/.07}else if(a=='slam'){n='a';i=w?Math.min(3,T*5):9+(T-PSW)/.07}else if(a){n='a';i=Math.min(3,T*7)}else if(e.mv){n='w';i=t*8}
    c.save();if(FLW)c.filter='brightness(2.2)';c.save();c.globalCompositeOperation='lighter';  // 身上的紫焰(火苗跟着呼吸起伏)
    for(let j=0;j<PFBF.length;j++){const q=PFBF[j],s=H*q[2]*(1+.12*Math.sin(t*5+j));c.globalAlpha=e.od?.95:.7;this.fl(c,'fr',t*15+j*4,q[0]*H,q[1]*H,s,s*1.2)}
    c.globalAlpha=.6;for(let k=-3;k<=3;k++)this.fl(c,'ff',t*15+k*5,k*H*.09,4,H*.12,H*.12);c.restore();
    if(e.od){c.save();c.globalCompositeOperation='lighter';c.globalAlpha=.3+.15*Math.sin(t*6);this.fr(c,'g_'+n,i,0,0,H*1.02);c.restore()}
    this.fr(c,'g_'+n,i,0,0,H);c.restore()},
  // 选关页卡片的肖像
  pt(c,cx,by,h,t){this.fr(c,'g_i',t*8,cx,by,h)}};
PPF.init();
const PFBF=[[-.16,-.78,.13],[.1,-.84,.12],[.26,-.6,.11],[-.25,-.5,.1],[.3,-.32,.1],[-.08,-.25,.1],[.05,-.55,.09]];  // 身上火苗的位置(按高度的比例)
const PCW=1.1,PSW=1.2;  // 巨斧横扫 / 震地的蓄力时间
let PFW=[],PFM=[],PFP=[],PFB=[];  // 贴地火浪 / 陨火 / 焰柱 / 一片火(横扫、爆炸的画面)
function pfgClr(){PFW=[];PFM=[];PFP=[];PFB=[]}
function pfgNew(LM){return {k:'pfg',x:2985,y:GY-300,w:130,h:300,hp:1,max:1,fl:0,f:-1,cd:2.6,act:null,dm:1,lm:LM}}
function pfgInit(){const s=Math.max(1,Math.min(3,LVSTAR));B.hp=B.max=PFHP[s];B.dm=PFDM[s];B.def=90;B.esnm=1;B.od=0;B.gy=B.y;B.sdT=null;B.sdOK=0;pfgClr()}
function pfgEnd(e,x_){e.act=null;e.mv=0;e.n=0;e.hd=0;e.cd=(e.od?.7:1.05)+Math.random()*.45+(x_||0)}
const pfgBand=(x0,x1,life)=>PFB.push({x0:Math.max(ARL,x0),x1:Math.min(ARR,x1),t:0,life});
function pfgStep(e,dt){const pc=P.x+12,cx=e.x+e.w/2,dx=pc-cx,ad=Math.abs(dx),od=e.od;e.pz=null;e.st=0;e.air=0;e.kbv=0;e.y=e.gy;
  if(!e.intro){e.intro=1;banner('擎天魔神 · 它的头顶已经碰到了星空');syn('boom');shake=.5}
  if(!od&&e.hp<e.max*.5){e.od=1;flash('190,90,255',.4);shake=.7;syn('boom');banner('擎天魔神 · 紫焰燃遍了天穹!招式更快、更多')}
  if(!e.act){e.cd-=dt*(od?1.3:1);e.f=sgn(dx)||e.f;e.mv=0;
    if(ad>e.w/2+260){const nx=Math.max(2930,Math.min(3030,e.x+e.f*34*dt));if(nx!=e.x){e.x=nx;e.mv=1}}  // 慢慢挪向主角(只在场地右半边)
    if(e.cd>0)return;const Q=['cleave','slam','rain','pillar'];if(ad<e.w/2+400)Q.push('cleave');if(od)Q.push('rain','pillar');let a=pick(Q);if(a==e.la&&Math.random()<.65)a=pick(Q);
    e.act=a;e.la=a;e.at=0;e.hd=0;e.n=0;if(a=='rain'||a=='pillar')bsfx('b_moo');return}
  e.at+=dt;const T=e.at,a=e.act,dm=e.dm;
  // 巨斧横扫:面前 430 像素、离地 70 像素以内都会被扫到(跳起来躲);二阶段扫两下
  if(a=='cleave'){if(T<PCW){e.pz='w';if(T<.7)e.f=sgn(dx)||e.f;return}
    if(!e.hd){e.hd=1;shake=.6;syn('slam');bsfx('b_axe');const x0=cx+e.f*20,x1=cx+e.f*450;pfgBand(Math.min(x0,x1),Math.max(x0,x1),.45);
      if(pc>Math.min(x0,x1)&&pc<Math.max(x0,x1)&&P.y+P.h>GY-70)hurt(30*dm,{kb:e.f*620})}
    if(T>PCW+.55){if(od&&!e.n){e.n=1;e.at=PCW-.45;e.hd=0;return}pfgEnd(e)}return}
  // 震地:两道贴地紫焰浪冲向两边(二阶段 0.5 秒后再来一道)
  if(a=='slam'){if(T<PSW){e.pz='w';return}
    if(!e.hd){e.hd=1;shake=.8;syn('boom');bsfx('b_stomp');flash('160,80,255',.2);for(const sd of [-1,1]){PFW.push({x:cx+sd*e.w/2,v:sd*430,t:0,d:26*dm});if(od)PFW.push({x:cx+sd*e.w/2,v:sd*430,t:-.5,d:26*dm})}}
    if(T>PSW+.7)pfgEnd(e,.2);return}
  // 紫焰陨落:满场落火,一定有一团落在主角头上
  if(a=='rain'){if(T<.7){e.pz='w';return}
    if(!e.hd){e.hd=1;syn('boom');const n=od?16:10,L=[pc];for(let i=1;i<n;i++)L.push(rnd(ARL+20,cx-30));L.forEach((px,i)=>PFM.push({x:Math.max(ARL+12,Math.min(ARR-12,px)),y:-40-rnd(0,60),vy:340,t:-i*.1,d:14*dm}))}
    if(T>2.6)pfgEnd(e,.2);return}
  // 焰柱:主角脚下先冒火苗(0.9 秒),然后通天火柱;两边每隔 120 像素再冒
  if(a=='pillar'){if(T<.6){e.pz='w';return}
    if(!e.hd){e.hd=1;const n=od?5:3;for(let i=0;i<n;i++){const k=Math.ceil(i/2)*(i%2?1:-1);PFP.push({x:Math.max(ARL+20,Math.min(cx-40,pc+k*120)),t:-.9-i*.18,d:22*dm,h:0})}}
    if(T>2.6)pfgEnd(e,.3);return}
  pfgEnd(e)}
// 场上的东西(首领倒下以后也继续推进,直到自爆清场)
function pfgTick(dt){const pc=P.x+12,onG=P.y+P.h>=GY-34;
  for(const w of PFW){w.t+=dt;if(w.t<0)continue;w.x+=w.v*dt;if(!w.h&&onG&&Math.abs(pc-w.x)<20&&hurt(w.d,{kb:sgn(w.v)*380}))w.h=1}PFW=PFW.filter(w=>w.t<0||w.x>ARL-40&&w.x<ARR+40);
  for(const m of PFM){m.t+=dt;if(m.t<0)continue;m.vy+=500*dt;m.y+=m.vy*dt;if(!m.h&&Math.abs(pc-m.x)<16&&m.y>P.y-6&&m.y<P.y+P.h+6&&hurt(m.d,{kb:sgn(pc-m.x)*200}))m.h=1;
    if(m.y>=GY-4&&!m.g){m.g=1;shake=Math.max(shake,.12);burst(m.x,GY-6,8,['#e599f7','#9c36b5','#fff'],160,{s:2,l:.35});PFB.push({x0:m.x-18,x1:m.x+18,t:0,life:.35})}}PFM=PFM.filter(m=>!m.g);
  for(const p of PFP){p.t+=dt;if(p.t>=0&&!p.hd){p.hd=1;shake=Math.max(shake,.25);syn('boom')}if(p.t>=0&&p.t<.6&&!p.h&&Math.abs(pc-p.x)<24&&hurt(p.d,{kb:sgn(pc-p.x)*260}))p.h=1}PFP=PFP.filter(p=>p.t<.7);
  for(const b of PFB)b.t+=dt;PFB=PFB.filter(b=>b.t<b.life)}
// 自爆:update 里首领生命归零后先走这里(B.sdOK 之前不结算)
function pfgSD(dt){const e=B;
  if(e.sdT==null){e.sdT=0;e.act=null;PFW=[];PFM=[];PFP=[];banner('擎天魔神的身体开始崩裂……'+PFSD+' 秒后自爆!用带无敌的技能躲过去!');syn('boom');flash('200,120,255',.3)}
  e.sdT+=dt;shake=Math.max(shake,.12+e.sdT*.18);
  if(e.sdT<PFSD)return;
  e.sdOK=1;flash('255,240,255',1);shake=1.4;syn('boom');bsfx('b_stomp');E=[];pfgBand(ARL,ARR,.9);
  for(let i=0;i<5;i++)ring(e.x+e.w/2,GY-120,10,120+i*90,'#e599f7',.6+i*.08,6);
  if(GM.god||P.inv>0||(P.sk&&P.sk.inv)){tx('躲过了自爆!',P.x-24,P.y-40,'#e5dbff');banner('你在爆炸的那一瞬间躲开了……擎天魔神化成了漫天紫焰')}
  else{tx('-'+Math.ceil(P.hp),P.x+12,P.y-6,'#fff','d');P.hp=0;banner('擎天魔神的自爆吞没了一切……(用复活药水还能领取奖励)')}}
// 画:贴地火浪 / 陨火(落点地上先冒小火苗)/ 焰柱 / 横扫和爆炸的一片火;首领倒下后的自爆倒计时也在这里画(那时 drawE 不画首领了)
function pfgFx(){const t=performance.now()/1000;if(!PPF.I)return;x.save();x.imageSmoothingEnabled=false;x.globalCompositeOperation='lighter';
  for(const w of PFW)if(w.t>=0)for(let k=0;k<3;k++)PPF.fl(x,'ff',t*15+k*4,w.x-cam-sgn(w.v)*k*18,GY+2,40-k*6,46-k*10);
  for(const m of PFM){if(m.t>-.7){x.globalAlpha=.5+.3*Math.sin(t*14);PPF.fl(x,'fr',t*15,m.x-cam,GY,12,14);x.globalAlpha=1}if(m.t>=0)PPF.fl(x,'fr',t*20+m.x,m.x-cam,m.y+16,40,54)}
  for(const p of PFP){if(p.t<0){x.globalAlpha=.55+.35*Math.sin(t*16);PPF.fl(x,'fr',t*15,p.x-cam,GY,18,20);x.globalAlpha=1}
    else{const k=Math.min(1,p.t*8)*(p.t>.45?Math.max(0,(.7-p.t)/.25):1);x.globalAlpha=k;for(let y=GY+4;y>GY-280;y-=30)PPF.fl(x,'ff',t*15+y,p.x-cam,y,46,34);x.globalAlpha=1}}
  for(const b of PFB){const k=1-b.t/b.life;x.globalAlpha=k;for(let X=b.x0;X<b.x1;X+=26)PPF.fl(x,'ff',t*15+X,X+13-cam,GY+4,30,40+30*k)}x.globalAlpha=1;x.restore();
  const e=B;if(cur==MY5&&e&&e.k=='pfg'&&e.hp<=0&&e.sdT!=null&&!e.sdOK&&bossOn){const k=e.sdT/PFSD,cx=e.x+e.w/2-cam;  // 自爆倒计时:首领发抖、越来越亮
    x.save();x.translate(Math.round(cx+rnd(-1,1)*(2+k*6)),GY);x.scale(e.f*1.1,1.1);x.filter='brightness('+(1+k*1.8)+')';PPF.draw(x,Object.assign({},e,{act:null,mv:0,od:1}),t);x.restore();
    x.fillStyle='rgba(230,200,255,'+(k*k*.55)+')';x.fillRect(0,0,VW,VH);
    CT('自爆 '+Math.max(0,PFSD-e.sdT).toFixed(1)+' 秒',320,120,22,'#fff','center',3.2,'#5f1d8a');CT('用带无敌的技能(冲刺 / 闪现 / 落雷……)躲过爆炸的那一瞬间',320,146,10,'#f3d9fa','center',2.4,'#2b0b3d')}}
// 场地:夜空 / 云 / 远山(神秘副本 3 的 GP 图集)压一层紫色 + 地上一排紫焰
function pfgBg(){const t=performance.now()/1000;x.fillStyle='#120a1e';x.fillRect(0,0,VW,VH);if(!GP.I)return;const M=GP.M,k=1.35;x.save();x.imageSmoothingEnabled=false;
  const tile=(n,y,sc,par,dx)=>{const m=M[n],w=m[2]*sc,h=m[3]*sc;let s=((-(cam*par+(dx||0)))%w+w)%w-w;for(let X=s;X<VW;X+=w)GP.I&&x.drawImage(GP.I,m[0],m[1],m[2],m[3],Math.round(X),Math.round(y),Math.ceil(w),Math.round(h))};
  tile('n_sky',0,k,0);tile('n_cld',0,k,.05,t*6);tile('n_mnt',GY-224*k+30,k,.15);tile('n_flr',GY,1,1);x.fillStyle='#160c22';x.fillRect(0,GY+32,VW,VH-GY-32);x.restore();
  x.fillStyle='rgba(80,10,140,.3)';x.fillRect(0,0,VW,GY);
  if(PPF.I){x.save();x.imageSmoothingEnabled=false;x.globalCompositeOperation='lighter';x.globalAlpha=.4;const o=((cam%32)+32)%32;for(let X=-o;X<VW+32;X+=32)PPF.fl(x,'ff',t*12+X/32*5,X+16,GY+3,32,22);x.restore()}}
function pfgArt(X,Y,W,H,t){x.fillStyle='#120a1e';x.fillRect(X,Y,W,H);if(GP.I){const m=GP.M.n_sky;x.drawImage(GP.I,m[0],m[1],m[2],m[3],X,Y,W,H)}x.fillStyle='rgba(80,10,140,.35)';x.fillRect(X,Y,W,H)}
// 首领倒下(自爆结算以后):三星才掉紫焰魅影武器
function pfgWin(){B.act=null;pfgClr();if(LVSTAR>=3&&Math.random()<PFDR*DBLK()){gdDrop(B,{k:'eq',it:fireW(Math.random()<.5?'sword':'staff',3)});banner('紫焰在空中凝成了一把武器……「紫焰魅影」!')}else banner(LVSTAR>=3?'擎天魔神消散了……这次没有留下紫焰魅影武器('+Math.round(PFDR*100)+'%)':'擎天魔神消散了……(紫焰魅影武器只在三星掉落)')}

// ---- 紫焰魅影武器:手里的剑 / 法杖 = 紫色的真~火之武器(半透明闪烁 + 淡淡残影 = 魅影),剑身 / 杖身上全是 N64 Fire 的紫色动态火苗 ----
const PPFT=()=>performance.now()/1000;
function ppfSword(g,hx,hy,wa){const m=PPF.M.sw,f=PPF.M.fr,t=PPFT(),c0=Math.cos(wa),s0=Math.sin(wa);
  g.save();g.translate(hx,hy);g.rotate(wa);g.globalAlpha=.3;g.drawImage(PPF.I,m[0],m[1],m[2],m[3],-22-3,-9+1,m[2],m[3]);g.globalAlpha=.72+.2*Math.sin(t*9);g.drawImage(PPF.I,m[0],m[1],m[2],m[3],-22,-9,m[2],m[3]);g.restore();
  g.save();g.globalCompositeOperation='lighter';for(let d=6,j=0;d<=50;d+=5,j++){const sz=Math.round(15-Math.abs(d-28)*.12),fi=(Math.floor(t*15)+j*4)%f[4];g.drawImage(PPF.I,f[0]+fi*16,f[1],16,16,Math.round(hx+c0*d-sz/2),Math.round(hy+s0*d-sz*.85),sz,sz)}g.restore()}
function ppfStaff(g,hx,hy,rot,q,Gx,Gy){const m=PPF.M.st,f=PPF.M.fr,t=PPFT(),cr=Math.cos(rot),sr=Math.sin(rot);
  g.save();g.translate(hx,hy);g.rotate(rot);g.globalAlpha=.3;g.drawImage(PPF.I,m[0],m[1],76,76,-Gx-3,-Gy+1,76,76);g.globalAlpha=.75+.2*Math.sin(t*9);g.drawImage(PPF.I,m[0],m[1],76,76,-Gx,-Gy,76,76);g.restore();
  g.save();g.globalCompositeOperation='lighter';for(let u=.1,j=0;u<=1.001;u+=.1,j++){const px=q[0]+(q[2]-q[0])*u-Gx,py=q[1]+(q[3]-q[1])*u-Gy,X=hx+px*cr-py*sr,Y=hy+px*sr+py*cr,sz=Math.round(u>.95?22:9+u*5),fi=(Math.floor(t*15)+j*4)%f[4];
    g.drawImage(PPF.I,f[0]+fi*16,f[1],16,16,Math.round(X-sz/2),Math.round(Y-sz*.85),sz,sz)}g.restore()}
// 技能范围增幅:拿着紫焰魅影武器(当前武器)放技能时,技能判定时把敌人的判定框向左右和上方各放大 PFAMP 像素(脚底不动),所有技能(包括以后新加的)都生效
const PFAMP=26,ampOn=()=>!MWON&&st=='play'&&EQ[P.mode]&&EQ[P.mode].fw==3;
function ampRun(all,fn){if(!ampOn()||!all)return fn();const L=all.filter(e=>e&&!e.pp);for(const e of L){e.x-=PFAMP;e.y-=PFAMP;e.w+=2*PFAMP;e.h+=PFAMP}
  try{return fn()}finally{for(const e of L){e.x+=PFAMP;e.y+=PFAMP;e.w-=2*PFAMP;e.h-=PFAMP}}}
{const s1=skStep,s2=zStep,s3=pbStep,s4=useSk,al=()=>bossOn&&B&&B.hp>0?[...E,B]:E;
  skStep=function(dt,S,all){return ampRun(all,()=>s1(dt,S,all))};zStep=function(dt,S,all){return ampRun(all,()=>s2(dt,S,all))};
  pbStep=function(dt,all,S){return ampRun(all,()=>s3(dt,all,S))};useSk=function(...a){return ampRun(al(),()=>s4.apply(this,a))}}
