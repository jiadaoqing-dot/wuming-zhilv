// ===== 地面掉落:装备、蛇蛋、强化石掉在地上(带品质光柱),站在旁边按 S(手机方向盘 ▼)捡起 =====
let GD=[],RTP=0;  // RTP:通关后选择「继续关卡」,首领位置出现回城传送门
// 第四十二轮(用户:打完首领掉落物有时弹到地图外捡不到):首领战里的掉落物(bd)只在当前画面里弹,碰到画面两边弹回来、只落在地面上(不落浮空平台);
// 落地 1.5 秒后自动飞到主角身上捡起(背包满了的装备落在主角脚下,按 S 再捡)
function gdDrop(e,o){const bd=bossOn||e===B,lo=bd?Math.max(12,cam+16):12,hi=bd?Math.min(WW-12,cam+VW-16):WW-12;GD.push({...o,x:Math.max(lo,Math.min(hi,e.x+e.w/2+rnd(-8,8))),y:Math.max(30,Math.min(GY,e.y+e.h/2)),vx:rnd(-1,1)*(e.max?150:50),vy:rnd(-340,-230),t:0,land:0,bn:0,on:null,lo,hi,bd:bd?1:0})}
function gdStep(dt){for(const g of GD){g.t+=dt;
    if(g.bd&&g.land&&!g.nm&&g.t>1.5&&st=='play'&&P.hp>0){const dx=P.x+12-g.x,dy=P.y+P.h-4-g.y,d=Math.hypot(dx,dy);if(d<14){if(!pickUp(1,g)){g.nm=1;g.land=0;g.vx=0;g.vy=0}}else{const v=Math.min(d,(240+g.t*90)*dt);g.x+=dx/d*v;g.y+=dy/d*v}continue}
    if(g.land){if(g.on&&g.on.gone){g.land=0;g.on=null}continue}
    const py=g.y;g.vy+=900*dt;g.x+=g.vx*dt;g.y+=g.vy*dt;if(g.lo!=null&&(g.x<g.lo||g.x>g.hi)){g.x=Math.max(g.lo,Math.min(g.hi,g.x));g.vx=-g.vx*.5}if(g.vy<=0)continue;let sy=null,pp=null;
    if(!g.bd)for(const p of PL)if(!p.gone&&py<=p.y+1&&g.y>=p.y&&g.x>p.x&&g.x<p.x+p.w){sy=p.y;pp=p;break}if(sy==null&&g.y>=GY)sy=GY;
    if(sy!=null){g.y=sy;if(!g.bn&&g.vy>160){g.bn=1;g.vy=-g.vy*.32;g.vx*=.5}else{g.vy=0;g.vx=0;g.land=1;g.on=pp}}}}
const gdNear=g=>Math.abs(g.x-(P.x+12))<44&&g.y>P.y-14&&g.y<P.y+P.h+30;
const gdName=g=>g.k=='add'?'合成添加剂':g.k=='gc'?MISC[g.id][0]:g.k=='ats'?ATSQ[g.it.q].n+'('+atsTxt(g.it)+')':g.k=='gift'?'小礼袋':g.k=='eq'?g.it.n:g.k=='qi'?g.nm+'(主线)':g.k=='egg'?'蛇蛋':g.k=='hegg'?'仓鼠宠物蛋':g.k=='job'?'转职凭证':g.k=='soul'?'女神灵魂碎片':g.k=='stn'?stnName(g.lv,g.q||0):'高级幸运石';
function pickUp(all,only){if(st!='play'||(busy()&&!all))return 0;let n=0,full=0;  // all=1:通关时把地上的东西全部捡起 · only:只捡这一个(首领掉落自动飞到身上)
  for(let i=GD.length-1;i>=0;i--){const g=GD[i];if(only&&g!==only)continue;if(!all&&!gdNear(g))continue;
    if(g.k=='eq'){if(BAG.length>=BAGN){full=1;continue}BAG.push(g.it)}else if(g.k=='egg')MAT.egg=(MAT.egg||0)+g.n;else if(g.k=='hegg')MAT.hegg=(MAT.hegg||0)+g.n;else if(g.k=='stn')STN[g.lv][g.q||0]+=g.n;else if(g.k=='ats')R19.ats.push(g.it);else if(g.k=='gift')MAT.gift=(MAT.gift|0)+g.n;else if(g.k=='luck')LUCK+=g.n;else if(g.k=='add')MAT.add=(MAT.add|0)+g.n;else if(g.k=='gc')MAT[g.id]=(MAT[g.id]|0)+g.n;else if(g.k=='qi')mqAdd(g.n);else if(g.k=='job'){MAT.job=(MAT.job||0)+g.n;tx('打开技能栏(T)即可转职!',P.x-40,P.y-60,'#ffd43b')}else if(g.k=='soul'){MAT.soul=(MAT.soul||0)+g.n;soulHas(0);if(!MAT.sl.includes(g.lv||8))MAT.sl.push(g.lv||8);tx('女神的力量在碎片里微微发光……',P.x-50,P.y-60,'#e5dbff')}
    tx('获得 '+gdName(g)+(g.n>1?' ×'+g.n:''),P.x-20,P.y-20-n*13,g.k=='eq'?(g.it.tr?TRT[g.it.tr][1]:TR[g.it.tier][1]):g.k=='stn'?STQ[g.q||0].c:g.k=='ats'?ATSQ[g.it.q].c:g.k=='qi'||g.k=='job'?'#ffe066':g.k=='soul'?'#e5dbff':'#fff3bf');GD.splice(i,1);n++}
  if(n){sfx('coin');burst(P.x+12,P.y+P.h-4,8,['#ffe066','#fff'],120,{sh:1,s:2,l:.25});save()}if(full)tx('背包已满',P.x-14,P.y-34-n*13,'#ff8787','m');return n}  // 第三十三轮:背包满了装备留在地上,只提示(k='m' 关卡里也显示)
// 掉落物绘制:装备按品质颜色出光柱(史诗最高最亮),道具小光柱
function drawGD(){const t=performance.now()/1000;let near=null;
  for(const g of GD){const px=g.x-cam;if(px<-30||px>VW+30)continue;const col=g.k=='eq'?(g.it.tr?TRT[g.it.tr][1]:TR[g.it.tier][1]):g.k=='qi'||g.k=='job'?'#ffd43b':g.k=='soul'?'#d0bfff':g.k=='stn'?STQ[g.q||0].c:g.k=='egg'||g.k=='hegg'?'#ffe8a3':'#69db7c',tier=g.k=='eq'?g.it.tier:g.k=='qi'?1:g.k=='job'||g.k=='soul'||g.k=='hegg'?3:g.k=='stn'?(g.q||0):0,bob=g.land?Math.sin(t*3+g.x)*1.6:0,iy=g.y-9+bob;
    if(g.land){const hgt=[40,60,84,110][tier],a=.4+.15*Math.sin(t*4+g.x);x.save();x.globalCompositeOperation='lighter';x.globalAlpha=a;x.fillStyle=LG(x,0,g.y-hgt,0,g.y,['rgba(0,0,0,0)',col]);x.fillRect(px-5-tier,g.y-hgt,10+tier*2,hgt);x.globalAlpha=a*1.4;E_(x,px,g.y-1,10+tier*2,3,col,0);x.restore();
      if(tier>=2)for(let i=0;i<tier;i++){const k=(t*.7+i/tier+g.x*.01)%1;C_(x,px+Math.sin(i*2.3+t)*7,g.y-k*hgt,1.2,col,0)}}
    if(g.k=='eq'){C_(x,px,iy,8.5,RGD(x,px-2,iy-3,10,['#fff',col]),1.3);eqDraw(g.it,px,iy,17)}
    else if(g.k=='egg'){E_(x,px,iy+2,5,6.4,LG(x,0,iy-5,0,iy+8,['#fffdf0','#f3d9a4']),1.2);C_(x,px-1.6,iy,1,'#d9a65a',0);C_(x,px+1.8,iy+3,1.2,'#d9a65a',0)}
    else if(g.k=='stn')stnDraw(x,g.lv,g.q||0,px,iy)
    else if(g.k=='qi'){RR(x,px-6,iy-7,12,14,2.5,LG(x,0,iy-7,0,iy+7,['#fff9db','#f2d08a']),1.2);LN_(x,[[px-3,iy-3],[px+3,iy-3]],'#a0703a',.9);LN_(x,[[px-3,iy],[px+3,iy]],'#a0703a',.9);LN_(x,[[px-3,iy+3],[px+1,iy+3]],'#a0703a',.9);CT('!',px+6,iy-5,8,'#ffd43b','center',2,'#7a3a08')}
    else if(g.k=='job'){RR(x,px-7,iy-8,14,16,3,LG(x,0,iy-8,0,iy+8,['#fff3bf','#f59f00']),1.3);CT('⚜',px,iy+4,10,'#7a3a08','center',0)}
    else if(g.k=='soul')soulDraw(x,px,iy,t)
    else if(g.k=='hegg')MYST.fr(x,'egg',0,px-9,iy-12,1)
    else if((g.k=='add'||g.k=='gc')&&MENI.I){x.save();x.imageSmoothingEnabled=false;x.drawImage(MENI.I,MENI.P[g.k=='add'?'add':g.id]*34,0,34,34,Math.round(px-9),Math.round(iy-9),18,18);x.restore()}  // 第四十轮:合成添加剂 / 上帝卡牌
    else{CT('🍀',px,iy+4,11,'#fff','center',0)}
    if(g.land&&gdNear(g)&&(!near||Math.abs(g.x-P.x)<Math.abs(near.x-P.x)))near=g}
  GDN=near}
// 「S 拾取」提示画在角色头顶(画在角色之后,不会被挡住)
let GDN=null;
function drawGDHint(){if(!GDN||st!='play'||!GD.includes(GDN))return;const px=P.x+12-cam,py=P.y-40+Math.sin(performance.now()/180)*1.5,q='S 拾取';RR(x,px-25,py-11,50,16,8,LG(x,0,py-11,0,py+5,['#5c4a7a','#2a1f3c']),1.3);CT(q,px,py+1,9.5,'#ffe066','center',2.2,'#120d18');PG(x,[[px-4,py+5],[px+4,py+5],[px,py+9]],'#2a1f3c',0)}
// 回城传送门(通关后继续留在本关时出现在首领场地中间)
const RPX=()=>cur>=5?ARR-180:WW-200,nearRP=()=>RTP&&st=='play'&&Math.abs(P.x+12-RPX())<34&&P.gr;
// 通关光柱:首领倒下后出现在首领场地中间,站上去按 W / ▲ 才算通关。章节结束画面 / 漫画只在初次通关时播放
let CLRP=0;const nearCP=()=>CLRP&&st=='play'&&Math.abs(P.x+12-RPX())<30&&P.gr;
function clearGo(){if(!nearCP())return false;CLRP=0;pickUp(1);const first=!CLR.includes(cur);if(first)CLR.push(cur);if(!(STAR[cur]>=LVSTAR))STAR[cur]=LVSTAR;save();sfx('lvl');  // 第十六轮:记录通关星级
  st='won';CHI=0;return true}
function drawCP(){if(!CLRP)return;const t=performance.now()/1000,px=RPX()-cam;if(px<-60||px>VW+60)return;
  x.save();x.globalCompositeOperation='lighter';const w=22+Math.sin(t*4)*3,g=x.createLinearGradient(px-w,0,px+w,0);g.addColorStop(0,'rgba(255,200,60,0)');g.addColorStop(.5,'rgba(255,236,153,.85)');g.addColorStop(1,'rgba(255,200,60,0)');x.fillStyle=g;x.fillRect(px-w,0,2*w,GY);
  x.fillStyle='rgba(255,255,255,.7)';x.fillRect(px-3,0,6,GY);for(let i=0;i<12;i++){const k=(t*.5+i/12)%1;C_(x,px+Math.sin(i*2.3+t*3)*14,GY-k*GY,1.8,'#fff3bf',0)}x.restore();
  E_(x,px,GY-2,30,6,'rgba(255,236,153,.6)',1.2);PLQ(x,px,GY-110,'通关光柱','站上来按 W 通关')}
function drawRP(){if(!RTP)return;const t=performance.now()/1000,px=RPX()-cam,py=GY-40;if(px<-60||px>VW+60)return;
  const g=x.createRadialGradient(px,py,2,px,py,30);g.addColorStop(0,'rgba(255,255,255,.95)');g.addColorStop(.4,'rgba(255,236,153,.85)');g.addColorStop(1,'rgba(240,140,0,.5)');x.fillStyle=g;x.beginPath();x.ellipse(px,py,20,38,0,0,7);x.fill();
  for(let i=0;i<3;i++){x.strokeStyle='rgba(255,255,255,.8)';x.lineWidth=1.6;x.beginPath();x.ellipse(px,py,15-i*5,30-i*9,0,t*3+i*2,t*3+i*2+2.4);x.stroke()}
  for(let i=0;i<6;i++){const k=(t*.8+i/6)%1;C_(x,px+Math.cos(i*2+t)*18*(1-k),py+Math.sin(i*2+t)*34*(1-k),1.4,'#fff3bf',0)}
  PLQ(x,px,GY-96,'回城传送门','按 W 返回城镇')}
