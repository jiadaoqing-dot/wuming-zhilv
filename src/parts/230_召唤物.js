// ===== W+J / S+J 特殊普攻 =====
const isBig=e=>!!e.max||e.k=='ost'||e.k=='cradle'||e.k=='oni'||e.k=='lclone';  // Boss 和鸵鸟算大型怪:不能挑空、不被击退
// 苍蓝巨剑命中:极高僵直(小怪 3 秒、鸵鸟 2 秒、首领 1.2 秒),期间不会霸体反击
function bigStun(e,T){if(e.ug||e.hp<=0||e.k=='mir')return;const t=T||(e.max?1.2:e.k=='ost'?2:3);if(e.max&&e.pim>0&&!T)return;e.st=Math.max(e.st||0,t);if(e.max)e.pim=t+PZIM;e.sc=0;e.ar=0;e.wu=0;if(!Array.isArray(e.sw))e.sw=0;e.ca=0;if(!e.max){e.lg=0;e.s=e.s=='hid'?e.s:null}tx('僵直!',e.x+e.w/2,e.y-22,'#a5d8ff')}
// 召唤物(飞鸟 / 藤蔓)干扰索敌:离召唤物 230 像素内的小怪改为以召唤物为目标(首领不受影响)
let DECOY=0;
// 第十九轮:召唤时有 SMLURE 几率吸引场上随机一只小怪(首领无效),被吸引的怪(e.lure = 召唤物种类)改为追打这只召唤物,召唤物消失后恢复
const SMLURE=.1;
function decoyOf(e){const q=e.lure&&SM[e.lure];if(!q||q.hp<=0){e.lure=null;return null}return q}
function smLure(k){if(Math.random()>=SMLURE)return;const L=E.filter(e=>!e.max&&!e.ug&&e.hp>0&&!e.sum&&!e.lure);if(!L.length)return;const e=pick(L);e.lure=k;tx('被吸引!',e.x+e.w/2,e.y-14,'#b2f2bb')}
function launch(e,hang){if(isBig(e)||e.ug)return;if(!e.air){e.ay0=e.y;e.air=1;e.hang=0;tx('浮空!',e.x+e.w/2,e.y-16,'#a5d8ff')}e.hang=Math.max(e.hang||0,hang||0);e.avy=-760;e.s=null;e.lg=0;e.vy=0}  // hang:到最高点后滞空的秒数
function knock(e,f){if(isBig(e)||e.ug)return;e.kbv=f*460;e.s=null;e.lg=0}
// 剑士 W+J(上挑,击飞)和 S+J(重击)的内置冷却:要比敌人浮空 + 落地硬直的时间长,不能无限连
const UJC=1.2,SJC=1.0;
function special(up,S){const f=P.f;
  if(P.mode=='sword'){
    if(up){if(P.ujc>0){tx('上挑冷却 '+P.ujc.toFixed(1),P.x-16,P.y-14,'#adb5bd');return}P.ujc=UJC;P.sk={id:'up',t:0,inv:0,hit:new Set()};P.cd=.45;if(P.gr)P.vy=-200;slash(P.x+12+f*8,P.y+16,36,1.3,-1.6,f,'#74c0fc',.24,5);burst(P.x+12+f*20,P.y+30,8,['#d0ebff','#fff'],200,{sh:1,s:2,l:.25,dr:4})}
    else{if(P.sjc>0){tx('重击冷却 '+P.sjc.toFixed(1),P.x-16,P.y-14,'#adb5bd');return}P.sjc=SJC;P.sk={id:'smash',t:0,inv:0,hit:new Set()};P.cd=.7}}
  else summon(up?'bird':'vine',S)}
// ===== 召唤物:飞鸟 / 藤蔓(同种只能有一只,死亡或消散后才能再召唤;数值刻意偏低)=====
const SMD={bird:{n:'飞鸟',mp:10,hp:.3,dmg:.35,cd:1.2,life:25},vine:{n:'藤蔓',mp:8,hp:.45,dmg:.3,cd:.9,life:15}};
function summon(k,S){const q=SMD[k];if(SM[k]){tx(q.n+'还在战斗',P.x-16,P.y-10,'#adb5bd');return}
  if(!GM.mp&&P.mp<q.mp){tx('魔力不足',P.x-10,P.y-8,'#74c0fc');return}if(!GM.mp)P.mp-=q.mp;P.cd=.4;P.at=.15;P.cs={id:'sum',t:0};
  const hp=Math.round(S.hp*q.hp);
  if(k=='bird'){SM.bird={k,x:P.x+3,y:P.y-50,w:18,h:12,hp,max:hp,atk:S.atk,t:q.life,cd:.5,st:'idle',f:P.f,inv:0,an:0};ring(P.x+12,P.y-44,4,34,'#ff922b',.35,3);burst(P.x+12,P.y-44,14,['#ffd43b','#ff6b00','#fff'],160,{sh:2,s:5,l:.4})}
  else{const vx=Math.max(bossOn?2570:10,Math.min(xMax()+10,P.x+12+P.f*55));SM.vine={k,x:vx-10,y:GY-52,w:20,h:52,hp,max:hp,atk:S.atk,t:q.life,cd:.6,wh:0,gw:0,f:P.f,inv:0};
    ring(vx,GY-2,4,46,'#cc5de8',.4,4,.3);for(let i=0;i<14;i++)pt({x:vx+rnd(-20,20),y:GY-2,vx:rnd(-40,40),vy:rnd(-160,-60),g:400,c:pick(['#8d5524','#cc5de8','#2f9e44']),ad:0,s:rnd(2,4),l:.6})}
  smLure(k)}
let NRMH=0,PETX=0;  // 第四十二轮:NRMH = 普攻命中(邪灵 4 件只加技能伤害)· PETX = 宠物的伤害(邪灵 6 件)
const pDeal=(e,d,fx,cra)=>{PETX=1;xDeal(e,d*ttlPet(),fx,cra);PETX=0};  // 第六十二轮:称号「一千零一夜」宠物伤害 +20%
const sDeal=(e,d)=>{noCombo=1;hitFx=null;dealt(e,d);noCombo=0};
const xDeal=(e,d,fx,cra)=>{noCombo=1;hitFx=fx||null;dealt(e,d,{ns:1,cra});hitFx=null;noCombo=0};  // 时装 / 宠物伤害:不加连击、不打僵
function nearE(all,cx,cy,r,f){let b=null,bd=r;for(const e of all){if(e.ug||e.hp<=0)continue;const ex=e.x+e.w/2,ey=e.y+e.h/2,d=Math.hypot(ex-cx,ey-cy);if(d<bd&&(!f||f(e))){bd=d;b=e}}return b}
function smStep(dt,all){for(const k of ['bird','vine']){const s=SM[k];if(!s)continue;s.t-=dt;s.inv-=dt;s.cd-=dt;
    for(const e of all)if(!e.ug&&!e.air&&s.inv<=0&&ov(s,e)){const d=Math.max(1,Math.round((CDMG[e.k]||8)*(e.dm||1)*EATK));s.hp-=d;s.inv=.6;tx('-'+d,s.x+s.w/2,s.y-6,'#ffa8a8')}
    if(s.hp<=0||s.t<=0){burst(s.x+s.w/2,s.y+s.h/2,16,k=='bird'?['#ffd43b','#ff6b00','#fff']:['#cc5de8','#8ce99a'],180,{s:3,l:.45,g:200});tx(SMD[k].n+(s.hp<=0?'阵亡':'消散'),s.x,s.y-12,'#adb5bd');if(k=='vine')SMX.push({x:s.x+10,f:s.f,t:0});SM[k]=null;continue}
    const cx=s.x+s.w/2,cy=s.y+s.h/2;
    if(k=='bird'){s.an+=dt;const hx=P.x+12-P.f*22,hy=P.y-46+Math.sin(s.an*3)*5;
      const mv=(tx_,ty,sp)=>{const dx=tx_-cx,dy=ty-cy,d=Math.hypot(dx,dy)||1,m=Math.min(d,sp*dt);s.x+=dx/d*m;s.y+=dy/d*m;if(Math.abs(dx)>2)s.f=sgn(dx);return d};
      if(s.st=='dive'){const t=s.tg;if(!t||t.hp<=0||t.ug||!all.includes(t))s.st='back';else if(mv(t.x+t.w/2,t.y+t.h/2,470)<16){sDeal(t,Math.round(s.atk*SMD.bird.dmg*rnd(.9,1.1)));sfx('peck');burst(cx,cy,6,['#d0ebff','#fff'],140,{sh:1,s:2,l:.2});s.st='back';s.cd=SMD.bird.cd}}
      else{const d=mv(hx,hy,s.st=='back'?380:300);if(s.st=='back'&&d<14)s.st='idle';if(s.st=='idle'&&s.cd<=0){const t=nearE(all,cx,cy,300);if(t){s.st='dive';s.tg=t}}}}
    else{s.gw=Math.min(1,s.gw+dt*3);s.wh-=dt;if(s.cd<=0){const t=nearE(all,cx,GY-30,110,e=>e.y+e.h>GY-100);
        if(t){s.cd=SMD.vine.cd;s.wh=.3;s.f=sgn(t.x+t.w/2-cx);sDeal(t,Math.round(s.atk*SMD.vine.dmg*rnd(.9,1.1)));t.sl=Math.max(t.sl||0,1);sfx('swing');slash(cx,GY-40,40,-1.4,.6,s.f,'#51cf66',.2,4)}}}}}
// 2026-10-12 第六轮:法师范围加大(判定宽 ×1.8),落点叠 SKFX 落雷光柱 + 蓝色光球
function bolt(cx,dmg,w,top,big){psx('zap');w*=1.8;VFX.spawn('electric-impact',cx,GY-26,{s:big?2:1.5});SFX5('m-bolt',cx,GY+4,{s:big?1.7:1.35,sy:1.2,life:.5});SFX5('b-orb',cx,GY-22,{s:big?1.8:1.3,life:.32,gr:1.2});weAbs(cx,null,'th');hitFx='thunder';for(const e of E.concat(bossOn&&B.hp>0?[B]:[]))if(e.x+e.w>cx-w&&e.x<cx+w){mkT(e);dealt(e,Math.round(dmg*(.9+Math.random()*.2)))}hitFx=null;
  top=top||0;Z.push({x:cx,t:.3,m:.3,top,big,...zpath(cx,top)});shake=Math.max(shake,big?.22:.1);
  ring(cx,GY-2,6,big?150:100,'#a5d8ff',.4,5,.25);burst(cx,GY-6,big?22:12,['#d0ebff','#fff','#74c0fc'],big?360:280,{sh:1,s:2,g:700,l:.45,dr:1});
  burst(cx,GY-10,6,'#4dabf7',60,{sh:2,s:16,l:.3,gr:1});DEC.push({x:cx,w:big?30:20,l:1.6,m:1.6,c:'#1c1f2b'});if(big){pillar(cx,26,'rgba(165,216,255,.9)',.35);flash('210,230,255',.35);FX.dk=Math.max(FX.dk,.45)}else flash('210,230,255',.08)}
