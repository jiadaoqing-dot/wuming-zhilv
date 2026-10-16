// ===== 血月巫王(第七关,第十七轮代替银色狼人):在雪松林深处举行血月仪式、让雪原狼群发狂的巫师。悬浮施法,三种形态 =====
// 形态一「霜袍」:① 冰焰扇射(3 发,减速)② 冰晶柱(玩家脚下 + 两侧魔法阵,冰晶刺出)③ 霜影瞬移(出现在玩家另一侧,放一圈冰焰)
// 形态二「四臂」(60%,变身无敌 1.6 秒):冰焰 5 发、连射两轮;④ 血珠弹幕(三轮红色法球,一轮比一轮准)⑤ 冰焰陨落(天上落冰焰,落点先亮魔法阵)
//   ⑥ 召唤触灵(两只蓝色触灵飘向玩家,碰到或 5 秒后爆开)· 血月狼嚎(召来 2 只发狂的雪原狼犬,场上最多 2 只)
// 形态三「血月真身」(30%):先放大招 ⑧ 血月仪式(升到场地中央上空、无敌,三波血柱:10 格里 7 格,找安全格),之后每 18 秒一次,
//   放完跌落力竭 4 秒(全力输出);⑦ 血棘蔓延(一排血色触手从脚下朝玩家依次钻出)
function wSpawnDog(k,px){const o=mk(k,px,B.lm||12);o.zi=-1;o.sum=1;o.f=px<RX7?1:-1;o.cd=.8;E.push(o);ring(px,GY-4,4,40,'#dee2e6',.35,4,.3);burst(px,GY-10,14,['#fff','#e7f5ff'],180,{s:3,l:.4,g:400})}
function wizImp(e,dt){for(const s of e.S){s.t+=dt;const dx=P.x+12-s.x,dy=P.y+16-s.y,d=Math.hypot(dx,dy)||1;
    if(s.bt<0){s.x+=dx/d*58*dt;s.y+=dy/d*58*dt+Math.sin(s.t*3)*.4;if(d<26||s.t>5)s.bt=0}
    else{s.bt+=dt;if(s.bt>=.45){s.dead=1;VFX.spawn('void-implosion',s.x,s.y,{s:.7});sfx('zap',.6);if(d<46)hurt(14*e.dm,{kb:sgn(dx)*260})}}}
  e.S=e.S.filter(s=>!s.dead)}
function wizStep(e,dt){const hp=e.hp/e.max;
  if(e.act!='morph'){if(e.fm<3&&hp<=.3){e.q=['morph','rite'];e.nf=3}else if(e.fm<2&&hp<=.6&&e.nf!=2){e.q=['morph'];e.nf=2}}
  const d=dt*(e.fm==3?1.3:e.fm==2?1.15:1);arsHz(e,dt);wizImp(e,dt);e.rtc=(e.rtc||0)-dt;
  const cx=e.x+e.w/2,pc=P.x+12,dx=pc-cx,ad=Math.abs(dx),cl=v=>Math.max(ARL,Math.min(ARR-e.w,v));
  if(e.dz>0){e.dz-=dt;e.pz=null;e.sa=0;return}
  e.sa=e.act=='morph'||e.act=='rite'?1:0;
  if(!e.act){e.f=sgn(dx);const sp=ad<150?-70:ad>260?60:0;e.x=cl(e.x+e.f*sp*d);e.pz=null;e.cd-=d;
    if(e.cd<=0){let o=e.q.shift();
      if(!o){const pool=e.fm==1?['fan','fan','col','tp']:e.fm==2?['fan','col','tp','barr','barr','rain','imp']:['barr','rain','rain','thorn','thorn','tp','imp','col'];
        if(e.fm>=2&&E.filter(o=>o.sum).length<2)pool.push('pack');if(e.fm==3&&e.rtc<=0)pool.push('rite','rite');
        o=pick(pool);if(o==e.la&&pool.length>2)o=pick(pool)}
      e.act=o;e.la=o;e.at=0;e.n=0;e.hd=0;e.sg=null}
    return}
  e.at+=d;const a=e.act,T=e.at;
  if(a=='morph'){// 变身:0.6 秒聚力 → 1 秒新旧形态交替闪烁(无敌)
    e.ug=T<1.6?1:0;e.pz=T<.6?'w':null;
    if(!e.hd&&T>=.6){e.hd=1;shake=.45;flash(e.nf==3?'255,60,60':'170,200,255',.45);hitstop(.06);bsfx('l9_roar',.8);VFX.spawn('rift-portal',cx,e.y+e.h/2,{s:1.6,life:1.1,add:1,a:.8})}
    e.mo=T>=.6?Math.min(1,(T-.6)/1):0;if(T>=1.6){e.fm=e.nf;e.mo=0;e.ug=0;arsEnd(e,.5)}}
  else if(a=='fan'){// ① 冰焰扇射
    e.pz=T<.55?'w':null;
    if(T>=.55+e.n*.45&&e.n<(e.fm>=2?2:1)){const n=e.fm>=2?5:3,ox=cx+e.f*24,oy=e.y+e.h*.3,a0=Math.atan2(P.y+16-oy,pc-ox);bsfx('g10_orb',.7);
      for(let i=0;i<n;i++){const q=a0+(i-(n-1)/2)*.17;F.push({x:ox,y:oy,vx:Math.cos(q)*240,vy:Math.sin(q)*240,ng:1,c:18,s:1,sn:1,dmg:12*e.dm})}e.n++}
    if(T>1.5)arsEnd(e)}
  else if(a=='col'){// ② 冰晶柱
    e.pz=T<.4?'w':null;
    if(!e.hd&&T>=.3){e.hd=1;const n=e.fm>=2?5:3;for(let i=0;i<n;i++)e.T.push({k:'ice',x:Math.max(ARL+20,Math.min(ARR-20,pc+(i-(n-1)/2)*80)),t:0,wt:.85,dm:15,sl:1.5});bsfx('g10_tele',.5)}
    if(T>1.2)arsEnd(e)}
  else if(a=='tp'){// ③ 霜影瞬移
    if(T<.3){e.al=1-T/.3;return}
    if(!e.hd){e.hd=1;e.ug=1;e.al=0;const s=pc>(ARL+ARR)/2?-1:1;e.tx=Math.max(ARL+20,Math.min(ARR-e.w-20,pc+s*190-e.w/2));VFX.spawn('rift-portal',cx,e.y+e.h/2,{s:1.2,life:.5,add:1,a:.8});bsfx('g10_tele',.8)}
    if(T<.6)return;
    if(!e.sg){e.sg=1;e.ug=0;e.x=e.tx;e.f=sgn(pc-(e.x+e.w/2));VFX.spawn('rift-portal',e.x+e.w/2,e.y+e.h/2,{s:1.2,life:.5,add:1,a:.8})}
    e.al=Math.min(1,(T-.6)/.25);e.pz=T<1?'w':null;
    if(T>=1&&!e.n){e.n=1;const n=e.fm>=2?10:8,ox=e.x+e.w/2,oy=e.y+e.h*.45;for(let i=0;i<n;i++){const q=i/n*6.283;F.push({x:ox,y:oy,vx:Math.cos(q)*190,vy:Math.sin(q)*190,ng:1,c:e.fm==3?19:18,s:1,sn:e.fm<3?1:0,dmg:11*e.dm})}bsfx('g10_orb',.7)}
    if(T>1.4)arsEnd(e)}
  else if(a=='barr'){// ④ 血珠弹幕
    e.pz=T<.45?'w':null;
    const k=Math.floor((T-.45)/.38);if(T>=.45&&k<3&&k>=e.n){e.n=k+1;const n=e.fm==3?7:5,ox=cx+e.f*30,oy=e.y+e.h*.25,a0=Math.atan2(P.y+16-oy,pc+P.vx*.3-ox);sfx('proj');
      for(let i=0;i<n;i++){const q=a0+(i-(n-1)/2)*(.3-k*.08);F.push({x:ox,y:oy,vx:Math.cos(q)*270,vy:Math.sin(q)*270,ng:1,c:19,s:1,dmg:10*e.dm})}}
    if(T>1.8)arsEnd(e)}
  else if(a=='rain'){// ⑤ 冰焰陨落(冰焰 0.63 秒落地,正好在魔法阵消失时砸下)
    e.pz=T<.5?'w':null;
    if(!e.hd&&T>=.4){e.hd=1;const n=e.fm==3?9:6;for(let i=0;i<n;i++){const px=Math.max(ARL+20,Math.min(ARR-20,pc+rnd(-200,200)));e.Z.push({x:px,w:36,t:-i*.16,wt:.75});e.R.push({x:px,t:-i*.16-.12})}bsfx('g10_wind',.6)}
    if(T>2.4)arsEnd(e)}
  else if(a=='imp'){// ⑥ 召唤触灵
    e.pz=T<.6?'w':null;if(!e.hd&&T>=.6){e.hd=1;bsfx('y_sum',.7);for(const s of [-1,1])e.S.push({x:cx+s*50,y:e.y+20,t:0,bt:-1})}
    if(T>1)arsEnd(e)}
  else if(a=='pack'){// 血月狼嚎
    e.pz=T<.7?'w':null;if(!e.hd&&T>=.5){e.hd=1;bsfx('w_howl',.9);wSpawnDog('dog',ARL+40);wSpawnDog(e.fm==3?'dog2':'dog',ARR-80)}
    if(T>1.1)arsEnd(e)}
  else if(a=='thorn'){// ⑦ 血棘蔓延
    e.pz=T<.45?'w':null;
    if(!e.hd&&T>=.35){e.hd=1;const s=sgn(dx);for(let i=0;i<8;i++){const px=cx+s*(30+i*42);if(px<ARL+8||px>ARR-8)break;arsTen(e,px,.4+i*.09,{c:'B',up:400,f:s,hold:.25})}bsfx('l9_erupt',.7)}
    if(T>1.6)arsEnd(e)}
  else if(a=='rite'){// ⑧ 血月仪式
    const MID=(ARL+ARR)/2,TY=GY-e.h-120,N=10,sw=(ARR-ARL)/N;
    if(!e.hd){e.hd=1;e.rx0=e.x;e.ry0=e.y;e.ult=1;bsfx('w_howl',1);flash('255,40,40',.35);shake=.3}
    e.pz=null;
    if(T<.8){e.ug=1;const k=T/.8;e.x=e.rx0+(MID-e.w/2-e.rx0)*k;e.y=e.ry0+(TY-e.ry0)*k;return}
    if(T<5.8){e.ug=1;e.x=MID-e.w/2;e.y=TY+Math.sin(T*2)*4;
      for(let w=0;w<3;w++)if(T>=1+w*1.6&&e.n==w){e.n++;for(const i of [...Array(N).keys()].sort(()=>Math.random()-.5).slice(0,7))arsGys(e,ARL+(i+.5)*sw,.9,{c:'B',dm:18,wd:sw-4});bsfx('l9_erupt',.8)}
      return}
    e.ult=0;e.ug=0;e.y=Math.min(GY-e.h,e.y+420*dt);if(e.y>=GY-e.h){shake=.3;e.rtc=18;arsEnd(e,.4);e.dz=4}}}
// 两个首领的附加画面(世界坐标,画在本体后面):地面招式、预警、漩涡、潜沙的沙痕、触灵、力竭的星星
function arsFx(e){const t=performance.now()/1000;arsHzDraw(e);
  if(e.k=='andr'){
    if(e.act=='pull'&&e.at<2.6){const cx=e.x+e.w/2-cam;for(const s of [-1,1])VFX.frame(x,'s-tor',Math.floor(t*14)%6,cx+s*(e.w/2+10),GY+3,1.1,s,0,.85);
      for(let i=0;i<6;i++){const k=1-((t*1.6+i/6)%1);VFX.frame(x,'m-dust',Math.floor(t*12+i)%4,cx+(i%2?1:-1)*(40+k*200),GY,.6,i%2?-1:1,0,.7*k)}}
    if(e.ug){const ux=e.ux-cam;for(let i=0;i<9;i+=2)VFX.frame(x,'m-dust',(Math.floor(t*12)+i)%4,ux-(e.udir||1)*i*13,GY,.55,1,0,1-i/10)}}
  else for(const s of e.S){const sx=s.x-cam;if(s.bt>=0)DZ.mark(sx,s.y,24);ARS.fr(x,'imp',t*8+s.x,sx,s.y+30,.85,sgn(P.x+12-s.x),s.bt>=0?.5+.5*Math.sin(t*40):.9)}
  if(e.dz>0){const q=performance.now()/90,cx=e.x+e.w/2-cam;for(let i=0;i<3;i++)CT('★',cx+Math.cos(q+i*2.1)*22,e.y-8+Math.sin(q+i*2.1)*4,12,'#ffd43b','center',2.6)}}
