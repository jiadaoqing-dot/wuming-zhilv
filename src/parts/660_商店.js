// ===== 每日签到:每天一次,随机 1~100 击杀点;启动游戏时没签到会自动弹出 =====
const dstr=d=>d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate(),yday=()=>{const d=new Date();d.setDate(d.getDate()-1);return dstr(d)};
const signed=()=>SIGN.day==today();
let signNew=0;  // 刚签到:数字弹出动画
function doSign(){if(signed())return;if(timeBad()){fmsg=TBMSG;return}const n=1+Math.floor(Math.random()*100);SIGN.str=SIGN.day==yday()?(SIGN.str||0)+1:1;SIGN.day=today();SIGN.n=(SIGN.n||0)+1;SIGN.last=n;KP+=n;signNew=1;sfx('coin');if(n>=80)sfx('lvl');save()}
function rSign(){const ok=signed(),st_=ok?SIGN.str:(SIGN.day==yday()?SIGN.str:0),cyc=ok?((st_-1)%7)+1:(st_%7)+1;
  let h=hd('📅 每日签到')+fm()+`<div class="tag">每天可以签到一次,随机获得 <b>1~100</b> 击杀点(击杀点可以在 🏪 商城购买时装和翅膀,累计消费 ${VIPN} 开通 👑 VIP)。每天 0 点刷新。</div>`;
  h+=`<div class="sgw">`+Array.from({length:7},(_,i)=>{const d=i+1,done=d<cyc||(ok&&d==cyc);return `<div class="${done?'ok':''}${d==cyc?' td':''}"><b>${done?'✅':d==cyc?'🎁':'📦'}</b>第 ${d} 天</div>`}).join('')+`</div>`;
  h+=`<div class="sgb">`+(ok?`今天已签到,获得 <span class="${signNew?'sgr':''}" style="${signNew?'':'font-weight:900;color:#e8590c;font-size:22px'}">+${SIGN.last}</span> 击杀点<br><span class="tag">明天再来吧!</span>`:`<button data-p="sign">✍️ 签到领取击杀点</button>`)+`</div>`;
  h+=`<div class="tag" style="text-align:center">连续签到 ${st_} 天 · 累计签到 ${SIGN.n||0} 天 · 当前击杀点 ⚔️ ${KP}</div>`;signNew=0;return h}
const hd=t=>`<div class="bh"><b>${t}</b><span><span class="tag">💰 ${gold}</span> <button data-p="x">✕ 关闭</button></span></div>`;
const fm=()=>fmsg?`<p><b>${fmsg}</b></p>`:'';
function rShop(){if(!SEROPEN[shopSer]())shopSer=0;const tb=(g,l)=>SEROPEN[g]()?`<button data-p="Zs${g}" class="${shopSer==g?'on':''}">${l}</button>`:`<button disabled title="${SERHINT[g]}">🔒 ${l}</button>`;
  const lk=[1,2].filter(g=>!SEROPEN[g]());
  return hd('🛒 装备商人')+giftBox('装备商人')+`<div class="tag">普通、精良、稀有装备都能买;史诗装备只能击败 Boss 获得。买到的装备放进背包,再到背包里穿戴。商人的货会随着你的冒险进度增加。</div>`+fm()+
  `<h4>购买装备</h4><div class="row" style="border:0">${tb(0,'旅者系列')}${tb(1,'林王系列')}${tb(2,'荒漠系列')}${lk.length?`<span class="tag">${lk.map(g=>SER[g].n+'系列:'+SERHINT[g]).join(' · ')}</span>`:''}</div>`+
  (shopSer==2?`<div class="row" style="border:0"><span class="tag">发型 / 铠甲 / 戒指 / 耳坠的特性:</span>${TRK.map(k=>`<button data-p="Zt${k}" class="${shopTr==k?'on':''}" style="${shopTr==k?'':'opacity:.8'}">${TRT[k][0]}</button>`).join('')}</div><div class="tag">${TRT[shopTr][0]}:${trDesc(shopTr)}</div>`:'')+
  `<div class="shop">`+ALL.map((k,i)=>`<b>${eqImg(shopIt(i,0),'eqs')} ${SL[k][0]}</b>`+[0,1,2].map(j=>{const it=shopIt(i,j);return `<button data-p="b${i}_${j}" ${gold<buyPr(it)||BAG.length>=BAGN?'disabled':''}><span style="color:${TR[j][1]};font-weight:bold">${TR[j][0]}${it.tr?'·'+TRT[it.tr][0]:''}</span><span class="tag">${STR(it)}</span><span>💰 ${buyPr(it)}</span></button>`}).join('')).join('')+`</div>`+
  `<h4>出售背包物品</h4>`+(MAT.egg?`<div class="row"><span>🥚 蛇蛋 ×${MAT.egg}</span><span class="tag">每个 3 金币</span><button data-p="se" style="margin-left:auto">全部出售 +${MAT.egg*3}</button></div>`:'')+(BAG.length?BAG.map((it,i)=>`<div class="row"><span style="color:${TR[it.tier][1]};font-weight:bold">${eqImg(it,'eqs')} ${nm(it)}</span><span class="tag">${ST(it)}</span><button data-p="s${i}" style="margin-left:auto">出售 +${sellPr(it)}</button></div>`).join(''):'<div class="tag">背包是空的</div>')}
// 商城 / 精灵 / 宠物面板按钮;返回 true 表示已处理
