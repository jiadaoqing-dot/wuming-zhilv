// ===== 第四十轮:上帝卡牌(神秘副本 2 首领 25% 掉落,两张随机一张)=====
// gc1 暴击升级:2 小时内暴击率 +25%、暴击伤害 +20%(crdgP / critK)· gc2 来个好伙计:2 小时内第一张地图十个首领里随机一个(50 级)变成打手,关卡里跟着主角打怪(palStep / palDraw)
// 第四十一轮:只在关卡里扣时间(godTick,update 里);存档 R19.god = {cr 剩余毫秒, pal 剩余毫秒, pk 哪个首领 1~10}(旧存档的到期时间在 godOf 里换算)
const GODT=2*3600000,GODDR=.25,PALK=.8,PALN=['铁角牛魔','面具法师','金色蛇王','黑棘巨蝎','沙渊古神','北极熊','血月巫王','怨婴·银太郎','熔狱魔神','归蝇'];
function godOf(){const G=R19.god||(R19.god={cr:0,pal:0,pk:0});for(const k of ["cr","pal"])if(G[k]>1e12)G[k]=Math.max(0,G[k]-Date.now());return G}
function godTick(dt){const G=godOf();for(const k of ["cr","pal"])if(G[k]>0)G[k]=Math.max(0,G[k]-dt*1000)}
function godOn(k){return godOf()[k]>0}
function godLeft(k){const s=Math.max(0,Math.ceil(godOf()[k]/1000));return Math.floor(s/3600)+':'+String(Math.floor(s/60)%60).padStart(2,'0')+':'+String(s%60).padStart(2,'0')}
// 好伙计:用选关卡片上的首领像素形象(lvsBoss)缩小画;跟在主角身后,300 像素内有敌人就走过去打,每 1.1 秒一下(伤害 = 主角攻击 × PALK,走 sDeal 不加连击)
let PAL=null;
function palInit(){const G=godOf();PAL=godOn('pal')&&G.pk?{k:G.pk,x:P.x-40,f:1,cd:1,at:0,tg:null}:null}
function palStep(dt,all){if(!PAL)return;if(!godOn('pal')){PAL=null;return}const p=PAL;p.cd-=dt;p.at=Math.max(0,p.at-dt);
  const t=p.tg&&p.tg.hp>0&&!p.tg.ug&&all.includes(p.tg)?p.tg:(p.tg=nearE(all,P.x+12,P.y+16,300));
  const gx=t?t.x+t.w/2-sgn(t.x+t.w/2-p.x)*(t.w/2+24):P.x+12-P.f*46,d=gx-p.x;if(Math.abs(d)>6){p.f=sgn(d);p.x+=sgn(d)*Math.min(Math.abs(d),(Math.abs(d)>200?320:160)*dt)}
  if(Math.abs(P.x+12-p.x)>440)p.x=P.x+12-P.f*46;p.x=Math.max(10,Math.min(WW-10,p.x));
  if(t&&Math.abs(t.x+t.w/2-p.x)<t.w/2+50&&p.cd<=0){p.cd=1.1;p.at=.3;p.f=sgn(t.x+t.w/2-p.x)||p.f;sDeal(t,Math.max(1,Math.round(stats().atk*PALK*rnd(.9,1.1))));VFX.spawn('m-claw',t.x+t.w/2,t.y+t.h/2,{f:p.f,s:1.6})}}
function palDraw(){if(!PAL)return;const p=PAL,t=performance.now()/1000,sx=p.x-cam;if(sx<-90||sx>VW+90)return;E_(x,sx,GY+1,22,4,'rgba(0,0,0,.3)',0);
  x.save();x.translate(Math.round(sx+(p.at>0?p.f*6:0)),GY);x.scale(p.f*.8,.8);try{lvsBoss(p.k,0,0,t)}catch(err){}x.restore();CT('好伙计 · '+PALN[p.k-1],sx,GY-86,7,'#ffe066','center',2,'#1e1829')}
function godHud(){const L=[];if(godOn('cr'))L.push('暴击升级 '+godLeft('cr'));if(godOn('pal'))L.push('好伙计 '+godLeft('pal'));L.forEach((s,i)=>CT('上帝卡牌 · '+s,8,96+i*11,8,'#ffe066','left',2,'#1e1829'))}
// ===== 第四十一轮:怪物技能石(关卡首领 20% 掉落,每个首领一种;神秘副本的首领不掉)=====
// 第四十二轮(用户):背包里左键点技能石 → 选「嵌入剑 / 嵌入法杖」;每把武器嵌 1 颗(存在武器上 it.mss,嵌入时消耗 1 颗,换下 / 取下的放回背包),两把武器各自蓄力(MSTC[剑 / 法杖]),N 放当前武器上的那颗
// 旧存档 R19.mse(只能装 1 颗、不消耗)在 msMig 里换成嵌在剑上
// 蓄力:主角自己的攻击每命中一次 +1(每 0.1 秒最多 1 次,召唤物 / 宠物 / 时装的伤害不算),攒满 MSCN 次后按 N:
//   身后浮现那个首领的虚影(选关卡片上的像素形象),放一次它的招牌技能;伤害 = 主角攻击 × 倍率,不加连击、不再蓄力。进关卡时蓄力清零
// MSS[关卡 cur] = [首领, 技能名, 说明, 类型, 倍率, 参数, 特效]
const MSCN=40,MSDR=.2;
const MSS={1:['铁角牛魔','跃起震地','以自己为中心 260 像素内的敌人受到 攻击×8 的伤害并眩晕 1 秒','aoe',8,260,'earth-rupture'],
 2:['面具法师','暗影雷雨','屏幕里最近的 6 个敌人各挨一道暗影雷,每道 攻击×3','multi',3,6,'m-bolt'],
 3:['金色蛇王','毒雨','面前 360 像素留下毒雾 4 秒,里面的敌人每 0.4 秒受到 攻击×0.8','zone',.8,360,'b-gas'],
 4:['黑棘巨蝎','连环毒针','最近的敌人连中 5 针,每针 攻击×2.5','chain',2.5,5,'b-vsplash'],
 5:['沙渊古神','沙渊触手','面前一排钻出 5 根触手,每根 攻击×3','line',3,5,'void-implosion'],
 6:['北极熊','暴风雪','屏幕里的敌人 3 秒内每 0.3 秒受到 攻击×0.6','storm',.6,10,'v-ring'],
 7:['血月巫王','血月法球','8 颗法球砸向屏幕里的敌人,每颗 攻击×2','multi',2,8,'b-orb'],
 8:['怨婴·银太郎','百鬼哭夜','屏幕里所有敌人眩晕 2 秒并受到 攻击×3','stunall',3,2,'x-midnight'],
 9:['熔狱魔神','火山爆发','面前落下 8 颗陨石,每颗砸中 攻击×3(小范围)','meteor',3,8,'warm-explosion'],
 10:['归蝇','黑翼俯冲','虚影从屏幕一边冲到另一边,屏幕里的敌人受到 攻击×6','dash',6,0,'v-wing'],
 14:['钢铁暴君','导弹齐射','10 枚导弹砸向屏幕里的敌人,每枚 攻击×2.5(小范围)','meteor',2.5,10,'x-boom'],
 15:['夜王','王威震慑','屏幕里所有敌人眩晕 2.5 秒并受到 攻击×4','stunall',4,2.5,'mass-release'],
 16:['焚天炎君','陨火雨','10 颗火球砸向屏幕里的敌人,每颗 攻击×2.8(小范围)','meteor',2.8,10,'warm-explosion']};  // 第四十二轮
for(const k in MSS){const d=MSS[k];MISC['ms'+k]=['怪物技能石 · '+d[0],`在背包里左键点它,选择嵌入剑、法杖或拳套(每把武器嵌 1 颗,各自蓄力)。用嵌着它的武器攻击敌人蓄力 ${MSCN} 次后按 <b>N</b>:召唤「${d[0]}」的虚影放出「${d[1]}」——${d[2]}。${k<=10?'第 '+k+' 关':'第 '+(k-3)+' 关'}首领 ${MSDR*100}% 掉落。`,'',0];MENI.P['ms'+k]=41}
let MSTC={sword:0,staff:0,fist:0},MSCT=0,MSQ=[],MSG=null,MSH=null,MSV=null;  // MSH / MSV = 灿灿技能石的黑洞 / 无敌空间(第四十七轮)  // 两把武器各自的蓄力次数 / 上次蓄力时间 / 排队的伤害事件 / 虚影
function msMig(){if(!R19.mse)return;const id=R19.mse,w=EQ.sword;R19.mse='';if(w&&!w.mss&&MAT[id]>0){w.mss=id;MAT[id]--}}
const msOf=it=>it&&it.mss&&MSS[it.mss.slice(2)]?MSS[it.mss.slice(2)]:null;
const msOn=()=>{msMig();return msOf(EQ[P.mode])};
function msEquip(id,sl){msMig();if(!sl)return '在背包里左键点技能石,选择嵌入剑、法杖或拳套';const w=EQ[sl];if(!w)return '还没有装备'+SL[sl][0];if(!(MAT[id]>0))return '';if(w.mss==id)return '这把'+SL[sl][0]+'已经嵌着它了';
  const old=w.mss;MAT[id]--;if(old)MAT[old]=(MAT[old]|0)+1;w.mss=id;MSTC[sl]=0;sfx('fuse');save();return '💎 '+MISC[id][0]+' 嵌入了'+SL[sl][0]+(old?'(换下的「'+MISC[old][0]+'」放回了背包)':'')+':用'+SL[sl][0]+'攻击敌人蓄力 '+MSCN+' 次后按 N 释放'}
function msOff(it){if(!it||!it.mss)return '';const id=it.mss;delete it.mss;MAT[id]=(MAT[id]|0)+1;for(const k in MSTC)if(EQ[k]===it)MSTC[k]=0;return '取下了 '+MISC[id][0]+',放回背包'}
function mscAdd(){const s=P.mode;if(!msOn()||st!='play'||MSTC[s]>=MSCN||GT-MSCT<.1)return;MSCT=GT;MSTC[s]++;if(MSTC[s]>=MSCN){tx('技能石蓄力完成!按 N',P.x-30,P.y-40,'#ffe066');sfx('buff')}}
const msTg=()=>allTg().filter(e=>e.x+e.w>cam&&e.x<cam+VW),msAt=m=>Math.max(1,Math.round(stats().atk*m*rnd(.9,1.1)));
const msAfter=(t,f)=>MSQ.push({t,f});
// 第六十九轮修:循环特效(第八关 x-midnight 等)不设 life 会一直留在画面上,技能石的特效统一按 1.2 秒收掉
const msFx=(k,x0,y0,o)=>{const m=VFX.M&&VFX.M[k];return VFX.spawn(k,x0,y0,Object.assign(m&&m.loop?{life:1.2}:{},o))};
function mscCast(){const d=msOn(),s=P.mode;if(!d){tx('当前武器没有嵌入怪物技能石',P.x-30,P.y-30,'#adb5bd','m');return}if(MSTC[s]<MSCN){tx('技能石蓄力 '+MSTC[s]+' / '+MSCN,P.x-30,P.y-30,'#adb5bd','m');return}
  MSTC[s]=0;const n=+EQ[s].mss.slice(2),[nm_,sk,,ty,m,a,fx]=d,f=P.f,cx=P.x+12;MSG={n,t:0,x:cx-f*46,f};banner(nm_+' · '+sk);sfx('buff');flash('230,210,255',.2);
  const hit=(e,k,v)=>{if(!e||e.hp<=0||e.ug)return;msFx(k||fx,e.x+e.w/2,e.y+e.h/2,{f,s:1.4});sDeal(e,msAt(v||m))};
  const boom=(px,r)=>{msFx(fx,px,GY-14,{s:1.5});shake=Math.max(shake,.15);for(const e of msTg())if(Math.abs(e.x+e.w/2-px)<e.w/2+r)sDeal(e,msAt(m))};
  if(ty=='aoe')msAfter(.45,()=>{msFx(fx,cx,GY,{s:2.2});shake=.4;for(const e of allTg())if(Math.abs(e.x+e.w/2-cx)<a+e.w/2){sDeal(e,msAt(m));bigStun(e,1)}});
  else if(ty=='multi'){const L=msTg().sort((p,q)=>Math.abs(p.x-cx)-Math.abs(q.x-cx));for(let i=0;i<a;i++){const e=L[i%Math.max(1,L.length)];if(e)msAfter(.4+i*.12,()=>hit(e))}}
  else if(ty=='chain'){for(let i=0;i<a;i++)msAfter(.4+i*.15,()=>{const e=msTg().sort((p,q)=>Math.abs(p.x-cx)-Math.abs(q.x-cx))[0];hit(e)})}
  else if(ty=='line'){for(let i=0;i<a;i++)msAfter(.4+i*.1,()=>boom(cx+f*(60+i*70),40))}
  else if(ty=='meteor'){for(let i=0;i<a;i++)msAfter(.4+i*.13,()=>{const L=msTg(),e=L.length?pick(L):null;boom(e?e.x+e.w/2:cx+f*rnd(60,360),50)})}
  else if(ty=='zone'){const x0=f>0?cx:cx-a;for(let i=0;i<10;i++)msAfter(.4+i*.4,()=>{msFx(fx,x0+rnd(20,a-20),GY-20,{s:1.4});for(const e of msTg())if(e.x+e.w>x0&&e.x<x0+a)sDeal(e,msAt(m))})}
  else if(ty=='storm'){for(let i=0;i<a;i++)msAfter(.4+i*.3,()=>{msFx(fx,cam+rnd(40,VW-40),rnd(80,GY-40),{s:1.2});for(const e of msTg()){sDeal(e,msAt(m));e.ms=Math.max(e.ms||0,.5)}})}
  else if(ty=='stunall')msAfter(.5,()=>{msFx(fx,cx,P.y+P.h/2,{s:2.6});flash('200,180,255',.3);for(const e of msTg()){sDeal(e,msAt(m));bigStun(e,a)}});
  else if(ty=='hole'){const L=msTg().sort((p,q)=>Math.abs(p.x-cx)-Math.abs(q.x-cx)),e=L[0];MSH={x:e?e.x+e.w/2:cx+f*150,y:GY-60,t:-.4,tk:0,m,a};psx('cloud')}  // 第四十七轮:灿灿的技能石(535)
  else if(ty=='inv'){MSV={t:0,T:a};P.inv=Math.max(P.inv,a);psx('buff');flash('110,170,255',.2)}
  else if(ty=='dash')for(let i=0;i<6;i++)msAfter(.3+i*.08,()=>{msFx(fx,cam+(f>0?i:5-i)*VW/5,P.y,{f,s:1.6});if(i==5)for(const e of msTg())sDeal(e,msAt(m))})}
function mscStep(dt){if(MSG){MSG.t+=dt;if(MSG.t>1.6)MSG=null}canMsStep(dt);for(const q of MSQ){q.t-=dt;if(q.t<=0&&!q.d){q.d=1;try{q.f()}catch(err){}}}MSQ=MSQ.filter(q=>!q.d)}
function mscDraw(){canMsDraw();if(!MSG)return;const g=MSG,t=performance.now()/1000,a=g.t<.3?g.t/.3:g.t>1.2?Math.max(0,(1.6-g.t)/.4):1;x.save();x.globalAlpha=.75*a;x.translate(Math.round(g.x-cam),GY);x.scale(g.f*.8,.8);try{lvsBoss(g.n,0,0,t)}catch(err){}x.restore()}
// 第四十六轮(用户):蓄力显示移到左上状态栏下面(金币右边),不写数字:三个从小到大的菱形格(PUI 图集 dia0 缩小 + 染色),
// 没蓄到的是白色,蓄到的变紫(当前那格按进度从左往右变紫);蓄满后后面出现紫色的 N
const MSHC={};
function msCell(sz,col){const k=sz+col;if(MSHC[k])return MSHC[k];const c=document.createElement('canvas');c.width=c.height=sz;const g=c.getContext('2d'),[sx,sy,sw,sh]=PUI.M.dia0;
  g.imageSmoothingEnabled=true;g.drawImage(PUI.I,sx,sy,sw,sh,0,0,sz,sz);g.globalCompositeOperation='source-atop';g.fillStyle=col;g.fillRect(0,0,sz,sz);return MSHC[k]=c}
function mscHud(){const d=msOn();if(!d||st!='play'||!PUI.I)return;const c=MSTC[P.mode],ok=c>=MSCN,W='rgba(255,255,255,.72)',V='rgba(174,62,230,.68)',cy=72;let gx=102;
  for(let i=0;i<3;i++){const sz=10+i*2,y0=Math.round(cy-sz/2),f=Math.max(0,Math.min(1,c/MSCN*3-i));x.drawImage(msCell(sz,W),gx,y0);
    if(f>0){const w=Math.max(1,Math.round(sz*f));x.drawImage(msCell(sz,V),0,0,w,sz,gx,y0,w,sz)}gx+=sz+3}
  if(ok)CT('N',gx+4,cy+5,12,'#cc5de8','center',2,'#1e1829')}
// 幸运宝石:useLk = 选中的档次 1 低级 / 2 中级 / 3 高级(高级 = 原来的高级幸运石 LUCK)
const LKS=[null,['lk1','低级幸运宝石',.25],['lk2','中级幸运宝石',.35],['luck','高级幸运宝石',.5]];
const lkHave=i=>i==3?LUCK:MAT[LKS[i][0]]|0,lkB=()=>useLk&&lkHave(useLk)>0?LKS[useLk][2]:0,lkUse=i=>{if(i==3)LUCK--;else MAT[LKS[i][0]]--};
// NPC 好感:送小礼袋 +1,满 AFFNEED 每天可领一次奖励
const AFFMX=999,AFFNEED=50;
const AFFR={'村长':['双倍爆率卡 ×1',()=>{MAT.dbl=(MAT.dbl|0)+1}],'技能导师':['技能点 ×1',()=>{sp++}],'药剂师':['超级生命药水 ×1(回复 30% 生命,冷却 20 秒)',()=>{POT.hp4=(POT.hp4|0)+1}],'装备商人':['金币 ×5000',()=>{gold+=5000}],'强化师':['普通 Lv2 强化石 ×1 · 合成添加剂 ×1',()=>{STN[2][0]++;MAT.add=(MAT.add|0)+1}],'仓库管理员':['合成添加剂 ×1',()=>{MAT.add=(MAT.add|0)+1}]};  // 第四十一轮:桂婶
const affOf=n=>R19.aff[n]||(R19.aff[n]={v:0,d:''});
function giftBox(n,a){if(st!='town')return '';const f=affOf(n),g=MAT.gift|0,dn=f.d==today();a=a||'p';
  return `<div class="row gfb">❤️ <b>${n}的好感度 ${f.v} / ${AFFMX}</b><span class="tag">送 1 个小礼袋 +1(持有 ${g})</span><button data-${a}="gv1|${n}" ${g&&f.v<AFFMX?'':'disabled'}>送 1 个</button><button data-${a}="gv10|${n}" ${g>=10&&f.v+10<=AFFMX?'':'disabled'}>送 10 个</button><span class="tag" style="margin-left:auto">好感 ≥ ${AFFNEED} 每天可领:${AFFR[n][0]}</span><button data-${a}="grw|${n}" ${f.v>=AFFNEED&&!dn?'':'disabled'}>${dn?'今天已领取':'🎁 领取'}</button></div>`}
function giftAct(r){if(!/^g(v1|v10|rw)\|/.test(r))return null;const [a,n]=r.split('|');if(!AFFR[n])return '';const f=affOf(n);
  if(a=='grw'){if(f.v<AFFNEED)return '好感度还不够 '+AFFNEED;if(f.d==today())return '今天已经领过了,明天再来';if(timeBad())return TBMSG;if(n=='药剂师'&&potTot()>=POTMAX)return '药水背包满了,先腾出 1 格';AFFR[n][1]();f.d=today();sfx('coin');save();return '🎁 '+n+'送给你:'+AFFR[n][0]}
  const k=Math.min(a=='gv10'?10:1,MAT.gift|0,AFFMX-f.v);if(k<=0)return '';MAT.gift-=k;f.v+=k;sfx('buff');save();return '❤️ 送给'+n+' '+k+' 个小礼袋,好感度 '+f.v}
// 属性石镶嵌(熔炉):GSEL.e = 选中的装备位置(b序号 / e:部位),GSEL.s = 选中的属性石序号,GSEL.ok = 替换旧石头的二次确认
function rGem(){const it=itOf(GSEL.e),g=R19.ats[GSEL.s],pk=(q,r)=>`<button class="pk${GSEL.e==r?' on':''}" data-p="gE${r}" style="border-color:${TR[q.tier][1]}" title="${nm(q)}">${eqImg(q)}${q.en?'<sup>+'+q.en+'</sup>':''}${q.gem?'<i class="tm" style="background:'+ATSQ[q.gem.q].c+'">◆</i>':''}</button>`;
  let h=`<h4>属性石镶嵌</h4><div class="tag">每件装备只能镶嵌 1 颗属性石,新镶嵌的会替换掉旧的(旧的消失);属性石不能拆下,出售装备也不会返还。属性石的数值是蓝字,不受强化加成。</div>`;
  h+=`<div class="row" style="border:0"><span class="tag">已穿戴</span>${ALL.map(k=>EQ[k]?pk(EQ[k],'e:'+k):'').join('')}<span class="tag">背包</span>${BAG.map((q,i)=>pk(q,'b'+i)).join('')||'<span class="tag">空</span>'}</div>`;
  h+=`<div class="row" style="border:0">${R19.ats.map((q,i)=>`<button class="pk${GSEL.s==i?' on':''}" data-p="gS${i}" style="border-color:${ATSQ[q.q].c}" title="${ATSQ[q.q].n}:${atsTxt(q)}">${mniEm('A'+q.q)}</button>`).join('')||'<span class="tag">没有属性石(首领掉落,或在 🏪 商城用击杀点购买)</span>'}</div>`;
  if(it||g)h+=`<p>${it?`<b style="color:${TR[it.tier][1]}">${nm(it)}</b> ${ST(it)}`:'先选一件装备'}<br>${g?`<b style="color:${ATSQ[g.q].c}">${ATSQ[g.q].n}</b>:${atsTxt(g)}`:'再选一颗属性石'}${it&&g?`<br>${it.gem&&GSEL.ok?'<b style="color:#c92a2a">这件装备已经镶嵌了「'+atsTxt(it.gem)+'」,镶嵌新的会替换掉旧的,确定吗?</b> ':''}<button data-p="gI">${it.gem&&GSEL.ok?'确定替换':'💠 镶嵌'}</button>`:''}</p>`;
  return h}
function gemSet(){const it=itOf(GSEL.e),g=R19.ats[GSEL.s];if(!it||!g)return '先选一件装备和一颗属性石';if(it.gem&&!GSEL.ok){GSEL.ok=1;return ''}
  it.gem={q:g.q,a:g.a.map(v=>v.slice())};R19.ats.splice(GSEL.s,1);GSEL.s=-1;GSEL.ok=0;sfx('fuse');const S=stats();P.hp=Math.min(P.hp,S.hp);P.mp=Math.min(P.mp,S.mp);save();return '💠 镶嵌成功:'+nm(it)+' '+atsTxt(it.gem)}
// 商城(击杀点):固定货架 + 随机物品栏(3 个货,每天限买 MRMAX 次;每次在商城消费都刷新;合成添加剂、高级幸运宝石只在随机栏出现)
// 第三十七轮(用户:账号练满不该要几百小时):通关击杀点 = (40 + 12 × 关卡) × 星级(一星 1 / 二星 1.3 / 三星 1.7),原来固定 20;击杀点商店、时装翅膀、制作书、材料约降一半
const KPIT={ats0:['低级属性石',120,'随机 1 条属性(攻击 / 生命 / 魔力 / 防御 / 暴击 / 闪避,数值固定为最高值)'],ats1:['中级属性石',180,'随机 2 条属性'],gift:['小礼袋',25,'送给 NPC,好感度 +1'],food:['宠物饲料',5,'钢盔小鸡获得 20% 升级经验'],lk1:['低级幸运宝石',180,'强化成功率 +25%'],lk2:['中级幸运宝石',270,'强化成功率 +35%'],add:['合成添加剂',300,'熔炉合成强化石必需'],lk3:['高级幸运宝石',390,'强化成功率 +50%'],stn4:['普通 Lv4 强化石',600,'强化 +10~+12 用 · 每天限购 10 颗']};
const S4LIM=10;  // 第六十二轮(用户):普通 Lv4 强化石每天限购 10 颗(R19.mr.s4,和随机物品栏一起按天清零)
const KPFIX=['ats0','ats1','gift','food','lk1','lk2','stn4'],KPRND=['add','add','add','lk3','lk3','ats0','ats1','gift','lk1','lk2','food'],MRMAX=3;
function mrRoll(){const L=[];let n=0;while(L.length<3&&n++<200){const k=pick(KPRND);if(!L.includes(k))L.push(k)}R19.mr.L=L}
function mrDay(){if(R19.mr.day!=today()){R19.mr.day=today();R19.mr.n=0;R19.mr.s4=0;mrRoll()}if(!R19.mr.L.length)mrRoll()}
function kpBuy(k,rnd){mrDay();const d=KPIT[k];if(!d)return '';if(KP<d[1])return '击杀点不足';if(rnd&&(R19.mr.n>=MRMAX||!R19.mr.L.includes(k)))return '今天的随机物品栏已经买了 '+MRMAX+' 次,明天再来';if(!rnd&&!KPFIX.includes(k))return '';if(k=='stn4'){if(timeBad())return TBMSG;if((R19.mr.s4|0)>=S4LIM)return '普通 Lv4 强化石每天限购 '+S4LIM+' 颗,今天已经买完了,明天再来'}
  KP-=d[1];KPS+=d[1];let x_='';if(k=='ats0'||k=='ats1'){const g=atsNew(+k[3]);R19.ats.push(g);x_='('+atsTxt(g)+')'}else if(k=='lk3')LUCK++;else if(k=='stn4'){STN[4][0]++;R19.mr.s4=(R19.mr.s4|0)+1}else MAT[k]=(MAT[k]|0)+1;if(rnd)R19.mr.n++;mrRoll();sfx('coin');save();return '购买了 '+d[0]+x_+',放进背包「📦 道具」页 · 随机物品栏已刷新'}
// 第四十三轮:买 n 个(固定货架);每买一个随机物品栏都会刷新,和一个一个买一样
function kpBuyN(k,n){let c=0,m='';for(let i=0;i<Math.max(1,n);i++){const r=kpBuy(k);if(!r.startsWith('购买了')){if(!c)return r;break}c++;m=r}
  return c>1?'购买了 '+KPIT[k][0]+' ×'+c+',放进背包「📦 道具」页 · 随机物品栏已刷新'+(c<n?'('+(k=='stn4'&&(R19.mr.s4|0)>=S4LIM?'今日限购已满':'击杀点不够')+',只买了 '+c+' 个)':''):m}
const kpIc=k=>k=='stn4'?stnEm(4,0):mniEm(k=='ats0'?'A0':k=='ats1'?'A1':k=='lk3'?'luck':k);
const kpHave=k=>k=='stn4'?STN[4][0]:k=='ats0'||k=='ats1'?R19.ats.filter(g=>g.q==+k[3]).length:k=='lk3'?LUCK:MISC[k]?MAT[k]|0:0;
