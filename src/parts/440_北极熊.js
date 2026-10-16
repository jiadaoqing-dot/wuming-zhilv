// ===== 企鹅:摇摇摆摆走路;肚皮滑行(撞墙反弹)、啄击、扔冰块;精英:连扔 3 个、滑铲(撞到玩家击飞,撞墙反弹)=====
// ===== 海豹:潜伏在雪洞里,靠近就跳出来击飞;吸气喷冰球(撞墙反弹)、抬鳍拍击(前摇明显);精英:蜷成大雪球滚过来,能撞飞其他小怪 =====
// ===== 北极熊:力量型 / 霸体 / 近战压迫。三阶段 + 暴风雪大招 =====
function brEnd(e,cd){e.act=null;e.gs=null;e.cd=(cd||(e.rage?.75:1.15))}
function brHit(e,hb,b,o){if(ov(P,hb))return hurt(b*LDM,o);return false}
function bearStep(e,dt){const p2=e.hp<=e.max*.6,p3=e.hp<=e.max*.3;
  if(p2&&!e.p2){e.p2=1;tx('北极熊开始操控冰雪!',e.x,e.y-30,'#a5d8ff');e.q.push('roar')}
  if(p3&&!e.rage){e.rage=1;tx('北极熊狂暴了!',e.x,e.y-40,'#ff6b6b');shake=.4;e.q=['bliz'];e.bzc=22}
  const rs=e.rage?1.3:1,d=dt*rs;e.bzc=(e.bzc||0)-dt;
  // 冲击波 / 冰刺 / 暴风雪落刺
  for(const w of e.wv){w.x+=w.d*330*dt;w.tr+=330*dt;if(!w.hit&&ov(P,{x:w.x-12,y:GY-36,w:24,h:36})){if(hurt(12*LDM,{kb:w.d*300}))w.hit=1}}e.wv=e.wv.filter(w=>w.tr<300&&!solidAt(w.x-4,w.x+4));
  for(const s of e.sp){s.x+=s.d*290*dt;s.tr+=290*dt;if(!s.hit&&ov(P,{x:s.x-12,y:GY-30,w:24,h:30})){if(hurt(14*LDM))s.hit=1}}e.sp=e.sp.filter(s=>s.tr<340&&!solidAt(s.x-4,s.x+4));
  for(const z of e.zn){z.t+=dt;if(z.t>=.9&&!z.h){z.h=1;sfx('zap');if(P.x+P.w>z.x&&P.x<z.x+z.w&&P.y+P.h>GY-70)hurt(16*LDM)}}e.zn=e.zn.filter(z=>z.t<1.4);
  if(e.dz>0){e.dz-=dt;e.pz=null;if(e.dz<=0){e.kn=0;e.dz=0}return}
  const cx=e.x+e.w/2,pc=P.x+12,dx=pc-cx,ad=Math.abs(dx),cl=v=>Math.max(ARL,Math.min(ARR-e.w,v)),fx=()=>e.f>0?e.x+e.w:e.x;
  if(!e.act){e.f=sgn(dx);e.x=cl(e.x+e.f*(ad>110?(e.rage?100:72):ad<60?-40:0)*d);e.cd-=d;e.pz=null;
    if(e.cd<=0){let o=e.q.shift();
      if(o=='bliz'&&!e.rage)o=null;
      if(!o){const near=ad<130,pool=near?['paw','paw','slam']:['paw','charge','slam','charge'];
        if(e.p2)pool.push('ball','skate','roar','pillars','pillars');if(e.rage){pool.push('combo','combo','hug','aval');if(near)pool.push('hug','combo');if(e.bzc<=0)pool.push('bliz','bliz')}  // 第十六轮:冰柱阵 / 雪崩
        o=pool[Math.random()*pool.length|0];if(o==e.la&&pool.length>2)o=pool[Math.random()*pool.length|0]}
      e.act=o;e.la=o;e.at=0;e.hd=0;e.hd2=0;e.n=0;e.gs=null;e.f=sgn(dx)}
    return}
  e.at+=d;const a=e.act,t=e.at;
  if(a=='paw'){// ① 熊掌拍击:近处熊掌、远处冲击波
    if(t<.55){e.pz='w';e.f=sgn(dx)}else e.pz='s';
    if(t>=.55&&!e.hd){e.hd=1;sfx('slam');shake=Math.max(shake,.15);brHit(e,{x:e.f>0?e.x+e.w-30:e.x-50,y:e.y-10,w:80,h:e.h+10},18,{kb:e.f*400});e.wv.push({x:fx()+e.f*20,d:e.f,tr:0});ring(fx()+e.f*20,GY-4,6,60,'#e7f5ff',.35,4,.3)}
    if(t>.95)brEnd(e)}
  else if(a=='slam'||(a=='combo'&&e.n>=2)){// ② 双掌砸地:站起来 → 轰!近处高伤害,冰刺沿地面向两边移动
    const t0=a=='combo'?t-1.05:t,W=a=='combo'?.45:.75;if(t0<W)e.pz='w';else e.pz='s';
    if(t0>=W&&!e.hd2){e.hd2=1;sfx('boom');sfx('slam');shake=.35;crack(fx(),4,90);const hit=brHit(e,{x:cx-120,y:GY-70,w:240,h:70},24,{kb:sgn(dx)*420});
      e.sp.push({x:cx,d:-1,tr:0},{x:cx,d:1,tr:0});ring(cx,GY-2,8,110,'#a5d8ff',.45,6,.25);burst(cx,GY-8,24,['#fff','#d0ebff','#a5d8ff'],320,{s:3,l:.6,g:600});
      if(a=='combo'){if(!hit){e.dz=2;tx('北极熊失去平衡!',cx-30,e.y-30,'#ffd43b');e.act=null;e.cd=.6;return}}}
    if(t0>W+.5)brEnd(e)}
  else if(a=='combo'){// ⑦ 狂暴三连击:熊掌 → 熊掌 → 双掌砸地(躲过第三下熊会硬直)
    const hits=[.38,.75];e.pz=t<hits[e.n]-.05?'w':'s';e.f=t<hits[e.n]-.1?sgn(dx):e.f;
    if(t>=hits[e.n]){sfx('slam');shake=Math.max(shake,.12);e.x=cl(e.x+e.f*18);if(brHit(e,{x:e.f>0?e.x+e.w-30:e.x-50,y:e.y-10,w:80,h:e.h+10},15,{kb:e.f*60,inv:.25}))e.cmh=1;e.n++;if(e.n>=2)e.at=1.05}}
  else if(a=='charge'){// ③ 冲撞:低吼 → 后退 → 霸体冲刺,撞墙后收招(2026-10-12 取消眩晕)
    if(t<.5){e.pz='w';e.f=sgn(dx)}
    else if(t<.9){e.pz='w';e.x=cl(e.x-e.f*90*d)}
    else{e.pz='s';const nx=e.x+e.f*(e.rage?470:400)*d;
      if(nx<ARL||nx>ARR-e.w){e.x=cl(nx);e.act=null;e.cd=.6;shake=.4;sfx('boom');burst(e.f>0?ARR:ARL,GY-50,18,['#fff','#d0ebff'],220,{s:3,l:.5,g:400});return}
      e.x=nx;if(Math.random()<dt*25)pt({x:cx-e.f*40,y:GY-3,vx:-e.f*rnd(40,100),vy:rnd(-80,-20),c:'#fff',ad:0,s:rnd(3,5),l:.4});
      if(!e.hd&&brHit(e,{x:e.x+10,y:e.y+10,w:e.w-20,h:e.h-10},20,{kb:e.f*480}))e.hd=1;if(t>3.4)brEnd(e)}}
  else if(a=='ball'){// ④ 拍雪球:抓起一大团雪扔过来,落地爆成碎冰
    if(t<.6){e.pz='w';e.f=sgn(dx)}else e.pz='s';
    if(t>=.6&&!e.hd){e.hd=1;sfx('proj');const ox=cx+e.f*30,oy=e.y-20,v=aimArc(ox,oy,pc+P.vx*.4,GY-14,1.05,500);F.push({x:ox,y:oy,vx:v.vx,vy:v.vy,g:500,c:6,s:2.4,dmg:16*LDM,snow:1})}
    if(t>1.05)brEnd(e)}
  else if(a=='skate'){// ⑤ 滑冰冲锋:趴下高速滑行,停不下来,撞到墙才停(不眩晕)
    if(t<.45){e.pz='w';e.f=sgn(dx)}
    else{e.pz=null;e.gs='belly';const nx=e.x+e.f*560*d;
      if(nx<ARL||nx>ARR-e.w){e.x=cl(nx);e.gs=null;e.act=null;e.cd=.6;shake=.45;sfx('boom');burst(e.f>0?ARR:ARL,GY-30,20,['#fff','#d0ebff'],240,{s:3,l:.5,g:400});return}
      e.x=nx;if(Math.random()<dt*30)pt({x:cx-e.f*50,y:GY-2,vx:-e.f*rnd(60,140),vy:rnd(-60,-10),c:pick(['#fff','#d0ebff']),ad:0,s:rnd(2,4),l:.35});
      if(!e.hd&&brHit(e,{x:e.x+5,y:GY-40,w:e.w-10,h:40},18,{kb:e.f*460}))e.hd=1;if(t>4)brEnd(e)}}
  else if(a=='roar'){// ⑥ 冰冻咆哮:范围内减速,持续待在里面 1.2 秒会被冻住 1 秒
    e.pz=t<.6?'w':null;if(t>=.6&&!e.hd){e.hd=1;sfx('roar');sfx('storm');shake=.3;tx('冰冻咆哮!离开它身边!',cx-50,e.y-30,'#a5d8ff')}
    if(t>=.6&&t<3.1){const inR=Math.hypot(pc-cx,P.y+16-(e.y+20))<150;if(inR&&!GM.god){P.slw=Math.max(P.slw||0,.2);P.fzA=(P.fzA||0)+dt;if(P.fzA>=1.2&&!(P.frz>0)){P.frz=1;P.fzA=0;tx('被冻住了!',P.x-10,P.y-20,'#a5d8ff');sfx('zap')}}else P.fzA=Math.max(0,(P.fzA||0)-dt)}
    if(t>3.3){P.fzA=0;brEnd(e)}}
  else if(a=='hug'){// ⑧ 熊抱:站起来张开双臂(明显前摇)→ 扑抱 → 抱住捶地两下 → 扔出去
    if(!e.gs){if(t<.7){e.pz='w';e.f=sgn(dx)}else if(t<.98){e.pz='s';e.x=cl(e.x+e.f*300*d);const hb={x:e.f>0?e.x+e.w-24:e.x-30,y:e.y-20,w:54,h:e.h+20};
        if(ov(P,hb)&&!(P.inv>0)&&!GM.god&&!(P.sk&&P.sk.inv)){e.gs='hold';e.gt=0;P.grab=1;P.sk=null;P.fly=0;tx('被北极熊抱住了!',P.x-20,P.y-24,'#ff8787');sfx('roar')}}
      else if(t>1.5)brEnd(e)}
    if(e.gs=='hold'){e.gt+=dt;e.pz=null;P.x=e.f>0?e.x+e.w-22:e.x-2;P.y=e.y-14+(e.gt>.35&&e.gt<1.25?Math.abs(Math.sin(e.gt*7))*10:0);P.vy=0;P.stun=.2;
      for(const [i,tt] of [[0,.5],[1,.95]])if(e.gt>=tt&&e.n==i){e.n++;sfx('boom');shake=.3;burst(cx+e.f*30,GY-4,14,['#fff','#d0ebff'],200,{s:3,l:.4,g:500});hurt(12*LDM,{inv:.05})}
      if(e.gt>=1.35){P.grab=0;P.y=e.y-20;hurt(16*LDM,{kb:e.f*560,inv:.8});P.vy=-560;P.kbx=e.f*560;tx('被扔出去了!',P.x,P.y-30,'#ff8787');brEnd(e,1.2)}}}
  else if(a=='pillars'){// 冰柱阵(第十六轮,第二阶段起):0.8 秒蓄力 → 玩家两侧各两根冰柱预警(间隔 70),0.9 秒后刺出;站在柱子之间别动,或者跳走
    e.pz=t<.8?'w':null;if(t>=.8&&!e.hd){e.hd=1;sfx('zap');for(const o of [-105,-35,35,105])e.zn.push({x:Math.max(ARL,Math.min(ARR-50,pc+o-25)),w:50,t:0})}if(t>1.4)brEnd(e)}
  else if(a=='aval'){// 雪崩(第十六轮,狂暴起):站起仰天 1 秒 → 3 秒内从天上不断砸下大雪球(落地爆成碎冰)
    e.pz=t<1?'w':null;if(t>=1&&t<4){e.zt=(e.zt||0)-dt;if(e.zt<=0){e.zt=.38;F.push({x:ARL+30+Math.random()*(ARR-ARL-60),y:-20,vx:0,vy:60,g:500,c:6,s:2,dmg:14*LDM,snow:1})}}if(t>4.3)brEnd(e)}
  else if(a=='bliz'){// 大招 · 暴风雪:仰天怒吼 → 8 秒暴风雪(全场减速 + 不断变化的冰刺预警区)→ 跪地喘气 4 秒
    e.pz=t<1?'w':null;e.blz=Math.min(1,t);if(!e.hd){e.hd=1;tx('暴风雪降临!在安全区域间移动!',cx-70,e.y-34,'#d0ebff');sfx('storm')}
    if(t>=1&&t<9){P.slw=Math.max(P.slw||0,.2);e.zt=(e.zt||0)-dt;if(e.zt<=0){e.zt=.95;const n=8,sw=(ARR-ARL)/n,ids=[...Array(n).keys()].sort(()=>Math.random()-.5).slice(0,4);for(const i of ids)e.zn.push({x:ARL+i*sw+6,w:sw-12,t:0})}}
    if(t>=9){e.blz=0;e.bzc=24;e.act=null;e.cd=.5;e.dz=4;e.kn=1;tx('北极熊累得跪下了!全力输出!',cx-60,e.y-30,'#ffd43b')}}
  if(e.act!='bliz')e.blz=Math.max(0,(e.blz||0)-dt)}
function bearFx(e){const t=performance.now()/1000;
  for(const w of e.wv){const wx=w.x-cam,a=1-w.tr/300;x.globalAlpha=Math.max(.2,a);x.save();x.translate(wx,GY);x.scale(w.d,1);
    x.restore();VFX.frame(x,'frost-nova',Math.floor(t*20+w.x*.05)%13,wx,GY-28,1.05,w.d,0,1);x.globalAlpha=1}
  for(const s of e.sp){const sx=s.x-cam;for(let i=0;i<3;i++)VFX.frame(x,'i-cry'+i,3,sx+(i-1)*12,GY+2,i==1?1.3:1,1,0,1)}
  for(const z of e.zn){const zx=z.x-cam;if(z.t<.9)DZ.zone(zx,z.w);
    else{const fa=Math.max(0,1-(z.t-1.1)/.3),fi=Math.min(3,Math.floor((z.t-.9)*20));for(let i=0;i<4;i++){const px=zx+8+i*(z.w-16)/3;VFX.frame(x,'i-cry'+(i%3),fi,px,GY+2,1.3+(i%2)*.3,1,0,fa)}}}
  if(e.act=='roar'&&e.at>=.6&&e.at<3.1){const cx=e.x+e.w/2-cam,cy=e.y+20;x.save();x.globalAlpha=.25+.1*Math.sin(t*10);x.fillStyle=RGD(x,cx,cy,150,['rgba(165,216,255,.6)','rgba(165,216,255,.15)']);x.beginPath();x.arc(cx,cy,150,0,7);x.fill();x.globalAlpha=.8;x.strokeStyle='#d0ebff';x.lineWidth=2;x.setLineDash([6,5]);x.lineDashOffset=-t*30;x.stroke();x.setLineDash([]);x.restore();
    for(let i=0;i<10;i++){const a=t*1.5+i*.628,r=60+((t*60+i*13)%90);CT('❄',cx+Math.cos(a)*r,cy+Math.sin(a)*r,10,'#fff','center',0)}
    if(P.fzA>0){const k=Math.min(1,P.fzA/1.2);RR(x,P.x-cam-4,P.y-14,32,5,2.5,'#1e1829',1);RR(x,P.x-cam-3,P.y-13,30*k,3,1.5,'#74c0fc',0)}}
  if(e.dz>0){const q=performance.now()/90,cx=e.x+e.w/2-cam;for(let i=0;i<3;i++)CT('★',cx+Math.cos(q+i*2.1)*26,e.y-8+Math.sin(q+i*2.1)*5,13,'#ffd43b','center',2.6)}}
function blizDraw(){if(cur!=6||!B||!(B.blz>0))return;const k=B.blz,t=performance.now()/1000;x.fillStyle='rgba(20,40,80,'+.35*k+')';x.fillRect(0,0,VW,VH);if(BFX.ok())for(let i=0;i<6;i++){const sx=((i*151+t*300)%(VW+160))-80,sy=40+(i*67)%220+Math.sin(t*2+i)*14;VFX.frame(x,'b-ice',0,sx,sy,1.4+(i%3)*.3,1,t*(3+i%2*2),.5*k)}
  x.strokeStyle='rgba(255,255,255,'+.7*k+')';x.lineWidth=1.6;x.beginPath();for(let i=0;i<70;i++){const sx=((i*71+t*380)%(VW+120))-60,sy=(i*43+t*260)%VH;x.moveTo(sx,sy);x.lineTo(sx-14,sy+7)}x.stroke()}

// =====================================================================
