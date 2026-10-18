/*NOFONT{*/
// =====================================================================
// 手机版活动:兑换码(只有 v1.52 手机纪念版有)。左上角「活动」→ 输入兑换码领礼包;每个存档每个码只能领一次(R19.cdk)
// cancan666:经验药水(直接升到 25 级)+ 星界财宝 ×5 + 普通 Lv1 强化石 ×15
// shanmei666:林王系列普通品质 4 件(头饰 / 战甲 / 项链 / 戒指,特性自选)+ 史诗旅者剑 + 史诗旅者法杖(第一关掉落的武器)+ 小礼袋 ×20 + 双倍爆率卡 ×1 + 中级属性石 ×2
// =====================================================================
MISC.xp25=['经验药水','喝下后直接升到 25 级(已经 25 级以上就用不了)。手机版活动兑换码「cancan666」的奖励。','',0,'🧪 喝下'];MENI.P.xp25=MENI.P[3];
{const iu0=itemUse;itemUse=function(id){if(id!='xp25')return iu0(id);if(!(MAT.xp25>0))return '';if(lvl>=25)return '已经 '+lvl+' 级了,经验药水只能升到 25 级';
  const l0=lvl;MAT.xp25--;while(lvl<25&&lvl<LVMAX){exp=expNeed(lvl);lvUp()}save();return '🧪 一口气从 Lv'+l0+' 升到了 Lv'+lvl+'!'}}
const CDK={
  cancan666:{n:'灿灿的礼物',t:'经验药水 ×1(直接升到 25 级)· 星界财宝 ×5 · 普通 Lv1 强化石 ×15',go(){MAT.xp25=(MAT.xp25|0)+1;MAT.astr=(MAT.astr|0)+5;STN[1][0]+=15}},
  shanmei666:{n:'山魅的礼物',t:'林王系列普通品质一套 4 件(特性自选)· 史诗旅者剑 · 史诗旅者法杖 · 小礼袋 ×20 · 双倍爆率卡 ×1 · 中级属性石 ×2',bag:6,tr:1,
    go(tr){for(const s of BODY)BAG.push(gen(s,0,null,1,tr));BAG.push(gen('sword',3,null,0));BAG.push(gen('staff',3,null,0));
      MAT.gift=(MAT.gift|0)+20;MAT.dbl=(MAT.dbl|0)+1;R19.ats.push(atsNew(1),atsNew(1))}}};
let CDKW=null;  // 等待选特性的兑换码
const cdkDone=()=>R19.cdk||(R19.cdk=[]);
function cdkGo(c,tr){const d=CDK[c];if(!d)return '兑换码不存在,请检查有没有输错';if(cdkDone().includes(c))return '这个兑换码已经领取过了';
  if(d.bag&&BAG.length+d.bag>BAGN)return `装备背包空位不够(需要 ${d.bag} 格,还剩 ${BAGN-BAG.length} 格),先整理一下背包再来领`;
  if(d.tr&&!tr){CDKW=c;return '请选择林王套装的特性'}
  d.go(tr);cdkDone().push(c);CDKW=null;sfx('lvl');save();return `🎁 领取成功:「${d.n}」—— ${d.t}${tr?'(特性:'+TRT[tr][0]+')':''}。奖励已放进背包`}
MOBP.act=()=>hd('🎁 活动')+fm()+`<h4>兑换码</h4><div class="tag">输入兑换码领取礼包(不分大小写),每个存档每个兑换码只能领取一次。</div>
  <div class="row"><input class="actin" id="actIn" data-enter="act_go" placeholder="输入兑换码" autocomplete="off" autocapitalize="off" spellcheck="false"><button data-p="act_go">兑换</button></div>`+
  (CDKW?`<h4>选择林王套装的特性</h4><div class="tag">头饰、战甲、项链、戒指 4 件都带这个特性(穿 2 件 / 4 件有套装效果)。</div><div class="row">`+TRK.map(k=>`<button data-p="act_tr_${k}" style="color:${TRT[k][1]}">${TRT[k][0]}<br><small>${TRT[k][2]}</small></button>`).join('')+`<button data-p="act_trx">取消</button></div>`:'')+
  `<h4>图鉴</h4><div class="row"><a href="https://jiadaoqing-dot.github.io/wuming-zhilv/mobile/guide/" target="_blank" rel="noopener"><button>📖 首领与装备图鉴</button></a><span class="tag">在新页面打开:全部首领、装备系列和属性介绍</span></div>`+
  (cdkDone().length?`<h4>已领取</h4><div class="tag">${cdkDone().map(c=>CDK[c]?CDK[c].n+'('+c+')':c).join(' · ')}</div>`:'');
MOBA.push(r=>{
  if(r=='act_go'){const v=($('actIn')||{}).value||'';const c=v.trim().toLowerCase();if(!c){fmsg='请先输入兑换码';return 1}fmsg=cdkGo(c);return 1}
  if(r.startsWith('act_tr_')){if(CDKW)fmsg=cdkGo(CDKW,r.slice(7));return 1}
  if(r=='act_trx'){CDKW=null;return 1}
  return 0});
/*}NOFONT*/
