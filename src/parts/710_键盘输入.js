const KM={ArrowLeft:'l',a:'l',A:'l',ArrowRight:'r',d:'r',D:'r'},JK=['k','K','ArrowUp'],AK=['j','J','x','X'],UK=['w','W'],DK=['s','S'];
// 双击方向键快跑:280 毫秒内同方向按两次
function tapDir(k){const t=performance.now();if(t-TAP[k]<280&&(st=='play'||st=='town')){P.run=1;pdMark()}TAP[k]=t}
// 第二十四轮:用户经常误按,菜单快捷键(B 背包 / T 技能 / Q 任务 / P 商城 / Y 精灵 / G 宠物 / M 声音)全部关掉,改用右下角按钮。Esc(关面板 / 暂停 / 设置)和战斗按键照旧
// 第六十三轮:C = 图鉴
// 第四十二轮:恢复菜单快捷键,默认开启;设置页「菜单快捷键」可以关掉(SET.hotk = 0)
const HOTK_=()=>SET.hotk!==0;
addEventListener('keydown',e=>{
  if(HOME){homeKey(e);return}  // 主页面打开时,游戏按键都不响应
  if(e.key=='F1'||e.key=='F2'||e.key=='F3'){e.preventDefault();const t=performance.now();if(t-GMSQ.t>3000)GMSQ.s='';GMSQ.t=t;GMSQ.s=(GMSQ.s+e.key[1]).slice(-6);if(GMSQ.s=='231233'){GMSQ.s='';toggleP('gm')}return}
  if(HOTK_()&&(e.key=='m'||e.key=='M')&&!e.repeat&&!(document.activeElement&&document.activeElement.tagName=='INPUT')){auCycle();return}
  if(DLG&&st=='town'&&!busy()){e.preventDefault();if(e.key=='Escape')dlgSkip();else if(['Enter',' ','j','J','k','K'].includes(e.key)&&!e.repeat)dlgNext();return}
  if(st=='lvsel'){e.preventDefault();lvsKey(e);return}
  if(st=='dms'){e.preventDefault();dmsKey(e);return}
  if(st=='twr'){e.preventDefault();twKey(e);return}
  if(st=='map'&&MPG==1){e.preventDefault();if(e.key=='Escape')MPG=0;else if(e.key=='Enter'||e.key=='1')map2Go(0);else if(e.key=='2')map2Go(1);else if(e.key=='3')map2Go(2);return}
  if(st=='map'){e.preventDefault();if(e.key=='Tab'&&map2Open()){MPG=1;return}if(e.key=='Escape')st='town';else if(e.key.length==1&&'1234567890'.includes(e.key)){const i=e.key=='0'?9:+e.key-1;if(MAPS[i].lock())say('通关上一关后解锁');else openLvSel(i)}else if(e.key=='Enter')openLvSel(0);return}
  if(st=='town'&&(e.key=='w'||e.key=='W')&&!busy()){e.preventDefault();if(!e.repeat){wTap();if(!P.fly&&townSpot())townAct()}keys.u=1;return}
  if(e.key=='Escape'){if(!$('cm').hidden)closeCM();else if(pn)closeP();else if(skOpen)toggleSk();else if(bagOpen)toggleBag();else if(PAUSED)PAUSED=0;else if((st=='play'||st=='town')&&!DLG)openP('set');return}
  if(HOTK_()&&(e.key=='b'||e.key=='B')){e.preventDefault();toggleBag();return}
  if(HOTK_()&&(e.key=='t'||e.key=='T')){e.preventDefault();toggleSk();return}
  if(HOTK_()&&(e.key=='q'||e.key=='Q')){e.preventDefault();toggleP('quest');return}
  if(HOTK_()&&!(document.activeElement&&document.activeElement.tagName=='INPUT')){const pk={p:'mall',y:'spr',g:'pet',c:'codex'}[e.key.toLowerCase()];if(pk&&!e.repeat){e.preventDefault();toggleP(pk);return}}
  if((e.key=='n'||e.key=='N')&&!e.repeat&&st=='play'&&!pn&&!bagOpen&&!skOpen){e.preventDefault();mscCast();return}  // 第四十一轮:怪物技能石
  if(bagOpen&&(e.key=='l'||e.key=='L')&&!e.repeat){P.mode=LMODE=P.mode=='sword'?'staff':'sword';P.ch=0;sel=null;bmsg='已切换为'+SL[P.mode][0];renderBag();return}  // 背包里按 L 也能切换武器,属性和纸娃娃立刻刷新
  if(busy())return;
  if((st=='play'||st=='dead')&&e.key.length==1&&'123'.includes(e.key)&&!e.repeat&&!(document.activeElement&&document.activeElement.tagName=='INPUT')){e.preventDefault();potQuick(+e.key-1);return}  // 1 2 3:快捷栏药水
  if(chOn()&&chKey(e))return;
  if(e.key==' '&&(st=='play'||st=='town')){e.preventDefault();if(!e.repeat)sq=keys.ww?7:keys.u?5:keys.dn?6:4;return}  // 空格 / W+空格 / S+空格 / WW+空格:剑士进阶技能
  if(e.key=='Enter'||(e.key==' '&&st!='play')){e.preventDefault();advance();return}
  if(UK.includes(e.key)){e.preventDefault();if(!e.repeat)wTap();if(!e.repeat&&(canGo()||clearGo()))return;if(!e.repeat&&nearRP()){toTown();return}keys.u=1;return}if(DK.includes(e.key)){e.preventDefault();if(!e.repeat&&st=='play')pickUp();keys.dn=1;return}
  if(KM[e.key]){e.preventDefault();if(!e.repeat&&!keys[KM[e.key]])tapDir(KM[e.key]);keys[KM[e.key]]=1}
  else if(JK.includes(e.key)){e.preventDefault();keys.jh=1;if(!e.repeat)jq=1}
  else if(e.key=='l'||e.key=='L'){if(!e.repeat)lq=1}
  else if('hHuUiIoO'.includes(e.key)&&e.key.length==1){if(!e.repeat)sq='hHuUiIoO'.indexOf(e.key)>>1}
  else if(AK.includes(e.key)){e.preventDefault();if(!e.repeat){if(keys.u)uq=1;else if(keys.dn)dq=1;else ah=1}}});
addEventListener('keyup',e=>{if(KM[e.key])keys[KM[e.key]]=0;if(JK.includes(e.key))keys.jh=0;if(UK.includes(e.key)){keys.u=0;keys.ww=0}if(DK.includes(e.key))keys.dn=0;if(AK.includes(e.key)&&ah){ah=0;ar=1}});
cv.addEventListener('pointerdown',cvClick);$('mb').onclick=e=>{e.stopPropagation();auCycle()};auVol();
// 第一次按键 / 点击(任何地方)就建好声音;浏览器要求有用户操作后才能出声
addEventListener('pointerdown',auInit,true);addEventListener('keydown',auInit,true);
// 右下角按钮 + 设置按钮(点完失去焦点,免得之后按空格又触发按钮)
// 点到已打开的那个 = 关闭;否则先关掉别的面板再打开
for(const [id,k] of [['bb','bag'],['sb','sk'],['ib','mall'],['fb','spr'],['pb','pet'],['cxb','codex'],['qb','quest'],['db','sign'],['setb','set']])
  $(id).onclick=e=>{e.stopPropagation();e.currentTarget.blur();if(DLG)return;const on=k=='bag'?bagOpen:k=='sk'?skOpen:pn==k;
    if(!$('cm').hidden)closeCM();if(pn)closeP();if(skOpen)toggleSk();if(bagOpen)toggleBag();if(on)return;k=='bag'?toggleBag():k=='sk'?toggleSk():openP(k)};
// =====================================================================
