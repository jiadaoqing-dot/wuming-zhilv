function rSpr(){if(!SPR.own)return hd('🧚 精灵')+fm()+`<p>你还没有精灵。精灵可以在 🏪 商城的金币商店购买(💰 ${SPRP_})。</p><button data-p="gomall">前往商城</button>`;
  const need=sprNeed(SPR.lv),free=sprFree(),pm=SPR.lv>=50;
  let h=hd('🧚 精灵')+fm()+`<img class="pv" src="${pvImg('spr')}" alt=""><b>精灵 · Lv ${SPR.lv}/50</b> <button data-p="son">${SPR.on?'✅ 跟随中':'⬜ 休息中'}</button><br><span class="tag">${pm?'已满级':'经验 '+SPR.exp+' / '+need}</span><div class="xb"><i style="width:${pm?100:Math.round(SPR.exp/need*100)}%"></i></div><span class="tag">每级 1 点(满级共 50 点),单项最多 50 点,想清楚再加 —— 可以免费重置。${SPR.on?'':'精灵休息时属性不生效。'}</span><br>可分配点数:<b style="color:#f08c00">${free}</b> <button data-p="srst">重置加点</button>`;
  h+=`<h4>属性分配</h4><div class="sa">`+SPK.map(([k,n,v,u])=>{const p=SPR.pt[k];return `<b>${n}</b><span>+${+(p*v).toFixed(1)}${u} <span class="tag">(${p}/50 点 · 满 ${+(50*v).toFixed(1)}${u})</span></span><button data-p="sa_${k}_1" ${free&&p<50?'':'disabled'}>+1</button><button data-p="sa_${k}_5" ${free&&p<50?'':'disabled'}>+5</button>`}).join('')+`</div>`;
  const it=spSel==null?null:typeof spSel=='number'?BAG[spSel]:spSel.startsWith('e:')?EQ[spSel.slice(2)]:null,cid=typeof spSel=='string'&&spSel.startsWith('c:')&&OWN.includes(spSel.slice(2))?spSel.slice(2):null,worn=typeof spSel=='string'&&spSel.startsWith('e:');
  h+=`<h4>吸收装备升级</h4><div class="tag">所有装备都能吸收:背包里的装备、已穿戴的装备、时装和翅膀。每件按价值转化为精灵经验(品质、系列越高、强化越多,经验越多;时装 / 翅膀每件 ${COSEXP} 经验)。吸收已穿戴的装备、时装或翅膀要再确认一次。</div>`;
  if(!pm){h+=`<div class="row" style="border:0">${BAG.map((q,i)=>`<button class="pk${spSel==i?' on':''}" data-p="sp${i}" style="border-color:${TR[q.tier][1]}" title="${nm(q)}">${eqImg(q)}${q.en?'<sup>+'+q.en+'</sup>':''}</button>`).join('')||'<span class="tag">背包是空的</span>'}</div>`;
    const we=ALL.filter(k=>EQ[k]),cs=OWN.filter(id=>COSD[id]);
    h+=`<div class="tag">已穿戴</div><div class="row" style="border:0">${we.map(k=>{const q=EQ[k];return `<button class="pk${spSel=='e:'+k?' on':''}" data-p="se_${k}" style="border-color:${TR[q.tier][1]}" title="${nm(q)}">${eqImg(q)}${q.en?'<sup>+'+q.en+'</sup>':''}</button>`}).join('')||'<span class="tag">无</span>'}</div>`;
    h+=`<div class="tag">时装 / 翅膀</div><div class="row" style="border:0">${cs.map(id=>`<button class="pk${spSel=='c:'+id?' on':''}" data-p="sc_${id}" style="border-color:#f783ac;font-size:22px" title="${COSD[id].n}">${COSD[id].ic}</button>`).join('')||'<span class="tag">无</span>'}</div>`;
    const cf=(t,n)=>SPC?`<b style="color:#c92a2a">${t}</b> <button data-p="sabs">确定吸收(+${n} 经验)</button> <button data-p="sabsN">取消</button>`:`吸收可获得 <b>${n}</b> 经验 <button data-p="sabs">✨ 吸收</button>`;
    if(it)h+=`<p><b style="color:${TR[it.tier][1]}">${nm(it)}</b> ${ST(it)}${worn?' <span class="tag">(已穿戴)</span>':''}<br>${worn?cf('确定吸收身上的「'+nm(it)+'」吗?吸收后这个部位会空出来。',sprExp(it)):`吸收可获得 <b>${sprExp(it)}</b> 经验 <button data-p="sabs">✨ 吸收</button>`}</p>`;
    if(cid){const d=COSD[cid];h+=`<p><b style="color:#f783ac">${d.ic} ${d.n}</b> <span class="tag">${d.t=='fash'?'时装':'翅膀'}${WEAR[d.t]==cid?' · 穿戴中':''}</span><br>${cf('确定吸收「'+d.n+'」吗?吸收后要重新用击杀点购买。',COSEXP)}</p>`}
    const pl_=autoPlan();h+=`<p><button data-p="sall" ${pl_.length?'':'disabled'}>一键吸收多余装备(${pl_.length} 件 · ${pl_.reduce((s,i)=>s+sprExp(BAG[i]),0)} 经验)</button> <span class="tag">规则同背包「一键出售」:每个部位 / 特性只保留最好的一件</span></p>`}
  else h+='<p class="tag">精灵已满级,不再吸收装备。</p>';
  return h}
const sprExp=it=>Math.round(it.pr*EM(it));
const COSEXP=3000;let SPC=0;  // 时装 / 翅膀被精灵吸收得到的经验;SPC:吸收已穿戴装备 / 时装的二次确认
function rPet(){hamHatchChk();return rChick()+rHam()}
function rChick(){if(!PET.own)return hd('🐤 宠物')+fm()+`<p>你还没有宠物。钢盔小鸡可以在 🏪 商城的金币商店购买(💰 ${PETP_})。</p><button data-p="gomall">前往商城</button>`;
  const need=petNeed(PET.lv),pm=PET.lv>=20;
  let h=hd('🐤 宠物')+fm()+`<img class="pv" src="${pvImg('pet')}" alt=""><b>钢盔小鸡 · Lv ${PET.lv}/20</b> <button data-p="pon">${PET.on?'✅ 出战中':'⬜ 休息中'}</button><br><span class="tag">${pm?'已满级':'经验 '+PET.exp+' / '+need+'(出战时,击败怪物获得和无名相同的经验)'}</span><div class="xb"><i style="width:${pm?100:Math.round(PET.exp/need*100)}%"></i></div><span class="tag">Lv 5 / 10 / 15 / 20 各随机领悟一个还没学会的技能;技能在关卡里自动释放,数值随宠物等级提升。</span>`;
  h+=`<h4>技能</h4><div class="psk">`+[0,1,2,3].map(i=>{const k=PET.sk[i];return k?`<div>${mniEm(k)}<b>${PSK[k][0]}</b> <span class="tag">冷却 ${PSK[k][2]} 秒</span><br><span class="tag">${PSK[k][1]()}</span></div>`:`<div class="lk"><b>🔒 未领悟</b><br><span class="tag">Lv ${(i+1)*5} 随机领悟</span></div>`}).join('')+'</div>';
  return h}
