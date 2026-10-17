function mallAct(r){
  {const b=bookAct(r);if(b)return b}
  if(mtAct(r))return 1;
  if(peqAct(r))return 1;  // 第四十八轮:宠物装备
  if(r.startsWith('kb_')||r.startsWith('kr_')){const k=r.slice(3);fmsg=r[1]=='r'?kpBuy(k,1):kpBuyN(k,mtQ(k));return 1}
  if(r.startsWith('rb_')){fmsg=rcBuy(r.slice(3));return 1}
  if(r.startsWith('gm_')){const [,k,n]=r.split('_');fmsg=matBuy(k,+n);return 1}
  if(r.startsWith('Zs')){const g=+r[2];if(SEROPEN[g]())shopSer=g;return 1}
  if(r.startsWith('Zt')){shopTr=r.slice(2);return 1}
  if(r=='pause'){closeP();PAUSED=1;return 2}
  if(r=='home'){if(st=='play'){closeP();toTown()}return 2}
  if(r=='fps60'||r=='fps120'){SET.fps=+r.slice(3);saveSet();fmsg='帧数上限:'+SET.fps;return 1}
  if(r=='hkon'||r=='hkoff'){SET.hotk=r=='hkon'?1:0;saveSet();fmsg=SET.hotk?'菜单快捷键已开启(B T Q P Y G M)':'菜单快捷键已关闭';return 1}
  if(r=='sfps'){SET.sf=SET.sf?0:1;saveSet();if(!SET.sf)$('fpsT').textContent='';return 1}
  if(r=='fs'){try{if(document.fullscreenElement)document.exitFullscreen();else document.documentElement.requestFullscreen()}catch(e){}return 1}
  if(r=='snd'){auCycle();return 1}
  if(r=='pxon'||r=='pxoff'){SET.art=r=='pxon'?1:0;saveSet();pxUI();fmsg=SET.art?'已切换为像素美术':'已切换为原版几何美术';return 1}
  if(r=='hlpc'||r=='hars'){SET.hero=r=='hars'?'ars':'lpc';saveSet();fmsg=SET.hero=='ars'?'人物改用 Ars 主角 + 旧版 NPC(主角穿时装时仍是原版)':'主角和 NPC 改用 LPC 形象';return 1}
    if(r=='qhd'||r=='qsd'){SET.q=r.slice(1);saveSet();applyRS(SET.q=='sd'?2:(matchMedia('(pointer:fine)').matches?3:2));fmsg='画质:'+(SET.q=='sd'?'流畅(720p)':'高清');return 1}
  if(r.startsWith('pb_')){const [,k,n]=r.split('_');potBuy(k,+n);return 1}
  if(r.startsWith('qs_')){const [,i,k]=r.split('_');if(POTD[k]){QS[+i]=k;fmsg='快捷栏 '+(+i+1)+' 设为「'+POTD[k][0]+'」'}return 1}
  if(r=='mt0'||r=='mt1'){mallTab=+r[2];return 1}
  if(r=='gomall'){pn='mall';mallTab=0;return 1}
  if(r=='sign'){doSign();return 1}
  if(r=='bspr'){if(!SPR.own&&gold>=SPRP_){gold-=SPRP_;SPR=sprNew();SPR.own=1;SPRP={x:P.x,y:P.y};sfx('coin');fmsg='🧚 获得精灵!点顶栏 🧚 分配属性、吸收装备升级'}return 1}
  if(r=='bpet'){if(!PET.own&&gold>=PETP_){gold-=PETP_;PET=petNew();PET.own=1;PETS.x=P.x-30;sfx('coin');fmsg='🐤 获得宠物「钢盔小鸡」!带它去关卡里打怪升级吧'}return 1}
  if(r.startsWith('bc_')){const id=r.slice(3),d=COSD[id];if(d&&!OWN.includes(id)&&KP>=d.kp){const v0=isVip();KP-=d.kp;KPS+=d.kp;OWN.push(id);mrDay();mrRoll();wearC(id,true);sfx('coin');fmsg='获得「'+d.n+'」,已自动穿上';
    if(!v0&&isVip()){sfx('lvl');fmsg+=' · 👑 累计消费满 '+VIPN+' 击杀点,VIP 已开通!'}}return 1}
  if(r.startsWith('cw_')||r.startsWith('cu_')){const id=r.slice(3);wearC(id,r[1]=='w');fmsg=(r[1]=='w'?'已穿戴「':'已卸下「')+COSD[id].n+'」';return 1}
  if(r=='son'){SPR.on=SPR.on?0:1;const S=stats();P.hp=Math.min(P.hp,S.hp);P.mp=Math.min(P.mp,S.mp);return 1}
  if(r=='pon'){PET.on=PET.on?0:1;if(PET.on)HAM.on=0;PETS.x=P.x-30;return 1}
  if(r=='hon'){HAM.on=HAM.on?0:1;if(HAM.on)PET.on=0;HMP.x=P.x-40;return 1}
  if(r.startsWith('hsk')){const i=+r[3];HSEL=HSEL==i?-1:i;return 1}
  if(r=='hhat'){if((MAT.hegg||0)>0&&hamHatchT()<0){MAT.hegg--;HAM.ht=Date.now()+600000;fmsg='🥚 开始孵化,10 分钟后再来看看';save()}return 1}
  if(r=='srst'){for(const k in SPR.pt)SPR.pt[k]=0;const S=stats();P.hp=Math.min(P.hp,S.hp);P.mp=Math.min(P.mp,S.mp);fmsg='加点已重置';return 1}
  if(r.startsWith('sa_')){const [,k,n]=r.split('_'),a=Math.min(+n,sprFree(),50-SPR.pt[k]);if(a>0)SPR.pt[k]+=a;return 1}
  if(/^sp\d+$/.test(r)){spSel=+r.slice(2);SPC=0;return 1}
  if(r.startsWith('se_')){spSel='e:'+r.slice(3);SPC=0;return 1}
  if(r.startsWith('sc_')){spSel='c:'+r.slice(3);SPC=0;return 1}
  if(r=='sabsN'){SPC=0;return 1}
  if(r=='sabs'&&typeof spSel=='string'){if(!SPC){SPC=1;return 1}SPC=0;let n=0,nm_='';
    if(spSel.startsWith('e:')){const k=spSel.slice(2),q=EQ[k];if(q){n=sprExp(q);nm_=nm(q);EQ[k]=null}}
    else{const id=spSel.slice(2),d=COSD[id];if(d&&OWN.includes(id)){if(WEAR[d.t]==id)wearC(id,false);OWN=OWN.filter(v=>v!=id);n=COSEXP;nm_=d.n}}
    spSel=null;if(n){const up=sprGain(n),S=stats();P.hp=Math.min(P.hp,S.hp);P.mp=Math.min(P.mp,S.mp);sfx(up?'lvl':'buff');fmsg=`吸收了「${nm_}」,精灵经验 +${n}`+(up?` · 升到 Lv${SPR.lv}(+${up} 分配点)`:'');save()}return 1}
  if(r=='sabs'||r=='sall'){const ids=r=='sabs'?(spSel!=null&&BAG[spSel]?[spSel]:[]):autoPlan();let n=0;for(const i of [...ids].sort((a,b)=>b-a)){n+=sprExp(BAG[i]);BAG.splice(i,1)}spSel=null;
    if(ids.length){const up=sprGain(n);sfx(up?'lvl':'buff');fmsg=`吸收了 ${ids.length} 件装备,精灵经验 +${n}`+(up?` · 升到 Lv${SPR.lv}(+${up} 分配点)`:'')}return 1}
  return 0}
