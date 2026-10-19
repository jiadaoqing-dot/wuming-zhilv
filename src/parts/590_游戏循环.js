// ===== 跳跃 / 翅膀飞行 =====
function doJump(){if(P.gr){P.vy=-520;P.gr=false;P.dj=0;pdMark()}else if(pl('dj')&&!P.dj){P.dj=1;P.vy=-480;pdMark();tx('〰',P.x+12,P.y+P.h,'#fff')}
  else if(WEAR.wing&&!P.fly){if(P.mp<5&&!GM.mp)tx('魔力不足,无法飞行',P.x-20,P.y-8,'#74c0fc');else{P.fly=1;P.vy=-120;sfx('dash');tx(WEAR.wing=='xyw'&&!PXA.ready()?'骑上扫帚!':'飞行!',P.x-6,P.y-12,'#ffc9e5');if(WEAR.wing=='xyw'&&st=='play'){burst(STARP.x,STARP.y,14,['#ffe066','#fff9db','#e599f7'],200,{sh:1,s:2,l:.35,dr:3});ring(P.x+12,P.y+26,4,30,'#ffe066',.3,3)}}}}
function flyPhys(dt,S){if(P.fly&&!WEAR.wing)P.fly=0;
  if(!P.fly){P.vy+=1500*dt;return}
  if(!GM.mp)P.mp-=(8+S.mp*.025)*dt;if(P.mp<=0){P.mp=0;P.fly=0;tx('魔力耗尽',P.x-6,P.y-10,'#74c0fc');return}
  // 飞行操控:W(或按住跳跃)上升、S 下降,不按悬停;A / D 控制方向。按 S 落到地面或平台上就结束飞行
  const tv=keys.u||keys.jh?-220:keys.dn?280:Math.sin(performance.now()/300)*12;P.vy+=(tv-P.vy)*Math.min(1,dt*8)}
const MCW=116,MPX=i=>18+i*(MCW+6);
function cvClick(e){
  if(PAUSED){PAUSED=0;return}
  {const r=cv.getBoundingClientRect(),mx=(e.clientX-r.left)*VW/r.width,my=(e.clientY-r.top)*VH/r.height;
    if(chOn()){if(!busy())chClick(mx,my);return}
    if(st=='play'){if(!busy())for(let i=0;i<3;i++){const q=QSR(i);if(mx>=q.x-2&&mx<=q.x+q.w+2&&my>=q.y-4&&my<=q.y+q.h+2){potQuick(i);return}}return}}
  if(st=='dms'){const r=cv.getBoundingClientRect();dmsClick((e.clientX-r.left)*VW/r.width,(e.clientY-r.top)*VH/r.height);return}
  if(st=='lvsel'){const r=cv.getBoundingClientRect();lvsClick((e.clientX-r.left)*VW/r.width,(e.clientY-r.top)*VH/r.height);return}
  if(st!='town'&&st!='map'){advance();return}
  if(busy())return;
  if(DLG){dlgNext();return}
  const r=cv.getBoundingClientRect(),mx=(e.clientX-r.left)*VW/r.width,my=(e.clientY-r.top)*VH/r.height;
  if(st=='map'&&MPG==1){map2Click(mx,my);return}
  if(st=='map'&&map2Open()&&mx>M2B[0]&&mx<M2B[0]+M2B[2]&&my>M2B[1]&&my<M2B[1]+M2B[3]){MPG=1;return}
  if(st=='map'){const i=mapHit(mx,my);if(i>=0){if(MAPS[i].lock())say('通关上一关后解锁');else openLvSel(i);return}if((mx>14&&mx<144&&my>316&&my<348)||(!MAPI.I&&Math.abs(mx-MAPT[0])<46&&my>MAPT[1]+10&&my<MAPT[1]+50))st='town';return}
}
let last=0;
// 设置:帧数上限(60 / 120)、显示帧数;保存在本机
let SET={fps:60,sf:0,q:'hd',bz:'m',art:1};try{Object.assign(SET,JSON.parse(localStorage.getItem('wuming-set')||'{}'))}catch(e){}
// 像素美术时 body 加 px 类:面板 / 按钮 / 格子换成像素九宫格贴图(CSS 里 body.px 开头的规则)
const pxUI=()=>document.body.classList.toggle('px',SET.art!==0);pxUI();
const saveSet=()=>{try{localStorage.setItem('wuming-set',JSON.stringify(SET))}catch(e){}};
let lastF=0,fpsN=0,fpsT0=0,fpsV=0;
function loop(t){requestAnimationFrame(loop);const iv=1000/SET.fps,el=t-lastF;if(el<iv-1)return;lastF=t-(el%iv);
  if(t-(loop.dc||0)>1000){loop.dc=t;dupChk()}
  if(DUP){bgmSet(null,0);$('tb').style.visibility='hidden';x.fillStyle='#15131c';x.fillRect(0,0,VW,VH);CTG('游戏已在另一个页面中打开',320,160,24);CT('为了防止两个页面互相覆盖存档,这个页面已经暂停。',320,196,13,'#fff','center',3);CT('请关闭这个页面,在最新打开的页面里继续游戏(想在这里玩就刷新本页)。',320,220,13,'#fff','center',3);return}
  fpsN++;if(t-fpsT0>=500){fpsV=Math.round(fpsN*1000/(t-fpsT0));fpsN=0;fpsT0=t;$('fpsT').textContent=SET.sf?fpsV+' FPS':''}
  const dt=Math.min(.033,(t-last)/1000||0);last=t;
  if(pn=='pet'&&HAM.ht&&t-(loop.ht||0)>1000){loop.ht=t;renderP()}  // 宠物蛋孵化倒计时
  bgmSet(st=='play'?(cur==8&&bossOn&&B.p3&&B.hp>0?null:(bossOn&&B.hp>0&&B.can?'bgm17c':isDm(cur)&&bossOn&&B.hp>0&&AUD['bgm'+cur+'b']?'bgm'+cur+'b':'bgm'+(AUD['bgm'+cur]?cur:BGMF[cur]||0)+(bossOn&&B.hp>0?'b':''))):st=='town'?(MYS?'bgm11':'bgm0'):st=='map'?'bgm0':st=='lvsel'?(LVS.m?'bgm11':'bgm0'):st=='dms'?'bgm11':null);  // 主城 bgm0;每关一首关卡曲 + 一首首领曲
  $('tb').style.visibility=!HOME&&(st=='play'||(st=='town'&&!DLG))?'':'hidden';  // 对话时隐藏菜单按钮,免得挡住对话框
  $('qb').hidden=!(st=='play'||st=='town');{const d=$('dbd'),v=signed();if(d.hidden!=v)d.hidden=v}{const dl=!!DLG&&st=='town';if(document.body.classList.contains('dlg')!=dl)document.body.classList.toggle('dlg',dl)}if(st=='play'){update(dt);draw()}else if(st=='town'){if(!HOME)townUpd(dt);drawTown()}else if(st=='map')drawMap();else if(st=='lvsel')drawLvSel();else if(st=='dms')drawDms()
  else if(chOn()){draw();drawChoice()}
  if(PAUSED&&(st=='play'||st=='town')){x.fillStyle='rgba(10,10,20,.55)';x.fillRect(0,0,VW,VH);CTG('⏸ 游戏已暂停',320,172,30);CT('按 Esc / 点击画面 / ⚙️ 继续',320,206,14,'#fff','center',3)}}
function advance(){if(busy())return;if(chOn())chGo(CHI)}
