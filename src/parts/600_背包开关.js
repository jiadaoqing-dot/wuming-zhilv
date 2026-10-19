function toggleBag(){if((st!='play'&&st!='town')||skOpen||pn)return;bagOpen=!bagOpen;hideTip();closeCM();CSC=0;keys.l=keys.r=0;ah=0;ar=0;sel=null;bsq=null;bmsg='';$('bag').hidden=!bagOpen;if(bagOpen)renderBag();else save()}
// 词条范围:用同部位 / 品质 / 系列的基础值 ±10% 算出来(乘上强化倍率)
// 第三十三轮:一行文字版属性(商店 / 仓库 / 强化面板用):白字(含锻造)· 绿字(绿色)· 强化值(橙色)· 属性石(蓝)· 增幅宝石
const NM={atk:'攻击',def:'防御',hp:'生命',mp:'魔力',cr:'暴击',dg:'闪避'};
const ampTxt=k=>`<span style="color:#e64980">◆ ${AMP[k][0]}:${AMP[k][2]} +${Math.round(AMP[k][1]*100)}%</span>`;
const cosW=(t,fg)=>Object.keys(COSW[t]).map(k=>({hp:'生命值',atk:'攻击力',def:'防御力',cr:'暴击率'}[k])+' +'+Math.round(cosV(t,k,fg)*100)+'%').join(' ');
const ST=it=>{if(it.cos)return cosW(it.slot,it.fg)+(it.ev?` <span style="color:#e8590c">${NM[EQE[it.slot][0]]}+${it.ev}</span>`:'')+(it.amp?' '+ampTxt(it.amp):'');
  const a=Object.keys(it.s).map(k=>NM[k]+'+'+wv(it,k));for(const [k,v] of it.gr||[])a.push(`<span style="color:#2f9e44">${NM[k]}+${v}</span>`);if(it.ev)a.push(`<span style="color:#e8590c">${NM[EQE[it.slot][0]]}+${evV(it)}</span>`);
  return a.join(' ')+(it.gem?' '+gemTxt(it,'#1c7ed6'):'')+(it.amp?' '+ampTxt(it.amp):'')+(it.cu?' '+cuTxt(it):'')};
const gemTxt=(it,c)=>`<span style="color:${c}">◆ ${atsTxt(it.gem)}</span>`;
const cosTip=id=>{const d=COSD[id],c=cosIt(id);return `<b style="color:#f783ac;font-size:13.5px">${d.ic} ${d.n}${c.en?' +'+c.en:''}</b><br><span class="tg">部位:${d.t=='fash'?'时装':'翅膀'} · 击杀点商店<br>强化:${c.en?'+'+c.en:'未强化'}${c.en>=ENMAX()?' <b style="color:#ff922b">(已达上限)</b>':' / 上限 +'+ENMAX()}</span><hr>`+
  `<span style="color:#fff">${cosW(d.t,c.fg)}</span> <span class="tg">(加在基础数值上${c.fg?',锻造 '+c.fg+' 级':''})</span><br>${c.ev?`<span style="color:#ff922b">强化 +${c.en}:${NM[EQE[d.t][0]]} +${c.ev}</span>`:`<span class="tg">强化:每级 ${NM[EQE[d.t][0]]} +固定值</span>`}<br>${c.amp?ampTxt(c.amp):'<span class="tg">增幅宝石:未镶嵌</span>'}${c.cu?'<br>'+cuTxt(c):''}<hr>${d.d}<hr><b style="color:#ffd43b">${d.tr}</b>`};
// 装备悬停说明(用户第三十三轮给的顺序):名字 / 锻造等级 / 部位 / 品质 / 强化是否上限 —— 白色属性 / 绿色属性 / 强化属性 / 增幅宝石 —— 属性石 / 装备介绍
function tipItem(it,from){const q=TR[it.tier],ek=EQE[it.slot][0];
  let h=`${eqImg(it,'eqt')}<b style="color:${it.tr?TRT[it.tr][1]:q[1]};font-size:13.5px">${nm(it)}</b><br><span class="tg">锻造:${it.fg?'<b style="color:#ffd43b">'+it.fg+' 级</b>':'未锻造'}(最高 ${FGMX} 级)<br>部位:${SL[it.slot][0]}<br>品质:${q[0]} · ${it.m2?'<b style="color:#ffd43b">大师二阶</b>':it.ms?'大师制作':it.fw?'火焰武器(机械史诗 ×'+FWK[it.fw]+')':SER[it.g||0].n+'系列'}<br>强化:${it.en?'+'+it.en:'未强化'}${(it.en||0)>=ENMAX()?' <b style="color:#ff922b">(已达上限)</b>':'(上限 +'+ENMAX()+')'}</span><hr>`;
  h+=Object.keys(it.s).map(k=>`<span style="color:#fff">${NM[k]} +${wv(it,k)}</span>${it.fg?` <span class="tg">(锻造 +${Math.round(it.fg*FGK*100*(it.m2?M2FG:1))}%)</span>`:''}`).join('<br>');
  h+='<br>'+(it.gr&&it.gr.length?it.gr.map(([k,v])=>{const r=gRng(it,k);return `<span style="color:#69db7c">${NM[k]} +${v}</span> <span class="tg">(${r[0]} ~ ${r[1]})</span>`}).join('<br>'):'<span class="tg">绿字:到手时随机 3 条</span>');
  h+='<br>'+(it.ev?`<span style="color:#ff922b">强化 +${it.en}:${NM[ek]} +${evV(it)}</span>`:`<span class="tg">强化:每级 ${NM[ek]} +固定值</span>`);
  h+='<br>'+(it.amp?ampTxt(it.amp):'<span class="tg">增幅宝石:未镶嵌</span>')+'<hr>';
  h+=(it.gem?gemTxt(it,'#74c0fc'):'<span class="tg">属性石:未镶嵌</span>');
  if(it.cu)h+='<br>'+cuTxt(it)+` <span class="tg">(${cuRng(it.cu.k,it.cu.t)})</span>`;  // 第五十五轮:诅咒之力
  if(it.mss&&MISC[it.mss])h+=`<br><b style="color:#b197fc">💎 嵌着 ${MISC[it.mss][0]}</b>`;  // 第四十二轮
  if(it.tr)h+=`<br><b style="color:${TRT[it.tr][1]}">【${TRT[it.tr][0]}】${TRT[it.tr][2]}</b><br><span class="tg">${trDesc(it.tr)}</span><br><span class="tg">当前穿戴 ${TRT[it.tr][0]} ×${trCnt(it.tr)}(头饰 / 战甲 / 戒指 / 项链 + 剑 + 法杖都算,武器用「武器幻化券」加特性)${it.ms?' · <b style="color:#ffd43b">'+(it.m2?'大师二阶特性:效果 ×'+M2TR:'大师特性:效果翻倍')+'</b>(混穿时按件数平均,当前 ×'+trMul(it.tr).toFixed(2).replace(/\.?0+$/,'')+')':''}</span>`;
  if(it.m2&&it.tr)h+=`<br><b style="color:#ffd43b">【大师二阶 · 四件】</b><span class="tg">${M2D[it.tr]}(当前大师二阶 ${TRT[it.tr][0]} ×${m2Cnt(it.tr)},4 件生效)</span>`;  // 第五十七轮
  h+=`<br><span class="tg">${it.m2?'大师二阶:暗黑炼狱第 16 层首领掉落,目前最强的装备 —— 比大师一阶白字 / 绿字 ×'+M2W+'、强化效果 ×'+M2EN+'、锻造效果 ×'+M2FG+'、特性效果 ×'+M2TR+'。':it.ms?'大师工艺:用制作书在熔炉打造,按最高系列计算、白字和绿字再 ×1.2,是目前最强的装备;特性效果翻倍。':SER[it.g||0].n+'系列'+SL[it.slot][0]+'。'}白字只能用锻造石提升,绿字只能用洗脸券一起刷新。</span>`;
  const e=EQ[it.slot];if(from=='b'&&e)h+=`<hr><span class="tg">已穿戴:</span><br><b style="color:${TR[e.tier][1]}">${nm(e)}</b><br><span class="tg">${ST(e)}</span>`;
  h+=`<hr><span class="tg">售价 ${sellPr(it)} 金币 · ${from=='b'?'左键:穿戴 / 出售 · 双击直接穿戴 · 可拖到左边部位穿戴':'左键:卸下 / 出售 · 双击直接卸下 · 可拖到右边卸下'}</span>`;return h}
const itOf=r=>!r?null:r[0]=='b'?BAG[+r.slice(1)]:EQ[r.slice(2)];
const fIt=r=>r&&r.startsWith('k:')?(OWN.includes(r.slice(2))?cosIt(r.slice(2)):null):itOf(r);  // 强化师 / 熔炉:'k:时装id' = 时装或翅膀
function trSum(){const c=setTr(),ks=Object.keys(c);if(!ks.length)return '';
  return '特性 '+ks.map(k=>{const n=c[k],on=n>=2;return `<b style="color:${TRT[k][1]}">${TRT[k][0]}×${n}</b>${on?'':'<span class="tag">(未激活)</span>'}`}).join(' ')+'<br>'+(P.combo>0&&c.ji>=2?`<span class="tag">当前连击 ${P.combo}</span><br>`:'')}
// 纸娃娃:按已穿戴装备的品质颜色给发型、铠甲、耳坠、戒指上色,手里拿当前武器
// 道具背包里的条目:蛇蛋、高级幸运石、各级强化石(同种叠放在一格)
function itemList(){const L=[];if(MAT.soul>0)L.push(['soul','💠','女神灵魂碎片',MAT.soul]);if(MAT.job>0)L.push(['job','⚜️','转职凭证',MAT.job]);if(MAT.hegg>0)L.push(['hegg',heggEm(),'仓鼠宠物蛋',MAT.hegg]);if(MAT.egg>0)L.push(['egg','🥚','蛇蛋',MAT.egg]);if(LUCK>0)L.push(['luck',mniEm('luck'),'高级幸运宝石',LUCK]);
  for(const k in MISC)if(MAT[k]>0)L.push([k,mniEm(k),MISC[k][0],MAT[k]]);R19.ats.forEach((g,i)=>L.push(['T'+i,mniEm('A'+g.q),ATSQ[g.q].n,1]));for(let l=1;l<=3;l++)for(let q=3;q>=0;q--)if(STN[l][q]>0)L.push(['s'+l+q,stnEm(l,q),stnName(l,q),STN[l][q]]);return L}
const itemDesc=id=>id[0]=='T'?(g=>g?`${ATSQ[g.q].n}:<b style="color:#1c7ed6">${atsTxt(g)}</b>。在 🔥 熔炉镶嵌到装备上(每件装备 1 颗,新的会替换旧的;不能拆下,出售装备不返还)。出售价格 ${ATSQ[g.q].pr} 金币。`:'')(R19.ats[+id.slice(1)]):MISC[id]?MISC[id][1]+(id=='dbl'&&dblOn()?`<br><b>生效中,还剩 ${Math.ceil((R19.dbl-Date.now())/60000)} 分钟</b>`:'')+(/^ms\d+$/.test(id)?['sword','staff'].filter(k=>EQ[k]&&EQ[k].mss==id).map(k=>'<br><b>'+SL[k][0]+'上嵌着一颗</b>').join(''):'')+((id=='gc1'&&godOn('cr'))||(id=='gc2'&&godOn('pal'))?`<br><b>生效中,还剩 ${godLeft(id=='gc1'?'cr':'pal')}${id=='gc2'?'('+PALN[godOf().pk-1]+')':''}</b>`:''):id=='hegg'?'神秘地带「瓜子大王」掉落(5% 几率)。打开顶栏 🐤 宠物界面,花 10 分钟孵化成宠物仓鼠(已经有仓鼠时,多孵出来的小仓鼠会让它多嗑 3 次瓜子)。不能出售。':id=='soul'?'女神灵魂碎片:第四关首领「黑棘巨蝎」、第八关首领「怨婴 · 银太郎」、第十关首领「归蝇」、暗黑大陆第十三关首领「焚天炎君」各掉落一块。碎片里封着女神被夺走的一缕灵魂,在黑暗里会发出淡紫色的光。收集齐全后或许能让城里的女神像重新苏醒……不能出售。':id=='job'?'第六关首领「北极熊」掉落。打开技能栏(T),在剑士或法师页面里选择转职(只能转职一次)。不能出售。':id=='egg'?'迷雾森林的蛇掉落的蛋。每日任务会用到,也可以卖掉(每个 3 金币)。':id=='luck'?'强化时在强化师那里选用,本次强化成功率 +50%。完成每日任务或在商城随机物品栏购买。':`用于把装备强化到 +${id[1]*3-2} ~ +${id[1]*3}(每次消耗 1 颗),在强化师处使用。品质「${STQ[+id[2]].n}」:强化成功时这一级 +${Math.round(STQ[+id[2]].b*100)}% 装备属性(3 颗可在熔炉合成高一档品质)。出售价格 ${itemPr(id)} 金币 / 颗。`;
// 第五十二轮修:原来售价 0 的道具都卖不掉,补上售价(说明里写「不能出售」的剧情道具仍然不能卖)
const ITPR=id=>/^ms\d+$/.test(id)?1500:/^fg\d$/.test(id)?300*+id.slice(2):/^amp_/.test(id)?1000:({add:300,gc1:2000,gc2:2000,food:50,lk1:200,lk2:500,dbl:1000,flax:500,glue:500,b360:800,hwq:1500,wash:500,astr:2000})[id]||0;
const itemPr=id=>id[0]=='T'?(R19.ats[+id.slice(1)]?ATSQ[R19.ats[+id.slice(1)].q].pr:0):MISC[id]?(MISC[id][3]||ITPR(id)):id=='egg'?3:id=='luck'||id=='job'||id=='soul'||id=='hegg'?0:Math.floor(STP2[+id[1]]*STQ[+id[2]].p/2);
const itemCnt=id=>id[0]=='T'?(R19.ats[+id.slice(1)]?1:0):MISC[id]?MAT[id]|0:id=='hegg'?MAT.hegg||0:id=='soul'?MAT.soul||0:id=='job'?MAT.job||0:id=='egg'?MAT.egg||0:id=='luck'?LUCK:STN[+id[1]][+id[2]]||0;
const potTip=k=>{const d=POTD[k];return `<b style="color:${d[1]};font-size:13.5px">${d[0]}</b><br><span class="tg">药水 · 持有 ${POT[k]||0} 瓶${QS.includes(k)?' · 快捷栏 '+(QS.indexOf(k)+1):''}</span><hr>${d[2]=='rev'?'倒下时使用:原地复活,恢复 50% 生命和魔力,2.5 秒无敌':'立即恢复 '+potAmt(k)+' · 同类药水 '+POTCD+' 秒冷却'}<hr><span class="tg">左键:使用 / 放到快捷栏 / 出售${d[2]=='rev'?'':' · 双击使用'}</span>`};
const COSSELL=2000;let CSC=0;  // 出售时装 / 翅膀:二次确认
const cosId=r=>!r?null:r[0]=='w'?WEAR[r.slice(2)]:r[0]=='c'?r.slice(2):null;
