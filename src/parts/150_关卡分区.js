function hurt(b,o){if(DECOY||GM.god)return false;if(pdChk())return false;if(P.inv>0||(P.sk&&P.sk.inv))return false;const S=stats();
  // 闪避:按闪避率完全躲开这次伤害(不清连击),之后 0.4 秒无敌,避免贴身判定连续触发
  if(Math.random()<S.dg/100){P.inv=.4;tx('闪避成功!',P.x-8,P.y-10,'#a5d8ff');ghost('#a5d8ff',.3);syn('blink');return false}
  let d=dmgIn(b*EATK*BDMK(),S.def);  // BDMK:第八~十关首领战 ×1.35 ×1.35(第十五轮)
  if(P.hshT>0){if(P.hdr)d=Math.max(1,Math.round(d*(1-P.hdr)));if(P.hsh>0){const a=Math.min(P.hsh,d);P.hsh-=a;d-=a;tx('护盾 -'+a,P.x+4,P.y-14,'#ffe8a3');if(d<=0){P.inv=.5;shake=.1;sfx('hit');mfxHit();return true}}}  // 宠物仓鼠的瓜子壳护盾 + 减伤
  if(P.shdT>0&&P.shd>0){const a=Math.min(P.shd,d);P.shd-=a;d-=a;tx('🪨 -'+a,P.x+4,P.y-14,'#e0b984');if(d<=0){P.inv=.5;shake=.1;sfx('hit');mfxHit();return true}}P.hp-=d;mfxHit();P.combo=0;if(P.jk)P.jk=Math.floor(P.jk*.4);{const c=setTr();if(tr6('yu',c)&&st=='play'){const t=nearE(allTg(),P.x+12,P.y+16,320);if(t)xDeal(t,Math.max(1,Math.round(d*YU6)))}}P.inv=o&&o.inv!=null?o.inv:1.2;P.vy=-250;if(o&&o.kb)P.kbx=o.kb;shake=.25;tx('-'+d,P.x+12,P.y-6,'#fff','d');sfx('hurt');  // 第四十二轮:神技 6 件掉 60% 层数 · 圣愈 6 件反伤(第四十五轮修:这段注释原来写在中间,把受击无敌 / 击退 / 伤害数字 / 受击音效都注释掉了)
  // 受击僵直 0.3 秒(和怪物相同);2026-10-13 第十三轮取消连击保护(原来 2.5 秒内第 3 次僵直后 2 秒霸体)。技能给的霸体(P.ar)照旧
  if(!(P.ar>0)&&!(P.sk&&P.sk.id=='mc')){P.stun=HSTUN;if(P.sk&&P.sk.id=='giant'&&!P.sk.formed){burst(P.x+12,P.y-60,24,['#9d4edd','#c77dff'],220,{sh:2,s:5,l:.4,g:300})}P.sk=null}
  return true}
// 减速(蛛丝):移动速度 -40%;沙尘:减速 + 视野变暗
function slowP(t){if(GM.god)return;if(!(P.slw>0))tx('减速!',P.x,P.y-22,'#dee2e6');P.slw=Math.max(P.slw||0,t)}
function sandP(t){if(GM.god)return;P.sand=Math.max(P.sand||0,t);tx('沙尘迷眼!',P.x-10,P.y-22,'#e6cc98')}
// ===== 关卡分区:把关卡切成 4 个区域,当前区域(及之前)的小怪全部击败后,前方的能量屏障才会消失 =====
const ZB=[960,1600,2240,2700];  // 各区域右边界;最后一道在首领场地入口
// 区域推进(2026-10-12):进关只给第一个区域的画面,清完本区域(待刷的和活着的)镜头才能往前;WQ[区域] = 待刷的小怪种类
const WMUL=2.5,WMAX=8;let WQ=[],WT=0,WI=0,WLM=1;
function gateZ(){let z=ZB.length;for(let i=0;i<ZB.length;i++)if(WQ[i]&&WQ[i].length){z=i;break}for(const e of E)if(e.hp>0&&e.zi>=0&&e.zi<z)z=e.zi;return z}
// 按原来的出怪表分区,每区数量 ×2.5(种类轮流);首领场地里的怪(x ≥ 最后一道边界)照旧直接放
function mkWQ(L){const q=ZB.map(()=>[]),rest=[];for(const a of L){const z=ZB.findIndex(b=>a[1]<b);if(z<0)rest.push(a);else q[z].push(a[0])}
  return {q:q.map(ks=>ks.length?Array.from({length:Math.round(ks.length*WMUL)},(_,i)=>ks[i%ks.length]):[]),rest}}
// 刷怪(第二十九轮改):玩家走进这个区域才刷这个区域的怪(其他区域不刷);分两次从天上掉下来:先掉一半,这一半全部打完再掉剩下的
let WB=[];  // 每个区域已经掉了几次
function waveDrop(z,n){const lo=ZB[z-1]||0,hi=ZB[z],q=WQ[z],xs=[];
  for(let i=0;i<n&&q.length;i++){let px,k=0;do{px=rnd(lo+30,hi-70)}while((Math.abs(px-P.x)<100||xs.some(v=>Math.abs(v-px)<34))&&++k<30);xs.push(px);
    const e=mk(q.shift(),px,WLM);E.push(e);if(e.dis)continue;e.air=1;e.avy=0;e.ay0=e.y;e.y-=VH+rnd(0,40);e.hold=i*.12;e.dropIn=1}}  // 伪装的怨灵(dis)照旧悄悄出现
function waveStep(dt){if(st!='play')return;const z=gateZ();if(z>=ZB.length)return;const q=WQ[z];if(!q||!q.length)return;
  if(z>0&&P.x+P.w<ZB[z-1]+20)return;WT-=dt;if(WT>0)return;  // 还没走进这个区域
  const b=WB[z]||0;if(b==0){WB[z]=1;waveDrop(z,Math.ceil(q.length/2));WT=.5;return}
  if(!E.some(e=>e.hp>0&&e.zi==z)){WB[z]=2;waveDrop(z,q.length)}}
const gateX=()=>{const z=gateZ();return z<ZB.length?ZB[z]:1e9};
const xMax=()=>st=='town'?twW()-34:Math.min(cur>=5&&bossOn?ARR-P.w:WW-P.w,gateX()-P.w);
let GZ=0;  // 上一帧的区域编号(屏障消失时提示)
function drawGate(){}  // 第十三轮:关卡里不再显示「清除本区域 · 还剩 N 只怪物」文字牌
// 中毒:持续 t 秒,每 0.5 秒扣除最大生命的 p 比例(无视防御)
function poison(t,p){if(GM.god)return;const on=P.ps>0;if(!on)P.pt=.5;P.pp=on?Math.max(P.pp,p):p;P.ps=Math.max(P.ps||0,t);tx('中毒!',P.x,P.y-22,'#8ce99a')}
// 怪物僵直(2026-10-13 第十三轮):所有怪物(含首领)和玩家一样 0.3 秒;取消连击保护(原来 2 秒内被打僵 4 次 → 霸体反击);hst = 挨打后仰动作计时
const HSTUN=.3;
// 第二十轮:小怪也改用韧性(mobPz),挨打只有后仰动作(hst)、照常掉血、继续往前推进,不再每下都僵直 —— 法师普攻频率高,原来能把小怪钉死在原地
function hitStun(e){if(e.air)e.avy=Math.min(e.avy,-230);e.hst=HSTUN}
// 首领韧性(第十五轮,参考动作游戏常见的 poise / 韧性条做法):首领挨打只有后仰动作、照常掉血,但不再每下都僵直;
// 伤害同时扣韧性池(最大生命 PZK),扣空 = 破韧:僵直 PZST 秒(打穿超过半条 → 大破韧 PZST2 秒),之后连同僵直再加 PZIM 秒免疫韧性伤害
// (免疫期间的伤害不累计,防止连续破韧压制);每次有效命中都会重置回复延迟 PZRD,停手后每秒回复 PZRG 的韧性池
const PZK=.07,PZST=1.1,PZST2=1.8,PZIM=3,PZRD=2.5,PZRG=.25;
function poiseHit(e,dm){if(!e.pzm)e.pzm=e.po=Math.max(50,e.max*PZK);e.prd=PZRD;if(e.pim>0)return;e.po-=dm;
  if(e.po<=0){const big=-e.po>e.pzm*.5,t=big?PZST2:PZST;e.st=Math.max(e.st||0,t);e.pim=t+PZIM;e.po=e.pzm;shake=Math.max(shake,big?.35:.2);ring(e.x+e.w/2,e.y+e.h/2,6,e.w*.8+30,big?'#ffd43b':'#fff',.35,5)}}
// 小怪韧性:池 = 生命上限 × MPZK(同关普攻约 2~3 下打空),打空僵直 MPZST 秒(打穿超过半条 MPZST2),之后连同僵直 MPZIM 秒不再累计;
// 停手 MPZRD 秒后每秒回复 MPZRG。霸体(e.sa)的小怪不吃韧性。击飞 / 苍蓝巨剑 / 冻结等控制技能直接写 e.st,不受影响
const MPZK=.45,MPZST=.45,MPZST2=.8,MPZIM=1.6,MPZRD=1.5,MPZRG=.5;
function mobPz(e,dm){if(e.sa)return;if(!e.pzm)e.pzm=e.po=Math.max(1,(e.hp0||e.hp)*MPZK);e.prd=MPZRD;if(e.pim>0)return;e.po-=dm;
  if(e.po<=0){const t=-e.po>e.pzm*.5?MPZST2:MPZST;e.st=Math.max(e.st||0,t);e.pim=t+MPZIM;e.po=e.pzm}}
// 第四十四轮(用户选 A):首领霸体阶段 —— 生命掉到 70% / 40%(BSAH)时进入 BSAT 秒霸体 + 狂暴:不吃僵直 / 破韧 / 后仰 / 减速 / 击退,动作快 BSAK 倍;
// 一下打穿两条线只触发一次。镜中无名本来就不吃控制,不算。首领血条上的两道刻度 = 霸体线,霸体期间韧性条变成红色闪烁
const BSAT=8,BSAK=1.3,BSAH=[.7,.4];
function bsaStep(e,dt){let n=e.saN|0;if(n<BSAH.length&&e.hp<=e.max*BSAH[n]){while(n<BSAH.length&&e.hp<=e.max*BSAH[n])n++;e.saN=n;e.saT=BSAT;e.pim=0;if(e.pzm)e.po=e.pzm;
    shake=Math.max(shake,.35);flash('255,90,70',.2);ring(e.x+e.w/2,e.y+e.h/2,10,e.w+90,'#ff6b6b',.5,6);burst(e.x+e.w/2,e.y+e.h/2,26,['#ff6b6b','#ff922b','#fff'],260,{sh:1,s:3,l:.5});sfx('buff')}
  if(e.saT>0){e.saT-=dt;e.st=0;e.hst=0;e.sl=0;e.ms=0;e.kbv=0;if(Math.random()<dt*30)pt({x:e.x+rnd(0,e.w),y:e.y+rnd(0,e.h),vx:rnd(-15,15),vy:rnd(-70,-30),c:pick(['#ff6b6b','#ff922b','#c92a2a']),sh:1,s:rnd(2,3.5),l:.45})}}
function poiseStep(e,dt){e.pim=(e.pim||0)-dt;e.prd=(e.prd||0)-dt;if(e.pzm&&e.prd<=0&&e.pim<=0)e.po=Math.min(e.pzm,e.po+e.pzm*(e.max?PZRG:MPZRG)*dt)}
