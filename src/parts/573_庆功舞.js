// ===== 第六十四轮(用户):暗黑炼狱 30 层通关后的庆功舞(st = 'dnc',可跳过)=====
// 第 30 层首领倒下 2.5 秒后开始(DNA 倒计时,在 572 twChk 里走);选层页「重看庆功舞」可以再看(打通过第 30 层才有)
// 音乐 = 原创舞曲 bgmD《Nameless Tonight》(art_src/audio/build_song64.py 合成:128 BPM、96 小节 ≈ 3 分钟,人声是英文歌词)
// 剑士和法师 = 主角同一套纸娃娃(LPC.dollDraw,穿当前装备),动作是骨骼姿势(760 的 RIG 关节参数)按拍子算出来的,放大 2 倍画在炼狱塔的场景上
// 舞台特效全部用 VFX 图集(烟花 = solar-shrapnel / spectral-bloom,光柱 = radiant-heal ……);字幕 DNL 和 build_song64.py 打印的歌词表一致
// 时间以音乐为准:AU.t0 = bgmPlay 开始播放的时刻;音乐还没解码好时最多等 4 秒,之后按真实时间走
// 跳过:Esc 直接跳过;空格 / 回车 / 点画面要按两次(第一次提示「再按一次跳过」)
const DNSPB=60/128,DNEND=96*4*DNSPB+2.4;
const DNS=[['intro',0,8],['verse',8,16],['pre',24,8],['chorus',32,16],['break',48,8],['verse2',56,8],['pre2',64,8],['chorus2',72,16],['outro',88,8]];
const DNL=[[8,"Thirty floors of fire and stone","三十层的烈火和岩石"],[10,"Every door I walked alone","每一扇门,我都独自走过"],[12,"Now the tower lights are green","如今宝塔亮起了绿光"],[14,"Brightest night I've ever seen","这是我见过最亮的夜晚"],[16,"Sword is shining in my hand","剑在我的手里发光"],[18,"Magic dancing where we stand","魔法在我们脚边起舞"],[20,"No more monsters, no more fight","没有怪物,也没有战斗"],[22,"Only music in the night","夜里只剩下音乐"],[24,"They never gave me a name","他们从没给过我名字"],[26,"But I never lost the flame","可我心里的火从没熄灭"],[28,"Hear the beat, feel it rise","听那节拍,感受它升起"],[30,"One, two, three, open your eyes","一、二、三,睁开眼睛"],[32,"We are nameless, we are free","我们没有名字,我们自由自在"],[34,"Thirty floors beneath our feet","三十层宝塔踩在脚下"],[36,"Sword and spell, left and right","剑与魔法,一左一右"],[38,"We're the heroes of the night","我们是今夜的英雄"],[40,"Na na nameless, shine so bright","无名,无名,闪闪发光"],[42,"Move your body, feel the light","舞动身体,感受光芒"],[44,"Sword and spell, left and right","剑与魔法,一左一右"],[46,"Dance until the morning light","一直跳到天亮"],[48,"Oh, oh, oh, oh, oh","哦——哦——"],[50,"Oh, oh, oh, oh, oh","哦——哦——"],[52,"Oh, oh, oh, oh, oh","哦——哦——"],[54,"Oh, oh, oh, oh, oh","哦——哦——"],[56,"Goddess sleeping, can you hear","沉睡的女神,你听见了吗"],[58,"All your children dancing here","你的孩子们正在这里跳舞"],[60,"Twelve dark kings have turned to dust","十二位魔王化成了尘土"],[62,"Now the only kings are us","现在,我们就是王"],[64,"They never gave me a name","他们从没给过我名字"],[66,"But I never lost the flame","可我心里的火从没熄灭"],[68,"Hear the beat, feel it rise","听那节拍,感受它升起"],[70,"One, two, three, open your eyes","一、二、三,睁开眼睛"],[72,"We are nameless, we are free","我们没有名字,我们自由自在"],[74,"Thirty floors beneath our feet","三十层宝塔踩在脚下"],[76,"Sword and spell, left and right","剑与魔法,一左一右"],[78,"We're the heroes of the night","我们是今夜的英雄"],[80,"Na na nameless, shine so bright","无名,无名,闪闪发光"],[82,"Move your body, feel the light","舞动身体,感受光芒"],[84,"Sword and spell, left and right","剑与魔法,一左一右"],[86,"Dance until the morning light","一直跳到天亮"],[88,"We are nameless, we are free","我们没有名字,我们自由自在"],[90,"Dance until the morning light","一直跳到天亮"],[92,"Nameless","无名"],[94,"Dance tonight","今夜起舞"]];
let DNC=null,DNA=0;
const DNX=[255,385];  // 剑士 / 法师站的位置(屏幕 x),脚底在 GY
function dncGo(ret){DNA=0;DNC={t:0,w:0,live:0,ret:ret||st,lb:-1,fx:[],sk:0,cam,pj:[0,0]};st='dnc';sfxAll();keys.l=keys.r=0;msgU=0}
function dncEnd(){if(!DNC)return;const r=DNC.ret;DNC=null;st=r;if(r=='play')banner('第 '+TWNF+' 层通关!站到通关光柱上按 W 完成关卡')}
function dncSkip(hard){if(!DNC)return;if(hard||DNC.sk>0){dncEnd();return}DNC.sk=2}
const dnSec=bar=>DNS.find(s=>bar>=s[1]&&bar<s[1]+s[2])||['end',96,9];
const dnHit=u=>Math.exp(-u*7),dnBump=u=>Math.sin(Math.PI*Math.min(1,Math.max(0,u))),dnE=q=>q<.5?2*q*q:1-2*(1-q)*(1-q);
// 编舞:返回 [动作, 参数];who 0 = 剑士,1 = 法师
function dnPlan(who,B){const bar=Math.floor(B/4),bb=B-bar*4,[s,s0]=dnSec(bar),r=bar-s0;
  if(s=='intro')return r<4?['wave',.5]:r==7&&bb>=3?['pose']:['nod'];
  if(s=='verse'||s=='verse2'){const k=r%4;return k<2?['step']:k==2?(bb<2?['bob']:['pump']):['kick']}
  if(s=='pre'||s=='pre2'){if(r<4)return ['wave',1];if(r<6)return ['bang'];if(r==7&&bb>=3.5)return ['pose'];return ['crouch',((r-6)*4+bb)/8]}
  if(s=='chorus'||s=='chorus2'){
    if(s=='chorus2'&&(r==8||r==14)&&bb<2)return ['cross',bb/2];  // 第二遍副歌:两人跳起来交换位置(第 8 小节换过去,第 14 小节换回来)
    if(r==15)return bb<3?['wave',1]:['pose'];
    if(r%8==4){const me=who==0?bb<2:bb>=2;return me?[who?'cast':'slash']:['bob']}  // 「Sword and spell, left and right」:剑士先砍,法师再放魔法
    return r%2==0?(bb<1?['jump']:['pump']):(bb<2?['spin']:['kick'])}
  if(s=='break'){if(r<4)return ['wave',.5];const solo=r<6?0:1;if(who!=solo)return ['bob'];const k=Math.floor(bb)%4;return [k==0?(who?'cast':'slash'):k==1?'spin':k==2?'jump':'pump']}
  if(s=='outro'){if(r<4)return ['step',.5];if(r<7)return ['nod'];return bb<1?['pose']:['bow',Math.min(1,(bb-1)/1.2)]}
  return ['bow',1]}
const DNUP={sword:{gx:4,gy:-19,wa:-1.57,two:0},staff:{gx:3,gy:-21,wa:-1.57,two:0}};
// 动作 → 局部骨骼姿势(会合并到站姿上);AIR = 离地高度(负数向上),F = 翻转朝向
function dnMove(m,mv,a,B){const u=B-Math.floor(B),S=Math.sin(Math.PI*B),W=DNUP[m];
  switch(mv){
    case 'bob':{const d=dnHit(u);return {kF:.16+.55*d,kB:.14+.55*d,hF:.26+.28*d,hB:-.22+.06*d,lean:.06+.1*d,head:.1*d,sq:.05*d}}
    case 'nod':{const d=dnHit(u),h=dnHit((B*2)%1);return {kF:.16+.4*d,kB:.14+.4*d,hF:.26+.2*d,lean:.05+.06*d,head:.18*h,sq:.04*d}}
    case 'step':{const b=B*(a||1),ph=b%2,L=ph<1?dnBump(ph):0,R=ph>=1?dnBump(ph-1):0,s=Math.sin(Math.PI*b);
      return {hF:.26+.55*L,kF:.16+.85*L,hB:-.22-.45*R,kB:.14+.9*R,x:2.5*s,lean:.06+.08*s,head:-.08*s,aB:.3+.9*s,eB:.5,two:0,gx:7,gy:-6+2*Math.sin(2*Math.PI*b),wa:(m=='sword'?-.5:-1.2)+.25*s}}
    case 'pump':{const d=dnHit(u);return {...W,gy:W.gy-2.5*d,wa:W.wa+.12*d,aB:2.85-.5*d,eB:.2+.5*d,kF:.16+.45*d,kB:.14+.45*d,hF:.26+.2*d,lean:-.04+.08*d,head:-.1+.1*d}}
    case 'jump':{const air=u<.12?0:u<.88?dnBump((u-.12)/.76):0,pre=u<.12?dnBump(u/.24):0,land=u>=.88?dnBump((u-.88)/.24):0;
      return {...W,aB:2.9,eB:.2,hF:.26+.75*air+.3*pre,kF:.16+1.3*air+.6*pre+.5*land,hB:-.22+.5*air,kB:.14+1.4*air+.6*pre+.5*land,lean:-.1*air+.22*pre,head:-.12*air,AIR:-12*air}}
    case 'spin':{const h=(B*2)%1;return {...W,wa:W.wa+.3*Math.sin(Math.PI*h),aB:2.4,eB:.3,hF:.3,kF:.3*dnBump(h),hB:-.2,kB:.3*dnBump(h),F:Math.floor(B*2)%2?-1:1,AIR:-4*dnBump(h)}}
    case 'kick':{const k=u<.55?dnBump(u/.55):0;return {hF:.26+1.25*k,kF:Math.max(0,.16-.16*k),hB:-.22+.06*k,kB:.14+.2*k,lean:-.2*k,head:-.08*k,aB:.3-.7*k,eB:.6,two:0,gx:6,gy:-9,wa:m=='sword'?-.9:-1.3}}
    case 'wave':{const s=Math.sin(Math.PI*B*(a||1));return {...W,wa:W.wa+.6*s,gx:W.gx+3*s,lean:.12*s,head:-.1*s,x:2*s,aB:2.5-.4*s,eB:.3,hF:.26+.15*s,hB:-.22+.15*s}}
    case 'bang':{const d=dnHit((B*2)%1);return {lean:.2+.18*d,head:.28*d,kF:.32+.3*d,kB:.32+.3*d,hF:.42,hB:-.08,two:0,gx:8,gy:-4,wa:m=='sword'?.3:-1.1,aB:.4+.6*d,eB:.9}}
    case 'crouch':{const q=Math.min(1,a),j=Math.sin(B*Math.PI*8)*q;return {kF:.16+1.15*q,kB:.14+1.15*q,hF:.26+.6*q,hB:-.22+.5*q,lean:.1+.35*q,head:.15*q,two:0,gx:7,gy:-3,wa:m=='sword'?.5:-1,x:j*.8,sq:.04*q,aB:.4,eB:1}}
    case 'pose':return m=='sword'?{gx:11,gy:-17,wa:-1.1,two:0,lean:-.12,head:-.1,hF:.55,kF:.08,hB:-.55,kB:.1,aB:-1.1,eB:.2}:{gx:3,gy:-22,wa:-1.57,two:0,lean:-.12,head:-.15,hF:.4,kF:.1,hB:-.45,kB:.1,aB:-1.3,eB:.3};
    case 'bow':{const q=dnE(a);return m=='sword'?{lean:.75*q,head:.35*q,two:0,gx:8+2*q,gy:-2+2*q,wa:.13+1.3*q,aB:.3+.5*q,eB:.4}:{lean:.7*q,head:.35*q,two:0,gx:7-2*q,gy:-4-3*q,wa:-1.05-.52*q,aB:.3+.5*q,eB:.4}}  // 剑插在地上、法杖竖着拿
    case 'cross':{const q=dnE(a);return {...W,aB:2.9,eB:.2,hF:.26+.8*dnBump(q),kF:.16+1.2*dnBump(q),hB:-.22+.5*dnBump(q),kB:.14+1.3*dnBump(q),lean:.15,AIR:-26*dnBump(q),CQ:q}}
  }return {}}
// 挥砍 / 施法用关键帧(rSeq),返回完整姿势
function dnSeq(m,base,u){
  if(m=='sword'){const Wd={gx:-2,gy:-18,wa:-2.4,two:1,lean:-.15,hF:.3,hB:-.3},St={gx:13,gy:-6,wa:.5,two:1,lean:.3,x:2.5,hF:.9,kF:.3,hB:-.8,kB:.15};return rSeq(base,[[0,null],[.28,Wd],[.5,St],[.95,St]],u)}
  return rSeq(base,[[0,null],[.25,STFR],[.5,STFT],[.95,STFT]],u)}
const dnFoot=(h,k)=>RIG.thigh*Math.cos(h)+RIG.shin*Math.cos(h-k),dnF0=()=>Math.max(dnFoot(RBASE.hF,RBASE.kF),dnFoot(RBASE.hB,RBASE.kB));  // RBASE 在 760 才定义,用到时再算

// 某一拍某个角色的完整状态:p 骨骼姿势、X 屏幕位置、f 朝向、air 离地、glow 武器光、stg 法杖握的位置
function dnState(who,B){const m=who?'staff':'sword',[mv,a]=dnPlan(who,B),base=rP(STANCE[m]),bar=Math.floor(B/4),[s,s0]=dnSec(bar),r=bar-s0;
  let p,o={};if(mv=='slash'||mv=='cast'){p=dnSeq(m,base,B%1)}else{o=dnMove(m,mv,a,B);const q={...o};delete q.AIR;delete q.F;delete q.CQ;p=rP(STANCE[m],q)}
  p.y=(p.y||0)+dnF0()-Math.max(dnFoot(p.hF,p.kF),dnFoot(p.hB,p.kB));
  // 位置:第二遍副歌第 8~13 小节两人换边
  const sw=s=='chorus2'&&r>=8&&r<14;let X=DNX[sw?1-who:who];
  if(mv=='cross'){const q=o.CQ,from=DNX[r==8?who:1-who],to=DNX[r==8?1-who:who];X=from+(to-from)*q}
  let f=X<320?1:-1;if(mv=='cross')f=(r==8)==(who==0)?1:-1;if(s=='verse2'&&r<4)f=-f;if(o.F)f*=o.F;
  const glow=mv=='cast'||(who&&(mv=='pose'||mv=='pump'&&(s=='chorus'||s=='chorus2')))?'rgba(165,216,255,.95)':mv=='slash'||(!who&&mv=='pose')?'rgba(255,224,102,.9)':null;
  return {m,mv,p,X,f,air:o.AIR||0,glow,stg:mv=='cast'?.5:null}}
function dnFx(n,X,Y,o){const L=VFX.L;VFX.L=DNC.fx;try{VFX.spawn(n,X,Y,o)}finally{VFX.L=L}}
const DNFW=['solar-shrapnel','spectral-bloom','warm-explosion','frost-nova'];
function dnBeat(n){const bar=n>>2,bb=n&3,[s,s0]=dnSec(bar),r=bar-s0,B=n+.02,fw=()=>dnFx(pick(DNFW),rnd(90,550),rnd(40,140),{s:rnd(1.2,1.8)});
  if(bb==0&&[8,32,48,56,72,88].includes(bar))for(const X of DNX)dnFx('radiant-heal',X,GY-30,{s:1.6});
  if(bb==0&&(bar==32||bar==72))dnFx('mass-release',320,GY-60,{s:2});
  if(s=='chorus'||s=='chorus2'){if(bb==0||bb==2)fw();if(bb==0&&r%4==0)fw()}
  if(s=='outro'&&bb==0&&r<4)fw();
  if(n==95*4){dnFx('mass-release',320,GY-60,{s:2.4});dnFx('resonant-break',320,GY-80,{s:2});for(let i=0;i<5;i++)fw()}
  for(const who of [0,1]){const q=dnState(who,B),d=q.f;
    if(q.mv=='slash')dnFx('crescent-slash',q.X+d*34,GY-44,{s:1.7,f:d,r:.5*d});
    if(q.mv=='cast')dnFx('dw-arcane',q.X+d*44,GY-50,{s:1.4});
    if(q.mv=='pose'&&Math.floor(B*2)%2==0)dnFx('focus-charge',q.X,GY-40,{s:1.3});
    if(DNC.pj[who]&&q.mv!='jump')dnFx('landing-dust',q.X,GY-4,{s:1.4});DNC.pj[who]=q.mv=='jump'||q.mv=='cross'}}
// 画一个舞者:地面以下裁掉(鞠躬时剑尖插进地里)
function dnDoll(q){const g0=P.rglow,s0=P.stg,p0=P.ps;P.rglow=q.glow;P.stg=q.stg;P.ps=0;let d;
  try{d=LPC.dollDraw(q.p,q.m,heroLook().look||'',LPC.tier())}finally{P.rglow=g0;P.stg=s0;P.ps=p0}
  x.save();x.beginPath();x.rect(0,0,VW,GY+2);x.clip();x.translate(Math.round(q.X),GY+Math.round(q.air*2));x.scale(2*q.f,2);x.imageSmoothingEnabled=false;x.drawImage(d.cv,-88,-108);x.restore()}
function drawDnc(dt){const D=DNC;if(!D)return;
  // 时钟:跟着音乐走
  const live=AU.ctx&&AU.trk=='bgmD'&&AU.src&&AU.t0!=null;
  if(live){D.t=Math.max(0,AU.ctx.currentTime-AU.t0-(AU.ctx.outputLatency||0));D.live=1}else if(D.live||D.w>4||!AU.ctx)D.t+=dt;else D.w+=dt;
  if(D.sk>0)D.sk-=dt;if(D.t>=DNEND){dncEnd();return}
  const B=D.t/DNSPB,go=D.live||D.w>4||!AU.ctx;if(go)while(D.lb<Math.floor(B)){D.lb++;dnBeat(D.lb)}
  // 背景:炼狱塔的场景(永夜王城城堡 + 绿光),每拍亮一下
  const c0=cur,k0=cam;cur=TW0;cam=D.cam;try{bg()}finally{cur=c0;cam=k0}
  x.fillStyle='rgba(4,10,14,'+(.34-.12*dnHit(B%1)*(go?1:0))+')';x.fillRect(0,0,VW,VH);
  const L=VFX.L;VFX.L=D.fx;cam=0;try{VFX.step(dt);PXL.run(()=>{if(LPC.ready())for(const w of [0,1])dnDoll(dnState(w,go?B:0));VFX.draw()})}finally{VFX.L=L;cam=k0}
  const bar=B/4;
  if(!go)CT('音乐加载中……',320,180,12,'#d3f9d8','center',2.4,'#08200e');
  if(bar<4){const a=Math.min(1,bar*2,(4-bar)*2);x.globalAlpha=a;CTG('Nameless Tonight',320,72,24);CT('暗黑炼狱 · 三十层通关庆功舞',320,96,11,'#d3f9d8','center',2.4,'#08200e');x.globalAlpha=1}
  const l=DNL.find(q=>bar>=q[0]&&bar<q[0]+2);
  if(l){const a=Math.min(1,(bar-l[0])*6,(l[0]+2-bar)*6);x.globalAlpha=a;CT(l[1],320,322,14,'#fff','center',3,'#1a1030');CT(l[2],320,340,10,'#ffe8a3','center',2.4,'#1a1030');x.globalAlpha=1}
  CT(D.sk>0?'再按一次跳过':'Esc / 空格 跳过',628,18,9,D.sk>0?'#ffd43b':'#ced4da','right',2.2,'#08200e');
  x.fillStyle='rgba(255,255,255,.18)';x.fillRect(0,VH-2,VW,2);x.fillStyle='#69db7c';x.fillRect(0,VH-2,VW*Math.min(1,D.t/(96*4*DNSPB)),2)}
