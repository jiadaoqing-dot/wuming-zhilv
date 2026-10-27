// ===== 第五十九轮(用户):GM 修改工具 —— GM 面板分页:原来的(基础)+ 道具材料 / 装备 / 属性石 / 增益与其它 =====
// 打开方式不变(F2 F3 F1 F2 F3 F3)。GM.tb 当前页;GM.es 装备页选中的装备('e:部位' 身上 / 'b:序号' 背包);GM.inf 无限材料 · GM.ig 无限金币 / 击杀点
const GMTB=['🛠️ 基础','📦 道具材料','⚔️ 装备','💠 属性石','✨ 增益与其它'];
const gmV=id=>{const e=$(id);return e?e.value:''},gmN=(id,d)=>{const v=+gmV(id);return Number.isFinite(v)?v:(d||0)};
const gmOpt=(L,cur)=>L.map(([v,t])=>`<option value="${v}"${String(v)==String(cur)?' selected':''}>${t}</option>`).join('');
const gmBtn=(a,t,dis)=>`<button data-g="${a}"${dis?' disabled':''}>${t}</button>`;
// 道具 id 列表(和 itemCnt / 仓库同一套 id):MISC 道具 · 蛇蛋 · 高级幸运宝石 · 仓鼠蛋 / 女神碎片 / 转职凭证 · 强化石 s级品质
function gmItems(){const L=Object.keys(MISC).map(k=>[k,MISC[k][0]]);L.push(['egg','蛇蛋'],['luck','高级幸运宝石'],['hegg','仓鼠宠物蛋'],['soul','女神灵魂碎片'],['job','转职凭证']);
  for(let l=1;l<STN.length;l++)for(let q=0;q<4;q++)L.push(['s'+l+q,stnName(l,q)]);return L}
function gmItemSet(id,v){v=Math.max(0,Math.round(v)||0);if(id=='luck')LUCK=v;else if(id[0]=='s'&&/^s\d\d$/.test(id))STN[+id[1]][+id[2]]=v;else MAT[id]=v}
const GMINFX=['soul','job','hegg'];  // 无限材料不补这几样(会影响进度)
function gmInfTick(){if(GM.inf){for(const k in MISC)if(!GMINFX.includes(k)&&(MAT[k]|0)<9999)MAT[k]=9999;for(let l=1;l<STN.length;l++)for(let q=0;q<4;q++)if(STN[l][q]<9999)STN[l][q]=9999;if(LUCK<9999)LUCK=9999;if((MAT.egg|0)<9999)MAT.egg=9999}
  if(GM.ig){if(gold<9e8)gold=9e8;if(KP<9e6)KP=9e6}}
setInterval(gmInfTick,500);
// 装备页选中的装备
function gmEqL(){const L=[];for(const k of ALL)if(EQ[k])L.push(['e:'+k,'身上 · '+SL[k][0]+' · '+nm(EQ[k])]);BAG.forEach((it,i)=>{if(it&&!it.cos)L.push(['b:'+i,'背包 '+(i+1)+' · '+nm(it)])});return L}
function gmEq(){const s=GM.es||'',k=s.slice(2);return s[0]=='e'?EQ[k]:s[0]=='b'?BAG[+k]:null}
function rGM2(){const t=GM.tb|0;let h='';
  if(t==1){const L=gmItems();
    h+=`<h4>添加 / 设置道具</h4><div class="row"><select id="gmi">${gmOpt(L,GM.gi||L[0][0])}</select><span>数量</span><input id="gmq" type="number" value="10" style="width:80px">${gmBtn('i_add','增加')}${gmBtn('i_set','设为这个数')}</div>`;
    h+=`<div class="row">${gmBtn('i_all','所有道具 / 材料 / 强化石各 +99')}${gmBtn('i_pot','药水全部 +20')}${gmBtn('i_clr','所有道具清零')}</div>`;
    h+=`<h4>无限</h4><div class="row">${gmBtn('t_inf',(GM.inf?'✅':'⬜')+' 无限材料(道具 / 强化石 / 幸运宝石一直保持 9999)')}${gmBtn('t_ig',(GM.ig?'✅':'⬜')+' 无限金币和击杀点')}</div>`;
    h+=`<h4>金币 / 击杀点</h4><div class="row"><span>金币</span><input id="gmG" type="number" value="${gold}" style="width:120px"><span>击杀点</span><input id="gmK" type="number" value="${KP}" style="width:100px">${gmBtn('i_gk','设置')}</div>`;
    h+=`<div class="tag">现在拥有:${L.filter(([id])=>itemCnt(id)>0).map(([id,n])=>n+' ×'+itemCnt(id)).join(' · ')||'没有道具'}</div>`}
  else if(t==2){const L=gmEqL(),it=gmEq();
    h+=`<h4>生成装备(放进背包)</h4><div class="row"><select id="gnS">${gmOpt(['head','body','ear','ring','sword','staff'].map(k=>[k,SL[k][0]]),GM.gs||'head')}</select>
      <select id="gnT">${gmOpt([['m2','大师二阶'],['ms','大师'],['ep','史诗'],['f1','火之武器'],['f2','真~火之武器'],['f3','紫焰魅影武器']],GM.gt||'m2')}</select><select id="gnR">${gmOpt([['','无特性'],...TRK.map(k=>[k,TRT[k][0]])],GM.gr||'lei')}</select>${gmBtn('e_gen','生成')}</div>`;
    h+=`<h4>修改装备</h4><div class="row"><select id="gmes" onchange="GM.es=this.value;renderP()">${gmOpt([['','—— 选一件装备 ——'],...L],GM.es||'')}</select></div>`;
    if(it){const G=Object.keys(EQG).map(k=>[k,NM[k]]);
      h+=`<div class="tag">${ST(it)}</div><div class="row"><b>绿字</b></div>`;
      (it.gr||[]).forEach(([k,v],i)=>{const r=gRng(it,k);h+=`<div class="row"><span>第 ${i+1} 条</span><select id="gk${i}">${gmOpt(G,k)}</select><input id="gv${i}" type="number" value="${v}" style="width:90px"><span class="tag">正常范围 ${r[0]} ~ ${r[1]}</span></div>`});
      h+=`<div class="row">${gmBtn('e_gr','保存绿字')}${gmBtn('e_grmax','绿字全部取最高值')}${gmBtn('e_grre','重新随机绿字')}</div>`;
      h+=`<div class="row"><span>强化 +</span><input id="gme2" type="number" min="0" max="${ENMX}" value="${it.en|0}" style="width:56px"><span>锻造</span><input id="gmf2" type="number" min="0" max="5" value="${it.fg|0}" style="width:56px">
        <span>特性</span><select id="gmr2">${gmOpt([['','无'],...TRK.map(k=>[k,TRT[k][0]])],it.tr||'')}</select>${gmBtn('e_set','保存')}</div>`}
    h+=`<div class="row">${gmBtn('e_allmax','身上全部 +9 / 锻造 5 / 绿字最高')}</div>`}
  else if(t==3){const A=Object.keys(ATSD).map(k=>[k,ATSD[k][0]]),Q=ATSQ.map((q,i)=>[i,q.n]);
    const ed=(g,pre)=>g.a.map(([k,v],j)=>`<select id="${pre}k${j}">${gmOpt(A,k)}</select><input id="${pre}v${j}" type="number" value="${v}" style="width:72px">`).join(' ');
    h+=`<h4>新建属性石</h4><div class="row"><select id="gaq">${gmOpt(Q,GM.aq||2)}</select>${[0,1,2].map(j=>`<select id="gak${j}">${gmOpt(A,'atk')}</select>`).join('')}<span>数量</span><input id="gan" type="number" value="1" style="width:56px">${gmBtn('a_new','放进背包')}${gmBtn('a_rnd','随机一颗')}</div>
      <div class="tag">低级用第 1 条,中级用前 2 条,高级 3 条都用;数值自动取最高值,放进背包后可以在下面改。</div>`;
    h+=`<h4>背包里的属性石(${R19.ats.length})</h4>`+(R19.ats.length?R19.ats.map((g,i)=>`<div class="row"><span style="color:${ATSQ[g.q].c}">${i+1}. ${ATSQ[g.q].n}</span>${ed(g,'ga'+i+'_')}${gmBtn('a_s'+i,'保存')}${gmBtn('a_d'+i,'删除')}</div>`).join(''):'<div class="tag">没有</div>')+
      (R19.ats.length?`<div class="row">${gmBtn('a_clr','全部删除')}</div>`:'');
    h+=`<h4>嵌在武器上的属性石</h4>`+['sword','staff'].map(w=>{const g=EQ[w]&&EQ[w].gem;return `<div class="row"><span>${SL[w][0]}</span>${g?ed(g,'gw'+w+'_')+gmBtn('a_w'+w,'保存')+gmBtn('a_x'+w,'拆掉'):'<span class="tag">没有</span>'}</div>`}).join('')}
  else if(t==4){const dl=dblOn()?Math.ceil((R19.dbl-Date.now())/60000):0,G=godOf();
    h+=`<h4>双倍爆率卡 / 上帝卡牌(分钟,0 = 关闭)</h4><div class="row"><span>双倍爆率</span><input id="gb1" type="number" value="${dl}" style="width:70px"><span>暴击升级</span><input id="gb2" type="number" value="${Math.ceil(G.cr/60000)}" style="width:70px"><span>好伙计</span><input id="gb3" type="number" value="${Math.ceil(G.pal/60000)}" style="width:70px">
      <select id="gb4">${gmOpt(PALN.map((n,i)=>[i+1,n]),G.pk||1)}</select>${gmBtn('b_set','设置')}</div>`;
    h+=`<h4>宠物装备</h4><div class="row">${gmBtn('b_peq','获得全部宠物装备')}<span>幸运骰子点数(只在关卡里有效)</span><select id="gb5">${gmOpt([[0,'不改'],...[1,2,3,4,5,6].map(n=>[n,n+' 点(+'+DICEV[n-1]+'%)'])],DICEN)}</select>${gmBtn('b_dice','设置')}</div>`;
    h+=`<h4>其它</h4><div class="row">${gmBtn('b_clr','解锁全部关卡')}${gmBtn('b_cd','技能冷却清零')}${gmBtn('b_lv','满级 + 技能 / 被动全满')}${gmBtn('b_hp','回满生命 / 魔力')}</div>`}
  return h}
function gmAct2(a){const it=gmEq();
  if(a.startsWith('tb_')){GM.tb=+a.slice(3);return 1}
  if(a=='i_add'||a=='i_set'){const id=gmV('gmi'),n=gmN('gmq');GM.gi=id;gmItemSet(id,a=='i_add'?itemCnt(id)+n:n);fmsg=(gmItems().find(q=>q[0]==id)||[0,id])[1]+' 现在 ×'+itemCnt(id);return 1}
  if(a=='i_all'){for(const [id] of gmItems())if(!GMINFX.includes(id))gmItemSet(id,itemCnt(id)+99);fmsg='所有道具 / 材料 / 强化石各 +99';return 1}
  if(a=='i_pot'){for(const k of POTK)POT[k]=(POT[k]|0)+20;fmsg='药水各 +20(超过药水背包上限也照给)';return 1}
  if(a=='i_clr'){for(const [id] of gmItems())gmItemSet(id,0);fmsg='道具已清零';return 1}
  if(a=='i_gk'){gold=Math.max(0,gmN('gmG'));KP=Math.max(0,gmN('gmK'));fmsg='金币 '+gold+' · 击杀点 '+KP;return 1}
  if(a=='e_gen'){if(BAG.length>=BAGN){fmsg='背包已满';return 1}const s=gmV('gnS'),ty=gmV('gnT'),r=gmV('gnR')||null,wp=s=='sword'||s=='staff';GM.gs=s;GM.gt=ty;GM.gr=r||'';let n;
    if(ty=='f1'||ty=='f2'||ty=='f3'){if(!wp){fmsg='火之武器只有剑和法杖';return 1}n=fireW(s,ty=='f1'?1:ty=='f2'?2:3)}
    else if(ty=='m2'){if(wp){fmsg='大师二阶只有头饰 / 战甲 / 项链 / 指环';return 1}n=m2Gen(s,r||undefined)}
    else if(ty=='ms'){if(wp){fmsg='大师装备只有头饰 / 战甲 / 项链 / 指环';return 1}n=gen(s,3,'大师'+MSN[s]+(r?'·'+TRT[r][0]:''),3,r,0,1)}
    else n=gen(s,3,null,3,wp?null:r);
    if(r&&wp)n.tr=r;BAG.push(n);fmsg='已放进背包:'+nm(n);return 1}
  if(a=='e_gr'&&it){it.gr=(it.gr||[]).map((q,i)=>[gmV('gk'+i)||q[0],Math.max(0,Math.round(gmN('gv'+i,q[1])))]);fmsg='绿字已保存';gmFull();return 1}
  if(a=='e_grmax'&&it){it.gr=(it.gr||[]).map(([k])=>[k,gRng(it,k)[1]]);fmsg='绿字已取最高值';gmFull();return 1}
  if(a=='e_grre'&&it){greenRoll(it);fmsg='绿字已重新随机';gmFull();return 1}
  if(a=='e_set'&&it){gmEn(it,Math.max(0,Math.min(ENMX,gmN('gme2')|0)));it.fg=Math.max(0,Math.min(5,gmN('gmf2')|0));const r=gmV('gmr2');if(r)it.tr=r;else delete it.tr;it.pr=eqPr(it);fmsg='已保存:'+nm(it);gmFull();return 1}
  if(a=='e_allmax'){for(const k of ALL){const q=EQ[k];if(!q||q.cos)continue;gmEn(q,ENMX);q.fg=5;q.gr=(q.gr||[]).map(([g])=>[g,gRng(q,g)[1]])}fmsg='身上装备全部 +'+ENMX+' / 锻造 5 / 绿字最高';gmFull();return 1}
  if(a=='a_new'||a=='a_rnd'){const q=+gmV('gaq')|0,n=Math.max(1,Math.min(50,gmN('gan',1)|0));GM.aq=q;for(let i=0;i<n;i++){const g=a=='a_rnd'?atsNew(q):{q,a:[0,1,2].slice(0,q+1).map(j=>{const k=gmV('gak'+j);return [k,atsV(k,q)]})};R19.ats.push(g)}fmsg='属性石 +'+n;return 1}
  if(a.startsWith('a_s')){const i=+a.slice(3),g=R19.ats[i];if(g){gmAtsSet(g,'ga'+i+'_');fmsg='属性石 '+(i+1)+' 已保存:'+atsTxt(g)}return 1}
  if(a.startsWith('a_d')){R19.ats.splice(+a.slice(3),1);GSEL.s=-1;fmsg='已删除';return 1}
  if(a=='a_clr'){R19.ats=[];GSEL.s=-1;fmsg='属性石已全部删除';return 1}
  if(a.startsWith('a_w')){const w=a.slice(3),g=EQ[w]&&EQ[w].gem;if(g){gmAtsSet(g,'gw'+w+'_');fmsg=SL[w][0]+'上的属性石已保存:'+atsTxt(g);gmFull()}return 1}
  if(a.startsWith('a_x')){const w=a.slice(3);if(EQ[w]&&EQ[w].gem){delete EQ[w].gem;fmsg='已拆掉';gmFull()}return 1}
  if(a=='b_set'){const m=k=>Math.max(0,gmN(k))*60000,G=godOf();R19.dbl=m('gb1')?Date.now()+m('gb1'):0;G.cr=m('gb2');G.pal=m('gb3');G.pk=+gmV('gb4')||1;fmsg='增益时间已设置';return 1}
  if(a=='b_peq'){for(const k in PEQD)if(!R19.peq.own.includes(k))R19.peq.own.push(k);fmsg='已获得全部宠物装备,去 🐤 宠物界面装上(宠物出战时才生效)';return 1}
  if(a=='b_dice'){const n=+gmV('gb5')|0;if(n){DICEN=n;DICEB=DICEV[n-1]/100;fmsg='骰子设为 '+n+' 点'+(st=='play'?'':'(进关卡会重新摇,要在关卡里设置)')}return 1}
  if(a=='b_clr'){for(let n=1;n<=40;n++)if(!CLR.includes(n))CLR.push(n);fmsg='全部关卡已标记通关';return 1}
  if(a=='b_cd'){CD.sword.fill(0);CD.staff.fill(0);fmsg='技能冷却已清零';return 1}
  if(a=='b_lv'){lvl=LVMAX;exp=0;for(const w in LN)LN[w]=LN[w].map((v,i)=>i<4||jobOk(w)?LNMAX:v);for(const q of PSD)PS[q[0]]=q[3];gmFull();fmsg='Lv'+LVMAX+',技能 / 被动全满'+(JOB?'':'(还没转职:进阶技能没加)');return 1}
  if(a=='b_hp'){gmFull();fmsg='已回满';return 1}
  return 0}
function gmEn(it,n){it.en=n;it.ev=0;for(let l=1;l<=n;l++)it.ev+=enV(it.slot,l,3)}  // 按最高品质强化石算
function gmAtsSet(g,pre){g.a=g.a.map((q,j)=>{const k=gmV(pre+'k'+j)||q[0];return [k,Math.max(0,Math.round(gmN(pre+'v'+j,q[1])))]})}
function gmFull(){if(!P)return;const S=stats();P.hp=S.hp;P.mp=S.mp}
