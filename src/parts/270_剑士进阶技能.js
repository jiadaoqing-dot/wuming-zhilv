// ===== 剑士进阶技能(转职剑士后学习):空格 / W+空格 / S+空格 / WW+空格 =====
// =====================================================================
let STM=[],SQI=[],WTAP=0;  // SQI:剑气(只是特效)
  // STM:焚天炎暴;WTAP:上一次按 W 的时间(连按两下 W = WW)
function wTap(){const t=performance.now();if(t-WTAP<300)keys.ww=1;WTAP=t}
const allTg=()=>E.concat(bossOn&&B&&B.hp>0?[B]:[]).filter(e=>!e.ug&&e.hp>0);
// 绝息风斩的目标:附近被击飞(浮空)的敌人
// 可以锁定的目标:被击飞的、大型怪和首领、因为自己的招式跳到空中的怪(蝙蝠这种本来就在飞的不算)
const onPlatE=e=>PL.some(p=>!p.gone&&p.y<GY&&Math.abs(p.y-(e.y+e.h))<5&&e.x+e.w>p.x&&e.x<p.x+p.w);
const lsOk=e=>!e.ug&&e.hp>0&&(e.air||isBig(e)||e.k=='bat'||(e.y+e.h<GY-14&&!onPlatE(e)));  // 蝙蝠等飞行怪也算浮空目标
// 雷霆连斩的目标(2026-10-12 取消击飞限制):身前约 200 像素内的所有敌人;第三十三轮起地面 / 空中都是 100% 伤害(zapGd 只剩记录,不再减半)
const zapGd=e=>e!==B&&!e.air&&e.k!='bat'&&(e.y+e.h>=GY-14||onPlatE(e));
// 2026-10-13 第十轮:雷球 ZAPB = [离主角中心的水平距离, 离脚底的高度(一段跳约 90,略高一点), 伤害范围横半径, 竖半径](和雷球画面一样大);ZAPN 段,每段 ZAPK 倍,最后炸开 2.5 倍
const ZAPB=[60,110,80,60],ZAPN=7,ZAPK=.27*HITK,ZCY=24;  // 第四十五轮:15 段 → 7 段(每段 ×1.4),每段 = 天上乌云劈下一道闪电(ZCY = 乌云高度)
const zapNear=(e,k)=>{const dx=Math.max(0,Math.abs(e.x+e.w/2-k.bx)-e.w/2),dy=Math.max(0,Math.abs(e.y+e.h/2-k.by)-e.h/2);return (dx/ZAPB[2])**2+(dy/ZAPB[3])**2<1};
// 第三十三轮:全屏雷霆(放过 O 或 WW+空格后的下一次 U);第三十四轮按用户的说法改成「飞雷神」:主角身体化作一道闪电,卷着乌云在画面里的怪物之间高速来回穿行(每 ZFT 秒跳到下一只),
// 每跳一次画面里所有敌人挨一次雷击(共 ZAPN 次,每次 ZAPK 倍,伤害和以前一样),最后闪电回到放招的原地、主角现身,所有敌人一起炸开 2.5 倍;地面 / 空中都是 100% 伤害
const ZFT=.09,ZFR=.12;  // 第四十五轮:跳的间隔 .045 → .09(段数减半)  // 每跳间隔;回到原地用时
function zapJump(k,tx_,ty_,big){Z.push({x:tx_,t:.22,m:.22,big:1,p:zline(k.lx,k.ly,tx_,ty_),br:[]});  // 第四十五轮:去掉分叉和第二道,只留一道
  k.tr.push([k.lx,k.ly,tx_,ty_,.3]);k.lx=tx_;k.ly=ty_;burst(tx_,ty_,8,['#a5d8ff','#fff','#74c0fc'],260,{sh:1,s:2,l:.22,dr:3})}
function zapFs(k,dt,all,S){P.vy=0;k.hid=1;const on=all.filter(e=>e.hp>0&&!e.ug&&e.x+e.w>cam&&e.x<cam+VW);
  if(k.ox==null){k.ox=P.x+12;k.oy=P.y+P.h/2;k.lx=k.ox;k.ly=k.oy;k.cx=k.ox;k.cy=k.oy;k.tr=[];k.ix=0}
  for(const q of k.tr)q[4]-=dt;k.tr=k.tr.filter(q=>q[4]>0);
  const ca=Math.min(1,dt*9);k.cx+=(k.lx-k.cx)*ca;k.cy+=(k.ly-k.cy)*ca;FX.dk=Math.max(FX.dk,.55);
  if(k.n<ZAPN){k.tk-=dt;if(k.tk<=0){k.tk=ZFT;if(k.n%2==0)psx('zap');
      // 下一只:按顺序轮流(只有一只时在它两侧来回穿);画面里没有怪就在画面里乱跑
      let tx_,ty_;if(on.length){const e=on[k.ix++%on.length],sd=on.length==1?(k.n%2?1:-1):0;tx_=e.x+e.w/2+sd*rnd(30,60);ty_=e.y+e.h/2+rnd(-10,10)}else{tx_=cam+rnd(60,VW-60);ty_=rnd(GY-160,GY-30)}
      zapJump(k,tx_,ty_,k.n%3==0);if(k.n%4==0)shake=Math.max(shake,.15);
      hitFx='thunder';for(const e of on){if(Math.abs(e.x+e.w/2-tx_)<e.w/2+70)VFX.spawn('electric-impact',e.x+e.w/2,e.y+e.h/2,{s:1.8,add:1});dealt(e,Math.round(skD('sword',1,S)*ZAPK*rnd(.9,1.1)),{ns:isBig(e)?0:1})}hitFx=null;
      k.n++;if(k.n>=ZAPN){k.fin=k.t+ZFR;zapJump(k,k.ox,k.oy,1)}}return}
  if(k.t<k.fin)return;
  if(!k.done){k.done=1;k.hid=0;flash('200,225,255',.5);hitstop(.08);shake=.4;psx('thunder','boom');VFX.spawn('electric-impact',k.ox,k.oy,{s:2.6,add:1});ring(k.ox,k.oy,6,60,'#74c0fc',.35,5);
    hitFx='slam';for(const e of on){VFX.spawn('electric-impact',e.x+e.w/2,e.y+e.h/2,{s:2.6,add:1});dealt(e,Math.round(skD('sword',1,S)*2.5*rnd(.9,1.1)))}hitFx=null}
  if(k.t-k.fin>.15)P.sk=null}
// 雷霆连斩的乌云(第四十五轮:用户要求乌云放在天上):画面顶上 ZCY 处一团暗色乌云(SKFX c-cloud0~4,Clouds / Igor Gundarev CC0),横向跟着 cx
function drawZapCloud(cx,n){const t=performance.now()/1000;x.save();x.filter='brightness(.42) saturate(.7)';
  for(let i=0;i<5;i++){const nm='c-cloud'+((i+n)%5),m=VFX.M[nm];if(!m)continue;const s=1.1+(i%2)*.3,ox=(i-2)*m.w*.42,cy=ZCY-6+Math.abs(i-2)*4+Math.sin(t*3+i)*2;
    VFX.frame(x,nm,0,cx-cam+ox-m.w*s/2,cy-m.h*s/2,s,i%2?-1:1,0,.92)}
  x.restore()}
// 飞雷神的画面:闪电头一团亮光 + 拖尾残光 + 天上跟着闪电横移的一团乌云
function drawZapFs(k){if(k.ox==null)return;drawZapCloud(k.cx,k.n|0);x.save();
  x.globalCompositeOperation='lighter';
  for(const [a,b,c,d,l] of k.tr){x.globalAlpha=Math.min(1,l/.3)*.5;poly([[a,b],[c,d]],10,'#4dabf7');x.globalAlpha=Math.min(1,l/.3);poly([[a,b],[c,d]],3,'#e7f5ff')}
  x.globalAlpha=1;if(!k.done){const hx=k.lx-cam,hy=k.ly,g=x.createRadialGradient(hx,hy,2,hx,hy,46);g.addColorStop(0,'rgba(235,245,255,.95)');g.addColorStop(.35,'rgba(116,192,252,.6)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(hx-46,hy-46,92,92);
}
  x.restore()}// 雷球:电击素材叠放在固定位置(比原来身上那团大一倍)+ 球里的短电弧
function zapBall(k,dt){k.zb=(k.zb||0)-dt;if(k.zb>0)return;k.zb=.12;  // 第四十五轮:雷球里不再有一圈短电弧,只留一团电光
  VFX.spawn('electric-impact',k.bx+rnd(-6,6),k.by+rnd(-6,6),{s:rnd(1.4,1.8),add:1,r:rnd(-.6,.6),f:pick([1,-1]),a:.7});
  burst(k.bx,k.by,3,['#fff','#a5d8ff','#74c0fc'],160,{sh:1,s:2,l:.18,dr:3})}
// 一段雷霆连斩:天上的乌云劈下一道闪电到雷球
function zapSky(x1,y1){Z.push({x:x1,t:.2,m:.2,big:1,p:zline(x1+rnd(-24,24),ZCY,x1,y1),br:[]});VFX.spawn('electric-impact',x1,y1,{s:2,add:1});shake=Math.max(shake,.08)}
// 第十三轮:绝息风斩只控制 / 伤害主角身边 LSR(横、竖半径)里的敌人;不在范围里或中途离开的敌人不再被定住、不再挨刀
const LSN=15,LSR=[150,120],lsIn=e=>Math.abs(e.x+e.w/2-(P.x+12))<LSR[0]+e.w/2&&Math.abs(e.y+e.h/2-(P.y+20))<LSR[1]+e.h/2;
const lsTargets=()=>allTg().filter(e=>lsOk(e)&&Math.abs(e.x+e.w/2-(P.x+12))<380&&Math.abs(e.y-P.y)<260);
function advStart(i,S){const f=P.f,cx=P.x+12;
  if(i==4){// 疾风踏斩:锁定前方最近的敌人 → 高速突进
    const tg=allTg().filter(e=>(e.x+e.w/2-cx)*f>-10&&Math.abs(e.x+e.w/2-cx)<280).sort((a,b)=>Math.abs(a.x-cx)-Math.abs(b.x-cx))[0],tx_=tg?tg.x+tg.w/2:cx+f*150;
    P.sk={id:'tw',t:0,inv:1,x0:P.x,x1:Math.max(10,Math.min(xMax(),tx_-12)),hit:new Set()};if(tg)P.f=sgn(tx_-cx)||f;ghost('#c3fae8',.35)}
  else if(i==5){// 绝息风斩:画面停顿 → 瞬移到浮空敌人身边
    const L=lsTargets(),c0=L.reduce((a,e)=>a+e.x+e.w/2,0)/L.length,y0=Math.min(...L.map(e=>e.y));hitstop(.12);flash('210,240,255',.4);FX.dk=Math.max(FX.dk,.5);ghost('#c3fae8',.4);
    P.sk={id:'ls',t:0,inv:1,tg:L,px:Math.max(10,Math.min(xMax(),c0-12-P.f*18)),py:Math.max(20,y0-6),n:0,tk:0};P.x=P.sk.px;P.y=P.sk.py;P.vy=0;P.fly=0;for(const e of L)if(!isBig(e)&&lsIn(e)){if(!e.air){e.air=1;e.ay0=GY-e.h;e.hang=0;e.s=null;e.vy=0}e.hold=2;e.avy=0}
    pillar(P.x+12,14,'rgba(195,250,232,.85)',.3);tx('绝息风斩!',P.x-14,P.y-30,'#c3fae8')}
  else if(i==6){P.sk={id:'yr',t:0,inv:1,x0:cx,f,hit:[]};FX.dk=Math.max(FX.dk,.35);SFX5('v-gear',cx,P.y+4,{s:1.4,life:.45,rs:3})}
  else{// 焚天炎暴:放出持续向前推进的冰暴
    P.uFs=1;STM.push({x:cx+f*34,f,t:4,m:4,tk:0,st:null,a:0});P.cs={id:'sword7',t:0};ring(cx+f*34,GY-30,6,50,'#ff6b6b',.4,5);burst(cx+f*34,GY-30,16,['#ffc9c9','#ff6b6b','#fff'],200,{s:3,l:.4});SFX5('r-burst',cx+f*34,GY-50,{s:1.3,life:.4})}}
function advStep(k,dt,S,all){const f=P.f;
  if(k.id=='tw'){// 疾风踏斩(约 1.6 秒):突进 → 360° 斩击击飞 → 旋风中盘旋上升连斩 → 空中十字斩 → 落地风爆 → 收势
    const t=k.t,cx=P.x+12;
    if(t<.16){const q=t/.16;P.x=k.x0+(k.x1-k.x0)*eo(q);k.gt=(k.gt||0)-dt;if(k.gt<=0){k.gt=.03;ghost('rgba(195,250,232,.8)',.25)}
      for(let n=0;n<2;n++)pt({x:cx-f*rnd(4,18),y:P.y+rnd(4,30),vx:-f*rnd(200,420),vy:rnd(-20,20),c:pick(['#c3fae8','#e6fcf5','#fff']),sh:1,s:2,l:.22});return 1}
    if(!k.done){k.done=1;k.y0=P.y;k.sp=0;k.cr=0;const cy=P.y+16;psx('wave','swing');hitstop(.06);shake=.25;flash('210,255,240',.25);
      slash(cx,cy,48,-3.1,3.1,1,'#c3fae8',.32,6);VFX.spawn('leaf-gust',cx,cy,{s:1.6,f});slash(cx,cy,62,-3.1,3.1,-1,'#ffffff',.3,4);ring(cx,cy,6,92,'#96f2d7',.42,6);
      for(let n=0;n<34;n++){const a=n/34*6.283;pt({x:cx+Math.cos(a)*20,y:GY-4-n*2.2,vx:Math.cos(a+1.6)*220,vy:-rnd(60,180),c:pick(['#c3fae8','#e6fcf5','#fff']),sh:1,s:2,l:rnd(.35,.6),dr:2})}
      k.L=[];hitFx='wave';for(const e of all)if(!e.ug&&Math.hypot(e.x+e.w/2-cx,e.y+e.h/2-cy)<e.w/2+72){dealt(e,Math.round(skD('sword',4,S)*rnd(.9,1.1)));launch(e,1.4);k.L.push(e)}hitFx=null}
    const L=k.L.filter(e=>e.hp>0&&all.includes(e)),H=46;
    if(t<.62){// 盘旋上升:旋风包住自己,每 0.12 秒一记 360° 斩
      const q=(t-.16)/.46;P.y=k.y0-H*eo(q);P.vy=0;
      for(let n=0;n<3;n++)pt({x:cx+Math.cos(t*30+n*2.1)*rnd(14,26),y:P.y+rnd(0,40),vx:Math.cos(t*30+n*2.1+1.6)*160,vy:-rnd(80,200),c:pick(['#c3fae8','#96f2d7','#fff']),sh:1,s:2,l:.3});
      if(k.sp<1&&t>=.38){k.sp++;psx('swing','wave');const cy=P.y+16,a0=t*12;slash(cx,cy,56,a0,a0+6.2,1,'#e6fcf5',.32,6);slash(cx,cy,70,a0+3,a0+9.2,-1,'#96f2d7',.3,4);ring(cx,cy,6,96,'#c3fae8',.4,5);  // 第四十五轮:3 次回旋斩 → 1 次大回旋斩(×.55)
        hitFx=null;for(const e of all)if(!e.ug&&Math.hypot(e.x+e.w/2-cx,e.y+e.h/2-cy)<e.w/2+80){dealt(e,Math.round(skD('sword',4,S)*.55*rnd(.9,1.1)),{ns:1});if(e.air)e.hang=Math.max(e.hang||0,.6)}}
      return 1}
    if(t<1.1){// 空中十字斩:在浮空的敌人之间来回
      P.y=k.y0-H;P.vy=0;
      if(k.cr<1&&t>=.8){k.cr++;  // 第四十五轮:十字斩 2 次 → 1 次(×.6)
        psx('swing','wave');const tg=L.length?L[(k.cr-1)%L.length]:null,ex=tg?tg.x+tg.w/2:cx+f*50,ey=tg?tg.y+tg.h/2:P.y+16;
        ghost('rgba(195,250,232,.7)',.25);if(tg){P.f=sgn(ex-cx)||f;P.x=Math.max(pLo(),Math.min(xMax(),ex-12-P.f*30))}
        slash(ex,ey,46,-2.4,.8,1,'#ffffff',.26,5);slash(ex,ey,46,-.8,2.4,-1,'#96f2d7',.26,5);SQI.push({x:ex,y:ey,a:.8,t:.3,m:.3,len:120,c:'#c3fae8'},{x:ex,y:ey,a:-.8,t:.3,m:.3,len:120,c:'#ffffff'});
        hitFx='wave';for(const e of L)if(Math.hypot(e.x+e.w/2-ex,e.y+e.h/2-ey)<110){dealt(e,Math.round(skD('sword',4,S)*.6*rnd(.9,1.1)),{ns:1});e.hang=Math.max(e.hang||0,.5)}hitFx=null}
      return 1}
    if(t<1.32){const q=(t-1.1)/.22;P.y=k.y0-H+H*q*q;P.vy=0;
      if(q>=.99&&!k.ld){k.ld=1}return 1}
    if(!k.ld2){k.ld2=1;P.y=k.y0;P.vy=0;psx('slam');VFX.spawn('landing-dust',cx,GY,{s:1.8});shake=.3;ring(cx,GY-4,8,110,'#96f2d7',.45,6,.25);ring(cx,GY-4,4,70,'#fff',.3,3,.25);crack(cx,3,70);
      burst(cx,GY-8,26,['#c3fae8','#e6fcf5','#fff'],360,{sh:1,s:2.4,l:.45,dr:1});
      hitFx='wave';for(const e of all)if(!e.ug&&!e.air&&Math.abs(e.x+e.w/2-cx)<e.w/2+90&&e.y+e.h>GY-60)dealt(e,Math.round(skD('sword',4,S)*.4*rnd(.9,1.1)),{ns:1});hitFx=null}
    if(t>1.6)P.sk=null;return 1}
  if(k.id=='ls'){// 30 段空中乱斩,把敌人一直控制在空中;最后一刀劈回地面,之后获得破甲
    P.x=k.px;P.y=k.py;P.vy=0;FX.dk=Math.max(FX.dk,.4);const L=k.tg.filter(e=>e.hp>0&&all.includes(e)&&lsIn(e));for(const e of L)if(!isBig(e)){e.hold=.3;e.avy=0}
    if(k.n<LSN){k.tk-=dt;while(k.tk<=0&&k.n<LSN){k.tk+=.0472;k.n++;if(k.n%2==0)psx('swing');const e=L[k.n%Math.max(1,L.length)];if(!e){k.n=LSN;break}if(isBig(e)){P.f=sgn(e.x+e.w/2-P.x-12)||P.f}const ex=e.x+e.w/2,ey=e.y+e.h/2,a0=rnd(-3.1,3.1);
        slash(ex+rnd(-8,8),ey+rnd(-8,8),rnd(26,40),a0,a0+rnd(2,3),pick([1,-1]),pick(['#c3fae8','#fff','#a5d8ff']),.2,4);SQI.push({x:ex+rnd(-10,10),y:ey+rnd(-10,10),a:rnd(-3.1,3.1),t:.26,m:.26,len:rnd(90,150),c:pick(['#c3fae8','#ffffff','#a5d8ff','#96f2d7'])});if(k.n%2)burst(ex,ey,5,['#fff','#c3fae8'],220,{sh:1,s:2,l:.2,dr:3});P.f=pick([1,-1]);
        hitFx=null;for(const o of L)if(Math.hypot(o.x+o.w/2-ex,o.y+o.h/2-ey)<90)dealt(o,Math.round(skD('sword',5,S)*HITK*rnd(.9,1.1)),{ns:1})}return 1}
    if(!k.done){k.done=1;k.d2=0;psx('slam','boom');shake=.5;hitstop(.1);flash('230,250,255',.5);slash(P.x+12,P.y+20,46,-2.4,1.2,P.f,'#ffffff',.3,7);
      for(const e of L){dealt(e,Math.round(skD('sword',5,S)*6),{ns:1});if(!isBig(e)){e.hold=0;e.hang=0;e.avy=1100}}crack(P.x+12,4,80);VFX.spawn('earth-rupture',P.x+12,GY,{s:1.4});ring(P.x+12,GY-2,8,110,'#c3fae8',.45,6,.25);P.apen=6;tx('破甲 6 秒!',P.x-10,P.y-30,'#c3fae8')}
    k.d2+=dt;if(k.d2>.13){P.sk=null;P.vy=260}return 1}  // 2026-10-13 第十二轮:持续时间 -30%(每段 .045 → .0315);第十三轮再 -25%(.0315 → .0236,收尾 .175 → .13)
  if(k.id=='yr'){// 封尘断念斩(约 1.8 秒):蓄势 → 前方大斩(眩晕标记)→ 瞬移到最远目标身后 → 风暴把敌人拉回 → 拔刀定格 → 魔法十字斩击飞 → 收刀
    const f0=k.f,x0=k.x0,t=k.t;
    if(t<.4){FX.dk=Math.max(FX.dk,.3);if(Math.random()<dt*40){const a=rnd(0,6.28),r=rnd(30,60);pt({x:P.x+12+Math.cos(a)*r,y:P.y+16+Math.sin(a)*r,vx:-Math.cos(a)*r*3,vy:-Math.sin(a)*r*3,c:pick(['#e599f7','#d0bfff','#fff']),sh:1,s:2,l:.3})}return 1}
    if(!k.a){k.a=1;psx('heavy','wave');shake=.3;hitstop(.07);flash('230,190,255',.25);const hb={x:f0>0?x0:x0-300,y:P.y-40,w:300,h:P.h+50};
      slash(x0+f0*60,P.y+10,90,-1.5,1.3,f0,'#f3d9fa',.32,8);slash(x0+f0*140,P.y+12,110,-1.3,1.1,f0,'#e599f7',.3,6);SFX5('v-wing',x0+f0*130,P.y+6,{s:2.3,f:f0,life:.5,gr:.25});SFX5('v-ring',x0+f0*70,P.y+8,{s:1.5,life:.4,gr:.5});
      for(let n=0;n<40;n++)pt({x:x0+f0*rnd(10,300),y:P.y+rnd(-20,30),vx:f0*rnd(200,500),vy:rnd(-20,20),c:pick(['#e599f7','#f3d9fa','#fff']),sh:1,s:2.4,l:.35});
      hitFx='slam';for(const e of all)if(!e.ug&&ov(hb,e)){dealt(e,Math.round(skD('sword',6,S)*rnd(.9,1.1)));e.st=Math.max(e.st||0,1.8);e.mk6=1.8;k.hit.push(e);SFX5('v-clock',0,0,{at:e,s:.85,life:1.8,rs:1.5,a:.9})}hitFx=null}
    if(t<.62)return 1;
    if(!k.b){k.b=1;const H=k.hit.filter(e=>e.hp>0);if(!H.length){k.miss=1}
      else{const far=H.reduce((a,e)=>Math.abs(e.x+e.w/2-x0)>Math.abs(a.x+a.w/2-x0)?e:a);ghost('#e599f7',.45);P.x=Math.max(10,Math.min(xMax(),f0>0?far.x+far.w+14:far.x-14-P.w));P.f=-f0;pillar(P.x+12,16,'rgba(229,153,247,.85)',.35);psx('blink');k.vo={x:x0,y:P.y+8,w:0,h:0};SFX5('v-vortex',0,0,{at:k.vo,s:1.7,life:.62,rs:-8});burst(P.x+12,P.y+16,20,['#e599f7','#fff'],260,{sh:1,s:2,l:.35})}}
    if(k.miss){if(t>1)P.sk=null;return 1}
    if(t<1.2){if(!k.w2&&t>.9){k.w2=1;psx('wave')}const px=P.x+12;k.wp=(t-.62)/.58;for(const e of k.hit)if(e.hp>0&&!isBig(e)&&!e.ug){const tx_=px+P.f*28-e.w/2;e.x+=(tx_-e.x)*Math.min(1,dt*5);e.st=Math.max(e.st||0,.3)}
      const wx=x0+(px-x0)*k.wp;if(k.vo)k.vo.x=wx;for(let n=0;n<4;n++)pt({x:wx+rnd(-10,10),y:P.y+rnd(-30,30),vx:sgn(px-x0)*rnd(200,400),vy:rnd(-40,40),c:pick(['#e599f7','#d0bfff','#fff']),sh:1,s:2,l:.3});
      return 1}
    if(t<1.35){FX.dk=Math.max(FX.dk,.45);if(!k.iai){k.iai=1;tx('封尘……',P.x-10,P.y-34,'#f3d9fa');psx('blink')}return 1}
    if(!k.c){k.c=1;psx('thunder','slam');shake=.45;hitstop(.1);flash('230,200,255',.45);ring(P.x+12+P.f*28,P.y+16,6,100,'#e599f7',.45,6);SFX5('v-wing',P.x+12+P.f*70,P.y+6,{s:1.9,f:P.f,life:.5});tx('断念!',P.x-6,P.y-40,'#e599f7');hitFx='wave';
      for(const e of k.hit)if(e.hp>0){const ex=e.x+e.w/2,ey=e.y+e.h/2;dealt(e,Math.round(skD('sword',6,S)*rnd(.9,1.1)));tx('魔法',ex,e.y-26,'#e599f7');launch(e,1.5);
        SQI.push({x:ex,y:ey,a:.85,t:.4,m:.4,len:150,c:'#e599f7'},{x:ex,y:ey,a:-.85,t:.4,m:.4,len:150,c:'#f3d9fa'});SFX5('v-ring',ex,ey,{s:1.3,life:.45,gr:.6});SFX5('v-gear',ex,ey,{s:1.1,life:.4,rs:5});burst(ex,ey,14,['#e599f7','#fff'],260,{sh:1,s:2,l:.4})}hitFx=null}
    if(Math.random()<dt*20)pt({x:P.x+12+rnd(-40,40),y:P.y-rnd(0,30),vx:rnd(-30,30),vy:rnd(20,60),c:pick(['#f3d9fa','#e599f7']),s:rnd(1.5,2.5),l:.8});
    if(t>1.8)P.sk=null;return 1}
  return 0}
// 焚天炎暴:每 0.3 秒切割一次(第四十五轮);碰到大型敌人会停在它身边;4 秒后爆炸
function stmStep(dt,S,all){for(const s of STM){s.t-=dt;s.a+=dt*14;s.tk-=dt;
    if(s.st&&(s.st.hp<=0||!all.includes(s.st)))s.st=null;
    if(!s.st){s.x+=s.f*85*dt;for(const e of all)if(isBig(e)&&!e.ug&&Math.abs(e.x+e.w/2-s.x)<e.w/2+60&&e.y+e.h>GY-180){s.st=e;break}}else s.x+=(s.st.x+s.st.w/2-s.x)*Math.min(1,dt*4);
    s.x=Math.max(10,Math.min((st=='town'?twW():WW)-10,s.x));
    if(s.tk<=0){s.tk=.3;s.pc=(s.pc||0)+1;  // 第四十五轮:.15 → .3 秒一次(每次 ×1.4)
      for(const e of all)if(!e.ug&&Math.abs(e.x+e.w/2-s.x)<e.w/2+68&&e.y+e.h>GY-200&&e.y<GY){noCombo=1;hitFx=null;dealt(e,Math.round(skD('sword',7,S)*HITK*rnd(.9,1.1)),{ns:1});noCombo=0}
      for(let n=0;n<5;n++)pt({x:s.x+rnd(-60,60),y:GY-rnd(10,140),vx:rnd(-80,80),vy:rnd(-60,20),c:pick(['#ffa8a8','#ff6b6b','#e03131','#ffd8a8']),s:rnd(1.5,3),l:.4})}
    if(s.t<=0){psx('boom','zap');SFX5('r-cross',s.x,GY-70,{s:2.6,life:.6,gr:.3});SFX5('r-burst',s.x,GY-70,{s:2.8,life:.7,gr:.3});shake=.35;flash('255,190,170',.3);ring(s.x,GY-60,10,200,'#ff6b6b',.5,8);ring(s.x,GY-60,6,120,'#ffd8a8',.35,4);
      burst(s.x,GY-60,50,['#ffc9c9','#ff6b6b','#e03131','#ffd43b'],380,{s:3,l:.6,g:300});for(const e of all)if(!e.ug&&Math.abs(e.x+e.w/2-s.x)<e.w/2+180&&e.y+e.h>GY-260)dealt(e,Math.round(skD('sword',7,S)*8))}}
  STM=STM.filter(s=>s.t>0)}
// 封尘断念斩的冲击波:从 xa 扫到 xb(xb 是浪头,最高),上沿不规则起伏、随时间翻动;实心不透明,浪头一道亮边
function yrWave(xa,xb,al,t){const d=sgn(xb-xa)||1,L=Math.abs(xb-xa);if(L<6||al<=0)return;const n=Math.max(3,Math.ceil(L/5)),
    hy=u=>{const q=u/L;return (18+40*q*q+10*Math.sin(q*9.4+t*6))+7*Math.sin(u*.11+t*11)+4*Math.sin(u*.27-t*17)},top=[];
  for(let i=0;i<=n;i++){const u=i/n*L;top.push([xa+d*u,GY-hy(u)])}
  x.save();x.globalAlpha=Math.max(0,Math.min(1,al));x.fillStyle='#3b1f8f';x.beginPath();x.moveTo(xa,GY);for(const p of top)x.lineTo(p[0],p[1]);
  const tx_=xb+d*10,ty=GY-hy(L)-14;x.quadraticCurveTo(tx_+d*6,ty+6,xb+d*4,GY-hy(L)*.55);x.quadraticCurveTo(xb+d*12,GY-10,xb,GY);x.closePath();x.fill();  // 浪头往前卷
  x.fillStyle='#6741d9';x.beginPath();x.moveTo(top[0][0],top[0][1]+6);for(const p of top)x.lineTo(p[0],p[1]+6);for(let i=top.length-1;i>=0;i--)x.lineTo(top[i][0],top[i][1]+16);x.closePath();x.fill();
  x.strokeStyle='#b197fc';x.lineWidth=3;x.beginPath();top.forEach((p,i)=>i?x.lineTo(p[0],p[1]+1):x.moveTo(p[0],p[1]+1));x.stroke();
  x.strokeStyle='#f3d9fa';x.lineWidth=1.2;x.beginPath();top.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.stroke();
  x.fillStyle='#f3d9fa';for(let i=0;i<n;i+=3){const p=top[i];if(Math.sin(i*1.7+t*20)>.4)x.fillRect(Math.round(p[0]),Math.round(p[1]-3),2,2)}  // 浪尖的白沫
  x.restore()}
// 进阶技能画面:封尘断念斩的范围预警 / 风暴,焚天炎暴
function drawAdv(){const t=performance.now()/1000,k=P.sk;
  SQI=SQI.filter(q=>(q.t-=1/60)>0);if(SQI.length){x.save();x.globalCompositeOperation='lighter';for(const q of SQI){const a=q.t/q.m,L=q.len*(1.15-a*.3),w=7*a+2;x.save();x.translate(q.x-cam,q.y);x.rotate(q.a);
      x.globalAlpha=a*.55;x.fillStyle=q.c;x.beginPath();x.moveTo(-L/2,0);x.quadraticCurveTo(0,-w*2.2,L/2,0);x.quadraticCurveTo(0,w*.8,-L/2,0);x.fill();
      x.globalAlpha=a;x.fillStyle='#ffffff';x.beginPath();x.moveTo(-L/2,0);x.quadraticCurveTo(0,-w*.9,L/2,0);x.quadraticCurveTo(0,w*.3,-L/2,0);x.fill();x.restore()}x.restore()}
  if(k&&k.id=='tw'&&k.t>.16&&k.t<1.32){const cx=P.x+12-cam;x.save();x.globalCompositeOperation='lighter';for(let i=0;i<8;i++){const kk=i/7,y=GY-4-kk*(GY-P.y+10),w=12+kk*26,ox=Math.sin(t*14+kk*5)*(3+kk*5);x.strokeStyle=i%2?'rgba(230,252,245,.7)':'rgba(150,242,215,.6)';x.lineWidth=3;x.beginPath();x.ellipse(cx+ox,y,w,3+kk*3,0,t*9+i,t*9+i+4.4);x.stroke()}x.restore()}
  // 2026-10-12 第七轮:范围预警 / 风暴从半透明长方形改成不透明的不规则紫色波浪(冲击波扫过去 → 卷回来)
  if(k&&k.id=='yr'){const f0=k.f,x0=k.x0-cam;if(k.t<.4)yrWave(x0,x0+f0*300*eo(Math.min(1,k.t/.3)),Math.min(1,k.t/.05)*(k.t>.33?1-(k.t-.33)/.07:1),t);
    else if(k.t<1.2&&k.wp!=null&&!k.miss){const px=P.x+12-cam,wx=x0+(px-x0)*k.wp;yrWave(x0,wx,Math.min(1,(1.2-k.t)/.12),t)}}
  // 2026-10-12 第六轮:改成红色火焰风暴(Fire Wrath 的火环 + 火球 + 旋转火舌,图集 SKFX)
  for(const s of STM){const sx=s.x-cam,a=Math.min(1,s.t/.3,(s.m-s.t)/.2+.3),cy=GY-64;if(sx<-200||sx>VW+200)continue;x.save();x.globalCompositeOperation='lighter';
    C_(x,sx,cy,90,RGD(x,sx,cy,90,[`rgba(255,120,80,${.45*a})`,`rgba(224,49,49,${.22*a})`,'rgba(0,0,0,0)']),0);
    VFX.frame(x,'r-ball',3+(Math.floor(s.a*.7)%2),sx,cy,1.25,1,-s.a*.35,a*.85);VFX.frame(x,'r-ring',2+(Math.floor(s.a*.9)%2),sx,cy,1.6,1,s.a*.5,a);
    for(let i=0;i<7;i++){const k2=i/6,y=GY-4-k2*130,w=18+k2*44;x.strokeStyle=i%2?`rgba(255,212,59,${.8*a})`:`rgba(255,80,60,${.75*a})`;x.lineWidth=3;x.beginPath();x.ellipse(sx+Math.sin(s.a+k2*3)*6,y,w,4+k2*5,0,s.a+i,s.a+i+4.2);x.stroke()}
    x.restore()}}

// =====================================================================
