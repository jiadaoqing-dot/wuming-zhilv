/*NOFONT{*/
// =====================================================================
// 移动端触屏按键(只有 v1.52 手机纪念版有,分支 mobile-v1.52;主线以后只做电脑端)
// 触屏设备(或网址带 ?touch=1)才启用:画面铺满横屏,左边摇杆 = WASD,右边扇形技能键 = J H U I O K,
// 右边一列 B / 空格 / N,左边 1 2 3 药水和 L 换武器。每个按钮只是模拟一次键盘按下 / 抬起,游戏逻辑一行不改
// 手机版小更新:左上角 Esc / 隐藏(藏起底部菜单栏)/ 活动(兑换码,1006);设置里「按键自定义」(每个键换功能、拖动位置、大小)
// =====================================================================
const TCH=matchMedia('(pointer:coarse)').matches||/[?&]touch=1/.test(location.search);
function mobKey(k,dn){if(k)dispatchEvent(new KeyboardEvent(dn?'keydown':'keyup',{key:k,bubbles:true}))}
// 可以分配给按钮的功能:[键, 按钮上显示的键名, 说明]
const MKF=[['j','J','攻击'],['k','K','跳跃'],['h','H','技能 1'],['u','U','技能 2'],['i','I','技能 3'],['o','O','技能 4'],[' ','空格','剑士进阶技能'],['l','L','换武器'],['n','N','怪物技能石'],
  ['b','B','背包'],['t','T','技能面板'],['q','Q','任务'],['p','P','商城'],['y','Y','精灵'],['g','G','宠物'],['m','M','声音'],['1','1','药水 1'],['2','2','药水 2'],['3','3','药水 3'],
  ['w','W','上 / 互动'],['s','S','下 / 捡起'],['Enter','Enter','确定'],['','—','不用(隐藏这个键)']];
const mkfOf=k=>MKF.find(f=>f[0]==k)||MKF[MKF.length-1];
// 默认布局:中心点距屏幕边缘的距离(单位 vh,和手机高度成比例);底部 15% 留给画面里的技能栏 / 菜单栏
const MKDEF=()=>({sz:1,joy:{l:29,b:35},bt:[{k:'j',c:'big',r:34,b:29},{k:'h',r:52,b:22},{k:'u',r:51,b:40},{k:'i',r:34,b:49},{k:'o',r:17,b:41},{k:'k',r:16,b:22},
  {k:'n',r:10,b:58},{k:' ',r:10,b:71},{k:'b',r:10,b:84},{k:'1',c:'sm',l:12,b:66},{k:'2',c:'sm',l:24,b:66},{k:'3',c:'sm',l:36,b:66},{k:'l',l:60,b:26}]});
const lsGet=(k,d)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},lsSet=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
let MKC=lsGet('wmMobKeys',null),MKED=0,MKHIDE=lsGet('wmMobHide',0);
if(!MKC||!MKC.bt||MKC.bt.length!=MKDEF().bt.length)MKC=MKDEF();
// 恢复默认:pos=1 只恢复位置;否则功能 / 位置 / 大小全部恢复(原地改对象,按钮闭包里拿的是同一个对象)
function mkReset(pos){const D=MKDEF();MKC.joy=D.joy;if(!pos)MKC.sz=D.sz;MKC.bt.forEach((p,i)=>{const k=p.k;for(const q in p)delete p[q];Object.assign(p,D.bt[i]);if(pos)p.k=k});lsSet('wmMobKeys',MKC)}
const MOBP={},MOBA=[];  // 手机版自己的面板(pn = 名字 → 渲染函数)和面板按钮处理(返回 1 = 存档并刷新)
function mobInit(){
  document.body.classList.add('mob');
  const st_=document.createElement('style');
  st_.textContent=`
body.mob{padding:0;gap:0;background:#000;height:100vh;height:100dvh;justify-content:center;overflow:hidden;-webkit-touch-callout:none;touch-action:none}
body.mob .tip,body.mob .sbar{display:none}
body.mob #wrap,body.mob #wrap>canvas{width:min(100vw,calc(100dvh*16/9))!important}
body.mob #c{border-radius:0;box-shadow:none}
body.mob #tb{position:absolute!important;order:0;flex-wrap:nowrap;margin:0}
body.mob.tbh #tb{display:none!important}
body.mob #home{padding:2cqh 2cqw;font-size:clamp(9px,1.5cqw,20px)}body.mob #home .hl{border-width:16px;border-image-width:16px}
body.mob #home .hr{gap:.4cqh}body.mob #home .hr button{border-width:12px;border-image-width:12px;font-size:1.05em;padding:0 .3em}
#mobUI{position:fixed;inset:0;z-index:50;pointer-events:none;font-family:"Microsoft YaHei",sans-serif;-webkit-touch-callout:none;--mz:1}
#mobUI .mk{position:absolute;pointer-events:auto;touch-action:none;transform:translate(-50%,50%);width:calc(11vh*var(--mz));height:calc(11vh*var(--mz));border-radius:50%;
  border:2px solid rgba(255,255,255,.55);background:rgba(20,20,30,.28);color:#fff;font-size:calc(4.6vh*var(--mz));font-weight:700;display:flex;align-items:center;justify-content:center;
  text-shadow:0 1px 2px #000;box-sizing:border-box;-webkit-user-select:none;user-select:none;white-space:nowrap}
#mobUI .mk.on{background:rgba(255,255,255,.4);border-color:#fff}
#mobUI .mk.big{width:calc(15vh*var(--mz));height:calc(15vh*var(--mz));font-size:calc(6vh*var(--mz))}
#mobUI .mk.sm{width:calc(9vh*var(--mz));height:calc(9vh*var(--mz));font-size:calc(3.6vh*var(--mz))}
#mobUI .mk.long{font-size:calc(3.4vh*var(--mz))}
#mobUI .mk.tl{transform:none;width:auto;height:7vh;min-width:9vh;padding:0 1.6vh;border-radius:2vh;font-size:3vh;left:1.5vh}
#mobUI .joy{position:absolute;pointer-events:auto;touch-action:none;width:calc(34vh*var(--mz));height:calc(34vh*var(--mz));transform:translate(-50%,50%);border-radius:50%;
  border:2px solid rgba(255,255,255,.35);background:rgba(20,20,30,.2)}
#mobUI .joy i{position:absolute;left:50%;top:50%;width:40%;height:40%;margin:-20% 0 0 -20%;border-radius:50%;background:rgba(255,255,255,.45);border:2px solid #fff;box-sizing:border-box}
#mobUI .joy b{position:absolute;color:rgba(255,255,255,.75);font-size:3.2vh;text-shadow:0 1px 2px #000;transform:translate(-50%,-50%)}
#mobUI.hid .mk:not(.tl),#mobUI.hid .joy,#mobUI .mk.off{display:none}
#mobUI.hm .mk.tl:not(.esc){display:none}
#mobUI.ed .mk,#mobUI.ed .joy{outline:2px dashed #ffd43b;outline-offset:2px}#mobUI.ed .mk.tl{display:none}
#mobUI .mkbar{position:absolute;left:50%;top:2vh;transform:translateX(-50%);pointer-events:auto;display:none;gap:1.5vh;align-items:center;background:rgba(20,20,30,.85);color:#fff;padding:1.2vh 2vh;border-radius:2vh;font-size:3.2vh;border:2px solid #ffd43b}
#mobUI.ed .mkbar{display:flex}#mobUI .mkbar button{font:inherit;font-size:3vh;padding:.6vh 1.8vh;border-radius:1.4vh;border:0;background:#ffd43b;color:#222;font-weight:700}
#mobRot{position:fixed;inset:0;z-index:60;background:#000;color:#fff;display:none;align-items:center;justify-content:center;flex-direction:column;gap:12px;font-size:20px;text-align:center}
@media (orientation:portrait){body.mob #mobRot{display:flex}}
#pn .mkt{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:6px 12px;margin:6px 0}#pn .mkt label{display:flex;gap:8px;align-items:center}
#pn .mkt b{min-width:44px;text-align:center;border:1px solid rgba(127,127,127,.5);border-radius:50%;padding:4px 0}#pn select{font:inherit;padding:3px 6px;border-radius:6px}
#pn .actin{font:inherit;font-size:18px;padding:6px 10px;border-radius:8px;border:2px solid #f2c46b;width:min(260px,60%);text-transform:lowercase}`;
  document.head.appendChild(st_);
  const U=document.createElement('div');U.id='mobUI';document.body.appendChild(U);
  const R=document.createElement('div');R.id='mobRot';R.innerHTML='<div style="font-size:48px">⟳</div>请把手机横过来玩<div style="font-size:14px;opacity:.7">iPhone 建议用 Safari「分享 → 添加到主屏幕」后从桌面打开,可以全屏,存档也不容易被清掉</div>';document.body.appendChild(R);
  const pos=(e,p)=>{if(p.r!=null){e.style.left=`calc(100vw - ${p.r}vh)`}else e.style.left=p.l+'vh';e.style.bottom=p.b+'vh'};
  // 编辑模式:拖动按钮 / 摇杆改位置(松手就存)。p = 配置里的位置对象
  const drag=(e,p,ev)=>{const vh=innerHeight/100,id=ev.pointerId;try{e.setPointerCapture(id)}catch(_){}
    const mv=m=>{if(m.pointerId!==id)return;const x=m.clientX,y=m.clientY;if(p.r!=null&&x<innerWidth/2){delete p.r;p.l=0}else if(p.l!=null&&x>=innerWidth/2){delete p.l;p.r=0}
      if(p.r!=null)p.r=Math.round((innerWidth-x)/vh);else p.l=Math.round(x/vh);p.b=Math.max(5,Math.min(95,Math.round((innerHeight-y)/vh)));pos(e,p)};
    const up=m=>{if(m.pointerId!==id)return;e.removeEventListener('pointermove',mv);e.removeEventListener('pointerup',up);e.removeEventListener('pointercancel',up);lsSet('wmMobKeys',MKC)};
    e.addEventListener('pointermove',mv);e.addEventListener('pointerup',up);e.addEventListener('pointercancel',up)};
  const BT=[];
  MKC.bt.forEach((p,i)=>{const e=document.createElement('div');BT.push(e);pos(e,p);
    let id=null,k='';const up=ev=>{if(ev.pointerId!==id)return;id=null;e.classList.remove('on');mobKey(k,0)};
    e.addEventListener('pointerdown',ev=>{ev.preventDefault();if(MKED){drag(e,p,ev);return}if(id!=null)return;id=ev.pointerId;k=p.k;try{e.setPointerCapture(id)}catch(_){}e.classList.add('on');mobKey(k,1)});
    e.addEventListener('pointerup',up);e.addEventListener('pointercancel',up);U.appendChild(e)});
  const paint=()=>{U.style.setProperty('--mz',MKC.sz);MKC.bt.forEach((p,i)=>{const e=BT[i],f=mkfOf(p.k);e.className='mk '+(p.c||'')+(f[1].length>1?' long':'')+(p.k?'':' off');e.textContent=f[1];pos(e,p)});pos(J,MKC.joy)};
  // 左上角一列:Esc(关面板 / 暂停 / 设置)· 隐藏(底部声音 ~ 背包那一行菜单)· 活动(兑换码)
  const tl=(t,y,fn,c)=>{const e=document.createElement('div');e.className='mk tl '+(c||'');e.textContent=t;e.style.top=y+'vh';
    e.addEventListener('pointerdown',ev=>{ev.preventDefault();e.classList.add('on');fn(1,e)});e.addEventListener('pointerup',()=>{e.classList.remove('on');fn(0,e)});U.appendChild(e);return e};
  const E=tl('Esc',1.5,d=>mobKey('Escape',d),'esc');
  const hideTxt=()=>MKHIDE?'显示':'隐藏';
  const HB=tl(hideTxt(),10,(d,e)=>{if(!d)return;MKHIDE=MKHIDE?0:1;lsSet('wmMobHide',MKHIDE);document.body.classList.toggle('tbh',!!MKHIDE);e.textContent=hideTxt()});
  document.body.classList.toggle('tbh',!!MKHIDE);
  tl('活动',18.5,d=>{if(d)return;if(pn=='act')closeP();else{if(bagOpen)toggleBag();if(skOpen)toggleSk();if(pn)closeP();openP('act')}});
  // 摇杆:横向推过 35% 算 A / D,纵向推过 50% 算 W / S(W 会进传送门、S 会捡东西,所以纵向更迟钝一点);松开再推 = 双击快跑
  const J=document.createElement('div');J.className='joy';
  J.innerHTML='<b style="left:50%;top:12%">W</b><b style="left:50%;top:88%">S</b><b style="left:12%;top:50%">A</b><b style="left:88%;top:50%">D</b><i></i>';U.appendChild(J);
  const knob=J.querySelector('i'),HD={a:0,d:0,w:0,s:0};let jid=null;
  const set=(k,v)=>{if(HD[k]!=v){HD[k]=v;mobKey(k,v)}};
  const mv=ev=>{const r=J.getBoundingClientRect(),R_=r.width/2;let dx=ev.clientX-r.left-R_,dy=ev.clientY-r.top-R_;const d=Math.hypot(dx,dy);
    if(d>R_){dx*=R_/d;dy*=R_/d}knob.style.transform=`translate(${dx}px,${dy}px)`;
    set('a',dx<-.35*R_?1:0);set('d',dx>.35*R_?1:0);set('w',dy<-.5*R_?1:0);set('s',dy>.5*R_?1:0)};
  const jrel=()=>{jid=null;knob.style.transform='';for(const k in HD)set(k,0)};
  J.addEventListener('pointerdown',ev=>{ev.preventDefault();if(MKED){drag(J,MKC.joy,ev);return}if(jid!=null)return;jid=ev.pointerId;try{J.setPointerCapture(jid)}catch(_){}mv(ev)});
  J.addEventListener('pointermove',ev=>{if(ev.pointerId===jid)mv(ev)});
  J.addEventListener('pointerup',ev=>{if(ev.pointerId===jid)jrel()});J.addEventListener('pointercancel',ev=>{if(ev.pointerId===jid)jrel()});
  // 编辑位置时顶部的提示条
  const bar=document.createElement('div');bar.className='mkbar';bar.innerHTML='拖动按钮调整位置 <button data-m="ok">完成</button><button data-m="rs">恢复默认位置</button>';U.appendChild(bar);
  bar.addEventListener('pointerdown',ev=>{const b=ev.target.closest('[data-m]');if(!b)return;ev.preventDefault();
    if(b.dataset.m=='rs'){mkReset(1);paint()}
    else{MKED=0;U.classList.remove('ed');PAUSED=0;openP('mkey')}});
  window.mobEdit=()=>{closeP();MKED=1;PAUSED=1;U.classList.add('ed');U.classList.remove('hid')};
  window.mobPaint=paint;paint();
  addEventListener('contextmenu',e=>e.preventDefault());
  // 背包 / 技能 / 面板打开时把战斗按键藏起来,免得挡住界面;主页面只留 Esc
  setInterval(()=>{if(MKED)return;const h=HOME||bagOpen||skOpen||!!pn;U.classList.toggle('hid',!!h);U.classList.toggle('hm',!!HOME);E.style.display=HOME?'none':'';if(h&&jid!=null)jrel()},150);
  // 第一次点屏幕时尽量全屏并锁定横屏(安卓 Chrome 支持;iPhone 的 Safari 不支持,只能添加到主屏幕)
  const fs=()=>{const d=document.documentElement;try{if(!document.fullscreenElement){const f=d.requestFullscreen||d.webkitRequestFullscreen;if(f){const p=f.call(d);if(p&&p.then)p.then(()=>{try{screen.orientation.lock('landscape').catch(()=>{})}catch(e){}}).catch(()=>{})}}}catch(e){}};
  addEventListener('pointerup',fs,{once:true});
  // 在输入框里打字时(兑换码),不让游戏按键响应;回车 = 兑换
  addEventListener('keydown',e=>{const t=document.activeElement;if(t&&(t.tagName=='INPUT'||t.tagName=='SELECT')&&t.closest('#pn')){e.stopImmediatePropagation();if(e.key=='Enter'&&t.dataset.enter){e.preventDefault();const b=$('pn').querySelector(`[data-p="${t.dataset.enter}"]`);if(b)b.click()}}},true);
  setTimeout(uiScale,50);addEventListener('orientationchange',()=>setTimeout(uiScale,300));
  // 手机版自己的面板:接到原来的 renderP / mallAct / 设置页后面
  const rP0=renderP;renderP=function(){if(MOBP[pn]){$('pn').innerHTML=MOBP[pn]();return}rP0()};
  const mA0=mallAct;mallAct=function(r){for(const f of MOBA){const v=f(r);if(v)return v}return mA0(r)};
  const rS0=rSet;rSet=function(){return rS0()+`<div class="setg"><b>手机按键</b><div class="row"><button data-p="mk_open">🎮 按键自定义</button><span class="tag">每个按键换成别的功能、拖动调整位置、调整大小</span></div></div>`};
  $('pn').addEventListener('change',e=>{const t=e.target.closest('[data-mks]');if(!t)return;MKC.bt[+t.dataset.mks].k=t.value;lsSet('wmMobKeys',MKC);paint();fmsg='已保存';renderP()});
}
// 按键自定义面板
MOBP.mkey=()=>hd('🎮 按键自定义')+fm()+`<div class="tag">每个圆形按键都可以换成别的功能(按钮上显示新功能的键名);选「不用」会把这个键藏起来。摇杆固定是 W A S D 移动。设置马上生效,保存在这台手机的浏览器里。</div>
  <div class="mkt">`+MKC.bt.map((p,i)=>`<label><b>${mkfOf(MKDEF().bt[i].k)[1]}</b>→<select data-mks="${i}">${MKF.map(f=>`<option value="${f[0]}"${f[0]==p.k?' selected':''}>${f[1]} · ${f[2]}</option>`).join('')}</select></label>`).join('')+`</div>
  <div class="row"><b>位置</b><button data-p="mk_edit">✋ 拖动调整位置</button></div>
  <div class="row"><b>大小</b>${[[.85,'小'],[1,'中'],[1.15,'大'],[1.3,'特大']].map(([v,t])=>`<button data-p="mk_sz${v}" class="${MKC.sz==v?'on':''}">${t}</button>`).join('')}</div>
  <div class="row"><button data-p="mk_reset">↺ 全部恢复默认(功能 + 位置 + 大小)</button><button data-p="set_back">⚙️ 返回设置</button></div>`;
MOBA.push(r=>{
  if(r=='mk_open'){openP('mkey');return 2}
  if(r=='set_back'){openP('set');return 2}
  if(r=='mk_edit'){mobEdit();return 2}
  if(r.startsWith('mk_sz')){MKC.sz=+r.slice(5);lsSet('wmMobKeys',MKC);mobPaint();fmsg='按键大小已保存';return 1}
  if(r=='mk_reset'){mkReset(0);mobPaint();fmsg='已全部恢复默认';return 1}
  return 0});
if(TCH)mobInit();
/*}NOFONT*/
