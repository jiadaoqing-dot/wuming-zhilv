// ===== 小怪招式库(2026-10-13 第十六轮重做):一~七关 15 种小怪全部换成新招式,外观 / 动作帧不变 =====
// 写法:e.s = 招式名 · e.t = 招式内计时 · e.pz = 'w' 前摇(头上 ❗ + 后仰蓄力)/ 's' 出招(前扑拉长)/ null;每个招式都有看得见的前摇和明确的躲法(跳起 / 后退 / 打断)
// MVK[种类] = {idle(e,dt,dx,ad,dy) 平时走位, pick(e,dx,ad,dy) 选招(返回招式名 / null), mv:{招式名:(e,dt,dx,ad,dy)}, at:{招式名:0 不算出招 / 2 远程(其余 = 近战)}}
// 地面陷阱 HZ:[{x,w,t,k}] k = 'slow' 黏液(减速)/ 'poi' 毒雾(每 0.5 秒中毒一次);站在上面才生效
let HZ=[];
function hzStep(dt){for(const h of HZ)h.t-=dt;HZ=HZ.filter(h=>h.t>0);if(GM.god||!(P.y+P.h>=GY-2))return;P.hzT=(P.hzT||0)-dt;
  for(const h of HZ)if(P.x+P.w>h.x&&P.x<h.x+h.w){if(h.k=='slow')P.slw=Math.max(P.slw||0,.25);else if(h.k=='poi'&&P.hzT<=0){P.hzT=.5;poison(1.5,.012)}}}
function hzDraw(){const t=performance.now()/1000;for(const h of HZ){const hx=h.x-cam;if(hx>VW+60||hx+h.w<-60)continue;const a=Math.min(1,h.t/.5);x.save();x.globalAlpha=a*.85;
  if(h.k=='slow'){x.filter='sepia(1) hue-rotate(60deg) saturate(2.2) brightness(.9)';for(let i=0;i<3;i++)VFX.frame(x,'m-smoke',(Math.floor(t*8)+i*2)%6,hx+h.w*(.2+.3*i),GY-5,.9,i%2?-1:1,0,.85,.45)}  // 黏液 = 烟雾帧(Ninja Adventure m-smoke)染绿压扁
  else for(let i=0;i<Math.max(1,Math.round(h.w/40));i++)VFX.frame(x,'m-poison',(Math.floor(t*12)+i*3)%12,hx+20+i*40,GY-8,1.3,i%2?-1:1,0,.8);x.restore()}}
function mvHit(e,hb,b,o){return ov(P,hb)?hurt(b*e.dm,o):false}
// 第二十四轮:近战出招后的冷却 ×MMCK 1.6(近战频率降低约 40%;远程另有 MRCD 限制,不再乘)
const MMCK=1.6;
function mvEnd(e,cd,rec){const M=MVK[e.k],rg=M&&M.at&&M.at[e.s]==2,ml=M&&e.s&&!rg&&!(M.at&&M.at[e.s]===0);e.s=null;e.t=0;e.pz=null;e.ug=0;e.cd=cd*(ml?MMCK:1)+Math.random()*.4;if(rec)e.rec=rec}
const mvBox=(e,w,h,dy)=>({x:e.f>0?e.x+e.w-8:e.x+8-w,y:e.y+e.h-(h||e.h)-(dy||0),w,h:h||e.h});
function mvWalk(e,dt,v,stop,dx,ad){e.f=sgn(dx)||e.f;if(ad>stop)e.x+=e.f*v*dt;else if(ad<stop*.45)e.x-=e.f*v*.5*dt}
function mvPatrol(e,dt,v){e.x+=e.f*v*dt;if(Math.abs(e.x-e.o)>80)e.f=sgn(e.o-e.x)||1}
function mvArc(e,c,dmg,T,g,ox,oy,lead,o){const px=P.x+12+(P.vx||0)*(lead||.3),v=aimArc(ox,oy,px,P.y+16,T,g);F.push(Object.assign({x:ox,y:oy,vx:v.vx,vy:v.vy,g,c,dmg:dmg*e.dm},o||{}))}
function mvUgDraw(e){const t=performance.now()/1000,ux=(e.ux!=null?e.ux:e.x+e.w/2)-cam;for(let i=0;i<7;i+=2)VFX.frame(x,'m-dust',(Math.floor(t*12)+i)%4,ux-(e.udir||1)*i*10,GY,.45,1,0,1-i/9);if(e.pz=='w'){const r=e.w/2+12;DZ.zone(ux-r,2*r)}}
function mobStep(e,dt){const M=MVK[e.k];e.cd=(e.cd==null?rnd(.6,1.4):e.cd)-dt;e.cd2=(e.cd2||0)-dt;if(e.bst>0){e.bst-=dt;if(e.bst<=0){e.dm=e.dm0||e.dm;e.bst=0}}if(e.hsT>0){e.hsT-=dt;if(e.hsT<=0)e.hsd=0}
  const dx=P.x+12-(e.x+e.w/2),ad=Math.abs(dx),dy=P.y+P.h-(e.y+e.h);
  if(e.s){e.t+=dt;const mv=M.mv[e.s];if(mv)mv(e,dt,dx,ad,dy);else mvEnd(e,.5);return}
  e.pz=null;if(e.rec>0){e.rec-=dt;return}
  const ix0=e.x;M.idle(e,dt,dx,ad,dy);
  // 第二十四轮:离玩家远了也要追(原来很多小怪的待机只在 300 像素内才走过来,拉开距离就原地罚站 / 来回巡逻);潜伏中的不动
  if(!e.ug&&ad>(SEEKR[e.k]||MCHS)){const v=(SEEKV[e.k]||60)*(ad>320?1.4:1),s0=sgn(dx);if((e.x-ix0)*s0<v*dt*.5){e.x=ix0+s0*v*dt;e.f=s0||e.f}}
  if(e.cd<=0){const s=M.pick(e,dx,ad,dy);if(!s)return;if(!eskUse(e,s)){e.cd=.3;return}const at=M.at&&M.at[s];if(at!==0&&!tok(e,at==2)){e.cd=.3;eskBack(e,s);return}e.s=s;e.t=0;e.hd=0;e.hd2=0;e.pn=0;e.f=sgn(dx)||e.f;if(at!==0&&e.x+e.w>cam&&e.x<cam+VW)sfx('eatk')}}
