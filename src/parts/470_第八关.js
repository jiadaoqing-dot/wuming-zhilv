// ===== 第七关场景 =====
// 月亮:巫王第二形态变大,第三形态变成血月,血月仪式时是巨大的血月;巫王倒下后慢慢恢复
function moon7(){const b=bossOn&&B&&B.k=='wiz'&&B.hp>0,tg=b?(B.ult?2.8:B.fm>=2?2.2:1.3):1,tr=b&&B.fm>=3?1:0;MOONK+=(tg-MOONK)*.02;MOONR+=(tr-MOONR)*.03;
  const r=24*MOONK,sx=500,sy=62+MOONK*14,col=MOONR>.5?['#ffe3e3','#ff8787','#a61e1e']:['#ffffff','#eef3ff','#b9c6e8'];
  C_(x,sx,sy,r*2.6,RGD(x,sx,sy,r*2.6,[MOONR>.5?'rgba(255,120,120,.45)':'rgba(220,230,255,.45)','rgba(0,0,0,0)']),0);C_(x,sx,sy,r,RGD(x,sx-r*.3,sy-r*.3,r*1.3,col),1.4);
  for(const [a,b2,rr] of [[-.3,-.2,.2],[.3,.25,.24],[.15,-.4,.12]])C_(x,sx+a*r,sy+b2*r,rr*r,MOONR>.5?'rgba(140,30,30,.35)':'rgba(150,165,205,.4)',0)}
function claw7(px,s){x.save();x.translate(px-cam,GY+4);x.scale(s,s*.42);x.fillStyle='rgba(45,55,95,.55)';x.beginPath();x.ellipse(0,0,7,6,0,0,7);x.fill();
  for(const [a,b] of [[-7,-9],[-2.5,-12.5],[2.5,-12.5],[7,-9]]){x.beginPath();x.ellipse(a,b,2.3,3.2,0,0,7);x.fill();x.fillRect(a-.6,b-9,1.2,4.6)}x.restore()}
function lv7Draw(){const t=performance.now()/1000;
  for(const [i,px] of CP7.entries()){if(px-cam<-80||px-cam>VW+80)continue;const s=.7+i/(CP7.length-1)*2.7;claw7(px,s);claw7(px+26*s*.6,s*.95)}
  if(bossOn){for(const wx of [ARL-26,ARR]){const bx=wx-cam;RR(x,bx,0,26,GY+2,6,LG(x,bx,0,bx+26,0,['#3d2a1e','#5c3d28','#2e1f15']),1.4);for(let i=0;i<5;i++)E_(x,bx+13,40+i*52,15,4,'#ffffff',1)}}
  // 夜色:越往里走越暗;银月咆哮时一片银光;血月时泛红
  const k=bossOn?1:Math.min(1,cam/2560);x.fillStyle='rgba(10,14,42,'+(.06+.4*k)+')';x.fillRect(0,0,VW,GY+70);
  if(B&&B.k=='wiz'&&B.hp>0&&bossOn){if(B.ult){x.fillStyle='rgba(150,0,20,'+(.16+.06*Math.sin(t*3))+')';x.fillRect(0,0,VW,VH)}else if(B.fm>=3){x.fillStyle='rgba(120,0,20,.1)';x.fillRect(0,0,VW,VH)}}
  // 飘雪(巫王倒下后变成大雪)
  const n=performance.now()-W7E<9000?90:36;x.globalAlpha=.85;for(let i=0;i<n;i++){const sp=(i%3)+1,fx=((i*97-cam*.4+Math.sin(t+i)*14)%VW+VW)%VW,fy=(t*20*sp+i*53)%GY;C_(x,fx,fy,.8+sp*.45,'#ffffff',0)}x.globalAlpha=1}
function lv7Update(dt){HOWLT-=dt;if(HOWLT<=0&&!bossOn){HOWLT=rnd(14,24);sfx('howl');tx('远处传来狼嚎……',P.x-30,P.y-50,'#dee2e6')}
  if(!DOOR7&&P.x>2470){DOOR7=1;banner('这些爪印……根本不是普通的狼留下的!');sfx('howl')}}

// =====================================================================
// ===== 第八关 · 幽魂都市(2026-10-13):城市街道 → 老旧居民楼 → 废弃医院 → 地下通道 → 地铁出口外的十字路口(首领)=====
// 场景图集 CITY8(art_src/city/build_city8.py:Streets of Fight / Warped City,ansimuz,CC0 + 自画);怪物图集 GH8(art_src/city/build_gh8.py)
// 小怪:游魂 gfly(飞行:盘旋、俯冲、鬼火、虚化穿墙后 0.3 秒实体化前摇)· 厉鬼 gfly2(精英:再加「消失 → 黑影 → 从侧面高速冲过」)
//       提灯幽魂 gland(贴地慢飘:鬼手、变黑冲撞,撞墙穿墙消失)· 伪装的怨灵 gland2(精英:先伪装成路人,靠近才现形扑上来)
// 首领:怨婴 · 银太郎 yin(很小的身体 + 巨大的黑色婴儿投影)。一阶段 哭声冲击 / 瞬移 / 鬼爪;60% 起 召唤鬼魂(场上最多 4 只)/ 黑色摇篮;
//       30% 起 暴走(BGM 停,只剩婴儿哭声):哭声连锁(多处鬼手)/ 黑影爬行;13% 时「百鬼哭夜」:路灯熄灭、窗户一扇扇亮起鬼影、只剩身边一圈视野,约 10 秒连招后大硬直
// =====================================================================
const PL8=[{x:0,y:GY,w:WW},{x:300,y:226,w:96},{x:560,y:196,w:80},{x:820,y:230,w:112},{x:1060,y:204,w:96},{x:1300,y:170,w:80},{x:1500,y:220,w:96},{x:1720,y:196,w:112},{x:1990,y:226,w:96},{x:2140,y:184,w:80},{x:2360,y:214,w:112},
  {x:2640,y:222,w:80},{x:2830,y:186,w:112},{x:3060,y:222,w:80}];
const E8=[['gland2',430],['gland',300],['gfly',560],['gland',720],['gfly',860],
  ['gfly',1050],['gland',1150],['gland2',1260],['gfly2',1380],['gland',1500],
  ['gfly2',1700],['gland',1800],['gfly',1950],['gland2',2080],['gland',2160],
  ['gfly2',2300],['gland2',2420],['gfly',2520],['gland',2600]];
const COV8=[{x:2712,w:34},{x:3010,w:34}];  // 首领场地的两台自动售货机:躲在后面可以挡住哭声冲击
let G8={};
function g8Init(){G8={dk:.1,flk:0,cr:[],hd:[],cl:[],ds:[],vis:0,vk:0,lampOff:0,wn:0,bk:0,bn:0,W:null}}
// 2026-10-13 第十二轮:第八~十关小怪追杀 —— 不再关在自己的区域里(左边界 = 关卡起点),离玩家越远走得越快(chV),出招间隔缩短
const chV=(v,ad)=>v*(ad>300?2.4:ad>160?1.6:1.1),chL=(ad,dt,k)=>Math.min(1,dt*(ad>300?2.8:ad>180?1.8:k));
const g8Lo=e=>e.zi>=0?0:ARL,g8Hi=e=>e.zi>=0?ZB[e.zi]:ARR;
const g8Ground=()=>P.y+P.h>=GY-6;
// ---- 飞行鬼魂 ----
function gflyStep(e,dt){const el=e.k=='gfly2',dm=e.dm,cx=e.x+e.w/2,pc=P.x+12,dx=pc-cx,ad=Math.abs(dx),lo=g8Lo(e),hi=g8Hi(e),cl=v=>Math.max(lo,Math.min(hi-e.w,v));
  e.cd=(e.cd==null?rnd(1,2):e.cd)-dt;e.pz=null;e.gs=(e.gs||0)+dt;const s=e.s;if(s)e.t+=dt;
  if(s=='ph'){e.ug=1;const k=Math.min(1,e.t/e.pd);e.x=e.px0+(e.tx-e.px0)*k;e.y=e.py0+(e.ty-e.py0)*k;if(k>=1){e.ug=0;e.s='mat';e.t=0}return}  // 虚化穿墙
  if(s=='mat'){e.pz='w';if(e.t>=.3){e.s=null;e.cd=Math.min(e.cd,.3)}return}  // 0.3 秒实体化前摇(这时可以打)
  if(s=='dvw'){e.pz='w';e.f=sgn(dx)||e.f;if(e.t>=.45){e.s='dv';e.t=0;e.tx=pc;e.ty=Math.min(GY-e.h,P.y+P.h-e.h);e.px0=e.x;e.py0=e.y;e.hd=0;syn('dash')}return}
  if(s=='dv'){e.pz='s';const k=Math.min(1,e.t/.32);e.x=cl(e.px0+(e.tx-e.w/2-e.px0)*k);e.y=e.py0+(e.ty-e.py0)*k*k;
    if(!e.hd&&ov(P,e)&&hurt(9*dm,{kb:e.f*240}))e.hd=1;if(k>=1){e.s='up';e.t=0}return}
  if(s=='up'){e.y+=(e.by-e.y)*Math.min(1,dt*3);if(e.t>.8){e.s=null;e.cd=rnd(.8,1.4)}return}
  if(s=='fbw'){e.pz='w';e.f=sgn(dx)||e.f;if(e.t>=.5){e.s='rec';e.t=0;F.push({x:cx+e.f*12,y:e.y+e.h*.45,vx:e.f*70,vy:0,ng:1,hm:1,hl:5,c:8,dmg:8*LDM,s:1})}return}
  if(s=='gdv'){e.ug=1;if(e.t<.5)return;  // 精英:消失 → 黑影出现在玩家侧面 → 高速冲过
    if(!e.gd0){e.gd0=1;const d=Math.random()<.5?-1:1;e.gdx=d;e.x=pc-d*230-e.w/2;e.y=Math.min(GY-e.h,P.y+P.h-e.h);e.f=d}
    if(e.t<1){e.pz='w';return}e.ug=0;e.pz='s';e.x+=e.gdx*720*dt;
    if(!e.hd&&ov(P,e)&&hurt(12*dm,{kb:e.gdx*420})){e.hd=1;P.stun=Math.max(P.stun||0,.45)}
    if(e.t>1.6||e.x<lo-80||e.x>hi+80){e.x=cl(e.x);e.s='ph';e.t=0;e.px0=e.x;e.py0=e.y;e.tx=cl(pc+rnd(-120,120)-e.w/2);e.ty=e.by;e.pd=.8}return}
  if(s=='rec'){if(e.t>.5){e.s=null;e.cd=rnd(.7,1.3)}return}
  // 平时:在玩家斜上方盘旋(不贴脸),偶尔虚化穿过建筑换到另一边
  if(!e.side)e.side=Math.random()<.5?-1:1;
  const hx=pc+e.side*(95+40*Math.sin(e.gs*.7+e.ph)),hy=e.by+Math.sin(e.gs*2+e.ph)*14;
  e.x=cl(e.x+(hx-e.w/2-e.x)*chL(ad,dt,.9));e.y+=(hy-e.y)*Math.min(1,dt*1.5);e.f=sgn(dx)||e.f;if(Math.random()<dt*.12)e.side*=-1;
  if(e.cd<=0&&ad<440){const r=Math.random();
    if(r<.2){e.s='ph';e.t=0;e.px0=e.x;e.py0=e.y;e.side*=-1;e.tx=cl(pc+e.side*110-e.w/2);e.ty=e.by;e.pd=.7;e.cd=.5;return}
    const n=el&&r>.62?'gdv':r>.58?'fbw':'dvw';if(!tok(e,n=='fbw')){e.cd=.3;return}e.s=n;e.t=0;e.hd=0;e.gd0=0}}
// ---- 陆地鬼魂 ----
function glandStep(e,dt){const el=e.k=='gland2',dm=e.dm,cx=e.x+e.w/2,pc=P.x+12,dx=pc-cx,ad=Math.abs(dx),lo=g8Lo(e),hi=g8Hi(e),cl=v=>Math.max(lo,Math.min(hi-e.w,v));
  e.cd=(e.cd==null?rnd(1,2):e.cd)-dt;e.pz=null;const s=e.s;if(s)e.t+=dt;
  if(e.dis){e.f=sgn(dx)||e.f;const alone=e.zi>=0&&!E.some(o=>o!==e&&o.hp>0&&o.zi==e.zi&&!o.dis)&&!(WQ[e.zi]&&WQ[e.zi].length);e.al8=alone?(e.al8||0)+dt:0;  // 同区只剩假人:1.5 秒后自己现形
    if((ad<80&&Math.abs(P.y+P.h-GY)<50)||e.hp<e.hp0||e.al8>1.5){e.dis=0;e.s='rv';e.t=0;flash('60,0,20',.35);shake=.3;syn('roar');VFX.spawn('smoke-puff',cx,e.y+e.h/2,{s:1.4});tx('是鬼!',cx-8,e.y-22,'#ff8787')}return}  // 假人:靠近才现形
  if(s=='rv'){e.pz='w';if(e.t>.35){e.s='lg';e.t=0;e.hd=0;e.f=sgn(dx)||e.f}return}
  if(s=='lg'){e.pz='s';e.x=cl(e.x+e.f*380*dt);if(!e.hd&&ov(P,e)&&hurt(11*dm,{kb:e.f*320}))e.hd=1;if(e.t>.32){e.s='rec';e.t=0}return}
  if(s=='hdv'){e.ug=1;  // 鬼手:沉进地里 → 玩家脚下黑色预警 → 伸手抓(没躲开就被定身)
    if(e.t>=.35&&!e.hd){e.hd=1;g8Hand(pc,.8,8*dm)}
    if(e.t>=1.6&&!e.h2){e.h2=1;e.x=cl(pc+(Math.random()<.5?-1:1)*rnd(60,110)-e.w/2);VFX.spawn('smoke-puff',e.x+e.w/2,e.y+e.h/2,{s:1})}
    if(e.t>=1.9){e.ug=0;e.s='rec';e.t=0}return}
  if(s=='rmw'){e.pz='w';e.dark=1;if(e.t>=.6){e.s='rm';e.t=0;e.hd=0;syn('dash')}return}  // 变黑 → 贴地高速冲撞
  if(s=='rm'){e.pz='s';e.dark=1;const nx=e.x+e.f*430*dt;if(nx<lo+2||nx+e.w>hi-2){e.s='wv';e.t=0;e.ug=1;return}e.x=nx;
    if(!e.hd&&ov(P,{x:e.x,y:e.y+e.h*.4,w:e.w,h:e.h*.6})&&hurt(10*dm,{kb:e.f*360}))e.hd=1;if(e.t>1.6){e.s='rec';e.t=0}return}
  if(s=='wv'){if(e.t>.8){e.ug=0;e.dark=0;e.f*=-1;e.x=cl(e.f>0?lo+10:hi-e.w-10);VFX.spawn('smoke-puff',e.x+e.w/2,e.y+e.h/2,{s:1});e.s='rec';e.t=0}return}  // 撞墙穿墙消失,另一头冒出来
  if(s=='rec'){e.dark=0;if(e.t>.6){e.s=null;e.cd=rnd(.8,1.4)}return}
  e.f=sgn(dx)||e.f;if(ad>40)e.x=cl(e.x+e.f*chV(el?42:34,ad)*dt);
  if(e.cd<=0&&ad<380&&Math.abs(P.y+P.h-GY)<160){const n=ad<220&&Math.random()<.45?'rmw':'hdv';if(!tok(e)){e.cd=.3;return}e.s=n;e.t=0;e.hd=0;e.h2=0}}
// ---- 场景效果:鬼手 / 鬼爪 / 黑影冲刺 / 哭声 ----
function g8Hand(px,w,dmg){G8.hd.push({x:px,t:0,w,dmg:dmg||8*LDM,hit:0})}
function g8Claw(d,w){const lo=bossOn?ARL:cam,hi=bossOn?ARR:cam+VW;G8.cl.push({d,t:0,w,lo,hi,low:Math.random()<.55,x:P.x+12,hit:0});SFXB=1;sfx('y_claw');SFXB=0}
function g8Dash(w){const d=Math.random()<.5?1:-1;G8.ds.push({d,t:0,w,y:Math.min(GY,P.y+P.h),x:d>0?cam-70:cam+VW+70,hit:0})}
const g8Cov=sx=>{const pc=P.x+12;return bossOn&&P.y+P.h>GY-58&&COV8.some(c=>{const cc=c.x+c.w/2;return (sx<cc)==(cc<pc)&&Math.abs(pc-cc)<80})};
function g8Step(dt){const pc=P.x+12;
  if(G8.flk>0)G8.flk-=dt;G8.vk+=(G8.vis-G8.vk)*Math.min(1,dt*2);
  for(const h of G8.hd){h.t+=dt;if(!h.hit&&h.t>=h.w+.06){h.hit=1;if(Math.abs(pc-h.x)<24&&g8Ground()){SFXB=1;sfx('y_hand');SFXB=0;if(hurt(h.dmg)){P.frz=Math.max(P.frz||0,.9);tx('被鬼手抓住了!',P.x-24,P.y-26,'#d0bfff')}}}}
  G8.hd=G8.hd.filter(h=>h.t<h.w+.7);
  for(const c of G8.cl){c.t+=dt;const k=g8ClawK(c);if(k>.3&&!c.hit){const r=g8ClawR(c,k);if(ov(P,r)&&hurt(11*LDM,{kb:(c.d=='L'?1:c.d=='R'?-1:sgn(pc-c.x))*380}))c.hit=1}}
  G8.cl=G8.cl.filter(c=>c.t<c.w+.85);
  for(const s of G8.ds){s.t+=dt;if(s.t<s.w)continue;s.x+=s.d*780*dt;if(!s.hit&&Math.abs(s.x-pc)<26&&Math.abs(s.y-(P.y+P.h))<40&&hurt(12*LDM,{kb:s.d*420})){s.hit=1;P.stun=Math.max(P.stun||0,.45)}}
  G8.ds=G8.ds.filter(s=>s.t<s.w||(s.d>0?s.x<cam+VW+90:s.x>cam-90));
  for(const r of G8.cr){r.t+=dt;const R_=r.t*380,dd=Math.hypot(pc-r.x,P.y+16-r.y);if(!r.hit&&R_>=dd){r.hit=1;
    if(g8Cov(r.x)){tx('躲在掩体后面,挡住了哭声!',P.x-50,P.y-30,'#b2f2bb')}else if(hurt(8*LDM*(r.big?1.3:1))){P.stun=Math.max(P.stun||0,.35);slowP(3);P.cryT=4;tx('哭声:移动、技能变慢!',P.x-40,P.y-40,'#d0bfff')}}}
  G8.cr=G8.cr.filter(r=>r.t*380<720);
  if(P.cryT>0)P.cryT-=dt;
  // 段落提示
  const bn=[[980,'老旧居民楼……灯越来越暗了'],[1620,'废弃医院 · 走廊尽头传来婴儿的哭声'],[2250,'地下通道 · 小心脚下'],[2600,'……婴儿的笑声?']];
  while(G8.bn<bn.length&&P.x>bn[G8.bn][0]){banner(bn[G8.bn][1]);if(G8.bn==3){SFXB=1;sfx('y_laugh');SFXB=0;G8.flk=.6}G8.bn++}}
// 鬼爪:w 秒预警 → 0.2 秒伸出 → 停 0.35 秒 → 0.3 秒缩回
function g8ClawK(c){const u=c.t-c.w;return u<0?0:u<.2?u/.2:u<.55?1:Math.max(0,1-(u-.55)/.3)}
function g8ClawR(c,k){const L=(c.hi-c.lo)*.72,y0=c.low?GY-46:GY-128,h=c.low?46:62;
  return c.d=='L'?{x:c.lo,y:y0,w:L*k,h}:c.d=='R'?{x:c.hi-L*k,y:y0,w:L*k,h}:{x:c.x-34,y:0,w:68,h:GY*k}}
// ---- 首领:怨婴 · 银太郎 ----
function yinSwipe(e){const cx=e.x+e.w/2,cy=e.y+e.h/2;VFX.spawn('m-claw2',cx+e.f*20,cy,{f:e.f,s:2});if(Math.hypot(P.x+12-cx,P.y+16-cy)<62)hurt(10*e.dm,{kb:e.f*380})}
function yinSum(e){const n=E.filter(o=>o.sum&&o.k!='cradle'&&o.hp>0).length;if(n>=4)return;const pc=P.x+12;
  for(let i=0;i<Math.min(2,4-n);i++){const k=Math.random()<.5?'gfly':'gland',px=Math.max(ARL+20,Math.min(ARR-60,pc+(i?1:-1)*rnd(120,220))),o=mk(k,px,e.lm||14);o.zi=-1;o.sum=1;o.cd=.8;E.push(o);VFX.spawn('smoke-puff',o.x+o.w/2,o.y+o.h/2,{s:1.2})}}
function cradleNew(e){const w=52,h=44,o={k:'cradle',x:2875-w/2,y:GY-h,w,h,hp:Math.round(e.max*.07),fl:0,f:1,ph:0,m:e.lm||14,dm:1,zi:-1,sum:1,def:20,vs:1,sp:2.5,rk:0,o:2849};o.hp0=o.hp;return o}
function cradleStep(e,dt){e.rk+=dt;e.sp-=dt;if(e.sp<=0){e.sp=5.5;if(B&&B.hp>0){SFXB=1;sfx('y_cradle');SFXB=0;const n=E.filter(o=>o.sum&&o.k!='cradle'&&o.hp>0).length;
  if(n<4){const o=mk('gland',e.x+e.w/2+(Math.random()<.5?-1:1)*50,B.lm||14);o.zi=-1;o.sum=1;o.cd=1;E.push(o);VFX.spawn('smoke-puff',o.x+o.w/2,o.y+o.h/2,{s:1.2});tx('摇篮里爬出了鬼魂!',e.x-10,e.y-14,'#d0bfff')}}}}
function yinFloat(e,dt){const pc=P.x+12,dx=pc-(e.x+e.w/2);e.f=sgn(dx)||e.f;const tx_=pc-e.f*150;e.x=Math.max(ARL+10,Math.min(ARR-10-e.w,e.x+(tx_-e.w/2-e.x)*Math.min(1,dt*.8)));
  const hy=GY-e.h-22+Math.sin(e.fy*2)*6;e.y+=(hy-e.y)*Math.min(1,dt*3)}
// 第十六轮重做(怨婴):旧招(哭声 / 瞬移爪 / 鬼爪 / 召唤 / 摇篮 / 鬼手阵 / 黑影爬行 / 百鬼哭夜)删除;新招:鬼婴瞬爪 tpc / 怨念回音 echo / 鬼手牢笼 cage;保留第十五轮的 鬼影回廊 lane / 泣血雨 tear / 巨婴之掌 palm
function yinStep(e,dt){const cx=e.x+e.w/2,pc=P.x+12,hp=e.hp/e.max;e.pz=null;e.fy=(e.fy||0)+dt;
  const on=['echo','cage','tpc'].includes(e.act)&&!e.ug;e.pj=(e.pj||0)+((on?1:0)-(e.pj||0))*Math.min(1,dt*4);
  if(!e.intro){e.intro=1;SFXB=1;sfx('y_laugh');SFXB=0;G8.flk=.8}
  if(!e.p2&&hp<=.6){e.p2=1;banner('银太郎哭得更凶了……')}
  if(!e.p3&&hp<=.3){e.p3=1;banner('怨婴暴走!');shake=.4;flash('80,0,20',.3);BSF=1;e.cl8=sfx('y_cryl',.55,900);BSF=0}
  if(e.dz>0){e.dz-=dt;e.y+=(GY-e.h-e.y)*Math.min(1,dt*4);return}
  const sp=e.p3?1.4:1;
  if(e.act){const a=e.act;e.at+=dt*sp;const T=e.at;if(a!='tpc')e.ug=0;if(NBA[a]){NBA[a](e,dt,T);return}
    if(a=='tpc'){const k=Math.floor(T/1.1),u=T-k*1.1,n=e.p3?2:1;if(k>=n){e.ug=0;if(T>n*1.1+.3)yinEnd(e);return}  // 0.25 秒消失 → 出现在玩家身侧 → 0.35 秒前摇 → 一爪(暴走两次)
      if(u<.25){e.ug=1;if(e.hk!==k){e.hk=k;G8.flk=.4;SFXB=1;sfx('y_tp');SFXB=0}return}
      if(e.hk2!==k){e.hk2=k;e.ug=0;const d=(k?-1:1)*(Math.random()<.5?-1:1);e.x=Math.max(ARL+10,Math.min(ARR-10-e.w,pc+d*60-e.w/2));e.y=GY-e.h-20;e.f=-d;VFX.spawn('smoke-puff',e.x+e.w/2,e.y+e.h/2,{s:1.2})}
      if(u<.6){e.pz='w';return}if(e.hs!==k){e.hs=k;e.pz='s';yinSwipe(e)}return}
    if(a=='echo'){yinFloat(e,dt*.3);e.pz=T<.8?'w':null;const xs=[ARL+70,(ARL+ARR)/2,ARR-70];for(let i=0;i<3;i++)if(T>=.8+i*.5&&e.n<=i){e.n=i+1;G8.cr.push({x:xs[(i+e.rx)%3],y:GY-60,t:0,hit:0,big:e.p3?1:0});shake=.2;SFXB=1;sfx('y_cryl',.5,.4);SFXB=0}if(T>3)yinEnd(e);return}  // 三处哭声冲击波,躲掩体
    if(a=='cage'){yinFloat(e,dt*.3);e.pz=T<.6?'w':null;if(T>=.6&&!e.h1){e.h1=1;const g=Math.max(ARL+120,Math.min(ARR-120,pc+(Math.random()<.5?-1:1)*rnd(140,220)));e.gx=g;for(let q=ARL+30;q<ARR-20;q+=60)if(Math.abs(q-g)>70)g8Hand(q,1.1,9*e.dm);SFXB=1;sfx('y_hand');SFXB=0}if(T>2.6)yinEnd(e);return}  // 满场鬼手,只留一个缺口
    return}
  yinFloat(e,dt);e.cd-=dt*sp;
  if(e.cd<=0){const Q=['tpc','lane','cage','tear','echo'];if(e.p2)Q.push('palm','lane','tpc');if(e.p3)Q.push('tear','palm','cage');
    let a=Q[Math.random()*Q.length|0];if(a==e.la)a=Q[Math.random()*Q.length|0];e.la=a;e.act=a;e.at=0;e.h1=e.h2=e.h3=e.h4=0;e.hd=0;e.hk=-1;e.hk2=-1;e.hs=-1;e.n=0;e.rx=Math.random()*3|0}}
function yinEnd(e){e.act=null;e.ug=0;e.cd=(e.p3?.6:1)+Math.random()*.5}  // 2026-10-13 第十二轮:出招间隔缩短
// 百鬼哭夜要点亮的窗户(去掉被一楼店面挡住的),打乱顺序
function g8Wins(){const L=CITY8.M.wins.filter(w=>w[1]+w[3]<204).map(w=>w.slice());for(let i=L.length-1;i>0;i--){const j=(i*7919+13)%(i+1);[L[i],L[j]]=[L[j],L[i]]}return L}
// ---- 绘制 ----
const CITY8={I:null,D:'@@A:city8_atlas@@',M:﻿{"world":[0,0,3200,300],"sky":[0,300,128,240],"far":[129,300,144,124],"near":[274,300,493,209],"g_st":[768,300,112,60],"g_apt":[881,300,112,60],"g_hos":[994,300,64,60],"g_und":[1059,300,64,60],"plat":[1124,300,64,12],"vend":[1189,300,34,60],"shut":[1224,300,96,86],"lamps":[[2663,155],[2903,155],[3143,155]],"lamps1":[[249,165],[713,165],[783,165],[453,165],[153,165]],"wins":[[2610,54,12,15],[2636,54,12,15],[2662,54,12,15],[2688,54,12,15],[2714,54,12,15],[2740,54,12,15],[2610,84,12,15],[2636,84,12,15],[2662,84,12,15],[2688,84,12,15],[2714,84,12,15],[2740,84,12,15],[2610,114,12,15],[2636,114,12,15],[2662,114,12,15],[2688,114,12,15],[2714,114,12,15],[2740,114,12,15],[2610,144,12,15],[2636,144,12,15],[2662,144,12,15],[2688,144,12,15],[2714,144,12,15],[2740,144,12,15],[2610,174,12,15],[2636,174,12,15],[2662,174,12,15],[2688,174,12,15],[2714,174,12,15],[2740,174,12,15],[2610,204,12,15],[2636,204,12,15],[2662,204,12,15],[2688,204,12,15],[2714,204,12,15],[2740,204,12,15],[2780,94,12,15],[2806,94,12,15],[2832,94,12,15],[2858,94,12,15],[2780,124,12,15],[2806,124,12,15],[2832,124,12,15],[2858,124,12,15],[2780,154,12,15],[2806,154,12,15],[2832,154,12,15],[2858,154,12,15],[2780,184,12,15],[2806,184,12,15],[2832,184,12,15],[2858,184,12,15],[2780,214,12,15],[2806,214,12,15],[2832,214,12,15],[2858,214,12,15],[2920,38,12,15],[2946,38,12,15],[2972,38,12,15],[2998,38,12,15],[3024,38,12,15],[3050,38,12,15],[2920,68,12,15],[2946,68,12,15],[2972,68,12,15],[2998,68,12,15],[3024,68,12,15],[3050,68,12,15],[2920,98,12,15],[2946,98,12,15],[2972,98,12,15],[2998,98,12,15],[3024,98,12,15],[3050,98,12,15],[2920,128,12,15],[2946,128,12,15],[2972,128,12,15],[2998,128,12,15],[3024,128,12,15],[3050,128,12,15],[2920,158,12,15],[2946,158,12,15],[2972,158,12,15],[2998,158,12,15],[3024,158,12,15],[3050,158,12,15],[2920,188,12,15],[2946,188,12,15],[2972,188,12,15],[2998,188,12,15],[3024,188,12,15],[3050,188,12,15],[2920,218,12,15],[2946,218,12,15],[2972,218,12,15],[2998,218,12,15],[3024,218,12,15],[3050,218,12,15],[3110,84,12,15],[3136,84,12,15],[3162,84,12,15],[3110,114,12,15],[3136,114,12,15],[3162,114,12,15],[3110,144,12,15],[3136,144,12,15],[3162,144,12,15],[3110,174,12,15],[3136,174,12,15],[3162,174,12,15],[3110,204,12,15],[3136,204,12,15],[3162,204,12,15]]},
  init(){const im=new Image();im.onload=()=>{this.I=im};im.src=this.D},
  q(k,X,Y,s,f){const q=this.M[k];s=s||1;x.save();x.translate(Math.round(X),Math.round(Y));if(f<0)x.scale(-1,1);x.drawImage(this.I,q[0],q[1],q[2],q[3],f<0?-q[2]*s:0,0,q[2]*s,q[3]*s);x.restore()},
  tile(k,x0,x1){const q=this.M[k],a=Math.max(x0,cam-2),b=Math.min(x1,cam+VW+2);if(b<=a)return;x.save();x.beginPath();x.rect(Math.floor(a-cam),GY,Math.ceil(b-a)+1,VH-GY);x.clip();
    for(let px=Math.floor(a/q[2])*q[2];px<b;px+=q[2])x.drawImage(this.I,q[0],q[1],q[2],q[3],Math.round(px-cam),GY,q[2],q[3]);x.restore()},
  bg(){const I=this.I,M=this.M,t=performance.now()/1000;x.imageSmoothingEnabled=false;
    x.fillStyle=LG(x,0,0,0,GY,['#07060f','#1a1428','#2e2238']);x.fillRect(0,0,VW,VH);
    {const sx=520,sy=56;C_(x,sx,sy,40,RGD(x,sx,sy,40,['rgba(200,120,120,.25)','rgba(0,0,0,0)']),0);C_(x,sx,sy,13,'#c9a3a3',0);C_(x,sx+5,sy-3,12,'#120e1c',0)}  // 一弯暗红的残月
    const row=(k,par,bot)=>{const q=M[k],w=q[2];let ox=Math.floor(-(((cam*par)%w)+w)%w);for(let px=ox;px<VW;px+=w)x.drawImage(I,q[0],q[1],q[2],q[3],px,bot-q[3],q[2],q[3])};
    row('sky',.04,GY);row('far',.1,GY-30);row('near',.22,GY);
    const sx=Math.max(0,Math.floor(cam)),sw=Math.min(VW+2,M.world[2]-sx);x.drawImage(I,sx,0,sw,300,Math.round(sx-cam),0,sw,300);
    this.tile('g_st',0,960);this.tile('g_apt',960,1600);this.tile('g_hos',1600,2240);this.tile('g_und',2240,2570);this.tile('g_apt',2570,WW);
    // 斑马线(路口 690 ~ 780)
    {const zx=690-cam;if(zx>-100&&zx<VW){x.fillStyle='rgba(220,220,230,.55)';for(let i=0;i<6;i++)x.fillRect(Math.round(zx+i*15),GY+4,9,50)}}
    // 居民楼:屋檐下晃动的吊灯
    for(const lx of [1100,1420,1250]){const px=lx-cam;if(px<-60||px>VW+60)continue;const a=Math.sin(t*1.7+lx)*.45,ex=px+Math.sin(a)*26,ey=200+Math.cos(a)*26;x.strokeStyle='#14121a';x.lineWidth=1;x.beginPath();x.moveTo(px,200);x.lineTo(ex,ey);x.stroke();R(ex-4,ey,8,4,'#3a3640');
      if(Math.sin(t*9+lx)>-.85){x.save();x.globalCompositeOperation='lighter';x.fillStyle=LG(x,0,ey,0,GY,['rgba(255,214,140,.35)','rgba(255,214,140,0)']);x.beginPath();x.moveTo(ex-3,ey+4);x.lineTo(ex+3,ey+4);x.lineTo(ex+30+a*40,GY);x.lineTo(ex-30+a*40,GY);x.closePath();x.fill();x.restore()}}
    for(const p of PL)if(p.y<GY&&!p.gone&&p.x-cam<VW+20&&p.x+p.w-cam>-20)this.plat(p);
    for(const c of COV8)this.q('vend',c.x-cam,GY-60);
    if(bossOn){this.q('shut',ARL-96-cam+6,GY-86);this.q('shut',ARR-cam,GY-86)}},
  plat(p){const q=this.M.plat,px=Math.round(p.x-cam),y=Math.round(p.y-2),w=Math.round(p.w);
    x.drawImage(this.I,q[0],q[1],16,12,px,y,16,12);for(let k=16;k<w-16;k+=16){const c=Math.min(16,w-16-k);x.drawImage(this.I,q[0]+((k>>4)%3==2?2:1)*16,q[1],c,12,px+k,y,c,12)}x.drawImage(this.I,q[0]+48,q[1],16,12,px+w-16,y,16,12)},
  // 夜色 + 灯光(画在角色之后):段落越往里越暗;灯光、亮起的窗户在黑暗里照样看得见
  dark(){const t=performance.now()/1000,M=this.M;
    const k=cam<900?.12:cam<1500?.3:cam<2150?.4:bossOn?.3:.46;G8.dk+=(k-G8.dk)*.04;x.fillStyle='rgba(6,4,16,'+G8.dk+')';x.fillRect(0,0,VW,VH);
    if(G8.flk>0&&Math.sin(t*60)>0){x.fillStyle='rgba(0,0,0,.55)';x.fillRect(0,0,VW,VH)}
    if(B&&B.k=='yin'&&B.p3&&B.hp>0&&bossOn){x.fillStyle='rgba(70,0,14,.14)';x.fillRect(0,0,VW,VH)}
    if(G8.vk>.01){const px=P.x+12-cam,py=P.y+16,g=x.createRadialGradient(px,py,46,px,py,118);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,4,'+(.96*G8.vk)+')');x.fillStyle=g;x.fillRect(0,0,VW,VH)}
    x.save();x.globalCompositeOperation='lighter';
    const glow=(lx,ly,a)=>{const px=lx-cam;if(px<-80||px>VW+80)return;x.fillStyle=LG(x,0,ly,0,GY,['rgba(255,220,150,'+.32*a+')','rgba(255,220,150,0)']);x.beginPath();x.moveTo(px-4,ly);x.lineTo(px+4,ly);x.lineTo(px+38,GY);x.lineTo(px-38,GY);x.closePath();x.fill();C_(x,px,ly,7,RGD(x,px,ly,7,['rgba(255,240,200,'+.9*a+')','rgba(0,0,0,0)']),0)};
    M.lamps1.forEach((l,i)=>glow(l[0],l[1],Math.sin(t*11+i*5)>.93||Math.sin(t*3.3+i)>.985?.15:1));
    if(!G8.lampOff)M.lamps.forEach((l,i)=>glow(l[0],l[1],Math.sin(t*13+i*3)>.97?.2:.9));
    x.restore();
    if(G8.wn>0&&G8.W){x.imageSmoothingEnabled=false;for(let i=0;i<G8.wn;i++){const w=G8.W[i],px=w[0]-cam;if(px<-20||px>VW+20)continue;const fl=.75+.25*Math.sin(t*7+i);
        x.fillStyle='rgba(255,200,110,'+.85*fl+')';x.fillRect(Math.round(px),w[1],w[2],w[3]);const hx=Math.round(px)+6,hy=w[1]+5;x.fillStyle='#08060c';x.fillRect(hx-2,hy-3,5,5);x.fillRect(hx-4,hy+3,9,w[3]-8);x.fillStyle='#ff3b3b';x.fillRect(hx-1,hy-1,1,1);x.fillRect(hx+1,hy-1,1,1)}}}};  // 每扇亮起的窗后一个鬼影
const GH8={I:null,D:'@@A:gh8_atlas@@',M:{"fly":[0,32,32,6],"fly2":[33,32,32,6],"land":[66,37,65,4],"land2":[132,37,65,4],"punk":[198,28,50,4],"baby":[249,28,30,6],"babyS":[280,28,30,3],"claw":[311,72,40,1],"hand":[352,22,44,1],"cradle":[397,40,34,1],"fire":[432,12,14,4],"wg":[447,10,16,1],"shard":[464,12,16,1]},
  V:{gfly:['fly',31,30],gfly2:['fly2',31,30],gland:['land',62,64],gland2:['land2',62,64]},  // [图集行, 可见高度, 脚底所在行]
  init(){const im=new Image();im.onload=()=>{this.I=im};im.src=this.D},
  on(e){return !!this.I&&(!!this.V[e.k]||e.k=='yin'||e.k=='cradle')},
  // 画第 i 帧:左上角 (X,Y),放大 s,f=-1 水平翻转
  fr(c,k,i,X,Y,s,f){const m=this.M[k];if(!m||!this.I)return;s=s||1;c.save();c.imageSmoothingEnabled=false;c.translate(Math.round(X),Math.round(Y));if(f<0){c.translate(m[1]*s,0);c.scale(-1,1)}c.drawImage(this.I,(i%m[3])*m[1],m[0],m[1],m[2],0,0,m[1]*s,m[2]*s);c.restore()},
  draw(c,e,t){const now=performance.now()/1000;
    if(e.k=='yin'){if(e.ug&&e.act!='ult')return;const m=this.M.baby,fi=e.dz>0?5:e.fl>0?5:e.act=='claw'||e.pz=='s'&&e.act!='cry'?4:(e.act=='cry'||e.act=='sum'||e.act=='chn'||e.act=='ult'||e.p3)?2+Math.floor(now*6)%2:Math.floor(now*2.5)%2,H=e.h/1.1,s=H/m[2]*1.25;
      c.save();if(FLW)c.filter='brightness(2.6)';if(e.act=='ult'&&e.ug)c.globalAlpha*=.5+.3*Math.sin(now*10);c.imageSmoothingEnabled=false;c.drawImage(this.I,fi*m[1],m[0],m[1],m[2],-m[1]*s/2,-m[2]*s,m[1]*s,m[2]*s);c.restore();return}
    if(e.k=='cradle'){const m=this.M.cradle,s=e.w/m[1];c.save();c.rotate(Math.sin(e.rk*3)*.12);if(FLW)c.filter='brightness(2.6)';c.imageSmoothingEnabled=false;c.drawImage(this.I,0,m[0],m[1],m[2],-m[1]*s/2,-m[2]*s,m[1]*s,m[2]*s);c.restore();return}
    let [k,vh,bot]=this.V[e.k],fl=1;if(e.dis){k='punk';vh=50;bot=this.M.punk[2];fl=-1}
    const m=this.M[k],H=e.h/(e.vs||1),sc=H/vh;let a=1,clip=0;
    if(e.s=='ph')a=.25+.1*Math.sin(now*20);if(e.s=='gdv'&&e.t<1)a=e.t<.5?Math.max(0,1-e.t*3):.65;if(e.s=='wv')return;
    if(e.s=='hdv'){const q=e.t<.35?e.t/.35:e.t<1.6?1:Math.max(0,1-(e.t-1.6)/.3);if(q>=.98)return;clip=q}
    const fi=Math.floor(now*(e.dis?4:8)+(e.ph||0)*3)%m[3];
    c.save();if(clip){c.beginPath();c.rect(-400,-1000,800,1000);c.clip();c.translate(0,clip*H)}c.globalAlpha*=a;
    if(FLW)c.filter='brightness(2.6)';else if(e.dark||(e.s=='gdv'&&e.t<1))c.filter='brightness(.18)';
    c.imageSmoothingEnabled=false;c.scale(sc*fl,sc);c.drawImage(this.I,fi*m[1],m[0],m[1],m[2],-m[1]/2,-bot,m[1],m[2]);c.restore()},
  fire(f,fx,fy,t){if(!this.I)return false;x.save();x.globalCompositeOperation='lighter';C_(x,fx,fy,14,RGD(x,fx,fy,14,['rgba(80,255,200,.55)','rgba(0,0,0,0)']),0);x.restore();this.fr(x,'fire',Math.floor(t*10),fx-9,fy-11,1.5,f.vx<0?-1:1);return true}};
CITY8.init();GH8.init();
// 首领身后的巨大黑色婴儿投影 + 黑影爬行时变黑的地面(画在怪物之前)
function g8Back(){const e=B;if(!e||e.k!='yin'||!bossOn||e.hp<=0)return;const now=performance.now()/1000;
  for(const c of E)if(c.k=='cradle'){const px=c.x+c.w/2-cam;x.save();x.globalCompositeOperation='lighter';E_(x,px,GY-c.h/2,c.w*.9,c.h*.8,RGD(x,px,GY-c.h/2,c.w*.9,['rgba(150,60,200,'+(.32+.1*Math.sin(now*5))+')','rgba(0,0,0,0)']),0);x.restore()}
  if(G8.bk>0||(e.act=='crl'&&e.h1&&!e.h2)){x.fillStyle='rgba(6,2,12,.9)';x.fillRect(0,GY-3,VW,VH-GY+3);x.strokeStyle='rgba(150,60,200,.45)';x.lineWidth=1;for(let i=0;i<5;i++){const yy=GY+4+i*11+Math.sin(now*3+i)*2;x.beginPath();x.moveTo(0,yy);for(let q=0;q<=VW;q+=40)x.lineTo(q,yy+Math.sin(q*.05+now*4+i)*2);x.stroke()}
    const sx=e.sx-cam,d=sgn(P.x+12-e.sx)||1;if(e.act=='crl'&&e.ug){x.save();x.globalCompositeOperation='lighter';E_(x,sx,GY-10,46,16,RGD(x,sx,GY-10,46,['rgba(170,40,220,.55)','rgba(0,0,0,0)']),0);x.restore();GH8.fr(x,'babyS',0,sx-34,GY-34+Math.abs(Math.sin(now*14))*3,2.4,d);for(let i=0;i<3;i++)C_(x,sx-d*(22+i*14),GY-4,6-i*1.5,'rgba(10,6,16,.8)',0)}}
  if(e.pj>.02){const m=GH8.M.babyS,s=6.5,fi=e.act=='claw'?2:(e.act=='cry'||e.act=='chn'||e.act=='sum'||e.act=='ult')?1:0,cx=e.x+e.w/2-cam,cy=GY-m[2]*s/2;x.save();x.globalCompositeOperation='lighter';E_(x,cx,cy,m[1]*s*.75,m[2]*s*.62,RGD(x,cx,cy,m[1]*s*.75,['rgba(120,30,170,'+.5*e.pj+')','rgba(60,10,90,'+.25*e.pj+')','rgba(0,0,0,0)']),0);x.restore();x.save();x.globalAlpha=.78*e.pj*(.85+.15*Math.sin(now*9));
    GH8.fr(x,'babyS',fi,cx-m[1]*s/2,GY-m[2]*s+16+Math.sin(now*1.5)*4,s,e.f);x.restore()}}
function g8Fx(){const t=performance.now()/1000;
  for(const h of G8.hd){const px=h.x-cam;if(h.t<h.w){if(BWOFF)continue;const a=.45+.35*Math.sin(t*16);x.fillStyle='rgba(8,4,14,'+a+')';x.beginPath();x.ellipse(px,GY-1,22,6,0,0,7);x.fill();x.strokeStyle='rgba(190,75,219,'+a+')';x.lineWidth=1;x.stroke()}
    else{const k=Math.min(1,(h.t-h.w)/.12)*(h.t>h.w+.5?Math.max(0,1-(h.t-h.w-.5)/.2):1),m=GH8.M.hand,s=1.5;x.save();x.beginPath();x.rect(px-40,0,80,GY);x.clip();GH8.fr(x,'hand',0,px-m[1]*s/2,GY-m[2]*s*k,s,1);x.restore()}}
  for(const c of G8.cl){const k=g8ClawK(c),r=g8ClawR(c,1),a=.18+.14*Math.sin(t*18);
    if(c.t<c.w){if(BWOFF)continue;x.fillStyle='rgba(220,30,60,'+a+')';x.fillRect(r.x-cam,r.y,r.w,r.h);x.strokeStyle='rgba(255,90,110,.7)';x.lineWidth=1;x.strokeRect(r.x-cam+.5,r.y+.5,r.w-1,r.h-1);continue}
    const rr=g8ClawR(c,k),m=GH8.M.claw,s=c.d=='T'?2.2:rr.h/m[2]*1.4;if(k<=0)continue;
    const cw=m[1]*s;x.fillStyle='#120c18';
    if(c.d=='T'){x.save();x.translate(c.x-cam,rr.h);x.rotate(Math.PI/2);if(rr.h>cw*.7)x.fillRect(-rr.h,-10,rr.h-cw*.7,20);GH8.fr(x,'claw',0,-cw,-m[2]*s/2,s,1);x.restore()}
    else{const tip=c.d=='L'?rr.x+rr.w:rr.x,cy=rr.y+rr.h/2;
      if(c.d=='L'){const a1=tip-cw*.7;if(a1>c.lo)x.fillRect(c.lo-cam,cy-10,a1-c.lo,20);GH8.fr(x,'claw',0,tip-cw-cam,cy-m[2]*s/2,s,1)}
      else{const a0=tip+cw*.7;if(c.hi>a0)x.fillRect(a0-cam,cy-10,c.hi-a0,20);GH8.fr(x,'claw',0,tip-cam,cy-m[2]*s/2,s,-1)}}}
  for(const s of G8.ds){const px=s.x-cam;if(s.t<s.w){if(BWOFF)continue;x.fillStyle='rgba(30,10,40,'+(.25+.2*Math.sin(t*20))+')';x.fillRect(0,s.y-36,VW,32);continue}
    x.save();x.filter='brightness(.15)';GH8.fr(x,'fly2',Math.floor(t*12),px-38,s.y-76,2.4,s.d);x.restore();for(let i=1;i<4;i++){x.globalAlpha=.25/i;GH8.fr(x,'fly2',0,px-38-s.d*i*26,s.y-76,2.4,s.d)}x.globalAlpha=1}
  for(const r of G8.cr){const R_=r.t*380,a=Math.max(0,1-R_/720);x.strokeStyle='rgba(200,170,255,'+.55*a+')';x.lineWidth=3;for(let i=0;i<3;i++){const rr=R_-i*16;if(rr>4){x.beginPath();x.arc(r.x-cam,r.y,rr,0,7);x.stroke()}}}
  if(B&&B.k=='yin'&&bossOn&&B.act=='tp'&&B.ug&&B.h2){const a=Math.min(1,(B.at-.25)/.5);x.globalAlpha=.7*a;GH8.fr(x,'babyS',0,B.tx+B.w/2-cam-21,B.ty+B.h-45+8,1.5,1);x.globalAlpha=1}}
// 女神灵魂碎片(地面掉落)
// 女神灵魂碎片:第四、八、十关首领各掉一块(这张地图共 3 块);MAT.sl = 已拿到碎片的关卡(旧存档有碎片 = 第八关那块)
const SOULV={4:'巨蝎的甲壳裂开了……一块发光的碎片滚了出来',8:'银太郎的哭声停了……一块发光的碎片落了下来',10:'归蝇的黑羽散尽……一块发光的碎片落了下来',16:'炎君的灰烬里……一块发光的碎片滚了出来'};  // 第四十二轮:第十三关
function soulHas(l){if(!MAT.sl)MAT.sl=MAT.soul>0?[8]:[];return MAT.sl.includes(l)}
function soulDraw(c,px,py,t){c.save();c.globalCompositeOperation='lighter';C_(c,px,py,12,RGD(c,px,py,12,['rgba(208,191,255,.7)','rgba(0,0,0,0)']),0);c.restore();const m=GH8.M.shard;if(GH8.I)GH8.fr(c,'shard',0,px-9,py-12+Math.sin(t*3)*1.5,1.5,1);else CT('💠',px,py+4,11,'#fff','center',0)}
// =====================================================================
