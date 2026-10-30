// ===== 第三十三轮:制作材料 · 洗脸券 · 增幅宝石 · 制作书 · 锻造石(熔炉)=====
// 材料:[名称, 商城(g 金币 / k 击杀点), 价格];图标都在 MENI 图集(7Soul1 496 RPG icons,CC0,build_meni.py 第 26 格起)
const MATD={steel:['低碳钢','g',4000],rhino:['犀牛皮','g',4000],silk:['绢帛','g',3000],gthr:['金丝线','g',6000],flax:['亚麻','k',40],glue:['动物皮胶','k',60]};  // 第四十五轮:材料 ×5(金币)/ ×4(击杀点)
Object.assign(MENI.P,{steel:26,rhino:27,silk:28,gthr:29,flax:30,glue:31,wash:32,amp_cr:33,amp_atk:34,amp_hp:35,amp_def:36,book:37,fg1:38,fg2:38,fg3:38,fg4:38,fg5:38,b360:42,hwq:43});
const FGN=['','一','二','三','四','五'];
for(const k in MATD)MISC[k]=[MATD[k][0],`装备和其他道具的制作材料,在 🔥 熔炉制作时使用。在 🏪 商城的${MATD[k][1]=='g'?'金币':'击杀点'}商店购买。`,'',MATD[k][1]=='g'?Math.floor(MATD[k][2]/4):0];
// 第四十二轮:360 小鸟碎片(第十三关首领掉落,真~火之武器的材料)· 武器幻化券(熔炉「武器幻化」:给剑 / 法杖加一种特性,只算套装件数,不加属性)
MISC.b360=['360小鸟碎片','第十三关「熔心火山」首领 35% 掉落(双倍爆率卡翻倍)。制作「真~火之大剑 / 真~火之法杖」的材料。','',0];
MISC.hwq=['武器幻化券','在 🔥 熔炉「武器幻化」里使用:给剑或法杖加上一种特性(怒雷 / 圣愈 / 邪灵 / 神技 / 热血,自己选),只算套装件数、不增加属性;已经有特性的武器会换成新的。用「武器幻化券」制作书在熔炉「道具制作」页制作。','',0];
MISC.wash=['洗脸券','在 🔥 熔炉「洗练」里使用:把一件装备的 3 条绿字全部重新随机一次(种类和数值都重新随机)。击杀点商店购买。','',0];
for(const k in AMP)MISC['amp_'+k]=[AMP[k][0],`增幅宝石:在 🔥 熔炉「增幅宝石」里镶嵌到装备、时装或翅膀上(8 个部位都能用),${AMP[k][2]} +${Math.round(AMP[k][1]*100)}%(加在基础数值上)。每件只能镶 1 颗,新的会覆盖旧的,不能拆下。击杀点商店购买。`,'',0];
for(let k=1;k<=FGMX;k++)MISC['fg'+k]=[FGN[k]+'级锻造石',`在 🔥 熔炉「锻造」里使用:把锻造 ${k-1} 级的装备提升到 ${k} 级(白字 +${k*FGK*100}%)。用「${FGN[k]}级锻造」制作书在熔炉制作。`,'',0];
Object.assign(KPIT,{flax:['亚麻',40,'制作材料'],glue:['动物皮胶',60,'制作材料'],wash:['洗脸券',90,'刷新一件装备的 3 条绿字'],amp_cr:['暴击宝石',600,'增幅宝石:暴击率 +15%'],amp_atk:['攻击宝石',600,'增幅宝石:攻击力 +3%'],amp_hp:['HP宝石',600,'增幅宝石:生命值 +6%'],amp_def:['防御宝石',600,'增幅宝石:防御力 +4%']});  // 第四十五轮:×3~4
KPFIX.push('flax','glue','wash','amp_cr','amp_atk','amp_hp','amp_def');
// 制作书(买一次永久学会,存在 R19.rc):大师头饰 / 战甲 / 项链 / 指环 × 五种特性;一~五级锻造
const MSL=['head','body','ear','ring'],MSN={head:'头饰',body:'战甲',ear:'项链',ring:'指环'};
const RCP={};for(const s of MSL)for(const t of TRK)RCP['m'+s+'_'+t]={n:'大师'+MSN[s]+' · '+TRT[t][0],kp:400,s,t};for(let k=1;k<=FGMX;k++)RCP['f'+k]={n:FGN[k]+'级锻造',kp:150*k,k};  // 第四十五轮:制作书 150 → 400,锻造书 60k → 150k
RCP.xf_sword={n:'真~火之大剑',kp:800,fw:'sword'};RCP.xf_staff={n:'真~火之法杖',kp:800,fw:'staff'};RCP.hw={n:'武器幻化券',kp:320,hw:1};  // 第四十二轮
// 配方:材料数量 + 金币(add = 合成添加剂)
// 第四十五轮(用户:一个特性的大师套要三星刷 30~40 遍):制作金币 ×20(头饰 / 项链 / 指环 60 万,战甲 80 万),一套 4 件合计约 273 万金币 + 2580 击杀点 + 4 瓶添加剂
const MREC={head:{steel:2,silk:3,gthr:2,flax:4,glue:2,add:1,gold:600000},body:{steel:4,rhino:3,gthr:1,flax:3,glue:3,add:1,gold:800000},ear:{steel:1,silk:2,gthr:4,flax:2,glue:2,add:1,gold:600000},ring:{steel:3,silk:1,gthr:3,flax:2,glue:2,add:1,gold:600000}};
const FREC=k=>({steel:2*k,rhino:k,gthr:k,glue:k,gold:450000*k});  // 第四十五轮:3000k → 45 万 × k(全身 6 件锻造 +1 约 281 万金币,三星刷 30~40 遍)  // 第三十七轮:金币 5000k → 3000k
const XFREC={steel:4,gthr:3,glue:3,add:10,b360:30,gold:1200000},HWREC={steel:2,silk:2,gthr:2,glue:2,add:1,gold:400000};  // 第四十八轮:小鸟碎片 3 → 30、添加剂 2 → 10  // 第四十五轮 ×20  // 第四十二轮:真~火之武器 / 武器幻化券
const recOf=id=>{const r=RCP[id];return r.s?MREC[r.s]:r.fw?XFREC:r.hw?HWREC:FREC(r.k)},rcOwn=id=>R19.rc.includes(id);
const matHave=k=>k=='gold'?gold:MAT[k]|0,matName=k=>k=='add'?'合成添加剂':MISC[k]?MISC[k][0]:k;
const rcIc=id=>{const r=RCP[id];return r.s?eqImg(gen(r.s,3,null,3,r.t,1)):r.fw?eqImg(gen(r.fw,3,null,4,null,1,0,2)):r.hw?mniEm('hwq'):mniEm('fg'+r.k)};
function rcBuy(id){const r=RCP[id];if(!r||rcOwn(id))return '';if(KP<r.kp)return '击杀点不足';KP-=r.kp;KPS+=r.kp;R19.rc.push(id);sfx('coin');save();return '📖 学会了「'+r.n+'」,去 🔥 熔炉制作'}
function matBuy(k,n){const d=MATD[k];if(!d||d[1]!='g')return '';const c=d[2]*n;if(gold<c)return '金币不足';gold-=c;MAT[k]=(MAT[k]|0)+n;sfx('coin');save();return '购买了 '+d[0]+' ×'+n+',放进背包「📦 道具」页'}
// 制作书在商城表格里的一行说明:做什么 + 材料
function rcDesc(id){const r=RCP[id];
  return (r.s?'熔炉制作「大师'+MSN[r.s]+'」(史诗,带'+TRT[r.t][0]+'特性)':r.fw?'把「火之'+(r.fw=='sword'?'大剑':'法杖')+'」升级成真~版本(强 20%)':r.hw?'制作武器幻化券(给剑 / 法杖加特性)':'制作'+FGN[r.k]+'级锻造石(锻造 '+(r.k-1)+' → '+r.k+' 级)')+'<br><span class="tag">买一次永久学会;材料在熔炉里看</span>'}
// 熔炉界面状态:t 页签 · rc 选中的配方 · e 选中的装备(b序号 / e:部位 / k:时装id)· a 选中的增幅宝石 · pg 配方页码 · ok 覆盖确认
const FZ={t:0,rc:null,e:null,a:null,pg:0,ok:0},FZT=['装备制作','道具制作','锻造','洗练','增幅宝石','属性石','强化石合成','武器幻化'];
function fzAct(r){if(!/^z[a-z]/.test(r))return 0;
  if(r.startsWith('zt')){FZ.t=+r.slice(2);FZ.rc=null;FZ.e=null;FZ.a=null;FZ.pg=0;FZ.ok=0}
  else if(r.startsWith('zs_')){FZ.rc=r.slice(3);FZ.ok=0}else if(r.startsWith('zp'))FZ.pg=Math.max(0,FZ.pg+(+r.slice(2)))
  else if(r.startsWith('ze_')){FZ.e=r.slice(3);FZ.ok=0}else if(r.startsWith('za_')){FZ.a=r.slice(3);FZ.ok=0}
  else if(r=='zbuy'){pn='mall';mallTab=FZ.t==0||FZ.t==1?0:1}
  else if(r=='zgo')fmsg=fzGo();return 1}
function fzGo(){const t=FZ.t;
  if(t<=1){const id=FZ.rc,R=id&&RCP[id];if(!R)return '先在右边选一个配方';if(!rcOwn(id))return '还没学会「'+R.n+'」(在 🏪 商城击杀点商店购买制作书)';const q=recOf(id);for(const k in q)if(matHave(k)<q[k])return matName(k=='gold'?'':k)+(k=='gold'?'金币':'')+'不足';
    const fw0=R.fw?fwSrc(R.fw):null;if(R.fw&&!fw0)return '需要一把「火之'+(R.fw=='sword'?'大剑':'法杖')+'」(神秘副本 4 首领掉落;背包里或身上的都行)';
    if(R.s&&BAG.length>=BAGN)return '背包已满';for(const k in q){if(k=='gold')gold-=q[k];else MAT[k]-=q[k]}
    if(R.fw){const o=fw0.it,it=fireW(R.fw,2);for(const k of ['en','ev','gem','mss','fg','amp','tr'])if(o[k]!=null)it[k]=o[k];if(fw0.b>=0)BAG[fw0.b]=it;else EQ[R.fw]=it;sfx('fuse');save();return '🔥 升级成功:'+o.n+' → '+it.n+'(强化 / 锻造 / 镶嵌 / 技能石都保留)'}
    if(R.hw){MAT.hwq=(MAT.hwq|0)+1;sfx('fuse');save();return '🔥 制作成功:武器幻化券(在「武器幻化」页使用)'}
    if(R.s){const it=gen(R.s,3,'大师'+MSN[R.s]+'·'+TRT[R.t][0],3,R.t,0,1);BAG.push(it);sfx('fuse');save();return '🔥 制作成功:'+it.n+'(已放进背包)'}MAT['fg'+R.k]=(MAT['fg'+R.k]|0)+1;sfx('fuse');save();return '🔥 制作成功:'+MISC['fg'+R.k][0]}
  const it=fIt(FZ.e);if(!it)return '先在右边选一件装备';
  if(t==7){if(it.cos||(it.slot!='sword'&&it.slot!='staff'&&it.slot!='fist'))return '只能幻化武器(剑 / 法杖 / 拳套)';const a=FZ.a;if(!a||!TRT[a])return '先选一种特性';if(it.tr==a)return '这把武器已经是「'+TRT[a][0]+'」了';if(!(MAT.hwq>0))return '需要 1 张武器幻化券';if(it.tr&&!FZ.ok){FZ.ok=1;return ''}
    MAT.hwq--;it.tr=a;FZ.ok=0;sfx('fuse');save();return '✨ 幻化成功:'+nm(it)+' 带上了「'+TRT[a][0]+'」特性(套装件数 +1)'}
  if(t==2){const k=(it.fg||0)+1;if(k>FGMX)return '已经锻造到最高 '+FGMX+' 级';if(!(MAT['fg'+k]>0))return '需要 1 颗'+MISC['fg'+k][0];MAT['fg'+k]--;it.fg=k;sfx('fuse');save();return '🔨 锻造成功:'+nm(it)+' 锻造 '+k+' 级('+(it.cos?cosW(it.slot,k):'白字 +'+k*FGK*100+'%')+')'}
  if(t==3){if(it.cos)return '时装 / 翅膀没有绿字';if(!(MAT.wash>0))return '需要 1 张洗脸券';MAT.wash--;greenRoll(it);sfx('buff');save();return '🧼 洗练完成:'+it.gr.map(([k,v])=>NM[k]+' +'+v).join(' · ')}
  if(t==4){const a=FZ.a;if(!a||!AMP[a])return '先选一种增幅宝石';if(!(MAT['amp_'+a]>0))return '没有'+AMP[a][0];if(it.amp&&!FZ.ok){FZ.ok=1;return ''}MAT['amp_'+a]--;it.amp=a;FZ.ok=0;sfx('fuse');save();return '💎 镶嵌成功:'+nm(it)+' '+AMP[a][0]}
  return ''}
// 熔炉界面(第三十三轮,参考用户给的「物品制作」布局):左边火焰法阵(MG27 mc-fire)上一圈材料格 + 中间成品,下面金币和按钮;右边页签 + 配方卡片 / 装备列表
function rFuse(){const t=FZ.t;let h=hd('🔥 熔炉')+fm()+`<div class="fzt">${FZT.map((n,i)=>`<button data-p="zt${i}" class="${t==i?'on':''}">${n}</button>`).join('')}</div>`;
  if(t==5)return h+rGem();
  if(t==6)return h+rStnFuse();
  const ring=(center,mats,goldN,btn,note)=>{const n=mats.length;return `<div class="fzl"><div class="ring">${mats.map((m,i)=>{const a=-Math.PI/2+i*2*Math.PI/Math.max(n,1),ok=m.have>=m.need;return `<div class="rm" style="left:${50+40*Math.cos(a)}%;top:${50+40*Math.sin(a)}%"><span class="cl">${m.ic}<i class="cn ${ok?'':'no'}">${m.have}/${m.need}</i></span><small>${m.n}</small></div>`}).join('')}<div class="rcn"><span class="cl">${center||''}</span></div></div>`+
    `<div class="fzg">${goldN?`需要金币 <b style="color:${gold>=goldN?'inherit':'#c92a2a'}">${goldN}</b>`:'&nbsp;'}</div><div class="fzb">${btn}<button data-p="zbuy">🏪 购买</button></div>${note?`<div class="tag">${note}</div>`:''}</div>`};
  let L='',R='';
  if(t<=1){const ids=Object.keys(RCP).filter(id=>t==0?RCP[id].s||RCP[id].fw:RCP[id].k||RCP[id].hw),PG=4,np=Math.ceil(ids.length/PG);FZ.pg=Math.min(FZ.pg,np-1);
    const cic=rcIc;
    R=`<div class="fzcs">${ids.slice(FZ.pg*PG,FZ.pg*PG+PG).map(id=>`<button class="fzc${FZ.rc==id?' on':''}" data-p="zs_${id}"><b>${RCP[id].n}</b><span class="fzi">${cic(id)}</span><span class="tag">${rcOwn(id)?'✅ 已学会':'🔒 未学会 · 制作书 ⚔️ '+RCP[id].kp}</span></button>`).join('')}</div><div class="fzpg"><button data-p="zp-1" ${FZ.pg>0?'':'disabled'}>上一页</button> ${FZ.pg+1} / ${np} <button data-p="zp1" ${FZ.pg<np-1?'':'disabled'}>下一页</button></div>`;
    const id=FZ.rc,q=id?recOf(id):null;
    const fwr=id&&RCP[id].fw;
    L=ring(id?cic(id):'',(fwr?[{ic:eqImg(fireW(fwr,1)),n:FWN[fwr][1],have:fwSrc(fwr)?1:0,need:1}]:[]).concat(q?Object.keys(q).filter(k=>k!='gold').map(k=>({ic:k=='add'?mniEm('add'):mniEm(k),n:matName(k),have:matHave(k),need:q[k]})):[]),q?q.gold:0,`<button data-p="zgo" ${id&&rcOwn(id)?'':'disabled'}>${fwr?'🔥 升级':'🔨 制作'}</button>`,
      id?(rcOwn(id)?(RCP[id].fw?'真~火之武器:用一把火之武器 + 材料升级(强化、锻造、属性石、技能石都保留),白字和绿字是机械史诗的 1.32 倍(火之武器的 1.2 倍)。':RCP[id].hw?'武器幻化券:在「武器幻化」页给剑 / 法杖加一种特性。':t==0?'大师装备:史诗品质,白字和绿字是最高系列史诗的 1.2 倍,带「'+TRT[RCP[id].t][0]+'」特性。':'锻造石:在「锻造」页把装备的白字提升一级。'):'还没学会,先在 🏪 商城击杀点商店买「'+RCP[id].n+'」制作书。'):'在右边选一个配方。制作书买一次永久学会;材料在商城购买(低碳钢 / 犀牛皮 / 绢帛 / 金丝线:金币商店 · 亚麻 / 动物皮胶:击杀点商店)。')}
  else{const it=fIt(FZ.e),pk=(q,r)=>`<button class="pk${FZ.e==r?' on':''}" data-p="ze_${r}" style="border-color:${q.cos?'#f783ac':TR[q.tier][1]}" title="${nm(q)}">${q.cos?'<span style="font-size:22px">'+COSD[q.cos].ic+'</span>':eqImg(q)}${q.en?'<sup>+'+q.en+'</sup>':''}${t==2&&q.fg?`<i class="tm" style="background:#fab005">锻${q.fg}</i>`:''}${t==4&&q.amp?'<i class="tm" style="background:#e64980">◆</i>':''}</button>`;
    const wOK=q=>t!=7||q.slot=='sword'||q.slot=='staff'||q.slot=='fist';  // 武器幻化:只列剑 / 法杖
    R=`<div class="tag">已穿戴</div><div class="row" style="border:0">${ALL.map(k=>EQ[k]&&wOK(EQ[k])?pk(EQ[k],'e:'+k):'').join('')||'<span class="tag">无</span>'}</div>`+(t==4||t==2?`<div class="tag">时装 / 翅膀</div><div class="row" style="border:0">${OWN.map(id=>pk(cosIt(id),'k:'+id)).join('')||'<span class="tag">无</span>'}</div>`:'')+`<div class="tag">背包</div><div class="row" style="border:0">${BAG.map((q,i)=>wOK(q)?pk(q,'b'+i):'').join('')||'<span class="tag">空</span>'}</div>`+(it?`<p><b style="color:${it.cos?'#f783ac':TR[it.tier][1]}">${nm(it)}</b><br>${ST(it)}</p>`:'');
    if(t==7){const a=FZ.a,w=it&&!it.cos&&(it.slot=='sword'||it.slot=='staff'||it.slot=='fist');R=`<div class="row" style="border:0">${TRK.map(k=>`<button class="${a==k?'on':''}" data-p="za_${k}"><b style="color:${TRT[k][1]}">${TRT[k][0]}</b></button>`).join('')} <span class="tag">选一种特性</span></div>`+(a&&TRT[a]?`<div class="tag">${trDesc(a)}</div>`:'')+R;
      L=ring(w?eqImg(it):'',w?[{ic:mniEm('hwq'),n:'武器幻化券',have:MAT.hwq|0,need:1}]:[],0,`<button data-p="zgo" ${w&&a&&MAT.hwq>0?'':'disabled'}>${w&&it.tr&&FZ.ok?'确定替换':'✨ 幻化'}</button>`,w&&it.tr&&FZ.ok?`<b style="color:#c92a2a">这把武器已经是「${TRT[it.tr][0]}」,幻化后会换成新的特性,确定吗?</b>`:'给剑或法杖加上一种特性:只算套装件数(头饰 / 战甲 / 戒指 / 项链 + 剑 + 法杖,最多 6 件),不增加任何属性。武器幻化券用制作书在「道具制作」页制作。')}
    if(t==2){const k=it?(it.fg||0)+1:0,ok=k&&k<=FGMX;L=ring(it?(it.cos?'<span style="font-size:30px">'+COSD[it.cos].ic+'</span>':eqImg(it)):'',ok?[{ic:mniEm('fg'+k),n:MISC['fg'+k][0],have:MAT['fg'+k]|0,need:1}]:[],0,`<button data-p="zgo" ${ok&&MAT['fg'+k]>0?'':'disabled'}>🔨 锻造</button>`,it?(it.cos&&ok?`锻造 ${k-1} → ${k} 级:白字百分比 ×${(1+k*FGK).toFixed(1)}(${cosW(it.slot,k)};最高 ${FGMX} 级)。`:ok?`锻造 ${k-1} → ${k} 级:白字 +${k*FGK*100}%(最高 ${FGMX} 级)。锻造石在「锻造石制作」页制作。`:'已经锻造到最高级。'):'在右边选一件装备 / 时装 / 翅膀。锻造只提升白字,每级 +10%,最高 5 级(时装 / 翅膀:10% → 15%)。')}
    if(t==3)L=ring(it&&!it.cos?eqImg(it):'',it&&!it.cos?[{ic:mniEm('wash'),n:'洗脸券',have:MAT.wash|0,need:1}]:[],0,`<button data-p="zgo" ${it&&!it.cos&&MAT.wash>0?'':'disabled'}>🧼 洗练</button>`,it?(it.cos?'时装 / 翅膀没有绿字。':'消耗 1 张洗脸券,3 条绿字的种类和数值全部重新随机(不能只刷一条;每条单独随机,可能出现相同的属性)。'):'在右边选一件装备。洗脸券在 🏪 商城击杀点商店购买。');
    if(t==4){const a=FZ.a;R=`<div class="row" style="border:0">${Object.keys(AMP).map(k=>`<button class="pk${a==k?' on':''}" data-p="za_${k}" title="${AMP[k][0]}">${mniEm('amp_'+k)}<i class="cn">${MAT['amp_'+k]|0}</i></button>`).join('')} <span class="tag">选一种增幅宝石</span></div>`+R;
      L=ring(it?(it.cos?'<span style="font-size:30px">'+COSD[it.cos].ic+'</span>':eqImg(it)):'',a?[{ic:mniEm('amp_'+a),n:AMP[a][0],have:MAT['amp_'+a]|0,need:1}]:[],0,`<button data-p="zgo" ${it&&a&&MAT['amp_'+a]>0?'':'disabled'}>${it&&it.amp&&FZ.ok?'确定覆盖':'💎 镶嵌'}</button>`,it&&it.amp&&FZ.ok?`<b style="color:#c92a2a">这件已经镶了「${AMP[it.amp][0]}」,镶新的会覆盖旧的,确定吗?</b>`:'暴击宝石 +15% · 攻击宝石 +3% · HP宝石 +6% · 防御宝石 +4%(都加在基础数值上)。8 个部位都能镶,每件 1 颗,新的覆盖旧的,不能拆下。')}}
  return h+`<div class="fz">${L}<div class="fzr">${R}</div></div>`}

