// ===== 第四十三轮:表格货架(用户:商城 / 仓库太乱,容易看错行买错;照用户给的「勇者商城」示例图做成表格)=====
// 两列,每行 = 图片 | 名称 | 说明 | 单价 | 数量 / 操作,每行一个独立的框;每页 MTPG 行,上一页 / 下一页;顶上分类,底下货币栏
// TBL.pg[表] 页码 · TBL.q[商品] 购买数量 · TBL.c[商店] 分类;按钮 tp_表_±1 翻页、tq_商品_±1 改数量、tc_商店_分类
const MTPG=6,TBL={pg:{},q:{},c:{}};
function mtTable(id,rows,hd,o){o=o||{};const per=o.per||MTPG,np=Math.max(1,Math.ceil(rows.length/per)),pg=TBL.pg[id]=Math.min(TBL.pg[id]|0,np-1);
  const H=`<div class="mth"><span>图片</span><span>名称</span><span>${hd[0]}</span><span>${hd[1]}</span><span>${hd[2]}</span></div>`;
  let h=`<div class="mtb${o.one?' one':''}">${H}${o.one?'':H}`+(rows.length?rows.slice(pg*per,pg*per+per).map(r=>`<div class="mtr ${r.cl||''}"><span class="mi">${r.ic||''}</span><span class="mn"${r.nc?` style="color:${r.nc}"`:''}><div>${r.n}</div></span><span class="md"><div>${r.d||''}</div></span><span class="mp"><div>${r.p||''}</div></span><span class="mq">${r.a||''}</span></div>`).join(''):`<div class="mtr nil"><span>${o.nil||'没有东西'}</span></div>`)+`</div>`;
  if(np>1)h+=`<div class="mtp"><button data-p="tp_${id}_-1" ${pg>0?'':'disabled'}>上一页</button><span>${pg+1} / ${np}</span><button data-p="tp_${id}_1" ${pg<np-1?'':'disabled'}>下一页</button></div>`;
  return h}
const mtQ=k=>Math.max(1,TBL.q[k]||1),mtQB=k=>`<button class="qa" data-p="tq_${k}_-1">▼</button><b class="qn">${mtQ(k)}</b><button class="qa" data-p="tq_${k}_1">▲</button>`;
const mtImg=(u,sq)=>u?`<img class="${sq?'sq':''}" src="${u}" alt="">`:'';
function mtAct(r){if(!/^t[pqc]_/.test(r))return 0;const i=r.lastIndexOf('_'),k=r.slice(3,i),v=r.slice(i+1);
  if(r[1]=='p')TBL.pg[k]=Math.max(0,(TBL.pg[k]|0)+(+v));else if(r[1]=='q')TBL.q[k]=Math.max(1,Math.min(99,mtQ(k)+(+v)));else{TBL.c[k]=v;TBL.pg[k]=0}return 1}
const MCAT={g:[['all','全部'],['pal','伙伴'],['book','书籍'],['mat','材料']],k:[['all','全部'],['it','道具'],['gem','宝石'],['rc','制作书'],['cos','时装翅膀']]};
function rMall(){const tb=(i,l)=>`<button data-p="mt${i}" class="${mallTab==i?'on':''}">${l}</button>`,sh=mallTab?'k':'g',ca=TBL.c[sh]||'all',L=[],add=(c,r)=>{if(ca=='all'||ca==c)L.push(r)};
  let h=`<div class="bh"><b>🏪 商城</b><span><button data-p="x">✕ 关闭</button></span></div><div class="mtk">${tb(0,'💰 金币商店')}${tb(1,'⚔️ 击杀点商店')}<span style="width:18px"></span>${MCAT[sh].map(([c,n])=>`<button data-p="tc_${sh}_${c}" class="${ca==c?'on':''}">${n}</button>`).join('')}</div>`+fm();
  const btn=(dp,ok,t)=>`<button data-p="${dp}" ${ok?'':'disabled'}>${t||'购买'}</button>`;
  if(!mallTab){
    add('pal',{ic:mtImg(pvImg('spr'),1),n:'🧚 精灵',d:'跟随在身边;吸收装备升级,每级 1 个分配点(生命 / 魔力 / 暴击 / 闪避 / 攻击 / 防御),满级 50。只买一次',p:'💰 '+SPRP_,a:SPR.own?'✓ 已拥有':btn('bspr',gold>=SPRP_),cl:SPR.own?'own':''});
    add('pal',{ic:mtImg(pvImg('pet'),1),n:'🐤 钢盔小鸡',d:'宠物,跟着打怪升级;满级 20,每 5 级随机领悟一个技能。只买一次',p:'💰 '+PETP_,a:PET.own?'✓ 已拥有':btn('bpet',gold>=PETP_),cl:PET.own?'own':''});
    BOOKS.forEach((b,i)=>add('book',{ic:mtImg(BOOK.U[i],1),n:'📖 '+b.n,d:BKDS[i]+'<br><span class="tag">放在主城书架上,站在书架前按 W 阅读</span>',p:'💰 '+BKP,a:bkOwn(i)?'✓ 已在书架':btn('bbk'+i,gold>=BKP),cl:bkOwn(i)?'own':''}));
    for(const k of Object.keys(MATD).filter(k=>MATD[k][1]=='g')){const d=MATD[k],q=mtQ(k);add('mat',{ic:mniEm(k),n:d[0],d:'制作材料(🔥 熔炉制作大师装备 / 锻造石)<br><span class="tag">持有 '+(MAT[k]|0)+'</span>',p:'💰 '+d[2],a:mtQB(k)+btn(`gm_${k}_${q}`,gold>=d[2]*q)})}}
  else{
    const kg=k=>/^(ats|lk|amp)/.test(k)?'gem':'it';
    for(const k of KPFIX){const d=KPIT[k],q=mtQ(k);add(kg(k),{ic:kpIc(k),n:d[0],d:d[2]+`<br><span class="tag">持有 ${kpHave(k)}</span>`,p:'⚔️ '+d[1],a:mtQB(k)+btn('kb_'+k,KP>=d[1]*q)})}
    for(const id in RCP){const r=RCP[id],o=rcOwn(id);add('rc',{ic:rcIc(id),n:'📖 '+r.n,nc:r.t?TRT[r.t][1]:'',d:rcDesc(id),p:'⚔️ '+r.kp,a:o?'✓ 已学会':btn('rb_'+id,KP>=r.kp),cl:o?'own':''})}
    for(const id in COSD){const d=COSD[id],own=OWN.includes(id),on=WEAR[d.t]==id;add('cos',{ic:mtImg(pvImg(id)),n:d.ic+' '+d.n,d:(d.t=='fash'?'时装 · ':'翅膀 · ')+d.d+'<br><b>'+d.tr+'</b>',p:'⚔️ '+d.kp,a:own?btn((on?'cu_':'cw_')+id,1,on?'卸下':'穿戴'):btn('bc_'+id,KP>=d.kp),cl:own?'own':''})}}
  h+=mtTable('m'+sh+ca,L,['道具说明','单价','购买数量']);
  if(mallTab){mrDay();const left=MRMAX-R19.mr.n;
    h+=`<div class="msp"><b>特殊购买</b><span class="tag">(每买一次商城里的东西都会刷新「特殊购买」的物品 · 每天限 ${MRMAX} 次 · 合成添加剂、高级幸运宝石只在这里出现)</span></div>`+
      mtTable('mr',R19.mr.L.map(k=>{const d=KPIT[k];return {ic:kpIc(k),n:d[0],d:d[2],p:'⚔️ '+d[1],a:`<b class="qn">${left}次</b>`+btn('kr_'+k,KP>=d[1]&&left>0),cl:'sp'}}),['道具说明','单价','剩余次数'])}
  const v=isVip();
  h+=`<div class="mtf"><span>💰 金币:<b>${gold}</b></span><span>⚔️ 击杀点:<b>${KP}</b></span><span title="${VIPB.join(' · ')}">👑 VIP:<b>${v?'已开通':'累计消费 '+KPS+' / '+VIPN}</b></span></div>`+
    `<div class="tag">每次通关奖励 ${KPCL}+${KPLV}×关卡 击杀点(二星 ×1.3、三星 ×1.7${v?',VIP 再 ×1.25':''})· 每天 📅 签到 1~100 · VIP:${VIPB.map(q=>(v?'✅ ':'🔒 ')+q).join(' · ')}</div>`;
  return h}
