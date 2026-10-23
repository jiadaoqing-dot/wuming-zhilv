function renderBag(){
  const S=stats(),cell=(it,r,lab)=>`<button class="cl" data-r="${r}" style="${it?'border-color:'+TR[it.tier][1]+';':''}${sel==r?'background:rgba(255,212,59,.3);':''}">${lab&&r[0]=='e'?`<i class="sl">${lab}</i>`:''}${it?eqImg(it)+(it.en?'<sup>+'+it.en+'</sup>':'')+(it.tr?`<i class="tm" style="background:${TRT[it.tr][1]}">${TRT[it.tr][0][0]}</i>`:it.g?`<i class="tm" style="background:#868e96">${'旅林荒雪机'[it.g]}</i>`:''):(r[0]=='e'?`<span style="opacity:.35">${SL[r.slice(2)][1]}</span>`:'')}</button>`;
  const it=itOf(sel);let dt=bmsg||'<span class="tag">'+(canHover?'鼠标移到物品上查看说明;<b>左键</b>点物品弹出菜单(使用 / 穿戴 / 出售);也可以把装备、时装、翅膀<b>直接拖到左边</b>的部位上穿戴,拖回右边就卸下;双击直接穿戴 / 卸下。':'点一下物品查看说明,再点下方按钮穿戴、卸下或出售;<b>长按</b>物品弹出菜单。')+'</span>';
  if(bsq){const a=BSA||[],ga=a.reduce((s,i)=>s+sellPr(BAG[i]),0),gb=bsq.reduce((s,i)=>s+sellPr(BAG[i]),0);
    dt=`<b>💰 一键出售</b> <span class="tag">已穿戴的装备不会被卖</span><br>① ${bfOn()?'出售<b>筛选出的</b>':'<b>清空装备栏</b>:出售背包里的'}全部 <b>${a.length}</b> 件装备,共 <b>${ga}</b> 金币 <button data-r="ally" ${a.length?'':'disabled'}>确认全部出售</button><br>`+
      `② 只卖多余的 <b>${bsq.length}</b> 件,共 <b>${gb}</b> 金币 <button data-r="autoy" ${bsq.length?'':'disabled'}>只卖多余的</button><br><small>「多余」:每个部位只保留属性最高的一件(带特性的按「部位 + 特性」分别保留,方便凑套装);如果已穿戴的更好,该组背包里的全部出售。</small><br><button data-r="auton">取消</button>`}
  if(it)dt=`<b style="color:${TR[it.tier][1]}">${nm(it)}</b> ${ST(it)} <span class="tag">${SER[it.g||0].n}系列</span>`+(it.tr?`<br><b style="color:${TRT[it.tr][1]}">【${TRT[it.tr][0]}】</b><small>${trDesc(it.tr)}</small>`:'')+'<br>'+(sel[0]=='b'?`<button data-r="eq">穿戴</button><button data-r="sell">出售 +${sellPr(it)}金币</button>`:`<button data-r="un">卸下</button><button data-r="sell">出售 +${sellPr(it)}金币</button>`);
  const cid=cosId(sel);
  if(cid){const d=COSD[cid],on=WEAR[d.t]==cid;dt=`<b style="color:#f783ac">${d.ic} ${d.n}</b> <span class="tag">${d.t=='fash'?'时装':'翅膀'}</span><br><small>${d.d}</small><br><small><b>${d.tr}</b></small><br>`+(CSC?`<b style="color:#c92a2a">确定出售「${d.n}」吗?</b> 获得 ${COSSELL} 金币,出售后要重新用击杀点购买。<br><button data-r="csellY">确定出售</button><button data-r="csellN">取消</button>`:`<button data-r="${on?'cu':'cw'}">${on?'卸下':'穿戴'}</button><button data-r="csell">出售 +${COSSELL}金币</button>`)}
  if(sel&&sel.startsWith('p:')){const k=sel.slice(2),d=POTD[k],n=POT[k]||0;if(!n)sel=null;else dt=`${potEm(k)} <b style="color:${d[1]}">${d[0]}</b> <span class="tag">持有 ${n} 瓶 · ${d[2]=='rev'?'倒下时使用,原地复活':'恢复 '+potAmt(k)}</span><br>${d[2]=='rev'?'':'<button data-r="pu">使用</button>'}${[0,1,2].map(i=>`<button data-r="q${i}" class="${QS[i]==k?'on':''}">快捷栏 ${i+1}${QS[i]==k?' ✓':''}</button>`).join('')}<button data-r="ps1">出售 1 瓶 +${Math.floor(d[4]/2)}</button><button data-r="psa">全部出售 +${Math.floor(d[4]/2)*n}</button>`}
  if(sel&&sel.startsWith('i:')){const id=sel.slice(2),n=itemCnt(id),q=itemList().find(v=>v[0]==id);if(!n||!q)sel=null;else{const pr=itemPr(id);dt=`${q[1]} <b>${q[2]}</b> <span class="tag">×${n}</span><br><small>${itemDesc(id)}</small><br>`+(MISC[id]&&MISC[id][4]?`<button data-r="iu">${MISC[id][4]}</button>`:'')+(pr?`<button data-r="is1">出售 1 个 +${pr}</button>`+(n>1?`<button data-r="isa">全部出售 +${pr*n}</button>`:''):'')}}
  const ccell=sl=>{const id=WEAR[sl],r='w:'+sl;return `<button class="cl" data-r="${r}" style="${id?'border-color:#f783ac;':''}${sel==r?'background:rgba(255,212,59,.3);':''}"><i class="sl">${sl=='fash'?'时装':'翅膀'}</i>${id?COSD[id].ic:`<span style="opacity:.35">${sl=='fash'?'👘':'🎀'}</span>`}</button>`};
  const CBN=20,ct=bagTab==1?'fash':'wing',cl_=bagTab==1||bagTab==2?OWN.filter(id=>COSD[id].t==ct&&WEAR[ct]!=id):[];  // 时装 / 翅膀道具栏:已拥有且没穿上的
  const ccl=id=>{if(!id)return '<button class="cl" data-r="-"></button>';const r='c:'+id;return `<button class="cl" data-r="${r}" style="border-color:#f783ac;${sel==r?'background:rgba(255,212,59,.3);':''}">${COSD[id].ic}</button>`};
  const tabB=(i,l)=>`<button data-r="t${i}" class="${bagTab==i?'on':''}">${l}</button>`;
  const cp=crdgP(eqSum(['head','body','ring','ear',P.mode]),setTr()),src=a=>a.filter(q=>q[1]).map(q=>q[0]+' '+q[1]+'%').join(' + ')||'无';
  const nx=expNeed(lvl),stn=[1,2,3,4].map(l=>stnTot(l)?'Lv'+l+'×'+stnTot(l):'').filter(Boolean).join(' ')||'无';
  // 第三十三轮背包布局(参考用户给的截图):右边每页 BPG 格(5 × 5),下面页码;装备页的筛选收进「🔍 筛选」
  const BPG=25,page=(n,f)=>{const np=Math.max(1,Math.ceil(n/BPG));bagPg=Math.min(bagPg,np-1);return {np,cells:Array.from({length:BPG},(_,j)=>f(bagPg*BPG+j)).join(''),pager:np>1?`<div class="bpg">${Array.from({length:np},(_,i)=>`<button data-r="pg${i}" class="${i==bagPg?'on':''}">${i+1}</button>`).join('')}</div>`:''}},E_='<button class="cl" data-r="-"></button>';
  let right;
  if(bagTab==3){const tot=potTot(),cells=[];for(const k of POTK)for(let n=0;n<(POT[k]||0);n++)cells.push(k);
    const P_=page(POTMAX,i=>{const k=cells[i];if(!k)return E_;const r='p:'+k,f=cells.indexOf(k)==i,q=QS.indexOf(k);return `<button class="cl pcl" data-r="${r}" style="border-color:${POTD[k][1]};${sel==r?'background:rgba(255,212,59,.3);':''}">${potEm(k)}${f&&q>=0?`<i class="tm qn">${q+1}</i>`:''}</button>`});
    right=`<div class="bcap"><span>药水 ${tot} / ${POTMAX} 瓶</span><span>键盘 1 2 3 使用快捷栏 · 在 ⚗️ 药剂师购买</span></div><div class="qsr">快捷栏 ${QS.map((k,i)=>`<b>${i+1}</b>${potEm(k)}<span>${POTD[k][0]}</span>`).join('')}</div><div class="bgrid">${P_.cells}</div>${P_.pager}`}
  else if(bagTab==4){const L=itemList(),P_=page(Math.max(50,L.length),i=>{const q=L[i];if(!q)return E_;const r='i:'+q[0];return `<button class="cl" data-r="${r}" style="border-color:${q[0]=='egg'?'#ffe8a3':q[0]=='luck'?'#69db7c':/^s\d/.test(q[0])?STQ[+q[0][2]].c:q[0][0]=='T'?ATSQ[R19.ats[+q[0].slice(1)].q].c:MISC[q[0]]?'#ffd43b':'#be4bdb'};${sel==r?'background:rgba(255,212,59,.3);':''}">${q[1]}${/^s\d/.test(q[0])?`<i class="tm" style="background:${STQ[+q[0][2]].c};color:#2b1a12">Lv${q[0][1]}</i>`:''}<i class="cn">${q[3]}</i></button>`});
    right=`<div class="bcap"><span>道具栏 ${L.length} 格</span><span>同种道具叠放在一格(属性石每颗一格)</span></div><div class="bgrid">${P_.cells}</div>${P_.pager}`}
  else if(bagTab){const P_=page(CBN,i=>i<CBN?ccl(cl_[i]):E_);right=`<div class="bcap"><span>${bagTab==1?'时装':'翅膀'}栏 ${cl_.length} / ${CBN}</span><span>在 🏪 商城用击杀点购买</span></div><div class="bgrid">${P_.cells}</div>${P_.pager}`+(OWN.some(id=>COSD[id].t==ct)?'':`<p class="tag">还没有${bagTab==1?'时装':'翅膀'} —— 点顶栏 🏪 商城,在「击杀点商店」购买。</p>`)}
  else{const chip=(r,l,on)=>`<button data-r="${r}" class="fch${on?' on':''}">${l}</button>`,fi=BAG.map((q,i)=>i).filter(i=>bfOk(BAG[i])),P_=page(BAGN,j=>j<fi.length?cell(BAG[fi[j]],'b'+fi[j],''):E_);
    right=`<div class="bcap"><span>装备栏 ${BAG.length} / ${BAGN}${bfOn()?` · 筛选出 <b>${fi.length}</b> 件`:''}</span><span><button data-r="flt" class="fch${BFO||bfOn()?' on':''}">🔍 筛选</button></span></div>`+
      (BFO?`<div class="bflt">品质 ${chip('Ft-1','全部',BF.t<0)}${TR.map((q,i)=>chip('Ft'+i,`<b style="color:${q[1]}">${q[0]}</b>`,BF.t==i)).join('')}<br>系列 ${chip('Fg-1','全部',BF.g<0)}${SER.map((q,i)=>chip('Fg'+i,q.n,BF.g==i)).join('')}<br>特性 ${chip('Fr*','全部',BF.tr=='*')}${chip('Fr','无特性',BF.tr=='')}${TRK.map(k=>chip('Fr'+k,`<b style="color:${TRT[k][1]}">${TRT[k][0]}</b>`,BF.tr==k)).join('')}</div>`:'')+
      `<div class="bgrid">${P_.cells}</div>${P_.pager}`}
  const ST3=(n,v,c,t)=>`<div${t?` title="${t}"`:''}><b>${n}</b><span${c?` style="color:${c}"`:''}>${v}</span></div>`;
  $('bag').innerHTML=`<div class="bh"><b>🎒 我的背包</b><span>${bagTab?'':'<button data-r="auto">💰 一键出售</button>'}<button data-r="x">✕ 关闭</button></span></div>
  <div class="bw bw2"><div class="bl"><div class="bhon"><span class="bhl">强化<br>奖励</span>${honRow()}<span class="tag">全身最低 +${setLv()}</span></div>
  <div class="pd"><div class="pcol">${cell(EQ.head,'e:head','头饰')}${cell(EQ.body,'e:body','战甲')}${cell(EQ.ear,'e:ear','项链')}${cell(EQ.ring,'e:ring','戒指')}</div>
   <div class="pmid"><div class="plv"><i>Lv.</i><big>${lvl}</big><span>昵称:无名<br>职业:${JOB?JOBN[JOB]:'见习冒险者'}<br><b title="${ttlTip()}" style="cursor:help">称号:${ttlNm()}</b></span></div><canvas id="doll" width="224" height="376"></canvas></div>
   <div class="pcol">${cell(EQ.sword,'e:sword','剑')}${cell(EQ.staff,'e:staff','法杖')}${ccell('fash')}${ccell('wing')}</div></div>
  <div class="at2">${ST3('生命值',S.hp)}${ST3('魔力值',S.mp)}${ST3('攻击力',S.atk,0,'当前武器:'+SL[P.mode][0]+'(按 L 切换)')}${ST3('防御力',S.def)}${ST3('暴击率',S.cr+'%','#f08c00',src(cp.cr)+' · 暴击 '+(+critK().toFixed(2))+' 倍伤害')}${ST3('闪避率',S.dg+'%','#1c7ed6',src(cp.dg)+(S.dg>=DGMAX?' · 已达上限':''))}
   <div class="w"><b>经验值</b><div class="xb"><i style="width:${lvl>=LVMAX?100:Math.round(exp/nx*100)}%"></i><em>${lvl>=LVMAX?'已满级':exp+' / '+nx}</em></div></div>
   ${ST3('金币','💰 '+gold)}${ST3('击杀点','⚔️ '+KP)}${ST3('技能点',sp)}
   ${trSum()?`<div class="w tag">${trSum()}</div>`:''}</div></div>
  <div class="bright"><div class="btab">${tabB(0,'装备')}${tabB(1,'时装')}${tabB(2,'翅膀')}${tabB(3,'药水')}${tabB(4,'道具')}</div>${right}<div class="dt">${dt}</div></div></div>`;
  drawDoll($('doll'))}
// 背包操作(按钮、左键菜单、拖动共用):a = 操作,r = 物品位置
function bagAct(a,r){const it=itOf(r);hideTip();CSC=0;let keep=0;
  if(a=='eq'&&it&&r[0]=='b'){const i=+r.slice(1),old=EQ[it.slot];EQ[it.slot]=it;BAG.splice(i,1);if(old)BAG.push(old);bmsg='已穿戴 '+nm(it)}
  else if(a=='un'&&it&&r[0]=='e'){if(BAG.length<BAGN){BAG.push(it);EQ[r.slice(2)]=null;bmsg='已卸下 '+nm(it)}else bmsg='装备栏满了,先整理一下背包'}
  else if(a=='sell'&&it&&/^(b\d|e:)/.test(r)){const c=sellPr(it);if(it.mss)msOff(it);gold+=c;if(r[0]=='b')BAG.splice(+r.slice(1),1);else EQ[r.slice(2)]=null;bmsg='出售 '+nm(it)+',获得 '+c+' 金币';sfx('coin')}
  else if(a=='cw'||a=='cu'){const id=cosId(r);if(id){wearC(id,a=='cw');bmsg=(a=='cw'?'已穿戴「':'已卸下「')+COSD[id].n+'」'}}
  else if(a=='csell'){const id=cosId(r);if(id&&OWN.includes(id)){if(WEAR[COSD[id].t]==id)wearC(id,false);OWN=OWN.filter(q=>q!=id);gold+=COSSELL;sfx('coin');bmsg='出售「'+COSD[id].n+'」,获得 '+COSSELL+' 金币'}}
  else if(a=='pu'&&r.startsWith('p:')){keep=1;const k=r.slice(2);if(potUse(k))bmsg='使用了 '+POTD[k][0];else bmsg=POTD[k][2]=='hp'&&P.hp>=stats().hp?'生命已满,不需要喝药':POTD[k][2]=='mp'&&P.mp>=stats().mp?'魔力已满,不需要喝药':'现在不能使用'}
  else if(/^q[012]$/.test(a)&&r.startsWith('p:')){keep=1;QS[+a[1]]=r.slice(2);bmsg='快捷栏 '+(+a[1]+1)+' 设为「'+POTD[r.slice(2)][0]+'」'}
  else if((a=='ps1'||a=='psa')&&r.startsWith('p:')){keep=1;const k=r.slice(2),g=potSell(k,a=='ps1'?1:POT[k]||0);if(g)bmsg='出售 '+POTD[k][0]+',获得 '+g+' 金币'}
  else if((a=='is1'||a=='isa')&&r.startsWith('i:')){keep=1;const id=r.slice(2),pr=itemPr(id),n=Math.min(a=='is1'?1:1e9,itemCnt(id));if(pr&&n>0){if(id=='egg')MAT.egg-=n;else if(id[0]=='T'){R19.ats.splice(+id.slice(1),1);sel=null}else if(MISC[id])MAT[id]-=n;else STN[+id[1]][+id[2]]-=n;gold+=pr*n;sfx('coin');bmsg='出售 '+n+' 个,获得 '+pr*n+' 金币'}}
  else if(a=='iu'&&r.startsWith('i:')){keep=1;bmsg=itemUse(r.slice(2))}
  else if(/^ms_/.test(a)&&r.startsWith('i:')){keep=1;bmsg=msEquip(r.slice(2),a.slice(3))}
  else if(/^cz_/.test(a)&&r.startsWith('i:')){keep=1;bmsg=curseUse(r.slice(2),a.slice(3))}
  else if((a=='czy'||a=='czn')&&r.startsWith('i:')){keep=1;bmsg=cursePick(a=='czy')}
  else if(a=='msx'&&it)bmsg=msOff(it);
  if(!keep)sel=null;else if(sel!=r)sel=r;const S=stats();P.hp=Math.min(P.hp,S.hp);P.mp=Math.min(P.mp,S.mp);save();renderBag()}
