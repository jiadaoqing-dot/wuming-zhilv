// ===== 第五十六轮(用户):暗黑炼狱 —— 第二张地图「暗黑大陆」正中的绿光宝塔(用户附图),cur 34(TW0),一共 30 层,先开 16 层(TWOPEN)=====
// 一层一层往上闯:每层是已有关卡的首领(一层一到两个),打完一层 → 宝箱(星界财宝的奖励表 ASTRR 里随机 3~4 样,直接放进背包)+ 回复大量生命 / 魔力(TWHL)
//   → 3.5 秒后自动进入下一层(生命 / 魔力保留,第五十七轮);开放的最后一层才出通关光柱 → 通关页 / 返回城镇。不分星级:按二星进(LVSTAR 2),所有首领的生命 / 攻击 / 防御 = 二星焚天炎君(表里 [34] 同 [16])
// 两个首领同时在场:第一个 = B,第二个放进 E(e.twb);每个首领记着自己原来的关卡 e.hc,推进 / 绘制时临时把 cur 和 B 换成它自己(twIn / twOut),
//   原关卡的场上机关(鬼手 / 熔岩 / 导弹 / 炸弹……)也按 hc 各推进一次(TWLS / TWFX)。B 先倒下就把 E 里的那个换成 B(twChk)
// 记录:R19.twr = 打通过的最高层;选层页 st 'twr' 只能从 1 ~ 最高层 +1 里选。场景 = 永夜王城(CST)压一层绿光;BGM = 本层第一个首领原来的首领曲
// 第六十二轮(用户):30 层全部开放 —— 17~30 层按实力放后面几关的首领和十二魔(恶魔一层一个,最后三层两个一起);第 17 层起每层生命 +12% / 攻击 +5%(twK);
//   打通第 20 层得称号「恶魔之王」、第 30 层得「地狱之王」(065 称号);第 30 层再掉大师二阶装备
const TW0=34,isTw=c=>c==TW0,TWNF=30,TWOPEN=30,TWHL=.7;
let TWF=1;  // 第六十六轮(用户):选层页的「四星」开关(第六十七轮起 = 111 分块的挑战模式总开关 C4M) —— 四星按 111 分块的百分比伤害打,没有宝箱 / 击杀点 / 称号 / 挑战积分,只记四星最高层 R19.tw4
const TWL=[null,['boss','boss'],['mage','mage'],['boss','mage'],['king','king'],['sco'],['andr','king'],['bear','andr'],['wiz'],['yin'],['bear','wiz'],
  ['wiz','yin'],['lava'],['mech','yin'],['lava','lava'],['nk'],['nk','mech'],
  ['fk'],['nb'],['alm'],['rgn'],['ifg'],['baal'],['dagon'],['molo'],['asmo'],['beli'],['asta','belz'],['mamm','levi'],['belp','azaz'],['luci']];  // 第六十二轮:17 ~ 30 层
const TWHC={boss:1,mage:2,king:3,sco:4,andr:5,bear:6,wiz:7,yin:8,lava:9,mech:14,nk:15,fk:16,nb:18,alm:19,rgn:20,ifg:21};
DMD.forEach((d,i)=>{if(d.k)TWHC[d.k]=DM0+i});  // 十二魔 = cur 22 ~ 33
const TWNM={boss:'铁角牛魔',mage:'面具法师',king:'金色蛇王',sco:'黑棘巨蝎',andr:'沙渊古神',bear:'北极熊',wiz:'血月巫王',yin:'怨婴·银太郎',lava:'熔狱魔神',mech:'钢铁暴君',nk:'夜王',fk:'焚天炎君',nb:'影主·胧',alm:'千钟之主',rgn:'金核炮神',ifg:'炎狱巨像'};
DMD.forEach(d=>{if(d.k)TWNM[d.k]=d.n});
const TWLS={8:()=>g8Step,9:()=>v9Step,14:()=>m14Step,15:()=>c15Step,16:()=>f16Step,18:()=>n18Step,19:()=>a19Step,20:()=>a20Step,21:()=>i21Step},TWFX={8:()=>g8Fx,9:()=>v9Fx,14:()=>m14Fx,15:()=>c15Fx,16:()=>f16Fx,18:()=>n18Fx,19:()=>a19Fx,20:()=>a20Fx,21:()=>i21Fx};
for(let c=DM0;c<DM0+12;c++){TWLS[c]=()=>dmStep;TWFX[c]=()=>dmFx}  // 十二魔共用 dmStep / dmFx(场上的东西是全局的,一层两个恶魔时只推进 / 画一次,见 twHcs)
BGMF[TW0]=21;BGMF[MY5]=11;  /* 第五十九轮:神秘副本 5 首领倒下以后用神秘地带的曲子 */  // 首领倒下以后借第十七关的关卡曲
const twNm=k=>TWNM[k]||'',twFl=f=>(TWL[f]||[]).map(twNm).join(' + ');
// 临时换成首领原来的关卡
function twIn(e){const s=[cur,B];cur=e.hc;B=e;return s}
function twOut(s){cur=s[0];B=s[1]}
function twAs(e,f){const s=twIn(e);try{f()}finally{twOut(s)}}
const twAll=()=>[B,...E.filter(e=>e.twb)].filter(e=>e&&e.twb&&e.hp>0);
function twHcs(){const L=[],h={};for(const e of twAll()){const g=isDm(e.hc)?'dm':e.hc;if(!h[g]){h[g]=1;L.push(e)}}return L}
// 第六十二轮:各首领自己的初始化(千钟之主的命数、恶魔的二阶段计时……)照常跑,但生命 / 攻击 / 防御保持炼狱的统一数值,再乘层数加成 twK
const twK=()=>TWF<=16||isC4()?[1,1]:[1+.12*(TWF-16),1+.05*(TWF-16)];
function twPost(e){const hp=e.max,dm=e.dm,df=e.def;twAs(e,()=>{if(e.k=='alm')almInit();else if(e.k=='rgn')rgInit();else if(e.k=='ifg')igInit();else if(isDm(e.hc))dmInit()});
  const k=twK();e.hp=e.max=Math.round(hp*k[0]);e.dm=dm*k[1];e.def=df;e.esnm=1;e.twH=e.max;e.twD=e.dm}
// 进层(140 init 里调用):twMk 造第一个首领(= B,init 接着按二星焚天炎君的数值处理),twInit 造第二个并按同样的规则处理
function twMk(bMk){DNA=0;const k=TWL[TWF][0],c0=cur;cur=TWHC[k];const e=bMk();cur=c0;e.hc=TWHC[k];e.twb=1;return e}
function twInit(bMk){G8.bn=99;V9.bn=99;P.x=2585;
  for(const k of TWL[TWF].slice(1)){const c0=cur;cur=TWHC[k];const e=bMk();cur=c0;e.hc=TWHC[k];e.twb=1;
    e.gy=e.y;e.dm=LDM*STK().atk;e.def=B.def;{const L=bLate(cur);e.hp=e.max=Math.round(e.max*L.hp);e.dm*=L.atk}e.star=LVSTAR;twPost(e);
    {const f=szF(e.k,1);if(f>1){const gap=GY-(e.y+e.h);e.w=Math.round(e.w*f);e.h=Math.round(e.h*f);e.y=GY-gap-e.h;e.gy=e.y;e.bsz=f}}
    e.x=Math.round(2810-e.w/2);e.f=-1;E.push(e)}
  banner('暗黑炼狱 · 第 '+TWF+' 层:'+twFl(TWF))}
// 每帧(update):各首领原关卡的场上机关
function twStep(dt){for(const e of twHcs())twAs(e,()=>{const f=TWLS[e.hc];if(f)f()(dt);if(e.hc>=8&&e.hc<=10)nbStep(dt)})}
function twBack(){for(const e of twHcs())if(e.hc==8)twAs(e,g8Back)}
function twFx(){for(const e of twHcs())twAs(e,()=>{const f=TWFX[e.hc];if(f)f()();if(e.hc>=8&&e.hc<=10)nbFx()})}
function twOver(){for(const e of twAll()){if(e.hc==6)twAs(e,blizDraw);if(e.hc==9)twAs(e,()=>VOL9.hud());
    if(e.hc==5&&e.stm>0){const k=e.stm,t=performance.now()/1000;x.fillStyle='rgba(222,160,60,'+.38*k+')';x.fillRect(0,0,VW,VH);x.fillStyle='rgba(255,236,190,'+.5*k+')';for(let i=0;i<28;i++)x.fillRect(((i*97+t*520)%(VW+80))-80,(i*37)%GY,40+(i%3)*20,2)}}}  // 沙渊古神的沙暴(原来只在第五关画)
const twDE=e=>e.twb&&isTw(cur)?twAs(e,()=>drawE(e)):drawE(e);
// 首领倒下(update 里代替普通关卡的通关流程)
// 第六十九轮(用户):每层宝箱里的东西都先掉在地上(和首领掉落一样落地 1.5 秒后飞到身上);TWGD[i] 对应 537 ASTRR[i],击杀点没有实物,照旧直接加
const TWGD=[()=>({k:'stn',lv:1,q:0,n:3}),()=>({k:'stn',lv:2,q:0,n:2}),()=>({k:'stn',lv:3,q:0,n:1}),()=>({k:'stn',lv:4,q:0,n:1}),()=>({k:'add',n:1}),()=>({k:'gc',id:'b360',n:1}),()=>({k:'ats',it:atsNew(2)}),()=>({k:'gc',id:'wash',n:1}),()=>({k:'luck',n:1}),null];
let TWA=0;const TWAT=3.5;  // 第五十七轮(用户):打完自动进下一层(TWA 倒计时,期间掉落物飞到身上)
function twChk(dt){if(DNA>0){DNA-=dt;if(DNA<=0&&st=='play')dncGo('play')}  // 第六十四轮:第 30 层通关 → 庆功舞(573)
  if(endT&&TWA>0){TWA-=dt;if(TWA<=0){TWA=0;pickUp(1);twNext()}return}if(!bossOn||endT||B.hp>0)return;
  sfxStop(B.sh);sfxStop(B.gl);reward(B);
  const n=E.find(e=>e.twb&&e.hp>0);if(n){E.splice(E.indexOf(n),1);B=n;sfxAll();return}  // 还有一个:换成 B 接着打
  endT=-1;CLRP=TWF>=TWOPEN?1:0;if(TWF<TWOPEN)TWA=TWAT;sfxAll();B.sh=null;B.gl=null;sfx('win');F=[];TOR=[];LCK=null;twClean();if(isC4()){c4Tw();return}
  {const g=kpGain(Math.round((KPCL+KPLV*16)*(1+(STK().gd-1)*.5)));KP+=g;tx('+'+g+' 击杀点'+(isVip()?'(VIP)':''),P.x-14,P.y-76,'#ff8787')}
  const S=stats();P.hp=Math.min(S.hp,P.hp+S.hp*TWHL);P.mp=Math.min(S.mp,P.mp+S.mp*TWHL);VFX.spawn('radiant-heal',P.x+12,P.y+P.h,{s:1.3});tx('生命 / 魔力大量回复',P.x-30,P.y-48,'#69db7c');
  const n2=3+(Math.random()<.5?1:0),got=[];for(let i=0;i<n2;i++){const j=Math.random()*ASTRR.length|0,r=ASTRR[j],d=TWGD[j];if(d)gdDrop(B,d());else r[1]();got.push(r[0])}if(TWF>=8||Math.random()<.3){gdDrop(B,{k:'stn',lv:4,q:0,n:1});got.push('普通 Lv4 强化石 ×1')}sfx('coin');  // 第六十一轮:Lv4 强化石
  say('🎁 第 '+TWF+' 层的宝箱:'+got.join('、'));got.forEach((g,i)=>tx('🎁 '+g,P.x-40,P.y-90-i*14,'#ffe066'));
  if(TWF==16||TWF==30){let n3=0;for(let i=0;i<M2NN;i++)if(Math.random()<M2DR*DBLK()){gdDrop(B,{k:'eq',it:m2Gen()});n3++}if(n3)say('✨ 第 '+TWF+' 层首领掉落了 '+n3+' 件大师二阶装备!')}  // 第五十七轮:大师二阶
  R19.twr=Math.max(R19.twr|0,TWF);save();ttlChk();if(TWF>=TWNF)DNA=2.5;  // 第六十二轮:第 20 / 30 层称号
  banner('第 '+TWF+' 层通关!'+(TWF<TWOPEN?Math.round(TWAT)+' 秒后自动进入第 '+(TWF+1)+' 层':'目前开放的 '+TWOPEN+' 层全部通关!'));P.grab=0;P.frz=0;P.slw=P.sand=0;P.ps=0}
function c4Tw(){const S=stats();P.hp=Math.min(S.hp,P.hp+S.hp*TWHL);P.mp=Math.min(S.mp,P.mp+S.mp*TWHL);VFX.spawn('radiant-heal',P.x+12,P.y+P.h,{s:1.3});tx('生命 / 魔力大量回复',P.x-30,P.y-48,'#69db7c');
  R19.tw4=Math.max(R19.tw4|0,TWF);save();ttlChk();if(TWF>=TWNF)DNA=2.5;
  banner('四星 · 第 '+TWF+' 层通关!'+(TWF<TWOPEN?Math.round(TWAT)+' 秒后自动进入第 '+(TWF+1)+' 层':'三十层四星全部通关!'));P.grab=0;P.frz=0;P.slw=P.sand=0;P.ps=0}
function twClean(){E=E.filter(e=>!e.sum&&!e.twb);dmClr();f16Clr();n18Clr();a19Clr();a20Clr();i21Clr();NB=nbNew();G8.cr=[];G8.hd=[];G8.cl=[];G8.ds=[];G8.vis=0;G8.flk=0;V9.pl=[];V9.rw=[];V9.cz=[];V9.fp=[];V9.ch=null;V9.gp=null;P.heat=0;P.ovh=0;P.burn=0;P.cryT=0;mkClr();c15Clr()}
// 通关页「前往下一层」:生命 / 魔力保留
function twNext(){if(TWF>=TWOPEN)return;const hp=P.hp,mp=P.mp;TWF++;init();st='play';lvT=performance.now();P.hp=Math.min(P.hp,hp);P.mp=Math.min(P.mp,mp)}
const twBgm=()=>{const k=TWL[TWF]&&TWL[TWF][0];return 'bgm'+(TWHC[k]||21)+'b'};
// 第二个首领的血条(在主血条下面)
function twHud(){if(!bossOn)return;const L=E.filter(e=>e.twb&&e.hp>0);if(!L.length)return;const px=PUI.on(),bx=250,bw=300;
  L.forEach((e,i)=>{const by=40+i*16;if(px)PUI.bar(x,'bA',bx-6,by+1,bw+12,e.hp/e.max,['#ffb08a','#e8590c','#8a3414']);else{RR(x,bx,by+4,bw,8,4,'#120d18',0);RR(x,bx,by+4,bw*e.hp/e.max,8,4,LG(x,0,by+4,0,by+12,['#ffb08a','#e8590c','#8a3414']),0)}
    CT('👑 '+twNm(e.k),bx+8,by+11,9,'#fff3bf','left',2.4,'#1e1829')})}

// ===== 选层页 st = 'twr' =====
let TWS={s:1};
const TWX=168,TWY=46,TWW=72,TWH=48,TWG=6;
const twTop=()=>Math.min(TWOPEN,(R19.twr|0)+1),twOk=f=>f<=twTop();
function openTwr(){st='twr';msgU=0;keys.l=keys.r=0;ah=ar=0;TWS.s=twTop()}
const TWDB=[478,6,100,24],TW4B=[10,6,150,24];  // TW4B:第六十六轮「四星」开关  // 第六十四轮:「重看庆功舞」按钮
function twHit(mx,my){if(mx>582&&mx<622&&my>4&&my<32)return 'x';if(c4Open()&&mx>=TW4B[0]&&mx<=TW4B[0]+TW4B[2]&&my>=TW4B[1]&&my<=TW4B[1]+TW4B[3])return '4';if((R19.twr|0)>=TWNF&&mx>=TWDB[0]&&mx<=TWDB[0]+TWDB[2]&&my>=TWDB[1]&&my<=TWDB[1]+TWDB[3])return 'd';for(let f=1;f<=TWNF;f++){const i=f-1,X=TWX+(i%6)*(TWW+TWG),Y=TWY+Math.floor(i/6)*(TWH+TWG);if(mx>=X&&mx<=X+TWW&&my>=Y&&my<=Y+TWH)return f}return -1}
function twGo(f){if(f>TWOPEN){say('第 '+f+' 层还没有开放');return}if(!twOk(f)){say('先打通第 '+(f-1)+' 层');return}const s=C4M&&c4Open()?4:2;TWF=f;LVS={i:TW0-1,s,m:0};enterLv(TW0,s)}
function twClick(mx,my){const h=twHit(mx,my);if(h=='x'){st='map';MPG=1;return}if(h=='d'){dncGo('twr');return}if(h=='4'){c4Tog();return}if(h>0){TWS.s=h;twGo(h)}}
function twKey(e){const k=e.key;if(k=='Escape'){st='map';MPG=1;return}if(e.repeat)return;const n=TWNF;if(k=='4'){c4Tog();return}
  if(KM[k]=='l')TWS.s=(TWS.s+n-2)%n+1;else if(KM[k]=='r')TWS.s=TWS.s%n+1;else if(k=='ArrowUp')TWS.s=(TWS.s+n-7)%n+1;else if(k=='ArrowDown')TWS.s=(TWS.s+5)%n+1;else if(k=='Enter'||k==' ')twGo(TWS.s)}
function drawTwr(){const t=performance.now()/1000,px=PUI.on(),hv=twHit(MX_,MY_);drawMap2(t);x.fillStyle='rgba(4,10,8,.96)';x.fillRect(0,0,VW,VH);
  if(px)PUI.ns(x,'tD1',12,8,14,9,170,4,300,26);else RR(x,170,4,300,26,13,LG(x,0,4,0,30,['#2b8a3e','#0b3d16']),1.8);CTG('暗黑炼狱 · 三十层宝塔',320,23,14);
  if(px)PUI.ns(x,'pC',6,6,6,6,586,6,32,24);else RR(x,586,6,32,24,6,'#1f2a24',1.4);CT('✕',602,23,14,hv=='x'?'#fff':'#ffd43b','center',0);
  // 左边:地图插画里的绿光宝塔(用户附图那一块)
  if(MAPI2.I){const I=MAPI2.I,sx=I.width/1125,sy=I.height/633;x.imageSmoothingEnabled=true;if(px)PUI.ns(x,'pC',6,6,6,6,10,40,148,280);x.drawImage(I,540*sx,0,170*sx,420*sy,16,46,136,268);
    x.save();x.globalCompositeOperation='lighter';x.fillStyle='rgba(80,255,120,'+(.06+.04*Math.sin(t*3))+')';x.fillRect(16,46,136,268);x.restore()}
  CT('最高:第 '+(R19.twr|0)+' 层',84,334,10,'#b2f2bb','center',2.4,'#08200e');if(R19.tw4)CT('四星最高:第 '+R19.tw4+' 层',84,348,9,'#e599f7','center',2.4,'#08200e');
  if(c4Open())c4Btn(TW4B,hv=='4',t,0,1);
  if((R19.twr|0)>=TWNF){const [X,Y,W,H]=TWDB;if(px)PUI.ns(x,'pC',6,6,6,6,X,Y,W,H);else RR(x,X,Y,W,H,6,'#16201a',1.4);CT('重看庆功舞',X+W/2,Y+17,11,hv=='d'?'#fff':'#ffd43b','center',2.4,'#08200e')}
  for(let f=1;f<=TWNF;f++){const i=f-1,X=TWX+(i%6)*(TWW+TWG),Y=TWY+Math.floor(i/6)*(TWH+TWG),op=f<=TWOPEN,ok=twOk(f),dn=f<=(R19.twr|0),on=TWS.s==f||hv===f,cx=X+TWW/2;
    if(px)PUI.ns(x,'pC',6,6,6,6,X,Y,TWW,TWH);else RR(x,X,Y,TWW,TWH,6,'#16201a',1.4);
    if(!ok){x.fillStyle='rgba(0,0,0,.45)';x.fillRect(X+3,Y+3,TWW-6,TWH-6)}
    CT('第 '+f+' 层',cx,Y+17,11,!op?'#5c5f66':ok?'#d3f9d8':'#868e96','center',2.4,'#08200e');
    if(!op)CT('尚未开放',cx,Y+34,8,'#5c5f66','center',2,'#08200e');
    else{const L=TWL[f];L.forEach((k,j)=>CT(twNm(k),cx,Y+30+j*10,7,ok?'#ffd8a8':'#868e96','center',2,'#1a0808'));if(dn)CT('✓',X+TWW-8,Y+12,10,'#69db7c','center',2,'#08200e');else if(!ok)CT('🔒',X+9,Y+12,8,'#adb5bd','center',0)}
    if(on){x.save();x.strokeStyle=TWS.s==f?'rgba(105,219,124,'+(.7+.3*Math.sin(t*6))+')':'rgba(220,255,220,.5)';x.lineWidth=TWS.s==f?3:1.5;x.strokeRect(X+1.5,Y+1.5,TWW-3,TWH-3);x.restore()}}
  if(C4M&&c4Open())CT('四星:伤害按最大生命 %,装备 / 等级不起作用 · 每层 '+C4Q+' 瓶生命药水 · 没有宝箱 / 积分 / 称号,只记四星最高层',400,322,8,'#f3d9fa','center',2,'#08200e');else
  CT('每层掉落 3~4 件星界财宝里的宝物 · 打通一层回复大量生命 / 魔力 · 首领强度 = 二星焚天炎君,第 17 层起逐层变强',400,322,8,'#d3f9d8','center',2,'#08200e');
  CT('打通第 20 层:称号「恶魔之王」'+(ttlHas('dk')?' ✅':'')+' · 打通第 30 层:称号「地狱之王」'+(ttlHas('hk')?' ✅':''),400,334,8,'#ffd8a8','center',2,'#08200e');
  CT('点击层数挑战(从这一层往上闯)· Esc 返回地图',400,346,8,'#fff','center',2.2,'#08200e');
  if(performance.now()<msgU)CT(msg,400,312,11,'#ffe3e3','center',2.6,'#7a1f1f')}
