function rGM(){const sel=(id,o)=>`<select id="${id}">${o}</select>`,nums=(d)=>Array.from({length:ENMX+1},(_,i)=>`<option${i==d?' selected':''}>${i}</option>`).join(''),
    tg=(k,l)=>`<button data-g="t_${k}" class="${GM[k]?'on':''}">${GM[k]?'✅':'⬜'} ${l}</button>`;
  return hd('🛠️ GM 工具')+`<div class="tag">测试专用。</div>`+fm()+
  `<h4>资源</h4><div class="row"><button data-g="g1000">金币 +1000</button><button data-g="g10000">金币 +10000</button><button data-g="g0">金币清零</button><button data-g="st10">每级强化石 +10</button><button data-g="it19">第十九轮新道具</button></div>`+
  `<h4>等级与技能</h4><div class="row"><button data-g="lv1">升 1 级</button><button data-g="lv10">升 10 级</button><span>设为 Lv <input id="gml" type="number" min="1" max="99" value="${lvl}" style="width:64px"></span><button data-g="lvset">设置</button><button data-g="sp5">技能点 +5</button><button data-g="skall">全部技能满级</button><button data-g="job1">转职凭证 +1</button><button data-g="job0">重置转职</button><button data-g="psall">被动技能全满</button></div>`+
  `<h4>装备</h4><div class="row">${sel('gms',ALL.map(k=>`<option value="${k}">${SL[k][1]} ${SL[k][0]}</option>`).join(''))}${sel('gmt',TR.map((t,i)=>`<option value="${i}">${t[0]}</option>`).join(''))}${sel('gmg',SER.map((q,i)=>`<option value="${i}">${q.n}系列</option>`).join(''))}${sel('gmr','<option value="">无特性</option>'+TRK.map(k=>`<option value="${k}">${TRT[k][0]}</option>`).join(''))}<span>+</span>${sel('gme',nums(0))}<button data-g="give">放入背包</button><button data-g="bagclr">清空背包</button></div>`+
  `<div class="row"><button data-g="epic">全身换成史诗装备</button><button data-g="epic5">全身换成史诗荒漠套(用上面选的特性,未选则 2+2 混搭)</button><button data-g="firew">火之 / 真~火之武器各一把 + 小鸟碎片 / 幻化券 ×5</button><span>已穿戴装备全部设为 +</span>${sel('gmn',nums(5))}<button data-g="enall">执行</button></div>`+
  `<h4>开关</h4><div class="row">${tg('god','无敌')}${tg('ko','一击必杀')}${tg('mp','无限魔力')}${tg('luck','强化必成功')}</div>`+
  `<h4>关卡</h4><div class="row"><button data-g="heal">回满生命和魔力</button><button data-g="go1">进入第一关</button><button data-g="go2">进入第二关</button><button data-g="unl">解锁第二关</button><button data-g="clr2">标记第二关已通关(出现女神像)</button><button data-g="go3">进入第三关</button><button data-g="unl3">解锁第三关</button><button data-g="clr3">标记第三关已通关(出现村长)</button><button data-g="tk0">重置村长对话</button><button data-g="go4">进入第四关</button><button data-g="unl4">解锁第四关</button><button data-g="clr4">标记第四关已通关</button><button data-g="go5">进入第五关</button><button data-g="unl5">解锁第五关</button><button data-g="go6">进入第六关</button><button data-g="unl6">解锁第六关</button><button data-g="go7">进入第七关</button><button data-g="unl7">解锁第七关</button><button data-g="boss" ${st=='play'?'':'disabled'}>传送到首领前</button></div>`+
  `<h4>任务与材料</h4><div class="row"><button data-g="egg">蛇蛋 +10</button><button data-g="lk5">高级幸运宝石 +5</button><button data-g="mqf">当前主线一键达成</button><button data-g="mqn">跳过当前主线</button><button data-g="mqb">主线退回上一个</button><button data-g="mq0">重置主线</button><button data-g="qfin">已接的每日任务一键达成</button><button data-g="qrst">刷新每日任务</button></div>`+
  `<h4>商城 · 精灵 · 宠物</h4><div class="row"><button data-g="kp">击杀点 +2000</button><button data-g="vip">${isVip()?'关闭 VIP':'开通 VIP'}</button><button data-g="sign0">重置今天的签到</button><button data-g="cosall">获得全部时装和翅膀</button><button data-g="spr10">精灵 +10 级(没有则赠送)</button><button data-g="pet5">宠物 +5 级(没有则赠送)</button><button data-g="petmax">宠物满级</button></div>`+
  `<h4>存档</h4><div class="row"><button data-g="reset">${GM.rc?'⚠️ 再点一次确认清档':'重置存档(清档)'}</button></div>`}
function gmAct(a){fmsg='';const full=()=>{const S=stats();P.hp=S.hp;P.mp=S.mp};if(a!='reset')GM.rc=0;
  if(a.startsWith('t_')){const k=a.slice(2);GM[k]=GM[k]?0:1}
  else if(a=='g1000')gold+=1000;else if(a=='g10000')gold+=10000;else if(a=='g0')gold=0;
  else if(a=='st10'){for(let l=1;l<=2;l++)for(let q=0;q<4;q++)STN[l][q]+=10;MAT.add=(MAT.add|0)+10;fmsg='每级每种品质的强化石各 +10,合成添加剂 +10'}
  else if(a=='it19'){MAT.gift=(MAT.gift|0)+50;MAT.food=(MAT.food|0)+10;MAT.lk1=(MAT.lk1|0)+3;MAT.lk2=(MAT.lk2|0)+3;MAT.dbl=(MAT.dbl|0)+1;for(let i=0;i<3;i++){R19.ats.push(atsNew(0));R19.ats.push(atsNew(1))}fmsg='小礼袋 +50 · 宠物饲料 +10 · 低 / 中级幸运宝石 +3 · 双倍爆率卡 +1 · 低 / 中级属性石各 +3'}
  else if(a=='vip'){KPS=isVip()?0:VIPN;full();fmsg=isVip()?'👑 VIP 已开通':'VIP 已关闭(累计消费清零)'}
  else if(a=='sign0'){SIGN.day=SIGN.day==today()?yday():SIGN.day;fmsg='今天的签到已重置,可以再签一次'}
  else if(a=='sp5')sp+=5;
  else if(a=='kp'){KP+=2000;fmsg='击杀点 +2000'}
  else if(a=='cosall'){for(const k in COSD)if(!OWN.includes(k))OWN.push(k);fmsg='已获得全部时装和翅膀,去背包的「时装」「翅膀」页穿戴'}
  else if(a=='spr10'){if(!SPR.own){SPR=sprNew();SPR.own=1}let n=0;for(let i=0;i<10&&SPR.lv<50;i++){n+=sprNeed(SPR.lv)-SPR.exp;sprGain(sprNeed(SPR.lv)-SPR.exp)}fmsg='精灵 Lv'+SPR.lv}
  else if(a=='pet5'||a=='petmax'){if(!PET.own){PET=petNew();PET.own=1}for(let i=0;i<(a=='pet5'?5:20)&&PET.lv<20;i++){PET.exp=petNeed(PET.lv);petLv()}fmsg='宠物 Lv'+PET.lv+' · 技能:'+(PET.sk.map(k=>PSK[k][0]).join('、')||'无')}
  else if(a=='skall'){for(const w in LN)LN[w]=LN[w].map((v,i)=>i<4||JOB==w?9:v);fmsg='全部技能已升到 9 级'+(JOB?'(含'+JOBN[JOB]+'进阶技能)':'')}
  else if(a=='job1'){MAT.job=(MAT.job||0)+1;fmsg='转职凭证 +1'}
  else if(a=='job0'){JOB=null;for(const w in LN)for(let i=4;i<8;i++)LN[w][i]=0;fmsg='已重置转职(进阶技能清零)'}
  else if(a=='lv1'||a=='lv10'||a=='lvset'){const n=a=='lvset'?Math.max(1,Math.min(99,(+$('gml').value|0)||1)):Math.min(99,lvl+(a=='lv1'?1:10));sp+=Math.max(0,n-lvl);lvl=n;exp=0;full();fmsg='等级已设为 Lv'+lvl}
  else if(a=='give'){if(BAG.length>=BAGN)fmsg='背包已满';else{const sl=$('gms').value,g=+$('gmg').value,r=$('gmr').value;const it=gen(sl,+$('gmt').value,null,g,g==2&&BODY.includes(sl)&&r?r:null);it.en=+$('gme').value||0;BAG.push(it);fmsg='已放入背包:'+nm(it)}}
  else if(a=='bagclr'){BAG=[];fmsg='背包已清空'}
  else if(a=='firew'){for(const s of ['sword','staff'])for(const f of [1,2])BAG.push(fireW(s,f));MAT.b360=(MAT.b360|0)+5;MAT.hwq=(MAT.hwq|0)+5;fmsg='火之武器 4 把放进背包;360 小鸟碎片、武器幻化券各 +5'}
  else if(a=='epic5'){const r=$('gmr').value;BODY.forEach((k,i)=>EQ[k]=gen(k,3,null,2,r||(i<2?'lei':'xue')));EQ.sword=gen('sword',3,null,2);EQ.staff=gen('staff',3,null,2);full();fmsg='已换成史诗荒漠套 '+(r?TRT[r][0]+'×4':'怒雷×2 + 热血×2')}
  else if(a=='epic'){for(const k of ALL)EQ[k]=gen(k,3);full();fmsg='全身已换成史诗装备'}
  else if(a=='enall'){const n=+$('gmn').value;for(const k of ALL)if(EQ[k]){EQ[k].en=n;EQ[k].ev=0;for(let l=1;l<=n;l++)EQ[k].ev+=enV(k,l,0)}full();fmsg='已穿戴装备全部设为 +'+n}
  else if(a=='heal'){full();fmsg='已回满'}
  else if(a=='go1'){closeP();enter1();return}else if(a=='go2'){closeP();enterLv(2);return}else if(a=='go3'){closeP();enterLv(3);return}else if(a=='go4'){closeP();enterLv(4);return}else if(a=='go5'){closeP();enterLv(5);return}
  else if(a=='go6'){closeP();enterLv(6);return}
  else if(a=='go7'){closeP();enterLv(7);return}
  else if(a=='unl7'){for(const n of [1,2,3,4,5,6])if(!CLR.includes(n))CLR.push(n);fmsg='第七关已解锁'}
  else if(a=='unl6'){for(const n of [1,2,3,4,5])if(!CLR.includes(n))CLR.push(n);fmsg='第六关已解锁'}
  else if(a=='unl5'){for(const n of [1,2,3,4])if(!CLR.includes(n))CLR.push(n);fmsg='第五关已解锁'}
  else if(a=='psall'){for(const q of PSD)PS[q[0]]=q[3];full();fmsg='被动技能已全部满级'}
  else if(a=='unl4'){for(const n of [1,2,3])if(!CLR.includes(n))CLR.push(n);fmsg='第四关已解锁'}
  else if(a=='clr4'){for(const n of [1,2,3,4])if(!CLR.includes(n))CLR.push(n);fmsg='已标记前四关通关'}
  else if(a=='unl3'){for(const n of [1,2])if(!CLR.includes(n))CLR.push(n);fmsg='第三关已解锁'}
  else if(a=='clr3'){for(const n of [1,2,3])if(!CLR.includes(n))CLR.push(n);fmsg='已标记前三关通关,村长出现在城镇左侧'}
  else if(a=='tk0'){QD.talk=0;QD.t2=0;fmsg='村长对话已重置'}
  else if(a=='egg'){MAT.egg=(MAT.egg||0)+10;fmsg='蛇蛋 +10'}else if(a=='lk5'){LUCK+=5;fmsg='高级幸运宝石 +5'}
  else if(a=='qfin'){qDay();QD.d.forEach((d,i)=>{if(d.s==1){if(i==0)MAT.egg=Math.max(MAT.egg||0,10);else d.p=QDEF[i].need}});fmsg='已接取的每日任务均已达成,去任务栏领取奖励'}
  else if(a=='mqf'){const q=mqCur();if(q){QD.ms=1;QD.mp=q.need;fmsg='当前主线已达成,去任务栏领取奖励'}}
  else if(a=='mqn'){if(QD.mi<MQN){QD.mi++;QD.ms=0;QD.mp=0}fmsg='主线跳到第 '+Math.min(QD.mi+1,MQN)+' 个'}
  else if(a=='mqb'){QD.mi=Math.max(0,QD.mi-1);QD.ms=0;QD.mp=0;fmsg='主线退回第 '+(QD.mi+1)+' 个'}
  else if(a=='mq0'){QD.mi=0;QD.ms=0;QD.mp=0;fmsg='主线已重置'}
  else if(a=='qrst'){QD.day='';qDay();fmsg='每日任务已刷新'}  else if(a=='unl'){if(!CLR.includes(1))CLR.push(1);fmsg='第二关已解锁'}else if(a=='clr2'){for(const n of [1,2])if(!CLR.includes(n))CLR.push(n);fmsg='已标记第一、二关通关,城镇出现女神像'}
  else if(a=='boss'){if(st=='play'){E=[];P.x=2720;P.y=GY-P.h;P.vy=0;closeP()}return}
  else if(a=='reset'){if(!GM.rc)GM.rc=1;else{GM.rc=0;clearSave();closeP();init(1);toTown();say('存档已重置');return}}
  save();renderP()}
$('pn').addEventListener('click',e=>{const g=e.target.closest('[data-g]');if(g){if(!g.disabled)gmAct(g.dataset.g);return}
  const t=e.target.closest('[data-p]');if(!t||t.disabled)return;const r=t.dataset.p;fmsg='';
  if(r=='x'){closeP();return}
  {const m=giftAct(r);if(m!=null){fmsg=m;save();renderP();return}}
  if(whAct(r)){save();renderP();return}
  if(fzAct(r)){save();renderP();return}
  {const m=mallAct(r);if(m==2)return;if(m){save();renderP();return}}
  if(r=='mqa'){const q=mqCur();if(mqAccept())fmsg='✅ 已接受主线:'+q.n}
  else if(r=='mqc'){const q0=mqCur(),rt=q0&&mqRwT(q0),q=mqClaim();if(q)fmsg=`🎁 主线「${q.n}」完成:${rt}<br><span class="tag" style="font-weight:normal">后记:${q.d}</span>`}
  else if((r.startsWith('qa')||r.startsWith('qc'))&&timeBad())fmsg=TBMSG;
  else if(r.startsWith('qa')){qDay();QD.d[+r[2]].s=1;fmsg='已接受任务:'+QDEF[+r[2]].n}
  else if(r.startsWith('qc')){qDay();const i=+r[2],q=QDEF[i];if(QD.d[i].s==1&&q.prog()>=q.need){q.give();QD.d[i].s=2;fmsg='🎁 领取奖励:'+q.rw}}
  else if(/^lk[123]$/.test(r)){const i=+r[2];useLk=useLk==i?0:i}
  else if(r[0]=='Q')FQ=+r[1];
  else if(r=='se'){const n=MAT.egg||0;gold+=n*3;MAT.egg=0;fmsg='出售蛇蛋 ×'+n+',获得 '+n*3+' 金币'}
  else if(r[0]=='f'&&r[1]!='g')fs=r.slice(1);
  else if(r=='up'){const it=fIt(fs),k=it?(it.en||0)+1:0,sl=stnLv(k||1),own=STN[sl],q=FQ>=0&&own[FQ]>0?FQ:own.findIndex(v=>v>0);if(it&&k<=ENMAX()&&q>=0&&gold<enFee(it,k))fmsg='金币不足,强化需要 '+enFee(it,k)+' 金币手续费';else if(it&&k<=ENMAX()&&q>=0){own[q]--;gold-=enFee(it,k);
      const lk=lkB();if(lk){lkUse(useLk);if(!lkHave(useLk))useLk=0}
      if(Math.random()<srOf(k,lk)){const v=enV(it.slot,k,q);it.ev=(it.ev||0)+v;it.en=k;fmsg='✨ 强化成功!'+nm(it)+'('+NM[EQE[it.slot][0]]+' +'+v+')'}else fmsg='💥 强化失败,'+stnName(sl,q)+'碎了(装备完好)';if(lk)fmsg+=' · 消耗 1 颗幸运宝石';
      const S=stats();P.hp=Math.min(P.hp,S.hp);P.mp=Math.min(P.mp,S.mp)}}
  else if(r[0]=='F'&&r.length==4){const l=+r[1],q=+r[2],k=stnFuse(l,q,+r[3]);if(k){fmsg=`🔥 熔炼成功:${stnName(l,q+1)} ×${k}(消耗 ${STQ[q].n} ×${k*3}、合成添加剂 ×${k})`;sfx('fuse');save()}else fmsg='需要 3 颗同级同品质的强化石和 1 瓶合成添加剂'}
  else if(r.startsWith('gE')){GSEL.e=r.slice(2);GSEL.ok=0}else if(r.startsWith('gS')){GSEL.s=+r.slice(2);GSEL.ok=0}else if(r=='gI'){fmsg=gemSet()}
  else if(r[0]=='b'){const [i,j]=r.slice(1).split('_').map(Number),it=shopIt(i,j),c=buyPr(it);
    if(BAG.length>=BAGN)fmsg='背包已满';else if(gold>=c){gold-=c;const nb=shopIt(i,j,1);BAG.push(nb);fmsg='购买了 '+it.n+'('+ST(nb)+'),已放进背包'}}
  else if(r[0]=='s'){const i=+r.slice(1),it=BAG[i];if(it){const c=sellPr(it);gold+=c;BAG.splice(i,1);fmsg='出售 '+nm(it)+',获得 '+c+' 金币'}}
  save();renderP()});
