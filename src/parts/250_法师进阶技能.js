// ===== 第二十七轮:法师进阶技能(用户重置)=====
// W空 圣光禁域:金色光球碰到第一个敌人(或飞到尽头)炸开,留下 5 秒领域,领域里的敌人出不去(第二十九轮:首领也困住),每 0.5 秒受一次伤害
// S空 火鸟图腾:原地(头顶更高处)留下火鸟图腾 5 秒,每 0.5 秒朝范围内最近的敌人吐出一大团火焰(第二十九轮,原来是激光;路上的敌人也会被烧到,落点炸开)
// WW空 苍穹光柱:前方最近的敌人处落下一道深紫色光柱 5 秒,光柱里的小怪被定住不能行动、首领僵直 2.5 秒(第二十九轮),每 0.25 秒受一次伤害
let MGD=[],MGT=null,MGP=null,MGL=[];  // MGL = 火鸟吐出的火团
// 第三十一轮:分身的火鸟 / 光柱放在 MGTc / MGPc,和主角的共存;mgC 临时换进 MGT / MGP 跑同一套逻辑(火团并回 MGL)
let MGTc=null,MGPc=null;
function mgC(fn){const d=MGD,l=MGL,t=MGT,p=MGP;MGT=MGTc;MGP=MGPc;MGD=[];MGL=[];try{fn()}finally{MGTc=MGT;MGPc=MGP;MGT=t;MGP=p;MGD=d;MGL=l.concat(MGL)}}
function mgStep(dt,all){mgStep0(dt,all);mgC(()=>mgStep0(dt,all))}
function drawMg(){drawMg0();mgC(drawMg0)}
const MGR=135,MGTR=300,MGPW=80,MGFV=420;  // 领域半径、图腾射程、光柱半宽、火团速度
function holyBoom(b,S){const x0=clX(b.x),y0=b.y;VFX.spawn('g-burst',x0,y0,{s:2.2});SFX5('g-orb',x0,y0,{s:2.4,life:.4,gr:1});VFX.spawn('x-nebula',x0,y0,{s:1.6,life:.5,add:1,gr:1.2});VFX.spawn('x-bubble',x0,y0,{s:2.2,life:.7,add:1,gr:.8});
  flash('255,236,170',.35);shake=Math.max(shake,.3);hitstop(.06);psx('wave','boom');ring(x0,y0,8,MGR,'#ffd43b',.45,7);ring(x0,y0,6,MGR*.8,'#f783ac',.4,5);
  burst(x0,y0,44,['#fff','#fff3bf','#ffe066','#ffd43b','#f783ac','#66d9e8'],460,{sh:1,s:2.5,l:.5,dr:2});
  hitFx=null;for(const e of allTg())if(Math.abs(e.x+e.w/2-x0)<e.w/2+115&&Math.abs(e.y+e.h/2-y0)<e.h/2+115){mkT(e);mkF(e);dealt(e,Math.round(b.dmg*rnd(.9,1.1)))}
  MGD.push({x:x0,t:5,tk:1,a:0,dm:Math.round(b.dmg*.13*HITK)})}  // 第四十五轮:领域每 1 秒一跳(原 0.5),每跳 ×1.4
function mgBoom(g,all){const R=54;SFX5('r-burst',g.x,g.y,{s:1.3,life:.4,gr:.5});burst(g.x,g.y,22,['#fff3bf','#ffd43b','#ff922b','#ff6b35'],260,{sh:2,s:5,l:.45});
  for(const e of all)if(!e.ug&&e.hp>0&&!g.hit.has(e)&&Math.abs(e.x+e.w/2-g.x)<e.w/2+R&&Math.abs(e.y+e.h/2-g.y)<e.h/2+R){g.hit.add(e);mkF(e);dealt(e,Math.round(g.dmg*rnd(.9,1.1)),{ns:1})}}
function mgStep0(dt,all){
  for(const d of MGD){d.t-=dt;d.a+=dt;
    for(const e of all){if(e.ug||e.hp<=0)continue;const c=e.x+e.w/2,lo=d.x-MGR+e.w/2,hi=d.x+MGR-e.w/2;if(c>d.x-MGR&&c<d.x+MGR){e.x=Math.max(lo,Math.min(hi,c))-e.w/2;e.kbv=0;e.ca=0}}  // 进了领域就出不去(首领也一样)
    if(Math.random()<dt*26)pt({x:d.x+pick([-1,1])*MGR*rnd(.85,1),y:GY-rnd(2,10),vx:0,vy:rnd(-140,-60),c:pick(['#ffd43b','#fff3bf','#ffe066','#f783ac','#66d9e8']),sh:2,s:rnd(2,3.5),l:rnd(.4,.7)});
    d.tk-=dt;if(d.tk<=0){d.tk+=1;for(const e of all)if(!e.ug&&e.hp>0&&Math.abs(e.x+e.w/2-d.x)<MGR+e.w/2&&e.y+e.h>GY-260)dealt(e,Math.round(d.dm*rnd(.9,1.1)),{ns:1})}}
  MGD=MGD.filter(d=>d.t>0);
  if(MGT){const m=MGT;m.t-=dt;m.an+=dt;m.tk-=dt;
    if(m.tk<=0){m.tk+=1;const t=all.filter(e=>!e.ug&&e.hp>0&&Math.abs(e.x+e.w/2-m.x)<MGTR&&Math.abs(e.y+e.h/2-m.y)<MGTR).sort((a,b)=>Math.hypot(a.x+a.w/2-m.x,a.y-m.y)-Math.hypot(b.x+b.w/2-m.x,b.y-m.y))[0];
      if(t){const tx_=t.x+t.w/2,ty=t.y+t.h/2;m.f=sgn(tx_-m.x)||m.f;const x1=m.x+m.f*26,y1=m.y-2,L=Math.hypot(tx_-x1,ty-y1)+24;psx('fire');
        MGL.push({x1,y1,a:Math.atan2(ty-y1,tx_-x1),L,x:tx_,y:ty,dmg:m.dmg*2*HITK,hit:new Set(),t:0});  // 第四十五轮:火鸟 1 秒喷一口(原 0.5 秒,用户:不能像机关枪),每口 ×1.4
        SFX5('r-burst',x1,y1,{s:.8,life:.3,gr:.8})}}  // 第三十轮:张嘴喷出一道大火焰(Fire01 火焰喷流),打到的敌人 + 落点爆炸
    if(m.t<=0){SFX5('r-burst',m.x,m.y,{s:1.4,life:.4,gr:.5});burst(m.x,m.y,20,['#ff922b','#ffd43b','#ff6b35'],220,{sh:2,s:5,l:.45});MGT=null}}
  for(const g of MGL){g.t+=dt;const ca=Math.cos(g.a),sa=Math.sin(g.a);
    if(g.t>=.1&&!g.h){g.h=1;for(const e of all){if(e.ug||e.hp<=0)continue;const ex=e.x+e.w/2-g.x1,ey=e.y+e.h/2-g.y1,q=ex*ca+ey*sa,pp=Math.abs(-ex*sa+ey*ca);if(q>-10&&q<g.L&&pp<Math.max(e.w,e.h)/2+20){g.hit.add(e);mkF(e);dealt(e,Math.round(g.dmg*rnd(.9,1.1)),{ns:1})}}  // 火焰喷流上的敌人
      VFX.spawn('x-boom',g.x,g.y,{s:1.1,life:.55,fps:30,add:1});mgBoom(g,all);shake=Math.max(shake,.15)}
    if(g.t<.4&&Math.random()<dt*70){const u=rnd(.2,1)*g.L*Math.min(1,g.t/.1);pt({x:g.x1+ca*u+rnd(-6,6),y:g.y1+sa*u+rnd(-6,6),vx:ca*rnd(40,140),vy:sa*rnd(40,140)-rnd(20,60),c:pick(['#ff922b','#ffd43b','#ff6b35','#fff3bf']),sh:2,s:rnd(3,6),l:rnd(.2,.4)})}}
  MGL=MGL.filter(g=>g.t<.5);
  if(MGP){const p=MGP;p.t-=dt;p.a+=dt;if(p.a>.3){
      for(const e of all){if(e.ug||e.hp<=0||Math.abs(e.x+e.w/2-p.x)>MGPW+e.w/2)continue;if(e.max){if(!p.bs.has(e)){p.bs.add(e);bigStun(e,2.5)}}else{e.st=Math.max(e.st||0,.3);e.kbv=0}}  // 光柱里的小怪一直定住;首领僵直一次 2.5 秒
      p.tk-=dt;if(p.tk<=0){p.tk+=.5;let any=0;hitFx='thunder';for(const e of all)if(!e.ug&&e.hp>0&&Math.abs(e.x+e.w/2-p.x)<MGPW+e.w/2){any=1;mkT(e);dealt(e,Math.round(p.dmg*HITK*rnd(.9,1.1)),{ns:1})}hitFx=null;if(any&&Math.random()<.4)psx('zap')}
      if(Math.random()<dt*40)pt({x:p.x+rnd(-MGPW,MGPW),y:GY-rnd(0,8),vx:rnd(-20,20),vy:rnd(-300,-140),c:pick(['#e599f7','#cc5de8','#f3d9fa','#fff']),sh:1,s:rnd(2,3),l:.6})}
    if(p.t<=0)MGP=null}}
// 平放在地上的法阵:先转再压扁(VFX.frame 是先压扁再转,会变成斜着的椭圆)
function mgG(n,x0,y0,s,r,a){x.save();x.translate(Math.round(x0),Math.round(y0));x.scale(1,.3);VFX.frame(x,n,0,0,0,s,1,r,a);x.restore()}
function drawMg0(){const t=performance.now()/1000,fi=n=>Math.floor(t*15)%(VFX.M[n]?VFX.M[n].n:1);
  for(const d of MGD){const a=Math.min(1,d.a*4,d.t*2),dx=d.x-cam;x.save();x.globalCompositeOperation='lighter';
    mgG('mc-gold',dx,GY-2,MGR*2/112,d.a*.6,a*.9);VFX.frame(x,'mc-gold',0,dx,GY-MGR*.75,MGR*1.6/112,1,-d.a*.4,a*.22);
    for(let i=0;i<3;i++)VFX.frame(x,'x-bubble',(fi('x-bubble')+i*5),dx+(i-1)*MGR*.6,GY-30-((t*40+i*37)%90),1.1,1,0,a*.7);x.restore()}  // 地上一圈金色法阵 + 半空淡淡的一层 + 往上飘的彩色光泡
  if(MGT){const m=MGT,a=Math.min(1,m.an*4,m.t*2),mx=m.x-cam,fr=Math.floor(t*10)%6,bob=Math.sin(t*3)*3;x.save();x.globalCompositeOperation='lighter';
    mgG('mc-fire',mx,GY-2,1.5,m.an*.8,a*.85);VFX.frame(x,'x-sun',fi('x-sun'),mx,m.y+bob,1.7,1,t,a*.55);  // 身体的火光
    for(const d of[-1,1])VFX.frame(x,'x-flame',fi('x-flame')+(d>0?8:0),mx-m.f*10+d*6,m.y+bob+10,.75,1,Math.PI+d*.25-m.f*.35,a*.85,.7);  // 往下拖的两条火尾
    VFX.frame(x,'r-wing',2+Math.floor(t*8)%3,mx,m.y+bob-4,1.55,1,0,a*.85);for(const d of[-1,1])VFX.frame(x,'x-fire',fi('x-fire')+(d>0?5:0),mx+d*44,m.y+bob-26,1.2,1,0,a*.9);x.restore();  // 火焰双翼 + 翼尖火苗
    x.save();x.globalAlpha=a;SMN.fr(x,'b',fr,mx,m.y+bob,3.4,m.f);x.restore()}  // 火鸟 = 凤凰像素图(SMN)放大 3.4 倍 + 火光 / 火尾 / 双翼
  if(MGL.length){x.save();x.globalCompositeOperation='lighter';for(const g of MGL){const k=Math.min(1,g.t/.1),q=Math.min(1,(.5-g.t)/.15),L=g.L*k,gx=g.x1-cam;
      for(const [w,o,al] of [[1.9,0,.75],[1.4,5,.9],[.9,10,1]])VFX.frame(x,'x-flame',fi('x-flame')+o,gx,g.y1,w,1,g.a+Math.PI/2,al*q,L/126/w);  // 三层火焰喷流(火源在火鸟嘴边,朝目标拉长)
      VFX.frame(x,'x-sun',fi('x-sun'),gx,g.y1,.9,1,t*4,q)}x.restore()}
  if(MGP){const p=MGP,a=Math.min(1,p.a*3,p.t*2),px=p.x-cam,w=MGPW*2*(p.a<.3?p.a/.3:1)*(1+Math.sin(t*20)*.04),H=GY+40,R=Math.PI/2;
    x.save();VFX.frame(x,'bm-dark',0,px,GY/2,H/16,1,R,a,w*1.05/40/(H/16));x.restore();  // 中间深紫黑的不透明光柱
    x.save();x.globalCompositeOperation='lighter';for(let yy=GY-20,i=0;yy>-30;yy-=46,i++)VFX.frame(x,'x-midnight',fi('x-midnight')+i*3,px+Math.sin(t*6+i)*w*.18,yy,1.5,i%2?1:-1,0,a*.85);
    VFX.frame(x,'x-vortex',fi('x-vortex'),px,GY-6,1.6,1,0,a*.8);x.filter='hue-rotate(75deg) saturate(1.6)';mgG('mc-blue',px,GY-2,MGPW*2.6/112,p.a*1.2,a*.95);mgG('mc-blue',px,40,MGPW*2/112,-p.a,a*.6);x.restore()}}  // 第二十九轮:深色光柱 = 深紫黑柱心 + 一串紫色魔焰,上下紫色法阵(第三十轮去掉外层紫光和全屏泛紫)
// 影分身跟着施法(2026-10-12):主角放 H / U / I / O 时,场上的分身在自己的位置朝自己的方向同时放一次,伤害 60%,不耗魔力
const CLK=.6;
function cloneCast(i,S){return;  // 第三十轮:分身不再跟着主角放技能(改成 cloneAI 自己打),下面的旧代码不再执行
  const c=CLN;if(!c)return;const f=c.f,cx=c.x+12,cy=c.y+16,dm=k=>Math.round(skD('staff',k,S)*CLK);c.cs=.3;
  burst(cx,cy,10,['#b197fc','#e5dbff'],140,{s:2.5,l:.3});
  if(i==0){const t=E.concat(bossOn&&B.hp>0?[B]:[]).filter(e=>(e.x+e.w/2-cx)*f>-40&&Math.abs(e.x+e.w/2-cx)<340).sort((a,b)=>Math.abs(a.x-cx)-Math.abs(b.x-cx))[0];bolt(t?t.x+t.w/2:cx+f*160,dm(0),34,0,0)}
  else if(i==1){const ox=cx;c.x=clX(c.x+f*170);c.land=0;c.vy=0;c.vx=0;VFX.spawn('foldstep',ox,cy);VFX.spawn('foldstep',c.x+12,cy);ring(c.x+12,cy,4,40,'#9775fa',.35,4)}
  else if(i==2)PB.push({x:f>0?c.x+P.w:c.x-10,y:c.y+14,vx:f*320,dmg:dm(2),r:12,col:'#ff6b35',sl:1,fb:1,pierce:1,hit:new Set()});
  else if(i==3)CL2={x:cx,t:5,k:0,fk:0,dm:CLK}}
function zline(x1,y1,x2,y2){const p=[[x1,y1]],n=6;for(let i=1;i<n;i++){const k=i/n;p.push([x1+(x2-x1)*k+rnd(-10,10),y1+(y2-y1)*k+rnd(-12,12)])}p.push([x2,y2]);return p}
