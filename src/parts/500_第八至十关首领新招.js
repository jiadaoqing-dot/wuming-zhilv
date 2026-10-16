// ===== 第八~十关首领新招(2026-10-13 第十五轮):大范围、看得清的预警、躲法各不相同 =====
// 怨婴:鬼影回廊 lane(贴地 / 齐头两种鬼群横扫,贴地的跳、齐头的别跳)· 泣血雨 tear(满场血泪,落点预警)· 巨婴之掌 palm(半边场地一掌拍下,二阶段两边各一掌)
// 熔狱魔神:陨火天降 met(陨石斜落,落地爆炸留火)· 熔岩海啸 tsu(贴地熔岩浪横扫,跳过去;狂怒时两边各一道)· 炎狱裂地 crs(火柱从脚下往两边一路炸开)· 熔核爆 nova(场地中间蓄力,大爆炸,跑远)
// 归蝇:黑羽风暴 fth(螺旋弹幕)· 堕天十字光 xb(先贴地横光束要跳,再两道竖光束从两边扫到中间,竖光束够不到地面,站在地上别跳)· 月蚀坠落 ecl(天黑,4 次追踪砸地 + 中间大砸地两道地面冲击波)
// 伤害:这三个首领战期间受到的伤害整体 ×1.35(攻击)×1.35(技能倍率)= BDMK,在 hurt 里乘
const nbNew=()=>({ln:[],tr:[],pm:[],mt:[],ts:[],nv:null,xb:null,ec:0,sw:[]});let NB=nbNew();
const BDMK=()=>bossOn&&(cur>=8&&cur<=10||cur>=12)?1.15:1;  // 第十六轮:原 ×1.82 太疼(一下 40% 血),改成 ×1.15;难度靠星级来加
const nbEnd=e=>e.k=='yin'?yinEnd(e):e.k=='lava'?lavaEnd(e):guiEnd(e);
const NBA={
  lane(e,dt,T){yinFloat(e,dt*.3);const n=e.p3?4:3,gap=e.p3?.85:1.1;e.pz=T<.6?'w':null;
    if(!e.h1){e.h1=1;let lo=Math.random()<.5;for(let i=0;i<n;i++){NB.ln.push({lo,d:i%2?-1:1,t:-i*gap,w:.9,hit:0});lo=!lo}SFXB=1;sfx('y_laugh');SFXB=0;G8.flk=.5}
    if(T>n*gap+1.7)nbEnd(e)},
  tear(e,dt,T){yinFloat(e,dt*.3);e.pz=T<.7?'w':null;
    if(T>=.7&&T<3.8){e.tk=(e.tk||0)-dt;if(e.tk<=0){e.tk=e.p3?.12:.17;const near=Math.random()<.35;NB.tr.push({x:near?P.x+12+rnd(-40,40):ARL+20+Math.random()*(ARR-ARL-40),t:0,w:.75,y:-12})}}
    if(T>4.7)nbEnd(e)},
  palm(e,dt,T){yinFloat(e,dt*.2);if(!e.h1){e.h1=1;const s=P.x+12<(ARL+ARR)/2?-1:1;NB.pm.push({s,t:0,w:1.2,hit:0});if(e.p2)NB.pm.push({s:-s,t:-1.3,w:1.2,hit:0});SFXB=1;sfx('y_cryl',.5,1.2);SFXB=0}
    e.pz=T<1.2?'w':null;if(T>(e.p2?3.4:2.1))nbEnd(e)},
  met(e,dt,T){lavaMove(e,dt,0);e.pz=T<.8?'w':null;
    if(T>=.8&&T<3.4){e.tk=(e.tk||0)-dt;if(e.tk<=0){e.tk=e.p3?.19:.27;const near=Math.random()<.35;NB.mt.push({x:near?P.x+12+rnd(-30,30):ARL+30+Math.random()*(ARR-ARL-60),dr:Math.random()<.5?-1:1,t:0,w:.9})}}
    if(T>4.5)nbEnd(e)},
  tsu(e,dt,T){lavaMove(e,dt,0);e.pz=T<1?'w':null;
    if(!e.h1){e.h1=1;const d=sgn(P.x+12-(e.x+e.w/2))||1;NB.ts.push({d,x:d>0?ARL-10:ARR+10,t:-1,hit:0});if(e.p3)NB.ts.push({d:-d,x:d>0?ARR+10:ARL-10,t:-2.5,hit:0});shake=.3;syn('slam')}
    if(T>(e.p3?5.4:4))nbEnd(e)},
  crs(e,dt,T){lavaMove(e,dt,0);e.pz=T<.6?'w':'s';const cx=e.x+e.w/2;
    if(T>=.6&&!e.h1){e.h1=1;shake=.4;syn('slam');VFX.spawn('earth-rupture',cx,GY,{s:2});
      for(let k=1;k<=13;k++)for(const d of [-1,1]){const x_=cx+d*k*46;if(x_>ARL+10&&x_<ARR-10){V9.pl.push({x:x_,t:-k*.09,w:.45,sm:1});if(e.p3)V9.pl.push({x:x_,t:-1.5-(13-k)*.09,w:.45,sm:1})}}}
    if(T>(e.p3?3.8:2.4))nbEnd(e)},
  nova(e,dt,T){const MID=(ARL+ARR)/2;if(T<.8){e.x+=(MID-e.w/2-e.x)*Math.min(1,dt*4);e.pz='w';return}
    if(!e.h1){e.h1=1;NB.nv={x:MID,t:0,w:1.7,r:e.p3?175:155,h:0};flash('255,120,40',.2)}e.pz=T<2.5?'w':'s';if(T>3.5)nbEnd(e)},
  fth(e,dt,T){const MID=(ARL+ARR)/2;guiTo(e,MID-e.w/2,40,320,dt);guiCl(e);if(T<.8){e.pz='w';return}e.pz='s';
    if(T<4){e.tk=(e.tk||0)-dt;if(e.tk<=0){e.tk=.14;e.ra=(e.ra||0)+.43;const arms=e.p3?3:2,cx=e.x+e.w/2,cy=e.y+e.h*.45;
      for(let i=0;i<arms;i++){const q=e.ra+i*Math.PI*2/arms;F.push({x:cx,y:cy,vx:Math.cos(q)*140,vy:Math.sin(q)*140,ng:1,c:12,dmg:6*LDM,s:.8})}if(Math.random()<.25)syn('fire')}}
    if(T>4.7)nbEnd(e)},
  xb(e,dt,T){const MID=(ARL+ARR)/2;guiTo(e,MID-e.w/2,30,320,dt);guiCl(e);if(!e.h1){e.h1=1;NB.xb={t:0,ha:0,hl:0,hr:0};bsfx('g10_orb')}e.pz=T<1?'w':'s';if(T>4.3)nbEnd(e)},
  ecl(e,dt,T){const pc=P.x+12,MID=(ARL+ARR)/2;
    if(!e.h1){e.h1=1;e.ug=1;e.hide=1;e.dk=-1;bsfx('g10_tele',.8)}
    NB.ec=Math.min(1,T/.6);
    if(T<4.2){if(T<.6){e.ug=1;e.hide=1;return}const k=Math.floor((T-.6)/.9),u=(T-.6)-k*.9;
      if(k!==e.dk){e.dk=k;e.dx=Math.max(ARL+30,Math.min(ARR-30,pc));e.dh=0}
      if(u<.55){e.dx+=(pc-e.dx)*Math.min(1,dt*3);e.ug=1;e.hide=1;return}
      if(!e.dh){e.dh=1;e.hide=0;e.ug=0;e.x=e.dx-e.w/2;e.y=GY-e.h-8;guiCl(e,1);shake=.35;syn('slam');burst(e.dx,GY-8,16,['#b197fc','#e5dbff','#3b2a5a'],260,{s:2.5,l:.4,g:500});ring(e.dx,GY-4,5,60,'#b197fc',.35,5,.25);
        if(Math.abs(pc-e.dx)<40&&P.y+P.h>GY-70)hurt(14*e.dm,{kb:sgn(pc-e.dx)*360})}
      return}
    if(T<4.8){e.hide=0;e.ug=0;guiTo(e,MID-e.w/2,30,600,dt);guiCl(e);e.pz='w';return}
    if(!e.h2){e.h2=1;e.x=MID-e.w/2;e.y=GY-e.h-8;shake=.6;flash('150,110,230',.35);syn('slam');for(const d of [-1,1])NB.sw.push({x:MID,d,hit:0});VFX.spawn('void-implosion',MID,GY-30,{s:2.4});ring(MID,GY-6,8,120,'#b197fc',.45,7,.25);burst(MID,GY-10,30,['#b197fc','#e5dbff','#5f3dc4'],420,{s:3,l:.5,g:500})}
    e.pz=null;guiCl(e,1);if(T>5.8)NB.ec=Math.max(0,(6.3-T)/.5);if(T>6.3){NB.ec=0;nbEnd(e)}}};
// 招式留在场上的东西:每帧推进 + 判定(首领死了全部清掉)
function nbStep(dt){if(!(cur>=8&&cur<=10))return;if(!bossOn||!B||B.hp<=0){if(NB.ln.length||NB.tr.length||NB.pm.length||NB.mt.length||NB.ts.length||NB.nv||NB.xb||NB.ec||NB.sw.length)NB=nbNew();return}
  const pc=P.x+12,dm=B.dm||1,MID=(ARL+ARR)/2;
  for(const l of NB.ln){l.t+=dt;if(l.t<l.w)continue;const u=(l.t-l.w)*560;l.x=l.d>0?ARL-20+u:ARR+20-u;const r={x:l.d>0?l.x-150:l.x,y:l.lo?GY-26:GY-78,w:150,h:l.lo?26:38};
    if(!l.hit&&ov(P,r)&&hurt(11*dm,{kb:l.d*300}))l.hit=1;l.done=u>ARR-ARL+200}NB.ln=NB.ln.filter(l=>!l.done);
  for(const r of NB.tr){r.t+=dt;if(r.t<r.w)continue;r.y+=680*dt;if(r.y>=GY-6){r.d=1;burst(r.x,GY-6,8,['#c92a2a','#9c36b5','#f3d9fa'],150,{s:2,l:.3,g:400});if(Math.abs(pc-r.x)<24&&P.y+P.h>GY-40)hurt(9*dm,{kb:sgn(pc-r.x)*200})}}NB.tr=NB.tr.filter(r=>!r.d);
  for(const m of NB.pm){m.t+=dt;if(m.t>=m.w&&!m.hit){m.hit=1;shake=.55;flash('40,0,60',.3);SFXB=1;sfx('y_hand');SFXB=0;const a=m.s<0?ARL:MID,b=m.s<0?MID:ARR;crack((a+b)/2,4,(b-a)/2);
      for(let i=0;i<5;i++)burst(a+(b-a)*(i+.5)/5,GY-6,10,['#2b0a3d','#9c36b5','#adb5bd'],260,{s:3,l:.45,g:500});if(pc>=a&&pc<=b&&P.y+P.h>GY-150)hurt(22*dm,{kb:-m.s*320})}}NB.pm=NB.pm.filter(m=>m.t<m.w+.8);
  for(const m of NB.mt){m.t+=dt;if(m.t>=m.w&&!m.d){m.d=1;VFX.spawn('warm-explosion',m.x,GY-12,{s:1.6});SFX5('r-burst',m.x,GY-24,{s:1.8,life:.45,gr:.5});shake=Math.max(shake,.25);syn('boom');v9Patch(m.x,50,2.6);
      if(Math.abs(pc-m.x)<42&&P.y+P.h>GY-70&&hurt(16*dm,{kb:sgn(pc-m.x)*320})){heatAdd(20);burnP(2)}}}NB.mt=NB.mt.filter(m=>!m.d);
  for(const w of NB.ts){w.t+=dt;if(w.t<0)continue;w.x+=w.d*300*dt;if(Math.random()<dt*40)pt({x:w.x+rnd(-8,8),y:GY-40+rnd(-6,6),vx:w.d*rnd(40,120),vy:rnd(-160,-60),g:500,c:pick(['#ffd43b','#ff922b','#ff6b35']),s:2,l:.4});
    if(!w.hit&&Math.abs(pc-w.x)<22&&P.y+P.h>GY-44&&hurt(18*dm,{kb:w.d*380})){w.hit=1;heatAdd(30);burnP(3)}w.done=w.d>0?w.x>ARR+60:w.x<ARL-60}NB.ts=NB.ts.filter(w=>!w.done);
  if(NB.nv){const v=NB.nv;v.t+=dt;if(v.t<v.w&&Math.random()<dt*30){const a=Math.random()*6.28,r=v.r*rnd(.6,1);pt({x:v.x+Math.cos(a)*r,y:GY-40+Math.sin(a)*r*.4,vx:-Math.cos(a)*r*1.4,vy:-Math.sin(a)*r*.5,c:pick(['#ffd43b','#ff922b']),s:2,l:.6})}
    if(v.t>=v.w&&!v.h){v.h=1;flash('255,160,60',.5);shake=.7;syn('boom');VFX.spawn('warm-explosion',v.x,GY-30,{s:3.2});SFX5('r-burst',v.x,GY-40,{s:3.4,life:.6,gr:.6});ring(v.x,GY-30,10,v.r,'#ff922b',.5,8);ring(v.x,GY-30,6,v.r*.7,'#ffd43b',.4,5);
      for(const d of [-1,1])v9Patch(v.x+d*v.r*.8,60,3);if(Math.abs(pc-v.x)<v.r&&P.y+P.h>GY-170&&hurt(26*dm,{kb:sgn(pc-v.x)*520})){heatAdd(40);burnP(3)}}
    if(v.t>v.w+.6)NB.nv=null}
  if(NB.xb){const b=NB.xb;b.t+=dt;const t=b.t;
    if(t>=1&&t<1.45&&!b.ha&&P.y+P.h>GY-24&&hurt(14*dm)){b.ha=1}
    if(t>=2.2&&t<3.8){const k=(t-2.2)/1.6,xl=ARL+(MID-ARL)*k,xr=ARR-(ARR-MID)*k;b.xl=xl;b.xr=xr;
      if(!b.hl&&Math.abs(pc-xl)<14&&P.y<GY-38&&hurt(12*dm,{kb:200}))b.hl=1;if(!b.hr&&Math.abs(pc-xr)<14&&P.y<GY-38&&hurt(12*dm,{kb:-200}))b.hr=1}
    if(t>4)NB.xb=null}
  for(const s of NB.sw){s.x+=s.d*380*dt;if(!s.hit&&Math.abs(pc-s.x)<16&&P.y+P.h>GY-26&&hurt(16*dm,{kb:s.d*380}))s.hit=1;s.done=s.x<ARL-20||s.x>ARR+20}NB.sw=NB.sw.filter(s=>!s.done)}
// 画面(PXL 层,怪物之后画)
function nbFx(){if(!bossOn||!B||B.hp<=0)return;const t=performance.now()/1000,MID=(ARL+ARR)/2,pc=P.x+12;
  if(NB.ec>0){const g=x.createRadialGradient(pc-cam,P.y+16,30,pc-cam,P.y+16,200);g.addColorStop(0,'rgba(6,0,16,'+.25*NB.ec+')');g.addColorStop(1,'rgba(6,0,16,'+.78*NB.ec+')');x.fillStyle=g;x.fillRect(0,0,VW,VH);
    if(B.act=='ecl'&&B.hide&&B.dx!=null&&B.at>.6&&B.at<4.2&&!bwSkip()){DZ.zone(B.dx-30-cam,60);x.fillStyle='rgba(177,151,252,'+(.3+.3*Math.sin(t*30))+')';x.fillRect(Math.round(B.dx-cam)-1,0,2,GY)}}
  // 鬼影回廊:预警带 → 一群黑色鬼影高速横穿
  for(const l of NB.ln){const y0=l.lo?GY-26:GY-78,h=l.lo?26:38;
    if(l.t<l.w){if(l.t>-.3&&!bwSkip()){x.fillStyle='rgba(150,60,200,'+(.16+.12*Math.sin(t*20))+')';x.fillRect(Math.round(ARL-cam),y0,ARR-ARL,h);x.fillStyle='rgba(220,150,255,.6)';x.fillRect(Math.round(ARL-cam),y0,ARR-ARL,1);x.fillRect(Math.round(ARL-cam),y0+h-1,ARR-ARL,1);
      for(let i=0;i<5;i++){const ax=(l.d>0?ARL+30:ARR-30)+l.d*i*12-cam;x.fillStyle='rgba(255,210,255,'+(.5+.4*Math.sin(t*20-i))+')';x.fillRect(Math.round(ax),y0+h/2-1,4,3)}}continue}
    for(let i=0;i<4;i++){const gx=l.x-l.d*(18+i*36)-cam,gy=y0+h/2-22+Math.sin(t*16+i)*3;x.save();x.globalAlpha=.9-i*.15;x.filter='brightness(.55) saturate(1.8)';GH8.fr(x,'fly2',Math.floor(t*12+i),gx-26,gy,1.6,l.d);x.restore()}
    x.save();x.globalCompositeOperation='lighter';x.fillStyle='rgba(170,80,230,.35)';x.fillRect(Math.round((l.d>0?l.x-170:l.x)-cam),y0+h/2-3,170,6);x.restore()}
  // 泣血雨
  for(const r of NB.tr){const sx=Math.round(r.x-cam),ry=Math.round(r.y);if(r.t<r.w){DZ.mark(sx,GY-2,12);continue}  // 血泪:暗红描边 + 紫红泪滴 + 高光,后面拖一条残影
    x.fillStyle='rgba(201,42,90,.35)';x.fillRect(sx-1,ry-26,3,16);x.fillStyle='#3a0618';x.fillRect(sx-4,ry-8,9,10);x.fillRect(sx-2,ry-13,5,4);x.fillStyle='#c2255c';x.fillRect(sx-3,ry-7,7,8);x.fillRect(sx-1,ry-12,3,5);x.fillStyle='#f783ac';x.fillRect(sx-2,ry-6,2,3);x.fillStyle='#fff0f6';x.fillRect(sx-2,ry-5,1,1)}
  // 巨婴之掌:半边场地变暗 → 巨大的黑色手掌从天而降
  for(const m of NB.pm){const a=m.s<0?ARL:MID,b=m.s<0?MID:ARR,w=b-a,sx=a-cam;if(m.t<0)continue;
    if(m.t<m.w){const k=m.t/m.w;if(!bwSkip()){DZ.zone(sx,w);x.fillStyle='rgba(10,0,20,'+(.12+.3*k)+')';x.fillRect(Math.round(sx),0,w,GY)}continue}
    const u=m.t-m.w,q=Math.min(1,u/.1),fa=u>.5?Math.max(0,1-(u-.5)/.3):1,ph=150,py=Math.round(GY-ph*q),L=Math.round(sx+w*.12),W=Math.round(w*.76),top=py-200,H=Math.round(ph*.62)+200;x.save();x.globalAlpha=fa;
    // 巨大的黑色婴儿手掌:紫色光晕 + 暗紫手掌 + 亮紫轮廓 + 4 根手指(指节高光)
    x.save();x.globalCompositeOperation='lighter';x.fillStyle='rgba(150,50,210,.28)';x.fillRect(L-6,top,W+12,H+ph*.4+6);x.restore();
    const fing=f=>[Math.round(sx+w*(.14+f*.19)),py+Math.round(ph*.6),Math.round(w*.15),Math.round(ph*.4)];
    x.fillStyle='#d0a2f7';x.fillRect(L-2,top,W+4,H+2);for(let f=0;f<4;f++){const [fx,fy,fw,fh]=fing(f);x.fillRect(fx-2,fy,fw+4,fh+2)}
    x.fillStyle='#2b0f3e';x.fillRect(L,top,W,H);for(let f=0;f<4;f++){const [fx,fy,fw,fh]=fing(f);x.fillRect(fx,fy,fw,fh)}
    x.fillStyle='#4a1d6a';x.fillRect(L+4,top,Math.round(W*.18),H-4);for(let f=0;f<4;f++){const [fx,fy,fw,fh]=fing(f);x.fillRect(fx+2,fy,Math.round(fw*.3),fh-3);x.fillStyle='#7b3fa6';x.fillRect(fx+2,fy+Math.round(fh*.35),fw-4,2);x.fillStyle='#4a1d6a'}
    x.restore()}
  // 陨火天降:预警 + 斜着落下的大火球
  for(const m of NB.mt){const k=Math.min(1,m.t/m.w),sx=m.x-cam;DZ.zone(sx-30,60);const fx=sx-m.dr*220*(1-k),fy=-40+(GY-10+40)*k;
    for(let i=1;i<6;i++){x.fillStyle='rgba(255,'+(140+i*15)+',60,'+(.5-i*.08)+')';x.fillRect(Math.round(fx-m.dr*i*9),Math.round(fy-i*12),5,5)}
    if(VOL9.I)VOL9.fire({s:2.6,vx:m.dr},fx,fy,t)}
  // 熔岩海啸
  for(const w of NB.ts){if(w.t<0){if(w.t>-1){const ex=(w.d>0?ARL:ARR)-cam;x.save();x.globalCompositeOperation='lighter';x.fillStyle=LG(x,0,GY-60,0,GY,['rgba(255,120,30,0)','rgba(255,120,30,'+(.35+.25*Math.sin(t*20))+')']);x.fillRect(Math.round(w.d>0?ex:ex-60),GY-60,60,60);x.restore()}continue}
    const sx=w.x-cam,L=90;for(let i=0;i<L;i+=3){const hh=Math.round(44*(1-i/L)*(.85+.15*Math.sin(t*12+i*.3))),px=Math.round(sx-w.d*i);x.fillStyle=i<6?'#ffe066':i<20?'#ff922b':'#d9480f';x.fillRect(px-(w.d>0?3:0),GY-hh,3,hh);if(i%9==0){x.fillStyle='#ffd43b';x.fillRect(px,GY-hh-1,2,2)}}
    x.save();x.globalCompositeOperation='lighter';C_(x,sx,GY-24,40,RGD(x,sx,GY-24,40,['rgba(255,150,50,.45)','rgba(0,0,0,0)']),0);x.restore()}
  // 熔核爆:地面预警 + 场地中间越来越亮的熔核
  if(NB.nv){const v=NB.nv,sx=v.x-cam;if(v.t<v.w){const k=v.t/v.w;DZ.zone(sx-v.r,2*v.r);x.save();x.globalCompositeOperation='lighter';VFX.frame(x,'x-sun',Math.floor(t*15)%16,sx,GY-40,.4+k*1.3,1,t*2,1);VFX.frame(x,'x-vortex',Math.floor(t*15)%16,sx,GY-40,.3+k*.9,1,-t*3,.7);x.restore();
      x.strokeStyle='rgba(255,160,60,'+(.3+.3*Math.sin(t*25))+')';x.lineWidth=1;x.beginPath();x.ellipse(sx,GY-4,v.r,10,0,0,7);x.stroke()}}
  // 堕天十字光
  if(NB.xb){const b=NB.xb,T=b.t;
    if(T<1){x.fillStyle='rgba(255,224,80,'+(.25+.25*Math.sin(t*30))+')';x.fillRect(Math.round(ARL-cam),GY-24,ARR-ARL,2);x.fillRect(Math.round(ARL-cam),GY-4,ARR-ARL,1)}
    else if(T<1.45){const q=Math.min(1,(T-1)/.06)*Math.min(1,(1.45-T)/.12);x.save();x.globalCompositeOperation='lighter';x.globalAlpha=q;nbBeam((ARL+ARR)/2-cam,GY-14,ARR-ARL,0,1);x.restore()}
    if(T>=1.6&&T<2.2){x.fillStyle='rgba(255,224,80,'+(.25+.25*Math.sin(t*30))+')';for(const xx of [ARL+4,ARR-6])x.fillRect(Math.round(xx-cam),0,2,GY-38)}
    if(T>=2.2&&T<3.8){x.save();x.globalCompositeOperation='lighter';for(const xx of [b.xl,b.xr])nbBeam(xx-cam,(GY-38)/2,GY-38,Math.PI/2,1);x.restore()}}
  // 月蚀坠落的地面冲击波
  for(const s of NB.sw){const sx=s.x-cam;x.save();x.globalCompositeOperation='lighter';for(let i=0;i<4;i++){x.fillStyle='rgba(177,151,252,'+(.7-i*.15)+')';x.fillRect(Math.round(sx-s.d*i*8)-3,GY-26+i*5,6,26-i*5)}x.fillStyle='rgba(240,225,255,.95)';x.fillRect(Math.round(sx)-1,GY-26,3,26);x.restore()}}
