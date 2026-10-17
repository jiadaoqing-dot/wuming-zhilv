// ===== 第四十八轮:宠物装备(金币商店 10 万一件;宠物身上 PEQN 格,钢盔小鸡或仓鼠出战时生效)=====
// 无尽 inf:暴击率超过 100% 的部分,每 1% 变成宠物伤害 +1% · 汲取 lch:宠物伤害的 1% 回复主角生命 · 怀表 wch:生命掉到 90% 以下时 3 秒不可选取(冷却 PWCD 秒)
// 幸运骰子 dice:每次进关卡摇点数,1~6 点掉落几率 +1 / 2 / 4 / 8 / 16 / 32%(和双倍爆率卡不叠加:开着双倍爆率卡时按 ×2 算)
// 记忆晶片 mem:记录上一趟关卡里放过的技能;回主城后在宠物界面点「模拟战斗」,主角在城里把这些技能重放一遍,下次进那一关伤害 +10%(进关时用掉)
// 图标:MENI 46~50(build_meni.py 第四十八轮追加,7Soul1 CC0)
const PEQD={inf:['无尽','暴击率超过 100% 后,每多出 1% 暴击率,宠物伤害 +1%'],lch:['汲取','宠物造成伤害的 1% 回复无名的生命'],wch:['怀表','无名的生命掉到 90% 以下时,获得 3 秒不可选取状态(冷却 30 秒)'],
  dice:['幸运骰子','每次进入关卡摇一次点数:1 点掉落率 +1%、2 点 +2%、3 点 +4%、4 点 +8%、5 点 +16%、6 点 +32%'],mem:['记忆晶片','记录上一趟关卡里放过的技能;回到主城后在 🐤 宠物界面点「模拟战斗」重放一遍,下次进入那一关伤害 +10%']};
const PEQP=100000,PEQN=3,PWCD=30,DICEV=[1,2,4,8,16,32];
Object.assign(MENI.P,{peq_inf:46,peq_lch:47,peq_wch:48,peq_dice:49,peq_mem:50});
let DICEB=0,MEMR=[],MEMC=-1,MEMB=0,MEMP=null;  // DICEB 本趟骰子加成 · MEMR / MEMC 本趟记录 · MEMB 本趟伤害 +10% · MEMP 主城里正在重放
const peqOwn=k=>R19.peq.own.includes(k),peqOn=k=>R19.peq.on.includes(k)&&(petOn()||hamOn());
const peqInf=()=>peqOn('inf')?Math.max(0,stats().cr-100)/100:0;
function peqBuy(k){if(!PEQD[k]||peqOwn(k))return '';if(gold<PEQP)return '金币不足';gold-=PEQP;R19.peq.own.push(k);if(R19.peq.on.length<PEQN)R19.peq.on.push(k);sfx('coin');save();return '获得宠物装备「'+PEQD[k][0]+'」'+(R19.peq.on.includes(k)?',已经给宠物戴上':',宠物装备格满了,去 🐤 宠物界面更换')}
function peqAct(r){if(r.startsWith('pqb_')){fmsg=peqBuy(r.slice(4));return 1}
  if(r.startsWith('pqe_')){const k=r.slice(4),L=R19.peq.on;if(!peqOwn(k))return 1;if(L.includes(k))R19.peq.on=L.filter(v=>v!=k);else if(L.length<PEQN)L.push(k);else fmsg='宠物装备格只有 '+PEQN+' 个,先卸下一件';save();return 1}
  if(r=='pqsim'){if(!R19.mem.L.length){fmsg='记忆晶片里还没有记录';return 1}closeP();MEMP={i:0,w:.6};say('记忆晶片:开始模拟第'+lvsName(R19.mem.c)+'的战斗');return 1}
  return 0}
// 进关卡 / 回主城
function peqEnter(){DICEB=0;MEMR=[];MEMC=cur;MEMB=0;MEMP=null;
  if(peqOn('dice')){const n=1+Math.floor(Math.random()*6);DICEB=DICEV[n-1]/100;fmsg='';setTimeout(()=>{if(P)tx('🎲 幸运骰子:'+n+' 点 · 掉落率 +'+DICEV[n-1]+'%',P.x-60,P.y-60,'#ffe066')},300)}
  if(peqOn('mem')&&R19.mem.ok===cur){MEMB=1;setTimeout(()=>{if(P)tx('💠 记忆晶片:本关伤害 +10%',P.x-50,P.y-76,'#66d9e8')},900)}
  if(R19.mem.ok===cur)R19.mem.ok=-1}
function peqTown(){if(MEMR.length&&MEMC>=0)R19.mem={c:MEMC,L:MEMR.slice(0,60),ok:R19.mem.ok};MEMR=[];MEMC=-1;DICEB=0;MEMB=0}
// 记录:在关卡里真正放出的技能(冷却从 0 变成 >0)
{const u0=useSk;useSk=function(i,S){const m=P.mode,c0=CD[m]&&CD[m][i];u0(i,S);if(st=='play'&&!MWON&&!INTOWN&&peqOn('mem')&&!(c0>0)&&CD[m][i]>0&&MEMR.length<60)MEMR.push([m,i])}}
// 主城重放:一招放完再放下一招(冷却清零,模式不对的跳过)
function memStep(dt){const p=MEMP;if(!p||busy()||DLG)return;if(P.sk)return;p.w-=dt;if(p.w>0)return;const L=R19.mem.L;
  while(p.i<L.length&&L[p.i][0]!=P.mode)p.i++;
  if(p.i>=L.length){MEMP=null;R19.mem.ok=R19.mem.c;sfx('lvl');tx('💠 模拟完成:下次进入'+lvsName(R19.mem.c)+'伤害 +10%',P.x-90,P.y-50,'#66d9e8');save();return}
  const i=L[p.i][1];CD[P.mode][i]=0;useSk(i,stats());p.i++;p.w=.35;tx('模拟战斗 '+p.i+' / '+L.length,P.x-30,P.y-40,'#99e9f2')}
// 宠物界面里的「宠物装备」一节
function rPeq(){const L=R19.peq.on,on=petOn()||hamOn();
  let h=`<h4>宠物装备</h4><div class="tag">在 🏪 商城金币商店购买(💰 ${PEQP} 一件);宠物身上 ${PEQN} 个装备格,钢盔小鸡或仓鼠出战时生效${on?'':' —— <b style="color:#c92a2a">现在没有出战的宠物,装备不生效</b>'}。</div><div class="psk">`;
  h+=Object.keys(PEQD).map(k=>{const o=peqOwn(k),w=L.includes(k);return `<div${o?'':' class="lk"'}>${mniEm('peq_'+k)}<b>${PEQD[k][0]}</b> ${o?`<button data-p="pqe_${k}" ${w||L.length<PEQN?'':'disabled'}>${w?'✅ 已装备':'装备'}</button>`:'<span class="tag">未拥有</span>'}<br><span class="tag">${PEQD[k][1]}</span></div>`}).join('')+'</div>';
  if(peqOwn('mem')){const m=R19.mem;h+=`<p class="tag">记忆晶片:${m.L.length?'记录了'+lvsName(m.c)+'的 '+m.L.length+' 次技能':'还没有记录(戴着它打一趟关卡)'}${m.ok>=0?' · 下次进入'+lvsName(m.ok)+'伤害 +10%':''}</p>`+(st=='town'&&m.L.length?`<button data-p="pqsim">▶ 模拟战斗</button>`:'')}
  return h}
