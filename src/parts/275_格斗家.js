// ===== 第六十九轮(用户):新职业「格斗家」—— 武器 = 拳套(EQ.fist,P.mode 'fist'),擅长用拳击打倒对手 =====
// 普攻四段:左刺拳 → 右直拳 → 左勾拳 → 右上勾拳(第四下更重、击退);蓄力 = 重拳(破防);W+攻击 = 上勾拳(击飞);S+攻击 = 肝脏拳(小怪僵直 + 破防)
// 斗志:拳套每次命中 +1 层(每 0.15 秒最多 1 层,最多 FSPMX 层),每层拳套伤害 +2%;2.5 秒没打中敌人就开始掉层(HUD 技能栏右边的菱形)
// 破防:重拳 / 肝脏拳 / 破城重拳命中的敌人 FBKT 秒内受到的拳套伤害 +15%(e.fbk = 到期的 GT)
// 技能(P.sk.id 都以 f 开头,fistStep 推进,fistRig 出姿势):H 刺拳突进 · U 百裂拳 · I 升龙拳 · O 摇闪反击;
// 格斗家进阶:空格 迪普西摇摆 · W+空格 破城重拳 · S+空格 震地重锤 · WW+空格 终结 K.O.
// 手上的拳套 = 装备图集 eq_atlas 第 7 行(7Soul1 的 W_Fist,缩小后画在纸娃娃两只手上);技能图标 = eq_atlas 第 8 行(7Soul1 的技能图标)
const FSPMX=10,FSPK=.02,FBKT=5,FBKK=1.15;
const WMODES=['sword','staff','fist'],nextMode=m=>WMODES[(WMODES.indexOf(m)+1)%WMODES.length];  // Q 键 / 背包 L 键:剑 → 法杖 → 拳套 轮换
// 普攻四段 [伤害倍率 m, 预备 W, 出手 S, 攻击间隔 cd, 判定 w / h / y];比剑出手快、距离短,每秒伤害略高一点
const FSW=[{m:.75,W:.05,S:.06,cd:.2,w:36,h:22,y:2},{m:.75,W:.05,S:.06,cd:.2,w:40,h:22,y:2},{m:.95,W:.07,S:.07,cd:.25,w:38,h:26,y:0},{m:1.5,W:.1,S:.08,cd:.42,w:36,h:44,y:-14}],FLUNGE=[10,10,14,16];
SKD.fist=[['刺拳突进','向前高速滑步,连打 3 记刺拳,最后一记直拳把敌人打退。突进途中无敌,是格斗家的起手和追击',5,5],
  ['百裂拳','原地站稳(霸体)对身前疯狂连打 16 拳,拳影把小怪钉在原地,最后一记重拳把敌人轰飞',10,9],
  ['升龙拳','压低身体后跃起一记燃烧的上勾拳,把身前的敌人打上天空(首领不会被击飞);上升途中无敌,最高点再炸开一圈火焰',8,8],
  ['摇闪反击','举起双拳左右摇闪 1.2 秒(无敌):这期间只要有攻击打过来,立刻看穿并打出一记反击重拳,眩晕敌人 1.5 秒;没人出手的话,结束时打出一记直拳',15,18],
  ['迪普西摇摆','上身画着横 8 字左右摇摆、一路向前推进,左右勾拳连打 10 下,最后一记上勾拳把敌人打飞。全程无敌',20,16],
  ['破城重拳','蓄力 0.5 秒(霸体)后打出一记超重直拳,拳风沿地面向前推进 300 像素,路上的敌人全部受到重创并「破防」6 秒(受到的拳套伤害 +15%)',22,20],
  ['震地重锤','跳起后双拳砸向地面,以自己为中心震开大范围冲击波并把小怪震上天,随后左右地面再连续爆开 3 次余震。全程无敌',25,22],
  ['终结 K.O.','锁定附近最近的敌人瞬间冲到它面前,画面一暗,连续 12 记组合拳,最后一记超级上勾拳把它打飞(首领僵直 2 秒)。全程无敌',28,30]];
// 技能倍率 [基础伤害, 攻击倍率, 每级基础 +, 每级倍率 +](= 一个「单位」,各招按单位乘段数):
// H 3 刺拳 + 直拳 2 单位 ≈ 2.0 · U 16 拳 + 终结 6 单位 ≈ 6.6 · I 上勾拳 2.6 + 火焰 0.4 单位 · O 反击 4.5(没反击 0.6 单位)· 空 10 勾拳 + 上勾拳 5.5 单位 ≈ 7
// W空 一拳 8 · S空 砸地 3.75 单位 + 3 次余震 ≈ 8.1 · WW空 12 拳 + 终结 20 单位 ≈ 12.8
SKM.fist=[[4,.4,2,.05],[2,.3,1,.04],[10,2.6,5,.3],[30,4.5,12,.6],[3,.45,1.5,.05],[40,8,15,1],[10,1.2,5,.15],[3,.4,1.5,.05]];
SKMP.fist=[.012,.02,.018,.03,.03,.033,.032,.036];
// ---------- 普攻 / 特殊攻击 ----------
function fistStrike(heavy){sfx(heavy?'heavy':'swing');{const dk=keys.r-keys.l;if(dk)P.f=dk}
  if(heavy){P.cmb=-1;P.hbW=.1;P.at=.22;P.cd=.55;P.hb={w:44,h:28,y:0,m:3.2,brk:1}}
  else{P.cmb=P.ct>0?(P.cmb+1)%4:0;const c=FSW[P.cmb];P.hbW=c.W;P.at=c.W+c.S+.02;P.cd=c.cd;P.ct=.7;P.hb=c}
  P.swT=0;P.swC=P.cmb;P.swW=P.hbW;P.swD=P.hbW+(heavy?.1:FSW[P.cmb].S);P.swR=P.cd-P.swD;P.lunged=0;P.swFrom=null;P.hit=new Set();
  if(heavy)burst(P.x+12+P.f*24,P.y+14,10,['#ffa94d','#fff3bf'],260,{sh:1,s:2,l:.25,dr:4})}
function fistSpecial(up){if(up){if(P.ujc>0){tx('上勾拳冷却 '+P.ujc.toFixed(1),P.x-16,P.y-14,'#adb5bd');return}P.ujc=UJC;P.sk={id:'fup',t:0,hit:new Set()};P.cd=.4;sfx('swing')}
  else{if(P.sjc>0){tx('肝脏拳冷却 '+P.sjc.toFixed(1),P.x-16,P.y-14,'#adb5bd');return}P.sjc=SJC;P.sk={id:'fbody',t:0,hit:new Set()};P.cd=.5;sfx('swing')}}
// ---------- 斗志 / 破防(dealt 里调用;四星 c4Out 里也调用) ----------
function fistDealt(e,dm,nc){if(P.mode!='fist'||st!='play')return dm;if(e.fbk>GT)dm*=FBKK;dm*=1+FSPK*(P.fsp|0);
  if(!nc){P.fspH=GT;if(GT-(P.fspT||0)>.15){P.fspT=GT;P.fsp=Math.min(FSPMX,(P.fsp|0)+1)}}return Math.round(dm)}
function fistTick(dt){if(P.fsp>0&&GT-(P.fspH||0)>2.5){P.fspD=(P.fspD||0)-dt;if(P.fspD<=0){P.fspD=.3;P.fsp--}}}
const fBrk=e=>{if(!e||e.hp<=0)return;if(!(e.fbk>GT))tx('破防',e.x+e.w/2,e.y-22,'#ffa94d');e.fbk=GT+FBKT};
// ---------- 技能 ----------
const fCX=()=>P.x+12,fMove=(d)=>{P.x=Math.max(bossOn?2570:pLo(),Math.min(xMax(),P.x+d))};
const fBox=(w,y,h,back)=>({x:P.f>0?P.x+P.w-(back||0):P.x-w+(back||0),y:P.y+y,w:w+(back||0),h});
const fU=(i,S,n)=>Math.round(skD('fist',i,S)*(n||1)*rnd(.9,1.1));
function fHit(e,dm,fx){hitFx='punch';dealt(e,dm);hitFx=null;if(fx)VFX.spawn(fx,e.x+e.w/2+rnd(-6,6),e.y+e.h/2+rnd(-8,8),{s:rnd(.8,1.1),f:P.f})}
function fkoTg(){const cx=fCX();return allTg().filter(e=>Math.abs(e.x+e.w/2-cx)<340&&Math.abs(e.y+e.h/2-(P.y+16))<160).sort((a,b)=>Math.abs(a.x+a.w/2-cx)-Math.abs(b.x+b.w/2-cx))[0]||null}
function fistStart(i,S){const f=P.f,cx=fCX(),cy=P.y+16;
  if(i==0){P.sk={id:'fjab',t:0,inv:1,n:0,hit:new Set()};flash('255,220,170',.1);burst(cx-f*8,P.y+P.h-2,8,['#e9ecef','#ced4da'],140,{s:3,l:.3,g:200})}
  else if(i==1){P.sk={id:'frush',t:0,n:0,tk:.1};P.ar=Math.max(P.ar||0,1.25);flash('255,230,190',.12);ring(cx,cy,4,36,'#ffd43b',.3,4)}
  else if(i==2){P.sk={id:'fupc',t:0,inv:1,hit:new Set()};VFX.spawn('focus-charge',cx,cy,{s:.8,life:.2,at:P})}
  else if(i==3){P.sk={id:'fcnt',t:0,inv:1};ring(cx,cy,4,30,'#a5d8ff',.3,3);tx('摇闪!',P.x-6,P.y-24,'#a5d8ff')}
  else if(i==4){P.sk={id:'fdem',t:0,inv:1,n:0,tk:.1};P.ar=Math.max(P.ar||0,1.8);flash('255,200,150',.15)}
  else if(i==5){P.sk={id:'fsieg',t:0};P.ar=Math.max(P.ar||0,.95);VFX.spawn('focus-charge',cx+f*10,cy,{s:1.2,life:.5,at:P});tx('蓄力……',P.x-6,P.y-30,'#ffa94d')}
  else if(i==6){P.sk={id:'fquake',t:0,inv:1,ph:0};P.vy=-430;P.gr=false;burst(cx,P.y+P.h,10,['#ced4da','#adb5bd'],180,{s:3,l:.35,g:300})}
  else if(i==7){const e=fkoTg();P.sk={id:'fko',t:0,inv:1,n:0,tk:.15,tg:e};FX.dk=Math.max(FX.dk,.55);flash('20,10,30',.35);hitstop(.06);
    if(e){const ex=e.x+e.w/2;P.f=sgn(ex-cx)||f;ghost('rgba(255,169,77,.8)',.3);fMove(ex-P.f*(e.w/2+16)-cx);smoke(fCX(),cy)}}}
// 摇闪中挨打(150 hurt 开头调用):看穿,打出反击重拳
function fcntGo(){const k=P.sk;if(!k||k.id!='fcnt'||k.c)return;k.c=1;k.ct=k.t;const S=stats(),cx=fCX(),e=nearE(allTg(),cx,P.y+16,170);
  if(e){P.f=sgn(e.x+e.w/2-cx)||P.f;const d=e.x+e.w/2-P.f*(e.w/2+14)-cx;if(Math.abs(d)>6)fMove(d)}
  flash('200,230,255',.3);hitstop(.1);shake=Math.max(shake,.35);tx('看穿!',P.x-6,P.y-34,'#ffe066');psx('blink','heavy');ghost('rgba(165,216,255,.8)',.3);
  const hb=fBox(64,-14,48,10);for(const q of allTg())if(ov(hb,q)){fHit(q,fU(3,S),'resonant-break');bigStun(q,1.5);knock(q,P.f)}
  ring(fCX()+P.f*30,P.y+14,6,54,'#ffe066',.35,5)}
function fistStep(k,dt,S,all){if(!k.id||k.id[0]!='f'||!SKD.fist)return false;const f=P.f,t=k.t;
  if(k.id=='fup'){if(t<.06&&P.gr)P.vy=-160;if(t>=.06&&t<.2){const hb=fBox(38,-26,52,6);for(const e of all)if(!k.hit.has(e)&&ov(hb,e)){k.hit.add(e);fHit(e,Math.round(S.atk*1.2*rnd(.9,1.1)));launch(e)}}if(t>.36)P.sk=null;return true}
  if(k.id=='fbody'){if(t>=.1&&!k.d){k.d=1;sfx('heavy');const hb=fBox(40,4,26,6);for(const e of all)if(ov(hb,e)){fHit(e,Math.round(S.atk*1.8*rnd(.9,1.1)),'resonant-break');fBrk(e);if(!isBig(e))bigStun(e,.6)}}if(t>.42)P.sk=null;return true}
  if(k.id=='fjab'){// 刺拳突进:0.36 秒滑步(约 130 像素),途中 3 记刺拳;0.4 秒直拳收尾
    if(t<.36){fMove(f*(420-t*500)*dt);k.gt=(k.gt||0)-dt;if(k.gt<=0){k.gt=.05;ghost('rgba(255,192,120,.7)',.2)}}
    if(k.n<3&&t>=.06+k.n*.1){k.n++;psx('dash');k.hit=new Set();const hb=fBox(44,0,26,10);for(const e of all)if(ov(hb,e)){fHit(e,fU(0,S));if(!isBig(e))e.kbv=f*90}}
    if(k.n==3&&t>=.4){k.n=4;k.inv=0;psx('heavy');const hb=fBox(52,-2,30,10);let h=0;for(const e of all)if(ov(hb,e)){h=1;fHit(e,fU(0,S,2),'resonant-break');knock(e,f)}if(h){hitstop(.05);shake=Math.max(shake,.15)}}
    if(t>.58)P.sk=null;return true}
  if(k.id=='frush'){// 百裂拳:0.1 ~ 0.98 秒每 0.055 秒一拳(16 拳),1.0 秒终结重拳
    if(k.n<16){k.tk-=dt;if(k.tk<=0){k.tk=.055;k.n++;const hb=fBox(60,-8,38,10);
        VFX.spawn('m-spark',fCX()+f*rnd(26,58),P.y+rnd(2,24),{s:rnd(.5,.8),f});if(k.n%3==0)psx('dash');
        for(const e of all)if(ov(hb,e)){fHit(e,fU(1,S),0);if(!isBig(e)){e.kbv=0;e.st=Math.max(e.st||0,.15)}}}}
    else if(!k.d&&t>=1){k.d=1;psx('heavy','boom');hitstop(.08);shake=Math.max(shake,.3);const hb=fBox(64,-12,46,10);VFX.spawn('x-boom',fCX()+f*44,P.y+14,{s:.9});ring(fCX()+f*40,P.y+14,6,50,'#ffd43b',.3,5);
      for(const e of all)if(ov(hb,e)){fHit(e,fU(1,S,6),'resonant-break');knock(e,f)}}
    if(t>1.22)P.sk=null;return true}
  if(k.id=='fupc'){// 升龙拳:0.12 秒蓄势 → 跳起(0.12 ~ 0.45 判定)→ 最高点火焰炸开 → 落地收招
    if(t>=.12&&!k.j){k.j=1;P.vy=-560;P.gr=false;psx('fire');VFX.spawn('r-burst',fCX(),P.y+P.h,{s:.8});}
    if(k.j&&t<.45){fMove(f*130*dt);if(Math.random()<dt*40)pt({x:fCX()+f*rnd(4,14),y:P.y+rnd(-8,10),vx:rnd(-30,30),vy:rnd(40,120),c:pick(['#ff922b','#ffd43b','#ff6b35']),sh:2,s:rnd(3,6),l:.35});
      const hb=fBox(40,-30,62,6);for(const e of all)if(!k.hit.has(e)&&ov(hb,e)){k.hit.add(e);fHit(e,fU(2,S),'warm-explosion');launch(e,.4)}}
    if(t>=.45&&!k.b){k.b=1;k.inv=0;const cx=fCX()+f*14,cy=P.y-6;VFX.spawn('warm-explosion',cx,cy,{s:1.1});ring(cx,cy,6,60,'#ff922b',.35,5);flash('255,170,90',.12);
      for(const e of all)if(Math.hypot(e.x+e.w/2-cx,e.y+e.h/2-cy)<e.w/2+60)fHit(e,fU(2,S,.4),0)}
    if(t>.5&&(P.gr||t>1.3))P.sk=null;return true}
  if(k.id=='fcnt'){// 摇闪反击:1.2 秒内挨打 → fcntGo 反击;没挨打 → 1.2 秒时自动直拳
    if(!k.c&&Math.random()<dt*14)ghost('rgba(165,216,255,.45)',.15);
    if(k.c){k.inv=1;if(t-k.ct>.45)P.sk=null;return true}
    if(t>=1.2&&!k.d){k.d=1;k.inv=0;psx('heavy');const hb=fBox(56,-4,32,10);for(const e of all)if(ov(hb,e)){fHit(e,fU(3,S,.6),'resonant-break');knock(e,f)}}
    if(t>1.42)P.sk=null;return true}
  if(k.id=='fdem'){// 迪普西摇摆:0.1 ~ 1.5 秒每 0.14 秒一记勾拳(10 下),边摇边往前推进;1.55 秒上勾拳终结
    if(t<1.5){fMove(f*85*dt);k.gt=(k.gt||0)-dt;if(k.gt<=0){k.gt=.06;ghost('rgba(255,146,43,.55)',.18)}}
    if(k.n<10&&t>=.1+k.n*.14){k.n++;psx('dash');const side=k.n%2?1:-1,hb=fBox(52,-10,38,10);VFX.spawn('dw-wind',fCX()+f*30,P.y+8+side*5,{s:.55,f,life:.25});
      for(const e of all)if(ov(hb,e)){fHit(e,fU(4,S));if(!isBig(e)){e.kbv=f*60;e.st=Math.max(e.st||0,.2)}}}
    if(k.n>=10&&!k.d&&t>=1.55){k.d=1;psx('heavy','boom');hitstop(.08);shake=Math.max(shake,.3);flash('255,190,120',.18);const hb=fBox(48,-36,66,10);VFX.spawn('earth-rupture',fCX()+f*30,GY,{s:.8});
      for(const e of all)if(ov(hb,e)){fHit(e,fU(4,S,5.5),'warm-explosion');launch(e,.5)}}
    if(t>1.85)P.sk=null;return true}
  if(k.id=='fsieg'){// 破城重拳:0.5 秒蓄力 → 直拳 + 拳风沿地面推进 300 像素
    if(t<.5&&Math.random()<dt*30){const a=rnd(0,6.283),r=rnd(26,40),hx=fCX()+f*10,hy=P.y+12;pt({x:hx+Math.cos(a)*r,y:hy+Math.sin(a)*r,vx:-Math.cos(a)*70,vy:-Math.sin(a)*70,c:pick(['#ffa94d','#ffe066','#fff']),sh:2,s:rnd(2,4),l:.35})}
    if(t>=.5&&!k.d){k.d=1;psx('boom','heavy');hitstop(.12);shake=Math.max(shake,.5);flash('255,210,150',.25);const x0=fCX(),y0=P.y+14;
      VFX.spawn('x-boom',x0+f*28,y0,{s:1.2});for(let d=40;d<=300;d+=52)msAfter((d-40)/1300,()=>{VFX.spawn('w-ring',x0+f*d,y0,{s:.9,f});burst(x0+f*d,GY-4,6,['#ced4da','#ffe066'],160,{s:3,l:.35,g:400})});
      const lo=Math.min(x0,x0+f*310),hi=Math.max(x0,x0+f*310);for(const e of all)if(e.x+e.w>lo&&e.x<hi&&e.y+e.h>P.y-30&&e.y<P.y+P.h+20){fHit(e,fU(5,S),'resonant-break');fBrk(e);knock(e,f)}}
    if(t>.85)P.sk=null;return true}
  if(k.id=='fquake'){// 震地重锤:跳起 0.3 秒 → 高速砸下 → 落地冲击波 → 3 次余震(每 0.28 秒)
    if(k.ph==0&&t>=.3){k.ph=1;P.vy=900}
    if(k.ph==1&&(P.gr||t>1.2)){k.ph=2;k.lt=t;psx('boom','slam');hitstop(.1);shake=Math.max(shake,.55);flash('230,200,160',.2);const cx=fCX();
      VFX.spawn('earth-rupture',cx,GY,{s:1.6});ring(cx,GY-4,8,180,'#e8c27a',.45,7,.3);crack(cx,6,150);
      for(let n=0;n<16;n++)pt({x:cx+rnd(-40,40),y:GY-4,vx:rnd(-220,220),vy:rnd(-460,-160),g:1300,c:pick(['#8d5524','#adb5bd','#6b3f1a']),ad:0,s:rnd(2,5),l:.8,bn:1});
      for(const e of all)if(Math.abs(e.x+e.w/2-cx)<e.w/2+180&&e.y+e.h>GY-150){fHit(e,fU(6,S,3.75),0);launch(e,.3)}}
    if(k.ph>=2&&k.ph<5&&t-k.lt>=.28*(k.ph-1)){const n=k.ph-1,cx=fCX(),d=(n==2?-1:1)*f*[100,170,240][n-1];k.ph++;const px=cx+d;
      VFX.spawn('earth-rupture',px,GY,{s:1.1});crack(px,3,70);shake=Math.max(shake,.25);psx('slam');for(const e of all)if(Math.abs(e.x+e.w/2-px)<e.w/2+70&&e.y+e.h>GY-120){fHit(e,fU(6,S),0);launch(e)}}
    if(k.ph>=5&&t-k.lt>1.0)P.sk=null;return true}
  if(k.id=='fko'){// 终结 K.O.:0.15 ~ 1.35 秒 12 记组合拳(每 0.1 秒)→ 1.45 秒超级上勾拳 → 「K.O.!」
    const e=k.tg&&k.tg.hp>0&&!k.tg.ug?k.tg:null;FX.dk=Math.max(FX.dk,.45);
    if(k.n<12&&t>=.15+k.n*.1){k.n++;psx('dash');const tg=e?[e]:[];const hb=fBox(56,-10,40,10);for(const q of all)if(q!==e&&ov(hb,q))tg.push(q);
      if(k.n%3==0)ghost('rgba(255,169,77,.6)',.2);for(const q of tg){fHit(q,fU(7,S),k.n%2?'m-spark':'resonant-break');if(!isBig(q)){q.kbv=0;q.st=Math.max(q.st||0,.3)}}}
    if(k.n>=12&&!k.d&&t>=1.45){k.d=1;FX.dk=0;flash('255,255,255',.45);hitstop(.2);shake=Math.max(shake,.7);psx('boom','thunder');const cx=fCX()+f*20,cy=P.y+8;
      VFX.spawn('x-star',cx,cy,{s:1.6});VFX.spawn('solar-shrapnel',cx,cy,{s:1.4});ring(cx,cy,8,90,'#ffd43b',.45,7);pillar(cx,22,'rgba(255,212,59,.8)',.4);
      const tg=e?[e]:[];const hb=fBox(56,-30,62,10);for(const q of all)if(q!==e&&ov(hb,q))tg.push(q);
      for(const q of tg){fHit(q,fU(7,S,20),'warm-explosion');if(isBig(q))bigStun(q,2);else launch(q,.6)}FKO=performance.now()/1000+1.4}
    if(t>1.95){FX.dk=0;P.sk=null}return true}
  return false}
// 「K.O.!」大字(HUD 之前画)
let FKO=0;
function fkoDraw(){const r=FKO-performance.now()/1000;if(r<=0)return;const a=Math.min(1,r/.3),s=1+Math.max(0,r-1.1)*2;x.save();x.globalAlpha=a;CT('K.O.!',VW/2,VH*.36,Math.round(38*s),'#ffd43b','center',4,'#5c1a00');x.restore()}
// 斗志 HUD:技能栏右边 5 颗菱形,每颗 = 2 层
function fspHud(px){const q=P.fsp|0;for(let i=0;i<5;i++){const dx=292+i*11,dy=VH-14,v=Math.max(0,Math.min(1,q/2-i));x.save();x.globalAlpha=.28+.72*v;
    if(px)PUI.img(x,'dia1',dx-5,dy-5,.34);else{x.translate(dx,dy);x.rotate(Math.PI/4);RR(x,-3.5,-3.5,7,7,1.5,'#ffa94d',1)}x.restore()}
  CT('斗志 '+q,314,VH-24,7,q>=FSPMX?'#fff3bf':'#ffa94d','center',2,'#120d18')}
// ---------- 姿势(760 heroRig 调用):返回 {p, glow, mouth} ----------
// 拳击架势:前手拳在下巴前,后手护脸(后臂 aB / eB 往前上折),膝盖微屈,原地轻轻弹跳
const FGUARD={gx:8.5,gy:-11.5,wa:-1.1,two:0,aB:.55,eB:2.15};
function fistRig(base,k,tm,mv){const G=rP(base,FGUARD,mv=='still'?{y:(base.y||0)-Math.abs(Math.sin(tm*5.5))*.9,hF:.32,kF:.5,hB:-.32,kB:.5,lean:.12}:{});let p=G,glow=null,mouth=null;
  const J={gx:15.5,gy:-12,lean:.24,x:1.5,head:.05},C={gx:3,gy:-15,aB:1.6,eB:.05,lean:.4,x:3,head:.08,hF:.55,kF:.5,hB:-.55,kB:.3},
    HKw={gx:2,gy:-10,lean:-.08,x:-.5},HK={gx:11,gy:-14,lean:.32,x:2,head:.06},UPw={aB:.25,eB:1.3,sq:.14,lean:.28,y:1,hF:.5,kF:.8,hB:-.4,kB:.6},UP={aB:2.75,eB:.35,lean:-.18,y:-2.5,hF:.25,kF:.2,hB:-.3,kB:.3},
    HVw={gx:-1,gy:-10,lean:-.18,x:-1.5,sq:.06,hF:.4,kF:.5,hB:-.3,kB:.4},HV={gx:15.5,gy:-11,lean:.48,x:4,hF:.8,kF:.6,hB:-.75,kB:.15,head:.1};
  const seq=(L,tt)=>rSeq(G,L,tt);
  if(k&&k.id){const t=k.t;mouth='o';
    if(k.id=='fjab'){glow='rgba(255,192,120,.8)';if(t<.36){const q=((t-.06)%.1+.1)%.1;p=q<.05?rP(G,J,{lean:.3}):rP(G,{lean:.26})}else p=seq([[0,G],[.04,C],[.18,C]],t-.36)}
    else if(k.id=='frush'){glow='rgba(255,224,102,.8)';if(t<1){const q=Math.floor(t/.055)%2;p=q?rP(G,J,{gy:-12+Math.sin(t*90)*2,lean:.3}):rP(G,C,{gy:-12,lean:.34})}else p=seq([[0,HVw],[.05,HV],[.2,HV]],t-1)}
    else if(k.id=='fup')p=seq([[0,UPw],[.08,UP],[.3,UP]],t);
    else if(k.id=='fbody')p=seq([[0,HKw],[.1,{gx:12,gy:-6,lean:.42,x:2.5,sq:.12,hF:.7,kF:.9,hB:-.5,kB:.5}],[.32,{gx:12,gy:-6,lean:.4,x:2.5,sq:.1}]],t);
    else if(k.id=='fupc'){glow='rgba(255,146,43,.9)';p=t<.12?rP(G,UPw):rP(G,{gx:6,gy:-24,wa:-1.5,lean:-.22,y:-2,head:-.1,hF:.9,kF:1.4,hB:.2,kB:1.2})}
    else if(k.id=='fcnt'){glow=k.c?'rgba(255,224,102,.9)':'rgba(165,216,255,.7)';
      if(k.c)p=seq([[0,HKw],[.06,{...HK,gx:13,lean:.45}],[.4,{...HK,gx:13,lean:.4}]],t-k.ct);
      else if(t>=1.2)p=seq([[0,HVw],[.06,HV],[.2,HV]],t-1.2);
      else{const w=Math.sin(t*14);p=rP(G,{x:w*2.2,lean:.2+w*.12,head:w*.08,y:-Math.abs(w)*.6,sq:.08,hF:.5,kF:.7,hB:-.45,kB:.7,gy:-14})}}
    else if(k.id=='fdem'){glow='rgba(255,146,43,.8)';if(t<1.55){const a=t/.28*Math.PI,w=Math.sin(a),hit=Math.abs(Math.cos(a))>.6;p=rP(G,{x:w*3,lean:.32+Math.cos(a*2)*.08,head:w*.1,y:-Math.abs(w)*.8,sq:.1,hF:.55,kF:.75,hB:-.5,kB:.65},hit?(w>0?{gx:11,gy:-13}:{aB:1.5,eB:.4}):{})}else p=seq([[0,UPw],[.06,UP],[.3,UP]],t-1.55)}
    else if(k.id=='fsieg'){glow='rgba(255,169,77,.9)';p=t<.5?rP(G,HVw,{y:Math.sin(tm*60)*.35}):seq([[0,HV],[.3,HV]],t-.5)}
    else if(k.id=='fquake'){glow='rgba(232,194,122,.85)';const D={gx:9,gy:2,aB:1.2,eB:.3,lean:.75,head:.2,x:2,sq:.3,hF:1.2,kF:1.7,hB:-.5,kB:1};p=k.ph==0?rP(G,{gx:2,gy:-24,aB:2.9,eB:.3,lean:-.2,head:-.12,hF:.8,kF:1.3,hB:.3,kB:1.1}):k.ph==1?rP(G,{gx:8,gy:-2,aB:1.6,eB:.2,lean:.4,hF:.6,kF:.9,hB:-.2,kB:.6}):rP(G,D)}
    else if(k.id=='fko'){glow='rgba(255,212,59,.9)';if(t<1.45){const q=Math.floor((t-.15)/.1)%3;p=t<.15?rP(G,HVw):q==0?rP(G,J,{lean:.34}):q==1?rP(G,C):rP(G,HK)}else p=seq([[0,UPw],[.06,UP],[.4,UP]],t-1.45)}
    return {p,glow,mouth}}
  if(P.ch>.15){const q=eo(Math.min(1,(P.ch-.15)/.25));p=rMix(G,rP(G,HVw),q);glow=P.ch>=.7?'rgba(255,169,77,.95)':'rgba(255,255,255,.5)';if(P.ch>=.7)p.y+=Math.sin(tm*70)*.45}
  else if(P.swT!=null&&P.swT<P.swD+P.swR+.12){const c=P.swC,W=P.swW||.05,D=P.swD,T=P.swT;mouth='o';
    const L=c==0?[[0,G],[W,{gx:5,gy:-12.5}],[D,J],[D+.04,J]]:c==1?[[0,G],[W,{lean:.05,x:-.5}],[D,C],[D+.04,C]]:c==2?[[0,G],[W,HKw],[D,HK],[D+.05,HK]]:c==3?[[0,G],[W,UPw],[D,UP],[D+.07,UP]]:[[0,G],[W,HVw],[D,HV],[D+.08,HV]];
    L.push([D+P.swR+.1,G]);p=seq(L,T);if(c==-1||c==3)glow='rgba(255,169,77,.7)'}
  else if(mv=='run')p=base;  // 跑步时双臂照常摆动
  return {p,glow,mouth}}
// ---------- 纸娃娃上的拳套:eq_atlas 第 7 行的图标缩小成 12 像素(按系列缓存),沿前臂方向旋转画在手上 ----------
const FGC={};
function fistGloveImg(){const it=EQ.fist,g=Math.min(6,wG(it)),k=g;if(FGC[k])return FGC[k];if(!EQPX.I)return null;const N=12,cv=document.createElement('canvas');cv.width=cv.height=N;const c=cv.getContext('2d');
  c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';c.drawImage(EQPX.I,g*EQPX.C+3,EQPX.R.fist*EQPX.C+3,EQPX.C-6,EQPX.C-6,0,0,N,N);
  const d=c.getImageData(0,0,N,N),a=d.data;for(let i=3;i<a.length;i+=4)a[i]=a[i]>110?255:0;c.putImageData(d,0,0);return FGC[k]=cv}
function fistGlove(g,hx,hy,ex,ey,front){const im=fistGloveImg();if(!im)return;const an=Math.atan2(hy-ey,hx-ex);g.save();g.translate(hx,hy);g.rotate(an+Math.PI*.75);if(!front)g.globalAlpha=.85;g.drawImage(im,-7,-7);g.restore()}
// ---------- 技能图标:eq_atlas 最后一行(图集载入后生成 ICON.fist0~7)----------
function fistIcons(){if(!EQPX.I)return;const C=EQPX.C,y=7*C;for(let i=0;i<8;i++){const cv=document.createElement('canvas');cv.width=cv.height=96;const c=cv.getContext('2d');c.imageSmoothingEnabled=false;
    const g=c.createLinearGradient(0,0,96,96);g.addColorStop(0,'#2a1408');g.addColorStop(1,i<4?'#a8431a':'#c2410c');c.fillStyle=g;c.beginPath();c.roundRect?c.roundRect(0,0,96,96,18):c.rect(0,0,96,96);c.fill();
    c.drawImage(EQPX.I,i*C,y,C,C,0,0,96,96);ICON['fist'+i]=cv.toDataURL();delete SKIMG['fist'+i]}if(typeof skOpen!='undefined'&&skOpen)renderSk()}
