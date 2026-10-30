// ===== 第六十九轮(用户):新职业「格斗家」—— 武器 = 拳套(EQ.fist,P.mode 'fist'),擅长用拳击打倒对手 =====
// 普攻四段:左刺拳 → 右直拳 → 左勾拳 → 右上勾拳(第四下更重、击退);蓄力 = 重拳(破防);W+攻击 = 上勾拳(击飞);S+攻击 = 肝脏拳(小怪僵直 + 破防)
// 斗志:拳套每次命中 +1 层(每 0.15 秒最多 1 层,最多 FSPMX 层),每层拳套伤害 +2%;2.5 秒没打中敌人就开始掉层(HUD 技能栏右边的菱形)
// 破防:重拳 / 肝脏拳 / 破城重拳命中的敌人 FBKT 秒内受到的拳套伤害 +15%(e.fbk = 到期的 GT)
// 技能(P.sk.id 都以 f 开头,fistStep 推进,fistRig 出姿势):H 闪避步 · U 炎柱崩拳 · I 鬼手 · O 摇闪反击;
// 格斗家进阶:空格 雷火瞬身 · W+空格 破城重拳 · S+空格 震地重锤 · WW+空格 八门(276)
// 第七十二轮(用户):H 改成冷却很短的闪避;U 改成砸地升起巨大火柱击飞;I 改成配合 U 的「鬼手」(魔力凝成的长黑手臂抓住空中的敌人拉回身边 + 僵直);
//   空格 改成瞬移到敌人身后、闪避率提高、多次雷火打击;八门从 R 键改到 WW+空格(替代终结 K.O.,冷却同原来的 WW+空格);手上的拳套画大
// 手上的拳套 = 装备图集 eq_atlas 第 7 行(7Soul1 的 W_Fist,缩小后画在纸娃娃两只手上);技能图标 = eq_atlas 第 8 行(7Soul1 的技能图标)
const FSPMX=10,FSPK=.02,FBKT=5,FBKK=1.15;
const WMODES=['sword','staff','fist'],nextMode=m=>WMODES[(WMODES.indexOf(m)+1)%WMODES.length];  // Q 键 / 背包 L 键:剑 → 法杖 → 拳套 轮换
// 普攻四段 [伤害倍率 m, 预备 W, 出手 S, 攻击间隔 cd, 判定 w / h / y];比剑出手快、距离短,每秒伤害略高一点
const FSW=[{m:.75,W:.05,S:.06,cd:.2,w:36,h:22,y:2},{m:.75,W:.05,S:.06,cd:.2,w:40,h:22,y:2},{m:.95,W:.07,S:.07,cd:.25,w:38,h:26,y:0},{m:1.5,W:.1,S:.08,cd:.42,w:36,h:44,y:-14}],FLUNGE=[12,12,16,20];
SKD.fist=[['闪避步','向按住的方向(不按方向键就向后)快速滑开约 110 像素,全程无敌。冷却很短,专门用来躲招',2,1.5],
  ['炎柱崩拳','一拳砸向地面(霸体),身前的地面裂开、升起一道巨大的火柱,把敌人高高击飞;火柱烧约 0.7 秒,困在里面的敌人不断受到灼烧(首领不会被击飞)。之后接 I 鬼手',10,9],
  ['鬼手','向空中伸手,魔力凝成一条很长的黑色手臂:优先抓住被击飞在空中的敌人(没有就抓身前最近的),把它拉回到自己身边并僵直 1.5 秒,对空中的敌人伤害 +30%(首领拉不动,只受伤害和短暂僵直)',8,8],
  ['摇闪反击','举起双拳左右摇闪 1.2 秒(无敌):这期间只要有攻击打过来,立刻看穿并打出一记反击重拳,眩晕敌人 1.5 秒;没人出手的话,结束时向前冲刺打出一记直拳',15,18],
  ['雷火瞬身','瞬移到最近敌人的身后,在它身边左右闪动、连续 8 次雷火打击,最后一记雷火上勾拳把敌人打飞;之后 6 秒闪避率 +25%。全程无敌(附近没有敌人就向前瞬移)',20,16],
  ['破城重拳','蓄力 0.5 秒(霸体)后踏步打出一记超重直拳,拳风沿地面向前推进 300 像素,路上的敌人全部受到重创并「破防」6 秒(受到的拳套伤害 +15%)',22,20],
  ['震地重锤','向前跃起后双拳砸向地面,以自己为中心震开大范围冲击波并把小怪震上天,随后左右地面再连续爆开 3 次余震。全程无敌',25,22],
  ['八门','依次打开「休 生 伤 杜 景 死 惊 开」八道门(无敌,消耗 15% 当前生命),最后一道门打开时炸开一圈斗气冲击;之后 15 秒:拳套伤害 +40%、移速 ×1.3、其他技能冷却加倍恢复、普攻突进更远,每一拳都打出穿透的气拳。八门中再按 WW+空格 = 终式「天崩连舞」:在附近敌人之间瞬移连打 6 次后砸地,八门随之关闭',28,30]];
// 技能倍率 [基础伤害, 攻击倍率, 每级基础 +, 每级倍率 +](= 一个「单位」,各招按单位乘段数):
// H 闪避无伤害 · U 火柱升起 4 单位 + 灼烧 6 次 × 0.5 ≈ 7 · I 抓住 1 + 拉回 1.2 单位(空中 ×1.3)· O 反击 4.5(没反击 0.6 单位)· 空 8 次雷火 + 上勾拳 5.5 单位 ≈ 13.5
// W空 一拳 8 · S空 砸地 3.75 单位 + 3 次余震 ≈ 8.1 · WW空 八门:开门冲击 1 单位(1 级 = 3 倍攻击),终式按开门冲击的倍数算
SKM.fist=[null,[2,.3,1,.04],[10,2.6,5,.3],[30,4.5,12,.6],[3,.45,1.5,.05],[40,8,15,1],[10,1.2,5,.15],[0,3,0,.12]];
SKMP.fist=[.006,.02,.018,.03,.03,.033,.032,.036];
// ---------- 普攻 / 特殊攻击 ----------
function fistStrike(heavy){sfx(heavy?'heavy':'swing');{const dk=keys.r-keys.l;if(dk)P.f=dk}
  if(heavy){P.cmb=-1;P.hbW=.1;P.at=.22;P.cd=.55;P.hb={w:44,h:28,y:0,m:3.2,brk:1}}
  else{P.cmb=P.ct>0?(P.cmb+1)%4:0;const c=FSW[P.cmb];P.hbW=c.W;P.at=c.W+c.S+.02;P.cd=c.cd;P.ct=.7;P.hb=c}
  P.swT=0;P.swC=P.cmb;P.swW=P.hbW;P.swD=P.hbW+(heavy?.1:FSW[P.cmb].S);P.swR=P.cd-P.swD;P.lunged=0;P.swFrom=null;P.hit=new Set();
  if(heavy)burst(P.x+12+P.f*24,P.y+14,10,['#ffa94d','#fff3bf'],260,{sh:1,s:2,l:.25,dr:4});
  {const hv=heavy||P.cmb==3;msAfter(P.hbW,()=>{if(P.mode!='fist')return;const hx=fCX()+P.f*(hv?40:32),hy=P.y+(P.cmb==3&&!heavy?4:14);  // 第七十一轮:每一拳出手都有拳风(打空也有);八门中每拳再打出一道气拳(276)
    VFX.spawn('w-ring',hx,hy,{s:hv?.55:.35,f:P.f,a:.8,add:1});if(hv)VFX.spawn('x-boom',hx+P.f*8,hy,{s:.45,life:.3,add:1,fps:40});if(bmOn())bmqGo(hv)})}}
function fistSpecial(up){if(up){if(P.ujc>0){tx('上勾拳冷却 '+P.ujc.toFixed(1),P.x-16,P.y-14,'#adb5bd');return}P.ujc=UJC;P.sk={id:'fup',t:0,hit:new Set()};P.cd=.4;sfx('swing')}
  else{if(P.sjc>0){tx('肝脏拳冷却 '+P.sjc.toFixed(1),P.x-16,P.y-14,'#adb5bd');return}P.sjc=SJC;P.sk={id:'fbody',t:0,hit:new Set()};P.cd=.5;sfx('swing')}}
// ---------- 斗志 / 破防(dealt 里调用;四星 c4Out 里也调用) ----------
function fistDealt(e,dm,nc){if(P.mode!='fist'||st!='play')return dm;if(e.fbk>GT)dm*=FBKK;if(bmOn())dm*=1+BMK;dm*=1+FSPK*(P.fsp|0);
  if(!nc){P.fspH=GT;if(GT-(P.fspT||0)>.15){P.fspT=GT;P.fsp=Math.min(FSPMX,(P.fsp|0)+1)}}return Math.round(dm)}
function fistTick(dt){bmTick(dt);fplTick(dt);if(P.fsp>0&&GT-(P.fspH||0)>2.5){P.fspD=(P.fspD||0)-dt;if(P.fspD<=0){P.fspD=.3;P.fsp--}}}
const fBrk=e=>{if(!e||e.hp<=0)return;if(!(e.fbk>GT))tx('破防',e.x+e.w/2,e.y-22,'#ffa94d');e.fbk=GT+FBKT};
// ---------- 技能 ----------
const fCX=()=>P.x+12,fMove=(d)=>{P.x=Math.max(bossOn?2570:pLo(),Math.min(xMax(),P.x+d))};
const fBox=(w,y,h,back)=>({x:P.f>0?P.x+P.w-(back||0):P.x-w+(back||0),y:P.y+y,w:w+(back||0),h});
const fU=(i,S,n)=>Math.round(skD('fist',i,S)*(n||1)*rnd(.9,1.1));
function fHit(e,dm,fx){hitFx='punch';dealt(e,dm);hitFx=null;if(fx)VFX.spawn(fx,e.x+e.w/2+rnd(-6,6),e.y+e.h/2+rnd(-8,8),{s:rnd(.8,1.1),f:P.f});if(bmOn())bmHitFx(e)}
function fkoTg(){const cx=fCX();return allTg().filter(e=>Math.abs(e.x+e.w/2-cx)<340&&Math.abs(e.y+e.h/2-(P.y+16))<160).sort((a,b)=>Math.abs(a.x+a.w/2-cx)-Math.abs(b.x+b.w/2-cx))[0]||null}
function fistStart(i,S){const f=P.f,cx=fCX(),cy=P.y+16;
  if(i==0){const d=(keys.r-keys.l)||-f;P.sk={id:'fdod',t:0,inv:1,d};ghost('rgba(165,216,255,.7)',.25);burst(cx,P.y+P.h-2,8,['#e9ecef','#ced4da'],140,{s:3,l:.3,g:200});VFX.spawn('dw-wind',cx,cy,{s:.9,f:d,life:.25,add:1})}
  else if(i==1){P.sk={id:'fpil',t:0};P.ar=Math.max(P.ar||0,.6);VFX.spawn('focus-charge',cx+f*8,cy,{s:.8,life:.2,at:P})}
  else if(i==2){P.sk={id:'fhand',t:0,ph:0,tg:fhTg()};if(P.sk.tg)P.f=sgn(P.sk.tg.x+P.sk.tg.w/2-cx)||f}
  else if(i==3){P.sk={id:'fcnt',t:0,inv:1};ring(cx,cy,4,30,'#a5d8ff',.3,3);tx('摇闪!',P.x-6,P.y-24,'#a5d8ff')}
  else if(i==4){const e=fkoTg();P.sk={id:'fblk',t:0,inv:1,n:0,tg:e};P.fdg=GT+FDGT;flash('255,236,170',.15);fBlink(e)}
  else if(i==5){P.sk={id:'fsieg',t:0};P.ar=Math.max(P.ar||0,.95);VFX.spawn('focus-charge',cx+f*10,cy,{s:1.2,life:.5,at:P});tx('蓄力……',P.x-6,P.y-30,'#ffa94d')}
  else if(i==6){P.sk={id:'fquake',t:0,inv:1,ph:0};P.vy=-430;P.gr=false;burst(cx,P.y+P.h,10,['#ced4da','#adb5bd'],180,{s:3,l:.35,g:300})}
  else if(i==7)bmGo()}  // 第七十二轮:WW+空格 = 八门(276)
// 雷火瞬身:闪到敌人的另一边(面朝它);没有敌人就向前瞬移 120 像素
function fBlink(e){const ox=fCX(),cy=P.y+16;VFX.spawn('smoke-puff',ox,cy+6);ghost('rgba(255,224,102,.8)',.3);psx('blink');
  if(e){const ex=e.x+e.w/2,s=sgn(ex-ox)||P.f;fMove(ex+s*(e.w/2+16)-ox);P.f=-s}else fMove(P.f*120);
  const nx=fCX();for(let j=0;j<12;j++){const q=j/11;pt({x:ox+(nx-ox)*q,y:cy+rnd(-8,8),vx:rnd(-20,20),vy:rnd(-30,10),c:pick(['#ffe066','#74c0fc','#ff922b']),sh:2,s:rnd(3,6),l:rnd(.25,.4)})}
  VFX.spawn('electric-impact',nx,cy,{s:.7});burst(nx,cy,14,['#ffe066','#a5d8ff','#ff922b'],220,{sh:1,s:2.5,l:.3,dr:3})}
const FDGT=6,FDGK=25,fdgB=()=>P.fdg>GT?FDGK:0;  // 雷火瞬身之后 FDGT 秒闪避率 +FDGK%(150 hurt 里加)
// 鬼手:优先抓空中的敌人(左右 320 像素内),没有就抓身前 260 像素内最近的;FHR = 手臂最长,FHV = 伸出速度,FHP = 拉回用时
const FHR=300,FHV=1500,FHP=.22;
function fhTg(){const cx=fCX(),cy=P.y+16,L=allTg().filter(e=>e.hp>0&&!e.ug&&Math.abs(e.y+e.h/2-cy)<260),d=e=>Math.hypot(e.x+e.w/2-cx,e.y+e.h/2-cy);
  const A=L.filter(e=>e.air&&Math.abs(e.x+e.w/2-cx)<320).sort((a,b)=>d(a)-d(b));if(A.length)return A[0];
  return L.filter(e=>(e.x+e.w/2-cx)*P.f>-10&&Math.abs(e.x+e.w/2-cx)<260).sort((a,b)=>d(a)-d(b))[0]||null}
const fhO=()=>({x:fCX()+P.f*9,y:P.y+3});  // 手臂从前手(举在头前)伸出去
// 炎柱崩拳的火柱(独立于技能动作,收招后还会继续烧):每 0.12 秒灼烧柱子里的敌人,让空中的敌人多停一会儿
let FPL=[];
const fpIn=(e,px)=>Math.abs(e.x+e.w/2-px)<e.w/2+34&&e.y+e.h>GY-215&&e.y<GY+4;
function fplTick(dt){if(!FPL.length)return;const S=stats();for(const p of FPL){p.t+=dt;p.tk-=dt;
    if(Math.random()<dt*30)pt({x:p.x+rnd(-26,26),y:GY-rnd(0,180),vx:rnd(-20,20),vy:rnd(-160,-60),c:pick(['#ff922b','#ffd43b','#ff6b35','#fff3bf']),sh:2,s:rnd(3,6),l:rnd(.3,.5)});
    if(p.tk<=0&&p.t<p.T){p.tk=.12;for(const e of allTg())if(e.hp>0&&!e.ug&&fpIn(e,p.x)){fHit(e,fU(1,S,.5),0);if(e.air)e.hang=Math.max(e.hang||0,.25);else if(!p.hit.has(e)){p.hit.add(e);launch(e,.5)}}}}
  FPL=FPL.filter(p=>p.t<p.T+.25)}
function fplDraw(){if(!FPL.length||!VOL9.I)return;  // 360 draw 里在怪物之前画(不挡住柱子里的敌人)
const m=VOL9.M.pillar,s=1.3,t=performance.now()/1000;
  for(const p of FPL){const sx=p.x-cam,g=Math.min(1,p.t/.12),a=Math.min(1,(p.T+.25-p.t)/.25);if(sx<-80||sx>VW+80)continue;
    x.save();x.globalAlpha=a;x.beginPath();x.rect(sx-60,0,120,GY+2);x.clip();VOL9.fr(x,'pillar',Math.floor(t*14)%2,sx-m[1]*s/2,GY+2-m[2]*s*g,s,1);
    x.globalCompositeOperation='lighter';x.globalAlpha=a*.35;VOL9.fr(x,'pillar',Math.floor(t*14+1)%2,sx-m[1]*s*.6,GY+2-m[2]*s*1.2*g,s*1.2,-1);x.restore()}}
// 鬼手的画法:Demon hand(cptx032,CC0)的黑色手臂剪影 —— 手按原大小画在指尖处,手掌根以下那段沿手臂方向拉长到主角的手(art_src/fist/build_fhand.py)
const FHD={I:null,D:'@@A:fhand@@',M:{W:50,H:78,f:[[50,78,27,29.5],[35,76,24,20.5]]}};{const im=new Image();im.onload=()=>{FHD.I=im};im.src=FHD.D}
function fhArm(ox,oy,hx,hy,cl,a){if(!FHD.I)return;const M=FHD.M,m=M.f[cl?1:0],L=Math.hypot(hx-ox,hy-oy),k=.95,hl=m[2]*k,cx=m[3]*k,sx=cl?M.W:0;if(L<6)return;
  x.save();x.globalAlpha=a;x.imageSmoothingEnabled=false;x.translate(Math.round(hx-cam),Math.round(hy));x.rotate(Math.atan2(hy-oy,hx-ox)+Math.PI/2);if(P.f<0)x.scale(-1,1);
  const al=L-hl*.45;if(al>1)x.drawImage(FHD.I,sx,m[2],M.W,M.H-m[2],-cx,hl*.45,M.W*k,al);  // 手臂(拉长)
  x.drawImage(FHD.I,sx,0,M.W,m[2],-cx,-hl*.55,M.W*k,hl);x.restore()}  // 手(原大小,掌心在指尖坐标上)
function fistDraw(){const k=P.sk;if(!k||k.id!='fhand'||k.ph<1||k.hx==null)return;const o=fhO();fhArm(o.x,o.y,k.hx,k.hy,k.ph==2||k.g,1)}
// 摇闪中挨打(150 hurt 开头调用):看穿,打出反击重拳
function fcntGo(){const k=P.sk;if(!k||k.id!='fcnt'||k.c)return;k.c=1;k.ct=k.t;const S=stats(),cx=fCX(),e=nearE(allTg(),cx,P.y+16,170);
  if(e){P.f=sgn(e.x+e.w/2-cx)||P.f;const d=e.x+e.w/2-P.f*(e.w/2+14)-cx;if(Math.abs(d)>6)fMove(d)}
  flash('200,230,255',.3);hitstop(.1);shake=Math.max(shake,.35);tx('看穿!',P.x-6,P.y-34,'#ffe066');psx('blink','heavy');ghost('rgba(165,216,255,.8)',.3);
  const hb=fBox(64,-14,48,10);for(const q of allTg())if(ov(hb,q)){fHit(q,fU(3,S),'resonant-break');bigStun(q,1.5);knock(q,P.f)}
  ring(fCX()+P.f*30,P.y+14,6,54,'#ffe066',.35,5)}
function fistStep(k,dt,S,all){if(!k.id||k.id[0]!='f'||!SKD.fist)return false;const f=P.f,t=k.t;if(bmStep(k,dt,S,all))return true;  // 第七十一轮:开八门 / 终式 / 流星飞膝(276)
  if(k.id=='fup'){if(t<.06&&P.gr)P.vy=-160;if(t>=.06&&t<.2){const hb=fBox(38,-26,52,6);for(const e of all)if(!k.hit.has(e)&&ov(hb,e)){k.hit.add(e);fHit(e,Math.round(S.atk*1.2*rnd(.9,1.1)));launch(e)}}if(t>.36)P.sk=null;return true}
  if(k.id=='fbody'){if(t>=.1&&!k.d){k.d=1;sfx('heavy');const hb=fBox(40,4,26,6);for(const e of all)if(ov(hb,e)){fHit(e,Math.round(S.atk*1.8*rnd(.9,1.1)),'resonant-break');fBrk(e);if(!isBig(e))bigStun(e,.6)}}if(t>.42)P.sk=null;return true}
  if(k.id=='fdod'){// 闪避步:0.22 秒滑开约 105 像素(先快后慢),0.26 秒前都无敌,0.3 秒收招
    if(t<.22){fMove(k.d*(760-t*2600)*dt);k.gt=(k.gt||0)-dt;if(k.gt<=0){k.gt=.03;ghost('rgba(165,216,255,.6)',.2)}
      if(P.gr&&Math.random()<dt*30)pt({x:fCX()-k.d*rnd(4,12),y:P.y+P.h-rnd(1,4),vx:-k.d*rnd(40,100),vy:rnd(-40,-10),c:'rgba(205,195,175,.7)',ad:0,s:rnd(3,5),gr:1,l:.3})}
    if(t>=.26)k.inv=0;if(t>.3)P.sk=null;return true}
  if(k.id=='fpil'){// 炎柱崩拳:0.2 秒举拳 → 砸地(地面裂开、冒火星)→ 0.42 秒火柱升起(击飞)→ 0.7 秒收招;火柱自己再烧 0.75 秒(fplTick)
    if(t>=.2&&!k.a){k.a=1;k.px=clX(fCX()+f*58);psx('slam','heavy');hitstop(.05);shake=Math.max(shake,.3);const gx=fCX()+f*14;
      VFX.spawn('earth-rupture',gx,GY,{s:.7});crack(k.px,4,50);burst(gx,GY-4,10,['#8d5524','#adb5bd','#ff922b'],180,{s:3,l:.4,g:500});ring(gx,GY-4,4,30,'#ff922b',.3,4,.3)}
    if(k.a&&!k.b&&Math.random()<dt*50)pt({x:k.px+rnd(-22,22),y:GY-2,vx:rnd(-20,20),vy:rnd(-140,-50),c:pick(['#ff922b','#ffd43b','#ff6b35']),sh:2,s:rnd(3,5),l:.3});
    if(t>=.42&&!k.b){k.b=1;const p={x:k.px,t:0,T:.75,tk:.12,hit:new Set()};FPL.push(p);psx('fire','boom');shake=Math.max(shake,.45);flash('255,150,60',.15);hitstop(.06);
      VFX.spawn('warm-explosion',k.px,GY-20,{s:1.2});ring(k.px,GY-6,6,70,'#ff922b',.35,5,.3);
      for(const e of all)if(fpIn(e,k.px)){p.hit.add(e);fHit(e,fU(1,S,4),'warm-explosion');launch(e,.6)}}
    if(t>.7)P.sk=null;return true}
  if(k.id=='fhand'){// 鬼手:0.1 秒举手 → 黑色手臂伸向目标(ph 1)→ 抓住、拉回身边(ph 2)→ 僵直;没抓到 / 首领 → 手臂收回(ph 3)
    const o=fhO();if(t<.6)FX.dk=Math.max(FX.dk,.2);
    if(k.ph==0&&t>=.1){k.ph=1;k.hx=o.x;k.hy=o.y;psx('blink');VFX.spawn('x-midnight',o.x,o.y,{s:.6,life:.3,add:1})}
    if(k.ph==1){const e=k.tg&&k.tg.hp>0&&!k.tg.ug?k.tg:null,gx=e?e.x+e.w/2:o.x+f*FHR*.8,gy=e?e.y+e.h/2:o.y-FHR*.5,dx=gx-k.hx,dy=gy-k.hy,d=Math.hypot(dx,dy),s=FHV*dt;
      if(Math.random()<dt*40)pt({x:k.hx+rnd(-4,4),y:k.hy+rnd(-4,4),vx:rnd(-20,20),vy:rnd(-20,20),c:pick(['#5f3dc4','#9775fa','#212529']),sh:2,s:rnd(3,5),l:.3});
      if(e&&d<=s+4){k.ph=2;k.g=e;k.gt=t;k.hx=gx;k.hy=gy;k.gx=gx;k.gy=gy;k.air=e.air?1:0;psx('heavy');hitstop(.06);shake=Math.max(shake,.15);
        fHit(e,fU(2,S,k.air?1.3:1),'b-darkhit');ring(gx,gy,4,26,'#9775fa',.3,3);
        if(isBig(e)){k.big=1;bigStun(e,.6)}else{if(!e.air){e.air=1;e.ay0=e.y;e.hang=0;e.s=null;e.vy=0}e.avy=0;e.hold=.3}}
      else if(d<=s+4||Math.hypot(k.hx-o.x,k.hy-o.y)>FHR)k.ph=3;else{k.hx+=dx/d*s;k.hy+=dy/d*s}}
    if(k.ph==2){const e=k.g,q=Math.min(1,(t-k.gt)/FHP);
      if(k.big){if(q>=.7)k.ph=3}
      else{const ex=o.x+f*(e.w/2+12),ey=P.y+P.h-e.h/2-(k.air?14:0),u=eo(q);k.hx=k.gx+(ex-k.gx)*u;k.hy=k.gy+(ey-k.gy)*u;
        if(e.hp>0){e.x=clX(k.hx)-e.w/2;e.y=k.hy-e.h/2;e.hold=.2;e.kbv=0}
        if(Math.random()<dt*30)pt({x:k.hx+rnd(-8,8),y:k.hy+rnd(-8,8),vx:-f*rnd(20,60),vy:rnd(-20,20),c:pick(['#5f3dc4','#9775fa','#d0bfff']),sh:2,s:rnd(3,5),l:.3});
        if(q>=1){k.ph=3;psx('heavy','dash');hitstop(.05);shake=Math.max(shake,.2);if(e.hp>0){e.hold=0;e.hang=.15;e.avy=0;e.ay0=P.gr?P.y+P.h-e.h:Math.max(e.y,GY-e.h);
          fHit(e,fU(2,S,(k.air?1.3:1)*1.2),'resonant-break');bigStun(e,1.5);VFX.spawn('x-midnight',e.x+e.w/2,e.y+e.h/2,{s:.8,life:.35,add:1})}}}}
    if(k.ph==3){const dx=o.x-k.hx,dy=o.y-k.hy,d=Math.hypot(dx,dy),s=FHV*1.3*dt;if(d<=s+2){P.sk=null;return true}k.hx+=dx/d*s;k.hy+=dy/d*s}
    if(t>1.6)P.sk=null;return true}
  if(k.id=='fcnt'){// 摇闪反击:1.2 秒内挨打 → fcntGo 反击;没挨打 → 1.2 秒时自动直拳
    if(!k.c&&Math.random()<dt*14)ghost('rgba(165,216,255,.45)',.15);
    if(k.c){k.inv=1;if(t-k.ct>.45)P.sk=null;return true}
    if(t>=1.2&&t<1.4){fMove(f*620*dt);k.gt=(k.gt||0)-dt;if(k.gt<=0){k.gt=.03;ghost('rgba(165,216,255,.7)',.2)}}  // 第七十一轮:没人出手就向前冲刺约 120 像素,沿路打一记直拳
    if(t>=1.2&&!k.d){k.d=1;k.inv=0;k.hit=new Set();psx('dash','heavy')}
    if(k.d&&t<1.42){const hb=fBox(56,-4,32,10);for(const e of all)if(!k.hit.has(e)&&ov(hb,e)){k.hit.add(e);fHit(e,fU(3,S,.6),'resonant-break');knock(e,f)}}
    if(t>1.42)P.sk=null;return true}
  if(k.id=='fblk'){// 雷火瞬身:0.12 ~ 0.96 秒每 0.12 秒一次雷火打击(8 次;第 4 / 7 次前闪到敌人另一边)→ 1.08 秒雷火上勾拳
    const e=k.tg&&k.tg.hp>0&&!k.tg.ug?k.tg:null;
    if(k.n<8&&t>=.12+k.n*.12){k.n++;if(e&&(k.n==4||k.n==7))fBlink(e);psx(k.n%2?'zap':'dash');if(k.n%3==0)ghost('rgba(255,224,102,.6)',.2);
      const tg=e?[e]:[],hb=fBox(56,-10,40,10);for(const q of all)if(q!==e&&ov(hb,q))tg.push(q);
      const hx=e?e.x+e.w/2:fCX()+f*36,hy=e?e.y+e.h/2:P.y+14;if(k.n%2)SFX5('m-bolt',hx,(e?e.y+e.h:GY)+4,{s:.75,sy:.8,life:.3});else VFX.spawn('warm-explosion',hx+rnd(-6,6),hy+rnd(-6,6),{s:.55});
      for(const q of tg){fHit(q,fU(4,S),k.n%2?'electric-impact':'m-spark');if(!isBig(q)){q.kbv=0;q.st=Math.max(q.st||0,.3)}}}
    if(k.n>=8&&!k.d&&t>=1.08){k.d=1;psx('thunder','boom');hitstop(.1);shake=Math.max(shake,.4);flash('255,240,180',.25);
      const tg=e?[e]:[],hb=fBox(52,-36,66,10);for(const q of all)if(q!==e&&ov(hb,q))tg.push(q);const hx=e?e.x+e.w/2:fCX()+f*30;
      SFX5('m-bolt',hx,(e?e.y+e.h:GY)+4,{s:1.3,sy:1.1,life:.45});VFX.spawn('electric-impact',hx,(e?e.y+e.h/2:P.y+10),{s:1.3});VFX.spawn('warm-explosion',hx,(e?e.y+e.h/2:P.y+10)-8,{s:1});ring(hx,P.y+10,6,60,'#ffe066',.35,5);
      for(const q of tg){fHit(q,fU(4,S,5.5),'warm-explosion');if(isBig(q))bigStun(q,.8);else launch(q,.5)}}
    if(t>1.35)P.sk=null;return true}
  if(k.id=='fsieg'){// 破城重拳:0.5 秒蓄力 → 直拳 + 拳风沿地面推进 300 像素
    if(t<.5&&Math.random()<dt*30){const a=rnd(0,6.283),r=rnd(26,40),hx=fCX()+f*10,hy=P.y+12;pt({x:hx+Math.cos(a)*r,y:hy+Math.sin(a)*r,vx:-Math.cos(a)*70,vy:-Math.sin(a)*70,c:pick(['#ffa94d','#ffe066','#fff']),sh:2,s:rnd(2,4),l:.35})}
    if(t>=.5&&t<.62){fMove(f*380*dt);ghost('rgba(255,169,77,.6)',.18)}  // 第七十一轮:出拳时踏前一步
    if(t>=.5&&!k.d){k.d=1;psx('boom','heavy');hitstop(.12);shake=Math.max(shake,.5);flash('255,210,150',.25);const x0=fCX(),y0=P.y+14;
      VFX.spawn('x-boom',x0+f*28,y0,{s:1.2,life:.55,add:1});for(let d=40;d<=300;d+=52)msAfter((d-40)/1300,()=>{VFX.spawn('w-ring',x0+f*d,y0,{s:.9,f});burst(x0+f*d,GY-4,6,['#ced4da','#ffe066'],160,{s:3,l:.35,g:400})});
      const lo=Math.min(x0,x0+f*310),hi=Math.max(x0,x0+f*310);for(const e of all)if(e.x+e.w>lo&&e.x<hi&&e.y+e.h>P.y-30&&e.y<P.y+P.h+20){fHit(e,fU(5,S),'resonant-break');fBrk(e);knock(e,f)}}
    if(t>.85)P.sk=null;return true}
  if(k.id=='fquake'){// 震地重锤:跳起 0.3 秒 → 高速砸下 → 落地冲击波 → 3 次余震(每 0.28 秒)
    if(k.ph<2){fMove(f*(k.ph?260:380)*dt);if(Math.random()<dt*30)ghost('rgba(232,194,122,.5)',.16)}  // 第七十一轮:向前跃起(约 130 像素)
    if(k.ph==0&&t>=.3){k.ph=1;P.vy=900}
    if(k.ph==1&&(P.gr||t>1.2)){k.ph=2;k.lt=t;psx('boom','slam');hitstop(.1);shake=Math.max(shake,.55);flash('230,200,160',.2);const cx=fCX();
      VFX.spawn('earth-rupture',cx,GY,{s:1.6});ring(cx,GY-4,8,180,'#e8c27a',.45,7,.3);crack(cx,6,150);
      for(let n=0;n<16;n++)pt({x:cx+rnd(-40,40),y:GY-4,vx:rnd(-220,220),vy:rnd(-460,-160),g:1300,c:pick(['#8d5524','#adb5bd','#6b3f1a']),ad:0,s:rnd(2,5),l:.8,bn:1});
      for(const e of all)if(Math.abs(e.x+e.w/2-cx)<e.w/2+180&&e.y+e.h>GY-150){fHit(e,fU(6,S,3.75),0);launch(e,.3)}}
    if(k.ph>=2&&k.ph<5&&t-k.lt>=.28*(k.ph-1)){const n=k.ph-1,cx=fCX(),d=(n==2?-1:1)*f*[100,170,240][n-1];k.ph++;const px=cx+d;
      VFX.spawn('earth-rupture',px,GY,{s:1.1});crack(px,3,70);shake=Math.max(shake,.25);psx('slam');for(const e of all)if(Math.abs(e.x+e.w/2-px)<e.w/2+70&&e.y+e.h>GY-120){fHit(e,fU(6,S),0);launch(e)}}
    if(k.ph>=5&&t-k.lt>1.0)P.sk=null;return true}
  return false}
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
    if(k.id=='fdod'){glow='rgba(165,216,255,.8)';mouth=null;const b=k.d!=P.f;p=rP(G,b?{lean:-.22,x:-1,sq:.12,head:-.06,hF:.45,kF:.7,hB:-.35,kB:.6}:{lean:.4,x:2,sq:.12,hF:.6,kF:.7,hB:-.6,kB:.4})}
    else if(k.id=='fpil'){glow='rgba(255,146,43,.9)';const D={gx:10,gy:2,aB:1.2,eB:.3,lean:.7,head:.18,x:2,sq:.28,hF:1.1,kF:1.6,hB:-.5,kB:.9};p=t<.2?seq([[0,G],[.12,{gx:3,gy:-25,aB:2.8,eB:.3,lean:-.18,head:-.1,y:-1}]],t):seq([[0,D],[.4,D],[.5,G]],t-.2)}
    else if(k.id=='fhand'){glow='rgba(151,117,250,.9)';const R={gx:13,gy:-25,wa:-1.3,lean:-.12,head:-.14,x:.5},B={gx:4,gy:-15,lean:-.24,x:-1.5,head:-.06,hF:.3,kF:.4,hB:-.4,kB:.5};  // 照常做出对空伸手 → 抓住往回拉
      p=k.ph<=1?seq([[0,G],[.1,R]],t):k.ph==2&&!k.big?rMix(rP(G,R),rP(G,B),eo(Math.min(1,(t-k.gt)/FHP))):k.g&&!k.big?rP(G,B):rP(G,R)}
    else if(k.id=='fup')p=seq([[0,UPw],[.08,UP],[.3,UP]],t);
    else if(k.id=='fbody')p=seq([[0,HKw],[.1,{gx:12,gy:-6,lean:.42,x:2.5,sq:.12,hF:.7,kF:.9,hB:-.5,kB:.5}],[.32,{gx:12,gy:-6,lean:.4,x:2.5,sq:.1}]],t);
    else if(k.id=='fcnt'){glow=k.c?'rgba(255,224,102,.9)':'rgba(165,216,255,.7)';
      if(k.c)p=seq([[0,HKw],[.06,{...HK,gx:13,lean:.45}],[.4,{...HK,gx:13,lean:.4}]],t-k.ct);
      else if(t>=1.2)p=seq([[0,HVw],[.06,HV],[.2,HV]],t-1.2);
      else{const w=Math.sin(t*14);p=rP(G,{x:w*2.2,lean:.2+w*.12,head:w*.08,y:-Math.abs(w)*.6,sq:.08,hF:.5,kF:.7,hB:-.45,kB:.7,gy:-14})}}
    else if(k.id=='fblk'){glow='rgba(255,224,102,.9)';if(t<1.08){const q=Math.floor((t-.12)/.12)%3;p=t<.12?rP(G,HKw):q==0?rP(G,J,{lean:.34}):q==1?rP(G,HK):rP(G,C)}else p=seq([[0,UPw],[.05,UP],[.27,UP]],t-1.08)}
    else if(k.id=='fsieg'){glow='rgba(255,169,77,.9)';p=t<.5?rP(G,HVw,{y:Math.sin(tm*60)*.35}):seq([[0,HV],[.3,HV]],t-.5)}
    else if(k.id=='fquake'){glow='rgba(232,194,122,.85)';const D={gx:9,gy:2,aB:1.2,eB:.3,lean:.75,head:.2,x:2,sq:.3,hF:1.2,kF:1.7,hB:-.5,kB:1};p=k.ph==0?rP(G,{gx:2,gy:-24,aB:2.9,eB:.3,lean:-.2,head:-.12,hF:.8,kF:1.3,hB:.3,kB:1.1}):k.ph==1?rP(G,{gx:8,gy:-2,aB:1.6,eB:.2,lean:.4,hF:.6,kF:.9,hB:-.2,kB:.6}):rP(G,D)}
    else if(k.id[1]=='g'||k.id=='frun'){const r=bmRig(G,k,tm,{J,C,HK,UP,UPw,HV,HVw});p=r.p;glow=r.glow}  // 第七十一轮(276)
    return {p,glow:glow||bmGlow(),mouth}}
  if(P.ch>.15){const q=eo(Math.min(1,(P.ch-.15)/.25));p=rMix(G,rP(G,HVw),q);glow=P.ch>=.7?'rgba(255,169,77,.95)':'rgba(255,255,255,.5)';if(P.ch>=.7)p.y+=Math.sin(tm*70)*.45}
  else if(P.swT!=null&&P.swT<P.swD+P.swR+.12){const c=P.swC,W=P.swW||.05,D=P.swD,T=P.swT;mouth='o';
    const L=c==0?[[0,G],[W,{gx:5,gy:-12.5}],[D,J],[D+.04,J]]:c==1?[[0,G],[W,{lean:.05,x:-.5}],[D,C],[D+.04,C]]:c==2?[[0,G],[W,HKw],[D,HK],[D+.05,HK]]:c==3?[[0,G],[W,UPw],[D,UP],[D+.07,UP]]:[[0,G],[W,HVw],[D,HV],[D+.08,HV]];
    L.push([D+P.swR+.1,G]);p=seq(L,T);if(c==-1||c==3)glow='rgba(255,169,77,.7)'}
  else if(mv=='run')p=base;  // 跑步时双臂照常摆动
  return {p,glow:glow||bmGlow(),mouth}}
// ---------- 纸娃娃上的拳套:eq_atlas 第 7 行的图标缩小成 FGSZ 像素(按系列缓存),沿前臂方向旋转画在手上 ----------
// 第七十二轮(用户:拳套看上去小):12 → 16 像素
const FGC={},FGSZ=16;
function fistGloveImg(){const it=EQ.fist,g=Math.min(7,wG(it)),k=g;if(FGC[k])return FGC[k];if(!EQPX.I)return null;const N=FGSZ,cv=document.createElement('canvas');cv.width=cv.height=N;const c=cv.getContext('2d');
  c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';c.drawImage(EQPX.I,g*EQPX.C+3,EQPX.R.fist*EQPX.C+3,EQPX.C-6,EQPX.C-6,0,0,N,N);
  const d=c.getImageData(0,0,N,N),a=d.data;for(let i=3;i<a.length;i+=4)a[i]=a[i]>110?255:0;c.putImageData(d,0,0);return FGC[k]=cv}
function fistGlove(g,hx,hy,ex,ey,front){const im=fistGloveImg();if(!im)return;const an=Math.atan2(hy-ey,hx-ex);g.save();g.translate(hx,hy);g.rotate(an+Math.PI*.75);if(!front)g.globalAlpha=.85;g.drawImage(im,-FGSZ/2-1,-FGSZ/2-1);g.restore();
  const fw=EQ.fist&&EQ.fist.fw;if(fw&&PPF.I){const f=PPF.M.fr,t=PPFT(),fi=(Math.floor(t*15)+(front?0:3))%f[4],sz=fw==3?15:11;g.save();g.globalCompositeOperation='lighter';if(fw<3)g.filter=fw==1?'hue-rotate(110deg) saturate(1.4)':'hue-rotate(-60deg)';g.drawImage(PPF.I,f[0]+fi*16,f[1],16,16,Math.round(hx-sz/2),Math.round(hy-sz*.95),sz,sz);g.restore()}}  // 第七十轮:火之 / 真~火之 / 紫焰魅影拳套的拳头上冒火苗(N64 Fire 的紫色火焰,火之 / 真~火之改成红 / 蓝)
// ---------- 技能图标:eq_atlas 最后一行(图集载入后生成 ICON.fist0~7)----------
function fistIcons(){if(!EQPX.I)return;const C=EQPX.C,y=7*C;for(let i=0;i<8;i++){const cv=document.createElement('canvas');cv.width=cv.height=96;const c=cv.getContext('2d');c.imageSmoothingEnabled=false;
    const g=c.createLinearGradient(0,0,96,96);g.addColorStop(0,'#2a1408');g.addColorStop(1,i<4?'#a8431a':'#c2410c');c.fillStyle=g;c.beginPath();c.roundRect?c.roundRect(0,0,96,96,18):c.rect(0,0,96,96);c.fill();
    c.drawImage(EQPX.I,i*C,y,C,C,0,0,96,96);ICON['fist'+i]=cv.toDataURL();delete SKIMG['fist'+i]}if(typeof skOpen!='undefined'&&skOpen)renderSk()}
