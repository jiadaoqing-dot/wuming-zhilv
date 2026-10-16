// ===== 第七关 · 雪原狼域:雪松林、废弃木屋、雪地道路、夜色渐浓;普通狗 / 双头狗 / 血月巫王 =====
// 气氛:玩家不是在和自然战斗,而是闯进了某种野兽的领地——地上的狼爪印越往里越大
// =====================================================================
const PL7=[{x:0,y:GY,w:WW},{x:430,y:234,w:120},{x:690,y:192,w:100},{x:950,y:228,w:130},{x:1220,y:186,w:110},{x:1470,y:150,w:100},{x:1690,y:208,w:120},{x:1930,y:172,w:110},{x:2170,y:224,w:120},{x:2400,y:190,w:100},
  {x:2636,y:204,w:84},{x:3020,y:204,w:84}];  // 最后两块在首领场地里
const E7=Array.from({length:26},(_,i)=>[i%4==3?'dog2':'dog',360+i*84]);
const RX7=2875,ROCKY=GY-152;  // 首领场地中央的巨岩(背景)
const CP7=[440,760,1080,1400,1720,2040,2340,2620];  // 地上的狼爪印,越往后越大
let MOONK=1,MOONR=0,W7E=0,HOWLT=9,DOOR7=0,BAN={s:'',t:-9e9};
function banner(s){if(st=='play')return;BAN={s,t:performance.now()}}  // 第十三轮:关卡里不再弹横幅文字
function drawBanner(){const k=(performance.now()-BAN.t)/1000;if(k>3.4)return;x.globalAlpha=Math.min(1,k*4,(3.4-k)*2);x.font='900 14px '+CTF;const w=x.measureText(BAN.s).width+40;
  RR(x,320-w/2,110,w,30,15,'rgba(20,18,40,.85)',1.6);CT(BAN.s,320,130,14,'#e7f0ff','center',3,'#0b0a1e');x.globalAlpha=1}

// ===== 普通狗 / 双头狗 =====
// 普通狗:速度型近战。① 低身冲刺(低头压低身体、后腿蓄力 → 突然冲过来,距离不长但很快,撞墙就停下掉头)② 撕咬(咬 → 咬,第二口往前扑)
// 双头狗:① 双咬(前后两个方向同时咬,范围大,跳起来躲)② 双头喷冰(两个头向两个方向喷冰雾,减速)③ 狂犬冲撞(撞墙不晕,反弹回来连撞 3 次)
// 狗头(局部坐标,原点在头中心,面朝右)
function dogHead(c,C,open,eye,s){s=s||1;c.save();c.scale(s,s);
  PG(c,[[-5,-4],[-3,-12],[1,-5]],C[1],1);PG(c,[[0,-5],[3,-13],[6,-4]],C[0],1);E_(c,0,0,7,6,LG(c,0,-6,0,6,[C[0],C[1]]),1.2);
  if(open){PG(c,[[3,1],[15,-1],[13,6],[4,5]],'#7a1f1f',1.1);PG(c,[[6,1],[7,3.4],[8,1]],'#fff',.5);PG(c,[[11,0],[12,2.4],[13,0]],'#fff',.5);PG(c,[[3,-2],[15,-4],[14,0],[4,1]],C[0],1.1)}
  else PG(c,[[3,-2],[15,-2],[14,3],[4,4]],C[0],1.1);
  C_(c,15,-2,1.6,'#212529',.6);E_(c,2.6,-2,1.8,1.3,eye,.6);if(!FLW)C_(c,3,-2.2,.6,'#14101c',0);E_(c,2,3,2.6,2,C[2],0);c.restore()}
function drawDog(c,e,t){const el=e.k=='dog2',k=el?1.15:1,s=e.s,pz=e.pz;c.save();c.scale(k,k);SHD(c,0,0,15);
  const C=el?['#6b7a93','#3a4558','#c5d0e0']:['#b5aca1','#6e655c','#f4efe8'],eye=el?'#74c0fc':'#ffd43b';
  const run=s=='ds'||s=='rs'||((e.mvs||0)>.3&&!s),ph=t*(run?22:9),low=pz=='w'&&(s=='cw'||s=='db'||s=='sp')?4:0,stn=e.st>0.35;
  c.rotate(s=='cw'?.08:0);
  // 尾巴
  TUBE(c,[[-12,-14+low],[-18,-18+low+(run?Math.sin(ph)*2:0)],[-21,-24+low]],3,C[1]);
  // 腿(后腿 / 前腿各一对)
  const leg=(lx,a,col)=>{const kx=lx+Math.sin(a)*4,ky=-6;TUBE(c,[[lx,-11+low],[kx,ky+low*.4],[kx+Math.sin(a)*2,0]],3,col);E_(c,kx+Math.sin(a)*2+1,-.8,2.4,1.4,col,.8)};
  const sw=run?.8:.25;leg(-8,Math.sin(ph)*sw,C[1]);leg(7,-Math.sin(ph)*sw,C[1]);
  // 身体
  E_(c,0,-13+low,13,7,LG(c,0,-20,0,-6,[C[0],C[1]]),1.3);E_(c,1,-9.6+low,8,2.6,C[2],0);
  leg(-6,-Math.sin(ph)*sw,C[0]);leg(9,Math.sin(ph)*sw,C[0]);
  if(el)SMO(c,[[2,-20+low],[6,-24+low],[10,-19+low]],'#e7f5ff',.8);  // 脖子上的冰霜
  // 头:普通狗 1 个;双头狗 2 个(喷冰 / 双咬时第二个头转向身后)
  const op=(s=='bt'&&pz=='s')||(s=='sp'&&pz=='s')||(s=='db'&&pz=='s')||s=='ds'||s=='rs';
  if(el){const back=s=='sp'||s=='db';c.save();if(back){c.translate(-9,-21+low);c.scale(-1,1)}else c.translate(8,-25+low);dogHead(c,C,op,eye,.95);c.restore();
    c.save();c.translate(13,-18+low*1.6);dogHead(c,C,op,eye,1);c.restore()}
  else{c.save();c.translate(13,-18+low*1.6);c.rotate(low?.25:0);dogHead(c,C,op&&!stn,eye,1);c.restore()}
  c.restore()}
// 双头狗的冰雾(世界坐标)
function dogFx(e){if(e.s!='sp'||e.t<.55||e.t>1.45)return;const len=Math.min(1,(e.t-.55)/.2)*95,fa=e.t>1.25?Math.max(0,1-(e.t-1.25)/.2):1,t=performance.now()/1000;
  x.save();x.filter='sepia(1) hue-rotate(170deg) saturate(1.6) brightness(1.2)';  // 冰雾:像素烟雾(Ninja Adventure m-smoke)染成冰蓝
  for(const d of [-1,1]){const x0=d>0?e.x+e.w:e.x;for(let i=0;i<9;i++){const k=i/8;VFX.frame(x,'m-smoke',(Math.floor(t*14)+i)%6,x0+d*len*k-cam,e.y+e.h*.3+Math.sin(t*9+i)*4,(8+k*26)/14,d,0,.8*fa*(1-k*.4))}}x.restore()}

