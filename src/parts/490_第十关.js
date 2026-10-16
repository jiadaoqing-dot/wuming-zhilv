// ===== 第十关 · 幽灵船(2026-10-13,空战关):夜空里航行的幽灵船。前甲板 → 中甲板 → 后甲板 → 船尾高台(首领,没有浮空平台)=====
// 图集 SHIP10(art_src/ship/build_ship10.py):夜空 Moon and Sea(CraftPix,OGA-BY 3.0)· 远处幽灵船 Old-fashioned pirate ship(KokoroReflections,CC-BY 4.0)
//   甲板 / 木板 / 木桶 / 大炮 Pirate Bomb(Pixel Frog,CC-BY 4.0)· 翼魔 / 空翼妖 LPC Imp(William.Thompsonj,CC-BY 3.0)· 浮游眼魔 Flying Eye(Lil Pie,CC-BY 3.0)· 归蝇 Fallen Angel(BlackSwordo,CC-BY 4.0)
// 小怪:翼魔 wimp(飞到头顶停顿 → 俯冲;绕一圈 → 从侧面冲撞)· 浮游眼魔 eye(黄色预警线 → 激光扫射;2~3 颗慢速追踪弹)
// 精英:空翼妖 swing(左边出现 → 冲过玩家 → 消失 → 右边出现 → 再冲过来;冲 3 次后停下喘口气,这时最好打)
// 浮空平台只有 5 块,彼此离得远,其中 3 块会慢慢移动;首领场地里一块都没有
// 首领:归蝇 gui。永远悬浮,从不落地;出场后前 3 次攻击必定 MISS,之后每次命中 30% MISS;被打中只轻微后退(没有硬直)
//   开场只飞不打 · 横向飞行(玩家追就飞向另一边,不追就更快出招)· 假动作 · 空中瞬移 · 天空投射 · 风压 · 俯冲骗招;55% 起 三段瞬移 / 天空弹幕 / 天空放逐
// =====================================================================
const PL10=[{x:0,y:GY,w:WW},{x:400,y:214,w:80,ax:44,sp:.5},{x:860,y:198,w:72},{x:1250,y:210,w:80,ax:52,sp:.42},{x:1720,y:204,w:72,ay:18,sp:.6},{x:2160,y:212,w:80}];
const E10=[['wimp',360],['wimp',520],['eye',700],['wimp',840],
  ['wimp',1050],['eye',1180],['wimp',1320],['eye',1460],
  ['wimp',1700],['eye',1820],['wimp',1960],['eye',2080],['wimp',2180]];
const PROP10=[['barrel',180],['cannon',300],['lantern',520],['barrel',640],['mast',760],['cannon',1010],['barrel',1120],['lantern',1300],['mast',1480],['barrel',1610],['cannon',1880],['lantern',2000],['mast',2280],['barrel',2420],['lantern',2560],['lantern',3150]];
let S10={};
function s10Init(){S10={bn:0,lt:0,wind:0,wd:1,sb:[],bm:[],af:[]}}
const s10In=()=>cur==10&&!INTOWN&&st=='play';
function s10Step(dt){const pc=P.x+12;S10.lt+=dt;
  // 会动的浮空平台:主角站在上面就跟着走
  for(const p of PL)if(p.sp){const k=S10.lt*p.sp*2+p.x0*.01,nx=p.x0+Math.sin(k)*(p.ax||0),ny=p.y0+Math.sin(k)*(p.ay||0),dx=nx-p.x,dy=ny-p.y;p.x=nx;p.y=ny;if(P.onP===p){P.x+=dx;P.y+=dy}}
  // 风压:把主角往一侧推,往上跳也更吃力
  if(S10.wind>0){S10.wind-=dt;P.x+=S10.wd*(P.fly?70:100)*dt;if(P.vy<0)P.vy+=330*dt;P.x=Math.max(bossOn?ARL:0,Math.min(xMax(),P.x));
    if(Math.random()<dt*40)pt({x:cam+(S10.wd>0?-10:VW+10)+rnd(-20,20),y:rnd(20,GY-4),vx:S10.wd*rnd(420,620),vy:rnd(-10,10),c:'rgba(210,235,230,.55)',ad:0,s:rnd(1,2),l:.9})}
  // 天空投射:魔法球在上面跟着「预测的落点」移动,时间到了一起落下
  for(const b of S10.sb){b.t+=dt;if(b.st=='trk'){const tx_=pc+(P.vx||0)*.45+b.ox;b.x+=(tx_-b.x)*Math.min(1,dt*2.6);b.x=Math.max(ARL+10,Math.min(ARR-10,b.x));b.y=62+Math.sin(b.t*5+b.ox)*4;if(b.t>=b.w){b.st='fall';b.vy=80}}
    else{b.vy+=900*dt;b.y+=b.vy*dt;if(b.y>=GY-8){b.d=1;SFX5('r-burst',b.x,GY-14,{s:1.3,life:.4,gr:.5});burst(b.x,GY-8,10,['#b197fc','#e5dbff','#5f3dc4'],180,{s:2.5,l:.35});if(Math.abs(pc-b.x)<24&&P.y+P.h>GY-46)hurt(8*LDM,{kb:sgn(pc-b.x)*200})}}}
  S10.sb=S10.sb.filter(b=>!b.d);
  // 天空放逐的竖直光束:0.55 秒预警(前 0.35 秒跟着主角)→ 0.4 秒光束
  for(const b of S10.bm){b.t+=dt;if(b.t<.35)b.x+=(pc-b.x)*Math.min(1,dt*8);if(b.t>=.55&&!b.h&&Math.abs(pc-b.x)<15){b.h=1;hurt(12*LDM,{kb:sgn(pc-b.x)*180})}}S10.bm=S10.bm.filter(b=>b.t<.95);
  for(const a of S10.af)a.t-=dt;S10.af=S10.af.filter(a=>a.t>0);
  const bn=[[0,'幽灵船 · 天上的东西会从各个方向扑过来'],[980,'中甲板 · 浮空的木板很少,跳过去要算好时机'],[1620,'后甲板 · 帆在没有风的夜里自己鼓了起来'],[2260,'船尾高台……那里没有任何落脚的地方'],[2620,'归蝇在桅杆顶上张开了黑色的翅膀']];
  while(S10.bn<bn.length&&P.x>=bn[S10.bn][0]){banner(bn[S10.bn][1]);S10.bn++}}
const s10Lo=e=>g8Lo(e),s10Hi=e=>g8Hi(e);
// ---- 翼魔:飞到玩家头顶停顿 → 俯冲;或者绕玩家飞一圈 → 从侧面冲撞 ----
function wimpStep(e,dt){const dm=e.dm,cx=e.x+e.w/2,pc=P.x+12,dx=pc-cx,lo=s10Lo(e),hi=s10Hi(e),cl=v=>Math.max(lo,Math.min(hi-e.w,v)),cy=v=>Math.max(30,Math.min(GY-e.h,v));
  e.cd=(e.cd==null?rnd(.8,1.6):e.cd)-dt;e.pz=null;e.gs=(e.gs||0)+dt;const s=e.s;if(s)e.t+=dt;
  if(s=='dvw'){e.f=sgn(dx)||e.f;e.x=cl(e.x+(pc-e.w/2-e.x)*Math.min(1,dt*4));e.y=cy(e.y+(P.y-90-e.y)*Math.min(1,dt*4));if(e.t>=.6){e.s='dvp';e.t=0}return}
  if(s=='dvp'){e.pz='w';if(e.t>=.38){e.s='dv';e.t=0;e.px0=e.x;e.py0=e.y;e.tx=cl(pc-e.w/2);e.ty=cy(P.y+P.h-e.h);e.hd=0;syn('dash')}return}
  if(s=='dv'){e.pz='s';const k=Math.min(1,e.t/.32);e.x=e.px0+(e.tx-e.px0)*k;e.y=e.py0+(e.ty-e.py0)*k*k;if(!e.hd&&ov(P,e)&&hurt(10*dm,{kb:e.f*220}))e.hd=1;if(k>=1){e.s='up';e.t=0}return}
  if(s=='up'){e.y+=(e.by-e.y)*Math.min(1,dt*3);if(e.t>.8){e.s=null;e.cd=rnd(.8,1.3)}return}
  if(s=='cir'){const a=e.a0+e.t*5.2*e.cd0;e.x=cl(pc+Math.cos(a)*84-e.w/2);e.y=cy(P.y+16+Math.sin(a)*60-e.h/2);e.f=sgn(dx)||e.f;if(e.t>=1.2){e.s='sdw';e.t=0;e.sd=sgn(cx-pc)||1;e.x=cl(pc+e.sd*110-e.w/2);e.y=cy(P.y+P.h-e.h-4)}return}
  if(s=='sdw'){e.pz='w';e.f=-e.sd;if(e.t>=.32){e.s='sd';e.t=0;e.hd=0;syn('dash')}return}
  if(s=='sd'){e.pz='s';e.x=cl(e.x-e.sd*430*dt);if(!e.hd&&ov(P,e)&&hurt(11*dm,{kb:-e.sd*320}))e.hd=1;if(Math.random()<dt*30)pt({x:cx+e.sd*10,y:e.y+e.h/2+rnd(-6,6),vx:e.sd*60,vy:0,c:'rgba(255,120,90,.6)',ad:0,s:2,l:.25});if(e.t>=.55){e.s='up';e.t=0}return}
  // 平时:在玩家斜上方盘旋
  if(!e.side)e.side=Math.random()<.5?-1:1;const hx=pc+e.side*(90+30*Math.sin(e.gs*.9+e.ph)),hy=e.by+Math.sin(e.gs*2.4+e.ph)*14;
  e.x=cl(e.x+(hx-e.w/2-e.x)*chL(Math.abs(dx),dt,1.2));e.y=cy(e.y+(hy-e.y)*Math.min(1,dt*1.6));e.f=sgn(dx)||e.f;if(Math.random()<dt*.2)e.side*=-1;
  if(e.cd<=0&&Math.abs(dx)<380){if(!tok(e)){e.cd=.3;return}e.t=0;if(Math.random()<.6)e.s='dvw';else{e.s='cir';e.a0=Math.atan2(e.y+e.h/2-(P.y+16),cx-pc);e.cd0=Math.random()<.5?-1:1}}}
// ---- 浮游眼魔:飘在高处,黄色预警线 → 激光扫射;或者放 2~3 颗慢速追踪弹 ----
function eyeStep(e,dt){const cx=e.x+e.w/2,pc=P.x+12,dx=pc-cx,lo=s10Lo(e),hi=s10Hi(e),cl=v=>Math.max(lo,Math.min(hi-e.w,v));
  e.cd=(e.cd==null?rnd(1.2,2.2):e.cd)-dt;e.pz=null;e.gs=(e.gs||0)+dt;const s=e.s;if(s)e.t+=dt;e.f=sgn(dx)||e.f;const ey=e.y+e.h/2;
  if(s=='bw'){e.pz='w';if(e.t<.7)e.ba=Math.atan2(P.y+16-ey,pc-cx);if(e.t>=1){e.s='bm';e.t=0;e.hd=0;e.bd=Math.random()<.5?-1:1;syn('zap')}return}
  if(s=='bm'){e.pz='s';const a=e.ba+e.bd*(-.28+.56*Math.min(1,e.t/.6));e.ang=a;const vx=Math.cos(a),vy=Math.sin(a),qx=pc-cx,qy=P.y+16-ey,al=qx*vx+qy*vy,pp=Math.abs(qx*vy-qy*vx);
    if(!e.hd&&al>0&&al<440&&pp<16&&hurt(11*e.dm,{kb:sgn(vx)*160}))e.hd=1;if(e.t>=.6){e.s='rec';e.t=0}return}
  if(s=='obw'){e.pz='w';if(e.t>=.5){e.s='rec';e.t=0;const n=Math.random()<.5?2:3;for(let i=0;i<n;i++){const a=Math.atan2(P.y+16-ey,dx)+(i-(n-1)/2)*.7;F.push({x:cx,y:ey,vx:Math.cos(a)*90,vy:Math.sin(a)*90,ng:1,hm:1,hl:4.5,c:10,dmg:7*LDM,s:1})}syn('fire')}return}
  if(s=='rec'){if(e.t>.6){e.s=null;e.cd=rnd(1,1.8)}return}
  if(!e.side)e.side=Math.random()<.5?-1:1;const hx=pc+e.side*(150+30*Math.sin(e.gs*.7+e.ph)),hy=GY-170+Math.sin(e.gs*1.8+e.ph)*14;
  e.x=cl(e.x+(hx-e.w/2-e.x)*chL(Math.abs(dx),dt,.7));e.y+=(hy-e.y)*Math.min(1,dt*1.2);if(Math.random()<dt*.12)e.side*=-1;
  if(e.cd<=0&&Math.abs(dx)<440){if(!tok(e,1)){e.cd=.4;return}e.t=0;e.s=Math.random()<.55?'bw':'obw'}}
// ---- 空翼妖(精英):屏幕一侧出现 → 高速冲过玩家 → 消失;冲 3 次后停下喘口气 ----
function swingStep(e,dt){const dm=e.dm,pc=P.x+12,lo=s10Lo(e),hi=s10Hi(e),cy=v=>Math.max(40,Math.min(GY-e.h,v));
  e.pz=null;e.gs=(e.gs||0)+dt;if(!e.s){e.s='hid';e.t=.4;e.np=0}const s=e.s;e.t+=dt;
  if(!e.intro){e.intro=1;banner('空翼妖 · 天上的东西真的很烦');tx('精英',e.x+e.w/2-8,e.y-20,'#b197fc')}
  if(s=='hid'){e.ug=1;e.hide=1;if(e.t>=1.5){if(!tok(e)){e.t=.7;return}e.sd=e.sd?-e.sd:(Math.random()<.5?1:-1);e.x=e.sd>0?Math.min(hi-e.w-6,pc+330):Math.max(lo+6,pc-330-e.w);e.y=cy(P.y+P.h-e.h-rnd(0,40));e.f=-e.sd;e.s='app';e.t=0;e.ug=0;e.hide=0;VFX.spawn('smoke-puff',e.x+e.w/2,e.y+e.h/2,{s:1})}return}
  if(s=='app'){e.pz='w';e.f=-e.sd;if(e.t>=.45){e.s='dash';e.t=0;e.hd=0;syn('dash')}return}
  if(s=='dash'){e.pz='s';e.x-=e.sd*480*dt;if(!e.hd&&ov(P,e)&&hurt(12*dm,{kb:-e.sd*380}))e.hd=1;
    if(e.x<lo-4||e.x+e.w>hi+4||(pc-(e.x+e.w/2))*e.sd>300){e.x=Math.max(lo,Math.min(hi-e.w,e.x));e.np++;VFX.spawn('smoke-puff',e.x+e.w/2,e.y+e.h/2,{s:1});if(e.np>=3){e.np=0;e.s='rest';e.t=0;tx('喘气中……',e.x,e.y-14,'#d0bfff')}else{e.s='hid';e.t=0}}return}
  if(s=='rest'){e.y=cy(e.y+(GY-120-e.y)*Math.min(1,dt*2))+Math.sin(e.gs*4)*.6;e.f=sgn(pc-(e.x+e.w/2))||e.f;if(e.t>=2.6){e.s='hid';e.t=0;VFX.spawn('smoke-puff',e.x+e.w/2,e.y+e.h/2,{s:1})}}}
// ---- 首领:归蝇 ----
const G10Y=54;  // 平时飞行的高度(脚底约 y=125,主角原地跳刚好够不太到)
function guiTo(e,tx_,ty_,v,dt){const dx=tx_-e.x,dy=ty_-e.y,d=Math.hypot(dx,dy);if(d<=v*dt||d<1){e.x=tx_;e.y=ty_;return 1}e.x+=dx/d*v*dt;e.y+=dy/d*v*dt;return 0}
function guiCl(e,low){e.x=Math.max(ARL+6,Math.min(ARR-6-e.w,e.x));e.y=Math.max(40,Math.min(GY-e.h-(low?8:40),e.y))}  // 永远不落地:最低离地 8 像素
function guiVan(e,x_,y_,low){bsfx('g10_tele',.8);S10.af.push({x:e.x,y:e.y,f:e.f,t:.3});e.x=x_;e.y=y_;guiCl(e,low);S10.af.push({x:e.x,y:e.y,f:e.f,t:.3});syn('blink');
  burst(e.x+e.w/2,e.y+e.h/2,14,['#b197fc','#e5dbff','#3b2a5a'],180,{s:2.5,l:.35})}
function guiEnd(e){e.act=null;e.ug=0;e.hide=0;e.cd=(e.p3?.45:e.p2?.65:.85)+Math.random()*.4}
function guiShot(e,a,v,n,sp){const cx=e.x+e.w/2,cy=e.y+e.h*.45;for(let i=0;i<n;i++){const q=a+(i-(n-1)/2)*sp;F.push({x:cx,y:cy,vx:Math.cos(q)*v,vy:Math.sin(q)*v,ng:1,c:12,dmg:8*LDM,s:1})}}
// 第十六轮重做(归蝇):旧招(假动作 / 空中瞬移 / 天空投射 / 风压 / 俯冲骗招 / 天空弹幕 / 天空放逐)删除;新招:黑翼俯冲 swoop / 羽刃扇 fan / 风眼牵引 pull;保留第十五轮的 黑羽风暴 fth / 堕天十字光 xb / 月蚀坠落 ecl
function guiStep(e,dt){const pc=P.x+12,py=P.y+16,cx=e.x+e.w/2,hp=e.hp/e.max,MID=(ARL+ARR)/2;e.pz=null;e.fy=(e.fy||0)+dt;e.f=sgn(pc-cx)||e.f;
  if(e.pbx){e.x+=e.pbx*dt;e.pbx*=Math.max(0,1-dt*7);if(Math.abs(e.pbx)<4)e.pbx=0}
  if(!e.p2&&hp<=.55){e.p2=1;banner('归蝇的黑翼完全张开了……天空变得更吵了');flash('180,140,255',.25)}
  if(!e.p3&&hp<=.25){e.p3=1;banner('归蝇狂怒!它飞得更快了');shake=.4}
  const sp=e.p3?1.25:1;
  if(e.intro!==2){if(!e.intro){e.intro=1;e.wp=0;shake=.3;flash('150,120,220',.2)}  // 开场:一招都不放,只是飞来飞去
    const W=[[ARL+60,G10Y+30],[ARR-120,G10Y+20],[ARR-170,40],[ARL+240,120],[MID-28,G10Y]],w=W[e.wp];e.it=(e.it||0)+dt;
    if(guiTo(e,w[0],w[1],260,dt)){e.wp++;if(e.wp>=W.length){e.intro=2;e.cd=.6}}if(e.it>7&&e.intro!==2){e.intro=2;e.cd=.6}guiCl(e);return}
  if(e.act){const a=e.act;e.at+=dt*sp;const T=e.at;if(NBA[a]){NBA[a](e,dt,T);return}
    if(a=='swoop'){if(T<.7){guiTo(e,pc-e.fs*140-e.w/2,30,420*sp,dt);guiCl(e);return}  // 飞到斜上方 → 0.5 秒锁定落点(地面标记)→ 直线俯冲再贴地滑 → 往侧面跳开
      if(T<1.2){e.pz='w';if(!e.h1){e.h1=1;e.lx=Math.max(ARL+40,Math.min(ARR-40,pc+P.vx*.3));e.p0=[e.x,e.y]}return}
      if(!e.h2){e.h2=1;bsfx('g10_flap');syn('dash')}const u=Math.min(1,(T-1.2)/.4);e.pz='s';if(u<1){e.x=e.p0[0]+(e.lx-e.w/2-e.p0[0])*u;e.y=e.p0[1]+(GY-e.h-8-e.p0[1])*u*u}else{e.x+=-e.fs*300*dt;if(!e.h3){e.h3=1;shake=.3;VFX.spawn('landing-dust',e.lx,GY,{s:1.4})}}guiCl(e,1);
      if(!e.h4&&ov(P,e)&&hurt(12*e.dm,{kb:-e.fs*360}))e.h4=1;if(T>2.1)guiEnd(e);return}
    if(a=='fan'){guiTo(e,MID-e.w/2,36,320,dt);guiCl(e);e.pz=T<.7?'w':'s';const cy=e.y+e.h*.45;for(let k=0;k<2;k++)if(T>=.7+k*.9&&e.n<=k){e.n=k+1;const a0=Math.atan2(py-cy,pc-cx),gap=(Math.random()*5|0)+1;for(let i=0;i<7;i++){if(i==gap)continue;const q=a0+(i-3)*.2;F.push({x:cx,y:cy,vx:Math.cos(q)*180,vy:Math.sin(q)*180,ng:1,c:12,dmg:7*LDM,s:.9})}syn('fire')}if(T>2.6)guiEnd(e);return}  // 两轮 7 枚扇形羽刃,各留一个缺口
    if(a=='pull'){guiTo(e,MID-e.w/2,40,320,dt);guiCl(e);e.pz=T<1?'w':'s';if(!e.h1){e.h1=1;bsfx('g10_wind',1,3.2);SFX5('t-swirl',MID,GY-60,{s:2.2,life:3.3,rs:3,a:.7,fi:.3})}  // 1 秒后把玩家往场地中间吸 2.2 秒,吸完风眼炸开(半径 110)
      if(T>=1&&T<3.2){const d=sgn(MID-pc)||1;P.x+=d*(P.fly?90:140)*dt;P.x=Math.max(ARL,Math.min(ARR-P.w,P.x));if(Math.random()<dt*30)pt({x:MID+rnd(-200,200),y:GY-rnd(10,120),vx:0,vy:0,c:'rgba(200,235,225,.6)',ad:0,s:2,l:.2})}
      if(T>=3.2&&!e.h2){e.h2=1;shake=.5;syn('slam');VFX.spawn('void-implosion',MID,GY-50,{s:2.6});ring(MID,GY-50,8,110,'#b197fc',.45,7);burst(MID,GY-40,30,['#b197fc','#e5dbff'],380,{s:3,l:.5});if(Math.abs(pc-MID)<110+P.w/2)hurt(16*e.dm,{kb:sgn(pc-MID)*440})}if(T>3.8)guiEnd(e);return}
    return}
  const ad=Math.abs(pc-cx);if(e.hx==null||(ad<140&&Math.abs(e.hx+e.w/2-pc)<180))e.hx=pc<MID?ARR-70-e.w-rnd(0,60):ARL+70+rnd(0,60);  // 平时:在上方横向飞,玩家靠近就飞向另一边
  else if(Math.abs(e.x-e.hx)<4&&Math.random()<dt*.8)e.hx=Math.max(ARL+20,Math.min(ARR-20-e.w,e.x+rnd(-200,200)));
  guiTo(e,e.hx,G10Y+Math.sin(e.fy*1.4)*22,215*sp,dt);guiCl(e);
  e.far=ad>260?(e.far||0)+dt:0;e.cd-=dt*sp*(e.far>1.2?1.8:1);
  if(e.cd<=0){const Q=['swoop','fan','fth','xb','swoop','pull'];if(e.p2)Q.push('xb','ecl','fan');if(e.p3)Q.push('fth','ecl','swoop');
    let a=Q[Math.random()*Q.length|0];if(a==e.la)a=Q[Math.random()*Q.length|0];e.la=a;e.act=a;e.at=0;e.h1=e.h2=e.h3=e.h4=0;e.n=0;e.hk=-1;e.ek=-1;e.fs=cx<pc?-1:1}}
// ---- 绘制 ----
const SHIP10={I:null,D:'@@A:ship10_atlas@@',M:{"sky":[0,160,90,1],"stars":[91,288,162,1],"moon":[254,45,45,1,0],"cl1":[334,288,162,1],"cl2":[497,288,162,1],"gship":[660,207,153,1],"g_top":[254,32,32,1,46],"g_fill":[254,32,32,1,79],"hull":[254,32,32,1,112],"plat":[814,16,15,3],"barrel":[254,21,22,1,145],"cannon":[254,31,23,1,167],"mast":[830,90,220,1],"lantern":[1051,10,16,3],"rail":[254,32,14,1,199],"wimp":[1068,64,44,4],"wimps":[1113,34,41,4],"wimpa":[1155,36,41,4],"swf":[1197,64,44,4],"sws":[1242,34,41,4],"eye":[1284,64,27,4],"eyeh":[1312,64,27,4],"bwing":[1340,118,111,1],"bbody":[1452,118,111,1],"barm":[1564,60,36,2],"tseg":[254,8,8,1,232],"ttip":[254,14,14,1,241],"shard":[1601,14,14,3],"orb":[1616,12,12,3],"mball":[1629,16,16,3]},
  init(){const im=new Image();im.onload=()=>{this.I=im};im.src=this.D},
  fr(c,k,i,X,Y,s,f){const m=this.M[k];if(!m||!this.I)return;s=s||1;c.save();c.imageSmoothingEnabled=false;c.translate(Math.round(X),Math.round(Y));if(f<0){c.translate(m[1]*s,0);c.scale(-1,1)}c.drawImage(this.I,(m[4]||0)+(i%m[3])*m[1],m[0],m[1],m[2],0,0,m[1]*s,m[2]*s);c.restore()},
  // 画在脚底中间(c 已经平移 + 翻转),帧底边对齐
  at(c,k,i,s,dy){const m=this.M[k];c.drawImage(this.I,(m[4]||0)+(i%m[3])*m[1],m[0],m[1],m[2],-m[1]*s/2,-m[2]*s+(dy||0),m[1]*s,m[2]*s)},
  on(e){return !!this.I&&(e.k=='wimp'||e.k=='eye'||e.k=='swing'||e.k=='gui')},
  draw(c,e,t){if(e.hide)return;const H=e.h/(e.max?1.1*(e.bsz||1):(e.vs||1)),k=e.k;c.save();c.imageSmoothingEnabled=false;if(FLW)c.filter='brightness(2.4)';
    if(k=='wimp'){const st=e.s,side=st=='sd'||st=='sdw',dv=st=='dv';const row=dv?'wimpa':side?'wimps':'wimp',m=this.M[row],s=H*1.45/44;this.at(c,row,dv?Math.min(3,Math.floor(e.t*12)):Math.floor(t*(st=='dvp'?16:9)+(e.ph||0)*3),s,H*.2)}
    else if(k=='swing'){const st=e.s,s=H*1.55/44;if(st=='dash'){c.save();c.globalAlpha*=.3;for(let i=1;i<=3;i++){c.save();c.translate(-i*10,0);this.at(c,'sws',Math.floor(t*14)+i,s*1.1,H*.2);c.restore()}c.restore();this.at(c,'sws',Math.floor(t*14),s*1.1,H*.2)}
      else this.at(c,'swf',Math.floor(t*(st=='rest'?5:10)+(e.ph||0)*3),s,H*.2);
      if(st=='app'){c.globalCompositeOperation='lighter';c.globalAlpha=.4+.3*Math.sin(t*30);E_(c,0,-H*.5,H*.8,H*.6,RGD(c,0,-H*.5,H*.8,['rgba(177,151,252,.7)','rgba(0,0,0,0)']),0)}}
    else if(k=='eye'){const s=H*2.2/27;if(e.s=='bw'||e.s=='obw'){c.save();c.globalCompositeOperation='lighter';E_(c,0,-H*.55,H*.7,H*.7,RGD(c,0,-H*.55,H*.7,[e.s=='bw'?'rgba(255,230,90,'+(.4+.3*Math.sin(t*25))+')':'rgba(255,90,216,.5)','rgba(0,0,0,0)']),0);c.restore()}
      this.at(c,e.fl>0?'eyeh':'eye',Math.floor(t*10+(e.ph||0)*3),s,H*.35)}
    else if(k=='gui')this.boss(c,e,t,H);
    c.restore()},
  boss(c,e,t,H){const s=H*1.32/111,m=this.M.bwing,W=m[1]*s,Hh=m[2]*s,sh=-Hh*.62,flap=e.act=='wind'&&e.at>.7?.55+.45*Math.abs(Math.sin(t*14)):1-.2*Math.abs(Math.sin(t*(e.act?9:5)));
    // 漂浮的碎片(身后)
    for(let i=0;i<5;i++){const a=t*1.3+i*1.256;if(Math.sin(a)>0)continue;this.fr(c,'shard',i%3,Math.cos(a)*W*.42-7,-Hh*.5+Math.sin(a*2)*Hh*.12-7,1,1)}
    // 长尾:从腰后往下垂,末端卷起
    {const n=12;for(let i=0;i<n;i++){const u=i/n,px=-W*.06-u*W*.38+Math.sin(t*3+u*4)*4*u,py=-Hh*.32+u*Hh*.46-Math.sin(u*3.2)*Hh*.08;if(i==n-1)this.fr(c,'ttip',0,px-7,py-7,1,-1);else this.fr(c,'tseg',0,px-4,py-4,1-u*.3,1)}}
    // 翅膀:以肩膀为轴上下扇动
    c.save();c.translate(0,sh);c.scale(1,flap);c.drawImage(this.I,m[4]||0,m[0],m[1],m[2],-W/2,-Hh-sh,W,Hh);c.restore();
    const b=this.M.bbody;c.drawImage(this.I,b[4]||0,b[0],b[1],b[2],-W/2,-Hh,W,Hh);
    // 第二对手臂(腰部),出招时张开
    {const q=this.M.barm,fi=e.pz?1:0;c.drawImage(this.I,(q[4]||0)+fi*q[1],q[0],q[1],q[2],-q[1]*s*.45-W*.04,-Hh*.5,q[1]*s*.9,q[2]*s*.9)}
    for(let i=0;i<5;i++){const a=t*1.3+i*1.256;if(Math.sin(a)<=0)continue;this.fr(c,'shard',i%3,Math.cos(a)*W*.42-7,-Hh*.5+Math.sin(a*2)*Hh*.12-7,1,1)}
    if(e.pz=='w'){c.save();c.globalCompositeOperation='lighter';E_(c,0,-Hh*.55,W*.45,Hh*.5,RGD(c,0,-Hh*.55,W*.5,['rgba(190,120,255,'+(.25+.15*Math.sin(t*20))+')','rgba(0,0,0,0)']),0);c.restore()}},
  fire(f,fx,fy,t){if(!this.I)return false;const k=f.c==10?'orb':f.c==12?'mball':'shard',m=this.M[k],s=f.s||1;
    x.save();x.globalCompositeOperation='lighter';C_(x,fx,fy,9*s,RGD(x,fx,fy,9*s,[f.c==10?'rgba(255,90,216,.5)':f.c==12?'rgba(177,151,252,.5)':'rgba(200,220,210,.25)','rgba(0,0,0,0)']),0);x.restore();
    this.fr(x,k,Math.floor(t*12+fx*.1),fx-m[1]*s/2,fy-m[2]*s/2,s,1);return true},
  tileRow(k,x0,x1,y){const m=this.M[k],a=Math.max(x0,cam-m[1]),b=Math.min(x1,cam+VW+m[1]);if(b<=a)return;
    for(let px=Math.floor(a/m[1])*m[1];px<b;px+=m[1])x.drawImage(this.I,m[4]||0,m[0],m[1],m[2],Math.round(px-cam),y,m[1],m[2])},
  par(k,par,top,sc,al){const m=this.M[k],w=m[1]*sc,h=m[2]*sc;let ox=-(((cam*par)%w)+w)%w;if(al!=null)x.globalAlpha=al;for(let px=ox;px<VW;px+=w)x.drawImage(this.I,m[4]||0,m[0],m[1],m[2],Math.floor(px),Math.round(top),w,h);x.globalAlpha=1},
  bg(){const I=this.I,M=this.M,t=performance.now()/1000;x.imageSmoothingEnabled=false;
    {const m=M.sky;x.drawImage(I,m[4]||0,m[0],m[1],m[2],0,-40,VW,VH+40)}
    this.par('stars',.01,0,2);{const m=M.moon;x.drawImage(I,m[4]||0,m[0],m[1],m[2],470,34,m[1],m[2]);x.save();x.globalCompositeOperation='lighter';C_(x,492,56,46,RGD(x,492,56,46,['rgba(170,230,255,.25)','rgba(0,0,0,0)']),0);x.restore()}
    this.par('cl2',.04,-30,2,.9);
    // 远处跟着航行的幽灵船(半透明,上下起伏)
    {const m=M.gship;for(const [ox,y0,s,a] of [[120,96,.7,.45],[900,70,.5,.3],[1700,110,.85,.5]]){const w=m[1]*s,sx=((ox-cam*.12)%(VW+w*2)+VW+w*2)%(VW+w*2)-w;x.globalAlpha=a*(.85+.15*Math.sin(t*1.3+ox));x.drawImage(I,m[4]||0,m[0],m[1],m[2],Math.round(sx),Math.round(y0+Math.sin(t*.8+ox)*4),Math.round(w),Math.round(m[2]*s))}x.globalAlpha=1}
    this.par('cl1',.1,60,2,.85);
    // 道具:桅杆在最后面,其他放在甲板上
    for(const [n,px] of PROP10){const m=M[n],sx=px-cam;if(sx<-100||sx>VW+100)continue;
      if(n=='mast')x.drawImage(I,m[4]||0,m[0],m[1],m[2],Math.round(sx-m[1]/2),GY-m[2]-4,m[1],m[2]);
      else if(n=='lantern'){x.fillStyle='#1c2a2e';x.fillRect(Math.round(sx),GY-46,2,42);this.fr(x,'lantern',Math.floor(t*4+px)%3,sx-4,GY-62,1,1);x.save();x.globalCompositeOperation='lighter';C_(x,sx+1,GY-54,18,RGD(x,sx+1,GY-54,18,['rgba(125,255,207,'+(.35+.1*Math.sin(t*5+px))+')','rgba(0,0,0,0)']),0);x.restore()}
      else x.drawImage(I,m[4]||0,m[0],m[1],m[2],Math.round(sx-m[1]/2),GY-m[2]+1,m[1],m[2])}
    // 船舷栏杆 + 甲板 + 船身
    {const m=M.rail;for(let px=Math.floor((cam-32)/32)*32;px<cam+VW+32;px+=32)x.drawImage(I,m[4]||0,m[0],m[1],m[2],Math.round(px-cam),GY-m[2]+2,m[1],m[2])}
    this.tileRow('g_top',0,WW,GY-6);for(let y=GY+26;y<VH;y+=32)this.tileRow('g_fill',0,WW,y);
    for(const p of PL)if(p.y<GY&&!p.gone&&p.x-cam<VW+20&&p.x+p.w-cam>-20)this.plat(p)},
  plat(p){const m=this.M.plat,px=Math.round(p.x-cam),y=Math.round(p.y-1),w=Math.round(p.w),o=m[4]||0,t=performance.now()/1000;
    x.save();x.globalCompositeOperation='lighter';E_(x,px+w/2,y+10,w*.55,6,RGD(x,px+w/2,y+10,w*.55,['rgba(125,255,207,'+(.18+.06*Math.sin(t*3+p.x0))+')','rgba(0,0,0,0)']),0);x.restore();
    x.drawImage(this.I,o,m[0],16,m[2],px,y,16,m[2]);for(let q=16;q<w-16;q+=16){const c=Math.min(16,w-16-q);x.drawImage(this.I,o+16,m[0],c,m[2],px+q,y,c,m[2])}x.drawImage(this.I,o+32,m[0],16,m[2],px+w-16,y,16,m[2])},
  // 画在角色之后:幽灵船的青绿色雾气
  over(){const t=performance.now()/1000;x.fillStyle='rgba(10,40,40,.12)';x.fillRect(0,0,VW,VH);
    if(S10.wind>0){const q=Math.min(1,S10.wind/.3)*.5;x.fillStyle='rgba(215,240,232,'+q+')';for(let i=0;i<34;i++){const L=30+(i%4)*18,px=((i*97+t*700*S10.wd)%(VW+L*2)+VW+L*2)%(VW+L*2)-L;x.fillRect(Math.round(px),Math.round(18+(i*53)%(GY-20)),L,1)}}
    x.save();x.globalCompositeOperation='lighter';for(let i=0;i<4;i++){const px=((i*230-cam*.6+t*14*(i%2?1:-1))%(VW+300)+VW+300)%(VW+300)-150;E_(x,px,GY-6+i%2*4,140,10,RGD(x,px,GY-6,140,['rgba(125,255,207,.08)','rgba(0,0,0,0)']),0)}x.restore()}};
SHIP10.init();
// 第三十轮:第十关的光束(天空竖光束、堕天十字光)= 紫色光束素材(Rawdanitsu,CC0)三层 + 两端紫色魔焰;cx / cy 中心,L 长度,an 方向
function nbBeam(cx,cy,L,an,a){const s=L/64,t=performance.now()/1000;for(const [w,al] of [[36,.55],[20,1],[8,1]])VFX.frame(x,'bm-purp',0,cx,cy,s,1,an,a*al,(w+Math.sin(t*40)*2)/24/s);for(const d of[-1,1])VFX.frame(x,'x-midnight',Math.floor(t*15)%16,cx+Math.cos(an)*L/2*d,cy+Math.sin(an)*L/2*d,1.1,1,0,a)}
// 招式效果(PXL 层,怪物之后画):眼魔的预警线 / 激光、首领残影、天空投射的魔法球、竖直光束
function s10Fx(){if(!SHIP10.I)return;const t=performance.now()/1000;
  for(const e of E){if(e.k!='eye'||e.hp<=0)continue;const ex=e.x+e.w/2-cam,ey=e.y+e.h/2;
    if(!BWOFF&&e.s=='bw'&&e.ba!=null){const n=26;x.fillStyle=e.t>=.7?'rgba(255,224,80,'+(.6+.4*Math.sin(t*40))+')':'rgba(255,224,80,.55)';for(let i=1;i<n;i++){if(i%2)continue;const d=i*16;x.fillRect(Math.round(ex+Math.cos(e.ba)*d)-1,Math.round(ey+Math.sin(e.ba)*d)-1,3,3)}}
    if(e.s=='bm'&&e.ang!=null){const L=440,a=e.ang,s=L/64,mx=ex+Math.cos(a)*L/2,my=ey+Math.sin(a)*L/2;x.save();x.globalCompositeOperation='lighter';for(const [w,al] of [[30,.6],[16,1],[7,1]])VFX.frame(x,'bm-purp',0,mx,my,s,1,a,al,(w+Math.sin(t*50)*2)/24/s);VFX.frame(x,'x-spell',Math.floor(t*15),ex,ey,.9,1,a,1);x.restore()}}  // 第三十轮:激光 = 紫色光束素材加粗 + 眼睛处魔焰
  if(bossOn&&B&&B.k=='gui'&&B.hp>0)for(const a of S10.af){x.save();x.globalAlpha=a.t/.3*.5;x.translate(a.x+B.w/2-cam,a.y+B.h);x.scale(a.f*1.1,1.1);x.filter='brightness(.4) sepia(1) hue-rotate(220deg)';SHIP10.boss(x,{pz:null,act:null},t,B.h/1.1);x.restore()}
  for(const b of S10.sb){const sx=b.x-cam;if(b.st=='trk')BW(()=>DZ.mark(sx,GY-2,14));SHIP10.fire({c:12,s:1.3},sx,b.y,t)}
  for(const b of S10.bm){const sx=b.x-cam;if(b.t<.55){BW(()=>{if(!bwSkip()){DZ.zone(sx-14,28);x.fillStyle='rgba(255,224,80,'+(.25+.25*Math.sin(t*30))+')';x.fillRect(Math.round(sx)-1,0,2,GY)}})}
    else{const q=Math.min(1,(b.t-.55)/.06)*Math.min(1,(.95-b.t)/.15);x.save();x.globalCompositeOperation='lighter';x.globalAlpha=q;nbBeam(sx,GY/2,GY,Math.PI/2,1);x.restore()}}}
// =====================================================================
