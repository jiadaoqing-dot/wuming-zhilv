// ===== 第五十七轮(用户):大师二阶装备 —— 暗黑炼狱第 16 层首领掉落(每次 35%,一共掷 3 次,双倍爆率卡 / 骰子照乘),目前最强的装备 =====
// 和大师(一阶)比:白字 / 绿字 ×3(M2W),强化效果 ×5(M2EN:it.ev 按原值存,读的时候用 evV),锻造效果 ×6(M2FG,在 wv 里),
//   特性效果 ×4.5(trMul 的权重:普通 1 · 大师 2 · 大师二阶 4.5)。只出头饰 / 战甲 / 项链 / 指环(和大师制作一样),特性随机;
//   it.m2 = 1,it.ms 仍然是 2(原来「大师」的规则全部照用)
// 四件大师二阶都是同一种特性 → 多一个被动(m2On):
//   圣愈 / 邪灵:每 10 秒,下一次攻击额外造成 (最大生命 + 当前生命) × 15 的伤害(无视防御,金色数字)
//   神技:每 8 秒刷新一个冷却最长的技能(同样长就随机),所有技能冷却再 -10%;攻击强制削减怪物韧性(无视霸体);连击保持 6 秒,每 30 连击攻击 +23%(最多 20 层)
//   热血:受到致命伤害时 60% 几率不死(留 1 点生命)并 3 秒无敌,没有冷却;生命 < 70% 攻击 +100%,< 50% 再 +100%,< 30% 再 +300%
//   怒雷:所有攻击伤害 +(暴击率 ÷ 10)%(暴击率 200% → +20%);暴击率超过 100% 的部分,每 2% 让暴击伤害 +1%
const M2W=3,M2EN=5,M2FG=6,M2TR=4.5,M2DR=.35,M2NN=3,M2HK=15;
const evV=it=>Math.round((it&&it.ev||0)*(it&&it.m2?M2EN:1));
function m2Gen(s,t){s=s||MSL[Math.random()*MSL.length|0];t=t||TRK[Math.random()*TRK.length|0];
  const it=gen(s,3,'大师二阶'+MSN[s]+'·'+TRT[t][0],3,t,1,1);it.m2=1;for(const k in it.s)it.s[k]=Math.round(it.s[k]*M2W);greenRoll(it);it.pr=eqPr(it);return it}
const m2Cnt=k=>BODY.filter(s=>EQ[s]&&EQ[s].m2&&EQ[s].tr==k).length,m2On=k=>m2Cnt(k)>=4;
const M2D={yu:`每 10 秒,下一次攻击额外造成「(最大生命 + 当前生命) × ${M2HK}」的伤害(无视防御,金色数字)`,ling:`每 10 秒,下一次攻击额外造成「(最大生命 + 当前生命) × ${M2HK}」的伤害(无视防御,金色数字)`,
  ji:'每 8 秒刷新一个冷却最长的技能,所有技能冷却再 -10%;所有攻击强制削减怪物韧性(无视霸体);连击保持 6 秒,每 30 连击攻击力 +23%(最多 20 层)',
  xue:'受到致命伤害时 60% 几率不死并 3 秒无敌(没有冷却);生命低于 70% 攻击力 +100%,低于 50% 再 +100%,低于 30% 再 +300%',
  lei:'所有攻击伤害 +(暴击率 ÷ 10)%(暴击率 200% 时 +20%);暴击率超过 100% 的部分,每 2% 让暴击伤害 +1%'};
// 每帧(update):圣愈 / 邪灵的蓄力、神技的刷新
function m2Tick(dt){if(INTOWN||!P)return;
  if(m2On('yu')||m2On('ling')){if(!P.m2h){P.m2hT=(P.m2hT||0)+dt;if(P.m2hT>=10){P.m2hT=0;P.m2h=1;tx('⚡',P.x+6,P.y-20,'#ffd43b','c')}}else if(Math.random()<dt*12)pt({x:P.x+rnd(0,24),y:P.y+rnd(0,32),vx:rnd(-10,10),vy:rnd(-50,-20),c:pick(['#ffd43b','#fff3bf']),sh:1,s:rnd(1.5,2.5),l:.4})}else{P.m2h=0;P.m2hT=0}
  if(m2On('ji')){P.m2jT=(P.m2jT||0)+dt;if(P.m2jT>=8){P.m2jT=0;m2Ji()}}else P.m2jT=0}
function m2Ji(){const c=CD[P.mode];let mx=0;for(const v of c)mx=Math.max(mx,v);
  if(mx>0){const L=[];c.forEach((v,i)=>{if(v>=mx-.01)L.push(i)});c[L[Math.random()*L.length|0]]=0}
  for(const w in CD)CD[w]=CD[w].map(v=>v*.9);ghost('#339af0',.3)}
// dealt 里调用:圣愈 / 邪灵 的额外伤害(宠物 / 爆燃不触发)
function m2Hit(e){if(!P.m2h||PETX||ELX||st!='play'||e.hp<=0)return;P.m2h=0;P.m2hT=0;const S=stats(),d=Math.round((S.hp+Math.max(0,P.hp))*M2HK);
  e.hp-=d;tx(d,e.x+e.w/2,e.y-22,'#ffd43b','c');VFX.spawn('x-star',e.x+e.w/2,e.y+e.h/2,{s:1.4,life:.6,add:1,gr:.5});shake=Math.max(shake,.18)}
// hurt 里调用:热血不死
function m2Live(){if(!m2On('xue')||Math.random()>=.6)return false;P.m2L=1;tx('不死!',P.x-6,P.y-30,'#ff6b6b','c');flash('255,80,80',.2);return true}
function m2Atk(hp){let a=0;if(m2On('ji'))a+=Math.min(20,Math.floor((P.combo||0)/30))*.23;if(m2On('xue')&&hp>0){const r=P.hp/hp;if(r<.7)a+=1;if(r<.5)a+=1;if(r<.3)a+=3}return a}
