function rForge(){
  const it=fIt(fs),m=setLv(),pk=(q,r)=>`<button class="pk${fs==r?' on':''}" data-p="f${r}" style="${q?'border-color:'+TR[q.tier][1]:''}">${eqImg(q)}${q.en?'<sup>+'+q.en+'</sup>':''}</button>`;
  const MX=ENMAX(),V=isVip();
  let h=hd('🔨 强化师')+giftBox('强化师')+`<div class="tag">强化石分 2 级:Lv1 用于 +1~+3、Lv2 用于 +4~+6,每次消耗 1 颗;强化师不卖强化石,只能打首领掉落(Lv1 各关 · Lv2 第七关起)、做任务和好感奖励获得;每级强化按部位加固定数值(武器攻击 / 头饰魔力 / 战甲生命 / 项链防御 / 戒指暴击 / 时装防御 / 翅膀暴击),强化石品质越高加得越多,Lv2 强化石(+4~+6)加 2.5 倍;高品质强化石在旁边的熔炉里 3 颗 + 1 瓶合成添加剂合成。每次还要付金币手续费(成功失败都收)。等级越高成功率越低,失败只损失强化石,装备不受影响。最高 +${MX}${V?';<b style="color:#e8590c">👑 VIP:成功率 +10%</b>':';开通 👑 VIP 后成功率 +10%'}。可以选用幸运宝石提高成功率(低级 +25% · 中级 +35% · 高级 +50%)。</div>`;
  h+=`<h4>已穿戴</h4><div class="row" style="border:0">${ALL.map(k=>EQ[k]?pk(EQ[k],'e:'+k):'').join('')||'<span class="tag">无</span>'}</div>`;
  h+=`<h4>时装 / 翅膀</h4><div class="row" style="border:0">${OWN.map(id=>{const c=cosIt(id);return `<button class="pk${fs=='k:'+id?' on':''}" data-p="fk:${id}" style="border-color:#f783ac;font-size:22px" title="${c.n}">${COSD[id].ic}${c.en?'<sup>+'+c.en+'</sup>':''}</button>`}).join('')||'<span class="tag">没有时装 / 翅膀</span>'}</div>`;
  h+=`<h4>背包</h4><div class="row" style="border:0">${BAG.map((q,i)=>pk(q,'b'+i)).join('')||'<span class="tag">空</span>'}</div>`;
  if(it){const n=it.en||0,k=n+1,c=`<b style="color:${it.cos?'#f783ac':TR[it.tier][1]}">${nm(it)}</b>`,ek=NM[EQE[it.slot][0]];
    if(n>=MX)h+=`<p>${c} ${ST(it)}<br>已强化到最高等级 +${MX}</p>`;
    else{const sl=stnLv(k),own=STN[sl],q=FQ>=0&&own[FQ]>0?FQ:Math.max(0,own.findIndex(v=>v>0)),has=own[q]>0,fee=enFee(it,k);
      h+=`<p>${c}<br>当前:${ST(it)}<br>+${k} 后:${ek} +${(it.ev||0)+enV(it.slot,k,q)} <span class="tag">(${STQ[q].n}品质:本级 ${ek} +${enV(it.slot,k,q)};普通 / 精良 / 史诗 / 卓越 = ${STQ.map((_,i)=>enV(it.slot,k,i)).join(' / ')})</span><br>需要 <b>Lv${sl} 强化石</b>(用于 ${stnUse(sl)}),选择品质:`+STQ.map((Q,i)=>`<button data-p="Q${i}" class="${i==q&&has?'on':''}" ${own[i]?'':'disabled'}>${stnEm(sl,i)} ${Q.n} ×${own[i]}</button>`).join(' ')+
        `<br>成功率 <b>${Math.round(srOf(k,lkB())*100)}%</b>${V?' <span class="tag">(含 VIP +10%)</span>':''}${lkB()?` <span class="tag">(含${LKS[useLk][1]} +${Math.round(lkB()*100)}%)</span>`:''} · 消耗 1 颗 + 💰${fee} 手续费${gold<fee?' <b style="color:#c92a2a">金币不足</b>':''}<br><button data-p="up" ${has&&gold>=fee?'':'disabled'}>🔨 强化到 +${k}(💰${fee})</button>${[1,2,3].filter(i=>lkHave(i)>0).map(i=>` <button data-p="lk${i}" class="${useLk==i?'on':''}">${useLk==i?'✅':'⬜'} ${LKS[i][1]}(持有 ${lkHave(i)})</button>`).join('')}${own.some(v=>v>0)?'':` <span class="tag">没有 Lv${sl} 强化石(打首领掉落)</span>`}</p>`}}
  else h+=`<p class="tag">点选上方一件装备开始强化</p>`;
  h+=fm()+`<h4>强化荣誉</h4><div>除时装、翅膀外,头饰、战甲、戒指、项链、剑、法杖 6 个部位都强化到 +4 及以上时,按其中最低的强化等级获得一档强化荣誉(只取最高一档,不累加)。鼠标移到下面的徽章上查看每一档的效果。<br>当前最低 +${m}:${honLv()?'<b style="color:#ff922b">强化荣誉+'+honLv()+' 已激活</b>':'未激活'}${honRow()}</div>`;
  return h}
// 熔炉:强化石 3 合 1(同级、同品质 → 高一档品质)
function rStnFuse(){let h=`<h4>强化石合成</h4><div class="tag">把 3 颗同等级、同品质的强化石 + 1 瓶合成添加剂放进熔炉,炼成 1 颗高一档品质的强化石:普通 → 精良 → 史诗 → 卓越,必定成功。品质越高,强化时这一级加的固定数值越多。合成添加剂只在 🏪 商城的随机物品栏出现 · 持有 <b>${MAT.add|0}</b> 瓶</div>`;
  for(let l=1;l<=3;l++){if(l==3&&!stnTot(3))continue;h+=`<h4>Lv${l} 强化石(用于 ${stnUse(l)})</h4>`;
    for(let q=0;q<3;q++){const n=STN[l][q],k=Math.min(Math.floor(n/3),MAT.add|0);h+=`<div class="row"><span>${stnEm(l,q)} ${STQ[q].n} ×${n}</span><span class="tag">3 颗 + 1 瓶添加剂 → 1 颗 ${stnEm(l,q+1)} ${STQ[q+1].n}(持有 ${STN[l][q+1]})</span><span style="margin-left:auto"><button data-p="F${l}${q}1" ${k?'':'disabled'}>合成 1 次</button> <button data-p="F${l}${q}0" ${k>1?'':'disabled'}>全部合成(${k} 次)</button></span></div>`}}
  return h}
