// ===== 沙渊古神(第五关):矿工挖穿了封印,沙海深处的古神醒了。悬浮、移动慢,一切攻击都从沙地里来 =====
// 第一阶段:① 触手破土(玩家脚下 + 两侧依次钻出,击飞)② 流沙泉涌(脚下朝玩家一路喷出沙柱,沙尘迷眼)③ 触手护体(贴身时身边两圈触手)
// 第二阶段(60%,古神睁眼):触手更多;④ 沙焰弹(扇形沙焰球)⑤ 流沙漩涡(把玩家往身边拉,身边一圈圈钻出触手,往外跑)
// 第三阶段(30%,狂暴赤红):先放大招 ⑦ 万触破沙(场地 8 格,两波各 6 格钻出触手,找安全格),之后每 16 秒一次,放完力竭 3 秒;
//   ⑥ 潜沙突袭(沉进沙里追踪玩家,连同三根触手从脚下钻出);流沙泉涌两边同时喷
function andrStep(e,dt){const hp=e.hp/e.max;
  if(!e.p2&&hp<=.6){e.p2=1;e.eyeT=0;e.q.unshift('wake')}
  if(!e.p3&&hp<=.3){e.p3=1;e.q=['storm']}
  const d=dt*(e.p3?1.3:e.p2?1.12:1);arsHz(e,dt);if(e.eyeT!=null)e.eyeT+=dt;e.stc=(e.stc||0)-dt;e.stm=e.act=='storm'?Math.min(1,e.at):Math.max(0,(e.stm||0)-dt);  // stm:万触破沙时天空变黄(bg 里画)
  const cx=e.x+e.w/2,pc=P.x+12,dx=pc-cx,ad=Math.abs(dx),cl=v=>Math.max(ARL,Math.min(ARR-e.w,v));
  if(e.dz>0){e.dz-=dt;e.pz=null;e.sa=0;return}
  e.sa=e.act=='storm'||e.act=='sink'||e.act=='wake'?1:0;
  if(!e.act){e.f=sgn(dx);const sp=ad>200?55:ad<120?-45:0;e.x=cl(e.x+e.f*sp*d);e.pz=null;e.cd-=d;
    if(e.cd<=0){let o=e.q.shift();
      if(!o){const pool=['rise','rise','gys'];if(ad<e.w/2+90)pool.push('ring','ring');if(e.p2)pool.push('orb','pull');if(e.p3){pool.push('sink','sink','gys');if(e.stc<=0)pool.push('storm')}
        o=pick(pool);if(o==e.la&&pool.length>2)o=pick(pool)}
      e.act=o;e.la=o;e.at=0;e.n=0;e.hd=0;e.sg=null}
    return}
  e.at+=d;const a=e.act,T=e.at;
  if(a=='wake'){// 60%:古神睁开眼睛,沙地震动,身边冒出一圈触手
    e.pz=T<.8?'w':null;if(!e.hd&&T>=.8){e.hd=1;shake=.4;flash('255,220,150',.3);bsfx('lz_storm',1,1.6);for(const s of [-1,1])for(const k of [1,2,3])arsTen(e,cx+s*(e.w/2+k*44),.35+k*.12,{f:s,hold:.4})}
    if(T>1.8)arsEnd(e,.6)}
  else if(a=='rise'){// ① 触手破土
    e.pz=T<.45?'w':null;
    if(!e.hd&&T>=.3){e.hd=1;const n=e.p2?5:3,c0=pc+P.vx*.3;bsfx('lz_dig',.8,1);for(let i=0;i<n;i++){const o=(i-(n-1)/2)*68;arsTen(e,Math.max(ARL+14,Math.min(ARR-14,c0+o)),.7+Math.abs(i-(n-1)/2)*.15,{up:420,f:Math.random()<.5?-1:1})}}
    if(T>1.1)arsEnd(e)}
  else if(a=='gys'){// ② 流沙泉涌
    e.pz=T<.5?'w':null;
    if(!e.hd&&T>=.4){e.hd=1;const ds=e.p3?[-1,1]:[sgn(dx)];for(const s of ds)for(let i=0;i<7;i++){const px=cx+s*(e.w/2+20+i*44);if(px<ARL+6||px>ARR-6)break;arsGys(e,px,.45+i*.12,{sd:1.2})}bsfx('lz_spray',.8)}
    if(T>1.4)arsEnd(e)}
  else if(a=='ring'){// ③ 触手护体
    e.pz=T<.3?'w':null;
    if(!e.hd&&T>=.15){e.hd=1;for(const s of [-1,1])for(const k of [0,1])arsTen(e,cx+s*(e.w/2+12+k*40),.45+k*.1,{f:s,kb:380,dm:18})}
    if(T>.9)arsEnd(e)}
  else if(a=='orb'){// ④ 沙焰弹
    e.pz=T<.5?'w':null;
    if(!e.hd&&T>=.5){e.hd=1;const n=e.p3?5:3,ox=cx+e.f*20,oy=e.y+e.h*.35,a0=Math.atan2(P.y+16-oy,pc-ox);sfx('proj');for(let i=0;i<n;i++){const q=a0+(i-(n-1)/2)*.2;F.push({x:ox,y:oy,vx:Math.cos(q)*200,vy:Math.sin(q)*200,ng:1,c:17,s:1.2,sd:1,dmg:12*e.dm})}}
    if(T>1)arsEnd(e)}
  else if(a=='pull'){// ⑤ 流沙漩涡
    e.pz=null;if(T<2.6){if(P.y+P.h>=GY-2&&Math.abs(cx-pc)>20)P.x+=sgn(cx-pc)*120*dt;
      const k=Math.floor(T/.8);if(T>=.5&&k!==e.n){e.n=k;for(const s of [-1,1])arsTen(e,cx+s*(e.w/2+16+(k%2)*36),.4,{f:s,hold:.25})}
      if(!e.hd){e.hd=1;bsfx('lz_storm',.9,2.6)}return}
    arsEnd(e)}
  else if(a=='sink'){// ⑥ 潜沙突袭
    if(!e.sg){e.sk=Math.min(1,T/.5);e.pz='w';if(T>=.5){e.sg='trk';e.ug=1;e.ux=cx;e.udir=1;e.at=0;bsfx('lz_dig',.9,1.8)}return}
    if(e.sg=='trk'){e.pz=null;const s=sgn(pc-e.ux);e.udir=s;e.ux+=s*Math.min(175*dt,Math.abs(pc-e.ux));e.ux=Math.max(ARL+40,Math.min(ARR-40,e.ux));
      if(T>1.8){e.sg='warn';e.at=0;for(const o of [-40,0,40])arsTen(e,e.ux+o,.5,{up:480,dm:20,f:o<0?-1:1})}return}
    if(T>=.5&&e.ug){e.ug=0;e.x=cl(e.ux-e.w/2);e.f=sgn(dx);shake=.35;bsfx('lz_land')}e.sk=e.ug?1:Math.max(0,1-(T-.5)/.4);if(T>1){e.sk=0;arsEnd(e)}}
  else if(a=='storm'){// ⑦ 万触破沙
    e.pz=T<1?'w':null;if(!e.hd){e.hd=1;shake=.3;flash('255,160,80',.3);bsfx('lz_storm',1,4)}
    const wave=()=>{const N=8,sw=(ARR-ARL)/N;for(const i of [...Array(N).keys()].sort(()=>Math.random()-.5).slice(0,6))for(const o of [-.22,.22])arsTen(e,ARL+(i+.5+o)*sw,1.1,{up:440,dm:18,hold:.35,f:o<0?-1:1})};
    if(T>=1&&e.n==0){e.n=1;wave()}if(T>=2.8&&e.n==1){e.n=2;wave()}
    if(T>4.8){e.stc=16;arsEnd(e,.3);e.dz=3}}}
