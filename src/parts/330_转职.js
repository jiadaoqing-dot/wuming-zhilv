// ===== 转职:剑士 / 法师二选一(只能转职一次),需要「转职凭证」(第六关首领掉落)。转职后可以学习该职业的 4 个进阶技能 =====
let JOB=null,JOBC=null;const JOBN={sword:'剑士',staff:'法师'};
const KEYN=['H','U','I','O','空格','W+空格','S+空格','WW+空格'];
function doJob(w){if(JOB||!(MAT.job>0)||!JOBN[w])return;MAT.job--;if(!MAT.job)delete MAT.job;JOB=w;JOBC=null;sfx('lvl');if(P){flash('255,240,190',.4);tx('转职成功:'+JOBN[w]+'!',P.x-30,P.y-50,'#ffd43b')}save()}
// 学习 / 升级的花费:技能点和金币都随目标等级上涨,并且有角色等级要求
// 第十六轮:技能最高 5 级。基础技能 5 级共 8 点(1 1 2 2 2),进阶 12 点(2 2 2 3 3),被动每级 1 点;角色等级要求基础 1/4/8/12 起每级 +4,进阶 28/32/36/40 起每级 +3(最高 50)
function skCost(id,L){if(id.startsWith('p_')){return {sp:1,gold:Math.round(150*L*L),lv:L==1?2:L*4}}
  const i=+id.slice(-1);if(i<4)return {sp:[1,1,2,2,2][L-1]||2,gold:Math.round(80*(i+1)*L*L),lv:[1,4,8,12][i]+(L-1)*4};
  return {sp:[2,2,2,3,3][L-1]||3,gold:Math.round(600*(1+(i-4)*.5)*L*L),lv:Math.min(LVMAX,28+(i-4)*4+(L-1)*3)}}
const costT=c=>`Lv${c.lv} · ${c.sp} 技能点 · 💰${c.gold}`;
function skInfo(id,AT){const pc=(q,v)=>q[0]=='hpr'||q[0]=='mpr'?(v*100).toFixed(1)+'%':Math.round(v*100)+'%';
  if(id.startsWith('p_')){const q=PSD.find(q=>'p_'+q[0]==id),l=pl(q[0]),mx=q[3],ef=v=>PSX(q[0],v),c=l<mx?skCost(id,l+1):null;
    return {name:q[1],l,mx,c,h:`<b>${q[1]}</b> <span class="tg">被动 · Lv ${l}/${mx}</span><hr>${q[0]=='dj'?q[2]+'(满级 1 级)':'每级:'+PSX(q[0],1)}<hr>${l?'当前:'+ef(l):'未学习'}${l<mx?'<br>下一级:'+ef(l+1)+'<br><span class="tg">'+(l?'升级':'学习')+'需要:'+costT(c)+'</span>':'<br>已满级'}`}}
  const w=id.slice(0,-1),i=+id.slice(-1),q=SKD[w][i],l=LN[w][i]|0,dsc=lv=>{const b=skB(w,i,lv);return (b?`伤害 ${b[0]} + 攻击×${Math.round(b[1]*100)}%(约 ${Math.round(b[0]+AT[w]*b[1])})`:'无伤害')+` · 冷却 ${skCd(w,i,lv)} 秒`+(WEAR.fash=='xy'?`(实际 ${+(skCd(w,i,lv)*.9).toFixed(2)} 秒)`:'')};
  const ok=skCan(w,i),c=l<LNMAX?skCost(id,l+1):null,why=i>=4&&JOB!=w?`🔒 转职为「${JOBN[w]}」后才能学习`:i?`🔒 需要先学会「${KEYN[i-1]} · ${SKD[w][i-1][0]}」`:'';
  return {name:q[0],l,mx:LNMAX,key:KEYN[i],ok,c,h:(ok?'':`<b style="color:#ff8787">${why}</b><hr>`)+`<b>${KEYN[i]} · ${q[0]}</b> <span class="tg">${i>=4?JOBN[w]+'进阶':SL[w][0]}技能 · Lv ${l}/${LNMAX} · 魔力 ${skMp(w,i,stats().mp)}(最大魔力 ${+(SKMP[w][i]*100).toFixed(1)}%)</span><hr>${q[1]}<hr>${l?'当前:'+dsc(l):'未学习'}${l<LNMAX?'<br>Lv'+(l+1)+':'+dsc(l+1)+'<br><span class="tg">'+(l?'升级':'学习')+'需要:'+costT(c)+'</span>':'<br>已满级'}<br><span class="tg">每升 1 级冷却 -6%;有伤害的技能还会提高基础伤害和攻击倍率</span>`}}
function skAT(){const pm=P.mode,AT={};for(const w of ['sword','staff']){P.mode=w;AT[w]=stats().atk}P.mode=pm;return AT}
function renderSk(){const AT=skAT(),icon=id=>{const f=skInfo(id,AT);return `<button class="ski${f.l?'':' lk'}${f.l>=f.mx?' mx':''}${skSel==id?' on':''}" data-s="${id}"><span class="ic"><img src="${ICON[id]}" alt="">${f.key?`<span class="ky">${f.key}</span>`:''}<span class="lv">${f.l?f.l+'/'+f.mx:f.ok===false?'🔒':'未学'}</span></span><span>${f.name}</span></button>`};
  const tb=(i,l)=>`<button data-s="t${i}" class="${skTab==i?'on':''}">${l}</button>`;
  const ph=n=>Array.from({length:n},(_,i)=>`<button class="ski lk ph" data-s="ph"><span class="ic"><span class="phi">🔒</span><span class="lv">未开放</span></span><span>进阶技能 ${i+1}</span></button>`).join('');
  let h=`<div class="bh"><b>🌟 技能</b><span><span class="tag">技能点 <b style="color:#f08c00">${sp}</b> · 💰 ${gold}</span> ${tb(0,'🗡️ 剑士')} ${tb(1,'🪄 法师')} ${tb(2,'✨ 被动')} <button data-s="x">✕ 关闭</button></span></div>`+giftBox('技能导师','s')+(skMsg?`<p><b>${skMsg}</b></p>`:'');skMsg='';
  if(skTab<2){const w=skTab?'staff':'sword',n=MAT.job||0;
    h+=`<div class="jobb">${JOB?`⚜ 已转职:<b>${JOBN[JOB]}</b> <span class="tag">可以学习${JOBN[JOB]}的 4 个进阶技能</span>`:`⚜ <b>转职</b> <span class="tag">剑士 / 法师二选一,只能转职一次;转职后可以学习该职业的 4 个进阶技能。需要「转职凭证」(第六关首领掉落)· 持有 ${n}</span><br>`+
      ['sword','staff'].map(j=>`<button data-s="job_${j}" ${n?'':'disabled'}>${JOBC==j?'⚠️ 再点一次确认转职为'+JOBN[j]:'转职为 '+JOBN[j]}</button>`).join(' ')+(JOBC?' <span class="tag">转职后不能更改</span>':'')}</div>`;
    h+=`<div class="skh">${skTab?'🪄 法师技能':'🗡️ 剑士技能'} <span class="tag">${skTab?'法杖攻击 '+AT.staff+' · 元素印记:落雷 / 雷云 = 雷印,火球 / 陨石 = 火印,两种同时存在 → 爆燃(攻击 ×1.5);闪现穿过印记目标直接引爆':'剑攻击 '+AT.sword+' · 剑势:每次命中 +1 层,5 层时下一个技能 +40%;冲刺斩标上裂伤(受剑伤害 +15%)'} · 用${skTab?'法杖':'剑'}时按 H U I O 释放</span></div><div class="skr">${[0,1,2,3].map(i=>icon(w+i)).join('')}</div>`;
    h+=w=='sword'?`<div class="skh">⚔ 剑士进阶技能 <span class="tag">${JOB=='sword'?'拿剑时按 空格 / W+空格 / S+空格 / WW+空格(连按两下 W 再按空格)释放':'转职为剑士后才能学习'}</span></div><div class="skr">${[4,5,6,7].map(i=>icon(w+i)).join('')}</div>`
      :`<div class="skh">✦ 法师进阶技能 <span class="tag">${JOB=='staff'?'拿法杖时按 空格 / W+空格 / S+空格 / WW+空格(连按两下 W 再按空格)释放':'转职为法师后才能学习'}</span></div><div class="skr">${[4,5,6,7].map(i=>icon(w+i)).join('')}</div>`}
  else h+=`<div class="skh">✨ 被动技能 <span class="tag">一直生效,不用按键</span></div><div class="skr">${PSD.slice(0,4).map(q=>icon('p_'+q[0])).join('')}</div><div class="skr">${PSD.slice(4).map(q=>icon('p_'+q[0])).join('')}</div>`;
  let d='<span class="tag">'+(canHover?'鼠标移到图标上查看说明;点击图标选中后升级(也可以双击图标直接升级)。':'点一下图标查看说明,再点「学习 / 升级」。')+'学习和升级要消耗技能点和金币,等级越高花费越多,并且有角色等级要求。剑士、法师的主动技能都要按顺序学习(H → U → I → O,进阶技能 空格 → W+空格 → S+空格 → WW+空格)。</span>';
  if(skSel){const f=skInfo(skSel,AT),c=f.c,can=c&&f.ok!==false&&sp>=c.sp&&gold>=c.gold&&lvl>=c.lv;
    d=f.h.replace(/<hr>/g,'<br>')+(f.l<f.mx?`<br><button data-s="up" ${can?'':'disabled'}>${f.l?'升级':'学习'}(${c.sp} 技能点 · 💰${c.gold})</button>`+(c&&lvl<c.lv?` <span class="tag" style="color:#c92a2a">需要角色 Lv${c.lv}</span>`:c&&gold<c.gold?' <span class="tag" style="color:#c92a2a">金币不足</span>':c&&sp<c.sp?' <span class="tag" style="color:#c92a2a">技能点不足</span>':''):'')}
  $('sk').innerHTML=h+`<div class="dt">${d}</div>`}
function upSk(id){if(!id)return;let msg=null;
  const fail=m=>{skMsg='⚠️ '+m;if(P)tx(m,P.x-40,P.y-30,'#ff8787')};  // 第三十四轮:失败原因也写在技能面板里(面板挡住了头顶飘字)
  if(id.startsWith('p_')){const q=PSD.find(q=>'p_'+q[0]==id);if(!q||pl(q[0])>=q[3])return;const c=skCost(id,pl(q[0])+1);
    if(lvl<c.lv)return fail('需要角色 Lv'+c.lv);if(sp<c.sp)return fail('技能点不足');if(gold<c.gold)return fail('金币不足');sp-=c.sp;gold-=c.gold;PS[q[0]]=pl(q[0])+1;const S=stats();P.hp=Math.min(P.hp,S.hp)}
  else{const w=id.slice(0,-1),i=+id.slice(-1);if(!skCan(w,i))return fail(i>=4&&JOB!=w?'转职为'+JOBN[w]+'后才能学习':'请按顺序学习');const l=LN[w][i]|0;if(l>=LNMAX)return;const c=skCost(id,l+1);
    if(lvl<c.lv)return fail('需要角色 Lv'+c.lv);if(sp<c.sp)return fail('技能点不足');if(gold<c.gold)return fail('金币不足');sp-=c.sp;gold-=c.gold;LN[w][i]=l+1;sfx('coin')}save()}
$('sk').addEventListener('click',e=>{const t=e.target.closest('[data-s]');if(!t||t.disabled)return;const r=t.dataset.s;
  {const m=giftAct(r);if(m!=null){skMsg=m;renderSk();return}}
  if(r=='x'){toggleSk();return}if(/^t[012]$/.test(r)){skTab=+r[1];skSel=null;JOBC=null;hideTip();renderSk();return}if(r=='ph'){skSel=null;$('sk').querySelector('.dt').innerHTML='<span class="tag">🔒 法师的进阶技能会在后续更新中开放。</span>';return}
  if(r.startsWith('job_')){const j=r.slice(4);if(JOBC==j)doJob(j);else JOBC=j;renderSk();return}
  if(r=='up'){upSk(skSel);renderSk();return}if(canHover&&dbl('s'+r)){skSel=r;upSk(r);renderSk();return}skSel=r;renderSk()});
$('sk').addEventListener('mouseover',e=>{if(!canHover)return;const t=e.target.closest('.ski');if(t&&t.dataset.s=='ph')showTip('<b>🔒 未开放</b><hr>法师的进阶技能会在后续更新中开放',e);else if(t)showTip(skInfo(t.dataset.s,skAT()).h,e);else hideTip()});
$('sk').addEventListener('mousemove',moveTip);$('sk').addEventListener('mouseleave',hideTip);
