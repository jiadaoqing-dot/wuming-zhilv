/*NOFONT{*/
// =====================================================================
// 移动端触屏按键(只有 v1.52 手机纪念版有,分支 mobile-v1.52;主线以后只做电脑端)
// 触屏设备(或网址带 ?touch=1)才启用:画面铺满横屏,左边摇杆 = WASD,右边扇形技能键 = J H U I O K,
// 右边一列 B / 空格 / N,左边 1 2 3 药水和 L 换武器。每个按钮只是模拟一次键盘按下 / 抬起,游戏逻辑一行不改
// =====================================================================
const TCH=matchMedia('(pointer:coarse)').matches||/[?&]touch=1/.test(location.search);
function mobKey(k,dn){dispatchEvent(new KeyboardEvent(dn?'keydown':'keyup',{key:k,bubbles:true}))}
function mobInit(){
  document.body.classList.add('mob');
  const st_=document.createElement('style');
  st_.textContent=`
body.mob{padding:0;gap:0;background:#000;height:100vh;height:100dvh;justify-content:center;overflow:hidden;-webkit-touch-callout:none;touch-action:none}
body.mob .tip,body.mob .sbar{display:none}
body.mob #wrap,body.mob #wrap>canvas{width:min(100vw,calc(100dvh*16/9))!important}
body.mob #c{border-radius:0;box-shadow:none}
body.mob #tb{position:absolute!important;order:0;flex-wrap:nowrap;margin:0}
body.mob #home{padding:2cqh 2cqw;font-size:clamp(9px,1.5cqw,20px)}body.mob #home .hl{border-width:16px;border-image-width:16px}
body.mob #home .hr{gap:.4cqh}body.mob #home .hr button{border-width:12px;border-image-width:12px;font-size:1.05em;padding:0 .3em}
#mobUI{position:fixed;inset:0;z-index:50;pointer-events:none;font-family:"Microsoft YaHei",sans-serif;-webkit-touch-callout:none}
#mobUI .mk{position:absolute;pointer-events:auto;touch-action:none;transform:translate(-50%,50%);width:11vh;height:11vh;border-radius:50%;
  border:2px solid rgba(255,255,255,.55);background:rgba(20,20,30,.28);color:#fff;font-size:4.6vh;font-weight:700;display:flex;align-items:center;justify-content:center;
  text-shadow:0 1px 2px #000;box-sizing:border-box;-webkit-user-select:none;user-select:none}
#mobUI .mk.on{background:rgba(255,255,255,.4);border-color:#fff}
#mobUI .mk.big{width:15vh;height:15vh;font-size:6vh}
#mobUI .mk.sm{width:9vh;height:9vh;font-size:3.6vh}
#mobUI .mk.esc{transform:none;width:auto;height:7vh;padding:0 2.2vh;border-radius:2vh;font-size:3vh}
#mobUI .joy{position:absolute;pointer-events:auto;touch-action:none;width:34vh;height:34vh;transform:translate(-50%,50%);border-radius:50%;
  border:2px solid rgba(255,255,255,.35);background:rgba(20,20,30,.2)}
#mobUI .joy i{position:absolute;left:50%;top:50%;width:14vh;height:14vh;margin:-7vh 0 0 -7vh;border-radius:50%;background:rgba(255,255,255,.45);border:2px solid #fff;box-sizing:border-box}
#mobUI .joy b{position:absolute;color:rgba(255,255,255,.75);font-size:3.2vh;text-shadow:0 1px 2px #000;transform:translate(-50%,-50%)}
#mobUI.hid .mk:not(.esc),#mobUI.hid .joy{display:none}
#mobRot{position:fixed;inset:0;z-index:60;background:#000;color:#fff;display:none;align-items:center;justify-content:center;flex-direction:column;gap:12px;font-size:20px;text-align:center}
@media (orientation:portrait){body.mob #mobRot{display:flex}}`;
  document.head.appendChild(st_);
  const U=document.createElement('div');U.id='mobUI';document.body.appendChild(U);
  const R=document.createElement('div');R.id='mobRot';R.innerHTML='<div style="font-size:48px">⟳</div>请把手机横过来玩<div style="font-size:14px;opacity:.7">iPhone 建议用 Safari「分享 → 添加到主屏幕」后从桌面打开,可以全屏,存档也不容易被清掉</div>';document.body.appendChild(R);
  // 按钮位置按截图布局:中心点距屏幕边缘的距离(单位 vh,和手机高度成比例)
  // 底部 15% 留给画面里的技能栏 / 菜单栏(声音、签到、背包……),按键都往上放,免得挡住
  const B=[['J','j','big',{r:34,b:29}],['H','h','',{r:52,b:22}],['U','u','',{r:51,b:40}],['I','i','',{r:34,b:49}],['O','o','',{r:17,b:41}],['K','k','',{r:16,b:22}],
    ['N','n','',{r:10,b:58}],['空格',' ','',{r:10,b:71}],['B','b','',{r:10,b:84}],
    ['1','1','sm',{l:12,b:66}],['2','2','sm',{l:24,b:66}],['3','3','sm',{l:36,b:66}],['L','l','',{l:60,b:26}]];
  for(const [t,k,c,p] of B){const e=document.createElement('div');e.className='mk '+c;e.textContent=t;
    if(p.r!=null)e.style.left=`calc(100vw - ${p.r}vh)`;else e.style.left=p.l+'vh';e.style.bottom=p.b+'vh';
    let id=null;const up=ev=>{if(ev.pointerId!==id)return;id=null;e.classList.remove('on');mobKey(k,0)};
    e.addEventListener('pointerdown',ev=>{ev.preventDefault();if(id!=null)return;id=ev.pointerId;try{e.setPointerCapture(id)}catch(_){}e.classList.add('on');mobKey(k,1)});
    e.addEventListener('pointerup',up);e.addEventListener('pointercancel',up);U.appendChild(e)}
  // 左上角 Esc:关面板 / 暂停 / 设置(手机上没有设置栏)
  const E=document.createElement('div');E.className='mk esc';E.textContent='Esc';E.style.left='1.5vh';E.style.top='1.5vh';
  E.addEventListener('pointerdown',ev=>{ev.preventDefault();E.classList.add('on');mobKey('Escape',1)});
  E.addEventListener('pointerup',()=>{E.classList.remove('on');mobKey('Escape',0)});U.appendChild(E);
  // 摇杆:横向推过 35% 算 A / D,纵向推过 50% 算 W / S(W 会进传送门、S 会捡东西,所以纵向更迟钝一点);松开再推 = 双击快跑
  const J=document.createElement('div');J.className='joy';J.style.left='29vh';J.style.bottom='35vh';
  J.innerHTML='<b style="left:50%;top:12%">W</b><b style="left:50%;top:88%">S</b><b style="left:12%;top:50%">A</b><b style="left:88%;top:50%">D</b><i></i>';U.appendChild(J);
  const knob=J.querySelector('i'),HD={a:0,d:0,w:0,s:0};let jid=null;
  const set=(k,v)=>{if(HD[k]!=v){HD[k]=v;mobKey(k,v)}};
  const mv=ev=>{const r=J.getBoundingClientRect(),R_=r.width/2;let dx=ev.clientX-r.left-R_,dy=ev.clientY-r.top-R_;const d=Math.hypot(dx,dy);
    if(d>R_){dx*=R_/d;dy*=R_/d}knob.style.transform=`translate(${dx}px,${dy}px)`;
    set('a',dx<-.35*R_?1:0);set('d',dx>.35*R_?1:0);set('w',dy<-.5*R_?1:0);set('s',dy>.5*R_?1:0)};
  const rel=ev=>{if(ev.pointerId!==jid)return;jid=null;knob.style.transform='';for(const k in HD)set(k,0)};
  J.addEventListener('pointerdown',ev=>{ev.preventDefault();if(jid!=null)return;jid=ev.pointerId;try{J.setPointerCapture(jid)}catch(_){}mv(ev)});
  J.addEventListener('pointermove',ev=>{if(ev.pointerId===jid)mv(ev)});J.addEventListener('pointerup',rel);J.addEventListener('pointercancel',rel);
  addEventListener('contextmenu',e=>e.preventDefault());
  // 背包 / 技能 / 面板 / 主页面打开时把战斗按键藏起来,免得挡住界面(Esc 一直在)
  setInterval(()=>{const h=HOME||bagOpen||skOpen||!!pn;U.classList.toggle('hid',!!h);E.style.display=HOME?'none':'';if(h&&jid!=null){jid=null;knob.style.transform='';for(const k in HD)set(k,0)}},150);
  // 第一次点屏幕时尽量全屏并锁定横屏(安卓 Chrome 支持;iPhone 的 Safari 不支持,只能添加到主屏幕)
  const fs=()=>{const d=document.documentElement;try{if(!document.fullscreenElement){const f=d.requestFullscreen||d.webkitRequestFullscreen;if(f){const p=f.call(d);if(p&&p.then)p.then(()=>{try{screen.orientation.lock('landscape').catch(()=>{})}catch(e){}}).catch(()=>{})}}}catch(e){}};
  addEventListener('pointerup',fs,{once:true});
  setTimeout(uiScale,50);addEventListener('orientationchange',()=>setTimeout(uiScale,300));
}
if(TCH)mobInit();
/*}NOFONT*/
