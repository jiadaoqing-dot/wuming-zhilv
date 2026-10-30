// ===== 第七十一轮(用户):格斗家「八门」—— 转职格斗家后戴拳套按 R 开启;第七十二轮(用户)改成 WW+空格(技能 7,替代终结 K.O.,冷却 = skCdA('fist',7)) =====
// 用户:拳击太站桩、特效太少;想要像开了八门一样,「虽然还是体术,但已经像神明一样的攻击方式,每次出拳都附带大量查克拉」
// 开门(fgate,1.5 秒,无敌):依次打开 休 生 伤 杜 景 死 惊 开 八道门(HUD 上一个字一个字亮起),身上的气焰越来越旺;
//   最后一道门打开时以自己为中心炸开斗气冲击(伤害 + 击飞),消耗当前生命的 BMHP(不会因此倒下)
// 八门状态(P.bm = 到期的 GT,持续 BMT 秒):拳套伤害 +BMK、移速 ×BMSP、技能冷却恢复 ×2、普攻每段向前突进的距离 ×2.5(340)、
//   每一拳打出一道「气拳」(bmqGo:拳压沿直线飞 BMR 像素,穿透;重拳 / 第四段更大更痛);身上冒绿色气焰 + 红色蒸汽
// 八门中再按 WW+空格(开门 1 秒后,240 useSk 里判断,不看冷却)= 终式「天崩连舞」(fgfin):在附近的敌人之间瞬移连打 6 次(敌人少就轮流打),最后跃起砸地炸开,八门随之关闭
// 跑步中按攻击 = 流星飞膝(frun,340 调用):高速前冲约 135 像素,沿路的敌人被膝撞击飞;八门中冲得更远,结尾再打出一道气拳
// 冷却走技能栏(CD.fist[7],八门中这一格不加倍恢复);伤害按技能 7 的倍率(skD,1 级 = 3 倍攻击);美术全部用已有图集:气焰 = FX29 x-fel / x-flame,冲击 = BFX2 w-ring / VFX mass-release / earth-rupture
const BMT=15,BMK=.4,BMSP=1.3,BMHP=.15,BMR=230,BMV=620,BMN='休生伤杜景死惊开';
let BMQ=[],BMH=0,BMF=0;  // 气拳;HUD 开门字幕 / 终式字幕开始的时刻(performance.now 秒)
const bmOn=()=>P.bm>GT,bmGlow=()=>P.bm>GT?'rgba(140,233,154,.85)':null;
// 开门(275 fistStart 7 调用);八门中再按 = 终式(240 useSk 调用 bmKey7)
function bmKey7(){const k=P.sk;if(GT-P.bmS>1&&!(k&&(k.id=='fgate'||k.id=='fgfin')))bmFin()}
function bmGo(){P.sk={id:'fgate',t:0,inv:1,n:0};P.swT=null;P.ch=0;ah=0;BMH=performance.now()/1000;psx('buff');hitstop(.05);ghost('rgba(140,233,154,.7)',.3)}
function bmFin(){const cx=fCX(),L=allTg().filter(e=>Math.abs(e.x+e.w/2-cx)<380&&Math.abs(e.y+e.h/2-(P.y+16))<180).sort((a,b)=>Math.abs(a.x+a.w/2-cx)-Math.abs(b.x+b.w/2-cx)).slice(0,6),tg=[];
  for(let i=0;L.length&&i<6;i++)tg.push(L[i%L.length]);
  P.sk={id:'fgfin',t:0,inv:1,n:0,tg};P.swT=null;P.ch=0;ah=0;BMF=performance.now()/1000;flash('140,233,154',.3);hitstop(.08);psx('blink','buff')}
// 气拳:跟着 q 走的拳压(w-ring 圈 + 风),一路留下绿色气屑
function bmqGo(big){if(BMQ.length>12)BMQ.shift();const f=P.f,q={x:fCX()+f*30,y:P.y+(big?10:14),w:0,h:0,f,d:0,big:big?1:0,hit:new Set(),tk:0};BMQ.push(q);
  VFX.spawn('w-ring',0,0,{at:q,s:big?.8:.55,f,add:1});VFX.spawn('dw-wind',0,0,{at:q,s:big?2.6:1.8,f,life:BMR/BMV,add:1,fi:.02})}
function bmHitFx(e){const cx=e.x+e.w/2,cy=e.y+e.h/2;if(Math.random()<.5)VFX.spawn('x-star',cx+rnd(-8,8),cy+rnd(-8,8),{s:rnd(.35,.55),life:.3,add:1,gr:1});burst(cx,cy,6,['#8ce99a','#e6fcf5','#ff8787'],220,{sh:1,s:2,l:.22,dr:3})}
function bmTick(dt){
  if(BMQ.length){const S=stats();for(const q of BMQ){const s=BMV*dt;q.x+=q.f*s;q.d+=s;q.tk-=dt;
      if(q.tk<=0){q.tk=.025;pt({x:q.x+rnd(-4,4),y:q.y+rnd(-6,6),vx:-q.f*rnd(40,90),vy:rnd(-20,20),c:pick(['#b2f2bb','#e6fcf5','#8ce99a']),sh:2,s:rnd(2,4),l:.25})}
      const r=q.big?22:15,hb={x:q.x-r,y:q.y-r-6,w:r*2,h:r*2+12};
      for(const e of allTg())if(!q.hit.has(e)&&!e.ug&&e.hp>0&&ov(hb,e)){q.hit.add(e);hitFx='punch';noCombo=1;dealt(e,Math.round(S.atk*(q.big?.85:.6)*rnd(.9,1.1)));noCombo=0;hitFx=null;if(!isBig(e))e.kbv=q.f*(q.big?260:140)}}
    BMQ=BMQ.filter(q=>q.d<BMR&&q.x>0&&q.x<xMax()+60)}
  if(P.bm>0&&(!bmOn()||P.mode!='fist')){P.bm=0;ring(fCX(),P.y+16,30,4,'#8ce99a',.3,3)}  // 八门关闭(换了武器也关)
  if(!bmOn())return;
  for(let i=0;i<7;i++)CD.fist[i]=Math.max(0,CD.fist[i]-dt);P.ujc=Math.max(0,(P.ujc||0)-dt);P.sjc=Math.max(0,(P.sjc||0)-dt);  // 冷却恢复 ×2
  P.bmA=(P.bmA||0)-dt;if(P.bmA<=0){P.bmA=.42;VFX.spawn('x-fel',0,0,{at:P,dy:-4,s:.85,life:.6,add:1,a:.5})}
  if(Math.random()<dt*26)pt({x:P.x+rnd(2,22),y:P.y+rnd(4,P.h),vx:rnd(-15,15),vy:rnd(-90,-40),c:pick(['rgba(255,135,135,.8)','rgba(255,201,201,.7)','rgba(178,242,187,.8)']),sh:2,s:rnd(3,6),l:rnd(.4,.7)})}
function bmStep(k,dt,S,all){const t=k.t,f=P.f,cx=fCX(),cy=P.y+16;
  if(k.id=='fgate'){// 0.1 ~ 1.15 秒每 0.15 秒开一道门 → 1.25 秒全开
    if(!k.d)FX.dk=Math.max(FX.dk,.3);
    if(k.n<8&&t>=.1+k.n*.15){k.n++;psx('blink');shake=Math.max(shake,.08+k.n*.03);ring(cx,cy,4,22+k.n*6,k.n<5?'#8ce99a':'#ff8787',.3,3);
      VFX.spawn(k.n<5?'x-fel':'x-flame',cx,k.n<5?cy:P.y+P.h,{s:.6+k.n*.08,life:.45,add:1,a:.8});
      for(let j=0;j<6+k.n*2;j++)pt({x:cx+rnd(-10,10),y:P.y+P.h-rnd(0,30),vx:rnd(-40,40),vy:rnd(-160,-60),c:pick(k.n<5?['#b2f2bb','#8ce99a','#e6fcf5']:['#ff8787','#ffc9c9','#fff']),sh:2,s:rnd(3,6),l:rnd(.35,.6)})}
    if(t>=1.25&&!k.d){k.d=1;FX.dk=0;P.bm=GT+BMT;P.bmS=GT;P.bmA=0;const c=Math.round(P.hp*BMHP);if(P.hp>1)P.hp=Math.max(1,P.hp-c);
      flash('190,255,200',.35);hitstop(.12);shake=Math.max(shake,.6);psx('boom','thunder');
      VFX.spawn('mass-release',cx,P.y+P.h,{s:1.3});VFX.spawn('earth-rupture',cx,GY,{s:1.4});ring(cx,cy,8,150,'#8ce99a',.45,7,.3);pillar(cx,26,'rgba(140,233,154,.8)',.45);crack(cx,5,120);
      for(const e of all)if(Math.abs(e.x+e.w/2-cx)<e.w/2+140&&Math.abs(e.y+e.h/2-cy)<120){fHit(e,Math.round(skD('fist',7,S)*rnd(.9,1.1)),'resonant-break');launch(e,.3);knock(e,sgn(e.x+e.w/2-cx)||f)}}
    if(t>1.5)P.sk=null;return true}
  if(k.id=='fgfin'){// 每 0.17 秒瞬移到下一个目标身边(左右交替)打 2 拳 → 跃起 → 砸地炸开,八门关闭
    if(!k.b||k.b<3)FX.dk=Math.max(FX.dk,.4);const n=k.tg.length;
    if(k.n<n&&t>=.06+k.n*.17){const e=k.tg[k.n++];if(e.hp>0&&!e.ug){const ox=cx,ex=e.x+e.w/2,side=k.n%2?-(sgn(ex-ox)||f):(sgn(ex-ox)||f);ghost('rgba(140,233,154,.8)',.3);
        fMove(ex+side*(e.w/2+14)-ox);P.f=-side;const nx=fCX();for(let j=0;j<10;j++){const q=j/9;pt({x:ox+(nx-ox)*q,y:cy+rnd(-8,8),vx:rnd(-20,20),vy:rnd(-30,10),c:pick(['#8ce99a','#e6fcf5','#ff8787']),sh:2,s:rnd(3,6),l:rnd(.25,.4)})}
        psx('dash');shake=Math.max(shake,.2);VFX.spawn('w-ring',e.x+e.w/2,e.y+e.h/2,{s:.7,add:1});const d=()=>Math.round(skD('fist',7,S)/3*2.5*rnd(.9,1.1));
        fHit(e,d(),'resonant-break');msAfter(.07,()=>{if(e.hp>0&&!e.ug)fHit(e,d(),'m-spark')});if(!isBig(e)){e.kbv=0;e.st=Math.max(e.st||0,.5)}
        const hb=fBox(50,-10,40,10);for(const q of all)if(q!==e&&ov(hb,q))fHit(q,d(),'m-spark')}}
    if(k.n>=n&&!k.b&&t>=.1+n*.17){k.b=1;k.bt=t;P.vy=-420;P.gr=false;psx('jump')}
    if(k.b==1&&t-k.bt>=.2){k.b=2;P.vy=1100}
    if(k.b==2&&(P.gr||t-k.bt>1)){k.b=3;k.lt=t;FX.dk=0;psx('boom','slam');hitstop(.15);shake=Math.max(shake,.8);flash('255,255,255',.45);
      VFX.spawn('earth-rupture',cx,GY,{s:1.9});VFX.spawn('x-boom',cx,GY-30,{s:1.3,life:.6,add:1});VFX.spawn('solar-shrapnel',cx,GY-30,{s:1.5});ring(cx,GY-6,10,220,'#8ce99a',.5,8,.3);pillar(cx,30,'rgba(140,233,154,.85)',.5);crack(cx,8,200);
      for(const e of all)if(Math.abs(e.x+e.w/2-cx)<e.w/2+220&&e.y+e.h>GY-200){fHit(e,Math.round(skD('fist',7,S)/3*8*rnd(.9,1.1)),'warm-explosion');if(isBig(e))bigStun(e,1.5);else launch(e,.5)}
      P.bm=GT}
    if(k.b==3&&t-k.lt>.7)P.sk=null;return true}
  if(k.id=='frun'){// 流星飞膝:0.05 ~ 0.33 秒高速前冲(八门中 ×1.5),沿路的敌人被膝撞击飞;0.5 秒收招
    const g=bmOn()?1.5:1;
    if(t>.05&&t<.33){fMove(f*640*g*(1-(t-.05)/.28*.5)*dt);k.gt=(k.gt||0)-dt;if(k.gt<=0){k.gt=.03;ghost(g>1?'rgba(140,233,154,.7)':'rgba(255,192,120,.75)',.22)}
      pt({x:cx-f*rnd(4,14),y:P.y+P.h-rnd(1,4),vx:-f*rnd(60,140),vy:rnd(-50,-10),c:'rgba(205,195,175,.7)',ad:0,s:rnd(3,5),gr:1,l:.35});
      const hb=fBox(40,-4,P.h+4,6);for(const e of all)if(!k.hit.has(e)&&ov(hb,e)){k.hit.add(e);fHit(e,Math.round(S.atk*1.7*rnd(.9,1.1)),'resonant-break');if(isBig(e))knock(e,f);else launch(e,.25);hitstop(.03)}}
    if(t>=.33&&!k.d){k.d=1;if(g>1)bmqGo(1)}
    if(t>.5)P.sk=null;return true}
  return false}
// 姿势(275 fistRig 调用;Q = fistRig 里的拳击关键姿势)
function bmRig(G,k,tm,Q){const t=k.t,gl='rgba(140,233,154,.95)';
  if(k.id=='fgate')return {p:t<1.25?rP(G,Q.HVw,{sq:.12*Math.min(1,t/.3),y:Math.sin(tm*60)*.35}):rP(G,Q.UP),glow:gl};
  if(k.id=='frun')return {p:rP(G,Q.HV,{hF:1.5,kF:2,hB:-.5,kB:.3,lean:.45}),glow:bmGlow()||'rgba(255,192,120,.8)'};  // 膝撞:前腿高抬
  if(k.b)return {p:k.b<3?rP(G,Q.UP):rP(G,{gx:9,gy:2,aB:1.2,eB:.3,lean:.75,head:.2,x:2,sq:.3,hF:1.2,kF:1.7,hB:-.5,kB:1}),glow:gl};
  const q=k.n%3;return {p:q==0?rP(G,Q.J,{lean:.34}):q==1?rP(G,Q.HK):rP(G,Q.C),glow:gl}}
// HUD:药水栏上面一行 = 八门状态(斗志那里会被右下角按钮挡住);开门 / 终式时屏幕上方的大字
function bmHud(){if(!jobOk('fist'))return;if(bmOn())CT('八门 '+Math.ceil(P.bm-GT)+'s · WW+空格 终式',225,VH-49,8,'#8ce99a','center',2,'#120d18');  // 第七十二轮:冷却显示在技能栏的 WW+空格 格子上
  const now=performance.now()/1000;
  if(BMH){const t=now-BMH;if(t>2.6)BMH=0;else{x.save();x.globalAlpha=Math.min(1,(2.6-t)/.4);
    for(let i=0;i<8;i++){const t0=.1+i*.15,on=t>=t0,s=on?Math.max(0,1-(t-t0)/.15):0;CT(BMN[i],VW/2+(i-3.5)*26,VH*.3,Math.round(16+6*s),on?(i<5?'#8ce99a':'#ff8787'):'rgba(255,255,255,.25)','center',3,'#0b1f10')}
    if(t>=1.25)CT('八门 · 全开',VW/2,VH*.3+30,Math.round(22*(1+Math.max(0,1.45-t)*2)),'#fff3bf','center',4,'#5c1a00');x.restore()}}
  if(BMF){const t=now-BMF;if(t>1.6)BMF=0;else{x.save();x.globalAlpha=Math.min(1,(1.6-t)/.4);CT('终式 · 天崩连舞',VW/2,VH*.3,Math.round(22*(1+Math.max(0,.2-t)*2)),'#8ce99a','center',4,'#0b1f10');x.restore()}}}
