// ===== 第九关 · 火山噩梦(2026-10-13):熔岩山脉(红色天空、熔岩河、火山灰、喷气孔)→ 妖魔栖息的火山内部 → 巨大的熔岩祭坛(首领)=====
// 图集 VOL9(art_src/volcano/build_vol9.py):场景 Tio Aimar 火山包(CC0);怪物 / 首领 Gothicvania Patreon's Collection(ansimuz,CC0);熔岩魔 Golem animations(irmirx,CC-BY 3.0)
// 温度(只在这一关):被火焰打中会「升温」,温度本身不扣血;满 100 = 过热,持续掉血,降到 55 以下才解除。熔岩地面 / 地面火焰 / 喷气孔 / 熔岩裂缝也会升温
// 小怪:炎牙魔 imp(火爪 + 冲撞,撞墙眩晕)· 熔火鬼 fwisp(飞行,火球;死后原地爆炸,离得近大量升温)· 熔岩魔 golem(肉盾:拳 → 拳 → 砸地留火)
// 精英:炎狱鬼将 oni(每个区域的最后一只:火刃斩 / 火焰冲锋留下燃烧路径 / 爆炎护体 —— 护体时打它自己也升温)
// 首领:熔狱魔神 lava。熔岩拳 / 炎柱 / 地狱火环;60% 起 熔岩领域 / 火焰锁链;35% 起 火山爆发 / 地狱之握 / 炎魔分身
// =====================================================================
const PL9=[{x:0,y:GY,w:WW},{x:300,y:222,w:96},{x:584,y:236,w:128},{x:820,y:200,w:96},{x:1040,y:214,w:96},{x:1228,y:232,w:128},{x:1460,y:204,w:96},
  {x:1700,y:224,w:96},{x:1876,y:236,w:128},{x:2120,y:206,w:96},{x:2380,y:226,w:96},{x:2660,y:222,w:96},{x:3020,y:222,w:96}];
const E9=[['imp',360],['imp',520],['fwisp',700],['golem',820],
  ['imp',1050],['fwisp',1180],['golem',1320],['imp',1450],['fwisp',1540],
  ['golem',1700],['imp',1820],['fwisp',1960],['imp',2080],['golem',2180],
  ['fwisp',2300],['imp',2400],['golem',2500],['fwisp',2600]];
const LAVA9=[[598,698],[1240,1344],[1890,1990]],VENT9=[420,900,1130,1520,2060,2440],HMAX=100;
const PROP9=[['tree',150],['rock',250],['cry1',470],['plant',540],['tree',760],['rock2',960],['bush',1080],['cry2',1180],['tree',1400],['plant',1560],['rock',1650],
  ['cry3',1790],['rock2',2010],['cry1',2160],['bush',2300],['rock',2520]];
let V9={};
function g9Init(){V9={fp:[],cz:[],pl:[],rw:[],ch:null,gp:null,bm:[],vt:VENT9.map((x,i)=>({x,t:-i*.7,h:0})),bn:0,ash:[],lt:0}}
const v9In=()=>cur==9&&!INTOWN&&st=='play';
const v9G=()=>P.y+P.h>=GY-6;  // 主角站在地面上(不在平台上)
// ---- 温度 ----
function heatAdd(n){if(!v9In()||GM.god||!(n>0))return;P.heat=Math.min(HMAX,(P.heat||0)+n);P.hcd=1.3;if(P.heat>=HMAX&&!P.ovh){P.ovh=1;P.ovt=.5;tx('过热!持续掉血',P.x-20,P.y-34,'#ff6b6b');flash('255,80,30',.25)}}
function burnP(t){if(!v9In()||GM.god)return;if(!(P.burn>0)){P.bnt=.5;tx('燃烧!',P.x,P.y-22,'#ff922b')}P.burn=Math.max(P.burn||0,t)}
function heatStep(dt){if(!v9In())return;const S=stats();P.heat=P.heat||0;P.hcd=(P.hcd||0)-dt;
  const onLava=v9G()&&!P.fly&&LAVA9.some(r=>P.x+P.w-6>r[0]&&P.x+6<r[1]),onFire=v9G()&&V9.fp.some(f=>Math.abs(P.x+12-f.x)<f.w/2+4),onCrk=v9G()&&V9.cz.some(z=>z.w0<=0&&P.x+12>z.x&&P.x+12<z.x+z.w);
  if(onLava)heatAdd(34*dt);if(onFire)heatAdd(26*dt);if(onCrk)heatAdd(38*dt);
  if((onLava||onFire||onCrk)&&Math.random()<dt*14)pt({x:P.x+12+rnd(-8,8),y:P.y+P.h-2,vx:rnd(-20,20),vy:rnd(-90,-40),c:pick(['#ff922b','#ffd43b','#ff6b35']),s:2,l:.4});
  if(P.hcd<=0)P.heat=Math.max(0,P.heat-dt*(P.ovh?11:14));
  if(P.ovh&&P.heat<55){P.ovh=0;tx('温度降下来了',P.x-16,P.y-30,'#a5d8ff')}
  if(P.ovh){P.ovt-=dt;if(P.ovt<=0){P.ovt=.5;if(!GM.god&&P.hp>0){const d=Math.max(1,Math.round(S.hp*.022));P.hp-=d;tx('-'+d,P.x+6,P.y-6,'#ff922b')}}}
  if(P.burn>0){P.burn-=dt;P.bnt-=dt;if(P.bnt<=0){P.bnt=.5;heatAdd(3);if(!GM.god&&P.hp>0){const d=Math.max(1,Math.round(S.hp*.008));P.hp-=d;tx('-'+d,P.x+6,P.y-6,'#ffa94d')}}
    if(Math.random()<dt*20)pt({x:P.x+rnd(2,22),y:P.y+rnd(4,30),vx:rnd(-10,10),vy:rnd(-70,-30),c:pick(['#ff922b','#ffd43b']),sh:2,s:rnd(3,5),l:.3})}
  if(P.heat>60&&Math.random()<dt*P.heat/20)pt({x:P.x+rnd(2,22),y:P.y+rnd(0,20),vx:rnd(-6,6),vy:rnd(-40,-20),c:'rgba(255,230,210,.35)',ad:0,s:rnd(3,5),gr:1.4,l:.6})}
// ---- 场景机关:熔岩河 / 喷气孔 / 地面火焰 / 熔岩裂缝 / 熔火鬼自爆 ----
function v9Step(dt){const pc=P.x+12;V9.lt+=dt;heatStep(dt);
  for(const v of V9.vt){v.t+=dt;const T=v.t%4.4;if(v.t<0)continue;if(T<dt)v.h=0;
    if(T<.9){if(Math.random()<dt*12)pt({x:v.x+rnd(-4,4),y:GY-14,vx:rnd(-10,10),vy:rnd(-60,-30),c:'rgba(90,80,80,.6)',ad:0,s:rnd(3,6),gr:1.5,l:.8})}
    else if(T<1.9&&!v.h&&Math.abs(pc-v.x)<18&&P.y+P.h>GY-110&&P.x+P.w>v.x-30&&P.x<v.x+30){v.h=1;if(hurt(6*LDM,{kb:sgn(pc-v.x)*200}))tx('喷气孔!',P.x-6,P.y-22,'#ff922b');heatAdd(30)}}
  for(const f of V9.fp)f.t-=dt;V9.fp=V9.fp.filter(f=>f.t>0);
  for(const z of V9.cz){z.w0-=dt;z.t-=dt}V9.cz=V9.cz.filter(z=>z.t>0);
  for(const b of V9.bm){b.t-=dt;if(b.t<=0&&!b.d){b.d=1;SFX5('r-burst',b.x,b.y,{s:2,life:.5,gr:.6});VFX.spawn('warm-explosion',b.x,b.y+10,{s:1.4});shake=Math.max(shake,.2);syn('boom');
      const d=Math.hypot(pc-b.x,P.y+16-b.y);if(d<80){hurt(7*LDM,{kb:sgn(pc-b.x)*300});heatAdd(d<50?40:28);tx('爆炸的热浪!',P.x-14,P.y-30,'#ff922b')}}}
  V9.bm=V9.bm.filter(b=>!b.d);
  // 首领招式留下的东西
  for(const p of V9.pl){p.t+=dt;if(p.t>=p.w&&!p.h&&p.t<p.w+.6&&Math.abs(pc-p.x)<(p.sm?18:24)&&P.y+P.h>GY-150){p.h=1;if(hurt((p.sm?10:14)*LDM)){heatAdd(p.sm?14:20);burnP(2)}}}V9.pl=V9.pl.filter(p=>p.t<p.w+.7);
  for(const r of V9.rw){r.t+=dt;r.x+=r.d*250*dt;if(!r.h&&Math.abs(pc-r.x)<14&&P.y+P.h>GY-30){r.h=1;if(hurt(12*LDM,{kb:r.d*260}))heatAdd(16)}}V9.rw=V9.rw.filter(r=>r.x>ARL-20&&r.x<ARR+20);
  // 段落提示
  const bn=[[0,'火山噩梦 · 被火焰打中会升温,温度满了会持续掉血'],[980,'熔岩河 · 别在熔岩上停留太久'],[1620,'火山内部 · 妖魔的巢穴'],[2260,'通往熔岩祭坛……空气在燃烧'],[2620,'熔狱魔神从岩浆里站了起来']];
  while(V9.bn<bn.length&&P.x>=bn[V9.bn][0]){banner(bn[V9.bn][1]);V9.bn++}
  // 火山灰
  if(Math.random()<dt*10)V9.ash.push({x:cam+rnd(-20,VW+20),y:-6,vx:rnd(-12,4),vy:rnd(14,30),c:Math.random()<.2,ph:rnd(0,6)});for(const a of V9.ash){a.x+=a.vx*dt+Math.sin(V9.lt*2+a.ph)*6*dt;a.y+=a.vy*dt}V9.ash=V9.ash.filter(a=>a.y<GY+40)}
function v9Patch(x,w,t){V9.fp.push({x,w:w||40,t:t||3,m:t||3})}
// ---- 炎牙魔:火爪(近身)/ 冲撞(蓄力后直线冲刺,撞墙眩晕)----
function impStep(e,dt){const dm=e.dm,cx=e.x+e.w/2,pc=P.x+12,dx=pc-cx,ad=Math.abs(dx),lo=g8Lo(e),hi=g8Hi(e),cl=v=>Math.max(lo,Math.min(hi-e.w,v));
  e.cd=(e.cd==null?rnd(.8,1.6):e.cd)-dt;e.pz=null;const s=e.s;if(s)e.t+=dt;
  if(s=='cw'){e.pz='w';if(e.t>=.38){e.s='cl';e.t=0;e.hd=0}return}
  if(s=='cl'){e.pz='s';if(!e.hd&&e.t>.05){e.hd=1;VFX.spawn('m-claw',cx+e.f*24,e.y+e.h*.45,{f:e.f,s:1.4});const hb={x:e.f>0?e.x+e.w-8:e.x-40,y:e.y+4,w:48,h:e.h-4};if(ov(P,hb)&&hurt(10*dm,{kb:e.f*260})){heatAdd(14);burnP(1.5)}}if(e.t>.25){e.s='rec';e.t=0}return}
  if(s=='chw'){e.pz='w';e.f=sgn(dx)||e.f;if(e.t>=.7){e.s='ch';e.t=0;e.hd=0}return}
  if(s=='ch'){e.pz='s';const nx=e.x+e.f*430*dt;if(Math.random()<dt*30)pt({x:cx-e.f*10,y:e.y+e.h-4,vx:-e.f*rnd(40,90),vy:rnd(-60,-20),c:pick(['#ff922b','#ffd43b']),s:2,l:.3});
    if(nx<lo+2||nx+e.w>hi-2){e.x=cl(nx);e.s='rec';e.t=0;e.st=1.4;shake=Math.max(shake,.12);burst(e.f>0?e.x+e.w:e.x,e.y+e.h/2,10,['#adb5bd','#ff922b'],160,{s:2.5,l:.35});tx('撞墙眩晕!',cx-16,e.y-18,'#ffd43b');return}
    e.x=nx;if(!e.hd&&ov(P,e)&&hurt(12*dm,{kb:e.f*380})){e.hd=1;heatAdd(10)}if(e.t>1.3){e.s='rec';e.t=0}return}
  if(s=='rec'){if(e.t>.5){e.s=null;e.cd=rnd(.6,1.2)}return}
  e.f=sgn(dx)||e.f;if(ad>e.w/2+22)e.x=cl(e.x+e.f*chV(58,ad)*dt);
  if(e.cd<=0&&ad<340&&Math.abs(P.y+P.h-(e.y+e.h))<120){const n=ad<e.w/2+40?'cw':ad>120&&Math.random()<.6?'chw':null;if(!n)return;if(!tok(e)){e.cd=.3;return}e.s=n;e.t=0;e.hd=0}}
// ---- 熔火鬼:飘在斜上方,吐火球;死后 0.4 秒原地爆炸 ----
function fwispStep(e,dt){const cx=e.x+e.w/2,pc=P.x+12,dx=pc-cx,lo=g8Lo(e),hi=g8Hi(e),cl=v=>Math.max(lo,Math.min(hi-e.w,v));
  e.cd=(e.cd==null?rnd(1,2):e.cd)-dt;e.pz=null;e.gs=(e.gs||0)+dt;const s=e.s;if(s)e.t+=dt;e.f=sgn(dx)||e.f;
  if(s=='fbw'){e.pz='w';if(e.t>=.5){e.s='rec';e.t=0;const fy=e.y+e.h*.5,a=Math.atan2(P.y+16-fy,pc-cx),v=190;F.push({x:cx+e.f*10,y:fy,vx:Math.cos(a)*v,vy:Math.sin(a)*v,ng:1,c:9,dmg:8*LDM,ht:11,s:1});syn('fire')}return}
  if(s=='rec'){if(e.t>.5){e.s=null;e.cd=rnd(.9,1.6)}return}
  if(!e.side)e.side=Math.random()<.5?-1:1;const hx=pc+e.side*(120+30*Math.sin(e.gs*.8+e.ph)),hy=e.by+Math.sin(e.gs*2.2+e.ph)*12;
  e.x=cl(e.x+(hx-e.w/2-e.x)*chL(Math.abs(dx),dt,.8));e.y+=(hy-e.y)*Math.min(1,dt*1.5);if(Math.random()<dt*.15)e.side*=-1;
  if(e.cd<=0&&Math.abs(dx)<360){if(!tok(e,1)){e.cd=.35;return}e.s='fbw';e.t=0}}
// ---- 熔岩魔:慢、血厚;拳 → 拳 → 砸地(落点留下地面火焰)----
function golemStep(e,dt){const dm=e.dm,cx=e.x+e.w/2,pc=P.x+12,dx=pc-cx,ad=Math.abs(dx),lo=g8Lo(e),hi=g8Hi(e),cl=v=>Math.max(lo,Math.min(hi-e.w,v));
  e.cd=(e.cd==null?rnd(.8,1.5):e.cd)-dt;e.pz=null;const s=e.s;if(s)e.t+=dt;
  if(s=='cmb'){const T=e.t,box=(w)=>({x:e.f>0?e.x+e.w-10:e.x-w+10,y:e.y,w,h:e.h});
    e.pz=T<.45||(T>.62&&T<.95)||(T>1.15&&T<1.75)?'w':'s';
    if(T>=.45&&e.hn<1){e.hn=1;syn('eatk');if(ov(P,box(56))&&hurt(11*dm,{kb:e.f*240}))heatAdd(6)}
    if(T>=.95&&e.hn<2){e.hn=2;syn('eatk');if(ov(P,box(56))&&hurt(11*dm,{kb:e.f*240}))heatAdd(6)}
    if(T>=1.75&&e.hn<3){e.hn=3;const ix=cx+e.f*(e.w/2+26);syn('slam');shake=Math.max(shake,.25);VFX.spawn('earth-rupture',ix,GY,{s:1.3});burst(ix,GY-6,16,['#ff922b','#ffd43b','#495057'],260,{s:3,l:.45,g:500});v9Patch(ix,64,3.2);
      if(Math.abs(pc-ix)<52&&v9G()&&hurt(14*dm,{kb:e.f*320})){heatAdd(18);burnP(2)}}
    if(T>2.4){e.s=null;e.cd=rnd(.9,1.5)}return}
  e.f=sgn(dx)||e.f;if(ad>e.w/2+26)e.x=cl(e.x+e.f*chV(30,ad)*dt);
  if(e.cd<=0&&ad<e.w/2+56&&Math.abs(P.y+P.h-GY)<110){if(!tok(e)){e.cd=.3;return}e.s='cmb';e.t=0;e.hn=0}}
// ---- 炎狱鬼将:火刃斩 / 火焰冲锋(燃烧路径)/ 爆炎护体 ----
function oniStep(e,dt){const dm=e.dm,cx=e.x+e.w/2,pc=P.x+12,dx=pc-cx,ad=Math.abs(dx),lo=g8Lo(e),hi=g8Hi(e),cl=v=>Math.max(lo,Math.min(hi-e.w,v));
  e.cd=(e.cd==null?rnd(1,1.6):e.cd)-dt;e.pz=null;e.fsh=(e.fsh||0)-dt;const s=e.s;if(s)e.t+=dt;
  if(!e.intro){e.intro=1;banner('炎狱鬼将 · 两把燃烧的弯刀');tx('精英',cx-8,e.y-20,'#ff922b')}
  if(s=='fnw'){e.pz='w';e.f=sgn(dx)||e.f;if(e.t>=.6){e.s='fan';e.t=0;e.hd=0;syn('heavy')}return}
  if(s=='fan'){e.pz='s';if(!e.hd){e.hd=1;const ox=cx+e.f*40,oy=e.y+e.h*.45;slash(ox,oy,70,-1.6,1.1,e.f,'#ffd43b',.3,8);slash(ox,oy,56,-1.3,1.3,e.f,'#ff6b35',.28,6);SFX5('r-cross',ox+e.f*20,oy,{s:1.3,life:.4});
      const hb={x:e.f>0?e.x+e.w*.4:e.x+e.w*.6-120,y:e.y-10,w:120,h:e.h+10};if(ov(P,hb)&&hurt(16*dm,{kb:e.f*360})){heatAdd(14);burnP(3)}}
    if(e.t>.45){e.s='rec';e.t=0}return}
  if(s=='cgw'){e.pz='w';e.f=sgn(dx)||e.f;if(e.t>=.5){e.s='cg';e.t=0;e.hd=0;e.lx=cx;syn('dash')}return}
  if(s=='cg'){e.pz='s';const nx=cl(e.x+e.f*520*dt);const hit=nx==e.x;e.x=nx;const c2=e.x+e.w/2;if(Math.abs(c2-e.lx)>34){e.lx=c2;v9Patch(c2,40,3)}
    if(!e.hd&&ov(P,e)&&hurt(14*dm,{kb:e.f*400})){e.hd=1;heatAdd(12)}if(hit||e.t>.6){e.s='rec';e.t=0}return}
  if(s=='shw'){e.pz='w';if(e.t>=.5){e.s='rec';e.t=0;e.fsh=4.5;syn('buff');SFX5('r-ring',cx,e.y+e.h/2,{s:2,life:.5,gr:.5});tx('爆炎护体!打它会升温',cx-30,e.y-20,'#ff922b')}return}
  if(s=='rec'){if(e.t>.55){e.s=null;e.cd=rnd(.6,1.1)}return}
  e.f=sgn(dx)||e.f;if(ad>e.w/2+30)e.x=cl(e.x+e.f*chV(52,ad)*dt);
  if(e.cd<=0&&ad<380){const r=Math.random(),n=!(e.fsh>0)&&r<.22?'shw':ad<e.w/2+70?'fnw':r<.7?'cgw':'fnw';if(n=='fnw'&&ad>e.w/2+90){e.x=cl(e.x+e.f*52*dt);return}if(!tok(e)){e.cd=.3;return}e.s=n;e.t=0;e.hd=0}}
// ---- 首领:熔狱魔神 ----
function lavaMove(e,dt,k){const pc=P.x+12,dx=pc-(e.x+e.w/2);e.f=sgn(dx)||e.f;const want=Math.abs(dx)>110?e.f*70:Math.abs(dx)<60?-e.f*40:0;
  e.x=Math.max(ARL+10,Math.min(ARR-10-e.w,e.x+want*dt*(k==null?1:k)));e.fy=(e.fy||0)+dt;e.y=GY-e.h-6+Math.sin(e.fy*2)*3}
function lavaEnd(e){e.act=null;e.cd=(e.p3?.5:.85)+Math.random()*.5}

const V9F=[];  // 熔岩拳 / 爆炸的火焰(图集 dfire 播放一遍)
function v9Fire(x_,y_,s){V9F.push({x:x_,y:y_,s,t:0})}

function lcloneStep(e,dt){const pc=P.x+12,cx=e.x+e.w/2;e.f=sgn(pc-cx)||e.f;e.fy=(e.fy||0)+dt;e.y=e.by+Math.sin(e.fy*2+e.ph)*8;e.cd-=dt;e.pz=e.cd<.45?'w':null;
  if(!B||B.hp<=0){e.hp=0;return}
  if(e.cd<=0){e.cd=2.2+Math.random()*.6;const fy=e.y+e.h*.4,a=Math.atan2(P.y+16-fy,pc-cx);F.push({x:cx+e.f*16,y:fy,vx:Math.cos(a)*200,vy:Math.sin(a)*200,ng:1,c:9,dmg:7*LDM,ht:9,s:1.2})}}
// 第十六轮重做(熔狱魔神):旧招(重拳 / 火柱 / 熔岩环 / 熔岩领域 / 火焰锁链 / 火山爆发 / 地狱之握 / 分身)删除;新招:火焰喷流 brth / 岩浆喷泉 spout / 炎柱追击 hunt;保留第十五轮的 陨火天降 met / 熔岩海啸 tsu / 炎狱裂地 crs / 熔核爆 nova
function lavaStep(e,dt){const cx=e.x+e.w/2,pc=P.x+12,hp=e.hp/e.max;e.pz=null;
  if(!e.intro){e.intro=1;shake=.4;flash('255,120,40',.25)}
  if(!e.p2&&hp<=.6){e.p2=1;banner('熔狱魔神的岩缝里涌出了熔岩……')}
  if(!e.p3&&hp<=.35){e.p3=1;banner('熔狱魔神狂怒!');shake=.5;flash('255,60,20',.35)}
  const sp=e.p3?1.25:1;
  if(e.act){const a=e.act;e.at+=dt*sp;const T=e.at;if(NBA[a]){NBA[a](e,dt,T);return}
    if(a=='brth'){lavaMove(e,dt,0);if(T<.8){e.pz='w';e.f=sgn(pc-cx)||e.f;return}e.pz='s';const L=Math.min(1,(T-.8)/.5)*(e.f>0?ARR-cx:cx-ARL);  // 0.8 秒吸气 → 贴地火焰一路烧到墙边(跳过去 / 绕到身后)
      e.tk=(e.tk||0)-dt;if(e.tk<=0&&T<2.1){e.tk=.07;v9Patch(cx+e.f*rnd(e.w/2,Math.max(e.w/2+1,L)),44,.5)}
      e.hh=(e.hh||0)-dt;if(T<2.1&&!(e.hh>0)&&(pc-cx)*e.f>e.w/2-10&&Math.abs(pc-cx)<L&&P.y+P.h>GY-44&&hurt(13*e.dm,{kb:e.f*300})){e.hh=.5;heatAdd(22);burnP(2)}if(T>2.4)lavaEnd(e);return}
    if(a=='spout'){lavaMove(e,dt,0);e.pz=T<.6?'w':null;if(T>=.6&&!e.h1){e.h1=1;const xs=[pc];for(let i=0;i<10&&xs.length<4;i++){const q=ARL+40+Math.random()*(ARR-ARL-80);if(xs.every(v=>Math.abs(v-q)>110))xs.push(q)}  // 4 处火柱(1 处在脚下)+ 往上抛会落下的火球
        for(const q of xs){V9.pl.push({x:Math.max(ARL+20,Math.min(ARR-20,q)),t:0,w:.9});for(let j=0;j<3;j++)F.push({x:q+rnd(-10,10),y:GY-60,vx:rnd(-90,90),vy:-rnd(380,520),g:700,c:9,dmg:7*LDM,ht:9,s:.9})}}if(T>2.4)lavaEnd(e);return}
    if(a=='hunt'){lavaMove(e,dt,.3);e.pz=T<.5?'w':'s';const n=e.p3?7:5;e.tk=(e.tk||0)-dt;if(T>=.5&&e.n<n&&e.tk<=0){e.tk=.45;e.n++;V9.pl.push({x:Math.max(ARL+20,Math.min(ARR-20,pc+P.vx*.15)),t:0,w:.5,sm:1})}if(T>.5+n*.45+.8)lavaEnd(e);return}  // 火柱每 0.45 秒追一次玩家位置
    return}
  lavaMove(e,dt);e.cd-=dt*sp;
  if(e.cd<=0){const ad=Math.abs(pc-cx),Q=['hunt','met','brth','spout','crs'];if(ad<e.w/2+140)Q.push('brth','brth');if(e.p2)Q.push('tsu','nova','hunt');if(e.p3)Q.push('tsu','met','nova','spout');
    let a=Q[Math.random()*Q.length|0];if(a==e.la)a=Q[Math.random()*Q.length|0];e.la=a;e.act=a;e.at=0;e.h1=e.h2=0;e.n=0;e.tk=0;e.hh=0}}
// ---- 绘制 ----
const VOL9={I:null,D:'@@A:vol9_atlas@@',M:{"sky":[0,32,180,1],"ash":[181,320,44,1],"far":[226,320,107,1],"mid":[334,320,73,1],"mid2":[408,320,82,1],"near":[491,320,48,1],"cwall":[540,160,150,1],"ceil":[691,160,56,1],"g_top":[748,32,32,1,0],"g_fill":[748,32,32,1,33],"g_top2":[748,32,32,1,66],"g_fill2":[748,32,32,1,99],"plat":[828,32,32,4],"plat2":[861,32,32,4],"lava":[894,32,32,2],"tree":[748,32,56,1,132],"vent":[748,32,19,1,165],"rock":[748,24,22,1,198],"rock2":[748,25,17,1,223],"cry1":[748,18,14,1,249],"cry2":[748,18,14,1,268],"cry3":[748,18,14,1,287],"plant":[748,20,30,1,306],"bush":[748,32,22,1,327],"altar":[927,240,112,1],"imp":[1040,58,66,10],"oni":[1107,58,66,10],"scim":[748,36,14,1,360],"pillar":[1174,72,159,2],"skull":[1334,44,50,8],"fball":[1385,19,16,3],"golem":[1402,88,62,12],"demon":[1465,157,158,14],"dfire":[1624,132,72,5],"flame":[1697,16,22,3],"crack":[748,64,8,1,397],"hand":[1720,56,72,3]},
  init(){const im=new Image();im.onload=()=>{this.I=im};im.src=this.D},
  // 第 i 帧画到 (X,Y) 左上角,放大 s,f=-1 水平翻转(以帧宽为轴)
  fr(c,k,i,X,Y,s,f){const m=this.M[k];if(!m||!this.I)return;s=s||1;c.save();c.imageSmoothingEnabled=false;c.translate(Math.round(X),Math.round(Y));if(f<0){c.translate(m[1]*s,0);c.scale(-1,1)}c.drawImage(this.I,(m[4]||0)+(i%m[3])*m[1],m[0],m[1],m[2],0,0,m[1]*s,m[2]*s);c.restore()},
  on(e){return !!this.I&&(e.k=='imp'||e.k=='oni'||e.k=='fwisp'||e.k=='golem'||e.k=='lava'||e.k=='lclone')},
  // 怪物:c 已经平移到脚底中间、按朝向翻转(面朝右)
  draw(c,e,t){const H=e.h/(e.max?1.1*(e.bsz||1):(e.vs||1)),k=e.k;let row,fi,vh,s;
    if(k=='imp'||k=='oni'){row=k;vh=62;const st=e.s;fi=st=='cw'||st=='chw'||st=='fnw'||st=='cgw'||st=='shw'?6+Math.floor(e.t*6)%2:st=='cl'||st=='fan'?8+(e.t>.12?1:0):Math.floor(t*(st=='ch'||st=='cg'?16:8)+(e.ph||0)*3)%6}
    else if(k=='fwisp'){row='skull';vh=44;fi=Math.floor(t*10+(e.ph||0)*3)%8}
    else if(k=='golem'){row='golem';vh=70;if(e.s=='cmb'){const T=e.t;fi=T<.45?6+Math.min(2,Math.floor(T/.15)):T<.62?9:T<.95?6+Math.min(2,Math.floor((T-.62)/.11)):T<1.15?10:T<1.75?7+Math.floor((T-1.15)/.3)%2:11}else fi=Math.floor(t*6+(e.ph||0)*3)%6}
    else{row='demon';vh=k=='lclone'?110:92;fi=e.pz=='w'?6+Math.floor(t*8)%4:e.pz=='s'?10+Math.min(3,Math.floor((e.at||0)*8)%4):Math.floor(t*7+(e.ph||0))%6}
    const m=this.M[row];s=H/vh;
    c.save();if(FLW)c.filter='brightness(2.6)';else if(k=='lclone'){c.globalAlpha*=.8;c.save();c.globalCompositeOperation='lighter';E_(c,0,-H*.55,H*.5,H*.6,RGD(c,0,-H*.55,H*.6,['rgba(255,120,30,'+(.45+.15*Math.sin(t*10))+')','rgba(255,60,10,.12)','rgba(0,0,0,0)']),0);c.restore()}
    if(e.fsh>0){c.save();c.globalCompositeOperation='lighter';E_(c,0,-H/2,H*.55,H*.62,RGD(c,0,-H/2,H*.6,['rgba(255,140,40,'+(.25+.1*Math.sin(t*12))+')','rgba(255,60,20,.08)','rgba(0,0,0,0)']),0);c.restore()}
    c.imageSmoothingEnabled=false;c.drawImage(this.I,(m[4]||0)+fi*m[1],m[0],m[1],m[2],-m[1]*s/2,-m[2]*s,m[1]*s,m[2]*s);
    if(k=='oni'){// 两把燃烧的弯刀(手的位置按帧估计):平时刀尖斜指前上方,前摇举高,出招时往下劈
      const q=this.M.scim,fan=e.s=='fan'?Math.min(1,e.t/.15):0,up=e.s=='fnw'?Math.min(1,e.t/.4):0,a0=.55-up*2.1+fan*2.4;
      for(const [hx,hy,da] of [[-9,-27,-.3],[15,-26,0]]){c.save();c.translate(hx*s,hy*s);c.rotate(a0+da);c.drawImage(this.I,q[4]||0,q[0],q[1],q[2],-4*s*.7,-11*s*.7,q[1]*s*.7,q[2]*s*.7);
        c.globalCompositeOperation='lighter';c.globalAlpha=.5+.3*Math.sin(t*20+hx);c.fillStyle='rgba(255,140,40,.6)';for(let i=0;i<3;i++){const u=(10+i*8)*s*.7;c.fillRect(u,-9*s*.7-Math.random()*3*s,2*s,3*s)}c.restore()}}
    c.restore()},
  fire(f,fx,fy,t){if(!this.I)return false;x.save();x.globalCompositeOperation='lighter';C_(x,fx,fy,12,RGD(x,fx,fy,12,['rgba(255,150,50,.55)','rgba(0,0,0,0)']),0);x.restore();const m=this.M.fball,s=f.s||1;this.fr(x,'fball',Math.floor(t*12),fx-m[1]*s/2,fy-m[2]*s/2,s,f.vx<0?-1:1);return true},
  tileRow(k,i,x0,x1,y){const m=this.M[k],a=Math.max(x0,cam-m[1]),b=Math.min(x1,cam+VW+m[1]);if(b<=a)return;x.save();x.beginPath();x.rect(Math.floor(x0-cam),0,Math.ceil(x1-x0),VH);x.clip();
    for(let px=Math.floor(a/m[1])*m[1];px<b;px+=m[1])x.drawImage(this.I,(m[4]||0)+i*m[1],m[0],m[1],m[2],Math.round(px-cam),y,m[1],m[2]);x.restore()},
  // 视差图层(图集是 1/4 尺寸,放大 2 倍画):bot = 屏幕底边 y
  par(k,par,bot,sc){const m=this.M[k],w=m[1]*sc,h=m[2]*sc;let ox=-(((cam*par)%w)+w)%w;for(let px=ox;px<VW;px+=w)x.drawImage(this.I,m[4]||0,m[0],m[1],m[2],Math.floor(px),Math.round(bot-h),w,h)},
  inK(){return Math.max(0,Math.min(1,(cam+VW/2-1500)/400))},  // 0 = 火山外围,1 = 火山内部
  bg(){const I=this.I,M=this.M,t=performance.now()/1000,k=this.inK();x.imageSmoothingEnabled=false;
    {const m=M.sky;x.drawImage(I,m[4]||0,m[0],m[1],m[2],0,0,VW,GY)}
    this.par('ash',.03,90,2);this.par('far',.06,GY-20,2);
    {const vx=420-(cam*.06)%640;for(let i=0;i<5;i++){const q=(t*.25+i/5)%1;C_(x,vx+Math.sin(q*6+i)*8+q*14,96-q*70,5+q*14,'rgba(60,40,40,'+.5*(1-q)+')',0)}x.save();x.globalCompositeOperation='lighter';C_(x,vx,98,30,RGD(x,vx,98,30,['rgba(255,140,40,'+(.35+.1*Math.sin(t*3))+')','rgba(0,0,0,0)']),0);x.restore()}
    this.par('mid',.12,GY-6,2);this.par('mid2',.2,GY,2);this.par('near',.32,GY+4,2);
    if(k>0){x.globalAlpha=k;const m=M.cwall;for(let px=-(((cam*.4)%(m[1]*2))+m[1]*2)%(m[1]*2);px<VW;px+=m[1]*2)x.drawImage(I,m[4]||0,m[0],m[1],m[2],Math.floor(px),GY-m[2]*2+20,m[1]*2,m[2]*2);
      const c2=M.ceil;for(let px=-(((cam*.9)%(c2[1]*2))+c2[1]*2)%(c2[1]*2);px<VW;px+=c2[1]*2)x.drawImage(I,c2[4]||0,c2[0],c2[1],c2[2],Math.floor(px),-6,c2[1]*2,c2[2]*2);x.globalAlpha=1}
    // 祭坛(首领场地中间)
    {const m=M.altar,ax=2875-m[1]/2-cam;if(ax<VW&&ax+m[1]>0){x.drawImage(I,m[4]||0,m[0],m[1],m[2],Math.round(ax),GY-m[2]+6,m[1],m[2]);for(const px of [ax+51,ax+m[1]-51]){this.fr(x,'flame',Math.floor(t*10+px),px-8,GY-m[2]+6-18,1,1);x.save();x.globalCompositeOperation='lighter';C_(x,px,GY-m[2]-4,16,RGD(x,px,GY-m[2]-4,16,['rgba(255,150,50,.45)','rgba(0,0,0,0)']),0);x.restore()}}}
    for(const [n,px] of PROP9){const m=M[n],sx=px-cam;if(sx<-40||sx>VW+40)continue;x.drawImage(I,m[4]||0,m[0],m[1],m[2],Math.round(sx),GY-m[2]+2,m[1],m[2])}
    // 地面:外围橙色熔岩壳,内部灰黑;熔岩河换成流动的熔岩
    const IX=1760;this.tileRow('g_top',0,0,IX,GY-6);this.tileRow('g_top2',0,IX,WW,GY-6);for(let y=GY+26;y<VH;y+=32){this.tileRow('g_fill',0,0,IX,y);this.tileRow('g_fill2',0,IX,WW,y)}
    for(const r of LAVA9){const m=M.lava,sh=(t*14)%m[1];x.save();x.beginPath();x.rect(Math.floor(r[0]-cam),GY-8,r[1]-r[0],VH-GY+8);x.clip();for(let px=r[0]-m[1];px<r[1]+m[1];px+=m[1]){x.drawImage(I,m[4]||0,m[0],m[1],m[2],Math.round(px+sh-cam),GY-8,m[1],m[2]);for(let y=GY+24;y<VH;y+=m[2])x.drawImage(I,(m[4]||0)+m[1],m[0],m[1],m[2],Math.round(px-sh*.5-cam),y,m[1],m[2])}
      x.globalCompositeOperation='lighter';x.fillStyle=LG(x,0,GY-60,0,GY,['rgba(255,120,30,0)','rgba(255,120,30,'+(.25+.08*Math.sin(t*4+r[0]))+')']);x.fillRect(r[0]-cam,GY-60,r[1]-r[0],60);x.restore()}
    for(const v of V9.vt||[]){const m=M.vent,sx=v.x-cam;if(sx<-60||sx>VW+60)continue;x.drawImage(I,m[4]||0,m[0],m[1],m[2],Math.round(sx-m[1]/2),GY-m[2]+3,m[1],m[2]);const T=v.t%4.4;
      if(v.t>=0&&T<.9){x.save();x.globalCompositeOperation='lighter';x.fillStyle='rgba(255,120,30,'+(.2+.2*Math.sin(t*20))+')';x.fillRect(Math.round(sx-14),GY-4,28,3);x.restore()}
      else if(v.t>=0&&T<1.9){const q=Math.min(1,(T-.9)/.15)*Math.min(1,(1.9-T)/.2),p=M.pillar,s=.5;x.save();x.globalAlpha=q;x.beginPath();x.rect(sx-30,0,60,GY-8);x.clip();this.fr(x,'pillar',Math.floor(t*12)%2,sx-p[1]*s/2,GY-12-p[2]*s*q,s,1);x.restore()}}
    for(const p of PL)if(p.y<GY&&!p.gone&&p.x-cam<VW+20&&p.x+p.w-cam>-20)this.plat(p,p.x>=IX?'plat2':'plat')},
  plat(p,k){const m=this.M[k],px=Math.round(p.x-cam),y=Math.round(p.y-3),w=Math.round(p.w),o=m[4]||0;
    x.drawImage(this.I,o,m[0],32,m[2],px,y,32,m[2]);for(let q=32;q<w-32;q+=32){const c=Math.min(32,w-32-q);x.drawImage(this.I,o+(1+(q>>5)%2)*32,m[0],c,m[2],px+q,y,c,m[2])}x.drawImage(this.I,o+96,m[0],32,m[2],px+w-32,y,32,m[2])},
  // 画在角色之后:热浪色调、火山灰、过热时的红色暗角
  over(){const t=performance.now()/1000,k=this.inK();
    x.fillStyle='rgba(60,8,0,'+(.08+.1*k)+')';x.fillRect(0,0,VW,VH);
    for(const a of V9.ash||[]){const sx=a.x-cam;if(a.c){x.fillStyle='rgba(255,'+(140+(a.ph*20|0))+',60,.85)';x.fillRect(Math.round(sx),Math.round(GY-(a.y%GY)),1,1)}else{x.fillStyle='rgba(70,64,64,.7)';x.fillRect(Math.round(sx),Math.round(a.y),2,1)}}
    if(P.heat>70||P.ovh){const q=P.ovh?.55+.15*Math.sin(t*8):(P.heat-70)/30*.35,px=P.x+12-cam,g=x.createRadialGradient(px,180,140,px,180,380);g.addColorStop(0,'rgba(255,40,0,0)');g.addColorStop(1,'rgba(200,30,0,'+q+')');x.fillStyle=g;x.fillRect(0,0,VW,VH)}},
  // 温度条(血蓝条下面)
  hud(){if(!v9In())return;const h=P.heat||0,X=104,Y=66,W=100,t=performance.now()/1000;RR(x,X+11,Y-2,W+4,12,4,'rgba(20,6,4,.75)',0);
    const c=P.ovh?(Math.sin(t*10)>0?'#ff3b1f':'#ffd43b'):h>70?'#ff6b35':h>40?'#ff922b':'#ffd43b';
    RR(x,X+13,Y,W,8,3,'#3a1410',0);RR(x,X+13,Y,W*h/HMAX,8,3,c,0)}};  // 第十三轮:温度条不再写「温」「过热」文字
VOL9.init();
// 招式效果(PXL 层,怪物之后画)
function v9Fx(){if(!VOL9.I)return;const t=performance.now()/1000,M=VOL9.M;
  for(const f of V9.fp){const sx=f.x-cam,n=Math.max(1,Math.round(f.w/14)),a=Math.min(1,f.t/.4);if(sx<-60||sx>VW+60)continue;x.save();x.globalAlpha=a;for(let i=0;i<n;i++)VOL9.fr(x,'flame',Math.floor(t*12+i*2)%3,sx-f.w/2+i*(f.w/n),GY-20+(i%2)*2,1,i%2?-1:1);x.restore()}
  for(const z of V9.cz){const sx=z.x-cam;if(z.w0>0){DZ.zone(sx,z.w);continue}const a=Math.min(1,z.t/.5);x.save();x.globalAlpha=a;for(let i=0;i<z.w;i+=60){x.drawImage(VOL9.I,M.crack[4]||0,M.crack[0],Math.min(64,z.w-i),8,Math.round(sx+i),GY-4,Math.min(64,z.w-i),8)}
    x.globalCompositeOperation='lighter';x.fillStyle=LG(x,0,GY-40,0,GY,['rgba(255,90,20,0)','rgba(255,90,20,'+(.3+.12*Math.sin(t*9))+')']);x.fillRect(sx,GY-40,z.w,40);if(Math.random()<.3)VOL9.fr(x,'flame',Math.floor(t*12)%3,sx+Math.random()*(z.w-16),GY-18,.8,1);x.restore()}
  for(const p of V9.pl){const sx=p.x-cam;if(p.t<p.w){BW(()=>DZ.mark(sx,GY-2,p.sm?16:22));continue}const u=p.t-p.w,q=Math.min(1,u/.12)*Math.min(1,(p.w+.7-p.t)/.2),m=M.pillar,s=p.sm?.75:1;
    x.save();x.globalAlpha=q;x.beginPath();x.rect(sx-50,0,100,GY+2);x.clip();VOL9.fr(x,'pillar',Math.floor(t*14)%2,sx-m[1]*s/2,GY+2-m[2]*s*Math.min(1,u/.12),s,1);x.restore()}
  for(const r of V9.rw){const sx=r.x-cam;for(let i=0;i<3;i++)VOL9.fr(x,'flame',Math.floor(t*14+i)%3,sx-8-r.d*i*10,GY-22-(i==0?6:0),i==0?1.5:1.1,r.d)}
  for(const q of V9F){q.t+=1/60;const m=M.dfire,i=Math.floor(q.t*14);if(i>=m[3])continue;VOL9.fr(x,'dfire',i,q.x-cam-m[1]*q.s/2,q.y-m[2]*q.s*.7,q.s,1)}for(let i=V9F.length-1;i>=0;i--)if(V9F[i].t>.4)V9F.splice(i,1);
  if(V9.ch&&V9.ch.e){const c=V9.ch,X=c.x0+(c.tx-c.x0)*c.k,Y=c.y0+(c.ty-c.y0)*c.k,L=Math.hypot(X-c.x0,Y-c.y0),n=Math.max(1,Math.floor(L/6));x.save();x.globalCompositeOperation='lighter';
    const F7=(n,o)=>Math.floor(t*15+(o||0))%((VFX.M[n]||{n:1}).n);const an=Math.atan2(Y-c.y0,X-c.x0),m_=Math.max(1,Math.floor(L/14));for(let i=0;i<=m_;i++){const u=i/m_;VFX.frame(x,'x-fire',F7('x-fire',i*3),c.x0+(X-c.x0)*u-cam,c.y0+(Y-c.y0)*u+Math.sin(u*9+t*20)*2,.9,1,an-Math.PI/2,.9)}VFX.frame(x,'x-sun',F7('x-sun'),X-cam,Y,.6,1,t*4,1);x.restore()}  // 第三十轮:火焰链(FX29 火苗 + 火团)
  if(V9.gp){const g=V9.gp,sx=g.x-cam,m=M.hand;if(g.st=='w'){x.fillStyle='rgba(10,4,6,'+(.5+.3*Math.sin(t*16))+')';x.beginPath();x.ellipse(sx,GY-1,30,7,0,0,7);x.fill();x.strokeStyle='rgba(255,90,20,.8)';x.lineWidth=1;x.stroke()}
    else{const q=g.st=='hold'?Math.min(1,g.t/.12):Math.max(0,1-g.t/.5),fi=g.st=='hold'?(g.t<.15?1:2):0,s=2.2;x.save();x.beginPath();x.rect(sx-60,0,120,GY+4);x.clip();VOL9.fr(x,'hand',fi,sx-m[1]*s/2,GY+4-m[2]*s*q,s,1);x.restore()}}
  for(const b of V9.bm){const sx=b.x-cam,k=1-b.t/.4;x.save();x.globalCompositeOperation='lighter';VFX.frame(x,'x-boom',Math.min(15,Math.floor(k*16)),sx,b.y,.5+k*.4,1,0,1);x.restore()}}  // 第三十轮:爆炸帧(Soluna,CC0)
// =====================================================================
