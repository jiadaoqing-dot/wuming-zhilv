// 主城 NPC(2026-10-12 扩图后分散摆放;y = 脚底高度,技能导师站在树屋高台上)
const NPCS=[{x:340,y:252,n:'技能导师',c:'#7048e8',h:'#e8d5ff'},{x:600,y:300,n:'药剂师',c:'#0ca678',h:'#c3fae8'},{x:985,y:300,n:'装备商人',c:'#e8590c',h:'#ffd8a8'},{x:1195,y:300,n:'强化师',c:'#2b8a3e',h:'#b2f2bb'},{x:700,y:300,n:'仓库管理员',c:'#364fc7',h:'#d0ebff'}];  // 第三十二轮:仓库管理员桂婶
function toTown(){MYS=0;save();init();bossOn=false;cam=0;E=[];GD=[];PL=TWN.pl.map(p=>({...p}));st='town';P.x=TWN.spawn;cam=0;P.f=1;DLG=null;{const q=mqCur();say(CLR.includes(3)&&chiefNew()?'村长好像有话想对你说……':mqDone()?'主线「'+q.n+'」已完成,找'+mqWho(q)+'或打开 📜 领取奖励':q&&!QD.ms&&!mqLock(q)?'新的主线任务:去找'+mqWho(q)+'(头上有 ❗)':'欢迎回到晨曦镇')}if(MYR){MYR=0;mystIn()}}

// 面具法师的暗影法球 / 天降暗影雷砸中主角、地面或场地墙壁:砸在身体 / 木头 / 石墙上的声音随机混用
const mImp=(f,v)=>{if(cur==2&&bossOn&&(f.c==1||f.c==2))sfx('b_imp'+(1+Math.random()*3|0),v)};
// 第十六轮重做(面具法师):暗影三连 volley / 天降暗雷 rain / 暗影锁链 chain(直线预警 → 光束定身)/ 黑暗领域 field(三个黑色魔法阵 1.1 秒后炸)/ 暗影镜像 mirror(半血:瞬移 + 两个镜像各射一发);受威胁或定时瞬移
function mageStep(e,dt){e.ph+=dt;e.y=e.gy-40+Math.sin(e.ph*2.2)*8;const lo=e.hp<e.max/2,cl=v=>Math.max(2600,Math.min(WW-e.w,v)),cx=e.x+e.w/2,pc=P.x+12,dx=pc-cx;e.zn=e.zn||[];e.cl=e.cl||[];
  if(!e.act)e.f=sgn(dx)||e.f;
  if(e.tpT>0){e.tpT-=dt;e.al=Math.min(1,Math.abs(e.tpT-.3)/.3);if(e.tpT<=.3&&!e.moved){e.moved=1;VFX.spawn('b-spark',cx,e.y+e.h/2,{s:1.6});let nx,n=0;do{nx=pc+(Math.random()<.5?-1:1)*(170+Math.random()*130)-e.w/2}while((nx<2600||nx>WW-e.w)&&++n<20);e.x=cl(nx);VFX.spawn('b-spark',e.x+e.w/2,e.y+e.h/2,{s:1.6})}if(e.tpT<=0)e.al=1;return}
  for(const z of e.zn){z.t+=dt;if(z.t>=1.1&&!z.h){z.h=1;shake=.15;sfx('b_throw',.8);VFX.spawn('void-implosion',z.x,GY-30,{s:1.6});burst(z.x,GY-20,14,['#9b4dff','#f3d9fa'],220,{sh:1,s:2.4,l:.35});if(P.x+P.w>z.x-40&&P.x<z.x+40&&P.y+P.h>GY-90)hurt(14*e.dm,{kb:sgn(pc-z.x)*260})}}e.zn=e.zn.filter(z=>z.t<1.5);
  for(const c of e.cl){c.t+=dt;if(c.t>=.8&&!c.h){c.h=1;sfx('b_throw');const a=Math.atan2(P.y+16-c.y,pc-c.x);F.push({x:c.x,y:c.y,vx:Math.cos(a)*210,vy:Math.sin(a)*210,c:1,ng:1,s:BRNG})}}e.cl=e.cl.filter(c=>c.t<1.3);
  if(!e.act){e.dgc=(e.dgc||0)-dt;if(e.dgc<=0&&threat(e)){if(Math.random()<.6){e.tpT=.6;e.moved=0;e.dgc=lo?1.8:2.6;return}e.dgc=.6}
    e.tp-=dt;if(e.tp<=0){e.tp=lo?3.2:4.2;e.tpT=.6;e.moved=0;return}
    e.fire=1;e.cd=(e.cd==null?1:e.cd)-dt;if(e.cd<=0){const Q=['volley','volley','chain','field','rain'];if(lo)Q.push('mirror','chain','field');let o=Q[Math.random()*Q.length|0];if(o==e.la)o=Q[Math.random()*Q.length|0];e.act=o;e.la=o;e.at=0;e.hd=0;e.n=0;e.tx=pc;e.ty=P.y+16}return}
  e.at+=dt;const a=e.act,T=e.at,ox=e.f>0?e.x+e.w:e.x,oy=e.y+18,done=()=>{e.act=null;e.fire=1;e.cd=(lo?1:1.5)/bsp(e)};
  if(a=='volley'){e.fire=Math.max(.01,.55-T%1.05);const k=Math.floor(T/1.05);if(k<2&&T-k*1.05>=.55&&e.n<=k){e.n=k+1;sfx('b_throw');const a0=Math.atan2(P.y+16-oy,pc+P.vx*.3-ox);for(const da of lo?[-.3,-.1,.1,.3]:[-.22,0,.22])F.push({x:ox,y:oy,vx:Math.cos(a0+da)*210,vy:Math.sin(a0+da)*210,c:1,ng:1,s:BRNG})}if(T>2.1)done()}  // 两轮扇形暗影球
  else if(a=='rain'){e.fire=Math.max(.01,.55-T);if(T>=.55&&!e.hd){e.hd=1;sfx('b_throw',.9);const n=lo?5:3;for(let i=0;i<n;i++)F.push({x:pc+P.vx*.6+(i-(n-1)/2)*70+(Math.random()-.5)*30,y:-10-i*40,vx:0,vy:190,c:2,ng:1,s:BRNG})}if(T>1.2)done()}  // 头顶落雷
  else if(a=='chain'){e.fire=Math.max(.01,.55-T);if(T<.4){e.tx=pc;e.ty=P.y+16}if(T>=.7&&!e.hd){e.hd=1;sfx('b_throw');shake=.3;{const n0=Math.hypot(e.tx-ox,e.ty-oy)||1;VFX.spawn('x-spell',ox,oy,{s:1.6,life:.45,add:1,gr:.6});for(const q of[200,400,600])VFX.spawn('x-midnight',ox+(e.tx-ox)/n0*q,oy+(e.ty-oy)/n0*q,{s:1.3,life:.4,add:1,gr:.8})}const vx=e.tx-ox,vy=e.ty-oy,n=Math.hypot(vx,vy)||1,qx=pc-ox,qy=P.y+16-oy,al=(qx*vx+qy*vy)/n,pp=Math.abs(qx*vy-qy*vx)/n;
      if(al>0&&al<600&&pp<26&&hurt(12*e.dm)){P.frz=Math.max(P.frz||0,.6);tx('被锁链缠住了!',P.x-24,P.y-26,'#d0bfff')}}if(T>1.1)done()}  // 直线 0.4 秒跟踪 → 定住 → 0.7 秒时光束
  else if(a=='field'){e.fire=Math.max(.01,.55-T);if(T>=.55&&!e.hd){e.hd=1;const xs=[pc];for(let i=0;i<6&&xs.length<3;i++){const q=2640+Math.random()*(WW-2700);if(xs.every(v=>Math.abs(v-q)>110))xs.push(q)}for(const q of xs)e.zn.push({x:q,t:0})}if(T>1)done()}
  else{if(T<.3){e.al=1-T/.3;return}if(!e.hd){e.hd=1;e.al=1;const xs=[pc-150,pc+150].map(v=>Math.max(2620,Math.min(WW-40,v)));e.x=cl(xs[Math.random()<.5?0:1]-e.w/2);e.f=sgn(pc-(e.x+e.w/2))||1;for(const v of xs)if(Math.abs(v-(e.x+e.w/2))>20)e.cl.push({x:v,y:e.y+18,t:0});VFX.spawn('b-spark',e.x+e.w/2,e.y+e.h/2,{s:1.6})}if(T>1.2)done()}}
function kEnd(e,lo){e.act=null;e.cd=(lo?.8:1.3)/bsp(e)}
// 第十六轮重做(金色蛇王):毒雨 spit(落点留毒雾)/ 蛇身冲撞 charge(每撞墙加速)/ 缠绕咬 bite(咬中缠住两口再甩开,扑空僵直)/ 尾鞭 tail(贴地横扫,跳)/ 蜕皮 shed(3/4 血一次:回血 + 防御翻倍 + 清状态)/ 狂暴 buff(半血起)
function kingStep(e,dt){e.bf=Math.max(0,(e.bf||0)-dt);e.shd=Math.max(0,(e.shd||0)-dt);e.dm=(e.bf>0?1.5:1)*LDM*STK().atk;const lo=e.hp<e.max/2,cl=v=>Math.max(2600,Math.min(3100,v));
  if((e.dg>0||!e.act)&&bDodge(e,dt,lo,2600,3100,60))return;
  if(!e.act){const dx=P.x+12-(e.x+e.w/2),ad=Math.abs(dx);e.f=sgn(dx);e.x=cl(e.x+e.f*(ad>90?110:-40)*dt);e.cd-=dt;
    if(e.cd<=0){const o=ad<150?['bite','bite','tail','charge']:['spit','charge','spit','tail'];if(!e.bf&&lo)o.push('buff');if(e.hp<e.max*.75&&!e.shed)o.push('shed','shed');e.act=o[Math.random()*o.length|0];e.at=0;e.hd=0;e.bn=0;e.n=0;e.gs=null;e.miss=0}return}
  e.at+=dt;const a=e.act,mx=e.f>0?e.x+e.w:e.x,pc=P.x+12;
  if(a=='spit'){if(e.at<.5)e.f=sgn(pc-(e.x+e.w/2));if(e.at>=.5&&!e.hd){e.hd=1;const n=lo?7:5,oy=e.y+18,g=900;for(let i=0;i<n;i++){const T=.55+i*.06,tx_=pc+P.vx*.25+(i-(n-1)/2)*42;F.push({x:mx,y:oy,vx:(tx_-mx)/T,vy:(GY-8-oy-.5*g*T*T)/T,g,c:3,s:BRNG,dmg:10*e.dm,hz:i%2?'poi':null})}}if(e.at>1)kEnd(e,lo)}
  else if(a=='charge'){if(e.at<.6){e.f=sgn(pc-(e.x+e.w/2));e.x+=Math.sin(e.at*60)*1.5}else{const nx=e.x+e.f*(lo?500:420)*(1+e.bn*.2)*dt;if(nx<2600||nx>3100){e.f*=-1;e.bn++;shake=.15;sfx('boom')}e.x=cl(nx);if(e.bn>=(lo?3:2)||e.at>3)kEnd(e,lo)}}
  else if(a=='bite'){if(e.at<.5)e.f=sgn(pc-(e.x+e.w/2));
    if(e.at>=.5&&e.at<.75&&!e.gs){e.x=cl(e.x+e.f*520*dt);const bw=50*BRNG,hb={x:e.f>0?e.x+e.w-30:e.x+30-bw,y:GY-56,w:bw,h:56};
      if(!e.hd&&ov(P,hb)&&!(P.inv>0)&&!GM.god&&!(P.sk&&P.sk.inv)){e.hd=1;e.gs='hold';e.gt=0;P.grab=1;P.sk=null;P.fly=0;tx('被蛇王缠住了!',P.x-20,P.y-24,'#ff8787');sfx('roar')}}
    if(e.gs=='hold'){e.gt+=dt;P.x=e.f>0?e.x+e.w-28:e.x+4;P.y=GY-P.h;P.vy=0;P.stun=.2;for(const [i,tt] of [[0,.35],[1,.7]])if(e.gt>=tt&&e.n==i){e.n++;shake=.2;hurt(9*e.dm,{inv:.05})}
      if(e.gt>=.9){P.grab=0;hurt(10*e.dm,{kb:e.f*520,inv:.8});P.vy=-460;P.kbx=e.f*520;tx('被甩出去了!',P.x,P.y-30,'#ff8787');kEnd(e,lo);e.cd+=.4}return}
    if(e.at>=.75&&!e.hd&&!e.miss){e.miss=1;e.st=Math.max(e.st||0,.6)}if(e.at>1)kEnd(e,lo)}
  else if(a=='tail'){if(e.at<.5)e.f=sgn(pc-(e.x+e.w/2));if(e.at>=.5&&!e.hd){e.hd=1;shake=.2;sfx('boom');const r=60*BRNG,c=e.x+e.w/2;if(P.y+P.h>GY-26&&Math.abs(pc-c)<r+e.w/2)hurt(13*e.dm,{kb:sgn(pc-c)*380});for(const d of [-1,1])VFX.spawn('m-dust',c+d*60,GY,{f:d,s:1.4})}if(e.at>1)kEnd(e,lo)}
  else if(a=='shed'){if(e.at>=.8&&!e.hd){e.hd=1;e.shed=1;e.hp=Math.min(e.max,e.hp+e.max*.06);e.shd=8;e.bld=0;e.mkT=0;e.mkF=0;tx('蛇王蜕皮:回血 + 防御翻倍',e.x,e.y-24,'#8ce99a');ring(e.x+e.w/2,e.y+e.h/2,6,70,'#8ce99a',.4,5);burst(e.x+e.w/2,e.y+e.h/2,20,['#8ce99a','#ffd43b'],200,{s:3,l:.5})}if(e.at>1.1)kEnd(e,lo)}
  else{if(e.at>=.5&&!e.hd){e.hd=1;e.bf=3;tx('蛇王狂暴:攻击力 +50%!',e.x,e.y-24,'#ff6b6b');shake=.25}if(e.at>.8)kEnd(e,lo)}}
