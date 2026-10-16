// ===== 第一关首领 · 铁角牛魔:流星锤重砸 / 蛮牛冲撞 / 跃起震地(三招前摇都很明显)=====
// pz:'w' 前摇(头上出现感叹号)· 's' 出招。半血以下:出招更快,冲撞撞墙后会掉头再冲一次,震地范围更大
function mEnd(e,lo){e.act=null;e.pz=null;sfxStop(e.gl);e.gl=null;e.cd=(lo?1:1.5)/bsp(e)}
// 第十六轮重做:链锤回旋(前后两段)/ 蛮牛冲撞(半血过人急刹回头)/ 跃起震地(落地放两道贴地冲击波)/ 连环践踏(三步震地)/ 狂牛怒吼(半血一次:震慑 + 攻击 +25%)
function mntStep(e,dt){const lo=e.hp<e.max/2,A=2620,Bx=WW-e.w-10,cl=v=>Math.max(A,Math.min(Bx,v));e.wv=e.wv||[];
  for(const w of e.wv){w.x+=w.d*300*dt;w.tr+=300*dt;if(!w.hit&&P.gr&&Math.abs(P.x+12-w.x)<24&&P.y+P.h>GY-44&&hurt(10*e.dm,{kb:w.d*300}))w.hit=1}e.wv=e.wv.filter(w=>w.tr<360);
  if(e.bst>0){e.bst-=dt;if(e.bst<=0){e.dm=e.dm0;e.bst=0}}
  if(!e.act&&bDodge(e,dt,lo,A,Bx,60))return;
  const dx=P.x+12-(e.x+e.w/2),ad=Math.abs(dx);
  if(!e.act){e.f=sgn(dx);e.x=cl(e.x+e.f*(ad>110?70:0)*dt);e.cd-=dt;
    if(e.cd<=0){let o;if(lo&&!e.rd)o='roar';else{const Q=ad<150?['slam','slam','stomp']:['charge','leap','charge','stomp'];if(lo)Q.push('stomp','leap');o=Q[Math.random()*Q.length|0];if(o==e.la&&Q.length>1)o=Q[Math.random()*Q.length|0]}
      e.act=o;e.la=o;e.at=0;e.hd=0;e.hd2=0;e.bn=0;e.n=0;e.l0=e.x;e.lx=cl(P.x+12-e.w/2)}return}
  e.at+=dt;const a=e.act;
  if(a=='slam'){  // 链锤回旋:0.7 秒抡到身后 → 砸向身前 120 → 流星锤荡回来再扫身后 90(半血以下扫得更远)
    e.pz=e.at<.7?'w':e.at<1.1?'s':null;
    if(e.at>=.72&&!e.hd){e.hd=1;shake=.25;sfx('b_axe');const r=120,hb={x:e.f>0?e.x+e.w-20:e.x+20-r,y:e.y,w:r,h:e.h};if(ov(P,hb))hurt(14*e.dm,{kb:e.f*260});VFX.spawn('landing-dust',e.f>0?e.x+e.w+50:e.x-50,GY-4,{s:1.2})}
    if(e.at>=1.02&&!e.hd2){e.hd2=1;shake=.2;sfx('b_axe');const r=lo?130:90,hb={x:e.f>0?e.x+20-r:e.x+e.w-20,y:e.y,w:r,h:e.h};if(ov(P,hb))hurt(10*e.dm,{kb:-e.f*300});VFX.spawn('landing-dust',e.f>0?e.x-40:e.x+e.w+40,GY-4,{s:1,f:-1})}
    if(e.at>1.5)mEnd(e,lo)}
  else if(a=='charge'){  // 蛮牛冲撞:0.8 秒刨地(整条路线地面预警)→ 低头冲到场边;半血以下冲过玩家后急刹回头再冲一次
    if(e.at<.8){e.pz='w';e.f=sgn(dx)}
    else{e.pz='s';if(!e.gl)e.gl=sfx('b_gallop',.8,3.5);const nx=e.x+e.f*(lo?480:400)*dt;
      if(nx<=A||nx>=Bx){e.x=cl(nx);shake=.3;sfx('b_ram');VFX.spawn('landing-dust',e.f>0?e.x+e.w:e.x,GY-4,{s:1.4});mEnd(e,lo)}
      else{e.x=nx;if(lo&&!e.bn&&(P.x+12-(e.x+e.w/2))*e.f<-60){e.bn=1;e.at=.55;e.f*=-1;shake=.15;VFX.spawn('landing-dust',e.x+e.w/2,GY-4,{s:1.2})}}
      if(e.at>3.5)mEnd(e,lo)}}
  else if(a=='leap'){  // 跃起震地:0.5 秒下蹲 → 0.7 秒跳到玩家头顶(落点预警)→ 落地震波,并向两边放出贴地冲击波(跳起躲)
    if(e.at<.5)e.pz='w';
    else if(e.at<1.2){e.pz='s';const k=(e.at-.5)/.7;e.x=e.l0+(e.lx-e.l0)*k;e.y=e.gy-Math.sin(Math.PI*k)*150}
    else{e.y=e.gy;e.pz=null;if(!e.hd){e.hd=1;shake=.35;sfx('b_stomp');const r=lo?150:110,c=e.x+e.w/2;if(P.gr&&Math.abs(P.x+12-c)<r+e.w/2)hurt(12*e.dm,{kb:sgn(P.x+12-c)*280});
        VFX.spawn('landing-dust',c-60,GY-4,{s:1.3});VFX.spawn('landing-dust',c+60,GY-4,{s:1.3,f:-1});e.wv.push({x:c,d:-1,tr:0},{x:c,d:1,tr:0})}if(e.at>1.7)mEnd(e,lo)}}
  else if(a=='stomp'){  // 连环践踏:朝玩家走 3 步,每一步踩出一圈震地(预警 0.4 秒;跳起躲)
    const k=Math.floor(e.at/.6);if(k>=3){e.pz=null;if(e.at>2.1)mEnd(e,lo);return}const u=e.at-k*.6;
    if(u<.4){e.pz='w';if(u<.05)e.f=sgn(dx);e.x=cl(e.x+e.f*90*dt)}else{e.pz='s';if(e.n<=k){e.n=k+1;shake=.2;sfx('b_stomp');const c=e.x+e.w/2;VFX.spawn('landing-dust',c,GY-4,{s:1.1});if(P.gr&&Math.abs(P.x+12-c)<e.w/2+70)hurt(11*e.dm,{kb:sgn(P.x+12-c)*260})}}}
  else{  // 狂牛怒吼(半血一次):1 秒蓄力 → 怒吼:150 内的玩家被震僵 0.5 秒,之后 8 秒攻击 +25%
    e.pz=e.at<1?'w':null;if(e.at>=1&&!e.hd){e.hd=1;e.rd=1;shake=.4;sfx('b_ram');flash('255,120,80',.2);ring(e.x+e.w/2,e.y+e.h/2,8,150,'#ff922b',.4,6);if(Math.abs(dx)<150&&!GM.god){P.stun=Math.max(P.stun||0,.5);tx('被震慑了!',P.x-14,P.y-24,'#ff922b')}e.bst=8;e.dm0=e.dm;e.dm=e.dm*1.25}
    if(e.at>1.6)mEnd(e,lo)}}
